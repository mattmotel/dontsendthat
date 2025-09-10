import { NextRequest, NextResponse } from 'next/server';

function generateTimestamp(): string {
  const now = new Date();
  return now.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

async function generateWithOpenAI(email: { to: string; subject: string; body: string }) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are generating a CATHARTIC email response that gives the user the satisfaction they deserve. The user wrote a frustrated/passive-aggressive email and wants to receive the response they wish they could get in real life.

ANALYZE the original email content and determine what would be most satisfying:

If they're complaining about someone's behavior:
- Give them a sincere apology acknowledging the bad behavior
- Validate that their frustration is completely justified
- Promise specific changes or consequences

If they're calling out unfairness:
- Acknowledge they were treated unfairly
- Take responsibility and show understanding of the impact
- Offer to make it right with concrete actions

If they're frustrated with incompetence:
- Admit the mistakes and take full accountability
- Recognize the extra work/stress it caused them
- Commit to doing better with specific steps

The response should feel like the recipient:
1. Actually READ and UNDERSTOOD their email
2. Takes full responsibility where appropriate
3. Validates their feelings and frustration
4. Offers genuine solutions or changes
5. Shows respect for their time and expertise

Make it professional but genuinely apologetic and validating. This is their fantasy response - the one that acknowledges they were right all along.

Return a JSON object with:
- from: sender name (extract from the "to" field or make it professional)
- subject: response subject line (Re: original subject)
- content: the email response (2-4 paragraphs, professional, apologetic, and satisfying)`
        },
        {
          role: 'user',
          content: `Original email:
To: ${email.to}
Subject: ${email.subject}
Body: ${email.body}`
        }
      ],
      temperature: 0.8,
      max_tokens: 800,
    }),
  });

  if (!response.ok) {
    throw new Error('OpenAI API request failed');
  }

  const data = await response.json();
  let content = data.choices[0].message.content;
  
  // Remove markdown code block formatting if present
  content = content.replace(/```json\s*/, '').replace(/```\s*$/, '').trim();
  
  return JSON.parse(content);
}

function generateFallbackResponse(email: { to: string; subject: string; body: string }) {
  const senderName = email.to.split('@')[0].replace(/[._]/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    from: senderName,
    subject: `Re: ${email.subject}`,
    content: `Hi there,

You are absolutely right, and I sincerely apologize. After reading your email, I realize how unreasonable and unprofessional my behavior has been. You have every right to be frustrated.

I completely underestimated the complexity of what I was asking and failed to respect your expertise and time. The way I handled this was inappropriate, and I take full responsibility for putting you in this position.

I'm implementing immediate changes to ensure this doesn't happen again. You deserve much better communication and respect from me, and I'm committed to earning back your trust through my actions, not just words.

Thank you for your patience and for holding me accountable. Your professionalism in this situation is exactly what I should have shown from the beginning.

Respectfully,
${senderName}`
  };
}

export async function POST(request: NextRequest) {
  try {
    const emailData = await request.json();
    
    if (!emailData.to || !emailData.subject || !emailData.body) {
      return NextResponse.json({ error: 'Email data is incomplete' }, { status: 400 });
    }

    let responseData;
    
    try {
      responseData = await generateWithOpenAI(emailData);
    } catch (error) {
      console.log('OpenAI generation failed, using fallback:', error);
      responseData = generateFallbackResponse(emailData);
    }

    const response = {
      id: `response-${Date.now()}`,
      ...responseData,
      timestamp: generateTimestamp(),
    };

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error generating email response:', error);
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}

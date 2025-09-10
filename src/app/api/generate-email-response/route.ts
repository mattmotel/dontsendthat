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
          content: `You are generating a satisfying email response. The user wrote an email (likely passive-aggressive or frustrated) and wants to receive a cathartic response that either:

1. Validates their frustration with a supportive response
2. Gives them the satisfying pushback/acknowledgment they wished they could get
3. Provides the apology or recognition they deserve

The response should feel realistic but emotionally satisfying. Make it seem like it's from the original recipient.

Return a JSON object with:
- from: sender name (extract from the "to" field or make appropriate)
- subject: response subject line (Re: original subject)
- content: the email response content (2-4 paragraphs, professional but satisfying)

The tone should match what would be most cathartic given the original email's content.`
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
  return JSON.parse(data.choices[0].message.content);
}

function generateFallbackResponse(email: { to: string; subject: string; body: string }) {
  const senderName = email.to.split('@')[0].replace(/[._]/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    from: senderName,
    subject: `Re: ${email.subject}`,
    content: `Dear Colleague,

You're absolutely right, and I owe you an apology. After reflecting on your email, I realize I was completely out of line with my previous request/behavior.

I should have been more considerate of your time and workload. Your points are valid, and I appreciate you taking the time to address this directly rather than letting it fester.

Moving forward, I'll be much more mindful and respectful of boundaries. Thank you for your patience and professionalism in handling this situation.

Best regards,
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

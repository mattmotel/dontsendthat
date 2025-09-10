import { NextRequest, NextResponse } from 'next/server';

const FAKE_NAMES = [
  'Brad Thompson', 'Sarah Mitchell', 'Mike Rodriguez', 'Jessica Chen', 
  'David Park', 'Amanda Wilson', 'Chris Johnson', 'Lisa Garcia',
  'Ryan O\'Connor', 'Michelle Davis', 'Kevin Lee', 'Rachel Brown'
];

const PROFILE_PICS = [
  '👨‍💼', '👩‍💼', '👨‍🎓', '👩‍🎓', '👨‍💻', '👩‍💻',
  '👨‍🔬', '👩‍🔬', '👨‍🎨', '👩‍🎨', '👨‍🏫', '👩‍🏫'
];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateTimestamp(): string {
  const minutes = Math.floor(Math.random() * 60) + 1;
  return `${minutes}m`;
}

async function generateWithOpenAI(post: string) {
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
          content: `You are generating 10 LinkedIn-style comments that are CATHARTIC and SATISFYING responses to a post. The user wrote this post to vent frustration, so give them the validation and support they deserve.

IMPORTANT: Analyze the post content and respond specifically to what they're complaining about. If they're frustrated with:
- Bad managers: Comments should validate how terrible that manager sounds
- Toxic coworkers: Agree they're awful and unprofessional  
- Unreasonable clients: Sympathize and share similar horror stories
- Corporate BS: Call out the hypocrisy and fake culture
- Thought leaders: Mock their empty platitudes and buzzwords
- Hustle culture: Point out how toxic and unsustainable it is

Make the comments feel like a supportive community that "gets it" and is on their side. Include:
- 3-4 very supportive "you're absolutely right" comments
- 3-4 comments that add similar experiences or stories
- 2-3 comments that cleverly roast/critique the subject of their frustration

Each comment should be 1-2 sentences, sound like real LinkedIn professionals, and be SPECIFICALLY relevant to their post content.

Return ONLY a JSON array of exactly 10 comment strings. No other text.`
        },
        {
          role: 'user',
          content: post
        }
      ],
      temperature: 0.9,
      max_tokens: 1000,
    }),
  });

  if (!response.ok) {
    throw new Error('OpenAI API request failed');
  }

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}

async function generateFallbackComments(): Promise<string[]> {
  // Cathartic fallback comments when OpenAI is not available
  const templates = [
    "FINALLY someone with the courage to say what we're all thinking!",
    "This is exactly the kind of toxic behavior that needs to be called out.",
    "You handled this with way more professionalism than they deserved.",
    "I've dealt with the exact same BS. You're absolutely in the right here.",
    "The audacity of some people never ceases to amaze me. You're spot on.",
    "This perfectly captures everything wrong with corporate culture today.",
    "Thank you for not sugar-coating this. Someone needed to say it.",
    "I'm so tired of people like this getting away with this behavior.",
    "You showed incredible restraint. I would have lost it completely.",
    "This is why I have trust issues with management. Solidarity! 🤝"
  ];
  
  return templates.slice(0, 10);
}

export async function POST(request: NextRequest) {
  try {
    const { post } = await request.json();
    
    if (!post) {
      return NextResponse.json({ error: 'Post content is required' }, { status: 400 });
    }

    let commentTexts: string[];
    
    try {
      commentTexts = await generateWithOpenAI(post);
    } catch (error) {
      console.log('OpenAI generation failed, using fallbacks:', error);
      commentTexts = await generateFallbackComments();
    }

    const comments = commentTexts.map((content, index) => ({
      id: `comment-${Date.now()}-${index}`,
      author: getRandomElement(FAKE_NAMES),
      content,
      timestamp: generateTimestamp(),
      profilePic: getRandomElement(PROFILE_PICS),
    }));

    return NextResponse.json({ comments });
  } catch (error) {
    console.error('Error generating comments:', error);
    return NextResponse.json({ error: 'Failed to generate comments' }, { status: 500 });
  }
}

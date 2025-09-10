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
          content: `You are generating 10 LinkedIn-style comments in response to a post. The comments should be cathartic and satisfying responses that validate the user's frustration or call out problematic behavior. Mix supportive comments with ones that cleverly roast or critique the original post's subject. Make them feel realistic but satisfying.

Return ONLY a JSON array of exactly 10 comment strings. No other text. Each comment should be 1-3 sentences max and sound like different LinkedIn users responding.`
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
  // Fallback comments when OpenAI is not available
  const templates = [
    "Finally someone said it! 🙌",
    "This is exactly why I love LinkedIn - real talk like this.",
    "Preach! More people need to hear this.",
    "You're absolutely right. I've seen this so many times.",
    "This deserves way more visibility. Sharing!",
    "Thank you for calling this out. It needed to be said.",
    "100% agree. The hypocrisy is real.",
    "This is the kind of honest content we need more of.",
    "Facts! I'm tired of people pretending this isn't an issue.",
    "You just articulated what so many of us were thinking."
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

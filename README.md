# Don't Send That 🚫📧

A cathartic app that lets you write passive-aggressive LinkedIn posts and emails, then gives you satisfying AI-generated responses without actually sending anything. Perfect for venting frustration in a safe space!

## What it does

- **LinkedIn Tab**: Write that thought-leadership post you've been holding back, get 10 validating comments from AI
- **Gmail Tab**: Draft that passive-aggressive email to your annoying coworker, get a satisfying response

## Features

- 🎭 **Fake LinkedIn interface** - Write posts and get supportive/roasting comments
- 📧 **Fake Gmail interface** - Compose emails and receive cathartic responses  
- 🤖 **AI-powered responses** - Uses OpenAI to generate satisfying feedback
- 🎨 **Smooth animations** - Comments and responses appear with nice transitions
- 🔒 **Local only** - Nothing is stored or sent anywhere (that's the whole point!)
- ⚡ **No persistence** - Refresh to clear everything, like it never happened

## Setup

1. Clone and install dependencies:
   ```bash
   npm install
   ```

2. (Optional) Add your OpenAI API key for better responses:
   ```bash
   cp env.example .env.local
   # Edit .env.local with your OpenAI API key
   ```
   
   Without an API key, the app will use fallback responses that are still satisfying!

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) and start venting!

## How to use

### LinkedIn Mode
1. Write that passive-aggressive post about thought leaders, hustle culture, or whatever's annoying you
2. Click "Post" 
3. Watch as 10 fake LinkedIn users validate your frustration with satisfying comments
4. Feel better without actually posting to LinkedIn

### Gmail Mode  
1. Compose that email you've been drafting in your head for weeks
2. Address it to that annoying person
3. Click "Send"
4. Receive a satisfying response that gives you the validation/apology you deserve
5. Feel cathartic without burning any bridges

## Tech Stack

- Next.js 15 with TypeScript
- Tailwind CSS for styling
- OpenAI API for generating responses
- Local storage only (nothing persisted)

## The Point

Sometimes you need to write that email or post to get it out of your system, but you know you shouldn't actually send it. This app gives you that cathartic release with satisfying AI responses, without any real-world consequences.

**Remember: Nothing you write here is stored or sent anywhere. It's just for you to feel better!**
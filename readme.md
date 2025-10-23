# CatGPT

A free chat application with playful cat personalities. No API keys required! Features a distinct cat-noir theming and a fun "Meow-Only Mode" that translates all responses to cat language.

![CatGPT Screenshot](./screenshot.png)

## Features

- **No API Keys Required**: Uses local cat agent with multiple personalities
- **Cat Personalities**: Choose from Lazy, Sassy, Helpful, Chaotic, Philosopher, or Meow-Only modes
- **Streaming Chat Interface**: Real-time streaming responses
- **Meow-Only Mode**: Transforms all responses into cat language (meow, purr, mrrr)
- **Local Chat History**: Conversations stored in browser localStorage (up to 50 chats)
- **Markdown Rendering**: Full markdown support with syntax highlighting for code blocks
- **Dark Cat-Noir Theme**: Beautiful dark theme with warm grays and amber accents
- **Accessibility**: Keyboard navigation, focus rings, proper ARIA labels
- **Purr Sound**: Optional purr sound effect on message completion
- **Message Controls**: Copy, delete, and regenerate messages
- **Chat Management**: Create, rename, delete, and organize conversations
- **Responsive Design**: Collapsible sidebar and mobile-friendly layout

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Runtime**: Edge runtime for API routes
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Icons**: lucide-react
- **Cat Agent**: Local personality-based responses (no external APIs!)
- **Markdown**: react-markdown, remark-gfm, rehype-highlight
- **Virtualization**: @tanstack/react-virtual

## Prerequisites

- Node.js 18.0 or higher
- npm or yarn package manager
- No API keys needed!

## Quick Start

### 1. Clone the repository

\`\`\`bash
git clone https://github.com/yourusername/catgpt.git
cd catgpt
\`\`\`

### 2. Install dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Run the development server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

No API keys needed - just install and run!

## Build for Production

\`\`\`bash
# Type check
npm run typecheck

# Run tests
npm test

# Build the application
npm run build

# Start production server
npm start
\`\`\`

## Deploy to Vercel

### Method 1: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

No API keys needed!

### Method 2: Using Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project" and import your repository
4. Click "Deploy"

That's it! No environment variables or API keys required.
## Usage

### Basic Chat

1. Type your message in the composer at the bottom
2. Press Enter to send (Shift+Enter for newline)
3. Get responses from your chosen cat personality
4. Use message controls to copy, delete, or regenerate responses

### Cat Personalities

Choose your favorite cat personality in Settings:
- **Lazy Cat**: Will tell you to do it yourself
- **Sassy Cat**: Attitude included, help not guaranteed
- **Helpful Cat**: Tries to help... in a cat way
- **Chaotic Cat**: 3 AM energy, questionable advice
- **Philosopher Cat**: Deep thoughts, zero solutions
- **Meow Only**: Pure concentrated meows

### Meow-Only Mode

1. Toggle "Meow-Only Mode" in the header
2. All responses will be translated to cat language
3. Perfect for when you want to add some whimsy to your conversations!

### Chat Management

- **New Chat**: Click the "New Chat" button in the sidebar
- **Switch Chats**: Click any conversation in the sidebar
- **Rename Chat**: Hover over a chat and click the edit icon
- **Delete Chat**: Hover over a chat and click the trash icon
- **Clear All**: Click "Clear All Chats" at the bottom of the sidebar

### Settings

1. Click the settings icon in the header
2. Configure:
   - Cat personality (Lazy, Sassy, Helpful, Chaotic, Philosopher, Meow-Only)
   - Purr sound on message completion
   - Compact mode for messages
   - Default meow-only mode

## Testing

Run the test suite:

\`\`\`bash
npm test
\`\`\`

Run type checking:

\`\`\`bash
npm run typecheck
\`\`\`

## Customization

### Theme Colors

Edit \`app/globals.css\` to customize the color scheme:

\`\`\`css
:root {
  --background: 220 15% 8%;        /* Dark background */
  --foreground: 40 10% 92%;        /* Light text */
  --accent: 38 92% 50%;            /* Amber accent (#F59E0B) */
  /* ... more variables ... */
}
\`\`\`

### Adding New Cat Personalities

Edit \`lib/cat-agent.ts\` to add custom cat responses and personalities!

## Project Structure

```
catgpt/
   app/
      api/
         chat/
             route.ts          # Edge API route for streaming
      settings/
         page.tsx              # Settings page
      layout.tsx                # Root layout
      page.tsx                  # Main chat page
      globals.css               # Global styles
   components/
      chat/
         Message.tsx           # Message component with markdown
         MessageList.tsx       # Virtualized message list
         Composer.tsx          # Message input composer
      sidebar/
         Sidebar.tsx           # Chat sidebar
      ui/                       # shadcn/ui components
      Header.tsx                # App header with cat logo
   lib/
      types.ts                  # TypeScript types
      utils.ts                  # Utility functions
      cat-agent.ts              # Local cat agent (no API!)
      meowifier.ts              # Meowifier logic
      storage.ts                # localStorage helpers
      purr.ts                   # Purr sound utility
   public/
      cat-logo.svg              # Custom cat logo
```
## Security

- No API keys needed - all responses generated locally
- Rate limiting implemented (10 requests per 10 seconds per IP)
- All cat responses are pre-defined and safe
- Proper CORS and CSP headers via Vercel Edge runtime
## Troubleshooting

### Messages not saving

Check browser console for localStorage errors. Some browsers limit localStorage in private mode.

### Build errors

Run `npm run typecheck` to identify TypeScript errors before building.

### Cat not responding

Check the browser console for error messages. Make sure you're on the latest version.
## License

MIT License - feel free to use this project for personal or commercial purposes.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- No external AI APIs - fully self-contained!

---

Meow! Enjoy using CatGPT - no API keys, just cats!

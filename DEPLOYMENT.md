# CatGPT Deployment Guide

CatGPT now uses a local cat agent - no API keys required!

## Complete File Tree

```
CatGPT/
├── .env.example                 # Example environment variables
├── .env.local                   # Your local environment (optional)
├── .eslintrc.json              # ESLint configuration
├── .gitignore                  # Git ignore rules
├── .prettierrc                 # Prettier code formatting config
├── README.md                   # Main documentation
├── DEPLOYMENT.md               # This file
├── components.json             # shadcn/ui configuration
├── next.config.js              # Next.js configuration
├── package.json                # Dependencies and scripts
├── postcss.config.js           # PostCSS configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── vitest.config.ts            # Vitest test configuration
│
├── app/
│   ├── layout.tsx              # Root layout with metadata
│   ├── page.tsx                # Main chat page with state management
│   ├── globals.css             # Global styles with cat-noir theme
│   ├── api/
│   │   └── chat/
│   │       └── route.ts        # Edge API route for streaming
│   └── settings/
│       └── page.tsx            # Settings page
│
├── components/
│   ├── Header.tsx              # App header with model selector
│   ├── chat/
│   │   ├── Message.tsx         # Message component with markdown
│   │   ├── MessageList.tsx     # Virtualized message list
│   │   └── Composer.tsx        # Message input composer
│   ├── sidebar/
│   │   └── Sidebar.tsx         # Chat history sidebar
│   └── ui/                     # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       ├── dropdown-menu.tsx
│       ├── scroll-area.tsx
│       ├── sheet.tsx
│       ├── switch.tsx
│       ├── textarea.tsx
│       └── tooltip.tsx
│
├── lib/
│   ├── types.ts                # TypeScript type definitions
│   ├── utils.ts                # Utility functions (cn helper)
│   ├── cat-agent.ts            # Local cat agent (no API needed!)
│   ├── meowifier.ts            # Meowifier transformation logic
│   ├── meowifier.test.ts       # Meowifier unit tests
│   ├── storage.ts              # localStorage helpers
│   └── purr.ts                 # Purr sound utility
│
└── public/
    └── .gitkeep                # Keeps public directory in git
```

## Vercel Deployment Commands

### Quick Deploy (Recommended)

\`\`\`bash
# 1. Install Vercel CLI globally
npm i -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy to Vercel (this creates a preview deployment)
vercel

# 4. (Optional) Set app name
vercel env add NEXT_PUBLIC_APP_NAME production
# When prompted, enter: CatGPT

# 5. Deploy to production
vercel --prod
\`\`\`

No API keys needed - the app uses a local cat agent!

### Environment Variables (Optional)

Only needed if you want to customize the app name:

\`\`\`bash
# Set app name for all environments (optional)
vercel env add NEXT_PUBLIC_APP_NAME production
vercel env add NEXT_PUBLIC_APP_NAME preview
vercel env add NEXT_PUBLIC_APP_NAME development
\`\`\`

## GitHub + Vercel Dashboard Deployment

1. **Push to GitHub**
   \`\`\`bash
   git init
   git add .
   git commit -m "Initial commit: CatGPT application"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   \`\`\`

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure:
     - Framework Preset: Next.js
     - Root Directory: ./
     - Build Command: `npm run build`
     - Output Directory: .next

3. **Add Environment Variables (Optional)**
   - In Vercel dashboard, go to Settings → Environment Variables
   - Add (optional):
     - `NEXT_PUBLIC_APP_NAME` = CatGPT

4. **Deploy**
   - Click "Deploy"
   - Your app will be live at: `https://your-project-name.vercel.app`
   - No API keys needed!

## Local Development Setup

\`\`\`bash
# 1. Clone the repository
git clone YOUR_REPO_URL
cd CatGPT

# 2. Install dependencies
npm install

# 3. Create .env.local file (optional)
cp .env.example .env.local

# 4. Run development server (no API key needed!)
npm run dev

# 5. Open in browser
# Visit: http://localhost:3000
\`\`\`

## Build & Test Commands

\`\`\`bash
# Type checking
npm run typecheck

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format

# Build for production
npm run build

# Start production server locally
npm start
\`\`\`

## No API Keys Needed!

CatGPT uses a local cat agent with different personalities:
- Lazy Cat: Tells you to do it yourself
- Sassy Cat: Attitude included
- Helpful Cat: Tries to help in a cat way
- Chaotic Cat: 3 AM energy
- Philosopher Cat: Deep thoughts, zero solutions
- Meow Only: Pure cat language

## Troubleshooting

### TypeScript errors
\`\`\`bash
npm run typecheck
\`\`\`

### Port 3000 already in use
\`\`\`bash
# Use a different port
PORT=3001 npm run dev
\`\`\`

### Clear Next.js cache
\`\`\`bash
rm -rf .next
npm run build
\`\`\`

## Post-Deployment Checklist

- [ ] Build completes successfully
- [ ] Homepage loads and shows chat interface
- [ ] Can send a message and get cat responses
- [ ] Meow-Only Mode toggle works
- [ ] Settings page is accessible
- [ ] Cat personality selector works
- [ ] Sidebar shows conversations
- [ ] Message controls (copy, delete, regenerate) work
- [ ] Code highlighting works in messages
- [ ] Responsive design works on mobile
- [ ] PWA manifest (if added) works

## Performance Tips

1. **Edge Runtime**: The chat API route uses Edge runtime for faster responses
2. **Streaming**: Responses stream in real-time for better UX
3. **Virtualization**: Message list uses virtual scrolling for performance
4. **Local Storage**: Chat history is stored locally, no database needed
5. **Code Splitting**: Next.js automatically splits code for optimal loading

## Security Notes

- No API keys needed - all responses are generated locally
- Rate limiting is implemented (10 requests per 10 seconds per IP)
- Edge runtime provides built-in security features
- All cat responses are pre-defined and safe

## Analytics (Optional)

To add Vercel Analytics:

\`\`\`bash
npm i @vercel/analytics

# Add to app/layout.tsx:
# import { Analytics } from '@vercel/analytics/react'
# <Analytics />
\`\`\`

## Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Follow Vercel's DNS configuration instructions
4. Wait for SSL certificate to be issued (automatic)

## Monitoring

View logs in Vercel Dashboard:
- Functions → Select your API route → View Logs
- Monitor response times and errors
- Set up log drains for production monitoring

---

Your CatGPT deployment is complete! No API keys, just meows!

For issues or questions, refer to the main [README.md](./README.md)

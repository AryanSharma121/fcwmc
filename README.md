# CBT Practice — Quiz App (Fixed Version)

This is a minimal Next.js + Tailwind quiz application.

## Quick start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run development server:
   ```bash
   npm run dev
   ```

3. Open `http://localhost:3000` and click **Start Quiz**.

## Add questions

Edit `public/questions.json` to add or change questions.

- `mcq` items:
```json
{
  "type": "mcq",
  "question": "Question text",
  "options": ["a","b","c","d"],
  "answer": 0
}
```

- `passage` items:
```json
{
  "type": "passage",
  "passage": "Long passage text...",
  "questions": [ ... array of mcq objects ... ]
}
```

## Deploy

1. Push this repo to GitHub.
2. Import on Vercel and deploy (automatic for Next.js).

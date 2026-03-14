// Vercel API route for quote of the day
import quotes from '../quotes.json' with { type: 'json' };

export default function handler(req, res) {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  const quoteIndex = dayOfYear % quotes.length;
  const quote = quotes[quoteIndex];

  res.status(200).json({
    quote: quote.q,
    author: quote.a,
    category: quote.c || 'motivation',
    date: today.toISOString().split('T')[0]
  });
}

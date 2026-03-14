// Vercel API route for random quotes
import quotes from '../../quotes.json' with { type: 'json' };

export default function handler(req, res) {
  const { category } = req.query;
  
  let filteredQuotes = quotes;
  
  if (category) {
    filteredQuotes = quotes.filter(q => 
      (q.c || '').toLowerCase() === category.toLowerCase()
    );
  }
  
  if (filteredQuotes.length === 0) {
    filteredQuotes = quotes;
  }
  
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];

  res.status(200).json({
    quote: quote.q,
    author: quote.a,
    category: quote.c || 'motivation'
  });
}

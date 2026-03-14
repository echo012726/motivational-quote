// Vercel API route for all quotes with pagination
import quotes from '../../quotes.json' with { type: 'json' };

export default function handler(req, res) {
  const { page = 1, limit = 50 } = req.query;
  
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = startIndex + limitNum;
  
  const paginatedQuotes = quotes
    .slice(startIndex, endIndex)
    .map(q => ({
      quote: q.q,
      author: q.a,
      category: q.c || 'motivation'
    }));

  res.status(200).json({
    total: quotes.length,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(quotes.length / limitNum),
    quotes: paginatedQuotes
  });
}

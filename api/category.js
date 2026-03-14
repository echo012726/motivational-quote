// Vercal API route for quotes by category
import quotes from '../../quotes.json' with { type: 'json' };

export default function handler(req, res) {
  const { category } = req.query;
  
  if (!category) {
    return res.status(400).json({ error: 'Category parameter required' });
  }
  
  const filteredQuotes = quotes
    .filter(q => (q.c || '').toLowerCase() === category.toLowerCase())
    .map(q => ({
      quote: q.q,
      author: q.a,
      category: q.c || 'motivation'
    }));

  if (filteredQuotes.length === 0) {
    return res.status(404).json({ 
      error: 'No quotes found for category',
      availableCategories: [...new Set(quotes.map(q => q.c).filter(Boolean))]
    });
  }

  res.status(200).json({
    category: category.toLowerCase(),
    count: filteredQuotes.length,
    quotes: filteredQuotes
  });
}

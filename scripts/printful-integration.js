// Printful Integration for motivational-quote.org
// This connects the POD button to Printful's API for real product generation

const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY; // Add to Vercel env vars
const STORE_ID = process.env.PRINTFUL_STORE_ID;

// Product configuration for quote posters
const POSTER_PRODUCTS = {
  small: {
    variant_id: 1, // 8x10" - you need to get actual Printful variant IDs
    price: 15.00,
    name: "8x10 Premium Matte Poster"
  },
  medium: {
    variant_id: 2, // 18x24"
    price: 25.00,
    name: "18x24 Premium Matte Poster"
  },
  large: {
    variant_id: 3, // 24x36"
    price: 35.00,
    name: "24x36 Premium Matte Poster"
  }
};

// Generate checkout URL with quote image
export async function createPosterCheckout(quoteText, author, size, callbackUrl) {
  if (!PRINTFUL_API_KEY) {
    // Return mock checkout for demo
    return {
      checkout_url: `https://printful.com/demo-checkout?quote=${encodeURIComponent(quoteText)}&author=${encodeURIComponent(author)}&size=${size}`,
      mock: true
    };
  }

  // Create sync product with custom quote design
  const response = await fetch('https://api.printful.com/sync/products', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      sync_product: {
        name: `Quote Poster: "${quoteText.substring(0, 30)}..."`,
        variants: [
          {
            retail_price: POSTER_PRODUCTS[size].price,
            size: size,
            // In production, you'd generate the image first and use its Printful file ID
          }
        ]
      }
    })
  });

  const data = await response.json();
  
  // Return checkout URL
  return {
    checkout_url: `https://printful.com/checkout/${data.result?.sync_variant?.id}`,
    product_id: data.result?.sync_product?.id,
    mock: false
  };
}

export { POSTER_PRODUCTS };

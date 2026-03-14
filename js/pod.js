/**
 * Print-on-Demand Integration
 * Allows users to order prints of their favorite quotes on merchandise
 * Integrates with Printful API for fulfillment
 */

const POD_CONFIG = {
  // Printful store API key (would be environment variable in production)
  apiKey: 'YOUR_PRINTFUL_API_KEY',
  baseUrl: 'https://api.printful.com',
  storeId: 'YOUR_STORE_ID',
  
  // Product catalog with prices
  products: {
    'poster-8x10': {
      name: '8x10 Print',
      price: 14.99,
      description: 'High-quality matte print',
      variantId: 1
    },
    'poster-11x14': {
      name: '11x14 Print',
      price: 19.99,
      description: 'High-quality matte print',
      variantId: 2
    },
    'poster-16x20': {
      name: '16x20 Print',
      price: 29.99,
      description: 'High-quality matte print',
      variantId: 3
    },
    'canvas-small': {
      name: 'Small Canvas (8x10)',
      price: 39.99,
      description: 'Gallery-wrapped canvas',
      variantId: 4
    },
    'canvas-medium': {
      name: 'Medium Canvas (16x20)',
      price: 79.99,
      description: 'Gallery-wrapped canvas',
      variantId: 5
    },
    'mug-white': {
      name: 'White Mug',
      price: 12.99,
      description: '11oz ceramic mug',
      variantId: 6
    },
    'mug-color': {
      name: 'Color-Change Mug',
      price: 14.99,
      description: '11oz color-changing ceramic mug',
      variantId: 7
    },
    'tshirt-s': {
      name: 'T-Shirt (S)',
      price: 24.99,
      description: 'Premium cotton t-shirt',
      variantId: 8
    },
    'tshirt-m': {
      name: 'T-Shirt (M)',
      price: 24.99,
      description: 'Premium cotton t-shirt',
      variantId: 9
    },
    'tshirt-l': {
      name: 'T-Shirt (L)',
      price: 24.99,
      description: 'Premium cotton t-shirt',
      variantId: 10
    },
    'tshirt-xl': {
      name: 'T-Shirt (XL)',
      price: 24.99,
      description: 'Premium cotton t-shirt',
      variantId: 11
    }
  }
};

/**
 * Generate quote image for POD
 * Creates a high-resolution image suitable for printing
 */
function generatePODImage(quote, author) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // High resolution for print (300 DPI equivalent)
  canvas.width = 2400;
  canvas.height = 3000;
  
  // Background
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, '#1a1a2e');
  gradient.addColorStop(1, '#16213e');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Decorative border
  ctx.strokeStyle = '#e94560';
  ctx.lineWidth = 20;
  ctx.strokeRect(60, 60, canvas.width - 120, canvas.height - 120);
  
  // Quote text
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Split quote into lines that fit
  const maxWidth = canvas.width - 300;
  const fontSize = 72;
  ctx.font = `italic ${fontSize}px Georgia, serif`;
  
  const words = quote.split(' ');
  const lines = [];
  let currentLine = '';
  
  words.forEach(word => {
    const testLine = currentLine + (currentLine ? ' ' : '') + word;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  });
  if (currentLine) lines.push(currentLine);
  
  // Draw quote lines centered
  const lineHeight = fontSize * 1.4;
  const totalHeight = lines.length * lineHeight;
  let y = (canvas.height - totalHeight) / 2 - 100;
  
  lines.forEach(line => {
    ctx.fillText(line, canvas.width / 2, y);
    y += lineHeight;
  });
  
  // Author
  ctx.font = `36px Arial, sans-serif`;
  ctx.fillStyle = '#e94560';
  ctx.fillText(`— ${author}`, canvas.width / 2, y + 80);
  
  // Watermark
  ctx.font = '24px Arial, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.fillText('motivational-quote.com', canvas.width / 2, canvas.height - 100);
  
  return canvas.toDataURL('image/png');
}

/**
 * Create Printful order
 */
async function createPODOrder(quote, author, productId, customer) {
  const product = POD_CONFIG.products[productId];
  if (!product) {
    throw new Error('Invalid product selection');
  }
  
  const imageData = generatePODImage(quote, author);
  
  // In production, this would upload to Printful and create the order
  // For demo, we simulate the order
  const order = {
    id: 'ORD-' + Date.now(),
    quote: quote,
    author: author,
    product: product,
    customer: customer,
    status: 'pending',
    createdAt: new Date().toISOString(),
    imageUrl: imageData
  };
  
  // Store order locally for demo
  const orders = JSON.parse(localStorage.getItem('pod_orders') || '[]');
  orders.push(order);
  localStorage.setItem('pod_orders', JSON.stringify(orders));
  
  return order;
}

/**
 * Render POD widget
 */
function renderPODWidget(quote, author) {
  const widget = document.createElement('div');
  widget.id = 'pod-widget';
  widget.className = 'pod-widget';
  widget.innerHTML = `
    <style>
      .pod-widget {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
      }
      .pod-button {
        background: linear-gradient(135deg, #e94560, #0f3460);
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 30px;
        cursor: pointer;
        font-size: 14px;
        font-weight: bold;
        box-shadow: 0 4px 15px rgba(233, 69, 96, 0.4);
        transition: transform 0.3s, box-shadow 0.3s;
      }
      .pod-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(233, 69, 96, 0.6);
      }
      .pod-modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        z-index: 1001;
        justify-content: center;
        align-items: center;
      }
      .pod-modal.active {
        display: flex;
      }
      .pod-modal-content {
        background: white;
        border-radius: 16px;
        padding: 30px;
        max-width: 500px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        color: #333;
      }
      .pod-products {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        gap: 15px;
        margin: 20px 0;
      }
      .pod-product {
        border: 2px solid #eee;
        border-radius: 12px;
        padding: 15px;
        text-align: center;
        cursor: pointer;
        transition: border-color 0.3s, transform 0.2s;
      }
      .pod-product:hover {
        border-color: #e94560;
        transform: translateY(-3px);
      }
      .pod-product.selected {
        border-color: #e94560;
        background: rgba(233, 69, 96, 0.1);
      }
      .pod-product-name {
        font-weight: bold;
        font-size: 14px;
        margin-bottom: 5px;
      }
      .pod-product-price {
        color: #e94560;
        font-weight: bold;
      }
      .pod-product-desc {
        font-size: 11px;
        color: #666;
        margin-top: 5px;
      }
      .pod-preview {
        width: 100%;
        height: 150px;
        object-fit: contain;
        margin: 15px 0;
        border-radius: 8px;
        background: #f5f5f5;
      }
      .pod-form {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-top: 20px;
      }
      .pod-form input {
        padding: 12px;
        border: 2px solid #eee;
        border-radius: 8px;
        font-size: 14px;
      }
      .pod-form input:focus {
        outline: none;
        border-color: #e94560;
      }
      .pod-submit {
        background: #e94560;
        color: white;
        border: none;
        padding: 14px;
        border-radius: 8px;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        transition: background 0.3s;
      }
      .pod-submit:hover {
        background: #d63850;
      }
      .pod-close {
        position: absolute;
        top: 15px;
        right: 20px;
        font-size: 28px;
        cursor: pointer;
        color: #666;
      }
      .pod-success {
        text-align: center;
        padding: 40px;
      }
      .pod-success h3 {
        color: #4CAF50;
        font-size: 24px;
      }
      .pod-success p {
        color: #666;
        margin: 10px 0;
      }
    </style>
    
    <button class="pod-button" onclick="openPODModal()">
      🛒 Order Print
    </button>
    
    <div class="pod-modal" id="podModal">
      <span class="pod-close" onclick="closePODModal()">&times;</span>
      <div class="pod-modal-content" id="podContent">
        <h2>Order Your Quote Print</h2>
        <p>Transform your favorite quote into beautiful merchandise!</p>
        
        <img class="pod-preview" id="podPreview" alt="Quote Preview">
        
        <div class="pod-products" id="podProducts">
          <!-- Products rendered here -->
        </div>
        
        <div class="pod-form" id="podForm" style="display:none;">
          <input type="text" id="podName" placeholder="Full Name" required>
          <input type="email" id="podEmail" placeholder="Email Address" required>
          <input type="text" id="podAddress" placeholder="Shipping Address" required>
          <input type="text" id="podCity" placeholder="City" required>
          <input type="text" id="podZip" placeholder="ZIP Code" required>
          <input type="text" id="podCountry" placeholder="Country" required>
          <button class="pod-submit" onclick="submitPODOrder()">Complete Order</button>
        </div>
        
        <div class="pod-success" id="podSuccess" style="display:none;">
          <h3>✓ Order Placed!</h3>
          <p>Your order has been submitted successfully.</p>
          <p>Order ID: <span id="podOrderId"></span></p>
          <p>You'll receive a confirmation email shortly.</p>
        </div>
      </div>
    </div>
    
    <script>
      let selectedProduct = null;
      let currentQuote = '';
      let currentAuthor = '';
      
      function openPODModal() {
        const quoteEl = document.querySelector('.quote-text');
        const authorEl = document.querySelector('.quote-author');
        currentQuote = quoteEl ? quoteEl.textContent : '';
        currentAuthor = authorEl ? authorEl.textContent.replace('— ', '') : '';
        
        document.getElementById('podModal').classList.add('active');
        renderProducts();
        
        // Generate preview
        const preview = document.getElementById('podPreview');
        const img = generatePODImage(currentQuote, currentAuthor);
        preview.src = img;
      }
      
      function closePODModal() {
        document.getElementById('podModal').classList.remove('active');
        resetPODForm();
      }
      
      function renderProducts() {
        const products = ${JSON.stringify(POD_CONFIG.products)};
        const container = document.getElementById('podProducts');
        
        container.innerHTML = Object.entries(products).map(([id, p]) => `
          <div class="pod-product" onclick="selectProduct('${id}', this)">
            <div class="pod-product-name">${p.name}</div>
            <div class="pod-product-price">$${p.price}</div>
            <div class="pod-product-desc">${p.description}</div>
          </div>
        `).join('');
        
        document.getElementById('podForm').style.display = 'none';
      }
      
      function selectProduct(productId, el) {
        selectedProduct = productId;
        document.querySelectorAll('.pod-product').forEach(p => p.classList.remove('selected'));
        el.classList.add('selected');
        document.getElementById('podForm').style.display = 'flex';
      }
      
      async function submitPODOrder() {
        const customer = {
          name: document.getElementById('podName').value,
          email: document.getElementById('podEmail').value,
          address: document.getElementById('podAddress').value,
          city: document.getElementById('podCity').value,
          zip: document.getElementById('podZip').value,
          country: document.getElementById('podCountry').value
        };
        
        if (!customer.name || !customer.email || !customer.address) {
          alert('Please fill in all required fields');
          return;
        }
        
        try {
          const order = await createPODOrder(currentQuote, currentAuthor, selectedProduct, customer);
          
          document.getElementById('podForm').style.display = 'none';
          document.getElementById('podProducts').style.display = 'none';
          document.getElementById('podSuccess').style.display = 'block';
          document.getElementById('podOrderId').textContent = order.id;
          
          // Track analytics
          if (window.trackAnalytics) {
            trackAnalytics('pod_order', { product: selectedProduct, orderId: order.id });
          }
        } catch (err) {
          alert('Error placing order: ' + err.message);
        }
      }
      
      function resetPODForm() {
        selectedProduct = null;
        document.getElementById('podForm').reset();
        document.getElementById('podForm').style.display = 'none';
        document.getElementById('podProducts').style.display = 'grid';
        document.getElementById('podSuccess').style.display = 'none';
        document.querySelectorAll('.pod-product').forEach(p => p.classList.remove('selected'));
      }
      
      // POD configuration exposed globally
      window.POD_CONFIG = ${JSON.stringify(POD_CONFIG)};
      window.generatePODImage = generatePODImage;
      window.createPODOrder = createPODOrder;
      window.openPODModal = openPODModal;
      window.closePODModal = closePODModal;
      window.selectProduct = selectProduct;
      window.submitPODOrder = submitPODOrder;
    </script>
  `;
  
  document.body.appendChild(widget);
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const quote = document.querySelector('.quote-text')?.textContent || '';
    const author = document.querySelector('.quote-author')?.textContent.replace('— ', '') || '';
    renderPODWidget(quote, author);
  });
} else {
  const quote = document.querySelector('.quote-text')?.textContent || '';
  const author = document.querySelector('.quote-author')?.textContent.replace('— ', '') || '';
  renderPODWidget(quote, author);
}

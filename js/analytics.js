/**
 * Motivational Quote - Analytics Module
 * Google Analytics 4 Integration
 * 
 * Track: page views, quote shares, subscriptions, favorites, category views
 */

// Initialize GA4
(function() {
  const GA_MEASUREMENT_ID = 'G-VF1RWJ4JV2'; // Replace with actual GA4 ID
  
  // Load GA4 script
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
  document.head.appendChild(script);
  
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  window.gtag = gtag;
  
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID, {
    'send_page_view': true,
    'debug_mode': window.location.hostname === 'localhost'
  });
})();

// Analytics Helper Functions
const Analytics = {
  // Track page views
  pageView: function(pagePath, pageTitle) {
    if (!window.gtag) return;
    gtag('event', 'page_view', {
      page_path: pagePath || window.location.pathname,
      page_title: pageTitle || document.title
    });
  },
  
  // Track quote shares
  trackShare: function(platform, category) {
    if (!window.gtag) return;
    gtag('event', 'share', {
      method: platform,
      content_type: 'quote',
      category: category || 'uncategorized'
    });
  },
  
  // Track subscriptions
  trackSubscribe: function(method) {
    if (!window.gtag) return;
    gtag('event', 'sign_up', {
      method: method || 'website'
    });
  },
  
  // Track unsubscribes
  trackUnsubscribe: function(method) {
    if (!window.gtag) return;
    gtag('event', 'unsubscribe', {
      method: method || 'website'
    });
  },
  
  // Track favorites
  trackFavorite: function(action) {
    if (!window.gtag) return;
    gtag('event', 'add_to_favorites', {
      action: action // 'add' or 'remove'
    });
  },
  
  // Track category views
  trackCategoryView: function(category) {
    if (!window.gtag) return;
    gtag('event', 'view_category', {
      category: category
    });
  },
  
  // Track quote generated (random quote clicked)
  trackQuoteGenerated: function(category) {
    if (!window.gtag) return;
    gtag('event', 'generate_quote', {
      category: category || 'random'
    });
  },
  
  // Track custom events
  trackEvent: function(eventName, params) {
    if (!window.gtag) return;
    gtag('event', eventName, params);
  }
};

// Auto-track page views on navigation (for SPA-like behavior)
if (typeof window !== 'undefined') {
  let lastPath = window.location.pathname;
  
  // Track hash changes for category pages
  window.addEventListener('hashchange', function() {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      Analytics.trackCategoryView(hash);
    }
    Analytics.pageView(window.location.pathname + window.location.hash, document.title);
  });
  
  // Track clicks on share buttons
  document.addEventListener('click', function(e) {
    const shareBtn = e.target.closest('[data-share]');
    if (shareBtn) {
      const platform = shareBtn.getAttribute('data-share');
      const category = document.querySelector('.quote-category')?.textContent || 'unknown';
      Analytics.trackShare(platform, category);
    }
    
    // Track subscribe button
    const subscribeBtn = e.target.closest('[data-subscribe]');
    if (subscribeBtn) {
      Analytics.trackSubscribe('button_click');
    }
    
    // Track favorite button
    const favoriteBtn = e.target.closest('[data-favorite]');
    if (favoriteBtn) {
      Analytics.trackFavorite(favoriteBtn.classList.contains('active') ? 'remove' : 'add');
    }
  });
}

console.log('Analytics module loaded');

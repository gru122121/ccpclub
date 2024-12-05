document.addEventListener('DOMContentLoaded', () => {
    // Initialize products
    const productManager = new ProductManager();
    productManager.displayProducts();

    // Check for URL hash and scroll if needed
    const hash = window.location.hash;
    if (hash) {
        const sectionId = hash.slice(1); // Remove the # from the hash
        setTimeout(() => {
            scrollToSection(sectionId);
        }, 500); // Small delay to ensure content is loaded
    }
});

// Update the scroll function for better behavior
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offset = 0;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = section.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// Add click event listeners for the buttons
document.addEventListener('DOMContentLoaded', () => {
    const productManager = new ProductManager();
    productManager.displayProducts();

    // Add button event listeners
    document.querySelectorAll('.nav-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const sectionId = e.target.getAttribute('data-section');
            scrollToSection(sectionId);
        });
    });
});

class ProductManager {
    constructor() {
        this.productsContainer = document.getElementById('productsContainer');
    }

    async fetchProducts() {
        try {
            const response = await fetch('products.json');
            const data = await response.json();
            return [{
                title: data.shopInfo.name,
                products: data.products.map(product => ({
                    title: product.title,
                    image: product.image,
                    price: `¥${product.price}`,
                    link: product.link,
                    sales: product.sales
                }))
            }];
        } catch (error) {
            console.error('Error loading products:', error);
            return [{
                title: "Error Loading Products",
                products: []
            }];
        }
    }

    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.title}" loading="lazy">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <div class="price">${product.price}</div>
                <div class="sales">${product.sales}</div>
            </div>
        `;
        
        card.addEventListener('click', () => {
            window.open(product.link, '_blank');
        });
        
        return card;
    }

    createCategorySection(category) {
        return category.products.map(product => this.createProductCard(product));
    }

    async displayProducts() {
        this.productsContainer.innerHTML = '<div class="loading">Loading products...</div>';
        
        try {
            const categories = await this.fetchProducts();
            this.productsContainer.innerHTML = '';
            
            categories.forEach(category => {
                const products = this.createCategorySection(category);
                products.forEach(product => {
                    this.productsContainer.appendChild(product);
                });
            });

        } catch (error) {
            console.error('Error displaying products:', error);
            this.productsContainer.innerHTML = `
                <div class="error">
                    <p>Unable to load products. Please try again later.</p>
                </div>
            `;
        }
    }
}

// Update the loadProducts function
function loadProducts() {
    const productManager = new ProductManager();
    productManager.displayProducts();
}

// Add click handler to close popup when clicking overlay
document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.querySelector('.popup-overlay');
    if (overlay) {
        overlay.addEventListener('click', closeProductsPopup);
    }
});
  
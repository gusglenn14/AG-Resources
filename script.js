// Mobile menu functions
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const toggle = document.querySelector('.mobile-menu-toggle');
    
    mobileMenu.classList.toggle('active');
    toggle.classList.toggle('active');
}

function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const toggle = document.querySelector('.mobile-menu-toggle');
    
    mobileMenu.classList.remove('active');
    toggle.classList.remove('active');
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
    const mobileMenu = document.getElementById('mobileMenu');
    const toggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('nav');
    
    if (!nav.contains(event.target) && mobileMenu.classList.contains('active')) {
        closeMobileMenu();
    }
});

// Page navigation with effects
function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    const targetPage = document.getElementById(pageId);
    
    // Add null check to prevent white screen
    if (!targetPage) {
        console.error('Page not found:', pageId);
        return;
    }
    
    // Close mobile menu when navigating
    closeMobileMenu();
    
    pages.forEach(page => {
        if (page.classList.contains('active')) {
            page.style.opacity = '0';
            page.style.transform = 'translateX(-50px)';
            setTimeout(() => {
                page.classList.remove('active');
            }, 300);
        }
    });
    
    setTimeout(() => {
        // Ensure we remove active from all pages first
        pages.forEach(page => page.classList.remove('active'));
        
        // Then activate the target page
        targetPage.classList.add('active');
        targetPage.style.opacity = '1';
        targetPage.style.transform = 'translateX(0)';
        window.scrollTo(0, 0);
        animateOnScroll();
        updateScrollProgress();
    }, 300);
}

// Scroll progress indicator
function updateScrollProgress() {
    const progress = document.querySelector('.scroll-progress');
    const scrollTop = window.pageYOffset;
    const docHeight = document.body.offsetHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progress.style.width = scrollPercent + '%';
}

// Enhanced scroll animations
function animateOnScroll() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, index * 100);
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(el => {
        el.classList.remove('animated');
        observer.observe(el);
    });
}

// Advanced calculator
function calculateRoyalty() {
    const turbines = document.getElementById('turbines').value;
    const capacity = document.getElementById('capacity').value;
    const royalty = document.getElementById('royalty').value;
    const powerPrice = document.getElementById('power-price').value || 45;
    
    if (turbines && capacity && royalty) {
        // Advanced calculation with capacity factor and annual production
        const capacityFactor = 0.35; // Industry average
        const hoursPerYear = 8760;
        const annualProduction = turbines * capacity * capacityFactor * hoursPerYear;
        const annualRevenue = annualProduction * powerPrice;
        const annualRoyalty = annualRevenue * (royalty / 100);
        const estimatedValue = annualRoyalty * 12; // 12x multiplier for lump sum
        
        const result = document.getElementById('result');
        result.innerHTML = `$${estimatedValue.toLocaleString()}`;
        result.style.animation = 'none';
        setTimeout(() => result.style.animation = 'glow 2s ease-in-out infinite alternate', 10);
    }
}

// Form submission with animation
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            
            btn.innerHTML = 'Sending...';
            btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            
            setTimeout(() => {
                btn.innerHTML = '✓ Message Sent!';
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = 'linear-gradient(135deg, var(--neon-blue), var(--electric-blue))';
                    form.reset();
                }, 2000);
            }, 1500);
        });
    }
});

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    animateOnScroll();
    
    // Scroll event listeners
    window.addEventListener('scroll', () => {
        updateScrollProgress();
    });

    // Prevent zoom on double tap for iOS
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function (event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);

    // Add simplified animations to service cards for touch devices
    if ('ontouchstart' in window) {
        document.querySelectorAll('.service-card, .stat-card, .value-card').forEach(card => {
            card.addEventListener('touchstart', () => {
                card.style.transform = 'scale(0.98)';
            });
            
            card.addEventListener('touchend', () => {
                card.style.transform = 'scale(1)';
            });
        });
    } else {
        // Mouse interactions for desktop
        document.querySelectorAll('.service-card').forEach((card, index) => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Enhanced hover effects for value cards
        document.querySelectorAll('.value-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-15px) scale(1.02)';
                card.style.boxShadow = '0 25px 60px rgba(96, 165, 250, 0.3)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
                card.style.boxShadow = 'none';
            });
        });
    }

    // Add interactive effects to buttons
    document.querySelectorAll('.btn').forEach(btn => {
        if ('ontouchstart' in window) {
            btn.addEventListener('touchstart', () => {
                btn.style.transform = 'scale(0.95)';
            });
            
            btn.addEventListener('touchend', () => {
                btn.style.transform = 'scale(1)';
            });
        } else {
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'translateY(-5px) scale(1.05)';
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translateY(0) scale(1)';
            });
        }
    });

    // Auto-animate timeline on scroll
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        item.style.animationDelay = index * 0.2 + 's';
    });
});

// Handle orientation changes
window.addEventListener('orientationchange', function() {
    setTimeout(() => {
        window.scrollTo(0, 0);
        updateScrollProgress();
    }, 100);
});

// Fallback for navigation errors
window.addEventListener('error', function(e) {
    if (e.message.includes('Cannot read property') || e.message.includes('Cannot read properties')) {
        console.warn('Navigation error caught, showing home page');
        const homePage = document.getElementById('home');
        if (homePage) {
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            homePage.classList.add('active');
        }
    }
});

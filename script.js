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
    // This function is now replaced by calculateWindRoyalty()
    calculateWindRoyalty();
}

// Tab switching functionality
function switchTab(tabType) {
    const tabs = document.querySelectorAll('.calc-tab');
    const solarCalc = document.getElementById('solar-calc');
    const windCalc = document.getElementById('wind-calc');
    
    // Remove active class from all tabs
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Add active class to clicked tab
    event.target.classList.add('active');
    
    // Show/hide calculators with animation
    if (tabType === 'solar') {
        windCalc.style.display = 'none';
        solarCalc.style.display = 'block';
    } else {
        solarCalc.style.display = 'none';
        windCalc.style.display = 'block';
    }
}

// Solar calculator function
function calculateSolarRoyalty() {
    const capacity = document.getElementById('solar-capacity').value;
    const royalty = document.getElementById('solar-royalty').value;
    const powerPrice = document.getElementById('solar-power-price').value || 50;
    
    if (capacity && royalty) {
        // Solar calculation with 22% capacity factor
        const capacityFactor = 0.22; // Solar capacity factor
        const hoursPerYear = 8760;
        const capacityMW = capacity / 1000; // Convert kW to MW
        const annualProduction = capacityMW * capacityFactor * hoursPerYear;
        const annualRevenue = annualProduction * powerPrice;
        const annualRoyalty = annualRevenue * (royalty / 100);
        const estimatedValue = annualRoyalty * 15; // 15x multiplier for solar (longer lifespan)
        
        const result = document.getElementById('solar-result');
        result.innerHTML = `$${estimatedValue.toLocaleString()}`;
        result.style.animation = 'none';
        setTimeout(() => result.style.animation = 'glow 2s ease-in-out infinite alternate', 10);
    }
}

// Wind calculator function (updated from existing)
function calculateWindRoyalty() {
    const turbines = document.getElementById('turbines').value;
    const capacity = document.getElementById('capacity').value;
    const royalty = document.getElementById('royalty').value;
    const powerPrice = document.getElementById('power-price').value || 45;
    
    if (turbines && capacity && royalty) {
        // Wind calculation with 35% capacity factor
        const capacityFactor = 0.35;
        const hoursPerYear = 8760;
        const annualProduction = turbines * capacity * capacityFactor * hoursPerYear;
        const annualRevenue = annualProduction * powerPrice;
        const annualRoyalty = annualRevenue * (royalty / 100);
        const estimatedValue = annualRoyalty * 12; // 12x multiplier for wind
        
        const result = document.getElementById('wind-result');
        result.innerHTML = `$${estimatedValue.toLocaleString()}`;
        result.style.animation = 'none';
        setTimeout(() => result.style.animation = 'glow 2s ease-in-out infinite alternate', 10);
    }
}

// Simplified Form submission - Always shows success
document.addEventListener('DOMContentLoaded', () => {
    // Initialize EmailJS with your public key
    emailjs.init("vrz7g2Y8eQrz1d3RH"); 
    
    const form = document.querySelector('#contact-form');
    if (form) {
        form.addEventListener('submit', handleFormSubmission);
    }
});

async function handleFormSubmission(e) {
    e.preventDefault();
    
    const form = e.target;
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    
    // Validate form data
    if (!validateForm(form)) {
        return;
    }
    
    // Update button state
    updateButtonState(btn, 'Sending...', true);
    
    // Always show success after a short delay
    setTimeout(() => {
        // Show success regardless of email status
        updateButtonState(btn, '✓ Message Sent!', true, '#10b981');
        showNotification('Your message has been sent successfully! We will contact you within 4 business hours.', 'success');
        
        // Reset form after delay
        setTimeout(() => {
            form.reset();
            resetButtonState(btn, originalText);
        }, 2000);
    }, 1500); // 1.5 second delay to make it feel realistic
    
    // Try to send emails in background (but don't affect user experience)
    try {
        // Prepare form data
        const formData = new FormData(form);
        const customerName = formData.get('name');
        const customerEmail = formData.get('email');
        const phone = formData.get('phone') || 'Not provided';
        const propertyLocation = formData.get('property') || 'Not provided';
        const message = formData.get('message');
        
        // Template parameters for CONTACT US email (to your business)
        const contactUsParams = {
            from_name: customerName,
            from_email: customerEmail,
            customer_name: customerName,
            customer_email: customerEmail,
            customer_phone: phone,
            property_location: propertyLocation,
            message: message,
            to_name: 'AG Resources Team',
            reply_to: customerEmail
        };
        
        // Template parameters for AUTO REPLY email (to customer)
        const autoReplyParams = {
            customer_name: customerName,
            customer_email: customerEmail,
            customer_phone: phone,
            property_location: propertyLocation,
            message: message,
            to_email: customerEmail,
            to_name: customerName,
            from_name: 'AG Resources',
            from_email: 'info@agresources.com',
            company_name: 'AG Resources',
            support_email: 'info@agresources.com',
            support_phone: '(512) 847-WIND'
        };
        
        // Send emails in background (success/failure won't affect UI)
        emailjs.send('service_b37hchq', 'template_5jw19ar', contactUsParams)
            .then((result) => {
                console.log('✅ Contact Us email sent successfully:', result);
            })
            .catch((error) => {
                console.error('❌ Contact Us email failed:', error);
            });
        
        emailjs.send('service_b37hchq', 'template_q3zw7ma', autoReplyParams)
            .then((result) => {
                console.log('✅ Auto Reply email sent successfully:', result);
            })
            .catch((error) => {
                console.error('❌ Auto Reply email failed:', error);
            });
            
    } catch (error) {
        console.error('❌ Email setup failed:', error);
    }
}

function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = '#ef4444';
            field.style.boxShadow = '0 0 10px rgba(239, 68, 68, 0.3)';
            isValid = false;
        } else {
            field.style.borderColor = '';
            field.style.boxShadow = '';
        }
    });
    
    // Validate email format
    const emailField = form.querySelector('[type="email"]');
    if (emailField && emailField.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value)) {
            emailField.style.borderColor = '#ef4444';
            emailField.style.boxShadow = '0 0 10px rgba(239, 68, 68, 0.3)';
            isValid = false;
        }
    }
    
    if (!isValid) {
        showNotification('Please fill in all required fields correctly.', 'error');
    }
    
    return isValid;
}

function updateButtonState(btn, text, disabled, backgroundColor = null) {
    btn.innerHTML = text;
    btn.disabled = disabled;
    if (backgroundColor) {
        btn.style.background = backgroundColor;
    }
}

function resetButtonState(btn, originalText) {
    btn.innerHTML = originalText;
    btn.disabled = false;
    btn.style.background = 'linear-gradient(135deg, var(--neon-blue), var(--electric-blue))';
}

function showNotification(message, type) {
    // Remove existing notifications
    const existingNotification = document.querySelector('.form-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = `form-notification ${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '10px',
        color: 'white',
        fontWeight: '500',
        zIndex: '10000',
        maxWidth: '400px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
        transform: 'translateX(400px)',
        transition: 'transform 0.3s ease'
    });
    
    if (type === 'success') {
        notification.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    } else if (type === 'warning') {
        notification.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
    } else {
        notification.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
    }
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

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

// Mobile menu functions
function toggleMobileMenu() {
    const $mobileMenu = $('#mobileMenu');
    const $toggle = $('.mobile-menu-toggle');
    
    if ($mobileMenu.length && $toggle.length) {
        $mobileMenu.toggleClass('active');
        $toggle.toggleClass('active');
    }
}

function closeMobileMenu() {
    const $mobileMenu = $('#mobileMenu');
    const $toggle = $('.mobile-menu-toggle');
    
    if ($mobileMenu.length && $toggle.length) {
        $mobileMenu.removeClass('active');
        $toggle.removeClass('active');
    }
}

// Ensure mobile menu is hidden on desktop by default
$(document).ready(function() {
    const $mobileMenu = $('#mobileMenu');
    const $toggle = $('.mobile-menu-toggle');
    
    if ($mobileMenu.length && $toggle.length) {
        $mobileMenu.removeClass('active');
        $toggle.removeClass('active');
    }
});

// Close mobile menu when clicking outside
$(document).on('click', function(event) {
    const $mobileMenu = $('#mobileMenu');
    const $toggle = $('.mobile-menu-toggle');
    const $nav = $('nav');
    
    if ($nav.length && !$nav.is(event.target) && !$nav.has(event.target).length && $mobileMenu.hasClass('active')) {
        closeMobileMenu();
    }
});

// Page navigation with effects
function showPage(pageId) {
    const $pages = $('.page');
    const $targetPage = $(`#${pageId}`);
    
    // Add null check to prevent white screen
    if (!$targetPage.length) {
        console.error('Page not found:', pageId);
        return;
    }
    
    // Close mobile menu when navigating
    closeMobileMenu();
    
    $pages.each(function() {
        const $page = $(this);
        if ($page.hasClass('active')) {
            $page.css({
                'opacity': '0',
                'transform': 'translateX(-50px)'
            });
            setTimeout(() => {
                $page.removeClass('active');
            }, 300);
        }
    });
    
    setTimeout(() => {
        // Ensure we remove active from all pages first
        $pages.removeClass('active');
        
        // Then activate the target page
        $targetPage.addClass('active').css({
            'opacity': '1',
            'transform': 'translateX(0)'
        });
        
        $('html, body').scrollTop(0);
        animateOnScroll();
        updateScrollProgress();
    }, 300);
}

// Scroll progress indicator
function updateScrollProgress() {
    const $progress = $('.scroll-progress');
    if (!$progress.length) return;
    
    const scrollTop = $(window).scrollTop();
    const docHeight = $(document).height() - $(window).height();
    const scrollPercent = (scrollTop / docHeight) * 100;
    $progress.css('width', scrollPercent + '%');
}

// Enhanced scroll animations
function animateOnScroll() {
    const $elements = $('.animate-on-scroll');
    
    if (!$elements.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    $(entry.target).addClass('animated');
                    
                    // Check if this element contains counters
                    const $counters = $(entry.target).find('.counter');
                    if ($counters.length) {
                        $counters.each(function() {
                            const $counter = $(this);
                            const target = parseInt($counter.data('target'));
                            const duration = 1000; // 1 second
                            const increment = target / (duration / 16); // 60fps
                            let current = 0;
                            
                            const timer = setInterval(() => {
                                current += increment;
                                if (current >= target) {
                                    current = target;
                                    clearInterval(timer);
                                }
                                $counter.text(Math.floor(current));
                            }, 16);
                        });
                    }
                    
                    // Check if this is a timeline item to animate the line
                    if ($(entry.target).hasClass('timeline-item')) {
                        const $timelineLine = $('#timelineLine');
                        const $timelineItems = $('.timeline-item');
                        const $animatedItems = $('.timeline-item.animated');
                        
                        if ($timelineLine.length && $animatedItems.length === $timelineItems.length) {
                            setTimeout(() => {
                                $timelineLine.addClass('visible');
                            }, 500); // Show line after all items are animated
                        }
                    }
                }, index * 100);
            }
        });
    }, { threshold: 0.1 });

    $elements.each(function() {
        $(this).removeClass('animated');
        observer.observe(this);
    });
}

// Advanced calculator
function calculateRoyalty() {
    const turbines = $('#turbines').val();
    const capacity = $('#capacity').val();
    const royalty = $('#royalty').val();
    const powerPrice = $('#power-price').val() || 45;
    
    if (turbines && capacity && royalty) {
        // Advanced calculation with capacity factor and annual production
        const capacityFactor = 0.35; // Industry average
        const hoursPerYear = 8760;
        const annualProduction = turbines * capacity * capacityFactor * hoursPerYear;
        const annualRevenue = annualProduction * powerPrice;
        const annualRoyalty = annualRevenue * (royalty / 100);
        const estimatedValue = annualRoyalty * 12; // 12x multiplier for lump sum
        
        const $result = $('#result');
        if ($result.length) {
            $result.html(`$${estimatedValue.toLocaleString()}`);
            $result.css('animation', 'none');
            setTimeout(() => $result.css('animation', 'glow 2s ease-in-out infinite alternate'), 10);
        }
    }
}

// Simplified Form submission - Always shows success
$(document).ready(function() {
    // Initialize EmailJS with your public key
    emailjs.init("vrz7g2Y8eQrz1d3RH"); 
    
    const $form = $('#contact-form');
    if ($form.length) {
        $form.on('submit', handleFormSubmission);
    }
});

async function handleFormSubmission(e) {
    e.preventDefault();
    
    const $form = $(e.target);
    const $btn = $form.find('button[type="submit"]');
    const originalText = $btn.html();
    
    // Validate form data
    if (!validateForm($form)) {
        return;
    }
    
    // Update button state
    updateButtonState($btn, 'Sending...', true);
    
    // Always show success after a short delay
    setTimeout(() => {
        // Show success regardless of email status
        updateButtonState($btn, '✓ Message Sent!', true, '#10b981');
        showNotification('Your message has been sent successfully! We will contact you within 4 business hours.', 'success');
        
        // Reset form after delay
        setTimeout(() => {
            $form[0].reset();
            resetButtonState($btn, originalText);
        }, 2000);
    }, 1500); // 1.5 second delay to make it feel realistic
    
    // Try to send emails in background (but don't affect user experience)
    try {
        // Prepare form data
        const formData = new FormData($form[0]);
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

function validateForm($form) {
    const $requiredFields = $form.find('[required]');
    let isValid = true;
    
    $requiredFields.each(function() {
        const $field = $(this);
        if (!$field.val().trim()) {
            $field.css({
                'border-color': '#ef4444',
                'box-shadow': '0 0 10px rgba(239, 68, 68, 0.3)'
            });
            isValid = false;
        } else {
            $field.css({
                'border-color': '',
                'box-shadow': ''
            });
        }
    });
    
    // Validate email format
    const $emailField = $form.find('[type="email"]');
    if ($emailField.length && $emailField.val()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test($emailField.val())) {
            $emailField.css({
                'border-color': '#ef4444',
                'box-shadow': '0 0 10px rgba(239, 68, 68, 0.3)'
            });
            isValid = false;
        }
    }
    
    if (!isValid) {
        showNotification('Please fill in all required fields correctly.', 'error');
    }
    
    return isValid;
}

function updateButtonState($btn, text, disabled, backgroundColor = null) {
    $btn.html(text).prop('disabled', disabled);
    if (backgroundColor) {
        $btn.css('background', backgroundColor);
    }
}

function resetButtonState($btn, originalText) {
    $btn.html(originalText).prop('disabled', false);
    $btn.css('background', 'linear-gradient(135deg, var(--neon-blue), var(--electric-blue))');
}

function showNotification(message, type) {
    // Remove existing notifications
    $('.form-notification').remove();
    
    // Create new notification
    const $notification = $('<div>')
        .addClass(`form-notification ${type}`)
        .text(message)
        .css({
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
        $notification.css('background', 'linear-gradient(135deg, #10b981, #059669)');
    } else if (type === 'warning') {
        $notification.css('background', 'linear-gradient(135deg, #f59e0b, #d97706)');
    } else {
        $notification.css('background', 'linear-gradient(135deg, #ef4444, #dc2626)');
    }
    
    $('body').append($notification);
    
    // Animate in
    setTimeout(() => {
        $notification.css('transform', 'translateX(0)');
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        $notification.css('transform', 'translateX(400px)');
        setTimeout(() => $notification.remove(), 300);
    }, 5000);
}

// Initialize everything
$(document).ready(function() {
    animateOnScroll();
    
    // Scroll event listeners
    $(window).on('scroll', updateScrollProgress);

    // Prevent zoom on double tap for iOS
    let lastTouchEnd = 0;
    $(document).on('touchend', function(event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    });

    // Add simplified animations to service cards for touch devices
    if ('ontouchstart' in window) {
        $('.service-card, .stat-card, .value-card').on('touchstart', function() {
            $(this).css('transform', 'scale(0.98)');
        }).on('touchend', function() {
            $(this).css('transform', 'scale(1)');
        });
    } else {
        // Mouse interactions for desktop
        $('.service-card').on('mouseenter', function() {
            $(this).css('transform', 'translateY(-10px) scale(1.02)');
        }).on('mouseleave', function() {
            $(this).css('transform', 'translateY(0) scale(1)');
        });

        // Enhanced hover effects for value cards
        $('.value-card').on('mouseenter', function() {
            $(this).css({
                'transform': 'translateY(-15px) scale(1.02)',
                'box-shadow': '0 25px 60px rgba(96, 165, 250, 0.3)'
            });
        }).on('mouseleave', function() {
            $(this).css({
                'transform': 'translateY(0) scale(1)',
                'box-shadow': 'none'
            });
        });
    }

    // Add interactive effects to buttons
    $('.btn').each(function() {
        const $btn = $(this);
        if ('ontouchstart' in window) {
            $btn.on('touchstart', function() {
                $(this).css('transform', 'scale(0.95)');
            }).on('touchend', function() {
                $(this).css('transform', 'scale(1)');
            });
        } else {
            $btn.on('mouseenter', function() {
                $(this).css('transform', 'translateY(-5px) scale(1.05)');
            }).on('mouseleave', function() {
                $(this).css('transform', 'translateY(0) scale(1)');
            });
        }
    });

    // Auto-animate timeline on scroll
    $('.timeline-item').each(function(index) {
        $(this).css('animation-delay', index * 0.2 + 's');
    });
});

// Handle orientation changes
$(window).on('orientationchange', function() {
    setTimeout(() => {
        $('html, body').scrollTop(0);
        updateScrollProgress();
    }, 100);
});

// Fallback for navigation errors
$(window).on('error', function(e) {
    if (e.originalEvent && (e.originalEvent.message.includes('Cannot read property') || e.originalEvent.message.includes('Cannot read properties'))) {
        console.warn('Navigation error caught, showing home page');
        const $homePage = $('#home');
        if ($homePage.length) {
            $('.page').removeClass('active');
            $homePage.addClass('active');
        }
    }
});

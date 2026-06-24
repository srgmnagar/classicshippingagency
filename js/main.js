/* 
   Classic Shipping Agency - Global Scripts
   Established 1998 - Steering Global Trade Forward
*/

document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initMobileNav();
    initScrollAnimations();
    initPortMap();
    initInquiryForm();
    initMapTabs();
});

/* ==========================================================================
   Header Scroll Styling
   ========================================================================== */
function initHeader() {
    const header = document.querySelector('header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/* ==========================================================================
   Mobile Responsive Navigation
   ========================================================================== */
function initMobileNav() {
    const hamburger = document.querySelector('.nav-hamburger');
    const menu = document.querySelector('.nav-menu');
    
    if (!hamburger || !menu) return;

    hamburger.addEventListener('click', () => {
        menu.classList.toggle('open');
        hamburger.classList.toggle('active');
        
        // Animate hamburger lines
        const lines = hamburger.querySelectorAll('span');
        if (hamburger.classList.contains('active')) {
            lines[0].style.transform = 'translateY(8px) rotate(45deg)';
            lines[1].style.opacity = '0';
            lines[2].style.transform = 'translateY(-8px) rotate(-45deg)';
        } else {
            lines[0].style.transform = 'none';
            lines[1].style.opacity = '1';
            lines[2].style.transform = 'none';
        }
    });

    // Close menu when clicking outside or on a link
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !menu.contains(e.target) && menu.classList.contains('open')) {
            menu.classList.remove('open');
            hamburger.classList.remove('active');
            hamburger.querySelectorAll('span').forEach(line => line.style.transform = 'none');
            hamburger.querySelectorAll('span')[1].style.opacity = '1';
        }
    });
}

/* ==========================================================================
   Scroll Entrance Animations
   ========================================================================== */
function initScrollAnimations() {
    const animElements = document.querySelectorAll('.animate-on-scroll');
    if (animElements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target); // Trigger once
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   Interactive India Port Map
   ========================================================================== */
const portData = {
    bhavnagar: {
        name: 'Bhavnagar Port',
        state: 'Gujarat',
        role: 'Head Office',
        roleType: 'head',
        phone: '+91-9924455228',
        email: 'info@classicshippingagency.com',
        description: 'Our corporate headquarters, serving the historical Gulf of Khambhat and managing custom clearances and shipping agency networks across all major Indian ports since 1998.'
    },
    pipavav: {
        name: 'Pipavav Port',
        state: 'Gujarat',
        role: 'Branch Office',
        roleType: 'branch',
        phone: '+91-9924455228',
        email: 'info@classicshippingagency.com',
        description: 'Direct operational branch at India\'s first private-sector port, specializing in efficient container handling, customs clearing, liquid bulk husbandry, and multi-modal logistics.'
    },
    mundra: {
        name: 'Mundra Port',
        state: 'Gujarat',
        role: 'Operational Port',
        roleType: 'operational',
        phone: '+91-9924455228',
        email: 'info@classicshippingagency.com',
        description: 'Operations at India\'s largest private commercial port. We coordinate rapid dry bulk and container bookings, clearing massive importing and exporting cargos with full regulatory compliance.'
    },
    kandla: {
        name: 'Kandla (Deendayal) Port',
        state: 'Gujarat',
        role: 'Operational Port',
        roleType: 'operational',
        phone: '+91-9924455228',
        email: 'info@classicshippingagency.com',
        description: 'Handling vessels at India\'s leading hub for dry cargo and liquid bulk. We manage shipping agency services, port clearances, bunkering, and customs clearance protocols.'
    },
    mumbai: {
        name: 'Mumbai (JNPT) Port',
        state: 'Maharashtra',
        role: 'Operational Port',
        roleType: 'operational',
        phone: '+91-9924455228',
        email: 'info@classicshippingagency.com',
        description: 'Active operations coordinating container booking, customs processing, and door-to-door multimodal transportation from India\'s premier container gateway.'
    },
    cochin: {
        name: 'Cochin Port',
        state: 'Kerala',
        role: 'Operational Port',
        roleType: 'operational',
        phone: '+91-9924455228',
        email: 'info@classicshippingagency.com',
        description: 'Managing bunkering logistics, customs clearance, and container shipping agency services at the strategic international transshipment terminal on India\'s southern coast.'
    },
    chennai: {
        name: 'Chennai Port',
        state: 'Tamil Nadu',
        role: 'Operational Port',
        roleType: 'operational',
        phone: '+91-9924455228',
        email: 'info@classicshippingagency.com',
        description: 'Coordinating automotive logistics, bulk cargo agency, and custom clearance procedures for major importers and exporters in South India.'
    },
    vizag: {
        name: 'Visakhapatnam Port',
        state: 'Andhra Pradesh',
        role: 'Operational Port',
        roleType: 'operational',
        phone: '+91-9924455228',
        email: 'info@classicshippingagency.com',
        description: 'Handling minerals, ores, coal, and heavy industrial cargo. Providing robust cargo coordination, custom house agency, and vessel husbandry.'
    },
    kolkata: {
        name: 'Kolkata (Haldia) Port',
        state: 'West Bengal',
        role: 'Operational Port',
        roleType: 'operational',
        phone: '+91-9924455228',
        email: 'info@classicshippingagency.com',
        description: 'Serving East India and landlocked neighboring regions. We handle inland waterway integration, custom clearances, container services, and vessel logistics.'
    }
};

function initPortMap() {
    const hotspots = document.querySelectorAll('.port-hotspot');
    const infoCard = document.getElementById('portInfoCard');
    
    if (hotspots.length === 0 || !infoCard) return;

    // Elements inside the card
    const titleEl = infoCard.querySelector('.port-info-title-text');
    const badgeEl = infoCard.querySelector('.port-info-badge');
    const stateEl = infoCard.querySelector('.port-info-state');
    const descEl = infoCard.querySelector('.port-info-desc');
    const phoneEl = infoCard.querySelector('.port-info-phone');
    const emailEl = infoCard.querySelector('.port-info-email');

    function updatePortInfo(portId) {
        const data = portData[portId];
        if (!data) return;

        // Visual feedback inside SVG
        hotspots.forEach(hs => hs.classList.remove('active'));
        const activeHotspot = document.querySelector(`.port-hotspot[data-port-id="${portId}"]`);
        if (activeHotspot) activeHotspot.classList.add('active');

        // Update card content directly
        if (titleEl) titleEl.textContent = data.name;
        if (stateEl) stateEl.textContent = `${data.state}, India`;
        if (descEl) descEl.textContent = data.description;
        if (phoneEl) phoneEl.textContent = data.phone;
        if (emailEl) emailEl.textContent = data.email;

        // Update Role Badge
        if (badgeEl) {
            badgeEl.textContent = data.role;
            badgeEl.className = 'port-info-badge';
            badgeEl.classList.add(data.roleType);
        }

        // Update Card border class
        infoCard.className = 'port-info-card';
        if (data.roleType === 'head') {
            infoCard.classList.add('is-head');
        }
    }

    // Set default active port as Bhavnagar (head office)
    updatePortInfo('bhavnagar');

    // Add click listeners to hotspots
    hotspots.forEach(hotspot => {
        hotspot.addEventListener('click', () => {
            const portId = hotspot.getAttribute('data-port-id');
            updatePortInfo(portId);
        });
    });
}

/* ==========================================================================
   Inquiry Form Validation and Simulated Submission
   ========================================================================== */
function initInquiryForm() {
    const form = document.getElementById('inquiryForm');
    const modal = document.getElementById('successModal');
    const closeModalBtn = document.getElementById('closeModal');
    
    if (!form || !modal) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Simple client side validation
        let isValid = true;
        const inputs = form.querySelectorAll('.form-input[required]');
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.style.borderColor = '#EF4444';
            } else {
                input.style.borderColor = '';
            }
        });

        const emailInput = form.querySelector('input[type="email"]');
        if (emailInput && emailInput.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value)) {
                isValid = false;
                emailInput.style.borderColor = '#EF4444';
            }
        }

        if (!isValid) {
            return;
        }

        // Show loading state on submit button
        const submitBtn = form.querySelector('button[type="submit"]');
        const origText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin" style="margin-right: 8px;"></i> Processing Inquiry...';

        // Simulate network API submission
        setTimeout(() => {
            // Success State
            submitBtn.disabled = false;
            submitBtn.innerHTML = origText;
            
            // Open Success Modal
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Lock body scroll

            form.reset();
        }, 1500);
    });

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            modal.classList.remove('active');
            document.body.style.overflow = ''; // Unlock body scroll
        });
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/* ==========================================================================
   Contact Page - Map Tab Switching
   ========================================================================== */
function initMapTabs() {
    const tabButtons = document.querySelectorAll('.office-map-tab-btn');
    const mapWrappers = document.querySelectorAll('.map-iframe-wrapper');

    if (tabButtons.length === 0 || mapWrappers.length === 0) return;

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-office-target');
            
            // Update Active tab button
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update visible iframe map
            mapWrappers.forEach(wrap => {
                if (wrap.id === targetId) {
                    wrap.classList.add('active');
                } else {
                    wrap.classList.remove('active');
                }
            });
        });
    });
}

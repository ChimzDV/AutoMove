/**
 * AutoMove United — Core Interactive JavaScript
 * Handles:
 * - Mobile Navigation Menu
 * - Multi-Step Quote Form with Google Apps Script Submission
 * - Auto-Populating Vehicle Years
 * - Session Storage Hand-off
 * - FAQ Accordions
 * - Route Quote Pre-filling
 * - Form Validations & Honeypot Anti-Spam
 */

(function () {
  'use strict';

  // Constants & Endpoints
  const QUOTE_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwB0O3qwE6NtWUBkMEANTj-GvwT2pTQfbtPEAbAd-QKhA84dxuWqW4G0ycfQOM0fTCf/exec';
  const CONTACT_ENDPOINT = 'https://script.google.com/macros/s/AKfycbxcsTXv6OoXLuxQohxRUX-vUsvwovKIrCu0D2hzhv2IU_aAH1u7RbxtcrnSqJtWGVrt/exec';

  document.addEventListener('DOMContentLoaded', function () {
    initHeaderScroll();
    initMobileNav();
    initYearDropdowns();
    initDateConstraints();
    initHeroQuoteForm();
    initDedicatedQuoteForm();
    initContactForm();
    initFaqAccordions();
    initResourcesHub();
    initRoutePrefills();
    initScrollReveals();
    initHighwayTruckAnimation();
    initPricingFactors();
    initReviewsCarousel();
    initBackToTop();
    initChatbot();
    initUsaShippingMap();
    initQuoteModal();
  });

  /* ==========================================================================
     1. Mobile Navigation (Automotive Drawer with Backdrop & Safe Areas)
     ========================================================================== */
  function initMobileNav() {
    const toggleBtn = document.querySelector('.amu-mobile-toggle');
    const mobileNav = document.querySelector('.amu-mobile-nav, .amu-mobile-drawer');
    const closeBtn = document.querySelector('.amu-mobile-close, .amu-drawer-close');

    if (!toggleBtn || !mobileNav) return;

    // Ensure backdrop exists
    let backdrop = document.querySelector('.amu-mobile-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'amu-mobile-backdrop';
      document.body.appendChild(backdrop);
    }

    function openNav() {
      mobileNav.classList.add('open');
      backdrop.classList.add('open');
      toggleBtn.classList.add('is-active');
      toggleBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      document.body.classList.add('amu-menu-open');
    }

    function closeNav() {
      mobileNav.classList.remove('open');
      backdrop.classList.remove('open');
      toggleBtn.classList.remove('is-active');
      toggleBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      document.body.classList.remove('amu-menu-open');
    }

    toggleBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (mobileNav.classList.contains('open')) {
        closeNav();
      } else {
        openNav();
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        closeNav();
      });
    }

    backdrop.addEventListener('click', closeNav);

    // Close on navigation link click
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeNav);
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
        closeNav();
      }
    });
  }

  /* ==========================================================================
     Navbar Scroll Behavior (Transparent at Top -> Solid Deep Navy #101B2D on Scroll)
     ========================================================================== */
  function initHeaderScroll() {
    const header = document.querySelector('.amu-header');
    if (!header) return;

    let ticking = false;

    function updateHeader() {
      if (window.scrollY > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }, { passive: true });

    // Initial check on load
    updateHeader();
  }

  /* ==========================================================================
     2. Vehicle Year Options
     ========================================================================== */
  function initYearDropdowns() {
    const yearSelects = document.querySelectorAll('.amu-year-select, #yearInput');
    const currentYear = new Date().getFullYear() + 1; // Include upcoming model year

    yearSelects.forEach(function (select) {
      if (select.children.length > 2) return; // Already populated

      const defaultOpt = select.firstElementChild;
      select.innerHTML = '';
      if (defaultOpt) select.appendChild(defaultOpt);

      for (let yr = currentYear; yr >= 1930; yr--) {
        const opt = document.createElement('option');
        opt.value = yr.toString();
        opt.textContent = yr.toString();
        select.appendChild(opt);
      }
    });
  }

  /* ==========================================================================
     3. Date Field Min Constraint (Block Past Dates)
     ========================================================================== */
  function initDateConstraints() {
    const dateInputs = document.querySelectorAll('input[type="date"]');
    const today = new Date().toISOString().split('T')[0];
    dateInputs.forEach(function (input) {
      input.setAttribute('min', today);
    });
  }

  /* ==========================================================================
     4. Homepage Inline Multi-Step Quote Form
     ========================================================================== */
  function initHeroQuoteForm() {
    const form = document.getElementById('amu-hero-quote-form');
    if (!form) return;

    function getProgressBar() {
      return form.querySelector('.amu-form-progress') ||
        form.closest('.amu-hero-form-card, .amu-quote-card, .amu-modal-content')?.querySelector('.amu-form-progress') ||
        document.querySelector('.amu-form-progress');
    }

    function getProgressSteps() {
      const bar = getProgressBar();
      return bar ? bar.querySelectorAll('.amu-progress-step') : form.querySelectorAll('.amu-progress-step');
    }

    // Global reset method for form reuse
    window.resetQuoteForm = function () {
      updateProgress(1);
      form.querySelectorAll('.amu-form-step').forEach(function (el) {
        el.style.display = '';
      });
      const prog = getProgressBar();
      if (prog) prog.style.display = '';
      if (statusBox) {
        statusBox.className = 'amu-form-status';
        statusBox.innerHTML = '';
      }
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Quote Request';
      }
    };

    let currentStep = 1;
    const totalSteps = 3;

    const step1 = form.querySelector('[data-step="1"]');
    const step2 = form.querySelector('[data-step="2"]');
    const step3 = form.querySelector('[data-step="3"]');

    const next1Btn = form.querySelector('.amu-next-step-1');
    const next2Btn = form.querySelector('.amu-next-step-2');
    const prev2Btn = form.querySelector('.amu-prev-step-2');
    const prev3Btn = form.querySelector('.amu-prev-step-3');
    const submitBtn = form.querySelector('.amu-submit-quote-btn');
    const statusBox = form.querySelector('.amu-form-status');

    function updateProgress(step) {
      currentStep = step;
      form.querySelectorAll('.amu-form-step').forEach(function (el) {
        el.classList.remove('active');
      });
      const activeStep = form.querySelector(`[data-step="${step}"]`);
      if (activeStep) activeStep.classList.add('active');

      getProgressSteps().forEach(function (el, idx) {
        el.classList.remove('active', 'completed');
        if (idx + 1 === step) {
          el.classList.add('active');
        } else if (idx + 1 < step) {
          el.classList.add('completed');
        }
      });
    }

    if (next1Btn) {
      next1Btn.addEventListener('click', function (e) {
        e.preventDefault();
        const pickZip = form.querySelector('[name="Pick-Up-ZIP-Code"]');
        const dropZip = form.querySelector('[name="Drop-Off-Zip-Code"]');

        if (!pickZip.value.trim() || !dropZip.value.trim()) {
          alert('Please provide both Pickup and Delivery ZIP codes.');
          if (!pickZip.value.trim()) pickZip.focus();
          else dropZip.focus();
          return;
        }

        // Cache in sessionStorage for user convenience
        sessionStorage.setItem('pickUpZip', pickZip.value.trim());
        sessionStorage.setItem('dropOffZip', dropZip.value.trim());
        const trailer = form.querySelector('input[name="Trailer-Type"]:checked');
        if (trailer) sessionStorage.setItem('trailerType', trailer.value);

        updateProgress(2);
      });
    }

    if (next2Btn) {
      next2Btn.addEventListener('click', function (e) {
        e.preventDefault();
        const year = form.querySelector('[name="Vehicle Make (Year)"]');
        const make = form.querySelector('[name="Vehicle-Make-Brand"]');
        const model = form.querySelector('[name="Vehicle-Model"]');

        if (!year.value || !make.value.trim() || !model.value.trim()) {
          alert('Please enter your vehicle year, make, and model.');
          if (!year.value) year.focus();
          else if (!make.value.trim()) make.focus();
          else model.focus();
          return;
        }

        updateProgress(3);
      });
    }

    if (prev2Btn) {
      prev2Btn.addEventListener('click', function (e) {
        e.preventDefault();
        updateProgress(1);
      });
    }

    if (prev3Btn) {
      prev3Btn.addEventListener('click', function (e) {
        e.preventDefault();
        updateProgress(2);
      });
    }

    // Submit handler
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Check anti-spam honeypot
      const hp = form.querySelector('.amu-hp-input');
      if (hp && hp.value) {
        console.warn('Bot detected via honeypot.');
        return;
      }

      const name = form.querySelector('[name="Full-Name-rq"]');
      const email = form.querySelector('[name="Email-rq"]');
      const phone = form.querySelector('[name="Phone-rq"]');
      const consent = form.querySelector('#hero-sms-consent');

      if (!name.value.trim() || !email.value.trim() || !phone.value.trim()) {
        alert('Please complete all contact information fields.');
        return;
      }

      if (consent && !consent.checked) {
        alert('Please check the SMS and communication consent box to proceed.');
        consent.focus();
        return;
      }

      const originalBtnText = submitBtn.textContent;
      submitBtn.textContent = 'Submitting Your Quote Request...';
      submitBtn.disabled = true;

      const formData = new FormData();
      formData.append('Pick-Up-ZIP-Code', form.querySelector('[name="Pick-Up-ZIP-Code"]').value.trim());
      formData.append('Drop-Off-Zip-Code', form.querySelector('[name="Drop-Off-Zip-Code"]').value.trim());

      const trailerInput = form.querySelector('input[name="Trailer-Type"]:checked');
      formData.append('Trailer-Type', trailerInput ? trailerInput.value : 'Open');

      formData.append('Vehicle Make (Year)', form.querySelector('[name="Vehicle Make (Year)"]').value);
      formData.append('Vehicle Make Brand', form.querySelector('[name="Vehicle-Make-Brand"]').value.trim());
      formData.append('Vehicle-Model', form.querySelector('[name="Vehicle-Model"]').value.trim());

      const operableInput = form.querySelector('input[name="Operable"]:checked');
      formData.append('Operable', operableInput ? operableInput.value : 'Yes');

      const priorityInput = form.querySelector('[name="Delivery-Priority"]');
      formData.append('Delivery-Priority', priorityInput ? priorityInput.value : 'Standard');

      const dateInput = form.querySelector('[name="Preferred Vehicle Delivery Date"]');
      formData.append('Preferred Vehicle Delivery Date', dateInput ? dateInput.value : '');

      const notesInput = form.querySelector('[name="Additional-Requests"]');
      formData.append('Additional-Requests', notesInput ? notesInput.value.trim() : '');

      formData.append('Full-Name-rq', name.value.trim());
      formData.append('Email-rq', email.value.trim());
      formData.append('Phone-rq', phone.value.trim());

      const methodInput = form.querySelector('input[name="Preferred-Contact-Method"]:checked');
      formData.append('Preferred-Contact-Method', methodInput ? methodInput.value : 'Phone/Call');

      fetch(QUOTE_ENDPOINT, {
        method: 'POST',
        body: formData,
      })
        .then(function (res) {
          if (res.ok) {
            statusBox.className = 'amu-form-status success';
            statusBox.innerHTML = `
              <strong>✓ Quote Request Received!</strong><br>
              Thank you, ${name.value.trim()}. Our nationwide dispatch coordinator is reviewing carrier schedules and will contact you promptly with your free customized rate.
              <br><br>Need immediate assistance? Call us directly at <a href="tel:7272558232" style="font-weight:700;color:#065F46;text-decoration:underline;">(727) 255-8232</a>.
            `;
            form.querySelectorAll('.amu-form-step').forEach(el => el.style.display = 'none');
            const prog = getProgressBar();
            if (prog) prog.style.display = 'none';
            form.reset();
          } else {
            throw new Error('Endpoint returned error status');
          }
        })
        .catch(function (err) {
          console.error('Quote submission error:', err);
          statusBox.className = 'amu-form-status error';
          statusBox.innerHTML = `
            <strong>Submission Notice:</strong> We encountered a connection issue while transmitting your request.<br>
            Please call our live team at <a href="tel:7272558232" style="font-weight:700;color:#991B1B;text-decoration:underline;">(727) 255-8232</a> or email <a href="mailto:info@automoveunited.com" style="color:#991B1B;text-decoration:underline;">info@automoveunited.com</a> to get your free quote immediately.
          `;
          submitBtn.textContent = originalBtnText;
          submitBtn.disabled = false;
        });
    });
  }

  /* ==========================================================================
     5. Dedicated Quote Page (`request-quote.html`) Form
     ========================================================================== */
  function initDedicatedQuoteForm() {
    const pageForm = document.getElementById('wf-form-request-quote');
    if (!pageForm) return;

    // Check prefill from sessionStorage
    const savedPickZip = sessionStorage.getItem('pickUpZip');
    const savedDropZip = sessionStorage.getItem('dropOffZip');
    const savedTrailer = sessionStorage.getItem('trailerType');

    const pickInput = pageForm.querySelector('#Pick-Up-ZIP-Code, [name="Pick-Up-ZIP-Code"]');
    const dropInput = pageForm.querySelector('#Drop-Off-Zip-Code, [name="Drop-Off-Zip-Code"]');

    if (savedPickZip && pickInput) pickInput.value = savedPickZip;
    if (savedDropZip && dropInput) dropInput.value = savedDropZip;

    if (savedTrailer) {
      const radio = pageForm.querySelector(`input[name="Trailer-Type"][value="${savedTrailer}"]`);
      if (radio) radio.checked = true;
    }

    // Connect standard multi-step submit if present
    const submitBtn = pageForm.querySelector('#Request-Quote-Submit-Button, .submit-btn');
    if (!submitBtn) return;

    pageForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const origText = submitBtn.value || submitBtn.textContent;
      submitBtn.value = 'Please wait...';
      submitBtn.disabled = true;

      const formData = new FormData(pageForm);

      fetch(QUOTE_ENDPOINT, {
        method: 'POST',
        body: formData
      })
        .then(function (res) {
          if (res.ok) {
            const doneBox = document.querySelector('.w-form-done');
            const failBox = document.querySelector('.w-form-fail');
            if (doneBox) doneBox.style.display = 'block';
            if (failBox) failBox.style.display = 'none';
            pageForm.style.display = 'none';
            pageForm.reset();
            sessionStorage.clear();
          } else {
            throw new Error('Response error');
          }
        })
        .catch(function () {
          const doneBox = document.querySelector('.w-form-done');
          const failBox = document.querySelector('.w-form-fail');
          if (failBox) failBox.style.display = 'block';
          if (doneBox) doneBox.style.display = 'none';
          submitBtn.value = origText;
          submitBtn.disabled = false;
        });
    });
  }

  /* ==========================================================================
     6. Contact Page Form (`contact.html`)
     ========================================================================== */
  function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('#contact-form-submit-btn, button[type="submit"], input[type="submit"]');
      const origText = submitBtn ? (submitBtn.value || submitBtn.textContent) : 'Submit';
      if (submitBtn) {
        if (submitBtn.value) submitBtn.value = 'Sending...';
        else submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
      }

      const formData = new FormData();
      formData.append('name', contactForm.querySelector('[name="name"]').value.trim());
      formData.append('email', contactForm.querySelector('[name="email"]').value.trim());
      formData.append('phone', contactForm.querySelector('[name="phone"]').value.trim());
      formData.append('message', contactForm.querySelector('[name="message"]').value.trim());

      fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        body: formData
      })
        .then(function (res) {
          if (res.ok) {
            const done = document.querySelector('.w-form-done, .amu-contact-success');
            const fail = document.querySelector('.w-form-fail, .amu-contact-error');
            if (done) done.style.display = 'block';
            if (fail) fail.style.display = 'none';
            contactForm.reset();
            contactForm.style.display = 'none';
          } else {
            throw new Error('Error sending contact');
          }
        })
        .catch(function () {
          const fail = document.querySelector('.w-form-fail, .amu-contact-error');
          if (fail) fail.style.display = 'block';
          if (submitBtn) {
            if (submitBtn.value) submitBtn.value = origText;
            else submitBtn.textContent = origText;
            submitBtn.disabled = false;
          }
        });
    });
  }

  /* ==========================================================================
     7. FAQ Accordions
     ========================================================================== */
  function initFaqAccordions() {
    const faqItems = document.querySelectorAll('.amu-faq-item');
    if (!faqItems.length) return;

    faqItems.forEach(function (item) {
      const questionBtn = item.querySelector('.amu-faq-question');
      if (!questionBtn) return;

      // Sync initial accessible state
      questionBtn.setAttribute('aria-expanded', item.classList.contains('active') ? 'true' : 'false');

      questionBtn.addEventListener('click', function () {
        const isActive = item.classList.contains('active');

        // Close siblings
        faqItems.forEach(function (sibling) {
          sibling.classList.remove('active');
          const btn = sibling.querySelector('.amu-faq-question');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        });

        if (!isActive) {
          item.classList.add('active');
          questionBtn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* ==========================================================================
     7.1 Resources Hub Interactivity (Instant Search, Category Filters, Card Clicks)
     ========================================================================== */
  function initResourcesHub() {
    const searchInput = document.getElementById('amu-resources-search');
    const clearBtn = document.getElementById('amu-resources-search-clear');
    const filterPills = document.querySelectorAll('.amu-filter-pill');
    const resourceCards = document.querySelectorAll('.amu-resource-card');
    const categorySections = document.querySelectorAll('.amu-resource-category-section');
    const countDisplay = document.getElementById('amu-resources-count-val');
    const emptyState = document.getElementById('amu-resources-empty');
    const resetBtn = document.getElementById('amu-resources-reset-btn');

    if (!resourceCards.length) return;

    let activeCategory = 'all';
    let searchQuery = '';

    function filterGuides() {
      let visibleCount = 0;
      const query = searchQuery.trim().toLowerCase();

      resourceCards.forEach(function (card) {
        const category = card.getAttribute('data-category') || '';
        const title = (card.querySelector('.amu-resource-title') ? card.querySelector('.amu-resource-title').textContent : '').toLowerCase();
        const excerpt = (card.querySelector('.amu-resource-excerpt') ? card.querySelector('.amu-resource-excerpt').textContent : '').toLowerCase();
        const tag = (card.querySelector('.amu-resource-tag') ? card.querySelector('.amu-resource-tag').textContent : '').toLowerCase();
        const keywords = (card.getAttribute('data-keywords') || '').toLowerCase();

        const matchesCategory = (activeCategory === 'all' || category === activeCategory);
        const matchesQuery = !query || title.includes(query) || excerpt.includes(query) || tag.includes(query) || keywords.includes(query);

        if (matchesCategory && matchesQuery) {
          card.classList.remove('is-hidden');
          visibleCount++;
        } else {
          card.classList.add('is-hidden');
        }
      });

      // Update category sections visibility
      categorySections.forEach(function (section) {
        const visibleInCat = section.querySelectorAll('.amu-resource-card:not(.is-hidden)').length;
        if (visibleInCat === 0) {
          section.classList.add('is-hidden');
        } else {
          section.classList.remove('is-hidden');
        }
      });

      // Update guide count indicator
      if (countDisplay) {
        countDisplay.textContent = visibleCount;
      }

      // Toggle empty search message
      if (emptyState) {
        if (visibleCount === 0) {
          emptyState.style.display = 'block';
        } else {
          emptyState.style.display = 'none';
        }
      }

      // Toggle clear button visibility
      if (clearBtn) {
        clearBtn.style.display = query.length > 0 ? 'inline-flex' : 'none';
      }
    }

    // Category filter pills
    filterPills.forEach(function (pill) {
      pill.addEventListener('click', function () {
        filterPills.forEach(function (p) { p.classList.remove('active'); });
        pill.classList.add('active');
        activeCategory = pill.getAttribute('data-category') || 'all';
        filterGuides();
      });
    });

    // Instant search input
    if (searchInput) {
      searchInput.addEventListener('input', function () {
        searchQuery = searchInput.value;
        filterGuides();
      });

      searchInput.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
          searchInput.value = '';
          searchQuery = '';
          filterGuides();
          searchInput.blur();
        }
      });
    }

    // Clear search button
    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        if (searchInput) {
          searchInput.value = '';
          searchQuery = '';
          filterGuides();
          searchInput.focus();
        }
      });
    }

    // Reset button in empty state
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        activeCategory = 'all';
        searchQuery = '';
        if (searchInput) searchInput.value = '';
        filterPills.forEach(function (p) {
          if (p.getAttribute('data-category') === 'all') {
            p.classList.add('active');
          } else {
            p.classList.remove('active');
          }
        });
        filterGuides();
      });
    }
  }

  /* ==========================================================================
     8. Popular Route Pre-fills
     ========================================================================== */
  function initRoutePrefills() {
    const routeBtns = document.querySelectorAll('[data-route-pickup]');
    routeBtns.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        const pick = btn.getAttribute('data-route-pickup') || '';
        const drop = btn.getAttribute('data-route-dropoff') || '';

        if (typeof window.openQuoteModal === 'function') {
          window.openQuoteModal({
            pickupZip: pick,
            dropoffZip: drop,
            title: 'Get Quote on this Route'
          });
          return;
        }

        sessionStorage.setItem('pickUpZip', pick);
        sessionStorage.setItem('dropOffZip', drop);
        window.location.href = 'request-quote.html';
      });
    });
  }



  /* ==========================================================================
     10. Site-Wide Scroll-Reveal Animation Engine (Intersection Observer)
     ========================================================================== */
  function initScrollReveals() {
    // Check reduced motion preference or missing IntersectionObserver
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      return;
    }

    // Enable animation CSS rules progressively
    document.documentElement.classList.add('amu-anim-ready');

    // Query all animatable elements across ALL pages
    const targets = document.querySelectorAll([
      '.amu-section-header',
      '.amu-reveal',
      '.amu-reveal-up',
      '.amu-reveal-left',
      '.amu-reveal-right',
      '.amu-reveal-scale',
      '.amu-stagger-group',
      '.amu-services-grid',
      '.amu-routes-grid',
      '.amu-why-grid',
      '.amu-faq-list',
      '.amu-pricing-factors-col',
      '.amu-table-wrap',
      '.amu-final-cta-content',
      '.amu-anim-heading',
      '.amu-anim-card',
      '.amu-slide-in-left',
      '.amu-slide-in-right',
      '.amu-resource-category-section'
    ].join(', '));

    if (!targets.length) return;

    // Trigger entrance when elements reach approximately 80–90% down the viewport
    const observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view', 'amu-revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -12% 0px',
      threshold: 0.06
    });

    targets.forEach(function (el) {
      // If already in top of viewport on load, reveal immediately
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.88 && rect.bottom > 0) {
        el.classList.add('in-view', 'amu-revealed');
      } else {
        observer.observe(el);
      }
    });

    // Safety fallback: reveal any remaining observed elements after 3.5s so nothing ever stays hidden
    setTimeout(function () {
      targets.forEach(function (el) {
        if (!el.classList.contains('in-view')) {
          el.classList.add('in-view', 'amu-revealed');
        }
      });
    }, 3500);
  }

  /* ==========================================================================
     11. Signature Interstate Highway Semi-Truck Driver
     ========================================================================== */
  function initHighwayTruckAnimation() {
    const highwaySection = document.getElementById('how-it-works');
    const corridor = document.getElementById('amu-highway-corridor');
    const truck = document.getElementById('amu-truck-vehicle');
    const checkpoints = document.querySelectorAll('.amu-checkpoint-node');

    if (!highwaySection || !truck) return;

    // Interactive clicking on checkpoint cards
    checkpoints.forEach(function (node, idx) {
      node.addEventListener('click', function () {
        checkpoints.forEach(n => n.classList.remove('active'));
        node.classList.add('active');
        const road = corridor ? corridor.querySelector('.amu-highway-road') : null;
        if (road) {
          const maxTravel = Math.max(0, road.clientWidth - truck.clientWidth);
          const targetX = (idx / 3) * maxTravel;
          truck.style.transform = `translateX(${targetX}px)`;
        }
      });
    });

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let ticking = false;
    function updateTruckOnScroll() {
      const rect = highwaySection.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const road = corridor ? corridor.querySelector('.amu-highway-road') : null;

      if (!road) return;

      const start = windowHeight * 0.85;
      const end = -rect.height * 0.35;
      const progress = (start - rect.top) / (start - end);
      const clamped = Math.min(1, Math.max(0, progress));

      const maxTravel = Math.max(0, road.clientWidth - truck.clientWidth);
      const currentX = clamped * maxTravel;
      truck.style.transform = `translateX(${currentX}px)`;

      const stepIdx = Math.min(3, Math.floor(clamped * 4));
      checkpoints.forEach(function (cp, i) {
        if (i <= stepIdx) {
          cp.classList.add('active');
        } else {
          cp.classList.remove('active');
        }
      });
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          updateTruckOnScroll();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    updateTruckOnScroll();
  }

  /* ==========================================================================
     12. Pricing Factor Cards Interaction (Click to Expand / Collapse Drawer)
     ========================================================================== */
  function initPricingFactors() {
    const factorCards = document.querySelectorAll('.amu-factor-card');
    if (!factorCards.length) return;

    factorCards.forEach(function (card) {
      card.addEventListener('click', function (e) {
        if (e.target.closest('a') || e.target.closest('button')) return;
        const isOpen = card.classList.contains('open');
        card.classList.toggle('open');
        card.setAttribute('aria-expanded', !isOpen);
      });

      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.click();
        }
      });
    });
  }

  /* ==========================================================================
     12b. Customer Reviews Carousel
     ========================================================================== */
  function initReviewsCarousel() {
    const track = document.getElementById('amu-reviews-track');
    const prevBtn = document.getElementById('amu-rev-prev');
    const nextBtn = document.getElementById('amu-rev-next');
    const dots = document.querySelectorAll('.amu-rev-dot');
    const cards = document.querySelectorAll('.amu-review-card');

    if (!track || !cards.length) return;

    let currentIndex = 0;
    const totalSlides = cards.length;

    function updateCarousel(index) {
      currentIndex = (index + totalSlides) % totalSlides;

      // Update dots
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === currentIndex);
      });

      // On mobile / small screens where track shifts:
      if (window.innerWidth <= 768) {
        const offset = currentIndex * 100;
        track.style.transform = `translateX(-${offset}%)`;
      } else {
        track.style.transform = 'none';
      }
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        updateCarousel(currentIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        updateCarousel(currentIndex + 1);
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        const targetSlide = parseInt(dot.getAttribute('data-slide'), 10) || 0;
        updateCarousel(targetSlide);
      });
    });

    window.addEventListener('resize', function () {
      updateCarousel(currentIndex);
    });

    // Touch swipe support on mobile
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', function (e) {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 45) {
        updateCarousel(currentIndex + 1);
      } else if (touchEndX - touchStartX > 45) {
        updateCarousel(currentIndex - 1);
      }
    }, { passive: true });
  }

  /* ==========================================================================
     13. Back to Top Button
     ========================================================================== */
  function initBackToTop() {
    const btn = document.getElementById('amu-back-to-top');
    if (!btn) return;

    let ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          if (window.scrollY > 400) {
            btn.classList.add('visible', 'amu-visible');
          } else {
            btn.classList.remove('visible', 'amu-visible');
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ==========================================================================
     14. AutoMove United 3-State Chatbot Controller
     ========================================================================== */
  function initChatbot() {
    const container = document.getElementById('amu-chatbot-container');
    const launcher = document.getElementById('amu-chatbot-launcher');
    const welcome = document.getElementById('amu-chatbot-welcome');
    const welcomeClose = document.getElementById('amu-chatbot-welcome-close');
    const startBtn = document.getElementById('amu-chatbot-start-btn');
    const panel = document.getElementById('amu-chatbot-panel');
    const panelClose = document.getElementById('amu-chatbot-panel-close');
    const messages = document.getElementById('amu-chatbot-messages');
    const input = document.getElementById('amu-chatbot-input');
    const sendBtn = document.getElementById('amu-chatbot-send');
    const optionBtns = document.querySelectorAll('[data-chat-answer]');

    if (!container || !launcher || !panel) return;

    const chatIcon = launcher.querySelector('.amu-launcher-icon-chat');
    const closeIcon = launcher.querySelector('.amu-launcher-icon-close');
    const badge = launcher.querySelector('.amu-chatbot-badge');

    const isDismissed = sessionStorage.getItem('amu_chat_welcome_dismissed');
    if (!isDismissed && welcome && window.innerWidth > 768) {
      setTimeout(function () {
        if (!panel.classList.contains('active')) {
          welcome.classList.add('active');
        }
      }, 2200);
    }

    function dismissWelcome() {
      if (welcome) welcome.classList.remove('active');
      sessionStorage.setItem('amu_chat_welcome_dismissed', 'true');
    }

    if (welcomeClose) {
      welcomeClose.addEventListener('click', function (e) {
        e.stopPropagation();
        dismissWelcome();
      });
    }

    function openPanel() {
      dismissWelcome();
      panel.classList.add('active');
      launcher.setAttribute('aria-expanded', 'true');
      if (chatIcon) chatIcon.style.display = 'none';
      if (closeIcon) closeIcon.style.display = 'block';
      if (badge) badge.style.display = 'none';
      if (input) input.focus();
    }

    function closePanel() {
      panel.classList.remove('active');
      launcher.setAttribute('aria-expanded', 'false');
      if (chatIcon) chatIcon.style.display = 'block';
      if (closeIcon) closeIcon.style.display = 'none';
    }

    launcher.addEventListener('click', function () {
      if (panel.classList.contains('active')) {
        closePanel();
      } else {
        openPanel();
      }
    });

    if (startBtn) {
      startBtn.addEventListener('click', openPanel);
    }

    if (panelClose) {
      panelClose.addEventListener('click', closePanel);
    }

    const answers = {
      quote: "To get an accurate free quote, complete the quote form at the top of the page with your pickup & delivery ZIP codes and vehicle details, or call our live dispatch team directly at (727) 255-8232.",
      time: "Transit time typically averages 1–3 days for regional routes under 500 miles, 3–5 days for 500–1,500 miles, and 7–9 days for transcontinental cross-country moves.",
      trailer: "Open transport is the most economical method used for over 90% of vehicles. Enclosed transport provides a sealed hard-sided enclosure shielding high-end luxury, exotic, or classic vehicles from all road debris and weather."
    };

    function addMessage(text, isUser) {
      if (!messages) return;
      const msg = document.createElement('div');
      msg.className = 'amu-chatbot-msg ' + (isUser ? 'user' : 'bot');
      const bubble = document.createElement('div');
      bubble.className = 'amu-chatbot-msg-bubble';
      bubble.textContent = text;
      msg.appendChild(bubble);
      messages.appendChild(msg);
      messages.scrollTop = messages.scrollHeight;
    }

    optionBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const key = btn.getAttribute('data-chat-answer');
        const questionText = btn.querySelector('span') ? btn.querySelector('span').textContent : btn.textContent;
        addMessage(questionText, true);

        setTimeout(function () {
          if (answers[key]) {
            addMessage(answers[key], false);
          } else {
            addMessage("Our dispatch team is happy to answer this! Please call us at (727) 255-8232 or submit your quote form above.", false);
          }
        }, 350);
      });
    });

    function handleUserInput() {
      if (!input) return;
      const val = input.value.trim();
      if (!val) return;

      addMessage(val, true);
      input.value = '';

      setTimeout(function () {
        addMessage("Thank you for reaching out! A nationwide dispatch coordinator can provide custom pricing immediately. Please call (727) 255-8232 or submit the quote form at the top of the page.", false);
      }, 500);
    }

    if (sendBtn) {
      sendBtn.addEventListener('click', handleUserInput);
    }

    if (input) {
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleUserInput();
        }
      });
    }
  }

  /* ==========================================================================
     17. Interactive Animated USA Shipping Map (Why AutoMove United)
     ========================================================================== */
  function initUsaShippingMap() {
    const stateElements = document.querySelectorAll('.amu-state-path');
    const stateNameEl = document.getElementById('amu-map-state-name');
    const stateBadgeEl = document.getElementById('amu-map-state-badge');
    const stateSubEl = document.getElementById('amu-map-callout-sub');
    const calloutEl = document.getElementById('amu-map-callout');

    if (!stateElements.length || !stateNameEl) return;

    const defaultState = {
      name: 'Nationwide Auto Shipping',
      badge: 'Daily Corridors',
      sub: 'Hover over any state &bull; <strong>Click for shipping information and a free quote &rarr;</strong>'
    };

    function updateCallout(name, code) {
      stateNameEl.textContent = name + (code ? ' (' + code + ')' : '');
      stateBadgeEl.textContent = 'Active Corridor';
      stateSubEl.innerHTML = 'Direct vehicle carrier routes in ' + name + '. <strong>Click for shipping information and a free quote &rarr;</strong>';
    }

    function resetCallout() {
      stateNameEl.textContent = defaultState.name;
      stateBadgeEl.textContent = defaultState.badge;
      stateSubEl.innerHTML = defaultState.sub;
    }

    function handleStateClick(e, stateEl) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      const stateName = stateEl.getAttribute('data-state') || '';
      const stateCode = stateEl.getAttribute('data-code') || '';

      if (typeof window.openQuoteModal === 'function') {
        window.openQuoteModal({
          state: stateName,
          code: stateCode
        });
      } else {
        window.location.href = 'request-quote.html';
      }
    }

    stateElements.forEach(function (el) {
      // Desktop Hover
      el.addEventListener('mouseenter', function () {
        const name = el.getAttribute('data-state');
        const code = el.getAttribute('data-code');
        updateCallout(name, code);
        el.classList.add('is-hovered');
      });

      el.addEventListener('mouseleave', function () {
        resetCallout();
        el.classList.remove('is-hovered');
      });

      // Click handling
      el.addEventListener('click', function (e) {
        handleStateClick(e, el);
      });

      // Touch handling for mobile devices
      el.addEventListener('touchstart', function (e) {
        stateElements.forEach(function (s) { s.classList.remove('is-hovered'); });
        el.classList.add('is-hovered');
        const name = el.getAttribute('data-state');
        const code = el.getAttribute('data-code');
        updateCallout(name, code);
      }, { passive: true });

      // Keyboard Accessibility (Enter / Space)
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleStateClick(e, el);
        }
      });

      el.addEventListener('focus', function () {
        const name = el.getAttribute('data-state');
        const code = el.getAttribute('data-code');
        updateCallout(name, code);
      });

      el.addEventListener('blur', function () {
        resetCallout();
      });
    });

    if (calloutEl) {
      calloutEl.addEventListener('click', function (e) {
        e.preventDefault();
        const currentState = stateNameEl ? stateNameEl.textContent.trim() : '';
        if (currentState && !currentState.includes('Nationwide')) {
          const match = currentState.match(/^([^(]+)(?:\s*\(([A-Z]{2})\))?/i);
          const name = match ? match[1].trim() : currentState;
          const code = match && match[2] ? match[2].trim() : '';
          if (typeof window.openQuoteModal === 'function') {
            window.openQuoteModal({ state: name, code: code });
            return;
          }
        }
        if (typeof window.openQuoteModal === 'function') {
          window.openQuoteModal();
        }
      });
    }

    /* -------------------------------------------------------------------------
       Random Truck Spawning & Route Gliding Animation System
       ------------------------------------------------------------------------- */
    const trucksLayer = document.getElementById('amu-map-trucks-layer') || document.querySelector('.amu-map-trucks-layer');
    if (!trucksLayer) return;

    const routeIds = [
      'route-south-eb', 'route-south-wb',
      'route-north-eb', 'route-north-wb',
      'route-east-sb', 'route-east-nb',
      'route-heart-sb', 'route-heart-nb',
      'route-west-sb', 'route-west-nb',
      'route-diag-wb', 'route-diag-eb',
      'route-central-eb', 'route-central-wb',
      'route-nw-eb', 'route-nw-wb',
      'route-nplains-eb', 'route-nplains-wb',
      'route-dakota-sb', 'route-dakota-nb',
      'route-bldakota-eb', 'route-bldakota-wb',
      'route-rocky-sb', 'route-rocky-nb'
    ];

    const routes = [];
    routeIds.forEach(function (id) {
      const el = document.getElementById(id);
      if (el && typeof el.getTotalLength === 'function') {
        const len = el.getTotalLength();
        if (len > 35) {
          routes.push({ id: id, el: el, length: len, activeCount: 0 });
        }
      }
    });

    if (!routes.length) return;

    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const activeTrucks = [];
    const TARGET_ACTIVE = 10;
    const FADE_TIME = 800; // ms for smooth appearance & disappearance

    function spawnTruck(initialElapsed, now) {
      if (!routes.length || prefersReducedMotion) return;

      // Pick a route with bias toward currently underutilized routes
      const candidates = routes.slice().sort(function (a, b) {
        return (a.activeCount - b.activeCount) || (0.5 - Math.random());
      });
      const pool = candidates.slice(0, Math.min(6, candidates.length));
      const route = pool[Math.floor(Math.random() * pool.length)];

      const L = route.length;
      // Variable speed between 34 and 52 SVG units per second
      const speed = 34 + Math.random() * 18;
      // Variable lifetime between 5.5s and 9.5s
      let duration = 5500 + Math.random() * 4000;
      let travelDist = speed * (duration / 1000);

      const safeMargin = 25;
      let startDist = safeMargin;
      if (travelDist >= L - safeMargin * 2) {
        travelDist = Math.max(10, L - safeMargin * 2);
        duration = (travelDist / speed) * 1000;
        startDist = safeMargin;
      } else {
        const maxStart = L - travelDist - safeMargin;
        startDist = safeMargin + Math.random() * Math.max(0, maxStart - safeMargin);
      }

      // Create SVG group for truck
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('class', 'amu-live-truck');
      g.setAttribute('pointer-events', 'none');
      g.setAttribute('opacity', '0');

      // Randomly select between the 3 high-detail commercial car carrier fleet variants
      const truckVariants = ['#amu-car-carrier-truck', '#amu-car-carrier-truck-2', '#amu-car-carrier-truck-3'];
      const chosenVariant = truckVariants[Math.floor(Math.random() * truckVariants.length)];

      const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
      use.setAttribute('href', chosenVariant);
      use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', chosenVariant);
      g.appendChild(use);
      trucksLayer.appendChild(g);

      route.activeCount++;

      const truck = {
        el: g,
        route: route,
        speed: speed,
        duration: duration,
        startDist: startDist,
        startTime: (now || performance.now()) - (initialElapsed || 0)
      };

      activeTrucks.push(truck);
      updateTruck(truck, now || performance.now());
    }

    function updateTruck(truck, now) {
      const elapsed = now - truck.startTime;
      if (elapsed >= truck.duration) {
        return false;
      }

      // Smooth fade in and fade out
      let opacity = 1;
      if (elapsed < FADE_TIME) {
        opacity = elapsed / FADE_TIME;
      } else if (elapsed > truck.duration - FADE_TIME) {
        opacity = Math.max(0, (truck.duration - elapsed) / FADE_TIME);
      }

      const dist = Math.min(truck.route.length, truck.startDist + (elapsed / 1000) * truck.speed);
      const pt = truck.route.el.getPointAtLength(dist);

      const lookAhead = Math.min(truck.route.length, dist + 4);
      let angle = 0;
      if (lookAhead > dist) {
        const ptNext = truck.route.el.getPointAtLength(lookAhead);
        angle = Math.atan2(ptNext.y - pt.y, ptNext.x - pt.x) * (180 / Math.PI);
      } else {
        const ptPrev = truck.route.el.getPointAtLength(Math.max(0, dist - 4));
        angle = Math.atan2(pt.y - ptPrev.y, pt.x - ptPrev.x) * (180 / Math.PI);
      }

      if (Math.abs(angle) > 90) {
        // Westbound / leftward travel: flip horizontally so wheels stay grounded on the route while cab faces forward
        const normAngle = angle > 0 ? angle - 180 : angle + 180;
        truck.el.setAttribute('transform', 'translate(' + pt.x.toFixed(2) + ',' + pt.y.toFixed(2) + ') rotate(' + normAngle.toFixed(2) + ') scale(-1, 1)');
      } else {
        // Eastbound / rightward travel: natural orientation
        truck.el.setAttribute('transform', 'translate(' + pt.x.toFixed(2) + ',' + pt.y.toFixed(2) + ') rotate(' + angle.toFixed(2) + ')');
      }
      truck.el.setAttribute('opacity', opacity.toFixed(3));
      return true;
    }

    let rafId = null;
    let isVisible = !document.hidden;
    let isInView = true;
    let lastSpawnTime = performance.now();
    let nextSpawnDelay = 800;

    function loop(now) {
      rafId = null;

      // Update active trucks
      for (let i = activeTrucks.length - 1; i >= 0; i--) {
        const t = activeTrucks[i];
        if (!updateTruck(t, now)) {
          if (t.el && t.el.parentNode) {
            t.el.parentNode.removeChild(t.el);
          }
          t.route.activeCount = Math.max(0, t.route.activeCount - 1);
          activeTrucks.splice(i, 1);
        }
      }

      // Continuous staggered spawning
      if (activeTrucks.length < TARGET_ACTIVE && now - lastSpawnTime >= nextSpawnDelay) {
        spawnTruck(0, now);
        lastSpawnTime = now;
        nextSpawnDelay = 650 + Math.random() * 850;
      }

      scheduleNextFrame();
    }

    function scheduleNextFrame() {
      if (!rafId && isVisible && isInView && !prefersReducedMotion) {
        rafId = requestAnimationFrame(loop);
      }
    }

    function stopAnimation() {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }

    // Seed initial trucks with staggered progress so the map is vibrant immediately
    const initialNow = performance.now();
    for (let i = 0; i < TARGET_ACTIVE; i++) {
      const staggeredElapsed = (i / TARGET_ACTIVE) * 5500 + Math.random() * 800;
      spawnTruck(staggeredElapsed, initialNow);
    }
    scheduleNextFrame();

    // Pause when document is hidden to conserve battery & prevent timer accumulation
    document.addEventListener('visibilitychange', function () {
      isVisible = (document.visibilityState === 'visible');
      if (isVisible) {
        const now = performance.now();
        activeTrucks.forEach(function (t) {
          t.startTime = now - (Math.random() * (t.duration * 0.6));
        });
        lastSpawnTime = now;
        scheduleNextFrame();
      } else {
        stopAnimation();
      }
    });

    // Pause when map is scrolled out of viewport
    const mapCard = document.getElementById('amu-why-map-card');
    if (mapCard && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          isInView = entry.isIntersecting;
          if (isInView) {
            scheduleNextFrame();
          } else {
            stopAnimation();
          }
        });
      }, { threshold: 0.05 });
      observer.observe(mapCard);
    }
  }

  /* ==========================================================================
     17. Reusable Dynamic "Get a Quote" Modal & Universal Quote Triggers
     ========================================================================== */
  const US_STATES = {
    AL: { name: 'Alabama', zip: '35203' },
    AK: { name: 'Alaska', zip: '99501' },
    AZ: { name: 'Arizona', zip: '85001' },
    AR: { name: 'Arkansas', zip: '72201' },
    CA: { name: 'California', zip: '90001' },
    CO: { name: 'Colorado', zip: '80202' },
    CT: { name: 'Connecticut', zip: '06101' },
    DE: { name: 'Delaware', zip: '19901' },
    FL: { name: 'Florida', zip: '33702' },
    GA: { name: 'Georgia', zip: '30301' },
    HI: { name: 'Hawaii', zip: '96801' },
    ID: { name: 'Idaho', zip: '83702' },
    IL: { name: 'Illinois', zip: '60601' },
    IN: { name: 'Indiana', zip: '46201' },
    IA: { name: 'Iowa', zip: '50301' },
    KS: { name: 'Kansas', zip: '67201' },
    KY: { name: 'Kentucky', zip: '40201' },
    LA: { name: 'Louisiana', zip: '70112' },
    ME: { name: 'Maine', zip: '04101' },
    MD: { name: 'Maryland', zip: '21201' },
    MA: { name: 'Massachusetts', zip: '02108' },
    MI: { name: 'Michigan', zip: '48201' },
    MN: { name: 'Minnesota', zip: '55401' },
    MS: { name: 'Mississippi', zip: '39201' },
    MO: { name: 'Missouri', zip: '63101' },
    MT: { name: 'Montana', zip: '59601' },
    NE: { name: 'Nebraska', zip: '68102' },
    NV: { name: 'Nevada', zip: '89101' },
    NH: { name: 'New Hampshire', zip: '03301' },
    NJ: { name: 'New Jersey', zip: '07101' },
    NM: { name: 'New Mexico', zip: '87101' },
    NY: { name: 'New York', zip: '10001' },
    NC: { name: 'North Carolina', zip: '27601' },
    ND: { name: 'North Dakota', zip: '58501' },
    OH: { name: 'Ohio', zip: '43215' },
    OK: { name: 'Oklahoma', zip: '73102' },
    OR: { name: 'Oregon', zip: '97201' },
    PA: { name: 'Pennsylvania', zip: '19104' },
    RI: { name: 'Rhode Island', zip: '02903' },
    SC: { name: 'South Carolina', zip: '29201' },
    SD: { name: 'South Dakota', zip: '57104' },
    TN: { name: 'Tennessee', zip: '37203' },
    TX: { name: 'Texas', zip: '75001' },
    UT: { name: 'Utah', zip: '84101' },
    VT: { name: 'Vermont', zip: '05602' },
    VA: { name: 'Virginia', zip: '23219' },
    WA: { name: 'Washington', zip: '98101' },
    WV: { name: 'West Virginia', zip: '25301' },
    WI: { name: 'Wisconsin', zip: '53202' },
    WY: { name: 'Wyoming', zip: '82001' }
  };

  function resolveState(input) {
    if (!input) return null;
    const clean = input.trim().toUpperCase();
    if (US_STATES[clean]) {
      return { code: clean, name: US_STATES[clean].name, zip: US_STATES[clean].zip };
    }
    for (const code in US_STATES) {
      if (US_STATES[code].name.toUpperCase() === clean) {
        return { code: code, name: US_STATES[code].name, zip: US_STATES[code].zip };
      }
    }
    return { code: '', name: input.trim(), zip: '' };
  }

  function initQuoteModal() {
    const modal = document.getElementById('amu-quote-modal');
    const heroForm = document.getElementById('amu-hero-quote-form');
    if (!modal && !heroForm) return;

    const dialog = modal ? modal.querySelector('.amu-modal-dialog') : null;
    const closeBtn = document.getElementById('amu-modal-close');
    const backdrop = document.getElementById('amu-modal-backdrop');
    const titleEl = document.getElementById('amu-modal-quote-title');
    const subEl = document.getElementById('amu-modal-quote-sub');
    const stateBadgeEl = document.getElementById('amu-modal-state-badge');
    const stateNameEl = document.getElementById('amu-modal-state-name');
    const stateClearBtn = document.getElementById('amu-modal-state-clear');
    const form = heroForm || (modal ? modal.querySelector('form') : null);

    function openQuoteModal(options) {
      let stateName = '';
      let stateCode = '';
      let pickupZip = '';
      let dropoffZip = '';
      let trailerType = '';
      let customTitle = '';

      if (typeof options === 'string') {
        stateName = options;
      } else if (options && typeof options === 'object') {
        stateName = options.state || '';
        stateCode = options.code || '';
        pickupZip = options.pickupZip || '';
        dropoffZip = options.dropoffZip || '';
        trailerType = options.trailerType || '';
        customTitle = options.title || '';
      }

      // If modal is not present (or we have direct hero quote form on homepage)
      if (!modal && form) {
        if (typeof window.resetQuoteForm === 'function') {
          const statusBox = form.querySelector('.amu-form-status');
          if (statusBox && statusBox.classList.contains('success')) {
            window.resetQuoteForm();
          }
        }

        if (stateName || stateCode) {
          const resolved = resolveState(stateCode || stateName);
          const displayName = resolved ? resolved.name : (stateName || stateCode);
          const defaultZip = resolved ? resolved.zip : '';

          if (stateBadgeEl && stateNameEl) {
            stateNameEl.textContent = displayName;
            stateBadgeEl.style.display = 'flex';
          }
          const pickInput = form.querySelector('[name="Pick-Up-ZIP-Code"]');
          if (pickInput) {
            pickInput.value = pickupZip || defaultZip || displayName;
          }
        } else {
          if (stateBadgeEl) stateBadgeEl.style.display = 'none';
          if (pickupZip) {
            const pickInput = form.querySelector('[name="Pick-Up-ZIP-Code"]');
            if (pickInput) pickInput.value = pickupZip;
          }
        }

        if (dropoffZip) {
          const dropInput = form.querySelector('[name="Drop-Off-Zip-Code"]');
          if (dropInput) dropInput.value = dropoffZip;
        }

        if (trailerType) {
          const trailerRadio = form.querySelector(`input[name="Trailer-Type"][value="${trailerType}"]`);
          if (trailerRadio) trailerRadio.checked = true;
        }

        const heroCard = document.getElementById('hero-quote-card') || form;
        heroCard.scrollIntoView({ behavior: 'smooth', block: 'center' });

        setTimeout(function () {
          const pickInput = form.querySelector('[name="Pick-Up-ZIP-Code"]');
          const dropInput = form.querySelector('[name="Drop-Off-Zip-Code"]');
          if (pickInput && !pickInput.value.trim()) {
            pickInput.focus();
          } else if (dropInput && !dropInput.value.trim()) {
            dropInput.focus();
          } else if (pickInput) {
            pickInput.focus();
          }
        }, 350);

        return;
      }

      // Fallback for modal if modal is present
      if (modal) {
        // Reset form progress and view state
        if (typeof window.resetQuoteForm === 'function') {
          window.resetQuoteForm();
        }

        // Handle State Context
        if (stateName || stateCode) {
          const resolved = resolveState(stateCode || stateName);
          const displayName = resolved ? resolved.name : (stateName || stateCode);
          const defaultZip = resolved ? resolved.zip : '';

          if (titleEl) {
            titleEl.textContent = 'Get a Quote for ' + displayName;
          }
          if (subEl) {
            subEl.textContent = 'Direct nationwide auto transport to or from ' + displayName + '. Rapid coordinator dispatch & competitive carrier rates.';
          }
          if (stateBadgeEl && stateNameEl) {
            stateNameEl.textContent = displayName;
            stateBadgeEl.style.display = 'flex';
          }

          if (form) {
            const pickInput = form.querySelector('[name="Pick-Up-ZIP-Code"]');
            if (pickInput) {
              pickInput.value = pickupZip || defaultZip;
            }
          }
        } else {
          // Generic / Default Title
          if (titleEl) {
            titleEl.textContent = customTitle || 'Get a Free Quote';
          }
          if (subEl) {
            subEl.textContent = 'Complete vehicle & route details below for real-time coordinator review.';
          }
          if (stateBadgeEl) {
            stateBadgeEl.style.display = 'none';
          }
          if (form) {
            const pickInput = form.querySelector('[name="Pick-Up-ZIP-Code"]');
            if (pickInput) pickInput.value = pickupZip || '';
          }
        }

        // Handle Route Drop-off ZIP
        if (form) {
          const dropInput = form.querySelector('[name="Drop-Off-Zip-Code"]');
          if (dropInput) dropInput.value = dropoffZip || '';
        }

        // Handle Trailer Type
        if (form && trailerType) {
          const trailerRadio = form.querySelector(`input[name="Trailer-Type"][value="${trailerType}"]`);
          if (trailerRadio) trailerRadio.checked = true;
        }

        // Open Modal
        modal.classList.add('is-active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('amu-modal-open');

        // Autofocus
        setTimeout(function () {
          if (!form) return;
          const pickInput = form.querySelector('[name="Pick-Up-ZIP-Code"]');
          const dropInput = form.querySelector('[name="Drop-Off-Zip-Code"]');
          if (pickInput && !pickInput.value.trim()) {
            pickInput.focus();
          } else if (dropInput) {
            dropInput.focus();
          }
        }, 150);
      }
    }

    function closeQuoteModal() {
      if (modal) {
        modal.classList.remove('is-active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('amu-modal-open');
      }
    }

    // Expose globally for map, routes, and external callers
    window.openQuoteModal = openQuoteModal;
    window.closeQuoteModal = closeQuoteModal;

    // Close triggers
    if (closeBtn) closeBtn.addEventListener('click', closeQuoteModal);
    if (backdrop) backdrop.addEventListener('click', closeQuoteModal);

    // Prevent backdrop close when clicking inside dialog
    if (dialog) {
      dialog.addEventListener('click', function (e) {
        e.stopPropagation();
      });
    }

    // Escape key listener
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal && modal.classList.contains('is-active')) {
        closeQuoteModal();
      }
    });

    // Clear state context chip
    if (stateClearBtn) {
      stateClearBtn.addEventListener('click', function () {
        if (stateBadgeEl) stateBadgeEl.style.display = 'none';
        if (titleEl) titleEl.textContent = 'Get a Free Quote';
        if (subEl) subEl.textContent = 'Complete vehicle & route details below for real-time coordinator review.';
        if (form) {
          const pickInput = form.querySelector('[name="Pick-Up-ZIP-Code"]');
          if (pickInput) {
            pickInput.value = '';
            pickInput.focus();
          }
        }
      });
    }

    // Universal Trigger Binding: All "Get a Quote" buttons & links
    const quoteTriggers = document.querySelectorAll(
      '[data-open-quote-modal], a[href="#quote-modal"], a[href="#quote-section"], a[href="#quote-form-card"], a[href="#amu-hero-quote-form"]'
    );

    quoteTriggers.forEach(function (trigger) {
      trigger.addEventListener('click', function (e) {
        e.preventDefault();

        // Close mobile drawer if currently open
        const mobileNav = document.querySelector('.amu-mobile-nav, .amu-mobile-drawer');
        const mobileBackdrop = document.querySelector('.amu-mobile-backdrop');
        if (mobileNav && mobileNav.classList.contains('open')) {
          mobileNav.classList.remove('open');
        }
        if (mobileBackdrop && mobileBackdrop.classList.contains('open')) {
          mobileBackdrop.classList.remove('open');
        }

        const trailer = trigger.getAttribute('data-trailer') || '';
        const title = trigger.getAttribute('data-quote-title') || '';
        openQuoteModal({
          trailerType: trailer,
          title: title
        });
      });
    });

    // Chatbot Quote button integration
    const chatQuoteBtn = document.querySelector('[data-chat-answer="quote"]');
    if (chatQuoteBtn) {
      chatQuoteBtn.addEventListener('click', function () {
        openQuoteModal();
      });
    }
  }

})();

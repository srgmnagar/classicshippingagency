/**
 * contact-form.js
 * FormSubmit AJAX handler for Classic Shipping Agency inquiry form.
 * Uses vanilla JavaScript — no jQuery, no page redirect.
 */

(function () {
  'use strict';

  /* ── Element references ────────────────────────────────────────────── */
  const form         = document.getElementById('inquiryForm');
  const submitBtn    = document.getElementById('submitBtn');
  const errorBanner  = document.getElementById('formErrorBanner');
  const successModal = document.getElementById('successModal');
  const closeModal   = document.getElementById('closeModal');

  if (!form) return; // Guard: only run on contact page

  /* ── Validation helpers ─────────────────────────────────────────────── */
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  // Accepts: +91 98765 43210 | 9876543210 | +919876543210 | 09876543210 etc.
  const PHONE_RE = /^[\+]?[\d\s\-\(\)]{7,20}$/;

  /**
   * Validate all form fields. Returns null on success, or an error string.
   */
  function validate() {
    const name    = document.getElementById('fullName').value.trim();
    const company = document.getElementById('companyName').value.trim();
    const email   = document.getElementById('userEmail').value.trim();
    const phone   = document.getElementById('userPhone').value.trim();
    const service = document.getElementById('serviceType').value;
    const message = document.getElementById('cargoMessage').value.trim();

    if (!name)                          return 'Contact Person Name is required.';
    if (name.length < 2)               return 'Contact Person Name must be at least 2 characters.';
    if (!company)                       return 'Company Name is required.';
    if (!email)                         return 'Corporate Email is required.';
    if (!EMAIL_RE.test(email))          return 'Please enter a valid email address (e.g. name@company.com).';
    if (!phone)                         return 'Contact Number is required.';
    if (!PHONE_RE.test(phone))          return 'Please enter a valid phone number (digits, spaces, +, - allowed).';
    if (!service)                       return 'Please select a Service Segment.';
    if (!message)                       return 'Inquiry details are required.';
    if (message.length < 20)           return 'Please provide more detail in your Inquiry (at least 20 characters).';

    return null; // All good
  }

  /* ── UI state helpers ───────────────────────────────────────────────── */
  function showError(msg) {
    errorBanner.textContent = msg;
    errorBanner.style.display = 'block';
    errorBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function hideError() {
    errorBanner.textContent = '';
    errorBanner.style.display = 'none';
  }

  function setLoading(isLoading) {
    if (isLoading) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin" style="margin-right:8px;"></i>Submitting...';
    } else {
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Submit Quote Inquiry <i class="fa-solid fa-paper-plane" style="margin-left:8px;"></i>';
    }
  }

  function showSuccessModal() {
    if (successModal) {
      successModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  /* ── Modal close ───────────────────────────────────────────────────── */
  if (closeModal) {
    closeModal.addEventListener('click', function () {
      if (successModal) {
        successModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // Also close on overlay click (outside the modal card)
  if (successModal) {
    successModal.addEventListener('click', function (e) {
      if (e.target === successModal) {
        successModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  /* ── FormSubmit AJAX endpoint (returns JSON, handles CORS correctly) ── */
  // Use /ajax/EMAIL — NOT /EMAIL which redirects and hangs fetch()
  const FORMSUBMIT_EMAIL = 'info@classicshippingagency.com';
  const AJAX_URL = 'https://formsubmit.co/ajax/' + FORMSUBMIT_EMAIL;

  /* ── Form submission ────────────────────────────────────────────────── */
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    hideError();

    // 1. Frontend validation
    const validationError = validate();
    if (validationError) {
      showError(validationError);
      return;
    }

    // 2. Loading state — prevent double-submit
    setLoading(true);

    // 3. Build FormData (includes all named + hidden fields)
    const formData = new FormData(form);

    // 4. AbortController — auto-cancel after 15 seconds so button never hangs
    const controller = new AbortController();
    const timeoutId  = setTimeout(function () { controller.abort(); }, 15000);

    try {
      // 5. POST to the /ajax/ endpoint — returns JSON, no redirect, no CORS issue
      const response = await fetch(AJAX_URL, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
        headers: { 'Accept': 'application/json' }
      });

      clearTimeout(timeoutId);

      // FormSubmit AJAX returns { "success": "true", "message": "..." }
      const data = await response.json().catch(function () { return {}; });

      if (response.ok && (data.success === 'true' || data.success === true)) {
        // 6a. Success — clear form, show modal
        form.reset();
        showSuccessModal();
      } else {
        // 6b. FormSubmit returned an error payload
        throw new Error(data.message || 'Submission failed. Status: ' + response.status);
      }

    } catch (err) {
      clearTimeout(timeoutId);

      if (err.name === 'AbortError') {
        // Request timed out
        showError(
          'The request timed out. Please check your internet connection and try again.'
        );
      } else {
        // Network or server error
        showError(
          'We could not send your enquiry at this moment. Please try again, or email us directly at info@classicshippingagency.com.'
        );
      }
    } finally {
      setLoading(false);
    }
  });

  /* ── Pre-fill service from URL query param (?service=vessel etc.) ─── */
  (function prefillFromUrl() {
    const params  = new URLSearchParams(window.location.search);
    const service = params.get('service');
    if (!service) return;

    const select = document.getElementById('serviceType');
    if (!select) return;

    // Match against option values (full text strings)
    const map = {
      customs:    'Custom House Agency (Customs Brokerage)',
      vessel:     'Vessel Agency Services (Husbandry & Port Clearance)',
      warehousing:'Warehousing Solutions (Bonded & Non-Bonded)',
      transport:  'Transportation & Inland Logistics',
      air:        'Air Freight Solutions',
      booking:    'Container Booking & Cargo Coordination',
      general:    'General Commercial Inquiry'
    };

    const targetValue = map[service.toLowerCase()];
    if (!targetValue) return;

    for (let i = 0; i < select.options.length; i++) {
      if (select.options[i].value === targetValue) {
        select.selectedIndex = i;
        break;
      }
    }
  })();

})();

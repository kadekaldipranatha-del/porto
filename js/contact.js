/**
 * CONTACT & UTILITIES MODULE
 * Form validation, copy-to-clipboard, timezone clock, and toast notifications
 */

document.addEventListener('DOMContentLoaded', () => {
  initEmailCopy();
  initTimezoneWidget();
  initContactForm();
});

/* ==========================================================================
   TOAST NOTIFICATION ENGINE
   ========================================================================== */

function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${type === 'success' ? '#22c55e' : '#38bdf8'}" stroke-width="2.5">
      ${type === 'success' 
        ? '<polyline points="20 6 9 17 4 12"></polyline>' 
        : '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>'
      }
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px) scale(0.95)';
    toast.style.transition = 'all 0.25s ease';
    setTimeout(() => toast.remove(), 250);
  }, 3500);
}

/* ==========================================================================
   COPY EMAIL TO CLIPBOARD
   ========================================================================== */

function initEmailCopy() {
  const copyBtn = document.getElementById('copy-email-btn');
  const emailElement = document.getElementById('email-address');

  if (!copyBtn || !emailElement) return;

  copyBtn.addEventListener('click', async () => {
    const email = emailElement.textContent.trim();

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(email);
      } else {
        // Fallback for non-https / legacy
        const textArea = document.createElement('textarea');
        textArea.value = email;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }

      // Visual button feedback
      const copyIcon = copyBtn.querySelector('.copy-icon');
      const checkIcon = copyBtn.querySelector('.check-icon');

      if (copyIcon && checkIcon) {
        copyIcon.classList.add('hidden');
        checkIcon.classList.remove('hidden');

        setTimeout(() => {
          copyIcon.classList.remove('hidden');
          checkIcon.classList.add('hidden');
        }, 2000);
      }

      showToast('Email address copied to clipboard!', 'success');
    } catch (err) {
      showToast('Could not copy email automatically.', 'info');
    }
  });
}

/* ==========================================================================
   LIVE TIMEZONE CLOCK (San Francisco, CA — Pacific Time)
   ========================================================================== */

function initTimezoneWidget() {
  const timeDisplay = document.getElementById('live-time-display');
  if (!timeDisplay) return;

  function updateTime() {
    try {
      const options = {
        timeZone: 'America/Los_Angeles',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      };
      const sfTime = new Intl.DateTimeFormat([], options).format(new Date());
      timeDisplay.textContent = `${sfTime} (PT)`;
    } catch (e) {
      const now = new Date();
      timeDisplay.textContent = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')} Local`;
    }
  }

  updateTime();
  setInterval(updateTime, 10000);
}

/* ==========================================================================
   CONTACT FORM VALIDATION & SUBMISSION
   ========================================================================== */

function initContactForm() {
  const form = document.getElementById('contact-form');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');
  const charCount = document.getElementById('message-char-count');
  const submitBtn = document.getElementById('submit-btn');
  const formAlert = document.getElementById('form-alert');

  if (!form) return;

  // Character counter for message textarea
  messageInput?.addEventListener('input', () => {
    const len = messageInput.value.length;
    if (charCount) {
      charCount.textContent = `${len} / 1000`;
    }
  });

  // Validation helper
  function validateField(input, errorEl, ruleFn, errorMsg) {
    const val = input.value.trim();
    if (!ruleFn(val)) {
      input.classList.add('input-error');
      if (errorEl) errorEl.textContent = errorMsg;
      return false;
    } else {
      input.classList.remove('input-error');
      if (errorEl) errorEl.textContent = '';
      return true;
    }
  }

  const isEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  const isNotEmpty = (val) => val.length >= 2;
  const isMessageValid = (val) => val.length >= 10;

  // Blur validation
  nameInput?.addEventListener('blur', () => {
    validateField(nameInput, document.getElementById('name-error'), isNotEmpty, 'Please enter your name (minimum 2 characters).');
  });

  emailInput?.addEventListener('blur', () => {
    validateField(emailInput, document.getElementById('email-error'), isEmail, 'Please provide a valid email address.');
  });

  messageInput?.addEventListener('blur', () => {
    validateField(messageInput, document.getElementById('message-error'), isMessageValid, 'Message must be at least 10 characters.');
  });

  // Form submit handler
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const isNameValid = validateField(nameInput, document.getElementById('name-error'), isNotEmpty, 'Please enter your name.');
    const isEmailOk = validateField(emailInput, document.getElementById('email-error'), isEmail, 'Please enter a valid email.');
    const isMsgOk = validateField(messageInput, document.getElementById('message-error'), isMessageValid, 'Please enter your message (min 10 chars).');

    if (!isNameValid || !isEmailOk || !isMsgOk) {
      return;
    }

    // Set UI loading state
    const btnText = submitBtn.querySelector('.btn-text');
    const sendIcon = submitBtn.querySelector('.send-icon');
    const spinner = submitBtn.querySelector('.spinner');

    btnText.textContent = 'Sending Message...';
    sendIcon?.classList.add('hidden');
    spinner?.classList.remove('hidden');
    submitBtn.disabled = true;

    // Simulate reliable async transmission
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Reset button UI
    btnText.textContent = 'Send Message';
    sendIcon?.classList.remove('hidden');
    spinner?.classList.add('hidden');
    submitBtn.disabled = false;

    // Show success alert
    if (formAlert) {
      formAlert.className = 'form-alert success';
      formAlert.textContent = `Thank you, ${nameInput.value.trim()}! Your message has been sent successfully. I will get back to you within 24 hours.`;
      formAlert.classList.remove('hidden');
    }

    showToast('Message sent successfully! Looking forward to connecting.', 'success');

    // Reset form
    form.reset();
    if (charCount) charCount.textContent = '0 / 1000';
  });
}

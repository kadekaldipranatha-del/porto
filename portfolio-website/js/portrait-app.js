/**
 * PORTRAIT PORTFOLIO SCRIPT
 * Theme switching, print CV, copy email toast, quick form handler
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initPrintBtn();
  initCopyEmail();
  initQuickForm();
  initCopyrightYear();
});

/* ==========================================================================
   THEME TOGGLE CONTROLLER
   ========================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const storedTheme = localStorage.getItem('portrait_theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  const currentTheme = storedTheme || (systemPrefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', currentTheme);

  themeToggleBtn?.addEventListener('click', () => {
    const activeTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = activeTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('portrait_theme', newTheme);
  });
}

/* ==========================================================================
   PRINT / PDF EXPORT HANDLER
   ========================================================================== */
function initPrintBtn() {
  const printBtn = document.getElementById('print-cv-btn');
  printBtn?.addEventListener('click', () => {
    window.print();
  });
}

/* ==========================================================================
   TOAST ALERT HELPER
   ========================================================================== */
function showToast(message) {
  const toastBox = document.getElementById('toast-box');
  if (!toastBox) return;

  const toast = document.createElement('div');
  toast.className = 'toast toast-success';
  toast.style.pointerEvents = 'auto';
  toast.innerHTML = `
    <span style="font-size: 14px;">✅</span>
    <span>${message}</span>
  `;

  toastBox.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.25s ease';
    setTimeout(() => toast.remove(), 250);
  }, 3000);
}

/* ==========================================================================
   COPY EMAIL ACTIONS
   ========================================================================== */
function initCopyEmail() {
  const emailVal = "alex.rivera.dev@gmail.com";
  const heroBtn = document.getElementById('copy-email-hero-btn');
  const directBtn = document.getElementById('copy-email-direct-btn');

  async function handleCopy() {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(emailVal);
      } else {
        const temp = document.createElement('textarea');
        temp.value = emailVal;
        temp.style.position = 'fixed';
        temp.style.left = '-9999px';
        document.body.appendChild(temp);
        temp.focus();
        temp.select();
        document.execCommand('copy');
        temp.remove();
      }

      showToast(`Alamat email (${emailVal}) berhasil disalin!`);
    } catch (e) {
      showToast('Gagal menyalin email otomatis.');
    }
  }

  heroBtn?.addEventListener('click', handleCopy);
  directBtn?.addEventListener('click', handleCopy);
}

/* ==========================================================================
   QUICK MESSAGE FORM (SIMULATION / WHATSAPP REDIRECT)
   ========================================================================== */
function initQuickForm() {
  const form = document.getElementById('quick-message-form');
  const alertBox = document.getElementById('form-msg-alert');
  const sendBtn = document.getElementById('send-msg-btn');

  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('sender-name')?.value.trim();
    const contact = document.getElementById('sender-contact')?.value.trim();
    const message = document.getElementById('sender-message')?.value.trim();

    if (!name || !contact || !message) {
      if (alertBox) {
        alertBox.className = 'form-alert error';
        alertBox.textContent = 'Mohon lengkapi seluruh kolom formulir.';
        alertBox.classList.remove('hidden');
      }
      return;
    }

    sendBtn.disabled = true;
    sendBtn.innerHTML = '<span>Mengirimkan...</span>';

    setTimeout(() => {
      sendBtn.disabled = false;
      sendBtn.innerHTML = '<span>Kirimkan Pesan</span>';

      if (alertBox) {
        alertBox.className = 'form-alert success';
        alertBox.textContent = `Terima kasih, ${name}! Pesan Anda telah terkirim. Saya akan segera membalas ke ${contact}.`;
        alertBox.classList.remove('hidden');
      }

      showToast('Pesan berhasil dikirim!');
      form.reset();
    }, 600);
  });
}

/* ==========================================================================
   AUTO CURRENT YEAR
   ========================================================================== */
function initCopyrightYear() {
  const el = document.getElementById('year-text');
  if (el) {
    el.textContent = new Date().getFullYear();
  }
}

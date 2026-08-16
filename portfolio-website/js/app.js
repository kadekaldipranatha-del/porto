/**
 * MAIN APP MODULE
 * Theme switcher, mobile drawer navigation, scroll spy, and timeline renderer
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initTimeline();
  initNavigation();
  initMobileDrawer();
  initCopyrightYear();
});

/* ==========================================================================
   THEME SWITCHER ENGINE (Dark / Light)
   ========================================================================== */

function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const storedTheme = localStorage.getItem('portfolio_theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  const currentTheme = storedTheme || (systemPrefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', currentTheme);

  themeToggleBtn?.addEventListener('click', () => {
    const activeTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = activeTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('portfolio_theme', newTheme);
  });
}

/* ==========================================================================
   EXPERIENCE TIMELINE RENDERER
   ========================================================================== */

function initTimeline() {
  const container = document.getElementById('timeline-container');
  if (!container || !PORTFOLIO_DATA.experience) return;

  container.innerHTML = PORTFOLIO_DATA.experience.map(item => `
    <div class="timeline-item">
      <div class="timeline-dot" aria-hidden="true"></div>
      <div class="timeline-content">
        <div class="timeline-header">
          <div>
            <h3 class="timeline-role">${item.role}</h3>
            <span class="timeline-company">${item.company} • ${item.location}</span>
          </div>
          <span class="timeline-period">${item.period}</span>
        </div>
        <p class="timeline-desc">${item.desc}</p>
        <ul class="timeline-achievements">
          ${item.achievements.map(ach => `<li>${ach}</li>`).join('')}
        </ul>
        <div class="timeline-tags">
          ${item.tags.map(t => `<span class="timeline-tag">${t}</span>`).join('')}
        </div>
      </div>
    </div>
  `).join('');
}

/* ==========================================================================
   NAVIGATION & SCROLL SPY
   ========================================================================== */

function initNavigation() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-desktop .nav-link');

  function updateActiveNav() {
    const scrollY = window.scrollY;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();
}

/* ==========================================================================
   MOBILE DRAWER NAVIGATION
   ========================================================================== */

function initMobileDrawer() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const drawer = document.getElementById('mobile-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-contact-btn');

  if (!menuBtn || !drawer) return;

  function toggleDrawer() {
    const isOpen = drawer.classList.contains('open');
    if (isOpen) {
      drawer.classList.remove('open');
      drawer.setAttribute('aria-hidden', 'true');
      menuBtn.setAttribute('aria-expanded', 'false');
    } else {
      drawer.classList.add('open');
      drawer.setAttribute('aria-hidden', 'false');
      menuBtn.setAttribute('aria-expanded', 'true');
    }
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    menuBtn.setAttribute('aria-expanded', 'false');
  }

  menuBtn.addEventListener('click', toggleDrawer);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/* ==========================================================================
   FOOTER COPYRIGHT YEAR
   ========================================================================== */

function initCopyrightYear() {
  const yearEl = document.getElementById('copyright-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

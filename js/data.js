/**
 * PORTFOLIO DATA STORE
 * Projects, Skills, and Experience Data
 */

const PORTFOLIO_DATA = {
  // Skills Matrix
  skills: [
    {
      id: 'react-next',
      name: 'React 19 & Next.js 15',
      category: 'frontend',
      level: 95,
      badge: 'Expert',
      desc: 'Server Components (RSC), Streaming SSR, App Router, and Suspense architecture.'
    },
    {
      id: 'typescript',
      name: 'TypeScript & Type Systems',
      category: 'frontend',
      level: 94,
      badge: 'Expert',
      desc: 'Strict typing, generics, AST transformations, and zero-runtime type safety.'
    },
    {
      id: 'modern-javascript',
      name: 'Modern ESNext & Web APIs',
      category: 'frontend',
      level: 96,
      badge: 'Expert',
      desc: 'Async iterators, Web Workers, IntersectionObserver, Web Streams, and Canvas.'
    },
    {
      id: 'css-architecture',
      name: 'CSS Architecture & Tokens',
      category: 'css',
      level: 98,
      badge: 'Mastery',
      desc: 'Custom properties, container queries, fluid typography, BEM/utility layers, and CSS modules.'
    },
    {
      id: 'design-systems',
      name: 'Design Systems & Storybook',
      category: 'css',
      level: 92,
      badge: 'Advanced',
      desc: 'Token pipeline, headless UI (Radix/Aria), multi-brand theming, and accessibility testing.'
    },
    {
      id: 'accessibility',
      name: 'Web Accessibility (a11y)',
      category: 'css',
      level: 90,
      badge: 'Advanced',
      desc: 'WCAG 2.1 AAA compliance, screen reader tree optimization, and keyboard trap prevention.'
    },
    {
      id: 'state-management',
      name: 'State Management & Querying',
      category: 'architecture',
      level: 93,
      badge: 'Expert',
      desc: 'TanStack Query, Zustand, XState finite state machines, and optimistic mutations.'
    },
    {
      id: 'web-performance',
      name: 'Web Vitals & Profiling',
      category: 'architecture',
      level: 96,
      badge: 'Expert',
      desc: 'LCP/INP/CLS debugging, bundle splitting, memory leak diagnosis, and resource hints.'
    },
    {
      id: 'testing-qa',
      name: 'Automated Testing Suites',
      category: 'tools',
      level: 88,
      badge: 'Advanced',
      desc: 'Playwright E2E, Vitest, React Testing Library, and visual regression with Chromatic.'
    },
    {
      id: 'build-tooling',
      name: 'Build Tooling & Bundlers',
      category: 'tools',
      level: 90,
      badge: 'Advanced',
      desc: 'Vite, Turbopack, Rollup plugins, Docker containerization, and CI/CD pipelines.'
    },
    {
      id: 'graphql-rest',
      name: 'GraphQL & Realtime APIs',
      category: 'architecture',
      level: 89,
      badge: 'Advanced',
      desc: 'GraphQL codegen, WebSockets telemetry, SSE, and resilient offline cache synchronization.'
    },
    {
      id: 'git-monorepos',
      name: 'Monorepo Architecture',
      category: 'tools',
      level: 87,
      badge: 'Advanced',
      desc: 'Turborepo, pnpm workspaces, semantic versioning, and shared package orchestration.'
    }
  ],

  // Featured Projects
  projects: [
    {
      id: 'prism-design-system',
      title: 'Prism — Enterprise Design System',
      category: 'design-systems',
      categoryLabel: 'Design System',
      featured: true,
      summary: 'A multi-brand, highly accessible React component system and token engine adopted across 20+ engineering teams.',
      heroSvg: `<svg viewBox="0 0 400 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#0c1322"/>
        <!-- Design system grid layout -->
        <rect x="25" y="25" width="165" height="65" rx="8" fill="#162032" stroke="#25354e" stroke-width="1.5"/>
        <rect x="35" y="38" width="55" height="12" rx="3" fill="#38bdf8"/>
        <rect x="35" y="58" width="130" height="8" rx="2" fill="#475569"/>
        <rect x="35" y="70" width="90" height="8" rx="2" fill="#334155"/>
        
        <rect x="205" y="25" width="170" height="65" rx="8" fill="#162032" stroke="#25354e" stroke-width="1.5"/>
        <circle cx="230" cy="55" r="16" fill="#0284c7"/>
        <rect x="255" y="44" width="70" height="10" rx="2" fill="#f8fafc"/>
        <rect x="255" y="60" width="100" height="8" rx="2" fill="#64748b"/>
        
        <rect x="25" y="105" width="350" height="70" rx="8" fill="#162032" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="4"/>
        <rect x="40" y="125" width="70" height="28" rx="6" fill="#0284c7"/>
        <text x="56" y="143" fill="#ffffff" font-size="11" font-weight="bold" font-family="sans-serif">Button</text>
        <rect x="120" y="125" width="80" height="28" rx="6" fill="transparent" stroke="#38bdf8" stroke-width="1.5"/>
        <text x="135" y="143" fill="#38bdf8" font-size="11" font-weight="bold" font-family="sans-serif">Outline</text>
        <rect x="210" y="125" width="150" height="28" rx="6" fill="#0b111e" stroke="#334155"/>
        <text x="225" y="143" fill="#64748b" font-size="11" font-family="sans-serif">Input field...</text>
      </svg>`,
      tags: ['React', 'TypeScript', 'Storybook', 'WCAG AAA', 'Design Tokens'],
      metrics: '40% reduction in UI development cycle time across 200+ engineers',
      problem: 'Multiple teams across product lines were building duplicate components with inconsistent UX, broken contrast ratios, and fragmented styles.',
      solution: 'Architected a unified token repository compiling to CSS variables, JavaScript constants, and iOS/Android configs. Built 50+ headless, fully accessible components with zero runtime CSS overhead.',
      architecture: 'Monorepo built with Turborepo, documented in Storybook with automated Chromatic visual regression and Axe accessibility CI checks.',
      liveUrl: 'https://github.com',
      githubUrl: 'https://github.com'
    },
    {
      id: 'telemetry-stream-dashboard',
      title: 'Vortex — Real-Time Telemetry Analytics',
      category: 'web-apps',
      categoryLabel: 'Web Application',
      featured: true,
      summary: 'High-frequency metrics visualization platform rendering 100,000+ data points per second with zero UI jank.',
      heroSvg: `<svg viewBox="0 0 400 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#090f1a"/>
        <!-- Chart mockup -->
        <path d="M 30 160 Q 90 90, 150 120 T 260 60 T 370 40" fill="none" stroke="#38bdf8" stroke-width="3"/>
        <path d="M 30 160 Q 90 90, 150 120 T 260 60 T 370 40 L 370 170 L 30 170 Z" fill="url(#grad1)" opacity="0.2"/>
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#38bdf8" />
            <stop offset="100%" stop-color="#090f1a" stop-opacity="0" />
          </linearGradient>
        </defs>
        <!-- Data nodes -->
        <circle cx="150" cy="120" r="5" fill="#10b981"/>
        <circle cx="260" cy="60" r="5" fill="#38bdf8"/>
        <circle cx="370" cy="40" r="6" fill="#f59e0b"/>
        <!-- Grid horizontal lines -->
        <line x1="30" y1="50" x2="370" y2="50" stroke="#1e293b" stroke-width="1" stroke-dasharray="3"/>
        <line x1="30" y1="100" x2="370" y2="100" stroke="#1e293b" stroke-width="1" stroke-dasharray="3"/>
        <line x1="30" y1="150" x2="370" y2="150" stroke="#1e293b" stroke-width="1" stroke-dasharray="3"/>
        <!-- Header metric badge -->
        <rect x="30" y="15" width="90" height="22" rx="4" fill="#162032"/>
        <text x="38" y="30" fill="#34d399" font-size="10" font-family="monospace">● 60 FPS STREAM</text>
      </svg>`,
      tags: ['Next.js', 'Canvas API', 'WebSockets', 'Web Workers', 'Tailored CSS'],
      metrics: 'Constant 60 FPS render loops while processing 100k msg/sec',
      problem: 'Existing React dashboard suffered from severe render blocking and frame drops when streaming large live time-series server datasets.',
      solution: 'Offloaded incoming WebSocket message decoding to Web Workers and replaced heavy SVG chart rendering with a lightweight offscreen HTML5 Canvas pipeline.',
      architecture: 'Next.js 14 App Router, Web Workers with SharedArrayBuffer, custom Canvas 2D render loop, and virtualized tables.',
      liveUrl: 'https://github.com',
      githubUrl: 'https://github.com'
    },
    {
      id: 'hyper-commerce-engine',
      title: 'Aura — Headless Commerce Experience',
      category: 'web-apps',
      categoryLabel: 'Web Application',
      featured: true,
      summary: 'Ultra-minimal luxury e-commerce platform boasting a 99 Lighthouse score and sub-100ms page transitions.',
      heroSvg: `<svg viewBox="0 0 400 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#0d1117"/>
        <!-- Product card grid -->
        <rect x="30" y="30" width="155" height="140" rx="8" fill="#161b22" stroke="#30363d"/>
        <circle cx="107" cy="80" r="30" fill="#21262d"/>
        <rect x="45" y="125" width="80" height="8" rx="2" fill="#f0f6fc"/>
        <rect x="45" y="140" width="45" height="8" rx="2" fill="#38bdf8"/>
        
        <rect x="215" y="30" width="155" height="140" rx="8" fill="#161b22" stroke="#30363d"/>
        <polygon points="292,50 325,100 260,100" fill="#21262d"/>
        <rect x="230" y="125" width="85" height="8" rx="2" fill="#f0f6fc"/>
        <rect x="230" y="140" width="50" height="8" rx="2" fill="#38bdf8"/>
      </svg>`,
      tags: ['TypeScript', 'Next.js', 'GraphQL', 'Edge Functions', 'Optimistic UI'],
      metrics: '34% increase in mobile checkout conversion; 99/100 Lighthouse performance',
      problem: 'Monolithic storefront was bogged down with heavy legacy scripts, causing 4.5s LCP on mobile and high bounce rates.',
      solution: 'Re-engineered the entire storefront onto a headless stack with Edge CDN routing, image pre-generation, and optimistic cart checkout mutations.',
      architecture: 'Next.js SSG + ISR, Shopify Storefront GraphQL API, Cloudflare Workers edge caching, and tailored CSS animation engine.',
      liveUrl: 'https://github.com',
      githubUrl: 'https://github.com'
    },
    {
      id: 'turbopack-bundle-inspector',
      title: 'PackLens — Bundle Analyzer CLI & Web UI',
      category: 'devtools',
      categoryLabel: 'DevTools & Open Source',
      featured: true,
      summary: 'An open-source interactive dependency graph visualizer and tree-shaking auditor for modern JavaScript bundles.',
      heroSvg: `<svg viewBox="0 0 400 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#0b111e"/>
        <!-- Treemap / visualizer blocks -->
        <rect x="30" y="30" width="190" height="85" rx="4" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5"/>
        <text x="40" y="55" fill="#38bdf8" font-size="11" font-family="monospace">vendor-core.js (42 KB)</text>
        
        <rect x="230" y="30" width="140" height="85" rx="4" fill="#1e293b" stroke="#10b981" stroke-width="1.5"/>
        <text x="240" y="55" fill="#34d399" font-size="11" font-family="monospace">ui-kit.js (18 KB)</text>
        
        <rect x="30" y="125" width="110" height="50" rx="4" fill="#1e293b" stroke="#f59e0b" stroke-width="1.5"/>
        <text x="40" y="152" fill="#fbbf24" font-size="10" font-family="monospace">utils.js</text>
        
        <rect x="150" y="125" width="220" height="50" rx="4" fill="#1e293b" stroke="#a855f7" stroke-width="1.5"/>
        <text x="160" y="152" fill="#c084fc" font-size="10" font-family="monospace">icons-chunk.js (Duplicate detected!)</text>
      </svg>`,
      tags: ['TypeScript', 'Node.js', 'D3.js / SVG', 'CLI', 'Tree-shaking'],
      metrics: '3,200+ GitHub stars and 80k+ weekly npm downloads',
      problem: 'Engineers struggled to identify duplicate packages and non-tree-shakeable module imports causing silent bundle bloat.',
      solution: 'Built an ultra-fast AST scanner and interactive zoomable treemap that highlights duplicate dependencies and suggests optimization strategies.',
      architecture: 'TypeScript CLI built on esbuild, paired with a zero-dependency SVG treemap renderer.',
      liveUrl: 'https://github.com',
      githubUrl: 'https://github.com'
    },
    {
      id: 'motion-canvas-engine',
      title: 'Kinetics — Physics & Spring Animation Library',
      category: 'devtools',
      categoryLabel: 'Open Source / UI',
      featured: false,
      summary: 'Lightweight (1.8 KB) spring physics animation engine designed for 120Hz gesture-driven web interfaces.',
      heroSvg: `<svg viewBox="0 0 400 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#0a0f1d"/>
        <!-- Physics curve -->
        <path d="M 30 150 C 90 20, 140 180, 200 80 C 260 130, 310 95, 370 100" fill="none" stroke="#a855f7" stroke-width="3"/>
        <circle cx="200" cy="80" r="7" fill="#c084fc"/>
        <circle cx="370" cy="100" r="7" fill="#38bdf8"/>
        <!-- Grid -->
        <line x1="30" y1="100" x2="370" y2="100" stroke="#1e293b" stroke-width="1" stroke-dasharray="4"/>
        <text x="35" y="35" fill="#a855f7" font-size="11" font-family="monospace">Spring: { tension: 170, friction: 26 }</text>
      </svg>`,
      tags: ['Vanilla JS', 'Spring Physics', 'Web Animations API', 'Micro-interactions'],
      metrics: '1.8 KB gzipped with zero external dependencies',
      problem: 'Standard CSS easing curves lack natural momentum and cannot respond fluidly to mid-gesture velocity interrupts.',
      solution: 'Created an analytical spring solver that models dampening and mass with instant velocity handover for drag and swipe gestures.',
      architecture: 'Pure JavaScript using requestAnimationFrame and direct CSS matrix transforms.',
      liveUrl: 'https://github.com',
      githubUrl: 'https://github.com'
    },
    {
      id: 'cloud-editor-ide',
      title: 'Codex — Web-Based Markdown & Code IDE',
      category: 'web-apps',
      categoryLabel: 'Web Application',
      featured: false,
      summary: 'A browser-based technical documentation editor with live LaTeX rendering, AST linting, and offline IndexedDB sync.',
      heroSvg: `<svg viewBox="0 0 400 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#0d1117"/>
        <!-- Editor split pane -->
        <rect x="25" y="25" width="165" height="150" rx="6" fill="#161b22" stroke="#30363d"/>
        <rect x="40" y="45" width="90" height="8" rx="2" fill="#7ee787"/>
        <rect x="40" y="65" width="130" height="6" rx="2" fill="#8b949e"/>
        <rect x="40" y="80" width="110" height="6" rx="2" fill="#8b949e"/>
        <rect x="40" y="105" width="120" height="24" rx="4" fill="#21262d"/>
        
        <rect x="210" y="25" width="165" height="150" rx="6" fill="#161b22" stroke="#30363d"/>
        <rect x="225" y="45" width="100" height="10" rx="2" fill="#f0f6fc"/>
        <rect x="225" y="70" width="130" height="8" rx="2" fill="#c9d1d9"/>
        <rect x="225" y="90" width="120" height="8" rx="2" fill="#c9d1d9"/>
        <rect x="225" y="120" width="70" height="20" rx="4" fill="#238636"/>
      </svg>`,
      tags: ['React', 'Monaco Editor', 'IndexedDB', 'Web Workers', 'KaTeX'],
      metrics: 'Supports 500,000+ words without memory degradation; 100% offline capable',
      problem: 'Technical writers needed a fast, offline-first documentation tool that could render syntax highlighting and math without lag.',
      solution: 'Implemented Monaco Editor in a web worker thread with custom Markdown AST transformers and background IndexedDB caching.',
      architecture: 'React, Monaco Editor API, unified/remark AST parser, and Service Worker caching.',
      liveUrl: 'https://github.com',
      githubUrl: 'https://github.com'
    }
  ],

  // Career Experience Timeline
  experience: [
    {
      id: 'cloudpulse',
      role: 'Staff / Lead Frontend Engineer',
      company: 'CloudPulse Technologies',
      period: '2023 — Present',
      location: 'San Francisco, CA',
      desc: 'Spearheading frontend architecture and core web vitals across the suite of enterprise cloud monitoring tools.',
      achievements: [
        'Architected real-time visualization platform serving 4.2M monthly active enterprise users with 99.99% uptime.',
        'Mentored 14 frontend and full-stack engineers across 3 squads on performance profiling, accessibility, and modern React best practices.',
        'Reduced company-wide LCP (Largest Contentful Paint) from 3.8s to 0.9s across all main product dashboards.'
      ],
      tags: ['React 19', 'TypeScript', 'Turborepo', 'WebSockets', 'Design Systems']
    },
    {
      id: 'novametrics',
      role: 'Senior UI/UX Engineer',
      company: 'NovaMetrics Software',
      period: '2020 — 2023',
      location: 'San Francisco, CA',
      desc: 'Led the development of NovaMetrics Design System and rewrote the primary data visualization interface.',
      achievements: [
        'Built and shipped the Prism Design System (50+ components, 100% WCAG AA compliant), saving ~40% sprint engineering time.',
        'Pioneered automated E2E and visual regression test suites that reduced production UI regressions by 85%.',
        'Organized weekly frontend knowledge shares and open-source contribution days.'
      ],
      tags: ['TypeScript', 'Next.js', 'Storybook', 'Playwright', 'CSS Architecture']
    },
    {
      id: 'vertexlabs',
      role: 'Frontend Software Engineer',
      company: 'Vertex Digital Labs',
      period: '2018 — 2020',
      location: 'Austin, TX',
      desc: 'Engineered high-performance web applications and e-commerce platforms for venture-backed startups and Fortune 500 clients.',
      achievements: [
        'Delivered 12 responsive web applications from initial architectural design to deployment.',
        'Optimized client conversion funnels with sub-100ms page transitions and responsive asset pipelines.',
        'Collaborated closely with product designers to implement pixel-perfect micro-interactions.'
      ],
      tags: ['JavaScript ES6+', 'React', 'GraphQL', 'Webpack', 'Sass/CSS3']
    }
  ]
};

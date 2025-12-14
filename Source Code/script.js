
    const $ = (sel, root=document) => root.querySelector(sel);
    const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

    // Year
    $('#year').textContent = new Date().getFullYear();

    // Sticky nav background on scroll
    const header = document.querySelector('header');
    const nav = document.querySelector('header nav');
    const setNavStyle = () => {
      const scrolled = window.scrollY > 8;
      nav.classList.toggle('rounded-2xl', scrolled);
      nav.classList.toggle('bg-slate-950/55', scrolled);
      nav.classList.toggle('backdrop-blur', scrolled);
      nav.classList.toggle('border', scrolled);
      nav.classList.toggle('border-white/10', scrolled);
      nav.classList.toggle('shadow-lg', scrolled);
      nav.classList.toggle('shadow-black/20', scrolled);
      if (scrolled) {
        nav.classList.add('mx-4', 'sm:mx-6', 'lg:mx-8');
      } else {
        nav.classList.remove('mx-4', 'sm:mx-6', 'lg:mx-8');
      }
    };
    setNavStyle();
    window.addEventListener('scroll', setNavStyle, { passive: true });

    // Mobile menu
    const btnMenu = $('#btnMenu');
    const mobileMenu = $('#mobileMenu');
    const toggleMenu = () => {
      const open = mobileMenu.classList.toggle('hidden') === false;
      btnMenu.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    btnMenu.addEventListener('click', toggleMenu);
    $$('#mobileMenu a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.add('hidden')));

    // Modal
    const overlay = $('#modalOverlay');
    const modalClose = $('#modalClose');
    const modalForm = $('#modalForm');
    const contactPanel = $('#contactPanel');
    const modalKicker = $('#modalKicker');
    const modalTitle = $('#modalTitle');

    let lastFocus = null;

    function openModal(mode='signup') {
      lastFocus = document.activeElement;
      overlay.classList.remove('hidden');
      overlay.classList.add('flex');
      document.body.style.overflow = 'hidden';

      if (mode === 'contact') {
        modalForm.classList.add('hidden');
        contactPanel.classList.remove('hidden');
        modalKicker.textContent = 'Sales';
        modalTitle.textContent = 'Contact sales';
        setTimeout(() => ($('#company')?.focus()), 50);
      } else {
        contactPanel.classList.add('hidden');
        modalForm.classList.remove('hidden');
        modalKicker.textContent = 'Get started';
        modalTitle.textContent = 'Create your account';
        setTimeout(() => ($('#email')?.focus()), 50);
      }
    }

    function closeModal() {
      overlay.classList.add('hidden');
      overlay.classList.remove('flex');
      document.body.style.overflow = '';
      if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
    }

    modalClose.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
      if (e.target && e.target.dataset && e.target.dataset.close === 'overlay') closeModal();
    });
    window.addEventListener('keydown', (e) => {
      if (!overlay.classList.contains('hidden') && e.key === 'Escape') closeModal();
    });

    // Open modal buttons
    const openSignup = () => openModal('signup');
    $('#btnStart').addEventListener('click', openSignup);
    $('#btnStartHero').addEventListener('click', openSignup);
    $('#btnStartMobile').addEventListener('click', () => { mobileMenu.classList.add('hidden'); openSignup(); });
    $('#btnSignin').addEventListener('click', () => openModal('signup'));
    $('#btnSigninMobile').addEventListener('click', () => { mobileMenu.classList.add('hidden'); openModal('signup'); });

    $$('[data-open="signup"]').forEach(b => b.addEventListener('click', () => openModal('signup')));
    $$('[data-open="contact"]').forEach(b => b.addEventListener('click', () => openModal('contact')));

    // Contact panel buttons
    $('#btnBack').addEventListener('click', () => openModal('signup'));
    $('#btnSend').addEventListener('click', () => {
      showToast('Message sent', 'Thanks — sales will reach out soon (demo).');
      closeModal();
    });

    // Toast
    const toast = $('#toast');
    const toastTitle = $('#toastTitle');
    const toastBody = $('#toastBody');
    let toastTimer = null;

    function showToast(title, body) {
      toastTitle.textContent = title;
      toastBody.textContent = body;
      toast.classList.remove('hidden');
      if (toastTimer) clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toast.classList.add('hidden'), 3200);
    }
    $('#toastClose').addEventListener('click', () => toast.classList.add('hidden'));

    // Mock pay button
    $('#btnPay').addEventListener('click', () => {
      showToast('Payment simulated', 'Checkout succeeded (demo).');
    });

    // Modal form submit
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = $('#email').value.trim();
      const country = $('#country').value;
      if (!email) return;
      showToast('Account created', `Welcome, ${email} · Country: ${country} (demo)`);
      closeModal();
      modalForm.reset();
    });

    // Tabs (products)
    const tabCopy = $('#tabCopy');
    const tabData = {
      payments: {
        title: 'Accept payments anywhere',
        body: 'Build a conversion-optimized checkout with fraud controls and global payouts — all via a single integration.',
        bullets: ['Prebuilt UI components', 'Saved payment methods', 'Global currency + local methods'],
        accent: 'from-indigo-400 to-cyan-300'
      },
      billing: {
        title: 'Run subscriptions and invoicing',
        body: 'Automate renewals, retries, receipts, and tax. Model any pricing plan: seat-based, usage-based, tiered.',
        bullets: ['Usage metering', 'Revenue recovery', 'Invoicing + tax-ready'],
        accent: 'from-cyan-300 to-emerald-300'
      },
      connect: {
        title: 'Power marketplaces and platforms',
        body: 'Onboard sellers, split payments, and orchestrate payouts — with compliance controls built in.',
        bullets: ['Express onboarding', 'Split + destination charges', 'KYC + payouts scheduling'],
        accent: 'from-fuchsia-400 to-indigo-400'
      }
    };

    function renderTab(name) {
      const t = tabData[name];
      tabCopy.innerHTML = `
        <div>
          <h4 class="text-xl font-semibold">${t.title}</h4>
          <p class="mt-2 text-slate-200">${t.body}</p>
        </div>
        <div class="grid gap-3 sm:grid-cols-2">
          ${t.bullets.map(b => `
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div class="flex items-start gap-2">
                <span class="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                <p class="text-sm text-slate-200">${b}</p>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="rounded-3xl border border-white/10 bg-slate-950/40 p-5">
          <p class="text-xs text-slate-300">Outcome</p>
          <p class="mt-1 text-sm text-slate-100"><span class="font-semibold">Fewer steps</span>, more completed checkouts.</p>
          <div class="mt-4 flex flex-wrap gap-2">
            <span class="rounded-full bg-white/5 px-2 py-1 text-[11px] text-slate-200 ring-1 ring-white/10">Low-code</span>
            <span class="rounded-full bg-white/5 px-2 py-1 text-[11px] text-slate-200 ring-1 ring-white/10">Composable</span>
            <span class="rounded-full bg-white/5 px-2 py-1 text-[11px] text-slate-200 ring-1 ring-white/10">Secure</span>
          </div>
          <div class="mt-4">
            <div class="h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div class="h-full w-[72%] rounded-full bg-gradient-to-r ${t.accent}"></div>
            </div>
            <p class="mt-2 text-xs text-slate-300">Example KPI lift: <span class="font-semibold text-slate-100">+12%</span></p>
          </div>
        </div>
      `;
    }

    renderTab('payments');
    $$('.tabbtn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        $$('.tabbtn').forEach(b => {
          const active = b === btn;
          b.classList.toggle('bg-white/10', active);
          b.classList.toggle('bg-white/5', !active);
          b.classList.toggle('text-white', active);
          b.classList.toggle('text-slate-200', !active);
          b.setAttribute('aria-selected', active ? 'true' : 'false');
        });
        renderTab(tab);
      });
    });

    // Code block tabs
    const codeBlock = $('#codeBlock');
    const snippets = {
      node: `// Create a payment intent (demo)
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const intent = await stripe.paymentIntents.create({
  amount: 4900,
  currency: 'usd',
  automatic_payment_methods: { enabled: true },
})

console.log(intent.client_secret)`,
      python: `# Create a payment intent (demo)
import os
import stripe

stripe.api_key = os.environ['STRIPE_SECRET_KEY']

intent = stripe.PaymentIntent.create(
  amount=4900,
  currency='usd',
  automatic_payment_methods={'enabled': True},
)

print(intent.client_secret)`,
      ruby: `# Create a payment intent (demo)
require 'stripe'

Stripe.api_key = ENV['STRIPE_SECRET_KEY']

intent = Stripe::PaymentIntent.create({
  amount: 4900,
  currency: 'usd',
  automatic_payment_methods: { enabled: true },
})

puts intent.client_secret`
    };

    let currentLang = 'node';
    function renderCode(lang) {
      currentLang = lang;
      codeBlock.textContent = snippets[lang];
      $$('.codeTab').forEach(btn => {
        const active = btn.dataset.lang === lang;
        btn.classList.toggle('bg-white/10', active);
        btn.classList.toggle('text-white', active);
        btn.classList.toggle('text-slate-200', !active);
        btn.setAttribute('aria-selected', active ? 'true' : 'false');
      });
    }
    renderCode('node');
    $$('.codeTab').forEach(btn => btn.addEventListener('click', () => renderCode(btn.dataset.lang)));

    $('#btnCopy').addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(snippets[currentLang]);
        showToast('Copied', 'Snippet copied to clipboard.');
      } catch {
        // Fallback
        const ta = document.createElement('textarea');
        ta.value = snippets[currentLang];
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
        showToast('Copied', 'Snippet copied to clipboard.');
      }
    });

    // Simulate API
    $('#btnSimulate').addEventListener('click', () => {
      showToast('payment_intent.succeeded', 'pi_demo_123 · amount: 4900 · usd');
    });

    // Pricing toggle
    const pricing = {
      monthly: { starter: 29, growth: 79, enterprise: 199, period: 'per month' },
      annual: { starter: 29 * 12 * 0.85, growth: 79 * 12 * 0.85, enterprise: 199 * 12 * 0.85, period: 'per year' }
    };

    let billingCycle = 'monthly';
    function formatUSD(n) {
      const rounded = Math.round(n);
      return `$${rounded.toLocaleString()}`;
    }

    function renderPricing(cycle) {
      billingCycle = cycle;
      const data = pricing[cycle];
      $$('[data-price]').forEach(el => {
        const key = el.dataset.price;
        el.textContent = formatUSD(data[key]);
      });
      $$('[data-period]').forEach(el => el.textContent = data.period);

      const monthlyBtn = $('#toggleMonthly');
      const annualBtn = $('#toggleAnnual');
      const monthlyActive = cycle === 'monthly';
      monthlyBtn.classList.toggle('bg-white', monthlyActive);
      monthlyBtn.classList.toggle('text-slate-950', monthlyActive);
      monthlyBtn.classList.toggle('bg-transparent', !monthlyActive);
      monthlyBtn.classList.toggle('text-slate-200', !monthlyActive);
      monthlyBtn.setAttribute('aria-pressed', monthlyActive ? 'true' : 'false');

      annualBtn.classList.toggle('bg-white', !monthlyActive);
      annualBtn.classList.toggle('text-slate-950', !monthlyActive);
      annualBtn.classList.toggle('text-slate-200', monthlyActive);
      annualBtn.setAttribute('aria-pressed', !monthlyActive ? 'true' : 'false');
    }

    $('#toggleMonthly').addEventListener('click', () => renderPricing('monthly'));
    $('#toggleAnnual').addEventListener('click', () => renderPricing('annual'));
    renderPricing('monthly');

    // Testimonials slider (render 3 at a time)
    const allTestimonials = [
      {
        quote: 'We shipped a new checkout flow in a weekend and saw an immediate lift in conversion.',
        name: 'Jordan Lee',
        role: 'PM, Helio Commerce'
      },
      {
        quote: 'The API primitives are predictable, and webhooks make our stack feel event-native.',
        name: 'Samira Khan',
        role: 'Staff Engineer, Nova'
      },
      {
        quote: 'Subscription changes, proration, invoicing — the edge cases were already handled.',
        name: 'Diego Ruiz',
        role: 'Founder, Juniper'
      },
      {
        quote: 'Instant payouts + sensible defaults let us focus on product, not plumbing.',
        name: 'Mina Patel',
        role: 'CTO, Northwind'
      },
      {
        quote: 'The embedded finance capabilities made our marketplace onboarding feel effortless.',
        name: 'Avery Chen',
        role: 'Growth, Pioneer'
      }
    ];

    const testimonialsRoot = $('#testimonials');
    let testIndex = 0;

    function renderTestimonials() {
      const cards = [];
      for (let i = 0; i < 3; i++) {
        const t = allTestimonials[(testIndex + i) % allTestimonials.length];
        cards.push(`
          <article class="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p class="text-sm text-slate-200">“${t.quote}”</p>
            <div class="mt-5 flex items-center gap-3">
              <div class="h-10 w-10 rounded-2xl bg-gradient-to-br from-indigo-400/40 via-cyan-400/30 to-fuchsia-400/40 ring-1 ring-white/10"></div>
              <div>
                <p class="text-sm font-semibold">${t.name}</p>
                <p class="text-xs text-slate-300">${t.role}</p>
              </div>
            </div>
          </article>
        `);
      }
      testimonialsRoot.innerHTML = cards.join('');
    }

    function nextTestimonial() { testIndex = (testIndex + 1) % allTestimonials.length; renderTestimonials(); }
    function prevTestimonial() { testIndex = (testIndex - 1 + allTestimonials.length) % allTestimonials.length; renderTestimonials(); }

    $('#nextTest').addEventListener('click', nextTestimonial);
    $('#prevTest').addEventListener('click', prevTestimonial);
    $('#nextTestMobile').addEventListener('click', nextTestimonial);
    $('#prevTestMobile').addEventListener('click', prevTestimonial);

    renderTestimonials();

    let autoTimer = setInterval(nextTestimonial, 6500);
    const pauseAuto = () => { clearInterval(autoTimer); autoTimer = setInterval(nextTestimonial, 6500); };
    ['click','touchstart','keydown'].forEach(evt => document.addEventListener(evt, pauseAuto, { passive: true }));

    // Reveal on scroll
    const revealEls = $$('.reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));

    // Active nav link highlight
    const sections = ['products','developers','pricing','company'].map(id => document.getElementById(id));
    const navLinks = $$('.navlink');

    const sectionIO = new IntersectionObserver((entries) => {
      const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const id = visible.target.id;
      navLinks.forEach(a => {
        const active = a.getAttribute('href') === `#${id}`;
        a.classList.toggle('text-white', active);
        a.classList.toggle('text-slate-200', !active);
        a.classList.toggle('font-semibold', active);
      });
    }, { threshold: [0.25, 0.4, 0.6] });

    sections.forEach(s => s && sectionIO.observe(s));
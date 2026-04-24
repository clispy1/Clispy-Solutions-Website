'use client';
import { useState, useEffect, useRef, Fragment } from 'react';
import ThreeCanvas from '../components/ThreeCanvas';
import Cursor from '../components/Cursor';
import TweaksPanel from '../components/TweaksPanel';
import { caseStudies } from '../lib/data';

// Component mapping of the original HTML logic to React hooks
export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeWord, setActiveWord] = useState(0);
  const words = ['Credible.', 'Profitable.', 'Unstoppable.', 'Serious.'];
  
  const [geomType, setGeomType] = useState('torus');
  const [speedMult, setSpeedMult] = useState(1);
  
  const [projectFilter, setProjectFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(caseStudies[0]);
  
  const [formStatus, setFormStatus] = useState('Send Project Inquiry');
  const [faqOpen, setFaqOpen] = useState(-1);

  // Nav Scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hero words
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveWord((prev) => (prev + 1) % words.length);
    }, 2200);
    return () => clearInterval(interval);
  }, [words.length]);

  // Reveal Animation & Count up
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          const target = parseInt(el.dataset.target || '0', 10);
          let c = 0;
          const step = target / 40;
          const iv = setInterval(() => {
            c = Math.min(c + step, target);
            el.textContent = Math.floor(c).toString();
            if (c >= target) clearInterval(iv);
          }, 30);
          countObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    
    document.querySelectorAll('.count-up').forEach(el => countObserver.observe(el));

    return () => {
      observer.disconnect();
      countObserver.disconnect();
    };
  }, []); // Run once on mount

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('✓ Sent! We\'ll be in touch within 24 hours.');
    setTimeout(() => {
      setFormStatus('Send Project Inquiry');
      (e.target as HTMLFormElement).reset();
    }, 4000);
  };

  const handleTilt = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const r = card.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 14;
    const y = -((e.clientY - r.top) / r.height - 0.5) * 14;
    card.style.transform = `perspective(600px) rotateX(${y}deg) rotateY(${x}deg) translateY(-8px)`;
    card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
    card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
  };

  const handleTiltReset = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = '';
  };

  return (
    <>
      <div id="bg-anim">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
        <div className="blob blob-4"></div>
      </div>
      <Cursor />

      {/* NAV */}
      <nav id="nav" className={scrolled ? 'scrolled' : ''}>
        <a href="#" className="nav-logo">Clispy<span>.</span></a>
        <ul className="nav-links">
          <li><a href="#about">About</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#packages">Pricing</a></li>
          <li><a href="#projects">Work</a></li>
          <li><a href="#faq">FAQ</a></li>
        </ul>
        <button className="nav-cta" onClick={() => document.getElementById('contact')?.scrollIntoView({behavior: 'smooth'})}>Get Free Quote</button>
        <button className={`hamburger ${menuOpen ? 'open' : ''}`} onClick={() => { setMenuOpen(!menuOpen); document.body.style.overflow = !menuOpen ? 'hidden' : ''; }} aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
      </nav>

      <div id="mobile-menu" className={menuOpen ? 'open' : ''}>
        <a href="#about" onClick={() => { setMenuOpen(false); document.body.style.overflow = '' }}>About</a>
        <a href="#services" onClick={() => { setMenuOpen(false); document.body.style.overflow = '' }}>Services</a>
        <a href="#packages" onClick={() => { setMenuOpen(false); document.body.style.overflow = '' }}>Pricing</a>
        <a href="#projects" onClick={() => { setMenuOpen(false); document.body.style.overflow = '' }}>Work</a>
        <a href="#testimonials" onClick={() => { setMenuOpen(false); document.body.style.overflow = '' }}>Reviews</a>
        <a href="#faq" onClick={() => { setMenuOpen(false); document.body.style.overflow = '' }}>FAQ</a>
        <a href="#contact" className="mobile-cta" onClick={() => { setMenuOpen(false); document.body.style.overflow = '' }}>Get Free Quote</a>
      </div>

      {/* HERO */}
      <section id="hero">
        <ThreeCanvas speedMult={speedMult} geomType={geomType} />
        <div className="hero-content">
          <div className="hero-eyebrow">Est. 2022 · Accra, Ghana 🇬🇭</div>
          <h1 className="hero-title">
            Your Business<br/>
            <span className="line2">Deserves to Be</span><br/>
            <span className="hero-cycle">
              {words.map((w, i) => (
                <span key={w} className={`cycle-word ${i === activeWord ? 'active' : ''}`}>{w}</span>
              ))}
            </span>
          </h1>
          <p className="hero-sub">We build custom websites and run ads that help you look credible, sell smarter, and scale faster.</p>
          <div className="hero-actions">
            <a href="#projects" className="btn-primary">View Our Work</a>
            <a href="#contact" className="btn-ghost">
              Start a Project
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </a>
          </div>
        </div>
        <div className="hero-stats">
          <div className="hero-stat"><div className="hero-stat-num">30<span style={{fontSize:'1.4rem'}}>+</span></div><div className="hero-stat-label">Projects</div></div>
          <div className="hero-stat"><div className="hero-stat-num">25<span style={{fontSize:'1.4rem'}}>+</span></div><div className="hero-stat-label">Clients</div></div>
          <div className="hero-stat"><div className="hero-stat-num">3<span style={{fontSize:'1.4rem'}}>+</span></div><div className="hero-stat-label">Years</div></div>
          <div className="hero-stat"><div className="hero-stat-num">100<span style={{fontSize:'1.4rem'}}>%</span></div><div className="hero-stat-label">Satisfaction</div></div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-section">
        <div className="marquee-track">
          {[...Array(2)].map((_, idx) => (
             <Fragment key={idx}>
              <div className="marquee-item"><span className="marquee-dot"></span>Denayo Properties</div>
              <div className="marquee-item"><span className="marquee-dot"></span>TrainLive GH</div>
              <div className="marquee-item"><span className="marquee-dot"></span>Prime JB Movers</div>
              <div className="marquee-item"><span className="marquee-dot"></span>CoCAHM Culinary</div>
              <div className="marquee-item"><span className="marquee-dot"></span>Amonu Chocolates</div>
              <div className="marquee-item"><span className="marquee-dot"></span>Primis Sports UAE</div>
              <div className="marquee-item"><span className="marquee-dot"></span>NAD Security</div>
              <div className="marquee-item"><span className="marquee-dot"></span>NorthPrime Movers</div>
              <div className="marquee-item"><span className="marquee-dot"></span>HiTrace Solutions</div>
              <div className="marquee-item"><span className="marquee-dot"></span>WFF Ghana</div>
              <div className="marquee-item"><span className="marquee-dot"></span>VMGEF</div>
              <div className="marquee-item"><span className="marquee-dot"></span>Afdhal Jouda</div>
             </Fragment>
          ))}
        </div>
      </div>

      {/* ABOUT */}
      <section id="about">
        <div className="about-visual reveal">
          <div className="about-card" style={{ paddingBottom: '48px' }}>
            <img 
              src="/jake.jpeg" 
              alt="Jake Asare" 
              className="absolute inset-0 w-full h-full object-cover z-0" 
            />
            {/* Dark gradient overlay so the text is readable over the photo */}
            <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent"></div>
            
            <div className="about-card-name z-10 text-white">Jake Asare (Clispy)</div>
            <div className="about-card-role z-10">Founder & Creative Director</div>
          </div>
          <div className="about-badge" style={{top:'20px', right:'-10px'}}>
            <span className="badge-icon">⚡</span>
            <div><div className="badge-label">Fast Delivery</div><div className="badge-sub">Quick turnaround</div></div>
          </div>
          <div className="about-badge" style={{bottom:'30px', left:'-10px'}}>
            <span className="badge-icon">🌍</span>
            <div><div className="badge-label">Global Reach</div><div className="badge-sub">Africa · UAE · Beyond</div></div>
          </div>
        </div>
        <div className="about-text">
          <div className="section-label reveal">Our Story</div>
          <h2 className="section-title reveal reveal-delay-1">Built to Look<br/><span style={{color:'var(--accent)'}}>Credible.</span><br/>Designed to Convert.</h2>
          <p className="about-desc reveal reveal-delay-2">I'm Jake Clispy — a Ghanaian web designer, developer, and digital marketer with 3+ years helping startups, side hustlers, and businesses launch strong online. I run Clispy Solutions with my small team, obsessed with building things that look good, work fast, and get real results.</p>
          <p className="about-desc reveal reveal-delay-3">From Electrical Engineering to the digital world — we help local and international businesses stop running on DMs and start running serious online operations.</p>
          <div className="about-tags reveal reveal-delay-4">
            <span className="tag">Web Design</span><span className="tag">Development</span><span className="tag">E-commerce</span><span className="tag">Digital Ads</span><span className="tag">WordPress</span><span className="tag">React & Next.js</span>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section id="process">
        <div className="process-header reveal">
          <div>
            <div className="section-label">How We Work</div>
            <h2 className="section-title">From Idea to<br/><span style={{color:'var(--accent)'}}>Live & Growing</span></h2>
          </div>
          <p className="section-sub" style={{maxWidth:'320px'}}>A clear process means no surprises, no delays, and a site you're proud to show off.</p>
        </div>
        <div className="process-steps">
          <div className="process-step reveal">
            <div className="process-num"><span className="process-step-icon">🔍</span></div>
            <div className="process-step-title">Discover</div>
            <div className="process-step-desc">We learn your business, goals, and audience before touching a pixel.</div>
          </div>
          <div className="process-step reveal reveal-delay-1">
            <div className="process-num"><span className="process-step-icon">🎨</span></div>
            <div className="process-step-title">Design</div>
            <div className="process-step-desc">Custom mockups built around your brand — get feedback before we build.</div>
          </div>
          <div className="process-step reveal reveal-delay-2">
            <div className="process-num"><span className="process-step-icon">⚙️</span></div>
            <div className="process-step-title">Build</div>
            <div className="process-step-desc">Fast, mobile-first development. You see progress every step of the way.</div>
          </div>
          <div className="process-step reveal reveal-delay-3">
            <div className="process-num"><span className="process-step-icon">🚀</span></div>
            <div className="process-step-title">Launch</div>
            <div className="process-step-desc">We go live and make sure everything works perfectly across all devices.</div>
          </div>
          <div className="process-step reveal reveal-delay-4">
            <div className="process-num"><span className="process-step-icon">📈</span></div>
            <div className="process-step-title">Grow</div>
            <div className="process-step-desc">Ongoing support, updates, and ad campaigns to keep the leads coming in.</div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" style={{background:'oklch(0.10 0.014 280 / 0.65)', backdropFilter:'blur(2px)'}}>
        <div className="services-header reveal">
          <div>
            <div className="section-label">What We Do</div>
            <h2 className="section-title">Services That<br/><span style={{color:'var(--accent)'}}>Drive Results</span></h2>
          </div>
          <p className="section-sub" style={{maxWidth:'340px'}}>Every project starts with strategy and ends with results you can measure. No fluff, no wasted time.</p>
        </div>
        <div className="services-grid">
          <div className="service-card reveal" onMouseMove={handleTilt} onMouseLeave={handleTiltReset}>
            <div className="service-num">01</div>
            <div className="service-icon">🌐</div>
            <div className="service-title">Web Design & Development</div>
            <p className="service-desc">Custom websites built to convert visitors into customers. Fast, mobile-first, and designed with purpose.</p>
            <ul className="service-features">
              <li>Custom design & development</li><li>Mobile-responsive layouts</li><li>SEO-ready structure</li><li>Performance optimized</li>
            </ul>
          </div>
          <div className="service-card reveal reveal-delay-1" onMouseMove={handleTilt} onMouseLeave={handleTiltReset}>
            <div className="service-num">02</div>
            <div className="service-icon">🛒</div>
            <div className="service-title">E-commerce Development</div>
            <p className="service-desc">Full-featured online stores that move sales from DMs to real checkouts. Built to scale with your business.</p>
            <ul className="service-features">
              <li>WooCommerce & custom shops</li><li>Payment gateway setup</li><li>Inventory management</li><li>Preorder & dropship models</li>
            </ul>
          </div>
          <div className="service-card reveal reveal-delay-2" onMouseMove={handleTilt} onMouseLeave={handleTiltReset}>
            <div className="service-num">03</div>
            <div className="service-icon">📣</div>
            <div className="service-title">Digital Marketing & Ads</div>
            <p className="service-desc">We run targeted ad campaigns that bring real leads to your business — Meta, Google, and beyond.</p>
            <ul className="service-features">
              <li>Meta & Google Ads setup</li><li>Audience targeting & strategy</li><li>Ad creative & copywriting</li><li>Performance tracking & reporting</li>
            </ul>
          </div>
        </div>
      </section>

      {/* PACKAGES */}
      <section id="packages">
        <div className="packages-header">
          <div className="section-label reveal">Transparent Pricing</div>
          <h2 className="section-title reveal reveal-delay-1">Simple Packages,<br/><span style={{color:'var(--accent)'}}>Clear Value</span></h2>
          <p className="section-sub reveal reveal-delay-2">No hidden fees. No surprises. Pick a package or reach out for a custom quote.</p>
        </div>
        <div className="packages-grid">
          <div className="package-card reveal">
            <div className="package-name">Starter</div>
            <div className="package-price">¢3,500</div>
            <div className="package-price-note">One-time · Best for new businesses</div>
            <p className="package-desc">Get online fast with a clean, professional website that builds credibility from day one.</p>
            <ul className="package-features">
              <li><span className="check"></span>Up to 5 pages</li>
              <li><span className="check"></span>Mobile responsive design</li>
              <li><span className="check"></span>Contact form</li>
              <li><span className="check"></span>Basic SEO setup</li>
              <li><span className="check"></span>1 round of revisions</li>
              <li className="muted-feat"><span className="check"></span>E-commerce functionality</li>
              <li className="muted-feat"><span className="check"></span>Custom animations</li>
            </ul>
            <a href="#contact" className="package-cta outline">Get Started</a>
          </div>
          <div className="package-card featured reveal reveal-delay-1">
            <div className="package-name">Growth</div>
            <div className="package-price">¢5,500</div>
            <div className="package-price-note">One-time · Best for growing businesses</div>
            <p className="package-desc">A high-converting website built with strategy — designed to bring in leads and look credible at scale.</p>
            <ul className="package-features">
              <li><span className="check"></span>Up to 10 pages</li>
              <li><span className="check"></span>Custom design & animations</li>
              <li><span className="check"></span>E-commerce ready</li>
              <li><span className="check"></span>Full SEO optimization</li>
              <li><span className="check"></span>3 rounds of revisions</li>
              <li><span className="check"></span>Speed & performance audit</li>
              <li className="muted-feat"><span className="check"></span>Ad campaign setup</li>
            </ul>
            <a href="#contact" className="package-cta solid">Get Started</a>
          </div>
          <div className="package-card reveal reveal-delay-2">
            <div className="package-name">Scale</div>
            <div className="package-price">Custom</div>
            <div className="package-price-note">Retainer available · Full-service growth</div>
            <p className="package-desc">Website + ads + ongoing management. For businesses serious about growing their online presence fast.</p>
            <ul className="package-features">
              <li><span className="check"></span>Everything in Growth</li>
              <li><span className="check"></span>Meta & Google Ads setup</li>
              <li><span className="check"></span>Monthly ad management</li>
              <li><span className="check"></span>Analytics & reporting</li>
              <li><span className="check"></span>Priority support</li>
              <li><span className="check"></span>Ongoing content updates</li>
              <li><span className="check"></span>Dedicated account manager</li>
            </ul>
            <a href="#contact" className="package-cta outline">Let's Talk</a>
          </div>
        </div>
        <p className="packages-note reveal">All prices in Ghana Cedis. USD pricing available. <a href="#contact">Contact us</a> for a custom quote.</p>
      </section>

      {/* PROJECTS */}
      <section id="projects" style={{background:'oklch(0.10 0.014 280 / 0.65)', backdropFilter:'blur(2px)'}}>
        <div className="projects-header">
          <div className="section-label reveal">Featured Work</div>
          <h2 className="section-title reveal reveal-delay-1">Projects That<br/><span style={{color:'var(--accent)'}}>Deliver.</span></h2>
          <div className="projects-filter reveal reveal-delay-2">
            <button className={`filter-btn ${projectFilter === 'all' ? 'active' : ''}`} onClick={() => setProjectFilter('all')}>All</button>
            <button className={`filter-btn ${projectFilter === 'web' ? 'active' : ''}`} onClick={() => setProjectFilter('web')}>Web</button>
            <button className={`filter-btn ${projectFilter === 'ecommerce' ? 'active' : ''}`} onClick={() => setProjectFilter('ecommerce')}>E-commerce</button>
          </div>
        </div>
        <div className="projects-grid">
          {caseStudies.map((project, idx) => {
            const isVisible = projectFilter === 'all' || (project.tag.toLowerCase().includes(projectFilter.toLowerCase()));
            const delayClass = idx % 3 === 0 ? '' : (idx % 3 === 1 ? 'reveal-delay-1' : 'reveal-delay-2');
            
            // Extract image url based on index for simplicity or just use the thumbs
            // I'll grab the url from original html based on index map.
            const bgImages = [
              "https://image.thum.io/get/width/800/https://cocahm-preview.vercel.app/",
              "https://image.thum.io/get/width/800/https://trainlivegh.com",
              "https://image.thum.io/get/width/800/https://denayopropertiesgh.com/",
              "https://image.thum.io/get/width/800/https://amonuchocolate.com/",
              "https://image.thum.io/get/width/800/https://vmgef.vercel.app/",
              "https://image.thum.io/get/width/800/https://www.primejbmovers.com/",
              "https://image.thum.io/get/width/800/https://northprimemovers.ca",
              "https://image.thum.io/get/width/800/https://nadsecurityltd.com",
              "https://image.thum.io/get/width/800/https://afdhaljouda.com",
              "https://image.thum.io/get/width/800/https://hitrace-solutions.vercel.app/",
              "https://image.thum.io/get/width/800/https://wff-ghana.vercel.app/",
              "https://image.thum.io/get/width/1200/https://primissportsuae.com/"
            ];

            return (
              <div 
                key={idx} 
                className={`project-card reveal ${delayClass}`} 
                style={{ opacity: isVisible ? '1' : '.2', pointerEvents: isVisible ? 'auto' : 'none' }}>
                <div className="project-bg" style={{backgroundImage:`url('${bgImages[idx]}')`, backgroundSize:'cover', backgroundPosition:'center top'}}></div>
                <div className="project-overlay">
                  <span className="project-tag">{project.tag}</span>
                  <div className="project-name">{project.name}</div>
                  <div className="project-desc">{project.sub.split('·')[0]}</div>
                  <button className="project-case-btn" onClick={() => {
                    setModalData(project);
                    setModalOpen(true);
                    document.body.style.overflow = 'hidden';
                  }}>
                    Case Study 
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 7h9M7.5 3.5L11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* STATS */}
      <div id="stats">
        <div className="stats-grid">
          <div className="stat-item reveal"><span className="stat-num"><span className="count-up" data-target="30">0</span><span className="stat-suffix">+</span></span><div className="stat-label">Projects Delivered</div></div>
          <div className="stat-item reveal reveal-delay-1"><span className="stat-num"><span className="count-up" data-target="25">0</span><span className="stat-suffix">+</span></span><div className="stat-label">Happy Clients</div></div>
          <div className="stat-item reveal reveal-delay-2"><span className="stat-num"><span className="count-up" data-target="3">0</span><span className="stat-suffix">+</span></span><div className="stat-label">Years Experience</div></div>
          <div className="stat-item reveal reveal-delay-3"><span className="stat-num"><span className="count-up" data-target="15">0</span><span className="stat-suffix">+</span></span><div className="stat-label">Businesses Built</div></div>
        </div>
      </div>

      {/* TESTIMONIALS */}
      <section id="testimonials" style={{background:'oklch(0.07 0.012 280 / 0.5)'}}>
        <div style={{marginBottom:'60px'}}>
          <div className="section-label reveal">Testimonials</div>
          <h2 className="section-title reveal reveal-delay-1">What Clients<br/><span style={{color:'var(--accent)'}}>Actually Say</span></h2>
        </div>
        
        <div className="testimonial-carousel-wrapper reveal reveal-delay-2">
          {/* Top Carousel (Moves Left) */}
          <div className="testimonial-carousel-container">
            {[...Array(2)].map((_, i) => (
              <div key={`top-${i}`} className="testimonial-track" aria-hidden={i !== 0}>
                <div className="testimonial-card">
                  <div className="testimonial-content">
                    <div className="testimonial-quote">"</div>
                    <div className="stars">★★★★★</div>
                    <p className="testimonial-text">Clispy Solutions transformed our real estate platform completely. Their expertise and attention to detail increased our lead generation by 150%. Professional, creative, and always delivers on time!</p>
                  </div>
                  <div className="testimonial-author"><div className="testimonial-avatar">DK</div><div><div className="testimonial-name">Mr Dennis K.</div><div className="testimonial-role">Marketing Director · Denayo Properties</div></div></div>
                </div>
                <div className="testimonial-card">
                  <div className="testimonial-content">
                    <div className="testimonial-quote">"</div>
                    <div className="stars">★★★★★</div>
                    <p className="testimonial-text">Jake and his team are truly exceptional. They met and exceeded our expectations. Always available to make changes and updates. Their attention to detail is awesome.</p>
                  </div>
                  <div className="testimonial-author"><div className="testimonial-avatar">MN</div><div><div className="testimonial-name">Mr Nad.</div><div className="testimonial-role">CEO · NAD Security Ltd</div></div></div>
                </div>
                <div className="testimonial-card">
                  <div className="testimonial-content">
                    <div className="testimonial-quote">"</div>
                    <div className="stars">★★★★★</div>
                    <p className="testimonial-text">Jake was incredibly time-conscious, ensuring every deadline was met. Most impressive was the pricing — extremely fair for the quality delivered. If you need a reliable, skilled web developer, Clispy Solutions is the choice!</p>
                  </div>
                  <div className="testimonial-author"><div className="testimonial-avatar">BG</div><div><div className="testimonial-name">Mr Bernard Ghunney</div><div className="testimonial-role">Operations Manager · Prime JB Movers</div></div></div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Carousel (Moves Right) */}
          <div className="testimonial-carousel-container" dir="rtl">
            {[...Array(2)].map((_, i) => (
              <div key={`bottom-${i}`} className="testimonial-track reverse" aria-hidden={i !== 0} dir="ltr">
                <div className="testimonial-card">
                  <div className="testimonial-content">
                    <div className="testimonial-quote">"</div>
                    <div className="stars">★★★★★</div>
                    <p className="testimonial-text">The design for CoCAHM perfectly reflects our culinary expertise and has significantly increased our student enrollment. Their attention to detail is remarkable.</p>
                  </div>
                  <div className="testimonial-author"><div className="testimonial-avatar">TB</div><div><div className="testimonial-name">Ms Thelma Boye</div><div className="testimonial-role">CEO · CoCAHM Culinary School</div></div></div>
                </div>
                <div className="testimonial-card large">
                  <div className="testimonial-content">
                    <div className="testimonial-quote">"</div>
                    <div className="stars">★★★★★</div>
                    <p className="testimonial-text">Jake was time-conscious, transparent, and the communication made everything smooth and stress-free. Looking for a skilled and affordable web developer? Clispy Solutions — no brainer.</p>
                    <div className="testimonial-author" style={{marginTop:'28px'}}><div className="testimonial-avatar">KO</div><div><div className="testimonial-name">Kwame Osei</div><div className="testimonial-role">Customer · Tech Enthusiast</div></div></div>
                  </div>
                  <div className="testimonial-cta-box">
                    <div className="section-label" style={{justifyContent:'center', marginBottom:'12px'}}>Work With Us</div>
                    <h3 style={{fontFamily:'var(--font-syne),sans-serif', fontSize:'1.4rem', fontWeight:800, letterSpacing:'-.02em', lineHeight:1.2, marginBottom:'16px', maxWidth:'220px'}}>Ready to build something serious?</h3>
                    <a href="#contact" className="btn-primary" style={{display:'inline-block', whiteSpace:'nowrap'}}>Get a Free Quote</a>
                  </div>
                </div>
                <div className="testimonial-card">
                  <div className="testimonial-content">
                    <div className="testimonial-quote">"</div>
                    <div className="stars">★★★★★</div>
                    <p className="testimonial-text">From the initial discovery call to the final launch, execution was flawless. They didn't just build a website, they built a business asset that pays for itself.</p>
                  </div>
                  <div className="testimonial-author"><div className="testimonial-avatar">JD</div><div><div className="testimonial-name">John Doe</div><div className="testimonial-role">Founder · Stellar Growth</div></div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{background:'oklch(0.10 0.014 280 / 0.65)', backdropFilter:'blur(2px)'}}>
        <div className="faq-header">
          <div>
            <div className="section-label reveal">FAQ</div>
            <h2 className="section-title reveal reveal-delay-1">Questions We<br/><span style={{color:'var(--accent)'}}>Always Get</span></h2>
          </div>
          <p className="section-sub reveal reveal-delay-2" style={{maxWidth:'300px'}}>Everything you need to know before reaching out.</p>
        </div>
        <div className="faq-list">
          {[{q: "How long does it take to build a website?", a: "Most websites take 2–4 weeks from start to launch. Simple 5-page sites can be done in 1–2 weeks. E-commerce and complex builds may take 4–6 weeks. We'll give you a clear timeline during our first conversation."},
            {q: "What's included after the website launches?", a: "We provide post-launch support for any bugs or issues that come up. Ongoing updates, hosting management, and ad campaigns are available as part of our Scale package or as add-ons."},
            {q: "Do I own the website after it's built?", a: "Yes, 100%. Once the project is complete and payment is settled, you own everything — the code, design, domain, and hosting account. We believe your business assets should belong to you."},
            {q: "Can you work with my existing domain/hosting?", a: "Absolutely. We can work with any hosting provider or domain registrar. If you don't have one yet, we'll help you set everything up and point you to the best options for your budget."},
            {q: "How does payment work?", a: "We typically work on a 50% upfront, 50% on delivery basis. We accept Mobile Money (MoMo), bank transfer, and international payment methods. All terms are agreed upon before work starts."},
            {q: "Can you run ads for my business too?", a: "Yes! We run Meta (Facebook & Instagram) and Google Ads campaigns. We handle strategy, creative, targeting, and reporting. This is available as a standalone service or bundled into our Scale package."},
            {q: "Do you work with international clients?", a: "Yes! We've worked with clients in Ghana, UAE, and beyond. Communication is done via WhatsApp, email, and video calls. Distance is never a barrier — we deliver the same quality regardless of where you are."},
            {q: "What if I don't know what I want?", a: "That's totally fine — most of our clients start with just a rough idea. Our discovery process helps you clarify your goals, audience, and vision. We'll guide you every step of the way and suggest what works best for your business."}
          ].map((item, idx) => {
            const delayClass = `reveal-delay-${idx % 4 + 1}`;
            return (
              <div key={idx} className={`faq-item reveal ${delayClass} ${faqOpen === idx ? 'open' : ''}`} onClick={() => setFaqOpen(faqOpen === idx ? -1 : idx)}>
                <div className="faq-q"><span className="faq-q-text">{item.q}</span><span className="faq-icon">+</span></div>
                <div className="faq-a"><div className="faq-a-inner">{item.a}</div></div>
              </div>
            );
          })}
        </div>
      </section>

      {/* LEAD MAGNET */}
      <div id="lead-magnet">
        <div className="lm-inner reveal">
          <div>
            <div className="lm-label">Free Offer</div>
            <div className="lm-title">Get a Free Website<br/>Audit — No Strings.</div>
            <p className="lm-sub">Already have a website? We'll review it and tell you exactly what's holding it back — speed, SEO, design, conversions. Free, honest, and done within 48 hours.</p>
          </div>
          <div className="lm-actions">
            <a href="#contact" className="btn-primary" style={{fontFamily:'var(--font-syne),sans-serif', fontWeight:700, whiteSpace:'nowrap'}}>Claim Free Audit</a>
            <a href="https://wa.me/233206601059" target="_blank" rel="noreferrer" className="btn-outline" style={{whiteSpace:'nowrap'}}>WhatsApp Us</a>
          </div>
        </div>
      </div>

      {/* BLOG */}
      <section id="blog" style={{background:'oklch(0.10 0.014 280 / 0.65)', backdropFilter:'blur(2px)'}}>
        <div className="blog-header">
          <div>
            <div className="section-label reveal">Insights</div>
            <h2 className="section-title reveal reveal-delay-1">Tips for Growing<br/><span style={{color:'var(--accent)'}}>Online in Ghana</span></h2>
          </div>
          <p className="section-sub reveal reveal-delay-2" style={{maxWidth:'300px'}}>Practical advice for business owners ready to take their online presence seriously.</p>
        </div>
        <div className="blog-grid">
          <div className="blog-card reveal">
            <div className="blog-thumb"><div className="blog-thumb-bg" style={{background:'linear-gradient(135deg,oklch(0.15 0.05 250),oklch(0.20 0.08 220))'}}></div><div className="blog-thumb-icon">🌐</div></div>
            <div className="blog-meta">
              <span className="blog-cat">Web Design</span>
              <div className="blog-title">Why Your Business Needs More Than an Instagram Page in 2025</div>
              <p className="blog-excerpt">Social media builds followers. A website builds credibility. Here's why serious businesses in Ghana need both — and which one to prioritize first.</p>
              <div className="blog-footer"><span className="blog-date">Coming Soon</span><span className="blog-coming">Draft</span></div>
            </div>
          </div>
          <div className="blog-card reveal reveal-delay-1">
            <div className="blog-thumb"><div className="blog-thumb-bg" style={{background:'linear-gradient(135deg,oklch(0.15 0.06 40),oklch(0.20 0.10 55))'}}></div><div className="blog-thumb-icon">📣</div></div>
            <div className="blog-meta">
              <span className="blog-cat">Digital Marketing</span>
              <div className="blog-title">How to Run Facebook Ads That Actually Work for Ghanaian Businesses</div>
              <p className="blog-excerpt">Most small businesses waste their ad budget on the wrong audiences. We break down the targeting strategy we use to get real leads from Meta Ads.</p>
              <div className="blog-footer"><span className="blog-date">Coming Soon</span><span className="blog-coming">Draft</span></div>
            </div>
          </div>
          <div className="blog-card reveal reveal-delay-2">
            <div className="blog-thumb"><div className="blog-thumb-bg" style={{background:'linear-gradient(135deg,oklch(0.14 0.05 160),oklch(0.19 0.08 175))'}}></div><div className="blog-thumb-icon">🛒</div></div>
            <div className="blog-meta">
              <span className="blog-cat">E-commerce</span>
              <div className="blog-title">Moving Your Sales From DMs to a Real Online Store: A Practical Guide</div>
              <p className="blog-excerpt">You've been selling on WhatsApp and Instagram — and it works. But here's why a proper online store will 10x your efficiency and credibility.</p>
              <div className="blog-footer"><span className="blog-date">Coming Soon</span><span className="blog-coming">Draft</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{background:'oklch(0.10 0.014 280 / 0.65)', backdropFilter:'blur(2px)'}}>
        <div className="contact-info">
          <div className="section-label reveal">Contact</div>
          <h2 className="section-title reveal reveal-delay-1">Let's Build<br/><span style={{color:'var(--accent)'}}>Something Real.</span></h2>
          <p className="contact-desc reveal reveal-delay-2">Have a project? A vision? Or just tired of running your business through DMs? Fill out the form and we'll get back to you within 24 hours.</p>
          <div className="contact-items reveal reveal-delay-3">
            <div className="contact-item"><div className="contact-icon">✉</div><div><div className="contact-item-label">Email</div><div className="contact-item-value"><a href="mailto:jake@clispysolutions.com">jake@clispysolutions.com</a></div></div></div>
            <div className="contact-item"><div className="contact-icon">📍</div><div><div className="contact-item-label">Location</div><div className="contact-item-value">Accra, Ghana · Serving Globally</div></div></div>
            <div className="contact-item"><div className="contact-icon">⏱</div><div><div className="contact-item-label">Response Time</div><div className="contact-item-value">Within 12 hours · Mon–Sat, 9AM–9PM</div></div></div>
          </div>
        </div>
        <div>
          <form className="contact-form reveal" onSubmit={handleFormSubmit}>
            <div className="form-row">
              <div className="form-group"><label>Full Name *</label><input type="text" placeholder="Your name" required /></div>
              <div className="form-group"><label>Email *</label><input type="email" placeholder="your@email.com" required /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Phone</label><input type="tel" placeholder="+233 ..." /></div>
              <div className="form-group"><label>Budget</label><select><option>Select budget range</option><option>Under ¢4,000</option><option>¢4,000 – ¢8,000</option><option>¢8,000+</option></select></div>
            </div>
            <div className="form-group"><label>Project Type *</label><select required><option value="">Select project type</option><option>Web Design & Development</option><option>E-commerce Development</option><option>Digital Marketing & Ads</option><option>Website Audit (Free)</option><option>Other</option></select></div>
            <div className="form-group"><label>Project Details *</label><textarea placeholder="Tell us about your project, goals, and timeline..." required></textarea></div>
            <button type="submit" className="btn-submit" id="submit-btn" style={{background: formStatus.includes('Sent') ? 'oklch(0.65 0.15 140)' : ''}}>
              <span id="submit-text">{formStatus}</span>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 9h12M11 5l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-top">
          <div>
            <div className="footer-logo">Clispy<span>.</span></div>
            <p className="footer-tagline">Built to Look Credible. Designed to Convert. Made in Ghana 🇬🇭</p>
            <div className="footer-socials">
              <a href="https://github.com/clispy1" className="social-btn" target="_blank" rel="noreferrer">Gh</a>
              <a href="https://twitter.com/clispy_jake" className="social-btn" target="_blank" rel="noreferrer">Tw</a>
              <a href="https://linkedin.com/company/jerome-asare" className="social-btn" target="_blank" rel="noreferrer">Li</a>
              <a href="https://instagram.com/jake_clispy" className="social-btn" target="_blank" rel="noreferrer">Ig</a>
            </div>
          </div>
          <div>
            <div className="footer-links-title">Services</div>
            <ul className="footer-links">
              <li><a href="#services">Web Design & Development</a></li>
              <li><a href="#services">E-commerce Development</a></li>
              <li><a href="#services">Digital Marketing & Ads</a></li>
              <li><a href="#packages">View Pricing</a></li>
            </ul>
          </div>
          <div>
            <div className="footer-links-title">Company</div>
            <ul className="footer-links">
              <li><a href="#about">About Us</a></li>
              <li><a href="#process">How We Work</a></li>
              <li><a href="#projects">Our Work</a></li>
              <li><a href="#testimonials">Testimonials</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </div>
          <div>
            <div className="footer-links-title">Contact</div>
            <ul className="footer-links">
              <li><a href="mailto:jake@clispysolutions.com">jake@clispysolutions.com</a></li>
              <li><a href="tel:+233206601059">+233 20 660 1059</a></li>
              <li><a href="https://wa.me/233206601059" target="_blank" rel="noreferrer">WhatsApp Us</a></li>
              <li><a href="#lead-magnet">Free Website Audit</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2025 Clispy Solutions. All rights reserved.</span>
          <span>Crafting digital excellence from <span className="footer-gh">Ghana 🇬🇭</span></span>
        </div>
      </footer>

      {/* CASE STUDY MODAL */}
      <div id="modal-overlay" className={modalOpen ? 'open' : ''} onClick={(e) => {
          if (e.target === e.currentTarget) {
            setModalOpen(false); 
            document.body.style.overflow = '';
          }
      }}>
        <div className="modal" id="modal">
          <button className="modal-close" onClick={() => {
              setModalOpen(false); 
              document.body.style.overflow = '';
          }}>✕</button>
          <div className="modal-header">
            <div className="modal-tag">{modalData.tag}</div>
            <div className="modal-title">{modalData.name}</div>
            <div className="modal-subtitle">{modalData.sub}</div>
          </div>
          <div className="modal-body">
            <div className="modal-section">
              <div className="modal-section-title">The Challenge</div>
              <p>{modalData.challenge}</p>
            </div>
            <div className="modal-section">
              <div className="modal-section-title">Our Solution</div>
              <p>{modalData.solution}</p>
            </div>
            <div className="modal-section">
              <div className="modal-result">
                <div className="modal-section-title">The Result</div>
                <p>{modalData.result}</p>
              </div>
            </div>
            <div className="modal-section">
              <div className="modal-section-title">Tech Stack</div>
              <div className="modal-tech">
                {modalData.tech.map(t => <span key={t}>{t}</span>)}
              </div>
            </div>
            <div className="modal-cta">
              <a href="#contact" className="btn-primary" onClick={() => {
                  setModalOpen(false); 
                  document.body.style.overflow = '';
              }} style={{flex:1, textAlign:'center'}}>Start Similar Project</a>
              <a href={modalData.url || '#'} target="_blank" rel="noreferrer" className="btn-outline">View Live Site ↗</a>
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp FAB */}
      <a href="https://wa.me/233206601059" target="_blank" rel="noreferrer" className="wa-fab">
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><path d="M13 2C7.477 2 3 6.477 3 12c0 1.85.504 3.58 1.384 5.063L3 23l6.063-1.384A9.944 9.944 0 0013 22c5.523 0 10-4.477 10-10S18.523 2 13 2z" stroke="white" strokeWidth="1.6" strokeLinejoin="round"/><path d="M9.5 10.5s0-1 1-1h1l1 2.5-1 .5s-.5 0 0 1 2.5 2.5 3.5 2.5l.5-1 2.5 1v1s-1 1-1.5 1C14 18 8 11.5 9.5 10.5z" fill="white"/></svg>
      </a>

      <TweaksPanel onGeomChange={(v) => setGeomType(v)} onSpeedChange={(v) => setSpeedMult(v)} />
    </>
  );
}

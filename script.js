/**
 * GIRIARASU S - Portfolio Interactive Script
 * Features:
 * - Theme switcher with LocalStorage persistence
 * - Mobile navigation drawer toggle
 * - Sticky header & active navigation link scroll spy
 * - Skill tabs switcher (Technical vs Soft skills)
 * - Copy to clipboard with custom toast notification
 * - Interactive ATS-ready resume preview modal & print trigger
 * - Contact form client-side validation & mailto dispatch
 * - Scroll-triggered entrance animations
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. THEME SWITCHER (Dark / Light) ---
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;

  // Initialize theme from storage or system preference
  const savedTheme = localStorage.getItem('giriarasu_theme') || 'dark';
  htmlElement.setAttribute('data-theme', savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme');
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      htmlElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem('giriarasu_theme', nextTheme);
      showToast(`Switched to ${nextTheme === 'dark' ? 'Dark' : 'Light'} theme`);
    });
  }

  // --- 2. MOBILE NAVIGATION DRAWER ---
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      mobileMenuBtn.classList.toggle('active', isOpen);
      mobileMenuBtn.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile drawer when clicking any link
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileMenuBtn.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!mobileDrawer.contains(e.target) && !mobileMenuBtn.contains(e.target) && mobileDrawer.classList.contains('open')) {
        mobileDrawer.classList.remove('open');
        mobileMenuBtn.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --- 3. STICKY NAVBAR & SCROLL SPY ---
  const header = document.getElementById('header');
  const sections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.nav-link');

  const handleScroll = () => {
    // Header shadow toggle
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll spy for current active section
    let currentActiveId = '';
    const scrollPosition = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentActiveId = section.getAttribute('id');
      }
    });

    if (currentActiveId) {
      desktopNavLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentActiveId}`) {
          link.classList.add('active');
        }
      });

      mobileLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentActiveId}`) {
          link.classList.add('active');
        }
      });
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // --- 4. SKILLS TAB SWITCHER ---
  const skillTabBtns = document.querySelectorAll('.skill-tab-btn');
  const techPanel = document.getElementById('tech-skills-panel');
  const softPanel = document.getElementById('soft-skills-panel');

  skillTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      skillTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetTab = btn.getAttribute('data-tab');
      if (targetTab === 'technical') {
        techPanel.classList.add('active');
        softPanel.classList.remove('active');
      } else {
        softPanel.classList.add('active');
        techPanel.classList.remove('active');
      }
    });
  });

  // --- 5. TOAST NOTIFICATIONS & CLIPBOARD COPY ---
  const toastContainer = document.getElementById('toast-container');

  function showToast(message, type = 'success') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    
    // Icon
    const iconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    iconSvg.setAttribute('viewBox', '0 0 24 24');
    iconSvg.setAttribute('width', '18');
    iconSvg.setAttribute('height', '18');
    iconSvg.setAttribute('fill', 'none');
    iconSvg.setAttribute('stroke', 'currentColor');
    iconSvg.setAttribute('stroke-width', '2');
    
    if (type === 'success') {
      iconSvg.innerHTML = '<polyline points="20 6 9 17 4 12"></polyline>';
    } else {
      iconSvg.innerHTML = '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>';
    }

    const textSpan = document.createElement('span');
    textSpan.textContent = message;

    toast.appendChild(iconSvg);
    toast.appendChild(textSpan);
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-out');
      toast.addEventListener('animationend', () => {
        toast.remove();
      });
    }, 3200);
  }

  // Copy Buttons handler
  const copyButtons = document.querySelectorAll('.copy-btn');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(`Copied to clipboard: ${textToCopy}`);
      }).catch(() => {
        // Fallback
        const tempInput = document.createElement('input');
        tempInput.value = textToCopy;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        showToast(`Copied to clipboard: ${textToCopy}`);
      });
    });
  });

  // --- 6. RESUME MODAL & PRINT HANDLER ---
  const resumeModal = document.getElementById('resume-modal');
  const resumeTriggerBtns = document.querySelectorAll('.resume-trigger-btn');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const printResumeBtn = document.getElementById('print-resume-btn');

  const openResumeModal = () => {
    if (resumeModal) {
      resumeModal.classList.add('open');
      resumeModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeResumeModal = () => {
    if (resumeModal) {
      resumeModal.classList.remove('open');
      resumeModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  };

  resumeTriggerBtns.forEach(btn => {
    btn.addEventListener('click', openResumeModal);
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeResumeModal);
  }

  // Close modal when clicking on overlay background
  if (resumeModal) {
    resumeModal.addEventListener('click', (e) => {
      if (e.target === resumeModal) {
        closeResumeModal();
      }
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && resumeModal && resumeModal.classList.contains('open')) {
      closeResumeModal();
    }
  });

  // Print Resume / Save as PDF
  if (printResumeBtn) {
    printResumeBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // --- 7. CONTACT FORM VALIDATION & MAILTO ---
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('sender-name');
      const emailInput = document.getElementById('sender-email');
      const subjectInput = document.getElementById('sender-subject');
      const messageInput = document.getElementById('sender-message');

      let isValid = true;

      // Validate Name
      if (!nameInput.value.trim()) {
        setError(nameInput, true);
        isValid = false;
      } else {
        setError(nameInput, false);
      }

      // Validate Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        setError(emailInput, true);
        isValid = false;
      } else {
        setError(emailInput, false);
      }

      // Validate Subject
      if (!subjectInput.value.trim()) {
        setError(subjectInput, true);
      } else {
        setError(subjectInput, false);
      }

      // Validate Message
      if (!messageInput.value.trim()) {
        setError(messageInput, true);
        isValid = false;
      } else {
        setError(messageInput, false);
      }

      if (!isValid) {
        showToast('Please fill all required fields correctly', 'error');
        return;
      }

      // Compose mailto link
      const recipient = 'giriarasul244@gmail.com';
      const mailSubject = encodeURIComponent(`[Portfolio Inquiry] ${subjectInput.value.trim()} - from ${nameInput.value.trim()}`);
      const mailBody = encodeURIComponent(
        `Hi Giriarasu,\n\nName: ${nameInput.value.trim()}\nEmail: ${emailInput.value.trim()}\n\nMessage:\n${messageInput.value.trim()}\n\nBest regards,\n${nameInput.value.trim()}`
      );

      // Launch mailto
      window.location.href = `mailto:${recipient}?subject=${mailSubject}&body=${mailBody}`;

      showToast('Opening your email client to send your message!');
      contactForm.reset();
    });

    function setError(inputElement, isError) {
      const parentGroup = inputElement.closest('.form-group');
      if (parentGroup) {
        parentGroup.classList.toggle('has-error', isError);
      }
    }

    // Clear error on typing
    ['sender-name', 'sender-email', 'sender-subject', 'sender-message'].forEach(id => {
      const input = document.getElementById(id);
      if (input) {
        input.addEventListener('input', () => {
          const parent = input.closest('.form-group');
          if (parent) parent.classList.remove('has-error');
        });
      }
    });
  }

  // --- 8. BACK TO TOP BUTTON ---
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --- 9. INTERSECTION OBSERVER FOR FADE-IN ANIMATIONS ---
  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const animatedCards = document.querySelectorAll('.glass-card, .timeline-item, .quick-stats-row');
  animatedCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(24px)';
    card.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    revealObserver.observe(card);
  });
});

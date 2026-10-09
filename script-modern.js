(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.add('js');

  function onReady(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback, { once: true });
    } else {
      callback();
    }
  }

  onReady(function () {
    var body = document.body;
    var sideNavigation = document.getElementById('side-navigation');
    var sidebarToggle = document.getElementById('sidebar-toggle');
    var mobileNavToggle = document.getElementById('mobile-nav-toggle');
    var sidebarScrim = document.getElementById('sidebar-scrim');
    var storageKey = 'academic-sidebar-collapsed';
    var reducedMotion = window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)')
      : { matches: false };
    var homeSlideshow = document.querySelector('[data-home-slideshow]');
    var homeSlides = homeSlideshow
      ? Array.prototype.slice.call(homeSlideshow.querySelectorAll('[data-home-slide]'))
      : [];
    var homeSlideDots = homeSlideshow
      ? Array.prototype.slice.call(homeSlideshow.querySelectorAll('.home-slide-status span'))
      : [];
    var homeSlideIndex = 0;
    var homeSlideTimer = 0;
    var lastMobileTrigger = null;
    var lastLayoutWasMobile = null;
    var resizeFrame = 0;
    var fallbackTabIndexes = new Map();

    function showHomeSlide(index) {
      if (!homeSlides.length) return;
      homeSlideIndex = (index + homeSlides.length) % homeSlides.length;
      homeSlides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === homeSlideIndex);
      });
      homeSlideDots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === homeSlideIndex);
      });
    }

    function stopHomeSlideshow() {
      if (!homeSlideTimer) return;
      window.clearInterval(homeSlideTimer);
      homeSlideTimer = 0;
    }

    function startHomeSlideshow() {
      stopHomeSlideshow();
      if (homeSlides.length < 2 || reducedMotion.matches) return;
      homeSlideTimer = window.setInterval(function () {
        if (!document.hidden) showHomeSlide(homeSlideIndex + 1);
      }, 5000);
    }

    showHomeSlide(0);
    startHomeSlideshow();

    function isMobileLayout() {
      if (mobileNavToggle) {
        return window.getComputedStyle(mobileNavToggle).display !== 'none';
      }
      return window.matchMedia ? window.matchMedia('(max-width: 899px)').matches : false;
    }

    function readCollapsedPreference() {
      try {
        return window.localStorage.getItem(storageKey) === 'true';
      } catch (error) {
        return false;
      }
    }

    function writeCollapsedPreference(collapsed) {
      try {
        window.localStorage.setItem(storageKey, String(collapsed));
      } catch (error) {
        // The layout still works when storage is blocked or unavailable.
      }
    }

    function setSidebarInert(inert) {
      if (!sideNavigation) return;

      if ('inert' in sideNavigation) {
        sideNavigation.inert = inert;
        return;
      }

      sideNavigation.querySelectorAll('a[href], button, input, select, textarea, [tabindex]').forEach(function (element) {
        if (inert) {
          if (!fallbackTabIndexes.has(element)) {
            fallbackTabIndexes.set(element, element.getAttribute('tabindex'));
          }
          element.setAttribute('tabindex', '-1');
        } else if (fallbackTabIndexes.has(element)) {
          var previous = fallbackTabIndexes.get(element);
          if (previous === null) {
            element.removeAttribute('tabindex');
          } else {
            element.setAttribute('tabindex', previous);
          }
          fallbackTabIndexes.delete(element);
        }
      });
    }

    function updateDesktopToggle(collapsed) {
      if (!sidebarToggle) return;
      sidebarToggle.setAttribute('aria-expanded', String(!collapsed));
      sidebarToggle.setAttribute('aria-label', collapsed ? 'Expand site navigation' : 'Collapse site navigation');
      sidebarToggle.title = collapsed ? 'Expand navigation (Alt+S)' : 'Collapse navigation (Alt+S)';
    }

    function setDesktopCollapsed(collapsed, persist) {
      body.classList.toggle('sidebar-collapsed', collapsed);
      updateDesktopToggle(collapsed);
      if (persist) writeCollapsedPreference(collapsed);
    }

    function firstSidebarControl() {
      if (!sideNavigation) return null;
      return sideNavigation.querySelector('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');
    }

    function setMobileOpen(open, restoreFocus) {
      body.classList.toggle('sidebar-open', open);

      if (mobileNavToggle) {
        mobileNavToggle.setAttribute('aria-expanded', String(open));
        mobileNavToggle.setAttribute('aria-label', open ? 'Close site navigation' : 'Open site navigation');
      }

      if (sideNavigation) {
        sideNavigation.setAttribute('aria-hidden', String(!open));
        setSidebarInert(!open);
      }

      if (sidebarScrim) {
        sidebarScrim.hidden = !open;
        sidebarScrim.setAttribute('aria-hidden', 'true');
      }

      if (open) {
        lastMobileTrigger = document.activeElement instanceof HTMLElement
          ? document.activeElement
          : mobileNavToggle;
        var firstControl = firstSidebarControl();
        if (firstControl) {
          window.requestAnimationFrame(function () {
            firstControl.focus({ preventScroll: true });
          });
        }
      } else if (restoreFocus && lastMobileTrigger && document.contains(lastMobileTrigger)) {
        lastMobileTrigger.focus({ preventScroll: true });
        lastMobileTrigger = null;
      }
    }

    function closeMobileNavigation(restoreFocus) {
      setMobileOpen(false, restoreFocus);
    }

    function syncLayout(force) {
      var mobile = isMobileLayout();
      if (!force && mobile === lastLayoutWasMobile) return;
      lastLayoutWasMobile = mobile;

      if (mobile) {
        body.classList.remove('sidebar-collapsed');
        closeMobileNavigation(false);
      } else {
        body.classList.remove('sidebar-open');
        if (sidebarScrim) sidebarScrim.hidden = true;
        if (sideNavigation) {
          sideNavigation.removeAttribute('aria-hidden');
          setSidebarInert(false);
        }
        if (mobileNavToggle) mobileNavToggle.setAttribute('aria-expanded', 'false');
        setDesktopCollapsed(readCollapsedPreference(), false);
      }
    }

    if (sidebarToggle) {
      sidebarToggle.addEventListener('click', function () {
        if (isMobileLayout()) {
          closeMobileNavigation(true);
          return;
        }
        setDesktopCollapsed(!body.classList.contains('sidebar-collapsed'), true);
      });
    }

    if (mobileNavToggle) {
      mobileNavToggle.addEventListener('click', function () {
        setMobileOpen(!body.classList.contains('sidebar-open'), true);
      });
    }

    if (sidebarScrim) {
      sidebarScrim.addEventListener('click', function () {
        closeMobileNavigation(true);
      });
    }

    if (sideNavigation) {
      sideNavigation.addEventListener('click', function (event) {
        if (isMobileLayout() && event.target.closest('a[href]')) {
          closeMobileNavigation(false);
        }
      });
    }

    document.addEventListener('click', function (event) {
      if (!isMobileLayout() || !body.classList.contains('sidebar-open')) return;
      if (sideNavigation && sideNavigation.contains(event.target)) return;
      if (mobileNavToggle && mobileNavToggle.contains(event.target)) return;
      closeMobileNavigation(true);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && body.classList.contains('sidebar-open')) {
        event.preventDefault();
        closeMobileNavigation(true);
        return;
      }

      if (
        event.altKey &&
        !event.ctrlKey &&
        !event.metaKey &&
        event.key.toLowerCase() === 's' &&
        !isMobileLayout()
      ) {
        event.preventDefault();
        setDesktopCollapsed(!body.classList.contains('sidebar-collapsed'), true);
      }
    });

    window.addEventListener('resize', function () {
      if (resizeFrame) window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(function () {
        resizeFrame = 0;
        syncLayout(false);
      });
    }, { passive: true });

    syncLayout(true);

    var filterButtons = Array.prototype.slice.call(document.querySelectorAll('[data-filter]'));
    var publicationCards = Array.prototype.slice.call(document.querySelectorAll('[data-publication]'));
    var publicationCount = document.getElementById('publication-count');

    if (!publicationCount && filterButtons.length) {
      publicationCount = document.createElement('p');
      publicationCount.id = 'publication-count';
      publicationCount.className = 'publication-count';
      publicationCount.setAttribute('role', 'status');
      publicationCount.setAttribute('aria-live', 'polite');
      var filterBar = filterButtons[0].closest('.filter-bar');
      if (filterBar) filterBar.insertAdjacentElement('afterend', publicationCount);
    }

    function cardMatchesFilter(card, filter) {
      if (filter === 'all') return true;
      return String(card.dataset.publication || '')
        .toLowerCase()
        .split(/[\s,]+/)
        .indexOf(filter) !== -1;
    }

    function applyPublicationFilter(filter, selectedButton) {
      var normalizedFilter = String(filter || 'all').toLowerCase();
      var visibleCount = 0;

      filterButtons.forEach(function (button) {
        var selected = button === selectedButton;
        button.classList.toggle('active', selected);
        button.setAttribute('aria-pressed', String(selected));
      });

      publicationCards.forEach(function (card) {
        var visible = cardMatchesFilter(card, normalizedFilter);
        card.hidden = !visible;
        if (visible) visibleCount += 1;
      });

      if (publicationCount) {
        publicationCount.textContent = visibleCount + ' ' + (visibleCount === 1 ? 'publication' : 'publications');
      }
    }

    if (filterButtons.length && publicationCards.length) {
      filterButtons.forEach(function (button) {
        button.addEventListener('click', function () {
          applyPublicationFilter(button.dataset.filter, button);
        });
      });

      var initialFilter = filterButtons.find(function (button) {
        return button.getAttribute('aria-pressed') === 'true' || button.classList.contains('active');
      }) || filterButtons[0];
      applyPublicationFilter(initialFilter.dataset.filter, initialFilter);
    } else if (publicationCount) {
      publicationCount.textContent = publicationCards.length + ' ' + (publicationCards.length === 1 ? 'publication' : 'publications');
    }

    var revealItems = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
    var revealObserver = null;

    function revealEverything() {
      if (revealObserver) {
        revealObserver.disconnect();
        revealObserver = null;
      }
      revealItems.forEach(function (item) {
        item.classList.add('is-revealed');
        item.style.removeProperty('--reveal-delay');
      });
    }

    function initializeReveals() {
      if (!revealItems.length || reducedMotion.matches || !('IntersectionObserver' in window)) {
        revealEverything();
        return;
      }

      revealItems.forEach(function (item, index) {
        item.style.setProperty('--reveal-delay', ((index % 4) * 70) + 'ms');
      });

      revealObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        });
      }, {
        threshold: 0.08,
        rootMargin: '0px 0px -8% 0px'
      });

      revealItems.forEach(function (item) {
        revealObserver.observe(item);
      });
    }

    initializeReveals();

    function handleReducedMotionChange(event) {
      if (event.matches) {
        revealEverything();
        stopHomeSlideshow();
      } else {
        startHomeSlideshow();
      }
    }

    if (typeof reducedMotion.addEventListener === 'function') {
      reducedMotion.addEventListener('change', handleReducedMotionChange);
    } else if (typeof reducedMotion.addListener === 'function') {
      reducedMotion.addListener(handleReducedMotionChange);
    }

    function syncAmbientState() {
      body.classList.toggle('ambient-paused', document.hidden);
    }

    document.addEventListener('visibilitychange', syncAmbientState);
    syncAmbientState();
  });
}());

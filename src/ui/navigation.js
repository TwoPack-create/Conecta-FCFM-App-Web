import { $, $$, toggleHidden } from '../utils/dom.js';

let currentSection = 'home';

const closeMenu = () => {
  const sideNav = $('#sideNav');
  const overlay = $('#overlay');
  if (!sideNav || !overlay) return;
  sideNav.classList.remove('open');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
};

const openMenu = () => {
  const sideNav = $('#sideNav');
  const overlay = $('#overlay');
  if (!sideNav || !overlay) return;
  sideNav.classList.add('open');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
};

export const showSection = sectionId => {
  const sections = $$('.section');
  sections.forEach(section => section.classList.remove('active'));

  const target = $(`#${sectionId}`);
  if (target) {
    target.classList.add('active');
    currentSection = sectionId;
  }

  const navLinks = $$('a[data-section]');
  navLinks.forEach(link => {
    link.classList.toggle('active', link.dataset.section === sectionId);
  });

  const tabButtons = $$(`[data-parent-section="${sectionId}"] .tab-btn`);
  tabButtons.forEach(button => {
    const defaultTab = button.closest('.tab-content');
    if (defaultTab) {
      defaultTab.classList.add('active');
    }
  });

  closeMenu();
};

export const initializeNavigation = () => {
  const menuToggle = $('#menuToggle');
  const closeNav = $('#closeNav');
  const overlay = $('#overlay');
  const navLinks = $$('a[data-section]');
  const quickActionButtons = $$('.action-btn[data-section]');

  menuToggle?.addEventListener('click', event => {
    event.preventDefault();
    openMenu();
  });

  closeNav?.addEventListener('click', event => {
    event.preventDefault();
    closeMenu();
  });

  overlay?.addEventListener('click', event => {
    event.preventDefault();
    closeMenu();
  });

  navLinks.forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      const { section } = link.dataset;
      if (section) {
        showSection(section);
      }
    });
  });

  quickActionButtons.forEach(button => {
    button.addEventListener('click', () => {
      const section = button.dataset.section;
      if (section) {
        showSection(section);
      }
    });
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeMenu();
    }
  });

  showSection(currentSection);
};

export const toggleAppShell = visible => {
  const header = $('#appHeader');
  const sideNav = $('#sideNav');
  const overlay = $('#overlay');
  const mainContent = $('#appLayout');
  const footer = $('#appFooter');

  toggleHidden(header, !visible);
  toggleHidden(sideNav, !visible);
  toggleHidden(overlay, !visible);
  toggleHidden(mainContent, !visible);
  toggleHidden(footer, !visible);
};

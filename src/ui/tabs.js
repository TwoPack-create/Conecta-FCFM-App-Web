import { $$ } from '../utils/dom.js';

export const initializeTabs = () => {
  const tabContainers = $$('.tabs[data-tab-group]');
  tabContainers.forEach(container => {
    const group = container.dataset.tabGroup;
    const buttons = container.querySelectorAll('.tab-btn');
    const panels = document.querySelectorAll(`.tab-content[data-tab-group="${group}"]`);

    buttons.forEach(button => {
      button.addEventListener('click', () => {
        const targetId = button.dataset.tabTarget;
        buttons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        panels.forEach(panel => {
          panel.classList.toggle('active', panel.id === targetId);
        });
      });
    });
  });
};

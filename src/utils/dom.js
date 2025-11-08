export const $ = (selector, scope = document) => scope.querySelector(selector);

export const $$ = (selector, scope = document) =>
  Array.from(scope.querySelectorAll(selector));

export const toggleHidden = (element, shouldHide) => {
  if (!element) return;
  element.classList.toggle('hidden', shouldHide);
};

export const setText = (element, text) => {
  if (!element) return;
  element.textContent = text;
};

export const setHTML = (element, html) => {
  if (!element) return;
  element.innerHTML = html;
};

export const appendHTML = (element, html) => {
  if (!element) return;
  element.insertAdjacentHTML('beforeend', html);
};

export const clearElement = element => {
  if (!element) return;
  element.innerHTML = '';
};

export const disableElement = (element, disabled) => {
  if (!element) return;
  element.disabled = disabled;
};

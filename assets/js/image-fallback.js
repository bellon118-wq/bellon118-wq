(() => {
  'use strict';

  function showPlaceholder(image) {
    const placeholder = document.createElement('span');
    placeholder.className = `image-fallback-graphic ${image.classList.contains('character-avatar') ? 'character-avatar' : ''}`.trim();
    placeholder.setAttribute('role', 'img');
    placeholder.setAttribute('aria-label', image.dataset.fallbackAlt || 'Abstract character artwork placeholder');
    image.replaceWith(placeholder);
  }

  function handleImageError(event) {
    const image = event.target;
    if (!(image instanceof HTMLImageElement) || !image.dataset.imageFallback) return;
    if (image.dataset.fallbackApplied) {
      showPlaceholder(image);
      return;
    }

    image.dataset.fallbackApplied = 'true';
    image.alt = image.dataset.fallbackAlt || 'Abstract character artwork placeholder';
    image.classList.add('is-image-fallback');
    image.src = image.dataset.imageFallback;
  }

  document.addEventListener('error', handleImageError, true);
  document.querySelectorAll('img[data-image-fallback]').forEach(image => {
    if (image.getAttribute('src') && image.complete && image.naturalWidth === 0) handleImageError({ target: image });
  });
})();

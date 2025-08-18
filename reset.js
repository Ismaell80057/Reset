(async () => {
  try {
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map(r => r.unregister()));
    }
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map(k => caches.delete(k)));
    }
    const p = document.createElement('p');
    p.textContent = 'OK. Recharge maintenant la page principale.';
    document.body.appendChild(p);
  } catch (e) {
    alert('Erreur lors du reset: ' + e.message);
  }
})();

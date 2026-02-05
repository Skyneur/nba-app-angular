import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const playerDetailGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const id = route.paramMap.get('id');

  // ❌ Pas d'ID dans l'URL
  if (!id) {
    console.warn('🛡️ Guard: Aucun ID fourni');
    router.navigate(['/404']);
    return false;
  }

  // ❌ ID vide
  if (id.trim() === '') {
    console.warn('🛡️ Guard: ID vide');
    router.navigate(['/404']);
    return false;
  }

  // ✅ ID valide, accès autorisé
  console.log(`🛡️ Guard: Accès autorisé pour le joueur #${id}`);
  return true;
};

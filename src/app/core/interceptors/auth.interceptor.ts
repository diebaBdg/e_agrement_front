import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Liste des URLs qui ne nécessitent pas d'authentification
  const publicUrls = [
    '/auth/login',
    '/auth/register',
    '/demandes/public',
    '/demandes/suivre',
    '/types-agrement'
  ];

  // Vérifier si l'URL actuelle est publique
  const isPublicUrl = publicUrls.some(url => req.url.includes(url));

  // Si un token existe et que ce n'est pas une URL publique, ajouter le token
  if (token && !isPublicUrl) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedReq);
  }

  return next(req);
};
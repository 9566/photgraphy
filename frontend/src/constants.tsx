import React from 'react';
import type { PortfolioCategory, Service } from './types';

export const PHOTOGRAPHER_INFO = {
  name: 'Prithiviraj',
  location: 'Namakkal',
  intro: 'A passionate photographer from Namakkal with over a decade of experience in capturing life\'s most precious moments. My journey began with a simple film camera, a gift from my father, which ignited a lifelong passion for storytelling through images. I specialize in weaving narratives, whether it’s the fairytale romance of a wedding, the raw energy of a fashion shoot, or the quiet intimacy of a newborn\'s first days. My style is a blend of cinematic and photojournalistic, focusing on authentic emotions and stunning visuals. I believe that a great photograph is not just seen, but felt.',
};

export const CONTACT_INFO = {
  studioName: 'PR Studio',
  phones: ['+91 9080873534', '+91 7598169892'],
  email: 'prstudionkl@gmail.com',
  instagramUsername: '@pr_studio_____',
  instagramUrl: 'https://www.instagram.com/pr_studio_____/',
  address: `PR STUDIO, 58, Mariamman Kovil Street, SH 161, Namakkal`,
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=PR+STUDIO,+58,+Mariamman+Kovil+Street,+SH+161,+Namakkal',
};

export const INITIAL_PORTFOLIO_CATEGORIES: PortfolioCategory[] = [
  { id: 'wedding', name: 'Wedding Photography', subcategories: ['Pre-wedding', 'Post-wedding'], coverImage: 'https://picsum.photos/seed/wedding/800/600', photos: [{id: 1, name: 'Wedding Ceremony', url: 'https://picsum.photos/seed/wed1/1200/800'}, {id: 2, name: 'Couple Portrait', url: 'https://picsum.photos/seed/wed2/1200/800'}, {id: 3, name: 'Bridal Details', url: 'https://picsum.photos/seed/wed3/1200/800'}, {id: 4, name: 'Reception Fun', url: 'https://picsum.photos/seed/wed4/1200/800'}] },
  { id: 'fashion', name: 'Fashion Photography', subcategories: [], coverImage: 'https://picsum.photos/seed/fashion/800/600', photos: [{id: 5, name: 'Editorial Look', url: 'https://picsum.photos/seed/fashion1/1200/800'}, {id: 6, name: 'Street Style', url: 'https://picsum.photos/seed/fashion2/1200/800'}] },
  { id: 'newborn', name: 'Newborn Photography', subcategories: [], coverImage: 'https://picsum.photos/seed/newborn/800/600', photos: [{id: 7, name: 'Sleeping Baby', url: 'https://picsum.photos/seed/newborn1/1200/800'}, {id: 8, name: 'Family Moment', url: 'https://picsum.photos/seed/newborn2/1200/800'}] },
  { id: 'model', name: 'Model Shoot', subcategories: [], coverImage: 'https://picsum.photos/seed/model/800/600', photos: [{id: 9, name: 'Studio Headshot', url: 'https://picsum.photos/seed/model1/1200/800'}, {id: 10, name: 'Outdoor Pose', url: 'https://picsum.photos/seed/model2/1200/800'}, {id: 11, name: 'Candid Laughter', url: 'https://picsum.photos/seed/model3/1200/800'}] },
  { id: 'ear-piercing', name: 'Ear Piercing Photography', subcategories: [], coverImage: 'https://picsum.photos/seed/ear/800/600', photos: [{id: 12, name: 'First Earrings', url: 'https://picsum.photos/seed/ear1/1200/800'}] },
  { id: 'documentary', name: 'Documentary Photography', subcategories: [], coverImage: 'https://picsum.photos/seed/doc/800/600', photos: [{id: 13, name: 'Storytelling Image', url: 'https://picsum.photos/seed/doc1/1200/800'}, {id: 14, name: 'Behind the Scenes', url: 'https://picsum.photos/seed/doc2/1200/800'}] },
  { id: 'festival', name: 'Festival Photography', subcategories: [], coverImage: 'https://picsum.photos/seed/festival/800/600', photos: [{id: 15, name: 'Crowd Energy', url: 'https://picsum.photos/seed/fest1/1200/800'}, {id: 16, name: 'Cultural Performance', url: 'https://picsum.photos/seed/fest2/1200/800'}] },
  { id: 'product', name: 'Product Photography', subcategories: [], coverImage: 'https://picsum.photos/seed/product/800/600', photos: [{id: 17, name: 'Commercial Shot', url: 'https://picsum.photos/seed/prod1/1200/800'}] },
];

export const SERVICES: Service[] = [
    { id: 1, name: 'Wedding Package', basePrice: 150000, discount: 15, description: 'Full day coverage, from bride prep to reception. Includes a 40-page album.', finalPrice: 127500 },
    { id: 2, name: 'Fashion Shoot', basePrice: 50000, discount: 10, description: '4-hour session, 3 outfits, professional editing for 20 photos.', finalPrice: 45000 },
    { id: 3, name: 'Newborn Session', basePrice: 30000, discount: 0, description: '3-hour studio session with props. Safely handled by experts.', finalPrice: 30000 },
    { id: 4, name: 'Product Photography', basePrice: 25000, discount: 5, description: 'Up to 20 products, white background, high-resolution images for e-commerce.', finalPrice: 23750 },
];

export const ICONS = {
    camera: (className = 'h-6 w-6') => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    close: (className = 'h-6 w-6') => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
    spinner: (className = 'animate-spin h-5 w-5 text-white') => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>,
    star: (className = 'h-5 w-5') => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>,
    mail: (className = 'h-6 w-6') => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
    phone: (className = 'h-6 w-6') => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
    location: (className = 'h-6 w-6') => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    instagram: (className = 'h-6 w-6') => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeLinecap="round"></line></svg>,
    trash: (className = 'h-6 w-6') => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
};
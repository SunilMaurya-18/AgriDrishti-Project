import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/settings', '/profile', '/soil', '/disease', '/reports', '/recommendations'],
      },
    ],
    sitemap: 'https://prithvicore.com/sitemap.xml',
  };
}

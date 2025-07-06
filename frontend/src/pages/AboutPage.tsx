
import React from 'react';
import { PageWrapper } from '../components/PageWrapper';
import { PHOTOGRAPHER_INFO } from '../constants';

export const AboutPage: React.FC = () => (
  <PageWrapper title="About">
    <div className="flex flex-col md:flex-row items-center gap-12">
      <div className="md:w-1/3">
        <img src="https://picsum.photos/seed/prithiviraj/600/800" alt={PHOTOGRAPHER_INFO.name} className="rounded-lg shadow-2xl object-cover w-full h-auto" />
      </div>
      <div className="md:w-2/3">
        <h1 className="text-5xl font-bold text-brand-primary mb-4">{PHOTOGRAPHER_INFO.name}</h1>
        <h2 className="text-2xl font-semibold text-brand-secondary mb-6">{PHOTOGRAPHER_INFO.location}</h2>
        <p className="text-lg leading-relaxed text-brand-text whitespace-pre-line">{PHOTOGRAPHER_INFO.intro}</p>
      </div>
    </div>
  </PageWrapper>
);

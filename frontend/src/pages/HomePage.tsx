
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as api from '../services/apiService';
import type { PortfolioCategory, Feedback } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const HomePage: React.FC = () => {
    const [data, setData] = useState<{categories: PortfolioCategory[], feedback: Feedback[] } | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [categories, feedback] = await Promise.all([
                    api.getPortfolio(),
                    api.getFeedback(), 
                ]);
                setData({ categories: categories || [], feedback: feedback || [] });
            } catch (error) {
                console.error("Failed to fetch home page data", error);
                setData({ categories: [], feedback: [] }); // Set empty data on error
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="flex-grow">
            <div className="relative h-[80vh] min-h-[500px] flex items-center justify-center text-center text-white -mt-20">
                <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
                <img src="https://picsum.photos/seed/hero/1920/1080" alt="Hero background" className="absolute inset-0 w-full h-full object-cover"/>
                <div className="relative z-20 p-4">
                    <h1 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-lg">Capturing Life's Moments</h1>
                    <p className="text-lg md:text-xl max-w-2xl mx-auto drop-shadow-md">From wedding vows to newborn smiles, we frame your memories with artistry and passion.</p>
                    <Link to="/portfolio" className="mt-8 inline-block bg-brand-primary text-brand-bg font-bold py-3 px-8 rounded-lg text-lg hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105">
                        View My Work
                    </Link>
                </div>
            </div>
            
            {isLoading ? <LoadingSpinner /> : (
                <>
                    {data && data.categories.length > 0 && (
                        <section className="py-20 bg-brand-bg">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                                <h2 className="text-4xl font-bold text-brand-secondary mb-4">Featured Categories</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-10">
                                    {data.categories.slice(0, 4).map(cat => (
                                        <Link to={`/portfolio/${cat.id}`} key={cat.id} className="group relative overflow-hidden rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105">
                                            <img src={cat.coverImage} alt={cat.name} className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"/>
                                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                                <h3 className="text-2xl font-bold text-white">{cat.name}</h3>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}

                    {data && data.feedback.length > 0 && (
                         <section className="py-20 bg-brand-surface">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                                <h2 className="text-4xl font-bold text-brand-secondary mb-12">What Our Clients Say</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {data.feedback.slice(-3).reverse().map(feedback => (
                                        <div key={feedback.id} className="bg-brand-bg p-8 rounded-lg shadow-lg flex flex-col items-center">
                                            <div className="flex text-yellow-400 text-2xl mb-4">
                                                {'★'.repeat(feedback.rating)}<span className="text-gray-600">{'★'.repeat(5 - feedback.rating)}</span>
                                            </div>
                                            <p className="text-brand-text italic mb-4">"{feedback.review}"</p>
                                            <h3 className="font-bold text-brand-primary mt-auto">- {feedback.name}</h3>
                                        </div>
                                    ))}
                                </div>
                                <Link to="/reviews" className="mt-12 inline-block text-brand-primary hover:underline">
                                    Read all reviews &rarr;
                                </Link>
                            </div>
                        </section>
                    )}
                </>
            )}
        </div>
    );
};

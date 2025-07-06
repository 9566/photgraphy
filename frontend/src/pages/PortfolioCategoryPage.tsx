
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import * as api from '../services/apiService';
import type { Photo } from '../types';
import { ICONS } from '../constants';
import { PageWrapper } from '../components/PageWrapper';
import { ErrorMessage } from '../components/ErrorMessage';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const PortfolioCategoryPage: React.FC = () => {
    const { categoryId } = useParams<{ categoryId: string }>();
    const location = useLocation();
    const { user } = useAuth();

    // The category name is passed from the previous page to avoid an extra API call.
    // We fall back to the categoryId if the state is not available (e.g., direct navigation).
    const categoryName = location.state?.name || categoryId;

    const [photos, setPhotos] = useState<Photo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    const fetchPhotos = useCallback(async () => {
        if (!categoryId) return;
        try {
            setIsLoading(true);
            setError(null);
            const fetchedPhotos = await api.getPhotosByCategory(categoryId);
            setPhotos(fetchedPhotos);
        } catch (err) {
            setError("Could not load photos. Please ensure the backend is running and reachable.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [categoryId]);

    useEffect(() => {
        fetchPhotos();
    }, [fetchPhotos]);
    
    const handlePhotoDelete = async (photoId: number) => {
        if (!window.confirm("Are you sure you want to delete this photo? This cannot be undone.")) return;
        try {
            await api.deletePhoto(photoId);
            setPhotos(prevPhotos => prevPhotos.filter(p => p.id !== photoId));
            alert("Photo deleted successfully.");
        } catch (error) {
            console.error("Failed to delete photo:", error);
            alert("Failed to delete photo. Please try again.");
        }
    };

    const handleAddPhotoClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !categoryId) return;

        const defaultName = file.name.replace(/\.[^/.]+$/, "");
        const photoName = window.prompt("Enter a name for this photo:", defaultName);
        
        // Reset file input value so the same file can be selected again
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        
        if (!photoName) {
            return; // User cancelled the prompt
        }

        setIsUploading(true);
        try {
            const newPhoto = await api.uploadPhoto(file, categoryId, photoName);
            setPhotos(prevPhotos => [...prevPhotos, newPhoto]);
            alert("Photo added successfully.");
        } catch (error) {
            console.error("Failed to upload photo:", error);
            alert("Failed to add photo.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.src = `https://picsum.photos/seed/placeholder/1200/800`;
        e.currentTarget.onerror = null;
    };

    if (!categoryId) {
        return <PageWrapper title="Not Found"><ErrorMessage message="Portfolio category not found." /></PageWrapper>;
    }

    return (
        <PageWrapper title={categoryName}>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-5xl font-bold text-brand-primary">{categoryName}</h1>
                {user?.role === 'admin' && (
                     <div>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileSelect}
                          className="hidden"
                          accept="image/*"
                        />
                        <button
                          onClick={handleAddPhotoClick}
                          disabled={isUploading}
                          className="bg-brand-primary text-brand-bg font-bold py-2 px-6 rounded-lg hover:bg-opacity-90 disabled:bg-gray-500 flex items-center justify-center gap-2"
                        >
                          {isUploading ? (
                              <>
                                  {ICONS.spinner()}
                                  Uploading...
                              </>
                          ) : (
                              'Add Photo'
                          )}
                        </button>
                    </div>
                )}
            </div>

            {isLoading && <LoadingSpinner text="Loading photos..." />}
            {error && <ErrorMessage message={error} />}

            {!isLoading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {photos.map((photo) => (
                        <div key={photo.id} className="flex flex-col gap-2">
                             <div className="relative group overflow-hidden rounded-lg">
                                <img src={photo.url} onError={handleImageError} alt={photo.name} className="w-full h-auto object-cover aspect-[4/3] shadow-lg transition-transform duration-300 group-hover:scale-105" />
                                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                                    <p className="text-white font-bold text-lg truncate" title={photo.name}>{photo.name}</p>
                                </div>
                            </div>
                            {user?.role === 'admin' && (
                               <button onClick={() => handlePhotoDelete(photo.id)} className="flex items-center justify-center gap-2 self-center bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 text-sm transition-colors" title="Delete Photo">
                                    {ICONS.trash('h-4 w-4')}
                                    <span>Delete</span>
                                </button>
                            )}
                        </div>
                    ))}
                    {photos.length === 0 && (
                        <div className="md:col-span-2 lg:col-span-3 text-center py-10 bg-brand-surface rounded-lg">
                            <p className="text-gray-400">This category has no photos yet. Admins can add photos using the button above.</p>
                        </div>
                    )}
                </div>
            )}

            <div className="text-center mt-12">
                <Link to="/portfolio" className="text-brand-primary hover:underline">&larr; Back to all portfolios</Link>
            </div>
        </PageWrapper>
    );
};
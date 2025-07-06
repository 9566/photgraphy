import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { ContactSubmission, Feedback, Service, PortfolioCategory, Photo } from '../types';
import * as api from '../services/apiService';
import { PageWrapper } from '../components/PageWrapper';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { ICONS } from '../constants';

export const AdminPage: React.FC = () => {
    const { user, updateUserContext } = useAuth();
    
    const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);
    const [feedback, setFeedback] = useState<Feedback[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [portfolio, setPortfolio] = useState<PortfolioCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string|null>(null);
    
    const [activeTab, setActiveTab] = useState<'profile' | 'submissions' | 'feedback' | 'portfolio' | 'services' | 'export'>('portfolio');

    const [newService, setNewService] = useState({ name: '', description: '', basePrice: 0, discount: 0 });
    const [showAddServiceForm, setShowAddServiceForm] = useState(false);
    
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profileData, setProfileData] = useState({ email: user?.email || '', phone: user?.phone || '' });

    // Portfolio state
    const [newPhoto, setNewPhoto] = useState({ name: '', categoryId: '', file: null as File | null });
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);


    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            const [subs, fdb, srvs, portfolioData] = await Promise.all([
                api.getContactSubmissions(),
                api.getFeedback(),
                api.getServices(),
                api.getFullPortfolio()
            ]);
            setContactSubmissions(subs || []);
            setFeedback(fdb || []);
            setServices(srvs || []);
            setPortfolio(portfolioData || []);
            if (portfolioData && portfolioData.length > 0 && !newPhoto.categoryId) {
                 setNewPhoto(p => ({...p, categoryId: portfolioData[0].id}));
            }
            setError(null);
        } catch(e) {
            setError("Failed to load admin data. Ensure the backend is running.");
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [newPhoto.categoryId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);
    
    useEffect(() => {
        if (user) {
            setProfileData({ email: user.email, phone: user.phone || '' });
        }
    }, [user]);

    const deleteFeedbackItem = async (idToDelete: number) => {
        if (window.confirm("Are you sure you want to delete this feedback?")) {
            try {
                await api.deleteFeedback(idToDelete);
                setFeedback(currentFeedback => currentFeedback.filter(f => f.id !== idToDelete));
            } catch (error) {
                alert("Failed to delete feedback.");
            }
        }
    };

    const handleAddService = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!newService.name || newService.basePrice <= 0) {
            alert("Please provide a valid service name and a price greater than 0.");
            return;
        }
        try {
            const addedService = await api.addService(newService);
            setServices(servs => [...servs, addedService]);
            setNewService({ name: '', description: '', basePrice: 0, discount: 0 });
            setShowAddServiceForm(false);
        } catch (error) {
            alert("Failed to add service.");
        }
    };

    const deleteServiceItem = async (idToDelete: number) => {
        if(window.confirm("Are you sure you want to delete this service?")) {
            try {
                await api.deleteService(idToDelete);
                setServices(servs => servs.filter(s => s.id !== idToDelete));
            } catch (error) {
                alert("Failed to delete service.");
            }
        }
    };
    
    const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user) return;
        try {
            const updatedUser = await api.apiUpdateProfile(user.id, profileData);
            updateUserContext(updatedUser);
            setIsEditingProfile(false);
            alert("Profile updated successfully!");
        } catch (error) {
            alert("Failed to update profile. (Mock API)");
        }
    };
    
    const handlePhotoUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPhoto.file || !newPhoto.name || !newPhoto.categoryId) {
            alert("Please fill out all fields: Photo Name, Category, and select a file.");
            return;
        }
        setIsUploading(true);
        try {
            const uploadedPhoto = await api.uploadPhoto(newPhoto.file, newPhoto.categoryId, newPhoto.name);
            setPortfolio(currentPortfolio => {
                return currentPortfolio.map(cat => {
                    if (cat.id === newPhoto.categoryId) {
                        return { ...cat, photos: [...cat.photos, uploadedPhoto] };
                    }
                    return cat;
                });
            });
            // Reset form
            setNewPhoto(p => ({ ...p, name: '', file: null }));
            if (fileInputRef.current) fileInputRef.current.value = "";
            alert("Photo uploaded successfully!");
        } catch (error) {
            console.error(error);
            alert("Failed to upload photo.");
        } finally {
            setIsUploading(false);
        }
    };

    const handlePhotoDelete = async (photoId: number) => {
        if (!window.confirm("Are you sure you want to delete this photo?")) return;
        try {
            await api.deletePhoto(photoId);
            setPortfolio(currentPortfolio => 
                currentPortfolio.map(cat => ({
                    ...cat,
                    photos: cat.photos.filter(p => p.id !== photoId),
                }))
            );
            alert("Photo deleted successfully.");
        } catch (error) {
            console.error(error);
            alert("Failed to delete photo.");
        }
    };

    const handleExportUsers = async () => {
        try {
            const usersToExport = await api.apiGetAllUsers();
            if (usersToExport.length === 0) {
                alert("There are no users to export.");
                return;
            }
            const headers = "ID,Name,Email,Phone,Role,Created Date";
            const csvContent = [
                headers,
                ...usersToExport.map(u => `${u.id},"${u.name}","${u.email}","${u.phone || ''}","${u.role}","${new Date(u.createdAt || '').toLocaleString()}"`)
            ].join('\n');
            
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "users.csv");
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Failed to export user data:", error);
            alert("Could not export user data. (Mock API)");
        }
    };

    const handleExportSubmissions = async () => {
        try {
            const submissionsToExport = await api.getContactSubmissions();
            if (submissionsToExport.length === 0) {
                alert("There are no contact submissions to export.");
                return;
            }
            const headers = "ID,Timestamp,Name,Email,Phone,Message";
            const csvContent = [
                headers,
                ...submissionsToExport.map(s => {
                    const message = `"${s.message.replace(/"/g, '""')}"`; // Escape double quotes
                    return `${s.id},"${new Date(s.timestamp).toLocaleString()}","${s.name}","${s.email}","${s.phone}",${message}`;
                })
            ].join('\n');
            
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "contact_submissions.csv");
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Failed to export submission data:", error);
            alert("Could not export submission data.");
        }
    };


    const AdminTabButton: React.FC<{tabId: any, children: React.ReactNode}> = ({ tabId, children }) => (
        <button
            onClick={() => setActiveTab(tabId)}
            className={`px-4 py-2 text-sm sm:text-base font-medium transition-colors border-b-2 ${activeTab === tabId ? 'border-b-brand-primary text-brand-primary' : 'border-transparent text-gray-400 hover:text-white'}`}
        >
            {children}
        </button>
    );
    
    if (isLoading) return <PageWrapper title="Admin"><LoadingSpinner text="Loading Admin Data..."/></PageWrapper>;
    if (error) return <PageWrapper title="Admin"><ErrorMessage message={error}/></PageWrapper>;

    return (
        <PageWrapper title="Admin Dashboard">
            <h1 className="text-5xl font-bold mb-6 text-brand-primary">Admin Dashboard</h1>
            
            <div className="border-b border-gray-700 mb-8 flex flex-wrap">
                <AdminTabButton tabId="portfolio">Portfolio</AdminTabButton>
                <AdminTabButton tabId="profile">Profile</AdminTabButton>
                <AdminTabButton tabId="submissions">Submissions</AdminTabButton>
                <AdminTabButton tabId="feedback">Feedback</AdminTabButton>
                <AdminTabButton tabId="services">Services</AdminTabButton>
                <AdminTabButton tabId="export">Export</AdminTabButton>
            </div>

            <div className="bg-brand-surface p-6 rounded-lg">
                {activeTab === 'profile' && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Welcome, {user?.name}</h2>
                        <div className="max-w-md">
                            {isEditingProfile ? (
                                <form onSubmit={handleProfileUpdate} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-brand-text">Email</label>
                                        <input type="email" value={profileData.email} onChange={e => setProfileData({...profileData, email: e.target.value})} className="w-full p-2 bg-gray-700 rounded" required/>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-brand-text">Phone Number</label>
                                        <input type="tel" value={profileData.phone} onChange={e => setProfileData({...profileData, phone: e.target.value})} className="w-full p-2 bg-gray-700 rounded" />
                                    </div>
                                    <div className="flex gap-2">
                                        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Save Changes</button>
                                        <button type="button" onClick={() => setIsEditingProfile(false)} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500">Cancel</button>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-4">
                                    <p><strong>Email:</strong> {user?.email}</p>
                                    <p><strong>Phone:</strong> {user?.phone || 'Not set'}</p>
                                    <button onClick={() => setIsEditingProfile(true)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                                        Edit Profile
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                 {activeTab === 'portfolio' && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Manage Portfolio</h2>
                        
                        {/* Upload Form */}
                        <form onSubmit={handlePhotoUpload} className="bg-gray-800 p-6 rounded-lg mb-8 space-y-4">
                            <h3 className="text-xl font-semibold">Upload New Photo</h3>
                            <div className="grid md:grid-cols-3 gap-4">
                                <input type="text" placeholder="Photo Name (e.g. Shoot 1)" value={newPhoto.name} onChange={e => setNewPhoto({...newPhoto, name: e.target.value})} className="w-full p-3 bg-gray-700 rounded-md border border-gray-600 focus:ring-brand-primary focus:border-brand-primary" required />
                                <select value={newPhoto.categoryId} onChange={e => setNewPhoto({...newPhoto, categoryId: e.target.value})} className="w-full p-3 bg-gray-700 rounded-md border border-gray-600 focus:ring-brand-primary focus:border-brand-primary" required>
                                    {portfolio.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                </select>
                                <input type="file" ref={fileInputRef} onChange={e => setNewPhoto({...newPhoto, file: e.target.files?.[0] || null})} className="w-full p-2 bg-gray-700 rounded-md border border-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-brand-primary file:text-brand-bg hover:file:bg-opacity-90" accept="image/*" required />
                            </div>
                             <button type="submit" disabled={isUploading} className="bg-brand-primary text-brand-bg font-bold py-2 px-6 rounded-lg hover:bg-opacity-90 disabled:bg-gray-500 flex items-center justify-center gap-2">
                                {isUploading ? <>{ICONS.spinner()} Uploading...</> : 'Upload Photo'}
                            </button>
                        </form>

                        {/* Photo Gallery */}
                        <div className="space-y-6">
                            {portfolio.map(category => (
                                <div key={category.id}>
                                    <h3 className="text-xl font-semibold mb-3 border-b border-gray-600 pb-2">{category.name}</h3>
                                    {category.photos.length > 0 ? (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                            {[...category.photos].reverse().map(photo => (
                                                <div key={photo.id} className="relative group bg-gray-800 rounded-lg overflow-hidden">
                                                    <img src={photo.url} alt={photo.name} className="w-full h-32 object-cover" />
                                                    <div className="p-2">
                                                        <p className="text-sm font-semibold truncate" title={photo.name}>{photo.name}</p>
                                                    </div>
                                                    <button onClick={() => handlePhotoDelete(photo.id)} className="absolute top-1 right-1 bg-red-600/80 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600" title="Delete Photo">
                                                        {ICONS.trash('h-4 w-4')}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500">No photos in this category yet.</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {activeTab === 'submissions' && (
                     <div>
                        <h2 className="text-2xl font-bold mb-4">Contact Form Submissions</h2>
                        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                            {contactSubmissions.length > 0 ? [...contactSubmissions].reverse().map((sub) => (
                                <div key={sub.id} className="bg-gray-800 p-4 rounded">
                                    <p><strong>Name:</strong> {sub.name} <span className="text-xs text-gray-400">({new Date(sub.timestamp).toLocaleString()})</span></p>
                                    <p><strong>Email:</strong> {sub.email}</p>
                                    <p><strong>Phone:</strong> {sub.phone}</p>
                                    <p className="mt-2 text-gray-300"><em>"{sub.message}"</em></p>
                                </div>
                            )) : <p>No submissions yet.</p>}
                        </div>
                    </div>
                )}

                {activeTab === 'feedback' && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Client Feedback</h2>
                        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                            {feedback.length > 0 ? [...feedback].reverse().map((f) => (
                                <div key={f.id} className="bg-gray-800 p-4 rounded relative group">
                                    <p><strong>{f.name}</strong> - <span className="text-yellow-400">{'★'.repeat(f.rating)}</span><span className="text-gray-500">{'★'.repeat(5-f.rating)}</span></p>
                                    <p className="mt-1 text-gray-300"><em>"{f.review}"</em></p>
                                    <button className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => deleteFeedbackItem(f.id)}>
                                        {ICONS.close('h-4 w-4')}
                                    </button>
                                </div>
                            )) : <p>No feedback submitted yet.</p>}
                        </div>
                    </div>
                )}

                {activeTab === 'services' && (
                     <div>
                        <h2 className="text-2xl font-bold mb-4">Manage Services</h2>
                        <div className="space-y-4">
                            {services.map((service) => (
                                <div key={service.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-800 p-3 rounded gap-2">
                                    <span className="font-semibold">{service.name}</span>
                                    <div className="flex items-center gap-4">
                                         <span className="text-lg font-semibold">₹{service.finalPrice.toLocaleString()}</span>
                                        <button onClick={() => deleteServiceItem(service.id)} className="text-red-500 hover:text-red-400 text-sm">Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6">
                            {showAddServiceForm ? (
                                <form onSubmit={handleAddService} className="bg-gray-800 p-4 rounded-lg space-y-4">
                                    <h3 className="font-bold">Add New Service</h3>
                                    <input type="text" placeholder="Service Name" value={newService.name} onChange={e => setNewService({...newService, name: e.target.value})} className="w-full p-2 bg-gray-700 rounded"/>
                                    <textarea placeholder="Description" value={newService.description} onChange={e => setNewService({...newService, description: e.target.value})} className="w-full p-2 bg-gray-700 rounded" rows={3}></textarea>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input type="number" placeholder="Base Price" value={newService.basePrice || ''} onChange={e => setNewService({...newService, basePrice: Number(e.target.value)})} className="w-full p-2 bg-gray-700 rounded"/>
                                        <input type="number" placeholder="Discount %" value={newService.discount || ''} onChange={e => setNewService({...newService, discount: Number(e.target.value)})} className="w-full p-2 bg-gray-700 rounded"/>
                                    </div>
                                    <div className="flex gap-2">
                                        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Save Service</button>
                                        <button type="button" onClick={() => setShowAddServiceForm(false)} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500">Cancel</button>
                                    </div>
                                </form>
                            ) : (
                                <button onClick={() => setShowAddServiceForm(true)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                                    Add New Service
                                </button>
                            )}
                        </div>
                    </div>
                )}
                
                {activeTab === 'export' && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Export Data</h2>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1 bg-gray-800 p-6 rounded-lg">
                                <h3 className="xACtext-xl font-semibold mb-2">User Data</h3>
                                <p className="text-gray-400 mb-4">Download a CSV file of all registered admin users.</p>
                                <button onClick={handleExportUsers} className="bg-green-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-800 transition-colors w-full sm:w-auto">
                                    Download Users (.csv)
                                </button>
                            </div>
                            <div className="flex-1 bg-gray-800 p-6 rounded-lg">
                                <h3 className="text-xl font-semibold mb-2">Contact Submissions</h3>
                                <p className="text-gray-400 mb-4">Download a CSV file of all enquiries from the contact form.</p>
                                <button onClick={handleExportSubmissions} className="bg-sky-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-sky-800 transition-colors w-full sm:w-auto">
                                    Download Submissions (.csv)
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </PageWrapper>
    );
};
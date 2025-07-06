import type { User, PortfolioCategory, Service, ContactSubmission, Feedback, Photo } from '../types';
import { INITIAL_PORTFOLIO_CATEGORIES, SERVICES, CONTACT_INFO } from '../constants';

// This service is fully mocked to ensure offline functionality and avoid network errors.
const MOCK_DELAY = 300;

// --- Helper Functions ---
const mockApi = <T>(data: T, shouldFail = false): Promise<T> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (shouldFail) {
                // Simulate an Axios-style error for consistent error handling in the UI
                const err: any = new Error("Mock API Error");
                err.isAxiosError = true;
                err.response = { status: 500, data: { message: "Internal Server Error" } };
                reject(err);
            } else {
                // Deep clone data to simulate a fresh API response and prevent mutation bugs
                resolve(JSON.parse(JSON.stringify(data)));
            }
        }, MOCK_DELAY);
    });
};

const initStorage = <T>(key: string, initialData: T): T => {
    try {
        const stored = sessionStorage.getItem(key);
        if (stored) return JSON.parse(stored);
        sessionStorage.setItem(key, JSON.stringify(initialData));
        return initialData;
    } catch {
        sessionStorage.setItem(key, JSON.stringify(initialData));
        return initialData;
    }
};

const saveData = (key: string, data: any) => sessionStorage.setItem(key, JSON.stringify(data));


// --- MOCK DATA STORE ---
const defaultAdminUser: Omit<User, 'id'> & { password?: string } = {
  name: 'Admin',
  email: CONTACT_INFO.email,
  password: '123456',
  role: 'admin',
  phone: CONTACT_INFO.phones[0],
  createdAt: new Date().toISOString()
};

let mockUsers = initStorage<any[]>('mock_users', [{ id: 1, ...defaultAdminUser }]);
let mockPortfolio = initStorage<PortfolioCategory[]>('mock_portfolio', INITIAL_PORTFOLIO_CATEGORIES);
let mockServices = initStorage<Service[]>('mock_services', SERVICES);
let mockContacts = initStorage<ContactSubmission[]>('mock_contacts', []);
let mockFeedbackList = initStorage<Feedback[]>('mock_feedback', [
    {id: 1, name: 'Sathish Kumar', rating: 5, review: 'Absolutely stunning wedding photos!', timestamp: new Date().toISOString()},
]);


// --- API FUNCTIONS ---

// Authentication
export const login = (email: string, password: string): Promise<{ user: User; token: string }> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const user = mockUsers.find(u => u.email === email && u.password === password);
            if (user) {
                const { password, ...userWithoutPass } = user;
                resolve({ user: userWithoutPass, token: `mock_token_${Date.now()}` });
            } else {
                const err: any = new Error("Invalid credentials");
                err.isAxiosError = true;
                err.response = { status: 401 };
                reject(err);
            }
        }, MOCK_DELAY);
    });
};

// Portfolio & Photo Management
export const getPortfolio = (): Promise<PortfolioCategory[]> => {
    const categoriesShell = mockPortfolio.map(cat => ({ ...cat, photos: [] }));
    return mockApi(categoriesShell);
};

export const getFullPortfolio = (): Promise<PortfolioCategory[]> => mockApi(mockPortfolio);

export const getPhotosByCategory = (category: string): Promise<Photo[]> => {
    const categoryData = mockPortfolio.find(c => c.id === category);
    return mockApi(categoryData ? categoryData.photos : []);
};

export const uploadPhoto = (file: File, category: string, name: string): Promise<Photo> => {
    return new Promise((resolve, reject) => {
        const categoryData = mockPortfolio.find(c => c.id === category);
        if (!categoryData) {
            return reject(new Error("Category not found"));
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const newPhoto: Photo = {
                id: Date.now(),
                url: reader.result as string,
                name,
            };
            categoryData.photos.push(newPhoto);
            saveData('mock_portfolio', mockPortfolio);

            setTimeout(() => resolve(newPhoto), MOCK_DELAY);
        };
        reader.onerror = (error) => {
            console.error("FileReader error: ", error);
            reject(new Error("Failed to read file."));
        };
    });
};

export const deletePhoto = (photoId: number): Promise<void> => {
    mockPortfolio.forEach(category => {
        category.photos = category.photos.filter(p => p.id !== photoId);
    });
    saveData('mock_portfolio', mockPortfolio);
    return mockApi(undefined);
};

// Form Submissions
export const submitEnquiry = (data: { name: string; email: string; phone: string; message: string }): Promise<void> => {
    const newSubmission: ContactSubmission = { id: Date.now(), ...data, timestamp: new Date().toISOString() };
    mockContacts.push(newSubmission);
    saveData('mock_contacts', mockContacts);
    return mockApi(undefined);
};

export const getContactSubmissions = (): Promise<ContactSubmission[]> => mockApi(mockContacts);

export const submitFeedback = (data: { name: string; rating: number; review: string }): Promise<void> => {
    const newFeedback: Feedback = { id: Date.now(), ...data, timestamp: new Date().toISOString() };
    mockFeedbackList.push(newFeedback);
    saveData('mock_feedback', mockFeedbackList);
    return mockApi(undefined);
};

export const getFeedback = (): Promise<Feedback[]> => mockApi(mockFeedbackList);

export const deleteFeedback = (feedbackId: number): Promise<void> => {
    mockFeedbackList = mockFeedbackList.filter(f => f.id !== feedbackId);
    saveData('mock_feedback', mockFeedbackList);
    return mockApi(undefined);
};

// Services
export const getServices = (): Promise<Service[]> => mockApi(mockServices);
export const addService = (service: Omit<Service, 'id' | 'finalPrice'>): Promise<Service> => {
    const newService: Service = { id: Date.now(), ...service, finalPrice: Math.round(service.basePrice * (1 - service.discount / 100)) };
    mockServices = [...mockServices, newService];
    saveData('mock_services', mockServices);
    return mockApi(newService);
};
export const updateService = (service: Service): Promise<Service> => {
    const updatedService = {
      ...service,
      finalPrice: Math.round(service.basePrice * (1 - service.discount / 100))
    };
    mockServices = mockServices.map(s => s.id === service.id ? updatedService : s);
    saveData('mock_services', mockServices);
    return mockApi(updatedService);
};
export const deleteService = (serviceId: number): Promise<void> => {
    mockServices = mockServices.filter(s => s.id !== serviceId);
    saveData('mock_services', mockServices);
    return mockApi(undefined);
};

// User Management (Admin)
export const apiUpdateProfile = (userId: number, data: { email?: string; phone?: string }): Promise<User> => {
    let updatedUser: any;
    mockUsers = mockUsers.map(u => {
        if (u.id === userId) {
            const updated = { ...u, ...data };
            updatedUser = updated;
            return updated;
        }
        return u;
    });

    if (updatedUser) {
        saveData('mock_users', mockUsers);
        const { password, ...userWithoutPass } = updatedUser;
        return mockApi(userWithoutPass);
    }
    return Promise.reject(new Error("User not found"));
};

export const apiGetAllUsers = (): Promise<User[]> => {
    const usersWithoutPasswords = mockUsers.map(u => {
        const { password, ...user } = u;
        return user;
    });
    return mockApi(usersWithoutPasswords);
};
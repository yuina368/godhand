/**
 * Simple in-memory database for demo
 * In production, use PostgreSQL, MongoDB, etc.
 */

interface User {
    id: string;
    email?: string;
    isPremium: boolean;
    stripeCustomerId?: string;
    createdAt: Date;
}

interface Reading {
    id: string;
    userId: string;
    score: number;
    resultData: any;
    createdAt: Date;
}

// In-memory storage (for development)
const users = new Map<string, User>();
const readings = new Map<string, Reading>();

export const db = {
    users: {
        findById: async (id: string): Promise<User | null> => {
            return users.get(id) || null;
        },

        create: async (data: Omit<User, 'createdAt'>): Promise<User> => {
            const user: User = {
                ...data,
                createdAt: new Date(),
            };
            users.set(user.id, user);
            return user;
        },

        update: async (id: string, data: Partial<User>): Promise<User | null> => {
            const user = users.get(id);
            if (!user) return null;

            const updated = { ...user, ...data };
            users.set(id, updated);
            return updated;
        },

        findByStripeCustomerId: async (customerId: string): Promise<User | null> => {
            for (const user of users.values()) {
                if (user.stripeCustomerId === customerId) {
                    return user;
                }
            }
            return null;
        },
    },

    readings: {
        create: async (data: Omit<Reading, 'createdAt'>): Promise<Reading> => {
            const reading: Reading = {
                ...data,
                createdAt: new Date(),
            };
            readings.set(reading.id, reading);
            return reading;
        },

        findById: async (id: string): Promise<Reading | null> => {
            return readings.get(id) || null;
        },

        findByUserId: async (userId: string): Promise<Reading[]> => {
            return Array.from(readings.values())
                .filter(r => r.userId === userId)
                .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        },
    },
};

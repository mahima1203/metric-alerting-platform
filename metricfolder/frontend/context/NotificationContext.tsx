'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { toast, Toaster } from 'sonner';
import ConfirmModal from '@/components/ConfirmModal';

interface NotificationContextType {
    showToast: (message: string, type: 'success' | 'error' | 'info') => void;
    confirm: (options: ConfirmOptions) => void;
}

interface ConfirmOptions {
    title: string;
    message: string;
    onConfirm: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [confirmState, setConfirmState] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
    } | null>(null);

    const showToast = useCallback((message: string, type: 'success' | 'error' | 'info') => {
        if (type === 'success') toast.success(message);
        else if (type === 'error') toast.error(message);
        else toast(message);
    }, []);

    const confirm = useCallback((options: ConfirmOptions) => {
        setConfirmState({
            isOpen: true,
            title: options.title,
            message: options.message,
            onConfirm: () => {
                options.onConfirm();
                setConfirmState(null);
            },
        });
    }, []);

    return (
        <NotificationContext.Provider value={{ showToast, confirm }}>
            <Toaster richColors position="top-right" />
            {children}
            {confirmState && (
                <ConfirmModal
                    isOpen={confirmState.isOpen}
                    title={confirmState.title}
                    message={confirmState.message}
                    onConfirm={confirmState.onConfirm}
                    onCancel={() => setConfirmState(null)}
                />
            )}
        </NotificationContext.Provider>
    );
}

export function useNotification() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
}

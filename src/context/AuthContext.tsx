import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type AuthProviderProps = {
    children: React.ReactNode;
};

// type ContextType = {
//     authData: any;
//     onLogin?: (newAuthData: {}) => void;
//     onLogout?: () => void;
// };

export const AuthContext = createContext<any>(null);
const initialAuthData = {};

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [authData, setAuthData] = useState<any>(initialAuthData);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const userInfo = JSON.parse(localStorage.getItem('userInfo')!);
            setAuthData({ userInfo });
        }
        setLoading(false);
    }, []);

    const onLogin = (newAuthData: any) => {
        localStorage.setItem('token', newAuthData.token);
        localStorage.setItem('userInfo', JSON.stringify(newAuthData.userInfo));
        setAuthData({ userInfo: newAuthData.userInfo });
    };

    const onLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        setAuthData(initialAuthData);
    };

    const authDataValue: any = useMemo(() => ({ authData, onLogin, onLogout }), [authData]);

    return (
        <AuthContext.Provider value={authDataValue}>{!loading && children}</AuthContext.Provider>
    );
};

export const useAuthContext = () => useContext(AuthContext);

export default AuthProvider;

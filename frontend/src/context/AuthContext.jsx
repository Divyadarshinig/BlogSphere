import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("blogsphereUser");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [token, setToken] = useState(() => {
        return localStorage.getItem("blogsphereToken") || null;
    });

    const login = (userData, jwtToken) => {
        setUser(userData);
        setToken(jwtToken);

        localStorage.setItem(
            "blogsphereUser",
            JSON.stringify(userData)
        );

        localStorage.setItem(
            "blogsphereToken",
            jwtToken
        );
    };

    const logout = () => {
        setUser(null);
        setToken(null);

        localStorage.removeItem("blogsphereUser");
        localStorage.removeItem("blogsphereToken");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                logout,
                isAuthenticated: !!token
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
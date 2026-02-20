
import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

interface AuthContextType {
    session: Session | null;
    user: User | null;
    loading: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    session: null,
    user: null,
    loading: true,
    signOut: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Helper to get or create device ID
    const getDeviceId = () => {
        let deviceId = localStorage.getItem("device_id");
        if (!deviceId) {
            deviceId = crypto.randomUUID();
            localStorage.setItem("device_id", deviceId);
        }
        return deviceId;
    };

    const autoLogin = async () => {
        try {
            const deviceId = getDeviceId();
            const email = `${deviceId}@gainmaster.local`;
            const password = `pass-${deviceId}`; // Simple password based on device ID

            // 1. Try to sign in
            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (!signInError && signInData.session) {
                return; // Success, listener will handle state
            }

            // 2. If sign in fails (likely user doesn't exist), sign up
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        username: "User-" + deviceId.slice(0, 4),
                    },
                },
            });

            if (signUpError) {
                console.error("Auto-login error:", signUpError);
            }
        } catch (error) {
            console.error("Auto-auth exception:", error);
        }
    };

    useEffect(() => {
        // Check session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (!session) {
                autoLogin();
            } else {
                setLoading(false);
            }
        });

        // Listen
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            // Only stop loading if we have a session (or if we decide to stop waiting)
            if (session) {
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider value={{ session, user, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

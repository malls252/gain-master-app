
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
                console.log("Auto-login success");
                return; // Success, listener will handle state
            }

            // 2. If sign in fails (likely user doesn't exist), sign up
            console.log("Sign in failed, trying sign up...");
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
                console.error("Auto-signup error:", signUpError);
            } else {
                console.log("Auto-signup success");
            }
        } catch (error) {
            console.error("Auto-auth exception:", error);
        }
    };


    useEffect(() => {
        let mounted = true;

        // Check session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!mounted) return;
            
            setSession(session);
            setUser(session?.user ?? null);
            
            if (!session) {
                console.log("No session, attempting auto-login...");
                autoLogin().finally(() => {
                    if (mounted) setLoading(false);
                });
            } else {
                console.log("Session found");
                setLoading(false);
            }
        }).catch((error) => {
            console.error("Get session error:", error);
            if (mounted) setLoading(false);
        });

        // Listen
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!mounted) return;
            
            setSession(session);
            setUser(session?.user ?? null);
            // Always stop loading when auth state changes
            setLoading(false);
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
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

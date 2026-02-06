import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

export const SERVER_URL = "https://rentelme-server.onrender.com";

export const ServerAwake = ({ children }: { children: React.ReactNode }) => {
    const [attempt, setAttempt] = useState(0);

    // Non-blocking server wakeup (background ping)
    useEffect(() => {
        const wakeUp = async () => {
            // Just ping to wake it up, don't block
            try {
                await fetch(`${SERVER_URL}/`);
            } catch (e) {
                // Ignore errors, we just want to trigger the wake-up
                if (attempt < 5) {
                    setTimeout(() => setAttempt(p => p + 1), 5000);
                }
            }
        };

        wakeUp();
    }, [attempt]);

    // Always render children immediately
    return <>{children}</>;
};

import { useEffect, useState } from "react";
import { LoginContext, LoginResource } from "../LoginContext";
import { getLogin } from "./api";

export function LoginManager({ children }: { children: React.ReactNode }) {
    const [login, setLogin] = useState<LoginResource | false | undefined>(undefined);

    const checkLogin = async () => {
        const logIn = await getLogin();
        setLogin(logIn);
    }

    useEffect(() => { checkLogin().catch(() => setLogin(false)); }, []);

    return (
        <LoginContext.Provider value={{ login, setLogin }}>
            {children}
        </LoginContext.Provider>
    );
}
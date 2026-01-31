import { createContext, useContext } from "react";

export interface LoginResource {
    id: string;
    role: "u" | "a";
    exp: number;
}

interface LoginContextType {
    login: LoginResource | false | undefined;
    setLogin: (loginInfo: LoginResource | false | undefined) => void;
}

export const LoginContext = createContext<LoginContextType>({} as LoginContextType);

export const useLoginContext = () => useContext(LoginContext);
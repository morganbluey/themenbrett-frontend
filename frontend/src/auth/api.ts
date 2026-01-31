import { LoginResource } from "../LoginContext";

export async function postLogin(campusID: string, password: string) {
    const url = import.meta.env.VITE_API_SERVER_URL + "/api/login";

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include" as RequestCredentials,
        body: JSON.stringify({ campusID, password })
    });
    if (response.ok) {
        const loginInfo: LoginResource = await response.json();
        return loginInfo;
    }
    if (response.status === 401) {
        throw new Error("Invalid credentials");
    }
    // wird im nächsten Blatt (so wie ich das verstanden habe aus der Vorlesung) korrekt validiert während der Eingabe
    if (response.status === 400) {
        throw new Error("Credentials not in correct format");
    }
    throw new Error("Error connecting to " + import.meta.env.VITE_API_SERVER_URL + ": " + response.statusText);
}

export async function getLogin(): Promise<LoginResource | false> {
    const url = import.meta.env.VITE_API_SERVER_URL + "/api/login";
    const response = await fetch(url, { method: "GET", credentials: "include" });
    if (response.ok) {
        const loginInfo: LoginResource = await response.json();
        return loginInfo;
    }
    throw new Error("Error checking login, status: " + response.status);
}

export async function deleteLogin(): Promise<void> {
    const url = import.meta.env.VITE_API_SERVER_URL + "/api/login";
    const response = await fetch(url, { method: "DELETE", credentials: "include" });
    if (response.ok) {
        return;
    }
    throw new Error("Error logging out, status: " + response.status);
}
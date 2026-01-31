import type { ThemaResource, GebietResource, ProfResource } from "../Resources";
import { fetchWithErrorHandling } from "./fetchWithErrorHandling";
import { themen, gebiete } from "./testdata";

export const MAX_LENGTH_LINE_STRING = 100;
export const MAX_LENGTH_MULTILINE_STRING = 1000;

export async function getAlleGebiete(): Promise<GebietResource[]> {
    if (import.meta.env.VITE_REAL_FETCH !== 'true') {
        await new Promise(r => setTimeout(r, 700));
        return Promise.resolve(gebiete);
    } else {
        const response = await fetchWithErrorHandling(import.meta.env.VITE_API_SERVER_URL + "/api/gebiet/alle", { credentials: "include" });
        return ((await response.json()) as GebietResource[]);
    }
}

export async function getAlleThemen(gebietId: string): Promise<ThemaResource[]> {
    if (import.meta.env.VITE_REAL_FETCH !== 'true') {
        await new Promise(r => setTimeout(r, 700));
        return Promise.resolve(themen);
    } else {
        const response = await fetchWithErrorHandling(import.meta.env.VITE_API_SERVER_URL + "/api/gebiet/" + gebietId + "/themen", { credentials: "include" });
        return ((await response.json()) as ThemaResource[]);
    }
}

export async function getGebiet(gebietId: string): Promise<GebietResource> {
    const response = await fetchWithErrorHandling(import.meta.env.VITE_API_SERVER_URL + "/api/gebiet/" + gebietId, { credentials: "include" });
    return ((await response.json()) as GebietResource);
}

export async function getThema(themaId: string): Promise<ThemaResource> {
    const response = await fetchWithErrorHandling(import.meta.env.VITE_API_SERVER_URL + "/api/thema/" + themaId, { credentials: "include" });
    return ((await response.json()) as ThemaResource);
}

export async function postGebiet(gebiet: GebietResource): Promise<GebietResource> {
    const response = await fetchWithErrorHandling(import.meta.env.VITE_API_SERVER_URL + "/api/gebiet/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(gebiet)
    });
    return ((await response.json()) as GebietResource);
}

export async function deleteGebiet(gebietId: string): Promise<void> {
    await fetchWithErrorHandling(import.meta.env.VITE_API_SERVER_URL + "/api/gebiet/" + gebietId, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include"
    });
    return;
}

export async function putGebiet(gebiet: GebietResource): Promise<GebietResource> {
    const response = await fetchWithErrorHandling(import.meta.env.VITE_API_SERVER_URL + "/api/gebiet/" + gebiet.id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(gebiet)
    });
    return ((await response.json()) as GebietResource);
}

export async function postThema(thema: ThemaResource): Promise<ThemaResource> {
    const response = await fetchWithErrorHandling(import.meta.env.VITE_API_SERVER_URL + "/api/thema/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(thema)
    });
    return ((await response.json()) as ThemaResource);
}

export async function putThema(thema: ThemaResource): Promise<ThemaResource> {
    const response = await fetchWithErrorHandling(import.meta.env.VITE_API_SERVER_URL + "/api/thema/" + thema.id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(thema)
    });
    return ((await response.json()) as ThemaResource);
}

export async function deleteThema(themaId: string): Promise<void> {
    await fetchWithErrorHandling(import.meta.env.VITE_API_SERVER_URL + "/api/thema/" + themaId, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include"
    });
    return;
}

export async function postProf(prof: ProfResource): Promise<ProfResource> {
    const response = await fetchWithErrorHandling(import.meta.env.VITE_API_SERVER_URL + "/api/prof/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(prof)
    });
    return ((await response.json()) as ProfResource);
}

export async function putProf(prof: ProfResource): Promise<ProfResource> {
    const response = await fetchWithErrorHandling(import.meta.env.VITE_API_SERVER_URL + "/api/prof/" + prof.id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(prof)
    });
    return ((await response.json()) as ProfResource);
}

export async function deleteProf(profId: string): Promise<void> {
    await fetchWithErrorHandling(import.meta.env.VITE_API_SERVER_URL + "/api/prof/" + profId, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
    });
    return;
}

export async function getAlleProfs(): Promise<ProfResource[]> {
    const response = await fetchWithErrorHandling(import.meta.env.VITE_API_SERVER_URL + "/api/prof/alle", { credentials: "include" });
    return ((await response.json()) as ProfResource[]);
}
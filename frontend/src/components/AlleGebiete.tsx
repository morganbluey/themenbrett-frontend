import { useState } from "react";
import { useEffect, useCallback } from "react";
import { LoadingIndicator } from "./LoadingIndicator";
import { GebietResource } from "../Resources";
import { useErrorBoundary } from "react-error-boundary";
import { GebietDescription } from "./GebietDescription";
import { getAlleGebiete } from "../backend/api";
import { Container } from 'react-bootstrap';
import { useLoginContext } from '../LoginContext';


export function AlleGebiete() {
    const [alleGebiete, setAlleGebiete] = useState<GebietResource[] | null>();
    const { showBoundary } = useErrorBoundary();
    const { login } = useLoginContext();

    const load = useCallback(async () => {
        try {
            const gebiete = await getAlleGebiete();
            setAlleGebiete(gebiete);
        }
        catch (err) {
            setAlleGebiete(null);
            showBoundary(err);
        }
    }, [showBoundary]);

    useEffect(() => {
        load();
    }, [load, login]);

    if (!alleGebiete) {
        return <LoadingIndicator />
    }

    return (
        <Container className="py-4">
            {alleGebiete.length > 0 ?
                <h1 className="mb-10 text-primary"><b>Alle Gebiete</b></h1> :
                <h1 className="mb-10 text-primary"><b>Noch keine Gebiete</b></h1>}
            <br />
            <div className="row row-cols-1 row-cols-md-2 g-4">
                {alleGebiete.map(geb => (
                    <div key={geb.id} className="col">
                        <GebietDescription gebiet={geb} />
                    </div>
                ))}
            </div>
        </Container>
    );
}
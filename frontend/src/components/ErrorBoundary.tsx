import { Container, Card } from "react-bootstrap";
import { deleteLogin } from "../auth/api";
import { useLoginContext } from "../LoginContext";
import { useEffect, useCallback } from "react";

function mapErrorToUserMessage(error: unknown): string {
    const mes = error instanceof Error ? error.message : String(error);

    if (mes.includes("Gebiet is private")) {
        return "Sie sind kein Verwalter des privaten Gebiets oder Sie sind nicht angemeldet."
    }
    if (mes.includes("Not verwalter or betreuer of this private gebiet")) {
        return "Sie sind weder Betreuer dieses Themas noch Verwalter des dazugehörigen privaten Gebiets oder Sie sind nicht angemeldet."
    }
    if (mes.includes("Admins cannot delete themselves")) {
        return "Sie haben versucht sich selbst zu löschen."
    }
    if (mes.includes("Authentication required")) {
        return "Sie sind nicht angemeldet."
    }

    return "Es gibt keine näheren Informationen dazu.";
}

export default function ErrorFallback({ error }: { error: unknown }) {
    const { setLogin } = useLoginContext(); 
    
    const doLogout = useCallback(async () => { 
        await deleteLogin(); 
        setLogin(false); 
    }, [setLogin]); 
    
    useEffect(() => { 
        void doLogout(); 
    }, [doLogout]);

    const errorM = mapErrorToUserMessage(error);

    return (
        <Container
            className="py-5 d-flex justify-content-center align-items-center"
            style={{ minHeight: "70vh" }}
        >
            <Card className="shadow-lg border-2 rounded-3" style={{ maxWidth: "520px", width: "100%" }}>
                <Card.Header className="bg-light border-0 rounded-top-3">
                    <h4 className="text-danger mb-1"><b>Ein Fehler ist aufgetreten</b></h4>
                </Card.Header>

                <Card.Body className="pt-4">
                    <p className="mb-3">
                        {errorM}
                    </p>

                    <div className="alert alert-info mb-0 small rounded-3">
                            Sie wurden aus Sicherheitsgründen abgemeldet.
                        </div>
                </Card.Body>

                <Card.Footer className="bg-light border-0 rounded-bottom-4">
                    <a href={import.meta.env.BASE_URL} className="btn btn-outline-primary rounded-3">
                        Zurück zur Startseite
                    </a>
                </Card.Footer>
            </Card>
        </Container>
    );
}

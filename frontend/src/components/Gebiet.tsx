import { useEffect, useState, useCallback } from "react";
import type { GebietResource, ThemaResource } from "../Resources";
import { useErrorBoundary } from "react-error-boundary";
import { LoadingIndicator } from "./LoadingIndicator";
import { getAlleThemen, getGebiet } from "../backend/api";
import { useParams, useNavigate, Link } from "react-router";
import { ThemaDescription } from "./ThemaDescription";
import { Container } from 'react-bootstrap';
import { useLoginContext } from "../LoginContext";
import { DeleteDialog } from "./DeleteDialog";
import { GebietFormular } from "./GebietFormular";

export function Gebiet() {
    const params = useParams();
    const gID = params.id;

    const [alleThemen, setAlleThemen] = useState<ThemaResource[] | null>();
    const [gebiet, setGebiet] = useState<GebietResource | null>();
    const { showBoundary } = useErrorBoundary();

    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const { login } = useLoginContext();

    const [editMode, setEditMode] = useState(false);
    const navigate = useNavigate();

    const load = useCallback(async () => {
        try {
            const geb = await getGebiet(gID!);
            const themen = await getAlleThemen(gID!);
            setGebiet(geb);
            setAlleThemen(themen);
        }
        catch (err) {
            setGebiet(null);
            setAlleThemen(null);
            showBoundary(err);
        }
    }, [showBoundary, gID]);

    useEffect(() => {
        if (gID !== "neu") {
            load();
        }
    }, [gID, login, load]);

    function nachSpeichernBear() {
        setEditMode(false);
        setGebiet(null);
        load();
    }

    if (gID === "neu") {
        return (<GebietFormular bear={false} onSuccess={id => navigate(`/gebiet/${id}`)} onCancel={() => navigate("/")} />);
    }

    if (!alleThemen || !gebiet) {
        return <LoadingIndicator />
    }

    if (editMode) {
        return (<GebietFormular bear={gebiet} onSuccess={nachSpeichernBear} onCancel={() => setEditMode(false)} />);
    }

    return (
        <Container className="py-4">
            <div className="mb-4 p-4 bg-white border border-2 rounded-4 shadow-lg">
                <div className="d-flex flex-wrap justify-content-between align-items-start gap-3">
                    <div>
                        <h3 className="mb-2 text-primary" style={{ overflowWrap: "break-word", wordBreak: "break-word" }}>
                            <b>Gebiet: {gebiet.name}</b>
                        </h3>

                        {gebiet.beschreibung && (
                            <p className="mb-2 text-muted" style={{ overflowWrap: "break-word", wordBreak: "break-word" }}>
                                {gebiet.beschreibung}
                            </p>
                        )}

                        <div className="d-flex flex-wrap gap-2 mt-2">
                            <span className={gebiet.public ? "badge bg-success" : "badge bg-warning"}>
                                {gebiet.public ? "öffentlich" : "privat"}
                            </span>

                            <span className={gebiet.closed ? "badge bg-danger" : "badge bg-success"}>
                                {gebiet.closed ? "geschlossen" : "offen"}
                            </span>

                            {typeof gebiet.anzahlThemen === "number" && (
                                <span className="badge bg-info">
                                    {gebiet.anzahlThemen} Themen
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="small text-muted">
                        {gebiet.verwalterName && (
                            <div>
                                Verwalter: <b>{gebiet.verwalterName}</b>
                            </div>
                        )}
                        {gebiet.createdAt && (
                            <div>
                                Erstellungsdatum: <b>{gebiet.createdAt}</b>
                            </div>
                        )}
                    </div>
                </div>

                {login && typeof login !== "boolean" && login.id === gebiet.verwalter && (
                    <div className="mt-3 d-flex flex-wrap gap-2">
                        <button type="button" className="btn btn-outline-secondary rounded-3" onClick={() => setEditMode(true)}>Gebiet bearbeiten</button>

                        {!(gebiet && gebiet.anzahlThemen && gebiet.anzahlThemen > 0) && (
                            <>
                                <button type="button" className="btn btn-outline-danger rounded-3" onClick={() => setShowDeleteDialog(true)}>Gebiet löschen</button>
                                {showDeleteDialog && (
                                    <>
                                        <div style={{ position: "fixed", inset: 0, background: "black", opacity: 0.5, zIndex: 1 }} />
                                        <DeleteDialog show={showDeleteDialog} onHide={() => setShowDeleteDialog(false)} deleteID={gebiet.id!} />
                                    </>
                                )}
                            </>
                        )}

                        <Link to={`/gebiet/${gebiet.id}/thema/neu`} className="btn btn-outline-info rounded-3">
                            Neues Thema
                        </Link>
                    </div>
                )}
            </div>
            { gebiet.anzahlThemen && gebiet.anzahlThemen > 0 && ( <h5 className="py-4 text-info"><b>dazugehörige Themen:</b></h5> )}
            
            <div className="row row-cols-1 row-cols-md-2 g-4">
                {alleThemen.map(t => (
                    <div key={t.id} className="col">
                        <ThemaDescription thema={t} />
                    </div>
                ))}
            </div>
            <button type="button" className="btn btn-sm btn-secondary rounded-3" onClick={() => navigate("/")}>Zurück zur Übersicht</button>
        </Container>
    );
}

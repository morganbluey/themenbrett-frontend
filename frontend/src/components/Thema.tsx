import { useParams, useNavigate, useLocation } from "react-router";
import type { ThemaResource } from "../Resources";
import { useEffect, useState, useCallback } from "react";
import { useErrorBoundary } from "react-error-boundary";
import { getThema } from "../backend/api";
import { LoadingIndicator } from "./LoadingIndicator";
import { Container } from 'react-bootstrap';
import { useLoginContext } from "../LoginContext";
import { ThemaFormular } from "./ThemaFormular";
import { DeleteDialog } from "./DeleteDialog";

export function Thema() {
    const [thema, setThema] = useState<ThemaResource | null>();
    const params = useParams();
    const tID = params.id;

    const [editMode, setEditMode] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const { showBoundary } = useErrorBoundary();
    const { login } = useLoginContext();

    const load = useCallback(async () => {
        try {
            const them = await getThema(tID!);
            setThema(them);
        }
        catch (err) {
            setThema(null);
            showBoundary(err);
        }
    }, [showBoundary, tID]);

    useEffect(() => {
        if (!location.pathname.endsWith("/thema/neu")) {
            load();
        }
    }, [tID, login, load, location.pathname]);

    if (location.pathname.endsWith("/thema/neu")) {
        return (<ThemaFormular bear={false} gebietId={params.id} onSuccess={id => navigate(`/thema/${id}`)} onCancel={() => navigate(`/gebiet/${params.id}`)} />);
    }

    if (!thema) {
        return <LoadingIndicator />
    }

    if (editMode) {
        return <ThemaFormular bear={thema} onSuccess={nachSpeichernBear} onCancel={() => setEditMode(false)} />;
    }

    function nachSpeichernBear() {
        setEditMode(false);
        setThema(null);
        load();
    }

    return (
        <Container className="py-4">
            <div className="mb-4 p-4 bg-white border border-2 rounded-4 shadow-lg">
                <div className="d-flex flex-wrap justify-content-between align-items-start gap-3">
                    <div>
                        <h3 className="mb-2 text-dark" lang="de" style={{ hyphens: "auto", overflowWrap: "break-word", wordBreak: "break-word" }}>
                            <b>Thema: {thema.titel}</b>
                        </h3>


                        <p className="mb-2 text-muted"  style={{ overflowWrap: "break-word", wordBreak: "break-word" }}>
                            {thema.beschreibung}
                        </p>

                        {thema.literatur && (
                            <p className="mb-2 text-muted" style={{ overflowWrap: "break-word", wordBreak: "break-word" }}>
                                Literatur: <b>{thema.literatur}</b>
                            </p>
                        )}

                        <div className="d-flex flex-wrap gap-2 mt-2">
                            <span className={thema.status === "offen" ? "badge bg-success" : "badge bg-danger"}>
                                {thema.status}
                            </span>
                            <span className="badge bg-primary">
                                {thema.abschluss}
                            </span>
                        </div>
                    </div>

                    <div className="small text-muted">
                        {thema.betreuerName && (
                            <div>
                                Betreuer: <b>{thema.betreuerName}</b>
                            </div>
                        )}
                        {thema.updatedAt && (
                            <div>
                                Zuletzt geupdatet am: <b>{thema.updatedAt}</b>
                            </div>
                        )}
                    </div>
                </div>

                {login && typeof login !== "boolean" && login.id === thema.betreuer && (
                    <div className="mt-3 d-flex flex-wrap gap-2">
                        <button type="button" className="btn btn-secondary rounded-3" onClick={() => setEditMode(true)}>Editieren</button>
                        <button type="button" className="btn btn-danger rounded-3" onClick={() => setShowDeleteDialog(true)}>Löschen</button>
                        {showDeleteDialog && (
                            <>
                                <div style={{ position: "fixed", inset: 0, background: "black", opacity: 0.5, zIndex: 1 }} />
                                <DeleteDialog show={showDeleteDialog} onHide={() => setShowDeleteDialog(false)} gebID={thema.gebiet} deleteID={thema.id!} />
                            </>
                        )}
                    </div>
                )}
            </div>
            <button type="button" className="btn btn-sm btn-secondary rounded-3" onClick={() => navigate(`/gebiet/${thema.gebiet}`)}>Zurück zum Gebiet</button>
        </Container>
    );
}
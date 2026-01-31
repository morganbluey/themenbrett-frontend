import { useEffect, useState, useCallback } from "react";
import { useLoginContext } from "../LoginContext";
import { getAlleProfs } from "../backend/api";
import { ProfFormular } from "./ProfFormular";
import { useErrorBoundary } from "react-error-boundary";
import { Container } from "react-bootstrap";
import { ProfResource } from "../Resources";
import { LoadingIndicator } from "./LoadingIndicator";
import { DeleteDialog } from "./DeleteDialog";
import { useNavigate } from "react-router";

export function PageAdmin() {
    const { login } = useLoginContext();
    const [profs, setProfs] = useState<ProfResource[] | null>();
    const [neuerProf, setNeuerProf] = useState(false);
    const [editProf, setEditProf] = useState<ProfResource | null>(null);
    const { showBoundary } = useErrorBoundary();
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const navigate = useNavigate();

    const load = useCallback(async () => {
        try {
            const alle = await getAlleProfs()
            setProfs(alle);
        }
        catch (err) {
            setProfs(null);
            showBoundary(err);
        }
    }, [showBoundary]);

    useEffect(() => {
        if (login) {
            load();
        }
    }, [login, deleteId, load]);

    function nachSpeichern() {
        setNeuerProf(false);
        setEditProf(null);
        load();
    }

    if (!login || !(login.role || login.role === "a")) {
        return (
            <Container>
                <div className="py-5" style={{ display: "flex", justifyContent: "center" }}>
                    <h3 className="text-danger">Sie müssen <b>eingeloggt</b> und <b>Admin</b> sein, um auf diese Seite zugreifen zu können!</h3>
                </div>
            </Container>
        );
    }

    if (!profs) {
        return <LoadingIndicator />
    }

    if (neuerProf) {
        return <ProfFormular bear={false} onSuccess={nachSpeichern} onCancel={() => setNeuerProf(false)} />;
    }

    if (editProf) {
        return <ProfFormular bear={editProf} onSuccess={nachSpeichern} onCancel={() => setEditProf(null)} />;
    }

    return (
        <Container className="py-4">
            <h2 className="text-primary-emphasis"><b>Alle Profs</b></h2>
            <br />
            {profs.map(prof => (
                <>
                    <ul className="list-group rounded-3" key={prof.id}>
                        <li className="list-group-item d-flex align-items-center gap-3" data-testid="prof-row" data-cid={prof.campusID}>
                            <div className="d-flex align-items-start flex-wrap flex-grow-1" style={{ minWidth: 0 }}>
                                <span className={prof.name.trim().split(" ").length === 1 ? "me-4 text-truncate" : "me-4"} style={{ minWidth: 200, maxWidth: 500, flex: "1 1 0", whiteSpace: prof.name.trim().split(" ").length === 1 ? "nowrap" : "normal", display: "inline-block" }}>
                                    {prof.admin ? <b className="text-success">*</b> : null}{prof.titel ? prof.titel + ' ' : ''}{prof.name}
                                </span>
                                <span className="me-4 text-muted" style={{ minWidth: 180, maxWidth: 220, flexShrink: 0, display: "inline-block", overflowWrap: "break-word", wordBreak: "break-word", whiteSpace: "normal" }}>
                                    <b>Campus ID: </b>{prof.campusID}
                                </span>

                            </div>
                            <div className="ms-auto d-flex gap-3 align-items-center flex-nowrap" style={{ flexShrink: 0 }}>
                                <button className="btn btn-outline-secondary rounded-3" data-testid="prof-edit" onClick={() => setEditProf(prof)}>Editieren</button>
                                <button type="button" className="btn btn-danger rounded-3" data-testid="prof-delete" onClick={() => setDeleteId(prof.id!)}>Löschen</button>

                            </div>
                        </li>
                    </ul>
                    <br />
                </>
            ))}
            {deleteId && (
                <>
                    <div style={{ position: "fixed", inset: 0, background: "black", opacity: 0.5, zIndex: 1 }} />
                    <DeleteDialog show={true} onHide={() => setDeleteId(null)} prof={true} deleteID={deleteId} />
                </>
            )}
            <div className="text-body-tertiary">
                <small>Alle mit <span className="text-success"><b>*</b></span> markierten Profs sind Admins!</small>
            </div>
            <div className="d-flex align-items-center justify-content-between py-4 position-relative">
                <button type="button" className="btn btn-secondary rounded-3" onClick={() => navigate("/")}>Zurück zur Übersicht</button>
                <button className="btn btn-outline-dark rounded-3 position-absolute start-50 translate-middle-x" onClick={() => setNeuerProf(true)}>Neuer Prof</button>
            </div>
        </Container>
    );
}

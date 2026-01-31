import { useRef } from "react";
import { deleteGebiet, deleteProf, deleteThema } from "../backend/api";
import { useErrorBoundary } from "react-error-boundary";
import { useNavigate } from "react-router";

interface DeleteDialogProps {
    show: boolean;
    onHide: () => void;
    gebID?: string;
    deleteID: string;
    prof?: boolean;
}

export function DeleteDialog({ show, onHide, gebID, deleteID, prof, }: DeleteDialogProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const { showBoundary } = useErrorBoundary();
    const navigate = useNavigate();

    const onConfirm = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (prof) {
                await deleteProf(deleteID);
                onHide();
                return;
            }
            if (gebID) {
                await deleteThema(deleteID);
                navigate(`/gebiet/${gebID}`);
            } else {
                await deleteGebiet(deleteID);
                navigate("/");
            }
            onHide();
            return;
        } catch (err) {
            showBoundary(err);
        }
    };

    function onCancel() {
        onHide();
        return;
    }

    return (
        <dialog data-testid="prof-delete-dialog" ref={dialogRef} open={show} style={{ border: "2px solid gray", borderRadius: 10, width: "300px", minWidth: "200px", maxWidth: "90vw", position: "fixed", zIndex: 2, top: "50%", transform: "translate(0%, -50%)" }}>
            <div className="modal-header py-1 justify-content-center">
                {prof ? (
                    <h5 className="modal-title text-danger" data-testid="prof-delete-title">
                        <b>Prof endgültig löschen?</b>
                    </h5>
                ) : gebID ? (
                    <h5 className="modal-title text-danger">
                        <b>Thema endgültig löschen?</b>
                    </h5>
                ) : (
                    <h5 className="modal-title text-danger">
                        <b>Gebiet endgültig löschen?</b>
                    </h5>
                )}
            </div>
            <br />
            <div className="modal-body px-2 py-2">
                <div className="d-flex justify-content-center gap-3">
                    <button type="button" className="btn btn-danger rounded-3" data-testid="prof-delete-confirm" onClick={onConfirm}>Löschen</button>
                    <button type="button" className="btn btn-secondary rounded-3" data-bs-dismiss="modal" data-testid="prof-delete-cancel" onClick={onCancel}>Abbrechen</button>
                </div>
            </div>
        </dialog>
    );
}

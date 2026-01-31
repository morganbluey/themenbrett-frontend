import { useRef, useState } from "react";
import { useLoginContext } from "../LoginContext";
import { postLogin } from "../auth/api";


interface LoginDialogProps {
    show: boolean;
    onHide: () => void;
}

export function LoginDialog({ show, onHide }: LoginDialogProps) {

    const dialogRef = useRef<HTMLDialogElement>(null);

    const [loginData, setLoginData] = useState({ campusID: "", password: "" });
    const [loginFailed, setLoginFailed] = useState("");

    function update(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
        setLoginFailed("");
    }

    const { setLogin } = useLoginContext();

    const onLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const loginInfo = await postLogin(loginData.campusID, loginData.password);
            setLogin(loginInfo);
            setLoginFailed("");
            onHide();
        } catch (err) {
            if (err instanceof Error && err.message) {
                setLoginFailed(err.message)
            }
            else {
                setLoginFailed(String(err));
            }
        } finally {
            setLoginData({ campusID: loginData.campusID, password: "" });
        }
    }

    function onCancel() {
        setLoginData({ campusID: loginData.campusID, password: "" });
        onHide();
    }

    return (
        // hier muss aufgrund des Hinzufügen von open noch zstzl der Dialog nach vorne geholt werden mit zindex, da er sonst hinter den Gebieten angezeigt wird
        <dialog ref={dialogRef} open={show} className="bg-light" style={{ border: "2px solid gray", borderRadius: 10, width: "400px", minWidth: "200px", maxWidth: "90vw", position: "fixed", zIndex: 2, top: "50%", transform: "translate(0%, -50%)" }}>
            <div className="modal-header px-2 py-1">
                <h5 className="modal-title text-dark"><b>Login</b></h5>
            </div>
            <div className="modal-body px-2 py-2">
                <div className="form-floating mb-3">
                    <input id="cid" className="form-control" type="campusID" name="campusID" onChange={update} value={loginData.campusID} placeholder="" />
                    <label htmlFor="cid">Campus ID</label>
                </div>
                <div className="form-floating mb-3">
                    <input id="pid" className="form-control" type="password" name="password" onChange={update} value={loginData.password} placeholder="" />
                    <label htmlFor="pid">Passwort</label>
                </div>
                <div className="text-danger mb-3">{loginFailed}</div>
                <li className="list-group-item d-flex justify-content-start gap-3 align-items-center">
                    <button type="button" className="btn btn-primary rounded-3" onClick={onLogin}>OK</button>
                    <button type="button" className="btn btn-secondary rounded-3" data-bs-dismiss="modal" onClick={onCancel}>Abbrechen</button>
                </li>
            </div>
        </dialog>
    );
}
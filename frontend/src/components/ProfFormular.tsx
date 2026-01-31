import { useState } from 'react';
import { Container } from 'react-bootstrap';
import { postProf, putProf } from '../backend/api';
import { ProfResource } from '../Resources';

interface ProfFormularProps {
    bear: ProfResource | false;
    onSuccess: () => void | Promise<void>;
    onCancel: () => void | Promise<void>;
}

export function ProfFormular({ bear, onSuccess, onCancel }: ProfFormularProps) {
    const [profData, setProfData] = useState({
        name: bear ? bear.name : "",
        titel: bear ? bear.titel : undefined,
        campusID: bear ? bear.campusID : "",
        password: "",
        admin: bear ? bear.admin : false
    });

    const [nameValidationError, setNameValidationError] = useState("");
    const [cidValidationError, setCidValidationError] = useState("");
    const [passValidationError, setPassValidationError] = useState("");
    const [passFocus, setPassFocus] = useState(false);
    const [passW, setPassW] = useState("");
    const [passWValidationError, setPassWValidationError] = useState("");
    const [validationError, setValidationError] = useState("");

    function updateInput(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        setProfData({ ...profData, [e.target.name]: e.target.value });
        setValidationError("");
        setPassValidationError("");
        if (profData.campusID.length >= 5 && profData.campusID.length <= 101) setCidValidationError("");
        if (profData.name.length > 0 && profData.name.length <= 101) setNameValidationError("");
    }

    function updateCheck(e: React.ChangeEvent<HTMLInputElement>) {
        setProfData({ ...profData, admin: e.target.checked });
    }

    function updatePW(e: React.ChangeEvent<HTMLInputElement>) {
        setPassW(e.target.value);
        setValidationError("");
        setPassWValidationError("");
    }

    function validateName(inp: string) {
        if (inp.length < 1) return "Name muss mindestens 1 Zeichen haben";
        if (inp.length > 100) return "Name darf maximal 100 Zeichen haben";
        return "";
    }

    function validateCID(inp: string) {
        if (inp.length < 6) return "Die Campus ID sollte mindestens 6 Zeichen haben";
        if (inp.length > 100) return "Campus ID darf maximal 100 Zeichen haben";
        return "";
    }

    function validatePass(inp: string) {
        if (inp.length < 8) return "Das Passwort muss mindestens 8 Zeichen haben";
        if (!hasLower(inp)) return "Das Passwort muss mindestens einen Kleinbuchstaben haben";
        if (!hasUpper(inp)) return "Das Passwort muss mindestens einen Großbuchstaben haben";
        if (!hasNumber(inp)) return "Das Passwort muss mindestens ein Ziffer haben";
        if (!hasSonder(inp)) return "Das Passwort muss mindestens ein Sonderzeichen haben";
        if (inp.length > 100) return "Das Passwort darf maximal 100 Zeichen haben";
        return "";
    }

    function validatePassW(inp: string) {
        if (inp !== profData.password) return "Die Passwörter stimmen nicht überein";
        return "";
    }

    function hasUpper(inp: string) {
        for (let i = 0; i < inp.length; i++) {
            const z = inp[i];
            if (z === z.toUpperCase() && z !== z.toLowerCase()) return true;
        }
        return false;
    }

    function hasLower(inp: string) {
        for (let i = 0; i < inp.length; i++) {
            const z = inp[i];
            if (z === z.toLowerCase() && z !== z.toUpperCase()) return true;
        }
        return false;
    }

    function hasNumber(inp: string) {
        for (let i = 0; i < inp.length; i++) {
            const z = inp[i];
            if (z >= '0' && z <= '9') return true;
        }
        return false;
    }

    function hasSonder(inp: string) {
        for (let i = 0; i < inp.length; i++) {
            const z = inp[i];
            if (!hasLower(z) && !hasUpper(z) && !hasNumber(z)) return true;
        }
        return false;
    }

    function onBlurName(e: React.ChangeEvent<HTMLInputElement>) {
        setNameValidationError(validateName(e.target.value));
    }

    function onBlurCID(e: React.ChangeEvent<HTMLInputElement>) {
        setCidValidationError(validateCID(e.target.value));
    }

    function onBlurPass(e: React.ChangeEvent<HTMLInputElement>) {
        setPassValidationError(validatePass(e.target.value));
        setPassFocus(false);
    }

    function onBlurPassW(e: React.ChangeEvent<HTMLInputElement>) {
        setPassWValidationError(validatePassW(e.target.value));
    }

    const onSpeichern = async (e: React.FormEvent) => {
        e.preventDefault();

        const nameVal = validateName(profData.name);
        const cidVal = validateCID(profData.campusID);
        const passVal = validatePass(profData.password);
        const passWVal = validatePassW(passW);

        setNameValidationError(nameVal);
        setCidValidationError(cidVal);
        setPassValidationError(passVal);
        setPassWValidationError(passWVal);

        if (nameVal || cidVal || passVal || passWVal) return;
        if (profData.titel === "") profData.titel = undefined;

        try {
            const profResource = {
                id: (bear ? bear.id : null),
                name: profData.name,
                titel: profData.titel,
                admin: profData.admin,
                campusID: profData.campusID,
                password: profData.password
            } as ProfResource;
            if (bear) {
                await putProf(profResource);
            }
            else {
                await postProf(profResource);
            }
            setValidationError("");
            onSuccess();
        } catch (err) {
            if (err instanceof Error && err.message.includes("campusID already taken")) {
                setCidValidationError("Die Campus ID ist schon vergeben");
            } else if (err instanceof Error && err.message.includes("Not Found")) {
                setValidationError("Der von Ihnen angegebene Prof existiert nicht");
            } else if (err instanceof Error && err.message.includes("Authentication required")) {
                setValidationError("Sie müssen eingeloggt sein, um ein Prof zu erstellen/bearbeiten");
            } else if (err instanceof Error && err.message) {
                setValidationError(err.message);
            } else {
                setValidationError(String(err));
            }
        }
    };

    return (
        <Container className="py-4">
            <h2 data-testid="prof-form-heading" className="text-primary-emphasis"><b>{bear ? "Prof bearbeiten" : "Erstelle einen neuen Prof"}</b></h2>
            <br />
            <form onSubmit={onSpeichern} className="form">
                <div className="form">
                    <div className="form-floating mb-3">
                        <input id="nam" className={`form-control${nameValidationError ? " is-invalid" : ""}`} type="text" name="name" onBlur={onBlurName} onChange={updateInput} value={profData.name} placeholder="" required />
                        <label data-testid="prof-form-name" htmlFor="nam">Name*</label>
                        <div className="invalid-feedback">{nameValidationError}</div>
                    </div>
                    <div className="d-flex justify-content-end mb-3">
                        <div className="flex-grow-1 me-3">
                            <div className="form-floating">
                                <select id="tit" className="form-select" name="titel" onChange={updateInput} value={profData.titel}>
                                    <option value="">Kein Titel</option>
                                    <option value="Prof.">Prof.</option>
                                    <option value="Dr.">Dr.</option>
                                    <option value="Prof. Dr.">Prof. Dr.</option>
                                    <option value="Dr.-Ing.">Dr.-Ing.</option>
                                    <option value="Dipl.-Ing.">Dipl.-Ing.</option>
                                    <option value="Ph.D.">Ph.D.</option>
                                </select>
                                <label data-testid="prof-form-titel" htmlFor="tit">Titel</label>
                            </div>
                        </div>
                        <div style={{ width: 165, minWidth: 165 }}>
                            <fieldset className="border rounded px-3 py-3 h-100 align-items-center" style={{ whiteSpace: "nowrap" }}>
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" name="admin" id="adm" onChange={updateCheck} checked={profData.admin} />
                                    <label data-testid="prof-form-admin" className="form-check-label" htmlFor="adm">Prof ist Admin</label>
                                </div>
                            </fieldset>
                        </div>
                    </div>
                    <div className="form-floating mb-3">
                        <input id="cID" className={`form-control${cidValidationError ? " is-invalid" : ""}`} type="text" name="campusID" onBlur={onBlurCID} onChange={updateInput} value={profData.campusID} placeholder="" required />
                        <label data-testid="prof-form-campusid" htmlFor="cID">Campus ID*</label>
                        <div id="ciderror" className="invalid-feedback">{cidValidationError}</div>
                    </div>
                    <div className="form-floating mb-3">
                        <input id="pass" className={`form-control${passValidationError ? " is-invalid" : ""}`} type="password" name="password" onFocus={() => setPassFocus(true)} onBlur={onBlurPass} onChange={updateInput} value={profData.password} placeholder="" required />
                        <label data-testid="prof-form-password" htmlFor="pass">Passwort*</label>
                        <div id="passworderror" className="invalid-feedback">{passValidationError}</div>
                    </div>
                    {passFocus
                        ? (<><div>Das Passwort:</div>
                            <div className={`${profData.password.length > 7 ? "text-success" : null}`}>{profData.password.length > 7 ? "✅" : "❌"} ist mindestens 8 Zeichen lang</div>
                            <div className={`${hasUpper(profData.password) ? "text-success" : null}`}>{hasUpper(profData.password) ? "✅" : "❌"} hat mindestens einen Großbuchstaben</div>
                            <div className={`${hasLower(profData.password) ? "text-success" : null}`}>{hasLower(profData.password) ? "✅" : "❌"} hat mindestens einen Kleinbuchstaben</div>
                            <div className={`${hasNumber(profData.password) ? "text-success" : null}`}>{hasNumber(profData.password) ? "✅" : "❌"} hat mindestens eine Ziffer</div>
                            <div className={`${hasSonder(profData.password) ? "text-success" : null}`}>{hasSonder(profData.password) ? "✅" : "❌"} hat mindestens ein Sonderzeichen</div>
                            <br /></>)
                        : null}
                    <div className="form-floating mb-3">
                        <input id="passW" className={`form-control${passWValidationError ? " is-invalid" : ""}`} type="password" name="passwordW" onBlur={onBlurPassW} onChange={updatePW} value={passW} placeholder="" required />
                        <label data-testid="prof-form-passwordw" htmlFor="passW">Passwort Wiederholen</label>
                        <div className="invalid-feedback">{passWValidationError}</div>
                    </div>
                    <div className="text-body-tertiary">
                        <small>Alle mit * markierten Felder sind Pflichtfelder</small>
                    </div>
                    <br />
                    <li className="list-group-item d-flex justify-content-start gap-3 align-items-center">
                        <button data-testid="prof-form-save" type="submit" className="btn btn-primary rounded-3" onClick={onSpeichern}
                            disabled={nameValidationError !== "" || cidValidationError !== "" || passValidationError !== "" || passWValidationError !== "" || profData.name.length === 0 || profData.campusID.length === 0}>
                            Speichern
                        </button>
                        <button data-testid="prof-form-cancel" type="button" className="btn btn-secondary rounded-3" onClick={onCancel}>Abbrechen</button>
                    </li>
                    <div className="text-danger py-2">{validationError}</div>
                </div>
            </form>
        </Container>
    )
}

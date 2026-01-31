import { useState } from 'react';
import { Container } from 'react-bootstrap';
import { useLoginContext } from '../LoginContext';
import { postThema, putThema } from '../backend/api';
import { ThemaResource } from '../Resources';

interface ThemaFormularProps {
    bear: ThemaResource | false;
    gebietId?: string;
    onSuccess: (id: string) => void | Promise<void>;
    onCancel: () => void | Promise<void>;
}

export function ThemaFormular({ bear, gebietId, onSuccess, onCancel }: ThemaFormularProps) {
    const [themaData, setThemaData] = useState({
        titel: bear ? bear.titel : "",
        beschreibung: bear ? bear.beschreibung : "",
        literatur: bear ? bear.literatur : undefined,
        abschluss: bear ? bear.abschluss : "any",
        status: bear ? bear.status : "offen"
    });

    const [titelValidationError, setTitelValidationError] = useState("");
    const [besValidationError, setBesValidationError] = useState("");
    const [litValidationError, setLitValidationError] = useState("");
    const [validationError, setValidationError] = useState("");
    const { login } = useLoginContext();

    function updateTextInput(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
        setThemaData({ ...themaData, [e.target.name]: e.target.value });
        setValidationError("");
        if (!themaData.literatur || themaData.literatur && themaData.literatur.length <= 1001) setLitValidationError("");
        if (themaData.beschreibung.length >= 2 && themaData.beschreibung.length <= 1001) setBesValidationError("");
        if (themaData.titel.length >= 2 && themaData.titel.length <= 101) setTitelValidationError("");
    }

    function updateRadio(e: React.ChangeEvent<HTMLInputElement>) {
        setThemaData({ ...themaData, [e.target.name]: (e.target.value === "offen" ? "offen" : "reserviert") });
    }

    function validateTitel(inp: string) {
        if (inp.length < 3) return "Titel muss mindestens 3 Zeichen haben";
        if (inp.length > 100) return "Titel darf maximal 100 Zeichen haben";
        return "";
    }

    function validateBeschreibung(inp: string) {
        inp.trim();
        if (inp.length < 3) return "Beschreibung muss mindestens 3 Zeichen haben";
        if (inp.length > 1000) return "Beschreibung darf maximal 1000 Zeichen haben";
        return "";
    }

    function validateLiteratur(inp: string | undefined) {
        if (!inp) return "";
        if (inp.length > 100) return "Literatur darf maximal 100 Zeichen haben";
        if (inp.length > 0 && inp.length < 3) return "Literatur muss mindestens 3 Zeichen haben";
        return "";
    }

    function onBlurTitel(e: React.FocusEvent<HTMLInputElement>) {
        setTitelValidationError(validateTitel(e.target.value));
    }

    function onBlurBes(e: React.FocusEvent<HTMLTextAreaElement>) {
        setBesValidationError(validateBeschreibung(e.target.value));
    }

    function onBlurLit(e: React.FocusEvent<HTMLInputElement>) {
        setLitValidationError(validateLiteratur(e.target.value));
    }

    const onSpeichern = async (e: React.FormEvent) => {
        e.preventDefault();

        const titelVal = validateTitel(themaData.titel);
        const besVal = validateBeschreibung(themaData.beschreibung);
        const litVal = validateLiteratur(themaData.literatur);

        setTitelValidationError(titelVal);
        setBesValidationError(besVal);
        setLitValidationError(litVal);

        if (titelVal || besVal || litVal) return;
        if (themaData.literatur === "") themaData.literatur = undefined;

        try {
            const themaResource = {
                id: (bear ? bear.id : null),
                gebiet: bear ? bear.gebiet : gebietId,
                betreuer: (login && login.id ? login.id : undefined),
                titel: themaData.titel,
                beschreibung: themaData.beschreibung,
                literatur: themaData.literatur,
                abschluss: themaData.abschluss,
                status: themaData.status
            } as ThemaResource;

            const gespeichert = bear ? (await putThema(themaResource)) : (await postThema(themaResource));
            setValidationError("");
            onSuccess(gespeichert.id!);
        } catch (err) {
            if (err instanceof Error && err.message.includes("prof already is a betreuer of another thema")) {
                setTitelValidationError("Sie betreuen schon ein anderes Thema mit demselben Titel");
            } else if (err instanceof Error && err.message.includes("chosen gebiet is closed")) {
                setValidationError("Thema kann nicht erstellt werden, da das Gebiet geschlossen ist");
            } else if (err instanceof Error && err.message.includes("Not Found")) {
                setValidationError("Das von Ihnen angegebene Gebiet existiert nicht");
            } else if (err instanceof Error && err.message.includes("Authentication required")) {
                setValidationError("Sie müssen eingeloggt sein, um ein Thema zu erstellen");
            } else if (err instanceof Error && err.message.includes("of this private gebiet")) {
                setValidationError("Sie haben keinen Zugriff auf dieses private Gebiet");
            } else if (err instanceof Error && err.message) {
                setValidationError(err.message);
            } else {
                setValidationError(String(err));
            }
        }
    };

    return (
        <Container className="py-4">
            <h2 className="py-4 text-primary"><b>{bear ? "Thema bearbeiten" : "Erstelle ein neues Thema"}</b></h2>
            <form onSubmit={onSpeichern}>
                <div className="form">
                    <div className="form-floating mb-3">
                        <input id="titl" className={`form-control${titelValidationError ? " is-invalid" : ""}`} type="text" name="titel" onBlur={onBlurTitel} onChange={updateTextInput} value={themaData.titel} placeholder="" required />
                        <label htmlFor="titl">Titel*</label>
                        <div className="invalid-feedback">{titelValidationError}</div>
                    </div>
                    <div className="form-floating mb-3">
                        <textarea id="bes" className={`form-control${besValidationError ? " is-invalid" : ""}`} name="beschreibung" onBlur={onBlurBes} onChange={updateTextInput} value={themaData.beschreibung} placeholder="" required style={{ minHeight: "100px" }} />
                        <label htmlFor="bes">Beschreibung*</label>
                        <div className="invalid-feedback">{besValidationError}</div>
                    </div>
                    <div className="form-floating mb-3">
                        <input id="lit" className={`form-control${litValidationError ? " is-invalid" : ""}`} type="text" name="literatur" onBlur={onBlurLit} onChange={updateTextInput} value={themaData.literatur} placeholder="" />
                        <label htmlFor="lit">Literatur</label>
                        <div className="invalid-feedback">{litValidationError}</div>
                    </div>
                    <div className="form-floating mb-3">
                        <select id="abs" className="form-select" name="abschluss" onChange={updateTextInput} value={themaData.abschluss}>
                            <option value="any">Alle Abschlüsse</option>
                            <option value="bsc">Bachelor</option>
                            <option value="msc">Master</option>
                        </select>
                        <label htmlFor="abs">Abschluss</label>
                    </div>
                    <h5>Das Thema ist:</h5>
                    <div className="row">
                        <div className="col mb-3">
                            <fieldset className="border rounded p-3 h-100">
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name="status" id="statusOpen" onChange={updateRadio} value={"offen"} checked={themaData.status === "offen"} />
                                    <label className="form-check-label text-success" htmlFor="statusOpen">offen</label>
                                </div>
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name="status" id="statusClosed" onChange={updateRadio} value={"reserviert"} checked={themaData.status === "reserviert"} />
                                    <label className="form-check-label text-danger" htmlFor="statusClosed">reserviert</label>
                                </div>
                            </fieldset>
                        </div>
                    </div>
                    <div className="text-body-tertiary">
                        <small>Alle mit * markierten Felder sind Pflichtfelder</small>
                    </div>
                    <br />
                    <li className="list-group-item d-flex justify-content-start gap-3 align-items-center">
                        <button type="submit" className="btn btn-primary rounded-3" onClick={onSpeichern}
                            disabled={titelValidationError !== "" || besValidationError !== "" || litValidationError !== "" || themaData.titel.length === 0 || themaData.beschreibung.length === 0}>
                            Speichern
                        </button>
                        <button type="button" className="btn btn-secondary rounded-3" data-bs-dismiss="modal" onClick={onCancel}>Abbrechen</button>
                    </li>
                    <div className="text-danger py-2">{validationError}</div>
                </div>
            </form>
        </Container>
    );
}

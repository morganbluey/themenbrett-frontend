import { useState } from 'react';
import { Container } from 'react-bootstrap';
import { useLoginContext } from '../LoginContext';
import { postGebiet, putGebiet } from '../backend/api';
import { GebietResource } from '../Resources';

interface GebietFormularProps {
    bear: GebietResource | false;
    onSuccess: (id: string) => void | Promise<void>;
    onCancel: () => void | Promise<void>;
}

export function GebietFormular({ bear, onSuccess, onCancel }: GebietFormularProps) {
    const [gebietData, setgebietData] = useState({
        name: bear ? bear.name : "",
        beschreibung: bear ? bear.beschreibung : undefined,
        public: bear ? bear.public : false,
        closed: bear ? bear.closed : false
    });
    const [nameValidationError, setNameValidationError] = useState("");
    const [besValidationError, setBesValidationError] = useState("");
    const [validationError, setvalidationError] = useState("");
    const { login } = useLoginContext();

    function updateTextInput(e: React.ChangeEvent<HTMLInputElement>) {
        setgebietData({ ...gebietData, [e.target.name]: e.target.value });
        setvalidationError("");
        if (!gebietData.beschreibung || gebietData.beschreibung && gebietData.beschreibung.length <= 1001) setBesValidationError("");
        if (gebietData.name.length >= 2 && gebietData.name.length <= 101) setNameValidationError("");
    }

    function updateRadio(e: React.ChangeEvent<HTMLInputElement>) {
        setgebietData({ ...gebietData, [e.target.name]: (e.target.value === "true" ? true : false) });
    }

    function validateName(inp: string) {
        if (inp.length < 3) return "Name muss mindestens 3 Zeichen haben";
        if (inp.length > 100) return "Name darf maximal 100 Zeichen haben";
        return "";
    }

    function validateBeschreibung(inp: string | undefined) {
        if (!inp) return "";
        if (inp.length > 1000) return "Beschreibung darf maximal 1000 Zeichen haben";
        return "";
    }

    function onBlurName(e: React.ChangeEvent<HTMLInputElement>) {
        setNameValidationError(validateName(e.target.value));
    }

    function onBlurBes(e: React.ChangeEvent<HTMLInputElement>) {
        setBesValidationError(validateBeschreibung(e.target.value));
    }

    const onSpeichern = async (e: React.FormEvent) => {
        e.preventDefault();

        const nameVal = validateName(gebietData.name);
        const besVal = validateBeschreibung(gebietData.beschreibung);

        setNameValidationError(nameVal);
        setBesValidationError(besVal);

        if (nameVal || besVal) return;
        if (gebietData.beschreibung === "") gebietData.beschreibung = undefined;
        try {
            const gebietResource = {
                id: (bear ? bear.id : null),
                verwalter: (login && login.id ? login.id : undefined),
                name: gebietData.name,
                beschreibung: gebietData.beschreibung,
                public: gebietData.public,
                closed: gebietData.closed
            } as GebietResource;
            const gespeichert = bear ? (await putGebiet(gebietResource)) : (await postGebiet(gebietResource));
            setvalidationError("");
            onSuccess(gespeichert.id!);
        } catch (err) {
            if (err instanceof Error && err.message.includes("name already taken")) {
                setNameValidationError("Name schon vergeben");
            } else if (err instanceof Error && err.message.includes("Authentication required")) {
                setvalidationError("Sie müssen eingeloggt sein, um ein Gebiet zu erstellen.");
            } else if (err instanceof Error && err.message) {
                setvalidationError(err.message);
            } else {
                setvalidationError(String(err));
            }
        }
    }

    return (
        <Container className="py-4">
            <h2 className="py-4 text-primary"><b>{bear ? "Gebiet bearbeiten" : "Erstelle ein neues Gebiet"}</b></h2>
            <form onSubmit={onSpeichern}>
                <div className="form">
                    <div className="form-floating mb-3">
                        <input id="nameJa" className={`form-control${nameValidationError ? " is-invalid" : ""}`} type="text" name="name" onBlur={onBlurName} onChange={updateTextInput} value={gebietData.name} placeholder="" required />
                        <label htmlFor="nameJa">Name*</label>
                        <div className="invalid-feedback">{nameValidationError}</div>
                    </div>
                    <div className="form-floating mb-3">
                        <input id="beschreibung" className={`form-control${besValidationError ? " is-invalid" : ""}`} type="text" name="beschreibung" onBlur={onBlurBes} onChange={updateTextInput} value={gebietData.beschreibung} placeholder="" />
                        <label htmlFor="beschreibung">Beschreibung</label>
                        <div className="invalid-feedback">{besValidationError}</div>
                    </div>
                    <h5>Das Gebiet ist:</h5>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <fieldset className="border rounded p-3 h-100">
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name="public" id="publicJa" onChange={updateRadio} value={String("true")} checked={gebietData.public === true} />
                                    <label className="form-check-label text-success" htmlFor="publicJa">öffentlich</label>
                                </div>
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name="public" id="publicNein" onChange={updateRadio} value={String("false")} checked={gebietData.public === false} />
                                    <label className="form-check-label text-warning" htmlFor="publicNein">privat</label>
                                </div>
                            </fieldset>
                        </div>
                        <div className="col-md-6 mb-3">
                            <fieldset className="border rounded p-3 h-100">
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name="closed" id="closedNein" onChange={updateRadio} value={String("false")} checked={gebietData.closed === false} />
                                    <label className="form-check-label text-success" htmlFor="closedNein">offen</label>
                                </div>
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name="closed" id="closedJa" onChange={updateRadio} value={String("true")} checked={gebietData.closed === true} />
                                    <label className="form-check-label text-danger" htmlFor="closedJa">geschlossen</label>
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
                            disabled={nameValidationError !== "" || besValidationError !== "" || gebietData.name.length === 0}>
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
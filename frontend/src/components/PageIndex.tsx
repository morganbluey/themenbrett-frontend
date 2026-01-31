import { AlleGebiete } from "./AlleGebiete";
import { useLoginContext } from "../LoginContext";
import { Link } from "react-router";

export function PageIndex() {
    const { login } = useLoginContext();

    return (
        <>
            <AlleGebiete />
            <div className="py-4" style={{ display: "flex", justifyContent: "center" }}>
                {login
                    ? <Link to="/gebiet/neu" className="btn btn-outline-primary btn-lg rounded-3">Neues Gebiet</Link>
                    : null}
            </div>
        </>
    );
}
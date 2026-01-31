import { GebietResource } from "../Resources";
import { Card, Stack } from "react-bootstrap";
import { Link } from "react-router"

export function GebietDescription(props: { gebiet: GebietResource }) {
    return (
        <Card className="mb-4 shadow-lg border-2 rounded-3">
            <Card.Header className="bg-light py-2">
                <div className="text-center position-relative" style={{ height: "15px" }}>
                    <span className="badge bg-primary px-3 py-2 rounded-pill text-truncate"
                        style={{ fontSize: "1rem", transform: "translateY(-75%)", maxWidth: "90%" }}>
                        {props.gebiet.name}
                    </span>
                </div>
            </Card.Header>

            <Card.Body>
                <Stack>
                    <p className="text-muted" style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: "1.4rem", height: "4.2rem" }}>
                        {props.gebiet.beschreibung ?? "Leider keine Beschreibung vorhanden..."}
                    </p>

                    <p className="d-flex flex-wrap gap-2">
                        <span className={props.gebiet.public ? "badge bg-success" : "badge bg-warning"}>
                            {props.gebiet.public ? "öffentlich" : "privat"}
                        </span>
                        <span className={props.gebiet.closed ? "badge bg-danger" : "badge bg-success"}>
                            {props.gebiet.closed ? "geschlossen" : "offen"}
                        </span>
                    </p>

                    <p>Verwalter: <b>{props.gebiet.verwalterName}</b></p>

                    <p className="small text-muted">Erstellungsdatum: <b>{props.gebiet.createdAt}</b></p>

                    <p>
                        <span className="badge bg-info">
                            Themen: {"" + props.gebiet.anzahlThemen}
                        </span>
                    </p>
                </Stack>
            </Card.Body>
            <Card.Footer className="bg-light">
                <Link to={`/gebiet/${props.gebiet.id}`} className="btn btn-outline-primary btn-sm rounded-3">
                    Details
                </Link>
            </Card.Footer>
        </Card>
    );
}
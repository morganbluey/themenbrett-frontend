import { Link } from "react-router";
import type { ThemaResource } from "../Resources";
import { Card, Stack } from "react-bootstrap";


export function ThemaDescription(props: { thema: ThemaResource }) {
    return (
        <Card className="mb-4 shadow-lg border-2 rounded-3">
            <Card.Header className="bg-light py-2">
                <div className="text-center position-relative" style={{ height: "15px" }}>
                    <span className="badge bg-info px-3 py-2 rounded-pill text-truncate"
                        style={{ fontSize: "1rem", transform: "translateY(-75%)", maxWidth: "90%" }}>
                        {props.thema.titel}
                    </span>
                </div>
            </Card.Header>

            <Card.Body>
                <Stack>
                    <p className="text-muted" style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: "1.4rem", height: "4.2rem" }}>
                        {props.thema.literatur 
                        ? (<>
                            Literatur: {props.thema.literatur}
                        </>)
                        : (<>
                        Keine Literatur vorhanden
                        </>)}
                    </p>

                    <p className="d-flex flex-wrap gap-2">
                        <span className={props.thema.status === "offen" ? "badge bg-success" : "badge bg-danger"}>
                            {props.thema.status}
                        </span>
                        <span className="badge bg-primary">
                            {props.thema.abschluss}
                        </span>
                    </p>

                    <p>Betreuer: <b>{props.thema.betreuerName}</b></p>

                    <p className="small text-muted">Zuletzt geupdatet am: <b>{props.thema.updatedAt}</b></p>
                </Stack>
            </Card.Body>
            <Card.Footer className="bg-light">
                <Link to={`/thema/${props.thema.id}`} className="btn btn-outline-dark btn-sm rounded-3">
                    Details
                </Link>
            </Card.Footer>
        </Card>
    )
}
import { Container } from "react-bootstrap";
import { Card } from "react-bootstrap";
import { deleteLogin } from "../auth/api";
import { useLoginContext } from "../LoginContext";
import { useEffect, useCallback } from "react";

export default function ErrorFallback({ error }: { error: unknown }) {
  const { setLogin } = useLoginContext();

  const doLogout = useCallback(async () => {
    await deleteLogin();
    setLogin(false);
  }, [setLogin]);

  useEffect(() => {
    void doLogout();
  }, [doLogout]);

  return (
    <Container className="py-4">
      <Card className="mb-4 shadow-lg border-2 rounded-3">
        <Card.Header className="bg-danger d-flex align-items-center">
          <h2 className="text-light mb-0">Ein Fehler ist aufgetreten</h2>
        </Card.Header>
        <Card.Body>
          <div>
            {error instanceof Error ? (
              <div>
                <pre className="text-danger">
                  <b>Fehlermeldung:</b>
                </pre>
                <pre>{error.message}</pre>
                <br />
                <pre className="text-danger">
                  <b>Fehlerstack:</b>
                </pre>
                <pre>{error.stack}</pre>
              </div>
            ) : (
              <pre>{String(error)}</pre>
            )}
          </div>
        </Card.Body>
        <Card.Footer className="bg-light">
          <a href="/" className="btn btn-outline-primary btn-sm rounded-3">
            Startseite
          </a>
        </Card.Footer>
      </Card>
    </Container>
  );
}

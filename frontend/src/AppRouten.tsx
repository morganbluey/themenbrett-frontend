import { Route, Routes } from "react-router";
import { PageIndex } from "./components/PageIndex";
import { PageGebiet } from "./components/PageGebiet";
import { PageThema } from "./components/PageThema";
import { PageAdmin } from "./components/PageAdmin";
import Header from "./components/Header";
import { useState } from "react";
import { LoginDialog } from "./components/LoginDialog";

function AppRouten() {
    const [showLoginDialog, setShowLoginDialog] = useState(false);

    return (
        <>
            <Header onLoginClick={() => setShowLoginDialog(true)} />
            {/* Hier muss leider noch ein div mit Einstellungen für die Verdunklung des Hintergrunds hin,
                da durch die Änderungen von folgendem Code (aus der Mail), sowie der Entfernung der if-Bedingung in LoginDialog,
                die Verdunklung und Positionierung des Login Dialogs zurückgesetzt wird. */}
            {showLoginDialog && (
                <>
                    <div style={{ position: "fixed", inset: 0, background: "black", opacity: 0.5, zIndex: 1 }} />
                    <LoginDialog show={showLoginDialog} onHide={() => setShowLoginDialog(false)} />
                </>
            )}
            <Routes>
                <Route path="/" element={<PageIndex />} />
                <Route path="/gebiet/:id" element={<PageGebiet />} />
                <Route path="/gebiet/:id/thema/neu" element={<PageThema />} />
                <Route path="/thema/:id" element={<PageThema />} />
                <Route path="/admin" element={<PageAdmin />} />

                {/* Fallback auf Übersichtsseite, falls keine Route zutrifft */}
                <Route path="*" element={<PageIndex />} />
            </Routes>
        </>
    );
}

export default AppRouten;
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./components/ErrorBoundary";
import AppRouten from "./AppRouten";
import { LoginManager } from "./auth/LoginManager";

function App() {
    return (
        <LoginManager>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
                <AppRouten />
            </ErrorBoundary>
        </LoginManager>
    );
}

export default App;
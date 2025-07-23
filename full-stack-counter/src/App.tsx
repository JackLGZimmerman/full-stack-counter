import "./App.css";
import { Container } from "./components/layout";
import { Counter } from "./components/features";
import { CounterProvider } from "./context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CounterProvider>
        <div className="flex h-screen bg-gray-200 items-center justify-center">
          <Container>
            <Counter />
          </Container>
        </div>
      </CounterProvider>
    </QueryClientProvider>
  );
}

export default App;

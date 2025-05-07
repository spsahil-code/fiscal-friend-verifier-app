
import { useState, useEffect } from "react";
import { Client } from "@/types/client";
import AddClientForm from "@/components/AddClientForm";
import ClientList from "@/components/ClientList";
import { getClients, addClient } from "@/services/clientService";
import { Loader2 } from "lucide-react";

const Index = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      setIsLoading(true);
      const data = await getClients();
      setClients(data);
      setIsLoading(false);
    };

    fetchClients();
  }, []);

  const handleAddClient = async (clientData: Omit<Client, "id">) => {
    const newClient = await addClient(clientData);
    if (newClient) {
      setClients([newClient, ...clients]);
    }
  };

  const handleStatusUpdate = (id: string, newStatus: boolean | "pending") => {
    setClients(clients.map(client => 
      client.id === id ? { ...client, isVerified: newStatus } : client
    ));
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Client Verification App</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <AddClientForm onAddClient={handleAddClient} />
        </div>
        
        <div className="lg:col-span-2">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <ClientList 
              clients={clients} 
              onStatusUpdate={handleStatusUpdate}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;

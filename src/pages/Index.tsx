
import { useState, useEffect } from "react";
import { Client } from "@/types/client";
import AddClientForm from "@/components/AddClientForm";
import ClientList from "@/components/ClientList";
import { getClients, addClient } from "@/services/clientService";
import { Loader2, Users } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto py-12 px-4 max-w-7xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
            <Users className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground">Client Verification App</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Manage and track verification status for all your clients in one place
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl shadow-lg border overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-500">
              <div className="p-6 border-b bg-muted/30">
                <h2 className="text-xl font-semibold">Add New Client</h2>
              </div>
              <div className="p-6">
                <AddClientForm onAddClient={handleAddClient} />
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <div className="bg-card rounded-xl shadow-lg border h-full animate-in fade-in slide-in-from-bottom-3 duration-500">
              {isLoading ? (
                <div className="flex items-center justify-center h-64 flex-col gap-2">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-muted-foreground">Loading clients...</p>
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
      </div>
    </div>
  );
};

export default Index;

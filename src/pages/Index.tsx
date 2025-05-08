
import { useState, useEffect } from "react";
import { Client } from "@/types/client";
import AddClientDialog from "@/components/AddClientDialog";
import ClientList from "@/components/ClientList";
import ThemeToggle from "@/components/ThemeToggle";
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
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 dark:from-gray-950 dark:to-gray-900 transition-all duration-500">
      <ThemeToggle />
      <div className="container mx-auto py-4 md:py-12 px-3 md:px-4 max-w-7xl">
        <div className="text-center mb-6 md:mb-12 animate-in fade-in duration-700">
          <div className="inline-flex items-center justify-center p-2 md:p-3 bg-primary/10 dark:bg-primary/20 rounded-full mb-3 md:mb-4 ring-1 ring-primary/20 dark:ring-primary/30">
            <Users className="h-6 w-6 md:h-8 md:w-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold relative">
            <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 dark:from-cyan-400 dark:via-primary dark:to-purple-400 bg-clip-text text-transparent animate-pulse">SP</span>
            <span className="bg-gradient-to-r from-blue-500 via-green-500 to-yellow-500 dark:from-purple-400 dark:via-pink-400 dark:to-amber-300 bg-clip-text text-transparent animate-pulse">Client</span>
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-pink-500 to-blue-500 dark:from-cyan-400 dark:to-purple-400 rounded-full opacity-70"></div>
          </h1>
          <p className="text-xs md:text-base text-muted-foreground dark:text-gray-400 mt-3 md:mt-4 max-w-2xl mx-auto">
            Manage and track verification status for all your clients
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-6 md:gap-8">          
          <div>
            <div className="glass-effect rounded-xl shadow-lg dark:shadow-primary/5 animate-in slide-in-from-bottom-3 duration-700 dark:bg-gray-900/30 dark:backdrop-blur-xl dark:border-gray-800">
              {isLoading ? (
                <div className="flex items-center justify-center h-40 md:h-64 flex-col gap-3 bg-card/50 dark:bg-gray-900/40 rounded-xl">
                  <div className="relative">
                    <div className="w-8 h-8 md:w-12 md:h-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
                    <Loader2 className="h-5 w-5 md:h-8 md:w-8 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary animate-pulse" />
                  </div>
                  <p className="text-sm md:text-base text-muted-foreground dark:text-gray-400">Loading clients...</p>
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
      
      <div className="fixed bottom-4 md:bottom-6 right-4 md:right-6 z-40">
        <AddClientDialog onAddClient={handleAddClient} />
      </div>
    </div>
  );
};

export default Index;

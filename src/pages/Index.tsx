
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
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-primary/5 to-transparent dark:from-primary/10 dark:to-transparent pointer-events-none"></div>
      <div className="absolute top-20 right-20 w-[300px] h-[300px] rounded-full bg-primary/5 dark:bg-primary/10 blur-[120px] animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-20 left-20 w-[200px] h-[200px] rounded-full bg-secondary/10 dark:bg-secondary/20 blur-[100px] animate-pulse pointer-events-none"></div>
      
      <ThemeToggle />
      <div className="container mx-auto py-6 md:py-16 px-4 md:px-6 max-w-7xl relative z-10">
        <div className="text-center mb-8 md:mb-14 animate-in fade-in duration-700">
          <div className="inline-flex items-center justify-center p-3 md:p-4 bg-primary/10 dark:bg-primary/20 rounded-full mb-4 md:mb-6 ring-1 ring-primary/20 dark:ring-primary/30 shadow-lg shadow-primary/5 dark:shadow-primary/10">
            <Users className="h-7 w-7 md:h-9 md:w-9 text-primary animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold relative inline-block">
            <span className="bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 dark:from-cyan-400 dark:via-primary dark:to-purple-400 bg-clip-text text-transparent animate-rainbow">SP</span>
            <span className="bg-gradient-to-br from-blue-500 via-green-500 to-yellow-500 dark:from-purple-400 dark:via-pink-400 dark:to-amber-300 bg-clip-text text-transparent animate-rainbow">Client</span>
            <div className="absolute -bottom-3 left-0 w-full h-1.5 bg-gradient-to-r from-pink-500 to-blue-500 dark:from-cyan-400 dark:to-purple-400 rounded-full opacity-70 animate-pulse"></div>
          </h1>
          <p className="text-sm md:text-lg text-muted-foreground dark:text-gray-400 mt-4 md:mt-6 max-w-2xl mx-auto opacity-90 animate-in slide-in-from-bottom-3 duration-700 delay-300">
            <span className="text-primary/90 dark:text-primary/70 font-medium">Effortlessly manage and track verification status</span> for all your clients
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-8 md:gap-10 relative">          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-background/50 to-secondary/30 dark:from-gray-900/50 dark:to-gray-800/30 backdrop-blur-xl rounded-2xl -m-2 -z-10"></div>
            <div className="glass-card rounded-xl shadow-xl dark:shadow-primary/5 animate-in slide-in-from-bottom-3 duration-700 overflow-hidden border border-primary/5 dark:border-primary/10">
              {isLoading ? (
                <div className="flex items-center justify-center h-48 md:h-72 flex-col gap-4 bg-card/50 dark:bg-gray-900/40 rounded-xl">
                  <div className="relative">
                    <div className="w-10 h-10 md:w-14 md:h-14 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
                    <Loader2 className="h-6 w-6 md:h-8 md:w-8 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary animate-pulse" />
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
      
      <div className="fixed bottom-6 md:bottom-8 right-6 md:right-8 z-40">
        <AddClientDialog onAddClient={handleAddClient} />
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
    </div>
  );
};

export default Index;

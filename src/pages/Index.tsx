
import { useState, useEffect } from "react";
import { Client } from "@/types/client";
import AddClientDialog from "@/components/AddClientDialog";
import ClientList from "@/components/ClientList";
import ThemeToggle from "@/components/ThemeToggle";
import { getClients, addClient } from "@/services/clientService";
import { Loader2, Users, Check, X, Clock, Plus } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<"all" | "verified" | "not-verified" | "pending">("all");
  const isMobile = useIsMobile();

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

  const handleFilterChange = (value: string) => {
    setActiveFilter(value as "all" | "verified" | "not-verified" | "pending");
  };

  const filteredClients = clients.filter(client => {
    if (activeFilter === "all") return true;
    if (activeFilter === "verified") return client.isVerified === true;
    if (activeFilter === "not-verified") return client.isVerified === false;
    if (activeFilter === "pending") return client.isVerified === "pending";
    return true;
  });

  const verifiedCount = clients.filter(c => c.isVerified === true).length;
  const notVerifiedCount = clients.filter(c => c.isVerified === false).length;
  const pendingCount = clients.filter(c => c.isVerified === "pending").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 dark:from-gray-950 dark:to-gray-900 transition-all duration-500">
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-primary/5 to-transparent dark:from-primary/10 dark:to-transparent pointer-events-none"></div>
      <div className="absolute top-20 right-20 w-[300px] h-[300px] rounded-full bg-primary/5 dark:bg-primary/10 blur-[120px] animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-20 left-20 w-[200px] h-[200px] rounded-full bg-secondary/10 dark:bg-secondary/20 blur-[100px] animate-pulse pointer-events-none"></div>
      
      <ThemeToggle />
      <div className="container mx-auto py-6 md:py-16 px-4 md:px-6 max-w-7xl relative z-10 pb-floating-bar">
        <div className="text-center mb-8 md:mb-14 animate-in fade-in duration-700">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight relative inline-block uppercase">
            <span className="bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 dark:from-cyan-400 dark:via-primary dark:to-purple-400 bg-clip-text text-transparent animate-rainbow">SP</span>
            <span className="bg-gradient-to-br from-blue-500 via-green-500 to-yellow-500 dark:from-purple-400 dark:via-pink-400 dark:to-amber-300 bg-clip-text text-transparent animate-rainbow">CLIENT</span>
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
                  clients={filteredClients} 
                  onStatusUpdate={handleStatusUpdate}
                  activeTab={activeFilter}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating Bottom Bar - Updated to modern pill shape */}
      <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4">
        <div className="bg-background/80 dark:bg-gray-900/90 backdrop-blur-lg border border-primary/10 dark:border-primary/20 shadow-lg py-3 px-4 rounded-full floating-bar-glow float-up">
          <div className="container mx-auto max-w-3xl flex justify-between items-center">
            {/* Add Client Button (Modern Circle with Outline) */}
            <div className="flex-shrink-0">
              <AddClientDialog onAddClient={handleAddClient}>
                <Button 
                  size="icon" 
                  className="relative bg-gradient-to-r from-primary to-primary/80 dark:from-primary/90 dark:to-primary/70 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center h-10 w-10 md:h-12 md:w-12 pill-glow"
                >
                  <Plus className="h-5 w-5 md:h-6 md:w-6" />
                  <div className="absolute inset-0 rounded-full border-2 border-primary/40 dark:border-primary/30 animate-pulse"></div>
                </Button>
              </AddClientDialog>
            </div>
            
            {/* Filter Tabs - With modern pill shape */}
            <Tabs 
              value={activeFilter} 
              onValueChange={handleFilterChange}
              className="flex-grow ml-4"
            >
              <TabsList className="grid grid-cols-4 bg-secondary/50 dark:bg-secondary/20 p-1 md:p-1.5 rounded-full shadow-inner">
                <TabsTrigger 
                  value="all" 
                  className="text-xs md:text-sm flex items-center gap-1.5 data-[state=active]:bg-green-100/90 dark:data-[state=active]:bg-green-900/30 data-[state=active]:shadow-md rounded-full transition-all duration-300 h-9 md:h-10 pill-hover"
                >
                  <Users size={isMobile ? 12 : 14} className={isMobile ? "h-3 w-3" : "h-4 w-4"} /> 
                  <span className={isMobile ? "hidden sm:inline" : ""}>All</span>
                  <span className="text-xs rounded-full bg-green-200/80 dark:bg-green-800/40 px-1.5 py-0.5 ml-1">{clients.length}</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="verified" 
                  className="text-xs md:text-sm flex items-center gap-1.5 data-[state=active]:bg-green-100/90 dark:data-[state=active]:bg-green-900/30 data-[state=active]:shadow-md rounded-full transition-all duration-300 h-9 md:h-10 pill-hover"
                >
                  <Check size={isMobile ? 12 : 14} className={isMobile ? "h-3 w-3" : "h-4 w-4"} /> 
                  <span className={isMobile ? "hidden sm:inline" : ""}>Verified</span>
                  <span className="text-xs rounded-full bg-green-200/80 dark:bg-green-800/40 px-1.5 py-0.5 ml-1">{verifiedCount}</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="not-verified" 
                  className="text-xs md:text-sm flex items-center gap-1.5 data-[state=active]:bg-green-100/90 dark:data-[state=active]:bg-green-900/30 data-[state=active]:shadow-md rounded-full transition-all duration-300 h-9 md:h-10 pill-hover"
                >
                  <X size={isMobile ? 12 : 14} className={isMobile ? "h-3 w-3" : "h-4 w-4"} /> 
                  <span className={isMobile ? "hidden sm:inline" : ""}>Not Ver.</span>
                  <span className="text-xs rounded-full bg-green-200/80 dark:bg-green-800/40 px-1.5 py-0.5 ml-1">{notVerifiedCount}</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="pending" 
                  className="text-xs md:text-sm flex items-center gap-1.5 data-[state=active]:bg-green-100/90 dark:data-[state=active]:bg-green-900/30 data-[state=active]:shadow-md rounded-full transition-all duration-300 h-9 md:h-10 pill-hover"
                >
                  <Clock size={isMobile ? 12 : 14} className={isMobile ? "h-3 w-3" : "h-4 w-4"} /> 
                  <span className={isMobile ? "hidden sm:inline" : ""}>Pending</span>
                  <span className="text-xs rounded-full bg-green-200/80 dark:bg-green-800/40 px-1.5 py-0.5 ml-1">{pendingCount}</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
    </div>
  );
};

export default Index;

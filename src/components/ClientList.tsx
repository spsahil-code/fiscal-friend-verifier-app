
import { useState } from "react";
import { Client } from "@/types/client";
import ClientCard from "./ClientCard";
import { ListOrdered, Check, X, Clock, Users } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";

interface ClientListProps {
  clients: Client[];
  onStatusUpdate: (id: string, newStatus: boolean | "pending") => void;
}

const ClientList = ({ clients, onStatusUpdate }: ClientListProps) => {
  const [activeTab, setActiveTab] = useState<"all" | "verified" | "not-verified" | "pending">("all");
  const isMobile = useIsMobile();
  
  const filteredClients = clients.filter(client => {
    if (activeTab === "all") return true;
    if (activeTab === "verified") return client.isVerified === true;
    if (activeTab === "not-verified") return client.isVerified === false;
    if (activeTab === "pending") return client.isVerified === "pending";
    return true;
  });

  const verifiedCount = clients.filter(c => c.isVerified === true).length;
  const notVerifiedCount = clients.filter(c => c.isVerified === false).length;
  const pendingCount = clients.filter(c => c.isVerified === "pending").length;

  if (clients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 md:p-16 border-2 border-dashed rounded-xl border-muted/50 dark:border-muted/30 bg-secondary/30 dark:bg-secondary/10 backdrop-blur-sm">
        <div className="bg-primary/10 dark:bg-primary/20 rounded-full p-4 mb-4">
          <Users className="h-10 w-10 md:h-12 md:w-12 text-primary" />
        </div>
        <h3 className="text-lg md:text-xl font-medium mb-2 text-center">No clients yet</h3>
        <p className="text-muted-foreground text-center text-sm md:text-base max-w-md">
          Add your first client using the Add Client button to get started with client verification.
        </p>
      </div>
    );
  }

  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6 bg-card/50 dark:bg-card/30 rounded-xl backdrop-blur-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <ListOrdered className="h-4 w-4 md:h-5 md:w-5 text-primary" />
          <h2 className="text-lg md:text-2xl font-bold">Client List</h2>
        </div>
        <div className="text-xs md:text-sm text-muted-foreground">
          Total: <span className="font-medium">{clients.length}</span> clients
        </div>
      </div>
      
      {/* Stats Cards - Grid layout with responsive design */}
      <div className="grid grid-cols-3 gap-2 md:gap-4">
        <div className="bg-secondary/50 dark:bg-secondary/20 p-2 md:p-4 rounded-lg border shadow-sm dark:shadow-primary/5 flex items-center gap-2 md:gap-3 hover:translate-y-[-2px] hover:shadow-md transition-all duration-300">
          <div className="bg-green-100 dark:bg-green-900/30 p-1.5 md:p-2.5 rounded-full">
            <Check size={isMobile ? 12 : 20} className="text-green-600 dark:text-green-400" />
          </div>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center flex-1">
            <div className="text-xs md:text-sm text-muted-foreground">Verified</div>
            <div className="text-sm md:text-2xl font-bold">{verifiedCount}</div>
          </div>
        </div>
        
        <div className="bg-secondary/50 dark:bg-secondary/20 p-2 md:p-4 rounded-lg border shadow-sm dark:shadow-primary/5 flex items-center gap-2 md:gap-3 hover:translate-y-[-2px] hover:shadow-md transition-all duration-300">
          <div className="bg-amber-100 dark:bg-amber-900/30 p-1.5 md:p-2.5 rounded-full">
            <Clock size={isMobile ? 12 : 20} className="text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center flex-1">
            <div className="text-xs md:text-sm text-muted-foreground">Pending</div>
            <div className="text-sm md:text-2xl font-bold">{pendingCount}</div>
          </div>
        </div>
        
        <div className="bg-secondary/50 dark:bg-secondary/20 p-2 md:p-4 rounded-lg border shadow-sm dark:shadow-primary/5 flex items-center gap-2 md:gap-3 hover:translate-y-[-2px] hover:shadow-md transition-all duration-300">
          <div className="bg-red-100 dark:bg-red-900/30 p-1.5 md:p-2.5 rounded-full">
            <X size={isMobile ? 12 : 20} className="text-red-600 dark:text-red-400" />
          </div>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center flex-1">
            <div className="text-xs md:text-sm text-muted-foreground">Not Verified</div>
            <div className="text-sm md:text-2xl font-bold">{notVerifiedCount}</div>
          </div>
        </div>
      </div>
      
      {/* Tabs - Full width with rounded design */}
      <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList className="grid grid-cols-4 mb-3 w-full bg-secondary/50 dark:bg-secondary/20 p-1 rounded-lg">
          <TabsTrigger value="all" className="text-xs md:text-sm flex items-center gap-1 data-[state=active]:bg-background dark:data-[state=active]:bg-primary/10 data-[state=active]:shadow-sm rounded-md">
            <ListOrdered size={isMobile ? 12 : 14} className={isMobile ? "h-3 w-3" : "h-4 w-4"} /> 
            <span className={isMobile ? "hidden sm:inline" : ""}>All</span>
            <span className="text-xs">({clients.length})</span>
          </TabsTrigger>
          <TabsTrigger value="verified" className="text-xs md:text-sm flex items-center gap-1 data-[state=active]:bg-background dark:data-[state=active]:bg-primary/10 data-[state=active]:shadow-sm rounded-md">
            <Check size={isMobile ? 12 : 14} className={isMobile ? "h-3 w-3" : "h-4 w-4"} /> 
            <span className={isMobile ? "hidden sm:inline" : ""}>Verified</span>
            <span className="text-xs">({verifiedCount})</span>
          </TabsTrigger>
          <TabsTrigger value="not-verified" className="text-xs md:text-sm flex items-center gap-1 data-[state=active]:bg-background dark:data-[state=active]:bg-primary/10 data-[state=active]:shadow-sm rounded-md">
            <X size={isMobile ? 12 : 14} className={isMobile ? "h-3 w-3" : "h-4 w-4"} /> 
            <span className={isMobile ? "hidden sm:inline" : ""}>Not</span>
            <span className="text-xs">({notVerifiedCount})</span>
          </TabsTrigger>
          <TabsTrigger value="pending" className="text-xs md:text-sm flex items-center gap-1 data-[state=active]:bg-background dark:data-[state=active]:bg-primary/10 data-[state=active]:shadow-sm rounded-md">
            <Clock size={isMobile ? 12 : 14} className={isMobile ? "h-3 w-3" : "h-4 w-4"} /> 
            <span className={isMobile ? "hidden sm:inline" : ""}>Pending</span>
            <span className="text-xs">({pendingCount})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-3 mt-2 animate-in fade-in-0 duration-500">
          {filteredClients.map((client, index) => (
            <ClientCard 
              key={client.id} 
              client={client} 
              index={index + 1}
              onStatusUpdate={onStatusUpdate} 
            />
          ))}
        </TabsContent>
        
        <TabsContent value="verified" className="space-y-3 mt-2 animate-in fade-in-0 duration-500">
          {filteredClients.map((client, index) => (
            <ClientCard 
              key={client.id} 
              client={client} 
              index={index + 1}
              onStatusUpdate={onStatusUpdate} 
            />
          ))}
        </TabsContent>
        
        <TabsContent value="not-verified" className="space-y-3 mt-2 animate-in fade-in-0 duration-500">
          {filteredClients.map((client, index) => (
            <ClientCard 
              key={client.id} 
              client={client} 
              index={index + 1}
              onStatusUpdate={onStatusUpdate} 
            />
          ))}
        </TabsContent>
        
        <TabsContent value="pending" className="space-y-3 mt-2 animate-in fade-in-0 duration-500">
          {filteredClients.map((client, index) => (
            <ClientCard 
              key={client.id} 
              client={client} 
              index={index + 1}
              onStatusUpdate={onStatusUpdate} 
            />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientList;

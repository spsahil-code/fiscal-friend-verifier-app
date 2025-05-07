
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
      <div className="flex flex-col items-center justify-center p-6 md:p-16 border-2 border-dashed rounded-md border-muted dark:border-muted/50">
        <Users className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
        <h3 className="text-xl font-medium mb-1">No clients yet</h3>
        <p className="text-muted-foreground text-center max-w-md">
          Add your first client using the Add Client button above to get started with client verification.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <ListOrdered className="h-5 w-5 text-primary" />
          <h2 className="text-xl md:text-2xl font-bold dark:text-white">Client List</h2>
        </div>
        <div className="text-xs md:text-sm text-muted-foreground">
          Total: <span className="font-medium">{clients.length}</span> clients
        </div>
      </div>
      
      {/* Stats Cards - Grid or stack based on screen size */}
      <div className="grid grid-cols-1 gap-3 mb-4 md:mb-6">
        <div className="bg-secondary/50 dark:bg-secondary/30 p-3 md:p-4 rounded-lg border flex items-center gap-3 card-hover">
          <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
            <Check size={isMobile ? 16 : 20} className="text-green-600 dark:text-green-400" />
          </div>
          <div className="flex justify-between items-center flex-1">
            <div className="text-sm text-muted-foreground">Verified</div>
            <div className="text-xl md:text-2xl font-bold dark:text-white">{verifiedCount}</div>
          </div>
        </div>
        
        <div className="bg-secondary/50 dark:bg-secondary/30 p-3 md:p-4 rounded-lg border flex items-center gap-3 card-hover">
          <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full">
            <Clock size={isMobile ? 16 : 20} className="text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex justify-between items-center flex-1">
            <div className="text-sm text-muted-foreground">Pending</div>
            <div className="text-xl md:text-2xl font-bold dark:text-white">{pendingCount}</div>
          </div>
        </div>
        
        <div className="bg-secondary/50 dark:bg-secondary/30 p-3 md:p-4 rounded-lg border flex items-center gap-3 card-hover">
          <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full">
            <X size={isMobile ? 16 : 20} className="text-red-600 dark:text-red-400" />
          </div>
          <div className="flex justify-between items-center flex-1">
            <div className="text-sm text-muted-foreground">Not Verified</div>
            <div className="text-xl md:text-2xl font-bold dark:text-white">{notVerifiedCount}</div>
          </div>
        </div>
      </div>
      
      {/* Tabs - Full width on mobile */}
      <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList className="grid grid-cols-4 mb-4 w-full">
          <TabsTrigger value="all" className="text-xs md:text-sm flex items-center gap-1">
            <ListOrdered size={14} className="hidden md:block" /> 
            <span>All</span>
            <span className="text-xs">({clients.length})</span>
          </TabsTrigger>
          <TabsTrigger value="verified" className="text-xs md:text-sm flex items-center gap-1">
            <Check size={14} className="hidden md:block" /> 
            <span>Verified</span>
            <span className="text-xs">({verifiedCount})</span>
          </TabsTrigger>
          <TabsTrigger value="not-verified" className="text-xs md:text-sm flex items-center gap-1">
            <X size={14} className="hidden md:block" /> 
            <span>Not</span>
            <span className="text-xs">({notVerifiedCount})</span>
          </TabsTrigger>
          <TabsTrigger value="pending" className="text-xs md:text-sm flex items-center gap-1">
            <Clock size={14} className="hidden md:block" /> 
            <span>Pending</span>
            <span className="text-xs">({pendingCount})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-3 mt-2">
          {filteredClients.map((client, index) => (
            <ClientCard 
              key={client.id} 
              client={client} 
              index={index + 1}
              onStatusUpdate={onStatusUpdate} 
            />
          ))}
        </TabsContent>
        
        <TabsContent value="verified" className="space-y-3 mt-2">
          {filteredClients.map((client, index) => (
            <ClientCard 
              key={client.id} 
              client={client} 
              index={index + 1}
              onStatusUpdate={onStatusUpdate} 
            />
          ))}
        </TabsContent>
        
        <TabsContent value="not-verified" className="space-y-3 mt-2">
          {filteredClients.map((client, index) => (
            <ClientCard 
              key={client.id} 
              client={client} 
              index={index + 1}
              onStatusUpdate={onStatusUpdate} 
            />
          ))}
        </TabsContent>
        
        <TabsContent value="pending" className="space-y-3 mt-2">
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

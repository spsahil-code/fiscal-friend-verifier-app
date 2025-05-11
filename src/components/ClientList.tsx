
import { useState } from "react";
import { Client } from "@/types/client";
import ClientCard from "./ClientCard";
import { ListOrdered, Check, X, Clock, Users, Filter } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";

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
      <div className="flex flex-col items-center justify-center p-8 md:p-16 border-2 border-dashed rounded-xl border-muted/50 dark:border-muted/30 bg-secondary/30 dark:bg-secondary/10 backdrop-blur-sm">
        <div className="bg-primary/10 dark:bg-primary/20 rounded-full p-5 mb-6 shadow-lg shadow-primary/5 dark:shadow-primary/10 animate-pulse">
          <Users className="h-10 w-10 md:h-14 md:w-14 text-primary" />
        </div>
        <h3 className="text-xl md:text-2xl font-semibold mb-3 text-center animate-in fade-in duration-700 delay-200">No clients yet</h3>
        <p className="text-muted-foreground text-center text-sm md:text-base max-w-md animate-in fade-in duration-700 delay-300">
          Add your first client using the <span className="px-2 py-1 bg-primary/10 dark:bg-primary/20 rounded-md text-primary font-medium">+</span> button to get started with client verification.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 bg-card/50 dark:bg-card/30 rounded-xl backdrop-blur-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 dark:bg-primary/20 p-1.5 rounded-lg">
            <ListOrdered className="h-4 w-4 md:h-5 md:w-5 text-primary" />
          </div>
          <h2 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 dark:from-primary dark:to-primary/70 bg-clip-text text-transparent">Client List</h2>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="py-1 px-2 bg-primary/5 dark:bg-primary/10 border-primary/10 dark:border-primary/20">
            <span className="text-xs md:text-sm text-muted-foreground">Total:</span>
            <span className="ml-1 font-medium text-foreground">{clients.length}</span>
          </Badge>
        </div>
      </div>
      
      {/* Stats Cards - Grid layout with hover effects */}
      <div className="grid grid-cols-3 gap-3 md:gap-5">
        <div className="bg-secondary/50 dark:bg-secondary/20 p-3 md:p-5 rounded-xl border border-primary/10 shadow-sm dark:shadow-primary/5 flex items-center gap-3 md:gap-4 hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300 group">
          <div className="bg-green-100 dark:bg-green-900/30 p-2 md:p-3 rounded-full group-hover:scale-110 transition-transform duration-300">
            <Check size={isMobile ? 14 : 20} className="text-green-600 dark:text-green-400" />
          </div>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center flex-1">
            <div className="text-xs md:text-sm text-muted-foreground">Verified</div>
            <div className="text-base md:text-3xl font-bold">{verifiedCount}</div>
          </div>
        </div>
        
        <div className="bg-secondary/50 dark:bg-secondary/20 p-3 md:p-5 rounded-xl border border-primary/10 shadow-sm dark:shadow-primary/5 flex items-center gap-3 md:gap-4 hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300 group">
          <div className="bg-amber-100 dark:bg-amber-900/30 p-2 md:p-3 rounded-full group-hover:scale-110 transition-transform duration-300">
            <Clock size={isMobile ? 14 : 20} className="text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center flex-1">
            <div className="text-xs md:text-sm text-muted-foreground">Pending</div>
            <div className="text-base md:text-3xl font-bold">{pendingCount}</div>
          </div>
        </div>
        
        <div className="bg-secondary/50 dark:bg-secondary/20 p-3 md:p-5 rounded-xl border border-primary/10 shadow-sm dark:shadow-primary/5 flex items-center gap-3 md:gap-4 hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300 group">
          <div className="bg-red-100 dark:bg-red-900/30 p-2 md:p-3 rounded-full group-hover:scale-110 transition-transform duration-300">
            <X size={isMobile ? 14 : 20} className="text-red-600 dark:text-red-400" />
          </div>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center flex-1">
            <div className="text-xs md:text-sm text-muted-foreground">Not Verified</div>
            <div className="text-base md:text-3xl font-bold">{notVerifiedCount}</div>
          </div>
        </div>
      </div>
      
      {/* Tabs - Full width with enhanced design */}
      <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList className="grid grid-cols-4 mb-5 w-full bg-secondary/50 dark:bg-secondary/20 p-1 md:p-1.5 rounded-lg shadow-inner">
          <TabsTrigger value="all" className="text-xs md:text-sm flex items-center gap-1.5 data-[state=active]:bg-background/80 dark:data-[state=active]:bg-primary/10 data-[state=active]:shadow-md rounded-md transition-all duration-300 h-9 md:h-10">
            <ListOrdered size={isMobile ? 12 : 14} className={isMobile ? "h-3 w-3" : "h-4 w-4"} /> 
            <span className={isMobile ? "hidden sm:inline" : ""}>All</span>
            <span className="text-xs rounded-full bg-background/50 dark:bg-primary/20 px-1.5 py-0.5">{clients.length}</span>
          </TabsTrigger>
          <TabsTrigger value="verified" className="text-xs md:text-sm flex items-center gap-1.5 data-[state=active]:bg-background/80 dark:data-[state=active]:bg-primary/10 data-[state=active]:shadow-md rounded-md transition-all duration-300 h-9 md:h-10">
            <Check size={isMobile ? 12 : 14} className={isMobile ? "h-3 w-3" : "h-4 w-4"} /> 
            <span className={isMobile ? "hidden sm:inline" : ""}>Verified</span>
            <span className="text-xs rounded-full bg-background/50 dark:bg-primary/20 px-1.5 py-0.5">{verifiedCount}</span>
          </TabsTrigger>
          <TabsTrigger value="not-verified" className="text-xs md:text-sm flex items-center gap-1.5 data-[state=active]:bg-background/80 dark:data-[state=active]:bg-primary/10 data-[state=active]:shadow-md rounded-md transition-all duration-300 h-9 md:h-10">
            <X size={isMobile ? 12 : 14} className={isMobile ? "h-3 w-3" : "h-4 w-4"} /> 
            <span className={isMobile ? "hidden sm:inline" : ""}>Not Ver.</span>
            <span className="text-xs rounded-full bg-background/50 dark:bg-primary/20 px-1.5 py-0.5">{notVerifiedCount}</span>
          </TabsTrigger>
          <TabsTrigger value="pending" className="text-xs md:text-sm flex items-center gap-1.5 data-[state=active]:bg-background/80 dark:data-[state=active]:bg-primary/10 data-[state=active]:shadow-md rounded-md transition-all duration-300 h-9 md:h-10">
            <Clock size={isMobile ? 12 : 14} className={isMobile ? "h-3 w-3" : "h-4 w-4"} /> 
            <span className={isMobile ? "hidden sm:inline" : ""}>Pending</span>
            <span className="text-xs rounded-full bg-background/50 dark:bg-primary/20 px-1.5 py-0.5">{pendingCount}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-3 mt-4 animate-in fade-in-0 duration-500">
          {filteredClients.map((client, index) => (
            <ClientCard 
              key={client.id} 
              client={client} 
              index={index + 1}
              onStatusUpdate={onStatusUpdate} 
            />
          ))}
        </TabsContent>
        
        <TabsContent value="verified" className="space-y-3 mt-4 animate-in fade-in-0 duration-500">
          {filteredClients.map((client, index) => (
            <ClientCard 
              key={client.id} 
              client={client} 
              index={index + 1}
              onStatusUpdate={onStatusUpdate} 
            />
          ))}
        </TabsContent>
        
        <TabsContent value="not-verified" className="space-y-3 mt-4 animate-in fade-in-0 duration-500">
          {filteredClients.map((client, index) => (
            <ClientCard 
              key={client.id} 
              client={client} 
              index={index + 1}
              onStatusUpdate={onStatusUpdate} 
            />
          ))}
        </TabsContent>
        
        <TabsContent value="pending" className="space-y-3 mt-4 animate-in fade-in-0 duration-500">
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

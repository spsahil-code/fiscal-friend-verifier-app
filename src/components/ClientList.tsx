
import { useState } from "react";
import { Client } from "@/types/client";
import ClientCard from "./ClientCard";
import { ListOrdered, Check, X, Clock, Users } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface ClientListProps {
  clients: Client[];
  onStatusUpdate: (id: string, newStatus: boolean | "pending") => void;
}

const ClientList = ({ clients, onStatusUpdate }: ClientListProps) => {
  const [activeTab, setActiveTab] = useState<"all" | "verified" | "not-verified" | "pending">("all");
  
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
      <div className="flex flex-col items-center justify-center p-16 border-2 border-dashed rounded-md border-muted">
        <Users className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
        <h3 className="text-xl font-medium mb-1">No clients yet</h3>
        <p className="text-muted-foreground text-center max-w-md">
          Add your first client using the form on the left to get started with client verification.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <ListOrdered className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold">Client List</h2>
        </div>
        <div className="text-sm text-muted-foreground">
          Total: <span className="font-medium">{clients.length}</span> clients
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-secondary/50 p-4 rounded-lg border flex items-center gap-3">
          <div className="bg-green-100 p-2 rounded-full">
            <Check size={20} className="text-green-600" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Verified</div>
            <div className="text-2xl font-bold">{verifiedCount}</div>
          </div>
        </div>
        
        <div className="bg-secondary/50 p-4 rounded-lg border flex items-center gap-3">
          <div className="bg-red-100 p-2 rounded-full">
            <X size={20} className="text-red-600" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Not Verified</div>
            <div className="text-2xl font-bold">{notVerifiedCount}</div>
          </div>
        </div>
        
        <div className="bg-secondary/50 p-4 rounded-lg border flex items-center gap-3">
          <div className="bg-amber-100 p-2 rounded-full">
            <Clock size={20} className="text-amber-600" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Pending</div>
            <div className="text-2xl font-bold">{pendingCount}</div>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList className="grid grid-cols-4 mb-6 w-full">
          <TabsTrigger value="all" className="flex items-center gap-1">
            <ListOrdered size={14} /> All ({clients.length})
          </TabsTrigger>
          <TabsTrigger value="verified" className="flex items-center gap-1">
            <Check size={14} /> Verified ({verifiedCount})
          </TabsTrigger>
          <TabsTrigger value="not-verified" className="flex items-center gap-1">
            <X size={14} /> Not Verified ({notVerifiedCount})
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex items-center gap-1">
            <Clock size={14} /> Pending ({pendingCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-2">
          {filteredClients.map((client, index) => (
            <ClientCard 
              key={client.id} 
              client={client} 
              index={index + 1}
              onStatusUpdate={onStatusUpdate} 
            />
          ))}
        </TabsContent>
        
        <TabsContent value="verified" className="space-y-4 mt-2">
          {filteredClients.map((client, index) => (
            <ClientCard 
              key={client.id} 
              client={client} 
              index={index + 1}
              onStatusUpdate={onStatusUpdate} 
            />
          ))}
        </TabsContent>
        
        <TabsContent value="not-verified" className="space-y-4 mt-2">
          {filteredClients.map((client, index) => (
            <ClientCard 
              key={client.id} 
              client={client} 
              index={index + 1}
              onStatusUpdate={onStatusUpdate} 
            />
          ))}
        </TabsContent>
        
        <TabsContent value="pending" className="space-y-4 mt-2">
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

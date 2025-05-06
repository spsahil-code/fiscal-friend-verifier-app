
import { useState } from "react";
import { Client } from "@/types/client";
import ClientCard from "./ClientCard";
import { ListOrdered, Check, X, Clock } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface ClientListProps {
  clients: Client[];
}

const ClientList = ({ clients }: ClientListProps) => {
  const [activeTab, setActiveTab] = useState<"all" | "verified" | "not-verified" | "pending">("all");
  
  const filteredClients = clients.filter(client => {
    if (activeTab === "all") return true;
    if (activeTab === "verified") return client.isVerified === true;
    if (activeTab === "not-verified") return client.isVerified === false;
    if (activeTab === "pending") return client.isVerified === "pending";
    return true;
  });

  if (clients.length === 0) {
    return (
      <div className="text-center p-8 border border-dashed rounded-md">
        <p className="text-muted-foreground">No clients added yet. Add your first client to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <ListOrdered className="h-5 w-5 text-primary" />
        <h2 className="text-2xl font-bold">Client List</h2>
      </div>
      
      <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="all" className="flex items-center gap-1">
            <ListOrdered size={14} /> All ({clients.length})
          </TabsTrigger>
          <TabsTrigger value="verified" className="flex items-center gap-1">
            <Check size={14} /> Verified ({clients.filter(c => c.isVerified === true).length})
          </TabsTrigger>
          <TabsTrigger value="not-verified" className="flex items-center gap-1">
            <X size={14} /> Not Verified ({clients.filter(c => c.isVerified === false).length})
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex items-center gap-1">
            <Clock size={14} /> Pending ({clients.filter(c => c.isVerified === "pending").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredClients.map((client, index) => (
            <ClientCard key={client.id} client={client} index={index + 1} />
          ))}
        </TabsContent>
        
        <TabsContent value="verified" className="space-y-4">
          {filteredClients.map((client, index) => (
            <ClientCard key={client.id} client={client} index={index + 1} />
          ))}
        </TabsContent>
        
        <TabsContent value="not-verified" className="space-y-4">
          {filteredClients.map((client, index) => (
            <ClientCard key={client.id} client={client} index={index + 1} />
          ))}
        </TabsContent>
        
        <TabsContent value="pending" className="space-y-4">
          {filteredClients.map((client, index) => (
            <ClientCard key={client.id} client={client} index={index + 1} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientList;


import { Client } from "@/types/client";
import ClientCard from "./ClientCard";
import { ListOrdered } from "lucide-react";

interface ClientListProps {
  clients: Client[];
}

const ClientList = ({ clients }: ClientListProps) => {
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
      
      {clients.map((client, index) => (
        <ClientCard 
          key={client.id} 
          client={client} 
          index={index + 1} 
        />
      ))}
    </div>
  );
};

export default ClientList;


import { useState } from "react";
import { Client } from "@/types/client";
import AddClientForm from "@/components/AddClientForm";
import ClientList from "@/components/ClientList";

// Sample initial data
const initialClients: Client[] = [
  {
    id: "1",
    name: "Acme Corporation",
    financialYear: "2024-2025",
    isVerified: true,
    date: new Date("2024-01-15"),
  },
  {
    id: "2",
    name: "Globex Industries",
    financialYear: "2023-2024",
    isVerified: false,
    date: new Date("2023-06-22"),
  },
];

const Index = () => {
  const [clients, setClients] = useState<Client[]>(initialClients);

  const handleAddClient = (client: Client) => {
    setClients([client, ...clients]);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Client Verification App</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <AddClientForm onAddClient={handleAddClient} />
        </div>
        
        <div className="lg:col-span-2">
          <ClientList clients={clients} />
        </div>
      </div>
    </div>
  );
};

export default Index;

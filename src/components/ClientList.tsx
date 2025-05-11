
import { Client } from "@/types/client";
import ClientCard from "./ClientCard";
import { ListOrdered, Check, X, Clock, Users } from "lucide-react";
import { TabsContent } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";

interface ClientListProps {
  clients: Client[];
  onStatusUpdate: (id: string, newStatus: boolean | "pending") => void;
  activeTab?: "all" | "verified" | "not-verified" | "pending";
}

const ClientList = ({ clients, onStatusUpdate, activeTab = "all" }: ClientListProps) => {
  const isMobile = useIsMobile();
  
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
          <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-full">
            <ListOrdered className="h-4 w-4 md:h-5 md:w-5 text-green-600 dark:text-green-400" />
          </div>
          <Badge variant="outline" className="py-1 px-3 bg-green-50/80 dark:bg-green-900/20 border-green-200/50 dark:border-green-800/50 text-green-700 dark:text-green-400 rounded-full">
            <h2 className="text-lg md:text-xl font-bold">Client List</h2>
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="py-1 px-3 bg-green-50/80 dark:bg-green-900/20 border-green-200/50 dark:border-green-800/50 rounded-full">
            <span className="text-xs md:text-sm text-green-600 dark:text-green-400">Total:</span>
            <span className="ml-1 font-medium text-green-700 dark:text-green-300">{clients.length}</span>
          </Badge>
        </div>
      </div>
      
      {/* Stats Cards - with more minimal design */}
      <div className="grid grid-cols-3 gap-3 md:gap-5">
        <div className="bg-white/50 dark:bg-secondary/20 p-3 md:p-5 rounded-xl border border-green-100/50 dark:border-green-800/30 shadow-sm flex items-center gap-3 md:gap-4 hover:translate-y-[-2px] hover:shadow-md transition-all duration-300 group">
          <div className="bg-green-50 dark:bg-green-900/20 p-2 md:p-3 rounded-full group-hover:scale-110 transition-transform duration-300">
            <Check size={isMobile ? 14 : 20} className="text-green-500 dark:text-green-400" />
          </div>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center flex-1">
            <div className="text-xs md:text-sm text-green-600 dark:text-green-400">Verified</div>
            <Badge variant="outline" className="mt-1 md:mt-0 text-base md:text-3xl font-bold bg-green-50/80 dark:bg-green-900/20 border-green-100 dark:border-green-800/30 text-green-600 dark:text-green-400 px-2 py-0 rounded-full">
              {verifiedCount}
            </Badge>
          </div>
        </div>
        
        <div className="bg-white/50 dark:bg-secondary/20 p-3 md:p-5 rounded-xl border border-amber-100/50 dark:border-amber-800/30 shadow-sm flex items-center gap-3 md:gap-4 hover:translate-y-[-2px] hover:shadow-md transition-all duration-300 group">
          <div className="bg-amber-50 dark:bg-amber-900/20 p-2 md:p-3 rounded-full group-hover:scale-110 transition-transform duration-300">
            <Clock size={isMobile ? 14 : 20} className="text-amber-500 dark:text-amber-400" />
          </div>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center flex-1">
            <div className="text-xs md:text-sm text-amber-600 dark:text-amber-400">Pending</div>
            <Badge variant="outline" className="mt-1 md:mt-0 text-base md:text-3xl font-bold bg-amber-50/80 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800/30 text-amber-600 dark:text-amber-400 px-2 py-0 rounded-full">
              {pendingCount}
            </Badge>
          </div>
        </div>
        
        <div className="bg-white/50 dark:bg-secondary/20 p-3 md:p-5 rounded-xl border border-red-100/50 dark:border-red-800/30 shadow-sm flex items-center gap-3 md:gap-4 hover:translate-y-[-2px] hover:shadow-md transition-all duration-300 group">
          <div className="bg-red-50 dark:bg-red-900/20 p-2 md:p-3 rounded-full group-hover:scale-110 transition-transform duration-300">
            <X size={isMobile ? 14 : 20} className="text-red-500 dark:text-red-400" />
          </div>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center flex-1">
            <div className="text-xs md:text-sm text-red-600 dark:text-red-400">Not Verified</div>
            <Badge variant="outline" className="mt-1 md:mt-0 text-base md:text-3xl font-bold bg-red-50/80 dark:bg-red-900/20 border-red-100 dark:border-red-800/30 text-red-600 dark:text-red-400 px-2 py-0 rounded-full">
              {notVerifiedCount}
            </Badge>
          </div>
        </div>
      </div>
      
      {/* Client list with no tabs here, just render directly */}
      <div className="space-y-3 mt-4 animate-in fade-in-0 duration-500">
        {clients.map((client, index) => (
          <ClientCard 
            key={client.id} 
            client={client} 
            index={index + 1}
            onStatusUpdate={onStatusUpdate} 
          />
        ))}
      </div>
    </div>
  );
};

export default ClientList;

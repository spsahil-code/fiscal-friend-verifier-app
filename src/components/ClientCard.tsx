
import { format } from "date-fns";
import { Check, X, Clock } from "lucide-react";
import { Client } from "@/types/client";
import { 
  Card, 
  CardContent
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { updateClientVerification } from "@/services/clientService";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface ClientCardProps {
  client: Client;
  index: number;
  onStatusUpdate: (id: string, newStatus: boolean | "pending") => void;
}

const ClientCard = ({ client, index, onStatusUpdate }: ClientCardProps) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus: boolean | "pending") => {
    if (client.isVerified === newStatus) return;
    
    setIsUpdating(true);
    const success = await updateClientVerification(client.id, newStatus);
    setIsUpdating(false);
    
    if (success) {
      onStatusUpdate(client.id, newStatus);
    }
  };

  return (
    <Card className="w-full mb-4 hover:shadow-md transition-shadow">
      <CardContent className="p-4 flex items-center">
        <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-4">
          <span className="text-sm font-medium text-primary">{index}</span>
        </div>
        
        <div className="flex-grow">
          <div className="flex flex-wrap items-center gap-4">
            <h3 className="text-lg font-medium">{client.name}</h3>
            
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="font-medium">FY:</span>
                {client.financialYear}
              </span>
              
              <span className="flex items-center gap-1">
                <span className="font-medium">Date:</span>
                {format(client.date, 'dd/MM/yyyy')}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex-shrink-0 ml-2">
          {isUpdating ? (
            <Button disabled size="sm" variant="outline">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="ml-2">Updating...</span>
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline" className="flex items-center gap-1">
                  {client.isVerified === true ? (
                    <>
                      <Check size={14} className="text-green-500" /> 
                      <span className="ml-1">Verified</span>
                    </>
                  ) : client.isVerified === "pending" ? (
                    <>
                      <Clock size={14} className="text-amber-500" /> 
                      <span className="ml-1">Pending</span>
                    </>
                  ) : (
                    <>
                      <X size={14} className="text-red-500" /> 
                      <span className="ml-1">Not Verified</span>
                    </>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  onClick={() => handleStatusChange(true)}
                  disabled={client.isVerified === true}
                  className="flex items-center gap-2"
                >
                  <Check size={14} className="text-green-500" />
                  <span>Mark as Verified</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleStatusChange("pending")}
                  disabled={client.isVerified === "pending"}
                  className="flex items-center gap-2"
                >
                  <Clock size={14} className="text-amber-500" />
                  <span>Mark as Pending</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleStatusChange(false)}
                  disabled={client.isVerified === false}
                  className="flex items-center gap-2"
                >
                  <X size={14} className="text-red-500" />
                  <span>Mark as Not Verified</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientCard;

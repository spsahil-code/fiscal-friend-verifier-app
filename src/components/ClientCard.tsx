
import { format } from "date-fns";
import { Check, X, Clock, Calendar } from "lucide-react";
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
    <Card className="w-full overflow-hidden hover:shadow-md transition-all duration-300 group animate-in fade-in-50">
      <CardContent className="p-0">
        <div className="flex items-center">
          <div className={`w-2 self-stretch 
            ${client.isVerified === true ? 'bg-green-500' : 
              client.isVerified === "pending" ? 'bg-amber-500' : 
              'bg-red-500'}`} 
          />
          <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-4 my-4">
            <span className="text-sm font-medium text-primary">{index}</span>
          </div>
          
          <div className="flex flex-grow items-center justify-between py-4 pr-4">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h3 className="text-lg font-semibold">{client.name}</h3>
                
                <Badge variant={client.isVerified === true ? "default" : 
                              client.isVerified === "pending" ? "outline" : 
                              "destructive"}
                      className="ml-2">
                  {client.isVerified === true ? (
                    <span className="flex items-center gap-1">
                      <Check size={12} /> Verified
                    </span>
                  ) : client.isVerified === "pending" ? (
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> Pending
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <X size={12} /> Not Verified
                    </span>
                  )}
                </Badge>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="font-medium">FY:</span>
                  {client.financialYear}
                </span>
                
                <span className="flex items-center gap-1">
                  <Calendar size={14} className="text-muted-foreground" />
                  {format(client.date, 'dd/MM/yyyy')}
                </span>
              </div>
            </div>
            
            <div>
              {isUpdating ? (
                <Button disabled size="sm" variant="outline">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="ml-2">Updating...</span>
                </Button>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant={client.isVerified === true ? "default" : 
                                             client.isVerified === "pending" ? "outline" : 
                                             "destructive"} 
                            className="flex items-center gap-1">
                      {client.isVerified === true ? (
                        <>
                          <Check size={14} /> 
                          <span className="ml-1">Verified</span>
                        </>
                      ) : client.isVerified === "pending" ? (
                        <>
                          <Clock size={14} /> 
                          <span className="ml-1">Pending</span>
                        </>
                      ) : (
                        <>
                          <X size={14} /> 
                          <span className="ml-1">Not Verified</span>
                        </>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientCard;

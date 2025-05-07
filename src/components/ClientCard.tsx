
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
import { useIsMobile } from "@/hooks/use-mobile";

interface ClientCardProps {
  client: Client;
  index: number;
  onStatusUpdate: (id: string, newStatus: boolean | "pending") => void;
}

const ClientCard = ({ client, index, onStatusUpdate }: ClientCardProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const isMobile = useIsMobile();

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
          <div className={`w-1.5 md:w-2 self-stretch 
            ${client.isVerified === true ? 'bg-green-500' : 
              client.isVerified === "pending" ? 'bg-amber-500' : 
              'bg-red-500'}`} 
          />
          <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 bg-primary/10 rounded-full flex items-center justify-center mx-2 md:mx-4 my-3 md:my-4">
            <span className="text-xs md:text-sm font-medium text-primary">{index}</span>
          </div>
          
          <div className="flex flex-grow flex-col md:flex-row md:items-center justify-between py-2 md:py-4 pr-2 md:pr-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 className="text-base md:text-lg font-semibold">{client.name}</h3>
                
                {!isMobile && (
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
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="font-medium">FY:</span>
                  {client.financialYear}
                </span>
                
                <span className="flex items-center gap-1">
                  <Calendar size={14} className="text-muted-foreground" />
                  {format(client.date, 'dd/MM/yy')}
                </span>
              </div>
            </div>
            
            <div className="mt-2 md:mt-0">
              {isUpdating ? (
                <Button disabled size="sm" variant="outline" className="text-xs w-full md:w-auto">
                  <Loader2 className="h-3 w-3 md:h-4 md:w-4 animate-spin" />
                  <span className="ml-1">Updating...</span>
                </Button>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant={client.isVerified === true ? "default" : 
                                             client.isVerified === "pending" ? "outline" : 
                                             "destructive"} 
                            className="flex items-center gap-1 text-xs md:text-sm w-full md:w-auto">
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
                  <DropdownMenuContent align={isMobile ? "center" : "end"} className="w-52">
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

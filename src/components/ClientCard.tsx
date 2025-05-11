
import { format } from "date-fns";
import { Check, X, Clock, Calendar, MoreVertical } from "lucide-react";
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

  const statusColors = {
    true: {
      bg: 'bg-green-500/10 dark:bg-green-500/20',
      border: 'border-green-500/30 dark:border-green-400/30',
      text: 'text-green-600 dark:text-green-400',
      icon: 'text-green-500 dark:text-green-400',
      iconBg: 'bg-transparent',
      badge: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
      badgeBorder: 'border-green-200/50 dark:border-green-700/30',
      hoverBg: 'hover:bg-green-50 dark:hover:bg-green-900/10'
    },
    pending: {
      bg: 'bg-amber-500/10 dark:bg-amber-500/20',
      border: 'border-amber-500/30 dark:border-amber-400/30',
      text: 'text-amber-600 dark:text-amber-400',
      icon: 'text-amber-500 dark:text-amber-400',
      iconBg: 'bg-transparent',
      badge: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
      badgeBorder: 'border-amber-200/50 dark:border-amber-700/30',
      hoverBg: 'hover:bg-amber-50 dark:hover:bg-amber-900/10'
    },
    false: {
      bg: 'bg-red-500/10 dark:bg-red-500/20',
      border: 'border-red-500/30 dark:border-red-400/30',
      text: 'text-red-600 dark:text-red-400',
      icon: 'text-red-500 dark:text-red-400',
      iconBg: 'bg-transparent',
      badge: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
      badgeBorder: 'border-red-200/50 dark:border-red-700/30',
      hoverBg: 'hover:bg-red-50 dark:hover:bg-red-900/10'
    }
  };

  const currentStatus = client.isVerified === true ? 'true' : 
                        client.isVerified === 'pending' ? 'pending' : 'false';
  
  const colors = statusColors[currentStatus];

  return (
    <Card className={`w-full overflow-hidden transition-all duration-300 group animate-in fade-in-50 backdrop-blur-sm
      border border-primary/5 hover:border-primary/20 dark:border-primary/10 hover:dark:border-primary/20
      ${colors.hoverBg} shadow-sm hover:shadow-md relative`}
    >
      <div className="absolute left-0 top-0 bottom-0 w-1 ${colors.border}"></div>
      <CardContent className="p-0">
        <div className="flex items-center p-3 md:p-4">
          <div className={`flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mr-3 md:mr-4 
            ${colors.bg} border ${colors.border} transition-transform group-hover:scale-105 duration-300`}
          >
            {client.isVerified === true ? (
              <Check className={`h-5 w-5 md:h-6 md:w-6 ${colors.icon}`} />
            ) : client.isVerified === "pending" ? (
              <Clock className={`h-5 w-5 md:h-6 md:w-6 ${colors.icon}`} />
            ) : (
              <X className={`h-5 w-5 md:h-6 md:w-6 ${colors.icon}`} />
            )}
          </div>
          
          <div className="flex flex-grow flex-col md:flex-row md:items-center justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1 md:mb-2">
                <h3 className="text-base md:text-lg font-semibold truncate max-w-[150px] sm:max-w-xs md:max-w-md">
                  {client.name}
                </h3>
                
                {!isMobile && (
                  <Badge variant="outline"
                         className={`ml-2 px-2 py-0.5 text-xs ${colors.badge} border ${colors.badgeBorder}`}>
                    {client.isVerified === true ? "Verified" : 
                     client.isVerified === "pending" ? "Pending" : "Not Verified"}
                  </Badge>
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm text-muted-foreground">
                <span className="flex items-center gap-1 bg-primary/5 dark:bg-primary/10 px-2 py-0.5 rounded-full">
                  <span className="font-medium">FY:</span>
                  {client.financialYear}
                </span>
                
                <span className="flex items-center gap-1 bg-primary/5 dark:bg-primary/10 px-2 py-0.5 rounded-full">
                  <Calendar size={14} className="text-muted-foreground" />
                  {format(client.date, 'dd/MM/yy')}
                </span>
              </div>
            </div>
            
            <div className="mt-3 md:mt-0">
              {isUpdating ? (
                <Button disabled size="sm" variant="outline" className="text-xs w-full md:w-auto rounded-full border shadow-sm">
                  <Loader2 className="h-3 w-3 md:h-4 md:w-4 animate-spin mr-1" />
                  <span>Updating...</span>
                </Button>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" 
                            variant="outline"
                            className={`flex items-center gap-1 text-xs md:text-sm md:w-auto rounded-full shadow-sm
                                      border ${colors.border} ${colors.badge}`}
                    >
                      {client.isVerified === true ? (
                        <span className="flex items-center">
                          <Check size={14} className="mr-1" /> 
                          Verified
                        </span>
                      ) : client.isVerified === "pending" ? (
                        <span className="flex items-center">
                          <Clock size={14} className="mr-1" /> 
                          Pending
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <X size={14} className="mr-1" /> 
                          Not Verified
                        </span>
                      )}
                      <MoreVertical size={14} className="ml-1 opacity-60" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align={isMobile ? "center" : "end"} className="w-52 border border-primary/10 dark:border-primary/20 shadow-lg animate-in fade-in-0 zoom-in-95 duration-100">
                    <DropdownMenuItem 
                      onClick={() => handleStatusChange(true)}
                      disabled={client.isVerified === true}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <div className={`${colors.bg} p-1 rounded-full`}>
                        <Check size={14} className="text-green-600 dark:text-green-400" />
                      </div>
                      <span>Mark as Verified</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleStatusChange("pending")}
                      disabled={client.isVerified === "pending"}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <div className="bg-amber-500/10 dark:bg-amber-500/20 p-1 rounded-full">
                        <Clock size={14} className="text-amber-600 dark:text-amber-400" />
                      </div>
                      <span>Mark as Pending</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleStatusChange(false)}
                      disabled={client.isVerified === false}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <div className="bg-red-500/10 dark:bg-red-500/20 p-1 rounded-full">
                        <X size={14} className="text-red-600 dark:text-red-400" />
                      </div>
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


import { format } from "date-fns";
import { Check, X } from "lucide-react";
import { Client } from "@/types/client";
import { 
  Card, 
  CardContent
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ClientCardProps {
  client: Client;
  index: number;
}

const ClientCard = ({ client, index }: ClientCardProps) => {
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
          {client.isVerified ? (
            <Badge className="bg-green-500 hover:bg-green-600 flex items-center gap-1">
              <Check size={14} /> Verified
            </Badge>
          ) : (
            <Badge variant="destructive" className="flex items-center gap-1">
              <X size={14} /> Not Verified
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientCard;

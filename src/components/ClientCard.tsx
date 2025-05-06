
import { format } from "date-fns";
import { Check, X } from "lucide-react";
import { Client } from "@/types/client";
import { 
  Card, 
  CardContent, 
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ClientCardProps {
  client: Client;
}

const ClientCard = ({ client }: ClientCardProps) => {
  return (
    <Card className="w-full mb-4">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-medium">{client.name}</CardTitle>
        {client.isVerified ? (
          <Badge className="bg-green-500 hover:bg-green-600 ml-auto flex items-center gap-1">
            <Check size={16} /> Verified
          </Badge>
        ) : (
          <Badge variant="destructive" className="ml-auto flex items-center gap-1">
            <X size={16} /> Not Verified
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Financial Year</span>
            <span className="font-medium">{client.financialYear}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Date Added</span>
            <span className="font-medium">{format(client.date, 'PPP')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientCard;

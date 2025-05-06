
import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { Client } from "@/types/client";

interface AddClientFormProps {
  onAddClient: (client: Client) => void;
}

const generateFinancialYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  // Generate 5 years back and 2 years forward
  for (let i = -5; i <= 2; i++) {
    const startYear = currentYear + i;
    const endYear = startYear + 1;
    years.push(`${startYear}-${endYear}`);
  }
  return years;
};

const AddClientForm = ({ onAddClient }: AddClientFormProps) => {
  const [name, setName] = useState("");
  const [financialYear, setFinancialYear] = useState(
    `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`
  );
  const [isVerified, setIsVerified] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  
  const financialYears = generateFinancialYears();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Client name is required",
      });
      return;
    }

    const newClient: Client = {
      id: Date.now().toString(),
      name,
      financialYear,
      isVerified,
      date,
    };

    onAddClient(newClient);
    
    // Reset form
    setName("");
    setFinancialYear(`${new Date().getFullYear()}-${new Date().getFullYear() + 1}`);
    setIsVerified(false);
    setDate(new Date());
    
    toast({
      title: "Success",
      description: "Client added successfully",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Add New Client</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Client Name</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Enter client name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="financial-year">Financial Year</Label>
            <Select value={financialYear} onValueChange={setFinancialYear}>
              <SelectTrigger id="financial-year">
                <SelectValue placeholder="Select financial year" />
              </SelectTrigger>
              <SelectContent>
                {financialYears.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="verified">Verification Status</Label>
            <div className="flex items-center space-x-2">
              <Switch 
                checked={isVerified}
                onCheckedChange={setIsVerified}
                id="verified"
              />
              <span className="text-sm font-medium flex items-center">
                {isVerified ? (
                  <>
                    <Check className="text-green-500 mr-1" size={16} />
                    Verified
                  </>
                ) : (
                  <>
                    <X className="text-red-500 mr-1" size={16} />
                    Not Verified
                  </>
                )}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => newDate && setDate(newDate)}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <CardFooter className="px-0 pt-6">
            <Button type="submit" className="w-full">Add Client</Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddClientForm;

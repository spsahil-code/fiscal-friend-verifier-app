import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Check, X, Clock, Loader2 } from "lucide-react";
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
import { toast } from "@/hooks/use-toast";
import { Client } from "@/types/client";

interface AddClientFormProps {
  onAddClient: (client: Omit<Client, "id">) => Promise<void>;
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

// Function to determine assessment year from financial year
const getAssessmentYear = (financialYear: string): string => {
  const endYear = financialYear.split('-')[1];
  return `A.Y. ${endYear}-${parseInt(endYear) + 1}`;
};

const AddClientForm = ({ onAddClient }: AddClientFormProps) => {
  const [name, setName] = useState("");
  const [financialYear, setFinancialYear] = useState(
    `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`
  );
  const [assessmentYear, setAssessmentYear] = useState(
    getAssessmentYear(financialYear)
  );
  const [verificationStatus, setVerificationStatus] = useState<boolean | "pending">(false);
  const [date, setDate] = useState<Date>(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const financialYears = generateFinancialYears();

  // Update assessment year when financial year changes
  useEffect(() => {
    setAssessmentYear(getAssessmentYear(financialYear));
  }, [financialYear]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Client name is required",
      });
      return;
    }

    setIsSubmitting(true);

    const newClient: Omit<Client, "id"> = {
      name,
      financialYear,
      isVerified: verificationStatus,
      date,
    };

    try {
      await onAddClient(newClient);
      
      // Reset form
      setName("");
      setFinancialYear(`${new Date().getFullYear()}-${new Date().getFullYear() + 1}`);
      setVerificationStatus(false);
      setDate(new Date());
      
      toast({
        title: "Success",
        description: "Client added successfully",
      });
    } catch (error) {
      console.error("Error adding client:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add client",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Add New Client</CardTitle>
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

          <div className="grid grid-cols-2 gap-4">
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
            
            <div className="space-y-2">
              <Label htmlFor="assessment-year">Assessment Year</Label>
              <Input 
                id="assessment-year" 
                value={assessmentYear} 
                readOnly 
                className="bg-muted/30"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="verification-status">Verification Status</Label>
            <Select 
              value={verificationStatus === true ? "verified" : verificationStatus === "pending" ? "pending" : "not-verified"}
              onValueChange={(value) => {
                if (value === "verified") setVerificationStatus(true);
                else if (value === "pending") setVerificationStatus("pending");
                else setVerificationStatus(false);
              }}
            >
              <SelectTrigger id="verification-status">
                <SelectValue placeholder="Select verification status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="verified">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Verified</span>
                  </div>
                </SelectItem>
                <SelectItem value="not-verified">
                  <div className="flex items-center gap-2">
                    <X className="h-4 w-4 text-red-500" />
                    <span>Not Verified</span>
                  </div>
                </SelectItem>
                <SelectItem value="pending">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-500" />
                    <span>Pending</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
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
            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Client"
              )}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddClientForm;

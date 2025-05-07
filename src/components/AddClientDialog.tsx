
import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Check, X, Clock, Loader2, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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

interface AddClientDialogProps {
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

const AddClientDialog = ({ onAddClient }: AddClientDialogProps) => {
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
  const [open, setOpen] = useState(false);
  
  const financialYears = generateFinancialYears();

  // Update assessment year when financial year changes
  useState(() => {
    setAssessmentYear(getAssessmentYear(financialYear));
  });

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
      
      // Reset form and close dialog
      setName("");
      setFinancialYear(`${new Date().getFullYear()}-${new Date().getFullYear() + 1}`);
      setVerificationStatus(false);
      setDate(new Date());
      setOpen(false);
      
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 font-medium bg-gradient-to-r from-primary/90 to-primary hover:from-primary hover:to-primary/90">
          <PlusCircle size={18} />
          Add Client
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-card border-border rounded-xl dark:shadow-lg dark:shadow-primary/5">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">Add New Client</DialogTitle>
          <DialogDescription>
            Enter client details to add them to your verification system.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">Client Name</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Enter client name"
              className="border-input focus-visible:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="financial-year" className="text-foreground">Financial Year</Label>
              <Select value={financialYear} onValueChange={(val) => {
                setFinancialYear(val);
                setAssessmentYear(getAssessmentYear(val));
              }}>
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
              <Label htmlFor="assessment-year" className="text-foreground">Assessment Year</Label>
              <Input 
                id="assessment-year" 
                value={assessmentYear} 
                readOnly 
                className="bg-muted/30"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="verification-status" className="text-foreground">Verification Status</Label>
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
            <Label htmlFor="date" className="text-foreground">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
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
          
          <DialogFooter>
            <Button 
              type="submit" 
              className="w-full mt-4 bg-gradient-to-r from-primary/90 to-primary hover:from-primary hover:to-primary/90"
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
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddClientDialog;

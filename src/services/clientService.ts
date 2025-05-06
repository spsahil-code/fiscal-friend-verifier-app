
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types/client";
import { toast } from "@/hooks/use-toast";

export async function getClients(): Promise<Client[]> {
  try {
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching clients:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load clients",
      });
      return [];
    }

    // Convert data to Client type
    return data.map((client) => ({
      id: client.id,
      name: client.name,
      financialYear: client.financial_year,
      isVerified: client.is_verified === "true" ? true : 
                 client.is_verified === "pending" ? "pending" : false,
      date: new Date(client.date),
    }));
  } catch (error) {
    console.error("Unexpected error:", error);
    toast({
      variant: "destructive",
      title: "Error",
      description: "An unexpected error occurred",
    });
    return [];
  }
}

export async function addClient(client: Omit<Client, "id">): Promise<Client | null> {
  try {
    // Convert Client type to Supabase format
    const { data, error } = await supabase
      .from("clients")
      .insert({
        name: client.name,
        financial_year: client.financialYear,
        is_verified: typeof client.isVerified === "boolean" 
          ? client.isVerified.toString() 
          : client.isVerified,
        date: client.date.toISOString().split("T")[0],
      })
      .select()
      .single();

    if (error) {
      console.error("Error adding client:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add client",
      });
      return null;
    }

    // Convert response to Client type
    return {
      id: data.id,
      name: data.name,
      financialYear: data.financial_year,
      isVerified: data.is_verified === "true" ? true : 
                 data.is_verified === "pending" ? "pending" : false,
      date: new Date(data.date),
    };
  } catch (error) {
    console.error("Unexpected error:", error);
    toast({
      variant: "destructive",
      title: "Error",
      description: "An unexpected error occurred",
    });
    return null;
  }
}

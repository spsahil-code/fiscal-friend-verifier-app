
export interface Client {
  id: string;
  name: string;
  financialYear: string;
  isVerified: boolean | "pending";
  date: Date;
}

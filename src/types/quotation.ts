
export interface QuotationItem {
  id: number;
  description: string;
  unity: string;
  qty: number;
  pricePerUnit: number;
  totalPrice: number;
}

export interface QuotationData {
  quotationId: string;
  client: string;
  location: string;
  date: string;
  items: QuotationItem[];
  totalAmount: number;
  includeEBM: boolean;
}

export interface Material {
  id: string;
  name: string;
  category: string;
  unit: string;
  quantity: number;
  unitPrice: number;
}

export interface PresetMaterial {
  name: string;
  category: 'Cañerías' | 'Accesorios' | 'Grifería' | 'Adhesivos' | 'Tanques' | 'Gas';
  unit: string;
  basePrice: number;
}

export interface BudgetItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
}

export interface ClientInfo {
  name: string;
  cuit: string;
  address: string;
  city: string; // Added city
  phone: string;
  budgetNumber: string;
  date: string;
  validityDays: number;
  condition: 'Monotributista' | 'Resp. Inscripto' | 'Consumidor Final'; // Fiscal condition
  notes: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
  category: string;
  critical?: boolean;
}

export enum AppTab {
  CALCULATOR = 'calculator',
  BUDGET = 'budget',
  CHECKLIST = 'checklist',
  GUIDES = 'guides'
}

export enum ChecklistMode {
  NEW_INSTALL = 'new_install',
  URGENT_REPAIR = 'urgent_repair'
}
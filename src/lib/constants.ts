import {
  LayoutDashboard,
  ListChecks,
  Package,
  Activity,
  BarChart3,
  Settings,
  type LucideIcon,
} from 'lucide-react';

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  segment: string | null;
};

export const NAV_ITEMS: NavItem[] = [
  {
    href: '/',
    label: 'Production View',
    icon: LayoutDashboard,
    segment: null, // For matching root path
  },
  {
    href: '/work-orders',
    label: 'Work Orders',
    icon: ListChecks,
    segment: 'work-orders',
  },
  {
    href: '/inventory',
    label: 'Inventory',
    icon: Package,
    segment: 'inventory',
  },
  {
    href: '/utilization',
    label: 'Utilization',
    icon: Activity,
    segment: 'utilization',
  },
  {
    href: '/analytics',
    label: 'KPI Analysis',
    icon: BarChart3,
    segment: 'analytics',
  },
  // Example: Add profile link if user is authenticated
  // This would typically be handled by auth context
  // {
  //   href: '/profile',
  //   label: 'Profile',
  //   icon: UserCircle, // You'd need to import UserCircle from lucide-react
  //   segment: 'profile',
  // },
];

export const APP_NAME = "Udyog Sahayak";

// User Roles
export type UserRole = 'Admin' | 'Supervisor' | 'Worker' | 'Client';
export const USER_ROLES: UserRole[] = ['Admin', 'Supervisor', 'Worker', 'Client'];


// Mock Data (expand as needed)
export const MOCK_PRODUCTION_LINES = [
  { id: 'L1', orderId: 'SOAP-001', productName: 'Mysore Sandal Soap (75g)', stage: 'Molding', statusPercent: 75, workers: 5 },
  { id: 'L2', orderId: 'SHMP-002', productName: 'Herbal Shampoo (200ml)', stage: 'Filling', statusPercent: 40, workers: 3 },
  { id: 'L3', orderId: 'SOAP-003', productName: 'Luxury Bath Soap (125g)', stage: 'Packaging', statusPercent: 90, workers: 4 },
];

export const MOCK_HOURLY_OUTPUT = [
  { time: '09:00-10:00', totalOutput: 1200, soapOutput: 800, shampooOutput: 400 },
  { time: '10:00-11:00', totalOutput: 1350, soapOutput: 900, shampooOutput: 450 },
];

export const MOCK_WORKER_ALLOCATION = [
  { id: 'W1', name: 'Ramesh Kumar', line: 'Soap Line 1', task: 'Mixing & Molding', shift: 'Morning' },
  { id: 'W2', name: 'Sita Devi', line: 'Shampoo Line 1', task: 'Bottle Filling', shift: 'Morning' },
  { id: 'W3', name: 'Arjun Singh', line: 'Packaging Area', task: 'Quality Check & Boxing', shift: 'Morning' },
];

export type WorkOrderStatus = 'New' | 'In Progress' | 'Quality Check' | 'Done' | 'Cancelled';
export const WORK_ORDER_STATUSES: WorkOrderStatus[] = ['New', 'In Progress', 'Quality Check', 'Done', 'Cancelled'];

export const MOCK_WORK_ORDERS = [
  { id: 'WO-001', productType: 'Mysore Sandal Soap (75g)', quantity: 5000, details: 'Standard batch for regular stock.', estimatedCompletion: '2024-08-15', status: 'In Progress' as WorkOrderStatus, assignedTo: 'Soap Team A' },
  { id: 'WO-002', productType: 'Herbal Shampoo (200ml)', quantity: 2000, details: 'Urgent order for client XYZ.', estimatedCompletion: '2024-08-10', status: 'New' as WorkOrderStatus, assignedTo: 'Shampoo Team B' },
  { id: 'WO-003', productType: 'Luxury Bath Soap (125g)', quantity: 1000, details: 'Export quality, special packaging.', estimatedCompletion: '2024-08-20', status: 'Quality Check' as WorkOrderStatus, assignedTo: 'Soap Team C' },
];

export const MOCK_RAW_MATERIALS = [
  { id: 'RM001', name: 'Sandalwood Oil', currentStock: 85, unit: 'Liters', reorderLevel: 50, category: 'Oils' },
  { id: 'RM002', name: 'Caustic Soda Flakes', currentStock: 1500, unit: 'Kg', reorderLevel: 1000, category: 'Chemicals' },
  { id: 'RM003', name: 'PET Bottles (200ml)', currentStock: 4500, unit: 'Units', reorderLevel: 5000, category: 'Packaging' },
  { id: 'RM004', name: 'Soap Wrappers', currentStock: 12000, unit: 'Units', reorderLevel: 10000, category: 'Packaging' },
];

export const MOCK_FINISHED_GOODS = [
  { id: 'FG001', name: 'Mysore Sandal Soap (75g)', quantity: 12500, status: 'Ready for Dispatch' },
  { id: 'FG002', name: 'Herbal Shampoo (200ml)', quantity: 3500, status: 'Awaiting QC' },
  { id: 'FG003', name: 'Luxury Bath Soap (125g)', quantity: 800, status: 'Ready for Dispatch' },
];

export const MOCK_SCRAP_WASTE = [
  { id: 'SW001', date: '2024-07-28', item: 'Damaged Soap Bars', quantity: 50, unit: 'Units', reason: 'Molding defect' },
  { id: 'SW002', date: '2024-07-27', item: 'Leaked Shampoo Bottles', quantity: 15, unit: 'Units', reason: 'Capping issue' },
];

export const MOCK_MACHINES = [
  { id: 'MC001', name: 'Soap Mixer Alpha', status: 'Running', currentTask: 'Mixing Batch #102', uptimePercent: 92, lastMaintenance: '2024-07-01' },
  { id: 'MC002', name: 'Shampoo Filler Z2', status: 'Idle', currentTask: '-', uptimePercent: 85, lastMaintenance: '2024-06-15' },
  { id: 'MC003', name: 'Packaging Conveyor P1', status: 'Downtime', currentTask: 'Maintenance', uptimePercent: 70, lastMaintenance: '2024-07-29' },
];

export const MOCK_LABOR = [
  { id: 'LB001', name: 'Sunita Sharma', shift: 'Morning', assignedTask: 'Soap Cutting', productivity: '180 units/hr', status: 'Active' },
  { id: 'LB002', name: 'Vikram Patel', shift: 'Morning', assignedTask: 'Shampoo Bottling', productivity: '120 units/hr', status: 'Active' },
  { id: 'LB003', name: 'Anil Chavan', shift: 'Afternoon', assignedTask: 'Machine Operator', productivity: 'N/A', status: 'Idle (Machine Down)' },
];

export const MOCK_KPIS = {
  onTimeDelivery: 92.5, // percentage
  wastageRate: 3.1, // percentage
  dailyOutputUnits: 11500,
  machineUtilization: 78, // percentage
  laborEfficiency: 89, // percentage
};

    
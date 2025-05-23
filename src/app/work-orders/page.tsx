
"use client";

import * as React from "react";
import { PlusCircle, Filter, Edit3, Trash2, MoreHorizontal, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MOCK_WORK_ORDERS, WORK_ORDER_STATUSES, type WorkOrderStatus } from '@/lib/mock-data';

type WorkOrder = typeof MOCK_WORK_ORDERS[0];

export default function WorkOrdersPage() {
  const [workOrders, setWorkOrders] = React.useState<WorkOrder[]>(MOCK_WORK_ORDERS);
  const [isFormDialogOpen, setIsFormDialogOpen] = React.useState(false);
  const [editingWorkOrder, setEditingWorkOrder] = React.useState<WorkOrder | null>(null);

  const [isViewDetailsDialogOpen, setIsViewDetailsDialogOpen] = React.useState(false);
  const [viewingWorkOrder, setViewingWorkOrder] = React.useState<WorkOrder | null>(null);

  // Form state for new/edit work order
  const [productType, setProductType] = React.useState('');
  const [quantity, setQuantity] = React.useState('');
  const [details, setDetails] = React.useState('');
  const [status, setStatus] = React.useState<WorkOrderStatus>('New');
  const [assignedTo, setAssignedTo] = React.useState('');


  const handleAddNewWorkOrder = () => {
    setEditingWorkOrder(null);
    // Reset form fields
    setProductType('');
    setQuantity('');
    setDetails('');
    setStatus('New');
    setAssignedTo('');
    setIsFormDialogOpen(true);
  };

  const handleEditWorkOrder = (order: WorkOrder) => {
    setEditingWorkOrder(order);
    setProductType(order.productType);
    setQuantity(order.quantity.toString());
    setDetails(order.details);
    setStatus(order.status);
    setAssignedTo(order.assignedTo);
    setIsFormDialogOpen(true);
  }

  const handleDeleteWorkOrder = (orderId: string) => {
    setWorkOrders(prev => prev.filter(wo => wo.id !== orderId));
  }

  const handleViewDetails = (order: WorkOrder) => {
    setViewingWorkOrder(order);
    setIsViewDetailsDialogOpen(true);
  };

  const handleSubmitWorkOrder = () => {
    if (!productType || !quantity) {
      alert("Product Type and Quantity are required.");
      return;
    }

    const newWorkOrderData = {
      productType,
      quantity: parseInt(quantity),
      details,
      status,
      assignedTo,
      estimatedCompletion: editingWorkOrder?.estimatedCompletion || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Mock completion: 7 days from now for new
    };

    if (editingWorkOrder) {
      setWorkOrders(prev => prev.map(wo => wo.id === editingWorkOrder.id ? { ...wo, ...newWorkOrderData } : wo));
    } else {
      setWorkOrders(prev => [{ id: `WO-${Date.now().toString().slice(-4)}`, ...newWorkOrderData }, ...prev]);
    }
    setIsFormDialogOpen(false);
  };
  
  const getStatusBadgeVariant = (status: WorkOrderStatus) => {
    switch (status) {
      case 'New': return 'outline';
      case 'In Progress': return 'default';
      case 'Quality Check': return 'secondary';
      case 'Done': return 'default'; 
      case 'Cancelled': return 'destructive';
      default: return 'outline';
    }
  };


  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Work Order Management</h1>
          <p className="text-muted-foreground">Create, assign, and track manufacturing work orders.</p>
        </div>
        <Button onClick={handleAddNewWorkOrder} size="sm">
          <PlusCircle className="mr-2 h-4 w-4" /> Create New Work Order
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Work Orders List</CardTitle>
          <CardDescription>Overview of all current and past work orders.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Product Type</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Est. Completion</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.productType}</TableCell>
                  <TableCell>{order.quantity.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={getStatusBadgeVariant(order.status)} 
                      className={
                        order.status === 'Done' ? 'bg-green-500 text-white hover:bg-green-600' : 
                        order.status === 'In Progress' ? 'bg-blue-500 text-white hover:bg-blue-600' : ''
                      }
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{order.assignedTo}</TableCell>
                  <TableCell>{order.estimatedCompletion}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleViewDetails(order)}>
                           <Eye className="mr-2 h-4 w-4" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditWorkOrder(order)}>
                          <Edit3 className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600 hover:!text-red-600 hover:!bg-red-100 dark:hover:!bg-red-900/50" onClick={() => handleDeleteWorkOrder(order.id)}>
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Form Dialog for Create/Edit Work Order */}
      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingWorkOrder ? 'Edit' : 'Create New'} Work Order</DialogTitle>
            <DialogDescription>
              {editingWorkOrder ? 'Update the details of the work order.' : 'Fill in the details to create a new work order.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="productType" className="text-right">Product Type</Label>
              <Input id="productType" value={productType} onChange={(e) => setProductType(e.target.value)} className="col-span-3" placeholder="e.g., Mysore Sandal Soap (75g)" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">Quantity</Label>
              <Input id="quantity" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="col-span-3" placeholder="e.g., 5000" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="details" className="text-right">Details/Notes</Label>
              <Textarea id="details" value={details} onChange={(e) => setDetails(e.target.value)} className="col-span-3" placeholder="Any specific instructions or notes." />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">Status</Label>
              <Select value={status} onValueChange={(value: WorkOrderStatus) => setStatus(value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {WORK_ORDER_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="assignedTo" className="text-right">Assigned To</Label>
              <Input id="assignedTo" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} className="col-span-3" placeholder="e.g., Soap Team A" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsFormDialogOpen(false)}>Cancel</Button>
            <Button type="submit" onClick={handleSubmitWorkOrder}>{editingWorkOrder ? 'Save Changes' : 'Create Order'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      {viewingWorkOrder && (
        <Dialog open={isViewDetailsDialogOpen} onOpenChange={setIsViewDetailsDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Work Order Details: {viewingWorkOrder.id}</DialogTitle>
              <DialogDescription>
                Complete information for the selected work order.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 text-sm">
              <div className="grid grid-cols-3 items-center gap-x-4 gap-y-2">
                <Label className="text-right font-semibold">Order ID:</Label>
                <span className="col-span-2">{viewingWorkOrder.id}</span>

                <Label className="text-right font-semibold">Product Type:</Label>
                <span className="col-span-2">{viewingWorkOrder.productType}</span>

                <Label className="text-right font-semibold">Quantity:</Label>
                <span className="col-span-2">{viewingWorkOrder.quantity.toLocaleString()} units</span>
                
                <Label className="text-right font-semibold">Status:</Label>
                <span className="col-span-2">
                    <Badge 
                      variant={getStatusBadgeVariant(viewingWorkOrder.status)} 
                      className={
                        viewingWorkOrder.status === 'Done' ? 'bg-green-500 text-white' : 
                        viewingWorkOrder.status === 'In Progress' ? 'bg-blue-500 text-white' : ''
                      }
                    >
                      {viewingWorkOrder.status}
                    </Badge>
                </span>

                <Label className="text-right font-semibold">Assigned To:</Label>
                <span className="col-span-2">{viewingWorkOrder.assignedTo}</span>

                <Label className="text-right font-semibold">Est. Completion:</Label>
                <span className="col-span-2">{viewingWorkOrder.estimatedCompletion}</span>
                
                <Label className="text-right font-semibold self-start pt-1">Details/Notes:</Label>
                <p className="col-span-2 bg-muted/50 p-2 rounded-md whitespace-pre-wrap">{viewingWorkOrder.details || "N/A"}</p>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsViewDetailsDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

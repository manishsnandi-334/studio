"use client";

import { PackageSearch, PackageCheck, ArchiveX, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { MOCK_RAW_MATERIALS, MOCK_FINISHED_GOODS, MOCK_SCRAP_WASTE } from '@/lib/mock-data';
import { Progress } from '@/components/ui/progress';

export default function InventoryPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Inventory Management</h1>
        <p className="text-muted-foreground">Track raw materials, finished goods, and waste/scrap.</p>
      </div>

      <Tabs defaultValue="raw-materials" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="raw-materials"><PackageSearch className="mr-2 h-4 w-4 inline-block" />Raw Materials</TabsTrigger>
          <TabsTrigger value="finished-goods"><PackageCheck className="mr-2 h-4 w-4 inline-block" />Finished Goods</TabsTrigger>
          <TabsTrigger value="scrap-waste"><ArchiveX className="mr-2 h-4 w-4 inline-block" />Scrap & Waste</TabsTrigger>
        </TabsList>

        <TabsContent value="raw-materials">
          <Card>
            <CardHeader>
              <CardTitle>Raw Materials Stock</CardTitle>
              <CardDescription>Current levels of raw materials and reorder alerts.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Current Stock</TableHead>
                    <TableHead className="text-right">Reorder Level</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead className="text-center">Status / Stock Level</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_RAW_MATERIALS.map((item) => {
                    const stockPercentage = (item.currentStock / (item.reorderLevel * 1.5)) * 100; // Assuming reorder level is 2/3 of max
                    const needsReorder = item.currentStock < item.reorderLevel;
                    return (
                    <TableRow key={item.id} className={needsReorder ? "bg-destructive/10" : ""}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell className="text-right">{item.currentStock.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{item.reorderLevel.toLocaleString()}</TableCell>
                      <TableCell>{item.unit}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex flex-col items-center">
                           <Progress value={Math.min(stockPercentage, 100)} className="h-2 w-24 mb-1" />
                          {needsReorder && (
                            <Badge variant="destructive" className="mt-1">
                              <AlertTriangle className="mr-1 h-3 w-3" /> Reorder
                            </Badge>
                          )}
                           {!needsReorder && item.currentStock <= item.reorderLevel * 1.2 && (
                            <Badge variant="outline" className="mt-1 border-yellow-500 text-yellow-600">
                               Low
                            </Badge>
                          )}
                           {!needsReorder && item.currentStock > item.reorderLevel * 1.2 && (
                            <Badge variant="outline" className="mt-1 border-green-500 text-green-600">
                               Good
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">Details</Button>
                      </TableCell>
                    </TableRow>
                  )})}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="finished-goods">
          <Card>
            <CardHeader>
              <CardTitle>Finished Goods Inventory</CardTitle>
              <CardDescription>Stock of products ready for dispatch or awaiting quality control.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_FINISHED_GOODS.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-right">{item.quantity.toLocaleString()} units</TableCell>
                      <TableCell>
                        <Badge variant={item.status === 'Ready for Dispatch' ? 'default' : 'secondary'} className={item.status === 'Ready for Dispatch' ? 'bg-green-500 text-white' : ''}>
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">Manage</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scrap-waste">
          <Card>
            <CardHeader>
              <CardTitle>Scrap & Waste Log</CardTitle>
              <CardDescription>Records of materials and products logged as scrap or waste.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Item/Product</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_SCRAP_WASTE.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.date}</TableCell>
                      <TableCell className="font-medium">{item.item}</TableCell>
                      <TableCell className="text-right">{item.quantity.toLocaleString()}</TableCell>
                      <TableCell>{item.unit}</TableCell>
                      <TableCell>{item.reason}</TableCell>
                       <TableCell className="text-right">
                        <Button variant="outline" size="sm">View Log</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

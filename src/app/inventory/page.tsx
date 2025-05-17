
"use client";

import * as React from 'react';
import { useEffect, useRef } from 'react';
import { PackageSearch, PackageCheck, ArchiveX, AlertTriangle, Eye, QrCode, VideoOff, ScanLine } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { MOCK_RAW_MATERIALS, MOCK_FINISHED_GOODS, MOCK_SCRAP_WASTE, type WorkOrderStatus } from '@/lib/mock-data';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from "@/hooks/use-toast";
// import { Html5QrcodeScanner } from 'html5-qrcode'; // Import if full QR scanning is implemented

type RawMaterial = typeof MOCK_RAW_MATERIALS[0];
type FinishedGood = typeof MOCK_FINISHED_GOODS[0];
type ScrapWaste = typeof MOCK_SCRAP_WASTE[0];

export default function InventoryPage() {
  const { toast } = useToast();
  const [selectedRawMaterial, setSelectedRawMaterial] = React.useState<RawMaterial | null>(null);
  const [isRawMaterialDialogOpen, setIsRawMaterialDialogOpen] = React.useState(false);

  const [selectedFinishedGood, setSelectedFinishedGood] = React.useState<FinishedGood | null>(null);
  const [isFinishedGoodDialogOpen, setIsFinishedGoodDialogOpen] = React.useState(false);

  const [selectedScrapWaste, setSelectedScrapWaste] = React.useState<ScrapWaste | null>(null);
  const [isScrapWasteDialogOpen, setIsScrapWasteDialogOpen] = React.useState(false);

  const [isQrScannerOpen, setIsQrScannerOpen] = React.useState(false);
  const [qrScannerMode, setQrScannerMode] = React.useState<'entry' | 'dispatch' | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = React.useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  // const qrScannerRef = useRef<Html5QrcodeScanner | null>(null); // For full QR scanner

  useEffect(() => {
    if (isQrScannerOpen) {
      const getCameraPermission = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
          setHasCameraPermission(true);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          // Placeholder: Initialize actual QR scanner here if using a library
          // For example, if using html5-qrcode:
          // if (!qrScannerRef.current) {
          //   const scanner = new Html5QrcodeScanner(
          //     "qr-reader", 
          //     { fps: 10, qrbox: {width: 250, height: 250} }, 
          //     false
          //   );
          //   scanner.render(onScanSuccess, onScanFailure);
          //   qrScannerRef.current = scanner;
          // }
        } catch (error) {
          console.error('Error accessing camera:', error);
          setHasCameraPermission(false);
          toast({
            variant: 'destructive',
            title: 'Camera Access Denied',
            description: 'Please enable camera permissions in your browser settings to use QR scanning.',
          });
        }
      };
      getCameraPermission();
    } else {
      // Cleanup camera stream when dialog closes
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
      // if (qrScannerRef.current) {
      //   qrScannerRef.current.clear().catch(error => console.error("Failed to clear QR scanner", error));
      //   qrScannerRef.current = null;
      // }
      setHasCameraPermission(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isQrScannerOpen]);

  // const onScanSuccess = (decodedText: string, decodedResult: any) => {
  //   console.log(`Code matched = ${decodedText}`, decodedResult);
  //   toast({ title: "QR Code Scanned!", description: `Data: ${decodedText} (Mode: ${qrScannerMode})`});
  //   // Here you would handle the scanned data, e.g., find item, prefill form
  //   setIsQrScannerOpen(false); 
  // };

  // const onScanFailure = (error: any) => {
  //   // console.warn(`Code scan error = ${error}`);
  //   // Don't toast on every failure, could be annoying.
  // };


  const handleViewRawMaterialDetails = (item: RawMaterial) => {
    setSelectedRawMaterial(item);
    setIsRawMaterialDialogOpen(true);
  };

  const handleManageFinishedGood = (item: FinishedGood) => {
    setSelectedFinishedGood(item);
    setIsFinishedGoodDialogOpen(true);
  };

  const handleViewScrapWasteLog = (item: ScrapWaste) => {
    setSelectedScrapWaste(item);
    setIsScrapWasteDialogOpen(true);
  };

  const openQrScanner = (mode: 'entry' | 'dispatch') => {
    setQrScannerMode(mode);
    setIsQrScannerOpen(true);
  };
  

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Inventory Management</h1>
          <p className="text-muted-foreground">Track raw materials, finished goods, and waste/scrap.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => openQrScanner('entry')} variant="outline">
            <QrCode className="mr-2 h-4 w-4" /> Scan Raw Material Entry
          </Button>
          <Button onClick={() => openQrScanner('dispatch')} variant="outline">
            <ScanLine className="mr-2 h-4 w-4" /> Scan Dispatch Log
          </Button>
        </div>
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
                    const stockPercentage = (item.currentStock / (item.reorderLevel * 1.5)) * 100; 
                    const needsReorder = item.currentStock < item.reorderLevel;
                    return (
                    <TableRow key={item.id} className={needsReorder ? "bg-destructive/10 hover:bg-destructive/20" : ""}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell className="text-right">{item.currentStock.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{item.reorderLevel.toLocaleString()}</TableCell>
                      <TableCell>{item.unit}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex flex-col items-center">
                           <Progress value={Math.min(stockPercentage, 100)} className="h-2 w-24 mb-1" indicatorClassName={needsReorder ? "bg-destructive" : stockPercentage < 30 ? "bg-yellow-500" : "bg-primary"}/>
                          {needsReorder && (
                            <Badge variant="destructive" className="mt-1">
                              <AlertTriangle className="mr-1 h-3 w-3" /> Reorder
                            </Badge>
                          )}
                           {!needsReorder && item.currentStock <= item.reorderLevel * 1.2 && (
                            <Badge variant="outline" className="mt-1 border-yellow-500 text-yellow-600 dark:border-yellow-400 dark:text-yellow-400">
                               Low
                            </Badge>
                          )}
                           {!needsReorder && item.currentStock > item.reorderLevel * 1.2 && (
                            <Badge variant="outline" className="mt-1 border-green-600 text-green-700 dark:border-green-500 dark:text-green-500">
                               Good
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleViewRawMaterialDetails(item)} className="hover:bg-accent/50">
                          <Eye className="mr-2 h-4 w-4" /> Details
                        </Button>
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
                        <Badge variant={item.status === 'Ready for Dispatch' ? 'default' : 'secondary'} className={item.status === 'Ready for Dispatch' ? 'bg-green-600 text-primary-foreground hover:bg-green-700' : item.status === 'Awaiting QC' ? 'bg-yellow-500 text-primary-foreground hover:bg-yellow-600' : ''}>
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleManageFinishedGood(item)} className="hover:bg-accent/50">Manage</Button>
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
                        <Button variant="ghost" size="sm" onClick={() => handleViewScrapWasteLog(item)} className="hover:bg-accent/50">
                          <Eye className="mr-2 h-4 w-4" /> View Log
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* QR Scanner Dialog */}
      <Dialog open={isQrScannerOpen} onOpenChange={setIsQrScannerOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <QrCode className="text-primary" /> QR Code Scanner
            </DialogTitle>
            <DialogDescription>
              {qrScannerMode === 'entry' ? 'Scan QR code for raw material entry.' : 'Scan QR code for dispatch logging.'}
              Point your camera at a QR code.
            </DialogDescription>
          </DialogHeader>
          <div className="my-4 relative aspect-video bg-muted rounded-md overflow-hidden flex items-center justify-center">
             <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
            {hasCameraPermission === false && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 p-4 text-center">
                <VideoOff className="h-12 w-12 text-destructive mb-2" />
                <p className="font-semibold">Camera Access Denied</p>
                <p className="text-sm text-muted-foreground">Please enable camera permissions in your browser settings.</p>
              </div>
            )}
            {hasCameraPermission === null && (
               <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 p-4 text-center">
                <p>Requesting camera access...</p>
              </div>
            )}
             {hasCameraPermission === true && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-3/4 max-w-[250px] aspect-square border-4 border-primary/70 rounded-lg animate-pulse shadow-lg"></div>
                </div>
            )}
            {/* Placeholder for actual QR reader UI element, e.g. <div id="qr-reader" className="w-full"></div> */}
          </div>
           {hasCameraPermission === false && (
             <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Camera Access Required</AlertTitle>
                <AlertDescription>
                  QR scanning requires camera access. Please update your browser permissions.
                </AlertDescription>
              </Alert>
           )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsQrScannerOpen(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      {/* Raw Material Details Dialog */}
      {selectedRawMaterial && (
        <Dialog open={isRawMaterialDialogOpen} onOpenChange={setIsRawMaterialDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Raw Material Details: {selectedRawMaterial.name}</DialogTitle>
              <DialogDescription>
                Detailed information about the selected raw material.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 items-center gap-4">
                <Label>Item ID:</Label>
                <span>{selectedRawMaterial.id}</span>
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <Label>Category:</Label>
                <span>{selectedRawMaterial.category}</span>
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <Label>Current Stock:</Label>
                <span>{selectedRawMaterial.currentStock.toLocaleString()} {selectedRawMaterial.unit}</span>
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <Label>Reorder Level:</Label>
                <span>{selectedRawMaterial.reorderLevel.toLocaleString()} {selectedRawMaterial.unit}</span>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsRawMaterialDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Finished Good Manage Dialog */}
      {selectedFinishedGood && (
        <Dialog open={isFinishedGoodDialogOpen} onOpenChange={setIsFinishedGoodDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Manage Finished Good: {selectedFinishedGood.name}</DialogTitle>
              <DialogDescription>
                View and manage details for the selected finished good.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 items-center gap-4">
                <Label>Product ID:</Label>
                <span>{selectedFinishedGood.id}</span>
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <Label>Quantity:</Label>
                <span>{selectedFinishedGood.quantity.toLocaleString()} units</span>
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <Label>Status:</Label>
                <Badge variant={selectedFinishedGood.status === 'Ready for Dispatch' ? 'default' : 'secondary'} className={selectedFinishedGood.status === 'Ready for Dispatch' ? 'bg-green-600 text-primary-foreground' : selectedFinishedGood.status === 'Awaiting QC' ? 'bg-yellow-500 text-primary-foreground' : ''}>
                  {selectedFinishedGood.status}
                </Badge>
              </div>
              {/* Add more fields for management if needed */}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsFinishedGoodDialogOpen(false)}>Close</Button>
              {/* <Button type="button">Save Changes</Button> */}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Scrap & Waste Log Dialog */}
      {selectedScrapWaste && (
        <Dialog open={isScrapWasteDialogOpen} onOpenChange={setIsScrapWasteDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Scrap/Waste Log: {selectedScrapWaste.item}</DialogTitle>
              <DialogDescription>
                Detailed log for the selected scrap or waste item.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 items-center gap-4">
                <Label>Log ID:</Label>
                <span>{selectedScrapWaste.id}</span>
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <Label>Date:</Label>
                <span>{selectedScrapWaste.date}</span>
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <Label>Quantity:</Label>
                <span>{selectedScrapWaste.quantity.toLocaleString()} {selectedScrapWaste.unit}</span>
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <Label>Reason:</Label>
                <span className="col-span-2">{selectedScrapWaste.reason}</span>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsScrapWasteDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

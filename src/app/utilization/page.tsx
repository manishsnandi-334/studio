
"use client";

import * as React from 'react';
import { SlidersHorizontal, Users, AlertCircle, CheckCircle2, PauseCircle, ListPlus, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MOCK_MACHINES, MOCK_LABOR, DOWNTIME_REASONS, type Machine, type DowntimeLog } from '@/lib/mock-data';
import { DataCard } from '@/components/ui/data-card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from 'date-fns';
import { useToast } from "@/hooks/use-toast";


export default function UtilizationPage() {
  const { toast } = useToast();
  const [machines, setMachines] = React.useState<Machine[]>(MOCK_MACHINES);
  const [isDowntimeLogDialogOpen, setIsDowntimeLogDialogOpen] = React.useState(false);
  const [selectedMachineForDowntime, setSelectedMachineForDowntime] = React.useState<Machine | null>(null);
  
  const [downtimeReason, setDowntimeReason] = React.useState('');
  const [downtimeNotes, setDowntimeNotes] = React.useState('');
  const [downtimeStartTime, setDowntimeStartTime] = React.useState('');

  const [isViewDowntimeLogsOpen, setIsViewDowntimeLogsOpen] = React.useState(false);
  const [viewingDowntimeMachine, setViewingDowntimeMachine] = React.useState<Machine | null>(null);


  const overallMachineUptime = machines.reduce((acc, m) => acc + m.uptimePercent, 0) / machines.length;
  const activeLaborCount = MOCK_LABOR.filter(l => l.status === 'Active').length;

  const getMachineStatusIcon = (status: Machine['status']) => {
    if (status === 'Running') return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    if (status === 'Idle') return <PauseCircle className="h-5 w-5 text-yellow-500" />;
    if (status === 'Downtime') return <AlertCircle className="h-5 w-5 text-red-500" />;
    return null;
  };
  
  const getLaborStatusBadge = (status: string) => {
    if (status === 'Active') return <Badge variant="default" className="bg-green-600 text-primary-foreground hover:bg-green-700">Active</Badge>;
    if (status === 'Idle (Machine Down)') return <Badge variant="destructive">Idle (Machine Down)</Badge>;
    if (status === 'Break') return <Badge variant="secondary" className="bg-yellow-500 text-primary-foreground hover:bg-yellow-600">On Break</Badge>;
    return <Badge variant="outline">{status}</Badge>;
  };

  const handleOpenDowntimeLogForm = (machine: Machine) => {
    setSelectedMachineForDowntime(machine);
    setDowntimeReason('');
    setDowntimeNotes('');
    setDowntimeStartTime(format(new Date(), "yyyy-MM-dd'T'HH:mm"));
    setIsDowntimeLogDialogOpen(true);
  };

  const handleViewDowntimeLogs = (machine: Machine) => {
    setViewingDowntimeMachine(machine);
    setIsViewDowntimeLogsOpen(true);
  };

  const handleSubmitDowntimeLog = () => {
    if (!selectedMachineForDowntime || !downtimeReason || !downtimeStartTime) {
      toast({
        title: "Missing Information",
        description: "Please fill in reason and start time for the downtime log.",
        variant: "destructive",
      });
      return;
    }

    const newLog: DowntimeLog = {
      id: `DT-${Date.now().toString().slice(-5)}`,
      reason: downtimeReason,
      notes: downtimeNotes,
      startTime: format(new Date(downtimeStartTime), "yyyy-MM-dd HH:mm"),
    };

    setMachines(prevMachines => 
      prevMachines.map(m => 
        m.id === selectedMachineForDowntime.id 
        ? { ...m, downtimeLogs: [...(m.downtimeLogs || []), newLog] } 
        : m
      )
    );
    
    toast({
      title: "Downtime Logged",
      description: `Reason: ${downtimeReason} for machine ${selectedMachineForDowntime.name}.`,
    });
    setIsDowntimeLogDialogOpen(false);
  };


  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2">
         <DataCard
          title="Overall Machine Uptime"
          icon={SlidersHorizontal}
          value={`${overallMachineUptime.toFixed(1)}%`}
          description="Average across all machines"
        >
          <Progress value={overallMachineUptime} className="mt-2 h-2" indicatorClassName={overallMachineUptime < 80 ? "bg-yellow-500" : "bg-primary"} />
        </DataCard>
        <DataCard
          title="Active Labor Force"
          icon={Users}
          value={activeLaborCount}
          description={`${MOCK_LABOR.length - activeLaborCount} currently idle or on break`}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Machine Utilization</CardTitle>
          <CardDescription>Live status and performance of production machinery. Log downtime causes.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Machine ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Current Task/Order</TableHead>
                <TableHead className="text-right">Uptime (%)</TableHead>
                <TableHead>Last Maintenance</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {machines.map((machine) => (
                <TableRow key={machine.id} className={machine.status === 'Downtime' ? "bg-destructive/10 hover:bg-destructive/20" : ""}>
                  <TableCell className="font-medium">{machine.id}</TableCell>
                  <TableCell>{machine.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getMachineStatusIcon(machine.status)}
                      <span>{machine.status}</span>
                    </div>
                  </TableCell>
                  <TableCell>{machine.currentTask}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span>{machine.uptimePercent}%</span>
                      <Progress value={machine.uptimePercent} className="h-1.5 w-16" indicatorClassName={machine.uptimePercent < 75 ? "bg-red-500" : machine.uptimePercent < 90 ? "bg-yellow-500" : "bg-primary"} />
                    </div>
                  </TableCell>
                  <TableCell>{machine.lastMaintenance}</TableCell>
                  <TableCell className="text-center space-x-1">
                    {machine.status === 'Downtime' && (
                      <Button variant="outline" size="sm" onClick={() => handleOpenDowntimeLogForm(machine)} className="border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive">
                        <ListPlus className="mr-1 h-4 w-4" /> Log Cause
                      </Button>
                    )}
                    {(machine.downtimeLogs && machine.downtimeLogs.length > 0) && (
                       <Button variant="ghost" size="sm" onClick={() => handleViewDowntimeLogs(machine)} className="hover:bg-accent/50">
                        <FileText className="mr-1 h-4 w-4" /> View Logs
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Labor Utilization</CardTitle>
          <CardDescription>Worker shifts, productivity, and current status.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Worker ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Shift</TableHead>
                <TableHead>Assigned Task/Line</TableHead>
                <TableHead>Productivity</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_LABOR.map((labor) => (
                <TableRow key={labor.id}>
                  <TableCell className="font-medium">{labor.id}</TableCell>
                  <TableCell>{labor.name}</TableCell>
                  <TableCell>{labor.shift}</TableCell>
                  <TableCell>{labor.assignedTask}</TableCell>
                  <TableCell>{labor.productivity}</TableCell>
                  <TableCell>{getLaborStatusBadge(labor.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {MOCK_LABOR.some(l => l.status === 'Idle (Machine Down)') && (
             <div className="mt-4 p-3 border border-yellow-400 bg-yellow-50 dark:bg-yellow-900/30 rounded-md text-yellow-700 dark:text-yellow-300 flex items-center gap-2 text-sm">
                <AlertCircle className="h-5 w-5" />
                <span>Attention: Some workers are idle due to machine downtime. Review machine status.</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Downtime Log Dialog */}
      <Dialog open={isDowntimeLogDialogOpen} onOpenChange={setIsDowntimeLogDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Log Downtime: {selectedMachineForDowntime?.name}</DialogTitle>
            <DialogDescription>
              Record the reason and details for the machine downtime.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="downtimeStartTime" className="text-right">Start Time</Label>
              <Input 
                id="downtimeStartTime" 
                type="datetime-local" 
                value={downtimeStartTime} 
                onChange={(e) => setDowntimeStartTime(e.target.value)} 
                className="col-span-3" 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="downtimeReason" className="text-right">Reason</Label>
              <Select value={downtimeReason} onValueChange={(value) => setDowntimeReason(value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select downtime reason" />
                </SelectTrigger>
                <SelectContent>
                  {DOWNTIME_REASONS.map(reason => (
                    <SelectItem key={reason} value={reason}>{reason}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="downtimeNotes" className="text-right pt-2">Notes</Label>
              <Textarea 
                id="downtimeNotes" 
                value={downtimeNotes} 
                onChange={(e) => setDowntimeNotes(e.target.value)} 
                className="col-span-3 min-h-[80px]" 
                placeholder="Optional: add any relevant notes or observations."
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDowntimeLogDialogOpen(false)}>Cancel</Button>
            <Button type="submit" onClick={handleSubmitDowntimeLog} className="bg-primary hover:bg-primary/90">Log Downtime</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Downtime Logs Dialog */}
      {viewingDowntimeMachine && (
        <Dialog open={isViewDowntimeLogsOpen} onOpenChange={setIsViewDowntimeLogsOpen}>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>Downtime Logs: {viewingDowntimeMachine.name}</DialogTitle>
              <DialogDescription>
                Recorded downtime incidents for this machine.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 max-h-[60vh] overflow-y-auto">
              {(!viewingDowntimeMachine.downtimeLogs || viewingDowntimeMachine.downtimeLogs.length === 0) ? (
                <p className="text-muted-foreground text-center">No downtime logs recorded for this machine yet.</p>
              ) : (
                <div className="space-y-4">
                  {viewingDowntimeMachine.downtimeLogs.map(log => (
                    <Card key={log.id} className="bg-muted/50">
                      <CardContent className="p-4 space-y-1 text-sm">
                        <p><strong>Reason:</strong> {log.reason}</p>
                        <p><strong>Start Time:</strong> {log.startTime}</p>
                        {log.endTime && <p><strong>End Time:</strong> {log.endTime}</p>}
                        {log.notes && <p><strong>Notes:</strong> {log.notes}</p>}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsViewDowntimeLogsOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

    </div>
  );
}

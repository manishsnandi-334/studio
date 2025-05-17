import { SlidersHorizontal, Users, AlertCircle, CheckCircle2, PauseCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MOCK_MACHINES, MOCK_LABOR } from '@/lib/mock-data';
import { DataCard } from '@/components/ui/data-card';


export default function UtilizationPage() {
  const overallMachineUptime = MOCK_MACHINES.reduce((acc, m) => acc + m.uptimePercent, 0) / MOCK_MACHINES.length;
  const activeLaborCount = MOCK_LABOR.filter(l => l.status === 'Active').length;

  const getMachineStatusIcon = (status: string) => {
    if (status === 'Running') return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    if (status === 'Idle') return <PauseCircle className="h-4 w-4 text-yellow-500" />;
    if (status === 'Downtime') return <AlertCircle className="h-4 w-4 text-red-500" />;
    return null;
  };
  
  const getLaborStatusBadge = (status: string) => {
    if (status === 'Active') return <Badge variant="default" className="bg-green-500 text-white">Active</Badge>;
    if (status === 'Idle (Machine Down)') return <Badge variant="destructive">Idle (Machine Down)</Badge>;
    if (status === 'Break') return <Badge variant="secondary">On Break</Badge>;
    return <Badge variant="outline">{status}</Badge>;
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
          <Progress value={overallMachineUptime} className="mt-2 h-2" />
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
          <CardDescription>Live status and performance of production machinery.</CardDescription>
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_MACHINES.map((machine) => (
                <TableRow key={machine.id}>
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
                      <Progress value={machine.uptimePercent} className="h-1.5 w-16" />
                    </div>
                  </TableCell>
                  <TableCell>{machine.lastMaintenance}</TableCell>
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
          {/* Consider adding alerts for overloading or idle assets if data supports it */}
          {MOCK_LABOR.some(l => l.status === 'Idle (Machine Down)') && (
             <div className="mt-4 p-3 border border-yellow-300 bg-yellow-50 rounded-md text-yellow-700 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                <span>Attention: Some workers are idle due to machine downtime. Review machine status.</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

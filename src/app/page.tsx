import { LayoutDashboard, TrendingUp, Users, PackageCheck, AlertTriangle, Factory } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MOCK_PRODUCTION_LINES, MOCK_HOURLY_OUTPUT, MOCK_WORKER_ALLOCATION } from '@/lib/mock-data';
import { DataCard } from '@/components/ui/data-card'; // Assuming DataCard is a reusable component

export default function ProductionPage() {
  const totalOutputToday = MOCK_HOURLY_OUTPUT.reduce((sum, item) => sum + item.totalOutput, 0);
  const totalActiveWorkers = MOCK_WORKER_ALLOCATION.length; // Simplified

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DataCard
          title="Total Output Today"
          value={`${totalOutputToday.toLocaleString()} units`}
          description="Across all production lines"
          icon={PackageCheck}
        />
        <DataCard
          title="Active Production Lines"
          value={MOCK_PRODUCTION_LINES.length}
          description={`${MOCK_PRODUCTION_LINES.filter(line => line.statusPercent < 100 && line.statusPercent > 0).length} in progress`}
          icon={Factory}
        />
        <DataCard
          title="Active Workers"
          value={totalActiveWorkers}
          description="Currently on shift"
          icon={Users}
        />
        <DataCard
          title="Efficiency Target"
          value="95%"
          description="Target vs Actual: 92%"
          icon={TrendingUp}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Production Line Status</CardTitle>
            <CardDescription>Live overview of ongoing production orders and their progress.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {MOCK_PRODUCTION_LINES.map((line) => (
                <div key={line.id} className="p-4 border rounded-lg shadow-sm bg-card">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">{line.productName}</h3>
                      <p className="text-sm text-muted-foreground">Order ID: {line.orderId} (Line {line.id})</p>
                    </div>
                    <Badge variant={line.statusPercent === 100 ? "default" : "secondary"} className={line.statusPercent === 100 ? "bg-green-500 text-white" : ""}>
                      {line.stage}
                    </Badge>
                  </div>
                  <Progress value={line.statusPercent} className="w-full h-3 mb-1" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{line.statusPercent}% Complete</span>
                    <span>{line.workers} Workers Assigned</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Hourly Output</CardTitle>
            <CardDescription>Production volume per hour across product types.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time Slot</TableHead>
                  <TableHead className="text-right">Soap Units</TableHead>
                  <TableHead className="text-right">Shampoo Units</TableHead>
                  <TableHead className="text-right">Total Units</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_HOURLY_OUTPUT.map((hour) => (
                  <TableRow key={hour.time}>
                    <TableCell>{hour.time}</TableCell>
                    <TableCell className="text-right">{hour.soapOutput.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{hour.shampooOutput.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-medium">{hour.totalOutput.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Worker Allocation</CardTitle>
            <CardDescription>Current assignments and tasks for on-shift workers.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Worker Name</TableHead>
                  <TableHead>Assigned Line</TableHead>
                  <TableHead>Task</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_WORKER_ALLOCATION.map((worker) => (
                  <TableRow key={worker.id}>
                    <TableCell>{worker.name}</TableCell>
                    <TableCell>{worker.line}</TableCell>
                    <TableCell>{worker.task}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

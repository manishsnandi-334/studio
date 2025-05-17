import type { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { ReactNode } from 'react';

interface DataCardProps {
  title: string;
  value?: string | number | ReactNode;
  description?: string | ReactNode;
  icon?: LucideIcon;
  children?: ReactNode;
  className?: string;
  footer?: ReactNode;
}

export function DataCard({ title, value, description, icon: Icon, children, className, footer }: DataCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        {value && <div className="text-2xl font-bold">{value}</div>}
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
        {children}
      </CardContent>
      {footer && <div className="p-6 pt-0">{footer}</div>}
    </Card>
  );
}

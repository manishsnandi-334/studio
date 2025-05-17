
"use client";

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input'; // For display, styled as readonly
import { Badge } from '@/components/ui/badge';
import { LogOut, UserCircle, Edit, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { UserRole } from '@/lib/constants'; // Assuming roles are defined here
import { APP_NAME } from '@/lib/constants';

// Mock user data - replace with actual data from your auth context
interface MockUser {
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

const mockUser: MockUser = {
  name: "Sanjay Kumar",
  email: "sanjay.k@example.com",
  role: "Supervisor",
  avatarUrl: "https://placehold.co/100x100.png", // Replace with actual avatar or placeholder
};


export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = React.useState<MockUser>(mockUser); // In real app, fetch user data
  const [isEditing, setIsEditing] = React.useState(false);
  const [editName, setEditName] = React.useState(user.name);

  // In a real app, this would come from an auth context/hook
  // const { user, logout } = useAuth(); 
  // if (!user) {
  //   router.push('/login'); // Protect this route
  //   return null;
  // }

  const handleLogout = async () => {
    // Simulate logout
    await new Promise(resolve => setTimeout(resolve, 500));
    // await logout(); // Call actual logout function
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    router.push('/login');
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes (mock)
      setUser(prev => ({ ...prev, name: editName }));
      toast({ title: "Profile Updated", description: "Your name has been updated." });
    } else {
      setEditName(user.name);
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className="container mx-auto max-w-2xl py-8 px-4">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4">
            <Avatar className="h-24 w-24 ring-2 ring-primary ring-offset-2" data-ai-hint="person avatar">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback>
                <UserCircle className="h-16 w-16 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center sm:text-left">
              <CardTitle className="text-3xl">{APP_NAME} User Profile</CardTitle>
              <CardDescription>Manage your personal information and settings.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            {isEditing ? (
              <Input 
                id="name" 
                value={editName} 
                onChange={(e) => setEditName(e.target.value)} 
                className="text-base"
              />
            ) : (
              <Input id="name" value={user.name} readOnly className="text-base border-transparent bg-muted/30 cursor-default focus-visible:ring-0 focus-visible:ring-offset-0" />
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" value={user.email} readOnly className="text-base border-transparent bg-muted/30 cursor-default focus-visible:ring-0 focus-visible:ring-offset-0" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <div>
              <Badge variant="secondary" className="text-base px-3 py-1">{user.role}</Badge>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button onClick={handleEditToggle} variant="outline" className="w-full sm:w-auto">
              {isEditing ? (
                <>
                  <Save className="mr-2 h-4 w-4" /> Save Changes
                </>
              ) : (
                <>
                  <Edit className="mr-2 h-4 w-4" /> Edit Profile
                </>
              )}
            </Button>
            <Button onClick={handleLogout} variant="destructive" className="w-full sm:w-auto">
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

    
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

interface AddAdminFormProps {
  onSubmit?: (formData: FormData) => void;
  onCancel?: () => void;
}

export default function AddAdminForm({ onSubmit, onCancel }: AddAdminFormProps) {
  const [role, setRole] = useState("ADMIN");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Ensure role is included in formData
    formData.set('role', role);
    
    onSubmit?.(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="Enter Name"
          className="bg-white h-11"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Enter Email"
          className="bg-white h-11"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="text"
          placeholder="Enter Password"
          className="bg-white h-11"
          required
          minLength={6}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Select value={role} onValueChange={setRole} >
          <SelectTrigger className="bg-white h-11 w-full">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ADMIN">ADMIN</SelectItem>            
          </SelectContent>
        </Select>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          size="lg"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          size="lg"
          className="bg-purple-600 hover:bg-purple-700"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add Admin
        </Button>
      </div>
    </form>
  );
}
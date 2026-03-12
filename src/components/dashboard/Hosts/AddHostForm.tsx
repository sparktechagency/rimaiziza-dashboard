import { UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { imageUrl } from "../../../redux/base/baseAPI";
import { useCreateHostMutation, useUpdateHostMutation } from "../../../redux/features/host/hostApi";
import { SingleImageUpload } from "../../Shared/SingleImageUpload";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";

interface AddHostFormProps {
  onCancel?: () => void;
  data?: any;
  open?: boolean;
}

interface FormFields {
  name: string;
  email: string;
  password: string;
  status: string;
}

const defaultFields: FormFields = {
  name: "",
  email: "",
  password: "",
  status: "ACTIVE",
};

export default function AddHostForm({ onCancel, data, open }: AddHostFormProps) {
  if (!open) return null;

  const isEditMode = !!data?._id;

  const [fields, setFields] = useState<FormFields>(defaultFields);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [existProfileImage, setExistProfileImage] = useState("");
  const [existCoverImage, setExistCoverImage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [createHost] = useCreateHostMutation();
  const [updateHost] = useUpdateHostMutation();

  // Populate form when editing
  useEffect(() => {
    if (data) {
      setFields({
        name: data.name || "",
        email: data.email || "",
        password: "", // never pre-fill password hash
        status: data.status || "ACTIVE",
      });
      if (data.profileImage) setExistProfileImage(data.profileImage);
      if (data.coverImage) setExistCoverImage(data.coverImage);
    }
  }, [data]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();

    const payload: Record<string, any> = {
      name: fields.name,
      email: fields.email,
      status: fields.status,
      role: "HOST",
    };

    // Only include password on create, or if user typed a new one in edit mode
    if (!isEditMode || fields.password) {
      payload.password = fields.password;
    }

    formData.append("data", JSON.stringify(payload));

    if (profileImage) formData.append("profileImage", profileImage);
    if (coverImage) formData.append("coverImage", coverImage);

    try {
      let response;
      if (isEditMode) {
        response = await updateHost({ id: data._id, formData })?.unwrap();
      } else {
        response = await createHost(payload)?.unwrap();
      }

      if (response?.success) {
        toast.success(response?.message);
        onCancel?.();
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      <div>
        <h3 className="text-sm font-semibold text-gray-800 uppercase mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 col-span-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Mr. John Doe"
              value={fields.name}
              onChange={handleChange}
              className="bg-white h-11"
              required
            />
          </div>

        </div>
      </div>

      {/* Account Credentials */}
      <div>
        <h3 className="text-sm font-semibold text-gray-800 uppercase mb-4">Account Credentials</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="host@example.com"
              value={fields.email}
              onChange={handleChange}
              className="bg-white h-11"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              {isEditMode ? "New Password (leave blank to keep current)" : "Password"}
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder={isEditMode ? "Enter new password" : "Enter password"}
                value={fields.password}
                onChange={handleChange}
                className="bg-white h-11 pr-20"
                required={!isEditMode}
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-indigo-600 hover:text-indigo-800 font-medium"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-6 border-t">
        <Button
          type="button"
          variant="secondary"
          size="lg"
          className="text-gray-700 bg-transparent border-2! border-gray-200! hover:bg-gray-50"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit" size="lg">
          <UserPlus className="w-4 h-4 mr-2" />
          {isEditMode ? "Update Host" : "Add Host"}
        </Button>
      </div>
    </form>
  );
}
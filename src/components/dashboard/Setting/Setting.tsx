// pages/settings/SettingsPage.tsx
import { DollarSign, Eye, EyeOff, FileText, Globe, Loader2, Save, Shield } from "lucide-react";
import { useState } from "react";
import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import CommissionManage from "./CommissionManage";
import PersonnalInformation from "./PersonnalInformation";
import PrivacyPolicy from "./PrivacyPolicy";
import TermsCondition from "./TermsCondition";
import AboutUs from "./AboutUs";
import { useChangePasswordMutation } from "../../../redux/features/auth/authApi";
import { toast } from "sonner";

const TABS = [
    { value: "general", label: "Information", icon: Globe, animate: "fade-up-right", delay: 100 },
    { value: "pricing", label: "Commission", icon: DollarSign, animate: "fade-up-right", delay: 200 },
    { value: "security", label: "Security", icon: Shield, animate: "fade-up-right", delay: 300 },
    { value: "about", label: "About Us", icon: FileText, animate: "fade-up-right", delay: 400 },
    { value: "terms", label: "Terms", icon: FileText, animate: "fade-up-right", delay: 500 },
    { value: "privacy", label: "Privacy Policy", icon: FileText, animate: "fade-up-right", delay: 600 },
];

export default function Setting() {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    const [isSaving, setIsSaving] = useState(false);
    const [securitySettings, setSecuritySettings] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [changePassword] = useChangePasswordMutation();

    const handleUpdatePassword = async () => {
        try {
            setIsSaving(true);
            const response = await changePassword({
                currentPassword: securitySettings.currentPassword,
                newPassword: securitySettings.newPassword,
                confirmPassword: securitySettings.confirmPassword,
            }).unwrap();
            if (response?.success) {
                toast.success(response?.message || "Password updated");
                setSecuritySettings({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                });
                setIsSaving(false);
            }
        } catch (error: any) {
            toast.error(error?.data?.message);
            setIsSaving(false);
        }
    };

    return (
        <div className="p-5">
            <Tabs defaultValue="general" className="w-full ">
                <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm border ">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Setting</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Manage application settings and administrative preferences.
                        </p>
                    </div>
                    <TabsList className="grid w-full h-16! bg-primary/20 grid-cols-6 gap-5 p-2 mt-5">
                        {TABS.map(({ value, label, icon: Icon, animate, delay }) => (
                            <TabsTrigger
                                key={value}
                                data-aos={animate}
                                data-aos-anchor-placement="center-bottom"
                                data-aos-delay={delay}
                                className="bg-gray-300 text-gray-600 
                                data-[state=active]:bg-primary! 
                                data-[state=active]:text-white!                                                             
                            data-[state=active]:hover:border-none!
                                    data-[state=active]:focus:outline-none!
                                    data-[state=active]:focus-visible::outline-none! 
                                data-[state=active]:shadow-md 
                                transition-all"
                                value={value}
                            >
                                <Icon className="h-4 w-4 mr-2" />
                                {label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                <TabsContent value="general">
                    <PersonnalInformation />
                </TabsContent>


                <TabsContent value="pricing">
                    <CommissionManage />
                </TabsContent>

                <TabsContent value="security">
                    <Card className="border-none shadow-sm w-full max-w-6xl mx-auto">
                        <CardContent className="px-8 pb-8">
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold">Security Settings</h2>

                                <div className="space-y-2">
                                    <Label htmlFor="currentPassword">Current Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="currentPassword"
                                            type={showCurrentPassword ? "text" : "password"}
                                            value={securitySettings.currentPassword}
                                            onChange={(e) =>
                                                setSecuritySettings({
                                                    ...securitySettings,
                                                    currentPassword: e.target.value,
                                                })
                                            }
                                            className="h-12 pr-12"
                                            placeholder="Enter current password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showCurrentPassword ? (
                                                <EyeOff className="h-5 w-5" />
                                            ) : (
                                                <Eye className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="newPassword">New Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="newPassword"
                                            type={showNewPassword ? "text" : "password"}
                                            value={securitySettings.newPassword}
                                            onChange={(e) =>
                                                setSecuritySettings({
                                                    ...securitySettings,
                                                    newPassword: e.target.value,
                                                })
                                            }
                                            className="h-12 pr-12"
                                            placeholder="Enter current password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showNewPassword ? (
                                                <EyeOff className="h-5 w-5" />
                                            ) : (
                                                <Eye className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                   <div className="relative">
                                        <Input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={securitySettings.confirmPassword}
                                            onChange={(e) =>
                                                setSecuritySettings({
                                                    ...securitySettings,
                                                    confirmPassword: e.target.value,
                                                })
                                            }
                                            className="h-12 pr-12"
                                            placeholder="Confirm new password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="h-5 w-5" />
                                            ) : (
                                                <Eye className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <Button
                                    onClick={handleUpdatePassword}
                                    disabled={isSaving}
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4 mr-2" />
                                            Update
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="terms">
                    <TermsCondition />
                </TabsContent>
                <TabsContent value="about">
                    <AboutUs />
                </TabsContent>

                <TabsContent value="privacy">
                    <PrivacyPolicy />
                </TabsContent>
            </Tabs>
        </div>
    );
}

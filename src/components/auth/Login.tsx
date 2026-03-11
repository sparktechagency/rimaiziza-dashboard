import Cookies from "js-cookie"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { useLoginAdminMutation } from "../../redux/features/auth/authApi"
import { toast } from "sonner"



export default function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [acceptTerms, setAcceptTerms] = useState(false)

    const [login] = useLoginAdminMutation()
    const navigate = useNavigate()

    useEffect(() => {
        const email = Cookies.get("email");
        const password = Cookies.get("password");
        if (email && password) {
            setEmail(email);
            setPassword(password);
        }
    }, []);


    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (acceptTerms) {
            Cookies.set("email", email);
            Cookies.set("password", password);
        }

        try {
            const response = await login({ email, password })?.unwrap();
            
            if (response?.success) {
                toast.success(response?.message);
                Cookies.set("accessToken", response?.data?.token);
                navigate("/")
            }
        } catch (error:any) {            
            toast.error(error?.data?.message);
        }
    }

    return (
        <div className="min-h-screen w-screen flex items-center justify-center bg-linear-to-br from-[#f7f8fc] to-[#eef2ff] px-4">
            <Card className="w-full max-w-md rounded-2xl shadow-lg" data-aos="zoom-in">
                <CardHeader className="text-center space-y-2">
                    <div className="flex justify-center">
                        <img src="/logo.png" className='w-full  max-w-20 h-14 object-cover overflow-visible scale-70' alt="Logo" />
                    </div>
                    <CardTitle className="text-2xl font-semibold">
                        Welcome back
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-5">
                        {/* Email */}
                        <div className="space-y-1">
                            <Label className="mb-2">Email</Label>
                            <Input
                                type="email"
                                placeholder="enter email..."
                                className="h-11"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-1">
                            <Label className="mb-2">Password</Label>
                            <Input
                                type="password"
                                placeholder="enter password..."
                                className="h-11"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {/* Terms + Forgot */}
                        <div className="space-y-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {/* <Checkbox
                                    id="terms"
                                    checked={acceptTerms}
                                    onCheckedChange={(checked) => setAcceptTerms(!!checked)}
                                    className="data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600
    "
                                /> */}
                                <input
                                    checked={acceptTerms}
                                    onChange={() => setAcceptTerms(!acceptTerms)}
                                    type="checkbox"
                                    id="terms"
                                    name="terms"
                                    value="Bike" />
                                <Label
                                    htmlFor="terms"
                                    className="text-sm cursor-pointer"
                                >
                                    Remember Me
                                </Label>
                            </div>

                            <div className="flex justify-end">
                                <Link
                                    to="/forgot-password"
                                    className="text-sm text-primary font-medium hover:underline"
                                >
                                    Forgot Password?
                                </Link>
                            </div>
                        </div>


                        {/* Login Button */}
                        <Button type="submit" className="w-full h-11 text-base">
                            Login
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

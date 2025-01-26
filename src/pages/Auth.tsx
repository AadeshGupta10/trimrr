import Login from "@/components/login"
import Signup from "@/components/signup"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";

const Auth = () => {

    let [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const longLink = searchParams.get("createNew");

    const isAuthenticated = useSelector((state: any) => state.isAuthenticated);
    const loading = useSelector((state: any) => state.loading);

    useEffect(() => {
        if (isAuthenticated && !loading) {
            navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
        }
    }, [isAuthenticated, loading]);

    return (
        <div className="flex flex-col items-center gap-10">
            <h1 className="text-4xl font-extrabold text-center">
                {searchParams.get("createNew")
                    ? "Hold up! Let's login first.."
                    : "Login / Signup"}
            </h1>
            <Tabs defaultValue="login" className="w-[400px]">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="signup">Signup</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                    <Login />
                </TabsContent>
                <TabsContent value="signup">
                    <Signup />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default Auth
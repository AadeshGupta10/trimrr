import { Link, useNavigate } from "react-router-dom"
import { Button } from "./ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "./ui/dropdown-menu";
import { LinkIcon, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { logout } from "@/db/apiAuth";
import { handleUserVerification } from "@/Store/ReduxFunction";
import { BarLoader } from "react-spinners";

const Header = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch()

    const data = useSelector((state: any) => state.user)

    const { mutate, isPending } = useMutation({
        mutationKey: ["Logout"],
        mutationFn: logout,
        onSuccess: () => {
            dispatch(handleUserVerification({ user: {}, isLoading: false, isAuthenticated: false }));
            navigate("/");
        }
    });

    return (
        <>
            <nav className="py-4 flex justify-between items-center">
                <Link to="/">
                    <img src="logo.png" className="h-16 object-contain" alt="Trimrr Logo" />
                </Link>

                <div>
                    {
                        (typeof data === "object" && Object.keys(data).length === 0) ?
                            <Button onClick={() => navigate("/auth")}>Login</Button>
                            :
                            <DropdownMenu>
                                <DropdownMenuTrigger className="w-10 rounded-full overflow-hidden">
                                    <Avatar>
                                        <AvatarImage src={data?.user_metadata?.profile_pic} className="object-contain"/>
                                        <AvatarFallback>AG</AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="py-2">
                                    <DropdownMenuLabel>
                                        {data?.user_metadata?.name}
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <Link to="/dashboard" className="flex items-center">
                                            <LinkIcon className="mr-2 size-4" />
                                            <span>My Links</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => mutate()}
                                        className="text-red-500 flex items-center">
                                        <LogOut className="mr-2 size-4 text-red-500" />
                                        <span className="text-red-500">Logout</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                    }
                </div>
            </nav>

            {
                isPending && <BarLoader className="my-4 w-full text-[#36d7b7]" />
            }
        </>
    )
}

export default Header
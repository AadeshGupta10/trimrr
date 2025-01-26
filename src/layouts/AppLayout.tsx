import Footer from "@/components/Footer"
import Header from "@/components/Header"
import { getCurrentUser } from "@/db/apiAuth"
import { handleUserVerification } from "@/Store/ReduxFunction"
import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { Outlet } from "react-router-dom"

const AppLayout = () => {

    const { data, isLoading } = useQuery({
        queryKey: ["Verifying User"],
        queryFn: getCurrentUser
    });

    const dispatch = useDispatch();

    useEffect(() => {
        if (data && !isLoading) {
            const isAuthenticated = data?.role === "authenticated";
            dispatch(handleUserVerification({ user: data, isLoading: isLoading, isAuthenticated: isAuthenticated }))
        }
    }, [data, isLoading])

    return (
        <>
            <main className="container mx-auto px-4">
                <Header />
                <Outlet />
            </main>
            <Footer />
        </>
    )
}

export default AppLayout
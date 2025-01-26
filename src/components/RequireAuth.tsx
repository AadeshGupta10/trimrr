import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import BarLoader from "react-spinners/BarLoader";

const RequireAuth = ({ children }: any) => {
    const navigate = useNavigate();

    const isAuthenticated = useSelector((state: any) => state.isAuthenticated);
    const loading = useSelector((state: any) => state.loading);

    useEffect(() => {
        if (!isAuthenticated && loading === false) navigate("/auth");
    }, [isAuthenticated, loading]);

    if (loading) return <BarLoader width={"100%"} color="#36d7b7" />;

    if (isAuthenticated) return children;
}

export default RequireAuth
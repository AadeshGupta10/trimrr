import { storeClicks } from "@/db/apiClicks";
import { getLongUrl } from "@/db/apiUrls";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import BarLoader from "react-spinners/BarLoader";

const RedirectLink = () => {
    const { id } = useParams();

    const { mutate, isPending: loadingData } = useMutation({
        mutationKey: ["Getting Original URL"],
        mutationFn: getLongUrl,
        onSuccess: (data) => {
            console.log(data),
                storingClicks({
                    id: data?.id,
                    originalUrl: data?.original_url,
                })
        },
        onError: (err) => {
            console.log(err);
        }
    })

    useEffect(() => {
        id && mutate(id);
    }, [])

    const { mutate: storingClicks, isPending: loadingStats } = useMutation({
        mutationKey: ["Updating Clicks"],
        mutationFn: storeClicks,
    })

    if (loadingData || loadingStats) {
        return (
            <>
                <BarLoader width={"100%"} color="#36d7b7" />
                <br />
                Redirecting...
            </>
        );
    }

    return null;
}

export default RedirectLink
import { storeClicks } from "@/db/apiClicks";
import { getLongUrl } from "@/db/apiUrls";
import { toast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import BarLoader from "react-spinners/BarLoader";

const RedirectLink = () => {
    const { id } = useParams();

    const { mutate, isPending: loadingData, isError } = useMutation({
        mutationKey: ["Getting Original URL"],
        mutationFn: getLongUrl,
        onSuccess: (data) => {
            storingClicks({
                id: data?.id,
                originalUrl: data?.original_url,
            })
        },
        onError: () => {
            toast({
                title: "Error in Redirecting to Original Page"
            });
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
            (loadingData || !isError) ?
                <BarLoader width={"100%"} color="#36d7b7" />
                :
                <>Requested url is not valid</>
        );
    }

    return null;
}

export default RedirectLink
import DeviceStats from "@/components/DeviceStats";
import LocationStats from "@/components/LocationStats";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getClicksForUrl } from "@/db/apiClicks";
import { getUrl, deleteUrl } from "@/db/apiUrls";
import { useMutation } from "@tanstack/react-query";
import { LinkIcon, Copy, Download, Trash } from "lucide-react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { BarLoader, BeatLoader } from "react-spinners";

const Link = () => {

    const base_url = import.meta.env.VITE_REACT_APP_BASE_URL;

    const downloadImage = () => {
        const imageUrl = url?.qr;
        const fileName = url?.title;

        // Create an anchor element
        const anchor = document.createElement("a");
        anchor.href = imageUrl;
        anchor.download = fileName;

        // Append the anchor to the body
        document.body.appendChild(anchor);

        // Trigger the download by simulating a click event
        anchor.click();

        // Remove the anchor from the document
        document.body.removeChild(anchor);
    };

    const navigate = useNavigate();
    const user = useSelector((state: any) => state.user);

    const { id } = useParams();
    console.log(id);

    const { mutate: mutateUrl, isPending: PendingUrlInfo, data: url } = useMutation({
        mutationKey: ["Getting Url Data"],
        mutationFn: getUrl,
        onError: () => {
            navigate("/dashboard");
        },
        onSuccess: () => {
            typeof (id) === "string" && mutateClick(id)
        }
    })

    useEffect(() => {
        mutateUrl({ id, "user_id": user.id })
    }, [])

    const { mutate: mutateClick, isPending: PendingUrlClicks, data: stats } = useMutation({
        mutationKey: ["Get CLicks for Url"],
        mutationFn: getClicksForUrl,
        onSuccess: (res) => {
            console.log(res)
        }
    })

    const { mutate: mutateDelete, isPending: loadingDelete } = useMutation({
        mutationKey: ["Delete URL"],
        mutationFn: deleteUrl,
        onSuccess: () => {
            navigate("/dashboard");
        }
    })

    let link = "";

    if (url) {
        link = url?.custom_url ? url?.custom_url : url.short_url;
    }

    return (
        <>
            {(PendingUrlInfo || PendingUrlClicks) && (
                <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
            )}
            <div className="flex flex-col gap-8 sm:flex-row justify-between">
                <div className="flex flex-col items-start gap-4 rounded-lg sm:w-2/5">
                    <span className="text-4xl font-extrabold hover:underline cursor-pointer">
                        {url?.title}
                    </span>
                    <a
                        href={`${base_url}/${link}`}
                        target="_blank"
                        className="sm:text-2xl text-blue-400 font-bold hover:underline cursor-pointer">
                        {base_url + "/" + link}
                    </a>
                    <a
                        href={url?.original_url}
                        target="_blank"
                        className="flex items-center gap-1 hover:underline cursor-pointer"
                    >
                        <LinkIcon className="p-1" />
                        {url?.original_url}
                    </a>
                    <span className="flex items-end font-extralight text-sm">
                        {new Date(url?.created_at).toLocaleString()}
                    </span>
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            onClick={() =>
                                navigator.clipboard.writeText(base_url + "/" + url?.short_url)
                            }
                        >
                            <Copy />
                        </Button>
                        <Button variant="ghost" onClick={downloadImage}>
                            <Download />
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() =>
                                typeof id === "string" && mutateDelete(id)
                            }
                            disabled={loadingDelete}
                        >
                            {loadingDelete ? (
                                <BeatLoader size={5} color="white" />
                            ) : (
                                <Trash />
                            )}
                        </Button>
                    </div>
                    <img
                        src={url?.qr}
                        className="size-72 self-center sm:self-start p-1 object-contain"
                        alt="qr code"
                    />
                </div>

                <Card className="sm:w-3/5">
                    <CardHeader>
                        <CardTitle className="text-3xl font-extrabold tracking-wider">Stats</CardTitle>
                    </CardHeader>
                    {stats && stats.length ? (
                        <CardContent className="flex flex-col gap-6">
                            <Card className="flex items-center">
                                <CardHeader className="m-0">
                                    <CardTitle>Total Clicks :- </CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <p>
                                        {stats?.length}
                                    </p>
                                </CardContent>
                            </Card>

                            <CardTitle>Location Data</CardTitle>
                            <LocationStats stats={stats} />
                            <CardTitle>Device Info</CardTitle>
                            <DeviceStats stats={stats} />
                        </CardContent>
                    ) : (
                        <CardContent>
                            {PendingUrlClicks === false
                                ? "No Statistics yet"
                                : "Loading Statistics.."}
                        </CardContent>
                    )}
                </Card>
            </div >
        </>
    );
}

export default Link
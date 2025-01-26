import { CreateLink } from "@/components/CreateLink";
import Form_error from "@/components/Form_error";
import LinkCard from "@/components/LinkCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { getClicksForUrls } from "@/db/apiClicks";
import { getUrls } from "@/db/apiUrls";
import { useMutation } from "@tanstack/react-query";
import { Filter } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import BarLoader from "react-spinners/BarLoader"

const Dashboard = () => {

    const [searchQuery, setSearchQuery] = useState("");

    const user = useSelector((state: any) => state.user)

    const { mutate: urls_mutate, data: urls_data, isPending: urls_pending, error: urls_error } = useMutation({
        mutationKey: ["Getting Details"],
        mutationFn: getUrls,
        onSuccess: (res) => {
            mutate(res?.map((url) =>
                url.id
            ))
        }
    })

    const { mutate, isPending: clicks_pending, data: clicks } = useMutation({
        mutationKey: ["Getting Details"],
        mutationFn: getClicksForUrls
    })

    useEffect(() => {
        Object.keys(user).length > 0 && urls_mutate(user.id)
    }, [user])

    const filteredUrls = urls_data?.filter((url) => (url.title.toLowerCase()).includes(searchQuery.toLowerCase()));


    return (
        <div className="flex flex-col gap-8">
            {(urls_pending || clicks_pending) && (
                <BarLoader width={"100%"} color="#36d7b7" />
            )}
            <div className="grid grid-cols-2 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Links Created</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{urls_data?.length}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Total Clicks</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{clicks?.length}</p>
                    </CardContent>
                </Card>
            </div>
            <div className="flex justify-between">
                <h1 className="text-3xl font-extrabold">My Links</h1>
                <CreateLink />
            </div>
            <div className="relative">
                <Input
                    type="text"
                    placeholder="Filter Links..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Filter className="absolute top-2 right-2 p-1" />
            </div>
            {urls_error && <Form_error field_name={"Error in Getting Url"} message={urls_error?.message} />}
            {(filteredUrls || []).reverse().map((url, i) => (
                <LinkCard key={i} url={url} fetchUrls={() => urls_mutate(user.id)} />
            ))}
        </div>
    )
}

export default Dashboard
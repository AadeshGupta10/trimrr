import { Copy, Download, LinkIcon, Trash } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { deleteUrl } from "@/db/apiUrls";
import { BeatLoader } from "react-spinners";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

interface Url {
  id: string,
  qr: string,
  title: string,
  original_url: string,
  custom_url: string,
  short_url: string,
  created_at: string
}

interface LinkCardProp {
  url: Url,
  fetchUrls: () => void
}

const LinkCard = ({ url, fetchUrls }: LinkCardProp) => {

  const base_url = import.meta.env.VITE_REACT_APP_BASE_URL;

  const downloadImage = async () => {
    const imageUrl = url.qr;
    const fileName = url.title + " QR Code"; // Desired file name for the downloaded image

    // Create an anchor element
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const anchor = document.createElement("a");
      anchor.href = blobUrl;
      anchor.download = fileName;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);

      // Revoke blob URL to free memory
      window.URL.revokeObjectURL(blobUrl);

      toast({
        title: `${fileName} is Downloaded Successfully.`
      })
    } catch (error) {
      toast({
        title: `Downloading ${fileName} Failed.`
      })
    }
  };

  const { mutate, isPending: loadingDelete } = useMutation({
    mutationKey: ["Deleting the Url"],
    mutationFn: deleteUrl,
    onSuccess: () => {
      fetchUrls();
    }
  })

  // const { loading: loadingDelete, fn: fnDelete } = useFetch(deleteUrl, url.id);

  return (
    <div className="flex flex-col md:flex-row gap-5 border p-4 bg-gray-900 rounded-lg">

      {/* QR Code */}
      <img
        src={url?.qr}
        className="size-28 object-contain self-start"
        alt="qr code" />

      {/* Title */}
      <Link to={`/link/${url?.id}`} className="flex flex-col gap-1 flex-1">
        <span className="text-xl font-extrabold hover:underline cursor-pointer break-all">
          {url?.title}
        </span>

        {/* Short/Custom url */}
        <span className="text-lg text-blue-400 font-bold hover:underline cursor-pointer break-all">
          <a href={`${base_url + "/"}${url?.custom_url ? url?.custom_url : url.short_url}`}>
            {base_url + "/"}{url?.custom_url ? url?.custom_url : url.short_url}
          </a>
        </span>

        {/* Original Url */}
        <span className="flex items-center hover:underline cursor-pointer text-sm break-all">
          <LinkIcon className="p-1 ps-0" />
          <a href={url?.original_url} target="_blank">
            {url?.original_url}
          </a>
        </span>

        {/* Date of Creation */}
        <span className="flex items-end font-extralight text-sm flex-1">
          {new Date(url?.created_at).toLocaleString()}
        </span>

      </Link>
      <div className="flex gap-2">
        <Button
          variant="ghost"
          onClick={() => {
            navigator.clipboard.writeText(`${base_url + "/"}${url?.custom_url ? url?.custom_url : url.short_url}`);
            toast({
              title: "Url is Copied to Clipboard"
            })
          }}>
          <Copy />
        </Button>
        <Button variant="ghost" onClick={() => downloadImage()}>
          <Download />
        </Button>
        <Button
          variant="ghost"
          onClick={() => mutate(url.id)}
          disabled={loadingDelete}>
          {loadingDelete ? <BeatLoader size={5} color="white" /> : <Trash />}
        </Button>
      </div>
    </div>
  );
};

export default LinkCard;

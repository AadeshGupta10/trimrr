import { Copy, Download, LinkIcon, Trash } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { deleteUrl } from "@/db/apiUrls";
import { BeatLoader } from "react-spinners";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import Qr_Generator, { Qr_Downloader } from "./Qr_Generator_&_Downloader";

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

  const downloadImage = () => {
    const fileName = url.title + " QR Code"; // Desired file name for the downloaded image

    const qr_file = document.getElementById("qr_code_" + url.short_url)?.querySelector("canvas") as HTMLCanvasElement;

    Qr_Downloader(fileName, qr_file);
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
      <div id={"qr_code_" + url.short_url}>
        <Qr_Generator
          link={`${base_url + "/"}${url?.custom_url ? url?.custom_url : url.short_url}`}
          size={112} />
      </div>

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

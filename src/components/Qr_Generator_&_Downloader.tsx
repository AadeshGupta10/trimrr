import { QRCode } from "react-qrcode-logo";
import { toast } from "@/hooks/use-toast";

interface QrProp {
    link: string
    size: number
}

const Qr_Generator = ({ link, size }: QrProp) => {
    return (
        <QRCode
            value={link}
            size={size}
            qrStyle={"dots"}
            ecLevel={"Q"}
            quietZone={3}
            eyeRadius={4}
        />
    )
}

export const Qr_Downloader = async (fileName = "QRCode.png", qr_file: HTMLCanvasElement) => {

    try {
        const result = await new Promise<Blob | null>((resolve) => qr_file.toBlob(resolve));

        if (result) {
            const blobUrl = window.URL.createObjectURL(result);

            const anchor = document.createElement("a");
            anchor.href = blobUrl;
            anchor.download = fileName;
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);
        }

        toast({
            title: `${fileName} is Downloaded Successfully.`
        })

    } catch (err) {
        console.log(err)
        toast({
            title: `Downloading ${fileName} Failed.`
        })
    }

    return;
}

export default Qr_Generator
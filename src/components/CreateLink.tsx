import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
// import { Card } from "./ui/card";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useRef } from "react";
import { createUrl } from "@/db/apiUrls";
import { BeatLoader } from "react-spinners";
import { QRCode } from "react-qrcode-logo";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import Form_error from "./Form_error";
import { useMutation } from "@tanstack/react-query";

export function CreateLink() {

  const user = useSelector((state: any) => state.user)

  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement | null>(null);

  let [searchParams, setSearchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");

  const { register, handleSubmit, watch, formState: { errors } } = useForm()

  const { mutate, isPending, isError } = useMutation({
    mutationKey: ["Creating Link"],
    mutationFn: createUrl,
    onSuccess: (data) => {
      console.log(data);
      !!data && navigate(`/link/${data[0].id}`);
    }
  })

  const createNewLink = async (data: object) => {
    try {
      const canvas = ref.current?.querySelector("canvas");
      if (!canvas) {
        console.error("Canvas not found");
        return;
      }

      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve));
      if (blob) {
        mutate({ ...data, "user_id": user.id, "qrcode": blob });
      }
    } catch (e) {
      console.error("Error creating link:", e);
    }
  };

  return (
    <Dialog
      defaultOpen={!!longLink}
      onOpenChange={(res) => {
        if (!res) setSearchParams({});
      }}>

      <DialogTrigger asChild>
        <Button variant="destructive">Create New Link</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-bold text-2xl">Create New</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit((e) => createNewLink(e))}
          className="flex flex-col gap-5">

          {watch("longUrl") &&
            <div
              ref={ref}
              className="flex justify-center">
              <QRCode
                size={150}
                value={watch("longUrl")} />
            </div>}

          <Input
            id="title"
            placeholder="Short Link's Title"
            {...register("title", {
              required: "* Title is Required"
            })} />
          {errors.title && <Form_error field_name={errors.title} message={errors.title?.message} />}

          <Input
            type="url"
            id="longUrl"
            placeholder="Enter your Loooong URL"
            {...register("longUrl", {
              value: longLink,
              required: "* longUrl is Required"
            })} />
          {errors.longUrl && <Form_error field_name={errors.longUrl} message={errors.longUrl?.message} />}

          <div className="flex items-center gap-2">
            {/* <Card className="p-2">aadesh-trimrr.vercel.app</Card> / */}
            <Input
              id="customUrl"
              placeholder="Custom Link (optional)"
              {...register("customUrl")} />
          </div>
          {
            isError && <Form_error field_name={"Duplicate Short Name Error"} message={"This custom name is already in use. Try different one."} />
          }

          <DialogFooter className="sm:justify-start">
            <Button
              type="submit"
              variant="destructive"
              onClick={createNewLink}
              disabled={isPending}>
              {isPending ? <BeatLoader size={10} color="white" /> : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
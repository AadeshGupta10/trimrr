import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createUrl } from "@/db/apiUrls";
import { BeatLoader } from "react-spinners";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import Form_error from "./Form_error";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

export function CreateLink() {

  const user = useSelector((state: any) => state.user)

  const navigate = useNavigate();

  let [searchParams, setSearchParams] = useSearchParams();
  const longLink = searchParams.get("createNew"); 

  const { register, handleSubmit, formState: { errors } } = useForm()

  const { mutate, isPending, isError } = useMutation({
    mutationKey: ["Creating Link"],
    mutationFn: createUrl,
    onSuccess: (data) => {
      toast({
        title: "Short Url Created Successfully"
      }),
      !!data && navigate(`/link/${data[0].id}`);
    },
  })

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
          onSubmit={handleSubmit((e) => mutate({ ...e, "user_id": user.id}))}
          className="flex flex-col gap-5">

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
              disabled={isPending}>
              {isPending ? <BeatLoader size={10} color="white" /> : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
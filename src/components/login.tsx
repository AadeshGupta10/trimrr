import { Button } from "./ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form"
import { login } from "@/db/apiAuth";
import { BeatLoader } from "react-spinners";
import { useMutation } from "@tanstack/react-query";
import Form_error from "./Form_error";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useState } from "react";
import Verification_header from "./Verification_header";
import { useDispatch } from "react-redux";
import { handleUserVerification } from "@/Store/ReduxFunction";

const Login = () => {
  let [searchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [reveal, setReveal] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm()

  const focusDiv = (field_name: string) => {
    document.getElementById(field_name)?.focus()
  }

  const { mutate, isPending, isError } = useMutation({
    mutationKey: ["Login"],
    mutationFn: login,
    onSuccess: (data) => {

      const isAuthenticated = data?.user?.role === "authenticated";
      dispatch(handleUserVerification({ user: data?.user, isLoading: false, isAuthenticated: isAuthenticated }))

      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
    }
  })

  return (
    <div className='flex flex-wrap justify-center items-center select-none border rounded-lg'>
      <div className='p-6 border-1 rounded-lg md:shadow-md w-full flex flex-col gap-3 overflow-y-auto custom-scrollbar'>
        <div>
          <Verification_header name='Login' />
          {
            isError && <label className='text-red-400 smaller_text'>
              * Invalid Email or Password
            </label>
          }
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit((e) => mutate(e))}
          className='flex flex-col gap-3'>
          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="email"
              className='form-label'>
              Email
            </label>
            <div className='flex justify-between items-center gap-3 border-1 p-2 rounded-md border border-gray-500 hover:border-gray-400 transition-all text-sm cursor-text' onClick={() => focusDiv("email")}>
              <Mail color='#374151'
                strokeWidth={"1.75px"} />
              <input type="email"
                id="email"
                className='w-full outline-none bg-transparent text-md placeholder-gray-700 font-normal'
                placeholder='your@gmail.com'
                autoFocus
                {...register("email", {
                  required: "* Email Required",
                })}
              />
            </div>
            <Form_error field_name={errors.email} message={errors.email?.message} />
          </div>

          <div className="space-y-2">
            <label htmlFor="password"
              className='form-label'>
              Password
            </label>
            <div className='flex justify-between items-center gap-3 border-1 p-2 rounded-md border border-gray-500 hover:border-gray-400 transition-all text-[12px] cursor-text' onClick={() => focusDiv("password")}>
              <LockKeyhole color='#374151'
                strokeWidth={"1.75px"} />
              <div className='w-full flex justify-between items-center gap-3'>
                <input type={reveal ? "text" : "password"}
                  className='w-full outline-none bg-transparent text-md placeholder-gray-700 font-normal'
                  placeholder={reveal ? "XXXXXXXX" : '••••••••'}
                  id='password'
                  autoComplete='false'
                  {...register("password",
                    {
                      required: "* Password Required"
                    }
                  )}
                />
                <div className='cursor-pointer' onClick={(e) => e.stopPropagation()}>
                  {
                    reveal ?
                      <Eye className='size-5' onClick={() => setReveal(!reveal)} />
                      :
                      <EyeOff className='size-5' onClick={() => setReveal(!reveal)} />
                  }
                </div>
              </div>
            </div>
            <Form_error field_name={errors.password} message={errors.password?.message} />
          </div>

          <Button type={isPending ? 'button' : 'submit'}
            disabled={isPending}
            variant={"secondary"}>
            {
              isPending ?
                <div className='flex flex-wrap gap-2 justify-center'>
                  <BeatLoader size={10} />
                </div>
                :
                "Sign in"
            }
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
import supabase, { supabaseUrl } from "./supabase";

export const login = async (e: any) => {

  const { email, password } = e

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);

  return data;
}

export const signup = async (e: any) => {

  const { name, email, password, image: profile_pic } = e;

  console.log(profile_pic);

  const fileName = `dp-${name.split(" ").join("-")}-${Math.random()}`;

  const { error: storageError } = await supabase.storage
    .from("profile_pic")
    .upload(fileName, profile_pic[0]);

  if (storageError) throw new Error(storageError.message);

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        profile_pic: `${supabaseUrl}/storage/v1/object/public/profile_pic/${fileName}`,
      },
    },
  });

  if (error) throw new Error(error.message);

  return data;
}

export const getCurrentUser = async () => {
  const { data: session, error } = await supabase.auth.getSession();
  if (!session.session) return null;

  if (error) throw new Error(error.message);
  return session.session?.user;
}

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}
import { toast } from "@/hooks/use-toast";
import supabase from "./supabase";

export const getUrls = async (user_id: string) => {

  let { data, error } = await supabase
    .from("urls")
    .select("*")
    .eq("user_id", user_id);

  if (error) {
    throw new Error("Unable to load URLs");
  }

  return data;
}

export const getUrl = async (e: any) => {

  const { id, user_id } = e;

  const { data, error } = await supabase
    .from("urls")
    .select("*")
    .eq("id", id)
    .eq("user_id", user_id)
    .single();

  if (error) {
    throw new Error("Short Url not found");
  }

  return data;
}

export const getLongUrl = async (id: string) => {

  let { data: shortLinkData, error: shortLinkError } = await supabase
    .from("urls")
    .select("id, original_url")
    .or(`short_url.eq.${id},custom_url.eq.${id}`)
    .single();

  if (shortLinkError && shortLinkError.code !== "PGRST116") {
    toast({
      title: "Error fetching short link:"
    })
    return;
  }

  return shortLinkData;
}

export const createUrl = async (e: any) => {

  const { title, longUrl, customUrl, user_id } = e;

  if (title.length === 0 || longUrl.length === 0) return;

  const short_url = Math.random().toString(36).substr(2, 6);

  const { data, error } = await supabase
    .from("urls")
    .insert([
      {
        title,
        user_id,
        original_url: longUrl,
        custom_url: customUrl || null,
        short_url,
      },
    ])
    .select();

  if (error) {
    throw new Error("Error creating short URL");
  }

  return data;
}

export const deleteUrl = async (id: string) => {

  const { data, error } = await supabase.from("urls").delete().eq("id", id);

  if (error) {
    throw new Error("Unable to delete Url");
  }

  return data;
}
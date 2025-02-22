import { UAParser } from "ua-parser-js";
import supabase from "./supabase";
import { toast } from "@/hooks/use-toast";

export const getClicksForUrls = async (e: any) => {

  const urlIds = e;

  const { data, error } = await supabase
    .from("clicks")
    .select("*")
    .in("url_id", urlIds);

  if (error) {
    toast({
      title: "Error fetching clicks:"
    });
    return null;
  }

  return data;
}

export const getClicksForUrl = async (url_id: string) => {

  const { data, error } = await supabase
    .from("clicks")
    .select("*")
    .eq("url_id", url_id);

  if (error) {
    toast({
      title: "Unable to load stats"
    });
    throw new Error("Unable to load Stats");
  }

  return data;
}

const parser = new UAParser();

export const storeClicks = async (e: any) => {

  const { id, originalUrl } = e;

  try {
    const res = parser.getResult();
    const device = res.device.type || "Desktop";

    const response = await fetch("https://ipapi.co/json");
    const { city, country_name: country } = await response.json();

    // Record the click
    await supabase.from("clicks").insert({
      url_id: id,
      city: city,
      country: country,
      device: device,
    });

    // Redirect to the original URL
    window.location.href = originalUrl;
  } catch (error) {
    console.log(error);
  }
};
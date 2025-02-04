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

    // let city_name: string;
    // let country: string;

    // let response: Response | { city: string; country_name: string; };

    // try {
    //   response = await fetch("https://ipapi.co/json");
    //   if (response.ok) { // Check for successful response (status 200-299)
    //     const data = await response.json();
    //     { city: city_name, country_name: country } = data;
    //     // ... use city and country
    //     console.log(city, country);
    //   } else {
    //     console.error("HTTP error", response.status);
    //     response = { city: "Unknown", country_name: "Unknown" }
    //     const { city, country_name: country } = response;
    //     console.log(city, country);
    //   }
    // } catch (error) {
    //   console.error("Fetch error:", error);
    //   response = { city: "Unknown", country_name: "Unknown" };
    //   const { city, country_name: country } = response;
    //   console.log(city, country);
    // }


    // Record the click
    await supabase.from("clicks").insert({
      url_id: id,
      city: "unknown",
      country: "unknown",
      device: device,
    });

    // Redirect to the original URL
    window.location.href = originalUrl;
  } catch (error) {
    console.log(error);
  }
};
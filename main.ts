/*
Example Akamai EdgeWorker to remove some cookies before sending them to origin.
*/
import { Cookies } from "cookies";
import { logger } from "log";
import { cookieList } from "./cookieList.js";

/*
Only making changes when request is going to origin
https://techdocs.akamai.com/edgeworkers/docs/event-handler-functions#onoriginrequest
*/
export async function onOriginRequest(request: EW.IngressOriginRequest) {
  // lookup cookie header, undefined it there are no cookies
  const cookieHeader = request.getHeader("cookie");

  // only try to delete cookies if there is a cookie object
  if (cookieHeader) {
    try {
      // create Cookie object from cookie header
      const cookies = new Cookies(cookieHeader);

      // Loop through each cookie name in `cookieList` and delete it
      // for...of loop is a modern and concise way to iterate through the values of an array.
      for (const cookieName of cookieList) {
        //logger.debug(`Attempting to delete cookie ${cookieName}`);
        cookies.delete(cookieName);
      }
      // create our new cookie header
      const remainingCookiesHeader = cookies.toHeader();

      // if we have some cookies left, reset the cookie header otherwise just delete the cookie header
      if (remainingCookiesHeader) {
        request.setHeader("cookie", remainingCookiesHeader);
      } else {
        request.removeHeader("cookie");
      }
    } catch (error) {
      logger.error("Error deleting cookies:", error);
    }
  }
}

/*
Example Akamai EdgeWorker to remove some cookies before sending them to origin.
*/
import { Cookies } from "cookies";
import { logger } from "log";
// our list of cookies we want to remove
const cookieList = ["remove_me", "remove_me_2"];
/*
Only making changes when request is going to origin
https://techdocs.akamai.com/edgeworkers/docs/event-handler-functions#onoriginrequest
*/
export async function onOriginRequest(request) {
    // lookup cookie header, undefined it there are not cookies
    const cookieHeader = request.getHeader("Cookie");
    // only try to delete cookies if there is a cookie object
    if (cookieHeader) {
        try {
            // create Cookie object from cookie header
            const cookies = new Cookies(cookieHeader);
            // Loop through each cookie name in `cookieList` and delete it
            for (const cookieName of cookieList) {
                logger.info(`removing some cookie ${cookieName}`);
                cookies.delete(cookieName);
            }
            // create our new cookie header
            const remainingCookiesHeader = cookies.toHeader();
            // if we have some cookies left, reset the cookie header otherwise just delete the cookie header
            if (remainingCookiesHeader) {
                request.setHeader("cookie", cookies.toHeader());
            }
            else {
                request.removeHeader("cookie");
            }
        }
        catch (error) {
            logger.error("Error deleting cookies:", error);
        }
    }
}

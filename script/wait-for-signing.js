import { MozillaAddonsAPI } from "@plasmohq/mozilla-addons-api";

const mozilla = new MozillaAddonsAPI({
  extId: process.env.FIREFOX_ID,
  apiKey: process.env.FIREFOX_API_KEY,
  apiSecret: process.env.FIREFOX_API_SECRET,
  channel: "unlisted"
})

while (true) {
  const jwt = await mozilla.getAccessToken()

  let upload_info = await fetch(
    `https://addons.mozilla.org/api/v4/addons/${process.env.FIREFOX_ID}/versions/${process.env.FIREFOX_TAG}/`,
    {
      headers: {
        Authorization: `JWT ${jwt}`
      }
    }
  ).then((res) => res.json())
  console.debug(upload_info)
  if (upload_info?.files[0].signed) {
    console.log("Signed upload success")
    break
  } else {
    console.log("Waiting for signing up")
    await new Promise((resolve) => setTimeout(resolve, 20000))
  }
}

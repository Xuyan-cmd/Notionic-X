import { getBlocksMaps } from '@/lib/getBlocksMaps'

module.exports = async (req, res) => {
  let { url } = req.query
  const { siteConfigObj } = await getBlocksMaps()

  if (req.query && req.query.url) {
    url = req.query.url
  }

  const response = await fetch(url)
  const originResText = await response.text()
  const removeCraftText = originResText
    .replace('"https://www.craft.do"', '"/"') // Replace logo url
    .replace('?utm_source=CraftShare', '') // Replace logo url
    .replace('flex items-start group"', 'flex items-start group",style:{visibility:"hidden"}') // Hide Craft.do upper right corner logo
    .replace(
      /function p\(e\)\{var t=e.color\|\|"currentColor";return\(0,i.jsx\)\("svg",\{className:e.className.*id:"blue"\}\)\]\}\)\}\)\}\)/,
      'function p(e){var t=e.color||"currentColor";return(0,i.jsx)("img",{className:e.className,alt:"logo",src:"/favicon.svg"})'
    ) // Replace loading logo to favicon.svg
    .replace(
      /\{isDarkMode:l,title:"Report page".*\{hidden:!Q,isDarkMode:l,title:"Duplicate"/,
      '{hidden:!Q,isDarkMode:l,title:"Duplicate"'
    ) // Hide "Report page" and "Edit in browser" items

  const modifyResText = siteConfigObj['Show Title Bar Text'] === 'True' ? removeCraftText : removeCraftText.replace(
    /className:"flex items-center justify-start flex-grow mr-2 overflow-hidden shrink"/g,
    'style:{display:"none"},className:"flex items-center justify-start flex-grow mr-2 overflow-hidden shrink"'
  ) // Hide title bar text

  // don't show the "/b/*" and "/x/*" in the url
  // .replace('window.history.pushState({lukiNavIndex:c.length-1},w.breadcrumb,e.deepLinkUrl)', '""')
  res.setHeader('Content-Type', 'text/javascript; charset=utf-8')
  res.send(modifyResText)
}

const captureDownload = async (item: chrome.downloads.DownloadItem, suggest: () => void) => {
  suggest()
  const url = item.finalUrl || item.url
  if (!/^(https?|s?ftp)/i.test(url) || url === 'about:blank') return
  await chrome.downloads.cancel(item.id)
  chrome.windows.getCurrent((current: chrome.windows.Window) => {
    const width = 620
    const height = 315
    const left = Math.round((current.width! - width) * 0.5 + current.left!)
    const top = Math.round((current.height! - height) * 0.5 + current.top!)
    chrome.windows.create({
      url: `confirm/index.html?info=${encodeURIComponent(
        JSON.stringify({
          fileName: item.filename || 'download',
          url,
          fileSize: item.fileSize,
          referrer: item.referrer || '',
          storeId: item.incognito === true ? '1' : '0',
        }),
      )}`,
      type: 'popup',
      width,
      height,
      left,
      top,
    })
  })
}

chrome.downloads.onDeterminingFilename.addListener(captureDownload)

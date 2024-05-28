import { For, render } from 'solid-js/web'
import { FileIcon, ServerInfo, ServerInfos, aria2Add, fmtSize, getStorage } from '../src/util'
import '../src/index.css'
import { Suspense, createResource, createSelector, createSignal } from 'solid-js'

type Info = {
  fileName: string
  url: string
  fileSize: number
  referrer: string
  storeId: string
}

const Confirm = () => {
  const fetcher = async () => {
    const serverInfos: ServerInfos = await getStorage()
    return serverInfos
  }
  const [serverInfos] = createResource(fetcher)

  const query = new URLSearchParams(window.location.search)
  const info: Info = JSON.parse(query.get('info') || '')

  const ext = info.fileName.substring(info.fileName.lastIndexOf('.') + 1)

  const [finalName, setFinalName] = createSignal(info.fileName)

  const [sendError, setSendError] = createSignal<string[]>([])

  const isSendError = createSelector<string[], string>(sendError, (str, data) =>
    data.some(v => v === str),
  )

  const getCookie = async (url: string, storeId: string) => {
    const cookies = await chrome.cookies.getAll({ url, storeId })
    console.log(cookies)
    return cookies.reduce((pre, cur) => {
      pre += cur.name + ':' + cur.value + ';'
      return pre
    }, '')
  }

  const handleClick = async (item: ServerInfo) => {
    const cookie = await getCookie(info.referrer, info.storeId)
    console.log(cookie)
    aria2Add(item.url, {
      url: info.url,
      name: finalName(),
      token: item.token,
      referrer: info.referrer,
      cookie,
    })
      .then(() => window.close())
      .catch(() => {
        const errorData = [...sendError()]
        errorData.push(item.title)
        setSendError(errorData)
      })
  }

  return (
    <div class="flex h-screen w-screen flex-row">
      <div class="flex h-full w-1/3 flex-col bg-secondary">
        <div class="item flex h-4/5 w-full items-center justify-center">
          <FileIcon ext={ext} class="text-xxl" />
        </div>
        <div class="flex h-1/5 w-full items-center justify-center">
          <span class="flex items-center justify-center rounded-xl bg-dark-box px-4 py-2 text-2xl font-semibold shadow-lg">
            {fmtSize(info.fileSize)}
          </span>
        </div>
      </div>
      <div class="flex h-full w-2/3 flex-col">
        <input
          onChange={e => setFinalName(e.target.value)}
          class="h-1/2 w-full rounded-md bg-dark py-3 pl-6 pr-10 text-center text-3xl text-[#43a047] shadow-lg focus:outline-none focus:ring-1"
          value={info.fileName}
          placeholder="FileName..."
        />
        <div class="flex h-1/2 w-full flex-wrap items-center justify-center gap-6 py-3">
          <Suspense>
            <For each={serverInfos()}>
              {item => (
                <p
                  onClick={() => handleClick(item)}
                  class={`flex cursor-pointer items-center hover:bg-hover  ${isSendError(item.title) ? 'bg-error' : 'bg-dark-box'} justify-center rounded-3xl px-4 py-2 text-2xl font-semibold duration-300 ease-linear`}
                >
                  {item.title}
                </p>
              )}
            </For>
          </Suspense>
        </div>
      </div>
    </div>
  )
}

const root = document.getElementById('confirm')

render(() => <Confirm />, root!)

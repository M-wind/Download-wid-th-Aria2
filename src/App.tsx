import { Plus, ServerInfos, Trash, getStorage, setStorage } from './util'
import { createAutoAnimate } from '@formkit/auto-animate/solid'

import 'overlayscrollbars/overlayscrollbars.css'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-solid'
import { For, Show, createResource, createSignal } from 'solid-js'
import CreateServer from './CreateServer'

const App = () => {
  const [flag, setFlag] = createSignal(false)

  const [parent] = createAutoAnimate()

  const fetcher = async () => {
    const serverInfos: ServerInfos = await getStorage()
    return serverInfos
  }

  const [serverInfos, { refetch }] = createResource(fetcher)

  const deleteServer = async (title: string) => {
    const newServerInfo = serverInfos()?.filter(v => v.title !== title)
    await setStorage(newServerInfo)
    refetch()
  }

  const onBack = (flag: boolean) => {
    refetch()
    setFlag(flag)
  }

  return (
    <div ref={parent} class="flex h-full w-full flex-col gap-3 rounded-lg p-2">
      <Show when={!flag()} fallback={<CreateServer onBack={onBack} />}>
        <div class="flex h-14 w-full items-center rounded-lg bg-dark-box px-2">
          <div class="flex items-center text-lg">{chrome.i18n.getMessage('server')}</div>
          <div class="grow" />
          <div
            onClick={() => setFlag(!flag())}
            class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg duration-300 ease-linear hover:bg-dark"
          >
            <Plus class="text-2xl" />
          </div>
        </div>
        <OverlayScrollbarsComponent
          defer
          element="span"
          options={{ scrollbars: { autoHide: 'scroll', theme: 'os-theme-light' } }}
        >
          <Show when={serverInfos.state === 'ready'}>
            <For each={serverInfos()}>
              {item => (
                <div class="w-full gap-2">
                  <div class="flex h-20 w-full items-center rounded-lg px-2 duration-300 ease-linear hover:bg-dark-box">
                    <div class="flex h-full w-12 items-center justify-center">
                      <span class="h-3 w-3 rounded-full bg-hover opacity-75"></span>
                    </div>
                    <div class="flex h-full w-calc-grow flex-col px-1">
                      <div class="flex h-1/2 w-full items-end text-lg">
                        <p class="truncate">{item.title}</p>
                      </div>
                      <div class="flex h-1/2 w-full text-sm text-dark-scecond">
                        <p class="truncate">{item.url}</p>
                      </div>
                    </div>
                    <div
                      onClick={() => deleteServer(item.title)}
                      class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg duration-300 ease-linear hover:bg-dark"
                    >
                      <Trash class="text-xl" />
                    </div>
                  </div>
                </div>
              )}
            </For>
          </Show>
        </OverlayScrollbarsComponent>
      </Show>
    </div>
  )
}

export default App

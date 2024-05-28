import { batch } from 'solid-js'
import { createStore } from 'solid-js/store'
import { ReturnBack, Save, ServerInfos, aria2Status, getStorage, setStorage } from './util'
import Selector from './Selector'

const CreateServer = (props: { onBack: (flag: boolean) => void }) => {
  type AriaInvalid = boolean | undefined

  const [serverInfo, setServerInfo] = createStore<{
    title: string
    protocal: string
    host: string
    port: string
    pathname: string
    token: string
    invalid: {
      title: AriaInvalid
      host: AriaInvalid
      port: AriaInvalid
    }
  }>({
    title: '',
    protocal: 'http',
    host: '',
    port: '6800',
    pathname: 'jsonrpc',
    token: '',
    invalid: {
      title: undefined,
      host: undefined,
      port: undefined,
    },
  })

  const handleSubmit = async () => {
    if (
      serverInfo.invalid.title === undefined &&
      serverInfo.invalid.host === undefined &&
      serverInfo.invalid.port === undefined
    ) {
      batch(() => {
        setServerInfo('invalid', 'title', true)
        setServerInfo('invalid', 'host', true)
        setServerInfo('invalid', 'port', false)
      })
      return
    }
    if (serverInfo.invalid.title || serverInfo.invalid.host || serverInfo.invalid.port) return
    const serverInfos: ServerInfos = await getStorage()
    const contains = serverInfos.some(v => v.title === serverInfo.title)
    if (contains) {
      batch(() => {
        setServerInfo('title', '')
        setServerInfo('invalid', 'title', true)
      })
      return
    }
    const url =
      serverInfo.protocal + '://' + serverInfo.host + ':' + serverInfo.port + '/' + serverInfo.pathname
    const ok = await aria2Status(url, serverInfo.token)
    if (!ok) return
    const info = {
      title: serverInfo.title,
      url,
      token: serverInfo.token,
    }
    serverInfos.push(info)
    await setStorage(serverInfos)
    props.onBack(false)
  }

  const protocalData = [
    {
      Name: 'http',
      Value: 'http',
    },
    {
      Name: 'https',
      Value: 'https',
    },
  ]

  return (
    <>
      <div class="flex h-14 w-full items-center rounded-lg bg-dark-box px-2">
        <div
          onClick={() => props.onBack(false)}
          class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg duration-300 ease-linear hover:bg-dark"
        >
          <ReturnBack class="text-2xl" />
        </div>
        <div class="grow" />
        <div
          onClick={handleSubmit}
          class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg duration-300 ease-linear hover:bg-dark"
        >
          <Save class="text-2xl" />
        </div>
      </div>
      <input
        onChange={e => {
          const value = e.target.value.trim()
          if (value !== '') {
            setServerInfo('title', value)
          }
          setServerInfo('invalid', 'title', value === '')
        }}
        aria-invalid={serverInfo.invalid.title}
        placeholder={chrome.i18n.getMessage('title')}
        class="h-16 w-full rounded-lg bg-dark-box px-2 text-lg outline-none placeholder:text-dark-scecond focus:ring-1 focus:ring-primary aria-[invalid=false]:ring-1 aria-[invalid=true]:ring-1 aria-[invalid=false]:ring-hover aria-[invalid=true]:ring-error"
      />
      <div class="flex h-16 w-full flex-row rounded-lg bg-dark-box pl-2">
        <p class="flex h-full w-1/2 items-center text-lg">{chrome.i18n.getMessage('protocal')}</p>
        <div class="h-full w-1/2">
          <Selector
            data={protocalData}
            default="http"
            onSelect={v => setServerInfo('protocal', v.Value)}
          />
        </div>
      </div>
      <input
        onChange={e => {
          const value = e.target.value.trim()
          if (value !== '') {
            setServerInfo('host', value)
          }
          setServerInfo('invalid', 'host', value === '')
        }}
        aria-invalid={serverInfo.invalid.host}
        placeholder={chrome.i18n.getMessage('host')}
        class="h-16 w-full rounded-lg bg-dark-box px-2 text-lg outline-none placeholder:text-dark-scecond focus:ring-1 focus:ring-primary aria-[invalid=false]:ring-1 aria-[invalid=true]:ring-1 aria-[invalid=false]:ring-hover aria-[invalid=true]:ring-error"
      />
      <div class="flex h-16 w-full flex-row">
        <input
          onChange={e => {
            const value = e.target.value.trim()
            const regx =
              /^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/
            if (regx.test(value)) {
              setServerInfo('port', value)
            }
            setServerInfo('invalid', 'port', !regx.test(value))
          }}
          aria-invalid={serverInfo.invalid.port}
          placeholder={chrome.i18n.getMessage('port')}
          value={6800}
          class="h-16 w-[45%] rounded-lg bg-dark-box px-2 text-lg outline-none placeholder:text-dark-scecond focus:ring-1 focus:ring-primary aria-[invalid=false]:ring-1 aria-[invalid=true]:ring-1 aria-[invalid=false]:ring-hover aria-[invalid=true]:ring-error"
        />
        <div class="-z-10 flex h-16 w-[10%] items-center justify-center bg-dark text-lg">/</div>
        <input
          onChange={e => setServerInfo('pathname', e.target.value.trim())}
          value="jsonrpc"
          placeholder={chrome.i18n.getMessage('path')}
          class="h-16 w-[45%] rounded-lg bg-dark-box px-2 text-lg outline-none placeholder:text-dark-scecond focus:ring-1 focus:ring-primary"
        />
      </div>
      <input
        onChange={e => setServerInfo('token', e.target.value.trim())}
        placeholder={chrome.i18n.getMessage('token')}
        class="h-16 w-full rounded-lg bg-dark-box px-2 text-lg outline-none placeholder:text-dark-scecond focus:ring-1 focus:ring-primary"
      />
    </>
  )
}

export default CreateServer

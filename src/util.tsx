import { type JSX } from 'solid-js'
import http from './http'

export const aria2Status = async (url: string, token?: string) => {
  const res = await http.post(url, {
    params: {
      id: 'sendToAria2',
      jsonrpc: '2.0',
      method: 'aria2.getGlobalStat',
      params: token && token !== '' ? [`token:${token}`] : [],
    },
  })
  return res.ok
}

export const setStorage = (data: any) => chrome.storage.local.set({ serverInfo: data })
export const getStorage = async () => {
  const d = await chrome.storage.local.get('serverInfo')
  return d.serverInfo
}

export type ServerInfo = {
  title: string
  url: string
  token?: string
}

export type ServerInfos = ServerInfo[]

type Aria2Param = {
  name?: string
  token?: string
  referrer?: string
  cookie?: string
  url: string
}

const zipParam = (params: Aria2Param) => {
  let data = []
  if (params.token && params.token !== '') data.push(`token:${params.token}`)
  data.push([params.url])
  let options: { [index: string]: any } = {}
  if (params.name && params.name !== '') options.out = params.name
  let header: string[] = []
  if (params.referrer && params.referrer !== '') header.push(`Referer: ${params.referrer}`)
  if (params.cookie && params.cookie !== '') header.push(`Cookie: ${params.cookie}`)
  options.header = header
  data.push(options)
  return data
}

export const aria2Add = async (url: string, params: Aria2Param) => {
  const res = await http.post(url, {
    params: {
      id: 'sendToAria2',
      jsonrpc: '2.0',
      method: 'aria2.addUri',
      params: zipParam(params),
    },
  })
  return res.ok
}

export const fmtSize = (size: number) => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let unit = 0
  while (size > 1024) {
    size /= 1024
    unit++
  }
  return `${size.toFixed(2)} ${units[unit]}`
}

interface Icontype extends IconProps {
  ext: string
}

export const FileIcon = (props: Icontype) => {
  const type = fileType[props.ext] || 'file'
  switch (type) {
    case 'audio':
      return <Audio {...props} />
    case 'video':
      return <Video {...props} />
    case 'csv':
      return <Csv {...props} />
    case 'world':
      return <Word {...props} />
    case 'excel':
      return <Excel {...props} />
    case 'powerpoint':
      return <Powerpoint {...props} />
    case 'code':
      return <Code {...props} />
    case 'image':
      return <Image {...props} />
    case 'pdf':
      return <Pdf {...props} />
    case 'archive':
      return <Archive {...props} />
    default:
      return <File {...props} />
  }
}

const fileType: {
  [index: string]: string
} = {
  mp3: 'audio',
  wav: 'audio',
  flac: 'audio',
  ogg: 'audio',
  m4a: 'audio',
  ape: 'audio',
  oga: 'audio',

  html: 'code',
  css: 'code',
  js: 'code',
  json: 'code',
  jsx: 'code',
  ts: 'code',
  tsx: 'code',
  php: 'code',
  py: 'code',
  rb: 'code',
  java: 'code',
  c: 'code',
  cpp: 'code',
  h: 'code',
  hpp: 'code',
  cs: 'code',
  go: 'code',
  swift: 'code',
  kt: 'code',
  sh: 'code',
  yml: 'code',
  yaml: 'code',
  toml: 'code',

  zip: 'archive',
  rar: 'archive',
  '7z': 'archive',
  gz: 'archive',
  tar: 'archive',
  bz2: 'archive',
  xz: 'archive',
  z: 'archive',

  jpg: 'image',
  jpeg: 'image',
  png: 'image',
  gif: 'image',
  bmp: 'image',
  psd: 'image',
  ai: 'image',
  tiff: 'image',
  svg: 'image',
  ico: 'image',
  webp: 'image',

  mp4: 'video',
  avi: 'video',
  mkv: 'video',
  mov: 'video',
  flv: 'video',
  wmv: 'video',
  webm: 'video',
  rmvb: 'video',
  rm: 'video',

  csv: 'csv',

  ppt: 'powerpoint',
  pptx: 'powerpoint',

  doc: 'word',
  docx: 'word',

  xls: 'excel',
  xlsx: 'excel',

  pdf: 'pdf',
}

type SVGSVGElementTags = JSX.SVGElementTags['svg']

export interface IconProps extends SVGSVGElementTags {
  size?: string | number
  color?: string
  title?: string
  style?: JSX.CSSProperties
}

const Audio = (props: IconProps) => {
  return (
    <svg
      fill={props.color || 'currentColor'}
      stroke-width="0"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 384 512"
      height={props.size || '1em'}
      width={props.size || '1em'}
      style={{ overflow: 'visible', ...props.style }}
      class={props.class}
    >
      <path d="M64 0C28.7 0 0 28.7 0 64v384c0 35.3 28.7 64 64 64h256c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zm192 0v128h128L256 0zm2 226.3c37.1 22.4 62 63.1 62 109.7s-24.9 87.3-62 109.7c-7.6 4.6-17.4 2.1-22-5.4s-2.1-17.4 5.4-22c28-16.8 46.6-47.4 46.6-82.3s-18.6-65.5-46.5-82.3c-7.6-4.6-10-14.4-5.4-22s14.4-10 22-5.4zm-91.9 30.9c6 2.5 9.9 8.3 9.9 14.8v128c0 6.5-3.9 12.3-9.9 14.8s-12.9 1.1-17.4-3.5L113.4 376H80c-8.8 0-16-7.2-16-16v-48c0-8.8 7.2-16 16-16h33.4l35.3-35.3c4.6-4.6 11.5-5.9 17.4-3.5zm51 34.9c6.6-5.9 16.7-5.3 22.6 1.3 10.1 11.2 16.3 26.2 16.3 42.6s-6.2 31.4-16.3 42.7c-5.9 6.6-16 7.1-22.6 1.3s-7.1-16-1.3-22.6c5.1-5.7 8.1-13.1 8.1-21.3s-3.1-15.7-8.1-21.3c-5.9-6.6-5.3-16.7 1.3-22.6z"></path>
    </svg>
  )
}

const Code = (props: IconProps) => {
  return (
    <svg
      fill={props.color || 'currentColor'}
      stroke-width="0"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 384 512"
      height={props.size || '1em'}
      width={props.size || '1em'}
      style={{ overflow: 'visible', ...props.style }}
      class={props.class}
    >
      <path d="M64 0C28.7 0 0 28.7 0 64v384c0 35.3 28.7 64 64 64h256c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zm192 0v128h128L256 0zM153 289l-31 31 31 31c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0L71 337c-9.4-9.4-9.4-24.6 0-33.9l48-48c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9zm112-34 48 48c9.4 9.4 9.4 24.6 0 33.9l-48 48c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l31-31-31-31c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0z"></path>
    </svg>
  )
}

const Csv = (props: IconProps) => {
  return (
    <svg
      fill={props.color || 'currentColor'}
      stroke-width="0"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      height={props.size || '1em'}
      width={props.size || '1em'}
      style={{ overflow: 'visible', ...props.style }}
      class={props.class}
    >
      <path d="M0 64C0 28.7 28.7 0 64 0h160v128c0 17.7 14.3 32 32 32h128v144H176c-35.3 0-64 28.7-64 64v144H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0l128 128zM200 352h16c22.1 0 40 17.9 40 40v8c0 8.8-7.2 16-16 16s-16-7.2-16-16v-8c0-4.4-3.6-8-8-8h-16c-4.4 0-8 3.6-8 8v80c0 4.4 3.6 8 8 8h16c4.4 0 8-3.6 8-8v-8c0-8.8 7.2-16 16-16s16 7.2 16 16v8c0 22.1-17.9 40-40 40h-16c-22.1 0-40-17.9-40-40v-80c0-22.1 17.9-40 40-40zm133.1 0H368c8.8 0 16 7.2 16 16s-7.2 16-16 16h-34.9c-7.2 0-13.1 5.9-13.1 13.1 0 5.2 3 9.9 7.8 12l37.4 16.6c16.3 7.2 26.8 23.4 26.8 41.2 0 24.9-20.2 45.1-45.1 45.1H304c-8.8 0-16-7.2-16-16s7.2-16 16-16h42.9c7.2 0 13.1-5.9 13.1-13.1 0-5.2-3-9.9-7.8-12l-37.4-16.6c-16.3-7.2-26.8-23.4-26.8-41.2 0-24.9 20.2-45.1 45.1-45.1zm98.9 0c8.8 0 16 7.2 16 16v31.6c0 23 5.5 45.6 16 66 10.5-20.3 16-42.9 16-66V368c0-8.8 7.2-16 16-16s16 7.2 16 16v31.6c0 34.7-10.3 68.7-29.6 97.6l-5.1 7.7c-3 4.5-8 7.1-13.3 7.1s-10.3-2.7-13.3-7.1l-5.1-7.7c-19.3-28.9-29.6-62.9-29.6-97.6V368c0-8.8 7.2-16 16-16z"></path>
    </svg>
  )
}

const Image = (props: IconProps) => {
  return (
    <svg
      fill={props.color || 'currentColor'}
      stroke-width="0"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 384 512"
      height={props.size || '1em'}
      width={props.size || '1em'}
      style={{ overflow: 'visible', ...props.style }}
      class={props.class}
    >
      <path d="M64 0C28.7 0 0 28.7 0 64v384c0 35.3 28.7 64 64 64h256c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zm192 0v128h128L256 0zM64 256a32 32 0 1 1 64 0 32 32 0 1 1-64 0zm152 32c5.3 0 10.2 2.6 13.2 6.9l88 128c3.4 4.9 3.7 11.3 1 16.5S310 448 304 448H80c-5.8 0-11.1-3.1-13.9-8.1s-2.8-11.2.2-16.1l48-80c2.9-4.8 8.1-7.8 13.7-7.8s10.8 2.9 13.7 7.8l12.8 21.4 48.3-70.2c3-4.3 7.9-6.9 13.2-6.9z"></path>
    </svg>
  )
}

const Excel = (props: IconProps) => {
  return (
    <svg
      fill={props.color || 'currentColor'}
      stroke-width="0"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 384 512"
      height={props.size || '1em'}
      width={props.size || '1em'}
      style={{ overflow: 'visible', ...props.style }}
      class={props.class}
    >
      <path d="M64 0C28.7 0 0 28.7 0 64v384c0 35.3 28.7 64 64 64h256c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zm192 0v128h128L256 0zM155.7 250.2l36.3 51.9 36.3-51.9c7.6-10.9 22.6-13.5 33.4-5.9s13.5 22.6 5.9 33.4L221.3 344l46.4 66.2c7.6 10.9 5 25.8-5.9 33.4s-25.8 5-33.4-5.9L192 385.8l-36.3 51.9c-7.6 10.9-22.6 13.5-33.4 5.9s-13.5-22.6-5.9-33.4l46.3-66.2-46.4-66.2c-7.6-10.9-5-25.8 5.9-33.4s25.8-5 33.4 5.9z"></path>
    </svg>
  )
}

const Pdf = (props: IconProps) => {
  return (
    <svg
      fill={props.color || 'currentColor'}
      stroke-width="0"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      height={props.size || '1em'}
      width={props.size || '1em'}
      style={{ overflow: 'visible', ...props.style }}
      class={props.class}
    >
      <path d="M0 64C0 28.7 28.7 0 64 0h160v128c0 17.7 14.3 32 32 32h128v144H176c-35.3 0-64 28.7-64 64v144H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0l128 128zM176 352h32c30.9 0 56 25.1 56 56s-25.1 56-56 56h-16v32c0 8.8-7.2 16-16 16s-16-7.2-16-16V368c0-8.8 7.2-16 16-16zm32 80c13.3 0 24-10.7 24-24s-10.7-24-24-24h-16v48h16zm96-80h32c26.5 0 48 21.5 48 48v64c0 26.5-21.5 48-48 48h-32c-8.8 0-16-7.2-16-16V368c0-8.8 7.2-16 16-16zm32 128c8.8 0 16-7.2 16-16v-64c0-8.8-7.2-16-16-16h-16v96h16zm80-112c0-8.8 7.2-16 16-16h48c8.8 0 16 7.2 16 16s-7.2 16-16 16h-32v32h32c8.8 0 16 7.2 16 16s-7.2 16-16 16h-32v48c0 8.8-7.2 16-16 16s-16-7.2-16-16V368z"></path>
    </svg>
  )
}

const Powerpoint = (props: IconProps) => {
  return (
    <svg
      fill={props.color || 'currentColor'}
      stroke-width="0"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 384 512"
      height={props.size || '1em'}
      width={props.size || '1em'}
      style={{ overflow: 'visible', ...props.style }}
      class={props.class}
    >
      <path d="M64 0C28.7 0 0 28.7 0 64v384c0 35.3 28.7 64 64 64h256c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zm192 0v128h128L256 0zM136 240h68c42 0 76 34 76 76s-34 76-76 76h-44v32c0 13.3-10.7 24-24 24s-24-10.7-24-24V264c0-13.3 10.7-24 24-24zm68 104c15.5 0 28-12.5 28-28s-12.5-28-28-28h-44v56h44z"></path>
    </svg>
  )
}

const Video = (props: IconProps) => {
  return (
    <svg
      fill={props.color || 'currentColor'}
      stroke-width="0"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 384 512"
      height={props.size || '1em'}
      width={props.size || '1em'}
      style={{ overflow: 'visible', ...props.style }}
      class={props.class}
    >
      <path d="M64 0C28.7 0 0 28.7 0 64v384c0 35.3 28.7 64 64 64h256c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zm192 0v128h128L256 0zM64 288c0-17.7 14.3-32 32-32h96c17.7 0 32 14.3 32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32v-96zm236.9 109.9L256 368v-64l44.9-29.9c2-1.3 4.4-2.1 6.8-2.1 6.8 0 12.3 5.5 12.3 12.3v103.4c0 6.8-5.5 12.3-12.3 12.3-2.4 0-4.8-.7-6.8-2.1z"></path>
    </svg>
  )
}

const Word = (props: IconProps) => {
  return (
    <svg
      fill={props.color || 'currentColor'}
      stroke-width="0"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 384 512"
      height={props.size || '1em'}
      width={props.size || '1em'}
      style={{ overflow: 'visible', ...props.style }}
      class={props.class}
    >
      <path d="M64 0C28.7 0 0 28.7 0 64v384c0 35.3 28.7 64 64 64h256c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zm192 0v128h128L256 0zM111 257.1l26.8 89.2 31.6-90.3c3.4-9.6 12.5-16.1 22.7-16.1s19.3 6.4 22.7 16.1l31.6 90.3 26.6-89.2c3.8-12.7 17.2-19.9 29.9-16.1s19.9 17.2 16.1 29.9l-48 160c-3 10-12 16.9-22.4 17.1s-19.8-6.2-23.2-16.1L192 336.6l-33.3 95.3c-3.4 9.8-12.8 16.3-23.2 16.1s-19.5-7.1-22.4-17.1l-48-160c-3.8-12.7 3.4-26.1 16.1-29.9s26.1 3.4 29.9 16.1z"></path>
    </svg>
  )
}

const Archive = (props: IconProps) => {
  return (
    <svg
      fill={props.color || 'currentColor'}
      stroke-width="0"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 384 512"
      height={props.size || '1em'}
      width={props.size || '1em'}
      style={{ overflow: 'visible', ...props.style }}
      class={props.class}
    >
      <path d="M64 0C28.7 0 0 28.7 0 64v384c0 35.3 28.7 64 64 64h256c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zm192 0v128h128L256 0zM96 48c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16s-7.2 16-16 16h-32c-8.8 0-16-7.2-16-16zm0 64c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16s-7.2 16-16 16h-32c-8.8 0-16-7.2-16-16zm0 64c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16s-7.2 16-16 16h-32c-8.8 0-16-7.2-16-16zm-6.3 71.8c3.7-14 16.4-23.8 30.9-23.8h14.8c14.5 0 27.2 9.7 30.9 23.8l23.5 88.2c1.4 5.4 2.1 10.9 2.1 16.4 0 35.2-28.8 63.7-64 63.7s-64-28.5-64-63.7c0-5.5.7-11.1 2.1-16.4l23.5-88.2zM112 336c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16h-32z"></path>
    </svg>
  )
}

const File = (props: IconProps) => {
  return (
    <svg
      fill={props.color || 'currentColor'}
      stroke-width="0"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 384 512"
      height={props.size || '1em'}
      width={props.size || '1em'}
      style={{ overflow: 'visible', ...props.style }}
      class={props.class}
    >
      <path d="M0 64C0 28.7 28.7 0 64 0h160v128c0 17.7 14.3 32 32 32h128v288c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0l128 128z"></path>
    </svg>
  )
}

export const Plus = (props: IconProps) => {
  return (
    <svg
      fill={props.color || 'currentColor'}
      stroke-width="0"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 448 512"
      height={props.size || '1em'}
      width={props.size || '1em'}
      style={{ overflow: 'visible', ...props.style }}
      class={props.class}
    >
      <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32v144H48c-17.7 0-32 14.3-32 32s14.3 32 32 32h144v144c0 17.7 14.3 32 32 32s32-14.3 32-32V288h144c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"></path>
    </svg>
  )
}

export const Trash = (props: IconProps) => {
  return (
    <svg
      fill={props.color || 'currentColor'}
      stroke-width="0"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      height={props.size || '1em'}
      width={props.size || '1em'}
      style={{ overflow: 'visible', ...props.style }}
      class={props.class}
    >
      <path
        fill="currentColor"
        fill-rule="evenodd"
        d="M17 5V4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v1H4a1 1 0 0 0 0 2h1v11a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V7h1a1 1 0 1 0 0-2h-3Zm-2-1H9v1h6V4Zm2 3H7v11a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V7Z"
        clip-rule="evenodd"
      ></path>
      <path fill="currentColor" d="M9 9h2v8H9V9ZM13 9h2v8h-2V9Z"></path>
    </svg>
  )
}

export const Save = (props: IconProps) => {
  return (
    <svg
      fill={props.color || 'currentColor'}
      stroke-width="0"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      height={props.size || '1em'}
      width={props.size || '1em'}
      style={{ overflow: 'visible', ...props.style }}
      class={props.class}
    >
      <path d="m465.94 119.76-73.7-73.7A47.68 47.68 0 0 0 358.3 32H96a64 64 0 0 0-64 64v320a64 64 0 0 0 64 64h320a64 64 0 0 0 64-64V153.7a47.68 47.68 0 0 0-14.06-33.94ZM120 112h176a8 8 0 0 1 8 8v48a8 8 0 0 1-8 8H120a8 8 0 0 1-8-8v-48a8 8 0 0 1 8-8Zm139.75 319.91a80 80 0 1 1 76.16-76.16 80.06 80.06 0 0 1-76.16 76.16Z"></path>
      <path d="M256 304A48 48 0 1 0 256 400 48 48 0 1 0 256 304z"></path>
    </svg>
  )
}
export const ReturnBack = (props: IconProps) => {
  return (
    <svg
      fill={props.color || 'currentColor'}
      stroke-width="0"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      height={props.size || '1em'}
      width={props.size || '1em'}
      style={{ overflow: 'visible', ...props.style }}
      class={props.class}
    >
      <path d="M177.5 414c-8.8 3.8-19 2-26-4.6l-144-136C2.7 268.9 0 262.6 0 256s2.7-12.9 7.5-17.4l144-136c7-6.6 17.2-8.4 26-4.6s14.5 12.5 14.5 22v72h288c17.7 0 32 14.3 32 32v64c0 17.7-14.3 32-32 32H192v72c0 9.6-5.7 18.2-14.5 22z"></path>
    </svg>
  )
}

export const FaSolidCheck = (props: IconProps) => {
  return (
    <svg
      fill={props.color || 'currentColor'}
      stroke-width="0"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 448 512"
      height={props.size || '1em'}
      width={props.size || '1em'}
      style={{ overflow: 'visible', ...props.style }}
      class={props.class}
    >
      <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7l233.4-233.3c12.5-12.5 32.8-12.5 45.3 0z"></path>
    </svg>
  )
}

export const FaSolidAngleDown = (props: IconProps) => {
  return (
    <svg
      fill={props.color || 'currentColor'}
      stroke-width="0"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 448 512"
      height={props.size || '1em'}
      width={props.size || '1em'}
      style={{ overflow: 'visible', ...props.style }}
      class={props.class}
    >
      <path d="M201.4 342.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 274.7 86.6 137.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"></path>
    </svg>
  )
}

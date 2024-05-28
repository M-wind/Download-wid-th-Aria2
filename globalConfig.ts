// Chrome Extension 最终build目录
export const CRX_OUTDIR = 'dist'
// 临时build content script的目录
export const CRX_CONFIRM_OUTDIR = '_dist_confirm'
// 临时build background script的目录
export const CRX_BACKGROUND_OUTDIR = '_dist_background'

export const endWith = (name: string, str: string) => {
  const index = name.lastIndexOf(str)
  return name.length === index + str.length
}

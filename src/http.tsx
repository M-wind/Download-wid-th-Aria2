type stringObj = {
  [index: string]: string
}

type Default = {
  baseUrl?: string
  headers: stringObj
}

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS' | 'HEAD'
type ResponseType = 'json' | 'text' | 'arrayBuffer' | 'blob'

type Options = {
  headers?: stringObj
  params?: {}
  responseType?: ResponseType
}

type HttpResponse<T> = {
  ok: boolean
  status: number
  statusText: string
  headers: Headers
  url: string
  data: Promise<T>
}

class http {
  private static default: Default = {
    baseUrl: undefined,
    headers: {},
  }

  public static setBaseUrl = function (url: string) {
    http.default.baseUrl = url
  }

  public static getBaseUrl = function () {
    return http.default.baseUrl || window.location.origin
  }

  public static setHeader = function (name: string, val: string) {
    http.default.headers[name] = val
  }

  public static getHeader = function (name: string) {
    return http.default.headers[name] || undefined
  }

  private static isUrl = function (url: string) {
    try {
      return !!new URL(url)
    } catch (error) {
      return false
    }
  }

  private static getUrl = function (url: string) {
    let address = ''
    if (http.isUrl(url)) {
      address = url
    } else {
      address = http.getBaseUrl() + url
    }
    return address
  }

  public static get = function <T = any>(url: string, config?: Options) {
    let address = http.getUrl(url)
    const c = new URLSearchParams(config?.params).toString()
    address = c ? address + '?' + c : address
    return http.send<T>(address, 'GET', { ...config, params: undefined })
  }

  public static post = function <T = any>(url: string, config?: Options) {
    const address = http.getUrl(url)
    return http.send<T>(address, 'POST', config)
  }

  public static delete = function <T = any>(url: string, config?: Options) {
    const address = http.getUrl(url)
    const c = new URLSearchParams(config?.params).toString()
    return http.send<T>(address + '?' + c, 'DELETE', {
      ...config,
      params: undefined,
    })
  }

  private static getData = function (type: ResponseType, res: Response): Promise<any> {
    switch (type) {
      case 'json':
        return res.json()
      case 'text':
        return res.text()
      case 'arrayBuffer':
        return res.arrayBuffer()
      case 'blob':
        return res.blob()
      default:
        return res.json()
    }
  }

  private static send = async function <T>(
    url: string,
    method: Method,
    config?: Options,
  ): Promise<HttpResponse<T>> {
    const headers = {
      'Content-Type': 'application/json;charset=utf-8',
      ...http.default.headers,
      ...config?.headers,
    }

    const responseType = config?.responseType || 'json'

    const res = await fetch(url, {
      method,
      headers,
      body: JSON.stringify(config?.params),
    })
    if (res.ok) {
      return Promise.resolve({
        ok: res.ok,
        status: res.status,
        statusText: res.statusText,
        headers: res.headers,
        url: res.url,
        data: res.status === 204 ? Promise.resolve() : http.getData(responseType, res),
      })
    }
    return Promise.reject(res)
  }
}

export default http

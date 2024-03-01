/**
 * This module exports HTTP requests utility functions.
 * These utilities handle common tasks such as building request URLs, sending the requests, and processing
 * the responses.
 * They ensure proper error handling by checking the response status and converting error messages
 * into meaningful exceptions.
 * The environment variable API_URL is used to define the base API endpoint, and an error is thrown during module
 * initialization if API_URL is not defined.
 */

export const publicApiUrl = process.env.PHOSPHOR_PUBLIC_API_URL
if (!publicApiUrl) {
  throw new Error('PHOSPHOR_PUBLIC_API_URL is not defined')
}
export const privateApiUrl = process.env.PHOSPHOR_ADMIN_API_URL
if (!privateApiUrl) {
  throw new Error('PHOSPHOR_ADMIN_API_URL is not defined')
}

export const phosphorHeaders = {
  'Content-Type': 'application/json',
  'Phosphor-Api-Key': process.env.PHOSPHOR_API_KEY!,
}

/**
 * Sends a GET request to the specified path and returns the result as JSON.
 */
export const apiPublicGET = <TResult>(
  path: string,
  headers: HeadersInit = phosphorHeaders,
) => {
  return apiGET<TResult>(publicApiUrl, path, headers)
}
export const apiPrivateGET = <TResult>(
  path: string,
  headers: HeadersInit = phosphorHeaders,
) => {
  return apiGET<TResult>(privateApiUrl, path, headers)
}

export const apiGET = <TResult>(
  apiUrl: string,
  path: string,
  headers?: HeadersInit,
) => {
  const url = new URL(path, apiUrl)
  const init = {
    method: 'GET',
    headers,
  }

  return fetch(url, init).then(checkResponse).then<TResult>(toJSON)
}

/**
 * Sends a POST request with a JSON body to the specified path and returns the result as JSON.
 */
export const apiPublicPOST = <TResult, TBody = any>(
  path: string,
  body: TBody,
  headers: HeadersInit = phosphorHeaders,
) => {
  return apiPOST<TResult>(publicApiUrl, path, body, headers)
}

export const apiPrivatePOST = <TResult, TBody = any>(
  path: string,
  body: TBody,
  headers: HeadersInit = phosphorHeaders,
) => {
  return apiPOST<TResult>(privateApiUrl, path, body, headers)
}

export const apiPOST = <TResult, TBody = any>(
  apiUrl: string,
  path: string,
  body: TBody,
  headers?: HeadersInit,
) => {
  const url = new URL(path, apiUrl)
  const options = {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  }

  return fetch(url, options).then(checkResponse).then<TResult>(toJSON)
}

export const apiPublicPATCH = <TResult, TBody = any>(
  path: string,
  body: TBody,
  headers: HeadersInit = phosphorHeaders,
) => {
  return apiPATCH<TResult>(publicApiUrl, path, body, headers)
}

export const apiPrivatePATCH = <TResult, TBody = any>(
  path: string,
  body: TBody,
  headers: HeadersInit = phosphorHeaders,
) => {
  return apiPATCH<TResult>(privateApiUrl, path, body, headers)
}

export const apiPATCH = <TResult, TBody = any>(
  apiUrl: string,
  path: string,
  body: TBody,
  headers?: HeadersInit,
) => {
  const url = new URL(path, apiUrl)
  const options = {
    method: 'PATCH',
    headers,
    body: JSON.stringify(body),
  }

  return fetch(url, options).then(checkResponse).then<TResult>(toJSON)
}

/**
 * Parses the response body as JSON.
 */
export const toJSON = async <TResult>(response: Response) =>
  (await response.json()) as TResult

/**
 * Checks if the fetch response is OK. If not, parses the error message and throws an appropriate error
 */
export const checkResponse = async (response: Response) => {
  if (!response.ok) {
    const errorObj = await toJSON<{ error: string }>(response)
    const message = errorObj.error || response.statusText
    throw new Error(`${message} (status: ${response.status})`)
  }

  return response
}

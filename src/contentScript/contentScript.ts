const scriptElement = document.createElement('script')
scriptElement.src = chrome.runtime.getURL('injected.js')
scriptElement.onload = function () {
  scriptElement.remove() // Clean up after injection
}
;(document.head || document.documentElement).appendChild(scriptElement)

let port = undefined

function sleep(ms: number): Promise<unknown> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

const windowListener = async ({ data, source }) => {
  if (source !== window || origin !== window.location.origin) {
    return
  }
  const postMessage = async (
    data
  ): Promise<void> => {
    const message =
      data && typeof data !== undefined
        ? JSON.parse(JSON.stringify(data))
        : data
    try {
      if (!port) {
        // Port was reinitialized, force retry
        throw new Error()
      }
      port.postMessage(message)
    } catch (error) {
        await sleep(30);
      return postMessage(message)
    }
  }

  return postMessage(data)
}

window.addEventListener('message', (message) => {
    windowListener(message)
})

const init = () => {
  port = chrome.runtime.connect({ name: 'provider' })
  port.onMessage.addListener((message: any): void => {
    console.log('prot message', message)
  })
}

init()

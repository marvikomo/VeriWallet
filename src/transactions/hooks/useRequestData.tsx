import React, { useState, useEffect } from 'react'

function useRequestData() {
    const [request, setRequest] = useState()

  useEffect(() => {
    const port = chrome.runtime.connect({ name: 'popup' })
    console.log('new>> port', port)
    port.postMessage({ type: 'REQUEST_POPUP_DATA' })

    port.onMessage.addListener((msg) => {
      if (msg.type === 'NEW_DATA') {
        console.log('msg>>>>', msg)
        setRequest(msg)
        //dispatch(setRequestData(msg.payload));
      }
    })

    return () => port.disconnect()
  }, [])

  return {
      request
  }
}


export default useRequestData

import { v4 as uuid } from 'uuid';

export const extensionInstances = {};
export const providerInstances = {};

export const handleEvent = (port, controller):any => {
  const id = uuid()
  //To prevent cross site
  if (port.name !== 'provider') {
    throw new Error('Unknow origin')
  }

  const url = new URL(port?.sender?.url)
  providerInstances[id] = {
    port,
    tabId: port?.sender?.tab?.id,
    windowId: port?.sender?.tab?.windowId,
    origin: url.origin,
    urlHostName: url.hostname,
  }

  console.log("providerInstances", providerInstances)

  const messageListener = async ({request, data}: any, port: any) => {

    let response = await controller.handler(request, port, uuid());
  
    port.postMessage({type: 'REQUEST_POPUP_DATA', id: response});

  }

  port.onMessage.addListener(messageListener);



  port.onDisconnect.addListener((port) => {
    console.log("disconecting...")
    port.onMessage.removeListener(messageListener);
    delete providerInstances[id];
  })

}

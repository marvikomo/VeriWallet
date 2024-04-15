import { v4 as uuid } from 'uuid';

export const extensionInstances = {};
export const providerInstances = {};

export const handleEvent = (port, controller) => {
    console.log("came to handle event...")
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

  const messageListener = (message: any, port: any) => {
    controller.handler(message, port, id);
  }

  port.onMessage.addListener(messageListener);

  port.onDisconnect.addListener((port) => {
    port.onMessage.removeListener(messageListener);
    delete providerInstances[id];
  })

}

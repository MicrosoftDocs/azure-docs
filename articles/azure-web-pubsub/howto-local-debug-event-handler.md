---
title: How to troubleshoot and debug Azure Web PubSub event handler locally 
description: Guidance about debugging event handler locally when developing with Azure Web PubSub service.
author: vicancy
ms.author: lianwei
ms.service: azure-web-pubsub
ms.topic: how-to 
ms.date: 3/13/2022
---

# How to troubleshoot and debug Azure Web PubSub event handler locally

When a WebSocket connection connects to Web PubSub service, the service formulates an HTTP POST request to the registered upstream and expects an HTTP response. We call the upstream as the **event handler** and the **event handler** is responsible to handle the incoming events following the [Web PubSub CloudEvents specification](./reference-cloud-events.md).

When the **event handler** runs locally, the local server is not publicly accessible so we need some tunnel tool to help expose localhost publicly so that the Web PubSub service can reach it.

## Use localtunnel to expose localhost

[localtunnel](https://github.com/localtunnel/localtunnel) is an open-source project that help expose your localhost publicly. [Install the tool](https://github.com/localtunnel/localtunnel#installation) and run the follow command (update the `<port>` value to the port your **event handler** listens to):

```bash
lt --port <port> --print-requests
```

localtunnel will print an url (`https://<domain-name>.loca.lt`) that can be accessed from internet, for example, `https://xxx.loca.lt`. And `--print-requests` subcommand prints all the incoming requests so that you can see later if this event handler is successfully invoked.

> [!Tip]
> 
> There is one known issue that [localtunnel goes offline when the server restarts](https://github.com/localtunnel/localtunnel/issues/466) and [here is the workaround](https://github.com/localtunnel/localtunnel/issues/466#issuecomment-1030599216)  

There are also other tools to choose when debugging the webhook locally, for example, [ngrok](https://ngrok.com), [loophole](https://loophole.cloud/docs), [TunnelRelay](https://github.com/OfficeDev/microsoft-teams-tunnelrelay) or so. 


## Test if the event handler is working publicly

Some tools might have issue returning response headers correctly. Try the following command to see if the tool is working properly:

```bash
curl https://<domain-name>.loca.lt/eventhandler -X OPTIONS -H "WebHook-Request-Origin: *" -H "ce-awpsversion: 1.0" --ssl-no-revoke -i
```
`https://<domain-name>.loca.lt/eventhandler` is the path that your **event handler** listens to. Update it if your **event handler** listens to other path.

Check if the response header contains the `webhook-allowed-origin` header. This curl command actually checks if the WebHook [abuse protection request](./reference-cloud-events.md#webhook-validation) responses with the expected header.

## Next steps

[!INCLUDE [next step](includes/include-next-step.md)]
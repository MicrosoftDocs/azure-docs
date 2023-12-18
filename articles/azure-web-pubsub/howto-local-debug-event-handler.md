---
title: How to troubleshoot and debug Azure Web PubSub event handler locally 
description: Guidance about debugging event handler locally when developing with Azure Web PubSub service.
author: vicancy
ms.author: lianwei
ms.service: azure-web-pubsub
ms.topic: how-to 
ms.date: 12/20/2023
---

# How to troubleshoot and debug Azure Web PubSub event handler locally

When a WebSocket connection connects to Web PubSub service, the service formulates an HTTP POST request to the registered upstream and expects an HTTP response. We call the upstream as the **event handler** and the **event handler** is responsible to handle the incoming events following the [Web PubSub CloudEvents specification](./reference-cloud-events.md).

When the **event handler** runs locally, the local server is not publicly accessible.

There are two ways to route the traffic to your localhost, one is to expose localhost to be accessible on the internet using tools such as [ngrok](https://ngrok.com), [localtunnel](https://github.com/localtunnel/localtunnel), or [TunnelRelay](https://github.com/OfficeDev/microsoft-teams-tunnelrelay). Another way, and also the recommended way is to use [awps-tunnel](./howto-web-pubsub-tunnel-tool.md) to tunnel the traffic from Web PubSub service through the tool to your local server.

Web PubSub local tunnel tool, under the hood, establishes several persistent tunnel connections (we consider it as one kind of server connection) to the Web PubSub service. Whenever a event comes in, Web PubSub service routes the event message through the tunnel connection to the local tunnel tool, and local tunnel tool reforms the HTTP request and sends the request to your upstream server.

The local tunnel tool provides a vivid view of the workflow through a webview page. The webview by default listens on local port `upstream port + 1000`, and you could customize the webview port using command parameter `--webviewPort <your-custom-port>`.

The webview contains four tabs:
- **Client** tab, it provides a test WebSocket client to connect the Web PubSub and send data.
- **Web PubSub** tab, it provides the basic info about your Web PubSub service and embeds the Live Trace page if enabled.
- **Local Tunnel** tab, it lists all the requests going through local tunnel tool to your local server.
- **Server** tab, it shows the basic info about your local server. It also provides a built-in echo server with code similar to the sample code shown below it.

:::image type="content" alt-text="Screenshot of showing the traffic inspection." source="media\howto-web-pubsub-tunnel-tool\overview-tunnel.png" :::

Follow [Develop with local tunnel tool](./howto-web-pubsub-tunnel-tool.md) to install and run the tunnel tool locally to develop your **event handler** server locally.

## Next steps

[!INCLUDE [next step](includes/include-next-step.md)]
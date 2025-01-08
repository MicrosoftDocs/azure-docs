---
title: Admin UI
description: This article explains how to use Admin UI when you're using Web PubSub for Socket.IO.
keywords: Socket.IO, Socket.IO on Azure, multi-node Socket.IO, scaling Socket.IO, Socket.IO logging, Socket.IO debugging, socketio, azure socketio
author: xingsy97
ms.author: siyuanxing
ms.date: 07/02/2024
ms.service: azure-web-pubsub
ms.topic: how-to
---

# Azure Socket.IO Admin UI

[Socket.IO Admin UI](https://socket.io/docs/v4/admin-ui/) is a website tool developed by Socket.IO official team and it can be used to have an overview of the state of your Socket.IO deployment. See how it works and explore its advanced usage in [Socket.IO Admin UI Doc](https://socket.io/docs/v4/admin-ui/).

[Azure Socket.IO Admin UI](https://github.com/Azure/azure-webpubsub/tree/main/tools/azure-socketio-admin-ui) is a customized version of it for Azure Socket.IO. 

## Deploy the website
Azure Socket.IO Admin UI doesn't have a hosted version so far. Users should host the website by themselves. 

The static website files could be either downloaded from release or built from source code:

### Download the released version
1. Download the released zip file such as `azure-socketio-admin-ui-0.1.0.zip` from [release page](https://github.com/Azure/azure-webpubsub/releases)

2. Extract the zip file

### Build from source code
1. Clone the repository 
    ```bash
    git clone https://github.com/Azure/azure-webpubsub.git
    ```

2. Build the project 
    ```bash
    cd tools/azure-socketio-admin-ui
    yarn install
    yarn build
    ```

3. Host the static files using any HTTP server. Let's use [a tiny static HTTP server](https://www.npmjs.com/package/http-server) as an example:
    ```bash
    cd dist
    npm install -g http-server
    http-server
    ```

    The http server is hosted on port 8080 by default.

4. Visit `http://localhost:8080` in browser

## Update server-side code
1. install the `@socket.io/admin-ui` package:

    ```bash
    npm i @socket.io/admin-ui
    ```

2. Invoke the instrument method on your Socket.IO server:

    ```javascript
    const azure = require("@azure/web-pubsub-socket.io");
    const { Server } = require("socket.io");
    const { instrument } = require("@socket.io/admin-ui");
    const httpServer = require('http').createServer(app);

    const wpsOptions = {
        hub: "eio_hub",
        connectionString: process.argv[2] || process.env.WebPubSubConnectionString
    };

    const io = await new Server(httpServer).useAzureSocketIO(wpsOptions);
    instrument(io, { auth: false, mode: "development" });

    // Note: The next three lines are necessary to make the development mode work
    Namespace.prototype["fetchSockets"] = async function() { 
        return this.local.fetchSockets(); 
    };

    httpServer.listen(3000);
    ```

## Open Admin UI website
1. Visit `http://localhost:8080` in browser.

2. You should see the following modal:

:::image type="content" source="./media/socketio-troubleshoot-admin-ui/admin-ui-homepage-modal.png" alt-text="Screenshot of modal on Socket.IO Admin UI homepage.":::

3. Fill in your service endpoint and hub name.
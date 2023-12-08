---
title: Azure Web PubSub local tunnel tool
description: This article describes the awps-tunnel local tunnel tool to help improve local development experience.
author: vicancy
ms.author: lianwei
ms.service: azure-web-pubsub
ms.topic: conceptual 
ms.date: 12/08/2023
---

#  Azure Web PubSub local tunnel tool

Web PubSub local tunnel provides a local development environment for our customers to enhance their local development experience. There is no need to use third-party tools to expose local ports anymore, use Web PubSub local tunnel as the tunnel between the Web PubSub service and your local server and keep your local development environment secure and safe.

Web PubSub local tunnel provides:
* A way to tunnel traffic from Web PubSub to your local server
* A way to view the end-to-end data flow from your client to Web PubSub through the tunnel and to your local server
* Provides an embeded upstream server for you to get started
* Provides a simple client for you to get started with your server development

Benefits:
* Secured local: no need to expose your local server to public
* Secured connection: use Entra ID and Web PubSub access policy to login  
* Simple configuration: URL template sets to `tunnel:///<your_server_path>` and no need to change
* Data inspection: vivid view of the data flow and data history

## Install

```bash
npm install -g @azure/web-pubsub-tunnel-tool
```

## Usage

```
Usage: awps-tunnel [options] [command]

A local tool to help tunnel Azure Web PubSub traffic to local web app and provide a vivid view to the end to end
workflow.

Options:
  -V, --version   output the version number
  -h, --help      display help for command

Commands:
  status
  bind [options]
  run [options]
  help [command]  display help for command
You could also set WebPubSubConnectionString environment variable if you don't want to configure endpoint.

```

## Prepare the credential
### Using connection string

1. In your Web PubSub service portal, copy your connection string from your Web PubSub service portal 

1. Set the connection string to your local environment variable. Currently only environment variable is supported if you are using connection string

    ```bash
    export WebPubSubConnectionString="<your connection string>"
    ```

### Using Azure Identity

1. In your Web PubSub service portal, go to Access control tab, and add role `Web PubSub Service Owner` to your identity.

1. In your local terminal, use `az login` to login to your identity.

## Run
1. In your Web PubSub service portal, go to Settings tab, specify the event handler URL to start with `tunnel:///` to allow tunnel connection.

    ![Configure Hub Settings](https://github.com/azure/azure-webpubsub/blob/main/tools/awps-tunnel/server/docs/images/hub-settings.png?raw=true)

1. Start your upstream server, for example, this sample [upstream server](https://github.com/Azure/azure-webpubsub/tree/main/tools/awps-tunnel/server/samples/upstream/), when it starts, the upstream serves requests to http://localhost:3000/eventhandler/.

    ```bash
    cd samples/upstream
    npm install
    node server.js
    ```

1. Run the tool with the hub you set before, for example, `chat`:
    ```bash
    awps-tunnel run --hub chat --upstream http://localhost:3000 --endpoint <your service endpoint>
    ```

    You could also use `awps-tunnel bind --hub chat --upstream http://localhost:3000 --endpoint <your service endpoint>` to save the configuration and then `awps-tunnel run`.

1. You will see output like `Open webview at: http://localhost:4000`, open the link in your browser and you could see the tunnel status and the traffic.

    ![overview](https://github.com/azure/azure-webpubsub/blob/main/tools/awps-tunnel/server/docs/images/overview-tunnel.png?raw=true)

1. In `Client` tab, click `Connect` to start a test WebSocket connection to the Azure Web PubSub service. You would see the traffic goes through Web PubSub to Local Tunnel and finnally reaches your upstream server. The tunnel tab provides the details of the request and responses, providing you a vivid view of what is requesting your upstream server and what is reponding from the upstream server.

    ![overview](https://github.com/azure/azure-webpubsub/blob/main/tools/awps-tunnel/server/docs/images/overview-client.png?raw=true)

    ![overview](https://github.com/azure/azure-webpubsub/blob/main/tools/awps-tunnel/server/docs/images/overview-tunnel.png?raw=true)

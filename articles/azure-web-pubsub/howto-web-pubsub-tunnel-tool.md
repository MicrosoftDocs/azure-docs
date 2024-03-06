---
title: Azure Web PubSub local tunnel tool (Preview)
titleSuffix: Azure Web PubSub Service
description: This article describes the awps-tunnel local tunnel tool to help improve local development experience.
author: vicancy
ms.author: lianwei
ms.service: azure-web-pubsub
ms.topic: how-to
ms.date: 12/12/2023
---

#  Azure Web PubSub local tunnel tool

Web PubSub local tunnel provides a local development environment for customers to enhance their local development experience. There's no need to use third-party tools to expose local ports anymore, use Web PubSub local tunnel as the tunnel between the Web PubSub service and your local server to keep your local development environment secure and safe.

Web PubSub local tunnel provides:
* A way to tunnel traffic from Web PubSub to your local server
* A way to view the end-to-end data flow from your client to Web PubSub through the tunnel and to your local server
* Provides an embedded upstream server for you to get started
* Provides a simple client for you to get started with your server development

Benefits:
* Secured local: no need to expose your local server to public
* Secured connection: use Microsoft Entra ID and Web PubSub access policy to connect
* Simple configuration: URL template sets to `tunnel:///<your_server_path>` 
* Data inspection: vivid view of the data and the workflow

## Prerequisite
* [Node.js](https://nodejs.org/) version 16 or higher 

## Install

```bash
npm install -g @azure/web-pubsub-tunnel-tool
```

## Usage

```
Usage: awps-tunnel [options] [command]

A local tool to help tunnel Azure Web PubSub traffic to local web app and provide a vivid view to the end to end workflow.

Options:
  -v, --version   Show the version number.
  -h, --help      Show help details.

Commands:
  status          Show the current configuration status.
  bind [options]  Bind configurations to the tool so that you don't need to specify them every time running the tool.
  run [options]   Run the tool.
  help [command]  Display help details for subcommand.

You could also set WebPubSubConnectionString environment variable if you don't want to configure endpoint.

```

## Prepare the credential

Both connection string and Microsoft Entra ID are supported.

### Using connection string

1. In your Web PubSub service portal, copy your connection string from your Web PubSub service portal. 

1. Set the connection string to your local environment variable and start `awps-tunnel`.

# [Linux or macOS](#tab/bash)
```bash
export WebPubSubConnectionString="<your connection string>"
```
# [Windows](#tab/cmd)
```cmd
SET WebPubSubConnectionString=<your connection string>
```

---

### Using Azure Identity

1. In your Web PubSub service portal, go to Access control tab, and add role `Web PubSub Service Owner` to your identity.

1. In your local terminal, use [Azure CLI](/cli/azure/authenticate-azure-cli) `az login` to sign in to your identity.

1. Alternatively, you could set account information via [defined environment variables](/javascript/api/overview/azure/identity-readme#environment-variables), or use [Managed identity authentication](/entra/identity/managed-identities-azure-resources/overview#which-operations-can-i-perform-on-managed-identities) directly for supported Azure services.

## Run
1. In your Web PubSub service portal, go to Settings tab, specify the event handler URL template to start with `tunnel:///` to allow tunnel connection.

    :::image type="content" alt-text="Screenshot of setting the upstream URL in hub settings." source="media\howto-web-pubsub-tunnel-tool\hub-settings.png" :::

1. Run the tool with the hub you set before, for example, connect to an endpoint `https://<awps-host-name>.webpubsub.azure.com` with hub `chat`:
    ```bash
    awps-tunnel run --hub chat --endpoint https://<awps-host-name>.webpubsub.azure.com
    ```

    You could also use `awps-tunnel bind --hub chat --endpoint https://<awps-host-name>.webpubsub.azure.com` to save the configuration and then `awps-tunnel run`.

1. You see output like `Open webview at: http://127.0.0.1:4000`, open the link in your browser and you could see the tunnel status and the workflow.

1. Now switch to **Server** tab, and check *Built-in Echo Server* to start a builtin upstream server with code similar to the sample code shown below it.

   :::image type="content" alt-text="Screenshot of starting built-in echo server." source="media\howto-web-pubsub-tunnel-tool\overview-upstream.png" :::

1. Alternatively, you can start your own upstream server at http://localhost:3000. You can also specify option`--upstream http://localhost:<custom-port>` when `awps-tunnel run` or `awps-tunnel bind` to configure your own upstream server at a custom port. For example, run the below code to start this sample [upstream server](https://github.com/Azure/azure-webpubsub/tree/main/tools/awps-tunnel/server/samples/upstream/), when it starts, the upstream serves requests to http://localhost:3000/eventhandler/.
  
      ```bash
      git clone https://github.com/Azure/azure-webpubsub.git
      cd tools/awps-tunnel/server/samples/upstream
      npm install
      npm start
      ```

1. Now switch to **Client** tab, select `Connect` to start a test WebSocket connection to the Azure Web PubSub service. You would see the traffic goes through Web PubSub to Local Tunnel and finally reaches the upstream server. The tunnel tab provides the details of the request and responses, providing you with a vivid view of what is requesting your upstream server and what is reponding from the upstream server.

   :::image type="content" alt-text="Screenshot of starting the test WebSocket connection and send message." source="media\howto-web-pubsub-tunnel-tool\overview-client.png" :::

   :::image type="content" alt-text="Screenshot of showing the traffic inspection." source="media\howto-web-pubsub-tunnel-tool\overview-tunnel.png" :::

## Under the hood

How does the tunnel tool work? Under the hood it starts a tunnel connection to the Web PubSub service. Tunnel connection is a persistent connection (WebSocket) connects to the `/server/tunnel` endpoint, and it is considered as one kind of server connections. You could also use ACL rules in the service to disable such connections from connecting.

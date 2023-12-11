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

Web PubSub local tunnel provides a local development environment for customers to enhance their local development experience. There is no need to use third-party tools to expose local ports anymore, use Web PubSub local tunnel as the tunnel between the Web PubSub service and your local server to keep your local development environment secure and safe.

Web PubSub local tunnel provides:
* A way to tunnel traffic from Web PubSub to your local server
* A way to view the end-to-end data flow from your client to Web PubSub through the tunnel and to your local server
* Provides an embeded upstream server for you to get started
* Provides a simple client for you to get started with your server development

Benefits:
* Secured local: no need to expose your local server to public
* Secured connection: use Entra ID and Web PubSub access policy to connect
* Simple configuration: URL template sets to `tunnel:///<your_server_path>` and no need to change 
* Data inspection: vivid view of the data and the workflow

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

Both connection string and Microsoft Entra ID are supported.

### Using connection string

1. In your Web PubSub service portal, copy your connection string from your Web PubSub service portal. 

1. Set the connection string to your local environment variable and start `awps-tunnel`.

    ```bash
    export WebPubSubConnectionString="<your connection string>"
    ```

### Using Azure Identity

1. In your Web PubSub service portal, go to Access control tab, and add role `Web PubSub Service Owner` to your identity.

1. The tool supports reading credentials from [AzureCliCredential](https://learn.microsoft.com/javascript/api/@azure/identity/azureclicredential?view=azure-node-latest), [EnvironmentCredential](https://learn.microsoft.com/javascript/api/@azure/identity/environmentcredential?view=azure-node-latest#@azure-identity-environmentcredential-constructor) and [ManagedIdentityCredential](https://learn.microsoft.com/javascript/api/overview/azure/identity-readme?view=azure-node-latest#managed-identity-support). You could either use [az login](https://learn.microsoft.com/cli/azure/authenticate-azure-cli) to signin, or set account information via [defined environment variables](https://learn.microsoft.com/javascript/api/overview/azure/identity-readme?view=azure-node-latest#environment-variables). 

## Run
1. In your Web PubSub service portal, go to Settings tab, specify the event handler URL template to start with `tunnel:///` to allow tunnel connection.

    ![Configure Hub Settings](https://github.com/azure/azure-webpubsub/blob/main/tools/awps-tunnel/server/docs/images/hub-settings.png?raw=true)

1. Run the tool with the hub you set before, for example, connect to an endpoint `https:///?.webpubsub.azure.com` with hub `chat`:
    ```bash
    awps-tunnel run --hub chat --endpoint https:///?.webpubsub.azure.com
    ```

    You could also use `awps-tunnel bind --hub chat --endpoint https:///?.webpubsub.azure.com` to save the configuration and then `awps-tunnel run`.

1. You will see output like `Open webview at: http://127.0.0.1:4000`, open the link in your browser and you could see the tunnel status and the workflow.

1. Now switch to **Server** tab, and check *Built-in Echo Server*, this starts a super simple builtin upstream server with code similar to the sample code shown below it.

   :::image type="content" alt-text="Screenshot of starting built-in echo server." source="media\howto-awps-tunnel\overview_tunnel_start_upstream.png" :::

1. Now switch to **Client** tab, click `Connect` to start a test WebSocket connection to the Azure Web PubSub service. You would see the traffic goes through Web PubSub to Local Tunnel and finnally reaches the upstream server. The tunnel tab provides the details of the request and responses, providing you a vivid view of what is requesting your upstream server and what is reponding from the upstream server.

   :::image type="content" alt-text="Screenshot of starting the test WebSocket connection and send message." source="media\howto-awps-tunnel\overview_tunnel_start_client.png" :::

   :::image type="content" alt-text="Screenshot of showing the traffic inspection." source="media\howto-awps-tunnel\overview_tunnel_detail.png" :::
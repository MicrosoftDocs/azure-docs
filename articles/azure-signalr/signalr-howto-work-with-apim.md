---
title: How to use SignalR Service with Azure API Management
description: This article provides information about using Azure SignalR Service with Azure API Management.
author: vicancy
ms.author: lianwei
ms.date: 05/16/2023
ms.service: signalr
ms.topic: how-to
---

# How to use Azure SignalR Service with Azure API Management

Azure API Management service provides a hybrid, multicloud management platform for APIs across all environments. This article shows you how to add real-time capability to your application with Azure API Management and Azure SignalR service.

:::image type="content" source="./media/signalr-howto-work-with-apim/architecture.png" alt-text="Diagram that shows the architecture of using SignalR Service with API Management.":::

## Set up and configure

### Create a SignalR Service instance
* Follow [the article](./signalr-quickstart-azure-signalr-service-arm-template.md) and create a SignalR Service instance **_ASRS1_**

### Create an API Management instance
* Follow [the article](../api-management/get-started-create-service-instance-cli.md) and create an API Managment instance **_APIM1_**

### Configure SignalR related APIs

When a client goes through API Management to Azure SignalR, there are two types of requests:

* HTTP POST request to `<APIM-URL>/client/negotiate`, which we call as **negotiate request**
* WebSocket/SSE/LongPolling connection request depending on your transport type to `<APIM-URL>/client`, which we call as **connect request**.

As for now, API Management doesn't yet support different types of APIs for the same suffix. For example, when suffix `/client` is configured as a `WebSocket` API, it only supports WebSocket connections. With this limitation, SignalR clients are unable to fallback to other transport types if request with `WebSocket` transport type fails when they go through API Management.

To support SignalR requests, let's add 2 types of APIs in API Management, one for **negotiate HTTP request** and one for **WebSocket** **connect request**:

#### Configure for negotiate request
1. Go to **APIs** tab in the portal for API Managment instance **_APIM1_**, click **Add API** and choose **HTTP**, create with the following parameters:
    * Display name: `SignalR negotiate`
    * Web service URL: `https://<your-signalr-service-url>/client/negotiate`
    * API URL suffix: `client/negotiate`
2. Click the created `SignalR negotiate`, in **Design** tab, click **Add operation**, and **Save** with the following parameters:
    * Display name: `negotiate`
    * URL: `POST /`
3. Click the created `negotiate` operation, in **Inbound processing** panel, click **Add policy** and choose **cors**, for demo purpose, we use `*` in **Allowed origins**. Please note that in production usage, please update the value to the URL your website hosts.

#### Configure for connect request
Now let's configure **WebSocket** **connect request** so that the SignalR clients can connect with WebSocket transport type.

Click **Add API** and choose **WebSocket**, Create with the following parameters:
* Display name: `SignalR connect`
* WebSocket URL: `wss://<your-signalr-service-url>/client`
* API URL suffix: `client`

### Run chat

Now, the traffic can reach SignalR Service through API Management.Let’s use [this chat application](https://github.com/aspnet/AzureSignalR-samples/tree/main/samples/ChatRoom) as an example. Let's start with running it locally.

* First let's get the connection string of **_ASRS1_**
    * On the **Connection strings** tab of **_ASRS1_**
        * **Client endpoint**: Enter the URL using **Gateway URL** of **_APIM1_**, for example `https://apim1.azure-api.net`. It's a connection string generator when using reverse proxies, and the value isn't preserved when next time you come back to this tab. When value entered, the connection string appends a `ClientEndpoint` section.
        * Copy the Connection string

* Clone the GitHub repo https://github.com/aspnet/AzureSignalR-samples 
* Go to samples/Chatroom folder:
* Set the copied connection string and run the application locally, you can see that there's a `ClientEndpoint` section in the ConnectionString.

    ```bash
    cd samples/Chatroom
    dotnet restore 
    dotnet user-secrets set Azure:SignalR:ConnectionString "<copied-onnection-string-with-client-endpoint>" 
    dotnet run
    ```
* Open http://localhost:5000 from the browser and use F12 to view the network traces, you can see that the WebSocket connection is established through **_APIM1_**

## Next steps

Now, you have successfully added real-time capability to your APIs. [Learn more about SignalR Service](./signalr-overview.md).

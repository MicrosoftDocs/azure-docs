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

## Create resources

- Follow [Quickstart: Use an ARM template to deploy Azure SignalR](./signalr-quickstart-azure-signalr-service-arm-template.md) and create a SignalR Service instance **_ASRS1_**

- Follow [Quickstart: Use an ARM template to deploy Azure API Management](../api-management/quickstart-arm-template.md) and create an API Management instance **_APIM1_**

## Configure APIs

### Limitations

There are two types of requests for a SignalR client:

- **negotiate request**: HTTP `POST` request to `<APIM-URL>/client/negotiate/`
- **connect request**: request to `<APIM-URL>/client/`, it could be `WebSocket` or `ServerSentEvent` or `LongPolling` depends on the transport type of your SignalR client

The type of **connect request** varies depending on the transport type of the SignalR clients. As for now, API Management doesn't yet support different types of APIs for the same suffix. With this limitation, when using API Management, your SignalR client doesn't support fallback from `WebSocket` transport type to other transport types. Fallback from `ServerSentEvent` to `LongPolling` could be supported. Below sections describe the detailed configurations for different transport types.

### Configure APIs when client connects with `WebSocket` transport

This section describes the steps to configure API Management when the SignalR clients connect with `WebSocket` transport. When SignalR clients connect with `WebSocket` transport, three types of requests are involved:

1. **OPTIONS** preflight HTTP request for negotiate
1. **POST** HTTP request for negotiate
1. WebSocket request for connect

Let's configure API Management from the portal.

1. Go to **APIs** tab in the portal for API Management instance **_APIM1_**, select **Add API** and choose **HTTP**, **Create** with the following parameters:
   - Display name: `SignalR negotiate`
   - Web service URL: `https://<your-signalr-service-url>/client/negotiate/`
   - API URL suffix: `client/negotiate/`
1. Select the created `SignalR negotiate` API, **Save** with below settings:
   1. In **Design** tab
      1. Select **Add operation**, and **Save** with the following parameters:
         - Display name: `negotiate preflight`
         - URL: `OPTIONS` `/`
      1. Select **Add operation**, and **Save** with the following parameters:
         - Display name: `negotiate`
         - URL: `POST` `/`
   1. Switch to **Settings** tab and uncheck **Subscription required** for quick demo purpose
1. Select **Add API** and choose **WebSocket**, **Create** with the following parameters:
   - Display name: `SignalR connect`
   - WebSocket URL: `wss://<your-signalr-service-url>/client/`
   - API URL suffix: `client/`
1. Select the created `SignalR connect` API, **Save** with below settings:
   1. Switch to **Settings** tab and uncheck **Subscription required** for quick demo purpose

Now API Management is successfully configured to support SignalR client with `WebSocket` transport.

### Configure APIs when client connects with `ServerSentEvents` or `LongPolling` transport

This section describes the steps to configure API Management when the SignalR clients connect with `ServerSentEvents` or `LongPolling` transport type. When SignalR clients connect with `ServerSentEvents` or `LongPolling` transport, five types of requests are involved:

1. **OPTIONS** preflight HTTP request for negotiate
1. **POST** HTTP request for negotiate
1. **OPTIONS** preflight HTTP request for connect
1. **POST** HTTP request for connect
1. **GET** HTTP request for connect

Now let's configure API Management from the portal.

1. Go to **APIs** tab in the portal for API Management instance **_APIM1_**, select **Add API** and choose **HTTP**, **Create** with the following parameters:
   - Display name: `SignalR`
   - Web service URL: `https://<your-signalr-service-url>/client/`
   - API URL suffix: `client/`
1. Select the created `SignalR` API, **Save** with below settings:
   1. In **Design** tab
      1. Select **Add operation**, and **Save** with the following parameters:
         - Display name: `negotiate preflight`
         - URL: `OPTIONS` `/negotiate`
      1. Select **Add operation**, and **Save** with the following parameters:
         - Display name: `negotiate`
         - URL: `POST` `/negotiate`
      1. Select **Add operation**, and **Save** with the following parameters:
         - Display name: `connect preflight`
         - URL: `OPTIONS` `/`
      1. Select **Add operation**, and **Save** with the following parameters:
         - Display name: `connect`
         - URL: `POST` `/`
      1. Select **Add operation**, and **Save** with the following parameters:
         - Display name: `connect get`
         - URL: `GET` `/`
      1. Select the newly added **connect get** operation, and edit the Backend policy to disable buffering for `ServerSentEvents`, [check here](../api-management/how-to-server-sent-events.md) for more details.
         ```xml
         <backend>
             <forward-request buffer-response="false" />
         </backend>
         ```
   1. Switch to **Settings** tab and uncheck **Subscription required** for quick demo purpose

Now API Management is successfully configured to support SignalR client with `ServerSentEvents` or `LongPolling` transport.

### Run chat

Now, the traffic can reach SignalR Service through API Management. Let’s use [this chat application](https://github.com/aspnet/AzureSignalR-samples/tree/main/samples/ChatRoom) as an example. Let's start with running it locally.

- First let's get the connection string of **_ASRS1_**

  - On the **Connection strings** tab of **_ASRS1_**
    - **Client endpoint**: Enter the URL using **Gateway URL** of **_APIM1_**, for example `https://apim1.azure-api.net`. It's a connection string generator when using reverse proxies, and the value isn't preserved when next time you come back to this tab. When value entered, the connection string appends a `ClientEndpoint` section.
    - Copy the Connection string

- Clone the GitHub repo https://github.com/aspnet/AzureSignalR-samples
- Go to samples/Chatroom folder:
- Set the copied connection string and run the application locally, you can see that there's a `ClientEndpoint` section in the ConnectionString.

  ```bash
  cd samples/Chatroom
  dotnet restore
  dotnet user-secrets set Azure:SignalR:ConnectionString "<copied-onnection-string-with-client-endpoint>"
  dotnet run
  ```

- Configure transport type for the client

  Open `index.html` under folder `wwwroot` and find the code when `connection` is created, update it to specify the transport type.

  For example, to specify the connection to use server-sent-events or long polling, update the code to:

  ```javascript
  const connection = new signalR.HubConnectionBuilder()
    .withUrl(
      "/chat",
      signalR.HttpTransportType.ServerSentEvents |
        signalR.HttpTransportType.LongPolling
    )
    .build();
  ```

  To specify the connection to use WebSockets, update the code to:

  ```javascript
  const connection = new signalR.HubConnectionBuilder()
    .withUrl("/chat", signalR.HttpTransportType.WebSockets)
    .build();
  ```

- Open http://localhost:5000 from the browser and use F12 to view the network traces, you can see that the connection is established through **_APIM1_**

## Next steps

Now, you have successfully added real-time capability to your API Management using Azure SignalR. [Learn more about SignalR Service](./signalr-overview.md).

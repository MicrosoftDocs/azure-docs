---
title: Integrate - How to use Web PubSub for Socket.IO with Azure API Management
description: A how-to guide about how to use Web PubSub for Socket.IO with Azure API Management
keywords: Socket.IO, Socket.IO on Azure, webapp Socket.IO, Socket.IO integration, APIM
author: zackliu
ms.author: chenyl
ms.service: azure-web-pubsub
ms.custom:
ms.topic: tutorial
ms.date: 1/11/2024
---
# How-to: Use Web PubSub for Socket.IO with Azure API Management

Azure API Management service provides a hybrid, multicloud management platform for APIs across all environments. This article shows you how to add real-time capability to your application with Azure API Management and Web PubSub for Socket.IO.

:::image type="content" source="./media/socket-io-howto-integrate-apim/sio-apim.png" alt-text="Diagram that shows the architecture of using Web PubSub for Socket.IO with API Management.":::

## Limitations

Socket.IO clients support WebSocket and Long Polling and by default, the client connects to the service with Long Polling and then upgrade to WebSocket. However, as for now, API Management doesn't yet support different types of APIs (WebSocket or Http) with the same path. You must set  either `websocket` or `polling` in client settings.

## Create resources
 
In order to follow the step-by-step guide, you need

- Follow [Create a Web PubSub for Socket.IO resource](./socketio-quickstart.md#create-a-web-pubsub-for-socketio-resource) to create a Web PubSub for Socket.IO instance.
- Follow [Quickstart: Use an ARM template to deploy Azure API Management](../api-management/quickstart-arm-template.md) and create an API Management instance.

## Set up API Management

### Configure APIs when client connects with `websocket` transport

This section describes the steps to configure API Management when the Socket.IO clients connect with `websocket` transport.

1. Go to **APIs** tab in the portal for API Management instance, select **Add API** and choose **WebSocket**, **Create** with the following parameters:

   - Display name: `Web PubSub for Socket.IO`
   - Web service URL: `wss://<your-webpubsubforsocketio-service-url>/clients/socketio/hubs/eio_hub`
   - API URL suffix: `clients/socketio/hubs/eio_hub`

   The hub name can be changed to meet your application.

1. Press **Create** to create the API and after created, switch to **Settings** tab and uncheck **Subscription required** for quick demo purpose

### Configure APIs when client connects with `polling` transport

This section describes the steps to configure API Management when the Socket.IO clients connect with `websocket` transport.

1. Go to **APIs** tab in the portal for API Management instance, select **Add API** and choose **WebSocket**, **Create** with the following parameters:

   - Display name: `Web PubSub for Socket.IO`
   - Web service URL: `https://<your-webpubsubforsocketio-service-url>/clients/socketio/hubs/eio_hub`
   - API URL suffix: `clients/socketio/hubs/eio_hub`

   The hub name can be changed to meet your application.

1. Switch to **Settings** tab and uncheck Subscription required for quick demo purpose

1. Switch to **Design** tab and select **Add operation**, and Save with the following parameters:

   Add operation for post data
    - Display name: connect
    - URL: POST /

   Add operation for get data
    - Display name: connect get
    - GET /

## Try Sample 

Now, the traffic can reach Web PubSub for Socket.IO through API Management. There are some configurations in application. Let’s use a chat application as an example.

Clone GitHub repo https://github.com/Azure/azure-webpubsub and investigate to `sdk/webpubsub-socketio-extension/examples/chat` folder

Then make some changes to let the sample work with API Management

1. Open `public/main.js` and it's the Socket.IO client side codes

   Edit the constructor of Socket.IO. You have to select either `websocket` or `polling` as the transport:

   ```javascript
   const webPubSubEndpoint = "https://<api-management-url>";
   var socket = io(webPubSubEndpoint, {
      transports: ["websocket"], // Depends on your transport choice. If you use WebSocket in API Management, set it to "websocket". If choosing Long Polling, set it to "polling"
      path: "/clients/socketio/hubs/eio_hub", // The path also need to match the settings in API Management
   });
   ```

2. On the **Keys** tab of Web PubSub for Socket.IO. Copy the **Connection String** and use the following command to run the server:

   ```bash
   npm install
   npm run start -- <connection-string>
   ```

3. According to the output, use browser to visit the endpoint

   ```
   Visit http://localhost:3000
   ```

4. In the sample, you can chat with other users.

## Next steps
> [!div class="nextstepaction"]
> [Check out more Socket.IO samples](https://aka.ms/awps/sio/sample)

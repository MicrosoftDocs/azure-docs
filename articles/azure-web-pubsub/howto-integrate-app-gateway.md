---
title: How to use Web PubSub service with Azure Application Gateway
titleSuffix: Azure Web PubSub
description: A guide that shows to how to use Web PubSub service with Azure Application Gateway
author: kevinguo-ed
ms.author: kevinguo
ms.service: azure-web-pubsub
ms.topic: tutorial
ms.date: 05/06/2024
---
# Use Web PubSub service with Azure Application Gateway
Azure Application Gateway is a web traffic load balancer that works at the application level. It can be used as the single point of contact for your web clients and can be configured to route web traffic to your various backends based on HTTP attributes, like the URI path among others. 

Web PubSub service can be used with Azure Application Gateway to realize a host of benefits: 
- Protect your Web PubSub instance from common web vulnerabilities.
- Keep your application compliant
...

In this guide, we demonstrate how you can use Azure Application Gateway to secure your Web PubSub resource. We achieve a higher level of security by allowing only traffic from Application Gateway and disabling public traffic. 

As illustrated in the diagram, you need to set up a Private Endpoint for your Web PubSub resource. This Private Endpoint needs to be in the same Virtual Network as your Application Gateway. 

:::image type="content" source="media/howto-integrate-app-gateway/overview.jpg" alt-text="Achitecture overview of using Web PubSub with Azure Application Gateway":::

This guide takes a step-by-step approach. First, we configure Application Gateway so that the traffic your Web PubSub resource can be succesffully proxied through. Second, we leverage the access control features of Web PubSub to only allow traffic from Application Gateway. 


## Step 1: configure Application Gateway to proxy traffic Web PubSub resource
The diagram illustrates what we are going to achieve in step 1.

:::image type="content" source="media/howto-integrate-app-gateway/overview-step1.jpg" alt-text="Achitecture overview of step 1: configure Application Gateway to proxy traffic Web PubSub resource":::

### Create an Azure Application Gateway instance
On Azure portal, 



This quickstart guide demonstrates how to
> [!div class="checklist"]
> * **connect** to your Web PubSub resource
> * **subscribe** to messages from groups
> * **publish** messages to groups

## Prerequisites
- A Web PubSub resource. If you haven't created one, you can follow the guidance: [Create a Web PubSub resource](./howto-develop-create-instance.md)
- A code editor, such as Visual Studio Code
- Install the dependencies for the language you plan to use 

## Install the client SDK

> [!NOTE] 
> This guide uses the client SDK provided by Web PubSub service, which is still in preview. The interface may change in later versions.

# [JavaScript](#tab/javascript)

```bash
mkdir pubsub_among_clients
cd pubsub_among_clients

# The SDK is available as an NPM module.
npm install @azure/web-pubsub-client
```

# [C#](#tab/csharp)

```bash
mkdir pubsub_among_clients
cd pubsub_among_clients

# Create a new .net console project
dotnet new console

# Install the client SDK, which is available as a NuGet package
dotnet add package Azure.Messaging.WebPubSub.Client --prerelease
```
---

## Connect to Web PubSub

A client, be it a browser 💻, a mobile app 📱, or an IoT device 💡, uses a **Client Access URL** to connect and authenticate with your resource. This URL follows a pattern of `wss://<service_name>.webpubsub.azure.com/client/hubs/<hub_name>?access_token=<token>`. A client can have a few ways to obtain the Client Access URL. For this quick start, you can copy and paste one from Azure portal shown in the following diagram. It's best practice to not hard code the Client Access URL in your code. In the production world, we usually set up an app server to return this URL on demand. [Generate Client Access URL](./howto-generate-client-access-url.md) describes the practice in detail.

![The diagram shows how to get client access url.](./media/howto-websocket-connect/generate-client-url.png)

As shown in the diagram above, the client has the permissions to send messages to and join a specific group named `group1`.

# [JavaScript](#tab/javascript)

Create a file with name `index.js` and add following code

```javascript
const { WebPubSubClient } = require("@azure/web-pubsub-client");

// Instantiate the client object. 
// <client-access-url> is copied from Azure portal mentioned above.
const client = new WebPubSubClient("<client-access-url>");
```

# [C#](#tab/csharp)

Edit the `Program.cs` file and add following code

```csharp
using Azure.Messaging.WebPubSub.Clients;

// Instantiate the client object. 
// <client-access-uri> is copied from Azure portal mentioned above.
var client = new WebPubSubClient(new Uri("<client-access-uri>"));
```
---

## Subscribe to a group

To receive messages from groups, the client
- must join the group it wishes to receive messages from
- has a callback to handle `group-message` event
  
The following code shows a client subscribes to messages from a group named `group1`.

# [JavaScript](#tab/javascript)

```javascript
// ...code from the last step

// Provide callback to the "group-message" event. 
client.on("group-message", (e) => {
  console.log(`Received message: ${e.message.data}`);
});

// Before joining group, you must invoke start() on the client object.
client.start();

// Join a group named "group1" to subscribe message from this group.
// Note that this client has the permission to join "group1", 
// which was configured on Azure portal in the step of generating "Client Access URL".
client.joinGroup("group1");
```

# [C#](#tab/csharp)

```csharp
// ...code from the last step

// Provide callback to group messages.
client.GroupMessageReceived += eventArgs =>
{
    Console.WriteLine($"Receive group message from {eventArgs.Message.Group}: {eventArgs.Message.Data}");
    return Task.CompletedTask;
};

// Before joining group, you must invoke start() on the client object.
await client.StartAsync();

// Join a group named "group1" to subscribe message from this group.
// Note that this client has the permission to join "group1", 
// which was configured on Azure portal in the step of generating "Client Access URL".
await client.JoinGroupAsync("group1");
```
---

## Publish a message to a group
In the previous step, we've set up everything needed to receive messages from `group1`, now we send messages to that group. 

# [JavaScript](#tab/javascript)

```javascript
// ...code from the last step

// Send message "Hello World" in the "text" format to "group1".
client.sendToGroup("group1", "Hello World", "text");
```

# [C#](#tab/csharp)

```csharp
// ...code from the last step

// Send message "Hello World" in the "text" format to "group1".
await client.SendToGroupAsync("group1", BinaryData.FromString("Hello World"), WebPubSubDataType.Text);
```
---

## Next steps
By using the client SDK, you now know how to 
> [!div class="checklist"]
> * **connect** to your Web PubSub resource
> * **subscribe** to group messages
> * **publish** messages to groups

Next, you learn how to **push messages in real-time** from an application server to your clients.
> [!div class="nextstepaction"]
> [Push message from application server](quickstarts-push-messages-from-server.md)

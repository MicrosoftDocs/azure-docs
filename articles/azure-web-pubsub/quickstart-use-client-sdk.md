---
title: Quickstart: Create a client using the Azure Web PubSub client SDK (preview)
description: Quickstart showing how to use the Azure Web PubSub client SDK
author: zackliu
ms.author: chenyl
ms.service: azure-web-pubsub
ms.topic: quickstart
ms.date: 03/15/2023
ms.custom: mode-api, devx-track-azurecli 
ms.devlang: azurecli
---

# Quickstart: Create a client using the Azure Web PubSub client SDK (preview)

Get started with the Azure Web PubSub client SDK for Python or JavaScript to create a pub-sub client 
 that: 

* connects to a Web PubSub service instance
* subscribes a Web PubSub group.
* publishes a message to the Web PubSub group.

[API reference documentation](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/web-pubsub/web-pubsub-client) | [Library source code](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/web-pubsub/web-pubsub-client/src) | [Package (JavaScript npm)](https://www.npmjs.com/package/@azure/web-pubsub-client) | [Samples](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/web-pubsub/web-pubsub-client/samples-dev/helloworld.ts)

[API reference documentation](https://github.com/Azure/azure-sdk-for-net#azure-sdk-for-net) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/webpubsub/Azure.Messaging.WebPubSub.Client/src) | [Package (NuGet))](https://www.nuget.org/packages/Azure.Messaging.WebPubSub.Client) | [Samples](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/webpubsub/Azure.Messaging.WebPubSub.Client/samples)


> [!NOTE] 
> The client SDK is still in preview version. The interface may change in later versions.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A Web PubSub instance. If you haven't created one, you can follow the guidance: [Create a Web PubSub instance from Azure portal](./howto-develop-create-instance.md)
- A file editor such as Visual Studio Code.

## Setting up

### Create an Azure Web PubSub service instance

1. In the Azure portal and from **Home**, select **Create a resource**.
1. In the **Search the Marketplace** box, enter *Web PubSub*. 
1. Select **Web PubSub** from the results.
1. Select **Create**.
1. Create a new resource group
    1. Select **Create new**.
    1. Enter the name and select **OK**.
1. Enter a **Resource Name** for the service instance.
1. Select **Pricing tier**. You can choose **Free** for testing.
1. Select **Create**, then **Create** again to confirm the new service instance.
1. Select **Go to resource** to go to the service instance when the deployment is complete.

### Generate the client URL

A client uses a Client Access URL to connect and authenticate with the service, which follows a pattern of `wss://<service_name>.webpubsub.azure.com/client/hubs/<hub_name>?access_token=<token>`.

To give the client permission to send messages to and join a specific group, you must generate a Client Access URL with the **Send To Groups** and **Join/Leave Groups** permissions.

1. In the Azure portal, go to your Web PubSub service resource page.
1. Select **Keys** from the menu.
1. In the **Client URL Generator** section:
    1. Select **Send To Groups**
    1. Select **Allow Sending To Specific Groups**.
    1. Enter *group1* in the **Group Name** field and select **Add**.
    1. Select **Join/Leave Groups**.
    1. Select **Allow Joining/Leaving Specific Groups**.
    1. Enter *group1* in the **Group Name** field and select **Add**.
    1. Copy and save the **Client Access URL** for use later in this article.

:::image type="content" source="media/howto-websocket-connect/generate-client-url.png" alt-text="Screenshot of the Web PubSub Client URL Generator.":::

### Install programming language

This quickstart uses the Azure Web PubSub client SDK for JavaScript or C#.  Open a terminal window and install the dependencies for the language you're using.  

# [JavaScript](#tab/javascript)

Install Node.js

[Node.js](https://nodejs.org)

# [C#](#tab/csharp)

Install both the .NET Core SDK and dotnet runtime.

[.NET Core](https://dotnet.microsoft.com/download)

---

### Install the package

# [JavaScript](#tab/javascript)

The SDK is available as an [npm module](https://www.npmjs.com/package/@azure/web-pubsub-client)

```bash
npm install @azure/web-pubsub-client
```

# [C#](#tab/csharp)

The SDK is available as an [NuGet packet](https://www.nuget.org/packages/Azure.Messaging.WebPubSub.Client)

```bash
# Add a new .net project
dotnet new console

# Add the client SDK
dotnet add package Azure.Messaging.WebPubSub.Client --prerelease
```

---

## Code examples

From your terminal window, create a new directory and navigate to it.

### Create and connect to the Web PubSub service

This code example creates a Web PubSub client that connects to the Web PubSub service instance.  A client uses a Client Access URL to connect and authenticate with the service. It's best practice to not hard code the Client Access in your code.  

For this example, you can use the Client Access URL you generated in the portal.

# [JavaScript](#tab/javascript)

Create a file with name `index.js` and enter following code:

```javascript
const { WebPubSubClient } = require("@azure/web-pubsub-client");
// Instantiates the client object. env.process.env.WebPubSubClientURL 
// env.process.env.WebPubSubClientURL is the Client Access URL from Azure portal
const client = new WebPubSubClient(env.process.env.WebPubSubClientURL);
```

# [C#](#tab/csharp)

Edit the `Program.cs` file and add following code:

```csharp
using Azure.Messaging.WebPubSub.Clients;
// Client Access URL from Azure portal
var clientURL = args[0]; \
// Instantiates the client object. 
var client = new WebPubSubClient(new Uri(clientURL));
```

---

## Subscribe to a group

To receive message from a group, you need to subscribe to the group and add a callback to handle messages you receive from the group. The following code subscribes the client to a group called `group1`.

# [JavaScript](#tab/javascript)

Add this code to the `index.js` file:

```javascript
// callback to group messages.
client.on("group-message", (e) => {
  console.log(`Received message: ${e.message.data}`);
});

// before joining group, the client needs to start
client.start();

// join a group to subscribe message from the group
client.joinGroup("group1");
```

# [C#](#tab/csharp)

Add this code to the `Program.cs` file:

```csharp
// callback to group messages.
client.GroupMessageReceived += eventArgs =>
{
    Console.WriteLine($"Receive group message from {eventArgs.Message.Group}: {eventArgs.Message.Data}");
    return Task.CompletedTask;
};

// before joining group, the client needs to start
await client.StartAsync();

// join a group to subscribe message from the group
await client.JoinGroupAsync("group1");
```
---

## Publish a message to a group

Then you can send messages to the group and as the client has joined the group before, you can receive the message you've sent.

# [JavaScript](#tab/javascript)

Add this code to the `index.js` file:

```javascript
client.sendToGroup("group1", "Hello World", "text");
```

# [C#](#tab/csharp)

Add this code to the `Program.cs` file:

```csharp
await client.SendToGroupAsync("group1", BinaryData.FromString("Hello World"), WebPubSubDataType.Text);
```

---

## Run the code

Run the client in your terminal.  To verify the client is sending and receiving messages, you can open a second terminal and start the client from the same directory.  You see the message you sent in the first terminal window.

# [JavaScript](#tab/javascript)

Add this code to the `index.js` file:

```bash
export WebPubSubClientURL="<Client Access URL>"
node index.js
```

# [C#](#tab/csharp)

Copy the Client Access URL from the portal and run the following command in your terminal replacing the `<client-access-url>` with the Client Access URL you copied from the portal:

```bash
dotnet run <client-access-url>
```

---

## Clean up resources

To delete the resources you created in this quickstart, you can delete the resource group you created.  Go to the Azure portal, select your resource group, and select **Delete resource group**.

## Next steps

This quickstart provides you with a basic idea of how to connect to the Web PubSub with client SDK and how to subscribe to group messages and publish messages to groups.

To learn more the Web PubSub service SDKs, see the following resources:

# [JavaScript](#tab/javascript)

[JavaScript SDK repository on GitHub](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/web-pubsub/web-pubsub-client)

[TypeScript sample](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/web-pubsub/web-pubsub-client/samples/v1-beta/typescript)

[Browser sample](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/web-pubsub/web-pubsub-client/samples-browser)

[Chat app sample](https://github.com/Azure/azure-webpubsub/tree/main/samples/javascript/chatapp/sdk)

# [C#](#tab/csharp)

[.NET SDK repository on GitHub](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/webpubsub/Azure.Messaging.WebPubSub.Client)

[Log streaming sample](https://github.com/Azure/azure-webpubsub/tree/main/samples/csharp/logstream/sdk)

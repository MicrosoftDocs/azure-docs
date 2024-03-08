---
title: Quickstart - Create a client using the Azure Web PubSub client SDK (preview)
description: Quickstart showing how to use the Azure Web PubSub client SDK
author: zackliu
ms.author: chenyl
ms.service: azure-web-pubsub
ms.topic: quickstart
ms.date: 03/15/2023
ms.custom: mode-api
ms.devlang: azurecli
---

# Quickstart: Create a client using the Azure Web PubSub client SDK (preview)

Get started with the Azure Web PubSub client SDK for .NET or JavaScript to create a Web PubSub client 
that: 

* connects to a Web PubSub service instance
* subscribes a Web PubSub group.
* publishes a message to the Web PubSub group.

[API reference documentation](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/web-pubsub/web-pubsub-client) | [Library source code](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/web-pubsub/web-pubsub-client/src) | [Package (JavaScript npm)](https://www.npmjs.com/package/@azure/web-pubsub-client) | [Samples](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/web-pubsub/web-pubsub-client/samples-dev/helloworld.ts)

[API reference documentation](https://github.com/Azure/azure-sdk-for-net#azure-sdk-for-net) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/webpubsub/Azure.Messaging.WebPubSub.Client/src) | [Package (NuGet)](https://www.nuget.org/packages/Azure.Messaging.WebPubSub.Client) | [Samples](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/webpubsub/Azure.Messaging.WebPubSub.Client/samples)


> [!NOTE] 
> The client SDK is still in preview version. The interface may change in later versions.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A file editor such as Visual Studio Code.

## Setting up

### Create an Azure Web PubSub service instance

1. In the Azure portal **Home** page, select **Create a resource**.
1. In the **Search the Marketplace** box, enter *Web PubSub*. 
1. Select **Web PubSub** from the results.
1. Select **Create**.
1. Create a new resource group
    1. Select **Create new**.
    1. Enter the name and select **OK**.
1. Enter a **Resource Name** for the service instance.
1. Select **Pricing tier**. You can choose **Free** for testing.
1. Select **Create**, then **Create** again to confirm the new service instance.
1. Once deployment is complete, select **Go to resource**.

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

Install the Azure Web PubSub client SDK for the language you're using.

# [JavaScript](#tab/javascript)

The SDK is available as an [npm module](https://www.npmjs.com/package/@azure/web-pubsub-client).

Open a terminal window and install the Web PubSub client SDK using the following command.

```bash
npm install @azure/web-pubsub-client
```

Note that the SDK is available as an [npm module](https://www.npmjs.com/package/@azure/web-pubsub-client).

# [C#](#tab/csharp)

Open a terminal window to create your project and install the Web PubSub client SDK.

```bash
# create project directory
mkdir webpubsub-client

# change to the project directory
cd webpubsub-client

# Add a new .net project
dotnet new console

# Add the client SDK
dotnet add package Azure.Messaging.WebPubSub.Client --prerelease
```

Note that the SDK is available as a [NuGet packet](https://www.nuget.org/packages/Azure.Messaging.WebPubSub.Client).  

---

## Code examples


### Create and connect to the Web PubSub service

This code example creates a Web PubSub client that connects to the Web PubSub service instance.  A client uses a Client Access URL to connect and authenticate with the service. It's best practice to not hard code the Client Access URL in your code. In the production world, we usually set up an app server to return this URL on demand. [Generate Client Access URL](./howto-generate-client-access-url.md) describes the practice in detail.

For this example, you can use the Client Access URL you generated in the portal.

# [JavaScript](#tab/javascript)

In the terminal window, create a new directory for your project and change to that directory.

```bash
mkdir webpubsub-client
cd webpubsub-client
```

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
var clientURL = Environment.GetEnvironmentVariable("WebPubSubClientURL"));
// Instantiates the client object. 
var client = new WebPubSubClient(new Uri(clientURL));
```

---

### Subscribe to a group

To receive message from a group, you need to subscribe to the group and add a callback to handle messages you receive from the group. The following code subscribes the client to a group called `group1`.

# [JavaScript](#tab/javascript)

Add this following code to the `index.js` file:

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

Add the following code to the `Program.cs` file:

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

### Publish a message to a group

After your client has subscribed to the group, it can send messages to and receive the message from the group.

# [JavaScript](#tab/javascript)

Add the following code to the `index.js` file:

```javascript
client.sendToGroup("group1", "Hello World", "text");
```

# [C#](#tab/csharp)

Add the following code to the `Program.cs` file:

```csharp
await client.SendToGroupAsync("group1", BinaryData.FromString("Hello World"), WebPubSubDataType.Text);
```

---

## Run the code

Run the client in your terminal.  To verify the client is sending and receiving messages, you can open a second terminal and start the client from the same directory.  You can see the message you sent from the second client in the first client's terminal window.

# [JavaScript](#tab/javascript)

To start the client go the terminal and run the following command.  Replace the `<Client Access URL>` with the client access URL you copied from the portal.

```bash
export WebPubSubClientURL="<Client Access URL>"
node index.js
```

# [C#](#tab/csharp)

To start the client, run the following command in your terminal replacing the `<client-access-url>` with the client access URL you copied from the portal:

```bash
export WebPubSubClientURL="<Client Access URL>"
dotnet run <client-access-url>
```

---

## Clean up resources

To delete the resources you created in this quickstart, you can delete the resource group you created.  Go to the Azure portal, select your resource group, and select **Delete resource group**.

## Next steps

To learn more the Web PubSub service client SDKs, see the following resources:

# [JavaScript](#tab/javascript)

[JavaScript SDK repository on GitHub](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/web-pubsub/web-pubsub-client)

[TypeScript sample](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/web-pubsub/web-pubsub-client/samples/v1-beta/typescript)

[Browser sample](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/web-pubsub/web-pubsub-client/samples-browser)

[Chat app sample](https://github.com/Azure/azure-webpubsub/tree/main/samples/javascript/chatapp/sdk)

# [C#](#tab/csharp)

[.NET SDK repository on GitHub](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/webpubsub/Azure.Messaging.WebPubSub.Client)

[Log streaming sample](https://github.com/Azure/azure-webpubsub/tree/main/samples/csharp/logstream/sdk)

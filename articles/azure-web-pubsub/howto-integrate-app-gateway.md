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
Azure Application Gateway is a web traffic load balancer that works at the application level. It can be used as the single point of contact for your web clients and can be configured to route web traffic to your various backends based on HTTP attributes, like the URI path among others. Application Gateway has native support for WebSocket - users do not need to configure anything special to have WebSocket enabled. 

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
On Azure portal, search for Azure Application Gateway and follow the steps to create a resource. Key steps are highlighted in the diagram.

:::image type="content" source="media/howto-integrate-app-gateway/create-resource-step1.jpg" alt-text="Screenshot of creating an Application Gateway resource - basics":::

A virtual network is needed for Azure resources to securely communicate with each other. Azure Application Gateway requires a dedicated subnet, which is what we created. For the sake of this guide, in step one, your Azure Application Gateway resource forwards traffic to your Web PubSub resource via the **public internet**. In step two, we create another subnet that houses a Web PubSub resource. This allows your Azure Application Gateway to forward traffic to your Web PubSub resource securely through the virtual network.  

### Configure Azure Application Gateway 
Configuring Azure Application Gateway entails three components. 
- Frontends
- Backends 
- Routing rules

Frontends are the IP addresses of your Azure Application Gateway. Since we use Azure Application Gateway as the single point of contact for our web clients, we need to create a public IP for it.

:::image type="content" source="media/howto-integrate-app-gateway/create-resource-step2.jpg" alt-text="Screenshot of creating an Application Gateway resource - create public IP":::

Backends are the resources your Application Gateway resource can send traffic to. In our case, we have one target, our Web PubSub resource. Find the **host name** of an existing Web PubSub resource on Azure portal. It should look like this, `xxxx.webpubsub.azure.com`.

:::image type="content" source="media/howto-integrate-app-gateway/create-resource-step3.jpg" alt-text="Screenshot of creating an Application Gateway resource - create a backend pool":::

With both the frontends and backends set up, we need to configure a routing rule that connects the frontends and the backends. The routing rule tells Application Gateway how to route traffic and to where. 

First, we set up a listener. This configuration tells Application Gateway to listen for HTTP traffic on PORT 80.

:::image type="content" source="media/howto-integrate-app-gateway/create-resource-step4.jpg" alt-text="Screenshot of creating an Application Gateway resource - create a routing rule, listener":::

Second, we set up the backend targets. We configure backend target to the backend pool we created earlier, which is our Web PubSub resource. Additionally, we need to specify how Application Gateway should forward the traffic. This is accomplished through **backend settings**.

:::image type="content" source="media/howto-integrate-app-gateway/create-resource-step5.jpg" alt-text="Screenshot of creating an Application Gateway resource - create a routing rule, backend targets":::


Web PubSub service only accepts HTTPs traffic. So we instruct Application Gateway to communicate with Web PubSub using HTTPs. To keep this guide focused, we let Application Gateway to pick host. It's recommended to set up a Custom Domain in production.  

:::image type="content" source="media/howto-integrate-app-gateway/create-resource-step6.jpg" alt-text="Screenshot of creating an Application Gateway resource - create a routing rule, backend settings":::

When the three components are configured, you should see something like the screenshot. You can visualize the flow of traffic through Application Gateway as such: 
1. Web clients send requests to your public IP of your Application Gateway resource.
2. Application Gateway routes traffic by consulting the user-configured routing rules. 
3. When the routing rule matches, the traffic is directed to the designated backend target.

:::image type="content" source="media/howto-integrate-app-gateway/create-resource-step6.jpg" alt-text="Screenshot of creating an Application Gateway resource - finished":::

One thing that is worth highlighting is that this is exactly how you configure non-WebSocket connections. You can learn more about [Application Gateway's native support for proxying WebSocket connection](https://learn.microsoft.com/azure/application-gateway/features#websocket-and-http2-traffic).


### Test and verify Application Gateway is configured properly
#### Verify that your Web PubSub resource is healthy
Send a request to an invalid endpoint of your Web PubSub resource and expect an error message from Web PubSub. 
```bash
curl https://<your-web-pubsub-resource-endpoint>/client
```
You should see the error message "Invalid value of 'hub'. This shows that Web PubSub service successfully received your request and responded accordingly.

#### Verify that Application Gateway proxies traffic to your Web PubSub resource
Repeat a similar step and expect the same error message. 
```bash
curl http://<public-ip-of-your-application-gateway-resource>/client
```
You should see the same error message "Invalid value of 'hub'. This shows that your Application Gateway resource has successfully routed the traffic using the routing rule we configured earlier and return a response back on behalf of Web PubSub.

## Step 2: disable public access to your Web PubSub resource
The outcome of step 1 is that your Web PubSub resource are accessible through both the public internet and Application Gateway. Because your Web PubSub resource is not in the same virtual network, when Application Gatway forwards traffic to Web PubSub resource, it reaches Web PubSub's public endpoint via public internet. In step 2, we allow only traffic from Application Gateway to achieve heightened security. 

Web PubSub service supports configuring access controls. One such configuration is to disable access from public internet. Make sure to hit "save" when you are done.

:::image type="content" source="media/howto-integrate-app-gateway/disable-public-access.jpg" alt-text="Screenshot of disabling public access of Web PubSub ":::

Now that public access is disabled on your Web PubSub resource. One impact is that Application Gateway as it's set up in step one cannot reach it, either. We need to bring your Web PubSub resource in the same virtual network that your Application Gateway is in. We achieve this by creating a Private Endpoint. [You can learn more about Private Endpoint here.](https://learn.microsoft.com/azure/private-link/private-endpoint-overview)

### Create a seperate subnet for your Private Endpoint
In step 1, we created a subnet that houses Application Gateway. Application Gateway requires its own subnet, so we need to create another subnet for your Private Endpoint. 

Locate the virtual network resource that we created 

:::image type="content" source="media/howto-integrate-app-gateway/disable-public-access.jpg" alt-text="Screenshot of disabling public access of Web PubSub ":::


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

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

This guide takes a step-by-step approach. First, we configure Application Gateway so that the traffic to your Web PubSub resource can be succesffully proxied through. Second, we leverage the access control features of Web PubSub to allow traffic from Application Gateway only. 


## Step 1: configure Application Gateway to proxy traffic to Web PubSub resource
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

Backends are the resources your Application Gateway resource can send traffic to. In our case, we have one target, our Web PubSub resource. Find the **host name** of an existing Web PubSub resource you intend to use to follow this guide on Azure portal. It should look like this, `xxxx.webpubsub.azure.com`.

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

One thing that is worth highlighting is that this is exactly how you configure non-WebSocket connections. You can learn more about [Application Gateway's native support for proxying WebSocket connections](https://learn.microsoft.com/azure/application-gateway/features#websocket-and-http2-traffic).


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

### Test and verify Application Gateway can proxy WebSocket connections
#### Publish messages through Web PubSub
We create a simple program to simulate a server publishing messages through Web PubSub periodically. We run the program locally in step 1 to verify everything is working and in step 2, we will deploy the same app to Azure App Service.

##### Create the folder structure
```bash
mdkir server && cd server
touch package.json && touch publish.js
```

##### Copy source code
Copy the code to the `package.json` file you just created.
```json
{
  "scripts": {
    "start": "node ./publish.js"
  },
  "dependencies": {
    "@azure/web-pubsub": "^1.1.1"
  }
}
```

Copy the code to the `publish.js` file you just created.
```javascript
const http = require("http")
// Uses the service SDK, which makes it easy to consume the capabilities of the service
const { WebPubSubServiceClient } = require('@azure/web-pubsub');

// Hardcodes the hub name 
const hub = "myHub1";

// Grabs the connection string stored as an environment variable
let webpubsub = new WebPubSubServiceClient(process.env.WebPubSubConnectionString, hub);

// Every 2 seconds, we ask Web PubSub service to send all the connected clients the messsage "hello, world"
setInterval(() => {
  webpubsub.sendToAll("hello, world", { contentType: "text/plain" });
}, 2000);

// Creates an HTTP server. This is needed when we deploy to app service in step 2, not necessary in step 1.
http.createServer().listen(process.env.PORT || 3000);
```

##### Install dependencies and run the program
On Azure portal, find the `connection string` of your Web PubSub resource.
:::image type="content" source="media/howto-integrate-app-gateway/webpubsub-connection-string.jpg" alt-text="Screenshot of getting the connection string of a Web PubSub resource":::

```bash

npm install

## Set environment variable
export WebPubSubConnectionString="<replace with the connection string of your Web PubSub resource>"

npm run start
```
It seems that nothing is happening, but actually every 2 seconds the program asks Web PubSub service to broadcast a message to all connected web clients. You can see this in action by enabling the [Live Trace Tool feature](./howto-troubleshoot-resource-logs.md##launch-the-live-trace-tool), where you can monitor important logging in real time.

#### Receive messages in the browser
It wouldn't be particularly illuminating if we don't receive the broadcasted messages. 

##### Get the `Client Access URL` on Azure portal
On Azure portal, find the `Client Access URL`. Make sure that you set the hub name to `myHub1`, the same as we hardcoded in `publish.js`. `Client Access URL` is a convenient tool to quickly connect with Web PubSub service for rapid experimentation, it's not suited for production. In production, your app service usually authenticates the client first and generates an access token using the service SDK on the fly. 

This `Client Access URL` allows any client that supports WebSocket to connect with your Web PubSub resources and receive messages published to `myHub1`.

:::image type="content" source="media/howto-integrate-app-gateway/webpubsub-client-access-url.jpg" alt-text="Screenshot of getting the Client Access URL of a Web PubSub resource":::

##### Copy client code
Create a `index.html` file to put the client code
```bash
touch index.html
```
Copy the code to `index.html`
```html
<!DOCTYPE html>

<body>
  <script>
    // Make sure to put your own Client Access URL here
    const CLIENT_ACCESS_URL = "<replace with the Client Access URL you found on Azure portal>"

    const socket = new WebSocket(CLIENT_ACCESS_URL)

    socket.addEventListener("open", () => {
      console.log("connection opened")
    })

    // Prints out the message when it arrives
    socket.addEventListener("message", (msg) => {
      console.log(msg)
    })
  </script>
</body>

</html>
```

##### Run the client program
You can use Live Server extension if you use VS code to follow the guide. Alternatively, you can just copy the path to `index.html` and paste it in the address bar of your preferred browser.

:::image type="content" source="media/howto-integrate-app-gateway/browser-client-direct.jpg" alt-text="Screenshot of a browser client directly connecting with Web PubSub resource":::

If you inspect the page, you should see that the client has succesfully connected with your Web PubSub resources and are getting the broadcasted messages. Make sure you still have `publish.js` running.

Since Application Gateway has native support for WebSocket, we don't need to change any confirguration on our Application Gateway resource. All we need is to change the endpoint our client points to. 

Change the endpoint the client points to and update the code accordingly in `index.html`. If your Client Access URL looks like `wss://xxx.webpubsub.azure.com/client...`, you need to change it to `ws://<the public IP of your Application Gateway resource/client...>`.

Three points to note. 
1. We use the `ws://` instead of `wss://` since your Application Gateway is configured to listen to `http` traffic only. 
2. In production, it's probably best to set up custom domain for your Application Gateway resource and configured it to accept HTTPs only.
3. We need to keep the access token as it is since it encodes credentails for your client to connect with your Web PubSub resource. 

```html
<!--> Update two lines of code in index.html <-->
<script>
    const CLIENT_ACCESS_URL_APP_GATEWAY = "<put the modified Access URL here>"

    const socket = new WebSocket(CLIENT_ACCESS_URL_APP_GATEWAY)
</script>
```
Now, if you run the program in the browser again, you should see that the client has established a WebSocket connection with Application Gateway and receives messages from Application Gateway roughly every 2 seconds.

### Recap of step 1
This marks the end of step 1. If you have been following step 1, you should see that your Web PubSub resource is accessilbe directly by your web clients or indirectly through Application Gateway. You also see Application Gateway native support for WebSocket in action. Enabling it does not require configuration change, you only need to specify in the client code that you wish to establish a WebSocket connection. 

In step 2, we close public access to your Web PubSub resource, making it more secure.

## Step 2: disable public access to your Web PubSub resource
The outcome of step 1 is that your Web PubSub resource are accessible through both the public internet and Application Gateway. Because your Web PubSub resource is not in the same virtual network, when Application Gatway forwards traffic to your Web PubSub resource, it reaches Web PubSub's public endpoint via **public internet**. This is not desirable.

Web PubSub service supports configuring access controls. One such configuration is to disable access from public internet. Make sure to hit "save" when you are done.

:::image type="content" source="media/howto-integrate-app-gateway/disable-public-access.jpg" alt-text="Screenshot of disabling public access of Web PubSub ":::

Now that public access is disabled on your Web PubSub resource. One impact is that Application Gateway as it's set up in step one cannot reach it, either. We need to bring your Web PubSub resource in the same virtual network that your Application Gateway is in. We achieve this by creating a Private Endpoint. [You can learn more about Private Endpoint here.](https://learn.microsoft.com/azure/private-link/private-endpoint-overview)

### Create a seperate subnet for your Private Endpoint
In step 1, we created a subnet that houses Application Gateway. Application Gateway requires its own subnet, so we need to create another subnet for your Private Endpoint. 

Locate the virtual network resource that we created 

:::image type="content" source="media/howto-integrate-app-gateway/disable-public-access.jpg" alt-text="Screenshot of disabling public access of Web PubSub ":::



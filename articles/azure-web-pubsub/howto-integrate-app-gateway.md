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
Azure Application Gateway is a web traffic load balancer that works at the application level. It can be used as the single point of contact for your web clients and can be configured to route web traffic to your various backends based on HTTP attributes, like the URI path among others. Application Gateway has native support for WebSocket - users don't need to configure anything special to have WebSocket enabled. 

In this guide, we demonstrate how you can use Azure Application Gateway to secure your Web PubSub resource. We achieve a higher level of security by allowing only traffic from Application Gateway and disabling public traffic to your Web PubSub resource. 

As illustrated in the diagram, you need to set up a Private Endpoint for your Web PubSub resource. This Private Endpoint needs to be in the same Virtual Network as your Application Gateway. 

:::image type="content" source="media/howto-integrate-app-gateway/overview.jpg" alt-text="Diagram showing the architecture overview of using Web PubSub with Azure Application Gateway.":::

This guide takes a step-by-step approach. First, we configure Application Gateway so that the traffic to your Web PubSub resource can be successfully proxied through. Second, we apply the access control features of Web PubSub to allow traffic from Application Gateway only. 


## Step 1: configure Application Gateway to proxy traffic to Web PubSub resource
The diagram illustrates what we are going to achieve in step 1.

:::image type="content" source="media/howto-integrate-app-gateway/overview-step-1.jpg" alt-text="Diagram showing the architecture overview of step 1: configure Application Gateway to proxy traffic Web PubSub resource.":::

### Create an Azure Application Gateway instance
On Azure portal, search for Azure Application Gateway and follow the steps to create a resource. Key steps are highlighted in the diagram.

:::image type="content" source="media/howto-integrate-app-gateway/create-resource-step-1.jpg" alt-text="Screenshot showing how to create an Application Gateway resource - basics.":::

A Virtual Network is needed for Azure resources to securely communicate with each other. Azure Application Gateway requires a dedicated subnet, which is what we created. For the sake of this guide, in step 1, your Azure Application Gateway resource forwards traffic to your Web PubSub resource via the **public internet**. In step 2, we create another subnet that houses a Web PubSub resource so that your Azure Application Gateway forwards traffic to your Web PubSub resource securely through a Virtual Network.  

### Configure Azure Application Gateway 
Configuring Azure Application Gateway entails three components. 
- Frontends
- Backends 
- Routing rules

Frontends are the IP addresses of your Azure Application Gateway. Since we use Azure Application Gateway as the single point of contact for our web clients, we need to create a public IP for it.

:::image type="content" source="media/howto-integrate-app-gateway/create-resource-step-2.jpg" alt-text="Screenshot showing how to create an Application Gateway resource - create public IP.":::

Backends are the resources your Application Gateway resource can send traffic to. In our case, we have one target, our Web PubSub resource. Find the **host name** of an existing Web PubSub resource you intend to use to follow this guide on Azure portal. It should look like this, `xxxx.webpubsub.azure.com`.

:::image type="content" source="media/howto-integrate-app-gateway/create-resource-step-3.jpg" alt-text="Screenshot showing how to create an Application Gateway resource - create a backend pool.":::

With both the frontends and backends set up, we need to configure a routing rule that connects the frontends and the backends. The routing rule tells Application Gateway how to route traffic and to where. 

First, we set up a listener. This configuration tells Application Gateway to listen for HTTP traffic on PORT 80.

:::image type="content" source="media/howto-integrate-app-gateway/create-resource-step-4.jpg" alt-text="Screenshot showing how to create an Application Gateway resource - create a routing rule, listener.":::

Second, we set up the backend targets. We configure backend targets to the backend pool we created earlier, which is our Web PubSub resource. Additionally, we need to specify how Application Gateway should forward the traffic. You accomplish it through **backend settings**.

:::image type="content" source="media/howto-integrate-app-gateway/create-resource-step-5.jpg" alt-text="Screenshot showing how to create an Application Gateway resource - create a routing rule, backend targets.":::


Web PubSub service only accepts HTTPs traffic. So we instruct Application Gateway to communicate with Web PubSub using HTTPs. To keep this guide focused, we let Application Gateway to pick the host. The recommended practice is to set up a Custom Domain in production.  

:::image type="content" source="media/howto-integrate-app-gateway/create-resource-step-6.jpg" alt-text="Screenshot showing how to create an Application Gateway resource - create a routing rule, backend settings.":::

When the three components are configured, you should see something like the screenshot. You can visualize the flow of traffic through Application Gateway as such: 
1. Web clients send requests to your public IP of your Application Gateway resource.
2. Application Gateway routes traffic by consulting the user-configured routing rules. 
3. When the routing rule matches, the traffic is directed to the designated backend target.

:::image type="content" source="media/howto-integrate-app-gateway/create-resource-step-7.jpg" alt-text="Screenshot showing how to create an Application Gateway resource - finished.":::

One thing that is worth highlighting is that you configure **non-WebSocket** connections exactly the same way. You can learn more about [Application Gateway's native support for proxying WebSocket connections](../application-gateway/features.md)


### Test and verify Application Gateway is configured properly
#### Verify that your Web PubSub resource is healthy
Send a request to an invalid endpoint of your Web PubSub resource and expect an error message from Web PubSub. 
```bash
curl https://<your-web-pubsub-resource-endpoint>/client
```
You should see the error message "Invalid value of 'hub'." This error shows that Web PubSub service successfully received your request and responded accordingly.

#### Verify that Application Gateway proxies traffic to your Web PubSub resource
Repeat a similar step and expect the same error message. 
```bash
curl http://<public-ip-of-your-application-gateway-resource>/client
```
You should see the same error message "Invalid value of 'hub'." This error shows that your Application Gateway resource successfully routed the traffic using the configured routing rule.

### Test and verify Application Gateway can proxy WebSocket connections
#### Publish messages through Web PubSub
We create a simple program to simulate a server publishing messages through Web PubSub periodically. We run the program locally in step 1 to verify everything is working and in step 2, we deploy the same app to Azure App Service.

##### Create the folder structure
```bash
mkdir server && cd server
touch package.json && touch publish.js
```

##### Copy source code
Copy the code to the `package.json` file you created.
```json
{
  "scripts": {
    "start": "node ./publish.js"
  },
  "dependencies": {
    "@azure/web-pubsub": "^1.1.1",
    "express": "^4.19.2"
  }
}
```

Copy the code to the `publish.js` file you created.
```javascript
const express = require("express")
// Uses the service SDK, which makes it easy to consume the capabilities of the service
const { WebPubSubServiceClient } = require('@azure/web-pubsub');

const app = express()
const PORT = 3000

// Hardcodes the hub name 
const hub = "myHub1";

// Grabs the connection string stored as an environment variable
let webpubsub = new WebPubSubServiceClient(process.env.WebPubSubConnectionString, hub);

// Serves the files found in the "public" directory  
app.use(express.static("public"))

// Returns Web PubSub's access token
app.get("/negotiate", async (req, res) => {
  let token = await webpubsub.getClientAccessToken()
  let url = token.url
  res.json({
    url
  })
}
// Every 2 seconds, we ask Web PubSub service to send all connected clients the messsage "hello, world"
setInterval(() => {
  webpubsub.sendToAll("hello, world", { contentType: "text/plain" });
}, 2000);

// Starts the server
app.listen(process.env.PORT || PORT, () => console.log(`server running on ${PORT}`));
```

##### Install dependencies and run the program
On Azure portal, find the `connection string` of your Web PubSub resource.
:::image type="content" source="media/howto-integrate-app-gateway/web-pubsub-connection-string.jpg" alt-text="Screenshot showing how to get the connection string of a Web PubSub resource.":::

```bash
npm install

## Set environment variable
export WebPubSubConnectionString="<replace with the connection string of your Web PubSub resource>"

npm run start
```
You should see "server running on 3000" in the console. Every 2 seconds, the program asks Web PubSub service to broadcast a message to all connected web clients. Even though, no web clients are connected with your Web PubSub resource at the moment, you can see this flow in action by enabling the [Live Trace Tool feature](./howto-troubleshoot-resource-logs.md#launch-the-live-trace-tool), where you can monitor important logging in real time.

#### Receive messages in the browser
It wouldn't be illuminating if we don't receive the broadcasted messages. Inside the server folder, you created earlier, let's create a simple HTML file where we put the client code. The `express` app serves this static file. 

```bash
mkdir public && cd public 
touch index.html
```

##### Copy client code
Copy the code to `index.html`
```html
<!DOCTYPE html>

<body>
  <script type="module">
    const endpoint = "http://localhost:3000"

    // Gets an access token through which the client connects with your Web PubSub resource
    const webPubSubUrl = await getWebPubSubAccessToken(endpoint)

    // Opens a WebSocket connection with your Web PubSub resource using browser native WebSocket API 
    const socket = new WebSocket(webPubSubUrl)

    socket.addEventListener("open", () => {
      console.log("connection opened")
    })

    // Prints out the message when it arrives
    socket.addEventListener("message", (msg) => {
      console.log(msg)
    })

    async function getWebPubSubAccessToken(endpoint) {
      const response = await fetch(endpoint + "/negotiate")
      const { url } = await response.json()
      return url
    }
  </script>
</body>

</html>
```

##### Run the client program
Open your preferred web browser and visit `http://localhost:3000`, where our server is listening. 

:::image type="content" source="media/howto-integrate-app-gateway/local-browser-client-direct.jpg" alt-text="Screenshot showing a browser client directly connects with Web PubSub resource and the server app running locally.":::

Make sure you still have `publish.js` running. If you inspect the page, open the Network and Console panels, you should see that the client is successfully connected with your Web PubSub resources and are getting the broadcasted messages. 

##### Proxy WebSocket connections through Application Gateway
Since Application Gateway has native support for WebSocket, we don't need to change any configuration on our Application Gateway resource. All we need is to change the endpoint our client points to. 

Locate `publish.js` file and make two changes. 
- Declare a variable to hold the public IP of your Application Gateway resource. 
- Change the line where the variable `url` is initialized, `let url=token.url`.
```javascript
// ... code omitted from before
const appGatewayEndpoint = process.env.appGatewayEndpoint

app.get("/negotiate", async (req, res) => {
  const token = await webpubsub.getClientAccessToken()
  const url = "ws://" + appGatewayEndpoint + token.url.split(".com")[1]
  // ... code omitted from before
})
 
// ... code omitted from before
```

Find the public IP of your Application Gateway resource and set the environment variable. 
```bash
export appGatewayEndpoint="<replace with the public IP of your Applciation Gateway resource>"
```

Three points to note. 
- We use the `ws://` instead of `wss://` since your Application Gateway is configured to listen to `http` traffic only. 
- In production, it's probably best to set up custom domain for your Application Gateway resource and configured it to accept HTTPs only.
- We need to keep the access token as it is since it encodes credentials for your client to connect with your Web PubSub resource. 

Open your browser and visit `http://localhost:3000` again, you can verify that the WebSocket is successfully proxied through Application Gateway and receives messages from Application Gateway roughly every 2 seconds.

:::image type="content" source="media/howto-integrate-app-gateway/local-browser-client-indirect.jpg" alt-text="Screenshot showing a browser client indirectly connects with Web PubSub resource and the server app running locally.":::

### Recap of step 1
We reached the end of step 1. If you have been following step 1, you should see that your Web PubSub resource is accessible directly by your web clients **and** indirectly through Application Gateway. You also saw Application Gateway's native support for WebSocket in action. Enabling it doesn't require any configuration changes. We only need to make sure that a web client points to an Application Gateway endpoint. The rest of the access URL generated from Web PubSub service SDK should remain unchanged.  

In step 2, we close public access to your Web PubSub resource, making it more secure.

## Step 2: disable public access to your Web PubSub resource
The outcome of step 1 is that your Web PubSub resource is accessible through both the public internet and Application Gateway. Because your Web PubSub resource isn't in the same Virtual Network, when Application Gateway forwards traffic to your Web PubSub resource, it reaches Web PubSub's public endpoint via **the public internet**. This situation isn't desirable.

Web PubSub service supports configuring access controls. One such configuration is to disable access from public internet. Make sure to hit "save" when you're done.

:::image type="content" source="media/howto-integrate-app-gateway/disable-public-access.jpg" alt-text="Screenshot showing how to disable public access of Web PubSub.":::

Now if you run the same command, instead of seeing "Invalid hub name" as before, you see `403 Forbidden`. 
```bash
curl https://<your-web-pubsub-resource-endpoint>/client
```

Now that public access is disabled on your Web PubSub resource. One impact is that Application Gateway as it is set up in step 1 can't reach it, either. If you run the same command against your Application Gateway endpoint, you see `504 Gateway Time-out`. 
```bash
curl http://<public-ip-of-your-application-gateway-resource>/client
```

We need to bring your Web PubSub resource in the same Virtual Network that your Application Gateway is in. We achieve it by creating a Private Endpoint. [You can learn more about Private Endpoint here.](../private-link/private-endpoint-overview.md)


### Create a separate subnet for your Private Endpoint
In step 1, we created a subnet that houses Application Gateway. Application Gateway requires its own subnet, so we need to create another subnet for your Private Endpoint. 

Locate the Virtual Network resource that we created earlier and create a new subnet.

:::image type="content" source="media/howto-integrate-app-gateway/create-another-subnet.jpg" alt-text="Screenshot showing how to create another subnet.":::

### Create a Private Endpoint for your Web PubSub resource
Locate your Web PubSub resource on Azure portal and go to "Networking" blade.
:::image type="content" source="media/howto-integrate-app-gateway/web-pubsub-create-private-endpoint-step-1.jpg" alt-text="Screenshot showing how to create a separate subnet.":::

Create a Private Endpoint in the same region as your Web PubSub resource. 
:::image type="content" source="media/howto-integrate-app-gateway/web-pubsub-create-private-endpoint-step-2.jpg" alt-text="Screenshot showing how to create a Private Endpoint for Web PubSub resource.":::

Select the separate subnet we just created. 
:::image type="content" source="media/howto-integrate-app-gateway/web-pubsub-create-private-endpoint-step-3.jpg" alt-text="Screenshot showing how to place Web PubSub's Private Endpoint in the newly created subnet.":::

Enable private DNS integration
:::image type="content" source="media/howto-integrate-app-gateway/web-pubsub-create-private-endpoint-step-4.jpg" alt-text="Screenshot showing how to enable private DNS integration.":::


### Refresh the backend pool of your Application Gateway resource
Your Application Gateway resource doesn't know that you created a Private Endpoint for your Web PubSub resource. Locate your Application Gateway resource and refresh the backend pools. 
:::image type="content" source="media/howto-integrate-app-gateway/refresh-backend-pools.jpg" alt-text="Screenshot showing how to refresh backend pools.":::

Now if you run this command again, you should see "Invalid hub name" again, which is expected. It shows that Application Gateway proxies through Virtual Network instead of the public internet.
```bash
curl http://<public-ip-of-your-application-gateway-resource>/client
```

### Deploy the publishing program as an App Service Web App
Because the public access to your Web PubSub resource is disabled, our local `publish.js` program cannot reach the resource. We need to deploy the program as a Web App into the same Virtual Network that our Web PubSub resource is in.

#### Deploy a Web App as a ZIP file
Before we can ZIP up our source code and deploy it to Azure App Service, we need to make a small change to the client code. The `/negotiate` endpoint will no longer be served from `localhost`.

Locate `index.html` in the public folder, and change the line where `endpoint` variable is declared. You need to replace it with the domain name of your Web App. 

:::image type="content" source="media/howto-integrate-app-gateway/web-app-domain-name.jpg" alt-text="Screenshot showing where to get the domain name of Web App resource.":::

```html
  <script>
    // ...code omitted from before
   
   const endpoint = "<replace with your default domain name of your web app>"
    
    // ...code omitted from before
  </script>
```

Web App provides a handy command to deploy an app as a ZIP file. [You can learn more about the `az webapp up` command](../app-service/quickstart-nodejs.md) and the tasks it automates for you.

Locate the server folder you created in step 1.
```bash
## Makes sure you are in the right working directory
cd server 

## Make sure you have Azure CLI installed and log into your Azure account.
az login 

## Creates a ZIP file with the content in the server folder and deploys it as a Web App
az webapp up \
--sku B1 \
--name <the-name-of-your-web-app> \
--location <the-same-location-as-your-Web-PubSub-resource>
```

> [!NOTE] 
> You may need to switch to the Azure subscription in which the resources you created so far if you have been following the guide. 
> To switch subscription, follow the command mentioned in [this documentation article](/cli/azure/manage-azure-subscriptions-azure-cli?tabs=bash#change-the-active-subscription).

#### Set environment variable 
When the `publish.js` program starts, App Service makes the environment variables available for your program to consume. 

There are two environment variables we need to set and make available to `publish.js`.

- Find your connection string to Web PubSub service on Azure portal, and set the `WebPubSubConnectionString` environment variable.
- Find the Frontend public IP of your Application Gateway resource, and set the `appGatewayEndpoint`environment variable.
:::image type="content" source="media/howto-integrate-app-gateway/web-app-set-environment-variables.jpg" alt-text="Screenshot of setting two environment variables of a Web App.":::

#### Enable Virtual Network integration on your Web App
App Service requires a dedicated subnet in your Virtual Network. Go to your Virtual Network resource and create a new subnet like what you did for your Web PubSub resource. 

Once a new subnet is created, go to the "Networking" blade of your Web App resource and enable Virtual Network integration.

:::image type="content" source="media/howto-integrate-app-gateway/web-app-enable-vnet-step-1.jpg" alt-text="Screenshot showing how to enable Virtual Network integration - step 1.":::

Make sure you select the same Virtual Network your Web PubSub resource is in.
:::image type="content" source="media/howto-integrate-app-gateway/web-app-enable-vnet-step-2.jpg" alt-text=" Screenshot showing how to enable Virtual Network integration - step 2.":::

#### Turn off automatic HTTP redirect
By default, Web App redirects HTTP traffic to HTTPs. We need to disable this default behavior. This is not recommended for production workload. 
:::image type="content" source="media/howto-integrate-app-gateway/web-app-turn-off-https-redirect.jpg" alt-text="Screenshot showing how to turn off automatic HTTPs redirect.":::

### Verify that everything works
So far in step 2, you
1. disabled the public access to your Web PubSub resource, 
2. created a Private Endpoint for it,
3. refreshed the backend pools of your Application Gateway resource so that it can reach your Web PubSub resource
4. updated the endpoint by which a client gets an access token for connecting with your Web PubSub resource
5. deployed `publish.js` as a Web App into the same Virtual Network,
6. set two environment variables on your Web App resource,
7. disabled Web App's default behavior of redirecting HTTP traffic to HTTPs.

Now, open your web browser and enter the domain name of your Web App. If you inspect the page, open the Network panel, you see that the client goes to Web App for the access token and then uses the token to establish a WebSocket connection with Application Gateway. 

:::image type="content" source="media/howto-integrate-app-gateway/web-app-serves-access-token.jpg" alt-text="Screenshot showing how to get an access token from a Web App.":::

:::image type="content" source="media/howto-integrate-app-gateway/connect-with-web-pubsub-indirect-azure.jpg" alt-text="Screenshot showing successfully established a WebSocket connection through Application Gateway.":::

If you have the Console panel open, you see the broadcasted messages, as well. 
:::image type="content" source="media/howto-integrate-app-gateway/connect-with-web-pubsub-indirect-azure-messages.jpg" alt-text="Screenshot showing getting messages from Application Gateway, which proxies traffic for Web PubSub.":::
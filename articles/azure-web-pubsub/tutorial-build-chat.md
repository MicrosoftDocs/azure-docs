---
title: Tutorial - Create a chat app with Azure Web PubSub service
description: A tutorial to walk through how to create a chat app with Azure Web PubSub service
author: vicancy
ms.author: lianwei
ms.service: azure-web-pubsub
ms.topic: tutorial 
ms.date: 08/16/2021
---

# Tutorial: Create a chat app with Azure Web PubSub service

In [Publish and subscribe message tutorial](./tutorial-pub-sub-messages.md), you've learned the basics of publishing and subscribing messages with Azure Web PubSub. In this tutorial, you'll learn the event system of Azure Web PubSub so use it to build a complete web application with real-time communication functionality. 

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a Web PubSub service instance
> * Configure event handler settings for Azure Web PubSub
> * Build a real-time chat app

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../includes/azure-cli-prepare-your-environment.md)]

- This setup requires version 2.22.0 or higher of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Create an Azure Web PubSub instance

### Create a resource group

[!INCLUDE [Create a resource group](includes/cli-rg-creation.md)]

### Create a Web PubSub instance

[!INCLUDE [Create a Web PubSub instance](includes/cli-awps-creation.md)]

### Get the ConnectionString for future use

[!INCLUDE [Get the connection string](includes/cli-awps-connstr.md)]

Copy the fetched **ConnectionString** and it will be used later in this tutorial as the value of `<connection_string>`.

## Set up the project

### Prerequisites

# [C#](#tab/csharp)

* [ASP.NET Core 3.1 or above](/aspnet/core)

# [JavaScript](#tab/javascript)

* [Node.js 12.x or above](https://nodejs.org)

---

## Create the application

In Azure Web PubSub, there are two roles, server and client. This concept is similar to the sever and client roles in a web application. Server is responsible for managing the clients, listen and respond to client messages, while client's role is to send user's messages to server, and receive messages from server and visualize them to end user.

In this tutorial, we'll build a real-time chat web application. In a real web application, server's responsibility also includes authenticating clients and serving static web pages for the application UI. 

# [C#](#tab/csharp)

We'll use [ASP.NET Core](/aspnet/core) to host the web pages and handle incoming requests.

First let's create an empty ASP.NET Core app.

1.  Create web app

    ```bash
    dotnet new web
    dotnet add package Azure.Messaging.WebPubSub --prerelease
    ```

2.  Then add `app.UseStaticFiles();` before `app.UseRouting();` in `Startup.cs` to support static files. Remove the default `endpoints.MapGet` inside `app.UseEndpoints`.

    ```csharp
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }

        app.UseStaticFiles();

        app.UseRouting();

        app.UseEndpoints(endpoints =>
        {
        });
    }
    ```

3.  Also create an HTML file and save it as `wwwroot/index.html`, we'll use it for the UI of the chat app later.

    ```html
    <html>
    <body>
      <h1>Azure Web PubSub Chat</h1>
    </body>

    </html>
    ```

You can test the server by running `dotnet run` and access `http://localhost:5000/index.html` in browser.

You may remember in the [publish and subscribe message tutorial](./tutorial-pub-sub-messages.md) the subscriber uses an API in Web PubSub SDK to generate an access token from connection string and use it to connect to the service. This is usually not safe in a real world application as connection string has high privilege to do any operation to the service so you don't want to share it with any client. Let's change this access token generation process to a REST API at server side, so client can call this API to request an access token every time it needs to connect, without need to hold the connection string.

1.  Install Microsoft.Extensions.Azure

    ```bash
    dotnet add package Microsoft.Extensions.Azure
    ```
2. DI the service client inside `ConfigureServices` and don't forget to replace `<connection_string>` with the one of your service.

    ```csharp
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddAzureClients(builder =>
        {
            builder.AddWebPubSubServiceClient("<connection_string>", "chat");
        });
    }
    ```
2.  Add a `/negotiate` API to the server inside `app.UseEndpoints` to generate the token

    ```csharp
    app.UseEndpoints(endpoints =>
    {
        endpoints.MapGet("/negotiate", async context =>
        {
            var id = context.Request.Query["id"];
            if (id.Count != 1)
            {
                context.Response.StatusCode = 400;
                await context.Response.WriteAsync("missing user id");
                return;
            }
            var serviceClient = context.RequestServices.GetRequiredService<WebPubSubServiceClient>();
            await context.Response.WriteAsync(serviceClient.GenerateClientAccessUri(userId: id).AbsoluteUri);
        });
    });
    ```

    This token generation code is very similar to the one we used in the [publish and subscribe message tutorial](./tutorial-pub-sub-messages.md), except we pass one more argument (`userId`) when generating the token. User ID can be used to identify the identity of client so when you receive a message you know where the message is coming from.

    You can test this API by running `dotnet run` and accessing `http://localhost:5000/negotiate?id=<user-id>` and it will give you the full url of the Azure Web PubSub with an access token.

3.  Then update `index.html` with the following script to get the token from server and connect to service
 
    ```html
    <script>
      (async function () {
        let id = prompt('Please input your user name');
        let res = await fetch(`/negotiate?id=${id}`);
        let url = await res.text();
        let ws = new WebSocket(url);
        ws.onopen = () => console.log('connected');
      })();
    </script>
    ```

    You can test it by open the home page, input your user name, then you'll see `connected` being printed out in browser console.


# [JavaScript](#tab/javascript)

We'll use [express.js](https://expressjs.com/), a popular web framework for node.js to achieve this job.

First let's create an empty express app.

1.  Install express.js

    ```bash
    npm init -y
    npm install --save express
    ```

2.  Then create an express server and save it as `server.js`

    ```javascript
    const express = require('express');

    const app = express();
    app.use(express.static('public'));
    app.listen(8080, () => console.log('server started'));
    ```

3.  Also create an HTML file and save it as `public/index.html`, we'll use it for the UI of the chat app later.

    ```html
    <html>

    <body>
      <h1>Azure Web PubSub Chat</h1>
    </body>

    </html>
    ```

You can test the server by running `node server` and access `http://localhost:8080` in browser.


You may remember in the [publish and subscribe message tutorial](./tutorial-pub-sub-messages.md) the subscriber uses an API in Web PubSub SDK to generate an access token from connection string and use it to connect to the service. This is usually not safe in a real world application as connection string has high privilege to do any operation to the service so you don't want to share it with any client. Let's change this access token generation process to a REST API at server side, so client can call this API to request an access token every time it needs to connect, without need to hold the connection string.

1.  Install Azure Web PubSub SDK

    ```bash
    npm install --save @azure/web-pubsub
    ```

2.  Add a `/negotiate` API to the server to generate the token

    ```javascript
    const express = require('express');
    const { WebPubSubServiceClient } = require('@azure/web-pubsub');

    const app = express();
    const hubName = 'chat';

    let serviceClient = new WebPubSubServiceClient(process.argv[2], hubName);

    app.get('/negotiate', async (req, res) => {
      let id = req.query.id;
      if (!id) {
        res.status(400).send('missing user id');
        return;
      }
      let token = await serviceClient.getAuthenticationToken({ userId: id });
      res.json({
        url: token.url
      });
    });

    app.use(express.static('public'));
    app.listen(8080, () => console.log('server started'));
    ```

    This token generation code is very similar to the one we used in the [publish and subscribe message tutorial](./tutorial-pub-sub-messages.md), except we pass one more argument (`userId`) when generating the token. User ID can be used to identify the identity of client so when you receive a message you know where the message is coming from.

    You can test this API by running `node server "<connection-string>"` and accessing `http://localhost:8080/negotiate?id=<user-id>` and it will give you the full url of the Azure Web PubSub with an access token.

3.  Then update `index.html` with the following script to get the token from server and connect to service
 
    ```html
    <script>
      (async function () {
        let id = prompt('Please input your user name');
        let res = await fetch(`/negotiate?id=${id}`);
        let data = await res.json();
        let ws = new WebSocket(data.url);
        ws.onopen = () => console.log('connected');
      })();
    </script>
    ```

    You can test it by open the home page, input your user name, then you'll see `connected` being printed out in browser console.

---

## Handle events

In Azure Web PubSub, when there are certain activities happening at client side (for example a client is connected or disconnected), service will send notifications to sever so it can react to these events.

Events are delivered to server in the form of Webhook. Webhook is served and exposed by the application server and registered at the Azure Web PubSub service side. The service invokes the webhooks whenever an event happens.

Azure Web PubSub follows [CloudEvents](./reference-cloud-events.md) to describe the event data. 

# [C#](#tab/csharp)
For now, you need to implement the event handler by your own in C#, the steps are pretty straight forward following [the protocol spec](./reference-cloud-events.md) as well as illustrated below.

1. Add event handlers inside `UseEndpoints`. Specify the endpoint path for the events, let's say `/eventhandler`. 

2. First we'd like to handle the abuse protection OPTIONS requests, we check if the header contains `WebHook-Request-Origin` header, and we return the header `WebHook-Allowed-Origin`. For simplicity for demo purpose, we return `*` to allow all the origins.
    ```csharp
    app.UseEndpoints(endpoints =>
    {
        // abuse protection
        endpoints.Map("/eventhandler", async context =>
        {
            if (context.Request.Method == "OPTIONS")
            {
                if (context.Request.Headers["WebHook-Request-Origin"].Count > 0)
                {
                    context.Response.Headers["WebHook-Allowed-Origin"] = "*";
                    context.Response.StatusCode = 200;
                    return;
                }
            }
        });
    });
    ```

3. Then we'd like to check if the incoming requests are the events we expects. Let's say we now cares about the system `connected` event, which should contains the header `ce-type` as `azure.webpubsub.sys.connected`. We add the logic after abuse protection:
    ```csharp
    app.UseEndpoints(endpoints =>
    {
        // abuse protection
        endpoints.Map("/eventhandler", async context =>
        {
            if (context.Request.Method == "OPTIONS")
            {
                ...
            }
            else if (context.Request.Method == "POST")
            {
                // get the userId from header
                var userId = context.Request.Headers["ce-userId"];
                if (context.Request.Headers["ce-type"] == "azure.webpubsub.sys.connected")
                {
                    // the connected event
                    Console.WriteLine($"{userId} connected");
                    context.Response.StatusCode = 200;
                    return;
                }
            }
        });
    });
    ```

In the above code we simply print a message to console when a client is connected. You can see we use `context.Request.Headers["ce-userId"]` so we can see the identity of the connected client.

# [JavaScript](#tab/javascript)

If you use Web PubSub SDK, there is already an implementation to parse and process CloudEvents schema so you don't need to deal with these details.

Add the following code to expose a REST API at `/eventhandler` (which is done by the express middleware provided by Web PubSub SDK) to handle the client connected event:

```bash
npm install --save @azure/web-pubsub-express
```

```javascript
const { WebPubSubEventHandler } = require('@azure/web-pubsub-express');

let handler = new WebPubSubEventHandler(hubName, ['*'], {
  path: '/eventhandler',
  onConnected: async req => {
    console.log(`${req.context.userId} connected`);
  }
});

app.use(handler.getMiddleware());
```

In the above code we simply print a message to console when a client is connected. You can see we use `req.context.userId` so we can see the identity of the connected client.

---

## Set up the event handler

### Expose localhost

Then we need to set the Webhook URL in the service so it can know where to call when there is a new event. But there is a problem that our server is running on localhost so does not have an internet accessible endpoint. Here we use [ngrok](https://ngrok.com/) to expose our localhost to internet.

1.  First download ngrok from https://ngrok.com/download, extract the executable to your local folder or your system bin folder.
2.  Start ngrok
    ```bash
    ngrok http 8080
    ```

ngrok will print out an URL (`https://<domain-name>.ngrok.io`) that can be accessed from internet.

### Set event handler

Then we update the service event handler and set the Webhook URL.

[!INCLUDE [update event handler](includes/cli-awps-update-event-handler.md)]

After the update is completed, open the home page http://localhost:5000/index.html, input your user name, you’ll see the connected message printed out in the server console.

## Handle Message events

Besides system events like `connected` or `disconnected`, client can also send messages through the WebSocket connection and these messages will be delivered to server as a special type of event called `message` event. We can use this event to receive messages from one client and broadcast them to all clients so they can talk to each other.

# [C#](#tab/csharp)

The `ce-type` of `message` event is always `azure.webpubsub.user.message`, details please see [Event message](./reference-cloud-events.md#message).

1. Handle message event

    ```csharp
    app.UseEndpoints(endpoints =>
    {
        // abuse protection
        endpoints.Map("/eventhandler", async context =>
        {
            var serviceClient = context.RequestServices.GetRequiredService<WebPubSubServiceClient>();
            if (context.Request.Method == "OPTIONS")
            {
                ...
            }
            else if (context.Request.Method == "POST")
            {
                // get the userId from header
                var userId = context.Request.Headers["ce-userId"];
                if (context.Request.Headers["ce-type"] == "azure.webpubsub.sys.connected")
                {
                    // the connected event
                    Console.WriteLine($"{userId} connected");
                    context.Response.StatusCode = 200;
                    return;
                }
                else if (context.Request.Headers["ce-type"] == "azure.webpubsub.user.message")
                {
                    using var stream = new StreamReader(context.Request.Body);
                    await serviceClient.SendToAllAsync($"[{userId}] {await stream.ReadToEndAsync()}");
                    context.Response.StatusCode = 200;
                    return;
                }
            }
        });
    });
    ```

    This event handler uses `WebPubSubServiceClient.SendToAllAsync()` to broadcast the received message to all clients.

2.  Update `index.html` to add the logic to send message from user to server and display received messages in the page.

    ```html
    <html>

    <body>
      <h1>Azure Web PubSub Chat</h1>
      <input id="message" placeholder="Type to chat...">
      <div id="messages"></div>
      <script>
        (async function () {
          ...

          let messages = document.querySelector('#messages');
          ws.onmessage = event => {
            let m = document.createElement('p');
            m.innerText = event.data;
            messages.appendChild(m);
          };

          let message = document.querySelector('#message');
          message.addEventListener('keypress', e => {
            if (e.charCode !== 13) return;
            ws.send(message.value);
            message.value = '';
          });
        })();
      </script>
    </body>

    </html>
    ```

    You can see in the above code we use `WebSocket.send()` to send message and `WebSocket.onmessage` to listen to message from service.

3.  Finally let's also update the `onConnected` handler to broadcast the connected event to all clients so they can see who joined the chat room.

    ```csharp
    app.UseEndpoints(endpoints =>
    {
        // abuse protection
        endpoints.Map("/eventhandler", async context =>
        {
            if (context.Request.Method == "OPTIONS")
            {
                ...
            }
            else if (context.Request.Method == "POST")
            {
                // get the userId from header
                var userId = context.Request.Headers["ce-userId"];
                if (context.Request.Headers["ce-type"] == "azure.webpubsub.sys.connected")
                {
                    // the connected event
                    Console.WriteLine($"{userId} connected");
                    await serviceClient.SendToAllAsync($"[SYSTEM] {userId} joined.");
                    context.Response.StatusCode = 200;
                    return;
                }
            }
        });
    });
    ```

Now run the server and open multiple browser instances, then you can chat with each other.

The complete code sample of this tutorial can be found [here][code].

[code]: https://github.com/Azure/azure-webpubsub/tree/main/samples/csharp/chatapp/

# [JavaScript](#tab/javascript)

1. Add a new `handleUserEvent` handler

    ```javascript
    let handler = new WebPubSubEventHandler(hubName, ['*'], {
      path: '/eventhandler',
      onConnected: async req => {
        ...
      },
      handleUserEvent: async (req, res) => {
        if (req.context.eventName === 'message') 
            await serviceClient.sendToAll(`[${req.context.userId}] ${req.data}`, { contentType: 'text/plain' });
        res.success();
      }
    });
    ```

    This event handler uses `WebPubSubServiceClient.sendToAll()` to broadcast the received message to all clients.

    You can see `handleUserEvent` also has a `res` object where you can send message back to the event sender. Here we simply call `res.success()` to make the WebHook return 200 (please note this is required even you don't want to return anything back to client, otherwise the WebHook will never return and client connection will be closed).

2.  Update `index.html` to add the logic to send message from user to server and display received messages in the page.

    ```html
    <html>

    <body>
      <h1>Azure Web PubSub Chat</h1>
      <input id="message" placeholder="Type to chat...">
      <div id="messages"></div>
      <script>
        (async function () {
          ...

          let messages = document.querySelector('#messages');
          ws.onmessage = event => {
            let m = document.createElement('p');
            m.innerText = event.data;
            messages.appendChild(m);
          };

          let message = document.querySelector('#message');
          message.addEventListener('keypress', e => {
            if (e.charCode !== 13) return;
            ws.send(message.value);
            message.value = '';
          });
        })();
      </script>
    </body>

    </html>
    ```

    You can see in the above code we use `WebSocket.send()` to send message and `WebSocket.onmessage` to listen to message from service.

3. `sendToAll` accepts object as an input and send JSON text to the clients. In real scenarios, we probably need complex object to carry more information about the message. Finally let's also update the handlers to broadcast JSON objects to all clients:

    ```javascript
    let handler = new WebPubSubEventHandler(hubName, ['*'], {
      path: '/eventhandler',
      onConnected: async req => {
        console.log(`${req.context.userId} connected`);
        await serviceClient.sendToAll({
          type: "system",
          message: `${req.context.userId} joined`
        });
      },
      handleUserEvent: async (req, res) => {
        if (req.context.eventName === 'message') {
          await serviceClient.sendToAll({
            from: req.context.userId,
            message: req.data
          });
        }
        res.success();
      }
    });
    ```

4. And update the client to parse JSON data:
    ```javascript
    ws.onmessage = event => {
      let m = document.createElement('p');
      let data = JSON.parse(event.data);
      m.innerText = `[${data.type || ''}${data.from || ''}] ${data.message}`;
      messages.appendChild(m);
    };
    ```

Now run the server and open multiple browser instances, then you can chat with each other.

The complete code sample of this tutorial can be found [here][code].

[code]: https://github.com/Azure/azure-webpubsub/tree/main/samples/javascript/chatapp/

---

## Next steps

This tutorial provides you a basic idea of how the event system works in Azure Web PubSub service.

Check other tutorials to further dive into how to use the service.

> [!div class="nextstepaction"]
> [Explore more Azure Web PubSub samples](https://aka.ms/awps/samples)

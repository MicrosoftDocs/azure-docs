---
title: Tutorial - Create a chat app with Azure Web PubSub service
description: A tutorial to walk through how to create a chat app with Azure Web PubSub service
author: vicancy
ms.author: lianwei
ms.service: azure-web-pubsub
ms.custom: devx-track-azurecli
ms.topic: tutorial 
ms.date: 11/01/2021
---

# Tutorial: Create a chat app with Azure Web PubSub service

In [Publish and subscribe message tutorial](./tutorial-pub-sub-messages.md), you've learned the basics of publishing and subscribing messages with Azure Web PubSub. In this tutorial, you'll learn the event system of Azure Web PubSub so use it to build a complete web application with real-time communication functionality. 

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a Web PubSub service instance
> * Configure event handler settings for Azure Web PubSub
> * Build a real-time chat app

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

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

* [ASP.NET Core 6](/aspnet/core)

# [JavaScript](#tab/javascript)

* [Node.js 12.x or above](https://nodejs.org)

# [Java](#tab/java)

* [Java Development Kit (JDK)](/java/azure/jdk/) version 8 or above
* [Apache Maven](https://maven.apache.org/download.cgi)

---

## Create the application

In Azure Web PubSub, there are two roles, server and client. This concept is similar to the server and client roles in a web application. Server is responsible for managing the clients, listen, and respond to client messages, while client's role is to send user's messages to server, and receive messages from server and visualize them to end user.

In this tutorial, we'll build a real-time chat web application. In a real web application, server's responsibility also includes authenticating clients and serving static web pages for the application UI. 

# [C#](#tab/csharp)

We'll use [ASP.NET Core 6](/aspnet/core) to host the web pages and handle incoming requests.

First let's create an empty ASP.NET Core app.

1.  Create web app

    ```bash
    dotnet new web
    dotnet add package Microsoft.Azure.WebPubSub.AspNetCore --version 1.0.0-beta.3
    ```
2.  Replace the default app.MapGet() in Program.cs with following code snippet.

    ``` csharp
    if (app.Environment.IsDevelopment())
    {
        app.UseDeveloperExceptionPage();
    }

    app.UseStaticFiles();
    app.UseRouting();

    app.UseEndpoints(endpoints =>
    {
    });
    ```

3.  Also create an HTML file and save it as `wwwroot/index.html`, we'll use it for the UI of the chat app later.

    ```html
    <html>
      <body>
        <h1>Azure Web PubSub Chat</h1>
      </body>
    </html>
    ```
    
You can test the server by running `dotnet run --urls http://localhost:8080` and access http://localhost:8080/index.html in browser.

You may remember in the [publish and subscribe message tutorial](./tutorial-pub-sub-messages.md) the subscriber uses an API in Web PubSub SDK to generate an access token from connection string and use it to connect to the service. This is usually not safe in a real world application as connection string has high privilege to do any operation to the service so you don't want to share it with any client. Let's change this access token generation process to a REST API at server side, so client can call this API to request an access token every time it needs to connect, without need to hold the connection string.

1.  Install dependencies.

    ```bash
    dotnet add package Microsoft.Extensions.Azure
    ```

2.  Add a `Sample_ChatApp` class to handle hub events. Add DI for the service middleware and service client. Don't forget to replace `<connection_string>` with the one of your services. 

    ```csharp
    using Microsoft.Azure.WebPubSub.AspNetCore;

    var builder = WebApplication.CreateBuilder(args);

    builder.Services.AddWebPubSub(
        o => o.ServiceEndpoint = new ServiceEndpoint("<connection_string>"))
        .AddWebPubSubServiceClient<Sample_ChatApp>();

    var app = builder.Build();

    if (app.Environment.IsDevelopment())
    {
        app.UseDeveloperExceptionPage();
    }

    app.UseDefaultFiles();
    app.UseStaticFiles();
    app.UseRouting();

    app.UseEndpoints(endpoints =>
    {
    });

    app.Run();

    sealed class Sample_ChatApp : WebPubSubHub
    {
    }
    ```

  `AddWebPubSubServiceClient<THub>()` is used to inject the service client `WebPubSubServiceClient<THub>`, with which we can use in negotiation step to generate client connection token and in hub methods to invoke service REST APIs when hub events are triggered.

4.  Add a `/negotiate` API to the server inside `app.UseEndpoints` to generate the token.

    ```csharp
    app.UseEndpoints(endpoints =>
    {    
      endpoints.MapGet("/negotiate", async  (WebPubSubServiceClient<Sample_ChatApp> serviceClient, HttpContext context) =>
      {
          var id = context.Request.Query["id"];
          if (id.Count != 1)
          {
              context.Response.StatusCode = 400;
              await context.Response.WriteAsync("missing user id");
              return;
          }
          await context.Response.WriteAsync(serviceClient.GetClientAccessUri(userId: id).AbsoluteUri);
      });
    });
    ```

  This token generation code is similar to the one we used in the [publish and subscribe message tutorial](./tutorial-pub-sub-messages.md), except we pass one more argument (`userId`) when generating the token. User ID can be used to identify the identity of client so when you receive a message you know where the message is coming from.

  You can test this API by running `dotnet run --urls http://localhost:8080` and accessing `http://localhost:8080/negotiate?id=<user-id>` and it will give you the full url of the Azure Web PubSub with an access token.

5.  Then update `index.html` to include the following script to get the token from server and connect to service.
 
    ```html
    <html>
      <body>
        <h1>Azure Web PubSub Chat</h1>
      </body>
  
      <script>
        (async function () {
          let id = prompt('Please input your user name');
          let res = await fetch(`/negotiate?id=${id}`);
          let url = await res.text();
          let ws = new WebSocket(url);
          ws.onopen = () => console.log('connected');
        })();
      </script>
    </html>
    ```

  If you are using Chrome, you can test it by opening the home page, input your user name. Press F12 to open the Developer Tools window, switch to **Console** table and you'll see `connected` being printed in browser console.

# [JavaScript](#tab/javascript)

We'll use [express.js](https://expressjs.com/), a popular web framework for Node.js to achieve this job.

First create an empty express app.

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

You can test the server by running `node server` and access http://localhost:8080 in browser.


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
    const hubName = 'Sample_ChatApp';
    const port = 8080;

    let serviceClient = new WebPubSubServiceClient(process.env.WebPubSubConnectionString, hubName);

    app.get('/negotiate', async (req, res) => {
      let id = req.query.id;
      if (!id) {
        res.status(400).send('missing user id');
        return;
      }
      let token = await serviceClient.getClientAccessToken({ userId: id });
      res.json({
        url: token.url
      });
    });

    app.use(express.static('public'));
    app.listen(8080, () => console.log('server started'));
    ```

    This token generation code is similar to the one we used in the [publish and subscribe message tutorial](./tutorial-pub-sub-messages.md), except we pass one more argument (`userId`) when generating the token. User ID can be used to identify the identity of client so when you receive a message you know where the message is coming from.

    Run the below command to test this API:

    ```bash
    export WebPubSubConnectionString="<connection-string>"
    node server
    ```

    Access `http://localhost:8080/negotiate?id=<user-id>` and it will give you the full url of the Azure Web PubSub with an access token.

3.  Then update `index.html` with the following script to get the token from server and connect to service
 
    ```html

    <html>
      <body>
        <h1>Azure Web PubSub Chat</h1>
      </body>
  
      <script>
        (async function () {
          let id = prompt('Please input your user name');
          let res = await fetch(`/negotiate?id=${id}`);
          let data = await res.json();
          let ws = new WebSocket(data.url);
          ws.onopen = () => console.log('connected');
        })();
      </script>
    </html>
    ```

    If you are using Chrome, you can test it by opening the home page, input your user name. Press F12 to open the Developer Tools window, switch to **Console** table and you'll see `connected` being printed in browser console.

# [Java](#tab/java)

We will use the [Javalin](https://javalin.io/) web framework to host the web pages and handle incoming requests.

1. First let's use Maven to create a new app `webpubsub-tutorial-chat` and switch into the *webpubsub-tutorial-chat* folder:

    ```console
    mvn archetype:generate --define interactiveMode=n --define groupId=com.webpubsub.tutorial --define artifactId=webpubsub-tutorial-chat --define archetypeArtifactId=maven-archetype-quickstart --define archetypeVersion=1.4
    cd webpubsub-tutorial-chat
    ```

2. Let's add the `javalin` web framework dependency into the `dependencies` node of `pom.xml`:

    * `javalin`: simple web framework for Java
    * `slf4j-simple`: Logger for Java

    ```xml
    <!-- https://mvnrepository.com/artifact/io.javalin/javalin -->
    <dependency>
        <groupId>io.javalin</groupId>
        <artifactId>javalin</artifactId>
        <version>3.13.6</version>
    </dependency>

    <dependency>
        <groupId>org.slf4j</groupId>
        <artifactId>slf4j-simple</artifactId>
        <version>1.7.30</version>
    </dependency>
    ```

3. Let's navigate to the */src/main/java/com/webpubsub/tutorial* directory, open the *App.java* file in your editor, use `Javalin.create` to serve static files:

    ```java
    package com.webpubsub.tutorial;
    
    import io.javalin.Javalin;
    
    public class App {
        public static void main(String[] args) {
            // start a server
            Javalin app = Javalin.create(config -> {
                config.addStaticFiles("public");
            }).start(8080);
        }
    }
    ```

    Depending on your setup, you might need to explicitly set the language level to Java 8. This can be done in the pom.xml. Add the following snippet:
    ```xml
    <build>
        <plugins>
            <plugin>
              <artifactId>maven-compiler-plugin</artifactId>
              <version>3.8.0</version>
              <configuration>
                <source>1.8</source>
                <target>1.8</target>
              </configuration>
            </plugin>
        </plugins>
    </build>
    ```

4. Let's create an HTML file and save it into */src/main/resources/public/index.html*. We'll use it for the UI of the chat app later.

    ```html
    <html>
    <body>
      <h1>Azure Web PubSub Chat</h1>
    </body>

    </html>
    ```

You can test the server by running the following command under the directory containing the *pom.xml* file, and access http://localhost:8080 in browser.

```console
mvn compile & mvn package & mvn exec:java -Dexec.mainClass="com.webpubsub.tutorial.App" -Dexec.cleanupDaemonThreads=false
```

You may remember in the [publish and subscribe message tutorial](./tutorial-pub-sub-messages.md) the subscriber uses an API in Web PubSub SDK to generate an access token from connection string and use it to connect to the service. This is usually not safe in a real world application as connection string has high privilege to do any operation to the service so you don't want to share it with any client. Let's change this access token generation process to a REST API at server side, so client can call this API to request an access token every time it needs to connect, without need to hold the connection string.

1. Add Azure Web PubSub SDK dependency into the `dependencies` node of `pom.xml`:

    ```xml
    <dependency>
        <groupId>com.azure</groupId>
        <artifactId>azure-messaging-webpubsub</artifactId>
        <version>1.0.0</version>
    </dependency>
    ```

2. Add a `/negotiate` API to the `App.java` file to generate the token:

    ```java
    package com.webpubsub.tutorial;
    
    import com.azure.messaging.webpubsub.WebPubSubServiceClient;
    import com.azure.messaging.webpubsub.WebPubSubServiceClientBuilder;
    import com.azure.messaging.webpubsub.models.GetClientAccessTokenOptions;
    import com.azure.messaging.webpubsub.models.WebPubSubClientAccessToken;
    import com.azure.messaging.webpubsub.models.WebPubSubContentType;
    import io.javalin.Javalin;
    
    public class App {
        public static void main(String[] args) {
            
            if (args.length != 1) {
                System.out.println("Expecting 1 arguments: <connection-string>");
                return;
            }
    
            // create the service client
            WebPubSubServiceClient service = new WebPubSubServiceClientBuilder()
                    .connectionString(args[0])
                    .hub("Sample_ChatApp")
                    .buildClient();
    
            // start a server
            Javalin app = Javalin.create(config -> {
                config.addStaticFiles("public");
            }).start(8080);
    
            
            // Handle the negotiate request and return the token to the client
            app.get("/negotiate", ctx -> {
                String id = ctx.queryParam("id");
                if (id == null) {
                    ctx.status(400);
                    ctx.result("missing user id");
                    return;
                }
                GetClientAccessTokenOptions option = new GetClientAccessTokenOptions();
                option.setUserId(id);
                WebPubSubClientAccessToken token = service.getClientAccessToken(option);
    
                ctx.result(token.getUrl());
                return;
            });
        }
    }
    ```

    This token generation code is similar to the one we used in the [publish and subscribe message tutorial](./tutorial-pub-sub-messages.md), except we call `setUserId` method to set the user ID when generating the token. User ID can be used to identify the identity of client so when you receive a message you know where the message is coming from.

    You can test this API by running the following command, replacing `<connection_string>` with the **ConnectionString** fetched in [previous step](#get-the-connectionstring-for-future-use), and accessing `http://localhost:8080/negotiate?id=<user-id>` and it will give you the full url of the Azure Web PubSub with an access token.

    ```console
    mvn compile & mvn package & mvn exec:java -Dexec.mainClass="com.webpubsub.tutorial.App" -Dexec.cleanupDaemonThreads=false -Dexec.args="'<connection_string>'"
    ```

3. Then update `index.html` with the following script to get the token from the server and connect to the service.

    ```html
    <html>
      <body>
        <h1>Azure Web PubSub Chat</h1>
      </body>
  
      <script>
        (async function () {
          let id = prompt('Please input your user name');
          let res = await fetch(`/negotiate?id=${id}`);
          let url = await res.text();
          let ws = new WebSocket(url);
          ws.onopen = () => console.log('connected');
        })();
      </script>
    </html>
    ```

    If you are using Chrome, you can test it by opening the home page, input your user name. Press F12 to open the Developer Tools window, switch to **Console** table and you'll see `connected` being printed in browser console.

---

## Handle events

In Azure Web PubSub, when there are certain activities happening at client side (for example a client is connected or disconnected), service will send notifications to server so it can react to these events.

Events are delivered to server in the form of Webhook. Webhook is served and exposed by the application server and registered at the Azure Web PubSub service side. The service invokes the webhooks whenever an event happens.

Azure Web PubSub follows [CloudEvents](./reference-cloud-events.md) to describe the event data. 

# [C#](#tab/csharp)

Here we're using Web PubSub middleware SDK, there is already an implementation to parse and process CloudEvents schema, so we don't need to deal with these details. Instead, we can focus on the inner business logic in the hub methods. 

1. Add event handlers inside `UseEndpoints`. Specify the endpoint path for the events, let's say `/eventhandler`. The `UseEndpoints` should look like follows:
    ```csharp
    app.UseEndpoints(endpoints =>
    {
        endpoints.MapGet("/negotiate", async  (WebPubSubServiceClient<Sample_ChatApp> serviceClient, HttpContext context) =>
        {
            var id = context.Request.Query["id"];
            if (id.Count != 1)
            {
                context.Response.StatusCode = 400;
                await context.Response.WriteAsync("missing user id");
                return;
            }
            await context.Response.WriteAsync(serviceClient.GetClientAccessUri(userId: id).AbsoluteUri);
        });

        endpoints.MapWebPubSubHub<Sample_ChatApp>("/eventhandler/{*path}");
    });
    ```

2. Go the `Sample_ChatApp` we created in previous step. Add a constructor to work with `WebPubSubServiceClient<Sample_ChatApp>` so we can use to invoke service. And override `OnConnectedAsync()` method to respond when `connected` event is triggered.

    ```csharp
    sealed class Sample_ChatApp : WebPubSubHub
    {
        private readonly WebPubSubServiceClient<Sample_ChatApp> _serviceClient;

        public Sample_ChatApp(WebPubSubServiceClient<Sample_ChatApp> serviceClient)
        {
            _serviceClient = serviceClient;
        }

        public override async Task OnConnectedAsync(ConnectedEventRequest request)
        {
            await _serviceClient.SendToAllAsync($"[SYSTEM] {request.ConnectionContext.UserId} joined.");
        }
    }
    ```

In the above code, we use the service client to broadcast a notification message to all of whom is joined.

# [JavaScript](#tab/javascript)

If you use Web PubSub SDK, there is already an implementation to parse and process CloudEvents schema so you don't need to deal with these details.

Add the following code to expose a REST API at `/eventhandler` (which is done by the express middleware provided by Web PubSub SDK) to handle the client connected event:

```bash
npm install --save @azure/web-pubsub-express
```

```javascript
const { WebPubSubEventHandler } = require('@azure/web-pubsub-express');

let handler = new WebPubSubEventHandler(hubName, {
  path: '/eventhandler',
  onConnected: async req => {
    console.log(`${req.context.userId} connected`);
  }
});

app.use(handler.getMiddleware());
```

In the above code, we simply print a message to console when a client is connected. You can see we use `req.context.userId` so we can see the identity of the connected client.

# [Java](#tab/java)
For now, you need to implement the event handler by your own in Java, the steps are straight forward following [the protocol spec](./reference-cloud-events.md) and illustrated below.

1. Add HTTP handler for the event handler path, let's say `/eventhandler`. 

2. First we'd like to handle the abuse protection OPTIONS requests, we check if the header contains `WebHook-Request-Origin` header, and we return the header `WebHook-Allowed-Origin`. For simplicity for demo purpose, we return `*` to allow all the origins.
    ```java
    
    // validation: https://azure.github.io/azure-webpubsub/references/protocol-cloudevents#validation
    app.options("/eventhandler", ctx -> {
        ctx.header("WebHook-Allowed-Origin", "*");
    });
    ```

3. Then we'd like to check if the incoming requests are the events we expect. Let's say we now care about the system `connected` event, which should contain the header `ce-type` as `azure.webpubsub.sys.connected`. We add the logic after abuse protection:
    ```java
    // validation: https://azure.github.io/azure-webpubsub/references/protocol-cloudevents#validation
    app.options("/eventhandler", ctx -> {
        ctx.header("WebHook-Allowed-Origin", "*");
    });

    // handle events: https://azure.github.io/azure-webpubsub/references/protocol-cloudevents#events
    app.post("/eventhandler", ctx -> {
        String event = ctx.header("ce-type");
        if ("azure.webpubsub.sys.connected".equals(event)) {
            String id = ctx.header("ce-userId");
            System.out.println(id + " connected.");
        }
        ctx.status(200);
    });

    ```

In the above code, we simply print a message to console when a client is connected. You can see we use `ctx.header("ce-userId")` so we can see the identity of the connected client.

---

## Set up the event handler

### Expose localhost

Then we need to set the Webhook URL in the service so it can know where to call when there is a new event. But there is a problem that our server is running on localhost so does not have an internet accessible endpoint. There are several tools available on the internet to expose localhost to the internet, for example, [ngrok](https://ngrok.com), [loophole](https://loophole.cloud/docs/), or [TunnelRelay](https://github.com/OfficeDev/microsoft-teams-tunnelrelay). Here we use [ngrok](https://ngrok.com/).

1.  First download ngrok from https://ngrok.com/download, extract the executable to your local folder or your system bin folder.
2.  Start ngrok
    
    ```bash
    ngrok http 8080
    ```

ngrok will print a URL (`https://<domain-name>.ngrok.io`) that can be accessed from internet. In above step we listens the `/eventhandler` path, so next we'd like the service to send events to `https://<domain-name>.ngrok.io/eventhandler`.

### Set event handler

Then we update the service event handler and set the Webhook URL to `https://<domain-name>.ngrok.io/eventhandler`. Event handlers can be set from either the portal or the CLI as [described in this article](howto-develop-eventhandler.md#configure-event-handler), here we set it through CLI.

Use the Azure CLI [az webpubsub hub create](/cli/azure/webpubsub/hub#az-webpubsub-hub-update) command to create the event handler settings for the chat hub

  > [!Important]
  > Replace &lt;your-unique-resource-name&gt; with the name of your Web PubSub resource created from the previous steps.
  > Replace &lt;domain-name&gt; with the name ngrok printed.

```azurecli-interactive
az webpubsub hub create -n "<your-unique-resource-name>" -g "myResourceGroup" --hub-name "Sample_ChatApp" --event-handler url-template="https://<domain-name>.ngrok.io/eventHandler" user-event-pattern="*" system-event="connected"
```

After the update is completed, open the home page http://localhost:8080/index.html, input your user name, you’ll see the connected message printed in the server console.

## Handle Message events

Besides system events like `connected` or `disconnected`, client can also send messages through the WebSocket connection and these messages will be delivered to server as a special type of event called `message` event. We can use this event to receive messages from one client and broadcast them to all clients so they can talk to each other.

# [C#](#tab/csharp)

Implement the OnMessageReceivedAsync() method in Sample_ChatApp.

1. Handle message event.

    ```csharp
    sealed class Sample_ChatApp : WebPubSubHub
    {
        private readonly WebPubSubServiceClient<Sample_ChatApp> _serviceClient;

        public Sample_ChatApp(WebPubSubServiceClient<Sample_ChatApp> serviceClient)
        {
            _serviceClient = serviceClient;
        }

        public override async Task OnConnectedAsync(ConnectedEventRequest request)
        {
            await _serviceClient.SendToAllAsync($"[SYSTEM] {request.ConnectionContext.UserId} joined.");
        }

        public override async ValueTask<UserEventResponse> OnMessageReceivedAsync(UserEventRequest request, CancellationToken cancellationToken)
        {
            await _serviceClient.SendToAllAsync($"[{request.ConnectionContext.UserId}] {request.Data}");

            return request.CreateResponse($"[SYSTEM] ack.");
        }
    }
    ```

    This event handler uses `WebPubSubServiceClient.SendToAllAsync()` to broadcast the received message to all clients. You can see in the end we returned `UserEventResponse`, which contains a message directly to the caller and make the WebHook request success. If you have extra logic to validate and would like to break this call, you can throw an exception here. The middleware will deliver the exception message to service and service will drop current client connection. Do not forget to include the `using Microsoft.Azure.WebPubSub.Common;` statement at the begining of the `Program.cs` file.

2.  Update `index.html` to add the logic to send message from user to server and display received messages in the page.

    ```html
    <html>

    <body>
      <h1>Azure Web PubSub Chat</h1>
      <input id="message" placeholder="Type to chat...">
      <div id="messages"></div>
      <script>
        (async function () {
          let id = prompt('Please input your user name');
          let res = await fetch(`/negotiate?id=${id}`);
          let url = await res.text();
          let ws = new WebSocket(url);
          ws.onopen = () => console.log('connected');

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

Now run the server using `dotnet run --urls http://localhost:8080` and open multiple browser instances to access http://localhost:8080/index.html, then you can chat with each other.

The complete code sample of this tutorial can be found [here][code-csharp-net6], the ASP.NET Core 3.1 version [here][code-csharp].

# [JavaScript](#tab/javascript)

1. Add a new `handleUserEvent` handler

    ```javascript
    let handler = new WebPubSubEventHandler(hubName, {
      path: '/eventhandler',
      onConnected: async req => {
        console.log(`${req.context.userId} connected`);
      },
      handleUserEvent: async (req, res) => {
        if (req.context.eventName === 'message') 
            await serviceClient.sendToAll(`[${req.context.userId}] ${req.data}`, { contentType: 'text/plain' });
        res.success();
      }
    });
    ```

    This event handler uses `WebPubSubServiceClient.sendToAll()` to broadcast the received message to all clients.

    You can see `handleUserEvent` also has a `res` object where you can send message back to the event sender. Here we simply call `res.success()` to make the WebHook return 200 (note this call is required even you don't want to return anything back to client, otherwise the WebHook never returns and client connection will be closed).

2.  Update `index.html` to add the logic to send message from user to server and display received messages in the page.

    ```html
    <html>

      <body>
        <h1>Azure Web PubSub Chat</h1>
        <input id="message" placeholder="Type to chat...">
        <div id="messages"></div>
        <script>
          (async function () {
            let id = prompt('Please input your user name');
            let res = await fetch(`/negotiate?id=${id}`);
            let data = await res.json();
            let ws = new WebSocket(data.url);
            ws.onopen = () => console.log('connected');
  
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

3. `sendToAll` accepts object as an input and send JSON text to the clients. In real scenarios, we probably need complex object to carry more information about the message. Finally update the handlers to broadcast JSON objects to all clients:

    ```javascript
    let handler = new WebPubSubEventHandler(hubName, {
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
    ```html
    <html>

      <body>
        <h1>Azure Web PubSub Chat</h1>
        <input id="message" placeholder="Type to chat...">
        <div id="messages"></div>
        <script>
          (async function () {
            let id = prompt('Please input your user name');
            let res = await fetch(`/negotiate?id=${id}`);
            let data = await res.json();
            let ws = new WebSocket(data.url);
            ws.onopen = () => console.log('connected');
  
            let messages = document.querySelector('#messages');
            
            ws.onmessage = event => {
              let m = document.createElement('p');
              let data = JSON.parse(event.data);
              m.innerText = `[${data.type || ''}${data.from || ''}] ${data.message}`;
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

Now run the server and open multiple browser instances, then you can chat with each other.

The complete code sample of this tutorial can be found [here][code-js].

# [Java](#tab/java)

The `ce-type` of `message` event is always `azure.webpubsub.user.message`, details see [Event message](./reference-cloud-events.md#message).

1. Handle message event

    ```java
    // handle events: https://azure.github.io/azure-webpubsub/references/protocol-cloudevents#events
    app.post("/eventhandler", ctx -> {
        String event = ctx.header("ce-type");
        if ("azure.webpubsub.sys.connected".equals(event)) {
            String id = ctx.header("ce-userId");
            System.out.println(id + " connected.");
        } else if ("azure.webpubsub.user.message".equals(event)) {
            String id = ctx.header("ce-userId");
            String message = ctx.body();
            service.sendToAll(String.format("[%s] %s", id, message), WebPubSubContentType.TEXT_PLAIN);
        }
        ctx.status(200);
    });
    ```

    This event handler uses `client.sendToAll()` to broadcast the received message to all clients.

2.  Update `index.html` to add the logic to send message from user to server and display received messages in the page.

    ```html
    <html>

    <body>
      <h1>Azure Web PubSub Chat</h1>
      <input id="message" placeholder="Type to chat...">
      <div id="messages"></div>
      <script>
        (async function () {
          let id = prompt('Please input your user name');
          let res = await fetch(`/negotiate?id=${id}`);
          let url = await res.text();
          let ws = new WebSocket(url);
          ws.onopen = () => console.log('connected');

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

3.  Finally update the `connected` event handler to broadcast the connected event to all clients so they can see who joined the chat room.

    ```java

    // handle events: https://azure.github.io/azure-webpubsub/references/protocol-cloudevents#events
    app.post("/eventhandler", ctx -> {
        String event = ctx.header("ce-type");
        if ("azure.webpubsub.sys.connected".equals(event)) {
            String id = ctx.header("ce-userId");
            service.sendToAll(String.format("[SYSTEM] %s joined", id), WebPubSubContentType.TEXT_PLAIN);
        } else if ("azure.webpubsub.user.message".equals(event)) {
            String id = ctx.header("ce-userId");
            String message = ctx.body();
            service.sendToAll(String.format("[%s] %s", id, message), WebPubSubContentType.TEXT_PLAIN);
        }
        ctx.status(200);
    });

    ```

Now run the server with the below command and open multiple browser instances, then you can chat with each other.

```console
mvn compile & mvn package & mvn exec:java -Dexec.mainClass="com.webpubsub.tutorial.App" -Dexec.cleanupDaemonThreads=false -Dexec.args="'<connection_string>'"
```

The complete code sample of this tutorial can be found [here][code-java].

---

## Next steps

This tutorial provides you a basic idea of how the event system works in Azure Web PubSub service.

Check other tutorials to further dive into how to use the service.

> [!div class="nextstepaction"]
> [Explore more Azure Web PubSub samples](https://aka.ms/awps/samples)


[code-js]: https://github.com/Azure/azure-webpubsub/tree/main/samples/javascript/chatapp/
[code-java]: https://github.com/Azure/azure-webpubsub/tree/main/samples/java/chatapp/
[code-csharp]: https://github.com/Azure/azure-webpubsub/tree/main/samples/csharp/chatapp/
[code-csharp-net6]: https://github.com/Azure/azure-webpubsub/tree/main/samples/csharp/chatapp-net6/

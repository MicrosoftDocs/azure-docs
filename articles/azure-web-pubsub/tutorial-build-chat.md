---
title: Tutorial - Create a chat app with Azure Web PubSub service
description: A tutorial to walk through how to create a chat app with Azure Web PubSub service
author: vicancy
ms.author: lianwei
ms.service: azure-web-pubsub
ms.custom: devx-track-azurecli
ms.topic: tutorial 
ms.date: 04/11/2024
---

# Tutorial: Create a chat app with Azure Web PubSub service

In [Publish and subscribe message tutorial](./tutorial-pub-sub-messages.md), you learn the basics of publishing and subscribing messages with Azure Web PubSub. In this tutorial, you learn the event system of Azure Web PubSub and use it to build a complete web application with real-time communication functionality.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a Web PubSub service instance
> * Configure event handler settings for Azure Web PubSub
> * Hanlde events in the app server and build a real-time chat app

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

- This setup requires version 2.22.0 or higher of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Create an Azure Web PubSub instance

### Create a resource group

[!INCLUDE [Create a resource group](includes/cli-rg-creation.md)]

### Create a Web PubSub instance

[!INCLUDE [Create a Web PubSub instance](includes/cli-awps-creation.md)]

### Get the ConnectionString for future use

[!INCLUDE [Get the connection string](includes/cli-awps-connstr.md)]

Copy the fetched **ConnectionString** and set it into environment variable `WebPubSubConnectionString`, which the tutorial later reads. Replace `<connection-string>` below with the **ConnectionString** you fetched.

```bash
export WebPubSubConnectionString="<connection-string>"
```

```cmd
SET WebPubSubConnectionString=<connection-string>
```

## Set up the project

### Prerequisites

# [C#](#tab/csharp)

* [ASP.NET Core 8](/aspnet/core)

# [JavaScript](#tab/javascript)

* [Node.js 12.x or above](https://nodejs.org)

# [Java](#tab/java)

* [Java Development Kit (JDK)](/java/azure/jdk/) version 8 or above
* [Apache Maven](https://maven.apache.org/download.cgi)

# [Python](#tab/python)

* [python 3.8 or above](https://www.python.org/)

---

## Create the application

In Azure Web PubSub, there are two roles, server and client. This concept is similar to the server and client roles in a web application. Server is responsible to manage the clients, listen, and respond to client messages. Client is responsible to send and receive user's messages from server and visualize them for end user. 

In this tutorial, we build a real-time chat web application. In a real web application, server's responsibility also includes authenticating clients and serving static web pages for the application UI. 

# [C#](#tab/csharp)

We use [ASP.NET Core 8](/aspnet/core) to host the web pages and handle incoming requests.

First let's create an ASP.NET Core web app in a `chatapp` folder. 

1.  Create a new web app.

    ```bash
    mkdir chatapp
    cd chatapp
    dotnet new web
    ```
2.  Add `app.UseStaticFiles()` Program.cs to support hosting static web pages.

    ``` csharp
    var builder = WebApplication.CreateBuilder(args);
    var app = builder.Build();

    app.UseStaticFiles();

    app.Run();
    ```

3.  Create an HTML file and save it as `wwwroot/index.html`, we use it for the UI of the chat app later.

    ```html
    <html>
      <body>
        <h1>Azure Web PubSub Chat</h1>
      </body>
    </html>
    ```
    
You can test the server by running `dotnet run --urls http://localhost:8080` and access `http://localhost:8080/index.html` in the browser.

# [JavaScript](#tab/javascript)

We use [express.js](https://expressjs.com/), a popular web framework for Node.js to host the web pages and handle incoming requests.

First let's create an express web app in a `chatapp` folder.

1.  Install express.js

    ```bash
    mkdir chatapp
    cd chatapp
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

3.  Also create an HTML file and save it as `public/index.html`, we use it for the UI of the chat app later.

    ```html
    <html>

    <body>
      <h1>Azure Web PubSub Chat</h1>
    </body>

    </html>
    ```

You can test the server by running `node server` and access `http://localhost:8080` in the browser.

# [Java](#tab/java)

We use the [Javalin](https://javalin.io/) web framework to host the web pages and handle incoming requests.

1. Use Maven to create a new app `webpubsub-tutorial-chat` and switch into the *webpubsub-tutorial-chat* folder:

    ```bash
    mvn archetype:generate --define interactiveMode=n --define groupId=com.webpubsub.tutorial --define artifactId=webpubsub-tutorial-chat --define archetypeArtifactId=maven-archetype-quickstart --define archetypeVersion=1.4
    cd webpubsub-tutorial-chat
    ```

2. Add the `javalin` web framework dependency into the `dependencies` node of `pom.xml`:

    * `javalin`: simple web framework for Java
    * `slf4j-simple`: Logger for Java

    ```xml
    <!-- https://mvnrepository.com/artifact/io.javalin/javalin -->
    <dependency>
        <groupId>io.javalin</groupId>
        <artifactId>javalin</artifactId>
        <version>6.1.3</version>
    </dependency>

    <!-- https://mvnrepository.com/artifact/org.slf4j/slf4j-simple -->
    <dependency>
        <groupId>org.slf4j</groupId>
        <artifactId>slf4j-simple</artifactId>
        <version>2.0.12</version>
    </dependency>
    ```

3. Navigate to the */src/main/java/com/webpubsub/tutorial* directory. Open the *App.java* file in your editor. Use `Javalin.create` to serve static files:

    ```java
    package com.webpubsub.tutorial;
    
    import io.javalin.Javalin;
    
    public class App {
        public static void main(String[] args) {
            // start a server
            Javalin app = Javalin.create(config -> {
                config.staticFiles.add("public");
            }).start(8080);
        }
    }
    ```

    Depending on your setup, you might need to explicitly set the language level to Java 8. This step can be done in the pom.xml. Add the following snippet:
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

4. Create an HTML file and save it into */src/main/resources/public/index.html*. We use it for the UI of the chat app later.

    ```html
    <html>
    <body>
      <h1>Azure Web PubSub Chat</h1>
    </body>

    </html>
    ```

You can test the server by running the following command under the directory containing the *pom.xml* file, and access `http://localhost:8080` in browser.

```bash
mvn compile & mvn package & mvn exec:java -Dexec.mainClass="com.webpubsub.tutorial.App" -Dexec.cleanupDaemonThreads=false
```

# [Python](#tab/python)

We use [Flask](https://flask.palletsprojects.com/), a popular web framework for Python to achieve this job.

First create a project folder `chatapp` with Flask ready.

0. Create and activate the environment

    ```bash
    mkdir chatapp
    cd chatapp
    python3 -m venv .venv
    . .venv/bin/activate
    ```

1.  Within the activated environment, install Flask

    ```bash
    pip install Flask
    ```

2.  Then create a Flask server and save it as `server.py`

    ```python
    from flask import (
        Flask, 
        send_from_directory,
    )

    app = Flask(__name__)

    @app.route('/<path:filename>')
    def index(filename):
        return send_from_directory('public', filename)

    if __name__ == '__main__':
        app.run(port=8080)
    ```

3.  Also create an HTML file and save it as `public/index.html`, we use it for the UI of the chat app later.

    ```html
    <html>

    <body>
      <h1>Azure Web PubSub Chat</h1>
    </body>

    </html>
    ```

You can test the server by running `python server.py` and access http://127.0.0.1:8080/index.html in browser.

---

## Add negotiate endpoint

In the tutorial [Publish and subscribe message](./tutorial-pub-sub-messages.md), the subscriber consumes connection string directly. In a real world application, it isn't safe to share the connection string with any client, because connection string has high privilege to do any operation to the service. Now, let's have your server consuming the connection string, and exposing a `negotiate` endpoint for the client to get the full URL with access token. In such way, the server can add auth middleware before the `negotiate` endpoint to prevent unauthorized access.

# [C#](#tab/csharp)

First install the dependencies.

```bash
dotnet add package Microsoft.Azure.WebPubSub.AspNetCore
```

Now let's add a `/negotiate` endpoint for the client to call to generate the token.

```csharp
using Azure.Core;
using Microsoft.Azure.WebPubSub.AspNetCore;
using Microsoft.Azure.WebPubSub.Common;
using Microsoft.Extensions.Primitives;

// Read connection string from environment
var connectionString = Environment.GetEnvironmentVariable("WebPubSubConnectionString");
if (connectionString == null)
{
    throw new ArgumentNullException(nameof(connectionString));
}

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddWebPubSub(o => o.ServiceEndpoint = new WebPubSubServiceEndpoint(connectionString))
    .AddWebPubSubServiceClient<Sample_ChatApp>();
var app = builder.Build();

app.UseStaticFiles();

// return the Client Access URL with negotiate endpoint
app.MapGet("/negotiate", (WebPubSubServiceClient<Sample_ChatApp> service, HttpContext context) =>
{
    var id = context.Request.Query["id"];
    if (StringValues.IsNullOrEmpty(id))
    {
        context.Response.StatusCode = 400;
        return null;
    }
    return new
    {
        url = service.GetClientAccessUri(userId: id).AbsoluteUri
    };
});
app.Run();

sealed class Sample_ChatApp : WebPubSubHub
{
}
```

`AddWebPubSubServiceClient<THub>()` is used to inject the service client `WebPubSubServiceClient<THub>`, with which we can use in negotiation step to generate client connection token and in hub methods to invoke service REST APIs when hub events are triggered. This token generation code is similar to the one we used in the [publish and subscribe message tutorial](./tutorial-pub-sub-messages.md), except we pass one more argument (`userId`) when generating the token. User ID can be used to identify the identity of client so when you receive a message you know where the message is coming from.

The code reads connection string from environment variable `WebPubSubConnectionString` that we set in [previous step](#get-the-connectionstring-for-future-use). 

Rerun the server using `dotnet run --urls http://localhost:8080`.

# [JavaScript](#tab/javascript)

First install Azure Web PubSub SDK:

```bash
npm install --save @azure/web-pubsub
```

Now let's add a `/negotiate` API to generate the token.

```javascript
const express = require('express');
const { WebPubSubServiceClient } = require('@azure/web-pubsub');

const app = express();
const hubName = 'Sample_ChatApp';

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

The code reads connection string from environment variable `WebPubSubConnectionString` that we set in [previous step](#get-the-connectionstring-for-future-use). 

Rerun the server by running `node server`. 

# [Java](#tab/java)

First add Azure Web PubSub SDK dependency and gson into the `dependencies` node of `pom.xml`:

```xml
<!-- https://mvnrepository.com/artifact/com.azure/azure-messaging-webpubsub -->
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-messaging-webpubsub</artifactId>
    <version>1.2.12</version>
</dependency>
<!-- https://mvnrepository.com/artifact/com.google.code.gson/gson -->
<dependency>
    <groupId>com.google.code.gson</groupId>
    <artifactId>gson</artifactId>
    <version>2.10.1</version>
</dependency>
```

Now let's add a `/negotiate` API to the `App.java` file to generate the token:

```java
package com.webpubsub.tutorial;
    
import com.azure.messaging.webpubsub.WebPubSubServiceClient;
import com.azure.messaging.webpubsub.WebPubSubServiceClientBuilder;
import com.azure.messaging.webpubsub.models.GetClientAccessTokenOptions;
import com.azure.messaging.webpubsub.models.WebPubSubClientAccessToken;
import com.azure.messaging.webpubsub.models.WebPubSubContentType;
import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import io.javalin.Javalin;

public class App {
    public static void main(String[] args) {
        String connectionString = System.getenv("WebPubSubConnectionString");

        if (connectionString == null) {
            System.out.println("Please set the environment variable WebPubSubConnectionString");
            return;
        }

        // create the service client
        WebPubSubServiceClient service = new WebPubSubServiceClientBuilder()
                .connectionString(connectionString)
                .hub("Sample_ChatApp")
                .buildClient();

        // start a server
        Javalin app = Javalin.create(config -> {
            config.staticFiles.add("public");
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
            ctx.contentType("application/json");
            Gson gson = new Gson();
            JsonObject jsonObject = new JsonObject();
            jsonObject.addProperty("url", token.getUrl());
            String response = gson.toJson(jsonObject);
            ctx.result(response);
            return;
        });
    }
}
```

This token generation code is similar to the one we used in the [publish and subscribe message tutorial](./tutorial-pub-sub-messages.md), except we call `setUserId` method to set the user ID when generating the token. User ID can be used to identify the identity of client so when you receive a message you know where the message is coming from.

The code reads connection string from environment variable `WebPubSubConnectionString` that we set in [previous step](#get-the-connectionstring-for-future-use).

Rerun the server using the following commands:

```bash
mvn compile & mvn package & mvn exec:java -Dexec.mainClass="com.webpubsub.tutorial.App" -Dexec.cleanupDaemonThreads=false
```

# [Python](#tab/python)

First install Azure Web PubSub SDK.

```bash
pip install azure-messaging-webpubsubservice
```

Now let's add a `/negotiate` API to the server to generate the token.

```python
import os

from flask import (
    Flask, 
    request, 
    send_from_directory,
)

from azure.messaging.webpubsubservice import (
    WebPubSubServiceClient
)

hub_name = 'Sample_ChatApp'
connection_string = os.environ.get('WebPubSubConnectionString')

app = Flask(__name__)
service = WebPubSubServiceClient.from_connection_string(connection_string, hub=hub_name)

@app.route('/<path:filename>')
def index(filename):
    return send_from_directory('public', filename)


@app.route('/negotiate')
def negotiate():
    id = request.args.get('id')
    if not id:
        return 'missing user id', 400

    token = service.get_client_access_token(user_id=id)
    return {
        'url': token['url']
    }, 200

if __name__ == '__main__':
    app.run(port=8080)
```

This token generation code is similar to the one we used in the [publish and subscribe message tutorial](./tutorial-pub-sub-messages.md), except we pass one more argument (`user_id`) when generating the token. User ID can be used to identify the identity of client so when you receive a message you know where the message is coming from.

The code reads connection string from environment variable `WebPubSubConnectionString` that we set in [previous step](#get-the-connectionstring-for-future-use). 

Rerun the server using `python server.py`.

---

You can test this API by accessing `http://localhost:8080/negotiate?id=user1` and it gives you the full url of the Azure Web PubSub with an access token.

## Handle events

In Azure Web PubSub, when there are certain activities happen at client side (for example a client is connecting, connected, disconnected, or a client is sending messages), service sends notifications to server so it can react to these events.

Events are delivered to server in the form of Webhook. Webhook is served and exposed by the application server and registered at the Azure Web PubSub service side. The service invokes the webhooks whenever an event happens.

Azure Web PubSub follows [CloudEvents](./reference-cloud-events.md) to describe the event data. 

Below we handle `connected` system events when a client is connected and handle `message` user events when a client is sending messages to build the chat app.

# [C#](#tab/csharp)

The Web PubSub SDK for AspNetCore `Microsoft.Azure.WebPubSub.AspNetCore` we installed in previous step could also help parse and process the CloudEvents requests. 

First, add event handlers before `app.Run()`. Specify the endpoint path for the events, let's say `/eventhandler`.

```csharp
app.MapWebPubSubHub<Sample_ChatApp>("/eventhandler/{*path}");
app.Run();
```

Now, inside the class `Sample_ChatApp` we created in previous step, add a constructor to work with `WebPubSubServiceClient<Sample_ChatApp>` that we use to invoke the Web PubSub service. And `OnConnectedAsync()` to respond when `connected` event is triggered, `OnMessageReceivedAsync()` to handle messages from the client.

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
        Console.WriteLine($"[SYSTEM] {request.ConnectionContext.UserId} joined.");
    }

    public override async ValueTask<UserEventResponse> OnMessageReceivedAsync(UserEventRequest request, CancellationToken cancellationToken)
    {
        await _serviceClient.SendToAllAsync(RequestContent.Create(
        new
        {
            from = request.ConnectionContext.UserId,
            message = request.Data.ToString()
        }),
        ContentType.ApplicationJson);

        return new UserEventResponse();
    }
}
```

In the above code, we use the service client to broadcast a notification message in JSON format to all of whom is joined with `SendToAllAsync`.

# [JavaScript](#tab/javascript)

Web PubSub SDK for express `@azure/web-pubsub-express` helps parse and process the CloudEvents requests.

```bash
npm install --save @azure/web-pubsub-express
```

Update server.js with the following code to expose a REST API at `/eventhandler` (which is done by the express middleware provided by Web PubSub SDK) to handle the client connected event:

```javascript
const express = require("express");
const { WebPubSubServiceClient } = require("@azure/web-pubsub");
const { WebPubSubEventHandler } = require("@azure/web-pubsub-express");

const app = express();
const hubName = "Sample_ChatApp";

let serviceClient = new WebPubSubServiceClient(process.env.WebPubSubConnectionString, hubName);

let handler = new WebPubSubEventHandler(hubName, {
  path: "/eventhandler",
  onConnected: async (req) => {
    console.log(`${req.context.userId} connected`);
  },
  handleUserEvent: async (req, res) => {
    if (req.context.eventName === "message")
      await serviceClient.sendToAll({
        from: req.context.userId,
        message: req.data,
      });
    res.success();
  },
});
app.get("/negotiate", async (req, res) => {
  let id = req.query.id;
  if (!id) {
    res.status(400).send("missing user id");
    return;
  }
  let token = await serviceClient.getClientAccessToken({ userId: id });
  res.json({
    url: token.url,
  });
});

app.use(express.static("public"));
app.use(handler.getMiddleware());

app.listen(8080, () => console.log("server started"));

```

In the above code, `onConnected` simply prints a message to console when a client is connected. You can see we use `req.context.userId` so we can see the identity of the connected client. And `handleUserEvent` is invoked when a client sends a message. It uses `WebPubSubServiceClient.sendToAll()` to broadcast the message in a JSON object to all clients. You can see `handleUserEvent` also has a `res` object where you can send message back to the event sender. Here we simply call `res.success()` to make the WebHook return 200 (note this call is required even you don't want to return anything back to client, otherwise the WebHook never returns and client connection closes).

# [Java](#tab/java)
For now, you need to implement the event handler by your own in Java. The steps are straight forward following [the protocol spec](./reference-cloud-events.md) and illustrated in the below list:

1. Add HTTP handler for the event handler path, let's say `/eventhandler`. 

2. First we'd like to handle the abuse protection OPTIONS requests, we check if the header contains `WebHook-Request-Origin` header, and we return the header `WebHook-Allowed-Origin`. For simplicity for demo purpose, we return `*` to allow all the origins.
    ```java
    
    // validation: https://learn.microsoft.com/azure/azure-web-pubsub/reference-cloud-events#protection
    app.options("/eventhandler", ctx -> {
        ctx.header("WebHook-Allowed-Origin", "*");
    });
    ```

3. Then we'd like to check if the incoming requests are the events we expect. Let's say we now care about the system `connected` event, which should contain the header `ce-type` as `azure.webpubsub.sys.connected`. We add the logic after abuse protection to broadcast the connected event to all clients so they can see who joined the chat room.
    ```java
    // validation: https://learn.microsoft.com/azure/azure-web-pubsub/reference-cloud-events#protection
    app.options("/eventhandler", ctx -> {
        ctx.header("WebHook-Allowed-Origin", "*");
    });

    // handle events: https://learn.microsoft.com/azure/azure-web-pubsub/reference-cloud-events#events
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

4. The `ce-type` of `message` event is always `azure.webpubsub.user.message`. Details see [Event message](./reference-cloud-events.md#message). We update the logic to handle messages that when a message comes in we broadcast the message in JSON format to all the connected clients.
   
    ```java
    // handle events: https://learn.microsoft.com/azure/azure-web-pubsub/reference-cloud-events#events
    app.post("/eventhandler", ctx -> {
        String event = ctx.header("ce-type");
        if ("azure.webpubsub.sys.connected".equals(event)) {
            String id = ctx.header("ce-userId");
            System.out.println(id + " connected.");
        } else if ("azure.webpubsub.user.message".equals(event)) {
            String id = ctx.header("ce-userId");
            String message = ctx.body();
            Gson gson = new Gson();
            JsonObject jsonObject = new JsonObject();
            jsonObject.addProperty("from", id);
            jsonObject.addProperty("message", message);
            String messageToSend = gson.toJson(jsonObject);
            service.sendToAll(messageToSend, WebPubSubContentType.APPLICATION_JSON);
        }
        ctx.status(200);
    });
    ```

# [Python](#tab/python)

For now, you need to implement the event handler by your own in Python. The steps are straight forward following [the protocol spec](./reference-cloud-events.md) and are illustrated in the below list:

1. Add HTTP handler for the event handler path, let's say `/eventhandler`. 

2. First we'd like to handle the abuse protection OPTIONS requests, we check if the header contains `WebHook-Request-Origin` header, and we return the header `WebHook-Allowed-Origin`. For simplicity for demo purpose, we return `*` to allow all the origins.
    ```python
    # validation: https://learn.microsoft.com/azure/azure-web-pubsub/reference-cloud-events#protection
    @app.route('/eventhandler', methods=['OPTIONS'])
    def handle_event():
        if request.method == 'OPTIONS':
            if request.headers.get('WebHook-Request-Origin'):
                res = Response()
                res.headers['WebHook-Allowed-Origin'] = '*'
                res.status_code = 200
                return res
    ```

3. Then we'd like to check if the incoming requests are the events we expect. Let's say we now care about the system `connected` event, which should contain the header `ce-type` as `azure.webpubsub.sys.connected`. We add the logic after abuse protection:
    ```python
    # validation: https://learn.microsoft.com/azure/azure-web-pubsub/reference-cloud-events#protection
    # handle events: https://learn.microsoft.com/azure/azure-web-pubsub/reference-cloud-events#events
    @app.route('/eventhandler', methods=['POST', 'OPTIONS'])
    def handle_event():
        if request.method == 'OPTIONS':
            if request.headers.get('WebHook-Request-Origin'):
                res = Response()
                res.headers['WebHook-Allowed-Origin'] = '*'
                res.status_code = 200
                return res
        elif request.method == 'POST':
            user_id = request.headers.get('ce-userid')
            if request.headers.get('ce-type') == 'azure.webpubsub.sys.connected':
                return user_id + ' connected', 200
            else:
                return 'Not found', 404
    ```

    In the above code, we simply print a message to console when a client is connected. You can see we use `request.headers.get('ce-userid')` so we can see the identity of the connected client.

4. The `ce-type` of `message` event is always `azure.webpubsub.user.message`. Details see [Event message](./reference-cloud-events.md#message). We update the logic to handle messages that when a message comes in we broadcast the message to all the connected clients.
   
    ```python
    @app.route('/eventhandler', methods=['POST', 'OPTIONS'])
    def handle_event():
        if request.method == 'OPTIONS':
            if request.headers.get('WebHook-Request-Origin'):
                res = Response()
                res.headers['WebHook-Allowed-Origin'] = '*'
                res.status_code = 200
                return res
        elif request.method == 'POST':
            user_id = request.headers.get('ce-userid')
            type = request.headers.get('ce-type')
            if type == 'azure.webpubsub.sys.connected':
                print(f"{user_id} connected")
                return '', 204
            elif type == 'azure.webpubsub.user.message':
                # default uses JSON
                service.send_to_all(message={
                    'from': user_id,
                    'message': request.data.decode('UTF-8')
                })
                # returned message is also received by the client
                return {
                    'from': "system",
                    'message': "message handled by server"
                }, 200
            else:
                return 'Bad Request', 400
    ```
---

## Update the web page
Now let's update `index.html` to add the logic to connect, send message, and display received messages in the page.

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

You can see in the above code we connect use the native WebSocket API in the browser, and use `WebSocket.send()` to send message and `WebSocket.onmessage` to listen to received messages. 

You could also use [Client SDKs](./reference-client-sdk-javascript.md) to connect to the service, which empowers you with auto reconnect, error handling, and more.

There's now one step left for the chat to work. Let's configure what events we care about and where to send the events to in the Web PubSub service.

## Set up the event handler

We set the event handler in the Web PubSub service to tell the service where to send the events to. 

When the web server runs locally, how the Web PubSub service invokes the localhost if it have no internet accessible endpoint? There are usually two ways. One is to expose localhost to public using some general tunnel tool, and the other is to use [awps-tunnel](./howto-web-pubsub-tunnel-tool.md) to tunnel the traffic from Web PubSub service through the tool to your local server. 

In this section, we use Azure CLI to set the event handlers and use [awps-tunnel](./howto-web-pubsub-tunnel-tool.md) to route traffic to localhost.

### Configure hub settings

We set the URL template to use `tunnel` scheme so that Web PubSub routes messages through the `awps-tunnel`'s tunnel connection. Event handlers can be set from either the portal or the CLI as [described in this article](howto-develop-eventhandler.md#configure-event-handler), here we set it through CLI. Since we listen events in path `/eventhandler` as the previous step sets, we set the url template to `tunnel:///eventhandler`.

Use the Azure CLI [az webpubsub hub create](/cli/azure/webpubsub/hub#az-webpubsub-hub-create) command to create the event handler settings for the `Sample_ChatApp` hub.

  > [!Important]
  > Replace &lt;your-unique-resource-name&gt; with the name of your Web PubSub resource created from the previous steps.

```azurecli-interactive
az webpubsub hub create -n "<your-unique-resource-name>" -g "myResourceGroup" --hub-name "Sample_ChatApp" --event-handler url-template="tunnel:///eventhandler" user-event-pattern="*" system-event="connected"
```

### Run awps-tunnel locally

#### Download and install awps-tunnel
The tool runs on [Node.js](https://nodejs.org/) version 16 or higher.

```bash
npm install -g @azure/web-pubsub-tunnel-tool
```

#### Use the service connection string and run
```bash
export WebPubSubConnectionString="<your connection string>"
awps-tunnel run --hub Sample_ChatApp --upstream http://localhost:8080
```

## Run the web server

Now everything is set. Let's run the web server and play with the chat app in action.

# [C#](#tab/csharp)

Now run the server using `dotnet run --urls http://localhost:8080`.

The complete code sample of this tutorial can be found [here][code-csharp].

# [JavaScript](#tab/javascript)

Now run the server using `node server`.

The complete code sample of this tutorial can be found [here][code-js].

# [Java](#tab/java)

Now run the server using below command:
```bash
mvn compile & mvn package & mvn exec:java -Dexec.mainClass="com.webpubsub.tutorial.App" -Dexec.cleanupDaemonThreads=false
```

The complete code sample of this tutorial can be found [here][code-java].

# [Python](#tab/python)

Now run the server using `python server.py`.

The complete code sample of this tutorial can be found [here][code-python].

---

Open `http://localhost:8080/index.html`. You can input your user name and start chatting.

<!-- Adding Lazy Auth part with `connect` handling -->

## Lazy Auth with `connect` event handler

In previous sections, we demonstrate how to use [negotiate](#add-negotiate-endpoint) endpoint to return the Web PubSub service URL and the JWT access token for the clients to connect to Web PubSub service. In some cases, for example, edge devices that have limited resources, clients might prefer direct connect to Web PubSub resources. In such cases, you can configure `connect` event handler to lazy auth the clients, assign user ID to the clients, specify the groups the clients join once they connect, configure the permissions the clients have and WebSocket subprotocol as the WebSocket response to the client, etc. Details please refer to [connect event handler spec](./reference-cloud-events.md#connect). 

Now let's use `connect` event handler to acheive the similar as what the [negotiate](#add-negotiate-endpoint) section does.

### Update hub settings

First let's update hub settings to also include `connect` event handler, we need to also allow anonymous connect so that clients without JWT access token can connect to the service.

Use the Azure CLI [az webpubsub hub update](/cli/azure/webpubsub/hub#az-webpubsub-hub-update) command to create the event handler settings for the `Sample_ChatApp` hub.

  > [!Important]
  > Replace &lt;your-unique-resource-name&gt; with the name of your Web PubSub resource created from the previous steps.

```azurecli-interactive
az webpubsub hub update -n "<your-unique-resource-name>" -g "myResourceGroup" --hub-name "Sample_ChatApp" --allow-anonymous true --event-handler url-template="tunnel:///eventhandler" user-event-pattern="*" system-event="connected" system-event="connect"
```

### Update upstream logic to handle connect event

Now let's update upstream logic to handle connect event. We could also remove the negotiate endpoint now. 

As similar to what we do in negotiate endpoint as demo purpose, we also read id from the query parameters. In connect event, the original client query is preserved in connect event requet body.

# [C#](#tab/csharp)

Inside the class `Sample_ChatApp`, override `OnConnectAsync()` to handle `connect` event:

```csharp
sealed class Sample_ChatApp : WebPubSubHub
{
    private readonly WebPubSubServiceClient<Sample_ChatApp> _serviceClient;

    public Sample_ChatApp(WebPubSubServiceClient<Sample_ChatApp> serviceClient)
    {
        _serviceClient = serviceClient;
    }

    public override ValueTask<ConnectEventResponse> OnConnectAsync(ConnectEventRequest request, CancellationToken cancellationToken)
    {
        if (request.Query.TryGetValue("id", out var id))
        {
            return new ValueTask<ConnectEventResponse>(request.CreateResponse(userId: id.FirstOrDefault(), null, null, null));
        }

        // The SDK catches this exception and returns 401 to the caller
        throw new UnauthorizedAccessException("Request missing id");
    }

    public override async Task OnConnectedAsync(ConnectedEventRequest request)
    {
        Console.WriteLine($"[SYSTEM] {request.ConnectionContext.UserId} joined.");
    }

    public override async ValueTask<UserEventResponse> OnMessageReceivedAsync(UserEventRequest request, CancellationToken cancellationToken)
    {
        await _serviceClient.SendToAllAsync(RequestContent.Create(
        new
        {
            from = request.ConnectionContext.UserId,
            message = request.Data.ToString()
        }),
        ContentType.ApplicationJson);

        return new UserEventResponse();
    }
}
```

# [JavaScript](#tab/javascript)

Update server.js to handle the client connect event:

```javascript
const express = require("express");
const { WebPubSubServiceClient } = require("@azure/web-pubsub");
const { WebPubSubEventHandler } = require("@azure/web-pubsub-express");

const app = express();
const hubName = "Sample_ChatApp";

let serviceClient = new WebPubSubServiceClient(process.env.WebPubSubConnectionString, hubName);

let handler = new WebPubSubEventHandler(hubName, {
  path: "/eventhandler",
  handleConnect: async (req, res) => {
    if (req.context.query.id){
      res.success({ userId: req.context.query.id });
    } else {
      res.fail(401, "missing user id");
    }
  },
  onConnected: async (req) => {
    console.log(`${req.context.userId} connected`);
  },
  handleUserEvent: async (req, res) => {
    if (req.context.eventName === "message")
      await serviceClient.sendToAll({
        from: req.context.userId,
        message: req.data,
      });
    res.success();
  },
});
app.use(express.static("public"));
app.use(handler.getMiddleware());

app.listen(8080, () => console.log("server started"));
```

# [Java](#tab/java)
Now let's add the logic to handle the connect event `azure.webpubsub.sys.connect`:

```java

// validation: https://learn.microsoft.com/azure/azure-web-pubsub/reference-cloud-events#protection
app.options("/eventhandler", ctx -> {
    ctx.header("WebHook-Allowed-Origin", "*");
});

// handle events: https://learn.microsoft.com/azure/azure-web-pubsub/reference-cloud-events#connect
app.post("/eventhandler", ctx -> {
    String event = ctx.header("ce-type");
    if ("azure.webpubsub.sys.connect".equals(event)) {
        String body = ctx.body();
        System.out.println("Reading from request body...");
        Gson gson = new Gson();
        JsonObject requestBody = gson.fromJson(body, JsonObject.class); // Parse JSON request body
        JsonObject query = requestBody.getAsJsonObject("query");
        if (query != null) {
            System.out.println("Reading from request body query:" + query.toString());
            JsonElement idElement = query.get("id");
            if (idElement != null) {
                JsonArray idInQuery = query.get("id").getAsJsonArray();
                if (idInQuery != null && idInQuery.size() > 0) {
                    String id = idInQuery.get(0).getAsString();
                    ctx.contentType("application/json");
                    Gson response = new Gson();
                    JsonObject jsonObject = new JsonObject();
                    jsonObject.addProperty("userId", id);
                    ctx.result(response.toJson(jsonObject));
                    return;
                }
            }
        } else {
            System.out.println("No query found from request body.");
        }
        ctx.status(401).result("missing user id");
    } else if ("azure.webpubsub.sys.connected".equals(event)) {
        String id = ctx.header("ce-userId");
        System.out.println(id + " connected.");
        ctx.status(200);
    } else if ("azure.webpubsub.user.message".equals(event)) {
        String id = ctx.header("ce-userId");
        String message = ctx.body();
        service.sendToAll(String.format("{\"from\":\"%s\",\"message\":\"%s\"}", id, message), WebPubSubContentType.APPLICATION_JSON);
        ctx.status(200);
    }
});

```

# [Python](#tab/python)
Now let's handle the system `connect` event, which should contain the header `ce-type` as `azure.webpubsub.sys.connect`. We add the logic after abuse protection:

```python
@app.route('/eventhandler', methods=['POST', 'OPTIONS'])
def handle_event():
    if request.method == 'OPTIONS' or request.method == 'GET':
        if request.headers.get('WebHook-Request-Origin'):
            res = Response()
            res.headers['WebHook-Allowed-Origin'] = '*'
            res.status_code = 200
            return res
    elif request.method == 'POST':
        user_id = request.headers.get('ce-userid')
        type = request.headers.get('ce-type')
        print("Received event of type:", type)
        # Sample connect logic if connect event handler is configured
        if type == 'azure.webpubsub.sys.connect':
            body = request.data.decode('utf-8')
            print("Reading from connect request body...")
            query = json.loads(body)['query']
            print("Reading from request body query:", query)
            id_element = query.get('id')
            user_id = id_element[0] if id_element else None
            if user_id:
                return {'userId': user_id}, 200
            return 'missing user id', 401
        elif type == 'azure.webpubsub.sys.connected':
            return user_id + ' connected', 200
        elif type == 'azure.webpubsub.user.message':
            service.send_to_all(content_type="application/json", message={
                'from': user_id,
                'message': request.data.decode('UTF-8')
            })
            return Response(status=204, content_type='text/plain')
        else:
            return 'Bad Request', 400

```

---

### Update index.html to direct connect

Now let's update the web page to direct connect to Web PubSub service. One thing to mention is that now for demo purpose the Web PubSub service endpoint is hard-coded into the client code, please update the service hostname `<the host name of your service>` in the below html with the value from your own service. It might be still useful to fetch the Web PubSub service endpoint value from your server, it gives you more flexibility and controllability to where the client connects to.

```html
<html>
  <body>
    <h1>Azure Web PubSub Chat</h1>
    <input id="message" placeholder="Type to chat...">
    <div id="messages"></div>
    <script>
      (async function () {
        // sample host: mock.webpubsub.azure.com
        let hostname = "<the host name of your service>";
        let id = prompt('Please input your user name');
        let ws = new WebSocket(`wss://${hostname}/client/hubs/Sample_ChatApp?id=${id}`);
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

### Rerun the server

Now [rerun the server](#run-the-web-server) and visit the web page following the instructions before. If you've stopped `awps-tunnel`, please also [rerun the tunnel tool](#run-awps-tunnel-locally). 

## Next steps

This tutorial provides you with a basic idea of how the event system works in Azure Web PubSub service.

Check other tutorials to further dive into how to use the service.

> [!div class="nextstepaction"]
> [Explore more Azure Web PubSub samples](https://aka.ms/awps/samples)


[code-js]: https://github.com/Azure/azure-webpubsub/tree/main/samples/javascript/chatapp/
[code-java]: https://github.com/Azure/azure-webpubsub/tree/main/samples/java/chatapp/
[code-csharp]: https://github.com/Azure/azure-webpubsub/tree/main/samples/csharp/chatapp/
[code-python]: https://github.com/Azure/azure-webpubsub/tree/main/samples/python/chatapp/

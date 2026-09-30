---
title: Write an upstream server for Azure Web PubSub
titleSuffix: Azure Web PubSub Service
description: Learn how to implement an upstream server that handles Azure Web PubSub connect events with examples in C#, JavaScript, Java, and Python.
author: vicancy
ms.author: lianwei
ms.service: azure-web-pubsub
ms.topic: how-to
ms.date: 11/20/2024
---

# Write an upstream server for Azure Web PubSub

Azure Web PubSub routes system and user events to an upstream server so that you can authorize clients and handle events from the clients. This article explains how the service calls upstream handlers, then shows complete implementations in C#, JavaScript, Java, and Python, followed by debugging tips.

## Prerequisites

- An Azure Web PubSub resource with a hub (the examples use `Sample_ChatApp`).
- [Azure CLI](/cli/azure/install-azure-cli) 2.22.0 or later.
- [Azure Web PubSub tunnel tool](https://www.npmjs.com/package/@azure/web-pubsub-tunnel-tool) (`npm install -g @azure/web-pubsub-tunnel-tool`).

## Understand how Azure Web PubSub calls upstreams

Azure Web PubSub forwards events to the HTTP endpoint you configure per hub. Each callback arrives as a [CloudEvent](./reference-cloud-events.md) that contains metadata such as the event type (`ce-type`), the user identity (`ce-userid`), and the request body. The service expects:

- A reachable endpoint defined in the hub's event handler settings (for example, `tunnel:///eventhandler` when using the tunnel tool, or `https://contoso.com/eventhandler` when your upstream server endpoint is exposed and reachable).
- `connect` responses that return `userId`, initial groups to join, and other negotiated properties as described in the [connect event spec](./reference-cloud-events.md#connect).
- Standard HTTP status codes. Returning `401` or `403` from `connect` rejects the client, while returning `2xx` from user events acknowledges the message.

Keep this contract in mind while implementing and testing your upstream logic.

## Implement the upstream server

The upstream server processes events that the service forwards to any reachable HTTP endpoint. You can expose your handler publicly (for example, `https://contoso.com/eventhandler`) or keep it private behind the [Web PubSub local tunnel tool](./howto-web-pubsub-tunnel-tool.md) while developing locally. The examples below use the tunnel endpoint for convenience, but the handler logic works the same no matter how it's hosted.

### Configure the hub to call your upstream

> [!IMPORTANT]
> Replace `<your-unique-resource-name>` with the name of your Azure Web PubSub resource and keep the hub name that matches your app. When deploying to a publicly reachable server, set `url-template` to the fully qualified URL (for example, `https://contoso.com/eventhandler`). When testing locally through the tunnel, use `tunnel:///eventhandler` as shown below.

```azurecli-interactive
az webpubsub hub create \
    -n "<your-unique-resource-name>" \
    -g "myResourceGroup" \
    --hub-name "Sample_ChatApp" \
    --event-handler url-template="tunnel:///eventhandler" user-event-pattern="*" system-event="connect" system-event="connected" system-event="disconnected"
```

### Sample upstream implementations

The upstream server handles events based on your event handler configuration. The examples below demonstrate handling common events:

- **`connect`** events to validate clients and assign a `userId`.
- **`connected`** events to log successful joins.
- **`disconnected`** events to capture why clients leave and clean up the resources.
- **User events** (for example, `message`) that carry user payloads so your upstream can run your application logic.

You can configure which system events and user event patterns the service forwards to your upstream by adjusting the `--system-event` and `--user-event-pattern` parameters in your hub settings.

Each language sample below expects the upstream to listen on port 8080 at `/eventhandler`.

> [!NOTE]
> The tunnel tool embeds a `userId` inside each client’s SAS token. Azure Web PubSub passes this value to your upstream through the `ce-userId` CloudEvent header (surfaced as `ConnectionContext.UserId` in the .NET and JavaScript helpers). The samples below read that header whenever it exists and only generate random IDs for demonstration. Replace that fallback with your production authentication logic.

# [C#](#tab/csharp)

#### Prerequisites

- .NET 8 SDK installed.

#### Initialize the project

```dotnetcli
dotnet new web -n SampleChatApp
cd SampleChatApp
```

#### Install packages

```dotnetcli
dotnet add package Microsoft.Azure.WebPubSub.AspNetCore
```

#### Add the code

Replace the contents of `Program.cs` with the following single-file sample. It builds and runs the upstream handler on port 8080.

```csharp
using System;
using Azure.Core;
using Azure.Messaging.WebPubSub;
using Microsoft.Azure.WebPubSub.AspNetCore;
using Microsoft.Azure.WebPubSub.Common;

var connectionString = Environment.GetEnvironmentVariable("WebPubSubConnectionString")
    ?? throw new InvalidOperationException("Set the WebPubSubConnectionString environment variable.");

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddWebPubSub(o => o.ServiceEndpoint = new WebPubSubServiceEndpoint(connectionString))
    .AddWebPubSubServiceClient<Sample_ChatApp>();

var app = builder.Build();

app.MapWebPubSubHub<Sample_ChatApp>("/eventhandler/{*path}");

app.Run("http://localhost:8080");

sealed class Sample_ChatApp : WebPubSubHub
{
    private readonly WebPubSubServiceClient<Sample_ChatApp> _serviceClient;

    public Sample_ChatApp(WebPubSubServiceClient<Sample_ChatApp> serviceClient)
    {
        _serviceClient = serviceClient;
    }

    public override ValueTask<ConnectEventResponse> OnConnectAsync(
        ConnectEventRequest request,
        CancellationToken cancellationToken)
    {
        var userId = request.ConnectionContext.UserId;
        if (string.IsNullOrEmpty(userId))
        {
            // Demo only: assign a random ID when the tunnel doesn't include one in the SAS token.
            // Production apps should authenticate callers and issue their own stable user IDs.
            userId = Guid.NewGuid().ToString();
            Console.WriteLine($"[CONNECT] Generated demo user id: {userId}");
        }
        else
        {
            Console.WriteLine($"[CONNECT] Received user id: {userId}");
        }

        return new ValueTask<ConnectEventResponse>(
            request.CreateResponse(userId: userId, null, null, null));
    }

    public override Task OnConnectedAsync(ConnectedEventRequest request)
    {
        Console.WriteLine($"[SYSTEM] {request.ConnectionContext.UserId} joined.");
        return Task.CompletedTask;
    }

    public override Task OnDisconnectedAsync(DisconnectedEventRequest request)
    {
        Console.WriteLine($"[SYSTEM] {request.ConnectionContext.UserId} disconnected: {request.Reason}");
        return Task.CompletedTask;
    }

    public override async ValueTask<UserEventResponse> OnMessageReceivedAsync(
        UserEventRequest request,
        CancellationToken cancellationToken)
    {
        await _serviceClient.SendToAllAsync(
            RequestContent.Create(new
            {
                from = request.ConnectionContext.UserId,
                message = request.Data.ToString()
            }),
            ContentType.ApplicationJson);

        return new UserEventResponse();
    }
}
```

#### Run the upstream

```dotnetcli
set WebPubSubConnectionString=<your connection string>   # use export on macOS/Linux
dotnet run
```

# [JavaScript](#tab/javascript)

#### Prerequisites

- Node.js 12.x or later.

#### Initialize the project

```bash
mkdir webpubsub-upstream && cd webpubsub-upstream
npm init -y
```

#### Install packages

```bash
npm install express @azure/web-pubsub @azure/web-pubsub-express
```

#### Add the code

Create a file named `index.js` in the project directory and add the following code.

```javascript
const crypto = require("crypto");
const express = require("express");
const { WebPubSubServiceClient } = require("@azure/web-pubsub");
const { WebPubSubEventHandler } = require("@azure/web-pubsub-express");

const app = express();
const hubName = "Sample_ChatApp";
const serviceClient = new WebPubSubServiceClient(process.env.WebPubSubConnectionString, hubName);

const handler = new WebPubSubEventHandler(hubName, {
  path: "/eventhandler",
  handleConnect: async (req, res) => {
    let userId = req.context.userId;
    if (!userId) {
      // Demo only: assign a random ID when the tunnel doesn't include one in the SAS token.
      // Production apps should authenticate callers and issue their own stable user IDs.
      userId = crypto.randomBytes(16).toString("hex");
      console.log(`[CONNECT] Generated demo user id: ${userId}`);
    } else {
      console.log(`[CONNECT] Received user id: ${userId}`);
    }
    res.success({ userId });
  },
  onConnected: async (req) => console.log(`${req.context.userId} connected`),
  onDisconnected: async (req) =>
    console.log(`${req.context.userId} disconnected: ${req.context.reason}`),
  handleUserEvent: async (req, res) => {
    if (req.context.eventName === "message") {
      await serviceClient.sendToAll({
        from: req.context.userId,
        message: req.data,
      });
    }
    res.success();
  },
});

app.use(express.static("public"));
app.use(handler.getMiddleware());
app.listen(8080, () => console.log("Server listening on port 8080"));
```

#### Run the upstream

```bash
set WebPubSubConnectionString=<your connection string>   # use export on macOS/Linux
node index.js
```

# [Java](#tab/java)

#### Prerequisites

- JDK 8 or later and Apache Maven.

#### Initialize the project

```bash
mvn -B archetype:generate \
  -DarchetypeArtifactId=maven-archetype-quickstart \
  -DarchetypeVersion=1.4 \
  -DgroupId=com.contoso.pubsub \
  -DartifactId=webpubsub-upstream \
  -DinteractiveMode=false
cd webpubsub-upstream
```

#### Install packages

Add dependencies similar to the following in your `pom.xml` (use the latest versions):

```xml
<dependency>
  <groupId>com.azure</groupId>
  <artifactId>azure-messaging-webpubsub</artifactId>
  <version>1.4.0</version>
</dependency>
<dependency>
  <groupId>com.google.code.gson</groupId>
  <artifactId>gson</artifactId>
  <version>2.11.0</version>
</dependency>
<dependency>
  <groupId>io.javalin</groupId>
  <artifactId>javalin</artifactId>
  <version>5.6.2</version>
</dependency>
<dependency>
  <groupId>org.slf4j</groupId>
  <artifactId>slf4j-simple</artifactId>
  <version>2.0.13</version>
</dependency>
```

> [!TIP]
> `io.javalin:javalin` powers the HTTP server and requires a logging backend (`org.slf4j:slf4j-simple`). This sample uses Gson for JSON parsing/serialization, so keep `com.google.code.gson:gson` in the dependency list. If you see `package io.javalin does not exist`, double-check that dependency. If the console prints `No SLF4J providers were found`, add `slf4j-simple`. If the handler returns HTTP 500 when writing JSON, ensure you rebuilt after adding Gson and that the response body is serialized with `Gson`.

#### Configure the compiler

The default Maven quickstart template targets Java 7, which causes lambda-related compilation errors. Update the `<properties>` section of `pom.xml` (or add it if it doesn't exist) so the compiler uses Java 8 or later:

```xml
<properties>
  <maven.compiler.source>8</maven.compiler.source>
  <maven.compiler.target>8</maven.compiler.target>
  <maven.compiler.release>8</maven.compiler.release>
</properties>
```

#### Add the code

Replace the contents of `src/main/java/com/contoso/pubsub/App.java` with the following code.

```java
package com.contoso.pubsub;

import com.azure.messaging.webpubsub.WebPubSubServiceClient;
import com.azure.messaging.webpubsub.WebPubSubServiceClientBuilder;
import com.azure.messaging.webpubsub.models.WebPubSubContentType;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import io.javalin.Javalin;
import java.util.UUID;

public final class App {
    private static final Gson GSON = new Gson();

    public static void main(String[] args) {
        WebPubSubServiceClient service = new WebPubSubServiceClientBuilder()
            .connectionString(System.getenv("WebPubSubConnectionString"))
            .hub("Sample_ChatApp")
            .buildClient();

        Javalin app = Javalin.create(config -> config.plugins.enableDevLogging()).start(8080);

        app.options("/eventhandler", ctx -> ctx.header("WebHook-Allowed-Origin", "*"));

        app.exception(Exception.class, (e, ctx) -> {
            e.printStackTrace();
            ctx.status(500).result("Server error: " + e.getMessage());
        });

        app.post("/eventhandler", ctx -> {
            String event = ctx.header("ce-type");
            if ("azure.webpubsub.sys.connect".equals(event)) {
                String userId = ctx.header("ce-userId");
                if (userId == null || userId.isEmpty()) {
                    // Demo only: assign a random ID when the tunnel doesn't include one in the SAS token.
                    // Production apps should authenticate callers and issue their own stable user IDs.
                    userId = UUID.randomUUID().toString();
                    System.out.println("[CONNECT] Generated demo user id: " + userId);
                } else {
                    System.out.println("[CONNECT] Received user id: " + userId);
                }
                JsonObject response = new JsonObject();
                response.addProperty("userId", userId);
                ctx.status(200);
                ctx.contentType("application/json");
                ctx.result(GSON.toJson(response));
            } else if ("azure.webpubsub.sys.connected".equals(event)) {
                ctx.status(200);
                System.out.println(ctx.header("ce-userId") + " connected.");
            } else if ("azure.webpubsub.sys.disconnected".equals(event)) {
                ctx.status(200);
                JsonObject body = JsonParser.parseString(ctx.body()).getAsJsonObject();
                String reason = body.has("reason") ? body.get("reason").getAsString() : "unknown";
                System.out.println(ctx.header("ce-userId") + " disconnected: " + reason);
            } else if ("azure.webpubsub.user.message".equals(event)) {
                String userId = ctx.header("ce-userId");
                String message = ctx.body();
                service.sendToAll(
                    String.format("{\"from\":\"%s\",\"message\":\"%s\"}", userId, message),
                    WebPubSubContentType.APPLICATION_JSON);
                ctx.status(200);
            } else {
                ctx.status(400).result("unsupported event");
            }
        });
    }
}
```

The sample enables Javalin's dev logging and a global exception handler so any unexpected failure prints a stack trace to the console. If the tunnel still reports HTTP 500, check the terminal output for the underlying exception.

#### Run the upstream

```bash
set WebPubSubConnectionString=<your connection string>   # use export on macOS/Linux
mvn -q package
mvn -q exec:java -Dexec.mainClass=com.contoso.pubsub.App
```


# [Python](#tab/python)

#### Prerequisites

- Python 3.8 or later.

#### Initialize the project

```bash
python -m venv .venv
# On Windows use: .venv\Scripts\activate
# On macOS/Linux use: source .venv/bin/activate
```

#### Install packages

```bash
pip install flask azure-messaging-webpubsubservice
```

#### Add the code

Create a file named `app.py` in the project root and add the following code.

```python
import json
import os
import uuid
from flask import Flask, request, Response
from azure.messaging.webpubsubservice import WebPubSubServiceClient

app = Flask(__name__)
service = WebPubSubServiceClient.from_connection_string(
    hub='Sample_ChatApp',
    connection_string=os.environ['WebPubSubConnectionString'])

@app.route('/eventhandler', methods=['POST', 'OPTIONS'])
def handle_event():
    if request.method == 'OPTIONS':
        res = Response()
        res.headers['WebHook-Allowed-Origin'] = '*'
        return res, 200

    user_id = request.headers.get('ce-userid')
    event_type = request.headers.get('ce-type')
    print(f"Received event: {event_type}")

    if event_type == 'azure.webpubsub.sys.connect':
        if not user_id:
            # Demo only: assign a random ID when the tunnel doesn't include one in the SAS token.
            # Production apps should authenticate callers and issue their own stable user IDs.
            user_id = uuid.uuid4().hex
            app.logger.info("[CONNECT] Generated demo user id: %s", user_id)
        else:
            app.logger.info("[CONNECT] Received user id: %s", user_id)
        return {'userId': user_id}, 200

    if event_type == 'azure.webpubsub.sys.connected':
        return f'{user_id} connected', 200
    if event_type == 'azure.webpubsub.sys.disconnected':
        reason = json.loads(request.data.decode('utf-8')).get('reason', 'unknown')
        return f'{user_id} disconnected: {reason}', 200

    if event_type == 'azure.webpubsub.user.message':
        service.send_to_all(content_type='application/json', message={
            'from': user_id,
            'message': request.data.decode('utf-8')
        })
        return Response(status=204, content_type='text/plain')

    return 'Bad Request', 400

if __name__ == '__main__':
    app.run(port=8080)
```

#### Run the upstream

```bash
set WebPubSubConnectionString=<your connection string>   # use export on macOS/Linux
python app.py
```

--- 

## Debug event handlers

The tunnel lets you keep a local server private while still receiving callbacks from Azure Web PubSub. Start it alongside your upstream to inspect CloudEvents end to end. It also provides a way to establish a client connection to Web PubSub easily so you can try the end-to-end flow in the tunnel web page.

> [!TIP]
> See [Azure Web PubSub local tunnel tool](./howto-web-pubsub-tunnel-tool.md) for installation, authentication, and troubleshooting guidance.

# [Linux or macOS](#tab/bash)

```bash
export WebPubSubConnectionString="<your connection string>"
awps-tunnel run --hub Sample_ChatApp --upstream http://localhost:8080 --verbose
```

# [Windows](#tab/cmd)

```cmd
SET WebPubSubConnectionString=<your connection string>
awps-tunnel run --hub Sample_ChatApp --upstream http://localhost:8080 --verbose
```

---

* Open the web view URL that the tunnel prints (for example, http://127.0.0.1:9080). The **Server** tab shows requests flowing to your upstream, while the **Client** tab lets you establish WebSocket connections.
* Use the **Client** tab’s **Connect** button (or copy the connection URL it displays) to spin up client connections.

### Inspect CloudEvents and service telemetry

- Log `ce-type`, `ce-userid`, and query parameters inside your upstream code to see which phase (`connect`, `connected`, `disconnected`, user event) triggered the callback.
- Return descriptive HTTP status codes (for example, `401` for missing auth or `400` for malformed input). The tunnel UI and service diagnostics surface these failures immediately.
- Use Azure Web PubSub metrics and Live Trace in the portal to confirm whether events reach the upstream when debugging in production or other remote environments.

## Next steps

- [Azure Web PubSub local tunnel tool](./howto-web-pubsub-tunnel-tool.md)
- [Azure Web PubSub CloudEvents reference](./reference-cloud-events.md)

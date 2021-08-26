---
title: Tutorial - Build a serverless real-time chat app with authentication
description: A tutorial to walk through how to using Azure Web PubSub service and Azure Functions to build a serverless chat app with authentication.
author: yjin81
ms.author: yajin1
ms.service: azure-web-pubsub
ms.topic: tutorial 
ms.date: 03/11/2021
---

# Tutorial: Create a serverless real-time chat app with Azure Functions and Azure Web PubSub service

The Azure Web PubSub service helps you build real-time messaging web applications using WebSockets and the publish-subscribe pattern easily. Azure Functions is a serverless platform that lets you run your code without managing any infrastructure. In this tutorial, you learn how to use Azure Web PubSub service and Azure Functions to build a serverless application with real-time messaging and the publish-subscribe pattern.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Build a serverless real-time chat app
> * Work with Web PubSub function trigger bindings and output bindings
> * Deploy the function to Azure Function App
> * Configure Azure Authentication
> * Configure Web PubSub Event Handler to route events and messages to the application

## Prerequisites

# [JavaScript](#tab/javascript)

* A code editor, such as [Visual Studio Code](https://code.visualstudio.com/)

* [Node.js](https://nodejs.org/en/download/), version 10.x.
   > [!NOTE]
   > For more information about the supported versions of Node.js, see [Azure Functions runtime versions documentation](../azure-functions/functions-versions.md#languages).
* [Azure Functions Core Tools](https://github.com/Azure/azure-functions-core-tools#installing) (v3 or higher preferred) to run Azure Function apps locally and deploy to Azure.

* [Azure command-line interface (Azure CLI)](/cli/azure) to manage Azure resources.

* (Optional)[ngrok](https://ngrok.com/download) to expose local function as event handler for Web PubSub service. This is optional only for running the function app locally.

# [C#](#tab/csharp)

* A code editor, such as [Visual Studio Code](https://code.visualstudio.com/).

* [Azure Functions Core Tools](https://github.com/Azure/azure-functions-core-tools#installing) (v3 or higher preferred) to run Azure Function apps locally and deploy to Azure.

* [Azure command-line interface (Azure CLI)](/cli/azure) to manage Azure resources.

* (Optional)[ngrok](https://ngrok.com/download) to expose local function as event handler for Web PubSub service. This is optional only for running the function app locally.

---

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [create-instance-portal](includes/create-instance-portal.md)]

## Create and run the functions locally

1. Make sure you have [Azure Functions Core Tools](https://github.com/Azure/azure-functions-core-tools#installing) installed. And then create an empty directory for the project. Run command under this working directory.

    # [Javascript](#tab/javascript)
    ```bash
    func init --worker-runtime javascript
    ```

    # [C#](#tab/csharp)
    ```bash
    func init --worker-runtime dotnet
    ```

1. Install `Microsoft.Azure.WebJobs.Extensions.WebPubSub` function extension package explicitly.

   a. Remove `extensionBundle` section in `host.json` to enable install specific extension package in next step. Or simply make host json as simple a below.
    ```json
    {
        "version": "2.0"
    }
    ```
   b. Run command to install specific function extension package.
    ```bash
    func extensions install --package Microsoft.Azure.WebJobs.Extensions.WebPubSub --version 1.0.0-beta.3
    ```

1. Create an `index` function to read and host a static web page for clients.
    ```bash
    func new -n index -t HttpTrigger
    ```
   # [JavaScript](#tab/javascript)
   - Update `index/function.json` and copy following json codes.
        ```json
        {
            "bindings": [
                {
                    "authLevel": "anonymous",
                    "type": "httpTrigger",
                    "direction": "in",
                    "name": "req",
                    "methods": [
                      "get",
                      "post"
                    ]
                },
                {
                    "type": "http",
                    "direction": "out",
                    "name": "res"
                }
            ]
        }
        ```
   - Update `index/index.js` and copy following codes.
        ```js
        var fs = require('fs');
        module.exports = function (context, req) {
            fs.readFile('index.html', 'utf8', function (err, data) {
                if (err) {
                    console.log(err);
                    context.done(err);
                }
                context.res = {
                    status: 200,
                    headers: {
                        'Content-Type': 'text/html'
                    },
                    body: data
                };
                context.done();
            });
        }
        ```

   # [C#](#tab/csharp)
   - Update `index.cs` and replace `Run` function with following codes.
        ```c#
        [FunctionName("index")]
        public static IActionResult Run([HttpTrigger(AuthorizationLevel.Anonymous)] HttpRequest req)
        {
            return new ContentResult
            {
                Content = File.ReadAllText("index.html"),
                ContentType = "text/html",
            };
        }
        ```

1. Create a `negotiate` function to help clients get service connection url with access token.
    ```bash
    func new -n negotiate -t HttpTrigger
    ```
    # [JavaScript](#tab/javascript)
   - Update `negotiate/function.json` and copy following json codes.
        ```json
        {
            "bindings": [
                {
                    "authLevel": "anonymous",
                    "type": "httpTrigger",
                    "direction": "in",
                    "name": "req"
                },
                {
                    "type": "http",
                    "direction": "out",
                    "name": "res"
                },
                {
                    "type": "webPubSubConnection",
                    "name": "connection",
                    "hub": "notification",
                    "direction": "in"
                }
            ]
        }
        ```
   - Update `negotiate/index.js` and copy following codes.
        ```js
        module.exports = function (context, req, connection) {
            context.res = { body: connection };
            context.done();
        };
        ```
   # [C#](#tab/csharp)
   - Update `negotiate.cs` and replace `Run` function with following codes.
        ```c#
        [FunctionName("negotiate")]
        public static WebPubSubConnection Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = null)] HttpRequest req,
            [WebPubSubConnection(Hub = "notification")] WebPubSubConnection connection,
            ILogger log)
        {
            log.LogInformation("Connecting...");
            return connection;
        }
        ```

1. Create a `message` function to broadcast client messages through service.
   ```bash
   func new -n message -t HttpTrigger
   ```

   # [JavaScript](#tab/javascript)
   - Update `message/function.json` and copy following json codes.
        ```json
        {
            "bindings": [
                {
                    "type": "webPubSubTrigger",
                    "direction": "in",
                    "name": "message",
                    "dataType": "binary",
                    "hub": "simplechat",
                    "eventName": "message",
                    "eventType": "user"
                },
                {
                    "type": "webPubSub",
                    "name": "webPubSubEvent",
                    "hub": "simplechat",
                    "direction": "out"
                }
            ]
        }
        ```
   - Update `message/index.js` and copy following codes.
        ```js
        module.exports = async function (context, message) {
            context.bindings.webPubSubEvent = {
                "operationKind": "sendToAll",
                "message": message,
                "dataType": context.bindingData.dataType
            };
            var response = { 
                "message": { from: '[System]', content: 'ack.'},
                "dataType" : "json"
            };
            return response;
        };
        ```

   # [C#](#tab/csharp)
   - Update `message.cs` and replace `Run` function with following codes.
        ```c#
        [FunctionName("message")]
        public static async Task<MessageResponse> Run(
            [WebPubSubTrigger(WebPubSubEventType.User, "message")] ConnectionContext context,
            BinaryData message,
            MessageDataType dataType,
            [WebPubSub(Hub = "simplechat")] IAsyncCollector<WebPubSubOperation> operations)
        {
            await operations.AddAsync(new SendToAll
            {
                Message = message,
                DataType = dataType
            });
            return new MessageResponse
            {
                Message = BinaryData.FromString(new ClientContent("ack").ToString()),
                DataType = MessageDataType.Json
            };
        }
        ```

## Configure and run the Azure Function app

- In the browser, open the **Azure portal** and confirm the Web PubSub Service instance you deployed earlier was successfully created. Navigate to the instance.
- Select **Keys** and copy out the connection string.

:::image type="content" source="media/quickstart-serverless/copy-connection-string.png" alt-text="Screenshot of copying the Web PubSub connection string.":::

# [JavaScript](#tab/javascript)

- Update function configuration.

  Open the */samples/functions/js/simplechat* folder in the cloned repository. Edit *local.settings.json* to add service connection string.
  In *local.settings.json*, you need to make these changes and then save the file.
    - Replace the place holder `<connection-string>` to the real one copied from **Azure portal** for **`WebPubSubConnectionString`** setting. 
    - **`AzureWebJobsStorage`** setting is required due to [Azure Functions requires an Azure Storage account](../azure-functions/storage-considerations.md).
        - If you have [Azure Storage Emulator](https://go.microsoft.com/fwlink/?linkid=717179&clcid=0x409) run in local, keep the original settings of "UseDevelopmentStorage=true".
        - If you have an Azure storage connection string, replace the value with it.
 
- JavaScript functions are organized into folders. In each folder are two files: `function.json` defines the bindings that are used in the function, and `index.js` is the body of the function. There are several triggered functions in this function app:

    - **login** - This function is the HTTP triggered function. It uses the *webPubSubConnection* input binding to generate and return valid service connection information.
    - **messages** - This function is the `WebPubSubTrigger` triggered function. Receives a chat message in the request body and uses the `WebPubSub` output binding to broadcast the message to all connected client applications.
    - **connect** and **connected** - These functions are the `WebPubSubTrigger` triggered functions. Handle the connect and connected events.

- In the terminal, ensure that you are in the */samples/functions/js/simplechat* folder. Install the extensions and run the function app.

    ```bash
    func extensions install

    func start
    ```

# [C#](#tab/csharp)

- Update function configuration.

  Open the */samples/functions/csharp/simplechat* folder in the cloned repository. Edit *local.settings.json* to add service connection string.
  In *local.settings.json*, you need to make these changes and then save the file.
    - Replace the place holder `<connection-string>` to the real one copied from **Azure portal** for **`WebPubSubConnectionString`** setting. 
    - **`AzureWebJobsStorage`** setting is required because of [Azure Functions requires an Azure Storage account](../azure-functions/storage-considerations.md).
        - If you have [Azure Storage Emulator](https://go.microsoft.com/fwlink/?linkid=717179&clcid=0x409) run in local, keep the original settings of "UseDevelopmentStorage=true".
        - If you have an Azure storage connection string, replace the value with it.

- C# functions are organized by file Functions.cs. There are several triggered functions in this function app:

    - **login** - This function is the HTTP triggered function. It uses the *webPubSubConnection* input binding to generate and return valid service connection information.
    - **connected** - This function is the `WebPubSubTrigger` triggered function. Receives a chat message in the request body and broadcast the message to all connected client applications with multiple tasks.
    - **broadcast** - This function is the `WebPubSubTrigger` triggered function. Receives a chat message in the request body and broadcast the message to all connected client applications with single task.
    - **connect** and **disconnect** - These functions are the `WebPubSubTrigger` triggered functions. Handle the connect and disconnect events.

- In the terminal, ensure that you are in the */samples/functions/csharp/simplechat* folder. Install the extensions and run the function app.

    ```bash
    func extensions install

    func start
    ```

---

- The local function will use port defined in the `local.settings.json` file. To make it available in public network, you need to work with [ngrok](https://ngrok.com) to expose this endpoint. Run command below and you'll get a forwarding endpoint, for example: http://{ngrok-id}.ngrok.io -> http://localhost:7071.

    ```bash
    ngrok http 7071
    ``` 

- Set `Event Handler` in Azure Web PubSub service. Go to **Azure portal** -> Find your Web PubSub resource -> **Settings**. Add a new hub settings mapping to the one function in use as below. Replace the {ngrok-id} to yours.

   - Hub Name: `simplechat`
   - URL Template: **http://{ngrok-id}.ngrok.io/runtime/webhooks/webpubsub**
   - User Event Pattern: *
   - System Events: connect, connected, disconnected.

:::image type="content" source="media/quickstart-serverless/set-event-handler.png" alt-text="Screenshot of setting the event handler.":::

## Run the web application

1. To simplify your client testing, open your browser to our sample [single page web application](http://jialinxin.github.io/webpubsub/). 

1. Enter the function app base URL as local: `http://localhost:7071`.

1. Enter a username.

1. The web application calls the *login* function in the function app to retrieve the connection information to connect to Azure Web PubSub service. When you saw `Client websocket opened.`, it means the connection is established. 

1. Type a message and press enter. The application sends the message to the *messages* function in the Azure Function app, which then uses the Web PubSub output binding to broadcast the message to all connected clients. If everything is working correctly, the message will appear in the application.

1. Open another instance of the web application in a different browser window. You'll see that any messages sent will appear in all instances of the application.

## Clean up resources

If you're not going to continue to use this app, delete all resources created by this doc with the following steps so you don't incur any charges:

1. In the Azure portal, select **Resource groups** on the far left, and then select the resource group you created. You may use the search box to find the resource group by its name instead.

1. In the window that opens, select the resource group, and then select **Delete resource group**.

1. In the new window, type the name of the resource group to delete, and then select **Delete**.

## Next steps

In this quickstart, you learned how to run a serverless chat application. Now, you could start to build your own application. 

> [!div class="nextstepaction"]
> [Quick start: Create a simple chatroom with Azure Web PubSub](https://azure.github.io/azure-webpubsub/getting-started/create-a-chat-app/js-handle-events)

> [!div class="nextstepaction"]
> [Azure Web PubSub bindings for Azure Functions](https://azure.github.io/azure-webpubsub/references/functions-bindings)

> [!div class="nextstepaction"]
> [Explore more Azure Web PubSub samples](https://github.com/Azure/azure-webpubsub/tree/main/samples)
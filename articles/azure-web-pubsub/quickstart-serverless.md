---
title: Tutorial - Build a serverless real-time chat app with client authentication
description: A tutorial to walk through how to use Azure Web PubSub service and Azure Functions to build a serverless chat app with client authentication.
author: JialinXin
ms.author: jixin
ms.service: azure-web-pubsub
ms.topic: tutorial
ms.date: 05/05/2023
---

# Tutorial: Create a serverless real-time chat app with Azure Functions and Azure Web PubSub service

The Azure Web PubSub service helps you build real-time messaging web applications using WebSockets and the publish-subscribe pattern easily. Azure Functions is a serverless platform that lets you run your code without managing any infrastructure. In this tutorial, you learn how to use Azure Web PubSub service and Azure Functions to build a serverless application with real-time messaging and the publish-subscribe pattern.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> - Build a serverless real-time chat app
> - Work with Web PubSub function trigger bindings and output bindings
> - Deploy the function to Azure Function App
> - Configure Azure Authentication
> - Configure Web PubSub Event Handler to route events and messages to the application

## Prerequisites

# [JavaScript](#tab/javascript)

- A code editor, such as [Visual Studio Code](https://code.visualstudio.com/)

- [Node.js](https://nodejs.org/en/download/), version 10.x.
  > [!NOTE]
  > For more information about the supported versions of Node.js, see [Azure Functions runtime versions documentation](../azure-functions/functions-versions.md#languages).
- [Azure Functions Core Tools](https://github.com/Azure/azure-functions-core-tools#installing) (v4 or higher preferred) to run Azure Function apps locally and deploy to Azure.

- The [Azure CLI](/cli/azure) to manage Azure resources.

# [C# in-process](#tab/csharp-in-process)

- A code editor, such as [Visual Studio Code](https://code.visualstudio.com/).

- [Azure Functions Core Tools](https://github.com/Azure/azure-functions-core-tools#installing) (v4 or higher preferred) to run Azure Function apps locally and deploy to Azure.

- The [Azure CLI](/cli/azure) to manage Azure resources.

# [C# isolated process](#tab/csharp-isolated-process)

- A code editor, such as [Visual Studio Code](https://code.visualstudio.com/).

- [Azure Functions Core Tools](https://github.com/Azure/azure-functions-core-tools#installing) (v4 or higher preferred) to run Azure Function apps locally and deploy to Azure.

- The [Azure CLI](/cli/azure) to manage Azure resources.

---

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [create-instance-portal](includes/create-instance-portal.md)]

## Create the functions

1. Make sure you have [Azure Functions Core Tools](https://github.com/Azure/azure-functions-core-tools#installing) installed. And then create an empty directory for the project. Run command under this working directory.

   # [JavaScript](#tab/javascript)

   ```bash
   func init --worker-runtime javascript
   ```

   # [C# in-process](#tab/csharp-in-process)

   ```bash
   func init --worker-runtime dotnet
   ```

   # [C# isolated process](#tab/csharp-isolated-process)

   ```bash
   func init --worker-runtime dotnet-isolated
   ```

2. Install `Microsoft.Azure.WebJobs.Extensions.WebPubSub`.

   # [JavaScript](#tab/javascript)

   Update `host.json`'s extensionBundle to version _3.3.0_ or later to get Web PubSub support.

   ```json
   {
     "version": "2.0",
     "extensionBundle": {
       "id": "Microsoft.Azure.Functions.ExtensionBundle",
       "version": "[3.3.*, 4.0.0)"
     }
   }
   ```

   # [C# in-process](#tab/csharp-in-process)

   ```bash
   dotnet add package Microsoft.Azure.WebJobs.Extensions.WebPubSub
   ```

   # [C# isolated process](#tab/csharp-isolated-process)

   ```bash
   dotnet add package Microsoft.Azure.Functions.Worker.Extensions.WebPubSub --prerelease
   ```

3. Create an `index` function to read and host a static web page for clients.

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
           "methods": ["get", "post"]
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
     var fs = require("fs");
     var path = require("path");

     module.exports = function (context, req) {
       var index =
         context.executionContext.functionDirectory + "/../index.html";
       context.log("index.html path: " + index);
       fs.readFile(index, "utf8", function (err, data) {
         if (err) {
           console.log(err);
           context.done(err);
         }
         context.res = {
           status: 200,
           headers: {
             "Content-Type": "text/html",
           },
           body: data,
         };
         context.done();
       });
     };
     ```

   # [C# in-process](#tab/csharp-in-process)

   - Update `index.cs` and replace `Run` function with following codes.
     ```c#
     [FunctionName("index")]
     public static IActionResult Run([HttpTrigger(AuthorizationLevel.Anonymous)] HttpRequest req, ExecutionContext context, ILogger log)
     {
         var indexFile = Path.Combine(context.FunctionAppDirectory, "index.html");
         log.LogInformation($"index.html path: {indexFile}.");
         return new ContentResult
         {
             Content = File.ReadAllText(indexFile),
             ContentType = "text/html",
         };
     }
     ```

   # [C# isolated process](#tab/csharp-isolated-process)

   - Update `index.cs` and replace `Run` function with following codes.

     ```c#
     [Function("index")]
     public HttpResponseData Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post")] HttpRequestData req, FunctionContext context)
     {
         var path = Path.Combine(context.FunctionDefinition.PathToAssembly, "../index.html");
         _logger.LogInformation($"index.html path: {path}.");

      var response = req.CreateResponse();
      response.WriteString(File.ReadAllText(path));
      response.Headers.Add("Content-Type", "text/html");
      return response;
     }
     ```

4. Create a `negotiate` function to help clients get service connection url with access token.

   ```bash
   func new -n negotiate -t HttpTrigger
   ```

   > [!NOTE]
   > In this sample, we use [Microsoft Entra ID](../app-service/configure-authentication-user-identities.md) user identity header `x-ms-client-principal-name` to retrieve `userId`. And this won't work in a local function. You can make it empty or change to other ways to get or generate `userId` when playing in local. For example, let client type a user name and pass it in query like `?user={$username}` when call `negotiate` function to get service connection url. And in the `negotiate` function, set `userId` with value `{query.user}`.

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
           "hub": "simplechat",
           "userId": "{headers.x-ms-client-principal-name}",
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

   # [C# in-process](#tab/csharp-in-process)

   - Update `negotiate.cs` and replace `Run` function with following codes.
     ```c#
     [FunctionName("negotiate")]
     public static WebPubSubConnection Run(
         [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)] HttpRequest req,
         [WebPubSubConnection(Hub = "simplechat", UserId = "{headers.x-ms-client-principal-name}")] WebPubSubConnection connection,
         ILogger log)
     {
         log.LogInformation("Connecting...");
         return connection;
     }
     ```
   - Add `using` statements in header to resolve required dependencies.
     ```c#
     using Microsoft.Azure.WebJobs.Extensions.WebPubSub;
     ```

   # [C# isolated process](#tab/csharp-isolated-process)

   - Update `negotiate.cs` and replace `Run` function with following codes.
     ```c#
     [Function("negotiate")]
     public HttpResponseData Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post")] HttpRequestData req,
         [WebPubSubConnectionInput(Hub = "simplechat", UserId = "{headers.x-ms-client-principal-name}")] WebPubSubConnection connectionInfo)
     {
         var response = req.CreateResponse(HttpStatusCode.OK);
         response.WriteAsJsonAsync(connectionInfo);
         return response;
     }
     ```

5. Create a `message` function to broadcast client messages through service.

   ```bash
   func new -n message -t HttpTrigger
   ```

   > [!NOTE]
   > This function is actually using `WebPubSubTrigger`. However, the `WebPubSubTrigger` is not integrated in function's template. We use `HttpTrigger` to initialize the function template and change trigger type in code.

   # [JavaScript](#tab/javascript)

   - Update `message/function.json` and copy following json codes.
     ```json
     {
       "bindings": [
         {
           "type": "webPubSubTrigger",
           "direction": "in",
           "name": "data",
           "hub": "simplechat",
           "eventName": "message",
           "eventType": "user"
         },
         {
           "type": "webPubSub",
           "name": "actions",
           "hub": "simplechat",
           "direction": "out"
         }
       ]
     }
     ```
   - Update `message/index.js` and copy following codes.
     ```js
     module.exports = async function (context, data) {
       context.bindings.actions = {
         actionName: "sendToAll",
         data: `[${context.bindingData.request.connectionContext.userId}] ${data}`,
         dataType: context.bindingData.dataType,
       };
       // UserEventResponse directly return to caller
       var response = {
         data: "[SYSTEM] ack.",
         dataType: "text",
       };
       return response;
     };
     ```

   # [C# in-process](#tab/csharp-in-process)

   - Update `message.cs` and replace `Run` function with following codes.
     ```c#
     [FunctionName("message")]
     public static async Task<UserEventResponse> Run(
         [WebPubSubTrigger("simplechat", WebPubSubEventType.User, "message")] UserEventRequest request,
         BinaryData data,
         WebPubSubDataType dataType,
         [WebPubSub(Hub = "simplechat")] IAsyncCollector<WebPubSubAction> actions)
     {
         await actions.AddAsync(WebPubSubAction.CreateSendToAllAction(
             BinaryData.FromString($"[{request.ConnectionContext.UserId}] {data.ToString()}"),
             dataType));
         return new UserEventResponse
         {
             Data = BinaryData.FromString("[SYSTEM] ack"),
             DataType = WebPubSubDataType.Text
         };
     }
     ```
   - Add `using` statements in header to resolve required dependencies.
     ```c#
     using System.Threading.Tasks;
     using Microsoft.Azure.WebJobs.Extensions.WebPubSub;
     using Microsoft.Azure.WebPubSub.Common;
     ```

   # [C# isolated process](#tab/csharp-isolated-process)

   - Update `message.cs` and replace `Run` function with following codes.
     ```c#
     [Function("message")]
     [WebPubSubOutput(Hub = "simplechat")]
     public SendToAllAction Run(
         [WebPubSubTrigger("simplechat", WebPubSubEventType.User, "message")] UserEventRequest request)
     {
         return new SendToAllAction
         {
             Data = BinaryData.FromString($"[{request.ConnectionContext.UserId}] {request.Data.ToString()}"),
             DataType = request.DataType
         };
     }
     ```

6. Add the client single page `index.html` in the project root folder and copy content.

   ```html
   <html>
     <body>
       <h1>Azure Web PubSub Serverless Chat App</h1>
       <div id="login"></div>
       <p></p>
       <input id="message" placeholder="Type to chat..." />
       <div id="messages"></div>
       <script>
         (async function () {
           let authenticated = window.location.href.includes(
             "?authenticated=true"
           );
           if (!authenticated) {
             // auth
             let login = document.querySelector("#login");
             let link = document.createElement("a");
             link.href = `${window.location.origin}/.auth/login/aad?post_login_redirect_url=/api/index?authenticated=true`;
             link.text = "login";
             login.appendChild(link);
           } else {
             // negotiate
             let messages = document.querySelector("#messages");
             let res = await fetch(`${window.location.origin}/api/negotiate`, {
               credentials: "include",
             });
             let url = await res.json();
             // connect
             let ws = new WebSocket(url.url);
             ws.onopen = () => console.log("connected");
             ws.onmessage = (event) => {
               let m = document.createElement("p");
               m.innerText = event.data;
               messages.appendChild(m);
             };
             let message = document.querySelector("#message");
             message.addEventListener("keypress", (e) => {
               if (e.charCode !== 13) return;
               ws.send(message.value);
               message.value = "";
             });
           }
         })();
       </script>
     </body>
   </html>
   ```

   # [JavaScript](#tab/javascript)

   # [C# in-process](#tab/csharp-in-process)

   Since C# project compiles files to a different output folder, you need to update your `*.csproj` to make the content page go with it.

   ```xml
   <ItemGroup>
       <None Update="index.html">
           <CopyToOutputDirectory>PreserveNewest</CopyToOutputDirectory>
       </None>
   </ItemGroup>
   ```

   # [C# isolated process](#tab/csharp-isolated-process)

   Since C# project compiles files to a different output folder, you need to update your `*.csproj` to make the content page go with it.

   ```xml
   <ItemGroup>
       <None Update="index.html">
           <CopyToOutputDirectory>PreserveNewest</CopyToOutputDirectory>
       </None>
   </ItemGroup>
   ```

## Create and Deploy the Azure Function App

Before you can deploy your function code to Azure, you need to create three resources:

- A resource group, which is a logical container for related resources.
- A storage account, which is used to maintain state and other information about your functions.
- A function app, which provides the environment for executing your function code. A function app maps to your local function project and lets you group functions as a logical unit for easier management, deployment and sharing of resources.

Use the following commands to create these items.

1. If you haven't done so already, sign in to Azure:

   ```azurecli
   az login
   ```

1. Create a resource group or you can skip by reusing the one of Azure Web PubSub service:

   ```azurecli
   az group create -n WebPubSubFunction -l <REGION>
   ```

1. Create a general-purpose storage account in your resource group and region:

   ```azurecli
   az storage account create -n <STORAGE_NAME> -l <REGION> -g WebPubSubFunction
   ```

1. Create the function app in Azure:

   # [JavaScript](#tab/javascript)

   ```azurecli
   az functionapp create --resource-group WebPubSubFunction --consumption-plan-location <REGION> --runtime node --runtime-version 14 --functions-version 4 --name <FUNCIONAPP_NAME> --storage-account <STORAGE_NAME>
   ```

   > [!NOTE]
   > Check [Azure Functions runtime versions documentation](../azure-functions/functions-versions.md#languages) to set `--runtime-version` parameter to supported value.

   # [C# in-process](#tab/csharp-in-process)

   ```azurecli
   az functionapp create --resource-group WebPubSubFunction --consumption-plan-location <REGION> --runtime dotnet --functions-version 4 --name <FUNCIONAPP_NAME> --storage-account <STORAGE_NAME>
   ```

   # [C# isolated process](#tab/csharp-isolated-process)

   ```azurecli
   az functionapp create --resource-group WebPubSubFunction --consumption-plan-location <REGION> --runtime dotnet-isolated --functions-version 4 --name <FUNCIONAPP_NAME> --storage-account <STORAGE_NAME>
   ```

1. Deploy the function project to Azure:

   After you have successfully created your function app in Azure, you're now ready to deploy your local functions project by using the [func azure functionapp publish](./../azure-functions/functions-run-local.md) command.

   ```bash
   func azure functionapp publish <FUNCIONAPP_NAME>
   ```

1. Configure the `WebPubSubConnectionString` for the function app:

   First, find your Web PubSub resource from **Azure Portal** and copy out the connection string under **Keys**. Then, navigate to Function App settings in **Azure Portal** -> **Settings** -> **Configuration**. And add a new item under **Application settings**, with name equals `WebPubSubConnectionString` and value is your Web PubSub resource connection string.

## Configure the Web PubSub service `Event Handler`

In this sample, we're using `WebPubSubTrigger` to listen to service upstream requests. So Web PubSub need to know the function's endpoint information in order to send target client requests. And Azure Function App requires a system key for security regarding extension-specific webhook methods. In the previous step after we deployed the Function App with `message` functions, we're able to get the system key.

Go to **Azure portal** -> Find your Function App resource -> **App keys** -> **System keys** -> **`webpubsub_extension`**. Copy out the value as `<APP_KEY>`.

:::image type="content" source="media/quickstart-serverless/func-keys.png" alt-text="Screenshot of get function system keys.":::

Set `Event Handler` in Azure Web PubSub service. Go to **Azure portal** -> Find your Web PubSub resource -> **Settings**. Add a new hub settings mapping to the one function in use. Replace the `<FUNCTIONAPP_NAME>` and `<APP_KEY>` to yours.

- Hub Name: `simplechat`
- URL Template: **https://<FUNCTIONAPP_NAME>.azurewebsites.net/runtime/webhooks/webpubsub?code=<APP_KEY>**
- User Event Pattern: \*
- System Events: -(No need to configure in this sample)

:::image type="content" source="media/quickstart-serverless/set-event-handler.png" alt-text="Screenshot of setting the event handler.":::

## Configure to enable client authentication

Go to **Azure portal** -> Find your Function App resource -> **Authentication**. Click **`Add identity provider`**. Set **App Service authentication settings** to **Allow unauthenticated access**, so your client index page can be visited by anonymous users before redirect to authenticate. Then **Save**.

Here we choose `Microsoft` as identify provider, which uses `x-ms-client-principal-name` as `userId` in the `negotiate` function. Besides, you can configure other identity providers following the links, and don't forget update the `userId` value in `negotiate` function accordingly.

- [Microsoft Entra ID](../app-service/configure-authentication-provider-aad.md)
- [Facebook](../app-service/configure-authentication-provider-facebook.md)
- [Google](../app-service/configure-authentication-provider-google.md)
- [Twitter](../app-service/configure-authentication-provider-twitter.md)

## Try the application

Now you're able to test your page from your function app: `https://<FUNCTIONAPP_NAME>.azurewebsites.net/api/index`. See snapshot.

1. Click `login` to auth yourself.
2. Type message in the input box to chat.

In the message function, we broadcast caller's message to all clients and return caller with message `[SYSTEM] ack`. So we can know in sample chat snapshot, first four messages are from current client and last two messages are from another client.

:::image type="content" source="media/quickstart-serverless/chat-sample.png" alt-text="Screenshot of chat sample.":::

## Clean up resources

If you're not going to continue to use this app, delete all resources created by this doc with the following steps so you don't incur any charges:

1. In the Azure portal, select **Resource groups** on the far left, and then select the resource group you created. You may use the search box to find the resource group by its name instead.

1. In the window that opens, select the resource group, and then select **Delete resource group**.

1. In the new window, type the name of the resource group to delete, and then select **Delete**.

## Next steps

In this quickstart, you learned how to run a serverless chat application. Now, you could start to build your own application.

> [!div class="nextstepaction"] 
> [Azure Web PubSub bindings for Azure Functions](./reference-functions-bindings.md)

> [!div class="nextstepaction"] 
> [Quick start: Create a simple chatroom with Azure Web PubSub](./tutorial-build-chat.md)

> [!div class="nextstepaction"] 
> [Explore more Azure Web PubSub samples](https://github.com/Azure/azure-webpubsub/tree/main/samples)

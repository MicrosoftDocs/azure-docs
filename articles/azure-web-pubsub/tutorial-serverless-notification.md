---
title: Tutorial - Create a serverless notification app using Azure Web PubSub service and Azure Functions
description: A tutorial to walk through how to use Azure Web PubSub service and Azure Functions to build a serverless notification application.
author: JialinXin
ms.author: jixin
ms.service: azure-web-pubsub
ms.topic: tutorial 
ms.date: 11/01/2021
---

# Tutorial: Create a serverless notification app with Azure Functions and Azure Web PubSub service

The Azure Web PubSub service helps you build real-time messaging web applications using WebSockets. Azure Functions is a serverless platform that lets you run your code without managing any infrastructure. In this tutorial, you learn how to use Azure Web PubSub service and Azure Functions to build a serverless application with real-time messaging under notification scenarios. 

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Build a serverless notification app
> * Work with Web PubSub function input and output bindings
> * Run the sample functions locally
> * Deploy the function to Azure Function App

## Prerequisites

# [JavaScript](#tab/javascript)

* A code editor, such as [Visual Studio Code](https://code.visualstudio.com/)

* [Node.js](https://nodejs.org/en/download/), version 10.x.
   > [!NOTE]
   > For more information about the supported versions of Node.js, see [Azure Functions runtime versions documentation](../azure-functions/functions-versions.md#languages).

* [Azure Functions Core Tools](https://github.com/Azure/azure-functions-core-tools#installing) (v3 or higher preferred) to run Azure Function apps locally and deploy to Azure.

* The [Azure CLI](/cli/azure) to manage Azure resources.

# [C#](#tab/csharp)

* A code editor, such as [Visual Studio Code](https://code.visualstudio.com/).

* [Azure Functions Core Tools](https://github.com/Azure/azure-functions-core-tools#installing) (v3 or higher preferred) to run Azure Function apps locally and deploy to Azure.

* The [Azure CLI](/cli/azure) to manage Azure resources.

---

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [create-instance-portal](includes/create-instance-portal.md)]

## Create and run the functions locally

1. Make sure you have [Azure Functions Core Tools](https://github.com/Azure/azure-functions-core-tools#installing) installed. And then create an empty directory for the project. Run command under this working directory.

    # [JavaScript](#tab/javascript)
    ```bash
    func init --worker-runtime javascript
    ```

    # [C#](#tab/csharp)
    ```bash
    func init --worker-runtime dotnet
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
    
    # [C#](#tab/csharp)
    ```bash
    dotnet add package Microsoft.Azure.WebJobs.Extensions.WebPubSub
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
        var path = require('path');

        module.exports = function (context, req) {
            var index = 'index.html';
            if (process.env["HOME"] != null)
            {
                index = path.join(process.env["HOME"], "site", "wwwroot", index);
            }
            context.log("index.html path: " + index);
            fs.readFile(index, 'utf8', function (err, data) {
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
        public static IActionResult Run([HttpTrigger(AuthorizationLevel.Anonymous)] HttpRequest req, ILogger log)
        {
            string indexFile = "index.html";
            if (Environment.GetEnvironmentVariable("HOME") != null)
            {
                indexFile = Path.Join(Environment.GetEnvironmentVariable("HOME"), "site", "wwwroot", indexFile);
            }
            log.LogInformation($"index.html path: {indexFile}.");
            return new ContentResult
            {
                Content = File.ReadAllText(indexFile),
                ContentType = "text/html",
            };
        }
        ```

4. Create a `negotiate` function to help clients get service connection url with access token.
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
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)] HttpRequest req,
            [WebPubSubConnection(Hub = "notification")] WebPubSubConnection connection,
            ILogger log)
        {
            log.LogInformation("Connecting...");

            return connection;
        }
        ```
   - Add below `using` statements in header to resolve required dependencies.
        ```c#
        using Microsoft.Azure.WebJobs.Extensions.WebPubSub;
        ```

5. Create a `notification` function to generate notifications with `TimerTrigger`.
   ```bash
    func new -n notification -t TimerTrigger
    ```
    # [JavaScript](#tab/javascript)
   - Update `notification/function.json` and copy following json codes.
        ```json
        {
            "bindings": [
                {
                "name": "myTimer",
                "type": "timerTrigger",
                "direction": "in",
                "schedule": "*/10 * * * * *"
                },
                {
                "type": "webPubSub",
                "name": "actions",
                "hub": "notification",
                "direction": "out"
                }
            ]
        }
        ```
   - Update `notification/index.js` and copy following codes.
        ```js
        module.exports = function (context, myTimer) {
            context.bindings.actions = {
                "actionName": "sendToAll",
                "data": `[DateTime: ${new Date()}] Temperature: ${getValue(22, 1)}\xB0C, Humidity: ${getValue(40, 2)}%`,
                "dataType": "text"
            }
            context.done();
        };

        function getValue(baseNum, floatNum) {
            return (baseNum + 2 * floatNum * (Math.random() - 0.5)).toFixed(3);
        }
        ```
   # [C#](#tab/csharp)
   - Update `notification.cs` and replace `Run` function with following codes.
        ```c#
        [FunctionName("notification")]
        public static async Task Run([TimerTrigger("*/10 * * * * *")]TimerInfo myTimer, ILogger log,
            [WebPubSub(Hub = "notification")] IAsyncCollector<WebPubSubAction> actions)
        {
            await actions.AddAsync(new SendToAllAction
            {
                Data = BinaryData.FromString($"[DateTime: {DateTime.Now}] Temperature: {GetValue(23, 1)}{'\xB0'}C, Humidity: {GetValue(40, 2)}%"),
                DataType = WebPubSubDataType.Text
            });
        }

        private static string GetValue(double baseNum, double floatNum)
        {
            var rng = new Random();
            var value = baseNum + floatNum * 2 * (rng.NextDouble() - 0.5);
            return value.ToString("0.000");
        }
        ``` 
   - Add below `using` statements in header to resolve required dependencies.
        ```c#
        using Microsoft.Azure.WebJobs.Extensions.WebPubSub;
        using Microsoft.Azure.WebPubSub.Common;
        ```

6. Add the client single page `index.html` in the project root folder and copy content as below.
    ```html
    <html>
        <body>
        <h1>Azure Web PubSub Notification</h1>
        <div id="messages"></div>
        <script>
            (async function () {
                let messages = document.querySelector('#messages');
                let res = await fetch(`${window.location.origin}/api/negotiate`);
                let url = await res.json();
                let ws = new WebSocket(url.url);
                ws.onopen = () => console.log('connected');

                ws.onmessage = event => {
                    let m = document.createElement('p');
                    m.innerText = event.data;
                    messages.appendChild(m);
                };
            })();
        </script>
        </body>
    </html>
    ```

    # [JavaScript](#tab/javascript)

    # [C#](#tab/csharp)
    Since C# project will compile files to a different output folder, you need to update your `*.csproj` to make the content page go with it.
    ```xml
    <ItemGroup>
        <None Update="index.html">
            <CopyToOutputDirectory>PreserveNewest</CopyToOutputDirectory>
        </None>
    </ItemGroup>
    ```

7. Configure and run the Azure Function app

    - In the browser, open the **Azure portal** and confirm the Web PubSub Service instance you deployed earlier was successfully created. Navigate to the instance.
    - Select **Keys** and copy out the connection string.

    :::image type="content" source="media/quickstart-serverless/copy-connection-string.png" alt-text="Screenshot of copying the Web PubSub connection string.":::

    Run command below in the function folder to set the service connection string. Replace `<connection-string>` with your value as needed.

    ```bash
    func settings add WebPubSubConnectionString "<connection-string>"
    ```

    > [!NOTE]
    > `TimerTrigger` used in the sample has dependency on Azure Storage, but you can use local storage emulator when the Function is running locally. If you got some error like `There was an error performing a read operation on the Blob Storage Secret Repository. Please ensure the 'AzureWebJobsStorage' connection string is valid.`, you'll need to download and enable [Storage Emulator](../storage/common/storage-use-emulator.md).

    Now you're able to run your local function by command below.

    ```bash
    func start
    ```

    And checking the running logs, you can visit your local host static page by visiting: `https://localhost:7071/api/index`.

## Deploy Function App to Azure

Before you can deploy your function code to Azure, you need to create 3 resources:
* A resource group, which is a logical container for related resources.
* A storage account, which is used to maintain state and other information about your functions.
* A function app, which provides the environment for executing your function code. A function app maps to your local function project and lets you group functions as a logical unit for easier management, deployment and sharing of resources.

Use the following commands to create these item. 

1. If you haven't done so already, sign in to Azure:

    ```azurecli
    az login
    ```

1. Create a resource group or you can skip by re-using the one of Azure Web PubSub service:

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
    az functionapp create --resource-group WebPubSubFunction --consumption-plan-location <REGION> --runtime node --runtime-version 14 --functions-version 3 --name <FUNCIONAPP_NAME> --storage-account <STORAGE_NAME>
    ```
    > [!NOTE]
    > If you're running the function version other than v3.0, please check [Azure Functions runtime versions documentation](../azure-functions/functions-versions.md#languages) to set `--runtime-version` parameter to supported value.

    # [C#](#tab/csharp)

    ```azurecli
    az functionapp create --resource-group WebPubSubFunction --consumption-plan-location <REGION> --runtime dotnet --functions-version 3 --name <FUNCIONAPP_NAME> --storage-account <STORAGE_NAME>
    ```

1. Deploy the function project to Azure:

    After you've successfully created your function app in Azure, you're now ready to deploy your local functions project by using the [func azure functionapp publish](../azure-functions/functions-run-local.md) command.

    ```bash
    func azure functionapp publish <FUNCIONAPP_NAME> --publish-local-settings
    ```

    > [!NOTE]
    > Here we are deploying local settings `local.settings.json` together with command parameter `--publish-local-settings`. If you're using Microsoft Azure Storage Emulator, you can type `no` to skip overwriting this value on Azure following the prompt message: `App setting AzureWebJobsStorage is different between azure and local.settings.json, Would you like to overwrite value in azure? [yes/no/show]`. Besides, you can update Function App settings in **Azure Portal** -> **Settings** -> **Configuration**.

1. Now you can check your site from Azure Function App by navigating to URL: `https://<FUNCIONAPP_NAME>.azurewebsites.net/api/index`.

## Clean up resources

If you're not going to continue to use this app, delete all resources created by this doc with the following steps so you don't incur any charges:

1. In the Azure portal, select **Resource groups** on the far left, and then select the resource group you created. You may use the search box to find the resource group by its name instead.

1. In the window that opens, select the resource group, and then select **Delete resource group**.

1. In the new window, type the name of the resource group to delete, and then select **Delete**.

## Next steps

In this quickstart, you learned how to run a serverless chat application. Now, you could start to build your own application. 

> [!div class="nextstepaction"]
> [Tutorial: Create a simple chatroom with Azure Web PubSub](./tutorial-build-chat.md)

> [!div class="nextstepaction"]
> [Azure Web PubSub bindings for Azure Functions](./reference-functions-bindings.md)

> [!div class="nextstepaction"]
> [Explore more Azure Web PubSub samples](https://github.com/Azure/azure-webpubsub/tree/main/samples)

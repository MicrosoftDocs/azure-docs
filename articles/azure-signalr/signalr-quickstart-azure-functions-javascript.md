---
title: Azure SignalR Service serverless quickstart - Javascript
description: A quickstart for using Azure SignalR Service and Azure Functions to create an App showing GitHub star count using JavaScript.
author: vicancy
ms.author: lianwei
ms.date: 12/15/2022
ms.topic: quickstart
ms.service: signalr
ms.devlang: javascript
ms.custom: devx-track-js, mode-api
---
# Quickstart: Create a serverless app with Azure Functions and SignalR Service using Javascript

 In this article, you'll use Azure SignalR Service, Azure Functions, and JavaScript to build a serverless application to broadcast messages to clients.

> [!NOTE]
> You can get all code used in the article from [GitHub](https://github.com/aspnet/AzureSignalR-samples/tree/main/samples/QuickStartServerless/javascript).

## Prerequisites

This quickstart can be run on macOS, Windows, or Linux.

| Prerequisite | Description |
| --- | --- |
| An Azure subscription |If you don't have a subscription, create an [Azure free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)|
| A code editor | You'll need a code editor such as [Visual Studio Code](https://code.visualstudio.com/). |
| [Azure Functions Core Tools](https://github.com/Azure/azure-functions-core-tools#installing)| Requires version 2.7.1505 or higher to run Python Azure Function apps locally.|
|[Node.js](https://nodejs.org/en/download/)| See supported node.js versions in the [Azure Functions JavaScript developer guide](../azure-functions/functions-reference-node.md#node-version).|
| [Azurite](../storage/common/storage-use-azurite.md)| SignalR binding needs Azure Storage.  You can use a local storage emulator when a function is running locally. |
| [Azure CLI](/cli/azure/install-azure-cli)| Optionally, you can use the Azure CLI to create an Azure SignalR Service instance. |

## Create an Azure SignalR Service instance

[!INCLUDE [Create instance](includes/signalr-quickstart-create-instance.md)]

## Setup function project

Make sure you have Azure Functions Core Tools installed.

1. Open a command line.
1. Create project directory and then change to it. 
1. Run the Azure Functions `func init` command to initialize a new project.

  ```bash
  # Initialize a function project
  func init --worker-runtime javascript
  ```
  
## Create the project functions

After you initialize a project, you need to create functions. This project requires three functions: 

- `index`: Hosts a web page for a client.
- `negotiate`: Allows a client to get an access token.
- `broadcast`: Uses a time trigger to periodically broadcast messages to all clients.

When you run the `func new` command from the root directory of the project, the Azure Functions Core Tools creates the function source files storing them in a folder with the function name.  You'll edit the files as necessary replacing the default code with the app code.

### Create the index function

1. Run the following command to create the `index` function.

  ```bash
  func new -n index -t HttpTrigger
  ```

1. Edit *index/function.json* and replace the contents with the following json code:

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

1. Edit *index/\__init\__.py* and replace the contents with the following code:

  ```javascript
  var fs = require('fs').promises

  module.exports = async function (context, req) {
      const path = context.executionContext.functionDirectory + '/../content/index.html'
      try {
          var data = await fs.readFile(path);
          context.res = {
              headers: {
                  'Content-Type': 'text/html'
              },
              body: data
          }
          context.done()
      } catch (err) {
          context.log.error(err);
          context.done(err);
      }
  }
  ```

### Create the negotiate function

1. Run the following command to create the `negotiate` function.

  ```bash
  func new -n negotiate -t HttpTrigger
  ```

1. Edit *negotiate/function.json* and replace the contents with the following json code:

  ```json
  {
    "disabled": false,
    "bindings": [
      {
        "authLevel": "anonymous",
        "type": "httpTrigger",
        "direction": "in",
        "methods": [
          "post"
        ],
        "name": "req",
        "route": "negotiate"
      },
      {
        "type": "http",
        "direction": "out",
        "name": "res"
      },
      {
        "type": "signalRConnectionInfo",
        "name": "connectionInfo",
        "hubName": "serverless",
        "connectionStringSetting": "AzureSignalRConnectionString",
        "direction": "in"
      }
    ]
  }
  ```

### Create a broadcast function.

1. Run the following command to create the `broadcast` function.

  ```bash
  func new -n broadcast -t TimerTrigger
  ```

1. Edit *broadcast/function.json* and replace the contents with the following code:


  ```json
  {
    "bindings": [
      {
        "name": "myTimer",
        "type": "timerTrigger",
        "direction": "in",
        "schedule": "*/5 * * * * *"
      },
      {
        "type": "signalR",
        "name": "signalRMessages",
        "hubName": "serverless",
        "connectionStringSetting": "AzureSignalRConnectionString",
        "direction": "out"
      }
    ]
  }
  ```

1. Edit *broadcast/index.js* and replace the contents with the following code:
  
  ```javascript
  var https = require('https');
  
  var etag = '';
  var star = 0;
  
  module.exports = function (context) {
      var req = https.request("https://api.github.com/repos/azure/azure-signalr", {
          method: 'GET',
          headers: {'User-Agent': 'serverless', 'If-None-Match': etag}
      }, res => {
          if (res.headers['etag']) {
              etag = res.headers['etag']
          }
  
          var body = "";
  
          res.on('data', data => {
              body += data;
          });
          res.on("end", () => {
              if (res.statusCode === 200) {
                  var jbody = JSON.parse(body);
                  star = jbody['stargazers_count'];
              }
              
              context.bindings.signalRMessages = [{
                  "target": "newMessage",
                  "arguments": [ `Current star count of https://github.com/Azure/azure-signalr is: ${star}` ]
              }]
              context.done();
          });
      }).on("error", (error) => {
          context.log(error);
          context.res = {
            status: 500,
            body: error
          };
          context.done();
      });
      req.end();
  }
  ```

### Create the index.html file

The client interface for this app is a web page. The `index` function reads HTML content from the *content/index.html* file.

1. Create a folder called `content` in your project root folder.
1. Create the file *content/index.html*.
1. Copy the following content to the *content/index.html* file and save it:


    ```html
    <html>

    <body>
      <h1>Azure SignalR Serverless Sample</h1>
      <div id="messages"></div>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/microsoft-signalr/3.1.7/signalr.min.js"></script>
      <script>
        let messages = document.querySelector('#messages');
        const apiBaseUrl = window.location.origin;
        const connection = new signalR.HubConnectionBuilder()
            .withUrl(apiBaseUrl + '/api')
            .configureLogging(signalR.LogLevel.Information)
            .build();
          connection.on('newMessage', (message) => {
            document.getElementById("messages").innerHTML = message;
          });

          connection.start()
            .catch(console.error);
      </script>
    </body>

    </html>
    ```


### Add the SignalR Service connection string to the function app settings
=======
1. Azure Functions requires a storage account to work. You can install and run the [Azure Storage Emulator](../storage/common/storage-use-azurite.md). **Or** you can update the setting to use your real storage account with the following command:
    ```bash
    func settings add AzureWebJobsStorage "<storage-connection-string>"
    ```

4. You're almost done now. The last step is to set a connection string of the SignalR Service to Azure Function settings.


The last step is to set the SignalR Service connection string in Azure Function app settings.

1. In the Azure portal, go to the SignalR instance you deployed earlier.
1. Select **Keys** to view the connection strings for the SignalR Service instance.

    :::image type="content" source="media/signalr-quickstart-azure-functions-javascript/signalr-quickstart-keys.png" alt-text="Screenshot of Azure SignalR service Keys page.":::

1. Copy the primary connection string, and execute the command:

  ```bash
  func settings add AzureSignalRConnectionString "<signalr-connection-string>"
  ```
  
### Run the Azure Function app locally


Start the Azurite storage emulator:

  ```bash
  azurite 
  ```

Run the Azure Function app in the local environment:

  ```bash
  func start
  ```

> [!NOTE]
> If you see an errors showing read errors on the blob storage, ensure the 'AzureWebJobsStorage' setting in the *local.settings.json* file is set to `UseDevelopmentStorage=true`.

After the Azure Function is running locally, go to `http://localhost:7071/api/index`. The page displays the current star count for the GitHub Azure/azure-signalr repository. When you star or unstar the repository in GitHub, you'll see the refreshed count every few seconds.

Having issues? Try the [troubleshooting guide](signalr-howto-troubleshoot-guide.md) or [let us know](https://aka.ms/asrs/qscsharp)

[!INCLUDE [Cleanup](includes/signalr-quickstart-cleanup.md)]

## Next steps

In this quickstart, you built and ran a real-time serverless application in localhost. Next, learn more about how to bi-directional communicating between clients and Azure Function with SignalR Service.

> [!div class="nextstepaction"]
> [SignalR Service bindings for Azure Functions](../azure-functions/functions-bindings-signalr-service.md)

> [!div class="nextstepaction"]
> [Bi-directional communicating in Serverless](https://github.com/aspnet/AzureSignalR-samples/tree/main/samples/BidirectionChat)

> [!div class="nextstepaction"]
> [Deploy Azure Functions with VS Code](/azure/developer/javascript/tutorial-vscode-serverless-node-01)

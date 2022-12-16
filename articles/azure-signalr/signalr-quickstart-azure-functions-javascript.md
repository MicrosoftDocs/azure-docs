---
title: Use JavaScript to create a chat room with Azure Functions and SignalR Service
description: A quickstart for using Azure SignalR Service and Azure Functions to create an App showing GitHub star count using JavaScript.
author: vicancy
ms.author: lianwei
ms.date: 12/15/2022
ms.topic: quickstart
ms.service: signalr
ms.devlang: javascript
ms.custom: devx-track-js, mode-api
---
# Quickstart: Use JavaScript to create an App showing GitHub star count with Azure Functions and SignalR Service

 In this article, you'll use Azure SignalR Service, Azure Functions, and JavaScript to build a serverless application to broadcast messages to clients.

> [!NOTE]
> You can get all code used in the article from [GitHub](https://github.com/aspnet/AzureSignalR-samples/tree/main/samples/QuickStartServerless/javascript).

## Prerequisites

- A code editor, such as [Visual Studio Code](https://code.visualstudio.com/).
- An Azure account with an active subscription. If you don't already have an Azure account, [create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).
- [Azure Functions Core Tools](https://github.com/Azure/azure-functions-core-tools#installing), version 2 or above. Used to run Azure Function apps locally.
- [Node.js](https://nodejs.org/en/download/), See supported node.js versions in the [Azure Functions JavaScript developer guide](../azure-functions/functions-reference-node#node-version).
- SignalR binding needs Azure Storage, but you can use a local storage emulator when a function is running locally. Install the open source storage emulator [Azurite](../storage/common/storage-use-azurite.md).

The examples should work with other versions of Node.js, for more information, see [Azure Functions runtime versions documentation](../azure-functions/functions-versions.md#languages).

This quickstart can be run on macOS, Windows, or Linux.

## Create an Azure SignalR Service instance

[!INCLUDE [Create instance](includes/signalr-quickstart-create-instance.md)]

## Setup function project

Make sure you have Azure Functions Core Tools installed.

1. Open a command line
1. Create an empty directory and then change to it. 
1. Run the Azure Functions `func init` command to initialize a new project:

  ```bash
  # Initialize a function project
  func init --worker-runtime javascript
  ```
  
## Create the functions

After you initialize a project, you need to create functions. In this sample, we need to create three functions: 

- `index`: hosts a web page for a client
- `negotiate`: allows client to get an access token
- `broadcast`: broadcasts messages to all clients. In the app, the time trigger broadcasts messages periodically

When you run the `func new` command from the root directory of the project, the Azure Functions Core Tools creates the function source files storing them in a folder with the function name.  You'll edit the files as necessary replacing the default code with the app code.

### Create the index function



1. Run the following command to create an `index` function.

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

1. Run the following command to create an `negotiate` function.

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

1. Run the following command to create an `broadcast` function.

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

1.  Edit *broadcast/index.js* and replace the contents with the following code:
  
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

The client interface for this app is a web page. The `index` function reads HTML content from the *content/index.html* file. 

1. Create a folder called `content` in your project root folder.
1. Create a new file *index.html* in the `content` folder.
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

The last step is to set the connection string of the SignalR Service in Azure Function settings.

1. In the Azure portal, find the SignalR instance you deployed earlier by typing its name in the **Search** box. Select the instance to open it.

  ![Search for the SignalR Service instance](media/signalr-quickstart-azure-functions-csharp/signalr-quickstart-search-instance.png)

1. Select **Keys** to view the connection strings for the SignalR Service instance.

  ![Screenshot that highlights the primary connection string.](media/signalr-quickstart-azure-functions-javascript/signalr-quickstart-keys.png)

1. Copy the primary connection string. And execute the command:

  ```bash
  func settings add AzureSignalRConnectionString "<signalr-connection-string>"
  ```
  
### Run the Azure Function app locally

Start the Azurite storage emulator:

  ```bash
  azurite 
  ```

Run the Azure Function in the local environment:

  ```bash
  func start
  ```

> [!NOTE]
> If you see an error like `There was an error performing a read operation on the Blob Storage Secret Repository`. Please ensure the 'AzureWebJobsStorage' setting in the *local.settings.json* file is set to `UseDevelopmentStorage=true`.

After the Azure Function is running locally, go to `http://localhost:7071/api/index`. The page shows the current star count for the GitHub Azure/azure-signalr repository. When you star or unstar the repository in GitHub, you'll see the refreshed count on the page every few seconds.

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

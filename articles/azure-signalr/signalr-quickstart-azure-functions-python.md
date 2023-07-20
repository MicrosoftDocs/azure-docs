---
title: Azure SignalR Service serverless quickstart - Python
description: A quickstart for using Azure SignalR Service and Azure Functions to create an App showing GitHub star count using Python.
author: vicancy
ms.author: lianwei
ms.date: 12/15/2022
ms.topic: quickstart
ms.service: signalr
ms.devlang: python
ms.custom: devx-track-python, mode-api
---
# Quickstart: Create a serverless app with Azure Functions and Azure SignalR Service in Python

Get started with Azure SignalR Service by using Azure Functions and Python to build a serverless application that broadcasts messages to clients. You'll run the function in the local environment, connecting to an Azure SignalR Service instance in the cloud. Completing this quickstart incurs a small cost of a few USD cents or less in your Azure Account.

> [!NOTE]
> You can get the code in this article from [GitHub](https://github.com/aspnet/AzureSignalR-samples/tree/main/samples/QuickStartServerless/python).

## Prerequisites

This quickstart can be run on macOS, Windows, or Linux.  You will need the following:

| Prerequisite | Description |
| --- | --- |
| An Azure subscription |If you don't have an Azure subscription, create an [Azure free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)|
| A code editor | You'll need a code editor such as [Visual Studio Code](https://code.visualstudio.com/). |
| [Azure Functions Core Tools](https://github.com/Azure/azure-functions-core-tools#installing)| Requires version 2.7.1505 or higher to run Python Azure Function apps locally.|
| [Python 3.6+](https://www.python.org/downloads/)| Azure Functions requires Python 3.6+. See [Supported Python versions](../azure-functions/functions-reference-python.md#python-version). |
| [Azurite](../storage/common/storage-use-azurite.md)| SignalR binding needs Azure Storage.  You can use a local storage emulator when a function is running locally. |
| [Azure CLI](/cli/azure/install-azure-cli)| Optionally, you can use the Azure CLI to create an Azure SignalR Service instance. |

## Create an Azure SignalR Service instance

[!INCLUDE [Create instance](includes/signalr-quickstart-create-instance.md)]

## Create the Azure Function project

Create a local Azure Function project.

1. From a command line, create a directory for your project.
1. Change to the project directory.
1. Use the Azure Functions `func init` command to initialize your function project.

  ```bash
  # Initialize a function project
  func init --worker-runtime python
  ```

## Create the functions

After you initialize a project, you need to create functions. This project requires three functions: 

- `index`: Hosts a web page for a client.
- `negotiate`: Allows a client to get an access token.
- `broadcast`: Uses a time trigger to periodically broadcast messages to all clients.

When you run the `func new` command from the root directory of the project, the Azure Functions Core Tools creates default function source files and stores them in a folder named after the function.  You'll edit the files as necessary replacing the default code with the app code.

### Create the index function

You can use this sample function as a template for your own functions.  

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
        "name": "$return"
      }
    ]
  }
  ```

1. Edit *index/\__init\__.py* and replace the contents with the following code:

  ```python
  import os

  import azure.functions as func
          
  def main(req: func.HttpRequest) -> func.HttpResponse:
      f = open(os.path.dirname(os.path.realpath(__file__)) + '/../content/index.html')
      return func.HttpResponse(f.read(), mimetype='text/html')
  ```

### Create the negotiate function

1. Run the following command to create the `negotiate` function.

  ```bash
  func new -n negotiate -t HttpTrigger
  ```

1. Edit *negotiate/function.json* and replace the contents with the following json code:

  ```json
  {
    "scriptFile": "__init__.py",
    "bindings": [
      {
        "authLevel": "anonymous",
        "type": "httpTrigger",
        "direction": "in",
        "name": "req",
        "methods": [
          "post"
        ]
      },
      {
        "type": "http",
        "direction": "out",
        "name": "$return"
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

1. Edit *negotiate/\__init\__.py* and replace the contents with the following code:

  ```python
  import azure.functions as func

  
  def main(req: func.HttpRequest, connectionInfo) -> func.HttpResponse:
      return func.HttpResponse(connectionInfo)
  ```

### Create a broadcast function.

1. Run the following command to create the `broadcast` function.

  ```bash
  func new -n broadcast -t TimerTrigger
  # install requests
  pip install requests
  ```

1. Edit *broadcast/function.json* and replace the contents with the following code:

  ```json
  {
    "scriptFile": "__init__.py",
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

1. Edit *broadcast/\__init\__.py* and replace the contents with the following code:

  ```python
  import requests
  import json
  
  import azure.functions as func
  
  etag = ''
  start_count = 0
  
  def main(myTimer: func.TimerRequest, signalRMessages: func.Out[str]) -> None:
      global etag
      global start_count
      headers = {'User-Agent': 'serverless', 'If-None-Match': etag}
      res = requests.get('https://api.github.com/repos/azure/azure-signalr', headers=headers)
      if res.headers.get('ETag'):
          etag = res.headers.get('ETag')
  
      if res.status_code == 200:
          jres = res.json()
          start_count = jres['stargazers_count']
      
      signalRMessages.set(json.dumps({
          'target': 'newMessage',
          'arguments': [ 'Current star count of https://github.com/Azure/azure-signalr is: ' + str(start_count) ]
      }))
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

[!INCLUDE [Cleanup](includes/signalr-quickstart-cleanup.md)]

Having issues? Try the [troubleshooting guide](signalr-howto-troubleshoot-guide.md) or [let us know](https://aka.ms/asrs/qspython).

## Next steps

In this quickstart, you built and ran a real-time serverless application in local. Next, learn more about how to use bi-directional communicating between clients and Azure Function with SignalR Service.

> [!div class="nextstepaction"]
> [SignalR Service bindings for Azure Functions](../azure-functions/functions-bindings-signalr-service.md)

> [!div class="nextstepaction"]
> [Bi-directional communicating in Serverless](https://github.com/aspnet/AzureSignalR-samples/tree/main/samples/BidirectionChat)

> [!div class="nextstepaction"]
> [Deploy Azure Functions with VS Code](/azure/developer/javascript/tutorial-vscode-serverless-node-01)

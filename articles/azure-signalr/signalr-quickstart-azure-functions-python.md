---
title: Azure SignalR Service serverless quickstart - Python
description: A quickstart for using Azure SignalR Service and Azure Functions to create an App showing GitHub star count using Python.
author: vicancy
ms.author: lianwei
ms.date: 04/19/2022
ms.topic: quickstart
ms.service: signalr
ms.devlang: python
ms.custom: devx-track-python, mode-api
---
# Quickstart: Create a serverless app with Azure Functions, SignalR Service, and Python

Get started with Azure SignalR Service by using Azure Functions and Python to build a serverless application that broadcasts messages to clients. You'll run the function in the local environment, connecting to an Azure SignalR Service instance in the cloud. Completing this quickstart incurs a small cost of a few USD cents or less in your Azure Account.

> [!NOTE]
> You can get the code in this article from [GitHub](https://github.com/aspnet/AzureSignalR-samples/tree/main/samples/QuickStartServerless/python).

## Prerequisites

This quickstart can be run on macOS, Windows, or Linux.

- You'll need a code editor such as [Visual Studio Code](https://code.visualstudio.com/).

- Install the [Azure Functions Core Tools](https://github.com/Azure/azure-functions-core-tools#installing) (version 2.7.1505 or higher) to run Python Azure Function apps locally.

- Azure Functions requires [Python 3.6+](https://www.python.org/downloads/). (See [Supported Python versions](../azure-functions/functions-reference-python.md#python-version).)

- SignalR binding needs Azure Storage, but you can use a local storage emulator when a function is running locally. You'll need to download and enable [Storage Emulator](../storage/common/storage-use-emulator.md).

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Create an Azure SignalR Service instance

[!INCLUDE [Create instance](includes/signalr-quickstart-create-instance.md)]

## Setup and run the Azure Function locally

1. Create an empty directory and go to the directory with command line.

    ```bash
    # Initialize a function project
    func init --worker-runtime python
    ```

2. After you initialize a project, you need to create functions. In this sample, we need to create three functions: `index`, `negotiate`, and `broadcast`.

    1. Run the following command to create an `index` function, which will host a web page for a client.

        ```bash
        func new -n index -t HttpTrigger
        ```

        Open *index/function.json* and copy the following json code:

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

        Open *index/\__init\__.py* and copy the following code:

        ```javascript
        import os
    
        import azure.functions as func
                
        def main(req: func.HttpRequest) -> func.HttpResponse:
            f = open(os.path.dirname(os.path.realpath(__file__)) + '/../content/index.html')
            return func.HttpResponse(f.read(), mimetype='text/html')
        ```

    2. Create a `negotiate` function for clients to get access token.

        ```bash
        func new -n negotiate -t HttpTrigger
        ```

        Open *negotiate/function.json* and copy the following json code:

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

        Open *negotiate/\__init\__.py* and copy the following code:

        ```python
        import azure.functions as func
    
        
        def main(req: func.HttpRequest, connectionInfo) -> func.HttpResponse:
            return func.HttpResponse(connectionInfo)
        ```

    3. Create a `broadcast` function to broadcast messages to all clients. In the sample, we use time trigger to broadcast messages periodically.
    
        ```bash
        func new -n broadcast -t TimerTrigger
        # install requests
        pip install requests
        ```

        Open *broadcast/function.json* and copy the following code:

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
    
        Open *broadcast/\__init\__.py* and copy the following code:
    
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

3. The client interface of this sample is a web page. We read HTML content from *content/index.html* in the `index` function, and then create a new file *index.html* in the `content` directory under your project root folder. Copy the following content:

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

4. We're almost done now. The last step is to set a connection string of the SignalR Service to Azure Function settings.

    1. In the Azure portal, search for the SignalR Service instance you deployed earlier. Select the instance to open it.

        ![Search for the SignalR Service instance](media/signalr-quickstart-azure-functions-csharp/signalr-quickstart-search-instance.png)

    2. Select **Keys** to view the connection strings for the SignalR Service instance.

        ![Screenshot that highlights the primary connection string.](media/signalr-quickstart-azure-functions-javascript/signalr-quickstart-keys.png)

    3. Copy the primary connection string, and then run the following command:

        ```bash
        func settings add AzureSignalRConnectionString "<signalr-connection-string>"
        ```

5. Run the Azure Function in the local environment:

    ```bash
    func start
    ```

    After the Azure Function is running locally, go to `http://localhost:7071/api/index` and you'll see the current star count. If you star or unstar in GitHub, you'll get a refreshed star count every few seconds.

    > [!NOTE]
    > SignalR binding needs Azure Storage, but you can use a local storage emulator when the function is running locally.
    > You need to download and enable [Storage Emulator](../storage/common/storage-use-emulator.md) if you got an error like `There was an error performing a read operation on the Blob Storage Secret Repository. Please ensure the 'AzureWebJobsStorage' connection string is valid.`

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

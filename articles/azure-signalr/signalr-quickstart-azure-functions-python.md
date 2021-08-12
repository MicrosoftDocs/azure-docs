---
title: Azure SignalR Service serverless quickstart - Python
description: A quickstart for using Azure SignalR Service and Azure Functions to create an App showing GitHub star count using Python.
author: anthonychu
ms.author: antchu
ms.date: 06/09/2021
ms.topic: quickstart
ms.service: signalr
ms.devlang: python
ms.custom:
  - devx-track-python
  - mode-api
---
# Quickstart: Create an App showing GitHub star count with Azure Functions and SignalR Service using Python

Azure SignalR Service lets you easily add real-time functionality to your application. Azure Functions is a serverless platform that lets you run your code without managing any infrastructure. In this quickstart, learn how to use SignalR Service and Azure Functions to build a serverless application with Python to broadcast messages to clients.

> [!NOTE]
> You can get all codes mentioned in the article from [GitHub](https://github.com/aspnet/AzureSignalR-samples/tree/main/samples/QuickStartServerless/python)

## Prerequisites

This quickstart can be run on macOS, Windows, or Linux.

Make sure you have a code editor such as [Visual Studio Code](https://code.visualstudio.com/) installed.

Install the [Azure Functions Core Tools](https://github.com/Azure/azure-functions-core-tools#installing) (version 2.7.1505 or higher) to run Python Azure Function apps locally.

Azure Functions requires [Python 3.6+](https://www.python.org/downloads/). (See [Supported Python versions](../azure-functions/functions-reference-python.md#python-version))

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

Having issues? Try the [troubleshooting guide](signalr-howto-troubleshoot-guide.md) or [let us know](https://aka.ms/asrs/qspython).

## Log in to Azure

Sign in to the Azure portal at <https://portal.azure.com/> with your Azure account.

Having issues? Try the [troubleshooting guide](signalr-howto-troubleshoot-guide.md) or [let us know](https://aka.ms/asrs/qspython).

[!INCLUDE [Create instance](includes/signalr-quickstart-create-instance.md)]

Having issues? Try the [troubleshooting guide](signalr-howto-troubleshoot-guide.md) or [let us know](https://aka.ms/asrs/qspython).


## Setup and run the Azure Function locally

1. Make sure you have Azure Function Core Tools installed. And create an empty directory and navigate to the directory with command line.

    ```bash
    # Initialize a function project
    func init --worker-runtime python
    ```

2. After you initialize a project, you need to create functions. In this sample, we need to create 3 functions.

    1. Run the following command to create a `index` function, which will host a web page for client.

        ```bash
        func new -n index -t HttpTrigger
        ```
        
        Open `index/__init__.py` and copy the following codes.

        ```javascript
        import os
    
        import azure.functions as func
        
        
        def main(req: func.HttpRequest) -> func.HttpResponse:
            f = open(os.path.dirname(os.path.realpath(__file__)) + '/../content/index.html')
            return func.HttpResponse(f.read(), mimetype='text/html')
        ```
    
    2. Create a `negotiate` function for clients to get access token.
    
        ```bash
        func new -n negotiate -t SignalRNegotiateHTTPTrigger
        ```
        
        Open `negotiate/function.json` and copy the following json codes:
    
        ```json
        {
          "scriptFile": "__init__.py",
          "bindings": [
            {
              "authLevel": "function",
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

        And open the `negotiate/__init__.py` and copy the following codes:

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
    
        Open `broadcast/function.json` and copy the following codes.
    
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
    
        Open `broadcast/__init__.py` and copy the following codes.
    
        ```python
        import requests
        import json
        
        import azure.functions as func
        
        
        def main(myTimer: func.TimerRequest, signalRMessages: func.Out[str]) -> None:
            headers = {'User-Agent': 'serverless'}
            res = requests.get('https://api.github.com/repos/azure/azure-signalr', headers=headers)
            jres = res.json()
        
            signalRMessages.set(json.dumps({
                'target': 'newMessage',
                'arguments': [ 'Current star count of https://github.com/Azure/azure-signalr is: ' + str(jres['stargazers_count']) ]
            }))
        ```

3. The client interface of this sample is a web page. Considered we read HTML content from `content/index.html` in `index` function, create a new file `index.html` in `content` directory. And copy the following content.

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
    
4. It's almost done now. The last step is to set a connection string of the SignalR Service to Azure Function settings.

    1. In the browser where the Azure portal is opened, confirm the SignalR Service instance you deployed earlier was successfully created by searching for its name in the search box at the top of the portal. Select the instance to open it.

        ![Search for the SignalR Service instance](media/signalr-quickstart-azure-functions-csharp/signalr-quickstart-search-instance.png)

    1. Select **Keys** to view the connection strings for the SignalR Service instance.
    
        ![Screenshot that highlights the primary connection string.](media/signalr-quickstart-azure-functions-javascript/signalr-quickstart-keys.png)

    1. Copy the primary connection string. And execute the command below.
    
        ```bash
        func settings add AzureSignalRConnectionString '<signalr-connection-string>'
        ```
    
5. Run the Azure Function in local:

    ```bash
    func start
    ```

    After Azure Function running locally. Use your browser to visit `http://localhost:7071/api/index` and you can see the current start count. And if you star or unstar in the GitHub, you will get a start count refreshing every few seconds.

    > [!NOTE]
    > SignalR binding needs Azure Storage, but you can use local storage emulator when the Function is running locally.
    > If you got some error like `There was an error performing a read operation on the Blob Storage Secret Repository. Please ensure the 'AzureWebJobsStorage' connection string is valid.` You need to download and enable [Storage Emulator](../storage/common/storage-use-emulator.md)

[!INCLUDE [Cleanup](includes/signalr-quickstart-cleanup.md)]

Having issues? Try the [troubleshooting guide](signalr-howto-troubleshoot-guide.md) or [let us know](https://aka.ms/asrs/qspython).

## Next steps

In this quickstart, you built and ran a real-time serverless application in local. Learn more how to use SignalR Service bindings for Azure Functions.
Next, learn more about how to bi-directional communicating between clients and Azure Function with SignalR Service.

> [!div class="nextstepaction"]
> [SignalR Service bindings for Azure Functions](../azure-functions/functions-bindings-signalr-service.md)

> [!div class="nextstepaction"]
> [Bi-directional communicating in Serverless](https://github.com/aspnet/AzureSignalR-samples/tree/main/samples/BidirectionChat)

> [!div class="nextstepaction"]
> [Deploy Azure Functions with VS Code](/azure/developer/javascript/tutorial-vscode-serverless-node-01)
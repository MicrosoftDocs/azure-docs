---
title: Azure SignalR Service serverless quickstart - C#
description: A quickstart for using Azure SignalR Service and Azure Functions to create an App showing GitHub star count using C#.
author: sffamily
ms.service: signalr
ms.devlang: dotnet
ms.topic: quickstart
ms.custom: devx-track-csharp
ms.date: 06/09/2021
ms.author: zhshang
---

# Quickstart: Create an App showing GitHub star count with Azure Functions and SignalR Service using C\#

Azure SignalR Service lets you easily add real-time functionality to your application. Azure Functions is a serverless platform that lets you run your code without managing any infrastructure. In this quickstart, learn how to use SignalR Service and Azure Functions to build a serverless application with C# to broadcast messages to clients.

> [!NOTE]
> You can get all codes mentioned in the article from [GitHub](https://github.com/aspnet/AzureSignalR-samples/tree/main/samples/QuickStartServerless/csharp)

## Prerequisites

If you don't already have Visual Studio Code installed, you can download and use it for free(https://code.visualstudio.com/Download).

You may also run this tutorial on the command line (macOS, Windows, or Linux) using the [Azure Functions Core Tools)](../azure-functions/functions-run-local.md?tabs=windows%2Ccsharp%2Cbash#v2). Also the [.NET Core SDK](https://dotnet.microsoft.com/download), and your favorite code editor.

If you don't have an Azure subscription, [create one for free](https://azure.microsoft.com/free/dotnet) before you begin.

Having issues? Try the [troubleshooting guide](signalr-howto-troubleshoot-guide.md) or [let us know](https://aka.ms/asrs/qscsharp).

## Log in to Azure and create SignalR Service instance

Sign in to the Azure portal at <https://portal.azure.com/> with your Azure account.

Having issues? Try the [troubleshooting guide](signalr-howto-troubleshoot-guide.md) or [let us know](https://aka.ms/asrs/qscsharp).

[!INCLUDE [Create instance](includes/signalr-quickstart-create-instance.md)]

Having issues? Try the [troubleshooting guide](signalr-howto-troubleshoot-guide.md) or [let us know](https://aka.ms/asrs/qscsharp).

## Setup and run the Azure Function locally

1. Make sure you have Azure Function Core Tools installed. And create an empty directory and navigate to the directory with command line.

    ```bash
    # Initialize a function project
    func init --worker-runtime dotnet
    
    # Add SignalR Service package reference to the project
    dotnet add package Microsoft.Azure.WebJobs.Extensions.SignalRService
    ```

2. After you initialize a project. Create a new file with name *Function.cs*. Add the following code to *Function.cs*.
   
    ```csharp
    using System;
    using System.IO;
    using System.Net.Http;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Azure.WebJobs;
    using Microsoft.Azure.WebJobs.Extensions.Http;
    using Microsoft.Azure.WebJobs.Extensions.SignalRService;
    using Newtonsoft.Json;
    
    namespace CSharp
    {
        public static class Function
        {
            private static HttpClient httpClient = new HttpClient();
    
            [FunctionName("index")]
            public static IActionResult Index([HttpTrigger(AuthorizationLevel.Anonymous)]HttpRequest req, ExecutionContext context)
            {
                var path = Path.Combine(context.FunctionAppDirectory, "content", "index.html");
                return new ContentResult
                {
                    Content = File.ReadAllText(path),
                    ContentType = "text/html",
                };
            }
    
            [FunctionName("negotiate")]
            public static SignalRConnectionInfo Negotiate( 
                [HttpTrigger(AuthorizationLevel.Anonymous)] HttpRequest req,
                [SignalRConnectionInfo(HubName = "serverlessSample")] SignalRConnectionInfo connectionInfo)
            {
                return connectionInfo;
            }
    
            [FunctionName("broadcast")]
            public static async Task Broadcast([TimerTrigger("*/5 * * * * *")] TimerInfo myTimer,
            [SignalR(HubName = "serverlessSample")] IAsyncCollector<SignalRMessage> signalRMessages)
            {
                var request = new HttpRequestMessage(HttpMethod.Get, "https://api.github.com/repos/azure/azure-signalr");
                request.Headers.UserAgent.ParseAdd("Serverless");
                var response = await httpClient.SendAsync(request);
                var result = JsonConvert.DeserializeObject<GitResult>(await response.Content.ReadAsStringAsync());
                await signalRMessages.AddAsync(
                    new SignalRMessage
                    {
                        Target = "newMessage",
                        Arguments = new[] { $"Current start count of https://github.com/Azure/azure-signalr is: {result.StartCount}" }
                    });
            }
    
            private class GitResult
            {
                [JsonRequired]
                [JsonProperty("stargazers_count")]
                public string StartCount { get; set; }
            }
        }
    }
    ```
    These codes have three functions. The `Index` is used to get a website as client. The `Negotiate` is used for client to get access token. The `Broadcast` is periodically
    get start count from GitHub and broadcast messages to all clients.

3. The client interface of this sample is a web page. Considered we read HTML content from `content/index.html` in `GetHomePage` function, create a new file `index.html` in `content` directory. And copy the following content.
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

Having issues? Try the [troubleshooting guide](signalr-howto-troubleshoot-guide.md) or [let us know](https://aka.ms/asrs/qscsharp)

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
> [Develop Azure Functions using Visual Studio](../azure-functions/functions-develop-vs.md)


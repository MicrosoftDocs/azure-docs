---
title: Azure SignalR Service Serverless Quickstart - C# | Microsoft Docs
description: A quickstart for using Azure SignalR Service and Azure Functions to create a chat room.
services: signalr
documentationcenter: ''
author: sffamily
manager: cfowler
editor: 

ms.assetid: 
ms.service: signalr
ms.devlang: dotnet
ms.topic: quickstart
ms.tgt_pltfrm: Azure Functions
ms.workload: tbd
ms.date: 09/23/2018
ms.author: zhshang
---

# Quickstart: Create a chat room with Azure Functions and SignalR Service using C#

Azure SignalR Service lets you easily add real-time functionality to your application. Azure Functions is a serverless platform that lets you run your code without managing any infrastructure. In this quickstart, learn how to use SignalR Service and Functions to build a serverless, real-time chat application.


## Prerequisites

If you don’t already have Visual Studio 2017 installed, you can download and use the **free** [Visual Studio 2017 Community Edition](https://www.visualstudio.com/downloads/). Make sure that you enable **Azure development** during the Visual Studio setup.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]


## Log in to Azure

Sign in to the Azure portal at <https://portal.azure.com/> with your Azure account.


[!INCLUDE [Create instance](includes/signalr-quickstart-create-instance.md)]

[!INCLUDE [Clone application](includes/signalr-quickstart-clone-application.md)]


## Configure and run the Azure Function app

1. Start Visual Studio and open the solution in the *chat\src\csharp* folder of the cloned repository.

1. In the browser where the Azure portal is opened, confirm the SignalR Service instance you deployed earlier was successfully created by searching for its name in the search box at the top of the portal. Select the instance to open it.

    ![Search for the SignalR Service instance](media/signalr-quickstart-azure-functions-csharp/signalr-quickstart-search-instance.png)

1. Select **Keys** to view the connection strings for the SignalR Service instance.

1. Select and copy the primary connection string.

1. Back in Visual Studio, in Solution Explorer, rename *local.settings.sample.json* to *local.settings.json*.

1. In **local.settings.json**, paste the connection string into the value of the **AzureSignalRConnectionString** setting. Save the file.

1. Open **Functions.cs**. There are two HTTP triggered functions in this function app:

    - **GetSignalRInfo** - Uses the *SignalRConnectionInfo* input binding to generate and return valid connection information.
    - **SendMessage** - Receives a chat message in the request body and uses the *SignalR* output binding to broadcast the message to all connected client applications.

1. In the **Debug** menu, select **Start debugging** to run the application.

    ![Debug the application](media/signalr-quickstart-azure-functions-csharp/signalr-quickstart-debug-vs.png)


[!INCLUDE [Run web application](includes/signalr-quickstart-run-web-application.md)]


[!INCLUDE [Cleanup](includes/signalr-quickstart-cleanup.md)]

## Next steps

In this quickstart, you built and ran an real-time serverless application in VS Code. Next, learn more about how to deploy Azure Functions from VS Code.

> [!div class="nextstepaction"]
> [Deploy Azure Functions with VS Code](https://code.visualstudio.com/tutorials/functions-extension/getting-started)
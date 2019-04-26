---
title: Azure SignalR Service serverless quickstart - Java
description: A quickstart for using Azure SignalR Service and Azure Functions to create a chat room.
author: sffamily
ms.service: signalr
ms.devlang: java
ms.topic: quickstart
ms.date: 03/04/2019
ms.author: zhshang
---

# Quickstart: Create a chat room with Azure Functions and SignalR Service using Java

Azure SignalR Service lets you easily add real-time functionality to your application. Azure Functions is a serverless platform that lets you run your code without managing any infrastructure. In this quickstart, learn how to use SignalR Service and Functions to build a serverless, real-time chat application.

## Prerequisites

This quickstart can be run on macOS, Windows, or Linux.

Make sure you have a code editor such as [Visual Studio Code](https://code.visualstudio.com/) installed.

Install the [Azure Functions Core Tools (v2)](https://github.com/Azure/azure-functions-core-tools#installing) to run Azure Function apps locally.

> [!NOTE]
> To use the SignalR Service bindings in Java, make sure you are using version 2.4.419 or higher of the Azure Functions Core Tools (host version 2.0.12332).

In order to install extensions, Azure Functions Core Tools currently require the [.NET Core SDK](https://www.microsoft.com/net/download) installed. However, no knowledge of .NET is required to build JavaScript Azure Function apps.

To develop functions app with Java, you must have the following installed:

* [Java Developer Kit](https://www.azul.com/downloads/zulu/), version 8.
* [Apache Maven](https://maven.apache.org), version 3.0 or above.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Log in to Azure

Sign in to the Azure portal at <https://portal.azure.com/> with your Azure account.

[!INCLUDE [Create instance](includes/signalr-quickstart-create-instance.md)]

[!INCLUDE [Clone application](includes/signalr-quickstart-clone-application.md)]

## Configure and run the Azure Function app

1. In the browser where the Azure portal is opened, confirm the SignalR Service instance you deployed earlier was successfully created by searching for its name in the search box at the top of the portal. Select the instance to open it.

    ![Search for the SignalR Service instance](media/signalr-quickstart-azure-functions-csharp/signalr-quickstart-search-instance.png)

1. Select **Keys** to view the connection strings for the SignalR Service instance.

1. Select and copy the primary connection string.

    ![Create SignalR Service](media/signalr-quickstart-azure-functions-javascript/signalr-quickstart-keys.png)

1. In your code editor, open the *src/chat/java* folder in the cloned repository.

1. Rename *local.settings.sample.json* to *local.settings.json*.

1. In **local.settings.json**, paste the connection string into the value of the **AzureSignalRConnectionString** setting. Save the file.

1. The main file that contains the functions are in *src/chat/java/src/main/java/com/function/Functions.java*:

    - **negotiate** - Uses the *SignalRConnectionInfo* input binding to generate and return valid connection information.
    - **sendMessage** - Receives a chat message in the request body and uses the *SignalR* output binding to broadcast the message to all connected client applications.

1. In the terminal, ensure that you are in the *src/chat/java* folder. Build the function app.

    ```bash
    mvn clean package
    ```

1. Run the function app locally.

    ```bash
    mvn azure-functions:run
    ```

[!INCLUDE [Run web application](includes/signalr-quickstart-run-web-application.md)]

[!INCLUDE [Cleanup](includes/signalr-quickstart-cleanup.md)]

## Next steps

In this quickstart, you built and ran a real-time serverless application using Maven. Next, learn about how to create Java Azure Functions from scratch.

> [!div class="nextstepaction"]
> [Create your first function with Java and Maven](../azure-functions/functions-create-first-java-maven.md)
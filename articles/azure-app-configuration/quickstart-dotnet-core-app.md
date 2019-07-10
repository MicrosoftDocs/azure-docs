---
title: Quickstart for Azure App Configuration with .NET Core | Microsoft Docs
description: A quickstart for using Azure App Configuration with .NET Core apps
services: azure-app-configuration
documentationcenter: ''
author: yegu-ms
manager: balans
editor: ''

ms.assetid: 
ms.service: azure-app-configuration
ms.devlang: csharp
ms.topic: quickstart
ms.tgt_pltfrm: .NET Core
ms.workload: tbd
ms.date: 02/24/2019
ms.author: yegu

#Customer intent: As a .NET Core developer, I want to manage all my app settings in one place.
---
# Quickstart: Create a .NET Core app with App Configuration

Azure App Configuration is a managed configuration service in Azure. You can use it to easily store and manage all your application settings in one place that's separated from your code. This quickstart shows you how to incorporate the service into a .NET Core console app.

You can use any code editor to do the steps in this quickstart. [Visual Studio Code](https://code.visualstudio.com/) is an excellent option available on the Windows, macOS, and Linux platforms.

![Quickstart app run](./media/quickstarts/dotnet-core-app-run.png)

## Prerequisites

To do this quickstart, install the [.NET Core SDK](https://dotnet.microsoft.com/download).

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Create an app configuration store

[!INCLUDE [azure-app-configuration-create](../../includes/azure-app-configuration-create.md)]

6. Select **Configuration Explorer** > **+ Create** to add the following key-value pairs:

    | Key | Value |
    |---|---|
    | TestApp:Settings:Message | Data from Azure App Configuration |

    Leave **Label** and **Content Type** empty for now.

## Create a .NET Core console app

You use the [.NET Core command-line interface (CLI)](https://docs.microsoft.com/dotnet/core/tools/) to create a new .NET Core console app project. The advantage of using the .NET Core CLI over Visual Studio is that it's available across the Windows, macOS, and Linux platforms.

1. Create a new folder for your project.

2. In the new folder, run the following command to create a new ASP.NET Core console app project:

        dotnet new console

## Connect to an app configuration store

1. Add a reference to the `Microsoft.Azure.AppConfiguration.AspNetCore` NuGet package by running the following command:

        dotnet add package Microsoft.Azure.AppConfiguration.AspNetCore --version 2.0.0-preview-009200001-7

2. Run the following command to restore packages for your project:

        dotnet restore

3. Open *Program.cs*, and add a reference to the .NET Core App Configuration provider.

    ```csharp
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.Configuration.AzureAppConfiguration;
    ```

4. Update the `Main` method to use App Configuration by calling the `builder.AddAzureAppConfiguration()` method.

    ```csharp
    static void Main(string[] args)
    {
        var builder = new ConfigurationBuilder();
        builder.AddAzureAppConfiguration(Environment.GetEnvironmentVariable("ConnectionString"));

        var config = builder.Build();
        Console.WriteLine(config["TestApp:Settings:Message"] ?? "Hello world!");
    }
    ```

## Build and run the app locally

1. Set an environment variable named **ConnectionString**, and set it to the access key to your app configuration store. If you use the Windows command prompt, run the following command and restart the command prompt to allow the change to take effect:

        setx ConnectionString "connection-string-of-your-app-configuration-store"

    If you use Windows PowerShell, run the following command:

        $Env:ConnectionString = "connection-string-of-your-app-configuration-store"

    If you use macOS or Linux, run the following command:

        export ConnectionString='connection-string-of-your-app-configuration-store'

2. Run the following command to build the console app:

        dotnet build

3. After the build successfully completes, run the following command to run the app locally:

        dotnet run

## Clean up resources

[!INCLUDE [azure-app-configuration-cleanup](../../includes/azure-app-configuration-cleanup.md)]

## Next steps

In this quickstart, you created a new app configuration store and used it with a .NET Core console app via the [App Configuration provider](https://go.microsoft.com/fwlink/?linkid=2074664). To learn more about how to use App Configuration, continue to the next tutorial that demonstrates authentication.

> [!div class="nextstepaction"]
> [Managed identity integration](./howto-integrate-azure-managed-service-identity.md)

---
title: Quickstart for Azure App Configuration with .NET Core | Microsoft Docs
description: A quickstart for using Azure App Configuration with .NET Core apps
services: azure-app-configuration
author: lisaguthrie
ms.service: azure-app-configuration
ms.topic: quickstart
ms.date: 1/9/2019
ms.author: lcozzens

#Customer intent: As a .NET Core developer, I want to manage all my app settings in one place.
---
# Quickstart: Create a .NET Core app with App Configuration

In this quickstart, you incorporate Azure App Configuration into a .NET Core console app to centralize storage and management of application settings separate from your code.

## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/free/)
- [.NET Core SDK](https://dotnet.microsoft.com/download) - also available in the [Azure Cloud Shell](https://shell.azure.com).

## Create an App Configuration store

[!INCLUDE [azure-app-configuration-create](../../includes/azure-app-configuration-create.md)]

6. Select **Configuration Explorer** > **Create** > **Key-value** to add the following key-value pairs:

    | Key | Value |
    |---|---|
    | TestApp:Settings:Message | Data from Azure App Configuration |

    Leave **Label** and **Content Type** empty for now.

7. Select **Apply**.

## Create a .NET Core console app

You use the [.NET Core command-line interface (CLI)](https://docs.microsoft.com/dotnet/core/tools/) to create a new .NET Core console app project. The advantage of using the .NET Core CLI over Visual Studio is that it's available across the Windows, macOS, and Linux platforms.  Alternatively, use the preinstalled tools available in the [Azure Cloud Shell](https://shell.azure.com).

1. Create a new folder for your project.

2. In the new folder, run the following command to create a new ASP.NET Core console app project:

    ```dotnetcli
    dotnet new console
    ```

## Connect to an App Configuration store

1. Add a reference to the `Microsoft.Extensions.Configuration.AzureAppConfiguration` NuGet package by running the following command:

    ```dotnetcli
    dotnet add package Microsoft.Extensions.Configuration.AzureAppConfiguration
    ```

2. Run the following command to restore packages for your project:

    ```dotnetcli
    dotnet restore
    ```

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

1. Set an environment variable named **ConnectionString**, and set it to the access key to your App Configuration store. At the command line, run the following command:

    ```cmd
    setx ConnectionString "connection-string-of-your-app-configuration-store"
    ```

    If you use Windows PowerShell, run the following command:

    ```azurepowershell
    $Env:ConnectionString = "connection-string-of-your-app-configuration-store"
    ```

    If you use macOS or Linux, run the following command:

        export ConnectionString='connection-string-of-your-app-configuration-store'

    Restart the command prompt to allow the change to take effect. Print out the value of the environment variable to validate that it is set properly.

2. Run the following command to build the console app:

    ```dotnetcli
    dotnet build
    ```

3. After the build successfully completes, run the following command to run the app locally:

    ```dotnetcli
    dotnet run
    ```

## Clean up resources

[!INCLUDE [azure-app-configuration-cleanup](../../includes/azure-app-configuration-cleanup.md)]

## Next steps

In this quickstart, you created a new App Configuration store and used it with a .NET Core console app via the [App Configuration provider](https://go.microsoft.com/fwlink/?linkid=2074664). To learn how to configure your .NET Core app to dynamically refresh configuration settings, continue to the next tutorial.

> [!div class="nextstepaction"]
> [Enable dynamic configuration](./enable-dynamic-configuration-dotnet-core.md)

---
title: Quickstart for Azure App Configuration with .NET Core | Microsoft Docs
description: In this quickstart, create a .NET Core app with Azure App Configuration to centralize storage and management of application settings separate from your code.
services: azure-app-configuration
author: maud-lv
ms.service: azure-app-configuration
ms.devlang: csharp
ms.topic: quickstart
ms.custom: devx-track-csharp, mode-other
ms.date: 03/20/2023
ms.author: malev
#Customer intent: As a .NET Core developer, I want to manage all my app settings in one place.
---
# Quickstart: Create a .NET Core app with App Configuration

In this quickstart, you incorporate Azure App Configuration into a .NET Core console app to centralize storage and management of application settings separate from your code.

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/).
- An App Configuration store. [Create a store](./quickstart-azure-app-configuration-create.md#create-an-app-configuration-store).
- [.NET Core SDK](https://dotnet.microsoft.com/download) - also available in the [Azure Cloud Shell](https://shell.azure.com).

## Add a key-value

Add the following key-value to the App Configuration store and leave **Label** and **Content Type** with their default values. For more information about how to add key-values to a store using the Azure portal or the CLI, go to [Create a key-value](./quickstart-azure-app-configuration-create.md#create-a-key-value).

| Key                        | Value                               |
|----------------------------|-------------------------------------|
| *TestApp:Settings:Message* | *Data from Azure App Configuration* |

## Create a .NET Core console app

You use the [.NET Core command-line interface (CLI)](/dotnet/core/tools/) to create a new .NET Core console app project. The advantage of using the .NET Core CLI over Visual Studio is that it's available across the Windows, macOS, and Linux platforms.  Alternatively, use the preinstalled tools available in the [Azure Cloud Shell](https://shell.azure.com).

1. Create a new folder for your project.

2. In the new folder, run the following command to create a new .NET Core console app project:

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

    ### [Windows command prompt](#tab/windowscommandprompt)

    To build and run the app locally using the Windows command prompt, run the following command:

    ```console
    setx ConnectionString "connection-string-of-your-app-configuration-store"
    ```

    Restart the command prompt to allow the change to take effect. Print the value of the environment variable to validate that it is set properly.

    ### [PowerShell](#tab/powershell)

    If you use Windows PowerShell, run the following command:

    ```azurepowershell
    $Env:ConnectionString = "connection-string-of-your-app-configuration-store"
    ```

    ### [macOS](#tab/unix)

    If you use macOS, run the following command:

    ```console
    export ConnectionString='connection-string-of-your-app-configuration-store'
    ```

    Restart the command prompt to allow the change to take effect. Print the value of the environment variable to validate that it is set properly.

    ### [Linux](#tab/linux)

    If you use Linux, run the following command:

    ```console
    export ConnectionString='connection-string-of-your-app-configuration-store'
    ```

    Restart the command prompt to allow the change to take effect. Print the value of the environment variable to validate that it is set properly.

    ---

1. Run the following command to build the console app:

    ```dotnetcli
    dotnet build
    ```

1. After the build successfully completes, run the following command to run the app locally:

    ```dotnetcli
    dotnet run
    ```

## Clean up resources

[!INCLUDE [azure-app-configuration-cleanup](../../includes/azure-app-configuration-cleanup.md)]

## Next steps

In this quickstart, you created a new App Configuration store and used it with a .NET Core console app via the [App Configuration provider](/dotnet/api/Microsoft.Extensions.Configuration.AzureAppConfiguration). To learn how to configure your .NET Core app to dynamically refresh configuration settings, continue to the next tutorial.

> [!div class="nextstepaction"]
> [Enable dynamic configuration](./enable-dynamic-configuration-dotnet-core.md)

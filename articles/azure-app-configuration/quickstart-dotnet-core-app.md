---
title: Quickstart for Azure App Configuration with .NET | Microsoft Docs
description: In this quickstart, create a .NET app with Azure App Configuration to centralize storage and management of application settings separate from your code.
services: azure-app-configuration
author: maud-lv
ms.service: azure-app-configuration
ms.devlang: csharp
ms.topic: quickstart
ms.custom: devx-track-csharp, mode-other, devx-track-dotnet
ms.date: 10/05/2024
ms.author: malev
#Customer intent: As a .NET developer, I want to manage all my app settings in one place.
---
# Quickstart: Create a .NET app with App Configuration

In this quickstart, you incorporate Azure App Configuration into a .NET console app to centralize storage and management of application settings separate from your code.

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/).
- An App Configuration store. [Create a store](./quickstart-azure-app-configuration-create.md#create-an-app-configuration-store).
- [.NET SDK 6.0 or later](https://dotnet.microsoft.com/download) - also available in the [Azure Cloud Shell](https://shell.azure.com).

## Add a key-value

Add the following key-value to the App Configuration store and leave **Label** and **Content Type** with their default values. For more information about how to add key-values to a store using the Azure portal or the CLI, go to [Create a key-value](./quickstart-azure-app-configuration-create.md#create-a-key-value).

| Key                        | Value                               |
|----------------------------|-------------------------------------|
| *TestApp:Settings:Message* | *Data from Azure App Configuration* |

## Create a .NET console app

You can use the [.NET command-line interface (CLI)](/dotnet/core/tools/) to create a new .NET console app project. The advantage of using the .NET CLI over Visual Studio is that it's available across the Windows, macOS, and Linux platforms.  Alternatively, use the preinstalled tools available in the [Azure Cloud Shell](https://shell.azure.com).

1. Create a new folder for your project.

1. In the new folder, run the following command to create a new .NET console app project:

    ```dotnetcli
    dotnet new console
    ```

## Connect to an App Configuration store

You can connect to your App Configuration store using Microsoft Entra ID (recommended), or a connection string.

1. Add NuGet package references by running the following command:

    ### [Microsoft Entra ID (recommended)](#tab/entra-id)
    ```dotnetcli
    dotnet add package Microsoft.Extensions.Configuration.AzureAppConfiguration
    dotnet add package Azure.Identity
    ```

    ### [Connection string](#tab/connection-string)
    ```dotnetcli
    dotnet add package Microsoft.Extensions.Configuration.AzureAppConfiguration
    ```
    ---

1. Run the following command to restore packages for your project:

    ```dotnetcli
    dotnet restore
    ```

1. Open the *Program.cs* file, and add the following namespaces:


    ### [Microsoft Entra ID (recommended)](#tab/entra-id)
    ```csharp
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.Configuration.AzureAppConfiguration;
    using Azure.Identity;
    ```

    ### [Connection string](#tab/connection-string)
    ```csharp
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.Configuration.AzureAppConfiguration;
    ```
    ---

1. Connect to your App Configuration store by calling the `AddAzureAppConfiguration` method in the `Program.cs` file.

    ### [Microsoft Entra ID (recommended)](#tab/entra-id)
    You use the `DefaultAzureCredential` to authenticate to your App Configuration store. Follow the [instructions](./concept-enable-rbac.md#authentication-with-token-credentials) to assign your credential the **App Configuration Data Reader** role. Be sure to allow sufficient time for the permission to propagate before running your application.

    ```csharp
    var builder = new ConfigurationBuilder();
    builder.AddAzureAppConfiguration(options =>
    {
        string endpoint = Environment.GetEnvironmentVariable("Endpoint");
        options.Connect(new Uri(endpoint), new DefaultAzureCredential());
    });

    var config = builder.Build();
    Console.WriteLine(config["TestApp:Settings:Message"] ?? "Hello world!");
    ```

    ### [Connection string](#tab/connection-string)
    ```csharp
    var builder = new ConfigurationBuilder();
    builder.AddAzureAppConfiguration(Environment.GetEnvironmentVariable("ConnectionString"));
    
    var config = builder.Build();
    Console.WriteLine(config["TestApp:Settings:Message"] ?? "Hello world!");
    ```
    ---

## Build and run the app locally

1. Set an environment variable.

    ### [Microsoft Entra ID (recommended)](#tab/entra-id)
    Set the environment variable named **Endpoint** to the endpoint of your App Configuration store found under the *Overview* of your store in the Azure portal.

    If you use the Windows command prompt, run the following command and restart the command prompt to allow the change to take effect:

    ```cmd
    setx Endpoint "<endpoint-of-your-app-configuration-store>"
    ```

    If you use PowerShell, run the following command:

    ```powershell
    $Env:Endpoint = "<endpoint-of-your-app-configuration-store>"
    ```

    If you use macOS or Linux, run the following command:

    ```bash
    export Endpoint='<endpoint-of-your-app-configuration-store>'
    ```

    ### [Connection string](#tab/connection-string)
    Set the environment variable named **ConnectionString** to the read-only connection string of your App Configuration store found under *Access keys* of your store in the Azure portal.

    If you use the Windows command prompt, run the following command and restart the command prompt to allow the change to take effect:

    ```cmd
    setx ConnectionString "<connection-string-of-your-app-configuration-store>"
    ```

   If you use PowerShell, run the following command:

    ```powershell
    $Env:ConnectionString = "<connection-string-of-your-app-configuration-store>"
    ```

    If you use macOS or Linux, run the following command:

    ```bash
    export ConnectionString='<connection-string-of-your-app-configuration-store>'
    ```
    ---

1. Run the following command to build the console app:

    ```dotnetcli
    dotnet build
    ```

1. After the build successfully completes, run the following command to run the app locally:

    ```dotnetcli
    dotnet run
    ```

    :::image type="content" source="./media/quickstarts/dotnet-core-app-run.png" alt-text="Screenshot of a terminal window showing the app running locally.":::

## Clean up resources

[!INCLUDE [azure-app-configuration-cleanup](../../includes/azure-app-configuration-cleanup.md)]

## Next steps

In this quickstart, you created a new App Configuration store and used it with a .NET console app via the [App Configuration provider](/dotnet/api/Microsoft.Extensions.Configuration.AzureAppConfiguration). To learn how to configure your .NET app to dynamically refresh configuration settings, continue to the next tutorial.

> [!div class="nextstepaction"]
> [Enable dynamic configuration](./enable-dynamic-configuration-dotnet-core.md)

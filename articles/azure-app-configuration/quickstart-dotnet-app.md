---
title: Quickstart for Azure App Configuration with .NET Framework
description: In this article, create a .NET Framework app with Azure App Configuration to centralize storage and management of application settings separate from your code.
services: azure-app-configuration
author: maud-lv
ms.service: azure-app-configuration
ms.devlang: csharp
ms.custom: devx-track-csharp, mode-other, devx-track-dotnet
ms.topic: quickstart
ms.date: 02/04/2025
ms.author: malev
#Customer intent: As a .NET Framework developer, I want to manage all my app settings in one place.
---
# Quickstart: Create a .NET Framework app with Azure App Configuration

There are two ways to incorporate Azure App Configuration into a .NET Framework-based app.

- The configuration builder for App Configuration enables data from App Configuration to be loaded to App Settings. Your app accesses configuration as it always does via `ConfigurationManager`. You don't need to make any code change other than updates to *app.config* or *web.config* files. This quickstart walks you through this option.
- As is designed by the .NET Framework, the App Settings can only refresh upon application restart. The App Configuration .NET provider is a .NET Standard library. It supports caching and refreshing configuration dynamically without application restart. If the dynamic configuration is essential to you and you're willing to make code changes, see tutorials on how you can implement dynamic configuration updates in a [.NET Framework console app](./enable-dynamic-configuration-dotnet.md) or an [ASP.NET web app](./enable-dynamic-configuration-aspnet-netfx.md).

In this quickstart, a .NET Framework console app is used as an example, but the same technique applies to an ASP.NET Web Forms/MVC app.

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/).
- An App Configuration store. [Create a store](./quickstart-azure-app-configuration-create.md#create-an-app-configuration-store).
- [Visual Studio](https://visualstudio.microsoft.com/downloads)
- [.NET Framework 4.7.2 or later](https://dotnet.microsoft.com/download/dotnet-framework)

## Add a key-value

Add the following key-value to the App Configuration store and leave **Label** and **Content Type** with their default values. For more information about how to add key-values to a store using the Azure portal or the CLI, go to [Create a key-value](./quickstart-azure-app-configuration-create.md#create-a-key-value).

| Key                        | Value                               |
|----------------------------|-------------------------------------|
| *TestApp:Settings:Message* | *Data from Azure App Configuration* |

## Create a .NET Framework console app

1. Start Visual Studio and select **Create a new project**.

1. In **Create a new project**, filter on the **Console** project type and select **Console App (.NET Framework)** with C# from the project template list. Press **Next**.

1. In **Configure your new project**, enter a project name. Under **Framework**, select **.NET Framework 4.7.2** or higher. Press **Create**.

## Connect to an App Configuration store

Connect to your App Configuration store using Microsoft Entra ID (recommended), or a connection string.

1. Right-click your project, and select **Manage NuGet Packages**. On the **Browse** tab, search and add the latest stable versions of following NuGet packages to your project.

    - Microsoft.Configuration.ConfigurationBuilders.AzureAppConfiguration
    - Microsoft.Configuration.ConfigurationBuilders.Environment
    - System.Configuration.ConfigurationManager

1. Update the *App.config* file of your project as follows. You can connect to your App Configuration store using Microsoft Entra ID (recommended), or a connection string.

    ### [Microsoft Entra ID (recommended)](#tab/entra-id)
    
    The `DefaultAzureCredential` is used to authenticate to your App Configuration store by default. Follow the [instructions](./concept-enable-rbac.md#authentication-with-token-credentials) to assign your credential the **App Configuration Data Reader** role. Be sure to allow sufficient time for the permission to propagate before running your application.
    
    ```xml
    <configSections>
        <section name="configBuilders" type="System.Configuration.ConfigurationBuildersSection, System.Configuration, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a" restartOnExternalChanges="false" requirePermission="false" />
    </configSections>
    
    <configBuilders>
        <builders>
            <add name="MyConfigStore" mode="Greedy" endpoint="${Endpoint}" type="Microsoft.Configuration.ConfigurationBuilders.AzureAppConfigurationBuilder, Microsoft.Configuration.ConfigurationBuilders.AzureAppConfiguration" />
            <add name="Environment" mode="Greedy" type="Microsoft.Configuration.ConfigurationBuilders.EnvironmentConfigBuilder, Microsoft.Configuration.ConfigurationBuilders.Environment" />
        </builders>
    </configBuilders>
    
    <appSettings configBuilders="Environment,MyConfigStore">
        <add key="AppName" value="Console App Demo" />
        <add key="Endpoint" value ="Set via an environment variable - for example, dev, test, staging, or production endpoint." />
    </appSettings>
    ```
    
    The endpoint value of your App Configuration store is read from the environment variable `Endpoint`. You also add the `Environment` configuration builder before the `MyConfigStore` in the `configBuilders` property of the `appSettings` section.
    
    ### [Connection string](#tab/connection-string)
    
    ```xml
    <configSections>
        <section name="configBuilders" type="System.Configuration.ConfigurationBuildersSection, System.Configuration, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a" restartOnExternalChanges="false" requirePermission="false" />
    </configSections>
    
    <configBuilders>
        <builders>
            <add name="MyConfigStore" mode="Greedy" connectionString="${ConnectionString}" type="Microsoft.Configuration.ConfigurationBuilders.AzureAppConfigurationBuilder, Microsoft.Configuration.ConfigurationBuilders.AzureAppConfiguration" />
            <add name="Environment" mode="Greedy" type="Microsoft.Configuration.ConfigurationBuilders.EnvironmentConfigBuilder, Microsoft.Configuration.ConfigurationBuilders.Environment" />
        </builders>
    </configBuilders>
    
    <appSettings configBuilders="Environment,MyConfigStore">
        <add key="AppName" value="Console App Demo" />
        <add key="ConnectionString" value ="Set via an environment variable - for example, dev, test, staging, or production connection string." />
    </appSettings>
    ```
    
    The connection string of your App Configuration store is read from the environment variable `ConnectionString`. You also add the `Environment` configuration builder before the `MyConfigStore` in the `configBuilders` property of the `appSettings` section.
    
    ---

1. Open *Program.cs*, and update the `Main` method to use App Configuration by calling `ConfigurationManager`.

    ```csharp
    static void Main(string[] args)
    {
        string message = System.Configuration.ConfigurationManager.AppSettings["TestApp:Settings:Message"];

        Console.WriteLine(message);
        Console.ReadKey();
    }
    ```

## Build and run the app

1. Set an environment variable.

    ### [Microsoft Entra ID (recommended)](#tab/entra-id)

    Set an environment variable named **Endpoint** to the endpoint of your App Configuration store found under the **Overview** of your store in the Azure portal.

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

   Set an environment variable named **ConnectionString** to the read-only connection string of your App Configuration store found under **Access settings** of your store in the Azure portal.

    If you use the Windows command prompt, run the following command:

    ```console
    setx ConnectionString "<connection-string-of-your-app-configuration-store>"
    ```

    If you use Windows PowerShell, run the following command:

    ```powershell
    $Env:ConnectionString = "<connection-string-of-your-app-configuration-store>"
    ```

    If you use macOS or Linux, run the following command:

    ```bash
    export ConnectionString='<connection-string-of-your-app-configuration-store>'
    ```
    ---

1. Restart Visual Studio to allow the change to take effect.

1. Press Ctrl + F5 to build and run the console app. You should see the message from App Configuration outputs in the console.

## Clean up resources

[!INCLUDE [azure-app-configuration-cleanup](../../includes/azure-app-configuration-cleanup.md)]

## Next steps

In this quickstart, you created a new App Configuration store and used it with a .NET Framework console app. To learn how to enable your .NET Framework app to dynamically refresh configuration settings, continue to the next tutorials.

> [!div class="nextstepaction"]
> [Enable dynamic configuration in a .NET Framework app](./enable-dynamic-configuration-dotnet.md)

> [!div class="nextstepaction"]
> [Enable dynamic configuration in an ASP.NET web app](./enable-dynamic-configuration-aspnet-netfx.md)

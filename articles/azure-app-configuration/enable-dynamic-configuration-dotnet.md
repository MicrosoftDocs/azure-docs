---
title: '.NET Framework Tutorial: dynamic configuration in Azure App Configuration'
description: In this tutorial, you learn how to dynamically update the configuration data for .NET Framework apps using Azure App Configuration. 
services: azure-app-configuration
author: lisaguthrie
ms.service: azure-app-configuration
ms.devlang: csharp
ms.topic: tutorial
ms.date: 10/21/2019
ms.author: lcozzens

#Customer intent: I want to dynamically update my .NET Framework app to use the latest configuration data in App Configuration.
---
# Tutorial: Use dynamic configuration in a .NET Framework app

The App Configuration .NET client library supports updating a set of configuration settings on demand without causing an application to restart. This can be implemented by first getting an instance of `IConfigurationRefresher` from the options for the configuration provider and then calling `Refresh` on that instance anywhere in your code.

In order to keep the settings updated and avoid too many calls to the configuration store, a cache is used for each setting. Until the cached value of a setting has expired, the refresh operation does not update the value, even when the value has changed in the configuration store. The default expiration time for each request is 30 seconds, but it can be overridden if required.

This tutorial shows how you can implement dynamic configuration updates in your code. It builds on the app introduced in the quickstarts. Before you continue, finish [Create a .NET Framework app with App Configuration](./quickstart-dotnet-app.md) first.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Set up your .NET Framework app to update its configuration in response to changes in an App Configuration store.
> * Inject the latest configuration in your application.
## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/free/)
- [Visual Studio 2019](https://visualstudio.microsoft.com/vs)
- [.NET Framework 4.7.1 or later](https://dotnet.microsoft.com/download)

## Create an App Configuration store

[!INCLUDE [azure-app-configuration-create](../../includes/azure-app-configuration-create.md)]

6. Select **Configuration Explorer** > **+ Create** > **Key-value** to add the following key-value pairs:

    | Key | Value |
    |---|---|
    | TestApp:Settings:Message | Data from Azure App Configuration |

    Leave **Label** and **Content Type** empty for now.

7. Select **Apply**.

## Create a .NET Framework console app

1. Start Visual Studio, and select **File** > **New** > **Project**.

1. In **Create a new project**, filter on the **Console** project type and click on **Console App (.NET Framework)**. Click **Next**.

1. In **Configure your new project**, enter a project name. Under **Framework**, select **.NET Framework 4.7.1** or higher. Click **Create**.

## Reload data from App Configuration
1. Right-click your project, and select **Manage NuGet Packages**. On the **Browse** tab, search and add the *Microsoft.Extensions.Configuration.AzureAppConfiguration* NuGet package to your project. If you can't find it, select the **Include prerelease** check box.

1. Open *Program.cs*, and add a reference to the .NET Core App Configuration provider.

    ```csharp
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.Configuration.AzureAppConfiguration;
    ```

1. Add two variables to store configuration-related objects.

    ```csharp
    private static IConfiguration _configuration = null;
    private static IConfigurationRefresher _refresher = null;
    ```

1. Update the `Main` method to connect to App Configuration with the specified refresh options.

    ```csharp
    static void Main(string[] args)
    {
        var builder = new ConfigurationBuilder();
        builder.AddAzureAppConfiguration(options =>
        {
            options.Connect(Environment.GetEnvironmentVariable("ConnectionString"))
                    .ConfigureRefresh(refresh =>
                    {
                        refresh.Register("TestApp:Settings:Message")
                            .SetCacheExpiration(TimeSpan.FromSeconds(10));
                    });

            _refresher = options.GetRefresher();
        });

        _configuration = builder.Build();
        PrintMessage().Wait();
    }
    ```
    The `ConfigureRefresh` method is used to specify the settings used to update the configuration data with the App Configuration store when a refresh operation is triggered. An instance of `IConfigurationRefresher` can be retrieved by calling `GetRefresher` method on the options provided to `AddAzureAppConfiguration` method, and the `Refresh` method on this instance can be used to trigger a refresh operation anywhere in your code.

    > [!NOTE]
    > The default cache expiration time for a configuration setting is 30 seconds, but can be overridden by calling the `SetCacheExpiration` method on the options initializer passed as an argument to the `ConfigureRefresh` method.

1. Add a method called `PrintMessage()` that triggers a manual refresh of configuration data from App Configuration.

    ```csharp
    private static async Task PrintMessage()
    {
        Console.WriteLine(_configuration["TestApp:Settings:Message"] ?? "Hello world!");

        // Wait for the user to press Enter
        Console.ReadLine();

        await _refresher.Refresh();
        Console.WriteLine(_configuration["TestApp:Settings:Message"] ?? "Hello world!");
    }
    ```

## Build and run the app locally

1. Set an environment variable named **ConnectionString**, and set it to the access key to your App Configuration store. If you use the Windows command prompt, run the following command and restart the command prompt to allow the change to take effect:

        setx ConnectionString "connection-string-of-your-app-configuration-store"

    If you use Windows PowerShell, run the following command:

        $Env:ConnectionString = "connection-string-of-your-app-configuration-store"

1. Restart Visual Studio to allow the change to take effect. 

1. Press Ctrl + F5 to build and run the console app.

    ![App launch local](./media/dotnet-app-run.png)

1. Sign in to the [Azure portal](https://portal.azure.com). Select **All resources**, and select the App Configuration store instance that you created in the quickstart.

1. Select **Configuration Explorer**, and update the values of the following keys:

    | Key | Value |
    |---|---|
    | TestApp:Settings:Message | Data from Azure App Configuration - Updated |

1. Back in the running application, press the Enter key to trigger a refresh and print the updated value in the Command Prompt or PowerShell window.

    ![App refresh local](./media/dotnet-app-run-refresh.png)
    
    > [!NOTE]
    > Since the cache expiration time was set to 10 seconds using the `SetCacheExpiration` method while specifying the configuration for the refresh operation, the value for the configuration setting will only be updated if at least 10 seconds have elapsed since the last refresh for that setting.

## Clean up resources

[!INCLUDE [azure-app-configuration-cleanup](../../includes/azure-app-configuration-cleanup.md)]

## Next steps

In this tutorial, you enabled your .NET Framework app to dynamically refresh configuration settings from App Configuration. To learn how to use an Azure managed identity to streamline the access to App Configuration, continue to the next tutorial.

> [!div class="nextstepaction"]
> [Managed identity integration](./howto-integrate-azure-managed-service-identity.md)

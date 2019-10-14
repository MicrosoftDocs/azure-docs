---
title: Quickstart for Azure App Configuration with .NET Framework | Microsoft Docs
description: A quickstart for using Azure App Configuration with .NET Framework apps
services: azure-app-configuration
documentationcenter: ''
author: lisaguthrie
manager: maiye
editor: ''

ms.assetid: 
ms.service: azure-app-configuration
ms.devlang: csharp
ms.topic: quickstart
ms.tgt_pltfrm: .NET
ms.workload: tbd
ms.date: 10/09/2019
ms.author: lcozzens

#Customer intent: As an ASP.NET developer, I want to use feature flags to control feature availability quickly and confidently.
---
# Quickstart: Create a .NET Framework app with Azure App Configuration

In this quickstart, you incorporate Azure App Configuration into an ASP.NET web app to create an end-to-end implementation of feature management. You can use the App Configuration service to centrally store all your feature flags and control their states. 

The .NET Feature Management libraries extend the framework with comprehensive feature flag support. These libraries are built on top of the .NET configuration system. They seamlessly integrate with App Configuration through its .NET configuration provider.

## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/free/)
- [Visual Studio 2019](https://visualstudio.microsoft.com/vs)
- [.NET Framework 4.7.2](https://dotnet.microsoft.com/download)

## Create an app configuration store

[!INCLUDE [azure-app-configuration-create](../../includes/azure-app-configuration-create.md)]

6. Select **Configuration Explorer** > **+ Create** to add the following key-value pairs:

    | Key | Value |
    |---|---|
    | TestApp:Settings:Message | Data from Azure App Configuration |

    Leave **Label** and **Content Type** empty for now.

## Create a .NET console app

1. Start Visual Studio, and select **File** > **New** > **Project**.

1. In **Create a new project**, filter on the **Console** project type and click on **Console App (.NET Framework)**. Click **Next**.

1. In **Configure your new project**, enter a project name. Under **Framework**, select **.NET Framework 4.7.1** or higher. Click **Create**.

## Connect to an app configuration store

1. Right-click your project, and select **Manage NuGet Packages**. On the **Browse** tab, search and add the following NuGet packages to your project. If you can't find them, select the **Include prerelease** check box.

    ```
    Microsoft.Azure.AppConfiguration.AspNetCore
    Microsoft.FeatureManagement.AspNetCore
    ```

1. Open *Program.cs* and add the following statements:

    ```csharp
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.Configuration.AzureAppConfiguration;
    using Microsoft.FeatureManagement;
    ```

1. Update the `Main` method to display a message if the `Beta` feature flag is enabled.

    ```csharp
        static void Main(string[] args)
        {
            IConfigurationRoot configuration = new Microsoft.Extensions.Configuration.ConfigurationBuilder()
                .AddAzureAppConfiguration(options => 
                { 
                    options.Connect(Environment.GetEnvironmentVariable("ConnectionString"))
                           .UseFeatureFlags(); 
                }).Build(); 
            
            IServiceCollection services = new ServiceCollection(); 
            services.AddSingleton<IConfiguration>(configuration).AddFeatureManagement(); 
            IFeatureManager featureManager = services.BuildServiceProvider().GetRequiredService<IFeatureManager>(); 
            
            if (featureManager.IsEnabled("Beta")) 
            { 
                Console.WriteLine("Warning: You are using a beta version of this application."); 
            }

            Console.WriteLine("Hello World!");
        }
    ```

## Build and run the app locally

1. Set an environment variable named **ConnectionString** to the connection string of your app configuration store. If you use the Windows command prompt, run the following command:

        setx ConnectionString "connection-string-of-your-app-configuration-store"

    If you use Windows PowerShell, run the following command:

        $Env:ConnectionString = "connection-string-of-your-app-configuration-store"

1. Restart Visual Studio to allow the change to take effect. Press Ctrl + F5 to build and run the console app.

## Clean up resources

[!INCLUDE [azure-app-configuration-cleanup](../../includes/azure-app-configuration-cleanup.md)]

## Next steps

In this quickstart, you created a feature flag in App Configuration and used it with a .NET Framework console app. To learn more about how to use App Configuration, continue to the next tutorial that demonstrates authentication.

> [!div class="nextstepaction"]
> [Managed identity integration](./howto-integrate-azure-managed-service-identity.md)

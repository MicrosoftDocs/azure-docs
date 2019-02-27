---
title: Integrate with a continuous integration and delivery pipeline using Azure App Configuration | Microsoft Docs
description: Learn how to generate a configuration file using data in Azure App Configuration during continuous integration and delivery
services: azure-app-configuration
documentationcenter: ''
author: yegu-ms
manager: balans
editor: ''

ms.assetid: 
ms.service: azure-app-configuration
ms.topic: conceptual
ms.date: 02/24/2019
ms.author: yegu
ms.custom: mvc
---

# Integrate with a CI/CD pipeline

To enhance the resiliency of your application against the remote possibility of not being able to reach Azure App Configuration, you should package the current configuration data into a file that is deployed with the application and loaded locally during its startup. This approach guarantees that your application will have default setting values at least. These values will be overwritten by any newer changes in an app configuration store when it is available.

Using the [**Export**](./howto-import-export-data.md#export-data) function of Azure App Configuration, you can automate the process of retrieving current configuration data as a single file. You can then embed this file in a build or deployment step in your continuous integration and continuous deployment pipeline.

The following example shows how to include App Configuration data as a build step for the web app introduced in the quickstarts. Complete [Create an ASP.NET Core app with App Configuration](./quickstart-aspnet-core-app.md) first before you continue.

You can use any code editor to complete the steps in this quickstart. However, [Visual Studio Code](https://code.visualstudio.com/) is an excellent option available on the Windows, macOS, and Linux platforms.

## Prerequisites

If you build locally, download and install [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest) if you haven’t already.

If you want to do a cloud build, with Azure DevOps for example, make sure [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest) is installed in your build system.

## Export app configuration store

1. Open your *.csproj* file and add the following:

    ```xml
    <Target Name="Export file" AfterTargets="Build">
        <Message Text="Export the configurations to a temp file. " />
        <Exec WorkingDirectory="$(MSBuildProjectDirectory)" Condition="$(ConnectionString) != ''" Command="az appconfig kv export -f $(OutDir)\azureappconfig.json --format json --separator : --connection-string $(ConnectionString)" />
    </Target>
    ```

    The *ConnectionString* associated with your app configuration store should be added as an environment variable.

2. Open *Program.cs* and update the `CreateWebHostBuilder` method to use the exported json file by calling the `config.AddJsonFile()` method.

    ```csharp
    public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
        WebHost.CreateDefaultBuilder(args)
            .ConfigureAppConfiguration((hostingContext, config) =>
            {
                var directory = System.IO.Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);
                var settings = config.Build();

                config.AddJsonFile(Path.Combine(directory, "azureappconfig.json"));
                config.AddAzureAppConfiguration(settings["ConnectionStrings:AppConfig"]);
            })
            .UseStartup<Startup>();
    ```

## Build and run the app locally

1. Set an environment variable named **ConnectionString** and set it to the access key to your app configuration store. If you are using Windows Command Prompt, execute the following command and restart the Command Prompt to allow the change to take effect:

        setx ConnectionString "connection-string-of-your-app-configuration-store"

    If you are using Windows PowerShell, execute the following command:

        $Env:ConnectionString = "connection-string-of-your-app-configuration-store"

    If you are using macOS or Linux, execute the following command:

        export ConnectionString='connection-string-of-your-app-configuration-store'

2. To build the app using the .NET Core CLI, execute the following command in the command shell:

        dotnet build

3. Once the build successfully completes, execute the following command to run the web app locally:

        dotnet run

4. Launch a browser window and navigate to `http://localhost:5000`, which is the default URL for the web app hosted locally.

    ![Quickstart app launch local](./media/quickstarts/aspnet-core-app-launch-local.png)

## Next steps

* [Managed Identities for Azure Resources Integration](./integrate-azure-managed-service-identity.md)

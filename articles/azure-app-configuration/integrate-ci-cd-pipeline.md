---
title: Tutorial for integrating with a continuous integration and delivery pipeline by using Azure App Configuration | Microsoft Docs
description: In this tutorial, you learn how to generate a configuration file by using data in Azure App Configuration during continuous integration and delivery
services: azure-app-configuration
documentationcenter: ''
author: yegu-ms
manager: balans
editor: ''

ms.assetid: 
ms.service: azure-app-configuration
ms.topic: tutorial
ms.date: 02/24/2019
ms.author: yegu
ms.custom: mvc

#Customer intent: I want to use Azure managed identities to simplify secrets management for my app.
---
# Integrate with a CI/CD pipeline

You can enhance the resiliency of your application against the remote possibility of not being able to reach Azure App Configuration. To do so, package the current configuration data into a file that's deployed with the application and loaded locally during its startup. This approach guarantees that your application has default setting values at least. These values are overwritten by any newer changes in an app configuration store when it's available.

Using the [Export](./howto-import-export-data.md#export-data) function of Azure App Configuration, you can automate the process of retrieving current configuration data as a single file. Then embed this file in a build or deployment step in your continuous integration and continuous deployment (CI/CD) pipeline.

The following example shows how to include App Configuration data as a build step for the web app introduced in the quickstarts. Before you continue, finish [Create an ASP.NET Core app with App Configuration](./quickstart-aspnet-core-app.md) first.

You can use any code editor to do the steps in this quickstart. [Visual Studio Code](https://code.visualstudio.com/) is an excellent option available on the Windows, macOS, and Linux platforms.

## Prerequisites

If you build locally, download and install the [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest) if you haven’t already.

To do a cloud build, with Azure DevOps for example, make sure the [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest) is installed in your build system.

## Export an app configuration store

1. Open your *.csproj* file, and add the following script:

    ```xml
    <Target Name="Export file" AfterTargets="Build">
        <Message Text="Export the configurations to a temp file. " />
        <Exec WorkingDirectory="$(MSBuildProjectDirectory)" Condition="$(ConnectionString) != ''" Command="az appconfig kv export -f $(OutDir)\azureappconfig.json --format json --separator : --connection-string $(ConnectionString)" />
    </Target>
    ```

    Add the *ConnectionString* associated with your app configuration store as an environment variable.

2. Open Program.cs, and update the `CreateWebHostBuilder` method to use the exported JSON file by calling the `config.AddJsonFile()` method.

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

1. Set an environment variable named **ConnectionString**, and set it to the access key to your app configuration store. If you use the Windows command prompt, run the following command and restart the command prompt to allow the change to take effect:

        setx ConnectionString "connection-string-of-your-app-configuration-store"

    If you use Windows PowerShell, run the following command:

        $Env:ConnectionString = "connection-string-of-your-app-configuration-store"

    If you use macOS or Linux, run the following command:

        export ConnectionString='connection-string-of-your-app-configuration-store'

2. To build the app by using the .NET Core CLI, run the following command in the command shell:

        dotnet build

3. After the build successfully completes, run the following command to run the web app locally:

        dotnet run

4. Open a browser window and go to `http://localhost:5000`, which is the default URL for the web app hosted locally.

    ![Quickstart app launch local](./media/quickstarts/aspnet-core-app-launch-local.png)

## Next steps

* [Managed identities for Azure resources integration](./howto-integrate-azure-managed-service-identity.md)

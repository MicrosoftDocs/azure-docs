---
title: Quickstart for Azure App Configuration with ASP.NET Core | Microsoft Docs
description: Quickstart for using Azure App Configuration with ASP.NET Core apps
services: azure-app-configuration
author: lisaguthrie

ms.service: azure-app-configuration
ms.devlang: csharp
ms.topic: quickstart
ms.date: 02/19/2020
ms.author: lcozzens

#Customer intent: As an ASP.NET Core developer, I want to learn how to manage all my app settings in one place.
---
# Quickstart: Create an ASP.NET Core app with Azure App Configuration

In this quickstart, you will use Azure App Configuration to centralize storage and management of application settings for an ASP.NET Core application. ASP.NET Core builds a single key-value-based configuration object using settings from one or more data sources specified by an application. These data sources are known as *configuration providers*. Because App Configuration's .NET Core client is implemented as a configuration provider, the service appears like another data source.

## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/free/)
- [.NET Core SDK](https://dotnet.microsoft.com/download)

>[!TIP]
> The Azure Cloud Shell is a free interactive shell that you can use to run the command line instructions in this article.  It has common Azure tools preinstalled, including the .NET Core SDK. If you are logged in to your Azure subscription, launch your [Azure Cloud Shell](https://shell.azure.com) from shell.azure.com.  You can learn more about Azure Cloud Shell by [reading our documentation](../cloud-shell/overview.md)

## Create an App Configuration store

[!INCLUDE [azure-app-configuration-create](../../includes/azure-app-configuration-create.md)]

6. Select **Configuration Explorer** > **Create** > **Key-value** to add the following key-value pairs:

    | Key | Value |
    |---|---|
    | TestApp:Settings:BackgroundColor | White |
    | TestApp:Settings:FontSize | 24 |
    | TestApp:Settings:FontColor | Black |
    | TestApp:Settings:Message | Data from Azure App Configuration |

    Leave **Label** and **Content Type** empty for now. Select **Apply**.

## Create an ASP.NET Core web app

Use the [.NET Core command-line interface (CLI)](https://docs.microsoft.com/dotnet/core/tools/) to create a new ASP.NET Core MVC web app project. The [Azure Cloud Shell](https://shell.azure.com) provides these tools for you.  They are also available across the Windows, macOS, and Linux platforms.

1. Create a new folder for your project. For this quickstart, name it *TestAppConfig*.

1. In the new folder, run the following command to create a new ASP.NET Core MVC web app project:

```dotnetcli
dotnet new mvc --no-https
```

## Add Secret Manager

To use Secret Manager, add a `UserSecretsId` element to your *.csproj* file.

1. Open the *.csproj* file.

1.  Add a `UserSecretsId` element as shown here. You can use the same GUID, or you can replace this value with your own.

    > [!IMPORTANT]
    > `CreateHostBuilder` replaces `CreateWebHostBuilder` in .NET Core 3.0.  Select the correct syntax based on your environment.
    
    #### [.NET Core 2.x](#tab/core2x)
    
    ```xml
    <Project Sdk="Microsoft.NET.Sdk.Web">
    
        <PropertyGroup>
            <TargetFramework>netcoreapp2.1</TargetFramework>
            <UserSecretsId>79a3edd0-2092-40a2-a04d-dcb46d5ca9ed</UserSecretsId>
        </PropertyGroup>
    
        <ItemGroup>
            <PackageReference Include="Microsoft.AspNetCore.App" />
            <PackageReference Include="Microsoft.AspNetCore.Razor.Design" Version="2.1.2" PrivateAssets="All" />
        </ItemGroup>
    
    </Project>
    ```
    
    #### [.NET Core 3.x](#tab/core3x)
    
    ```xml
    <Project Sdk="Microsoft.NET.Sdk.Web">
        
        <PropertyGroup>
            <TargetFramework>netcoreapp3.1</TargetFramework>
            <UserSecretsId>79a3edd0-2092-40a2-a04d-dcb46d5ca9ed</UserSecretsId>
        </PropertyGroup>
    
    </Project>
    ```
    ---

1. Save the *.csproj* file.

The Secret Manager tool stores sensitive data for development work outside of your project tree. This approach helps prevent the accidental sharing of app secrets within source code.

> [!TIP]
> To learn more about Secret Manager, please see [Safe storage of app secrets in development in ASP.NET Core](https://docs.microsoft.com/aspnet/core/security/app-secrets)

## Connect to an App Configuration store

1. Add a reference to the `Microsoft.Azure.AppConfiguration.AspNetCore` NuGet package by running the following command:

    ```dotnetcli
    dotnet add package Microsoft.Azure.AppConfiguration.AspNetCore
    ```

1. Run the following command to restore packages for your project:

    ```dotnetcli
    dotnet restore
    ```

1. Add a secret named *ConnectionStrings:AppConfig* to Secret Manager.

    This secret contains the connection string to access your App Configuration store. Replace the value in the following command with the connection string for your App Configuration store. You can find the connection string under **Access Keys** in the Azure portal.

    This command must be executed in the same directory as the *.csproj* file.

    ```dotnetcli
    dotnet user-secrets set ConnectionStrings:AppConfig <your_connection_string>
    ```

    > [!IMPORTANT]
    > Some shells will truncate the connection string unless it is enclosed in quotes. Ensure that the output of the `dotnet user-secrets` command shows the entire connection string. If it doesn't, rerun the command, enclosing the connection string in quotes.

    Secret Manager is used only to test the web app locally. When the app is deployed to [Azure App Service](https://azure.microsoft.com/services/app-service/web), for example, you use the **Connection Strings**  application setting in App Service instead of Secret Manager to store the connection string.

    Access this secret using the configuration API. A colon (:) works in the configuration name with the configuration API on all supported platforms. See [Configuration by environment](https://docs.microsoft.com/aspnet/core/fundamentals/configuration/index?tabs=basicconfiguration&view=aspnetcore-2.0).

1. Open *Program.cs*, and add a reference to the .NET Core App Configuration provider.

    ```csharp
    using Microsoft.Extensions.Configuration.AzureAppConfiguration;
    ```

1. Update the `CreateWebHostBuilder` method to use App Configuration by calling the `config.AddAzureAppConfiguration()` method.

    > [!IMPORTANT]
    > `CreateHostBuilder` replaces `CreateWebHostBuilder` in .NET Core 3.0.  Select the correct syntax based on your environment.

    #### [.NET Core 2.x](#tab/core2x)

    ```csharp
    public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
        WebHost.CreateDefaultBuilder(args)
            .ConfigureAppConfiguration((hostingContext, config) =>
            {
                var settings = config.Build();
                config.AddAzureAppConfiguration(settings["ConnectionStrings:AppConfig"]);
            })
            .UseStartup<Startup>();
    ```

    #### [.NET Core 3.x](#tab/core3x)

    ```csharp
    public static IHostBuilder CreateHostBuilder(string[] args) =>
        Host.CreateDefaultBuilder(args)
        .ConfigureWebHostDefaults(webBuilder =>
        webBuilder.ConfigureAppConfiguration((hostingContext, config) =>
        {
            var settings = config.Build();
            config.AddAzureAppConfiguration(settings["ConnectionStrings:AppConfig"]);
        })
        .UseStartup<Startup>());
    ```

    ---

1. Navigate to *<app root>/Views/Home* and open *Index.cshtml*. Replace its content with the following code:

    ```HTML
    @using Microsoft.Extensions.Configuration
    @inject IConfiguration Configuration

    <style>
        body {
            background-color: @Configuration["TestApp:Settings:BackgroundColor"]
        }
        h1 {
            color: @Configuration["TestApp:Settings:FontColor"];
            font-size: @Configuration["TestApp:Settings:FontSize"];
        }
    </style>

    <h1>@Configuration["TestApp:Settings:Message"]</h1>
    ```

1. Navigate to *<app root>/Views/Shared* and open *_Layout.cshtml*. Replace its content with the following code:

    ```HTML
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>@ViewData["Title"] - hello_world</title>

        <link rel="stylesheet" href="~/lib/bootstrap/dist/css/bootstrap.css" />
        <link rel="stylesheet" href="~/css/site.css" />
    </head>
    <body>
        <div class="container body-content">
            @RenderBody()
        </div>

        <script src="~/lib/jquery/dist/jquery.js"></script>
        <script src="~/lib/bootstrap/dist/js/bootstrap.js"></script>
        <script src="~/js/site.js" asp-append-version="true"></script>

        @RenderSection("Scripts", required: false)
    </body>
    </html>
    ```

## Build and run the app locally

1. To build the app using the .NET Core CLI, navigate to the root directory of your application and run the following command in the command shell:

    ```dotnetcli
    dotnet build
    ```

1. After the build successfully completes, run the following command to run the web app locally:

    ```dotnetcli
    dotnet run
    ```

1. If you're working on your local machine, use a browser to navigate to `http://localhost:5000`. This is the default URL for the web app hosted locally.  

If you're working in the Azure Cloud Shell, select the *Web Preview* button followed by *Configure*.  

![Locate the Web Preview button](./media/quickstarts/cloud-shell-web-preview.png)

When prompted to configure the port for preview, enter '5000' and select *Open and browse*.  The web page will read "Data from Azure App Configuration."

## Clean up resources

[!INCLUDE [azure-app-configuration-cleanup](../../includes/azure-app-configuration-cleanup.md)]

## Next steps

In this quickstart, you created a new App Configuration store and used it with an ASP.NET Core web app via the [App Configuration provider](https://go.microsoft.com/fwlink/?linkid=2074664). To learn how to configure your ASP.NET Core app to dynamically refresh configuration settings, continue to the next tutorial.

> [!div class="nextstepaction"]
> [Enable dynamic configuration](./enable-dynamic-configuration-aspnet-core.md)

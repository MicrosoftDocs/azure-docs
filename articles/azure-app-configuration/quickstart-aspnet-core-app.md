---
title: Quickstart for Azure App Configuration with ASP.NET Core | Microsoft Docs
description: Create an ASP.NET Core app with Azure App Configuration to centralize storage and management of application settings for an ASP.NET Core application.
services: azure-app-configuration
author: lisaguthrie

ms.service: azure-app-configuration
ms.devlang: csharp
ms.custom: "devx-track-csharp, contperfq1"
ms.topic: quickstart
ms.date: 09/25/2020
ms.author: lcozzens

#Customer intent: As an ASP.NET Core developer, I want to learn how to manage all my app settings in one place.
---
# Quickstart: Create an ASP.NET Core app with Azure App Configuration

In this quickstart, you'll use Azure App Configuration to centralize storage and management of application settings for an ASP.NET Core application. ASP.NET Core builds a single, key-value-based configuration object using settings from one or more data sources specified by an application. These data sources are known as *configuration providers*. Because App Configuration's .NET Core client is implemented as a configuration provider, the service appears like another data source.

## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/free/dotnet)
- [.NET Core SDK](https://dotnet.microsoft.com/download)

> [!TIP]
> The Azure Cloud Shell is a free, interactive shell that you can use to run the command line instructions in this article. It has common Azure tools preinstalled, including the .NET Core SDK. If you're logged in to your Azure subscription, launch your [Azure Cloud Shell](https://shell.azure.com) from shell.azure.com. You can learn more about Azure Cloud Shell by [reading our documentation](../cloud-shell/overview.md)

## Create an App Configuration store

[!INCLUDE[Azure App Configuration resource creation steps](../../includes/azure-app-configuration-create.md)]

1. Select **Operations** > **Configuration explorer** > **Create** > **Key-value** to add the following key-value pairs:

    | Key                                | Value                               |
    |------------------------------------|-------------------------------------|
    | `TestApp:Settings:BackgroundColor` | *#FFF*                              |
    | `TestApp:Settings:FontColor`       | *#000*                              |
    | `TestApp:Settings:FontSize`        | *24*                                |
    | `TestApp:Settings:Message`         | *Data from Azure App Configuration* |

    Leave **Label** and **Content type** empty for now. Select **Apply**.

## Create an ASP.NET Core web app

Use the [.NET Core command-line interface (CLI)](/dotnet/core/tools) to create a new ASP.NET Core MVC web app project. The [Azure Cloud Shell](https://shell.azure.com) provides these tools for you. They're also available across the Windows, macOS, and Linux platforms.

Run the following command to create an ASP.NET Core MVC project in a new *TestAppConfig* folder:

```dotnetcli
dotnet new mvc --no-https --output TestAppConfig
```

## Add Secret Manager

A tool called Secret Manager stores sensitive data for development work outside of your project tree. This approach helps prevent the accidental sharing of app secrets within source code. Complete the following steps to enable the use of Secret Manager in the project:

#### [.NET Core 3.x](#tab/core3x)

Run the following command to enable secrets storage in the project:

```dotnetcli
dotnet user-secrets init
```

A `UserSecretsId` element containing a GUID is added to the *.csproj* file:

```xml
<Project Sdk="Microsoft.NET.Sdk.Web">
    
    <PropertyGroup>
        <TargetFramework>netcoreapp3.1</TargetFramework>
        <UserSecretsId>79a3edd0-2092-40a2-a04d-dcb46d5ca9ed</UserSecretsId>
    </PropertyGroup>

</Project>
```

#### [.NET Core 2.x](#tab/core2x)

1. Open the *.csproj* file.

1. Add a `UserSecretsId` element to the *.csproj* file as shown here. You can use the same GUID, or you can replace this value with your own.

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
    
1. Save the *.csproj* file.

---

> [!TIP]
> To learn more about Secret Manager, see [Safe storage of app secrets in development in ASP.NET Core](/aspnet/core/security/app-secrets).

## Connect to an App Configuration store

1. Run the following command to add a [Microsoft.Azure.AppConfiguration.AspNetCore](https://www.nuget.org/packages/Microsoft.Azure.AppConfiguration.AspNetCore) NuGet package reference:

    ```dotnetcli
    dotnet add package Microsoft.Azure.AppConfiguration.AspNetCore
    ```

1. Run the following command in the same directory as the *.csproj* file. The command uses Secret Manager to store a secret named `ConnectionStrings:AppConfig`, which stores the connection string for your App Configuration store. Replace the `<your_connection_string>` placeholder with your App Configuration store's connection string. You can find the connection string under **Access Keys** in the Azure portal.

    ```dotnetcli
    dotnet user-secrets set ConnectionStrings:AppConfig "<your_connection_string>"
    ```

    > [!IMPORTANT]
    > Some shells will truncate the connection string unless it's enclosed in quotes. Ensure that the output of the `dotnet user-secrets` command shows the entire connection string. If it doesn't, rerun the command, enclosing the connection string in quotes.

    Secret Manager is used only to test the web app locally. When the app is deployed to [Azure App Service](https://azure.microsoft.com/services/app-service/web), use the **Connection Strings** application setting in App Service instead of Secret Manager to store the connection string.

    Access this secret using the .NET Core Configuration API. A colon (`:`) works in the configuration name with the Configuration API on all supported platforms. For more information, see [Configuration keys and values](/aspnet/core/fundamentals/configuration#configuration-keys-and-values).

1. In *Program.cs*, add a reference to the .NET Core Configuration API namespace:

    ```csharp
    using Microsoft.Extensions.Configuration;
    ```

1. Update the `CreateWebHostBuilder` method to use App Configuration by calling the `AddAzureAppConfiguration` method.

    > [!IMPORTANT]
    > `CreateHostBuilder` replaces `CreateWebHostBuilder` in .NET Core 3.x. Select the correct syntax based on your environment.

    #### [.NET Core 3.x](#tab/core3x)

    ```csharp
    public static IHostBuilder CreateHostBuilder(string[] args) =>
        Host.CreateDefaultBuilder(args)
            .ConfigureWebHostDefaults(webBuilder =>
                webBuilder.ConfigureAppConfiguration(config =>
                {
                    var settings = config.Build();
                    var connection = settings.GetConnectionString("AppConfig");
                    config.AddAzureAppConfiguration(connection);
                }).UseStartup<Startup>());
    ```

    #### [.NET Core 2.x](#tab/core2x)

    ```csharp
    public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
        WebHost.CreateDefaultBuilder(args)
            .ConfigureAppConfiguration(config =>
            {
                var settings = config.Build();
                var connection = settings.GetConnectionString("AppConfig");
                config.AddAzureAppConfiguration(connection);
            })
            .UseStartup<Startup>();
    ```

    ---

1. Open *\<app root>/Views/Home/Index.cshtml*, and replace its content with the following code:

    ```cshtml
    @using Microsoft.Extensions.Configuration
    @inject IConfiguration Configuration

    <style>
        body {
            background-color: @Configuration["TestApp:Settings:BackgroundColor"]
        }
        h1 {
            color: @Configuration["TestApp:Settings:FontColor"];
            font-size: @Configuration["TestApp:Settings:FontSize"]px;
        }
    </style>

    <h1>@Configuration["TestApp:Settings:Message"]</h1>
    ```

1. Open *\<app root>/Views/Shared/_Layout.cshtml*, and replace its content with the following code:

    ```cshtml
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

1. If you're working on your local machine, use a browser to navigate to `http://localhost:5000`. This address is the default URL for the locally hosted web app. If you're working in the Azure Cloud Shell, select the **Web Preview** button followed by **Configure**.

![Locate the Web Preview button](./media/quickstarts/cloud-shell-web-preview.png)

When prompted to configure the port for preview, enter *5000* and select **Open and browse**. The web page will read "Data from Azure App Configuration."

![Launching quickstart app](./media/quickstarts/aspnet-core-app-launch-local-before.png)

## Clean up resources

[!INCLUDE[Azure App Configuration cleanup](../../includes/azure-app-configuration-cleanup.md)]

## Next steps

In this quickstart, you created a new App Configuration store. The store was used by an ASP.NET Core web app via the [App Configuration provider](https://go.microsoft.com/fwlink/?linkid=2074664). To learn how to configure your ASP.NET Core app to dynamically refresh configuration settings, continue to the next tutorial.

> [!div class="nextstepaction"]
> [Enable dynamic configuration](./enable-dynamic-configuration-aspnet-core.md)

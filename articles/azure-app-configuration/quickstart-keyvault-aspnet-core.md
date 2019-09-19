---
title: Quickstart for Azure App Configuration Key Vault References with ASP.NET Core | Microsoft Docs
description: A quickstart for using Azure App Configuration Key Vault References with ASP.NET Core apps
services: azure-app-configuration
documentationcenter: ''
author: lisaguthrie
manager: maiye
editor: ''

ms.assetid: 
ms.service: azure-app-configuration
ms.devlang: csharp
ms.topic: quickstart
ms.tgt_pltfrm: ASP.NET Core
ms.workload: tbd
ms.date: 09/16/2019
ms.author: lcozzens

#Customer intent: As an ASP.NET Core developer, I want to access secrets stored in Key Vault alongside my regular settings stored in Azure App Configuration.
---
# Quickstart: Add Key Vault references with Azure App Configuration to an ASP.NET Core app

In this quickstart, you incorporate Azure App Configuration into an ASP.NET Core app to centralize storage and management of application settings separate from your code. ASP.NET Core builds a single key-value-based configuration object by using settings from one or more data sources that are specified by an application. These data sources are known as *configuration providers*. Because App Configuration's .NET Core client is implemented as such a provider, the service appears like another data source.

App Configuration can store settings directly. It can also store references to secrets that are in Azure Key Vault. This provides a higher level of security for sensitive data, while still allowing you to access the data through the same familiar App Configuration interface.

## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/free/)
- [.NET Core SDK](https://dotnet.microsoft.com/download)

## Create a vault

1. Select the **Create a resource** option on the upper left-hand corner of the Azure portal

    ![Output after Key Vault creation completes](./media/quickstarts/search-services.png)
2. In the Search box, enter **Key Vault**.
3. From the results list, choose **Key Vault**.
4. On the Key Vault section, choose **Create**.
5. On the **Create key vault** section provide the following information:
    - **Name**: A unique name is required. For this quickstart we use **Contoso-vault2**. 
    - **Subscription**: Choose a subscription.
    - Under **Resource Group** choose **Create new** and enter a resource group name.
    - In the **Location** pull-down menu, choose a location.
    - Leave the other options to their defaults.
6. After providing the information above, select **Create**.

At this point, your Azure account is the only one authorized to perform operations on this new vault.

![Output after Key Vault creation completes](./media/quickstarts/vault-properties.png)

## Add a secret to Key Vault

To add a secret to the vault, you just need to take a couple of additional steps. In this case, we add a message that we can use to test Key Vault retrieval. The message is called **Message** and we store the value of **Hello from Key Vault** in it.

1. On the Key Vault properties pages select **Secrets**.
2. Click on **Generate/Import**.
3. On the **Create a secret** screen choose the following values:
    - **Upload options**: Manual.
    - **Name**: Message
    - **Value**: Hello from Key Vault
    - Leave the other values to their defaults. Click **Create**.

## Create an app configuration store

[!INCLUDE [azure-app-configuration-create](../../includes/azure-app-configuration-create.md)]

6. Click **Configuration Explorer**

7. Click **+ Create** > **Key vault reference** and choose the following values:
    - **Key**: TestApp:Settings:KeyVaultMessage
    - **Label**: Leave blank
    - **Subscription**, **Resource group**, **Key vault**: Choose the options corresponding to the Key Vault that you created in the previous section.
    - **Secret**: Select the secret called **Message** that you created in the previous section.

8. Click **+ Create** > **Key-value** and create a new key-value pair:
    - **Key**: TestApp:Settings:Message
    - **Value**: Hello from Azure App Config
    - **Label** and **Content type**: Leave blank

9. Click **Apply**

## Create an ASP.NET Core web app

You use the [.NET Core command-line interface (CLI)](https://docs.microsoft.com/dotnet/core/tools/) to create a new ASP.NET Core MVC web app project. The advantage of using the .NET Core CLI over Visual Studio is that it's available across the Windows, macOS, and Linux platforms.

1. Create a new folder for your project. For this quickstart, name it *TestAppConfig*.

2. In the new folder, run the following command to create a new ASP.NET Core MVC web app project:

        dotnet new mvc

## Add Secret Manager

To use Secret Manager, add a `UserSecretsId` element to your *.csproj* file.

- Open the *.csproj* file. Add a `UserSecretsId` element as shown here. You can use the same GUID, or you can replace this value with your own. Save the file.

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

The Secret Manager tool stores sensitive data for development work outside of your project tree. This approach helps prevent the accidental sharing of app secrets within source code. For more information on Secret Manager, please see [Safe storage of app secrets in development in ASP.NET Core](https://docs.microsoft.com/aspnet/core/security/app-secrets)

## Connect to an app configuration store and a Key Vault

1. Add references to the required NuGet packages by running the following commands:

        dotnet add package Microsoft.Azure.AppConfiguration.AspNetCore --version 2.0.0-preview-009860001-1017
        dotnet add package Microsoft.Extensions.Configuration.AzureAppConfiguration --version 2.0.0-preview-009860001-1009
        dotnet add package Microsoft.Azure.KeyVault --version 3.0.4

1. Run the following command to restore packages for your project:

        dotnet restore

1. Add a secret named *ConnectionStrings:AppConfig* to Secret Manager.

    This secret contains the connection string to access your app configuration store. Replace the value in the following command with the connection string for your app configuration store.

    This command must be executed in the same directory as the *.csproj* file.

        dotnet user-secrets set ConnectionStrings:AppConfig <your_connection_string>

    > [!IMPORTANT]
    > Some shells will truncate the connection string unless it is enclosed in quotes. Ensure that the output of the `dotnet user-secrets` command shows the entire connection string. If it doesn't, rerun the command, enclosing the connection string in quotes.

1. You'll also need to create a service principal for use with authentication to KeyVault. To do this, use the Azure CLI [az ad sp create-for-rbac](/cli/azure/ad/sp?view=azure-cli-latest#az-ad-sp-create-for-rbac) command:

    ```azurecli
    az ad sp create-for-rbac -n "http://mySP" --sdk-auth
    ```

    This operation will return a series of key / value pairs. 

    ```console
    {
    "clientId": "7da18cae-779c-41fc-992e-0527854c6583",
    "clientSecret": "b421b443-1669-4cd7-b5b1-394d5c945002",
    "subscriptionId": "443e30da-feca-47c4-b68f-1636b75e16b3",
    "tenantId": "35ad10f1-7799-4766-9acf-f2d946161b77",
    "activeDirectoryEndpointUrl": "https://login.microsoftonline.com",
    "resourceManagerEndpointUrl": "https://management.azure.com/",
    "activeDirectoryGraphResourceId": "https://graph.windows.net/",
    "sqlManagementEndpointUrl": "https://management.core.windows.net:8443/",
    "galleryEndpointUrl": "https://gallery.azure.com/",
    "managementEndpointUrl": "https://management.core.windows.net/"
    }
    ```

1. Run the following command to allow the service principal to access your key vault:
        az keyvault set-policy -n <your-unique-keyvault-name> --spn <clientId-of-your-service-principal> --secret-permissions delete get list set --key-permissions create decrypt delete encrypt get list unwrapKey wrapKey

1. Run the following commands to store the *clientId* and *clientSecret* in Secrets Manager:

        dotnet user-secrets set ConnectionStrings:KeyVaultClientId <clientId-of-your-service-principal>
        dotnet user-secrets set ConnectionStrings:KeyVaultClientSecret <clientSecret-of-your-service-principal>

Secret Manager is used only to test the web app locally. When the app is deployed to [Azure App Service](https://azure.microsoft.com/services/app-service/web), for example, you use an application setting **Connection Strings** in App Service instead of with Secret Manager to store the connection string.

This secret is accessed with the configuration API. A colon (:) works in the configuration name with the configuration API on all supported platforms. See [Configuration by environment](https://docs.microsoft.com/aspnet/core/fundamentals/configuration/index?tabs=basicconfiguration&view=aspnetcore-2.0).


## Update your code to pull settings from Azure App Config

1. Open *Program.cs*, and add references to required packages.

    ```csharp
    using Microsoft.Extensions.Configuration.AzureAppConfiguration;
    using Microsoft.Azure.KeyVault;
    using Microsoft.IdentityModel.Clients.ActiveDirectory;
    ```

1. Update the `CreateWebHostBuilder` method to use App Configuration by calling the `config.AddAzureAppConfiguration()` method. Include the `UseAzureKeyVault` option, passing in a new `KeyVaultClient` reference to your Key Vault.

    ```csharp
    public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
        WebHost.CreateDefaultBuilder(args)
            .ConfigureAppConfiguration((hostingContext, config) =>
            {
                var settings = config.Build();

                KeyVaultClient kvClient = new KeyVaultClient(async (authority, resource, scope) =>
                {
                    var adCredential = new ClientCredential(settings["ConnectionStrings:KeyVaultClientId"], settings["ConnectionStrings:KeyVaultClientSecret"]);
                    var authenticationContext = new AuthenticationContext(authority, null);
                    return (await authenticationContext.AcquireTokenAsync(resource, adCredential)).AccessToken;
                });

                config.AddAzureAppConfiguration(options => {
                    options.Connect(settings["ConnectionStrings:AppConfig"])
                            .UseAzureKeyVault(kvClient); });
            })
            .UseStartup<Startup>();
    ```

1. Open *Index.cshtml* in the Views > Home directory, and replace its content with the following code:

    ```html
    @using Microsoft.Extensions.Configuration
    @inject IConfiguration Configuration

    <h1>@Configuration["TestApp:Settings:Message"] and @Configuration["TestApp:Settings:KeyVaultMessage"]</h1>
    ```

1. Open *_Layout.cshtml* in the Views > Shared directory, and replace its content with the following code:

    ```html
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

1. To build the app by using the .NET Core CLI, run the following command in the command shell:

        dotnet build

2. After the build successfully completes, run the following command to run the web app locally:

        dotnet run

3. Open a browser window, and go to `http://localhost:5000`, which is the default URL for the web app hosted locally.

## Clean up resources

[!INCLUDE [azure-app-configuration-cleanup](../../includes/azure-app-configuration-cleanup.md)]

## Next steps

In this quickstart, you created a new app configuration store and used it with an ASP.NET Core web app via the [App Configuration provider](https://go.microsoft.com/fwlink/?linkid=2074664). To learn more about how to use App Configuration, continue to the next tutorial that demonstrates how to configure your web app to dynamically refresh configuration settings.

> [!div class="nextstepaction"]
> [Use dynamic configuration in an ASP.NET Core app](./enable-dynamic-configuration-aspnet-core.md)

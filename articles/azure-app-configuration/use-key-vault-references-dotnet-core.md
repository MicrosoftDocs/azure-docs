---
title: Tutorial for using Azure App Configuration Key Vault references in an ASP.NET Core app | Microsoft Docs
description: In this tutorial, you learn how to use Azure App Configuration's Key Vault references from an ASP.NET Core app
services: azure-app-configuration
documentationcenter: ''
author: lisaguthrie
manager: maiye
editor: ''

ms.assetid: 
ms.service: azure-app-configuration
ms.workload: tbd
ms.devlang: csharp
ms.topic: tutorial
ms.date: 10/07/2019
ms.author: lcozzens
ms.custom: mvc

#Customer intent: I want to update my ASP.NET Core application to reference values stored in Key Vault through App Configuration.
---
# Tutorial: Use Key Vault references in an ASP.NET Core app

In this tutorial, you'll learn how to use the Azure App Configuration service together with Azure Key Vault. These are complementary services, which will be used side by side in most application deployments. To help you use them together, App Configuration allows you to create keys that reference values stored in Key Vault. When you do this, App Configuration stores the URI to the Key Vault value, rather than the value itself. Your application retrieves the value of this key using the App Configuration client provider, just like any other key stored in App Configuration. The client provider recognizes it as a Key Vault reference, and calls out to Key Vault to retrieve the value. Your application is responsible for authenticating properly to both App Configuration and Key Vault. The two services don't communicate directly.

This tutorial shows how you can implement Key Vault references in your code. It builds on the web app introduced in the quickstarts. Before you continue, finish [Create an ASP.NET Core app with App Configuration](./quickstart-aspnet-core-app.md) first.

You can use any code editor to do the steps in this tutorial. [Visual Studio Code](https://code.visualstudio.com/) is an excellent option that's available on the Windows, macOS, and Linux platforms.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create an App Config key that references a value stored in Key Vault
> * Access the value of this key from an ASP.NET Core web application

## Prerequisites

To do this tutorial, install the [.NET Core SDK](https://dotnet.microsoft.com/download).

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Create a vault

1. Select the **Create a resource** option on the upper left-hand corner of the Azure portal

    ![Output after Key Vault creation completes](./media/quickstarts/search-services.png)
2. In the Search box, enter **Key Vault**.
3. From the results list, choose **Key Vault**.
4. On the Key Vault section, choose **Create**.
5. On the **Create key vault** section provide the following information:
    - **Name**: A unique name is required. For this quickstart, we use **Contoso-vault2**. 
    - **Subscription**: Choose a subscription.
    - Under **Resource Group**, choose **Create new** and enter a resource group name.
    - In the **Location** pull-down menu, choose a location.
    - Leave the other options to their defaults.
6. After providing the information above, select **Create**.

At this point, your Azure account is the only one authorized to access this new vault.

![Output after Key Vault creation completes](./media/quickstarts/vault-properties.png)

## Add a secret to Key Vault

To add a secret to the vault, you just need to take a couple of additional steps. In this case, we add a message that we can use to test Key Vault retrieval. The message is called **Message** and we store the value of **Hello from Key Vault** in it.

1. On the Key Vault properties pages, select **Secrets**.
1. Click on **Generate/Import**.
1. On the **Create a secret** screen choose the following values:
    - **Upload options**: Manual.
    - **Name**: Message
    - **Value**: Hello from Key Vault
    - Leave the other values to their defaults. Click **Create**.

## Add a Key Vault reference to App Config

1. Sign in to the [Azure portal](https://portal.azure.com). Select **All resources**, and select the app configuration store instance that you created in the quickstart.

1. Click **Configuration Explorer**

1. Click **+ Create** > **Key vault reference** and choose the following values:
    - **Key**: TestApp:Settings:KeyVaultMessage
    - **Label**: Leave blank
    - **Subscription**, **Resource group**, **Key vault**: Choose the options corresponding to the Key Vault that you created in the previous section.
    - **Secret**: Select the secret called **Message** that you created in the previous section.

## Connect to Key Vault

1. For this tutorial, you'll use a service principal for authentication to KeyVault. To create this service principal, use the Azure CLI [az ad sp create-for-rbac](/cli/azure/ad/sp?view=azure-cli-latest#az-ad-sp-create-for-rbac) command:

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

1. Add secrets for *clientId* and *clientSecret* to Secrets Manager. These commands must be executed in the same directory as the *.csproj* file.

        dotnet user-secrets set ConnectionStrings:KeyVaultClientId <clientId-of-your-service-principal>        
        dotnet user-secrets set ConnectionStrings:KeyVaultClientSecret <clientSecret-of-your-service-principal>

> [!NOTE]
> These Key Vault credentials are used only within your application. Your application authenticates directly to Key Vault with these credentials. They are never passed to the App Configuration service.

## Update your code to use a Key Vault reference

1. Open *Program.cs*, and add references to required packages.

    ```csharp
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

1. Once you've passed the *KeyVaultClient* reference to the `UseAzureKeyVault` method when initializing the connection to App Config, you can access the values of Key Vault references in the same way you access the values of regular App Config keys. To see this process in action, open *Index.cshtml* in the Views > Home directory. Replace its content with the following code:

    ```html
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

    <h1>@Configuration["TestApp:Settings:Message"]
        and @Configuration["TestApp:Settings:KeyVaultMessage"]</h1>
    ```

    You access the value of the Key Vault reference *TestApp:Settings:KeyVaultMessage* in the same way as the configuration value *TestApp:Settings:Message*

## Build and run the app locally

1. To build the app by using the .NET Core CLI, run the following command in the command shell:

        dotnet build

2. After the build successfully completes, run the following command to run the web app locally:

        dotnet run

3. Open a browser window, and go to `http://localhost:5000`, which is the default URL for the web app hosted locally.

    ![Quickstart app launch local](./media/key-vault-reference-launch-local.png)


## Clean up resources

[!INCLUDE [azure-app-configuration-cleanup](../../includes/azure-app-configuration-cleanup.md)]

## Next steps

In this tutorial, you added an Azure managed service identity to streamline access to App Configuration and improve credential management for your app. To learn more about how to use App Configuration, continue to the Azure CLI samples.

> [!div class="nextstepaction"]
> [CLI samples](./cli-samples.md)

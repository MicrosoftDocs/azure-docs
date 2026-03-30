---
title: "Tutorial: Use Key Vault References in an ASP.NET Core App"
description: Find out how to use the Azure App Configuration client provider in an ASP.NET Core app to retrieve Azure Key Vault references.
services: azure-app-configuration
author: maud-lv
ms.service: azure-app-configuration
ms.devlang: csharp
ms.topic: tutorial
ms.date: 07/17/2025
ms.author: zhiyuanliang
ms.custom:
  - devx-track-csharp
  - mvc
  - devx-track-dotnet
  - sfi-ropc-nochange
# customer intent: As a developer, I want to use the Azure App Configuration client provider in an ASP.NET Core app to retrieve Azure Key Vault references so that I can improve the security of sensitive data while also using a centralized way to access that data.
---
# Tutorial: Use Key Vault references in an ASP.NET Core app

In this tutorial, you use the Azure App Configuration service together with Azure Key Vault. App Configuration and Key Vault are complementary services used side by side in most application deployments.

Your application can use the App Configuration client provider to retrieve Key Vault references, just as it does for any other keys stored in App Configuration. When you add a Key Vault reference to App Configuration, App Configuration creates a key that references the value stored in Key Vault. The value that App Configuration stores isn't a Key Vault value or credential. Instead, it's a URI that references the value in Key Vault. Because the client provider recognizes the key as a Key Vault reference, it uses Key Vault to retrieve its value.

Your application is responsible for authenticating properly to both App Configuration and Key Vault. The two services don't communicate directly.

This tutorial shows you how to implement Key Vault references in your code. It builds on the web app introduced in the ASP.NET Core quickstart listed in the prerequisites. Before you continue, complete that [quickstart](./quickstart-aspnet-core-app.md).

You can use any code editor to do the steps in this tutorial. For example, [Visual Studio Code](https://code.visualstudio.com/) is a cross-platform code editor that's available for the Windows, macOS, and Linux operating systems.

In this tutorial, you:

> [!div class="checklist"]
> * Create an App Configuration key that references a value stored in Key Vault.
> * Access the value of this key from an ASP.NET Core web application.

## Prerequisites

Finish the [Create an ASP.NET Core app with App Configuration](./quickstart-aspnet-core-app.md) quickstart.

## Create a key vault

1. Go to the [Azure portal](https://portal.azure.com/#home), and then select **Create a resource**.

   :::image type="content" source="./media/quickstarts/search-services.png" alt-text="Screenshot of the Azure portal. Under Azure services, Create a resource is highlighted, and icons for several resource types are pictured." lightbox="./media/quickstarts/search-services.png":::

1. In the search box, enter **Key Vault**. In the result list, select **Key Vault**.

1. On the **Key Vault** page, select **Create**.

1. On the **Create a key vault** page, enter the following information:
   - For **Subscription**: Select a subscription.
   - For **Resource group**: Enter the name of an existing resource group or select **Create new** and enter a resource group name.
   - For **Key vault name**: Enter a unique name.
   - For **Region**: Select a location.

1. For the other options, use the default values.

1. Select **Review + create**.

1. After the system validates and displays your inputs, select **Create**.

At this point, your Azure account is the only one authorized to access this new vault.

## Add a secret to Key Vault

To test Key Vault retrieval in your app, first add a secret to the vault by taking the following steps. The secret that you add is called **Message**, and its value is "Hello from Key Vault."

1. On the Key Vault resource menu, select **Objects** > **Secrets**.

1. Select **Generate/Import**.

1. In the **Create a secret** dialog, enter the following values:
   - For **Upload options**: Enter **Manual**.
   - For **Name**: Enter **Message**.
   - For **Secret value**: Enter **Hello from Key Vault**.

1. For the other options, use the default values.

1. Select **Create**.

## Add a Key Vault reference to App Configuration

1. Sign in to the [Azure portal](https://portal.azure.com). Select **All resources**, and then select the App Configuration store that you create in the [quickstart](./quickstart-aspnet-core-app.md).

1. Select **Configuration explorer**.

1. Select **Create** > **Key Vault reference**, and then enter the following values:
   - For **Key**: Enter **TestApp:Settings:KeyVaultMessage**.
   - For **Label**: Leave the value blank.
   - For **Subscription**, **Resource group**, and **Key Vault**: Enter the values you use when you create the key vault earlier in this tutorial.
   - For **Secret**: Select the secret named **Message** that you create in the previous section.

   :::image type="content" source="./media/create-key-vault-reference.png" alt-text="Screenshot of the dialog for creating a Key Vault reference. The Key, Subscription, Resource group, Key Vault, and Secret fields are populated.":::

## Update your code to use a Key Vault reference

1. Go to the folder that contains the ASP.NET Core web app project that you created in the [quickstart](./quickstart-aspnet-core-app.md).

1. At a command prompt, run the following command. This command adds the `Azure.Identity` NuGet package reference to your project file or updates it.

   ```dotnetcli
   dotnet add package Azure.Identity
   ```

1. Open *Program.cs*. In the `using` directive section, add the following line to import the types from the `Azure.Identity` namespace:

   ```csharp
   using Azure.Identity;
   ```

1. In *Program.cs*, replace the call to the `AddAzureAppConfiguration` method with the call in the following code. The updated call includes the `ConfigureKeyVault` option. This option uses the `SetCredential` method to pass the credentials needed to authenticate with your key vault.

   ```csharp
   var builder = WebApplication.CreateBuilder(args);

   // Retrieve the App Configuration endpoint.
   string endpoint = builder.Configuration.GetValue<string>("Endpoints:AppConfiguration")

   // Load the configuration from App Configuration.
   builder.Configuration.AddAzureAppConfiguration(options =>
   {
       options.Connect(new Uri(endpoint), new DefaultAzureCredential());

       options.ConfigureKeyVault(keyVaultOptions =>
       {
           keyVaultOptions.SetCredential(new DefaultAzureCredential());
       });
   });
   ```
    
   > [!TIP]
   > If you have multiple key vaults, the system uses the same credential for all of them. If your key vaults require different credentials, you can set them by using the `Register` or `SetSecretResolver` methods of the [`AzureAppConfigurationKeyVaultOptions`](/dotnet/api/microsoft.extensions.configuration.azureappconfiguration.azureappconfigurationkeyvaultoptions) class.

1. To access the values of Key Vault references in your code, go to the *Pages* folder in your project. Open *Index.cshtml* and replace its contents with the following code. The code in the previous block initializes the App Configuration connection and sets up the Key Vault connection. As a result, in *Index.cshtml*, you can access the values of Key Vault references the same way you access the values of regular App Configuration keys.

   ```html
   @page
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

   <h1>@Configuration["TestApp:Settings:Message"]
       and @Configuration["TestApp:Settings:KeyVaultMessage"]</h1>
   ```

   This code accesses the value of the Key Vault reference `TestApp:Settings:KeyVaultMessage` in the same way it accesses the configuration value of `TestApp:Settings:Message`.

## Grant your app access to Key Vault

App Configuration doesn't access your key vault. Instead, your app reads from Key Vault directly, so you need to grant your app access to the secrets in your key vault. This way, the secrets always stay with your app. You can use a [Key Vault access policy](/azure/key-vault/general/assign-access-policy) or [Azure role-based access control](/azure/key-vault/general/rbac-guide) to grant the access.

The code in this tutorial uses the `DefaultAzureCredential` class for authentication. This aggregated token credential automatically tries several credential types, like `EnvironmentCredential`, `ManagedIdentityCredential`, `SharedTokenCacheCredential`, and `VisualStudioCredential`. For more information, see [DefaultAzureCredential Class](/dotnet/api/azure.identity.defaultazurecredential). 

You can replace `DefaultAzureCredential` with any explicit credential type. However, when you use `DefaultAzureCredential`, your code can run in local and Azure environments. For example, when your app runs in Azure, `DefaultAzureCredential` uses `ManagedIdentityCredential`. But when you use Visual Studio for local development, `DefaultAzureCredential` automatically falls back to `SharedTokenCacheCredential` or `VisualStudioCredential`.

Alternatively, you can set the `AZURE_TENANT_ID`, `AZURE_CLIENT_ID`, and `AZURE_CLIENT_SECRET` environment variables. When you do, `DefaultAzureCredential` uses these variables and `EnvironmentCredential` to authenticate with your key vault.

After you deploy your app to an Azure service with managed identity enabled, such as Azure App Service, Azure Kubernetes Service, or Azure Container Instance, you grant the managed identity of the Azure service permission to access your key vault. `DefaultAzureCredential` automatically uses `ManagedIdentityCredential` when your app is running in Azure. You can use the same managed identity to authenticate with both App Configuration and Key Vault. For more information, see [Use managed identities to access App Configuration](howto-integrate-azure-managed-service-identity.md).

## Build and run the app locally

1. To build the app by using the .NET CLI, run the following command at a command prompt:

   ```dotnetcli
   dotnet build
   ```

1. After the build is complete, use the following command to run the web app locally:

   ```dotnetcli
   dotnet run
   ```

1. In the output of the `dotnet run` command, find a URL that the web app is listening on, such as `http://localhost:5292`. Open a browser and go to that URL.

   :::image type="content" source="./media/key-vault-reference-launch-local.png" alt-text="Screenshot of a browser open to localhost:5292. Text on the page states Data from Azure App Configuration and Hello from Key Vault.":::

   The text on the webpage includes the following components:

   - The value that's associated with the `TestApp:Settings:Message` key in your App Configuration store
   - The value of the **Message** secret stored in your key vault

## Clean up resources

[!INCLUDE [azure-app-configuration-cleanup](../../includes/azure-app-configuration-cleanup.md)]

## Next steps

> [!div class="nextstepaction"]
> [Reload secrets and certificates from Key Vault automatically](./reload-key-vault-secrets-dotnet.md)

> [!div class="nextstepaction"]
> [Use managed identities to streamline access to App Configuration and Key Vault](./howto-integrate-azure-managed-service-identity.md)

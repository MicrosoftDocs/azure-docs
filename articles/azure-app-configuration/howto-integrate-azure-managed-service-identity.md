---
title: Use managed identities to access App Configuration
titleSuffix: Azure App Configuration
description: Authenticate to Azure App Configuration using managed identities
author: AlexandraKemperMS
ms.author: alkemper
ms.service: azure-app-configuration
ms.custom: devx-track-csharp, fasttrack-edit
ms.topic: conceptual
ms.date: 04/08/2021
---
# Use managed identities to access App Configuration

Azure Active Directory [managed identities](../active-directory/managed-identities-azure-resources/overview.md) simplify secrets management for your cloud application. With a managed identity, your code can use the service principal created for the Azure service it runs on. You use a managed identity instead of a separate credential stored in Azure Key Vault or a local connection string.

Azure App Configuration and its .NET Core, .NET Framework, and Java Spring client libraries have managed identity support built into them. Although you aren't required to use it, the managed identity eliminates the need for an access token that contains secrets. Your code can access the App Configuration store using only the service endpoint. You can embed this URL in your code directly without exposing any secret.

This article shows how you can take advantage of the managed identity to access App Configuration. It builds on the web app introduced in the quickstarts. Before you continue,  [Create an ASP.NET Core app with App Configuration](./quickstart-aspnet-core-app.md) first.

> [!IMPORTANT]
> Managed Identity cannot be used to authenticate locally-running applications. Your application must be deployed to an Azure service that supports Managed Identity. This article uses Azure App Service as an example, but the same concept applies to any other Azure service that supports managed identity, for example, [Azure Kubernetes Service](../aks/use-azure-ad-pod-identity.md), [Azure Virtual Machine](../active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm.md), and [Azure Container Instances](../container-instances/container-instances-managed-identity.md). If your workload is hosted in one of those services, you can leverage the service's managed identity support, too.

You can use any code editor to do the steps in this tutorial. [Visual Studio Code](https://code.visualstudio.com/) is an excellent option available on the Windows, macOS, and Linux platforms.

In this article, you learn how to:

> [!div class="checklist"]
> * Grant a managed identity access to App Configuration.
> * Configure your app to use a managed identity when you connect to App Configuration.


## Prerequisites

To complete this tutorial, you must have:

* [.NET Core SDK](https://dotnet.microsoft.com/download).
* [Azure Cloud Shell configured](../cloud-shell/quickstart.md).

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Add a managed identity

To set up a managed identity in the portal, you first create an application and then enable the feature.

1. Access your App Services resource in the [Azure portal](https://portal.azure.com). If you don't have an existing App Services resource to work with, create one. 

1. Scroll down to the **Settings** group in the left pane, and select **Identity**.

1. On the **System assigned** tab, switch **Status** to **On** and select **Save**.

1. Answer **Yes** when prompted to enable system assigned managed identity.

    ![Set managed identity in App Service](./media/set-managed-identity-app-service.png)

## Grant access to App Configuration

1. In the [Azure portal](https://portal.azure.com), select **All resources** and select the App Configuration store that you created in the quickstart.

1. Select **Access control (IAM)**.

1. On the **Check access** tab, select **Add** in the **Add role assignment** card UI.

1. Under **Role**, select **App Configuration Data Reader**. Under **Assign access to**, select **App Service** under **System assigned managed identity**.

1. Under **Subscription**, select your Azure subscription. Select the App Service resource for your app.

1. Select **Save**.

    ![Add a managed identity](./media/add-managed-identity.png)


## Use a managed identity

1. Add a reference to the *Azure.Identity* package:

    ```bash
    dotnet add package Azure.Identity
    ```

1. Find the endpoint to your App Configuration store. This URL is listed on the **Access keys** tab for the store in the Azure portal.

1. Open *appsettings.json*, and add the following script. Replace *\<service_endpoint>*, including the brackets, with the URL to your App Configuration store.

    ```json
    "AppConfig": {
        "Endpoint": "<service_endpoint>"
    }
    ```

1. Open *Program.cs*, and add a reference to the `Azure.Identity` and `Microsoft.Azure.Services.AppAuthentication` namespaces:

    ```csharp-interactive
    using Azure.Identity;
    ```

1. If you wish to access only values stored directly in App Configuration, update the `CreateWebHostBuilder` method by replacing the `config.AddAzureAppConfiguration()` method (this is found in the `Microsoft.Azure.AppConfiguration.AspNetCore` package).

    > [!IMPORTANT]
    > `CreateHostBuilder` replaces `CreateWebHostBuilder` in .NET Core 3.0.  Select the correct syntax based on your environment.

    ### [.NET Core 5.x](#tab/core5x)

    ```csharp
    public static IHostBuilder CreateHostBuilder(string[] args) =>
        Host.CreateDefaultBuilder(args)
            .ConfigureWebHostDefaults(webBuilder =>
                webBuilder.ConfigureAppConfiguration((hostingContext, config) =>
                {
                    var settings = config.Build();
                    config.AddAzureAppConfiguration(options =>
                        options.Connect(new Uri(settings["AppConfig:Endpoint"]), new ManagedIdentityCredential()));
                })
                .UseStartup<Startup>());
    ```

    ### [.NET Core 3.x](#tab/core3x)

    ```csharp
    public static IHostBuilder CreateHostBuilder(string[] args) =>
        Host.CreateDefaultBuilder(args)
            .ConfigureWebHostDefaults(webBuilder =>
                webBuilder.ConfigureAppConfiguration((hostingContext, config) =>
                {
                    var settings = config.Build();
                    config.AddAzureAppConfiguration(options =>
                        options.Connect(new Uri(settings["AppConfig:Endpoint"]), new ManagedIdentityCredential()));
                })
                .UseStartup<Startup>());
    ```

    ### [.NET Core 2.x](#tab/core2x)

    ```csharp
    public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
        WebHost.CreateDefaultBuilder(args)
               .ConfigureAppConfiguration((hostingContext, config) =>
               {
                   var settings = config.Build();
                   config.AddAzureAppConfiguration(options =>
                       options.Connect(new Uri(settings["AppConfig:Endpoint"]), new ManagedIdentityCredential()));
               })
               .UseStartup<Startup>();
    ```

    ---

    > [!NOTE]
    > If you want to use a **user-assigned managed identity**, be sure to specify the clientId when creating the [ManagedIdentityCredential](/dotnet/api/azure.identity.managedidentitycredential).
    >```csharp
    >config.AddAzureAppConfiguration(options =>
    >       {
    >           options.Connect(new Uri(settings["AppConfig:Endpoint"]), new ManagedIdentityCredential("<your_clientId>"))
    >        });
    >```
    >As explained in the [Managed Identities for Azure resources FAQs](../active-directory/managed-identities-azure-resources/known-issues.md), there is a default way to resolve which managed identity is used. In this case, the Azure Identity library enforces you to specify the desired identity to avoid posible runtime issues in the future (for instance, if a new user-assigned managed identity is added or if the system-assigned managed identity is enabled). So, you will need to specify the clientId even if only one user-assigned managed identity is defined, and there is no system-assigned managed identity.
 
    

## Deploy your application

Using managed identities requires you to deploy your app to an Azure service. Managed identities can't be used for authentication of locally-running apps. To deploy the .NET Core app that you created in the [Create an ASP.NET Core app with App Configuration](./quickstart-aspnet-core-app.md) quickstart and modified to use managed identities, follow the guidance in [Publish your web app](../app-service/quickstart-dotnetcore.md?pivots=development-environment-vs&tabs=netcore31#publish-your-web-app).

In addition to App Service, many other Azure services support managed identities. For more information, see [Services that support managed identities for Azure resources](../active-directory/managed-identities-azure-resources/services-support-managed-identities.md).

## Clean up resources

[!INCLUDE [azure-app-configuration-cleanup](../../includes/azure-app-configuration-cleanup.md)]

## Next steps
In this tutorial, you added an Azure managed identity to streamline access to App Configuration and improve credential management for your app. To learn more about how to use App Configuration, continue to the Azure CLI samples.

> [!div class="nextstepaction"]
> [CLI samples](./cli-samples.md)
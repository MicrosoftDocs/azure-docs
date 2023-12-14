---
title: Use managed identities to access App Configuration
titleSuffix: Azure App Configuration
description: Authenticate to Azure App Configuration using managed identities
author: maud-lv
ms.author: malev
ms.service: azure-app-configuration
ms.custom: devx-track-csharp, fasttrack-edit, subject-rbac-steps, devdivchpfy22
ms.topic: conceptual
ms.date: 07/11/2023
zone_pivot_groups: appconfig-provider
---
# Use managed identities to access App Configuration

Microsoft Entra [managed identities](../active-directory/managed-identities-azure-resources/overview.md) simplify secrets management for your cloud application. With a managed identity, your code can use the service principal created for the Azure service it runs on. You use a managed identity instead of a separate credential stored in Azure Key Vault or a local connection string.

Azure App Configuration and its .NET, .NET Framework, and Java Spring client libraries have managed identity support built into them. Although you aren't required to use it, the managed identity eliminates the need for an access token that contains secrets. Your code can access the App Configuration store using only the service endpoint. You can embed this URL in your code directly without exposing any secret.

:::zone target="docs" pivot="framework-dotnet"

This article shows how you can take advantage of the managed identity to access App Configuration. It builds on the web app introduced in the quickstarts. Before you continue, [Create an ASP.NET Core app with App Configuration](./quickstart-aspnet-core-app.md) first.

:::zone-end

:::zone target="docs" pivot="framework-spring"

This article shows how you can take advantage of the managed identity to access App Configuration. It builds on the web app introduced in the quickstarts. Before you continue, [Create a Java Spring app with Azure App Configuration](./quickstart-java-spring-app.md) first.

:::zone-end

> [!IMPORTANT]
> Managed identity can't be used to authenticate locally running applications. Your application must be deployed to an Azure service that supports Managed Identity. This article uses Azure App Service as an example. However, the same concept applies to any other Azure service that supports managed identity. For example, [Azure Kubernetes Service](../aks/use-azure-ad-pod-identity.md), [Azure Virtual Machine](../active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm.md), and [Azure Container Instances](../container-instances/container-instances-managed-identity.md). If your workload is hosted in one of those services, you can also leverage the service's managed identity support.

You can use any code editor to do the steps in this tutorial. [Visual Studio Code](https://code.visualstudio.com/) is an excellent option available on the Windows, macOS, and Linux platforms.

In this article, you learn how to:

> [!div class="checklist"]
> * Grant a managed identity access to App Configuration.
> * Configure your app to use a managed identity when you connect to App Configuration.

## Prerequisites

To complete this tutorial, you must have:

:::zone target="docs" pivot="framework-dotnet"

* [.NET SDK](https://dotnet.microsoft.com/download).
* [Azure Cloud Shell configured](../cloud-shell/quickstart.md).

:::zone-end

:::zone target="docs" pivot="framework-spring"

* Azure subscription - [create one for free](https://azure.microsoft.com/free/)
* A supported [Java Development Kit (JDK)](/java/azure/jdk) with version 11.
* [Apache Maven](https://maven.apache.org/download.cgi) version 3.0 or above.

:::zone-end

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Add a managed identity

To set up a managed identity in the portal, you first create an application and then enable the feature.

1. Access your App Services resource in the [Azure portal](https://portal.azure.com). If you don't have an existing App Services resource to use, create one.

1. Scroll down to the **Settings** group in the left pane, and select **Identity**.

1. On the **System assigned** tab, switch **Status** to **On** and select **Save**.

1. When prompted, answer **Yes** to turn on the system-assigned managed identity.

    :::image type="content" source="./media/add-managed-identity-app-service.png" alt-text="Screenshot of how to add a managed identity in App Service.":::

## Grant access to App Configuration

The following steps describe how to assign the App Configuration Data Reader role to App Service. For detailed steps, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md).

1. In the [Azure portal](https://portal.azure.com), select **All resources** and select the App Configuration store that you created in the [quickstart](../azure-app-configuration/quickstart-azure-functions-csharp.md).

1. Select **Access control (IAM)**.

1. Select **Add** > **Add role assignment**.

    :::image type="content" source="../../includes/role-based-access-control/media/add-role-assignment-menu.png" alt-text="Screenshot that shows the Access control (IAM) page with Add role assignment menu open.":::

   If you don't have permission to assign roles, then the **Add role assignment** option will be disabled. For more information, see [Azure built-in roles](../role-based-access-control/built-in-roles.md).

1. On the **Role** tab, select the **App Configuration Data Reader** role and then select **Next**.

    :::image type="content" source="../../includes/role-based-access-control/media/select-role-assignment-generic.png" alt-text="Screenshot that shows the Add role assignment page with Role tab selected.":::

1. On the **Members** tab, select **Managed identity** and then select **Select members**.

    :::image type="content" source="../../includes/role-based-access-control/media/add-members.png" alt-text="Screenshot that shows the Add role assignment page with Members tab selected.":::

1. Select your Azure subscription, for Managed identity select **App Service**, then select your App Service name.

    :::image type="content" source="../../includes/role-based-access-control/media/select-managed-identity-members.png" alt-text="Screenshot that shows the select managed identities page.":::

1. On the **Review + assign** tab, select **Review + assign** to assign the role.

## Use a managed identity

:::zone target="docs" pivot="framework-dotnet"

1. Add a reference to the `Azure.Identity` package:

    ```bash
    dotnet add package Azure.Identity
    ```

1. Find the endpoint to your App Configuration store. This URL is listed on the **Access keys** tab for the store in the Azure portal.

1. Open the *appsettings.json* file and add the following script. Replace *\<service_endpoint>*, including the brackets, with the URL to your App Configuration store.

    ```json
    "AppConfig": {
        "Endpoint": "<service_endpoint>"
    }
    ```

1. Open the *Program.cs* file and add a reference to the `Azure.Identity` and `Microsoft.Azure.Services.AppAuthentication` namespaces:

    ```csharp-interactive
    using Azure.Identity;
    ```

1. To access values stored in App Configuration, update the `Builder` configuration to use the `AddAzureAppConfiguration()` method.

    ### [.NET 6.0+](#tab/core6x)

    ```csharp
    var builder = WebApplication.CreateBuilder(args);

    builder.Configuration.AddAzureAppConfiguration(options =>
        options.Connect(
            new Uri(builder.Configuration["AppConfig:Endpoint"]),
            new ManagedIdentityCredential()));
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

    ---

    > [!NOTE]
    > If you want to use a **user-assigned managed identity**, be sure to specify the `clientId` when creating the [ManagedIdentityCredential](/dotnet/api/azure.identity.managedidentitycredential).
    >```csharp
    >new ManagedIdentityCredential("<your_clientId>")
    >```
    >As explained in the [Managed Identities for Azure resources FAQs](../active-directory/managed-identities-azure-resources/known-issues.md), there is a default way to resolve which managed identity is used. In this case, the Azure Identity library enforces you to specify the desired identity to avoid possible runtime issues in the future. For instance, if a new user-assigned managed identity is added or if the system-assigned managed identity is enabled. So, you will need to specify the `clientId` even if only one user-assigned managed identity is defined, and there is no system-assigned managed identity.

:::zone-end

:::zone target="docs" pivot="framework-spring"

1. Find the endpoint to your App Configuration store. This URL is listed on the **Overview** tab for the store in the Azure portal.

1. Open `bootstrap.properties`, remove the connection-string property and replace it with endpoint for System Assigned Identity:

```properties
spring.cloud.azure.appconfiguration.stores[0].endpoint=<service_endpoint>
```

for User Assigned Identity:

```properties
spring.cloud.azure.appconfiguration.stores[0].endpoint=<service_endpoint>
spring.cloud.azure.credential.managed-identity-enabled= true
spring.cloud.azure.credential.client-id= <client_id>
```

> [!NOTE]
> For more information see [Spring Cloud Azure authentication](/azure/developer/java/spring-framework/authentication).

:::zone-end

## Deploy your application

:::zone target="docs" pivot="framework-dotnet"

You must deploy your app to an Azure service when you use managed identities. Managed identities can't be used for authentication of locally running apps. To deploy the .NET Core app that you created in the [Create an ASP.NET Core app with App Configuration](./quickstart-aspnet-core-app.md) quickstart and modified to use managed identities, follow the guidance in [Publish your web app](../app-service/quickstart-dotnetcore.md?pivots=development-environment-vs&tabs=netcore31#2-publish-your-web-app).

:::zone-end

:::zone target="docs" pivot="framework-spring"

Using managed identities requires you to deploy your app to an Azure service. Managed identities can't be used for authentication of locally running apps. To deploy the Spring app that you created in the [Create a Java Spring app with Azure App Configuration](./quickstart-java-spring-app.md) quickstart and modified to use managed identities, follow the guidance in [Publish your web app](../app-service/quickstart-java.md?tabs=javase&pivots=platform-linux).

:::zone-end

In addition to App Service, many other Azure services support managed identities. For more information, see [Services that support managed identities for Azure resources](../active-directory/managed-identities-azure-resources/services-support-managed-identities.md).

## Clean up resources

[!INCLUDE [azure-app-configuration-cleanup](../../includes/azure-app-configuration-cleanup.md)]

## Next steps

In this tutorial, you added an Azure managed identity to streamline access to App Configuration and improve credential management for your app. To learn more about how to use App Configuration, continue to the Azure CLI samples.

> [!div class="nextstepaction"]
> [CLI samples](./cli-samples.md)

---
title: 'Tutorial: Store Service Connector configuration in App Configuration'
description: Learn how to use Service Connector to connect Azure services and store the connection configuration in an Azure App Configuration store.
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: tutorial
ms.date: 04/28/2026
ms.custom: sfi-image-nochange
#customer intent: As an app developer who uses other related Azure services, I want to learn how to store my Service Connector configurations in App Configuration so I can better support my Infrastructure as Code tools.
---

# Tutorial: Store Service Connector configuration in App Configuration

[Azure App Configuration](/azure/azure-app-configuration/overview) is a cloud service that provides a central store for managing application settings. When you [use Service Connector to create a service connection](quickstart-portal-app-service-connection.md), you can store your connection configuration in App Configuration. Storing configuration settings in the App Configuration store naturally supports Infrastructure as Code tools.

 In this tutorial, you use Service Connector and App Configuration to do the following tasks in the Azure portal:
 
> [!div class="checklist"]
> * Create a service connection from Azure App Service to App Configuration.
> * Create a service connection to Azure Blob Storage and store the configuration in App Configuration.
> * View your configuration in App Configuration.
> * Use your connection with App Configuration providers.

## Prerequisites

- An Azure subscription where you have read and write access to the tutorial resources, in an Azure region that [supports Service Connector](concept-region-support.md).
- An [Azure App Service app](/azure/app-service/quickstart-dotnetcore).
- An [Azure App Configuration store](/azure/azure-app-configuration/quickstart-azure-app-configuration-create). Make sure your own user account has **App Configuration Data Owner** role on the App Configuration store.
- An [Azure Blob Storage account](/azure/storage/blobs/storage-quickstart-blobs-portal). Make sure your own user account has **Storage Blob Data Owner/Contributor** role on the storage account.

## Connect App Service to App Configuration

To store your connection configuration in App Configuration, first connect your App Service app to your App Configuration store.

1. On the Azure portal page for your App Service app, select **Service Connector** under **Settings** in the left navigation menu, and then select **Create**.
1. On the **Create connection** form, complete the following information:

   - **Service type**: Select **App Configuration**.
   - **Connection name**: Accept the generated connection name, or create a new one that's globally unique in Azure.
   - **Subscription**: Select your subscription if not already selected.
   - **App Configuration**: Select the App Configuration store to use if not already selected.
   - **Client type**: Select your App Service runtime stack if not already selected.

1. Select **Next: Authentication**.

   :::image type="content" source="./media/tutorial-portal-app-configuration-store/app-configuration-create.png" alt-text="Screenshot of the Azure portal, creating App Configuration connection." lightbox="./media/tutorial-portal-app-configuration-store/app-configuration-create.png":::

1. On the **Authentication** tab, select **System assigned managed identity**.
1. Select **Next: Networking**.
1. On the **Networking** tab, select **Configure firewall rules to enable access to target service**.
   >[!NOTE]
   >Because Service Connector writes configuration to App Configuration directly, App Configuration must have public access enabled.
1. Select **Next: Review + Create**, and when validation passes, select **Create**.

It can take some time to create the connection. When the connection is created, its listing appears on the app's **Service Connector** page.

## Connect App Service to Blob Storage and store configuration in App Configuration

Now connect your App Service app to another target service and store the configuration in App Configuration instead of in the app settings. The following example uses Blob Storage. You can follow the same process for other target services.

1. On the Azure portal page for your App Service app, select **Service Connector** under **Settings** in the left navigation menu, and then select **Create**.
1. On the **Create connection** form, complete the following information:

   - **Service type**: Select **Storage - Blob**.
   - **Connection name**: Accept the generated connection name, or create a new one that's globally unique in Azure.
   - **Subscription**: Select the Blob Storage account subscription if not already selected.
   - **Storage account**: Select the Blob Storage account to use if not already selected.
   - **Client type**: Select your App Service runtime stack if not already selected.

1. Select **Next: Authentication**.

   :::image type="content" source="./media/tutorial-portal-app-configuration-store/storage-create.png" alt-text="Screenshot of the Azure portal, creating Blob Storage connection."  lightbox="./media/tutorial-portal-app-configuration-store/storage-create.png":::

1. On the **Authentication** tab, select **System assigned managed identity**.
1. Select the **Store Configuration in App Configuration** checkbox.
1. Under **App Configuration Connection**, select the App Configuration connection to use.
1. Select **Next: Networking**.

   :::image type="content" source="./media/tutorial-portal-app-configuration-store/storage-authentication.png" alt-text="Screenshot of the Azure portal, selecting Blob Storage connection auth.":::

1. On the **Networking** tab, select **Configure firewall rules to enable access to target service**.
1. Select **Next: Review + Create**, and when validation passes, select **Create**.

## View your configuration in App Configuration

Connections appear on the App Service **Service Connector** page, where you can view their configurations.

1. To view service endpoints and values, select the arrow next to a connection to expand it, and then select **Hidden value. Click to show value** to show the connection value.

1. To go to a connection's target resource page, select its link in the **Resource name** column. Select the **Resource name** link for the **App Configuration** connection.

   :::image type="content" source="./media/tutorial-portal-app-configuration-store/app-configuration-authentication.png" alt-text="Screenshot of the Azure portal, viewing the Blob Storage connection value."  lightbox="./media/tutorial-portal-app-configuration-store/app-configuration-authentication.png":::

1. On the **App Configuration** page, select **Configuration explorer** under **Configuration management** in the left navigation menu.
1. On the **Configuration explorer** page, select the checkbox next to the **Blob Storage** configuration name, and then select **Advanced edit** from the top menu bar.

   :::image type="content" source="./media/tutorial-portal-app-configuration-store/storage-network.png" alt-text="Screenshot of the Azure portal, showing how to edit configuration."  lightbox="./media/tutorial-portal-app-configuration-store/storage-network.png":::

   The **Advanced edit** screen shows the value of the Blob Storage connection.

   :::image type="content" source="./media/tutorial-portal-app-configuration-store/app-configuration-store-detail.png" alt-text="Screenshot of the Azure portal, reviewing App Configuration Store content."  lightbox="./media/tutorial-portal-app-configuration-store/app-configuration-store-detail.png":::

## Use your connection with App Configuration providers

App Configuration supports several providers and client libraries. The following example uses .NET code. For more information, see the [Azure App Configuration Kubernetes Provider reference](/azure/azure-app-configuration/reference-kubernetes-provider).

```csharp
using Azure.Identity;
using Azure.Storage.Blobs;
using Microsoft.Extensions.Configuration;

var credential = new ManagedIdentityCredential();
var builder = new ConfigurationBuilder();
builder.AddAzureAppConfiguration(options => options.Connect(new Uri(Environment.GetEnvironmentVariable("AZURE_APPCONFIGURATION_RESOURCEENDPOINT")), credential));

var config = builder.Build();
var storageConnectionName = "UserStorage";
var blobServiceClient = new BlobServiceClient(new Uri(config[$"AZURE_STORAGEBLOB_{storageConnectionName.ToUpperInvariant()}_RESOURCEENDPOINT"]), credential);
```

## Clean up resources

If you no longer need the resources you used in this tutorial, you can delete them individually or by deleting the resource group or groups that contain them.

To delete a resource group, search for and select **Resource groups** in the Azure portal, select the resource group that contains the resources to delete, and then select **Delete** on the resource group's page.

## Related content

- [Service Connector concepts](concept-service-connector-internals.md)
- [Azure App Configuration deployment](/azure/azure-app-configuration/quickstart-deployment-overview)
- [Azure App Configuration FAQ](/azure/azure-app-configuration/faq)


---
title: Tutorial - Connect Azure services and store configuration in an Azure App Configuration store
description: Tutorial showing how to store your connection configuration in Azure App Configuration using Service Connector
author: chentanyi
ms.author: tanchen
ms.service: service-connector
ms.topic: tutorial
ms.date: 03/20/2024
---

# Quickstart: Connect Azure services and store configuration in an App Configuration store

[Azure App Configuration](../azure-app-configuration/overview.md) is a cloud service that provides a central store for managing application settings. The configuration stored in App Configuration naturally supports Infrastructure as Code tools. When you create a service connection using Service Connector, you can choose to store your connection configuration in a connected App Configuration store. In this tutorial, you'll complete the following tasks using the Azure portal.

> [!div class="checklist"]
> * Create a service connection to Azure App Configuration in Azure App Service
> * Create a service connection to Azure Blob Storage and store configuration in Azure App Configuration
> * View your configuration in App Configuration
> * Use your connection with App Configuration providers

## Prerequisites

To create a service connection and store configuration in Azure App Configuration with Service Connector, you need:

* Basic knowledge of [using Service Connector](./quickstart-portal-app-service-connection.md)
* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
* An app hosted on App Service. If you don't have one yet, [create and deploy an app to App Service](../app-service/quickstart-dotnetcore.md)
* An Azure App Configuration store. If you don't have one, [create an Azure App Configuration store](../azure-app-configuration/quickstart-azure-app-configuration-create.md)
* An Azure Blob Storage. If you don't have one, [create an Azure Blob Storage](../storage/blobs/storage-quickstart-blobs-portal.md)
* Read and write access to the App Service, App Configuration and the target service.

## Create an App Configuration connection in App Service

To store your connection configuration in App Configuration, start by connecting your App Service to an App Configuration store.

1. In the Azure portal, type **App Service** in the search menu and select the name of the App Service you want to use from the list.
1. Select **Service Connector** from the left table of contents. Then select **Create**.
1. Select or enter the following settings.

    | Setting      | Suggested value  | Description                                        |
    | ------------ |  ------- | -------------------------------------------------- |
    | **Service type** | App Configuration | Target service type. If you don't have an App Configuration store, [create one](../azure-app-configuration/quickstart-azure-app-configuration-create.md). |
    | **Connection name** | Unique name | The connection name that identifies the connection between your App Service and target service.  |
    | **Subscription** | Subscription of the Azure App Configuration store. | The subscription in which your App Configuration store is created. The default value is the subscription listed for the App Service. |
    | **App Configuration** | Your App Configuration name | The target App Configuration you want to connect to. |
    | **Client type** | The same app stack on this App Service | The application stack that works with the target service you selected. The default value comes from the App Service runtime stack. |

    :::image type="content" source="./media/tutorial-portal-app-configuration-store/app-configuration-create.png" alt-text="Screenshot of the Azure portal, creating App Configuration connection." lightbox="./media/tutorial-portal-app-configuration-store/app-configuration-create.png":::

1. Select **Next: Authentication** to select the authentication type. Then select **System assigned managed identity** to connect your App Configuration.

    :::image type="content" source="./media/tutorial-portal-app-configuration-store/app-configuration-authentication.png" alt-text="Screenshot of the Azure portal, selecting App Configuration connection auth.":::

1. Select **Next: Networking** to select the network configuration. Then select **Configure firewall rules to enable access to target service** when your App Configuration is opened to public network by default.

    > [!TIP]
    > Service Connector will write configuration to App Configuration directly, so you need to enable the App Configuration public access when using this feature.

    :::image type="content" source="./media/tutorial-portal-app-configuration-store/app-configuration-network.png" alt-text="Screenshot of the Azure portal, selecting App Configuration connection network.":::

1. Then select **Next: Review + Create**  to review the provided information. Select **Create** to create the service connection. It can take one minute to complete the operation.

## Create a Blob Storage connection in App Service and store configuration in App Configuration

Now you can create a service connection to another target service and store configuration in a connected App Configuration instead of app settings. We'll use Blob Storage as an example below. Follow the same process for other target services.

1. In the Azure portal, type **App Service** in the search menu and select the name of the App Service you want to use from the list.
1. Select **Service Connector** from the left table of contents. Then select **Create**.
1. Select or enter the following settings.

    | Setting      | Suggested value  | Description                                        |
    | ------------ |  ------- | -------------------------------------------------- |
    | **Service type** | Storage - Blob | Target service type. If you don't have a Storage Blob container, you can [create one](../storage/blobs/storage-quickstart-blobs-portal.md) or use another service type. |
    | **Connection name** | Unique name | The connection name that identifies the connection between your App Service and target service. |
    | **Subscription** | One of your subscriptions | The subscription in which your target service is deployed. The target service is the service you want to connect to. The default value is the subscription listed for the App Service. |
    | **Storage account** | Your storage account | The target storage account you want to connect to. If you choose a different service type, select the corresponding target service instance. |
    | **Client type** | The same app stack on this App Service | The application stack that works with the target service you selected. The default value comes from the App Service runtime stack. |

    :::image type="content" source="./media/tutorial-portal-app-configuration-store/storage-create.png" alt-text="Screenshot of the Azure portal, creating Blob Storage connection."  lightbox="./media/tutorial-portal-app-configuration-store/storage-create.png":::

1. Select **Next: Authentication** to select the authentication type and select **System assigned managed identity** to connect your storage account.
1. Check **Store Configuration in App Configuration** to let Service Connector store the configuration info into your App Configuration store. Then select one of your App Configuration connections under **App Configuration connection**.

    :::image type="content" source="./media/tutorial-portal-app-configuration-store/storage-authentication.png" alt-text="Screenshot of the Azure portal, selecting Blob Storage connection auth.":::

1. Select **Next: Networking** and **Configure firewall rules** to update the firewall allowlist in Storage Account so that your App Service can reach the Storage Account.

    :::image type="content" source="./media/tutorial-portal-app-configuration-store/storage-network.png" alt-text="Screenshot of the Azure portal, selecting Blob Storage connection network.":::

1. Then select **Next: Review + Create**  to review the provided information.

1. Select **Create** to create the service connection. It might take up to one minute to complete the operation.

## View your configuration in App Configuration

1. Expand the Storage - Blob connection, select **Hidden value. Click to show value**. You can see the value of the configuration from App Configuration store.

1. Select the **Resource name** column of your App Configuration connection. You will be redirected to the App Configuration portal page.

1. Select **Configuration explorer** in the App Configuration left menu, and select the blob storage configuration name.

1. Click **Edit** to show the value of this blob storage connection.

    :::image type="content" source="./media/tutorial-portal-app-configuration-store/app-configuration-store-detail.png" alt-text="Screenshot of the Azure portal, reviewing App Configuration Store content."  lightbox="./media/tutorial-portal-app-configuration-store/app-configuration-store-detail.png":::

## Use your connection with App Configuration providers

Azure App Configuration supports several providers or client libraries. The example below uses .NET code. For more information, refer to the [Azure App Configuration documentation](../azure-app-configuration/reference-kubernetes-provider.md)

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

When no longer needed, delete the resource group and all related resources created for this tutorial. To do so, select the resource group or the individual resources you created and select **Delete**.

## Next steps

> [!div class="nextstepaction"]
> [Service Connector internals](./concept-service-connector-internals.md)

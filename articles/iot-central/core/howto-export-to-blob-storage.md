---
title: Export data to Blob storage IoT Central | Microsoft Docs
description: How to use the new data export to export your IoT data to blob storage
services: iot-central
author: v-krishnag
ms.author: v-krishnag
ms.date: 04/28/2022
ms.topic: how-to
ms.service: iot-central
---

# Export IoT data to blob storage

This article describes how to configure data export to send data to the blob storage service. 

IoT Central exports data once per minute, with each file containing the batch of changes since the previous export. Exported data is saved in JSON format. The default paths to the exported data in your storage account are:

- Telemetry: _{container}/{app-id}/{partition_id}/{YYYY}/{MM}/{dd}/{hh}/{mm}/{filename}_
- Property changes: _{container}/{app-id}/{partition_id}/{YYYY}/{MM}/{dd}/{hh}/{mm}/{filename}_

To browse the exported files in the Azure portal, navigate to the file and select **Edit blob**.

## Connection options

Blob Storage destinations let you configure the connection with a *connection string* or a [managed identity](../../active-directory/managed-identities-azure-resources/overview.md).

[!INCLUDE [iot-central-managed-identities](../../../includes/iot-central-managed-identities.md)]

This article shows how to create a managed identity in the Azure portal. You can also use the Azure CLI to create a manged identity. To learn more, see [Assign a managed identity access to a resource using Azure CLI](../../active-directory/managed-identities-azure-resources/howto-assign-access-cli.md).

## [Connection string](#tab/connection-string/blob-storage)

### Create an Azure Blob Storage destination

If you don't have an existing Azure storage account to export to, follow these steps:

1. Create a [new storage account in the Azure portal](https://portal.azure.com/#create/Microsoft.StorageAccount-ARM). You can learn more about creating new [Azure Blob storage accounts](../../storage/blobs/storage-quickstart-blobs-portal.md) or [Azure Data Lake Storage v2 storage accounts](../../storage/common/storage-account-create.md). Data export can only write data to storage accounts that support block blobs. The following list shows the known compatible storage account types:

    |Performance Tier|Account Type|
    |-|-|
    |Standard|General Purpose V2|
    |Standard|General Purpose V1|
    |Standard|Blob storage|
    |Premium|Block Blob storage|

1. To create a container in your storage account, go to your storage account. Under **Blob Service**, select **Browse Blobs**. Select **+ Container** at the top to create a new container.

1. Generate a connection string for your storage account by going to **Settings > Access keys**. Copy one of the two connection strings.

To create the Blob Storage destination in IoT Central on the **Data export** page:

1. Select **+ New destination**.

1. Select **Azure Blob Storage** as the destination type.

1. Select **Connection string** as the authorization type.

1. Paste in the connection string for your Blob Storage resource, and enter the case-sensitive container name if necessary.

1. Select **Save**.

## [Managed identity](#tab/managed-identity/blob-storage)

### Create an Azure Blob Storage destination

If you don't have an existing Azure storage account to export to, follow these steps:

1. Create a [new storage account in the Azure portal](https://portal.azure.com/#create/Microsoft.StorageAccount-ARM). You can learn more about creating new [Azure Blob storage accounts](../../storage/blobs/storage-quickstart-blobs-portal.md) or [Azure Data Lake Storage v2 storage accounts](../../storage/common/storage-account-create.md). Data export can only write data to storage accounts that support block blobs. The following list shows the known compatible storage account types:

    |Performance Tier|Account Type|
    |-|-|
    |Standard|General Purpose V2|
    |Standard|General Purpose V1|
    |Standard|Blob storage|
    |Premium|Block Blob storage|

1. To create a container in your storage account, go to your storage account. Under **Blob Service**, select **Browse Blobs**. Select **+ Container** at the top to create a new container.

[!INCLUDE [iot-central-managed-identity](../../../includes/iot-central-managed-identity.md)]

To configure the permissions:

1. On the **Add role assignment** page, select the subscription you want to use and **Storage** as the scope. Then select your storage account as the resource.

1. Select **Storage Blob Data Contributor** as the **Role**.

1. Select **Save**. The managed identity for your IoT Central application is now configured.

    > [!TIP]
    > This role assignment isn't visible in the list on the **Azure role assignments** page.

To further secure your blob container and only allow access from trusted services with managed identities, see [Export data to a secure destination on an Azure Virtual Network](howto-connect-secure-vnet.md).

To create the Blob Storage destination in IoT Central on the **Data export** page:

1. Select **+ New destination**.

1. Select **Azure Blob Storage** as the destination type.

1. Select **System-assigned managed identity** as the authorization type.

1. Enter the endpoint URI for your storage account and the case-sensitive container name. An endpoint URI looks like: `https://contosowaste.blob.core.windows.net`.

1. Select **Save**.

## Next steps

Now that you know how to export to blob storage, a suggested next step is to learn [Export to Service Bus](howto-export-to-service-bus.md).

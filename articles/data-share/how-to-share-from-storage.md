---
title: Share and receive data from Azure Blob Storage and Azure Data Lake Storage
description: Learn how to share and receive data from Azure Blob Storage and Azure Data Lake Storage.
author:  sidontha
ms.author: sidontha
ms.service: data-share
ms.topic: how-to
ms.date: 10/27/2022
---

# Share and receive data from Azure Blob Storage and Azure Data Lake Storage

[!INCLUDE[appliesto-storage](includes/appliesto-storage.md)]

[Azure Data Share](overview.md) allows you to securely share data snapshots from your Azure storage resources to other Azure subscriptions. Including Azure subscriptions outside your tenant.

This article describes sharing data from **Azure Blob Storage**, **Azure Data Lake Storage Gen1**, and **Azure Data Lake Storage Gen2**.

This article will guide you through:

- [What kinds of data can be shared](#whats-supported)
- [How to prepare your environment](#prerequisites-to-share-data)
- [How to create a share](#create-a-share)
- [How to receive shared data](#receive-shared-data)

You can use the table of contents to jump to the section you need, or continue with this article to follow the process from start to finish.

## What's supported

Azure Data Share supports sharing data from Azure Data Lake Gen1, Azure Data Lake Gen2, and Azure storage.

|Resource type | Sharable resource  |
|----------|-----------
|Azure Data Lake Gen1 and Gen2   |Files      |
||Folders|
||File systems|
|Azure Storage   |*Blobs     |
||Folders|
||Containers|

>[!NOTE]
> *Block, append, and page blobs are all supported. However, when they are shared they will be received as **block blobs**.

Data shared from these sources can be received by Azure Data Lake Gen2 or Azure Blob Storage.

### Share behavior

For file systems, containers, or folders, you can choose to make full or incremental snapshots of your data.

A **full snapshot** copies all specified files and folders at every snapshot.

An **incremental snapshot** copies only new or updated files, based on the last modified time of the files.

Existing files that have the same name are overwritten during a snapshot. A file that is deleted from the source isn't deleted on the target. Empty subfolders at the source aren't copied over to the target.

## Prerequisites to share data

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
- [An Azure Data Share account](share-your-data-portal.md#create-a-data-share-account).
- Your data recipient's Azure sign-in e-mail address (using their e-mail alias won't work).
- If your Azure SQL resource is in a different Azure subscription than your Azure Data Share account, register the [Microsoft.DataShare resource provider](concepts-roles-permissions.md#resource-provider-registration) in the subscription where your source Azure SQL resource is located.

### Prerequisites for the source storage account

- An Azure Storage account. If you don't already have an account, [create one](../storage/common/storage-account-create.md).
- Permission to write to the storage account. Write permission is in *Microsoft.Storage/storageAccounts/write*. It's part of the Contributor role.
- Permission to add role assignment to the storage account. This permission is in *Microsoft.Authorization/role assignments/write*. It's part of the Owner role.

### Create a share

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Go to your data share **Overview** page.

   :::image type="content" source="./media/share-receive-data.png" alt-text="Screenshot showing the data share overview.":::

1. Select **Start sharing your data**.

1. Select **Create**.

1. Provide the details for your share. Specify a name, share type, description of share contents, and terms of use (optional).

   :::image type="content" source="./media/enter-share-details.png " alt-text="Screenshot of the share creation page in Azure Data Share, showing the share name, type, description, and terms of used filled out.":::

1. Select **Continue**.

1. To add datasets to your share, select **Add Datasets**.

   :::image type="content" source="./media/datasets.png" alt-text="Screenshot of the datasets page in share creation, the add datasets button is highlighted.":::

1. Select a dataset type to add. The list of dataset types depends on whether you selected snapshot-based sharing or in-place sharing in the previous step.

   :::image type="content" source="./media/add-datasets.png" alt-text="Screenshot showing the available dataset types.":::

1. Go to the object you want to share. Then select **Add Datasets**.

   :::image type="content" source="./media/select-datasets.png" alt-text="Screenshot of the select datasets page, showing a folder selected.":::

1. On the **Recipients** tab, add the email address of your data consumer by selecting **Add Recipient**.

   :::image type="content" source="./media/add-recipient.png" alt-text="Screenshot of the recipients page, showing a recipient added.":::

1. Select **Continue**.

1. If you selected a snapshot share type, you can set up the snapshot schedule to update your data for the data consumer.

   :::image type="content" source="./media/enable-snapshots.png" alt-text="Screenshot of the settings page, showing the snapshot toggle enabled.":::

1. Select a start time and recurrence interval.

1. Select **Continue**.

1. On the **Review + Create** tab, review your package contents, settings, recipients, and synchronization settings. Then select **Create**.

You've now created your Azure data share. The recipient of your data share can accept your invitation.

## Prerequisites to receive data

Before you accept a data share invitation, make sure you have the following prerequisites:

- An Azure subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/).
- An invitation from Azure. The email subject should be "Azure Data Share invitation from *\<yourdataprovider\@domain.com>*".
- A registered [Microsoft.DataShare resource provider](concepts-roles-permissions.md#resource-provider-registration) in:
  - The Azure subscription where you'll create a Data Share resource.
  - The Azure subscription where your target Azure data stores are located.

### Prerequisites for a target storage account

- An Azure Storage account. If you don't already have one, [create an account](../storage/common/storage-account-create.md).
- Permission to write to the storage account. This permission is in *Microsoft.Storage/storageAccounts/write*. It's part of the Contributor role.
- Permission to add role assignment to the storage account. This assignment is in *Microsoft.Authorization/role assignments/write*. It's part of the Owner role.  

## Receive shared data

### Open an invitation

You can open an invitation from email or directly from the [Azure portal](https://portal.azure.com/).

1. To open an invitation from email, check your inbox for an invitation from your data provider. The invitation from Microsoft Azure is titled "Azure Data Share invitation from *\<yourdataprovider\@domain.com>*". Select **View invitation** to see your invitation in Azure.

   To open an invitation from the Azure portal, search for *Data Share invitations*. You see a list of Data Share invitations.

   If you're a guest user of a tenant, you'll be asked to verify your email address for the tenant prior to viewing Data Share invitation for the first time. Once verified, it's valid for 12 months.

   :::image type="content" source="./media/invitations.png" alt-text="Screenshot of the invitations page, showing a pending invitation.":::

1. Select the share you want to view.

### Accept an invitation

1. Review all of the fields, including the **Terms of use**. If you agree to the terms, select the check box.

   :::image type="content" source="./media/terms-of-use.png" alt-text="Screenshot of the invitation acceptance page, showing the terms of use highlighted and the agreement selected.":::

1. Under **Target Data Share account**, select the subscription and resource group where you'll deploy your Data Share. Then fill in the following fields:

   - In the **Data share account** field, select **Create new** if you don't have a Data Share account. Otherwise, select an existing Data Share account that will accept your data share.

   - In the **Received share name** field, either leave the default that the data provider specified or specify a new name for the received share.

1. Select **Accept and configure**. A share subscription is created.

   :::image type="content" source="./media/accept-options.png" alt-text="Screenshot of the acceptance page, showing the target data share account information filled out.":::

    The received share appears in your Data Share account.

    If you don't want to accept the invitation, select **Reject**.

### Configure a received share

1. On the **Datasets** tab, select the check box next to the dataset where you want to assign a destination. Select **Map to target** to choose a target data store.

   :::image type="content" source="./media/dataset-map-target.png" alt-text="Screenshot of the received shares page with the map to target button highlighted.":::

1. Select a target data store for the data. Files in the target data store that have the same path and name as files in the received data will be overwritten.

   :::image type="content" source="./media/map-target.png" alt-text="Screenshot of the map datasets to target window, showing a filesystem name given.":::

1. For snapshot-based sharing, if the data provider uses a snapshot schedule to regularly update the data, you can enable the schedule from the **Snapshot Schedule** tab. Select the box next to the snapshot schedule. Then select **Enable**. The first scheduled snapshot will start within one minute of the schedule time and subsequent snapshots will start within seconds of the scheduled time.

   :::image type="content" source="./media/enable-snapshot-schedule.png" alt-text="Screenshot showing the snapshot schedule tab with the enable button selected.":::

### Trigger a snapshot

The steps in this section apply only to snapshot-based sharing.

1. You can trigger a snapshot from the **Details** tab. On the tab, select **Trigger snapshot**. You can choose to trigger a full snapshot or incremental snapshot of your data. If you're receiving data from your data provider for the first time, select **Full copy**. When a snapshot is executing, subsequent snapshots won't start until the previous one complete.

   :::image type="content" source="./media/trigger-snapshot.png" alt-text="Screenshot of the received shares page, showing the trigger snapshot dropdown selected and the full copy option highlighted.":::

1. When the last run status is *successful*, go to the target data store to view the received data. Select **Datasets**, and then select the target path link.

   :::image type="content" source="./media/consumer-datasets.png" alt-text="Screenshot of the datasets tab showing a successful dataset selected.":::

### View history

You can view the history of your snapshots only in snapshot-based sharing. To view the history, open the **History** tab. Here you see the history of all of the snapshots that were generated in the past 30 days.

## Storage snapshot performance

Storage snapshot performance is impacted by many factors in addition to number of files and size of the shared data. It's always recommended to conduct your own performance testing. Below are some example factors impacting performance.

- Concurrent access to the source and target data stores.  
- Location of source and target data stores.
- For incremental snapshot, the number of files in the shared dataset can impact the time it takes to find the list of files with last modified time after the last successful snapshot.

## Next steps

You've learned how to share and receive data from a storage account by using the Azure Data Share service. To learn about sharing from other data sources, see the [supported data stores](supported-data-stores.md).

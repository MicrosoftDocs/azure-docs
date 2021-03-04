---
title: Configure continuous backup and point in time restore using Azure portal in Azure Cosmos DB.
description: Learn how to identify the restore point and configure continuous backup using Azure portal. It shows how to restore a live and deleted account. 
author: kanshiG
ms.service: cosmos-db
ms.topic: how-to
ms.date: 02/01/2021
ms.author: govindk
ms.reviewer: sngun

---

# Configure and manage continuous backup and point in time restore (Preview) - using Azure portal
[!INCLUDE[appliesto-sql-mongodb-api](includes/appliesto-sql-mongodb-api.md)]

> [!IMPORTANT]
> The point-in-time restore feature(continuous backup mode) for Azure Cosmos DB is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Azure Cosmos DB's point-in-time restore feature(Preview) helps you to recover from an accidental change within a container, to restore a deleted account, database, or a container or to restore into any region (where backups existed). The continuous backup mode allows you to do restore to any point of time within the last 30 days.

This article describes how to identify the restore point and configure continuous backup using Azure portal.

## <a id="provision"></a>Provision an account with continuous backup

When creating a new Azure Cosmos DB account, for the **Backup policy** option, choose **continuous** mode to enable the point in time restore functionality for the new account. After this feature is enabled for the account, all the databases and containers are available for continuous backup. With the point-in-time restore, data is always restored to a new account, currently you can't restore to an existing account.

:::image type="content" source="./media/continuous-backup-restore-portal/configure-continuous-backup-portal.png" alt-text="Provision an Azure Cosmos DB account with continuous backup configuration." border="true":::

## <a id="restore-live-account"></a>Restore a live account from accidental modification

You can use Azure portal to restore a live account or selected databases and containers under it. Use the following steps to restore your data:

1. Sign into the [Azure portal](https://portal.azure.com/)
1. Navigate to your Azure Cosmos DB account and open the **Point In Time Restore** pane.

   > [!NOTE]
   > The restore pane in Azure portal is only populated if you have the `Microsoft.DocumentDB/locations/restorableDatabaseAccounts/*/read` permission. To learn more about how to set this permission, see the [Backup and restore permissions](continuous-backup-restore-permissions.md) article.

1. Fill the following details to restore:

   * **Restore Point (UTC)** – A timestamp within the last 30 days. The account should exist at that timestamp. You can specify the restore point in UTC. It can be as close to the second when you want to restore it. Select the **Click here** link to get help on [identifying the restore point](#event-feed).

   * **Location** – The destination region where the account is restored. The account should exist in this region at the given timestamp (eg. West US or East US). An account can be restored only to the regions in which the source account existed.

   * **Restore Resource** – You can either choose **Entire account** or a **selected database/container** to restore. The databases and containers should exist at the given timestamp. Based on the restore point and location selected, restore resources are populated, which allows user to select specific databases or containers that need to be restored.

   * **Resource group** - Resource group under which the target account will be created and restored. The resource group must already exist.

   * **Restore Target Account** – The target account name. The target account name needs to follow same guidelines as when you are creating a new account. This account will be created by the restore process in the same region where your source account exists.
 
   :::image type="content" source="./media/continuous-backup-restore-portal/restore-live-account-portal.png" alt-text="Restore a live account from accidental modification Azure portal." border="true":::

1. After you select the above parameters, select the **Submit** button to kick off a restore. The restore cost is a one time charge, which is based on the amount of data and charges for the storage in given region. To learn more, see the [Pricing](continuous-backup-restore-introduction.md#continuous-backup-pricing) section.

## <a id="event-feed"></a>Use event feed to identify the restore time

When filling out the restore point time in the Azure portal, if you need help with identifying restore point, select the **click here** link, it takes you to the event feed blade. The event feed provides a full fidelity list of create, replace, delete events on databases and containers of the source account. 

For example, if you want to restore to the point before a certain container was deleted or updated, check this event feed. Events are displayed in chronologically descending order of time when they occurred, with recent events at the top. You can browse through the results and select the time before or after the event to further narrow your time.

:::image type="content" source="./media/continuous-backup-restore-portal/event-feed-portal.png" alt-text="Use event feed to identify the restore point time." border="true":::

> [!NOTE]
> The event feed does not display the changes to the item resources. You can always manually specify any timestamp in the last 30 days (as long as account exists at that time) for restore.

## <a id="restore-deleted-account"></a>Restore a deleted account

You can use Azure portal to completely restore a deleted account within 30 days of its deletion. Use the following steps to restore a deleted account:

1. Sign into the [Azure portal](https://portal.azure.com/)
1. Search for *Azure Cosmos DB* resources in the global search bar. It lists all your existing accounts.
1. Next select the **Restore** button. The Restore pane displays a list of deleted accounts that can be restored within the retention period, which is 30 days from deletion time.
1. Choose the account that you want to restore.

   :::image type="content" source="./media/continuous-backup-restore-portal/restore-deleted-account-portal.png" alt-text="Restore a deleted account from Azure portal." border="true":::

   > [!NOTE]
   > Note: The restore pane in Azure portal is only populated if you have the `Microsoft.DocumentDB/locations/restorableDatabaseAccounts/*/read` permission. To learn more about how to set this permission, see the [Backup and restore permissions](continuous-backup-restore-permissions.md) article.

1. Select an account to restore and input the following details to restore a deleted account:

   * **Restore Point (UTC)** – A timestamp within the last 30 days. The account should have existed at that timestamp. Specify the restore point in UTC. It can be as close to the second when you want to restore it.

   * **Location** – The destination region where the account needs to be restored. The source account should exist in this region at the given timestamp. Example West US or East US.  

   * **Resource group** - Resource group under which the target account will be created and restored. The resource group must already exist.

   * **Restore Target Account** – The target account name needs to follow same guidelines as when you are creating a new account. This account will be created by the restore process in the same region where your source account exists.

## <a id="track-restore-status"></a>Track the status of restore operation

After initiating a restore operation, select the **Notification** bell icon at top-right corner of portal. It gives a link displaying the status of the account being restored. While restore is in progress, the status of the account will be *Creating*, after the restore operation completes, the account status will change to *Online*.

:::image type="content" source="./media/continuous-backup-restore-portal/track-restore-operation-status.png" alt-text="The status of restored account changes from creating to online when the operation is complete." border="true":::

## Next steps

* Configure and manage continuous backup using [Azure CLI](continuous-backup-restore-command-line.md), [PowerShell](continuous-backup-restore-powershell.md), or [Azure Resource Manager](continuous-backup-restore-template.md).
* [Resource model of continuous backup mode](continuous-backup-restore-resource-model.md)
* [Manage permissions](continuous-backup-restore-permissions.md) required to restore data with continuous backup mode.

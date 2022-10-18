---
title: Auditing the point in time restore action for continuous backup mode in Azure Cosmos DB
description: This article provides details available to audit Azure Cosmos DB's point in time restore feature in continuous backup mode.
author: kanshiG
ms.service: cosmos-db
ms.custom: ignite-2022
ms.topic: conceptual
ms.date: 04/18/2022
ms.author: govindk
ms.reviewer: mjbrown
---

# Audit the point in time restore action for continuous backup mode in Azure Cosmos DB
[!INCLUDE[NoSQL, MongoDB, Gremlin, Table](includes/appliesto-nosql-mongodb-gremlin-table.md)]

Azure Cosmos DB provides you the list of all the point in time restores for continuous mode that were performed on an Azure Cosmos DB account using [Activity Logs](../azure-monitor/essentials/activity-log.md). Activity logs can be viewed for any Azure Cosmos DB account from the **Activity Logs** page in the Azure portal. The Activity Log shows all the operations that were triggered on the specific account. When a point in time restore is triggered, it shows up as `Restore Database Account` operation on the source account as well as the target account. The Activity Log for the source account can be used to audit restore events, and the activity logs on the target account can be used to get the updates about the progress of the restore. 

## Audit the restores that were triggered on a live database account

When a restore is triggered on a source account, a log is emitted with the status *Started*. And when the restore succeeds or fails, a new log is emitted with the status *Succeeded* or *Failed* respectively.  

To get the list of just the restore operations that were triggered on a specific account, you can open the Activity Log of the source account, and search for **Restore database account** in the search bar with the required **Timespan** filter. The `UserPrincipalName` of the user that triggered the restore can be found from the `Event initiated by` column. 

:::image type="content" source="media/restore-account-continuous-backup/continuous-backup-restore-audit.png" alt-text="Screenshot of the Azure portal showing the Azure Cosmos DB restore audit activity log." lightbox="media/restore-account-continuous-backup/continuous-backup-restore-audit.png":::

The parameters of the restore request can be found by clicking on the event and selecting the JSON tab: 

:::image type="content" source="media/restore-account-continuous-backup/continuous-backup-restore-audit-json.png" alt-text="Screenshot of the Azure portal Azure Cosmos DB restore audit activity log." lightbox="media/restore-account-continuous-backup/continuous-backup-restore-audit-json.png":::

## Audit the restores that were triggered on a deleted database account

For the accounts that were already deleted, there would not be any database account page. Instead, the Activity Log in the subscription page can be used to get the restores that were triggered on a deleted account. Once the Activity Log page is opened, a new filter can be added to narrow down the results specific to the resource group the account existed in, or even using the database account name in the Resource filter. The Resource for the activity log is the database account on which the restore was triggered. 

:::image type="content" source="media/restore-account-continuous-backup/continuous-backup-restore-details-deleted-json.png" alt-text="Azure Cosmos DB restore audit activity log." lightbox="media/restore-account-continuous-backup/continuous-backup-restore-details-deleted-json.png":::

The activity logs can also be accessed using Azure CLI or Azure PowerShell. For more information on activity logs, review [Azure Activity log - Azure Monitor](../azure-monitor/essentials/activity-log.md).

## Track the progress of the restore operation 

Azure Cosmos DB allows you to track the progress of the restore using the activity logs of the restored database account. Once the restore is triggered, you will see a notification with the title **Restore Account**.

:::image type="content" source="media/restore-account-continuous-backup/track-restore-operation-status.png" alt-text="Screenshot of the Azure portal. The status of restored account changes from creating to online when the operation is complete." lightbox="media/restore-account-continuous-backup/track-restore-operation-status.png":::

The account status would be *Creating*, but it would have an Activity Log page. A new log event will appear after the restore of each collection. Note that there can be a delay of 5-10 minutes to see the log event after the actual restore of the collection is complete. 

  ## Next steps
  
  * Learn more about [continuous backup](continuous-backup-restore-introduction.md) mode.
  * Provision an account with continuous backup by using the [Azure portal](provision-account-continuous-backup.md#provision-portal), [PowerShell](provision-account-continuous-backup.md#provision-powershell), the [Azure CLI](provision-account-continuous-backup.md#provision-cli), or [Azure Resource Manager](provision-account-continuous-backup.md#provision-arm-template).
  * [Manage permissions](continuous-backup-restore-permissions.md) required to restore data with continuous backup mode.
  * Learn about the [resource model of continuous backup mode](continuous-backup-restore-resource-model.md).
  * Explore the [Frequently asked questions for continuous mode](continuous-backup-restore-frequently-asked-questions.yml).

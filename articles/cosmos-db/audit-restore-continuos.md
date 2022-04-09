### YamlMime:FAQ
metadata:
  title: Auditing the point in time restore action for continuous mode
  description: This article provides details available to audit Azure Cosmos DB's point-in-time restore feature in continuous backup mode.
  author: kanshiG
  ms.service: cosmos-db
  ms.topic: audit-continuos-mode
  ms.date: 04/09/2022
  ms.author: govindk
  ms.reviewer: wiassaf
title: Auditing the point in time restore action for continuous mode
summary: |
  [!INCLUDE[appliesto-all-apis-except-cassandra](includes/appliesto-all-apis-except-cassandra.md)]
  
Customers need a way to know details about the restore actions performed on the account. Azure Cosmos DB provides you the list of all the point in time restores for continuos mode that were performed on a CosmosDB Database account using [Activity Logs](/azure-monitor/essentials/activity-log). Activity logs can be viewed for any CosmosDB account from the `Activity Logs` blade in the azure portal. This blade shows all the operations that were triggered on the specific account. When a point-in-time restore is triggered, it shows up as `Restore Database Account` operation on the source account as well as the target account. The Activity log on the source account can be used to audit the restores, and the activity logs on the target account can be used to get the updates about the progress of the restore. 

## Audit the restores that were triggered on a live database account: 

When a restore is triggered on a source account, a log is emitted with the status `Started`. And when the restore succeeds or fails, a new log is emitted with the status `Succeeded` or `Failed` respectively.  

To get the list of just the restore operations that were triggered on a specific account, you can open the Activity Log blade of the source account, and search for `Restore database account` in the search bar with the required Timespan filter. The UserPrincipalName of the user that triggered the restore can be found from the `Event initiated by` column. 

:::image type="content" source="./media/continuous-backup-restore-introduction/continuous-backup-restore-audit.png" alt-text="Azure Cosmos DB restore audit activity log." lightbox="./media/continuous-backup-restore-introduction/continuous-backup-restore-audit.png" border="false":::

The parameters of the restore request can be found by clicking on the event and selecting the JSON tab: 
:::image type="content" source="./media/continuous-backup-restore-introduction/continuous-backup-restore-audit-json.png" alt-text="Azure Cosmos DB restore audit activity log." lightbox="./media/continuous-backup-restore-introduction/continuous-backup-restore-audit-json.png" border="false":::

## Audit the restores that were triggered on a deleted database account

For the accounts that were already deleted, there would not be any database account page. Instead, the Activity Logs blade in the subscription page can be used to get the restores that were triggered on a deleted account. Once the Activity Log blade under the subscription page is opened, a new filter can be added to narrow down the results specific to the resource group the account existed in, or even using the database account name in the Resource filter. The Resource for the activity log is the database account on which the restore was triggered. 
:::image type="content" source="./media/continuous-backup-restore-introduction/continuous-backup-restore-audit-deleted.png" alt-text="Azure Cosmos DB restore audit activity log." lightbox="./media/continuous-backup-restore-introduction/continuous-backup-restore-audit-deleted.png" border="false":::

The activity logs can also be accessed using Azure CLI or Azure PowerShell. More information on Activity logs can be found here: [Azure Activity log - Azure Monitor | Microsoft Docs](/azure-monitor/essentials/activity-log)

## Tracking the progress of the restore operation 

Azure Cosmos DB allows you to track the progress of the restore using the activity logs of the restored database account. Once the restore is triggered, you will see a notification with the title `Restore Account`.  Please click on the notification to open the blade of the restored account.

:::image type="content" source="./media/restore-account-continuous-backup/track-restore-operation-status.png" alt-text="The status of restored account changes from creating to online when the operation is complete." border="true" lightbox="./media/restore-account-continuous-backup/track-restore-operation-status.png":::

The account status would be `Creating`, but it would have an Activity Log blade. A new log would appear in this blade after the restore of each collection. Please note that there can be a delay of 5-10 minutes to see the log after the actual restore of the collection is complete. 

  ## Next steps
  
  * Learn more about [continuous backup](continuous-backup-restore-introduction.md) mode.
  * Provision an account with continuous backup by using the [Azure portal](provision-account-continuous-backup.md#provision-portal), [PowerShell](provision-account-continuous-backup.md#provision-powershell), the [Azure CLI](provision-account-continuous-backup.md#provision-cli), or [Azure Resource Manager](provision-account-continuous-backup.md#provision-arm-template).
  * [Manage permissions](continuous-backup-restore-permissions.md) required to restore data with continuous backup mode.
  * Learn about the [resource model of continuous backup mode](continuous-backup-restore-resource-model.md).
  * Explore the [Frequently asked questions for continuous mode](continuous-backup-restore-frequently-asked-questions.md).

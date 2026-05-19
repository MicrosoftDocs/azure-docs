---
title: Manage backups of Azure Cosmos DB using Azure portal
description: Learn about managing backup for Azure Cosmos DB from the Azure portal.
ms.topic: how-to
ms.date: 05/15/2026
author: AbhishekMallick-MS
ms.author: v-mallicka
ms.service: azure-backup
ms.custom: build-2026
# Customer intent: "As a database administrator, I want to manage backup policies and monitor backup operations for Azure Cosmos DB, so that I can ensure data protection and recoverability in accordance with my organization's requirements."
---

# Manage backups of Azure Cosmos DB using Azure portal (preview)

This article describes how to manage backup of Azure Cosmos DB (preview) using Azure portal.

Learn about the [supported regions, scenarios, and the limitations](backup-azure-cosmos-db-support-matrix.md) for Azure Cosmos DB backup (preview).

## Change a backup policy

You can change the associated policy for a protected itemAzure Cosmos DB backup item. The backup policy change for a backup item doesn't affect existing recovery points or their retention duration. The updated retention settings apply only to new recovery points created after the policy change.

To change the backup policy for an Azure Cosmos DB account, follow these steps:

1. Go to **Resiliency** and select **Protection inventory** > **Protected items**. 

2. On the **Protected items** pane, select **Datasource type** as **Azure Cosmos DB (Preview)** and select a protected instance from the list for which you want to change the backup policy. 

3. On the selected protected instance pane, select an associated item. 

4. On the associated item pane, select **Change Policy**.
   
5. On the **Change Policy** pane, search and select the new policy that you want to apply, and select **Apply**. 

## Monitor backup and restore operations

Azure Backup creates a job to track scheduled backups and on-demand backup operations. The service also creates a job when you trigger a restore operation, showing notifications in the Azure portal. You can view the backup job status or monitor the restore job progress from the Jobs pane.

To monitor the backup and restore operations for Azure Cosmos DB (preview), follow these steps:

1. Go to the **Resiliency** and select **Protection Inventory** > **Protected items**.

2. On the Protected items pane, apply the filters to view  the backup protected instances for Azure Cosmos DB , and select the required instance from the list.

3. The **Protected items** pane shows all the backup instances created across the subscriptions.

4. On the selected protected instance pane, select the **Associated Items**.

5. On the selected associated item pane, the backup jobs for the last seven days appear. To view the status of the backup operation, select **View all** to show ongoing and past jobs of this backup instance.

6. On the Backup jobs pane, review the list of backup and restore jobs and their status. Select a job from the list of jobs to view job details. 

7. Select a job from the list of jobs to view job details.
 
## Stop Protection for Azure Cosmos DB

You can stop protecting an Azure Cosmos DB (preview) in the following ways:

- **Stop Protection and Retain Data (Retain forever)**: Stops all future backup jobs from protecting your server. However, Azure Backup service retains the recovery points that are backed up forever. You need to pay to keep the recovery points in the vault (see [Azure Backup pricing](https://azure.microsoft.com/pricing/details/backup/) for details). You are able to restore the database account, if needed. To resume server protection, use the **Resume backup** option.

- **Stop Protection and Retain Data (Retain as per Policy)**: Stops all future backup jobs from protecting your server. The recovery points are retained as per policy and are chargeable according to [Azure Backup pricing](https://azure.microsoft.com/pricing/details/backup/). However, the latest recovery point is retained forever.

- **Stop Protection and Delete Data**: Stops all future backup jobs from protecting your servers and delete all the recovery points. This option does not allow to restore the database account or use the **Resume backup** option.

To stop protection for Azure Cosmos DB (preview), follow these steps: 

1. Go to the **Resiliency** and select **Protection Inventory** > **Protected items**. 

2. On the **Protected items** pane, apply the filters to view  the protected instances for Azure Cosmos DB (preview), and select the required instance from the list.

3. On the **Protected instance** pane, select the **Associated Items** for which you want to stop protection. 

4. On the selected associated item pane, select **Stop Backup**.

### Stop Protection and Retain Data

To stop protection and retain data for Azure Cosmos DB (preview) from the **Stop Backup** pane, follow these steps: 
 
1. On the Stop Backup pane, select one of the following data retention options:

   - Retain forever
   - Retain as per policy

   You can also select the reason for stopping backups from the drop-down list.

2. Select **Stop backup**.

3. Select **Confirm** to stop data protection.

### Stop Protection and Delete Data

To stop protection and delete data for Azure Cosmos DB (preview) from the **Stop Backup** pane, follow these steps: 

1. On the **Stop Backup** pane, select **Delete Backup Data**.

   Provide the name of the backup instance, reason for deletion, and any other comments.

2. Select **Stop backup**.

3. Select **Confirm** to stop data protection.

## Resume Protection for Azure Cosmos DB

If you have selected the **Stop Protection and Retain data** option, you can resume protection for your servers. When you resume protection for a backup instance, the existing backup policy applies only to new recovery points. Azure Backup cleans up existing recovery points that exceed their originally configured retention, based on the backup policy active at the time of creation.

To resume protection for an Azure Cosmos DB backup instance (preview), follow these steps: 

1. Go to the **Resiliency** and select **Protection Inventory** > **Protected items**.

2. On the **Protected items** pane, apply the filters to view the protected instances for Azure Cosmos DB (preview), and select the required instance from the list.

3.  On the selected protected instance pane, sselect the **Associated Items** for which you want to resume protection.

4. On the selected associated item pane, select **Resume Backup**.

5. On the **Resume Backup** pane, select **Resume backup**.

## Delete Azure Cosmos DB Backup Instance

If you want to delete a protected instance of Azure Cosmos DB (preview), stop all scheduled backups and remove all existing recovery points. 

To delete an Azure Cosmos DB protected instance, follow these steps: 

1. Go to the **Resiliency** and select **Protection Inventory** > **Protected items**. 

2. On the Protected items pane, apply the filters to view the protected instances for Azure Cosmos DB (preview), and select the required instance from the list. 

3. On the selected protected instance pane, select the **Associated Items** that you want to delete. 

4. On the selected associated item pane, select **Delete**.

5. On the **Delete Backup Data** pane, enter confirmation details including name of the Backup instance, reason for deletion, and other comments.

6. Select **Delete** to confirm and proceed with deleting backup instance.

## Related content

[Manage backups of Azure Database for PostgreSQL flexible server using Azure portal](backup-azure-database-postgresql-flex-manage.md).
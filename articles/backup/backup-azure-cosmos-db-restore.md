---
title: Restore Azure Cosmos DB account using Azure portal
description: Learn about how to restore Azure Cosmos DB account.
ms.topic: how-to
ms.date: 10/29/2026
ms.service: azure-backup
ms.custom: build-2026, ignite-2026
author: AbhishekMallick-MS
ms.author: v-mallicka
# Customer intent: "As a database administrator, I want to restore Azure Cosmos DB backups, so that I can ensure data recovery for compliance and manage database configurations effectively."
---

# Restore Azure Cosmos DB account by using Azure portal

This article describes how to restore an Azure Cosmos DB account backed up by using Azure portal.

You can restore to a target Azure Cosmos DB account in the same region as the Backup vault, or to the Azure paired secondary region by using Cross Region Restore.

## Prerequisites

Before you restore from Azure Cosmos DB backups by using Azure portal, ensure that you meet the following prerequisites:

- Check the [supported scenarios and known limitations](backup-azure-cosmos-db-support-matrix.md).
- Review the access permission if present to assign _Cosmos DB Long Term Retention Restore Role_ on the target Cosmos DB account to the Backup Vault for the restore operation. 
- To restore to a secondary region, ensure that the Backup vault uses geo-redundant storage (GRS) and that [Cross Region Restore is enabled on the vault](manage-backup-vault.md#perform-cross-region-restore-using-azure-portal).
- For cross region restore, Backup vault's managed identity must have the required permissions on the target Azure Cosmos DB account in the secondary region.

## Restore Azure Cosmos DB account

To restore Azure Cosmos DB account, follow these steps:

1. Go to **Resiliency**, and then select **Overview** > **Recover**.

   Alternatively, to restore backup from the **Backup vault** pane, go to the **Backup vault** > **Overview**, and select **Restore**.

2. On the **Recover** pane, select **Resource managed by** as **Azure**, **Datasource type** as **Azure Cosmos DB**, and **Solution** as **Azure Backup**.
  
3. Select the **protected item** for which you want to restore the backup, and then select **Continue**.

1. On the **Basics** pane, select restore region as **Primary region**.

   :::image type="content" source="./media/backup-azure-cosmos-db-restore/backup-cosmos-restore-basics-primary-region.png" alt-text="Screenshot shows the primary region selection." lightbox="./media/backup-azure-cosmos-db-restore/backup-cosmos-restore-basics-primary-region.png":::

   >[!NOTE]
   >Select restore region as **Secondary region**, to restore backup to the Azure paired region. For more information, see [Restore Azure Cosmos DB account to a secondary region](#restore-azure-cosmos-db-account-to-a-secondary-region).

4. On the **Restore** pane, on the **Restore point** tab, select **Select restore point** and choose the restore point you want to restore.
   
   The latest restore point is pre-populated.

   :::image type="content" source="./media/backup-azure-cosmos-db-restore/backup-cosmos-restore-restore-point.png" alt-text="Screenshot shows the restore point selection." lightbox="./media/backup-azure-cosmos-db-restore/backup-cosmos-restore-restore-point.png"::: 

   >[!NOTE]
   >When you select an incremental recovery point, Azure Backup automatically restores the full backup chain - the parent full backup and every incremental backup up to the point you select. Azure Backup verifies that all dependent recovery points are present before the restore begins. Restores from an incremental recovery point can take longer than restores from a full backup because the chain is reconstructed. 

5. On the **Restore parameters** tab, for **Restore configuration**, choose the target Azure Cosmos DB account details by selecting **Select**. 

   :::image type="content" source="./media/backup-azure-cosmos-db-restore/backup-cosmos-restore-restore-parameter-add.png" alt-text="Screenshot shows the restore parameters selection." lightbox="./media/backup-azure-cosmos-db-restore/backup-cosmos-restore-restore-parameter-add.png"::: 

6. Select the subscription and resource group and then choose the target Azure Cosmos DB account.

   :::image type="content" source="./media/backup-azure-cosmos-db-restore/backup-cosmos-restore-restore-parameter-added.png" alt-text="Screenshot shows the selected restore parameters." lightbox="./media/backup-azure-cosmos-db-restore/backup-cosmos-restore-restore-parameter-added.png"::: 
 
7. To check the restore parameters permissions before the final review and restore, select **Validate**. After validation is successful, select **Review + restore**.

8. On the **Review + restore** tab, select **Restore** to restore the selected Azure Cosmos DB account backup in a target Azure Cosmos DB account.
        
You can track the restore job under **Backup and recovery > Jobs**.

## Restore Azure Cosmos DB account to a secondary region

Use Cross Region Restore to restore vaulted backups of an Azure Cosmos DB account to the Azure paired region.

To restore an Azure Cosmos DB account to the secondary region, follow these steps:

1. Go to **Resiliency**, and then select **Overview** > **Recover**.

1. Select **Datasource type** as **Azure Cosmos DB**, and select the protected item that you want to restore.

1. On the **Basics** pane, select **Restore to secondary region**.

   :::image type="content" source="./media/backup-azure-cosmos-db-restore/backup-cosmos-restore-basics-secondary-region.png" alt-text="Screenshot shows the secondary region selection." lightbox="./media/backup-azure-cosmos-db-restore/backup-cosmos-restore-basics-secondary-region.png":::

1. On the **Restore point** tab, select the restore point. You see only recovery points that are available in the secondary region.

   :::image type="content" source="./media/backup-azure-cosmos-db-restore/backup-cosmos-restore-secondary-region-restore-points.png" alt-text="Screenshot shows the restore points in secondary region." lightbox="./media/backup-azure-cosmos-db-restore/backup-cosmos-restore-secondary-region-restore-points.png":::

   >[!NOTE]
   >Recovery points replicate asynchronously to the secondary region. A recovery point can take up to 12 hours after it's created in the primary region to become available in the secondary region.

1. On the **Restore parameters** tab, select the subscription, resource group, and target Azure Cosmos DB account in the secondary region.

   >[!NOTE]
   >The deployment region and the primary write region of the target Azure Cosmos DB account must be same as the secondary region of the Backup vault.

1. Select **Validate** to check the permissions, and then select **Review + restore**.

1. On the **Review + restore** tab, select **Restore**.

To monitor the restore, go to **Backup and recovery** > **Jobs**, and filter **Datasource type** to **Azure Cosmos DB**.

## Next steps

[Manage vaulted backup of Azure Cosmos DB account by using Azure portal](backup-azure-cosmos-db-manage.md).

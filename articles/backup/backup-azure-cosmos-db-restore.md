---
title: Restore Azure Cosmos DB account using Azure portal
description: Learn about how to restore Azure Cosmos DB account.
ms.topic: how-to
ms.date: 05/15/2026
ms.service: azure-backup
ms.custom:
  - build-2026
author: AbhishekMallick-MS
ms.author: v-mallicka
# Customer intent: "As a database administrator, I want to restore Azure Cosmos DB backups, so that I can ensure data recovery for compliance and manage database configurations effectively."
---

# Restore Azure Cosmos DB account (preview) using Azure portal

This article describes how to restore an Azure Cosmos DB account (preview) backed up using Azure portal.

Learn about the [supported regions, scenarios, and the limitations](backup-azure-cosmos-db-support-matrix.md) for Azure Cosmos DB backup (preview).

## Prerequisites

Before you restore from Azure Cosmos DB backups (preview), review the following prerequisites:

- Check that you have the required permissions for the restore operation.

- Verify that the target Azure Cosmos DB account is empty.

## Restore Azure Cosmos DB account

To restore Azure Cosmos DB account, follow these steps:

1. Go to **Resiliency**, and then select **Overview** > **Recover**.

   Alternatively, to restore backup from the **Backup vault** pane, go to the **Backup vault** > **Overview**, and select **Restore**.

2. On the **Recover** pane, select **Resource managed by** as **Azure**, **Datasource type** as **Azure Cosmos DB (Preview)**, and **Solution** as **Azure Backup**.
  
3. Select the **protected item** for which you want to restore the backup, and then select **Continue**.

4. On the **Restore** pane, on the **Restore point** tab, click **Select restore point** and choose the restore point you want to restore.
   
   The latest restore point is pre-populated.

   :::image type="content" source="./media/backup-azure-cosmos-db-restore/backup-cosmos-restore-restore-point.png" alt-text="Screenshot shows the restore point selection." lightbox="./media/backup-azure-cosmos-db-restore/backup-cosmos-restore-restore-point.png"::: 

5. On the **Restore parameters** tab, for **Restore configuration**, choose the target Azure Cosmos DB account details by clicking **Select**. 

   :::image type="content" source="./media/backup-azure-cosmos-db-restore/backup-cosmos-restore-restore-parameter-add.png" alt-text="Screenshot shows the restore parameters selection." lightbox="./media/backup-azure-cosmos-db-restore/backup-cosmos-restore-restore-parameter-add.png"::: 

6. Select the subscription and resource group and then choose the target Azure Cosmos DB account.

   :::image type="content" source="./media/backup-azure-cosmos-db-restore/backup-cosmos-restore-restore-parameter-added.png" alt-text="Screenshot shows the selected restore parameters." lightbox="./media/backup-azure-cosmos-db-restore/backup-cosmos-restore-restore-parameter-added.png"::: 
 
7. To check the restore parameters permissions before the final review and restore, select **Validate**. After validation is successful, select **Review + restore**.

   :::image type="content" source="./media/backup-azure-cosmos-db-restore/backup-cosmos-restore-restore-parameter-validated.png" alt-text="Screenshot shows the restore parameters validation." lightbox="./media/backup-azure-cosmos-db-restore/backup-cosmos-restore-restore-parameter-validated.png"::: 

8. On the **Review + restore** tab, select **Restore** to restore the selected Azure Cosmos DB account backup in a target Azure Cosmos DB account.

   :::image type="content" source="./media/backup-azure-cosmos-db-restore/backup-cosmos-restore-review.png" alt-text="Screenshot to review and restore backup." lightbox="./media/backup-azure-cosmos-db-restore/backup-cosmos-restore-review.png"::: 
   
9. You can track the restore job under **Backup jobs**.
                          
## Next steps

[Manage vaulted backup of Azure Cosmos DB account using Azure portal (preview)](backup-azure-cosmos-db-manage.md)

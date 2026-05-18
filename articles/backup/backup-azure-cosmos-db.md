---
title: Configure backup for Azure Cosmos DB using Azure portal
description: Learn about how to configure backup for Azure Cosmos DB using Azure portal. 
ms.topic: how-to
ms.date: 05/15/2026
ms.service: azure-backup
ms.custom:
  - build-2026
author: AbhishekMallick-MS
ms.author: v-mallicka
# Customer intent: As a database administrator, I want to configure backup policies for Azure Cosmos DB using a portal, so that I can ensure data protection and manage retention effectively.
---

# Configure vaulted backup for Azure Cosmos DB account using Azure portal (preview)

This article describes how to configure backup for Azure Cosmos DB (preview) using Azure portal.

## Prerequisites

Before you configure backup for Azure Cosmos DB, review the following prerequisites:

- Check the [supported scenarios and known limitations](backup-azure-cosmos-db-support-matrix.md) of Azure Cosmos DB backup.
- Identify or [create a Backup Vault](create-manage-backup-vault.md) in the same region where you want to back up the Azure Cosmos DB account.

## Create vaulted backup policy for Azure Cosmos DB

A backup policy defines backup frequency and retention rules that determine lifecycle management of recovery points. You can also create the backup policy on the go while configuring backup.

To create a backup policy, follow these steps: 

1.	Go to **Resiliency** and select **Manage > Protection policies**.
2.	On the **Protection policies** pane, select **+ Create policy > Create backup policy**.
3.	On the **Start: Create Policy** pane, select **Datasource type** as **Azure Cosmos DB (Preview)**, and select **Continue**. 
4. On the **Create Backup Policy** pane, on the **Basics** tab,  enter a **Policy name** for the new backup policy.
5. On the **Schedule + retention** tab, under **Backup schedule**, define the Backup frequency.
   
   :::image type="content" source="./media/backup-azure-cosmos-db/backup-cosmos-backup-policy-schedule-retention.png" alt-text="Screenshot shows how to define the backup frequency and retention rule" lightbox="./media/backup-azure-cosmos-db/backup-cosmos-backup-policy-schedule-retention.png":::

   >The preview feature supports weekly backup frequency only.

6. Under **Retention rules**, select **Add retention rule** to define retention rules for specific backups and set retention duration..

   >[!Note]
   >You can apply rules in priority order: yearly, monthly, then weekly. When a recovery point matches multiple rules, apply the highest-priority rule—for example, apply monthly retention over weekly. The default retention rule (with a period of 1 year) applies when no rule matches.

7. On the **Review + create** tab, select **Create** and complete the backup policy creation.

## Configure vaulted backup

To configure vaulted backup Cosmos DB account via Resiliency, follow these steps:

1. Go to **Resiliency**, and select **Overview** > **Configure protection**.

   Alternatively, to configure backup from the **Backup vault** pane, go to the **Backup vault** > **Overview**, and select **Backup**.

2. On the **Configure protection** pane, select **Resource managed by** as **Azure**, **Datasource type** as **Azure Cosmos DB (Preview)**, and **Solution** as **Azure Backup**, and then select **Continue**.


3. On the **Configure Backup** pane, on the **Basics** tab, check if **Datasource type** appears as **Azure Cosmos DB (preview)**, click **Select vault** under **Vault** and choose an existing Backup vault from the dropdown list, and then select **Next**.

   If you don't have a Backup vault, [create a new one](create-manage-backup-vault.md#create-a-backup-vault). 

   :::image type="content" source="./media/backup-azure-cosmos-db/backup-cosmos-configure-backup-basics.png" alt-text="Screenshot shows the Backup vault selection." lightbox="./media//backup-azure-cosmos-db/backup-cosmos-configure-backup-basics.png":::
         
4. On the **Backup policy** tab, select a Backup policy that defines the backup schedule and the retention duration, and then select **Next**.

   If you don’t have a backup policy, select **Create new** to [create a new one](#create-vaulted-backup-policy-for-azure-cosmos-db).

    :::image type="content" source="./media/backup-azure-cosmos-db/backup-cosmos-configure-backup-backup-policy.png" alt-text="Screenshot shows the Backup policy selection." lightbox="./media/backup-azure-cosmos-db/backup-cosmos-configure-backup-backup-policy.png":::

5. On the **Datasources** tab, select the datasource name.

   :::image type="content" source="./media/backup-azure-cosmos-db/backup-cosmos-configure-backup-datasources-add.png" alt-text="Screenshot shows the account selection for backup." lightbox="./media/backup-azure-cosmos-db/backup-cosmos-configure-backup-datasources-add.png":::

6. On the  **Select resources to backup** pane, select the Azure Cosmos DB account to back up, and then click **Select**.

   >[!Note]
   Ensure that the primary write region of the Azure Cosmos DB account is same as that of the Backup vault region.

   On the **Datasources** tab,  the Azure Backup service validates if all the necessary access permissions to connect to the Cosmos DB account. If one or more access permissions are missing, one of the following  error messages appears – **User cannot assign roles** or **Role assignment not done**.
   
   | **Error** | **Cause** | **Recommendation** |
   |-----------|-------------|
   | **User cannot assign roles** | This message appears when you (the backup admin) don’t have the **write access** on the Cosmos DB account as listed under **View details**. | To assign the necessary permissions on the required resources, select **Download role assignment template** to fetch the ARM template,  and run the template as an administrator. |
   | **Role assignment not done** | This message appears when you (the backup admin) have the **write access** on the Cosmos DB account to assign missing permissions as listed under **View details**. | To grant permissions inline, select **Assign missing roles**. |

   Once the process starts, the missing access permissions on the Cosmos DB account are granted to the backup vault. You can define the scope at which the access permissions must be granted. When the action is complete, revalidation starts.
 
7. After the role assignment validation shows **Success**,  select **Next**.

   :::image type="content" source="./media/backup-azure-cosmos-db/backup-cosmos-configure-backup-datasources-added.png" alt-text="Screenshot shows the role assignment validation is successful." lightbox="./media/backup-azure-cosmos-db/backup-cosmos-configure-backup-datasources-added.png":::

8. On the **Review + configure** tab, select **Configure backup**.

   :::image type="content" source="./media/backup-azure-cosmos-db/backup-cosmos-configure-backup-review.png" alt-text="Screenshot to review and configure backup" lightbox="./media/backup-azure-cosmos-db/backup-cosmos-configure-backup-review.png":::

## Next steps

[Restore Azure Cosmos DB account using Azure portal (preview)](backup-azure-cosmos-db-restore.md)

[Manage backup of Azure Cosmos DB account using Azure portal (preview)](backup-azure-cosmos-db-manage.md)

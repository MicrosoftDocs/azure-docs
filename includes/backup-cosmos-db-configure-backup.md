---
title: Include file
description: Include file
ms.service: azure-backup
ms.topic: include
author: AbhishekMallick-MS
ms.author: v-mallicka
ms.date: 10/27/2026
---

## Configure vaulted backup for Azure Cosmos DB by using Azure portal

To configure vaulted backup for a Cosmos DB account through Resiliency by using Azure portal, follow these steps:

1. Go to **Resiliency**, select **Overview** > **Configure protection**.

   Alternatively, configure backup from the **Backup vault** pane. Go to **Backup vault** > **Overview**, and select **Backup**.

2. On the **Configure protection** pane, select **Resource managed by** as **Azure**, **Datasource type** as **Azure Cosmos DB**, and **Solution** as **Azure Backup**, and then select **Continue**.


3. On the **Configure Backup** pane, on the **Basics** tab, check if **Datasource type** appears as **Azure Cosmos DB**, click **Select vault** under **Vault** and choose an existing Backup vault from the dropdown list, and then select **Next**.

   :::image type="content" source="./media/backup-cosmos-db-configure-backup/backup-cosmos-configure-backup-basics.png" alt-text="Screenshot shows the Backup vault selection." lightbox="./media/backup-cosmos-db-configure-backup/backup-cosmos-configure-backup-basics.png":::
         
4. On the **Backup policy** tab, select a Backup policy that defines the backup schedule and the retention duration, and then select **Next**.

    :::image type="content" source="./media/backup-cosmos-db-configure-backup/backup-cosmos-configure-backup-backup-policy.png" alt-text="Screenshot shows the Backup policy selection." lightbox="./media/backup-cosmos-db-configure-backup/backup-cosmos-configure-backup-backup-policy.png":::

5. On the **Datasources** tab, select the datasource name.

   :::image type="content" source="./media/backup-cosmos-db-configure-backup/backup-cosmos-configure-backup-datasources-add.png" alt-text="Screenshot shows the account selection for backup." lightbox="./media/backup-cosmos-db-configure-backup/backup-cosmos-configure-backup-datasources-add.png":::

6. On the  **Select resources to backup** pane, select the Azure Cosmos DB account to back up, and then click **Select**.
   
   Ensure that the primary write region of the Azure Cosmos DB account is same as that of the Backup vault region.

   On the **Datasources** tab,  the Azure Backup service validates if it has all the necessary access permissions to connect to the Cosmos DB account. If one or more access permissions are missing, one of the following  error messages appears:
   - **User cannot assign roles** or 
   - **Role assignment not done**.
   
   | **Error** | **Cause** | **Recommendation** |
   |-----------|-------------|
   | **User cannot assign roles** | This message appears when you (the backup admin) don’t have the **write access** on the Cosmos DB account as listed under **View details**. | To assign the necessary permissions on the required resources, select **Download role assignment template** to fetch the ARM template,  and run the template as an administrator. |
   | **Role assignment not done** | This message appears when you (the backup admin) have the **write access** on the Cosmos DB account to assign missing permissions as listed under **View details**. | To grant permissions inline, select **Assign missing roles**. |

   Once the permission assignment process starts, the missing access permissions on the Cosmos DB account are granted to the backup vault. You can define the scope at which the access permissions must be granted. When the action is complete, revalidation starts.
 
7. After the role assignment validation shows **Success**,  select **Next**.

   :::image type="content" source="./media/backup-cosmos-db-configure-backup/backup-cosmos-configure-backup-datasources-added.png" alt-text="Screenshot shows the role assignment validation is successful." lightbox="./media/backup-cosmos-db-configure-backup/backup-cosmos-configure-backup-datasources-added.png":::

8. On the **Review + configure** tab, select **Configure backup**.

   :::image type="content" source="./media/backup-cosmos-db-configure-backup/backup-cosmos-configure-backup-review.png" alt-text="Screenshot to review and configure backup." lightbox="./media/backup-cosmos-db-configure-backup/backup-cosmos-configure-backup-review.png":::

9. Protected item is now created.

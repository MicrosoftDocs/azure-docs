---
title: Include file
description: Include file
ms.service: azure-backup
ms.topic: include
author: AbhishekMallick-MS
ms.author: v-mallicka
ms.date: 09/25/2026
---

## Configure backup

To configure backup for Azure Database for PostgreSQL – flexible server using Azure Backup, you can use one of the following methods:

- Azure Database for PostgreSQL – flexible server: Database manage pane
- Backup vault
- Resiliency

To configure backup on the Azure Database for PostgreSQL - Flexible Server via Resiliency, follow these steps:

1. Go to **Resiliency**, and then select **Overview** > **+ Configure protection**.

   :::image type="content" source="./media/configure-postgresql-flexible-server-backup/start-configure-protection-for-database.png" alt-text="Screenshot shows how to initiate the database protection. " lightbox="./media/configure-postgresql-flexible-server-backup/start-configure-protection-for-database.png":::

   Alternatively, for configuring backup from the **Backup vault** pane, go to the **Backup vault** > **Overview**, and then select **+ Backup**.

   To configure backup from the **Database manage** pane, go to the **PostgreSQL - flexible server** pane, and then select **Settings** > **LTR (Vaulted Backups)**.

2. On the **Configure protection** pane, select **Resource managed by** as **Azure**, **Datasource type** as **Azure PostgreSQL flexible server/elastic cluster**, and **Solution** as **Azure Backup**, and then select **Continue**.

3. On the **Configure Backup** pane, on the **Basics** tab, check if **Datasource type** appears as **Azure PostgreSQL flexible server/elastic cluster**, select **Select vault** under **Vault** and choose an existing Backup vault from the dropdown list, and then select **Next**.

   If you don't have a Backup vault, [create a new one](../articles/backup/create-manage-backup-vault.md#create-a-backup-vault). 

4. On the **Backup policy** tab, select a Backup policy that defines the backup schedule and the retention duration, and then select **Next**.

   If you don't have a Backup policy, [create one on the go](../articles/backup/backup-azure-database-postgresql-flex.md#create-a-backup-policy).

5. On the **Datasources** tab, select the backup type **v1 (logical backups)**.

   :::image type="content" source="./media/configure-postgresql-flexible-server-backup/datasources-backup-type.png" alt-text="Screenshot shows the backup type selection for backup." lightbox="./media/configure-postgresql-flexible-server-backup/datasources-backup-type.png":::

   > [!NOTE]
   > The backup type determines which stack protects the datasource. **v1 (logical backups)** uses the `pg_dump` based solution described in this article. A datasource can be protected by only one stack at a time, because multiple protection isn't supported.

6. On the **Select resources to backup** pane, select the flexible server to protect, and then select **Select**.

   > [!NOTE]
   > - Flexible servers larger than 1 TB aren't supported.
   > - Flexible servers on Premium SSD v2 storage aren't supported.
   > - Elastic clusters aren't supported.

   > [!TIP]
   > [Azure Backup for PostgreSQL flexible server and elastic cluster (v2)](../articles/backup/backup-azure-postgresql-flex-server-elastic-cluster-v2-overview.md) takes physical backups from managed disk snapshots instead of logical (`pg_dump` based) backups, and addresses the limitations of the generally available v1 solution.
   > - It protects both PostgreSQL flexible servers and elastic clusters.
   > - It supports flexible servers and elastic clusters up to 32 TB on Premium SSD v1 and up to 64 TB on Premium SSD v2, instead of the 1-TB limit.

   Once you're on the **Datasources** tab,  the Azure Backup service validates if it has all the necessary access permissions to connect to the server. If one or more access permissions are missing, one of the following  error messages appears – **User cannot assign roles** or **Role assignment not done**.

   - **User cannot assign roles**: This message appears when you (the backup admin) don’t have the **write access** on the PostgreSQL - flexible Server as listed under **View details**. To assign the necessary permissions on the required resources, select **Download role assignment template** to fetch the ARM template,  and run the template as a PostgreSQL database administrator. Once the template is run successfully, select **Revalidate**.

   - **Role assignment not done**: This message appears when you (the backup admin) have the **write access** on the PostgreSQL – flexible Server to assign missing permissions as listed under **View details**. To grant permissions on the PostgreSQL - flexible Server inline, select **Assign missing roles**. 

     Once the process starts, the [missing access permissions](../articles/backup/backup-azure-database-postgresql-overview.md#azure-backup-authentication-with-the-postgresql-server) on the PostgreSQL – flexible servers are granted to the backup vault. You can define the scope at which the access permissions must be granted. When the action is complete, revalidation starts.
 
7. Once the role assignment validation shows **Success**,  select **Next** to proceed to last step of submitting the operation.

8. On the **Review + configure** tab, select **Configure backup**.

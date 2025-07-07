---
title: Include file
description: Include file
ms.service: azure-backup
ms.topic: include
ms.date: 02/28/2025
author: jyothisuri
ms.author: jsuri
---

## Configure backup  for the database

To configure backup for Azure PostgreSQL – Flexible Server using Azure Backup, you can use one of the following methods:

- Azure PostgreSQL – Flexible Server: Database manage pane
- Backup vault
- Azure Business Continuity Center

To configure backup on the Azure Database for PostgreSQL - Flexible Server via Azure Business Continuity Center, follow these steps:

1. Go to **Business Continuity Center**, and then select **Overview** > **+ Configure protection**.

   :::image type="content" source="./media/configure-postgresql-flexible-server-backup/start-configure-protection-for-database.png" alt-text="Screenshot shows how to initiate the database protection. " lightbox="./media/configure-postgresql-flexible-server-backup/start-configure-protection-for-database.png":::

   Alternatively, for configuring backup from the **Backup vault** pane, go to the **Backup vault** > **Overview**, and then select **+ Backup**.

   To configure backup from the **Database manage** pane, go to the **PostgreSQL - flexible server** pane, and then select **Settings** > **LTR (Vaulted Backups)**.

2. On the **Configure protection** pane, select **Resource managed by** as **Azure**, **Datasource type** as **Azure Database for PostgreSQL flexible servers**, and **Solution** as **Azure Backup**, and then select **Continue**.

   :::image type="content" source="./media/configure-postgresql-flexible-server-backup/configure-protection-pane.png" alt-text="Screenshot shows the datasource and solution selection." lightbox="./media/configure-postgresql-flexible-server-backup/configure-protection-pane.png":::

3. On the **Configure Backup** pane, on the **Basics** tab, check if **Datasource type** appears as **Azure Database for PostgreSQL flexible servers**, click **Select vault** under **Vault** and choose an existing Backup vault from the dropdown list, and then select **Next**.

   If you don't have a Backup vault, [create a new one](../articles/backup/create-manage-backup-vault.md#create-a-backup-vault). 

   :::image type="content" source="./media/configure-postgresql-flexible-server-backup/choose-backup-vault.png" alt-text="Screenshot shows the Backup vault selection." lightbox="./media/configure-postgresql-flexible-server-backup/choose-backup-vault.png":::
         
4. On the **Backup policy** tab, select a Backup policy that defines the backup schedule and the retention duration, and then select **Next**.

   If you don't have a Backup policy, [create one on the go](../articles/backup/backup-azure-database-postgresql-flex.md#create-a-backup-policy).

   :::image type="content" source="./media/configure-postgresql-flexible-server-backup/choose-backup-policy.png" alt-text="Screenshot shows the Backup policy selection." lightbox="./media/configure-postgresql-flexible-server-backup/choose-backup-policy.png":::

5. On the **Datasources** tab, choose the datasource name.
6. On the  **Select resources to backup** pane, select the Azure PostgreSQL – Flexible Servers to back up, and then click **Select**.

   >[!Note]
   >Ensure that you choose the Azure PostgreSQL – flexible Servers in the same region as that of the vault.

   :::image type="content" source="./media/configure-postgresql-flexible-server-backup/choose-database-for-backup.png" alt-text="Screenshot shows the database selection for backup." lightbox="./media/configure-postgresql-flexible-server-backup/choose-database-for-backup.png":::

   Once you're on the **Datasources** tab,  the Azure Backup service validates if it has all the necessary access permissions to connect to the server. If one or more access permissions are missing, one of the following  error messages appears – **User cannot assign roles** or **Role assignment not done**.

   - **User cannot assign roles**: This message appears when you (the backup admin) don’t have the **write access** on the PostgreSQL - flexible Server as listed under **View details**. To assign the necessary permissions on the required resources, select **Download role assignment template** to fetch the ARM template,  and run the template as a PostgreSQL database administrator. Once the template is run successfully, select **Revalidate**.

     :::image type="content" source="./media/configure-postgresql-flexible-server-backup/user-cannot-assign-role.png" alt-text="Screenshot shows the role assignment using a template." lightbox="./media/configure-postgresql-flexible-server-backup/user-cannot-assign-role.png":::

   - **Role assignment not done**: This message appears when you (the backup admin) have the **write access** on the PostgreSQL – flexible Server to assign missing permissions as listed under **View details**. To grant permissions on the PostgreSQL - flexible Server inline, select **Assign missing roles**. 

     :::image type="content" source="./media/configure-postgresql-flexible-server-backup/role-assignment-not-done.png" alt-text="Screenshot shows the role assignment using the Azure portal." lightbox="./media/configure-postgresql-flexible-server-backup/role-assignment-not-done.png":::

     Once the process starts, the [missing access permissions](../articles/backup/backup-azure-database-postgresql-overview.md#azure-backup-authentication-with-the-postgresql-server) on the PostgreSQL – flexible servers are granted to the backup vault. You can define the scope at which the access permissions must be granted. When the action is complete, revalidation starts.
 
7. Once the role assignment validation shows **Success**,  select **Next** to proceed to last step of submitting the operation.

   :::image type="content" source="./media/configure-postgresql-flexible-server-backup/role-assignment-success.png" alt-text="Screenshot shows the role assignment validation is successful." lightbox="./media/configure-postgresql-flexible-server-backup/role-assignment-success.png":::

8. On the **Review + configure** tab, select **Configure backup**.
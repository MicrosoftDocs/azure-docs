---
title: "Tutorial: Migrate TDE-enabled databases (preview) to Azure SQL in Azure Data Studio"
titleSuffix: Azure Database Migration Service
description: Learn how to migrate on-premises SQL Server TDE-enabled databases (preview) to Azure SQL by using Azure Data Studio and Azure Database Migration Service.
author: croblesm
ms.author: roblescarlos
ms.reviewer: randolphwest
ms.date: 10/10/2023
ms.service: dms
ms.topic: tutorial
ms.custom:
  - sql-migration-content
---
# Tutorial: Migrate TDE-enabled databases (preview) to Azure SQL in Azure Data Studio

For securing a SQL Server database, you can take precautions like designing a secure system, encrypting confidential assets, and building a firewall. However, physical theft of media like drives or tapes can still compromise the data.

TDE provides a solution to this problem, with real-time I/O encryption/decryption of data at rest (data and log files) by using a symmetric database encryption key (DEK) secured by a certificate. For more information about migrating TDE certificates manually, see [Move a TDE Protected Database to Another SQL Server](/sql/relational-databases/security/encryption/move-a-tde-protected-database-to-another-sql-server).

When you migrate a TDE-protected database, the certificate (asymmetric key) used to open the database encryption key (DEK) must also be moved along with the source database. Therefore, you need to recreate the server certificate in the `master` database of the target SQL Server for that instance to access the database files.

You can use the [Azure SQL Migration extension for Azure Data Studio](/sql/azure-data-studio/extensions/azure-sql-migration-extension) to help you migrate TDE-enabled databases (preview) from an on-premises instance of SQL Server to Azure SQL.

The TDE-enabled database migration process automates manual tasks such as backing up the database certificate keys (DEK), copying the certificate files from the on-premises SQL Server to the Azure SQL target, and then reconfiguring TDE for the target database again.

  > [!IMPORTANT]  
  > Currently, only Azure SQL Managed Instance targets are supported.

In this tutorial, you learn how to migrate the example `AdventureWorksTDE` encrypted database from an on-premises instance of SQL Server to an Azure SQL managed instance.

> [!div class="checklist"]
>  
> - Open the Migrate to Azure SQL wizard in Azure Data Studio
> - Run an assessment of your source SQL Server databases
> - Configure your TDE certificates migration
> - Connect to your Azure SQL target
> - Start your TDE certificate migration and monitor progress to completion

## Prerequisites

Before you begin the tutorial:

- [Download and install Azure Data Studio](/sql/azure-data-studio/download-azure-data-studio).

- [Install the Azure SQL Migration extension](/sql/azure-data-studio/extensions/azure-sql-migration-extension) from Azure Data Studio Marketplace.

- Run Azure Data Studio as Administrator.

- Have an Azure account that is assigned to one of the following built-in roles:
  - Contributor for the target managed instance (and Storage Account to upload your backups of the TDE certificate files from SMB network share).
  - Reader role for the Azure Resource Groups containing the target managed instance or the Azure storage account.
  - Owner or Contributor role for the Azure subscription (required if creating a new DMS service).
  - As an alternative to using the above built-in roles, you can assign a custom role. For more information, see [Custom roles: Online SQL Server to SQL Managed Instance migrations using ADS](resource-custom-roles-sql-db-managed-instance-ads.md).

- Create a target instance of [Azure SQL Managed Instance](/azure/azure-sql/managed-instance/instance-create-quickstart).

- Ensure that the login that you use to connect to the SQL Server source is a member of the **sysadmin** server role.

- The machine in which Azure Data Studio runs the TDE-enabled database migration should have connectivity to both sources and target SQL servers.

## Open the Migrate to Azure SQL wizard in Azure Data Studio

To open the Migrate to Azure SQL wizard:

1. In Azure Data Studio, go to **Connections**. Connect to your on-premises instance of SQL Server. You also can connect to SQL Server on an Azure virtual machine.

1. Right-click the server connection and select **Manage**.

   :::image type="content" source="media/tutorial-transparent-data-encryption-migration-ads/azure-data-studio-manage-panel.png" alt-text="Screenshot that shows a server connection and the Manage option in Azure Data Studio." lightbox="media/tutorial-transparent-data-encryption-migration-ads/azure-data-studio-manage-panel.png":::

1. In the server menu under **General**, select **Azure SQL Migration**.

   :::image type="content" source="media/tutorial-transparent-data-encryption-migration-ads/launch-migrate-to-azure-sql-wizard-1.png" alt-text="Screenshot that shows the Azure Data Studio server menu.":::

1. In the Azure SQL Migration dashboard, select **Migrate to Azure SQL** to open the migration wizard.

   :::image type="content" source="media/tutorial-transparent-data-encryption-migration-ads/launch-migrate-to-azure-sql-wizard-2.png" alt-text="Screenshot that shows the Migrate to Azure SQL wizard.":::

1. On the first page of the wizard, start a new session or resume a previously saved session.

## Run database assessment

1. In **Step 1: Databases for assessment** in the Migrate to Azure SQL wizard, select the databases you want to assess. Then, select **Next**.

   :::image type="content" source="media/tutorial-transparent-data-encryption-migration-ads/assessment-database-selection.png" alt-text="Screenshot that shows selecting a database for assessment." lightbox="media/tutorial-transparent-data-encryption-migration-ads/assessment-database-selection.png":::

1. In **Step 2: Assessment results**, complete the following steps:

   1. In **Choose your Azure SQL target**, select **Azure SQL Managed Instance**.

      :::image type="content" source="media/tutorial-transparent-data-encryption-migration-ads/assessment-target-selection.png" alt-text="Screenshot that shows selecting the Azure SQL Managed Instance target." lightbox="media/tutorial-transparent-data-encryption-migration-ads/assessment-target-selection.png":::

   1. Select **View/Select** to view the assessment results.

      :::image type="content" source="media/tutorial-transparent-data-encryption-migration-ads/assessment.png" alt-text="Screenshot that shows view/select assessment results." lightbox="media/tutorial-transparent-data-encryption-migration-ads/assessment.png":::

   1. In the assessment results, select the database, and then review the assessment findings. In this example, you can see the `AdventureWorksTDE` database is protected with transparent data encryption (TDE). The assessment is recommending to migrate the TDE certificate before migrating the source database to the managed instance target.

      :::image type="content" source="media/tutorial-transparent-data-encryption-migration-ads/assessment-findings-details.png" alt-text="Screenshot that shows assessment findings report." lightbox="media/tutorial-transparent-data-encryption-migration-ads/assessment-findings-details.png":::

   1. Choose **Select** to open the TDE migration configuration panel.

## Configure TDE migration settings

1. In the **Encrypted database selected** section, select **Export my certificates and private key to the target**.

   :::image type="content" source="media/tutorial-transparent-data-encryption-migration-ads/tde-migration-configuration.png" alt-text="Screenshot that shows the TDE migration configuration." lightbox="media/tutorial-transparent-data-encryption-migration-ads/tde-migration-configuration.png":::

   > [!IMPORTANT]  
   > The **Info box** section describes the required permissions to export the DEK certificates.
   >  
   > You must ensure the SQL Server service account has write access to network share path you will use to backup the DEK certificates. Also, the current user should have administrator privileges on the computer where this network path exists.

1. Enter the **network path**.

   :::image type="content" source="media/tutorial-transparent-data-encryption-migration-ads/tde-migration-network-share.png" alt-text="Screenshot that shows the TDE migration configuration for a network share." lightbox="media/tutorial-transparent-data-encryption-migration-ads/tde-migration-network-share.png":::

   Then check **I give consent to use my credentials for accessing the certificates.** With this action, you're allowing the database migration wizard to back up your DEK certificate into the network share.

1. If you don't want the migration wizard, help you migrate TDE-enabled databases. Select **I don't want Azure Data Studio to export the certificates.** to skip this step.

   :::image type="content" source="media/tutorial-transparent-data-encryption-migration-ads/tde-migration-configuration-stop.png" alt-text="Screenshot that shows how to decline the TDE migration." lightbox="media/tutorial-transparent-data-encryption-migration-ads/tde-migration-configuration-stop.png":::

   > [!IMPORTANT]  
   > You must migrate the certificates before proceeding with the migration otherwise the migration will fail. For more information about migrating TDE certificates manually, see [Move a TDE Protected Database to Another SQL Server](/sql/relational-databases/security/encryption/move-a-tde-protected-database-to-another-sql-server).

1. If you want to proceed with the TDE certification migration, select **Apply**.

   :::image type="content" source="media/tutorial-transparent-data-encryption-migration-ads/tde-migration-configuration-apply.png" alt-text="Screenshot that shows how to apply the TDE migration configuration." lightbox="media/tutorial-transparent-data-encryption-migration-ads/tde-migration-configuration-apply.png":::

   The TDE migration configuration panel will close, but you can select **Edit** to modify your network share configuration at any time. Select **Next** to continue the migration process.

   :::image type="content" source="media/tutorial-transparent-data-encryption-migration-ads/tde-migration-configuration-edit.png" alt-text="Screenshot that shows how to edit the TDE migration configuration." lightbox="media/tutorial-transparent-data-encryption-migration-ads/tde-migration-configuration-edit.png":::

## Configure migration settings

In **Step 3: Azure SQL target** in the Migrate to Azure SQL wizard, complete these steps for your target managed instance:

1. Select your Azure account, Azure subscription, the Azure region or location, and the resource group that contains the managed instance.

   :::image type="content" source="media/tutorial-transparent-data-encryption-migration-ads/configuration-azure-target.png" alt-text="Screenshot that shows Azure account details." lightbox="media/tutorial-transparent-data-encryption-migration-ads/configuration-azure-target.png":::

1. When you're ready, select **Migrate certificates** to start the TDE certificates migration.

## Start and monitor the TDE certificate migration

1. In **Step 3: Migration Status**, the **Certificates Migration** panel will open. The TDE certificates migration progress details are shown on the screen.

   :::image type="content" source="media/tutorial-transparent-data-encryption-migration-ads/tde-migration-start.png" alt-text="Screenshot that shows how the TDE migration process starts." lightbox="media/tutorial-transparent-data-encryption-migration-ads/tde-migration-start.png":::

1. Once the TDE migration is completed (or if it has failures), the page displays the relevant updates.

   :::image type="content" source="media/tutorial-transparent-data-encryption-migration-ads/tde-migration-completed.png" alt-text="Screenshot that shows how the TDE migration process continues." lightbox="media/tutorial-transparent-data-encryption-migration-ads/tde-migration-completed.png":::

1. In case you need to retry the migration, select **Retry migration**.

   :::image type="content" source="media/tutorial-transparent-data-encryption-migration-ads/tde-migration-retry.png" alt-text="Screenshot that shows how to retry the TDE migration." lightbox="media/tutorial-transparent-data-encryption-migration-ads/tde-migration-retry.png":::

1. When you're ready, select **Done** to continue the migration wizard.

   :::image type="content" source="media/tutorial-transparent-data-encryption-migration-ads/tde-migration-done.png" alt-text="Screenshot that shows how to complete the TDE migration." lightbox="media/tutorial-transparent-data-encryption-migration-ads/tde-migration-done.png":::

1. You can monitor the process for each TDE certificate by selecting **Migrate certificates**.

1. Select **Next** to continue the migration wizard until you complete the database migration.

   :::image type="content" source="media/tutorial-transparent-data-encryption-migration-ads/database-migration-continue.png" alt-text="Screenshot that shows how to continue the database migration." lightbox="media/tutorial-transparent-data-encryption-migration-ads/database-migration-continue.png":::

   Check the following step-by-step tutorials for more information about migrating databases online or offline to Azure SQL Managed Instance targets:

   - [Tutorial: Migrate SQL Server to Azure SQL Managed Instance online](./tutorial-sql-server-managed-instance-offline-ads.md)
   - [Tutorial: Migrate SQL Server to Azure SQL Managed Instance offline](./tutorial-sql-server-managed-instance-offline-ads.md)

## Post-migration steps

Your target managed instance should now have the databases, and their respective certificates migrated. To verify the current status of the recently migrated database, copy and paste the following example into a new query window on Azure Data Studio while connected to your managed instance target. Then, select **Run**.

```sql
USE master;
GO

SELECT db_name(database_id),
    key_algorithm,
    encryption_state_desc,
    encryption_scan_state_desc,
    percent_complete
FROM sys.dm_database_encryption_keys
WHERE database_id = DB_ID('Your database name');
GO
```

The query returns the information about the database, the encryption status and the pending percent complete. In this case, it's zero because the TDE certificate has been already completed.

:::image type="content" source="media/tutorial-transparent-data-encryption-migration-ads/tde-query.png" alt-text="Screenshot that shows the results returned by the TDE query provided in this section.":::

For more information about encryption with SQL Server, see [Transparent data encryption (TDE)](/sql/relational-databases/security/encryption/transparent-data-encryption).

## Limitations

The following table describes the current status of the TDE-enabled database migrations support by Azure SQL target:

| Target | Support | Status |
| --- | --- | :---: |
| Azure SQL Database | No | |
| Azure SQL Managed Instance | Yes | Preview |
| SQL Server on Azure VM | No | |

## Related content

- [Migrate databases with Azure SQL Migration extension for Azure Data Studio](migration-using-azure-data-studio.md)
- [Tutorial: Migrate SQL Server to Azure SQL Database - Offline](tutorial-sql-server-azure-sql-database-offline.md)
- [Tutorial: Migrate SQL Server to Azure SQL Managed Instance - Online](tutorial-sql-server-managed-instance-online-ads.md)
- [Tutorial: Migrate SQL Server to SQL Server On Azure Virtual Machines - Online](tutorial-sql-server-to-virtual-machine-online-ads.md)

---
title: Restore Azure PostgreSQL-Flexible server as Files using Azure portal
description: Learn about how to restore Azure PostgreSQL-Flexible server as Files.
ms.topic: how-to
ms.date: 05/12/2025
ms.service: azure-backup
ms.custom:
  - ignite-2024
author: jyothisuri
ms.author: jsuri
---

# Restore Azure PostgreSQL-Flexible server as Files using Azure portal

This article describes how to restore an Azure PostgreSQL-Flexible server as Files backed up using Azure portal.

## Prerequisites

Before you restore from Azure Database for PostgreSQL Flexible server backups, review the following prerequisites:

- Ensure that you have the required [permissions for the restore operation](backup-azure-database-postgresql-flex-overview.md#permissions-for-backup).

- Backup data is stored in the Backup vault as a blob within the Microsoft tenant. During a restore operation, the backup data is copied from one storage account to another across tenants. Ensure that the target storage account for the restore has the **AllowCrossTenantReplication** property set to **true**.

- Ensure the target storage account for restoring backup as a file is accessible via a public network. If the storage account uses a private endpoint, [update its public network access settings](backup-azure-database-postgresql-flex-manage.md#enable-public-network-access-for-the-database-storage-account) before executing a restore operation.

## Restore Azure PostgreSQL - Flexible server backups as files

>[!Note]
>Restore operation is a two step process: 
>1. Restore the backup from Backup vault to a storage container.  
>2. Restore the backup files from storage container to a new or existing flexible server. 

To restore Azure PostgreSQL-Flexible database, Follow these steps:

1. Go to **Backup vault** > **Backup Instances**. Select the PostgreSQL - Flexible server to be restored and select **Restore**.

   Alternatively, go to [Backup center](./backup-center-overview.md) and select **Restore**.	  
  
1. Select the point in time you would like to restore by using **Select restore point**. Change the date range by selecting **Time period**.

1. Choose the target storage account and container in **Restore parameters** tab. Select **Validate** to check the restore parameters permissions before the final review and restore.

1. Once the validation is successful, select **Review + restore**.

1. After final review of the parameters, select **Restore** to restore the selected PostgreSQL - Flexible server backup in target storage account.
   
1. Submit the Restore operation and track the triggered job under **Backup jobs**.

After the restore job is completed successfully, go to the storage account container to view the restored databases as files (`.sql` files) from your PostgreSQL – Flexible server. Azure Backup also generates the following backup files:

- `Database.sql file` per database: Contains data and schema information for a particular database.  
- `Roles.sql files` for entire instance: Contains all role information that exists at server level.
- `Tablespace.sql file`: Tablespace file.
- `Schema.sql file`: Contains schema information for all the databases on the server.

  >[!Note]
  >We recommend you not to run this script on the PostgreSQL - Flexible server because the schema is already part of the `database.sql` script. 

## Restore the backup files from storage container to a new or existing PostgreSQL – Flexible server

To restore the backup files from storage container to a new or existing PostgreSQL – Flexible server, follow these steps:

1. Ensure that all required [extensions are enabled](/azure/postgresql/extensions/how-to-allow-extensions?tabs=allow-extensions-portal) on the new target Flexible server. 
1. [Match the server parameter](/azure/postgresql/flexible-server/how-to-server-parameters-list-all?tabs=portal-list) values from the source PostgreSQL database to the Azure Database for PostgreSQL by accessing the **Server parameters** section in the Azure portal and manually updating the values accordingly. Save the parameter changes, and then restart the Azure Database for PostgreSQL - Flexible server to apply the new configuration. 
1. If **Microsoft Entra Authentication** is required on the new server, enable it and create the relevant Microsoft Entra admins. 
1. Create a new database for restoration.

   >[!Note]
   >Before the database restoration, you must create a new, empty database. Ensure that your user account has the **`CREATEDB`** permission.  
   >
   >To create the database, use the `CREATE DATABASE Database_name` command.

1. Restore the database using the `database.sql file` as the target admin user.
1.After the target database is created, restore the data in this database (from the dump file) from an Azure storage account by running the following command:

   ```azurecli-interactive
   az storage blob download --container-name <container-name> --name <blob-name> --account-name <storage-account-name> --account-key <storage-account-key> --file - | pg_restore -h <postgres-server-url> -p <port> -U <username> -d <database-name> --no-owner -v – 
   ```
   
   - `--account-name`: Name of the Target Storage Account. 
   - `--container-name`: Name of the blob container. 
   - `--blob-name`: Name of the blob. 
   - `--account-key`: Storage Account Key. 
   - `-Fd`: The directory format. 
   - `-j`: The number of jobs. 
   - `-C`: Begin the output with a command to create the database itself and then reconnect to it. 
 
   Alternatively, you can download the backup file and run the restore directly. 

1. Restore only the required roles and privileges, and ignore the [common errors](backup-azure-database-postgresql-flex-support-matrix.md#restore-limitations). Skip this step if you're performing the restoration for compliance requirements and data retrieval, as a local admin.

## Restore roles and users for the restored databases

Vaulted backups are primarily restored for compliance needs such as, testing and audits. You can sign in as a local admin and restore using the `database.sql` file; no other roles are needed for data retrieval.

For other uses like accidental deletion protection or disaster recovery, ensure necessary roles are created as per your organization needs. Avoid duplications between `roles.sql` and `database.sql`.
 
- **Restore the same Flexible server**: Role restoration might not be necessary. 
- **Restore to a different Flexible server**: Use the `roles.sql` file to recreate the required roles. 

When you restore from `roles.sql`, some roles or attributes might not be valid for the new target server.

For environments with superuser access (on-premises or VMs), you can run all commands seamlessly.

### Key considerations for the Flexible server scenario

Here are the key considerations:

- **Remove Superuser-Only Attributes**: On Flexible server, there's no superuser privileges. So, remove attributes, such as `NOSUPERUSER` and `NOBYPASSRLS` from the roles dump. 
- **Exclude Service-Specific Users**: Exclude users specific to Flexible Server services (` azure_su`, `azure_pg_admin`, `replication`, `localadmin`, `Entra Admin`). These specific service roles are automatically recreated when administrators are added to the new Flexible server. 

Before you restore the database objects, ensure that you properly dump and clean up the roles. To perform this action, download the `roles.sql`script from your storage container and create all required logins. 
- **Create Non-Entra Roles**: Use a local admin account to run the role creation scripts. 
- **Create Microsoft Entra Roles**: If you need to create roles for Microsoft Entra users, use a Microsoft Entra administrator account to run the necessary scripts. 

You can download the roles script from your storage account as shown in the following screenshot:

When you migrate the output file, `roles.sql` might include certain roles and attributes that aren't applicable in the new environment. You must consider the following:

- **Removing attributes that can be set only by superusers**: If you migrate to an environment where you don't have superuser privileges, remove attributes such as *NOSUPERUSER* and *NOBYPASSRLS* from the roles dump.
- **Excluding service-specific users**: Exclude Single server service users, such as `azure_superuser` or `azure_pg_admin`. These are specific to the service and are created automatically in the new environment.

Use the following sed command to clean up your roles dump:

```
sed -i '/azure_superuser/d; /azure_pg_admin/d; /azuresu/d; /^CREATE ROLE replication/d; /^ALTER ROLE replication/d; /^ALTER ROLE/ {s/NOSUPERUSER//; s/NOBYPASSRLS//;}' roles.sql
```

This command deletes the lines containing `azure_superuser`, `azure_pg_admin`, `azuresu`, lines starting with *CREATE ROLE* replication and *ALTER ROLE* replication, and removes the *NOSUPERUSER* and *NOBYPASSRLS* attributes from *ALTER ROLE* statements.
                          
## Next steps

[Manage backup of Azure PostgreSQL - Flexible Server using Azure portal](backup-azure-database-postgresql-flex-manage.md).

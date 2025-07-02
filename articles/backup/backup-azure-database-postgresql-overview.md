---
title: Overview of Azure Database for PostgreSQL Backup
description: Get an overview of the Azure Database for PostgreSQL backup solution.
ms.topic: overview
ms.date: 04/16/2025
ms.service: azure-backup
author: jyothisuri
ms.author: jsuri
# Customer intent: "As a database administrator, I want to implement long-term backup solutions for Azure Database for PostgreSQL, so that I can ensure data compliance and recoverability over an extended period."
---

# What is Azure Database for PostgreSQL backup?

Azure Backup and Azure database services have come together to build an enterprise-class backup solution for Azure Database for PostgreSQL servers that retains backups for up to 10 years. Besides long-term retention, the solution offers the following capabilities:

- Customer-controlled scheduled and on-demand backups at the individual database level.
- Database-level restores to any Azure Database for PostgreSQL server or to any type of blob storage.
- Central monitoring of all operations and jobs.
- Storage of backups in separate security and fault domains. If the source server or subscription becomes compromised, the backups remain safe in the [Azure Backup vault](./backup-vault-overview.md) (in Azure Backup managed storage accounts).
- Use of `pg_dump` for greater flexibility in restores. You can restore across database versions.

You can use this solution independently or in addition to the [native backup solution in Azure PostgreSQL](/azure/postgresql/concepts-backup), which offers retention for up to 35 days. The native solution is suited for operational recoveries, such as when you want to recover from the latest backups. The Azure Backup solution helps you with your compliance needs and provides a more granular and flexible backup/restore capability.

## <a name = "changes-to-vaulted-backups-for-postgresql-single-server"></a>Changes to vaulted backups for PostgreSQL single servers

The *single server* deployment option for Azure Database for PostgreSQL retired on *March 28, 2025*. On that date, changes were implemented to Azure Backup for PostgreSQL single servers. [Learn more about the retirement](/azure/postgresql/migrate/whats-happening-to-postgresql-single-server).

Azure Backup provides compliance and resiliency solutions, including vaulted backups and long-term retention of restore points. On March 28, 2025, the following changes took effect:

- The backup configuration isn't allowed for new PostgreSQL single-server workloads.
- All scheduled backup jobs are permanently discontinued.
- Creation of new backup policies or modification of existing ones for this workload isn't possible.

On the retirement date, scheduled backup jobs for PostgreSQL single-server databases permanently stopped. You can't create any new restore points.

However, your existing PostgreSQL single-server database backups are retained in accordance with the backup policy. The restore points will be deleted only after the expiration of the retention period. To retain the restore points indefinitely or to delete them before the expiration of their retention period, see the [Azure Business Continuity Center console](https://portal.azure.com/#view/Microsoft_Azure_BCDRCenter/AbcCenterMenuBlade/~/overview).

### Changes in billing

As of March 31, 2025, you're no longer charged the Protected Instance (PI) fee for protecting your PostgreSQL single-server databases. But the fee for storing your backups still applies. To avoid the storage fee, delete all restore points from the Azure Business Continuity Center.

> [!NOTE]
> Azure Backup retains the last restore point even after the expiration of its retention period. This feature ensures that you have access to the last restore point for future use. You can only delete the last restore point manually. If you want to delete the last restore point and avoid the storage fee, [stop the database protection](manage-azure-database-postgresql.md#stop-backup).

### Changes in restore

You can restore PostgreSQL single-server databases by using **Restore as Files**. Then you need to manually [create a new PostgreSQL flexible server](/azure/postgresql/migrate/how-to-migrate-using-dump-and-restore?tabs=psql) from the restored files.

> [!NOTE]
> The **Restore as Database** option isn't supported as of March 28, 2025, but **Restore as Files** is still supported.

## Backup process

1. As a backup admin, you can specify the PostgreSQL databases that you intend to back up. You can also specify the details of Azure Key Vault, which stores the credentials needed to connect to the specified databases. The database admin securely seeds these credentials in Key Vault.

1. The Azure Backup service validates that it has [appropriate permissions to authenticate](#azure-backup-authentication-with-the-azure-database-for-postgresql-server) with the specified Azure Database for PostgreSQL server and to back up its databases.

1. Azure Backup spins up a worker role (virtual machine), with a backup extension installed in it, to communicate with the protected Azure Database for PostgreSQL server. This extension consists of a coordinator and a PostgreSQL plugin. The coordinator triggers workflows for various operations, such as backup and restore. The plugin manages the actual data flow.

1. At the scheduled time, the coordinator instructs the plugin to start streaming the backup data from the Azure Database for PostgreSQL server by using `pg_dump` (custom).

1. The plugin sends the data directly to the Azure Backup managed storage accounts (masked by the Azure Backup vault), eliminating the need for a staging location. The data is encrypted through Microsoft-managed keys. The Azure Backup service stores the data in storage accounts.

:::image type="content" source="./media/backup-azure-database-postgresql-overview/backup-process.png" alt-text="Diagram that shows the backup process.":::

## <a name = "azure-backup-authentication-with-the-postgresql-server"></a>Azure Backup authentication with the Azure Database for PostgreSQL server

Azure Backup follows strict security guidelines from Azure. Permissions on the resource to be backed up aren't assumed. The user needs to explicitly give those permissions.

### Key Vault-based authentication model

The Azure Backup service needs to connect to the Azure Database for PostgreSQL server while taking each backup. Although a username and password (or a connection string) that correspond to the database are used to make this connection, these credentials aren't stored with Azure Backup. Instead, the database admin needs to securely seed these credentials in [Azure Key Vault as a secret](/azure/key-vault/secrets/about-secrets).

The workload admin is responsible for managing and rotating credentials. Azure Backup calls for the most recent secret details from the key vault to take the backup.

:::image type="content" source="./media/backup-azure-database-postgresql-overview/key-vault-based-authentication-model.png" alt-text="Diagram that shows the workload or database flow.":::

#### <a name = "set-of-permissions-needed-for-azure-postgresql-database-backup"></a>Permissions needed for PostgreSQL database backup

1. Grant the following access permissions to the Azure Backup vault's managed identity:

   - **Reader** access on the Azure Database for PostgreSQL server.
   - **Key Vault Secrets User** access on Key Vault (**Get** and **List** permissions on secrets).

1. Set network line-of-sight access on:

   - Azure Database for PostgreSQL server: Set **Allow access to Azure services** to **Yes**.
   - Key Vault: Set **Allow trusted Microsoft services** to **Yes**.

1. Set the database user's backup privileges on the database.

> [!NOTE]
> You can grant these permissions within the [configure backup](backup-azure-database-postgresql.md#configure-a-backup-on-postgresql-databases) flow with a single click if you, as the backup admin, have write access on the intended resources. If you don't have the required permissions (when multiple personas are involved), use an Azure Resource Manager template.

#### <a name = "set-of-permissions-needed-for-azure-postgresql-database-restore"></a>Permissions needed for PostgreSQL database restore

Permissions for restore are similar to the ones that you need for backup. You need to [manually grant the permissions on the target Azure Database for PostgreSQL server and the corresponding key vault](#steps-for-manually-granting-access-on-the-azure-database-for-postgresql-server-and-on-the-key-vault). Unlike in the [configure backup](backup-azure-database-postgresql.md#configure-a-backup-on-postgresql-databases) flow, the experience to grant these permissions inline is currently not available.

Ensure that the database user (corresponding to the credentials stored in the key vault) has the following restore privileges on the database:

- Assign an `ALTER USER` username of `CREATEDB`.
- Assign the role `azure_pg_admin` to the database user.

<a name='azure-active-directory-based-authentication-model'></a>

### Microsoft Entra ID-based authentication model

An earlier authentication model was entirely based on Microsoft Entra ID. The Key Vault-based authentication model (as explained earlier) is now available as an alternative option to ease the configuration process.

To get an automated script and related instructions to use the Microsoft Entra ID-based authentication model, [download this document](https://download.microsoft.com/download/7/4/d/74d689aa-909d-4d3e-9b18-f8e465a7ebf5/OSSbkpprep_automated.docx). It grants an appropriate set of permissions to an Azure Database for PostgreSQL server for backup and restore.

> [!NOTE]
> All the newly configured protection takes place with the new Key Vault authentication model only. However, all the existing backup instances with protection configured through Microsoft Entra ID-based authentication will continue to exist and have regular backups taken. To restore these backups, you need to follow the Microsoft Entra ID-based authentication.

## Steps for manually granting access on the Azure Database for PostgreSQL server and on the key vault

To grant all the access permissions that Azure Backup needs, use the following steps.

### <a name = "access-permissions-on-the-azure-postgresql-server"></a>Access permissions on the Azure Database for PostgreSQL server

1. Set the Azure Backup vault's **Reader** access for the managed identity on the Azure Database for PostgreSQL server.

   :::image type="content" source="./media/backup-azure-database-postgresql-overview/set-reader-access-on-azure-postgresql-server-inline.png" alt-text="Screenshot that shows the option to set an Azure Backup vault's M S I Reader access on an Azure Database for PostgreSQL server." lightbox="./media/backup-azure-database-postgresql-overview/set-reader-access-on-azure-postgresql-server-expanded.png":::

1. Set network line-of-sight access on the Azure Database for PostgreSQL server by setting **Allow access to Azure services** to **Yes**.

   :::image type="content" source="./media/backup-azure-database-postgresql-overview/network-line-of-sight-access-on-azure-postgresql-server.png" alt-text="Screenshot that shows the option to set network line-of-sight access on an Azure Database for PostgreSQL server." lightbox="./media/backup-azure-database-postgresql-overview/network-line-of-sight-access-on-azure-postgresql-server.png":::

### <a name = "access-permissions-on-the-azure-key-vault-associated-with-the-postgresql-server"></a>Access permissions on the key vault

1. Set the Azure Backup vault's **Key Vault Secrets User** access for the managed identity on the key vault (**Get** and **List** permissions on secrets). To assign permissions, you can use role assignments or access policies. You don't need to add the permissions by using both options, because it doesn't help.

   - To use Azure role-based access control (Azure RBAC) authorization:

     1. In **Access policies**, set **Permission model** to **Azure role-based access control**.

        :::image type="content" source="./media/backup-azure-database-postgresql-overview/key-vault-secrets-user-access-inline.png" alt-text="Screenshot that shows the option to provide Key Vault Secrets User access." lightbox="./media/backup-azure-database-postgresql-overview/key-vault-secrets-user-access-expanded.png":::

     1. In **Access control (IAM)**, grant the Azure Backup vault's **Key Vault Secrets User** access for the managed identity on the key vault. Bearers of that role will be able to read secrets.

        :::image type="content" source="./media/backup-azure-database-postgresql-overview/grant-permission-to-applications-azure-rbac-inline.png" alt-text="Screenshot that shows the option to grant the Azure Backup vault's M S I Key Vault Secrets User access on the key vault." lightbox="./media/backup-azure-database-postgresql-overview/grant-permission-to-applications-azure-rbac-expanded.png":::

     For more information, see [Provide access to Key Vault keys, certificates, and secrets with Azure role-based access control](/azure/key-vault/general/rbac-guide?tabs=azure-cli).

   - To use access policies:

     1. In **Access policies**, set **Permission model** to **Vault access policy**.
     1. Set **Get** and **List** permissions on secrets.

     :::image type="content" source="./media/backup-azure-database-postgresql-overview/permission-model-is-set-to-vault-access-policy-inline.png" alt-text="Screenshot that shows the option to grant permission by using access policies." lightbox="./media/backup-azure-database-postgresql-overview/permission-model-is-set-to-vault-access-policy-expanded.png":::

     For more information, see [Assign a Key Vault access policy (legacy)](/azure/key-vault/general/assign-access-policy?tabs=azure-portal).  

1. Set network line-of-sight access on the key vault by setting **Allow trusted Microsoft services to bypass this firewall?** to **Yes**.

   :::image type="content" source="./media/backup-azure-database-postgresql-overview/network-line-of-sight-access-on-key-vault-inline.png" alt-text="Screenshot that shows selecting the option to allow trusted Microsoft services for network line-of-sight access on a key vault." lightbox="./media/backup-azure-database-postgresql-overview/network-line-of-sight-access-on-key-vault-expanded.png":::

### Database user's backup privileges on the database

Run the following query in the [pgAdmin](#use-the-pgadmin-tool) tool. Replace `username` with the database user ID.

```
DO $do$
DECLARE
sch text;
BEGIN
EXECUTE format('grant connect on database %I to %I', current_database(), 'username');
FOR sch IN select nspname from pg_catalog.pg_namespace
LOOP
EXECUTE format($$ GRANT USAGE ON SCHEMA %I TO username $$, sch);
EXECUTE format($$ GRANT SELECT ON ALL TABLES IN SCHEMA %I TO username $$, sch);
EXECUTE format($$ ALTER DEFAULT PRIVILEGES IN SCHEMA %I GRANT SELECT ON TABLES TO username $$, sch);
EXECUTE format($$ GRANT SELECT ON ALL SEQUENCES IN SCHEMA %I TO username $$, sch);
EXECUTE format($$ ALTER DEFAULT PRIVILEGES IN SCHEMA %I GRANT SELECT ON SEQUENCES TO username $$, sch);
END LOOP;
END;
$do$
```

> [!NOTE]  
> If a database for which you already configured backup is failing with `UserErrorMissingDBPermissions`, refer to [this troubleshooting guide](backup-azure-database-postgresql-troubleshoot.md) for assistance in resolving the problem.

## Use the pgAdmin tool

[Download the pgAdmin tool](https://www.pgadmin.org/download/) if you don't have it already. You can connect to the Azure Database for PostgreSQL server through this tool. Also, you can add databases and new users to this server.

:::image type="content" source="./media/backup-azure-database-postgresql-overview/connect-to-azure-postgresql-server-using-pg-admin-tool-inline.png" alt-text="Screenshot that shows the process to connect to an Azure Database for PostgreSQL server by using the P G admin tool." lightbox="./media/backup-azure-database-postgresql-overview/connect-to-azure-postgresql-server-using-pg-admin-tool-expanded.png":::

Create a new server with a name of your choice. Enter the host name/address. It's the same as the **Server name** value displayed in the Azure PostgreSQL resource view in the Azure portal.

:::image type="content" source="./media/backup-azure-database-postgresql-overview/create-new-server-using-pg-admin-tool-inline.png" alt-text="Screenshot that shows the options for creating a new server by using the P G admin tool." lightbox="./media/backup-azure-database-postgresql-overview/create-new-server-using-pg-admin-tool-expanded.png":::

:::image type="content" source="./media/backup-azure-database-postgresql-overview/enter-host-name-or-address-name-same-as--server-name-inline.png" alt-text="Screenshot that shows the Azure PostgreSQL resource view in the Azure portal, including the server name." lightbox="./media/backup-azure-database-postgresql-overview/enter-host-name-or-address-name-same-as--server-name-expanded.png":::

Ensure that you add the current client ID address to the firewall rules for the connection to go through.

:::image type="content" source="./media/backup-azure-database-postgresql-overview/add-current-client-id-address-to-firewall-rules.png" alt-text="Screenshot that shows the link for adding the current client ID address to firewall rules." lightbox="./media/backup-azure-database-postgresql-overview/add-current-client-id-address-to-firewall-rules.png":::

You can add new databases and database users to the server. For database users, select **Login/Group Role** to add roles. Ensure that **Can login?** is set to **Yes**.

:::image type="content" source="./media/backup-azure-database-postgresql-overview/add-new-databases-and-database-users-to-server-inline.png" alt-text="Screenshot that shows menu selections for adding new databases and database users to a server." lightbox="./media/backup-azure-database-postgresql-overview/add-new-databases-and-database-users-to-server-expanded.png":::

:::image type="content" source="./media/backup-azure-database-postgresql-overview/add-new-login-group-roles-inline.png" alt-text="Screenshot that shows menu selections for adding a new login or group role for database users." lightbox="./media/backup-azure-database-postgresql-overview/add-new-login-group-roles-expanded.png":::

:::image type="content" source="./media/backup-azure-database-postgresql-overview/set-can-login-to-yes-inline.png" alt-text="Screenshot that shows the toggle for allowing login set to Yes." lightbox="./media/backup-azure-database-postgresql-overview/set-can-login-to-yes-expanded.png":::

## Related content

- [Frequently asked questions for Azure Database for PostgreSQL backup](/azure/backup/backup-azure-database-postgresql-server-faq).
- [Back up Azure Database for PostgreSQL by using the Azure portal](backup-azure-database-postgresql.md).
- [Create a backup policy for PostgreSQL databases using REST API](backup-azure-data-protection-use-rest-api-create-update-postgresql-policy.md).
- [Configure backup for PostgreSQL databases using REST API](backup-azure-data-protection-use-rest-api-backup-postgresql.md).
- [Restore for PostgreSQL databases using REST API](restore-postgresql-database-use-rest-api.md).
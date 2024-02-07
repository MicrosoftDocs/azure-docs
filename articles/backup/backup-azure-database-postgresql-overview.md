---
title: About Azure Database for PostgreSQL backup
description: An overview on Azure Database for PostgreSQL backup
ms.topic: conceptual
ms.date: 01/24/2022
ms.service: backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# About Azure Database for PostgreSQL backup

Azure Backup and Azure Database Services have come together to build an enterprise-class backup solution for Azure Database for PostgreSQL servers that retains backups for up to 10 years. Besides long-term retention, the solution offers the following capabilities:

- Customer controlled scheduled and on-demand backups at the individual database level.
- Database-level restores to any PostgreSQL server or to any blob storage.
- Central monitoring of all operations and jobs.
- Backups are stored in separate security and fault domains. If the source server or subscription is compromised in any circumstances, the backups remain safe in the [Backup vault](./backup-vault-overview.md) (in Azure Backup managed storage accounts).
- Use of **pg_dump** allows a greater flexibility in restores. This helps you restore across database versions 

You can use this solution independently or in addition to the [native backup solution offered by Azure PostgreSQL](../postgresql/concepts-backup.md) that offers retention up to 35 days. The native solution is suited for operational recoveries, such as when you want to recover from the latest backups. The Azure Backup solution helps you with your compliance needs and more granular and flexible backup/restore.

## Backup process

1. As a backup admin, you can specify the Azure PostgreSQL databases that you intend to back up. Additionally, you can also specify the details of the Azure key vault that stores the credentials needed to connect to the specified database(s). These credentials are securely seeded by the database admin in the Azure key vault.
1. The backup service then validates if it has [appropriate permissions to authenticate](#azure-backup-authentication-with-the-postgresql-server) with the specified PostgreSQL server and to back up its databases.
1. Azure Backup spins up a worker role (VM) with a backup extension installed in it to communicate with the protected PostgreSQL server. This extension consists of a coordinator and a PostgreSQL plugin. The coordinator triggers workflows for various operations, such as backup and restore, and the plugin manages the actual data flow.
1. At the scheduled time, the coordinator communicates with the plugin, for it to start streaming the backup data from the PostgreSQL server using **pg_dump (custom)**.
1. The plugin sends the data directly to the Azure Backup managed storage accounts (masked by the Backup vault), eliminating the need for a staging location. The data is encrypted using Microsoft-managed keys and stored by the Azure Backup service in storage accounts.

 :::image type="content" source="./media/backup-azure-database-postgresql-overview/backup-process.png" alt-text="Diagram showing the backup process.":::

## Azure Backup authentication with the PostgreSQL server

Azure Backup follows strict security guidelines laid down by Azure; permissions on the resource to be backed up aren't assumed and need to be explicitly given by the user. 

### Key-vault based authentication model

The Azure Backup service needs to connect to the Azure PostgreSQL while taking each backup. While ‘username + password’ (or connection string), corresponding to the database, are used to make this connection, these credentials aren’t stored with Azure Backup. Instead, these credentials need to be securely seeded by the database admin in the [Azure key vault as a secret](../key-vault/secrets/about-secrets.md). The workload admin is responsible to manage and rotate credentials; Azure Backup calls for the most recent secret details from the key vault to take the backup.
 
:::image type="content" source="./media/backup-azure-database-postgresql-overview/key-vault-based-authentication-model.png" alt-text="Diagram showing the workload or database flow.":::

#### Set of permissions needed for Azure PostgreSQL database backup

1. Grant the following access permissions to the Backup vault’s MSI:

   - _Reader_ access on the Azure PostgreSQL server.
   - _Key Vault Secrets User_ (or get, list secrets) access on the Azure key vault.

1. Network line of sight access on:

   - The Azure PostgreSQL server – **Allow access to Azure services** flag to be set to **Yes**.
   - The key vault – **Allow trusted Microsoft services** flag to be set to **Yes**.

1. Database user’s backup privileges on the database

>[!Note]
>You can grant these permissions within the [configure backup](backup-azure-database-postgresql.md#configure-backup-on-azure-postgresql-databases) flow with a single click if you (the backup admin) have ‘write’ access on the intended resources, or use an ARM template if you don’t have the required permissions (when multiple personas are involved). 

#### Set of permissions needed for Azure PostgreSQL database restore

Permissions for restore are similar to the ones needed for backup and you need to grant the permissions on the target PostgreSQL server and its corresponding key vault. Unlike in configure backup flow, the experience to grant these permissions inline is currently not available. Therefore, you need to [manually grant the access on the Postgres server and the corresponding key vault](#grant-access-on-the-azure-postgresql-server-and-key-vault-manually).

Additionally, ensure that the database user (corresponding to the credentials stored in the key vault) has the following restore privileges on the database:

- ALTER USER username CREATEDB;
- Assign the role _azure_pg_admin_ to the database user.

<a name='azure-active-directory-based-authentication-model'></a>

### Microsoft Entra ID based authentication model

We had earlier launched a different authentication model that was entirely based on Microsoft Entra ID. However, we now provide the new key vault-based authentication model (as explained above) as an alternative option, which eases the configuration process. 

[Download this document](https://download.microsoft.com/download/7/4/d/74d689aa-909d-4d3e-9b18-f8e465a7ebf5/OSSbkpprep_automated.docx) to get an automated script and related instructions to use this authentication model. It’ll grant an appropriate set of permissions to an Azure PostgreSQL server, for backup and restore.

>[!Note]
>All the new configure protection will take place with the new key vault authentication model only. However, all the existing backup instances configured protection with the Microsoft Entra ID based authentication will continue to exist and have regular backups taken. To restore these backups, you need to follow the Microsoft Entra ID based authentication.

## Grant access on the Azure PostgreSQL server and Key vault manually

To grant all the access permissions needed by Azure Backup, refer to the following sections:

### Access permissions on the Azure PostgreSQL server

1. Set Backup vault’s MSI **Reader** access on the Azure PostgreSQL server.

   :::image type="content" source="./media/backup-azure-database-postgresql-overview/set-reader-access-on-azure-postgresql-server-inline.png" alt-text="Screenshot showing the option to set Backup vault’s M S I Reader access on the Azure PostgreSQL server." lightbox="./media/backup-azure-database-postgresql-overview/set-reader-access-on-azure-postgresql-server-expanded.png":::

1. Network line of sight access on the Azure PostgreSQL server: Set ‘Allow access to Azure services’ flag to ‘Yes’.

   :::image type="content" source="./media/backup-azure-database-postgresql-overview/network-line-of-sight-access-on-azure-postgresql-server-inline.png" alt-text="Screenshot showing the option to set network line of sight access on the Azure PostgreSQL server." lightbox="./media/backup-azure-database-postgresql-overview/network-line-of-sight-access-on-azure-postgresql-server-expanded.png":::

### Access permissions on the Azure Key vault (associated with the PostgreSQL server)

1. Set Backup vault’s MSI **Key Vault Secrets User** (or **get**, **list** secrets) access on the Azure key vault. To assign permissions, you can use role assignments or access policies. It’s not required to add the permission using both the options as it doesn’t help.

   - Using Azure role-based access control (Azure RBAC) authorization (that is, Permission model is set to Azure role-based access control):

     - Under Access control, grant the backup vault’s MSI _Key Vault Secrets User_ access on the key vault. Bearers of that role will be able to read secrets.
     - [Grant permission to applications to access an Azure key vault using Azure RBAC](../key-vault/general/rbac-guide.md?tabs=azure-cli).

   :::image type="content" source="./media/backup-azure-database-postgresql-overview/key-vault-secrets-user-access-inline.png" alt-text="Screenshot showing the option to provide secret user access." lightbox="./media/backup-azure-database-postgresql-overview/key-vault-secrets-user-access-expanded.png":::

   :::image type="content" source="./media/backup-azure-database-postgresql-overview/grant-permission-to-applications-azure-rbac-inline.png" alt-text="Screenshot showing the option to grant the backup vault’s M S I Key Vault Secrets User access on the key vault." lightbox="./media/backup-azure-database-postgresql-overview/grant-permission-to-applications-azure-rbac-expanded.png":::  

   - Using access policies (that is, Permission model is set to Vault access policy):

     - Set Get and List permissions on secrets.
     - Learn about [Assign an Azure Key Vault access policy](../key-vault/general/assign-access-policy.md?tabs=azure-portal)

     :::image type="content" source="./media/backup-azure-database-postgresql-overview/permission-model-is-set-to-vault-access-policy-inline.png" alt-text="Screenshot showing the option to grant permission using Permission model is set to Vault access policy model." lightbox="./media/backup-azure-database-postgresql-overview/permission-model-is-set-to-vault-access-policy-expanded.png":::  
 

1. Network line of sight access on the key vault: Set the **Allow trusted Microsoft services** flag to **Yes**.

   :::image type="content" source="./media/backup-azure-database-postgresql-overview/network-line-of-sight-access-on-key-vault-inline.png" alt-text="Screenshot showing to set the Allow trusted Microsoft services flag to yes for Network line of sight access on the key vault." lightbox="./media/backup-azure-database-postgresql-overview/network-line-of-sight-access-on-key-vault-expanded.png":::

### Database user’s backup privileges on the database

Run the following query in [PG admin](#use-the-pg-admin-tool) tool (replace _username_ with the database user ID):

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

## Use the PG admin tool

[Download PG admin tool](https://www.pgadmin.org/download/) if you don’t have it already. You can connect to the Azure PostgreSQL server through this tool. Also, you can add databases and new users to this server.

:::image type="content" source="./media/backup-azure-database-postgresql-overview/connect-to-azure-postgresql-server-using-pg-admin-tool-inline.png" alt-text="Screenshot showing the process to connect to Azure PostgreSQL server using P G admin tool." lightbox="./media/backup-azure-database-postgresql-overview/connect-to-azure-postgresql-server-using-pg-admin-tool-expanded.png":::

Create new server with a name of your choice. Enter the Host name/address name same as the **Server name** displayed in the Azure PostgreSQL resource view in the Azure portal.

:::image type="content" source="./media/backup-azure-database-postgresql-overview/create-new-server-using-pg-admin-tool-inline.png" alt-text="Screenshot showing the option to create new server using P G admin tool." lightbox="./media/backup-azure-database-postgresql-overview/create-new-server-using-pg-admin-tool-expanded.png":::

:::image type="content" source="./media/backup-azure-database-postgresql-overview/enter-host-name-or-address-name-same-as--server-name-inline.png" alt-text="Screenshot showing the option to enter the Host name or address name same as the Server name." lightbox="./media/backup-azure-database-postgresql-overview/enter-host-name-or-address-name-same-as--server-name-expanded.png":::

Ensure that you add the _current client ID address_ to the Firewall rules for the connection to go through.

:::image type="content" source="./media/backup-azure-database-postgresql-overview/add-current-client-id-address-to-firewall-rules-inline.png" alt-text="Screenshot showing the process to add the current client I D address to the Firewall rules." lightbox="./media/backup-azure-database-postgresql-overview/add-current-client-id-address-to-firewall-rules-expanded.png":::

You can add new databases and database users to the server. For database users, add a new **Login/Group Roles**’. Ensure **Can login?** is set to **Yes**.

:::image type="content" source="./media/backup-azure-database-postgresql-overview/add-new-databases-and-database-users-to-server-inline.png" alt-text="Screenshot showing the process to add new databases and database users to the server." lightbox="./media/backup-azure-database-postgresql-overview/add-new-databases-and-database-users-to-server-expanded.png":::

:::image type="content" source="./media/backup-azure-database-postgresql-overview/add-new-login-group-roles-inline.png" alt-text="Screenshot showing the process to add a new login or group role for database users." lightbox="./media/backup-azure-database-postgresql-overview/add-new-login-group-roles-expanded.png":::

:::image type="content" source="./media/backup-azure-database-postgresql-overview/set-can-login-to-yes-inline.png" alt-text="Screenshot showing the verification of the can login option is set to Yes." lightbox="./media/backup-azure-database-postgresql-overview/set-can-login-to-yes-expanded.png":::

## Next steps

[Azure Database for PostgreSQL backup](backup-azure-database-postgresql.md)

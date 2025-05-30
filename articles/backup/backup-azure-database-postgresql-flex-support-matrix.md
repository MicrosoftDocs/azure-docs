---
title: Azure Database for PostgreSQL- Flexible server support matrix
description: Provides a summary of support settings and limitations of Azure Database for PostgreSQL- Flexible server backup.
ms.topic: reference
ms.date: 05/15/2025
ms.custom: references_regions, ignite-2024
ms.service: azure-backup
author: jyothisuri
ms.author: jsuri
---

# Support matrix for Azure Database for PostgreSQL- Flexible Server

You can use [Azure Backup](./backup-overview.md) to protect Azure Database for PostgreSQL- Flexible Server. This article summarizes supported regions, scenarios, and the limitations.

## Supported regions

Vaulted backup for PostgreSQL – flexible server is generally available in all public cloud regions and sovereign regions.

## Support scenarios

Consider the following support scenarios when you back up Azure Database for PostgreSQL – Flexible Server:

- Vaulted backup restores are only available as **Restore to Files** in user specified storage containers. You can restore this data as a new PostgreSQL - flexible server with the database native tools.
- Backups for the PostgreSQL server are supported when the Backup Vault is in the same or a different subscription as the database, provided they are within the same tenant and region. Restores are supported across regions (Azure Paired) and across subscriptions within the same tenant.
- For vaulted backups, entire server is backed up with all databases. Backup of specific databases isn't supported.
- Vaulted backups are supported for server size **<= 1 TB**. If backup is configured on server size larger than 1 TB, the backup operation fails.
- PostgreSQL - Flexible servers encrypted by Customer Managed Key are supported.
- Backups for PostgreSQL Flexible servers exclude databases owned by `azuresu` or `azure_pg_admin`, including the native PostgreSQL database. So, databases with these owners can't be backed up or restored.
- Recommended frequency for restore operations is once a day. Multiple restore operations triggered in a day can fail.

## Limitation

Azure Database for PostgreSQL – Flexible Server backups include the following limitations:

- Vaulted backup doesn't support storage in archive tier.
- Vaulted backup isn't supported on replicas; backup can be configured only on primary servers.
- For restore operation, item level recovery (recovery of specific databases) isn't supported.
- Only one weekly backup is currently supported. If multiple vaulted backups are scheduled in a week, only the first backup operation of the week is executed, and the subsequent backup jobs in the same week fail.”
- Vaulted backups don't support tables containing a row with **BYTEA length exceeding 500 MB**.
- Vaulted backups support full backups only; incremental or differential backups aren't supported.


### Restore limitations
- The use of **create role** scripts for `azure_su`, `azure_pg_admin`, `replication`, `localadmin`, and `Entra Admin` causes the following errors  during restoration on another flexible server, which you can safely ignore.

  - `role "azure_pg_admin" already exists.`
  - `role "azuresu" already exists.`
  - `role "replication" already exists.`
  - `ERROR: must be superuser to create superusers`
  - `ERROR: Only roles with privileges of role "azuresu" may grant privileges as this role. permission denied granting privileges as role "azuresu"`
  - `ERROR: permission denied granting privileges as role "azuresu" SQL state: 42501 Detail: Only roles with privileges of role "azuresu" may grant privileges.`
  - `Ignore any errors related to pg_catalog, pg _aadauth extensions as it is owned by azure_su and localadmin does not have access to directly create this extension on flexible server, but these are automatically created on new flexible servers or when you enable Microsoft entra authentication.`
  - `ERROR: Only roles with the ADMIN option on role "pg_use_reserved_connections" may grant this role. permission denied to grant role "pg_use_reserved_connections"`
  - `ERROR: permission denied to grant role "pg_use_reserved_connections" SQL state: 42501 Detail: Only roles with the ADMIN option on role "pg_use_reserved_connections" may grant this role.`

- In PostgreSQL **community version 16**, the requirement for superuser privileges to set the Bypass Row -level security (RLS) attribute was removed. So, in versions 16 and higher, you can grant the Bypass RLS to azure_pg_admin allowing others to set the RLS. For versions lower than 16, the bypasses attribute is granted only to the server admin and no other nonsuperuser roles. 
- If you're using Entra Admins after restoration, you might encounter the **Owner Change Issue** : As a workaround, use the **grant** option to provide ownership. 


## Next steps

- [Back up Azure Database for PostgreSQL -Flexible Server using Azure portal](tutorial-create-first-backup-azure-database-postgresql-flex.md).

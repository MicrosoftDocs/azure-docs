---
title: Premigration error codes in the migration service.
description: Error codes for troubleshooting and resolving issues during the migration process in Azure Database for PostgreSQL.
author: apduvuri
ms.author: adityaduvuri
ms.reviewer: maghan
ms.date: 06/19/2024
ms.service: azure-database-postgresql
ms.subservice: flexible-server
ms.topic: error-reference
ms.custom:
  - troubleshooting
---

#  Known errors in the migration service for Azure Database for PostgreSQL

This article contains error message numbers and their description for premigration validation.

The following tables provide a comprehensive list of error codes for the migration service feature in Azure Database for PostgreSQL. These error codes help you troubleshoot and resolve issues during the migration process. Each error code has an error message and other details that provide further context and guidance for resolving the issue.

## Connection timeouts

### Symptoms

Migration failures often manifest through error messages that indicate connectivity issues. These issues can arise during the data transfer process. When such failures occur, they result in the following error messages:

- server closed the connection unexpectedly
- SSL SYSCALL error: EOF detected
- unexpected EOF on client connection
- couldn't receive data from client: Connection reset by peer

### Cause

The underlying cause for these symptoms is a `connection timeout`. This occurs when the server or the client expects to receive data within a certain time frame, but no data is sent or received, leading the connection to time out. The specific reasons for a connection timeout can vary, but common factors include network congestion, misconfigured network settings, or overly aggressive timeout settings.

In the context of migration service in Azure Database for PostgreSQL, a connection timeout between the source and the migration service or between the migration service and the target can interrupt the data transfer process, resulting in the symptoms described above.

### Resolution

- To address the connection timeout issues, adjust the TCP parameters on both the source and target servers as follows:

    - `tcp_keepalives_idle=10`
    - `tcp_keepalives_interval=10`
    - `tcp_keepalives_count=60`

These settings help maintain the connection by sending keepalive probes to prevent timeouts due to inactivity. Importantly, modifying these TCP parameters doesn't require a restart of the source or target PostgreSQL instances. Changes can be applied dynamically, allowing for a seamless continuation of service without interrupting the database operations.

## Migration error codes

| Error Code | Error message | Resolution |
| --- | --- | --- | 
| 603000 | Connection failed. Connection to the server `{serverName}` was unsuccessful. Ensure that the source server is reachable from the target or runtime server. | Refer to [Network guide](how-to-network-setup-migration-service.md) for debugging connectivity issues. |
| 603001 | SSL Configuration Error. The server `{serverName}` doesn't support SSL. Check SSL settings. Set SSL mode to *prefer* and retry the migration. | Refer to [Network guide](how-to-network-setup-migration-service.md) for debugging connectivity issues. |
| 603100 | Authentication failed. The password for server `{serverName}` is incorrect. Enter the correct password and retry the migration. | N/A |
| 603101 | Database exists in target. Database `{dbName}` exists on the target server. Ensure the target server doesn't have the database and retry the migration. | N/A |
| 603102 | Source Database Missing. Database `{dbName}` doesn't exist on the source server. Provide a valid database and retry the migration. | N/A |
| 603103 | Missing Microsoft Entra role. Microsoft Entra role `{roleNames}` is missing on the target server. Create the Entra role and retry the migration. | N/A |
| 603104 | Missing Replication Role. User `{0}` doesn't have the replication role on server `{1}`. Grant the replication role before retrying migration. | Use `ALTER ROLE <rolename> WITH REPLICATION;` to grant the required permission. |
| 603105 | GUC Settings Error. Insufficient replication slots on the source server for migration. Increase the `max_replication_slots` GUC parameter to `{0}` or higher. | Source server doesn't have sufficient replication slots available to perform online migration. Use this query `SELECT * FROM pg_replication_slots WHERE active = false AND slot_type = 'logical';` to get the list of inactive replication slots and drop them using `SELECT pg_drop_replication_slot('slot_name');` before initiating the migration. Alternatively, set the 'max_replication_slots' server parameter to `{0}` or higher. Ensure that the `max_wal_senders` parameter is also changed to be greater than or equal to the `max_replication_slots' parameter`. |
| 603106 | GUC Settings Error. The `max_wal_senders` GUC parameter is set to `{0}`. Ensure it matches or exceeds the 'max_replication_slots' value. | N/A |
| 603107 | GUC Settings Error. Source server WAL level parameter is set to `{0}`. Set GUC parameter WAL level to be 'logical'. | N/A |
| 603108 | Extensions allowlist required. Extensions `{0}` couldn't be installed on the target server because they're not allowlisted. Allowlist the extensions and retry the migration. | Set the allowlist by following the steps mentioned in [PostgreSQL extensions](https://aka.ms/allowlist-extensions). |
| 603109 | Shared preload libraries configuration error. Add allowlisted extensions `{0}` to 'shared_preload_libraries' on the target server and retry the migration. | Set the shared preload libraries by following the steps mentioned in [PostgreSQL extensions](https://aka.ms/allowlist-extensions). This requires a server restart. |
| 603110 | Insufficient privileges. Migration user lacks necessary permissions for database access. Ensure that the migration user is owner of source databases and has both read and write privileges and retry the migration.| N/A |
| 603111 | Target database cleanup failed. Unable to terminate active connections on the target database during the premigration phase. Grant pg_signal_backend role to migration user and retry the migration. | Add pg_signal_backend role to migration user using the command 'GRANT pg_signal_backend to <migration_user>' |
| 603112 | GUC settings error. Failed to set default_transaction_read_only GUC parameter to off. Ensure that user write access is properly set and retry the migration. | Set 'default_transaction_read_only' to OFF on source server via Azure portal or through psql command(for example, ALTER SYSTEM SET default_transaction_read_only = off). |
| 603113 | Cutover failure. Cutover can't be initiated for database '{dbName}' as the migration has already been with the status Completed/Failed/Canceled. | N/A |
| 603114 | Cutover failure. Cutover can't be initiated for database '{dbName}' for migration mode offline. | N/A |
| 603115 | Missing user privileges. Migration user '{0}' isn't a member of azure_pg_admin role. Add necessary privileges on target server and retry the migration. | N/A |
| 603116 | Missing user privileges. Migration user '{0}' doesn't have the create role privilege. Add necessary privileges on target server and retry the migration. | Run query `ALTER ROLE <rolename> WITH CREATEROLE;` on target server. |
| 603117 | Missing user privileges. Migration user '{0}' lacks necessary privileges to delete the '{dbName}' database on the target server. Drop the database manually from the target server and retry the migration. | N/A |
| 603400 | Unsupported source version. Migration of PostgreSQL versions below `{0}` is unsupported. | You must use another migration method. |
| 603401 | Collation mismatch. Collation `{0}` in database `{1}` isn't present on target server. | N/A |
| 603402 | Collation mismatch. Collation `{0}` for table `{1}` in column `{2}` isn't present on target server. | [Contact Microsoft support](https://support.microsoft.com/contactus) to add the necessary collations. |
| 603403 | Collation mismatch. Source database contains user-defined collations. Drop these collations and retry the migration. | N/A |
| 603404 | Unsupported OIDs Detected. Tables with 'WITH OIDs' detected in database `{0}`. They aren't supported in PostgreSQL version 12 and later. | Visit [PostgreSQL release notes](https://www.postgresql.org/docs/release/12.0). |
| 603405 | Unsupported Extensions. The migration service doesn't support the migration of databases with `{0}` extensions on the target server. | N/A |
| 603406 | Unsupported Extensions. Target PostgreSQL `{0}` supports POSTGIS version 3.2.3, which is incompatible with source's `{1}`. | Recommend target server upgrade to version 11. Visit [PostGIS breaking changes](https://git.osgeo.org/gitea/postgis/postgis/raw/tag/3.4.1/NEWS). |
| 603407 | Extension Schema Error. Extensions `{0}` located in the system schema on the source server are unsupported on the target server. Drop and recreate the extensions in a nonsystem schema, then retry the migration. | Visit [PostgreSQL extensions](../../flexible-server/concepts-extensions.md). |
| 603408 | Unsupported Extensions. Target server version 16 doesn't support `{0}` extensions. Migrate to version 15 or lower, then upgrade once the extensions are supported. | N/A |
| 603409 | User-defined casts present. Source database `{0}` contains user-defined casts that can't be migrated to the target server. | N/A |
| 603410 | System table permission error. Users have access to system tables like pg_authid and pg_shadow that can't be migrated to the target. Revoke these permissions and retry the migration. | Validating the default permissions granted to `pg_catalog` tables/views (such as `pg_authid` and `pg_shadow`) is essential. However, these permissions can't be assigned to the target. Specifically, User `{1}` possesses `{2}` permissions, while User `{3}` holds `{4}` permissions. For a workaround, visit [User, Roles, and Permissions](https://aka.ms/troubleshooting-user-roles-permission-ownerships-issues) |
| 603700 | Target database cleanup failed. Unable to terminate active connections on the target database during the pre-migration/post-migration phase. | N/A |
| 603701 | Internal server error. Failed to create roles on the target server. | [Contact Microsoft support](https://support.microsoft.com/contactus) for further analysis. |
| 603702 | Internal server error. Failed to dump roles from source server. | [Contact Microsoft support](https://support.microsoft.com/contactus) for further analysis. |
| 603703 | Internal server error. Failed to edit the global role dump file. | [Contact Microsoft support](https://support.microsoft.com/contactus) for further analysis. |
| 603704 | Internal server error. Failed to make all source roles a member of target migration user. | [Contact Microsoft support](https://support.microsoft.com/contactus) for further analysis. |
| 603705 | Internal server error. Failed to restore grants/revokes. | [Contact Microsoft support](https://support.microsoft.com/contactus) for further analysis. |
| 603706 | Internal server error. Failed to clean up the target server migration user. Your target migration user can be part of multiple roles. Remove all unnecessary roles from target server migration user and retry the migration. | [Contact Microsoft support](https://support.microsoft.com/contactus) for further analysis. |
| 603707 | Internal server error. Failed to grant azure_pg_admin to the source server admin user. | [Contact Microsoft support](https://support.microsoft.com/contactus) for further analysis.|
| 603708 | Internal server error. Failed to alter the owner of public schema to azure_pg_admin in database '{dbName}'. Change the owner of public schema to azure_pg_admin manually and retry the migration. | [Contact Microsoft support](https://support.microsoft.com/contactus) for further analysis. |
| 603709 | Migration setup failed. | [Contact Microsoft support](https://support.microsoft.com/contactus) for further analysis. |


## Related content

- [Troubleshoot the migration service for Azure Database for PostgreSQL](how-to-network-setup-migration-service.md))
- [Best practices for seamless migration into Azure Database for PostgreSQL](best-practices-migration-service-postgresql.md)
- [Networking](how-to-network-setup-migration-service.md)
- [Known issues and limitations](concepts-known-issues-migration-service.md)

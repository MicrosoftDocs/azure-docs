---
title: Error codes for migration service in Azure Database for PostgreSQL
description: Error codes for the migration service for Azure Database for PostgreSQL.
author: apduvuri
ms.author: adityaduvuri
ms.reviewer: maghan
ms.date: 05/07/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: error-reference
ms.custom:
  - troubleshooting
---

# Error codes for the migration service for Azure Database for PostgreSQL

The following tables provide a comprehensive list of error codes for the migration service feature in Azure Database for PostgreSQL. These error codes help you troubleshoot and resolve issues during the migration process. Each error code has an error message and other details that provide further context and guidance for resolving the issue.

| ErrorCode | Error message | Details | Resolution |
| --- | --- | --- | --- |
| 603000 | Connection failed. | Connection to the server `{0}` was unsuccessful. Ensure that the source server is reachable from the target or runtime server. | Refer to https://aka.ms/postgres-migrations-networking-faq for debugging connectivity issues. |
| 603000 | Connection failed. | Connection to the server `{0}` was unsuccessful. Ensure that the source server is reachable from the target or runtime server. | Refer to https://aka.ms/postgres-migrations-networking-faq for debugging connectivity issues. |
| 603000 | Connection failed. | Connection to the server `{0}` was unsuccessful. Ensure that the source server is reachable from the target or runtime server. | Refer to https://aka.ms/postgres-migrations-networking-faq for debugging connectivity issues. |
| 603000 | Connection failed. | Connection to the server `{0}` was unsuccessful. Ensure that the source server is reachable from the target or runtime server. | Refer to https://aka.ms/postgres-migrations-networking-faq for debugging connectivity issues. |
| 603001 | SSL Configuration Error | The server `{0}` doesn't support SSL.Check SSL settings. Set SSL mode to *prefer* and retry the migration. | Refer to https://aka.ms/postgres-migrations-networking-faq for debugging connectivity issues. |
| 603100 | Authentication failed. | The password for server {0} is incorrect. Enter the correct password and retry the migration. | |
| 603100 | Authentication failed. | The password for server {0} is incorrect. Enter the correct password and retry the migration again. | |
| 603101 | Database exists in target | Database `{0}` exists on the target server. Ensure the target server doesn't have the database and retry the migration. | |
| 603102 | Source Database Missing | Database `{0}` doesn't exist on the source server. Provide a valid database and retry the migration. | |
| 603103 | Missing Microsoft Entra role. | Microsoft Entra role `{0}` is missing on the target server. Create the Entra role and retry the migration. | |
| 603104 | Missing Replication Role. | User `{0}` doesn't have the replication role on server `{1}`. Grant the replication role before retrying migration. | |
| 603105 | GUC Settings Error | Insufficient replication slots on the source server for migration. Increase the 'max_replication_slots' GUC parameter to {0} or higher. | Use this query `SELECT * FROM pg_replication_slots WHERE active = false AND slot_type = 'logical';` to get the list of inactive replication slots and drop them using `SELECT pg_drop_replication_slot('slot_name');` before initiating the migration. Alternatively, set the 'max_replication_slots' server parameter to {0} or higher. Ensure that the 'max_wal_senders' parameter is also changed to be greater than or equal to the 'max_replication_slots' parameter. |
| 603105 | GUC Settings Error | Insufficient replication slots on the source server for migration. Increase the 'max_replication_slots' GUC parameter to {0} or higher. | |
| 603106 | GUC Settings Error | The 'max_wal_senders' GUC parameter is set to {0}. Ensure it matches or exceeds the 'max_replication_slots' value. | |
| 603107 | GUC Settings Error | Source server WAL level parameter is set to `{0}`. Set GUC parameter WAL level to be 'logical'. | |
| 603108 | Extensions allowlist required. | Extensions `{0}` couldn't be installed on the target server because they're not allowlisted. Allowlist the extensions and retry the migration. | |
| 603109 | Shared preload libraries configuration error. | Add allowlisted extensions `{0}` to 'shared_preload_libraries' on the target server and retry the migration. | |
| 603109 | Shared preload libraries configuration error. | Add allowlisted extensions `{0}` to 'shared_preload_libraries' on the target server and retry the migration. | Follow the steps mentioned in this https://aka.ms/allowlist-extensions to allowlist the extensions and create a new migration. This change triggers a restart of the server. |
| 603400 | Unsupported source version | Migration of PostgreSQL versions below {0} is unsupported. | https://aka.ms/DumpandRestore |
| 603401 | Collation mismatch. | Collation {0} in database {1} isn't present on target server. | |
| 603401 | Collation mismatch. | Collation {0} in database {1} isn't present on target server. | |
| 603402 | Collation mismatch. | Collation {0} for table {1} in column {2} isn't present on target server. | Contact Microsoft support to add the necessary collations. |
| 603403 | Collation mismatch. | Source database contains user-defined collations. Drop these collations and retry the migration. | |
| 603404 | Unsupported OIDs Detected | Tables with 'WITH OIDs' detected in database `{0}`. They aren't supported in PostgreSQL version 12 and later. | For more details, refer to this link: https://www.postgresql.org/docs/release/12.0. |
| 603405 | Unsupported Extensions | The migration service doesn't support the migration of databases with `{0}` extensions on the target server. | |
| 603405 | Unsupported Extensions | The migration service doesn't support the migration of databases with `{0}` extensions on the target server. | https://aka.ms/migrate-using-pgdump-restore |
| 603406 | Unsupported Extensions | Target PostgreSQL {0} supports POSTGIS version 3.2.3, which is incompatible with source's {1}. | Recommend target server upgrade to version 11.For more information on the breaking changes, visit this link: https://git.osgeo.org/gitea/postgis/postgis/raw/tag/3.4.1/NEWS. |
| 603406 | Unsupported Extensions | Target PostgreSQL {0} supports POSTGIS version 3.2.3, which is incompatible with source's {1}. | For more information on the breaking changes, visit this link: https://git.osgeo.org/gitea/postgis/postgis/raw/tag/3.4.1/NEWS. |
| 603406 | Unsupported Extensions | Target PostgreSQL {0} supports POSTGIS version 3.2.3, which is incompatible with source's {1}. | For more information on the breaking changes, visit this link: https://git.osgeo.org/gitea/postgis/postgis/raw/tag/3.4.1/NEWS. Consult your application team to verify if the breaking changes are applicable to your application. |
| 603407 | Extension Schema Error | Extensions `{0}` located in the system schema on the source server are unsupported on the target server. Drop and recreate the extensions in a nonsystem schema, then retry the migration. | |
| 603408 | Unsupported Extensions | Target server version 16 doesn't support `{0}` extensions. Migrate to version 15 or lower, then upgrade once the extensions are supported. | |
| 603409 | User-defined casts present. | Source database `{0}` contains user-defined casts that can't be migrated to the target server. | |
| 603410 | System table permission error. | Users have access to system tables like pg_authid and pg_shadow that can't be migrated to the target. Revoke these permissions and retry the migration. | Validates for default permissions given to pg_catalog tables/views(pg_authid, pg_shadow etc.) which aren't allowed to be given on target. Refer to the following link for potential workarounds: https://aka.ms/troubleshooting-user-roles-permission-ownerships-issues. User `{1}` has '{2}' permissions, and user '{3}' has '{4}' permissions. |
| | Non-Primary Key Table CDC Warning | CDC (Change Data Capture) on tables without primary keys might lead to data loss. Primary keys are required on all tables for accurate replication of updates and deletions. Tables lacking primary keys only replicate insert operations. | Use this query `SELECT * FROM information_schema.tables WHERE table_schema NOT IN ('pg_catalog', 'information_schema')AND table_type = 'BASE TABLE' AND table_name NOT IN ( SELECT DISTINCT table_name FROM information_schema.key_column_usage WHERE table_schema NOT IN ('pg_catalog', 'information_schema') AND constraint_name LIKE '%pkey');` to get the list of tables without primary keys. Add a primary key to the relevant tables before proceeding with the online migration or perform an offline migration as an alternative. |

## Related content

- [Troubleshoot the migration service for Azure Database for PostgreSQL](https://aka.ms/postgres-migrations-networking-faq)
- [Best practices for seamless migration into Azure Database for PostgreSQL](best-practices-migration-service-postgresql.md)

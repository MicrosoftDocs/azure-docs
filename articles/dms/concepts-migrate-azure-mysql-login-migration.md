---
title: MySQL to Azure Database for MySQL Data Migration - MySQL Login Migration
description: Learn how to use the Azure Database for MySQL Data Migration - MySQL Login Migration
author: adig
ms.author: adig
ms.date: 07/24/2023
ms.service: dms
ms.topic: conceptual
ms.custom:
  - references_regions
  - sql-migration-content
---

# MySQL to Azure Database for MySQL Data Migration - MySQL Login Migration

MySQL Login Migration is a new feature that allows users to migrate user account and privileges, including users with no passwords. With this feature, businesses can now migrate a subset of the data in the ‘mysql’ system database from the source to the target for both offline and online migration scenarios. This login migration experience automates manual tasks such as the synchronization of logins with their corresponding user mappings and replicating server permissions and server roles.

## Current implementation

In the current implementation, users can select the **Migrate user account and privileges** checkbox in the **Select databases** tab under **Select Server Objects** section when configuring the DMS migration project.
:::image type="content" source="media/tutorial-mysql-to-azure-mysql-online/16-select-db.png" alt-text="Screenshot of a Select database.":::

Additionally, any corresponding databases that have related grants must also be selected for migration in the **Select Databases** section.

The progress and overall migration summary can be viewed in the **Initial Load** tab. On the **migration summary** blade, users can click into the **‘mysql’** system database to review the results of migrating server level objects, like users and grants.

### How Login Migration works

As part of Login migration, we migrate a subset of the tables in the ‘mysql’ system database depending on the version of your source. The tables we migrate for all versions are: user, db, tables_priv, columns_priv, and procs_priv. For 8.0 sources we also migrate the following tables: role_edges, default_roles, and global_grants.
Users without password

## Limitations

* Static privileges such as "CREATE TABLESPACE", "FILE", "SHUTDOWN" and "SUPER" aren't supported by Azure Database for MySQL - Flexible Server and hence not supported by login migration.
* Only users configured with the mysql_native_password, caching_sha2_password and sha256_password authentication plug-ins are migrated to the target server. Users relying on other plug-ins aren't supported.
* The account_locked field from the user table isn't migrated. If the account is locked on the source server, it isn't locked on the target server after migration.
* The proxies_priv grant table and password_history grant table aren't migrated.
* The password_expired field from user table isn't migrated.
* Migration of global_grants table only migrates the following grants: xa_recover_admin, role_admin.
* AAD logins migration isn't supported.

## Next steps

* [Tutorial: Migrate MySQL to Azure Database for MySQL offline using DMS](tutorial-mysql-azure-mysql-offline-portal.md)

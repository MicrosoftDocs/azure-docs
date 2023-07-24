---
title: MySQL to Azure Database for MySQL Data Migration - MySQL Login Migration
description: Learn how to use the Azure Database for MySQL Data Migration - MySQL Login Migration 
author: adig
ms.author: adig
ms.date: 07/24/2023
ms.service: dms
ms.topic: conceptual
ms.custom: references_regions
---

# MySQL to Azure Database for MySQL Data Migration - MySQL Login Migration

MySQL Login Migration is a new feature that allows users to migrate user account and privileges, including users with no passwords. With this feature, businesses will now be able to migrate a subset of the data in the ‘mysql’ system database from the source to the target for both offline and online migration scenarios. This login migration experience automates manual tasks such as the synchronization of logins with their corresponding user mappings and replicating server permissions and server roles.

## Current implementation

In the current implementation, users can select the **Migrate user account and privileges** checkbox in the **Select databases** tab under **Select Server Objects** section when configuring the DMS migration project.
:::image type="content" source="media/tutorial-mysql-to-azure-mysql-online/16-select-db.png" alt-text="Screenshot of a Select database.":::

Additionally, any corresponding databases that have related grants must also be selected for migration in the **Select Databases** section.

The progress and overall migration summary can be viewed in the **Initial Load** tab. On the **migration summary** blade, users can click into the **‘mysql’** system database to review the results of migrating server level objects, like users and grants.

### How Login Migration works

As part of Login migration, we will migrate a subset of the tables in the ‘mysql’ system database depending on the version of your source. The tables we migrate for all versions are: user, db, tables_priv, columns_priv, and procs_priv. For 8.0 sources we also migrate the following tables: role_edges, default_roles, and global_grants.

## Limitations

* Only server dynamic grants are migrated.
* Only users configured with the mysql_native_password authentication plug-in will be migrated to the target server. Users relying on other plug-ins are not supported.
* The account_locked field from the user table is not migrated. If the account is locked on the source server, it isn't locked on the target server after migration.
* The proxies_priv grant table and password_history grant table are not migrated.
* The password_expired field from user table is not migrated.
* Migration of global_grants table only migrates the following grants: xa_recover_admin, role_admin.

## Next steps

* [Tutorial: Migrate MySQL to Azure Database for MySQL offline using DMS](tutorial-mysql-azure-mysql-offline-portal.md)

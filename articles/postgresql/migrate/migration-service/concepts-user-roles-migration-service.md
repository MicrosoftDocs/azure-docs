---
title: "Migration service - Migration of users/roles, ownerships, and privileges"
description: Learn about the migration of user roles, ownerships, and privileges along with schema and data for the migration service in Azure Database for PostgreSQL.
author: shriramm
ms.author: shriramm
ms.reviewer: maghan
ms.date: 06/19/2024
ms.service: postgresql
ms.topic: conceptual
---

# Migration of user roles, ownerships, and privileges for the migration service in Azure Database for PostgreSQL

[!INCLUDE [applies-to-postgresql-flexible-server](~/reusable-content/ce-skilling/azure/includes/postgresql/includes/applies-to-postgresql-flexible-server.md)]

> [!IMPORTANT]  
> The migration of user roles, ownerships, and privileges feature is available only for the Azure Database for PostgreSQL - Single Server instance as the source. This feature is currently disabled for PostgreSQL version 16 servers.

The migration service automatically provides the following built-in capabilities for Azure Database for PostgreSQL - Single Server as the source and data migration:

- Migration of user roles on your source server to the target server.
- Migration of ownership of all the database objects on your source server to the target server.
- Migration of permissions of database objects on your source server, such as `GRANT`/`REVOKE`, to the target server.

## Permission differences between Azure Database for PostgreSQL - Single Server and Flexible Server

This section explores the differences in permissions granted to the **azure_pg_admin** role across single server and flexible server environments.

### PG catalog permissions

Unlike user-created schemas, which organize database objects into logical groups, pg_catalog is a system schema. It houses crucial system-level information, such as details about tables, columns, and other internal bookkeeping data. It's where PostgreSQL stores important metadata.

- In a single server environment, a user belonging to the azure_pg_admin role is granted select privileges for all pg_catalog tables and views.
- In a flexible server environment, privileges are restricted for certain tables and views so that only superusers are allowed to query them.

We removed all privileges for non-superusers on the following pg_catalog tables:

- pg_authid

- pg_largeobject

- pg_statistic

- pg_subscription

- pg_user_mapping

We removed all privileges for non-superusers on the following pg_catalog views:

- pg_config

- pg_file_settings

- pg_hba_file_rules

- pg_replication_origin_status

- pg_shadow

Allowing unrestricted access to these system tables and views could lead to unauthorized modifications, accidental deletions, or even security breaches. Restricted access reduces the risk of unintended changes or data exposure.

### pg_pltemplate deprecation

Another important consideration is the deprecation of the **pg_pltemplate** system table within the pg_catalog schema by the PostgreSQL community *starting from version 13*. If you're migrating to Flexible Server versions 13 and above and have granted permissions to users on the pg_pltemplate table on your single server, you must revoke these permissions before you initiate a new migration.

#### What is the impact?

- If your application is designed to directly query the affected tables and views, it encounters issues upon migrating to the flexible server. We strongly advise you to refactor your application to avoid direct queries to these system tables.
- If you've granted or revoked privileges to any users or roles for the affected pg_catalog tables and views, you encounter an error during the migration process. You can identify this error by the following pattern:

  ```sql
  pg_restore error: could not execute query <GRANT/REVOKE> <PRIVILEGES> on <affected TABLE/VIEWS> to <user>.
  ```

#### Workaround

To resolve this error, it's necessary to undo the privileges granted to users and roles on the affected pg_catalog tables and views. You can accomplish this task by taking the following steps.

**Step 1: Identify privileges**

Execute the following query on your single server by logging in as the admin user:

```sql
SELECT
  array_to_string(array_agg(acl.privilege_type), ', ') AS privileges,
  t.relname AS relation_name, 
  r.rolname AS grantee
FROM
  pg_catalog.pg_class AS t
  CROSS JOIN LATERAL aclexplode(t.relacl) AS acl
  JOIN pg_roles r ON r.oid = acl.grantee
WHERE
  acl.grantee <> 'azure_superuser'::regrole
  AND t.relname IN (
    'pg_authid', 'pg_largeobject', 'pg_subscription', 'pg_user_mapping', 'pg_statistic',
    'pg_config', 'pg_file_settings', 'pg_hba_file_rules', 'pg_replication_origin_status', 'pg_shadow', 'pg_pltemplate'
  )
GROUP BY
  r.rolname, t.relname;

```

**Step 2: Review the output**

The output of the query shows the list of privileges granted to roles on the impacted tables and views.

For example:

| Privileges | Relation name | Grantee |
| :--- |:--- |:--- | 
| SELECT | pg_authid | adminuser1 |
| SELECT, UPDATE |pg_shadow | adminuser2 |

**Step 3: Undo the privileges**

To undo the privileges, run `REVOKE` statements for each privilege on the relation from the grantee. In this example, you would run:

```sql
REVOKE SELECT ON pg_authid FROM adminuser1;
REVOKE SELECT ON pg_shadow FROM adminuser2;
REVOKE UPDATE ON pg_shadow FROM adminuser2;
```

**Step 4: Final verification**

Run the query from step 1 again to ensure that the resulting output set is empty.

> [!NOTE]
> Make sure you perform the preceding steps for all the databases included in the migration to avoid any permission-related issues during the migration.

After you finish these steps, you can proceed to initiate a new migration from the single server to the flexible server by using the migration service. You shouldn't encounter permission-related issues during this process.

## Related content

- [Migration service](concepts-migration-service-postgresql.md)
- [Known issues and limitations](concepts-known-issues-migration-service.md)
- [Network setup](how-to-network-setup-migration-service.md)

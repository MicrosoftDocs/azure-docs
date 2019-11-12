---
title: Create users in Azure Database for PostgreSQL - Hyperscale (Citus)
description: This article describes how you can create new user accounts to interact with an Azure Database for PostgreSQL - Hyperscale (Citus).
author: jonels-msft
ms.author: jonels
ms.service: postgresql
ms.topic: conceptual
ms.date: 11/04/2019
---

# Create users in Azure Database for PostgreSQL - Hyperscale (Citus)

This article describes how you can create users within a Hyperscale (Citus)
server group. To learn instead about Azure subscription users and their
privileges, visit the [Azure role based access control (RBAC)
article](../role-based-access-control/built-in-roles.md) or review [how to
customize roles](../role-based-access-control/custom-roles.md).

## The server admin account

A newly created Hyperscale (Citus) server group comes with several roles
pre-defined:

* The [default PostgreSQL roles](https://www.postgresql.org/docs/current/default-roles.html)
* *azure_pg_admin*
* *postgres*
* *citus*

Your server admin user, *citus*, is a member of the *azure_pg_admin* role.
However, it isn't part of the *postgres* (super user) role.  Since Hyperscale
is a managed PaaS service, only Microsoft is part of the super user role.

The PostgreSQL engine uses privileges to control access to database objects, as
discussed in the [PostgreSQL product
documentation](https://www.postgresql.org/docs/current/static/sql-createrole.html).
In Azure Database for PostgreSQL, the server admin user is granted these
privileges: LOGIN, NOSUPERUSER, INHERIT, CREATEDB, CREATEROLE, NOREPLICATION

## How to create additional users

The *citus* admin account lacks permission to create additional users. To add
a user, use the Azure portal instead.

1. Go to the **Roles** page for your Hyperscale server group, and click **+ Add**:

   ![The roles page](media/howto-hyperscale-create-users/1-role-page.png)

2. Enter the role name and password. Click **Save**.

   ![Add role](media/howto-hyperscale-create-users/2-add-user-fields.png)

The user will be created on the coordinator node of the server group,
and propagated to all the worker nodes.

## How to delete a user or change their password

Go to the **Roles** page for your Hyperscale server group, and click the
ellipses **...** next to a user. The ellipses will open a menu to delete
the user or reset their password.

   ![Edit a role](media/howto-hyperscale-create-users/edit-role.png)

The *citus* role is privileged and can't be deleted.

## How to modify privileges for role

New roles are commonly used to provide database access with restricted
privileges. To modify user privileges, use standard PostgreSQL commands, using
a tool such as PgAdmin or psql. (See [connecting with
psql](quickstart-create-hyperscale-portal.md#connect-to-the-database-using-psql)
in the Hyperscale (Citus) quickstart.)

For example, to allow *db_user* to read *mytable*, grant the permission:

```sql
GRANT SELECT ON mytable TO db_user;
```

Hyperscale (Citus) propagates single-table GRANT statements through the entire
cluster, applying them on all worker nodes. However GRANTs that are system-wide
(e.g. for all tables in a schema) need to be run on every date node.  Use the
*run_command_on_workers()* helper function:

```sql
-- applies to the coordinator node
GRANT SELECT ON ALL TABLES IN SCHEMA public TO db_user;

-- make it apply to workers as well
SELECT run_command_on_workers(
  'GRANT SELECT ON ALL TABLES IN SCHEMA public TO db_user;'
);
```

## Next steps

Open the firewall for the IP addresses of the new users' machines to enable
them to connect: [Create and manage Hyperscale (Citus) firewall rules using
the Azure portal](howto-hyperscale-manage-firewall-using-portal.md).

For more information about database user account management, see PostgreSQL
product documentation:

* [Database Roles and Privileges](https://www.postgresql.org/docs/current/static/user-manag.html)
* [GRANT Syntax](https://www.postgresql.org/docs/current/static/sql-grant.html)
* [Privileges](https://www.postgresql.org/docs/current/static/ddl-priv.html)

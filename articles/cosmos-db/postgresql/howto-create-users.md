---
title: Create users - Azure Cosmos DB for PostgreSQL
description: See how you can create new user accounts to interact with an Azure Cosmos DB for PostgreSQL cluster.
ms.author: jonels
author: jonels-msft
ms.service: cosmos-db
ms.subservice: postgresql
ms.custom: ignite-2022
ms.topic: how-to
ms.date: 09/21/2022
---

# Create users in Azure Cosmos DB for PostgreSQL

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

The PostgreSQL engine uses
[roles](https://www.postgresql.org/docs/current/sql-createrole.html) to control
access to database objects, and a newly created cluster
comes with several roles pre-defined:

* The [default PostgreSQL roles](https://www.postgresql.org/docs/current/default-roles.html)
* `azure_pg_admin`
* `postgres`
* `citus`

Since Azure Cosmos DB for PostgreSQL is a managed PaaS service, only Microsoft can sign in with the
`postgres` superuser role. For limited administrative access, Azure Cosmos DB for PostgreSQL
provides the `citus` role.

## The Citus role

Permissions for the `citus` role:

* Read all configuration variables, even variables normally visible only to
  superusers.
* Read all pg\_stat\_\* views and use various statistics-related
  extensions--even views or extensions normally visible only to superusers.
* Execute monitoring functions that may take ACCESS SHARE locks on tables,
  potentially for a long time.
* [Create PostgreSQL extensions](reference-extensions.md), because
  the role is a member of `azure_pg_admin`.

Notably, the `citus` role has some restrictions:

* Can't create roles
* Can't create databases

## How to create user roles

As mentioned, the `citus` admin account lacks permission to create user roles. To add a user role, use the Azure portal interface.

1. On your cluster page, select the **Roles** menu item, and on the **Roles** page, select **Add**.

   :::image type="content" source="media/howto-create-users/1-role-page.png" alt-text="Screenshot that shows the Roles page.":::

2. Enter the role name and password. Select **Save**.

   :::image type="content" source="media/howto-create-users/2-add-user-fields.png" alt-text="Screenshot that shows the Add role page.":::

The user will be created on the coordinator node of the cluster,
and propagated to all the worker nodes. Roles created through the Azure
portal have the `LOGIN` attribute, which means they’re true users who
can sign in to the database.

## How to modify privileges for user roles

New user roles are commonly used to provide database access with restricted
privileges. To modify user privileges, use standard PostgreSQL commands, using
a tool such as PgAdmin or psql. For more information, see [Connect to a cluster](quickstart-connect-psql.md).

For example, to allow `db_user` to read `mytable`, grant the permission:

```sql
GRANT SELECT ON mytable TO db_user;
```

Azure Cosmos DB for PostgreSQL propagates single-table GRANT statements through the entire
cluster, applying them on all worker nodes. It also propagates GRANTs that are
system-wide (for example, for all tables in a schema):

```sql
-- applies to the coordinator node and propagates to workers
GRANT SELECT ON ALL TABLES IN SCHEMA public TO db_user;
```

## How to delete a user role or change their password

To update a user, visit the **Roles** page for your cluster,
and select the ellipses **...** next to the user. The ellipses will open a menu
to delete the user or reset their password.

   :::image type="content" source="media/howto-create-users/edit-role.png" alt-text="Edit a role":::

The `citus` role is privileged and can't be deleted.

## Next steps

Open the firewall for the IP addresses of the new users' machines to enable
them to connect: [Create and manage firewall rules using
the Azure portal](howto-manage-firewall-using-portal.md).

For more information about database user management, see PostgreSQL
product documentation:

* [Database Roles and Privileges](https://www.postgresql.org/docs/current/static/user-manag.html)
* [GRANT Syntax](https://www.postgresql.org/docs/current/static/sql-grant.html)
* [Privileges](https://www.postgresql.org/docs/current/static/ddl-priv.html)

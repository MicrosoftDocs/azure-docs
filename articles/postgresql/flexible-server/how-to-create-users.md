---
title: Create users - Azure Database for PostgreSQL - Flexible Server
description: This article describes how you can create new user accounts to interact with an Azure Database for PostgreSQL - Flexible Server.
author: kabharati
ms.author: kabharati
ms.reviewer: maghan
ms.date: 11/04/2022
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: how-to
---

# Create users in Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-Flexible-server](../includes/applies-to-postgresql-Flexible-server.md)]

This article describes how you can create users within an Azure Database for PostgreSQL server.

> [!NOTE]  
> Azure Active Directory Authentication for PostgreSQL Flexible Server is currently in preview.

Suppose you want to learn how to create and manage Azure subscription users and their privileges. In that case, you can visit the [Azure role-based access control (Azure RBAC) article](../../role-based-access-control/built-in-roles.md) or review [how to customize roles](../../role-based-access-control/custom-roles.md).

## The server admin account

When you first created your Azure Database for PostgreSQL, you provided a server admin username and password. For more information, you can follow the [Quickstart](quickstart-create-server-portal.md) to see the step-by-step approach. Since the server admin user name is a custom name, you can locate the chosen server admin user name from the Azure portal.

The Azure Database for PostgreSQL server is created with the three default roles defined. You can see these roles by running the command: `SELECT rolname FROM pg_roles;`

- azure_pg_admin
- azure_superuser
- your server admin user

Your server admin user is a member of the azure_pg_admin role. However, the server admin account isn't part of the azure_superuser role. Since this service is a managed PaaS service, only Microsoft is part of the super user role.

The PostgreSQL engine uses privileges to control access to database objects, as discussed in the [PostgreSQL product documentation](https://www.postgresql.org/docs/current/static/sql-createrole.html). In Azure Database for PostgreSQL, the server admin user is granted these privileges:

- Sign in, NOSUPERUSER, INHERIT, CREATEDB, CREATEROLE, REPLICATION

The server admin user account can be used to create more users and grant those users into the azure_pg_admin role. Also, the server admin account can be used to create less privileged users and roles that have access to individual databases and schemas.

## How to create more admin users in Azure Database for PostgreSQL

1. Get the connection information and admin user name.
   You need the full server name and admin sign-in credentials to connect to your database server. You can easily find the server name and sign-in information from the server **Overview** page or the **Properties** page in the Azure portal.

1. Use the admin account and password to connect to your database server. Use your preferred client tool, such as pgAdmin or psql.
   If you're unsure of how to connect, see [the quickstart](./quickstart-create-server-portal.md)

1. Edit and run the following SQL code. Replace your new user name with the placeholder value <new_user>, and replace the placeholder password with your own strong password.

   ```sql
   CREATE USER <new_user> CREATEDB CREATEROLE PASSWORD '<StrongPassword!>';

   GRANT azure_pg_admin TO <new_user>;
   ```

## How to create database users in Azure Database for PostgreSQL

1. Get the connection information and admin user name.
   You need the full server name and admin sign-in credentials to connect to your database server. You can easily find the server name and sign-in information from the server **Overview** page or the **Properties** page in the Azure portal.

1. Use the admin account and password to connect to your database server. Use your preferred client tool, such as pgAdmin or psql.

1. Edit and run the following SQL code. Replace the placeholder value `<db_user>` with your intended new user name and placeholder value `<newdb>` with your own database name. Replace the placeholder password with your own strong password.

   This SQL code below creates a new database, then it creates a new user in the PostgreSQL instance and grants connect privilege to the new database for that user.

   ```sql
   CREATE DATABASE <newdb>;

   CREATE USER <db_user> PASSWORD '<StrongPassword!>';

   GRANT CONNECT ON DATABASE <newdb> TO <db_user>;
   ```

1. Using an admin account, you may need to grant other privileges to secure the objects in the database. Refer to the [PostgreSQL documentation](https://www.postgresql.org/docs/current/static/ddl-priv.html) for further details on database roles and privileges. For example:

   ```sql
   GRANT ALL PRIVILEGES ON DATABASE <newdb> TO <db_user>;
   ```

   If a user creates a table "role", the table belongs to that user. If another user needs access to the table, you must grant privileges to the other user on the table level.

   For example:

    ```sql
    GRANT SELECT ON ALL TABLES IN SCHEMA <schema_name> TO <db_user>;
    ```

1. Sign in to your server, specifying the designated database, using the new username and password. This example shows the psql command line. With this command, you're prompted for the password for the user name. Replace your own server name, database name, and user name.

   ```shell
   psql --host=mydemoserver.postgres.database.azure.com --port=5432 --username=db_user --dbname=newdb
   ```

## Next steps

Open the firewall for the IP addresses of the new users' machines to enable them to connect:

- [Create and manage Azure Database for PostgreSQL firewall rules by using the Azure portal](how-to-manage-firewall-portal.md) or [Azure CLI](how-to-manage-firewall-cli.md).

- For more information regarding user account management, see PostgreSQL product documentation for [Database Roles and Privileges](https://www.postgresql.org/docs/current/static/user-manag.html), [GRANT Syntax](https://www.postgresql.org/docs/current/static/sql-grant.html), and [Privileges](https://www.postgresql.org/docs/current/static/ddl-priv.html).

---
title: Create users in Azure Database for PostgreSQL server
description: This article describes how you can create new user accounts to interact with an Azure Database for PostgreSQL server.
author: jasonwhowell
ms.author: jasonh
editor: jasonwhowell
ms.service: postgresql
ms.topic: conceptual
ms.date: 10/16/2018
---

# Create users in Azure Database for PostgreSQL server 
This article describes how you can create users in an Azure Database for PostgreSQL server.

## The server admin account
When you first created your Azure Database for PostgreSQL, you provided a server admin user name and password. For more information, you can follow the [Quickstart](quickstart-create-server-database-portal.md) to see the step-by-step approach. Since the server admin user name is a custom name, you can locate the chosen server admin user name from the Azure portal.

The Azure Database for PostgreSQL server is created with the 3 default roles defined. You can see these roles by running the command: `SELECT rolname FROM pg_roles;`
- azure_pg_admin
- azure_superuser
- your server admin user

Your server admin user is a member of the azure_pg_admin role. However, the server admin account is not part of the azure_superuser role. Since this service is a managed PaaS service, only Microsoft is part of the super user role. 

The PostgreSQL engine uses privileges to control access to database objects, as discussed in the [PostgreSQL product documentation](https://www.postgresql.org/docs/current/static/sql-createrole.html). In Azure Database for PostgreSQL, the server admin user is granted these privileges:
  LOGIN, NOSUPERUSER, INHERIT, CREATEDB, CREATEROLE, NOREPLICATION

The server admin user account can be used to create additional users and grant those users into the azure_pg_admin role. Also, the server admin account can be used to create less privileged users and roles that have access to individual databases and schemas.

## How to create additional admin users in Azure Database for PostgreSQL
1. Get the connection information and admin user name.
   To connect to your database server, you need the full server name and admin sign-in credentials. You can easily find the server name and sign-in information from the server **Overview** page or the **Properties** page in the Azure portal. 

2. Use the admin account and password to connect to your database server. Use your preferred client tool, such as pgAdmin or psql.
   If you are unsure of how to connect, see [Connect to the PostgreSQL Database by using psql in Cloud Shell](./quickstart-create-server-database-portal.md#connect-to-the-postgresql-database-by-using-psql-in-cloud-shell)

3. Edit and run the following SQL code. Replace your new user name for the placeholder value <new_user>, and replace the placeholder password with your own strong password. 

   ```sql
   CREATE ROLE <new_user> WITH LOGIN NOSUPERUSER INHERIT CREATEDB CREATEROLE NOREPLICATION PASSWORD '<StrongPassword!>';
   
   GRANT azure_pg_admin TO <new_user>;
   ```

## How to create database users in Azure Database for PostgreSQL

1. Get the connection information and admin user name.
   To connect to your database server, you need the full server name and admin sign-in credentials. You can easily find the server name and sign-in information from the server **Overview** page or the **Properties** page in the Azure portal. 

2. Use the admin account and password to connect to your database server. Use your preferred client tool, such as pgAdmin or psql.

3. Edit and run the following SQL code. Replace the placeholder value `<db_user>` with your intended new user name, and placeholder value `<newdb>` with your own database name. Replace the placeholder password with your own strong password. 

   This sql code syntax creates a new database named testdb, for example purposes. Then it creates a new user in the PostgreSQL service, and grants connect privileges to the new database for that user. 

   ```sql
   CREATE DATABASE <newdb>;
   
   CREATE ROLE <db_user> WITH LOGIN NOSUPERUSER INHERIT CREATEDB NOCREATEROLE NOREPLICATION PASSWORD '<StrongPassword!>';
   
   GRANT CONNECT ON DATABASE <newdb> TO <db_user>;
   ```

4. Using an admin account, you may need to grant additional privileges to secure the objects in the database. Refer to the [PostgreSQL documentation](https://www.postgresql.org/docs/current/static/ddl-priv.html) for further details on database roles and privileges. For example: 
   ```sql
   GRANT ALL PRIVILEGES ON DATABASE <newdb> TO <db_user>;
   ```

5. Log in to your server, specifying the designated database, using the new user name and password. This example shows the psql command line. With this command, you are prompted for the password for the user name. Replace your own server name, database name, and user name.

   ```azurecli-interactive
   psql --host=mydemoserver.postgres.database.azure.com --port=5432 --username=db_user@mydemoserver --dbname=newdb
   ```

## Next steps
Open the firewall for the IP addresses of the new users' machines to enable them to connect:
[Create and manage Azure Database for PostgreSQL firewall rules by using the Azure portal](howto-manage-firewall-using-portal.md) or [Azure CLI](howto-manage-firewall-using-cli.md).

For more information regarding user account management, see PostgreSQL product documentation for [Database Roles and Privileges](https://www.postgresql.org/docs/current/static/user-manag.html), [GRANT Syntax](https://www.postgresql.org/docs/current/static/sql-grant.html), and [Privileges](https://www.postgresql.org/docs/current/static/ddl-priv.html).

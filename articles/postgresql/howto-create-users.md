---
title: Create users in Azure Database for PostgreSQL server | Microsoft Docs
description: This article describes how you can create new user accounts to interact with an Azure Database for PostgreSQL server.
services: postgresql
author: jasonwhowell
ms.author: jasonh
editor: jasonwhowell
manager: jhubbard
ms.service: postgresql-database
ms.topic: article
ms.date: 01/02/2018
---

# Create users in Azure Database for PostgreSQL server 
This article describes how you can create users in an Azure Database for PostgreSQL server.

When you first created your Azure Database for PostgreSQL, you provided a server admin login user name and password. For more information, you can follow the [Quickstart](quickstart-create-server-database-portal.md). You can locate your server admin login user name from the Azure portal.

The server admin user gets certain privileges for your server as listed:
  LOGIN, NOSUPERUSER, INHERIT, CREATEDB, CREATEROLE, NOREPLICATION

Once the Azure Database for PostgreSQL server is created, use the server admin user account to create additional users and grant admin access to them. Also, the server admin account can be used to create less privileged users and roles that have access to individual database schemas.

## How to create additional admin users in Azure Database for PostgreSQL
1. Get the connection information and admin user name.
   To connect to your database server, you need the full server name and admin sign-in credentials. You can easily find the server name and sign-in information from the server **Overview** page or the **Properties** page in the Azure portal. 

2. Use the admin account and password to connect to your database server. Use your preferred client tool, such as PostgreSQL Workbench, PostgreSQL.exe, HeidiSQL, or others. 
   If you are unsure of how to connect, see [Use PostgreSQL Workbench to connect and query data](./connect-workbench.md)

3. Edit and run the following SQL code. Replace your new user name for the placeholder value `new_master_user`. This syntax grants the listed privileges on all the database schemas (*.*) to the user name (new_master_user in this example). 

   ```sql
   CREATE USER new_master_user WITH LOGIN NOSUPERUSER INHERIT CREATEDB CREATEROLE NOREPLICATION PASSWORD 'StrongPassword!';
   
   GRANT azure_pg_admin TO new_master_user;
   ```

## How to create database users in Azure Database for PostgreSQL

1. Get the connection information and admin user name.
   To connect to your database server, you need the full server name and admin sign-in credentials. You can easily find the server name and sign-in information from the server **Overview** page or the **Properties** page in the Azure portal. 

2. Use the admin account and password to connect to your database server. Use your preferred client tool, such as pgAdmin or psql.

3. Edit and run the following SQL code. Replace the placeholder value `db_user` with your intended new user name, and placeholder value `testdb` with your own database name.

   This sql code syntax creates a new database named testdb, for example purposes. Then it creates a new user in the PostgreSQL service, and grants all privileges to the new database schema (testdb.\*) for that user. 

   ```sql
   CREATE DATABASE testdb;
   
   CREATE ROLE db_user WITH LOGIN NOSUPERUSER INHERIT CREATEDB CREATEROLE NOREPLICATION PASSWORD 'StrongPassword!';
   
   GRANT CONNECT ON DATABASE testdb TO db_user;
   ```

4. Using an admin account, you may need to grant additional privileges to secure the objects in the database. Refer to the [PostgreSQL documentation](https://www.postgresql.org/docs/current/static/ddl-priv.html) for further details on database roles and privileges. 
   ```sql
   
   GRANT ALL PRIVILEGES ON DATABASE testdb TO db_user;
   
   GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO db_user;
   ```

5. Log in to the server, specifying the designated database, using the new user name and password. This example shows the psql command line. With this command, you are prompted for the password for the user name. Replace your own server name, database name, and user name.

   ```azurecli-interactive
   psql --host=myserver.postgres.database.azure.com --port=5432 --username=db_user@myserver --dbname=testdb
   ```

## Next steps
Open the firewall for the IP addresses of the new users' machines to enable them to connect:
[Create and manage Azure Database for PostgreSQL firewall rules by using the Azure portal](howto-manage-firewall-using-portal.md) or [Azure CLI](howto-manage-firewall-using-cli.md).

For more information regarding user account management, see PostgreSQL product documentation for [Database Roles and Privileges](https://www.postgresql.org/docs/current/static/user-manag.html), [GRANT Syntax](https://www.postgresql.org/docs/current/static/sql-grant.html), and [Privileges](https://www.postgresql.org/docs/current/static/ddl-priv.html).

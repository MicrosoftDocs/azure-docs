---
title: How to create users for Azure Database for MySQL
description: This article describes how to create new user accounts to interact with an Azure Database for MySQL server.
author: savjani
ms.author: pariks
ms.reviewer: maghan
ms.date: 03/29/2023
ms.service: mysql
ms.subservice: single-server
ms.topic: how-to
---
# Create users in Azure Database for MySQL

[!INCLUDE [applies-to-mysql-single-flexible-server](includes/applies-to-mysql-single-flexible-server.md)]

[!INCLUDE [Azure-database-for-mysql-single-server-deprecation](includes/Azure-database-for-mysql-single-server-deprecation.md)]

This article describes how to create users for Azure Database for MySQL.

> [!NOTE]  
> This article references the term *slave*, which Microsoft no longer uses. When the term is removed from the software, we'll remove it from this article.

You provided a server admin username and password when creating your Azure Database for MySQL server. For more information, see this [Quickstart](quickstart-create-mysql-server-database-using-azure-portal.md). You can determine your server admin user name in the Azure portal.

The server admin user has these privileges:

   SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, RELOAD, PROCESS, REFERENCES, INDEX, ALTER, SHOW DATABASES, CREATE TEMPORARY TABLES, LOCK TABLES, EXECUTE, REPLICATION SLAVE, REPLICATION CLIENT, CREATE VIEW, SHOW VIEW, CREATE ROUTINE, ALTER ROUTINE, CREATE USER, EVENT, TRIGGER

After you create an Azure Database for the MySQL server, you can use the first server admin account to create more users and grant admin access to them. You can also use the server admin account to create less privileged users with access to individual database schemas.

> [!NOTE]  
> The SUPER privilege and DBA role aren't supported. Review the [privileges](concepts-limits.md#privileges--data-manipulation-support) in the limitations article to understand what's not supported in the service.
>  
> Password plugins like `validate_password` and `caching_sha2_password` aren't supported by the service.

## Create a database

1. Get the connection information and admin user name.
   You need the full server name and admin sign-in credentials to connect to your database server. You can easily find the server name and sign-in information on the server **Overview** or the **Properties** page in the Azure portal.

1. Use the admin account and password to connect to your database server. Use your preferred client tool, MySQL Workbench, mysql.exe, or HeidiSQL.

> [!NOTE]  
> If you're not sure how to connect, see [connect and query data for Single Server](single-server/connect-workbench.md) or [connect and query data for Flexible Server](flexible-server/connect-workbench.md).

1. Edit and run the following SQL code. Replace the placeholder value `db_user` with your intended new user name. Replace the placeholder value `testdb` with your database name.

   This SQL code creates a new database named testdb. It then makes a new user in the MySQL service and grants that user all privileges for the new database schema (testdb.\*).

   ```sql
   CREATE DATABASE testdb;
   ```

## Create a nonadmin user

 Now that the database is created, you can start with a nonadmin user with the ```CREATE USER``` MySQL statement.

   ``` sql
   CREATE USER 'db_user'@'%' IDENTIFIED BY 'StrongPassword!';

   GRANT ALL PRIVILEGES ON testdb . * TO 'db_user'@'%';

   FLUSH PRIVILEGES;
   ```

## Verify the user permissions

Run the ```SHOW GRANTS``` MySQL statement to view the privileges allowed for user **db_user**  on **testdb** database.

   ```sql
   USE testdb;

   SHOW GRANTS FOR 'db_user'@'%';
   ```

## Connect to the database with the new user

Sign in to the server, specifying the designated database and using the new username and password. This example shows the MySQL command line. When you use this command, you are prompted for the user's password. Use your own server name, database name, and user name. See how to connect the single server and the flexible server below.

| Server type | Usage |
| --- | --- |
| Single Server | ```mysql --host mydemoserver.mysql.database.azure.com --database testdb --user db_user@mydemoserver -p``` |
| Flexible Server | ```mysql --host mydemoserver.mysql.database.azure.com --database testdb --user db_user -p``` |

## Limit privileges for a user

To restrict the type of operations a user can run on the database, you must explicitly add the operations in the **GRANT** statement. See an example below:

   ```sql
   CREATE USER 'new_master_user'@'%' IDENTIFIED BY 'StrongPassword!';

   GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, RELOAD, PROCESS, REFERENCES, INDEX, ALTER, SHOW DATABASES, CREATE TEMPORARY TABLES, LOCK TABLES, EXECUTE, REPLICATION SLAVE, REPLICATION CLIENT, CREATE VIEW, SHOW VIEW, CREATE ROUTINE, ALTER ROUTINE, CREATE USER, EVENT, TRIGGER ON *.* TO 'new_master_user'@'%' WITH GRANT OPTION;

   FLUSH PRIVILEGES;
   ```

## About azure_superuser

All Azure Databases for MySQL servers are created with a user called "azure_superuser". Microsoft created a system account to manage the server to conduct monitoring, backups, and other regular maintenance. On-call engineers may also use this account to access the server during an incident with certificate authentication and must request access using just-in-time (JIT) processes.

## Next steps

- For more information about user account management, see the MySQL product documentation for [User account management](https://dev.mysql.com/doc/refman/5.7/en/access-control.html), [GRANT syntax](https://dev.mysql.com/doc/refman/5.7/en/grant.html), and [Privileges](https://dev.mysql.com/doc/refman/5.7/en/privileges-provided.html).

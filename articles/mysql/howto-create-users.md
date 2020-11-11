---
title: Create databases and users - Azure Database for MySQL
description: This article describes how to create new user accounts to interact with an Azure Database for MySQL server.
author: ajlam
ms.author: andrela
ms.service: mysql
ms.topic: how-to
ms.date: 10/1/2020
---

# Create databases and users in Azure Database for MySQL

[!INCLUDE[applies-to-single-flexible-server](includes/applies-to-single-flexible-server.md)]

This article describes how to create users in Azure Database for MySQL.

> [!NOTE]
> **Bias-free communication**
>
> Microsoft supports a diverse and inclusionary environment. This article contains references to the word *slave*. The Microsoft [style guide for bias-free communication](https://github.com/MicrosoftDocs/microsoft-style-guide/blob/master/styleguide/bias-free-communication.md) recognizes this as an exclusionary word. The word is used in this article for consistency because it's the word that currently appears in the software. When the software is updated to remove the word, this article will be updated to be in alignment.
>

When you first created your Azure Database for MySQL server, you provided a server admin user name and password. For more information, see this [Quickstart](quickstart-create-mysql-server-database-using-azure-portal.md). You can determine your server admin user name in the Azure portal.

The server admin user has these privileges: 

   SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, RELOAD, PROCESS, REFERENCES, INDEX, ALTER, SHOW DATABASES, CREATE TEMPORARY TABLES, LOCK TABLES, EXECUTE, REPLICATION SLAVE, REPLICATION CLIENT, CREATE VIEW, SHOW VIEW, CREATE ROUTINE, ALTER ROUTINE, CREATE USER, EVENT, TRIGGER


After you create an Azure Database for MySQL server, you can use the first server admin account to create additional users and grant admin access to them. You can also use the server admin account to create less privileged users that have access to individual database schemas.

> [!NOTE]
> The SUPER privilege and DBA role aren't supported. Review the [privileges](concepts-limits.md#privileges--data-manipulation-support) in the limitations article to understand what's not supported in the service.
>
> Password plugins like `validate_password` and `caching_sha2_password` aren't supported by the service.


## To create a database with a non-admin user in Azure Database for MySQL

1. Get the connection information and admin user name.
   To connect to your database server, you need the full server name and admin sign-in credentials. You can easily find the server name and sign-in information on the server **Overview** page or on the **Properties** page in the Azure portal.

2. Use the admin account and password to connect to your database server. Use your preferred client tool, such as MySQL Workbench, mysql.exe, or HeidiSQL.
   
   If you're not sure how to connect, see [connect and query data for Single Server](./connect-workbench.md) or [connect and query data for Flexible Server](./flexible-server/connect-workbench.md).

3. Edit and run the following SQL code. Replace the placeholder value `db_user` with your intended new user name. Replace the placeholder value `testdb` with your database name.

   This SQL code creates a new database named testdb. It then creates a new user in the MySQL service and grants all privileges for the new database schema (testdb.\*) to that user.

   ```sql
   CREATE DATABASE testdb;

   CREATE USER 'db_user'@'%' IDENTIFIED BY 'StrongPassword!';

   GRANT ALL PRIVILEGES ON testdb . * TO 'db_user'@'%';

   FLUSH PRIVILEGES;
   ```

4. Verify the grants in the database:

   ```sql
   USE testdb;

   SHOW GRANTS FOR 'db_user'@'%';
   ```

5. Sign in to the server, specifying the designated database and using the new user name and password. This example shows the mysql command line. When you use this command, you'll be prompted for the user's password. Use your own server name, database name, and user name.

   # [Single Server](#tab/single-server)

   ```azurecli-interactive
   mysql --host mydemoserver.mysql.database.azure.com --database testdb --user db_user@mydemoserver -p
   ```
   # [Flexible Server](#tab/flexible-server)

   ```azurecli-interactive
   mysql --host mydemoserver.mysql.database.azure.com --database testdb --user db_user -p
   ```
 ---

## To create additional admin users in Azure Database for MySQL

1. Get the connection information and admin user name.
   To connect to your database server, you need the full server name and admin sign-in credentials. You can easily find the server name and sign-in information on the server **Overview** page or on the **Properties** page in the Azure portal.

2. Use the admin account and password to connect to your database server. Use your preferred client tool, such as MySQL Workbench, mysql.exe, or HeidiSQL.
   
   If you're not sure how to connect, see [Use MySQL Workbench to connect and query data](./connect-workbench.md).

3. Edit and run the following SQL code. Replace the placeholder value `new_master_user` with your new user name. This syntax grants the listed privileges on all the database schemas (*.*) to the user (`new_master_user` in this example).

   ```sql
   CREATE USER 'new_master_user'@'%' IDENTIFIED BY 'StrongPassword!';

   GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, RELOAD, PROCESS, REFERENCES, INDEX, ALTER, SHOW DATABASES, CREATE TEMPORARY TABLES, LOCK TABLES, EXECUTE, REPLICATION SLAVE, REPLICATION CLIENT, CREATE VIEW, SHOW VIEW, CREATE ROUTINE, ALTER ROUTINE, CREATE USER, EVENT, TRIGGER ON *.* TO 'new_master_user'@'%' WITH GRANT OPTION;

   FLUSH PRIVILEGES;
   ```

4. Verify the grants:

   ```sql
   USE sys;

   SHOW GRANTS FOR 'new_master_user'@'%';
   ```

## azure_superuser

All Azure Database for MySQL servers are created with a user called "azure_superuser". This is a system account created by Microsoft to manage the server to conduct monitoring, backups, and other regular maintenance. On-call engineers may also use this account to access the server during an incident with certificate authentication and must request access using just-in-time (JIT) processes.

## Next steps

Open the firewall for the IP addresses of the new users' machines to enable them to connect:
- [Create and manage firewall rules on Single Server](howto-manage-firewall-using-portal.md) 
- [ Create and manage firewall rules on Flexible Server](flexible-server/how-to-connect-tls-ssl.md)

For more information about user account management, see the MySQL product documentation for [User account management](https://dev.mysql.com/doc/refman/5.7/en/access-control.html), [GRANT syntax](https://dev.mysql.com/doc/refman/5.7/en/grant.html), and [Privileges](https://dev.mysql.com/doc/refman/5.7/en/privileges-provided.html).

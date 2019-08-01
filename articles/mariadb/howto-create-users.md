---
title: Create users in Azure Database for MariaDB server
description: This article describes how you can create new user accounts to interact with an Azure Database for MariaDB server.
author: ajlam
ms.author: andrela
ms.service: mariadb
ms.topic: conceptual
ms.date: 09/24/2018
---

# Create users in Azure Database for MariaDB 
This article describes how you can create users in Azure Database for MariaDB.

When you first created your Azure Database for MariaDB, you provided a server admin login user name and password. For more information, you can follow the [Quickstart](quickstart-create-mariadb-server-database-using-azure-portal.md). You can locate your server admin login user name from the Azure portal.

The server admin user gets certain privileges for your server as listed:
SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, RELOAD, PROCESS, REFERENCES, INDEX, ALTER, SHOW DATABASES, CREATE TEMPORARY TABLES, LOCK TABLES, EXECUTE, REPLICATION SLAVE, REPLICATION CLIENT, CREATE VIEW, SHOW VIEW, CREATE ROUTINE, ALTER ROUTINE, CREATE USER, EVENT, TRIGGER

Once the Azure Database for MariaDB server is created, you can use the first server admin user account to create additional users and grant admin access to them. Also, the server admin account can be used to create less privileged users that have access to individual database schemas.

## Create additional admin users
1. Get the connection information and admin user name.
   To connect to your database server, you need the full server name and admin sign-in credentials. You can easily find the server name and sign-in information from the server **Overview** page or the **Properties** page in the Azure portal. 

2. Use the admin account and password to connect to your database server. Use your preferred client tool, such as MySQL Workbench, mysql.exe, HeidiSQL, or others. 
   If you are unsure of how to connect, see [Use MySQL Workbench to connect and query data](./connect-workbench.md)

3. Edit and run the following SQL code. Replace your new user name for the placeholder value `new_master_user`. This syntax grants the listed privileges on all the database schemas (*.*) to the user name (new_master_user in this example). 

   ```sql
   CREATE USER 'new_master_user'@'%' IDENTIFIED BY 'StrongPassword!';
   
   GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, RELOAD, PROCESS, REFERENCES, INDEX, ALTER, SHOW DATABASES, CREATE TEMPORARY TABLES, LOCK TABLES, EXECUTE, REPLICATION SLAVE, REPLICATION CLIENT, CREATE VIEW, SHOW VIEW, CREATE ROUTINE, ALTER ROUTINE, CREATE USER, EVENT, TRIGGER ON *.* TO 'new_master_user'@'%' WITH GRANT OPTION; 
   
   FLUSH PRIVILEGES;
   ```

4. Verify the grants 
   ```sql
   USE sys;
   
   SHOW GRANTS FOR 'new_master_user'@'%';
   ```

## Create database users

1. Get the connection information and admin user name.
   To connect to your database server, you need the full server name and admin sign-in credentials. You can easily find the server name and sign-in information from the server **Overview** page or the **Properties** page in the Azure portal. 

2. Use the admin account and password to connect to your database server. Use your preferred client tool, such as MySQL Workbench, mysql.exe, HeidiSQL, or others. 
   If you are unsure of how to connect, see [Use MySQL Workbench to connect and query data](./connect-workbench.md)

3. Edit and run the following SQL code. Replace the placeholder value `db_user` with your intended new user name, and placeholder value `testdb` with your own database name.

   This sql code syntax creates a new database named testdb for example purposes. Then it creates a new user in the Azure Database for MariaDB service, and grants all privileges to the new database schema (testdb.\*) for that user. 

   ```sql
   CREATE DATABASE testdb;
   
   CREATE USER 'db_user'@'%' IDENTIFIED BY 'StrongPassword!';
   
   GRANT ALL PRIVILEGES ON testdb . * TO 'db_user'@'%';
   
   FLUSH PRIVILEGES;
   ```

4. Verify the grants within the database.
   ```sql
   USE testdb;
   
   SHOW GRANTS FOR 'db_user'@'%';
   ```

5. Log in to the server, specifying the designated database, using the new user name and password. This example shows the mysql command line. With this command, you are prompted for the password for the user name. Replace your own server name, database name, and user name.

   ```bash
   mysql --host mydemoserver.mariadb.database.azure.com --database testdb --user db_user@mydemoserver -p
   ```
   For more information regarding user account management, see MariaDB documentation for [User account management](https://mariadb.com/kb/en/library/user-account-management/), [GRANT Syntax](https://mariadb.com/kb/en/library/grant/), and [Privileges](https://mariadb.com/kb/en/library/grant/#privilege-levels).

## Next steps
Open the firewall for the IP addresses of the new users' machines to enable them to connect:
[Create and manage Azure Database for MariaDB firewall rules by using the Azure portal](howto-manage-firewall-portal.md)  

<!--or [Azure CLI](howto-manage-firewall-using-cli.md).-->

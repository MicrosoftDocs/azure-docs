---
title: 'Quick start: Query MySQL database on Azure - mysql command line | Microsoft Docs'
description: This quick start describes how to use mysql command-line tool to connect and query a MySQL database in an Azure Database for MySQL server.
services: mysql
documentationcenter: 
author: v-chenyh
ms.author: v-chenyh
manager: jhubbard
editor: jasonh
ms.assetid: 
ms.service: mysql-database
ms.devlang: na
ms.topic: hero-article
ms.tgt_pltfrm: portal
ms.workload:
ms.date: 04/17/2017
ms.custom: quick start connect
---

# Quick start: Connect and query Azure Database for MySQL using mysql command-line tool

This quick start describes how to use mysql command-line tool to connect and query a database in an Azure Database for MySQL server.

This quick start takes about 5 minutes to complete and uses mysql.exe to:
- connect to the server
- connect to the database
- create a new table
- insert data into the table
- query data in the table
- update data in the table
- delete data in the table
- delete entire table

## Prerequisites
 
* **[mysql](https://dev.mysql.com/doc/refman/5.6/en/mysql.html) command-line tool** with input line editing capabilities. It supports interactive and noninteractive use. When used interactively, query results are presented in an ASCII-table format. When used noninteractively (for example, as a filter), the result is presented in tab-separated format. The output format can be changed using command options.

* **An existing MySQL server on Azure**. Make sure you have created an Azure MySQL server and enabled server-level firewall rules with one of the following quick starts:
- [Create MySQL Server using Azure Portal (mysql)](placeholder-link.md)
- [Create MySQL Server using Azure CLI](placeholder-link.md)

> [!TIP]
> TIP: Refer to [MySQL 5.6 Reference Manual - Chapter 4.5.1](https://dev.mysql.com/doc/refman/5.6/en/mysql.html) for more information about mysql command-line tool.

## Get connection information
Get the fully qualified server name for your Azure MySQL server from the Azure portal. Use the fully qualified server name to connect to your server using standard MySQL client application and tools.

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Click **All resources** from the left-hand menu, and click your Azure MySQL server.
3. Click **Properties**. Make note of the **SERVER NAME** and **SERVER ADMIN LOGIN** - you'll need them later.

![Get the MySQL server name and login from the Azure Portal](./media/mysql-quickstart-connect-query-using-mysql/1_server-properties.png)

In this example, the server name is *mysql4doc.database.windows.net*, and the server admin login is *mysqladmin@mysql4doc*.
## Connect to the server
```dos
C:\mysql -h mysqlserver4demo.database.windows.net -u myadmin@mysqlserver4demo -p
```

![Connecting to server using mysql command-line tool](./media/mysql-quickstart-connect-query-using-mysql/2_connect-to-the-server.png)

## Create the database
The CREATE DATABASE command creates a new database. Copy and paste the following command at the mysql command prompt to create a database.
```sql
mysql> CREATE DATABASE mydemodb;
```
This command will create a database named “mydemodb”. If this command executed successfully, mysql will return a message of “Query OK”.
## Connect to the database
The USE command selects a certain database ready for executing the following commands. Copy and paste the following command at the mysql command prompt to connect to the database.
```sql
mysql> USE mydemodb;
```
This command will change selected database to “mydemodb” - the one created in the previous step. All subsequent manipulations will be targeted to this selected database. If this command executed successfully, mysql will return a message of “Database changed”.

## Create a new table
The CREATE TABLE command creates a new table. Copy and paste the following command at the mysql command prompt to create a table.
```sql
mysql> CREATE TABLE customers (CustomerID INT, CustomerName VARCHAR(50), PRIMARY KEY (CustomerID))ENGINE=InnoDB;
```
This command creates a new table named “customers” which has two columns: CustomerID and CustomerName. CustomerID is the primary key. If this command executed successfully, mysql will return a message of “Query OK”.
## Insert data into the table
The INSERT INTO command inserts data into a table. Copy and paste the following command at the mysql command prompt to insert data into selected table.
```sql
mysql> INSERT INTO customers (CustomerID, CustomerName) VALUES('1001', 'Hannah'), (‘1002’, ‘Peter’);
```
This command will insert 2 rows into "customers" table. If this command executed successfully, mysql will return a message of "Query OK, 2 rows affected".
## Query data in the table
The SELECT command queries data rows from a table. Copy and paste the following command at the mysql command prompt to query all rows from the target table.
```sql
mysql> SELECT * FROM customers;
```
This command outputs 2 rows from table “customers”. If this command executed successfully, mysql will have the following output:

![Example customer table output from mysql](./media/mysql-quickstart-connect-query-using-mysql/3_query-data-in-the-table.png)

## Update data in the table
The UPDATE command updates existing rows in a table. Copy and paste the following command at the mysql command prompt to update one row.
```sql
mysql> UPDATE customers SET CustomerName='Rose' WHERE CustomerID='1002';
```
This command changes CustomerName with “Peter” to “Rose”. If this command executed successfully, mysql will return a message of “Query OK, 1 row affected”.

## Delete data in the table
The DELETE command can be used to delete existing rows in the table. Copy and paste the following command at the mysql command prompt to delete one row.
```sql
mysql> DELETE FROM customers WHERE CustomerName='Hannah';
```
This command will delete entire row of record which contains “Hannah”. If this command executed successfully, mysql will return a message of “Query OK, 1 row affected”.

## Delete entire table
The DROP command can be used to delete entire table. Use this command cautiously, because you will lost all of the data within the table. This action cannot be un-done.
Copy and paste the following command at the mysql command prompt to delete entire table.
```sql
mysql> DROP TABLE customers;
```
This command will delete all rows in “customers” table, and the table will cease to exist after this action. If this command executed successfully, mysql will return a message of “Query OK, 0 rows affected”.

## Next steps
- For more information regarding mysql command-line tool, see [MySQL 5.6 Reference Manual - Chapter 4.5.1](https://dev.mysql.com/doc/refman/5.6/en/mysql.html)
- To connect and query using MySQL Workbench, see [Connect and query - Workbench](placeholder.md).
- To migrate data from an existing MySQL database, see [Migrate data from MySQL](placeholder.md).
- For a technical overview of Azure Database for MySQL, see [About Azure Database for MySQL](placeholder.md).

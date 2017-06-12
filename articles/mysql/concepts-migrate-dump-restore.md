---
title: Migrate your MySQL database using dump and restore in Azure Database for MySQL | Microsoft Docs
description: This article explains two common ways to back up and restore databases in your Azure Database for MySQL, using tools such as mysqldump, MySQL Workbench, and PHPMyAdmin.
services: mysql
author: v-chenyh
ms.author: v-chenyh
manager: jhubbard
editor: jasonwhowell
ms.assetid:
ms.service: mysql-database
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: portal
ms.date: 06/12/2017
---

# Migrate your MySQL database to Azure Database for MySQL using dump and restore
This article explains two common ways to back up and restore databases in your Azure Database for MySQL
- Back up and restore from the command-line (using mysqldump) 
- Back up and restore using PHPMyAdmin 

## Before you begin
To step through this how-to guide, you need to have:
- [Create Azure Database for MySQL server - Azure portal](quickstart-create-mysql-server-database-using-azure-portal.md)
- [mysqldump](https://dev.mysql.com/doc/refman/5.7/en/mysqldump.html) command-line utility installed on a machine
- MySQL Workbench [MySQL Workbench Download](https://dev.mysql.com/downloads/workbench/), Toad, Navicat or any third-party MySQL tool

## Use common tools
Use common tools such as MySQL Workbench, mysqldump, Toad, or Navicat to remotely connect and restore data into Azure Database for MySQL. Use such tools on your client machine with an internet connection to connect to the Azure Database for MySQL. Use an SSL encrypted connection for best security practices, see also [Configure SSL connectivity in Azure Database for MySQL](concepts-ssl-connection-security.md). You do not need to move the dump files to any special cloud location when migrating to Azure Database for MySQL. 

## Common uses for Dump and Restore
You may use MySQL utilities such as mysqldump and mysqlpump to dump and load databases into an Azure MySQL Database in several common scenarios. In other scenarios, you may use the [Import and Export](concepts-migrate-import-export.md) approach instead.

- Use database dumps when you are migrating the entire database. This recommendation holds when moving a large amount of MySQL data, or when you want to minimize service interruption for live sites or applications. 
-  Make sure all tables in the database must use the InnoDB storage engine when loading data into Azure Database for MySQL. Azure Database for MySQL supports only InnoDB Storage engine, and therefore does not support alternative storage engines. If your tables are configured with other storage engines, first convert those into the InnoDB engine format before migration to Azure Database for MySQL.
   For example, if you have a WordPress or other WebApp which uses the MyISAM engine, you should first convert those tables by migrating the data into InnoDB tables prior to restoring to Azure Database for MySQL. Use the clause `ENGINE=InnoDB` to set the engine used when creating a new table, then transfer the data into the compatible table before the restore. 
   ```sql
   INSERT INTO innodb_table SELECT * FROM myisam_table ORDER BY primary_key_columns
   ```
- Ensure the **same version** of MySQL is used on the source and destination systems when dumping databases. For example, if your existing MySQL server is version 5.7, then you should migrate to Azure Database for MySQL configured to run version 5.7. Ensure your existing MySQL Server version is same as your new Azure MySQL Server to avoid any compatibility issue. The `mysql_upgrade` command does not function in an Azure Database for MySQL server, and is not supported. If you require to upgrade across MySQL versions, first dump or export your lower version database into a higher version of MySQL in your own environment to run `mysql_upgrade`, before attempting migration into an Azure Database for MySQL.

## Performance Considerations
To optimize performance, take notice of these considerations when operating on extremely large databases:
-	Use the `exclude-triggers` option. Exclude triggers from dump files to avoid those triggering upon restore, since triggers can be added explicitly after restoring is complete. 
-	Avoid the `single-transaction` option. Dumping tables within a single transaction causes extra storage and memory resources to be consumed during restore and may cause performance delays or resource constraints.
-	Create clustered indexes and primary keys before loading data. Load data in primary key order. 
-	Use the `defer-table-indexes` option. When loading data, defer index creation until after loading table rows. Delay creation of secondary indexes until after data is loaded. Create all secondary indexes after loading. 
-	Disable foreign key constraints before load. Disabling foreign key checks will provide significant performance gains. Enable the constraints and verify the data after the load to ensure referential integrity.
-	Load data in parallel. Avoid too much parallelism that would cause you to hit a resource limit, and monitor resources using the metrics available in the Azure portal. 
-	Use partitioned tables when appropriate.
-	Use multi-value inserts when loading with SQL to minimize statement execution overhead. When using dump files generated by mysqldump utility, this is done automatically. 


## Create a backup file from the command-line using mysqldump
To back up an existing MySQL database on-prem or in a VM, run the following command: 
```bash
$ mysqldump -h=servername.mysql.database.azure.com -u user@servername -ppassword db_name > backupfile.sql
```

The parameters to provide are:
- user: Your server administrator login 
- password: The password for your login (note there is no space between -p and the password) 
- db_name: The name of your database 
- backupfile.sql: The filename for your database backup 

For example, to back up a database named 'testdb' with the username 'myadmin' and with no password to a file testdb_backup.sql, use the following command. This command will back up the 'testdb' database into a file called testdb_backup.sql which will contain all the SQL statements needed to re-create the database. 

```bash
$ mysqldump --host=myserver4demo.mysql.database.azure.com  -u myadmin@myserver4demo -ppassword testdb > testdb_backup.sql
```
To select specific tables in your database to back up, list the table names separated by spaces. For example, to back up only table1 and table2 tables from the 'testdb', follow this example: 
```bash
$ mysqldump --host=myserver4demo.mysql.database.azure.com  -u root -p testdb table1 table2 > testdb_tables_backup.sql
```

To back up more than one database at once, use the --database switch and list the database names separated by spaces. 
```bash
$ mysqldump -u root -p --databases testdb1 testdb3 testdb5 > testdb135_backup.sql 
```
To back up all the databases in the server at one time, you should use the --all-databases option.
```
$ mysqldump -u root -p --all-databases > alldb_backup.sql 
```

## Create a database on the target Azure MySQL server
You must create an empty database on the target Azure Database for MySQL server where you want to migrate the data using MySQL Workbench, Toad, Navicat or any third-party tool for MySQL. The database can have the same name as the database that is contained the dumped data or you can create a database with a different name.

![Azure Database for MySQL Connection String](./media/concepts-migrate-import-export/p5.png)

![MySQL Workbench Connection String](./media/concepts-migrate-import-export/p4.png)


## Restore your MySQL database using command-line or MySQL Workbench
Once you have created the target database, you can use the mysql command or MySQL Workbench to restore the data into the specific newly created database from the dump file.
```bash
mysql -u [uname] -p[pass] [db_to_restore] < [backupfile.sql]
```
In this example, we will restore the data to the newly created database testdb3 on target server.
```bash
$ mysql -u root -p testdb3 < testdb_backup.sql
```

## Export using PHPMyAdmin
To export, you can use the common tool phpMyAdmin which you may already have installed locally in your environment. To export your MySQL database using PHPMyAdmin:
- Open phpMyAdmin.
- Select your database by clicking the database name in the list on the left of the screen. 
- Click the Export link. This should bring up a new screen that says View dump of database. 
- In the Export area, click the Select All link to choose all of the tables in your database. 
- In the SQL options area, click the right options. 
- Click on the Save as file option and the corresponding compression option and then click the 'Go' button. A dialog box should appear prompting you to save the file locally.

## Import using PHPMyAdmin
Importing your database is similar to exporting. Do the following actions:
- Open phpMyAdmin. 
- Create an appropriately named database and select it by clicking the database name in the list on the left of the screen. If you would like to rewrite the import over an existing database then click on the database name, select all the check boxes next to the table names and select Drop to delete all existing tables in the database. 
- Click the SQL link. This should bring up a new screen where you can type in SQL commands, or upload your SQL file. 
- Use the browse button to find the database file. 
- Click the Go button. This will export the backup, execute the SQL commands and re-create your database.

## Next steps
[Create an Azure Database for MySQL server using Azure portal](quickstart-create-mysql-server-database-using-azure-portal.md) 
[Create an Azure Database for MySQL server using Azure CLI](quickstart-create-mysql-server-database-using-azure-cli.md)

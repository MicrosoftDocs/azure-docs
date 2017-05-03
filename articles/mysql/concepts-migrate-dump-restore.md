---
title: Backup and restore in Azure Database for MySQL | Microsoft Docs
description: Introduces backing up and restoring databases in Azure Database for MySQL 
services: mysql
author: v-chenyh
ms.author: v-chenyh
manager: jhubbard
editor: jasonh
ms.assetid:
ms.service: mysql-database
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: portal
ms.date: 05/10/2017
---
# Backup and restore in Azure Database for MySQL
Azure Database for MySQL creates database dumps (backups) automatically and periodically. Database dumps are an essential part of any business continuity and disaster recovery strategy because they protect your data from accidental corruption or deletion. 
## What is a MySQL database dump (backup)?
MySQL database uses MySQL native dump to create full and incremental (Point in Time Recovery from Binary Log) dump(backup). Incremental dump allows you to restore a database to a specific point-in-time to the same server that hosts the database. When you restore a database, the service figures out which full or incremental dumps need to be restored.
You can use these dumps to: 
- Restore a database to a point-in-time within the retention period (data corruption or accidental deletion). This operation will create a new database in the same server as the original database.
- Restore a deleted database to the time it was deleted or any time within the retention period. The deleted database can only be restored in the same server where the original database was created.
- Restore a database to another geographical region. This allows you to recover from a geographic disaster when you cannot access your server and database. It creates a new database in any existing server anywhere in the world. 
- Restore a database from a specific dump stored in your Azure Recovery Services vault. This allows you to restore an old version of the database to satisfy a compliance request or to run an old version of the application. 
- To perform a restore, see restore database from backups.

## How often do backups happen?
Full database backups happen Daily, Incremental database backups generally happen every 15 minutes. The first full backup is scheduled immediately after a database is created. It usually completes within 30 minutes, but it can take longer when the database is of a significant size. For example, the initial backup can take longer on a restored database or a database copy. After the first full backup, all further backups are scheduled automatically and managed silently in the background. The exact timing of all database backups is determined by the MySQL Database service as it balances the overall system workload.

## How long do you keep my backups?
Each MySQL Database backup has a retention period that is based on the service-tier of the database. The retention period for a database in the:
- Basic service tier is 7 days.
- Standard service tier is 35 days.

If you downgrade your database from the Standard service tiers to Basic, the backups are saved for seven days. All existing backups older than seven days are no longer available.

If you upgrade your database from the Basic service tier to Standard, SQL Database keeps existing backups until they are 35 days old. It keeps new backups as they occur for 35 days.
If you delete a database, MySQL Database keeps the backups in the same way it would for an online database. For example, suppose you delete a Basic database that has a retention period of seven days. A backup that is four days old is saved for three more days.

> ![IMPORTANT]
> If you delete the Azure MySQL server that hosts MySQL Databases, all databases that belong to the server are also deleted and cannot be recovered. You cannot restore a deleted server. + 

## Migrate your MySQL database using dump and restore
This tutorial will show you two most common ways to backup and restore the data in your Azure MySQL database. 
- Backing up and restore from the Command Line (using mysqldump) 
- Backing Up and Restoring using PHPMyAdmin 

## Before you begin
To step through this how-to guide, you need:
- An Azure Database for MySQL server
- [mysqldump](https://dev.mysql.com/doc/refman/5.7/en/mysqldump.html) command line utility installed on a machine
- MySQL Workbench, Toad, Navicat or any third party query tool
- WinSCP to upload your dump file to Azure Server

## Create a backup file from the command-line using mysqldump
To backup an existing MySQL database on-prem or in a VM, run the following command: 
```bash
$ mysqldump --opt -u [uname] -p[pass] [dbname] > [backupfile.sql]
```

The parameters to provide are:
- [uname] Your database username 
- [pass] The password for your database (note there is no space between -p and the password) 
- [dbname] The name of your database 
- [backupfile.sql] The filename for your database backup 
- [--opt] The mysqldump option 

For example, to back up a database named 'testdb' with the username 'testuser' and with no password to a file testdb_backup.sql, you should accomplish this command:
$ mysqldump -u root -p testdb > testdb_backup.sql

This command will back up the 'testdb' database into a file called testdb_backup.sql which will contain all the SQL statements needed to re-create the database. 

With mysqldump command you can specify certain tables of your database you want to backup. For example, to back up only php_tutorials and asp_tutorials tables from the 'testdb' database accomplish the command below. Each table name has to be separated by space.
```bash
$ mysqldump -u root -p testdb php_tutorials asp_tutorials > testdb_tables_backup.sql
```

Sometimes it is necessary to back up more than one database at once. In this case, you can use the --database option followed by the list of databases you would like to backup. Each database name has to be separated by space.
```bash
$ mysqldump -u root -p --databases testdb1 testdb3 testdb5 > testdb135_backup.sql 
```

If you want to back up all the databases in the server at one time you should use the --all-databases option. It tells MySQL to dump all the databases it has in storage.
```
$ mysqldump -u root -p --all-databases > alldb_backup.sql 
```

## Uploading dump files
With WinSCP you can easily upload and manage the dump files on your Microsoft Azure instance/service over SFTP protocol or FTPS protocol.

## Create a database on the target Azure MySQL server
You must create an empty database on the target Azure Database for MySQL server where you want to migrate the data using MySQL Workbench, Toad, Navicat or any third party free tool for MySQL. The database can have the same name as the database that is contained the dumped data or you can create a database with a different name.

Use the following style of parameters into your query tool to connect to MySQL:
Server=mymysqltest.database.windows.net;
Port=3306;
Database= testdb3;
User=mytestlogin@mymysqltest and Password you may have set up.

## Restore your MySQL database using command line or MySQL Workbench
Once you have created the target database, you can use the mysql command or MySQL Workbench to restore the data into the specific newly created database from the dump file.
```bash
mysql -u [uname] -p[pass] [db_to_restore] < [backupfile.sql]
```
In this example, we will restore the data to the newly created database testdb3 on target server.
```bash
$ mysql -u root -p testdb3 < testdb_backup.sql
```

## Import and Export using PHPMyAdmin
It is assumed that you have phpMyAdmin installed since a lot of web service providers use it. To export your MySQL database using PHPMyAdmin just follow a couple of steps:
- Open phpMyAdmin.
- Select your database by clicking the database name in the list on the left of the screen. 
- Click the Export link. This should bring up a new screen that says View dump of database. 
- In the Export area, click the Select All link to choose all of the tables in your database. 
- In the SQL options area, click the right options. 
- Click on the Save as file option and the corresponding compression option and then click the 'Go' button. A dialog box should appear prompting you to save the file locally.

Importing your database is easy just like exporting. Make the following:
- Open phpMyAdmin. 
- Create an appropriately named database and select it by clicking the database name in the list on the left of the screen. If you would like to rewrite the import over an existing database then click on the database name, select all the check boxes next to the table names and select Drop to delete all existing tables in the database. 
- Click the SQL link. This should bring up a new screen where you can either type in SQL commands, or upload your SQL file. 
- Use the browse button to find the database file. 
- Click the Go button. This will export the backup, execute the SQL commands and re-create your database.
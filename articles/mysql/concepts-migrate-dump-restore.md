---
title: Migrate your MySQL database using dump and restore in Azure Database for MySQL | Microsoft Docs
description: Introduces migrating Azure Database for MySQL.
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

# Migrate your MySQL database using dump and restore
This article shows you two common ways to backup and restore databases in your Azure Database for MySQL
- Backing up and restore from the Command Line (using mysqldump) 
- Backing Up and Restoring using PHPMyAdmin 

## Before you begin
To step through this how-to guide, you need to have:
- [Create Azure Database for MySQL server - Azure portal](quickstart-create-mysql-server-database-using-azure-portal)
- [mysqldump](https://dev.mysql.com/doc/refman/5.7/en/mysqldump.html) command line utility installed on a machine
- MySQL Workbench [MySQL Workbench Download](https://dev.mysql.com/downloads/workbench/), Toad, Navicat or any third party MySQL tool
- WinSCP to upload your dump file to Azure Server [WinSCP Download](https://winscp.net/eng/download.php)


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
```bash
$ mysqldump -u root -p testdb > testdb_backup.sql
```

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

## Upload Files
With WinSCP you can easily upload and manage the import or dump of your existing MySQL enviornment (Azure or Non-Azure) files on your Local over SFTP protocol or FTPS protocol for export purpose.

## Create a database on the target Azure MySQL server
You must create an empty database on the target Azure Database for MySQL server where you want to migrate the data using MySQL Workbench, Toad, Navicat or any third party tool for MySQL. The database can have the same name as the database that is contained the dumped data or you can create a database with a different name.

![Azure Database for MySQL Connection String](./media/concepts-migrate-import-export/p5.png)

![MySQL Workbench Connection String](./media/concepts-migrate-import-export/p4.png)


## Restore your MySQL database using command line or MySQL Workbench
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
Importing your database is similar to exporting. Make the following:
- Open phpMyAdmin. 
- Create an appropriately named database and select it by clicking the database name in the list on the left of the screen. If you would like to rewrite the import over an existing database then click on the database name, select all the check boxes next to the table names and select Drop to delete all existing tables in the database. 
- Click the SQL link. This should bring up a new screen where you can either type in SQL commands, or upload your SQL file. 
- Use the browse button to find the database file. 
- Click the Go button. This will export the backup, execute the SQL commands and re-create your database.
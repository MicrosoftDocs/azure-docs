---
title: Migrate using dump and restore - Azure Database for MySQL
description: This article explains two common ways to back up and restore databases in your Azure Database for MySQL, using tools such as mysqldump, MySQL Workbench, and PHPMyAdmin.
author: ajlam
ms.author: andrela
ms.service: mysql
ms.topic: conceptual
ms.date: 2/27/2020
---

# Migrate your MySQL database to Azure Database for MySQL using dump and restore
This article explains two common ways to back up and restore databases in your Azure Database for MySQL
- Dump and restore from the command-line (using mysqldump) 
- Dump and restore using PHPMyAdmin 

## Before you begin
To step through this how-to guide, you need to have:
- [Create Azure Database for MySQL server - Azure portal](quickstart-create-mysql-server-database-using-azure-portal.md)
- [mysqldump](https://dev.mysql.com/doc/refman/5.7/en/mysqldump.html) command-line utility installed on a machine.
- MySQL Workbench [MySQL Workbench Download](https://dev.mysql.com/downloads/workbench/) or another third-party MySQL tool to do dump and restore commands.

If you are looking to migrate large databases with database sizes more than 1 TBs, you may want to consider using community tools like mydumper/myloader which supports parallel export and import. Parallel dump and restore can help significantly reduce migration time for large databases. You can refer to our [techcommunity blog](https://techcommunity.microsoft.com/t5/azure-database-for-mysql/best-practices-for-migrating-large-databases-to-azure-database/ba-p/1362699) for best practices for migrating large databases to Azure Database for MySQL service using mydumper/myloader tools.

## Use common tools
Use common utilities and tools such as MySQL Workbench or mysqldump to remotely connect and restore data into Azure Database for MySQL. Use such tools on your client machine with an internet connection to connect to the Azure Database for MySQL. Use an SSL encrypted connection for best security practices, see also [Configure SSL connectivity in Azure Database for MySQL](concepts-ssl-connection-security.md). You do not need to move the dump files to any special cloud location when migrating to Azure Database for MySQL. 

## Common uses for dump and restore
You may use MySQL utilities such as mysqldump and mysqlpump to dump and load databases into an Azure MySQL Database in several common scenarios. In other scenarios, you may use the [Import and Export](concepts-migrate-import-export.md) approach instead.

- Use database dumps when you are migrating the entire database. This recommendation holds when moving a large amount of MySQL data, or when you want to minimize service interruption for live sites or applications. 
-  Make sure all tables in the database use the InnoDB storage engine when loading data into Azure Database for MySQL. Azure Database for MySQL supports only InnoDB Storage engine, and therefore does not support alternative storage engines. If your tables are configured with other storage engines, convert them into the InnoDB engine format before migration to Azure Database for MySQL.
   For example, if you have a WordPress or WebApp using the MyISAM tables, first convert those tables by migrating into InnoDB format before restoring to Azure Database for MySQL. Use the clause `ENGINE=InnoDB` to set the engine used when creating a new table, then transfer the data into the compatible table before the restore. 

   ```sql
   INSERT INTO innodb_table SELECT * FROM myisam_table ORDER BY primary_key_columns
   ```
- To avoid any compatibility issues, ensure the same version of MySQL is used on the source and destination systems when dumping databases. For example, if your existing MySQL server is version 5.7, then you should migrate to Azure Database for MySQL configured to run version 5.7. The `mysql_upgrade` command does not function in an Azure Database for MySQL server, and is not supported. If you need to upgrade across MySQL versions, first dump or export your lower version database into a higher version of MySQL in your own environment. Then run `mysql_upgrade`, before attempting migration into an Azure Database for MySQL.

## Performance considerations
To optimize performance, take notice of these considerations when dumping large databases:
-	Use the `exclude-triggers` option in mysqldump when dumping databases. Exclude triggers from dump files to avoid the trigger commands firing during the data restore. 
-	Use the `single-transaction` option to set the transaction isolation mode to REPEATABLE READ and sends a START TRANSACTION SQL statement to the server before dumping data. Dumping many tables within a single transaction causes some extra storage to be consumed during restore. The `single-transaction` option and the `lock-tables` option are mutually exclusive because LOCK TABLES causes any pending transactions to be committed implicitly. To dump large tables, combine the `single-transaction` option with the `quick` option. 
-	Use the `extended-insert` multiple-row syntax that includes several VALUE lists. This results in a smaller dump file and speeds up inserts when the file is reloaded.
-  Use the `order-by-primary` option in mysqldump when dumping databases, so that the data is scripted in primary key order.
-	Use the `disable-keys` option in mysqldump when dumping data, to disable foreign key constraints before load. Disabling foreign key checks provides performance gains. Enable the constraints and verify the data after the load to ensure referential integrity.
-	Use partitioned tables when appropriate.
-	Load data in parallel. Avoid too much parallelism that would cause you to hit a resource limit, and monitor resources using the metrics available in the Azure portal. 
-	Use the `defer-table-indexes` option in mysqlpump when dumping databases, so that index creation happens after tables data is loaded.
-   Use the `skip-definer` option in mysqlpump to omit definer and SQL SECURITY clauses from the create statements for views and stored procedures.  When you reload the dump file, it creates objects that use the default DEFINER and SQL SECURITY values.
-   Copy the backup files to an Azure blob/store and perform the restore from there, which should be a lot faster than performing the restore across the Internet.

## Create a backup file from the command-line using mysqldump
To back up an existing MySQL database on the local on-premises server or in a virtual machine, run the following command: 
```bash
$ mysqldump --opt -u [uname] -p[pass] [dbname] > [backupfile.sql]
```

The parameters to provide are:
- [uname] Your database username 
- [pass] The password for your database (note there is no space between -p and the password) 
- [dbname] The name of your database 
- [backupfile.sql] The filename for your database backup 
- [--opt] The mysqldump option 

For example, to back up a database named 'testdb' on your MySQL server with the username 'testuser' and with no password to a file testdb_backup.sql, use the following command. The command backs up the `testdb` database into a file called `testdb_backup.sql`, which contains all the SQL statements needed to re-create the database. 

```bash
$ mysqldump -u root -p testdb > testdb_backup.sql
```
To select specific tables in your database to back up, list the table names separated by spaces. For example, to back up only table1 and table2 tables from the 'testdb', follow this example: 
```bash
$ mysqldump -u root -p testdb table1 table2 > testdb_tables_backup.sql
```
To back up more than one database at once, use the --database switch and list the database names separated by spaces. 
```bash
$ mysqldump -u root -p --databases testdb1 testdb3 testdb5 > testdb135_backup.sql 
```

## Create a database on the target Azure Database for MySQL server
Create an empty database on the target Azure Database for MySQL server where you want to migrate the data. Use a tool such as MySQL Workbench to create the database. The database can have the same name as the database that is contained the dumped data or you can create a database with a different name.

To get connected, locate the connection information in the **Overview** of your Azure Database for MySQL.

![Find the connection information in the Azure portal](./media/concepts-migrate-dump-restore/1_server-overview-name-login.png)

Add the connection information into your MySQL Workbench.

![MySQL Workbench Connection String](./media/concepts-migrate-dump-restore/2_setup-new-connection.png)

## Preparing the target Azure Database for MySQL server for fast data loads
To prepare the target Azure Database for MySQL server for faster data loads, the following server parameters and configuration needs to be changed.
- max_allowed_packet – set to 1073741824 (i.e. 1GB) to prevent any overflow issue due to long rows.
- slow_query_log – set to OFF to turn off the slow query log. This will eliminate the overhead caused by slow query logging during data loads.
- query_store_capture_mode – set both to NONE to turn off the Query Store. This will eliminate the overhead caused by sampling activities by Query Store.
- innodb_buffer_pool_size – Scale up the server to 32 vCore Memory Optimized SKU from the Pricing tier of the portal during migration to increase the innodb_buffer_pool_size. Innodb_buffer_pool_size can only be increased by scaling up compute for Azure Database for MySQL server.
- innodb_io_capacity & innodb_io_capacity_max - Change to 9000 from the Server parameters in Azure portal to improve the IO utilization to optimize for migration speed.
- innodb_write_io_threads & innodb_write_io_threads - Change to 4 from the Server parameters in Azure portal to improve the speed of migration.
- Scale up Storage tier – The IOPs for Azure Database for MySQL server increases progressively with the increase in storage tier. For faster loads, you may want to increase the storage tier to increase the IOPs provisioned. Please do remember the storage can only be scaled up, not down.

Once the migration is completed, you can revert back the server parameters and compute tier configuration to its previous values. 

## Restore your MySQL database using command-line or MySQL Workbench
Once you have created the target database, you can use the mysql command or MySQL Workbench to restore the data into the specific newly created database from the dump file.
```bash
mysql -h [hostname] -u [uname] -p[pass] [db_to_restore] < [backupfile.sql]
```
In this example, restore the data into the newly created database on the target Azure Database for MySQL server.
```bash
$ mysql -h mydemoserver.mysql.database.azure.com -u myadmin@mydemoserver -p testdb < testdb_backup.sql
```
## Export using PHPMyAdmin
To export, you can use the common tool phpMyAdmin, which you may already have installed locally in your environment. To export your MySQL database using PHPMyAdmin:
1. Open phpMyAdmin.
2. Select your database. Click the database name in the list on the left. 
3. Click the **Export** link. A new page appears to view the dump of database.
4. In the Export area, click the **Select All** link to choose the tables in your database. 
5. In the SQL options area, click the appropriate options. 
6. Click the **Save as file** option and the corresponding compression option and then click the **Go** button. A dialog box should appear prompting you to save the file locally.

## Import using PHPMyAdmin
Importing your database is similar to exporting. Do the following actions:
1. Open phpMyAdmin. 
2. In the phpMyAdmin setup page, click **Add** to add your Azure Database for MySQL server. Provide the connection details and login information.
3. Create an appropriately named database and select it on the left of the screen. To rewrite the existing database, click the database name, select all the check boxes beside the table names, and select **Drop** to delete the existing tables. 
4. Click the **SQL** link to show the page where you can type in SQL commands, or upload your SQL file. 
5. Use the **browse** button to find the database file. 
6. Click the **Go** button to export the backup, execute the SQL commands, and re-create your database.

## Known Issues
For known issues, tips and tricks, we recommend you to look at our [techcommunity blog](https://techcommunity.microsoft.com/t5/azure-database-for-mysql/tips-and-tricks-in-using-mysqldump-and-mysql-restore-to-azure/ba-p/916912).

## Next steps
- [Connect applications to Azure Database for MySQL](./howto-connection-string.md).
- For more information about migrating databases to Azure Database for MySQL, see the [Database Migration Guide](https://aka.ms/datamigration).

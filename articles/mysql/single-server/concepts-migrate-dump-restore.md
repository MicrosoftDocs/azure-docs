---
title: Migrate using dump and restore - Azure Database for MySQL
description: This article explains two common ways to back up and restore databases in your Azure Database for MySQL, using tools such as mysqldump, MySQL Workbench, and PHPMyAdmin.
ms.service: mysql
ms.subservice: single-server
ms.topic: conceptual
author: savjani
ms.author: pariks
ms.date: 06/20/2022
---

# Migrate your MySQL database to Azure Database for MySQL using dump and restore

[!INCLUDE[applies-to-mysql-single-flexible-server](../includes/applies-to-mysql-single-flexible-server.md)]

[!INCLUDE[azure-database-for-mysql-single-server-deprecation](../includes/azure-database-for-mysql-single-server-deprecation.md)]

This article explains two common ways to back up and restore databases in your Azure Database for MySQL
- Dump and restore from the command-line (using mysqldump)
- Dump and restore using PHPMyAdmin

You can also refer to [Database Migration Guide](https://github.com/Azure/azure-mysql/tree/master/MigrationGuide) for detailed information and use cases about migrating databases to Azure Database for MySQL. This guide provides guidance that will lead the successful planning and execution of a MySQL migration to Azure.

## Before you begin
To step through this how-to guide, you need to have:
- [Create Azure Database for MySQL server - Azure portal](quickstart-create-mysql-server-database-using-azure-portal.md)
- [mysqldump](https://dev.mysql.com/doc/refman/5.7/en/mysqldump.html) command-line utility installed on a machine.
- [MySQL Workbench](https://dev.mysql.com/downloads/workbench/) or another third-party MySQL tool to do dump and restore commands.

> [!TIP]
> If you are looking to migrate large databases with database sizes more than 1 TBs, you may want to consider using community tools like **mydumper/myloader** which supports parallel export and import. Learn [how to migrate large MySQL databases](https://techcommunity.microsoft.com/t5/azure-database-for-mysql/best-practices-for-migrating-large-databases-to-azure-database/ba-p/1362699).


## Common use-cases for dump and restore

Most common use-cases are:

- **Moving from other managed service provider** - Most managed service provider may not provide access to the physical storage file for security reasons so logical backup and restore is the only option to migrate.
- **Migrating from on-premises environment or Virtual machine** - Azure Database for MySQL doesn't support restore of physical backups, which makes logical backup and restore as the ONLY approach.
- **Moving your backup storage from locally redundant to geo-redundant storage** - Azure Database for MySQL allows configuring locally redundant or geo-redundant storage for backup is only allowed during server create. Once the server is provisioned, you can't change the backup storage redundancy option. In order to move your backup storage from locally redundant storage to geo-redundant storage, dump and restore is the ONLY option. 
-  **Migrating from alternative storage engines to InnoDB** - Azure Database for MySQL supports only InnoDB Storage engine, and therefore doesn't support alternative storage engines. If your tables are configured with other storage engines, convert them into the InnoDB engine format before migration to Azure Database for MySQL.

    For example, if you have a WordPress or WebApp using the MyISAM tables, first convert those tables by migrating into InnoDB format before restoring to Azure Database for MySQL. Use the clause `ENGINE=InnoDB` to set the engine used when creating a new table, then transfer the data into the compatible table before the restore.

   ```sql
   INSERT INTO innodb_table SELECT * FROM myisam_table ORDER BY primary_key_columns
   ```
> [!Important]
> - To avoid any compatibility issues, ensure the same version of MySQL is used on the source and destination systems when dumping databases. For example, if your existing MySQL server is version 5.7, then you should migrate to Azure Database for MySQL configured to run version 5.7. The `mysql_upgrade` command does not function in an Azure Database for MySQL server, and is not supported. 
> - If you need to upgrade across MySQL versions, first dump or export your lower version database into a higher version of MySQL in your own environment. Then run `mysql_upgrade`, before attempting migration into an Azure Database for MySQL.

## Performance considerations
To optimize performance, take notice of these considerations when dumping large databases:
-	Use the `exclude-triggers` option in mysqldump when dumping databases. Exclude triggers from dump files to avoid the trigger commands firing during the data restore.
-	Use the `single-transaction` option to set the transaction isolation mode to REPEATABLE READ and sends a START TRANSACTION SQL statement to the server before dumping data. Dumping many tables within a single transaction causes some extra storage to be consumed during restore. The `single-transaction` option and the `lock-tables` option are mutually exclusive because LOCK TABLES causes any pending transactions to be committed implicitly. To dump large tables, combine the `single-transaction` option with the `quick` option.
-	Use the `extended-insert` multiple-row syntax that includes several VALUE lists. This results in a smaller dump file and speeds up inserts when the file is reloaded.
-  Use the `order-by-primary` option in mysqldump when dumping databases, so that the data is scripted in primary key order.
-	Use the `disable-keys` option in mysqldump when dumping data, to disable foreign key constraints before load. Disabling foreign key checks provides performance gains. Enable the constraints and verify the data after the load to ensure referential integrity.
-	Use partitioned tables when appropriate.
-	Load data in parallel. Avoid too much parallelism that would cause you to hit a resource limit, and monitor resources using the metrics available in the Azure portal.
-	Use the `defer-table-indexes` option in mysqldump when dumping databases, so that index creation happens after tables data is loaded.
-   Copy the backup files to an Azure blob/store and perform the restore from there, which should be a lot faster than performing the restore across the Internet.

## Create a database on the target Azure Database for MySQL server
Create an empty database on the target Azure Database for MySQL server where you want to migrate the data. Use a tool such as MySQL Workbench  or mysql.exe to create the database. The database can have the same name as the database that is contained the dumped data or you can create a database with a different name.

To get connected, locate the connection information in the **Overview** of your Azure Database for MySQL.

:::image type="content" source="./media/concepts-migrate-dump-restore/1-server-overview-name-login.png" alt-text="Find the connection information in the Azure portal":::

Add the connection information into your MySQL Workbench.

:::image type="content" source="./media/concepts-migrate-dump-restore/2-setup-new-connection.png" alt-text="MySQL Workbench Connection String":::

## Preparing the target Azure Database for MySQL server for fast data loads
To prepare the target Azure Database for MySQL server for faster data loads, the following server parameters and configuration needs to be changed.
- max_allowed_packet – set to 1073741824 (that is, 1 GB) to prevent any overflow issue due to long rows.
- slow_query_log – set to OFF to turn off the slow query log. This will eliminate the overhead caused by slow query logging during data loads.
- query_store_capture_mode – set to NONE to turn off the Query Store. This will eliminate the overhead caused by sampling activities by Query Store.
- innodb_buffer_pool_size – Scale up the server to 32 vCore Memory Optimized SKU from the Pricing tier of the portal during migration to increase the innodb_buffer_pool_size. Innodb_buffer_pool_size can only be increased by scaling up compute for Azure Database for MySQL server.
- innodb_io_capacity & innodb_io_capacity_max - Change to 9000 from the Server parameters in Azure portal to improve the IO utilization to optimize for migration speed.
- innodb_write_io_threads & innodb_write_io_threads - Change to 4 from the Server parameters in Azure portal to improve the speed of migration.
- Scale up Storage tier – The IOPs for Azure Database for MySQL server increases progressively with the increase in storage tier. For faster loads, you may want to increase the storage tier to increase the IOPs provisioned. Do remember the storage can only be scaled up, not down.

Once the migration is completed, you can revert back the server parameters and compute tier configuration to its previous values.

## Dump and restore using mysqldump utility

### Create a backup file from the command-line using mysqldump
To back up an existing MySQL database on the local on-premises server or in a virtual machine, run the following command:
```bash
$ mysqldump --opt -u [uname] -p[pass] [dbname] > [backupfile.sql]
```

The parameters to provide are:
- [uname] Your database username
- [pass] The password for your database (note there's no space between -p and the password)
- [dbname] The name of your database
- [backupfile.sql] The filename for your database backup
- [--opt] The mysqldump option

For example, to back up a database named 'testdb' on your MySQL server with the username 'testuser' and with no password to a file testdb_backup.sql, use the following command. The command backs up the `testdb` database into a file called `testdb_backup.sql`, which contains all the SQL statements needed to re-create the database. Make sure that the username 'testuser' has at least the SELECT privilege for dumped tables, SHOW VIEW for dumped views, TRIGGER for dumped triggers, and LOCK TABLES if the `--single-transaction` option isn't used.

```bash
GRANT SELECT, LOCK TABLES, SHOW VIEW ON *.* TO 'testuser'@'hostname' IDENTIFIED BY 'password';
```
Now run mysqldump to create the backup of `testdb` database

```bash
$ mysqldump -u root -p testdb > testdb_backup.sql
```
To select specific tables in your database to back up, list the table names separated by spaces. For example, to back up only table1 and table2 tables from the 'testdb', follow this example:

```bash
$ mysqldump -u root -p testdb table1 table2 > testdb_tables_backup.sql
```
To back up more than one database at once, use the `--database` switch and list the database names separated by spaces.
```bash
$ mysqldump -u root -p --databases testdb1 testdb3 testdb5 > testdb135_backup.sql
```

### Restore your MySQL database using command-line 
Once you've created the target database, you can use the mysql command  to restore the data into the specific newly created database from the dump file.
```bash
mysql -h [hostname] -u [uname] -p[pass] [db_to_restore] < [backupfile.sql]
```
In this example, restore the data into the newly created database on the target Azure Database for MySQL server.

Here's an example for how to use this **mysql** for **Single Server** :

```bash
$ mysql -h mydemoserver.mysql.database.azure.com -u myadmin@mydemoserver -p testdb < testdb_backup.sql
```
Here's an example for how to use this **mysql** for **Flexible Server** :

```bash
$ mysql -h mydemoserver.mysql.database.azure.com -u myadmin -p testdb < testdb_backup.sql
```
---

>[!NOTE]
>You can also use [MySQL Workbench client utility to restore MySQL database](./concepts-migrate-import-export.md#import-and-export-data-by-using-mysql-workbench).
## Dump and restore using PHPMyAdmin
Follow these steps to dump and restore a database using PHPMyadmin.

> [!NOTE]
> For single server, the username must be in this format , 'username@servername' but for flexible server you can just use 'username' If you use 'username@servername' for flexible server, the connection will fail.

### Export with PHPMyadmin
To export, you can use the common tool phpMyAdmin, which you may already have installed locally in your environment. To export your MySQL database using PHPMyAdmin:
1. Open phpMyAdmin.
2. Select your database. Select the database name in the list on the left.
3. Select the **Export** link. A new page appears to view the dump of database.
4. In the Export area, select the **Select All** link to choose the tables in your database.
5. In the SQL options area, select the appropriate options.
6. Select the **Save as file** option and the corresponding compression option and then select the **Go** button. A dialog box should appear prompting you to save the file locally.

### Import using PHPMyAdmin
Importing your database is similar to exporting. Do the following actions:
1. Open phpMyAdmin.
2. In the phpMyAdmin setup page, select **Add** to add your Azure Database for MySQL server. Provide the connection details and log in information.
3. Create an appropriately named database and select it on the left of the screen. To rewrite the existing database, select the database name, select all the check boxes beside the table names, and select **Drop** to delete the existing tables.
4. Select the **SQL** link to show the page where you can type in SQL commands, or upload your SQL file.
5. Use the **browse** button to find the database file.
6. Select the **Go** button to export the backup, execute the SQL commands, and re-create your database.

## Known Issues
For known issues, tips and tricks, we recommend you to look at our [techcommunity blog](https://techcommunity.microsoft.com/t5/azure-database-for-mysql/tips-and-tricks-in-using-mysqldump-and-mysql-restore-to-azure/ba-p/916912).

## Next steps
- [Connect applications to Azure Database for MySQL](./how-to-connection-string.md).
- For more information about migrating databases to Azure Database for MySQL, see the [Database Migration Guide](https://github.com/Azure/azure-mysql/tree/master/MigrationGuide).
- If you're looking to migrate large databases with database sizes more than 1 TBs, you may want to consider using community tools like **mydumper/myloader** which supports parallel export and import. Learn [how to migrate large MySQL databases](https://techcommunity.microsoft.com/t5/azure-database-for-mysql/best-practices-for-migrating-large-databases-to-azure-database/ba-p/1362699).

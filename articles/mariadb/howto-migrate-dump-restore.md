---
title: Migrate with dump and restore - Azure Database for MariaDB
description: This article explains two common ways to back up and restore databases in your Azure database for MariaDB by using tools such as mysqldump, MySQL Workbench, and phpMyAdmin.
ms.service: mariadb
author: SudheeshGH
ms.author: sunaray
ms.subservice: migration-guide
ms.custom: devx-track-linux
ms.topic: how-to
ms.date: 04/19/2023
---

# Migrate your MariaDB database to an Azure database for MariaDB by using dump and restore

[!INCLUDE [azure-database-for-mariadb-deprecation](includes/azure-database-for-mariadb-deprecation.md)]

This article explains two common ways to back up and restore databases in your Azure database for MariaDB:

- Dump and restore by using a command-line tool (using mysqldump).
- Dump and restore using phpMyAdmin.

## Prerequisites

Before you begin migrating your database, do the following:

- Create an [Azure Database for MariaDB server - Azure portal](quickstart-create-mariadb-server-database-using-azure-portal.md).
- Install the [mysqldump](https://mariadb.com/kb/en/library/mysqldump/) command-line utility.
- Download and install [MySQL Workbench](https://dev.mysql.com/downloads/workbench/) or another third-party MySQL tool for running dump and restore commands.

## Use common tools

Use common utilities and tools such as MySQL Workbench or mysqldump to remotely connect and restore data into your Azure database for MariaDB. Use these tools on your client machine with an internet connection to connect to the Azure database for MariaDB. Use an SSL-encrypted connection as a best security practice. For more information, see [Configure SSL connectivity in Azure Database for MariaDB](concepts-ssl-connection-security.md). You don't need to move the dump files to any special cloud location when you migrate data to your Azure database for MariaDB.

## Common uses for dump and restore

You can use MySQL utilities such as mysqldump and mysqlpump to dump and load databases into an Azure database for MariaDB server in several common scenarios.

- Use database dumps when you're migrating an entire database. This recommendation holds when you're moving a large amount of data, or when you want to minimize service interruption for live sites or applications.
- Make sure that all tables in the database use the InnoDB storage engine when you're loading data into your Azure database for MariaDB. Azure Database for MariaDB supports only the InnoDB storage engine, and no other storage engines. If your tables are configured with other storage engines, convert them into the InnoDB engine format before you migrate them to your Azure database for MariaDB.

   For example, if you have a WordPress app or a web app that uses MyISAM tables, first convert those tables by migrating them into InnoDB format before you restore them to your Azure database for MariaDB. Use the clause `ENGINE=InnoDB` to set the engine to use for creating a new table, and then transfer the data into the compatible table before you restore it.

   ```sql
   INSERT INTO innodb_table SELECT * FROM myisam_table ORDER BY primary_key_columns
   ```

- To avoid any compatibility issues when you're dumping databases, ensure that you're using the same version of MariaDB on the source and destination systems. For example, if your existing MariaDB server is version 10.2, you should migrate to your Azure database for MariaDB that's configured to run version 10.2. The `mysql_upgrade` command doesn't function in an Azure Database for MariaDB server, and it isn't supported. If you need to upgrade across MariaDB versions, first dump or export your earlier-version database into a later version of MariaDB in your own environment. You can then run `mysql_upgrade` before you try migrating into your Azure database for MariaDB.

## Performance considerations

To optimize performance when you're dumping large databases, keep in mind the following considerations:

- Use the `exclude-triggers` option in mysqldump. Exclude triggers from dump files to avoid having the trigger commands fire during the data restore. 
- Use the `single-transaction` option to set the transaction isolation mode to REPEATABLE READ and send a START TRANSACTION SQL statement to the server before dumping data. Dumping many tables within a single transaction causes some extra storage to be consumed during the restore. The `single-transaction` option and the `lock-tables` option are mutually exclusive. This is because LOCK TABLES causes any pending transactions to be committed implicitly. To dump large tables, combine the `single-transaction` option with the `quick` option. 
- Use the `extended-insert` multiple-row syntax that includes several VALUE lists. This approach results in a smaller dump file and speeds up inserts when the file is reloaded.
- Use the `order-by-primary` option in mysqldump when you're dumping databases, so that the data is scripted in primary key order.
- Use the `disable-keys` option in mysqldump when you're dumping data, to disable foreign key constraints before the load. Disabling foreign key checks helps improve performance. Enable the constraints and verify the data after the load to ensure referential integrity.
- Use partitioned tables when appropriate.
- Load data in parallel. Avoid too much parallelism, which could cause you to hit a resource limit, and monitor resources by using the metrics available in the Azure portal. 
- Use the `defer-table-indexes` option in mysqlpump when you're dumping databases, so that index creation happens after table data is loaded.
- Copy the backup files to an Azure blob store and perform the restore from there. This approach should be a lot faster than performing the restore across the internet.

## Create a backup file

To back up an existing MariaDB database on the local on-premises server or in a virtual machine, run the following command by using mysqldump:

```bash
mysqldump --opt -u <uname> -p<pass> <dbname> > <backupfile.sql>
```

The parameters to provide are:

- *\<uname>*: Your database user name 
- *\<pass>*: The password for your database (note that there is no space between -p and the password) 
- *\<dbname>*: The name of your database 
- *\<backupfile.sql>*: The file name for your database backup 
- *\<--opt>*: The mysqldump option

For example, to back up a database named *testdb* on your MariaDB server with the user name *testuser* and with no password to a file testdb_backup.sql, use the following command. The command backs up the `testdb` database into a file called `testdb_backup.sql`, which contains all the SQL statements needed to re-create the database.

```bash
mysqldump -u root -p testdb > testdb_backup.sql
```

To select specific tables to back up in your database, list the table names, separated by spaces. For example, to back up only table1 and table2 tables from the *testdb*, follow this example:

```bash
mysqldump -u root -p testdb table1 table2 > testdb_tables_backup.sql
```

To back up more than one database at once, use the --database switch and list the database names, separated by spaces.

```bash
mysqldump -u root -p --databases testdb1 testdb3 testdb5 > testdb135_backup.sql 
```

## Create a database on the target server

Create an empty database on the target Azure Database for MariaDB server where you want to migrate the data. Use a tool such as MySQL Workbench to create the database. The database can have the same name as the database that contains the dumped data, or you can create a database with a different name.

To get connected, locate the connection information on the **Overview** pane of your Azure database for MariaDB.

![Screenshot of the Overview pane for an Azure database for MariaDB server in the Azure portal.](./media/howto-migrate-dump-restore/1_server-overview-name-login.png)

In MySQL Workbench, add the connection information.

![Screenshot of the MySQL Connections pane in MySQL Workbench.](./media/howto-migrate-dump-restore/2_setup-new-connection.png)

## Restore your MariaDB database

After you've created the target database, you can use the mysql command or MySQL Workbench to restore the data into the newly created database from the dump file.

```bash
mysql -h <hostname> -u <uname> -p<pass> <db_to_restore> < <backupfile.sql>
```

In this example, you restore the data into the newly created database on the target Azure Database for MariaDB server.

```bash
mysql -h mydemoserver.mariadb.database.azure.com -u myadmin@mydemoserver -p testdb < testdb_backup.sql
```

## Export your MariaDB database by using phpMyAdmin

To export, you can use the common tool phpMyAdmin, which might already be installed locally in your environment. To export your MariaDB database, do the following:

1. Open phpMyAdmin.
1. On the left pane, select your database, and then select the **Export** link. A new page appears to view the dump of database.
1. In the **Export** area, select the **Select All** link to choose the tables in your database.
1. In the **SQL options** area, select the appropriate options.
1. Select the **Save as file** option and the corresponding compression option, and then select **Go**. At the prompt, save the file locally.

## Import your database by using phpMyAdmin

The importing process is similar to the exporting process. Do the following:

1. Open phpMyAdmin.
1. On the phpMyAdmin setup page, select **Add** to add your Azure Database for MariaDB server.
1. Enter the connection details and login information.
1. Create an appropriately named database, and then select it on the left pane. To rewrite the existing database, select the database name, select all the check boxes beside the table names, and select **Drop** to delete the existing tables.
1. Select the **SQL** link to show the page where you can enter SQL commands or upload your SQL file.
1. Select the **browse** button to find the database file.
1. Select the **Go** button to export the backup, execute the SQL commands, and re-create your database.

## Next steps

- [Connect applications to your Azure database for MariaDB](./howto-connection-string.md).

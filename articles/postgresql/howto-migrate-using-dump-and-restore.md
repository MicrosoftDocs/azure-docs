---
title: How To Dump and Restore in Azure Database for PostgreSQL - Single Server
description: Describes how to extract a PostgreSQL database into a dump file and restore from a file created by pg_dump in Azure Database for PostgreSQL - Single Server.
author: rachel-msft
ms.author: raagyema
ms.service: postgresql
ms.topic: conceptual
ms.date: 5/6/2019
---
# Migrate your PostgreSQL database using dump and restore
You can use [pg_dump](https://www.postgresql.org/docs/9.3/static/app-pgdump.html) to extract a PostgreSQL database into a dump file and [pg_restore](https://www.postgresql.org/docs/9.3/static/app-pgrestore.html) to restore the PostgreSQL database from an archive file created by pg_dump.

## Prerequisites
To step through this how-to guide, you need:
- An [Azure Database for PostgreSQL server](quickstart-create-server-database-portal.md) with firewall rules to allow access and database under it.
- [pg_dump](https://www.postgresql.org/docs/9.6/static/app-pgdump.html) and [pg_restore](https://www.postgresql.org/docs/9.6/static/app-pgrestore.html) command-line utilities installed

Follow these steps to dump and restore your PostgreSQL database:

## Create a dump file using pg_dump that contains the data to be loaded
To back up an existing PostgreSQL database on-premises or in a VM, run the following command:
```bash
pg_dump -Fc -v --host=<host> --username=<name> --dbname=<database name> > <database>.dump
```
For example, if you have a local server and a database called **testdb** in it
```bash
pg_dump -Fc -v --host=localhost --username=masterlogin --dbname=testdb > testdb.dump
```


## Restore the data into the target Azure Database for PostrgeSQL using pg_restore
After you've created the target database, you can use the pg_restore command and the -d, --dbname parameter to restore the data into the target database from the dump file.
```bash
pg_restore -v --no-owner –-host=<server name> --port=<port> --username=<user@servername> --dbname=<target database name> <database>.dump
```
Including the --no-owner parameter causes all objects created during the restore to be owned by the user specified with --username. For more information, see the official PostgreSQL documentation on [pg_restore](https://www.postgresql.org/docs/9.6/static/app-pgrestore.html).

> [!NOTE]
> If your PostgreSQL server requires SSL connections (on by default in Azure Database for PostgreSQL servers), set an environment variable `PGSSLMODE=require` so that the pg_restore tool connects with SSL. Without SSL, the error may read  `FATAL:  SSL connection is required. Please specify SSL options and retry.`
>
> In the Windows command line, run the command `SET PGSSLMODE=require` before running the pg_restore command. In Linux or Bash run the command `export PGSSLMODE=require` before running the pg_restore command.
>

In this example, restore the data from the dump file **testdb.dump** into the database **mypgsqldb** on target server **mydemoserver.postgres.database.azure.com**. 
```bash
pg_restore -v --no-owner --host=mydemoserver.postgres.database.azure.com --port=5432 --username=mylogin@mydemoserver --dbname=mypgsqldb testdb.dump
```

## Optimizing the migration process

One way to migrate your existing PostgreSQL database to Azure Database for PostgreSQL service is to back up the database on the source and restore it in Azure. To minimize the time required to complete the migration, consider using the following parameters with the backup and restore commands.

> [!NOTE]
> For detailed syntax information, see the articles [pg_dump](https://www.postgresql.org/docs/9.6/static/app-pgdump.html) and [pg_restore](https://www.postgresql.org/docs/9.6/static/app-pgrestore.html).
>

### For the backup
- Take the backup with the -Fc switch so that you can perform the restore in parallel to speed it up. For example:

    ```
    pg_dump -h MySourceServerName -U MySourceUserName -Fc -d MySourceDatabaseName > Z:\Data\Backups\MyDatabaseBackup.dump
    ```

### For the restore
- We suggest that you move the backup file to an Azure VM in the same region as the Azure Database for PostgreSQL server you are migrating to, and do the pg_restore from that VM to reduce network latency. We also recommend that the VM is created with [accelerated networking](../virtual-network/create-vm-accelerated-networking-powershell.md) enabled.

- It should be already done by default, but open the dump file to verify that the create index statements are after the insert of the data. If it isn't the case, move the create index statements after the data is inserted.

- Restore with the switches -Fc and -j *#* to parallelize the restore. *#* is the number of cores on the target server. You can also try with *#* set to twice the number of cores of the target server to see the impact. For example:

    ```
    pg_restore -h MyTargetServer.postgres.database.azure.com -U MyAzurePostgreSQLUserName -Fc -j 4 -d MyTargetDatabase Z:\Data\Backups\MyDatabaseBackup.dump
    ```

- You can also edit the dump file by adding the command *set synchronous_commit = off;* at the beginning and the command *set synchronous_commit = on;* at the end. Not turning it on at the end, before the apps change the data, may result in subsequent loss of data.

- On the target Azure Database for PostgreSQL server, consider doing the following before the restore:
    - Turn off query performance tracking, since these statistics are not needed during the migration. You can do this by setting pg_stat_statements.track, pg_qs.query_capture_mode, and pgms_wait_sampling.query_capture_mode to NONE.

    - Use a high compute and high memory sku, like 32 vCore Memory Optimized, to speed up the migration. You can easily scale back down to your preferred sku after the restore is complete. The higher the sku, the more parallelism you can achieve by increasing the corresponding `-j` parameter in the pg_restore command. 

    - More IOPS on the target server could improve the restore performance. You can provision more IOPS by increasing the server's storage size. This setting is not reversible, but consider whether a higher IOPS would benefit your actual workload in the future.

Remember to test and validate these commands in a test environment before you use them in production.

## Next steps
- To migrate a PostgreSQL database using export and import, see [Migrate your PostgreSQL database using export and import](howto-migrate-using-export-and-import.md).
- For more information about migrating databases to Azure Database for PostgreSQL, see the [Database Migration Guide](https://aka.ms/datamigration).

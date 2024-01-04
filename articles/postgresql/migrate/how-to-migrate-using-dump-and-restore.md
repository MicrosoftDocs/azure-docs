---
title: Dump and restore - Azure Database for PostgreSQL - Single Server
description: You can extract a PostgreSQL database into a dump file. Then, you can restore from a file created by pg_dump in Azure Database for PostgreSQL Single Server.
ms.service: postgresql
ms.subservice: migration-guide
ms.topic: how-to
ms.author: alkuchar
author: AlicjaKucharczyk
ms.date: 01/04/2024
---

# Migrate your PostgreSQL database by using dump and restore

[!INCLUDE[applies-to-postgres-single-flexible-server](../includes/applies-to-postgresql-single-flexible-server.md)]

You can use [pg_dump](https://www.postgresql.org/docs/current/static/app-pgdump.html) to extract a PostgreSQL database into a dump file. Then use [pg_restore](https://www.postgresql.org/docs/current/static/app-pgrestore.html) to restore the PostgreSQL database from an archive file created by `pg_dump`.

The Azure portal streamlines this process via the Connect blade by offering pre-configured commands that are tailored to your server, with values substituted with your user data. It's important to note that the Connect blade is only available for Azure Database for PostgreSQL - Flexible Server and not for Single Server. Here's how you can leverage this feature:

1. **Access Azure portal**: First, go to the Azure portal and choose the Connect blade.

   :::image type="content" source="./media/how-to-migrate-using-dump-and-restore/portal-connect-blade.png" alt-text="Screenshot showing the placement of Connect blade in Azure portal." lightbox="./media/how-to-migrate-using-dump-and-restore/portal-connect-blade.png":::

2. **Select your database**: In the Connect blade, you will find a dropdown list of your databases. Select the database you wish to perform a dump from.

   :::image type="content" source="./media/how-to-migrate-using-dump-and-restore/dropdown-list-of-databases.png" alt-text="Screenshot showing the dropdown where specific database can be chosen." lightbox="./media/how-to-migrate-using-dump-and-restore/dropdown-list-of-databases.png":::

3. **Choose the appropriate method**: Depending on your database size, you can choose between two methods:
      - **`pg_dump` & `psql` - using singular text file**: Ideal for smaller databases, this option utilizes a single text file for the dump and restore process.
      - **`pg_dump` & `pg_restore` - using multiple cores**: For larger databases, this method is more efficient as it leverages multiple cores to handle the dump and restore process.

   :::image type="content" source="./media/how-to-migrate-using-dump-and-restore/different-dump-methods.png" alt-text="Screenshot showing two possible dump methods." lightbox="./media/how-to-migrate-using-dump-and-restore/different-dump-methods.png":::

4. **Copy and paste commands**: The portal provides you with ready-to-use `pg_dump` and `psql` or `pg_restore` commands. These commands come with values already substituted according to the server and database you've chosen. Simply copy and paste these commands.

## Prerequisites
If you are using a Single Server, or do not have access to the Flexible Server portal, please read through this documentation page. It contains information that is similar to what is presented in the Connect blade for Flexible Server on the portal. 

To step through this how-to guide, you need:
- An [Azure Database for PostgreSQL server](../single-server/quickstart-create-server-database-portal.md), including firewall rules to allow access.
- [pg_dump](https://www.postgresql.org/docs/current/static/app-pgdump.html), `psql` and [pg_restore](https://www.postgresql.org/docs/current/static/app-pgrestore.html) command-line utilities installed.
- **Decide on the location for the dump**: Choose the place you want to perform the dump from. It can be done from various locations, such as a separate VM, [cloud shell](../../cloud-shell/overview.md) (where the tools mentioned above are already installed, but might not be in the appropriate version, so always check the version using, for instance, `psql --version`), or your own laptop. Always keep in mind the distance and latency between the PostgreSQL server and the location from which you are running the dump or restore.

> [!IMPORTANT]  
> It is essential to use the `pg_dump`, `psql` and `pg_restore` utilities that are either of the same major version or a higher major version than the database server you are exporting data from or importing data to. Failing to do so may result in unsuccessful data migration. If your target server has a higher major version than the source server, use utilities that are either the same major version or higher than the target server. 


> [!NOTE]
> It's important to be aware that `pg_dump` can export only one database at a time. This limitation applies regardless of the method you have chosen, whether it's using a singular file or multiple cores.

## Create a dump file that contains the data to be loaded
To export your existing PostgreSQL database on-premises or in a VM to a sql script file, run the following command in your existing environment:

#### [pg_dump & psql - using singular text file](#tab/psql)
```bash
pg_dump <database name> -h <server name> -U <user name> > <database name>_dump.sql
```

For example, if you have a server named `mydemoserver`, a user named `myuser` and a database called `testdb`, run the following command:
```bash
pg_dump testdb -h mydemoserver.postgres.database.azure.com -U myuser > testdb_dump.sql
```


#### [pg_dump & pg_restore - using multiple cores](#tab/pgrestore)
```bash
pg_dump -Fd -j <number of cores> <database name> -h <server name> -U <user name> -f <database name>.dump
```

In these commands, the `-j` option stands for the number of cores you wish to use for the dump process. You can adjust this number based on how many cores are available on your PostgreSQL server and how many you would like to allocate for the dump process. Feel free to change this setting depending on your server's capacity and your performance requirements.

For example, if you have a server named `mydemoserver`, a user named `myuser` and a database called `testdb`, and you want to use two cores for the dump, run the following command:
```bash
pg_dump -Fd -j 2 testdb -h mydemoserver.postgres.database.azure.com -U myuser -f testdb.dump
```

---

If you are using a Single Server, your username will include the server name component. Therefore, instead of `myuser`, use `myuser@mydemoserver`.


## Restore the data into the target database

After you've created the target database, you can use the `pg_restore` command and the  `--dbname` parameter to restore the data into the target database from the dump file.

```bash
pg_restore -v --no-owner --host=<server name> --port=<port> --username=<user-name> --dbname=<target database name> <database>.dump
```

Including the `--no-owner` parameter causes all objects created during the restore to be owned by the user specified with `--username`. For more information, see the [PostgreSQL documentation](https://www.postgresql.org/docs/9.6/static/app-pgrestore.html).

> [!NOTE]
> On Azure Database for PostgreSQL servers, TLS/SSL connections are on by default. If your PostgreSQL server requires TLS/SSL connections, but doesn't have them, set an environment variable `PGSSLMODE=require` so that the pg_restore tool connects with TLS. Without TLS, the error might read: "FATAL: SSL connection is required. Please specify SSL options and retry." In the Windows command line, run the command `SET PGSSLMODE=require` before running the `pg_restore` command. In Linux or Bash, run the command `export PGSSLMODE=require` before running the `pg_restore` command. 
>

In this example, restore the data from the dump file **testdb.dump** into the database **mypgsqldb**, on target server **mydemoserver.postgres.database.azure.com**.

Here's an example for how to use this `pg_restore` for Single Server:

```bash
pg_restore -v --no-owner --host=mydemoserver.postgres.database.azure.com --port=5432 --username=mylogin@mydemoserver --dbname=mypgsqldb testdb.dump
```

Here's an example for how to use this `pg_restore` for Flexible Server:

```bash
pg_restore -v --no-owner --host=mydemoserver.postgres.database.azure.com --port=5432 --username=mylogin --dbname=mypgsqldb testdb.dump
```

## Optimize the migration process

One way to migrate your existing PostgreSQL database to Azure Database for PostgreSQL is to back up the database on the source and restore it in Azure. To minimize the time required to complete the migration, consider using the following parameters with the backup and restore commands.

> [!NOTE]
> For detailed syntax information, see [pg_dump](https://www.postgresql.org/docs/current/static/app-pgdump.html) and [pg_restore](https://www.postgresql.org/docs/current/static/app-pgrestore.html).
>

### For the backup

Take the backup with the `-Fc` switch, so that you can perform the restore in parallel to speed it up. For example:

```bash
pg_dump -h my-source-server-name -U source-server-username -Fc -d source-databasename -f Z:\Data\Backups\my-database-backup.dump
```

### For the restore

- Move the backup file to an Azure VM in the same region as the Azure Database for PostgreSQL server you are migrating to. Perform the `pg_restore` from that VM to reduce network latency. Create the VM with [accelerated networking](../../virtual-network/create-vm-accelerated-networking-powershell.md) enabled.

- Open the dump file to verify that the create index statements are after the insert of the data. If it isn't the case, move the create index statements after the data is inserted. This should already be done by default, but it's a good idea to confirm.

- Restore with the `-j N` switch (where `N` represents the number) to parallelize the restore. The number you specify is the number of cores on the target server. You can also set to twice the number of cores of the target server to see the impact.

    Here's an example for how to use this `pg_restore` for Single Server:

    ```bash
     pg_restore -h my-target-server.postgres.database.azure.com -U azure-postgres-username@my-target-server -j 4 -d my-target-databasename Z:\Data\Backups\my-database-backup.dump
    ```

    Here's an example for how to use this `pg_restore` for Flexible Server:

    ```bash
     pg_restore -h my-target-server.postgres.database.azure.com -U azure-postgres-username -j 4 -d my-target-databasename Z:\Data\Backups\my-database-backup.dump
    ```

- You can also edit the dump file by adding the command `set synchronous_commit = off;` at the beginning, and the command `set synchronous_commit = on;` at the end. Not turning it on at the end, before the apps change the data, might result in subsequent loss of data.

- On the target Azure Database for PostgreSQL server, consider doing the following before the restore:
    
  - Turn off query performance tracking. These statistics aren't needed during the migration. You can do this by setting `pg_stat_statements.track`, `pg_qs.query_capture_mode`, and `pgms_wait_sampling.query_capture_mode` to `NONE`.

  - Use a high compute and high memory SKU, like 32 vCore Memory Optimized, to speed up the migration. You can easily scale back down to your preferred SKU after the restore is complete. The higher the SKU, the more parallelism you can achieve by increasing the corresponding `-j` parameter in the `pg_restore` command.

  - More IOPS on the target server might improve the restore performance. You can provision more IOPS by increasing the server's storage size. This setting isn't reversible, but consider whether a higher IOPS would benefit your actual workload in the future.

Remember to test and validate these commands in a test environment before you use them in production.

## Next steps

- To migrate a PostgreSQL database by using export and import, see [Migrate your PostgreSQL database using export and import](how-to-migrate-using-export-and-import.md).
- For more information about migrating databases to Azure Database for PostgreSQL, see the [Database Migration Guide](/data-migration/).

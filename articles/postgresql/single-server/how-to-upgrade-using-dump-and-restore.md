---
title: Upgrade using dump and restore - Azure Database for PostgreSQL
description: Describes offline upgrade methods using dump and restore databases to migrate to a higher version Azure Database for PostgreSQL.
ms.service: postgresql
ms.subservice: single-server
ms.topic: how-to
ms.author: alkuchar
author: AwdotiaRomanowna
ms.date: 06/24/2022
---

# Upgrade your PostgreSQL database using dump and restore

[!INCLUDE [applies-to-postgresql-single-server](../includes/applies-to-postgresql-single-server.md)]

[!INCLUDE [azure-database-for-postgresql-single-server-deprecation](../includes/azure-database-for-postgresql-single-server-deprecation.md)]

>[!NOTE]
> The concepts explained in this documentation are applicable to both Azure Database for PostgreSQL - Single Server and Azure Database for PostgreSQL - Flexible Server.

You can upgrade your PostgreSQL server deployed in Azure Database for PostgreSQL by migrating your databases to a higher major version server using following methods.
* **Offline** method using PostgreSQL [pg_dump](https://www.postgresql.org/docs/current/static/app-pgdump.html) and [pg_restore](https://www.postgresql.org/docs/current/static/app-pgrestore.html) which incurs downtime for migrating the data. This document addresses this method of upgrade/migration.
* **Online** method using [Database Migration Service](../../dms/tutorial-azure-postgresql-to-azure-postgresql-online-portal.md) (DMS). This method provides a reduced downtime migration and keeps the target database in-sync with the source and you can choose when to cut-over. However, there are few prerequisites and restrictions to be addressed for using DMS. For details, see the [DMS documentation](../../dms/tutorial-azure-postgresql-to-azure-postgresql-online-portal.md).

The following table provides some recommendations based on database sizes and scenarios.

| **Database/Scenario** | **Dump/restore (Offline)** | **DMS (Online)** |
| ------ | :------: | :-----: |
| You have a small database and can afford downtime to upgrade  | X | |
| Small databases (< 10 GB)	 | X | X | 
| Small-medium DBs (10 GB – 100 GB)	| X | X |
| Large databases (> 100 GB) |	| X |
| Can afford downtime to upgrade (irrespective of the database size) | X |  |
| Can address DMS [pre-requisites](../../dms/tutorial-azure-postgresql-to-azure-postgresql-online-portal.md#prerequisites), including a reboot? |  | X |
| Can avoid DDLs and unlogged tables during the upgrade process? | |  X |

This guide provides few offline migration methodologies and examples to show how you can migrate from your source server to the target server that runs a higher version of PostgreSQL.

> [!NOTE]
> PostgreSQL dump and restore can be performed in many ways. You may choose to migrate using one of the methods provided in this guide or choose any alternate ways to suit your needs. For detailed dump and restore syntax with additional parameters, see the articles [pg_dump](https://www.postgresql.org/docs/current/static/app-pgdump.html) and [pg_restore](https://www.postgresql.org/docs/current/static/app-pgrestore.html).

## Prerequisites for using dump and restore with Azure Database for PostgreSQL

To step through this how-to-guide, you need:

- A **source** PostgreSQL database server running a lower version of the engine that you want to upgrade.
- A **target** PostgreSQL database server with the desired major version [Azure Database for PostgreSQL server - Single Server](quickstart-create-server-database-portal.md) or [Azure Database for PostgreSQL - Flexible Server](../flexible-server/quickstart-create-server-portal.md). 
- A PostgreSQL client system to run the dump and restore commands. It's recommended to use the higher database version. For example, if you're upgrading from PostgreSQL version 9.6 to 11, please use PostgreSQL version 11 client. 
  - It can be a Linux or Windows client that has PostgreSQL installed and that has the [pg_dump](https://www.postgresql.org/docs/current/static/app-pgdump.html) and [pg_restore](https://www.postgresql.org/docs/current/static/app-pgrestore.html) command-line utilities installed. 
  - Alternatively, you can use [Azure Cloud Shell](https://shell.azure.com) or by selecting the Azure Cloud Shell on the menu bar at the upper right in the [Azure portal](https://portal.azure.com). You will have to login to your account `az login` before running the dump and restore commands.
- Your PostgreSQL client preferably running in the same region as the source and target servers.

## Additional details and considerations

- You can find the connection string to the source and target databases by selecting the “Connection Strings” from the portal. 
- You may be running more than one database in your server. You can find the list of databases by connecting to your source server and running `\l`.
- Create corresponding databases in the target database server or add `-C` option to the `pg_dump` command which creates the databases.
- You must not upgrade `azure_maintenance` or template databases. If you have made any changes to template databases, you may choose to migrate the changes or make those changes in the target database.
- Refer to the tables above to determine the database is suitable for this mode of migration.
- If you want to use Azure Cloud Shell, please note that the session times out after 20 minutes. If your database size is < 10 GB, you may be able to complete the upgrade without the session timing out. Otherwise, you may have to keep the session open by other means, such as pressing any key once in 10-15 minutes.

## Example database used in this guide

In this guide, the following source and target servers and database names are used to illustrate with examples.

| **Description** | **Value** |
| ------- | ------- |
| Source server (v9.5) | pg-95.postgres.database.azure.com |
| Source database | bench5gb |
| Source database size | 5 GB |
| Source user name | pg@pg-95 |
| Target server (v11) | pg-11.postgres.database.azure.com |
| Target database | bench5gb |
| Target user name | pg@pg-11 |

>[!NOTE]
> Flexible server supports PostgreSQL version 11 onwards. Also, flexible server user name doesn't require @dbservername.

## Upgrade your databases using offline migration methods

You may choose to use one of the methods described in this section for your upgrades. You can use the following tips while performing the tasks.

- If you're using the same password for source and the target database,  you can set the `PGPASSWORD=yourPassword` environment variable.  Then you don’t have to provide password every time you run commands like psql, pg_dump, and pg_restore.  Similarly you can setup additional variables like `PGUSER`, `PGSSLMODE` etc. see to [PostgreSQL environment variables](https://www.postgresql.org/docs/11/libpq-envars.html).

- If your PostgreSQL server requires TLS/SSL connections (on by default in Azure Database for PostgreSQL servers), set an environment variable `PGSSLMODE=require` so that the pg_restore tool connects with TLS. Without TLS, the error may read  `FATAL:  SSL connection is required. Please specify SSL options and retry.`

- In the Windows command line, run the command `SET PGSSLMODE=require` before running the pg_restore command. In Linux or Bash run the command `export PGSSLMODE=require` before running the pg_restore command.

>[!Important]
> The steps and methods provided in this document are to give some examples of pg_dump/pg_restore commands and don't represent all possible ways to perform upgrades. It's recommended to test and validate the commands in a test environment before you use them in production.

### Migrate the Roles

Roles (Users) are global objects and needed to be migrated separately to the new cluster **before** restoring the database(s). You can use `pg_dumpall` binary with -r (--roles-only) option to dump them. 
To dump all the roles **with passwords** from the source **Single Server**:

```azurecli-interactive
pg_dumpall -r --host=mySourceServer --port=5432 --username=myUser@mySourceServer --database=mySourceDB > roles.sql
```

To dump all the roles names, **without passwords** from the source **Flexible Server**:
```azurecli-interactive
pg_dumpall -r --no-role-passwords --host=mySourceServer --port=5432 --username=myUser --database=mySourceDB > roles.sql
```

> [!IMPORTANT]
> In Azure Database for PostgreSQL - Flexible Server users are not allowed to access pg_authid table which contains information about database authorization identifiers together with user's passwords. Therefore retrieving passwords for users is not possible. Please consider using [Azure Key Vault](../../key-vault/secrets/about-secrets.md) to securely store your secrets.  

Edit the `roles.sql` and remove references of `NOSUPERUSER` and `NOBYPASSRLS` before restoring the content using psql in the target server:

```azurecli-interactive
psql -f roles.sql --host=myTargetServer --port=5432 --username=myUser --dbname=postgres
```

The dump script shouldn't be expected to run completely without errors. In particular, because the script will issue CREATE ROLE for every role existing in the source cluster, it's certain to get a “role already exists” error for the bootstrap superuser like azure_pg_admin or azure_superuser. This error is harmless and can be ignored. Use of the `--clean` option is likely to produce additional harmless error messages about non-existent objects, although you can minimize those by adding `--if-exists`.

### Method 1: Using pg_dump and psql

This method involves two steps. First is to dump a SQL file from the source server using `pg_dump`. The second step is to import the file to the target server using `psql`. Please see the [Migrate using export and import](how-to-migrate-using-export-and-import.md) documentation for details.

### Method 2: Using pg_dump and pg_restore

In this method of upgrade, you first create a dump from the source server using `pg_dump`. Then you restore that dump file to the target server using `pg_restore`. Please see the [Migrate using dump and restore](how-to-migrate-using-dump-and-restore.md) documentation for details.

### Method 3: Using streaming the dump data to the target database

If you don't have a PostgreSQL client or you want to use Azure Cloud Shell, then you can use this method. The database dump is streamed directly to the target database server and doesn't store the dump in the client. Hence, this can be used with a client with limited storage and even can be run from the Azure Cloud Shell.

1. Make sure the database exists in the target server using `\l` command. If the database doesn't exist, then create the database.
   ```azurecli-interactive
    psql "host=myTargetServer port=5432 dbname=postgres user=myUser password=###### sslmode=mySSLmode"
    ```
    ```SQL
    postgres> \l   
    postgres> create database myTargetDB;
   ```

2. Run the dump and restore as a single command line using a pipe. 
    ```azurecli-interactive
    pg_dump -Fc --host=mySourceServer --port=5432 --username=myUser --dbname=mySourceDB | pg_restore  --no-owner --host=myTargetServer --port=5432 --username=myUser --dbname=myTargetDB
    ```

    For example,

    ```azurecli-interactive
    pg_dump -Fc --host=pg-95.postgres.database.azure.com --port=5432 --username=pg@pg-95 --dbname=bench5gb | pg_restore --no-owner --host=pg-11.postgres.database.azure.com --port=5432 --username=pg@pg-11 --dbname=bench5gb
    ```  
3. Once the upgrade (migration) process completes, you can test your application with the target server. 
4. Repeat this process for all the databases within the server.

As an example, the following table illustrates the time it took to migrate using streaming dump method. The sample data is populated using [pgbench](https://www.postgresql.org/docs/10/pgbench.html). As your database can have different number of objects with varied sizes than pgbench generated tables and indexes, it's highly recommended to test dump and restore of your database to understand the actual time it takes to upgrade your database. 

| **Database Size** | **Approx. time taken** | 
| ----- | ------ |
| 1 GB  | 1-2 minutes |
| 5 GB | 8-10 minutes |
| 10 GB | 15-20 minutes |
| 50 GB | 1-1.5 hours |
| 100 GB | 2.5-3 hours|

### Method 4: Using parallel dump and restore

You can consider this method if you have few larger tables in your database and you want to parallelize the dump and restore process for that database. You also need enough storage in your client system to accommodate backup dumps. This parallel dump and restore process reduces the time consumption to complete the whole migration. For example, the 50 GB pgbench database which took 1-1.5 hrs to migrate was completed using Method 1 and 2 took less than 30 minutes using this method.

1. For each database in your source server, create a corresponding database at the target server.

    ```azurecli-interactive
    psql "host=myTargetServer port=5432 dbname=postgres user=myuser password=###### sslmode=mySSLmode"
    ```

    ```SQL
    postgres> create database myDB;
   ```

   For example,
    ```bash
    psql "host=pg-11.postgres.database.azure.com port=5432 dbname=postgres user=pg@pg-11 password=###### sslmode=require"
    psql (12.3 (Ubuntu 12.3-1.pgdg18.04+1), server 13.3)
    SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, bits: 256, compression: off)
    Type "help" for help.

    postgres> create database bench5gb;
    postgres> \q
    ```

2. Run the pg_dump command in a directory format with number of jobs = 4 (number of tables in the database). With larger compute tier and with more tables, you can increase it to a higher number. That pg_dump will create a directory to store compressed files for each job.

    ```azurecli-interactive
    pg_dump -Fd -v --host=sourceServer --port=5432 --username=myUser --dbname=mySourceDB -j 4 -f myDumpDirectory
    ```
    For example,
    ```bash
    pg_dump -Fd -v --host=pg-95.postgres.database.azure.com --port=5432 --username=pg@pg-95 --dbname=bench5gb -j 4 -f dump.dir
    ```

3. Then restore the backup at the target server.
    ```azurecli-interactive
    $ pg_restore -v --no-owner --host=myTargetServer --port=5432 --username=myUser --dbname=myTargetDB -j 4 myDumpDir
    ```
    For example,
    ```bash
    $ pg_restore -v --no-owner --host=pg-11.postgres.database.azure.com --port=5432 --username=pg@pg-11 --dbname=bench5gb -j 4 dump.dir
    ```

> [!TIP]
> The process mentioned in this document can also be used to upgrade your Azure Database for PostgreSQL - Flexible server. The main difference is the connection string for the flexible server target is without the `@dbName`.  For example, if the user name is `pg`, the single server’s username in the connect string will be `pg@pg-95`, while with flexible server, you can simply use `pg`.

## Post upgrade/migrate

After the major version upgrade is complete, we recommend to run the `ANALYZE` command  in each database to refresh the `pg_statistic` table. Otherwise, you may run into performance issues.

```SQL
postgres=> analyze;
ANALYZE
```

## Next steps

- After you're satisfied with the target database function, you can drop your old database server. 
- For Azure Database for PostgreSQL - Single server only. If you want to use the same database endpoint as the source server, then after you had deleted your old source database server, you can create a read replica with the old database server name. Once the steady replication state is established, you can stop the replica, which will promote the replica server to be an independent server. See [Replication](./concepts-read-replicas.md) for more details.

>[!Important] 
> It's highly recommended to test the new PostgreSQL upgraded version before using it directly for production. This includes comparing server parameters between the older source version source and the newer version target. Please ensure that they are same and check on any new parameters that were added in the new version. Differences between versions can be found [here](https://www.postgresql.org/docs/release/).

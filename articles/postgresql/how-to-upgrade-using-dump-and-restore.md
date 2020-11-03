---
title: Upgrade using dump and restore - Azure Database for PostgreSQL - Single Server
description: Describes couple of methods to dump and restore databases to migrate to a higher version Azure Database for PostgreSQL - Single Server.
author: sr-msft
ms.author: srranga
ms.service: postgresql
ms.topic: how-to
ms.date: 11/03/2020
---

# Upgrade your PostgreSQL database using dump and restore

In Azure Database for PostgreSQL - Single Server, it is recommended to upgrade your PostgreSQL database engine to a higher major version using one of these methods:
* Offline method using PostgreSQL [pg_dump](https://www.postgresql.org/docs/current/static/app-pgdump.html) and [pg_restore](https://www.postgresql.org/docs/current/static/app-pgrestore.html). In this method, you first perform the dump from your source server and then restore that dump in the target server.
* Online method using [**Database Migration Service**](https://docs.microsoft.com/azure/dms/tutorial-azure-postgresql-to-azure-postgresql-online-portal) (DMS). This method keeps the target database in-sync with with the source and you can choose when to cut-over. However, there are some prerequisites and restrictions to be addressed. 

You can use the following recommendation when deciding between online and offline methods to perform major version upgrades.

| **Database** | **Dump/restore (Offline)** | **DMS (Online)** |
| ------ | :------: | :-----: |
| You have a small database and can afford downtime to upgrade  | X | |
| Small databases (< 10 GB)	 | X | X | 
| Small-medium DBs (10 GB – 100 GB)	| X | X |
| Large databases (> 100 GB) |	| X |
| Can afford downtime to upgrade (irrespective of the database size) | X |  |
| Can address DMS [pre-requisites](https://docs.microsoft.com/azure/dms/tutorial-azure-postgresql-to-azure-postgresql-online-portal#prerequisites) including a reboot? |  | X |
| Can avoid DDLs and unlogged tables during the upgrade process? | |  X |

This how-to guide provides two example methods on how to upgrade your databases using PostgreSQL pg_dump and pg_restore commands. The process in this document is referred as **upgrade** though the database is  **migrated** from the source server to the target server. 

> [!NOTE]
> PostgreSQL dump and restore can be performed in many ways. You may choose to use different methods than what is referred in this document. For example, to do a dump followed by restore from a PostgreSQL client, please see the [documentation](./howto-migrate-using-dump-and-restore.md) for step-by-step procedure details and best practices. For detailed dump and restore syntax with additional parameters, see the articles [pg_dump](https://www.postgresql.org/docs/current/static/app-pgdump.html) and [pg_restore](https://www.postgresql.org/docs/current/static/app-pgrestore.html). 


## Prerequisites for using dump and restore with Azure PostgreSQL
 
To step through this how-to-guide, you need:
- A source database running 9.5, 9.6, or 10 (Azure Database for PostgreSQL – Single Server)
- Target database server with the desired PostgreSQL major version [Azure Database for PostgreSQL server](quickstart-create-server-database-portal.md). 
- A client system (Linux) with PostgreSQL installed and has [pg_dump](https://www.postgresql.org/docs/current/static/app-pgdump.html) and [pg_restore](https://www.postgresql.org/docs/current/static/app-pgrestore.html) command-line utilities installed. 
- Alternatively, you can use [Azure Cloud Shell](https://shell.azure.com) or by clicking the Azure Cloud Shell on the menu bar at the upper right in the [Azure Portal](https://portal.azure.com). You will have to login to your account `az login` before running the dump and restore commands.
- Your PostgreSQL client location such as a VM preferably running in the same region as the source and target servers). 

## Additional details and considerations
- You can find the connection string to the source and target databases by clicking the “Connection Strings” from the portal. 
- You may be running more than one database in your server. You can find the list of databases by connecting to your source server and running `\l`.
- Create corresponding databases in the target database server.
- You can skip upgrading `azure_maintenance` or template databases.
- Refer to the tables above to determine the database is suitable for this mode of migration.
- If you want to use Azure Cloud Shell, the session times out after 20 minutes. If your database size is < 10 GB, you may be complete the upgrade without timing out. Otherwise, you may have to keep the session open by other means, such as pressing <Enter> key once in 10-15 minutes. 

> [!TIP] 
> 1. If you are using the same password for source and the target database,  you can set the `PGPASSWORD=yourPassword` environment variable.  Then you don’t have to provide password everytime you run commands like psql, pg_dump, and pg_restore.  Similarly you can setup additional variables like `PGUSER`, `PGSSLMODE` etc. see to [PostgreSQL environment variables](https://www.postgresql.org/docs/11/libpq-envars.html).
>  
> 2. If your PostgreSQL server requires TLS/SSL connections (on by default in Azure Database for PostgreSQL servers), set an environment variable `PGSSLMODE=require` so that the pg_restore tool connects with TLS. Without TLS, the error may read  `FATAL:  SSL connection is required. Please specify SSL options and retry.`
>
> 3. In the Windows command line, run the command `SET PGSSLMODE=require` before running the pg_restore command. In Linux or Bash run the command `export PGSSLMODE=require` before running the pg_restore command.

## Example database used in this guide

 | **Description** | **Value** |
 | ------- | ------- |
 | Source server (v9.5) | pg-95.postgres.database.azure.com |
 | Source database | bench5gb |
 | Source database size | 5 GB |
 | Source user name | pg@pg-95 |
 | Target server (v11) | pg-11.postgres.database.azure.com |
 | Target database | bench5gb |
 | Target user name | pg@pg-11 |

## Method 1: Upgrade with streaming backups to the target 

In this method, the entire database dump  is streamed directly to the target database server and does not store the dump in the client. Hence, this can be used with a client with limited storage and even can be run from the Azure Cloud Shell. 

1. Make sure the database exists in the target server using `\l` command. If the database does not exist, then create the database.
   ```azurecli-interactive
    psql "host=myTargetServer port=5432 dbname=postgres user=myUser password=###### sslmode=mySSLmode"
    ```
    ```bash
    postgres> \l   
    postgres> create database myTargetDB;
   ```

2. Run the dump and restore as a single command line using a pipe. 
    ```azurecli-interactive
    pg_dump -Fc -v --mySourceServer --port=5432 --username=myUser --dbname=mySourceDB | pg_restore -v --no-owner --host=myTargetServer --port=5432 --username=myUser --dbname=myTargetDB
    ```

    For example,

    ```azurecli-interactive
    pg_dump -Fc -v --host=pg-95.postgres.database.azure.com --port=5432 --username=pg@pg-95 --dbname=bench5gb | pg_restore -v --no-owner --host=pg-11.postgres.database.azure.com --port=5432 --username=pg@pg-11 --dbname=bench5gb
    ```  
3. Once the upgrade (migration) process completes, you can test your application with the target server. 
4. Repeat this process for all the databases within the server.

 The following table illustrates time it took to upgrade using this method. The data is populated using [pgbench](https://www.postgresql.org/docs/10/pgbench.html). As your database can have different number of objects with varied sizes than pgbench generated tables and indexes, it is highly recommended to test dump and restore of your database to understand the actual time it takes to upgrade your database. 

| **Database Size** | **Approx. time taken** | 
| ----- | ------ |
| 1 GB  | 1-2 minutes |
| 5 GB | 8-10 minutes |
| 10 GB | 15-20 minutes |
| 50 GB | 1-1.5 hours |
| 100 GB | 2.5-3 hours|
   
## Method 2: Upgrade with parallel dump and restore 

This method is useful if you have few larger tables in the database and want to parallelize the dump and restore process for that database. You need enough local disk storage to accommodate backup dumps for your databases. This parallel dump and restore process reduces the time consumption to complete the whole migration/upgrade. For example, the 50 GB pgbench database which took 1-1.5 hrs to migrate was completed in less than 30 minutes.

1. For each database in your source server, create a corresponding database at the target server.

   ```bash
    psql "host=myTargetServer port=5432 dbname=postgres user=myuser password=###### sslmode=mySSLmode"
    postgresl> create database myDB;
   ```
   For example,
    ```bash
    psql "host=pg-11.postgres.database.azure.com port=5432 dbname=postgres user=pg@pg-11 password=###### sslmode=require"

    postgres> create database bench5gb;
    postgres> \q
    ```

2. Run the pg_dump command in a directory format with number of jobs = 4 (number of tables in the database). With larger compute tier and with more tables, you can increase it to a higher number. That pg_dump will create a directory to store compressed files for each job.

    ```bash
    pg_dump -Fd -v --host=sourceServer --port=5432 --username=myUser --dbname=mySourceDB -j 4 -f myDumpDirectory
    ```
    For example,
    ```bash
    pg_dump -Fd -v --host=pg-95.postgres.database.azure.com --port=5432 --username=pg@pg-95 --dbname=bench5gb -j 4 -f dump.dir
    ```

3. Then restore the backup at the target server.
    ```bash
    $ pg_restore -v --no-owner --host=myTargetServer --port=5432 --username=myUser --dbname=myTargetDB -j 4 myDumpDir
    ```
    For example,
    ```bash
    $ pg_restore -v --no-owner --host=pg-11.postgres.database.azure.com --port=5432 --username=pg@pg-11 --dbname=bench5gb -j 4 dump.dir
    ```

> [!TIP]
> The process mentioned in this document can also be used to upgrade your Azure Database for PostgreSQL - Flexible server, which is in Preview. The main difference is the connection string for the flexible server target is without the `@dbName`.  For example, if the user name is `pg`, the single server’s username in the connect string will be `pg@pg-95`, while with flexible server, you can simply use `pg`.

## Next Steps

- Once you are satisfied with the target database function, you can drop your old database server. 
- If you want to use the same database endpoint as the source server, then after you had deleted your old source database server, you can create a read replica with the old database server name. Once the steady state is established, you can stop the replica, which will promote the replica server to be an independent server. See [Replication](./concepts-read-replicas.md) for more details.
- Remember to test and validate these commands in a test environment before you use them in production.

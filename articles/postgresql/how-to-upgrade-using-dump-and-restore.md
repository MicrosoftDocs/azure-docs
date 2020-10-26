---
title: Upgrade using dump and restore - Azure Database for PostgreSQL - Single Server
description: Describes how to extract a PostgreSQL database into a dump file and restore from a file created by pg_dump in Azure Database for PostgreSQL - Single Server.
author: sr-msft
ms.author: srranga
ms.service: postgresql
ms.topic: how-to
ms.date: 10/27/2020
---

# Upgrade your PostgreSQL database using dump and restore

Azure Database for PostgreSQL - Single Server supports PostgreSQL versions 9.5, 9.6, 10, and 11 versions. You will be able to upgrade to a higher version using two methods:
* Using PostgreSQL native **dump** and **restore** method.  This is an offline migration method that performs the backup and restore at a point in time. 
* Using [**Database Migration Service**](https://docs.microsoft.com/azure/dms/tutorial-azure-postgresql-to-azure-postgresql-online-portal) (DMS).  You can use this online migration method to perform upgrades with reduced downtime to your source server.


The following chart provides a comparison between offline and online methods of upgrades. 

| **Database** | **Dump/restore (Offline)** | **DMS (Online)** |
| ------ | ------ | ----- |
| You have a small database and can afford downtime to upgrade  |	 X | |	 
| Small databases (< 10 GB)	 | X	| | 
| Small-medium DBs (10 GB – 100 GB)	| X | 	X |
| Large databases (> 100 GB)	|	| X |
| Cannot afford downtime to upgrade (irrespective of size) | |		X |
| Can avoid DDLs and unlogged tables during the upgrade process.|	|	X |

This document provides guidelines and examples on how to upgrade your databases using PostgreSQL pg_dump and pg_restore commands. The process in this document is referred as **upgrade** though the database is  **migrated** from the source server to the target server. For detailed best practices to tune and configure your source and target databases, please see [Migrate using dump and restore](./howto-migrate-using-dump-and-restore) documentation.

> [!NOTE]
> For detailed dump and restore syntax with additional parameters, see the articles [pg_dump](https://www.postgresql.org/docs/current/static/app-pgdump.html) and [pg_restore](https://www.postgresql.org/docs/current/static/app-pgrestore.html).

		
To help with online Vs offline upgrade, here are some example timelines observed using different sizes of databases that are populated using [pgbench](https://www.postgresql.org/docs/10/pgbench.html). 

| **Database Size** |	**Time taken** | 
| ----- | ------ |
| 1 GB  | 1-2 minutes |
| 5 GB | 8-10 minutes |
| 10 GB | 15-20 minutes |
| 50 GB | 1-1.5 hours |
| 100 GB | 2.5-3 hours|

## Prerequisites for using dump and restore
 
To step through this how-to-guide, you need:
- Source database (Azure Database for PostgreSQL – Single Server)
- Target database server with desired PostgreSQL version [Azure Database for PostgreSQL server](quickstart-create-server-database-portal.md) with firewall rules to allow access and database under it.
- A client system with PostgreSQL installed and has [pg_dump](https://www.postgresql.org/docs/current/static/app-pgdump.html) and [pg_restore](https://www.postgresql.org/docs/current/static/app-pgrestore.html) command-line utilities installed. Alternatively, you can use [Azure Cloud Shell](https://shell.azure.com) or by clicking the Azure Cloud Shell on the menu bar at the upper right in [Azure Portal](https://portal.azure.com).
- Your PostgreSQL client location such as a VM preferably running in the same region as the source and target servers). 
- The database you are upgrading should pre-exist in the target server. 


## Additional details and considerations
- You can find the connection string to the source and target databases by clicking the “Connection Strings” from the portal. 
- You may be running more than one database in your server. You can find the list of databases by connecting to your source server and running `\l`.
- You do not have to migrate or upgrade `azure_maintenance` or template databases.
- Refer to the tables above to determine the database is suitable for this mode of migration.
- If you want to use Azure Cloud Shell, the session times out after 20 minutes. If your database size is < 10 GB, you may be complete the upgrade without timing out. Otherwise, you may have to keep the session open by other means, such as pressing <Enter> key once in 10-15 minutes.  

> [!TIP] 
> If you are using the same password for source and the target database,  you can set the `PGPASSWORD=yourPassword` environment variable.  Then you don’t have to provide password everytime you run commands like psql, pg_dump, and pg_restore.  Similarly you can setup additional variables like `PGUSER`, `PGSSLMODE` etc. Refer to https://www.postgresql.org/docs/11/libpq-envars.html for more details.
> 
> If your PostgreSQL server requires TLS/SSL connections (on by default in Azure Database for PostgreSQL servers), set an environment variable `PGSSLMODE=require` so that the pg_restore tool connects with TLS. Without TLS, the error may read  `FATAL:  SSL connection is required. Please specify SSL options and retry.`
>
> In the Windows command line, run the command `SET PGSSLMODE=require` before running the pg_restore command. In Linux or Bash run the command `export PGSSLMODE=require` before running the pg_restore command.
>

## Example database used in this document

 | **Description** | **Value** |
 | ------- | ------- |
 | Source server (v9.5) | pg-95.postgres.database.azure.com |
 | Source database | bench5gb |
 | Source database size | 5 GB |
 | Source user name | pg@pg-95 |
 | Target server (v11) | pg-11.postgres.database.azure.com |
 | Target database | bench5gb |
 | Target user name | pg@pg-11 |


## Method 1: Upgrade using a client without local storage 

In this method, the entire database backup output is streamed directly to the target database server. This method does not store and backups local to the client. Hence, this can even be run from the Azure Cloud Shell. This will 

1. Make sure the database exists in the target server using `\l` command. If the database does not exist, then create the database.
   ```bash
    psql "host<target server name> port=5432 dbname=postgres user=<user@dbname> password=###### sslmode=require"
    postgres> \l   
    postgresl> create database <database name>;
   ```

2. Run the dump and restore command. 
    ```bash
    $ pg_dump -Fc -v --<your source server FQDN> --port=5432 --username=<user@source server> --dbname=<source database> | pg_restore -v --no-owner --host=<your target server FQDN> --port=5432 --username=<user@target server> --dbname=,target database>
    ```

    For example,

    ```bash 
    $ pg_dump -Fc -v --host=pg-95.postgres.database.azure.com --port=5432 --username=pg@pg-95 --dbname=bench5gb | pg_restore -v --no-owner --host=pg-11.postgres.database.azure.com --port=5432 --username=pg@pg-11 --dbname=bench5gb
    ```  
1. Once the upgrade (migration) process completes, you can test your application with the target server. 
2. Repeat this process for all the databases within the server.
   
## Method 2: Running parallel dump and restore with local storage 

This method is useful if you have few larger tables in the database and want to parallelize the dump and restore process for that database. You need enough local disk storage to accommodate backup dumps for your databases. This parallel dump and restore process reduces the time consumption to complete the whole migration/upgrade. For example, the 50 GB pgbench database which took 1-1.5 hrs to migrate was completed in less than 30 minutes.


1. For each database in your source server, create a corresponding database at the target server.

   ```bash
    psql "host<target server name> port=5432 dbname=postgres user=<user@dbname> password=###### sslmode=<ssl mode>"
    postgresl> create database <database name>;
   ```
   For example,
    ```bash
    psql "host=pg-11.postgres.database.azure.com port=5432 dbname=postgres user=pg@pg-11 password=###### sslmode=require"

    postgres> create database bench5gb;
    postgres> \q
    ```

2. Run the pg_dump command in a directory format with number of jobs = 4 (number of tables in the database). With larger compute tier and with more tables, you can increase it to a higher number. That pg_dump will create a directory to store compressed files for each job.

    ```bash
    $ pg_dump -Fd -v --host=<source server> --port=5432 --username=<user@dbName> --dbname=<source DB name> -j 4 -f <dump directory name>
    Password:
    ```
    For example,
    ```bash
    $ pg_dump -Fd -v --host=pg-95.postgres.database.azure.com --port=5432 --username=pg@pg-95 --dbname=bench5gb -j 4 -f dump.dir
    Password:
    ```

3. Then restore the backup at the target server.
    ```bash
    $ pg_restore -v --no-owner --host=<target server> --port=5432 --username=<user@dbName> --dbname=<target DB name> -j 4 <dump directory name>
    Password:
    ```
    For example,
    ```bash
    $ pg_restore -v --no-owner --host=pg-11.postgres.database.azure.com --port=5432 --username=pg@pg-11 --dbname=bench5gb -j 4 dump.dir
    Password:
    ```

## Method 3: Using dump and restore separately

Please see the [documentation](./howto-migrate-using-dump-and-restore.md) for details.


> [!NOTE]
> The process mentioned in this document can also be used to migrate to the Azure Database for PostgreSQL - Flexible server, which is in Preview. The main difference is the connection string for the flexible server target is without the "@ <DBNAME>" .  For example, if the user name is "pg", the single server’ username in the connect string will be "pg@pg-95", while with flexible server, you can simply use "pg".

## Next Steps

- Once you are satisfied with the target database function, you may want to drop your old database server. 
- If you want to use the same database end point as the source, after you had deleted your old surce database server, you can create a read replica with the old server name. Once the steady state is established, you can stop the replica. That step also promotes the replica server to be an indepdent server. See [Replication](./concepts-read-replicas.md) for more details.
- Remember to test and validate these commands in a test environment before you use them in production.

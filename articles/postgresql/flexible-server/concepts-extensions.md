---
title: Extensions
description: Learn about the available PostgreSQL extensions in Azure Database for PostgreSQL - Flexible Server.
author: varun-dhawan
ms.author: varundhawan
ms.reviewer: maghan
ms.date: 05/8/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: conceptual
---

# PostgreSQL extensions in Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

Azure Database for PostgreSQL flexible server provides the ability to extend the functionality of your database using extensions. Extensions bundle multiple related SQL objects in a single package that can be loaded or removed from your database with a command. After being loaded into the database, extensions function like built-in features.

## How to use PostgreSQL extensions

Before installing extensions in Azure Database for PostgreSQL flexible server, you need to allowlist these extensions for use.

Using the [Azure portal](https://portal.azure.com):

   1. Select your Azure Database for PostgreSQL flexible server instance.
   1. On the sidebar, select **Server Parameters**.
   1. Search for the `azure.extensions` parameter.
   1. Select extensions you wish to allowlist.
     :::image type="content" source="./media/concepts-extensions/allow-list.png" alt-text="Screenshot showing Azure Database for PostgreSQL flexible server - allow-listing extensions for installation." lightbox="./media/concepts-extensions/allow-list.png":::

Using [Azure CLI](/cli/azure/):

   You can allowlist extensions via CLI parameter set [command](/cli/azure/postgres/flexible-server/parameter?view=azure-cli-latest&preserve-view=true).

   ```azurecli
az postgres flexible-server parameter set --resource-group <your resource group>  --server-name <your server name> --subscription <your subscription id> --name azure.extensions --value <extension name>,<extension name>
   ```

   Using [ARM Template](../../azure-resource-manager/templates/index.yml):
   Example shown below allowlists extensions dblink, dict_xsyn, pg_buffercache on the server mypostgreserver

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "flexibleServers_name": {
            "defaultValue": "mypostgreserver",
            "type": "String"
        },
        "azure_extensions_set_value": {
            "defaultValue": " dblink,dict_xsyn,pg_buffercache",
            "type": "String"
        }
    },
    "variables": {},
    "resources": [
        {
            "type": "Microsoft.DBforPostgreSQL/flexibleServers/configurations",
            "apiVersion": "2021-06-01",
            "name": "[concat(parameters('flexibleServers_name'), '/azure.extensions')]",
            "properties": {
                "value": "[parameters('azure_extensions_set_value')]",
                "source": "user-override"
            }
        }
    ]
}
  ```

`shared_preload_libraries` is a server configuration parameter determining which libraries are to be loaded when Azure Database for PostgreSQL flexible server starts. Any libraries, which use shared memory must be loaded via this parameter. If your extension needs to be added to shared preload libraries this action can be done:

Using the [Azure portal](https://portal.azure.com):

   1. Select your Azure Database for PostgreSQL flexible server instance.
   1. On the sidebar, select **Server Parameters**.
   1. Search for the `shared_preload_libraries` parameter.
   1. Select extensions you wish to add.
     :::image type="content" source="./media/concepts-extensions/shared-libraries.png" alt-text="Screenshot showing Azure Database for PostgreSQL -setting shared preload libraries parameter setting for extensions installation." lightbox="./media/concepts-extensions/shared-libraries.png":::

Using [Azure CLI](/cli/azure/):

   You can set `shared_preload_libraries` via CLI parameter set [command](/cli/azure/postgres/flexible-server/parameter?view=azure-cli-latest&preserve-view=true).

   ```azurecli
az postgres flexible-server parameter set --resource-group <your resource group>  --server-name <your server name> --subscription <your subscription id> --name shared_preload_libraries --value <extension name>,<extension name>
   ```

After extensions are allow-listed and loaded, these must be installed in your database before you can use them. To install a particular extension, you should run the [CREATE EXTENSION](https://www.postgresql.org/docs/current/sql-createextension.html) command. This command loads the packaged objects into your database.

> [!NOTE]  
> Third party extensions offered in Azure Database for PostgreSQL flexible server are open source licensed code. Currently, we don't offer any third party extensions or extension versions with premium or proprietary licensing models.

Azure Database for PostgreSQL flexible server instance supports a subset of key PostgreSQL extensions as listed below. This information is also available by running `SHOW azure.extensions;`. Extensions not listed in this document aren't supported on Azure Database for PostgreSQL flexible server. You can't create or load your own extension in Azure Database for PostgreSQL flexible server.

## Extension versions

The following extensions are available in Azure Database for PostgreSQL flexible server:
> [!NOTE]  
> Extensions in the following table with the :heavy_check_mark: mark, require their corresponding libraries to be enabled in the `shared_preload_libraries` server parameter.

[!INCLUDE [extensions-table](./includes/extensions-table.md)]

## Upgrading PostgreSQL extensions
In-place upgrades of database extensions are allowed through a simple command. This feature enables customers to automatically update their third-party extensions to the latest versions, maintaining current and secure systems without manual effort.

### Updating Extensions
To update an installed extension to the latest available version supported by Azure, use the following SQL command:

```sql
ALTER EXTENSION <extension-name> UPDATE;
```

This command simplifies the management of database extensions by allowing users to manually upgrade to the latest version approved by Azure, enhancing both compatibility and security.

### Limitations
While updating extensions is straightforward, there are certain limitations:
- **Specific Version Selection**: The command does not support updating to intermediate versions of an extension. It will always update to the [latest available version](#extension-versions).
- **Downgrading**: Does not support downgrading an extension to a previous version. If a downgrade is necessary, it might require support assistance and depends on the availability of previous version.

#### Viewing Installed Extensions
To list the extensions currently installed on your database, use the following SQL command:

```sql
SELECT * FROM pg_extension;
```

#### Available Extension Versions
To check which versions of an extension are available for your current database installation, execute:

```sql
SELECT * FROM pg_available_extensions WHERE name = 'azure_ai';
```

These commands provide necessary insights into the extension configurations of your database, helping maintain your systems efficiently and securely. By enabling easy updates to the latest extension versions, Azure Database for PostgreSQL continues to support the robust, secure, and efficient management of your database applications.

## dblink and postgres_fdw

[dblink](https://www.postgresql.org/docs/current/contrib-dblink-function.html) and [postgres_fdw](https://www.postgresql.org/docs/current/postgres-fdw.html) allow you to connect from one Azure Database for PostgreSQL flexible server instance to another, or to another database in the same server. Azure Database for PostgreSQL flexible server supports both incoming and outgoing connections to any PostgreSQL server. The sending server needs to allow outbound connections to the receiving server. Similarly, the receiving server needs to allow connections from the sending server.

We recommend deploying your servers with [virtual network integration](concepts-networking.md) if you plan to use these two extensions. By default virtual network integration allows connections between servers in the virtual network. You can also choose to use [virtual network network security groups](../../virtual-network/manage-network-security-group.md) to customize access.

## pg_prewarm

The `pg_prewarm` extension loads relational data into cache. Prewarming your caches means that your queries have better response times on their first run after a restart. The auto-prewarm functionality isn't currently available in Azure Database for PostgreSQL flexible server.

## pg_cron

[pg_cron](https://github.com/citusdata/pg_cron/) is a simple, cron-based job scheduler for PostgreSQL that runs inside the database as an extension. The `pg_cron` extension can be used to run scheduled maintenance tasks within a PostgreSQL database. For example, you can run periodic vacuum of a table or removing old data jobs.

`pg_cron` can run multiple jobs in parallel, but it runs at most one instance of a job at a time. If a second run is supposed to start before the first one finishes, then the second run is queued and started as soon as the first run completes. This ensures that jobs run exactly as many times as scheduled and don't run concurrently with themselves.

Some examples:

To delete old data on Saturday at 3:30am (GMT).

```sql
SELECT cron.schedule('30 3 * * 6', $$DELETE FROM events WHERE event_time < now() - interval '1 week'$$);
```
To run vacuum every day at 10:00am (GMT) in default database `postgres`.


```sql
SELECT cron.schedule('0 10 * * *', 'VACUUM');
```

To unschedule all tasks from `pg_cron`.

```sql
SELECT cron.unschedule(jobid) FROM cron.job;
```
To see all jobs currently scheduled with `pg_cron`.


```sql
SELECT * FROM cron.job;
```
To run vacuum every day at 10:00 am (GMT) in database 'testcron' under azure_pg_admin role account.


```sql
SELECT cron.schedule_in_database('VACUUM','0 10 * * * ','VACUUM','testcron',null,TRUE);
```

> [!NOTE]  
> pg_cron extension is preloaded in `shared_preload_libraries` for every Azure Database for PostgreSQL flexible server instance inside postgres database to provide you with ability to schedule jobs to run in other databases within your Azure Database for PostgreSQL flexible server DB instance without compromising security. However, for security reasons, you still have to [allow list](#how-to-use-postgresql-extensions) `pg_cron` extension and install it using [CREATE EXTENSION](https://www.postgresql.org/docs/current/sql-createextension.html) command.

Starting with `pg_cron` version 1.4, you can use the `cron.schedule_in_database` and `cron.alter_job` functions to schedule your job in a specific database and update an existing schedule respectively.

Some examples:

To delete old data on Saturday at 3:30am (GMT) on database DBName.

```sql
SELECT cron.schedule_in_database('JobName', '30 3 * * 6', $$DELETE FROM events WHERE event_time < now() - interval '1 week'$$,'DBName');
```
> [!NOTE]  
> `cron_schedule_in_database` function allows for user name as optional parameter. Setting the username to a non-null value requires PostgreSQL superuser privilege and is not supported in Azure Database for PostgreSQL flexible server. Preceding examples show running this function with optional user name parameter ommitted or set to null, which runs the job in context of user scheduling the job, which should have azure_pg_admin role privileges.

To update or change the database name for the existing schedule

```sql
SELECT cron.alter_job(job_id:=MyJobID,database:='NewDBName');
```

## pg_failover_slots (preview)

The PG Failover Slots extension enhances Azure Database for PostgreSQL flexible server when operating with both logical replication and high availability enabled servers. It effectively addresses the challenge within the standard PostgreSQL engine that doesn't preserve logical replication slots after a failover. Maintaining these slots is critical to prevent replication pauses or data mismatches during primary server role changes, ensuring operational continuity and data integrity.

The extension streamlines the failover process by managing the necessary transfer, cleanup, and synchronization of replication slots, thus providing a seamless transition during server role changes.
The extension is supported for PostgreSQL versions 11 to 16.

You can find more information and how to use the PG Failover Slots extension on its [GitHub page](https://github.com/EnterpriseDB/pg_failover_slots).

### Enable pg_failover_slots

To enable the PG Failover Slots extension for your Azure Database for PostgreSQL flexible server instance, you need to modify the server's configuration by including the extension in the server's shared preload libraries and adjusting a specific server parameter. Here's the process:

1. Add `pg_failover_slots` to the server's shared preload libraries by updating the `shared_preload_libraries` parameter.
1. Change the server parameter `hot_standby_feedback` to `on`.

Any changes to the `shared_preload_libraries` parameter require a server restart to take effect.

Follow these steps in the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com/) and go to your Azure Database for PostgreSQL flexible server instance's page.
1. In the menu on the left, select **Server parameters**.
1. Find the `shared_preload_libraries` parameter in the list and edit its value to include `pg_failover_slots`.
1. Search for the `hot_standby_feedback` parameter and set its value to `on`.
1. Select on **Save** to preserve your changes. Now, you'll have the option to **Save and restart**. Choose this to ensure that the changes take effect since modifying `shared_preload_libraries` requires a server restart.

By selecting **Save and restart**, your server will automatically reboot, applying the changes you've made. Once the server is back online, the PG Failover Slots extension is enabled and operational on your primary Azure Database for PostgreSQL flexible server instance, ready to handle logical replication slots during failovers.

## pg_stat_statements

The [pg_stat_statements extension](https://www.postgresql.org/docs/current/pgstatstatements.html) gives you a view of all the queries that have run on your database. That is useful to get an understanding of what your query workload performance looks like on a production system.

The [pg_stat_statements extension](https://www.postgresql.org/docs/current/pgstatstatements.html) is preloaded in `shared_preload_libraries` on every Azure Database for PostgreSQL flexible server instance to provide you a means of tracking execution statistics of SQL statements.
However, for security reasons, you still have to [allowlist](#how-to-use-postgresql-extensions)  [pg_stat_statements extension](https://www.postgresql.org/docs/current/pgstatstatements.html) and install it using [CREATE EXTENSION](https://www.postgresql.org/docs/current/sql-createextension.html) command.
The setting `pg_stat_statements.track`, which controls what statements are counted by the extension, defaults to `top`, meaning all statements issued directly by clients are tracked. The two other tracking levels are `none` and `all`. This setting is configurable as a server parameter.

There's a tradeoff between the query execution information `pg_stat_statements` provides and the impact on server performance as it logs each SQL statement. If you aren't actively using the `pg_stat_statements` extension, we recommend that you set `pg_stat_statements.track` to `none`. Some third-party monitoring services might rely on `pg_stat_statements` to deliver query performance insights, so confirm whether this is the case for you or not.

## TimescaleDB

TimescaleDB is a time-series database that is packaged as an extension for PostgreSQL. TimescaleDB provides time-oriented analytical functions, optimizations, and scales Postgres for time-series workloads.
[Learn more about TimescaleDB](https://docs.timescale.com/timescaledb/latest/), a registered trademark of Timescale, Inc. Azure Database for PostgreSQL flexible server provides the TimescaleDB [Apache-2 edition](https://www.timescale.com/legal/licenses).
### Install TimescaleDB

To install TimescaleDB, in addition, to allow listing it, as shown [above](#how-to-use-postgresql-extensions), you need to include it in the server's shared preload libraries. A change to Postgres's `shared_preload_libraries` parameter requires a **server restart** to take effect. You can change parameters using the [Azure portal](how-to-configure-server-parameters-using-portal.md) or the [Azure CLI](how-to-configure-server-parameters-using-cli.md).
Using the [Azure portal](https://portal.azure.com/):

1. Select your Azure Database for PostgreSQL flexible server instance.

1. On the sidebar, select **Server Parameters**.

1. Search for the `shared_preload_libraries` parameter.

1. Select **TimescaleDB**.

1. Select **Save** to preserve your changes. You get a notification once the change is saved.

1. After the notification, **restart** the server to apply these changes.

You can now enable TimescaleDB in your Azure Database for PostgreSQL flexible server database. Connect to the database and issue the following command:

```sql
CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;
```
> [!TIP]  
> If you see an error, confirm that you [restarted your server](how-to-restart-server-portal.md) after saving shared_preload_libraries.

You can now create a TimescaleDB hypertable [from scratch](https://docs.timescale.com/getting-started/creating-hypertables) or migrate [existing time-series data in PostgreSQL](https://docs.timescale.com/getting-started/migrating-data).

### Restore a Timescale database using pg_dump and pg_restore

To restore a Timescale database using pg_dump and pg_restore, you must run two helper procedures in the destination database: `timescaledb_pre_restore()` and `timescaledb_post restore()`.

First, prepare the destination database:

```SQL
--create the new database where you'll perform the restore
CREATE DATABASE tutorial;
\c tutorial --connect to the database
CREATE EXTENSION timescaledb;

SELECT timescaledb_pre_restore();
```

Now you can run pg_dump on the original database and then do pg_restore. After the restore, be sure to run the following command in the restored database:

```SQL
SELECT timescaledb_post_restore();
```
For more details on restore method with Timescale enabled database, see [Timescale documentation](https://docs.timescale.com/timescaledb/latest/how-to-guides/backup-and-restore/pg-dump-and-restore/#restore-your-entire-database-from-backup).


### Restore a Timescale database using timescaledb-backup

While running `SELECT timescaledb_post_restore()` procedure listed above you might get permissions denied error updating timescaledb.restoring flag. This is due to limited ALTER DATABASE permission in Cloud PaaS database services. In this case you can perform alternative method using `timescaledb-backup` tool to back up and restore Timescale database. Timescaledb-backup is a program for making dumping and restoring a TimescaleDB database simpler, less error-prone, and more performant.  
To do so, you should do following
   1. Install  tools as detailed [here](https://github.com/timescale/timescaledb-backup#installing-timescaledb-backup)
   1. Create a target Azure Database for PostgreSQL flexible server instance and database
   1. Enable Timescale extension as shown above
   1. Grant `azure_pg_admin` role to user that will be used by [ts-restore](https://github.com/timescale/timescaledb-backup#using-ts-restore)
   1. Run [ts-restore](https://github.com/timescale/timescaledb-backup#using-ts-restore) to restore database

More details on these utilities can be found [here](https://github.com/timescale/timescaledb-backup).  
> [!NOTE]  
> When using `timescale-backup` utilities to restore to Azure, since database user names for Azure Database for PostgreSQL single server must use the `<user@db-name>` format, you need to replace `@` with `%40` character encoding.

## pg_hint_plan

`pg_hint_plan` makes it possible to tweak PostgreSQL execution plans using so-called "hints" in SQL comments, like:

```sql
/*+ SeqScan(a) */
```
`pg_hint_plan` reads hinting phrases in a comment of special form given with the target SQL statement. The special form is beginning by the character sequence "/\*+" and ends with "\*/". Hint phrases consist of hint name and following parameters enclosed by parentheses and delimited by spaces. New lines for readability can delimit each hinting phrase.

Example:

```sql
  /*+
      HashJoin(a b)
      SeqScan(a)
    */
    SELECT *
      FROM pgbench_branches b
      JOIN pgbench_accounts an ON b.bid = a.bid
     ORDER BY a.aid;
```
The above example causes the planner to use the results of a `seq scan` on the table a to be combined with table b as a `hash join`.

To install pg_hint_plan, in addition, to allow listing it, as shown [above](#how-to-use-postgresql-extensions), you need to include it in the server's shared preload libraries. A change to Postgres's `shared_preload_libraries` parameter requires a **server restart** to take effect. You can change parameters using the [Azure portal](how-to-configure-server-parameters-using-portal.md) or the [Azure CLI](how-to-configure-server-parameters-using-cli.md).
Using the [Azure portal](https://portal.azure.com/):

1. Select your Azure Database for PostgreSQL flexible server instance.

1. On the sidebar, select **Server Parameters**.

1. Search for the `shared_preload_libraries` parameter.

1. Select **pg_hint_plan**.

1. Select **Save** to preserve your changes. You get a notification once the change is saved.

1. After the notification, **restart** the server to apply these changes.

You can now enable pg_hint_plan your Azure Database for PostgreSQL flexible server database. Connect to the database and issue the following command:

```sql
CREATE EXTENSION pg_hint_plan;
```

## pg_buffercache

`Pg_buffercache` can be used to study the contents of *shared_buffers*. Using [this extension](https://www.postgresql.org/docs/current/pgbuffercache.html) you can tell if a particular relation is cached or not (in `shared_buffers`). This extension can help you troubleshooting performance issues (caching related performance issues).

This is part of contrib, and it's easy to install this extension.

```sql
CREATE EXTENSION pg_buffercache;
```

## Extensions and Major Version Upgrade

Azure Database for PostgreSQL flexible server has introduced an [in-place major version upgrade](./concepts-major-version-upgrade.md) feature that performs an in-place upgrade of the Azure Database for PostgreSQL flexible server instance with just a click. In-place major version upgrade simplifies the Azure Database for PostgreSQL flexible server upgrade process, minimizing the disruption to users and applications accessing the server. In-place major version upgrade doesn't support specific extensions, and there are some limitations to upgrading certain extensions. The extensions **Timescaledb**, **pgaudit**, **dblink**, **orafce**, and **postgres_fdw** are unsupported for all Azure Database for PostgreSQL flexible server versions when using [in-place major version update feature](./concepts-major-version-upgrade.md).

## Related content

> [!div class="nextstepaction"]
> [feedback forum](https://aka.ms/pgfeedback)

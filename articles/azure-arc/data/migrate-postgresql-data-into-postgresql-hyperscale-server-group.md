---
title: Migrate data from a PostgreSQL database into an Azure Arc enabled PostgreSQL Hyperscale server group
titleSuffix: Azure Arc enabled database services
description: Migrate data from a PostgreSQL database into an Azure Arc enabled PostgreSQL Hyperscale server group
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: TheJY
ms.author: jeanyd
ms.reviewer: mikeray
ms.date: 09/22/2020
ms.topic: how-to
---

# Migrate PostgreSQL database to Azure Arc enabled PostgreSQL Hyperscale server group

This document describes the steps to get your existing PostgreSQL database (one that not hosted in Azure Arc enabled Data Services) into your Azure Arc enabled PostgreSQL Hyperscale server group.

[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]

## Considerations

Azure Arc enabled PostgreSQL Hyperscale server group is the community version of PostgreSQL and runs with the CitusData extension enabled. So any tool that that works on PostgreSQL outside of Azure Arc should work with Azure Arc enabled PostgreSQL Hyperscale server group.


As such, with the set of tools you use today for Postgres, you should be able to:
1. Backup your Postgres database from your instance hosted outside of Azure Arc
2. Restore it in your Azure Arc enabled PostgreSQL Hyperscale server group

What will be left for you to do is:
- reset the server parameters
- reset the security contexts: recreate users, roles, and reset permissions...

To do this backup/restore operation, you can use any tool that is capable of doing backup/restore for Postgres. For example:
- Azure Data Studio and its Postgres extension
- `pgcli`
- `pgAdmin`
- `pg_dump`
- `pg_restore`
- `psql`
- ...

## Example
Let's illustrate those steps using the `pgAdmin` tool.
Consider the following setup:
- **Source:**  
    A Postgres server running on premises on a bare metal server and named JEANYDSRV. It is of version 12 and hosts a database named MyOnPremPostgresDB that has one table T1 which has 1 row
    :::image type="content" source="media/postgres-hyperscale/migrate-pg-source.jpg" alt-text="Migrate-source":::

- **Destination:**  
    A Postgres server running in an Azure Arc environment and named postgres01. It is of version 12. It does not have any database except the standard Postgres database.  
    :::image type="content" source="media/postgres-hyperscale/migrate-pg-destination.jpg" alt-text="Migrate-destination":::


### Take a backup of the source database on premises

:::image type="content" source="media/postgres-hyperscale/Migrate-PG-Source-Backup.jpg" alt-text="Migrate-source-backup":::

Configure it:
1. Give it a file name: **MySourceBackup**
2. Set the format to **Custom**
:::image type="content" source="media/postgres-hyperscale/Migrate-PG-Source-Backup2.jpg" alt-text="Migrate-source-backup-configure":::

The backup completes successfully:  
:::image type="content" source="media/postgres-hyperscale/Migrate-PG-Source-Backup3.jpg" alt-text="Migrate-source-backup-completed":::

### Create an empty database on the destination system in your Azure Arc enabled PostgreSQL Hyperscale server group

> [!NOTE]
> To register a Postgres instance in the `pgAdmin` tool, you need to you use public IP of your instance in your Kubernetes cluster and set the port and security context appropriately. You will find these details on the `psql` endpoint line after running the following command:

```console
azdata arc postgres endpoint list -n postgres01
```
That returns an output like:
```console
[
  {
    "Description": "PostgreSQL Instance",
    "Endpoint": "postgresql://postgres:<replace with password>@12.345.123.456:1234"
  },
  {
    "Description": "Log Search Dashboard",
    "Endpoint": "https://12.345.123.456:12345/kibana/app/kibana#/discover?_a=(query:(language:kuery,query:'custom_resource_name:\"postgres01\"'))"
  },
  {
    "Description": "Metrics Dashboard",
    "Endpoint": "https://12.345.123.456:12345/grafana/d/postgres-metrics?var-Namespace=arc3&var-Name=postgres01"
  }
]
```

Let's name the destination database **RESTORED_MyOnPremPostgresDB**.

:::image type="content" source="media/postgres-hyperscale/migrate-pg-destination-dbcreate.jpg" alt-text="Migrate-destination-db-create" lightbox="media/postgres-hyperscale/migrate-pg-destination-dbcreate.jpg":::

### Restore the database in your Arc setup

:::image type="content" source="media/postgres-hyperscale/migrate-pg-destination-dbrestore.jpg" alt-text="Migratre-db-restore":::

Configure the restore:
1. Point to the file that contains the backup to restore: **MySourceBackup**
2. Keep the format set  to **Custom or tar**
   :::image type="content" source="media/postgres-hyperscale/migrate-pg-destination-dbrestore2.jpg" alt-text="Migrate-db-restore-configure":::

3. Click **Restore**.  

   The restore is successful.  
   :::image type="content" source="media/postgres-hyperscale/migrate-pg-destination-dbrestore3.jpg" alt-text="Migrate-db-restore-completed":::

### Verify that the database was successfully restored in your Azure Arc enabled PostgreSQL Hyperscale server group

Use either of the following methods:

**From `pgAdmin`:**  

Expand the Postgres instance hosted in your Azure Arc setup. You will see the table in the database that you have restored and when you select the data it shows the same row as that it has in the on-premises instance:

   :::image type="content" source="media/postgres-hyperscale/migrate-pg-destination-dbrestoreverif.jpg" alt-text="Migrate-db-restore-verification":::

**From `psql` inside your Azure Arc setup:**  

Within your Arc setup you can use `psql` to connect to your Postgres instance, set the database context to `RESTORED_MyOnPremPostgresDB` and query the data:

1. List the end points to help from your `psql` connection string:

   ```console
   azdata arc postgres endpoint list -n postgres01
   [
     {
       "Description": "PostgreSQL Instance",
       "Endpoint": "postgresql://postgres:<replace with password>@12.345.123.456:1234"
     },
     {
       "Description": "Log Search Dashboard",
       "Endpoint": "https://12.345.123.456:12345/kibana/app/kibana#/discover?_a=(query:(language:kuery,query:'custom_resource_name:\"postgres01\"'))"
     },
     {
       "Description": "Metrics Dashboard",
       "Endpoint": "https://12.345.123.456:12345/grafana/d/postgres-metrics?var-Namespace=arc3&var-Name=postgres01"
     }
   ]
   ```

1. From your `psql` connection string use the `-d` parameter to indicate the database name. With the below command, you will be prompted for the password:

   ```console
   psql -d RESTORED_MyOnPremPostgresDB -U postgres -h 10.0.0.4 -p 32639
   ```

   `psql` connects.

   ```output
   Password for user postgres:
   psql (10.12 (Ubuntu 10.12-0ubuntu0.18.04.1), server 12.3 (Debian 12.3-1.pgdg100+1))
   WARNING: psql major version 10, server major version 12.
         Some psql features might not work.
   SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, bits: 256, compression: off)
   Type "help" for help.

   RESTORED_MyOnPremPostgresDB=#   
   ```

1. Select the table and you'll see the data that you restored from the on-premises Postgres instance:

   ```console
   RESTORED_MyOnPremPostgresDB=# select * from t1;
   ```

   ```output
    col1 |    col2
   ------+-------------
       1 | BobbyIsADog
   (1 row)
   ```

> [!NOTE]
> - You will not see so much performance benefits of running on Azure Arc enabled PostgreSQL Hyperscale until you scale out and you shard/distribute the data across the worker nodes of your PostgreSQL Hyperscale server group. See [Next steps](#next-steps).
>
> - It is not possible today to "onboard into Azure Arc" an existing Postgres instance that would running on premises or in any other cloud. In other words, it is not possible to install some sort of "Azure Arc agent" on your existing Postgres instance to make it a Postgres setup enabled by Azure Arc. Instead, you need to create a new Postgres instance and transfer data into it. You may use the technique shown above to do this or you may use any ETL tool of your choice.

## Next steps

- Read the concepts and How-to guides of Azure Database for PostgreSQL Hyperscale to distribute your data across multiple PostgreSQL Hyperscale nodes and to benefit from all the power of Azure Database for PostgreSQL Hyperscale:
    * [Nodes and tables](../../postgresql/concepts-hyperscale-nodes.md)
    * [Determine application type](../../postgresql/concepts-hyperscale-app-type.md)
    * [Choose a distribution column](../../postgresql/concepts-hyperscale-choose-distribution-column.md)
    * [Table colocation](../../postgresql/concepts-hyperscale-colocation.md)
    * [Distribute and modify tables](../../postgresql/howto-hyperscale-modify-distributed-tables.md)
    * [Design a multi-tenant database](../../postgresql/tutorial-design-database-hyperscale-multi-tenant.md)*
    * [Design a real-time analytics dashboard](../../postgresql/tutorial-design-database-hyperscale-realtime.md)*

> *In these documents, skip the sections **Sign in to the Azure portal**, and **Create an Azure Database for Postgres - Hyperscale (Citus)**. Implement the remaining steps in your Azure Arc deployment. Those sections are specific to the Azure Database for PostgreSQL Hyperscale (Citus) offered as a PaaS service in the Azure cloud but the other parts of the documents are directly applicable to your Azure Arc enabled PostgreSQL Hyperscale.

- [Scale out your Azure Database for PostgreSQL Hyperscale server group](scale-out-postgresql-hyperscale-server-group.md)

---
title: Use PostgreSQL extensions
description: Use PostgreSQL extensions
titleSuffix: Azure Arc-enabled data services
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data-postgresql
author: dhanmm
ms.author: dhmahaja
ms.reviewer: mikeray
ms.date: 11/03/2021
ms.topic: how-to
---

# Use PostgreSQL extensions in your Azure Arc-enabled PostgreSQL server

PostgreSQL is at its best when you use it with extensions.

[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]

## Supported extensions
The following extensions are deployed by default in the containers of your Azure Arc-enabled PostgreSQL server, some of them are standard [`contrib`](https://www.postgresql.org/docs/14/contrib.html) extensions:
- `address_standardizer_data_us` 3.3.1
- `adminpack` 2.1
- `amcheck` 1.3
- `autoinc` 1
- `bloom` 1
- `btree_gin` 1.3
- `btree_gist` 1.6
- `citext` 1.6
- `cube` 1.5
- `dblink` 1.2
- `dict_int` 1
- `dict_xsyn` 1
- `earthdistance` 1.1
- `file_fdw` 1
- `fuzzystrmatch` 1.1
- `hstore` 1.8
- `hypopg` 1.3.1
- `insert_username` 1
- `intagg` 1.1
- `intarray` 1.5
- `isn` 1.2
- `lo` 1.1
- `ltree` 1.2
- `moddatetime` 1
- `old_snapshot` 1
- `orafce` 4
- `pageinspect` 1.9
- `pg_buffercache` 1.3
- `pg_cron` 1.4-1
- `pg_freespacemap` 1.2
- `pg_partman` 4.7.1
- `pg_prewarm` 1.2
- `pg_repack` 1.4.8
- `pg_stat_statements` 1.9
- `pg_surgery` 1
- `pg_trgm` 1.6
- `pg_visibility` 1.2
- `pgaudit` 1.7
- `pgcrypto` 1.3
- `pglogical` 2.4.2
- `pglogical_origin` 1.0.0
- `pgrouting` 3.4.1
- `pgrowlocks` 1.2
- `pgstattuple` 1.5
- `plpgsql` 1
- `postgis` 3.3.1
- `postgis_raster` 3.3.1
- `postgis_tiger_geocoder` 3.3.1
- `postgis_topology` 3.3.1
- `postgres_fdw` 1.1
- `refint` 1
- `seg` 1.4
- `sslinfo` 1.2
- `tablefunc` 1
- `tcn` 1
- `timescaledb` 2.8.1
- `tsm_system_rows` 1
- `tsm_system_time` 1
- `unaccent` 1.1

Updates to this list will be posted as it evolves over time.

## Enable extensions in Arc-enabled PostgreSQL server
You can create an Arc-enabled PostgreSQL server with any of the supported extensions enabled by passing a comma separated list of extensions to the `--extensions` parameter of the `create` command. 

```azurecli
az postgres server-arc create -n <name> --k8s-namespace <namespace> --extensions "pgaudit,pg_partman" --use-k8s
```
*NOTE*: Enabled extensions are added to the configuration ``shared_preload_libraries``. Extensions must be installed in your database before you can use it. To install a particular extension, you should run the [`CREATE EXTENSION`](https://www.postgresql.org/docs/current/sql-createextension.html) command. This command loads the packaged objects into your database.

For example, connect to your database and issue the following PostgreSQL command to install pgaudit extension:

```SQL
CREATE EXTENSION pgaudit;
```

## Update extensions
You can add or remove extensions from an existing Arc-enabled PostgreSQL server.

You can run the kubectl describe command to get the current list of enabled extensions:
```console
kubectl describe postgresqls <server-name> -n <namespace>
```
If there are extensions enabled the output contains a section like this:
```yml
  config:
    postgreSqlExtensions: pgaudit,pg_partman
```

Check whether the extension is installed after connecting to the database by running following PostgreSQL command:
```SQL
select * from pg_extension;
```

Enable new extensions by appending them to the existing list, or remove extensions by removing them from the existing list. Pass the desired list to the update command. For example, to add `pgcrypto` and remove `pg_partman` from the server in the example above:

```azurecli
az postgres server-arc update -n <name> --k8s-namespace <namespace> --extensions "pgaudit,pgrypto" --use-k8s
```

Once allowed extensions list is updated. Connect to the database and install newly added extension by the following command:

```SQL
CREATE EXTENSION pgcrypto;
```

Similarly, to remove an extension from an existing database issue the command [`DROP EXTENSION`](https://www.postgresql.org/docs/current/sql-dropextension.html) :

```SQL
DROP EXTENSION pg_partman;
```

## Show the list of installed extensions
Connect to your database with the client tool of your choice and run the standard PostgreSQL query:
```SQL
select * from pg_extension;
```

## Related content
- **Try it out.** Get started quickly with [Azure Arc Jumpstart](https://github.com/microsoft/azure_arc#azure-arc-enabled-data-services) on Azure Kubernetes Service (AKS), AWS Elastic Kubernetes Service (EKS), Google Cloud Kubernetes Engine (GKE) or in an Azure VM. 
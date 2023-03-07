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
For this preview, the following standard [`contrib`](https://www.postgresql.org/docs/14/contrib.html) extensions are already deployed in the containers of your Azure Arc-enabled PostgreSQL server:
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

## Create an Arc-enabled PostgreSQL server with extensions enabled
You can create an Arc-enabled PostgreSQL server with any of the supported extensions enabled by passing a comma separated list of extensions to the `--extensions` parameter of the `create` command. *NOTE:* Extensions are enabled on the database for the admin user that was supplied when the server was created:
```azurecli
az postgres server-arc create -n <name> --k8s-namespace <namespace> --extensions "pgaudit,pg_partman" --use-k8s
```

## Add or remove extensions
You can add or remove extensions from an existing Arc-enabled PostgreSQL server.

First describe the server to get the current list of extensions:
```console
kubectl describe postgresqls <server-name> -n <namespace>
```
If there are extensions enabled the output contains a section like this:
```yml
  config:
    postgreSqlExtensions: pgaudit,pg_partman
```
Add new extensions by appending them to the existing list, or remove extensions by removing them from the existing list. Pass the desired list to the update command. For example, to add `pgcrypto` and remove `pg_partman` from the server in the example above:
```azurecli
az postgres server-arc update -n <name> --k8s-namespace <namespace> --extensions "pgaudit,pgrypto" --use-k8s
```

## Show the list of enabled extensions
Connect to your server with the client tool of your choice and run the standard PostgreSQL query:
```console
select * from pg_extension;
```

## Next steps
- **Try it out.** Get started quickly with [Azure Arc Jumpstart](https://github.com/microsoft/azure_arc#azure-arc-enabled-data-services) on Azure Kubernetes Service (AKS), AWS Elastic Kubernetes Service (EKS), Google Cloud Kubernetes Engine (GKE) or in an Azure VM. 
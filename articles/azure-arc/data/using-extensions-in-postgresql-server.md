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
- adminpack
- amcheck
- autoinc
- bloombtree_gin
- btree_gist
- citext
- cube
- dblink
- dict_int
- dict_xsyn
- earthdistance
- file_fdw
- fuzzystrmatch
- hstore
- insert_username
- intagg
- intarray
- isn
- lo
- ltree
- moddatetime
- old_snapshot
- pageinspect
- pg_buffercache
- pg_freespacemap
- pg_prewarm
- pg_stat_statements
- pg_surgery
- pg_trgm
- pg_visibility
- pgcrypto
- pgrowlocks
- pgstattuple
- postgres_fdw
- refint
- seg
- sslinfo
- tablefunc
- tcn
- tsm_system_rows
- tsm_system_time
- unaccent
- xml2

Updates to this list will be posted as it evolves over time.

> [!IMPORTANT]
> While you may bring to your server an extension other than those listed above, in this Preview, it will not be persisted to your system. It means that it will not be available after a restart of the system and you would need to bring it again.


## Create extensions
Connect to your server with the client tool of your choice and run the standard PostgreSQL query:
```console
CREATE EXTENSION <extension name>;
```

## Show the list of extensions created
Connect to your server with the client tool of your choice and run the standard PostgreSQL query:
```console
select * from pg_extension;
```

## Drop an extension
Connect to your server with the client tool of your choice and run the standard PostgreSQL query:
```console
drop extension <extension name>;
```

## Next steps
- **Try it out.** Get started quickly with [Azure Arc Jumpstart](https://github.com/microsoft/azure_arc#azure-arc-enabled-data-services) on Azure Kubernetes Service (AKS), AWS Elastic Kubernetes Service (EKS), Google Cloud Kubernetes Engine (GKE) or in an Azure VM. 
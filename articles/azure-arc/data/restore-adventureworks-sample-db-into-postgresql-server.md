---
title: Import the AdventureWorks sample database to Azure Arc-enabled PostgreSQL server
description: Restore the AdventureWorks sample database to Azure Arc-enabled PostgreSQL server
ms.service: azure-arc
ms.subservice: azure-arc-data-postgresql
author: dhanmm
ms.author: dhmahaja
ms.reviewer: mikeray
ms.date: 06/02/2021
ms.topic: how-to
---

# Import the AdventureWorks sample database to Azure Arc-enabled PostgreSQL server

[AdventureWorks](/sql/samples/adventureworks-install-configure) is a sample database containing an OLTP database used in tutorials, and examples. It's provided and maintained by Microsoft as part of the [SQL Server samples GitHub repository](https://github.com/microsoft/sql-server-samples/tree/master/samples/databases).

An open-source project has converted the AdventureWorks database to be compatible with Azure Arc-enabled PostgreSQL server.
- [Original project](https://github.com/lorint/AdventureWorks-for-Postgres)
- [Follow on project that pre-converts the CSV files to be compatible with PostgreSQL](https://github.com/NorfolkDataSci/adventure-works-postgres)

This document describes a simple process to get the AdventureWorks sample database imported into your Azure Arc-enabled PostgreSQL server.

[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]

## Download the AdventureWorks backup file

Download the AdventureWorks .sql file into your PostgreSQL server container. In this example, we'll use the `kubectl exec` command to remotely execute a command in the PostgreSQL server container to download the file into the container. You could download this file from any location accessible by `curl`. Use this same method if you have other database back up files you want to pull in the PostgreSQL server container. Once it's in the PostgreSQL server container, it's easy to create the database, schema, and populate the data.

Run a command like this to download the files replace the value of the pod name and namespace name before you run it:

> [!NOTE]
>  Your container will need to have Internet connectivity over 443 to download the file from GitHub.

> [!NOTE]
>  Use the pod name of the Coordinator node of the PostgreSQL server. Its name is \<server group name\>c-0 (for example postgres01c-0, where c stands for Coordinator node).  If you are not sure of the pod name run the command `kubectl get pod`

```console
kubectl exec <PostgreSQL pod name> -n <namespace name> -c postgres  -- /bin/bash -c "cd /tmp && curl -k -O https://raw.githubusercontent.com/microsoft/azure_arc/main/azure_arc_data_jumpstart/cluster_api/capi_azure/arm_template/artifacts/AdventureWorks2019.sql"

#Example:
#kubectl exec postgres02-0 -n arc -c postgres -- /bin/bash -c "cd /tmp && curl -k -O hthttps://raw.githubusercontent.com/microsoft/azure_arc/main/azure_arc_data_jumpstart/cluster_api/capi_azure/arm_template/artifacts/AdventureWorks2019.sql"
```

## Import the AdventureWorks database

Similarly, you can run a kubectl exec command to use the psql CLI tool that is included in the PostgreSQL server containers to create and load the database.

Run a command like this to create the empty database first substituting the value of the pod name and the namespace name before you run it.

```console
kubectl exec <PostgreSQL pod name> -n <namespace name> -c postgres -- psql --username postgres -c 'CREATE DATABASE "adventureworks";'

#Example
#kubectl exec postgres02-0 -n arc -c postgres -- psql --username postgres -c 'CREATE DATABASE "adventureworks";'
```

Then, run a command like this to import the database substituting the value of the pod name and the namespace name before you run it.

```console
kubectl exec <PostgreSQL pod name> -n <namespace name> -c postgres -- psql --username postgres -d adventureworks -f /tmp/AdventureWorks.sql

#Example
#kubectl exec postgres02-0 -n arc -c postgres -- psql --username postgres -d adventureworks -f /tmp/AdventureWorks.sql
```


## Suggested next steps
- Read the concepts and How-to guides of Azure Database for PostgreSQL to distribute your data across multiple PostgreSQL server nodes and to benefit from all the power of Azure Database for PostgreSQL. :
    * [Nodes and tables](../../postgresql/hyperscale/concepts-nodes.md)
    * [Determine application type](../../postgresql/hyperscale/howto-app-type.md)
    * [Choose a distribution column](../../postgresql/hyperscale/howto-choose-distribution-column.md)
    * [Table colocation](../../postgresql/hyperscale/concepts-colocation.md)
    * [Distribute and modify tables](../../postgresql/hyperscale/howto-modify-distributed-tables.md)
    * [Design a multi-tenant database](../../postgresql/hyperscale/tutorial-design-database-multi-tenant.md)*
    * [Design a real-time analytics dashboard](../../postgresql/hyperscale/tutorial-design-database-realtime.md)*

   > \* In the documents above, skip the sections **Sign in to the Azure portal**, & **Create an Azure Database for PostgreSQL**. Implement the remaining steps in your Azure Arc deployment. Those sections are specific to the Azure Database for PostgreSQL server offered as a PaaS service in the Azure cloud but the other parts of the documents are directly applicable to your Azure Arc-enabled PostgreSQL server.


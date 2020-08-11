---
title: Scaling out from Azure Database for Postgres single node instance to Azure Database for PostgreSQL Hyperscale server group
description: Scaling out from Azure Database for Postgres single node instance to Azure Database for PostgreSQL Hyperscale server group
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
ms.date: 08/04/2020
ms.topic: how-to
---

# Scenario: Scaling out from Azure Database for Postgres single node instance to Azure Database for PostgreSQL Hyperscale server group

These instructions utilize the PostgreSQL single node instance that was [provisioned in an earlier guide](https://github.com/microsoft/Azure-data-services-on-Azure-Arc/blob/jul-2020/scenarios/004-create-Postgres-instances.md#create-a-azure-database-for-postgresql-instance-single-node-not-hyperscale).

## Morphing from single node instance to Hyperscale

To transform your single node Azure Database for Postgres single node instance into an Azure Database for Postgres Hyperscale server group (enabled with the Citus extension) update the definition of your single node instance and expand it to the desired target number of nodes using the -w parameter.
For example:

### Expand from single node to Hyperscale

Run the following command to expand to 2 worker nodes:

```terminal
azdata postgres server edit -n postgres02 -w 2
```

As you see, now, Kubernetes is using 3 pods to host the server instance: one of the Citus Coordinator node and 2 for the Citus Worker nodes.

```terminal
kubectl get pods -A
NAMESPACE       NAME                                   READY   STATUS    RESTARTS   AGE
default         postgres02-0                           3/3     Running   0          10m
default         postgres02-1                           3/3     Running   0          46s
default         postgres02-2                           3/3     Running   0          46s
```

## Next

You now need to adjust the definition of your tables to distribute them across the new nodes. For further considerations about scaling out an Azure Database for Postgres Hyperscale server group please the [Scale out Postgres Hyperscale](https://github.com/microsoft/Azure-data-services-on-Azure-Arc/blob/jul-2020/scenarios/008-scale-out-Postgres-Hyperscale.md) scenario.

>**Note:** It is not yet possible to scale back from an Azure Database for Postgres Hyperscale server group to an Azure Database for Postgres single node. If you need to do so, you need extract your data, drop the server group, deploy a single node instance and import the data. If you need to scale back before you have distributed the data on multiple nodes, you can backup the database and restore it once you have deployed the single node instance.

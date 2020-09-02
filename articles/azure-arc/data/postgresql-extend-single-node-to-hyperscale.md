---
title: Scale out PostgreSQL single node instance to Hyperscale server group
description: Scaling out from Azure Database for PostgreSQL single node instance to PostgreSQL Hyperscale server group
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
ms.date: 08/04/2020
ms.topic: how-to
---

# Scale out from Azure Database for PostgreSQL single node instance

These instructions use the PostgreSQL single node instance that was created by following the steps in[Create an Azure Database for PostgreSQL Hyperscale server group on Azure Arc](create-postgresql-instances.md).

The Citus extension enables they Hyperscale server group. For more information, see [Nodes in Azure Database for PostgreSQL – Hyperscale (Citus)](../../postgresql/concepts-hyperscale-nodes.md). 

## Morph single node instance to Hyperscale

To transform your single node Azure Database for PostgreSQL single node instance into a Hyperscale server group, update the definition of your single node instance and expand it to the target number of nodes using the `-w` parameter.

### Expand from single node to Hyperscale

Run the following command to expand to two worker nodes:

```console
azdata postgres server edit -n postgres02 -w 2
```

The results below show, Kubernetes is using three pods to host the server instance. One for Citus Coordinator node, and two for the Citus Worker nodes.

```console
kubectl get pods -A
NAMESPACE       NAME                                   READY   STATUS    RESTARTS   AGE
default         postgres02-0                           3/3     Running   0          10m
default         postgres02-1                           3/3     Running   0          46s
default         postgres02-2                           3/3     Running   0          46s
```

## Next steps

Adjust the definition of your tables to distribute them across the new nodes. For further considerations, see [Scale out your Azure Database for PostgreSQL Hyperscale server group](scale-out-postgresql-hyperscale.md).

> [!NOTE]
> Azure Database for PostgreSQL Hyperscale on Azure Arc (preview) does not support scale back to an Azure Database for PostgreSQL single node. If you need to do so, extract your data, drop the server group, deploy a single node instance, and import the data. If you need to scale back before you have distributed the data on multiple nodes, you can back up the database and restore it to a single node instance.

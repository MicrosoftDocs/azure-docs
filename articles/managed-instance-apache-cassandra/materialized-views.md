---
title: Materialized views in Azure Managed Instance for Apache Cassandra
description: Learn how to enable materialized views in Azure Managed Instance for Apache Cassandra.
author: TheovanKraay
ms.author: thvankra
ms.service: managed-instance-apache-cassandra
ms.topic: how-to
ms.date: 02/15/2022
---

# Materialized views in Azure Managed Instance for Apache Cassandra

Azure Managed Instance for Apache Cassandra provides automated deployment and scaling operations for managed open-source Apache Cassandra data centers. This article discusses how to enable materialized views. 

## Materialized view support
Materialized views are disabled by default, but users can enable them on their cluster. However, we discourage users of Azure Managed Instance for Apache Cassandra from using materialized views. They are experimental (see
[Materialized Views marked experimental-Apache Mail Archives](https://lists.apache.org/thread/o5bk8xyxyl6k3sjf7kkblqw52gm5s9mp) and the [proposal to do so](https://www.mail-archive.com/dev@cassandra.apache.org/msg11516.html)). In particular:

- The implementation of materialized views is distributed system design that
  hasn’t been extensively modeled and simulated. There have been no formal
  proofs about its properties.
- There is no way to determine if a materialized view is out of sync with its
  base table.
- There is no upper bound on how long it takes for a materialized view to be
  synced when there is a change to its base table.
- If there is an error and a materialized view goes out of sync, the only way to
  repair it is to drop the materialized view and recreate it. 

Microsoft cannot offer any SLA or support on issues with materialized views.

## Alternatives to materialized views
Like most NoSQL stores, Apache Cassandra is not designed to have a normalized data model. If you need to update data in more than one place, your program should send all the necessary statements as part of a [BATCH](https://cassandra.apache.org/doc/latest/cassandra/cql/dml.html#batch_statement). This has two advantages over materialized views:

- BATCH guarantees that all statements in the batch are committed or none.
- All the statements have the same quorum and commit semantics.

If your workload truly needs a normalized data model, consider a scalable relational store like Azure's [Hyperscale PostgreSQL](../postgresql/hyperscale/index.yml).

## How to enable materialized views
You need to set `enable_materialized_views: true` in the `rawUserConfig` field of your Cassandra data center. To do so, use the following Azure CLI command to update each data center in your cluster:

```azurecli-interactive
FRAGMENT="enable_materialized_views: true"
ENCODED_FRAGMENT=$(echo "$FRAGMENT" | base64 -w 0)
# or
# ENCODED_FRAGMENT="ZW5hYmxlX21hdGVyaWFsaXplZF92aWV3czogdHJ1ZQo="
resourceGroupName='MyResourceGroup'
clusterName='cassandra-hybrid-cluster'
dataCenterName='dc1'
az managed-cassandra datacenter update \
    --resource-group $resourceGroupName \
	--cluster-name $clusterName \
	--data-center-name $dataCenterName \
	--base64-encoded-cassandra-yaml-fragment $ENCODED_FRAGMENT
```

## Next steps

* [Create a managed instance cluster from the Azure portal](create-cluster-portal.md)
* [Deploy a Managed Apache Spark Cluster with Azure Databricks](deploy-cluster-databricks.md)
* [Manage Azure Managed Instance for Apache Cassandra resources using Azure CLI](manage-resources-cli.md)

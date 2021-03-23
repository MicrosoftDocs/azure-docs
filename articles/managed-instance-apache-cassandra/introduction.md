---
title: Introduction to Azure Managed Instance for Apache Cassandra
description: Learn about Azure Managed Instance for Apache Cassandra. This service manages the deployment and scaling of native open-source instances of Apache Cassandra in Azure.
author: TheovanKraay
ms.author: thvankra
ms.service: managed-instance-apache-cassandra
ms.topic: overview
ms.date: 03/02/2021

---

# What is Azure Managed Instance for Apache Cassandra? (Preview)

> [!IMPORTANT]
> Azure Managed Instance for Apache Cassandra is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

The Azure Managed Instance for Apache Cassandra service provides automated deployment and scaling operations for managed open-source Apache Cassandra datacenters. This service helps you accelerate hybrid scenarios and reduce ongoing maintenance. It will have deep integration and data movement capabilities with [Azure Cosmos DB Cassandra API](../cosmos-db/cassandra-introduction.md) upon its general release.

:::image type="content" source="./media/introduction/icon.gif" alt-text="Azure Managed Instance for Apache Cassandra is a managed service for Apache Cassandra." border="false":::

## Key benefits

### Hybrid deployments

You can use this service to easily place managed instances of Apache Cassandra datacenters, which are deployed automatically as virtual machine scale sets, into a new or existing Azure Virtual Network. These data centers can be added to your existing Apache Cassandra ring running on-premises via [Azure ExpressRoute](/azure/architecture/reference-architectures/hybrid-networking/expressroute) in Azure, or another cloud environment.

- **Simplified deployment:** After the hybrid connectivity is established deployment is easy through the gossip protocol.
- **Hosted metrics:** The metrics are hosted in [Prometheus](https://prometheus.io/docs/introduction/overview/) to monitor activity across your cluster.

### Simplified scaling

In the managed instance, scaling up and scaling down nodes in a datacenter is fully managed. You enter the number of nodes you need, and the scaling orchestrator takes care of establishing their operation within the Cassandra ring.

### Managed and cost-effective

The service provides management operations for the following common Apache Cassandra tasks:

- Provision a cluster
- Provision a datacenter
- Scale a datacenter
- Delete a datacenter
- Start a repair action on a keyspace
- Change configuration of a datacenter
- Setup backups

The pricing model is flexible, on-demand, instance-based, and has no licensing fees. This pricing model allows you to adjust to your specific workload needs. You choose how many cores, which VM SKU, what memory size, and the disk space size you need.

## Next steps

Get started with one of our quickstarts:

* [Create a managed instance cluster from the Azure portal](create-cluster-portal.md)
* [Deploy a Managed Apache Spark Cluster with Azure Databricks](deploy-cluster-databricks.md)
* [Manage Azure Managed Instance for Apache Cassandra resources using Azure CLI](manage-resources-cli.md)

---
title: Introduction to Azure Managed Instance for Apache Cassandra
description: Learn about Azure Managed Instance for Apache Cassandra. This service manages the deployment and scaling of native open-source instances of Apache Cassandra in Azure.
author: TheovanKraay
ms.author: thvankra
ms.service: managed-instance-apache-cassandra
ms.topic: overview
ms.date: 11/02/2021
ms.custom: ignite-fall-2021
---

# What is Azure Managed Instance for Apache Cassandra?

The Azure Managed Instance for Apache Cassandra service provides automated deployment and scaling operations for managed open-source Apache Cassandra datacenters. This service helps you accelerate hybrid scenarios and reduce ongoing maintenance.

:::image type="content" source="./media/introduction/icon.gif" alt-text="Azure Managed Instance for Apache Cassandra is a managed service for Apache Cassandra." border="false":::

## Key benefits

### Hybrid deployments

You can use this service to easily place managed instances of Apache Cassandra datacenters, which are deployed automatically as virtual machine scale sets, into a new or existing Azure Virtual Network. These data centers can be added to your existing Apache Cassandra ring running on-premises via [Azure ExpressRoute](/azure/architecture/reference-architectures/hybrid-networking/expressroute) in Azure, or another cloud environment. This is achieved through [hybrid configuration](configure-hybrid-cluster.md).

- **Simplified deployment:** After the hybrid connectivity is established, deployment of new data centers in Azure is easy through [simple commands](manage-resources-cli.md#create-datacenter).
- **Metrics:** each datacenter node provisioned by the service emits metrics using [Metric Collector for Apache Cassandra](https://github.com/datastax/metric-collector-for-apache-cassandra). The metrics can be [visualized in Prometheus or Grafana](visualize-prometheus-grafana.md). The service is also integrated with [Azure Monitor for metrics and diagnostic logging](monitor-clusters.md).

>[!NOTE]
> The service currently supports Cassandra versions 3.11 and 4.0. Both versions are GA. See our [Azure CLI Quickstart](create-cluster-cli.md) (step 5) for specifying Cassandra version during cluster deployment.

### Simplified scaling

In the managed instance, scaling up and scaling down nodes in a datacenter is fully managed. You select the number of nodes you need, and with a [simple command](manage-resources-cli.md#update-datacenter), the scaling orchestrator takes care of establishing their operation within the Cassandra ring.

### Managed and cost-effective

The service provides [management operations](management-operations.md) for the following common Apache Cassandra tasks:

- Provision a cluster
- Provision a datacenter
- Scale a datacenter
- Delete a datacenter
- Change configuration of a datacenter
- Nodetool repair
- Node health monitoring
- Virtual Machine health monitoring
- Operating system patching
- Apache Cassandra patching
- Vulnerability and virus scanning
- Certificate rotation
- Snapshot backups

The pricing model is flexible, on-demand, instance-based, and has no licensing fees. This pricing model allows you to adjust to your specific workload needs. You choose how many cores, which VM SKU, what memory size, and the number of P30 disks per node.

## Next steps

Get started with one of our quickstarts:

* [Create a managed instance cluster from the Azure portal](create-cluster-portal.md)
* [Deploy a Managed Apache Spark Cluster with Azure Databricks](deploy-cluster-databricks.md)
* [Manage Azure Managed Instance for Apache Cassandra resources using Azure CLI](manage-resources-cli.md)

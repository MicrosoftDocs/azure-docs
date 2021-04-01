---
title: Frequently asked questions about Azure Managed Instance for Apache Cassandra from the Azure portal
description:  Frequently asked questions about Azure Managed Instance for Apache Cassandra. This article addresses questions on when to use managed instances, benefits, throughput limits, supported regions, and other configuration details. 
author: TheovanKraay
ms.author: thvankra
ms.service: managed-instance-apache-cassandra
ms.topic: quickstart
ms.date: 03/02/2021
---
# Frequently asked questions about Azure Managed Instance for Apache Cassandra (Preview)

This article addresses frequently asked questions about Azure Managed Instance for Apache Cassandra. You will learn when to use managed instances, their benefits, throughput limits, supported regions, and their configuration details.

> [!IMPORTANT]
> Azure Managed Instance for Apache Cassandra is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## General FAQ

### What are the benefits Azure Managed Instance for Apache Cassandra?

The Apache Cassandra database is the right choice when you need scalability and high availability without compromising performance. It's a great platform for mission-critical data due to the linear scalability and proven fault-tolerance on commodity hardware or cloud infrastructure. Azure Managed Instance for Apache Cassandra is a service to manage instances of open-source Apache Cassandra datacenters deployed in Azure.

It can be used either entirely in the cloud or as a part of a hybrid cloud and on-premises cluster. This service is a great choice when you want fine-grained configuration and control you have in open-source Apache Cassandra, without any maintenance overhead.

### Why should I use this service instead of Azure Cosmos DB Cassandra API?

Azure Managed Instance for Apache Cassandra is delivered by the Azure Cosmos DB team. It is a standalone managed service for deploying, maintaining, and scaling open-source Apache Cassandra data-centers and clusters. [Azure Cosmos DB Cassandra API](../cosmos-db/cassandra-introduction.md) on the other hand is a Platform-as-a-Service, providing an interoperability layer for the Apache Cassandra wire protocol. If your expectation is for the platform to behave in exactly the same way as any Apache Cassandra cluster, you should choose the managed instance service. To learn more, see the [Azure Managed Instance for Apache Cassandra Vs Azure Cosmos DB Cassandra API](compare-cosmosdb-managed-instance.md) article.

### Is Azure Managed Instance for Apache Cassandra dependent on Azure Cosmos DB?

No, there is no architectural dependency between Azure Managed Instance for Apache Cassandra and the Azure Cosmos DB backend. 

#### Can I deploy Azure Managed Instance for Apache Cassandra in any region?

The managed instance will be available in a limited number of regions during preview.

### What are the storage and throughput limits of Azure Managed Instance for Apache Cassandra?

These limits depend on the Virtual Machine SKUs you choose.

### What is the cost of Azure Managed Instance for Apache Cassandra?

The managed instance charges are based on the underlying VM cost, with a small markup. For more information, see the [pricing page](https://azure.microsoft.com/pricing/details/managed-instance-apache-cassandra/).

### Can I use YAML file settings to configure behavior?

Yes, you can embed YAML file configurations as part of an Azure Resource Manager template deployment.

### How can I monitor infrastructure along with throughput?

The [Prometheus](https://prometheus.io/docs/introduction/overview/) server is hosted to monitor activity across your cluster, and it exposes an endpoint. This maintains 10 minutes or 10 GB of data (whichever threshold is reaches first). To use this monitoring, you need to set up a [federation](https://prometheus.io/docs/prometheus/latest/federation/) and an appropriate dashboard tool such as Grafana.

### Does Azure Managed Instance for Apache Cassandra provide full backups?

Yes, it provides full backups to Azure Storage and restores to a new cluster

### How can I migrate data from my existing Apache Cassandra cluster to Azure Managed Instance for Apache Cassandra?

Azure Managed Instance for Apache Cassandra supports all of the features in Apache Cassandra to replicate and stream data between data-centers.

### Can I pair an on-premises Apache Cassandra cluster with the Azure Managed Instance for Apache Cassandra?

Yes, you can configure a hybrid cluster with Azure Virtual Network injected data-centers deployed by the service. Managed Instance data-centers can communicate with on-premise data-centers within the same cluster ring.

### Where can I give feedback on Azure Managed Instance for Apache Cassandra features?

Provide feedback via [user voice feedback](https://feedback.azure.com/forums/263030-azure-cosmos-db?category_id=398548) using the category "Managed Apache Cassandra".

To fix an issue with your account, file a [support request](https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest) in the Azure portal.

## Deployment-specific FAQ

### Will the managed instance support node addition, cluster status, and node status commands?

All the *read-only* Nodetool commands such as `status` are available through Azure CLI. However, operations such as *node addition* are not available, because we manage the health of nodes in the managed instance. In the Hybrid mode, you can connect to the cluster with *Nodetool*. However, using Nodetool is not recommended, as it could destabilize the cluster. It may also invalidate any production support SLA relating to the health of the managed instance datacenters in the cluster.

### What happens with various settings for table metadata?

The settings for table metadata such as bloom filter, caching, read repair chance, gc_grace, and compression memtable_flush_period are fully supported as with any self-hosted Apache Cassandra environment.

## Next steps

To learn about frequently asked questions in other APIs, see:

* [Create a managed instance cluster from the Azure portal](create-cluster-portal.md)
* [Deploy a Managed Apache Spark Cluster with Azure Databricks](deploy-cluster-databricks.md)
* [Manage Azure Managed Instance for Apache Cassandra resources using Azure CLI](manage-resources-cli.md)
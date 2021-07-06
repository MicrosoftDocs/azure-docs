---
title: Differences between Azure Managed Instance for Apache Cassandra and Azure Cosmos DB Cassandra API
description: Learn about the differences between Azure Managed Instance for Apache Cassandra and Cassandra API in Azure Cosmos DB. You also learn the benefits of each of these services and when to choose them.
author: TheovanKraay
ms.author: thvankra
ms.service: managed-instance-apache-cassandra
ms.topic: quickstart
ms.date: 03/02/2021
---

# Differences between Azure Managed Instance for Apache Cassandra (Preview) and Azure Cosmos DB Cassandra API 

In this article, you will learn the differences between Azure Managed Instance for Apache Cassandra and the Cassandra API in Azure Cosmos DB. This article provides recommendations on how to choose between the two services, or when to host your own Apache Cassandra environment.

> [!IMPORTANT]
> Azure Managed Instance for Apache Cassandra is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Key differences

Azure Managed Instance for Apache Cassandra provides automated deployment, scaling, and operations to maintain the node health for open-source Apache Cassandra instances in Azure. It also provides the capability to scale out the capacity of existing on-premises or cloud self-hosted Apache Cassandra clusters. It scales out by adding managed Cassandra datacenters to the existing cluster ring.

The [Cassandra API](../cosmos-db/cassandra-introduction.md) in Azure Cosmos DB is a compatibility layer over Microsoft's globally distributed cloud-native database service [Azure Cosmos DB](../cosmos-db/index.yml). The combination of these services in Azure provides a continuum of choices for users of Apache Cassandra in complex hybrid cloud environments.

## How to choose?

The following table shows the common scenarios, workload requirements, and aspirations where each of this deployment approaches fit:

| |Self-hosted Apache Cassandra on-premises or in Azure | Azure Managed Instance for Apache Cassandra | Azure Cosmos DB Cassandra API |
|---------|---------|---------|---------|
|**Deployment type**| You have a highly customized Apache Cassandra deployment with custom patches or snitches. | You have a standard open-source Apache Cassandra deployment without any custom code. | You are content with a platform that is not Apache Cassandra underneath but is compliant with all open-source client drivers at a [wire protocol](../cosmos-db/cassandra-support.md) level. |
| **Operational overhead**| You have existing Cassandra experts who can deploy, configure, and maintain your clusters.  | You want to lower the operational overhead for your Apache Cassandra node health, but still maintain control over the platform level configurations such as replication and consistency. | You want to eliminate the operational overhead by using a fully managed Platform-as-as-service database in the cloud. |
| **Operating system requirements**| You have a requirement to maintain custom or golden Virtual Machine operating system images. | You can use vanilla images but want to have control over SKUs, memory, disks, and IOPS. | You want capacity provisioning to be simplified and expressed as a single normalized metric, with a one-to-one relationship to throughput, such as [request units](../cosmos-db/request-units.md) in Azure Cosmos DB. |
| **Pricing model**| You want to use management software such as Datastax tooling and are happy with licensing costs. | You prefer pure open-source licensing and VM instance-based pricing. | You want to use cloud-native pricing, which includes [autoscale](../cosmos-db/manage-scale-cassandra.md#use-autoscale) and [serverless](../cosmos-db/serverless.md) offers. |
| **Analytics**| You want full control over the provisioning of analytical pipelines regardless of the overhead to build and maintain them. | You want to use cloud-based analytical services like Azure Databricks. | You want near real-time hybrid transactional analytics built into the platform with [Azure Synapse Link for Cosmos DB](../cosmos-db/synapse-link.md). |
| **Workload pattern**| Your workload is fairly steady-state and you don't require scaling nodes in the cluster frequently. | Your workload is volatile and you need to be able to scale up or scale down nodes in a data center or add/remove data centers easily. | Your workload is often volatile and you need to be able to scale up or scale down quickly and at a significant volume. |
| **SLAs**| You are happy with your processes for maintaining SLAs on consistency, throughput, availability, and disaster recovery. | You are happy with your processes for maintaining SLAs on consistency, throughput, and availability, but need help with backups. | You want fully comprehensive SLAs on consistency, throughput, availability, and disaster recovery. |

## Next steps

Get started with one of our quickstarts:

* [Create a managed instance cluster from the Azure portal](create-cluster-portal.md)
---
title: Differences between Azure Managed Instance for Apache Cassandra and Azure Cosmos DB for Apache Cassandra
description: Learn about the differences between Azure Managed Instance for Apache Cassandra and Azure Cosmos DB for Apache Cassandra. You also learn the benefits of each of these services and when to choose them.
author: TheovanKraay
ms.author: thvankra
ms.service: managed-instance-apache-cassandra
ms.topic: quickstart
ms.date: 12/10/2021
ms.custom: ignite-fall-2021, mode-api, ignite-2022
---

# Differences between Azure Managed Instance for Apache Cassandra and Azure Cosmos DB for Apache Cassandra 

In this article, you will learn the differences between Azure Managed Instance for Apache Cassandra and Azure Cosmos DB for Apache Cassandra. This article provides recommendations on how to choose between the two services, or when to host your own Apache Cassandra environment.

## Key differences

Azure Managed Instance for Apache Cassandra provides automated deployment, scaling, and operations to maintain the node health for open-source Apache Cassandra instances in Azure. It also provides the capability to scale out the capacity of existing on-premises or cloud self-hosted Apache Cassandra clusters. It scales out by adding managed Cassandra datacenters to the existing cluster ring.

The [Azure Cosmos DB for Apache Cassandra](../cosmos-db/cassandra-introduction.md) in Azure Cosmos DB is a compatibility layer over Microsoft's globally distributed cloud-native database service [Azure Cosmos DB](../cosmos-db/index.yml). The combination of these services in Azure provides a continuum of choices for users of Apache Cassandra in complex hybrid cloud environments.

## How to choose?

The following table shows the common scenarios, workload requirements, and aspirations where each of this deployment approaches fit:

| |Self-hosted Apache Cassandra on-premises or in Azure | Azure Managed Instance for Apache Cassandra | Azure Cosmos DB for Apache Cassandra |
|---------|---------|---------|---------|
|**Deployment type**| You have a highly customized Apache Cassandra deployment with custom patches or snitches. | You have a standard open-source Apache Cassandra deployment without any custom code. | You are content with a platform that is not Apache Cassandra underneath but is compliant with all open-source client drivers at a [wire protocol](../cosmos-db/cassandra-support.md) level. |
| **Operational overhead**| You have existing Cassandra experts who can deploy, configure, and maintain your clusters.  | You want to lower the operational overhead for your Apache Cassandra node health, but still maintain control over the platform level configurations such as replication and consistency. | You want to eliminate the operational overhead by using a fully managed Platform-as-as-service database in the cloud. |
| **Operating system requirements**| You have a requirement to maintain custom or golden Virtual Machine operating system images. | You can use vanilla images but want to have control over SKUs, memory, disks, and IOPS. | You want capacity provisioning to be simplified and expressed as a single normalized metric, with a one-to-one relationship to throughput, such as [request units](../cosmos-db/request-units.md) in Azure Cosmos DB. |
| **Pricing model**| You want to use management software such as Datastax tooling and are happy with licensing costs. | You prefer pure open-source licensing and VM instance-based pricing. | You want to use cloud-native pricing, which includes [autoscale](../cosmos-db/manage-scale-cassandra.md#use-autoscale) and [serverless](../cosmos-db/serverless.md) offers. |
| **Analytics**| You want full control over the provisioning of analytical pipelines regardless of the overhead to build and maintain them. | You want to use cloud-based analytical services like Azure Databricks. | You want near real-time hybrid transactional analytics built into the platform with [Azure Synapse Link for Azure Cosmos DB](../cosmos-db/synapse-link.md). |
| **Workload pattern**| Your workload is fairly steady-state and you don't require scaling nodes in the cluster frequently. | Your workload is volatile and you need to be able to scale up or scale down nodes in a data center or add/remove data centers easily. | Your workload is often volatile and you need to be able to scale up or scale down quickly and at a significant volume. |
| **SLAs**| You are happy with your processes for maintaining SLAs on consistency, throughput, availability, and disaster recovery. | You are happy with your processes for maintaining SLAs on consistency and throughput, but want an [SLA for availability](https://azure.microsoft.com/support/legal/sla/managed-instance-apache-cassandra/v1_0/), and need [help with backups](management-operations.md#backup-and-restore). | You want [fully comprehensive SLAs](https://azure.microsoft.com/support/legal/sla/cosmos-db/v1_4/) on consistency, throughput, availability, and disaster recovery. |
| **Replication and consistency**| You need to be able to configure the full array of [tunable consistency settings](https://cassandra.apache.org/doc/latest/cassandra/architecture/dynamo.html#tunable-consistency) available in Apache Cassandra for the read and write path. | You need to be able to configure the full array of [tunable consistency settings](https://cassandra.apache.org/doc/latest/cassandra/architecture/dynamo.html#tunable-consistency) available in Apache Cassandra for the read and write path. | A read path consistency of either ONE (eventual) or ALL (strong) is sufficient for all your applications (see also [mapping Cassandra consistency levels](../cosmos-db/cassandra/consistency-mapping.md)) |
| **Data model**| You are migrating workloads which have a mixture of uniform distribution of data, and skewed data (with respect to both storage and throughput across partition keys) requiring flexibility on vertical scale of nodes. | You are migrating workloads which have a mixture of uniform distribution of data, and skewed data (with respect to both storage and throughput across partition keys) requiring flexibility on vertical scale of nodes. | You are building a new application, or your existing application has a relatively uniform distribution of data with respect to both storage and throughput across partition keys. |

## Next steps

Get started with one of our quickstarts:

* [Create a managed instance cluster from the Azure portal](create-cluster-portal.md)

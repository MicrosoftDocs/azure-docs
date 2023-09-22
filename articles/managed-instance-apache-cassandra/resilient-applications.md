---
title: Building resilient applications
titleSuffix: Azure Managed Instance for Apache Cassandra
description: Learn about best practices for high availability and disaster recovery for Azure Managed Instance for Apache Cassandra
author: TheovanKraay
ms.service: managed-instance-apache-cassandra
ms.topic: conceptual
ms.date: 09/21/2023
ms.author: thvankra
keywords: azure high availability disaster recovery cassandra resiliency
---

# Best practices for high availability and disaster recovery

Azure Managed Instance for Apache Cassandra provides automated deployment and scaling operations for managed open-source Apache Cassandra datacenters. Apache Cassandra is a great choice for building highly resilient applications due to it's distributed nature and masterless architecture – any node in the database can provide the exact same functionality as any other node – contributing to Cassandra’s robustness and resilience. This article provides tips on how to optimize high availability and how to approach disaster recover.

## Multi-region redundancy 

Cassandra's masterless architecture brings fault tolerance from the ground up, and Azure Managed Instance for Apache Cassandra provides support for [availability zones](../availability-zones/az-overview.md#azure-regions-with-availability-zones) in selected regions to enhance resiliency at the infrastructure level. However, it's important to consider the impact of regional outages for your applications. We highly recommend deploying [multi region clusters](create-multi-region-cluster.md) to safeguard against region level outages. 

If your users are spread across many geo locations, a multi-region deployment has the added benefit of reducing latency, since all nodes in all data centers across the cluster can serve then serve both reads and rights from a region that is closest to them. However, if the application is configured to be "active-active", it's important to consider how [CAP theorem](https://cassandra.apache.org/doc/latest/cassandra/architecture/guarantees.html#what-is-cap) applies to the consistency of your data between replicas (nodes), and the trade-offs required to delivery high availability. 

In CAP theorem terms, Cassandra is by default an AP (Available Partition-tolerant) database system, with highly [tunable consistency](https://cassandra.apache.org/doc/4.1/cassandra/architecture/dynamo.html#tunable-consistency). For most use cases, we recommend using local_quorum for reads. 

- In active-passive for writes there's a trade-off between reliability and performance: for reliability we recommend QUORUM_EACH but for most users LOCAL_QUORUM or QUORUM is a good compromise. Note however that in the case of a regional outage, some writes might be lost in LOCAL_QUORUM. 
- In the case of an application being run in parallel QUORUM_EACH writes are preferred for most cases to ensure consistency between the two data centers.


## Balancing the cost of disaster recovery

If your application is "active-passive", we still generally recommend that you deploy the same capacity in each region so that your application can fail over instantly to a "hot standby" data center in a secondary region. This ensures no performance degradation in the case of a regional outage. Most Cassandra [client drivers](https://cassandra.apache.org/doc/latest/cassandra/getting_started/drivers.html) provide options to initiate application level failover. By default, they assume regional outage means that the application is also down, in which case failover should happen at the load balancer level. 

However, to reduce the cost of provisioning a second data center, you may prefer to deploy a smaller SKU, and fewer nodes, in your secondary region. When an outage occurs, scaling up is made easier in Azure Managed Instance for Apache Cassandra by [turnkey vertical and horizontal scaling](create-cluster-portal.md#scale-a-datacenter). While your applications failover to your secondary region, you can manually [scale out](create-cluster-portal.md#horizontal-scale) and [scale up](create-cluster-portal.md#vertical-scale) the nodes in your secondary data center. In this case, your secondary data center acts as a lower cost warm standby. Taking this approach would need to be balanced against the time required to restore your system to full capacity in the event of an outage. It's important to test and practice what happens when a region is lost.

## Backup schedules

Backups are automatic in Azure Managed Instance for Apache Cassandra, but you can pick your own schedule for the daily backups. We recommend choosing times with less load. Though backups are configured to only consume idle CPU, they can in some circumstances trigger [compactions](https://cassandra.apache.org/doc/latest/cassandra/operating/compaction/index.html) in Cassandra, which can lead to an increase in CPU usage. Compactions can happen anytime with Cassandra, and depend on workload and chosen compaction strategy.

   > [!IMPORTANT]
   > The intention of backups is purely to mitigate accidental data loss or data corruption. We do **not** recommend backups as a disaster recovery strategy. Backups are not geo-redundant, and even if they were, it can take a very long time to recover a database from backups. Therefore, we strongly recommend a multi-region deployments, coupled with enabling availability zones where possible, to mitigate against disaster scenarios, and to be able to recover effectively from them. This is particularly important in the rare scenarios where the failed region cannot be covered, where without multi-region replication, all data may be lost.

   :::image type="content" source="./media/resilient-applications/backup.png" alt-text="Backup schedule configuration page" lightbox="./media/resilient-applications/backup.png" border="true":::

## Next steps

In this article, we laid out some best practices for building resilient applications with Cassandra.

> [!div class="nextstepaction"]
> [Create a cluster using Azure Portal](create-cluster-portal.md)




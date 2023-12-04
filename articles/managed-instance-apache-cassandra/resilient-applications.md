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


## RPO and RTO

RPO (recovery point objective) and RTO (recovery time objective), will both typically be very low (close to zero) for Apache Cassandra as long as you have:

- A [multi-region deployment](create-multi-region-cluster.md) with cross region replication, and a [replication factor](https://cassandra.apache.org/doc/latest/cassandra/architecture/dynamo.html#replication-strategy) of 3.
- Enabled availability zones (select option when creating a cluster in the [portal](create-cluster-portal.md) or via [Azure CLI](create-cluster-cli.md)).
- Configured application-level failover using load balancing policy in the [client driver](https://cassandra.apache.org/doc/latest/cassandra/getting_started/drivers.html) and/or load balancing-level failover using traffic manager/Azure front door.

RTO ("how long you are down in an outage") will be low because the cluster will be resilient across both zones and regions, and because Apache Cassandra itself is a highly fault tolerant, masterless system (all nodes can write) by default. RPO ("how much data can you lose in an outage") will be low because data will be sychronised between all nodes and data centers, so data loss in an outage would be minimal. 

   > [!NOTE]
   > It is not theoretically possible to achieve both RTO=0 *and* RPO=0 per [Cap Theorem](https://en.wikipedia.org/wiki/CAP_theorem). You will need to evaluate the trade off between consistency and availability/optimal performance - this will look different for each application. For example, if your application is read heavy, it might be better to cope with increased latency of cross-region writes to avoid data loss (favoring consistency). If the appplication is write heavy, and on a tight latency budget, the risk of losing some of the most recent writes in a major regional outage might be acceptable (favoring availability). 


## Availability zones

Cassandra's masterless architecture brings fault tolerance from the ground up, and Azure Managed Instance for Apache Cassandra provides support for [availability zones](../availability-zones/az-overview.md#azure-regions-with-availability-zones) in selected regions to enhance resiliency at the infrastructure level. Given a replication factor of 3, availability zone support ensures that each replica is in a different availability zone, thus preventing a zonal outage from impacting your database/application. We recommend enabling availability zones where possible.


## Multi-region redundancy 

Cassandra's architecture, coupled with Azure availability zones support, gives you some level of fault tolerance and resiliency. However, it's important to consider the impact of regional outages for your applications. We highly recommend deploying [multi region clusters](create-multi-region-cluster.md) to safeguard against region level outages. Although they are rare, the potential impact is severe. 

For business continuity, it is not sufficient to only make the database multi-region. Other parts of your application also need to be deployed in the same manner either by being distributed, or with adequate mechanisms to fail over. If your users are spread across many geo locations, a multi-region data center deployment for your database has the added benefit of reducing latency, since all nodes in all data centers across the cluster can then serve both reads and writes from the region that is closest to them. However, if the application is configured to be "active-active", it's important to consider how [CAP theorem](https://cassandra.apache.org/doc/latest/cassandra/architecture/guarantees.html#what-is-cap) applies to the consistency of your data between replicas (nodes), and the trade-offs required to delivery high availability. 

In CAP theorem terms, Cassandra is by default an AP (Available Partition-tolerant) database system, with highly [tunable consistency](https://cassandra.apache.org/doc/4.1/cassandra/architecture/dynamo.html#tunable-consistency). For most use cases, we recommend using local_quorum for reads. 

- In active-passive for writes there's a trade-off between reliability and performance: for reliability we recommend QUORUM_EACH but for most users LOCAL_QUORUM or QUORUM is a good compromise. Note however that in the case of a regional outage, some writes might be lost in LOCAL_QUORUM. 
- In the case of an application being run in parallel QUORUM_EACH writes are preferred for most cases to ensure consistency between the two data centers.
- If your goal is to favor consistency (lower RPO) rather than latency or availability (lower RTO), this should be reflected in your consistency settings and replication factor. As a rule of thumb, the number of quorum nodes required for a read plus the number of quorum nodes required for a write should be greater than the replication factor. For example, if you have a replication factor of 3, and quorum_one on reads (1 node), you should do quorum_all on writes (3 nodes), so that the total of 4 is greater than the replication factor of 3.


## Replication

We recommend auditing `keyspaces` and their replication settings from time to time to ensure the required replication between data centers has been configured. In the early stages of development, we recommend testing that everything works as expected by doing simple tests using `cqlsh`. For example, inserting a value while connected to one data center and reading it from the other.

In particular, when setting up a second data center where an existing data center already has data, it's important to determine that all the data has been replicated and the system is ready. We recommend monitoring replication progress through our [DBA commands with `nodetool netstats`](dba-commands.md#how-to-run-a-nodetool-command). An alternate approach would be to count the rows in each table, but keep in mind that with big data sizes, due to the distributed nature of Cassandra, this can only give a rough estimate.


## Balancing the cost of disaster recovery

If your application is "active-passive", we still generally recommend that you deploy the same capacity in each region so that your application can fail over instantly to a "hot standby" data center in a secondary region. This ensures no performance degradation in the case of a regional outage. Most Cassandra [client drivers](https://cassandra.apache.org/doc/latest/cassandra/getting_started/drivers.html) provide options to initiate application level failover. By default, they assume regional outage means that the application is also down, in which case failover should happen at the load balancer level. 

However, to reduce the cost of provisioning a second data center, you may prefer to deploy a smaller SKU, and fewer nodes, in your secondary region. When an outage occurs, scaling up is made easier in Azure Managed Instance for Apache Cassandra by [turnkey vertical and horizontal scaling](create-cluster-portal.md#scale-a-datacenter). While your applications failover to your secondary region, you can manually [scale out](create-cluster-portal.md#horizontal-scale) and [scale up](create-cluster-portal.md#vertical-scale) the nodes in your secondary data center. In this case, your secondary data center acts as a lower cost warm standby. Taking this approach would need to be balanced against the time required to restore your system to full capacity in the event of an outage. It's important to test and practice what happens when a region is lost.

   > [!NOTE]
   > Scaling up nodes is much faster than scaling out. Keep this in mind when considering the balance between vertical and horizontal scale, and the number of nodes to deploy in your cluster. 

## Backup schedules

Backups are automatic in Azure Managed Instance for Apache Cassandra, but you can pick your own schedule for the daily backups. We recommend choosing times with less load. Though backups are configured to only consume idle CPU, they can in some circumstances trigger [compactions](https://cassandra.apache.org/doc/latest/cassandra/operating/compaction/index.html) in Cassandra, which can lead to an increase in CPU usage. Compactions can happen anytime with Cassandra, and depend on workload and chosen compaction strategy.

   > [!IMPORTANT]
   > The intention of backups is purely to mitigate accidental data loss or data corruption. We do **not** recommend backups as a disaster recovery strategy. Backups are not geo-redundant, and even if they were, it can take a very long time to recover a database from backups. Therefore, we strongly recommend a multi-region deployments, coupled with enabling availability zones where possible, to mitigate against disaster scenarios, and to be able to recover effectively from them. This is particularly important in the rare scenarios where the failed region cannot be covered, where without multi-region replication, all data may be lost.

   :::image type="content" source="./media/resilient-applications/backup.png" alt-text="Screenshot of backup schedule configuration page." lightbox="./media/resilient-applications/backup.png" border="true":::

## Next steps

In this article, we laid out some best practices for building resilient applications with Cassandra.

> [!div class="nextstepaction"]
> [Create a cluster using Azure Portal](create-cluster-portal.md)




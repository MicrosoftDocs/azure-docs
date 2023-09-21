---
title: How to build resilient applications in Azure Managed Instance for Apache Cassandra
description: Learn about best practices for high availability and disaster recovery for Azure Managed Instance for Apache Cassandra
author: TheovanKraay
ms.service: managed-instance-apache-cassandra
ms.topic: how-to
ms.date: 09/21/2023
ms.author: thvankra
keywords: azure high availability disaster recovery cassandra resiliency
---

# Best practices for high availability and disaster recovery

Azure Managed Instance for Apache Cassandra provides automated deployment and scaling operations for managed open-source Apache Cassandra datacenters. Apache Cassandra is a great choice for building highly resilient applications due to it's distributed nature and masterless architecture – any node in the database can provide the exact same functionality as any other node – contributing to Cassandra’s robustness and resilience. This article provides tips on how to optimize high availability and how to approach disaster recover.

## Multi-region redundancy 

Cassandra's masterless architecture brings fault tolerance from the ground up, and Azure Managed Instance for Apache Cassandra provides support for [availability zones](../availability-zones/az-overview.md#azure-regions-with-availability-zones) in selected regions to enhance resiliency at the infrastructure level. However, its important to consider the impact of regional outages for your applications. We highly recommend deploying [multi region clusters](create-multi-region-cluster.md) to safeguard against region level outages. 

If your users are spread across many geo locations, this will have the added benefits of reducing latency, since all nodes in all data centers across the cluster can serve then serve both reads and rights from a region that is closest to them. However, when designing your application to read and write data in different regions, its important to consider how [CAP theorem](https://cassandra.apache.org/doc/latest/cassandra/architecture/guarantees.html#what-is-cap) applies to the consistency of your data between replicas (nodes), and the trade-offs required to delivery high availability. In CAP theorem terms, Cassandra is by default an AP (Available Partition-tolerant) database system, with highly [tunable consistency](https://cassandra.apache.org/doc/4.1/cassandra/architecture/dynamo.html#tunable-consistency). 


## Balancing the cost of disaster recovery

If your application is not geo-distributed, and you are deploying a secondary region for disaster recovery purposes only, we generally recommend that you deploy the same capacity in each region so that your application can failover instantly to a "hot standby" data center in a secondary region, without any performance degradation in the case of a regional outage. Most Cassandra [client drivers](https://cassandra.apache.org/doc/latest/cassandra/getting_started/drivers.html) provide the option to initiate application level failover, or assume that a regional outage means that the application is also down, in which case failover would happen at the load balancer level. 

However, to reduce the cost of provisioning a second data center, you may prefer to deploy a smaller SKU, as well as a smaller number of nodes, in your secondary region. This would need to be balanced against the time required to restore your system to full capacity in the event of an outage. However, in Azure Managed Instance for Apache Cassandra, this is at least made easier by [turnkey scaling of SKUs](create-cluster-portal.md#scale-a-datacenter). When an outage occurs, while your applications failover to your backup region, you can manually [scale out](create-cluster-portal.md#horizontal-scale) and [scale up](create-cluster-portal.md#vertical-scale) the nodes in your secondary data center, acting as a lower cost warm standby in case of regional outage. 

## Next steps

In this article, we laid out some best practices for building resilient applications with Cassandra.

> [!div class="nextstepaction"]
> [Create a cluster using Azure Portal](create-cluster-portal.md)




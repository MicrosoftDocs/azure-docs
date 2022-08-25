---
title: Overview Apache Cassandra and Azure Cosmos DB consistency levels
description: Overview Apache Cassandra and Azure Cosmos DB consistency levels. 
author: iriaosara 
ms.author: iriaosara
ms.service: cosmos-db
ms.subservice: cosmosdb-cassandra
ms.topic: overview
ms.date: 08/19/2022 
ms.custom: template-overview
---

# Overview Apache Cassandra and Azure Cosmos DB consistency levels

Previously, the consistency level for read requests could only be overridden to a lower consistency than the default set on the account. For instance, with the default consistency of Strong, read requests could be issued with Strong by default and overridden on a per request basis (if needed) to a consistency level weaker than Strong. However, read requests could not be issued with an overridden consistency level higher than the account’s default. An account with Eventual consistency could not receive read requests with a consistency level higher than Eventual (which in the Apache Cassandra drivers translate to TWO, THREE, LOCAL_QUORUM or QUORUM).

The Azure Cosmos DB Cassandra API now facilitates overriding the consistency on read requests to a value higher than the account’s default consistency. For instance, with the default consistency on the Cosmos DB account set to Eventual (Apache Cassandra equivalent of One or ANY), read requests can be overridden on a per request basis to LOCAL_QUORUM. This ensures that a quorum number of replicas within the specified region are consulted prior to returning the result set, as required by LOCAL_QUORUM. 
This also prevents the need to set a default consistency that is higher than Eventual, when it is only needed for read requests.


## How does consistency level affect my write request?
### I want global strong consistency
#### How does it work in Apache Cassandra?

Apache Cassandra, the setting of EACH_QUORUM or QUORUM gives a strong consistency. When a write request is sent to a region, EACH_QUORUM persists the data in a quorum number of nodes in each data center, which requires every data center to be available for the write operation to succeed. QUORUM is slightly less restrictive, with a QUORUM number of nodes across all the data centers needed to persist the data prior to acknowledging the write to be successful.

The following graphic illustrates a global strong consistency setting in Apache Cassandra between two regions 1 and 2. After data is written to region 1, the write needs to be persisted in a quorum number of nodes in both region 1, and region 2 before an acknowledgment is received by the application.

:::image type="content" source="./media/cassandra-consistency-overview/write-global-consistency-apache-cassandra.png" alt-text="Global consistency in Apache Cassandra":::


#### How does it work in Azure Cosmos DB for Apache Cassandra?
In Azure Cosmos DB consistency is set at the account level. With Strong Consistency in Azure Cosmos DB Cassandra API, data is replicated synchronously to the read regions for the account. The further apart the regions for the Azure Cosmos DB account are, the higher the latency of the strongly consistent write operations.

:::image type="content" source="./media/cassandra-consistency-overview/write-global-consistency-azure-comos-db.png" alt-text="Global consistency in Azure Cosmos DB for Apache Cassandra":::

How the number of regions affects your read or write request: 
- Two regions: With strong consistency, quorum (N/2 + 1) = 2. So, if the read region goes down, the account can no longer accept writes with strong consistency since a quorum number of regions is not available for the write to be replicated to.
- Three or more regions: for N = 3, quorum = 2. If one of the read regions is down, the write region can still replicate the writes to a total of two regions that meet the quorum requirement. Similarly, with four regions, quorum = 4/2 + 1 = 3.  Even with one read region being down, quorum can be met.

> [!NOTE]
> If a globally strong consistency is required for all write operations, the consistency for the Cosmos DB Cassandra API account must be set to Strong. The consistency level for write operations cannot be overridden to a lower consistency level on a per request basis in Azure Cosmos DB.


### I don’t want global strong consistency
#### How does it work in Apache Cassandra?
A consistency level of ANY, ONE, TWO, THREE, LOCAL_QUORUM, Serial or Local_Serial. 
Consider a write request with LOCAL_QUORUM with an RF of 4 in a six-node datacenter. Quorum = 4/2 + 1 = 3.

:::image type="content" source="./media/cassandra-consistency-overview/write-not-global-consistency-apache-cassandra.png" alt-text="Non Global consistency for Apache Cassandra":::


#### How does it work in Azure Cosmos DB for Apache Cassandra?
When a write request is sent with any of the consistency levels lower than Strong, a success response is returned as soon as the local region persists the write in at least 3 out of 4 replicas.

:::image type="content" source="./media/cassandra-consistency-overview/write-not-global-Azure-Cosmos-DB.png" alt-text="Non Global consistency in Azure Cosmos DB for Apache Cassandra":::

## How does consistency level affect my read request?
### I want global strong consistency
#### How does it work in Apache Cassandra?
With a consistency of EACH_QUORUM, a strongly consistent read can be achieved in Apache Cassandra. In, a multi-region setup for EACH_QUORUM if the quorum number of nodes is not met in each region, then the read will be unsuccessful. 

:::image type="content" source="./media/cassandra-consistency-overview/read-global-consistency-apache-cassandra.png" alt-text="Read Global consistency in Apache Cassandra":::


#### How does it work in Azure Cosmos DB for Apache Cassandra?
The read request is served from 2 replicas in the specified region. Since the write already took care of persisting to a quorum number of regions (and all regions if every region was available), simply reading from 2 replicas in the specified region provides Strong consistency.  This requires EACH_QUORUM to be specified in the driver when issuing the read against a region for the Cosmos DB account along with Strong Consistency as the default consistency level for the account.

:::image type="content" source="./media/cassandra-consistency-overview/read-global-consistency-Azure-Cosmos-DB.png" alt-text="Read Global consistency in Azure Cosmos DB for Apache Cassandra":::

### I want Local Strong consistency
#### How does it work in Apache Cassandra?
A read   request with a consistency level of TWO, THREE, LOCAL_QUORUM will give us strong consistency reading from local region. With a consistency level of LOCAL_QUORUM, you need a response from two nodes in the specified datacenter for a successful read.

:::image type="content" source="./media/cassandra-consistency-overview/read-local-strong-apache-cassandra.png" alt-text="Read Local strong consistency for Apache Cassandra":::

#### How does it work in Azure Cosmos DB for Apache Cassandra?
In Azure Cosmos DB Cassandra API, having a consistency level of TWO, THREE or LOCAL_QUORUM will give a local strong consistency for a read request. Since the write path guarantees replicating to a minimum of 3 out of 4 replicas, a read from 2 replicas in the specified region will guarantee a quorum read of the data in that region.

:::image type="content" source="./media/cassandra-consistency-overview/read-local-strong-consistency-Azure-Cosmos-DB.png" alt-text="Read Local strong consistency in Azure Cosmos DB for Apache Cassandra":::

### I want Eventual consistency
#### How does it work in Apache Cassandra?
A consistency level of LOCAL_ONE, One and ANY with LOCAL_ONE will result in eventual consistency. This is used in cases where the focus is on latency. 

:::image type="content" source="./media/cassandra-consistency-overview/read-eventual-consistency-apache-cassandra.png" alt-text="Read eventual consistency for Apache Cassandra":::

#### How does it work in Azure Cosmos DB for Apache Cassandra?
A consistency level of LOCAL_ONE, ONE or Any will give you eventual consistency. With eventual consistency a read is served from just one of the replicas in the specified region. 

:::image type="content" source="./media/cassandra-consistency-overview/read-eventual-consistency-Azure-Cosmos-DB.png" alt-text="Read eventual consistency in Azure Cosmos DB for Apache Cassandra":::



## Next steps

Learn more about the consistency level in Azure Cosmos DB for Apache Cassandra, read the following articles:
- [Consistency Level overview](../consistency-levels.md)
- [Configure the default consistency level](how-to-manage-consistency.md#configure-the-default-consistency-level)
- [Override the default consistency level](how-to-manage-consistency.md#override-the-default-consistency-level)
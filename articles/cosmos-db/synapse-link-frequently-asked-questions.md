---
title: Frequently asked questions about Azure Synapse Link for Azure Cosmos DB 
description: Get answers to frequently asked questions about Synapse Link for Azure Cosmos DB in areas such as billing, analytical store, security, time to live on analytical store. 
author: srchi
ms.author: srchi
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 05/19/2020

---

# Frequently asked questions about Azure Synapse Link for Azure Cosmos DB

Azure Synapse Link for Azure Cosmos DB creates a tight integration between Azure Cosmos DB and Azure Synapse Analytics. It enables customers to run near real-time analytics over their operational data with full performance isolation from their transactional workloads and without an ETL pipeline. This article answers commonly asked questions about Synapse Link for Azure Cosmos DB.

## General FAQ

### Is Synapse Link supported for all Azure Cosmos DB APIs?
In the public preview release, Synapse Link is supported only for the Azure Cosmos DB SQL (Core) API. Support for Cosmos DB’s API for Mongo DB & Cassandra API is currently under gated preview.  To request access to gated preview, reach out to the [Azure Cosmos DB team](mailto:cosmosdbsynapselink@microsoft.com).

### Is Synapse Link supported for multi-region Azure Cosmos accounts?
Yes, for multi-region Azure Cosmos accounts, the data stored in the analytical store is also globally distributed. Regardless of single write region (single master) or multiple write regions (also known as multi-master), analytical queries performed from Azure Synapse Analytics can be served from the closest local region.

When planning to configure a multi-region Azure Cosmos account with analytical store support, it is recommended to have all the necessary regions added at time of account creation.

### Can I choose to enable Synapse Link for only certain region and not all regions in a multi-region account set-up?
In the preview release, when Synapse Link is enabled for a multi-region account, the analytical store is created in all regions. The underlying data is optimized for throughput and transactional consistency in the transactional store.

### Can I disable the Synapse Link feature for my Azure Cosmos account?
Currently, after the Synapse Link capability is enabled at the account level, you cannot disable it.  If you want to turn off the capability, you have to delete and re-create a new Azure Cosmos account.

Understand that you will **not** have any billing implications if the Synapse Link capability is enabled at the account level but there is no analytical store enabled containers.

## Azure Cosmos DB analytical store

### Can I enable analytical store on existing containers?
Currently, the analytical store can only be enabled for new containers (both in new and existing accounts).

### Can I disable analytical store on my Azure Cosmos containers after enabling it during container creation?
Currently, the analytical store cannot be disabled on an Azure Cosmos container after it is enabled during container creation.

### Is analytical store supported for Azure Cosmos containers with autoscale provisioned throughput?
Yes, the analytical store can be enabled on containers with autoscale provisioned throughput.

### Is there any effect on Azure Cosmos DB transactional store provisioned RUs?
Azure Cosmos DB guarantees performance isolation between the transactional and analytical workloads. Enabling the analytical store on a container will not impact the RU/s provisioned on the Azure Cosmos DB transactional store. The transactions (read & write) and storage costs for the analytical store will be charged separately. See the [pricing for Azure Cosmos DB analytical store](analytical-store-introduction.md#analytical-store-pricing) for more details.

### Are delete and update operations on the transactional store reflected in the analytical store? 
Yes, deletes and updates to the data in the transactional store will be reflected in the analytical store. You can configure the Time to Live (TTL) on the container to include historical data so that the analytical store retains all versions of items that satisfy the analytical TTL criteria. See the [overview of analytical TTL](analytical-store-introduction.md#analytical-ttl) for more details.

### Can I connect to analytical store from analytics engines other than Azure Synapse Analytics?
You can only access and run queries against the analytical store using the various run-times provided by Azure Synapse Analytics. The analytical store can be queried and analyzed using:

* Synapse Spark with full support for Scala, Python, SparkSQL, and C#. Synapse Spark is central to data engineering and science scenarios
* SQL serverless with T-SQL language and support for familiar BI tools (For example, Power BI Premium, etc.)

### Can I connect to analytical store from Synapse SQL provisioned?
At this time, the analytical store cannot be accessed from Synapse SQL provisioned.

### Can I write back the query aggregation results from Synapse back to the analytical store?
Analytical store is a read-only store in an Azure Cosmos container. So, you cannot directly write back the aggregation results to the analytical store, but can write them to the Azure Cosmos DB transactional store of another container, which can later be leveraged as a serving layer.

### Is the autosync replication from transactional store to the analytical store asynchronous or synchronous and what are the latencies? 
The replication is asynchronous, and currently the expected latency is around 2 min.

### Are there any scenarios where the items from the transactional store are not automatically propagated to the analytical store?
If specific items in your container violate the [well-defined schema for analytics](analytical-store-introduction.md#analytical-schema), they will not be included in the analytical store. If you have scenarios blocked by well-defined schema for analytics, email the [Azure Cosmos DB team](mailto:cosmosdbsynapselink@microsoft.com) for help.

### Can I partition the data in analytical store differently from transactional store?
The data in analytical store is partitioned based on the horizontal partitioning of shards in the transactional store. Currently, you cannot choose a different partitioning strategy for the analytical store.

### Can I customize or override the way transactional data is transformed into columnar format in the analytical store?
Currently you can’t transform the data items when they are automatically propagated from the transactional store to analytical store. If you have scenarios blocked by this limitation, email the [Azure Cosmos DB team](mailto:cosmosdbsynapselink@microsoft.com).

## Analytical Time to live (TTL)

### Is TTl for analytical data supported at both container and item level?
At this time, TTl for analytical data can only be configured at container level and there is no support to set analytical TTL at item level.

### After setting the container level  analytical TTL on an Azure Cosmos DB container, can I change to a different value later?
Yes, analytical TTL can be updated to any valid value. See the [Analytical TTL](analytical-store-introduction.md#analytical-ttl) article for more details about analytical TTL.

### Can I update or delete an item from the analytical store after it has been TTL’d out from the transactional store?
All transactional updates and deletes are copied to the analytical store but if the item has been purged from the transactional store, then it cannot be updated in the analytical store. To learn more, see the [Analytical TTL](analytical-store-introduction.md#analytical-ttl) article.

## Billing

### What is the billing model of Synapse Link for Azure Cosmos DB?
[Azure Cosmos DB analytical store](analytical-store-introduction.md) is available in public preview without any charges for analytical store until August 30, 2020. Synapse Spark and Synapse SQL are billed through [Synapse service consumption](https://azure.microsoft.com/pricing/details/synapse-analytics/).

## Security

### What are the ways to authenticate with the analytical store?
Authentication with the analytical store is the same as a transactional store. For a given database, you can authenticate with the master or read-only key. You can leverage linked service in Synapse Studio to prevent pasting the Azure Cosmos DB keys in the Spark notebooks. Access to this Linked Service is available for everyone who has access to the workspace.

## Synapse run-times

### What are the currently supported Synapse run-times to access Azure Cosmos DB analytical store?

|Synapse runtime |Current support |
|---------|---------|
|Synapse Spark pools | Read, Write (through transactional store), Table, Temporary View |
|Synapse SQL Serverless    | Read, View (Gated Preview)  |
|Synapse SQL Provisioned   |  Not available |

### Do my Synapse Spark tables sync with my Synapse SQL Serverless tables the same way they do with Azure Data Lake?
Currently, this feature is not available.

### Can I do Spark structured streaming from analytical store?
Currently Spark structured streaming support for Azure Cosmos DB is implemented using the change feed functionality of the transactional store and it’s not yet supported from analytical store.

## Synapse Studio

### In the Synapse Studio, how do I recognize if I'm connected to an Azure Cosmos DB container with the analytics store enabled?
An Azure Cosmos DB container enabled with analytical store has the following icon:

![Azure Cosmos DB container enabled with analytical store- icon](./media/synapse-link-frequently-asked-questions/analytical-store-icon.png)

A transactional store container will be represented with the following icon:

![Azure Cosmos DB container enabled with transactional store- icon](./media/synapse-link-frequently-asked-questions/transactional-store-icon.png)
 
### How do you pass Azure Cosmos DB credentials from Synapse Studio?
Currently Azure Cosmos DB credentials are passed while creating the linked service by the user who has access to the Azure Cosmos DB databases. Access to that store is available to other users who have access to the workspace.

## Next steps

* Learn about the [benefits of Synapse Link](synapse-link.md#synapse-link-benefits)

* Learn about the [integration between Synapse Link and Azure Cosmos DB](synapse-link.md#synapse-link-integration).

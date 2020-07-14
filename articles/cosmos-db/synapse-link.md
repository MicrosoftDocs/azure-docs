---
title: Azure Synapse Link for Azure Cosmos DB, benefits, and when to use it
description: Learn about Azure Synapse Link for Azure Cosmos DB. Synapse Link lets you run near real-time analytics (HTAP) using Azure Synapse Analytics over operational data in Azure Cosmos DB.
author: srchi
ms.author: srchi
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 05/19/2020
ms.reviewer: sngun
---

# What is Azure Synapse Link for Azure Cosmos DB (Preview)?

> [!IMPORTANT]
> Azure Synapse Link for Azure Cosmos DB is currently in preview. This preview version is provided without a service level agreement, and it's not recommended for production workloads. For more information, see [Supplemental terms of use for Microsoft Azure previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Azure Synapse Link for Azure Cosmos DB is a cloud-native hybrid transactional and analytical processing (HTAP) capability that enables you to run near real-time analytics over operational data in Azure Cosmos DB. Azure Synapse Link creates a tight seamless integration between Azure Cosmos DB and Azure Synapse Analytics.

Using [Azure Cosmos DB analytical store](analytical-store-introduction.md), a fully isolated column store, Azure Synapse Link enables no Extract-Transform-Load (ETL) analytics in [Azure Synapse Analytics](../synapse-analytics/overview-what-is.md) against your operational data at scale. Business analysts, data engineers and data scientists can now use Synapse Spark or Synapse SQL interchangeably to run near real-time business intelligence, analytics, and machine learning pipelines. You can achieve this without impacting the performance of your transactional workloads on Azure Cosmos DB. 

The following image shows the Azure Synapse Link integration with Azure Cosmos DB and Azure Synapse Analytics: 

![Architecture diagram for Azure Synapse Analytics integration with Azure Cosmos DB](./media/synapse-link/synapse-analytics-cosmos-db-architecture.png)

## <a id="synapse-link-benefits"></a> Benefits

To analyze large operational datasets while minimizing the impact on the performance of mission-critical transactional workloads, traditionally, the operational data in Azure Cosmos DB is extracted and processed by Extract-Transform-Load (ETL) pipelines. ETL pipelines require many layers of data movement resulting in much operational complexity, and performance impact on your transactional workloads. It also increases the latency to analyze the operational data from the time of origin.

When compared to the traditional ETL-based solutions, Azure Synapse Link for Azure Cosmos DB offers several advantages such as:  

### Reduced complexity with No ETL jobs to manage

Azure Synapse Link allows you to directly access Azure Cosmos DB analytical store using  Azure Synapse Analytics without complex data movement. Any updates made to the operational data are visible in the analytical store in near real-time with no ETL or change feed jobs. You can run large scale analytics against analytical store, from Synapse Analytics, without additional data transformation.

### Near real-time insights into your operational data

You can now get rich insights on your operational data in near real-time, using Azure Synapse Link. ETL-based systems tend to have higher latency for analyzing your operational data, due to many layers needed to extract, transform and load the operational data. With native integration of Azure Cosmos DB analytical store with Azure Synapse Analytics, you can analyze operational data in near real-time enabling new business scenarios. 


### No impact on operational workloads

With Azure Synapse Link, you can run analytical queries against an Azure Cosmos DB analytical store (a separate column store) while the transactional operations are processed using provisioned throughput for the transactional workload (a row-based transactional store).  The analytical workload is served independent of the transactional workload traffic without consuming any of the throughput provisioned for your operational data.

### Optimized for large-scale analytics workloads

Azure Cosmos DB analytical store is optimized to provide scalability, elasticity, and performance for analytical workloads without any dependency on the compute run-times. The storage technology is self-managed to optimize your analytics workloads. With built-in support into Azure Synapse Analytics, accessing this storage layer provides simplicity and high performance.

### Cost effective

With Azure Synapse Link, you can get a cost-optimized, fully managed solution for operational analytics. It eliminates the extra layers of storage and compute required in traditional ETL pipelines for analyzing operational data. 

Azure Cosmos DB analytical store follows a consumption-based pricing model, which is based on data storage and analytical read/write operations and queries executed . It doesn’t require you to provision any throughput, as you do today for the transactional workloads. Accessing your data with highly elastic compute engines from Azure Synapse Analytics makes the overall cost of running storage and compute very efficient.


### Analytics for locally available, globally distributed, multi master data

You can run analytical queries effectively against the nearest regional copy of the data in Azure Cosmos DB. Azure Cosmos DB provides the state-of-the-art capability to run the globally distributed analytical workloads along with transactional workloads in an active-active manner.

## Enable HTAP scenarios for your operational data

Synapse Link brings together Azure Cosmos DB analytical store with Azure Synapse analytics runtime support. This integration enables you to build cloud native HTAP (Hybrid transactional/analytical processing) solutions that generate insights based on real-time updates to your operational data over large datasets. It unlocks new business scenarios to raise alerts based on live trends, build near real-time dashboards, and business experiences based on user behavior.

### Azure Cosmos DB analytical store

Azure Cosmos DB analytical store is a column-oriented representation of your operational data in Azure Cosmos DB. This analytical store is suitable for fast, cost effective queries on large operational data sets, without copying data and impacting the performance of your transactional workloads.

Analytical store automatically picks up high frequency inserts, updates, deletes in your transactional workloads in near real time, as a fully managed capability (“auto-sync”) of Azure Cosmos DB. No change feed or ETL is required. 

If you have a globally distributed Azure Cosmos DB account, after you enable analytical store for a container, it will be available in all regions for that account. For more information on the analytical store, see [Azure Cosmos DB Analytical store overview](analytical-store-introduction.md) article.

### <a id="synapse-link-integration"></a>Integration with Azure Synapse Analytics

With Synapse Link, you can now directly connect to your Azure Cosmos DB containers from Azure Synapse Analytics and access the analytical store with no separate connectors. Azure Synapse Analytics currently supports Synapse Link with [Synapse Apache Spark](../synapse-analytics/spark/apache-spark-concepts.md) and [Synapse SQL Serverless](../synapse-analytics/sql/on-demand-workspace-overview.md).

You can query the data from Azure Cosmos DB analytical store simultaneously, with interop across different analytics run times supported by Azure Synapse Analytics. No additional data transformations are required to analyze the operational data. You can query and analyze the analytical store data using:

* Synapse Apache Spark with full support for Scala, Python, SparkSQL, and C#. Synapse Spark is central to data engineering and data science scenarios

* SQL serverless with T-SQL language and support for familiar BI tools (for example, Power BI Premium, etc.)

> [!NOTE]
> From Azure Synapse Analytics, you can access both analytical and transactional stores in your Azure Cosmos DB container. However, if you want to run large-scale analytics or scans on your operational data, we recommend that you use analytical store to avoid performance impact on transactional workloads.

> [!NOTE]
> You can run analytics with low latency in an Azure region by connecting your Azure Cosmos DB container to Synapse runtime in that region.

This integration enables the following HTAP scenarios for different users:

* A BI engineer who wants to model and publish a report to access the operational data in Azure Cosmos DB directly through Synapse SQL.

* A data analyst who wants to derive insights from the operational data in an Azure Cosmos DB container by querying it with Synapse SQL, read the data at scale and combine those findings with other data sources.

* A data scientist who wants to use Synapse Spark to find a feature to improve their model and train that model without doing complex data engineering. They can also write the results of the model post inference into Azure Cosmos DB for real-time scoring on the data through Spark Synapse.

* A data engineer who wants to make data accessible for consumers, by creating SQL or Spark tables over Azure Cosmos DB containers without manual ETL processes.

For more information on Azure Synapse Analytics runtime support for Azure Cosmos DB, see [Azure Synapse Analytics for Cosmos DB support](../synapse-analytics/synapse-link/concept-synapse-link-cosmos-db-support.md).

## When to use Azure Synapse Link for Azure Cosmos DB?

Synapse Link is recommended in the following cases:

* If you are an Azure Cosmos DB customer and you want to run analytics, BI, and machine learning over your operational data. In such cases, Synapse Link provides a more integrated analytics experience without impacting your transactional store’s provisioned throughput. For example:

  * If you are running analytics or BI on your Azure Cosmos DB operational data directly using separate connectors today, or

  * If you are running ETL processes to extract operational data into a separate analytics system.
 
In such cases, Synapse Link provides a more integrated analytics experience without impacting your transactional store’s provisioned throughput.

Synapse Link is not recommended if you are looking for traditional data warehouse requirements such as high concurrency, workload management, and persistence of aggregates across multiple data sources. For more information, see [common scenarios that can be powered with Azure Synapse Link for Azure Cosmos DB](synapse-link-use-cases.md).


## Limitations

* During the public preview, Azure Synapse Link is supported only for the Azure Cosmos DB SQL (Core) API. Support for Azure Cosmos DB’s API for MongoDB & Cassandra API are currently under a gated preview. To request access to the gated preview, email the [Azure Cosmos DB team](mailto:cosmosdbsynapselink@microsoft.com).

* Currently, the analytical store can only be enabled for new containers (both in new and existing Azure Cosmos DB accounts).

* Accessing the Azure Cosmos DB analytic store with Synapse SQL serverless is currently under gated preview. To request access, email the [Azure Cosmos DB team](mailto:cosmosdbsynapselink@microsoft.com).

* Accessing the Azure Cosmos DB analytics store with Synapse SQL provisioned is currently not available.

## Pricing

The billing model of Azure Synapse Link includes the costs incurred by using the Azure Cosmos DB analytical store and the Synapse runtime. To learn more, see the [Azure Cosmos DB analytical store pricing](analytical-store-introduction.md#analytical-store-pricing) and [Azure Synapse Analytics pricing](https://azure.microsoft.com/pricing/details/synapse-analytics/) articles.

## Next steps

To learn more, see the following docs:

* [Azure Cosmos DB analytical store overview](analytical-store-introduction.md)

* [Get started with Azure Synapse Link for Azure Cosmos DB](configure-synapse-link.md)
 
* [What is supported in Azure Synapse Analytics run time](../synapse-analytics/synapse-link/concept-synapse-link-cosmos-db-support.md)

* [Frequently asked questions about Azure Synapse Link for Azure Cosmos DB](synapse-link-frequently-asked-questions.md)

* [Azure Synapse Link for Azure Cosmos DB Use cases](synapse-link-use-cases.md)

---
title: Synapse Link for Azure Cosmos DB, benefits, and when to use it
description: Learn what is Synapse Link for Azure Cosmos DB, benefits of Synapse Link, when to use it, and how to enable HTAP scenarios for your operational data.
author: srchi
ms.author: srchi
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 05/19/2020
ms.reviewer: sngun

---

# What is Synapse Link for Azure Cosmos DB (Preview)?

Synapse Link for Azure Cosmos DB is a cloud native hybrid transactional and analytical processing (HTAP) capability that enables you to run near real-time analytics over operational data in Azure Cosmos DB. Synapse Link creates a tight seamless integration between Azure Cosmos DB and Azure Synapse Analytics.

> [!IMPORTANT]
> Synapse Link for Azure Cosmos DB is currently in preview. This preview version is provided without a service level agreement, and it's not recommended for production workloads. For more information, see [Supplemental terms of use for Microsoft Azure previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

[Azure Cosmos DB analytical store]() is a fully isolated column store. By using Azure Cosmos DB analytical store, Synapse Link enables analytics in [Azure Synapse Analytics](../synapse-analytics/overview-what-is.md) against the globally distributed operational data at scale without any Extract-Transform-Load (ETL) pipeline. Business analysts, data engineers and data scientists can now use Synapse Spark or Synapse SQL in an interoperable manner to run near real-time business intelligence, analytics, and machine learning pipelines. You can achiever all without impacting the performance of your transactional workloads on Azure Cosmos DB.

![Architecture diagram for Azure Synapse Analytics integration with Azure Cosmos DB](./media/synapse-link-cosmos-db/synapse-analytics-cosmos-db-architecture.png)

## Benefits of Synapse Link

To analyze large operational datasets without impacting the performance of mission-critical transactional workloads, traditionally, the operational data in Azure Cosmos DB is extracted and processed by Extract-Transform-Load (ETL) pipelines. ETL pipelines require many layers of data movement resulting in a lot of operational complexity, performance impact on your transactional workloads. It also increases the latency to analyze the operational data from the time of origin.

When compared to the traditional ETL solutions, Synapse Link for Azure Cosmos DB offers several advantages such as:  

**Reduced complexity with No ETL analytics**  
Synapse Link allows you to directly access Azure Cosmos DB analytical store in Azure Synapse Analytics without any connectors. Azure Cosmos DB analytical store automatically stores operational data in a query-optimized column format, which you can later analyze in near real-time using Synapse Analytics, without complex data movement. Any updates made to the operational data are visible in the analytical store in near real-time with no ETL or change feed. You can query the data directly using Synapse Analytics.

**Performance isolation from transactional workloads**
With Synapse Link, you can run analytical queries against Azure Cosmos DB analytical store (a separate column store) while the transactional operations are processed using provisioned throughput for the transactional workload (a row-based transactional store).  The analytical workload traffic is served independent of the transactional workload traffic without any impact on the throughput provisioned for your operational data.

**Optimized for large scale analytics workloads**
Azure Cosmos DB analytical store is optimized to provide scalability, elasticity, and performance for analytical workloads without any dependency on the compute run-times. The storage technology is self-managed to optimize your analytics workloads without manual efforts. With built-in support into Azure Synapse Analytics, accessing this storage layer provides simplicity and high performance.

**Cost effective**
Synapse Link eliminates the extra layers of storage and compute required in traditional ETL pipelines to analyze the operational data. You can get a cost-optimized, fully managed solution for operational analytics especially with growing data volumes. Azure Cosmos DB analytical store follows a consumption-based pricing model, which is based on data storage and queries executed. It doesn’t require you to provision any throughput, as you do today for the transactional workloads. Accessing your data with highly elastic compute engines from Azure Synapse Analytics makes the overall cost of running storage and compute very efficient.

**Near real-time analytics for globally distributed, multi master data** 
You can run analytical queries effectively against the nearest regional copy of the data in Azure Cosmos DB. Azure Cosmos DB provides the state-of-the-art capability to run the globally distributed analytical workloads along with transactional workloads in an active-active manner.

## Enable HTAP scenarios for your operational data

Synapse Link brings together Azure Cosmos DB analytical store with Azure Synapse analytics runtime support. This integration enables you to build cloud native HTAP (Hybrid transactional/analytical processing) solutions that generate insights based on real-time updates to your operational data over large datasets. It unlocks new business scenarios to raise alerts based on live trends, build near real-time dashboards, and business experiences based on user behavior.

### Azure Cosmos DB analytical store

Azure Cosmos DB analytical store is a columnar representation of your operational data in Azure Cosmos DB. This analytical store is suitable for fast, cost effective queries on large operational data sets, without copying data and impacting the throughput of your transactional workloads. 
Analytical store automatically picks up high frequency inserts, updates, deletes in your transactional workloads in near real-time. No change feed or ETL is required. It contains the complete version history of all the transactional updates that occurred in your Azure Cosmos container. 

If you have a globally distributed Azure Cosmos account, after you enable analytical store for a container, it will be available in all regions for that account. For more information on the analytical store, see [Azure Cosmos DB Analytical store overview]() article. 

### Integration with Azure Synapse Analytics

With Synapse Link, you can now directly connect to your Azure Cosmos containers from Azure Synapse Analytics and access the analytical store with no separate connectors. Azure Synapse Analytics currently supports Synapse Link with [Synapse Apache Spark](../synapse-analytics/spark/apache-spark-concepts.md) and [Synapse SQL (serverless)](../synapse-analytics/sql/on-demand-workspace-overview.md).

You can query the data from Azure Cosmos DB analytical store simultaneously, with interop across different analytics run times supported by Synapse Analytics. You can query and analyze the analytical store using:

- Synapse Apache Spark with full support for Scala, Python, SparkSQL, and C#. Synapse Spark is central to data engineering and science scenarios
- SQL serverless with T-SQL language and support for familiar BI tools (for example, Power BI Premium, etc.)

> [!NOTE]
> From Azure Synapse Analytics, you can access both analytical and transactional stores in your Azure Cosmos container. If you want to run large-scale analytics or scans on your operational data, we recommend that you use analytical store to avoid performance impact on transactional workloads.

> [!NOTE]
> You can run analytics with low latency in an Azure region by connecting your Azure Cosmos container to Synapse runtime in that region.

This integration enables the following HTAP scenarios for different users:

* A BI engineer who wants to model and publish a report to access the operational data in Azure Cosmos DB directly through Synapse SQL.

* A data analyst who wants to derive insights from the operational data in an Azure Cosmos container by querying it with Synapse SQL, read the data at scale and combine those findings with other data sources.

* A data scientist who wants to use Synapse Spark to find a feature to improve their model and train that model without doing complex data engineering. They can also write the results of the model post inference into Azure Cosmos DB for real-time scoring on the data through Spark Synapse.

* A data engineer who wants to make data accessible for consumers of operational data in Azure Cosmos DB by simply creating SQL or Spark tables over the containers without manual ETL processes.

For more information on Azure Synapse Analytics, see [Azure Synapse Analytics Cosmos DB support](../synapse-analytics/cosmos-db-integration/concept-cosmos-db-support.md), and [Azure Synapse Analytics run time support](../synapse-analytics/overview-what-is.md) articles.

## When to use Synapse Link for Azure Cosmos DB?

Synapse Link is recommended in the following cases:

* If you are a new or an existing Azure Cosmos DB customer and you want to run analytics, BI, and machine learning over your operational data. For example:

  * If you are running analytics or BI on your Azure Cosmos DB operational data directly using separate connectors today, or
  * If you are running manual ETL processes to extract operational data into a separate analytics system.
  In such cases, Synapse Link provides a more integrated analytics experience without impacting your transactional store’s provisioned throughput.

* If you are looking for archival solutions and cost savings for your Azure Cosmos DB data. Instead of using a separate cold storage system by manually running ETL processes, you can use the analytical store which has a consumption-based pricing model and doesn’t require you to provision any RU/s.

Synapse Link is not recommended if you are looking for traditional data warehouse requirements such as high concurrency, workload management, and persistence of aggregates across multiple data sources. For more details, see [common scenarios that can be powered with Synapse Link for Azure Cosmos DB](analytics-usecases.md).

## Supported regions

Synapse Link for Azure Cosmos DB is currently available in the following Azure regions: US West Central, East US, West US2, North Europe, West Europe, South Central US, Southeast Asia, Australia East, East U2, UK South.

## Limitations

* During the public preview, Synapse Link is supported only for the Azure Cosmos DB SQL (Core) API. Support for Azure Cosmos DB’s API for Mongo DB & Cassandra API are currently under a gated preview. To request access to the gated preview, please reach out to the [Azure Cosmos DB team](mailto:cosmosdbsynapselink@microsoft.com).

* Currently, analytical store can only be enabled for new containers (both in new and existing Azure Cosmos accounts).

* Accessing the Azure Cosmos DB analytic store with Synapse SQL serverless is currently under gated preview. To request access please reach out to [Azure Cosmos DB team](mailto:cosmosdbsynapselink@microsoft.com).

* Accessing the Azure Cosmos DB analytics store with Synapse SQL provisioned is currently not available.

## Pricing

## Next steps
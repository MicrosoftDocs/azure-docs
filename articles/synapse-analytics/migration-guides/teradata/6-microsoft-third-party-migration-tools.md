---
title: "Tools for Teradata data warehouse migration to Azure Synapse Analytics"
description: Learn about Microsoft and third-party data and database migration tools that can help you migrate from Teradata to Azure Synapse Analytics. 
ms.service: synapse-analytics
ms.subservice: sql-dw
ms.custom:
ms.devlang:
ms.topic: conceptual
author: ajagadish-24
ms.author: ajagadish
ms.reviewer: wiassaf
ms.date: 07/12/2022
---

# Tools for Teradata data warehouse migration to Azure Synapse Analytics

This article is part six of a seven-part series that provides guidance on how to migrate from Teradata to Azure Synapse Analytics. The focus of this article is best practices for Microsoft and third-party tools.

## Data warehouse migration tools

By migrating your existing data warehouse to Azure Synapse, you benefit from:

- A globally secure, scalable, low-cost, cloud-native, pay-as-you-use analytical database.

- The rich Microsoft analytical ecosystem that exists on Azure. This ecosystem consists of technologies to help modernize your data warehouse once it's migrated and extend your analytical capabilities to drive new value.

Several tools from both Microsoft and [third-party partners](../../partner/data-integration.md) can help you migrate your existing data warehouse to Azure Synapse. This article discusses the following types of tools:

- Microsoft data and database migration tools.

- Third-party data warehouse automation tools to automate and document the migration to Azure Synapse.

- Third-party data warehouse migration tools to migrate schema and data to Azure Synapse.

- Third-party tools to bridge the SQL differences between your existing data warehouse DBMS and Azure Synapse.

## Microsoft data migration tools

Microsoft offers several tools to help you migrate your existing data warehouse to Azure Synapse, such as:

- [Azure Data Factory](../../../data-factory/introduction.md).

- Microsoft services for physical data transfer.

- Microsoft services for data ingestion.

The next sections discuss these tools in more detail.

### Microsoft Azure Data Factory

Data Factory is a fully managed, pay-as-you-use, hybrid data integration service for highly scalable ETL and ELT processing. It uses Apache Spark to process and analyze data in parallel and in-memory to maximize throughput.

>[!TIP]
>Data Factory allows you to build scalable data integration pipelines code-free.

[Data Factory connectors](../../../data-factory/connector-overview.md) support connections to external data sources and databases and include templates for common data integration tasks. A visual front-end, browser-based UI enables non-programmers to create and run [pipelines](../../data-explorer/ingest-data/data-explorer-ingest-data-pipeline.md) to ingest, transform, and load data. More experienced programmers can incorporate custom code, such as Python programs.

>[!TIP]
>Data Factory enables collaborative development between business and IT professionals.

Data Factory is also an orchestration tool and is the best Microsoft tool to automate the end-to-end migration process. Automation reduces the risk, effort, and time to migrate, and makes the migration process easily repeatable. The following diagram shows a mapping data flow in Data Factory.

:::image type="content" source="../media/6-microsoft-3rd-party-migration-tools/azure-data-factory-mapping-dataflows.png" border="true" alt-text="Screenshot showing an example of a Data Factory mapping dataflow." lightbox="../media/6-microsoft-3rd-party-migration-tools/azure-data-factory-mapping-dataflows-lrg.png":::

The next screenshot shows a wrangling data flow in Data Factory.

:::image type="content" source="../media/6-microsoft-3rd-party-migration-tools/azure-data-factory-wrangling-dataflows.png" border="true" alt-text="Screenshot showing an example of Data Factory wrangling dataflows." lightbox="../media/6-microsoft-3rd-party-migration-tools/azure-data-factory-wrangling-dataflows-lrg.png":::

In Data Factory, you can develop simple or comprehensive ETL and ELT processes without coding or maintenance with just a few clicks. ETL/ELT processes ingest, move, prepare, transform, and process your data. You can design and manage scheduling and triggers in Data Factory to build an automated data integration and loading environment. In Data Factory, you can define, manage, and schedule PolyBase bulk data load processes.

>[!TIP]
>Data Factory includes tools to help migrate both your data and your entire data warehouse to Azure.

You can use Data Factory to implement and manage a hybrid environment with on-premises, cloud, streaming, and SaaS data in a secure and consistent way. SaaS data might come from applications such as Salesforce.

Wrangling data flows is a new capability in Data Factory. This capability opens up Data Factory to business users who want to visually discover, explore, and prepare data at scale without writing code. Wrangling data flows offer self-service data preparation, similar to Microsoft Excel, Power Query, and Microsoft Power BI dataflows. Business users can prepare and integrate data through a spreadsheet-style UI with drop-down transform options.

Data Factory is the recommended approach for implementing data integration and ETL/ELT processes in the Azure Synapse environment, especially if you want to refactor existing legacy processes.

### Microsoft services for physical data transfer

The following sections discuss a range of products and services that Microsoft offers to assist customers with data transfer.

#### Azure ExpressRoute

[Azure ExpressRoute](../../../expressroute/expressroute-introduction.md) creates private connections between Azure data centers and infrastructure on your premises or in a collocation environment. ExpressRoute connections don't go over the public internet, and offer more reliability, faster speeds, and lower latencies than typical internet connections. In some cases, you gain significant cost benefits by using ExpressRoute connections to transfer data between on-premises systems and Azure.

#### AzCopy

[AzCopy](../../../storage/common/storage-use-azcopy-v10.md) is a command line utility that copies files to Azure Blob Storage over a standard internet connection. In a warehouse migration project, you can use AzCopy to upload extracted, compressed, delimited text files before loading them into Azure Synapse using [PolyBase](#polybase). AzCopy can upload individual files, file selections, or file folders. If the exported files are in Parquet format, use a native Parquet reader instead.

#### Azure Data Box

[Azure Data Box](../../../databox/data-box-overview.md) is a Microsoft service that provides you with a proprietary physical storage device that you can copy migration data onto. You then ship the device to an Azure data center for data upload to cloud storage. This service can be cost-effective for large volumes of data, such as tens or hundreds of terabytes, or where network bandwidth isn't readily available. Azure Data Box is typically used for a large one-off historical data load into Azure Synapse.

#### Azure Data Box Gateway

[Azure Data Box Gateway](../../../databox-gateway/data-box-gateway-overview.md) is a virtualized cloud storage gateway device that resides on your premises and sends your images, media, and other data to Azure. Use Data Box Gateway for one-off migration tasks or ongoing incremental data uploads.

### Microsoft services for data ingestion

The following sections discuss the products and services that Microsoft offers to assist customers with data ingestion.

#### COPY INTO

The [COPY INTO](/sql/t-sql/statements/copy-into-transact-sql#syntax) statement provides the most flexibility for high-throughput data ingestion into Azure Synapse. For more information about `COPY INTO` capabilities, see [COPY (Transact-SQL)](/sql/t-sql/statements/copy-into-transact-sql).

#### PolyBase

[PolyBase](../../sql/load-data-overview.md) is the fastest, most scalable method for bulk data load into Azure Synapse. PolyBase uses the massively parallel processing (MPP) architecture of Azure Synapse for parallel loading of data to achieve the fastest throughput. PolyBase can read data from flat files in Azure Blob Storage, or directly from external data sources and other relational databases via connectors.

>[!TIP]
>PolyBase can load data in parallel from Azure Blob Storage into Azure Synapse.

PolyBase can also directly read from files compressed with gzip to reduce the physical volume of data during a load process. PolyBase supports popular data formats such as delimited text, ORC, and Parquet.

>[!TIP]
>You can invoke PolyBase from Data Factory as part of a migration pipeline.

PolyBase is tightly integrated with Data Factory to support rapid development of data load ETL/ELT processes. You can schedule data load processes through a visual UI for higher productivity and fewer errors than hand-written code. Microsoft recommends PolyBase for data ingestion into Azure Synapse, especially for high-volume data ingestion.

PolyBase uses `CREATE TABLE AS` or `INSERT...SELECT` statements to load data. `CREATE TABLE AS` minimizes logging to achieve the highest throughput. The most efficient input format for data load is compressed delimited text files. For maximum throughput, split large input files into multiple smaller files and load them in parallel. For fastest loading to a staging table, define the target table as `HEAP` type and use round-robin distribution.

PolyBase has some limitations, it requires data row length to be less than 1 megabyte and doesn't support fixed-width nested formats like JSON and XML.

### Microsoft partners for Teradata migrations

[Microsoft partners](../../partner/data-integration.md) offer tools, services, and expertise to help you migrate your legacy on-premises data warehouse platform to Azure Synapse.

## Next steps

To learn more about implementing modern data warehouses, see the next article in this series: [Beyond Teradata migration, implement a modern data warehouse in Microsoft Azure](7-beyond-data-warehouse-migration.md).
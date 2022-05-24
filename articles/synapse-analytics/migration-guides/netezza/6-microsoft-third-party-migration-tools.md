---
title: "Tools for Netezza data warehouse migration to Azure Synapse Analytics"
description: Learn about Microsoft and third-party data and database migration tools that can help you migrate from Netezza to Azure Synapse. 
ms.service: synapse-analytics
ms.subservice: sql-dw
ms.custom:
ms.devlang:
ms.topic: conceptual
author: ajagadish-24
ms.author: ajagadish
ms.reviewer: wiassaf
ms.date: 05/24/2022
---

# Tools for Netezza data warehouse migration to Azure Synapse Analytics

This article is part six of a seven part series that provides guidance on how to migrate from Netezza to Azure Synapse Analytics. This article provides best practices for Microsoft and third-party tools.

## Data warehouse migration tools

Migrating your existing data warehouse to Azure Synapse enables you to utilize:

- A globally secure, scalable, low-cost, cloud-native, pay-as-you-use analytical database

- The rich Microsoft analytical ecosystem that exists on Azure consists of technologies to help modernize your data warehouse once it's migrated and extend your analytical capabilities to drive new value

Several tools from Microsoft and third-party partner vendors can help you migrate your existing data warehouse to Azure Synapse.

They include:

- Microsoft data and database migration tools

- Third-party data warehouse automation tools to automate and document the migration to Azure Synapse

- Third-party data warehouse migration tools to migrate schema and data to Azure Synapse

- Third-party tools to minimize the impact on SQL differences between your existing data warehouse DBMS and Azure Synapse

Let's look at these in more detail.

## Microsoft data migration tools

> [!TIP]
> Data Factory includes tools to help migrate your data and your entire data warehouse to Azure.

Microsoft offers several tools to help you migrate your existing data warehouse to Azure Synapse. They are:

- Microsoft Azure Data Factory

- Microsoft services for physical data transfer

- Microsoft services for data ingestion

### Microsoft Azure Data Factory

Microsoft Azure Data Factory is a fully managed, pay-as-you-use, hybrid data integration service for highly scalable ETL and ELT processing. It uses Spark to process and analyze data in parallel and in memory to maximize throughput.

> [!TIP]
> Data Factory allows you to build scalable data integration pipelines code free.

[Azure Data Factory connectors](/azure/data-factory/connector-overview?msclkid=00086e4acff211ec9263dee5c7eb6e69) connect to external data sources and databases and have templates for common data integration tasks. A visual front-end, browser-based, GUI enables non-programmers to create and run process pipelines to ingest, transform, and load data, while more experienced programmers have the option to incorporate custom code if necessary, such as Python programs.

> [!TIP]
> Data Factory enables collaborative development between business and IT professionals.

Data Factory is also an orchestration tool. It's the best Microsoft tool to automate the end-to-end migration process to reduce risk and make the migration process easily repeatable. The following diagram shows a Data Factory mapping data flow.

:::image type="content" source="../media/6-microsoft-3rd-party-migration-tools/azure-data-factory-mapping-dataflows.png" border="true" alt-text="Screenshot showing an example of an Azure Data Factory mapping dataflow." lightbox="../media/6-microsoft-3rd-party-migration-tools/azure-data-factory-mapping-dataflows-lrg.png":::

The next screenshot shows a Data Factory wrangling data flow.

:::image type="content" source="../media/6-microsoft-3rd-party-migration-tools/azure-data-factory-wrangling-dataflows.png" border="true" alt-text="Screenshot showing an example of Azure Data Factory wrangling dataflows.":::

Development of simple or comprehensive ETL and ELT processes without coding or maintenance, with a few clicks. These processes ingest, move, prepare, transform, and process your data. Design and manage scheduling and triggers in Azure Data Factory to build an automated data integration and loading environment. Define, manage, and schedule PolyBase bulk data load processes in Data Factory.

> [!TIP]
> Data Factory includes tools to help migrate your data and your entire data warehouse to Azure.

Use Data Factory to implement and manage a hybrid environment that includes on-premises, cloud, streaming and SaaS data&mdash;for example, from applications like Salesforce&mdash;in a secure and consistent way.

A new capability in Data Factory is wrangling data flows. This opens up Data Factory to business users to make use of platform and allows them to visually discover, explore, and prepare data at scale without writing code. This easy-to-use Data Factory capability is like Microsoft Excel Power Query or Microsoft Power BI Dataflows, where self-service data preparation business users use a spreadsheet style user interface, with drop-down transforms, to prepare and integrate data.

Azure Data Factory is the recommended approach for implementing data integration and ETL/ELT processes for an Azure Synapse environment, especially if existing legacy processes need to be refactored.

### Microsoft services for physical data transfer

> [!TIP]
> Microsoft offers a range of products and services to assist with data transfer.

#### Azure ExpressRoute

Azure ExpressRoute creates private connections between Azure data centers and infrastructure on your premises or in a collocation environment. ExpressRoute connections don't go over the public Internet, and they offer more reliability, faster speeds, and lower latencies than typical Internet connections. In some cases, using ExpressRoute connections to transfer data between on-premises systems and Azure can give you significant cost benefits.

#### AzCopy

[AzCopy](/azure/storage/common/storage-use-azcopy-v10) is a command line utility that copies files to Azure Blob Storage via a standard internet connection. You can use it to upload extracted, compressed, delimited text files before loading via PolyBase or native parquet reader (if the exported files are parquet) in a warehouse migration project. Individual files, file selections, and file directories can be uploaded.

#### Azure Data Box

Microsoft offers a service called Azure Data Box. This service writes data to be migrated to a physical storage device. This device is then shipped to an Azure data center and loaded into cloud storage. This service can be cost-effective for large volumes of data&mdash;for example, tens or hundreds of terabytes&mdash;or where network bandwidth isn't readily available and is typically used for the one-off historical data load when migrating a large amount of data to Azure Synapse.

Another service available is Data Box Gateway, a virtualized cloud storage gateway device that resides on your premises and sends your images, media, and other data to Azure. Use Data Box Gateway for one-off migration tasks or ongoing incremental data uploads.

### Microsoft services for data ingestion

#### COPY INTO

The [COPY](/sql/t-sql/statements/copy-into-transact-sql) statement provides the most flexibility for high-throughput data ingestion into Azure Synapse Analytics. Refer to the list of capabilities that `COPY` offers for data ingestion.

#### PolyBase

> [!TIP]
> PolyBase can load data in parallel from Azure Blob Storage into Azure Synapse.

PolyBase provides the fastest and most scalable method of loading bulk data into Azure Synapse. PolyBase leverages the MPP architecture to use parallel loading, to give the fastest throughput, and can read data from flat files in Azure Blob Storage or directly from external data sources and other relational databases via connectors.

PolyBase can also directly read from files compressed with gzip&mdash;this reduces the physical volume of data moved during the load process. PolyBase supports popular data formats such as delimited text, ORC and Parquet.

> [!TIP]
> Invoke PolyBase from Azure Data Factory as part of a migration pipeline.

PolyBase is tightly integrated with Azure Data Factory (see next section) to enable data load ETL/ELT processes to be rapidly developed and scheduled via a visual GUI, leading to higher productivity and fewer errors than hand-written code.

PolyBase is the recommended data load method for Azure Synapse, especially for high-volume data. PolyBase loads data using the `CREATE TABLE AS` or `INSERT...SELECT` statements&mdash;CTAS achieves the highest possible throughput as it minimizes the amount of logging required. Compressed delimited text files are the most efficient input format. For maximum throughput, split very large input files into multiple smaller files and load these in parallel. For fastest loading to a staging table, define the target table as type `HEAP` and use round-robin distribution.

There are some limitations in PolyBase. Rows to be loaded must be less than 1 MB in length. Fixed-width format or nested data such as JSON and XML aren't directly readable.

## Microsoft partners to help you migrate your data warehouse to Azure Synapse Analytics

In addition to tools that can help you with various aspects of data warehouse migration, there are several practiced [Microsoft partners](/azure/synapse-analytics/partner/data-integration) that can bring their expertise to help you move your legacy on-premises data warehouse platform to Azure Synapse.

## Next steps

To learn more about implementing modern data warehouses, see the next article in this series: [Beyond Netezza migration, implementing a modern data warehouse in Microsoft Azure](7-beyond-data-warehouse-migration.md).

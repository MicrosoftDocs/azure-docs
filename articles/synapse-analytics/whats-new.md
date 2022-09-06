---
title: What's new? 
description: Learn about the new features and documentation improvements for Azure Synapse Analytics
author: ryanmajidi
ms.author: rymajidi 
ms.reviewer: wiassaf, sngun
ms.service: synapse-analytics
ms.subservice: overview
ms.topic: conceptual
ms.date: 09/06/2022
---

# What's new in Azure Synapse Analytics?

See below for a review of what's new in [Azure Synapse Analytics](overview-what-is.md), and also what features are currently in preview. To follow the latest in Azure Synapse news and features, see the [Azure Synapse Analytics Blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/bg-p/AzureSynapseAnalyticsBlog) and [companion videos on YouTube](https://www.youtube.com/channel/UCsZ4IlYjjVxqe5OZ14tyh5g).

For older updates, review past [Azure Synapse Analytics Blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/bg-p/AzureSynapseAnalyticsBlog) posts or [previous monthly updates in Azure Synapse Analytics](whats-new-archive.md).

## New features currently in preview

The following table lists the features of Azure Synapse Analytics that are currently in preview:

| **Feature** |  **Learn more**|
|:-- |:-- | 
| **Spark Delta Lake tables in serverless SQL pools** | The ability to for serverless SQL pools to access Delta Lake tables created in Spark databases is in preview. For more information, see [Azure Synapse Analytics shared metadata tables](metadata/table.md).|
| **Multi-column distribution in dedicated SQL pools** | You can now Hash Distribute tables on multiple columns for a more even distribution of the base table, reducing data skew over time and improving query performance. For more information on opting-in to the preview, see [CREATE TABLE distribution options](/sql/t-sql/statements/create-table-azure-sql-data-warehouse#TableDistributionOptions) or [CREATE TABLE AS SELECT distribution options](/sql/t-sql/statements/create-table-as-select-azure-sql-data-warehouse#table-distribution-options).|
| **Distribution Advisor**| The Distribution Advisor is a new preview feature in Azure Synapse dedicated SQL pools Gen2 that analyzes queries and recommends the best distribution strategies for tables to improve query performance. For more information, see [Distribution Advisor in Azure Synapse SQL](sql/distribution-advisor.md).|
| **Spark elastic pool storage** | Azure Synapse Analytics Spark pools now support elastic pool storage in preview. Elastic pool storage allows the Spark engine to monitor worker nodes temporary storage and attach additional disks if needed. No action is required, and you should see less job failures as a result. For more information, see [Blog: Azure Synapse Analytics Spark elastic pool storage is available for public preview](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-august-update-2022/ba-p/3535126#TOCREF_8).|
| **Spark Optimized Write** | Optimize Write is a Delta Lake on Synapse feature that reduces the number of files written by Apache Spark 3 (3.1 and 3.2) and aims to increase individual file size of the written data. To learn more about the usage scenarios and how to enable this preview feature, read [The need for optimize write on Apache Spark](spark/optimize-write-for-apache-spark.md).|
| **Distributed Deep Neural Network Training**  | Learn more about new distributed training libraries like Horovod, Petastorm, TensorFlow, and PyTorch in [Deep learning tutorials](./machine-learning/concept-deep-learning.md). |
| **Azure Synapse Link for SQL** | Azure Synapse Link for SQL is in preview for both SQL Server 2022 and Azure SQL Database. The Azure Synapse Link feature provides low- and no-code, near real-time data replication from your SQL-based operational stores into Azure Synapse Analytics. Provide BI reporting on operational data in near real-time, with minimal impact on your operational store. To learn more, read [Announcing the Public Preview of Azure Synapse Link for SQL](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/announcing-the-public-preview-of-azure-synapse-link-for-sql/ba-p/3372986) and [watch our YouTube video](https://www.youtube.com/embed/pgusZy34-Ek). |
| **Apache Spark&trade; 3.2 on Synapse Analytics** | Apache Spark&trade; 3.2 on Synapse Analytics with preview availability. Review the [official release notes](https://spark.apache.org/releases/spark-release-3-2-0.html) and [migration guidelines between Spark 3.1 and 3.2](https://spark.apache.org/docs/latest/sql-migration-guide.html#upgrading-from-spark-sql-31-to-32) to assess potential changes to your applications. For more details, read [Apache Spark version support and Azure Synapse Runtime for Apache Spark 3.2](./spark/apache-spark-version-support.md). |
| **Intelligent Cache feature** | Intelligent Cache for Spark automatically stores each read within the allocated cache storage space, detecting underlying file changes and refreshing the files to provide the most recent data. To learn more, see how to [Enable/Disable the cache for your Apache Spark pool](./spark/apache-spark-intelligent-cache-concept.md) or see the [blog post](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-march-update-2022/ba-p/3269194#TOCREF_12).|
| **Data flow improvements to Data Preview** | To learn more, see [Data Preview and debug improvements in Mapping Data Flows](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/data-preview-and-debug-improvements-in-mapping-data-flows/ba-p/3268254?wt.mc_id=azsynapseblog_mar2022_blog_azureeng). |
| **User-Assigned managed identities** | Now you can use user-assigned managed identities in linked services for authentication in Synapse Pipelines and Dataflows.To learn more, see [Credentials in Azure Data Factory and Azure Synapse](../data-factory/credentials.md?context=%2Fazure%2Fsynapse-analytics%2Fcontext%2Fcontext&tabs=data-factory).|
| **Browse ADLS Gen2 folders in the Azure Synapse Analytics workspace** | You can now browse an Azure Data Lake Storage Gen2 (ADLS Gen2) container or folder in your Azure Synapse Analytics workspace by connecting to a specific container or folder in Synapse Studio. To learn more, see [Browse an ADLS Gen2 folder with ACLs in Azure Synapse Analytics](how-to-access-container-with-access-control-lists.md).|
| **Custom partitions for Synapse link for Azure Cosmos DB** | Improve query execution times for your Spark queries, by creating custom partitions based on fields frequently used in your queries. To learn more, see [Custom partitioning in Azure Synapse Link for Azure Cosmos DB (Preview)](../cosmos-db/custom-partitioning-analytical-store.md). | 
| **Map data tool** | The Map Data tool is a guided process to help users create ETL mappings and mapping data flows from their source data to Synapse lake database tables without writing code. To learn more, see [Map Data in Azure Synapse Analytics](./database-designer/overview-map-data.md). |
| **Azure Synapse Data Explorer** | The [Azure Synapse Data Explorer](./data-explorer/data-explorer-overview.md) provides an interactive query experience to unlock insights from log and telemetry data. |

## Generally available features 

The following table lists the features of Azure Synapse Analytics that have transitioned from preview to general availability (GA) within the last 12 months:

|**Month** | **Feature** |  **Learn more**|
|:-- |:-- | :-- |
| June 2022 | **Map Data tool** | The Map Data tool is a guided process to help you create ETL mappings and mapping data flows from your source data to Synapse without writing code. To learn more about the Map Data tool, read [Map Data in Azure Synapse Analytics](./database-designer/overview-map-data.md).|
| June 2022 | **User Defined Functions** | User defined functions (UDFs) are now generally available. To learn more, read [User defined functions in mapping data flows](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/introducing-user-defined-functions-preview-for-mapping-data/ba-p/3414628). |
| May 2022 | **Azure Synapse Data Explorer connector for Power Automate, Logic Apps, and Power Apps** | The Azure Data Explorer connector for Power Automate enables you to orchestrate and schedule flows, send notifications, and alerts, as part of a scheduled or triggered task. To learn more, read [Azure Data Explorer connector for Microsoft Power Automate](/data-explorer/flow) and [Usage examples for Azure Data Explorer connector to Power Automate](/azure/data-explorer/flow-usage). |
| April 2022 | **Cross-subscription restore for Azure Synapse SQL** | With the PowerShell Az.Sql module 3.8 update, the [Restore-AzSqlDatabase](/powershell/module/az.sql/restore-azsqldatabase) cmdlet can be used for cross-subscription restore of dedicated SQL pools. To learn more, see [Blog: Restore a dedicated SQL pool (formerly SQL DW) to a different subscription](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-april-update-2022/ba-p/3280185).|
| April 2022 | **Database Designer** | The database designer allows users to visually create databases within Synapse Studio without writing a single line of code. For more information, see [Announcing General Availability of Database Designer](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/announcing-general-availability-of-database-designer-amp/ba-p/3294234). Read more about [lake databases](database-designer/concepts-lake-database.md) and learn [How to modify an existing lake database using the database designer](database-designer/modify-lake-database.md).|
| April 2022 | **Database Templates** | Learn more about the industry-specific database templates in the [Synapse Database Templates General Availability blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/synapse-database-templates-general-availability-and-new-synapse/ba-p/3289790). Learn more about [Database templates](database-designer/concepts-database-templates.md).|
| April 2022 | **Synapse Monitoring Operator RBAC role** | The Synapse Monitoring Operator RBAC (role-based access control) role allows a user persona to monitor the execution of Synapse Pipelines and Spark applications without having the ability to run or cancel the execution of these applications. For more information, review the [Synapse RBAC Roles](security/synapse-workspace-synapse-rbac-roles.md).|
| March 2022 | **Flowlets** | Flowlets help you design portions of new data flow logic, or to extract portions of an existing data flow, and save them as separate artifact inside your Synapse workspace. Then, you can reuse these Flowlets can inside other data flows. To learn more, review the [Flowlets GA announcement blog post](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/flowlets-and-change-feed-now-ga-in-azure-data-factory/ba-p/3267450) and read [Flowlets in mapping data flow](../data-factory/concepts-data-flow-flowlet.md). |
| March 2022 | **Change Feed connectors** | Changed data capture (CDC) feed data flow source transformations for Cosmos DB, Azure Blob Storage, ADLS Gen1, ADLS Gen2, and Common Data Model (CDM) are now generally available. By simply checking a box, you can tell ADF to manage a checkpoint automatically for you and only read the latest rows that were updated or inserted since the last pipeline run. To learn more, review the [Change Feed connectors GA preview blog post](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/flowlets-and-change-feed-now-ga-in-azure-data-factory/ba-p/3267450) and read [Copy and transform data in Azure Data Lake Storage Gen2 using Azure Data Factory or Azure Synapse Analytics](../data-factory/connector-azure-data-lake-storage.md).|
| March 2022 | **Column Level Encryption for dedicated SQL Pools** | Column level encryption for dedicated SQL pools is now generally available. To learn more, see [how to encrypt a data column](/sql/relational-databases/security/encryption/encrypt-a-column-of-data?view=azure-sqldw-latest&preserve-view=true).|
| March 2022 | **Synapse Spark Common Data Model (CDM) connector** | The CDM format reader/writer enables a Spark program to read and write CDM entities in a CDM folder via Spark dataframes. To learn more, see [how the CDM connector supports reading, writing data, examples, & known issues](./spark/data-sources/apache-spark-cdm-connector.md).|
| November 2021 | **PREDICT** | The T-SQL [PREDICT](/sql/t-sql/queries/predict-transact-sql) syntax is now generally available for dedicated SQL pools. Get started with the [Machine learning model scoring wizard for dedicated SQL pools](./machine-learning/tutorial-sql-pool-model-scoring-wizard.md).|
| October 2021 | **Synapse RBAC Roles** | [Synapse RBAC roles are now generally available for use in production](https://techcommunity.microsoft.com/t5/azure-synapse-analytics/azure-synapse-analytics-october-update/ba-p/2875372#synapse-rbac). Learn more about [Synapse RBAC roles](./security/synapse-workspace-synapse-rbac-roles.md) and [Azure Synapse role-based access control (RBAC) using PowerShell](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/retrieve-azure-synapse-role-based-access-control-rbac/ba-p/3466419#:~:text=Synapse%20RBAC%20is%20used%20to%20manage%20who%20can%3A,job%20execution%2C%20review%20job%20output%2C%20and%20execution%20logs.).| 

## General

This section summarizes recent improvements and new capabilities of Azure Synapse Analytics.

|**Month** | **Feature** |  **Learn more**|
|:-- |:-- | :-- |
| June 2022 | **Azure Orbital analytics with Synapse Analytics** | We now offer an [Azure Orbital analytics sample solution](https://github.com/Azure/Azure-Orbital-Analytics-Samples) showing an end-to-end implementation of extracting, loading, transforming, and analyzing spaceborne data by using geospatial libraries and AI models with Azure Synapse Analytics. The sample solution also demonstrates how to integrate geospatial-specific [Azure Cognitive Services](../cognitive-services/index.yml) models, AI models from partners, and bring-your-own-data models. |
| June 2022 | **Azure Synapse success by design** | The [Azure Synapse proof of concept playbook](./guidance/proof-of-concept-playbook-overview.md) provides a guide to scope, design, execute, and evaluate a proof of concept for SQL or Spark workloads. |

## Azure Synapse Analytics Apache Spark

This section summarizes recent new features and capabilities of [Apache Spark in Azure Synapse Analytics](spark/apache-spark-overview.md).

|**Month** | **Feature** |  **Learn more**|
|:-- |:-- | :-- |
| September 2022 | **New query optimization techniques in Apache Spark for Azure Synapse** | Read the [findings from Microsoft's work](http://vldb.org/pvldb/vol15/p936-rajan.pdf) to gain considerable performance benefits across the board on the reference TPC-DS workload as well as a significant reduction in query plan generation time. |
| August 2022 | **Spark elastic pool storage** | Azure Synapse Analytics Spark pools now support elastic pool storage in preview. Elastic pool storage allows the Spark engine to monitor worker nodes temporary storage and attach additional disks if needed. No action is required, and you should see less job failures as a result. For more information, see [Blog: Azure Synapse Analytics Spark elastic pool storage is available for public preview](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-august-update-2022/ba-p/3535126#TOCREF_8).|
| August 2022 | **Spark Optimized Write** | Optimize Write is a Delta Lake on Synapse feature that reduces the number of files written by Apache Spark 3 (3.1 and 3.2) and aims to increase individual file size of the written data. To learn more about the usage scenarios and how to enable this preview feature, read [The need for optimize write on Apache Spark](spark/optimize-write-for-apache-spark.md).|

## Data integration

This section summarizes recent new features and capabilities of Azure Synapse Analytics data integration topics. Learn how to [Load data into Azure Synapse Analytics using Azure Data Factory or a Synapse pipeline](../data-factory/load-azure-sql-data-warehouse.md).

|**Month** | **Feature** |  **Learn more**|
|:-- |:-- | :-- |
| June 2022 | **Fuzzy Join option in Join Transformation** | Fuzzy matching with a sliding similarity score option has been added to the Join transformation in Mapping Data Flows. For learn more about fuzzy joins, read [Join transformation in mapping data flow](../data-factory/data-flow-join.md).|
| June 2022 | **Map Data [Generally Available]** | We're excited to announce that the Map Data tool is now Generally Available. The Map Data tool is a guided process to help you create ETL mappings and mapping data flows from your source data to Synapse without writing code. To learn more about Map Data, read [Map Data in Azure Synapse Analytics](./database-designer/overview-map-data.md).|
| June 2022 | **Rerun pipeline with new parameters** | You can now change pipeline parameters when re-running a pipeline from the Monitoring page without having to return to the pipeline editor. To learn more, read [Rerun pipelines and activities](../data-factory/monitor-visually.md#rerun-pipelines-and-activities).|
| June 2022 | **User Defined Functions [Generally Available]** | User defined functions (UDFs) are now Generally Available. To learn more, read [User defined functions in mapping data flows](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/introducing-user-defined-functions-preview-for-mapping-data/ba-p/3414628). |
| March 2022 | **sFTP connector for Synapse data flows** | A native sftp connector in Synapse data flows is supported to read and write data from sFTP using the visual low-code data flows interface in Synapse. To learn more, see [Copy and transform data in SFTP server using Azure Data Factory or Azure Synapse Analytics](../data-factory/connector-sftp.md).| 

## Database Templates & Database Designer

This section summarizes recent new features and capabilities of [database templates](./database-designer/overview-database-templates.md) and [the database designer](database-designer/quick-start-create-lake-database.md).

|**Month** | **Feature** |  **Learn more**|
|:-- |:-- | :-- |
| July 2022 | **Browse industry templates** | Browse industry templates and add tables to create your own lake database. Learn more about [ways you can browse industry templates](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/ways-you-can-browse-industry-templates-and-add-tables-to-create/ba-p/3495011) and get started with [Quickstart: Create a new lake database leveraging database templates](database-designer/quick-start-create-lake-database.md).|
| January 2022 | **New database templates** | Learn more about new industry-specific [Automotive, Genomics, Manufacturing, and Pharmaceuticals templates](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/four-additional-azure-synapse-database-templates-now-available/ba-p/3058044) and get started with [database templates](./database-designer/overview-database-templates.md) in the Synapse Studio gallery. |

## Azure Synapse Data Explorer (preview)

This section summarizes recent new features and capabilities of [the Azure Synapse Data Explorer](data-explorer/data-explorer-overview.md).

|**Month** | **Feature** |  **Learn more**|
|:-- |:-- | :-- |
| June 2022 | **Web Explorer new homepage** | The new Azure Synapse [Web Explorer homepage](https://dataexplorer.azure.com/home) makes it even easier to get started with Synapse Web Explorer. |
| June 2022 | **Web Explorer sample gallery** | The Web Explorer sample gallery provides end-to-end samples of how customers leverage Synapse Data Explorer popular use cases such as Logs Data, Metrics Data, IoT data and Basic big data examples. See [Azure Data Explorer in 60 minutes with the new samples gallery](https://techcommunity.microsoft.com/t5/azure-data-explorer-blog/azure-data-explorer-in-60-minutes-with-the-new-samples-gallery/ba-p/3447552). |
| June 2022 | **Web Explorer dashboards drill through capabilities** | You can now add drill through capabilities to your Synapse Web Explorer dashboards. To learn more, read [Use drillthroughs as dashboard parameters](/azure/data-explorer/dashboard-parameters#use-drillthroughs-as-dashboard-parameters). |
| June 2022 | **Time Zone settings for Web Explorer** | The Time Zone settings of the Web Explorer now apply to both the Query results and to the Dashboard. By changing the time zone, the dashboards will be automatically refreshed to present the data with the selected time zone. For more information on time zone settings, read [Change datetime to specific time zone](/azure/data-explorer/web-query-data#change-datetime-to-specific-time-zone). |

## Developer experience

This section summarizes recent new quality of life and feature improvements for [developers in Azure Synapse Analytics](sql/develop-overview.md).

|**Month** | **Feature** |  **Learn more**|
|:-- |:-- | :-- |
| May 2022 | **Updated Azure Synapse Analyzer Report** | Learn about the new features in [version 2.0 of the Synapse Analyzer report](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/updated-synapse-analyzer-report-workload-management-and-ability/ba-p/3580269).|
| April 2022 | **Azure Synapse Analyzer Report** | The Azure Synapse Analyzer Report is created to help you identify common issues that may be present in your database that can lead to performance issues. Learn more about using the [Azure Synapse Analyzer Report to monitor and improve Azure Synapse SQL Dedicated Pool performance](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analyzer-report-to-monitor-and-improve-azure/ba-p/3276960).|

## Machine Learning

This section summarizes recent new features and improvements to using machine learning models in Azure Synapse Analytics.

|**Month** | **Feature** |  **Learn more**|
|:-- |:-- | :-- |
| August 2022 | **SynapseML v.0.10.0** | New release of SynapseML v0.10.0 (Previously MMLSpark), an open-source library that aims to simplify the creation of massively scalable machine learning pipelines. Learn more about the [latest additions to SynapseML](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/exciting-new-release-of-synapseml/ba-p/3589606) and get started with [SynapseML](https://aka.ms/spark).|
| June 2022 | **Distributed Deep Neural Network Training [Public Preview]** | The Azure Synapse runtime also includes supporting libraries like Petastorm and Horovod, which are commonly used for distributed training. The Azure Synapse Analytics runtime for Apache Spark 3.1 and 3.2 also now includes support for the most common deep learning libraries like TensorFlow and PyTorch. This feature is currently available in preview. To learn more about how to leverage these libraries within your Azure Synapse Analytics GPU-accelerated pools, read the [Deep learning tutorials](./machine-learning/concept-deep-learning.md). |
| November 2021 | **PREDICT** | The T-SQL [PREDICT](/sql/t-sql/queries/predict-transact-sql) syntax is now generally available for dedicated SQL pools. Get started with the [Machine learning model scoring wizard for dedicated SQL pools](./machine-learning/tutorial-sql-pool-model-scoring-wizard.md).|

## Security

This section summarizes recent new security features and settings in Azure Synapse Analytics.

|**Month** | **Feature** |  **Learn more**|
|:-- |:-- | :-- |
| March 2022 | **Enforce minimal TLS version** | You can now raise or lower the minimum TLS version for dedicated SQL pools in Synapse workspaces. To learn more, see [Azure SQL connectivity settings](/sql/azure-sql/database/connectivity-settings) and [API reference: how to update the minimum TLS setting](/rest/api/synapse/sqlserver/workspace-managed-sql-server-dedicated-sql-minimal-tls-settings/update).|

## Synapse Link

This section summarizes recent news about the Azure Synapse Link to SQL feature.

|**Month** | **Feature** |  **Learn more**|
|:-- |:-- | :-- |
| May 2022 | **Synapse Link for SQL preview** | The [Azure Synapse Link for SQL preview has been announced](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/announcing-the-public-preview-of-azure-synapse-link-for-sql/ba-p/3372986). |

## Synapse SQL

This section summarizes recent improvements and features in SQL pools in Azure Synapse Analytics.

|**Month** | **Feature** |  **Learn more**|
|:-- |:-- | :-- |
| August 2022| **Spark Delta Lake tables in serverless SQL pools** | The ability to for serverless SQL pools to access Delta Lake tables created in Spark databases is in preview. For more information, see [Azure Synapse Analytics shared metadata tables](metadata/table.md).|
| August 2022| **Multi-column distribution in dedicated SQL pools** | You can now Hash Distribute tables on multiple columns for a more even distribution of the base table, reducing data skew over time and improving query performance. For more information on opting-in to the preview, see [CREATE TABLE distribution options](/sql/t-sql/statements/create-table-azure-sql-data-warehouse#TableDistributionOptions) or [CREATE TABLE AS SELECT distribution options](/sql/t-sql/statements/create-table-as-select-azure-sql-data-warehouse#table-distribution-options).|
| August 2022| **Distribution Advisor**| The Distribution Advisor is a new preview feature in Azure Synapse dedicated SQL pools Gen2 that analyzes queries and recommends the best distribution strategies for tables to improve query performance. For more information, see [Distribution Advisor in Azure Synapse SQL](sql/distribution-advisor.md).|
| August 2022 | **Add SQL objects and users in Lake databases** | New capabilities announced for lake databases in serverless SQL pools: create schemas, views, procedures, inline table-valued functions. You can also database users from your Azure Active Directory domain and assign them to the db_datareader role. For more information, see [Access lake databases using serverless SQL pool in Azure Synapse Analytics](metadata/database.md#custom-sql-metadata-objects) and [Create and use native external tables using SQL pools in Azure Synapse Analytics](sql/create-use-external-tables.md).|
| June 2022 | **Result set size limit increase** | The [maximum size of query result sets](./sql/resources-self-help-sql-on-demand.md?tabs=x80070002#constraints) in serverless SQL pools has been increased from 200GB to 400GB.  |



## Next steps

 - [Get started with Azure Synapse Analytics](get-started.md)
 - [Azure Synapse Analytics Blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/bg-p/AzureSynapseAnalyticsBlog)
 - [Azure Synapse Analytics terminology](overview-terminology.md)
 - [Azure Synapse Analytics migration guides](migration-guides/index.yml)
 - [Azure Synapse Analytics frequently asked questions](overview-faq.yml)
 
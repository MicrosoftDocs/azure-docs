---
title: Previous monthly updates in Azure Synapse Analytics
description: Archive of the new features and documentation improvements for Azure Synapse Analytics
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.reviewer: rymajidi, sngun
ms.date: 07/21/2023
ms.service: synapse-analytics
ms.subservice: overview
ms.topic: conceptual
---

# What's New in Azure Synapse Analytics Archive

This article describes previous month updates to Azure Synapse Analytics. For the most current month's release, check out [Azure Synapse Analytics latest updates](whats-new.md). Each update links to the Azure Synapse Analytics blog and an article that provides more information.

## Generally available features

The following table lists a past history of the features of Azure Synapse Analytics that have transitioned from preview to general availability (GA).

|**Month** | **Feature** |  **Learn more**|
|:-- |:-- | :-- | 
| July 2022 | **Apache Spark&trade; 3.2 for Synapse Analytics** | Apache Spark&trade; 3.2 for Synapse Analytics is now generally available. Review the [official release notes](https://spark.apache.org/releases/spark-release-3-2-0.html) and [migration guidelines between Spark 3.1 and 3.2](https://spark.apache.org/docs/latest/sql-migration-guide.html#upgrading-from-spark-sql-31-to-32) to assess potential changes to your applications. For more details, read [Apache Spark version support and Azure Synapse Runtime for Apache Spark 3.2](./spark/apache-spark-version-support.md). Highlights of what got better in Spark 3.2 in the [Azure Synapse Analytics July Update 2022](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-july-update-2022/ba-p/3535089#TOCREF_1).|
| July 2022 | **Apache Spark in Azure Synapse Intelligent Cache feature** | Intelligent Cache for Spark automatically stores each read within the allocated cache storage space, detecting underlying file changes and refreshing the files to provide the most recent data. To learn more, see how to [Enable/Disable the cache for your Apache Spark pool](./spark/apache-spark-intelligent-cache-concept.md).|
| June 2022 | **Map Data tool** | The Map Data tool is a guided process to help you create ETL mappings and mapping data flows from your source data to Synapse without writing code. To learn more about the Map Data tool, read [Map Data in Azure Synapse Analytics](./database-designer/overview-map-data.md).|
| June 2022 | **User Defined Functions** | User defined functions (UDFs) are now generally available. To learn more, read [User defined functions in mapping data flows](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/introducing-user-defined-functions-preview-for-mapping-data/ba-p/3414628). |
| May 2022 | **Azure Synapse Data Explorer connector for Power Automate, Logic Apps, and Power Apps** | The Azure Data Explorer connector for Power Automate enables you to orchestrate and schedule flows, send notifications, and alerts, as part of a scheduled or triggered task. To learn more, read [Azure Data Explorer connector for Microsoft Power Automate](/azure/data-explorer/flow) and [Usage examples for Azure Data Explorer connector to Power Automate](/azure/data-explorer/flow-usage). |
| April 2022 | **Cross-subscription restore for Azure Synapse SQL** | With the PowerShell `Az.Sql` module 3.8 update, the [Restore-AzSqlDatabase](/powershell/module/az.sql/restore-azsqldatabase) cmdlet can be used for cross-subscription restore of dedicated SQL pools. To learn more, see [Blog: Restore a dedicated SQL pool (formerly SQL DW) to a different subscription](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-april-update-2022/ba-p/3280185). This feature is now generally available for dedicated SQL pools (formerly SQL DW) and dedicated SQL pools in a Synapse workspace. [What's the difference?](https://aka.ms/dedicatedSQLpooldiff) |
| April 2022 | **Database Designer** | The database designer allows users to visually create databases within Synapse Studio without writing a single line of code. For more information, see [Announcing General Availability of Database Designer](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/announcing-general-availability-of-database-designer-amp/ba-p/3294234). Read more about [lake databases](database-designer/concepts-lake-database.md) and learn [How to modify an existing lake database using the database designer](database-designer/modify-lake-database.md).|
| April 2022 | **Database Templates** | New industry-specific database templates were introduced in the [Synapse Database Templates General Availability blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/synapse-database-templates-general-availability-and-new-synapse/ba-p/3289790). Learn more about [Database templates](database-designer/concepts-database-templates.md) and [the improved exploration experience](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-april-update-2022/ba-p/3295633#TOCREF_5).|
| April 2022 | **Synapse Monitoring Operator RBAC role** | The Synapse Monitoring Operator RBAC (role-based access control) role allows a user persona to monitor the execution of Synapse Pipelines and Spark applications without having the ability to run or cancel the execution of these applications. For more information, review the [Synapse RBAC Roles](security/synapse-workspace-synapse-rbac-roles.md).|
| March 2022 | **Flowlets** | Flowlets help you design portions of new data flow logic, or to extract portions of an existing data flow, and save them as separate artifact inside your Synapse workspace. Then, you can reuse these Flowlets can inside other data flows. To learn more, review the [Flowlets GA announcement blog post](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/flowlets-and-change-feed-now-ga-in-azure-data-factory/ba-p/3267450) and read [Flowlets in mapping data flow](../data-factory/concepts-data-flow-flowlet.md). |
| March 2022 | **Change Feed connectors** | Changed data capture (CDC) feed data flow source transformations for Azure Cosmos DB, Azure Blob Storage, ADLS Gen1, ADLS Gen2, and Common Data Model (CDM) are now generally available. By simply checking a box, you can tell ADF to manage a checkpoint automatically for you and only read the latest rows that were updated or inserted since the last pipeline run. To learn more, review the [Change Feed connectors GA preview blog post](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/flowlets-and-change-feed-now-ga-in-azure-data-factory/ba-p/3267450) and read [Copy and transform data in Azure Data Lake Storage Gen2 using Azure Data Factory or Azure Synapse Analytics](../data-factory/connector-azure-data-lake-storage.md).|
| March 2022 | **Column level encryption for dedicated SQL pools** | [Column level encryption](/sql/relational-databases/security/encryption/encrypt-a-column-of-data?view=azure-sqldw-latest&preserve-view=true) is now generally available for use on new and existing Azure SQL logical servers with Azure Synapse dedicated SQL pools and dedicated SQL pools in Azure Synapse workspaces. SQL Server Data Tools (SSDT) support for column level encryption for the dedicated SQL pools is available starting with the 17.2 Preview 2 build of Visual Studio 2022. |
| March 2022 | **Synapse Spark Common Data Model (CDM) connector** | The CDM format reader/writer enables a Spark program to read and write CDM entities in a CDM folder via Spark dataframes. To learn more, see [how the CDM connector supports reading, writing data, examples, & known issues](./spark/data-sources/apache-spark-cdm-connector.md). |
| November 2021 | **PREDICT** | The T-SQL [PREDICT](/sql/t-sql/queries/predict-transact-sql) syntax is now generally available for dedicated SQL pools. Get started with the [Machine learning model scoring wizard for dedicated SQL pools](./machine-learning/tutorial-sql-pool-model-scoring-wizard.md).|
| October 2021 | **Synapse RBAC Roles** | [Synapse role-based access control (RBAC) roles are now generally available](https://techcommunity.microsoft.com/t5/azure-synapse-analytics/azure-synapse-analytics-october-update/ba-p/2875372#synapse-rbac). Learn more about [Synapse RBAC roles](./security/synapse-workspace-synapse-rbac-roles.md) and [Azure Synapse role-based access control (RBAC) using PowerShell](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/retrieve-azure-synapse-role-based-access-control-rbac/ba-p/3466419#:~:text=Synapse%20RBAC%20is%20used%20to%20manage%20who%20can%3A,job%20execution%2C%20review%20job%20output%2C%20and%20execution%20logs.).|

## Community

This section is an archive of Azure Synapse Analytics community opportunities and the [Azure Synapse Influencer program](https://aka.ms/synapseinfluencers) from Microsoft. 

|**Month** | **Feature** |  **Learn more**|
|:-- |:-- | :-- |
| May 2022 | **Azure Synapse Influencer program** | Sign up for our free [Azure Synapse Influencer program](https://aka.ms/synapseinfluencers) and get connected with a community of Synapse-users who are dedicated to helping others achieve more with cloud analytics. Register now for our next [Synapse Influencer Ask the Experts session](https://aka.ms/synapseinfluencers/#events). It's free to attend and everyone is welcome to participate and join the discussion on Synapse-related topics. You can [watch past recorded Ask the Experts events](https://aka.ms/ATE-RecordedSessions) on the [Azure Synapse YouTube channel](https://www.youtube.com/channel/UCsZ4IlYjjVxqe5OZ14tyh5g). |
| March 2022 | **Azure Synapse Analytics and Microsoft MVP YouTube video series** | A joint activity with the Azure Synapse product team and the Microsoft MVP community, a new [YouTube MVP Video Series about the Azure Synapse features](https://www.youtube.com/playlist?list=PLzUAjXZBFU9MEK2trKw_PGk4o4XrOzw4H) has launched. See more at the [Azure Synapse Analytics YouTube channel](https://www.youtube.com/channel/UCsZ4IlYjjVxqe5OZ14tyh5g).|

## Apache Spark for Azure Synapse Analytics

This section is an archive of features and capabilities of [Apache Spark for Azure Synapse Analytics](spark/apache-spark-overview.md).

|**Month** | **Feature** |  **Learn more**|
|:-- |:-- | :-- |
| May 2022 | **Azure Synapse dedicated SQL pool connector for Apache Spark now available in Python** | Previously, the [Azure Synapse Dedicated SQL Pool Connector for Apache Spark](./spark/synapse-spark-sql-pool-import-export.md) was only available using Scala. Now, [the dedicated SQL pool connector for Apache Spark can be used with Python on Spark 3](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-may-update-2022/ba-p/3430970#TOCREF_6). |
| May 2022 | **Manage Azure Synapse Apache Spark configuration** | With the new [Apache Spark configurations](./spark/apache-spark-azure-create-spark-configuration.md) feature, you can create a standalone Spark configuration artifact with auto-suggestions and built-in validation rules. The Spark configuration artifact allows you to share your Spark configuration within and across Azure Synapse workspaces. You can also easily associate your Spark configuration with a Spark pool, a Notebook, and a Spark job definition for reuse and minimize the need to copy the Spark configuration in multiple places. |
| April 2022 | **Apache Spark 3.2 for Synapse Analytics** | Apache Spark 3.2 for Synapse Analytics with preview availability. Review the [official Spark 3.2 release notes](https://spark.apache.org/releases/spark-release-3-2-0.html) and [migration guidelines between Spark 3.1 and 3.2](https://spark.apache.org/docs/latest/sql-migration-guide.html#upgrading-from-spark-sql-31-to-32) to assess potential changes to your applications. For more details, read [Apache Spark version support and Azure Synapse Runtime for Apache Spark 3.2](./spark/apache-spark-version-support.md). |
| April 2022 | **Parameterization for Spark job definition** | You can now assign parameters dynamically based on variables, metadata, or specifying Pipeline specific parameters for the Spark job definition activity. For more details, read [Transform data using Apache Spark job definition](quickstart-transform-data-using-spark-job-definition.md#settings-tab). |
| April 2022 | **Apache Spark notebook snapshot** | You can access a snapshot of the Notebook when there's a Pipeline Notebook run failure or when there's a long-running Notebook job. To learn more, read [Transform data by running a Synapse notebook](synapse-notebook-activity.md?tabs=classical#see-notebook-activity-run-history) and [Introduction to Microsoft Spark utilities](./spark/microsoft-spark-utilities.md?pivots=programming-language-scala#reference-a-notebook-1). |
| March 2022 | **Synapse Spark Common Data Model (CDM) connector** | The CDM format reader/writer enables a Spark program to read and write CDM entities in a CDM folder via Spark dataframes. To learn more, see [how the CDM connector supports reading, writing data, examples, & known issues](./spark/data-sources/apache-spark-cdm-connector.md). |
| March 2022 | **Performance optimization for Synapse Spark dedicated SQL pool connector** | New improvements to the [Azure Synapse Dedicated SQL Pool Connector for Apache Spark](spark/synapse-spark-sql-pool-import-export.md) reduce data movement and leverage `COPY INTO`. Performance tests indicated at least ~5x improvement over the previous version. No action is required from the user to leverage these enhancements. For more information, see [Blog: Synapse Spark Dedicated SQL Pool (DW) Connector: Performance Improvements](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-march-update-2022/ba-p/3269194#TOCREF_10).|
| March 2022 | **Support for all Spark Dataframe SaveMode choices** | The [Azure Synapse Dedicated SQL Pool Connector for Apache Spark](spark/synapse-spark-sql-pool-import-export.md) now supports all four Spark Dataframe SaveMode choices: Append, Overwrite, ErrorIfExists, Ignore. For more information on Spark SaveMode, read the [official Apache Spark documentation](https://spark.apache.org/docs/1.6.0/api/java/org/apache/spark/sql/SaveMode.html?wt.mc_id=azsynapseblog_mar2022_blog_azureeng). |
| March 2022 | **Apache Spark in Azure Synapse Analytics Intelligent Cache feature** | Intelligent Cache for Spark automatically stores each read within the allocated cache storage space, detecting underlying file changes and refreshing the files to provide the most recent data. To learn more on this preview feature, see how to [Enable/Disable the cache for your Apache Spark pool](./spark/apache-spark-intelligent-cache-concept.md) or see the [blog post](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-march-update-2022/ba-p/3269194#TOCREF_12).|

## Data integration

This section is an archive of features and capabilities of Azure Synapse Analytics data integration. Learn how to [Load data into Azure Synapse Analytics using Azure Data Factory (ADF) or a Synapse pipeline](../data-factory/load-azure-sql-data-warehouse.md).

|**Month** | **Feature** |  **Learn more**|
|:-- |:-- | :-- | 
| June 2022 | **SAP CDC connector preview** | A new data connector for SAP Change Data Capture (CDC) is now available in preview. For more information, see [Announcing Public Preview of the SAP CDC solution in Azure Data Factory and Azure Synapse Analytics](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/announcing-public-preview-of-the-sap-cdc-solution-in-azure-data/ba-p/3420904) and [SAP CDC solution in Azure Data Factory](../data-factory/sap-change-data-capture-introduction-architecture.md).|
| June 2022 | **Fuzzy join option in Join Transformation** | Use fuzzy matching with a similarity threshold score slider has been added to the [Join transformation in Mapping Data Flows](../data-factory/data-flow-join.md). |
| June 2022 | **Map Data tool GA** | We're excited to announce that the [Map Data tool](./database-designer/overview-map-data.md) is now Generally Available. The Map Data tool is a guided process to help you create ETL mappings and mapping data flows from your source data to Synapse without writing code. |
| June 2022 | **Rerun pipeline with new parameters** | You can now change pipeline parameters when rerunning a pipeline from the Monitoring page without having to return to the pipeline editor. To learn more, read [Rerun pipelines and activities](../data-factory/monitor-visually.md#rerun-pipelines-and-activities).|
| June 2022 | **User Defined Functions GA** | [User defined functions (UDFs) in mapping data flows](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/introducing-user-defined-functions-preview-for-mapping-data/ba-p/3414628) are now generally available (GA). |
| May 2022 | **Export pipeline monitoring as a CSV** | The ability to [export pipeline monitoring to CSV and other monitoring improvements](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/adf-monitoring-improvements/ba-p/3295531) have been introduced to ADF. |
| May 2022 | **Automatic incremental source data loading from PostgreSQL and MySQL** | Automatic [incremental source data loading from PostgreSQL and MySQL](../data-factory/tutorial-incremental-copy-overview.md) to Synapse SQL and Azure Database is now natively available in ADF. |
| May 2022 | **Assert transformation error handling** | Error handling has now been added to sinks following an [assert transformation in mapping data flow](../data-factory/data-flow-assert.md). You can now choose whether to output the failed rows to the selected sink or to a separate file. |
| May 2022 | **Mapping data flows projection editing** | In mapping data flows, you can now [update source projection column names and column types](../data-factory/data-flow-source.md). |
| April 2022 | **Dataverse connector for Synapse Data Flows** | Dataverse is now a source and sink connector to Synapse Data Flows. You can [Copy and transform data from Dynamics 365 (Microsoft Dataverse) or Dynamics CRM using Azure Data Factory or Azure Synapse Analytics](../data-factory/connector-dynamics-crm-office-365.md?tabs=data-factory).|
| April 2022 | **Configurable Synapse Pipelines Web activity response timeout** | With the response timeout property `httpRequestTimeout`, you can [define a timeout for the HTTP request up to 10 minutes](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/web-activity-response-timeout-improvement/ba-p/3260307). Web activities work exceptionally well with APIs that follow [the asynchronous request-reply pattern](/azure/architecture/patterns/async-request-reply), a suggested approach for building scalable web APIs/services. |
| March 2022 | **sFTP connector for Synapse data flows** | A native sftp connector in Synapse data flows is supported to read and write data from sFTP using the visual low-code data flows interface in Synapse. To learn more, see [Copy and transform data in SFTP server using Azure Data Factory or Azure Synapse Analytics](../data-factory/connector-sftp.md).|
| March 2022 | **Data flow improvements to Data Preview** | Review features added to the [Data Preview and debug improvements in Mapping Data Flows](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/data-preview-and-debug-improvements-in-mapping-data-flows/ba-p/3268254?wt.mc_id=azsynapseblog_mar2022_blog_azureeng). |
| March 2022 | **Pipeline script activity** | You can now [Transform data by using the Script activity](../data-factory/transform-data-using-script.md) to invoke SQL commands to perform both DDL and DML. |
| December 2021 | **Custom partitions for Synapse link for Azure Cosmos DB** | Improve query execution times for your Spark queries, by creating custom partitions based on fields frequently used in your queries. To learn more, see [Custom partitioning in Azure Synapse Link for Azure Cosmos DB (Preview)](../cosmos-db/custom-partitioning-analytical-store.md). |

## Database Templates & Database Designer

This section is an archive of features and capabilities of [database templates](./database-designer/overview-database-templates.md) and [the database designer](database-designer/quick-start-create-lake-database.md).

|**Month** | **Feature** |  **Learn more**|
|:-- |:-- | :-- |
| April 2022 | **Database Designer** | The database designer allows users to visually create databases within Synapse Studio without writing a single line of code. For more information, see [Announcing General Availability of Database Designer](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/announcing-general-availability-of-database-designer-amp/ba-p/3294234). Read more about [lake databases](database-designer/concepts-lake-database.md) and learn [How to modify an existing lake database using the database designer](database-designer/modify-lake-database.md).|
| April 2022 | **Database Templates** | New industry-specific database templates were introduced in the [Synapse Database Templates General Availability blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/synapse-database-templates-general-availability-and-new-synapse/ba-p/3289790). Learn more about [Database templates](database-designer/concepts-database-templates.md) and [the improved exploration experience](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-april-update-2022/ba-p/3295633#TOCREF_5).|
| April 2022 | **Clone lake database** | In Synapse Studio, you can now clone a database using the action menu available on the lake database. To learn more, read [How-to: Clone a lake database](./database-designer/clone-lake-database.md). |
| April 2022 | **Use wildcards to specify custom folder hierarchies** | Lake databases sit on top of data that is in the lake and this data can live in nested folders that don't fit into clean partition patterns. You can now use wildcards to specify custom folder hierarchies. To learn more, read [How-to: Modify a datalake](./database-designer/modify-lake-database.md). |
| January 2022 | **New database templates** | Learn more about new industry-specific [Automotive, Genomics, Manufacturing, and Pharmaceuticals templates](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/four-additional-azure-synapse-database-templates-now-available/ba-p/3058044) and get started with [database templates](./database-designer/overview-database-templates.md) in the Synapse Studio gallery. |

## Developer experience

This section is an archive of quality of life and feature improvements for [developers in Azure Synapse Analytics](sql/develop-overview.md).

|**Month** | **Feature** |  **Learn more**|
|:-- |:-- | :-- |
| May 2022 | **Updated Azure Synapse Analyzer Report** | Learn about the new features in [version 2.0 of the Synapse Analyzer report](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/updated-synapse-analyzer-report-workload-management-and-ability/ba-p/3580269).|
| April 2022 | **Azure Synapse Analyzer Report** | The [Azure Synapse Analyzer Report](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analyzer-report-to-monitor-and-improve-azure/ba-p/3276960) helps you identify common issues that may be present in your database that can lead to performance issues.|
| April 2022 | **Reference unpublished notebooks** | Now, when using %run notebooks, you can [enable 'unpublished notebook reference'](spark/apache-spark-development-using-notebooks.md#reference-unpublished-notebook), which will allow you to reference unpublished notebooks. When enabled, notebook run will fetch the current contents in the notebook web cache, meaning the changes in your notebook editor can be referenced immediately by other notebooks without having to be published (Live mode) or committed (Git mode). |
| March 2022 | **Code cells with exception to show standard output**| Now in Synapse notebooks, both standard output and exception messages are shown when a code statement fails for Python and Scala languages. For examples, see [Synapse notebooks: Code cells with exception to show standard output](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-march-update-2022/ba-p/3269194#TOCREF_1).|
| March 2022 | **Partial output is available for running notebook code cells** | Now in Synapse notebooks, you can see anything you write (with `println` commands, for example) as the cell executes, instead of waiting until it ends. For examples, see [Synapse notebooks: Partial output is available for running notebook code cells ](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-march-update-2022/ba-p/3269194#TOCREF_1).|
| March 2022 | **Dynamically control your Spark session configuration with pipeline parameters** | Now in Synapse notebooks, you can use pipeline parameters to configure the session with the notebook %%configure magic. For examples, see [Synapse notebooks: Dynamically control your Spark session configuration with pipeline parameters](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-march-update-2022/ba-p/3269194#TOCREF_2).|
| March 2022 | **Reuse and manage notebook sessions** | Now in Synapse notebooks, it's easy to reuse an active session conveniently without having to start a new one and to see and manage your active sessions in the **Active sessions** list. To view your sessions, select the 3 dots in the notebook and select **Manage sessions.** For examples, see [Synapse notebooks: Reuse and manage notebook sessions](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-march-update-2022/ba-p/3269194#TOCREF_3).|
| March 2022 | **Support for Python logging** | Now in Synapse notebooks, anything written through the Python logging module is captured, in addition to the driver logs. For examples, see [Synapse notebooks: Support for Python logging](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-march-update-2022/ba-p/3269194#TOCREF_4).|

## Machine Learning

This section is an archive of features and improvements to machine learning models in Azure Synapse Analytics.

|**Month** | **Feature** |  **Learn more**|
|:-- |:-- | :-- |
| June 2022 | **Distributed Deep Neural Network Training (preview)** | The Azure Synapse runtime also includes supporting libraries like Petastorm and Horovod, which are commonly used for distributed training. This feature is currently available in preview. The Azure Synapse Analytics runtime for Apache Spark 3.1 and 3.2 also now includes support for the most common deep learning libraries like TensorFlow and PyTorch. To learn more about how to leverage these libraries within your Azure Synapse Analytics GPU-accelerated pools, read the [Deep learning tutorials](./machine-learning/concept-deep-learning.md). |
| November 2021 | **PREDICT** | The T-SQL [PREDICT](/sql/t-sql/queries/predict-transact-sql) syntax is now generally available for dedicated SQL pools. Get started with the [Machine learning model scoring wizard for dedicated SQL pools](./machine-learning/tutorial-sql-pool-model-scoring-wizard.md).|

## Samples and guidance

This section is an archive of guidance and sample project resources for Azure Synapse Analytics.

|**Month** | **Feature** |  **Learn more**|
|:-- |:-- | :-- |
| June 2022 | **Azure Orbital analytics with Synapse Analytics** | We now offer an [Azure Orbital analytics sample solution](https://github.com/Azure/Azure-Orbital-Analytics-Samples) showing an end-to-end implementation of extracting, loading, transforming, and analyzing spaceborne data by using geospatial libraries and AI models with Azure Synapse Analytics. The sample solution also demonstrates how to integrate geospatial-specific [Azure AI services](../ai-services/index.yml) models, AI models from partners, and bring-your-own-data models. |
| June 2022 | **Migration guides for Oracle** | A new Microsoft-authored migration guide for Oracle to Azure Synapse Analytics is now available. [Design and performance for Oracle migrations](migration-guides/oracle/1-design-performance-migration.md). |
| June 2022 | **Azure Synapse success by design** | The [Azure Synapse proof of concept playbook](./guidance/proof-of-concept-playbook-overview.md) provides a guide to scope, design, execute, and evaluate a proof of concept for SQL or Spark workloads. |
| June 2022 | **Migration guides for Teradata** | A new Microsoft-authored migration guide for Teradata to Azure Synapse Analytics is now available. [Design and performance for Teradata migrations](migration-guides/teradata/1-design-performance-migration.md). |
| June 2022 | **Migration guides for IBM Netezza** | A new Microsoft-authored migration guide for IBM Netezza to Azure Synapse Analytics is now available. [Design and performance for IBM Netezza migrations](migration-guides/netezza/1-design-performance-migration.md). |

## Security

This section is an archive of security features and settings in Azure Synapse Analytics.

|**Month** | **Feature** |  **Learn more**|
|:-- |:-- | :-- |
| April 2022 | **Synapse Monitoring Operator RBAC role** | The Synapse Monitoring Operator role-based access control (RBAC) role allows a user persona to monitor the execution of Synapse Pipelines and Spark applications without having the ability to run or cancel the execution of these applications. For more information, review the [Synapse RBAC Roles](security/synapse-workspace-synapse-rbac-roles.md).|
| March 2022 | **Enforce minimal TLS version** | You can now raise or lower the minimum TLS version for dedicated SQL pools in Synapse workspaces. To learn more, see [Azure SQL connectivity settings](/azure/azure-sql/database/connectivity-settings#minimal-tls-version). The [workspace managed SQL API](/rest/api/synapse/sqlserver/workspace-managed-sql-server-dedicated-sql-minimal-tls-settings/update) can be used to modify the minimum TLS settings.|
| March 2022 | **Azure Synapse Analytics now supports Azure Active Directory (Azure AD) only authentication** | You can now use Azure Active Directory authentication to centrally manage access to all Azure Synapse resources, including SQL pools. You can [disable local authentication](sql/active-directory-authentication.md#disable-local-authentication) upon creation or after a workspace is created through the Azure portal.|
| December 2021 | **User-Assigned managed identities** | Now you can use user-assigned managed identities in linked services for authentication in Synapse Pipelines and Dataflows. To learn more, see [Credentials in Azure Data Factory and Azure Synapse](../data-factory/credentials.md?context=%2Fazure%2Fsynapse-analytics%2Fcontext%2Fcontext&tabs=data-factory).|
| December 2021 | **Browse ADLS Gen2 folders in the Azure Synapse Analytics workspace** | You can now [browse and secure an Azure Data Lake Storage Gen2 (ADLS Gen2) container or folder](how-to-access-container-with-access-control-lists.md) in your Azure Synapse Analytics workspace by connecting to a specific container or folder in Synapse Studio.|
| December 2021 | **TLS 2.1 enforced for new Synapse Workspaces** | Starting in December 2021, [a requirement for TLS 1.2](security/connectivity-settings.md#minimal-tls-version) has been implemented for new Synapse Workspaces only. |

## Azure Synapse Data Explorer  

Azure Data Explorer (ADX) is a fast and highly scalable data exploration service for log and telemetry data. It offers ingestion from Event Hubs, IoT Hubs, blobs written to blob containers, and Azure Stream Analytics jobs. This section is an archive of features and capabilities of [the Azure Synapse Data Explorer](data-explorer/data-explorer-overview.md) and [the Kusto Query Language (KQL)](/azure/data-explorer/kusto/query/). Read more about [What is the difference between Azure Synapse Data Explorer and Azure Data Explorer? (Preview)](data-explorer/data-explorer-compare.md)

|**Month** | **Feature** |  **Learn more**|
|:-- |:-- | :-- |
| June 2022 | **Web Explorer new homepage** | The new Azure Synapse [Web Explorer homepage](https://dataexplorer.azure.com/home) makes it even easier to get started with Synapse Web Explorer. |
| June 2022 | **Web Explorer sample gallery** | The [Web Explorer sample gallery]((https://techcommunity.microsoft.com/t5/azure-data-explorer-blog/azure-data-explorer-in-60-minutes-with-the-new-samples-gallery/ba-p/3447552) provides end-to-end samples of how customers leverage Synapse Data Explorer popular use cases such as Logs Data, Metrics Data, IoT data and Basic big data examples. |
| June 2022 | **Web Explorer dashboards drill through capabilities** | You can now [use drillthroughs as parameters in your Synapse Web Explorer dashboards](/azure/data-explorer/dashboard-parameters#use-drillthroughs-as-dashboard-parameters). |
| June 2022 | **Time Zone settings for Web Explorer** | The [Time Zone settings of the Web Explorer](/azure/data-explorer/web-query-data#change-datetime-to-specific-time-zone) now apply to both the Query results and to the Dashboard. By changing the time zone, the dashboards will be automatically refreshed to present the data with the selected time zone. |
| May 2022 | **Synapse Data Explorer live query in Excel** | Using the [new Data Explorer web experience Open in Excel feature](https://techcommunity.microsoft.com/t5/azure-data-explorer-blog/open-live-kusto-query-in-excel/ba-p/3198500), you can now provide access to live results of your query by sharing the connected Excel Workbook with colleagues and team members. You can open the live query in an Excel Workbook and refresh it directly from Excel to get the most up to date query results. To create an Excel Workbook connected to Synapse Data Explorer, [start by running a query in the Web experience](https://aka.ms/adx.help.livequery). |
| May 2022 | **Use Managed Identities for external SQL Server tables** | With Managed Identity support, Synapse Data Explorer table definition is now simpler and more secure. You can now [use managed identities](/azure/data-explorer/managed-identities-overview) instead of entering in your credentials. To learn more about external tables, read [Create and alter SQL Server external tables](/azure/data-explorer/kusto/management/external-sql-tables).|
| May 2022 | **Azure Synapse Data Explorer connector for Microsoft Power Automate, Logic Apps, and Power Apps** | New Azure Data Explorer connectors for Power Automate are generally available (GA). To learn more, read [Azure Data Explorer connector for Microsoft Power Automate](/azure/data-explorer/flow), the [Microsoft Logic App and Azure Data Explorer](/azure/data-explorer/kusto/tools/logicapps), and the ability to [Create Power Apps application to query data in Azure Data Explorer](/azure/data-explorer/power-apps-connector). |
| May 2022 | **Dynamic events routing from event hub to multiple databases** | We now support [routing events data from Azure Event Hub/Azure IoT Hub/Azure Event Grid to multiple databases](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-may-update-2022/ba-p/3430970#TOCREF_15) hosted in a single ADX cluster. To learn more about dynamic routing, read [Ingest from event hub](/azure/data-explorer/ingest-data-event-hub-overview#events-routing). |
| May 2022 | **Configure a database using a KQL inline script as part of JSON ARM deployment template** | Running a [Kusto Query Language (KQL) script to configure your database](/azure/data-explorer/database-script) can now be done using an inline script provided inline as a parameter to a JSON ARM template. |

## Azure Synapse Link

Azure Synapse Link is an automated system for replicating data from [SQL Server or Azure SQL Database](synapse-link/sql-synapse-link-overview.md), [Azure Cosmos DB](../cosmos-db/synapse-link.md?context=%2fazure%2fsynapse-analytics%2fcontext%2fcontext), or [Dataverse](/power-apps/maker/data-platform/export-to-data-lake?context=%2Fazure%2Fsynapse-analytics%2Fcontext%2Fcontext) into Azure Synapse Analytics. This section is an archive of news about the Azure Synapse Link feature.

|**Month** | **Feature** |  **Learn more**|
|:-- |:-- | :-- |
| May 2022 | **Azure Synapse Link for SQL preview** | Azure Synapse Link for SQL is in preview for both SQL Server 2022 and Azure SQL Database. The Azure Synapse Link feature provides low- and no-code, near real-time data replication from your SQL-based operational stores into Azure Synapse Analytics. Provide BI reporting on operational data in near real-time, with minimal impact on your operational store. The [Azure Synapse Link for SQL preview has been announced](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/announcing-the-public-preview-of-azure-synapse-link-for-sql/ba-p/3372986). For more information, see [Blog: Azure Synapse Link for SQL Deep Dive](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/synapse-link-for-sql-deep-dive/ba-p/3567645).|

## Synapse SQL

This section is an archive of improvements and features in SQL pools in Azure Synapse Analytics.

|**Month** | **Feature** |  **Learn more**|
|:-- |:-- | :-- |
| June 2022 | **Result set size limit increase** | The [maximum size of query result sets](./sql/resources-self-help-sql-on-demand.md?tabs=x80070002#constraints) in serverless SQL pools has been increased from 200 GB to 400 GB.  |
| May 2022 | **Automatic character column length calculation for serverless SQL pools** | It's no longer necessary to define character column lengths for serverless SQL pools in the data lake. You can get optimal query performance [without having to define the schema](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-may-update-2022/ba-p/3430970#TOCREF_4), because the serverless SQL pool will use automatically calculated average column lengths and cardinality estimation. |
| April 2022 | **Cross-subscription restore for Azure Synapse SQL GA** | With the PowerShell `Az.Sql` module 3.8 update, the [Restore-AzSqlDatabase](/powershell/module/az.sql/restore-azsqldatabase) cmdlet can be used for cross-subscription restore of dedicated SQL pools. To learn more, see [Restore a dedicated SQL pool to a different subscription](sql-data-warehouse/sql-data-warehouse-restore-active-paused-dw.md#restore-an-existing-dedicated-sql-pool-formerly-sql-dw-to-a-different-subscription-through-powershell). This feature is now generally available for dedicated SQL pools (formerly SQL DW) and dedicated SQL pools in a Synapse workspace. [What's the difference?](https://aka.ms/dedicatedSQLpooldiff)|
| April 2022 | **Recover SQL pool from dropped server or workspace** | With the PowerShell Restore cmdlets in `Az.Sql` and `Az.Synapse` modules, you can now restore from a deleted server or workspace without filing a support ticket. For more information, see [Restore a dedicated SQL pool from a deleted Azure Synapse workspace](backuprestore/restore-sql-pool-from-deleted-workspace.md) or [Restore a standalone dedicated SQL pools (formerly SQL DW) from a deleted server](backuprestore/restore-sql-pool-from-deleted-workspace.md), depending on your scenario.  |
| March 2022 | **Column level encryption for dedicated SQL pools** | [Column level encryption](/sql/relational-databases/security/encryption/encrypt-a-column-of-data?view=azure-sqldw-latest&preserve-view=true) is now generally available for use on new and existing Azure SQL logical servers with Azure Synapse dedicated SQL pools and dedicated SQL pools in Azure Synapse workspaces. SQL Server Data Tools (SSDT) support for column level encryption for the dedicated SQL pools is available starting with the 17.2 Preview 2 build of Visual Studio 2022.|
| March 2022 | **Parallel execution for CETAS** | Better performance for [CREATE TABLE AS SELECT](sql/develop-tables-cetas.md) (CETAS) and subsequent SELECT statements now made possible by use of parallel execution plans. For examples, see [Better performance for CETAS and subsequent SELECTs](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-march-update-2022/ba-p/3269194#TOCREF_7).|

## Previous monthly updates in Azure Synapse Analytics

What follows are the previous format of monthly news updates for Synapse Analytics.

## June 2022 update

### General

* **Azure Orbital analytics with Synapse Analytics** - We now offer an [Azure Orbital analytics sample solution](https://github.com/Azure/Azure-Orbital-Analytics-Samples) showing an end-to-end implementation of extracting, loading, transforming, and analyzing spaceborne data by using geospatial libraries and AI models with [Azure Synapse Analytics](overview-what-is.md). The sample solution also demonstrates how to integrate geospatial-specific [Azure AI services](../ai-services/index.yml) models, AI models from partners, and bring-your-own-data models.

* **Azure Synapse success by design** - Project success is no accident and requires careful planning and execution. The Synapse Analytics' Success by Design playbooks are now available. The [Azure Synapse proof of concept playbook](./guidance/proof-of-concept-playbook-overview.md) provides a guide to scope, design, execute, and evaluate a proof of concept for SQL or Spark workloads. These guides contain best practices from the most challenging and complex solution implementations incorporating Azure Synapse. To learn more about the Azure Synapse proof of concept playbook, read [Success by Design](./guidance/success-by-design-introduction.md).

### SQL

**Result set size limit increase** - We know that you turn to Azure Synapse Analytics to work with large amounts of data. With that in mind, the maximum size of query result sets in Serverless SQL pools has been increased from 200 GB to 400 GB. This limit is shared between concurrent queries. To learn more about this size limit increase and other constraints, read [Self-help for serverless SQL pool](./sql/resources-self-help-sql-on-demand.md?tabs=x80070002#constraints).

### Synapse data explorer

* **Web Explorer new homepage** - The new Synapse Web Explorer homepage makes it even easier to get started with Synapse Web Explorer. The [Web Explorer homepage](https://dataexplorer.azure.com/home) now includes the following sections:

  * Get started – Sample gallery offering example queries and dashboards for popular Synapse Data Explorer use cases.  
  * Recommended – Popular learning modules designed to help you master Synapse Web Explorer and KQL. 
  * Documentation – Synapse Web Explorer basic and advanced documentation.

* **Web Explorer sample gallery** - A great way to learn about a product is to see how it is being used by others. The Web Explorer sample gallery provides end-to-end samples of how customers leverage Synapse Data Explorer popular use cases such as Logs Data, Metrics Data, IoT data and Basic big data examples. Each sample includes the dataset, well-documented queries, and a sample dashboard. To learn more about the sample gallery, read [Azure Data Explorer in 60 minutes with the new samples gallery](https://techcommunity.microsoft.com/t5/azure-data-explorer-blog/azure-data-explorer-in-60-minutes-with-the-new-samples-gallery/ba-p/3447552).

* **Web Explorer dashboards drill through capabilities** - You can now add drill through capabilities to your Synapse Web Explorer dashboards. The new drill through capabilities allow you to easily jump back and forth between dashboard pages. This is made possible by using a contextual filter to connect your dashboards. Defining these contextual drill throughs is done by editing the visual interactions of the selected tile in your dashboard. To learn more about drill through capabilities, read [Use drillthroughs as dashboard parameters](/azure/data-explorer/dashboard-parameters#use-drillthroughs-as-dashboard-parameters).

* **Time Zone settings for Web Explorer** - Being able to display data in different time zones is very powerful. You can now decide to view the data in UTC time, your local time zone, or the time zone of the monitored device/machine. The Time Zone settings of the Web Explorer now apply to both the Query results and to the Dashboard. By changing the time zone, the dashboards will be automatically refreshed to present the data with the selected time zone.  For more information on time zone settings, read [Change datetime to specific time zone](/azure/data-explorer/web-query-data#change-datetime-to-specific-time-zone).

### Data integration

* **Fuzzy Join option in Join Transformation** - Fuzzy matching with a sliding similarity score option has been added to the Join transformation in Mapping Data Flows. You can create inner and outer joins on data values that are similar rather than exact matches! Previously, you would have had to use an exact match. The sliding scale value goes from 60% to 100%, making it easy to adjust the similarity threshold of the match. For learn more about fuzzy joins, read [Join transformation in mapping data flow](../data-factory/data-flow-join.md).

* **Map Data [Generally Available]** - We're excited to announce that the Map Data tool is now Generally Available. The Map Data tool is a guided process to help you create ETL mappings and mapping data flows from your source data to Synapse without writing code. To learn more about Map Data, read [Map Data in Azure Synapse Analytics](./database-designer/overview-map-data.md).

* **Rerun pipeline with new parameters** - You can now change pipeline parameters when rerunning a pipeline from the Monitoring page without having to return to the pipeline editor. After running a pipeline with new parameters, you can easily monitor the new run against the old ones without having to toggle between pages.  To learn more about rerunning pipelines with new parameters, read [Rerun pipelines and activities](../data-factory/monitor-visually.md#rerun-pipelines-and-activities).

* **User Defined Functions [Generally Available]** - We're excited to announce that user defined functions (UDFs) are now Generally Available. With user-defined functions, you can create customized expressions that can be reused across multiple mapping data flows. You no longer have to use the same string manipulation, math calculations, or other complex logic several times. User-defined functions will be grouped in libraries to help developers group common sets of functions.  To learn more about user defined functions, read [User defined functions in mapping data flows](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/introducing-user-defined-functions-preview-for-mapping-data/ba-p/3414628).

### Machine learning

**Distributed Deep Neural Network Training with Horovod and Petastorm [Public Preview]** - To simplify the process for creating and managing GPU-accelerated pools, Azure Synapse takes care of pre-installing low-level libraries and setting up all the complex networking requirements between compute nodes. This integration allows users to get started with GPU- accelerated pools within just a few minutes.

Now, Azure Synapse Analytics provides built-in support for deep learning infrastructure.  The Azure Synapse Analytics runtime for Apache Spark 3.1 and 3.2 now includes support for the most common deep learning libraries like TensorFlow and PyTorch. The Azure Synapse runtime also includes supporting libraries like Petastorm and Horovod, which are commonly used for distributed training. This feature is currently available in Public Preview.

To learn more about how to leverage these libraries within your Azure Synapse Analytics GPU-accelerated pools, read the [Deep learning tutorials](./machine-learning/concept-deep-learning.md).

## May 2022 update

The following updates are new to Azure Synapse Analytics this month.

### General

**Get connected with the new Azure Synapse Influencer program!**  [Join a community of Azure Synapse Influencers](https://aka.ms/synapseinfluencers) who are helping each other achieve more with cloud analytics! The Azure Synapse Influencer program recognizes Azure Synapse Analytics users and advocates who actively support the community by sharing Synapse-related content, announcements, and product news via social media.

### SQL

* **Data Warehouse Migration guide for Dedicated SQL Pools in Azure Synapse Analytics** - With the benefits that cloud migration offers, we hear that you often look for steps, processes, or guidelines to follow for quick and easy migrations from existing data warehouse environments. We just released a set of [Data Warehouse migration guides](./migration-guides/index.yml) to make your transition to dedicated SQL Pools in Azure Synapse Analytics easier.

* **Automatic character column length calculation** - It's no longer necessary to define character column lengths!  Serverless SQL pools let you query files in the data lake without knowing the schema upfront. The best practice was to specify the lengths of character columns to get optimal performance. Not anymore! With this new feature, you can get optimal query performance without having to define the schema. The serverless SQL pool will calculate the average column length for each inferred character column or character column defined as larger than 100 bytes. The schema will stay the same, while the serverless SQL pool will use the calculated average column lengths internally. It will also automatically calculate the cardinality estimation in case there was no previously created statistic.

### Apache Spark for Synapse

* **Azure Synapse Dedicated SQL Pool Connector for Apache Spark Now Available in Python** - Previously, the Azure Synapse Dedicated SQL Pool connector was only available using Scala.  Now, it can be used with Python on Spark 3.  The only difference between the Scala and Python implementations is the optional Scala callback handle, which allows you to receive post-write metrics.

  The following are now supported in Python on Spark 3:

  * Read using Azure Active Directory (AD) Authentication or Basic Authentication 
  * Write to Internal Table using Azure AD Authentication or Basic Authentication 
  * Write to External Table using Azure AD Authentication or Basic Authentication

  To learn more about the connector in Python, read [Azure Synapse Dedicated SQL Pool Connector for Apache Spark](./spark/synapse-spark-sql-pool-import-export.md).

* **Manage Azure Synapse Apache Spark configuration** - Apache Spark configuration management is always a challenging task because Spark has hundreds of properties. It is also challenging for you to know the optimal value for Spark configurations. With the new Spark configuration management feature, you can create a standalone Spark configuration artifact with auto-suggestions and built-in validation rules. The Spark configuration artifact allows you to share your Spark configuration within and across Azure Synapse workspaces. You can also easily associate your Spark configuration with a Spark pool, a Notebook, and a Spark job definition for reuse and minimize the need to copy the Spark configuration in multiple places. To learn more about the new Spark configuration management feature, read [Manage Apache Spark configuration](./spark/apache-spark-azure-create-spark-configuration.md).

### Synapse Data Explorer

* **Synapse Data Explorer live query in Excel** - Using the new Data Explorer web experience Open in Excel feature, you can now provide access to live results of your query by sharing the connected Excel Workbook with colleagues and team members.  You can open the live query in an Excel Workbook and refresh it directly from Excel to get the most up to date query results. To learn more about Excel live query, read [Open live query in Excel](https://techcommunity.microsoft.com/t5/azure-data-explorer-blog/open-live-kusto-query-in-excel/ba-p/3198500).

* **Use Managed Identities for External SQL Server Tables** - One of the key benefits of Azure Synapse is the ability to bring together data integration, enterprise data warehousing, and big data analytics. With Managed Identity support, Synapse Data Explorer table definition is now simpler and more secure. You can now use managed identities instead of entering in your credentials.

  An external SQL table is a schema entity that references data stored outside the Synapse Data Explorer database. Using the Create and alter SQL Server external tables command, External SQL tables can easily be added to the Synapse Data Explorer database schema.

  To learn more about managed identities, read [Managed identities overview](/azure/data-explorer/managed-identities-overview).

  To learn more about external tables, read [Create and alter SQL Server external tables](/azure/data-explorer/kusto/management/external-sql-tables).

* **New KQL Learn module (2 out of 3) is live!** - The power of Kusto Query Language (KQL) is its simplicity to query structured, semi-structured, and unstructured data together. To make it easier for you to learn KQL, we are releasing Learn modules. Previously, we released [Write your first query with Kusto Query Language](/training/modules/write-first-query-kusto-query-language/). New this month is [Gain insights from your data by using Kusto Query Language](/training/modules/gain-insights-data-kusto-query-language/).

  KQL is the query language used to query Synapse Data Explorer big data. KQL has a fast-growing user community, with hundreds of thousands of developers, data engineers, data analysts, and students.

  Check out the newest [KQL Learn module](/training/modules/gain-insights-data-kusto-query-language/) and see for yourself how easy it is to become a KQL master.

  To learn more about KQL, read [Kusto Query Language (KQL) overview](/azure/data-explorer/kusto/query/).

* **Azure Synapse Data Explorer connector for Microsoft Power Automate, Logic Apps, and Power Apps [Generally Available]** - The Azure Data Explorer connector for Power Automate enables you to orchestrate and schedule flows, send notifications, and alerts, as part of a scheduled or triggered task. To learn more, read [Azure Data Explorer connector for Microsoft Power Automate](/azure/data-explorer/flow) and [Usage examples for Azure Data Explorer connector to Power Automate](/azure/data-explorer/flow-usage).

* **Dynamic events routing from event hub to multiple databases** - Routing events from Event Hub/IOT Hub/Event Grid is an activity commonly performed by Azure Data Explorer (ADX) users. Previously, you could route events only to a single database per defined connection. If you wanted to route the events to multiple databases, you needed to create multiple ADX cluster connections.

  To simplify the experience, we now support routing events data to multiple databases hosted in a single ADX cluster. To learn more about dynamic routing, read [Ingest from event hub](/azure/data-explorer/ingest-data-event-hub-overview#events-routing).

* **Configure a database using a KQL inline script as part of JSON ARM deployment template** - Previously, Azure Data Explorer supported running a Kusto Query Language (KQL) script to configure your database during Azure Resource Manager (ARM) template deployment. Now, this can be done using an inline script provided inline as a parameter to a JSON ARM template. To learn more about using a KQL inline script, read [Configure a database using a Kusto Query Language script](/azure/data-explorer/database-script).

### Data Integration

* **Export pipeline monitoring as a CSV** - The ability to export pipeline monitoring to CSV has been added after receiving many community requests for the feature. Simply filter the Pipeline runs screen to the data you want and select *Export to CSV**. To learn more about exporting pipeline monitoring and other monitoring improvements, read [Azure Data Factory monitoring improvements](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/adf-monitoring-improvements/ba-p/3295531).

* **Incremental data loading made easy for Synapse and Azure Database for PostgreSQL and MySQL** - In a data integration solution, incrementally loading data after an initial full data load is a widely used scenario. Automatic incremental source data loading is now natively available for Synapse SQL and Azure Database for PostgreSQL and MySQL. Users can "enable incremental extract" and only inserted or updated rows will be read by the pipeline. To learn more about incremental data loading, read [Incrementally copy data from a source data store to a destination data store](../data-factory/tutorial-incremental-copy-overview.md).

* **User-Defined Functions for Mapping Data Flows [Public Preview]** - We hear you that you can find yourself doing the same string manipulation, math calculations, or other complex logic several times. Now, with the new user-defined function feature, you can create customized expressions that can be reused across multiple mapping data flows. User-defined functions will be grouped in libraries to help developers group common sets of functions.  Once you've created a data flow library, you can add in your user-defined functions. You can even add in multiple arguments to make your function more reusable. To learn more about user-defined functions, read [User defined functions in mapping data flows](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/introducing-user-defined-functions-preview-for-mapping-data/ba-p/3414628).

* **Assert Error Handling** - Error handling has now been added to sinks following an assert transformation. Assert transformations enable you to build custom rules for data quality and data validation. You can now choose whether to output the failed rows to the selected sink or to a separate file. To learn more about error handling, read [Assert data transformation in mapping data flow](../data-factory/data-flow-assert.md).

* **Mapping data flows projection editing** - New UI updates have been made to source projection editing in mapping data flows. You can now update source projection column names and column types. To learn more about source projection editing, read [Source transformation in mapping data flow](../data-factory/data-flow-source.md).

### Azure Synapse Link

**Azure Synapse Link for SQL Server** - At Microsoft Build 2022, we announced the Public Preview availability of Azure Synapse Link for SQL, for both SQL Server 2022 and Azure SQL Database. Data-driven, quality insights are critical for companies to stay competitive. The speed to achieve those insights can make all the difference. The costly and time-consuming nature of traditional ETL and ELT pipelines is no longer enough. With this release, you can now take advantage of low- and no-code, near real-time data replication from your SQL-based operational stores into Azure Synapse Analytics. This makes it easier to run BI reporting on operational data in near real-time, with minimal impact on your operational store. To learn more, read [Announcing the Public Preview of Azure Synapse Link for SQL](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/announcing-the-public-preview-of-azure-synapse-link-for-sql/ba-p/3372986) and [watch our YouTube video](https://www.youtube.com/embed/pgusZy34-Ek).

## Apr 2022 update

The following updates are new to Azure Synapse Analytics this month.

### SQL

* Cross-subscription restore for Azure Synapse SQL is now generally available.  Previously, it took many undocumented steps to restore a dedicated SQL pool to another subscription.  Now, with the PowerShell Az.Sql module 3.8 update, the Restore-AzSqlDatabase cmdlet can be used for cross-subscription restore.  To learn more, see [Restore a dedicated SQL pool (formerly SQL DW) to a different subscription](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-april-update-2022/ba-p/3280185).

* It is now possible to recover a SQL pool from a dropped server or workspace.  With the PowerShell Restore cmdlets in Az.Sql and Az.Synapse modules, you can now restore from a deleted server or workspace without filing a support ticket.  For more information, read [Synapse workspace SQL pools](./backuprestore/restore-sql-pool-from-deleted-workspace.md) or [standalone SQL pools (formerly SQL DW)](./sql-data-warehouse/sql-data-warehouse-restore-from-deleted-server.md), depending on your scenario.

### Synapse database templates and database designer

* Based on popular customer feedback, we've made significant improvements to our exploration experience when creating a lake database using an industry template.  To learn more, read [Quickstart: Create a new Lake database leveraging database templates](./database-designer/quick-start-create-lake-database.md).

* We've added the option to clone a lake database.  This unlocks additional opportunities to manage new versions of databases or support schemas that evolve in discrete steps. You can quickly clone a database using the action menu available on the lake database.  To learn more, read [How-to: Clone a lake database](./database-designer/clone-lake-database.md).

* You can now use wildcards to specify custom folder hierarchies.  Lake databases sit on top of data that is in the lake and this data can live in nested folders that don't fit into clean partition patterns. Previously, querying lake databases required that your data exists in a simple directory structure that you could browse using the folder icon without the ability to manually specify directory structure or use wildcard characters.  To learn more, read [How-to: Modify a datalake](./database-designer/modify-lake-database.md).

### Apache Spark for Synapse

* We are excited to announce the preview availability of Apache Spark&trade; 3.2 on Synapse Analytics. This new version incorporates user-requested enhancements and resolves 1,700+ Jira tickets. Please review the [official release notes](https://spark.apache.org/releases/spark-release-3-2-0.html) for the complete list of fixes and features and review the [migration guidelines between Spark 3.1 and 3.2](https://spark.apache.org/docs/latest/sql-migration-guide.html#upgrading-from-spark-sql-31-to-32) to assess potential changes to your applications. For more details, read [Apache Spark version support and Azure Synapse Runtime for Apache Spark 3.2](./spark/apache-spark-version-support.md).

* Assigning parameters dynamically based on variables, metadata, or specifying Pipeline specific parameters has been one of your top feature requests. Now, with the release of parameterization for the Spark job definition activity, you can do just that.  For more details, read [Transform data using Apache Spark job definition](quickstart-transform-data-using-spark-job-definition.md#settings-tab).

* We often receive customer requests to access the snapshot of the Notebook when there is a Pipeline Notebook run failure or there is a long-running Notebook job. With the release of the Synapse Notebook snapshot feature, you can now view the snapshot of the Notebook activity run with the original Notebook code, the cell output, and the input parameters. You can also access the snapshot of the referenced Notebook from the referencing Notebook cell output if you refer to other Notebooks through Spark utils. To learn more, read [Transform data by running a Synapse notebook](synapse-notebook-activity.md?tabs=classical#see-notebook-activity-run-history) and [Introduction to Microsoft Spark utilities](./spark/microsoft-spark-utilities.md?pivots=programming-language-scala#reference-a-notebook-1).

### Security

* The Synapse Monitoring Operator RBAC role is now generally available.  Since the GA of Synapse, customers have asked for a fine-grained RBAC (role-based access control) role that allows a user persona to monitor the execution of Synapse Pipelines and Spark applications without having the ability to run or cancel the execution of these applications.  Now, customers can assign the Synapse Monitoring Operator role to such monitoring personas. This allows organizations to stay compliant while having flexibility in the delegation of tasks to individuals or teams. Learn more by reading [Synapse RBAC Roles](security/synapse-workspace-synapse-rbac-roles.md). 
### Data integration

* Microsoft has added Dataverse as a source and sink connector to Synapse Data Flows so that you can now build low-code data transformation ETL jobs in Synapse directly accessing your Dataverse environment. For more details on how to use this new connector, read [Mapping data flow properties](../data-factory/connector-dynamics-crm-office-365.md#mapping-data-flow-properties).

* We heard from you that a 1-minute timeout for Web activity was not long enough, especially in cases of synchronous APIs. Now, with the response timeout property 'httpRequestTimeout', you can define timeout for the HTTP request up to 10 minutes. Learn more by reading [Web activity response timeout improvements](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/web-activity-response-timeout-improvement/ba-p/3260307).

### Developer experience

* Previously, if you wanted to reference a notebook in another notebook, you could only reference published or committed content. Now, when using %run notebooks, you can enable 'unpublished notebook reference' which will allow you to reference unpublished notebooks. When enabled, notebook run will fetch the current contents in the notebook web cache, meaning the changes in your notebook editor can be referenced immediately by other notebooks without having to be published (Live mode) or committed (Git mode).  To learn more, read [Reference unpublished notebook](spark/apache-spark-development-using-notebooks.md#reference-unpublished-notebook).

## Mar 2022 update

The following updates are new to Azure Synapse Analytics this month.

### Developer Experience

* Code cells in Synapse notebooks that result in exception will now show standard output along with the exception message. This feature is supported for Python and Scala languages. To learn more, see the [example output when a code statement fails](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-march-update-2022/ba-p/3269194#TOCREF_1).

* Synapse notebooks now support partial output when running code cells. To learn more, see the [examples at this blog post](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-march-update-2022/ba-p/3269194#TOCREF_1)

* You can now dynamically control Spark session configuration for the notebook activity with pipeline parameters. To learn more, see the [variable explorer feature of Synapse notebooks.](./spark/apache-spark-development-using-notebooks.md?tabs=classical#parameterized-session-configuration-from-pipeline)

* You can now reuse and manage notebook sessions without having to start a new one. You can easily connect a selected notebook to an active session in the list started from another notebook. You can detach a session from a notebook, stop the session, and monitor it. To learn more, see [how to manage your active notebook sessions.](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-march-update-2022/ba-p/3269194#TOCREF_3)

* Synapse notebooks now capture anything written through the Python logging module, in addition to the driver logs. To learn more, see [support for Python logging.](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-march-update-2022/ba-p/3269194#TOCREF_4)

### SQL

* Column Level Encryption for Azure Synapse dedicated SQL Pools is now Generally Available. With column level encryption, you can use different protection keys for each column with each key having its own access permissions. The data in CLE-enforced columns are encrypted on disk and remain encrypted in memory until the DECRYPTBYKEY function is used to decrypt it. To learn more, see [how to encrypt a data column](/sql/relational-databases/security/encryption/encrypt-a-column-of-data?view=azure-sqldw-latest&preserve-view=true).

* Serverless SQL pools now support better performance for CETAS (Create External Table as Select) and subsequent SELECT queries. The performance improvements include, a parallel execution plan resulting in faster CETAS execution and outputting multiple files. To learn more, see [CETAS with Synapse SQL](./sql/develop-tables-cetas.md) article and the [blog post](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-march-update-2022/ba-p/3269194#TOCREF_7)

### Apache Spark for Synapse

* Synapse Spark Common Data Model (CDM) Connector is now Generally Available. The CDM format reader/writer enables a Spark program to read and write CDM entities in a CDM folder via Spark dataframes. To learn more, see [how the CDM connector supports reading, writing data, examples, & known issues](./spark/data-sources/apache-spark-cdm-connector.md).

* Synapse Spark Dedicated SQL Pool (DW) Connector now supports improved performance. The new architecture eliminates redundant data movement and uses COPY-INTO instead of PolyBase. You can authenticate through SQL basic authentication or opt into the Azure Active Directory/Azure AD based authentication method. It now has ~5x improvements over the previous version. To learn more, see [Azure Synapse Dedicated SQL Pool Connector for Apache Spark](./spark/synapse-spark-sql-pool-import-export.md)

* Synapse Spark Dedicated SQL Pool (DW) Connector now supports all Spark Dataframe SaveMode choices. It supports Append, Overwrite, ErrorIfExists, and Ignore modes. The Append and Overwrite are critical for managing data ingestion at scale. To learn more, see [DataFrame write SaveMode support](./spark/synapse-spark-sql-pool-import-export.md#supported-dataframe-save-modes)

* Accelerate Spark execution speed using the new Intelligent Cache feature. This feature is currently in public preview. Intelligent Cache automatically stores each read within the allocated cache storage space, detecting underlying file changes and refreshing the files to provide the most recent data. To learn more, see how to [Enable/Disable the cache for your Apache Spark pool](./spark/apache-spark-intelligent-cache-concept.md) or see the [blog post](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-march-update-2022/ba-p/3269194#TOCREF_12)

### Security

* Azure Synapse Analytics now supports Azure Active Directory (Azure AD) authentication. You can turn on Azure AD authentication during the workspace creation or after the workspace is created. To learn more, see [how to use Azure AD authentication with Synapse SQL](./sql/active-directory-authentication.md).

* API support to raise or lower minimal TLS version for workspace managed SQL Server Dedicated SQL. To learn more, see [how to update the minimum TLS setting](/rest/api/synapse/sqlserver/workspace-managed-sql-server-dedicated-sql-minimal-tls-settings/update) or read the [blog post](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-march-update-2022/ba-p/3269194#TOCREF_15) for more details.

### Data Integration

* Flowlets and CDC Connectors are now Generally Available. Flowlets in Synapse Data Flows allow for reusable and composable ETL logic. To learn more, see [Flowlets in mapping data flow](../data-factory/concepts-data-flow-flowlet.md) or see the [blog post.](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-march-update-2022/ba-p/3269194#TOCREF_17)

* sFTP connector for Synapse data flows. You can read and write data while transforming data from sftp using the visual low-code data flows interface in Synapse. To learn more, see [source transformation](../data-factory/connector-sftp.md#source-transformation)

* Data flow improvements to Data Preview. To learn more, see [Data Preview and debug improvements in Mapping Data Flows](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/data-preview-and-debug-improvements-in-mapping-data-flows/ba-p/3268254?wt.mc_id=azsynapseblog_mar2022_blog_azureeng)

* Pipeline script activity. The Script Activity enables data engineers to build powerful data integration pipelines that can read from and write to Synapse databases, and other database types. To learn more, see [Transform data by using the Script activity in Azure Data Factory or Synapse Analytics](../data-factory/transform-data-using-script.md)

## Feb 2022 update

The following updates are new to Azure Synapse Analytics this month.

### SQL

* Serverless SQL Pools now support more consistent query execution times. [Learn how Serverless SQL pools automatically detect spikes in read latency and support consistent query execution time.](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-february-update-2022/ba-p/3221841#TOCREF_2)

* [The `OPENJSON` function makes it easy to get array element indexes](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-february-update-2022/ba-p/3221841#TOCREF_3). To learn more, see how the OPENJSON function in a serverless SQL pool allows you to [parse nested arrays and return one row for each JSON array element with the index of each element](/sql/t-sql/functions/openjson-transact-sql?view=azure-sqldw-latest&preserve-view=true#array-element-identity).

### Data integration

* [Upserting data is now supported by the copy activity](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-february-update-2022/ba-p/3221841#TOCREF_5). See how you can natively load data into a temporary table and then merge that data into a sink table with [upsert.](../data-factory/connector-azure-sql-database.md?tabs=data-factory#upsert-data)

* [Transform Dynamics Data Visually in Synapse Data Flows.](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-february-update-2022/ba-p/3221841#TOCREF_6) Learn more on how to use a [Dynamics dataset or an inline dataset as source and sink types to transform data at scale.](../data-factory/connector-dynamics-crm-office-365.md?tabs=data-factory#mapping-data-flow-properties)

* [Connect to your SQL sources in data flows using Always Encrypted](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-february-update-2022/ba-p/3221841#TOCREF_7). To learn more, see [how to securely connect to your SQL databases from Synapse data flows using Always Encrypted.](../data-factory/connector-azure-sql-database.md?tabs=data-factory)

* [Capture descriptions from asserts in Data Flows](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-february-update-2022/ba-p/3221841#TOCREF_8) To learn more, see [how to define your own dynamic descriptive messages](../data-factory/data-flow-expressions-usage.md#assertErrorMessages) in the assert data flow transformation at the row or column level.

* [Easily define schemas for complex type fields.](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-february-update-2022/ba-p/3221841#TOCREF_9) To learn more, see how you can make the engine to [automatically detect the schema of an embedded complex field inside a string column](../data-factory/data-flow-parse.md).

## Jan 2022 update

The following updates are new to Azure Synapse Analytics this month.

### Apache Spark for Synapse

You can now use four new database templates in Azure Synapse. [Learn more about Automotive, Genomics, Manufacturing, and Pharmaceuticals templates from the blog post](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/four-additional-azure-synapse-database-templates-now-available/ba-p/3058044) or the [database templates article](./database-designer/overview-database-templates.md). These templates are currently in public preview and are available within the Synapse Studio gallery.

### Machine Learning

Improvements to the Synapse Machine Learning library v0.9.5 (previously called MMLSpark). This release simplifies the creation of massively scalable machine learning pipelines with Apache Spark. To learn more, [read the blog post about the new capabilities in this release](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-january-update-2022/ba-p/3071681#TOCREF_3) or see the [full release notes](https://microsoft.github.io/SynapseML/)

### Security

* The Azure Synapse Analytics security overview - A whitepaper that covers the five layers of security. The security layers include authentication, access control, data protection, network security, and threat protection. [Understand each security feature in detailed](./guidance/security-white-paper-introduction.md) to implement an industry-standard security baseline and protect your data on the cloud.

* TLS 1.2 is now required for newly created Synapse Workspaces. To learn more, see how [TLS 1.2 provides enhanced security using this article](./security/connectivity-settings.md) or the [blog post](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-january-update-2022/ba-p/3071681#TOCREF_6). Sign-in attempts to a newly created Synapse workspace from connections using TLS versions lower than 1.2 will fail.

### Data Integration

* Data quality validation rules using Assert transformation - You can now easily add data quality, data validation, and schema validation to your Synapse ETL jobs by using Assert transformation in Synapse data flows. To learn more, see the [Assert transformation in mapping data flow article](../data-factory/data-flow-assert.md) or [the blog post](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-january-update-2022/ba-p/3071681#TOCREF_8).

* Native data flow connector for Dynamics - Synapse data flows can now read and write data directly to Dynamics through the new data flow Dynamics connector. Learn more on how to [Create data sets in data flows to read, transform, aggregate, join, etc. using this article](../data-factory/connector-dynamics-crm-office-365.md) or the [blog post](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-january-update-2022/ba-p/3071681#TOCREF_9). You can then write the data back into Dynamics using the built-in Synapse Spark compute.

* IntelliSense and auto-complete added to pipeline expressions - IntelliSense makes creating expressions, editing them easy. To learn more, see how to [check your expression syntax, find functions, and add code to your pipelines.](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/intellisense-support-in-expression-builder-for-more-productive/ba-p/3041459)

### Synapse SQL

* COPY schema discovery for complex data ingestion. To learn more, see the [blog post](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-january-update-2022/ba-p/3071681#TOCREF_12) or [how GitHub leveraged this functionality in Introducing Automatic Schema Discovery with auto table creation for complex datatypes](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/introducing-automatic-schema-discovery-with-auto-table-creation/ba-p/3068927).

* Serverless SQL pools now support the HASHBYTES function. HASHBYTES is a T-SQL function, which hashes values. Learn how to use [hash values in distributing data using this article](/sql/t-sql/functions/hashbytes-transact-sql) or the [blog post](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-january-update-2022/ba-p/3071681#TOCREF_13).

## December 2021 update

The following updates are new to Azure Synapse Analytics this month.

### Apache Spark for Synapse

* Accelerate Spark workloads with NVIDIA GPU acceleration [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId--16536080) [article](./spark/apache-spark-rapids-gpu.md)
* Mount remote storage to a Synapse Spark pool [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId--1823990543) [article](./spark/synapse-file-mount-api.md)
* Natively read & write data in ADLS with Pandas [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId-663522290) [article](./spark/tutorial-use-pandas-spark-pool.md)
* Dynamic allocation of executors for Spark [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId--1143932173) [article](./spark/apache-spark-autoscale.md)

### Machine Learning

* The Synapse Machine Learning library [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId--463873803) [article](https://microsoft.github.io/SynapseML/docs/Overview/)
* Getting started with state-of-the-art pre-built intelligent models [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId-2023639030) [article](./machine-learning/tutorial-form-recognizer-use-mmlspark.md)
* Building responsible AI systems with the Synapse ML library [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId-914346508) [article](https://microsoft.github.io/SynapseML/docs/Explore%20Algorithms/Responsible%20AI/Interpreting%20Model%20Predictions/)
* PREDICT is now GA for Synapse Dedicated SQL pools [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId-1594404878) [article](./machine-learning/tutorial-sql-pool-model-scoring-wizard.md)
* Simple & scalable scoring with PREDICT and MLFlow for Apache Spark for Synapse [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId--213049585) [article](./machine-learning/tutorial-score-model-predict-spark-pool.md)
* Retail AI solutions [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId--2020504048) [article](./machine-learning/quickstart-industry-ai-solutions.md)

### Security

* User-Assigned managed identities now supported in Synapse Pipelines in preview [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId--1340445678) [article](../data-factory/credentials.md?context=%2Fazure%2Fsynapse-analytics%2Fcontext%2Fcontext&tabs=data-factory)
* Browse ADLS Gen2 folders in an Azure Synapse Analytics workspace in preview [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId-1147067155) [article](how-to-access-container-with-access-control-lists.md)

### Data Integration

* Pipeline Fail activity [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId-1827125525) [article](../data-factory/control-flow-fail-activity.md)
* Mapping Data Flow gets new native connectors [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId-717833003) [article](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/mapping-data-flow-gets-new-native-connectors/ba-p/2866754)
* More notebook export formats: HTML, Python, and LaTeX [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-december-2021-update/ba-p/3042904#REF3) 
* Three new chart types in notebook view: box plot, histogram, and pivot table [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-december-2021-update/ba-p/3042904#REF4)
* Reconnect to lost notebook session [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-december-2021-update/ba-p/3042904#REF5)

### Integrate

* Azure Synapse Link for Dataverse [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId-1397891373) [article](/powerapps/maker/data-platform/azure-synapse-link-synapse)
* Custom partitions for Azure Synapse Link for Azure Cosmos DB in preview [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId--409563090) [article](../cosmos-db/custom-partitioning-analytical-store.md)
* Map data tool (Public Preview), a no-code guided ETL experience [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-december-2021-update/ba-p/3042904#REF7) [article](./database-designer/overview-map-data.md)
* Quick reuse of spark cluster [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-december-2021-update/ba-p/3042904#REF7) [article](../data-factory/concepts-integration-runtime-performance.md#time-to-live)
* External Call transformation [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-december-2021-update/ba-p/3042904#REF9) [article](../data-factory/data-flow-external-call.md)
* Flowlets (Public Preview) [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-december-2021-update/ba-p/3042904#REF10) [article](../data-factory/concepts-data-flow-flowlet.md)

## November 2021 update

The following updates are new to Azure Synapse Analytics this month.

### Synapse Data Explorer

* Synapse Data Explorer now available in preview [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId-1022327194) [article](./data-explorer/data-explorer-overview.md)

### Work with Databases and Data Lakes

* Introducing Lake databases (formerly known as Spark databases) [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId--795630373) [article](./database-designer/concepts-lake-database.md)
* Lake database designer now available in preview [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId-1691882460) [article](./database-designer/concepts-lake-database.md#database-designer)
* Database Templates and Database Designer [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId--115572003) [article](./database-designer/concepts-database-templates.md)

### SQL

* Delta Lake support for serverless SQL is generally available [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId-564486367) [article](./sql/query-delta-lake-format.md)
* Query multiple file paths using OPENROWSET in serverless SQL [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId--1242968096) [article](./sql/query-single-csv-file.md)
* Serverless SQL queries can now return up to 200 GB of results [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId-1110860013) [article](./sql/resources-self-help-sql-on-demand.md)
* Handling invalid rows with OPENROWSET in serverless SQL [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId--696594450) [article](./sql/develop-openrowset.md)

### Apache Spark for Synapse

* Accelerate Spark workloads with NVIDIA GPU acceleration [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId--16536080) [article](./spark/apache-spark-rapids-gpu.md)
* Mount remote storage to a Synapse Spark pool [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId--1823990543) [article](./spark/synapse-file-mount-api.md)
* Natively read & write data in ADLS with Pandas [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId-663522290) [article](./spark/tutorial-use-pandas-spark-pool.md)
* Dynamic allocation of executors for Spark [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId--1143932173) [article](./spark/apache-spark-autoscale.md)

### Machine Learning

* The Synapse Machine Learning library [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId--463873803) [article](https://microsoft.github.io/SynapseML/docs/Overview/)
* Getting started with state-of-the-art pre-built intelligent models [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId-2023639030) [article](./machine-learning/tutorial-form-recognizer-use-mmlspark.md)
* Building responsible AI systems with the Synapse ML library [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId-914346508) [article](https://microsoft.github.io/SynapseML/docs/Explore%20Algorithms/Responsible%20AI/Interpreting%20Model%20Predictions/)
* PREDICT is now GA for Synapse Dedicated SQL pools [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId-1594404878) [article](./machine-learning/tutorial-sql-pool-model-scoring-wizard.md)
* Simple & scalable scoring with PREDICT and MLFlow for Apache Spark for Synapse [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId--213049585) [article](./machine-learning/tutorial-score-model-predict-spark-pool.md)
* Retail AI solutions [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId--2020504048) [article](./machine-learning/quickstart-industry-ai-solutions.md)

### Security

* User-Assigned managed identities now supported in Synapse Pipelines in preview [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId--1340445678) [article](../data-factory/credentials.md?context=%2Fazure%2Fsynapse-analytics%2Fcontext%2Fcontext&tabs=data-factory)
* Browse ADLS Gen2 folders in an Azure Synapse Analytics workspace in preview [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId-1147067155) [article](how-to-access-container-with-access-control-lists.md)

### Data Integration

* Pipeline Fail activity [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId-1827125525) [article](../data-factory/control-flow-fail-activity.md)
* Mapping Data Flow gets new native connectors [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId-717833003) [article](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/mapping-data-flow-gets-new-native-connectors/ba-p/2866754)

### Azure Synapse Link

* Azure Synapse Link for Dataverse [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId-1397891373) [article](/powerapps/maker/data-platform/azure-synapse-link-synapse)
* Custom partitions for Azure Synapse Link for Azure Cosmos DB in preview [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId--409563090) [article](../cosmos-db/custom-partitioning-analytical-store.md)

## October 2021 update

The following updates are new to Azure Synapse Analytics this month.

### General

* Manage your cost with Azure Synapse pre-purchase plans [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics/azure-synapse-analytics-october-update/ba-p/2875372#manage-cost) [article](../cost-management-billing/reservations/synapse-analytics-pre-purchase-plan.md)
* Move your Azure Synapse workspace across Azure regions [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics/azure-synapse-analytics-october-update/ba-p/2875372#move-workspace-region) [article](how-to-move-workspace-from-one-region-to-another.md)

### Apache Spark for Synapse

* Spark performance optimizations [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics/azure-synapse-analytics-october-update/ba-p/2875372#spark-performance)

### Security

* All Synapse RBAC roles are now generally available for use in production [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics/azure-synapse-analytics-october-update/ba-p/2875372#synapse-rbac) [article](./security/synapse-workspace-synapse-rbac-roles.md)
* Apply User-Assigned Managed Identities for Double Encryption [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics/azure-synapse-analytics-october-update/ba-p/2875372#user-assigned-managed-identities) [article](./security/workspaces-encryption.md)
* Synapse Administrators now have elevated access to dedicated SQL pools [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics/azure-synapse-analytics-october-update/ba-p/2875372#elevated-access) [article](./security/synapse-workspace-access-control-overview.md)

### Governance

* Synapse workspaces can now automatically push lineage data to Microsoft Purview [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics/azure-synapse-analytics-october-update/ba-p/2875372#synapse-purview-lineage) [article](../purview/how-to-lineage-azure-synapse-analytics.md)

### Integrate

* Use Stringify in data flows to easily transform complex data types to strings [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics/azure-synapse-analytics-october-update/ba-p/2875372#stringify-transform) [article](../data-factory/data-flow-stringify.md)
* Control Spark session time-to-live (TTL) in data flows [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics/azure-synapse-analytics-october-update/ba-p/2875372#data-flowspark-ttl) [article](../data-factory/concepts-integration-runtime-performance.md)

### CI/CD & Git

* Deploy Synapse workspaces using GitHub Actions [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics/azure-synapse-analytics-october-update/ba-p/2875372#deploy-synapse-github-action) [article](./cicd/continuous-integration-delivery.md#configure-github-actions-secrets)
* More control creating Git branches in Synapse Studio [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics/azure-synapse-analytics-october-update/ba-p/2875372#create-git-branch-in-studio) [article](./cicd/source-control.md#creating-feature-branches)

### Developer Experience

* Enhanced Markdown editing in Synapse notebooks preview [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics/azure-synapse-analytics-october-update/ba-p/2875372#notebook-markdown-toolbar) [article](./spark/apache-spark-development-using-notebooks.md)
* Pandas dataframes automatically render as nicely formatted HTML tables [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics/azure-synapse-analytics-october-update/ba-p/2875372#pandas-dataframe-html) [article](./spark/apache-spark-data-visualization.md)
* Use IPython widgets in Synapse Notebooks [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics/azure-synapse-analytics-october-update/ba-p/2875372#notebook-ipythong-widgets) [article](./spark/apache-spark-development-using-notebooks.md)
* Mssparkutils runtime context now available for Python and Scala [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics/azure-synapse-analytics-october-update/ba-p/2875372#mssparkutils-context) [article](./spark/microsoft-spark-utilities.md?pivots=programming-language-python)

## Next steps

[Get started with Azure Synapse Analytics](get-started.md)

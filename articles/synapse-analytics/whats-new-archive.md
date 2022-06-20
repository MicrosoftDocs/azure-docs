---
title: Previous monthly updates in Azure Synapse Analytics 
description: Archive of the new features and documentation improvements for Azure Synapse Analytics
author: ryanmajidi
ms.author: rymajidi 
ms.service: synapse-analytics
ms.subservice: overview
ms.topic: conceptual
ms.date: 05/20/2022
---

# Previous monthly updates in Azure Synapse Analytics

This article describes previous month updates to Azure Synapse Analytics. For the most current month's release, check out [Azure Synapse Analytics latest updates](whats-new.md). Each update links to the Azure Synapse Analytics blog and an article that provides more information.

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

* TLS 1.2 is now required for newly created Synapse Workspaces. To learn more, see how [TLS 1.2 provides enhanced security using this article](./security/connectivity-settings.md) or the [blog post](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-january-update-2022/ba-p/3071681#TOCREF_6). Login attempts to a newly created Synapse workspace from connections using TLS versions lower than 1.2 will fail.

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

* The Synapse Machine Learning library [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId--463873803) [article](https://microsoft.github.io/SynapseML/docs/about/)
* Getting started with state-of-the-art pre-built intelligent models [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId-2023639030) [article](./machine-learning/tutorial-form-recognizer-use-mmlspark.md)
* Building responsible AI systems with the Synapse ML library [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId-914346508) [article](https://microsoft.github.io/SynapseML/docs/features/responsible_ai/Model%20Interpretation%20on%20Spark/)
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

* Synapse Link for Dataverse [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId-1397891373) [article](/powerapps/maker/data-platform/azure-synapse-link-synapse)
* Custom partitions for Synapse link for Azure Cosmos DB in preview [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId--409563090) [article](../cosmos-db/custom-partitioning-analytical-store.md)
* Map data tool (Public Preview), a no-code guided ETL experience [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-december-2021-update/ba-p/3042904#REF7) [article](./database-designer/overview-map-data.md)
* Quick reuse of spark cluster [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-december-2021-update/ba-p/3042904#REF7) [article](../data-factory/concepts-integration-runtime-performance.md#time-to-live)
* External Call transformation [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-december-2021-update/ba-p/3042904#REF9) [article](../data-factory/data-flow-external-call.md)
* Flowlets (Public Preview) [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-december-2021-update/ba-p/3042904#REF10) [article](../data-factory/concepts-data-flow-flowlet.md)

## November 2021 update

The following updates are new to Azure Synapse Analytics this month.

### Synapse Data Explorer

* Synapse Data Explorer now available in preview [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId-1022327194) [article](./data-explorer/data-explorer-overview.md)

### Working with Databases and Data Lakes

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

* The Synapse Machine Learning library [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId--463873803) [article](https://microsoft.github.io/SynapseML/docs/about/)
* Getting started with state-of-the-art pre-built intelligent models [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId-2023639030) [article](./machine-learning/tutorial-form-recognizer-use-mmlspark.md)
* Building responsible AI systems with the Synapse ML library [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId-914346508) [article](https://microsoft.github.io/SynapseML/docs/features/responsible_ai/Model%20Interpretation%20on%20Spark/)
* PREDICT is now GA for Synapse Dedicated SQL pools [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId-1594404878) [article](./machine-learning/tutorial-sql-pool-model-scoring-wizard.md)
* Simple & scalable scoring with PREDICT and MLFlow for Apache Spark for Synapse [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId--213049585) [article](./machine-learning/tutorial-score-model-predict-spark-pool.md)
* Retail AI solutions [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId--2020504048) [article](./machine-learning/quickstart-industry-ai-solutions.md)

### Security

* User-Assigned managed identities now supported in Synapse Pipelines in preview [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId--1340445678) [article](../data-factory/credentials.md?context=%2Fazure%2Fsynapse-analytics%2Fcontext%2Fcontext&tabs=data-factory)
* Browse ADLS Gen2 folders in an Azure Synapse Analytics workspace in preview [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId-1147067155) [article](how-to-access-container-with-access-control-lists.md)

### Data Integration

* Pipeline Fail activity [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId-1827125525) [article](../data-factory/control-flow-fail-activity.md)
* Mapping Data Flow gets new native connectors [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId-717833003) [article](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/mapping-data-flow-gets-new-native-connectors/ba-p/2866754)

### Synapse Link

* Synapse Link for Dataverse [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId-1397891373) [article](/powerapps/maker/data-platform/azure-synapse-link-synapse)
* Custom partitions for Synapse link for Azure Cosmos DB in preview [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId--409563090) [article](../cosmos-db/custom-partitioning-analytical-store.md)

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
    
###  Governance

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

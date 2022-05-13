---
title: What's new? 
description: Learn about the new features and documentation improvements for Azure Synapse Analytics
author: ryanmajidi
ms.author: rymajidi 
ms.service: synapse-analytics
ms.subservice: overview
ms.topic: conceptual
ms.date: 04/15/2022
---

# What's new in Azure Synapse Analytics?

This article lists updates to Azure Synapse Analytics that are published in Mar 2022. Each update links to the Azure Synapse Analytics blog and an article that provides more information. For previous months releases, check out [Azure Synapse Analytics - updates archive](whats-new-archive.md).

The following updates are new to Azure Synapse Analytics this month.

## Developer Experience

* Code cells in Synapse notebooks that result in exception will now show standard output along with the exception message. This feature is supported for Python and Scala languages. To learn more, see the [example output when a code statement fails](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-march-update-2022/ba-p/3269194#TOCREF_1).

* Synapse notebooks now support partial output when running code cells. To learn more, see the [examples at this blog post](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-march-update-2022/ba-p/3269194#TOCREF_1)

* You can now dynamically control Spark session configuration for the notebook activity with pipeline parameters. To learn more, see the [variable explorer feature of Synapse notebooks.](./spark/apache-spark-development-using-notebooks.md?tabs=classical#parameterized-session-configuration-from-pipeline)

* You can now reuse and manage notebook sessions without having to start a new one. You can easily connect a selected notebook to an active session in the list started from another notebook. You can detach a session from a notebook, stop the session, and monitor it. To learn more, see [how to manage your active notebook sessions.](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-march-update-2022/ba-p/3269194#TOCREF_3)

* Synapse notebooks now capture anything written through the Python logging module, in addition to the driver logs. To learn more, see [support for Python logging.](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-march-update-2022/ba-p/3269194#TOCREF_4)

## SQL

* Column Level Encryption for Azure Synapse dedicated SQL Pools is now Generally Available. With column level encryption, you can use different protection keys for each column with each key having its own access permissions. The data in CLE-enforced columns are encrypted on disk and remain encrypted in memory until the DECRYPTBYKEY function is used to decrypt it. To learn more, see [how to encrypt a data column](/sql/relational-databases/security/encryption/encrypt-a-column-of-data?view=azure-sqldw-latest&preserve-view=true).

* Serverless SQL pools now support better performance for CETAS (Create External Table as Select) and subsequent SELECT queries. The performance improvements include, a parallel execution plan resulting in faster CETAS execution and outputting multiple files. To learn more, see [CETAS with Synapse SQL](./sql/develop-tables-cetas.md) article and the [blog post](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-march-update-2022/ba-p/3269194#TOCREF_7)

## Apache Spark for Synapse

* Synapse Spark Common Data Model (CDM) Connector is now Generally Available. The CDM format reader/writer enables a Spark program to read and write CDM entities in a CDM folder via Spark dataframes. To learn more, see [how the CDM connector supports reading, writing data, examples, & known issues](./spark/data-sources/apache-spark-cdm-connector.md).

* Synapse Spark Dedicated SQL Pool (DW) Connector now supports improved performance. The new architecture eliminates redundant data movement and uses COPY-INTO instead of PolyBase. You can authenticate through SQL basic authentication or opt into the Azure Active Directory/Azure AD based authentication method. It now has ~5x improvements over the previous version. To learn more, see [Azure Synapse Dedicated SQL Pool Connector for Apache Spark](./spark/synapse-spark-sql-pool-import-export.md)

* Synapse Spark Dedicated SQL Pool (DW) Connector now supports all Spark Dataframe SaveMode choices. It supports Append, Overwrite, ErrorIfExists, and Ignore modes. The Append and Overwrite are critical for managing data ingestion at scale. To learn more, see [DataFrame write SaveMode support](./spark/synapse-spark-sql-pool-import-export.md#supported-dataframe-save-modes)

* Accelerate Spark execution speed using the new Intelligent Cache feature. This feature is currently in public preview. Intelligent Cache automatically stores each read within the allocated cache storage space, detecting underlying file changes and refreshing the files to provide the most recent data. To learn more, see how to [Enable/Disable the cache for your Apache Spark pool](./spark/apache-spark-intelligent-cache-concept.md) or see the [blog post](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-march-update-2022/ba-p/3269194#TOCREF_12)

## Security

* Azure Synapse Analytics now supports Azure Active Directory (Azure AD) authentication. You can turn on Azure AD authentication during the workspace creation or after the workspace is created. To learn more, see [how to use Azure AD authentication with Synapse SQL](./sql/active-directory-authentication.md).

* API support to raise or lower minimal TLS version for workspace managed SQL Server Dedicated SQL. To learn more, see [how to update the minimum TLS setting](/rest/api/synapse/sqlserver/workspace-managed-sql-server-dedicated-sql-minimal-tls-settings/update) or read the [blog post](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-march-update-2022/ba-p/3269194#TOCREF_15) for more details.

## Data Integration

* Flowlets and CDC Connectors are now Generally Available. Flowlets in Synapse Data Flows allow for reusable and composable ETL logic. To learn more, see [Flowlets in mapping data flow](../data-factory/concepts-data-flow-flowlet.md) or see the [blog post.](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-march-update-2022/ba-p/3269194#TOCREF_17)

* sFTP connector for Synapse data flows. You can read and write data while transforming data from sftp using the visual low-code data flows interface in Synapse. To learn more, see [source transformation](../data-factory/connector-sftp.md#source-transformation)

* Data flow improvements to Data Preview. To learn more, see [Data Preview and debug improvements in Mapping Data Flows](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/data-preview-and-debug-improvements-in-mapping-data-flows/ba-p/3268254?wt.mc_id=azsynapseblog_mar2022_blog_azureeng)

* Pipeline script activity. The Script Activity enables data engineers to build powerful data integration pipelines that can read from and write to Synapse databases, and other database types. To learn more, see [Transform data by using the Script activity in Azure Data Factory or Synapse Analytics](../data-factory/transform-data-using-script.md)

## Next steps

[Get started with Azure Synapse Analytics](get-started.md)

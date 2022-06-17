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

This article lists updates to Azure Synapse Analytics that are published in April 2022. Each update links to the Azure Synapse Analytics blog and an article that provides more information. For previous months releases, check out [Azure Synapse Analytics - updates archive](whats-new-archive.md).

The following updates are new to Azure Synapse Analytics this month.

## General

**Get connected with the new Azure Synapse Influencer program!**  [Join a community of Azure Synapse Influencers](http://aka.ms/synapseinfluencers) who are helping each other achieve more with cloud analytics! The Azure Synapse Influencer program recognizes Azure Synapse Analytics users and advocates who actively support the community by sharing Synapse-related content, announcements, and product news via social media. 

## SQL

* **Data Warehouse Migration guide for Dedicated SQL Pools in Azure Synapse Analytics** - With the benefits that cloud migration offers, we hear that you often look for steps, processes, or guidelines to follow for quick and easy migrations from existing data warehouse environments. We just released a set of [Data Warehouse migration guides](migration-guides.md) to make your transition to dedicated SQL Pools in Azure Synapse Analytics easier. 

* **Automatic character column length calculation** - It's no longer necessary to define character column lengths!  Serverless SQL pools let you query files in the data lake without knowing the schema upfront. The best practice was to specify the lengths of character columns to get optimal performance. Not anymore! With this new feature, you can get optimal query performance without having to define the schema. The serverless SQL pool will calculate the average column length for each inferred character column or character column defined as larger than 100 bytes. The schema will stay the same, while the serverless SQL pool will use the calculated average column lengths internally. It will also automatically calculate the cardinality estimation in case there was no previously created statistic.

## Apache Spark for Synapse

* **Azure Synapse Dedicated SQL Pool Connector for Apache Spark Now Available in Python** - Previously, the Azure Synapse Dedicated SQL Pool connector was only available using Scala.  Now, it can be used with Python on Spark 3.  The only difference between the Scala and Python implementations is the optional Scala callback handle, which allows you to receive post-write metrics.  

  The following are now supported in Python on Spark 3: 

  * Read using AAD Authentication or Basic Authentication 
  * Write to Internal Table using AAD Authentication or Basic Authentication 
  * Write to External Table using AAD Authentication or Basic Authentication  

  To learn more about the connector in Python, read [Azure Synapse Dedicated SQL Pool Connector for Apache Spark](./spark/synapse-spark-sql-pool-import-export.md).

* **Manage Azure Synapse Apache Spark configuration** - Apache Spark configuration management is always a challenging task because Spark has hundreds of properties. It is also challenging for you to know the optimal value for Spark configurations. With the new Spark configuration management feature, you can create a standalone Spark configuration artifact with auto-suggestions and built-in validation rules. The Spark configuration artifact allows you to share your Spark configuration within and across Azure Synapse workspaces. You can also easily associate your Spark configuration with a Spark pool, a Notebook, and a Spark job definition for reuse and minimize the need to copy the Spark configuration in multiple places. To learn more about the new Spark configuration management feature, read [Manage Apache Spark configuration](./spark/apache-spark-azure-create-spark-configuration.md).

## Synapse Data Explorer

* **Synapse Data Explorer live query in Excel** - Using the new Data Explorer web experience Open in Excel feature, you can now provide access to live results of your query by sharing the connected Excel Workbook with colleagues and team members.  You can open the live query in an Excel Workbook and refresh it directly from Excel to get the most up to date query results. To learn more about Excel live query, read [Open live query in Excel](https://techcommunity.microsoft.com/t5/azure-data-explorer-blog/open-live-kusto-query-in-excel/ba-p/3198500).

* **Use Managed Identities for External SQL Server Tables** - One of the key benefits of Azure Synapse is the ability to bring together data integration, enterprise data warehousing, and big data analytics. With Managed Identity support, Synapse Data Explorer table definition is now simpler and more secure. You can now use managed identities instead of entering in your credentials. 
  
  An external SQL table is a schema entity that references data stored outside the Synapse Data Explorer database. Using the Create and alter SQL Server external tables command, External SQL tables can easily be added to the Synapse Data Explorer database schema. 

  To learn more about managed identities, read [Managed identities overview](/azure/data-explorer/managed-identities-overview.md). 

  To learn more about external tables, read [Create and alter SQL Server external tables](/azure/data-explorer/kusto/management/external-sql-tables.md). 

* **New KQL Learn module (2 out of 3) is live!** - The power of Kusto Query Language (KQL) is its simplicity to query structured, semi-structured, and unstructured data together. To make it easier for you to learn KQL, we are releasing Learn modules. Previously, we released [Write your first query with Kusto Query Language](/learn/modules/write-first-query-kusto-query-language/). New this month is [Gain insights from your data by using Kusto Query Language](/learn/modules/gain-insights-data-kusto-query-language/). 
 
  KQL is the query language used to query Synapse Data Explorer big data. KQL has a fast-growing user community, with hundreds of thousands of developers, data engineers, data analysts, and students. 

  Check out the newest [KQL Learn Model](/learn/modules/gain-insights-data-kusto-query-language/) and see for yourself how easy it is to become a KQL master.  

  To learn more about KQL, read [Kusto Query Language (KQL) overview](/azure/data-explorer/kusto/query/). 

* **Azure Synapse Data Explorer connector for Microsoft Power Automate, Logic Apps, and Power Apps [Generally Available]** - The Azure Data Explorer connector for Power Automate enables you to orchestrate and schedule flows, send notifications, and alerts, as part of a scheduled or triggered task. To learn more, read [Azure Data Explorer connector for Microsoft Power Automate](/azure/data-explorer/flow.md) and [Usage examples for Azure Data Explorer connector to Power Automate](/azure/data-explorer/flow-usage.md). 

* **Dynamic events routing from event hub to multiple databases** - Routing events from Event Hub/IOT Hub/Event Grid is an activity commonly performed by Azure Data Explorer (ADX) users. Previously, you could route events only to a single database per defined connection. If you wanted to route the events to multiple databases, you needed to create multiple ADX cluster connections. 

  To simplify the experience, we now support routing events data to multiple databases hosted in a single ADX cluster. To learn more about dynamic routing, read [Ingest from event hub](/azure/data-explorer/ingest-data-event-hub-overview.md#events-routing). 

* **Configure a database using a KQL inline script as part of JSON ARM deployment template** - Previously, Azure Data Explorer supported running a Kusto Query Language (KQL) script to configure your database during Azure Resource Management (ARM) template deployment. Now, this can be done using an inline script provided inline as a parameter to a JSON ARM template. To learn more about using a KQL inline script, read [Configure a database using a Kusto Query Language script](/azure/data-explorer/database-script.md).

## Data Integration

* **Export pipeline monitoring as a CSV** - The ability to export pipeline monitoring to CSV has been added after receiving many community requests for the feature. Simply filter the Pipeline runs screen to the data you want and click ‘Export to CSV’. To learn more about exporting pipeline monitoring and other monitoring improvements, read [Azure Data Factory monitoring improvements](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/adf-monitoring-improvements/ba-p/3295531). 

* **Incremental data loading made easy for Synapse and Azure Database for PostgreSQL and MySQL** - In a data integration solution, incrementally loading data after an initial full data load is a widely used scenario. Automatic incremental source data loading is now natively available for Synapse SQL and Azure Database for PostgreSQL and MySQL. With a simple click, users can “enable incremental extract” and only inserted or updated rows will be read by the pipeline. To learn more about incremental data loading, read [Incrementally copy data from a source data store to a destination data store](../data-factory/tutorial-incremental-copy-overview.md). 

* **User-Defined Functions for Mapping Data Flows [Public Preview]** - We hear you that you can find yourself doing the same string manipulation, math calculations, or other complex logic several times. Now, with the new user-defined function feature, you can create customized expressions that can be reused across multiple mapping data flows. User-defined functions will be grouped in libraries to help developers group common sets of functions.  Once you’ve created a data flow library, you can add in your user-defined functions. You can even add in multiple arguments to make your function more reusable. To learn more about user-defined functions, read [User defined functions in mapping data flows](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/introducing-user-defined-functions-preview-for-mapping-data/ba-p/3414628).

* **Assert Error Handling** - Error handling has now been added to sinks following an assert transformation. Assert transformations enable you to build custom rules for data quality and data validation. You can now choose whether to output the failed rows to the selected sink or to a separate file. To learn more about error handling, read [Assert data transformation in mapping data flow](../data-factory/data-flow-assert.md).

* **Mapping data flows projection editing** - New UI updates have been made to source projection editing in mapping data flows. You can now update source projection column names and column types with the click of a button. To learn more about source projection editing, read [Source transformation in mapping data flow](../data-factory/data-flow-source.md).

## Synapse Link

**Azure Synapse Link for SQL [Public Preview]** - At Microsoft Build 2022, we announced the Public Preview availability of Azure Synapse Link for SQL, for both SQL Server 2022 and Azure SQL Database. Data-driven, quality insights are critical for companies to stay competitive. The speed to achieve those insights can make all the difference. The costly and time-consuming nature of traditional ETL and ELT pipelines are no longer enough. With this release, you can now take advantage of low- and no-code, near real-time data replication from your SQL-based operational stores into Azure Synapse Analytics. This makes it easier to run BI reporting on operational data in near real-time, with minimal impact on your operational store. To learn more, read [Announcing the Public Preview of Azure Synapse Link for SQL](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/announcing-the-public-preview-of-azure-synapse-link-for-sql/ba-p/3372986) and watch our YouTube video. 

> [!VIDEO https://www.youtube.com/embed/pgusZy34-Ek]

## Next steps

[Get started with Azure Synapse Analytics](get-started.md)
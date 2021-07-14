---
title: What's New in Azure Data Factory 
description: What's New highlights new features and improvements for Azure Data Factory.
author: pennyzhou-msft
ms.author: xupzhou
ms.reviewer: xupzhou
ms.service: data-factory
ms.topic: overview
ms.date: 07/14/2021
---

# What's New in Azure Data Factory

Azure Data Factory receives improvements on an ongoing basis. To stay up to date with the most recent developments, this article provides you with information about:

- The latest releases
- Known issues
- Bug fixes
- Deprecated functionality
- Plans for changes

This page will be updated monthly, so revisit it regularly. 

## July 2021



| Service Category | Service improvements | Details |
| --- | --- | --- |
| **Data Movement** | New user experience with Azure Data Factory Copy Data Tool  | Re-designed Copy Data Tool is now available with improved data ingestion experience.<br>[Learn more](https://techcommunity.microsoft.com/t5/azure-data-factory/a-re-designed-copy-data-tool-experience/ba-p/2380634) |
||MongoDB and MongoDB Atlas are Supported as both Source and Sink | With this, you can copy data from any supported source data store to MongoDB or MongoDB Atlas database; or copy data from MongoDB or MongoDB Atlas to any supported sink data store. <br>[Learn More](https://techcommunity.microsoft.com/t5/azure-data-factory/new-connectors-available-in-adf-mongodb-and-mongodb-atlas-are/ba-p/2441482)|
||Always Encrypted is supported for Azure SQL Database, Azure SQL Managed Instance and SQL Server connectors as both source and sink|With this, you can copy data from any supported source data store to MongoDB or MongoDB Atlas database; or copy data from MongoDB or MongoDB Atlas to any supported sink data store.<br>[Learn More](https://techcommunity.microsoft.com/t5/azure-data-factory/azure-data-factory-copy-now-supports-always-encrypted-for-both/ba-p/2461346)|
||Setting custom metadata is supported in copy activity when sinking to ADLS Gen2 or Azure Blob|When writing to ADLS Gen2 or Azure Blob, Copy activity supports to set custom metadata or store the source file's last modified info as metadata.<br>[Learn More](https://techcommunity.microsoft.com/t5/azure-data-factory/support-setting-custom-metadata-when-writing-to-blob-adls-gen2/ba-p/2545506#M490)|
| **Data Flow** | SQL Server is now supported as a source and sink in data flows|SQL Server is now supported as a source and sink in data flows. Follow the link for instructions on how to configure your networking using the Azure IR managed VNET feature to talk to your SQL Server on-prem and VM-based instances.<br>[Learn More](https://techcommunity.microsoft.com/t5/azure-data-factory/new-data-flow-connector-sql-server-as-source-and-sink/ba-p/2406213)|
||Dataflow Cluster quick re-use [GA] and now by default enabled for all new Azure IRs|ADF is happy to announce the general availability of the popular data flow quick start-up reuse feature. All new Azure IRs will now have re-use set as the default.<br>[Learn More](https://techcommunity.microsoft.com/t5/azure-data-factory/how-to-startup-your-data-flows-execution-in-less-than-5-seconds/ba-p/2267365)|
||Power Query activity in ADF is in public preview and available for building complex field mappings to your Power Query sink using ADF data wrangling|You can now build complex field mappings to your Power Query sink using ADF data wrangling. Please note that the sink is now configured in the pipeline in the Power Query (Preview) activity to accommodate this update.<br>[Learn More](wrangling-tutorial.md)|
||Updated data flows monitoring UI in ADF|Azure Data Factory has a new update for the monitoring UI to make it easier to view your data flow ETL job executions and quickly identify areas for performance tuning.<br>[Learn More](https://techcommunity.microsoft.com/t5/azure-data-factory/updated-data-flows-monitoring-ui-in-adf-amp-synapse/ba-p/2432199)|
|**SSIS**|Run Any SQL Anywhere in 3 Easy Steps with SSIS in Azure Data Factory|3 easy steps to run any SQL statements/script anywhere using SSIS in ADF<br> **1)** Prepare your SHIR/SSIS IR<br>**2)** Prepare an Execute SSIS Package activity in ADF pipeline<br>**3)** Run the Execute SSIS Package activity on your SHIR/SSIS IR.<br>[Learn More](https://techcommunity.microsoft.com/t5/sql-server-integration-services/run-any-sql-anywhere-in-3-easy-steps-with-ssis-in-azure-data/ba-p/2457244)|

## More information

- [Blog - Azure Data Factory](https://techcommunity.microsoft.com/t5/azure-data-factory/bg-p/AzureDataFactoryBlog)
- [Stack Overflow forum](https://stackoverflow.com/questions/tagged/azure-data-factory)
- [Twitter](https://twitter.com/AzDataFactory?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor)
- [Videos](https://www.youtube.com/channel/UC2S0k7NeLcEm5_IhHUwpN0g/featured)






---
title: What's new in Azure Data Factory 
description: This page highlights new features and recent improvements for Azure Data Factory. Azure Data Factory is a managed cloud service that's built for complex hybrid extract-transform-load (ETL), extract-load-transform (ELT), and data integration projects.
author: pennyzhou-msft
ms.author: xupzhou
ms.service: data-factory
ms.subservice: concepts
ms.topic: overview
ms.date: 07/14/2021
---

# What's new in Azure Data Factory

The Azure Data Factory service is improved on an ongoing basis. To stay up to date with the most recent developments, this article provides you with information about:

- The latest releases
- Known issues
- Bug fixes
- Deprecated functionality
- Plans for changes

This page is updated monthly, so revisit it regularly. 

## September 2021
<br>
<table>
<tr><td><b>Service Category</b></td><td><b>Service improvements</b></td><td><b>Details</b></td></tr>
  <tr><td><b>Continuous integration and delivery (CI/CD)</b></td><td>Expanded CI/CD capabilities</td><td>You can now create a new Git branch based on any other branch in Azure Data Factory.<br><a href="source-control.md#version-control">Learn more</a></td></tr>
<tr><td rowspan=3><b>Data Movement</b></td><td>Amazon Relational Database Service (RDS) for Oracle sources</td><td>The Amazon RDS for Oracle sources connector is now available in both Azure Data Factory and Azure Synapse.<br><a href="connector-amazon-rds-for-oracle.md">Learn more</a></td></tr>
<tr><td>Amazon RDS for SQL Server sources</td><td>The Amazon RDS for SQL Server sources connector is now available in both Azure Data Factory and Azure Synapse.<br><a href="connector-amazon-rds-for-sql-server.md">Learn more</a></td></tr>
<tr><td>Support parallel copy from Azure Database for PostgreSQL</td><td>The Azure Database for PostgreSQL connector now supports parallel copy operations.<br><a href="connector-azure-database-for-postgresql.md">Learn more</a></td></tr>
<tr><td rowspan=3><b>Data Flow</b></td><td>Use Azure Data Lake Storage (ADLS) Gen2 to execute pre- and post-processing commands</td><td>Hadoop Distributed File System (HDFS) pre- and post-processing commands can now be executed using ADLS Gen2 sinks in data flows<br><a href="connector-azure-data-lake-storage.md#pre-processing-and-post-processing-commands">Learn more</a></td></tr>
<tr><td>Edit data flow properties for existing instances of the Azure Integration Runtime (IR)</td><td>The Azure Integration Runtime (IR) has been updated to allow editing of data flow properties for existing IRs. You can now modify data flow compute properties without needing to create a new Azure IR.<br><a href="concepts-integration-runtime.md">Learn more</a></td></tr>
<tr><td>TTL setting for Azure Synapse to improve pipeline activities execution startup time</td><td>Azure Synapse Analytics has added TTL to the Azure Integration Runtime to enable your data flow pipeline activities to begin execution in seconds, greatly minimizing the runtime of your data flow pipelines.<br><a href="control-flow-execute-data-flow-activity.md#data-flow-integration-runtime">Learn more</a></td></tr>
<tr><td><b>Integration Runtime</b></td><td>Azure Data Factory Managed vNet goes GA</td><td>You can now provision the Azure Integration Runtime as part of a managed Virtual Network and leverage Private Endpoints to securely connect to supported data stores. Data traffic goes through Azure Private Links which provide secured connectivity to the data source. In addition, it prevents data exfiltration to the public internet.<br><a href="managed-virtual-network-private-endpoint.md">Learn more</a></td></tr>
<tr><td rowspan=2><b>Orchestration</b></td><td>Operationalize and Provide SLA for Data Pipelines</td><td>The new Elapsed Time Pipeline Run metric, combined with Data Factory Alerts, empowers data pipeline developers to better deliver SLAs to their customers, and you tell us how long a pipeline should run, and we will notify you proactively when the pipeline runs longer than expected.<br><a href="https://techcommunity.microsoft.com/t5/azure-data-factory/operationalize-and-provide-sla-for-data-pipelines/ba-p/2767768">Learn more</a></td></tr>
<tr><td>Fail Activity (Public Preview)</td><td>The new Fail activity allows you to throw an error in a pipeline intentionally for any reason. For example, you might use the Fail activity if a Lookup activity returns no matching data or a Custom activity finishes with an internal error.<br><a href="https://docs.microsoft.com/en-us/azure/data-factory/control-flow-fail-activity">Learn more</a></td></tr>
</table>

## August 2021
<br>
<table>
<tr><td><b>Service Category</b></td><td><b>Service improvements</b></td><td><b>Details</b></td></tr>
  <tr><td><b>Continuous integration and delivery (CI/CD)</b></td><td>CICD Improvements with GitHub support in Azure Government and Azure China</td><td>We have added support for GitHub in Azure for U.S. Government and Azure China.<br><a href="https://techcommunity.microsoft.com/t5/azure-data-factory/cicd-improvements-with-github-support-in-azure-government-and/ba-p/2686918">Learn more</a></td></tr>
<tr><td rowspan=2><b>Data Movement</b></td><td>Azure Cosmos DB's API for MongoDB connector supports version 3.6 & 4.0 in Azure Data Factory</td><td>Azure Data Factory Cosmos DB’s API for MongoDB connector now supports server version 3.6 & 4.0.<br><a href="connector-azure-cosmos-db-mongodb-api.md">Learn more</a></td></tr>
<tr><td>Enhance using COPY statement to load data into Azure Synapse Analytics</td><td>The Azure Data Factory Azure Synapse Analytics connector now supports staged copy and copy source with *.* as wildcardFilename for COPY statement.<br><a href="connector-azure-sql-data-warehouse.md#use-copy-statement">Learn more</a></td></tr>
<tr><td><b>Data Flow</b></td><td>REST endpoints are available as source and sink in Data Flow</td><td>Data flows in Azure Data Factory and Azure Synapse Analytics now support REST endpoints as both a source and sink with full support for both JSON and XML payloads.<br><a href="https://techcommunity.microsoft.com/t5/azure-data-factory/rest-source-and-sink-now-available-for-data-flows/ba-p/2596484">Learn more</a></td></tr>
<tr><td><b>Integration Runtime</b></td><td>Diagnostic tool is available for self-hosted integration runtime</td><td>A diagnostic tool for self-hosted integration runtime is designed for providing a better user experience and help users to find potential issues. The tool runs a series of test scenarios on the self-hosted integration runtime machine and every scenario has typical health check cases for common issues.<br><a href="https://techcommunity.microsoft.com/t5/azure-data-factory/diagnostic-tool-for-self-hosted-integration-runtime/ba-p/2634905">Learn more</a></td></tr>
<tr><td><b>Orchestration</b></td><td>Custom Event Trigger with Advanced Filtering Option is GA</td><td>You can now create a trigger that responds to a Custom Topic posted to Event Grid. Additionally, you can leverage Advanced Filtering to get fine-grain control over what events to respond to.<br><a href="how-to-create-custom-event-trigger.md">Learn more</a></td></tr>
</table>

## July 2021
<br>
<table>
<tr><td><b>Service Category</b></td><td><b>Service improvements</b></td><td><b>Details</b></td></tr>
<tr><td><b>Data Movement</b></td><td>Get metadata driven data ingestion pipelines on ADF Copy Data Tool within 10 minutes (Public Preview)</td><td>With this, you can build large-scale data copy pipelines with metadata-driven approach on copy data tool(Public Preview) within 10 minutes.<br><a href="https://techcommunity.microsoft.com/t5/azure-data-factory/get-metadata-driven-data-ingestion-pipelines-on-adf-within-10/ba-p/2528219">Learn more</a></td></tr>
<tr><td><b>Data Flow</b></td><td>New map functions added in data flow transformation functions</td><td>A new set of data flow transformation functions has been added to enable data engineers to easily generate, read, and update map data types and complex map structures.<br><a href="data-flow-expression-functions.md#map-functions">Learn more</a></td></tr>
<tr><td><b>Integration Runtime</b></td><td>5 new regions available in Azure Data Factory Managed VNET (Public Preview)</td><td>These 5 new regions(China East2, China North2, US Gov Arizona, US Gov Texas, US Gov Virginia) are available in Azure Data Factory managed virtual network (Public Preview).<br><a href="managed-virtual-network-private-endpoint.md#azure-data-factory-managed-virtual-network-is-available-in-the-following-azure-regions">Learn more</a></td></tr>
<tr><td rowspan=2><b>Developer Productivity</b></td><td>ADF homepage redesigned with a few sessions added</td><td>The Data Factory home page has been redesigned with better contrast and reflow capabilities. Additionally, a few sections have been introduced on the homepage to help you improve productivity in your data integration journey.<br><a href="https://techcommunity.microsoft.com/t5/azure-data-factory/the-new-and-refreshing-data-factory-home-page/ba-p/2515076">Learn more</a></td></tr>
<tr><td>New landing page for Azure Data Factory Studio</td><td>The landing page for Data Factory blade in the Azure portal.<br><a href="https://techcommunity.microsoft.com/t5/azure-data-factory/the-new-and-refreshing-data-factory-home-page/ba-p/2515076">Learn more</a></td></tr>
</table>

## June 2021
<br>
<table>
<tr><td><b>Service Category</b></td><td><b>Service improvements</b></td><td><b>Details</b></td></tr>
<tr><td rowspan=4 valign="middle"><b>Data Movement</b></td><td>New user experience with Azure Data Factory Copy Data Tool</td><td>Redesigned Copy Data Tool is now available with improved data ingestion experience.<br><a href="https://techcommunity.microsoft.com/t5/azure-data-factory/a-re-designed-copy-data-tool-experience/ba-p/2380634">Learn more</a></td></tr>
<tr><td>MongoDB and MongoDB Atlas are Supported as both Source and Sink</td><td>This improvement supports copying data between any supported data store and MongoDB or MongoDB Atlas database.<br><a href="https://techcommunity.microsoft.com/t5/azure-data-factory/new-connectors-available-in-adf-mongodb-and-mongodb-atlas-are/ba-p/2441482">Learn more</a></td></tr>
<tr><td>Always Encrypted is supported for Azure SQL Database, Azure SQL Managed Instance, and SQL Server connectors as both source and sink</td><td>Always Encrypted is available in Azure Data Factory for Azure SQL Database, Azure SQL Managed Instance, and SQL Server connectors for copy activity.<br><a href="https://techcommunity.microsoft.com/t5/azure-data-factory/azure-data-factory-copy-now-supports-always-encrypted-for-both/ba-p/2461346">Learn more</a></td></tr>
<tr><td>Setting custom metadata is supported in copy activity when sinking to ADLS Gen2 or Azure Blob</td><td>When writing to ADLS Gen2 or Azure Blob, copy activity supports setting custom metadata or storage of the source file's last modified info as metadata.<br><a href="https://techcommunity.microsoft.com/t5/azure-data-factory/support-setting-custom-metadata-when-writing-to-blob-adls-gen2/ba-p/2545506#M490">Learn more</a></td></tr>
<tr><td rowspan=4 valign="middle"><b>Data Flow</b></td><td>SQL Server is now supported as a source and sink in data flows</td><td>SQL Server is now supported as a source and sink in data flows. Follow the link for instructions on how to configure your networking using the Azure Integration Runtime managed VNET feature to talk to your SQL Server on-premise and cloud VM-based instances.<br><a href="https://techcommunity.microsoft.com/t5/azure-data-factory/new-data-flow-connector-sql-server-as-source-and-sink/ba-p/2406213">Learn more</a></td></tr>
<tr><td>Dataflow Cluster quick reuse is now enabled by default for all new Azure Integration Runtimes</td><td>ADF is happy to announce the general availability of the popular data flow quick start-up reuse feature. All new Azure Integration Runtimes will now have quick reuse enabled by default.<br><a href="https://techcommunity.microsoft.com/t5/azure-data-factory/how-to-startup-your-data-flows-execution-in-less-than-5-seconds/ba-p/2267365">Learn more</a></td></tr>
<tr><td>Power Query activity (Public Preview)</td><td>You can now build complex field mappings to your Power Query sink using Azure Data Factory data wrangling. The sink is now configured in the pipeline in the Power Query (Public Preview) activity to accommodate this update.<br><a href="wrangling-tutorial.md">Learn more</a></td></tr>
<tr><td>Updated data flows monitoring UI in Azure Data Factory</td><td>Azure Data Factory has a new update for the monitoring UI to make it easier to view your data flow ETL job executions and quickly identify areas for performance tuning.<br><a href="https://techcommunity.microsoft.com/t5/azure-data-factory/updated-data-flows-monitoring-ui-in-adf-amp-synapse/ba-p/2432199">Learn more</a></td></tr>
<tr><td><b>SQL Server Integration Services (SSIS)</b></td><td>Run any SQL anywhere in 3 simple steps with SSIS in Azure Data Factory</td><td>This post provides 3 simple steps to run any SQL statements/scripts anywhere with SSIS in Azure Data Factory.<ol><li>Prepare your Self-Hosted Integration Runtime/SSIS Integration Runtime.</li><li>Prepare an Execute SSIS Package activity in Azure Data Factory pipeline.</li><li>Run the Execute SSIS Package activity on your Self-Hosted Integration Runtime/SSIS Integration Runtime.</li></ol><a href="https://techcommunity.microsoft.com/t5/sql-server-integration-services/run-any-sql-anywhere-in-3-easy-steps-with-ssis-in-azure-data/ba-p/2457244">Learn more</a></td></tr>
</table>

## More information

- [Blog - Azure Data Factory](https://techcommunity.microsoft.com/t5/azure-data-factory/bg-p/AzureDataFactoryBlog)
- [Stack Overflow forum](https://stackoverflow.com/questions/tagged/azure-data-factory)
- [Twitter](https://twitter.com/AzDataFactory?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor)
- [Videos](https://www.youtube.com/channel/UC2S0k7NeLcEm5_IhHUwpN0g/featured)

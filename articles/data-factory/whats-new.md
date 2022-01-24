---
title: What's new in Azure Data Factory 
description: This page highlights new features and recent improvements for Azure Data Factory. Azure Data Factory is a managed cloud service that's built for complex hybrid extract-transform-load (ETL), extract-load-transform (ELT), and data integration projects.
author: pennyzhou-msft
ms.author: xupzhou
ms.service: data-factory
ms.subservice: concepts
ms.topic: overview
ms.date: 01/21/2022
---

# What's new in Azure Data Factory

The Azure Data Factory service is improved on an ongoing basis. To stay up to date with the most recent developments, this article provides you with information about:

- The latest releases
- Known issues
- Bug fixes
- Deprecated functionality
- Plans for changes

This page is updated monthly, so revisit it regularly. 

## December 2021
<br>
<table>
<tr><td><b>Service Category</b></td><td><b>Service improvements</b></td><td><b>Details</b></td></tr>


<tr><td rowspan=9><b>Data Flow</b></td><td>Dynamics connector as native source and sink for mapping data flows</td><td>The Dynamics connector is now supported as both a source and sink for mapping data flows.<br><a href="https://techcommunity.microsoft.com/t5/azure-data-factory-blog/mapping-data-flow-gets-new-native-connectors/ba-p/2866754">Learn more</a></td></tr>
<tr><td>Native change data capture (CDC) now natively supported</td><td>CDC is now natively supported in Azure Data Factory for CosmosDB, Blob Store, Azure Data Lake Storage Gen1 and Gen2, and common data model (CDM).<br><a href="https://techcommunity.microsoft.com/t5/azure-data-factory-blog/cosmosdb-change-feed-is-supported-in-adf-now/ba-p/3037011">Learn more</a></td></tr>
<tr><td>Flowlets public preview</td><td>The flowlets public preview allows data flow developers to build reusable components to easily build composable data transformation logic.<br><a href="https://techcommunity.microsoft.com/t5/azure-data-factory-blog/introducing-the-flowlets-preview-for-adf-and-synapse/ba-p/3030699">Learn more</a></td></tr>
  
<tr><td>Map Data public preview</td><td>The Map Data preview enables business users to define column mapping and transformations to load Synapse Lake Databases<br><a href="../synapse-analytics/database-designer/overview-map-data.md">Learn more</a></td></tr>
  
<tr><td>Multiple output destinations from Power Query</td><td>You can now map multiple output desintations from Power Query in Azure Data Factory for flexible ETL patterns for citizen data integrators.<br><a href="control-flow-power-query-activity.md#sink">Learn more</a></td></tr>
  
<tr><td>External Call transformation support</td><td>Extend the functionality of Mapping Data Flows by using the External Call transformation.  You can now add your own custom code as a REST endpoint or call a curated third party service row-by-row.<br><a href="data-flow-external-call.md">Learn more</a></td></tr>
  
<tr><td>Enable quick re-use by Synapse Mapping Data Flows with TTL support</td><td>Synapse Mapping Data Flows now support quick re-use by setting a TTL in the Azure Integration Runtime.  This will enable your subsequent data flow activities to execute in under 5 seconds.<br><a href="control-flow-execute-data-flow-activity.md#data-flow-integration-runtime">Learn more</a></td></tr>
  
<tr><td>Assert transformation</td><td>Easily add data quality, data domain validation, and metadata checks to your Azure Data Factory pipelines by using the Assert transformation in Mapping Data Flows.<br><a href="data-flow-assert.md">Learn more</a></td></tr>
  
<tr><td>IntelliSense support in expression builder for more productive pipeline authoring experiences</td><td>We have introduced IntelliSense support in expression builder / dynamic content authoring to make Azure Data Factory / Synapse pipeline developers more productive while writing complex expressions in their data pipelines.<br><a href="https://techcommunity.microsoft.com/t5/azure-data-factory-blog/intellisense-support-in-expression-builder-for-more-productive/ba-p/3041459">Learn more</a></td></tr>

</table>

## November 2021
<br>
<table>
<tr><td><b>Service Category</b></td><td><b>Service improvements</b></td><td><b>Details</b></td></tr>

<tr>
  <td><b>CI/CD</b></td>
  <td>GitHub integration improvements</td>
  <td>Improvements in ADF and GitHub integration removes limits on 1000 data factory resources per resource type (datasets, pipelines, etc.). For large data factories, this helps mitigate the impact of GitHub API rate limit.<br><a href="source-control.md">Learn more</a></td>
 </tr>
  
<tr><td rowspan=3><b>Data Flow</b></td><td>Set a custom error code and error message with the Fail activity</td><td>Fail Activity enables ETL developers to set the error message and custom error code for an Azure Data Factory pipeline.<br><a href="control-flow-fail-activity.md">Learn more</a></td></tr>
<tr><td>External call transformation</td><td>Mapping Data Flows External Call transformation enables ETL developers to leverage transformations, and data enrichments provided by REST endpoints or 3rd party API services.<br><a href="data-flow-external-call.md">Learn more</a></td></tr>
<tr><td>Synapse quick re-use</td><td>When executing Data flow in Synapse Analytics, use the TTL feature. The TTL feature uses the quick re-use feature so that sequential data flows will execute within a few seconds. You can set the TTL when configuring an Azure Integration runtime.<br><a href="control-flow-execute-data-flow-activity.md#data-flow-integration-runtime">Learn more</a></td></tr>

<tr><td rowspan=3><b>Data Movement</b></td><td>Copy activity supports reading data from FTP/SFTP without chunking</td><td>Automatically determining the file length or the relevant offset to be read when copying data from an FTP or SFTP server. With this capability, Azure Data Factory will automatically connect to the FTP/SFTP server to determine the file length. Once this is determined, Azure Data Factory will dive the file into multiple chunks and read them in parallel.<br><a href="connector-ftp.md">Learn more</a></td></tr>
<tr><td><i>UTF-8 without BOM</i> support in Copy activity</td><td>Copy activity supports writing data with encoding type <i>UTF-8 without BOM</i> for JSON and delimited text datasets.</td></tr>
<tr><td>Multi-character column delimiter support</td><td>Copy activity supports using multi-character column delimiters (for delimited text datasets).</td></tr>
  
<tr>
  <td><b>Integration Runtime</b></td>
  <td>Run any process anywhere in 3 easy steps with SSIS in Azure Data Factory</td>
  <td>In this article, you will learn how to use the best of Azure Data Factory and SSIS capabilities in a pipeline. A sample SSIS package (with parameterized properties) is provided to help you jumpstart. Using Azure Data Factory Studio, the SSIS package can be easily dragged & dropped into a pipeline and used as part of an Execute SSIS Package activity.<br><br>This enables you to run the Azure Data Factory pipeline (with SSIS package) on self-hosted/SSIS integration runtimes (SHIR/SSIS IR). By providing run-time parameter values, you can leverage the powerful capabilities of Azure Data Factory and SSIS capabilities together.  This article illustrates 3 easy steps to run any process (which can be any executable, such as application/program/utility/batch file) anywhere.
<br><a href="https://techcommunity.microsoft.com/t5/sql-server-integration-services/run-any-process-anywhere-in-3-easy-steps-with-ssis-in-azure-data/ba-p/2962609">Learn more</a></td>
 </tr>
</table>

## October 2021
<br>
<table>
<tr><td><b>Service Category</b></td><td><b>Service improvements</b></td><td><b>Details</b></td></tr>
  
<tr><td rowspan=3><b>Data Flow</b></td><td>Azure Data Explorer and Amazon Web Services S3 connectors</td><td>The Microsoft Data Integration team has just released two new connectors for mapping data flows. If you are using Azure Synapse, you can now connect directly to your AWS S3 buckets for data transformations. In both Azure Data Factory and Azure Synapse, you can now natively connect to your Azure Data Explorer clusters in mapping data flows.<br><a href="https://techcommunity.microsoft.com/t5/azure-data-factory/mapping-data-flow-gets-new-native-connectors/ba-p/2866754">Learn more</a></td></tr>
<tr><td>Power Query activity leaves preview for General Availability (GA)</td><td>Microsoft has released the Azure Data Factory Power Query pipeline activity as Generally Available. This new feature provides scaled-out data prep and data wrangling for citizen integrators inside the ADF browser UI for an integrated experience for data engineers. The Power Query data wrangling feature in ADF provides a powerful easy-to-use pipeline capability to solve your most complex data integration and ETL patterns in a single service.<br><a href="https://techcommunity.microsoft.com/t5/azure-data-factory/data-wrangling-at-scale-with-adf-s-power-query-activity-now/ba-p/2824207">Learn more</a></td></tr>
<tr><td>New Stringify data transformation in mapping data flows</td><td>Mapping data flows adds a new data transformation called Stringify to make it easy to convert complex data types like structs and arrays into string form that can be sent to structured output destinations.<br><a href="data-flow-stringify.md">Learn more</a></td></tr>
  
<tr>
  <td rowspan=2><b>Integration Runtime</b></td>
  <td>Azure Data Factory Managed vNet goes GA</td>
  <td>You can now provision the Azure Integration Runtime as part of a managed Virtual Network and leverage Private Endpoints to securely connect to supported data stores. Data traffic goes through Azure Private Links which provide secured connectivity to the data source. In addition, it prevents data exfiltration to the public internet.<br><a href="managed-virtual-network-private-endpoint.md">Learn more</a></td>
 </tr>
 <tr>
   <td>Express VNet injection for SSIS integration runtime (Public Preview)</td>
   <td>The SSIS integration runtime now supports express VNet injection.<br>
     Learn more:<br>
     <a href="join-azure-ssis-integration-runtime-virtual-network.md">Overview of VNet injection for SSIS integration runtime</a><br>
     <a href="azure-ssis-integration-runtime-virtual-network-configuration.md">Standard vs. express VNet injection for SSIS integration runtime</a><br>
     <a href="azure-ssis-integration-runtime-express-virtual-network-injection.md">Express VNet injection for SSIS integration runtime</a>
   </td>
 </tr>

<tr><td rowspan=2><b>Security</b></td><td>Azure Key Vault integration improvement</td><td>We have improved Azure Key Vault integration by adding user selectable drop-downs to select the secret values in the linked service, increasing productivity and not requiring users to type in the secrets, which could result in human error.</td></tr>
<tr><td>Support for user-assigned managed identity in Azure Data Factory</td><td>Credential safety is crucial for any enterprise. With that in mind, the Azure Data Factory (ADF) team is committed to making the data engineering process secure yet simple for data engineers. We are excited to announce the support for user-assigned managed identity (Preview) in all connectors/ linked services that support Azure Active Directory (Azure AD) based authentication.<br><a href="https://techcommunity.microsoft.com/t5/azure-data-factory/support-for-user-assigned-managed-identity-in-azure-data-factory/ba-p/2841013">Learn more</a></td></tr>
</table>

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
<tr><td>Fail Activity (Public Preview)</td><td>The new Fail activity allows you to throw an error in a pipeline intentionally for any reason. For example, you might use the Fail activity if a Lookup activity returns no matching data or a Custom activity finishes with an internal error.<br><a href="control-flow-fail-activity.md">Learn more</a></td></tr>
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
<tr><td rowspan=2><b>Developer Productivity</b></td><td>ADF homepage improvements</td><td>The Data Factory home page has been redesigned with better contrast and reflow capabilities. Additionally, a few sections have been introduced on the homepage to help you improve productivity in your data integration journey.<br><a href="https://techcommunity.microsoft.com/t5/azure-data-factory/the-new-and-refreshing-data-factory-home-page/ba-p/2515076">Learn more</a></td></tr>
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

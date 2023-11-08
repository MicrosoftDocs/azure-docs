---
title: What's new archive
description: This page archives older months' highlights of new features and recent improvements for Azure Data Factory. Data Factory is a managed cloud service that's built for complex hybrid extract-transform-and-load (ETL), extract-load-and-transform (ELT), and data integration projects.
author: pennyzhou-msft
ms.author: xupzhou
ms.service: data-factory
ms.subservice: concepts
ms.topic: overview
ms.custom: references_regions
ms.date: 08/11/2023
---
# What's new archive for Azure Data Factory

Azure Data Factory is improved on an ongoing basis. To stay up to date with the most recent developments, refer to the current [What's New](whats-new.md) page, which provides you with information about:

- The latest releases.
- Known issues.
- Bug fixes.
- Deprecated functionality.
- Plans for changes.

This archive page retains updates from older months.  

Check out our [What's New video archive](https://www.youtube.com/playlist?list=PLt4mCx89QIGS1rQlNt2-7iuHHAKSomVLv) for all of our monthly update

## February 2023

### Data movement

- Anonymous authentication type supported for Azure Blob storage [Learn more](connector-azure-blob-storage.md?tabs=data-factory#anonymous-authentication)
- Updated SAP template to easily move SAP data to ADLSGen2 in Delta format [Learn more](industry-sap-templates.md)

### Monitoring

Container monitoring view available in default ADF studio [Learn more](how-to-manage-studio-preview-exp.md#container-view)

### Orchestration

- Set pipeline output value (Public preview) [Learn more](tutorial-pipeline-return-value.md)
- Managed Airflow (Public preview) [Learn more](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/introducing-managed-airflow-in-azure-data-factory/ba-p/3730151)

### Developer productivity

Dark theme support added (Public preview) [Learn more](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/introducing-dark-mode-for-adf-studio/ba-p/3757961)

## January 2023

### Data flow

- Flowlets now support schema drift [Learn more](connector-office-365.md?tabs=data-factory)
- SQL CDC incremental extract now supports numeric columns [Learn more](connector-sql-server.md?tabs=data-factory#native-change-data-capture)

### Data movement

New top-level CDC resource - native CDC configuration in 3 simple steps [Learn more](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/announcing-the-public-preview-of-a-new-top-level-cdc-resource-in/ba-p/3720519)

### Orchestration

Orchestrate Synapse notebooks and Synapse spark job definitions natively [Learn more](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/orchestrate-and-operationalize-synapse-notebooks-and-spark-job/ba-p/3724379)

### Region expansion

- Continued region expansion - China North 3 now supported [Learn more](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=data-factory)
- Continued region expansion - Switzerland West now supported [Learn more](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=data-factory)

### SQL Server Integration Services (SSIS)

Express virtual network injection for SSIS now generally available [Learn more](https://techcommunity.microsoft.com/t5/sql-server-integration-services/general-availability-of-express-virtual-network-injection-for/ba-p/3699993)

### Developer productivity

- Added support for favoriting resources on home page
- Save column width for pipeline monitoring
- Monitor filter updates for faster searches
- Directly launch Pipeline Template Gallery through Azure portal

## December 2022

### Data flow

SQL change data capture (CDC) incremental extract - supports numeric columns in mapping dataflow [Learn more](connector-azure-sql-database.md?tabs=data-factory#source-transformation)

### Data movement

Express virtual network injection for SSIS in Azure Data Factory is generally available [Learn more](https://techcommunity.microsoft.com/t5/sql-server-integration-services/general-availability-of-express-virtual-network-injection-for/ba-p/3699993)

### Region expansion

Continued region expansion - Azure Data Factory is now available in China North 3 [Learn more](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=data-factory)

## November 2022
 
### Data flow

- Incremental only is available in SAP CDC - get changes only from SAP system without initial full load  [Learn more](connector-sap-change-data-capture.md?tabs=data-factory#mapping-data-flow-properties)
- Source partitions in initial full data load of SAP CDC to improve performance  [Learn more](connector-sap-change-data-capture.md?tabs=data-factory#mapping-data-flow-properties)
- A new pipeline template - Load multiple objects with big amounts from SAP via SAP CDC [Learn more](solution-template-replicate-multiple-objects-sap-cdc.md?tabs=data-factory)

### Data Movement
- Support to Azure Databricks through private link from a Data Factory managed virtual network [Learn more](managed-virtual-network-private-endpoint.md?tabs=data-factory#supported-data-sources-and-services)

### User Interface
3 Pipeline designer enhancements added to ADF Studio preview experience 
- Dynamic content flyout - make it easier to set dynamic content in your pipeline activities without using the expression builder  [Learn more](how-to-manage-studio-preview-exp.md?tabs=data-factory#dynamic-content-flyout)
- Error message relocation to status column - make it easier for you to view errors when you see a Failed pipeline run [Learn more](how-to-manage-studio-preview-exp.md?tabs=data-factory#error-message-relocation-to-status-column)
- Container view - in Author Tab, Pipeline can change output view from list to container [Learn more](how-to-manage-studio-preview-exp.md?tabs=data-factory#container-view)

### Continuous integration and continuous deployment

In auto publish config, disable publish button is available to void overwriting the last automated publish deployment [Learn more](source-control.md?tabs=data-factory#editing-repo-settings)

## October 2022

### Video summary

> [!VIDEO https://www.youtube.com/embed?v=Ou90M59VQCA&list=PLt4mCx89QIGS1rQlNt2-7iuHHAKSomVLv&index=7]
 
### Data flow

- Export up to 1000 rows from data flow preview [Learn more](concepts-data-flow-debug-mode.md?tabs=data-factory#data-preview)
- SQL CDC in Mapping Data Flows now available (Public Preview) [Learn more](connector-sql-server.md?tabs=data-factory#native-change-data-capture)
- Unlock advanced analytics with Microsoft 365 Mapping Data Flow Connector [Learn more](https://devblogs.microsoft.com/microsoft365dev/scale-access-to-microsoft-365-data-with-microsoft-graph-data-connect/)
- SAP Change Data Capture (CDC) in now generally available [Learn more](connector-sap-change-data-capture.md#transform-data-with-the-sap-cdc-connector)

### Developer productivity

- Now accepting community contributions to Template Gallery [Learn more](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/introducing-azure-data-factory-community-templates/ba-p/3650989)
- New design in Azure portal - easily discover how to launch ADF Studio [Learn more](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/improved-ui-for-launching-azure-data-factory-studio/ba-p/3659610)
- Learning Center now available in the Azure Data Factory studio [Learn more](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/introducing-the-learning-center-to-azure-data-factory-studio/ba-p/3660888)
- One-click to try Azure Data Factory [Learn more](quickstart-get-started.md)

### Orchestration

- Granular billing view available for ADF - see detailed billing information by pipeline (Public Preview) [Learn more](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/granular-billing-for-azure-data-factory/ba-p/3654600)
- Script activity execution timeout now configurable [Learn more](transform-data-using-script.md)

### Region expansion

Continued region expansion - Qatar Central now supported [Learn more](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=data-factory)

### Continuous integration and continuous deployment

Exclude pipeline triggers that did not change in deployment now generally available [Learn more](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/ci-cd-improvements-related-to-pipeline-triggers-deployment/ba-p/3605064)

## September 2022

### Video summary

> [!VIDEO https://www.youtube.com/embed?v=Bh_VA8n-SL8&list=PLt4mCx89QIGS1rQlNt2-7iuHHAKSomVLv&index=6]

### Data flow

- Amazon S3 source connector added [Learn more](connector-amazon-simple-storage-service.md?tabs=data-factory)
- Google Sheets REST-based connector added as Source (Preview) [Learn more](connector-google-sheets.md?tabs=data-factory)
- Maximum column optimization in dataflow [Learn more](format-delimited-text.md#mapping-data-flow-properties)
- SAP Change Data Capture capabilities in Mapping Data Flow (Preview) - Extract and transform data changes from SAP systems for a more efficient data refresh [Learn more](connector-sap-change-data-capture.md#transform-data-with-the-sap-cdc-connector)
- Writing data to a lookup field via alternative keys supported in Dynamics 365/CRM connectors for mapping data flows [Learn more](connector-dynamics-crm-office-365.md?tabs=data-factory#writing-data-to-a-lookup-field-via-alternative-keys)

### Data movement

Support to convert Oracle NUMBER type to corresponding integer in source [Learn more](connector-oracle.md?tabs=data-factory#oracle-as-source)

### Monitoring

- Additional monitoring improvements in Azure Data Factory [Learn more](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/further-adf-monitoring-improvements/ba-p/3607669)
   - Monitoring loading improvements - pipeline re-run groupings data fetched only when expanded 
   - Pagination added to pipeline activity runs view to show all activity records in pipeline run 
   - Monitoring consumption improvement - loading icon added to know when consumption report is fully calculated 
   - Additional sorting columns in monitoring - sorting added for Pipeline name, Run End, and Status 
   - Time-zone settings now saved in monitoring 
- Gantt chart view now supported in IR monitoring [Learn more](monitor-integration-runtime.md)

### Orchestration

DELETE method in the Web activity now supports sending a body with HTTP request [Learn more](control-flow-web-activity.md#type-properties)

### User interface

- Native UI support of parameterization added for 6 additional linked services - SAP ODP, ODBC, Microsoft Access, Informix, Snowflake, and DB2 [Learn more](parameterize-linked-services.md?tabs=data-factory#supported-linked-service-types)
- Pipeline designer enhancements added in Studio Preview experience - users can view workflow inside pipeline objects like For Each, If Then, etc.  [Learn more](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/azure-data-factory-updated-pipeline-designer/ba-p/3618755)

## August 2022

### Video summary

> [!VIDEO https://www.youtube.com/embed?v=KCJ2F6Y_nfo&list=PLt4mCx89QIGS1rQlNt2-7iuHHAKSomVLv&index=5]

### Data flow
- Appfigures connector added as Source (Preview) [Learn more](connector-appfigures.md)
- Cast transformation added - visually convert data types [Learn more](data-flow-cast.md)
- New UI for inline datasets - categories added to easily find data sources [Learn more](data-flow-source.md#inline-datasets)

### Data movement
Service principal authentication type added for Azure Blob storage [Learn more](connector-azure-blob-storage.md?tabs=data-factory#service-principal-authentication)

### Developer productivity
- Default activity time-out changed from 7 days to 12 hours [Learn more](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/azure-data-factory-changing-default-pipeline-activity-timeout/ba-p/3598729)
- New data factory creation experience - one click to have your factory ready within seconds [Learn more](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/new-experience-for-creating-data-factory-within-seconds/ba-p/3561249)
- Expression builder UI update - categorical tabs added for easier use [Learn more](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/coming-soon-to-adf-more-pipeline-expression-builder-ease-of-use/ba-p/3567196)

### Continuous integration and continuous delivery (CI/CD)
When CI/CD integrating ARM template, instead of turning off all triggers, it can exclude triggers that didn't change in deployment [Learn more](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/ci-cd-improvements-related-to-pipeline-triggers-deployment/ba-p/3605064)

## July 2022

### Video summary

> [!VIDEO https://www.youtube.com/embed?v=EOVVt4qYvZI&list=PLt4mCx89QIGS1rQlNt2-7iuHHAKSomVLv&index=4]

### Data flow

- Asana connector added as source [Learn more](connector-asana.md)
- Three new data transformation functions now supported [Learn more](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/3-new-data-transformation-functions-in-adf/ba-p/3582738)
   - [collectUnique()](data-flow-expressions-usage.md#collectUnique) - Create a new collection of unique values in an array.
   - [substringIndex()](data-flow-expressions-usage.md#substringIndex) - Extract the substring before n occurrences of a delimiter.
   - [topN()](data-flow-expressions-usage.md#topN) - Return the top n results after sorting your data.
- Refetch from source available in Refresh for data source change scenarios [Learn more](concepts-data-flow-debug-mode.md#data-preview)
- User defined functions (GA) - Create reusable and customized expressions to avoid building complex logic over and over [Learn more](concepts-data-flow-udf.md) [Video](https://www.youtube.com/watch?v=ZFTVoe8eeOc&t=170s)
- Easier configuration on data flow runtime - choose compute size among Small, Medium and Large to pre-configure all integration runtime settings [Learn more](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/adf-makes-it-easy-to-select-azure-ir-size-for-data-flows/ba-p/3578033)

### Continuous integration and continuous delivery (CI/CD)

Include Global parameters supported in ARM template. [Learn more](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/ci-cd-improvement-using-global-parameters-in-azure-data-factory/ba-p/3557265#M665)
### Developer productivity

Be a part of Azure Data Factory studio preview features - Experience the latest Azure Data Factory capabilities and be the first to share your feedback [Learn more](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/introducing-the-azure-data-factory-studio-preview-experience/ba-p/3563880)

## June 2022

### Video summary
 
> [!VIDEO https://www.youtube.com/embed?v=Ay3tsJe_vMM&list=PLt4mCx89QIGS1rQlNt2-7iuHHAKSomVLv&index=3]

<table>
<tr><td><b>Service category</b></td><td><b>Service improvements</b></td><td><b>Details</b></td></tr>
<tr><td rowspan=3><b>Data flow</b></td><td>Fuzzy join supported for data flows</td><td>Fuzzy join is now supported in Join transformation of data flows with configurable similarity score on join conditions.<br><a href="data-flow-join.md#fuzzy-join">Learn more</a></td></tr>
<tr><td>Editing capabilities in source projection</td><td>Editing capabilities in source projection is available in Dataflow to make schemas modifications easily<br><a href="data-flow-source.md#source-options">Learn more</a></td></tr>
<tr><td>Assert error handling</td><td>Assert error handling are now supported in data flows for data quality and data validation<br><a href="data-flow-assert.md">Learn more</a></td></tr>
<tr><td rowspan=2><b>Data Movement</b></td><td>Parameterization natively supported in additional 4 connectors</td><td>We added native UI support of parameterization for the following linked services: Azure Data Lake Gen1, Azure PostgreSQL, Google AdWords and PostgreSQL.<br><a href="parameterize-linked-services.md?tabs=data-factory#supported-linked-service-types">Learn more</a></td></tr>
<tr><td>SAP Change Data Capture (CDC) capabilities in the new SAP ODP connector (Public Preview)</td><td>SAP Change Data Capture (CDC) capabilities are now supported in the new SAP ODP connector.<br><a href="https://techcommunity.microsoft.com/t5/azure-data-factory-blog/announcing-the-public-preview-of-the-sap-cdc-solution-in-azure/ba-p/3420904">Learn more</a></td></tr>
<tr><td><b>Integration Runtime</b></td><td>Time-To-Live in managed VNET (Public Preview)</td><td>Time-To-Live can be set to the provisioned computes in managed VNET.<br><a href="https://techcommunity.microsoft.com/t5/azure-data-factory-blog/announcing-public-preview-of-time-to-live-ttl-in-managed-virtual/ba-p/3552879">Learn more</a></td></tr>
<tr><td><b>Monitoring</b></td><td> Rerun pipeline with new parameters</td><td>You can now rerun pipelines with new parameter values in Azure Data Factory.<br><a href="monitor-visually.md#rerun-pipelines-and-activities">Learn more</a></td></tr> 
<tr><td><b>Orchestration</b></td><td>‘turnOffAsync' property is available in Web activity</td><td>Web activity supports an async request-reply pattern that invokes HTTP GET on the Location field in the response header of an HTTP 202 Response. It helps web activity automatically poll the monitoring end-point till the job runs. ‘turnOffAsync' property is supported to disable this behavior in cases where polling isn't needed<br><a href="control-flow-web-activity.md#type-properties">Learn more</a></td></tr>
</table>

## May 2022

<table>
<tr><td><b>Service category</b></td><td><b>Service improvements</b></td><td><b>Details</b></td></tr>

<tr><td><b>Data flow</b></td><td>User Defined Functions for mapping data flows</td><td>Azure Data Factory introduces in public preview user defined functions and data flow libraries. A user defined function is a customized expression you can define to be able to reuse logic across multiple mapping data flows. User defined functions live in a collection called a data flow library to be able to easily group up common sets of customized functions.<br><a href="concepts-data-flow-udf.md">Learn more</a></td></tr>

</table>

## April 2022

<table>
<tr><td><b>Service category</b></td><td><b>Service improvements</b></td><td><b>Details</b></td></tr>

<tr><td rowspan=3><b>Data flow</b></td><td>Data preview and debug improvements in mapping data flows</td><td>Debug sessions using the AutoResolve Azure integration runtime (IR) will now start up in under 10 seconds. There are new updates to the data preview panel in mapping data flows. Now you can sort the rows inside the data preview view by selecting column headers. You can move columns around interactively. You can also save the data preview results as a CSV by using Export CSV.<br><a href="https://techcommunity.microsoft.com/t5/azure-data-factory-blog/data-preview-and-debug-improvements-in-mapping-data-flows/ba-p/3268254">Learn more</a></td></tr>
<tr><td>Dataverse connector is available for mapping data flows</td><td>Dataverse connector is available as source and sink for mapping data flows.<br><a href="connector-dynamics-crm-office-365.md">Learn more</a></td></tr>
<tr><td>Support for user database schemas for staging with the Azure Synapse Analytics and PostgreSQL connectors in data flow sink</td><td>Data flow sink now supports using a user database schema for staging in both the Azure Synapse Analytics and PostgreSQL connectors.<br><a href="https://techcommunity.microsoft.com/t5/azure-data-factory-blog/data-flow-sink-supports-user-db-schema-for-staging-in-azure/ba-p/3299210">Learn more</a></td></tr>

<tr><td><b>Monitoring</b></td><td>Multiple updates to Data Factory monitoring experiences</td><td>New updates to the monitoring experience in Data Factory include the ability to export results to a CSV, clear all filters, and open a run in a new tab. Column and result caching is also improved.<br><a href="https://techcommunity.microsoft.com/t5/azure-data-factory-blog/adf-monitoring-improvements/ba-p/3295531">Learn more</a></td></tr>

<tr><td><b>User interface</b></td><td>New regional format support</td><td>Choosing your language and the regional format in settings will influence the format of how data such as dates and times appear in the Azure Data Factory Studio monitoring. For example, the time format in Monitoring will appear like "Apr 2, 2022, 3:40:29 pm" when choosing English as the regional format, and "2 Apr 2022, 15:40:29" when choosing French as regional format. These settings affect only the Azure Data Factory Studio user interface and do not change/ modify your actual data and time zone.</td></tr>

</table>

## March 2022

### Video summary

> [!VIDEO https://www.youtube.com/embed?v=MkgBxFyYwhQ&list=PLt4mCx89QIGS1rQlNt2-7iuHHAKSomVLv&index=2]

<table>
<tr><td><b>Service category</b></td><td><b>Service improvements</b></td><td><b>Details</b></td></tr>

<tr><td rowspan=5><b>Data flow</b></td><td>ScriptLines and parameterized linked service support added mapping data flows</td><td>It's now easy to detect changes to your data flow script in Git with ScriptLines in your data flow JSON definition. Parameterized linked services can now also be used inside your data flows for flexible generic connection patterns.<br><a href="https://techcommunity.microsoft.com/t5/azure-data-factory-blog/adf-mapping-data-flows-adds-scriptlines-and-link-service/ba-p/3249929#M589">Learn more</a></td></tr>
<tr><td>Flowlets general availability (GA)</td><td>Flowlets is now generally available to create reusable portions of data flow logic that you can share in other pipelines as inline transformations. Flowlets enable extract-transform-and-load (ETL) jobs to be composed of custom or common logic components.<br><a href="concepts-data-flow-flowlet.md">Learn more</a></td></tr>

<tr><td>Change Feed connectors are available in five data flow source transformations</td><td>Change Feed connectors are available in data flow source transformations for Azure Cosmos DB, Azure Blob Storage, Azure Data Lake Storage Gen1, Azure Data Lake Storage Gen2, and the common data model (CDM).<br><a href="https://techcommunity.microsoft.com/t5/azure-data-factory-blog/flowlets-and-change-feed-now-ga-in-azure-data-factory/ba-p/3267450">Learn more</a></td></tr>
<tr><td>Data preview and debug improvements in mapping data flows</td><td>New features were added to data preview and the debug experience in mapping data flows.<br><a href="https://techcommunity.microsoft.com/t5/azure-data-factory-blog/data-preview-and-debug-improvements-in-mapping-data-flows/ba-p/3268254">Learn more</a></td></tr>
<tr><td>SFTP connector for mapping data flow</td><td>SFTP connector is available for mapping data flow as both source and sink.<br><a href="connector-sftp.md?tabs=data-factory#mapping-data-flow-properties">Learn more</a></td></tr>

<tr><td><b>Data movement</b></td><td>Support Always Encrypted for SQL-related connectors in Lookup activity under Managed virtual network</td><td>Always Encrypted is supported for SQL Server, Azure SQL Database, Azure SQL Managed Instance, and Synapse Analytics in the Lookup activity under managed virtual network.<br><a href="control-flow-lookup-activity.md">Learn more</a></td></tr>

<tr><td><b>Integration runtime</b></td><td>New UI layout in Azure IR creation and edit page</td><td>The UI layout of the IR creation and edit page now uses tab style for Settings, Virtual network, and Data flow runtime.<br><a href="https://techcommunity.microsoft.com/t5/azure-data-factory-blog/new-ui-layout-in-azure-integration-runtime-creation-and-edit/ba-p/3248237">Learn more</a></td></tr>

<tr><td rowspan=2><b>Orchestration</b></td><td>Transform data by using the Script activity</td><td>You can use a Script activity to invoke a SQL script in SQL Database, Azure Synapse Analytics, SQL Server, Oracle, or Snowflake.<br><a href="https://techcommunity.microsoft.com/t5/azure-data-factory-blog/execute-sql-statements-using-the-new-script-activity-in-azure/ba-p/3239969">Learn more</a></td></tr>
<tr><td>Web activity timeout improvement</td><td>You can configure response timeout in a Web activity to prevent it from timing out if the response period is more than one minute, especially in the case of synchronous APIs.<br><a href="https://techcommunity.microsoft.com/t5/azure-data-factory-blog/web-activity-response-timeout-improvement/ba-p/3260307">Learn more</a></td></tr>

</table>

## February 2022

### Video summary

> [!VIDEO https://www.youtube.com/embed?v=r22nthp-f4g&list=PLt4mCx89QIGS1rQlNt2-7iuHHAKSomVLv&index=1]

<table>
<tr><td><b>Service category</b></td><td><b>Service improvements</b></td><td><b>Details</b></td></tr>

<tr><td rowspan=4><b>Data flow</b></td><td>Parameterized linked services supported in mapping data flows</td><td>You can now use your parameterized linked services in mapping data flows to make your data flow pipelines generic and flexible.<br><a href="parameterize-linked-services.md?tabs=data-factory">Learn more</a></td></tr>
<tr><td>SQL Database incremental source extract available in data flow (public preview)</td><td>A new option has been added on mapping data flow SQL Database sources called <i>Enable incremental extract (preview)</i>. Now you can automatically pull only the rows that have changed on your SQL Database sources by using data flows.<br><a href="connector-azure-sql-database.md?tabs=data-factory#mapping-data-flow-properties">Learn more</a></td></tr>
<tr><td>Four new connectors available for mapping data flows (public preview)</td><td>Data Factory now supports four new connectors (public preview) for mapping data flows: Quickbase connector, Smartsheet connector, TeamDesk connector, and Zendesk connector.<br><a href="connector-overview.md?tabs=data-factory">Learn more</a></td></tr>
<tr><td>Azure Cosmos DB (SQL API) for mapping data flow now supports inline mode</td><td>Azure Cosmos DB (SQL API) for mapping data flow can now use inline datasets.<br><a href="connector-azure-cosmos-db.md?tabs=data-factory#mapping-data-flow-properties">Learn more</a></td></tr> 

<tr><td rowspan=2><b>Data movement</b></td><td>Get metadata-driven data ingestion pipelines on the Data Factory Copy Data tool within 10 minutes (GA)</td><td>You can build large-scale data copy pipelines with a metadata-driven approach on the Copy Data tool within 10 minutes.<br><a href="copy-data-tool-metadata-driven.md">Learn more</a></td></tr>
<tr><td>Data Factory Google AdWords connector API upgrade available</td><td>The Data Factory Google AdWords connector now supports the new AdWords API version. No action is required for the new connector user because it's enabled by default.<br><a href="connector-troubleshoot-google-adwords.md#migrate-to-the-new-version-of-google-ads-api">Learn more</a></td></tr>

<tr><td><b>Continuous integration and continuous delivery (CI/CD)</b></td><td>Cross tenant Azure DevOps support</td><td>Configure a repository using Azure DevOps Git not in the same tenant as the Azure Data Factory。<br><a href="cross-tenant-connections-to-azure-devops.md">Learn more</a></td></tr>

<tr><td><b>Region expansion</b></td><td>Data Factory is now available in West US3 and Jio India West</td><td>Data Factory is now available in two new regions: West US3 and Jio India West. You can colocate your ETL workflow in these new regions if you're using these regions to store and manage your modern data warehouse. You can also use these regions for business continuity and disaster recovery purposes if you need to fail over from another region within the geo.<br><a href="https://azure.microsoft.com/global-infrastructure/services/?products=data-factory&regions=all">Learn more</a></td></tr>
 
<tr><td><b>Security</b></td><td>Connect to an Azure DevOps account in another Azure Active Directory (Azure AD) tenant</td><td>You can connect your Data Factory instance to an Azure DevOps account in a different Azure AD tenant for source control purposes.<br><a href="cross-tenant-connections-to-azure-devops.md">Learn more</a></td></tr>
</table>

## January 2022

<table>
<tr><td><b>Service category</b></td><td><b>Service improvements</b></td><td><b>Details</b></td></tr>

<tr><td rowspan=5><b>Data flow</b></td><td>Quick reuse is now automatic in all Azure IRs that use Time to Live (TTL)</td><td>You no longer need to manually specify "quick reuse." Data Factory mapping data flows can now start up subsequent data flow activities in under five seconds after you set a TTL.<br><a href="concepts-integration-runtime-performance.md#time-to-live">Learn more</a></td></tr>
<tr><td>Retrieve your custom Assert description</td><td>In the Assert transformation, you can define your own dynamic description message. You can use the new function <b>assertErrorMessage()</b> to retrieve the row-by-row message and store it in your destination data.<br><a href="data-flow-expressions-usage.md#assertErrorMessages">Learn more</a></td></tr>
<tr><td>Automatic schema detection in Parse transformation</td><td>A new feature added to the Parse transformation makes it easy to automatically detect the schema of an embedded complex field inside a string column. Select the <b>Detect schema</b> button to set your target schema automatically.<br><a href="data-flow-parse.md">Learn more</a></td></tr>
<tr><td>Support Dynamics 365 connector as both sink and source</td><td>You can now connect directly to Dynamics 365 to transform your Dynamics data at scale by using the new mapping data flow connector for Dynamics 365.<br><a href="connector-dynamics-crm-office-365.md?tabs=data-factory#mapping-data-flow-properties">Learn more</a></td></tr>
<tr><td>Always Encrypted SQL connections now available in data flows</td><td>Always Encrypted can now source transformations in SQL Server, SQL Database, SQL Managed Instance, and Azure Synapse when you use data flows.<br><a href="connector-azure-sql-database.md?tabs=data-factory">Learn more</a></td></tr>

<tr><td rowspan=2><b>Data movement</b></td><td>Data Factory Azure Databricks Delta Lake connector supports new authentication types</td><td>Data Factory Databricks Delta Lake connector now supports two more authentication types: system-assigned managed identity authentication and user-assigned managed identity authentication.<br><a href="connector-azure-databricks-delta-lake.md">Learn more</a></td></tr>
<tr><td>Data Factory Copy activity supports upsert in several more connectors</td><td>Data Factory Copy activity now supports upsert while it sinks data to SQL Server, SQL Database, SQL Managed Instance, and Azure Synapse.<br><a href="connector-overview.md">Learn more</a></td></tr>
 
</table>

## December 2021

<table>
<tr><td><b>Service category</b></td><td><b>Service improvements</b></td><td><b>Details</b></td></tr>

<tr><td rowspan=9><b>Data flow</b></td><td>Dynamics connector as native source and sink for mapping data flows</td><td>The Dynamics connector is now supported as source and sink for mapping data flows.<br><a href="https://techcommunity.microsoft.com/t5/azure-data-factory-blog/mapping-data-flow-gets-new-native-connectors/ba-p/2866754">Learn more</a></td></tr>
<tr><td>Native change data capture (CDC) is now natively supported</td><td>CDC is now natively supported in Data Factory for Azure Cosmos DB, Blob Storage, Data Lake Storage Gen1, Data Lake Storage Gen2, and CDM.<br><a href="https://techcommunity.microsoft.com/t5/azure-data-factory-blog/cosmosdb-change-feed-is-supported-in-adf-now/ba-p/3037011">Learn more</a></td></tr>
<tr><td>Flowlets public preview</td><td>The flowlets public preview allows data flow developers to build reusable components to easily build composable data transformation logic.<br><a href="https://techcommunity.microsoft.com/t5/azure-data-factory-blog/introducing-the-flowlets-preview-for-adf-and-synapse/ba-p/3030699">Learn more</a></td></tr>
<tr><td>Map Data public preview</td><td>The Map Data preview enables business users to define column mapping and transformations to load Azure Synapse lake databases.<br><a href="../synapse-analytics/database-designer/overview-map-data.md">Learn more</a></td></tr>
<tr><td>Multiple output destinations from Power Query</td><td>You can now map multiple output destinations from Power Query in Data Factory for flexible ETL patterns for citizen data integrators.<br><a href="control-flow-power-query-activity.md#sink">Learn more</a></td></tr>
<tr><td>External Call transformation support</td><td>Extend the functionality of mapping data flows by using the External Call transformation. You can now add your own custom code as a REST endpoint or call a curated third-party service row by row.<br><a href="data-flow-external-call.md">Learn more</a></td></tr>
<tr><td>Enable quick reuse by Azure Synapse mapping data flows with TTL support</td><td>Azure Synapse mapping data flows now support quick reuse by setting a TTL in the Azure IR. Using a setting enables your subsequent data flow activities to execute in under five seconds.<br><a href="control-flow-execute-data-flow-activity.md#data-flow-integration-runtime">Learn more</a></td></tr>
<tr><td>Assert transformation</td><td>Easily add data quality, data domain validation, and metadata checks to your Data Factory pipelines by using the Assert transformation in mapping data flows.<br><a href="data-flow-assert.md">Learn more</a></td></tr>
<tr><td>IntelliSense support in expression builder for more productive pipeline authoring experiences</td><td>IntelliSense support in expression builder and dynamic content authoring makes Data Factory and Azure Synapse pipeline developers more productive while they write complex expressions in their data pipelines.<br><a href="https://techcommunity.microsoft.com/t5/azure-data-factory-blog/intellisense-support-in-expression-builder-for-more-productive/ba-p/3041459">Learn more</a></td></tr>

</table>

## November 2021

<table>
<tr><td><b>Service category</b></td><td><b>Service improvements</b></td><td><b>Details</b></td></tr>

<tr>
  <td><b>Continuous integration and continuous delivery (CI/CD)</b></td>
  <td>GitHub integration improvements</td>
  <td>Improvements in Data Factory and GitHub integration remove limits on 1,000 Data Factory resources per resource type, such as datasets and pipelines. For large data factories, this change helps mitigate the impact of the GitHub API rate limit.<br><a href="source-control.md">Learn more</a></td>
 </tr>

<tr><td rowspan=3><b>Data flow</b></td><td>Set a custom error code and error message with the Fail activity</td><td>Fail activity enables ETL developers to set the error message and custom error code for a Data Factory pipeline.<br><a href="control-flow-fail-activity.md">Learn more</a></td></tr>
<tr><td>External call transformation</td><td>Mapping data flows External Call transformation enables ETL developers to use transformations and data enrichments provided by REST endpoints or third-party API services.<br><a href="data-flow-external-call.md">Learn more</a></td></tr>
<tr><td>Synapse quick reuse</td><td>When you execute data flow in Synapse Analytics, use the TTL feature. The TTL feature uses the quick reuse feature so that sequential data flows will execute within a few seconds. You can set the TTL when you configure an Azure IR.<br><a href="control-flow-execute-data-flow-activity.md#data-flow-integration-runtime">Learn more</a></td></tr>

<tr><td rowspan=3><b>Data movement</b></td><td>Copy activity supports reading data from FTP or SFTP without chunking</td><td>Automatically determine the file length or the relevant offset to be read when you copy data from an FTP or SFTP server. With this capability, Data Factory automatically connects to the FTP or SFTP server to determine the file length. After the length is determined, Data Factory divides the file into multiple chunks and reads them in parallel.<br><a href="connector-ftp.md">Learn more</a></td></tr>
<tr><td><i>UTF-8 without BOM</i> support in Copy activity</td><td>Copy activity supports writing data with encoding the type <i>UTF-8 without BOM</i> for JSON and delimited text datasets.</td></tr>
<tr><td>Multicharacter column delimiter support</td><td>Copy activity supports using multicharacter column delimiters for delimited text datasets.</td></tr>

<tr>
  <td><b>Integration runtime</b></td>
  <td>Run any process anywhere in three steps with SQL Server Integration Services (SSIS) in Data Factory</td>
  <td>Learn how to use the best of Data Factory and SSIS capabilities in a pipeline. A sample SSIS package with parameterized properties helps you get a jump-start. With Data Factory Studio, the SSIS package can be easily dragged and dropped into a pipeline and used as part of an Execute SSIS Package activity.<br><br>This capability enables you to run the Data Factory pipeline with an SSIS package on self-hosted IRs or SSIS IRs. By providing run-time parameter values, you can use the powerful capabilities of Data Factory and SSIS capabilities together. This article illustrates three steps to run any process, which can be any executable, such as an application, program, utility, or batch file, anywhere.
<br><a href="https://techcommunity.microsoft.com/t5/sql-server-integration-services/run-any-process-anywhere-in-3-easy-steps-with-ssis-in-azure-data/ba-p/2962609">Learn more</a></td>
 </tr>
</table>


## October 2021

<table>
<tr><td><b>Service category</b></td><td><b>Service improvements</b></td><td><b>Details</b></td></tr>

<tr><td rowspan=3><b>Data flow</b></td><td>Azure Data Explorer and Amazon Web Services (AWS) S3 connectors</td><td>The Microsoft Data Integration team has released two new connectors for mapping data flows. If you're using Azure Synapse, you can now connect directly to your AWS S3 buckets for data transformations. In both Data Factory and Azure Synapse, you can now natively connect to your Azure Data Explorer clusters in mapping data flows.<br><a href="https://techcommunity.microsoft.com/t5/azure-data-factory/mapping-data-flow-gets-new-native-connectors/ba-p/2866754">Learn more</a></td></tr>
<tr><td>Power Query activity leaves preview for GA</td><td>The Data Factory Power Query pipeline activity is now generally available. This new feature provides scaled-out data prep and data wrangling for citizen integrators inside the Data Factory browser UI for an integrated experience for data engineers. The Power Query data wrangling feature in Data Factory provides a powerful, easy-to-use pipeline capability to solve your most complex data integration and ETL patterns in a single service.<br><a href="https://techcommunity.microsoft.com/t5/azure-data-factory/data-wrangling-at-scale-with-adf-s-power-query-activity-now/ba-p/2824207">Learn more</a></td></tr>
<tr><td>New Stringify data transformation in mapping data flows</td><td>Mapping data flows adds a new data transformation called Stringify to make it easy to convert complex data types like structs and arrays into string form. These data types then can be sent to structured output destinations.<br><a href="data-flow-stringify.md">Learn more</a></td></tr>

<tr>
 <td><b>Integration runtime</b></td>
  <td>Express virtual network injection for SSIS IR (public preview)</td>
  <td>The SSIS IR now supports express virtual network injection.<br>
    Learn more:<br>
    <a href="join-azure-ssis-integration-runtime-virtual-network.md">Overview of virtual network injection for SSIS IR</a><br>
    <a href="azure-ssis-integration-runtime-virtual-network-configuration.md">Standard vs. express virtual network injection for SSIS IR</a><br>
    <a href="azure-ssis-integration-runtime-express-virtual-network-injection.md">Express virtual network injection for SSIS IR</a>
  </td>
</tr>

<tr><td rowspan=2><b>Security</b></td><td>Azure Key Vault integration improvement</td><td>Key Vault integration now has dropdowns so that users can select the secret values in the linked service. This capability increases productivity because users aren't required to type in the secrets, which could result in human error.</td></tr>
<tr><td>Support for user-assigned managed identity in Data Factory</td><td>Credential safety is crucial for any enterprise. The Data Factory team is committed to making the data engineering process secure yet simple for data engineers. User-assigned managed identity (preview) is now supported in all connectors and linked services that support Azure AD-based authentication.<br><a href="https://techcommunity.microsoft.com/t5/azure-data-factory/support-for-user-assigned-managed-identity-in-azure-data-factory/ba-p/2841013">Learn more</a></td></tr>
</table>

## September 2021

<table>
<tr><td><b>Service category</b></td><td><b>Service improvements</b></td><td><b>Details</b></td></tr>

  <tr><td><b>Continuous integration and continuous delivery</b></td><td>Expanded CI/CD capabilities</td><td>You can now create a new Git branch based on any other branch in Data Factory.<br><a href="source-control.md#version-control">Learn more</a></td></tr>

<tr><td rowspan=3><b>Data movement</b></td><td>Amazon Relational Database Service (RDS) for Oracle sources</td><td>The Amazon RDS for Oracle sources connector is now available in both Data Factory and Azure Synapse.<br><a href="connector-amazon-rds-for-oracle.md">Learn more</a></td></tr>
<tr><td>Amazon RDS for SQL Server sources</td><td>The Amazon RDS for the SQL Server sources connector is now available in both Data Factory and Azure Synapse.<br><a href="connector-amazon-rds-for-sql-server.md">Learn more</a></td></tr>
<tr><td>Support parallel copy from Azure Database for PostgreSQL</td><td>The Azure Database for PostgreSQL connector now supports parallel copy operations.<br><a href="connector-azure-database-for-postgresql.md">Learn more</a></td></tr>

<tr><td rowspan=3><b>Data flow</b></td><td>Use Data Lake Storage Gen2 to execute pre- and post-processing commands</td><td>Hadoop Distributed File System pre- and post-processing commands can now be executed by using Data Lake Storage Gen2 sinks in data flows.<br><a href="connector-azure-data-lake-storage.md#pre-processing-and-post-processing-commands">Learn more</a></td></tr>
<tr><td>Edit data flow properties for existing instances of the Azure IR </td><td>The Azure IR has been updated to allow editing of data flow properties for existing IRs. You can now modify data flow compute properties without needing to create a new Azure IR.<br><a href="concepts-integration-runtime.md">Learn more</a></td></tr>
<tr><td>TTL setting for Azure Synapse to improve pipeline activities execution startup time</td><td>Azure Synapse has added TTL to the Azure IR to enable your data flow pipeline activities to begin execution in seconds, which greatly minimizes the runtime of your data flow pipelines.<br><a href="control-flow-execute-data-flow-activity.md#data-flow-integration-runtime">Learn more</a></td></tr>

<tr><td><b>Integration runtime</b></td><td>Data Factory managed virtual network GA</td><td>You can now provision the Azure IR as part of a managed virtual network and use private endpoints to securely connect to supported data stores. Data traffic goes through Azure Private Links, which provides secured connectivity to the data source. It also prevents data exfiltration to the public internet.<br><a href="managed-virtual-network-private-endpoint.md">Learn more</a></td></tr>

<tr><td rowspan=2><b>Orchestration</b></td><td>Operationalize and provide SLA for data pipelines</td><td>The new Elapsed Time Pipeline Run metric, combined with Data Factory alerts, empowers data pipeline developers to better deliver SLAs to their customers. Now you can tell us how long a pipeline should run, and we'll notify you proactively when the pipeline runs longer than expected.<br><a href="https://techcommunity.microsoft.com/t5/azure-data-factory/operationalize-and-provide-sla-for-data-pipelines/ba-p/2767768">Learn more</a></td></tr>
<tr><td>Fail activity (public preview)</td><td>The new Fail activity allows you to throw an error in a pipeline intentionally for any reason. For example, you might use the Fail activity if a Lookup activity returns no matching data or a custom activity finishes with an internal error.<br><a href="control-flow-fail-activity.md">Learn more</a></td></tr>
</table>


## August 2021

<table>
<tr><td><b>Service category</b></td><td><b>Service improvements</b></td><td><b>Details</b></td></tr>

  <tr><td><b>Continuous integration and continuous delivery</b></td><td>CI/CD improvements with GitHub support in Azure Government and Microsoft Azure operated by 21Vianet</td><td>We've added support for GitHub in Azure for US Government and Azure operated by 21Vianet.<br><a href="https://techcommunity.microsoft.com/t5/azure-data-factory/cicd-improvements-with-github-support-in-azure-government-and/ba-p/2686918">Learn more</a></td></tr>

<tr><td rowspan=2><b>Data movement</b></td><td>The Azure Cosmos DB API for MongoDB connector supports versions 3.6 and 4.0 in Data Factory</td><td>The Data Factory Azure Cosmos DB API for MongoDB connector now supports server versions 3.6 and 4.0.<br><a href="connector-azure-cosmos-db-mongodb-api.md">Learn more</a></td></tr>
<tr><td>Enhance using COPY statement to load data into Azure Synapse</td><td>The Data Factory Azure Synapse connector now supports staged copy and copy source with *.* as wildcardFilename for the COPY statement.<br><a href="connector-azure-sql-data-warehouse.md#use-copy-statement">Learn more</a></td></tr>

<tr><td><b>Data flow</b></td><td>REST endpoints are available as source and sink in data flow</td><td>Data flows in Data Factory and Azure Synapse now support REST endpoints as both a source and sink with full support for both JSON and XML payloads.<br><a href="https://techcommunity.microsoft.com/t5/azure-data-factory/rest-source-and-sink-now-available-for-data-flows/ba-p/2596484">Learn more</a></td></tr>

<tr><td><b>Integration runtime</b></td><td>Diagnostic tool is available for self-hosted IR</td><td>A diagnostic tool for self-hosted IR is designed to provide a better user experience and help users to find potential issues. The tool runs a series of test scenarios on the self-hosted IR machine. Every scenario has typical health check cases for common issues.<br><a href="https://techcommunity.microsoft.com/t5/azure-data-factory/diagnostic-tool-for-self-hosted-integration-runtime/ba-p/2634905">Learn more</a></td></tr>

<tr><td><b>Orchestration</b></td><td>Custom event trigger with advanced filtering option GA</td><td>You can now create a trigger that responds to a custom topic posted to Azure Event Grid. You can also use advanced filtering to get fine-grain control over what events to respond to.<br><a href="how-to-create-custom-event-trigger.md">Learn more</a></td></tr>
</table>


## July 2021

<table>
<tr><td><b>Service category</b></td><td><b>Service improvements</b></td><td><b>Details</b></td></tr>

<tr><td><b>Data movement</b></td><td>Get metadata-driven data ingestion pipelines on the Data Factory Copy Data tool within 10 minutes (public preview)</td><td>Now you can build large-scale data copy pipelines with a metadata-driven approach on the Copy Data tool (public preview) within 10 minutes.<br><a href="https://techcommunity.microsoft.com/t5/azure-data-factory/get-metadata-driven-data-ingestion-pipelines-on-adf-within-10/ba-p/2528219">Learn more</a></td></tr>

<tr><td><b>Data flow</b></td><td>New map functions added in data flow transformation functions</td><td>A new set of data flow transformation functions enables data engineers to easily generate, read, and update map data types and complex map structures.<br><a href="data-flow-map-functions.md">Learn more</a></td></tr>

<tr><td><b>Integration runtime</b></td><td>Five new regions are available in Data Factory managed virtual network (public preview)</td><td>Five new regions, China East2, China North2, US Government Arizona, US Government Texas, and US Government Virginia, are available in the Data Factory managed virtual network (public preview).<br></td></tr>

<tr><td rowspan=2><b>Developer productivity</b></td><td>Data Factory home page improvements</td><td>The Data Factory home page has been redesigned with better contrast and reflow capabilities. A few sections are introduced on the home page to help you improve productivity in your data integration journey.<br><a href="https://techcommunity.microsoft.com/t5/azure-data-factory/the-new-and-refreshing-data-factory-home-page/ba-p/2515076">Learn more</a></td></tr>
<tr><td>New landing page for Data Factory Studio</td><td>The landing page for the Data Factory pane in the Azure portal.<br><a href="https://techcommunity.microsoft.com/t5/azure-data-factory/the-new-and-refreshing-data-factory-home-page/ba-p/2515076">Learn more</a></td></tr>
</table>

## June 2021

<table>
<tr><td><b>Service category</b></td><td><b>Service improvements</b></td><td><b>Details</b></td></tr>

<tr><td rowspan=4 valign="middle"><b>Data movement</b></td><td>New user experience with Data Factory Copy Data tool</td><td>The redesigned Copy Data tool is now available with improved data ingestion experience.<br><a href="https://techcommunity.microsoft.com/t5/azure-data-factory/a-re-designed-copy-data-tool-experience/ba-p/2380634">Learn more</a></td></tr>
<tr><td>MongoDB and MongoDB Atlas are supported as both source and sink</td><td>This improvement supports copying data between any supported data store and MongoDB or MongoDB Atlas database.<br><a href="https://techcommunity.microsoft.com/t5/azure-data-factory/new-connectors-available-in-adf-mongodb-and-mongodb-atlas-are/ba-p/2441482">Learn more</a></td></tr>
<tr><td>Always Encrypted is supported for SQL Database, SQL Managed Instance, and SQL Server connectors as both source and sink</td><td>Always Encrypted is available in Data Factory for SQL Database, SQL Managed Instance, and SQL Server connectors for the Copy activity.<br><a href="https://techcommunity.microsoft.com/t5/azure-data-factory/azure-data-factory-copy-now-supports-always-encrypted-for-both/ba-p/2461346">Learn more</a></td></tr>
<tr><td>Setting custom metadata is supported in Copy activity when sinking to Data Lake Storage Gen2 or Blob Storage</td><td>When you write to Data Lake Storage Gen2 or Blob Storage, the Copy activity supports setting custom metadata or storage of the source file's last modified information as metadata.<br><a href="https://techcommunity.microsoft.com/t5/azure-data-factory/support-setting-custom-metadata-when-writing-to-blob-adls-gen2/ba-p/2545506#M490">Learn more</a></td></tr>

<tr><td rowspan=4 valign="middle"><b>Data flow</b></td><td>SQL Server is now supported as a source and sink in data flows</td><td>SQL Server is now supported as a source and sink in data flows. Follow the link for instructions on how to configure your networking by using the Azure IR managed virtual network feature to talk to your SQL Server on-premises and cloud VM-based instances.<br><a href="https://techcommunity.microsoft.com/t5/azure-data-factory/new-data-flow-connector-sql-server-as-source-and-sink/ba-p/2406213">Learn more</a></td></tr>
<tr><td>Dataflow Cluster quick reuse now enabled by default for all new Azure IRs</td><td>The popular data flow quick startup reuse feature is now generally available for Data Factory. All new Azure IRs now have quick reuse enabled by default.<br><a href="https://techcommunity.microsoft.com/t5/azure-data-factory/how-to-startup-your-data-flows-execution-in-less-than-5-seconds/ba-p/2267365">Learn more</a></td></tr>
<tr><td>Power Query (public preview) activity</td><td>You can now build complex field mappings to your Power Query sink by using Data Factory data wrangling. The sink is now configured in the pipeline in the Power Query (public preview) activity to accommodate this update.<br><a href="wrangling-tutorial.md">Learn more</a></td></tr>
<tr><td>Updated data flows monitoring UI in Data Factory</td><td>Data Factory has a new update for the monitoring UI to make it easier to view your data flow ETL job executions and quickly identify areas for performance tuning.<br><a href="https://techcommunity.microsoft.com/t5/azure-data-factory/updated-data-flows-monitoring-ui-in-adf-amp-synapse/ba-p/2432199">Learn more</a></td></tr>

<tr><td><b>SQL Server Integration Services</b></td><td>Run any SQL statements or scripts anywhere in three steps with SSIS in Data Factory</td><td>This post provides three steps to run any SQL statements or scripts anywhere with SSIS in Data Factory.<ol><li>Prepare your self-hosted IR or SSIS IR.</li><li>Prepare an Execute SSIS Package activity in Data Factory pipeline.</li><li>Run the Execute SSIS Package activity on your self-hosted IR or SSIS IR.</li></ol><a href="https://techcommunity.microsoft.com/t5/sql-server-integration-services/run-any-sql-anywhere-in-3-easy-steps-with-ssis-in-azure-data/ba-p/2457244">Learn more</a></td></tr>
</table>

## More information

- [What's New in Azure Data Factory - current months](whats-new.md)
- [Blog - Azure Data Factory](https://techcommunity.microsoft.com/t5/azure-data-factory/bg-p/AzureDataFactoryBlog)
- [Stack Overflow forum](https://stackoverflow.com/questions/tagged/azure-data-factory)
- [Twitter](https://twitter.com/AzDataFactory?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor)
- [Videos](https://www.youtube.com/channel/UC2S0k7NeLcEm5_IhHUwpN0g/featured)

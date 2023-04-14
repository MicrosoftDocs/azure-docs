---
title: What's new in Azure Data Factory 
description: This page highlights new features and recent improvements for Azure Data Factory. Data Factory is a managed cloud service that's built for complex hybrid extract-transform-and-load (ETL), extract-load-and-transform (ELT), and data integration projects.
author: pennyzhou-msft
ms.author: xupzhou
ms.service: data-factory
ms.subservice: concepts
ms.topic: overview
ms.custom: references_regions
ms.date: 10/10/2022
---

# What's new in Azure Data Factory

Azure Data Factory is improved on an ongoing basis. To stay up to date with the most recent developments, this article provides you with information about:

- The latest releases.
- Known issues.
- Bug fixes.
- Deprecated functionality.
- Plans for changes.

This page is updated monthly, so revisit it regularly.  For older months' updates, refer to the [What's new archive](whats-new-archive.md).

Check out our [What's New video archive](https://www.youtube.com/playlist?list=PLt4mCx89QIGS1rQlNt2-7iuHHAKSomVLv) for all of our monthly update videos.

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
- Directly launch Pipeline Template Gallery through Azure portal [Learn more]()

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
- New design in Azure portal – easily discover how to launch ADF Studio [Learn more](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/improved-ui-for-launching-azure-data-factory-studio/ba-p/3659610)
- Learning Center now available in the Azure Data Factory studio [Learn more](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/introducing-the-learning-center-to-azure-data-factory-studio/ba-p/3660888)
- One-click to try Azure Data Factory [Learn more](quickstart-get-started.md)

### Orchestration

- Granular billing view available for ADF – see detailed billing information by pipeline (Public Preview) [Learn more](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/granular-billing-for-azure-data-factory/ba-p/3654600)
- Script activity execution timeout now configurable [Learn more](transform-data-using-script.md)

### Region expansion

Continued region expansion – Qatar Central now supported [Learn more](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=data-factory)

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
   - Monitoring consumption improvement – loading icon added to know when consumption report is fully calculated 
   - Additional sorting columns in monitoring – sorting added for Pipeline name, Run End, and Status 
   - Time-zone settings now saved in monitoring 
- Gantt chart view now supported in IR monitoring [Learn more](monitor-integration-runtime.md)

### Orchestration

DELETE method in the Web activity now supports sending a body with HTTP request [Learn more](control-flow-web-activity.md#type-properties)

### User interface

- Native UI support of parameterization added for 6 additional linked services – SAP ODP, ODBC, Microsoft Access, Informix, Snowflake, and DB2 [Learn more](parameterize-linked-services.md?tabs=data-factory#supported-linked-service-types)
- Pipeline designer enhancements added in Studio Preview experience – users can view workflow inside pipeline objects like For Each, If Then, etc.  [Learn more](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/azure-data-factory-updated-pipeline-designer/ba-p/3618755)

## August 2022

### Video summary

> [!VIDEO https://www.youtube.com/embed?v=KCJ2F6Y_nfo&list=PLt4mCx89QIGS1rQlNt2-7iuHHAKSomVLv&index=5]

### Data flow
- Appfigures connector added as Source (Preview) [Learn more](connector-appfigures.md)
- Cast transformation added – visually convert data types [Learn more](data-flow-cast.md)
- New UI for inline datasets - categories added to easily find data sources [Learn more](data-flow-source.md#inline-datasets)

### Data movement
Service principal authentication type added for Azure Blob storage [Learn more](connector-azure-blob-storage.md?tabs=data-factory#service-principal-authentication)

### Developer productivity
- Default activity time-out changed from 7 days to 12 hours [Learn more](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/azure-data-factory-changing-default-pipeline-activity-timeout/ba-p/3598729)
- New data factory creation experience - one click to have your factory ready within seconds [Learn more](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/new-experience-for-creating-data-factory-within-seconds/ba-p/3561249)
- Expression builder UI update – categorical tabs added for easier use [Learn more](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/coming-soon-to-adf-more-pipeline-expression-builder-ease-of-use/ba-p/3567196)

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

## More information

- [What's new archive](whats-new-archive.md)
- [What's New video archive](https://www.youtube.com/playlist?list=PLt4mCx89QIGS1rQlNt2-7iuHHAKSomVLv)
- [Blog - Azure Data Factory](https://techcommunity.microsoft.com/t5/azure-data-factory/bg-p/AzureDataFactoryBlog)
- [Stack Overflow forum](https://stackoverflow.com/questions/tagged/azure-data-factory)
- [Twitter](https://twitter.com/AzDataFactory?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor)
- [Videos](https://www.youtube.com/channel/UC2S0k7NeLcEm5_IhHUwpN0g/featured)

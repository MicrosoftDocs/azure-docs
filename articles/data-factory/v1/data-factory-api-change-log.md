---
title: Data Factory - .NET API Change Log 
description: Describes breaking changes, feature additions, bug fixes, and so on, in a specific version of .NET API for the Azure Data Factory.
author: dcstwh
ms.author: weetok
ms.reviewer: jonburchel
ms.service: data-factory
ms.subservice: v1
ms.custom: devx-track-dotnet
ms.topic: conceptual
robots: noindex
ms.date: 04/12/2023
---

# Azure Data Factory - .NET API change log
> [!NOTE]
> This article applies to version 1 of Data Factory. 

This article provides information about changes to Azure Data Factory SDK in a specific version. You can find the latest NuGet package for Azure Data Factory [here](https://www.nuget.org/packages/Microsoft.Azure.Management.DataFactories)

## Version 4.11.0
Feature Additions:

* The following linked service types have been added:
  * [OnPremisesMongoDbLinkedService](/dotnet/api/microsoft.azure.management.datafactories.models.onpremisesmongodblinkedservice)
  * [AmazonRedshiftLinkedService](/dotnet/api/microsoft.azure.management.datafactories.models.amazonredshiftlinkedservice)
  * [AwsAccessKeyLinkedService](/dotnet/api/microsoft.azure.management.datafactories.models.awsaccesskeylinkedservice)
* The following dataset types have been added:
  * [MongoDbCollectionDataset](/dotnet/api/microsoft.azure.management.datafactories.models.mongodbcollectiondataset)
  * [AmazonS3Dataset](/dotnet/api/microsoft.azure.management.datafactories.models.amazons3dataset)
* The following copy source types have been added:
  * [MongoDbSource](/dotnet/api/microsoft.azure.management.datafactories.models.mongodbsource)

## Version 4.10.0
* The following optional properties have been added to TextFormat:
  * [SkipLineCount](/dotnet/api/microsoft.azure.management.datafactories.models.textformat)
  * [FirstRowAsHeader](/dotnet/api/microsoft.azure.management.datafactories.models.textformat)
  * [TreatEmptyAsNull](/dotnet/api/microsoft.azure.management.datafactories.models.textformat)
* The following linked service types have been added:
  * [OnPremisesCassandraLinkedService](/dotnet/api/microsoft.azure.management.datafactories.models.onpremisescassandralinkedservice)
  * [SalesforceLinkedService](/dotnet/api/microsoft.azure.management.datafactories.models.salesforcelinkedservice)
* The following dataset types have been added:
  * [OnPremisesCassandraTableDataset](/dotnet/api/microsoft.azure.management.datafactories.models.onpremisescassandratabledataset)
* The following copy source types have been added:
  * [CassandraSource](/dotnet/api/microsoft.azure.management.datafactories.models.cassandrasource)
* Add [WebServiceInputs](/dotnet/api/microsoft.azure.management.datafactories.models.azuremlbatchexecutionactivity) property to AzureMLBatchExecutionActivity
  * Enable passing multiple web service inputs to an Azure Machine Learning experiment

## Version 4.9.1
### Bug fix
* Deprecate WebApi-based authentication for [WebLinkedService](/dotnet/api/microsoft.azure.management.datafactories.models.weblinkedservice).

## Version 4.9.0
### Feature Additions
* Add [EnableStaging](/dotnet/api/microsoft.azure.management.datafactories.models.copyactivity) and [StagingSettings](/dotnet/api/microsoft.azure.management.datafactories.models.stagingsettings) properties to CopyActivity. See [Staged copy](data-factory-copy-activity-performance.md#staged-copy) for details on the feature.

### Bug fix
* Introduce an overload of [ActivityWindowOperationExtensions.List](/dotnet/api/microsoft.azure.management.datafactories.activitywindowoperationsextensions) method, which takes an [ActivityWindowsByActivityListParameters](/dotnet/api/microsoft.azure.management.datafactories.models.activitywindowsbyactivitylistparameters) instance.
* Mark [WriteBatchSize](/dotnet/api/microsoft.azure.management.datafactories.models.copysink) and [WriteBatchTimeout](/dotnet/api/microsoft.azure.management.datafactories.models.copysink) as optional in CopySink.

## Version 4.8.0
### Feature Additions
* The following optional properties have been added to Copy activity type to enable tuning of copy performance:
  * [ParallelCopies](/dotnet/api/microsoft.azure.management.datafactories.models.copyactivity)
  * [CloudDataMovementUnits](/dotnet/api/microsoft.azure.management.datafactories.models.copyactivity)

## Version 4.7.0
### Feature Additions
* Added new StorageFormat type [OrcFormat](/dotnet/api/microsoft.azure.management.datafactories.models.orcformat) type to copy files in optimized row columnar (ORC) format.
* Add [AllowPolyBase](/dotnet/api/microsoft.azure.management.datafactories.models.sqldwsink) and PolyBaseSettings properties to SqlDWSink.
  * Enables the use of PolyBase to copy data into Azure Synapse Analytics.

## Version 4.6.1
### Bug Fixes
* Fixes HTTP request for listing activity windows.
  * Removes the resource group name and the data factory name from the request payload.

## Version 4.6.0
### Feature Additions
* The following properties have been added to [PipelineProperties](/dotnet/api/microsoft.azure.management.datafactories.models.pipelineproperties):
  * [PipelineMode](/dotnet/api/microsoft.azure.management.datafactories.models.pipelineproperties)
  * [ExpirationTime](/dotnet/api/microsoft.azure.management.datafactories.models.pipelineproperties)
  * [Datasets](/dotnet/api/microsoft.azure.management.datafactories.models.pipelineproperties)
* The following properties have been added to [PipelineRuntimeInfo](/dotnet/api/microsoft.azure.management.datafactories.common.models.pipelineruntimeinfo):
  * [PipelineState](/dotnet/api/microsoft.azure.management.datafactories.common.models.pipelineruntimeinfo)
* Added new [StorageFormat](/dotnet/api/microsoft.azure.management.datafactories.models.storageformat) type [JsonFormat](/dotnet/api/microsoft.azure.management.datafactories.models.jsonformat) type to define datasets whose data is in JSON format.

## Version 4.5.0
### Feature Additions
* Added [list operations for activity window](/dotnet/api/microsoft.azure.management.datafactories.activitywindowoperationsextensions).
  * Added methods to retrieve activity windows with filters based on the entity types (that is, data factories, datasets, pipelines, and activities).
* The following linked service types have been added:
  * [ODataLinkedService](/dotnet/api/microsoft.azure.management.datafactories.models.odatalinkedservice), [WebLinkedService](/dotnet/api/microsoft.azure.management.datafactories.models.weblinkedservice)
* The following dataset types have been added:
  * [ODataResourceDataset](/dotnet/api/microsoft.azure.management.datafactories.models.odataresourcedataset), [WebTableDataset](/dotnet/api/microsoft.azure.management.datafactories.models.webtabledataset)
* The following copy source types have been added:     
  * [WebSource](/dotnet/api/microsoft.azure.management.datafactories.models.websource)

## Version 4.4.0
### Feature additions
* The following linked service type has been added as data sources and sinks for copy activities:
  * [AzureStorageSasLinkedService](/dotnet/api/microsoft.azure.management.datafactories.models.azurestoragesaslinkedservice). See [Azure Storage SAS Linked Service](data-factory-azure-blob-connector.md#azure-storage-sas-linked-service) for conceptual information and examples.

## Version 4.3.0
### Feature additions
* The following linked service types haven been added as data sources for copy activities:
  * [HdfsLinkedService](/dotnet/api/microsoft.azure.management.datafactories.models.hdfslinkedservice). See [Move data from HDFS using Data Factory](data-factory-hdfs-connector.md) for conceptual information and examples.
  * [OnPremisesOdbcLinkedService](/dotnet/api/microsoft.azure.management.datafactories.models.onpremisesodbclinkedservice). See [Move data From ODBC data stores using Azure Data Factory](data-factory-odbc-connector.md) for conceptual information and examples.

## Version 4.2.0
### Feature additions
* The following new activity type has been added: [AzureMLUpdateResourceActivity](/dotnet/api/microsoft.azure.management.datafactories.models.azuremlupdateresourceactivity). For details about the activity, see [Updating Azure ML models using the Update Resource Activity](data-factory-azure-ml-batch-execution-activity.md).
* A new optional property [updateResourceEndpoint](/dotnet/api/microsoft.azure.management.datafactories.models.azuremllinkedservice) has been added to the [AzureMLLinkedService class](/dotnet/api/microsoft.azure.management.datafactories.models.azuremllinkedservice).
* [LongRunningOperationInitialTimeout](/dotnet/api/microsoft.azure.management.datafactories.datafactorymanagementclient) and [LongRunningOperationRetryTimeout](/dotnet/api/microsoft.azure.management.datafactories.datafactorymanagementclient) properties have been added to the [DataFactoryManagementClient](/dotnet/api/microsoft.azure.management.datafactories.datafactorymanagementclient) class.
* Allow configuration of the timeouts for client calls to the Data Factory service.

## Version 4.1.0
### Feature additions
* The following linked service types have been added:
  * [AzureDataLakeStoreLinkedService](/dotnet/api/microsoft.azure.management.datafactories.models.azuredatalakestorelinkedservice)
  * [AzureDataLakeAnalyticsLinkedService](/dotnet/api/microsoft.azure.management.datafactories.models.azuredatalakeanalyticslinkedservice)
* The following activity types have been added:
  * [DataLakeAnalyticsUSQLActivity](/dotnet/api/microsoft.azure.management.datafactories.models.datalakeanalyticsusqlactivity)
* The following dataset types have been added:
  * [AzureDataLakeStoreDataset](/dotnet/api/microsoft.azure.management.datafactories.models.azuredatalakestoredataset)
* The following source and sink types for Copy Activity have been added:
  * [AzureDataLakeStoreSource](/dotnet/api/microsoft.azure.management.datafactories.models.azuredatalakestoresource)
  * [AzureDataLakeStoreSink](/dotnet/api/microsoft.azure.management.datafactories.models.azuredatalakestoresink)

## Version 4.0.1
### Breaking changes
The following classes have been renamed. The new names were the original names of classes before 4.0.0 release.

| Name in 4.0.0 | Name in 4.0.1 |
|:--- |:--- |
| AzureSqlDataWarehouseDataset |[AzureSqlDataWarehouseTableDataset](/dotnet/api/microsoft.azure.management.datafactories.models.azuresqldatawarehousetabledataset) |
| AzureSqlDataset |[AzureSqlTableDataset](/dotnet/api/microsoft.azure.management.datafactories.models.azuresqltabledataset) |
| AzureDataset |[AzureTableDataset](/dotnet/api/microsoft.azure.management.datafactories.models.azuretabledataset) |
| OracleDataset |[OracleTableDataset](/dotnet/api/microsoft.azure.management.datafactories.models.oracletabledataset) |
| RelationalDataset |[RelationalTableDataset](/dotnet/api/microsoft.azure.management.datafactories.models.relationaltabledataset) |
| SqlServerDataset |[SqlServerTableDataset](/dotnet/api/microsoft.azure.management.datafactories.models.sqlservertabledataset) |

## Version 4.0.0

### Breaking changes

* The Following classes/interfaces have been renamed.

| Old name | New name |
|:--- |:--- |
| ITableOperations |[IDatasetOperations](/dotnet/api/microsoft.azure.management.datafactories.idatasetoperations) |
| Table |[Dataset](/dotnet/api/microsoft.azure.management.datafactories.models.dataset) |
| TableProperties |[DatasetProperties](/dotnet/api/microsoft.azure.management.datafactories.models.datasetproperties) |
| TableTypeProprerties |[DatasetTypeProperties](/dotnet/api/microsoft.azure.management.datafactories.models.datasettypeproperties) |
| TableCreateOrUpdateParameters |[DatasetCreateOrUpdateParameters](/dotnet/api/microsoft.azure.management.datafactories.models.datasetcreateorupdateparameters) |
| TableCreateOrUpdateResponse |[DatasetCreateOrUpdateResponse](/dotnet/api/microsoft.azure.management.datafactories.models.datasetcreateorupdateresponse) |
| TableGetResponse |[DatasetGetResponse](/dotnet/api/microsoft.azure.management.datafactories.models.datasetgetresponse) |
| TableListResponse |[DatasetListResponse](/dotnet/api/microsoft.azure.management.datafactories.models.datasetlistresponse) |
| CreateOrUpdateWithRawJsonContentParameters |[DatasetCreateOrUpdateWithRawJsonContentParameters](/dotnet/api/microsoft.azure.management.datafactories.models.datasetcreateorupdatewithrawjsoncontentparameters) |

* The **List** methods return paged results now. If the response contains a non-empty **NextLink** property, the client application needs to continue fetching the next page until all pages are returned.  Here is an example:

  ```csharp
    PipelineListResponse response = client.Pipelines.List("ResourceGroupName", "DataFactoryName");
    var pipelines = new List<Pipeline>(response.Pipelines);

    string nextLink = response.NextLink;
    while (!string.IsNullOrEmpty(nextLink))
    {
        PipelineListResponse nextResponse = client.Pipelines.ListNext(nextLink);
        pipelines.AddRange(nextResponse.Pipelines);

        nextLink = nextResponse.NextLink;
    }
  ```

* **List** pipeline API returns only the summary of a pipeline instead of full details. For instance, activities in a pipeline summary only contain name and type.

### Feature additions
* The [SqlDWSink](/dotnet/api/microsoft.azure.management.datafactories.models.sqldwsink) class supports two new properties, **SliceIdentifierColumnName** and **SqlWriterCleanupScript**, to support idempotent copy to Azure Synapse Analytics. See the [Azure Synapse Analytics](data-factory-azure-sql-data-warehouse-connector.md) article for details about these properties.
* We now support running stored procedure against Azure SQL Database and Azure Synapse Analytics sources as part of the Copy Activity. The [SqlSource](/dotnet/api/microsoft.azure.management.datafactories.models.sqlsource) and [SqlDWSource](/dotnet/api/microsoft.azure.management.datafactories.models.sqldwsource) classes have the following properties: **SqlReaderStoredProcedureName** and **StoredProcedureParameters**. See the [Azure SQL Database](data-factory-azure-sql-connector.md#sqlsource) and [Azure Synapse Analytics](data-factory-azure-sql-data-warehouse-connector.md#sqldwsource) articles on Azure.com for details about these properties.

---
title: Data Factory - .NET API Change Log 
description: Describes breaking changes, feature additions, bug fixes, and so on, in a specific version of .NET API for the Azure Data Factory.
services: data-factory
documentationcenter: ''
author: djpmsft
ms.author: daperlov
manager: jroth
ms.reviewer: maghan
ms.service: data-factory
ms.workload: data-services
ms.topic: conceptual
robots: noindex
ms.date: 01/22/2018
---

# Azure Data Factory - .NET API change log
> [!NOTE]
> This article applies to version 1 of Data Factory. 

This article provides information about changes to Azure Data Factory SDK in a specific version. You can find the latest NuGet package for Azure Data Factory [here](https://www.nuget.org/packages/Microsoft.Azure.Management.DataFactories)

## Version 4.11.0
Feature Additions:

* The following linked service types have been added:
  * [OnPremisesMongoDbLinkedService](https://msdn.microsoft.com/library/mt765129.aspx)
  * [AmazonRedshiftLinkedService](https://msdn.microsoft.com/library/mt765121.aspx)
  * [AwsAccessKeyLinkedService](https://msdn.microsoft.com/library/mt765144.aspx)
* The following dataset types have been added:
  * [MongoDbCollectionDataset](https://msdn.microsoft.com/library/mt765145.aspx)
  * [AmazonS3Dataset](https://msdn.microsoft.com/library/mt765112.aspx)
* The following copy source types have been added:
  * [MongoDbSource](https://msdn.microsoft.com/library/mt765123.aspx)

## Version 4.10.0
* The following optional properties have been added to TextFormat:
  * [SkipLineCount](https://msdn.microsoft.com/library/azure/microsoft.azure.management.datafactories.models.textformat.skiplinecount.aspx)
  * [FirstRowAsHeader](https://msdn.microsoft.com/library/azure/microsoft.azure.management.datafactories.models.textformat.firstrowasheader.aspx)
  * [TreatEmptyAsNull](https://msdn.microsoft.com/library/azure/microsoft.azure.management.datafactories.models.textformat.treatemptyasnull.aspx)
* The following linked service types have been added:
  * [OnPremisesCassandraLinkedService](https://msdn.microsoft.com/library/azure/microsoft.azure.management.datafactories.models.onpremisescassandralinkedservice.aspx)
  * [SalesforceLinkedService](https://msdn.microsoft.com/library/azure/microsoft.azure.management.datafactories.models.salesforcelinkedservice.aspx)
* The following dataset types have been added:
  * [OnPremisesCassandraTableDataset](https://msdn.microsoft.com/library/azure/microsoft.azure.management.datafactories.models.onpremisescassandratabledataset.aspx)
* The following copy source types have been added:
  * [CassandraSource](https://msdn.microsoft.com/library/azure/microsoft.azure.management.datafactories.models.cassandrasource.aspx)
* Add [WebServiceInputs](https://msdn.microsoft.com/library/azure/microsoft.azure.management.datafactories.models.azuremlbatchexecutionactivity.webserviceinputs.aspx) property to AzureMLBatchExecutionActivity
  * Enable passing multiple web service inputs to an Azure Machine Learning experiment

## Version 4.9.1
### Bug fix
* Deprecate WebApi-based authentication for [WebLinkedService](https://msdn.microsoft.com/library/azure/microsoft.azure.management.datafactories.models.weblinkedservice.authenticationtype.aspx).

## Version 4.9.0
### Feature Additions
* Add [EnableStaging](https://msdn.microsoft.com/library/mt767916.aspx) and [StagingSettings](https://msdn.microsoft.com/library/mt767918.aspx) properties to CopyActivity. See [Staged copy](data-factory-copy-activity-performance.md#staged-copy) for details on the feature.

### Bug fix
* Introduce an overload of [ActivityWindowOperationExtensions.List](https://msdn.microsoft.com/library/mt767915.aspx) method, which takes an [ActivityWindowsByActivityListParameters](https://msdn.microsoft.com/library/microsoft.azure.management.datafactories.models.activitywindowsbyactivitylistparameters.aspx) instance.
* Mark [WriteBatchSize](https://msdn.microsoft.com/library/dn884293.aspx) and [WriteBatchTimeout](https://msdn.microsoft.com/library/dn884245.aspx) as optional in CopySink.

## Version 4.8.0
### Feature Additions
* The following optional properties have been added to Copy activity type to enable tuning of copy performance:
  * [ParallelCopies](https://msdn.microsoft.com/library/mt767910.aspx)
  * [CloudDataMovementUnits](https://msdn.microsoft.com/library/mt767912.aspx)

## Version 4.7.0
### Feature Additions
* Added new StorageFormat type [OrcFormat](https://msdn.microsoft.com/library/mt723391.aspx) type to copy files in optimized row columnar (ORC) format.
* Add [AllowPolyBase](https://msdn.microsoft.com/library/mt723396.aspx) and PolyBaseSettings properties to SqlDWSink.
  * Enables the use of PolyBase to copy data into SQL Data Warehouse.

## Version 4.6.1
### Bug Fixes
* Fixes HTTP request for listing activity windows.
  * Removes the resource group name and the data factory name from the request payload.

## Version 4.6.0
### Feature Additions
* The following properties have been added to [PipelineProperties](https://msdn.microsoft.com/library/microsoft.azure.management.datafactories.models.pipelineproperties_properties.aspx):
  * [PipelineMode](https://msdn.microsoft.com/library/microsoft.azure.management.datafactories.models.pipelineproperties.pipelinemode.aspx)
  * [ExpirationTime](https://msdn.microsoft.com/library/microsoft.azure.management.datafactories.models.pipelineproperties.expirationtime.aspx)
  * [Datasets](https://msdn.microsoft.com/library/microsoft.azure.management.datafactories.models.pipelineproperties.datasets.aspx)
* The following properties have been added to [PipelineRuntimeInfo](https://msdn.microsoft.com/library/microsoft.azure.management.datafactories.common.models.pipelineruntimeinfo.aspx):
  * [PipelineState](https://msdn.microsoft.com/library/microsoft.azure.management.datafactories.common.models.pipelineruntimeinfo.pipelinestate.aspx)
* Added new [StorageFormat](https://msdn.microsoft.com/library/azure/microsoft.azure.management.datafactories.models.storageformat.aspx) type [JsonFormat](https://msdn.microsoft.com/library/azure/microsoft.azure.management.datafactories.models.jsonformat.aspx) type to define datasets whose data is in JSON format.

## Version 4.5.0
### Feature Additions
* Added [list operations for activity window](https://msdn.microsoft.com/library/microsoft.azure.management.datafactories.activitywindowoperationsextensions.aspx).
  * Added methods to retrieve activity windows with filters based on the entity types (that is, data factories, datasets, pipelines, and activities).
* The following linked service types have been added:
  * [ODataLinkedService](https://msdn.microsoft.com/library/microsoft.azure.management.datafactories.models.odatalinkedservice.aspx), [WebLinkedService](https://msdn.microsoft.com/library/microsoft.azure.management.datafactories.models.weblinkedservice.aspx)
* The following dataset types have been added:
  * [ODataResourceDataset](https://msdn.microsoft.com/library/microsoft.azure.management.datafactories.models.odataresourcedataset.aspx), [WebTableDataset](https://msdn.microsoft.com/library/microsoft.azure.management.datafactories.models.webtabledataset.aspx)
* The following copy source types have been added:     
  * [WebSource](https://msdn.microsoft.com/library/microsoft.azure.management.datafactories.models.websource.aspx)

## Version 4.4.0
### Feature additions
* The following linked service type has been added as data sources and sinks for copy activities:
  * [AzureStorageSasLinkedService](https://msdn.microsoft.com/library/azure/microsoft.azure.management.datafactories.models.azurestoragesaslinkedservice.aspx). See [Azure Storage SAS Linked Service](data-factory-azure-blob-connector.md#azure-storage-sas-linked-service) for conceptual information and examples.

## Version 4.3.0
### Feature additions
* The following linked service types haven been added as data sources for copy activities:
  * [HdfsLinkedService](https://msdn.microsoft.com/library/azure/microsoft.azure.management.datafactories.models.hdfslinkedservice.aspx). See [Move data from HDFS using Data Factory](data-factory-hdfs-connector.md) for conceptual information and examples.
  * [OnPremisesOdbcLinkedService](https://msdn.microsoft.com/library/azure/microsoft.azure.management.datafactories.models.onpremisesodbclinkedservice.aspx). See [Move data From ODBC data stores using Azure Data Factory](data-factory-odbc-connector.md) for conceptual information and examples.

## Version 4.2.0
### Feature additions
* The following new activity type has been added: [AzureMLUpdateResourceActivity](https://msdn.microsoft.com/library/microsoft.azure.management.datafactories.models.azuremlupdateresourceactivity.aspx). For details about the activity, see [Updating Azure ML models using the Update Resource Activity](data-factory-azure-ml-batch-execution-activity.md).
* A new optional property [updateResourceEndpoint](https://msdn.microsoft.com/library/microsoft.azure.management.datafactories.models.azuremllinkedservice.updateresourceendpoint.aspx) has been added to the [AzureMLLinkedService class](https://msdn.microsoft.com/library/microsoft.azure.management.datafactories.models.azuremllinkedservice.aspx).
* [LongRunningOperationInitialTimeout](https://msdn.microsoft.com/library/azure/microsoft.azure.management.datafactories.datafactorymanagementclient.longrunningoperationinitialtimeout.aspx) and [LongRunningOperationRetryTimeout](https://msdn.microsoft.com/library/azure/microsoft.azure.management.datafactories.datafactorymanagementclient.longrunningoperationretrytimeout.aspx) properties have been added to the [DataFactoryManagementClient](https://msdn.microsoft.com/library/azure/microsoft.azure.management.datafactories.datafactorymanagementclient.aspx) class.
* Allow configuration of the timeouts for client calls to the Data Factory service.

## Version 4.1.0
### Feature additions
* The following linked service types have been added:
  * [AzureDataLakeStoreLinkedService](https://msdn.microsoft.com/library/microsoft.azure.management.datafactories.models.azuredatalakestorelinkedservice.aspx)
  * [AzureDataLakeAnalyticsLinkedService](https://msdn.microsoft.com/library/microsoft.azure.management.datafactories.models.azuredatalakeanalyticslinkedservice.aspx)
* The following activity types have been added:
  * [DataLakeAnalyticsUSQLActivity](https://msdn.microsoft.com/library/microsoft.azure.management.datafactories.models.datalakeanalyticsusqlactivity.aspx)
* The following dataset types have been added:
  * [AzureDataLakeStoreDataset](https://msdn.microsoft.com/library/microsoft.azure.management.datafactories.models.azuredatalakestoredataset.aspx)
* The following source and sink types for Copy Activity have been added:
  * [AzureDataLakeStoreSource](https://msdn.microsoft.com/library/microsoft.azure.management.datafactories.models.azuredatalakestoresource.aspx)
  * [AzureDataLakeStoreSink](https://msdn.microsoft.com/library/microsoft.azure.management.datafactories.models.azuredatalakestoresink.aspx)

## Version 4.0.1
### Breaking changes
The following classes have been renamed. The new names were the original names of classes before 4.0.0 release.

| Name in 4.0.0 | Name in 4.0.1 |
|:--- |:--- |
| AzureSqlDataWarehouseDataset |[AzureSqlDataWarehouseTableDataset](https://msdn.microsoft.com/library/microsoft.azure.management.datafactories.models.azuresqldatawarehousetabledataset.aspx) |
| AzureSqlDataset |[AzureSqlTableDataset](https://msdn.microsoft.com/library/microsoft.azure.management.datafactories.models.azuresqltabledataset.aspx) |
| AzureDataset |[AzureTableDataset](https://msdn.microsoft.com/library/microsoft.azure.management.datafactories.models.azuretabledataset.aspx) |
| OracleDataset |[OracleTableDataset](https://msdn.microsoft.com/library/microsoft.azure.management.datafactories.models.oracletabledataset.aspx) |
| RelationalDataset |[RelationalTableDataset](https://msdn.microsoft.com/library/microsoft.azure.management.datafactories.models.relationaltabledataset.aspx) |
| SqlServerDataset |[SqlServerTableDataset](https://msdn.microsoft.com/library/microsoft.azure.management.datafactories.models.sqlservertabledataset.aspx) |

## Version 4.0.0
### Breaking changes
* The Following classes/interfaces have been renamed.

| Old name | New name |
|:--- |:--- |
| ITableOperations |[IDatasetOperations](https://msdn.microsoft.com/library/microsoft.azure.management.datafactories.idatasetoperations.aspx) |
| Table |[Dataset](https://msdn.microsoft.com/library/microsoft.azure.management.datafactories.models.dataset.aspx) |
| TableProperties |[DatasetProperties](https://msdn.microsoft.com/library/microsoft.azure.management.datafactories.models.datasetproperties.aspx) |
| TableTypeProprerties |[DatasetTypeProperties](https://msdn.microsoft.com/library/microsoft.azure.management.datafactories.models.datasettypeproperties.aspx) |
| TableCreateOrUpdateParameters |[DatasetCreateOrUpdateParameters](https://msdn.microsoft.com/library/microsoft.azure.management.datafactories.models.datasetcreateorupdateparameters.aspx) |
| TableCreateOrUpdateResponse |[DatasetCreateOrUpdateResponse](https://msdn.microsoft.com/library/microsoft.azure.management.datafactories.models.datasetcreateorupdateresponse.aspx) |
| TableGetResponse |[DatasetGetResponse](https://msdn.microsoft.com/library/microsoft.azure.management.datafactories.models.datasetgetresponse.aspx) |
| TableListResponse |[DatasetListResponse](https://msdn.microsoft.com/library/microsoft.azure.management.datafactories.models.datasetlistresponse.aspx) |
| CreateOrUpdateWithRawJsonContentParameters |[DatasetCreateOrUpdateWithRawJsonContentParameters](https://msdn.microsoft.com/library/microsoft.azure.management.datafactories.models.datasetcreateorupdatewithrawjsoncontentparameters.aspx) |

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
* The [SqlDWSink](https://msdn.microsoft.com/library/azure/microsoft.azure.management.datafactories.models.sqldwsink.aspx) class supports two new properties, **SliceIdentifierColumnName** and **SqlWriterCleanupScript**, to support idempotent copy to Azure SQL Data Warehouse. See the [Azure SQL Data Warehouse](data-factory-azure-sql-data-warehouse-connector.md) article for details about these properties.
* We now support running stored procedure against Azure SQL Database and Azure SQL Data Warehouse sources as part of the Copy Activity. The [SqlSource](https://msdn.microsoft.com/library/azure/microsoft.azure.management.datafactories.models.sqlsource.aspx) and [SqlDWSource](https://msdn.microsoft.com/library/azure/microsoft.azure.management.datafactories.models.sqldwsource.aspx) classes have the following properties: **SqlReaderStoredProcedureName** and **StoredProcedureParameters**. See the [Azure SQL Database](data-factory-azure-sql-connector.md#sqlsource) and [Azure SQL Data Warehouse](data-factory-azure-sql-data-warehouse-connector.md#sqldwsource) articles on Azure.com for details about these properties.  

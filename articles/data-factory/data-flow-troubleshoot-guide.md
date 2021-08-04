---
title: Troubleshoot mapping data flows
description: Learn how to troubleshoot data flow problems in Azure Data Factory.
ms.author: makromer
author: kromerm
ms.reviewer: daperlov
ms.service: data-factory
ms.topic: troubleshooting
ms.date: 07/13/2021
---

# Troubleshoot mapping data flows in Azure Data Factory

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article explores common troubleshooting methods for mapping data flows in Azure Data Factory.

## Common error codes and messages 

### Error code: DF-Executor-SourceInvalidPayload
- **Message**: Data preview, debug, and pipeline data flow execution failed because container does not exist
- **Cause**: A dataset contains a container that doesn't exist in storage.
- **Recommendation**: Make sure that the container referenced in your dataset exists and can be accessed.

### Error code: DF-Executor-SystemInvalidJson

- **Message**: JSON parsing error, unsupported encoding or multiline
- **Cause**: Possible problems with the JSON file: unsupported encoding, corrupt bytes, or using JSON source as a single document on many nested lines.
- **Recommendation**: Verify that the JSON file's encoding is supported. On the source transformation that's using a JSON dataset, expand **JSON Settings** and turn on **Single Document**.
 
### Error code: DF-Executor-BroadcastTimeout

- **Message**: Broadcast join timeout error, make sure broadcast stream produces data within 60 secs in debug runs and 300 secs in job runs
- **Cause**: Broadcast has a default timeout of 60 seconds on debug runs and 300 seconds on job runs. The stream chosen for broadcast is too large to produce data within this limit.
- **Recommendation**: Check the **Optimize** tab on your data flow transformations for join, exists, and lookup. The default option for broadcast is **Auto**. If **Auto** is set, or if you're manually setting the left or right side to broadcast under **Fixed**, you can either set a larger Azure integration runtime (IR) configuration or turn off broadcast. For the best performance in data flows, we recommend that you allow Spark to broadcast by using **Auto** and use a memory-optimized Azure IR. 
 
  If you're running the data flow in a debug test execution from a debug pipeline run, you might run into this condition more frequently. That's because Azure Data Factory throttles the broadcast timeout to 60 seconds to maintain a faster debugging experience. You can extend the timeout to the 300-second timeout of a triggered run. To do so, you can use the **Debug** > **Use Activity Runtime** option to use the Azure IR defined in your Execute Data Flow pipeline activity.

- **Message**: Broadcast join timeout error, you can choose 'Off' of broadcast option in join/exists/lookup transformation to avoid this issue. If you intend to broadcast join option to improve performance then make sure broadcast stream can produce data within 60 secs in debug runs and 300 secs in job runs.
- **Cause**: Broadcast has a default timeout of 60 seconds in debug runs and 300 seconds in job runs. On the broadcast join, the stream chosen for broadcast is too large to produce data within this limit. If a broadcast join isn't used, the default broadcast by dataflow can reach the same limit.
- **Recommendation**: Turn off the broadcast option or avoid broadcasting large data streams for which the processing can take more than 60 seconds. Choose a smaller stream to broadcast. Large Azure SQL Data Warehouse tables and source files aren't typically good choices. In the absence of a broadcast join, use a larger cluster if this error occurs.

### Error code: DF-Executor-Conversion

- **Message**: Converting to a date or time failed due to an invalid character
- **Cause**: Data isn't in the expected format.
- **Recommendation**: Use the correct data type.

### Error code: DF-Executor-InvalidColumn
- **Message**: Column name needs to be specified in the query, set an alias if using a SQL function
- **Cause**: No column name is specified.
- **Recommendation**: Set an alias if you're using a SQL function like min() or max().

### Error code: DF-Executor-DriverError
- **Message**: INT96 is legacy timestamp type which is not supported by ADF Dataflow. Please consider upgrading the column type to the latest types.
- **Cause**: Driver error.
- **Recommendation**: INT96 is a legacy timestamp type that's not supported by Azure Data Factory data flow. Consider upgrading the column type to the latest type.

### Error code: DF-Executor-BlockCountExceedsLimitError
- **Message**: The uncommitted block count cannot exceed the maximum limit of 100,000 blocks. Check blob configuration.
- **Cause**: The maximum number of uncommitted blocks in a blob is 100,000.
- **Recommendation**: Contact the Microsoft product team for more details about this problem.

### Error code: DF-Executor-PartitionDirectoryError
- **Message**: The specified source path has either multiple partitioned directories (for e.g. &lt;Source Path&gt;/<Partition Root Directory 1>/a=10/b=20, &lt;Source Path&gt;/&lt;Partition Root Directory 2&gt;/c=10/d=30) or partitioned directory with other file or non-partitioned directory (for example &lt;Source Path&gt;/&lt;Partition Root Directory 1&gt;/a=10/b=20, &lt;Source Path&gt;/Directory 2/file1), remove partition root directory from source path and read it through separate source transformation.
- **Cause**: The source path has either multiple partitioned directories or a partitioned directory that has another file or non-partitioned directory.
- **Recommendation**: Remove the partitioned root directory from the source path and read it through separate source transformation.

### Error code: DF-Executor-InvalidType
- **Message**: Please make sure that the type of parameter matches with type of value passed in. Passing float parameters from pipelines isn't currently supported.
- **Cause**: Data types are incompatible between the declared type and the actual parameter value.
- **Recommendation**: Check that the parameter values passed into the data flow match the declared type.

### Error code: DF-Executor-ParseError
- **Message**: Expression cannot be parsed.
- **Cause**: An expression generated parsing errors because of incorrect formatting.
- **Recommendation**: Check the formatting in the expression.

### Error code: DF-Executor-SystemImplicitCartesian
- **Message**: Implicit cartesian product for INNER join is not supported, use CROSS JOIN instead. Columns used in join should create a unique key for rows.
- **Cause**: Implicit cartesian products for INNER joins between logical plans aren't supported. If you're using columns in the join, create a unique key.
- **Recommendation**: For non-equality based joins, use CROSS JOIN.

### Error code: GetCommand OutputAsync failed
- **Message**: During Data Flow debug and data preview: GetCommand OutputAsync failed with ...
- **Cause**: This error is a back-end service error. 
- **Recommendation**: Retry the operation and restart your debugging session. If retrying and restarting doesn't resolve the problem, contact customer support. 

### Error code: DF-Executor-OutOfMemoryError
 
- **Message**: Cluster ran into out of memory issue during execution, please retry using an integration runtime with bigger core count and/or memory optimized compute type
- **Cause**: The cluster is running out of memory.
- **Recommendation**: Debug clusters are meant for development. Use data sampling and an appropriate compute type and size to run the payload. For performance tips, see [Mapping data flow performance guide](concepts-data-flow-performance.md).

### Error code: DF-Executor-illegalArgument

- **Message**: Please make sure that the access key in your Linked Service is correct
- **Cause**: The account name or access key is incorrect.
- **Recommendation**: Ensure that the account name or access key specified in your linked service is correct. 

### Error code: DF-Executor-ColumnUnavailable
- **Message**: Column name used in expression is unavailable or invalid.
- **Cause**: An invalid or unavailable column name is used in an expression.
- **Recommendation**: Check the column names used in expressions.

 ### Error code: DF-Executor-OutOfDiskSpaceError
- **Message**: Internal server error
- **Cause**: The cluster is running out of disk space.
- **Recommendation**: Retry the pipeline. If doing so doesn't resolve the problem, contact customer support.


 ### Error code: DF-Executor-StoreIsNotDefined
- **Message**: The store configuration is not defined. This error is potentially caused by invalid parameter assignment in the pipeline.
- **Cause**: Invalid store configuration is provided.
- **Recommendation**: Check the parameter value assignment in the pipeline. A parameter expression may contain invalid characters.


### Error code: 4502
- **Message**: There are substantial concurrent MappingDataflow executions that are causing failures due to throttling under Integration Runtime.
- **Cause**: A large number of Data Flow activity runs are occurring concurrently on the integration runtime. For more information, see [Azure Data Factory limits](../azure-resource-manager/management/azure-subscription-service-limits.md#data-factory-limits).
- **Recommendation**: If you want to run more Data Flow activities in parallel, distribute them across multiple integration runtimes.

### Error code: 4510
- **Message**: Unexpected failure during execution. 
- **Cause**: Since debug clusters work differently from job clusters, excessive debug runs could wear the cluster over time, which could cause memory issues and abrupt restarts.
- **Recommendation**: Restart Debug cluster. If you are running multiple dataflows during debug session, use activity runs instead because activity level run creates separate session without taxing main debug cluster.

### Error code: InvalidTemplate
- **Message**: The pipeline expression cannot be evaluated.
- **Cause**: The pipeline expression passed in the Data Flow activity isn't being processed correctly because of a syntax error.
- **Recommendation**: Check your activity in activity monitoring to verify the expression.

### Error code: 2011
- **Message**: The activity was running on Azure Integration Runtime and failed to decrypt the credential of data store or compute connected via a Self-hosted Integration Runtime. Please check the configuration of linked services associated with this activity, and make sure to use the proper integration runtime type.
- **Cause**: Data flow doesn't support linked services on self-hosted integration runtimes.
- **Recommendation**: Configure data flow to run on a Managed Virtual Network integration runtime.

### Error code: DF-Xml-InvalidValidationMode
- **Message**: Invalid xml validation mode is provided.
- **Cause**: An invalid XML validation mode is provided.
- **Recommendation**: Check the parameter value and specify the right validation mode.

### Error code: DF-Xml-InvalidDataField
- **Message**: The field for corrupt records must be string type and nullable.
- **Cause**: An invalid data type of the column `\"_corrupt_record\"` is provided in the XML source.
- **Recommendation**: Make sure that the column `\"_corrupt_record\"` in the XML source has a string data type and nullable.

### Error code: DF-Xml-MalformedFile
- **Message**: Malformed xml with path in FAILFAST mode.
- **Cause**: Malformed XML with path exists in the FAILFAST mode.
- **Recommendation**: Update the content of the XML file to the right format.

### Error code: DF-Xml-InvalidReferenceResource
- **Message**: Reference resource in xml data file cannot be resolved.
- **Cause**: The reference resource in the XML data file cannot be resolved.
- **Recommendation**: You should check the reference resource in the XML data file.

### Error code: DF-Xml-InvalidSchema
- **Message**: Schema validation failed.
- **Cause**: The invalid schema is provided on the XML source.
- **Recommendation**: Check the schema settings on the XML source to make sure that it is the subset schema of the source data.

### Error code: DF-Xml-UnsupportedExternalReferenceResource
- **Message**: External reference resource in xml data file is not supported.
- **Cause**: The external reference resource in the XML data file is not supported.
- **Recommendation**: Update the XML file content when the external reference resource is not supported now.

### Error code: DF-GEN2-InvalidAccountConfiguration
- **Message**: Either one of account key or tenant/spnId/spnCredential/spnCredentialType or miServiceUri/miServiceToken should be specified.
- **Cause**: An invalid credential is provided in the ADLS Gen2 linked service.
- **Recommendation**: Update the ADLS Gen2 linked service to have the right credential configuration.

### Error code: DF-GEN2-InvalidAuthConfiguration
- **Message**: Only one of the three auth methods (Key, ServicePrincipal and MI) can be specified.
- **Cause**: Invalid auth method is provided in ADLS gen2 linked service.
- **Recommendation**: Update the ADLS Gen2 linked service to have one of three authentication methods that are Key, ServicePrincipal and MI.

### Error code: DF-GEN2-InvalidServicePrincipalCredentialType
- **Message**: Service principal credential type is invalid.
- **Cause**: The service principal credential type is invalid.
- **Recommendation**: Please update the ADLS Gen2 linked service to set the right service principal credential type.

### Error code: DF-Blob-InvalidAccountConfiguration
- **Message**: Either one of account key or sas token should be specified.
- **Cause**: An invalid credential is provided in the Azure Blob linked service.
- **Recommendation**: Use either account key or SAS token for the Azure Blob linked service.

### Error code: DF-Blob-InvalidAuthConfiguration
- **Message**: Only one of the two auth methods (Key, SAS) can be specified.
- **Cause**: An invalid authentication method is provided in the linked service.
- **Recommendation**: Use key or SAS authentication for the Azure Blob linked service.

### Error code: DF-Cosmos-PartitionKeyMissed
- **Message**: Partition key path should be specified for update and delete operations.
- **Cause**: The partition key path is missed in the Azure Cosmos DB sink.
- **Recommendation**: Use the providing partition key in the Azure Cosmos DB sink settings.

### Error code: DF-Cosmos-InvalidPartitionKey
- **Message**: Partition key path cannot be empty for update and delete operations.
- **Cause**: The partition key path is empty for update and delete operations.
- **Recommendation**: Use the providing partition key in the Azure Cosmos DB sink settings.


### Error code: DF-Cosmos-IdPropertyMissed
- **Message**: 'id' property should be mapped for delete and update operations.
- **Cause**: The `id` property is missed for update and delete operations.
- **Recommendation**: Make sure that the input data has an `id` column in Cosmos DB sink settings. If no, use **select or derive transformation** to generate this column before sink.

### Error code: DF-Cosmos-InvalidPartitionKeyContent
- **Message**: partition key should start with /.
- **Cause**: An invalid partition key is provided.
- **Recommendation**: Ensure that the partition key start with `/` in Cosmos DB sink settings, for example: `/movieId`.

### Error code: DF-Cosmos-InvalidPartitionKey
- **Message**: Partition key is not mapped in sink for delete and update operations.
- **Cause**: An invalid partition key is provided.
- **Recommendation**: In Cosmos DB sink settings, use the right partition key that is same as your container's partition key.

### Error code: DF-Cosmos-InvalidConnectionMode
- **Message**: Invalid connection mode.
- **Cause**: An invalid connection mode is provided.
- **Recommendation**: Confirm that the supported mode is **Gateway** and **DirectHttps** in Cosmos DB settings.

### Error code: DF-Cosmos-InvalidAccountConfiguration
- **Message**: Either accountName or accountEndpoint should be specified.
- **Cause**: Invalid account information is provided.
- **Recommendation**: In the Cosmos DB linked service, specify the account name or account endpoint.

### Error code: DF-Github-WriteNotSupported
- **Message**: Github store does not allow writes.
- **Cause**: The GitHub store is read only.
- **Recommendation**: The store entity definition is in some other place.
  
### Error code: DF-PGSQL-InvalidCredential
- **Message**: User/password should be specified.
- **Cause**: The User/password is missed.
- **Recommendation**: Make sure that you have right credential settings in the related PostgreSQL linked service.

### Error code: DF-Snowflake-InvalidStageConfiguration
- **Message**: Only blob storage type can be used as stage in snowflake read/write operation.
- **Cause**: An invalid staging configuration is provided in the Snowflake.
- **Recommendation**: Update Snowflake staging settings to ensure that only Azure Blob linked service is used.

### Error code: DF-Snowflake-InvalidStageConfiguration
- **Message**: Snowflake stage properties should be specified with Azure Blob + SAS authentication.
- **Cause**: An invalid staging configuration is provided in the Snowflake.
- **Recommendation**: Ensure that only the Azure Blob + SAS authentication is specified in the Snowflake staging settings.

### Error code: DF-Snowflake-InvalidDataType
- **Message**: The spark type is not supported in snowflake.
- **Cause**: An invalid data type is provided in the Snowflake.
- **Recommendation**: Please use the derive transformation before applying the Snowflake sink to update the related column of the input data into the string type.

### Error code: DF-Hive-InvalidBlobStagingConfiguration
- **Message**: Blob storage staging properties should be specified.
- **Cause**: An invalid staging configuration is provided in the Hive.
- **Recommendation**: Please check if the account key, account name and container are set properly in the related Blob linked service which is used as staging.

### Error code: DF-Hive-InvalidGen2StagingConfiguration
- **Message**: ADLS Gen2 storage staging only support service principal key credential.
- **Cause**: An invalid staging configuration is provided in the Hive.
- **Recommendation**: Please update the related ADLS Gen2 linked service that is used as staging. Currently, only the service principal key credential is supported.

### Error code: DF-Hive-InvalidGen2StagingConfiguration
- **Message**: ADLS Gen2 storage staging properties should be specified. Either one of key or tenant/spnId/spnKey or miServiceUri/miServiceToken is required.
- **Cause**: An invalid staging configuration is provided in the Hive.
- **Recommendation**: Update the related ADLS Gen2 linked service with right credentials that are used as staging in the Hive.

### Error code: DF-Hive-InvalidDataType
- **Message**: Unsupported Column(s).
- **Cause**: Unsupported Column(s) are provided.
- **Recommendation**: Update the column of input data to match the data type supported by the Hive.

### Error code: DF-Hive-InvalidStorageType
- **Message**: Storage type can either be blob or gen2.
- **Cause**: Only Azure Blob or ADLS Gen2 storage type is supported.
- **Recommendation**: Choose the right storage type from Azure Blob or ADLS Gen2.

### Error code: DF-Delimited-InvalidConfiguration
- **Message**: Either one of empty lines or custom header should be specified.
- **Cause**: An invalid delimited configuration is provided.
- **Recommendation**: Please update the CSV settings to specify one of empty lines or the custom header.

### Error code: DF-Delimited-ColumnDelimiterMissed
- **Message**: Column delimiter is required for parse.
- **Cause**: The column delimiter is missed.
- **Recommendation**: In your CSV settings, confirm that you have the column delimiter which is required for parse. 

### Error code: DF-MSSQL-InvalidCredential
- **Message**: Either one of user/pwd or tenant/spnId/spnKey or miServiceUri/miServiceToken should be specified.
- **Cause**: An invalid credential is provided in the MSSQL linked service.
- **Recommendation**: Please update the related MSSQL linked service with right credentials, and one of **user/pwd** or **tenant/spnId/spnKey** or **miServiceUri/miServiceToken** should be specified.

### Error code: DF-MSSQL-InvalidDataType
- **Message**: Unsupported field(s).
- **Cause**: Unsupported field(s) are provided.
- **Recommendation**: Modify the input data column to match the data type supported by MSSQL.

### Error code: DF-MSSQL-InvalidAuthConfiguration
- **Message**: Only one of the three auth methods (Key, ServicePrincipal and MI) can be specified.
- **Cause**: An invalid authentication method is provided in the MSSQL linked service.
- **Recommendation**: You can only specify one of the three authentication methods (Key, ServicePrincipal and MI) in the related MSSQL linked service.

### Error code: DF-MSSQL-InvalidCloudType
- **Message**: Cloud type is invalid.
- **Cause**: An invalid cloud type is provided.
- **Recommendation**: Check your cloud type in the related MSSQL linked service.

### Error code: DF-SQLDW-InvalidBlobStagingConfiguration
- **Message**: Blob storage staging properties should be specified.
- **Cause**: Invalid blob storage staging settings are provided
- **Recommendation**: Please check if the Blob linked service used for staging has correct properties.

### Error code: DF-SQLDW-InvalidStorageType
- **Message**: Storage type can either be blob or gen2.
- **Cause**: An invalid storage type is provided for staging.
- **Recommendation**: Check the storage type of the linked service used for staging and make sure that it is Blob or Gen2.

### Error code: DF-SQLDW-InvalidGen2StagingConfiguration
- **Message**: ADLS Gen2 storage staging only support service principal key credential.
- **Cause**: An invalid credential is provided for the ADLS gen2 storage staging.
- **Recommendation**: Use the service principal key credential of the Gen2 linked service used for staging.
 

### Error code: DF-SQLDW-InvalidConfiguration
- **Message**: ADLS Gen2 storage staging properties should be specified. Either one of key or tenant/spnId/spnCredential/spnCredentialType or miServiceUri/miServiceToken is required.
- **Cause**: Invalid ADLS Gen2 staging properties are provided.
- **Recommendation**: Please update ADLS Gen2 storage staging settings to have one of **key** or **tenant/spnId/spnCredential/spnCredentialType** or **miServiceUri/miServiceToken**.

### Error code: DF-DELTA-InvalidConfiguration
- **Message**: Timestamp and version can't be set at the same time.
- **Cause**: The timestamp and version can't be set at the same time.
- **Recommendation**: Set the timestamp or version in the delta settings.

### Error code: DF-DELTA-KeyColumnMissed
- **Message**: Key column(s) should be specified for non-insertable operations.
- **Cause**: Key column(s) are missed for non-insertable operations.
- **Recommendation**: Specify key column(s) on delta sink to have non-insertable operations.

### Error code: DF-DELTA-InvalidTableOperationSettings
- **Message**: Recreate and truncate options can't be both specified.
- **Cause**: Recreate and truncate options can't be specified simultaneously.
- **Recommendation**: Update delta settings to have either recreate or truncate operation.

### Error code: DF-Excel-WorksheetConfigMissed
- **Message**: Excel sheet name or index is required.
- **Cause**: An invalid Excel worksheet configuration is provided.
- **Recommendation**: Check the parameter value and specify the sheet name or index to read the Excel data.

### Error code: DF-Excel-InvalidWorksheetConfiguration
- **Message**: Excel sheet name and index cannot exist at the same time.
- **Cause**: The Excel sheet name and index are provided at the same time.
- **Recommendation**: Check the parameter value and specify the sheet name or index to read the Excel data.

### Error code: DF-Excel-InvalidRange
- **Message**: Invalid range is provided.
- **Cause**: An invalid range is provided.
- **Recommendation**: Check the parameter value and specify the valid range by the following reference: [Excel format in Azure Data Factory-Dataset properties](./format-excel.md#dataset-properties).

### Error code: DF-Excel-WorksheetNotExist
- **Message**: Excel worksheet does not exist.
- **Cause**: An invalid worksheet name or index is provided.
- **Recommendation**: Check the parameter value and specify a valid sheet name or index to read the Excel data.

### Error code: DF-Excel-DifferentSchemaNotSupport
- **Message**: Read excel files with different schema is not supported now.
- **Cause**: Reading excel files with different schemas is not supported now.
- **Recommendation**: Please apply one of following options to solve this problem:
    1. Use **ForEach** + **data flow** activity to read Excel worksheets one by one. 
    1. Update each worksheet schema to have the same columns manually before reading data.

### Error code: DF-Excel-InvalidDataType
- **Message**: Data type is not supported.
- **Cause**: The data type is not supported.
- **Recommendation**: Please change the data type to **'string'** for related input data columns.

### Error code: DF-Excel-InvalidFile
- **Message**: Invalid excel file is provided while only .xlsx and .xls are supported.
- **Cause**: Invalid Excel files are provided.
- **Recommendation**: Use the wildcard to filter, and get `.xls` and `.xlsx` Excel files before reading data.

### Error code: DF-Executor-OutOfMemorySparkBroadcastError
- **Message**: Explicitly broadcasted dataset using left/right option should be small enough to fit in node's memory. You can choose broadcast option 'Off' in join/exists/lookup transformation to avoid this issue or use an integration runtime with higher memory.
- **Cause**: The size of the broadcasted table far exceeds the limitation of the node memory.
- **Recommendation**: The broadcast left/right option should be used only for smaller dataset size which can fit into node's memory, so make sure to configure the node size appropriately or turn off the broadcast option.

### Error code: DF-MSSQL-InvalidFirewallSetting
- **Message**: The TCP/IP connection to the host has failed. Make sure that an instance of SQL Server is running on the host and accepting TCP/IP connections at the port. Make sure that TCP connections to the port are not blocked by a firewall.
- **Cause**: The SQL database's firewall setting blocks the data flow to access.
- **Recommendation**: Please check the firewall setting for your SQL database, and allow Azure services and resources to access this server.

### Error code: DF-Executor-AcquireStorageMemoryFailed
- **Message**: Transferring unroll memory to storage memory failed. Cluster ran out of memory during execution. Please retry using an integration runtime with more cores and/or memory optimized compute type.
- **Cause**: The cluster has insufficient memory.
- **Recommendation**: Please use an integration runtime with more cores and/or the memory optimized compute type.

### Error code: DF-Cosmos-DeleteDataFailed
- **Message**: Failed to delete data from cosmos after 3 times retry.
- **Cause**: The throughput on the Cosmos collection is small and leads to meeting throttling or row data not existing in Cosmos.
- **Recommendation**: Please take the following actions to solve this problem:
    1. If the error is 404, make sure that the related row data exists in the Cosmos collection. 
    1. If the error is throttling, please increase the Cosmos collection throughput or set it to the automatic scale.
    1. If the error is request timed out, please set 'Batch size' in the Cosmos sink to smaller value, for example 1000.

### Error code: DF-SQLDW-ErrorRowsFound
- **Cause**: Error/invalid rows are found when writing to the Azure Synapse Analytics sink.
- **Recommendation**: Please find the error rows in the rejected data storage location if it is configured.

### Error code: DF-SQLDW-ExportErrorRowFailed
- **Message**: Exception is happened while writing error rows to storage.
- **Cause**: An exception happened while writing error rows to the storage.
- **Recommendation**: Please check your rejected data linked service configuration.

### Error code: DF-Executor-FieldNotExist
- **Message**: Field in struct does not exist.
- **Cause**: Invalid or unavailable field names are used in expressions.
- **Recommendation**: Check field names used in expressions.

### Error code: DF-Xml-InvalidElement
- **Message**: XML Element has sub elements or attributes which can't be converted.
- **Cause**: The XML element has sub elements or attributes which can't be converted.
- **Recommendation**: Update the XML file to make the XML element has right sub elements or attributes.

### Error code: DF-GEN2-InvalidCloudType
- **Message**: Cloud type is invalid.
- **Cause**: An invalid cloud type is provided.
- **Recommendation**: Check the cloud type in your related ADLS Gen2 linked service.

### Error code: DF-Blob-InvalidCloudType
- **Message**: Cloud type is invalid.
- **Cause**: An invalid cloud type is provided.
- **Recommendation**: Please check the cloud type in your related Azure Blob linked service.

### Error code: DF-Cosmos-FailToResetThroughput
- **Message**: Cosmos DB throughput scale operation cannot be performed because another scale operation is in progress, please retry after sometime.
- **Cause**: The throughput scale operation of the Cosmos DB cannot be performed because another scale operation is in progress.
- **Recommendation**: Please log in your Cosmos account, and manually change its container's throughput to be auto scale or add custom activities after data flows to reset the throughput.

### Error code: DF-Executor-InvalidPath
- **Message**: Path does not resolve to any file(s). Please make sure the file/folder exists and is not hidden.
- **Cause**: An invalid file/folder path is provided, which cannot be found or accessed.
- **Recommendation**: Please check the file/folder path, and make sure it is existed and can be accessed in your storage.

### Error code: DF-Executor-InvalidPartitionFileNames
- **Message**: File names cannot have empty value(s) while file name option is set as per partition.
- **Cause**: Invalid partition file names are provided.
- **Recommendation**: Please check your sink settings to have the right value of file names.

### Error code: DF-Executor-InvalidOutputColumns
- **Message**: The result has 0 output columns. Please ensure at least one column is mapped.
- **Cause**: No column is mapped.
- **Recommendation**: Please check the sink schema to ensure that at least one column is mapped.

### Error code: DF-Executor-InvalidInputColumns
- **Message**: The column in source configuration cannot be found in source data's schema.
- **Cause**: Invalid columns are provided on the source.
- **Recommendation**: Check columns in the source configuration and make sure that it is the subset of the source data's schemas.

### Error code: DF-AdobeIntegration-InvalidMapToFilter
- **Message**: Custom resource can only have one Key/Id mapped to filter.
- **Cause**: Invalid configurations are provided.
- **Recommendation**: In your AdobeIntegration settings, make sure that the custom resource can only have one Key/Id mapped to filter.

### Error code: DF-AdobeIntegration-InvalidPartitionConfiguration
- **Message**: Only single partition is supported. Partition schema may be RoundRobin or Hash.
- **Cause**: Invalid partition configurations are provided.
- **Recommendation**: In AdobeIntegration settings, confirm that only the single partition is set and partition schemas may be RoundRobin or Hash.

### Error code: DF-AdobeIntegration-KeyColumnMissed
- **Message**: Key must be specified for non-insertable operations.
- **Cause**: Key columns are missed.
- **Recommendation**: Update AdobeIntegration settings to ensure key columns are specified for non-insertable operations.

### Error code: DF-AdobeIntegration-InvalidPartitionType
- **Message**: Partition type has to be roundRobin.
- **Cause**: Invalid partition types are provided.
- **Recommendation**: Please update AdobeIntegration settings to make your partition type is RoundRobin.

### Error code: DF-AdobeIntegration-InvalidPrivacyRegulation
- **Message**: Only privacy regulation that's currently supported is 'GDPR'.
- **Cause**: Invalid privacy configurations are provided.
- **Recommendation**: Please update AdobeIntegration settings while only privacy 'GDPR' is supported.

### Error code: DF-Executor-RemoteRPCClientDisassociated
- **Message**: Remote RPC client disassociated. Likely due to containers exceeding thresholds, or network issues.
- **Cause**: Data flow activity runs failed because of the transient network issue or because one node in spark cluster runs out of memory.
- **Recommendation**: Use the following options to solve this problem:
  - Option-1: Use a powerful cluster (both drive and executor nodes have enough memory to handle big data) to run data flow pipelines with setting "Compute type" to "Memory optimized". The settings are shown in the picture below.
        
      :::image type="content" source="media/data-flow-troubleshoot-guide/configure-compute-type.png" alt-text="Screenshot that shows the configuration of Compute type.":::   

  - Option-2: Use larger cluster size (for example, 48 cores) to run your data flow pipelines. You can learn more about cluster size through this document: [Cluster size](./concepts-data-flow-performance.md#cluster-size).
  
  - Option-3: Repartition your input data. For the task running on the data flow spark cluster, one partition is one task and runs on one node. If data in one partition is too large, the related task running on the node needs to consume more memory than the node itself, which causes failure. So you can use repartition to avoid data skew, and ensure that data size in each partition is average while the memory consumption is not too heavy.
    
      :::image type="content" source="media/data-flow-troubleshoot-guide/configure-partition.png" alt-text="Screenshot that shows the configuration of partitions.":::

    > [!NOTE]
    >  You need to evaluate the data size or the partition number of input data, then set reasonable partition number under "Optimize". For example, the cluster that you use in the data flow pipeline execution is 8 cores and the memory of each core is 20GB, but the input data is 1000GB with 10 partitions. If you directly run the data flow, it will meet the OOM issue because 1000GB/10 > 20GB, so it is better to set repartition number to 100 (1000GB/100 < 20GB).
    
  - Option-4: Tune and optimize source/sink/transformation settings. For example, try to copy all files in one container, and don't use the wildcard pattern. For more detailed information, reference [Mapping data flows performance and tuning guide](./concepts-data-flow-performance.md).

### Error code: DF-MSSQL-ErrorRowsFound
- **Cause**: Error/Invalid rows were found while writing to Azure SQL Database sink.
- **Recommendation**: Please find the error rows in the rejected data storage location if configured.

### Error code: DF-MSSQL-ExportErrorRowFailed
- **Message**: Exception is happened while writing error rows to storage.
- **Cause**: An exception happened while writing error rows to the storage.
- **Recommendation**: Check your rejected data linked service configuration.

### Error code: DF-Synapse-InvalidDatabaseType
- **Message**: Database type is not supported.
- **Cause**: The database type is not supported.
- **Recommendation**: Check the database type and change it to the proper one.

### Error code: DF-Synapse-InvalidFormat
- **Message**: Format is not supported.
- **Cause**: The format is not supported. 
- **Recommendation**: Check the format and change it to the proper one.

### Error code: DF-Synapse-InvalidTableDBName
- **Cause**: The table/database name is not valid.
- **Recommendation**: Change a valid name for the table/database. Valid names only contain alphabet characters, numbers and `_`.

### Error code: DF-Synapse-InvalidOperation
- **Cause**: The operation is not supported.
- **Recommendation**: Change the invalid operation.

### Error code: DF-Synapse-DBNotExist
- **Cause**: The database does not exist.
- **Recommendation**: Check if the database exists.

### Error code: DF-Synapse-StoredProcedureNotSupported
- **Message**: Use 'Stored procedure' as Source is not supported for serverless (on-demand) pool.
- **Cause**: The serverless pool has limitations.
- **Recommendation**: Retry using 'query' as the source or saving the stored procedure as a view, and then use 'table' as the source to read from view directly.

### Error code: DF-Executor-BroadcastFailure
- **Message**: Dataflow execution failed during broadcast exchange. Potential causes include misconfigured connections at sources or a broadcast join timeout error. To ensure the sources are configured correctly, please test the connection or run a source data preview in a Dataflow debug session. To avoid the broadcast join timeout, you can choose the 'Off' broadcast option in the Join/Exists/Lookup transformations. If you intend to use the broadcast option to improve performance then make sure broadcast streams can produce data within 60 secs for debug runs and within 300 secs for job runs. If problem persists, contact customer support.

- **Cause**:  
    1. The source connection/configuration error could lead to a broadcast failure in join/exists/lookup transformations.
    2. Broadcast has a default timeout of 60 seconds in debug runs and 300 seconds in job runs. On the broadcast join, the stream chosen for the broadcast seems too large to produce data within this limit. If a broadcast join is not used, the default broadcast done by a data flow can reach the same limit.

- **Recommendation**:
    1. Do data preview at sources to confirm the sources are well configured. 
    1. Turn off the broadcast option or avoid broadcasting large data streams where the processing can take more than 60 seconds. Instead, choose a smaller stream to broadcast. 
    1. Large SQL/Data Warehouse tables and source files are typically bad candidates. 
    1. In the absence of a broadcast join, use a larger cluster if the error occurs. 
    1. If the problem persists, contact the customer support.

### Error code: DF-Cosmos-ShortTypeNotSupport
- **Message**: Short data type is not supported in Cosmos DB.
- **Cause**: The short data type is not supported in the Azure Cosmos DB.
- **Recommendation**: Add a derived transformation to convert related columns from short to integer before using them in the Cosmos sink.

### Error code: DF-Blob-FunctionNotSupport
- **Message**: This endpoint does not support BlobStorageEvents, SoftDelete or AutomaticSnapshot. Please disable these account features if you would like to use this endpoint.
- **Cause**: Azure Blob Storage events, soft delete or automatic snapshot is not supported in data flows if the Azure Blob Storage linked service is created with service principal or managed identity authentication.
- **Recommendation**: Disable Azure Blob Storage events, soft delete or automatic snapshot feature on the Azure Blob account, or use key authentication to create the linked service.

### Error code: DF-Cosmos-InvalidAccountKey
- **Message**: The input authorization token can't serve the request. Please check that the expected payload is built as per the protocol, and check the key being used.
- **Cause**: There is no enough permission to read/write Azure Cosmos DB data.
- **Recommendation**: Please use the read-write key to access Azure Cosmos DB.

## Miscellaneous troubleshooting tips
- **Issue**: Unexpected exception occurred and execution failed.
	- **Message**: During Data Flow activity execution: Hit unexpected exception and execution failed.
	- **Cause**: This error is a back-end service error. Retry the operation and restart your debugging session.
	- **Recommendation**: If retrying and restarting doesn't resolve the problem, contact customer support.

-  **Issue**: No output data on join during debug data preview.
	- **Message**: There are a high number of null values or missing values which may be caused by having too few rows sampled. Try updating the debug row limit and refreshing the data.
	- **Cause**: The join condition either didn't match any rows or resulted in a large number of null values during the data preview.
	- **Recommendation**: In **Debug Settings**, increase the number of rows in the source row limit. Be sure to select an Azure IR that has a data flow cluster that's large enough to handle more data.
	
- **Issue**: Validation error at source with multiline CSV files. 
	- **Message**: You might see one of these error messages:
		- The last column is null or missing.
		- Schema validation at source fails.
		- Schema import fails to show correctly in the UX and the last column has a new line character in the name.
	- **Cause**: In the Mapping data flow, multiline CSV source files don't currently work when \r\n is used as the row delimiter. Sometimes extra lines at carriage returns can cause errors. 
	- **Recommendation**: Generate the file at the source by using \n as the row delimiter rather than \r\n. Or use the Copy activity to convert the CSV file to use \n as a row delimiter.

## General troubleshooting guidance
1. Check the status of your dataset connections. In each source and sink transformation, go to the linked service for each dataset that you're using and test the connections.
2. Check the status of your file and table connections in the data flow designer. In debug mode, select **Data Preview** on your source transformations to ensure that you can access your data.
3. If everything looks correct in data preview, go into the Pipeline designer and put your data flow in a Pipeline activity. Debug the pipeline for an end-to-end test.

### Improvement on CSV/CDM format in Data Flow 

If you use the **Delimited Text or CDM formatting for mapping data flow in Azure Data Factory V2**, you may face the behavior changes to your existing pipelines because of the improvement for Delimited Text/CDM in data flow starting from **1 May 2021**. 

You may encounter the following issues before the improvement, but after the improvement, the issues were fixed. Read the following content to determine whether this improvement affects you. 

#### Scenario 1: Encounter the unexpected row delimiter issue

 You are affected if you are in the following conditions:
 - Using the Delimited Text with the Multiline setting set to True or CDM as the source.
 - The first row has more than 128 characters. 
 - The row delimiter in data files is not `\n`.

 Before the improvement, the default row delimiter `\n` may be unexpectedly used to parse delimited text files, because when Multiline setting is set to True, it invalidates the row delimiter setting, and the row delimiter is automatically detected based on the first 128 characters. If you fail to detect the actual row delimiter, it would fall back to `\n`.  

 After the improvement, any one of the three-row delimiters: `\r`, `\n`, `\r\n` should  have worked.
 
 The following example shows you one pipeline behavior change after the improvement:

 **Example**:<br/>
   For the following column:<br/>
    `C1, C2, {long first row}, C128\r\n `<br/>
    `V1, V2, {values………………….}, V128\r\n `<br/>
 
   Before the improvement, `\r` is kept in the column value. The parsed column result is:<br/>
   `C1 C2 {long first row} C128`**`\r`**<br/>
   `V1 V2 {values………………….} V128`**`\r`**<br/> 

   After the improvement, the parsed column result should be:<br/>
   `C1 C2 {long first row} C128`<br/>
   `V1 V2 {values………………….} V128`<br/>
  
#### Scenario 2: Encounter an issue of incorrectly reading column values containing '\r\n'

 You are affected if you are in the following conditions:
 - Using the Delimited Text with the Multiline setting set to True or CDM as a source. 
 - The row delimiter is `\r\n`.

 Before the improvement, when reading the column value, the `\r\n` in it may be incorrectly replaced by `\n`. 

 After the improvement, `\r\n` in the column value will not be replaced by `\n`.

 The following example shows you one pipeline behavior change after the improvement:
 
 **Example**:<br/>
  
 For the following column：<br/>
  **`"A\r\n"`**`, B, C\r\n`<br/>

 Before the improvement, the parsed column result is:<br/>
  **`A\n`**` B C`<br/>

 After the improvement, the parsed column result should be:<br/>
  **`A\r\n`**` B C`<br/>  

#### Scenario 3: Encounter an issue of incorrectly writing column values containing '\n'

 You are affected if you are in the following conditions:
 - Using the Delimited Text as a sink.
 - The column value contains `\n`.
 - The row delimiter is set to `\r\n`.
 
 Before the improvement, when writing the column value, the `\n` in it may be incorrectly replaced by `\r\n`. 

 After the improvement, `\n` in the column value will not be replaced by `\r\n`.
 
 The following example shows you one pipeline behavior change after the improvement:

 **Example**:<br/>

 For the following column:<br/>
 **`A\n`**` B C`<br/>

 Before the improvement, the CSV sink is:<br/>
  **`"A\r\n"`**`, B, C\r\n` <br/>

 After the improvement, the CSV sink should be:<br/>
  **`"A\n"`**`, B, C\r\n`<br/>

#### Scenario 4: Encounter an issue of incorrectly reading empty string as NULL
 
 You are affected if you are in the following conditions:
 - Using the Delimited Text as a source. 
 - NULL value is set to non-empty value. 
 - The column value is empty string and is unquoted. 
 
 Before the improvement, the column value of unquoted empty string is read as NULL. 

 After the improvement, empty string will not be parsed as NULL value. 
 
 The following example shows you one pipeline behavior change after the improvement:

 **Example**:<br/>

 For the following column:<br/>
  `A, ,B, `<br/>

 Before the improvement, the parsed column result is:<br/>
  `A null B null`<br/>

 After the improvement, the parsed column result should be:<br/>
  `A "" (empty string) B "" (empty string)`<br/>


## Next steps

For more help with troubleshooting, see these resources:

*  [Data Factory blog](https://azure.microsoft.com/blog/tag/azure-data-factory/)
*  [Data Factory feature requests](https://feedback.azure.com/forums/270578-data-factory)
*  [Azure videos](https://azure.microsoft.com/resources/videos/index/?sort=newest&services=data-factory)
*  [Stack Overflow forum for Data Factory](https://stackoverflow.com/questions/tagged/azure-data-factory)
*  [Twitter information about Data Factory](https://twitter.com/hashtag/DataFactory)

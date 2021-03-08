---
title: Troubleshoot mapping data flows
description: Learn how to troubleshoot data flow problems in Azure Data Factory.
ms.author: makromer
author: kromerm
ms.reviewer: daperlov
ms.service: data-factory
ms.topic: troubleshooting
ms.date: 09/11/2020
---
# Troubleshoot mapping data flows in Azure Data Factory

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

This article explores common troubleshooting methods for mapping data flows in Azure Data Factory.

## Common error codes and messages 

### Error code: DF-Executor-SourceInvalidPayload
- **Message**: Data preview, debug, and pipeline data flow execution failed because container does not exist
- **Cause**: A dataset contains a container that doesn't exist in storage.
- **Recommendation**: Make sure that the container referenced in your dataset exists and can be accessed.

### Error code: DF-Executor-SystemImplicitCartesian

- **Message**: Implicit cartesian product for INNER join is not supported, use CROSS JOIN instead. Columns used in join should create a unique key for rows.
- **Cause**: Implicit cartesian products for INNER joins between logical plans aren't supported. If you're using columns in the join, create a unique key with at least one column from both sides of the relationship.
- **Recommendation**: For non-equality based joins, use CUSTOM CROSS join.

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
- **Message**: The specified source path has either multiple partitioned directories (for e.g. <Source Path>/<Partition Root Directory 1>/a=10/b=20, <Source Path>/<Partition Root Directory 2>/c=10/d=30) or partitioned directory with other file or non-partitioned directory (for example <Source Path>/<Partition Root Directory 1>/a=10/b=20, <Source Path>/Directory 2/file1), remove partition root directory from source path and read it through separate source transformation.
- **Cause**: The source path has either multiple partitioned directories or a partitioned directory that has another file or non-partitioned directory.
- **Recommendation**: Remove the partitioned root directory from the source path and read it through separate source transformation.

### Error code: DF-Executor-InvalidType
- **Message**: Please make sure that the type of parameter matches with type of value passed in. Passing float parameters from pipelines isn't currently supported.
- **Cause**: The data type for the declared type isn't compatible with the actual parameter value.
- **Recommendation**: Check that the parameter values passed into the data flow match the declared type.

### Error code: DF-Executor-ColumnUnavailable
- **Message**: Column name used in expression is unavailable or invalid
- **Cause**: An invalid or unavailable column name used in an expression.
- **Recommendation**: Check column names in expressions.

### Error code: DF-Executor-ParseError
- **Message**: Expression cannot be parsed
- **Cause**: An expression generated parsing errors because of incorrect formatting.
- **Recommendation**: Check the formatting in the expression.

### Error code: DF-Executor-SystemImplicitCartesian
- **Message**: Implicit cartesian product for INNER join is not supported, use CROSS JOIN instead. Columns used in join should create a unique key for rows.
- **Cause**: Implicit cartesian products for INNER joins between logical plans aren't supported. If you're using columns in the join, create a unique key.
- **Recommendation**: For non-equality based joins, use CROSS JOIN.

### Error code: DF-Executor-SystemInvalidJson
- **Message**: JSON parsing error, unsupported encoding or multiline
- **Cause**: Possible problems with the JSON file: unsupported encoding, corrupt bytes, or using JSON source as a single document on many nested lines.
- **Recommendation**: Verify that the JSON file's encoding is supported. On the source transformation that's using a JSON dataset, expand **JSON Settings** and turn on **Single Document**.



### Error code: DF-Executor-Conversion
- **Message**: Converting to a date or time failed due to an invalid character
- **Cause**: Data isn't in the expected format.
- **Recommendation**: Use the correct data type.


### Error code: DF-Executor-BlockCountExceedsLimitError
- **Message**: The uncommitted block count cannot exceed the maximum limit of 100,000 blocks. Check blob configuration.
- **Cause**: The maximum number of uncommitted blocks in a blob is 100,000.
- **Recommendation**: Contact the Microsoft product team for more details about this problem.

### Error code: DF-Executor-PartitionDirectoryError
- **Message**: The specified source path has either multiple partitioned directories (for e.g. *<Source Path>/<Partition Root Directory 1>/a=10/b=20, <Source Path>/<Partition Root Directory 2>/c=10/d=30*) or partitioned directory with other file or non-partitioned directory (for e.g. *<Source Path>/<Partition Root Directory 1>/a=10/b=20, <Source Path>/Directory 2/file1*), remove partition root directory from source path and read it through separate source transformation.
- **Cause**: The source path has either multiple partitioned directories or a partitioned directory that has another file or non-partitioned directory. 
- **Recommendation**: Remove the partitioned root directory from the source path and read it through separate source transformation.

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
- **Recommendation**: Ensure the account name or access key specified in your linked service is correct. 

### Error code: DF-Executor-InvalidType
- **Message**: Please make sure that the type of parameter matches with type of value passed in. Passing float parameters from pipelines isn't currently supported.
- **Cause**: The data type for the declared type isn't compatible with the actual parameter value. 
- **Recommendation**: Supply the correct data types.

### Error code: DF-Executor-ColumnUnavailable
- **Message**: Column name used in expression is unavailable or invalid.
- **Cause**: An invalid or unavailable column name is used in an expression.
- **Recommendation**: Check the column names used in expressions.


### Error code: DF-Executor-ParseError
- **Message**: Expression cannot be parsed.
- **Cause**: An expression generated parsing errors because of incorrect formatting. 
- **Recommendation**: Check the formatting in the expression.


 ### Error code: DF-Executor-OutOfDiskSpaceError
- **Message**: Internal server error
- **Cause**: The cluster is running out of disk space.
- **Recommendation**: Retry the pipeline. If doing so doesn't resolve the problem, contact customer support.


 ### Error code: DF-Executor-StoreIsNotDefined
- **Message**: The store configuration is not defined. This error is potentially caused by invalid parameter assignment in the pipeline.
- **Cause**: Undetermined.
- **Recommendation**: Check parameter value assignment in the pipeline. A parameter expression might contain invalid characters.

### Error code: DF-Excel-InvalidConfiguration
- **Message**: Excel sheet name or index is required.
- **Cause**: Undetermined.
- **Recommendation**: Check the parameter value. Specify the worksheet name or index for reading Excel data.

- **Message**: Excel sheet name and index cannot exist at the same time.
- **Cause**: Undetermined.
- **Recommendation**: Check the parameter value. Specify the worksheet name or index for reading Excel data.

- **Message**: Invalid range is provided.
- **Cause**: Undetermined.
- **Recommendation**: Check the parameter value. Specify a valid range by reference. For more information, see [Excel properties](./format-excel.md#dataset-properties).

- **Message**: Invalid excel file is provided while only .xlsx and .xls are supported
- **Cause**: Undetermined.
- **Recommendation**: Make sure the Excel file extension is either .xlsx or .xls.


 ### Error code: DF-Excel-InvalidData
- **Message**: Excel worksheet does not exist.
- **Cause**: Undetermined.
- **Recommendation**: Check the parameter value. Specify a valid worksheet name or index for reading Excel data.

- **Message**: Reading excel files with different schema is not supported now.
- **Cause**: Undetermined.
- **Recommendation**: Use a supported Excel file.

- **Message**: Data type is not supported.
- **Cause**: Undetermined.
- **Recommendation**: Use supported Excel file data types.

### Error code: 4502
- **Message**: There are substantial concurrent MappingDataflow executions that are causing failures due to throttling under Integration Runtime.
- **Cause**: A large number of Data Flow activity runs are occurring concurrently on the integration runtime. For more information, see [Azure Data Factory limits](../azure-resource-manager/management/azure-subscription-service-limits.md#data-factory-limits).
- **Recommendation**: If you want to run more Data Flow activities in parallel, distribute them across multiple integration runtimes.


### Error code: InvalidTemplate
- **Message**: The pipeline expression cannot be evaluated.
- **Cause**: The pipeline expression passed in the Data Flow activity isn't being processed correctly because of a syntax error.
- **Recommendation**: Check your activity in activity monitoring to verify the expression.

### Error code: 2011
- **Message**: The activity was running on Azure Integration Runtime and failed to decrypt the credential of data store or compute connected via a Self-hosted Integration Runtime. Please check the configuration of linked services associated with this activity, and make sure to use the proper integration runtime type.
- **Cause**: Data flow doesn't support linked services on self-hosted integration runtimes.
- **Recommendation**: Configure data flow to run on a Managed Virtual Network integration runtime.

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

## Next steps

For more help with troubleshooting, see these resources:

*  [Data Factory blog](https://azure.microsoft.com/blog/tag/azure-data-factory/)
*  [Data Factory feature requests](https://feedback.azure.com/forums/270578-data-factory)
*  [Azure videos](https://azure.microsoft.com/resources/videos/index/?sort=newest&services=data-factory)
*  [Stack Overflow forum for Data Factory](https://stackoverflow.com/questions/tagged/azure-data-factory)
*  [Twitter information about Data Factory](https://twitter.com/hashtag/DataFactory)

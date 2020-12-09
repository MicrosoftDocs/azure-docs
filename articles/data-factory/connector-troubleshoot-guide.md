---
title: Troubleshoot Azure Data Factory Connectors
description: Learn how to troubleshoot connector issues in Azure Data Factory. 
services: data-factory
author: linda33wj
ms.service: data-factory
ms.topic: troubleshooting
ms.date: 12/09/2020
ms.author: jingwang
ms.reviewer: craigg
ms.custom: has-adal-ref
---

# Troubleshoot Azure Data Factory Connectors

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article explores common troubleshooting methods for connectors in Azure Data Factory.
  
## Azure Blob Storage

### Error code:  AzureBlobOperationFailed

- **Message**: `Blob operation Failed. ContainerName: %containerName;, path: %path;.`

- **Cause**: Blob storage operation hit problem.

- **Recommendation**:  Check the error in details. Refer to blob help document: https://docs.microsoft.com/rest/api/storageservices/blob-service-error-codes. Contact storage team if need help.


### Error code:  AzureBlobServiceNotReturnExpectedDataLength

- **Message**: `Error occurred when trying to fetch the blob '%name;'. This could be a transient issue and you may rerun the job. If it fails again continuously, contact customer support.`


### Error code:  AzureBlobNotSupportMultipleFilesIntoSingleBlob

- **Message**: `Transferring multiple files into a single Blob is not supported. Currently only single file source is supported.`


### Error code:  AzureStorageOperationFailedConcurrentWrite

- **Message**: `Error occurred when trying to upload a file. It's possible because you have multiple concurrent copy activities runs writing to the same file '%name;'. Check your ADF configuration.`


### Invalid property during copy activity

- **Message**:  `Copy activity <Activity Name> has an invalid "source" property. The source type is not compatible with the dataset <Dataset Name> and its linked service <Linked Service Name>. Please verify your input against.`

- **Cause**: The type defined in dataset is inconsistent with the source/sink type defined in copy activity.

- **Resolution**: Edit the dataset or pipeline JSON definition to make the types consistent and rerun the deployment.


## Azure Cosmos DB

### Error message: Request size is too large

- **Symptoms**: You copy data into Azure Cosmos DB with default write batch size, and hit error *"**Request size is too large**"*.

- **Cause**: Cosmos DB limits one single request's size to  2 MB. The formula is, Request Size = Single Document Size * Write Batch Size. If your document size is large, the default behavior will result in too large request size. You can tune the write batch size.

- **Resolution**: In copy activity sink, reduce the 'Write batch size' value (default value is 10000).

### Error message: Unique index constraint violation

- **Symptoms**: When copying data into Cosmos DB, you hit the following error:

    ```
    Message=Partition range id 0 | Failed to import mini-batch. 
    Exception was Message: {"Errors":["Encountered exception while executing function. Exception = Error: {\"Errors\":[\"Unique index constraint violation.\"]}... 
    ```

- **Cause**: There are two possible causes:

    - If you use **Insert** as write behavior, this error means you source data have rows/objects with same ID.

    - If you use **Upsert** as write behavior and you set another unique key to the container, this error means you source data have rows/objects with different IDs but same value for the defined unique key.

- **Resolution**: 

    - For cause1, set **Upsert** as write behavior.
    - For cause 2, make sure each document has different value for defined unique key.

### Error message: Request rate is large

- **Symptoms**: When copying data into Cosmos DB, you hit the following error:

    ```
    Type=Microsoft.Azure.Documents.DocumentClientException,
    Message=Message: {"Errors":["Request rate is large"]}
    ```

- **Cause**: The request units used is bigger than the available RU configured in Cosmos DB. Learn how
Cosmos DB calculates RU from [here](../cosmos-db/request-units.md#request-unit-considerations).

- **Resolution**: Here are two solutions:

    1. **Increase the container RU** to bigger value in Cosmos DB, which will improve the copy activity performance, though incur more cost in Cosmos DB. 

    2. Decrease **writeBatchSize** to smaller value (such as 1000) and set **parallelCopies** to smaller value such as 1, which will make copy run performance worse than current but will not incur more cost in Cosmos DB.

### Column missing in column mapping

- **Symptoms**: When you import schema for Cosmos DB for column mapping, some columns are missing. 

- **Cause**: ADF infers the schema from the first 10 Cosmos DB documents. If some columns/properties don't have value in those documents, they won't be detected by ADF thus won't show up.

- **Resolution**: You can tune the query as below to enforce column to show up in result set with empty value: (assume: "impossible" column is missing in first 10 documents). Alternatively, you can manually add the column for mapping.

    ```sql
    select c.company, c.category, c.comments, (c.impossible??'') as impossible from c
    ```

### Error message: The GuidRepresentation for the reader is CSharpLegacy

- **Symptoms**: When copying data from Cosmos DB MongoAPI/MongoDB with UUID field, you hit the following error:

    ```
    Failed to read data via MongoDB client.,
    Source=Microsoft.DataTransfer.Runtime.MongoDbV2Connector,Type=System.FormatException,
    Message=The GuidRepresentation for the reader is CSharpLegacy which requires the binary sub type to be UuidLegacy not UuidStandard.,Source=MongoDB.Bson,’“,
    ```

- **Cause**: There are two ways to represent UUID in BSON - UuidStardard and UuidLegacy. By default, UuidLegacy is used to read data. You will hit error if your UUID data in MongoDB is UuidStandard.

- **Resolution**: In MongoDB connection string, add option "**uuidRepresentation=standard**". For more information, see [MongoDB connection string](connector-mongodb.md#linked-service-properties).
			

## Azure Data Lake Storage Gen2

### Error code:  AdlsGen2OperationFailed

- **Message**: `ADLS Gen2 operation failed for: %adlsGen2Message;.%exceptionData;.`

- **Cause**: ADLS Gen2 throws the error indicating operation failed.

- **Recommendation**:  Check the detailed error message thrown by ADLS Gen2. If it's caused by transient failure, please retry. If you need further help, please contact Azure Storage support and provide the request ID in error message.

- **Cause**: When the error message contains 'Forbidden', the service principal or managed identity you use may not have enough permission to access the ADLS Gen2.

- **Recommendation**:  Refer to the help document: https://docs.microsoft.com/azure/data-factory/connector-azure-data-lake-storage#service-principal-authentication.

- **Cause**: When the error message contains 'InternalServerError', the error is returned by ADLS Gen2.

- **Recommendation**:  It may be caused by transient failure, please retry. If the issue persists, please contact Azure Storage support and provide the request ID in error message.


### Error code:  AdlsGen2InvalidUrl

- **Message**: `Invalid url '%url;' provided, expecting http[s]://<accountname>.dfs.core.windows.net.`


### Error code:  AdlsGen2InvalidFolderPath

- **Message**: `The folder path is not specified. Cannot locate the file '%name;' under the ADLS Gen2 account directly. Please specify the folder path instead.`


### Error code:  AdlsGen2OperationFailedConcurrentWrite

- **Message**: `Error occurred when trying to upload a file. It's possible because you have multiple concurrent copy activities runs writing to the same file '%name;'. Check your ADF configuration.`


### Error code: AdlsGen2TimeoutError

- **Message**: `Request to ADLS Gen2 account '%account;' met timeout error. It is mostly caused by the poor network between the Self-hosted IR machine and the ADLS Gen2 account. Check the network to resolve such error.`


### Error code: UserErrorFailedBlobFSOperation

- **Message**: `Failure happened on 'Sink' side.`

- **Cause**: The issue is caused by the ADLS Gen2 sink timeout error, which mostly happens on the self-hosted IR machine.

- **Recommendation**: 

    1. Please place your self-hosted IR machine and target ADLS Gen2 account in the same region if possible. This can avoid random timeout error and have better performance.

    1. Check whether there is any special network setting like ExpressRoute and ensure the network has enough bandwidth. It is suggested to decrease the self-hosted IR concurrent jobs setting when the overall bandwidth is low, through which can avoid network resource competition across multiple concurrent jobs.

    1. Use smaller block size for non-binary copy to mitigate such timeout error if the file size is moderate or small. Please refer to [Blob Storage Put Block](https://docs.microsoft.com/rest/api/storageservices/put-block).

       To specify the custom block size, you can edit the property in .json editor:
    ```
    "sink": {
        "type": "DelimitedTextSink",
        "storeSettings": {
            "type": "AzureBlobFSWriteSettings",
            "blockSizeInMB": 8
        }
    }
    ```


## Azure Data Lake Storage Gen1

### Error message: The underlying connection was closed: Could not establish trust relationship for the SSL/TLS secure channel.

- **Symptoms**: Copy activity fails with the following error: 

    ```
    Message: Failure happened on 'Sink' side. ErrorCode=UserErrorFailedFileOperation,'Type=Microsoft.DataTransfer.Common.Shared.HybridDeliveryException,Message=Upload file failed at path STAGING/PLANT/INDIARENEWABLE/LiveData/2020/01/14\\20200114-0701-oem_gibtvl_mannur_data_10min.csv.,Source=Microsoft.DataTransfer.ClientLibrary,''Type=System.Net.WebException,Message=The underlying connection was closed: Could not establish trust relationship for the SSL/TLS secure channel.,Source=System,''Type=System.Security.Authentication.AuthenticationException,Message=The remote certificate is invalid according to the validation procedure.,Source=System,'.
    ```

- **Cause**: The certificate validation failed during TLS handshake.

- **Resolution**: Workaround: Use staged copy to skip the TLS validation for ADLS Gen1. You need to reproduce this issue and gather netmon trace, and then engage your network team to check the local network configuration.

    ![Troubleshoot ADLS Gen1](./media/connector-troubleshoot-guide/adls-troubleshoot.png)


### Error message: The remote server returned an error: (403) Forbidden

- **Symptoms**: Copy activity fail with the following error: 

    ```
    Message: The remote server returned an error: (403) Forbidden.. 
    Response details: {"RemoteException":{"exception":"AccessControlException""message":"CREATE failed with error 0x83090aa2 (Forbidden. ACL verification failed. Either the resource does not exist or the user is not authorized to perform the requested operation.)....
    ```

- **Cause**: One possible cause is that the service principal or managed identity you use doesn't have permission to access the certain folder/file.

- **Resolution**: Grant corresponding permissions on all the folders and subfolders you need to copy. Refer to [this doc](connector-azure-data-lake-store.md#linked-service-properties).

### Error message: Failed to get access token by using service principal. ADAL Error: service_unavailable

- **Symptoms**: Copy activity fail with the following error:

    ```
    Failed to get access token by using service principal. 
    ADAL Error: service_unavailable, The remote server returned an error: (503) Server Unavailable.
    ```

- **Cause**: When the Service Token Server (STS) owned by Azure Active Directory is not unavailable, i.e., too
busy to handle requests, it returns an HTTP error 503. 

- **Resolution**: Rerun the copy activity after several minutes.
			      

## Azure Synapse Analytics/Azure SQL Database/SQL Server

### Error code:  SqlFailedToConnect

- **Message**: `Cannot connect to SQL Database: '%server;', Database: '%database;', User: '%user;'. Check the linked service configuration is correct, and make sure the SQL Database firewall allows the integration runtime to access.`

- **Cause**: If the error message contains "SqlException", SQL Database throws the error indicating some specific operation failed.

- **Recommendation**:  Search by SQL error code in this reference doc for more details: https://docs.microsoft.com/sql/relational-databases/errors-events/database-engine-events-and-errors. If you need further help, contact Azure SQL support.

- **Cause**: If the error message contains "Client with IP address '...' is not allowed to access the server", and you are trying to connect to Azure SQL Database, usually it is caused by Azure SQL Database firewall issue.

- **Recommendation**:  In logical SQL server firewall configuration, enable "Allow Azure services and resources to access this server" option. Reference doc: https://docs.microsoft.com/azure/sql-database/sql-database-firewall-configure.


### Error code:  SqlOperationFailed

- **Message**: `A database operation failed. Please search error to get more details.`

- **Cause**: If the error message contains "SqlException", SQL Database throws the error indicating some specific operation failed.

- **Recommendation**:  If SQL error is not clear, please try to alter the database to latest compatibility level '150'. It can throw latest version SQL errors. Refer the [detail doc](/sql/t-sql/statements/alter-database-transact-sql-compatibility-level#backwardCompat).

	For troubleshooting SQL issues, please search by SQL error code in this reference doc for more details: https://docs.microsoft.com/sql/relational-databases/errors-events/database-engine-events-and-errors. If you need further help, contact Azure SQL support.

- **Cause**: If the error message contains "PdwManagedToNativeInteropException", usually it's caused by mismatch between source and sink column sizes.

- **Recommendation**:  Check the size of both source and sink columns. If you need further help, contact Azure SQL support.

- **Cause**: If the error message contains "InvalidOperationException", usually it's caused by invalid input data.

- **Recommendation**:  To identify which row encounters the problem, please enable fault tolerance feature on copy activity, which can redirect problematic row(s) to the storage for further investigation. Reference doc: https://docs.microsoft.com/azure/data-factory/copy-activity-fault-tolerance.



### Error code:  SqlUnauthorizedAccess

- **Message**: `Cannot connect to '%connectorName;'. Detail Message: '%message;'`

- **Cause**: Credential is incorrect or the login account cannot access SQL Database.

- **Recommendation**:  Check the login account has enough permission to access the SQL Database.


### Error code:  SqlOpenConnectionTimeout

- **Message**: `Open connection to database timeout after '%timeoutValue;' seconds.`

- **Cause**: Could be SQL Database transient failure.

- **Recommendation**:  Retry to update linked service connection string with larger connection timeout value.


### Error code:  SqlAutoCreateTableTypeMapFailed

- **Message**: `Type '%dataType;' in source side cannot be mapped to a type that supported by sink side(column name:'%columnName;') in autocreate table.`

- **Cause**: Auto creation table cannot meet source requirement.

- **Recommendation**:  Update the column type in 'mappings', or manually create the sink table in target server.


### Error code:  SqlDataTypeNotSupported

- **Message**: `A database operation failed. Check the SQL errors.`

- **Cause**: If the issue happens on SQL source and the error is related to SqlDateTime overflow, the data value is over the logic type range (1/1/1753 12:00:00 AM - 12/31/9999 11:59:59 PM).

- **Recommendation**:  Cast the type to string in source SQL query, or in copy activity column mapping change the column type to 'String'.

- **Cause**: If the issue happens on SQL sink and the error is related to SqlDateTime overflow, the data value is over the allowed range in sink table.

- **Recommendation**:  Update the corresponding column type to 'datetime2' type in sink table.


### Error code:  SqlInvalidDbStoredProcedure

- **Message**: `The specified Stored Procedure is not valid. It could be caused by that the stored procedure doesn't return any data. Invalid Stored Procedure script: '%scriptName;'.`

- **Cause**: The specified Stored Procedure is not valid. It could be caused by that the stored procedure doesn't return any data.

- **Recommendation**:  Validate the stored procedure by SQL Tools. Make sure the stored procedure can return data.


### Error code:  SqlInvalidDbQueryString

- **Message**: `The specified SQL Query is not valid. It could be caused by that the query doesn't return any data. Invalid query: '%query;'`

- **Cause**: The specified SQL Query is not valid. It could be caused by that the query doesn't return any data

- **Recommendation**:  Validate the SQL Query by SQL Tools. Make sure the query can return data.


### Error code:  SqlInvalidColumnName

- **Message**: `Column '%column;' does not exist in the table '%tableName;', ServerName: '%serverName;', DatabaseName: '%dbName;'.`

- **Cause**: Cannot find column. Possible configuration wrong.

- **Recommendation**:  Verify the column in the query, 'structure' in dataset, and 'mappings' in activity.


### Error code:  SqlColumnNameMismatchByCaseSensitive

- **Message**: `Column '%column;' in DataSet '%dataSetName;' cannot be found in physical SQL Database. Column matching is case-sensitive. Column '%columnInTable;' appears similar. Check the DataSet(s) configuration to proceed further.`


### Error code:  SqlBatchWriteTimeout

- **Message**: `Timeouts in SQL write operation.`

- **Cause**: Could be SQL Database transient failure.

- **Recommendation**:  Retry. If problem repro, contact Azure SQL support.


### Error code:  SqlBatchWriteTransactionFailed

- **Message**: `SQL transaction commits failed`

- **Cause**: If exception details constantly tell transaction timeout, the network latency between integration runtime and database is higher than default threshold as 30 seconds.

- **Recommendation**:  Update Sql linked service connection string with 'connection timeout' value equals to 120 or higher and rerun the activity.

- **Cause**: If exception details intermittently tell sqlconnection broken, it could just be transient network failure or SQL Database side issue

- **Recommendation**:  Retry the activity and review SQL Database side metrics.


### Error code:  SqlBulkCopyInvalidColumnLength

- **Message**: `SQL Bulk Copy failed due to receive an invalid column length from the bcp client.`

- **Cause**: SQL Bulk Copy failed due to receive an invalid column length from the bcp client.

- **Recommendation**:  To identify which row encounters the problem, please enable fault tolerance feature on copy activity, which can redirect problematic row(s) to the storage for further investigation. Reference doc: https://docs.microsoft.com/azure/data-factory/copy-activity-fault-tolerance.


### Error code:  SqlConnectionIsClosed

- **Message**: `The connection is closed by SQL Database.`

- **Cause**: SQL connection is closed by SQL Database when high concurrent run and server terminate connection.

- **Recommendation**:  Remote server closed the SQL connection. Retry. If problem repro, contact Azure SQL support.


### Error code:  SqlCreateTableFailedUnsupportedType

- **Message**: `Type '%type;' in source side cannot be mapped to a type that supported by sink side(column name:'%name;') in autocreate table.`


### Error message: Conversion failed when converting from a character string to uniqueidentifier

- **Symptoms**: When you copy data from tabular data source (such as SQL Server) into Azure Synapse Analytics using staged copy and PolyBase, you hit the following error:

    ```
    ErrorCode=FailedDbOperation,Type=Microsoft.DataTransfer.Common.Shared.HybridDeliveryException,
    Message=Error happened when loading data into Azure Synapse Analytics.,
    Source=Microsoft.DataTransfer.ClientLibrary,Type=System.Data.SqlClient.SqlException,
    Message=Conversion failed when converting from a character string to uniqueidentifier...
    ```

- **Cause**: Azure Synapse Analytics PolyBase cannot convert empty string to GUID.

- **Resolution**: In Copy activity sink, under Polybase settings, set "**use type default**" option to false.


### Error message: Expected data type: DECIMAL(x,x), Offending value

- **Symptoms**: When you copy data from tabular data source (such as SQL Server) into Azure Synapse Analytics using staged copy and PolyBase, you hit the following error:

    ```
    ErrorCode=FailedDbOperation,Type=Microsoft.DataTransfer.Common.Shared.HybridDeliveryException,
    Message=Error happened when loading data into Azure Synapse Analytics.,
    Source=Microsoft.DataTransfer.ClientLibrary,Type=System.Data.SqlClient.SqlException,
    Message=Query aborted-- the maximum reject threshold (0 rows) was reached while reading from an external source: 1 rows rejected out of total 415 rows processed. (/file_name.txt) 
    Column ordinal: 18, Expected data type: DECIMAL(x,x), Offending value:..
    ```

- **Cause**: Azure Synapse Analytics Polybase cannot insert empty string (null value) into decimal column.

- **Resolution**: In Copy activity sink, under Polybase settings, set "**use type default**" option to false.


### Error message: Java exception message: HdfsBridge::CreateRecordReader

- **Symptoms**: You copy data into Azure Synapse Analytics using PolyBase, and hit the following error:

    ```
    Message=110802;An internal DMS error occurred that caused this operation to fail. 
    Details: Exception: Microsoft.SqlServer.DataWarehouse.DataMovement.Common.ExternalAccess.HdfsAccessException, 
    Message: Java exception raised on call to HdfsBridge_CreateRecordReader. 
    Java exception message:HdfsBridge::CreateRecordReader - Unexpected error encountered creating the record reader.: Error [HdfsBridge::CreateRecordReader - Unexpected error encountered creating the record reader.] occurred while accessing external file.....
    ```

- **Cause**: The possible cause is that the schema (total column width) being too large (larger than 1 MB). Check the schema of the target Azure Synapse Analytics table by adding the size of all columns:

    - Int -> 4 bytes
    - Bigint -> 8 bytes
    - Varchar(n),char(n),binary(n), varbinary(n) -> n bytes
    - Nvarchar(n), nchar(n) -> n*2 bytes
    - Date -> 6 bytes
    - Datetime/(2), smalldatetime -> 16 bytes
    - Datetimeoffset -> 20 bytes
    - Decimal -> 19 bytes
    - Float -> 8 bytes
    - Money -> 8 bytes
    - Smallmoney -> 4 bytes
    - Real -> 4 bytes
    - Smallint -> 2 bytes
    - Time -> 12 bytes
    - Tinyint -> 1 byte

- **Resolution**: Reduce column width to be less than 1 MB

- Or use bulk insert approach by disabling Polybase


### Error message: The condition specified using HTTP conditional header(s) is not met

- **Symptoms**: You use SQL query to pull data from Azure Synapse Analytics and hit the following error:

    ```
    ...StorageException: The condition specified using HTTP conditional header(s) is not met...
    ```

- **Cause**: Azure Synapse Analytics hit issue querying the external table in Azure Storage.

- **Resolution**: Run the same query in SSMS and check if you see the same result. If yes, open a support ticket to Azure Synapse Analytics and provide your Azure Synapse Analytics server and database name to further troubleshoot.
            

### Low performance when load data into Azure SQL

- **Symptoms**: Copying data in to Azure SQL turns to be slow.

- **Cause**: The root cause of the issue is mostly triggered by the bottleneck of Azure SQL side. Following are some possible causes:

    1. Azure DB tier is not high enough.

    1. Azure DB DTU usage is close to 100%. You can [monitor the performance](https://docs.microsoft.com/azure/azure-sql/database/monitor-tune-overview) and consider to upgrade the DB tier.

    1. Indexes are not set properly. Please remove all the indexes before data load and recreate them after load complete.

    1. WriteBatchSize is not large enough to fit schema row size. Please try to enlarge the property for the issue.

    1. Instead of bulk inset, stored procedure is being used, which is expected to have worse performance. 


### Performance tier is low and leads to copy failure

- **Symptoms**: Below error message occurred when copying data into Azure SQL: `Database operation failed. Error message from database execution : ExecuteNonQuery requires an open and available Connection. The connection's current state is closed.`

- **Cause**: Azure SQL s1 is being used, which hit IO limits in such case.

- **Resolution**: Please upgrade the Azure SQL performance tier to fix the issue. 


### SQL Table cannot be found 

- **Symptoms**: Error occurred when copying data from Hybrid into On-prem SQL Server table：`Cannot find the object "dbo.Contoso" because it does not exist or you do not have permissions.`

- **Cause**: The current SQL account does not have enough permission to execute requests issued by .NET SqlBulkCopy.WriteToServer.

- **Resolution**: Please switch to a more privileged SQL account.


### String or binary data would be truncated

- **Symptoms**: Error occurred when copying data into On-prem/Azure SQL Server table: 

- **Cause**: Cx Sql table schema definition has one or more columns with less length than expectation.

- **Resolution**: Please try following steps to fix the issue:

    1. Apply [fault tolerance](https://docs.microsoft.com/azure/data-factory/copy-activity-fault-tolerance), especially "redirectIncompatibleRowSettings" to troubleshoot which rows have the issue.

    1. Double check the redirected data with SQL table schema column length to see which column(s) need to be updated.

    1. Update table schema accordingly.


## Delimited Text Format

### Error code:  DelimitedTextColumnNameNotAllowNull

- **Message**: `The name of column index %index; is empty. Make sure column name is properly specified in the header row.`

- **Cause**: When set 'firstRowAsHeader' in activity, the first row will be used as column name. This error means the first row contains empty value. For example: 'ColumnA, ColumnB'.

- **Recommendation**:  Check the first row, and fix the value if there is empty value.


### Error code:  DelimitedTextMoreColumnsThanDefined

- **Message**: `Error found when processing '%function;' source '%name;' with row number %rowCount;: found more columns than expected column count: %columnCount;.`

- **Cause**: The problematic row's column count is larger than the first row's column count. It may be caused by data issue or incorrect column delimiter/quote char settings.

- **Recommendation**:  Get the row count in error message, check the row's column and fix the data.

- **Cause**: If the expected column count is "1" in error message, maybe you have specified wrong compression or format settings. Thus ADF parsed your file(s) incorrectly.

- **Recommendation**:  Check the format settings to make sure it matches to your source file(s).

- **Cause**: If your source is a folder, it's possible that the files under the specified folder have different schema.

- **Recommendation**:  Make sure the files under the given folder have identical schema.


### Error code:  DelimitedTextIncorrectRowDelimiter

- **Message**: `The specified row delimiter %rowDelimiter; is incorrect. Cannot detect a row after parse %size; MB data.`


### Error code:  DelimitedTextTooLargeColumnCount

- **Message**: `Column count reaches limitation when deserializing csv file. Maximum size is '%size;'. Check the column delimiter and row delimiter provided. (Column delimiter: '%columnDelimiter;', Row delimiter: '%rowDelimiter;')`


### Error code:  DelimitedTextInvalidSettings

- **Message**: `%settingIssues;`



## Dynamics 365/Common Data Service/Dynamics CRM

### Error code:  DynamicsCreateServiceClientError

- **Message**: `This is a transient issue on dynamics server side. Try to rerun the pipeline.`

- **Cause**: This is a transient issue on dynamics server side.

- **Recommendation**:  Rerun the pipeline. If keep failing, try to reduce the parallelism. If still fail, please contact dynamics support.


### Columns are missing when previewing/importing schema

- **Symptoms**: Some of the columns turn out to be missing when importing schema or previewing data. Error message: `The valid structure information (column name and type) are required for Dynamics source.`

- **Cause**: This issue is basically by-design, as ADF is not able to show columns that have no value in the first 10 records. Please make sure the columns you added is with correct format. 

- **Recommendation**: Manually add the columns in mapping tab.


## Excel Format

### Timeout or slow performance when parsing large Excel file

- **Symptoms**:

    1. When you create Excel dataset and import schema from connection/store, preview data, list or refresh worksheets, you may hit timeout error if the excel file is large in size.
    2. When you use copy activity to copy data from large Excel file (>= 100MB) into other data store, you may experience slow performance or OOM issue.

- **Cause**: 

    1. For operations like importing schema, previewing data and listing worksheets on excel dataset, the timeout is 100s and static. For large Excel file, these operations may not finish within the timeout value.

    2. ADF copy activity reads the whole Excel file into memory then locate the specified worksheet and cells to read data. This behavior is due to the underlying SDK ADF uses.

- **Resolution**: 

    1. For importing schema, you can generate a smaller sample file which is a subset of original file, and choose "import schema from sample file" instead of "import schema from connection/store".

    2. For listing worksheet, in the worksheet dropdown, you can click "Edit" and input the sheet name/index instead.

    3. To copy large excel file (>100MB) into other store, you can use Data Flow Excel source which sport streaming read and perform better.


## HDInsight

### SSL error when ADF linked service using HDInsight ESP cluster

- **Message**: `Failed to connect to HDInsight cluster: 'ERROR [HY000] [Microsoft][DriverSupport] (1100) SSL certificate verification failed because the certificate is missing or incorrect.`

- **Cause**: The issue is most likely related with System Trust Store.

- **Resolution**: 

    1. You can navigate the path **Microsoft Integration Runtime\4.0\Shared\ODBC Drivers\Microsoft Hive ODBC Driver\lib** and open DriverConfiguration64.exe to change the setting.

    ![Uncheck Use System Trust Store](./media/connector-troubleshoot-guide/system-trust-store-setting.png)

    2. Registry key will be generated after you change the setting.

    ![System Trust Store registry](./media/connector-troubleshoot-guide/system-trust-store-registry.png)


## JSON Format

### Error code:  JsonInvalidArrayPathDefinition

- **Message**: `Error occurred when deserializing source JSON data. Check whether the JsonPath in JsonNodeReference and JsonPathDefintion is valid.`


### Error code:  JsonEmptyJObjectData

- **Message**: `The specified row delimiter %rowDelimiter; is incorrect. Cannot detect a row after parse %size; MB data.`


### Error code:  JsonNullValueInPathDefinition

- **Message**: `Null JSONPath detected in JsonPathDefinition.`


### Error code:  JsonUnsupportedHierarchicalComplexValue

- **Message**: `The retrieved type of data %data; with value %value; is not supported yet. Please either remove the targeted column '%name;' or enable skip incompatible row to skip the issue rows.`


### Error code:  JsonConflictPartitionDiscoverySchema

- **Message**: `Conflicting partition column names detected.'%schema;', '%partitionDiscoverySchema;'`


### Error code:  JsonInvalidDataFormat

- **Message**: `Error occurred when deserializing source JSON file '%fileName;'. Check if the data is in valid JSON object format.`


### Error code:  JsonInvalidDataMixedArrayAndObject

- **Message**: `Error occurred when deserializing source JSON file '%fileName;'. The JSON format doesn't allow mixed arrays and objects.`


## Oracle

### Error code: ArgumentOutOfRangeException

- **Message**: `Hour, Minute, and Second parameters describe an un-representable DateTime.`

- **Cause**: In ADF, DateTime values are supported in the range from 0001-01-01 00:00:00 to 9999-12-31 23:59:59. However, Oracle supports wider range of DateTime value (like BC century or min/sec>59), which leads to failure in ADF.

- **Recommendation**: 

    Please run `select dump(<column name>)` to check if the value in Oracle is in ADF's range. 

    If you wish to know the byte sequence in the result, please check https://stackoverflow.com/questions/13568193/how-are-dates-stored-in-oracle.


## Parquet Format

### Error code:  ParquetJavaInvocationException

- **Message**: `An error occurred when invoking java, message: %javaException;.`

- **Cause**: When the error message contains 'java.lang.OutOfMemory', 'Java heap space' and 'doubleCapacity', usually it's a memory management issue in old version of integration runtime.

- **Recommendation**:  If you are using Self-hosted Integration Runtime and the version is earlier than 3.20.7159.1, it is suggested to upgrade to the latest version.

- **Cause**: When the error message contains 'java.lang.OutOfMemory', the integration runtime doesn't have enough resource to process the file(s).

- **Recommendation**:  Limit the concurrent runs on the integration runtime. For Self-hosted Integration Runtime, scale up to a powerful machine with memory equal to or larger than 8 GB.

- **Cause**: When error message contains 'NullPointerReference', it possible is a transient error.

- **Recommendation**:  Retry. If the problem persists, please contact support.


### Error code:  ParquetInvalidFile

- **Message**: `File is not a valid Parquet file.`

- **Cause**: Parquet file issue.

- **Recommendation**:  Check the input is a valid Parquet file.


### Error code:  ParquetNotSupportedType

- **Message**: `Unsupported Parquet type. PrimitiveType: %primitiveType; OriginalType: %originalType;.`

- **Cause**: The Parquet format is not supported in Azure Data Factory.

- **Recommendation**:  Double check the source data. Refer to the doc: https://docs.microsoft.com/azure/data-factory/supported-file-formats-and-compression-codecs.


### Error code:  ParquetMissedDecimalPrecisionScale

- **Message**: `Decimal Precision or Scale information is not found in schema for column: %column;.`

- **Cause**: Try to parse the number precision and scale, but no such information is provided.

- **Recommendation**:  'Source' does not return correct Precision and scale. Check the issue column precision and scale.


### Error code:  ParquetInvalidDecimalPrecisionScale

- **Message**: `Invalid Decimal Precision or Scale. Precision: %precision; Scale: %scale;.`

- **Cause**: The schema is invalid.

- **Recommendation**:  Check the issue column precision and scale.


### Error code:  ParquetColumnNotFound

- **Message**: `Column %column; does not exist in Parquet file.`

- **Cause**: Source schema is mismatch with sink schema.

- **Recommendation**:  Check the'mappings' in 'activity'. Make sure the source column can be mapped to the right sink column.


### Error code:  ParquetInvalidDataFormat

- **Message**: `Incorrect format of %srcValue; for converting to %dstType;.`

- **Cause**: The data cannot be converted into type specified in mappings.source

- **Recommendation**:  Double check the source data or specify the correct data type for this column in copy activity column mapping. Refer to the doc: https://docs.microsoft.com/azure/data-factory/supported-file-formats-and-compression-codecs.


### Error code:  ParquetDataCountNotMatchColumnCount

- **Message**: `The data count in a row '%sourceColumnCount;' does not match the column count '%sinkColumnCount;' in given schema.`

- **Cause**: Source column count and sink column count mismatch

- **Recommendation**:  Double check source column count is same as sink column count in 'mapping'.


### Error code:  ParquetDataTypeNotMatchColumnType

- **Message**: The data type %srcType; is not match given column type %dstType; at column '%columnIndex;'.

- **Cause**: Data from source cannot be converted to typed defined in sink

- **Recommendation**:  Specify a correct type in mapping.sink.


### Error code:  ParquetBridgeInvalidData

- **Message**: `%message;`

- **Cause**: Data value over limitation

- **Recommendation**:  Retry. If issue persists, please contact us.


### Error code:  ParquetUnsupportedInterpretation

- **Message**: `The given interpretation '%interpretation;' of Parquet format is not supported.`

- **Cause**: Not supported scenario

- **Recommendation**:  'ParquetInterpretFor' should not be 'sparkSql'.


### Error code:  ParquetUnsupportFileLevelCompressionOption

- **Message**: `File level compression is not supported for Parquet.`

- **Cause**: Not supported scenario

- **Recommendation**:  Remove 'CompressionType' in payload.


### Error code:  UserErrorJniException

- **Message**: `Cannot create JVM: JNI return code [-6][JNI call failed: Invalid arguments.]`

- **Cause**: JVM can't be created because some illegal (global) arguments are set.

- **Recommendation**:  Log in to the machine that host **each node** of your self-hosted IR. Check if the system variable is correctly set like this: `_JAVA_OPTIONS "-Xms256m -Xmx16g" with memory bigger than 8 G`. Restart all the IR nodes and then rerun the pipeline.


### Arithmetic overflow

- **Symptoms**: Error message occurred when copying Parquet files: `Message = Arithmetic Overflow., Source = Microsoft.DataTransfer.Common`

- **Cause**: Currently only decimal of precision <= 38 and length of integer part <= 20 is supported when copying files from Oracle to Parquet. 

- **Resolution**: You may convert columns with such problem into VARCHAR2 as a workaround.


### No enum constant

- **Symptoms**: Error message occurred when copying data to Parquet format: `java.lang.IllegalArgumentException:field ended by &apos;;&apos;`, or: `java.lang.IllegalArgumentException:No enum constant org.apache.parquet.schema.OriginalType.test`.

- **Cause**: 

    The issue could be caused by white spaces or unsupported characters (such as ,;{}()\n\t=) in column name, as Parquet doesn't support such format. 

    For example, column name like *contoso(test)* will parse the type in brackets from [code](https://github.com/apache/parquet-mr/blob/master/parquet-column/src/main/java/org/apache/parquet/schema/MessageTypeParser.java) `Tokenizer st = new Tokenizer(schemaString, " ;{}()\n\t");`. The error will be raised as there is no such "test" type.

    To check supported types, you can check them [here](https://github.com/apache/parquet-mr/blob/master/parquet-column/src/main/java/org/apache/parquet/schema/OriginalType.java).

- **Resolution**: 

    1. Double check if there are white spaces in sink column name.

    1. Double check if the first row with white spaces is used as column name.

    1. Double check the type OriginalType is supported or not. Try to avoid these special symbols. 


## REST

### Unexpected network response from REST connector

- **Symptoms**: Endpoint sometimes receives unexpected response (400 / 401 / 403 / 500) from REST connector.

- **Cause**: The REST source connector uses URL and HTTP method/header/body from linked service/dataset/copy source as parameters when constructing an HTTP request. The issue is most likely caused by some mistakes in one or more specified parameters.

- **Resolution**: 
    - Use 'curl' in cmd window to check if parameter is the cause or not (**Accept** and **User-Agent** headers should always be included):
        ```
        curl -i -X <HTTP method> -H <HTTP header1> -H <HTTP header2> -H "Accept: application/json" -H "User-Agent: azure-data-factory/2.0" -d '<HTTP body>' <URL>
        ```
      If the command returns the same unexpected response, please fix above parameters with 'curl' until it returns the expected response. 

      Also you can use 'curl --help' for more advanced usage of the command.

    - If only ADF REST connector returns unexpected response, please contact Microsoft support for further troubleshooting.
    
    - Please note that 'curl' may not be suitable to reproduce SSL certificate validation issue. In some scenarios, 'curl' command was executed successfully without hitting any SSL cert validation issue. But when the same URL is executed in browser, no SSL cert is actually returned in the first place for client to establish trust with server.

      Tools like **Postman** and **Fiddler** are recommended for the above case.


## SFTP

### Invalid SFTP credential provided for 'SSHPublicKey' authentication type

- **Symptoms**: SSH public key authentication is being used while Invalid SFTP credential is provided for 'SshPublicKey' authentication type.

- **Cause**: This error could be caused by three possible reasons:

    1. Private key content is fetched from AKV/SDK but it is not encoded correctly.

    1. Wrong key content format is chosen.

    1. Invalid credential or private key content.

- **Resolution**: 

    1. For **Cause 1**:

       If private key content is from AKV and original key file can work if customer upload it directly to SFTP linked service

       Refer to https://docs.microsoft.com/azure/data-factory/connector-sftp#using-ssh-public-key-authentication, the privateKey content is a Base64 encoded SSH private key content.

       Please encode **the whole content of original private key file** with base64 encoding and store the encoded string to AKV. Original private key file is the one that can work on SFTP linked service if you click on Upload from file.

       Here's some samples used for generating the string:

       - Use C# code:
       ```
       byte[] keyContentBytes = File.ReadAllBytes(Private Key Path);
       string keyContent = Convert.ToBase64String(keyContentBytes, Base64FormattingOptions.None);
       ```

       - Use Python code：
       ```
       import base64
       rfd = open(r'{Private Key Path}', 'rb')
       keyContent = rfd.read()
       rfd.close()
       print base64.b64encode(Key Content)
       ```

       - Use third-party base64 convert tool

         Tools like https://www.base64encode.org/ are recommended.

    1. For **Cause 2**:

       If PKCS#8 format SSH private key is being used

       PKCS#8 format SSH private key (start with "-----BEGIN ENCRYPTED PRIVATE KEY-----") is currently not supported to access SFTP server in ADF. 

       Run below commands to convert the key to traditional SSH key format (start with "-----BEGIN RSA PRIVATE KEY-----"):

       ```
       openssl pkcs8 -in pkcs8_format_key_file -out traditional_format_key_file
       chmod 600 traditional_format_key_file
       ssh-keygen -f traditional_format_key_file -p
       ```
    1. For **Cause 3**:

       Please double check with tools like WinSCP to see if your key file or password is correct.


### Incorrect linked service type is used

- **Symptoms**: FTP/SFTP server cannot be reached.

- **Cause**: Incorrect linked service type is used for FTP or SFTP server, like using FTP Linked Service to connect to an SFTP server or in reverse.

- **Resolution**: Please check the port of the target server. By default FTP uses port 21 and SFTP uses port 22.


### SFTP Copy Activity failed

- **Symptoms**: Error code: UserErrorInvalidColumnMappingColumnNotFound. Error message: `Column &apos;AccMngr&apos; specified in column mapping cannot be found in source data.`

- **Cause**: The source doesn't include a column named "AccMngr".

- **Resolution**: Double check how your dataset configured by mapping the destination dataset column to confirm if there's such "AccMngr" column.


### SFTP server connection throttling

- **Symptoms**: Server response does not contain SSH protocol identification and failed to copy.

- **Cause**: ADF will create multiple connections to download from SFTP server in parallel, and sometimes it will hit SFTP server throttling. Practically, Different server will return different error when hit throttling.

- **Resolution**: 

    Please specify the max concurrent connection of SFTP dataset to 1 and rerun the copy. If it succeeds to pass, we can be sure that throttling is the cause.

    If you want to promote the low throughput, please contact SFTP administrator to increase the concurrent connection count limit, or add below IP to allow list:

    - If you're using Managed IR, please add [Azure Datacenter IP Ranges](https://www.microsoft.com/download/details.aspx?id=41653).
      Or you can install Self-hosted IR if you do not want to add large list of IP ranges into SFTP server allow list.

    - If you're using Self-hosted IR, please add the machine IP that installed SHIR to allow list.


### Error code: SftpRenameOperationFail

- **Symptoms**: Pipeline failed to copy data from Blob to SFTP with following error: `Operation on target Copy_5xe failed: Failure happened on 'Sink' side. ErrorCode=SftpRenameOperationFail,Type=Microsoft.DataTransfer.Common.Shared.HybridDeliveryException`.

- **Cause**: The option useTempFileRename was set as True when copying the data. This allows the process to use temp files. The error will be triggered if one or more temp files were deleted before the entire data is copied.

- **Resolution**: Set the option of useTempFileName to False.


## General Copy Activity Error

### Error code:  JreNotFound

- **Message**: `Java Runtime Environment cannot be found on the Self-hosted Integration Runtime machine. It is required for parsing or writing to Parquet/ORC files. Make sure Java Runtime Environment has been installed on the Self-hosted Integration Runtime machine.`

- **Cause**: The self-hosted integration runtime cannot find Java Runtime. The Java Runtime is required for reading particular source.

- **Recommendation**:  Check your integration runtime environment, the reference doc: https://docs.microsoft.com/azure/data-factory/format-parquet#using-self-hosted-integration-runtime


### Error code:  WildcardPathSinkNotSupported

- **Message**: `Wildcard in path is not supported in sink dataset. Fix the path: '%setting;'.`

- **Cause**: Sink dataset doesn't support wildcard.

- **Recommendation**:  Check the sink dataset and fix the path without wildcard value.


### Error code:  MappingInvalidPropertyWithEmptyValue

- **Message**: `One or more '%sourceOrSink;' in copy activity mapping doesn't point to any data. Choose one of the three properties 'name', 'path' and 'ordinal' to reference columns/fields.`


### Error code:  MappingInvalidPropertyWithNamePathAndOrdinal

- **Message**: `Mixed properties are used to reference '%sourceOrSink;' columns/fields in copy activity mapping. Please only choose one of the three properties 'name', 'path' and 'ordinal'. The problematic mapping setting is 'name': '%name;', 'path': '%path;','ordinal': '%ordinal;'.`


### Error code:  MappingDuplicatedOrdinal

- **Message**: `Copy activity 'mappings' has duplicated ordinal value "%Ordinal;". Fix the setting in 'mappings'.`


### Error code:  MappingInvalidOrdinalForSinkColumn

- **Message**: `Invalid 'ordinal' property for sink column under 'mappings' property. Ordinal: %Ordinal;.`


## Next steps

For more troubleshooting help, try these resources:

*  [Data Factory blog](https://azure.microsoft.com/blog/tag/azure-data-factory/)
*  [Data Factory feature requests](https://feedback.azure.com/forums/270578-data-factory)
*  [Azure videos](https://azure.microsoft.com/resources/videos/index/?sort=newest&services=data-factory)
*  [Microsoft Q&A question page](/answers/topics/azure-data-factory.html)
*  [Stack Overflow forum for Data Factory](https://stackoverflow.com/questions/tagged/azure-data-factory)
*  [Twitter information about Data Factory](https://twitter.com/hashtag/DataFactory)

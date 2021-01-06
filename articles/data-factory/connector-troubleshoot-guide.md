---
title: Troubleshoot Azure Data Factory Connectors
description: Learn how to troubleshoot connector issues in Azure Data Factory. 
services: data-factory
author: linda33wj
ms.service: data-factory
ms.topic: troubleshooting
ms.date: 12/30/2020
ms.author: jingwang
ms.reviewer: craigg
ms.custom: has-adal-ref
---

# Troubleshoot Azure Data Factory Connectors

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article explores common troubleshooting methods for connectors in Azure Data Factory.
  
## Azure Blob Storage

### Error code: AzureBlobOperationFailed

- **Message**: `Blob operation Failed. ContainerName: %containerName;, path: %path;.`

- **Cause**: Blob storage operation hit problem.

- **Recommendation**:  Check the error in details. Refer to blob help document: https://docs.microsoft.com/rest/api/storageservices/blob-service-error-codes. Contact storage team if need help.


### Invalid property during copy activity

- **Message**: `Copy activity <Activity Name> has an invalid "source" property. The source type is not compatible with the dataset <Dataset Name> and its linked service <Linked Service Name>. Please verify your input against.`

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

    - **Increase the container RU** to bigger value in Cosmos DB, which will improve the copy activity performance, though incur more cost in Cosmos DB. 
    - Decrease **writeBatchSize** to smaller value (such as 1000) and set **parallelCopies** to smaller value such as 1, which will make copy run performance worse than current but will not incur more cost in Cosmos DB.

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
			
## Azure Cosmos DB (SQL API)

### Error code:  CosmosDbSqlApiOperationFailed

- **Message**: `CosmosDbSqlApi operation Failed. ErrorMessage: %msg;.`

- **Cause**: CosmosDbSqlApi operation hit problem.

- **Recommendation**:  Check the error in details. Refer to [CosmosDb help document](https://docs.microsoft.com/azure/cosmos-db/troubleshoot-dot-net-sdk). Contact CosmosDb team if need help.


## Azure Data Lake Storage Gen1

### Error message: The underlying connection was closed: Could not establish trust relationship for the SSL/TLS secure channel.

- **Symptoms**: Copy activity fails with the following error: 

    ```
    Message: ErrorCode = `UserErrorFailedFileOperation`, Error Message = `The underlying connection was closed: Could not establish trust relationship for the SSL/TLS secure channel`.
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


## Azure Data Lake Storage Gen2

### Error code: ADLSGen2OperationFailed

- **Message**: `ADLS Gen2 operation failed for: %adlsGen2Message;.%exceptionData;.`

- **Cause**: ADLS Gen2 throws the error indicating operation failed.

- **Recommendation**:  Check the detailed error message thrown by ADLS Gen2. If it's caused by transient failure, please retry. If you need further help, please contact Azure Storage support and provide the request ID in error message.

- **Cause**: When the error message contains 'Forbidden', the service principal or managed identity you use may not have enough permission to access the ADLS Gen2.

- **Recommendation**:  Refer to the help document: https://docs.microsoft.com/azure/data-factory/connector-azure-data-lake-storage#service-principal-authentication.

- **Cause**: When the error message contains 'InternalServerError', the error is returned by ADLS Gen2.

- **Recommendation**:  It may be caused by transient failure, please retry. If the issue persists, please contact Azure Storage support and provide the request ID in error message.

### Request to ADLS Gen2 account met timeout error

- **Message**: Error Code = `UserErrorFailedBlobFSOperation`, Error Message = `BlobFS operation failed for: A task was canceled`.

- **Cause**: The issue is caused by the ADLS Gen2 sink timeout error, which mostly happens on the self-hosted IR machine.

- **Recommendation**: 

    - Place your self-hosted IR machine and target ADLS Gen2 account in the same region if possible. This can avoid random timeout error and have better performance.

    - Check whether there is any special network setting like ExpressRoute and ensure the network has enough bandwidth. It is suggested to lower the self-hosted IR concurrent jobs setting when the overall bandwidth is low, through which can avoid network resource competition across multiple concurrent jobs.

    - Use smaller block size for non-binary copy to mitigate such timeout error if the file size is moderate or small. Refer to [Blob Storage Put Block](https://docs.microsoft.com/rest/api/storageservices/put-block).

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

			      
## Azure File Storage

### Error code:  AzureFileOperationFailed

- **Message**: `Azure File operation Failed. Path: %path;. ErrorMessage: %msg;.`

- **Cause**: Azure File storage operation hit problem.

- **Recommendation**:  Check the error in details. Refer to Azure File help document: https://docs.microsoft.com/rest/api/storageservices/file-service-error-codes. Contact the storage team if you need help.


## Azure Synapse Analytics/Azure SQL Database/SQL Server

### Error code:  SqlFailedToConnect

- **Message**: `Cannot connect to SQL Database: '%server;', Database: '%database;', User: '%user;'. Check the linked service configuration is correct, and make sure the SQL Database firewall allows the integration runtime to access.`

- **Cause**: Azure SQL: If the error message contains "SqlErrorNumber=47073", it means public network access is denied in connectivity setting.

- **Recommendation**: On Azure SQL firewall, set "Deny public network access" option to "No". Learn more from https://docs.microsoft.com/azure/azure-sql/database/connectivity-settings#deny-public-network-access.

- **Cause**: Azure SQL: If the error message contains SQL error code, like "SqlErrorNumber=[errorcode]", please refer to Azure SQL troubleshooting guide.

- **Recommendation**: Learn more from https://docs.microsoft.com/azure/azure-sql/database/troubleshoot-common-errors-issues.

- **Cause**: Check if port 1433 is in the firewall allow list.

- **Recommendation**: Follow with this reference doc: https://docs.microsoft.com/sql/sql-server/install/configure-the-windows-firewall-to-allow-sql-server-access#ports-used-by-.

- **Cause**: If the error message contains "SqlException", SQL Database throws the error indicating some specific operation failed.

- **Recommendation**:  Search by SQL error code in this reference doc for more details: https://docs.microsoft.com/sql/relational-databases/errors-events/database-engine-events-and-errors. If you need further help, contact Azure SQL support.

- **Cause**: If this is a transient issue (e.g., instable network connection), please add retry in activity policy to mitigate.

- **Recommendation**:  Follow this reference doc: https://docs.microsoft.com/azure/data-factory/concepts-pipelines-activities#activity-policy.

- **Cause**: If the error message contains "Client with IP address '...' is not allowed to access the server", and you are trying to connect to Azure SQL Database, usually it is caused by Azure SQL Database firewall issue.

- **Recommendation**:  In Azure SQL Server firewall configuration, enable "Allow Azure services and resources to access this server" option. Reference doc: https://docs.microsoft.com/azure/sql-database/sql-database-firewall-configure.


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

- **Resolution**: 
    - Reduce column width to be less than 1 MB.
    - Or use bulk insert approach by disabling Polybase.


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

    - Azure DB tier is not high enough.

    - Azure DB DTU usage is close to 100%. You can [monitor the performance](https://docs.microsoft.com/azure/azure-sql/database/monitor-tune-overview) and consider to upgrade the DB tier.

    - Indexes are not set properly. Remove all the indexes before data load and recreate them after load complete.

    - WriteBatchSize is not large enough to fit schema row size. Try to enlarge the property for the issue.

    - Instead of bulk inset, stored procedure is being used, which is expected to have worse performance. 

- **Resolution**: Refer to the TSG for [copy activity performance](https://docs.microsoft.com/azure/data-factory/copy-activity-performance-troubleshooting)


### Performance tier is low and leads to copy failure

- **Symptoms**: Below error message occurred when copying data into Azure SQL: `Database operation failed. Error message from database execution : ExecuteNonQuery requires an open and available Connection. The connection's current state is closed.`

- **Cause**: Azure SQL s1 is being used, which hit IO limits in such case.

- **Resolution**: Upgrade the Azure SQL performance tier to fix the issue. 


### SQL Table cannot be found 

- **Symptoms**: Error occurred when copying data from Hybrid into On-prem SQL Server table：`Cannot find the object "dbo.Contoso" because it does not exist or you do not have permissions.`

- **Cause**: The current SQL account does not have enough permission to execute requests issued by .NET SqlBulkCopy.WriteToServer.

- **Resolution**: Switch to a more privileged SQL account.


### Error message: String or binary data would be truncated

- **Symptoms**: Error occurred when copying data into On-prem/Azure SQL Server table: 

- **Cause**: Cx Sql table schema definition has one or more columns with less length than expectation.

- **Resolution**: Try following steps to fix the issue:

    1. Apply SQL sink [fault tolerance](https://docs.microsoft.com/azure/data-factory/copy-activity-fault-tolerance), especially "redirectIncompatibleRowSettings" to troubleshoot which rows have the issue.

    	> [!NOTE]
    	> Please be noticed that fault tolerance might introduce additional execution time, which could lead to higher cost.

    2. Double check the redirected data with SQL table schema column length to see which column(s) need to be updated.

    3. Update table schema accordingly.


## Azure Table Storage

### Error code:  AzureTableDuplicateColumnsFromSource

- **Message**: `Duplicate columns with same name '%name;' are detected from source. This is NOT supported by Azure Table Storage sink`

- **Cause**: It could be common for sql query with join, or unstructured csv files

- **Recommendation**:  double check the source columns and fix accordingly.


## DB2

### Error code:  DB2DriverRunFailed

- **Message**: `Error thrown from driver. Sql code: '%code;'`

- **Cause**: If the error message contains "SQLSTATE=51002 SQLCODE=-805", please refer to the Tip in this document: https://docs.microsoft.com/azure/data-factory/connector-db2#linked-service-properties

- **Recommendation**:  Try to set "NULLID" in property "packageCollection"


## Delimited Text Format

### Error code:  DelimitedTextColumnNameNotAllowNull

- **Message**: `The name of column index %index; is empty. Make sure column name is properly specified in the header row.`

- **Cause**: When set 'firstRowAsHeader' in activity, the first row will be used as column name. This error means the first row contains empty value. For example: 'ColumnA, ColumnB'.

- **Recommendation**:  Check the first row, and fix the value if there is empty value.


### Error code:  DelimitedTextMoreColumnsThanDefined

- **Message**: `Error found when processing '%function;' source '%name;' with row number %rowCount;: found more columns than expected column count: %expectedColumnCount;.`

- **Cause**: The problematic row's column count is larger than the first row's column count. It may be caused by data issue or incorrect column delimiter/quote char settings.

- **Recommendation**:  Get the row count in error message, check the row's column and fix the data.

- **Cause**: If the expected column count is "1" in error message, maybe you have specified wrong compression or format settings. Thus ADF parsed your file(s) incorrectly.

- **Recommendation**:  Check the format settings to make sure it matches to your source file(s).

- **Cause**: If your source is a folder, it's possible that the files under the specified folder have different schema.

- **Recommendation**:  Make sure the files under the given folder have identical schema.


## Dynamics 365/Common Data Service/Dynamics CRM

### Error code:  DynamicsCreateServiceClientError

- **Message**: `This is a transient issue on dynamics server side. Try to rerun the pipeline.`

- **Cause**: This is a transient issue on dynamics server side.

- **Recommendation**:  Rerun the pipeline. If keep failing, try to reduce the parallelism. If still fail, please contact dynamics support.


### Columns are missing when previewing/importing schema

- **Symptoms**: Some of the columns turn out to be missing when importing schema or previewing data. Error message: `The valid structure information (column name and type) are required for Dynamics source.`

- **Cause**: This issue is basically by-design, as ADF is not able to show columns that have no value in the first 10 records. Make sure the columns you added is with correct format. 

- **Recommendation**: Manually add the columns in mapping tab.


### Error code:  DynamicsMissingTargetForMultiTargetLookupField

- **Message**: `Cannot find the target column for multi-target lookup field: '%fieldName;'.`

- **Cause**: The target column does not exist in source or in column mapping.

- **Recommendation**:  1. Make sure the source contains the target column. 2. Add the target column in the column mapping. Ensure the sink column is in pattern of "{fieldName}@EntityReference".


### Error code:  DynamicsInvalidTargetForMultiTargetLookupField

- **Message**: `The provided target: '%targetName;' is not a valid target of field: '%fieldName;'. Valid targets are: '%validTargetNames;"`

- **Cause**: A wrong entity name is provided as target entity of a multi-target lookup field.

- **Recommendation**:  Provide a valid entity name for the multi-target lookup field.


### Error code:  DynamicsInvalidTypeForMultiTargetLookupField

- **Message**: `The provided target type is not a valid string. Field: '%fieldName;'.`

- **Cause**: The value in target column is not a string

- **Recommendation**:  Provide a valid string in the multi-target lookup target column.


### Error code:  DynamicsFailedToRequetServer

- **Message**: `The dynamics server or the network is experiencing issues. Check network connectivity or check dynamics server log for more details.`

- **Cause**: The dynamics server is instable or inaccessible or the network is experiencing issues.

- **Recommendation**:  Check network connectivity or check dynamics server log for more details. Contact dynamics support for further help.


## Excel Format

### Timeout or slow performance when parsing large Excel file

- **Symptoms**:

    - When you create Excel dataset and import schema from connection/store, preview data, list, or refresh worksheets, you may hit timeout error if the excel file is large in size.

    - When you use copy activity to copy data from large Excel file (>= 100 MB) into other data store, you may experience slow performance or OOM issue.

- **Cause**: 

    - For operations like importing schema, previewing data, and listing worksheets on excel dataset, the timeout is 100 s and static. For large Excel file, these operations may not finish within the timeout value.

    - ADF copy activity reads the whole Excel file into memory then locate the specified worksheet and cells to read data. This behavior is due to the underlying SDK ADF uses.

- **Resolution**: 

    - For importing schema, you can generate a smaller sample file, which is a subset of original file, and choose "import schema from sample file" instead of "import schema from connection/store".

    - For listing worksheet, in the worksheet dropdown, you can click "Edit" and input the sheet name/index instead.

    - To copy large excel file (>100 MB) into other store, you can use Data Flow Excel source which sport streaming read and perform better.
    

## FTP

### Error code:  FtpFailedToConnectToFtpServer

- **Message**: `Failed to connect to FTP server. Please make sure the provided server informantion is correct, and try again.`

- **Cause**: Incorrect linked service type might be used for FTP server, like using SFTP Linked Service to connect to an FTP server.

- **Recommendation**:  Check the port of the target server. By default FTP uses port 21.


## Http

### Error code:  HttpFileFailedToRead

- **Message**: `Failed to read data from http server. Check the error from http server：%message;`

- **Cause**: This error happens when Azure Data Factory talk to http server, but http request operation fail.

- **Recommendation**:  Check the http status code \ message in error message and fix the remote server issue.


## Oracle

### Error code: ArgumentOutOfRangeException

- **Message**: `Hour, Minute, and Second parameters describe an un-representable DateTime.`

- **Cause**: In ADF, DateTime values are supported in the range from 0001-01-01 00:00:00 to 9999-12-31 23:59:59. However, Oracle supports wider range of DateTime value (like BC century or min/sec>59), which leads to failure in ADF.

- **Recommendation**: 

    Run `select dump(<column name>)` to check if the value in Oracle is in ADF's range. 

    If you wish to know the byte sequence in the result, please check https://stackoverflow.com/questions/13568193/how-are-dates-stored-in-oracle.


## Orc Format

### Error code:  OrcJavaInvocationException

- **Message**: `An error occurred when invoking java, message: %javaException;.`

- **Cause**: When the error message contains 'java.lang.OutOfMemory', 'Java heap space' and 'doubleCapacity', usually it's a memory management issue in old version of integration runtime.

- **Recommendation**:  If you are using Self-hosted Integration Runtime, suggest upgrading to the latest version.

- **Cause**: When the error message contains 'java.lang.OutOfMemory', the integration runtime doesn't have enough resource to process the file(s).

- **Recommendation**:  Limit the concurrent runs on the integration runtime. For Self-hosted Integration Runtime, scale up to a powerful machine with memory equal to or larger than 8 GB.

- **Cause**: When error message contains 'NullPointerReference', it possible is a transient error.

- **Recommendation**:  Retry. If the problem persists, please contact support.

- **Cause**: When error message contains 'BufferOverflowException', it possible is a transient error.

- **Recommendation**:  Retry. If the problem persists, please contact support.

- **Cause**: When error message contains "java.lang.ClassCastException:org.apache.hadoop.hive.serde2.io.HiveCharWritable cannot be cast to org.apache.hadoop.io.Text", this is the type conversion issue inside Java Runtime. Usually, it caused by source data cannot be well handled in Java runtime.

- **Recommendation**:  This is data issue. Try to use string instead of char/varchar in orc format data.

### Error code:  OrcDateTimeExceedLimit

- **Message**: `The Ticks value '%ticks;' for the datetime column must be between valid datetime ticks range -621355968000000000 and 2534022144000000000.`

- **Cause**: If the datetime value is '0001-01-01 00:00:00', it could be caused by the difference between Julian Calendar and Gregorian Calendar. https://en.wikipedia.org/wiki/Proleptic_Gregorian_calendar#Difference_between_Julian_and_proleptic_Gregorian_calendar_dates.

- **Recommendation**:  Check the ticks value and avoid using the datetime value '0001-01-01 00:00:00'.


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

    The issue could be caused by white spaces or unsupported characters (such as,;{}()\n\t=) in column name, as Parquet doesn't support such format. 

    For example, column name like *contoso(test)* will parse the type in brackets from [code](https://github.com/apache/parquet-mr/blob/master/parquet-column/src/main/java/org/apache/parquet/schema/MessageTypeParser.java) `Tokenizer st = new Tokenizer(schemaString, " ;{}()\n\t");`. The error will be raised as there is no such "test" type.

    To check supported types, you can check them [here](https://github.com/apache/parquet-mr/blob/master/parquet-column/src/main/java/org/apache/parquet/schema/OriginalType.java).

- **Resolution**: 

    - Double check if there are white spaces in sink column name.

    - Double check if the first row with white spaces is used as column name.

    - Double check the type OriginalType is supported or not. Try to avoid these special symbols `,;{}()\n\t=`. 


## REST

### Error code:  RestSinkCallFailed

- **Message**: `Rest Endpoint responded with Failure from server. Check the error from server:%message;`

- **Cause**: This error happens when Azure Data Factory talk to Rest Endpoint over http protocol, and request operation fail.

- **Recommendation**:  Check the http status code \ message in error message and fix the remote server issue.

### Unexpected network response from REST connector

- **Symptoms**: Endpoint sometimes receives unexpected response (400 / 401 / 403 / 500) from REST connector.

- **Cause**: The REST source connector uses URL and HTTP method/header/body from linked service/dataset/copy source as parameters when constructing an HTTP request. The issue is most likely caused by some mistakes in one or more specified parameters.

- **Resolution**: 
    - Use 'curl' in cmd window to check if parameter is the cause or not (**Accept** and **User-Agent** headers should always be included):
        ```
        curl -i -X <HTTP method> -H <HTTP header1> -H <HTTP header2> -H "Accept: application/json" -H "User-Agent: azure-data-factory/2.0" -d '<HTTP body>' <URL>
        ```
      If the command returns the same unexpected response, please fix above parameters with 'curl' until it returns the expected response. 

      Also you can use 'curl--help' for more advanced usage of the command.

    - If only ADF REST connector returns unexpected response, please contact Microsoft support for further troubleshooting.
    
    - Please note that 'curl' may not be suitable to reproduce SSL certificate validation issue. In some scenarios, 'curl' command was executed successfully without hitting any SSL cert validation issue. But when the same URL is executed in browser, no SSL cert is actually returned in the first place for client to establish trust with server.

      Tools like **Postman** and **Fiddler** are recommended for the above case.


## SFTP

#### Error code:  SftpOperationFail

- **Message**: `Failed to '%operation;'. Check detailed error from SFTP.`

- **Cause**: Sftp operation hit problem.

- **Recommendation**:  Check detailed error from SFTP.


### Error code:  SftpRenameOperationFail

- **Message**: `Failed to rename the temp file. Your SFTP server doesn't support renaming temp file, please set "useTempFileRename" as false in copy sink to disable uploading to temp file.`

- **Cause**: Your SFTP server doesn't support renaming temp file.

- **Recommendation**:  Set "useTempFileRename" as false in copy sink to disable uploading to temp file.


### Error code:  SftpInvalidSftpCredential

- **Message**: `Invalid Sftp credential provided for '%type;' authentication type.`

- **Cause**: Private key content is fetched from AKV/SDK but it is not encoded correctly.

- **Recommendation**:  

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

- **Cause**: Wrong key content format is chosen

- **Recommendation**:  

    PKCS#8 format SSH private key (start with "-----BEGIN ENCRYPTED PRIVATE KEY-----") is currently not supported to access SFTP server in ADF. 

    Run below commands to convert the key to traditional SSH key format (start with "-----BEGIN RSA PRIVATE KEY-----"):

    ```
    openssl pkcs8 -in pkcs8_format_key_file -out traditional_format_key_file
    chmod 600 traditional_format_key_file
    ssh-keygen -f traditional_format_key_file -p
    ```

- **Cause**: Invalid credential or private key content

- **Recommendation**:  Double check with tools like WinSCP to see if your key file or password is correct.

### SFTP Copy Activity failed

- **Symptoms**: Error code: UserErrorInvalidColumnMappingColumnNotFound. Error message: `Column &apos;AccMngr&apos; specified in column mapping cannot be found in source data.`

- **Cause**: The source doesn't include a column named "AccMngr".

- **Resolution**: Double check how your dataset configured by mapping the destination dataset column to confirm if there's such "AccMngr" column.


### Error code:  SftpFailedToConnectToSftpServer

- **Message**: `Failed to connect to Sftp server '%server;'.`

- **Cause**: If error message contains 'Socket read operation has timed out after 30000 milliseconds', one possible cause is that incorrect linked service type is used for SFTP server, like using FTP Linked Service to connect to an SFTP server.

- **Recommendation**:  Check the port of the target server. By default SFTP uses port 22.

- **Cause**: If error message contains 'Server response does not contain SSH protocol identification', one possible cause is that SFTP server throttled the connection. ADF will create multiple connections to download from SFTP server in parallel, and sometimes it will hit SFTP server throttling. Practically, different server will return different error when hit throttling.

- **Recommendation**:  

    Specify the max concurrent connection of SFTP dataset to 1 and rerun the copy. If it succeeds to pass, we can be sure that throttling is the cause.

    If you want to promote the low throughput, please contact SFTP administrator to increase the concurrent connection count limit, or add below IP to allow list:

    - If you're using Managed IR, please add [Azure Datacenter IP Ranges](https://www.microsoft.com/download/details.aspx?id=41653).
      Or you can install Self-hosted IR if you do not want to add large list of IP ranges into SFTP server allow list.

    - If you're using Self-hosted IR, please add the machine IP that installed SHIR to allow list.


## SharePoint Online List

### Error code:  SharePointOnlineAuthFailed

- **Message**: `The access token generated failed, status code: %code;, error message: %message;.`

- **Cause**: The service principal ID and Key may not correctly set.

- **Recommendation**:  Check your registered application (service principal ID) and key whether it's correctly set.


## Xml Format

### Error code:  XmlSinkNotSupported

- **Message**: `Write data in xml format is not supported yet, please choose a different format!`

- **Cause**: Used an Xml dataset as sink dataset in your copy activity

- **Recommendation**:  Use a dataset in different format as copy sink.


### Error code:  XmlAttributeColumnNameConflict

- **Message**: `Column names %attrNames;' for attributes of element '%element;' conflict with that for corresponding child elements, and the attribute prefix used is '%prefix;'.`

- **Cause**: Used an attribute prefix, which caused the conflict.

- **Recommendation**:  Set a different value of the "attributePrefix" property.


### Error code:  XmlValueColumnNameConflict

- **Message**: `Column name for the value of element '%element;' is '%columnName;' and it conflicts with the child element having the same name.`

- **Cause**: Used one of the child element names as the column name for the element value.

- **Recommendation**:  Set a different value of the "valueColumn" property.


### Error code:  XmlInvalid

- **Message**: `Input XML file '%file;' is invalid with parsing error '%error;'.`

- **Cause**: The input xml file is not well formed.

- **Recommendation**:  Correct the xml file to make it well formed.


## General Copy Activity Error

### Error code:  JreNotFound

- **Message**: `Java Runtime Environment cannot be found on the Self-hosted Integration Runtime machine. It is required for parsing or writing to Parquet/ORC files. Make sure Java Runtime Environment has been installed on the Self-hosted Integration Runtime machine.`

- **Cause**: The self-hosted integration runtime cannot find Java Runtime. The Java Runtime is required for reading particular source.

- **Recommendation**:  Check your integration runtime environment, the reference doc: https://docs.microsoft.com/azure/data-factory/format-parquet#using-self-hosted-integration-runtime


### Error code:  WildcardPathSinkNotSupported

- **Message**: `Wildcard in path is not supported in sink dataset. Fix the path: '%setting;'.`

- **Cause**: Sink dataset doesn't support wildcard.

- **Recommendation**:  Check the sink dataset and fix the path without wildcard value.


### FIPS issue

- **Symptoms**: Copy activity fails on FIPS-enabled Self-hosted Integration Runtime machine with error message `This implementation is not part of the Windows Platform FIPS validated cryptographic algorithms.`. This may happen when copying data with connectors like Azure Blob, SFTP, etc.

- **Cause**: FIPS (Federal Information Processing Standards) defines a certain set of cryptographic algorithms that are allowed to be used. When FIPS mode is enabled on the machine, some cryptographic classes that copy activity depends on are blocked in some scenarios.

- **Resolution**: You can learn about the current situation of FIPS mode in Windows from [this article](https://techcommunity.microsoft.com/t5/microsoft-security-baselines/why-we-8217-re-not-recommending-8220-fips-mode-8221-anymore/ba-p/701037), and evaluate if you can disable FIPS on the Self-hosted Integration Runtime machine.

    On the other hand, if you just want to let Azure Data Factory bypass FIPS and make the activity runs succeeded, you can follow these steps:

    1. Open the folder where Self-hosted Integration Runtime is installed, usually under `C:\Program Files\Microsoft Integration Runtime\<IR version>\Shared`.

    2. Open "diawp.exe.config", add `<enforceFIPSPolicy enabled="false"/>` into the `<runtime>` section like the following.

        ![Disable FIPS](./media/connector-troubleshoot-guide/disable-fips-policy.png)

    3. Restart the Self-hosted Integration Runtime machine.


## Next steps

For more troubleshooting help, try these resources:

*  [Data Factory blog](https://azure.microsoft.com/blog/tag/azure-data-factory/)
*  [Data Factory feature requests](https://feedback.azure.com/forums/270578-data-factory)
*  [Azure videos](https://azure.microsoft.com/resources/videos/index/?sort=newest&services=data-factory)
*  [Microsoft Q&A question page](/answers/topics/azure-data-factory.html)
*  [Stack Overflow forum for Data Factory](https://stackoverflow.com/questions/tagged/azure-data-factory)
*  [Twitter information about Data Factory](https://twitter.com/hashtag/DataFactory)

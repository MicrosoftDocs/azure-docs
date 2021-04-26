---
title: Troubleshoot Azure Data Factory connectors
description: Learn how to troubleshoot connector issues in Azure Data Factory. 
author: linda33wj
ms.service: data-factory
ms.topic: troubleshooting
ms.date: 04/13/2021
ms.author: jingwang
ms.custom: has-adal-ref
---

# Troubleshoot Azure Data Factory connectors

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article explores common ways to troubleshoot problems with Azure Data Factory connectors.

## Azure Blob Storage

### Error code: AzureBlobOperationFailed

- **Message**: "Blob operation Failed. ContainerName: %containerName;, path: %path;."

- **Cause**: A problem with the Blob Storage operation.

- **Recommendation**:  To check the error details, see [Blob Storage error codes](/rest/api/storageservices/blob-service-error-codes). For further help, contact the Blob Storage team.


### Invalid property during copy activity

- **Message**: `Copy activity \<Activity Name> has an invalid "source" property. The source type is not compatible with the dataset \<Dataset Name> and its linked service \<Linked Service Name>. Please verify your input against.`

- **Cause**: The type defined in the dataset is inconsistent with the source or sink type that's defined in the copy activity.

- **Resolution**: Edit the dataset or pipeline JSON definition to make the types consistent, and then rerun the deployment.


## Azure Cosmos DB

### Error message: Request size is too large

- **Symptoms**: When you copy data into Azure Cosmos DB with a default write batch size, you receive the following error: `Request size is too large.`

- **Cause**: Azure Cosmos DB limits the size of a single request to 2 MB. The formula is *request size = single document size \* write batch size*. If your document size is large, the default behavior will result in a request size that's too large. You can tune the write batch size.

- **Resolution**: In the copy activity sink, reduce the *write batch size* value (the default value is 10000).

### Error message: Unique index constraint violation

- **Symptoms**: When you copy data into Azure Cosmos DB, you receive the following error:

    `Message=Partition range id 0 | Failed to import mini-batch. 
    Exception was Message: {"Errors":["Encountered exception while executing function. Exception = Error: {\"Errors\":[\"Unique index constraint violation.\"]}...`

- **Cause**: There are two possible causes:

    - Cause 1: If you use **Insert** as the write behavior, this error means that your source data has rows or objects with same ID.
    - Cause 2: If you use **Upsert** as the write behavior and you set another unique key to the container, this error means that your source data has rows or objects with different IDs but the same value for the defined unique key.

- **Resolution**: 

    - For cause 1, set **Upsert** as the write behavior.
    - For cause 2, make sure that each document has a different value for the defined unique key.

### Error message: Request rate is large

- **Symptoms**: When you copy data into Azure Cosmos DB, you receive the following error:

    `Type=Microsoft.Azure.Documents.DocumentClientException,
    Message=Message: {"Errors":["Request rate is large"]}`

- **Cause**: The number of used request units (RUs) is greater than the available RUs configured in Azure Cosmos DB. To learn how
Azure Cosmos DB calculates RUs, see [Request units in Azure Cosmos DB](../cosmos-db/request-units.md#request-unit-considerations).

- **Resolution**: Try either of the following two solutions:

    - Increase the *container RUs* number to a greater value in Azure Cosmos DB. This solution will improve the copy activity performance, but it will incur more cost in Azure Cosmos DB. 
    - Decrease *writeBatchSize* to a lesser value, such as 1000, and decrease *parallelCopies* to a lesser value, such as 1. This solution will reduce copy run performance, but it won't incur more cost in Azure Cosmos DB.

### Columns missing in column mapping

- **Symptoms**: When you import a schema for Azure Cosmos DB for column mapping, some columns are missing. 

- **Cause**: Data Factory infers the schema from the first 10 Azure Cosmos DB documents. If some document columns or properties don't contain values, the schema isn't detected by Data Factory and consequently isn't displayed.

- **Resolution**: You can tune the query as shown in the following code to force the column values to be displayed in the result set with empty values. Assume that the *impossible* column is missing in the first 10 documents). Alternatively, you can manually add the column for mapping.

    ```sql
    select c.company, c.category, c.comments, (c.impossible??'') as impossible from c
    ```

### Error message: The GuidRepresentation for the reader is CSharpLegacy

- **Symptoms**: When you copy data from Azure Cosmos DB MongoAPI or MongoDB with the universally unique identifier (UUID) field, you receive the following error:

    `Failed to read data via MongoDB client., 
    Source=Microsoft.DataTransfer.Runtime.MongoDbV2Connector,Type=System.FormatException, 
    Message=The GuidRepresentation for the reader is CSharpLegacy which requires the binary sub type to be UuidLegacy not UuidStandard.,Source=MongoDB.Bson,’“,`

- **Cause**: There are two ways to represent the UUID in Binary JSON (BSON): UuidStardard and UuidLegacy. By default, UuidLegacy is used to read data. You will receive an error if your UUID data in MongoDB is UuidStandard.

- **Resolution**: In the MongoDB connection string, add the *uuidRepresentation=standard* option. For more information, see [MongoDB connection string](connector-mongodb.md#linked-service-properties).
			
## Azure Cosmos DB (SQL API)

### Error code: CosmosDbSqlApiOperationFailed

- **Message**: `CosmosDbSqlApi operation Failed. ErrorMessage: %msg;.`

- **Cause**: A problem with the CosmosDbSqlApi operation.

- **Recommendation**:  To check the error details, see [Azure Cosmos DB help document](../cosmos-db/troubleshoot-dot-net-sdk.md). For further help, contact the Azure Cosmos DB team.

## Azure Data Lake Storage Gen1

### Error message: The underlying connection was closed: Could not establish trust relationship for the SSL/TLS secure channel.

- **Symptoms**: Copy activity fails with the following error: 

    `Message: ErrorCode = UserErrorFailedFileOperation, Error Message = The underlying connection was closed: Could not establish trust relationship for the SSL/TLS secure channel.`

- **Cause**: The certificate validation failed during the TLS handshake.

- **Resolution**: As a workaround, use the staged copy to skip the Transport Layer Security (TLS) validation for Azure Data Lake Storage Gen1. You need to reproduce this issue and gather the network monitor (netmon) trace, and then engage your network team to check the local network configuration.

    ![Diagram of Azure Data Lake Storage Gen1 connections for troubleshooting issues.](./media/connector-troubleshoot-guide/adls-troubleshoot.png)


### Error message: The remote server returned an error: (403) Forbidden

- **Symptoms**: Copy activity fail with the following error: 

   `Message: The remote server returned an error: (403) Forbidden.   
    Response details: {"RemoteException":{"exception":"AccessControlException""message":"CREATE failed with error 0x83090aa2 (Forbidden. ACL verification failed. Either the resource does not exist or the user is not authorized to perform the requested operation.)....`

- **Cause**: One possible cause is that the service principal or managed identity you use doesn't have permission to access certain folders or files.

- **Resolution**: Grant appropriate permissions to all the folders and subfolders you need to copy. For more information, see [Copy data to or from Azure Data Lake Storage Gen1 using Azure Data Factory](connector-azure-data-lake-store.md#linked-service-properties).

### Error message: Failed to get access token by using service principal. ADAL Error: service_unavailable

- **Symptoms**: Copy activity fails with the following error:

    `Failed to get access token by using service principal.  
    ADAL Error: service_unavailable, The remote server returned an error: (503) Server Unavailable.`

- **Cause**: When the Service Token Server (STS) that's owned by Azure Active Directory is not available, that means it's too busy to handle requests, and it returns HTTP error 503. 

- **Resolution**: Rerun the copy activity after several minutes.


## Azure Data Lake Storage Gen2

### Error code: ADLSGen2OperationFailed

- **Message**: `ADLS Gen2 operation failed for: %adlsGen2Message;.%exceptionData;.`

- **Causes and recommendations**: Different causes may lead to this error. Check below list for possible cause analysis and related recommendation.

  | Cause analysis                                               | Recommendation                                               |
  | :----------------------------------------------------------- | :----------------------------------------------------------- |
  | If Azure Data Lake Storage Gen2 throws error indicating some operation failed.| Check the detailed error message thrown by Azure Data Lake Storage Gen2. If the error is a transient failure, retry the operation. For further help, contact Azure Storage support, and provide the request ID in error message. |
  | If the error message contains the string "Forbidden", the service principal or managed identity you use might not have sufficient permission to access Azure Data Lake Storage Gen2. | To troubleshoot this error, see [Copy and transform data in Azure Data Lake Storage Gen2 by using Azure Data Factory](./connector-azure-data-lake-storage.md#service-principal-authentication). |
  | If the error message contains the string "InternalServerError", the error is returned by Azure Data Lake Storage Gen2. | The error might be caused by a transient failure. If so, retry the operation. If the issue persists, contact Azure Storage support and provide the request ID from the error message. |

### Request to Azure Data Lake Storage Gen2 account caused a timeout error

- **Message**: 
  * Error Code = `UserErrorFailedBlobFSOperation`
  * Error Message = `BlobFS operation failed for: A task was canceled.`

- **Cause**: The issue is caused by the Azure Data Lake Storage Gen2 sink timeout error, which usually occurs on the Self-hosted Integration Runtime (IR) machine.

- **Recommendation**: 

    - Place your Self-hosted IR machine and target Azure Data Lake Storage Gen2 account in the same region, if possible. This can help avoid a random timeout error and produce better performance.

    - Check whether there's a special network setting, such as ExpressRoute, and ensure that the network has enough bandwidth. We suggest that you lower the Self-hosted IR concurrent jobs setting when the overall bandwidth is low. Doing so can help avoid network resource competition across multiple concurrent jobs.

    - If the file size is moderate or small, use a smaller block size for nonbinary copy to mitigate such a timeout error. For more information, see [Blob Storage Put Block](/rest/api/storageservices/put-block).

       To specify the custom block size, edit the property in your JSON file editor as shown here:
    
        ```
        "sink": {
            "type": "DelimitedTextSink",
            "storeSettings": {
                "type": "AzureBlobFSWriteSettings",
                "blockSizeInMB": 8
            }
        }
        ```

		​	      
## Azure Files storage

### Error code: AzureFileOperationFailed

- **Message**: `Azure File operation Failed. Path: %path;. ErrorMessage: %msg;.`

- **Cause**: A problem with the Azure Files storage operation.

- **Recommendation**:  To check the error details, see [Azure Files help](/rest/api/storageservices/file-service-error-codes). For further help, contact the Azure Files team.


## Azure Synapse Analytics, Azure SQL Database, and SQL Server

### Error code: SqlFailedToConnect

- **Message**: `Cannot connect to SQL Database: '%server;', Database: '%database;', User: '%user;'. Check the linked service configuration is correct, and make sure the SQL Database firewall allows the integration runtime to access.`
- **Causes and recommendations**: Different causes may lead to this error. Check below list for possible cause analysis and related recommendation.

    | Cause analysis                                               | Recommendation                                               |
    | :----------------------------------------------------------- | :----------------------------------------------------------- |
    | For Azure SQL, if the error message contains the string "SqlErrorNumber=47073", it means that public network access is denied in the connectivity setting. | On the Azure SQL firewall, set the **Deny public network access** option to *No*. For more information, see [Azure SQL connectivity settings](../azure-sql/database/connectivity-settings.md#deny-public-network-access). |
    | For Azure SQL, if the error message contains an SQL error code such as "SqlErrorNumber=[errorcode]", see the Azure SQL troubleshooting guide. | For a recommendation, see [Troubleshoot connectivity issues and other errors with Azure SQL Database and Azure SQL Managed Instance](../azure-sql/database/troubleshoot-common-errors-issues.md). |
    | Check to see whether port 1433 is in the firewall allow list. | For more information, see [Ports used by SQL Server](/sql/sql-server/install/configure-the-windows-firewall-to-allow-sql-server-access#ports-used-by-). |
    | If the error message contains the string "SqlException", SQL Database the error indicates that some specific operation failed. | For more information, search by SQL error code in [Database engine errors](/sql/relational-databases/errors-events/database-engine-events-and-errors). For further help, contact Azure SQL support. |
    | If this is a transient issue (for example, an instable network connection), add retry in the activity policy to mitigate. | For more information, see [Pipelines and activities in Azure Data Factory](./concepts-pipelines-activities.md#activity-policy). |
    | If the error message contains the string "Client with IP address '...' is not allowed to access the server", and you're trying to connect to Azure SQL Database, the error is usually caused by an Azure SQL Database firewall issue. | In the Azure SQL Server firewall configuration, enable the **Allow Azure services and resources to access this server** option. For more information, see [Azure SQL Database and Azure Synapse IP firewall rules](../azure-sql/database/firewall-configure.md). |
    
### Error code: SqlOperationFailed

- **Message**: `A database operation failed. Please search error to get more details.`

- **Causes and recommendations**: Different causes may lead to this error. Check below list for possible cause analysis and related recommendation.

    | Cause analysis                                               | Recommendation                                               |
    | :----------------------------------------------------------- | :----------------------------------------------------------- |
    | If the error message contains the string "SqlException", SQL Database throws an error indicating some specific operation failed. | If the SQL error is not clear, try to alter the database to the latest compatibility level '150'. It can throw the latest version SQL errors. For more information, see the [documentation](/sql/t-sql/statements/alter-database-transact-sql-compatibility-level#backwardCompat). <br/> For more information about troubleshooting SQL issues, search by SQL error code in [Database engine errors](/sql/relational-databases/errors-events/database-engine-events-and-errors). For further help, contact Azure SQL support. |
    | If the error message contains the string "PdwManagedToNativeInteropException", it's usually caused by a mismatch between the source and sink column sizes. | Check the size of both the source and sink columns. For further help, contact Azure SQL support. |
    | If the error message contains the string "InvalidOperationException", it's usually caused by invalid input data. | To identify which row has encountered the problem, enable the fault tolerance feature on the copy activity, which can redirect problematic rows to the storage for further investigation. For more information, see [Fault tolerance of copy activity in Azure Data Factory](./copy-activity-fault-tolerance.md). |


### Error code: SqlUnauthorizedAccess

- **Message**: `Cannot connect to '%connectorName;'. Detail Message: '%message;'`

- **Cause**: The credentials are incorrect or the login account can't access the SQL database.

- **Recommendation**:  Check to ensure that the login account has sufficient permissions to access the SQL database.


### Error code: SqlOpenConnectionTimeout

- **Message**: `Open connection to database timeout after '%timeoutValue;' seconds.`

- **Cause**: The problem could be a SQL database transient failure.

- **Recommendation**:  Retry the operation to update the linked service connection string with a larger connection timeout value.


### Error code: SqlAutoCreateTableTypeMapFailed

- **Message**: `Type '%dataType;' in source side cannot be mapped to a type that supported by sink side(column name:'%columnName;') in autocreate table.`

- **Cause**: The autocreation table can't meet the source requirement.

- **Recommendation**:  Update the column type in *mappings*, or manually create the sink table in the target server.


### Error code: SqlDataTypeNotSupported

- **Message**: `A database operation failed. Check the SQL errors.`

- **Cause**: If the issue occurs in the SQL source and the error is related to SqlDateTime overflow, the data value exceeds the logic type range (1/1/1753 12:00:00 AM - 12/31/9999 11:59:59 PM).

- **Recommendation**:  Cast the type to the string in the source SQL query or, in the copy activity column mapping, change the column type to *String*.

- **Cause**: If the issue occurs on the SQL sink and the error is related to SqlDateTime overflow, the data value exceeds the allowed range in the sink table.

- **Recommendation**:  Update the corresponding column type to the *datetime2* type in the sink table.


### Error code: SqlInvalidDbStoredProcedure

- **Message**: `The specified Stored Procedure is not valid. It could be caused by that the stored procedure doesn't return any data. Invalid Stored Procedure script: '%scriptName;'.`

- **Cause**: The specified stored procedure is invalid. The cause might be that the stored procedure doesn't return any data.

- **Recommendation**:  Validate the stored procedure by using SQL Tools. Make sure that the stored procedure can return data.


### Error code: SqlInvalidDbQueryString

- **Message**: `The specified SQL Query is not valid. It could be caused by that the query doesn't return any data. Invalid query: '%query;'`

- **Cause**: The specified SQL query is invalid. The cause might be that the query doesn't return any data.

- **Recommendation**:  Validate the SQL query by using SQL Tools. Make sure that the query can return data.


### Error code: SqlInvalidColumnName

- **Message**: `Column '%column;' does not exist in the table '%tableName;', ServerName: '%serverName;', DatabaseName: '%dbName;'.`

- **Cause**: The column can't be found because the configuration might be incorrect.

- **Recommendation**:  Verify the column in the query, *structure* in the dataset, and *mappings* in the activity.


### Error code: SqlBatchWriteTimeout

- **Message**: `Timeouts in SQL write operation.`

- **Cause**: The problem could be caused by a SQL database transient failure.

- **Recommendation**:  Retry the operation. If the problem persists, contact Azure SQL support.


### Error code: SqlBatchWriteTransactionFailed

- **Message**: `SQL transaction commits failed.`

- **Cause**: If exception details constantly indicate a transaction timeout, the network latency between the integration runtime and the database is greater than the default threshold of 30 seconds.

- **Recommendation**:  Update the SQL-linked service connection string with a *connection timeout* value that's equal to or greater than 120 and rerun the activity.

- **Cause**: If the exception details intermittently indicate that the SQL connection is broken, it might be a transient network failure or a SQL database side issue.

- **Recommendation**:  Retry the activity and review the SQL database side metrics.


### Error code: SqlBulkCopyInvalidColumnLength

- **Message**: `SQL Bulk Copy failed due to receive an invalid column length from the bcp client.`

- **Cause**: SQL Bulk Copy failed because it received an invalid column length from the bulk copy program utility (bcp) client.

- **Recommendation**:  To identify which row has encountered the problem, enable the fault tolerance feature on the copy activity. This can redirect problematic rows to the storage for further investigation. For more information, see [Fault tolerance of copy activity in Azure Data Factory](./copy-activity-fault-tolerance.md).


### Error code: SqlConnectionIsClosed

- **Message**: `The connection is closed by SQL Database.`

- **Cause**: The SQL connection is closed by the SQL database when a high concurrent run and the server terminate the connection.

- **Recommendation**:  Retry the connection. If the problem persists, contact Azure SQL support.


### Error message: Conversion failed when converting from a character string to uniqueidentifier

- **Symptoms**: When you copy data from a tabular data source (such as SQL Server) into Azure Synapse Analytics using staged copy and PolyBase, you receive the following error:

   `ErrorCode=FailedDbOperation,Type=Microsoft.DataTransfer.Common.Shared.HybridDeliveryException, 
    Message=Error happened when loading data into Azure Synapse Analytics., 
    Source=Microsoft.DataTransfer.ClientLibrary,Type=System.Data.SqlClient.SqlException, 
    Message=Conversion failed when converting from a character string to uniqueidentifier...`

- **Cause**: Azure Synapse Analytics PolyBase can't convert an empty string to a GUID.

- **Resolution**: In the copy activity sink, under PolyBase settings, set the **use type default** option to *false*.


### Error message: Expected data type: DECIMAL(x,x), Offending value

- **Symptoms**: When you copy data from a tabular data source (such as SQL Server) into Azure Synapse Analytics by using staged copy and PolyBase, you receive the following error:

    `ErrorCode=FailedDbOperation,Type=Microsoft.DataTransfer.Common.Shared.HybridDeliveryException, 
    Message=Error happened when loading data into Azure Synapse Analytics., 
    Source=Microsoft.DataTransfer.ClientLibrary,Type=System.Data.SqlClient.SqlException, 
    Message=Query aborted-- the maximum reject threshold (0 rows) was reached while reading from an external source: 1 rows rejected out of total 415 rows processed. (/file_name.txt)  
    Column ordinal: 18, Expected data type: DECIMAL(x,x), Offending value:..`

- **Cause**: Azure Synapse Analytics PolyBase can't insert an empty string (null value) into a decimal column.

- **Resolution**: In the copy activity sink, under PolyBase settings, set the **use type default** option to false.


### Error message: Java exception message: HdfsBridge::CreateRecordReader

- **Symptoms**: You copy data into Azure Synapse Analytics by using PolyBase and receive the following error:

    `Message=110802;An internal DMS error occurred that caused this operation to fail.  
    Details: Exception: Microsoft.SqlServer.DataWarehouse.DataMovement.Common.ExternalAccess.HdfsAccessException, 
    Message: Java exception raised on call to HdfsBridge_CreateRecordReader.  
    Java exception message:HdfsBridge::CreateRecordReader - Unexpected error encountered creating the record reader.: Error [HdfsBridge::CreateRecordReader - Unexpected error encountered creating the record reader.] occurred while accessing external file.....`

- **Cause**: The cause might be that the schema (total column width) is too large (larger than 1 MB). Check the schema of the target Azure Synapse Analytics table by adding the size of all columns:

    - Int = 4 bytes
    - Bigint = 8 bytes
    - Varchar(n), char(n), binary(n), varbinary(n) = n bytes
    - Nvarchar(n), nchar(n) = n*2 bytes
    - Date = 6 bytes
    - Datetime/(2), smalldatetime = 16 bytes
    - Datetimeoffset = 20 bytes
    - Decimal = 19 bytes
    - Float = 8 bytes
    - Money = 8 bytes
    - Smallmoney = 4 bytes
    - Real = 4 bytes
    - Smallint = 2 bytes
    - Time = 12 bytes
    - Tinyint = 1 byte

- **Resolution**: 
    - Reduce column width to less than 1 MB.
    - Or use a bulk insert approach by disabling PolyBase.


### Error message: The condition specified using HTTP conditional header(s) is not met

- **Symptoms**: You use SQL query to pull data from Azure Synapse Analytics and receive the following error:

    `...StorageException: The condition specified using HTTP conditional header(s) is not met...`

- **Cause**: Azure Synapse Analytics encountered an issue while querying the external table in Azure Storage.

- **Resolution**: Run the same query in SQL Server Management Studio (SSMS) and check to see whether you get the same result. If you do, open a support ticket to Azure Synapse Analytics and provide your Azure Synapse Analytics server and database name.


### Performance tier is low and leads to copy failure

- **Symptoms**: You copy data into Azure SQL Database and receive the following error: `Database operation failed. Error message from database execution : ExecuteNonQuery requires an open and available Connection. The connection's current state is closed.`

- **Cause**: Azure SQL Database s1 has hit input/output (I/O) limits.

- **Resolution**: Upgrade the Azure SQL Database performance tier to fix the issue. 


### SQL table can't be found 

- **Symptoms**: You copy data from hybrid into an on-premises SQL Server table and receive the following error：`Cannot find the object "dbo.Contoso" because it does not exist or you do not have permissions.`

- **Cause**: The current SQL account doesn't have sufficient permissions to execute requests issued by .NET SqlBulkCopy.WriteToServer.

- **Resolution**: Switch to a more privileged SQL account.


### Error message: String or binary data is truncated

- **Symptoms**: An error occurs when you copy data into an on-premises Azure SQL Server table. 

- **Cause**: The Cx SQL table schema definition has one or more columns with less length than expected.

- **Resolution**: To resolve the issue, try the following:

    1. To troubleshoot which rows have the issue, apply SQL sink [fault tolerance](./copy-activity-fault-tolerance.md), especially "redirectIncompatibleRowSettings."

    	> [!NOTE]
    	> Fault tolerance might require additional execution time, which could lead to higher costs.

    2. Double-check the redirected data against the SQL table schema column length to see which columns need to be updated.

    3. Update the table schema accordingly.


## Azure Table Storage

### Error code: AzureTableDuplicateColumnsFromSource

- **Message**: `Duplicate columns with same name '%name;' are detected from source. This is NOT supported by Azure Table Storage sink.`

- **Cause**: Duplicated source columns might occur for one of the following reasons:
   * You're using the database as a source and applied table joins.
   * You have unstructured CSV files with duplicated column names in the header row.

- **Recommendation**:  Double-check and fix the source columns, as necessary.


## DB2

### Error code: DB2DriverRunFailed

- **Message**: `Error thrown from driver. Sql code: '%code;'`

- **Cause**: If the error message contains the string "SQLSTATE=51002 SQLCODE=-805", follow the "Tip" in [Copy data from DB2 by using Azure Data Factory](./connector-db2.md#linked-service-properties).

- **Recommendation**:  Try to set "NULLID" in the `packageCollection`  property.


## Delimited text format

### Error code: DelimitedTextColumnNameNotAllowNull

- **Message**: `The name of column index %index; is empty. Make sure column name is properly specified in the header row.`

- **Cause**: When 'firstRowAsHeader' is set in the activity, the first row is used as the column name. This error means that the first row contains an empty value (for example, 'ColumnA, ColumnB').

- **Recommendation**:  Check the first row, and fix the value if it is empty.


### Error code: DelimitedTextMoreColumnsThanDefined

- **Message**: `Error found when processing '%function;' source '%name;' with row number %rowCount;: found more columns than expected column count: %expectedColumnCount;.`

- **Causes and recommendations**: Different causes may lead to this error. Check below list for possible cause analysis and related recommendation.

  | Cause analysis                                               | Recommendation                                               |
  | :----------------------------------------------------------- | :----------------------------------------------------------- |
  | The problematic row's column count is larger than the first row's column count. It might be caused by a data issue or incorrect column delimiter or quote char settings. | Get the row count from the error message, check the row's column, and fix the data. |
  | If the expected column count is "1" in an error message, you might have specified wrong compression or format settings, which caused Data Factory to parse your files incorrectly. | Check the format settings to make sure they match your source files. |
  | If your source is a folder, the files under the specified folder might have a different schema. | Make sure that the files in the specified folder have an identical schema. |


## Dynamics 365, Common Data Service, and Dynamics CRM

### Error code: DynamicsCreateServiceClientError

- **Message**: `This is a transient issue on Dynamics server side. Try to rerun the pipeline.`

- **Cause**: The problem is a transient issue on the Dynamics server side.

- **Recommendation**:  Rerun the pipeline. If it fails again, try to reduce the parallelism. If the problem persists, contact Dynamics support.


### Missing columns when you import a schema or preview data

- **Symptoms**: Some columns are missing when you import a schema or preview data. Error message: `The valid structure information (column name and type) are required for Dynamics source.`

- **Cause**: This issue is by design, because Data Factory is unable to show columns that contain no values in the first 10 records. Make sure that the columns you've added are in the correct format. 

- **Recommendation**: Manually add the columns in the mapping tab.


### Error code: DynamicsMissingTargetForMultiTargetLookupField

- **Message**: `Cannot find the target column for multi-target lookup field: '%fieldName;'.`

- **Cause**: The target column doesn't exist in the source or in the column mapping.

- **Recommendation**:  
  1. Make sure that the source contains the target column. 
  2. Add the target column in the column mapping. Ensure that the sink column is in the format *{fieldName}@EntityReference*.


### Error code: DynamicsInvalidTargetForMultiTargetLookupField

- **Message**: `The provided target: '%targetName;' is not a valid target of field: '%fieldName;'. Valid targets are: '%validTargetNames;'`

- **Cause**: A wrong entity name is provided as target entity of a multi-target lookup field.

- **Recommendation**:  Provide a valid entity name for the multi-target lookup field.


### Error code: DynamicsInvalidTypeForMultiTargetLookupField

- **Message**: `The provided target type is not a valid string. Field: '%fieldName;'.`

- **Cause**: The value in the target column is not a string.

- **Recommendation**:  Provide a valid string in the multi-target lookup target column.


### Error code: DynamicsFailedToRequetServer

- **Message**: `The Dynamics server or the network is experiencing issues. Check network connectivity or check Dynamics server log for more details.`

- **Cause**: The Dynamics server is instable or inaccessible, or the network is experiencing issues.

- **Recommendation**:  For more details, check network connectivity or check the Dynamics server log. For further help, contact Dynamics support.


### Error code:  DynamicsFailedToConnect 
 
 - **Message**: `Failed to connect to Dynamics: %message;` 
 

 - **Cause**: If you see `Office 365 auth with OAuth failed` in the error message, it means that your server might have some configurations not compatible with OAuth. 
 
 - **Recommendation**: 
    1. Contact Dynamics support team with the detailed error message for help.  
    1. Use the service principal authentication, and you can refer to this article: [Example: Dynamics online using Azure AD service-principal and certificate authentication](https://docs.microsoft.com/azure/data-factory/connector-dynamics-crm-office-365#example-dynamics-online-using-azure-ad-service-principal-and-certificate-authentication). 
 

 - **Cause**: If you see `Unable to retrieve authentication parameters from the serviceUri` in the error message, it means that either you input the wrong Dynamics service URL or proxy/firewall to intercept the traffic. 
 
 - **Recommendation**:
    1. Make sure you have put the correct service URI in the linked service. 
    1. If you use the Self Hosted IR, make sure that the firewall/proxy does not intercept the requests to the Dynamics server. 
   
 
 - **Cause**: If you see `An unsecured or incorrectly secured fault was received from the other party` in the error message, it means that unexpected responses were gotten from the server side. 
 
 - **Recommendation**: 
    1. Make sure your username and password are correct if you use the Office 365 authentication. 
    1. Make sure you have input the correct service URI. 
    1. If you use regional CRM URL (URL has a number after 'crm'), make sure you use the correct regional identifier.
    1. Contact the Dynamics support team for help. 
 

 - **Cause**: If you see `No Organizations Found` in the error message, it means that either your organization name is wrong or you used a wrong CRM region identifier in the service URL. 
 
 - **Recommendation**: 
    1. Make sure you have input the correct service URI.
    1. If you use the regional CRM URL (URL has a number after 'crm'), make sure that you use the correct regional identifier. 
    1. Contact the Dynamics support team for help. 

 
 - **Cause**: If you see `401 Unauthorized` and AAD-related error message, it means that there's an issue with the service principal. 

 - **Recommendation**: Follow the guidance in the error message to fix the service principal issue.  
 
 
 - **Cause**: For other errors, usually the issue is on the server side. 

 - **Recommendation**:  Use [XrmToolBox](https://www.xrmtoolbox.com/) to make connection. If the error persists, contact the Dynamics support team for help. 
 
 
### Error code:  DynamicsOperationFailed 
 
- **Message**: `Dynamics operation failed with error code: %code;, error message: %message;.` 

- **Cause**: The operation failed on the server side. 

- **Recommendation**:  Extract the error code of the dynamics operation from the error message: `Dynamics operation failed with error code: {code}`, and refer to the article [Web service error codes](https://docs.microsoft.com/powerapps/developer/data-platform/org-service/web-service-error-codes) for more detailed information. You can contact the Dynamics support team if necessary. 
 
 
### Error code:  DynamicsInvalidFetchXml 
  
- **Message**: `The Fetch Xml query specified is invalid.` 

- **Cause**:  There is an error existed in the fetch XML.  

- **Recommendation**:  Fix the error in the fetch XML. 
 
 
### Error code:  DynamicsMissingKeyColumns 
 
- **Message**: `Input DataSet must contain keycolumn(s) in Upsert/Update scenario. Missing key column(s): %column;`
 
- **Cause**: The source data does not contain the key column for the sink entity. 

- **Recommendation**:  Confirm that key columns are in the source data or map a source column to the key column on the sink entity. 
 
 
### Error code:  DynamicsPrimaryKeyMustBeGuid 
 
- **Message**: `The primary key attribute '%attribute;' must be of type guid.` 
 
- **Cause**: The type of the primary key column is not 'Guid'. 
 
- **Recommendation**:  Make sure that the primary key column in the source data is of 'Guid' type. 
 

### Error code:  DynamicsAlternateKeyNotFound 
 
- **Message**: `Cannot retrieve key information of alternate key '%key;' for entity '%entity;'.` 
 
- **Cause**: The provided alternate key does not exist, which may be caused by wrong key names or insufficient permissions. 
 
- **Recommendation**: <br/> 
    1. Fix typos in the key name.<br/> 
    1. Make sure that you have sufficient permissions on the entity. 
 
 
### Error code:  DynamicsInvalidSchemaDefinition 
 
- **Message**: `The valid structure information (column name and type) are required for Dynamics source.` 
 
- **Cause**: Sink columns in the column mapping miss the 'type' property. 
 
- **Recommendation**: You can add the 'type' property to those columns in the column mapping by using JSON editor on the portal. 


## FTP

### Error code: FtpFailedToConnectToFtpServer

- **Message**: `Failed to connect to FTP server. Please make sure the provided server information is correct, and try again.`

- **Cause**: An incorrect linked service type might be used for the FTP server, such as using the Secure FTP (SFTP) linked service to connect to an FTP server.

- **Recommendation**:  Check the port of the target server. FTP uses port 21.


## HTTP

### Error code: HttpFileFailedToRead

- **Message**: `Failed to read data from http server. Check the error from http server：%message;`

- **Cause**: This error occurs when Azure Data Factory talks to the HTTP server, but the HTTP request operation fails.

- **Recommendation**:  Check the HTTP status code in the error message, and fix the remote server issue.


## Oracle

### Error code: ArgumentOutOfRangeException

- **Message**: `Hour, Minute, and Second parameters describe an un-representable DateTime.`

- **Cause**: In Data Factory, DateTime values are supported in the range from 0001-01-01 00:00:00 to 9999-12-31 23:59:59. However, Oracle supports a wider range of DateTime values, such as the BC century or min/sec>59, which leads to failure in Data Factory.

- **Recommendation**: 

    To see whether the value in Oracle is in the range of Data Factory, run `select dump(<column name>)`. 

    To learn the byte sequence in the result, see [How are dates stored in Oracle?](https://stackoverflow.com/questions/13568193/how-are-dates-stored-in-oracle).


## ORC format

### Error code: OrcJavaInvocationException

- **Message**: `An error occurred when invoking Java, message: %javaException;.`
- **Causes and recommendations**: Different causes may lead to this error. Check below list for possible cause analysis and related recommendation.

    | Cause analysis                                               | Recommendation                                               |
    | :----------------------------------------------------------- | :----------------------------------------------------------- |
    | When the error message contains the strings "java.lang.OutOfMemory", "Java heap space", and "doubleCapacity", it's usually a memory management issue in an old version of integration runtime. | If you're using Self-hosted Integration Runtime, we recommend that you upgrade to the latest version. |
    | When the error message contains the string "java.lang.OutOfMemory", the integration runtime doesn't have enough resources to process the files. | Limit the concurrent runs on the integration runtime. For Self-hosted IR, scale up to a powerful machine with memory equal to or larger than 8 GB. |
    |When the error message contains the string "NullPointerReference", the cause might be a transient error. | Retry the operation. If the problem persists, contact support. |
    | When the error message contains the string "BufferOverflowException", the cause might be a transient error. | Retry the operation. If the problem persists, contact support. |
    | When the error message contains the string "java.lang.ClassCastException:org.apache.hadoop.hive.serde2.io.HiveCharWritable can't be cast to org.apache.hadoop.io.Text", the cause might be a type conversion issue inside Java Runtime. Usually, it means that the source data can't be handled well in Java Runtime. | This is a data issue. Try to use a string instead of char or varchar in ORC format data. |

### Error code: OrcDateTimeExceedLimit

- **Message**: `The Ticks value '%ticks;' for the datetime column must be between valid datetime ticks range -621355968000000000 and 2534022144000000000.`

- **Cause**: If the datetime value is '0001-01-01 00:00:00', it could be caused by the differences between the [Julian calendar and the Gregorian calendar](https://en.wikipedia.org/wiki/Proleptic_Gregorian_calendar#Difference_between_Julian_and_proleptic_Gregorian_calendar_dates).

- **Recommendation**:  Check the ticks value and avoid using the datetime value '0001-01-01 00:00:00'.


## Parquet format

### Error code: ParquetJavaInvocationException

- **Message**: `An error occurred when invoking java, message: %javaException;.`

- **Causes and recommendations**: Different causes may lead to this error. Check below list for possible cause analysis and related recommendation.

    | Cause analysis                                               | Recommendation                                               |
    | :----------------------------------------------------------- | :----------------------------------------------------------- |
    | When the error message contains the strings "java.lang.OutOfMemory", "Java heap space", and "doubleCapacity", it's usually a memory management issue in an old version of Integration Runtime. | If you are using Self-hosted IR and the version is earlier than 3.20.7159.1, we recommend that you upgrade to the latest version. |
    | When the error message contains the string "java.lang.OutOfMemory", the integration runtime doesn't have enough resources to process the files. | Limit the concurrent runs on the integration runtime. For Self-hosted IR, scale up to a powerful machine with memory that's equal to or greater than 8 GB. |
    | When the error message contains the string "NullPointerReference", it might be a transient error. | Retry the operation. If the problem persists, contact support. |

### Error code: ParquetInvalidFile

- **Message**: `File is not a valid Parquet file.`

- **Cause**: This is a Parquet file issue.

- **Recommendation**:  Check to see whether the input is a valid Parquet file.


### Error code: ParquetNotSupportedType

- **Message**: `Unsupported Parquet type. PrimitiveType: %primitiveType; OriginalType: %originalType;.`

- **Cause**: The Parquet format is not supported in Azure Data Factory.

- **Recommendation**:  Double-check the source data by going to [Supported file formats and compression codecs by copy activity in Azure Data Factory](./supported-file-formats-and-compression-codecs.md).


### Error code: ParquetMissedDecimalPrecisionScale

- **Message**: `Decimal Precision or Scale information is not found in schema for column: %column;.`

- **Cause**: The number precision and scale were parsed, but no such information was provided.

- **Recommendation**:  The source doesn't return the correct precision and scale information. Check the issue column for the information.


### Error code: ParquetInvalidDecimalPrecisionScale

- **Message**: `Invalid Decimal Precision or Scale. Precision: %precision; Scale: %scale;.`

- **Cause**: The schema is invalid.

- **Recommendation**:  Check the issue column for precision and scale.


### Error code: ParquetColumnNotFound

- **Message**: `Column %column; does not exist in Parquet file.`

- **Cause**: The source schema is a mismatch with the sink schema.

- **Recommendation**:  Check the mappings in the activity. Make sure that the source column can be mapped to the correct sink column.


### Error code: ParquetInvalidDataFormat

- **Message**: `Incorrect format of %srcValue; for converting to %dstType;.`

- **Cause**: The data can't be converted into the type that's specified in mappings.source.

- **Recommendation**:  Double-check the source data or specify the correct data type for this column in the copy activity column mapping. For more information, see [Supported file formats and compression codecs by copy activity in Azure Data Factory](./supported-file-formats-and-compression-codecs.md).


### Error code: ParquetDataCountNotMatchColumnCount

- **Message**: `The data count in a row '%sourceColumnCount;' does not match the column count '%sinkColumnCount;' in given schema.`

- **Cause**:  A mismatch between the source column count and the sink column count.

- **Recommendation**:  Double-check to ensure that the source column count is same as the sink column count in 'mapping'.


### Error code: ParquetDataTypeNotMatchColumnType

- **Message**: `The data type %srcType; is not match given column type %dstType; at column '%columnIndex;'.`

- **Cause**: The data from the source can't be converted to the type that's defined in the sink.

- **Recommendation**:  Specify a correct type in mapping.sink.


### Error code: ParquetBridgeInvalidData

- **Message**: `%message;`

- **Cause**: The data value has exceeded the limit.

- **Recommendation**:  Retry the operation. If the issue persists, contact us.


### Error code: ParquetUnsupportedInterpretation

- **Message**: `The given interpretation '%interpretation;' of Parquet format is not supported.`

- **Cause**: This scenario isn't supported.

- **Recommendation**:  'ParquetInterpretFor' should not be 'sparkSql'.


### Error code: ParquetUnsupportFileLevelCompressionOption

- **Message**: `File level compression is not supported for Parquet.`

- **Cause**: This scenario isn't supported.

- **Recommendation**:  Remove 'CompressionType' in the payload.


### Error code: UserErrorJniException

- **Message**: `Cannot create JVM: JNI return code [-6][JNI call failed: Invalid arguments.]`

- **Cause**: A Java Virtual Machine (JVM) can't be created because some illegal (global) arguments are set.

- **Recommendation**:  Log in to the machine that hosts *each node* of your self-hosted IR. Check to ensure that the system variable is set correctly, as follows: `_JAVA_OPTIONS "-Xms256m -Xmx16g" with memory bigger than 8 G`. Restart all the IR nodes, and then rerun the pipeline.


### Arithmetic overflow

- **Symptoms**: Error message occurred when you copy Parquet files: `Message = Arithmetic Overflow., Source = Microsoft.DataTransfer.Common`

- **Cause**: Currently only the decimal of precision <= 38 and length of integer part <= 20 are supported when you copy files from Oracle to Parquet. 

- **Resolution**: As a workaround, you can convert any columns with this problem into VARCHAR2.


### No enum constant

- **Symptoms**: Error message occurred when you copy data to Parquet format: `java.lang.IllegalArgumentException:field ended by &apos;;&apos;`, or: `java.lang.IllegalArgumentException:No enum constant org.apache.parquet.schema.OriginalType.test`.

- **Cause**: 

    The issue could be caused by white spaces or unsupported special characters (such as,;{}()\n\t=) in the column name, because Parquet doesn't support such a format. 

    For example, a column name such as *contoso(test)* will parse the type in brackets from [code](https://github.com/apache/parquet-mr/blob/master/parquet-column/src/main/java/org/apache/parquet/schema/MessageTypeParser.java) `Tokenizer st = new Tokenizer(schemaString, " ;{}()\n\t");`. The error is thrown because there is no such "test" type.

    To check supported types, go to the GitHub [apache/parquet-mr site](https://github.com/apache/parquet-mr/blob/master/parquet-column/src/main/java/org/apache/parquet/schema/OriginalType.java).

- **Resolution**: 

    Double-check to see whether:
    - There are white spaces in the sink column name.
    - The first row with white spaces is used as the column name.
    - The type OriginalType is supported. Try to avoid using these special characters: `,;{}()\n\t=`. 


## REST

### Error code: RestSinkCallFailed

- **Message**: `Rest Endpoint responded with Failure from server. Check the error from server:%message;`

- **Cause**: This error occurs when Azure Data Factory talks to the REST endpoint over HTTP protocol, and the request operation fails.

- **Recommendation**:  Check the HTTP status code or the message in the error message and fix the remote server issue.

### Unexpected network response from the REST connector

- **Symptoms**: The endpoint sometimes receives an unexpected response (400, 401, 403, 500) from the REST connector.

- **Cause**: The REST source connector uses the URL and HTTP method/header/body from the linked service/dataset/copy source as parameters when it constructs an HTTP request. The issue is most likely caused by some mistakes in one or more specified parameters.

- **Resolution**: 
    - Use 'curl' in a Command Prompt window to see whether the parameter is the cause (**Accept** and **User-Agent** headers should always be included):
    
      `curl -i -X <HTTP method> -H <HTTP header1> -H <HTTP header2> -H "Accept: application/json" -H "User-Agent: azure-data-factory/2.0" -d '<HTTP body>' <URL>`
      
      If the command returns the same unexpected response, fix the preceding parameters with 'curl' until it returns the expected response. 

      You can also use 'curl--help' for more advanced usage of the command.

    - If only the Data Factory REST connector returns an unexpected response, contact Microsoft support for further troubleshooting.
    
    - Note that 'curl' might not be suitable to reproduce an SSL certificate validation issue. In some scenarios, the 'curl' command was executed successfully without encountering any SSL certificate validation issues. But when the same URL is executed in a browser, no SSL certificate is actually returned for the client to establish trust with server.

      Tools like **Postman** and **Fiddler** are recommended for the preceding case.


## SFTP

#### Error code: SftpOperationFail

- **Message**: `Failed to '%operation;'. Check detailed error from SFTP.`

- **Cause**: A problem with the SFTP operation.

- **Recommendation**:  Check the error details from SFTP.


### Error code: SftpRenameOperationFail

- **Message**: `Failed to rename the temp file. Your SFTP server doesn't support renaming temp file, set "useTempFileRename" as false in copy sink to disable uploading to temp file.`

- **Cause**: Your SFTP server doesn't support renaming the temp file.

- **Recommendation**:  Set "useTempFileRename" as false in the copy sink to disable uploading to the temp file.


### Error code: SftpInvalidSftpCredential

- **Message**: `Invalid SFTP credential provided for '%type;' authentication type.`

- **Cause**: Private key content is fetched from the Azure key vault or SDK, but it's not encoded correctly.

- **Recommendation**:  

    If the private key content is from your key vault, the original key file can work if you upload it directly to the SFTP linked service.

    For more information, see [Copy data from and to the SFTP server by using Azure Data Factory](./connector-sftp.md#use-ssh-public-key-authentication). The private key content is base64 encoded SSH private key content.

    Encode *entire* original private key file with base64 encoding, and store the encoded string in your key vault. The original private key file is the one that can work on the SFTP linked service if you select **Upload** from the file.

    Here are some samples you can use to generate the string:

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

    - Use a third-party base64 conversion tool. We recommend the [Encode to Base64 format](https://www.base64encode.org/) tool.

- **Cause**: The wrong key content format was chosen.

- **Recommendation**:  

    PKCS#8 format SSH private key (start with "-----BEGIN ENCRYPTED PRIVATE KEY-----") is currently not supported to access the SFTP server in Data Factory. 

    To convert the key to traditional SSH key format, starting with "-----BEGIN RSA PRIVATE KEY-----", run the following commands:

    ```
    openssl pkcs8 -in pkcs8_format_key_file -out traditional_format_key_file
    chmod 600 traditional_format_key_file
    ssh-keygen -f traditional_format_key_file -p
    ```

- **Cause**: Invalid credentials or private key content.

- **Recommendation**:  To see whether your key file or password is correct, double-check with tools such as WinSCP.

### SFTP copy activity failed

- **Symptoms**: 
  * Error code: UserErrorInvalidColumnMappingColumnNotFound 
  * Error message: `Column 'AccMngr' specified in column mapping cannot be found in source data.`

- **Cause**: The source doesn't include a column named "AccMngr."

- **Resolution**: To determine whether the "AccMngr" column exists, double-check your dataset configuration by mapping the destination dataset column.


### Error code: SftpFailedToConnectToSftpServer

- **Message**: `Failed to connect to SFTP server '%server;'.`

- **Cause**: If the error message contains the string "Socket read operation has timed out after 30,000 milliseconds", one possible cause is that an incorrect linked service type is used for the SFTP server. For example, you might be using the FTP linked service to connect to the SFTP server.

- **Recommendation**:  Check the port of the target server. By default, SFTP uses port 22.

- **Cause**: If the error message contains the string "Server response does not contain SSH protocol identification", one possible cause is that the SFTP server throttled the connection. Data Factory will create multiple connections to download from the SFTP server in parallel, and sometimes it will encounter SFTP server throttling. Ordinarily, different servers return different errors when they encounter throttling.

- **Recommendation**:  

    Specify the maximum number of concurrent connections of the SFTP dataset as 1 and rerun the copy activity. If the activity succeeds, you can be sure that throttling is the cause.

    If you want to promote the low throughput, contact your SFTP administrator to increase the concurrent connection count limit, or you can do one of the following:

    * If you're using Self-hosted IR, add the Self-hosted IR machine's IP to the allow list.
    * If you're using Azure IR, add [Azure Integration Runtime IP addresses](./azure-integration-runtime-ip-addresses.md). If you don't want to add a range of IPs to the SFTP server allow list, use Self-hosted IR instead.

## SharePoint Online list

### Error code: SharePointOnlineAuthFailed

- **Message**: `The access token generated failed, status code: %code;, error message: %message;.`

- **Cause**: The service principal ID and key might not be set correctly.

- **Recommendation**:  Check your registered application (service principal ID) and key to see whether they're set correctly.


## XML format

### Error code: XmlSinkNotSupported

- **Message**: `Write data in XML format is not supported yet, choose a different format!`

- **Cause**: An XML dataset was used as a sink dataset in your copy activity.

- **Recommendation**:  Use a dataset in a different format from that of the sink dataset.


### Error code: XmlAttributeColumnNameConflict

- **Message**: `Column names %attrNames;' for attributes of element '%element;' conflict with that for corresponding child elements, and the attribute prefix used is '%prefix;'.`

- **Cause**: An attribute prefix was used, which caused the conflict.

- **Recommendation**:  Set a different value for the "attributePrefix" property.


### Error code: XmlValueColumnNameConflict

- **Message**: `Column name for the value of element '%element;' is '%columnName;' and it conflicts with the child element having the same name.`

- **Cause**: One of the child element names was used as the column name for the element value.

- **Recommendation**:  Set a different value for the "valueColumn" property.


### Error code: XmlInvalid

- **Message**: `Input XML file '%file;' is invalid with parsing error '%error;'.`

- **Cause**: The input XML file is not well formed.

- **Recommendation**:  Correct the XML file to make it well formed.


## General copy activity error

### Error code: JreNotFound

- **Message**: `Java Runtime Environment cannot be found on the Self-hosted Integration Runtime machine. It is required for parsing or writing to Parquet/ORC files. Make sure Java Runtime Environment has been installed on the Self-hosted Integration Runtime machine.`

- **Cause**: The self-hosted IR can't find Java Runtime. Java Runtime is required for reading particular sources.

- **Recommendation**:  Check your integration runtime environment, see [Use Self-hosted Integration Runtime](./format-parquet.md#using-self-hosted-integration-runtime).


### Error code: WildcardPathSinkNotSupported

- **Message**: `Wildcard in path is not supported in sink dataset. Fix the path: '%setting;'.`

- **Cause**: The sink dataset doesn't support wildcard values.

- **Recommendation**:  Check the sink dataset, and rewrite the path without using a wildcard value.


### FIPS issue

- **Symptoms**: Copy activity fails on a FIPS-enabled self-hosted IR machine with the following error message: `This implementation is not part of the Windows Platform FIPS validated cryptographic algorithms.` 

- **Cause**: This error might occur when you copy data with connectors such as Azure Blob, SFTP, and so on. Federal Information Processing Standards (FIPS) defines a certain set of cryptographic algorithms that are allowed to be used. When FIPS mode is enabled on the machine, some cryptographic classes that copy activity depends on are blocked in some scenarios.

- **Resolution**: Learn [why we’re not recommending “FIPS Mode” anymore](https://techcommunity.microsoft.com/t5/microsoft-security-baselines/why-we-8217-re-not-recommending-8220-fips-mode-8221-anymore/ba-p/701037), and evaluate whether you can disable FIPS on your self-hosted IR machine.

    Alternatively, if you only want to let Azure Data Factory bypass FIPS and make the activity runs succeed, do the following:

    1. Open the folder where Self-hosted IR is installed. The path is usually *C:\Program Files\Microsoft Integration Runtime \<IR version>\Shared*.

    2. Open the *diawp.exe.config* file and then, at the end of the `<runtime>` section, add `<enforceFIPSPolicy enabled="false"/>`, as shown here:

        ![Screenshot of a section of the diawp.exe.config file showing FIPS disabled.](./media/connector-troubleshoot-guide/disable-fips-policy.png)

    3. Save the file, and then restart the Self-hosted IR machine.


## Next steps

For more troubleshooting help, try these resources:

*  [Data Factory blog](https://azure.microsoft.com/blog/tag/azure-data-factory/)
*  [Data Factory feature requests](https://feedback.azure.com/forums/270578-data-factory)
*  [Azure videos](https://azure.microsoft.com/resources/videos/index/?sort=newest&services=data-factory)
*  [Microsoft Q&A page](/answers/topics/azure-data-factory.html)
*  [Stack Overflow forum for Data Factory](https://stackoverflow.com/questions/tagged/azure-data-factory)
*  [Twitter information about Data Factory](https://twitter.com/hashtag/DataFactory)
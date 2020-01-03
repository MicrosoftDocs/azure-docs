---
title: Troubleshoot Azure Data Factory Connectors
description: Learn how to troubleshoot connector issues in Azure Data Factory. 
services: data-factory
author: linda33wj
ms.service: data-factory
ms.topic: troubleshooting
ms.date: 11/26/2019
ms.author: jingwang
ms.reviewer: craigg
---

# Troubleshoot Azure Data Factory Connectors

This article explores common troubleshooting methods for connectors in Azure Data Factory.

## Azure Data Lake Storage

### Error message: The remote server returned an error: (403) Forbidden

- **Symptoms**: Copy activity fail with the following error: 

    ```
    Message: The remote server returned an error: (403) Forbidden.. 
    Response details: {"RemoteException":{"exception":"AccessControlException""message":"CREATE failed with error 0x83090aa2 (Forbidden. ACL verification failed. Either the resource does not exist or the user is not authorized to perform the requested operation.)....
    ```

- **Cause**: One possible cause is that the service principal or managed identity you use doesn't have permission to access the certain folder/file.

- **Resolution**: Grant corresponding permissions on all the folders and subfolders you need to copy. Refer to [this doc](connector-azure-data-lake-store.md#linked-service-properties).

### Error message: Failed to get access token by using service principal. ADAL Error: service_unavailable

- **Symptoms**:Copy activity fail with the following error:

    ```
    Failed to get access token by using service principal. 
    ADAL Error: service_unavailable, The remote server returned an error: (503) Server Unavailable.
    ```

- **Cause**: When the Service Token Server (STS) owned by Azure Active Directory is not unavailable, i.e., too
busy to handle requests, it returns an HTTP error 503. 

- **Resolution**: Rerun the copy activity after several minutes.

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

## SFTP

### Error message: Invalid SFTP credential provided for 'SshPublicKey' authentication type

- **Symptoms**: You use `SshPublicKey` authentication and hit the following error:

    ```
    Invalid Sftp credential provided for 'SshPublicKey' authentication type
    ```

- **Cause**: There are 3 possible causes:

    1. If you use ADF authoring UI to author SFTP linked service, this error means the private key you choose to use is of wrong format. You may use a PKCS#8 format of SSH private key, while note that ADF only supports the traditional SSH Key format. More specifically, the difference between PKCS#8 format and traditional Key format is PKCS#8 key content starts with “*-----BEGIN ENCRYPTED PRIVATE KEY-----*” whereas traditional key format starts with “*-----BEGIN RSA PRIVATE KEY-----*”.
    2. If you use Azure Key Vault to store the private key content or use programmatical way to author the SFTP linked service, this error means the private key content there is incorrect, likely it's not base64 encoded.
    3. Invalid credential or private key content.

- **Resolution**: 

    - For cause #1, run the following commands to convert the key to traditional key format, then use it in ADF authoring UI.

        ```
        # Decrypt the pkcs8 key and convert the format to traditional key format
        openssl pkcs8 -in pkcs8_format_key_file -out traditional_format_key_file

        chmod 600 traditional_format_key_file

        # Re-encrypte the key file using passphrase
        ssh-keygen -f traditional_format_key_file -p
        ```

    - For cause #2, To generate such string, customer can use below 2 ways:
    - Using third party base64 convert tool: paste the whole private key content to tools like [Base64 Encode and Decode](https://www.base64encode.org/), encode it to a base64 format string, then paste this string to key vault or use this value for authoring SFTP linked service programmatically.
    - Using C# code:

        ```c#
        byte[] keyContentBytes = File.ReadAllBytes(privateKeyPath);
        string keyContent = Convert.ToBase64String(keyContentBytes, Base64FormattingOptions.None);
        ```

    - For cause #3, double check if the key file or password is correct using other tools to validate if you can use it to access the SFTP server properly.
  

## Azure SQL Data Warehouse \ Azure SQL Database \ SQL Server

### Error code:  SqlFailedToConnect

- **Message**: `Cannot connect to SQL database: '%server;', Database: '%database;', User: '%user;'. Please check the linked service configuration is correct, and make sure the SQL database firewall allows the integration runtime to access.`

- **Cause**: If the error message contains "SqlException", SQL database throws the error indicating some specific operation failed.

- **Recommendation**:  Please search by SQL error code in this reference doc for more details: https://docs.microsoft.com/sql/relational-databases/errors-events/database-engine-events-and-errors. If you need further help, please contact Azure SQL support.

- **Cause**: If the error message contains "Client with IP address '...' is not allowed to access the server", and you are trying to connect to Azure SQL database, usually it is caused by Azure SQL database firewall issue.

- **Recommendation**:  In Azure SQL Server firewall configuration, enable "Allow Azure services and resources to access this server" option. Reference doc: https://docs.microsoft.com/azure/sql-database/sql-database-firewall-configure.


### Error code:  SqlOperationFailed

- **Message**: `A database operation failed. Please search error to get more details.`

- **Cause**: If the error message contains "SqlException", SQL database throws the error indicating some specific operation failed.

- **Recommendation**:  Please search by SQL error code in this reference doc for more details: https://docs.microsoft.com/sql/relational-databases/errors-events/database-engine-events-and-errors. If you need further help, please contact Azure SQL support.

- **Cause**: If the error message contains "PdwManagedToNativeInteropException", usually it's caused by mismatch between source and sink column sizes.

- **Recommendation**:  Please check the size of both source and sink columns. If you need further help, please contact Azure SQL support.

- **Cause**: If the error message contains "InvalidOperationException", usually it's caused by invalid input data.

- **Recommendation**:  To identify which row encounters the problem, please enable fault tolerance feature on copy activity, which can redirect problematic row(s) to a storage for further investigation. Reference doc: https://docs.microsoft.com/azure/data-factory/copy-activity-fault-tolerance.


### Error code:  SqlUnauthorizedAccess

- **Message**: `Cannot connect to '%connectorName;'. Detail Message: '%message;'`

- **Cause**: Credential is incorrect or the login account cannot access SQL database.

- **Recommendation**:  Please check the login account has enough permission to access the SQL database.


### Error code:  SqlOpenConnectionTimeout

- **Message**: `Open connection to database timeout after '%timeoutValue;' seconds.`

- **Cause**: Could be SQL database transient failure.

- **Recommendation**:  Please retry to update linked service connection string with larger connection timeout value.


### Error code:  SqlAutoCreateTableTypeMapFailed

- **Message**: `Type '%dataType;' in source side cannot be mapped to a type that supported by sink side(colunm name:'%colunmName;') in auto-create table.`

- **Cause**: Auto creation table cannot meet source requirement.

- **Recommendation**:  Please update the column type in 'mappings', or manually create the sink table in target server.


### Error code:  SqlDataTypeNotSupported

- **Message**: `A database operation failed. Please check the SQL errors.`

- **Cause**: If the issue happens on SQL source and the error is related to SqlDateTime overflow, the data value is over the logic type range (1/1/1753 12:00:00 AM - 12/31/9999 11:59:59 PM).

- **Recommendation**:  Please cast the type to string in source SQL query, or in copy activity column mapping change the column type to 'String'.

- **Cause**: If the issue happens on SQL sink and the error is related to SqlDateTime overflow, the data value is over the allowed range in sink table.

- **Recommendation**:  Please update the corresponding column type to 'datetime2' type in sink table.


### Error code:  SqlInvalidDbStoredProcedure

- **Message**: `The specified Stored Procedure is not valid. It could be caused by that the stored procedure doesn't return any data. Invalid Stored Procedure script: '%scriptName;'.`

- **Cause**: The specified Stored Procedure is not valid. It could be caused by that the stored procedure doesn't return any data.

- **Recommendation**:  Please validate the stored procedure by SQL Tools. Make sure the stored procedure can return data.


### Error code:  SqlInvalidDbQueryString

- **Message**: `The specified SQL Query is not valid. It could be caused by that the query doesn't return any data. Invalid query: '%query;'`

- **Cause**: The specified SQL Query is not valid. It could be caused by that the query doesn't return any data

- **Recommendation**:  Please validate the SQL Query by SQL Tools. Make sure the query can return data.


### Error code:  SqlInvalidColumnName

- **Message**: `Column '%column;' does not exist in the table '%tableName;', ServerName: '%serverName;', DatabaseName: '%dbName;'.`

- **Cause**: Cannot find column. Possible configuration wrong.

- **Recommendation**:  Please verify column in the query, 'structure' in dataset, and 'mappings' in activity.


### Error code:  SqlBatchWriteTimeout

- **Message**: `Timeout in SQL write opertaion.`

- **Cause**: Could be SQL database transient failure.

- **Recommendation**:  If problem repro, please contact Azure SQL support.


### Error code:  SqlBatchWriteRollbackFailed

- **Message**: `Timeout in SQL write operation and rollback also fail.`

- **Cause**: Could be SQL database transient failure.

- **Recommendation**:  Please retry to update linked service connection string with larger connection timeout value.


### Error code:  SqlBulkCopyInvalidColumnLength

- **Message**: `SQL Bulk Copy failed due to received an invalid column length from the bcp client.`

- **Cause**: SQL Bulk Copy failed due to received an invalid column length from the bcp client.

- **Recommendation**:  To identify which row encounters the problem, please enable fault tolerance feature on copy activity, which can redirect problematic row(s) to a storage for further investigation. Reference doc: https://docs.microsoft.com/azure/data-factory/copy-activity-fault-tolerance.


### Error code:  SqlConnectionIsClosed

- **Message**: `The connection is closed by SQL database.`

- **Cause**: SQL connection is closed by SQL database when high concurrent run and sever terminate connection.

- **Recommendation**:  Remote server close the SQL connection. Please retry. If problem repro, please contact Azure SQL support.

### Error message: Conversion failed when converting from a character string to uniqueidentifier

- **Symptoms**: When you copy data from tabular data source (such as SQL Server) into Azure SQL Data Warehouse using staged copy and PolyBase, you hit the following error:

    ```
    ErrorCode=FailedDbOperation,Type=Microsoft.DataTransfer.Common.Shared.HybridDeliveryException,
    Message=Error happened when loading data into SQL Data Warehouse.,
    Source=Microsoft.DataTransfer.ClientLibrary,Type=System.Data.SqlClient.SqlException,
    Message=Conversion failed when converting from a character string to uniqueidentifier...
    ```

- **Cause**: Azure SQL Data Warehouse PolyBase cannot convert empty string to GUID.

- **Resolution**: In Copy activity sink, under Polybase settings, set "**use type default**" option to false.

### Error message: Expected data type: DECIMAL(x,x), Offending value

- **Symptoms**: When you copy data from tabular data source (such as SQL Server) into SQL DW using staged copy and PolyBase, you hit the following error:

    ```
    ErrorCode=FailedDbOperation,Type=Microsoft.DataTransfer.Common.Shared.HybridDeliveryException,
    Message=Error happened when loading data into SQL Data Warehouse.,
    Source=Microsoft.DataTransfer.ClientLibrary,Type=System.Data.SqlClient.SqlException,
    Message=Query aborted-- the maximum reject threshold (0 rows) was reached while reading from an external source: 1 rows rejected out of total 415 rows processed. (/file_name.txt) 
    Column ordinal: 18, Expected data type: DECIMAL(x,x), Offending value:..
    ```

- **Cause**: Azure SQL Data Warehouse Polybase cannot insert empty string (null value) into decimal column.

- **Resolution**: In Copy activity sink, under Polybase settings, set "**use type default**" option to false.

### Error message: Java exception message:HdfsBridge::CreateRecordReader

- **Symptoms**: You copy data into Azure SQL Data Warehouse using PolyBase, and hit the following error:

    ```
    Message=110802;An internal DMS error occurred that caused this operation to fail. 
    Details: Exception: Microsoft.SqlServer.DataWarehouse.DataMovement.Common.ExternalAccess.HdfsAccessException, 
    Message: Java exception raised on call to HdfsBridge_CreateRecordReader. 
    Java exception message:HdfsBridge::CreateRecordReader - Unexpected error encountered creating the record reader.: Error [HdfsBridge::CreateRecordReader - Unexpected error encountered creating the record reader.] occurred while accessing external file.....
    ```

- **Cause**: The possible cause is that the schema (total column width) being too large (larger than 1 MB). Check the schema of the target SQL DW table by adding the size of all columns:

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

- **Symptoms**: You use SQL query to pull data from Azure SQL Data Warehouse and hit the following error:

    ```
    ...StorageException: The condition specified using HTTP conditional header(s) is not met...
    ```

- **Cause**: Azure SQL Data Warehouse hit issue querying the external table in Azure Storage.

- **Resolution**: Run the same query in SSMS and check if you see the same result. If yes, open a support ticket to Azure SQL Data Warehouse and provide your SQL DW server and database name to further troubleshoot.
            

## Azure Blob Storage

### Error code:  AzureBlobOperationFailed

- **Message**: `Blob operation Failed. ContainerName: %containerName;, path: %path;.`

- **Cause**: Blob storage operation hit problem.

- **Recommendation**:  Please check the error in details. Please refer to blob help document: https://docs.microsoft.com/rest/api/storageservices/blob-service-error-codes. Contact storage team if need help.



## Azure Data Lake Gen2

### Error code:  AdlsGen2OperationFailed

- **Message**: `ADLS Gen2 operation failed for: %adlsGen2Message;.%exceptionData;.`

- **Cause**: ADLS Gen2 throws the error indicating operation failed.

- **Recommendation**:  Please check the detailed error message thrown by ADLS Gen2. If it's caused by transient failure, please retry. If you need further help, please contact Azure Storage support and provide the request ID in error message.

- **Cause**: When the error message contains 'Forbidden', the service principal or managed identity you use may not have enough permission to access the ADLS Gen2.

- **Recommendation**:  Please refer to the help document: https://docs.microsoft.com/azure/data-factory/connector-azure-data-lake-storage#service-principal-authentication.

- **Cause**: When the error message contains 'InternalServerError', the error is returned by ADLS Gen2.

- **Recommendation**:  It may be caused by transient failure, please retry. If the issue persists, please contact Azure Storage support and provide the request ID in error message.


## Next steps

For more troubleshooting help, try these resources:

*  [Data Factory blog](https://azure.microsoft.com/blog/tag/azure-data-factory/)
*  [Data Factory feature requests](https://feedback.azure.com/forums/270578-data-factory)
*  [Azure videos](https://azure.microsoft.com/resources/videos/index/?sort=newest&services=data-factory)
*  [MSDN forum](https://social.msdn.microsoft.com/Forums/home?sort=relevancedesc&brandIgnore=True&searchTerm=data+factory)
*  [Stack Overflow forum for Data Factory](https://stackoverflow.com/questions/tagged/azure-data-factory)
*  [Twitter information about Data Factory](https://twitter.com/hashtag/DataFactory)
            

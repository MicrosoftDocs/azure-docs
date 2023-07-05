---
title: Troubleshoot the Azure Synapse Analytics, Azure SQL Database, SQL Server, Azure SQL Managed Instance, and Amazon RDS for SQL Server connectors
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to troubleshoot issues with the Azure Synapse Analytics, Azure SQL Database, SQL Server connectors, Azure SQL Managed Instance, and Amazon RDS for SQL Server in Azure Data Factory and Azure Synapse Analytics.
author: jianleishen
ms.author: jianleishen
ms.reviewer: joanpo, wiassaf
ms.date: 05/19/2023
ms.service: data-factory
ms.subservice: data-movement
ms.topic: troubleshooting
ms.custom: has-adal-ref, synapse, devx-track-extended-java
---

# Troubleshoot the Azure Synapse Analytics, Azure SQL Database, SQL Server, Azure SQL Managed Instance, and Amazon RDS for SQL Server connectors in Azure Data Factory and Azure Synapse

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article provides suggestions to troubleshoot common problems with the Azure Synapse Analytics, Azure SQL Database, SQL Server, Azure SQL Managed Instance, and Amazon RDS for SQL Server connectors in Azure Data Factory and Azure Synapse.

## Error code: SqlFailedToConnect

- **Message**: `Cannot connect to SQL Database: '%server;', Database: '%database;', User: '%user;'. Check the linked service configuration is correct, and make sure the SQL Database firewall allows the integration runtime to access.`
- **Causes and recommendations**: Different causes may lead to this error. Check below list for possible cause analysis and related recommendation.

    | Cause analysis                                               | Recommendation                                               |
    | :----------------------------------------------------------- | :----------------------------------------------------------- |
    | For Azure SQL, if the error message contains the string "SqlErrorNumber=47073", it means that public network access is denied in the connectivity setting. | On the Azure SQL firewall, set the **Deny public network access** option to *No*. For more information, see [Azure SQL connectivity settings](/azure/azure-sql/database/connectivity-settings#deny-public-network-access). |
    | For Azure SQL, if the error message contains an SQL error code such as "SqlErrorNumber=[errorcode]", see the Azure SQL troubleshooting guide. | For a recommendation, see [Troubleshoot connectivity issues and other errors with Azure SQL Database and Azure SQL Managed Instance](/azure/azure-sql/database/troubleshoot-common-errors-issues). |
    | Check to see whether port 1433 is in the firewall allowlist. | For more information, see [Ports used by SQL Server](/sql/sql-server/install/configure-the-windows-firewall-to-allow-sql-server-access#ports-used-by-). |
    | If the error message contains the string "SqlException", SQL Database the error indicates that some specific operation failed. | For more information, search by SQL error code in [Database engine errors](/sql/relational-databases/errors-events/database-engine-events-and-errors). For further help, contact Azure SQL support. |
    | If this is a transient issue (for example, an instable network connection), add retry in the activity policy to mitigate. | For more information, see [Pipelines and activities](./concepts-pipelines-activities.md#activity-policy). |
    | If the error message contains the string "Client with IP address '...' is not allowed to access the server", and you're trying to connect to Azure SQL Database, the error is usually caused by an Azure SQL Database firewall issue. | In the Azure SQL Server firewall configuration, enable the **Allow Azure services and resources to access this server** option. For more information, see [Azure SQL Database and Azure Synapse IP firewall rules](/azure/azure-sql/database/firewall-configure). |
    |If the error message contains `Login failed for user '<token-identified principal>'`, this error is usually caused by not granting enough permission to your service principal or system-assigned managed identity or user-assigned managed identity (depends on which authentication type you choose) in your database. |Grant enough permission to your service principal or system-assigned managed identity or user-assigned managed identity in your database.  <br/><br/> **For Azure SQL Database**:<br/>&nbsp;&nbsp;&nbsp;&nbsp;- If you use service principal authentication, follow [Service principal authentication](connector-azure-sql-database.md#service-principal-authentication).<br/>&nbsp;&nbsp;&nbsp;&nbsp;- If you use system-assigned managed identity authentication, follow [System-assigned managed identity authentication](connector-azure-sql-database.md#managed-identity).<br/>&nbsp;&nbsp;&nbsp;&nbsp;- If you use user-assigned managed identity authentication, follow [User-assigned managed identity authentication](connector-azure-sql-database.md#user-assigned-managed-identity-authentication). <br/>&nbsp;&nbsp;&nbsp;<br/>**For Azure Synapse Analytics**:<br/>&nbsp;&nbsp;&nbsp;&nbsp;- If you use service principal authentication, follow [Service principal authentication](connector-azure-sql-data-warehouse.md#service-principal-authentication).<br/>&nbsp;&nbsp;&nbsp;&nbsp;- If you use system-assigned managed identity authentication, follow [System-assigned managed identities for Azure resources authentication](connector-azure-sql-data-warehouse.md#managed-identity).<br/>&nbsp;&nbsp;&nbsp;&nbsp;- If you use user-assigned managed identity authentication, follow [User-assigned managed identity authentication](connector-azure-sql-data-warehouse.md#user-assigned-managed-identity-authentication).<br/>&nbsp;&nbsp;&nbsp;<br/>**For Azure SQL Managed Instance**: <br/>&nbsp;&nbsp;&nbsp;&nbsp;- If you use service principal authentication, follow [Service principal authentication](connector-azure-sql-managed-instance.md#service-principal-authentication).<br/>&nbsp;&nbsp;&nbsp;- If you use system-assigned managed identity authentication, follow [System-assigned managed identity authentication](connector-azure-sql-managed-instance.md#managed-identity).<br/>&nbsp;&nbsp;&nbsp;- If you use user-assigned managed identity authentication, follow [User-assigned managed identity authentication](connector-azure-sql-managed-instance.md#user-assigned-managed-identity-authentication).|
    | If you meet the error message that contains `The server was not found or was not accessible` when using Azure SQL Managed Instance, this error is usually caused by not enabling the Azure SQL Managed Instance public endpoint.| Refer to [Configure public endpoint in Azure SQL Managed Instance](/azure/azure-sql/managed-instance/public-endpoint-configure) to enable the Azure SQL Managed Instance public endpoint. |
    
## Error code: SqlOperationFailed

- **Message**: `A database operation failed. Please search error to get more details.`

- **Causes and recommendations**: Different causes may lead to this error. Check below list for possible cause analysis and related recommendation.

    | Cause analysis                                               | Recommendation                                               |
    | :----------------------------------------------------------- | :----------------------------------------------------------- |
    | If the error message contains the string "SqlException", SQL Database throws an error indicating some specific operation failed. | If the SQL error is not clear, try to alter the database to the latest compatibility level '150'. It can throw the latest version SQL errors. For more information, see the [documentation](/sql/t-sql/statements/alter-database-transact-sql-compatibility-level#backwardCompat). <br/> For more information about troubleshooting SQL issues, search by SQL error code in [Database engine errors](/sql/relational-databases/errors-events/database-engine-events-and-errors). For further help, contact Azure SQL support. |
    | If the error message contains the string "PdwManagedToNativeInteropException", it's usually caused by a mismatch between the source and sink column sizes. | Check the size of both the source and sink columns. For further help, contact Azure SQL support. |
    | If the error message contains the string "InvalidOperationException", it's usually caused by invalid input data. | To identify which row has encountered the problem, enable the fault tolerance feature on the copy activity, which can redirect problematic rows to the storage for further investigation. For more information, see [Fault tolerance of copy activity](./copy-activity-fault-tolerance.md). |
    | If the error message contains "Execution Timeout Expired", it's usually caused by query timeout. | Configure **Query timeout** in the source and **Write batch timeout** in the sink to increase timeout. |
    | If the error message contains `Cannot find the object "dbo.Contoso" because it does not exist or you do not have permissions.` when you copy data from hybrid into an on-premises SQL Server table, it's caused by the current SQL account doesn't have sufficient permissions to execute requests issued by .NET SqlBulkCopy.WriteToServer or your table or database does not exist. | Switch to a more privileged SQL account or check if your table or database exists. |

## Error code: SqlUnauthorizedAccess

- **Message**: `Cannot connect to '%connectorName;'. Detail Message: '%message;'`

- **Cause**: The credentials are incorrect or the login account can't access the SQL database.

- **Recommendation**:  Check to ensure that the login account has sufficient permissions to access the SQL database.

## Error code: SqlOpenConnectionTimeout

- **Message**: `Open connection to database timeout after '%timeoutValue;' seconds.`

- **Cause**: The problem could be a SQL database transient failure.

- **Recommendation**:  Retry the operation to update the linked service connection string with a larger connection timeout value.

## Error code: SqlAutoCreateTableTypeMapFailed

- **Message**: `Type '%dataType;' in source side cannot be mapped to a type that supported by sink side(column name:'%columnName;') in autocreate table.`

- **Cause**: The autocreation table can't meet the source requirement.

- **Recommendation**:  Update the column type in *mappings*, or manually create the sink table in the target server.

## Error code: SqlDataTypeNotSupported

- **Message**: `A database operation failed. Check the SQL errors.`

- **Cause**: If the issue occurs in the SQL source and the error is related to SqlDateTime overflow, the data value exceeds the logic type range (1/1/1753 12:00:00 AM - 12/31/9999 11:59:59 PM).

- **Recommendation**:  Cast the type to the string in the source SQL query or, in the copy activity column mapping, change the column type to *String*.

- **Cause**: If the issue occurs on the SQL sink and the error is related to SqlDateTime overflow, the data value exceeds the allowed range in the sink table.

- **Recommendation**:  Update the corresponding column type to the *datetime2* type in the sink table.

## Error code: SqlInvalidDbStoredProcedure

- **Message**: `The specified Stored Procedure is not valid. It could be caused by that the stored procedure doesn't return any data. Invalid Stored Procedure script: '%scriptName;'.`

- **Causes and recommendations**: Different causes may lead to this error. Check below list for possible cause analysis and related recommendation.

  | Cause analysis                                               | Recommendation                                             |
  | :----------------------------------------------------------- | :----------------------------------------------------------- |
  | The specified stored procedure is invalid. | Validate the stored procedure by using SQL Tools. Make sure that the stored procedure can return data.  |
  | The Lookup activity requires the stored procedure to return some value, but the stored procedure code doesn't return any value. | Use the Stored Procedure Activity if the stored procedure is expected to return no data. |

## Error code: SqlInvalidDbQueryString

- **Message**: `The specified SQL Query is not valid. It could be caused by that the query doesn't return any data. Invalid query: '%query;'`

- **Cause**: The specified SQL query is invalid. The cause might be that the query doesn't return any data.

- **Recommendation**:  Validate the SQL query by using SQL Tools. Make sure that the query can return data.

## Error code: SqlInvalidColumnName

- **Message**: `Column '%column;' does not exist in the table '%tableName;', ServerName: '%serverName;', DatabaseName: '%dbName;'.`

- **Cause**: The column can't be found because the configuration might be incorrect.

- **Recommendation**:  Verify the column in the query, *structure* in the dataset, and *mappings* in the activity.

## Error code: SqlBatchWriteTimeout

- **Message**: `Timeouts in SQL write operation.`

- **Cause**: The problem could be caused by a SQL database transient failure.

- **Recommendation**:  Retry the operation. If the problem persists, contact Azure SQL support.

## Error code: SqlBatchWriteTransactionFailed

- **Message**: `SQL transaction commits failed.`

- **Cause**: If exception details constantly indicate a transaction timeout, the network latency between the integration runtime and the database is greater than the default threshold of 30 seconds.

- **Recommendation**:  Update the SQL-linked service connection string with a *connection timeout* value that's equal to or greater than 120 and rerun the activity.

- **Cause**: If the exception details intermittently indicate that the SQL connection is broken, it might be a transient network failure or a SQL database side issue.

- **Recommendation**:  Retry the activity and review the SQL database side metrics.

## Error code: SqlBulkCopyInvalidColumnLength

- **Message**: `SQL Bulk Copy failed due to receive an invalid column length from the bcp client.`

- **Cause**: SQL Bulk Copy failed because it received an invalid column length from the bulk copy program utility (bcp) client.

- **Recommendation**:  To identify which row has encountered the problem, enable the fault tolerance feature on the copy activity. This can redirect problematic rows to the storage for further investigation. For more information, see [Fault tolerance of copy activity](./copy-activity-fault-tolerance.md).

## Error code: SqlConnectionIsClosed

- **Message**: `The connection is closed by SQL Database.`

- **Cause**: The SQL connection is closed by the SQL database when a high concurrent run and the server terminate the connection.

- **Recommendation**:  Retry the connection. If the problem persists, contact Azure SQL support.

## Error code: SqlServerInvalidLinkedServiceCredentialMissing

- **Message**: `The SQL Server linked service is invalid with its credential being missing.`

- **Cause**: The linked service was not configured properly.

- **Recommendation**: Validate and fix the SQL server linked service.

## Error code: SqlParallelFailedToDetectPartitionColumn

- **Message**: `Failed to detect the partition column with command '%command;', %message;.`

- **Cause**: There is no primary key or unique key in the table.

- **Recommendation**: Check the table to make sure that a primary key or a unique index is created.

## Error code: SqlParallelFailedToDetectPhysicalPartitions

- **Message**: `Failed to detect the physical partitions with command '%command;', %message;.`

- **Cause**: No physical partitions are created for the table. Check your database.

- **Recommendation**: Reference [Create Partitioned Tables and Indexes](/sql/relational-databases/partitions/create-partitioned-tables-and-indexes?view=sql-server-ver15&preserve-view=true) to solve this issue.

## Error code: SqlParallelFailedToGetPartitionRangeSynapse

- **Message**: `Failed to get the partitions for azure synapse with command '%command;', %message;.`

- **Cause**: No physical partitions are created for the table. Check your database.

- **Recommendation**: Reference [Partitioning tables in dedicated SQL pool](../synapse-analytics/sql-data-warehouse/sql-data-warehouse-tables-partition.md) to solve this issue.

## Error message: Conversion failed when converting from a character string to uniqueidentifier

- **Symptoms**: When you copy data from a tabular data source (such as SQL Server) into Azure Synapse Analytics using staged copy and PolyBase, you receive the following error:

   `ErrorCode=FailedDbOperation,Type=Microsoft.DataTransfer.Common.Shared.HybridDeliveryException,  
    Message=Error happened when loading data into Azure Synapse Analytics.,  
    Source=Microsoft.DataTransfer.ClientLibrary,Type=System.Data.SqlClient.SqlException,  
    Message=Conversion failed when converting from a character string to uniqueidentifier...`

- **Cause**: Azure Synapse Analytics PolyBase can't convert an empty string to a GUID.

- **Resolution**: In the copy activity sink, under PolyBase settings, set the **use type default** option to *false*.

## Error message: Expected data type: DECIMAL(x,x), Offending value

- **Symptoms**: When you copy data from a tabular data source (such as SQL Server) into Azure Synapse Analytics by using staged copy and PolyBase, you receive the following error:

    `ErrorCode=FailedDbOperation,Type=Microsoft.DataTransfer.Common.Shared.HybridDeliveryException,  
    Message=Error happened when loading data into Azure Synapse Analytics.,  
    Source=Microsoft.DataTransfer.ClientLibrary,Type=System.Data.SqlClient.SqlException,  
    Message=Query aborted-- the maximum reject threshold (0 rows) was reached while reading from an external source: 1 rows rejected out of total 415 rows processed. (/file_name.txt)  
    Column ordinal: 18, Expected data type: DECIMAL(x,x), Offending value:..`

- **Cause**: Azure Synapse Analytics PolyBase can't insert an empty string (null value) into a decimal column.

- **Resolution**: In the copy activity sink, under PolyBase settings, set the **use type default** option to false.

## Error message: Java exception message: HdfsBridge::CreateRecordReader

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

## Error message: The condition specified using HTTP conditional header(s) is not met

- **Symptoms**: You use SQL query to pull data from Azure Synapse Analytics and receive the following error:

    `...StorageException: The condition specified using HTTP conditional header(s) is not met...`

- **Cause**: Azure Synapse Analytics encountered an issue while querying the external table in Azure Storage.

- **Resolution**: Run the same query in SQL Server Management Studio (SSMS) and check to see whether you get the same result. If you do, open a support ticket to Azure Synapse Analytics and provide your Azure Synapse Analytics server and database name.

## Performance tier is low and leads to copy failure

- **Symptoms**: You copy data into Azure SQL Database and receive the following error: `Database operation failed. Error message from database execution : ExecuteNonQuery requires an open and available Connection. The connection's current state is closed.`

- **Cause**: Azure SQL Database s1 has hit input/output (I/O) limits.

- **Resolution**: Upgrade the Azure SQL Database performance tier to fix the issue.

## Error message: String or binary data is truncated

- **Symptoms**: An error occurs when you copy data into an on-premises Azure SQL Server table.

- **Cause**: The SQL table schema definition has one or more columns with less length than expected.

- **Resolution**: To resolve the issue, try the following:

    1. To troubleshoot which rows have the issue, apply SQL sink [fault tolerance](./copy-activity-fault-tolerance.md), especially `redirectIncompatibleRowSettings`.

        > [!NOTE]  
        > Fault tolerance might require additional execution time, which could lead to higher costs.

    1. Double-check the redirected data against the SQL table schema column length to see which columns need to be updated.

    1. Update the table schema accordingly.

## Error code: FailedDbOperation

- **Message**: `User does not have permission to perform this action.`

- **Recommendation**: Make sure the user configured in the Azure Synapse Analytics connector must have 'CONTROL' permission on the target database while using PolyBase to load data. For more detailed information, refer to this [document](./connector-azure-sql-data-warehouse.md#required-database-permission).

## Error code: Msg 105208

- **Symptoms**: Error code: `Error code: Msg 105208, Level 16, State 1, Line 1 COPY statement failed with the following error when validating value of option 'FROM': '105200;COPY statement failed because the value for option 'FROM' is invalid.'`
- **Cause**: Currently, ingesting data using the COPY command into an Azure Storage account that is using the new DNS partitioning feature results in an error. DNS partition feature enables customers to create up to 5000 storage accounts per subscription.  
- **Resolutions**: Provision a storage account in a subscription that does not use the new [Azure Storage DNS partition feature](https://techcommunity.microsoft.com/t5/azure-storage-blog/public-preview-create-additional-5000-azure-storage-accounts/ba-p/3465466) (currently in Public Preview).

## Error code: SqlDeniedPublicAccess

- **Message**: `Cannot connect to SQL Database: '%server;', Database: '%database;', Reason: Connection was denied since Deny Public Network Access is set to Yes. To connect to this server, 1. If you persist public network access disabled, please use Managed Vritual Network IR and create private endpoint. https://docs.microsoft.com/en-us/azure/data-factory/managed-virtual-network-private-endpoint; 2. Otherwise you can enable public network access, set "Public network access" option to "Selected networks" on Azure SQL Networking setting.`

- **Causes**: Azure SQL Database is set to deny public network access. This requires to use managed virtual network and create private endpoint to access.

- **Recommendation**:

    1. If you insist on disabling public network access, use managed virtual network integration runtime and create private endpoint. For more information, see [Azure Data Factory managed virtual network](managed-virtual-network-private-endpoint.md).
    
    2. Otherwise, enable public network access by setting **Public network access** option to **Selected networks** on Azure SQL Database **Networking** setting page.
    
## Next steps

For more troubleshooting help, try these resources:

- [Connector troubleshooting guide](connector-troubleshoot-guide.md)
- [Data Factory blog](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/bg-p/AzureDataFactoryBlog)
- [Data Factory feature requests](/answers/topics/azure-data-factory.html)
- [Azure videos](https://azure.microsoft.com/resources/videos/index/?sort=newest&services=data-factory)
- [Microsoft Q&A page](/answers/topics/azure-data-factory.html)
- [Stack Overflow forum for Data Factory](https://stackoverflow.com/questions/tagged/azure-data-factory)
- [Twitter information about Data Factory](https://twitter.com/hashtag/DataFactory)

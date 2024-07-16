---
title: Troubleshoot connector and format issues in mapping data flows
description: Learn how to troubleshoot data flow problems related to connector and format in Azure Data Factory.
author: jianleishen
ms.author: jianleishen
ms.reviewer: wiassaf
ms.service: data-factory
ms.subservice: data-flows
ms.topic: troubleshooting
ms.date: 03/19/2024
---


# Troubleshoot connector and format issues in mapping data flows in Azure Data Factory

This article explores troubleshooting methods related to connector and format for mapping data flows in Azure Data Factory (ADF).

## Azure Blob Storage

### Account Storage type (general purpose v1) doesn't support service principal and MI authentication

#### Symptoms

In data flows, if you use Azure Blob Storage (general purpose v1) with the service principal or MI authentication, you might encounter the following error message:

`com.microsoft.dataflow.broker.InvalidOperationException: ServicePrincipal and MI auth are not supported if blob storage kind is Storage (general purpose v1)`

#### Cause

When you use the Azure Blob linked service in data flows, the managed identity or service principal authentication isn't supported when the account kind is empty or **Storage**. This situation is shown in Image 1 and Image 2 below.

Image 1: The account kind in the Azure Blob Storage linked service

:::image type="content" source="./media/data-flow-troubleshoot-connector-format/storage-account-kind.png" alt-text="Screenshot that shows the storage account kind in the Azure Blob Storage linked service."::: 

Image 2: Storage account page

:::image type="content" source="./media/data-flow-troubleshoot-connector-format/storage-account-page.png" alt-text="Screenshot that shows storage account page." lightbox="./media/data-flow-troubleshoot-connector-format/storage-account-page.png"::: 


#### Recommendation

To solve this issue, refer to the following recommendations:

- If the storage account kind is **None** in the Azure Blob linked service, specify the proper account kind, and refer to Image 3 that follows to accomplish it. Furthermore, refer to Image 2 to get the storage account kind, and check and confirm the account kind isn't Storage (general purpose v1).

    Image 3: Specify the storage account kind in the Azure Blob Storage linked service

    :::image type="content" source="./media/data-flow-troubleshoot-connector-format/specify-storage-account-kind.png" alt-text="Screenshot that shows how to specify storage account kind in Azure Blob Storage linked service."::: 
    

- If the account kind is Storage (general purpose v1), upgrade your storage account to the **general purpose v2** or choose a different authentication.

    Image 4: Upgrade the storage account to general purpose v2

    :::image type="content" source="./media/data-flow-troubleshoot-connector-format/upgrade-storage-account.png" alt-text="Screenshot that shows how to upgrade the storage account to general purpose v2." lightbox="./media/data-flow-troubleshoot-connector-format/upgrade-storage-account.png"::: 

## Azure Cosmos DB and JSON format

### Support customized schemas in the source

#### Symptoms
When you want to use the ADF data flow to move or transfer data from Azure Cosmos DB/JSON into other data stores, some columns of the source data might be missed.

#### Cause
For the schema-free connectors (the column number, column name and column data type of each row can be different when comparing with others), by default, ADF uses sample rows (for example, top 100 or 1,000 rows data) to infer the schema, and the inferred result are used as a schema to read data. So if your data stores have extra columns that don't appear in sample rows, the data of these extra columns aren't read, moved, or transferred into sink data stores.

#### Recommendation
To overwrite the default behavior and bring in other fields, ADF provides options for you to customize the source schema. You can specify additional/missing columns that could be missing in schema-infer-result in the data flow source projection to read the data, and you can apply one of the following options to set the customized schema. Usually, **Option-1** is more preferred.

- **Option-1**: Compared with the original source data that might be one large file, table, or container that contains millions of rows with complex schemas, you can create a temporary table/container with a few rows that contain all the columns you want to read, and then move on to the following operation:

    1. Use the data flow source **Debug Settings** to have **Import projection** with sample files/tables to get the complete schema. You can follow the steps in the following picture:<br/>

        :::image type="content" source="./media/data-flow-troubleshoot-connector-format/customize-schema-option-1-1.png" alt-text="Screenshot that shows the first part of the first option to customize the source schema.":::<br/>
         1. Select **Debug settings** in the data flow canvas.
         1. In the pop-up pane, select **Sample table** under the **cosmosSource** tab, and enter the name of your table in the **Table** block.
         1. Select **Save** to save your settings.
         1. Select **Import projection**.<br/>  
    
    1. Change the **Debug Settings** back to use the source dataset for the remaining data movement/transformation. You can move on with the steps in the following picture:<br/>

        :::image type="content" source="./media/data-flow-troubleshoot-connector-format/customize-schema-option-1-2.png" alt-text="Screenshot that shows the second part of the first option to customize the source schema."::: <br/>   
         1. Select **Debug settings** in the data flow canvas.
         1. In the pop-up pane, select **Source dataset** under the **cosmosSource** tab.
         1. Select **Save** to save your settings.<br/>
    
    Afterwards, the ADF data flow runtime will honor and use the customized schema to read data from the original data store. <br/>

- **Option-2**: If you're familiar with the schema and DSL language of the source data, you can manually update the data flow source script to add additional/missed columns to read the data. An example is shown in the following picture: 

    :::image type="content" source="./media/data-flow-troubleshoot-connector-format/customize-schema-option-2.png" alt-text="Screenshot that shows the second option to customize the source schema.":::

### Support map type in the source

#### Symptoms
In ADF data flows, map data type can't be directly supported in Azure Cosmos DB or JSON source, so you can't get the map data type under "Import projection".

#### Cause
For Azure Cosmos DB and JSON, they're schema-free connectivity and related spark connector uses sample data to infer the schema, and then that schema is used as the Azure Cosmos DB/JSON source schema. When inferring the schema, the Azure Cosmos DB/JSON Spark connector can only infer object data as a struct rather than a map data type, and that's why map type can't be directly supported.

#### Recommendation 
To solve this issue, refer to the following examples and steps to manually update the script (DSL) of the Azure Cosmos DB/JSON source to get the map data type support.

**Examples**:

:::image type="content" source="./media/data-flow-troubleshoot-connector-format/script-example.png" alt-text="Screenshot that shows examples of updating the script (DSL) of the Azure Cosmos DB/JSON source." lightbox="./media/data-flow-troubleshoot-connector-format/script-example.png"::: 
    
**Step-1**: Open the script of the data flow activity.

:::image type="content" source="./media/data-flow-troubleshoot-connector-format/open-script.png" alt-text="Screenshot that shows how to open the script of the data flow activity." ::: 
    
**Step-2**: Update the DSL to get the map type support by referring to the examples above.

:::image type="content" source="./media/data-flow-troubleshoot-connector-format/update-dsl.png" alt-text="Screenshot that shows how to update the DSL." ::: 

The map type support:

|Type |Is the map type supported?   |Comments|
|-------------------------|-----------|------------|
|Excel, CSV  |No      |Both are tabular data sources with the primitive type, so there's no need to support the map type. |
|Orc, Avro |Yes |None.|
|JSON|Yes |The map type can't be directly supported. Follow the recommendation part in this section to update the script (DSL) under the source projection.|
|Azure Cosmos DB |Yes |The map type can't be directly supported. Follow the recommendation part in this section to update the script (DSL) under the source projection.|
|Parquet |Yes |Today the complex data type isn't supported on the parquet dataset, so you need to use the "Import projection" under the data flow parquet source to get the map type.|
|XML |No |None.|

### Consume JSON files generated by copy activities

#### Symptoms

If you use the copy activity to generate some JSON files, and then try to read these files in data flows, you fail with the error message: `JSON parsing error, unsupported encoding or multiline`

#### Cause

There are following limitations on JSON for copy and data flows respectively:

- For Unicode encodings (utf-8, utf-16, utf-32) JSON files, copy activities always generate the JSON files with BOM.
- The data flow JSON source with "Single document" enabled doesn't support Unicode encoding with BOM.

    :::image type="content" source="./media/data-flow-troubleshoot-connector-format/enabled-single-document.png" alt-text="Screenshot that shows the enabled 'Single document'."::: 


So you might experience issues if the following criteria are met:

- The sink dataset used by the copy activity is set to Unicode encoding (utf-8, utf-16, utf-16be, utf-32, utf-32be) or the default is used.
- The copy sink is set to use "Array of objects" file pattern as shown in the following picture, no matter whether "Single document" is enabled or not in the data flow JSON source. 

    :::image type="content" source="./media/data-flow-troubleshoot-connector-format/array-of-objects-pattern.png" alt-text="Screenshot that shows the set 'Array of objects' pattern."::: 
   
#### Recommendation

- Always use the default file pattern or explicit "Set of objects" pattern in the copy sink if the generated files are used in data flows.
- Disable the "Single document" option in the data flow JSON source.

>[!Note]
> Using "Set of objects" is also the recommended practice from the performance perspective. As the "Single document" JSON in the data flow can't enable parallel reading for single large files, this recommendation does not have any negative impact.

### The query with parameters doesn't work

#### Symptoms

Mapping data flows in Azure Data Factory supports the use of parameters. The parameter values are set by the calling pipeline via the Execute Data Flow activity, and using parameters is a good way to make your data flow general-purpose, flexible, and reusable. You can parameterize data flow settings and expressions with these parameters: [Parameterizing mapping data flows](./parameters-data-flow.md).

After setting parameters and using them in the query of data flow source, they do not take effective.

#### Cause

You encounter this error due to your wrong configuration.

#### Recommendation

Use the following rules to set parameters in the query, and for more detailed information, refer to [Build expressions in mapping data flow](./concepts-data-flow-expression-builder.md).

1. Apply double quotes at the beginning of the SQL statement.
2. Use single quotes around the parameter.
3. Use lowercase letters for all CLAUSE statements.

For example:

:::image type="content" source="./media/data-flow-troubleshoot-connector-format/set-parameter-in-query.png" alt-text="Screenshot that shows the set parameter in the query."::: 

## Azure Data Lake Storage Gen1

### Fail to create files with service principle authentication

#### Symptoms
When you try to move or transfer data from different sources into the ADLS gen1 sink, if the linked service's authentication method is service principle authentication, your job might fail with the following error message:

`org.apache.hadoop.security.AccessControlException: CREATE failed with error 0x83090aa2 (Forbidden. ACL verification failed. Either the resource does not exist or the user is not authorized to perform the requested operation.). [2b5e5d92-xxxx-xxxx-xxxx-db4ce6fa0487] failed with error 0x83090aa2 (Forbidden. ACL verification failed. Either the resource does not exist or the user is not authorized to perform the requested operation.)`

#### Cause

The RWX permission or the dataset property isn't set correctly.

#### Recommendation

- If the target folder doesn't have correct permissions, refer to this document to assign the correct permission in Gen1: [Use service principal authentication](./connector-azure-data-lake-store.md#use-service-principal-authentication).

- If the target folder has the correct permission and you use the file name property in the data flow to target to the right folder and file name, but the file path property of the dataset isn't set to the target file path (usually leave not set), as the example shown in the following pictures, you encounter this failure because the backend system tries to create files based on the file path of the dataset, and the file path of the dataset doesn't have the correct permission.
    
    :::image type="content" source="./media/data-flow-troubleshoot-connector-format/file-path-property.png" alt-text="Screenshot that shows the file path property."::: 
    
    :::image type="content" source="./media/data-flow-troubleshoot-connector-format/file-name-property.png" alt-text="Screenshot that shows the file name property."::: 

    
    There are two methods to solve this issue:
    1. Assign the WX permission to the file path of the dataset.
    1. Set the file path of the dataset as the folder with WX permission, and set the rest folder path and file name in data flows.

## Azure Data Lake Storage Gen2

### Failed with an error: "Error while reading file XXX. It's possible the underlying files have been updated."

#### Symptoms

When you use the ADLS Gen2 as a sink in the data flow (to preview data, debug/trigger run, etc.) and the partition setting in **Optimize** tab in the **Sink** stage isn't default, you might find the job fails with the following error message:

`Job failed due to reason: Error while reading file abfss:REDACTED_LOCAL_PART@prod.dfs.core.windows.net/import/data/e3342084-930c-4f08-9975-558a3116a1a9/part-00000-tid-7848242374008877624-5df7454e-7b14-4253-a20b-d20b63fe9983-1-1-c000.csv. It is possible the underlying files have been updated. You can explicitly invalidate the cache in Spark by running 'REFRESH TABLE tableName' command in SQL or by recreating the Dataset/DataFrame involved.`

#### Cause

1. You don't assign a proper permission to your MI/SP authentication.
1. You might have a customized job to handle files that you don't want, which will affect the data flow's middle output.

#### Recommendation
1. Check if your linked service has the R/W/E permission for Gen2. If you use the MI auth/SP authentication, at least grant the Storage Blob Data Contributor role in the Access control (IAM).
1. Confirm if you have specific jobs that move/delete files to other place whose name doesn't match your rule. Because data flows write down partition files into the target folder firstly and then do the merge and rename operations, the middle file's name might not match your rule.

## Azure Database for PostgreSQL

### Encounter an error: Failed with exception: handshake_failure 

#### Symptoms
You use Azure PostgreSQL as a source or sink in the data flow such as previewing data and debugging/triggering run, and you might find the job fails with following error message: 

   `PSQLException: SSL error: Received fatal alert: handshake_failure `<br/>
   `Caused by: SSLHandshakeException: Received fatal alert: handshake_failure.`

#### Cause 
If you use the flexible server or Hyperscale (Citus) for your Azure PostgreSQL server, since the system is built via Spark upon Azure Databricks cluster, there's a limitation in Azure Databricks blocks our system to connect to the Flexible server or Hyperscale (Citus). You can review the following two links as references.
- [Handshake fails trying to connect from Azure Databricks to Azure PostgreSQL with SSL](/answers/questions/170730/handshake-fails-trying-to-connect-from-azure-datab.html)
 
- [MCW-Real-time-data-with-Azure-Database-for-PostgreSQL-Hyperscale](https://github.com/microsoft/MCW-Real-time-data-with-Azure-Database-for-PostgreSQL-Hyperscale/blob/master/Hands-on%20lab/HOL%20step-by%20step%20-%20Real-time%20data%20with%20Azure%20Database%20for%20PostgreSQL%20Hyperscale.md)<br/>
    Refer to the content in the following picture in this article：<br/>

    :::image type="content" source="./media/data-flow-troubleshoot-connector-format/handshake-failure-cause-2.png" alt-text="Screenshot that shows the referring content in the article above.":::

#### Recommendation
You can try to use copy activities to unblock this issue. 

## Azure SQL Database
 
### Unable to connect to the SQL Database

#### Symptoms

Your Azure SQL Database can work well in the data copy, dataset preview-data, and test-connection in the linked service, but it fails when the same Azure SQL Database is used as a source or sink in the data flow with error like `Cannot connect to SQL database: 'jdbc:sqlserver://powerbasenz.database.windows.net;..., Please check the linked service configuration is correct, and make sure the SQL database firewall allows the integration runtime to access.'`

#### Cause

There are wrong firewall settings on your Azure SQL Database server, so that it can't be connected by the data flow runtime. Currently, when you try to use the data flow to read/write Azure SQL Database, Azure Databricks is used to build spark cluster to run the job, but it doesn't support fixed IP ranges. For more details, please refer to [Azure Integration Runtime IP addresses](./azure-integration-runtime-ip-addresses.md).

#### Recommendation

Check the firewall settings of your Azure SQL Database and set it as "Allow access to Azure services" rather than set the fixed IP range.

:::image type="content" source="./media/data-flow-troubleshoot-connector-format/allow-access-to-azure-service.png" alt-text="Screenshot that shows how to allow access to Azure service in firewall settings."::: 

### Syntax error when using queries as input

#### Symptoms

When you use queries as input in the data flow source with the Azure SQL, you fail with the following error message:

`at Source 'source1': shaded.msdataflow.com.microsoft.sqlserver.jdbc.SQLServerException: Incorrect syntax XXXXXXXX.`

:::image type="content" source="./media/data-flow-troubleshoot-connector-format/error-detail.png" alt-text="Screenshot that shows the error details."::: 

#### Cause

The query used in the data flow source should be able to run as a sub query. The reason of the failure is that either the query syntax is incorrect or it can't be run as a sub query. You can run the following query in the SSMS to verify it:

`SELECT top(0) * from ($yourQuery) as T_TEMP`

#### Recommendation

Provide a correct query and test it in the SSMS firstly.

### Failed with an error: "SQLServerException: 111212; Operation can't be performed within a transaction."

#### Symptoms

When you use the Azure SQL Database as a sink in the data flow to preview data, debug/trigger run and do other activities, you might find your job fails with following error message:

`{"StatusCode":"DFExecutorUserError","Message":"Job failed due to reason: at Sink 'sink': shaded.msdataflow.com.microsoft.sqlserver.jdbc.SQLServerException: 111212;Operation cannot be performed within a transaction.","Details":"at Sink 'sink': shaded.msdataflow.com.microsoft.sqlserver.jdbc.SQLServerException: 111212;Operation cannot be performed within a transaction."}`

#### Cause
The error "`111212;Operation cannot be performed within a transaction.`" only occurs in the Synapse dedicated SQL pool. But you mistakenly use the Azure SQL Database as the connector instead.

#### Recommendation
Confirm if your SQL Database is a Synapse dedicated SQL pool. If so, use Azure Synapse Analytics as a connector shown in the following image.

:::image type="content" source="./media/data-flow-troubleshoot-connector-format/synapse-analytics-connector.png" alt-text="Screenshot that shows the Azure Synapse Analytics connector."::: 

### Data with the decimal type become null

#### Symptoms

You want to insert data into a table in the SQL database. If the data contains the decimal type and need to be inserted into a column with the decimal type in the SQL database, the data value might be changed to null.

If you do the preview, in previous stages, it shows the value like the following picture:

:::image type="content" source="./media/data-flow-troubleshoot-connector-format/value-in-previous-stage.png" alt-text="Screenshot that shows the value in the previous stages."::: 

In the sink stage, it becomes null, which is shown in the following image.

:::image type="content" source="./media/data-flow-troubleshoot-connector-format/value-in-sink-stage.png" alt-text="Screenshot that shows the value in the sink stage."::: 

#### Cause
The decimal type has scale and precision properties. If your data type doesn't match that in the sink table, the system validates that the target decimal is wider than the original decimal, and the original value doesn't overflow in the target decimal. Therefore, the value is cast to null.

#### Recommendation
Check and compare the decimal type between data and table in the SQL database, and alter the scale and precision to the same.

You can use toDecimal (IDecimal, scale, precision) to figure out if the original data can be cast to the target scale and precision. If it returns null, it means that the data can't be cast and furthered when inserting.

## Azure Synapse Analytics

### Serverless pool (SQL on-demand) related issues

#### Symptoms
You use the Azure Synapse Analytics and the linked service actually is a Synapse serverless pool. Its former name is SQL on-demand pool, and you can distinguish it by finding the server name that contains `ondemand`, for example, `space-ondemand.sql.azuresynapse.net`. You might face with several unique failures such as these:<br/>

1. When you want to use Synapse serverless pool as a Sink, you face the following error:<br/>
`Sink results in 0 output columns. Please ensure at least one column is mapped`
1. When you select 'enable staging' in the Source, you face the following error:
`shaded.msdataflow.com.microsoft.sqlserver.jdbc.SQLServerException: Incorrect syntax near 'IDENTITY'.`
1. When you want to fetch data from an external table, you face the following error: `shaded.msdataflow.com.microsoft.sqlserver.jdbc.SQLServerException: External table 'dbo' is not accessible because location does not exist or it is used by another process.`
1. When you want to fetch data from Azure Cosmos DB through Serverless pool by query/from view, you face the following error: 
 `Job failed due to reason: Connection reset.`
1. When you want to fetch data from a view, you might face with different errors.

#### Cause
Causes of the symptoms are stated respectively here:
1. Serverless pool can't be used as a sink. It doesn't support write data into the database.
1. Serverless pool doesn't support staged data loading, so 'enable staging' isn't supported. 
1. The authentication method that you use doesn't have a correct permission to the external data source where the external table referring to.
1. There's a known limitation in Synapse serverless pool, blocking you to fetch Azure Cosmos DB data from data flows.
1. View is a virtual table based on an SQL statement. The root cause is inside the statement of the view.

#### Recommendation

You can apply the following steps to solve your issues correspondingly.
1. You should better not use serverless pool as a sink.
1. Don't use 'enable staging' in Source for serverless pool.
1. Only service principal/managed identity that has the permission to the external table data can query it. Grant 'Storage Blob Data Contributor' permission to the external data source for the authentication method that you use in the ADF.
    >[!Note]
    > The user-password authentication can not query external tables. For more information, see [Security model](../synapse-analytics/metadata/database.md#security-model).

1. You can use copy activity to fetch Azure Cosmos DB data from the serverless pool.
1. You can provide the SQL statement that creates the view to the engineering support team, and they can help analyze if the statement hits an authentication issue or something else.


### Load small size data to Data Warehouse without staging is slow 

#### Symptoms
When you load small data to Data Warehouse without staging, it takes a long time to finish. For example, the data size 2 MB but it takes more than 1 hour to finish. 

#### Cause
The row count rather than the size causes this issue. The row count has few thousand, and each insert needs to be packaged into an independent request, go to the control node, start a new transaction, get locks, and go to the distribution node repeatedly. Bulk load gets the lock once, and each distribution node performs the insert by batching into memory efficiently.

If 2 MB is inserted as just a few records, it would be fast. For example, it would be fast if each record is 500 kb * 4 rows. 

#### Recommendation
You need to enable staging to improve the performance.


### Read empty string value ("") as NULL with the enable staging 

#### Symptoms
When you use Synapse as a source in the data flow such as previewing data and debugging/triggering run and enable staging to use the PolyBase, if your column value contains empty string value (`""`), it is changed to null.

#### Cause
The data flow back end uses Parquet as the PolyBase format, and there's a known limitation in the Synapse SQL pool gen2, which automatically changes the empty string value to null.

#### Recommendation
You can try to solve this issue by the following methods:
1. If your data size isn't huge, you can disable **Enable staging** in the Source, but the performance is affected.
1. If you need to enable staging, you can use **iifNull()** function to manually change the specific column from null to empty string value.

### Managed service identity error

#### Symptoms
When you use the Synapse as a source/sink in the data flow to preview data, debug/trigger run, etc. and enable staging to use the PolyBase, and the staging store's linked service (Blob, Gen2, etc.) is created to use the Managed Identity (MI) authentication, your job could fail with the following error shown in the picture: <br/>

:::image type="content" source="./media/data-flow-troubleshoot-connector-format/service-identity-error.png" alt-text="Screenshot that shows the service identity error.":::

#### Error message
`shaded.msdataflow.com.microsoft.sqlserver.jdbc.SQLServerException: Managed Service Identity has not been enabled on this server. Please enable Managed Service Identity and try again.`

#### Cause
1. If the SQL pool is created from Synapse workspace, MI authentication on staging store with the PolyBase isn't supported for the old SQL pool. 
1. If the SQL pool is the old Data Warehouse (DWH) version, MI of the SQL server isn't assigned to the staging store.

#### Recommendation
Confirm the SQL pool was created from the Azure Synapse workspace.

- If the SQL pool was created from the Azure Synapse workspace, no extra steps are necessary. You no longer need to re-register the Managed Identity (MI) of the workspace. The system assigned managed identity (SA-MI) of the workspace is a member of the Synapse Administrator role and thus has elevated privileges on the dedicated SQL pools of the workspace.
- If the SQL pool is a dedicated SQL pool (formerly SQL DW) predating Azure Synapse, only enable MI for your SQL server and assign the permission of the staging store to the MI of your SQL Server. You can refer to the steps in this article as an example: [Use virtual network service endpoints and rules for servers in Azure SQL Database](/azure/azure-sql/database/vnet-service-endpoint-rule-overview#steps).

### Failed with an error: "SQLServerException: Not able to validate external location because the remote server returned an error: (403)"

#### Symptoms

When you use SQLDW as a sink to trigger and run data flow activities, the activity might fail with error like: `"SQLServerException: Not able to validate external location because the remote server returned an error: (403)"`

#### Cause
1. When you use the managed identity in the authentication method in the ADLS Gen2 account as staging, you might not set the authentication configuration correctly.
1. With the virtual network integration runtime, you need to use the managed identity in the authentication method in the ADLS Gen2 account as staging. If your staging Azure Storage is configured with the virtual network service endpoint, you must use managed identity authentication with "allow trusted Microsoft service" enabled on the storage account.
1. Check whether your folder name contains the space character or other special characters, for example:
`Space " < > # % |`.
Currently folder names that contain certain special characters aren't supported in the Data Warehouse copy command.

#### Recommendation

For Cause 1, you can refer to the following document: [Use virtual network service endpoints and rules for servers in Azure SQL Database-Steps](/azure/azure-sql/database/vnet-service-endpoint-rule-overview#steps) to solve this issue.

For Cause 2, work around it with one of the following options:

- Option-1: If you use the virtual network integration runtime, you need to use the managed identity in the authentication method in the ADLS GEN 2 account as staging.

- Option-2: If your staging Azure Storage is configured with the virtual network service endpoint, you must use managed identity authentication with "allow trusted Microsoft service" enabled on the storage account. You can refer to this doc: [Staged copy by using PolyBase](./connector-azure-sql-data-warehouse.md#staged-copy-by-using-polybase) for more information.

For Cause 3, work around it with one of the following options:

- Option-1: Rename the folder and avoid using special characters in the folder name.
- Option-2: Remove the property `allowCopyCommand:true` in the data flow script, for example:

    :::image type="content" source="./media/data-flow-troubleshoot-connector-format/remove-allow-copy-command-true.png" alt-text="Screenshot that shows how to remove 'allowcopycommand:true'."::: 

### Failed with an error: "shaded.msdataflow.com.microsoft.sqlserver.jdbc.SQLServerException: User doesn't have permission to perform this action."

#### Symptoms

When you use Azure Synapse Analytics as a source/sink and use PolyBase staging in data flows, you meet the following error: <br/>

`shaded.msdataflow.com.microsoft.sqlserver.jdbc.SQLServerException: User does not have permission to perform this action.`

#### Cause

PolyBase requires certain permissions in your Synapse SQL server to work. 

#### Recommendation

Grant these permissions in your Synapse SQL server when you use PolyBase:

**ALTER ANY SCHEMA**<br/>
**ALTER ANY EXTERNAL DATA SOURCE**<br/>
**ALTER ANY EXTERNAL FILE FORMAT**<br/>
**CONTROL DATABASE**<br/>

## Common Data Model format

### Model.json files with special characters

#### Symptoms 
You might encounter an issue that the final name of the model.json file contains special characters.  

#### Error message  
`at Source 'source1': java.lang.IllegalArgumentException: java.net.URISyntaxException: Relative path in absolute URI: PPDFTable1.csv@snapshot=2020-10-21T18:00:36.9469086Z. ` 

#### Recommendation  
Replace the special chars in the file name, which works in the synapse but not in ADF.  

### No data output in the data preview or after running pipelines

#### Symptoms
When you use the manifest.json for CDM, no data is shown in the data preview or shown after running a pipeline. Only headers are shown. You can see this issue in the picture below.<br/>

:::image type="content" source="./media/data-flow-troubleshoot-connector-format/no-data-output.png" alt-text="Screenshot that shows the no data output symptom.":::

#### Cause
The manifest document describes the CDM folder, for example, what entities that you have in the folder, references of those entities and the data that corresponds to this instance. Your manifest document misses the `dataPartitions` information that indicates ADF where to read the data, and  since it's empty, it returns zero data. 

#### Recommendation
Update your manifest document to have the `dataPartitions` information, and you can refer to this example manifest document to update your document: [Common Data Model metadata: Introducing manifest-Example manifest document](/common-data-model/cdm-manifest#example-manifest-document).

### JSON array attributes are inferred as separate columns

#### Symptoms 
You might encounter an issue where one attribute (string type) of the CDM entity has a JSON array as data. When this data is encountered, ADF infers the data as separate columns incorrectly. As you can see from the following pictures, a single attribute presented in the source (msfp_otherproperties) is inferred as a separate column in the CDM connector's preview.<br/> 

- In the CSV source data (refer to the second column): <br/>

    :::image type="content" source="./media/data-flow-troubleshoot-connector-format/json-array-csv.png" alt-text="Screenshot that shows the attribute in the CSV source data.":::

- In the CDM source data preview: <br/>

    :::image type="content" source="./media/data-flow-troubleshoot-connector-format/json-array-cdm.png" alt-text="Screenshot that shows the separate column in the CDM source data.":::

 
You might also try to map drifted columns and use the data flow expression to transform this attribute as an array. But since this attribute is read as a separate column when reading, transforming to an array does not work.  

#### Cause
This issue is likely caused by the commas within your JSON object value for that column. Since your data file is expected to be a CSV file, the comma indicates that it's the end of a column's value. 

#### Recommendation
To solve this problem, you need to double quote your JSON column and avoid any of the inner quotes with a backslash (`\`). In this way, the contents of that column's value can be read in as a single column entirely.  
  
>[!Note]
>The CDM doesn't inform that the data type of the column value is JSON, yet it informs that it is a string and parsed as such.

### Unable to fetch data in the data flow preview

#### Symptoms
You use CDM with model.json generated by Power BI. When you preview the CDM data using the data flow preview, you encounter an error: `No output data.`

#### Cause
 The following code exists in the partitions in the model.json file generated by the Power BI data flow.
```json
"partitions": [  
{  
"name": "Part001",  
"refreshTime": "2020-10-02T13:26:10.7624605+00:00",  
"location": "https://datalakegen2.dfs.core.windows.net/powerbi/salesEntities/salesPerfByYear.csv @snapshot=2020-10-02T13:26:10.6681248Z"  
}  
```
For this model.json file, the issue is the naming schema of the data partition file has special characters, and supporting file paths with '@' do not exist currently.  

#### Recommendation
Remove the `@snapshot=2020-10-02T13:26:10.6681248Z` part from the data partition file name and the model.json file, and then try again. 

### The corpus path is null or empty

#### Symptoms
When you use CDM in the data flow with the model format, you can't preview the data, and you encounter the error: `DF-CDM_005 The corpus path is null or empty`. The error is shown in the following picture:  

:::image type="content" source="./media/data-flow-troubleshoot-connector-format/corpus-path-error.png" alt-text="Screenshot that shows the corpus path error.":::

#### Cause
Your data partition path in the model.json is pointing to a blob storage location and not your data lake. The location should have the base URL of **.dfs.core.windows.net** for the ADLS Gen2. 

#### Recommendation
To solve this issue, you can refer to this article: [ADF Adds Support for Inline Datasets and Common Data Model to Data Flows](https://techcommunity.microsoft.com/t5/azure-data-factory/adf-adds-support-for-inline-datasets-and-common-data-model-to/ba-p/1441798), and the following picture shows the way to fix the corpus path error in this article.

:::image type="content" source="./media/data-flow-troubleshoot-connector-format/fix-format-issue.png" alt-text="Screenshot that shows how to fix the corpus path error.":::

### Unable to read CSV data files

#### Symptoms 
You use the inline dataset as the common data model with manifest as a source, and you provided the entry manifest file, root path, entity name, and path. In the manifest, you have the data partitions with the CSV file location. Meanwhile, the entity schema and csv schema are identical, and all validations were successful. However, in the data preview, only the schema rather than the data gets loaded and the data is invisible, which is shown in the following picture:

:::image type="content" source="./media/data-flow-troubleshoot-connector-format/unable-read-data.png" alt-text="Screenshot that shows the issue of unable to read data files.":::

#### Cause
Your CDM folder isn't separated into logical and physical models, and only physical models exist in the CDM folder. The following two articles describe the difference: [Logical definitions](/common-data-model/sdk/logical-definitions) and [Resolving a logical entity definition](/common-data-model/sdk/convert-logical-entities-resolved-entities).<br/> 

#### Recommendation
For the data flow using CDM as a source, try to use a logical model as your entity reference, and use the manifest that describes the location of the physical resolved entities and the data partition locations. You can see some samples of logical entity definitions within the public CDM GitHub repository: [CDM-schemaDocuments](https://github.com/microsoft/CDM/tree/master/schemaDocuments)<br/>

A good starting point to forming your corpus is to copy the files within the schema documents folder (just that level inside the GitHub repository), and put those files into a folder. Afterwards, you can use one of the predefined logical entities within the repository (as a starting or reference point) to create your logical model.<br/>

Once the corpus is set up, you're recommended to use CDM as a sink within data flows, so that a well-formed CDM folder can be properly created. You can use your CSV dataset as a source and then sink it to your CDM model that you created.

## CSV and Excel format

### Set the quote character to 'no quote char' isn't supported in the CSV
 
#### Symptoms

There are several issues that aren't supported in the CSV when the quote character is set to 'no quote char':

1. When the quote character is set to 'no quote char', multi-char column delimiter can't start and end with the same letters.
2. When the quote character is set to 'no quote char', multi-char column delimiter can't contain the escape character: `\`.
3. When the quote character is set to 'no quote char', column value can't contain row delimiter.
4. The quote character and the escape character can't both be empty (no quote and no escape) if the column value contains a column delimiter.

#### Cause

Causes of the symptoms are stated below with examples respectively:
1. Start and end with the same letters.<br/>
`column delimiter: $*^$*`<br/>
`column value: abc$*^    def`<br/>
`csv sink: abc$*^$*^$*def ` <br/>
`will be read as "abc" and "^&*def"`<br/>

2. The multi-char delimiter contains escape characters.<br/>
`column delimiter: \x`<br/>
`escape char:\`<br/>
`column value: "abc\\xdef"`<br/>
The escape character either escapes the column delimiter or the escape the character.

3. The column value contains the row delimiter. <br/>
`We need quote character to tell if row delimiter is inside column value or not.`

4. The quote character and the escape character both be empty and the column value contains column delimiters.<br/>
`Column delimiter: \t`<br/>
`column value: 111\t222\t33\t3`<br/>
`It will be ambigious if it contains 3 columns 111,222,33\t3 or 4 columns 111,222,33,3.`<br/>

#### Recommendation
The first symptom and the second symptom can't be solved currently. For the third and fourth symptoms, you can apply the following methods:
- For Symptom 3, don't use the 'no quote char' for a multiline csv file.
- For Symptom 4, set either the quote character or the escape character as nonempty, or you can remove all column delimiters inside your data.

### Read files with different schemas error

#### Symptoms

When you use data flows to read files such as CSV and Excel files with different schemas, the data flow debug, sandbox, or activity run fails.
- For CSV, the data misalignment exists when the schema of files is different. 

    :::image type="content" source="./media/data-flow-troubleshoot-connector-format/schema-error-1.png" alt-text="Screenshot that shows the first schema error.":::

- For Excel, an error occurs when the schema of the file is different.

    :::image type="content" source="./media/data-flow-troubleshoot-connector-format/schema-error-2.png" alt-text="Screenshot that shows the second schema error.":::

#### Cause

Reading files with different schemas in the data flow isn't supported.

#### Recommendation

If you still want to transfer files such as CSV and Excel files with different schemas in the data flow, you can use these ways to work around:

- For CSV, you need to manually merge the schema of different files to get the full schema. For example, file_1 has columns `c_1`, `c_2`, `c_3` while file_2 has columns `c_3`, `c_4`, ... `c_10`, so the merged and the full schema is `c_1`, `c_2`, ... `c_10`. Then make other files also have the same full schema even though it doesn't have data, for example, file_*x* only has columns `c_1`, `c_2`, `c_3`, `c_4`, add columns `c_5`, `c_6`, ... `c_10` in the file to make them consistent with the other files.

- For Excel, you can solve this issue by applying one of the following options:

    - **Option-1**: You need to manually merge the schema of different files to get the full schema. For example, file_1 has columns `c_1`, `c_2`, `c_3` while file_2 has columns `c_3`, `c_4`, ... `c_10`, so the merged and full schema is `c_1`, `c_2`, ... `c_10`. Then make other files also have the same schema even though it doesn't have data, for example, file_x with sheet "SHEET_1" only has columns `c_1`, `c_2`, `c_3`, `c_4`, please add columns `c_5`, `c_6`, ... `c_10` in the sheet too, and then it can work.
    - **Option-2**: Use **range (for example, A1:G100) + firstRowAsHeader=false**, and then it can load data from all Excel files even though the column name and count is different.









## Snowflake

### Unable to connect to the Snowflake linked service

#### Symptoms

You encounter the following error when you create the Snowflake linked service in the public network, and you use the autoresolve integration runtime.

`ERROR [HY000] [Microsoft][Snowflake] (4) REST request for URL https://XXXXXXXX.east-us- 2.azure.snowflakecomputing.com.snowflakecomputing.com:443/session/v1/login-request?requestId=XXXXXXXXXXXXXXXXXXXXXXXXX&request_guid=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX` 

:::image type="content" source="./media/data-flow-troubleshoot-connector-format/connection-fail-error.png" alt-text="Screenshot that shows the connection fail error."::: 

#### Cause

You haven't applied the account name in the format that is given in the Snowflake account document (including extra segments that identify the region and cloud platform), for example, `XXXXXXXX.east-us-2.azure`. You can refer to this document: [Linked service properties](./connector-snowflake.md#linked-service-properties) for more information.

#### Recommendation

To solve the issue, change the account name format. The role should be one of the roles shown in the following picture, but the default one is **Public**.

:::image type="content" source="./media/data-flow-troubleshoot-connector-format/account-role.png" alt-text="Screenshot that shows the account roles."::: 

### SQL access control error: "Insufficient privileges to operate on schema"

#### Symptoms

When you try to use "import projection", "data preview", etc. in the Snowflake source of data flows, you meet errors like `net.snowflake.client.jdbc.SnowflakeSQLException: SQL access control error: Insufficient privileges to operate on schema`.

#### Cause

You meet this error because of the wrong configuration. When you use the data flow to read Snowflake data, the runtime Azure Databricks (ADB) isn't directly select the query to Snowflake. Instead, a temporary stage are created, and data are pulled from tables to the stage and then compressed and pulled by ADB. This process is shown in the picture below.

:::image type="content" source="./media/data-flow-troubleshoot-connector-format/snowflake-data-read-model.png" alt-text=" Screenshot that shows the Snowflake data read model."::: 

So the user/role used in ADB should have necessary permission to do this in the Snowflake. But usually the user/role don't have the permission since the database is created on the share. 

#### Recommendation
To solve this issue, you can create different database and create views on the top of the shared DB to access it from ADB. For more details, please refer to [Snowflake](https://community.snowflake.com/s/question/0D50Z000095ktE4SAI/insufficient-privileges-to-operate-on-schema).

### Failed with an error: "SnowflakeSQLException: IP x.x.x.x isn't allowed to access Snowflake. Contact your local security administrator"

#### Symptoms

When you use snowflake in Azure Data Factory, you can successfully use test-connection in the Snowflake linked service, preview-data/import-schema on Snowflake dataset and run copy/lookup/get-metadata or other activities with it. But when you use Snowflake in the data flow activity, you might see an error like `SnowflakeSQLException: IP 13.66.58.164 is not allowed to access Snowflake. Contact your local security administrator.`

#### Cause

The Azure Data Factory data flow doesn't support the use of fixed IP ranges. For more information, see [Azure Integration Runtime IP addresses](./azure-integration-runtime-ip-addresses.md).

#### Recommendation

To solve this issue, you can change the Snowflake account firewall settings with the following steps:

1. You can get the IP range list of service tags from the "service tags IP range download link": [Discover service tags by using downloadable JSON files](../virtual-network/service-tags-overview.md#discover-service-tags-by-using-downloadable-json-files).

    :::image type="content" source="./media/data-flow-troubleshoot-connector-format/ip-range-list.png" alt-text="Screenshot that shows the IP range list."::: 

1. If you run a data flow in the "southcentralus" region, you need to allow the access from all addresses with name "AzureCloud.southcentralus", for example:

    :::image type="content" source="./media/data-flow-troubleshoot-connector-format/allow-access-with-name.png" alt-text="Screenshot that shows how to allow access from all addresses with the certain name."::: 

### Queries in the source doesn't work

#### Symptoms

When you try to read data from Snowflake with query, you might see an error like these:

1. `SQL compilation error: error line 1 at position 7 invalid identifier 'xxx'`
2. `SQL compilation error: Object 'xxx' does not exist or not authorized.`

#### Cause

You encounter this error because of your wrong configuration.

#### Recommendation

For Snowflake, it applies the following rules for storing identifiers at creation/definition time and resolving them in queries and other SQL statements:

When an identifier (table name, schema name, column name, etc.) is unquoted, it's stored and resolved in uppercase by default, and it's case-in-sensitive. For example:

:::image type="content" source="./media/data-flow-troubleshoot-connector-format/unquoted-identifier.png" alt-text="Screenshot that shows the example of unquoted identifier." lightbox="./media/data-flow-troubleshoot-connector-format/unquoted-identifier.png"::: 

Because it's case-in-sensitive, so you can feel free to use following query to read snowflake data while the result is the same:<br/>
- `Select MovieID, title from Public.TestQuotedTable2`<br/>
- `Select movieId, title from Public.TESTQUOTEDTABLE2`<br/>
- `Select movieID, TITLE from PUBLIC.TESTQUOTEDTABLE2`<br/>

When an identifier (table name, schema name, column name, etc.) is double-quoted, it's stored and resolved exactly as entered, including case as it is case-sensitive, and you can see an example in the following picture. For more details, please refer to this document: [Identifier Requirements](https://docs.snowflake.com/en/sql-reference/identifiers-syntax.html#identifier-requirements).

:::image type="content" source="./media/data-flow-troubleshoot-connector-format/double-quoted-identifier.png" alt-text="Screenshot that shows the example of double quoted identifier." lightbox="./media/data-flow-troubleshoot-connector-format/double-quoted-identifier.png"::: 

Because the case-sensitive identifier (table name, schema name, column name, etc.) has lowercase character, you must quote the identifier during data reading with the query, for example: <br/>

- Select **"movieId"**, **"title"** from Public.**"testQuotedTable2"**

If you meet up error with the Snowflake query, check whether some identifiers (table name, schema name, column name, etc.) are case-sensitive with the following steps:

1. Sign in to the Snowflake server (`https://{accountName}.azure.snowflakecomputing.com/`, replace {accountName} with your account name) to check the identifier (table name, schema name, column name, etc.).

1. Create worksheets to test and validate the query:
    - Run `Use database {databaseName}`, replace {databaseName} with your database name.
    - Run a query with table, for example: `select "movieId", "title" from Public."testQuotedTable2"`
    
1. After the SQL query of Snowflake is tested and validated, you can use it in the data flow Snowflake source directly.

### The expression type doesn't match the column data type, expecting VARIANT but got VARCHAR 

#### Symptoms

When you try to write data into the Snowflake table, you might meet the following error:

`java.sql.BatchUpdateException: SQL compilation error: Expression type does not match column data type, expecting VARIANT but got VARCHAR`

#### Cause

The column type of input data is string, which is different from the VARIANT type of the related column in the Snowflake sink.

When you store data with complex schemas (array/map/struct) in a new Snowflake table, the data flow type is automatically converted into its physical type VARIANT.

:::image type="content" source="./media/data-flow-troubleshoot-connector-format/physical-type-variant.png" alt-text="Screenshot that shows the VARIANT type in a table."::: 

The related values are stored as JSON strings, showing in the picture below.

:::image type="content" source="./media/data-flow-troubleshoot-connector-format/json-string.png" alt-text="Screenshot that shows the stored JSON string."::: 

#### Recommendation

For the Snowflake VARIANT, it can only accept the data flow value that is struct or map or array type. If the value of your input data column is JSON or XML or other strings, use one of the following options to solve this issue:

- **Option-1**: Use [parse transformation](./data-flow-parse.md) before using Snowflake as a sink to covert the input data column value into struct or map or array type, for example:

    :::image type="content" source="./media/data-flow-troubleshoot-connector-format/parse-transformation.png" alt-text="Screenshot that shows the parse transformation."::: 

    > [!Note]
    > The value of the Snowflake column with VARIANT type is read as string in Spark by default.

- **Option-2**: Sign in to your Snowflake server (`https://{accountName}.azure.snowflakecomputing.com/`, replace {accountName} with your account name) to change the schema of your Snowflake target table. Apply the following steps by running the query under each step.
    1. Create one new column with VARCHAR to store the values. <br/>
        ```SQL
        alter table tablename add newcolumnname varchar;
        ```    
    1. Copy the value of VARIANT into the new column. <br/>
    
        ```SQL
        update tablename t1 set newcolumnname = t1."details"
        ```
    1. Delete the unused VARIANT column. <br/>
        ```SQL
        alter table tablename drop column "details";
        ```
    1. Rename the new column to the old name. <br/>
        ```SQL
        alter table tablename rename column newcolumnname to "details";
        ```

## Related content
For more help with troubleshooting, see these resources:

*  [Troubleshoot mapping data flows in Azure Data Factory](data-flow-troubleshoot-guide.md)
*  [Data Factory blog](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/bg-p/AzureDataFactoryBlog)
*  [Data Factory feature requests](/answers/topics/azure-data-factory.html)
*  [Azure videos](https://azure.microsoft.com/resources/videos/index/?sort=newest&services=data-factory)
*  [Stack Overflow forum for Data Factory](https://stackoverflow.com/questions/tagged/azure-data-factory)
*  [Twitter information about Data Factory](https://twitter.com/hashtag/DataFactory)

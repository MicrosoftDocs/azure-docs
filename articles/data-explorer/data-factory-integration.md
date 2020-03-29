---
title: 'Azure Data Explorer integration with Azure Data Factory'
description: 'In this topic, integrate Azure Data Explorer with Azure Data Factory to use the copy, lookup, and command activities'
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: tomersh26
ms.service: data-explorer
ms.topic: conceptual
ms.date: 01/20/2020

#Customer intent: I want to use Azure Data Factory to integrate with Azure Data Explorer.
---

# Integrate Azure Data Explorer with Azure Data Factory

[Azure Data Factory](/azure/data-factory/) (ADF) is a cloud-based data integration service that allows you to integrate different data stores and perform activities on the data. ADF allows you to create data-driven workflows for orchestrating and automating data movement and data transformation. Azure Data Explorer is one of the [supported data stores](/azure/data-factory/copy-activity-overview#supported-data-stores-and-formats) in Azure Data Factory. 

## Azure Data Factory activities for Azure Data Explorer

Various integrations with Azure Data Factory are available for Azure Data Explorer users:

### Copy activity
 
Azure Data Factory Copy activity is used to transfer data between data stores. Azure Data Explorer is supported as a source, where data is copied from Azure Data Explorer to any supported data store, and a sink, where data is copied from any supported data store to Azure Data Explorer. For more information, see [copy data to or from Azure Data Explorer using Azure Data Factory](/azure/data-factory/connector-azure-data-explorer). and for a detailed walk-through see [load data from Azure Data Factory into Azure Data Explorer](data-factory-load-data.md).
Azure Data Explorer is supported by Azure IR (Integration Runtime), used when data is copied within Azure, and self-hosted IR, used when copying data from/to data stores located on-premises or in a network with access control, such as an Azure Virtual Network. For more information, see [which IR to use](/azure/data-factory/concepts-integration-runtime#determining-which-ir-to-use)
 
> [!TIP]
> When using the copy activity and creating a **Linked Service** or a **Dataset**, select the data store **Azure Data Explorer (Kusto)** and not the old data store **Kusto**.  

### Lookup activity
 
The Lookup activity is used for executing queries on Azure Data Explorer. The result of the query will be returned as the output of the Lookup activity, and can be used in the next activity in the pipeline as described in the [ADF Lookup documentation](/azure/data-factory/control-flow-lookup-activity#use-the-lookup-activity-result-in-a-subsequent-activity).  
In addition to the response size limit of 5,000 rows and 2 MB, the activity also has a query timeout limit of 1 hour.

### Command activity

The Command activity allows the execution of Azure Data Explorer [control commands](/azure/kusto/concepts/#control-commands). Unlike queries, the control commands can potentially modify data or metadata. Some of the control commands are targeted to ingest data into Azure Data Explorer, using commands such as `.ingest`or `.set-or-append`) or copy data from Azure Data Explorer to external data stores using commands such as `.export`.
For a detailed walk-through of the command activity, see [use Azure Data Factory command activity to run Azure Data Explorer control commands](data-factory-command-activity.md).  Using a control command to copy data can, at times, be a faster and cheaper option than the Copy activity. To determine when to use the Command activity versus the Copy activity, see [select between Copy and Command activities when copying data](#select-between-copy-and-azure-data-explorer-command-activities-when-copy-data).

### Copy in bulk from a database template

The [Copy in bulk from a database to Azure Data Explorer by using the Azure Data Factory template](data-factory-template.md) is a predefined Azure Data Factory pipeline. The template is used to create many pipelines per database or per table for faster data copying. 

### Mapping data flows 

[Azure Data Factory mapping data flows](/azure/data-factory/concepts-data-flow-overview) are visually designed data transformations that allow data engineers to develop graphical data transformation logic without writing code. To create a data flow and ingest data to Azure Data Explorer, use the following method:

1. Create the [mapping data flow](/azure/data-factory/data-flow-create).
1. [Export the data into Azure Blob](/azure/data-factory/data-flow-sink). 
1. Define [Event Grid](/azure/data-explorer/ingest-data-event-grid) or [ADF copy activity](/azure/data-explorer/data-factory-load-data) to ingest the data to Azure Data Explorer.

## Select between Copy and Azure Data Explorer Command activities when copy data 

This section will assist you in selecting the correct activity for your data copying needs.

When copying data from or to Azure Data Explorer, there are two available options in Azure Data Factory:
* Copy activity.
* Azure Data Explorer Command activity, which executes one of the control commands that transfer data in Azure Data Explorer. 

### Copy data from Azure Data Explorer
  
You can copy data from Azure Data Explorer using the copy activity or the [`.export`](/azure/kusto/management/data-export/) command. The `.export` command executes a query, and then exports the results of the query. 

See the following table for a comparison of the Copy activity and `.export` command for copying data from Azure Data Explorer.

| | Copy activity | .export command |
|---|---|---|
| **Flow description** | ADF executes a query on Kusto, processes the result, and sends it to the target data store. <br>(**ADX > ADF > sink data store**) | ADF sends an `.export` control command to Azure Data Explorer, which executes the command, and sends the data directly to the target data store. <br>(**ADX > sink data store**) |
| **Supported target data stores** | A wide variety of [supported data stores](/azure/data-factory/copy-activity-overview#supported-data-stores-and-formats) | ADLSv2, Azure Blob, SQL Database |
| **Performance** | Centralized | <ul><li>Distributed (default), exporting data from multiple nodes concurrently</li><li>Faster and COGS efficient.</li></ul> |
| **Server limits** | [Query limits](/azure/kusto/concepts/querylimits) can be extended/disabled. By default, ADF queries contain: <ul><li>Size limit of 500,000 records or 64 MB.</li><li>Time limit of 10 minutes.</li><li>`noTruncation` set to false.</li></ul> | By default, extends or disables the query limits: <ul><li>Size limits are disabled.</li><li>Server timeout is extended to 1 hour.</li><li>`MaxMemoryConsumptionPerIterator` and `MaxMemoryConsumptionPerQueryPerNode` are extended to max (5 GB, TotalPhysicalMemory/2).</li></ul>

> [!TIP]
> If your copy destination is one of the data stores supported by the `.export` command, and if none of the Copy activity features is crucial to your needs, select the `.export` command.

### Copying data to Azure Data Explorer

You can copy data to Azure Data Explorer using the copy activity or ingestion commands such as [ingest from query](/azure/kusto/management/data-ingestion/ingest-from-query) (`.set-or-append`, `.set-or-replace`, `.set`, `.replace)`, and [ingest from storage](/azure/kusto/management/data-ingestion/ingest-from-storage) (`.ingest`). 

See the following table for a comparison of the Copy activity, and ingestion commands for copying data to Azure Data Explorer.

| | Copy activity | Ingest from query<br> `.set-or-append` / `.set-or-replace` / `.set` / `.replace` | Ingest from storage <br> `.ingest` |
|---|---|---|---|
| **Flow description** | ADF gets the data from the source data store, converts it into a tabular format, and does the required schema-mapping changes. ADF then uploads the data to Azure blobs, splits it into chunks, then downloads the blobs to ingest them into the ADX table. <br> (**Source data store > ADF > Azure blobs > ADX**) | These commands can execute a query or a `.show` command, and ingest the results of the query into a table (**ADX > ADX**). | This command ingests data into a table by "pulling" the data from one or more cloud storage artifacts. |
| **Supported source data stores** |  [variety of options](/azure/data-factory/copy-activity-overview#supported-data-stores-and-formats) | ADLS Gen 2, Azure Blob, SQL (using the sql_request plugin), Cosmos (using the cosmosdb_sql_request plugin), and any other data store that provides HTTP or Python APIs. | Filesystem, Azure Blob Storage, ADLS Gen 1, ADLS Gen 2 |
| **Performance** | Ingestions are queued and managed, which ensures small-size ingestions and assures high availability by providing load balancing, retries and error handling. | <ul><li>Those commands weren't designed for high volume data importing.</li><li>Works as expected and cheaper. But for production scenarios and when traffic rates and data sizes are large, use the Copy activity.</li></ul> |
| **Server Limits** | <ul><li>No size limit.</li><li>Max timeout limit: 1 hour per ingested blob. |<ul><li>There's only a size limit on the query part, which can be skipped by specifying `noTruncation=true`.</li><li>Max timeout limit: 1 hour.</li></ul> | <ul><li>No size limit.</li><li>Max timeout limit: 1 hour.</li></ul>|

> [!TIP]
> * When copying data from ADF to Azure Data Explorer use the `ingest from query` commands.  
> * For large data sets (>1GB), use the Copy activity.  

## Required permissions

The following table lists the required permissions for various steps in the integration with Azure Data Factory.

| Step | Operation | Minimum level of permissions | Notes |
|---|---|---|---|
| **Create a Linked Service** | Database navigation | *database viewer* <br>The logged-in user using ADF should be authorized to read database metadata. | User can provide the database name manually. |
| | Test Connection | *database monitor* or *table ingestor* <br>Service principal should be authorized to execute database level `.show` commands or table level ingestion. | <ul><li>TestConnection verifies the connection to the cluster, and not to the database. It can succeed even if the database doesn’t exist.</li><li>Table admin permissions aren't sufficient.</li></ul>|
| **Creating a Dataset** | Table navigation | *database monitor* <br>The logged in user using ADF, must be authorized to execute database level `.show` commands. | User can provide table name manually.|
| **Creating a Dataset** or **Copy Activity** | Preview data | *database viewer* <br>Service principal must be authorized to read database metadata. | | 
|   | Import schema | *database viewer* <br>Service principal must be authorized to read database metadata. | When ADX is the source of a tabular-to-tabular copy, ADF will import schema automatically, even if the user didn’t import schema explicitly. |
| **ADX as Sink** | Create a by-name column mapping | *database monitor* <br>Service principal must be authorized to execute database level `.show` commands. | <ul><li>All mandatory operations will work with *table ingestor*.</li><li> Some optional operations can fail.</li></ul> |
|   | <ul><li>Create a CSV mapping on the table</li><li>Drop the mapping</li></ul>| *table ingestor* or *database admin* <br>Service principal must be authorized to make changes to a table. | |
|   | Ingest data | *table ingestor* or *database admin* <br>Service principal must be authorized to make changes to a table. | | 
| **ADX as source** | Execute query | *database viewer* <br>Service principal must be authorized to read database metadata. | |
| **Kusto command** | | According to the permissions level of each command. |

## Performance 

If Azure Data Explorer is the source and you use the Lookup, copy, or command activity that contains a query where, refer to [query best practices](/azure/kusto/query/best-practices) for performance information and [ADF documentation for copy activity](/azure/data-factory/copy-activity-performance).
  
This section addresses the use of copy activity where Azure Data Explorer is the sink. The estimated throughput for Azure Data Explorer sink is 11-13 MBps. The following table details the parameters influencing the performance of the Azure Data Explorer sink.

| Parameter | Notes |
|---|---|
| **Components geographical proximity** | Place all components in the same region:<ul><li>source and sink data stores.</li><li>ADF integration runtime.</li><li>Your ADX cluster.</li></ul>Make sure that at least your integration runtime is in the same region as your ADX cluster. |
| **Number of DIUs** | 1 VM for every 4 DIUs used by ADF. <br>Increasing the DIUs will help only if your source is a file-based store with multiple files. Each VM will then process a different file in parallel. Therefore, copying a single large file will have a higher latency than copying multiple smaller files.|
|**Amount and SKU of your ADX cluster** | High number of ADX nodes will boost ingestion processing time.|
| **Parallelism** |	To copy a very large amount of data from a database, partition your data and then use a ForEach loop that copies each partition in parallel or use the [Bulk Copy from Database to Azure Data Explorer Template](data-factory-template.md). Note: **Settings** > **Degree of Parallelism** in the Copy activity isn't relevant to ADX. |
| **Data processing complexity** | Latency varies according to source file format, column mapping, and compression.|
| **The VM running your integration runtime** | <ul><li>For Azure copy, ADF VMs and machine SKUs can't be changed.</li><li> For on-prem to Azure copy, determine that the VM hosting your self-hosted IR is strong enough.</li></ul>|

## Tips and common pitfalls

### Monitor activity progress

* When monitoring the activity progress, the *Data written* property may be much larger than the *Data read* property
because *Data read* is calculated according to the binary file size, while *Data written* is calculated according to the in-memory size, after data is de-serialized and decompressed.

* When monitoring the activity progress, you can see that data is written to the Azure Data Explorer sink. When querying the Azure Data Explorer table, you see that data hasn't arrived. This is because there are two stages when copying to Azure Data Explorer. 
    * First stage reads the source data, splits it to 900-MB chunks, and uploads each chunk to an Azure Blob. The first stage is seen by the ADF activity progress view. 
    * The second stage begins once all the data is uploaded to Azure Blobs. The Azure Data Explorer engine nodes download the blobs and ingest the data into the sink table. The data is then seen in your Azure Data Explorer table.

### Failure to ingest CSV files due to improper escaping

Azure Data Explorer expects CSV files to align with [RFC 4180](https://www.ietf.org/rfc/rfc4180.txt).
It expects:
* Fields that contain characters that require escaping (such as " and new lines) should start and end with a **"** character, without whitespace. All **"** characters *inside* the field are escaped by using a double **"** character (**""**). For example, _"Hello, ""World"""_ is a valid CSV file with a single record having a single column or field with the content _Hello, "World"_.
* All records in the file must have the same number of columns and fields.

Azure Data Factory allows the backslash (escape) character. If you generate a CSV file with a backslash character using Azure Data Factory, ingestion of the file to Azure Data Explorer will fail.

#### Example

The following text values:
Hello, "World"<br/>
ABC   DEF<br/>
"ABC\D"EF<br/>
"ABC DEF<br/>

Should appear in a proper CSV file as follows:
"Hello, ""World"""<br/>
"ABC   DEF"<br/>
"""ABC DEF"<br/>
"""ABC\D""EF"<br/>

By using the default escape character (backslash), the following CSV won't work with Azure Data Explorer:
"Hello, \"World\""<br/>
"ABC   DEF"<br/>
"\"ABC DEF"<br/>
"\"ABC\D\"EF"<br/>

### Nested JSON objects

When copying a JSON file to Azure Data Explorer, note that:
* Arrays aren't supported.
* If your JSON structure contains object data types, Azure Data Factory will flatten the object's child items, and try to map each child item to a different column in your Azure Data Explorer table. If you want the entire object item to be mapped to a single column in Azure Data Explorer:
    * Ingest the entire JSON row into a single dynamic column in Azure Data Explorer.
    * Manually edit the pipeline definition by using Azure Data Factory's JSON editor. In **Mappings**
       * Remove the multiple mappings that were created for each child item, and add a single mapping that maps your object type to your table column.
       * After the closing square bracket, add a comma followed by:<br/>
       `"mapComplexValuesToString": true`.

### Specify AdditionalProperties when copying to Azure Data Explorer

> [!NOTE]
> This feature is currently available by manually editing the JSON payload. 

Add a single row under the “sink” section of the copy activity as follows:

```json
"sink": {
    "type": "AzureDataExplorerSink",
    "additionalProperties": "{\"tags\":\"[\\\"drop-by:account_FiscalYearID_2020\\\"]\"}"
},
```

Escaping of the value may be tricky. Use the following code snippet as a reference:

```csharp
static void Main(string[] args)
{
       Dictionary<string, string> additionalProperties = new Dictionary<string, string>();
       additionalProperties.Add("ignoreFirstRecord", "false");
       additionalProperties.Add("csvMappingReference", "Table1_mapping_1");
       IEnumerable<string> ingestIfNotExists = new List<string> { "Part0001" };
       additionalProperties.Add("ingestIfNotExists", JsonConvert.SerializeObject(ingestIfNotExists));
       IEnumerable<string> tags = new List<string> { "ingest-by:Part0001", "ingest-by:IngestedByTest" };
       additionalProperties.Add("tags", JsonConvert.SerializeObject(tags));
       var additionalPropertiesForPayload = JsonConvert.SerializeObject(additionalProperties);
       Console.WriteLine(additionalPropertiesForPayload);
       Console.ReadLine();
}
```

The printed value:

```json
{"ignoreFirstRecord":"false","csvMappingReference":"Table1_mapping_1","ingestIfNotExists":"[\"Part0001\"]","tags":"[\"ingest-by:Part0001\",\"ingest-by:IngestedByTest\"]"}
```

## Next steps

* Learn how to [copy data to Azure Data Explorer by using Azure Data Factory](data-factory-load-data.md).
* Learn about using [Azure Data Factory template for bulk copy from database to Azure Data Explorer](data-factory-template.md).
* Learn about using [Azure Data Factory command activity to run Azure Data Explorer control commands](data-factory-command-activity.md).
* Learn about [Azure Data Explorer queries](/azure/data-explorer/web-query-data) for data querying.




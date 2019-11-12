---
title: 'Azure Data Explorer integration with Azure Data Factory'
description: 'In this topic, integrate Azure Data Explorer with Azure Data Factory to use the copy, lookup, and command activities'
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: tomersh26
ms.service: data-explorer
ms.topic: conceptual
ms.date: 11/12/2019

#Customer intent: I want to use Azure Data Factory to integrate with Azure Data Explorer.
---

# Azure Data Explorer integration with Azure Data Factory

[Azure Data Factory](/azure/data-factory/) (ADF) is a cloud-based data integration service that allows you to integrate different data stores and perform activities on the data. ADF allows you to create data-driven workflows for orchestrating and automating data movement and data transformation. Azure Data Explorer is one of the [supported data stores](/azure/data-factory/copy-activity-overview#supported-data-stores-and-formats) in Azure Data Factory. 

## Azure Data Factory activities for Azure Data Explorer

Various integrations with Azure Data Factory are available for Azure Data Explorer users:

### Copy activity
 
Azure Data Factory Copy activity is used to transfer data between data stores. Azure Data Explorer is supported as a source, where data is copied from Azure Data Explorer to any supported data store, and a sink, where data is copied from any supported data store to Azure Data Explorer. For more information see [copy data to or from Azure Data Explorer using Azure Data Factory](/azure/data-factory/connector-azure-data-explorer). and for a detailed walk-through see [load data from Azure Data Factory into Azure Data Explorer](data-factory-load-data.md).
Azure Data Explorer is supported by Azure IR (Integration Runtime), used when data is copied within Azure, and self-hosted IR, used when copying data from/to data stores located on-premises or in a network with access control, such as an Azure Virtual Network. For more information see [which IR to use](azure/data-factory/concepts-integration-runtime#determining-which-ir-to-use)
 
> [!TIP]
> When using the copy activity and creating a **Linked Service** or a **Dataset**, select the data store **Azure Data Explorer (Kusto)** and not the old data store **Kusto**.  

### Lookup activity
 
The Lookup activity is used for executing queries on Azure Data Explorer. The result of the query will be returned as the output of the Lookup activity, and therefore, can be used in the next activity in the pipeline as described in the [ADF Lookup documentation](/azure/data-factory/control-flow-lookup-activity#use-the-lookup-activity-result-in-a-subsequent-activity).  
In addition to the response size limit of 5,000 rows and 2MB, the activity also has a query timeout limit of 1 hour.

### Command activity

The Command activity allows the execution of Azure Data Explorer [control commands](/azure/kusto/concepts/#control-commands). Unlike queries, the control commands can potentially modify data or metadata. Some of the control commands are targeted to ingest data into Azure Data Explorer, using commands such as `.ingest`or `.set-or-append`) or copy data from Azure Data Explorer to external data stores using commands such as `.export`.
For a detailed walk-through of the command activity, see [use Azure Data Factory command activity to run Azure Data Explorer control commands](data-factory-command-activity.md).  Using a control command to copy data can, at times, be a faster and cheaper option than the Copy activity. To determine when to use the Command activity versus the Copy activity, see [select the correct activity for copying data](#select-the-correct-activity-for-copying-data).

### Copy in bulk from a database template

The [Copy in bulk from a database to Azure Data Explorer by using the Azure Data Factory template](data-factory-template.md) is a predefined Azure Data Factory pipeline. The template is used to create many pipelines per database or per table for faster data copying. 

## Select between Copy and Azure Data Explorer Command activities when copying data 

When copying data from or to Azure Data Explorer, there are two available options in Azure Data Factory:
1. Use the Copy activity.
2. Use the Azure Data Explorer Command activity, and execute one of the control commands that transfer data in Azure Data Explorer. This section will assist you in selecting the correct activity for your needs.

### Copying data from Azure Data Explorer
  
You can copy data from Azure Data Explorer using the copy activity or the `.export` command. The `.export` command executes a query, and then exports the results of the query. 

See the following table for a comparison of the Copy activity and `.export` command for copying data from Azure Data Explorer.

| | Copy activity | .export command |
|---|---|---|
| **Flow description** | ADF executes a query on Kusto, processes the result, and sends it to the target data store. <br>(**ADX > ADF > sink data store**) | ADF sends an .export control command to Azure Data Explorer which executes the command, and sends the data directly to the target data store. <br>(**ADX > sink data store**) |
| **Supported target data stores** | A wide variety of [supported data stores](/azure/data-factory/copy-activity-overview#supported-data-stores-and-formats) | ADLSv2, Azure Blob, SQL Database |
| **Performance** | Centralized | Distributed (default), exporting data from multiple nodes concurrently<br>Faster and COGS efficient. |
| **Server limits** | Query limits can be extended/disabled. By default, ADF queries contain: <ul><li>Size limit of 500,000 records or 64 MB.</li><li>Time limit of 10 minutes.</li><li>noTruncation set to false.</li></ul> | By default, extends or disables the query limits: <ul><li>Size limits are disabled.</li><li>Server timeout is extended to 1 hour.</li><li>*MaxMemoryConsumptionPerIterator* and *MaxMemoryConsumptionPerQueryPerNode* are extended to max (5 GB, TotalPhysicalMemory/2).</li></ul>

> [!TIP]
> If your copy destination is one of the data stores supported by the `.export` command, and if none of the Copy activity features is crucial to your needs, select the `.export` command.

### Copying data to Azure Data Explorer

**Rule of thumb 1:** When copying data from ADX to ADX: Prefer the ‘ingest from query’ commands.  
**Rule of thumb 2:** For large data sets (>1GB), prefer the Copy activity.  
| | Copy Activity | Ingest from query <br> .set-or-append / .set-or-replace / .set / .replace | Ingest from storage <br> .ingest |
|---|---|---|---|
| **Flow description** | ADF fetches the data from the source data store, convert it into a tabular format, performs the required schema mapping changes, uploads the data to Azure blobs split to chunks, and when that process finishes – ADF downloads all these blobs and ingests them into ADX table. <br> (Flow: Source data store -> ADF -> Azure blobs -> ADX) | These commands execute a query or a .show command, and ingest the results of the query into a table. Using the *externaldata* operator, allows using these commands where the source data is a data read from an external raw file. <br> (Flows: 1. ADX -> ADX;  2. External raw file -> ADX) | This command ingests data into a table by "pulling" the data from one or more cloud storage artifacts. |
| **Supported source data stores** | A wide variety of options: [link](https://docs.microsoft.com/en-us/azure/data-factory/copy-activity-overview#supported-data-stores-and-formats) | ADLS Gen 2, Azure Blob, SQL (using the sql_request plugin), Cosmos (using the cosmosdb_sql_request plugin), and practically any data store which provides an HTTP or Python APIs. | Filesystem, Azure Blob Storage, ADLS Gen 1, ADLS Gen 2 |
| **Performance** | Ingestions are queued and managed by your Data Management cluster, which assures higher availability, by providing load balancing, retries and error handling, and ensures smaller size ingestions). | Those commands were not designed for high volume data importing. <br>They work as expected, and even considered cheaper than using the copy activity via ADF, but for production scenarios and mainly when traffic rates and data sizes are large, it would be recommended to use the copy activity. 
| **Server Limits** | No size limit. <br> Max timeout limit – 1 hour per ingested blob. | There is only a size limit on the query part, which can be skipped by specifying noTruncation=true. <br>Max timeout limit – 1 hour. | No size limit. <br>Max timeout limit – 1 hour.|

## Required Permissions

\\to do: determine what activity relevant for\\

| Step | Operation | Minimum level of permissions | Comments |
|---|---|---|---|
| Creating a Linked Service | Databases Navigation | Database viewer. <br>The logged in user (the user using ADF UX) should be authorized to read database metadata. | User can also provide the database name manually. |
|   | Test Connection | Database monitor / table ingestor. <br>Service principal should be authorized to either execute database level .show commands or table level ingestion. | TestConnection verifies connection to the cluster, and not to the database. It can succeed even if the database doesn’t exists. <br>Table admin permissions are not sufficient.|
| Creating a Dataset | Tables Navigation | Database monitor. <br>The logged in user (the user using ADF UX) should be authorized to execute database level .show commands. | User can also provide table name manually.|
| Creating a Dataset / Copy Activity | Preview data | Database viewer. <br>Service principal should be authorized to read database metadata. | | 
|   | Import Schema | Database viewer. <br>Service principal should be authorized to read database metadata. | When Kusto is acting as the Source of a tabular-to-tabular copy, ADF will import schema automatically, even if user didn’t import schema explicitly. |
| ADX as Sink | Try creating a by-name column mapping | Database monitor. <br>Service principal should be authorized to execute database level .show commands. | Bottom line – can work with a table ingestor. Some operations will fail, but they are optional operations. |
|   | Try creating a CSV mapping on the table, and upon completion, try dropping that mapping | Table ingestor / database admin. <br>Service principal should be authorized to perform changes to a table. | |
|   | Ingest data | Table ingestor / database admin. <br>Service principal should be authorized to perform changes to a table. | | 
| ADX as Source | Execute query | Database viewer. <br>Service principal should be authorized to read database metadata. | |
| Kusto Command | | Differentiates according to the permissions level of each command. |

## Performance 

As for Lookup activity or copy activity where ADX is the source, please refer to [query best practices](https://kusto.azurewebsites.net/docs/query/best-practices.html) documentation.  
As for Azure Data Explorer Command activity, if that command consists of a query then the link above is still relevant.  
That section mainly addresses the copy activity where Azure Data Explorer is the sink.  
For additional info on performance, please refer to [ADF documentation](https://docs.microsoft.com/en-us/azure/data-factory/copy-activity-performance).
  
Estimated throughput for Azure Data Explorer sink: 11-13 MBps.

Parameters influencing the performance of Azure Data Explorer sink: 
 
| Parameter | Recommendations / Notes |
|---|---|
| Components geographical proximity | Try having all components in the same region: <ul><li>Source and Sink data stores.</li> <li>ADF’s integration runtime.</li> <li>Your ADX cluster.</li></ul>If that’s not possible, at least try having your integration runtime in the same region as your ADX cluster. |
|Amount of DIUs | Every 4 DIUs result in an additional VM used by ADF. <br>Increasing the DIUs will help only in case your source is a file-based store, and in case you have multiple files in that source.<br>In such a case, each VM will process a different file in parallel.<br>For that reason, copying a single large file will have a higher latency than copying multiple smaller files.|
|Amount and SKU of your ADX cluster | High amount of strong ADX Engine nodes will boost up the ingestion process time.|
| Data processing complexity | For instance, latency can differ according to the source file format, the column mapping, and whether the source file is compressed or not.|
| The VM running your integration runtime | For Azure copy, those would be ADF VMs and user has no way to change the SKU of those machines.
For On-Prem to Azure copy, make sure the VM hosting your self-hosted IR is strong enough.|

**FAQ:**  
\\To do: NOTES:
**Q:** When monitoring the activity progress, how come the “Data written” property is much larger than the “Data read” property?
**A:** That’s because “Data read” is calculated according to the binary file size, while “Data written” is calculated according to the in-memory size, after data was deserialized, and possibly also decompressed.

**Q:** When monitoring the activity progress, I see that data was written to the Azure Data Explorer sink, but when I’m querying the Azure Data Explorer table – I don’t see that data has still arrived.
**A:** There are two stages when copying to Azure Data Explorer. First stage reads the source data, split it to chunks of 900 MB, and upload each chunk to an Azure blob.
     That stage is the one that is reflected by the ADF activity progress view. Once all data is uploaded to Azure blobs, the second stage begins. In that stage, the Azure Data Explorer engine nodes are starting to download the blobs and ingest the data into the sink table.
     Only during the process of the second stage, you will start seeing data piled up in your Azure Data Explorer table.





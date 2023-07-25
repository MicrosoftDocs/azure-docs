---
title: Azure Storage Analytics logging
description: Use Storage Analytics to log details about Azure Storage requests. See what requests are logged, how logs are stored, how to enable Storage logging, and more.
author: normesta
ms.service: azure-storage
ms.subservice: storage-common-concepts
ms.topic: conceptual
ms.date: 01/04/2022
ms.author: normesta
ms.reviewer: fryu
ms.custom: "monitoring, devx-track-csharp"
---

# Azure Storage analytics logging

Storage Analytics logs detailed information about successful and failed requests to a storage service. This information can be used to monitor individual requests and to diagnose issues with a storage service. Requests are logged on a best-effort basis. This means that most requests will result in a log record, but the completeness and timeliness of Storage Analytics logs are not guaranteed.

> [!NOTE]
> We recommend that you use Azure Storage logs in Azure Monitor instead of Storage Analytics logs. To learn more, see any of the following articles:
>
> - [Monitoring Azure Blob Storage](../blobs/monitor-blob-storage.md)
> - [Monitoring Azure Files](../files/storage-files-monitoring.md)
> - [Monitoring Azure Queue Storage](../queues/monitor-queue-storage.md)
> - [Monitoring Azure Table storage](../tables/monitor-table-storage.md)

 Storage Analytics logging is not enabled by default for your storage account. You can enable it in the [Azure portal](https://portal.azure.com/) or by using PowerShell, or Azure CLI. For step-by-step guidance, see [Enable and manage Azure Storage Analytics logs (classic)](manage-storage-analytics-logs.md).

You can also enable Storage Analytics logs programmatically via the REST API or the client library. Use the [Get Blob Service Properties](/rest/api/storageservices/Blob-Service-REST-API), [Get Queue Service Properties](/rest/api/storageservices/Get-Queue-Service-Properties), and [Get Table Service Properties](/rest/api/storageservices/Get-Table-Service-Properties) operations to enable Storage Analytics for each service. To see an example that enables Storage Analytics logs by using .NET, see [Enable logs](manage-storage-analytics-logs.md)

 Log entries are created only if there are requests made against the service endpoint. For example, if a storage account has activity in its Blob endpoint but not in its Table or Queue endpoints, only logs pertaining to the Blob service will be created.

> [!NOTE]
>  Storage Analytics logging is currently available only for the Blob, Queue, and Table services. Storage Analytics logging is also available for premium-performance [BlockBlobStorage](./storage-account-create.md) accounts. However, it isn't available for general-purpose v2 accounts with premium performance.

## Requests logged in logging


### Logging authenticated requests

 The following types of authenticated requests are logged:

- Successful requests
- Failed requests, including timeout, throttling, network, authorization, and other errors
- Requests using a Shared Access Signature (SAS) or OAuth, including failed and successful requests
- Requests to analytics data

  Requests made by Storage Analytics itself, such as log creation or deletion, are not logged. A full list of the logged data is documented in the [Storage Analytics Logged Operations and Status Messages](/rest/api/storageservices/storage-analytics-logged-operations-and-status-messages) and [Storage Analytics Log Format](/rest/api/storageservices/storage-analytics-log-format) topics.

### Logging anonymous requests

 The following types of anonymous requests are logged:

- Successful requests
- Server errors
- Timeout errors for both client and server
- Failed GET requests with error code 304 (Not Modified)

  All other failed anonymous requests are not logged. A full list of the logged data is documented in the [Storage Analytics Logged Operations and Status Messages](/rest/api/storageservices/storage-analytics-logged-operations-and-status-messages) and [Storage Analytics Log Format](/rest/api/storageservices/storage-analytics-log-format) topics.

> [!NOTE]
> Storage Analytics logs all internal calls to the data plane. Calls from the Azure Storage Resource Provider are also logged. To identify these requests, look for the query string `<sk=system-1>` in the request URL.

## How logs are stored

All logs are stored in block blobs in a container named `$logs`, which is automatically created when Storage Analytics is enabled for a storage account. The `$logs` container is located in the blob namespace of the storage account, for example: `http://<accountname>.blob.core.windows.net/$logs`. This container cannot be deleted once Storage Analytics has been enabled, though its contents can be deleted. If you use your storage-browsing tool to navigate to the container directly, you will see all the blobs that contain your logging data.

> [!NOTE]
>  The `$logs` container is not displayed when a container listing operation is performed, such as the List Containers operation. It must be accessed directly. For example, you can use the List Blobs operation to access the blobs in the `$logs` container.

As requests are logged, Storage Analytics will upload intermediate results as blocks. Periodically, Storage Analytics will commit these blocks and make them available as a blob. It can take up to an hour for log data to appear in the blobs in the **$logs** container because the frequency at which the storage service flushes the log writers. Duplicate records may exist for logs created in the same hour. You can determine if a record is a duplicate by checking the **RequestId** and **Operation** number.

If you have a high volume of log data with multiple files for each hour, then you can use the blob metadata to determine what data the log contains by examining the blob metadata fields. This is also useful because there can sometimes be a delay while data is written to the log files: the blob metadata gives a more accurate indication of the blob content than the blob name.

Most storage browsing tools enable you to view the metadata of blobs; you can also read this information using PowerShell or programmatically. The following PowerShell snippet is an example of filtering the list of log blobs by name to specify a time, and by metadata to identify just those logs that contain **write** operations.

 ```powershell
 Get-AzStorageBlob -Container '$logs' |  
 Where-Object {  
     $_.Name -match 'blob/2014/05/21/05' -and   
     $_.ICloudBlob.Metadata.LogType -match 'write'  
 } |  
 ForEach-Object {  
     "{0}  {1}  {2}  {3}" –f $_.Name,   
     $_.ICloudBlob.Metadata.StartTime,   
     $_.ICloudBlob.Metadata.EndTime,   
     $_.ICloudBlob.Metadata.LogType  
 }  
 ```

For information about listing blobs programmatically, see [Enumerating Blob Resources](/rest/api/storageservices/Enumerating-Blob-Resources) and [Setting and Retrieving Properties and Metadata for Blob Resources](/rest/api/storageservices/Setting-and-Retrieving-Properties-and-Metadata-for-Blob-Resources).

### Log naming conventions

 Each log will be written in the following format:

 `<service-name>/YYYY/MM/DD/hhmm/<counter>.log`

 The following table describes each attribute in the log name:

|Attribute|Description|
|---------------|-----------------|
|`<service-name>`|The name of the storage service. For example: `blob`, `table`, or `queue`|
|`YYYY`|The four digit year for the log. For example: `2011`|
|`MM`|The two digit month for the log. For example: `07`|
|`DD`|The two digit day for the log. For example: `31`|
|`hh`|The two digit hour that indicates the starting hour for the logs, in 24 hour UTC format. For example: `18`|
|`mm`|The two digit number that indicates the starting minute for the logs. **Note:**  This value is unsupported in the current version of Storage Analytics, and its value will always be `00`.|
|`<counter>`|A zero-based counter with six digits that indicates the number of log blobs generated for the storage service in an hour time period. This counter starts at `000000`. For example: `000001`|

 The following is a complete sample log name that combines the above examples:

 `blob/2011/07/31/1800/000001.log`

 The following is a sample URI that can be used to access the above log:

 `https://<accountname>.blob.core.windows.net/$logs/blob/2011/07/31/1800/000001.log`

 When a storage request is logged, the resulting log name correlates to the hour when the requested operation completed. For example, if a GetBlob request was completed at 6:30PM on 7/31/2011, the log would be written with the following prefix: `blob/2011/07/31/1800/`

### Log metadata

 All log blobs are stored with metadata that can be used to identify what logging data the blob contains. The following table describes each metadata attribute:

|Attribute|Description|
|---------------|-----------------|
|`LogType`|Describes whether the log contains information pertaining to read, write, or delete operations. This value can include one type or a combination of all three, separated by commas.<br /><br /> Example 1: `write`<br /><br /> Example 2: `read,write`<br /><br /> Example 3: `read,write,delete`|
|`StartTime`|The earliest time of an entry in the log, in the form of `YYYY-MM-DDThh:mm:ssZ`. For example: `2011-07-31T18:21:46Z`|
|`EndTime`|The latest time of an entry in the log, in the form of `YYYY-MM-DDThh:mm:ssZ`. For example: `2011-07-31T18:22:09Z`|
|`LogVersion`|The version of the log format.|

 The following list displays complete sample metadata using the above examples:

-   `LogType=write`
-   `StartTime=2011-07-31T18:21:46Z`
-   `EndTime=2011-07-31T18:22:09Z`
-   `LogVersion=1.0`

### Log entries

The following sections show an example log entry for each supported Azure Storage service. 

##### Example log entry for Blob Storage

`2.0;2022-01-03T20:34:54.4617505Z;PutBlob;SASSuccess;201;7;7;sas;;logsamples;blob;https://logsamples.blob.core.windows.net/container1/1.txt?se=2022-02-02T20:34:54Z&amp;sig=XXXXX&amp;sp=rwl&amp;sr=c&amp;sv=2020-04-08&amp;timeout=901;"/logsamples/container1/1.txt";xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx;0;71.197.193.44:53371;2019-12-12;654;13;337;0;13;"xxxxxxxxxxxxxxxxxxxxx==";"xxxxxxxxxxxxxxxxxxxxx==";"&quot;0x8D9CEF88004E296&quot;";Monday, 03-Jan-22 20:34:54 GMT;;"Microsoft Azure Storage Explorer, 1.20.1, win32, azcopy-node, 2.0.0, win32,  AzCopy/10.11.0 Azure-Storage/0.13 (go1.15; Windows_NT)";;"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx";;;;;;;;`

##### Example log entry for Blob Storage (Data Lake Storage Gen2 enabled)

`2.0;2022-01-04T22:50:56.0000775Z;RenamePathFile;Success;201;49;49;authenticated;logsamples;logsamples;blob;"https://logsamples.dfs.core.windows.net/my-container/myfileorig.png?mode=legacy";"/logsamples/my-container/myfilerenamed.png";xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx;0;73.157.16.8;2020-04-08;591;0;224;0;0;;;;Friday, 11-Jun-21 17:58:15 GMT;;"Microsoft Azure Storage Explorer, 1.19.1, win32 azsdk-js-storagedatalake/12.3.1 (NODE-VERSION v12.16.3; Windows_NT 10.0.22000)";;"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx";;;;;;;;`

##### Example log entry for Queue Storage 

`2.0;2022-01-03T20:35:04.6097590Z;PeekMessages;Success;200;5;5;authenticated;logsamples;logsamples;queue;https://logsamples.queue.core.windows.net/queue1/messages?numofmessages=32&amp;peekonly=true&amp;timeout=30;"/logsamples/queue1";xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx;0;71.197.193.44:53385;2020-04-08;536;0;232;62;0;;;;;;"Microsoft Azure Storage Explorer, 1.20.1, win32 azsdk-js-storagequeue/12.3.1 (NODE-VERSION v12.16.3; Windows_NT 10.0.22000)";;"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx";;;;;;;;`

##### Example log entry for Table Storage 

`1.0;2022-01-03T20:35:13.0719766Z;CreateTable;Success;204;30;30;authenticated;logsamples;logsamples;table;https://logsamples.table.core.windows.net/Tables;"/logsamples/Table1";xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx;0;71.197.193.44:53389;2018-03-28;601;22;339;0;22;;;;;;"Microsoft Azure Storage Explorer, 1.20.1, win32, Azure-Storage/2.10.3 (NODE-VERSION v12.16.3; Windows_NT 10.0.22000)";;"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx"`


## Next steps

- [Enable and manage Azure Storage Analytics logs (classic)](manage-storage-analytics-logs.md)
- [Storage Analytics Log Format](/rest/api/storageservices/storage-analytics-log-format)
- [Storage Analytics Logged Operations and Status Messages](/rest/api/storageservices/storage-analytics-logged-operations-and-status-messages)
- [Storage Analytics Metrics (classic)](storage-analytics-metrics.md)

---
title: Azure Storage Analytics logging
description: Learn how to log details about requests made against Azure Storage.
author: normesta
ms.service: storage
ms.subservice: common
ms.topic: conceptual
ms.date: 05/19/2020
ms.author: normesta
ms.reviewer: fryu
ms.custom: monitoring
---

# Azure Storage analytics logging

Storage Analytics logs detailed information about successful and failed requests to a storage service. This information can be used to monitor individual requests and to diagnose issues with a storage service. Requests are logged on a best-effort basis.

 Storage Analytics logging is not enabled by default for your storage account. You can enable it in the [Azure portal](https://portal.azure.com/); for details, see [Monitor a storage account in the Azure portal](/azure/storage/storage-monitor-storage-account). You can also enable Storage Analytics programmatically via the REST API or the client library. Use the [Get Blob Service Properties](https://docs.microsoft.com/rest/api/storageservices/Blob-Service-REST-API), [Get Queue Service Properties](https://docs.microsoft.com/rest/api/storageservices/Get-Queue-Service-Properties), and [Get Table Service Properties](https://docs.microsoft.com/rest/api/storageservices/Get-Table-Service-Properties) operations to enable Storage Analytics for each service.

 Log entries are created only if there are requests made against the service endpoint. For example, if a storage account has activity in its Blob endpoint but not in its Table or Queue endpoints, only logs pertaining to the Blob service will be created.

> [!NOTE]
>  Storage Analytics logging is currently available only for the Blob, Queue, and Table services. Storage Analytics logging is also available for premium-performance [BlockBlobStorage](../blobs/storage-blob-create-account-block-blob.md) accounts. However, it isn't available for general-purpose v2 accounts with premium performance.

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

## How logs are stored

All logs are stored in block blobs in a container named `$logs`, which is automatically created when Storage Analytics is enabled for a storage account. The `$logs` container is located in the blob namespace of the storage account, for example: `http://<accountname>.blob.core.windows.net/$logs`. This container cannot be deleted once Storage Analytics has been enabled, though its contents can be deleted. If you use your storage-browsing tool to navigate to the container directly, you will see all the blobs that contain your logging data.

> [!NOTE]
>  The `$logs` container is not displayed when a container listing operation is performed, such as the List Containers operation. It must be accessed directly. For example, you can use the List Blobs operation to access the blobs in the `$logs` container.

As requests are logged, Storage Analytics will upload intermediate results as blocks. Periodically, Storage Analytics will commit these blocks and make them available as a blob. It can take up to an hour for log data to appear in the blobs in the **$logs** container because the frequency at which the storage service flushes the log writers. Duplicate records may exist for logs created in the same hour. You can determine if a record is a duplicate by checking the **RequestId** and **Operation** number.

If you have a high volume of log data with multiple files for each hour, then you can use the blob metadata to determine what data the log contains by examining the blob metadata fields. This is also useful because there can sometimes be a delay while data is written to the log files: the blob metadata gives a more accurate indication of the blob content than the blob name.

Most storage browsing tools enable you to view the metadata of blobs; you can also read this information using PowerShell or programmatically. The following PowerShell snippet is an example of filtering the list of log blobs by name to specify a time, and by metadata to identify just those logs that contain **write** operations.  

 ```powershell
 Get-AzureStorageBlob -Container '$logs' |  
 Where-Object {  
     $_.Name -match 'table/2014/05/21/05' -and   
     $_.ICloudBlob.Metadata.LogType -match 'write'  
 } |  
 ForEach-Object {  
     "{0}  {1}  {2}  {3}" –f $_.Name,   
     $_.ICloudBlob.Metadata.StartTime,   
     $_.ICloudBlob.Metadata.EndTime,   
     $_.ICloudBlob.Metadata.LogType  
 }  
 ```  

For information about listing blobs programmatically, see [Enumerating Blob Resources](https://msdn.microsoft.com/library/azure/hh452233.aspx) and [Setting and Retrieving Properties and Metadata for Blob Resources](https://msdn.microsoft.com/library/azure/dd179404.aspx).  

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

## Enable Storage logging

You can enable Storage logging with Azure portal, PowerShell, and Storage SDKs.

### Enable Storage logging using the Azure portal  

In the Azure portal, use the **Diagnostics settings (classic)** blade to control Storage Logging, accessible from the **Monitoring (classic)** section of a storage account's **Menu blade**.

You can specify the storage services that you want to log, and the retention period (in days) for the logged data.  

### Enable Storage logging using PowerShell  

 You can use PowerShell on your local machine to configure Storage Logging in your storage account by using the Azure PowerShell cmdlet **Get-AzureStorageServiceLoggingProperty** to retrieve the current settings, and the cmdlet **Set-AzureStorageServiceLoggingProperty** to change the current settings.  

 The cmdlets that control Storage Logging use a **LoggingOperations** parameter that is a string containing a comma-separated list of request types to log. The three possible request types are **read**, **write**, and **delete**. To switch off logging, use the value **none** for the **LoggingOperations** parameter.  

 The following command switches on logging for read, write, and delete requests in the Queue service in your default storage account with retention set to five days:  

```powershell
Set-AzureStorageServiceLoggingProperty -ServiceType Queue -LoggingOperations read,write,delete -RetentionDays 5  
```  

 The following command switches off logging for the table service in your default storage account:  

```powershell
Set-AzureStorageServiceLoggingProperty -ServiceType Table -LoggingOperations none  
```  

 For information about how to configure the Azure PowerShell cmdlets to work with your Azure subscription and how to select the default storage account to use, see: [How to install and configure Azure PowerShell](https://azure.microsoft.com/documentation/articles/install-configure-powershell/).  

### Enable Storage logging programmatically  

 In addition to using the Azure portal or the Azure PowerShell cmdlets to control Storage Logging, you can also use one of the Azure Storage APIs. For example, if you are using a .NET language you can use the Storage Client Library.  

# [\.NET v12 SDK](#tab/dotnet)

:::code language="csharp" source="~/azure-storage-snippets/queues/howto/dotnet/dotnet-v12/Monitoring.cs" id="snippet_EnableDiagnosticLogs":::

# [\.NET v11 SDK](#tab/dotnet11)

```csharp
var storageAccount = CloudStorageAccount.Parse(connStr);  
var queueClient = storageAccount.CreateCloudQueueClient();  
var serviceProperties = queueClient.GetServiceProperties();  

serviceProperties.Logging.LoggingOperations = LoggingOperations.All;  
serviceProperties.Logging.RetentionDays = 2;  

queueClient.SetServiceProperties(serviceProperties);  
```  

---


 For more information about using a .NET language to configure Storage Logging, see [Storage Client Library Reference](https://msdn.microsoft.com/library/azure/dn261237.aspx).  

 For general information about configuring Storage Logging using the REST API, see [Enabling and Configuring Storage Analytics](https://msdn.microsoft.com/library/azure/hh360996.aspx).  

## Download Storage logging log data

 To view and analyze your log data, you should download the blobs that contain the log data you are interested in to a local machine. Many storage-browsing tools enable you to download blobs from your storage account; you can also use the Azure Storage team provided command-line Azure Copy Tool [AzCopy](storage-use-azcopy-v10.md) to download your log data.  
 
>[!NOTE]
> The `$logs` container isn't integrated with Event Grid, so you won't receive notifications when log files are written. 

 To make sure you download the log data you are interested in and to avoid downloading the same log data more than once:  

-   Use the date and time naming convention for blobs containing log data to track which blobs you have already downloaded for analysis to avoid re-downloading the same data more than once.  

-   Use the metadata on the blobs containing log data to identify the specific period for which the blob holds log data to identify the exact blob you need to download.  

To get started with AzCopy, see [Get started with AzCopy](storage-use-azcopy-v10.md) 

The following example shows how you can download the log data for the queue service for the hours starting at 09 AM, 10 AM, and 11 AM on 20th May, 2014.

```
azcopy copy 'https://mystorageaccount.blob.core.windows.net/$logs/queue' 'C:\Logs\Storage' --include-path '2014/05/20/09;2014/05/20/10;2014/05/20/11' --recursive
```

To learn more about how to download specific files, see [Download specific files](https://docs.microsoft.com/azure/storage/common/storage-use-azcopy-blobs?toc=%2fazure%2fstorage%2fblobs%2ftoc.json#download-specific-files).

When you have downloaded your log data, you can view the log entries in the files. These log files use a delimited text format that many log reading tools are able to parse, including Microsoft Message Analyzer (for more information, see the guide [Monitoring, Diagnosing, and Troubleshooting Microsoft Azure Storage](storage-monitoring-diagnosing-troubleshooting.md)). Different tools have different facilities for formatting, filtering, sorting, ad searching the contents of your log files. For more information about the Storage Logging log file format and content, see [Storage Analytics Log Format](/rest/api/storageservices/storage-analytics-log-format) and [Storage Analytics Logged Operations and Status Messages](/rest/api/storageservices/storage-analytics-logged-operations-and-status-messages).

## Next steps

* [Storage Analytics Log Format](/rest/api/storageservices/storage-analytics-log-format)
* [Storage Analytics Logged Operations and Status Messages](/rest/api/storageservices/storage-analytics-logged-operations-and-status-messages)
* [Storage Analytics Metrics (classic)](storage-analytics-metrics.md)

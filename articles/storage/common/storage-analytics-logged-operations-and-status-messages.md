---
title: "Storage Analytics Logged Operations and Status Messages"
ms.custom: na
ms.date: 2016-06-29
ms.prod: azure
ms.reviewer: na
ms.service: storage
ms.suite: na
ms.tgt_pltfrm: na
ms.topic: reference
ms.assetid: e96d4080-b09f-435c-834d-7a3ac170b602
caps.latest.revision: 21
author: tamram
manager: carolz
translation.priority.mt:
  - de-de
  - es-es
  - fr-fr
  - it-it
  - ja-jp
  - ko-kr
  - pt-br
  - ru-ru
  - zh-cn
  - zh-tw
---
# Storage Analytics Logged Operations and Status Messages
This topic lists the storage service operations and status messages that are recorded by Storage Analytics.  

## Logged Request Status Messages  
 The following table contains the status messages that are logged and reported in metrics data. A definition for each column is listed below:  

1.  **Status Message**: The status message for a request logged by Storage Analytics. This value is included in log entries and is the name of a column in each Metrics table.  

2.  **Description**: A description of the status message including HTTP verbs and status codes, if applicable.  

3.  **Billable**: A yes/no value that indicates whether or not the request is billable. For more information on billing in Azure Storage, see [Understanding Azure Storage Billing - Bandwidth, Transactions, and Capacity](http://blogs.msdn.com/b/windowsazurestorage/archive/2010/07/09/understanding-windows-azure-storage-billing-bandwidth-transactions-and-capacity.aspx).  

4.  **Availability**: A yes/no value that indicates whether or not the request is included in the availability calculation for a storage service or a specific API operation. All unexpected errors result in reduced availability for the storage service or the specified API operation.  

|Status Message|Information|Billable|Availability|  
|--------------------|-----------------|--------------|------------------|  
|**Success**|Successful request.|Yes|Yes|  
|**AnonymousSuccess**|Successful anonymous request.|Yes|Yes|  
|**SASSuccess**|Successful Shared Access Signature (SAS) request.|Yes|Yes|  
|**ThrottlingError**|Authenticated request that returned an HTTP 503 status code.|No|No|  
|**AnonymousThrottlingError**|Anonymous request that returned an HTTP 503 status code.|No|No|  
|**SASThrottlingError**|SAS request that returned an HTTP 503 status code.|No|No|  
|**ClientTimeoutError**|Timed-out authenticated request that returned an HTTP 500 status code. If the client’s network timeout or the request timeout is set to a lower value than expected by the storage service, this is an expected timeout. Otherwise, it is reported as a **ServerTimeoutError**.|Yes|Yes|  
|**AnonymousClientTimeoutError**|Timed-out anonymous request that returned an HTTP 500 status code. If the client’s network timeout or the request timeout is set to a lower value than expected by the storage service, this is an expected timeout. Otherwise, it is reported as an **AnonymousServerTimeoutError**.|Yes|Yes|  
|**SASClientTimeoutError**|Timed-out SAS request that returned an HTTP 500 status code. If the client’s network timeout or the request timeout is set to a lower value than expected by the storage service, this is an expected timeout. Otherwise, it is reported as an **SASServerTimeoutError**.|Yes|Yes|  
|**ServerTimeoutError**|Timed-out authenticated request that returned an HTTP 500 status code. The timeout occurred due to a server error.|No|Yes|  
|**AnonymousServerTimeoutError**|Timed-out anonymous request that returned an HTTP 500 status code. The timeout occurred due to a server error.|No|Yes|  
|**SASServerTimeoutError**|Timed-out SAS request that returned an HTTP 500 status code. The timeout occurred due to a server error.|No|Yes|  
|**ClientOtherError**|Authenticated request that failed as expected. This error can represent many 300-400 level HTTP status codes and conditions such as NotFound and ResourceAlreadyExists.|Yes|Yes|  
|**SASClientOtherError**|SAS request that failed as expected.|Yes|Yes|  
|**AnonymousClientOtherError**|Anonymous request that failed as expected, most commonly a request that failed a specified precondition.|Yes|Yes|  
|**ServerOtherError**|Authenticated request that failed due to unknown server errors, most commonly returning an HTTP 500 status code.|No|Yes|  
|**AnonymousServerOtherError**|Anonymous request that failed due to unknown server errors, most commonly returning an HTTP 500 status code.|No|Yes|  
|**SASServerOtherError**|SAS request that failed due to unknown server errors, most commonly returning an HTTP 500 status code.|No|Yes|  
|**AuthorizationError**|Authenticated request that failed due to unauthorized access of data or an authorization failure.|Yes|Yes|  
|**AnonymousAuthorizationError**|Anonymous request that failed due to unauthorized access of data or an authorization failure.|No|No|  
|**SASAuthorizationError**|SAS request that failed due to unauthorized access of data or an authorization failure.|Yes|Yes|  
|**NetworkError**|Authenticated request that failed due to network errors. Most commonly occurs when a client prematurely closes a connection before timeout expiration.|Yes|Yes|  
|**AnonymousNetworkError**|Anonymous request that failed due to network errors. Most commonly occurs when a client prematurely closes a connection before timeout expiration.|Yes|Yes|  
|**SASNetworkError**|SAS request that failed due to network errors. Most commonly occurs when a client prematurely closes a connection before timeout expiration.|Yes|Yes|  

## Logged Operations  
 The following table contains the operations that are logged for the corresponding storage service:  

|Storage Service|Operation|  
|---------------------|---------------|  
|[Blob Service REST API](Blob-Service-REST-API.md)|-   **AcquireBlobLease**<br />-   **AcquireContainerLease**<br />-   **BreakBlobLease**<br />-   **BreakContainerLease**<br />-   **ChangeBlobLease**<br />-   **ChangeContainerLease**<br />-   **ClearPage**<br />-   **CopyBlob**, including internal-only operations **CopyBlobSource** and **CopyBlobDestination**. These internal operations will only exist in logging data.<br />-   **CreateContainer**<br />-   **DeleteBlob**<br />-   **DeleteContainer**<br />-   **GetBlob**<br />-   **GetBlobMetadata**<br />-   **GetBlobProperties**<br />-   **GetBlockList**<br />-   **GetContainerACL**<br />-   **GetContainerMetadata**<br />-   **GetContainerProperties**<br />-   **GetBlobLeaseInfo**<br />-   **GetPageRegions**<br />-   **ListBlobs**<br />-   **ListContainers**<br />-   **PutBlob**<br />-   **PutBlockList**<br />-   **PutBlock**<br />-   **PutPage**<br />-   **RenewBlobLease**<br />-   **RenewContainerLease**<br />-   **ReleaseBlobLease**<br />-   **ReleaseContainerLease**<br />-   **SetBlobMetadata**<br />-   **SetBlobProperties**<br />-   **SetContainerACL**<br />-   **SetContainerMetadata**<br />-   **SnapshotBlob**<br />-   **SetBlobServiceProperties**<br />-   **GetBlobServiceProperties**<br />-   **BlobPreflightRequest**|  
|[Table Service REST API](Table-Service-REST-API.md)|-   **EntityGroupTransaction**<br />-   **CreateTable**<br />-   **DeleteTable**<br />-   **DeleteEntity**<br />-   **InsertEntity**<br />-   **InsertOrMergeEntity**<br />-   **InsertOrReplaceEntity**<br />-   **QueryEntity**<br />-   **QueryEntities**<br />-   **QueryTable**<br />-   **QueryTables**<br />-   **UpdateEntity**<br />-   **MergeEntity**<br />-   **SetTableServiceProperties**<br />-   **GetTableServiceProperties**<br />-   **TablePreflightRequest**|  
|[Queue Service REST API](Queue-Service-REST-API.md)|-   **ClearMessages**<br />-   **CreateQueue**<br />-   **DeleteQueue**<br />-   **DeleteMessage**<br />-   **GetQueueMetadata**<br />-   **GetQueue**<br />-   **GetMessage**<br />-   **GetMessages**<br />-   **ListQueues**<br />-   **PeekMessage**<br />-   **PeekMessages**<br />-   **PutMessage**<br />-   **SetQueueMetadata**<br />-   **SetQueueServiceProperties**<br />-   **GetQueueServiceProperties**<br />-   **UpdateMessage**<br />-   **QueuePreflightRequest**|  

## See Also  
 [Storage Analytics Logging](storage-analytics-logging.md)   
 [Storage Analytics Metrics](storage-analytics-metrics.md)   
 [Storage Analytics Metrics Table Schema](storage-analytics-metrics-table-schema.md)

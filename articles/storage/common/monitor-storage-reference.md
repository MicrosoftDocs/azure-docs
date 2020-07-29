---
title: Azure Storage monitoring data reference | Microsoft Docs
description: Log and metrics reference for monitoring data from Azure Storage.
author: normesta
services: azure-monitor
ms.service: azure-monitor
ms.topic: reference
ms.date: 05/01/2020
ms.author: normesta
ms.subservice: logs
ms.custom: monitoring
---

# Azure Storage monitoring data reference

See [Monitoring Azure Storage](monitor-storage.md) for details on collecting and analyzing monitoring data for Azure Storage.

## Metrics

The following tables list the platform metrics collected for Azure Storage. 

### Capacity metrics

Capacity metrics values are sent to Azure Monitor every hour. The values are refreshed daily. The time grain defines the time interval for which metrics values are presented. The supported time grain for all capacity metrics is one hour (PT1H).

Azure Storage provides the following capacity metrics in Azure Monitor.

#### Account Level

This table shows [account-level metrics](https://docs.microsoft.com/azure/azure-monitor/platform/metrics-supported#microsoftstoragestorageaccounts).

| Metric | Description |
| ------------------- | ----------------- |
| UsedCapacity | The amount of storage used by the storage account. For standard storage accounts, it's the sum of capacity used by blob, table, file, and queue. For premium storage accounts and Blob storage accounts, it is the same as BlobCapacity. <br/><br/> Unit: Bytes <br/> Aggregation Type: Average <br/> Value example: 1024 |

#### Blob storage

This table shows [Blob storage metrics](https://docs.microsoft.com/azure/azure-monitor/platform/metrics-supported#microsoftstoragestorageaccountsblobservices).

| Metric | Description |
| ------------------- | ----------------- |
| BlobCapacity | The total of Blob storage used in the storage account. <br/><br/> Unit: Bytes <br/> Aggregation Type: Average <br/> Value example: 1024 <br/> Dimensions: **BlobType**, and **BlobTier** ([Definition](#metrics-dimensions)) |
| BlobCount    | The number of blob objects stored in the storage account. <br/><br/> Unit: Count <br/> Aggregation Type: Average <br/> Value example: 1024 <br/> Dimensions: **BlobType**, and **BlobTier** ([Definition](#metrics-dimensions)) |
| ContainerCount    | The number of containers in the storage account. <br/><br/> Unit: Count <br/> Aggregation Type: Average <br/> Value example: 1024 |
| IndexCapacity     | The amount of storage used by ADLS Gen2 Hierarchical Index <br/><br/> Unit: Bytes <br/> Aggregation Type: Average <br/> Value example: 1024 |

#### Table storage

This table shows [Table storage metrics](https://docs.microsoft.com/azure/azure-monitor/platform/metrics-supported#microsoftstoragestorageaccountstableservices).

| Metric | Description |
| ------------------- | ----------------- |
| TableCapacity | The amount of Table storage used by the storage account. <br/><br/> Unit: Bytes <br/> Aggregation Type: Average <br/> Value example: 1024 |
| TableCount   | The number of tables in the storage account. <br/><br/> Unit: Count <br/> Aggregation Type: Average <br/> Value example: 1024 |
| TableEntityCount | The number of table entities in the storage account. <br/><br/> Unit: Count <br/> Aggregation Type: Average <br/> Value example: 1024 |

#### Queue storage

This table shows [Queue storage metrics](https://docs.microsoft.com/azure/azure-monitor/platform/metrics-supported#microsoftstoragestorageaccountsfileservices).

| Metric | Description |
| ------------------- | ----------------- |
| QueueCapacity | The amount of Queue storage used by the storage account. <br/><br/> Unit: Bytes <br/> Aggregation Type: Average <br/> Value example: 1024 |
| QueueCount   | The number of queues in the storage account. <br/><br/> Unit: Count <br/> Aggregation Type: Average <br/> Value example: 1024 |
| QueueMessageCount | The number of unexpired queue messages in the storage account. <br/><br/>Unit: Count <br/> Aggregation Type: Average <br/> Value example: 1024 |

#### File storage

This table shows [File storage metrics](https://docs.microsoft.com/azure/azure-monitor/platform/metrics-supported#microsoftstoragestorageaccountsqueueservices).

| Metric | Description |
| ------------------- | ----------------- |
| FileCapacity | The amount of File storage used by the storage account. <br/><br/> Unit: Bytes <br/> Aggregation Type: Average <br/> Value example: 1024 |
| FileCount   | The number of files in the storage account. <br/><br/> Unit: Count <br/> Aggregation Type: Average <br/> Value example: 1024 |
| FileShareCount | The number of file shares in the storage account. <br/><br/> Unit: Count <br/> Aggregation Type: Average <br/> Value example: 1024 |

### Transaction metrics

Transaction metrics are emitted on every request to a storage account from Azure Storage to Azure Monitor. In the case of no activity on your storage account, there will be no data on transaction metrics in the period. All transaction metrics are available at both account and service level (Blob storage, Table storage, Azure Files, and Queue storage). The time grain defines the time interval that metric values are presented. The supported time grains for all transaction metrics are PT1H and PT1M.

Azure Storage provides the following transaction metrics in Azure Monitor.

| Metric | Description |
| ------------------- | ----------------- |
| Transactions | The number of requests made to a storage service or the specified API operation. This number includes successful and failed requests, as well as requests that produced errors. <br/><br/> Unit: Count <br/> Aggregation Type: Total <br/> Applicable dimensions: ResponseType, GeoType, ApiName, and Authentication ([Definition](#metrics-dimensions))<br/> Value example: 1024 |
| Ingress | The amount of ingress data. This number includes ingress from an external client into Azure Storage as well as ingress within Azure. <br/><br/> Unit: Bytes <br/> Aggregation Type: Total <br/> Applicable dimensions: GeoType, ApiName, and Authentication ([Definition](#metrics-dimensions)) <br/> Value example: 1024 |
| Egress | The amount of egress data. This number includes egress from an external client into Azure Storage as well as egress within Azure. As a result, this number does not reflect billable egress. <br/><br/> Unit: Bytes <br/> Aggregation Type: Total <br/> Applicable dimensions: GeoType, ApiName, and Authentication ([Definition](#metrics-dimensions)) <br/> Value example: 1024 |
| SuccessServerLatency | The average time used to process a successful request by Azure Storage. This value does not include the network latency specified in SuccessE2ELatency. <br/><br/> Unit: Milliseconds <br/> Aggregation Type: Average <br/> Applicable dimensions: GeoType, ApiName, and Authentication ([Definition](#metrics-dimensions)) <br/> Value example: 1024 |
| SuccessE2ELatency | The average end-to-end latency of successful requests made to a storage service or the specified API operation. This value includes the required processing time within Azure Storage to read the request, send the response, and receive acknowledgment of the response. <br/><br/> Unit: Milliseconds <br/> Aggregation Type: Average <br/> Applicable dimensions: GeoType, ApiName, and Authentication ([Definition](#metrics-dimensions)) <br/> Value example: 1024 |
| Availability | The percentage of availability for the storage service or the specified API operation. Availability is calculated by taking the total billable requests value and dividing it by the number of applicable requests, including those requests that produced unexpected errors. All unexpected errors result in reduced availability for the storage service or the specified API operation. <br/><br/> Unit: Percent <br/> Aggregation Type: Average <br/> Applicable dimensions: GeoType, ApiName, and Authentication ([Definition](#metrics-dimensions)) <br/> Value example: 99.99 |

<a id="metrics-dimensions"></a>

## Metrics dimensions

Azure Storage supports following dimensions for metrics in Azure Monitor.

| Dimension Name | Description |
| ------------------- | ----------------- |
| **BlobType** | The type of blob for Blob metrics only. The supported values are **BlockBlob**, **PageBlob**, and **Azure Data Lake Storage**. Append Blob is included in BlockBlob. |
| **BlobTier** | Azure storage offers different access tiers, which allow you to store blob object data in the most cost-effective manner. See more in [Azure Storage blob tier](../blobs/storage-blob-storage-tiers.md). The supported values include: <br/> <li>**Hot**: Hot tier</li> <li>**Cool**: Cool tier</li> <li>**Archive**: Archive tier</li> <li>**Premium**: Premium tier for block blob</li> <li>**P4/P6/P10/P15/P20/P30/P40/P50/P60**: Tier types for premium page blob</li> <li>**Standard**: Tier type for standard page Blob</li> <li>**Untiered**: Tier type for general purpose v1 storage account</li> |
| **GeoType** | Transaction from Primary or Secondary cluster. The available values include **Primary** and **Secondary**. It applies to Read Access Geo Redundant Storage(RA-GRS) when reading objects from secondary tenant. |
| **ResponseType** | Transaction response type. The available values include: <br/><br/> <li>**ServerOtherError**: All other server-side errors except described ones </li> <li>**ServerBusyError**: Authenticated request that returned an HTTP 503 status code. </li> <li>**ServerTimeoutError**: Timed-out authenticated request that returned an HTTP 500 status code. The timeout occurred due to a server error. </li> <li>**AuthorizationError**: Authenticated request that failed due to unauthorized access of data or an authorization failure. </li> <li>**NetworkError**: Authenticated request that failed due to network errors. Most commonly occurs when a client prematurely closes a connection before timeout expiration. </li><li>**ClientAccountBandwidthThrottlingError**: The request is throttled on bandwidth for exceeding [storage account scalability limits](scalability-targets-standard-account.md).</li><li>**ClientAccountRequestThrottlingError**: The request is throttled on request rate for exceeding [storage account scalability limits](scalability-targets-standard-account.md).<li>**ClientThrottlingError**: Other client-side throttling error. ClientAccountBandwidthThrottlingError and ClientAccountRequestThrottlingError are excluded.</li> <li>**ClientTimeoutError**: Timed-out authenticated request that returned an HTTP 500 status code. If the client's network timeout or the request timeout is set to a lower value than expected by the storage service, it is an expected timeout. Otherwise, it is reported as a ServerTimeoutError. </li> <li>**ClientOtherError**: All other client-side errors except described ones. </li> <li>**Success**: Successful request</li> <li> **SuccessWithThrottling**: Successful request when a SMB client gets throttled in the first attempt(s) but succeeds after retries.</li> |
| **ApiName** | The name of operation. For example: <br/> <li>**CreateContainer**</li> <li>**DeleteBlob**</li> <li>**GetBlob**</li> For all operation names, see [document](/rest/api/storageservices/storage-analytics-logged-operations-and-status-messages). |
| **Authentication** | Authentication type used in transactions. The available values include: <br/> <li>**AccountKey**: The transaction is authenticated with storage account key.</li> <li>**SAS**: The transaction is authenticated with shared access signatures.</li> <li>**OAuth**: The transaction is authenticated with OAuth access tokens.</li> <li>**Anonymous**: The transaction is requested anonymously. It doesn’t include preflight requests.</li> <li>**AnonymousPreflight**: The transaction is preflight request.</li> |

For the metrics supporting dimensions, you need to specify the dimension value to see the corresponding metrics values. For example, if you look at  **Transactions** value for successful responses, you need to filter the **ResponseType** dimension with **Success**. Or if you look at **BlobCount** value for Block Blob, you need to filter the **BlobType** dimension with **BlockBlob**.

## Resource logs (preview)

> [!NOTE]
> Azure Storage logs in Azure Monitor is in public preview, and is available for preview testing in all public cloud regions. To enroll in the preview, see [this page](https://forms.microsoft.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbRxW65f1VQyNCuBHMIMBV8qlUM0E0MFdPRFpOVTRYVklDSE1WUTcyTVAwOC4u).  This preview enables logs for blobs (including Azure Data Lake Storage Gen2), files, queues, tables, premium storage accounts in general-purpose v1 and general-purpose v2 storage accounts. Classic storage accounts are not supported.

The following table lists the properties for Azure Storage resource logs when they're collected in Azure Monitor Logs or Azure Storage. The properties describe the operation, the service, and the type of authorization that was used to perform the operation.

### Fields that describe the operation

```json
{
    "time": "2019-02-28T19:10:21.2123117Z",
    "resourceId": "/subscriptions/12345678-2222-3333-4444-555555555555/resourceGroups/mytestrp/providers/Microsoft.Storage/storageAccounts/testaccount1/blobServices/default",
    "category": "StorageWrite",
    "operationName": "PutBlob",
    "operationVersion": "2017-04-17",
    "schemaVersion": "1.0",
    "statusCode": 201,
    "statusText": "Success",
    "durationMs": 5,
    "callerIpAddress": "192.168.0.1:11111",
    "correlationId": "ad881411-201e-004e-1c99-cfd67d000000",
    "location": "uswestcentral",
    "uri": "http://mystorageaccount.blob.core.windows.net/cont1/blobname?timeout=10"
}
```

| Property | Description |
|:--- |:---|
|**time** | The Universal Time Coordinated (UTC) time when the request was received by storage. For example: `2018/11/08 21:09:36.6900118`.|
|**resourceId** | The resource ID of the storage account. For example: `/subscriptions/208841be-a4v3-4234-9450-08b90c09f4/resourceGroups/`<br>`myresourcegroup/providers/Microsoft.Storage/storageAccounts/mystorageaccount/storageAccounts/blobServices/default`|
|**category** | The category of the requested operation. For example: `StorageRead`, `StorageWrite`, or `StorageDelete`.|
|**operationName** | The type of REST operation that was performed. <br> For a complete list of operations, see [Storage Analytics Logged Operations and Status Messages topic](https://docs.microsoft.com/rest/api/storageservices/storage-analytics-logged-operations-and-status-messages). |
|**operationVersion** | The storage service version that was specified when the request was made. This is equivalent to the value of the **x-ms-version** header. For example: `2017-04-17`.|
|**schemaVersion** | The schema version of the log. For example: `1.0`.|
|**statusCode** | The HTTP status code for the request. If the request is interrupted, this value might be set to `Unknown`. <br> For example: `206` |
|**statusText** | The status of the requested operation.  For a complete list of status messages, see [Storage Analytics Logged Operations and Status Messages topic](https://docs.microsoft.com/rest/api/storageservices/storage-analytics-logged-operations-and-status-messages). In version 2017-04-17 and later, the status message `ClientOtherError` isn't used. Instead, this field contains an error code. For example: `SASSuccess`  |
|**durationMs** | The total time, expressed in milliseconds, to perform the requested operation. This includes the time to read the incoming request, and to send the response to the requester. For example: `12`.|
|**callerIpAddress** | The IP address of the requester, including the port number. For example: `192.100.0.102:4362`. |
|**correlationId** | The ID that is used to correlate logs across resources. For example: `b99ba45e-a01e-0042-4ea6-772bbb000000`. |
|**location** | The location of storage account. For example: `North Europe`. |
|**protocol**|The protocol that is used in the operation. For example: `HTTP`, `HTTPS`, `SMB`, or `NFS`|
| **uri** | Uniform resource identifier that is requested. For example: `http://myaccountname.blob.core.windows.net/cont1/blobname?timeout=10`. |

### Fields that describe how the operation was authenticated

```json
{
    "identity": {
        "authorization": [
            {
                "action": "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read",
                "principals": [
                    {
                        "id": "fde5ba15-4355-4223-b811-cccccccccccc",
                        "type": "User"
                    }
                ],
                "roleAssignmentId": "ecf75cb8-491c-4a25-ad6e-aaaaaaaaaaaa",
                "roleDefinitionId": "b7e6dc6d-f1e8-4753-8033-ffffffffffff"
            }
        ],
        "requester": {
            "appId": "691458b9-1327-4635-9f55-bbbbbbbbbbbb",
            "audience": "https://storage.azure.com/",
            "objectId": "fde5ba15-4355-4223-b811-cccccccccccc",
            "tenantId": "72f988bf-86f1-41af-91ab-dddddddddddd",
            "tokenIssuer": "https://sts.windows.net/72f988bf-86f1-41af-91ab-eeeeeeeeeeee/"
           },
        "type": "OAuth"
    },
}

```

| Property | Description |
|:--- |:---|
|**identity / type** | The type of authentication that was used to make the request. For example: `OAuth`, `SAS Key`, `Account Key`, or `Anonymous` |
|**identity / tokenHash**|This field is reserved for internal use only. |
|**authorization / action** | The action that is assigned to the request. For example: `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read` |
|**authorization / roleAssignmentId** | The role assignment ID. For example: `4e2521b7-13be-4363-aeda-111111111111`.|
|**authorization / roleDefinitionId** | The role definition ID. For example: `ba92f5b4-2d11-453d-a403-111111111111"`.|
|**principals / id** | The ID of the security principal. For example: `a4711f3a-254f-4cfb-8a2d-111111111111`.|
|**principals / type** | The type of security principal. For example: `ServicePrincipal`. |
|**requester / appID** | The Open Authorization (OAuth) application ID that is used as the requester. <br> For example: `d3f7d5fe-e64a-4e4e-871d-333333333333`.|
|**requester / audience** | The OAuth audience of the request. For example: `https://storage.azure.com`. |
|**requester / objectId** | The OAuth object ID of the requester. In case of Kerberos authentication, represents the object identifier of Kerberos authenticated user. For example: `0e0bf547-55e5-465c-91b7-2873712b249c`. |
|**requester / tenantId** | The OAuth tenant ID of identity. For example: `72f988bf-86f1-41af-91ab-222222222222`.|
|**requester / tokenIssuer** | The OAuth token issuer. For example: `https://sts.windows.net/72f988bf-86f1-41af-91ab-222222222222/`.|
|**requester / upn** | The User Principal Name (UPN) of requestor. For example: `someone@contoso.com`. |
|**requester / userName** | This field is reserved for internal use only.|

### Fields that describe the service

```json
{
    "properties": {
        "accountName": "testaccount1",
        "requestUrl": "https://testaccount1.blob.core.windows.net:443/upload?restype=container&comp=list&prefix=&delimiter=%2F&marker=&maxresults=30&include=metadata&_=1551405598426",
        "userAgentHeader": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36 Edge/17.17134",
        "referrerHeader": "blob:https://ms.portal.azure.com/6f50025f-3b88-488d-b29e-3c592a31ddc9",
        "clientRequestId": "",
        "etag": "",
        "serverLatencyMs": 63,
        "serviceType": "blob",
        "operationCount": 0,
        "requestHeaderSize": 2658,
        "requestBodySize": 0,
        "responseHeaderSize": 295,
        "responseBodySize": 2018,
        "contentLengthHeader": 0,
        "requestMd5": "",
        "serverMd5": "",
        "lastModifiedTime": "",
        "conditionsUsed": "",
        "smbTreeConnectID" : "0x3",
        "smbPersistentHandleID" : "0x6003f",
        "smbVolatileHandleID" : "0xFFFFFFFF00000065",
        "smbMessageID" : "0x3b165",
        "smbCreditsConsumed" : "0x3",
        "smbCommandDetail" : "0x2000 bytes at offset 0xf2000",
        "smbFileId" : " 0x9223442405598953",
        "smbSessionID" : "0x8530280128000049",
        "smbCommandMajor" : "0x6",
        "smbCommandMinor" : "DirectoryCloseAndDelete"
    }

}
```

| Property | Description |
|:--- |:---|
|**accountName** | The name of the storage account. For example: `mystorageaccount`.  |
|**requestUrl** | The URL that is requested. For example: `http://mystorageaccount.blob.core.windows.net/cont1/blobname?timeout=10`.|
|**userAgentHeader** | The **User-Agent header** value, in quotes. For example: `WA-Storage/6.2.0 (.NET CLR 4.0.30319.42000; Win32NT 6.2.9200.0)`.|
|**referrerHeader** | The **Referrer** header value. For example: `http://contoso.com/about.html`.|
|**clientRequestId** | The **x-ms-client-request-id** header value of the request. For example: `360b66a6-ad4f-4c4a-84a4-0ad7cb44f7a6`. |
|**etag** | The ETag identifier for the returned object, in quotes. For example: `0x8D101F7E4B662C4`.  |
|**serverLatencyMs** | The total time expressed in milliseconds to perform the requested operation. This value doesn't include network latency (the time to read the incoming request and send the response to the requester). For example: `22`. |
|**serviceType** | The service associated with this request. For example: `blob`, `table`, `files`, or `queue`. |
|**operationCount** | The number of each logged operation that is involved in the request. This count starts with an index of `0`. Some requests require more than one operation, such as a request to copy a blob. Most requests perform only one operation. For example: `1`. |
|**requestHeaderSize** | The size of the request header expressed in bytes. For example: `578`. <br>If a request is unsuccessful, this value might be empty. |
|**requestBodySize** | The size of the request packets, expressed in bytes, that are read by the storage service. <br> For example: `0`. <br>If a request is unsuccessful, this value might be empty.  |
|**responseHeaderSize** | The size of the response header expressed in bytes. For example: `216`. <br>If a request is unsuccessful, this value might be empty.  |
|**responseBodySize** | The size of the response packets written by the storage service, in bytes. If a request is unsuccessful, this value may be empty. For example: `216`.  |
|**requestMd5** | The value of either the **Content-MD5** header or the **x-ms-content-md5** header in the request. The MD5 hash value specified in this field represents the content in the request. For example: `788815fd0198be0d275ad329cafd1830`. <br>This field can be empty.  |
|**serverMd5** | The value of the MD5 hash calculated by the storage service. For example: `3228b3cf1069a5489b298446321f8521`. <br>This field can be empty.  |
|**lastModifiedTime** | The Last Modified Time (LMT) for the returned object.  For example: `Tuesday, 09-Aug-11 21:13:26 GMT`. <br>This field is empty for operations that can return multiple objects. |
|**conditionsUsed** | A semicolon-separated list of key-value pairs that represent a condition. The conditions can be any of the following: <li> If-Modified-Since <li> If-Unmodified-Since <li> If-Match <li> If-None-Match  <br> For example: `If-Modified-Since=Friday, 05-Aug-11 19:11:54 GMT`. |
|**contentLengthHeader** | The value of the Content-Length header for the request sent to the storage service. If the request was successful, this value is equal to requestBodySize. If a request is unsuccessful, this value may not be equal to requestBodySize, or it might be empty. |
|**tlsVersion** | The TLS version used in the connection of request. For example: `TLS 1.2`. |
|**smbTreeConnectID** | The Server Message Block (SMB) **treeConnectId** established at tree connect time. For example: `0x3` |
|**smbPersistentHandleID** | Persistent handle ID from an SMB2 CREATE request that survives network reconnects.  Referenced in [MS-SMB2](https://docs.microsoft.com/openspecs/windows_protocols/ms-smb2/f1d9b40d-e335-45fc-9d0b-199a31ede4c3) 2.2.14.1 as **SMB2_FILEID.Persistent**. For example: `0x6003f` |
|**smbVolatileHandleID** | Volatile handle ID from an SMB2 CREATE request that is recycled on network reconnects.  Referenced in [MS-SMB2](https://docs.microsoft.com/openspecs/windows_protocols/ms-smb2/f1d9b40d-e335-45fc-9d0b-199a31ede4c3) 2.2.14.1 as **SMB2_FILEID.Volatile**. For example: `0xFFFFFFFF00000065` |
|**smbMessageID** | The connection relative **MessageId**. For example: `0x3b165` |
|**smbCreditsConsumed** | The ingress or egress consumed by the request, in units of 64k. For example: `0x3` |
|**smbCommandDetail** | More information about this specific request rather than the general type of request. For example: `0x2000 bytes at offset 0xf2000` |
|**smbFileId** | The **FileId** associated with the file or directory.  Roughly analogous to an NTFS FileId. For example: `0x9223442405598953` |
|**smbSessionID** | The SMB2 **SessionId** established at session setup time. For example: `0x8530280128000049` |
|**smbCommandMajor	uint32** | Value in the **SMB2_HEADER.Command**. Currently, this is a number between 0 and 18 inclusive. For example: `0x6` |
|**smbCommandMinor** | The subclass of **SmbCommandMajor**, where appropriate. For example: `DirectoryCloseAndDelete` |

## See also

- See [Monitoring Azure Storage](monitor-storage.md) for a description of monitoring Azure Storage.
- See [Monitoring Azure resources with Azure Monitor](../../azure-monitor/insights/monitor-azure-resource.md) for details on monitoring Azure resources.
---
title: Azure Blob Storage monitoring data reference
titleSuffix: Azure Storage
description: Log and metrics reference for monitoring data from Azure Blob Storage.
recommendations: false
author: normesta

ms.service: azure-blob-storage
ms.topic: reference
ms.date: 06/06/2023
ms.author: normesta
ms.custom: subject-monitoring
---

# Azure Blob Storage monitoring data reference

See [Monitoring Azure Storage](monitor-blob-storage.md) for details on collecting and analyzing monitoring data for Azure Storage.

## Metrics

The following tables list the platform metrics collected for Azure Storage.

### Capacity metrics

Capacity metrics values are refreshed daily (up to 24 Hours). The time grain defines the time interval for which metrics values are presented. The supported time grain for all capacity metrics is one hour (PT1H).

Azure Storage provides the following capacity metrics in Azure Monitor.

#### Account Level

[!INCLUDE [Account level capacity metrics](../../../includes/azure-storage-account-capacity-metrics.md)]

#### Blob storage

This table shows [Blob storage metrics](../../azure-monitor/essentials/metrics-supported.md#microsoftstoragestorageaccountsblobservices).

| Metric | Description |
| ------------------- | ----------------- |
| BlobCapacity | The total of Blob storage used in the storage account. <br/><br/> Unit: Bytes <br/> Aggregation Type: Average <br/> Value example: 1024 <br/> Dimensions: **BlobType**, and **Tier** ([Definition](#metrics-dimensions)) |
| BlobCount    | The number of blob objects stored in the storage account. <br/><br/> Unit: Count <br/> Aggregation Type: Average <br/> Value example: 1024 <br/> Dimensions: **BlobType**, and **Tier** ([Definition](#metrics-dimensions)) |
| BlobProvisionedSize | The amount of storage provisioned in the storage account. This metric is applicable to premium storage accounts only. <br/><br/> Unit: bytes <br/> Aggregation Type: Average |
| ContainerCount    | The number of containers in the storage account. <br/><br/> Unit: Count <br/> Aggregation Type: Average <br/> Value example: 1024 |
| IndexCapacity     | The amount of storage used by ADLS Gen2 Hierarchical Index <br/><br/> Unit: Bytes <br/> Aggregation Type: Average <br/> Value example: 1024 |

### Transaction metrics

Transaction metrics are emitted on every request to a storage account from Azure Storage to Azure Monitor. In the case of no activity on your storage account, there will be no data on transaction metrics in the period. All transaction metrics are available at both account and Blob storage service level. The time grain defines the time interval that metric values are presented. The supported time grains for all transaction metrics are PT1H and PT1M.

[!INCLUDE [Transaction metrics](../../../includes/azure-storage-account-transaction-metrics.md)]

<a id="metrics-dimensions"></a>

## Metrics dimensions

Azure Storage supports following dimensions for metrics in Azure Monitor.

### Dimensions available to all storage services

[!INCLUDE [Metrics dimensions](../../../includes/azure-storage-account-metrics-dimensions.md)]

### Dimensions specific to Blob storage

| Dimension Name | Description |
| ------------------- | ----------------- |
| **BlobType** | The type of blob for Blob metrics only. The supported values are **BlockBlob**, **PageBlob**, and **Azure Data Lake Storage**. Append blobs are included in **BlockBlob**. |
| **Tier** | Azure storage offers different access tiers, which allow you to store blob object data in the most cost-effective manner. See more in [Azure Storage blob tier](../blobs/access-tiers-overview.md). The supported values include: <br><br>**Hot**: Hot tier<br>**Cool**: Cool tier<br>**Cold**: Cold tier<br>**Archive**: Archive tier<br>**Premium**: Premium tier for block blob<br>**P4/P6/P10/P15/P20/P30/P40/P50/P60**: Tier types for premium page blob<br>**Standard**: Tier type for standard page Blob<br>**Untiered**: Tier type for general purpose v1 storage account |

For the metrics supporting dimensions, you need to specify the dimension value to see the corresponding metrics values. For example, if you look at  **Transactions** value for successful responses, you need to filter the **ResponseType** dimension with **Success**. If you look at **BlobCount** value for Block Blob, you need to filter the **BlobType** dimension with **BlockBlob**.

<a id="resource-logs-preview"></a>

## Resource logs

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

[!INCLUDE [Account level capacity metrics](../../../includes/azure-storage-logs-properties-operation.md)]

### Fields that describe how the operation was authenticated

```json
{
    "identity": {
        "authorization": [
            {
                "action": "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read",
                "denyAssignmentId": "821ddce4-021d-4d04-8a41-gggggggggggg",
                "principals": [
                    {
                        "id": "fde5ba15-4355-4223-b811-cccccccccccc",
                        "type": "User"
                    }
                ],
                "reason": "Policy",
                "result": "Granted",
                "roleAssignmentId": "ecf75cb8-491c-4a25-ad6e-aaaaaaaaaaaa",
                "roleDefinitionId": "b7e6dc6d-f1e8-4753-8033-ffffffffffff",
                "type": "RBAC"
            }
        ],
        "properties": {
            "metricResponseType": "Success",
            "objectKey": "/samplestorageaccount/samplecontainer/sampleblob.png"
           },
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

[!INCLUDE [Account level capacity metrics](../../../includes/azure-storage-logs-properties-authentication.md)]

### Fields that describe the service

```json
{
    "properties": {
        "accountName": "testaccount1",
        "requestUrl": "https://testaccount1.blob.core.windows.net:443/upload?restype=container&comp=list&prefix=&delimiter=/&marker=&maxresults=30&include=metadata&_=1551405598426",
        "userAgentHeader": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36 Edge/17.17134",
        "referrerHeader": "blob:https://portal.azure.com/6f50025f-3b88-488d-b29e-3c592a31ddc9",
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

[!INCLUDE [Account level capacity metrics](../../../includes/azure-storage-logs-properties-service.md)]

## See also

- See [Monitoring Azure Storage](monitor-blob-storage.md) for a description of monitoring Azure Storage.
- See [Monitoring Azure resources with Azure Monitor](../../azure-monitor/essentials/monitor-azure-resource.md) for details on monitoring Azure resources.

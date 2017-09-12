---
title: Azure Storage metrics in Azure Monitor | Microsoft Docs
description: Learn about the new metrics offered from Azure Monitor.
services: storage
documentationcenter: na
author: fhryo-msft
manager: cbrooks
editor: fhryo-msft

ms.assetid:
ms.service: storage
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage
ms.date: 09/05/2017
ms.author: fryu
---

# Azure Storage metrics in Azure Monitor (Preview)

Azure Storage Analytics provides metrics data and logging data for a storage account. You can use them to analyze usage trends, trace requests, and diagnose issues with your storage account.

Azure Monitor provides unified user interfaces on monitoring across different Azure services. For more information, see [Azure Monitor](https://docs.microsoft.com/en-us/azure/monitoring-and-diagnostics/monitoring-overview).

Azure Storage integrates Azure Monitor by sending metrics data to Azure Monitor backend. In the meanwhile, legacy metrics are still available in parallel. The plan of ending legacy metrics will be announced after we release Azure Monitor managed metrics officially.

# Access Metrics

Azure Monitor provides multiple ways to access metrics. You can access them from Azure Portal, Azure Monitor APIs (REST, .Net, Powershell & CLI) and third party solutions (OMS, Event Hub, etc.) as well. For more information, see [Azure Monitor Metrics](https://docs.microsoft.com/en-us/azure/monitoring-and-diagnostics/monitoring-overview-metrics).

Metrics are enabled by default, and you can access up to 30 days of data. If you need to keep more days, you can archive metrics data to storage account with [diagnostic settings](https://docs.microsoft.com/en-us/azure/monitoring-and-diagnostics/monitoring-overview-of-diagnostic-logs#resource-diagnostic-settings) in Azure Monitor.

## Access Metrics in Portal

You can monitor metrics over time in Portal. Here's an example to view **UsedCapacity** in account level.

![screenshot](./media/storage-metrics-in-azure-monitor/access-metrics-in-portal.png)

For metrics supporting dimension, you can filter with desired dimension value. Here's an example to view **Transactions** in account level with **Success** response type.

![screenshot](./media/storage-metrics-in-azure-monitor/access-metrics-in-portal-with-dimension.png)

## Access Metrics with REST API

Azure Monitor provides [REST API](https://docs.microsoft.com/en-us/rest/api/monitor/) to read metric definition and values. This section shows you how to read storage metrics. As resource id is used in every REST APIS, reading [Understanding resource id for services in Storage](Understanding resource id for services in Storage) first would help you know how to specify right resource id for account level and service level.

To simplify testing with REST API, [ArmClient](https://github.com/projectkudu/ARMClient) is used to demonstrate the usage from command line.

List account level metric definition with the REST API:

```
armclient GET /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Storage/storageAccounts/{storageAccountName}/providers/microsoft.insights/metricdefinitions?api-version=2017-05-01-preview

```

If you list metric definition for Blob, Table, File, or Queue, you require to specify different resource id with the API.

The response contains metric definition in json format:

```Json
{
  "value": [
    {
      "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Storage/storageAccounts/{storageAccountName}/providers/microsoft.insights/metricdefinitions/UsedCapacity",
      "resourceId": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Storage/storageAccounts/{storageAccountName}",
      "category": "Capacity",
      "name": {
        "value": "UsedCapacity",
        "localizedValue": "Used capacity"
      },
      "isDimensionRequired": false,
      "unit": "Bytes",
      "primaryAggregationType": "Average",
      "metricAvailabilities": [
        {
          "timeGrain": "PT1M",
          "retention": "P30D"
        },
        {
          "timeGrain": "PT1H",
          "retention": "P30D"
        }
      ]
    },
    .. next metric definition
  ]
}

```

Read account level metric values with the REST API:

```
armclient GET "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Storage/storageAccounts/{storageAccountName}/providers/microsoft.insights/metrics?metric=Availability&api-version=2017-05-01-preview&aggregation=Average&interval=PT1H"

```

The response contains metric values in json format:

```Json
{
  "cost": 0,
  "timespan": "2017-09-07T17:27:41Z/2017-09-07T18:27:41Z",
  "interval": "PT1H",
  "value": [
    {
      "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Storage/storageAccounts/{storageAccountName}/providers/Microsoft.Insights/metrics/Availability",
      "type": "Microsoft.Insights/metrics",
      "name": {
        "value": "Availability",
        "localizedValue": "Availability"
      },
      "unit": "Percent",
      "timeseries": [
        {
          "metadatavalues": [],
          "data": [
            {
              "timeStamp": "2017-09-07T17:27:00Z",
              "average": 100.0
            }
          ]
        }
      ]
    }
  ]
}

```

# Billing for Metrics

Using metrics in Azure Monitor is free. However, if you use additional solutions ingesting capacity metric data, you may be billed by these solutions. For example, you will be billed by Azure Storage if you archive metric data to storage account, or billed by Operation Management Suite (OMS) if you stream metric data to OMS for advanced analysis.

# Understanding resource id for services in Storage

Resource id is unique identifier of a resource in Azure. When you use Azure Monitor REST API to read metric definition or value, you need to use resource id for the resource you intend to operate. The resource id template is following this format:

```
/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/{resourceProviderNamespace}/{resourceType}/{resourceName}

```

Storage provides metrics on both storage account level and sub services level with Azure Monitor. When you are reading metrics in different level, you require to use different resource id.

Resource id for storage account is following this format:

```
/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Storage/storageAccounts/{storageAccountName}

```

Resource id for blob service is following this format:

```
/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Storage/storageAccounts/{storageAccountName}/blobServices/default

```

Resource id for table service is following this format:

```
/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Storage/storageAccounts/{storageAccountName}/tableServices/default

```

Resource id for queue service is following this format:

```
/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Storage/storageAccounts/{storageAccountName}/queueServices/default

```

Resource id for file service is following this format:

```
/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Storage/storageAccounts/{storageAccountName}/fileServices/default
```

Here’s an example showing how to query metric value with resource id in Azure Monitor REST API:

```
armclient get “/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Storage/storageAccounts/{storageAccountName}/blobServices/default/providers/microsoft.insights/metrics?metric=ContainerCount&api-version=2017-05-01-preview&aggregation=Average&interval=PT1H"
```

# Capacity Metrics

Capacity Metric values are sent to Azure Monitor every hour, and the value takes one day to refresh on the changes to a storage account.

Azure Storage provides the following capacity metrics in Azure Monitor.

**Account Level**

| Metric Name | Description |
| ------------------- | ----------------- |
| UsedCapacity | The amount of storage used by the storage account. <br/><br/> Unit: Bytes <br/> Aggregation Type: Average <br/> Value example: 1024 |

**Blob service**

| Metric Name | Description |
| ------------------- | ----------------- |
| BlobCapacity | The amount of storage used by the storage account’s Blob service. <br/><br/> Unit: Bytes <br/> Aggregation Type: Average <br/> Value example: 1024 <br/> Dimension: BlobType (Value is BlockBlob or PageBlob) |
| BlobCount    | The number of blob objects in the storage account’s Blob service. <br/><br/> Unit: Count <br/> Aggregation Type: Average <br/> Value example: 1024 <br/> Dimension: BlobType (Value is BlockBlob or PageBlob) |
| ContainerCount    | The number of containers in the storage account’s Blob service. <br/><br/> Unit: Count <br/> Aggregation Type: Average <br/> Value example: 1024 |

**Table service**

| Metric Name | Description |
| ------------------- | ----------------- |
| TableCapacity | The amount of storage used by the storage account’s Table service. <br/><br/> Unit: Bytes <br/> Aggregation Type: Average <br/> Value example: 1024 |
| TableCount   | The number of table in the storage account’s Table service. <br/><br/> Unit: Count <br/> Aggregation Type: Average <br/> Value example: 1024 |
| TableEntityCount | The number of table entities in the storage account’s Table service. <br/><br/> Unit: Count <br/> Aggregation Type: Average <br/> Value example: 1024 |

**Queue service**

| Metric Name | Description |
| ------------------- | ----------------- |
| QueueCapacity | The amount of storage used by the storage account’s Queue service. <br/><br/> Unit: Bytes <br/> Aggregation Type: Average <br/> Value example: 1024 |
| QueueCount   | The number of queues in the storage account’s Queue service. <br/><br/> Unit: Count <br/> Aggregation Type: Average <br/> Value example: 1024 |
| QueueMessageCount | The number of unexpired queue messages in the storage account’s Queue service. <br/><br/>Unit: Count <br/> Aggregation Type: Average <br/> Value example: 1024 |

**File service**

| Metric Name | Description |
| ------------------- | ----------------- |
| FileCapacity | The amount of storage used by the storage account’s File service. <br/><br/> Unit: Bytes <br/> Aggregation Type: Average <br/> Value example: 1024 |
| FileCount   | The number of files in the storage account’s File service. <br/><br/> Unit: Count <br/> Aggregation Type: Average <br/> Value example: 1024 |
| FileShareCount | The number of file shares in the storage account’s File service. <br/><br/> Unit: Count <br/> Aggregation Type: Average <br/> Value example: 1024 |

## Capacity Metrics Dimensions

Azure Storage supports following dimensions for capacity metrics in Azure Monitor.

| Dimension Name | Description |
| ------------------- | ----------------- |
| BlobType | The type of blob for Blob metrics only. The supported values are **BlockBlob** and **PageBlob**. Append Blob is included in BlockBlob. |

For the metrics supporting dimension, you need to specify dimension value to see responding metric value. For example, if you want to look at **BlobCount** value for Block Blob in Portal, you need to let **BlobType** dimension equal to **BlockBlob**.

# Transaction Metrics

Transaction metric values are emitted from Azure Storage to Azure Monitor every minute. All transaction metrics are available for both account level and service level (Blob, Table, Files, and Queue).

Azure Storage provides the following transaction metrics in Azure Monitor.

| Metric Name | Description |
| ------------------- | ----------------- |
| Transactions | The number of requests made to a storage service or the specified API operation. This number includes successful and failed requests, as well as requests which produced errors. <br/><br/> Unit: Count <br/> Aggregation Type: Total <br/> Applicable dimensions: ResponseType, GeoType, ApiName <br/> Value example: 1024 |
| Ingress | The amount of ingress data. This number includes ingress from an external client into Azure Storage as well as ingress within Azure. <br/><br/> Unit: Bytes <br/> Aggregation Type: Total <br/> Applicable dimensions: GeoType, ApiName <br/> Value example: 1024 |
| Egress | The amount of egress data. This number includes egress from an external client into Azure Storage as well as egress within Azure. As a result, this number does not reflect billable egress. <br/><br/> Unit: Bytes <br/> Aggregation Type: Total <br/> Applicable dimensions: GeoType, ApiName <br/> Value example: 1024 |
| SuccessServerLatency | The average latency used by Azure Storage to process a successful request. This value does not include the network latency specified in SuccessE2ELatency. <br/><br/> Unit: Milliseconds <br/> Aggregation Type: Average <br/> Applicable dimensions: GeoType, ApiName <br/> Value example: 1024 |
| SuccessE2ELatency | The average end-to-end latency of successful requests made to a storage service or the specified API operation. This value includes the required processing time within Azure Storage to read the request, send the response, and receive acknowledgment of the response. <br/><br/> Unit: Milliseconds <br/> Aggregation Type: Average <br/> Applicable dimensions: GeoType, ApiName <br/> Value example: 1024 |
| Availability | The percentage of availability for the storage service or the specified API operation. Availability is calculated by taking the total billable requests value and dividing it by the number of applicable requests, including those that produced unexpected errors. All unexpected errors result in reduced availability for the storage service or the specified API operation. <br/><br/> Unit: Percent <br/> Aggregation Type: Average <br/> Applicable dimensions: GeoType, ApiName <br/> Value example: 99.99 |

## Transaction Metrics Dimensions

Azure Storage supports following dimensions for transaction metrics in Azure Monitor.

| Dimension Name | Description |
| ------------------- | ----------------- |
| ResponseType | Transaction response type. The available values include: <br/><br/> <li>ServerOtherError: All other server-side errors except described ones </li> <li> ServerBusyError: Authenticated request that returned an HTTP 503 status code. (Not Supported yet) </li> <li> ServerTimeoutError: Timed-out authenticated request that returned an HTTP 500 status code. The timeout occurred due to a server error. </li> <li> ThrottlingError: Sum of client-side and server-side throttling error (Will be removed once ServerBusyError and ClientThrottlingError are supported) </li> <li> AuthorizationError: Authenticated request that failed due to unauthorized access of data or an authorization failure. </li> <li> NetworkError: Authenticated request that failed due to network errors. Most commonly occurs when a client prematurely closes a connection before timeout expiration. </li> <li> 	ClientThrottlingError: Client-side throttling error (Not supported yet) </li> <li> ClientTimeoutError: Timed-out authenticated request that returned an HTTP 500 status code. If the client’s network timeout or the request timeout is set to a lower value than expected by the storage service, this is an expected timeout. Otherwise, it is reported as a ServerTimeoutError. </li> <li> ClientOtherError: All other client-side errors except described ones. </li> <li> Success: Successful request|
| GeoType | Transaction from Primary or Secondary cluster. The available values include Primary and Secondary. |
| ApiName | The name of transaction. |

For the metrics supporting dimension, you need to specify dimension value to see responding metric value. For example, if you want to look at **Transactions** value for successful response in Portal, you need to let **ResponseType** dimension equal to **Success**.

## See Also

* [Azure Monitor](https://docs.microsoft.com/en-us/azure/monitoring-and-diagnostics/monitoring-overview)

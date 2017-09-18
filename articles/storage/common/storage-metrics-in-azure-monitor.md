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

With metrics on Azure Storage service, you can analyze usage trends, trace requests, and diagnose issues with your storage account.

Azure Monitor provides unified user interfaces for monitoring across different Azure services. For more information, see [Azure Monitor](https://docs.microsoft.com/en-us/azure/monitoring-and-diagnostics/monitoring-overview). Azure Storage integrates Azure Monitor by sending metric data to the Azure Monitor platform.

# Access Metrics

Azure Monitor provides multiple ways to access metrics. You can access them from Azure portal, Azure Monitor APIs (REST, and .Net) and third-party solutions (Operation Management Suite, Event Hub, etc.) as well. For more information, see  [Azure Monitor Metrics](https://docs.microsoft.com/en-us/azure/monitoring-and-diagnostics/monitoring-overview-metrics).

Metrics are enabled by default, and you can access up to last 30 days of data. If you need to retain data for more days, you can archive metrics data to an Azure Storage account. It's configured in [diagnostic settings](https://docs.microsoft.com/en-us/azure/monitoring-and-diagnostics/monitoring-overview-of-diagnostic-logs#resource-diagnostic-settings) in Azure Monitor.

## Access Metrics in Portal

You can monitor metrics over time in Azure portal. Here's an example to view **UsedCapacity** at account level.

![screenshot](./media/storage-metrics-in-azure-monitor/access-metrics-in-portal.png)

For metrics supporting dimension, you must filter with desired dimension value. Here's an example to view **Transactions** at account level with **Success** response type.

![screenshot](./media/storage-metrics-in-azure-monitor/access-metrics-in-portal-with-dimension.png)

## Access Metrics with REST API

Azure Monitor provides [REST API](https://docs.microsoft.com/en-us/rest/api/monitor/) to read metric definition and values. This section shows you how to read storage metrics. As resource ID is used in all REST APIS, it's recommended to read [Understanding resource ID for services in Storage](# Understanding resource ID for services in Storage) first.

To simplify testing with REST API, [ArmClient](https://github.com/projectkudu/ARMClient) is used to demonstrate the usage in command line.

List account level metric definition with the REST API:

```
# Login Azure and proceed with your credentials
> armclient login

> armclient GET /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Storage/storageAccounts/{storageAccountName}/providers/microsoft.insights/metricdefinitions?api-version=2017-05-01-preview

```

If you want to list metric definition for Blob, Table, File, or Queue, you need to specify different resource ID with the API.

The response contains metric definition in JSON format:

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
    ... next metric definition
  ]
}

```

Read account level metric values with the REST API:

```
> armclient GET "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Storage/storageAccounts/{storageAccountName}/providers/microsoft.insights/metrics?metric=Availability&api-version=2017-05-01-preview&aggregation=Average&interval=PT1H"

```

If you want to read metric values for Blob, Table, File, or Queue, you need to specify different resource ID with the API.

The response contains metric values in JSON format:

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

Using metrics in Azure Monitor is free for now. However, if you use additional solutions ingesting metric data, you may be billed by these solutions. For example, you are billed by Azure Storage if you archive metric data to an Azure Storage account. Or you are billed by Operation Management Suite (OMS) if you stream metric data to OMS for advanced analysis.

# Understanding resource ID for services in Storage

Resource ID is a unique identifier of a resource in Azure. When you use Azure Monitor REST API to read metric definition or value, you need to use resource ID for the resource you intend to operate on. The resource ID template follows this format:

```
/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/{resourceProviderNamespace}/{resourceType}/{resourceName}

```

Storage provides metrics at both storage account level and sub services level with Azure Monitor. When you are reading metrics at different levels, you require to use different resource ID.

Resource ID for storage account follows this format:

```
/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Storage/storageAccounts/{storageAccountName}

```

Resource ID for sub service follows this format:

```
# Blob service resource ID
/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Storage/storageAccounts/{storageAccountName}/blobServices/default

# Table service resource ID
/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Storage/storageAccounts/{storageAccountName}/tableServices/default

# Queue service resource ID
/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Storage/storageAccounts/{storageAccountName}/queueServices/default

# File service resource ID
/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Storage/storageAccounts/{storageAccountName}/fileServices/default

```

The pattern of Azure Monitor REST API is:

```
GET {resourceId}/providers/microsoft.insights/metrics?{parameters}

```

# Capacity Metrics

Capacity Metric values are sent to Azure Monitor every hour, and the value takes one day to refresh on the changes to a storage account. The time grain defines the time interval that metric values are presented. The supported time grain for all capacity metrics is one hour (PT1H).

Azure Storage provides the following capacity metrics in Azure Monitor.

**Account Level**

| Metric Name | Description |
| ------------------- | ----------------- |
| UsedCapacity | The amount of storage used by the storage account. For standard storage account, it’s the sum of capacity used by Blob, Table, File, and Queue. For premium storage account and blob storage account, it’s same as BlobCapacity. <br/><br/> Unit: Bytes <br/> Aggregation Type: Average <br/> Value example: 1024 |

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
| TableCount   | The number of tables in the storage account’s Table service. <br/><br/> Unit: Count <br/> Aggregation Type: Average <br/> Value example: 1024 |
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

# Transaction Metrics

Transaction metric values are emitted from Azure Storage to Azure Monitor every minute. All transaction metrics are available at both account and service level (Blob, Table, Files, and Queue). The time grain defines the time interval that metric values are presented. The supported time grains for all transaction metrics are PT1H and PT1M.

Azure Storage provides the following transaction metrics in Azure Monitor.

| Metric Name | Description |
| ------------------- | ----------------- |
| Transactions | The number of requests made to a storage service or the specified API operation. This number includes successful and failed requests, as well as requests that produced errors. <br/><br/> Unit: Count <br/> Aggregation Type: Total <br/> Applicable dimensions: ResponseType, GeoType, ApiName <br/> Value example: 1024 |
| Ingress | The amount of ingress data. This number includes ingress from an external client into Azure Storage as well as ingress within Azure. <br/><br/> Unit: Bytes <br/> Aggregation Type: Total <br/> Applicable dimensions: GeoType, ApiName <br/> Value example: 1024 |
| Egress | The amount of egress data. This number includes egress from an external client into Azure Storage as well as egress within Azure. As a result, this number does not reflect billable egress. <br/><br/> Unit: Bytes <br/> Aggregation Type: Total <br/> Applicable dimensions: GeoType, ApiName <br/> Value example: 1024 |
| SuccessServerLatency | The average time used to process a successful request by Azure Storage. This value does not include the network latency specified in SuccessE2ELatency. <br/><br/> Unit: Milliseconds <br/> Aggregation Type: Average <br/> Applicable dimensions: GeoType, ApiName <br/> Value example: 1024 |
| SuccessE2ELatency | The average end-to-end latency of successful requests made to a storage service or the specified API operation. This value includes the required processing time within Azure Storage to read the request, send the response, and receive acknowledgment of the response. <br/><br/> Unit: Milliseconds <br/> Aggregation Type: Average <br/> Applicable dimensions: GeoType, ApiName <br/> Value example: 1024 |
| Availability | The percentage of availability for the storage service or the specified API operation. Availability is calculated by taking the total billable requests value and dividing it by the number of applicable requests, including those requests that produced unexpected errors. All unexpected errors result in reduced availability for the storage service or the specified API operation. <br/><br/> Unit: Percent <br/> Aggregation Type: Average <br/> Applicable dimensions: GeoType, ApiName <br/> Value example: 99.99 |

## Metrics Dimensions

Azure Storage supports following dimensions for metrics in Azure Monitor.

| Dimension Name | Description |
| ------------------- | ----------------- |
| BlobType | The type of blob for Blob metrics only. The supported values are **BlockBlob** and **PageBlob**. Append Blob is included in BlockBlob. |
| ResponseType | Transaction response type. The available values include: <br/><br/> <li>ServerOtherError: All other server-side errors except described ones </li> <li> ServerBusyError: Authenticated request that returned an HTTP 503 status code. (Not Supported yet) </li> <li> ServerTimeoutError: Timed-out authenticated request that returned an HTTP 500 status code. The timeout occurred due to a server error. </li> <li> ThrottlingError: Sum of client-side and server-side throttling error (It will be removed once ServerBusyError and ClientThrottlingError are supported) </li> <li> AuthorizationError: Authenticated request that failed due to unauthorized access of data or an authorization failure. </li> <li> NetworkError: Authenticated request that failed due to network errors. Most commonly occurs when a client prematurely closes a connection before timeout expiration. </li> <li> 	ClientThrottlingError: Client-side throttling error (Not supported yet) </li> <li> ClientTimeoutError: Timed-out authenticated request that returned an HTTP 500 status code. If the client’s network timeout or the request timeout is set to a lower value than expected by the storage service, it is an expected timeout. Otherwise, it is reported as a ServerTimeoutError. </li> <li> ClientOtherError: All other client-side errors except described ones. </li> <li> Success: Successful request|
| GeoType | Transaction from Primary or Secondary cluster. The available values include Primary and Secondary. It applies to Read Access Geo Redundant Storage(RA-GRS) when reading objects from secondary tenant. |
| ApiName | The name of operation. For example: <br/> <li>CreateContainer</li> <li>DeleteBlob</li> <li>GetBlob</li> For all operation names, see [document](https://docs.microsoft.com/en-us/rest/api/storageservices/storage-analytics-logged-operations-and-status-messages#logged-operations). |

For the metrics supporting dimension, you need to specify the dimension value to see  corresponding metric value. For example, if you look at  **Transactions** value for successful responses, you need to filter **ResponseType** dimension with **Success**. Or if you look at **BlobCount** value for Block Blob, you need to filter **BlobType** dimension with **BlockBlob**.

## FAQ
**Q: Will legacy metrics be supported after Azure Monitor managed metrics are introduced?**

Legacy metrics are available in parallel with Azure Monitor managed metrics. The support keeps the same until Azure Storage ends the service on legacy metrics. We will announce the ending plan after we release Azure Monitor managed metrics officially.

## See Also

* [Azure Monitor](https://docs.microsoft.com/en-us/azure/monitoring-and-diagnostics/monitoring-overview)

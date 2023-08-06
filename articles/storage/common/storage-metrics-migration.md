---
title: Move from Storage Analytics metrics to Azure Monitor metrics
description: Learn how to transition from Storage Analytics metrics (classic metrics) to metrics in Azure Monitor. 
author: normesta
ms.service: azure-storage
ms.topic: conceptual
ms.date: 10/20/2020
ms.author: normesta
ms.reviewer: fryu
ms.subservice: storage-common-concepts
ms.custom: monitoring
---

# Transition to metrics in Azure Monitor

On **August 31, 2023** Storage Analytics metrics, also referred to as *classic metrics* will be retired. For more information, see the [official announcement](https://azure.microsoft.com/updates/azure-storage-classic-metrics-will-be-retired-on-31-august-2023/). If you use classic metrics, make sure to transition to metrics in Azure Monitor prior to that date. This article helps you make the transition.

## Steps to complete the transition

To transition to metrics in Azure Monitor, we recommend the following approach.

1. Learn about some of the [key differences](#key-differences-between-classic-metrics-and-metrics-in-azure-monitor) between classic metrics and metrics in Azure Monitor.

2. Compile a list of classic metrics that you currently use.

3. Identify [which metrics in Azure Monitor](#metrics-mapping-between-old-metrics-and-new-metrics) provide the same data as the metrics you currently use.

4. Create [charts](/training/modules/gather-metrics-blob-storage/2-viewing-blob-metrics-in-azure-portal) or [dashboards](/training/modules/gather-metrics-blob-storage/4-using-dashboards-in-the-azure-portal) to view metric data.

   > [!NOTE]
   > Metrics in Azure Monitor are enabled by default, so there is nothing you need to do to begin capturing metrics. You must however, create charts or dashboards to view those metrics.

5. If you've created alert rules that are based on classic storage metrics, then [create alert rules](../../azure-monitor/alerts/alerts-overview.md) that are based on metrics in Azure Monitor.

6. After you're able to see all of your metrics in Azure Monitor, you can turn off classic logging.

<a id="key-differences-between-classic-metrics-and-metrics-in-azure-monitor"></a>

## Classic metrics vs. metrics in Azure Monitor

This section describes a few key differences between these two metrics platforms.

The main difference is in how metrics are managed. Classic metrics are managed by Azure Storage whereas metrics in Azure Monitor are managed by Azure Monitor. With classic metrics, Azure Storage collects metric values, aggregates them, and then stores them in tables that are located in the storage account. With metrics in Azure Monitor, Azure Storage sends metric data to the Azure Monitor back end. Azure Monitor provides a unified monitoring experience that includes data from the Azure portal as well as data that is ingested.

Classic metrics are sent and stored in an Azure storage account. Azure Monitor metrics can be sent to multiple locations. A storage account can be one of those locations, but it not required.

As far as metrics support, classic metrics provide **capacity** metrics only for Azure Blob storage. Metrics in Azure Monitor provide capacity metrics for Blob, Table, File, Queue, and premium storage. Classic metrics provide **transaction** metrics on Blob, Table, Azure File, and Queue storage. Metrics in Azure Monitor add premium storage to that list.

If the activity in your account does not trigger a metric, classic metrics will show a value of zero (0) for that metric. Metrics in Azure Monitor will omit the data entirely, which leads to cleaner reports. For example, with classic metrics, if no server timeout errors are reported, then the `ServerTimeoutError` value in the metrics table is set to 0. Azure Monitor doesn't return any data when you query the value of metric `Transactions` with dimension `ResponseType` equal to `ServerTimeoutError`.

To learn more about metrics in Azure Monitor, see [Metrics in Azure Monitor](../../azure-monitor/essentials/data-platform-metrics.md).

<a id="metrics-mapping-between-old-metrics-and-new-metrics"></a>

## Map classic metrics to metrics in Azure Monitor

 Use these tables to identify which metrics in Azure Monitor provide the same data as the metrics you currently use.

**Capacity metrics**

| Classic metric | Metric in Azure Monitor |
| ------------------- | ----------------- |
| `Capacity`            | `BlobCapacity` with the dimension `BlobType` equal to `BlockBlob` or `PageBlob` |
| `ObjectCount`        | `BlobCount` with the dimension `BlobType` equal to `BlockBlob` or `PageBlob` |
| `ContainerCount`      | `ContainerCount` |

> [!NOTE]
> There are also several new capacity metrics that weren't available as classic metrics. To view the complete list, see [Metrics](../blobs/monitor-blob-storage-reference.md#metrics).

**Transaction metrics**

| Classic metric | Metric in Azure Monitor |
| ------------------- | ----------------- |
| `AnonymousAuthorizationError` | Transactions with the dimension `ResponseType` equal to `AuthorizationError` and dimension `Authentication` equal to `Anonymous` |
| `AnonymousClientOtherError` | Transactions with the dimension `ResponseType` equal to `ClientOtherError` and dimension `Authentication` equal to `Anonymous` |
| `AnonymousClientTimeoutError` | Transactions with the dimension `ResponseType` equal to `ClientTimeoutError` and dimension `Authentication` equal to `Anonymous` |
| `AnonymousNetworkError` | Transactions with the dimension `ResponseType` equal to `NetworkError` and dimension `Authentication` equal to `Anonymous` |
| `AnonymousServerOtherError` | Transactions with the dimension `ResponseType` equal to `ServerOtherError` and dimension `Authentication` equal to `Anonymous` |
| `AnonymousServerTimeoutError` | Transactions with the dimension `ResponseType` equal to `ServerTimeoutError` and dimension `Authentication` equal to `Anonymous` |
| `AnonymousSuccess` | Transactions with the dimension `ResponseType` equal to `Success` and dimension `Authentication` equal to `Anonymous` |
| `AnonymousThrottlingError` | Transactions with the dimension `ResponseType` equal to `ClientThrottlingError` or `ServerBusyError` and dimension `Authentication` equal to `Anonymous` |
| `AuthorizationError` | Transactions with the dimension `ResponseType` equal to `AuthorizationError` |
| `Availability` | `Availability` |
| `AverageE2ELatency` | `SuccessE2ELatency` |
| `AverageServerLatency` | `SuccessServerLatency` |
| `ClientOtherError` | Transactions with the dimension `ResponseType` equal to `ClientOtherError` |
| `ClientTimeoutError` | Transactions with the dimension `ResponseType` equal to `ClientTimeoutError` |
| `NetworkError` | Transactions with the dimension `ResponseType` equal to `NetworkError` |
| `PercentAuthorizationError` | Transactions with the dimension `ResponseType` equal to `AuthorizationError` |
| `PercentClientOtherError` | Transactions with the dimension `ResponseType` equal to `ClientOtherError` |
| `PercentNetworkError` | Transactions with the dimension `ResponseType` equal to `NetworkError` |
| `PercentServerOtherError` | Transactions with the dimension `ResponseType` equal to `ServerOtherError` |
| `PercentSuccess` | Transactions with the dimension `ResponseType` equal to `Success` |
| `PercentThrottlingError` | Transactions with the dimension `ResponseType` equal to `ClientThrottlingError` or `ServerBusyError` |
| `PercentTimeoutError` | Transactions with the dimension `ResponseType` equal to `ServerTimeoutError` or `ResponseType` equal to `ClientTimeoutError` |
| `SASAuthorizationError` | Transactions with the dimension `ResponseType` equal to `AuthorizationError` and dimension `Authentication` equal to `SAS` |
| `SASClientOtherError` | Transactions with the dimension `ResponseType` equal to `ClientOtherError` and dimension `Authentication` equal to `SAS` |
| `SASClientTimeoutError` | Transactions with the dimension `ResponseType` equal to `ClientTimeoutError` and dimension `Authentication` equal to `SAS` |
| `SASNetworkError` | Transactions with the dimension `ResponseType` equal to `NetworkError` and dimension `Authentication` equal to `SAS` |
| `SASServerOtherError` | Transactions with the dimension `ResponseType` equal to `ServerOtherError` and dimension `Authentication` equal to `SAS` |
| `SASServerTimeoutError` | Transactions with the dimension `ResponseType` equal to `ServerTimeoutError` and dimension `Authentication` equal to `SAS` |
| `SASSuccess` | Transactions with the dimension `ResponseType` equal to `Success` and dimension `Authentication` equal to `SAS` |
| `SASThrottlingError` | Transactions with the dimension `ResponseType` equal to `ClientThrottlingError` or `ServerBusyError` and dimension `Authentication` equal to `SAS` |
| `ServerOtherError` | Transactions with the dimension `ResponseType` equal to `ServerOtherError` |
| `ServerTimeoutError` | Transactions with the dimension `ResponseType` equal to `ServerTimeoutError` |
| `Success` | Transactions with the dimension `ResponseType` equal to `Success` |
| `ThrottlingError` | `Transactions` with the dimension `ResponseType` equal to `ClientThrottlingError` or `ServerBusyError`|
| `TotalBillableRequests` | `Transactions` |
| `TotalEgress` | `Egress` |
| `TotalIngress` | `Ingress` |
| `TotalRequests` | `Transactions` |

## Next steps

- [Azure Monitor](../../azure-monitor/overview.md)

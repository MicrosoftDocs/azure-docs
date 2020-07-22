---
title: Move from Storage Analytics metrics to Azure Monitor metrics | Microsoft Docs
description: Learn how to transition from Storage Analytics metrics (classic metrics) to metrics in Azure Monitor. 
author: normesta
ms.service: storage
ms.topic: conceptual
ms.date: 07/22/2020
ms.author: normesta
ms.reviewer: fryu
ms.subservice: common
ms.custom: monitoring
---

# Transition from Storage Analytics metrics (classic metrics) to metrics in Azure Monitor

Azure Storage integrates metrics into the Azure Monitor platform. This article helps you transition from using Storage Analytics metrics to using metrics in Azure Monitor. 

In future, the Storage Analytics metrics service will end with an early notification based on Azure Policy. If you depend on these metrics, you'll have to begin using equivalent metrics in Azure Monitor prior the service end date to maintain your metric information.  

Metrics in Azure Monitor are automatically enabled, so there is no migration process. This article helps you to transition to using metrics in Azure Monitor.

> [!NOTE]
> For the remainder of this article, we'll use the term *classic metrics* to refer to Storage Analytics metrics.

1. Learn about some of the key differences between classic metrics and metrics in Azure Monitor. 

   See [Some key differences between classic metrics and metrics in Azure Monitor](#key-differences-between-classic-metrics-and-metrics-in-azure-monitor).

2. Compile a list of classic metrics that you currently use.

3. Identify which metrics in Azure Monitor provide the same data as the metrics you currently use. 
   
   See [A map of classic metrics to metrics in Azure Monitor](#map-classic-metrics-to-metrics-in-azure-monitor).

   Metrics in Azure Monitor are enabled by default, so after you've identified which metrics you want to monitor, you can view them by creating charts, reports, and dashboards. 

4. View metrics and create reports.
 
   - To create charts in the Azure Portal, see [View Blob Metrics in Azure portal](https://docs.microsoft.com/learn/modules/gather-metrics-blob-storage/2-viewing-blob-metrics-in-azure-portal).
   
   Rather than keep creating a chart every time you want to see the metric data, you can use dashboards to check on specific metrics regularly.
   
   - To add metrics to dashboards, see [Use dashboards in the Azure portal](https://docs.microsoft.com/learn/modules/gather-metrics-blob-storage/4-using-dashboards-in-the-azure-portal).

5. If you've created alert rules based on classic storage metrics, then create alert rules based on metrics in Azure Monitor. 

   See [Overview of alerts in Microsoft Azure](https://docs.microsoft.com/azure/azure-monitor/platform/alerts-overview).

6. After you are able to see all of your metrics in Azure Monitor, you can turn off classic logging. 

<a id="key-differences-between-classic-metrics-and-metrics-in-azure-monitor"></a>

## Some key differences between classic metrics and metrics in Azure Monitor

The primary difference between classic metrics and metrics in Azure Monitor is in how and where those metrics are managed. Classic metrics are managed by Azure Storage. Azure Storage collects metric values, aggregates them, and stores them in $Metric tables within the same storage account. Metrics in Azure Monitor are managed by Azure Monitor. Azure Storage emits the metric data to the Azure Monitor back end. Azure Monitor provides a unified monitoring experience, including data from the portal as well as data ingestion. 

Classic metrics provide capacity metrics only on Azure Blob storage and transaction metrics on Blob storage, Table storage, Azure Files, and Queue storage. Metrics in Azure Monitor provide both capacity metrics and transaction metrics on Blob, Table, File, Queue, and premium storage.

Multi-dimension is one of the features that Azure Monitor provides. Azure Storage adopts that design in defining their metric schema. Multi-dimension design provides cost efficiency on bandwidth from ingestion as well as capacity from storing metrics. Consequently, if your traffic has not triggered related metrics, the related metric data will not be generated. For example, if your traffic has not triggered any server timeout errors, Azure Monitor doesn't return any data when you query the value of metric **Transactions** with dimension **ResponseType** equal to **ServerTimeoutError**.

In contrast, classic metrics are designed in a flat schema. The design results in zero metric value when you don't have the traffic patterns triggering the metric. For example, the **ServerTimeoutError** value is set to 0 in $Metric tables even when you don't receive any server timeout errors from the live traffic to a storage account.

<a id="map-classic-metrics-to-metrics-in-azure-monitor"></a>

## A map of classic metrics to metrics in Azure Monitor

The following tables map classic metrics to metrics in Azure Monitor.

**Capacity metrics**

| Classic metric | Metric in Azure Monitor |
| ------------------- | ----------------- |
| **Capacity**            | **BlobCapacity** with the dimension **BlobType** equal to **BlockBlob** or **PageBlob** |
| **ObjectCount**        | **BlobCount** with the dimension **BlobType** equal to **BlockBlob** or **PageBlob** |
| **ContainerCount**      | **ContainerCount** |

> [!NOTE]
> There are also several new capacity metrics that weren't available as classic metrics. To view the complete list, see [Metrics](../common/monitor-storage-reference.md#metrics).

**Transaction metrics**

| Classic metric | Metric in Azure Monitor |
| ------------------- | ----------------- |
| **AnonymousAuthorizationError** | Transactions with the dimension **ResponseType** equal to **AuthorizationError** and dimension **Authentication** equal to **Anonymous** |
| **AnonymousClientOtherError** | Transactions with the dimension **ResponseType** equal to **ClientOtherError** and dimension **Authentication** equal to **Anonymous** |
| **AnonymousClientTimeoutError** | Transactions with the dimension **ResponseType** equal to **ClientTimeoutError** and dimension **Authentication** equal to **Anonymous** |
| **AnonymousNetworkError** | Transactions with the dimension **ResponseType** equal to **NetworkError** and dimension **Authentication** equal to **Anonymous** |
| **AnonymousServerOtherError** | Transactions with the dimension **ResponseType** equal to **ServerOtherError** and dimension **Authentication** equal to **Anonymous** |
| **AnonymousServerTimeoutError** | Transactions with the dimension **ResponseType** equal to **ServerTimeoutError** and dimension **Authentication** equal to **Anonymous** |
| **AnonymousSuccess** | Transactions with the dimension **ResponseType** equal to **Success** and dimension **Authentication** equal to **Anonymous** |
| **AnonymousThrottlingError** | Transactions with the dimension **ResponseType** equal to **ClientThrottlingError** or **ServerBusyError** and dimension **Authentication** equal to **Anonymous** |
| **AuthorizationError** | Transactions with the dimension **ResponseType** equal to **AuthorizationError** |
| **Availability** | **Availability** |
| **AverageE2ELatency** | **SuccessE2ELatency** |
| **AverageServerLatency** | **SuccessServerLatency** |
| **ClientOtherError** | Transactions with the dimension **ResponseType** equal to **ClientOtherError** |
| **ClientTimeoutError** | Transactions with the dimension **ResponseType** equal to **ClientTimeoutError** |
| **NetworkError** | Transactions with the dimension **ResponseType** equal to **NetworkError** |
| **PercentAuthorizationError** | Transactions with the dimension **ResponseType** equal to **AuthorizationError** |
| **PercentClientOtherError** | Transactions with the dimension **ResponseType** equal to **ClientOtherError** |
| **PercentNetworkError** | Transactions with the dimension **ResponseType** equal to **NetworkError** |
| **PercentServerOtherError** | Transactions with the dimension **ResponseType** equal to **ServerOtherError** |
| **PercentSuccess** | Transactions with the dimension **ResponseType** equal to **Success** |
| **PercentThrottlingError** | Transactions with the dimension **ResponseType** equal to **ClientThrottlingError** or **ServerBusyError** |
| **PercentTimeoutError** | Transactions with the dimension **ResponseType** equal to **ServerTimeoutError** or **ResponseType** equal to **ClientTimeoutError** |
| **SASAuthorizationError** | Transactions with the dimension **ResponseType** equal to **AuthorizationError** and dimension **Authentication** equal to **SAS** |
| **SASClientOtherError** | Transactions with the dimension **ResponseType** equal to **ClientOtherError** and dimension **Authentication** equal to **SAS** |
| **SASClientTimeoutError** | Transactions with the dimension **ResponseType** equal to **ClientTimeoutError** and dimension **Authentication** equal to **SAS** |
| **SASNetworkError** | Transactions with the dimension **ResponseType** equal to **NetworkError** and dimension **Authentication** equal to **SAS** |
| **SASServerOtherError** | Transactions with the dimension **ResponseType** equal to **ServerOtherError** and dimension **Authentication** equal to **SAS** |
| **SASServerTimeoutError** | Transactions with the dimension **ResponseType** equal to **ServerTimeoutError** and dimension **Authentication** equal to **SAS** |
| **SASSuccess** | Transactions with the dimension **ResponseType** equal to **Success** and dimension **Authentication** equal to **SAS** |
| **SASThrottlingError** | Transactions with the dimension **ResponseType** equal to **ClientThrottlingError** or **ServerBusyError** and dimension **Authentication** equal to **SAS** |
| **ServerOtherError** | Transactions with the dimension **ResponseType** equal to **ServerOtherError** |
| **ServerTimeoutError** | Transactions with the dimension **ResponseType** equal to **ServerTimeoutError** |
| **Success** | Transactions with the dimension **ResponseType** equal to **Success** |
| **ThrottlingError** | **Transactions** with the dimension **ResponseType** equal to **ClientThrottlingError** or **ServerBusyError**|
| **TotalBillableRequests** | **Transactions** |
| **TotalEgress** | **Egress** |
| **TotalIngress** | **Ingress** |
| **TotalRequests** | **Transactions** |

## Next steps

* [Azure Monitor](../../monitoring-and-diagnostics/monitoring-overview.md)
* [Storage metrics in Azure Monitor](./storage-metrics-in-azure-monitor.md)

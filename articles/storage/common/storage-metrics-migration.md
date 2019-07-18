---
title: Azure Storage metrics migration | Microsoft Docs
description: Learn how to migrate old metrics to new metrics that are managed by Azure Monitor.
services: storage
author: normesta

ms.service: storage
ms.topic: article
ms.date: 03/30/2018
ms.author: normesta
ms.reviewer: fryu
ms.subservice: common
---

# Azure Storage metrics migration

Aligned with the strategy of unifying the monitor experience in Azure, Azure Storage integrates metrics to the Azure Monitor platform. In the future, the service of the old metrics will end with an early notification based on Azure policy. If you rely on old storage metrics, you need to migrate prior to the service end date in order to maintain your metric information.

This article shows you how to migrate from the old metrics to the new metrics.

## Understand old metrics that are managed by Azure Storage

Azure Storage collects old metric values, and aggregates and stores them in $Metric tables within the same storage account. You can use the Azure portal to set up a monitoring chart. You can also use the Azure Storage SDKs to read the data from $Metric tables that are based on the schema. For more information, see [Storage Analytics](./storage-analytics.md).

Old metrics provide capacity metrics only on Azure Blob storage. Old metrics provide transaction metrics on Blob storage, Table storage, Azure Files, and Queue storage.

Old metrics are designed in a flat schema. The design results in zero metric value when you don't have the traffic patterns triggering the metric. For example, the **ServerTimeoutError** value is set to 0 in $Metric tables even when you don't receive any server timeout errors from the live traffic to a storage account.

## Understand new metrics managed by Azure Monitor

For new storage metrics, Azure Storage emits the metric data to the Azure Monitor back end. Azure Monitor provides a unified monitoring experience, including data from the portal as well as data ingestion. For more details, you can refer to this [article](../../monitoring-and-diagnostics/monitoring-overview-metrics.md).

New metrics provide capacity metrics and transaction metrics on Blob, Table, File, Queue, and premium storage.

Multi-dimension is one of the features that Azure Monitor provides. Azure Storage adopts the design in defining new metric schema. For supported dimensions on metrics, you can find details in [Azure Storage metrics in Azure Monitor](./storage-metrics-in-azure-monitor.md). Multi-dimension design provides cost efficiency on both bandwidth from ingestion and capacity from storing metrics. Consequently, if your traffic has not triggered related metrics, the related metric data will not be generated. For example, if your traffic has not triggered any server timeout errors, Azure Monitor doesn't return any data when you query the value of metric **Transactions** with dimension **ResponseType** equal to **ServerTimeoutError**.

## Metrics mapping between old metrics and new metrics

If you read metric data programmatically, you need to adopt the new metric schema in your programs. To better understand the changes, you can refer to the mapping listed in the following table:

**Capacity metrics**

| Old metric | New metric |
| ------------------- | ----------------- |
| **Capacity**            | **BlobCapacity** with the dimension **BlobType** equal to **BlockBlob** or **PageBlob** |
| **ObjectCount**        | **BlobCount** with the dimension **BlobType** equal to **BlockBlob** or **PageBlob** |
| **ContainerCount**      | **ContainerCount** |

The following metrics are new offerings that the old metrics don't support:
* **TableCapacity**
* **TableCount**
* **TableEntityCount**
* **QueueCapacity**
* **QueueCount**
* **QueueMessageCount**
* **FileCapacity**
* **FileCount**
* **FileShareCount**
* **UsedCapacity**

**Transaction metrics**

| Old metric | New metric |
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

## FAQ

### How should I migrate existing alert rules?

If you have created classic alert rules based on old storage metrics, you need to create new alert rules based on the new metric schema.

### Is new metric data stored in the same storage account by default?

No. To archive the metric data to a storage account, use the [Azure Monitor Diagnostic Setting API](https://docs.microsoft.com/rest/api/monitor/diagnosticsettings/createorupdate).

## Next steps

* [Azure Monitor](../../monitoring-and-diagnostics/monitoring-overview.md)
* [Storage metrics in Azure Monitor](./storage-metrics-in-azure-monitor.md)

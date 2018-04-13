---
title: Azure Storage metrics migration | Microsoft Docs
description: Learn about how to migrate legacy metrics to new metrics managed by Azure Monitor.
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
ms.date: 03/30/2018
ms.author: fryu
---

# Azure Storage metrics migration

Aligned with the strategy of unifying Monitor experience in Azure, Azure Storage on-boards metrics to Azure Monitor platform. In the future, the service of legacy metrics will be ended with early notice based on Azure policy. If you rely on legacy storage metrics, you need to migrate prior to the service end date in order to maintain your metric information.

This article guides you in migrating from legacy metrics to the new metrics.

## Understand legacy metrics managed by Azure Storage

Azure Storage collects legacy metric values, aggregates, and stores them in $Metric tables within the same storage account. You can use Azure portal to set up monitoring chart, and you can also use Azure Storage SDKs to read the data from $Metric tables based on the schema. For more details, you can refer to this [Storage Analytics](./storage-analytics.md).

Legacy metrics provide capacity metrics on Blob only and transaction metrics on Blob, Table, File, and Queue.

Legacy metrics are designed in flat schema. The design results in zero metric value when you don't have the traffic patterns triggering the metric. For example, **ServerTimeoutError** is set to 0 in $Metric tables even when you don't receive any server timeout errors from the live traffic to storage account.

## Understand new metrics managed by Azure Monitor

For new storage metrics, Azure Storage emits the metric data to Azure Monitor backend. Azure monitor provides a unified monitoring experience, including data from the portal as well as data ingestion. For more details, you can refer to this [article](../../monitoring-and-diagnostics/monitoring-overview-metrics.md).

New metrics provide capacity metrics and transaction metrics on Blob, Table, File, Queue, and premium storage.

Multi-dimension is one of features provided by Azure Monitor. Azure Storage adopts the design in defining new metric schema. For supported dimensions on metrics, you can find details in this [Azure Storage metrics in Azure Monitor](./storage-metrics-in-azure-monitor.md). Multi-dimension design provides cost efficiency on both bandwidth from ingestion and capacity from storing metrics. Consequently, if your traffic has not triggered related metrics, the related metric data will not be generated. For example, if your traffic has not triggered any server timeout errors, Azure Monitor returns no data when you query the value of metric **Transactions** with dimension **ResponseType** equal to **ServerTimeoutError**.

## Metrics mapping between legacy metrics and new metrics

If you read metric data programmatically, you need to adopt the new metric schema in your programs. To better understand the changes, you can refer to the mapping listed the following table:

**Capacity metrics**

| Legacy Metric | New Metric |
| ------------------- | ----------------- |
| Capacity            | BlobCapacity with dimension BlobType equal to BlockBlob or PageBlob |
| ObjectCount         | BlobCount with dimension BlobType equal to BlockBlob or PageBlob |
| ContainerCount      | ContainerCount |

The following metrics are new offerings that legacy metrics don't support:
* TableCapacity
* TableCount
* TableEntityCount
* QueueCapacity
* QueueCount
* QueueMessageCount
* FileCapacity
* FileCount
* FileShareCount
* UsedCapacity

**Transaction metrics**

| Legacy Metric | New Metric |
| ------------------- | ----------------- |
| AnonymousAuthorizationError | Transactions with dimension ResponseType equal to AuthorizationError |
| AnonymousClientOtherError | Transactions with dimension ResponseType equal to ClientOtherError |
| AnonymousClientTimeoutError | Transactions with dimension ResponseType equal to ClientTimeoutError |
| AnonymousNetworkError | Transactions with dimension ResponseType equal to NetworkError |
| AnonymousServerOtherError | Transactions with dimension ResponseType equal to ServerOtherError |
| AnonymousServerTimeoutError | Transactions with dimension ResponseType equal to ServerTimeoutError |
| AnonymousSuccess | Transactions with dimension ResponseType equal to Success |
| AnonymousThrottlingError | Transactions with dimension ResponseType equal to ClientThrottlingError or ServerBusyError |
| AuthorizationError | Transactions with dimension ResponseType equal to AuthorizationError |
| Availability | Availability |
| AverageE2ELatency | SuccessE2ELatency |
| AverageServerLatency | SuccessServerLatency |
| ClientOtherError | Transactions with dimension ResponseType equal to ClientOtherError |
| ClientTimeoutError | Transactions with dimension ResponseType equal to ClientTimeoutError |
| NetworkError | Transactions with dimension ResponseType equal to NetworkError |
| PercentAuthorizationError | Transactions with dimension ResponseType equal to AuthorizationError |
| PercentClientOtherError | Transactions with dimension ResponseType equal to ClientOtherError |
| PercentNetworkError | Transactions with dimension ResponseType equal to NetworkError |
| PercentServerOtherError | Transactions with dimension ResponseType equal to ServerOtherError |
| PercentSuccess | Transactions with dimension ResponseType equal to Success |
| PercentThrottlingError | Transactions with dimension ResponseType equal to ClientThrottlingError or ServerBusyError |
| PercentTimeoutError | Transactions with dimension ResponseType equal to ServerTimeoutError or ResponseType equal to ClientTimeoutError|
| SASAuthorizationError | Transactions with dimension ResponseType equal to AuthorizationError |
| SASClientOtherError | Transactions with dimension ResponseType equal to ClientOtherError |
| SASClientTimeoutError | Transactions with dimension ResponseType equal to ClientTimeoutError |
| SASNetworkError | Transactions with dimension ResponseType equal to NetworkError |
| SASServerOtherError | Transactions with dimension ResponseType equal to ServerOtherError |
| SASServerTimeoutError | Transactions with dimension ResponseType equal to ServerTimeoutError |
| SASSuccess | Transactions with dimension ResponseType equal to Success |
| SASThrottlingError | Transactions with dimension ResponseType equal to ClientThrottlingError or ServerBusyError |
| ServerOtherError | Transactions with dimension ResponseType equal to ServerOtherError |
| ServerTimeoutError | Transactions with dimension ResponseType equal to ServerTimeoutError |
| Success | Transactions with dimension ResponseType equal to Success |
| ThrottlingError | Transactions with dimension ResponseType equal to ClientThrottlingError or ServerBusyError |
| TotalBillableRequests | Transactions |
| TotalEgress | Egress |
| TotalIngress | Ingress |
| TotalRequests | Transactions |

## FAQ

* How should I migrate existing alert rules?

A: If you have created classic alert rules based on legacy storage metrics, you need to create new alert rules based on new metric schema.

* Will new metric data stored in the same storage account by default?

A: No. If you need to archive the metric data to storage account, you can use [Diagnostic Setting in Azure Monitor](https://azure.microsoft.com/blog/azure-monitor-multiple-diagnostic-settings/)

## Next steps

* [Azure Monitor](../../monitoring-and-diagnostics/monitoring-overview.md)
* [Storage Metrics in Azure Monitor](./storage-metrics-in-azure-monitor.md)

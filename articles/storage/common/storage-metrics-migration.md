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

Aligned with the strategy of unifying Monitor experience in Azure, Azure Storage on-boards metrics to Azure Monitor platform. In the future, the service of legacy metrics will be ended with early notice based on Azure policy. If you rely on legacy storage metrics, you are required to migrate before the service is ended.

This article guides you in migrating from legacy metrics managed by Azure Storage to the new metrics managed by Azure Monitor.

## Understand legacy metrics managed by Azure Storage

Azure Storage collects metric values, aggregates and stores them in $Metrics tables within the same storage account. You can use Azure Portal to setup monitoring chart, and you can also use Azure Storage SDKs to read the data from metric tables based on the metric schema. For more details, you can refer to this [article](storage-analytics.md).

Legacy metrics provide capacity metrics on Blob only and transaction metrics on Blob, Table, File and Queue.

Legacy metrics are designed in flat schema. The design results in zero metric value when you don't have the traffic patterns triggering the metric. For example, ThrottlingError is set to 0 in $Metric tables when you receive the throttling error from your live traffic to storage account.

## Understand new metrics managed by Azure Monitor

Azure Monitor provides unified monitor experiences for all services on-boarded including portal experience and data ingestion experience. For more details, you can refer to this [article](../../monitoring-and-diagnostics/monitoring-overview-metrics.md).

New metrics provide capacity metrics and transaction metrics on Blob, Table, File, Queue and premium storage.

By on-boarding storage metrics to Azure Monitor, multi-dimension design on metrics is adopted and we re-shape metric with multi-dimension. For supported dimensions, you can find details in this [article](../../monitoring-and-diagnostics/monitoring-overview-metrics.md). This provides cost efficiency on both bandwidth from ingestion and capacity from storing metrics. Consequently, if your traffic to storage accounts has not triggered related metrics, there won't be related metric values generated. For example, if you have not been throttled in your traffic storage account, Azure Monitor will return no data when you query Transactions with dimension ResponseType equal to ThrottlingError.

## Metrics mapping between legacy metrics and new metrics

If you ingest metric data progromatically, you are required to adopt the new metric schema in your programs. To help you better understand the changes, you can refer to mapping listed the following table.

**Capacity metrics**

| Legacy Metric | New Metric |
| ------------------- | ----------------- |
| Capacity            | BlobCapacity with dimension BlobType equal to BlockBlob or BlobType equal to PageBlob |
| ObjectCount         | BlobCount with dimension BlobType equal to BlockBlob or BlobType equal to PageBlob |
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
| AnonymousThrottlingError | Transactions with dimension ResponseType equal to ThrottlingError |
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
| PercentThrottlingError | Transactions with dimension ResponseType equal to ThrottlingError |
| PercentTimeoutError | Transactions with dimension ResponseType equal to ServerTimeoutError or ResponseType equal to ClientTimeoutError|
| SASAuthorizationError | Transactions with dimension ResponseType equal to AuthorizationError |
| SASClientOtherError | Transactions with dimension ResponseType equal to ClientOtherError |
| SASClientTimeoutError | Transactions with dimension ResponseType equal to ClientTimeoutError |
| SASNetworkError | Transactions with dimension ResponseType equal to NetworkError |
| SASServerOtherError | Transactions with dimension ResponseType equal to ServerOtherError |
| SASServerTimeoutError | Transactions with dimension ResponseType equal to ServerTimeoutError |
| SASSuccess | Transactions with dimension ResponseType equal to Success |
| SASThrottlingError | Transactions with dimension ResponseType equal to ThrottlingError |
| ServerOtherError | Transactions with dimension ResponseType equal to ServerOtherError |
| ServerTimeoutError | Transactions with dimension ResponseType equal to ServerTimeoutError |
| Success | Transactions with dimension ResponseType equal to Success |
| ThrottlingError | Transactions with dimension ResponseType equal to ThrottlingError |
| TotalBillableRequests | Transactions |
| TotalEgress | Egress |
| TotalIngress | Ingress |
| TotalRequests | Transactions |

## FAQ

* How should I migrate existing alert rules?
A: If you have create classic alert rules based on legacy storage metrics, you need to create new alert rules based on new metric definition.

## See Also

* [Azure Monitor](../../monitoring-and-diagnostics/monitoring-overview.md)
* [Storage Metrics in Azure Monitor](./storage-metrics-in-azure-monitor.md)

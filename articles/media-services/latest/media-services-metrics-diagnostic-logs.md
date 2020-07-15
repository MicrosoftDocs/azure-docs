---
title: Media Services metrics and diagnostic logs with Azure Monitor
titleSuffix: Azure Media Services
description: Learn how to monitor Azure Media Services metrics and diagnostic logs via Azure Monitor.
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/08/2019
ms.author: juliako

---

# Monitor Media Services metrics and diagnostic logs via Azure Monitor

[Azure Monitor](../../azure-monitor/overview.md) lets you monitor metrics and diagnostic logs that help you understand how your apps are performing. All data collected by Azure Monitor fits into one of two fundamental types: metrics and logs. You can monitor Media Services diagnostic logs and create alerts and notifications for the collected metrics and logs. You can visualize and analyze the metrics data using [Metrics explorer](../../azure-monitor/platform/metrics-getting-started.md). You can send logs to [Azure Storage](https://azure.microsoft.com/services/storage/), stream them to [Azure Event Hubs](https://azure.microsoft.com/services/event-hubs/), export them to [Log Analytics](https://azure.microsoft.com/services/log-analytics/), or use third-party services.

For a detailed overview, see [Azure Monitor Metrics](../../azure-monitor/platform/data-platform.md) and [Azure Monitor Diagnostic logs](../../azure-monitor/platform/platform-logs-overview.md).

This topic discusses supported [Media Services Metrics](#media-services-metrics) and [Media Services Diagnostic logs](#media-services-diagnostic-logs).

## Media Services metrics

Metrics are collected at regular intervals whether or not the value changes. They're useful for alerting because they can be sampled frequently, and an alert can be fired quickly with relatively simple logic. For information on how to create metric alerts, see [Create, view, and manage metric alerts using Azure Monitor](../../azure-monitor/platform/alerts-metric.md).

Media Services supports monitoring metrics for the following resources:

* Account
* Streaming Endpoint

### Account

You can monitor the following account metrics.

|Metric name|Display name|Description|
|---|---|---|
|AssetCount|Asset count|Assets in your account.|
|AssetQuota|Asset quota|Asset quota in your account.|
|AssetQuotaUsedPercentage|Asset quota used percentage|The percentage of the Asset quota already used.|
|ContentKeyPolicyCount|Content Key Policy count|Content Key Policies in your account.|
|ContentKeyPolicyQuota|Content Key Policy quota|Content Key Policies quota in your account.|
|ContentKeyPolicyQuotaUsedPercentage|Content Key Policy quota used percentage|The percentage of the Content Key Policy quota already used.|
|StreamingPolicyCount|Streaming Policy count|Streaming Policies in your account.|
|StreamingPolicyQuota|Streaming Policy quota|Streaming Policies quota in your account.|
|StreamingPolicyQuotaUsedPercentage|Streaming Policy quota used percentage|The percentage of the Streaming Policy quota already used.|

You should also review [account quotas and limits](limits-quotas-constraints.md).

### Streaming Endpoint

The following Media Services [Streaming Endpoints](https://docs.microsoft.com/rest/api/media/streamingendpoints) metrics are supported:

|Metric name|Display name|Description|
|---|---|---|
|Requests|Requests|Provides the total number of HTTP requests served by the Streaming Endpoint.|
|Egress|Egress|Egress bytes total per minute per Streaming Endpoint.|
|SuccessE2ELatency|Success end to end Latency|Time duration from when the Streaming Endpoint received the request to when the last byte of the response was sent.|

### Why would I want to use metrics?

Here are examples of how monitoring Media Services metrics can help you understand how your apps are performing. Some questions that can be addressed with Media Services metrics are:

* How do I monitor my Standard Streaming Endpoint to know when I have exceeded the limits?
* How do I know if I have enough Premium Streaming Endpoint scale units?
* How can I set an alert to know when to scale up my Streaming Endpoints?
* How do I set an alert to know when the max egress configured on the account was reached?
* How can I see the breakdown of requests failing and what is causing the failure?
* How can I see how many HLS or DASH requests are being pulled from the packager?
* How do I set an alert to know when the threshold value of # of failed requests was hit?

### Example

See [How to monitor Media Services metrics](media-services-metrics-howto.md).

## Media Services diagnostic logs

Diagnostic logs provide rich and frequent data about the operation of an Azure resource. For more information, see [How to collect and consume log data from your Azure resources](../../azure-monitor/platform/platform-logs-overview.md).

Media Services supports the following diagnostic logs:

* Key delivery

### Key delivery

|Name|Description|
|---|---|
|Key delivery service request|Logs that show the key delivery service request information. For more information, see [schemas](media-services-diagnostic-logs-schema.md).|

### Why would I want to use diagnostics logs?

Some things that you can examine with key delivery diagnostic logs are:

* See the number of licenses delivered by DRM type.
* See the number of licenses delivered by policy.
* See errors by DRM or policy type.
* See the number of unauthorized license requests from clients.

### Example

See [How to monitor Media Service diagnostic logs](media-services-diagnostic-logs-howto.md).

## Next steps

* [How to collect and consume log data from your Azure resources](../../azure-monitor/platform/platform-logs-overview.md)
* [Create, view, and manage metric alerts using Azure Monitor](../../azure-monitor/platform/alerts-metric.md)
* [How to monitor Media Services metrics](media-services-metrics-howto.md)
* [How to monitor Media Service diagnostic logs](media-services-diagnostic-logs-howto.md)

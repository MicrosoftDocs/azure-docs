---
title: Monitor Media Services metrics and diagnostic logs via Azure Monitor | Microsoft Docs
description: This article gives an overview of how to monitor Media Services metrics and diagnostic logs via Azure Monitor.
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
ms.date: 05/23/2019
ms.author: juliako

---

# Monitor Media Services metrics and diagnostic logs

[Azure Monitor](../../azure-monitor/overview.md) enables you to monitor metrics and diagnostic logs that help you understand how your applications are performing. All data collected by Azure Monitor fits into one of two fundamental types, metrics and logs. You can monitor Media Services diagnostic logs and create alerts and notifications for the collected metrics and logs. 
You can visualize and analyze the metrics data using [Metrics explorer](../../azure-monitor/platform/metrics-getting-started.md). You can send logs to [Azure Storage](https://azure.microsoft.com/services/storage/), stream them to [Azure Event Hubs](https://azure.microsoft.com/services/event-hubs/), and export them to [Log Analytics](https://azure.microsoft.com/services/log-analytics/), or use 3rd party services.

For detailed overview, see [Azure Monitor Metrics](../../azure-monitor/platform/data-platform.md) and [Azure Monitor Diagnostic logs](../../azure-monitor/platform/diagnostic-logs-overview.md).

This topic discusses currently available [Media Services Metrics](#media-services-metrics) and [Media Services Diagnostic logs](#media-services-diagnostic-logs).

## Media Services metrics

Metrics are collected at regular intervals whether or not the value changes. They're useful for alerting because they can be sampled frequently, and an alert can be fired quickly with relatively simple logic.

Currently, the following Media Services [Streaming Endpoints](https://docs.microsoft.com/rest/api/media/streamingendpoints) metrics are emitted by Azure:

|Metric|Display name|Description|
|---|---|---|
|Requests|Requests|Gives details around total # of requests serviced by the Streaming Endpoint.|
|Egress|Egress|Total number of egress bytes. For example, bytes streamed by the Streaming Endpoint.|
|SuccessE2ELatency|Success end to end Latency| Time duration from when Streaming Endpoint received request and when last byte of the response was sent.|

### Scenarios

Some qeuestions that can be addressed with Media Services metrics are:

•	How do I monitor my Standard Streaming Endpoint to know when I have exceeded the limits?
•	How do I know if I have enough Premium Streaming Endpoint units? 
•	How can I set an alert to know when to scale up my Streaming Endpoints?
•	How can I see the breakdown of requests failing and what is causing the failure?
•	How can I see how many HLS or DASH requests are being pulled from the packager?

### Example

For example, to get "Egress" metrics with CLI, you would run the following `az monitor metrics` CLI command:

```cli
az monitor metrics list --resource \
   "/subscriptions/<subscription id>/resourcegroups/<resource group name>/providers/Microsoft.Media/mediaservices/<Media Services account name>/streamingendpoints/<streaming endpoint name>" \
   --metric "Egress"
```

## Media Services diagnostic logs

Currently, you can get the following diagnostic logs:

|Name|Description|
|---|---|
|Key delivery service request|Logs that show the key delivery service request information. For more details, see [schemas](media-services-diagnostic-logs-schema.md).|

To enable storage of diagnostic logs in a Storage Account, you would run the following `az monitor diagnostic-settings` CLI command: 

```cli
az monitor diagnostic-settings create --name <diagnostic name> \
    --storage-account <name or ID of storage account> \
    --resource <target resource object ID> \
    --resource-group <storage account resource group> \
    --logs '[
    {
        "category": <category name>,
        "enabled": true,
        "retentionPolicy": {
            "days": <# days to retain>,
            "enabled": true
        }
    }]'
```

### Scenarios

Some things that you can examine with Key Delivery diagnostics are:

* See the number of licenses delivered by DRM type
* See the number of licenses delivered by policy 
* See errors by DRM or policy type
* See the number of unauthorized license requests from clients

### Example

```cli
az monitor diagnostic-settings create --name amsv3diagnostic \
    --storage-account storageaccountforamsv3  \
    --resource "/subscriptions/00000000-0000-0000-0000-0000000000/resourceGroups/amsv3ResourceGroup/providers/Microsoft.Media/mediaservices/amsv3account" \
    --resource-group "amsv3ResourceGroup" \
    --logs '[{"category": "KeyDeliveryRequests",  "enabled": true, "retentionPolicy": {"days": 3, "enabled": true }}]'
```

## Why would I want to use metrics and diagnostics logs? 

Here are examples of how monitoring Media Services metrics and logs can help you understand how your applications are performing:

### Metrics

* Monitor my Standard Streaming endpoint to know when I have exceeded the limits
* Set an alert to know when to scale up my Streaming Endpoints
* See the breakdown of requests failing and what is causing the failure
* See how many HLS or DASH requests are being pulled from the packager

For information on how to create metric alerts, see [Create, view, and manage metric alerts using Azure Monitor](../../azure-monitor/platform/alerts-metric.md).

### Logs

* See the number of licenses delivered by DRM type
* See the number of licenses delivered by policy
* See errors by DRM or policy type
* See the number of unauthorized license requests from clients

[How to collect and consume log data from your Azure resources](../../azure-monitor/platform/diagnostic-logs-overview.md).

## Next steps 

* [Monitor Media Services metrics](media-services-metrics-howto.md)
* [Monitor Media Service diagnostic logs](media-services-diagnostic-logs-howto.md)

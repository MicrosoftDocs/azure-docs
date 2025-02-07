---
title: Supported metrics for managed Functions in Azure Static Web Apps
description: List of metrics collected for managed Functions in Azure Static Web Apps
services: static-web-apps
author: craigshoemaker
ms.service: azure-static-web-apps
ms.topic: how-to
ms.date: 12/20/2024
ms.author: cshoe
ms.custom:
---

# Supported metrics for managed Functions in Azure Static Web Apps

Azure Static Web Apps collects a series of metrics when you add a managed API to your application.

To view metrics on your app, open your static web app in the Azure portal and select **Monitoring**. In the *Monitoring* query window, you have access to metrics that report activity of your application.

## Supported metrics

The following metrics are tracked for your application:

| Name | Description |
|---|---|
| `BytesSent` | The number of outgoing bytes. |
| `CdnPercentageOf4XX` | Percentage of requests that result in `400` series server responses. |
| `CdnPercentageOf5XX` | Percentage of requests that result in `500` series server responses. |
| `CdnRequestCount` | Number of requests that make it to the site when enterprise grade edge is enabled. |
| `CdnResponseSize` | Size of CDN responses in bytes. |
| `CdnTotalLatency` | Time, measured in milliseconds, representing the CDN latency. |
| `DataApiErrors` | Number of errors produced from API calls. |
| `DataApiHits` | Number of hit to API endpoints. |
| `FunctionErrors` | Number of errors encounter by managed API functions. |
| `FunctionHits` | Number of hits to managed API functions. |
| `SiteErrors` | Number of errors encountered by the website. |
| `SiteHits` | Number of hits to the website. |

## Related content

* [Monitoring in Azure Static Web Apps](./monitor.md)

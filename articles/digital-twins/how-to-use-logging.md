---
title: How to enable logging in Azure Digital Twins | Microsoft Docs
description: How to enable customer diagnostic logs in Azure Digital Twins
author: kingdomofends
manager: alinast
ms.service: digital-twins
services: digital-twins
ms.topic: conceptual
ms.date: 10/15/2018
ms.author: adgera
---

# How to enable logging in Azure Digital Twins

Azure Digital Twins supports robust logging and analytics provided through Azure Log Analytics, diagnostic logs, and activity logging. Logging methods can be combined to summarize records across several services or to provide granular logging coverage for multiple services.

This article summarizes logging options and how to combine them in ways specific to Azure Digital Twins.

## Review activity logs

Azure [activity logs](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-overview-activity-logs) provide quick insights into subscription-level event and operation histories for each Azure service instance. Resource creation or removal are examples of these kinds of subscription-level events:

![Activity log][1]

>[!TIP]
>Use activity logs for quick insights into subscription-level events.

## Enable customer diagnostic logs

Azure [diagnostic settings](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-overview-of-diagnostic-logs)  can be set for each Azure instance to supplement activity logging. Whereas activity logs pertain to subscription-levels events, diagnostic logging provides insights into the operational history of the resources themselves. The execution time for a user-driven function, a successful API call, or retrieving an app key from a vault are examples of diagnostic events.

[CDN diagatonistic](https://docs.microsoft.com/azure/cdn/cdn-azure-diagnostic-logs)

![Diagnostic settings one][2]

![Diagnostic settings two][3]

>[!TIP]
>Use diagnostic logs for insights into resource operations.

## Azure monitor and log analytics

Azure Monitor contains the powerful Log Analytics service which allows logging sources to be viewed and analyzed in one location. For example, multiple diagnostic log histories can be combined, queried, and viewed in Azure Monitor.

Because log histories can quickly become immense, full log querying capabilities are provided through [Azure Log Analytics](https://docs.microsoft.com/azure/log-analytics/log-analytics-queries):

![Log analytics][4]

## Other options

Fore a thorough overview of all Azure logging options, see the [Azure log audit](https://docs.microsoft.com/azure/security/azure-log-audit) article.

<!-- Images -->
[1]: media/how-to-use-logging/activity-log.png
[2]: media/how-to-use-logging/diagnostic-settings-one.png
[3]: media/how-to-use-logging/diagnostic-settings-two.png
[4]: media/how-to-use-logging/log-analytics.png
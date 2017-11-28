---
title: Troubleshoot issues in Azure Monitor - Alerts | Microsoft Docs
description: Learn about issues related to Alerts in Azure Monitor and how to work around those.
services: hdinsight
documentationcenter: ''
author: vinagara
manager: kmadnani
editor: ''
services: monitoring-and-diagnostics
documentationcenter: monitoring-and-diagnostics

ms.assetid: 
ms.service: monitoring-and-diagnostics
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/24/2017
ms.author: robb

---
# Known issues for Alerts on Azure Monitor

This document keeps track of all the known issues for the Alerts service in Azure Monitor, including in public preview.  

## Log Search Alerts with Queries across workspaces and apps
Azure Alerts accepts any valid log analytics query without syntax errors for running log search alerts. In the recent past, Azure log analytics has introduced ability to create complex queries which can span across workspaces as well as apps. More details on [Query across resources in Azure log analytics](https://azure.microsoft.com/en-us/blog/query-across-resources/). Log Search Alerts currently accepts such queries for alerting, but will fail in alerting for them.

**Explanation:**
Due to complexities in execution as well as authentication of cross workspace and app queries;  currently Alerts (Preview) will fail to execute query which goes beyond its current workspace or app. As a result, the alert will fail and never push for any configured trigger action. 

**Mitigation:**
Support for **Query across resources** in Azure Alerts is planned and will be provided soon.
A workaround the issue till that time, is creating multiple alerts instead of a combined query across workspaces or apps; with same periodicity as well as frequency. By this one can get alerts across each individual workspace in the same time period and can compare both before intervention.

* [Get an overview of Azure Alerts (Preview)](monitoring-overview-unified.md) including the types of information you can collect and monitor.
* Learn more about the new [near real-time metric alerts (preview)](monitoring-near-real-time-metric-alerts.md)
* Get an [overview of metrics collection](insights-how-to-customize-monitoring.md) to make sure your service is available and responsive.
* Learn about [Log Search Alerts for Log Analytics in Azure Alerts (preview)](monitor-alerts-unified-log.md)
* Learn about [Azure Alerts](monitor-overview-alerts.md)
* Learn more about [configuring webhooks in alerts](insights-webhooks-alerts.md).

---
title: Azure Security data export to SIEM- Pipeline Configuration [Preview] | Microsoft Docs
description: This article documents the produce of getting Azure security center logs to a SIEM
services: security-center
documentationcenter: na
author: Barclayn
manager: MBaldwin
editor: ''

ms.assetid: 
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 02/01/2018
ms.author: barclayn

---

# Azure Security data export to SIEM- Pipeline Configuration [Preview]

This document details the procedure to export Azure Security Center security data to a SIEM.

Processed events produced by Azure Security Center are published to the Azure [Activity log](../monitoring-and-diagnostics/monitoring-overview-activity-logs.md), one of the log types available through Azure Monitor. Azure Monitor offers a consolidated pipeline for routing any of your monitoring data into a SIEM tool. This is done by streaming that data to an Event Hub where it can then be pulled into a partner tool.

This pipe uses the [Azure Monitoring single pipeline](../monitoring-and-diagnostics/monitor-stream-monitoring-data-event-hubs.md) for getting access to the monitoring data from your Azure environment. This enables you to easily set up SIEMs and monitoring tools to consume the data.

The next sections describe how you can configure data to be streamed to an event hub. The steps assume that you already have Azure Security Center configured in your Azure subscription.

High-level overview

![High-Level overview](media/security-center-export-data-to-siem/overview.png)

## What is the Azure security data exposed to SIEM?

In this preview version we expose the [security alerts.](../security-center/security-center-managing-and-responding-alerts.md) In upcoming releases, we will enrich the data set with security recommendations.

## How to setup the pipeline? 

### Create an Event Hub 

Before you begin, you need to [create an Event Hubs namespace](../event-hubs/event-hubs-create.md). This namespace and Event Hub is the destination for all your monitoring data.

### Stream the Azure Activity Log to Event Hubs

Please refer to the following article [stream activity log to Event Hubs](../monitoring-and-diagnostics/monitoring-stream-activity-logs-event-hubs.md)

### Install a partner SIEM connector 

Routing your monitoring data to an Event Hub with Azure Monitor enables you to easily integrate with partner SIEM and monitoring tools.

Refer to the following link to see the list of [supported SIEMs](../monitoring-and-diagnostics/monitor-stream-monitoring-data-event-hubs.md#what-can-i-do-with-the-monitoring-data-being-sent-to-my-event-hub)

## Example for Querying data 

Here is a couple of Splunk queries that you can use to pull alert data:

| **Description of Query**                                | **Query**                                                                                                                              |
|---------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------|
| All Alerts                                              | index=main Microsoft.Security/locations/alerts                                                                                         |
| Summarize count of operations by their name             | index=main sourcetype="amal:security" \| table operationName \| stats count by operationName                                |
| Get Alerts info: Time, Name, State, ID, and Subscription | index=main Microsoft.Security/locations/alerts \| table \_time, properties.eventName, State, properties.operationId, am_subscriptionId |


## Next steps

- [Supported SIEMs](../monitoring-and-diagnostics/monitor-stream-monitoring-data-event-hubs.md#what-can-i-do-with-the-monitoring-data-being-sent-to-my-event-hub)
- [Stream activity log to Event Hubs](../monitoring-and-diagnostics/monitoring-stream-activity-logs-event-hubs.md)
- [Security alerts.](../security-center/security-center-managing-and-responding-alerts.md)
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
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 01/24/2018
ms.author: barclayn

---

# Azure Security data export to SIEM- Pipeline Configuration [Preview]

This document details the procedure to export Azure Security Center security data to a SIEM.

The data pipe described below takes security-reported information from Azure Monitoring [activity log](https://docs.microsoft.com/en-us/azure/monitoring-and-diagnostics/monitoring-overview-activity-logs) and streams it via an EventHub. From the EventHub it can then be pulled into a partner tool.

This pipe uses the [Azure Monitoring single pipeline](https://docs.microsoft.com/en-us/azure/monitoring-and-diagnostics/monitor-stream-monitoring-data-event-hubs) for getting access to the monitoring data from your Azure environment. This enables you to easily set up SIEMs and monitoring tools to consume the data.

The next sections describe how you can configure data to be streamed to an event hub. The steps assume that you already have assets at that tier to be monitored.

High-level overview

![High-Level overview](media/security-center-exporting-data-to-siem/overview.png)

## What is the Azure security data exposed to SIEM?

In this preview version we expose the [security alerts.](https://docs.microsoft.com/en-us/azure/security-center/security-center-managing-and-responding-alerts) In upcoming releases, we will enrich the data set with security recommendations.

## How to setup the pipeline? 

### Create an event hub 

Before you begin, you need to [create an Event Hubs namespace and event hub](https://docs.microsoft.com/en-us/azure/event-hubs/event-hubs-create). This namespace and event hub is the destination for all your monitoring data.

### Stream the Azure Activity Log to Event Hubs

Please refer to the following article [stream activity log to Event Hubs](../monitoring-and-diagnostics/monitoring-stream-activity-logs-event-hubs.md#stream-azure-activity-log-data-into-an-event-hub)

### Install a partner SIEM connector 

Routing your monitoring data to an event hub with Azure Monitor enables you to easily integrate with partner SIEM and monitoring tools.

Refer to the following link to see the list of [supported SIEMs](https://docs.microsoft.com/en-us/azure/monitoring-and-diagnostics/monitor-stream-monitoring-data-event-hubs)

## Example for Querying data 

Here is a couple of Splunk queries that you can use to pull alert data:

| **Description of Query**                                | **Query**                                                                                                                              |
|---------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------|
| All Alerts                                              | index=main Microsoft.Security/locations/alerts                                                                                         |
| Summarize count of operations by their name             | **Alerts** index=main sourcetype="amal:security" \| table operationName \| stats count by operationName                                |
| Get Alerts info: Time, Name, State, Id and Subscription | index=main Microsoft.Security/locations/alerts \| table \_time, properties.eventName, State, properties.operationId, am_subscriptionId |

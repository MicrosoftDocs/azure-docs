---
title: Frequently asked questions about Azure Active Directory logs in Azure Monitor Diagnostics | Microsoft Docs
description: FAQ and known issues of Azure Active Directory activity logs in Azure Monitor Diagnostics 
services: active-directory
documentationcenter: ''
author: priyamohanram
manager: mtillman
editor: ''

ms.assetid: a2e8b5b5-9eed-403e-8572-d529c270fe7c
ms.service: active-directory
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.component: compliance-reports
ms.date: 05/17/2018
ms.author: priyamo
ms.reviewer: dhanyahk

---

# Frequently asked questions about Azure Active Directory logs in Azure Monitor Diagnostics

This article contains the frequently asked questions and known issues with Azure Active Directory logs in Azure monitor diagnostics. 

## Q: Where should I start? 

Start with the [Overview](active-directory-reporting-azure-monitor-diagnostics-overview.md) to get an idea about what you need to deploy this feature. Once you're familiar with the pre-requisites, check out our tutorials to help you configure and  route your logs to Event Hubs.

## Q: Which logs are included?

Both sign-ins and audit logs are available for routing through this feature, although B2C related audit events are currently not included. Read the [Audit log schema](active-directory-reporting-azure-monitor-diagnostics-audit-log-schema.md) and [Sign-in log schema](active-directory-reporting-azure-monitor-diagnostics-sign-in-log-schema.md) to find out which types of logs and which feature-based logs are currently supported. 


## Q: How soon after an action will the corresponding logs show up in Event Hubs?

The logs should show up in Event Hubs anywhere between 2 and 5 minutues of performing the action. For more information about event hubs, see [What is event hubs?](https://docs.microsoft.com/en-us/azure/event-hubs/event-hubs-what-is-event-hubs)

## Q: How soon after an action will the corresponding logs show up in storage accounts?

For Azure storage accounts, the latency is anywhere between 5 and 15 minutues of performing the action.

## Q: How much will it cost to store my data?

The storage cost depends on the size of your logs as well as the retention period you choose. For a ballpark estimate of the costs for tenants depending on the volume of logs generated, check out our [Overview](active-directory-reporting-azure-monitor-diagnostics-overview.md).

## Q: How much will it cost to stream my data to Event Hubs?

The streaming cost depends on the number of messages you receive per minute. Read the [Overview](active-directory-reporting-azure-monitor-diagnostics-overview.md) to learn more about how the cost is calculated as well as find a ballpark estimate based on the number of messages. 

## Q: What SIEM tools are currently supported? 

Currently, Azure monitor diagnostics is supported by Splunk, QRadar and Sumologic. However, Splunk is the only SIEM tools that is supported for Azure Active Directory logs. We are currently working with both Sumologic and Qradar to map our schema to a format that their connector can understand. For more information on how the connectors work, see [Stream Azure monitoring data to an event hub for consumption by an external tool](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitor-stream-monitoring-data-event-hubs).

## Q: Can I access the data from Event Hub without using an external SIEM tool? 

Yes, you can use the [Event Hub API](https://docs.microsoft.com/azure/event-hubs/event-hubs-dotnet-standard-getstarted-receive-eph) to access the logs from your custom application. 


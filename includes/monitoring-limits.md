---
title: "include file" 
description: "include file" 
services: azure-monitor
author: rboucher
tags: azure-service-management
ms.topic: "include"
ms.date: 02/07/2019
ms.author: robb
ms.custom: "include file"
---
| Resource | Default limit | Maximum limit |
| --- | --- | --- |
| Autoscale settings |100 per region per subscription. | Same as default. |
| Metric alerts (classic) |100 active alert rules per subscription. | Call support. |
| Metric alerts |1000 active alert rules per subscription (in public clouds) and 100 active alert rules per subscription in Azure China and Azure Government. | Call support. |
| Activity log alerts | 100 active alert rules per subscription. | Same as default. |
| Log alerts | 512 | Call support. |
| Action groups |2,000 action groups per subscription. | Call support. |

**Action group-specific limits**

| Resource | Default limit | Maximum limit |
| --- | --- | --- |
| Azure app push | 10 Azure app actions per action group. | Call support. |
| Email | 1,000 email actions in an action group. Also see the [rate limiting information](../articles/azure-monitor/platform/alerts-rate-limiting.md). | Call support. |
| ITSM | 10 ITSM actions in an action group. | Call support. | 
| Logic app | 10 logic app actions in an action group. | Call support. |
| Runbook | 10 runbook actions in an action group. | Call support. |
| SMS | 10 SMS actions in an action group. Also see the [rate limiting information](../articles/azure-monitor/platform/alerts-rate-limiting.md). | Call support. |
| Voice | 10 voice actions in an action group. Also see the [rate limiting information](../articles/azure-monitor/platform/alerts-rate-limiting.md). | Call support. |
| Webhook | 10 webhook actions in an action group.  Maximum number of webhook calls is 1500 per minute per subscription. Other limits are available at [action-specific information](../articles/azure-monitor/platform/action-groups.md#action-specific-information).  | Call support. |

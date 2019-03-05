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
| Resource | Default Limit | Maximum Limit |
| --- | --- | --- |
| Autoscale Settings |100 per region per subscription | same as default |
| Metric Alerts (classic) |100 active alert rules per subscription | call support |
| Metric Alerts |100 active alert rules per subscription | call support |
| Action Groups |2000 action groups per subscription | call support |

**Action Group specific Limits**
| Resource | Default Limit | Maximum Limit |
| --- | --- | --- |
| Azure app Push | 10 Azure app actions per Action Group | call support |
| Email | 1000 email actions in an Action Group. Also see the [rate limiting information](../articles/azure-monitor/platform/alerts-rate-limiting.md). | call support |
| ITSM | 10 ITSM actions in an Action Group | call support | 
| Logic App | 10 Logic App actions in an Action Group | call support |
| Runbook | 10 Runbook actions in an Action Group | call support |
| SMS | 10 SMS actions in an Action Group. Also see the [rate limiting information](../articles/azure-monitor/platform/alerts-rate-limiting.md). | call support |
| Voice | 10 Voice actions in an Action Group. Also see the [rate limiting information](../articles/azure-monitor/platform/alerts-rate-limiting.md). | call support |
| Webhook | 10 Webhook actions in an Action Group. Other limits available at [action specific information](../articles/azure-monitor/platform/action-groups.md#action-specific-information).  | call support |

---
title: "include file" 
description: "include file" 
services: azure-monitor
author: rboucher
tags: azure-service-management
ms.topic: "include"
ms.date: 10/01/2020
ms.author: robb
ms.custom: "include file"
---

| Resource | Default limit | Maximum limit |
| --- | --- | --- |
| Azure app push | 10 Azure app actions per action group. | Same as Default |
| Email | 1,000 email actions in an action group.<br>No more than 100 emails in an hour.<br>Also see the [rate limiting information](../articles/azure-monitor/alerts/alerts-rate-limiting.md). | Same as Default |
| ITSM | 10 ITSM actions in an action group. | Same as Default | 
| Logic app | 10 logic app actions in an action group. | Same as Default |
| Runbook | 10 runbook actions in an action group. | Same as Default |
| SMS | 10 SMS actions in an action group.<br>No more than 1 SMS message every 5 minutes.<br>Also see the [rate limiting information](../articles/azure-monitor/alerts/alerts-rate-limiting.md). | Same as Default |
| Voice | 10 voice actions in an action group.<br>No more than 1 voice call every 5 minutes.<br>Also see the [rate limiting information](../articles/azure-monitor/alerts/alerts-rate-limiting.md). | Same as Default |
| Webhook | 10 webhook actions in an action group.  Maximum number of webhook calls is 1500 per minute per subscription. Other limits are available at [action-specific information](../articles/azure-monitor/alerts/action-groups.md#action-specific-information).  | Same as Default |
---
title: "include file" 
description: "include file" 
services: azure-monitor
author: rboucher
tags: azure-service-management
ms.topic: "include"
ms.date: 2/14/2021
ms.author: dukek
ms.custom: "include file"
---
You can have an unlimited number of action groups in a subscription.

| Resource | Default limit | Maximum limit |
| --- | --- | --- |
| Azure app push | 10 Azure app actions per action group. | Same as default |
| Email | 1,000 email actions in an action group.<br>No more than 100 emails in an hour.<br>Also see the [rate limiting information](../articles/azure-monitor/alerts/alerts-rate-limiting.md). | Same as default |
| Email Azure Resource Manager role | 10 email Resource Manager role actions per action group. | Same as default |
| Event hub | 10 event hub actions per action group. | Same as default |
| IT Service Management (ITSM) | 10 ITSM actions in an action group. | Same as default | 
| Logic app | 10 logic app actions in an action group. | Same as default |
| Runbook | 10 runbook actions in an action group. | Same as default |
| Secure Webhook | 10 Secure Webhook actions in an action group. Maximum number of webhook calls is 1,500 per minute per subscription. Other limits are available at [action-specific information](../articles/azure-monitor/alerts/action-groups.md#action-specific-information). | Same as default |
| SMS | 10 SMS actions in an action group.<br>No more than one SMS message every 5 minutes.<br>Also see the [rate limiting information](../articles/azure-monitor/alerts/alerts-rate-limiting.md). | Same as default |
| Voice | 10 voice actions in an action group.<br>No more than one voice call every 5 minutes.<br>Also see the [rate limiting information](../articles/azure-monitor/alerts/alerts-rate-limiting.md). | Same as default |
| Webhook | 10 webhook actions in an action group. Maximum number of webhook calls is 1,500 per minute per subscription. Other limits are available at [action-specific information](../articles/azure-monitor/alerts/action-groups.md#action-specific-information). | Same as default |
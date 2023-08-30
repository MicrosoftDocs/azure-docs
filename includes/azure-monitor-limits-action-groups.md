---
title: "include file" 
description: "include file" 
services: azure-monitor
author: rboucher
tags: azure-service-management
ms.topic: "include"
ms.date: 04/25/2023
ms.author: jagummersall
ms.custom: "include file"
---
You can have an unlimited number of action groups in a subscription.

|Resource |Default limit |Maximum limit |
|--- |--- |--- |
|Azure app push |10 Azure app actions per action group. |Same as Default |
|Email |1,000 email actions in an action group.<br>No more than 100 emails every hour for each email address.<br>Also see the [rate limiting information](../articles/azure-monitor/alerts/alerts-rate-limiting.md). |Same as Default |
|Email Azure Resource Manager role |10 Email ARM role actions per action group.<br>In production: No more than 100 emails in an hour.<br>In a test action group: No more than two emails in every one (1) minute. |Same as Default |
|Event Hubs |10 Event Hubs actions per action group. |Same as Default |
|ITSM |10 ITSM actions in an action group. |Same as Default |
|Logic app |10 logic app actions in an action group. |Same as Default |
|Runbook |10 runbook actions in an action group. |Same as Default |
|Secure Webhook |10 secure webhook actions in an action group.  Maximum number of webhook calls is 1500 per minute per subscription. |Same as Default |
|SMS |10 SMS actions in an action group.<br>In production: No more than one SMS message every five minutes.<br>In a test action group: No more than one SMS every one minute.|Same as Default |
|Voice |10 voice actions in an action group.<br>In production: No more than one voice call every five minutes.<br>In a test action group: No more than one voice call every one minute.|Same as Default |
|Webhook |10 webhook actions in an action group.  Maximum number of webhook calls is 1500 per minute per subscription. |Same as Default |

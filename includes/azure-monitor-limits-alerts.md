---
title: "include file" 
description: "include file" 
services: azure-monitor
author: rboucher
tags: azure-service-management
ms.topic: "include"
ms.date: 05/03/2021
ms.author: robb
ms.custom: "include file"
---

| Resource | Default limit | Maximum limit |
| --- | --- | --- |
| Metric alerts (classic) |100 active alert rules per subscription. | Call support |
| Metric alerts |5,000 active alert rules per subscription in Azure public, Azure China 21Vianet and Azure Government clouds. If you are hitting this limit, explore if you can use [same type multi-resource alerts](../articles/azure-monitor/alerts/alerts-metric-overview.md#monitoring-at-scale-using-metric-alerts-in-azure-monitor).<br/>5,000 metric time-series per alert rule. | Call support. |
| Activity log alerts | 100 active alert rules per subscription (cannot be increased). | Same as default |
| Log alerts | 1000 active alert rules per subscription. 1000 active alert rules per resource. | Call support |
| Alert rules and Action rules description length| Log search alerts 4096 characters<br/>All other 2048 characters | Same as default |

### Alerts API
Azure Monitor Alerts have several throttling limits to protect against users making an excessive number of calls. Such behavior can potentially overload the system backend resources and jeopardize service responsiveness. The following limits are designed to protect customers from interruptions and ensure consistent service level. The user throttling and limits are designed to impact only extreme usage scenario and should not be relevant for typical usage.

| Resource | Default limit | Maximum limit |
| --- | --- | --- |
| GET alertsSummary | 50 calls per minute per subscription | Same as default | 
|	GET alerts (without specifying an alert ID) | 100 calls per minute per subscription | Same as default | 
|	All other calls | 1000 calls per minute per subscription | Same as default | 


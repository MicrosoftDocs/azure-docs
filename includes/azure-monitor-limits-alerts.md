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
| Log alerts | 5000 active alert rules per subscription. Out of which 100 active alert rules with 1-minute frequency. <br/>1000 active alert rules per resource. <br/>6000 time series per alert rule. | Call support |
| Alert processing rules | 1000 active rules per subscription. | Call support |
| Alert rules and alert processing rules description length| Log search alerts 4096 characters<br/>All other 2048 characters | Same as default |

### Alerts API
Azure Monitor Alerts have several throttling limits to protect against users making an excessive number of calls. Such behavior can potentially overload the system backend resources and jeopardize service responsiveness. The following limits are designed to protect customers from interruptions and ensure consistent service level. The user throttling and limits are designed to impact only extreme usage scenario and should not be relevant for typical usage.

| Resource | Default limit | Maximum limit |
| --- | --- | --- |
| [Alerts - Get Summary](/rest/api/monitor/alertsmanagement/alerts/get-summary) | 50 calls per minute per subscription | Same as default | 
|	[Alerts - Get All](/rest/api/monitor/alertsmanagement/alerts/get-all) (not "Get By Id") | 100 calls per minute per subscription | Same as default | 
|	[All other alerts calls](/rest/api/monitor/alertsmanagement/alerts) | 1000 calls per minute per subscription | Same as default | 


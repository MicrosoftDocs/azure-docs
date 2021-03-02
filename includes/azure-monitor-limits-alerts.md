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
| Metric alerts (classic) |100 active alert rules per subscription. | Call support |
| Metric alerts |5,000 active alert rules per subscription in Azure public, Azure China 21Vianet and Azure Government clouds. If you are hitting this limit, explore if you can use [same type multi-resource alerts](../articles/azure-monitor/alerts/alerts-metric-overview.md#monitoring-at-scale-using-metric-alerts-in-azure-monitor).<br/>5,000 metric time-series per alert rule. | Call support. |
| Activity log alerts | 100 active alert rules per subscription (cannot be increased). | Same as default |
| Log alerts | 512 active alert rules per subscription. 200 active alert rules per resource. | Call support |
| Alert rules and Action rules description length| Log search alerts 4096 characters<br/>All other 2048 characters | Same as default |
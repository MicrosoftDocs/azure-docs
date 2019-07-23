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

- Azure Monitor uses the same [Kusto query language](/azure/kusto/query/) as Azure Data Explorer. See [Azure Monitor log query language differences](../articles/azure-monitor/log-query/data-explorer-difference.md) for KQL language elements not supported in Azure Monitor.
- Log queries can experience excessive overhead when data spans multiple Log Analytics workspace. See [Query limits](../articles/azure-monitoring/log-query/scope.md#query-limits) for details.
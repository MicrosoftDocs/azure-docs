---
title: "include file" 
description: "include file" 
services: azure-monitor
author: rboucher
tags: azure-service-management
ms.topic: "include"
ms.date: 07/22/2019
ms.author: bwren
ms.custom: "include file"
---

| Limit | Description |
|:---|:---|
| Query language | Azure Monitor uses the same [Kusto query language](/azure/kusto/query/) as Azure Data Explorer. See [Azure Monitor log query language differences](../articles/azure-monitor/log-query/data-explorer-difference.md) for KQL language elements not supported in Azure Monitor. |
| Azure regions | Log queries can experience excessive overhead when data spans Log Analytics workspaces in multiple Azure regions. See [Query limits](../articles/azure-monitor/log-query/scope.md#query-limits) for details. |

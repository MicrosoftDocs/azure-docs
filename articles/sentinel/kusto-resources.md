---
title: Useful resources for working with Kusto Query Language in Microsoft Sentinel
description: This document provides you with a list of useful resources for working with Kusto Query Language in Microsoft Sentinel.
author: yelevin
ms.topic: conceptual
ms.date: 01/10/2022
ms.author: yelevin
ms.custom: ignite-fall-2021
---

# Useful resources for working with Kusto Query Language in Microsoft Sentinel

Microsoft Sentinel uses Azure Monitor's Log Analytics environment and the Kusto Query Language (KQL) to build the queries that undergird much of Sentinel's functionality, from analytics rules to workbooks to hunting. This article lists resources that can help you skill up in working with Kusto Query Language, which will give you more tools to work with Microsoft Sentinel, whether as a security engineer or analyst.

## Microsoft technical resources

### Microsoft Sentinel documentation
- [Kusto Query Language in Microsoft Sentinel](kusto-overview.md)

### Azure Monitor documentation
- [Tutorial: Use Kusto queries](/azure/data-explorer/kusto/query/tutorial?pivots=azuremonitor)
- [Get started with KQL queries](../azure-monitor/logs/get-started-queries.md)
- [Query best practices](/azure/data-explorer/kusto/query/best-practices)

### Reference guides
- [KQL quick reference guide](/azure/data-explorer/kql-quick-reference)
- [SQL to Kusto cheat sheet](/azure/data-explorer/kusto/query/sqlcheatsheet)
- [Splunk to Kusto Query Language map](/azure/data-explorer/kusto/query/splunk-cheat-sheet)

### Microsoft Sentinel Learn modules
- [Write your first query with Kusto Query Language](/training/modules/write-first-query-kusto-query-language/)
- [Learning path SC-200: Create queries for Microsoft Sentinel using Kusto Query Language (KQL)](/training/paths/sc-200-utilize-kql-for-azure-sentinel/)

## Other resources

### Microsoft TechCommunity blogs
- [Advanced KQL Framework Workbook - Empowering you to become KQL-savvy](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/advanced-kql-framework-workbook-empowering-you-to-become-kql/ba-p/3033766) (includes webinar)
- [Using KQL functions to speed up analysis in Azure Sentinel](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/using-kql-functions-to-speed-up-analysis-in-azure-sentinel/ba-p/712381) (advanced level)
- Ofer Shezaf's blog series on correlation rules using KQL operators:
  - [Azure Sentinel correlation rules: Active Lists out, make_list() in: the AAD/AWS correlation example](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/azure-sentinel-correlation-rules-active-lists-out-make-list-in/ba-p/1029225)
  - [Azure Sentinel correlation rules: the join KQL operator](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/azure-sentinel-correlation-rules-the-join-kql-operator/ba-p/1041500)
  - [Implementing Lookups in Azure Sentinel](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/implementing-lookups-in-azure-sentinel/ba-p/1091306)
  - [Approximate, partial and combined lookups in Azure Sentinel](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/approximate-partial-and-combined-lookups-in-azure-sentinel/ba-p/1393795)

### Training and skilling resources
- [Rod Trent's Must Learn KQL series](https://github.com/rod-trent/MustLearnKQL)
- [Pluralsight training: Kusto Query Language from Scratch](https://www.pluralsight.com/courses/kusto-query-language-kql-from-scratch)
- [Log Analytics demo environment](https://aka.ms/LADemo)

## Next steps

> [!div class="nextstepaction"]
> [Get certified!](/training/paths/security-ops-sentinel/)

> [!div class="nextstepaction"]
> [Read customer use case stories](https://customers.microsoft.com/en-us/search?sq=%22Azure%20Sentinel%20%22&ff=&p=0&so=story_publish_date%20desc)

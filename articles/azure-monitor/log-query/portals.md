---
title: Viewing and analyzing log data in Azure Monitor | Microsoft Docs
description: This article describes using Log Analytics in the Azure portal to create and edit log queries in Azure Monitor.
services: log-analytics
documentationcenter: ''
author: bwren
manager: carmonm
editor: ''
ms.service: log-analytics
ms.workload: na
ms.tgt_pltfrm: na
ms.topic: conceptual
ms.date: 04/05/2019
ms.author: bwren
---

# Viewing and analyzing log data in Azure Monitor
Log Analytics is the primary experience for working with log data and creating queries in Azure Monitor. Open Log Analytics from **Logs** in the **Azure Monitor** menu. You can get an introduction to this portal and inspect its features at [Get started with Log Analytics in the Azure portal](get-started-portal.md).

Log Analytics provides the following features for working with log queries.

* Multiple tabs – create separate tabs to work with multiple queries.
* Rich visualizations – variety of charting options.
* Improved Intellisense and language auto-completion.
* Syntax highlighting – improves readability of queries. 
* Query explorer – access saved queries and functions.
* Schema view – review the structure of your data to assist in writing queries.
* Share – create links to queries, or pin queries to any shared Azure dashboard.
* Smart Analytics - identifies spikes in your charts and a quick analysis of the cause.
* Column selection – sort and group columns in the query results.

> [!NOTE]
> Log Analytics has the same functionality as the Advanced Analytics portal which is an external tool outside of the Azure portal. The Advanced Analytics portal is still available, but links and other references to it in the Azure portal are being replaced with this new page.

![Log Analytics](media/portals/log-analytics.png)

## Resource logs
Log Analytics integrates with various Azure resources such as Virtual Machines. This means that you can open Log Analytics directly through the resource's monitoring menu without switching to Azure Monitor and losing the resource context. **Logs** has not yet been enabled for all Azure resources, but it will start appearing in the portal menu for different resources types.

When opening Log Analytics from a specific resource, it's automatically scoped to log records of that resource only.   If you want to write a query that includes other records, then you would need to open it from the Azure Monitor menu.

The following options are not yet available through the resource view of Log Analytics:

- Save
- Set alert
- Query explorer
- Switching to different workspace/resource (currently not planned)


## Firewall requirements
Your browser requires access to the following addresses to access Log Analytics.  If your browser is accessing the Azure portal through a firewall, you must enable access to these addresses.

| Uri | IP | Ports |
|:---|:---|:---|
| portal.loganalytics.io | Dynamic | 80,443 |
| api.loganalytics.io    | Dynamic | 80,443 |
| docs.loganalytics.io   | Dynamic | 80,443 |


## Next steps

- Walk through a [tutorial using Log Analytics](../../azure-monitor/log-query/get-started-portal.md).
- Walk through a [tutorial using Log Search](../../azure-monitor/learn/tutorial-viewdata.md).


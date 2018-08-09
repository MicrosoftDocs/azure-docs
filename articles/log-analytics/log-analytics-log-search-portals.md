---
title: Portals for creating and editing log queries in Azure Log Analytics | Microsoft Docs
description: This article describes the portals that you can use in Azure Log Analytics to create and edit log searches.  
services: log-analytics
documentationcenter: ''
author: bwren
manager: carmonm
editor: ''

ms.service: log-analytics
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 08/09/2018
ms.author: magoedte; bwren
ms.component: na
---

# Creating and editing log queries in Azure Log Analytics

You use log searches in a variety of places throughout Log Analytics to retrieve data from the workspace.  For actually creating and editing queries in addition to working interactively with returned data though, you have two options that are described below.  

## Logs (preview)
Logs (preview) is new experience for working with log searches. It provides the same functionality as the Advanced Analytics portal within the Azure portal and has the following improvements over the current Logs experience.

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
> This new experience has been recently added to Azure, and is therefore currently considered in preview. The external Advanced Analytics portal is still available for those who want to continue to use it.

![Advanced Analytics portal](media/log-analytics-log-search-portals/advanced-analytics-portal.png)


### Firewall requirements
Your browser requires access to the following addresses to access Logs (preview) and the Advanced Analytics portal.  If your browser is accessing the Azure portal through a firewall, you must enable access to these addresses.

| Uri | IP | Ports |
|:---|:---|:---|
| portal.loganalytics.io | Dynamic | 80,443 |
| api.loganalytics.io    | Dynamic | 80,443 |
| docs.loganalytics.io   | Dynamic | 80,443 |


## Logs (formerly Log search)
The Log Search page is suitable for creating basic queries, as it offers some Intellisense support. It is useful to perform a variety of functions with log searches including creating alert rules, creating computer groups, and exporting the results of the query.  

Log Search provides multiple features for editing the query without having a full knowledge of the query language.  You can get a summary of these features in [Create log searches in Azure Log Analytics using Log Search](log-analytics-log-search-log-search-portal.md).


![Log Search page](media/log-analytics-log-search-portals/log-search-portal.png)


## Next steps

- Walk through a tutorial on using [Log Search](log-analytics-tutorial-viewdata.md) to learn how to create queries using the query language
- Check out the [Advanced Analytics portal](https://go.microsoft.com/fwlink/?linkid=856587) to create sophisticated queries and use as a development environment for your log searches.


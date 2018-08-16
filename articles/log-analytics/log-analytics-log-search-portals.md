---
title: Viewing and analyzing data in Log Analytics | Microsoft Docs
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
ms.date: 08/15/2018
ms.author: magoedte; bwren
ms.component: na
---

# Viewing and analyzing data in Log Analytics
There are two options available in the Azure portal for analyzing data stored in Log analytics and for creating queries for ad hoc analysis. The queries that you create using these portals can be used for other features such as alerts and dashboards.

## Log Analytics page (preview)
The Log Analytics page is new experience for working with log data and creating queries. You can get an introduction to this portal and inspect its features at [Get started with the Log Analytics page in the Azure portal](query-language/get-started-analytics-portal.md).

The Log Analytics page provides the following improvements over the [Log search](#log-search) experience.

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
> The Log Analytics page has the same functionality as the Advanced Analytics portal which is an external tool outside of the Azure portal. The Advanced Analytics portal is still available, but links and other references to it in the Azure portal are being replaced with Log explorer.

![Advanced Analytics portal](media/log-analytics-log-search-portals/advanced-analytics-portal.png)


### Firewall requirements
Your browser requires access to the following addresses to access Log explorer and the Advanced Analytics portal.  If your browser is accessing the Azure portal through a firewall, you must enable access to these addresses.

| Uri | IP | Ports |
|:---|:---|:---|
| portal.loganalytics.io | Dynamic | 80,443 |
| api.loganalytics.io    | Dynamic | 80,443 |
| docs.loganalytics.io   | Dynamic | 80,443 |


## Log search
The Log search page is suitable for analyzing log data using basic queries. It provides multiple features for editing queries without having a full knowledge of the query language.  You can get a summary of these features in [Create log searches in Azure Log Analytics using Log Search](log-analytics-log-search-log-search-portal.md). 


![Log Search page](media/log-analytics-log-search-portals/log-search-portal.png)


## Next steps

- Walk through a tutorial on using [Log Search](log-analytics-tutorial-viewdata.md) to learn how to create queries using the query language
- Check out the [Advanced Analytics portal](https://go.microsoft.com/fwlink/?linkid=856587) to create sophisticated queries and use as a development environment for your log searches.


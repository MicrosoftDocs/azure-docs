---
title: What's changed in Log Analytics? | Microsoft Docs
description: This article provides frequently asked questions regarding the upgrade of Log Analytics to the new query language.
services: log-analytics
documentationcenter: ''
author: bwren
manager: carmonm
editor: ''

ms.service: log-analytics
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/07/2017
ms.author: bwren

---

# What's changed in Log Analytics?
In addition to the query language itself, there are several improvements and changes that you should be aware of when your Log Analytics workspace is [upgraded to the new query language](log-analytics-log-search-new.md).  This article briefly describes all the changes between a legacy and upgraded workspace with links to detailed content for each. 

See [Log Analytics new log search FAQ and known issues](log-analytics-log-search-faq.md) for a description of any known issues with the upgrade and answers to common question.

## Query language
The primary change in the Log Analytics upgrade is the new query language which has significant improvements over the previous language.  

You can get a direct comparison of common operations between the legacy language and the new language at [Transitioning to Azure Log Analytics new query language](log-analytics-log-search-transition.md).


## Computer groups
The method for creating a computer group hasn't changed, although you can also create a computer group in the Advanced Analytics portal.  Computer groups based on log searches must use the syntax of the new language.

There is a new syntax for using computer groups in a log search.  Instead of using the $ComputerGroups function, computer groups are now each implemented as a function with a unique alias.  You use the alias in the log search like any other function.  

Details are available at [Computer groups in Log Analytics log searches](log-analytics-computer-groups.md).


## Log search portals
You can now use the Advanced Analytics portal in addition to the Log Search portal to create and run log searches.  

A brief description of the two portals is available at [Portals for creating and editing log queries in Azure Log Analytics](log-analytics-log-search-portals.md).  You can walk through a tutorial on the new portal at [Getting Started with the Analytics Portal](https://docs.loganalytics.io/docs/Learn/Getting-Started/Getting-started-with-the-Analytics-portal).

## Alerts
Alerts work the same in upgraded workspaces, but the query that they run must be written in the new language.  Any existing alert rules that you had prior to the upgraded will be automatically converted to the new language.  You can get more details in [Understanding alerts in Log Analytics](log-analytics-alerts.md).

The format of the payload for runbooks and webhooks sent from alerts has changed.  Get details for the new payload format in [Add actions to alert rules in Log Analytics](log-analytics-alerts-actions.md).

## Dashboards
[Dashboards](log-analytics/log-analytics-dashboards.md) are in the process of being deprecated.  You can continue to use any tiles that you added to the dashboard before your workspace was upgraded, but you cannot edit those tiles or add new ones.  Use View Designer to create custom views which has a richer feature set than dashboards.

Details on View Designer are available at [Use View Designer to create custom views in Log Analytics](log-analytics-view-designer.md).

## Power BI
The process for exporting Log Analytics data to Power BI has changed for upgraded workspaces, and any existing schedules that you created before upgrading will become disabled.  

Details are available at [Export Log Analytics data to Power BI](log-analytics-powerbi.md).

## PowerShell
The Get-AzureRmOperationalInsightsSearchResults for running log searches from PowerShell will not work with an upgraded workspace.  Use Invoke-LogAnalyticsQuery for this functionality with an upgraded workspace.

Details are available at [Azure Log Analytics REST API - PowerShell Cmdlets](https://dev.loganalytics.io/documentation/Tools/PowerShell-Cmdlets).

## Log search API
The log search REST API has changed, and any solutions that use the legacy version need to be updated to use the new version of the API.   

Details on the new version of the API are available at [Azure Log Analytics REST API](https://dev.loganalytics.io/).

## Next Steps

- See [Log Analytics new log search FAQ and known issues](log-analytics-log-search-faq.md) for a description of any known issues with the upgrade and answers to common question.
- 
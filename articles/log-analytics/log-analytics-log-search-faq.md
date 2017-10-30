---
title: Log Analytics new log search frequently asked questions | Microsoft Docs
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
ms.date: 10/17/2017
ms.author: bwren

---

# Log Analytics new log search FAQ and known issues

This article includes frequently asked questions and known issues regarding the upgrade of [Log Analytics to the new query language](log-analytics-log-search-upgrade.md).  You should read through this entire article before making the decision to upgrade your workspace.


## Alerts

### Question: I have a lot of alert rules. Do I need to create them again in the new language after I upgrade?  
No, your alert rules are automatically converted to the new search language during upgrade.  

### Question: I have alert rules with webhook and runbook actions. Will these continue to work when I upgrade?

No, there are some changes in the webhook and runbook actions that might require you to make changes on how you process the payload. We’ve made these changes to standardize the various output formats and reduce the size of the payload. Details on these formats are in [Add actions to alert rules in Log Analytics](log-analytics-alerts-actions.md).


## Computer groups

### Question: I'm getting errors when trying to use computer groups.  Has their syntax changed?
Yes, the syntax for using computer groups changes when your workspace is upgraded.  See [Computer groups in Log Analytics log searches](log-analytics-computer-groups.md) for details.

### Known issue: Groups imported from Active Directory
You cannot currently create a query that uses a computer group imported from Active Directory.  As a workaround until this issue is corrected, create a new computer group using the imported Active Directory group and then use that new group in your query.

An example query to create a new computer group that includes an imported Active Directory group is as follows:

	ComputerGroup | where GroupSource == "ActiveDirectory" and Group == "AD Group Name" and TimeGenerated >= ago(24h) | distinct Computer


## Dashboards

### Question: Can I still use dashboards in an upgraded workspace?
With the upgrade, we are beginning the process of depracating **My Dashboard**.  You can continue to use any tiles that you added to the dashboard before your workspace was upgraded, but you cannot edit those tiles or add new ones.  You can continue to create and edit views with [View Designer](log-analytics-view-designer.md), which has a richer feature set, and also create dashboards in the Azure portal.


## Log searches

### Question: I have saved searches outside of my upgraded workspace. Can I convert them to the new search language automatically?
You can use the language converter tool in the log search page to convert each one.  There is no method to automatically convert multiple searches without upgrading the workspace.

### Question: Why are my query results not sorted?
Results are not sorted by default in the new query language.  Use the [sort operator](https://go.microsoft.com/fwlink/?linkid=856079) to sort your results by one or more properties.

### Question: Where did the metrics view go after I upgraded?
The metrics view gave a graphical representation of performance data from a log search.  This view is no longer available after upgrade.  You can use the [render operator](https://docs.loganalytics.io/docs/Language-Reference/Tabular-operators/render-operator) to format output from a query in a timechart.

### Question: Where did minify go after I upgraded?
Minify is a feature that gives a summarized view of your search results.  After you upgrade, the Minify option no longer appears in the Log Search portal.  You can get similar functionality with the new search language using [reduce](https://docs.loganalytics.io/docs/Language-Reference/Tabular-operators/reduce-operator) or [autocluster_v2](https://docs.loganalytics.io/docs/Language-Reference/Tabular-operators/evaluate-operator/autocluster). 

	Event
	| where TimeGenerated > ago(10h)
	| reduce by RenderedDescription

	Event
	| where TimeGenerated > ago(10h)
	| evaluate autocluster_v2()


### Known issue: Search results in a list may include properties with no data
Log search results in a list may display properties with no data.  Prior to upgrade, these properties wouldn't be included.  This issue will be corrected so that empty properties are not displayed.

### Known issue: Selecting a value in a chart doesn't display detailed results
Prior to upgrade, when you selected a value in a chart, it would return a detailed list of records matching the selected value.  After upgrade, only the single summarized line is returned.  This issue is currently being investigated.

## Log Search API

### Question: Does the Log Search API get updated after I upgrade?
The legacy [Log Search API](log-analytics-log-search-api.md) will no longer work when you upgraded your workspace.  See [Azure Log Analytics REST API](https://dev.loganalytics.io/) for details on the new API.


## Portals

### Question: Should I use the new Advanced Analytics portal or keep using the Log Search portal?
You can see a comparison of the two portals at [Portals for creating and editing log queries in Azure Log Analytics](log-analytics-log-search-portals.md).  Each has distinct advantages so you can choose the best one for your requirements.  It's common to write queries in the Advanced Analytics portal and paste them into other places such as View Designer.  You should read about [issues to consider](log-analytics-log-search-portals.md#advanced-analytics-portal) when doing that.


### Question:  After upgrade, I get an error trying to run queries and am also seeing errors in my views.

Your browser requires access to the following addresses to run Log Analytics queries after upgrade.  If your browser is accessing the Azure portal through a firewall, you must enable access to these addresses.

| Uri | IP | Ports |
|:---|:---|:---|
| portal.loganalytics.io | Dynamic | 80,443 |
| api.loganalytics.io    | Dynamic | 80,443 |
| docs.loganalytics.io   | Dynamic | 80,443 |



## Power BI

### Question: Does anything change with PowerBI integration?
Yes.  Once your workspace has been upgraded then the process for exporting Log Analytics data to Power BI will no longer work.  Any existing schedules that you created before upgrading will become disabled.  After upgrade, Azure Log Analytics uses the same platform as Application Insights, and you use the same process to export Log Analytics queries to Power BI as [the process to export Application Insights queries to Power BI](../application-insights/app-insights-export-power-bi.md#export-analytics-queries).

### Known issue: Power BI request size limit
There is currently a size limit of 8 MB for a Log Analytics query that can be exported to Power BI.  This limit will be increased soon.


## PowerShell cmdlets

### Question: Does the Log Search PowerShell cmdlet get updated after I upgrade?
The [Get-AzureRmOperationalInsightsSearchResults](https://docs.microsoft.com/powershell/module/azurerm.operationalinsights/Get-AzureRmOperationalInsightsSearchResults) will be deprecated when the upgrade of all workspaces is complete.  Use the [Invoke-LogAnalyticsQuery cmdlet](https://dev.loganalytics.io/documentation/Tools/PowerShell-Cmdlets) to perform log searches in upgraded workspaces.




## Resource Manager templates

### Question: Can I create an upgraded workspace with a Resource Manager template?
Yes.  You must use an API version of 2017-03-15-preview and include a **features** section in your template as in the following example.

    "resources": [
        {
            "type": "Microsoft.OperationalInsights/workspaces",
            "apiVersion": "2017-03-15-preview",
            "name": "[parameters('workspaceName')]",
            "location": "[parameters('workspaceRegion')]",
            "properties": {
                "sku": {
                    "name": "Free"
                },
                "features": {
                    "legacy": 0,
                    "searchVersion": 1
                }
            }
        }
    ],



## Solutions

### Question: Will my solutions continue to work?
All solutions will continue to work in an upgraded workspace, although their performance will improve if they are converted to the new query language.  There are known issues with some existing solutions that are described in this section.

### Known issue: Capacity and Performance solution
Some of the parts in the [Capacity and Performance](log-analytics-capacity.md) view may be empty.  A fix to this issue will be available shortly.

### Known issue: Application Insights connector
Perspectives in [Application Insights Connector solution](log-analytics-app-insights-connector.md) are currently not supported in an upgraded workspace.  A fix to this issue is currently under analysis.

### Known issue: Backup solution
The Backup Solution will not collect data in an upgraded workspace. A new Backup solution that works with the upgraded workspace will be announced shortly.

## Upgrade process

### Question: I have several workspaces. Can I upgrade all workspaces at the same time?  
No.  Upgrade applies to a single workspace each time. Currently there is no way of upgrading many workspaces at once. Please note that other users of the upgraded workspace will be affected as well.  

### Question: Will existing log data collected in my workspace be modified if I upgrade?  
No. The log data available to your workspace searches is not affected by the upgrade. Saved searches, alerts and views will be converted to the new search language automatically.  

### Question: What happens if I don't upgrade my workspace?  
The legacy log search will be deprecated in the coming months. Workspaces that are not upgraded by that time will be upgraded automatically.

### Question: Can I revert back after I upgrade?
Prior to general availability, you could revert your workspace after upgrading.  Now that the new language has reached general availability, this capability has been removed as we start to retire the legacy platform.



## Views

### Question: How do I create a new view with View Designer?
Prior to upgrade, you could create a new view with View Designer from a tile on the main dashboard.  When your workspace is upgraded, this tile is removed.  You can create a new view with View Designer in the OMS portal by clicking on the green + button in the left menu.

### Known issue: See all option for line charts in views doesn't result in a line chart
When you click on the *See all* option at the bottom of a line chart part in a view, you are presented with a table.  Prior to upgrade, you would be presented with a line chart.  This issue is being analyzed for a potential modification.


## Next steps

- Learn more about [upgrading your workspace to the new Log Analytics query language](log-analytics-log-search-upgrade.md).

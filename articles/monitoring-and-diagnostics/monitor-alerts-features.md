---
title: Log alerts in Azure Monitor - Alerts | Microsoft Docs
description: Trigger emails, notifications, call websites URLs (webhooks), or automation when the analytic query conditions you specify are met for Azure Alerts .
author: msvijayn
manager: kmadnani1
editor: ''
services: monitoring-and-diagnostics
documentationcenter: monitoring-and-diagnostics

ms.assetid: f7457655-ced6-4102-a9dd-7ddf2265c0e2
ms.service: monitoring-and-diagnostics
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/01/2018
ms.author: vinagara

---
# Azure Alerts user interface (Public Preview))

## Overview 
 
> [!NOTE] 
> This article describes the new alert experience. Classic alerts in Azure Monitor are described in [classic alerts Overview](monitoring-overview-alerts.md). 
 
On June 1st 2018, a new alerts experience was released for Azure Monitor. This experience builds on the benefits of the [unified alerts experience](monitoring-overview-unified-alerts.md) released March 2018 and provides better alert state management, alert enumeration, aggregation, and the ability for administrators to change the state of alerts when they have been processed. 
 
## Enabling the new alert experience
You must opt-in to the new experience.  When you go to the alerts page in Azure Monitor, you should see a banner to click. You can go back and forth between the new and old experience by clicking on the banner.  

## Alert Enumeration and State Management 

The new experience allows you to 

- Aggregate all alerts into single view organized by alert severity. You can select up to 5 subscriptions.  
- Select multiple subscriptions and view the alerts across all of them 
- Change the state and comment on individual or groups of alerts. You can change the state to *acknowledged* or *closed* to let others know an alert has been processed by an admin. Text comments up to (how big?) can be stored along with the state change. The state changes and comments are viewable in the alert history.   
- View smart groups of alerts. Smart groups are collections of alerts automatically groups by similarity using machine learning algorithms.  

The alert landing page allows admins to see a consolidated view of alerts across multiple subscriptions. Select the subscriptions you want to view and the time period window. The time period filters alerts based on their creation time. The Resource group drop down allows you to further filter alerts based on a single resource group.


## Alert States 

You can see the distribution of alerts fired across alert severities. The three state columns (New, Acknowledged, Closed) tell you the state of the alerts. These three states are user configurable. All alerts are marked *New* when first fired. You can choose to view and change an alert state to *Acknowledged* and adding a comment if desired, which will tell other admins what action has been taken on an alert. Similarly, you can choose mark the state as *Closed* to tell other administrators that the alert is no longer important.  


## Smart groups 

Smart groups are aggregations of alerts grouped by similarity, historical patterns, or both. The number of smart groups formed, along with a number showing percentage of noise reduction due to grouping, is shown on the alert landing page. Clicking on the number takes you to a dedicated smart group list view page.   

 

## Total alerts page 
 

Clicking on *Total Alerts* or any of the severity rows takes you to the list view for alerts. If you click on the Total Alerts in the alerts overview page, you see a list of all the alerts generated in the time period chosen in *Time Period* column in the upper right. If you click one of the severities in the alerts overview page, you will see a similar view but only with the alerts of that severity listed  

You can filter the alerts shown using the default column headers.  

**Subscription** - Select up to 5 subscriptions  
**Resource Group** - Single select.  
**Resource Type** - Selectable once a resource group has been specified.  
**Resource** - Selectable once a resource group has been specified. 
**Severity** - Filter on severity.  
**Monitor Condition** - Filter on *Fired* or *Resolved*.  
**Alert State** - Filter on *New*, *Acknowledged* or *Closed*.  
**Monitor Service** - Multi-select. Filter by Azure service. For example, Log Analytics or Application Insights.  
**Time Range** -  Filter based on alerts that fired in the last hour, 24 hours, 7 days, or 30 days. 

You can configure the columns displayed in the list view by selecting the Columns button in the upper left of the screen. You can then check the columns you want to display. Click *Done* to accept your changes.  Use the reset button to return to the default column selections listed previously.  

## Smart groups landing page  

To get to the smart groups landing page, click on either the banner or the number of smart groups on the alert landing page as shown in the following diagrams.

Smart groups allow you to view alerts group together based on similar properties, historical pattern, or both.  The groups are automatically created based on your particular set of alerts.  You can't create custom groupings.  Click the name of the group to view the individual alerts in that group.

## Alert Detail

### Essentials
Displays the properties and other significant information about the alert.

### History
Lists each action taken by the alert and any changes made to the alert.

### Smart Group
Information about the smart group the alert is included in. The **Alert Count** refers to the number of alerts included in the smart group. This includes the other alerts that are included in the same same smart group that were created in the past 30 days.  This is regardless of the time filter in the alerts list page. Click on an alert to view its detail.

### More Details


## Change alert state
You can change the state of an alert by clicking on **Change alert state** in the detail view for the alert. You can change the state of multiple alerts at one time by selecting them in a list view and clicking **Change State** at the top of the page. In both cases, select a new alert state from the dropdown and optionally provide a comment. If you're changing a single alert, then you also have an option to apply the same changes to all the alerts in the smart group.

## Next steps
* Understand [log alerts in Azure](monitor-alerts-unified-log-webhook.md).
* Learn about the new [Azure Alerts](monitoring-overview-unified-alerts.md).
* Learn more about [Application Insights](../application-insights/app-insights-analytics.md).
* Learn more about [Log Analytics](../log-analytics/log-analytics-overview.md).    

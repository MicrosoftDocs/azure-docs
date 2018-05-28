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
ms.date: 05/27/2018
ms.author: bwren

---
# New unified alerts experience in Azure (Public Preview))

## Overview 
 
> [!NOTE] 
> This article describes the new alert experience in Azure Monitor. Classic unified alerts are described in [Create, view, and manage alerts using Azure Monitor](monitor-alerts-unified-usage.md). 
 
A new alerts experience was released for Azure Monitor on June 1, 2018. This experience builds on the benefits of the [unified alerts experience](monitoring-overview-unified-alerts.md) released March 2018 and provides the ability to manage and aggregate individual alerts in addition to modifying alert state. This article describes the new features and how to navigate the new alert pages in the Azure portal.

## Features in the new alert experience

The new experience provides the following features that aren't available in the classic unified experience:

- View and manage individual alerts.
- Aggregate alerts across multiple subscriptions into single view organized by alert severity. 
- Change the state of alerts to reflect where it current is in the resolution process. 
- Organize alerts by smart groups which are automatically generated with machine learning algorithms.

## Enable the new alert experience
Enable the new alert experience by clicking on the banner at the top of the Alerts page. Once it's enabled, you can switch back and forth between the new and old experience by clicking on the banner. 

![Banner](media/monitoring-alerts-new-experience/opt-in-banner.png)

## Alert States
The new unified alert experience introduces the concept of alert state. The state of an alert specifies where it is in the resolution process.  When an alert is created, it has a status of *New*. You can change the status when you've acknowledged an alert and when you've closed it.  The following alert states are supported. 

| State | Description |
|:---|:---|
| New | The issue has just been detected and not yet reviewed. |
| Acknowledged | An administrator has reviewed the alert and started working on it. |
| Closed | The issue has been resolved. Note that once an alert has been closed, you can reopen it my changing it to another state. |

The state of an alert is different than the monitor condition. Metric alert rules can set an alert to a condition of _resolved_ when the error condition is no longer met. Alert state is set by the user independent of the monitor condition.

### Changing the state of an alert or smart group
You can change the state of an individual alert or managed multiple alerts together by setting the state of a [smart group](). 

You can change the state of an alert by clicking on **Change alert state** in the detail view for the alert or **Change smart group state** in the detail view for the smart group. You can change the state of multiple items at one time by selecting them in a list view and clicking **Change State** at the top of the page. In both cases, select a new state from the dropdown and optionally provide a comment. If you're changing a single item, then you also have an option to apply the same changes to all the alerts in the smart group.

![Change state](media/monitoring-alerts-new-experience/change-tate.png)

## Smart Groups
Smart groups reduce noise by allowing you to manage related alerts as a single unit rather than managing the individual alerts. You can view the details of smart groups and set the state similar to an alert. Each alert is a member of one and only one smart group. 

Smart Groups are automatically created using machine learning by combining alerts on the basis of similar properties, historical patterns, or both. The algorithm considers when an alert is created and looks for similarity based on such properties as alert name, description, and subscription. It assumes that these alerts represent a common core issue. You can't create custom smart groups.

## Alerts page
The default Alerts page provides a quick summary of alerts that are created within a particular time window. It displays the total alerts for each severity with columns identifying the total number of alerts in each state for each severity. Click any of the severities to open the [All Alerts](#all-alerts-page) page filtered by that severity.

![Alerts page](media/monitoring-alerts-new-experience/alerts-page.png)

You can filter this view by selecting values in the dropdowns at the top of the page.

| Column | Description |
|:---|:---|
| Subscription | Select up to 5 Azure subscriptions. Only alerts in the selected subscriptions are included in the view. |
| Resource Group | Select a single resource group. Only alerts with targets in the selected resource group are included in the view. |
| Time Range | Only alerts fired within the selected time window will be included in the view. Supported values are past hour, past 24 hours, past 7 days, and past 30 days. |

The Alerts page displays the following values. You can click on each to open another page.

| Value | Description |
|:---|:---|
| Total Alerts | Total number of alerts that match the selected criteria. Click this value to open the All Alerts view with no filter. |
| Smart Groups | Total number of smart groups created from the alerts that match the selected criteria. Click this value to open the Smart Groups list in the All Alerts view.
| Total Alert Rules | Total number of alert rules in the selected subscription and resource group. Click this value to open the Rules view filtered on the selected subscriptions and resource group.


## All Alerts page 
The All Alerts page allows you to view a list of alerts that were created within the selected time window. You can either view a list of the individual alerts or a list of the smart groups containing the alerts. Click the banner at the top of the page to toggle between views.

![All Alerts page](media/monitoring-alerts-new-experience/all-alerts-page.png)

You can filter the view by selecting the following values in the dropdowns at the top of the page.

| Column | Description |
|:---|:---|
| Subscription | Select up to 5 Azure subscriptions. Only alerts in the selected subscriptions are included in the view. |
| Resource Group | Select a single resource group. Only alerts with targets in the selected resource group are included in the view. |
| Resource Type | Select one or more resource types. Only alerts with targets of the selected type are included in the view. This column is only available once a resource group has been specified. |
| Resource | Select a resource. Only alerts with that resources as a target are included in the view. This column is only available once a resource type has been specified. |
| Severity | Select an alert severity or select *All* to include alerts of all severities. |
| Monitor Condition | Select a monitor condition or select *All* to include alerts of conditions. |
| Alert State | Select an alert state or select *All* to include alerts of states. |
| Monitor Service | Select a service or select *All* to include all services. Only alerts created by rules using that service as a target are included. |
| Time Range | Only alerts fired within the selected time window will be included in the view. Supported values are past hour, past 24 hours, past 7 days, and past 30 days. |

Click **Columns** at the top of the page to select which columns to display. You can remove any column except for 

## Alert detail page
The Alert Detail page is displayed when you click on an alert. It provides details of the alert and allows you to change its state.

![Alert Detail](media/monitoring-alerts-new-experience/alert-detail.png)

The Alert Detail page includes the following sections.

| Section | Description |
|:---|:---|
| Essentials | Displays the properties and other significant information about the alert. |
| History | Lists each action taken by the alert and any changes made to the alert. |
| Smart Group | Information about the smart group the alert is included in. The **Alert Count** refers to the number of alerts included in the smart group. This includes the other alerts that are included in the same same smart group that were created in the past 30 days.  This is regardless of the time filter in the alerts list page. Click on an alert to view its detail. |
| More Details | Displays granular data for the alert. This information is typically specific to the type of source that created the alert. |


## Smart Group detail page
The Smart Group Detail page is displayed when you click on a smart group. It provides details of the smart group, including the reasoning used to create the group, and allows you to change its state.
 
![Smart Group Detail](media/monitoring-alerts-new-experience/smart-group-detail.png)


The Smart Group Detail page includes the following sections.

| Section | Description |
|:---|:---|
| Alerts | Lists the individual alerts that are included in the smart group. Click on an alert to open its Alert Detail page. |
| History | Lists each action taken by the smart group and any changes made to it. |

## Next steps
* Understand [log alerts in Azure](monitor-alerts-unified-log-webhook.md).
* Learn about the new [Azure Alerts](monitoring-overview-unified-alerts.md).
* Learn more about [Application Insights](../application-insights/app-insights-analytics.md).
* Learn more about [Log Analytics](../log-analytics/log-analytics-overview.md).    

---
title: Overview of alerting and notification monitoring in Azure
description: Overview of alerting in Azure. What's available and roughly how to use it.  . that allow you to manage alerts and alerts rules across Azure services.
author: rboucher
services: monitoring
ms.service: azure-monitor
ms.topic: conceptual
ms.date: 09/24/2018
ms.author: robb
ms.component: alerts
---

# Overview of alerts in Microsoft Azure 

This article describes what alerts are, their benefits, and how to get started using them.  


## What are alerts in Microsoft Azure?
Alerts proactively notify you when important conditions are found in your monitoring data. They allow you to identify and address issues before the users of your system notice them. 

This article discusses the unified alert experience in Azure Monitor, which now includes Log Analytics and Application Insights. The [previous alert experience](monitoring-overview-alerts.md)and alert types are called **classic alerts**. You can view this older experience and older alert type by clicking on **View classic alerts** at the top of the alert page. 


## Overview

The diagram below represents the general terms and flow of alerts. 

![Alert Flow](media/monitoring-overview-alerts/Azure-Monitor-Alerts.svg)

Alert rules are separated from alerts and the action that are taken when an alert fires. 

- **Alert rule** - The condition that triggers the alert. The alert rule captures the target and criteria for alerting. The alert rule can be in an enabled or a disabled state. Alerts only fire when enabled.
    - **Target Resource** - A target can be any Azure resource. Target Resource defines the scope and signals available for alerting. Example targets: a virtual machine, a storage account, a virtual machine scale set, a Log Analytics workspace, or an Application Insights resource.
    - **Signal** - Signals are emitted by the target resource and can be of several types. Metric, Activity log, Application Insights, and Log.
    - **Criteria** - Criteria is combination of Signal and Logic applied on a Target resource. Examples: 
         - Percentage CPU > 70%
         - Server Response Time > 4 ms 
         - Result count of a log query > 100
- **Logic** - User-defined logic to check if the signal is within expected range/values.
- **Action** - A specific action taken when the alert is fired. For more information, see Action Groups.

## What you can alert on

You can alert on metrics and logs as described in [monitoring data sources](./monitoring-and-diagnotics/monitoring-data-sources.md). These include but are not limited to:
- Metric values
- Log search queries
- Health of your resources 
- Health of the underlying Azure platform
- Proactive diagnostics
- Tests for web site availability
- Custom metrics 

As new types become available, they are added to the alerts section of the Azure portal. See [Metrics support for Azure Monitor alerts](./monitoring-and-diagnostics/monitoring-near-real-time-metric-alerts.md) for the list of supported metric signals.  This list is smaller than the current list of all available metrics, but is growing over time. In cases when a metric is not avilable for use with the newer alerts, you can still use a [classic alert](#classic-alerts). 

## Alert states and monitor conditions
You can set the state of an alert to specify where it is in the resolution process. When an alert is created, it has a status of *New*. You can change the status when you acknowledge an alert and when you close it. All state changes are stored in the history of the alert.

The following alert states are supported.

| State | Description |
|:---|:---|
| New | The issue has just been detected and has not yet been reviewed. |
| Acknowledged | An administrator has reviewed the alert and started working on it. |
| Closed | The issue has been resolved. After an alert has been closed, you can reopen it by changing it to another state. |

The state of an alert is different than the monitor condition. Metric alert rules can set an alert to a condition of *resolved* when the error condition is no longer met. Alert state is set by the user and is independent of the monitor condition. Although the system can set the monitor condition to *resolved*, the alert state isn't changed until the user changes it.

## Smart groups
Smart groups are method of clustering related alerts together to reduce visual noise and complexity. You can then manage the related alerts as a single unit rather than as individual ones. You can view the details of smart groups and set the state similarly to how you can with alerts. Each alert is a member of one and only one smart group.

Smart groups are automatically created by using machine learning to combine related alerts that represent a single issue. When an alert is created, the algorithm adds it to a new smart group or an existing smart group based on information such as historical patterns, similar properties, and similar structure. 

Currently, the algorithm only considers alerts from the same monitor service within a subscription. Smart groups can reduce up to 99% of alert noise through this consolidation. You can view the reason that alerts were included in a group in the smart group detail page.

The name of a smart group is the name of its first alert. You can't create or rename a smart group.

## Alerts Landing page
The default Alerts page provides a summary of alerts that are created within a particular time window. It displays the total alerts for each severity with columns that identify the total number of alerts in each state for each severity. Select any of the severities to open the [All Alerts](#all-alerts-page) page filtered by that severity.

It does not show or track older [classic alerts](#classic-alerts). You can change the subscriptions or filter parameters to update the page. 

![Alerts page](media/monitoring-overview-alerts/alerts-page.png)

You can filter this view by selecting values in the dropdown menus at the top of the page.

| Column | Description |
|:---|:---|
| Subscription | Select up to five Azure subscriptions. Only alerts in the selected subscriptions are included in the view. |
| Resource group | Select a single resource group. Only alerts with targets in the selected resource group are included in the view. |
| Time range | Only alerts fired within the selected time window are included in the view. Supported values are the past hour, the past 24 hours, the past 7 days, and the past 30 days. |

Select the following values at the top of the Alerts page to open another page.

| Value | Description |
|:---|:---|
| Total alerts | The total number of alerts that match the selected criteria. Select this value to open the All Alerts view with no filter. |
| Smart groups | The total number of smart groups that were created from the alerts that match the selected criteria. Select this value to open the smart groups list in the All Alerts view.
| Total alert rules | The total number of alert rules in the selected subscription and resource group. Select this value to open the Rules view filtered on the selected subscription and resource group.


## Rules management
Click on **Manage alert rules** to show the **Rules** page. **Rules** is a single place for managing all alert rules across your Azure subscriptions. It lists all alert rules and can be sorted based on target resources, resource groups, rule name, or status. Alert rules can also be edited, enabled, or disabled from this page.  

 ![alerts-rules](./media/monitoring-overview-alerts/alerts-preview-rules.png)


## Create an alert rule
Alerts can be authored in a consistent manner regardless of the monitoring service or signal type. All fired alerts and related details are available in single page.
 
You create a new alert rule with the following three steps:
1. Pick the _target_ for the alert.
1. Select the _signal_ from the available signals for the target.
1. Specify the _logic_ to be applied to data from the signal.
 
This simplified authoring process no longer requires you to know the monitoring source or signals that are supported before selecting an Azure resource. The list of available signals is automatically filtered based on the target resource that you select, and it guides you through defining the logic of the alert rule.

You can learn more about how to create alert rules in [Create, view, and manage alerts using Azure Monitor](monitor-alerts-unified-usage.md).

Alerts are available across several Azure monitoring services. For information about how and when to use each of these services, see [Monitoring Azure applications and resources](./monitoring-overview.md). The following table provides a listing of the types of alert rules that are available across Azure. It also lists what's currently supported in which alert experience.

Previously, Azure Monitor, Application Insights, Log Analytics and Service Health had separate alerting capabilities. Overtime, Azure improved and combined both the user interface and different methods of alerting. This consolidation is still in process. As a result, there are still some alerting capabilities not yet in the new alerts system.  

| **Monitor source** | **Signal type**  | **Description** | 
|-------------|----------------|-------------|
| Service health | Activity log  | Not supported. See [Create activity log alerts on service notifications](monitoring-activity-log-alerts-on-service-notifications.md).  |
| Application Insights | Web availability tests | Not supported. See [Web test alerts](../application-insights/app-insights-monitor-web-app-availability.md). Available to any website that's instrumented to send data to Application Insights. Receive a notification when availability or responsiveness of a website is below expectations. |


## Change the state of an alert or smart group
You can change the state of an individual alert or manage multiple alerts together by setting the state of a smart group.

Change the state of an alert by selecting **Change alert state** in the detail view for the alert. Or change the state for a smart group by selecting **Change smart group state** in its detail view. Change the state of multiple items at one time by first selecting them in a list view and then selecting **Change State** at the top of the page. 

In both cases, select a new state from the dropdown menu, then provide an optional comment. If you're changing a single item, you also have an option to apply the same changes to all the alerts in the smart group.

![Change state](media/monitoring-overview-alerts/change-tate.png)

## All alerts page 
Click on Total Alerts to see the all alerts page. Here you can view a list of alerts that were created within the selected time window. You can view either a list of the individual alerts or a list of the smart groups that contain the alerts. Select the banner at the top of the page to toggle between views.

![All Alerts page](media/monitoring-overview-alerts/all-alerts-page.png)

You can filter the view by selecting the following values in the dropdown menus at the top of the page.

| Column | Description |
|:---|:---|
| Subscription | Select up to five Azure subscriptions. Only alerts in the selected subscriptions are included in the view. |
| Resource group | Select a single resource group. Only alerts with targets in the selected resource group are included in the view. |
| Resource type | Select one or more resource types. Only alerts with targets of the selected type are included in the view. This column is only available after a resource group has been specified. |
| Resource | Select a resource. Only alerts with that resource as a target are included in the view. This column is only available after a resource type has been specified. |
| Severity | Select an alert severity, or select *All* to include alerts of all severities. |
| Monitor condition | Select a monitor condition, or select *All* to include alerts of conditions. |
| Alert state | Select an alert state, or select *All* to include alerts of states. |
| Monitor service | Select a service, or select *All* to include all services. Only alerts created by rules that use service as a target are included. |
| Time range | Only alerts fired within the selected time window are included in the view. Supported values are the past hour, the past 24 hours, the past 7 days, and the past 30 days. |

Select **Columns** at the top of the page to select which columns to display. 

## Alert detail page
The Alert detail page is displayed when you select an alert. It provides details of the alert and enables you to change its state.

![Alert detail](media/monitoring-overview-alerts/alert-detail.png)

The Alert detail page includes the following sections.

| Section | Description |
|:---|:---|
| Essentials | Displays the properties and other significant information about the alert. |
| History | Lists each action taken by the alert and any changes made to the alert. This is currently limited to state changes. |
| Smart group | Information about the smart group the alert is included in. The *alert count* refers to the number of alerts that are included in the smart group. This includes the other alerts in the same smart group that were created in the past 30 days.  This is regardless of the time filter in the alerts list page. Select an alert to view its detail. |
| More details | Displays further contextual information for the alert, which is typically specific to the type of source that created the alert. |

## Smart group detail page
The Smart group detail page is displayed when you select a smart group. It provides details about the smart group, including the reasoning that was used to create the group, and enables you to change its state.
 
![Smart group detail](media/monitoring-overview-alerts/smart-group-detail.png)


The smart group detail page includes the following sections.

| Section | Description |
|:---|:---|
| Alerts | Lists the individual alerts that are included in the smart group. Select an alert to open its alert detail page. |
| History | Lists each action taken by the smart group and any changes that are made to it. This is currently limited to state changes and alert membership changes. |

## Classic alerts 

The Azure Monitor metrics and activity log alerting capability before June 2018 is called "Alerts (classic)". 

For more information see [Alerts classic](./monitoring-overview-alerts-classic.md)



## Next steps







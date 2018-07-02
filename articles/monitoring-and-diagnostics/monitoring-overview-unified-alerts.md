---
title: Unified alerts in Azure Monitor
description: Description of unified alerts in Azure that allow you to manage alerts and alerts rules across Azure services.
author: manishsm-msft
services: monitoring
ms.service: azure-monitor
ms.topic: conceptual
ms.date: 06/07/2018
ms.author: mamit
ms.component: alerts
---

# Unified alerts in Azure Monitor

## Overview

> [!NOTE]
>  A new unified alert experience that allows you to manage alerts from multiple subscriptions and introduces alert states and smart groups is currently available in public preview. See the [last section of this article](#enhanced-unified-alerts-experience-public-preview) for a description of this enhanced experience and the process to enabled it.


This article describes the unified alert experience in Azure Monitor. The [previous alert experience](monitoring-overview-alerts.md) is available from the **Alerts (Classic)** option in the Azure Monitor menu. 

## Features of the unified alert experience

The unified experience has the following benefits over the classic experience:

-	**Better notification system**: Unified alerts use [action groups]( https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-action-groups), which are named groups of notifications and actions that can be reused in multiple alerts. 
- **Unified authoring experience**  - You can manage alerts and alert rules for metrics, logs and activity log across Azure Monitor, Log Analytics, and Application Insights in one place. 
- **View fired Log Analytics alerts in Azure portal** - View alerts from Log Analytics with other alerts from other sources in the Azure portal. Previously these were in a separate portal.
- **Separation of Fired alerts and Alert Rules** - Alert rules are now distinguished from alerts. An alert rule is the definitions of a condition that triggers an alert. An alert is an instance of an alert rule firing.
- **Better workflow** - The unified alert authoring experience guides you through the process of configuring an alert rule.
 
Metric alerts have the following improvements over classic metric alerts:

-	**Improved latency**: Metric alerts can run as frequently as every one minute. Classic metric alerts always run at a frequency of 5 minutes. Log alerts still have a delay longer than one minute due to the time is takes to ingest the logs. 
-	**Support for multi-dimensional metrics**: You can alert on dimensional metrics allowing you to monitor a specific instance of the metric.
-	**More control over metric conditions**: You can define richer alert rules that support monitoring the maximum, minimum, average, and total values of metrics.
-	**Combined monitoring of multiple metrics**: You can monitor up to two metrics with a single rule. An alert is triggered if both metrics breach their respective thresholds for the specified time-period.
-	**Metrics from Logs** (limited public preview): Some log data going into Log Analytics can now be extracted and converted into Azure Monitor metrics and then alerted on just like other metrics. 


## Alert rules
The unified alerts experience uses the following concepts to separate alert rules from alerts while unifying the authoring experience across different alert types.

| Item | Definition |
|:---|:---|
| Alert rule | Definition of the condition to create an alert. Composed of a _target resource_, _signal_, _criteria_, and _logic_. An alert rule is only active if it's in an _enabled_ state.
| Target Resource | Defines the specific resources and signals available for alerting. A target can be any Azure resource.<br>Examples: virtual machine, storage account, virtual machine scale set, Log Analytics workspace, Application Insights resource |
| Signal | Source of data emitted by the Target resource. Supported signal types are *Metric*, *Activity log*, *Application Insights*, and *Log*. |
| Criteria | Combination of _signal_ and _logic_ applied on a target resource.<br>Examples: Percentage CPU > 70%, Server Response Time > 4 ms, Result count of a log query > 100 etc. |
| Logic | User-defined logic to check if the signal is within expected range/values. |
| Action | Action to perform when the alert is fired. Multiple actions may occur when an alert fires. These alerts support action groups.<br>Examples: emailing an email address, calling a webhook URL. |
| Monitor Condition | Indicates whether the condition that created a metric alert has subsequently been resolved. Metric alert rules sample a particular metric at regular intervals. If the criteria in the alert rule is met, then a new alert is created with a condition of Fired.  When the metric is sampled again, if the criteria is still met then nothing happens.  If the criteria is not met though, then the condition of the alert is changed to Resolved. The next time that the criteria is met, then a another alert is created with a condition of Fired. |


## Alert pages
Unified alerts provide a single place to view and manage all your Azure alerts. The following sections describe the functions of each individual page of the unified experience.

### Alerts overview page
**Alerts** overview page shows an aggregated summary of all fired alerts, and the total enabled alert rules. Changing the subscriptions or filter parameters updates the aggregates and the alerts fired list.

 ![alerts-overview](./media/monitoring-overview-unified-alerts/alerts-preview-overview2.png) 

### Alert rules management
**Rules** is a single page to manage all alert rules across your Azure subscriptions. It lists all alert rules and can be sorted based on target resources, resource groups, rule name, or status. Alert rules can also be edited nd enabled or disabled from this page.

 ![alerts-rules](./media/monitoring-overview-unified-alerts/alerts-preview-rules.png)


## Creating an alert rule
Alerts can be authored in a consistent manner regardless of the monitoring service or signal type. All fired alerts and related details are available in single page.
 
You create a new alert rule with the following three steps:
1. Pick the _target_ for the alert.
1. Select the _signal_ from the available signals for the target.
1. Specify the _logic_ to be applied to data from the signal.
 
This simplified authoring process no longer requires the user to know the monitoring source or signals supported before selecting an Azure resource. The list of available signals are automatically filtered based on target resource selected and guides you through defining the logic of the alert rule.

You can learn more on how to create alert rules in [Create, view, and manage alerts using Azure Monitor](monitor-alerts-unified-usage.md).

Alerts are available across several Azure monitoring services. For information on how and when to use each of these services, see [Monitoring Azure applications and resources](./monitoring-overview.md). The following table provides a listing of the types of alert rules available across Azure and what's currently supported by the unified alert experience.

| **Monitor Source** | **Signal Type**  | **Description** | 
|-------------|----------------|-------------|
| Azure monitor | Metric  | Also called [near-real-time metric alerts](monitoring-near-real-time-metric-alerts.md), they support evaluating metric conditions as frequently as 1 minute and allow for multi-metric and multi-dimensional metric rules. A list of supported resource types is available in [Newer metric alerts for Azure services in the Azure portal](monitoring-near-real-time-metric-alerts.md#metrics-and-dimensions-supported).<br>[Classic metric alerts](monitoring-overview-alerts.md) are not supported in the new alerts experience. You can find them under Alerts (Classic) in the Azure portal. The classic alerts support some metrics types that have not yet been moved to the newer alerts. For a full list, see [supported metrics](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-supported-metrics). |
| Log Analytics | Logs  | Receive notifications or run automated actions when a Log search query meets certain criteria. Alerts in Log Analytics are [being copied into the new experience](monitoring-alerts-extend.md). A [preview of *Log Analytics logs as metrics*](monitoring-alerts-extend-tool.md) is available. The preview allows you to take some types of logs and convert them to metrics, where you can then alert on them using the new alerting experience. The preview is useful if you have non-Azure logs that you want to get alongside native Azure Monitor metrics. |
| Activity Logs | Activity Log | Contains the records of all Create, Update, and Delete actions created by the selected target. |
| Service Health | Activity Log  | Not supported in unified alerts. See [Create activity log alerts on service notifications](monitoring-activity-log-alerts-on-service-notifications.md).  |
| Application Insights | Logs  | Contains logs with the performance details of your application. Using analytics query, you can define the conditions for the actions to be taken based on application data. |
| Application Insights | Metric | Not supported in unified alerts. See [Metric alerts].(../application-insights/app-insights-alerts.md) |
| Application Insights | Web Availability Tests | Not supported in unified alerts.  See [Web test alerts](../application-insights/app-insights-monitor-web-app-availability.md). Available to any website instrumented to send data to Application Insights. Receive a notification when availability or responsiveness of a website is below expectations. |

## Enhanced unified alerts (Public Preview)

An enhanced unified alerts experience was released in public preview for Azure Monitor on June 1, 2018. This experience builds on the benefits of [unified alerts](#overview)?released March 2018 and provides the ability to manage and aggregate individual alerts in addition to modifying alert state. This section describes the new features and how to navigate the new alert pages in the Azure portal.

### Features enhanced unified alerts

The new experience provides the following features that aren't available in the classic unified experience:

- **View alerts across subscriptions** - You can now view and manage individual instances of alerts across multiple subscriptions in a single view.
- **Manage the state of alerts** - Alerts now have a state that indicates whether its been acknowledged for closed.
- **Organize alerts with Smart Groups** - Smart Groups automatically group together related alerts so you can manage them as a set instead of individually.

### Enable enhanced unified alerts
Enable the new unified alert experience by clicking on the banner at the top of the Alerts page. This process creates an alert store that includes the past 30 days of fired alerts across supported services. Once the new experience is enabled, you can switch back and forth between the new and old experience by clicking on the banner.

> [!NOTE]
>  It may take a few minutes for the new experience to be initially enabled.

![Banner](media/monitoring-overview-unified-alerts/opt-in-banner.png)

All subscriptions that you have access to will be enrolled when you enable the new experience. Although the entire subscription is enabled, only users that selected the new experience will be able to view it. Other users with access to the subscription must enable the experience separately.

Enabling the new alert experience does not impact the configuration of action groups or notifications in your alert rules. It only changes the way that you view and manage fired instances of the alerts in the Azure portal.

### Smart Groups
Smart groups reduce noise by allowing you to manage related alerts as a single unit rather than managing individual alerts. You can view the details of smart groups and set the state similar to an alert. Each alert is a member of one and only one smart group.

Smart Groups are automatically created using machine learning to combine related alerts that represent a single issue. When an alert is created, the algorithm adds it to a new smart group or an existing smart group based on such information as historical patterns, similarity of properties, and similarity of structure. Currently, the algorithm only considers alerts from the same monitor service within a subscription. Smart groups can reduce up to 99% of alert noise through this consolidation. You can view the reason that alerts were included in a group in the Smart Group detail page.

The name of a smart group is the name of its first alert. You can't create or rename a smart group.


### Alert States
Enhanced unified alerts introduce the concept of alert state. You can set the state of an alert to specify where it is in the resolution process.  When an alert is created, it has a status of *New*. You can change the status when you've acknowledged an alert and when you've closed it. Any state changes are stored in the history of the alert.

The following alert states are supported.

| State | Description |
|:---|:---|
| New | The issue has just been detected and not yet reviewed. |
| Acknowledged | An administrator has reviewed the alert and started working on it. |
| Closed | The issue has been resolved. Once an alert has been closed, you can reopen it my changing it to another state. |

The state of an alert is different than the monitor condition. Metric alert rules can set an alert to a condition of _resolved_ when the error condition is no longer met. Alert state is set by the user and is independent of the monitor condition. Even though the system may set the monitor condition to resolved, the alert state isn't changed until the user changes it.

#### Changing the state of an alert or smart group
You can change the state of an individual alert or manage multiple alerts together by setting the state of a smart group.

Change the state of an alert by clicking on **Change alert state** in the detail view for the alert, or change the state for a smart group by clicking **Change smart group state** in its detail view. You can change the state of multiple items at one time by selecting them in a list view and clicking **Change State** at the top of the page. In both cases, select a new state from the dropdown and optionally provide a comment. If you're changing a single item, then you also have an option to apply the same changes to all the alerts in the smart group.

![Change state](media/monitoring-overview-unified-alerts/change-tate.png)

### Alerts page
The default Alerts page provides a summary of alerts that are created within a particular time window. It displays the total alerts for each severity with columns identifying the total number of alerts in each state for each severity. Click any of the severities to open the [All Alerts](#all-alerts-page) page filtered by that severity.

![Alerts page](media/monitoring-overview-unified-alerts/alerts-page.png)

You can filter this view by selecting values in the dropdowns at the top of the page.

| Column | Description |
|:---|:---|
| Subscription | Select up to 5 Azure subscriptions. Only alerts in the selected subscriptions are included in the view. |
| Resource Group | Select a single resource group. Only alerts with targets in the selected resource group are included in the view. |
| Time Range | Only alerts fired within the selected time window will be included in the view. Supported values are past hour, past 24 hours, past 7 days, and past 30 days. |

Click on the following values at the top of the Alerts page to open another page.

| Value | Description |
|:---|:---|
| Total Alerts | Total number of alerts that match the selected criteria. Click this value to open the All Alerts view with no filter. |
| Smart Groups | Total number of smart groups created from the alerts that match the selected criteria. Click this value to open the Smart Groups list in the All Alerts view.
| Total Alert Rules | Total number of alert rules in the selected subscription and resource group. Click this value to open the Rules view filtered on the selected subscriptions and resource group.


### All Alerts page 
The All Alerts page allows you to view a list of alerts that were created within the selected time window. You can either view a list of the individual alerts or a list of the smart groups containing the alerts. Click the banner at the top of the page to toggle between views.

![All Alerts page](media/monitoring-overview-unified-alerts/all-alerts-page.png)

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

### Alert detail page
The Alert Detail page is displayed when you click on an alert. It provides details of the alert and allows you to change its state.

![Alert Detail](media/monitoring-overview-unified-alerts/alert-detail.png)

The Alert Detail page includes the following sections.

| Section | Description |
|:---|:---|
| Essentials | Displays the properties and other significant information about the alert. |
| History | Lists each action taken by the alert and any changes made to the alert. This is currently limited to state changes. |
| Smart Group | Information about the smart group the alert is included in. The **Alert Count** refers to the number of alerts included in the smart group. This includes the other alerts that are included in the same same smart group that were created in the past 30 days.  This is regardless of the time filter in the alerts list page. Click on an alert to view its detail. |
| More Details | Displays further contextual information for the alert which is typically specific to the type of source that created the alert. |


### Smart Group detail page
The Smart Group Detail page is displayed when you click on a smart group. It provides details of the smart group, including the reasoning used to create the group, and allows you to change its state.
 
![Smart Group Detail](media/monitoring-overview-unified-alerts/smart-group-detail.png)


The Smart Group Detail page includes the following sections.

| Section | Description |
|:---|:---|
| Alerts | Lists the individual alerts that are included in the smart group. Click on an alert to open its Alert Detail page. |
| History | Lists each action taken by the smart group and any changes made to it. This is currently limited to state changes and alert membership changes. |

## Next steps
- [Learn how to use the new Alerts experience to create, view, and manage alerts](monitor-alerts-unified-usage.md)
- [Learn about log alerts in Alerts experience](monitor-alerts-unified-log.md)
- [Learn about metric alerts in Alerts experience](monitoring-near-real-time-metric-alerts.md)
- [Learn about Activity log alerts in Alerts experience](monitoring-activity-log-alerts-new-experience.md)

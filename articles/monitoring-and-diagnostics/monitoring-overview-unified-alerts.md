---
title: Explore the new Alerts experience in Azure Monitor| Microsoft Docs
description: Understand how the new simple and scalable alerts experience in Azure makes authoring, viewing and managing alerts easier
author: manishsm-msft
manager: kmadnani1
editor: ''
services: monitoring-and-diagnostics
documentationcenter: monitoring-and-diagnostics

ms.assetid:
ms.service: monitoring-and-diagnostics
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/23/2018
ms.author: mamit
ms.custom:

---
# The new alerts experience in Azure Monitor

## Overview

> [!NOTE]
> This article describes newer alerts. Older classic Azure Monitor alerts are described in [classic alerts Overview](monitoring-overview-alerts.md). 
>
>

Alerts has new experience. The older alerts experience is now under the Alerts (Classic) tab. The new Alerts experience has the following benefits over the Alerts (Classic) experience:

-	**Better notification system**: All newer alerts use [action groups]( https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-action-groups), which are named groups of notifications and actions that can be reused in multiple alerts.  Classic metric alerts and older Log Analytics alerts do not use action groups. 
- **A unified authoring experience**  - All alert creation for metrics, logs and activity log across Azure Monitor, Log Analytics, and Application Insights is in one place. 
- **View fired Log Analytics alerts in Azure portal** - You can now also see fired Log Analytics alerts in your subscription. Previously these were in a separate portal. 
- **Separation of Fired alerts and Alert Rules** - Alert Rules (the definition of condition that triggers an alert), and Fired Alerts (an instance of the alert rule firing) are differentiated, so the operational and configuration views are separated.
- **Better workflow** - The new alerts authoring experience guides the user along the process of configuring an alert rule, which makes it simpler to discover the right things to get alerted on.
 
Newer metric alerts specifically have the following improvements:
-	**Improved latency**: Newer metric alerts can run as frequently as every one minute. Older metric alerts always run at a frequency of 5 minutes. Log alerts still have a longer than 1 minute delay due to the time is takes to ingest the logs. 
-	**Support for multi-dimensional metrics**: You can alert on dimensional metrics allowing you to monitor an interesting segment of the metric.
-	**More control over metric conditions**: You can define richer alert rules. The newer alerts support monitoring the maximum, minimum, average, and total values of metrics.
-	**Combined monitoring of multiple metrics**: You can monitor multiple metrics (currently, up to two metrics) with a single rule. An alert is triggered if both metrics breach their respective thresholds for the specified time-period.
-	**Metrics from Logs** (limited public preview): Some log data going into Log Analytics can now be extracted and converted into Azure Monitor metrics and then alerted on just like other metrics. 



The following sections describe, in more detail, how the new experience works.

## Alert rules terminology
The new alerts experience uses the following concepts to separate the Alert Rule and Fired Alert objects while unifying the authoring experience across different alert types.

- **Target Resource** - A target can be any Azure resource. Target Resource defines the scope and signals available for alerting. Example targets: a virtual machine, a storage account, a virtual machine scale set, a Log Analytics workspace, or an Application Insights resource.

- **Criteria** - Criteria is combination of Signal and Logic applied on a Target resource. Examples: Percentage CPU > 70%, Server Response Time > 4 ms, Result count of a log query > 100 etc. 

- **Signal** - Signals are emitted by the Target resource and can be of several types. **Metric**, **Activity log**, **Application Insights**, and **Log** are supported Signal types.

- **Logic** - User-defined logic to check if the Signal is within expected range/values.  
 
- **Action** - A specific action taken when the alert is fired. For example, emailing an email address or calling a webhook URL. Multiple actions may occur when an alert fires. These alerts support action groups.  
 
- **Alert rule** - The condition that would trigger the alert. The alert rule captures the Target and Criteria for alerting. The Alert rule can be in an Enabled or a Disabled state.
 
    > [!NOTE]
    > This is different from Alerts (Classic) experience where the alert represents both the rule and fired alert and therefore can be in one of Warning, Active or Disabled states.
    >

## Single place to view and manage alerts
The goal of the Alerts experience is to be the single place to view and manage all your Azure alerts. The following subsections describe the functions of each individual screen of the new experience.

### Alerts overview page
**Monitor - Alerts** overview page shows aggregated summary of all the fired alerts, and total configured/enabled alert rules. It also shows a list of all fired alerts. Changing the subscriptions or filter parameters updates the aggregates and the alerts fired list.

> [!NOTE]
> Fired Alerts shown in Alerts are limited to supported metric and activity log alerts; Azure Monitor Overview shows count of fired alerts including those in older Azure Alerts

 ![alerts-overview](./media/monitoring-overview-unified-alerts/alerts-preview-overview2.png) 

### Alert rules management
**Monitor - Alerts>Rules** is a single page to manage all alert rules across your Azure subscriptions. It lists all the alert rules (enabled or disabled) and can be sorted based on target resources, resource groups, rule name, or status. Alert rules can also be disabled/enabled or edited from this page.  

 ![alerts-rules](./media/monitoring-overview-unified-alerts/alerts-preview-rules.png)


## One alert authoring experience across all monitoring sources
In the new Alerts experience, alerts can be authored in a consistent manner regardless of the monitoring service or signal type. All alerts fired and related details are available in single page.  
 
Authoring an alert is a three-step task where the user first picks a target for the alert, followed by selecting the right signal and then specifying the logic to be applied on the signal as part of the alert rule. This simplified authoring process no longer requires the user to know the monitoring source or signals supported before selecting an Azure resource. The common authoring experience automatically filters the list of available signals based on target resource selected and guides the creation of alert logic

You can learn more on how to create following alert types [here](monitor-alerts-unified-usage.md).
- Metric Alerts
- Log alerts (Log Analytics)
- Log alerts (Activity Logs)
- Log alerts (Application Insights)

 
## Alerts supported in new experience
Alerts are available across several Azure monitoring services. For information on how and when to use these services, [see this article](./monitoring-overview.md). Here is a breakdown of the alert types available across Azure and what's currently supported by the new alerts experience. 


| **Signal Type** | **Monitor Source** | **Description** | 
|-------------|----------------|-------------|
| Metric | Azure monitor | Also called [near-real-time metric alerts](monitoring-near-real-time-metric-alerts.md), they support evaluating metric conditions as frequently as 1 minute and allow for multi-metric and multi-dimensional metric rules. A list of supported resource types is available [here](monitoring-near-real-time-metric-alerts.md#metrics-and-dimensions-supported). |
| Metric | Azure monitor | [Older classic metric alerts](monitoring-overview-alerts.md) are not supported in the new alerts experience. You can find them under Alerts (Classic) in the Azure portal. The classic alerts support some metrics types that have not yet been moved to the newer alerts. For a full list, see [supported metrics](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-supported-metrics)
| Logs  | Log Analytics | Receive notifications or run automated actions when a Log search query over metric and/or event data meets certain criteria. Older Log Analytics alerts are still available, but are [being copied into the new experience](monitoring-alerts-extend.md). In addition, a [preview of *Log Analytics logs as metrics*](monitoring-alerts-extend-tool.md) is available. The preview allows you to take some types of logs and convert them to metrics, where you can then alert on them using the new alerting experience. The preview is useful if you have non-Azure logs that you want to get alongside native Azure Monitor metrics. |
| Activity Log | Activity Logs (general) | Contains the records of all Create, Update, and Delete actions performed through the selected target (resource/resource group/subscription). |
| Activity Log  | Service Health | Not supported in new alerts experience. See [Create activity log alerts on service notifications](monitoring-activity-log-alerts-on-service-notifications.md).  |
| Logs  | Application Insights | Contains logs with the performance details of your application. Using analytics query, you can define the conditions for the actions to be taken - based on the application data. |
| Metric | Application Insights | Not supported in new alerts experience. See [Metric alerts](../application-insights/app-insights-alerts.md) |
| Web Availability Tests | Application Insights | Not supported in Alerts experience.  See [Web test alerts](../application-insights/app-insights-monitor-web-app-availability.md). Available to any website instrumented to send data to Application Insights. Receive a notification when availability or responsiveness of a website is below expectations. |




## Next steps
- [Learn how to use the new Alerts experience to create, view, and manage alerts](monitor-alerts-unified-usage.md)
- [Learn about log alerts in Alerts experience](monitor-alerts-unified-log.md)
- [Learn about metric alerts in Alerts experience](monitoring-near-real-time-metric-alerts.md)
- [Learn about Activity log alerts in Alerts experience](monitoring-activity-log-alerts-new-experience.md)

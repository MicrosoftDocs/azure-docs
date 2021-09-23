---
title: Deploy Azure Monitor
description: Describes the different steps required for a complete implementation of Azure Monitor to monitor all of the resources in your Azure subscription.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 07/27/2020

---

# Deploy Azure Monitor - Alerts and automated actions
Alerts in Azure Monitor proactively notify you of important data or patterns identified in your monitoring data. Some insights will generate alerts without configuration. For other scenarios, you need to create [alert rules](alerts/alerts-overview.md) that include the data to analyze and the criteria for when to generate an alert, and action groups which define the action to take when an alert is generated. 

This article provides guidance on defining and creating alert rules in Azure Monitor.

## Alerting strategy

See [Successful alerting strategy](/azure/cloud-adoption-framework/manage/monitor/alerting#successful-alerting-strategy)


### Create action groups
[Action groups](alerts/action-groups.md) are a collection of notification preferences used by alert rules to determine the action to perform when an alert is triggered. Examples of actions include sending a mail or text, calling a webhook, or send data to an ITSM tool. Each alert rule requires at least one action group, and a single action group can be used by multiple alert rules.

See [Create and manage action groups in the Azure portal](alerts/action-groups.md) for details on creating an action group and a description of the different actions it can include.


### Create alert rules
There are multiple types of alert rules defined by the type of data that they use. Each has different capabilities, and a different cost. The basic strategy you should follow is to use the alert rule type with the lowest cost that provides the logic that you require.

- [Activity log rules](alerts/activity-log-alerts.md). Creates an alert in response to a new Activity log event that matches specified conditions. There is no cost to these alerts so they should be your first choice. See [Create, view, and manage activity log alerts by using Azure Monitor](alerts/alerts-activity-log.md) for details on creating an Activity log alert.
- [Metric alert rules](alerts/alerts-metric-overview.md). Creates an alert in response to one or more metric values exceeding a threshold. Metric alerts are stateful meaning that the alert will automatically close when the value drops below the threshold, and it will only send out notifications when the state changes. There is a cost to metric alerts, but this is significantly less than log alerts. See [Create, view, and manage metric alerts using Azure Monitor](alerts/alerts-metric.md) for details on creating a metric alert.
- [Log alert rules](alerts/alerts-unified-log.md). Creates an alert when the results of a schedule query matches specified criteria. They are the most expensive of the alert rules, but they allow the most complex criteria. See [Create, view, and manage log alerts using Azure Monitor](alerts/alerts-log.md) for details on creating a log query alert.
- [Application alerts](app/monitor-web-app-availability.md) allow you to perform proactive performance and availability testing of your web application. You can perform a simple ping test at no cost, but there is a cost to more complex testing. See [Monitor the availability of any website](app/monitor-web-app-availability.md) for a description of the different tests and details on creating them.



## Visualize data
Insights and solutions will include their own workbooks and views for analyzing their data. In addition to these, you can create your own [visualizations](visualizations.md) including workbooks for Azure Monitor data and dashboards to combine Azure Monitor data with data from other services in Azure.


### Create workbooks
[Workbooks](visualize/workbooks-overview.md) in Azure Monitor allow you to create rich visual reports in the Azure portal. You can combine different sets of data from Azure Monitor Metrics and Azure Monitor Logs to create unified interactive experiences. You can access a gallery of workbooks in the **Workbooks** tab of the Azure Monitor menu. 

See [Azure Monitor Workbooks](visualize/workbooks-overview.md) for details on creating custom workbooks.

### Create dashboards
[Azure dashboards](../azure-portal/azure-portal-dashboards.md) are the primary dashboarding technology for Azure and allow you to combine Azure Monitor data with data from other services to provide a single pane of glass over your Azure infrastructure. See [Create and share dashboards of Log Analytics data](visualize/tutorial-logs-dashboards.md) for details on creating a dashboard that includes data from Azure Monitor Logs. 

See [Create custom KPI dashboards using Azure Application Insights](app/tutorial-app-dashboards.md) for details on creating a dashboard that includes data from Application Insights. 







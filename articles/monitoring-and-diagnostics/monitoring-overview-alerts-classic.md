---
title: Overview of classic alerts in Microsoft Azure and Azure Monitor
description: Classic alerts are being deprecated. Alerts enable you to monitor Azure resource metrics, events, or logs and be notified when a condition you specify is met.
author: rboucher
services: azure-monitor
ms.service: azure-monitor
ms.topic: conceptual
ms.date: 09/24/2018
ms.author: robb
ms.component: alerts
---

# What are classic alerts in Microsoft Azure?

> [!NOTE]
> This article describes how to create older classic metric alerts. Azure Monitor now supports [newer near-real time metric alerts and a new alerts experience](monitoring-overview-alerts.md). 
>

Alerts allow you to configure conditions over data and become notified when the conditions match the latest monitoring data.

## Old and New alerting capabilities

In the past Azure Monitor, Application Insights, Log Analytics and Service Health had separate alerting capabilities. Overtime, Azure improved and combined both the user interface and different methods of alerting. The consolidation is still in process. Alerts

You can view classic alerts only in the classic alerts user screen in the Azure Portal. You get this screen from the **View classic alerts** button on the alerts screen. 

 ![Alert choices in Azure portal](./media/monitoring-overview-alerts-classic/monitor-alert-screen2.png) 

The new alerts user experience has the following benefits over the classic alerts experience:
-	**Better notification system** - All newer alerts use action groups, which are named groups of notifications and actions that can be reused in multiple alerts. Classic metric alerts and older Log Analytics alerts do not use action groups.
-	**A unified authoring experience** - All alert creation for metrics, logs and activity log across Azure Monitor, Log Analytics, and Application Insights is in one place.
-	**View fired Log Analytics alerts in Azure portal** - You can now also see fired Log Analytics alerts in your subscription. Previously these were in a separate portal.
-	**Separation of fired alerts and alert rules** - Alert rules (the definition of condition that triggers an alert), and Fired Alerts (an instance of the alert rule firing) are differentiated, so the operational and configuration views are separated.
-	**Better workflow** - The new alerts authoring experience guides the user along the process of configuring an alert rule, which makes it simpler to discover the right things to get alerted on.
-   **Smart Alerts consolidation** and **setting alert state**  -  Newer alerts include auto grouping functionality showing similar alerts together to reduce overload in the user interface. 

The newer metric alerts have the following benefits over the classic metric alerts:
-	**Improved latency**: Newer metric alerts can run as frequently as every one minute. Older metric alerts always run at a frequency of 5 minutes. Newer alerts have increasing smaller delay from issue occurance to notification or action (3 to 5 minutes). Older alerts are 5 to 15 minutes depending on the type.  Log alerts typically have 10 to 15 minute delay due to the time is takes to ingest the logs, but newer processing methods is reducing that time. 
-	**Support for multi-dimensional metrics**: You can alert on dimensional metrics allowing you to monitor an interesting segment of the metric.
-	**More control over metric conditions**: You can define richer alert rules. The newer alerts support monitoring the maximum, minimum, average, and total values of metrics.
-	**Combined monitoring of multiple metrics**: You can monitor multiple metrics (currently, up to two metrics) with a single rule. An alert is triggered if both metrics breach their respective thresholds for the specified time-period.
-	**Better notification system**: All newer alerts use [action groups](../monitoring-and-diagnostics/monitoring-action-groups.md), which are named groups of notifications and actions that can be reused in multiple alerts.  Classic metric alerts and older Log Analytics alerts do not use action groups. 
-	**Metrics from Logs** (public preview): Log data going into Log Analytics can now be extracted and converted into Azure Monitor metrics and then alerted on just like other metrics. 
See [Alerts (classic)](monitoring-overview-alerts-classic.md) for the terminology specific to classic alerts. 


## Classic alerts on Azure Monitor data
There are two types of classic alerts available -  metric alerts and activity log alerts.

* **Classic metric alerts** - This alert triggers when the value of a specified metric crosses a threshold that you assign. The alert generates a notification when the alert is "Activated" (when the threshold is crossed and the alert condition is met). It generates another notification when it is "Resolved" (when the threshold is crossed again and the condition is no longer met).

* **Classic activity log alerts** - A streaming log alert that triggers when an Activity Log event is generated that matches filter criteria that you have assigned. These alerts have only one state, "Activated," since the alert engine simply applies the filter criteria to any new event. These alerts can be used to become notified when a new Service Health incident occurs or when a user or application performs an operation in your subscription, for example, "Delete virtual machine."

For Diagnostic Log data available through Azure Monitor, route the data into Log Analytics (formerly OMS) and use a Log Analytics query alert. Log Analytics now uses the [new alerting method](monitoring-overview-unified-alerts.md) 

The following diagram summarizes sources of data in Azure Monitor and, conceptually, how you can alert off of that data.

![Alerts explained](./media/monitoring-overview-alerts-classic/Alerts_Overview_Resource_v5.png)

## Taxonomy of alerts (classic)
Azure uses the following terms to describe classic alerts and their functions:
* **Alert** - a definition of criteria (one or more rules or conditions) that becomes activated when met.
* **Active** - the state when the criteria defined by a classic alert is met.
* **Resolved** - the state when the criteria defined by a classic alert is no longer met after previously having been met.
* **Notification** - the action taken based off of a classic alert becoming active.
* **Action** - a specific call sent to a receiver of a notification (for example, emailing an address or posting to a webhook URL). Notifications can usually trigger multiple actions.

## How do I receive a notification from an Azure Monitor classic alert?
Historically, Azure alerts from different services used their own built-in notification methods. 

Azure Monitor created a reusable notification grouping called *action groups*. Action groups specify a set of receivers for a notification and any time an alert is activated that references the Action Group, all receivers receive that notification. Action groups allows you to reuse a grouping of receivers (for example, your on-call engineer list) across many alert objects. Action groups support notification by posting to a webhook URL in addition to email addresses, SMS numbers, and a number of other actions.  For more information, see [action groups](monitoring-action-groups.md). 

Older classic Activity Log alerts use action groups.

However, the older metric alerts do not use action groups. Instead, you can configure the following actions: 
- Send email notifications to the service administrator, to co-administrators, or to additional email addresses that you specify.
- Call a webhook, which enables you to launch additional automation actions.

Webhooks enables automation and remediation, for example, using:
    - Azure Automation Runbook
    - Azure Function
    - Azure Logic App
    - a third-party service

## Next steps
Get information about alert rules and configuring them by using:

* Learn more about [Metrics](monitoring-overview-metrics.md)
* Configure [classic Metric Alerts via Azure portal](insights-alerts-portal.md)
* Configure [classic Metric Alerts PowerShell](insights-alerts-powershell.md)
* Configure [classic Metric Alerts Command-line interface (CLI)](insights-alerts-command-line-interface.md)
* Configure [classic Metric Alerts Azure Monitor REST API](https://msdn.microsoft.com/library/azure/dn931945.aspx)
* Learn more about [Activity Log](monitoring-overview-activity-logs.md)
* Configure [Activity Log Alerts via Azure portal](monitoring-activity-log-alerts.md)
* Configure [Activity Log Alerts via Resource Manager](monitoring-create-activity-log-alerts-with-resource-manager-template.md)
* Review the [activity log alert webhook schema](monitoring-activity-log-alerts-webhook.md)
* Learn more about [Action groups](monitoring-action-groups.md)
* Configure [newer Alerts](monitor-alerts-unified-usage.md)
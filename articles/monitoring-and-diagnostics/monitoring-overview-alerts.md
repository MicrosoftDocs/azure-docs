---
title: Overview of Alerts in Microsoft Azure and Azure Monitor | Microsoft Docs
description: Alerts enable you to monitor Azure resource metrics, events, or logs and be notified when a condition you specify is met.
author: rboucher
manager: carmonm
editor: ''
services: monitoring-and-diagnostics
documentationcenter: monitoring-and-diagnostics

ms.assetid: a6dea224-57bf-43d8-a292-06523037d70b
ms.service: monitoring-and-diagnostics
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/02/2017
ms.author: robb
ms.custom: H1Hack27Feb2017

---
# What are alerts in Microsoft Azure?
This article describes the various sources of alerts in Microsoft Azure, what are the purposes for those alerts, their benefits, and how to get started with using them. It specifically applies to Azure Monitor, but provides pointers to other services with alerts as well. Alerts offer a method of monitoring in Azure that allows you to configure conditions over data and become notified when the conditions match the latest monitoring data.

## Taxonomy of Azure Alerts
Azure uses the following terms to describe alerts and their functions:
* **Alert** - a definition of criteria (one or more rules or conditions) that becomes activated when met.
* **Active** - the state when the criteria defined by an alert is met.
* **Resolved** - the state when the criteria defined by an alert is no longer met after previously having been met.
* **Notification** - the action taken based off of an alert becoming active.
* **Action** - a specific call sent to a receiver of a notification (for example, emailing an address or posting to a webhook URL). Notifications can usually trigger multiple actions.

## Alerts in different Azure services
Alerts are available across several Azure monitoring services. For information on how and when to use these services, [see this article](./monitoring-overview.md). Here is a breakdown of the alert types available across Azure:

| Service | Alert type | Supported services | Description |
|---|---|---|---|
| Azure Monitor | [Metric alerts](./insights-alerts-portal.md) | [Supported metrics from Azure Monitor](./monitoring-supported-metrics.md) | Receive a notification when any platform-level metric meets a specific condition (for example, CPU % on a VM is greater than 90 for the past 5 minutes). |
|Azure Monitor | [Near Real-Time Metric Alerts (preview)](./monitoring-near-real-time-metric-alerts.md)| [Supported resources from Azure Monitor](./monitoring-near-real-time-metric-alerts.md#what-resources-can-i-create-near-real-time-metric-alerts-for) | Receive a notification faster than metric alerts when one or more platform-level metrics meet specified conditions (for example, CPU % on a VM is greater than 90 and Network In is greater than 500 MB for the past 5 minutes). |
| Azure Monitor | [Activity Log alerts](./monitoring-activity-log-alerts.md) | All resource types available in Azure Resource Manager | Receive a notification when any new event in the [Azure Activity Log](./monitoring-overview-activity-logs.md) matches specific conditions (for example, when a "Delete VM" operation occurs in myProductionResourceGroup or when a new Service Health event with "Active" as the status appears). |
| Application Insights | [Metric alerts](../application-insights/app-insights-alerts.md) | Any application instrumented to send data to Application Insights | Receive a notification when any application-level metric meets a specific condition (for example, server response time is greater than 2 seconds). |
| Application Insights | [Web test alerts](../application-insights/app-insights-monitor-web-app-availability.md) | Any website instrumented to send data to Application Insights | Receive a notification when availability or responsiveness of a website is below expectations. |
| Log Analytics | [Log Analytics alerts](../log-analytics/log-analytics-alerts.md) | Any service configured to send data into Log Analytics | Receive a notification when a Log Analytics search query over metric and/or event data meets certain criteria. |

## Alerts on Azure Monitor data
There are three types of alerts off of data available from Azure Monitor -- metric alerts, near real-time metric alerts (preview) and Activity Log alerts.

* **Metric alerts** - This alert triggers when the value of a specified metric crosses a threshold that you assign. The alert generates a notification when the alert is "Activated" (when the threshold is crossed and the alert condition is met) as well as when it is "Resolved" (when the threshold is crossed again and the condition is no longer met). For a growing list of available metrics supported by Azure monitor, see [List of metrics supported on Azure Monitor](monitoring-supported-metrics.md).
* **Near real-time metric alerts (preview)**  - These alerts are similar to metric alerts but differ in a few ways. Firstly, as the name suggests these alerts can trigger in near real-time (as fast as 1 min). They also support monitoring multiple(currently two) metrics.  The alert generates a notification when the alert is "Activated" (when the thresholds for each metric are crossed at the same time and the alert condition is met) as well as when it is "Resolved" (when at least one metric crosses the threshold again and the condition is no longer met).
> [!NOTE]
> Near real-time metric alerts are currently in public preview. The functionality and user experience is subject to change.
>
>
* **Activity log alerts** - A streaming log alert that triggers when an Activity Log event is generated that matches filter criteria that you have assigned. These alerts have only one state, "Activated," since the alert engine simply applies the filter criteria to any new event. These alerts can be used to become notified when a new Service Health incident occurs or when a user or application performs an operation in your subscription, for example, "Delete virtual machine."

For Diagnostic Log data available through Azure Monitor, we suggest routing the data into Log Analytics and using a Log Analytics alert. The following diagram summarizes sources of data in Azure Monitor and, conceptually, how you can alert off of that data.

![Alerts explained](./media/monitoring-overview-alerts/Alerts_Overview_Resource_v4.png)

## How do I receive a notification on an Azure Monitor alert?
Historically, Azure alerts from different services used their own built-in notification methods. Going forward, Azure Monitor offers a reusable notification grouping called Action Groups. Action Groups specify a set of receivers for a notification -- any number of email addresses, phone numbers (for SMS), or webhook URLs -- and any time an alert is activated that references the Action Group, all receivers receive that notification. This allows you to reuse a grouping of receivers (for example, your on call engineer list) across many alert objects. Currently, only Activity Log alerts make use of Action Groups, but several other Azure alert types are working on using Action Groups as well.

Action Groups support notification by posting to a webhook URL in addition to email addresses and SMS numbers. This enables automation and remediation, for example, using:
    - Azure Automation Runbook
    - Azure Function
    - Azure Logic App
    - a third-party service

Near real-time metric alerts (Preview), and Activity Log alerts use Action Groups.

Metric alerts do not yet use Action Groups. On an individual metric alert you can configure notifications to:
* Send email notifications to the service administrator, to co-administrators, or to additional email addresses that you specify.
* Call a webhook, which enables you to launch additional automation actions.

## Next steps
Get information about alert rules and configuring them by using:

* Learn more about [Metrics](monitoring-overview-metrics.md)
* Configure [Metric Alerts via Azure portal](insights-alerts-portal.md)
* Configure [Metric Alerts PowerShell](insights-alerts-powershell.md)
* Configure [Metric Alerts Command-line interface (CLI)](insights-alerts-command-line-interface.md)
* Configure [Metric Alerts Azure Monitor REST API](https://msdn.microsoft.com/library/azure/dn931945.aspx)
* Learn more about [Activity Log](monitoring-overview-activity-logs.md)
* Configure [Activity Log Alerts via Azure portal](monitoring-activity-log-alerts.md)
* Configure [Activity Log Alerts via Resource Manager](monitoring-create-activity-log-alerts-with-resource-manager-template.md)
* Review the [activity log alert webhook schema](monitoring-activity-log-alerts-webhook.md)
* Learn more about [Near Real-Time Metric Alerts](monitoring-near-real-time-metric-alerts.md)
* Learn more about [Service Notifications](monitoring-service-notifications.md)
* Learn more about [Action Groups](monitoring-action-groups.md)

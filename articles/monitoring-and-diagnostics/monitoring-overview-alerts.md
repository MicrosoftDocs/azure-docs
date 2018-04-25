---
title: Overview of classic alerts in Microsoft Azure and Azure Monitor | Microsoft Docs
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
ms.date: 04/25/2018
ms.author: robb

---
# What are classic alerts in Microsoft Azure?

> [!NOTE]
> This article describes how to create older classic metric alerts. Azure Monitor now supports [newer near-real time metric alerts](monitoring-overview-unified-alerts.md) and a new alerts experience. 
>

Alerts allow you to configure conditions over data and become notified when the conditions match the latest monitoring data.


## Alerts on Azure Monitor data
There are two types of classic alerts available -  metric alerts and activity log alerts.

* **Classic metric alerts** - This alert triggers when the value of a specified metric crosses a threshold that you assign. The alert generates a notification when the alert is "Activated" (when the threshold is crossed and the alert condition is met) as well as when it is "Resolved" (when the threshold is crossed again and the condition is no longer met). For newer metric alerts, see below.

* **Classic activity log alerts** - A streaming log alert that triggers when an Activity Log event is generated that matches filter criteria that you have assigned. These alerts have only one state, "Activated," since the alert engine simply applies the filter criteria to any new event. These alerts can be used to become notified when a new Service Health incident occurs or when a user or application performs an operation in your subscription, for example, "Delete virtual machine."

For Diagnostic Log data available through Azure Monitor, we suggest routing the data into Log Analytics (formerly OMS) and using a Log Analytics query alert. Log Analytics now uses the [new alerting method](monitoring-overview-unified-alerts.md) 

The following diagram summarizes sources of data in Azure Monitor and, conceptually, how you can alert off of that data.

![Alerts explained](./media/monitoring-overview-alerts/Alerts_Overview_Resource_v4.png)

## Taxonomy of Azure Monitor alerts (classic)
Azure uses the following terms to describe classic alerts and their functions:
* **Alert** - a definition of criteria (one or more rules or conditions) that becomes activated when met.
* **Active** - the state when the criteria defined by a classic alert is met.
* **Resolved** - the state when the criteria defined by a classic alert is no longer met after previously having been met.
* **Notification** - the action taken based off of a classic alert becoming active.
* **Action** - a specific call sent to a receiver of a notification (for example, emailing an address or posting to a webhook URL). Notifications can usually trigger multiple actions.

## How do I receive a notification from an Azure Monitor classic alert?
Historically, Azure alerts from different services used their own built-in notification methods. 

Now Azure Monitor offers a reusable notification grouping called *Action Groups*. Action Groups specify a set of receivers for a notification and any time an alert is activated that references the Action Group, all receivers receive that notification. This allows you to reuse a grouping of receivers (for example, your on call engineer list) across many alert objects. Action Groups support notification by posting to a webhook URL in addition to email addresses, SMS numbers, and a number of other actions.  For more information, see [Action Groups](monitoring-action-groups.md). 

Older classic Activity Log alerts use Action Groups.

However, the older metric alerts do not use Action Groups. Instead, you can configure the following actions: 
* Send email notifications to the service administrator, to co-administrators, or to additional email addresses that you specify.
* Call a webhook, which enables you to launch additional automation actions.

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
* Learn more about [Action Groups](monitoring-action-groups.md)
* Configure [newer Alerts](monitor-alerts-unified-usage.md)

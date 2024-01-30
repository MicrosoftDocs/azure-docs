---
title: Overview of classic alerts in Azure Monitor
description: Classic alerts will be deprecated. Alerts enable you to monitor Azure resource metrics, events, or logs, and they notify you when a condition you specify is met.
ms.topic: conceptual
ms.date: 06/20/2023
---

# What are classic alerts in Azure?

> [!NOTE]
> This article describes how to create older classic metric alerts. Azure Monitor now supports [near real time metric alerts and a new alerts experience](./alerts-overview.md). Classic alerts are [retired](./monitoring-classic-retirement.md) for public cloud users. Classic alerts for Azure Government cloud and Microsoft Azure operated by 21Vianet will retire on **February 29, 2024**.
>

Alerts allow you to configure conditions over data, and they notify you when the conditions match the latest monitoring data.

## Old and new alerting capabilities

In the past, Azure Monitor, Application Insights, Log Analytics, and Service Health had separate alerting capabilities. Over time, Azure improved and combined both the user interface and different methods of alerting. The consolidation is still in process.

You can view classic alerts only on the classic alerts user screen in the Azure portal. To see this screen, select **View classic alerts** on the **Alerts** screen.

 :::image type="content" source="media/alerts-classic.overview/monitor-alert-screen2.png" lightbox="media/alerts-classic.overview/monitor-alert-screen2.png" alt-text="Screenshot that shows alert choices in the Azure portal.":::

The new alerts user experience has the following benefits over the classic alerts experience:
- **Better notification system:** All newer alerts use action groups. You can reuse these named groups of notifications and actions in multiple alerts. Classic metric alerts and older Log Analytics alerts don't use action groups.
- **A unified authoring experience:** All alert creation for metrics, logs, and activity logs across Azure Monitor, Log Analytics, and Application Insights is in one place.
- **View fired Log Analytics alerts in the Azure portal:** You can now also see fired Log Analytics alerts in your subscription. Previously, these alerts were in a separate portal.
- **Separation of fired alerts and alert rules:** Alert rules (the definition of condition that triggers an alert) and fired alerts (an instance of the alert rule firing) are differentiated. Now the operational and configuration views are separated.
- **Better workflow:** The new alerts authoring experience guides the user along the process of configuring an alert rule. This change makes it simpler to discover the right things to get alerted on.
- **Smart alerts consolidation and setting alert state:** Newer alerts include auto grouping functionality that shows similar alerts together to reduce overload in the user interface.

The newer metric alerts have the following benefits over the classic metric alerts:
- **Improved latency:** Newer metric alerts can run as frequently as every minute. Older metric alerts always run at a frequency of 5 minutes. Newer alerts have increasing smaller delay from issue occurrence to notification or action (3 to 5 minutes). Older alerts are 5 to 15 minutes depending on the type. Log alerts typically have a delay of 10 minutes to 15 minutes because of the time it takes to ingest the logs. Newer processing methods are reducing that time.
- **Support for multidimensional metrics:** You can alert on dimensional metrics. Now you can monitor an interesting segment of the metric.
- **More control over metric conditions:** You can define richer alert rules. The newer alerts support monitoring the maximum, minimum, average, and total values of metrics.
- **Combined monitoring of multiple metrics:** You can monitor multiple metrics (currently, up to two metrics) with a single rule. An alert triggers if both metrics breach their respective thresholds for the specified time period.
- **Better notification system:** All newer alerts use [action groups](./action-groups.md). You can reuse these named groups of notifications and actions in multiple alerts. Classic metric alerts and older Log Analytics alerts don't use action groups.
- **Metrics from logs (preview):** You can now extract and convert log data that goes into Log Analytics into Azure Monitor metrics and then alert on it like other metrics. For the terminology specific to classic alerts, see [Alerts (classic)]().

## Classic alerts on Azure Monitor data
Two types of classic alerts are available:

* **Classic metric alerts**: This alert triggers when the value of a specified metric crosses a threshold that you assign. The alert generates a notification when that threshold is crossed and the alert condition is met. At that point, the alert is considered "Activated." It generates another notification when it's "Resolved," that is, when the threshold is crossed again and the condition is no longer met.
* **Classic activity log alerts**: A streaming log alert that triggers on an activity log event entry that matches your filter criteria. These alerts have only one state: "Activated." The alert engine applies the filter criteria to any new event. It doesn't search to find older entries. These alerts can notify you when a new Service Health incident occurs or when a user or application performs an operation in your subscription. An example of an operation might be "Delete virtual machine."

For resource log data available through Azure Monitor, route the data into Log Analytics and use a log query alert. Log Analytics now uses the [new alerting method](./alerts-overview.md).

The following diagram summarizes sources of data in Azure Monitor and, conceptually, how you can alert off of that data.

:::image type="content" source="media/alerts-classic.overview/Alerts_Overview_Resource_v5.png" lightbox="media/alerts-classic.overview/Alerts_Overview_Resource_v5.png" alt-text="Diagram that explains alerts.":::

## Taxonomy of alerts (classic)
Azure uses the following terms to describe classic alerts and their functions:
* **Alert**: A definition of criteria (one or more rules or conditions) that becomes activated when met.
* **Active**: The state when the criteria defined by a classic alert are met.
* **Resolved**: The state when the criteria defined by a classic alert are no longer met after they were previously met.
* **Notification**: The action taken based off of a classic alert becoming active.
* **Action**: A specific call sent to a receiver of a notification (for example, emailing an address or posting to a webhook URL). Notifications can usually trigger multiple actions.

## How do I receive a notification from an Azure Monitor classic alert?
Historically, Azure alerts from different services used their own built-in notification methods.

Azure Monitor created a reusable notification grouping called *action groups*. Action groups specify a set of receivers for a notification. Any time an alert is activated that references the action group, all receivers receive that notification. With action groups, you can reuse a grouping of receivers (for example, your on-call engineer list) across many alert objects.

Action groups support notification by posting to a webhook URL and to email addresses, SMS numbers, and several other actions. For more information, see [Action groups](./action-groups.md).

Older classic activity log alerts use action groups. But the older metric alerts don't use action groups. Instead, you can configure the following actions:

- Send email notifications to the service administrator, co-administrators, or other email addresses that you specify.
- Call a webhook, which enables you to launch other automation actions.

Webhooks enable automation and remediation, for example, by using:
- Azure Automation runbooks
- Azure Functions
- Azure Logic Apps
- A third-party service

## Next steps
Get information about alert rules and how to configure them:

* Learn more about [metrics](../data-platform.md).
* Configure [classic metric alerts via the Azure portal](alerts-classic-portal.md).
* Configure [classic metric alerts via PowerShell](alerts-classic-portal.md).
* Configure [classic metric alerts via the command-line interface (CLI)](alerts-classic-portal.md).
* Configure [classic metric alerts via the Azure Monitor REST API](/rest/api/monitor/alertrules).
* Learn more about [activity logs](../essentials/platform-logs-overview.md).
* Configure [activity log alerts via the Azure portal](./activity-log-alerts.md).
* Configure [activity log alerts via Azure Resource Manager](./alerts-activity-log.md).
* Review the [activity log alert webhook schema](activity-log-alerts-webhook.md).
* Learn more about [action groups](./action-groups.md).
* Configure [newer alerts](alerts-metric.md).

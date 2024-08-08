---
title: Plan alerts and automated actions
description: Recommendations for deployment of Azure Monitor alerts and automated actions.
ms.author: abbyweisberg
ms.topic: conceptual
author: bwren
ms.date: 02/15/2024
ms.reviewer: bwren
---

# Plan alerts and automated actions

Alerts proactively notify you of important data or patterns identified in your monitoring data. You can create alerts that:

- Send a proactive notification.
- Initiate an automated action to attempt to remediate an issue.


Alert rules are defined by the type of data they use. Each has different capabilities and a different cost. The basic strategy is to use the alert rule type with the lowest cost that provides the logic you require. See [Choosing the right type of alert rule](alerts-types.md).

For more information about alerts, see [alerts overview](alerts-overview.md).

## Alerting strategy

Defining an alert strategy assists you in defining the configuration of alert rules including alert severity and action groups.

For factors to consider as you develop an alerting strategy, see [Successful alerting strategy](/azure/cloud-adoption-framework/manage/monitor/alerting#successful-alerting-strategy).

## Automated responses to alerts 

Use [action groups](action-groups.md) to define automated responses to alerts. An action group is a collection of one or more notifications and actions triggered by the alert. A single action group can be used with multiple alert rules and contain one or more of the following items:

- **Notifications**: Messages that notify operators and administrators that an alert was created.
- **Actions**: Automated processes that attempt to correct the detected issue.


### Notifications

Notifications are messages sent to one or more users to notify them that an alert has been created. Because a single action group can be used with multiple alert rules, you should design a set of action groups for different sets of administrators and users who will receive the same sets of alerts. Use any of the following types of notifications depending on the preferences of your operators and your organizational standards:

- Email
- SMS
- Push to Azure app
- Voice
- Email Azure Resource Manager role

### Actions

Actions are automated responses to an alert. You can use the available actions for any scenario that they support, but the following sections describe how each action is typically used.

### Automated remediation

Use the following actions for automated remediation of the issue identified by the alert:

- **Automation runbook**: Start a built-in runbook or a custom runbook in Azure Automation. For example, built-in runbooks are available to perform such functions as restarting or scaling up a virtual machine.
- **Azure Functions**: Start an Azure function.

### ITSM and on-call management

- **IT service management (ITSM)**: Use the ITSM Connector to create work items in your ITSM tool based on alerts from Azure Monitor. You first configure the connector and then use the **ITSM** action in alert rules.
- **Webhooks**: Send the alert to an incident management system that supports webhooks such as PagerDuty and Splunk On-Call.
- **Secure webhook**: Integrate ITSM with Microsoft Entra authentication.

## Alerting at scale

As part of your alerting strategy, you'll want to alert on issues for all your critical Azure applications and resources. See [Alerting at-scale](alerts-overview.md#alerting-at-scale) for guidance. 

## Minimize alert activity

You want to create alerts for any important information in your environment. But you don't want to create excessive alerts and notifications for issues that don't warrant them. To minimize your alert activity to ensure that critical issues are surfaced while you don't generate excess information and notifications for administrators, follow these guidelines:

- See [Successful alerting strategy](/azure/cloud-adoption-framework/manage/monitor/alerting#successful-alerting-strategy) to determine whether a symptom is an appropriate candidate for alerting.
- Use the **Automatically resolve alerts** option in [metric alert rules](alerts-create-metric-alert-rule.yml) to resolve alerts when the condition has been corrected.
- Use the **Suppress alerts** option in [log search query alert rules](alerts-create-log-alert-rule.md) to avoid creating multiple alerts for the same issue.
- Ensure that you use appropriate severity levels for alert rules so that high-priority issues are analyzed.
- Limit notifications for alerts with a severity of Warning or less because they don't require immediate attention.

## Next steps

[Optimize cost in Azure Monitor](../best-practices-cost.md).

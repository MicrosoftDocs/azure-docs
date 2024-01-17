---
title: 'Plan your Alerts and automated actions'
description: Recommendations for deployment of Azure Monitor alerts and automated actions.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 05/31/2023
ms.reviewer: bwren

---

# Plan your alerts and automated actions

This article provides guidance on alerts in Azure Monitor. Alerts proactively notify you of important data or patterns identified in your monitoring data. You can view alerts in the Azure portal. You can create alerts that:

- Send a proactive notification.
- Initiate an automated action to attempt to remediate an issue.

## Alerting strategy

An alerting strategy defines your organization's standards for:

- The types of alert rules that you'll create for different scenarios.
- How you'll categorize and manage alerts after they're created.
- Automated actions and notifications that you'll take in response to alerts.

Defining an alert strategy assists you in defining the configuration of alert rules including alert severity and action groups.

For factors to consider as you develop an alerting strategy, see [Successful alerting strategy](/azure/cloud-adoption-framework/manage/monitor/alerting#successful-alerting-strategy).

## Alert rule types

Alerts in Azure Monitor are created by alert rules that you must create. For guidance on recommended alert rules, see the monitoring documentation for each Azure service. Azure Monitor doesn't have any alert rules by default.

Multiple types of alert rules are defined by the type of data they use. Each has different capabilities and a different cost. The basic strategy is to use the alert rule type with the lowest cost that provides the logic you require.

- Activity log rules. Creates an alert in response to a new activity log event that matches specified conditions. There's no cost to these alerts so they should be your first choice, although the conditions they can detect are limited. See [Create or edit an alert rule](alerts-create-new-alert-rule.md) for information on creating an activity log alert.
- Metric alert rules. Creates an alert in response to one or more metric values exceeding a threshold. Metric alerts are stateful, which means that the alert will automatically close when the value drops below the threshold, and it will only send out notifications when the state changes. There's a cost to metric alerts, but it's often much less than log alerts. See [Create or edit an alert rule](alerts-create-new-alert-rule.md) for information on creating a metric alert.
- Log alert rules. Creates an alert when the results of a schedule query match specified criteria. They're the most expensive of the alert rules, but they allow the most complex criteria. See [Create or edit an alert rule](alerts-create-new-alert-rule.md) for information on creating a log query alert.
- [Application alerts](/previous-versions/azure/azure-monitor/app/monitor-web-app-availability). Performs proactive performance and availability testing of your web application. You can perform a ping test at no cost, but there's a cost to more complex testing. See [Monitor the availability of any website](/previous-versions/azure/azure-monitor/app/monitor-web-app-availability) for a description of the different tests and information on creating them.

## Alert severity

Each alert rule defines the severity of the alerts that it creates based on the following table. Alerts in the Azure portal are grouped by level so that you can manage similar alerts together and quickly identify alerts that require the greatest urgency.

| Level | Name | Description |
|:---|:---|:---|
| Sev 0 | Critical  | Loss of service or application availability or severe degradation of performance. Requires immediate attention. |
| Sev 1 | Error  | Degradation of performance or loss of availability of some aspect of an application or service. Requires attention but not immediate. |
| Sev 2 | Warning | A problem that doesn't include any current loss in availability or performance, although it has the potential to lead to more severe problems if unaddressed. |
| Sev 3 | Informational | Doesn't indicate a problem but provides interesting information to an operator, such as successful completion of a regular process. |
| Sev 4 | Verbose | Doesn't indicate a problem but provides detailed information that is verbose.

Assess the severity of the condition each rule is identifying to assign an appropriate level. Define the types of issues you assign to each severity level and your standard response to each in your alerts strategy.

## Action groups

Automated responses to alerts in Azure Monitor are defined in [action groups](action-groups.md). An action group is a collection of one or more notifications and actions that are fired when an alert is triggered. A single action group can be used with multiple alert rules and contain one or more of the following items:

- **Notifications**: Messages that notify operators and administrators that an alert was created.
- **Actions**: Automated processes that attempt to correct the detected issue.

## Notifications

Notifications are messages sent to one or more users to notify them that an alert has been created. Because a single action group can be used with multiple alert rules, you should design a set of action groups for different sets of administrators and users who will receive the same sets of alerts. Use any of the following types of notifications depending on the preferences of your operators and your organizational standards:

- Email
- SMS
- Push to Azure app
- Voice
- Email Azure Resource Manager role

## Actions

Actions are automated responses to an alert. You can use the available actions for any scenario that they support, but the following sections describe how each action is typically used.

### Automated remediation

Use the following actions to attempt automated remediation of the issue identified by the alert:

- **Automation runbook**: Start a built-in runbook or a custom runbook in Azure Automation. For example, built-in runbooks are available to perform such functions as restarting or scaling up a virtual machine.
- **Azure Functions**: Start an Azure function.

### ITSM and on-call management

- **IT service management (ITSM)**: Use the ITSM Connector to create work items in your ITSM tool based on alerts from Azure Monitor. You first configure the connector and then use the **ITSM** action in alert rules.
- **Webhooks**: Send the alert to an incident management system that supports webhooks such as PagerDuty and Splunk On-Call.
- **Secure webhook**: Integrate ITSM with Microsoft Entra authentication.

## Minimize alert activity

You want to create alerts for any important information in your environment. But you don't want to create excessive alerts and notifications for issues that don't warrant them. To minimize your alert activity to ensure that critical issues are surfaced while you don't generate excess information and notifications for administrators, follow these guidelines:

- See [Successful alerting strategy](/azure/cloud-adoption-framework/manage/monitor/alerting#successful-alerting-strategy) to determine whether a symptom is an appropriate candidate for alerting.
- Use the **Automatically resolve alerts** option in metric alert rules to resolve alerts when the condition has been corrected.
- Use the **Suppress alerts** option in log query alert rules to avoid creating multiple alerts for the same issue.
- Ensure that you use appropriate severity levels for alert rules so that high-priority issues can be analyzed together.
- Limit notifications for alerts with a severity of Warning or less because they don't require immediate attention.

## Create alert rules at scale

Typically, you'll want to alert on issues for all your critical Azure applications and resources. Use the following methods for creating alert rules at scale:

- Azure Monitor supports monitoring multiple resources of the same type with one metric alert rule for resources that exist in the same Azure region. For a list of Azure services that are currently supported for this feature, see [Supported resources for metric alerts in Azure Monitor](alerts-metric-near-real-time.md).
- For metric alert rules for Azure services that don't support multiple resources, use automation tools such as the Azure CLI and PowerShell with Resource Manager templates to create the same alert rule for multiple resources. For samples, see [Resource Manager template samples for metric alert rules in Azure Monitor](resource-manager-alerts-metric.md).
- To return data for multiple resources, write queries in log query alert rules. Use the **Split by dimensions** setting in the rule to create separate alerts for each resource.

> [!NOTE]
> Resource-centric log query alert rules currently in public preview allow you to use all resources in a subscription or resource group as a target for a log query alert.

## Next steps

[Optimize cost in Azure Monitor](../best-practices-cost.md).

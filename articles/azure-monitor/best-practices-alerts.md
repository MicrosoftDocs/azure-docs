---
title: Azure Monitor best practices - Alerts and automated actions
description: Recommendations for deployment of Azure Monitor alerts and automated actions.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 10/18/2021
ms.reviewer: bwren

---

# Deploying Azure Monitor - Alerts and automated actions
This article is part of the scenario [Recommendations for configuring Azure Monitor](best-practices.md). It provides guidance on alerts in Azure Monitor, which proactively notify you of important data or patterns identified in your monitoring data. You can view alerts in the Azure portal, have them send a proactive notification, or have them initiated some automated action to attempt to remediate the issue. 
## Alerting strategy
An alerting strategy defines your organizations standards for the types of alert rules that you'll create for different scenarios, how you'll categorize and manage alerts after they're created, and automated actions and notifications that you'll take in response to alerts. Defining an alert strategy assists you defining the configuration of alert rules including alert severity and action groups.

See [Successful alerting strategy](/azure/cloud-adoption-framework/manage/monitor/alerting#successful-alerting-strategy) for factors that you should consider in developing an alerting strategy.


## Alert rule types
Alerts in Azure Monitor are created by alert rules which you must create. See the monitoring documentation for each Azure service for guidance on recommended alert rules. Azure Monitor does not have any alert rules by default. 

There are multiple types of alert rules defined by the type of data that they use. Each has different capabilities and a different cost. The basic strategy you should follow is to use the alert rule type with the lowest cost that provides the logic that you require.

- [Activity log rules](alerts/activity-log-alerts.md). Creates an alert in response to a new Activity log event that matches specified conditions. There is no cost to these alerts so they should be your first choice, although the conditions they can detect are limited. See [Create, view, and manage activity log alerts by using Azure Monitor](alerts/alerts-activity-log.md) for details on creating an Activity log alert.
- [Metric alert rules](alerts/alerts-metric-overview.md). Creates an alert in response to one or more metric values exceeding a threshold. Metric alerts are stateful meaning that the alert will automatically close when the value drops below the threshold, and it will only send out notifications when the state changes. There is a cost to metric alerts, but this is often significantly less than log alerts. See [Create, view, and manage metric alerts using Azure Monitor](alerts/alerts-metric.md) for details on creating a metric alert.
- [Log alert rules](alerts/alerts-unified-log.md). Creates an alert when the results of a schedule query matches specified criteria. They are the most expensive of the alert rules, but they allow the most complex criteria. See [Create, view, and manage log alerts using Azure Monitor](alerts/alerts-log.md) for details on creating a log query alert.
- [Application alerts](app/monitor-web-app-availability.md) allow you to perform proactive performance and availability testing of your web application. You can perform a simple ping test at no cost, but there is a cost to more complex testing. See [Monitor the availability of any website](app/monitor-web-app-availability.md) for a description of the different tests and details on creating them.

## Alert severity
Each alert rule defines the severity of the alerts that it creates based on the table below. Alerts in the Azure portal are grouped by level so that you can manage similar alerts together and quickly identify those that require the greatest urgency.

| Level | Name | Description |
|:---|:---|:---|
| Sev 0 | Critical  | Loss of service or application availability or severe degradation of performance. Requires immediate attention. |
| Sev 1 | Error  | Degradation of performance or loss of availability of some aspect of an application or service. Requires attention but not immediate. |
| Sev 2 | Warning | A problem that does not include any current loss in availability or performance, although has the potential to lead to more sever problems if unaddressed. |
| Sev 3 | Informational | Does not indicate a problem but rather interesting information to an operator such as successful completion of a regular process. |
| Sev 4 | Verbose | Detailed information not useful 

You should assess the severity of the condition each rule is identifying to assign an appropriate level. The types of issues you assign to each severity level and your standard response to each should be defined in your alerts strategy. 

## Action groups
Automated responses to alerts in Azure Monitor are defined in [action groups](alerts/action-groups.md). An action group is a collection of one or more notifications and actions that are fired when an alert is triggered. A single action group can be used with multiple alert rules and contain one or more of the following:

- Notifications. Messages that notify operators and administrators that an alert was created.
- Actions. Automated processes that attempt to correct the detected issue, 
## Notifications
Notifications are messages sent to one or more users to notify them that an alert has been created. Since a single action group can be used with multiple alert rules, you should design a set of action groups for different sets of administrators and users who will receive the same sets of alerts. Use any of the following types of notifications depending on the preferences of your operators and your organizational standards.

- Email
- SMS
- Push to Azure app
- Voice
- Email Azure Resource Manager Role

## Actions
Actions are automated responses to an alert. You can use the available actions for any scenario that they support, but the following sections describe how each are typically used.

### Automated remediation
Use the following actions to attempt automated remediation of the issue identified by the alert. 

- Automation runbook - Start either a built-in or custom a runbook in Azure Automation. For example, built-in runbooks are available to perform such functions as restarting or scaling up a virtual machine.
- Azure Function - Start an Azure Function.


### ITSM and on-call management

- ITSM - Use the [ITSM connector]() to create work items in your ITSM tool based on alerts from Azure Monitor. You first configure the connector and then use the **ITSM** action in alert rules.
- Webhooks - Send the alert to an incident management system that supports webhooks such as PagerDuty and Splunk On-Call.
- Secure webhook - ITSM integration with Azure AD Authentication


## Minimizing alert activity
While you want to create alerts for any important information in your environment, you should ensure that you aren't creating excessive alerts and notifications for issues that don't warrant them. Use the following guidelines to minimize your alert activity to ensure that critical issues are surfaced while you don't generate excess information and notifications for administrators. 

- See [Successful alerting strategy](/azure/cloud-adoption-framework/manage/monitor/alerting#successful-alerting-strategy) for principles on determining whether a symptom is an appropriate candidate for alerting.
- Use the **Automatically resolve alerts** option in metric alert rules to resolve alerts when the condition has been corrected.
- Use **Suppress alerts** option in log query alert rules which prevents creating multiple alerts for the same issue.
- Ensure that you use appropriate severity levels for alert rules so that high priority issues can be analyzed together.
- Limit notifications for alerts with a severity of Warning or less since they don't require immediate attention.

## Create alert rules at scale
Since you'll typically want to alert on issues for all of your critical Azure applications and resources, you should leverage methods for creating alert rules at scale.

- Azure Monitor supports monitoring multiple resources of the same type with one metric alert rule for resources that exist in the same Azure region. See [Monitoring at scale using metric alerts in Azure Monitor](alerts/alerts-metric-overview.md#monitoring-at-scale-using-metric-alerts-in-azure-monitor) for a list of Azure services that are currently supported for this feature.
- For metric alert rules for Azure services that don't support multiple resources, leverage automation tools such as CLI and PowerShell with Resource Manager templates to create the same alert rule for multiple resources. See [Resource Manager template samples for metric alert rules in Azure Monitor](alerts/resource-manager-alerts-metric.md) for samples.
- Write queries in log query alert rules to return data for multiple resources. Use the **Split by dimensions** setting in the rule to create separate alerts for each resource.


> [!NOTE]
> Resource-centric log query alert rules which are currently in public preview allow you to use all resources in a subscription or resource group as a target for a log query alert. 

## Next steps

- [Define alerts and automated actions from Azure Monitor data](best-practices-alerts.md)

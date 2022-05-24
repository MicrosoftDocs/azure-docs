---
title: Overview of Azure Monitor Alerts
description: Learn about Azure Monitor alerts, alert rules, action processing rules, and action groups. You will learn how all of these work together to monitor your system and notify you if something is wrong.
author: AbbyMSFT
ms.author: abbyweisberg
ms.topic: overview 
ms.date: 04/26/2022
ms.custom: template-overview 
---
# What are Azure Monitor Alerts?

This article explains Azure Monitor alerts, alert rules, alert processing rules and action groups, and how they work together to monitor your system and notify you if something is wrong. 

Alerts help you detect and address issues before users notice them by proactively notifying you when Azure Monitor data indicates that there may be a problem with your infrastructure or application.

You can alert on any metric or log data source in the Azure Monitor data platform.

This diagram shows you how alerts work:

:::image type="content" source="media/alerts-overview/alerts-flow.png" alt-text="Graphic explaining Azure Monitor alerts.":::

- An **alert rule** monitors your telemetry and captures a signal that indicates that something is happening on a specified target. After capturing the signal, the alert rule checks to see if the signal meets the criteria of the condition. If the conditions are met, an alert is triggered, which initiates the associated action group and updates the state of the alert. An alert rule is made up of:
     - The resource(s) to be monitored.
     - The signal or telemetry from the resource
     - Conditions
If you are monitoring more than one resource, the condition is evaluated separately for each of the resources and alerts are fired for each resource separately.

    Use these links to learn how to [create a new alert rule](alerts-log.md#create-a-new-log-alert-rule-in-the-azure-portal), or [enable recommended out-of-the-box alert rules in the Azure portal (preview)](alerts-log.md#enable-recommended-out-of-the-box-alert-rules-in-the-azure-portal-preview). 

Once an alert is triggered, the alert is made up of:
 - An **alert processing rule** that allows you to apply processing on fired alerts. Alert processing rules modify the fired alerts as they are being fired. You can use alert processing rules to add or suppress action groups, apply filters or have the rule processed on a pre-defined schedule.
 - An **action group** can trigger notifications or an automated workflow to let users know that an alert has been triggered. Action groups can include:
     - Notification methods such as email, SMS, and push notifications.
     - Automation Runbooks
     - Azure functions
     - ITSM incidents
     - Logic Apps
     - Secure webhooks
     - Webhooks
     - Event hubs
- The **alert condition** is set by the system. When an alert fires, the alert’s monitor condition is set to ‘fired’, and when the underlying condition that caused the alert to fire clears, the monitor condition is set to ‘resolved’.
- The **user response** is set by the user and doesn’t change until the user changes it. 

You can see all all alert instances in all your Azure resources generated in the last 30 days on the **[Alerts page](alerts-page.md)** in the Azure portal. 

Learn how to create an alert rule [here](alerts-log.md).
## Types of alerts

There are four types of alerts:

|Alert type|Description|
|:---------|:---------|
|[Metric alerts](alerts-types.md#metric-alerts)|Metric alerts evaluate resource metrics at regular intervals. Metrics can be platform metrics, custom metrics, logs from Azure Monitor converted to metrics or Application Insights metrics. Metric alerts have several additional features (link), such as the ability to apply multiple conditions and dynamic thresholds.|
|[Log alerts](alerts-types.md#log-alerts)|Log alerts allow users to use a Log Analytics query to evaluate resource logs at a predefined frequency.|
|[Activity log alerts](alerts-types.md#activity-log-alerts)|Activity log alerts are triggered when a new activity log event occurs that matches the defined conditions.|
|[Smart detection alerts](alerts-types.md#smart-detection-alerts)|Smart detection on an Application Insights resource automatically warns you of potential performance problems and failure anomalies in your web application. You can migrate smart detection on your Application Insights resource to create alert rules for the different smart detection modules.|

## Choosing the right alert type

This table can help you decide when to use each alert type:


|Alert Type  |When to Use |
|---------|---------|---------|
|Metric alert    | Metric data is stored in the system already pre-computed. Metric alerts are useful when you want to be alerted about data that requires little or no manipulation. Metric alerts are less expensive than log alerts, so if the data you want to monitor is available in metric data, you would want to use this.        |
|Log alert     |  Log alerts allow you to perform advanced logic operations on your data. If the data you want to monitor is available in logs, or requires advanced logic, you can use the robust features of KQL for data manipulation using log alerts. Log alerts are more expensive than metric alerts.       |  
|Activity Log alert     |    Activity logs provide auditing of all actions that occurred on resources. Use activity log alerts if you want to be alerted when a specific event happens to a resource, for example, a restart, a shutdown, or the creation or deletion of a resource.     |

## Out-of-the-box alert rules

If you don't have alert rules defined for the selected resource, either individually or as part of a resource group or subscription, you can [enable recommended out-of-the-box alert rules in the Azure portal (preview)](alerts-log.md#enable-recommended-out-of-the-box-alert-rules-in-the-azure-portal-preview).

The system compiles a list of recommended alert rules based on:
- The resource provider’s knowledge of important signals and thresholds for monitoring the resource.
- Telemetry that tells us what customers commonly alert on for this resource.

> [!NOTE]
> The alert rule recommendations feature is currently in preview and is only enabled for VMs.
## Alerts and State

You can configure whether log or metric alerts are stateful or stateless. Activity log alerts are stateless. 
- Stateless alerts fire each time the condition is met, even if fired previously.
- Stateful alerts fire when the condition is met and then do not fire again or trigger any more actions until the conditions are resolved.  
For stateful alerts, the alert is considered resolved when:

|Alert type  |The alert is resolved when |
|---------|---------|
|Metric alerts|The alert condition is not met for three consecutive checks.|
|Log alerts|The alert condition isn't met for 30 minutes for a specific evaluation period (to account for log ingestion delay), and <br>the alert condition is not met for three consecutive checks.|

When the alert is considered resolved, the alert rule sends out a resolved notification using webhooks or email and the monitor state in the Azure portal is set to resolved.

## Manage your alerts programmatically

You can programmatically query for alerts using:
 - PowerShell (link)
 - CLI (link)
 - The Alert Management REST API (link) 
You can also use Resource Graphs (link). Resource graphs are good for managing alerts across multiple subscriptions. 

## Pricing
<!-- add your content here -->
## Next steps

- [Learn more about Smart Groups](./alerts-smartgroups-overview.md?toc=%2fazure%2fazure-monitor%2ftoc.json)
- [Learn about action groups](../alerts/action-groups.md)
- [Viewing your alert instances](./alerts-page.md)
- [Managing Smart Groups](./alerts-managing-smart-groups.md?toc=%2fazure%2fazure-monitor%2ftoc.json)
- [Learn more about Azure alerts pricing](https://azure.microsoft.com/pricing/details/monitor/)

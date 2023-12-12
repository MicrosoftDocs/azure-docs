---
title: Overview of Azure Monitor alerts
description: Learn about Azure Monitor alerts, alert rules, action processing rules, and action groups, and how they work together to monitor your system.
author: AbbyMSFT
ms.author: abbyweisberg
ms.topic: overview 
ms.date: 09/12/2023
ms.custom: template-overview 
ms.reviewer: harelbr
---

# What are Azure Monitor alerts?

Alerts help you detect and address issues before users notice them by proactively notifying you when Azure Monitor data indicates there might be a problem with your infrastructure or application.

You can alert on any metric or log data source in the Azure Monitor data platform.

This diagram shows you how alerts work.

:::image type="content" source="media/alerts-overview/alerts.png"  alt-text="Diagram that explains Azure Monitor alerts." lightbox="media/alerts-overview/alerts.png":::

An **alert rule** monitors your data and captures a signal that indicates something is happening on the specified resource. The alert rule captures the signal and checks to see if the signal meets the criteria of the condition.

An alert rule combines:
 - The resources to be monitored.
 - The signal or data from the resource.
 - Conditions.

An **alert** is triggered if the conditions of the alert rule are met. The alert initiates the associated action group and updates the state of the alert. If you're monitoring more than one resource, the alert rule condition is evaluated separately for each of the resources, and alerts are fired for each resource separately. 

Alerts are stored for 30 days and are deleted after the 30-day retention period. You can see all alert instances for all of your Azure resources on the [Alerts page](alerts-manage-alert-instances.md) in the Azure portal.

Alerts consist of:
 - **Action groups**: These groups can trigger notifications or an automated workflow to let users know that an alert has been triggered. Action groups can include:
     - Notification methods, such as email, SMS, and push notifications.
     - Automation runbooks.
     - Azure functions.
     - ITSM incidents.
     - Logic apps.
     - Secure webhooks.
     - Webhooks.
     - Event hubs.
- **Alert conditions**: These conditions are set by the system. When an alert fires, the alert condition is set to **fired**. After the underlying condition that caused the alert to fire clears, the alert condition is set to **resolved**.
- **User response**: The response is set by the user and doesn't change until the user changes it.
- **Alert processing rules**: You can use alert processing rules to make modifications to triggered alerts as they're being fired. You can use alert processing rules to add or suppress action groups, apply filters, or have the rule processed on a predefined schedule.
## Types of alerts

This table provides a brief description of each alert type. For more information about each alert type and how to choose which alert type best suits your needs, see [Types of Azure Monitor alerts](alerts-types.md).

|Alert type|Description|
|:---------|:---------|
|[Metric alerts](alerts-types.md#metric-alerts)|Metric alerts evaluate resource metrics at regular intervals. Metrics can be platform metrics, custom metrics, logs from Azure Monitor converted to metrics, or Application Insights metrics. Metric alerts can also apply multiple conditions and dynamic thresholds.|
|[Log alerts](alerts-types.md#log-alerts)|Log alerts allow users to use a Log Analytics query to evaluate resource logs at a predefined frequency.|
|[Activity log alerts](alerts-types.md#activity-log-alerts)|Activity log alerts are triggered when a new activity log event occurs that matches defined conditions. Resource Health alerts and Service Health alerts are activity log alerts that report on your service and resource health.|
|[Smart detection alerts](alerts-types.md#smart-detection-alerts)|Smart detection on an Application Insights resource automatically warns you of potential performance problems and failure anomalies in your web application. You can migrate smart detection on your Application Insights resource to create alert rules for the different smart detection modules.|
|[Prometheus alerts](alerts-types.md#prometheus-alerts)|Prometheus alerts are used for alerting on Prometheus metrics stored in [Azure Monitor managed services for Prometheus](../essentials/prometheus-metrics-overview.md). The alert rules are based on the PromQL open-source query language.|

## Alerts and state

Alerts can be stateful or stateless.
- Stateless alerts fire each time the condition is met, even if fired previously.
- Stateful alerts fire when the rule conditions are met, and will not fire again or trigger any more actions until the conditions are resolved.

Alerts are stored for 30 days and are deleted after the 30-day retention period.

### Stateless alerts
Stateless alerts fire each time the condition is met. The alert condition for all stateless alerts is always `fired`. 

- All activity log alerts are stateless.
- The frequency of notifications for stateless metric alerts differs based on the alert rule's configured frequency:
    - **Alert frequency of less than 5 minutes**: While the condition continues to be met, a notification is sent sometime between one and six minutes.
    - **Alert frequency of more than 5 minutes**: While the condition continues to be met, a notification is sent between the configured frequency and double the frequency. For example, for an alert rule with a frequency of 15 minutes, a notification is sent sometime between 15 to 30 minutes.

### Stateful alerts
Stateful alerts fire when the rule conditions are met, and will not fire again or trigger any more actions until the conditions are resolved. 
The alert condition for stateful alerts is `fired`, until it is considered resolved. When an alert is considered resolved, the alert rule sends out a resolved notification by using webhooks or email, and the alert condition is set to `resolved`.

For stateful alerts, while the alert itself is deleted after 30 days, the alert condition is stored until the alert is resolved, to prevent firing another alert, and so that notifications can be sent when the alert is resolved.

Stateful log alerts have these limitations:
- they can trigger up to 300 alerts per evaluation.
- you can have a maximum of 5000 alerts with the `fired` alert condition.

This table describes when a stateful alert is considered resolved:

|Alert type |The alert is resolved when |
|---------|---------|
|Metric alerts|The alert condition isn't met for three consecutive checks.|
|Log alerts| The alert condition isn't met for a specific time range. The time range differs based on the frequency of the alert:<ul> <li>**1 minute**: The alert condition isn't met for 10 minutes.</li> <li>**5 to 15 minutes**: The alert condition isn't met for three frequency periods.</li> <li>**15 minutes to 11 hours**: The alert condition isn't met for two frequency periods.</li> <li>**11 to 12 hours**: The alert condition isn't met for one frequency period.</li></ul>|

## Recommended alert rules

If you don't have alert rules defined for the selected resource, you can [enable recommended out-of-the-box alert rules in the Azure portal](alerts-manage-alert-rules.md#enable-recommended-alert-rules-in-the-azure-portal).

The system compiles a list of recommended alert rules based on:

- The resource provider’s knowledge of important signals and thresholds for monitoring the resource.
- Data that tells us what customers commonly alert on for this resource.

> [!NOTE]
> Recommended alert rules is enabled for:
> - Virtual machines
> - AKS resources
> - Log Analytics workspaces

## Azure role-based access control for alerts

You can only access, create, or manage alerts for resources for which you have permissions.

To create an alert rule, you must have:
 - Read permission on the target resource of the alert rule.
 - Write permission on the resource group in which the alert rule is created. If you're creating the alert rule from the Azure portal, the alert rule is created by default in the same resource group in which the target resource resides.
 - Read permission on any action group associated with the alert rule, if applicable.

These built-in Azure roles, supported at all Azure Resource Manager scopes, have permissions to and can access alerts information and create alert rules:
 - **Monitoring contributor**: A contributor can create alerts and use resources within their scope.
 - **Monitoring reader**: A reader can view alerts and read resources within their scope.

If the target action group or rule location is in a different scope than the two built-in roles, create a user with the appropriate permissions.

## Pricing
For information about pricing, see [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor/).

## Next steps

- [See your alert instances](./alerts-page.md)
- [Create a new alert rule](alerts-log.md)
- [Learn about action groups](../alerts/action-groups.md)
- [Learn about alert processing rules](alerts-action-rules.md)
- [Manage your alerts programmatically](alerts-manage-alert-instances.md#manage-your-alerts-programmatically)


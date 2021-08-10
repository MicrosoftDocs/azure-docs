---
title: Overview of alerting and notification monitoring in Azure
description: Overview of alerting in Azure Monitor
ms.topic: conceptual
ms.date: 02/14/2021

---

# Overview of alerts in Microsoft Azure 

This article describes what alerts are, their benefits, and how to get started using them.  

## What are alerts in Microsoft Azure?

Alerts proactively notify you when issues are found with your infrastructure or application using your monitoring data in Azure Monitor. They allow you to identify and address issues before the users of your system notice them. 

## Overview

The diagram below represents the flow of alerts. 

![Diagram of alert flow](media/alerts-overview/Azure-Monitor-Alerts.svg)

Alert rules are separated from alerts and the actions taken when an alert fires. The alert rule captures the target and criteria for alerting. The alert rule can be in an enabled or a disabled state. Alerts only fire when enabled. 

The following are key attributes of an alert rule:

**Target Resource** - Defines the scope and signals available for alerting. A target can be any Azure resource. Example targets:

- Virtual machines.
- Storage accounts.
- Log Analytics workspace.
- Application Insights. 

For certain resources (like virtual machines), you can specify multiple resources as the target of the alert rule.

**Signal** - Emitted by the target resource. Signals can be of the following types: metric, activity log, Application Insights, and log.

**Criteria** - A combination of signal and logic applied on a target resource. Examples: 

- Percentage CPU > 70%
- Server Response Time > 4 ms 
- Result count of a log query > 100

**Alert Name** - A specific name for the alert rule configured by the user.

**Alert Description** - A description for the alert rule configured by the user.

**Severity** - The severity of the alert after the criteria specified in the alert rule is met. Severity can range from 0 to 4.

- Sev 0 = Critical
- Sev 1 = Error
- Sev 2 = Warning
- Sev 3 = Informational
- Sev 4 = Verbose 

**Action** - A specific action taken when the alert is fired. For more information, see [Action Groups](../alerts/action-groups.md).

## What you can alert on

You can alert on metrics and logs, as described in [monitoring data sources](./../agents/data-sources.md). Signals include but aren't limited to:

- Metric values
- Log search queries
- Activity log events
- Health of the underlying Azure platform
- Tests for website availability

## Manage alerts

You can set the state of an alert to specify where it is in the resolution process. When the criteria specified in the alert rule is met, an alert is created or fired, and it has a status of *New*. You can change the status when you acknowledge an alert and when you close it. All state changes are stored in the history of the alert.

The following alert states are supported.

| State | Description |
|:---|:---|
| New | The issue has been detected and hasn't yet been reviewed. |
| Acknowledged | An administrator has reviewed the alert and started working on it. |
| Closed | The issue has been resolved. After an alert has been closed, you can reopen it by changing it to another state. |

*Alert state* is different and independent of the *monitor condition*. Alert state is set by the user. Monitor condition is set by the system. When an alert fires, the alert's monitor condition is set to *'fired'*, and when the underlying condition that caused the alert to fire clears, the monitor condition is set to *'resolved'*. 

The alert state isn't changed until the user changes it. Learn [how to change the state of your alerts and smart groups](./alerts-managing-alert-states.md?toc=%2fazure%2fazure-monitor%2ftoc.json).

## Alerts experience 
The default Alerts page provides a summary of alerts that are created within a particular time range. It displays the total alerts for each severity, with columns that identify the total number of alerts in each state for each severity. Select any of the severities to open the [All Alerts](#all-alerts-page) page filtered by that severity.

Instead, you can [programmatically enumerate the alert instances generated on your subscriptions by using REST APIs](#manage-your-alert-instances-programmatically).

> [!NOTE]
   >  You can only access alerts generated in the last 30 days.

You can change the subscriptions or filter parameters to update the page.

![Screenshot of Alerts page](media/alerts-overview/alerts-page.png)

You can filter this view by selecting values in the drop-down menus at the top of the page.

| Column | Description |
|:---|:---|
| Subscription | Select the Azure subscriptions for which you want to view the alerts. You can optionally choose to select all your subscriptions. Only alerts that you have access to in the selected subscriptions  are included in the view. |
| Resource group | Select a single resource group. Only alerts with targets in the selected resource group are included in the view. |
| Time range | Only alerts fired within the selected time range are included in the view. Supported values are the past hour, the past 24 hours, the past 7 days, and the past 30 days. |

Select the following values at the top of the Alerts page to open another page:

| Value | Description |
|:---|:---|
| Total alerts | The total number of alerts that match the selected criteria. Select this value to open the All Alerts view with no filter. |
| Smart groups | The total number of smart groups that were created from the alerts that match the selected criteria. Select this value to open the smart groups list in the All Alerts view.
| Total alert rules | The total number of alert rules in the selected subscription and resource group. Select this value to open the Rules view filtered on the selected subscription and resource group.


## Manage alert rules
To show the **Rules** page, select **Manage alert rules**. The Rules page is a single place for managing all alert rules across your Azure subscriptions. It lists all alert rules and can be sorted based on target resources, resource groups, rule name, or status. You can also edit, enable, or disable alert rules from this page.  

 ![Screenshot of Rules page](./media/alerts-overview/alerts-preview-rules.png)


## Create an alert rule
You can author alert rules in a consistent manner, whatever of the monitoring service or signal type.

> [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RE4tflw]

 
Here's how to create a new alert rule:
1. Pick the _target_ for the alert.
1. Select the _signal_ from the available signals for the target.
1. Specify the _logic_ to be applied to data from the signal.

This simplified authoring process no longer requires you to know the monitoring source or signals that are supported before selecting an Azure resource. The list of available signals is automatically filtered based on the target resource that you select. Also based on that target, you're guided through defining the logic of the alert rule automatically.  

You can learn more about how to create alert rules in [Create, view, and manage alerts using Azure Monitor](../alerts/alerts-metric.md).

Alerts are available across several Azure monitoring services. For information about how and when to use each of these services, see [Monitoring Azure applications and resources](../overview.md). 


## All Alerts page 
To see the **All Alerts** page, select **Total Alerts**. Here you can view a list of alerts created within the selected time. You can view either a list of the individual alerts or a list of the smart groups that contain the alerts. Select the banner at the top of the page to toggle between views.

![Screenshot of All Alerts page](media/alerts-overview/all-alerts-page.png)

You can filter the view by selecting the following values in the drop-down menus at the top of the page:

| Column | Description |
|:---|:---|
| Subscription | Select the Azure subscriptions for which you want to view the alerts. You can optionally choose to select all your subscriptions. Only alerts that you have access to in the selected subscriptions  are included in the view. |
| Resource group | Select a single resource group. Only alerts with targets in the selected resource group are included in the view. |
| Resource type | Select one or more resource types. Only alerts with targets of the selected type are included in the view. This column is only available after a resource group has been specified. |
| Resource | Select a resource. Only alerts with that resource as a target are included in the view. This column is only available after a resource type has been specified. |
| Severity | Select an alert severity, or select **All** to include alerts of all severities. |
| Monitor condition | Select a monitor condition, or select **All** to include alerts of all conditions. |
| Alert state | Select an alert state, or select **All** to include alerts of all states. |
| Monitor service | Select a service, or select **All** to include all services. Only alerts created by rules that use service as a target are included. |
| Time range | Only alerts fired within the selected time range are included in the view. Supported values are the past hour, the past 24 hours, the past 7 days, and the past 30 days. |

Select **Columns** at the top of the page to select which columns to show. 

## Alert details page
When you select an alert, this page provides details of the alert and enables you to change its state.

![Screenshot of Alert details page](media/alerts-overview/alert-detail2.png)

The Alert details page includes the following sections:

| Section | Description |
|:---|:---|
| Summary | Displays the properties and other significant information about the alert. |
| History | Lists each action taken by the alert and any changes made to the alert. Currently limited to state changes. |
| Diagnostics | Information about the smart group in which the alert is included. The *alert count* refers to the number of alerts that are included in the smart group. Includes other alerts in the same smart group that were created in the past 30 days, whatever of the time filter in the alerts list page. Select an alert to view its detail. |

## Azure role-based access control (Azure RBAC) for your alert instances

The consumption and management of alert instances requires the user to have the Azure built-in roles of either [monitoring contributor](../../role-based-access-control/built-in-roles.md#monitoring-contributor) or [monitoring reader](../../role-based-access-control/built-in-roles.md#monitoring-reader). These roles are supported at any Azure Resource Manager scope, from the subscription level to granular assignments at a resource level. For example, if a user only has monitoring contributor access for virtual machine `ContosoVM1`, that user can consume and manage only alerts generated on `ContosoVM1`.

## Manage your alert instances programmatically

You might want to query programmatically for alerts generated against your subscription. Queries might be to create custom views outside of the Azure portal, or to analyze your alerts to identify patterns and trends.

It is recommended you that you use [Azure Resource Graph](../../governance/resource-graph/overview.md) with the `AlertsManagementResources` schema for querying fired alerts. Resource Graph is recommended when you have to manage alerts generated across multiple subscriptions.

The following sample request to the Resource Graph REST API returns alerts within one subscription in the last day:

```json
{
  "subscriptions": [
    <subscriptionId>
  ],
  "query": "alertsmanagementresources | where properties.essentials.lastModifiedDateTime > ago(1d) | project alertInstanceId = id, parentRuleId = tolower(tostring(properties['essentials']['alertRule'])), sourceId = properties['essentials']['sourceCreatedId'], alertName = name, severity = properties.essentials.severity, status = properties.essentials.monitorCondition, state = properties.essentials.alertState, affectedResource = properties.essentials.targetResourceName, monitorService = properties.essentials.monitorService, signalType = properties.essentials.signalType, firedTime = properties['essentials']['startDateTime'], lastModifiedDate = properties.essentials.lastModifiedDateTime, lastModifiedBy = properties.essentials.lastModifiedUserName"
}
```

You can also see the result of this Resource Graph query in the portal with Azure Resource Graph Explorer: [portal.azure.com](https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/alertsmanagementresources%0A%7C%20where%20properties.essentials.lastModifiedDateTime%20%3E%20ago(1d)%0A%7C%20project%20alertInstanceId%20%3D%20id%2C%20parentRuleId%20%3D%20tolower(tostring(properties%5B'essentials'%5D%5B'alertRule'%5D))%2C%20sourceId%20%3D%20properties%5B'essentials'%5D%5B'sourceCreatedId'%5D%2C%20alertName%20%3D%20name%2C%20severity%20%3D%20properties.essentials.severity%2C%20status%20%3D%20properties.essentials.monitorCondition%2C%20state%20%3D%20properties.essentials.alertState%2C%20affectedResource%20%3D%20properties.essentials.targetResourceName%2C%20monitorService%20%3D%20properties.essentials.monitorService%2C%20signalType%20%3D%20properties.essentials.signalType%2C%20firedTime%20%3D%20properties%5B'essentials'%5D%5B'startDateTime'%5D%2C%20lastModifiedDate%20%3D%20properties.essentials.lastModifiedDateTime%2C%20lastModifiedBy%20%3D%20properties.essentials.lastModifiedUserName)

You can also use the [Alert Management REST API](/rest/api/monitor/alertsmanagement/alerts) in lower scale querying scenarios or to update fired alerts.

## Smart groups

Smart groups are aggregations of alerts based on machine learning algorithms, which can help reduce alert noise and aid in troubleshooting. [Learn more about Smart Groups](./alerts-smartgroups-overview.md?toc=%2fazure%2fazure-monitor%2ftoc.json) and [how to manage your smart groups](./alerts-managing-smart-groups.md?toc=%2fazure%2fazure-monitor%2ftoc.json).

## Next steps

- [Learn more about Smart Groups](./alerts-smartgroups-overview.md?toc=%2fazure%2fazure-monitor%2ftoc.json)
- [Learn about action groups](../alerts/action-groups.md)
- [Managing your alert instances in Azure](./alerts-managing-alert-instances.md?toc=%2fazure%2fazure-monitor%2ftoc.json)
- [Managing Smart Groups](./alerts-managing-smart-groups.md?toc=%2fazure%2fazure-monitor%2ftoc.json)
- [Learn more about Azure alerts pricing](https://azure.microsoft.com/pricing/details/monitor/)

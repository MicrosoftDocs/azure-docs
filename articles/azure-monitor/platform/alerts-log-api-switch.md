---
title: Switch to the new Azure Alerts API
description: Overview of legacy savedSearch based Log Analytics Alert API and process to switch alert rules to new ScheduledQueryRules API, with details addressing common customer concerns.
author: yanivlavi
ms.author: yalavi
ms.topic: conceptual
ms.date: 05/30/2019
ms.subservice: alerts
---
# Switch API preference for Log Alerts

> [!NOTE]
> Content stated applicable to users Azure public cloud only and **not** for Azure Government or Azure China cloud.  

> [!NOTE]
> Once a user chooses to switch preference to the new [scheduledQueryRules API](https://docs.microsoft.com/rest/api/monitor/scheduledqueryrules) it is not possible to revert to using of the older [legacy Log Analytics Alert API](api-alerts.md).

Until recently, you managed alert rules in the Microsoft Operations Management Suite portal. The new alerts experience was integrated with various services in Microsoft Azure including Log Analytics and we asked to [extend your alert rules from OMS portal to Azure](alerts-extend.md). But to ensure minimal disruption for customers, the process did not alter the programmatic interface for its consumption - [Log Analytics Alert API](api-alerts.md) based on SavedSearch.

But now you announce for Log Analytics alerting users a true Azure programmatic alternative, [Azure Monitor - ScheduledQueryRules API](https://docs.microsoft.com/rest/api/monitor/scheduledqueryrules), which is also reflective in your [Azure billing - for log alerts](alerts-unified-log.md#pricing-and-billing-of-log-alerts). To learn more on how to manage your log alerts using the API, see [Managing log alerts using Azure Resource Template](alerts-log.md#managing-log-alerts-using-azure-resource-template) and [Managing log alerts using PowerShell](alerts-log.md#managing-log-alerts-using-powershell).

## Benefits of switching to new Azure API

There are several advantages of creating and managing alerts using [scheduledQueryRules API](https://docs.microsoft.com/rest/api/monitor/scheduledqueryrules) over [legacy Log Analytics Alert API](api-alerts.md); we have listed some of the major ones below:

- Ability to [cross workspace log search](../log-query/cross-workspace-query.md) in alert rules and span up external resources like Log Analytics workspaces or even Application Insights apps
- When multiple fields used to Group in query, using [scheduledQueryRules API](https://docs.microsoft.com/rest/api/monitor/scheduledqueryrules) user can specify which field to aggregate-on in Azure portal
- Log alerts created using [scheduledQueryRules API](https://docs.microsoft.com/rest/api/monitor/scheduledqueryrules) can have period defined up to 48 hours and fetch data for longer period than before
- Create alert rules in one shot as a single resource without the need to create three levels of resources as with [legacy Log Analytics Alert API](api-alerts.md)
- Single programmatic interface for all variants of query-based log alerts in Azure -  new [scheduledQueryRules API](https://docs.microsoft.com/rest/api/monitor/scheduledqueryrules) can be used to manage rules for Log Analytics as well as Application Insights
- Manage your log alerts using [Powershell cmdlets](alerts-log.md#managing-log-alerts-using-powershell)
- All new log alert functionality and future development will be available only via the new [scheduledQueryRules API](https://docs.microsoft.com/rest/api/monitor/scheduledqueryrules)

## Process of switching from legacy Log Alerts API

Users are free to use either [legacy Log Analytics Alert API](api-alerts.md) or the new [scheduledQueryRules API](https://docs.microsoft.com/rest/api/monitor/scheduledqueryrules). Alert rules created by either API, will *be manageable by the same API only* - as well as from Azure portal. By default, Azure Monitor will continue to use [legacy Log Analytics Alert API](api-alerts.md) for creating any new alert rule from Azure portal for existing workspaces of Log Analytics. As [announced new Log workspace created on or after June 1, 2019](https://azure.microsoft.com/updates/switch-api-preference-log-alerts/) - will automatically use new [scheduledQueryRules API](https://docs.microsoft.com/rest/api/monitor/scheduledqueryrules) by default including in Azure portal.

The impacts of the switch of preference to scheduledQueryRules API are compiled below:

- All interactions done for managing log alerts via programmatic interfaces must now be done using [scheduledQueryRules](https://docs.microsoft.com/rest/api/monitor/scheduledqueryrules) instead. For more information, see, [sample use via Azure Resource Template](alerts-log.md#managing-log-alerts-using-azure-resource-template) and [sample use via PowerShell](alerts-log.md#managing-log-alerts-using-powershell)
- Any new log alert rule created in Azure portal, will be created using [scheduledQueryRules](https://docs.microsoft.com/rest/api/monitor/scheduledqueryrules) only and allow users to use the [additional functionality of new API](#benefits-of-switching-to-new-azure-api) via Azure portal as well
- Severity for log alert rules will shift from: *Critical, Warning & Informational*, to *Severity values of 0, 1 & 2*. Along with the option to create/update alert rules with severity 3 and 4 as well.

The process of moving alert rules from [legacy Log Analytics Alert API](api-alerts.md) does not involve changing your alert definition, query, or configuration in any way. Your alert rules and monitoring are unaffected and the alerts will not stop or be stalled, during or after the switch. The only changes are:

- A change in API preference and access to your rules via a new API.
- A modified alert rule resource URI containing the IDs used in the [legacy Log Analytics Alert API](api-alerts.md) instead of the alert rule name in this structure `<WorkspaceName>|<savedSearchId>|<scheduleId>|<ActionId>`. Display name of the alert rule will remain unchanged.

Any customer who wishes to switch voluntarily to the new [scheduledQueryRules](https://docs.microsoft.com/rest/api/monitor/scheduledqueryrules) and block usage from the [legacy Log Analytics Alert API](api-alerts.md); can do so by performing a PUT call on the below API to switch all alert rules associated with the specific Log Analytics workspace.

```
PUT /subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.OperationalInsights/workspaces/<workspaceName>/alertsversion?api-version=2017-04-26-preview
```

With request body containing the below JSON.

```json
{
    "scheduledQueryRulesEnabled" : true
}
```

The API can also be accessed from a PowerShell command line using [ARMClient](https://github.com/projectkudu/ARMClient), an open-source command-line tool that simplifies invoking the Azure Resource Manager API. As illustrated below, in sample PUT call using ARMclient tool to switch all alert rules associated with the specific Log Analytics workspace.

```powershell
$switchJSON = '{"scheduledQueryRulesEnabled": "true"}'
armclient PUT /subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.OperationalInsights/workspaces/<workspaceName>/alertsversion?api-version=2017-04-26-preview $switchJSON
```

If switch of all alert rules in the Log Analytics workspace to use new [scheduledQueryRules](https://docs.microsoft.com/rest/api/monitor/scheduledqueryrules) is successful, the following response will be provided.

```json
{
    "version": 2,
    "scheduledQueryRulesEnabled" : true
}
```

Users can also check the current status of your Log Analytics workspace and see if it has or has not been switched to use [scheduledQueryRules](https://docs.microsoft.com/rest/api/monitor/scheduledqueryrules) only. To check, users can perform a GET call on the below API.

```
GET /subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.OperationalInsights/workspaces/<workspaceName>/alertsversion?api-version=2017-04-26-preview
```

To execute the above in using PowerShell command line using [ARMClient](https://github.com/projectkudu/ARMClient) tool, see the sample below.

```powershell
armclient GET /subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.OperationalInsights/workspaces/<workspaceName>/alertsversion?api-version=2017-04-26-preview
```

If the specified Log Analytics workspace has been switched to use [scheduledQueryRules](https://docs.microsoft.com/rest/api/monitor/scheduledqueryrules) only; then the response JSON will be as listed below.

```json
{
    "version": 2,
    "scheduledQueryRulesEnabled" : true
}
```
Else, if the specified Log Analytic workspace has not yet been switched to use [scheduledQueryRules](https://docs.microsoft.com/rest/api/monitor/scheduledqueryrules) only; then the response JSON will be as listed below.

```json
{
    "version": 2,
    "scheduledQueryRulesEnabled" : false
}
```

## Next steps

- Learn about the [Azure Monitor - Log Alerts](alerts-unified-log.md).
- Learn how to create [log alerts in Azure Alerts](alerts-log.md).
- Learn more about the [Azure Alerts experience](../../azure-monitor/platform/alerts-overview.md).

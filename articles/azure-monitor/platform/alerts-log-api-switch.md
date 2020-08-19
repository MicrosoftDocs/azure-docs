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
> Once a user chooses to switch preference to the new [scheduledQueryRules API](/rest/api/monitor/scheduledqueryrules) it is not possible to revert to using of the older [legacy Log Analytics Alert API](api-alerts.md).

In the past, users used the [legacy Log Analytics Alert API](api-alerts.md) based on SavedSearch to manage the log alert rules. Today all workspaces are created with [Azure Monitor - ScheduledQueryRules API](/rest/api/monitor/scheduledqueryrules). In this article, we will describe the benefits for that process, and the process of switching from the legacy Log Analytics Alert API to the newer API.

## Benefits of switching to new API

- Single template for creation of alert rules (perviously needed three separate templates).
- Single API for both Log Analytics workspaces and/or Application Insights resources.
- [Powershell cmdlets support](alerts-log.md#managing-log-alerts-using-powershell).
- Alignment of severities with all other alert types.
- Ability to create [cross workspace log alert](../log-query/cross-workspace-query.md) that span several external resources like Log Analytics workspaces and/or Application Insights resources.
- Users can specify dimensions to split the alert by using the 'Aggregate On' parameter.
- Log alerts have extended period of up to 2 days of data (perviously limited to 1 day).

## Impact of the switching to new API

- All new rules must be created/edited with the new API. See [sample use via Azure Resource Template](alerts-log.md#managing-log-alerts-using-azure-resource-template) and [sample use via PowerShell](alerts-log.md#managing-log-alerts-using-powershell).
- As rules become Azure Resource Manager tracked resources in the new API and must be unique, rules resource ID will change to this structure: '<WorkspaceName>|<savedSearchId>|<scheduleId>|<ActionId>'. Display names of the alert rule will remain unchanged.
- Template structure will be aligned to new API template.

## Process of switching from legacy Log Alerts API

The process of switching does is not interactive and does not require manual steps in most cases. Your alerts will not stop or be stalled, during or after the switch.
Perform this call to switch all alert rules associated with the specific Log Analytics workspace:

```
PUT /subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.OperationalInsights/workspaces/<workspaceName>/alertsversion?api-version=2017-04-26-preview
```

With request body containing the below JSON:

```json
{
    "scheduledQueryRulesEnabled" : true
}
```

Here is an example of using PowerShell command line using [ARMClient](https://github.com/projectkudu/ARMClient), an open-source command-line tool, to simplifies invoking the Azure Resource Manager API. Perform this commands to switch all alert rules associated with the specific Log Analytics workspace:

```powershell
$switchJSON = '{"scheduledQueryRulesEnabled": "true"}'
armclient PUT /subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.OperationalInsights/workspaces/<workspaceName>/alertsversion?api-version=2017-04-26-preview $switchJSON
```

If the switch is successful, you will receive the following response:

```json
{
    "version": 2,
    "scheduledQueryRulesEnabled" : true
}
```

## Check switching status of workspace

You can also use this API call to check the switch status:

```
GET /subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.OperationalInsights/workspaces/<workspaceName>/alertsversion?api-version=2017-04-26-preview
```

You can also use [ARMClient](https://github.com/projectkudu/ARMClient) tool:

```powershell
armclient GET /subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.OperationalInsights/workspaces/<workspaceName>/alertsversion?api-version=2017-04-26-preview
```

If the specified Log Analytics workspace has been switched to use [scheduledQueryRules](/rest/api/monitor/scheduledqueryrules) only; then the response JSON will be as listed below.

```json
{
    "version": 2,
    "scheduledQueryRulesEnabled" : true
}
```
Else, if the specified Log Analytic workspace has not yet been switched to use [scheduledQueryRules](/rest/api/monitor/scheduledqueryrules) only; then the response JSON will be as listed below.

```json
{
    "version": 2,
    "scheduledQueryRulesEnabled" : false
}
```

## Next steps

- Learn about the [Azure Monitor - Log Alerts](alerts-unified-log.md).
- Learn how to [manage your log alerts using the API](alerts-log.md#managing-log-alerts-using-azure-resource-template).
- Learn how to [manage log alerts using PowerShell](alerts-log.md#managing-log-alerts-using-powershell).
- Learn more about the [Azure Alerts experience](./alerts-overview.md).

---
title: Upgrade legacy rules management to the current Azure Monitor Log Alerts API
description: Learn how to switch to the log alerts management to ScheduledQueryRules API
ms.topic: conceptual
ms.date: 07/09/2023
---
# Upgrade to the Log Alerts API from the legacy Log Analytics alerts API

> [!IMPORTANT]
> As [announced](https://azure.microsoft.com/updates/switch-api-preference-log-alerts/), the Log Analytics alert API will be retired on October 1, 2025. You must transition to using the Scheduled Query Rules API for log alerts by that date.
> Log Analytics workspaces created after June 1, 2019 use the [scheduledQueryRules API](/rest/api/monitor/scheduledqueryrule-2021-08-01/scheduled-query-rules) to manage alert rules. [Switch to the current API](./alerts-log-api-switch.md) in older workspaces to take advantage of Azure Monitor scheduledQueryRules [benefits](./alerts-log-api-switch.md#benefits). 
> Once you migrate rules to the [scheduledQueryRules API](/rest/api/monitor/scheduledqueryrule-2021-08-01/scheduled-query-rules), you cannot revert back to the older [legacy Log Analytics Alert API](/azure/azure-monitor/alerts/api-alerts).

In the past, users used the [legacy Log Analytics Alert API](/azure/azure-monitor/alerts/api-alerts) to manage log alert rules. Currently workspaces use [ScheduledQueryRules API](/rest/api/monitor/scheduledqueryrule-2021-08-01/scheduled-query-rules) for new rules. This article describes the benefits and the process of switching legacy log alert rules management from the legacy API to the current API.

## Benefits

- Manage all log rules in one API.
- Single template for creation of alert rules (previously needed three separate templates).
- Single API for all Azure resources log alerting.
- Support for stateful (preview) and 1-minute log alerts.
- [PowerShell cmdlets](/azure/azure-monitor/alerts/alerts-manage-alerts-previous-version#manage-log-alerts-by-using-powershell) and [Azure CLI](/azure/azure-monitor/alerts/alerts-log#manage-log-alerts-using-cli) support for switched rules.
- Alignment of severities with all other alert types and newer rules.
- Ability to create a [cross workspace log alert](/azure/azure-monitor/logs/cross-workspace-query) that spans several external resources like Log Analytics workspaces or Application Insights resources for switched rules.
- Users can specify dimensions to split the alerts for switched rules.
- Log alerts have extended period of up to two days of data (previously limited to one day) for switched rules.

## Impact

- All switched rules must be created/edited with the current API. See [sample use via Azure Resource Template](/azure/azure-monitor/alerts/alerts-log-create-templates) and [sample use via PowerShell](/azure/azure-monitor/alerts/alerts-manage-alerts-previous-version#manage-log-alerts-by-using-powershell).
- As rules become Azure Resource Manager tracked resources in the current API and must be unique, rules resource ID will change to this structure: `<WorkspaceName>|<savedSearchId>|<scheduleId>|<ActionId>`. Display names of the alert rule will remain unchanged. 
## Process

View workspaces to upgrade using this [Azure Resource Graph Explorer query](https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/resources%0A%7C%20where%20type%20%3D~%20%22microsoft.insights%2Fscheduledqueryrules%22%0A%7C%20where%20properties.isLegacyLogAnalyticsRule%20%3D%3D%20true%0A%7C%20distinct%20tolower%28properties.scopes%5B0%5D%29). Open the [link](https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/resources%0A%7C%20where%20type%20%3D~%20%22microsoft.insights%2Fscheduledqueryrules%22%0A%7C%20where%20properties.isLegacyLogAnalyticsRule%20%3D%3D%20true%0A%7C%20distinct%20tolower%28properties.scopes%5B0%5D%29), select all available subscriptions, and run the query. 

The process of switching isn't interactive and doesn't require manual steps, in most cases. Your alert rules aren't stopped or stalled, during or after the switch.
Do this call to switch all alert rules associated with each of the Log Analytics workspaces:

```
PUT /subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.OperationalInsights/workspaces/<workspaceName>/alertsversion?api-version=2017-04-26-preview
```

With request body containing the below JSON:

```json
{
    "scheduledQueryRulesEnabled" : true
}
```

Here is an example of using [ARMClient](https://github.com/projectkudu/ARMClient), an open-source command-line tool, that simplifies invoking the above API call:

```powershell
$switchJSON = '{"scheduledQueryRulesEnabled": true}'
armclient PUT /subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.OperationalInsights/workspaces/<workspaceName>/alertsversion?api-version=2017-04-26-preview $switchJSON
```

You can also use [Azure CLI](/cli/azure/reference-index#az-rest) tool:

```bash
az rest --method put --url /subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.OperationalInsights/workspaces/<workspaceName>/alertsversion?api-version=2017-04-26-preview --body "{\"scheduledQueryRulesEnabled\" : true}"
```

If the switch is successful, the response is:

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

You can also use [Azure CLI](/cli/azure/reference-index#az-rest) tool:

```bash
az rest --method get --url /subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.OperationalInsights/workspaces/<workspaceName>/alertsversion?api-version=2017-04-26-preview
```

If the Log Analytics workspace was switched to [scheduledQueryRules API](/rest/api/monitor/scheduledqueryrule-2021-08-01/scheduled-query-rules), the response is:

```json
{
    "version": 2,
    "scheduledQueryRulesEnabled" : true
}
```
If the Log Analytics workspace wasn't switched, the response is:

```json
{
    "version": 2,
    "scheduledQueryRulesEnabled" : false
}
```

## Next steps

- Learn about the [Azure Monitor - Log Alerts](/azure/azure-monitor/alerts/alerts-types).
- Learn how to [manage your log alerts using the API](/azure/azure-monitor/alerts/alerts-log-create-templates).
- Learn how to [manage log alerts using PowerShell](/azure/azure-monitor/alerts/alerts-manage-alerts-previous-version#manage-log-alerts-by-using-powershell).
- Learn more about the [Azure Alerts experience](/azure/azure-monitor/alerts/alerts-overview).

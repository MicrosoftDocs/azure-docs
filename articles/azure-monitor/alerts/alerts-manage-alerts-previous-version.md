---
title: View and manage log alert rules created in previous versions| Microsoft Docs
description: Use the Azure Monitor portal to manage log alert rules created in earlier versions.
ms.author: abbyweisberg
ms.topic: conceptual
ms.date: 06/20/2023
ms.custom: devx-track-azurepowershell
ms.reviewer: harelbr
---
# Manage alert rules created in previous versions

This article describes the process of managing alert rules created in the previous UI or by using API version `2018-04-16` or earlier. Alert rules created in the latest UI are viewed and managed in the new UI, as described in [Create, view, and manage log alerts by using Azure Monitor](alerts-log.md).


## Changes to the log alert rule creation experience

The current alert rule wizard is different from the earlier experience:

- Previously, search results were included in the payload of the triggered alert and its associated notifications. The email included only 10 rows from the unfiltered results while the webhook payload contained 1,000 unfiltered results. To get detailed context information about the alert so that you can decide on the appropriate action:
    - We recommend using [dimensions](alerts-types.md#narrow-the-target-using-dimensions). Dimensions provide the column value that fired the alert, which gives you context for why the alert fired and how to fix the issue.
    - When you need to investigate in the logs, use the link in the alert to the search results in logs.
    - If you need the raw search results or for any other advanced customizations, [use Azure Logic Apps](alerts-logic-apps.md).
- The new alert rule wizard doesn't support customization of the JSON payload.
    - Use custom properties in the [new API](/rest/api/monitor/scheduledqueryrule-2021-08-01/scheduled-query-rules/create-or-update#actions) to add static parameters and associated values to the webhook actions triggered by the alert.
    - For more advanced customizations, [use Azure Logic Apps](alerts-logic-apps.md).
- The new alert rule wizard doesn't support customization of the email subject.
    - Customers often use the custom email subject to indicate the resource on which the alert fired, instead of using the Log Analytics workspace. Use the [new API](/rest/api/monitor/scheduledqueryrule-2021-08-01/scheduled-query-rules/create-or-update#actions) to trigger an alert of the desired resource by using the resource ID column.
    - For more advanced customizations, [use Azure Logic Apps](alerts-logic-apps.md).

## Manage alert rules created in previous versions in the Azure portal
1. In the [Azure portal](https://portal.azure.com/), select the resource you want.
1. Under **Monitoring**, select **Alerts**.
1. On the top bar, select **Alert rules**.
1. Select the alert rule that you want to edit.
1. In the **Condition** section, select the condition.
1. The **Configure signal logic** pane opens with historical data for the query that appears as a graph. You can change the **Time range** of the chart to display data from the last six hours to last week.
    If your query results contain summarized data or specific columns without the time column, the chart shows a single value.
   
    :::image type="content" source="media/alerts-log/alerts-edit-alerts-rule.png" lightbox="media/alerts-log/alerts-edit-alerts-rule.png" alt-text="Screenshot that shows the Configure signal logic pane.":::

1. Edit the alert rule conditions by using these sections:
    - **Search query**: In this section, you can modify your query.
    - **Alert logic**: Log alerts can be based on two types of [measures](./alerts-unified-log.md#measure):
        1. **Number of results**: Count of records returned by the query.
        1. **Metric measurement**: **Aggregate value** is calculated by using `summarize` grouped by the expressions chosen and the [bin()](/azure/data-explorer/kusto/query/binfunction) selection. For example:
            ```Kusto
            // Reported errors
            union Event, Syslog // Event table stores Windows event records, Syslog stores Linux records
            | where EventLevelName == "Error" // EventLevelName is used in the Event (Windows) records
            or SeverityLevel== "err" // SeverityLevel is used in Syslog (Linux) records
            | summarize AggregatedValue = count() by Computer, bin(TimeGenerated, 15m)
            ```
        For metric measurements alert logic, you can specify how to [split the alerts by dimensions](./alerts-unified-log.md#split-by-alert-dimensions) by using the **Aggregate on** option. The row grouping expression must be unique and sorted.
        
        The [bin()](/azure/data-explorer/kusto/query/binfunction) function can result in uneven time intervals, so the alert service automatically converts the [bin()](/azure/data-explorer/kusto/query/binfunction) function to a [binat()](/azure/data-explorer/kusto/query/binatfunction) function with appropriate time at runtime to ensure results with a fixed point.
        
        > [!NOTE]
        > The **Split by alert dimensions** option is only available for the current scheduledQueryRules API. If you use the legacy [Log Analytics Alert API](./api-alerts.md), you'll need to switch. [Learn more about switching](./alerts-log-api-switch.md). Resource-centric alerting at scale is only supported in the API version `2021-08-01` and later.
        
        :::image type="content" source="media/alerts-log/aggregate-on.png" lightbox="media/alerts-log/aggregate-on.png" alt-text="Screenshot that shows Aggregate on.":::

    - **Period**: Choose the time range over which to assess the specified condition by using the [Period](./alerts-unified-log.md#query-time-range) option.

1. When you're finished editing the conditions, select **Done**.
1. Use the preview data to set the [Operator, Threshold value](./alerts-unified-log.md#threshold-and-operator), and [Frequency](./alerts-unified-log.md#frequency).
1. Set the [number of violations to trigger an alert](./alerts-unified-log.md#number-of-violations-to-trigger-alert) by using **Total** or **Consecutive breaches**.
1. Select **Done**.
1. You can edit the rule **Description** and **Severity**. These details are used in all alert actions. You can also choose to not activate the alert rule on creation by selecting **Enable rule upon creation**.
1. Use the [Suppress Alerts](./alerts-unified-log.md#state-and-resolving-alerts) option if you want to suppress rule actions for a specified time after an alert is fired. The rule will still run and create alerts, but actions won't be triggered to prevent noise. The **Mute actions** value must be greater than the frequency of the alert to be effective.
   <!-- convertborder later -->
   :::image type="content" source="media/alerts-log/AlertsPreviewSuppress.png" lightbox="media/alerts-log/AlertsPreviewSuppress.png" alt-text="Screenshot that shows the Alert Details pane." border="false":::
1. To make alerts stateful, select **Automatically resolve alerts (preview)**.
1. Specify if the alert rule should trigger one or more [action groups](./action-groups.md) when the alert condition is met.
    > [!NOTE]
    > * For limits on the actions that can be performed, see [Azure subscription service limits](../../azure-resource-manager/management/azure-subscription-service-limits.md).
    > * Search results were included in the payload of the triggered alert and its associated notifications. **Notice that**: The **email** included only **10 rows** from the unfiltered results while the **webhook payload** contained **1,000 unfiltered results**.
1. (Optional) Customize actions in log alert rules:
    - **Custom email subject**: Overrides the *email subject* of email actions. You can't modify the body of the mail and this field *isn't for email addresses*.
    - **Include custom Json payload for webhook**: Overrides the webhook JSON used by action groups, assuming that the action group contains a webhook action. Learn more about [webhook actions for log alerts](./alerts-log-webhook.md).
    <!-- convertborder later -->
    :::image type="content" source="media/alerts-log/AlertsPreviewOverrideLog.png" lightbox="media/alerts-log/AlertsPreviewOverrideLog.png" alt-text="Screenshot that shows Action overrides for log alerts." border="false":::
1. After you've finished editing all the alert rule options, select **Save**.

## Manage log alerts using PowerShell

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

Use the following PowerShell cmdlets to manage rules with the [Scheduled Query Rules API](/rest/api/monitor/scheduledqueryrule-2018-04-16/scheduled-query-rules):

- [New-AzScheduledQueryRule](/powershell/module/az.monitor/new-azscheduledqueryrule): PowerShell cmdlet to create a new log alert rule.
- [Set-AzScheduledQueryRule](/powershell/module/az.monitor/set-azscheduledqueryrule): PowerShell cmdlet to update an existing log alert rule.
- [New-AzScheduledQueryRuleSource](/powershell/module/az.monitor/new-azscheduledqueryrulesource): PowerShell cmdlet to create or update the object that specifies source parameters for a log alert. Used as input by the [New-AzScheduledQueryRule](/powershell/module/az.monitor/new-azscheduledqueryrule) and [Set-AzScheduledQueryRule](/powershell/module/az.monitor/set-azscheduledqueryrule) cmdlets.
- [New-AzScheduledQueryRuleSchedule](/powershell/module/az.monitor/new-azscheduledqueryruleschedule): PowerShell cmdlet to create or update the object that specifies schedule parameters for a log alert. Used as input by the [New-AzScheduledQueryRule](/powershell/module/az.monitor/new-azscheduledqueryrule) and [Set-AzScheduledQueryRule](/powershell/module/az.monitor/set-azscheduledqueryrule) cmdlets.
- [New-AzScheduledQueryRuleAlertingAction](/powershell/module/az.monitor/new-azscheduledqueryrulealertingaction): PowerShell cmdlet to create or update the object that specifies action parameters for a log alert. Used as input by the [New-AzScheduledQueryRule](/powershell/module/az.monitor/new-azscheduledqueryrule) and [Set-AzScheduledQueryRule](/powershell/module/az.monitor/set-azscheduledqueryrule) cmdlets.
- [New-AzScheduledQueryRuleAznsActionGroup](/powershell/module/az.monitor/new-azscheduledqueryruleaznsactiongroup): PowerShell cmdlet to create or update the object that specifies action group parameters for a log alert. Used as input by the [New-AzScheduledQueryRuleAlertingAction](/powershell/module/az.monitor/new-azscheduledqueryrulealertingaction) cmdlet.
- [New-AzScheduledQueryRuleTriggerCondition](/powershell/module/az.monitor/new-azscheduledqueryruletriggercondition): PowerShell cmdlet to create or update the object that specifies trigger condition parameters for a log alert. Used as input by the [New-AzScheduledQueryRuleAlertingAction](/powershell/module/az.monitor/new-azscheduledqueryrulealertingaction) cmdlet.
- [New-AzScheduledQueryRuleLogMetricTrigger](/powershell/module/az.monitor/new-azscheduledqueryrulelogmetrictrigger): PowerShell cmdlet to create or update the object that specifies metric trigger condition parameters for a metric measurement log alert. Used as input by the [New-AzScheduledQueryRuleTriggerCondition](/powershell/module/az.monitor/new-azscheduledqueryruletriggercondition) cmdlet.
- [Get-AzScheduledQueryRule](/powershell/module/az.monitor/get-azscheduledqueryrule): PowerShell cmdlet to list existing log alert rules or a specific log alert rule.
- [Update-AzScheduledQueryRule](/powershell/module/az.monitor/update-azscheduledqueryrule): PowerShell cmdlet to enable or disable a log alert rule.
- [Remove-AzScheduledQueryRule](/powershell/module/az.monitor/remove-azscheduledqueryrule): PowerShell cmdlet to delete an existing log alert rule.

> [!NOTE]
> The `ScheduledQueryRules` PowerShell cmdlets can only manage rules created in [this version of the Scheduled Query Rules API](/rest/api/monitor/scheduledqueryrule-2018-04-16/scheduled-query-rules). Log alert rules created by using the legacy [Log Analytics Alert API](./api-alerts.md) can only be managed by using PowerShell after you [switch to the Scheduled Query Rules API](./alerts-log-api-switch.md).

Example steps for creating a log alert rule by using PowerShell:

```powershell
$source = New-AzScheduledQueryRuleSource -Query 'Heartbeat | summarize AggregatedValue = count() by bin(TimeGenerated, 5m), _ResourceId' -DataSourceId "/subscriptions/a123d7efg-123c-1234-5678-a12bc3defgh4/resourceGroups/contosoRG/providers/microsoft.OperationalInsights/workspaces/servicews"
$schedule = New-AzScheduledQueryRuleSchedule -FrequencyInMinutes 15 -TimeWindowInMinutes 30
$metricTrigger = New-AzScheduledQueryRuleLogMetricTrigger -ThresholdOperator "GreaterThan" -Threshold 2 -MetricTriggerType "Consecutive" -MetricColumn "_ResourceId"
$triggerCondition = New-AzScheduledQueryRuleTriggerCondition -ThresholdOperator "LessThan" -Threshold 5 -MetricTrigger $metricTrigger
$aznsActionGroup = New-AzScheduledQueryRuleAznsActionGroup -ActionGroup "/subscriptions/a123d7efg-123c-1234-5678-a12bc3defgh4/resourceGroups/contosoRG/providers/microsoft.insights/actiongroups/sampleAG" -EmailSubject "Custom email subject" -CustomWebhookPayload "{ `"alert`":`"#alertrulename`", `"IncludeSearchResults`":true }"
$alertingAction = New-AzScheduledQueryRuleAlertingAction -AznsAction $aznsActionGroup -Severity "3" -Trigger $triggerCondition
New-AzScheduledQueryRule -ResourceGroupName "contosoRG" -Location "Region Name for your Application Insights App or Log Analytics Workspace" -Action $alertingAction -Enabled $true -Description "Alert description" -Schedule $schedule -Source $source -Name "Alert Name"
```

Example steps for creating a log alert rule by using PowerShell with cross-resource queries:

```powershell
$authorized = @ ("/subscriptions/a123d7efg-123c-1234-5678-a12bc3defgh4/resourceGroups/contosoRG/providers/microsoft.OperationalInsights/workspaces/servicewsCrossExample", "/subscriptions/a123d7efg-123c-1234-5678-a12bc3defgh4/resourceGroups/contosoRG/providers/microsoft.insights/components/serviceAppInsights")
$source = New-AzScheduledQueryRuleSource -Query 'Heartbeat | summarize AggregatedValue = count() by bin(TimeGenerated, 5m), _ResourceId' -DataSourceId "/subscriptions/a123d7efg-123c-1234-5678-a12bc3defgh4/resourceGroups/contosoRG/providers/microsoft.OperationalInsights/workspaces/servicews" -AuthorizedResource $authorized
$schedule = New-AzScheduledQueryRuleSchedule -FrequencyInMinutes 15 -TimeWindowInMinutes 30
$metricTrigger = New-AzScheduledQueryRuleLogMetricTrigger -ThresholdOperator "GreaterThan" -Threshold 2 -MetricTriggerType "Consecutive" -MetricColumn "_ResourceId"
$triggerCondition = New-AzScheduledQueryRuleTriggerCondition -ThresholdOperator "LessThan" -Threshold 5 -MetricTrigger $metricTrigger
$aznsActionGroup = New-AzScheduledQueryRuleAznsActionGroup -ActionGroup "/subscriptions/a123d7efg-123c-1234-5678-a12bc3defgh4/resourceGroups/contosoRG/providers/microsoft.insights/actiongroups/sampleAG" -EmailSubject "Custom email subject" -CustomWebhookPayload "{ `"alert`":`"#alertrulename`", `"IncludeSearchResults`":true }"
$alertingAction = New-AzScheduledQueryRuleAlertingAction -AznsAction $aznsActionGroup -Severity "3" -Trigger $triggerCondition
New-AzScheduledQueryRule -ResourceGroupName "contosoRG" -Location "Region Name for your Application Insights App or Log Analytics Workspace" -Action $alertingAction -Enabled $true -Description "Alert description" -Schedule $schedule -Source $source -Name "Alert Name" 
```

You can also create the log alert by using [a template and parameters](./alerts-log-create-templates.md) files using PowerShell:

```powershell
Connect-AzAccount
Select-AzSubscription -SubscriptionName <yourSubscriptionName>
New-AzResourceGroupDeployment -Name AlertDeployment -ResourceGroupName ResourceGroupofTargetResource `
  -TemplateFile mylogalerttemplate.json -TemplateParameterFile mylogalerttemplate.parameters.json
```

## Next steps

* Learn about [log alerts](./alerts-unified-log.md).
* Create log alerts by using [Azure Resource Manager templates](./alerts-log-create-templates.md).
* Understand [webhook actions for log alerts](./alerts-log-webhook.md).
* Learn more about [log queries](../logs/log-query-overview.md).

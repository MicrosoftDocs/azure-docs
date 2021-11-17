---
title: Create, view, and manage log alert rules Using Azure Monitor | Microsoft Docs
description: Use Azure Monitor to create, view, and manage log alert rules
author: AbbyMSFT
ms.author: abbyweisberg
ms.topic: conceptual
ms.date: 11/09/2021 
ms.custom: devx-track-azurepowershell, devx-track-azurecli
---
# Create, view, and manage log alerts using Azure Monitor

## Overview

This article shows you how to create and manage log alerts. Azure Monitor log alerts allow users to use a [Log Analytics](../logs/log-analytics-tutorial.md) query to evaluate resource logs at a set frequency and fire an alert based on the results. Rules can trigger one or more actions using [Action Groups](./action-groups.md). [Learn more about functionality and terminology of log alerts](./alerts-unified-log.md).

 Alert rules are defined by three components:
- Target: A specific Azure resource to monitor.
- Criteria: Logic to evaluate. If met, the alert fires.  
- Action: Notifications or automation - email, SMS, webhook, and so on.
You can also [create log alert rules using Azure Resource Manager templates](../alerts/alerts-log-create-templates.md).

> [!NOTE]
> [This page](alerts-unified-log.md) explains all of the settings used to set up a log alert rule.
## Create a log alert rule in the Azure portal
> [!NOTE]
> This article describes creating alert rules using the new alert rule wizard. Please note these changes in the new alert rule experience:
> - Search results are not included with the triggered alert and its associated notifications. The alert contains a link to the search results in Logs.
> - The new alert rule wizard does not include the option to customize the triggered alert's email or to include a custom JSON payload.
> - The new alert rule wizard does not currently support a frequency of 1 minute. 1 minute alert frequency will be supported soon.

1. In the [portal](https://portal.azure.com/), select the relevant resource.
1. In the Resource menu, under **Monitoring**, select **Alerts**.
1. From the top command bar, click **Create**, and then **Alert rule**.

   :::image type="content" source="media/alerts-log/alerts-create-new-alert-rule.png" alt-text="Create new alert rule.":::

1. The **Create alert rule** wizard opens to the **Select a signal** page of the **Condition** tab, with the scope already defined based on the resource you selected.

    :::image type="content" source="media/alerts-log/alerts-create-new-rule-select-signal.png" alt-text="Select signal.":::

1. Click on the **Custom log search** signal.
1. Write a query to identify the conditions for triggering alerts. You can use the [alert query examples topic](../logs/queries.md) to understand what you can discover or [get started on writing your own query](../logs/log-analytics-tutorial.md). Also, [learn how to create optimized alert queries](alerts-log-query.md).
1. Click **Run** to confirm that the query correctly identifies the data you want to alert on.
 
    :::image type="content" source="media/alerts-log/alerts-logs-query-results.png" alt-text="Query results.":::

1. Once you have successfully finished writing your query, click **Continue Editing Alert**.
1. The **Condition** tab opens, populated with your log query.
 
    :::image type="content" source="media/alerts-log/alerts-logs-conditions-tab.png" alt-text="Conditions Tab.":::

1. In the **Measurement** section, select values for the [**Measure**](./alerts-unified-log.md#measure), [**Aggregation type**](./alerts-unified-log.md#aggregation-type), and [**Aggregation granularity**](./alerts-unified-log.md#aggregation-granularity) fields.
    - By default, the rule counts the number of results in the last 5 minutes.
    - If the system detects summarized query results, the rule is automatically updated to capture that.
    
    :::image type="content" source="media/alerts-log/alerts-log-measurements.png" alt-text="Measurements.":::

1. (Optional) In the **Split by dimensions** section, select [alert splitting by dimensions](./alerts-unified-log.md#split-by-alert-dimensions): 
    - If detected, The **Resource ID column** is selected automatically and changes the context of the fired alert to the record's resource. 
    - Clear the **Resource ID column**  to fire alerts on multiple resources in subscriptions or resource groups. For example, you can create a query that checks if 80% of the resource group's virtual machines are experiencing high CPU usage.
    - You can use the dimensions table to select up to six more splittings for any number or text columns types.
    - Alerts are fired individually for each unique splitting combination. The alert payload includes the combination that triggered the alert.    
1. In the **Alert logic** section, set the **Alert logic**: [**Operator**, **Threshold Value**](./alerts-unified-log.md#threshold-and-operator), and [**Frequency**](./alerts-unified-log.md#frequency).   

    :::image type="content" source="media/alerts-log/alerts-rule-preview-agg-params-and-splitting.png" alt-text="Preview alert rule parameters.":::

1. (Optional) In the **Advanced options** section, set the [**Number of violations to trigger the alert**](./alerts-unified-log.md#number-of-violations-to-trigger-alert).
    
    :::image type="content" source="media/alerts-log/alerts-rule-preview-advanced-options.png" alt-text="Advanced options.":::

1. The **Preview** chart shows query evaluations results over time. You can change the chart period or select different time series that resulted from unique alert splitting by dimensions.

    :::image type="content" source="media/alerts-log/alerts-create-alert-rule-preview.png" alt-text="Alert rule preview.":::

1. From this point on, you can select the **Review + create** button at any time. 
1. In the **Actions** tab, select or create the required [action groups](./action-groups.md).

    :::image type="content" source="media/alerts-log/alerts-rule-actions-tab.png" alt-text="Actions tab.":::

1. In the **Details** tab, define the **Project details** and the **Alert rule details**.
1. (Optional) In the **Advanced options** section, you can set several options, including whether to **Enable upon creation**, or to [**Mute actions**](./alerts-unified-log.md#state-and-resolving-alerts) for a period after the alert rule fires.
    
    :::image type="content" source="media/alerts-log/alerts-rule-details-tab.png" alt-text="Details tab.":::

1. In the **Tags** tab, set any required tags on the alert rule resource.

    :::image type="content" source="media/alerts-log/alerts-rule-tags-tab.png" alt-text="Tags tab.":::

1. In the **Review + create** tab, a validation will run and inform you of any issues.
1. When validation passes and you have reviewed the settings, click the **Create** button.    
    
    :::image type="content" source="media/alerts-log/alerts-rule-review-create.png" alt-text="Review and create tab.":::

> [!NOTE]
> We recommend that you create alerts at scale when using resource access mode for log running on multiple resources using a resource group or subscription scope. Alerting at scale reduces rule management overhead. To be able to target the resources, include the resource ID column in the results. [Learn more about splitting alerts by dimensions](./alerts-unified-log.md#split-by-alert-dimensions).
## Manage alert rules in the Alerts portal

> [!NOTE]
> This article describes the process of managing alert rules created in the latest UI or using any API version later than `2018-04-16`. Alert rules created in the previous UI are viewed and managed as described in [View and manage alert rules created in previous versions](alerts-manage-alerts-previous-version.md).

1. In the [portal](https://portal.azure.com/), select the relevant resource.
1. Under **Monitoring**, select **Alerts**.
1. From the top command bar, select **Alert rules**.
1. Select the alert rule that you want to edit.
1. Edit any fields necessary, then select **Save** on the top command bar.
## Manage log alerts using PowerShell

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]
> [!NOTE]
> PowerShell is not currently supported in the API version `2020-08-01`
PowerShell cmdlets listed below are available to manage rules with the [Scheduled Query Rules API](/rest/api/monitor/scheduledqueryrules/).
- [New-AzScheduledQueryRule](/powershell/module/az.monitor/new-azscheduledqueryrule) : PowerShell cmdlet to create a new log alert rule.
- [Set-AzScheduledQueryRule](/powershell/module/az.monitor/set-azscheduledqueryrule) : PowerShell cmdlet to update an existing log alert rule.
- [New-AzScheduledQueryRuleSource](/powershell/module/az.monitor/new-azscheduledqueryrulesource) : PowerShell cmdlet to create or update object specifying source parameters for a log alert. Used as input by [New-AzScheduledQueryRule](/powershell/module/az.monitor/new-azscheduledqueryrule) and [Set-AzScheduledQueryRule](/powershell/module/az.monitor/set-azscheduledqueryrule) cmdlet.
- [New-AzScheduledQueryRuleSchedule](/powershell/module/az.monitor/new-azscheduledqueryruleschedule): PowerShell cmdlet to create or update object specifying schedule parameters for a log alert. Used as input by [New-AzScheduledQueryRule](/powershell/module/az.monitor/new-azscheduledqueryrule) and [Set-AzScheduledQueryRule](/powershell/module/az.monitor/set-azscheduledqueryrule) cmdlet.
- [New-AzScheduledQueryRuleAlertingAction](/powershell/module/az.monitor/new-azscheduledqueryrulealertingaction) : PowerShell cmdlet to create or update object specifying action parameters for a log alert. Used as input by [New-AzScheduledQueryRule](/powershell/module/az.monitor/new-azscheduledqueryrule) and [Set-AzScheduledQueryRule](/powershell/module/az.monitor/set-azscheduledqueryrule) cmdlet.
- [New-AzScheduledQueryRuleAznsActionGroup](/powershell/module/az.monitor/new-azscheduledqueryruleaznsactiongroup) : PowerShell cmdlet to create or update object specifying action groups parameters for a log alert. Used as input by [New-AzScheduledQueryRuleAlertingAction](/powershell/module/az.monitor/new-azscheduledqueryrulealertingaction) cmdlet.
- [New-AzScheduledQueryRuleTriggerCondition](/powershell/module/az.monitor/new-azscheduledqueryruletriggercondition) : PowerShell cmdlet to create or update object specifying trigger condition parameters for log alert. Used as input by [New-AzScheduledQueryRuleAlertingAction](/powershell/module/az.monitor/new-azscheduledqueryrulealertingaction) cmdlet.
- [New-AzScheduledQueryRuleLogMetricTrigger](/powershell/module/az.monitor/new-azscheduledqueryrulelogmetrictrigger) : PowerShell cmdlet to create or update object specifying metric trigger condition parameters for [metric measurement type log alert](./alerts-unified-log.md#calculation-of-measure-based-on-a-numeric-column-such-as-cpu-counter-value). Used as input by [New-AzScheduledQueryRuleTriggerCondition](/powershell/module/az.monitor/new-azscheduledqueryruletriggercondition) cmdlet.
- [Get-AzScheduledQueryRule](/powershell/module/az.monitor/get-azscheduledqueryrule) : PowerShell cmdlet to list existing log alert rules or a specific log alert rule
- [Update-AzScheduledQueryRule](/powershell/module/az.monitor/update-azscheduledqueryrule) : PowerShell cmdlet to enable or disable log alert rule
- [Remove-AzScheduledQueryRule](/powershell/module/az.monitor/remove-azscheduledqueryrule): PowerShell cmdlet to delete an existing log alert rule
> [!NOTE]
> ScheduledQueryRules PowerShell cmdlets can only manage rules created in the current [Scheduled Query Rules API](/rest/api/monitor/scheduledqueryrules/). Log alert rules created using legacy [Log Analytics Alert API](./api-alerts.md) can only be managed using PowerShell only after [switching to Scheduled Query Rules API](../alerts/alerts-log-api-switch.md).
Here are example steps for creating a log alert rule using the PowerShell:
```powershell
$source = New-AzScheduledQueryRuleSource -Query 'Heartbeat | summarize AggregatedValue = count() by bin(TimeGenerated, 5m), _ResourceId' -DataSourceId "/subscriptions/a123d7efg-123c-1234-5678-a12bc3defgh4/resourceGroups/contosoRG/providers/microsoft.OperationalInsights/workspaces/servicews"
$schedule = New-AzScheduledQueryRuleSchedule -FrequencyInMinutes 15 -TimeWindowInMinutes 30
$metricTrigger = New-AzScheduledQueryRuleLogMetricTrigger -ThresholdOperator "GreaterThan" -Threshold 2 -MetricTriggerType "Consecutive" -MetricColumn "_ResourceId"
$triggerCondition = New-AzScheduledQueryRuleTriggerCondition -ThresholdOperator "LessThan" -Threshold 5 -MetricTrigger $metricTrigger
$aznsActionGroup = New-AzScheduledQueryRuleAznsActionGroup -ActionGroup "/subscriptions/a123d7efg-123c-1234-5678-a12bc3defgh4/resourceGroups/contosoRG/providers/microsoft.insights/actiongroups/sampleAG" -EmailSubject "Custom email subject" -CustomWebhookPayload "{ `"alert`":`"#alertrulename`", `"IncludeSearchResults`":true }"
$alertingAction = New-AzScheduledQueryRuleAlertingAction -AznsAction $aznsActionGroup -Severity "3" -Trigger $triggerCondition
New-AzScheduledQueryRule -ResourceGroupName "contosoRG" -Location "Region Name for your Application Insights App or Log Analytics Workspace" -Action $alertingAction -Enabled $true -Description "Alert description" -Schedule $schedule -Source $source -Name "Alert Name"
```
Here are example steps for creating a log alert rule using the PowerShell with cross-resource queries:
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
You can also create the log alert using a [template and parameters](./alerts-log-create-templates.md) files using PowerShell:
```powershell
Connect-AzAccount
Select-AzSubscription -SubscriptionName <yourSubscriptionName>
New-AzResourceGroupDeployment -Name AlertDeployment -ResourceGroupName ResourceGroupofTargetResource `
  -TemplateFile mylogalerttemplate.json -TemplateParameterFile mylogalerttemplate.parameters.json
```

## Manage log alerts using CLI

> [!NOTE]
> Azure CLI support is only available for the scheduledQueryRules API version `2020-08-01` and above. Pervious API version can use the Azure Resource Manager CLI with templates as described below. If you use the legacy [Log Analytics Alert API](./api-alerts.md), you will need to switch to use CLI. [Learn more about switching](./alerts-log-api-switch.md).
The previous sections described how to create, view, and manage log alert rules using Azure portal. This section will describe how to do the same using cross-platform [Azure CLI](/cli/azure/get-started-with-azure-cli). Quickest way to start using Azure CLI is through [Azure Cloud Shell](../../cloud-shell/overview.md). For this article, we'll use Cloud Shell.

1. Go to Azure portal, select **Cloud Shell**.
1. At the prompt, you can use commands with ``--help`` option to learn more about the command and how to use it. For example, the following command shows you the list of commands available for creating, viewing, and managing log alerts:
    ```azurecli
    az monitor scheduled-query --help
    ```
1. You can create a log alert rule that monitors count of system event errors:
    ```azurecli
    az monitor scheduled-query create -g {ResourceGroup} -n {nameofthealert} --scopes {vm_id} --condition "count \'union Event, Syslog | where TimeGenerated > ago(1h) | where EventLevelName == \"Error\" or SeverityLevel== \"err\"\' > 2" --description {descriptionofthealert}
    ```
1. You can view all the log alerts in a resource group using the following command:
    ```azurecli
    az monitor scheduled-query list -g {ResourceGroup}
   ```
1. You can see the details of a particular log alert rule using the name or the resource ID of the rule:
    ```azurecli
    az monitor scheduled-query show -g {ResourceGroup} -n {AlertRuleName}
    ```
    ```azurecli
    az monitor scheduled-query show --ids {RuleResourceId}
    ```
1. You can disable a log alert rule using the following command:
    ```azurecli
    az monitor scheduled-query update -g {ResourceGroup} -n {AlertRuleName} --disabled false
    ```
1. You can delete a log alert rule using the following command:
    ```azurecli
    az monitor scheduled-query delete -g {ResourceGroup} -n {AlertRuleName}
    ```
You can also use Azure Resource Manager CLI with [templates](./alerts-log-create-templates.md) files:
```azurecli
az login
az deployment group create \
    --name AlertDeployment \
    --resource-group ResourceGroupofTargetResource \
    --template-file mylogalerttemplate.json \
    --parameters @mylogalerttemplate.parameters.json
```
On success for creation, 201 is returned. On success for update, 200 is returned.
## Next steps

* Learn about [log alerts](./alerts-unified-log.md).
* Create log alerts using [Azure Resource Manager Templates](./alerts-log-create-templates.md).
* Understand [webhook actions for log alerts](./alerts-log-webhook.md).
* Learn more about [log queries](../logs/log-query-overview.md).
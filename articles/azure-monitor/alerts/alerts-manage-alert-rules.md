---
title: Manage your alert rules
description: Manage your alert rules in the Azure portal, or using the CLI or PowerShell.
author: AbbyMSFT
ms.author: abbyweisberg
ms.topic: conceptual
ms.date: 03/05/2023
ms.reviewer: harelbr
---
# Manage your alert rules

Manage your alert rules in the Azure portal, or using the CLI or PowerShell.

## Manage alert rules in the Azure portal

1. In the [portal](https://portal.azure.com/), select **Monitor**, then **Alerts**.
1. From the top command bar, select **Alert rules**. The page shows all your alert rules on all subscriptions.

    :::image type="content" source="media/alerts-managing-alert-instances/alerts-rules-page.png" alt-text="Screenshot of alerts rules page.":::

1. You can filter the list of rules using the available filters:
    - Subscription
    - Alert condition
    - Severity
    - User response
    - Monitor service
    - Signal type
    - Resource group
    - Target resource type
    - Resource name
    - Suppression status

    > [!NOTE]
    > If you filter on a `target resource type` scope, the alerts rules list doesn’t include resource health alert rules. To see the resource health alert rules, remove the `Target resource type` filter, or filter the rules based on the `Resource group` or `Subscription`.

1. Select an alert rule or use the checkboxes on the left to select multiple alert rules. 
1. If you select multiple alert rules, you can enable or disable the selected rules. Selecting multiple rules can be useful when you want to perform maintenance on specific resources. 
1. If you select a single alert rule, you can edit, disable, duplicate, or delete the rule in the alert rule pane.

    :::image type="content" source="media/alerts-managing-alert-instances/alerts-rules-pane.png" alt-text="Screenshot of alerts rules pane.":::

1. To edit an alert rule, select **Edit**, and then edit any of the fields in the following sections. You can't edit the **Alert Rule Name**, or the **Signal type** of an existing alert rule.
    - **Scope**. You can edit the scope for all alert rules **other than**:
        - Log alert rules
        - Metric alert rules that monitor a custom metric
        - Smart detection alert rules
    - **Condition**. Learn more about conditions for [metric alert rules](./alerts-create-new-alert-rule.md?tabs=metric#tabpanel_1_metric), [log alert rules](./alerts-create-new-alert-rule.md?tabs=log#tabpanel_1_log), and [activity log alert rules](./alerts-create-new-alert-rule.md?tabs=activity-log#tabpanel_1_activity-log)
    - **Actions**
    - **Alert rule details**
1. Select **Save** on the top command bar.

> [!NOTE]
> This section describes how to manage alert rules created in the latest UI or using an API version later than `2018-04-16`. See [View and manage log alert rules created in previous versions](alerts-manage-alerts-previous-version.md) for information about how to view and manage log alert rules created in the previous UI.

## Enable recommended alert rules in the Azure portal

If you don't have alert rules defined for the selected resource, either individually or as part of a resource group or subscription, you can [create a new alert rule](alerts-log.md#create-a-new-log-alert-rule-in-the-azure-portal), or enable recommended out-of-the-box alert rules in the Azure portal.

The system compiles a list of recommended alert rules based on:
- The resource provider’s knowledge of important signals and thresholds for monitoring the resource.
- Telemetry that tells us what customers commonly alert on for this resource.

> [!NOTE]
> The alert rule recommendations feature is enabled for:
> - Virtual machines
> - AKS resources
> - Log Analytics workspaces

:::image type="content" source="media/alerts-managing-alert-instances/enable-recommended-alert-rules.jpg" alt-text="Screenshot of alerts page with link to recommended alert rules.":::

To enable recommended alert rules:

1. On the **Alerts** page, select **Enable recommended alert rules**. The **Enable recommended alert rules** pane opens with a list of recommended alert rules based on your type of resource.  
1. In the **Alert me if** section, select all of the rules you want to enable. The rules are populated with the default values for the rule condition, such as the percentage of CPU usage that you want to trigger an alert. You can change the default values if you would like.
1. In the **Notify me by** section, select the way you want to be notified if an alert is fired.
1. Select **Use an existing action group**, and enter the details of the existing action group if you want to use an action group that already exists.
1. Select **Enable**.

    :::image type="content" source="media/alerts-managing-alert-instances/alerts-enable-recommended-alert-rule-pane.png" alt-text="Screenshot of recommended alert rules pane."::: 

## Manage metric alert rules with the Azure CLI

This section describes how to manage metric alert rules using the cross-platform [Azure CLI](/cli/azure/get-started-with-azure-cli). The following examples use [Azure Cloud Shell](../../cloud-shell/overview.md). 

1. In the [portal](https://portal.azure.com/), select **Cloud Shell**.
1. Use these options of the `az monitor metrics alert` CLI command in this table:

    
    |What you want to do|CLI command  |
    |---------|---------|
    |View all the metric alerts in a resource group|`az monitor metrics alert list -g {ResourceGroup}`|
    |See the details of a metric alert rule|`az monitor metrics alert show -g {ResourceGroup} -n {AlertRuleName}`|
    |     |`az monitor metrics alert show --ids {RuleResourceId}`|
    |Disable a metric alert rule|`az monitor metrics alert update -g {ResourceGroup} -n {AlertRuleName} --enabled false`|
    |Delete a metric alert rule|`az monitor metrics alert delete -g {ResourceGroup} -n {AlertRuleName}`|
    |Learn more about the command|`az monitor metrics alert --help`|

## Manage metric alert rules with PowerShell

Metric alert rules have these dedicated PowerShell cmdlets:

- [Add-AzMetricAlertRuleV2](/powershell/module/az.monitor/add-azmetricalertrulev2): Create a new metric alert rule or update an existing one.
- [Get-AzMetricAlertRuleV2](/powershell/module/az.monitor/get-azmetricalertrulev2): Get one or more metric alert rules.
- [Remove-AzMetricAlertRuleV2](/powershell/module/az.monitor/remove-azmetricalertrulev2): Delete a metric alert rule.

## Manage metric alert rules with REST API

- [Create Or Update](/rest/api/monitor/metricalerts/createorupdate): Create a new metric alert rule or update an existing one.
- [Get](/rest/api/monitor/metricalerts/get): Get a specific metric alert rule.
- [List By Resource Group](/rest/api/monitor/metricalerts/listbyresourcegroup): Get a list of metric alert rules in a specific resource group.
- [List By Subscription](/rest/api/monitor/metricalerts/listbysubscription): Get a list of metric alert rules in a specific subscription.
- [Update](/rest/api/monitor/metricalerts/update): Update a metric alert rule.
- [Delete](/rest/api/monitor/metricalerts/delete): Delete a metric alert rule.

## Manage log alert rules using the CLI

This section describes how to manage log alerts using the cross-platform [Azure CLI](/cli/azure/get-started-with-azure-cli). The following examples use [Azure Cloud Shell](../../cloud-shell/overview.md). 

> [!NOTE]
> Azure CLI support is only available for the scheduledQueryRules API version `2021-08-01` and later. Previous API versions can use the Azure Resource Manager CLI with templates as described below. If you use the legacy [Log Analytics Alert API](./api-alerts.md), you will need to switch to use CLI. [Learn more about switching](./alerts-log-api-switch.md).


1. In the [portal](https://portal.azure.com/), select **Cloud Shell**.
1. Use these options of the `az monitor scheduled-query alert` CLI command in this table:

    
    |What you want to do|CLI command  |
    |---------|---------|
    |View all the log alert rules in a resource group|`az monitor scheduled-query list -g {ResourceGroup}`|
    |See the details of a log alert rule|`az monitor scheduled-query show -g {ResourceGroup} -n {AlertRuleName}`|
    |     |`az monitor scheduled-query show --ids {RuleResourceId}`|
    |Disable a log alert rule|`az monitor scheduled-query update -g {ResourceGroup} -n {AlertRuleName} --disabled true`|
    |Delete a log alert rule|`az monitor scheduled-query delete -g {ResourceGroup} -n {AlertRuleName}`|
    |Learn more about the command|`az monitor scheduled-query --help`|

### Manage log alert rules using the Azure Resource Manager CLI with [templates](./alerts-log-create-templates.md)

```azurecli
az login
az deployment group create \
    --name AlertDeployment \
    --resource-group ResourceGroupofTargetResource \
    --template-file mylogalerttemplate.json \
    --parameters @mylogalerttemplate.parameters.json
```

A 201 response is returned on successful creation. 200 is returned on successful updates.

## Manage log alert rules with PowerShell

Log alert rules have this dedicated PowerShell cmdlet:
- [New-AzScheduledQueryRule](/powershell/module/az.monitor/new-azscheduledqueryrule): Creates a new log alert rule or updates an existing log alert rule.
## Manage activity log alert rules using PowerShell

Activity log alerts have these dedicated PowerShell cmdlets:

- [Set-AzActivityLogAlert](/powershell/module/az.monitor/set-azactivitylogalert): Creates a new activity log alert or updates an existing activity log alert.
- [Get-AzActivityLogAlert](/powershell/module/az.monitor/get-azactivitylogalert): Gets one or more activity log alert resources.
- [Enable-AzActivityLogAlert](/powershell/module/az.monitor/enable-azactivitylogalert): Enables an existing activity log alert and sets its tags.
- [Disable-AzActivityLogAlert](/powershell/module/az.monitor/disable-azactivitylogalert): Disables an existing activity log alert and sets its tags.
- [Remove-AzActivityLogAlert](/powershell/module/az.monitor/remove-azactivitylogalert): Removes an activity log alert.

## Next steps

- [Learn about Azure Monitor alerts](./alerts-overview.md)
- [Create a new alert rule](alerts-log.md)
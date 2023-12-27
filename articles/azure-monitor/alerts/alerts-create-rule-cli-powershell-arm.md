---
title: Create Azure Monitor alert rules using the CLI, PowerShell or an ARM template
description: This article shows you how to create a new alert rule using the CLI, PowerShell or an ARM template.
author: AbbyMSFT
ms.author: abbyweisberg
ms.topic: how-to
ms.date: 11/29/2023
ms.reviewer: harelbr
---
# Create a new alert rule using the CLI, PowerShell, or an ARM template
You can create a new alert rule using the [the CLI](#create-a-new-alert-rule-using-the-cli), [PowerShell](#create-a-new-alert-rule-using-powershell), or an [Azure Resource Manager template](#create-a-new-alert-rule-using-an-arm-template).

## Create a new alert rule using the CLI

You can create a new alert rule using the [Azure CLI](/cli/azure/get-started-with-azure-cli). The following code examples use [Azure Cloud Shell](../../cloud-shell/overview.md). You can see the full list of the [Azure CLI commands for Azure Monitor](/cli/azure/azure-cli-reference-for-monitor#azure-monitor-references).

1. In the [portal](https://portal.azure.com/), select **Cloud Shell**. At the prompt, use the commands that follow.

    To create a metric alert rule, use the `az monitor metrics alert create` command. You can see detailed documentation on the metric alert rule create command in the `az monitor metrics alert create` section of the [CLI reference documentation for metric alerts](/cli/azure/monitor/metrics/alert).

    To create a metric alert rule that monitors if average Percentage CPU on a VM is greater than 90:
    ```azurecli
     az monitor metrics alert create -n {nameofthealert} -g {ResourceGroup} --scopes {VirtualMachineResourceID} --condition "avg Percentage CPU > 90" --description {descriptionofthealert}
    ```
## Create a new alert rule using PowerShell

- To create a metric alert rule using PowerShell, use the [Add-AzMetricAlertRuleV2](/powershell/module/az.monitor/add-azmetricalertrulev2) cmdlet.
- To create a log alert rule using PowerShell, use the [New-AzScheduledQueryRule](/powershell/module/az.monitor/new-azscheduledqueryrule) cmdlet.
- To create an activity log alert rule using PowerShell, use the [Set-AzActivityLogAlert](/powershell/module/az.monitor/set-azactivitylogalert) cmdlet.

## Create a new alert rule using an ARM template

You can use an [Azure Resource Manager template (ARM template)](../../azure-resource-manager/templates/syntax.md) to configure alert rules consistently in all of your environments.

1. Create a new resource, using the following resource types:
    - For metric alerts: `Microsoft.Insights/metricAlerts`
    - For log alerts: `Microsoft.Insights/scheduledQueryRules`
    - For activity log, service health, and resource health alerts: `microsoft.Insights/activityLogAlerts`
    > [!NOTE]
    > - Metric alerts for an Azure Log Analytics workspace resource type (`Microsoft.OperationalInsights/workspaces`) are configured differently than other metric alerts. For more information, see [Resource Template for Metric Alerts for Logs](alerts-metric-logs.md#resource-template-for-metric-alerts-for-logs).
    > - We recommend that you create the metric alert using the same resource group as your target resource.
1. Copy one of the templates from these sample ARM templates.
    - For metric alerts: [Resource Manager template samples for metric alert rules](resource-manager-alerts-metric.md)
    - For log alerts: [Resource Manager template samples for log alert rules](resource-manager-alerts-log.md)
    - For activity log alerts: [Resource Manager template samples for activity log alert rules](resource-manager-alerts-activity-log.md)
    - For resource health alerts: [Resource Manager template samples for resource health alert rules](resource-manager-alerts-resource-health.md)
1. Edit the template file to contain appropriate information for your alert, and save the file as \<your-alert-template-file\>.json.
1. Edit the corresponding parameters file to customize the alert, and save as \<your-alert-template-file\>.parameters.json.
1. Set the `metricName` parameter, using one of the values in [Azure Monitor supported metrics](../essentials/metrics-supported.md).
1. Deploy the template using [PowerShell](../../azure-resource-manager/templates/deploy-powershell.md#deploy-local-template) or the [CLI](../../azure-resource-manager/templates/deploy-cli.md#deploy-local-template).

## Next steps
- [Manage alert rules](alerts-manage-alert-rules.md)
- [Manage alert instances](alerts-manage-alert-instances.md)
 

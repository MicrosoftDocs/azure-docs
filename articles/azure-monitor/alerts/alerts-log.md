---
title: Create, view, and manage log alert rules Using Azure Monitor | Microsoft Docs
description: Use Azure Monitor to create, view, and manage log alert rules
author: AbbyMSFT
ms.author: abbyweisberg
ms.topic: conceptual
ms.date: 2/23/2022
ms.custom: devx-track-azurepowershell, devx-track-azurecli
---
# Create, view, and manage log alerts using Azure Monitor

This article shows you how to create and manage log alerts. Azure Monitor log alerts allow users to use a [Log Analytics](../logs/log-analytics-tutorial.md) query to evaluate resource logs at a set frequency and fire an alert based on the results. Rules can trigger one or more actions using [Action Groups](./action-groups.md). [Learn more about functionality and terminology of log alerts](./alerts-unified-log.md).

 Alert rules are defined by three components:
- Target: A specific Azure resource to monitor.
- Criteria: Logic to evaluate. If met, the alert fires.  
- Action: Notifications or automation - email, SMS, webhook, and so on.
You can also [create log alert rules using Azure Resource Manager templates](../alerts/alerts-log-create-templates.md).
## Create a new log alert rule in the Azure portal
> [!NOTE]
> This article describes creating alert rules using the new alert rule wizard. 
> The new alert rule experience is a little different than the old experience. Please note these changes:
> - Previously, search results were included in the payloads of the triggered alert and its associated notifications. This was a limited and error prone solution. To get detailed context information about the alert so that you can decide on the appropriate action :
>   - The recommended best practice it to use [Dimensions](alerts-unified-log.md#split-by-alert-dimensions). Dimensions provide the column value that fired the alert, giving you context for why the alert fired and how to fix the issue.
>    - When you need to investigate in the logs, use the link in the alert to the search results in Logs.
>    - If you need the raw search results or for any other advanced customizations, use Logic Apps.
> - The new alert rule wizard does not support customization of the JSON payload.
>   - Use custom properties in the [new API](/rest/api/monitor/scheduledqueryrule-2021-08-01/scheduled-query-rules/create-or-update#actions) to add static parameters and associated values to the webhook actions triggered by the alert.
>    - For more advanced customizations, use Logic Apps.
> - The new alert rule wizard does not support customization of the email subject.
>     - Customers often use the custom email subject to indicate the resource on which the alert fired, instead of using the Log Analytics workspace. Use the [new API](alerts-unified-log.md#split-by-alert-dimensions) to trigger an alert of the desired resource using the resource id column.
>     - For more advanced customizations, use Logic Apps.


1. In the [portal](https://portal.azure.com/), select the relevant resource. We recommend monitoring at scale by using a subscription or resource group for the alert rule.
1. In the Resource menu, select **Logs**.
1. Write a query that will find the log events for which you want to create an alert. You can use the [alert query examples article](../logs/queries.md) to understand what you can discover or [get started on writing your own query](../logs/log-analytics-tutorial.md). Also, [learn how to create optimized alert queries](alerts-log-query.md).
1. From the top command bar, Select **+ New Alert rule**.

   :::image type="content" source="media/alerts-log/alerts-create-new-alert-rule.png" alt-text="Create new alert rule." lightbox="media/alerts-log/alerts-create-new-alert-rule-expanded.png":::  

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

> [!NOTE]
> If you, or your administrator assigned the Azure Policy **Azure Log Search Alerts over Log Analytics workspaces should use customer-managed keys**, you must select **Check workspace linked storage** option in **Advanced options**, or the rule creation will fail as it will not meet the policy requirements.

1. In the **Tags** tab, set any required tags on the alert rule resource.

    :::image type="content" source="media/alerts-log/alerts-rule-tags-tab.png" alt-text="Tags tab.":::

1. In the **Review + create** tab, a validation will run and inform you of any issues.
1. When validation passes and you have reviewed the settings, select the **Create** button.    
    
    :::image type="content" source="media/alerts-log/alerts-rule-review-create.png" alt-text="Review and create tab.":::

## Enable recommended out-of-the-box alert rules in the Azure portal (preview)
> [!NOTE]
> The alert rule recommendations feature is currently in preview and is only enabled for VMs.

If you don't have alert rules defined for the selected resource, either individually or as part of a resource group or subscription, you can enable our recommended out-of-the-box alert rules. 

:::image type="content" source="media/alerts-managing-alert-instances/enable-recommended-alert-rules.jpg" alt-text="Screenshot of alerts page with link to recommended alert rules.":::

The system compiles a list of recommended alert rules based on:
- The resource provider’s knowledge of important signals and thresholds for monitoring the resource.
- Telemetry that tells us what customers commonly alert on for this resource.

To enable recommended alert rules:
1. On the **Alerts** page, select **Enable recommended alert rules**. The **Enable recommended alert rules** pane opens with a list of recommended alert rules based on your type of resource.  
1. In the **Alert me if** section, select all of the rules you want to enable. The rules are populated with the default values for the rule condition, such as the percentage of CPU usage that you want to trigger an alert. You can change the default values if you would like.
1. In the **Notify me by** section, select the way you want to be notified if an alert is fired.
1. Select **Enable**.

:::image type="content" source="media/alerts-managing-alert-instances/enable-recommended-rule-pane.jpg" alt-text="Screenshot of recommended alert rules pane."::: 

## Manage alert rules in the Alerts portal

> [!NOTE]
> This section describes how to manage alert rules created in the latest UI or using an API version later than `2018-04-16`. See [View and manage alert rules created in previous versions](alerts-manage-alerts-previous-version.md) for information about how to view and manage alert rules created in the previous UI.

1. In the [portal](https://portal.azure.com/), select the relevant resource.
1. Under **Monitoring**, select **Alerts**.
1. From the top command bar, select **Alert rules**.
1. Select the alert rule that you want to edit.
1. Edit any fields necessary, then select **Save** on the top command bar.
## Manage log alerts using CLI

This section describes how to manage log alerts using the cross-platform [Azure CLI](/cli/azure/get-started-with-azure-cli). Quickest way to start using Azure CLI is through [Azure Cloud Shell](../../cloud-shell/overview.md). For this article, we'll use Cloud Shell.
> [!NOTE]
> Azure CLI support is only available for the scheduledQueryRules API version `2021-08-01` and later. Previous API versions can use the Azure Resource Manager CLI with templates as described below. If you use the legacy [Log Analytics Alert API](./api-alerts.md), you will need to switch to use CLI. [Learn more about switching](./alerts-log-api-switch.md).


1. In the [portal](https://portal.azure.com/), select **Cloud Shell**.
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

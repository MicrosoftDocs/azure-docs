---
title: Create Azure Monitor log alert rules and manage alert instances | Microsoft Docs
description: Create Azure Monitor log alert rules and manage your alert instances.
author: AbbyMSFT
ms.author: abbyweisberg
ms.topic: conceptual
ms.date: 05/23/2022
ms.custom: devx-track-azurepowershell, devx-track-azurecli
---
# Create Azure Monitor log alert rules and manage alert instances 

This article shows you how to create log alert rules and manage your alert instances. Azure Monitor log alerts allow users to use a [Log Analytics](../logs/log-analytics-tutorial.md) query to evaluate resource logs at a set frequency and fire an alert based on the results. Rules can trigger one or more actions using [alert processing rules](alerts-action-rules.md) and [action groups](./action-groups.md). Learn the concepts behind log alerts [here](alerts-types.md#log-alerts).

When an alert is triggered by an alert rule, 
- Target: A specific Azure resource to monitor.
- Criteria: Logic to evaluate. If met, the alert fires.  
- Action: Notifications or automation - email, SMS, webhook, and so on.
You can also [create log alert rules using Azure Resource Manager templates](../alerts/alerts-log-create-templates.md).
## Create a new log alert rule in the Azure portal

1. In the [portal](https://portal.azure.com/), select the relevant resource. We recommend monitoring at scale by using a subscription or resource group.
1. In the Resource menu, select **Logs**.
1. Write a query that will find the log events for which you want to create an alert. You can use the [alert query examples article](../logs/queries.md) to understand what you can discover or [get started on writing your own query](../logs/log-analytics-tutorial.md). Also, [learn how to create optimized alert queries](alerts-log-query.md).
1. From the top command bar, Select **+ New Alert rule**.

   :::image type="content" source="media/alerts-log/alerts-create-new-alert-rule.png" alt-text="Create new alert rule." lightbox="media/alerts-log/alerts-create-new-alert-rule-expanded.png":::  

1. The **Condition** tab opens, populated with your log query.
   
   By default, the rule counts the number of results in the last 5 minutes.
   
   If the system detects summarized query results, the rule is automatically updated with that information.
 
    :::image type="content" source="media/alerts-log/alerts-logs-conditions-tab.png" alt-text="Conditions Tab.":::

1. In the **Measurement** section, select values for these fields:
   
    |Field  |Description  |
    |---------|---------|
    |Measure|Log alerts can measure two different things, which can be used for different monitoring scenarios:<br> **Table rows**: The number of rows returned can be used to work with events such as Windows event logs, syslog, application exceptions. <br>**Calculation of a numeric column**: Calculations based on any numeric column can be used to include any number of resources. For example, CPU percentage.      |
    |Aggregation type| The calculation performed on multiple records to aggregate them to one numeric value using the aggregation granularity. For example: Total, Average, Minimum, or Maximum.    |
    |Aggregation granularity| The interval for aggregating multiple records to one numeric value.|
 
    :::image type="content" source="media/alerts-log/alerts-log-measurements.png" alt-text="Measurements.":::

1. (Optional) In the **Split by dimensions** section, you can create resource-centric alerts at scale for a subscription or resource group. Splitting by dimensions groups combinations of numerical or string columns to monitor for the same condition on multiple Azure resources.

   If you select more than one dimension value, each time series that results from the combination triggers its own alert and is charged separately. The alert payload includes the combination that triggered the alert.

   You can select up to six more splittings for any number or text columns types.
   
   You can also decide **not** to split when you want a condition applied to multiple resources in the scope. For example, if you want to fire an alert if at least five machines in the resource group scope have CPU usage over 80%.  

   Select values for these fields:

    |Field  |Description  |
    |---------|---------|
    |Dimension name|Dimensions can be either number or string columns. Dimensions are used to monitor specific time series and provide context to a fired alert.<br>Splitting on the Azure Resource ID column makes the specified resource into the alert target. If an Resource ID column is detected, it is selected automatically and changes the context of the fired alert to the record's resource.  |
    |Operator|The operator used on the dimension name and value.  |
    |Dimension values|The dimension values are based on data from the last 48 hours. Select **Add custom value** to add custom dimension values.  |

   :::image type="content" source="media/alerts-log/alerts-create-log-rule-dimensions.png" alt-text="Screenshot of the splitting by dimensions section of a new log alert rule.":::
    
1. In the **Alert logic** section, select values for these fields:

   |Field  |Description  |
   |---------|---------|
   |Operator| The query results are transformed into a number. In this field, select the operator to use to compare the number against the threshold.|
   |Threshold value| A number value for the threshold. |
   |Frequency of evaluation|The interval in which the query is run. Can be set from a minute to a day. | 

    :::image type="content" source="media/alerts-log/alerts-create-log-rule-logic.png" alt-text="Screenshot of alert logic section of a new log alert rule.":::

1. (Optional) In the **Advanced options** section, you can specify the number of failures and the alert evaluation period required to trigger an alert. For example, if you set the **Aggregation granularity** to 5 minutes, you can specify that you only want to trigger an alert if there were three failures (15 minutes) in the last hour. This setting is defined by your application business policy.
   
    Select values for these fields under **Number of violations to trigger the alert**:
    
    |Field  |Description  |
    |---------|---------|
    |Number of violations|The number of violations that have to occur to trigger the alert.|
    |Evaluation period|The amount of time within which those violations have to occur. |
    |Override query time range| Enter a value for this field if the alert evaluation period is different than the query time range.| 

    :::image type="content" source="media/alerts-log/alerts-rule-preview-advanced-options.png" alt-text="Screenshot of the advanced options section of a new log alert rule.":::

1. The **Preview** chart shows query evaluations results over time. You can change the chart period or select different time series that resulted from unique alert splitting by dimensions.

    :::image type="content" source="media/alerts-log/alerts-create-alert-rule-preview.png" alt-text="Screenshot of a preview of a new alert rule.":::

1. From this point on, you can select the **Review + create** button at any time. 
1. In the **Actions** tab, select or create the required [action groups](./action-groups.md).

    :::image type="content" source="media/alerts-log/alerts-rule-actions-tab.png" alt-text="Actions tab.":::

1. In the **Details** tab, define the **Project details** and the **Alert rule details**.
1. (Optional) In the **Advanced options** section, you can set several options, including whether to **Enable upon creation**, or to **Mute actions** for a period of time after the alert rule fires.
    
    :::image type="content" source="media/alerts-log/alerts-rule-details-tab.png" alt-text="Details tab.":::

> [!NOTE]
> If you, or your administrator assigned the Azure Policy **Azure Log Search Alerts over Log Analytics workspaces should use customer-managed keys**, you must select **Check workspace linked storage** option in **Advanced options**, or the rule creation will fail as it will not meet the policy requirements.

1. In the **Tags** tab, set any required tags on the alert rule resource.

    :::image type="content" source="media/alerts-log/alerts-rule-tags-tab.png" alt-text="Tags tab.":::

1. In the **Review + create** tab, a validation will run and inform you of any issues.
1. When validation passes and you have reviewed the settings, select the **Create** button.    
    
    :::image type="content" source="media/alerts-log/alerts-rule-review-create.png" alt-text="Review and create tab.":::

> [!NOTE]
> This section above describes creating alert rules using the new alert rule wizard. 
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

* Learn about [Log alerts](alerts-types.md#log-alerts).
* Create log alerts using [Azure Resource Manager Templates](./alerts-log-create-templates.md).
* Understand [webhook actions for log alerts](./alerts-log-webhook.md).
* Learn more about [log queries](../logs/log-query-overview.md).

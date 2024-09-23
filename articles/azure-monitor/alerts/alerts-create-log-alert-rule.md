---
title: Create Azure Monitor log search alert rules
description: This article explains how to create a new Azure Monitor log search alert rule or edit an existing rule.
author: AbbyMSFT
ms.author: abbyweisberg
ms.topic: how-to
ms.date: 02/28/2024
ms.reviewer: nolavime

#customer intent: As a customer, I want to create a new log search alert rule or edit an existing rule so that I can monitor my resources and receive alerts when certain conditions are met.
---

# Create or edit a log search alert rule

This article shows you how to create a new alert rule or edit an existing alert rule for log search in Azure Monitor. To learn more about alerts, see the [alerts overview](alerts-overview.md).

You create an alert rule by combining the resources to be monitored, the monitoring data from the resource, and the conditions that you want to trigger the alert. You can then define [action groups](./action-groups.md) and [alert processing rules](alerts-action-rules.md) to determine what happens when an alert is triggered.

Alerts triggered by these alert rules contain a payload that uses the [common alert schema](alerts-common-schema.md).

[!INCLUDE [alerts-wizard-access](../includes/alerts-wizard-access.md)]

### Edit an existing alert rule

1. In the [Azure portal](https://portal.azure.com/), either from the home page or from a specific resource, select **Alerts** on the left pane.
1. Select **Alert rules**.
1. Select the alert rule that you want to edit, and then select **Edit**.

    :::image type="content" source="media/alerts-create-log-alert-rule/alerts-edit-log-search-alert-rule.png" alt-text="Screenshot that shows steps to edit an existing log search alert rule.":::
1. Select any of the tabs for the alert rule to edit the settings.

[!INCLUDE [alerts-wizard-scope](../includes/alerts-wizard-scope.md)]

## Configure alert rule conditions

1. On the **Condition** tab, when you select the **Signal name** field, select **Custom log search**. Or select **See all signals** if you want to choose a different signal for the condition.

1. (Optional) If you selected **See all signals** in the previous step, use the **Select a signal** pane to search for the signal name or filter the list of signals. Filter by:
    - **Signal type**: Select **Log search**.
    - **Signal source**: The service that sends the **Custom log search** and **Log (saved query)** signals. Select the signal name, and then select **Apply**.

1. On the **Logs** pane, write a query that returns the log events for which you want to create an alert. To use one of the predefined alert rule queries, expand the **Schema and filter** pane next to the **Logs** pane. Then select the **Queries** tab, and select one of the queries.

   Be aware of these limitations for log search alert rule queries:

   - Log search alert rule queries don't support `bag_unpack()`, `pivot()`, and `narrow()`.
   - Log search alert rule queries support [ago()](/azure/data-explorer/kusto/query/ago-function) with [timespan literals](/azure/data-explorer/kusto/query/scalar-data-types/timespan#timespan-literals) only.
   - `AggregatedValue` is a reserved word. You can't use it in the query on log search alert rules.
   - The combined size of all data in the properties of the log search alert rules can't exceed 64 KB.

    :::image type="content" source="media/alerts-create-new-alert-rule/alerts-log-rule-query-pane.png" alt-text="Screenshot that shows the query pane during the creation of a new log search alert rule.":::

1. (Optional) If you're querying an Azure Data Explorer or Azure Resource Graph cluster, the Log Analytics workspace can't automatically identify the column with the event time stamp. We recommend that you add a time range filter to the query. For example:

    ```KQL
        adx('https://help.kusto.windows.net/Samples').table    
        | where MyTS >= ago(5m) and MyTS <= now()
    ```

    ```KQL
        arg("").Resources
        | where type =~ 'Microsoft.Compute/virtualMachines'
        | project _ResourceId=tolower(id), tags
    ```

    :::image type="content" source="media/alerts-create-new-alert-rule/alerts-logs-conditions-tab.png" alt-text="Screenshot that shows the Condition tab for creating a new log search alert rule.":::

    [Sample log search alert queries](./alerts-log-alert-query-samples.md) are available for Azure Data Explorer and Resource Graph.

   Cross-service queries aren't supported in government clouds. For more information about limitations, see [Cross-service query limitations](../logs/azure-monitor-data-explorer-proxy.md#limitations) and [Combine Azure Resource Graph tables with a Log Analytics workspace](../logs/azure-monitor-data-explorer-proxy.md#combine-azure-resource-graph-tables-with-a-log-analytics-workspace).

1. Select **Run** to run the alert.
1. The **Preview** section shows you the query results. When you finish editing your query, select **Continue Editing Alert**.
1. The **Condition** tab opens and is populated with your log query. By default, the rule counts the number of results in the last five minutes. If the system detects summarized query results, the rule is automatically updated with that information.

1. In the **Measurement** section, select values for these fields:

    |Field  |Description  |
    |---------|---------|
    |**Measure**|Log search alerts can measure two things that you can use for various monitoring scenarios:<br> **Table rows**: You can use the number of returned rows to work with events such as Windows event logs, Syslog, and application exceptions. <br>**Calculation of a numeric column**: You can use calculations based on any numeric column to include any number of resources. An example is CPU percentage.      |
    |**Aggregation type**| The calculation performed on multiple records to aggregate them to one numeric value by using the aggregation granularity. Examples are **Total**, **Average**, **Minimum**, and **Maximum**.    |
    |**Aggregation granularity**| The interval for aggregating multiple records to one numeric value.|

    :::image type="content" source="media/alerts-create-new-alert-rule/alerts-log-measurements.png" alt-text="Screenshot that shows the measurement options during the creation of a new log search alert rule.":::

1. <a name="dimensions"></a>(Optional) In the **Split by dimensions** section, you can use dimensions to help provide context for the triggered alert.

    Dimensions are columns from your query results that contain additional data. When you use dimensions, the alert rule groups the query results by the dimension values and evaluates the results of each group separately. If the condition is met, the rule fires an alert for that group. The alert payload includes the combination that triggered the alert.

    You can apply up to six dimensions per alert rule. Dimensions can be only string or numeric columns. If you want to use a column that isn't a number or string type as a dimension, you must convert it to a string or numeric value in your query. If you select more than one dimension value, each time series that results from the combination triggers its own alert and is charged separately.

    For example:

    - You could use dimensions to monitor CPU usage on multiple instances that run your website or app. Each instance is monitored individually, and notifications are sent for each instance where the CPU usage exceeds the configured value.
    - You could decide not to split by dimensions when you want a condition applied to multiple resources in the scope. For example, you wouldn't use dimensions if you want to fire an alert if at least five machines in the resource group scope have CPU usage above the configured value.

    In general, if your alert rule scope is a workspace, the alerts are fired on the workspace. If you want a separate alert for each affected Azure resource, you can:

    - Use the Azure Resource Manager **Azure Resource ID** column as a dimension. When you use this option, the alert is fired on the workspace with the **Azure Resource ID** column as a dimension.
    - Specify the alert as a dimension in the **Azure Resource ID** property. This option makes the resource that your query returns the target of the alert. Alerts are then fired on the resource that your query returns, such as a virtual machine or a storage account, as opposed to the workspace.

      When you use this option, if the workspace  gets data from resources in more than one subscription, alerts can be triggered on resources from a subscription that's different from the alert rule subscription.

    Select values for these fields:

    |Field  |Description  |
    |---------|---------|
    |**Dimension name**|Dimensions can be either number or string columns. Dimensions are used to monitor specific time series and provide context to a fired alert.|
    |**Operator**|The operator that's used on the dimension name and value.  |
    |**Dimension values**|The dimension values are based on data from the last 48 hours. Select **Add custom value** to add custom dimension values.  |
    |**Include all future values**| Select this field to include any future values added to the selected dimension.  |

    :::image type="content" source="media/alerts-create-new-alert-rule/alerts-create-log-rule-dimensions.png" alt-text="Screenshot that shows the section for splitting by dimensions in a new log search alert rule.":::

1. In the **Alert logic** section, select values for these fields:

    |Field  |Description  |
    |---------|---------|
    |**Operator**| The query results are transformed into a number. In this field, select the operator to use for comparing the number against the threshold.|
    |**Threshold value**| A number value for the threshold. |
    |**Frequency of evaluation**|How often the query is run. You can set it anywhere from one minute to one day (24 hours).|

    :::image type="content" source="media/alerts-create-new-alert-rule/alerts-create-log-rule-logic.png" alt-text="Screenshot that shows the section for alert logic in a new log search alert rule.":::

    > [!NOTE]
    > The frequency is not a specific time that the alert runs every day. It's how often the alert rule runs.
    >
    > There are some limitations to using an alert rule frequency of <a name="frequency">one minute</a>. When you set the alert rule frequency to one minute, an internal manipulation is performed to optimize the query. This manipulation can cause the query to fail if it contains unsupported operations. The most common reasons why a query isn't supported are:
    >
    > - The query contains the `search`, `union`, or `take` (limit) operation.
    > - The query contains the `ingestion_time()` function.
    > - The query uses the `adx` pattern.
    > - The query calls a function that calls other tables.

    [Sample log search alert queries](./alerts-log-alert-query-samples.md) are available for Azure Data Explorer and Resource Graph.

1. (Optional) In the **Advanced options** section, you can specify the number of failures and the alert evaluation period that's required to trigger an alert. For example, if you set **Aggregation granularity** to 5 minutes, you can specify that you want to trigger an alert only if three failures (15 minutes) happened in the last hour. Your application's business policy determines this setting.

    Select values for these fields under **Number of violations to trigger the alert**:

   |Field  |Description  |
   |---------|---------|
   |**Number of violations**|The number of violations that trigger the alert.|
   |**Evaluation period**|The time period within which the number of violations occur. |
   |**Override query time range**| If you want the alert evaluation period to be different from the query time range, enter a time range here.<br> The alert time range is limited to a maximum of two days. Even if the query contains an `ago` command with a time range of longer than two days, the two-day maximum time range is applied. For example, even if the query text contains `ago(7d)`, the query only scans up to two days of data. If the query requires more data than the alert evaluation, you can change the time range manually. If the query contains an `ago` command, it changes automatically to two days (48 hours).|

   :::image type="content" source="media/alerts-create-new-alert-rule/alerts-rule-preview-advanced-options.png" alt-text="Screenshot that shows the section for advanced options in a new log search alert rule.":::

   > [!NOTE]
   > If you or your administrator assigned the Azure policy **Azure Log Search Alerts over Log Analytics workspaces should use customer-managed keys**, you must select **Check workspace linked storage**. If you don't, the rule creation will fail because it won't meet the policy requirements.

1. The **Preview** chart shows the results of query evaluations over time. You can change the chart period or select different time series that resulted from a unique alert splitting by dimensions.

    :::image type="content" source="media/alerts-create-new-alert-rule/alerts-create-alert-rule-preview.png" alt-text="Screenshot that shows a preview of a new alert rule.":::

1. Select **Done**. From this point on, you can select the **Review + create** button at any time.

[!INCLUDE [alerts-wizard-actions](../includes/alerts-wizard-actions.md)]

## Configure alert rule details

1. On the **Details** tab, under **Project details**, select the **Subscription** and **Resource group** values.

1. Under **Alert rule details**:

    1. Select the **Severity** value.
    1. Enter values for **Alert rule name** and **Alert rule description**.

       > [!NOTE]
       > A rule that uses an identity can't have the semicolon (;) character in the **Alert rule name** value.
    1. Select the **Region** value.

1. <a name="managed-id"></a>In the **Identity** section, select which identity the log search alert rule uses for authentication when it sends the log query.

    Keep these points in mind when you're selecting an identity:

    - A managed identity is required if you're sending a query to Azure Data Explorer or Resource Graph.
    - Use a managed identity if you want to be able to view or edit the permissions associated with the alert rule.
    - If you don't use a managed identity, the alert rule permissions are based on the permissions of the last user to edit the rule, at the time that the rule was last edited.
    - Use a managed identity to help you avoid a case where the rule doesn't work as expected because the user who last edited the rule didn't have permissions for all the resources added to the scope of the rule.

    The identity associated with the rule must have these roles:

    - If the query is accessing a Log Analytics workspace, the identity must be assigned a *reader* role for all workspaces that the query accesses. If you're creating resource-centric log search alerts, the alert rule might access multiple workspaces, and the identity must have a reader role on all of them.
    - If you're querying an Azure Data Explorer or Resource Graph cluster, you must add the *reader* role for all data sources that the query accesses. For example, if the query is resource centric, it needs a reader role on that resource.
    - If the query is [accessing a remote Azure Data Explorer cluster](../logs/azure-monitor-data-explorer-proxy.md), the identity must be assigned:
      - A *reader* role for all data sources that the query accesses. For example, if the query is calling a remote Azure Data Explorer cluster by using the `adx()` function, it needs a reader role on that Azure Data Explorer cluster.
      - A *database viewer* role for all databases that the query accesses.

    For detailed information on managed identities, see [Managed identities for Azure resources](../../active-directory/managed-identities-azure-resources/overview.md).

    Select one of the following options for the identity that the alert rule uses:

    |Identity option  |Description  |
    |---------|---------|
    |**None**|Alert rule permissions are based on the permissions of the last user who edited the rule, at the time that the rule was edited.|
    |**Enable system assigned managed identity**| Azure creates a new, dedicated identity for this alert rule. This identity has no permissions and is automatically deleted when the rule is deleted. After you create the rule, you must assign permissions to this identity to access the necessary workspace and data sources for the query. For more information about assigning permissions, see [Assign Azure roles using the Azure portal](../../role-based-access-control/role-assignments-portal.yml). Log search alert rules that use linked storage are not supported. |
    |**Enable user assigned managed identity**|Before you create the alert rule, you [create an identity](../../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md#create-a-user-assigned-managed-identity) and assign it appropriate permissions for the log query. This is a regular Azure identity. You can use one identity in multiple alert rules. The identity isn't deleted when the rule is deleted. When you select this type of identity, a pane opens for you to select the associated identity for the rule. |

    :::image type="content" source="media/alerts-create-new-alert-rule/alerts-log-rule-details-tab.png" alt-text="Screenshot that shows the Details tab for creating a new log search alert rule.":::

1. (Optional) In the <a name="advanced"></a>**Advanced options** section, you can set several options:

    |Field |Description |
    |---------|---------|
    |**Enable upon creation**| Select this option to make the alert rule start running as soon as you finish creating it.|
    |**Automatically resolve alerts** |Select this option to make the alert stateful. When an alert is stateful, the alert is resolved when the condition is no longer met for a specific time range. The time range differs based on the frequency of the alert:<br>**1 minute**: The alert condition isn't met for 10 minutes.<br>**5 to 15 minutes**: The alert condition isn't met for three frequency periods.<br>**15 minutes to 11 hours**: The alert condition isn't met for two frequency periods.<br>**11 to 12 hours**: The alert condition isn't met for one frequency period. <br><br>Note that stateful log search alerts have [these limitations](/azure/azure-monitor/service-limits#alerts).|
    |**Mute actions** |Select this option to set a period of time to wait before alert actions are triggered again. In the **Mute actions for** field that appears, select the amount of time to wait after an alert is fired before triggering actions again.|
    |**Check workspace linked storage**|Select this option if workspace linked storage for alerts is configured. If no linked storage is configured, the rule isn't created.|

1. [!INCLUDE [alerts-wizard-custom=properties](../includes/alerts-wizard-custom-properties.md)]

[!INCLUDE [alerts-wizard-finish](../includes/alerts-wizard-finish.md)]

## Related content

- [Get samples of log search alert queries](./alerts-log-alert-query-samples.md)
- [View and manage your alert instances](alerts-manage-alert-instances.md)

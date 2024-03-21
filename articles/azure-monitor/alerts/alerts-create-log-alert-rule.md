---
title: Create Azure Monitor log search alert rules
description: This article shows you how to create a new log search alert rule.
author: AbbyMSFT
ms.author: abbyweisberg
ms.topic: how-to
ms.date: 02/28/2024
ms.reviewer: nolavime
---

# Create or edit a log search alert rule

This article shows you how to create a new log search alert rule or edit an existing log search alert rule. To learn more about alerts, see the [alerts overview](alerts-overview.md).

You create an alert rule by combining the resources to be monitored, the monitoring data from the resource, and the conditions that you want to trigger the alert. You can then define [action groups](./action-groups.md) and [alert processing rules](alerts-action-rules.md) to determine what happens when an alert is triggered.

Alerts triggered by these alert rules contain a payload that uses the [common alert schema](alerts-common-schema.md).

[!INCLUDE [alerts-wizard-access](../includes/alerts-wizard-access.md)]

### Edit an existing alert rule

1. In the [portal](https://portal.azure.com/), either from the home page or from a specific resource, select **Alerts** from the left pane.
1. Select **Alert rules**.
1. Select the alert rule you want to edit, and then select **Edit**.

    :::image type="content" source="media/alerts-create-log-alert-rule/alerts-edit-log-search-alert-rule.png" alt-text="Screenshot that shows steps to edit an existing log search alert rule.":::
1. Select any of the tabs for the alert rule to edit the settings.

[!INCLUDE [alerts-wizard-scope](../includes/alerts-wizard-scope.md)]

## Configure the alert rule conditions

1. On the **Condition** tab, when you select the **Signal name** field, the most commonly used signals are displayed in the drop-down list. Select one of these popular signals, or select **See all signals** if you want to choose a different signal for the condition.

    :::image type="content" source="media/alerts-create-new-alert-rule/alerts-popular-signals.png" alt-text="Screenshot that shows popular signals when creating an alert rule.":::

1. (Optional) If you chose to **See all signals** in the previous step, use the **Select a signal** pane to search for the signal name or filter the list of signals. Filter by:
    - **Signal type**: The [type of alert rule](alerts-overview.md#types-of-alerts) you're creating.
    - **Signal source**: The service that sends the "Custom log search" and "Log (saved query)" signals.
    Select the **Signal name** and **Apply**.

1.  On the **Logs** pane, write a query that returns the log events for which you want to create an alert. To use one of the predefined alert rule queries, expand the **Schema and filter** pane on the left of the **Logs** pane. Then select the **Queries** tab, and select one of the queries.

    > [!NOTE]
    > * Log search alert rule queries do not support the 'bag_unpack()', 'pivot()' and 'narrow()' plugins.
    > * The word "AggregatedValue" is a reserved word, it cannot be used in the query on Log search Alerts rules.

    :::image type="content" source="media/alerts-create-new-alert-rule/alerts-log-rule-query-pane.png" alt-text="Screenshot that shows the Query pane when creating a new log search alert rule.":::
      
1. (Optional) If you're querying an ADX or ARG cluster, Log Analytics can't automatically identify the column with the event timestamp, so we recommend that you add a time range filter to the query. For example:

    ```KQL
        adx('https://help.kusto.windows.net/Samples').table    
        | where MyTS >= ago(5m) and MyTS <= now()
    ```     
    
    ```KQL
        arg("").Resources
        | where type =~ 'Microsoft.Compute/virtualMachines'
        | project _ResourceId=tolower(id), tags
    ```

    :::image type="content" source="media/alerts-create-new-alert-rule/alerts-logs-conditions-tab.png" alt-text="Screenshot that shows the Condition tab when creating a new log search alert rule.":::

    For sample log search alert queries that query ARG or ADX, see [Log search alert query samples](./alerts-log-alert-query-samples.md)

   For limitations:
   * [Cross-service query limitations](../logs/azure-monitor-data-explorer-proxy.md#limitations)
   * [Combine Azure Resource Graph tables with a Log Analytics workspace](../logs/azure-monitor-data-explorer-proxy.md#combine-azure-resource-graph-tables-with-a-log-analytics-workspace)
   * Not supported in government clouds

1. Select **Run** to run the alert.
1. The **Preview** section shows you the query results. When you're finished editing your query, select **Continue Editing Alert**.
1. The **Condition** tab opens populated with your log query. By default, the rule counts the number of results in the last five minutes. If the system detects summarized query results, the rule is automatically updated with that information.

1. In the **Measurement** section, select values for these fields:

    :::image type="content" source="media/alerts-create-new-alert-rule/alerts-log-measurements.png" alt-text="Screenshot that shows the Measurement tab when creating a new log search alert rule.":::

    |Field  |Description  |
    |---------|---------|
    |Measure|Log search alerts can measure two different things, which can be used for different monitoring scenarios:<br> **Table rows**: The number of rows returned can be used to work with events such as Windows event logs, Syslog, and application exceptions. <br>**Calculation of a numeric column**: Calculations based on any numeric column can be used to include any number of resources. An example is CPU percentage.      |
    |Aggregation type| The calculation performed on multiple records to aggregate them to one numeric value by using the aggregation granularity. Examples are Total, Average, Minimum, or Maximum.    |
    |Aggregation granularity| The interval for aggregating multiple records to one numeric value.|


1. <a name="dimensions"></a>(Optional) In the **Split by dimensions** section, you can use dimensions to help provide context for the triggered alert.

    :::image type="content" source="media/alerts-create-new-alert-rule/alerts-create-log-rule-dimensions.png" alt-text="Screenshot that shows the splitting by dimensions section of a new log search alert rule.":::

    Dimensions are columns from your query results that contain additional data. When you use dimensions, the alert rule groups the query results by the dimension values and evaluates the results of each group separately. If the condition is met, the rule fires an alert for that group. The alert payload includes the combination that triggered the alert.

    You can apply up to six dimensions per alert rule. Dimensions can only be string or numeric columns. If you want to use a column that isn't a number or string type as a dimension, you must convert it to a string or numeric value in your query. If you select more than one dimension value, each time series that results from the combination triggers its own alert and is charged separately.

    For example:
    -  You could use dimensions to monitor CPU usage on multiple instances running your website or app. Each instance is monitored individually, and notifications are sent for each instance where the CPU usage exceeds the configured value.
    - You could decide not to split by dimensions when you want a condition applied to multiple resources in the scope. For example, you wouldn't use dimensions if you want to fire an alert if at least five machines in the resource group scope have CPU usage above the configured value.

    Select values for these fields:

    -  **Resource ID column**: In general, if your alert rule scope is a workspace, the alerts are fired on the workspace. If you want a separate alert for each affected Azure resource, you can:
        - use the ARM **Azure Resource ID** column as a dimension (notice that by using this option the alert will be fired on the **workspace** with the **Azure Resource ID** column as a dimension.
        - specify it as a dimension in the Azure Resource ID property, which makes the resource returned by your query the target of the alert, so alerts are fired on the resource returned by your query, such as a virtual machine or a storage account, as opposed to in the workspace. When you use this option, if the workspace  gets data from resources in more than one subscription, alerts can be triggered on resources from a subscription that is different from the alert rule subscription. 

    |Field  |Description  |
    |---------|---------|
    |Dimension name|Dimensions can be either number or string columns. Dimensions are used to monitor specific time series and provide context to a fired alert.|
    |Operator|The operator used on the dimension name and value.  |
    |Dimension values|The dimension values are based on data from the last 48 hours. Select **Add custom value** to add custom dimension values.  |
    |Include all future values| Select this field to include any future values added to the selected dimension.  |

1. In the **Alert logic** section, select values for these fields:

    :::image type="content" source="media/alerts-create-new-alert-rule/alerts-create-log-rule-logic.png" alt-text="Screenshot that shows the Alert logic section of a new log search alert rule.":::

    |Field  |Description  |
    |---------|---------|
    |Operator| The query results are transformed into a number. In this field, select the operator to use to compare the number against the threshold.|
    |Threshold value| A number value for the threshold. |
    |Frequency of evaluation|How often the query is run. Can be set anywhere from one minute to one day (24 hours).|

    > [!NOTE]
    > There are some limitations to using a <a name="frequency">one minute</a> alert rule frequency. When you set the alert rule frequency to one minute, an internal manipulation is performed to optimize the query. This manipulation can cause the query to fail if it contains unsupported operations. The following are the most common reasons a query are not supported: 
    > * The query contains the **search**, **union** * or **take** (limit) operations
    > * The query contains the **ingestion_time()** function
    > * The query uses the **adx** pattern
    > * The query calls a function that calls other tables

    For sample log search alert queries that query ARG or ADX, see [Log search alert query samples](./alerts-log-alert-query-samples.md)

1. (Optional) In the **Advanced options** section, you can specify the number of failures and the alert evaluation period required to trigger an alert. For example, if you set **Aggregation granularity** to 5 minutes, you can specify that you only want to trigger an alert if there were three failures (15 minutes) in the last hour. Your application business policy determines this setting.

    :::image type="content" source="media/alerts-create-new-alert-rule/alerts-rule-preview-advanced-options.png" alt-text="Screenshot that shows the Advanced options section of a new log search alert rule.":::

    Select values for these fields under **Number of violations to trigger the alert**:

   |Field  |Description  |
   |---------|---------|
   |Number of violations|The number of violations that trigger the alert.|
   |Evaluation period|The time period within which the number of violations occur. |
   |Override query time range| If you want the alert evaluation period to be different than the query time range, enter a time range here.<br> The alert time range is limited to a maximum of two days. Even if the query contains an **ago** command with a time range of longer than two days, the two-day maximum time range is applied. For example, even if the query text contains **ago(7d)**, the query only scans up to two days of data. If the query requires more data than the alert evaluation, you can change the time range manually. If the query contains an **ago** command, it will be changed automatically to 2 days (48 hours).|
   
   > [!NOTE]
    > If you or your administrator assigned the Azure Policy **Azure Log Search Alerts over Log Analytics workspaces should use customer-managed keys**, you must select **Check workspace linked storage**. If you don't, the rule creation will fail because it won't meet the policy requirements.

1. The **Preview** chart shows query evaluations results over time. You can change the chart period or select different time series that resulted from a unique alert splitting by dimensions.

    :::image type="content" source="media/alerts-create-new-alert-rule/alerts-create-alert-rule-preview.png" alt-text="Screenshot that shows a preview of a new alert rule.":::

1. Select **Done**. From this point on, you can select the **Review + create** button at any time.

[!INCLUDE [alerts-wizard-actions](../includes/alerts-wizard-actions.md)]


## Configure the alert rule details

1. On the **Details** tab, define the **Project details**.
    - Select the **Subscription**.
    - Select the **Resource group**.

1. Define the **Alert rule details**.

   :::image type="content" source="media/alerts-create-new-alert-rule/alerts-log-rule-details-tab.png" alt-text="Screenshot that shows the Details tab when creating a new log search alert rule.":::

    1. Select the **Severity**.
    1. Enter values for the **Alert rule name** and the **Alert rule description**.
    1. Select the **Region**.
    1. <a name="managed-id"></a>In the **Identity** section, select which identity is used by the log search alert rule to send the log query. This identity is used for authentication when the alert rule executes the log query.

        Keep these things in mind when selecting an identity:
        - A managed identity is required if you're sending a query to Azure Data Explorer.
        - Use a managed identity if you want to be able to see or edit the permissions associated with the alert rule.
        - If you don't use a managed identity, the alert rule permissions are based on the permissions of the last user to edit the rule, at the time the rule was last edited.
        - Use a managed identity to help you avoid a case where the rule doesn't work as expected because the user that last edited the rule didn't have permissions for all the resources added to the scope of the rule.

        The identity associated with the rule must have these roles:
        - If the query is accessing a Log Analytics workspace, the identity must be assigned a **Reader role** for all workspaces accessed by the query. If you're creating resource-centric log search alerts, the alert rule may access multiple workspaces, and the identity must have a reader role on all of them.
        - If you are querying an ADX or ARG cluster you must add **Reader role** for all data sources accessed by the query. For example, if the query is resource centric, it needs a reader role on that resources. 
        - If the query is [accessing a remote Azure Data Explorer cluster](../logs/azure-monitor-data-explorer-proxy.md), the identity must be assigned:
            - **Reader role** for all data sources accessed by the query. For example, if the query is calling a remote Azure Data Explorer cluster using the adx() function, it needs a reader role on that ADX cluster.
            - **Database viewer** for all databases the query is accessing.

        For detailed information on managed identities, see [managed identities for Azure resources](../../active-directory/managed-identities-azure-resources/overview.md).

        Select one of the following options for the identity used by the alert rule:

        |Identity  |Description  |
        |---------|---------|
        |None|Alert rule permissions are based on the permissions of the last user who edited the rule, at the time the rule was edited.|
        |System assigned managed identity| Azure creates a new, dedicated identity for this alert rule. This identity has no permissions and is automatically deleted when the rule is deleted. After creating the rule, you must assign permissions to this identity to access the workspace and data sources needed for the query. For more information about assigning permissions, see [Assign Azure roles using the Azure portal](../../role-based-access-control/role-assignments-portal.md). |
        |User assigned managed identity|Before you create the alert rule, you [create an identity](../../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md#create-a-user-assigned-managed-identity) and assign it appropriate permissions for the log query. This is a regular Azure identity. You can use one identity in multiple alert rules. The identity isn't deleted when the rule is deleted. When you select this type of identity, a pane opens for you to select the associated identity for the rule. |

1. (Optional) In the **Advanced options** section, you can set several options:

    |Field |Description |
    |---------|---------|
    |Enable upon creation| Select for the alert rule to start running as soon as you're done creating it.|
    |Automatically resolve alerts (preview) |Select to make the alert stateful. When an alert is stateful, the alert is resolved when the condition is no longer met for a specific time range. The time range differs based on the frequency of the alert:<br>**1 minute**: The alert condition isn't met for 10 minutes.<br>**5-15 minutes**: The alert condition isn't met for three frequency periods.<br>**15 minutes - 11 hours**: The alert condition isn't met for two frequency periods.<br>**11 to 12 hours**: The alert condition isn't met for one frequency period. <br><br>Note that stateful log search alerts have these limitations:<br> - they can trigger up to 300 alerts per evaluation.<br> - you can have a maximum of 5000 alerts with the `fired` alert condition.|
    |Mute actions |Select to set a period of time to wait before alert actions are triggered again. If you select this checkbox, the **Mute actions for** field appears to select the amount of time to wait after an alert is fired before triggering actions again.|
    |Check workspace linked storage|Select if logs workspace linked storage for alerts is configured. If no linked storage is configured, the rule isn't created.|

1. [!INCLUDE [alerts-wizard-custom=properties](../includes/alerts-wizard-custom-properties.md)]

[!INCLUDE [alerts-wizard-finish](../includes/alerts-wizard-finish.md)]


## Next steps
- [Log search alert query samples](./alerts-log-alert-query-samples.md) 
- [View and manage your alert instances](alerts-manage-alert-instances.md)

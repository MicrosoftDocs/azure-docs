---
title: Create Azure Monitor metric alert rules
description: This article shows you how to create a new metric alert rule.
author: AbbyMSFT
ms.author: abbyweisberg
ms.topic: how-to
ms.date: 11/27/2023
ms.reviewer: harelbr
---

# Create or edit a metric alert rule

This article shows you how to create a new metric alert rule or edit an existing metric alert rule. To learn more about alerts, see the [alerts overview](alerts-overview.md).

You create an alert rule by combining the resources to be monitored, the monitoring data from the resource, and the conditions that you want to trigger the alert. You can then define [action groups](./action-groups.md) and [alert processing rules](alerts-action-rules.md) to determine what happens when an alert is triggered.

Alerts triggered by these alert rules contain a payload that uses the [common alert schema](alerts-common-schema.md).

[!INCLUDE [alerts-wizard-access](../includes/alerts-wizard-access.md)]

[!INCLUDE [alerts-wizard-scope](../includes/alerts-wizard-scope.md)]

## Configure the alert rule conditions

1. On the **Condition** tab, when you select the **Signal name** field, the most commonly used signals are displayed in the drop-down list. Select one of these popular signals, or select **See all signals** if you want to choose a different signal for the condition.

    :::image type="content" source="media/alerts-create-new-alert-rule/alerts-popular-signals.png" alt-text="Screenshot that shows popular signals when creating an alert rule.":::

1. (Optional) If you chose to **See all signals** in the previous step, use the **Select a signal** pane to search for the signal name or filter the list of signals. Filter by:
    - **Signal type**: The [type of alert rule](alerts-overview.md#types-of-alerts) you're creating.
    - **Signal source**: The service sending the signal.

    This table describes the services available for metric alert rules:

    |Signal source  |Description  |
    |---------|---------|
    |Platform   |For metric signals, the monitor service is the metric namespace. "Platform" means the metrics are provided by the resource provider, namely, Azure.|
    |Azure.ApplicationInsights|Customer-reported metrics, sent by the Application Insights SDK. |
    |Azure.VM.Windows.GuestMetrics   |VM guest metrics, collected by an extension running on the VM. Can include built-in operating system perf counters and custom perf counters.        |
    |\<your custom namespace\>|A custom metric namespace, containing custom metrics sent with the Azure Monitor Metrics API.         |

    Select the **Signal name** and **Apply**.

1.  Preview the results of the selected metric signal in the **Preview** section. Select values for the following fields.

    |Field|Description|
    |---------|---------|
    |Time range|The time range to include in the results. Can be from the last six hours to the last week.|
    |Time series|The time series to include in the results.|

1. In the **Alert logic** section:

    |Field |Description |
    |---------|---------|
    |Threshold|Select if the threshold should be evaluated based on a static value or a dynamic value.<br>A **static threshold** evaluates the rule by using the threshold value that you configure.<br>**Dynamic thresholds** use machine learning algorithms to continuously learn the metric behavior patterns and calculate the appropriate thresholds for unexpected behavior. You can learn more about using [dynamic thresholds for metric alerts](alerts-types.md#apply-advanced-machine-learning-with-dynamic-thresholds). |
    |Operator|Select the operator for comparing the metric value against the threshold. <br>If you're using dynamic thresholds, alert rules can use tailored thresholds based on metric behavior for both upper and lower bounds in the same alert rule. Select one of these operators: <br> - Greater than the upper threshold or lower than the lower threshold (default) <br> - Greater than the upper threshold <br> - Lower than the lower threshold|
    |Aggregation type|Select the aggregation function to apply on the data points: Sum, Count, Average, Min, or Max.|
    |Threshold value|If you selected a **static** threshold, enter the threshold value for the condition logic.|
    |Unit|If the selected metric signal supports different units, such as bytes, KB, MB, and GB, and if you selected a **static** threshold, enter the unit for the condition logic.|
    |Threshold sensitivity|If you selected a **dynamic** threshold, enter the sensitivity level. The sensitivity level affects the amount of deviation from the metric series pattern that's required to trigger an alert. <br> - **High**: Thresholds are tight and close to the metric series pattern. An alert rule is triggered on the smallest deviation, resulting in more alerts. <br> - **Medium**: Thresholds are less tight and more balanced. There are fewer alerts than with high sensitivity (default). <br> - **Low**: Thresholds are loose, allowing greater deviation from the metric series pattern. Alert rules are only triggered on large deviations, resulting in fewer alerts.|
    |Aggregation granularity| Select the interval that's used to group the data points by using the aggregation type function. Choose an **Aggregation granularity** (period) that's greater than the **Frequency of evaluation** to reduce the likelihood of missing the first evaluation period of an added time series.|
    |Frequency of evaluation|Select how often the alert rule is to be run. Select a frequency that's smaller than the aggregation granularity to generate a sliding window for the evaluation.|

1. (Optional) You can configure splitting by dimensions.

    Dimensions are name-value pairs that contain more data about the metric value. By using dimensions, you can filter the metrics and monitor specific time-series, instead of monitoring the aggregate of all the dimensional values.
    
    If you select more than one dimension value, each time series that results from the combination triggers its own alert and is charged separately. For example, the transactions metric of a storage account can have an API name dimension that contains the name of the API called by each transaction (for example, GetBlob, DeleteBlob, and PutPage). You can choose to have an alert fired when there's a high number of transactions in a specific API (the aggregated data). Or you can use dimensions to alert only when the number of transactions is high for specific APIs.
    
    |Field  |Description  |
    |---------|---------|
    |Dimension name|Dimensions can be either number or string columns. Dimensions are used to monitor specific time series and provide context to a fired alert.<br>Splitting on the **Azure Resource ID** column makes the specified resource into the alert target. If detected, the **ResourceID** column is selected automatically and changes the context of the fired alert to the record's resource.|
    |Operator|The operator used on the dimension name and value.|
    |Dimension values|The dimension values are based on data from the last 48 hours. Select **Add custom value** to add custom dimension values.|
    |Include all future values| Select this field to include any future values added to the selected dimension.|

1. (Optional) In the **When to evaluate** section: 

    |Field |Description |
    |---------|---------|
    |Check every|Select how often the alert rule checks if the condition is met.    |
    |Lookback period|Select how far back to look each time the data is checked. For example, every 1 minute, look back 5 minutes.|

1. (Optional) In the **Advanced options** section, you can specify how many failures within a specific time period trigger an alert. For example, you can specify that you only want to trigger an alert if there were three failures in the last hour. Your application business policy should determine this setting. 

    Select values for these fields:
    
    |Field  |Description  |
    |---------|---------|
    |Number of violations|The number of violations within the configured time frame that trigger the alert.|
    |Evaluation period|The time period within which the number of violations occur.|
    |Ignore data before|Use this setting to select the date from which to start using the metric historical data for calculating the dynamic thresholds. For example, if a resource was running in testing mode and is moved to production, you may want to disregard the metric behavior while the resource was in testing.|

1. Select **Done**. From this point on, you can select the **Review + create** button at any time.

[!INCLUDE [alerts-wizard-actions](../includes/alerts-wizard-actions.md)]


## Configure the alert rule details

1. On the **Details** tab, define the **Project details**.
    - Select the **Subscription**.
    - Select the **Resource group**.

1. Define the **Alert rule details**.

    :::image type="content" source="media/alerts-create-new-alert-rule/alerts-metric-rule-details-tab.png" alt-text="Screenshot that shows the Details tab when creating a new alert rule.":::

1. Select the **Severity**.
1. Enter values for the **Alert rule name** and the **Alert rule description**.
1. (Optional) If you're creating a metric alert rule that monitors a custom metric with the scope defined as one of the following regions and you want to make sure that the data processing for the alert rule takes place within that region, you can select to process the alert rule in one of these regions:
    - North Europe
    - West Europe
    - Sweden Central
    - Germany West Central 

1. (Optional) In the **Advanced options** section, you can set several options.

    |Field |Description |
    |---------|---------|
    |Enable upon creation| Select for the alert rule to start running as soon as you're done creating it.|
    |Automatically resolve alerts (preview) |Select to make the alert stateful. When an alert is stateful, the alert is resolved when the condition is no longer met.<br> If you don't select this checkbox, metric alerts are stateless. Stateless alerts fire each time the condition is met, even if alert already fired.<br> The frequency of notifications for stateless metric alerts differs based on the alert rule's configured frequency:<br>**Alert frequency of less than 5 minutes**: While the condition continues to be met, a notification is sent somewhere between one and six minutes.<br>**Alert frequency of more than 5 minutes**: While the condition continues to be met, a notification is sent between the configured frequency and doubles the value of the frequency. For example, for an alert rule with a frequency of 15 minutes, a notification is sent somewhere between 15 to 30 minutes.|

1. [!INCLUDE [alerts-wizard-custom=properties](../includes/alerts-wizard-custom-properties.md)]

[!INCLUDE [alerts-wizard-finish](../includes/alerts-wizard-finish.md)]


## Next steps
 [View and manage your alert instances](alerts-manage-alert-instances.md)
---
title: Create alerts and notifications in the Azure portal
titleSuffix: Azure Synapse Analytics
description: Use the Azure portal to create alerts for Azure Synapse Analytics dedicated SQL pools.
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.reviewer: srsaluru
ms.date: 10/07/2026
ms.service: azure-synapse-analytics
ms.subservice: sql
ms.topic: how-to
---
# Create alerts for Azure Synapse Analytics by using the Azure portal

This article shows you how to set up alerts for Azure Synapse Analytics dedicated SQL pools by using the Azure portal. Alerts can send you an email or call a webhook when a metric, such as database size or CPU usage, reaches the threshold.

## Set up new alert rule

You can receive an alert based on monitoring metrics for, or events on, your Azure services.

- **Metric values** - The alert triggers when the value of a specified metric crosses a threshold you assign. For more information, see [Metric alerts](/azure/azure-monitor/alerts/alerts-types#metric-alerts).
- **Activity log events** - An alert can trigger on *every* event, or, only when a certain number of events occur. For more information, see [Activity log alerts](/azure/azure-monitor/alerts/alerts-types#activity-log-alerts).
- **Resource health** - An alert related to the resource health status events, including whether the event was platform or user-initiated. For more information, see [Resource health alerts](/azure/azure-monitor/alerts/alerts-types#resource-health-alerts).

You can configure many action types for an alert to perform when it triggers, including:

- Send email notifications to the service administrator and coadministrators
- Send email to additional emails that you specify, including for an Azure Resource Manager Role.
- Call a phone number with voice prompt
- Send text message to a phone number
- Send an Azure mobile app notification
- Start an automation runbook
- Call an Azure Function
- Start an Event Hubs action
- Create an ITSM-compatible ticket
- Select a logic app action
- Call a webhook or a secure webhook

You can configure and get information about alert rules using:

- **Azure portal**, as detailed in this article.
- [PowerShell](/azure/azure-monitor/alerts/alerts-create-rule-cli-powershell-arm#create-a-new-alert-rule-using-powershell)
- [Command-line interface (CLI)](/azure/azure-monitor/alerts/alerts-create-rule-cli-powershell-arm#create-a-new-alert-rule-using-the-cli)
- [ARM template](/azure/azure-monitor/alerts/alerts-create-rule-cli-powershell-arm#create-a-new-alert-rule-using-an-arm-template)
- [Azure Monitor REST API](/azure/azure-monitor/fundamentals/azure-monitor-rest-api-index)

## Get started with a new alert rule in the Azure portal

1. In the [Azure portal](https://portal.azure.com/), locate the resource you want to monitor and select it.
1. In the resource menu under **Monitoring**, select **Alerts**. The text and icon might vary slightly for different resources.
1. Select the **+ Create** button, and then select **Alert rule**.
1. On **Create an alert rule**, the **Scope** is automatically set to the individual resource.
   > [!NOTE]
   > To avoid sprawl of many independent alerts, consider configuring alerts for all resources of a type in a subscription, resource group, or logical server. Use the **Scope** tab to change the scope of the new alert rule.

  ### [Metric](#tab/metric)

  Capture activity peaks or sustained resource stress with alerts on the **Metrics** signal category.

  1. On the **Condition** tab, select **See all signals** and **Select a signal** from the list of **Metrics**.
    1. Select the desired metric, for example **CPU percentage**. Select **Apply**.
  1. After you select a signal, the **Alert logic** options appear. A preview of recent activity in this resource for that signal is also displayed.
  1. Configure a **Threshold** type to determine when the alert will take action. Choose **Aggregation type**, **Operator**, and **Threshold value** as desired. A typical threshold is: Static, Maximum, Greater than, 80%.

     |Field |Description |
     |---------|---------|
     |**Threshold**|Select if the threshold should be evaluated based on a static value or a dynamic value.<br>A **static threshold** evaluates the rule by using the threshold value that you configure.<br>**Dynamic thresholds** use machine learning algorithms to continuously learn the metric behavior patterns and calculate the appropriate thresholds for unexpected behavior. You can learn more about using [dynamic thresholds for metric alerts](/azure/azure-monitor/alerts/alerts-types#apply-advanced-machine-learning-with-dynamic-thresholds). |
     |**Operator**|Select the operator for comparing the metric value against the threshold. <br>If you're using dynamic thresholds, alert rules can use tailored thresholds based on metric behavior for both upper and lower bounds in the same alert rule. Select one of these operators: <br> - Greater than the upper threshold or lower than the lower threshold (default) <br> - Greater than the upper threshold <br> - Lower than the lower threshold|
     |**Aggregation type**|Select the aggregation function to apply on the data points: Sum, Count, Average, Min, or Max.|
     |**Threshold value**|If you selected a **static** threshold, enter the threshold value for the condition logic.|
     |**Unit**|If the selected metric signal supports different units, such as bytes, KB, MB, and GB, and if you selected a **static** threshold, enter the unit for the condition logic.|
     |**Threshold sensitivity**|If you selected a **dynamic** threshold, enter the sensitivity level. The sensitivity level affects the amount of deviation from the metric series pattern that's required to trigger an alert. <br> - **High**: Thresholds are tight and close to the metric series pattern. An alert rule is triggered on the smallest deviation, resulting in more alerts. <br> - **Medium**: Thresholds are less tight and more balanced. There are fewer alerts than with high sensitivity (default). <br> - **Low**: Thresholds are loose, allowing greater deviation from the metric series pattern. Alert rules are only triggered on large deviations, resulting in fewer alerts.|
     |**Aggregation granularity**| Select the interval that's used to group the data points by using the aggregation type function. Choose an **Aggregation granularity** (period) that's greater than the **Frequency of evaluation** to reduce the likelihood of missing the first evaluation period of an added time series.|
     |**Frequency of evaluation**|Select how often the alert rule is to be run. Select a frequency that's smaller than the aggregation granularity to generate a sliding window for the evaluation.|
  1. Under **When to evaluate**, determine the desired frequency of evaluation. Use the **Check every** and **Lookback period** dropdown lists.
  1. Optionally, add multiple conditions for this alert. Choose the **Add condition** alert if desired.
  1. Select **Next: Actions >**.

  ### [Activity log](#tab/activity-log)

  Capture events and configure alerts for administrative activity in the **Activity log** signal category.

  1. On the **Conditions** pane, select **See all signals**.
      - On the **Select a signal** pane, select the desired signal, such as **All Administrative options**. Select **Apply**.
  1. After you select a signal, the **Alert logic** options appear and the **Chart period** pane opens.
      - By default, the **Chart period** shows the last six hours of activity. The **Preview** chart shows you the results of your selection.
  1. Select values for each of these fields in the **Alert logic** section:

     |Field |Description |
     |---------|---------|
     |**Event level**| Select the level of the events for this alert rule. Values are **Critical**, **Error**, **Warning**, **Informational**, **Verbose**, and **All**.|
     |**Status**|Select the status levels for the alert.|
     |**Event initiated by**|Select the user or service principal that initiated the event.|
  1. Select **Next: Actions >**.

---

## Create the new alert rule

1. Select an existing [Action group](/azure/azure-monitor/alerts/action-groups) from the **Select action groups** pane, or **Create action group** in your subscription. An action group enables you to define the action to take when an alert condition occurs. This action defines what happens when you trigger an alert (for example, sending an email).
    - Alternatively, use the **Use quick actions** feature to create a new action group and provide an email or Azure mobile app notification target.
1. Select **Next: Details >**.
1. By default, an alert rule's severity is **3 - Informational**. Adjust the alert rule's **Severity** as desired.
1. Enter the **Alert rule name**. Optionally but recommended, provide a description.
1. Under **Advanced options**:
    - Ensure **Enable upon creation** is selected for the alert rule to start running as soon as you finish creating it.
    - The **Automatically resolve alerts** option is enabled by default. This setting makes the alert stateful, which means that the alert is resolved when the condition isn't met anymore.
1. Select **Next: Tags >**.
1. Consider using Azure tags. For example, use the "Owner" or "CreatedBy" tag to identify who created the resource, and the "Environment" tag to identify whether this resource is in production, development, and so on. For more information, see [Develop your naming and tagging strategy for Azure resources](/azure/cloud-adoption-framework/ready/azure-best-practices/naming-and-tagging).
1. Select **Review + create**.
1. Select **Create**. Soon, the alert is active.

## Manage alert rules

> [!NOTE]
> To suppress noisy alerts, see [Suppression of alerts using action rules](/azure/azure-monitor/alerts/alerts-action-rules#suppression-of-alerts).

Manage existing alerts from the **Alerts** menu in the Azure portal resource menu. To view, suspend, activate, modify, and delete existing alerts:

1. On the **Alerts** pane of your dedicated SQL pool, select **Alert rules**.

1. Select an individual existing alert rule to manage it. Modify and tune existing active rules to your preference. You can also suspend active rules without deleting them.

## Related content

- [Azure Monitor: Create or edit a metric alert rule](/azure/azure-monitor/alerts/alerts-create-metric-alert-rule)
- [Overview of alerts in Microsoft Azure](/azure/azure-monitor/alerts/alerts-overview)
- [Understand how metric alerts work in Azure Monitor](/azure/azure-monitor/alerts/alerts-metric-overview)

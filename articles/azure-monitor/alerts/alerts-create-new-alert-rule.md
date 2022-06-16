---
title: Create Azure Monitor alert rules 
description: Learn how to create a new alert rule.
author: AbbyMSFT
ms.author: abbyweisberg
ms.topic: conceptual
ms.date: 2/23/2022
ms.reviewer: harelbr
---
# Create a new alert rule

This article shows you how to create an alert rule. Learn more about alerts [here](alerts-overview.md).

You create an alert rule by combining:
 - The resource(s) to be monitored.
 - The signal or telemetry from the resource
 - Conditions

And then defining these elements for the resulting alert actions using:
 - [Alert processing rules](alerts-action-rules.md)
 - [Action groups](./action-groups.md). 
 
## Create a new alert rule in the Azure portal

1. In the [portal](https://portal.azure.com/), select **Monitor**, then **Alerts**.
1. Expand the **+ Create** menu, and select **Alert rule**.

   :::image type="content" source="media/alerts-create-new-alert-rule/alerts-create-new-alert-rule.png" alt-text="Screenshot showing steps to create new alert rule.":::

1. In the **Select a resource** pane, set the scope for your alert rule, and then select **Done**. 
   You can see the alert rule types available for the selected resource at the bottom right of the pane. 
   
   You can filter by:
   - Subscription
   - Resource type
   - Resource location
   - Search

   :::image type="content" source="media/alerts-create-new-alert-rule/alerts-select-resource.png" alt-text="Screenshot showing select resource pane for creating new alert rule."::: 

1. Select **Next: Condition>** at the bottom of the page, or select the **Conditions** tab at the top of the page.
1. In the **Select a signal** pane, filter the signals by **Signal type**, **Monitor service**,  or **Signal name**, and then select the signal to use for the alert rule.

 # [Log alerts](#tab/logs)
    
  1. In the **Conditions** pane, write a query that will return the log events for which you want to create an alert.
       
     You can use the [alert query examples article](../logs/queries.md) to understand what you can discover or [get started on writing your own query](../logs/log-analytics-tutorial.md). Also, [learn how to create optimized alert queries](alerts-log-query.md).
  1. Select **Run** to run the alert, and then select **Continue Editing Alert**
  1. From the top command bar, Select **+ New Alert rule**.
    
     :::image type="content" source="media/alerts-log/alerts-create-new-alert-rule.png" alt-text="Create new alert rule." lightbox="media/alerts-log/alerts-create-new-alert-rule-expanded.png":::

  1. The **Condition** tab opens, populated with your log query.
   
     By default, the rule counts the number of results in the last 5 minutes.
   
     If the system detects summarized query results, the rule is automatically updated with that information.
 
     :::image type="content" source="media/alerts-log/alerts-logs-conditions-tab.png" alt-text="Conditions Tab.":::

    
    
# [Metric alerts](#tab/metric)
   
   1. Configure the signal logic, and then select **Done**.
   
        |Setting |Description |
        |---------|---------|
        |Select time series|Select the time series to include in the results. |
        |Chart period|Select the time span to include in the results. Can be from the last 6 hours to the last week.      |
        |Threshold| Select if threshold should be evaluated based on a static value or a dynamic value.<br>A static threshold uses a user-defined threshold value to evaluate rule.<br>Dynamic Thresholds use machine learning algorithms to continuously learn the metric behavior pattern and calculate the appropriate threshold for unexpected behavior. Click here for more information about using dynamic thresholds for metric alerts.|
        |Operator|Select the operator for comparing the metric value against the threshold.|
        |Aggregation type|Select the aggregation function to apply on the data points: Sum, Count, Average, Min, or Max.          |
        |Threshold value| If you selected a **static** threshold, enter the threshold value for the condition logic.        |
        |Unit| If you selected a **static** threshold, enter the unit for the condition logic.        |
        |Threshold sensitivity|If you selected a **dynamic** threshold, enter the sensitivity level. The sensitivity level affects the amount of deviation from the metric series pattern is required to trigger an alert. |
        |Aggregation granularity|Select the interval over which data points are grouped using the aggregation type function.         |
        |Frequency of evaluation|Select the frequency on how often the alert rule should be run. Selecting frequency smaller than granularity of data points grouping will result in sliding window evaluation.         |
    1. (Optional.) Configure the advanced settings:
         
        
        |Setting  |Description  |
        |---------|---------|
        |Number of violations     |Select the minimum number of violations required within the selected lookback time window required to raise an alert.         |
        |Evaluation period    |         |
        |Ignore data before     |         | 
    
# [Activity Log alerts](#tab/activity-log)
   1.  In the **Conditions** pane.
    
    ---
 
1. In the **Conditions** pane,
  

## Next Steps

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

This article shows you how to create alert rules and manage your alert instances. Learn more about alerts [here](alerts-overview.md).

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
   
   You can filter by:
   - Subscription
   - Resource type
   - Resource location
   - Search
   
   You can see the alert rule types available for the selected resource at the bottom right of the pane. 

   :::image type="content" source="media/alerts-create-new-alert-rule/alerts-select-resource.png" alt-text="Screenshot showing select resource pane for creating new alert rule."::: 

1. Select **Next: Condition>** at the bottom of the page, or select the **Conditions** tab at the top of the page.
1. In the **Select a signal** pane, select the signals to use for the alert rule, and then select **Done**.

    |Field  |Description  |
    |---------|---------|
    |Signal type|The types of alert rule that can be used for this resource type: Metric, Log, or Activity Log. For more information about the alert rule types, see [this article](alerts-types.md).   |
    |Monitor service|The monitor service to include in the alert rule, if you want to filter the monitor service.  |
    |Signal name|The signal you want to include in the alert rule. |

1. In the **Conditions** pane,
   # [Log alerts](#tab/logs)
    
    1. Write a query that will return the log events for which you want to create an alert. You can use the [alert query examples article](../logs/queries.md) to understand what you can discover or [get started on writing your own query](../logs/log-analytics-tutorial.md). Also, [learn how to create optimized alert queries](alerts-log-query.md).
    1. From the top command bar, Select **+ New Alert rule**.
       :::image type="content" source="media/alerts-log/alerts-create-new-alert-rule.png" alt-text="Create new alert rule." lightbox="media/alerts-log/alerts-create-new-alert-rule-expanded.png":::  
    
    
    # [Metric alerts](#tab/metric)
    1. In the **Conditions** pane,
    
    # [Activity Log alerts](#tab/activity-log)
    1.  In the **Conditions** pane.
    
    ---

1. The **Condition** tab opens, populated with your log query.
   
   By default, the rule counts the number of results in the last 5 minutes.
   
   If the system detects summarized query results, the rule is automatically updated with that information.
 
    :::image type="content" source="media/alerts-log/alerts-logs-conditions-tab.png" alt-text="Conditions Tab.":::

## Next Steps

---
title: Create Azure Monitor alert rules 
description: Learn how to create a new alert rule.
author: AbbyMSFT
ms.author: abbyweisberg
ms.topic: conceptual
ms.date: 07/17/2022
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
 - [Action groups](./action-groups.md)
 
## Create a new alert rule in the Azure portal

1. In the [portal](https://portal.azure.com/), select **Monitor**, then **Alerts**.
2. Expand the **+ Create** menu, and select **Alert rule**.

   :::image type="content" source="media/alerts-create-new-alert-rule/alerts-create-new-alert-rule.png" alt-text="Screenshot showing steps to create new alert rule.":::

3. In the **Select a resource** pane, set the scope for your alert rule. You can filter by **subscription**, **resource type**, **resource location**, or do a search.
   You can see the **Available signal types** for your selected resource(s) at the bottom right of the pane.
      
   :::image type="content" source="media/alerts-create-new-alert-rule/alerts-select-resource.png" alt-text="Screenshot showing select resource pane for creating new alert rule."::: 

4. Select **Include all future resources** to include any future resources added to the selected scope.
5. Select **Done**.
6. Select **Next: Condition>** at the bottom of the page.
7. In the **Select a signal** pane, the **Signal type**, **Monitor service**,  and **Signal name** fields are pre-populated with the available values for your selected scope. Select any filters to narrow the resource list.
8. Select the signal you want to use for your alert rule.
9.    
  ## [Log alerts](#tab/logs)
   
  1. In the **Logs** pane, write a query that will return the log events for which you want to create an alert.
     You can use the [alert query examples article](../logs/queries.md) to understand what you can discover or [get started on writing your own query](../logs/log-analytics-tutorial.md). Also, [learn how to create optimized alert queries](alerts-log-query.md).
  1. Select **Run** to run the alert, and then select **Continue Editing Alert**.
  1. The **Condition** tab opens populated with your log query. By default, the rule counts the number of results in the last 5 minutes. If the system detects summarized query results, the rule is automatically updated with that information.
  
     :::image type="content" source="media/alerts-log/alerts-logs-conditions-tab.png" alt-text="Conditions Tab.":::

  1. In the **Measurement** section, select values for these fields:

     |Field  |Description  |
     |---------|---------|
     |Measure|Log alerts can measure two different things, which can be used for different monitoring scenarios:<br> **Table rows**: The number of rows returned can be used to work with events such as Windows event logs, syslog, application exceptions. <br>**Calculation of a numeric column**: Calculations based on any numeric column can be used to include any number of resources. For example, CPU percentage.      |
     |Aggregation type| The calculation performed on multiple records to aggregate them to one numeric value using the aggregation granularity. For example: Total, Average, Minimum, or Maximum.    |
     |Aggregation granularity| The interval for aggregating multiple records to one numeric value.|
    
     :::image type="content" source="media/alerts-log/alerts-log-measurements.png" alt-text="Measurements.":::

  1. (Optional) In the **Split by dimensions** section, you can use dimensions to monitor the values of multiple instances of a resource with one rule. You can create resource-centric alerts at scale for a subscription or resource group. When you split by dimensions,  combinations of numerical or string columns are grouped to monitor for the same condition on multiple Azure resources. For example, you can monitor CPU usage on multiple instances running your website or app. Each instance is monitored individually notifications are sent for each instance.
     If you select more than one dimension value, each time series that results from the combination triggers its own alert and is charged separately. The alert payload includes the combination that triggered the alert.
  
     You can select up to six more splittings for any columns that contain text or numbers.
  
     You can also decide **not** to split when you want a condition applied to multiple resources in the scope. For example, if you want to fire an alert if at least five machines in the resource group scope have CPU usage over 80%.  
  
     Select values for these fields:
    
     |Field  |Description  |
     |---------|---------|
     |Dimension name|Dimensions can be either number or string columns. Dimensions are used to monitor specific time series and provide context to a fired alert.<br>Splitting on the **Azure Resource ID** column makes the specified resource into the alert target. If detected, the **ResourceID** column is selected automatically and changes the context of the fired alert to the record's resource.  |
     |Operator|The operator used on the dimension name and value.  |
     |Dimension values|The dimension values are based on data from the last 48 hours. Select **Add custom value** to add custom dimension values.  |
     |Include all future values| Select this field to include any future values added to the selected dimension.  |
    
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
     |Number of violations|The number of violations that trigger the alert.|
     |Evaluation period|The time period within which the number of violations occur. |
     |Override query time range| If you want the alert evaluation period to be different than the query time range, enter a time range here.<br> The alert time range is limited to a maximum of two days. Even if the query contains an **ago** command with a time range of longer than 2 days, the 2 day maximum time range is applied. For example, even if the query text contains **ago(7d)**, the query only scans up to 2 days of data.<br> If the query requires more data than the alert evaluation, and there's no **ago** command in the query, you can change the time range manually.| 
       
     :::image type="content" source="media/alerts-log/alerts-rule-preview-advanced-options.png" alt-text="Screenshot of the advanced options section of a new log alert rule.":::
    
  1. The **Preview** chart shows query evaluations results over time. You can change the chart period or select different time series that resulted from unique alert splitting by dimensions.
    
     :::image type="content" source="media/alerts-log/alerts-create-alert-rule-preview.png" alt-text="Screenshot of a preview of a new alert rule.":::
            
  ## [Metric alerts](#tab/metric)
       
  1. In the **Configure signal logic** pane, select values for the following fields.
      
    |Setting |Description |
    |---------|---------|
    |Select time series|Select the time series to include in the results. |
    |Chart period|Select the time span to include in the results. Can be from the last 6 hours to the last week.      |

  1. (Optional) Depending on the signal type, you may see the **Split by dimensions** section. Dimensions are name-value pairs that contain more data about the metric value. Using dimensions allows you to filter the metrics and monitor specific time-series, instead of monitoring the aggregate of all the dimensional values.  Dimensions can be either number or string columns. If you select more than one dimension value, each time series that results from the combination will trigger its own alert and will be charged separately.
  
 For example, the transactions metric of a storage account can have an API name dimension that contains the name of the API called by each transaction (for example, GetBlob, DeleteBlob, PutPage). You can choose to have an alert fired when there's a high number of transactions in any API name (which is the aggregated data), or you can use dimensions to further break it down to alert only when the number of transactions is high for specific API names.

 To monitor for the same condition on multiple Azure resources, you can use splitting by dimensions. Splitting by dimensions allows you to create resource-centric alerts at scale for a subscription or resource group.  Alerts are split into separate alerts by grouping combinations. Splitting on Azure resource ID column makes the specified resource into the alert target.

 When you want a condition applied to multiple resources in the scope, you would **not** split by dimensions. For example, if you want to fire an alert if at least five machines in the resource group scope have CPU usage over 80%.
     
    |Field  |Description  |
    |---------|---------|
    |Dimension name|Dimensions can be either number or string columns. Dimensions are used to monitor specific time series and provide context to a fired alert.<br>Splitting on the **Azure Resource ID** column makes the specified resource into the alert target. If detected, the **ResourceID** column is selected automatically and changes the context of the fired alert to the record's resource.  |
    |Operator|The operator used on the dimension name and value.  |
    |Dimension values|The dimension values are based on data from the last 48 hours. Select **Add custom value** to add custom dimension values.  |
    |Include all future values| Select this field to include any future values added to the selected dimension.  |
   

   1. In the **Alert logic** section:
     
     |Setting |Description |
     |---------|---------|
     |Threshold| Select if threshold should be evaluated based on a static value or a dynamic value.<br>A static threshold evaluates the rule using the threshold value that you configure.<br>Dynamic Thresholds use machine learning algorithms to continuously learn the metric behavior patterns and calculate the appropriate thresholds for unexpected behavior. You can learn more about using [dynamic thresholds for metric alerts](alerts-types.md#dynamic-thresholds).|
     |Operator|Select the operator for comparing the metric value against the threshold.|
     |Aggregation type|Select the aggregation function to apply on the data points: Sum, Count, Average, Min, or Max.          |
     |Threshold value| If you selected a **static** threshold, enter the threshold value for the condition logic.        |
     |Unit| If you selected a **static** threshold, enter the unit for the condition logic.        |
     |Threshold sensitivity|If you selected a **dynamic** threshold, enter the sensitivity level. The sensitivity level affects the amount of deviation from the metric series pattern is required to trigger an alert. |
     |Aggregation granularity|Select the interval over which data points are grouped using the aggregation type function.         |
     |Frequency of evaluation|Select the frequency on how often the alert rule should be run. Selecting frequency smaller than granularity of data points grouping will result in sliding window evaluation.  |
       
   1. Select **Done**. 
  ## [Activity Log alerts](#tab/activity-log)

  1.  In the **Conditions** pane.
        
---

10. From this point on, you can select the **Review + create** button at any time.
11. In the **Actions** tab, select or create the required [action groups](./action-groups.md).

    :::image type="content" source="media/alerts-log/alerts-rule-actions-tab.png" alt-text="Actions tab.":::

12. In the **Details** tab, define the **Project details** and the **Alert rule details**.
13. (Optional) In the **Advanced options** section, you can set several options, including whether to **Enable upon creation**, or to **Mute actions** for a period of time after the alert rule fires.
    
    :::image type="content" source="media/alerts-log/alerts-rule-details-tab.png" alt-text="Details tab.":::

    > [!NOTE]
    > If you, or your administrator assigned the Azure Policy **Azure Log Search Alerts over Log Analytics workspaces should use customer-managed keys**, you must select **Check workspace linked storage** option in **Advanced options**, or the rule creation will fail as it will not meet the policy requirements.

14. In the **Tags** tab, set any required tags on the alert rule resource.

    :::image type="content" source="media/alerts-log/alerts-rule-tags-tab.png" alt-text="Tags tab.":::

15. In the **Review + create** tab, a validation will run and inform you of any issues.
16. When validation passes and you've reviewed the settings, select the **Create** button.    
    
    :::image type="content" source="media/alerts-log/alerts-rule-review-create.png" alt-text="Review and create tab.":::

> [!NOTE]
> This article describes creating alert rules using the alert rule wizard. 
> The new alert rule experience is a little different than the old experience. Please note these changes:
> - Previously, search results were included in the payloads of the triggered alert and its associated notifications. This was a limited solution, since the email included only 10 rows from the unfiltered results while the webhook payload contained 1000 unfiltered results.
>    To get detailed context information about the alert so that you can decide on the appropriate action :
>     - We recommend using [Dimensions](alerts-types.md#narrow-the-target-using-dimensions). Dimensions provide the column value that fired the alert, giving you context for why the alert fired and how to fix the issue.
>     - When you need to investigate in the logs, use the link in the alert to the search results in Logs.
>     - If you need the raw search results or for any other advanced customizations, use Logic Apps.
> - The new alert rule wizard does not support customization of the JSON payload.
>   - Use custom properties in the [new API](/rest/api/monitor/scheduledqueryrule-2021-08-01/scheduled-query-rules/create-or-update#actions) to add static parameters and associated values to the webhook actions triggered by the alert.
>    - For more advanced customizations, use Logic Apps.
> - The new alert rule wizard does not support customization of the email subject.
>     - Customers often use the custom email subject to indicate the resource on which the alert fired, instead of using the Log Analytics workspace. Use the [new API](alerts-unified-log.md#split-by-alert-dimensions) to trigger an alert of the desired resource using the resource id column.
>     - For more advanced customizations, use Logic Apps.
  
## Next Steps

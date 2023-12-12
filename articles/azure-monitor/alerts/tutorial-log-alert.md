---
title: Tutorial - Create a log query alert for an Azure resource
description: Tutorial to create a log query alert for an Azure resource.
ms.topic: tutorial
ms.date: 11/07/2023
---

# Tutorial: Create a log query alert for an Azure resource
Azure Monitor alerts proactively notify you when important conditions are found in your monitoring data. Log query alert rules create an alert when a log query returns a particular result. For example, receive an alert when a particular event is created on a virtual machine, or send a warning when excessive anonymous requests are made to a storage account.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Access prebuilt log queries designed to support alert rules for different kinds of resources
> * Create a log query alert rule
> * Create an action group to define notification details


## Prerequisites

To complete this tutorial you need the following: 

- An Azure resource to monitor. You can use any resource in your Azure subscription that supports diagnostic settings. To determine whether a resource supports diagnostic settings, go to its menu in the Azure portal and verify that there's a **Diagnostic settings** option in the **Monitoring** section of the menu.


If you're using any Azure resource other than a virtual machine:

- A diagnostic setting to send the resource logs from your Azure resource to a Log Analytics workspace. See [Tutorial: Create Log Analytics workspace in Azure Monitor](../essentials/tutorial-resource-logs.md).

If you're using an Azure virtual machine:

- A data collection rule to send guest logs and metrics to a Log Analytics workspace. See [Tutorial: Collect guest logs and metrics from Azure virtual machine](../vm/tutorial-monitor-vm-guest.md).

   
 
 ## Select a log query and verify results
Data is retrieved from a Log Analytics workspace using a log query written in Kusto Query Language (KQL). Insights and solutions in Azure Monitor will provide log queries to retrieve data for a particular service, but you can work directly with log queries and their results in the Azure portal with Log Analytics. 

Select **Logs** from your resource's menu. Log Analytics opens with the **Queries** window that includes  prebuilt queries for your **Resource type**. Select **Alerts** to view queries specifically designed for alert rules.

> [!NOTE]
> If the **Queries** window doesn't open, click **Queries** in the top right. 

:::image type="content" source="media/tutorial-log-alert/queries.png" lightbox="media/tutorial-log-alert/queries.png"alt-text="Log Analytics with queries window":::

Select a query and click **Run** to load it in the query editor and return results. You may want to modify the query and run it again. For example, the **Show anonymous requests** query for storage accounts is shown below. You may want to modify the **AuthenticationType** or filter on a different column.

:::image type="content" source="media/tutorial-log-alert/query-results.png" lightbox="media/tutorial-log-alert/query-results.png"alt-text="Query results":::


## Create alert rule
Once you verify your query, you can create the alert rule. Select **New alert rule** to create a new alert rule based on the current log query. The **Scope** will already be set to the current resource. You don't need to change this value.

:::image type="content" source="media/tutorial-log-alert/create-alert-rule.png" lightbox="media/tutorial-log-alert/create-alert-rule.png"alt-text="Create alert rule":::
## Configure condition

On the **Condition** tab, the **Log query** will already be filled in. The **Measurement** section defines how the records from the log query will be measured. If the query doesn't perform a summary, then the only option will be to **Count** the number of **Table rows**. If the query includes one or more summarized columns, then you'll have the option to use number of **Table rows** or a calculation based on any of the summarized columns. **Aggregation granularity** defines the time interval over which the collected values are aggregated. 

:::image type="content" source="media/tutorial-log-alert/alert-rule-condition.png" lightbox="media/tutorial-log-alert/alert-rule-condition.png"alt-text="Alert rule condition":::

### Configure dimensions
**Split by dimensions** allows you to create separate alerts for different resources. This setting is useful when you're creating an alert rule that applies to multiple resources. With the scope set to a single resource, this setting typically isn't used.

:::image type="content" source="media/tutorial-log-alert/alert-rule-dimensions.png" lightbox="media/tutorial-log-alert/alert-rule-dimensions.png"alt-text="Alert rule dimensions":::

If you need a certain dimension(s) included in the alert notification email, you can specify a dimension (e.g. "Computer"), the alert notification email will include the computer name that triggered the alert. The alerting engine uses the alert query to determine the available dimensions. If you do not see the dimension you want in the drop-down list for the "Dimension name", it is because the alert query does not expose that column in the results. You can easily add the dimensions you want by adding a Project line to your query that includes the columns you want to use. You can also use the Summarize line to add additional columns to the query results. 

:::image type="content" source="media/tutorial-log-alert/alert-rule-condition-2.png" lightbox="media/tutorial-log-alert/alert-rule-condition-2.png" alt-text="Screenshot showing the Alert rule dimensions with a dimension called Computer set.":::

## Configure alert logic
In the alert logic, configure the **Operator** and **Threshold value** to compare to the value returned from the measurement.  An alert is created when this value is true. Select a value for **Frequency of evaluation** which defines how often the log query is run and evaluated. The cost for the alert rule increases with a lower frequency. When you select a frequency, the estimated monthly cost is displayed in addition to a preview of the query results over a time period.

For example, if the measurement is **Table rows**, the alert logic may be **Greater than 0** indicating that at least one record was returned. If the measurement is a columns value, then the logic may need to be greater than or less than a particular threshold value. In the example below, the log query is looking for anonymous requests to a storage account. If an anonymous request has been made, then we should trigger an alert. In this case, a single row returned would trigger the alert, so the alert logic should be **Greater than 0**.

:::image type="content" source="media/tutorial-log-alert/alert-rule-alert-logic.png" lightbox="media/tutorial-log-alert/alert-rule-alert-logic.png"alt-text="Alert logic":::



## Configure actions
[!INCLUDE [Action groups](../../../includes/azure-monitor-tutorial-action-group.md)]

## Configure details
[!INCLUDE [Alert details](../../../includes/azure-monitor-tutorial-alert-details.md)]

:::image type="content" source="media/tutorial-log-alert/alert-rule-details.png" lightbox="media/tutorial-log-alert/alert-rule-details.png"alt-text="Alert rule details":::

Click **Create alert rule** to create the alert rule.

## View the alert
[!INCLUDE [View alert](../../../includes/azure-monitor-tutorial-view-alert.md)]


## Next steps
Now that you've learned how to create a log query alert for an Azure resource, have a look at workbooks for creating interactive visualizations of monitoring data.

> [!div class="nextstepaction"]
> [Azure Monitor Workbooks](../visualize/workbooks-overview.md)

---
title: Tutorial - Create a log query alert for an Azure resource
description: Tutorial to create a log query alert for an Azure resource.
ms.topic: tutorial
author: bwren
ms.author: bwren
ms.date: 12/15/2019
---

# Tutorial: Create a log query alert for an Azure resource
Azure Monitor alerts proactively notify you when important conditions are found in your monitoring data. Log query alert rules create an alert when a log query returns a particular result. For example, receive an alert when a particular event is created on a virtual machine, or send a warning when excessive anonymous requests are made to a storage account.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Access prebuilt log queries designed to suppoer alert rules for different kinds of resources
> * Create a log query alert rule
> * Create an action group to define notification details


## Prerequisites
To complete this tutorial you need an Azure resource with resource logs or other data being collected in a Log Analytics workspace. Complete one of the following tutorials to collect this data.

- [Tutorial: Collect and analyze resource logs from an Azure resource](../essentials/tutorial-resource-logs.md).


   
 
 ## Select a log query and verify results
Data is retrieved from a Log Analytics workspace using a log query written in Kusto Query Language (KQL). Insights and solutions in Azure Monitor will provide log queries to retrieve data for a particular service, but you can work directly with log queries and their results in the Azure portal with Log Analytics. 

1. Under the **Monitoring** section of your resource's menu, select **Logs**.
2. Log Analytics opens with an empty query window with the scope set to your resource. Any queries will include only records from that resource.

    > [!NOTE]
    > If you opened Logs from the Azure Monitor menu, the scope would be set to the Log Analytics workspace. In this case, any queries will include all records in the workspace.
   
    ![Screenshot shows Logs for a logic app displaying a new query with the logic app name highlighted.](media/tutorial-resource-logs/logs.png)

3. Click **Queries** to view prebuilt queries for the **Resource type**. 



4. Select **Alerts** to view queries specifically designed for alert rules.



5. Select a query and click **Run** to load it in the query editor and return results. If you want to view and work with the query before running it, select **Load to editor**.



6. See [Get started with log queries in Azure Monitor](../logs/get-started-queries.md) for a tutorial on writing log queries.

    ![Log query](media/tutorial-resource-logs/log-query-1.png)


## Create alert rule

1. Select **New alert rule** to create a new alert rule based on the current log query.



2. The **Scope** will already be set to the current resource. You don't need to change this value.


## Configure measurement

1. On the **Condition** tab, the **Log query** will already be filled in, so you don't need to change it.

2. The **Measurement** section defines how the records from the log query will be measured. If the query doesn't perform a summary, then the only option will be to **Count** the number of **Table rows**. 

< picture >

If the query includes one or more summarized columns, then you'll have the option to use number of **Table rows** or a calculation based on any of the summarized columns. 


## Configure dimensions
**Split by dimensions** allows you to create separate alerts for different resources. This setting is useful when you're creating an alert rule that applies to multiple resources. With the scope set to a single resource, this setting typically isn't used.


## Configure alert logic


1. Configure the **Operator** and **Threshold value** to compare to the value returned from the measurement.  An alert is created when this value is true.

For example, if the measurement is **Table rows**, the alert logic may be **Great than 0** indicating that at least one record was returned. If the measurement is a columns value,then the logic may need to be greater than or less than a particular threshold value.

<picture>

2. Select a value for **Frequency of evaluation** which defines how often the log query is run and evaluated. The cost for the alert rule increases with a lower frequency. When you select a frequency, the estimated monthly cost is displayed.

<picture>

## Configure actions
[Action groups](../articles/azure-monitor/alerts/action-groups.md) define a set of actions to take when an alert is fired such as sending an email or an SMS message.

1. From the **Actions** tab, select one or more existing action groups to run when the alert is fired.

2. If you don't have an existing action group, click **Create action group** to create a new one.

## Configure alert rule details

1. Provide an **Alert rule name**. This should be descriptive since it will be displayed when the alert is fired. Optionally provide a description that's included in the details of the alert.



2. Specify a subscription and resource group for the alert rule. This doesn't need to be in the same resource group as the resource that you're monitoring. 

3. Specify a **Severity** for the alert. The severity allows you to group alerts with a similar relative importance.

4. Keep the box checked to **Enable alert upon creation**.
5. Keep the box checked to **Automatically resolve alerts**. This will automatically resolve the alert when the metric value drops below the threshold. For example, you may create an alert when the CPU of a virtual machine exceeds 80%. If the alert fires, then next time the CPU drops below 80%, the alert will be automatically resolved.
6. Click **Create alert rule** to create the alert rule.



## Next steps
Now that you've learned how to collect resource logs into a Log Analytics workspace, complete a tutorial on writing log queries to analyze this data.

> [!div class="nextstepaction"]
> [Get started with log queries in Azure Monitor](../logs/get-started-queries.md)
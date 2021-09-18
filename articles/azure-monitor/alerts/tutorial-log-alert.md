---
title: Tutorial - Create a log query alert for an Azure resource
description: Tutorial to create a log query alert for an Azure resource.
ms.topic: tutorial
author: bwren
ms.author: bwren
ms.date: 09/16/2021
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
- A Log Analytics workspace to collect the resource logs. See [Tutorial: Create Log Analytics workspace in Azure Monitor](../logs/tutorial-workspace.md).

If you're using any Azure resource other than a virtual machine:

- A diagnostic setting to send the resource logs from your Azure resource to a Log Analytics workspace. See [Tutorial: Create Log Analytics workspace in Azure Monitor](../logs/tutorial-workspace.md).

If you're using an Azure virtual machine:

- A data collection rule to send guest logs and metrics to a Log Analytics workspace. See [Tutorial: Collect guest metrics and logs from Azure virtual machine](../vm/tutorial-data-collection-rule-vm.md).

   
 
 ## Select a log query and verify results
Data is retrieved from a Log Analytics workspace using a log query written in Kusto Query Language (KQL). Insights and solutions in Azure Monitor will provide log queries to retrieve data for a particular service, but you can work directly with log queries and their results in the Azure portal with Log Analytics. 

Under the **Monitoring** section of your resource's menu, select **Logs**. Log Analytics opens with an empty query window with the scope set to your resource. Any queries will include only records from that resource.

![Screenshot shows Logs for a logic app displaying a new query with the logic app name highlighted.](media/tutorial-log-alert/logs.png)

Click **Queries** to view prebuilt queries for the **Resource type** and then select **Alerts** to view queries specifically designed for alert rules.



Select a query and click **Run** to load it in the query editor and return results. You may want to modify the query and run it again. For example, the **Show the trend of a selected event** query for virtual machines returns events with a particular ID. You may want to modify that ID to alert on a different event.




## Create alert rule
Once you verify your query, you can create the alert rule.

Select **New alert rule** to create a new alert rule based on the current log query. The **Scope** will already be set to the current virtual machine. You don't need to change this value.


## Configure condition

On the **Condition** tab, the **Log query** will already be filled in.


The **Measurement** section defines how the records from the log query will be measured. If the query doesn't perform a summary, then the only option will be to **Count** the number of **Table rows**. 



If the query includes one or more summarized columns, then you'll have the option to use number of **Table rows** or a calculation based on any of the summarized columns. 


## Configure dimensions
**Split by dimensions** allows you to create separate alerts for different resources. This setting is useful when you're creating an alert rule that applies to multiple resources. With the scope set to a single resource, this setting typically isn't used.


## Configure alert logic


1. Configure the **Operator** and **Threshold value** to compare to the value returned from the measurement.  An alert is created when this value is true.

For example, if the measurement is **Table rows**, the alert logic may be **Great than 0** indicating that at least one record was returned. If the measurement is a columns value,then the logic may need to be greater than or less than a particular threshold value.



2. Select a value for **Frequency of evaluation** which defines how often the log query is run and evaluated. The cost for the alert rule increases with a lower frequency. When you select a frequency, the estimated monthly cost is displayed.



## Configure actions
[!INCLUDE [Action groups](../../../includes/azure-monitor-tutorial-action-group.md)]

## Configure alert rule details

Provide an **Alert rule name**. This should be descriptive since it will be displayed when the alert is fired. Optionally provide a description that's included in the details of the alert.



Specify a subscription and resource group for the alert rule. This doesn't need to be in the same resource group as the resource that you're monitoring. 

 Specify a **Severity** for the alert. The severity allows you to group alerts with a similar relative importance.

Keep the box checked to **Enable alert upon creation** and to **Automatically resolve alerts**. This will automatically resolve the alert when the metric value drops below the threshold. For example, you may create an alert when the CPU of a virtual machine exceeds 80%. If the alert fires, then next time the CPU drops below 80%, the alert will be automatically resolved.


Click **Create alert rule** to create the alert rule.



## Next steps
Now that you've learned how to collect resource logs into a Log Analytics workspace, complete a tutorial on writing log queries to analyze this data.

> [!div class="nextstepaction"]
> [Get started with log queries in Azure Monitor](../logs/get-started-queries.md)
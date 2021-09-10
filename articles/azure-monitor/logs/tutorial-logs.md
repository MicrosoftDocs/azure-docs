---
title: Analyze logs from an Azure resource
description: Analyze logs from an Azure resource.
ms.topic: tutorial
author: bwren
ms.author: bwren
ms.date: 09/10/2021
---

# Tutorial: Analyze logs from an Azure resource

Resource logs provide insight into the detailed operation of an Azure resource and are useful for monitoring their health and availability. Azure resources generate resource logs automatically, but you must configure where they should be collected. This tutorial takes you through the process of creating a diagnostic setting to send resource logs to a Log Analytics workspace where you can analyze them with log queries.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Open Log Analytics to view log data
> * Use prebuilt log queries for your resource
> * Create and run a simple log query to analyze logs


## Prerequisites
To complete this tutorial you need an Azure resource with resource logs or other data being collected in a Log Analytics workspace. Complete one of the following tutorials to collect this data.

- [Tutorial: Collect and analyze resource logs from an Azure resource](../essentials/tutorial-resource-logs.md).


   
 
 ## Use a log query to retrieve logs
Data is retrieved from a Log Analytics workspace using a log query written in Kusto Query Language (KQL). Insights and solutions in Azure Monitor will provide log queries to retrieve data for a particular service, but you can work directly with log queries and their results in the Azure portal with Log Analytics. 

1. Under the **Monitoring** section of your resource's menu, select **Logs**.
2. Log Analytics opens with an empty query window with the scope set to your resource. Any queries will include only records from that resource.

    > [!NOTE]
    > If you opened Logs from the Azure Monitor menu, the scope would be set to the Log Analytics workspace. In this case, any queries will include all records in the workspace.
   
    ![Screenshot shows Logs for a logic app displaying a new query with the logic app name highlighted.](media/tutorial-resource-logs/logs.png)

3. Click **Queries** to view prebuilt queries for the **Resource type**. 

<picture>

4. Browse throw the available queries. You can can select different types of queries in the left column. 

<picture>

5. Select a query and click **Run** to load it in the query editor and return results. If you want to view and work with the query before running it, select **Load to editor**.

<picture>

6. See [Get started with log queries in Azure Monitor](../logs/get-started-queries.md) for a tutorial on writing log queries.

    ![Log query](media/tutorial-resource-logs/log-query-1.png)




## Next steps
Now that you've learned how to collect resource logs into a Log Analytics workspace, complete a tutorial on writing log queries to analyze this data.

> [!div class="nextstepaction"]
> [Get started with log queries in Azure Monitor](../logs/get-started-queries.md)
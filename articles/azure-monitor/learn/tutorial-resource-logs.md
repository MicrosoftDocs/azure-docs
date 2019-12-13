---
title: Collect resource logs from an Azure Resource and analyze with Azure Monitor
description: Tutorial to configure diagnostic settings to collect resource logs from an Azure resource into a Log Analytics workspace where they can be analyzed with a log query.
ms.service:  azure-monitor
ms.subservice: application-insights
ms.topic: tutorial
author: bwren
ms.author: bwren
ms.date: 12/11/2019
---

# Collect resource logs from an Azure Resource and analyze with Azure Monitor

Resource logs provide insight into the detailed operation of an Azure resource and are useful for monitoring their health and availability. Azure resources generate resource logs automatically, but you must where these logs should be collected. This tutorial takes you through the process of creating a diagnostic setting 

You learn how to:

> [!div class="checklist"]
> * Create a Log Analytics workspace in Azure Monitor
> * Create a diagnostic setting to collect resource logs 
> * Create a simple log query to analyze logs


## Prerequisites

To complete this tutorial you need an Azure resource to monitor. You can use any resource in your Azure subscription that supports diagnostic settings. To determine whether a resource supports diagnostic settings, go to its menu in the Azure portal and verify that there's a **Diagnostic settings** option in the **Monitoring** section of the menu.

Alternatively, you can create the Logic App resource below. This is the resource that will be used through the tutorial, although the same steps can be used with any Azure resource that supports diagnostic settings.

## Log in to Azure
Log in to the Azure portal at [https://portal.azure.com](https://portal.azure.com).

## Create a resource (optional)
The rest of this tutorial uses an Azure Logic App that performs a simple HTTP request. You can perform this procedure to create a Logic App to use with the tutorial, or you can use another resource in your Azure subscription.

1. Click the **Create a resource** button found at the top of the Azure portal.
2. Search for and select **Logic App**. Name the Logic App *MyLogicApp* and create a new resource group named **myResourceGroup**. Use the location of your choice. Leave the **Log Analytics** setting **Off**. 
    > [!NOTE]
    > Selecting the **Log Analytics** setting will create a diagnostic setting to collect the resource logs to a Log Analytics workspace. Most services don't provide this feature, so we're going to leave the this setting off and manually create the diagnostic setting since this is a more common scenario.



4. Click the **Create** button.
5. When you receive the message that your deployment succeeded, select **Go to resource**.
6. In the Logic Apps Designer, select the **Recurrence** trigger.
7.  Set an **Interval** of *30* and a **Frequency** of *second* to ensure your logic app is triggered every 30 seconds.
8.  Click the **New Step** button, and select **Add an action**. Type *http*, then click on **HTTP** option, and select the **HTTP-HTTP** action.
9.  Provide the following information for the HTTP action:
    - **Method**: *GET*
    - **URI**: *https://www.microsoft.com/en-us/*
    - **Authentication**None*

    ![Logic App designer](media/tutorial-resource-logs/logic-app-designer.png)

10. Click **Save**

## Create a Log Analytics workspace
The Log Analytics workspace needs to exist before the diagnostic setting is created. You can use an existing workspace or create one with the following procedure. 

While you can work with the data in Log Analytics workspaces in the **Azure Monitor** menu, you create and manage workspaces in the **Log Analytics workspaces** menu.

1. From **All services**, select **Log Analytics workspaces**.
2. Click **Add** at the top of the screen and provide the following details for the workspace:
   - **Log Analytics workspace**: Name for the new workspace. This name must be globally unique across all Azure Monitor subscriptions.
   - **Subscription**: Select the subscription to store the workspace. The subscription does not need to same as the resource being monitored.
   - **Resource Group**: Select an existing resource group or click **Create new** to create a new one. The resource group does not need to same as the resource being monitored.
   - **Location**: Select an Azure region or create a new one. The location does not need to same as the resource being monitored.
   - **Pricing tier**: Keep the default of *Pay-as-you-go*.

    ![New workspace](media/tutorial-resource-logs/new-workspace.png)

3. Click **OK** to create the workspace.

## Create a diagnostic setting
Diagnostic settings define where resource logs should be sent for a particular resource. A single diagnostic setting can have multiple destinations, but we'll only use a Log Analytics workspace in this tutorial.

1. Under the **Monitoring** section of your resource's menu, select **Diagnostic settings**.
2. You should have a message "No diagnostic settings defined". Click **Add diagnostic setting**.

    ![Diagnostic settings](media/tutorial-resource-logs/diagnostic-settings.png)

3. Each diagnostic setting has three basic 
   - **Name**: This has no significant effect and should simply be descriptive to you.
   - **Destinations**: Define one or more destinations to send the logs. These will be the same three destinations for all Azure services. Each diagnostic setting can define one or more destinations.
   - **Categories**: Categories of logs to send to each of the destinations. The set of categories will vary for each Azure service.

4. Select **Send to Log Analytics workspace** and then select the workspace that you created.
5. Select the categories that you want to collect. For the Logic App, we'll select the following categories:
 
   - **WorkflowRuntime**: This represents events related to the running of the Logic App, including detailed description of any errors.
   - **AllMetrics**: Many services will provide this category which are the same metric values that are collected automatically into Azure Monitor Metrics. Collect them into a Log Analytics workspace to perform more complex analysis and trending using log queries.

    ![Diagnostic setting](media/tutorial-resource-logs/diagnostic-setting.png)

6. Click **Save** to save the diagnostic settings.

## Generate
The diagnostic setting will take effect immediately, although it may take a few minutes for your resource to generate data. In the case of the Logic App, it should generate a new record every 30 seconds, each time it runs. We can generate some more interesting data if we modify it to fail.

1. If you created the Logic App used for the tutorial, modify the URL to one that's invalid, and it should fail each time it runs.
2. If you used another resource, perform some action to generate some data.

    
 
 ## Use a log query to retrieve logs
Log Analytics is a tool in Azure Monitor that allows you to edit and run queries and analyze their results. If you start Log Analytics from the Azure Monitor menu in the Azure portal, you will have access to all records in the workspace. If you start Log Analytics from the resource's menu, you will have access to only records from that resource. 

1. Under the **Monitoring** section of your resource's menu, select **Logs**.
2. Log Analytics opens with an empty query window. Now that the scope is set to your resource. If you opened Logs from the Azure Monitor menu, the scope would be set to the Log Analytics workspace.
   
    ![Logs](media/tutorial-resource-logs/logs.png)

3. The Logic Apps service writes resource logs to the **AzureDiagnostics**, but other services may write to other tables. See [Supported services, schemas, and categories for Azure Resource Logs](../platform/diagnostic-logs-schema.md) for tables used by different Azure services.
4. Type in the following query and click **Run**.
   
   ```Kusto
   AzureDiagnostics
   ```

    ![Log query](media/tutorial-resource-logs/log-query-1.png)

    > [!NOTE]
    > Multiple services write resource logs to the AzureDiagnostics table. If you start Log Analytics from the Azure Monitor menu, then you would need to add `| where ResourceProvider == "AzureDiagnostics
   | where ResourceProvider == "MICROSOFT.LOGIC"` to the query because records from all services would be included. When you start Log Analytics from a resource's menu, then the scope is set to only records from this resource so this column isn't required.

5. The query returns all records collected from the resource log. Expand some of the records to view their details.



6. Modify the query to return only failure records.

   ```Kusto
   AzureDiagnostics
   | where ResourceProvider == "MICROSOFT.LOGIC"
   | where status_s == "Failed"
   ```

7. Now you can inspect those records to retrieve an exact error message.

8. Try the following query that summarizes Logic App records by status.

    ```Kusto
    AzureDiagnostics
    | where ResourceProvider == "MICROSOFT.LOGIC"
    | summarize count() by status_s 
    ```


 ## Use a log query to retrieve logs
 The metrics that are stored are the same metrics that are stored in the Azure Monitor metrics database and used by metrics explorer. Collecting them into a Log Analytics workspace allows you to perform more complex analysis and combine the metrics with other data.

 Each metric value is stored every minute but may actually be sampled more frequently. Each metric record stores the number of samples over the minute with the average, maximum, and minimum values.

 1. Try the following query to return a count of all available metrics.

    ```Kusto
    AzureMetrics
    | summarize count()  by MetricName
    | sort by MetricName 
    ```
2. Note that the counts are consistent as metric values are collected each minute.
3. 

## Next steps
Now that you've learned how to identify run-time exceptions, advance to the next tutorial to learn how to create alerts in response to failures.

> [!div class="nextstepaction"]
> [Alert on application health](../../azure-monitor/learn/tutorial-alert.md)

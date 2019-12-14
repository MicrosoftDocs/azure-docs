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

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a Log Analytics workspace in Azure Monitor
> * Create a diagnostic setting to collect resource logs 
> * Create a simple log query to analyze logs


## Prerequisites

To complete this tutorial you need an Azure resource to monitor. You can use any resource in your Azure subscription that supports diagnostic settings. To determine whether a resource supports diagnostic settings, go to its menu in the Azure portal and verify that there's a **Diagnostic settings** option in the **Monitoring** section of the menu.


## Log in to Azure
Log in to the Azure portal at [https://portal.azure.com](https://portal.azure.com).


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

3. Each diagnostic setting has three basic sections:
4. 
   - **Name**: This has no significant effect and should simply be descriptive to you.
   - **Destinations**: Define one or more destinations to send the logs. These will be the same three destinations for all Azure services. Each diagnostic setting can define one or more destinations.
   - **Categories**: Categories of logs to send to each of the destinations. The set of categories will vary for each Azure service.

5. Select **Send to Log Analytics workspace** and then select the workspace that you created.
6. Select the categories that you want to collect. For the Logic App, we'll select the following categories:
 
   - **WorkflowRuntime**: This represents events related to the running of the Logic App, including detailed description of any errors.
   - **AllMetrics**: Many services will provide this category which are the same metric values that are collected automatically into Azure Monitor Metrics. Collect them into a Log Analytics workspace to perform more complex analysis and trending using log queries.

    ![Diagnostic setting](media/tutorial-resource-logs/diagnostic-setting.png)

7. Click **Save** to save the diagnostic settings.

    
 
 ## Use a log query to retrieve logs
Log Analytics is a tool in Azure Monitor that allows you to edit and run queries and analyze their results. If you start Log Analytics from the Azure Monitor menu in the Azure portal, you will have access to all records in the workspace. If you start Log Analytics from the resource's menu, you will have access to only records from that resource. 

1. Under the **Monitoring** section of your resource's menu, select **Logs**.
2. Log Analytics opens with an empty query window. Now that the scope is set to your resource. If you opened Logs from the Azure Monitor menu, the scope would be set to the Log Analytics workspace.
   
    ![Logs](media/tutorial-resource-logs/logs.png)

3. The Logic Apps service shown in the example writes resource logs to the **AzureDiagnostics**, but other services may write to other tables. See [Supported services, schemas, and categories for Azure Resource Logs](../platform/diagnostic-logs-schema.md) for tables used by different Azure services.

    > [!NOTE]
    > Multiple services write resource logs to the AzureDiagnostics table. If you start Log Analytics from the Azure Monitor menu, then you would need to add `| where ResourceProvider == "AzureDiagnostics
   | where ResourceProvider == "MICROSOFT.LOGIC"` to the query because records from all services would be included. When you start Log Analytics from a resource's menu, then the scope is set to only records from this resource so this column isn't required.


4. Type in a query and click **Run**. See [Get started with log queries in Azure Monitor](../log-query/get-started-queries.md) for a tutorial on writing log queries.

    ![Log query](media/tutorial-resource-logs/log-query-1.png)





## Next steps
Now that you've learned how to identify run-time exceptions, advance to the next tutorial to learn how to create alerts in response to failures.

> [!div class="nextstepaction"]
> [Alert on application health](../../azure-monitor/learn/tutorial-alert.md)

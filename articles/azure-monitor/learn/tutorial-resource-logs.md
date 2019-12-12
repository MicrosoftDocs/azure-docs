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

To complete this tutorial you need a resource to monitor. You can a resource of your own or 

## Log in to Azure
Log in to the Azure portal at [https://portal.azure.com](https://portal.azure.com).

## Create a resource (optional)
The rest of this tutorial uses an Azure Logic App that performs a simple HTTP request. You can perform this procedure to create a Logic App to use with the tutorial, or you can use another resource in your Azure subscription.

1. Click the **Create a resource** button found at the top of the Azure portal.
2. Search for and select **Logic App**. Name the Logic App *MyLogicApp* and create a new resource group named **myResourceGroup**. Use the location of your choice. Leave the **Log Analytics** setting **Off**.
3. Click the **Create** button.
5. When you receive the message that your deployment succeeded, select **Go to resource**.
6. In the Logic Apps Designer, select the **Recurrence** trigger.
7.  Set an **Interval** of *30* and a **Frequency** of *second* to ensure your logic app is triggered every 30 seconds.
8.  Click the **New Step** button, and select **Add an action**. Type *http*, then click on **HTTP** option, and select the **HTTP-HTTP** action.
9.  Provide the following information for the HTTP action:
    - **Method**: *GET*
    - **URI**: *https://www.microsoft.com/en-us/*
    - **Authentication**: *None*
10. Click **Save**.


## Create a Log Analytics workspace
Before you configure the diagnostic setting, you need to create a Log Analytics workspace if you don't already have one. While you can work with the data in Log Analytics workspaces in the **Azure Monitor** menu, you create and manage workspaces in the **Log Analytics workspaces** menu.

1. From **All services**, select **Log Analytics workspaces**.
2. Click **Add** at the top of the screen and provide the following details for the workspace:
   - **Log Analytics workspace**: Name for the new workspace. This name must be globally unique across all Azure Monitor subscriptions.
   - **Subscription**: Select the subscription to store the workspace. The subscription does not need to same as the resource being monitored.
   - **Resource Group**: Select an existing resource group or click **Create new** to create a new one. The resource group does not need to same as the resource being monitored.
   - **Location**: Select an Azure region or create a new one. The location does not need to same as the resource being monitored.
   - **Pricing tier**: Keep the default of *Pay-as-you-go*.
3. Click **OK** to create teh workspace.

## Create a diagnostic setting
Diagnostic settings define where resource logs should be sent for a particular resource. A single diagnostic setting can have multiple destinations, but we'll only use a Log Analytics workspace in this tutorial.

1. Under the **Monitoring** section of your resource's menu, select **Diagnostic settings**.
2. Click **Add dianog**

## Next steps
Now that you've learned how to identify run-time exceptions, advance to the next tutorial to learn how to create alerts in response to failures.

> [!div class="nextstepaction"]
> [Alert on application health](../../azure-monitor/learn/tutorial-alert.md)

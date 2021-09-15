---
title: Tutorial - Create Log Analytics workspace in Azure Azure Monitor
description: Tutorial to create a Log Analytics workspace required to collect log data in Azure Monitor.
ms.topic: tutorial
author: bwren
ms.author: bwren
ms.date: 12/15/2019
---

# Tutorial: Create Log Analytics workspace in Azure Monitor
Logs and metrics are the fundamental types of data in Azure Monitor. Log data is stored in a Log Analytics workspace. You need to create at least one workspace to store data such as resource logs from Azure resources and guest logs from virtual machines. When you design a complete monitoring solution, you may need more than one workspace, but for most basic scenarios, you can use a single workspace to collect all your log data.

> [!NOTE]
> This tutorial describes how to create a Log Analytics workspace using the Azure portal. You can also create a workspace using [PowerShell](powershell-workspace-configuration.md) or a [Resource Manager template](resource-manager-workspace.md).

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a Log Analytics workspace using the Azure portal



## Create a workspace
A Log Analytics workspace in Azure Monitor collects and indexes log data from a variety of sources and allows advanced analysis using a powerful query language. The Log Analytics workspace needs to exist before you create a diagnostic setting to send data to it. You can use an existing workspace in your Azure subscription or create one with the following procedure. 

> [!NOTE]
> While you can work with data in Log Analytics workspaces in the **Azure Monitor** menu, you create and manage workspaces in the **Log Analytics workspaces** menu.

From **All services** in the Azure portal, select **Log Analytics workspaces**.

:::image type="content" source="media/tutorial-workspace/azure-portal.png" lightbox="media/tutorial-workspace/azure-portal.png" alt-text="Select Log Analytics workspaces in Azure portal":::

Click **Create** to create a new workspace.

:::image type="content" source="media/tutorial-workspace/create-workspace.png" lightbox="media/tutorial-workspace/create-workspace.png" alt-text="Create workspace button":::

On the **Basics** tab, provide the following values:

- **Subscription**: Select the subscription to store the workspace. This does not need to be the same subscription same as the resource being monitored.
- **Resource Group**: Select an existing resource group or click **Create new** to create a new one. This does not need to be the same resource group same as the resource being monitored.
- **Name**: Name for the new workspace. This name must be globally unique across all Azure Monitor subscriptions.
- **Region**: Select an Azure region or create a new one. This does not need to be the same location same as the resource being monitored.

:::image type="content" source="media/tutorial-workspace/workspace-basics.png" lightbox="media/tutorial-workspace/workspace-basics.png" alt-text="Workspace basics":::

On the **Pricing tier tab**, provide the following values:

- **Pricing tier**: Select *Pay-as-you-go (Per GB 2018)* as the pricing tier. You can change this pricing tier later. Click the **Learn more** link or refer to [Log Analytics Pricing Details](https://azure.microsoft.com/pricing/details/log-analytics/) to learn more about different pricing tiers.

:::image type="content" source="media/tutorial-workspace/workspace-pricing-tier.png" lightbox="media/tutorial-workspace/workspace-pricing-tier.png" alt-text="Workspace pricing tier":::

Click **Review + Create** to create the workspace.




## Next steps
Now that you have a Log Analytics workspace, use one of the following tutorials to collect log data.

> [!div class="nextstepaction"]
> [Collect resource logs from an Azure resource](../logs/get-started-queries.md)
> [!div class="nextstepaction"]
> [Get started with log queries in Azure Monitor](../logs/get-started-queries.md)
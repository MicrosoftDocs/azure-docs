---
author: bwren
ms.author: bwren
ms.service: azure-monitor
ms.topic: include
ms.date: 09/17/2021
---

A Log Analytics workspace in Azure Monitor collects and indexes log data from a variety of sources and allows advanced analysis using a powerful query language.  You can use an existing workspace in your Azure subscription or create one with the following procedure. 

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
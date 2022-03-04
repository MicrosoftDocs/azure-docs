---
author: bwren
ms.author: bwren
ms.service: azure-monitor
ms.topic: include
ms.date: 09/17/2021
---

Log data in Azure Monitor is stored in a Log Analytics workspace. If you already created a workspace in your subscription, then you can use that one. You can also choose to use the default workspace that's created in each Azure subscription. 

If you want to create a new Log Analytics, then you can use the following procedure. If you're going to use an existing one, then move on to the next section.

From **All services** in the Azure portal, select **Log Analytics workspaces**.

:::image type="content" source="media/azure-monitor-tutorial-workspace/azure-portal.png" lightbox="media/azure-monitor-tutorial-workspace/azure-portal.png" alt-text="Select Log Analytics workspaces in Azure portal":::

Click **Create** to create a new workspace.

:::image type="content" source="media/azure-monitor-tutorial-workspace/create-workspace.png" lightbox="media/azure-monitor-tutorial-workspace/create-workspace.png" alt-text="Create workspace button":::

On the **Basics** tab, select a **Subscription**, **Resource group**, and **Region** for the workspace. These do not need to be the same as the resource being monitored. Provide a **Name** that must be globally unique across all Azure Monitor subscriptions.

:::image type="content" source="media/azure-monitor-tutorial-workspace/workspace-basics.png" lightbox="media/azure-monitor-tutorial-workspace/workspace-basics.png" alt-text="Workspace basics":::


Click **Review + Create** to create the workspace.
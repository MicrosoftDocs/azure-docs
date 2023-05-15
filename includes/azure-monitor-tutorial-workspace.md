---
author: bwren
ms.author: bwren
ms.service: azure-monitor
ms.topic: include
ms.date: 09/17/2021
---

Azure Monitor stores log data in a Log Analytics workspace. If you already created a workspace in your subscription, you can use that one. You can also choose to use the default workspace in each Azure subscription.

If you want to create a new Log Analytics workspace, use the following procedure. If you're going to use an existing workspace, move to the next section.

In the Azure portal, under **All services**, select **Log Analytics workspaces**.

:::image type="content" source="media/azure-monitor-tutorial-workspace/azure-portal.png" lightbox="media/azure-monitor-tutorial-workspace/azure-portal.png" alt-text="Screenshot that shows selecting Log Analytics workspaces in the Azure portal.":::

Select **Create** to create a new workspace.

:::image type="content" source="media/azure-monitor-tutorial-workspace/create-workspace.png" lightbox="media/azure-monitor-tutorial-workspace/create-workspace.png" alt-text="Screenshot that shows the Create button.":::

On the **Basics** tab, select a subscription, resource group, and region for the workspace. These values don't need to be the same as the resource being monitored. Provide a name that must be globally unique across all Azure Monitor subscriptions.

:::image type="content" source="media/azure-monitor-tutorial-workspace/workspace-basics.png" lightbox="media/azure-monitor-tutorial-workspace/workspace-basics.png" alt-text=" Screenshot that shows the workspace Basics tab.":::

Select **Review + Create** to create the workspace.
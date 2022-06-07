---
title: Create a Log Analytics workspace in the Azure portal | Microsoft Docs
description: Learn how to create a Log Analytics workspace to enable management solutions and data collection from your cloud and on-premises environments in the Azure portal.
ms.topic: conceptual
author: guywi-ms
ms.author: guywild
ms.date: 03/28/2022
ms.reviewer: yossiy

---

# Create a Log Analytics workspace in the Azure portal

Use the **Log Analytics workspaces** menu to create a Log Analytics workspace in the Azure portal.

A Log Analytics workspace is the environment for Azure Monitor log data. Each workspace has its own data repository and configuration. Data sources and solutions are configured to store their data in a particular workspace. A workspace has a unique workspace ID and resource ID. You can reuse the same workspace name when you're in different resource groups.

You require a Log Analytics workspace if you intend to collect data from:

* Azure resources in your subscription.
* On-premises computers monitored by System Center Operations Manager.
* Device collections from Configuration Manager.
* Diagnostics or log data from Azure Storage.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com).

## Create a workspace

In the Azure portal, select **All services**. In the list of resources, enter **Log Analytics**. As you begin typing, the list filters based on your input. Select **Log Analytics workspaces**.

![Screenshot that shows the Azure portal.](media/quick-create-workspace/azure-portal-01.png)
  
Select **Add**, and then provide values for the following options:

   * **Subscription**: Select a subscription if the default isn't appropriate.
   * **Resource group**: Use an existing resource group or create a new one.
   * **Log Analytics workspace**: Provide a name for the new workspace, such as *DefaultLAWorkspace*. This name must be unique per resource group.
   * **Region**: Select an available region. For more information, see the [regions where Log Analytics is available](https://azure.microsoft.com/regions/services/). Search for Azure Monitor in the **Search for a product** box.

        ![Screenshot that shows the Create Log Analytics workspace pane.](media/quick-create-workspace/create-workspace.png)

Select **Review + Create** to review the settings. Then select **Create** to create the workspace. The default pricing tier **Pay-as-you-go** is selected. With this tier, you won't incur any charges until you collect a sufficient amount of data. For more information about other pricing tiers, see [Log Analytics pricing](https://azure.microsoft.com/pricing/details/log-analytics/).

## Troubleshooting

If you created a workspace that was deleted in the last 14 days and it's in [soft-delete state](../logs/delete-workspace.md#soft-delete-behavior), the operation could have a different outcome based on your workspace configuration:

- If you provide the same workspace name, resource group, subscription, and region as in the deleted workspace, your workspace is recovered with its data, configuration, and connected agents.
- The workspace name must be unique per resource group. If you use a workspace name that already exists and is also in soft delete in your resource group, you'll get an error. The workspace name *workspace-name* isn't unique.
- To override the soft delete, permanently delete your workspace, and create a new workspace with the same name, follow these steps:

   1. [Recover](../logs/delete-workspace.md#recover-workspace) your workspace.
   1. [Permanently delete](../logs/delete-workspace.md#permanent-workspace-delete) your workspace.
   1. Create a new workspace by using the same workspace name.

## Next steps

Now that you have a workspace available, you can configure a collection of monitoring telemetry. You can also run log searches to analyze the data. Then you can add a management solution to provide more data and analytic insights.

For more information, see:

* [Monitor health of a Log Analytics workspace in Azure Monitor](../logs/monitor-workspace.md) to create alert rules to monitor the health of your workspace.
* [Collect Azure service logs and metrics for use in Log Analytics](../essentials/resource-logs.md#send-to-log-analytics-workspace) to enable data collection from Azure resources with Azure Diagnostics or Azure Storage.

---
title: Create a Log Analytics workspace in the Azure portal | Microsoft Docs
description: Learn how to create a Log Analytics workspace to enable management solutions and data collection from your cloud and on-premises environments in the Azure portal.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 03/18/2021

---

# Create a Log Analytics workspace in the Azure portal
Use the **Log Analytics workspaces** menu to create a Log Analytics workspace using the Azure portal. A Log Analytics workspace is a unique environment for Azure Monitor log data. Each workspace has its own data repository and configuration, and data sources and solutions are configured to store their data in a particular workspace. You require a Log Analytics workspace if you intend on collecting data from the following sources:

* Azure resources in your subscription
* On-premises computers monitored by System Center Operations Manager
* Device collections from Configuration Manager 
* Diagnostics or log data from Azure storage

For other sources, such as Azure VMs and Windows or Linux VMs in your environment, see the following topics:

*  [Collect data from Azure virtual machines](../vm/quick-collect-azurevm.md) 
*  [Collect data from hybrid Linux computer](../vm/quick-collect-linux-computer.md)
*  [Collect data from hybrid Windows computer](../vm/quick-collect-windows-computer.md)

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Sign in to Azure portal
Sign in to the Azure portal at [https://portal.azure.com](https://portal.azure.com). 

## Create a workspace
In the Azure portal, click **All services**. In the list of resources, type **Log Analytics**. As you begin typing, the list filters based on your input. Select **Log Analytics workspaces**.

![Azure portal](media/quick-create-workspace/azure-portal-01.png)
  
Click **Add**, and then provide values for the following options:

   * Select a **Subscription** to link to by selecting from the drop-down list if the default selected is not appropriate.
   * For **Resource Group**, choose to use an existing resource group already setup or create a new one.  
   * Provide a name for the new **Log Analytics workspace**, such as *DefaultLAWorkspace*. This name must be globally unique across all Azure Monitor subscriptions.
   * Select an available **Region**.  For more information, see which [regions Log Analytics is available in](https://azure.microsoft.com/regions/services/) and search for Azure Monitor from the **Search for a product** field.  


        ![Create Log Analytics resource blade](media/quick-create-workspace/create-workspace.png)  


Click **Review + create** to review the settings and then **Create** to create the workspace. This will select a default pricing tier of Pay-as-you-go which will not incur any changes until you start collecting a sufficient amount of data. For more information about other pricing tiers, see [Log Analytics Pricing Details](https://azure.microsoft.com/pricing/details/log-analytics/).



## Troubleshooting
When you create a workspace that was deleted in the last 14 days and in [soft-delete state](../logs/delete-workspace.md#soft-delete-behavior), the operation could have different outcome depending on your workspace configuration:
1. If you provide the same workspace name, resource group, subscription and region as in the deleted workspace, your workspace will be recovered including its data, configuration and connected agents.
2. If you use the same workspace name, but different resource group, subscription or region, you will get an error *This workspace name is already in use. Please try another one*. To override the soft-delete and permanently delete your workspace and create a new workspace with the same name, follow these steps to recover the workspace first and perform permanent delete:
   - [Recover](../logs/delete-workspace.md#recover-workspace) your workspace
   - [Permanently delete](../logs/delete-workspace.md#permanent-workspace-delete) your workspace
   - Create a new workspace using the same workspace name

## Next steps
Now that you have a workspace available, you can configure collection of monitoring telemetry, run log searches to analyze that data, and add a management solution to provide additional data and analytic insights. 

* See [Monitor health of Log Analytics workspace in Azure Monitor](../logs/monitor-workspace.md) create alert rules to monitor the health of your workspace. 
* See [Collect Azure service logs and metrics for use in Log Analytics](../essentials/resource-logs.md#send-to-log-analytics-workspace) to enable data collection from Azure resources with Azure Diagnostics or Azure storage.

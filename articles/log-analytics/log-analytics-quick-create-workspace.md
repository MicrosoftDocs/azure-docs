---
title: Create a Log Analytics workspace in the Azure Portal | Microsoft Docs
description: Learn how to create a Log Analytics workspace to enable management solutions and data collection from your cloud and on-premises environments in the Azure portal.
services: log-analytics
documentationcenter: log-analytics
author: mgoedtel
manager: carmonm
editor: ''
ms.assetid: 
ms.service: log-analytics
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptal
ms.date: 08/23/2018
ms.author: magoedte
ms.component: 
---

# Create a Log Analytics workspace in the Azure portal
In the Azure portal you can set up a Log Analytics workspace, which is a unique Log Analytics environment with its own data repository, data sources, and solutions.  The steps described in this article are required if you intend on collecting data from the following sources:

* Azure resources in your subscription
* On-premises computers monitored by System Center Operations Manager
* Device collections from System Center Configuration Manager 
* Diagnostics or log data from Azure storage

For other sources, such as Azure VMs and Windows or Linux VMs in your environment, see the following topics:

*  [Collect data from Azure virtual machines](log-analytics-quick-collect-azurevm.md) 
*  [Collect data from hybrid Linux computer](log-analytics-quick-collect-linux-computer.md)
*  [Collect data from hybrid Windows computer](log-analytics-quick-collect-windows-computer.md)

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Sign in to Azure portal
Sign in to the Azure portal at [https://portal.azure.com](https://portal.azure.com). 

## Create a workspace
1. In the Azure portal, click **All services**. In the list of resources, type **Log Analytics**. As you begin typing, the list filters based on your input. Select **Log Analytics**.

    ![Azure portal](media/log-analytics-quick-collect-azurevm/azure-portal-01.png)
  
2. Click **Create**, and then select choices for the following items:

  * Provide a name for the new **Log Analytics Workspace**, such as *DefaultLAWorkspace*. 
  * Select a **Subscription** to link to by selecting from the drop-down list if the default selected is not appropriate.
  * For **Resource Group**, choose to use an existing resource group already setup or create a new one.  
  * Select an available **Location**.  For more information, see which [regions Log Analytics is available in](https://azure.microsoft.com/regions/services/).
  * If you are creating a workspace in a new subscription created after April 2, 2018, it will automatically use the *Per GB* pricing plan and the option to select a pricing tier will not be available.  If you are creating a workspace for an existing subscription created before April 2, or to subscription that was tied to an existing Enterprise Agreement (EA) enrollment, select your preferred pricing tier.  For more information about the particular tiers, see [Log Analytics Pricing Details](https://azure.microsoft.com/pricing/details/log-analytics/).

        ![Create Log Analytics resource blade](media/log-analytics-quick-collect-azurevm/create-loganalytics-workspace-02.png)  

3. After providing the required information on the **Log Analytics Workspace** pane, click **OK**.  

While the information is verified and the workspace is created, you can track its progress under **Notifications** from the menu. 

## Next steps
Now that you have a workspace available, you can configure collection of monitoring telemetry, run log searches to analyze that data, and add a management solution to provide additional data and analytic insights. 

* To enable data collection from Azure resources with Azure Diagnostics or Azure storage, see [Collect Azure service logs and metrics for use in Log Analytics](log-analytics-azure-storage.md).  
* [Add System Center Operations Manager as a data source](log-analytics-om-agents.md) to collect data from agents reporting your Operations Manager management group and store it in your Log Analytics workspace. 
* Connect [Configuration Manager](log-analytics-sccm.md) to import computers that are members of collections in the hierarchy.  
* Review the [management solutions](https://docs.microsoft.com/azure/monitoring/monitoring-solutions-inventory?toc=%2fazure%2flog-analytics%2ftoc.json) available and how to add or remove a solution from your workspace.

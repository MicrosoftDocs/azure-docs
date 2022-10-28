---
title: Enable Azure Network Watcher | Microsoft Docs
description: Learn how to enable Network Watcher.
services: network-watcher
documentationcenter: na
author: jyothisuri

ms.service: network-watcher
ms.topic: article
ms.tgt_pltfrm: na
ms.workload:  infrastructure-services
ms.date: 05/11/2022
ms.author: jsuri
ms.custom: references_regions, devx-track-azurepowershell
---
# Enable Azure Network Watcher

To analyze traffic, you need to have an existing network watcher, or [enable a network watcher](network-watcher-create.md) in each region that you have NSGs that you want to analyze traffic for. Traffic analytics can be enabled for NSGs hosted in any of the [supported regions](supported-region-traffic-analytics.md).

## Select a network security group

Before enabling NSG flow logging, you must have a network security group to log flows for. If you don't have a network security group, see [Create a network security group](../virtual-network/manage-network-security-group.md#create-a-network-security-group) to create one.

In Azure portal, go to **Network watcher**, and then select **NSG flow logs**. Select the network security group that you want to enable an NSG flow log for, as shown in the following picture:

![Screenshot of portal to select N S G that require enablement of NSG flow log.](./media/traffic-analytics/selection-of-nsgs-that-require-enablement-of-nsg-flow-logging.png)

If you try to enable traffic analytics for an NSG that is hosted in any region other than the [supported regions](supported-region-traffic-analytics.md), you receive a "Not found" error.

## Enable flow log settings

Before enabling flow log settings, you must complete the following tasks:

Register the Azure Insights provider, if it's not already registered for your subscription:

```azurepowershell-interactive
Register-AzResourceProvider -ProviderNamespace Microsoft.Insights
```

If you don't already have an Azure Storage account to store NSG flow logs in, you must create a storage account. You can create a storage account with the command that follows. Before running the command, replace `<replace-with-your-unique-storage-account-name>` with a name that is unique across all Azure locations, between 3-24 characters in length, using only numbers and lower-case letters. You can also change the resource group name, if necessary.

```azurepowershell-interactive
New-AzStorageAccount `
  -Location westcentralus `
  -Name <replace-with-your-unique-storage-account-name> `
  -ResourceGroupName myResourceGroup `
  -SkuName Standard_LRS `
  -Kind StorageV2
```

Select the following options, as shown in the picture:

1. Select *On* for **Status**
2. Select *Version 2* for **Flow Logs version**. Version 2 contains flow-session statistics (Bytes and Packets)
3. Select an existing storage account to store the flow logs in. Ensure that your storage does not have "Data Lake Storage Gen2 Hierarchical Namespace Enabled" set to true.
4. Set **Retention** to the number of days you want to store data for. If you want to store the data forever, set the value to *0*. You incur Azure Storage fees for the storage account. 
5. Select *On* for **Traffic Analytics Status**.
6. Select processing interval. Based on your choice, flow logs will be collected from storage account and processed by Traffic Analytics. You can choose processing interval of every 1 hour or every 10 mins. 
7. Select an existing Log Analytics (OMS) Workspace, or select **Create New Workspace** to create a new one. A Log Analytics workspace is used by Traffic Analytics  to store the aggregated and indexed data that is then used to generate the analytics. If you select an existing workspace, it must exist in one of the [supported regions](supported-region-traffic-analytics.md) and have been upgraded to the new query language. If you do not wish to upgrade an existing workspace, or do not have a workspace in a supported region, create a new one. For more information about query languages, see [Azure Log Analytics upgrade to new log search](../azure-monitor/logs/log-query-overview.md?toc=%2fazure%2fnetwork-watcher%2ftoc.json).

    > [!NOTE]
    > The log analytics workspace hosting the traffic analytics solution and the NSGs do not have to be in the same region. For example, you may have traffic analytics in a workspace in the West Europe region, while you may have NSGs in East US and West US. Multiple NSGs can be configured in the same workspace.

8. Select **Save**.

    ![Screenshot showing selection of storage account, Log Analytics workspace, and Traffic Analytics enablement.](./media/traffic-analytics/ta-customprocessinginterval.png)

Repeat the previous steps for any other NSGs for which you wish to enable traffic analytics for. Data from flow logs is sent to the workspace, so ensure that the local laws and regulations in your country/region permit data storage in the region where the workspace exists. If you have set different processing intervals for different NSGs, data will be collected at different intervals. For example, You can choose to enable processing interval of 10 mins for critical VNETs and 1 hour for noncritical VNETs.

You can also configure traffic analytics using the [Set-AzNetworkWatcherConfigFlowLog](/powershell/module/az.network/set-aznetworkwatcherconfigflowlog) PowerShell cmdlet in Azure PowerShell. Run `Get-Module -ListAvailable Az` to find your installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-Az-ps).

## View traffic analytics

To view Traffic Analytics, search for **Network Watcher** in the portal search bar. Once inside Network Watcher, to explore traffic analytics and its capabilities, select **Traffic Analytics** from the left menu. 

![Screenshot that displays how to access the Traffic Analytics dashboard.](./media/traffic-analytics/accessing-the-traffic-analytics-dashboard.png)

The dashboard may take up to 30 minutes to appear the first time because Traffic Analytics must first aggregate enough data for it to derive meaningful insights, before it can generate any reports.
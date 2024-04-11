---
title: Troubleshoot VPN gateways and connections - PowerShell
titleSuffix: Azure Network Watcher
description: Learn how to use Azure Network Watcher VPN troubleshoot capability to troubleshoot VPN virtual network gateways and their connections using PowerShell.
author: halkazwini
ms.author: halkazwini 
ms.service: network-watcher
ms.topic: how-to
ms.date: 11/29/2023
ms.custom: devx-track-azurepowershell

#CustomerIntent: As a network administrator, I want to determine why resources in a virtual network can't communicate with resources in a different virtual network over a VPN connection.
---

# Troubleshoot VPN virtual network gateways and connections using PowerShell

> [!div class="op_single_selector"]
> - [Portal](diagnose-communication-problem-between-networks.md)
> - [PowerShell](vpn-troubleshoot-powershell.md)
> - [Azure CLI](vpn-troubleshoot-cli.md)

In this article, you learn how to use Network Watcher VPN troubleshoot capability to diagnose and troubleshoot VPN virtual network gateways and their connections to solve connectivity issues between your virtual network and on-premises network. VPN troubleshoot requests are long running requests, which could take several minutes to return a result. The logs from troubleshooting are stored in a container on a storage account that is specified.

## Prerequisites

- An Azure account with an active subscription. [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- A Network Watcher enabled in the region of the virtual network gateway. For more information, see [Enable or disable Azure Network Watcher](network-watcher-create.md?tabs=powershell).

- A virtual network gateway. For more information about supported gateway types, see [Supported gateway types](vpn-troubleshoot-overview.md#supported-gateway-types).

- Azure Cloud Shell or Azure PowerShell.

    The steps in this article run the Azure PowerShell cmdlets interactively in [Azure Cloud Shell](/azure/cloud-shell/overview). To run the commands in the Cloud Shell, select **Open Cloud Shell** at the upper-right corner of a code block. Select **Copy** to copy the code and then paste it into Cloud Shell to run it. You can also run the Cloud Shell from within the Azure portal.

    You can also [install Azure PowerShell locally](/powershell/azure/install-azure-powershell) to run the cmdlets. If you run PowerShell locally, sign in to Azure using the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) cmdlet.

## Troubleshoot using an existing storage account

In this section, you learn how to troubleshoot a VPN virtual network gateway or a VPN connection using an existing storage account.

# [**Gateway**](#tab/gateway)

Use [Start-AzNetworkWatcherResourceTroubleshooting](/powershell/module/az.network/start-aznetworkwatcherresourcetroubleshooting) to start troubleshooting the VPN gateway.

```azurepowershell-interactive
# Place the virtual network gateway configuration into a variable.
$vng = Get-AzVirtualNetworkGateway -Name 'myGateway' -ResourceGroupName 'myResourceGroup' 

# Place the storage account configuration into a variable.
$sa = Get-AzStorageAccount -ResourceGroupName 'myResourceGroup' -Name 'mystorageaccount'

# Start VPN troubleshoot session.
Start-AzNetworkWatcherResourceTroubleshooting -Location 'eastus' -TargetResourceId $vng.Id -StorageId $sa.Id -StoragePath 'https://mystorageaccount.blob.core.windows.net/{containerName}'
```

# [**Connection**](#tab/connection)

Use [Start-AzNetworkWatcherResourceTroubleshooting](/powershell/module/az.network/start-aznetworkwatcherresourcetroubleshooting) to start troubleshooting the VPN connection.

```azurepowershell-interactive
# Place the virtual network gateway configuration into a variable.
$connection = Get-AzVirtualNetworkGatewayConnection -Name 'myConnection' -ResourceGroupName 'myResourceGroup'

# Place the storage account configuration into a variable.
$sa = Get-AzStorageAccount -ResourceGroupName 'myResourceGroup' -Name 'mystorageaccount'

# Start VPN troubleshoot session.
Start-AzNetworkWatcherResourceTroubleshooting -Location 'eastus' -TargetResourceId $connection.Id -StorageId $sa.Id -StoragePath 'https://mystorageaccount.blob.core.windows.net/{containerName}'
```

---

After the troubleshooting request is completed, ***healthy*** or ***unhealthy*** is returned. Detailed logs are stored in the storage account container you specified in the previous command. For more information, see [Log files](vpn-troubleshoot-overview.md#log-files). You can use Storage explorer or any other way you prefer to access and download the logs. For more information, see [Get started with Storage Explorer](../vs-azure-tools-storage-manage-with-storage-explorer.md). 

## Troubleshoot using a new storage account

In this section, you learn how to troubleshoot a VPN virtual network gateway or a VPN connection using a new storage account.

# [**Gateway**](#tab/gateway) 

Use [New-AzStorageAccount](/powershell/module/az.storage/new-azstorageaccount) and [New-AzStorageContainer](/powershell/module/az.storage/new-azstoragecontainer) to create a new storage account and a container. Then, use [Start-AzNetworkWatcherResourceTroubleshooting](/powershell/module/az.network/start-aznetworkwatcherresourcetroubleshooting) to start troubleshooting the VPN gateway.

```azurepowershell-interactive
# Place the virtual network gateway configuration into a variable.
$vng = Get-AzVirtualNetworkGateway -Name 'myGateway' -ResourceGroupName 'myResourceGroup' 

# Create a new storage account.
$sa = New-AzStorageAccount -Name 'mystorageaccount' -SKU 'Standard_LRS' -ResourceGroupName 'myResourceGroup' -Location 'eastus'

# Create a container.
Set-AzCurrentStorageAccount -ResourceGroupName $sa.ResourceGroupName -Name $sa.StorageAccountName
$sc = New-AzStorageContainer -Name 'vpn'

# Start VPN troubleshoot session.
Start-AzNetworkWatcherResourceTroubleshooting -Location 'eastus' -TargetResourceId $vng.Id -StorageId $sa.Id -StoragePath 'https://mystorageaccount.blob.core.windows.net/vpn'
```

# [**Connection**](#tab/connection)

Use [New-AzStorageAccount](/powershell/module/az.storage/new-azstorageaccount) and [New-AzStorageContainer](/powershell/module/az.storage/new-azstoragecontainer) to create a new storage account and a container. Then, use [Start-AzNetworkWatcherResourceTroubleshooting](/powershell/module/az.network/start-aznetworkwatcherresourcetroubleshooting) to start troubleshooting the VPN gateway.

```azurepowershell-interactive
# Place the virtual network gateway configuration into a variable.
$connection = Get-AzVirtualNetworkGatewayConnection -Name 'myConnection' -ResourceGroupName 'myResourceGroup'

# Create a new storage account.
$sa = New-AzStorageAccount -Name 'mystorageaccount' -SKU 'Standard_LRS' -ResourceGroupName 'myResourceGroup' -Location 'eastus'

# Create a container.
Set-AzCurrentStorageAccount -ResourceGroupName $sa.ResourceGroupName -Name $sa.StorageAccountName
$sc = New-AzStorageContainer -Name 'vpn'

# Start VPN troubleshoot session.
Start-AzNetworkWatcherResourceTroubleshooting -Location 'eastus' -TargetResourceId $connection.Id -StorageId $sa.Id -StoragePath 'https://mystorageaccount.blob.core.windows.net/vpn'
```

---

After the troubleshooting request is completed, ***healthy*** or ***unhealthy*** is returned. Detailed logs are stored in the storage account container you specified in the previous command. For more information, see [Log files](vpn-troubleshoot-overview.md#log-files). You can use Storage explorer or any other way you prefer to access and download the logs. For more information, see [Get started with Storage Explorer](../vs-azure-tools-storage-manage-with-storage-explorer.md). 

## Related content

- [Tutorial: Diagnose a communication problem between virtual networks using the Azure portal](diagnose-communication-problem-between-networks.md).

- [VPN troubleshoot overview](vpn-troubleshoot-overview.md).
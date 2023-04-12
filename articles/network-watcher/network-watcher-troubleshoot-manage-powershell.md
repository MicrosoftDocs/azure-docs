---
title: Troubleshoot Azure VNet gateway and connections - Azure PowerShell
titleSuffix: Azure Network Watcher
description: This page explains how to use the Azure Network Watcher troubleshoot PowerShell.
services: network-watcher
author: halkazwini
ms.service: network-watcher
ms.topic: how-to
ms.workload: infrastructure-services
ms.date: 11/22/2022
ms.author: halkazwini 
ms.custom: devx-track-azurepowershell, engagement-fy23
---

# Troubleshoot virtual network gateway and connections with Azure Network Watcher using PowerShell

> [!div class="op_single_selector"]
> - [Portal](diagnose-communication-problem-between-networks.md)
> - [PowerShell](network-watcher-troubleshoot-manage-powershell.md)
> - [Azure CLI](network-watcher-troubleshoot-manage-cli.md)
> - [REST API](network-watcher-troubleshoot-manage-rest.md)

Network Watcher provides various capabilities as it relates to understanding your network resources in Azure. One of these capabilities is resource troubleshooting. Resource troubleshooting can be called through the Azure portal, PowerShell, CLI, or REST API. When called, Network Watcher inspects the health of a Virtual Network Gateway or a Connection and returns its findings.


[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Prerequisites

- A [Network Watcher instance](network-watcher-create.md).
- Ensure you're using a supported Gateway type. [Learn more](network-watcher-troubleshoot-overview.md#supported-gateway-types).

## Overview

Resource troubleshooting provides the ability to troubleshoot issues that arise with Virtual Network Gateways and Connections. When a request is made to resource troubleshooting, logs are being queried and inspected. When inspection is complete, the results are returned. Resource troubleshooting requests are long running requests, which could take multiple minutes to return a result. The logs from troubleshooting are stored in a container on a storage account that is specified.

## Retrieve Network Watcher

The first step is to retrieve the Network Watcher instance. The `$networkWatcher` variable is passed to the `Start-AzNetworkWatcherResourceTroubleshooting` cmdlet in step 4.

```powershell
$networkWatcher = Get-AzNetworkWatcher -Location "WestCentralUS" 
```

## Retrieve a Virtual Network Gateway Connection

In this example, resource troubleshooting is being ran on a Connection. You can also pass it a Virtual Network Gateway.

```powershell
$connection = Get-AzVirtualNetworkGatewayConnection -Name "2to3" -ResourceGroupName "testrg"
```

## Create a storage account

Resource troubleshooting returns data about the health of the resource, it also saves logs to a storage account to be reviewed. In this step, we create a storage account, if an existing storage account exists you can use it.

```powershell
$sa = New-AzStorageAccount -Name "contosoexamplesa" -SKU "Standard_LRS" -ResourceGroupName "testrg" -Location "WestCentralUS"
Set-AzCurrentStorageAccount -ResourceGroupName $sa.ResourceGroupName -Name $sa.StorageAccountName
$sc = New-AzStorageContainer -Name logs
```

## Run Network Watcher resource troubleshooting

You can troubleshoot resources with the [Start-AzNetworkWatcherResourceTroubleshooting](/powershell/module/az.network/start-aznetworkwatcherresourcetroubleshooting) cmdlet. We pass the cmdlet the Network Watcher object, the ID of the Connection or Virtual Network Gateway, the storage account ID, and the path to store the results.

> [!NOTE]
> The [Start-AzNetworkWatcherResourceTroubleshooting](/powershell/module/az.network/start-aznetworkwatcherresourcetroubleshooting) cmdlet is long running and may take a few minutes to complete.

```powershell
Start-AzNetworkWatcherResourceTroubleshooting -NetworkWatcher $networkWatcher -TargetResourceId $connection.Id -StorageId $sa.Id -StoragePath "$($sa.PrimaryEndpoints.Blob)$($sc.name)"
```

Once you run the cmdlet, Network Watcher reviews the resource to verify its health. It returns the results to the shell and stores logs of the results in the storage account specified.

## Understanding the results

The action text provides general guidance on how to resolve the issue. 

- If an action can be taken for the issue, a link is provided with additional guidance. 
- If there's no guidance provided, the response provides the URL to open a support case.  

For more information about the properties of the response and what is included, see [Network Watcher Troubleshoot overview](network-watcher-troubleshoot-overview.md).

For instructions on downloading files from Azure storage accounts, refer to [Get started with Azure Blob storage using .NET](../storage/blobs/storage-quickstart-blobs-dotnet.md). Another tool that can be used is Storage Explorer. For more information, see [Storage Explorer](https://storageexplorer.com/).

## Next steps

If VPN connectivity has been stopped due to a change in settings, see [Manage Network Security Groups](../virtual-network/manage-network-security-group.md) to track down the network security group and security rules that may be in question.

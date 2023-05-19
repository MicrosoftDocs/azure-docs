---
title: Create an Azure Network Watcher instance
description: Learn how to create or delete an Azure Network Watcher using the Azure portal, PowerShell, the Azure CLI or the REST API.
services: network-watcher
author: halkazwini
ms.assetid: b1314119-0b87-4f4d-b44c-2c4d0547fb76
ms.service: network-watcher
ms.topic: how-to
ms.workload: infrastructure-services
ms.date: 12/30/2022
ms.author: halkazwini
ms.custom: template-how-to, devx-track-azurepowershell, devx-track-azurecli, engagement-fy23
ms.devlang: azurecli
---

# Create an Azure Network Watcher instance

Network Watcher is a regional service that enables you to monitor and diagnose conditions at a network scenario level in, to, and from Azure. Scenario level monitoring enables you to diagnose problems at an end to end network level view. Network diagnostic and visualization tools available with Network Watcher help you understand, diagnose, and gain insights to your network in Azure. Network Watcher is enabled through the creation of a Network Watcher resource. This resource allows you to utilize Network Watcher capabilities.

## Network Watcher is automatically enabled
When you create or update a virtual network in your subscription, Network Watcher will be enabled automatically in your Virtual Network's region. Automatically enabling Network Watcher doesn't affect your resources or associated charge.

### Opt-out of Network Watcher automatic enablement
If you would like to opt out of Network Watcher automatic enablement, you can do so by running the following commands:

> [!WARNING]
> Opting-out of Network Watcher automatic enablement is a permanent change. Once you opt-out, you cannot opt-in without contacting [Azure support](https://azure.microsoft.com/support/options/).

```azurepowershell-interactive
Register-AzProviderFeature -FeatureName DisableNetworkWatcherAutocreation -ProviderNamespace Microsoft.Network
Register-AzResourceProvider -ProviderNamespace Microsoft.Network
```

```azurecli-interactive
az feature register --name DisableNetworkWatcherAutocreation --namespace Microsoft.Network
az provider register -n Microsoft.Network
```
## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Create a Network Watcher in the portal

1. Sign in to the [Azure portal](https://portal.azure.com) with an account that has the necessary permissions.

2. In the search box at the top of the portal, enter *Network Watcher*.

3. In the search results, select **Network Watcher**.  

4. Select **+ Add**.

5. In **Add network watcher**, select your Azure subscription, then select the region that you want to enable Azure Network Watcher for.

6. Select **Add**.

    :::image type="content" source="./media/network-watcher-create/create-network-watcher.png" alt-text="Screenshot showing how to create a Network Watcher in the Azure portal.":::

When you enable Network Watcher using the Azure portal, the name of the Network Watcher instance is automatically set to *NetworkWatcher_region_name*, where *region_name* corresponds to the Azure region of the Network Watcher instance. For example, a Network Watcher enabled in the East US region is named *NetworkWatcher_eastus*.

The Network Watcher instance is automatically created in a resource group named *NetworkWatcherRG*. The resource group is created if it doesn't already exist.

If you wish to customize the name of a Network Watcher instance and the resource group it's placed into, you can use [PowerShell](#powershell) or [REST API](#restapi) methods. In each option, the resource group must exist before you create a Network Watcher in it.  

## <a name="powershell"></a> Create a Network Watcher using PowerShell

Use [New-AzNetworkWatcher](/powershell/module/az.network/new-aznetworkwatcher) to create an instance of Network Watcher:

```azurepowershell-interactive
New-AzNetworkWatcher -Name NetworkWatcher_westus -ResourceGroupName NetworkWatcherRG -Location westus
```

## Create a Network Watcher using the Azure CLI

Use [az network watcher configure](/cli/azure/network/watcher#az-network-watcher-configure) to create an instance of Network Watcher:

```azurecli-interactive
az network watcher configure --resource-group NetworkWatcherRG --locations westcentralus --enabled
```

## <a name="restapi"></a> Create a Network Watcher using the REST API

The ARMclient is used to call the [REST API](/rest/api/network-watcher/network-watchers/create-or-update) using PowerShell. The ARMClient is found on chocolatey at [ARMClient on Chocolatey](https://chocolatey.org/packages/ARMClient)

### Sign in with ARMClient

```powerShell
armclient login
```

### Create the network watcher

```powershell
$subscriptionId = '<subscription id>'
$networkWatcherName = '<name of network watcher>'
$resourceGroupName = '<resource group name>'
$apiversion = "2022-07-01"
$requestBody = @"
{
'location': 'West Central US'
}
"@

armclient put "https://management.azure.com/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.Network/networkWatchers/${networkWatcherName}?api-version=${api-version}" $requestBody
```

## Create a Network Watcher using Azure Quickstart Template

To create an instance of Network Watcher, refer to this [Quickstart Template](/samples/azure/azure-quickstart-templates/networkwatcher-create).

## Delete a Network Watcher using the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com) with an account that has the necessary permissions.

2. In the search box at the top of the portal, enter *Network Watcher*.

3. In the search results, select **Network Watcher**.  

4. In the **Overview** page, select the Network Watcher instances that you want to delete, then select **Disable**.

    :::image type="content" source="./media/network-watcher-create/delete-network-watcher.png" alt-text="Screenshot showing how to delete a Network Watcher in the Azure portal.":::

5. Enter *yes*, then select **Delete**.

    :::image type="content" source="./media/network-watcher-create/confirm-delete-network-watcher.png" alt-text="Screenshot showing the confirmation page before deleting a Network Watcher in the Azure portal.":::

## Delete a Network Watcher using PowerShell

Use [Remove-AzNetworkWatcher](/powershell/module/az.network/remove-aznetworkwatcher) to delete an instance of Network Watcher:

```azurepowershell-interactive
Remove-AzNetworkWatcher -Name NetworkWatcher_westus -ResourceGroupName NetworkWatcherRG
```

## Delete a Network Watcher using the Azure CLI

Use [az network watcher configure](/cli/azure/network/watcher#az-network-watcher-configure) to delete an instance of Network Watcher:

```azurecli-interactive
az network watcher configure --resource-group NetworkWatcherRG --locations westcentralus --enabled false
```

## Next steps

Now that you have an instance of Network Watcher, learn about the available features:

* [Topology](view-network-topology.md)
* [Packet capture](network-watcher-packet-capture-overview.md)
* [IP flow verify](network-watcher-ip-flow-verify-overview.md)
* [Next hop](network-watcher-next-hop-overview.md)
* [Security group view](network-watcher-security-group-view-overview.md)
* [NSG flow logging](network-watcher-nsg-flow-logging-overview.md)
* [Virtual Network Gateway troubleshooting](network-watcher-troubleshoot-overview.md)
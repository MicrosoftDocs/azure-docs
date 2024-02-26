---
title: Enable or disable Azure Network Watcher
description: Learn how to enable or disable Azure Network Watcher in your region by creating a Network Watcher instance using the Azure portal, PowerShell, the Azure CLI or REST API.
services: network-watcher
author: halkazwini
ms.service: network-watcher
ms.topic: how-to
ms.date: 06/02/2023
ms.author: halkazwini
ms.custom: template-how-to, devx-track-azurepowershell, devx-track-azurecli, engagement-fy23
---

# Enable or disable Azure Network Watcher

Azure Network Watcher is a regional service that enables you to monitor and diagnose conditions at a network scenario level in, to, and from Azure. Scenario level monitoring enables you to diagnose problems at an end to end network level view. Network diagnostic and visualization tools available with Network Watcher help you understand, diagnose, and gain insights to your network in Azure.

Network Watcher is enabled in an Azure region through the creation of a Network Watcher instance in that region. This instance allows you to utilize Network Watcher capabilities in that particular region.

> [!NOTE]
> - By default, Network Watcher is automatically enabled. When you create or update a virtual network in your subscription, Network Watcher will be automatically enabled in your Virtual Network's region.
> - Automatically enabling Network Watcher doesn't affect your resources or associated charge.
> - Network Watcher can be enabled for these [Azure regions](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=network-watcher&regions=all).

## Prerequisites

# [**Portal**](#tab/portal)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Sign in to the [Azure portal](https://portal.azure.com/?WT.mc_id=A261C142F) with your Azure account.

# [**PowerShell**](#tab/powershell)

- An Azure account with an active subscription. [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Azure Cloud Shell or Azure PowerShell.

    The steps in this article run the Azure PowerShell cmdlets interactively in [Azure Cloud Shell](/azure/cloud-shell/overview). To run the commands in the Cloud Shell, select **Open Cloudshell** at the upper-right corner of a code block. Select **Copy** to copy the code and then paste it into Cloud Shell to run it. You can also run the Cloud Shell from within the Azure portal.

  You can also [install Azure PowerShell locally](/powershell/azure/install-azure-powershell) to run the cmdlets. If you run PowerShell locally, sign in to Azure using the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) cmdlet.

# [**Azure CLI**](#tab/cli)

- An Azure account with an active subscription. [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Azure Cloud Shell or Azure CLI.
    
    The steps in this article run the Azure CLI commands interactively in [Azure Cloud Shell](/azure/cloud-shell/overview). To run the commands in the Cloud Shell, select **Open Cloudshell** at the upper-right corner of a code block. Select **Copy** to copy the code, and paste it into Cloud Shell to run it. You can also run the Cloud Shell from within the Azure portal.
    
    You can also [install Azure CLI locally](/cli/azure/install-azure-cli) to run the commands. If you run Azure CLI locally, sign in to Azure using the [az login](/cli/azure/reference-index#az-login) command.

---

## Enable Network Watcher for your region

If you choose to [opt out of Network Watcher automatic enablement](#opt-out-of-network-watcher-automatic-enablement), you must manually enable Network Watcher in each region where you want to use Network Watcher capabilities. To enable Network Watcher in a region, create a Network Watcher instance in that region using the [Azure portal](?tabs=portal#enable-network-watcher-for-your-region), [PowerShell](?tabs=powershell#enable-network-watcher-for-your-region), the [Azure CLI](?tabs=cli#enable-network-watcher-for-your-region), [REST API](/rest/api/network-watcher/network-watchers/create-or-update), or an Azure Resource Manager (ARM) template.



# [**Portal**](#tab/portal)

1. In the search box at the top of the portal, enter *network watcher*. Select **Network Watcher** in the search results.

    :::image type="content" source="./media/network-watcher-create/portal-search.png" alt-text="Screenshot shows how to search for Network Watcher in the Azure portal." lightbox="./media/network-watcher-create/portal-search.png":::

1. In the **Overview** page, select **+ Add**.

1. In **Add network watcher**, select your Azure subscription, then select the region that you want to enable Azure Network Watcher for.

1. Select **Add**.

    :::image type="content" source="./media/network-watcher-create/create-network-watcher.png" alt-text="Screenshot shows how to create a Network Watcher in the Azure portal." lightbox="./media/network-watcher-create/create-network-watcher.png":::

> [!NOTE]
> When you create a Network Watcher instance using the Azure portal:
> - The name of the Network Watcher instance is automatically set to **NetworkWatcher_region**, where *region* corresponds to the Azure region of the Network Watcher instance. For example, a Network Watcher enabled in the East US region is named **NetworkWatcher_eastus**.
> - The Network Watcher instance is created in a resource group named **NetworkWatcherRG**. The resource group is created if it doesn't already exist.

If you wish to customize the name of a Network Watcher instance and resource group, you can use [PowerShell](?tabs=powershell#enable-network-watcher-for-your-region) or [REST API](/rest/api/network-watcher/network-watchers/create-or-update) methods. In each option, the resource group must exist before you create a Network Watcher in it.  

# [**PowerShell**](#tab/powershell)

Create a Network Watcher instance using [New-AzNetworkWatcher](/powershell/module/az.network/new-aznetworkwatcher) cmdlet:

```azurepowershell-interactive
# Create a resource group for the Network Watcher instance (if it doesn't already exist).
New-AzResourceGroup -Name 'NetworkWatcherRG' -Location 'eastus'

# Create an instance of Network Watcher in East US region.
New-AzNetworkWatcher -Name 'NetworkWatcher_eastus' -ResourceGroupName 'NetworkWatcherRG' -Location 'eastus'
```

> [!NOTE]
> When you create a Network Watcher instance using PowerShell, you can customize the name of a Network Watcher instance and resource group. However, the resource group must exist before you create a Network Watcher instance in it.

# [**Azure CLI**](#tab/cli)

Create a Network Watcher instance using [az network watcher configure](/cli/azure/network/watcher#az-network-watcher-configure) command:

```azurecli-interactive
# Create a resource group for the Network Watcher instance (if it doesn't already exist).
az group create --name 'NetworkWatcherRG' --location 'eastus'

# Create an instance of Network Watcher in East US region.
az network watcher configure --resource-group 'NetworkWatcherRG' --locations 'eastus' --enabled
```

> [!NOTE]
> When you create a Network Watcher instance using the Azure CLI:
> - The name of the Network Watcher instance is automatically set to **region-watcher**, where *region* corresponds to the Azure region of the Network Watcher instance. For example, a Network Watcher enabled in the East US region is named **eastus-watcher**.
> - You can customize the name of the Network Watcher resource group. However, the resource group must exist before you create a Network Watcher instance in it.

If you wish to customize the name of the Network Watcher instance, you can use [PowerShell](?tabs=powershell#enable-network-watcher-for-your-region) or [REST API](/rest/api/network-watcher/network-watchers/create-or-update) methods.

---

## Disable Network Watcher for your region

You can disable Network Watcher for a region by deleting the Network Watcher instance in that region. You can delete a Network Watcher instance using the [Azure portal](?tabs=portal#disable-network-watcher-for-your-region), [PowerShell](?tabs=powershell#disable-network-watcher-for-your-region), the [Azure CLI](?tabs=cli#disable-network-watcher-for-your-region), or [REST API](/rest/api/network-watcher/network-watchers/delete).

> [!WARNING]
> Deleting a Network Watcher instance deletes all Network Watcher running operations, historical data, and alerts with no option to revert. For example, if you delete `NetworkWatcher_eastus` instance, all flow logs, connection monitors and packet captures in East US region will be deleted.

# [**Portal**](#tab/portal)

1. In the search box at the top of the portal, enter *network watcher*. Select **Network Watcher** in the search results.

1. In the **Overview** page, select the Network Watcher instances that you want to delete, then select **Disable**.

    :::image type="content" source="./media/network-watcher-create/delete-network-watcher.png" alt-text="Screenshot shows how to delete a Network Watcher instance in the Azure portal." lightbox="./media/network-watcher-create/delete-network-watcher.png":::

1. Enter *yes*, then select **Delete**.

    :::image type="content" source="./media/network-watcher-create/confirm-delete-network-watcher.png" alt-text="Screenshot showing the confirmation page before deleting a Network Watcher in the Azure portal." lightbox="./media/network-watcher-create/confirm-delete-network-watcher.png":::

# [**PowerShell**](#tab/powershell)

Delete a Network Watcher instance using [Remove-AzNetworkWatcher](/powershell/module/az.network/remove-aznetworkwatcher):

```azurepowershell-interactive
# Disable Network Watcher in the East US region by deleting its East US instance.
Remove-AzNetworkWatcher -Location 'eastus'
```

# [**Azure CLI**](#tab/cli)

Use [az network watcher configure](/cli/azure/network/watcher#az-network-watcher-configure) to delete an instance of Network Watcher:

```azurecli-interactive
# Disable Network Watcher in the East US region.
az network watcher configure --locations 'eastus' --enabled 'false'
```

---

## Opt out of Network Watcher automatic enablement

You can opt out of Network Watcher automatic enablement using Azure PowerShell or Azure CLI.

> [!CAUTION]
> Opting-out of Network Watcher automatic enablement is a permanent change. Once you opt out, you cannot opt in without contacting [Azure support](https://azure.microsoft.com/support/options/).

# [**Portal**](#tab/portal)

Opting-out of Network Watcher automatic enablement isn't available in the Azure portal. Use [PowerShell](?tabs=powershell#opt-out-of-network-watcher-automatic-enablement) or [Azure CLI](?tabs=cli#opt-out-of-network-watcher-automatic-enablement) to opt out of Network Watcher automatic enablement.

# [**PowerShell**](#tab/powershell)

To opt out of Network Watcher automatic enablement, use [Register-AzProviderFeature](/powershell/module/az.resources/register-azproviderfeature) cmdlet to register the `DisableNetworkWatcherAutocreation` feature for the `Microsoft.Network` resource provider. Then, use [Register-AzResourceProvider](/powershell/module/az.resources/register-azresourceprovider) cmdlet to register the `Microsoft.Network` resource provider.

```azurepowershell-interactive
# Register the "DisableNetworkWatcherAutocreation" feature.
Register-AzProviderFeature -FeatureName 'DisableNetworkWatcherAutocreation' -ProviderNamespace 'Microsoft.Network'

# Register the "Microsoft.Network" resource provider.
Register-AzResourceProvider -ProviderNamespace 'Microsoft.Network'
```

# [**Azure CLI**](#tab/cli)

To opt out of Network Watcher automatic enablement, use [az feature register](/cli/azure/feature#az-feature-register) command to register the `DisableNetworkWatcherAutocreation` feature for the `Microsoft.Network` resource provider. Then, use [az provider register](/cli/azure/provider#az-provider-register) command to register the `Microsoft.Network` resource provider.

```azurecli-interactive
# Register the "DisableNetworkWatcherAutocreation" feature.
az feature register --name 'DisableNetworkWatcherAutocreation' --namespace 'Microsoft.Network'

# Register the "Microsoft.Network" resource provider.
az provider register --name 'Microsoft.Network'
```

---

> [!NOTE]
> After you opt out of Network Watcher automatic enablement, you must manually enable Network Watcher in each region where you want to use Network Watcher capabilities. For more information, see [Enable Network Watcher for your region](#enable-network-watcher-for-your-region). 

## List Network Watcher instances

You can view all regions where Network Watcher is enabled in your subscription by listing available Network Watcher instances in your subscription. Use the [Azure portal](?tabs=portal#list-network-watcher-instances), [PowerShell](?tabs=powershell#list-network-watcher-instances), the [Azure CLI](?tabs=cli#list-network-watcher-instances) or [REST API](/rest/api/network-watcher/network-watchers/list-all) to list Network Watcher instances in your subscription.

# [**Portal**](#tab/portal)

1. In the search box at the top of the portal, enter *network watcher*. Select **Network Watcher** in the search results.

1. In the **Overview** page, you can see all Network Watcher instances in your subscription.

    :::image type="content" source="./media/network-watcher-create/list-network-watcher.png" alt-text="Screenshot shows how to list all Network Watcher instances in your subscription in the Azure portal." lightbox="./media/network-watcher-create/list-network-watcher.png":::

# [**PowerShell**](#tab/powershell)

List all Network Watcher instances in your subscription using [Get-AzNetworkWatcher](/powershell/module/az.network/get-aznetworkwatcher).

```azurepowershell-interactive
# List all Network Watcher instances in your subscription.
Get-AzNetworkWatcher
```

# [**Azure CLI**](#tab/cli)

List all Network Watcher instances in your subscription using [az network watcher list](/cli/azure/network/watcher#az-network-watcher-list).

```azurecli-interactive
# List all Network Watcher instances in your subscription.
az network watcher list --out table
```

---

## Next steps

To learn more about Network Watcher features, see:

- [NSG flow logs](network-watcher-nsg-flow-logging-overview.md)
- [Connection monitor](connection-monitor-overview.md)
- [Connection troubleshoot](network-watcher-connectivity-overview.md)

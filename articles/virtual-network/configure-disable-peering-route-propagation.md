---
title: Configure disable peering route propagation
titleSuffix: Azure Virtual Network
description: Learn how to disable peering route propagation on an Azure route table by using the Azure portal, Azure CLI, or Azure PowerShell.
author: asudbring
ms.author: allensu
ms.service: azure-virtual-network
ms.topic: how-to
ms.date: 10/16/2026
ms.custom:
  - template-how-to
  - devx-track-azurepowershell
  - devx-track-azurecli
# Customer intent: As a network administrator, I want to disable peering route propagation so that summarized user-defined routes can steer traffic through a network virtual appliance.
---

# Configure disable peering route propagation

When you disable peering route propagation, you suppress system-generated IPv4 and IPv6 peering routes for supported workloads on subnets associated with a route table. This article shows you how to configure the public preview capability by using the Azure portal, Azure CLI, or Azure PowerShell.

Before you configure this setting, review [how disable peering route propagation works, its benefits, and its limitations](virtual-network-peering-overview.md#disable-peering-route-propagation-preview).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- An existing route table associated with the subnets where you want to suppress peering routes. For more information, see [Associate a route table to a subnet](manage-route-table.yml#associate-a-route-table-to-a-subnet).
- The required UDRs and an Azure Firewall or NVA next hop in the same virtual network as the source workload's network interface.
- The `Microsoft.Network/AllowDisablePeeringRoutes` preview feature registered for the subscription that contains the route table. For registration steps and required permissions, see [Set up preview features in an Azure subscription](../azure-resource-manager/management/preview-features.md).

# [**Azure portal**](#tab/portal)

Sign in to the [Azure portal](https://portal.azure.com).

# [**Azure CLI**](#tab/cli)

Install the latest [Azure CLI](/cli/azure/install-azure-cli). Sign in to the subscription that contains the route table by using [az login](/cli/azure/reference-index#az-login).

Register the preview feature:

```azurecli
az feature register \
  --namespace Microsoft.Network \
  --name AllowDisablePeeringRoutes
```

Check the registration state:

```azurecli
az feature show \
  --namespace Microsoft.Network \
  --name AllowDisablePeeringRoutes \
  --query properties.state \
  --output tsv
```

Wait until the state is `Registered`, and then refresh the resource provider registration:

```azurecli
az provider register --namespace Microsoft.Network
```

# [**Azure PowerShell**](#tab/powershell)

Install the latest [Azure PowerShell](/powershell/azure/install-azure-powershell) and Az.Network module version 8.1.0 or later. Sign in to the subscription that contains the route table by using [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount).

You must register the preview feature before you continue. For registration steps, see [Set up preview features in an Azure subscription](../azure-resource-manager/management/preview-features.md).

---

## Disable peering route propagation

# [**Azure portal**](#tab/portal)

1. In the search box at the top of the Azure portal, enter **Route tables**. Select **Route tables** in the search results.
1. Select the route table associated with the subnets where you want to suppress peering routes.
1. Under **Settings**, select **Configuration**.
1. Clear **Enable peering routes (Preview)**.
1. Select **Save**.

:::image type="content" source="./media/configure-disable-peering-route-propagation/disable-peering-route-propagation-portal.png" alt-text="Screenshot of an Azure route table configuration with Enable peering routes cleared.":::

To restore system-generated peering routes, select **Enable peering routes (Preview)**, and then select **Save**.

# [**Azure CLI**](#tab/cli)

Use [az network route-table update](/cli/azure/network/route-table#az-network-route-table-update) to disable peering route propagation. Replace `<resource-group>` and `<route-table-name>` with your values:

```azurecli
az network route-table update \
  --resource-group "<resource-group>" \
  --name "<route-table-name>" \
  --disable-peering-route All
```

To restore system-generated peering routes, run the same command with `--disable-peering-route None`.

# [**Azure PowerShell**](#tab/powershell)

Use [Get-AzRouteTable](/powershell/module/az.network/get-azroutetable) and [Set-AzRouteTable](/powershell/module/az.network/set-azroutetable) to update an existing route table. Replace `<resource-group>` and `<route-table-name>` with your values:

```azurepowershell
$routeTable = Get-AzRouteTable `
  -ResourceGroupName "<resource-group>" `
  -Name "<route-table-name>"

$routeTable.DisablePeeringRoute = "All"

Set-AzRouteTable -RouteTable $routeTable
```

To restore system-generated peering routes, retrieve the current route table, set `$routeTable.DisablePeeringRoute` to `"None"`, and save it with `Set-AzRouteTable`.

---

When you use REST, Azure Resource Manager templates, or Bicep, use API version `2025-07-01` or later for the route table. For the property definition, see [Microsoft.Network/routeTables](/azure/templates/microsoft.network/2025-07-01/routetables).

## Verify route suppression

Check the effective routes for a network interface in a subnet associated with the route table. The routes with next hop type **Virtual network peering** should be suppressed for supported workloads. Confirm that the required UDRs direct traffic to the intended next hop.

For more information, see [Diagnose a virtual machine routing problem](diagnose-network-routing-problem.md).

## Next step

> [!div class="nextstepaction"]
> [Learn more about virtual network peering](virtual-network-peering-overview.md)

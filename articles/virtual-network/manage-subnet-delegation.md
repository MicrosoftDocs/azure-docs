---
title: Add or remove a subnet delegation in an Azure virtual network
titlesuffix: Azure Virtual Network
description: Learn how to add or remove a delegated subnet for a service in Azure.
services: virtual-network
author: asudbring
ms.service: virtual-network
ms.topic: how-to
ms.date: 08/23/2023
ms.author: allensu 
ms.custom: devx-track-azurepowershell, devx-track-azurecli
---

# Add or remove a subnet delegation

Subnet delegation gives explicit permissions to the service to create service-specific resources in the subnet using a unique identifier when deploying the service. This article describes how to add or remove a delegated subnet for an Azure service.

## Prerequisites

# [**Portal**](#tab/manage-subnet-delegation-portal)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- If you didn't create the subnet you would like to delegate to an Azure service, you need the following permission: `Microsoft.Network/virtualNetworks/subnets/write`. The built-in [Network Contributor](../role-based-access-control/built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor) role also contains the necessary permissions.

# [**PowerShell**](#tab/manage-subnet-delegation-powershell)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- If you didn't create the subnet you would like to delegate to an Azure service, you need the following permission: `Microsoft.Network/virtualNetworks/subnets/write`. The built-in [Network Contributor](../role-based-access-control/built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor) role also contains the necessary permissions.

- Azure PowerShell installed locally or Azure Cloud Shell.

- Sign in to Azure PowerShell and ensure you've selected the subscription with which you want to use this feature.  For more information, see [Sign in with Azure PowerShell](/powershell/azure/authenticate-azureps).

- Ensure your `Az.Network` module is 4.3.0 or later. To verify the installed module, use the command `Get-InstalledModule -Name "Az.Network"`. If the module requires an update, use the command `Update-Module -Name Az.Network` if necessary.

If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 5.4.1 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell). If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.
# [**Azure CLI**](#tab/manage-subnet-delegation-cli)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- If you didn't create the subnet you would like to delegate to an Azure service, you need the following permission: `Microsoft.Network/virtualNetworks/subnets/write`. The built-in [Network Contributor](../role-based-access-control/built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor) role also contains the necessary permissions.

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

- This how-to article requires version 2.31.0 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

---

## Create the virtual network

In this section, you create a virtual network and the subnet that you delegate to an Azure service.

# [**Portal**](#tab/manage-subnet-delegation-portal)

[!INCLUDE [virtual-network-create-tabs.md](../../includes/virtual-network-create-tabs.md)]

# [**PowerShell**](#tab/manage-subnet-delegation-powershell)

### Create a resource group

Create a resource group with [`New-AzResourceGroup`](/cli/azure/group). An Azure resource group is a logical container into which Azure resources are deployed and managed.

The following example creates a resource group named **test-rg** in the **eastus2** location:

```azurepowershell-interactive
$rg = @{
    Name = 'test-rg'
    Location = 'eastus2'
}  
New-AzResourceGroup @rg
```
### Create virtual network

Create a virtual network named **vnet-1** with a subnet named **subnet-1** using [`New-AzVirtualNetworkSubnetConfig`](/powershell/module/az.network/new-azvirtualnetworksubnetconfig) in the **test-rg** using [`New-AzVirtualNetwork`](/powershell/module/az.network/new-azvirtualnetwork). 

The IP address space for the virtual network is **10.0.0.0/16**. The subnet within the virtual network is **10.0.0.0/24**.  

```azurepowershell-interactive
$sub = @{
    Name = 'subnet-1'
    AddressPrefix = '10.0.0.0/24'
}
$subnet = New-AzVirtualNetworkSubnetConfig @sub

$net = @{
    Name = 'vnet-1'
    ResourceGroupName = 'test-rg'
    Location = 'eastus2'
    AddressPrefix = '10.0.0.0/16'
    Subnet = $subnet
}
New-AzVirtualNetwork @net
```

# [**Azure CLI**](#tab/manage-subnet-delegation-cli)

### Create a resource group

Create a resource group with [`az group create`](/cli/azure/group). An Azure resource group is a logical container into which Azure resources are deployed and managed.

The following example creates a resource group named **test-rg** in the **eastu2** location:

```azurecli-interactive
az group create \
    --name test-rg \
    --location eastus2
```

### Create a virtual network

Create a virtual network named **vnet-1** with a subnet named **subnet-1** in the **test-rg** using [`az network vnet create`](/cli/azure/network/vnet).

```azurecli-interactive
az network vnet create \
    --resource-group test-rg \
    --location eastus2 \
    --name vnet-1 \
    --address-prefix 10.0.0.0/16 \
    --subnet-name subnet-1 \
    --subnet-prefix 10.0.0.0/24
```

---

## Delegate a subnet to an Azure service

In this section, you delegate the subnet that you created in the preceding section to an Azure service.

# [**Portal**](#tab/manage-subnet-delegation-portal)

1. Sign-in to the [Azure portal](https://portal.azure.com).

1. In the search box at the top of the portal, enter **Virtual network**. Select **Virtual networks** in the search results.

1. Select **vnet-1**.

1. Select **Subnets** in **Settings**.

1. Select **subnet-1**.

1. Enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **SUBNET DELEGATION** |  |
    | Delegate subnet to a service | Select the service that you want to delegate the subnet to. For example, **Microsoft.Sql/managedInstances**. |

1. Select **Save**.

# [**PowerShell**](#tab/manage-subnet-delegation-powershell)

Use [`Add-AzDelegation`](/powershell/module/az.network/add-azdelegation) to update the subnet named **subnet-1** with a delegation named **myDelegation** to an Azure service.  In this example **Microsoft.Sql/managedInstances** is used for the example delegation:

```azurepowershell-interactive
$net = @{
    Name = 'vnet-1'
    ResourceGroupName = 'test-rg'
}
$vnet = Get-AzVirtualNetwork @net

$sub = @{
    Name = 'subnet-1'
    VirtualNetwork = $vnet
}
$subnet = Get-AzVirtualNetworkSubnetConfig @sub

$del = @{
    Name = 'myDelegation'
    ServiceName = 'Microsoft.Sql/managedInstances'
    Subnet = $subnet
}
$subnet = Add-AzDelegation @del

Set-AzVirtualNetwork -VirtualNetwork $vnet
```
Use [`Get-AzDelegation`](/powershell/module/az.network/get-azdelegation) to verify the delegation:

```azurepowershell-interactive
$sub = @{
    Name = 'vnet-1'
    ResourceGroupName = 'test-rg'
}  
$subnet = Get-AzVirtualNetwork @sub | Get-AzVirtualNetworkSubnetConfig -Name 'subnet-1'

$dg = @{
    Name ='myDelegation'
    Subnet = $subnet
}
Get-AzDelegation @dg
```
```console
  ProvisioningState : Succeeded
  ServiceName       : Microsoft.Sql/managedInstances
  Actions           : {Microsoft.Network/virtualNetworks/subnets/join/action}
  Name              : myDelegation
  Etag              : W/"9cba4b0e-2ceb-444b-b553-454f8da07d8a"
  Id                : /subscriptions/3bf09329-ca61-4fee-88cb-7e30b9ee305b/resourceGroups/test-rg/providers/Microsoft.Network/virtualNetworks/vnet-1/subnets/subnet-1/delegations/myDelegation
```

# [**Azure CLI**](#tab/manage-subnet-delegation-cli)

Use [`az network virtual network subnet update`](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-update) to update the subnet named **subnet-1** with a delegation to an Azure service.  In this example **Microsoft.Sql/managedInstances** is used for the example delegation:

```azurecli-interactive
az network vnet subnet update \
    --resource-group test-rg \
    --name subnet-1 \
    --vnet-name vnet-1 \
    --delegations Microsoft.Sql/managedInstances
```

To verify the delegation was applied, use [`az network vnet subnet show`](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-show). Verify the service is delegated to the subnet in the property **serviceName**:

```azurecli-interactive
az network vnet subnet show \
    --resource-group test-rg \
    --name subnet-1 \
    --vnet-name vnet-1 \
    --query delegations
```

```json
[
  {
    "actions": [
      "Microsoft.Network/virtualNetworks/subnets/join/action",
      "Microsoft.Network/virtualNetworks/subnets/prepareNetworkPolicies/action",
      "Microsoft.Network/virtualNetworks/subnets/unprepareNetworkPolicies/action"
    ],
    "etag": "W/\"30184721-8945-4e4f-9cc3-aa16b26589ac\"",
    "id": "/subscriptions/23250d6d-28f0-41dd-9776-61fc80805b6e/resourceGroups/test-rg/providers/Microsoft.Network/virtualNetworks/vnet-1/subnets/subnet-1/delegations/0",
    "name": "0",
    "provisioningState": "Succeeded",
    "resourceGroup": "test-rg",
    "serviceName": "Microsoft.Sql/managedInstances",
    "type": "Microsoft.Network/virtualNetworks/subnets/delegations"
  }
]
```

---

## Remove subnet delegation from an Azure service

In this section, you remove a subnet delegation for an Azure service.

# [**Portal**](#tab/manage-subnet-delegation-portal)

1. Sign-in to the [Azure portal](https://portal.azure.com).

1. In the search box at the top of the portal, enter **Virtual network**. Select **Virtual networks** in the search results.

1. Select **vnet-1**.

1. Select **Subnets** in **Settings**.

1. Select **subnet-1**.

1. Enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **SUBNET DELEGATION** |  |
    | Delegate subnet to a service | Select **None**. |

1. Select **Save**.

# [**PowerShell**](#tab/manage-subnet-delegation-powershell)

Use [`Remove-AzDelegation`](/powershell/module/az.network/remove-azdelegation) to remove the delegation from the subnet named **subnet-1**:

```azurepowershell-interactive
$net = @{
    Name = 'vnet-1'
    ResourceGroupName = 'test-rg'
}
$vnet = Get-AzVirtualNetwork @net

$sub = @{
    Name = 'subnet-1'
    VirtualNetwork = $vnet
}
$subnet = Get-AzVirtualNetworkSubnetConfig @sub

$del = @{
    Name = 'myDelegation'
    Subnet = $subnet
}
$subnet = Remove-AzDelegation @del

Set-AzVirtualNetwork -VirtualNetwork $vnet
```
Use [`Get-AzDelegation`](/powershell/module/az.network/get-azdelegation) to verify the delegation was removed:

```azurepowershell-interactive
$sub = @{
    Name = 'vnet-1'
    ResourceGroupName = 'test-rg'
}  
$subnet = Get-AzVirtualNetwork @sub | Get-AzVirtualNetworkSubnetConfig -Name 'subnet-1'

$dg = @{
    Name ='myDelegation'
    Subnet = $subnet
}
Get-AzDelegation @dg  
```
```console
Get-AzDelegation: Sequence contains no matching element
```

# [**Azure CLI**](#tab/manage-subnet-delegation-cli)

Use [`az network vnet subnet update`](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-update) to remove the delegation from the subnet named **subnet-1**:

```azurecli-interactive
az network vnet subnet update \
    --resource-group test-rg \
    --name subnet-1 \
    --vnet-name vnet-1 \
    --remove delegations
```
To verify the delegation was removed, use [`az network vnet subnet show`](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-show). Verify the service is removed from the subnet in the property **serviceName**:

```azurecli-interactive
az network vnet subnet show \
    --resource-group test-rg \
    --name subnet-1 \
    --vnet-name vnet-1 \
    --query delegations
```
Output from command is a null bracket:
```json
[]
```

---

[!INCLUDE [portal-clean-up.md](../../includes/portal-clean-up.md)]

## Next steps
- Learn how to [manage subnets in Azure](virtual-network-manage-subnet.md).
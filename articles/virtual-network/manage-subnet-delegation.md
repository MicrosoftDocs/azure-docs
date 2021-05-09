---
title: Add or remove a subnet delegation in an Azure virtual network
titlesuffix: Azure Virtual Network
description: Learn how to add or remove a delegated subnet for a service in Azure.
services: virtual-network
documentationcenter: na
author: KumudD
ms.service: virtual-network
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 11/06/2019
ms.author: kumud
---

# Add or remove a subnet delegation

Subnet delegation gives explicit permissions to the service to create service-specific resources in the subnet using a unique identifier when deploying the service. This article describes how to add or remove a delegated subnet for an Azure service.

## Portal

### Sign in to Azure

Sign in to the Azure portal at https://portal.azure.com.

### Create the virtual network

In this section, you create a virtual network and the subnet that you'll later delegate to an Azure service.

1. On the upper-left side of the screen, select **Create a resource** > **Networking** > **Virtual network**.
1. In **Create virtual network**, enter or select this information:

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter *MyVirtualNetwork*. |
    | Address space | Enter *10.0.0.0/16*. |
    | Subscription | Select your subscription.|
    | Resource group | Select **Create new**, enter *myResourceGroup*, then select **OK**. |
    | Location | Select **EastUS**.|
    | Subnet - Name | Enter *mySubnet*. |
    | Subnet - Address range | Enter *10.0.0.0/24*. |
    |||
1. Leave the rest as default, and then select **Create**.

### Permissions

If you didn't create the subnet you would like to delegate to an Azure service, you need the following permission: `Microsoft.Network/virtualNetworks/subnets/write`.

The built-in [Network Contributor](../role-based-access-control/built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor) role also contains the necessary permissions.

### Delegate a subnet to an Azure service

In this section, you delegate the subnet that you created in the preceding section to an Azure service.

1. In the portal's search bar, enter *myVirtualNetwork*. When **myVirtualNetwork** appears in the search results, select it.
2. In the search results, select *myVirtualNetwork*.
3. Select **Subnets**, under **SETTINGS**, and then select **mySubnet**.
4. On the *mySubnet* page, for the **Subnet delegation** list, select from the services listed under **Delegate subnet to a service** (for example, **Microsoft.DBforPostgreSQL/serversv2**).  

### Remove subnet delegation from an Azure service

1. In the portal's search bar, enter *myVirtualNetwork*. When **myVirtualNetwork** appears in the search results, select it.
2. In the search results, select *myVirtualNetwork*.
3. Select **Subnets**, under **SETTINGS**, and then select **mySubnet**.
4. In *mySubnet* page, for the **Subnet delegation** list, select **None** from the services listed under **Delegate subnet to a service**. 

## Azure CLI

Prepare your environment for the Azure CLI.

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](../../includes/azure-cli-prepare-your-environment-no-header.md)]

- This article requires version 2.0.28 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

### Create a resource group
Create a resource group with [az group create](/cli/azure/group). An Azure resource group is a logical container into which Azure resources are deployed and managed.

The following example creates a resource group named **myResourceGroup** in the **eastus** location:

```azurecli-interactive

  az group create \
    --name myResourceGroup \
    --location eastus

```

### Create a virtual network
Create a virtual network named **myVnet** with a subnet named **mySubnet** in the **myResourceGroup** using [az network vnet create](/cli/azure/network/vnet).

```azurecli-interactive
  az network vnet create \
    --resource-group myResourceGroup \
    --location eastus \
    --name myVnet \
    --address-prefix 10.0.0.0/16 \
    --subnet-name mySubnet \
    --subnet-prefix 10.0.0.0/24
```
### Permissions

If you didn't create the subnet you would like to delegate to an Azure service, you need the following permission: `Microsoft.Network/virtualNetworks/subnets/write`.

The built-in [Network Contributor](../role-based-access-control/built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor) role also contains the necessary permissions.

### Delegate a subnet to an Azure service

In this section, you delegate the subnet that you created in the preceding section to an Azure service. 

Use [az network vnet subnet update](/cli/azure/network/vnet/subnet#az_network_vnet_subnet_update) to update the subnet named **mySubnet** with a delegation to an Azure service.  In this example **Microsoft.DBforPostgreSQL/serversv2** is used for the example delegation:

```azurecli-interactive
  az network vnet subnet update \
  --resource-group myResourceGroup \
  --name mySubnet \
  --vnet-name myVnet \
  --delegations Microsoft.DBforPostgreSQL/serversv2
```

To verify the delegation was applied, use [az network vnet subnet show](/cli/azure/network/vnet/subnet#az_network_vnet_subnet_show). Verify the service is delegated to the subnet under the property **serviceName**:

```azurecli-interactive
  az network vnet subnet show \
  --resource-group myResourceGroup \
  --name mySubnet \
  --vnet-name myVnet \
  --query delegations
```

```json
[
  {
    "actions": [
      "Microsoft.Network/virtualNetworks/subnets/join/action"
    ],
    "etag": "W/\"8a8bf16a-38cf-409f-9434-fe3b5ab9ae54\"",
    "id": "/subscriptions/3bf09329-ca61-4fee-88cb-7e30b9ee305b/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/myVnet/subnets/mySubnet/delegations/0",
    "name": "0",
    "provisioningState": "Succeeded",
    "resourceGroup": "myResourceGroup",
    "serviceName": "Microsoft.DBforPostgreSQL/serversv2",
    "type": "Microsoft.Network/virtualNetworks/subnets/delegations"
  }
]
```

### Remove subnet delegation from an Azure service

Use [az network vnet subnet update](/cli/azure/network/vnet/subnet#az_network_vnet_subnet_update) to remove the delegation from the subnet named **mySubnet**:

```azurecli-interactive
  az network vnet subnet update \
  --resource-group myResourceGroup \
  --name mySubnet \
  --vnet-name myVnet \
  --remove delegations
```
To verify the delegation was removed, use [az network vnet subnet show](/cli/azure/network/vnet/subnet#az_network_vnet_subnet_show). Verify the service is removed from the subnet under the property **serviceName**:

```azurecli-interactive
  az network vnet subnet show \
  --resource-group myResourceGroup \
  --name mySubnet \
  --vnet-name myVnet \
  --query delegations
```
Output from command is a null bracket:
```json
[]
```

## Azure PowerShell

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

### Connect to Azure

```azurepowershell-interactive
  Connect-AzAccount
```

### Create a resource group
Create a resource group with [New-AzResourceGroup](/cli/azure/group). An Azure resource group is a logical container into which Azure resources are deployed and managed.

The following example creates a resource group named *myResourceGroup* in the *eastus* location:

```azurepowershell-interactive
  New-AzResourceGroup -Name myResourceGroup -Location eastus
```
### Create virtual network

Create a virtual network named **myVnet** with a subnet named **mySubnet** using [New-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/new-azvirtualnetworksubnetconfig) in the **myResourceGroup** using [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork). The IP address space for the virtual network is **10.0.0.0/16**. The subnet within the virtual network is **10.0.0.0/24**.  

```azurepowershell-interactive
  $subnet = New-AzVirtualNetworkSubnetConfig -Name mySubnet -AddressPrefix "10.0.0.0/24"

  New-AzVirtualNetwork -Name myVnet -ResourceGroupName myResourceGroup -Location eastus -AddressPrefix "10.0.0.0/16" -Subnet $subnet
```
### Permissions

If you didn't create the subnet you would like to delegate to an Azure service, you need the following permission: `Microsoft.Network/virtualNetworks/subnets/write`.

The built-in [Network Contributor](../role-based-access-control/built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor) role also contains the necessary permissions.

### Delegate a subnet to an Azure service

In this section, you delegate the subnet that you created in the preceding section to an Azure service. 

Use [Add-AzDelegation](/powershell/module/az.network/add-azdelegation) to update the subnet named **mySubnet** with a delegation named **myDelegation** to an Azure service.  In this example **Microsoft.DBforPostgreSQL/serversv2** is used for the example delegation:

```azurepowershell-interactive
  $vnet = Get-AzVirtualNetwork -Name "myVNet" -ResourceGroupName "myResourceGroup"
  $subnet = Get-AzVirtualNetworkSubnetConfig -Name "mySubnet" -VirtualNetwork $vnet
  $subnet = Add-AzDelegation -Name "myDelegation" -ServiceName "Microsoft.DBforPostgreSQL/serversv2" -Subnet $subnet
  Set-AzVirtualNetwork -VirtualNetwork $vnet
```
Use [Get-AzDelegation](/powershell/module/az.network/get-azdelegation) to verify the delegation:

```azurepowershell-interactive
  $subnet = Get-AzVirtualNetwork -Name "myVnet" -ResourceGroupName "myResourceGroup" | Get-AzVirtualNetworkSubnetConfig -Name "mySubnet"
  Get-AzDelegation -Name "myDelegation" -Subnet $subnet

  ProvisioningState : Succeeded
  ServiceName       : Microsoft.DBforPostgreSQL/serversv2
  Actions           : {Microsoft.Network/virtualNetworks/subnets/join/action}
  Name              : myDelegation
  Etag              : W/"9cba4b0e-2ceb-444b-b553-454f8da07d8a"
  Id                : /subscriptions/3bf09329-ca61-4fee-88cb-7e30b9ee305b/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/myVnet/subnets/mySubnet/delegations/myDelegation

```
### Remove subnet delegation from an Azure service

Use [Remove-AzDelegation](/powershell/module/az.network/remove-azdelegation) to remove the delegation from the subnet named **mySubnet**:

```azurepowershell-interactive
  $vnet = Get-AzVirtualNetwork -Name "myVnet" -ResourceGroupName "myResourceGroup"
  $subnet = Get-AzVirtualNetworkSubnetConfig -Name "mySubnet" -VirtualNetwork $vnet
  $subnet = Remove-AzDelegation -Name "myDelegation" -Subnet $subnet
  Set-AzVirtualNetwork -VirtualNetwork $vnet
```
Use [Get-AzDelegation](/powershell/module/az.network/get-azdelegation) to verify the delegation was removed:

```azurepowershell-interactive
  $subnet = Get-AzVirtualNetwork -Name "myVnet" -ResourceGroupName "myResourceGroup" | Get-AzVirtualNetworkSubnetConfig -Name "mySubnet"
  Get-AzDelegation -Name "myDelegation" -Subnet $subnet

  Get-AzDelegation: Sequence contains no matching element

```

## Next steps
- Learn how to [manage subnets in Azure](virtual-network-manage-subnet.md).

---
title: How to peer Azure Payment HSM virtual networks
description: How to peer Azure Payment HSM virtual networks
services: payment-hsm
author: msmbaldwin

ms.service: payment-hsm
ms.workload: security
ms.custom: devx-track-azurecli, devx-track-azurepowershell
ms.topic: article
ms.date: 01/25/2022
ms.author: mbaldwin
---

# How to peer payment HSM virtual networks

Peering allows you to seamlessly connect two or more virtual networks, so they appear as a single network for connectivity purposes. For full details, see [Virtual network peering](../virtual-network/virtual-network-peering-overview.md).

The `fastpathenabled` tag must be enabled on any virtual networks that the Payment HSM uses, peered or otherwise. For instance, to peer a virtual network of a payment HSM with a virtual network of a VM, you must first add the `fastpathenabled` tag to the latter.  Unfortunately, adding the `fastpathenabled` tag through the Azure portal is insufficient—it must be done from the commandline.

## Adding the `fastpathenabled` tag

# [Azure CLI](#tab/azure-cli)

First, find the resource ID on the virtual network you wish to tag with the Azure CLI [az network vnet show](/cli/azure/network/vnet#az-network-vnet-show) command:

```azurecli-interactive
az network vnet show -g "myResourceGroup" -n "myVNet"
```

The resource ID will be in the format "/subscriptions/`<subscription-id>`/resourceGroups/`<resource-group-name>`/providers/Microsoft.Network/virtualNetworks/`<vnet-name>`".

Now, use the Azure CLI [az tags create](/cli/azure/tag#az-tag-create) command to add the `fastpathenabled` tag to the virtual network:

```azurecli-interactive
az tag create --resource-id "<resource-id>" --tags "fastpathenabled=True"
```

Afterward, if you run [az network vnet show](/cli/azure/network/vnet#az-network-vnet-show) again, you will see this output:

```json
  "tags": {
    "fastpathenabled": "True"
  },
```

# [Azure PowerShell](#tab/azure-powershell)

First, find the resource ID on the virtual network you wish to tag with the Azure PowerShell [Get-AzVirtualNetwork](/powershell/module/az.network/get-azvirtualnetwork) cmdlet:

```azurepowershell-interactive
Get-AzVirtualNetwork -ResourceGroupName "myResourceGroup" -Name "myVNet" 
```

The resource ID will be in the format "/subscriptions/`<subscription-id>`/resourceGroups/`<resource-group-name>`/providers/Microsoft.Network/virtualNetworks/`<vnet-name>`".

Now, use the Azure PowerShell [Update-AzTag](/powershell/module/az.resources/update-aztag) cmdlet to add the `fastpathenabled` tag to the virtual network:

```azurepowershell-interactive
Update-AzTag -ResourceId "<resource-id>" -Tag -Tag @{`fastpathenabled`="True"} -Operation Merge
```

Afterward, if you run [Get-AzVirtualNetwork](/powershell/module/az.network/get-azvirtualnetwork) again, you will see this output:

```bash
Tags                   :
                         Name             Value
                         ===============  =====
                         fastpathenabled  True
```

---

## Peering the payment HSM and VM virtual networks

# [Azure CLI](#tab/azure-cli)

To peer the payment HSM virtual network with the VM virtual network, use the Azure CLI [az network peering create](/cli/azure/network/vnet/peering#az-network-vnet-peering-create) command to peer the payment HSM VNet to VM VNet and vice versa::

```azurecli-interactive
# Peer payment HSM VNet to VM VNet
az network vnet peering create -g "myResourceGroup" -n "VNet2VMVNetPeering" --vnet-name "myVNet" --remote-vnet "myVMVNet" --allow-vnet-access

# Peer VM VNet to payment HSM VNet
az network vnet peering create -g "myResourceGroup" -n "VMVNet2VNetPeering" --vnet-name "myVMVNet" --remote-vnet "myVNet" --allow-vnet-access
```

# [Azure PowerShell](#tab/azure-powershell)

To peer the payment HSM virtual network with the VM virtual network, first use the Azure PowerShell [Get-AzVirtualNetwork](/powershell/module/az.network/get-azvirtualnetwork) cmdlet to save the details of the virtual networks into variables

```azurepowershell-interactive
$myvnet = Get-AzVirtualNetwork -ResourceGroupName "myResourceGroup" -Name "myVNet"
$myvmvnet = Get-AzVirtualNetwork -ResourceGroupName "myResourceGroup" -Name "myVMVNet" 
```

Then use the Azure PowerShell [Add-AzVirtualNetworkPeering](/powershell/module/az.network/add-azvirtualnetworkpeering) cmdlet to peer the payment HSM VNet to VM VNet and vice versa:

```azurecli-powershell
# Peer payment HSM VNet to VM VNet
Add-AzVirtualNetworkPeering -Name "VNet2VMVNetPeering" -VirtualNetwork $myvnet -RemoteVirtualNetworkId $myvmvnet.Id

# Peer VM VNet to payment HSM VNet
Add-AzVirtualNetworkPeering -Name 'VMVNet2VNetPeering' -VirtualNetwork $myvmvnet -RemoteVirtualNetworkId $myvnet.Id
```

---

## Next steps
- Read an [Overview of Payment HSM](overview.md)
- Find out how to [Get started with Azure Payment HSM](getting-started.md)
- Learn how to [Create a payment HSM](create-payment-hsm.md)
- See the [Azure Payment HSM frequently asked questions](faq.yml)

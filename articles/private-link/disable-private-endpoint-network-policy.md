---
title: Manage network policies for private endpoints
titleSuffix: Azure Private Link
description: Learn how to manage network policies for private endpoints.
services: private-link
author: abell
ms.service: private-link
ms.topic: how-to
ms.date: 07/26/2023
ms.author: abell 
ms.devlang: azurecli
ms.custom: devx-track-azurepowershell, template-how-to
---

# Manage network policies for private endpoints

By default, network policies are disabled for a subnet in a virtual network. To use network policies like user-defined routes and network security group support, network policy support must be enabled for the subnet. This setting only applies to private endpoints in the subnet and affects all private endpoints in the subnet. For other resources in the subnet, access is controlled based on security rules in the network security group.

You can enable network policies either for network security groups only, for user-defined routes only, or for both.

If you enable network security policies for user-defined routes, you can use a custom address prefix equal to or larger than the virtual network address space to invalidate the /32 default route propagated by the private endpoint. This capability can be useful if you want to ensure that private endpoint connection requests go through a firewall or virtual appliance. Otherwise, the /32 default route sends traffic directly to the private endpoint in accordance with the [longest prefix match algorithm](../virtual-network/virtual-networks-udr-overview.md#how-azure-selects-a-route).

> [!IMPORTANT]
> To invalidate a private endpoint route, user-defined routes must have a prefix equal to or larger than the virtual network address space where the private endpoint is provisioned. For example, a user-defined routes default route (0.0.0.0/0) doesn't invalidate private endpoint routes. Network policies should be enabled in the subnet that hosts the private endpoint.

Use the following steps to enable or disable network policy for private endpoints:

* Azure portal
* Azure PowerShell
* Azure CLI
* Azure Resource Manager templates (ARM templates)

The following examples describe how to enable and disable `PrivateEndpointNetworkPolicies` for a virtual network named `myVNet` with a `default` subnet of `10.1.0.0/24` hosted in a resource group named `myResourceGroup`.

## Enable network policy

# [**Portal**](#tab/network-policy-portal)

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box at the top of the portal, enter **Virtual network**. Select **Virtual networks**.

1. Select **myVNet**.

1. In settings of **myVNet**, select **Subnets**.

1. Select the **default** subnet.

1. In the properties for the **default** subnet, select the checkboxes for **Network Security Groups**, **Route tables**, or both in **NETWORK POLICY FOR PRIVATE ENDPOINTS**.

1. Select **Save**.

# [**PowerShell**](#tab/network-policy-powershell)

Use [Get-AzVirtualNetwork](/powershell/module/az.network/get-azvirtualnetwork), [Set-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/set-azvirtualnetworksubnetconfig), and [Set-AzVirtualNetwork](/powershell/module/az.network/set-azvirtualnetwork) to enable the policy.

```azurepowershell
$net = @{
    Name = 'myVNet'
    ResourceGroupName = 'myResourceGroup'
}
$vnet = Get-AzVirtualNetwork @net

$sub = @{
    Name = 'default'
    VirtualNetwork = $vnet
    AddressPrefix = '10.1.0.0/24'
    PrivateEndpointNetworkPoliciesFlag = 'Enabled'  # Can be either 'Disabled', 'NetworkSecurityGroupEnabled', 'RouteTableEnabled', or 'Enabled'
}
Set-AzVirtualNetworkSubnetConfig @sub

$vnet | Set-AzVirtualNetwork
```

# [**CLI**](#tab/network-policy-cli)

Use [az network vnet subnet update](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-update) to enable the policy. The Azure CLI only supports the values `true` or `false`. It doesn't allow you to enable the policies selectively only for user-defined routes or network security groups:

```azurecli
az network vnet subnet update \
  --disable-private-endpoint-network-policies false \
  --name default \
  --resource-group myResourceGroup \
  --vnet-name myVNet
```

# [**JSON**](#tab/network-policy-json)

This section describes how to enable subnet private endpoint policies by using an ARM template. The possible values for `privateEndpointNetworkPolicies` are `Disabled`, `NetworkSecurityGroupEnabled`, `RouteTableEnabled`, and `Enabled`.

```json
{ 
          "name": "myVNet", 
          "type": "Microsoft.Network/virtualNetworks", 
          "apiVersion": "2019-04-01", 
          "location": "WestUS", 
          "properties": { 
                "addressSpace": { 
                     "addressPrefixes": [ 
                          "10.1.0.0/16" 
                        ] 
                  }, 
                  "subnets": [ 
                         { 
                                "name": "default", 
                                "properties": { 
                                    "addressPrefix": "10.1.0.0/24", 
                                    "privateEndpointNetworkPolicies": "Enabled" 
                                 } 
                         } 
                  ] 
          } 
} 
```

---

## Disable network policy

# [**Portal**](#tab/network-policy-portal)

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box at the top of the portal, enter **Virtual network**. Select **Virtual networks**.

1. Select **myVNet**.

1. In settings of **myVNet**, select **Subnets**.

1. Select the **default** subnet.

1. In the properties for the **default** subnet, select **Disabled** in **NETWORK POLICY FOR PRIVATE ENDPOINTS**.

1. Select **Save**.

# [**PowerShell**](#tab/network-policy-powershell)

Use [Get-AzVirtualNetwork](/powershell/module/az.network/get-azvirtualnetwork), [Set-AzVirtualNetwork](/powershell/module/az.network/set-azvirtualnetwork), and [Set-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/set-azvirtualnetworksubnetconfig) to disable the policy.

```azurepowershell
$net = @{
    Name = 'myVNet'
    ResourceGroupName = 'myResourceGroup'
}
$vnet = Get-AzVirtualNetwork @net

$sub = @{
    Name = 'default'
    VirtualNetwork = $vnet
    AddressPrefix = '10.1.0.0/24'
    PrivateEndpointNetworkPoliciesFlag = 'Disabled'
}
Set-AzVirtualNetworkSubnetConfig @sub

$vnet | Set-AzVirtualNetwork
```

# [**CLI**](#tab/network-policy-cli)

Use [az network vnet subnet update](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-update) to disable the policy.

```azurecli
az network vnet subnet update \
  --disable-private-endpoint-network-policies true \
  --name default \
  --resource-group myResourceGroup \
  --vnet-name myVNet
  
```

# [**JSON**](#tab/network-policy-json)

This section describes how to disable subnet private endpoint policies by using an ARM template.

```json
{ 
          "name": "myVNet", 
          "type": "Microsoft.Network/virtualNetworks", 
          "apiVersion": "2019-04-01", 
          "location": "WestUS", 
          "properties": { 
                "addressSpace": { 
                     "addressPrefixes": [ 
                          "10.1.0.0/16" 
                        ] 
                  }, 
                  "subnets": [ 
                         { 
                                "name": "default", 
                                "properties": { 
                                    "addressPrefix": "10.1.0.0/24", 
                                    "privateEndpointNetworkPolicies": "Disabled" 
                                 } 
                         } 
                  ] 
          } 
} 
```

---

> [!IMPORTANT]
> There are limitations to private endpoints in relation to the network policy feature and network security groups and user-defined routes. For more information, see [Limitations](private-endpoint-overview.md#limitations).

## Next steps

- To learn more, see [What is a private endpoint?](private-endpoint-overview.md).
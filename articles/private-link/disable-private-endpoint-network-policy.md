---
title: Manage network policies for private endpoints
titleSuffix: Azure Private Link
description: Learn how to manage network policies for private endpoints.
services: private-link
author: asudbring
ms.service: private-link
ms.topic: how-to
ms.date: 08/26/2021
ms.author: allensu 
ms.custom: devx-track-azurepowershell, devx-track-azurecli 
ms.devlang: azurecli

---
# Manage network policies for private endpoints

Network policies like NSGs (Network security groups) previously weren't supported for private endpoints. To deploy a private endpoint on a given subnet, an explicit disable setting was required on that subnet. This setting is only applicable for the private endpoint. For other resources in the subnet, access is controlled based on security rules in the network security group.

> [!IMPORTANT]
> NSG and UDR support for private endpoints are in public preview on select regions. For more information, see [Public preview of Private Link UDR Support](https://azure.microsoft.com/updates/public-preview-of-private-link-udr-support/) and [Public preview of Private Link Network Security Group Support](https://azure.microsoft.com/updates/public-preview-of-private-link-network-security-group-support/).
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

When using the portal to create a private endpoint, the `PrivateEndpointNetworkPolicies` setting is automatically disabled as part of the create process. Deployment using other clients requires an extra step to change this setting. 

You can disable and enable the setting using:

* Cloud Shell from the Azure portal.
* Azure PowerShell
* Azure CLI
* Azure Resource Manager templates
 
The following examples describe how to disable and enable `PrivateEndpointNetworkPolicies` for a virtual network named **myVNet** with a **default** subnet hosted in a resource group named **myResourceGroup**.

## Azure PowerShell

### Disable network policy

This section describes how to disable subnet private endpoint policies using Azure PowerShell. Use [Get-AzVirtualNetwork](/powershell/module/az.network/get-azvirtualnetwork) and [Set-AzVirtualNetwork](/powershell/module/az.network/set-azvirtualnetwork) to disable the policy.

```azurepowershell
$SubnetName = "default"
$VnetName = "myVNet"
$RGName = "myResourceGroup"

$virtualNetwork = Get-AzVirtualNetwork -Name $VnetName -ResourceGroupName $RGName
($virtualNetwork | Select -ExpandProperty subnets | Where-Object  {$_.Name -eq $SubnetName}).PrivateEndpointNetworkPolicies = "Disabled"  
$virtualNetwork | Set-AzVirtualNetwork
```

### Enable network policy

This section describes how to enable subnet private endpoint policies using Azure PowerShell. Use [Get-AzVirtualNetwork](/powershell/module/az.network/get-azvirtualnetwork) and [Set-AzVirtualNetwork](/powershell/module/az.network/set-azvirtualnetwork) to enable the policy.

```azurepowershell
$SubnetName = "default"
$VnetName = "myVNet"
$RGName = "myResourceGroup"

$virtualNetwork= Get-AzVirtualNetwork -Name $VnetName -ResourceGroupName $RGName
($virtualNetwork | Select -ExpandProperty subnets | Where-Object  {$_.Name -eq $SubnetName}).PrivateEndpointNetworkPolicies = "Enabled"  
$virtualNetwork | Set-AzVirtualNetwork
```
## Azure CLI

### Disable network policy

This section describes how to disable subnet private endpoint policies using Azure CLI. Use [az network vnet subnet update](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-update) to disable the policy.

```azurecli
az network vnet subnet update \
  --disable-private-endpoint-network-policies true \
  --name default \
  --resource-group myResourceGroup \
  --vnet-name myVirtualNetwork
  
```

### Enable network policy

This section describes how to enable subnet private endpoint policies using Azure CLI. Use [az network vnet subnet update](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-update) to enable the policy.

```azurecli
az network vnet subnet update \
  --disable-private-endpoint-network-policies false \
  --name default \
  --resource-group myResourceGroup \
  --vnet-name myVirtualNetwork
  
```
## Resource Manager template

### Disable network policy

This section describes how to disable subnet private endpoint policies using an Azure Resource Manager template.

```json
{ 
          "name": "myVirtualNetwork", 
          "type": "Microsoft.Network/virtualNetworks", 
          "apiVersion": "2019-04-01", 
          "location": "WestUS", 
          "properties": { 
                "addressSpace": { 
                     "addressPrefixes": [ 
                          "10.0.0.0/16" 
                        ] 
                  }, 
                  "subnets": [ 
                         { 
                                "name": "default", 
                                "properties": { 
                                    "addressPrefix": "10.0.0.0/24", 
                                    "privateEndpointNetworkPolicies": "Disabled" 
                                 } 
                         } 
                  ] 
          } 
} 
```

### Enable network policy

This section describes how to enable subnet private endpoint policies using an Azure Resource Manager template.

```json
{ 
          "name": "myVirtualNetwork", 
          "type": "Microsoft.Network/virtualNetworks", 
          "apiVersion": "2019-04-01", 
          "location": "WestUS", 
          "properties": { 
                "addressSpace": { 
                     "addressPrefixes": [ 
                          "10.0.0.0/16" 
                        ] 
                  }, 
                  "subnets": [ 
                         { 
                                "name": "default", 
                                "properties": { 
                                    "addressPrefix": "10.0.0.0/24", 
                                    "privateEndpointNetworkPolicies": "Enabled" 
                                 } 
                         } 
                  ] 
          } 
} 
```
## Next steps
- Learn more about [Azure private endpoint](private-endpoint-overview.md)
 

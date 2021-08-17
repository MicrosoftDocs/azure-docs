---
title: Disable network policies for private endpoints
titleSuffix: Azure Private Link
description: Learn how to disable network policies for private endpoints.
services: private-link
author: asudbring
ms.service: private-link
ms.topic: how-to
ms.date: 07/14/2021
ms.author: allensu 
ms.custom: devx-track-azurepowershell

---
# Disable network policies for private endpoints

Network policies like NSGs (Network security groups) aren't supported for private endpoints. To deploy a private endpoint on a given subnet, an explicit disable setting is required on that subnet. This setting is only applicable for the private endpoint. For other resources in the subnet, access is controlled based on security rules in the network security group.
 
When using the portal to create a private endpoint, the `PrivateEndpointNetworkPolicies` setting is automatically disabled as part of the create process. Deployment using other clients requires an extra step to change this setting. 

You can disable the setting using:

* Cloud Shell from the Azure portal.
* Azure PowerShell
* Azure CLI
* Azure Resource Manager templates
 
The following examples describe how to disable `PrivateEndpointNetworkPolicies` for a virtual network named **myVNet** with a **default** subnet hosted in a resource group named **myResourceGroup**.

## Azure PowerShell

This section describes how to disable subnet private endpoint policies using Azure PowerShell. Use [Get-AzVirtualNetwork](/powershell/module/az.network/get-azvirtualnetwork) and [Set-AzVirtualNetwork](/powershell/module/az.network/set-azvirtualnetwork) to disable the policy.

```azurepowershell
$net =@{
    Name = 'myVNet'
    ResourceGroupName = 'myResourceGroup'
}
$vnet = Get-AzVirtualNetwork @net

($vnet | Select -ExpandProperty subnets).PrivateEndpointNetworkPolicies = "Disabled"

$vnet | Set-AzVirtualNetwork
```
## Azure CLI
This section describes how to disable subnet private endpoint policies using Azure CLI. Use [az network vnet subnet update](/cli/azure/network/vnet/subnet#az_network_vnet_subnet_update) to disable the policy.

```azurecli
az network vnet subnet update \ 
  --disable-private-endpoint-network-policies true \
  --name default \ 
  --resource-group myResourceGroup \ 
  --vnet-name myVirtualNetwork \ 
  
```
## Resource Manager template
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
## Next steps
- Learn more about [Azure private endpoint](private-endpoint-overview.md)
 

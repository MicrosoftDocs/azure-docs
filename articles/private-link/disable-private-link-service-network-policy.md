---
title: 'disable network policies for private link service NAT IP '
description: Learn how to disable network policies for private endpoints.
services: virtual-network
author: KumudD
ms.service: virtual-network
ms.topic: article
ms.date: 09/10/2019
ms.author: kumud

---
# Disable network policies for private link service NAT IP 

Network policies like network security groups (NSG) are not supported for private link service NAT IPs. In order to choose a private link service NAT IP from a given subnet, an explicit disable setting `privateLinkServiceNetworkPolicies` is required. This setting is only applicable for private link service NAT IP. NSG support on any other workload on the subnet is controlled based on the security rules definition. 
 
When using any Azure client (PowerShell, CLI or templates), an additional step is required to change this property. You can disable the policy using the cloud shell from the Azure portal, or local installations of Azure PowerShell, Azure CLI, or use Azure Resource Manager templates.  
 
Below examples describe how to disable private link service network policies for a virtual network named *myVirtualNetwork* with a *default* subnet hosted in a resource group named *myResourceGroup*. 

## Using Azure PowerShell
This section describes how to disable subnet private endpoint policies using Azure PowerShell.

```azurepowershell
$virtualNetwork= Get-AzVirtualNetwork `
  -Name "myVirtualNetwork" ` 
  -ResourceGroupName "myResourceGroup"  
   
($virtualNetwork ` 
  | Select -ExpandProperty subnets ` 
  | Where-Object  {$_.Name -eq 'default'} ).privateLinkServiceNetworkPolicies = "Disabled" 
 
$virtualNetwork | Set-AzVirtualNetwork 
```
## Using Azure CLI
This section describes how to disable subnet private endpoint policies using Azure CLI.
```azurecli
az network vnet subnet update \ 
  --name default \ 
  --resource-group myResourceGroup \ 
  --vnet-name myVirtualNetwork \ 
  --disable-private-link-service-network-policies true 
```
## Using a template
This section describes how to disable subnet private endpoint policies using Azure Resource Manager Template.
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
                        "privateLinkServiceNetworkPolicies": "Disabled" 
                    } 
                } 
        ] 
    } 
} 
 
```
## Next steps
- Learn more about [Azure private endpoint](private-endpoint-overview.md)
 

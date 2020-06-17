---
title: 'Disable network policies for Azure Private Link service source IP address '
description: Learn how to disable network policies for Azure private Link
services: private-link
author: malopMSFT
ms.service: private-link
ms.topic: how-to
ms.date: 09/16/2019
ms.author: allensu

---
# Disable network policies for Private Link service source IP

In order to choose a source IP address for your Private Link service, an explicit disable setting `privateLinkServiceNetworkPolicies` is required on the subnet. This setting is only applicable for the specific private IP address you chose as the source IP of the Private Link service. For other resources in the subnet, access is controlled based on Network Security Groups (NSG) security rules definition. 
 
When using any Azure client (PowerShell, CLI or templates), an additional step is required to change this property. You can disable the policy using the cloud shell from the Azure portal, or local installations of Azure PowerShell, Azure CLI, or use Azure Resource Manager templates.  
 
Follow the steps below to disable private link service network policies for a virtual network named *myVirtualNetwork* with a *default* subnet hosted in a resource group named *myResourceGroup*. 

## Using Azure PowerShell
This section describes how to disable subnet private endpoint policies using Azure PowerShell.
In the code, replace "default" with the name of the virtual subnet.

```azurepowershell
$virtualSubnetName = "default"
$virtualNetwork= Get-AzVirtualNetwork `
  -Name "myVirtualNetwork" ` 
  -ResourceGroupName "myResourceGroup"
   
($virtualNetwork | Select -ExpandProperty subnets | Where-Object  {$_.Name -eq $virtualSubnetName} ).privateLinkServiceNetworkPolicies = "Disabled"  
 
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
- Learn more about [Azure Private Endpoint](private-endpoint-overview.md)
 

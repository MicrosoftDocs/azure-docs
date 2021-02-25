---
title: 'Disable network policies for private endpoints in Azure'
description: Learn how to disable network policies for private endpoints.
services: private-link
author: malopMSFT
ms.service: private-link
ms.topic: how-to
ms.date: 09/16/2019
ms.author: allensu

---
# Disable network policies for private endpoints

Network policies like network security groups (NSG) are not supported for private endpoints. In order to deploy a Private Endpoint on a given subnet, an explicit disable setting is required on that subnet. This setting is only applicable for the Private Endpoint. For other resources in the subnet, access is controlled based on Network Security Groups (NSG) security rules definition. 
 
When using the portal to create a private endpoint, this setting is automatically disabled as part of the create process. Deployment using other clients requires an additional step to change this setting. You can disable the setting using cloud shell from the Azure portal, or local installations of Azure PowerShell, Azure CLI, or use Azure Resource Manager templates.  
 
The following examples describe how to disable `PrivateEndpointNetworkPolicies` for a virtual network named *myVirtualNetwork* with a *default* subnet hosted in a resource group named *myResourceGroup*.

## Using Azure PowerShell
This section describes how to disable subnet private endpoint policies using Azure PowerShell.

```azurepowershell
$virtualNetwork= Get-AzVirtualNetwork `
  -Name "myVirtualNetwork" ` 
  -ResourceGroupName "myResourceGroup"  
   
($virtualNetwork | Select -ExpandProperty subnets | Where-Object  {$_.Name -eq 'default'} ).PrivateEndpointNetworkPolicies = "Disabled" 
 
$virtualNetwork | Set-AzVirtualNetwork 
```
## Using Azure CLI
This section describes how to disable subnet private endpoint policies using Azure CLI.
```azurecli
az network vnet subnet update \ 
  --name default \ 
  --resource-group myResourceGroup \ 
  --vnet-name myVirtualNetwork \ 
  --disable-private-endpoint-network-policies true
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
                                    "privateEndpointNetworkPolicies": "Disabled" 
                                 } 
                         } 
                  ] 
          } 
} 
```
## Next steps
- Learn more about [Azure private endpoint](private-endpoint-overview.md)
 

---
title: 'Disable network policies for Azure Private Link service source IP address'
description: Learn how to disable network policies for Azure Private Link.
services: private-link
author: abell
ms.service: private-link
ms.topic: how-to
ms.date: 03/28/2024
ms.author: abell 
ms.custom: template-how-to
ms.devlang: azurecli
---

# Disable network policies for Private Link service source IP

To choose a source IP address for your Azure Private Link service, the explicit disable setting `privateLinkServiceNetworkPolicies` is required on the subnet. This setting only applies for the specific private IP address you chose as the source IP of the Private Link service. For other resources in the subnet, access is controlled based on the network security group security rules definition.

When you use the portal to create an instance of the Private Link service, this setting is automatically disabled as part of the creation process. Deployments using any Azure client (PowerShell, Azure CLI, or templates) require an extra step to change this property.

To enable or disable the setting, use one of the following options:

* Azure PowerShell
* Azure CLI
* Azure Resource Manager templates

The following examples describe how to enable and disable `privateLinkServiceNetworkPolicies` for a virtual network named `myVNet` with a `default` subnet of `10.1.0.0/24` hosted in a resource group named `myResourceGroup`.

# [**PowerShell**](#tab/private-link-network-policy-powershell)

This section describes how to disable subnet private endpoint policies by using Azure PowerShell. In the following code, replace `default` with the name of your virtual subnet.

```azurepowershell
$subnet = 'default'

$net = @{
    Name = 'myVNet'
    ResourceGroupName = 'myResourceGroup'
}
$vnet = Get-AzVirtualNetwork @net

($vnet | Select -ExpandProperty subnets | Where-Object {$_.Name -eq $subnet}).privateLinkServiceNetworkPolicies = "Disabled"

$vnet | Set-AzVirtualNetwork
```

# [**CLI**](#tab/private-link-network-policy-cli)

This section describes how to disable subnet private endpoint policies by using the Azure CLI.

```azurecli
az network vnet subnet update \
    --name default \
    --vnet-name MyVnet \
    --resource-group myResourceGroup \
    --disable-private-link-service-network-policies yes
```

# [**JSON**](#tab/private-link-network-policy-json)

This section describes how to disable subnet private endpoint policies by using Azure Resource Manager templates.

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
                        "privateLinkServiceNetworkPolicies": "Disabled" 
                    } 
                } 
        ] 
    } 
} 
 
```

---

## Next steps

- Learn more about [Azure private endpoints](private-endpoint-overview.md).

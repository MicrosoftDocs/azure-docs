---
title: 'Disable network policies for Azure Private Link service source IP address'
description: Learn how to disable network policies for Azure private Link
services: private-link
author: asudbring
ms.service: private-link
ms.topic: how-to
ms.date: 02/02/2023
ms.author: allensu 
ms.custom: template-how-to
ms.devlang: azurecli
---

# Disable network policies for Private Link service source IP

In order to choose a source IP address for your Private Link service, an explicit disable setting `privateLinkServiceNetworkPolicies` is required on the subnet. This setting is only applicable for the specific private IP address you chose as the source IP of the Private Link service. For other resources in the subnet, access is controlled based on Network Security Groups (NSG) security rules definition. 
 
When using the portal to create a Private Link service, this setting is automatically disabled as part of the create process. Deployments using any Azure client (PowerShell, CLI or templates), require an extra step to change this property.
 
You can use the following to enable or disable the setting:

* Azure PowerShell

* Azure CLI

* Azure Resource Manager templates
 
The following examples describe how to enable and disable `privateLinkServiceNetworkPolicies` for a virtual network named **myVNet** with a **default** subnet of **10.1.0.0/24** hosted in a resource group named **myResourceGroup**.

# [**PowerShell**](#tab/private-link-network-policy-powershell)

This section describes how to disable subnet private endpoint policies using Azure PowerShell. In the following code, replace "default" with the name of your virtual subnet.

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

This section describes how to disable subnet private endpoint policies using Azure CLI.

```azurecli
az network vnet subnet update \
    --name default \
    --vnet-name MyVnet \
    --resource-group myResourceGroup \
    --disable-private-link-service-network-policies yes
```

# [**JSON**](#tab/private-link-network-policy-json)

This section describes how to disable subnet private endpoint policies using Azure Resource Manager Template.
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

- Learn more about [Azure Private Endpoint](private-endpoint-overview.md)
 

---
title: View Azure Network Watcher topology - PowerShell | Microsoft Docs
description: This article will describe how to use PowerShell to query your network topology.
services: network-watcher
documentationcenter: na
author: georgewallace
manager: timlt
editor: 

ms.assetid: bd0e882d-8011-45e8-a7ce-de231a69fb85
ms.service: network-watcher
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload:  infrastructure-services
ms.date: 02/22/2017
ms.author: gwallace
---

# View Network Watcher topology with PowerShell

> [!div class="op_single_selector"]
> - [PowerShell](network-watcher-topology-powershell.md)
> - [CLI](network-watcher-topology-cli.md)
> - [REST API](network-watcher-topology-rest.md)

The Topology feature of Network Watcher provides a visual representation of the network resources in a subscription. In the portal, this visualization is presented to you automatically. The information behind the topology view in the portal can be retrieved through PowerShell.
This capability makes the topology information more versatile as the data can be consumed by other tools to build out the visualization.

The interconnection is modeled under two relationships.

- **Containment** - Example: VNet contains a Subnet contains a NIC
- **Associated** - Example: NIC is associated with a VM

The following list is properties that are returned when querying the Topology REST API.

* **name** - The name of the resource
* **id** - The uri of the resource.
* **location** - The location where the resource exists.
* **associations** - A list of associations to the referenced object.
    * **name** - The name of the referenced resource.
    * **resourceId** - The resourceId is the uri of the resource referenced in the association.
    * **associationType** - This value references the relationship between the child object and the parent. Valid values are **Contains** or **Associated**.

## Before you begin

In this scenario, you use the `Get-AzureRmNetworkWatcherTopology` cmdlet to retrieve the topology information. There is also an article on how to [retrieve network topology with REST API](network-watcher-topology-rest.md).

This scenario assumes you have already followed the steps in [Create a Network Watcher](network-watcher-create.md) to create a Network Watcher.

## Scenario

The scenario covered in this article retrieves the topology response for a given resource group.

## Retrieve Network Watcher

The first step is to retrieve the Network Watcher instance. The `$networkWatcher` variable is passed to the `Get-AzureRmNetworkWatcherTopology` cmdlet.

```powershell
$nw = Get-AzurermResource | Where {$_.ResourceType -eq "Microsoft.Network/networkWatchers" -and $_.Location -eq "WestCentralUS" }
$networkWatcher = Get-AzureRmNetworkWatcher -Name $nw.Name -ResourceGroupName $nw.ResourceGroupName
```

## Retrieve topology

The `Get-AzureRmNetworkWatcherTopology` cmdlet retrieves the topology for a given resource group.

```powershell
Get-AzureRmNetworkWatcherTopology -NetworkWatcher $networkWatcher -TargetResourceGroupName testrg
```

## Results

The results returned have a property name "Resources", which contains the json response body for the `Get-AzureRmNetworkWatcherTopology` cmdlet.  The response contains the resources in the Network Security Group and their associations (that is, Contains, Associated).

```json
Id              : 00000000-0000-0000-0000-000000000000
CreatedDateTime : 2/1/2017 7:52:21 PM
LastModified    : 2/1/2017 7:46:18 PM
Resources       : [
                    {
                      "Name": "testrg-vnet",
                      "Id":
                  "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testrg/providers/Microsoft.Network/virtualNetworks/testrg-vnet",
                      "Location": "westcentralus",
                      "Associations": [
                        {
                          "AssociationType": "Contains",
                          "Name": "default",
                          "ResourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testrg/providers/Microsoft.Network/virtualNe
                  tworks/testrg-vnet/subnets/default"
                        }
                      ]
                    },
                    {
                      "Name": "default",
                      "Id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testrg/providers/Microsoft.Network/virtualNetworks/testr
                  g-vnet/subnets/default",
                      "Location": "westcentralus",
                      "Associations": []
                    },
                    {
                      "Name": "testrg-vnet2",
                      "Id": 
                  "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testrg/providers/Microsoft.Network/virtualNetworks/testrg-vnet2",
                      "Location": "westcentralus",
                      "Associations": [
                        {
                          "AssociationType": "Contains",
                          "Name": "default",
                          "ResourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testrg/providers/Microsoft.Network/virtualNe
                  tworks/testrg-vnet2/subnets/default"
                        },
                        {
                          "AssociationType": "Contains",
                          "Name": "GatewaySubnet",
                          "ResourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testrg/providers/Microsoft.Network/virtualNe
                  tworks/testrg-vnet2/subnets/GatewaySubnet"
                        },
                        {
                          "AssociationType": "Contains",
                          "Name": "gateway2",
                          "ResourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testrg/providers/Microsoft.Network/virtualNe
                  tworkGateways/gateway2"
                        }
                      ]
                    },
                    ...
                  ]
```

## Next steps

Learn how to visualize your NSG flow logs with Power BI by visiting [Visualize NSG flows logs with Power BI](network-watcher-visualize-nsg-flow-logs-power-bi.md)



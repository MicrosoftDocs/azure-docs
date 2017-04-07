---
title: View Azure Network Watcher topology - REST API | Microsoft Docs
description: This article will describe how to use REST API to query your network topology.
services: network-watcher
documentationcenter: na
author: georgewallace
manager: timlt
editor: 

ms.assetid: de9af643-aea1-4c4c-89c5-21f1bf334c06
ms.service: network-watcher
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload:  infrastructure-services
ms.date: 02/22/2017
ms.author: gwallace
---

# View Network Watcher topology with REST API

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

In this scenario, you retrieve the topology information. ARMclient is used to call the REST API using PowerShell. ARMClient is found on chocolatey at [ARMClient on Chocolatey](https://chocolatey.org/packages/ARMClient)

This scenario assumes you have already followed the steps in [Create a Network Watcher](network-watcher-create.md) to create a Network Watcher.

## Scenario

The scenario covered in this article retrieves the topology response for a given resource group.

## Log in with ARMClient

Log in to armclient with your Azure credentials.

```PowerShell
armclient login
```

## Retrieve topology

The following example requests the topology from the REST API.  The example is parameterized to allow for flexibility in creating an example.  Replace all values with \< \> surrounding them.

```powershell
$subscriptionId = "<subscription id>"
$resourceGroupName = "<resource group name>" # Resource group name to run topology on
$NWresourceGroupName = "<resource group name>" # Network Watcher resource group name
$networkWatcherName = "<network watcher name>"
$requestBody = @"
{
    'targetResourceGroupName': '${resourceGroupName}'
}
"@

armclient POST "https://management.azure.com/subscriptions/${subscriptionId}/ResourceGroups/${NWresourceGroupName}/providers/Microsoft.Network/networkWatchers/${networkWatcherName}/topology?api-version=2016-07-01" $requestBody
```

The following response is an example of a shortened response that is returned when retrieve topology for a resourcegroup:

```json
{
  "id": "ecd6c860-9cf5-411a-bdba-512f8df7799f",
  "createdDateTime": "2017-01-18T04:13:07.1974591Z",
  "lastModified": "2017-01-17T22:11:52.3527348Z",
  "resources": [
    {
      "name": "virtualNetwork1",
      "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/virtualNetworks/{virtualNetworkName}",
      "location": "westcentralus",
      "associations": [
        {
          "name": "{subnetName}",
          "resourceId": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/virtualNetworks/(virtualNetworkName)/subnets
/{subnetName}",
          "associationType": "Contains"
        }
      ]
    },
    {
      "name": "webtestnsg-wjplxls65qcto",
      "resourceId": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/networkSecurityGroups/{nsgName}
s65qcto",
      "associationType": "Associated"
    },
    ...
  ]
}
```

## Next steps

Learn how to visualize your NSG flow logs with Power BI by visiting [Visualize NSG flows logs with Power BI](network-watcher-visualize-nsg-flow-logs-power-bi.md)


---
title: View Azure Network Watcher topology - Azure CLI | Microsoft Docs
description: This article will describe how to use Azure CLI to query your network topology.
services: network-watcher
documentationcenter: na
author: georgewallace
manager: timlt
editor:

ms.assetid: 5cd279d7-3ab0-4813-aaa4-6a648bf74e7b
ms.service: network-watcher
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload:  infrastructure-services
ms.date: 02/22/2017
ms.author: gwallace
---

# View Network Watcher topology with Azure CLI

> [!div class="op_single_selector"]
> - [PowerShell](network-watcher-topology-powershell.md)
> - [CLI](network-watcher-topology-cli.md)
> - [REST API](network-watcher-topology-rest.md)

The Topology feature of Network Watcher provides a visual representation of the network resources in a subscription. In the portal, this visualization is presented to you automatically. The information behind the topology view in the portal can be retrieved through PowerShell.
This capability makes the topology information more versatile as the data can be consumed by other tools to build out the visualization.

This article uses cross-platform Azure CLI 1.0, which is available for Windows, Mac and Linux. Network Watcher currently uses Azure CLI 1.0 for CLI support.

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

In this scenario, you use the `network watcher topology` cmdlet to retrieve the topology information. There is also an article on how to [retrieve network topology with REST API](network-watcher-topology-rest.md).

This scenario assumes you have already followed the steps in [Create a Network Watcher](network-watcher-create.md) to create a Network Watcher.

## Scenario

The scenario covered in this article retrieves the topology response for a given resource group.

## Retrieve topology

The `network watcher topology` cmdlet retrieves the topology for a given resource group. Add the argument "--json" to view the oput in json format

```azurecli
azure network watcher topology -g resourceGroupName -n networkWatcherName -r topologyResourceGroupName --json
```

## Results

The results returned have a property name "Resources", which contains the json response body for the `network watcher topology` cmdlet.  The response contains the resources in the Network Security Group and their associations (that is, Contains, Associated).

```json
{
  "id": "00000000-0000-0000-0000-000000000000",
  "createdDateTime": "2017-02-17T22:20:59.461Z",
  "lastModified": "2016-12-19T22:23:02.546Z",
  "resources": [
    {
      "name": "testrg-vnet",
      "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testrg/providers/Microsoft.Network/virtualNetworks/testrg-vnet",
      "location": "westcentralus",
      "associations": [
        {
          "name": "default",
          "resourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testrg/providers/Microsoft.Network/virtualNetworks/testrg-vnet/subnets/default",
          "associationType": "Contains"
        }
      ]
    },
    {
      "name": "default",
      "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testrg/providers/Microsoft.Network/virtualNetworks/testrg-vnet/subnets/default",
      "location": "westcentralus",
      "associations": []
    },
    {
      "name": "testclient",
      "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testrg/providers/Microsoft.Compute/virtualMachines/testclient",
      "location": "westcentralus",
      "associations": [
        {
          "name": "testNic",
          "resourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testrg/providers/Microsoft.Network/networkInterfaces/testNic",
          "associationType": "Contains"
        }
      ]
    },
    ...    
  ]
}
```

## Next steps

Learn more about the security rules that are applied to your network resources by visiting [Security group view overview](network-watcher-security-group-view-overview.md)

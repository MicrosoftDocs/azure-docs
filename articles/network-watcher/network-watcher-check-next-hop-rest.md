---
title: Find Next Hop with Azure Network Watcher Next Hop - REST | Microsoft Docs
description: This article will describe how you can find what the next hop type is and ip address using Next Hop using the Azure REST API
services: network-watcher
documentationcenter: na
author: georgewallace
manager: timlt
editor: 

ms.assetid: 2216c059-45ba-4214-8304-e56769b779a6
ms.service: network-watcher
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 02/22/2017
ms.author: gwallace
---

# Find out what the next hop type is using the Next Hop capability in Aure Network Watcher using Azure REST API

> [!div class="op_single_selector"]
> - [Azure portal](network-watcher-check-next-hop-portal.md)
> - [PowerShell](network-watcher-check-next-hop-powershell.md)
> - [CLI 1.0](network-watcher-check-next-hop-cli-nodejs.md)
> - [CLI 2.0](network-watcher-check-next-hop-cli.md)
> - [Azure REST API](network-watcher-check-next-hop-rest.md)

Next hop is a feature of Network Watcher that provides the ability get the next hop type and IP address based on a specified virtual machine. This capability is useful in determining if traffic leaving a virtual machine traverses a gateway, internet, or virtual networks to get to its destination.

## Before you begin

ARMclient is used to call the REST API using PowerShell. ARMClient is found on chocolatey at [ARMClient on Chocolatey](https://chocolatey.org/packages/ARMClient)

This scenario assumes you have already followed the steps in [Create a Network Watcher](network-watcher-create.md) to create a Network Watcher.

## Scenario

The scenario covered in this article uses Next Hop, a feature of Network Watcher that finds out the next hop type and IP address for a resource. To learn more about Next Hop, visit [Next Hop Overview](network-watcher-next-hop-overview.md).

In this scenario, you will:

* Retrieve the next hop for a virtual machine.

## Log in with ARMClient

Log in to armclient with your Azure credentials.

```PowerShell
armclient login
```

## Retrieve a virtual machine

Run the following script to return a virtual machine. This information is needed for running next hop.

The following code needs values for the following variables:

- **subscriptionId** - The subscription Id to use.
- **resourceGroupName** - The name of a resource group that contains virtual machines.

```powershell
$subscriptionId = '<subscription id>'
$resourceGroupName = '<resource group name>'

armclient get https://management.azure.com/subscriptions/${subscriptionId}/ResourceGroups/${resourceGroupName}/providers/Microsoft.Compute/virtualMachines?api-version=2015-05-01-preview
```

From the following output, the id of the virtual machine is used in the following example:

```json
...
,
      "type": "Microsoft.Compute/virtualMachines",
      "location": "westcentralus",
      "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/ContosoExampleRG/providers/Microsoft.Compute
/virtualMachines/ContosoVM",
      "name": "ContosoVM"
    }
  ]
}
```

## Get Next Hop

Once the authorization header is created, the next hop from a virtual machine can be retrieved. The following values must be replaced for the code example to work.

> [!Important]
> For Network Watcher REST API calls the resource group name in the request URI is the resource group that contains the Network Watcher, not the resources you are performing the diagnostic actions on.

```powershell
$sourceIP = "10.0.0.4"
$destinationIP = "8.8.8.8"
$resourceGroupName = <resource group name>
$requestBody = @"
{
    'targetResourceId': '${targetUri}',
    'sourceIpAddress': '${sourceIP}',
    'destinationIpAddress': '${destinationIP}',
    'targetNicResourceId' : '${targetNic}'
}
"@

armclient post "https://management.azure.com/subscriptions/${subscriptionId}/ResourceGroups/${resourceGroupName}/providers/Microsoft.Network/networkWatchers/${networkWatcherName}/nextHop?api-version=2016-12-01" $requestBody
```

> [!NOTE]
> Next hop requires that the VM resource is allocated to run.

## Results

The following snippet is an example of the output received. The results contain the following values:

* **nextHopType** - This value is one of the following values: Internet, VirtualAppliance, VirtualNetworkGateway, VnetLocal, HyperNetGateway, or None.
* **nextHopIpAddress** - The IP address of the next hop.
* **routeTableId** - The value is either a uri for the route table associated with the route, or if no user-defined route is defined the value of *System Route* is returned.

The following are the results in json format.

```json
{
  "nextHopType": "Internet",
  "routeTableId": "System Route"
}
```

## Next steps

Once you have been able to find out the next hop for a virtual machine, you can view the security of your network resources by visiting [Security View overview](network-watcher-security-group-view-overview.md)















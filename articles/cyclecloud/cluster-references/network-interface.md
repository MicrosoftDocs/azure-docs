---
title: Azure CycleCloud Cluster Template Reference | Microsoft Docs
description: Network Interface reference for cluster templates for use with Azure CycleCloud
services: azure cyclecloud
author: KimliW
ms.prod: cyclecloud
ms.devlang: na
ms.topic: conceptual
ms.date: 08/01/2018
ms.author: a-kiwels
---

# Network-Interface

Network-interface objects are rank 3 and subordinate to `node` or `nodearray`. Network-interface represents an Azure Network Interface.

## Example

Adding a `[[[network-interface]]]` section to a node adds controls to the default NIC. or can add additional NICs and attach them to a VM.

In this example, we attach a pre-existing NIC to a VM:

``` ini
[cluster my-cluster]
  [[node my-node]]
    Credentials = $Credentials
    SubnetId = $SubnetId
    MachineType = $MachineType
    ImageName = $ImageName

    [[[network-interface my-nic]]]
      NetworkInterfaceId = /subscriptions/17AE2F23-B081-465F-A8E3-BD32C0349788/resourceGroups/my-rg/providers/Microsoft.Network/networkInterfaces/my-nic
```

The `$` is a reference to a parameter name.

## Attribute Reference

Attribute | Type | Definition
------ | ----- | ----------
AssociatePublicIpAddress | Integer | Associate a public ip address with the NIC.
EnableIpForwarding | Boolean | If true, allow ip forwarding.
PrivateIp | IP Address | Assign a specific private ip address (node only)
NetworkInterfaceId | String | Specify an existing NIC by resource ID.
ApplicationSecurityGroups | String (list) | List of Application Security Groups by Resource ID and separated by comma

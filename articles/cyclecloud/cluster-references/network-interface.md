---
title: Azure CycleCloud Cluster Template Reference | Microsoft Docs
description: Network Interface reference for cluster templates for use with Azure CycleCloud
author: KimliW
ms.date: 010/19/2018
ms.author: adjohnso
---

# Network Interface

Network Interface objects are rank 3, and subordinate to `node` or `nodearray`. `network-interface` represents an Azure Network Interface.

### Example

Adding a `[[[network-interface]]]` section to a node adds controls to the default NIC. You can also add additional NICs and attach them to a VM.

In this example, we attach an existing NIC to a VM:

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
AssociatePublicIpAddress | Boolean | Associate a public IP address with the NIC
StaticPublicIpAddress | Boolean | If true, the IP address will be persisted between node restarts
EnableIpForwarding | Boolean | If true, allow IP forwarding
PrivateIp | String | Assign a specific private IP address (node only)
NetworkInterfaceId | String | Specify an existing NIC by resource ID
ApplicationSecurityGroups | String (list) | List of Application Security Groups by Resource ID and separated by comma

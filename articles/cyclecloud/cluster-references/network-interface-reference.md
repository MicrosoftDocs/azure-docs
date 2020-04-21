---
title: Cluster Template Reference - Network
description: Network Interface reference for cluster templates for use with Azure CycleCloud
author: adriankjohnson
ms.date: 03/10/2020
ms.author: adjohnso
---

# Network Interface

Network Interface objects are rank 3, and subordinate to `node` or `nodearray`. `network-interface` represents an Azure Network Interface.

### Example

Adding a `[[[network-interface]]]` section to a node adds controls to the default NIC. You can also add additional NICs and attach them to a VM.

This example attaches an existing NIC to a VM:

``` ini
[cluster my-cluster]
  [[node my-node]]
    Credentials = $Credentials
    SubnetId = $SubnetId
    MachineType = $MachineType
    ImageName = $ImageName

    [[[network-interface my-nic]]]
      NetworkInterfaceId = /subscriptions/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/resourceGroups/my-rg/providers/Microsoft.Network/networkInterfaces/my-nic
```

Attribute values that begin with `$` are referencing parameters.

## Attribute Reference

Attribute | Type | Definition
------ | ----- | ----------
AssociatePublicIpAddress | Boolean | Associate a public IP address with the NIC
StaticPublicIpAddress | Boolean | If true, the IP address will be persisted between node restarts
EnableIpForwarding | Boolean | If true, allow IP forwarding
PrivateIp | String | Assign a specific private IP address (node only)
NetworkInterfaceId | String | Specify an existing NIC by resource ID
ApplicationSecurityGroups | String (list) | List of Application Security Groups by Resource ID and separated by comma

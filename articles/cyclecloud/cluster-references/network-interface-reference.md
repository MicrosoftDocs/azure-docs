---
title: Cluster Template Reference - Network Interface Objects
description: Network Interface reference for cluster templates for use with Azure CycleCloud
author: adriankjohnson
ms.date: 06/03/2024
ms.author: adjohnso
ms.custom: compute-evergreen
---

# Network Interface Objects

Network Interface objects are rank 3, and subordinate to `node` or `nodearray`. `network-interface` represents an Azure Network Interface.

Multiple network interfaces may be attached to a single node for multi-homed VMs.   Refer to the [VM Sizes](/azure/virtual-machines/linux/sizes) documentation to find the maxinum number of NICs for the selected VM SKU.

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
AssociatePublicIpAddress | Boolean | Associate a public IP address with the NIC (node only)
StaticPublicIpAddress | Boolean | If true, the IP address will be persisted between node restarts (node only)
EnableIpForwarding | Boolean | If true, allow IP forwarding (node only)
PrivateIp | String | Assign a specific private IP address (node only)
NetworkInterfaceId | String | Specify an existing NIC by resource ID (node only)
SecurityGroup | String | Specify an existing Network Security Group Resouce ID (overrides the default NSG created when a public IP is specified)
ApplicationSecurityGroups | String (list) | List of Application Security Groups by Resource ID and separated by comma

### Nodearray Network Interface Attributes

The `[[[network-interface]]]` block is most commonly used for single nodes/VMs and most of the attributes do not apply to nodearrays.   However, the block may be used to apply an existing Network Security Group or one or more Application Security Groups to all nodes/VMs in the nodearray.

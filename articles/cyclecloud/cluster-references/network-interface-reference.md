---
title: Cluster Template Reference - Network Interface Objects
description: Network Interface reference for cluster templates for use with Azure CycleCloud
author: adriankjohnson
ms.date: 06/03/2024
ms.author: adjohnso
ms.custom: compute-evergreen
---

# Network Interface Objects

Network Interface objects are rank 3 and subordinate to `node` or `nodearray`. The `network-interface` object represents an Azure Network Interface.

You can attach multiple network interfaces to a single node for multi-homed VMs. To find the maximum number of NICs for the VM version you choose, see the [VM Sizes](/azure/virtual-machines/linux/sizes) documentation.

### Example

Nodes get a single network interface by default. Adding a `[[[network-interface]]]` section to a node lets you override the defaults. You can also add extra NICs and attach them to a VM.

This example creates a node with two network interfaces. It places the second NIC in a different subnet with two application security groups:

``` ini
[cluster my-cluster]
  [[node my-node]]
    Credentials = $Credentials
    SubnetId = my-rg/my-vnet/subnet2
    MachineType = $MachineType
    ImageName = $ImageName

    [[[network-interface nic1]]]
      NetworkInterfaceId = /subscriptions/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/resourceGroups/my-rg/providers/Microsoft.Network/networkInterfaces/my-nic

    [[[network-interface nic2]]]
      SubnetId = my-rg/my-vnet2/subnet
      ApplicationSecurityGroups = /subscriptions/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/resourceGroups/my-rg/providers/Microsoft.Network/applicationSecurityGroups/asg1, /subscriptions/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/resourceGroups/my-rg/providers/Microsoft.Network/applicationSecurityGroups/asg2
```

Attribute values that start with `$` reference parameters.

## Attribute reference

Use the `[[[network-interface]]]` block most commonly for single nodes. The attributes that reference singular properties, such as a private IP address, don't apply to node arrays. However, you can use the block to apply an existing Network Security Group or one or more Application Security Groups to nodes in an array.

Attribute | Type | Definition
--------- | ---- | ----------
AssociatePublicIpAddress | Boolean | Associate a public IP address with the NIC
EnableIpForwarding | Boolean | If true, allow IP forwarding
SecurityGroup | String | Specify an existing Network Security Group Resource ID (overrides the default NSG created when you specify a public IP). This setting overrides the `NetworkSecurityGroupId` [node attribute](node-nodearray-reference.md), if any.
ApplicationSecurityGroups | String (list) | List of Application Security Groups by Resource ID
SubnetId | String | Subnet definition in the form `${rg}/${vnet}/${subnet}`. This value overrides the `SubnetId` [node attribute](node-nodearray-reference.md).
Primary | Boolean | If set, marks this NIC as primary for the operating system.
PrivateIp | String | Assign a specific private IP address (node only).
NetworkInterfaceId | String | Specify an existing NIC by resource ID (node only).
StaticPublicIpAddress | Boolean | If true, the IP address persists between node restarts (node only).

### Existing network interfaces

For head nodes, you can create a NIC separately and attach it to a node:

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

CycleCloud doesn't modify or delete this network interface.

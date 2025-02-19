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

Multiple network interfaces may be attached to a single node for multi-homed VMs.   Refer to the [VM Sizes](/azure/virtual-machines/linux/sizes) documentation to find the maximum number of NICs for the selected VM SKU.

### Example

Nodes will get a single network interface by default. Adding a `[[[network-interface]]]` section to a node lets the defaults be overridden. You can also add additional NICs and attach them to a VM.

This example creates a node with two network interfaces, and places the second nic in a different subnet with two application security groups:

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

Attribute values that begin with `$` are referencing parameters.

## Attribute Reference

The `[[[network-interface]]]` block is most commonly used for single nodes and the attributes that reference singular properties (such as a private IP address) do not apply to node arrays. However, the block may be used to apply an existing Network Security Group or one or more Application Security Groups to nodes in an array.

Attribute | Type | Definition
--------- | ---- | ----------
AssociatePublicIpAddress | Boolean | Associate a public IP address with the NIC
EnableIpForwarding | Boolean | If true, allow IP forwarding
SecurityGroup | String | Specify an existing Network Security Group Resource ID (overrides the default NSG created when a public IP is specified). This overrides the `NetworkSecurityGroupId` [node attribute](node-nodearray-reference.md), if any.
ApplicationSecurityGroups | String (list) | List of Application Security Groups by Resource ID
SubnetId | String | Subnet definition in the form `${rg}/${vnet}/${subnet}`. This overrides the `SubnetId` [node attribute](node-nodearray-reference.md).
Primary | Boolean | If set, marks this NIC as "primary" for the operating system.
PrivateIp | String | Assign a specific private IP address (node only)
NetworkInterfaceId | String | Specify an existing NIC by resource ID (node only)
StaticPublicIpAddress | Boolean | If true, the IP address will be persisted between node restarts (node only)

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

This network interface will not be modified or deleted by CycleCloud.

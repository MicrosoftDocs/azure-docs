---
title: Network Security Options
description: Review Azure CycleCloud network security options. See options for network interfaces, network security groups, and input endpoints in node arrays.
author: adriankjohnson
ms.date: 07/01/2025
ms.author: adjohnso
---

# Node networking configuration

An Azure CycleCloud cluster node comes with default settings for networking. You can change these settings in the node definition section of the cluster template.

## Network interfaces

When Azure CycleCloud creates an Azure VM for a cluster, it attaches a virtual network interface to the VM. For virtual machine scale sets, the virtual network interface connects to a load balancer.

You can configure the network settings for nodes by changing the network interface definition section of the node in the cluster template.

### Assigning public IP addresses

Add an `AssociatePublicIpAddress` attribute to a node to specify whether the node should receive a public IP address. For example:

``` ini
[[node scheduler]]
[[[network-interface eth0]]]
    AssociatePublicIpAddress = true
```

The preceding configuration allows public access to the scheduler node on ports that the Network Security Group for the Virtual Network allows.

By default, the node gets a dynamic public IP address that changes each time you start the cluster. To assign a static public IP address to your node, first [create a public IP address in your Azure subscription](/azure/virtual-network/virtual-network-public-ip-address). Then add the `PublicIP` attribute to your node network-interface section, and assign it the resource ID for the created PublicIP object.

``` ini
[[node scheduler]]
[[[network-interface eth0]]]
    PublicIp = /subscriptions/${subscription_id/resourceGroups/${resource_group_name}/providers/Microsoft.Network/publicIPAddresses/${public-ip-name}
```

Alternatively, create a network interface in your Azure subscription, and [attach a public IP address to that network interface.](/azure/virtual-network/virtual-network-network-interface-addresses). Then, specify that network interface ID in the node config:

``` ini
[[node scheduler]]
[[[network-interface eth0]]]
    NetworkInterfaceId = /subscriptions/${subscription_id/resourceGroups/${resource_group_name}/providers/Microsoft.Network/networkInterfaces/${network-interface-name}
```

### Assigning a Public DNS Label

Adding `PublicDnsLabel` to a public network interface lets you customize the DNS name for that IP address.

``` ini
[[node scheduler]]
[[network-interface eth0]]
    AssociatePublicIpAddress = true
    PublicDnsLabel = myuniquename
```

The preceding configuration gives you a statically assigned public IP address and a DNS entry for the VM that resolves to `myuniquename.eastus.cloudapp.azure.com` (with `eastus` matching the corresponding Azure location for the VM).

### Assigning a private IP address

By default, virtual machines get a dynamically assigned private IP address in Azure. In some cases, you need fixed private IP addresses for the nodes. To configure this option, use the network-interface section of your cluster configuration:

``` ini
[[[network-interface eth0]]]
PrivateIp = x.x.x.x
```

The private IP address you specify must be valid for the associated subnet. Azure reserves the first four and last IPs in the subnet. You can't manually assign these addresses to a node.

## Network security groups

Azure CycleCloud provisions virtual machines and virtual machine scale sets in user-defined virtual networks and subnets. The network security groups associated with the virtual network govern access to specific ports on nodes. For more information, see [Virtual Network Documentation](/azure/virtual-network/security-overview).

If you configure a node's network interface with `AssociatePublicIpAddress = true` or assign a `PublicIp`, the node automatically receives a network security group.

You can specify this network security group by using `SecurityGroup`. If you omit `SecurityGroup`, the network security group is automatically generated from the `input-endpoints` sections on the node. The `SecurityGroup` you specify for an interface overrides the auto-nsg created for `input-endpoints`. Unless you specify a `SecurityGroup`, all interfaces get the auto-nsg from the `input-endpoint` definitions.

## Input endpoints in node arrays

``` ini
[[nodearray execute]]
  [[[network-interface eth0]]]
    AssociatePublicIpAddress = true

  [[[input-endpoint SSH]]]
  PrivatePort = 22
  PublicPort = 10000

  [[[input-endpoint MyCustomPort]]]
  PrivatePort = 999
  PublicPort = 10999
  Protocol = tcp
```

The preceding configuration enables public access to the execute nodes on ports that the Network Security Group allows for the Virtual Network. For the node array, `PublicPort` is the base port number for nodes in the array. The range of ports reserved for the node array is 500 ports for each endpoint. Endpoints default to the TCP protocol, but UDP is also supported by setting `Protocol = UDP`. By default, the node gets a dynamic public IP address that changes each time you start the cluster. To assign a static public IP address to your node, add `PublicIP` to the network interface configuration for the primary interface:

For return proxy nodes, if you don't specify `AssociatePublicIpAddress`, the system automatically creates a public IP address. If you set `AssociatePublicIpAddress` to **False**, the node fails with a warning and no auto-nsg is created for the node.

>[!NOTE]
> When you start a node with `AssociatePublicIpAddress`, the node keeps that IP address until you remove the node or the cluster.

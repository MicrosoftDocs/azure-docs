---
title: Network Security Options
description: Review Azure CycleCloud network security options. See options for network interfaces, network security groups, and input endpoints in node arrays.
author: adriankjohnson
ms.date: 03/01/2018
ms.author: adjohnso
---

# Node Networking Configuration

An Azure CycleCloud cluster node comes with default settings for networking and these are modifiable in the node definition section in the cluster template.

## Network Interfaces

When Azure CycleCloud provisions an Azure VM for a cluster it attaches a virtual network-interface to it. For virtual machine scale sets, a virtual network-interface is attached to a load balancer.

Network settings for nodes are configurable by modifying the network-interface definition section of the node in the cluster template.

### Assigning a Public IP Addresses

Add an `AssociatePublicIpAddress` attribute to a node to specify whether a node should receive a public IP address. For example:

``` ini
[[node master]]
[[[network-interface eth0]]]
    AssociatePublicIpAddress = true
```

The above configuration allows public access to the master node on ports as allowed by the Network Security Group for the Virtual Network.

By default, the public IP address assigned to the node will be dynamic and will change each time the cluster is started. To have a statically-assigned public IP address for your node, first [create a public IP address in your Azure subscription](https://docs.microsoft.com/azure/virtual-network/virtual-network-public-ip-address). Then add the `PublicIP` attribute to your node network-interface section, assigning it the resource ID for the created PublicIP object.

``` ini
[[node master]]
[[[network-interface eth0]]]
    PublicIp = /subscriptions/${subscription_id/resourceGroups/${resource_group_name}/providers/Microsoft.Network/publicIPAddresses/${public-ip-name}
```

Alternatively, create a network-interface in your Azure subscription, and [attach a public IP address to that network interface.](https://docs.microsoft.com/azure/virtual-network/virtual-network-network-interface-addresses). Then, specify that network interface id in the node config:

``` ini
[[node master]]
[[[network-interface eth0]]]
    NetworkInterfaceId = /subscriptions/${subscription_id/resourceGroups/${resource_group_name}/providers/Microsoft.Network/networkInterfaces/${network-interface-name}
```

### Assigning a Public DNS Label

Adding `PublicDnsLabel` to a public network interface will allow you to customize the DNS name for that IP address.

``` ini
[[node master]]
[[network-interface eth0]]
    AssociatePublicIpAddress = true
    PublicDnsLabel = myuniquename
```

The above configuration will yield a statically-assigned public IP address and a DNS entry for the VM that resolves to  `myuniquename.eastus.cloudapp.azure.com` (with `eastus` matching the corresponding Azure location for the VM.)

### Assigning a Private IP Address

By default, virtual machines will receive a dynamically-assigned private IP address in Azure. In certain circumstances, it's necessary or desirable for nodes to have fixed private IP addresses. To accomplish this, use the following configuration for the network-interface section of your cluster configuration:

``` ini
[[[network-interface eth0]]]
PrivateIp = x.x.x.x
```

Note that the private IP address specified must be valid for the associated subnet. Azure reserves the first four and last IPs in the subnet. These addresses cannot be manually assigned to a node.

## Network Security Groups

Azure CycleCloud provisions Virtual Machines and Virtual Machine Scale Sets in user-defined virtual networks and subnets. Access to specific ports on nodes are ultimately governed by the network security groups associated with the virtual network. For more information, see [Virtual Network Documentation](https://docs.microsoft.com/azure/virtual-network/security-overview)

If a node has a network interface configured with `AssociatePublicIpAddress = true`, or is assigned a `PublicIp`, the node will automatically receive a network security group with 

This can be specified by `SecurityGroup`, or, if that is omitted, it will be automatically generated from the `input-endpoints` sections on the node. `SecurityGroup` specified for an interface will override the auto-nsg created for input-endpoints. Unless a specific `SecurityGroup` is specified, all interfaces will get the auto-nsg from the input-endpoint definitions.

## Input-Endpoints in Node Arrays

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

The above configuration allows public access to the master node on ports as allowed by the Network Security Group for the Virtual Network. For the nodearray, `PublicPort` is the base port number for nodes in the array. The range of ports reserved for the nodearray is 500 per endpoint. Endpoints default to TCP protocol but UDP is also supported via `Protocol = UDP`. By default, the public IP address assigned to the node will be dynamic and will change each time the cluster is started. To have a statically-assigned public IP address for your node, add `PublicIP` to the network interface configuration for the primary interface:

For return proxy nodes, if `AssociatePublicIpAddress` has no been specified, a public IP address will be created automatically. If `AssociatePublicIpAddress` has been set to **False**, the node will fail with a warning and no auto-nsg will be created for the node.

>[!NOTE]
> Once a node has been started with `AssociatePublicIpAddress`, it will retain that IP until the node or cluster is removed.

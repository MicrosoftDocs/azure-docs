---
title: Network Connectivity Configuration
description: Configure Azure CycleCloud to access your Virtual Machines
author: adriankjohnson
ms.date: 06/10/2025
ms.author: adjohnso
---

# Azure CycleCloud and Cluster Connectivity

Nodes in a cluster need to communicate with the Azure CycleCloud server for activities such as monitoring, status reporting, service synchronization, and autoscaling. Both HTTPS and AMQP protocols are used with the default TCP ports (443 and 5672 respectively).

If you deploy the Azure CycleCloud server in the same virtual network as the compute cluster, you usually meet the connectivity requirements. However, if your network topology or firewalls block direct communication, consider these alternatives: 

* Designate a return proxy
* Set up virtual network peering

For installations where the CycleCloud application server is installed on-premises:
* VPN connection
* Bastion Server


## Setting up a return proxy

If network topology or firewalls prevent communication between the Azure
CycleCloud server and cluster nodes, you can designate a node in the cluster as a
**return proxy**. With this setup, the listening ports on Azure CycleCloud server are forwarded through an SSH tunnel. The cluster nodes reach the CycleCloud server via ports 37140 and 37141 on the proxy. A typical deployment has the cluster
head node designated as the return proxy, but any persistent node can play that
same role.

For more information about configuring the return proxy, see [Return proxy](~/articles/cyclecloud/how-to/return-proxy.md).

## Virtual network peering

Virtual network peering enables you to connect Azure virtual networks. Once peered, the virtual networks appear as one for connectivity purposes. The traffic between virtual machines in the peered virtual networks is routed through the Microsoft backbone infrastructure. Like traffic routed between virtual machines in the same virtual network, the traffic routes through private IP addresses only. 

For instructions on setting up virtual network peering, see the [Azure Virtual Network documentation
page](/azure/virtual-network/virtual-network-manage-peering).

## VPN

If you deploy your Azure CycleCloud server within your internal network, use this method to enable connectivity between the application server and cluster nodes. Your Azure CycleCloud server can directly reach cluster nodes inside the Azure Virtual Network.

For information about creating a connection between Azure and your VPN, see the [Site-to-Site
Connection](/azure/vpn-gateway/vpn-gateway-howto-site-to-site-resource-manager-portal) documentation (or the appropriate documentation for your cloud provider).

## Bastion Server

Outside of connecting your corporate network directly to your virtual setup, the
next best option is to create an external-facing server (also called a bastion
server or jump box) with a publicly accessible, static IP address. Azure
provides several scenarios in their [Network Security Best
Practices](/azure/security/azure-security-network-security-best-practices)
documentation. Choose the scenario that works best for your environment.

## Proxy Node

Instead of using a dedicated bastion server, you can configure one of the
nodes in your cluster to act as a proxy for communicating back to Azure
CycleCloud. To use this option, configure the public subnet to
automatically assign public IP addresses.

``` ini
[cluster htcondor]
  [[node proxy]]
  # this attribute configures the node to act as a proxy
  IsReturnProxy = true
  credentials = cloud
  MachineType = Standard_A1
  # this is the public subnet
  subnetid = /ResourceGroupName/VnetName/PublicSubnetName
  ImageName = cycle.image.centos7

  [[node private]]
  # this is the private subnet
  subnetid = /ResourceGroupName/VnetName/PrivatebnetName
```

The `proxy` node in this cluster template only proxies
communication from nodes to CycleCloud. It doesn't proxy communication to the
larger Internet.


---
title: Network Connectivity Configuration
description: Configure Azure CycleCloud to access your Virtual Machines
author: adriankjohnson
ms.date: 11/15/2019
ms.author: adjohnso
---

# Azure Cyclecloud and Cluster Connectivity

Nodes in a cluster need to communicate with the Azure CycleCloud server for
activities such as monitoring, status reporting, service synchronization, and
autoscaling. Both HTTPS and AMQP protocols are used with the default TCP ports
(443 and 5672 respectively).

If the Azure CycleCloud server is deployed in the same VNET as the compute
cluster, the connectivity requirements above are usually met. However in
deployments where network topology or firewalls block these direct
communication, there are several alternatives: 

* Designate a Return Proxy
* Setup VNET Peering

For installations where the CycleCloud application server is installed on-premise:
* VPN connection
* Bastion Server


## Setting up a return proxy

If network topology or firewalls prevent communication between the Azure
CycleCloud server and cluster nodes, a node in the cluster can be designated as
a **return proxy** with the listening ports on Azure CycleCloud server forwarded
through an SSH tunnel. The cluster nodes will then reach the CycleCloud server
via ports 37140 and 37141 on the proxy. A typical deployment has the cluster
head node designated as the return proxy, but any persistent node can play that
same role.

More information about configuring the return proxy can be found on this [page](~/articles/cyclecloud/how-to/return-proxy.md)

## VNET Peering

Virtual network peering enables you to seamlessly connect Azure virtual
networks. Once peered, the virtual networks appear as one, for connectivity
purposes. The traffic between virtual machines in the peered virtual networks is
routed through the Microsoft backbone infrastructure, much like traffic is
routed between virtual machines in the same virtual network, through private IP
addresses only. 

The [Azure Virtual Network documentation
page](/azure/virtual-network/virtual-network-manage-peering)
includes instructions for setting VNET peering.

## VPN

If your Azure CycleCloud server is deployed within your internal network, this
is the simplest and recommended method for enabling connectivity between the
application server and cluster nodes. Cluster nodes inside the Azure Virtual
Network will then be directly reachable by your Azure CycleCloud server.

To create a connection between Azure and your VPN, please refer to the
[Site-to-Site
Connection](/azure/vpn-gateway/vpn-gateway-howto-site-to-site-resource-manager-portal)
documentation (or the appropriate documentation for your cloud provider).

## Bastion Server

Outside of connecting your corporate network directly to your virtual setup, the
next best option is to create an external-facing server (also called a bastion
server or jump box) with a publicly accessible, static IP address. Azure
provides several different scenarios in their [Network Security Best
Practices](/azure/security/azure-security-network-security-best-practices)
documentation - choose the one that works best for your particular environment.

## Proxy Node

Instead of using a dedicated bastion server, you can also configure one of the
nodes in your cluster to act as a proxy for communicating back to Azure
CycleCloud. For this to work, you will need to configure the public subnet to
automatically assign public IP addresses:

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

Please note that `proxy` node in this cluster template only proxies
communication from nodes to CycleCloud. It does not proxy communication to the
larger Internet.


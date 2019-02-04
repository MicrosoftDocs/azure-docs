---
title: Create Azure Service Fabric clusters on Windows Server and Linux | Microsoft Docs
description: Service Fabric clusters run on Windows Server and Linux, which means you'll be able to deploy and host Service Fabric applications anywhere you can run Windows Server or Linux.
services: service-fabric
documentationcenter: .net
author: dkkapur
manager: timlt
editor: ''

ms.assetid: 
ms.service: service-fabric
ms.devlang: dotNet
ms.topic: conceptual
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 02/01/2019
ms.author: dekapur

---

# Overview of Service Fabric clusters on Azure
A Service Fabric cluster is a network-connected set of virtual or physical machines into which your microservices are deployed and managed. A machine or VM that is part of a cluster is called a cluster node. Clusters can scale to thousands of nodes. If you add new nodes to the cluster, Service Fabric rebalances the service partition replicas and instances across the increased number of nodes. Overall application performance improves and contention for access to memory decreases. If the nodes in the cluster are not being used efficiently, you can decrease the number of nodes in the cluster. Service Fabric again rebalances the partition replicas and instances across the decreased number of nodes to make better use of the hardware on each node.

A cluster allows hetrogeneous node types with different capacities and configurations. 

## Cluster components and resources
A Service Fabric cluster on Azure is an Azure resource that uses and interacts with other Azure resources:
* VMs and virtual network cards
* virtual machine scale sets
* virtual networks
* load balancers
* storage accounts
* public IP addresses

### Virtual machine
A machine or VM that's part of a cluster is called a node though, technically, a cluster node is a Service Fabric runtime process. Each node is assigned a node name (a string). Nodes have characteristics, such as placement properties. Each machine or VM has an auto-start service, FabricHost.exe, that starts running at boot time and then starts two executables, Fabric.exe and FabricGateway.exe, which make up the node. A production deployment is one node per physical or virtual machine. For testing scenarios, you can host multiple nodes on a single machine or VM by running multiple instances of Fabric.exe and FabricGateway.exe.

Each VM is associated with a virtual network interface card (NIC) and each NIC is assigned a private IP address.  A VM is assigned to a virtual network and local balancer through the NIC.

All VMs in a cluster are placed in a virtual network.  All nodes in the same node type/scale set are placed on the same subnet on the virtual network.  These nodes only have private IP addresses and are not directly addressable outside the virtual network.  Clients can access services on the nodes through the Azure load balancer.

### Scale set/node type
When you create a cluster, you define one or more node types.  The nodes, or VMs, in a node type have the same size and characteristics such as number of CPUs, memory, number of disks, and disk I/O.  For example, one node type could be for small, front-end VMs with ports open to the internet while another node type could be for large, back-end VMs that process data. In Azure clusters, each node type is mapped to a virtual machine scale set.

You can use scale sets to deploy and manage a collection of virtual machines as a set. Each node type that you define in an Azure Service Fabric cluster sets up a separate scale. The Service Fabric runtime is bootstrapped onto each virtual machine in the scale set using Azure VM extensions. You can independently scale each node type up or down, change the OS SKU running on each cluster node, have different sets of ports open, and use different capacity metrics. A scale set has 5 upgrade domains and 5 fault domains and can have up to 100 VMs.  You create clusters of more than 100 nodes by creating multiple scale sets/node types.

Choosing the number of node types for your cluster and the properties of each of node type (size, primary, internet facing, number of VMs, etc.) is an important task.  For more information, read [cluster capacity planning considerations](service-fabric-cluster-capacity.md).

VM instances are joined behind an Azure load balancer, which is associated with a public IP and DNS label.  When you provision a cluster with <clustername>, the DNS name, <clustername>.<location>.cloudapp.azure.com is the DNS label associated with the loadbalancer in front of the scale set.

For more information, read [Service Fabric node types and virtual machine scale sets](service-fabric-cluster-nodetypes.md).

### Azure Load Balancer
VMs in a cluster have only private IP addresses.  Management traffic and service traffic are routed through the public facing load balancer.  Network traffic is routed to these machines through NAT rules (clients connect to specific nodes/instances) or load-balancing rules (traffic goes to VMs round robin).  A load balancer has an associated public IP with a DNS name in the format: <clustername>.<location>.cloudapp.azure.com.  A public IP is another Azure resource in the resource group.  If you define multiple node types in a cluster, a load balancer is created for each node type/scale set.  The primary node type has the DNS lable <clustername>.<location>.cloudapp.azure.com, other node types have the DNS label <clustername>-<nodetype>.<location>.cloudapp.azure.com.

### Storage accounts
Each cluster node type is supported by a Azure storage account and managed disks.

## Cluster security
### Node-to-node security
Node-to-node security secures communication between the VMs or computers in a cluster. This security scenario ensures that only computers that are authorized to join the cluster can participate in hosting applications and services in the cluster. Service Fabric uses X.509 certificates to secure a cluster and provide application security features.  A cluster certificate is required to secure cluster traffic and provide cluster and server authentication.  Self signed-certificates can be used for test clusters, but a certificate from a trusted certificate authority should be used to secure production clusters.

For more information, read [Node-to-node security](service-fabric-cluster-security.md#node-to-node-security)

### Client-to-node security
Client-to-node security authenticates clients and helps secure communication between a client and individual nodes in the cluster. This type of security helps ensure that only authorized users can access the cluster and the applications that are deployed on the cluster. Clients are uniquely identified through either their X.509 certificate security credentials. Any number of optional client certificates can be used to authenticate admin or user clients with the cluster.

In addition to client certificates, Azure Active Directory can also configured to authenticate clients with the cluster.

For more information, read [Client-to-node security](service-fabric-cluster-security.md#client-to-node-security)

### Role-Based Access Control (RBAC)
RBAC allows you to assign fine-grained access controls on Azure resources.  You can assign different access rules to subscriptions, resource groups, and resources.  RBAC rules are inherited along the resource hierarchy unless overridden at a lower level.  You can assign any user or user groups on your AAD with RBAC rules so that designated users and groups can modify your cluster.

Service Fabric also supports access control to limit access to certain cluster operations for different groups of users. This helps make the cluster more secure. Two access control types are supported for clients that connect to a cluster: Administrator role and User role.  

For more information, read [Service Fabric Role-Based Access Control (RBAC)](service-fabric-cluster-security.md#role-based-access-control-rbac).

### Network security groups 
Network security groups (NSGs) control inbound and outbound traffic of a subnet, VM, or specific NIC.  By default, when multiple VMs are put on the same virtual network they can communicate with each other through any port.  If you want to constrain communications among the machines you can define NSGs to segment the network or isolate VMs from each other.  If you have multiple node types in a cluster, you can apply NSGs to subnets to prevent machines belonging to different nodetypes from communicating with each other.  

For more information, read [Service Fabric cluster security](service-fabric-cluster-security.md)

## Supported operating systems for clusters on Azure
You are able to create clusters on virtual machines running these operating systems:

* Windows Server 2012 R2
* Windows Server 2016 
* Windows Server 1709
* Windows Server 1803
* Linux Ubuntu 16.04
* Red Hat Enterprise Linux 7.4 (preview support)

> [!NOTE]
> If you decide to deploy Service Fabric on Windows Server 1709, please note that (1) it is not a long term servicing branch, so you may have to move versions in the future, and (2) if you deploy containers, containers built on Windows Server 2016 do not work on Windows Server 1709, and vice versa (you will have to rebuild them to deploy them).
>



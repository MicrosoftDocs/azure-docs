---
title: Create clusters on Windows Server and Linux 
description: Service Fabric clusters run on Windows Server and Linux. You can deploy and host Service Fabric applications anywhere you can run Windows Server or Linux.
documentationcenter: .net
ms.topic: conceptual
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/14/2022
---

# Overview of Service Fabric clusters on Azure
A Service Fabric cluster is a network-connected set of virtual or physical machines into which your microservices are deployed and managed. A machine or VM that is part of a cluster is called a cluster node. Clusters can scale to thousands of nodes. If you add new nodes to the cluster, Service Fabric rebalances the service partition replicas and instances across the increased number of nodes. Overall application performance improves and contention for access to memory decreases. If the nodes in the cluster are not being used efficiently, you can decrease the number of nodes in the cluster. Service Fabric again rebalances the partition replicas and instances across the decreased number of nodes to make better use of the hardware on each node.

A node type defines the size, number, and properties for a set of nodes (virtual machines) in the cluster. Each node type can then be scaled up or down independently, have different sets of ports open, and can have different capacity metrics. Node types are used to define roles for a set of cluster nodes, such as "front end" or "back end". Your cluster can have more than one node type, but the primary node type must have at least five VMs for production clusters (or at least three VMs for test clusters). [Service Fabric system services](service-fabric-technical-overview.md#system-services) are placed on the nodes of the primary node type. 

## Cluster components and resources
A Service Fabric cluster on Azure is an Azure resource that uses and interacts with other Azure resources:
* VMs and virtual network cards
* virtual machine scale sets
* virtual networks
* load balancers
* storage accounts
* public IP addresses

![Service Fabric Cluster][Image]

### Virtual machine
A [virtual machine](../virtual-machines/index.yml) that's part of a cluster is called a node though, technically, a cluster node is a Service Fabric runtime process. Each node is assigned a node name (a string). Nodes have characteristics, such as [placement properties](service-fabric-cluster-resource-manager-cluster-description.md#node-properties-and-placement-constraints). Each machine or VM has an auto-start service, *FabricHost.exe*, which starts running at boot time and then starts two executables, *Fabric.exe* and *FabricGateway.exe*, which make up the node. A production deployment is one node per physical or virtual machine. For testing scenarios, you can host multiple nodes on a single machine or VM by running multiple instances of *Fabric.exe* and *FabricGateway.exe*.

Each VM is associated with a virtual network interface card (NIC) and each NIC is assigned a private IP address.  A VM is assigned to a virtual network and local balancer through the NIC.

All VMs in a cluster are placed in a virtual network.  All nodes in the same node type/scale set are placed on the same subnet on the virtual network.  These nodes only have private IP addresses and are not directly addressable outside the virtual network.  Clients can access services on the nodes through the Azure load balancer.

### Scale set/node type
When you create a cluster, you define one or more node types.  The nodes, or VMs, in a node type have the same size and characteristics such as number of CPUs, memory, number of disks, and disk I/O.  For example, one node type could be for small, front-end VMs with ports open to the internet while another node type could be for large, back-end VMs that process data. In Azure clusters, each node type is mapped to a [virtual machine scale set](../virtual-machine-scale-sets/index.yml).

You can use scale sets to deploy and manage a collection of virtual machines as a set. Each node type that you define in an Azure Service Fabric cluster sets up a separate scale set. The Service Fabric runtime is bootstrapped onto each virtual machine in the scale set using Azure VM extensions. You can independently scale each node type up or down, change the OS SKU running on each cluster node, have different sets of ports open, and use different capacity metrics. A scale set has five [upgrade domains](service-fabric-cluster-resource-manager-cluster-description.md#upgrade-domains) and five [fault domains](service-fabric-cluster-resource-manager-cluster-description.md#fault-domains) and can have up to 100 VMs.  You create clusters of more than 100 nodes by creating multiple scale sets/node types.

> [!IMPORTANT]
> Choosing the number of node types for your cluster and the properties of each of node type (size, primary, internet facing, number of VMs, etc.) is an important task.  For more information, read [cluster capacity planning considerations](service-fabric-cluster-capacity.md).

For more information, read [Service Fabric node types and virtual machine scale sets](service-fabric-cluster-nodetypes.md).

### Azure Load Balancer
VM instances are joined behind an [Azure load balancer](../load-balancer/load-balancer-overview.md), which is associated with a [public IP address](../virtual-network/ip-services/public-ip-addresses.md) and DNS label.  When you provision a cluster with *&lt;clustername&gt;*, the DNS name, *&lt;clustername&gt;.&lt;location&gt;.cloudapp.azure.com* is the DNS label associated with the load balancer in front of the scale set.

VMs in a cluster have only [private IP addresses](../virtual-network/ip-services/private-ip-addresses.md).  Management traffic and service traffic are routed through the public facing load balancer.  Network traffic is routed to these machines through NAT rules (clients connect to specific nodes/instances) or load-balancing rules (traffic goes to VMs round robin).  A load balancer has an associated public IP with a DNS name in the format: *&lt;clustername&gt;.&lt;location&gt;.cloudapp.azure.com*.  A public IP is another Azure resource in the resource group.  If you define multiple node types in a cluster, a load balancer is created for each node type/scale set. Or, you can set up a single load balancer for multiple node types.  The primary node type has the DNS label *&lt;clustername&gt;.&lt;location&gt;.cloudapp.azure.com*, other node types have the DNS label *&lt;clustername&gt;-&lt;nodetype&gt;.&lt;location&gt;.cloudapp.azure.com*.

### Storage accounts
Each cluster node type is supported by an [Azure storage account](../storage/common/storage-introduction.md) and managed disks.

## Cluster security
A Service Fabric cluster is a resource that you own.  It is your responsibility to secure your clusters to help prevent unauthorized users from connecting to them. A secure cluster is especially important when you are running production workloads on the cluster. 

### Node-to-node security
Node-to-node security secures communication between the VMs or computers in a cluster. This security scenario ensures that only computers that are authorized to join the cluster can participate in hosting applications and services in the cluster. Service Fabric uses X.509 certificates to secure a cluster and provide application security features.  A cluster certificate is required to secure cluster traffic and provide cluster and server authentication.  Self signed-certificates can be used for test clusters, but a certificate from a trusted certificate authority should be used to secure production clusters.

For more information, read [Node-to-node security](service-fabric-cluster-security.md#node-to-node-security)

### Client-to-node security
Client-to-node security authenticates clients and helps secure communication between a client and individual nodes in the cluster. This type of security helps ensure that only authorized users can access the cluster and the applications that are deployed on the cluster. Clients are uniquely identified through either their X.509 certificate security credentials. Any number of optional client certificates can be used to authenticate admin or user clients with the cluster.

In addition to client certificates, Microsoft Entra ID can also be configured to authenticate clients with the cluster.

For more information, read [Client-to-node security](service-fabric-cluster-security.md#client-to-node-security)

### Role-based access control

Azure role-based access control (Azure RBAC) allows you to assign fine-grained access controls on Azure resources.  You can assign different access rules to subscriptions, resource groups, and resources.  Azure RBAC rules are inherited along the resource hierarchy unless overridden at a lower level.  You can assign any user or user groups on your Microsoft Entra ID with Azure RBAC rules so that designated users and groups can modify your cluster.  For more information, read the [Azure RBAC overview](../role-based-access-control/overview.md).

Service Fabric also supports access control to limit access to certain cluster operations for different groups of users. This helps make the cluster more secure. Two access control types are supported for clients that connect to a cluster: Administrator role and User role.  

For more information, read [Service Fabric role-based access control](service-fabric-cluster-security.md#service-fabric-role-based-access-control).

### Network security groups 
Network security groups (NSGs) control inbound and outbound traffic of a subnet, VM, or specific NIC.  By default, when multiple VMs are put on the same virtual network they can communicate with each other through any port.  If you want to constrain communications among the machines you can define NSGs to segment the network or isolate VMs from each other.  If you have multiple node types in a cluster, you can apply NSGs to subnets to prevent machines belonging to different node types from communicating with each other.  

For more information, read about [security groups](../virtual-network/network-security-groups-overview.md)

## Scaling

Application demands change over time. You may need to increase cluster resources to meet increased application workload or network traffic or decrease cluster resources when demand drops. After creating a Service Fabric cluster, you can scale the cluster horizontally (change the number of nodes) or vertically (change the resources of the nodes). You can scale the cluster at any time, even when workloads are running on the cluster. As the cluster scales, your applications automatically scale as well.

For more information, read [Scaling Azure clusters](service-fabric-cluster-scaling.md).

## Upgrading
An Azure Service Fabric cluster is a resource that you own, but is partly managed by Microsoft. Microsoft is responsible for patching the underlying OS and performing Service Fabric runtime upgrades on your cluster. You can set your cluster to receive automatic runtime upgrades, when Microsoft releases a new version, or choose to select a supported runtime version that you want. In addition to runtime upgrades, you can also update cluster configuration such as certificates or application ports.

For more information, read [Upgrading clusters](service-fabric-cluster-upgrade.md).

## Supported operating systems
Please see [Supported Versions in Azure](./service-fabric-versions.md) for additional information


## Next steps
Read more about [securing](service-fabric-cluster-security.md), [scaling](service-fabric-cluster-scaling.md), and [upgrading](service-fabric-cluster-upgrade.md) Azure clusters.

Learn about [Service Fabric support options](service-fabric-support.md).

[Image]: media/service-fabric-azure-clusters-overview/Cluster.PNG

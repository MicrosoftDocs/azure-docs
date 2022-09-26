---
title: Standalone Service Fabric clusters overview 
description: Service Fabric clusters run on Windows Server and Linux, which means you'll be able to deploy and host Service Fabric applications anywhere you can run Windows Server or Linux.
ms.topic: conceptual
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/11/2022
---

# Overview of Service Fabric Standalone clusters

A Service Fabric cluster is a network-connected set of virtual or physical machines into which your microservices are deployed and managed. A machine or VM that is part of a cluster is called a cluster node. Clusters can scale to thousands of nodes. If you add new nodes to the cluster, Service Fabric rebalances the service partition replicas and instances across the increased number of nodes. Overall application performance improves and contention for access to memory decreases. If the nodes in the cluster are not being used efficiently, you can decrease the number of nodes in the cluster. Service Fabric again rebalances the partition replicas and instances across the decreased number of nodes to make better use of the hardware on each node.

A node type defines the size, number, and properties for a set of nodes in the cluster. Each node type can then be scaled up or down independently, have different sets of ports open, and can have different capacity metrics. Node types are used to define roles for a set of cluster nodes, such as "front end" or "back end". Your cluster can have more than one node type, but the primary node type must have at least five VMs for production clusters (or at least three VMs for test clusters). [Service Fabric system services](service-fabric-technical-overview.md#system-services) are placed on the nodes of the primary node type.

The process for creating a Service Fabric cluster on-premises is similar to the process of creating a cluster on any cloud of your choice with a set of VMs. The initial steps to provision the VMs are governed by the cloud provider or on-premises environment that you are using. Once you have a set of VMs with network connectivity enabled between them, then the steps to set up the Service Fabric package, edit the cluster settings, and run the cluster creation and management scripts are identical. This ensures that your knowledge and experience of operating and managing Service Fabric clusters is transferable when you choose to target new hosting environments.

## Cluster security

A Service Fabric cluster is a resource that you own.  It is your responsibility to secure your clusters to help prevent unauthorized users from connecting to them. A secure cluster is especially important when you are running production workloads on the cluster.

> [!NOTE]
> Windows authentication is based on Kerberos. NTLM is not supported as an authentication type.
>
> Whenever possible, use X.509 certificate authentication for Service Fabric clusters.

### Node-to-node security

Node-to-node security secures communication between the VMs or computers in a cluster. This security scenario ensures that only computers that are authorized to join the cluster can participate in hosting applications and services in the cluster. Service Fabric uses X.509 certificates to secure a cluster and provide application security features.  A cluster certificate is required to secure cluster traffic and provide cluster and server authentication.  Self signed-certificates can be used for test clusters, but a certificate from a trusted certificate authority should be used to secure production clusters.

Windows security can also be enabled for a Windows standalone cluster. If you have Windows Server 2012 R2 and Windows Active Directory, we recommend that you use Windows security with group Managed Service Accounts. Otherwise, use Windows security with Windows accounts.

For more information, read [Node-to-node security](service-fabric-cluster-security.md#node-to-node-security)

### Client-to-node security

Client-to-node security authenticates clients and helps secure communication between a client and individual nodes in the cluster. This type of security helps ensure that only authorized users can access the cluster and the applications that are deployed on the cluster. Clients are uniquely identified through either their X.509 certificate security credentials. Any number of optional client certificates can be used to authenticate admin or user clients with the cluster.

In addition to client certificates, Azure Active Directory can also be configured to authenticate clients with the cluster.

For more information, read [Client-to-node security](service-fabric-cluster-security.md#client-to-node-security)

### Service Fabric role-based access control
Service Fabric also supports access control to limit access to certain cluster operations for different groups of users. This helps make the cluster more secure. Two access control types are supported for clients that connect to a cluster: Administrator role and User role.  

For more information, read [Service Fabric role-based access control](service-fabric-cluster-security.md#service-fabric-role-based-access-control).

## Scaling

Application demands change over time. You may need to increase cluster resources to meet increased application workload or network traffic or decrease cluster resources when demand drops. After creating a Service Fabric cluster, you can scale the cluster horizontally (change the number of nodes) or vertically (change the resources of the nodes). You can scale the cluster at any time, even when workloads are running on the cluster. As the cluster scales, your applications automatically scale as well.

For more information, read [Scaling standalone clusters](service-fabric-cluster-scaling-standalone.md).

## Upgrading

A standalone cluster is a resource that you entirely own. You are responsible for patching the underlying OS and initiating fabric upgrades. You can set your cluster to receive automatic runtime upgrades, when Microsoft releases a new version, or choose to select a supported runtime version that you want. In addition to fabric upgrades, you can also patch the OS and update cluster configuration such as certificates or application ports. 

For more information, read [Upgrading standalone clusters](service-fabric-cluster-upgrade-standalone.md).

## Supported operating systems

You are able to create clusters on VMs or computers running these operating systems (Linux is not yet supported):

* Windows Server 2012 R2
* Windows Server 2016 
* Windows Server 2019

## Next steps

Read more about [securing](service-fabric-cluster-security.md), [scaling](service-fabric-cluster-scaling-standalone.md), and [upgrading](service-fabric-cluster-upgrade-standalone.md) standalone clusters.

Learn about [Service Fabric support options](service-fabric-support.md).

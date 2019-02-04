---
title: Standalone Service Fabric clusters overview | Microsoft Docs
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

# Overview of Service Fabric Standalone clusters

### Any cloud deployments vs. on-premises deployments
A Service Fabric cluster is a network-connected set of virtual or physical machines into which your microservices are deployed and managed. A machine or VM that is part of a cluster is called a cluster node. Clusters can scale to thousands of nodes. If you add new nodes to the cluster, Service Fabric rebalances the service partition replicas and instances across the increased number of nodes. Overall application performance improves and contention for access to memory decreases. If the nodes in the cluster are not being used efficiently, you can decrease the number of nodes in the cluster. Service Fabric again rebalances the partition replicas and instances across the decreased number of nodes to make better use of the hardware on each node.

The process for creating a Service Fabric cluster on-premises is similar to the process of creating a cluster on any cloud of your choice with a set of VMs. The initial steps to provision the VMs are governed by the cloud provider or on-premises environment that you are using. Once you have a set of VMs with network connectivity enabled between them, then the steps to set up the Service Fabric package, edit the cluster settings, and run the cluster creation and management scripts are identical. This ensures that your knowledge and experience of operating and managing Service Fabric clusters is transferable when you choose to target new hosting environments.

## Cluster security
### Node-to-node security
Node-to-node security secures communication between the VMs or computers in a cluster. This security scenario ensures that only computers that are authorized to join the cluster can participate in hosting applications and services in the cluster. Service Fabric uses X.509 certificates to secure a cluster and provide application security features.  A cluster certificate is required to secure cluster traffic and provide cluster and server authentication.  Self signed-certificates can be used for test clusters, but a certificate from a trusted certificate authority should be used to secure production clusters.

Windows security can also be enabled for a Windows standalone cluster. If you have Windows Server 2012 R2 and Windows Active Directory, we recommend that you use Windows security with group Managed Service Accounts. Otherwise, use Windows security with Windows accounts.

For more information, read [Node-to-node security](service-fabric-cluster-security.md#node-to-node-security)

### Client-to-node security
Client-to-node security authenticates clients and helps secure communication between a client and individual nodes in the cluster. This type of security helps ensure that only authorized users can access the cluster and the applications that are deployed on the cluster. Clients are uniquely identified through either their X.509 certificate security credentials. Any number of optional client certificates can be used to authenticate admin or user clients with the cluster.

In addition to client certificates, Azure Active Directory can also configured to authenticate clients with the cluster.

For more information, read [Client-to-node security](service-fabric-cluster-security.md#client-to-node-security)

### Role-Based Access Control (RBAC)
Service Fabric also supports access control to limit access to certain cluster operations for different groups of users. This helps make the cluster more secure. Two access control types are supported for clients that connect to a cluster: Administrator role and User role.  

For more information, read [Role-Based Access Control (RBAC)](service-fabric-cluster-security.md#role-based-access-control-rbac).

## Supported operating systems for standalone clusters
You are able to create clusters on VMs or computers running these operating systems (Linux is not yet supported):

* Windows Server 2012 R2
* Windows Server 2016 
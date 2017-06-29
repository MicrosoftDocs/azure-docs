---
title: Common questions about Microsoft Azure Service Fabric | Microsoft Docs
description: Frequently asked questions about Service Fabric and their answers
services: service-fabric
documentationcenter: .net
author: chackdan
manager: timlt
editor: ''

ms.assetid: 5a179703-ff0c-4b8e-98cd-377253295d12
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 06/20/2017
ms.author: chackdan
---


# Commonly asked Service Fabric questions

There are many commonly asked questions about what Service Fabric can do and how it should be used. This document covers many of those common questions and their answers.

## Cluster setup and management

### Can I create a cluster that spans multiple Azure regions?

Not today, but this is a common request that we continue to investigate.

The core Service Fabric clustering technology knows nothing about Azure regions and can be used to combine machines running anywhere in the world, so long as they have network connectivity to each other. However, the Service Fabric cluster resource in Azure is regional, as are the virtual machine scale sets that the cluster is built on. In addition, there is an inherent challenge in delivering strongly consistent data replication between machines spread far apart. We want to ensure that performance is predictable and acceptable before supporting cross-regional clusters.

### Do Service Fabric nodes automatically receive OS updates?

Not today, but this is also a common request that we intend to deliver.

The challenge with OS updates is that they typically require a reboot of the machine, which results in temporary availability loss. By itself, that is not a problem, since Service Fabric will automatically redirect traffic for those services to other nodes. However, if OS updates are not coordinated across the cluster, there is the potential that many nodes go down at once. Such simultaneous reboots can cause complete availability loss for a service, or at least for a specific partition (for a stateful service).

In the future, we will support an OS update policy that is fully automated and coordinated across update domains, ensuring that availability is maintained despite reboots and other unexpected failures.

In the interim, we have [provided a script](https://blogs.msdn.microsoft.com/azureservicefabric/2017/01/09/os-patching-for-vms-running-service-fabric/) that a cluster administrator can use to manually kick off patching of each node in a safe manner.

### Can I use Large Virtual Machine Scale Sets in my SF cluster? 

**Short answer** - No. 

**Long Answer** - Although the Large Virtual Machine Scale Sets allow you to scale a virtual machine scale set upto 1000 VM instances, it does so by the use of Placement Groups (PGs). Fault domains (FDs) and upgrade domains (UDs) are only consistent within a placement group Service fabric uses FDs and UDs to make placement decisions of your service replicas/Service instances. Since the FDs  and UDs are comparable only within a placement group SF cannot use it. For example, If VM1 in PG1 has a topology of FD=0 and VM9 in PG2 has a topology of FD=4 , it does not mean that VM1 and VM2 are on two different Hardware Racks, hence SF cannot use the FD values in this case to make placement decisions.

There are other issues with Large virtual machine scale sets currently, like the lack of level-4 Load balancing support. Refer to for [details on Large scale sets](../virtual-machine-scale-sets/virtual-machine-scale-sets-placement-groups.md)



### What is the minimum size of a Service Fabric cluster? Why can't it be smaller?

The minimum supported size for a Service Fabric cluster running production workloads is five nodes. For dev/test scenarios, we support three node clusters.

These minimums exist because the Service Fabric cluster runs a set of stateful system services, including the naming service and the failover manager. These services, which track what services have been deployed to the cluster and where they're currently hosted, depend on strong consistency. That strong consistency, in turn, depends on the ability to acquire a *quorum* for any given update to the state of those services, where a quorum represents a strict majority of the replicas (N/2 +1) for a given service.

With that background, let's examine some possible cluster configurations:

**One node**: this option does not provide high availability since the loss of the single node for any reason means the loss of the entire cluster.

**Two nodes**: a quorum for a service deployed across two nodes (N = 2) is 2 (2/2 + 1 = 2). When a single replica is lost, it is impossible to create a quorum. Since performing a service upgrade requires temporarily taking down a replica, this is not a useful configuration.

**Three nodes**: with three nodes (N=3), the requirement to create a quorum is still two nodes (3/2 + 1 = 2). This means that you can lose an individual node and still maintain quorum.

The three node cluster configuration is supported for dev/test because you can safely perform upgrades and survive individual node failures, as long as they don't happen simultaneously. For production workloads, you must be resilient to such a simultaneous failure, so five nodes are required.

### Can I turn off my cluster at night/weekends to save costs?

In general, no. Service Fabric stores state on local, ephemeral disks, meaning that if the virtual machine is moved to a different host, the data does not move with it. In normal operation, that is not a problem as the new node is brought up to date by other nodes. However, if you stop all nodes and restart them later, there is a significant possibility that most of the nodes start on new hosts and make the system unable to recover.

If you would like to create clusters for testing your application before it is deployed, we recommend that you dynamically create those clusters as part of your [continuous integration/continuous deployment pipeline](service-fabric-set-up-continuous-integration.md).


### How do I upgrade my Operating System (for example from Windows Server 2012 to Windows Server 2016)?

While we're working on an improved experience, today, you are responsible for the upgrade. You must upgrade the OS image on the virtual machines of the cluster one VM at a time. 

## Container Support

### Why are my containers that are deployed to SF unable to resolve DNS addresses?

This issue has been reported on clusters that are on 5.6.204.9494 version 

**Mitigation** :  Follow [this document](service-fabric-dnsservice.md) to enable the DNS service fabric service in your cluster.

**Fix** :  Upgrade to the a supported cluster version that is higher than 5.6.204.9494, when it is available. If your cluster is set to automatic upgrades, then the cluster will automatically upgrade to the version that has this issue fixed.

  
## Application Design

### What's the best way to query data across partitions of a Reliable Collection?

Reliable collections are typically [partitioned](service-fabric-concepts-partitioning.md) to enable scale out for greater performance and throughput. That means that the state for a given service may be spread across 10s or 100s of machines. To perform operations over that full data set, you have a few options:

- Create a service that queries all partitions of another service to pull in the required data.
- Create a service that can receive data from all partitions of another service.
- Periodically push data from each service to an external store. This approach is only appropriate if the queries you're performing are not part of your core business logic.


### What's the best way to query data across my actors?

Actors are designed to be independent units of state and compute, so it is not recommended to perform broad queries of actor state at runtime. If you have a need to query across the full set of actor state, you should consider either:

- Replacing your actor services with stateful reliable services, such that the number of network requests to gather all data from the number of actors to the number of partitions in your service.
- Designing your actors to periodically push their state to an external store for easier querying. As above, this approach is only viable if the queries you're performing are not required for your runtime behavior.

### How much data can I store in a Reliable Collection?

Reliable services are typically partitioned, so the amount you can store is only limited by the number of machines you have in the cluster, and the amount of memory available on those machines.

As an example, suppose that you have a reliable collection in a service with 100 partitions and 3 replicas, storing objects that average 1kb in size. Now suppose that you have a 10 machine cluster with 16gb of memory per machine. For simplicity and to be very conservative, assume that the operating system and system services, the Service Fabric runtime, and your services consume 6gb of that, leaving 10gb available per machine, or 100gb for the cluster.

Keeping in mind that each object must be stored three times (one primary and two replicas), you would have sufficient memory for approximately 35 million objects in your collection when operating at full capacity. However, we recommend being resilient to the simultaneous loss of a failure domain and an upgrade domain, which represents about 1/3 of capacity, and would reduce the number to roughly 23 million.

Note that this calculation also assumes:

- That the distribution of data across the partitions is roughly uniform or that you're reporting load metrics to the cluster Resource Manager. By default, Service Fabric will load balance based on replica count. In our example above, that would put 10 primary replicas and 20 secondary replicas on each node in the cluster. That works well for load that is evenly distributed across the partitions. If load is not even, you must report load so that the Resource Manager can pack smaller replicas together and allow larger replicas to consume more memory on an individual node.

- That the reliable service in question is the only one storing state in the cluster. Since you can deploy multiple services to a cluster, you need to be mindful of the resources that each will need to run and manage its state.

- That the cluster itself is not growing or shrinking. If you add more machines, Service Fabric will rebalance your replicas to leverage the additional capacity until the number of machines surpasses the number of partitions in your service, since an individual replica cannot span machines. By contrast, if you reduce the size of the cluster by removing machines, your replicas will be packed more tightly and have less overall capacity.

### How much data can I store in an actor?

As with reliable services, the amount of data that you can store in an actor service is only limited by the total disk space and memory available across the nodes in your cluster. However, individual actors are most effective when they are used to encapsulate a small amount of state and associated business logic. As a general rule, an individual actor should have state that is measured in kilobytes.

## Other questions

### How does Service Fabric relate to containers?

Containers offer a simple way to package services and their dependencies such that they run consistently in all environments and can operate in an isolated fashion on a single machine. Service Fabric offers a way to deploy and manage services, including [services that have been packaged in a container](service-fabric-containers-overview.md).

### Are you planning to open source Service Fabric?

We intend to open source the reliable services and reliable actors frameworks on GitHub and will accept community contributions to those projects. Please follow the [Service Fabric blog](https://blogs.msdn.microsoft.com/azureservicefabric/) for more details as they're announced.

The are currently no plans to open source the Service Fabric runtime.

## Next steps

- [Learn about core Service Fabric concepts and best practices](https://mva.microsoft.com/en-us/training-courses/building-microservices-applications-on-azure-service-fabric-16747?l=tbuZM46yC_5206218965)

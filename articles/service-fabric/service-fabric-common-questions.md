---
title: Common questions about Microsoft Azure Service Fabric 
description: Frequently asked questions about Service Fabric, including capabilities, use cases, and common scenarios.

ms.topic: troubleshooting
ms.date: 08/18/2017
ms.author: pepogors
---


# Commonly asked Service Fabric questions

There are many commonly asked questions about what Service Fabric can do and how it should be used. This document covers many of those common questions and their answers.


[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Cluster setup and management

### How do I roll back my Service Fabric cluster certificate?

Rolling back any upgrade to your application requires health failure detection prior to your Service Fabric cluster quorum committing the change; committed changes can only be rolled forward. Escalation engineer’s through Customer Support Services, may be required to recover your cluster, if an unmonitored breaking certificate change has been introduced.  [Service Fabric’s application upgrade](https://docs.microsoft.com/azure/service-fabric/service-fabric-application-upgrade?branch=master) applies [Application upgrade parameters](https://docs.microsoft.com/azure/service-fabric/service-fabric-application-upgrade-parameters?branch=master), and delivers zero downtime upgrade promise.  Following our recommended application upgrade monitored mode, automatic progress through update domains is based upon health checks passing, rolling back automatically if updating a default service fails.
 
If your cluster is still leveraging the classic Certificate Thumbprint property in your Resource Manager template, it's recommended you [Change cluster from certificate thumbprint to common name](https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-change-cert-thumbprint-to-cn), to leverage modern secrets management features.

### Can I create a cluster that spans multiple Azure regions or my own datacenters?

Yes. 

The core Service Fabric clustering technology can be used to combine machines running anywhere in the world, so long as they have network connectivity to each other. However, building and running such a cluster can be complicated.

If you are interested in this scenario, we encourage you to get in contact either through the [Service Fabric GitHub Issues List](https://github.com/azure/service-fabric-issues) or through your support representative in order to obtain additional guidance. The Service Fabric team is working to provide additional clarity, guidance, and recommendations for this scenario. 

Some things to consider: 

1. The Service Fabric cluster resource in Azure is regional today, as are the virtual machine scale sets that the cluster is built on. This means that in the event of a regional failure you may lose the ability to manage the cluster via the Azure Resource Manager or the Azure portal. This can happen even though the cluster remains running and you'd be able to interact with it directly. In addition, Azure today does not offer the ability to have a single virtual network that is usable across regions. This means that a multi-region cluster in Azure requires either [Public IP Addresses for each VM in the VM Scale Sets](../virtual-machine-scale-sets/virtual-machine-scale-sets-networking.md#public-ipv4-per-virtual-machine) or [Azure VPN Gateways](../vpn-gateway/vpn-gateway-about-vpngateways.md). These networking choices have different impacts on costs, performance, and to some degree application design, so careful analysis and planning is required before standing up such an environment.
2. The maintenance, management, and monitoring of these machines can become complicated, especially when spanned across _types_ of environments, such as between different cloud providers or between on-premises resources and Azure. Care must be taken to ensure that upgrades, monitoring, management, and diagnostics are understood for both the cluster and the applications before running production workloads in such an environment. If you already have experience solving these problems in Azure or within your own datacenters, then it is likely that those same solutions can be applied when building out or running your Service Fabric cluster. 

### Do Service Fabric nodes automatically receive OS updates?

You can use [Virtual Machine Scale Set Automatic OS Image Update](https://docs.microsoft.com/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-automatic-upgrade) Generally Available feature today.

For clusters that are NOT run in Azure, we have [provided an application](service-fabric-patch-orchestration-application.md) to patch the operating systems underneath your Service Fabric nodes.

### Can I use large virtual machine scale sets in my SF cluster? 

**Short answer** - No. 

**Long Answer** - Although the large virtual machine scale sets allow you to scale a virtual machine scale set up to 1000 VM instances, it does so by the use of Placement Groups (PGs). Fault domains (FDs) and upgrade domains (UDs) are only consistent within a placement group Service fabric uses FDs and UDs to make placement decisions of your service replicas/Service instances. Since the FDs and UDs are comparable only within a placement group, SF cannot use it. For example, If VM1 in PG1 has a topology of FD=0 and VM9 in PG2 has a topology of FD=4, it does not mean that VM1 and VM2 are on two different Hardware Racks, hence SF cannot use the FD values in this case to make placement decisions.

There are other issues with large virtual machine scale sets currently, like the lack of level-4 Load balancing support. Refer to for [details on Large scale sets](../virtual-machine-scale-sets/virtual-machine-scale-sets-placement-groups.md)



### What is the minimum size of a Service Fabric cluster? Why can't it be smaller?

The minimum supported size for a Service Fabric cluster running production workloads is five nodes. For dev scenarios, we support one node (optimized for quick development experience in Visual Studio) and five node clusters.

We require a production cluster to have at least 5 nodes because of the following three reasons:
1. Even when no user services are running, a Service Fabric cluster runs a set of stateful system services, including the naming service and the failover manager service. These system services are essential for the cluster to remain operational.
2. We always place one replica of a service per node, so cluster size is the upper limit for the number of replicas a service (actually a partition) can have.
3. Since a cluster upgrade will bring down at least one node, we want to have a buffer of at least one node, therefore, we want a production cluster to have at least two nodes *in addition* to the bare minimum. The bare minimum is the quorum size of a system service as explained below.  

We want the cluster to be available in the face of simultaneous failure of two nodes. For a Service Fabric cluster to be available, the system services must be available. Stateful system services like naming service and failover manager service, that track what services have been deployed to the cluster and where they're currently hosted, depend on strong consistency. That strong consistency, in turn, depends on the ability to acquire a *quorum* for any given update to the state of those services, where a quorum represents a strict majority of the replicas (N/2 +1) for a given service. Thus if we want to be resilient against simultaneous loss of two nodes (thus simultaneous loss of two replicas of a system service), we must have ClusterSize - QuorumSize >= 2, which forces the minimum size to be five. To see that, consider the cluster has N nodes and there are N replicas of a system service -- one on each node. The quorum size for a system service is (N/2 + 1). The above inequality looks like N - (N/2 + 1) >= 2. There are two cases to consider: when N is even and when N is odd. If N is even, say N = 2\*m where m >= 1, the inequality looks like 2\*m - (2\*m/2 + 1) >= 2 or m >= 3. The minimum for N is 6 and that is achieved when m = 3. On the other hand, if N is odd, say N = 2\*m+1 where m >= 1, the inequality looks like 2\*m+1 - ( (2\*m+1)/2 + 1 ) >= 2 or 2\*m+1 - (m+1) >= 2 or m >= 2. The minimum for N is 5 and that is achieved when m = 2. Therefore, among all values of N that satisfy the inequality ClusterSize - QuorumSize >= 2, the minimum is 5.

Note, in the above argument we have assumed that every node has a replica of a system service, thus the quorum size is computed based on the number of nodes in the cluster. However, by changing *TargetReplicaSetSize* we could make the quorum size less than (N/2+1) which might give the impression that we could have a cluster smaller than 5 nodes and still have 2 extra nodes above the quorum size. For example, in a 4 node cluster, if we set the TargetReplicaSetSize to 3, the quorum size based on TargetReplicaSetSize is (3/2 + 1) or 2, thus we have ClusterSize - QuorumSize = 4-2 >= 2. However, we cannot guarantee that the system service will be at or above quorum if we lose any pair of nodes simultaneously, it could be that the two nodes we lost were hosting two replicas, so the system service will go into quorum loss (having only a single replica left) and will become unavailable.

With that background, let's examine some possible cluster configurations:

**One node**: this option does not provide high availability since the loss of the single node for any reason means the loss of the entire cluster.

**Two nodes**: a quorum for a service deployed across two nodes (N = 2) is 2 (2/2 + 1 = 2). When a single replica is lost, it is impossible to create a quorum. Since performing a service upgrade requires temporarily taking down a replica, this is not a useful configuration.

**Three nodes**: with three nodes (N=3), the requirement to create a quorum is still two nodes (3/2 + 1 = 2). This means that you can lose an individual node and still maintain quorum, but simultaneous failure of two nodes will drive the system services into quorum loss and will cause the cluster to become unavailable.

**Four nodes**: with four nodes (N=4), the requirement to create a quorum is three nodes (4/2 + 1 = 3). This means that you can lose an individual node and still maintain quorum, but simultaneous failure of two nodes will drive the system services into quorum loss and will cause the cluster to become unavailable.

**Five nodes**: with five nodes (N=5), the requirement to create a quorum is still three nodes (5/2 + 1 = 3). This means that you can lose two nodes at the same time and still maintain quorum for the system services.

For production workloads, you must be resilient to simultaneous failure of at least two nodes (for example, one due to cluster upgrade, one due to other reasons), so five nodes are required.

### Can I turn off my cluster at night/weekends to save costs?

In general, no. Service Fabric stores state on local, ephemeral disks, meaning that if the virtual machine is moved to a different host, the data does not move with it. In normal operation, that is not a problem as the new node is brought up-to-date by other nodes. However, if you stop all nodes and restart them later, there is a significant possibility that most of the nodes start on new hosts and make the system unable to recover.

If you would like to create clusters for testing your application before it is deployed, we recommend that you dynamically create those clusters as part of your [continuous integration/continuous deployment pipeline](service-fabric-tutorial-deploy-app-with-cicd-vsts.md).


### How do I upgrade my Operating System (for example from Windows Server 2012 to Windows Server 2016)?

While we're working on an improved experience, today, you are responsible for the upgrade. You must upgrade the OS image on the virtual machines of the cluster one VM at a time. 

### Can I encrypt attached data disks in a cluster node type (virtual machine scale set)?
Yes.  For more information, see [Create a cluster with attached data disks](../virtual-machine-scale-sets/virtual-machine-scale-sets-attached-disks.md#create-a-service-fabric-cluster-with-attached-data-disks) and [Azure Disk Encryption for Virtual Machine Scale Sets](../virtual-machine-scale-sets/disk-encryption-overview.md).

### Can I use low-priority VMs in a cluster node type (virtual machine scale set)?
No. Low-priority VMs are not supported. 

### What are the directories and processes that I need to exclude when running an anti-virus program in my cluster?

| **Antivirus Excluded directories** |
| --- |
| Program Files\Microsoft Service Fabric |
| FabricDataRoot (from cluster configuration) |
| FabricLogRoot (from cluster configuration) |

| **Antivirus Excluded processes** |
| --- |
| Fabric.exe |
| FabricHost.exe |
| FabricInstallerService.exe |
| FabricSetup.exe |
| FabricDeployer.exe |
| ImageBuilder.exe |
| FabricGateway.exe |
| FabricDCA.exe |
| FabricFAS.exe |
| FabricUOS.exe |
| FabricRM.exe |
| FileStoreService.exe |
 
### How can my application authenticate to KeyVault to get secrets?
The following are means for your application to obtain credentials for authenticating to KeyVault:

A. During your applications build/packing job, you can pull a certificate into your SF app's data package, and use this to authenticate to KeyVault.
B. For virtual machine scale set MSI enabled hosts, you can develop a simple PowerShell SetupEntryPoint for your SF app to get [an access token from the MSI endpoint](https://docs.microsoft.com/azure/active-directory/managed-service-identity/how-to-use-vm-token), and then [retrieve your secrets from KeyVault](/powershell/module/azurerm.keyvault/get-azurekeyvaultsecret).

## Application Design

### What's the best way to query data across partitions of a Reliable Collection?

Reliable collections are typically [partitioned](service-fabric-concepts-partitioning.md) to enable scale out for greater performance and throughput. That means that the state for a given service may be spread across tens or hundreds of machines. To perform operations over that full data set, you have a few options:

- Create a service that queries all partitions of another service to pull in the required data.
- Create a service that can receive data from all partitions of another service.
- Periodically push data from each service to an external store. This approach is only appropriate if the queries you're performing are not part of your core business logic, as the external store's data will be stale.
- Alternatively, store data that must support querying across all records directly in a data store rather than in a reliable collection. This eliminates the issue with stale data, but doesn't allow the advantages of reliable collections to be leveraged.


### What's the best way to query data across my actors?

Actors are designed to be independent units of state and compute, so it is not recommended to perform broad queries of actor state at runtime. If you have a need to query across the full set of actor state, you should consider either:

- Replacing your actor services with stateful reliable services, so that the number of network requests to gather all data from the number of actors to the number of partitions in your service.
- Designing your actors to periodically push their state to an external store for easier querying. As above, this approach is only viable if the queries you're performing are not required for your runtime behavior.

### How much data can I store in a Reliable Collection?

Reliable services are typically partitioned, so the amount you can store is only limited by the number of machines you have in the cluster, and the amount of memory available on those machines.

As an example, suppose that you have a reliable collection in a service with 100 partitions and 3 replicas, storing objects that average 1 kb in size. Now suppose that you have a 10 machine cluster with 16gb of memory per machine. For simplicity and to be conservative, assume that the operating system and system services, the Service Fabric runtime, and your services consume 6gb of that, leaving 10gb available per machine, or 100 gb for the cluster.

Keeping in mind that each object must be stored three times (one primary and two replicas), you would have sufficient memory for approximately 35 million objects in your collection when operating at full capacity. However, we recommend being resilient to the simultaneous loss of a failure domain and an upgrade domain, which represents about 1/3 of capacity, and would reduce the number to roughly 23 million.

Note that this calculation also assumes:

- That the distribution of data across the partitions is roughly uniform or that you're reporting load metrics to the Cluster Resource Manager. By default, Service Fabric loads balance based on replica count. In the preceding example, that would put 10 primary replicas and 20 secondary replicas on each node in the cluster. That works well for load that is evenly distributed across the partitions. If load is not even, you must report load so that the Resource Manager can pack smaller replicas together and allow larger replicas to consume more memory on an individual node.

- That the reliable service in question is the only one storing state in the cluster. Since you can deploy multiple services to a cluster, you need to be mindful of the resources that each needs to run and manage its state.

- That the cluster itself is not growing or shrinking. If you add more machines, Service Fabric will rebalance your replicas to leverage the additional capacity until the number of machines surpasses the number of partitions in your service, since an individual replica cannot span machines. By contrast, if you reduce the size of the cluster by removing machines, your replicas are packed more tightly and have less overall capacity.

### How much data can I store in an actor?

As with reliable services, the amount of data that you can store in an actor service is only limited by the total disk space and memory available across the nodes in your cluster. However, individual actors are most effective when they are used to encapsulate a small amount of state and associated business logic. As a general rule, an individual actor should have state that is measured in kilobytes.

## Other questions

### How does Service Fabric relate to containers?

Containers offer a simple way to package services and their dependencies such that they run consistently in all environments and can operate in an isolated fashion on a single machine. Service Fabric offers a way to deploy and manage services, including [services that have been packaged in a container](service-fabric-containers-overview.md).

### Are you planning to open-source Service Fabric?

We have open-sourced parts of Service Fabric ([reliable services framework](https://github.com/Azure/service-fabric-services-and-actors-dotnet), [reliable actors framework](https://github.com/Azure/service-fabric-services-and-actors-dotnet), [ASP.NET Core integration libraries](https://github.com/Azure/service-fabric-aspnetcore), [Service Fabric Explorer](https://github.com/Azure/service-fabric-explorer), and [Service Fabric CLI](https://github.com/Azure/service-fabric-cli)) on GitHub and accept community contributions to those projects. 

We [recently announced](https://blogs.msdn.microsoft.com/azureservicefabric/2018/03/14/service-fabric-is-going-open-source/) that we plan to open-source the Service Fabric runtime. At this point we have the [Service Fabric repo](https://github.com/Microsoft/service-fabric/) up on GitHub with Linux build and test tools, which means you can clone the repo, build Service Fabric for Linux, run basic tests, open issues, and submit pull requests. We’re working hard to get the Windows build environment migrated over as well, along with a complete CI environment.

Follow the [Service Fabric blog](https://blogs.msdn.microsoft.com/azureservicefabric/) for more details as they're announced.

## Next steps

Learn about [core Service Fabric concepts](service-fabric-technical-overview.md) and [best practices](service-fabric-best-practices-overview.md)

---
title: Azure Service Fabric disaster recovery | Microsoft Docs
description: Azure Service Fabric offers the capabilities necessary to deal with all types of disasters. This article describes the types of disasters that can occur and how to deal with them.
services: service-fabric
documentationcenter: .net
author: masnider
manager: chackdan
editor: ''

ms.assetid: ab49c4b9-74a8-4907-b75b-8d2ee84c6d90
ms.service: service-fabric
ms.devlang: dotNet
ms.topic: conceptual
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 08/18/2017
ms.author: masnider

---
# Disaster recovery in Azure Service Fabric
A critical part of delivering high-availability is ensuring that services can survive all different types of failures. This is especially important for failures that are unplanned and outside of your control. This article describes some common failure modes that could be disasters if not modeled and managed correctly. It also discuss mitigations and actions to take if a disaster happened anyway. The goal is to limit or eliminate the risk of downtime or data loss when they occur failures, planned or otherwise, occur.

## Avoiding disaster
Service Fabric's primary goal is to help you model both your environment and your services in such a way that common failure types are not disasters. 

In general there are two types of disaster/failure scenarios:

1. Hardware or software faults
2. Operational faults

### Hardware and software faults
Hardware and software faults are unpredictable. The easiest way to survive faults is running more copies of the service  spanned across hardware or software fault boundaries. For example, if your service is running only on one particular machine, then the failure of that one machine is a disaster for that service. The simple way to avoid this disaster is to ensure that the service is actually running on multiple machines. Testing is also necessary to ensure the failure of one machine doesn't disrupt the running service. Capacity planning ensures a replacement instance can be created elsewhere and that reduction in capacity doesn't overload the remaining services. The same pattern works regardless of what you're trying to avoid the failure of. For example. if you're concerned about the failure of a SAN, you run across multiple SANs. If you're concerned about the loss of a rack of servers, you run across multiple racks. If you're worried about the loss of datacenters, your service should run across multiple Azure regions or datacenters. 

When running in this type of spanned mode, you're still subject to some types of simultaneous failures, but single and even multiple failures of a particular type (ex: a single VM or network link failing) are automatically handled (and so no longer a "disaster"). Service Fabric provides many mechanisms for expanding the cluster and handles bringing failed nodes and services back. Service Fabric also allows running many instances of your services in order to avoid these types of unplanned failures from turning into real disasters.

There may be reasons why running a deployment large enough to span over failures is not feasible. For example, it may take more hardware resources than you're willing to pay for relative to the chance of failure. When dealing with distributed applications, it could be that additional communication hops or state replication costs across geographic distances causes unacceptable latency. Where this line is drawn differs for each application. For software faults specifically, the fault could be in the service that you are trying to scale. In this case more copies don't prevent the disaster, since the failure condition is correlated across all the instances.

### Operational faults
Even if your service is spanned across the globe with many redundancies, it can still experience disastrous events. For example, if someone accidentally reconfigures the dns name for the service, or deletes it outright. As an example, let's say you had a stateful Service Fabric service, and someone deleted that service accidentally. Unless there's some other mitigation, that service and all of the state it had is now gone. These types of operational disasters ("oops") require different mitigations and steps for recovery than regular unplanned failures. 

The best ways to avoid these types of operational faults are to
1. restrict operational access to the environment
2. strictly audit dangerous operations
3. impose automation, prevent manual or out of band changes, and validate specific changes against the actual environment before enacting them
4. ensure that destructive operations are "soft". Soft operations don't take effect immediately or can be undone within some time window

Service Fabric provides some mechanisms to prevent operational faults, such as providing [role-based](service-fabric-cluster-security-roles.md) access control for cluster operations. However, most of these operational faults require organizational efforts and other systems. Service Fabric does provide some mechanism for surviving operational faults, most notably backup and restore for stateful services.

## Managing failures
The goal of Service Fabric is almost always automatic management of failures. However, in order to handle some types of failures, services must have additional code. Other types of failures should _not_ be automatically addressed because of safety and business continuity reasons. 

### Handling single failures
Single machines can fail for all sorts of reasons. Some of these are hardware causes, like power supplies and networking hardware failures. Other failures are in software. These include failures of the actual operating system and the service itself. Service Fabric automatically detects these types of failures, including cases where the machine becomes isolated from other machines due to network issues.

Regardless of the type of service, running a single instance results in downtime for that service if that single copy of the code fails for any reason. 

In order to handle any single failure, the simplest thing you can do is to ensure that your services run on more than one node by default. For stateless services, this can be accomplished by having an `InstanceCount` greater than 1. For stateful services, the minimum recommendation is always a `TargetReplicaSetSize` and `MinReplicaSetSize` of at least 3. Running more copies of your service code ensures that your service can handle any single failure automatically. 

### Handling coordinated failures
Coordinated failures can happen in a cluster due to either planned or unplanned infrastructure failures and changes, or planned software changes. Service Fabric models infrastructure zones that experience coordinated failures as Fault Domains. Areas that will experience coordinated software changes are modeled as Upgrade Domains. More information about fault and upgrade domains is in [this document](service-fabric-cluster-resource-manager-cluster-description.md) that describes cluster topology and definition.

By default Service Fabric considers fault and upgrade domains when planning where your services should run. By default, Service Fabric tries to ensure that your services run across several fault and upgrade domains so if planned or unplanned changes happen your services remain available. 

For example, let's say that failure of a power source causes a rack of machines to fail simultaneously. With multiple copies of the service running the loss of many machines in fault domain failure turns into just another example of single failure for a given service. This is why managing fault domains is critical to ensuring high availability of your services. When running Service Fabric in Azure, fault domains are managed automatically. In other environments, they may not be. If you're building your own clusters on premises, be sure to map and plan your fault domain layout correctly.

Upgrade Domains are useful for modeling areas where software is going to be upgraded at the same time. Because of this, Upgrade Domains also often define the boundaries where software is taken down during planned upgrades. Upgrades of both Service Fabric and your services follow the same model. For more on rolling upgrades, upgrade domains, and the Service Fabric health model that helps prevent unintended changes from impacting the cluster and your service, see these documents:

 - [Application Upgrade](service-fabric-application-upgrade.md)
 - [Application Upgrade Tutorial](service-fabric-application-upgrade-tutorial.md)
 - [Service Fabric Health Model](service-fabric-health-introduction.md)

You can visualize the layout of your cluster using the cluster map provided in [Service Fabric Explorer](service-fabric-visualizing-your-cluster.md):

<center>

![Nodes spread across fault domains in Service Fabric Explorer][sfx-cluster-map]
</center>

> [!NOTE]
> Modeling areas of failure, rolling upgrades, running many instances of your service code and state, placement rules to ensure your services run across fault and upgrade domains, and built-in health monitoring are just **some** of the features that Service Fabric provides in order to keep normal operational issues and failures from turning into disasters. 
>

### Handling simultaneous hardware or software failures
Above we talked about single failures. As you can see, are easy to handle for both stateless and stateful services just by keeping more copies of the code (and state) running across fault and upgrade domains. Multiple simultaneous random failures can also happen. These are more likely to lead to an actual disaster.


### Random failures leading to service failures
Let's say that the service had an `InstanceCount` of 5, and several nodes running those instances all failed at the same time. Service Fabric responds by automatically creating replacement instances on other nodes. It will continue creating replacements until the service is back to its desired instance count. As another example, let's say there was a stateless service with an `InstanceCount`of -1, meaning it runs on all valid nodes in the cluster. Let's say that some of those instances were to fail. In this case, Service Fabric notices that the service is not in its desired state, and tries to create the instances on the nodes where they are missing. 

For stateful services the situation depends on whether the service has persisted state or not. It also depends on how many replicas the service had and how many failed. Determining whether a disaster occurred for a stateful service and managing it follows three stages:

1. Determining if there has been quorum loss or not
   - A quorum loss is any time a majority of the replicas of a stateful service are down at the same time, including the Primary.
2. Determining if the quorum loss is permanent or not
   - Most of the time, failures are transient. Processes are restarted, nodes are restarted, VMs are relaunched, network partitions heal. Sometimes though, failures are permanent. 
     - For services without persisted state, a failure of a quorum or more of replicas results _immediately_ in permanent quorum loss. When Service Fabric detects quorum loss in a stateful non-persistent service, it immediately proceeds to step 3 by declaring (potential) data loss. Proceeding to data loss makes sense because Service Fabric knows that there's no point in waiting for the replicas to come back, because even if they were recovered they would be empty.
     - For stateful persistent services, a failure of a quorum or more of replicas causes Service Fabric to start waiting for the replicas to come back and restore quorum. This results in a service outage for any _writes_ to the affected partition (or "replica set") of the service. However, reads may still be possible with reduced consistency guarantees. The default amount of time that Service Fabric waits for quorum to be restored is infinite, since proceeding is a (potential) data loss event and carries other risks. Overriding the default `QuorumLossWaitDuration` value is possible but is not recommended. Instead at this time, all efforts should be made to restore the down replicas. This requires bringing the nodes that are down back up, and ensuring that they can remount the drives where they stored the local persistent state. If the quorum loss is caused by process failure, Service Fabric automatically tries to recreate the processes and restart the replicas inside them. If this fails, Service Fabric reports health errors. If these can be resolved then the replicas usually come back. Sometimes, though, the replicas can't be brought back. For example, the drives may all have failed, or the machines physically destroyed somehow. In these cases, we now have a permanent quorum loss event. To tell Service Fabric to stop waiting for the down replicas to come back, a cluster administrator must determine which partitions of which services are affected and call the `Repair-ServiceFabricPartition -PartitionId` or `System.Fabric.FabricClient.ClusterManagementClient.RecoverPartitionAsync(Guid partitionId)` API.  This API allows specifying the ID of the partition to move out of QuorumLoss and into potential dataloss.

   > [!NOTE]
   > It is _never_ safe to use this API other than in a targeted way against specific partitions. 
   >

3. Determining if there has been actual data loss, and restoring from backups
   - When Service Fabric calls the `OnDataLossAsync` method, it is always because of _suspected_ data loss. Service Fabric ensures that this call is delivered to the _best_ remaining replica. This is whichever replica has made the most progress. The reason we always say _suspected_ data loss is that it is possible that the remaining replica actually has all same state as the Primary did when it went down. However, without that state to compare it to, there's no good way for Service Fabric or operators to know for sure. At this point, Service Fabric also knows the other replicas are not coming back. That was the decision made when we stopped waiting for the quorum loss to resolve itself. The best course of action for the service is usually to freeze and wait for specific administrative intervention. So what does a typical implementation of the `OnDataLossAsync` method do?
   - First, log that `OnDataLossAsync` has been triggered, and fire off any necessary administrative alerts.
   - Usually at this point, to pause and wait for further decisions and manual actions to be taken. This is because even if backups are available they may need to be prepared. For example, if two different services coordinate information, those backups may need to be modified in order to ensure that once the restore happens that the information those two services care about is consistent. 
   - Often there is also some other telemetry or exhaust from the service. This metadata may be contained in other services or in logs. This information can be used needed to determine if there were any calls received and processed at the primary that were not present in the backup or replicated to this particular replica. These may need to be replayed or added to the backup before restoration is feasible.  
   - Comparisons of the remaining replica's state to that contained in any backups that are available. If using the Service Fabric reliable collections then there are tools and processes available for doing so, described in [this article](service-fabric-reliable-services-backup-restore.md). The goal is to see if the state within the replica is sufficient, or also what the backup may be missing.
   - Once the comparison is done, and if necessary the restore completed, the service code should return true if any state changes were made. If the replica determined that it was the best available copy of the state and made no changes, then return false. True indicates that any _other_ remaining replicas may now be inconsistent with this one. They will be dropped and rebuilt from this replica. False indicates that no state changes were made, so the other replicas can keep what they have. 

It is critically important that service authors practice potential data loss and failure scenarios before services are ever deployed in production. To protect against the possibility of data loss, it is important to periodically [back up the state](service-fabric-reliable-services-backup-restore.md) of any of your stateful services to a geo-redundant store. You must also ensure that you have the ability to restore it. Since backups of many different services are taken at different times, you need to ensure that after a restore your services have a consistent view of each other. For example, consider a situation where one service generates a number and stores it, then sends it to another service that also stores it. After a restore, you might discover that the second service has the number but the first does not, because it's backup didn't include that operation.

If you find out that the remaining replicas are insufficient to continue from in a data loss scenario, and you can't reconstruct service state from telemetry or exhaust, the frequency of your backups determines your best possible recovery point objective (RPO). Service Fabric provides many tools for testing various failure scenarios, including permanent quorum and data loss requiring restoration from a backup. These scenarios are included as a part of Service Fabric's testability tools, managed by the Fault Analysis Service. More info on those tools and patterns is available [here](service-fabric-testability-overview.md). 

> [!NOTE]
> System services can also suffer quorum loss, with the impact being specific to the service in question. For instance, quorum loss in the naming service impacts name resolution, whereas quorum loss in the failover manager service blocks new service creation and failovers. While the Service Fabric system services follow the same pattern as your services for state management, it is not recommended that you should attempt to move them out of Quorum Loss and into potential data loss. The recommendation is instead to [seek support](service-fabric-support.md) to determine a solution that is targeted to your specific situation.  Usually it is preferable to simply wait until the down replicas return.
>

## Availability of the Service Fabric cluster
Generally speaking, the Service Fabric cluster itself is a highly distributed environment with no single points of failure. A failure of any one node will not cause availability or reliability issues for the cluster, primarily because the Service Fabric system services follow the same guidelines provided earlier: they always run with three or more replicas by default, and those system services that are stateless run on all nodes. The underlying Service Fabric networking and failure detection layers are fully distributed. Most system services can be rebuilt from metadata in the cluster, or know how to resynchronize their state from other places. The availability of the cluster can become compromised if system services get into quorum loss situations like those described above. In these cases you may not be able to perform certain operations on the cluster like starting an upgrade or deploying new services, but the cluster itself is still up. Services on already running will remain running in these conditions unless they require writes to the system services to continue functioning. For example, if the Failover Manager is in quorum loss all services will continue to run, but any services that fail will not be able to automatically restart, since this requires the involvement of the Failover Manager. 

### Failures of a datacenter or Azure region
In rare cases, a physical data center can become temporarily unavailable due to loss of power or network connectivity. In these cases, your Service Fabric clusters and services in that datacenter or Azure region will be unavailable. However, _your data is preserved_. For clusters running in Azure, you can view updates on outages on the [Azure status page][azure-status-dashboard]. In the highly unlikely event that a physical data center is partially or fully destroyed, any Service Fabric clusters hosted there or the services inside them could be lost. This includes any state not backed up outside of that datacenter or region.

There's two different strategies for surviving the permanent or sustained failure of a single datacenter or region. 

1. Run separate Service Fabric clusters in multiple such regions, and utilize some mechanism for failover and fail-back between these environments. This sort of multi-cluster active-active or active-passive model requires additional management and operations code. This also requires coordination of backups from the services in one datacenter or region so that they are available in other datacenters or regions when one fails. 
2. Run a single Service Fabric cluster that spans multiple datacenters or regions. The minimum supported configuration for this is three datacenters or regions. The recommended number of regions or datacenters is five. This requires a more complex cluster topology. However, the benefit of this model is that failure of one datacenter or region is converted from a disaster into a normal failure. These failures can be handled by the mechanisms that work for clusters within a single region. Fault domains, upgrade domains, and Service Fabric's placement rules ensure workloads are distributed so that they tolerate normal failures. For more information on policies that can help operate services in this type of cluster, read up on [placement policies](service-fabric-cluster-resource-manager-advanced-placement-rules-placement-policies.md)

### Random failures leading to cluster failures
Service Fabric has the concept of Seed Nodes. These are nodes that maintain the availability of the underlying cluster. These nodes help to ensure the cluster remains up by establishing leases with other nodes and serving as tiebreakers during certain kinds of network failures. If random failures remove a majority of the seed nodes in the cluster and they are not brought back, then your cluster federation ring collapses as you've lost seed node quorum and the cluster fails. In Azure, Service Fabric Resource Provider manages Service Fabric cluster configurations, and by default distributes Seed Nodes across Primary Node Type fault and upgrade domains; If the primary nodetype is marked as Silver or Gold durability, when you remove a seed node, either by scaling in your primary nodetype or manually removing a seed node, the cluster will attempt to promote another non-seed node from the primary nodetype available capacity, and will fail if you have less available capacity than your cluster Reliability level requires for your Primary Node Type.

In both standalone Service Fabric clusters and Azure, the "Primary Node Type" is the one that runs the seeds. When defining a primary node type, Service Fabric will automatically take advantage of the number of nodes provided by creating up to 9 seed nodes and 7 replicas of each of the system services. If a set of random failures takes out a majority of those system service replicas simultaneously, the system services will enter quorum loss, as we described above. If a majority of the seed nodes are lost, the cluster will shut down soon after.

## Next steps
- Learn how to simulate various failures using the [testability framework](service-fabric-testability-overview.md)
- Read other disaster-recovery and high-availability resources. Microsoft has published a large amount of guidance on these topics. While some of these documents refer to specific techniques for use in other products, they contain many general best practices you can apply in the Service Fabric context as well:
  - [Availability checklist](../best-practices-availability-checklist.md)
  - [Performing a disaster recovery drill](../sql-database/sql-database-disaster-recovery-drills.md)
  - [Disaster recovery and high availability for Azure applications][dr-ha-guide]
- Learn about [Service Fabric support options](service-fabric-support.md)


<!-- External links -->

[repair-partition-ps]: https://msdn.microsoft.com/library/mt163522.aspx
[azure-status-dashboard]:https://azure.microsoft.com/status/
[azure-regions]: https://azure.microsoft.com/regions/
[dr-ha-guide]: https://msdn.microsoft.com/library/azure/dn251004.aspx


<!-- Images -->

[sfx-cluster-map]: ./media/service-fabric-disaster-recovery/sfx-clustermap.png

---
title: Azure Service Fabric disaster recovery | Microsoft Docs
description: Azure Service Fabric offers the capabilities necessary to deal with all types of disasters. This article describes the types of disasters that can occur and how to deal with them.
services: service-fabric
documentationcenter: .net
author: masnider
manager: timlt
editor: ''

ms.assetid: ab49c4b9-74a8-4907-b75b-8d2ee84c6d90
ms.service: service-fabric
ms.devlang: dotNet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 07/28/2017
ms.author: masnider

---
# Disaster recovery in Azure Service Fabric
A critical part of delivering high-availability is ensuring that services can survive all different types of failures, including those that are outside of your control. This article describes the different sources of failure. It also describes the physical layout of an Azure Service Fabric cluster in the context of potential disasters and provides guidance on how to deal with such disasters in order to limit or eliminate the risk of downtime or data loss when the occur.

## Avoiding Disaster
Service Fabric's primary goal is to help you model both your environment and your applications and services in such a way that common failure types are not disasters. 

This article will discuss some common failure modes that could be disasters if not modeled and managed correctly, and also discuss mitigations and actions to take if a disaster has actually happened anyway.

In general there are two types of disaster/failure scenarios:

1. Hardware or software faults
2. Operational faults

### Hardware and software faults
Hardware and software faults are generally unpredictable but can be avoided by running more copies of the service  spanned across any hardware or software fault boundaries that you want to survive the failure of. For example, if your service is running only on one particular machine, then the failure of that one machine could constitute a disaster for that service. The simple way to avoid this disaster is to ensure that the service is actually running on multiple machines, and that the failure of one machine doesn't disrupt the running service, as a replacement instance can be created elsewhere or the reduction in capacity doesn't overload the remaining instances. The same mechanism works if you're concerned about the failure of a SAN (you'd run across multiple SANs) a rack of servers (you'd run across multiple racks), datacenters (your service should run across multiple regions), or cloud providers (you'd use multiple).  

When running in this type of spanned mode, you're still subject to some types of simultaneous failures, but single and even multiple failures of a particular type (ex: a single VM or network link failing) are automatically handled (and so no longer a "disaster"). Service Fabric provides many mechanisms for expanding the cluster and allows running many instances of your services specifically to help avoid these types of unplanned failures from turning into real disasters, if you choose to do so.

There may be reasons why running a deployment large enough to span over failures is not feasible. For example, it may take more hardware resources than are available or more than which you're not willing to pay the cost of relative to the likelihood of failures. Specifically when dealing with distributed applications, it could be that additional communication hops or state replication costs across geographic distances causes unacceptable latency relative to the additional safety provided. Where this line is drawn will differ for each application. For software faults specifically, the fault could be in the service that you are trying to scale itself, at which point more copies may not necessarily prevent the disaster occurring, since the failure condition is correlated across all the instances.

### Operational faults
Even if your service is spanned across the globe with many redundancies, it can still experience disastrous events. For example, if someone accidentally reconfigures the dns name for the service, or deletes it outright. As an example, let's say you had a stateful Service Fabric service, and someone deleted that service accidentally. Unless there's some other mitigation, that service and all of the state it had is now gone. These types of operational disasters ("oops") require different mitigations and steps for recovery than regular unplanned failures. 

The best ways to avoid these types of operational faults are to
1. restrict operational access to the environment
2. strictly audit dangerous operations
3. impose automation, prevent manual or out of band changes, and validate specific changes against the actual environment before enacting them
4. ensure that destructive operations are "soft" - i.e. that they don't take effect immediately or can be undone within some time window if necessary

Service Fabric provides some mechanisms to prevent operational faults (such as providing role based access control for cluster operations), but most of these operational faults require organizational efforts and other systems. Service Fabric does provide some mechanism for surviving operational faults, most notably backup and restore for stateful services, which is discussed below.

## Managing Failures and Disasters
The goal of Service Fabric is almost always automatic management of failures. However, in order to optimally handle some types of failures services are required to have additional code, while others should _not_ be automatically addressed for safety and business continuity reasons. 

### Handling single failures
Single machines can fail for all sorts of reasons, from power supply and networking hardware failures, to failures of the actual system or service software running on those machines. Service Fabric generally does a great job of detecting these types of failures (including cases where the machine becomes isolated from other machines due to network issues).

Whether the service is stateless, stateful, or stateful persisted, running a single instance results in downtime for that service if that single copy of the code fails for any reason. 

In order to handle any single failure, the simplest thing you can do is to ensure that your services run on more than one node by default. For stateless services this can be accomplished by having an `InstanceCount` greater than 1. For stateful services the minimum recommendation is always a `TargetReplicaSetSize` and `MinReplicaSetSize` of at least 3. Using these settings to create more running copies of your service code (and state) from the get go automatically ensures that your service can handle any single failure automatically. 

### Handling coordinated failures
Coordinated failures can happen in a cluster due to either planned or unplanned infrastructure failures and changes, or planned software changes. Service models hardware an infrastructure zones that can experience coordinated failures as Fault Domains and areas that will experience coordinated software changes (i.e. Upgrades) as Upgrade Domains. More information about fault and upgrade domains is described in [this document](service-fabric-cluster-resource-manager-cluster-description.md) that describes cluster topology and definition.

By default Service Fabric takes these zones of coordinated failure into account and will always try to ensure that your services run across them so that in the event of planned or unplanned changes your services remain available. 

For example, let's say that failure of a power source causes a rack of machines to fail simultaneously. In this case, since Service Fabric always tries to ensure that your services are running across many racks,  the loss of many machines in fault domain failure turns into another example of "single failure" for a given service. This is why managing fault domains is critical to ensuring high availability of your services. When running Service Fabric in Azure, fault domains are managed automatically, but in other environments they may not be and so require additional planning and management.

Upgrade Domains are useful for modeling areas where software is going to be upgraded at the same time. Because of this, Upgrade Domains also often define the boundaries where software will fail during planned upgrades. Upgrades of both Service Fabric and your services follow the same model. For more on rolling upgrades, upgrade domains, and the Service Fabric health model that helps prevent unintended changes from impacting the cluster and your service, see these documents:

 - [Application Upgrade](service-fabric-application-upgrade.md)
 - [Application Upgrade Tutorial](service-fabric-application-upgrade-tutorial.md)
 - [Service Fabric Health Model](service-fabric-health-introduction.md)

You can visualize the layout of your cluster across fault domains using the cluster map provided in [Service Fabric Explorer](service-fabric-visualizing-your-cluster.md):

<center>
![Nodes spread across fault domains in Service Fabric Explorer][sfx-cluster-map]
</center>

> [!NOTE]
> Modeling areas of failure, rolling upgrades, running many instances of your service code and state, placement rules to ensure your services run across fault and upgrade domains, and built-in health monitoring are just **some** of the features that Service Fabric provides in order to keep normal operational issues and failures from turning into disasters. 
>

### Handling simultaneous hardware or software failures
Above we talked about single failures, which as you can see are easy to handle for both stateless and stateful services just by keeping more copies of the code (and state) running across multiple fault and upgrade domains. Multiple simultaneous random failures can also happen, and these are more likely (though still not guaranteed) to lead to an actual disaster.


### Random Failures Leading to Service Failures
Let's say that the service had an `InstanceCount` of 5, and several nodes running those instances all failed at the same time. Service Fabric responds by automatically creating more instances on other nodes, if they're available, in order to get the service back to its desired instance count. As another example, let's say there was a stateless service with an `InstanceCount`of -1, meaning it runs on all valid nodes in the cluster. Let's say that some of those instances were to fail at the same time. What would Service Fabric do? Well, it would notice that the service was not in its desired state (it had some nodes that were up but which weren't running the service) and would try to create the instances where they were missing. 

For stateful services the situation depends on whether the service has persisted state or not, as well as how many replicas the service had and how many failed. Determining whether a disaster has actually occurred and managing it follows three stages:

1. Determining if there has been quorum loss or not
 - A quorum loss is any time a majority of the replicas of a stateful service are down at the same time, including the Primary.
2. Determining if the quorum loss is permanent or not
 - Most of the time, failures are transient. Processes are restarted, nodes are restarted, VMs are relaunched, network partitions heal. Sometimes though, failures are permanent. 
    - For services without persisted state, a failure of a quorum (or more) of replicas results _immediately_ in permanent quorum loss. When Service Fabric detects quorum loss in a stateful non-persistant service it immediately proceeds to step 3 by declaring (potential) dataloss. This makes sense because there's no other authoritative copy of the state anywhere and Service Fabric knows that there's no point in waiting for the replicas to come back (since even if they were recovered they would be empty).
    - For stateful persistent services, a failure of a quorum (or more) of replicas simply causes Service Fabric to start waiting for the replicas to come back and restore quorum. This probably results in a service outage for any writes to the affected partition (replica set) of the service, however reads may still be possible with reduced consistency guarantees. The default amount of time that Service Fabric waits for quorum to be restored is infinite, since proceeding is a (potential) dataloss event and carries other risks. Overriding the default `QuorumLossWaitDuration` value is possible but is not recommended. Instead at this time, all efforts should be made to restore the down replicas. Most commonly this means bringing the nodes that are down back up and ensuring that they can remount their drives (where the local persistent state is stored). If the quorum loss was caused by process failure, Service Fabric will automatically trying to recreate the processes; if issues are being encountered there the errors reported should be investigated. If for some reason this can't be done (ex: the drives have all failed, the machines caught on fire or were otherwise physically destroyed somehow, etc.), then we now have a permanent quorum loss event. In order to tell Service Fabric to stop waiting for the down replicas to come back a cluster administrator must determine which partitions of which services are affected and call the `Repair-ServiceFabricPartition -PartitionId` or ` System.Fabric.FabricClient.ClusterManagementClient.RecoverPartitionAsync(Guid partitionId)` API, specifically indicating the ID of the partition that should be moved out of QuorumLoss and into potential dataloss territory.

> [!NOTE]
> It is never safe to use this API other than in a targeted way against specific partitions. 
>

3. Determining if there has been actual data loss, and restoring from backups
 - When Service Fabric calls the `OnDataLossAsync` method (either automatically for a service without persistent state or as a result of a recovery/repair API call), it is always because of _suspected_ dataloss. Service Fabric ensures that this call is delivered to the _best_ remaining replica - the one that has made the most progress. It is possible that the remaining replica actually has all same state as the primary did when it went down, but without that state to compare it to, there's no good way for Service Fabric or administrators/operations to know. At this point we know the other replicas are not coming back, that was the decision made when we stopped waiting for the quorum loss to resolve itself. At this point the best course of action for the service is usually to freeze and wait for specific administrative intervention. But what should that look like?
   - First of course, to log that the `OnDataLossAsync` event has been triggered and to fire any necessary administrative alerts
   - Comparisons of the remaining replica's state to that contained in any backups that are available. If using the Service Fabric reliable collections then there are tools and processes available for doing so, described in [this article](service-fabric-reliable-services-backup-restore.md).
   - Often there is also some other telemetry or exhaust from the service, or metadata contained in other services that can be used to determine if there were any calls received and processed at the primary that were not present in the backup or replicated to this particular replica. 
  - Once the comparison is done, the service code should return true if any state changes were made, and false if the replica determined that it was the best available copy of the state and made no changes. 

It is critically important that service authors practice potential dataloss and failure scenarios before services are ever deployed in production. To protect against the possibility of dataloss, it is important to periodically [back up the state](service-fabric-reliable-services-backup-restore.md) of any of your stateful services to a geo-redundant store and ensure that you have validated the ability to restore it. How often you perform a backup will determine your recovery point objective (RPO). Service Fabric provides many tools for testing various failure scenarios, including permanent quorum and dataloss requiring restoration from a backup, as a part of Service Fabric's testability tools, particularly the Fault Analysis Service. More info on those tools and patterns is available [here](service-fabric-testability-overview.md). 

> [!NOTE]
> System services can also suffer quorum loss, with the impact being specific to the service in question. For instance, quorum loss in the naming service will impact name resolution, whereas quorum loss in the failover manager service will block new service creation and failovers. While the Service Fabric system services follow the same pattern as your services for state management, it is not recommended that you should attempt to move them out of Quorum Loss and into potential dataloss, since this can cause various unwanted side effects. The recommendation is instead to [seek support](service-fabric-support.md) so that a solution can be determined that is targeted to your specific situation.  Usually it is preferable to simply wait until the down replicas return.
>

## Availability of the Service Fabric Cluster
Generally speaking, the Service Fabric cluster itself is a highly distributed environment with no single points of failure. A failure of any one node will not cause availability or reliability issues for the cluster, primarially because the Service Fabric system services follow the same guidelines given above: they always run with 3 or more replicas by default, and those that are stateless (or contain stateless components) generally run on all nodes. The underlying Service Fabric networking and failure detection layers are fully distributed. Most system services can be rebuilt from metadata in the cluster, or know how to re-syncronize their state with those that do. 

### Failures of a datacenter or Azure region
In rare cases, physical data centers can become temporarily unavailable due to loss of power or network connectivity. In these cases, your Service Fabric clusters and applications that are wholly contained within those datacenters or Azure regions will likewise be unavailable but _your data will be preserved_. For clusters running in Azure, you can view updates on outages on the [Azure status page][azure-status-dashboard].

In the highly unlikely event that an entire physical data center is destroyed, any Service Fabric clusters hosted there will be lost, along with their state.

There's two different strategies for surviving the permanent or sustained failure of a single datacenter or region. 

1. Run separate Service Fabric clusters in multiple such regions, and utilize some mechanism for failover and fail-back between these environments. This typically requires additional management and operations code, as well as coordination of backups from the services in one datacenter or region so that they are available in other datacenters or regions when one fails. 
2. Run a single Service Fabric cluster that spanns multiple (at least three) datacenters ore regions. This requires a more complex cluster topology from day one, but the result is that failures of one datacenter or region are handled by the mechanisms that work for clusters within a single region, namely fault domains, upgrade domains, and Service Fabric's placement logic that always tries to spread workloads out so that they tolerate normal failures. 

### Random Failures Leading to Cluster Failures
Service Fabric has the concept of Seed Nodes which are nodes that help to maintain the availability of the underlying cluster. In general they are not very different from normal nodes, however they do help to ensure the cluster remains up by establishing leases with other nodes and serving as tiebreakers during certain kinds of network failures. If random failures remove a majority of the seed nodes in the cluster and they are not brought back, the cluster will shut down. In Azure, Seed Nodes are automatically managed: they are distributed over the available fault and upgrade domains, and if a single seed node is removed from the cluster another one will be created in its place. 

If seed node failures lead to the cluster as a whole being down, the best option is to restart the seed nodes and to be sure that a majority of them come back up. New seeds can be used if the existing seeds have been permanently lost somehow, but the cluster must be reconfigured in order to point the existing nodes that remain at the new set of seeds. If no new seeds can be created and the existing seeds cannot be recreated, the cluster will remain down. A new cluster will have to be created from scratch, services recreated, and any state held in the cluster restored from backups. 


## Next Steps
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

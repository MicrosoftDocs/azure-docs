<properties
   pageTitle="Azure Service Fabric disaster recovery | Microsoft Azure"
   description="Azure Service Fabric offers the capabilities necessary to deal with all types of disasters. This article describes the types of disasters that can occur and how to deal with them."
   services="service-fabric"
   documentationCenter=".net"
   authors="seanmck"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotNet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="08/10/2016"
   ms.author="seanmck"/>

# Disaster recovery in Azure Service Fabric

A critical part of delivering a high-availability cloud application is ensuring that it can survive all different types of failures, including those that are outside of your control. This article describes the physical layout of an Azure Service Fabric cluster in the context of potential disasters and provides guidance on how to deal with such disasters to limit or eliminate the risk of downtime or data loss.

## Physical layout of Service Fabric clusters in Azure

To understand the risk posed by different types of failures, it is useful to know how clusters are physically laid out in Azure.

When you create a Service Fabric cluster in Azure, you are required to choose a region where it will be hosted. The Azure infrastructure then provisions the resources for that cluster within the region, most notably the number of virtual machines (VMs) requested. Let's look more closely at how and where those VMs are provisioned.

### Fault domains

By default, the VMs in the cluster are evenly spread across logical groups known as fault domains (FDs), which segment the machines based on potential failures in the host hardware. Specifically, if two VMs reside in two distinct FDs, you can be sure that they do not share the same power source or network switch. As a result, a local network or power failure affecting one VM will not affect the other, allowing Service Fabric to rebalance the work load of the unresponsive machine within the cluster.

You can visualize the layout of your cluster across fault domains using the cluster map provided in [Service Fabric Explorer](service-fabric-visualizing-your-cluster.md):

![Nodes spread across fault domains in Service Fabric Explorer][sfx-cluster-map]

>[AZURE.NOTE] The other axis in the cluster map shows upgrade domains, which logically group nodes based on planned maintenance activities. Service Fabric clusters in Azure are always laid out across five upgrade domains.

### Geographic distribution

There are currently [26 Azure regions throughout the world][azure-regions], with several more announced. An individual region can contain one or more physical data centers depending on demand and the availability of suitable locations, among other factors. Note, however, that even in regions that contain multiple physical data centers, there is no guarantee that your cluster's VMs will be evenly spread across those physical locations. Indeed, currently, all VMs for a given cluster are provisioned within a single physical site.

## Dealing with failures

There are several types of failures that can impact your cluster, each with its own mitigation. We will look at them in order of likelihood to occur.

### Individual machine failures

As mentioned, individual machine failures, either within the VM or in the hardware or software hosting it within a fault domain, pose no risk on their own. Service Fabric will typically detect the failure within seconds and respond accordingly based on the state of the cluster. For instance, if the node was hosting the primary replicas for a partition, a new primary is elected from the partition's secondary replicas. When Azure brings the failed machine back up, it will rejoin the cluster automatically and once again take on its share of the workload.

### Multiple concurrent machine failures

While fault domains significantly reduce the risk of concurrent machine failures, there is always the potential for multiple random failures to bring down several machines in a cluster simultaneously.

In general, as long as a majority of the nodes remain available, the cluster will continue to operate, albeit at lower capacity as stateful replicas get packed into a smaller set of machines and fewer stateless instances are available to spread load.

#### Quorum loss

If a majority of the replicas for a stateful service's partition go down, that partition enters a state known as "quorum loss." At this point, Service Fabric stops allowing writes to that partition to ensure that its state remains consistent and reliable. In effect, we are choosing to accept a period of unavailability to ensure that clients are not told that their data was saved when in fact it was not. Note that if you have opted in to allowing reads from secondary replicas for that stateful service, you can continue to perform those read operations while in this state. A partition remains in quorum loss until a sufficient number of replicas come back or until the cluster administrator forces the system to move on using the [Repair-ServiceFabricPartition API][repair-partition-ps].

>[AZURE.WARNING] Performing a repair action while the primary replica is down will result in data loss.

System services can also suffer quorum loss, with the impact being specific to the service in question. For instance, quorum loss in the naming service will impact name resolution, whereas quorum loss in the failover manager service will block new service creation and failovers. Note that unlike for your own services, attempting to repair system services is *not* recommended. Instead, it is preferable to simply wait until the down replicas return.

#### Minimizing the risk of quorum loss

You can minimize your risk of quorum loss by increasing the target replica set size for your service. It is helpful to think of the number of replicas you need in terms of the number of unavailable nodes you can tolerate at once while remaining available for writes, keeping in mind that application or cluster upgrades can make nodes temporarily unavailable, in addition to hardware failures.

Consider the following examples assuming that you've configured your services to have a MinReplicaSetSize of three, the smallest number recommended for production services. With a TargetReplicaSetSize of three (one primary and two secondaries), a hardware failure during an upgrade (two replicas down) will result in quorum loss and your service will become read-only. Alternatively, if you have five replicas, you would be able to withstand two failures during upgrade (three replicas down) as the remaining two replicas can still form a quorum within the minimum replica set.

### Data center outages or destruction

In rare cases, physical data centers can become temporarily unavailable due to loss of power or network connectivity. In these cases, your Service Fabric clusters and applications will likewise be unavailable but your data will be preserved. For clusters running in Azure, you can view updates on outages on the [Azure status page][azure-status-dashboard].

In the highly unlikely event that an entire physical data center is destroyed, any Service Fabric clusters hosted there will be lost, along with their state.

To protect against this possibility, it is critically important to periodically [backup your state](service-fabric-reliable-services-backup-restore.md) to a geo-redundant store and ensure that you have validated the ability to restore it. How often you perform a backup will be dependent on your recovery point objective (RPO). Even if you have not fully implemented backup and restore yet, you should implement a handler for the `OnDataLoss` event so that you can log when it occurs as follows:

```c#
protected virtual Task<bool> OnDataLoss(CancellationToken cancellationToken)
{
  ServiceEventSource.Current.ServiceMessage(this, "OnDataLoss event received.");
  return Task.FromResult(true);
}
```


### Software failures and other sources of data loss

As a cause of data loss, code defects in services, human operational errors, and security breaches are more common than widespread data center failures. However, in all cases, the recovery strategy is the same: take regular backups of all stateful services and exercise your ability to restore that state.

## Next Steps

- Learn how to simulate various failures using the [testability framework](service-fabric-testability-overview.md)
- Read other disaster-recovery and high-availability resources. Microsoft has published a large amount of guidance on these topics. While some of these documents refer to specific techniques for use in other products, they contain many general best practices you can apply in the Service Fabric context as well:
 - [Availability checklist](../best-practices-availability-checklist.md)
 - [Performing a disaster recovery drill](../sql-database/sql-database-disaster-recovery-drills.md)
 - [Disaster recovery and high availability for Azure applications][dr-ha-guide]


<!-- External links -->

[repair-partition-ps]: https://msdn.microsoft.com/library/mt163522.aspx
[azure-status-dashboard]:https://azure.microsoft.com/status/
[azure-regions]: https://azure.microsoft.com/regions/
[dr-ha-guide]: https://msdn.microsoft.com/library/azure/dn251004.aspx


<!-- Images -->

[sfx-cluster-map]: ./media/service-fabric-disaster-recovery/sfx-clustermap.png

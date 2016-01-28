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
   ms.date="01/27/2016"
   ms.author="seanmck"/>

# Disaster recovery in Azure Service Fabric

A critical part of delivering a high-availability cloud application is ensuring that it can survive all different types of failures, including those that are completely outside of your control. This article describes the physical layout of an Azure Service Fabric cluster in the context of potential disasters and provides guidance on how to deal with such disasters to limit or eliminate the risk of downtime or data loss.

## Physical layout of Service Fabric clusters in Azure

To understand the risk posed by different types of failures, it is useful to know how clusters are physically laid out in Azure.

When you create a Service Fabric clusters in Azure, you are required to choose a region where it will be hosted. The Azure infrastructure then provisions the resources for that cluster within the region, most notably the number of virtual machines (VMs) requested. Let's look more closely at how and where those VMs are provisioned.

### Fault domains

By default, the VMs in the cluster will be evenly spread across logical groups known as fault domains, which segment the machines based on potential failures in the host hardware. Specifically, if two VMs reside in two distinct fault domains, you can be sure that they do not share the same physical rack or network switch. As a result, local network or power failure affecting one VM will not affect the other, allowing Service Fabric to rebalance the work load of the unresponsive machine with the cluster.

### Geographic distribution

There are currently 22 Azure regions throughout the world, with 5 more already announced. An individual region can contain one or more physical data centers depending on demand and the availability of suitable locations, among other factors. Note, however, that even in regions that contain multiple physical data centers, there is no guarantee that your cluster's VMs will be evenly spread across those physical locations. Indeed, currently, all VMs for a given cluster are provisioned within a single physical site.

>[AZURE.NOTE] Azure has announced plans for a feature known as Availability Zones, which will enable you to distribute VMs across physical sites within a region, with each physical site guaranteed to be separated by a specific distance from those in a different zone. When that feature becomes available, we will consider enabling the creation of Service Fabric clusters that span Availability Zones.

## Dealing with failures

There are several types of failures that can impact your cluster, each with its own mitigation. We will look at them in order of likelihood to occur.

### Individual machine failures

As mentioned, individual machine failures, either within the VM or in the hardware or software hosting it within a fault domain, pose no risk on their own. Service Fabric will quickly detect the failure and rebalance any work that the VM was doing to another machine within the cluster, while ensuring that there is still a sufficient number of replicas to maintain data consistency for stateful services. When Azure brings the failed machine back up, it will rejoin the cluster automatically and once again take on its share of the workload.

### Multiple concurrent machine failures

While fault domains significantly reduce the risk of concurrent machine failures, there is always the potential for multiple random failures to bring down several machines in a cluster simultaneously.

In general, as long as a majority of the nodes remain available, the cluster will continue to operate, albeit at lower capacity. If the set of available nodes drops below a majority, the cluster will enter a state known as "quorum loss". At this point, Service Fabric will stop all services to ensure that data loss does not occur. In effect, we are choosing to accept a period of unavailability to ensure that clients will not be told that their data was saved when in fact it was not.

Once in quorum loss, the cluster's applications and services will remain unavailable until a majority of nodes have come back up. At that point, assuming that the state stored on those nodes is still available, the cluster can return to normal operation.

### Physical data center destruction

In the highly unlikely event that an entire physical data center is destroyed, any Service Fabric clusters hosted there will be lost, along with their state.

To protect against this possibility, it is important to periodically [backup your state](service-fabric-reliable-services-backup-restore.md) to a geo-redundant store and ensure that you have validated the ability to restore it. How often you perform a backup will be dependent on your recovery point objective (RPO).

>[AZURE.NOTE] Backup and restore is currently only available for the Reliable Services API. Backup and restore for Reliable Actors will be available in an upcoming release.

## Next Steps

- Learn how to simulate various failures using the [testability framework](service-fabric-testability-overview.md)

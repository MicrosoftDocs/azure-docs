<properties
   pageTitle="Service Fabric Architecture"
   description="Service Fabric is a distributed systems platform used to build scalable, reliable, and easily-managed applications for the cloud. This article shows the architecture of Service Fabric."
   services="service-fabric"
   documentationCenter=".net"
   authors="rishirsinha"
   manager="timlt"
   editor="rishirsinha"/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="04/27/2015"
   ms.author="rsinha"/>

# Service Fabric Architecture

Service Fabric, like any complex patform is built through many complex sub-systems. These systems layered together allow application developers to write service fabric applications that are 

* higly available, 
* scalable, 
* easily manageable and 
* easy to test.

The following document shows the architecture and major subsystems of Service Fabric.

![](media/service-fabric-architecture/service-fabric-architecture.png)

At the bottom of the stack is our transport. In a distributed system the ability to securely communicate between different individual nodes is critical. Our transportation stack provides the ability to securely communicate between the different nodes. On top of the communication layer, is our federation layer. The federation layer clusters the different nodes into a single unit so that the system can do failure detection, leader election and consistent routing. Above the federation layer is the reliability layer. This layer provides reliability of Service Fabric services through replication, resource management and failover management.


The following is a list of the major Service Fabric subsystems and their functionality.

* Management- Provides end-to-end service and application lifecycle management. PowerShell Cmdlets and administrative APIs enable you to provision, deploy, patch, upgrade, and de-provision applications without loss of availability. Diagnostics information, tracing, performance counters, and alerts are provided so you can monitor application and cluster health.

* Health- Enables health monitoring of applications and services and cluster entities. Cluster entities (such as nodes, service partitions, and replicas) can report health information, which is then aggregated into the centralized Health Store. This health information provides an overall point-in-time health snapshot of the services and nodes distributed across multiple nodes in the cluster, allowing you to take any needed corrective actions. Health Query APIs enable you to query the health events reported to the Health subsystem. The Health Query APIs return the raw health data stored in the Health Store or the aggregated, interpreted health data for a specific cluster entity.

* Communication- Provides reliable messaging within the cluster and service discovery. The Naming service resolves service names to a location in the cluster and allows users to manage service names and properties. Using the Naming service, clients can securely communicate with any node in the cluster to resolve a service name and retrieve service metadata. Using a simple Naming Client API, users of Service Fabric can develop services and clients capable of resolving the current network location despite dynamism or size of the cluster.

* Reliability- Provides service reliability, scalability, and functionality, including replication, resource balancing, and failover management.

  The Resource Balancer places service replicas across failure domain in the cluster and ensures that all failover units are operational. The Resource Balancer also resource balances services across the underlying shared pool of cluster nodes to achieve optimal uniform load distribution.

  The Failover Manager ensures that when nodes are added to or removed from the cluster, load is automatically redistributed across the available nodes. If a node in the cluster fails, the cluster will automatically reconfigure the service replicas so that there will be no loss of availability.

  The Replicator ensures that state changes in the primary service replica will automatically be replicated to secondary replicas, maintaining consistency between the primary and secondary replicas in a service replica set. The Replicator is responsible for quorum management among the replicas in the replica-set. It interacts with the failover unit to get the list of operations to replicate and the RA provides it with the configuration of the replica-set, which indicates which replicas the operations need to be replicated to. Service Fabric provides a default replicator called Fabric Replicator, which can be used by service developers to make service state highly available and reliable.

* Federation- Federates a set of nodes into a consistent, reliable, and scalable fabric. The Federation subsystem provides fundamental distributed system capabilities such as leader election, failure detection, consistent routing, and lease management. The Federation subsystem creates and maintains the topology of the cluster.

* Transport- Provides secure point-to-point communication of datagram messages within the cluster.

* Testability - Provides ability to generate faults in the system to simulate real world infrastructure.

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

Service Fabric, like any complex platform is built through many complex sub-systems. These systems layered together allow application developers to write service fabric applications that are 

* highly available, 
* scalable, 
* easily manageable and 
* easy to test.

The following document shows the architecture and major subsystems of Service Fabric.

![](media/service-fabric-architecture/service-fabric-architecture.png)

At the bottom of the stack is our transport. In a distributed system the ability to securely communicate between different individual nodes is critical. Our transportation stack provides the ability to securely communicate between the different nodes. On top of the transport layer, is our federation layer. The federation layer clusters the different nodes into a single unit so that the system can do failure detection, leader election and consistent routing. Above the federation layer is the reliability layer. This layer provides reliability of Service Fabric services through replication, resource management and failover management. The federation layer also hosts the Hosting subsystem, which manages the lifecycle of an application on a single node. On the side are the cluster management and testability subsystems. The cluster management subsystem, manages the multi-machine lifecycle of the applications and services. The testability sub system allows the application developer to battle harden their services through simulated faults before marching them out to production environments. Service Fabric also provides the ability to resolve service locations through its communication subsystem. On top of these lower level details sits the application programming model which the application developer has to write to. 

## Transport subsystem
Transport layer implements a point-to-point datagram communication channel. This channel is used for communication within service fabric cluster and communication between service fabric cluster and clients. It supports one-way and request-reply communication pattern, which provides the basis for implementing broadcast and multicast in upper layers. Transport layer supports securing communication with X509 certificates or Windows security. This layer is used internally by Service Fabric and is not directly accessible to the developers for application programming.

## Federation subsystem
In order to reason about a set of nodes in a distributed system, we need to have a consistent view of the system. This is where the federation subsystem comes in. It uses the communication primitives provided by the transport subsystem and stitches the various nodes into a single unified system that it can reason about. It provides the distributed systems primitives needed by the other layers - failure detection, leader election, and consistent routing. The federation system is built on top of Distributed Hash Tables with a 128 bit token space. This layer creates a ring topology over the nodes, with each node in the ring being allocated a subset of the token space for ownership. For failure detection, the layer uses a leasing mechanism based on heart beating and arbitration. The layer also guarantees through intricate join and departure protocols that only a single owner of a token exists at any time. This allows us to provide leader election and consistent routing guarantees. The federation provides the underlying distributed system reasoning giving the higher levels simpler primitives to deal with.

# Reliability subsystem
The reliability subsystem provides the mechanism to make the state of a Service Fabric service highly available. It does the same through the following:

* The Replicator ensures that state changes in the primary service replica will automatically be replicated to secondary replicas, maintaining consistency between the primary and secondary replicas in a service replica set. The Replicator is responsible for quorum management among the replicas in the replica-set. It interacts with the failover unit to get the list of operations to replicate and the reconfiguration agent (part of reliability system running on each node) provides it with the configuration of the replica-set, which indicates which replicas the operations need to be replicated to. Service Fabric provides a default replicator called Fabric Replicator, which can be used by service developers to make service state highly available and reliable.
* The Failover Manager ensures that when nodes are added to or removed from the cluster, load is automatically redistributed across the available nodes. If a node in the cluster fails, the cluster will automatically reconfigure the service replicas so that there will be no loss of availability.
* The Resource Balancer places service replicas across failure domain in the cluster and ensures that all failover units are operational. The Resource Balancer also resource balances services across the underlying shared pool of cluster nodes to achieve optimal uniform load distribution.

# Management subsystem
The management subsystem provides end-to-end service and application lifecycle management. PowerShell Cmdlets and administrative APIs enable you to provision, deploy, patch, upgrade, and de-provision applications without loss of availability. The management subsystem does this through the following services.

* Cluster Manager - This is the primary service that interacts with the Failover Manager from reliability to place the applications with the various nodes based on the service placement constraints. The resource balancer in failover ensures that the constraints are never broken. The cluster manager manages the life-cycle of the applications from provision to de-provision. It integrates with the health manager described in the next step to ensure that application availability is not lost from a semantic health perspective during upgrades.
* Health Manager - This services enables health monitoring of applications and services and cluster entities. Cluster entities (such as nodes, service partitions, and replicas) can report health information, which is then aggregated into the centralized Health Store. This health information provides an overall point-in-time health snapshot of the services and nodes distributed across multiple nodes in the cluster, allowing you to take any needed corrective actions. Health Query APIs enable you to query the health events reported to the Health subsystem. The Health Query APIs return the raw health data stored in the Health Store or the aggregated, interpreted health data for a specific cluster entity.
* Image Store - This service allows for the storage and distribution of the application binaries. This service provides simple distributed file store where the applications are uploaded to and downloaded from.

The hosting layer on each node is indicated to by the cluster manager which services it needs to manage. The hosting layer sitting on each node, then manages the lifecycle of the application on that node. It interacts with the reliability and health components to ensure that the replicas are properly placed and are healthy.

# Communication subsystem
This subsystem provides reliable messaging within the cluster and service discovery. This is done through the Naming service. The Naming service resolves service names to a location in the cluster and allows users to manage service names and properties. Using the Naming service, clients can securely communicate with any node in the cluster to resolve a service name and retrieve service metadata. Using a simple Naming Client API, users of Service Fabric can develop services and clients capable of resolving the current network location despite node dynamism or size of the cluster.

# Testability subsystem
Testability is a suite of tools specifically designed for testing services built on  Service Fabric. The tools allow the developer to easily induce meaningful faults and run test scenarios to exercise and validate the numerous different states and transitions a service will experience throughout its lifetime, all in a controlled and safe manner. Testability also provides a mechanism to run long running tests that can iterate through various possible failures without losing availability providing users with a Test In Production environment.


<properties
   pageTitle="Planning the Service Fabric cluster capacity | Microsoft Azure"
   description="Service Fabric cluster capacity planning considerations."
   services="service-fabric"
   documentationCenter=".net"
   authors="ChackDan"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="03/26/2016"
   ms.author="chackdan"/>


# Service Fabric cluster capacity planning considerations

For any production deployment, capacity planning is an important step. Here are some of the items that you have to consider as a part of that process.
  
1. The number of node types your cluster needs to start out with
1. The properties of each of the node types (size, primary, internet facing, number of VMs etc)
1. The reliability and durability characteristics of the cluster 

Let us briefly review each of these.
 
## 1. The number of Node Types your Cluster needs to start out with

At first, you need to figure out what the cluster you are creating is going to be used for and what kinds of applications you are planning to deploy into this cluster.If you are not clear on the purpose of the cluster, then you are most likely not yet ready to enter the capacity planning process. 


Establish the number of node types your Cluster needs to start out with.  Each node type is mapped to a Virtual Machine Scale Set. Each node type can then be scaled up or down independently, have different sets of ports open and can have different capacity metrics. So the decision of the number of node types essentially comes down to the following considerations.


1. Does your application have multiple services, and does any of those need to be public or internet facing? Typical applications contain a front-end gateway service that receive input from a client, and one or more back-end services that just talk to the front-end services. So in this case, you end up having atleast two node Types.

2. Does your services (that make up your application), have different infrastructure needs like larger RAM, CPU cycles etc? For example, Let us assume that the application that you want to deploy contains a front-end service and a back-end service. The front-end service can run on smaller VMs (VM sizes like D2) that have ports open to the Internet, but the back-end service, which is computation intensive, need to be run on larger VMs (with VM sizes like D4, D6, D15, and so on) that are not Internet facing.

 In this example, although you can decide to put all the services on one node type, we recommended that you place them in a cluster with two node types.  This allows for each node type to have distinct properties like Internet connectivity, VM size, and the number of VMs can be scaled independently as well.  

2. Since you cannot predict future, go with facts you know of and decide on the number of node types that your applications need to start with. You can always add or remove node types at a later time. A service fabric cluster will always need to have one node type.
 
## 2. The properties of each of the node types 

The **node type** can be seen as equivalent to roles in cloud services. Node types define the VM sizes, the number of VMs, and their properties. Every node type that is defined in a Service Fabric cluster is setup as a separate Virtual Machine Scale Set. VM Scale Sets are an azure compute resource you can use to deploy and manage a collection of virtual machines as a set. Being defined as distinct VM Scale sets, each node type can then be scaled up or down independently, have different sets of ports open, and can have different capacity metrics.

Your cluster can have more than one node type, but the primary node type (the first one that you define on the portal) must have at least five VMs for clusters used for production workloads (or atleast three VMs for test clusters). If you are creating the cluster using an ARM template, then you will find a "is Primary" attribute under the node type definition. Primary node type is the node type were service fabric system services are placed.  


**Primary node type** For a cluster with multiple node types, you will need to choose one of them to be primary. here are the characteristics of a primary node type.

1. The minimum size of VMs for the primary node type is driven by the durability tier you choose. The default for the durability tier is Bronze. Scroll down for Details on what the durability tier is and the values it can take.  

2. The minimum number of VMs for the primary node type is driven by the reliability tier you choose. The default for the reliability tier is Silver. Scroll down for Details on what the reliability tier is and the values it can take. 

4.  The service fabric system services (for example -Cluster Manager Service, Image Store service etc ) are placed on the primary node type and so the reliability and durability of the cluster is determined by the reliability trier value and durability tier value you select for the primary node type.

![Screen shot of a cluster that has two Node Types ][SystemServices]


**other Node Types** For a cluster with multiple node types, there will be one primary node type and the rest of them are non-primary. Here are the characteristics of a non-primary node type

1. The minimum size of VMs for this node type is driven by the durability tier you choose. The default for the durability tier is Bronze. Scroll down for Details on what the durability tier is and the values it can take.  

2. The minimum number of VMs for this node type can be one. However you should choose this number based on the number of replicas of the application/services that you would like to run in this node type. The number of VMS in a node type can be increased after you have deployed the cluster. 


## Durability Tier in a Node Type

Durability Tier is used to indicate to the system, the privileges that your VMs have with the underlying  Azure infrastructure. In the primary node type, this privilege allows service fabric to pause any VM level infrastructure request like VM reboot, VM re-image, VM migration etc that impact the quorum requirements for the system services and your stateful services running in it. In the non-primary node types, this privilege allows service fabric to pause any VM level infrastructure request like VM reboot, VM re-image, VM migration etc that impact the quorum requirements for your stateful services running in it.

This privilege is expressed in the following values

1. Gold - The infrastructure Jobs can be paused for a duration of 2 hours per UD

2. Silver - The infrastructure Jobs can be paused for a duration of 30 mins per UD
  
3. Bronze - No privileges. 


## Reliability Tier in a Node Type

Reliability Tier is used to set the number of replicas of the system services that you want to run in this cluster on the primary node type. The more the number of replicas, the more reliable the system services are in your cluster.  

The reliability tier can take the following values. 

1. Platinum - Run the System services with a target replica set count of 9

3. Gold - Run the System services with a target replica set count of 7

2. Silver - Run the System services with a target replica set count of 5
  
3. Bronze -  Run the System services with a target replica set count of 3


**Note -** 


1. The reliability tier you choose determines the minimum number of nodes your primary node type must have. The tier has no bearing on the max size of the cluster. So you can have a 20 node cluster, that is running at Bronze reliability. 

2. At any time your can choose to update the reliability of your cluster from one tier to another. Doing this will trigger the fabric upgrades needed to change the system services replica set count.


<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps
- [Service Fabric cluster security](service-fabric-cluster-security.md)
- [Service Fabric health model introduction](service-fabric-health-introduction.md)

<!--Image references-->
[SystemServices]: ./media/service-fabric-cluster-capacity/SystemServices.png

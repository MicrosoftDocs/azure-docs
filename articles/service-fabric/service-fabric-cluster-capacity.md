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
   ms.date="05/02/2016"
   ms.author="chackdan"/>


# Service Fabric cluster capacity planning considerations

For any production deployment, capacity planning is an important step. Here are some of the items that you have to consider as a part of that process.

- The number of node types your cluster needs to start out with
- The properties of each of node type (size, primary, internet facing, number of VMs, etc)
- The reliability and durability characteristics of the cluster

Let us briefly review each of these.

## The number of node types your cluster needs to start out with

First, you need to figure out what the cluster you are creating is going to be used for and what kinds of applications you are planning to deploy into this cluster. If you are not clear on the purpose of the cluster, you are most likely not yet ready to enter the capacity planning process.

Establish the number of node types your cluster needs to start out with.  Each node type is mapped to a Virtual Machine Scale Set. Each node type can then be scaled up or down independently, have different sets of ports open, and can have different capacity metrics. So the decision of the number of node types essentially comes down to the following considerations:

- Does your application have multiple services, and do any of those need to be public or internet facing? Typical applications contain a front-end gateway service that receive input from a client, and one or more back-end services that communicate with the front-end services. So in this case, you end up having at least two node types.

- Do your services (that make up your application) have different infrastructure needs such as greater RAM or higher CPU cycles? For example, let us assume that the application that you want to deploy contains a front-end service and a back-end service. The front-end service can run on smaller VMs (VM sizes like D2) that have ports open to the internet.  The back-end service, however, is computation intensive and needs to run on larger VMs (with VM sizes like D4, D6, D15, and so on) that are not internet facing.

 In this example, although you can decide to put all the services on one node type, we recommended that you place them in a cluster with two node types.  This allows for each node type to have distinct properties such as internet connectivity or VM size. The number of VMs can be scaled independently, as well.  

- Since you cannot the predict future, go with facts you know of and decide on the number of node types that your applications need to start with. You can always add or remove node types at a later time. A Service Fabric cluster must have at least one node type.

## The properties of each node type

The **node type** can be seen as equivalent to roles in Cloud Services. Node types define the VM sizes, the number of VMs, and their properties. Every node type that is defined in a Service Fabric cluster is setup as a separate Virtual Machine Scale Set. VM Scale Sets are an Azure compute resource you can use to deploy and manage a collection of virtual machines as a set. Being defined as distinct VM Scale Sets, each node type can then be scaled up or down independently, have different sets of ports open, and can have different capacity metrics.

Your cluster can have more than one node type, but the primary node type (the first one that you define on the portal) must have at least five VMs for clusters used for production workloads (or at least three VMs for test clusters). If you are creating the cluster using an ARM template, then you will find a **is Primary** attribute under the node type definition. The primary node type is the node type where Service Fabric system services are placed.  

### Primary node type
For a cluster with multiple node types, you will need to choose one of them to be primary. Here are the characteristics of a primary node type:

- The minimum size of VMs for the primary node type is determined by the durability tier you choose. The default for the durability tier is Bronze. Scroll down for details on what the durability tier is and the values it can take.  

- The minimum number of VMs for the primary node type is determined by the reliability tier you choose. The default for the reliability tier is Silver. Scroll down for details on what the reliability tier is and the values it can take.

- The Service Fabric system services (for example, the Cluster Manager service or Image Store service) are placed on the primary node type and so the reliability and durability of the cluster is determined by the reliability tier value and durability tier value you select for the primary node type.

![Screen shot of a cluster that has two Node Types ][SystemServices]


### Non-primary node type
For a cluster with multiple node types, there will be one primary node type and the rest of them are non-primary. Here are the characteristics of a non-primary node type:

- The minimum size of VMs for this node type is determined by the durability tier you choose. The default for the durability tier is Bronze. Scroll down for details on what the durability tier is and the values it can take.  

- The minimum number of VMs for this node type can be one. However you should choose this number based on the number of replicas of the application/services that you would like to run in this node type. The number of VMs in a node type can be increased after you have deployed the cluster.


## The durability characteristics of the cluster

The durability tier is used to indicate to the system the privileges that your VMs have with the underlying Azure infrastructure. In the primary node type, this privilege allows Service Fabric to pause any VM level infrastructure request (such as a VM reboot, VM re-image, or VM migration) that impact the quorum requirements for the system services and your stateful services. In the non-primary node types, this privilege allows Service Fabric to pause any VM level infrastructure request like VM reboot, VM re-image, VM migration etc that impact the quorum requirements for your stateful services running in it.

This privilege is expressed in the following values:

- Gold - The infrastructure Jobs can be paused for a duration of 2 hours per UD

- Silver - The infrastructure Jobs can be paused for a duration of 30 minutes per UD

- Bronze - No privileges.

## The reliability characteristics of the cluster

The reliability tier is used to set the number of replicas of the system services that you want to run in this cluster on the primary node type. The more the number of replicas, the more reliable the system services are in your cluster.  

The reliability tier can take the following values.

- Platinum - Run the System services with a target replica set count of 9

- Gold - Run the System services with a target replica set count of 7

- Silver - Run the System services with a target replica set count of 5

- Bronze -  Run the System services with a target replica set count of 3

Please note that the reliability tier you choose determines the minimum number of nodes your primary node type must have. The tier has no bearing on the max size of the cluster. So you can have a 20 node cluster, that is running at Bronze reliability.

Also note that at any time you can choose to update the reliability of your cluster from one tier to another. Doing this will trigger the cluster upgrades needed to change the system services replica set count.

<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps

Once you finish your capacity planning and set up a cluster, please read the following:
- [Service Fabric cluster security](service-fabric-cluster-security.md)
- [Service Fabric health model introduction](service-fabric-health-introduction.md)

<!--Image references-->
[SystemServices]: ./media/service-fabric-cluster-capacity/SystemServices.png

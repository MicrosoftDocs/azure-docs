---
title: Planning the Service Fabric cluster capacity | Microsoft Docs
description: Service Fabric cluster capacity planning considerations. Nodetypes, Operations, Durability and Reliability tiers
services: service-fabric
documentationcenter: .net
author: ChackDan
manager: timlt
editor: ''

ms.assetid: 4c584f4a-cb1f-400c-b61f-1f797f11c982
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 06/27/2018
ms.author: chackdan

---
# Service Fabric cluster capacity planning considerations
For any production deployment, capacity planning is an important step. Here are some of the items that you have to consider as a part of that process.

* The number of node types your cluster needs to start out with
* The properties of each of node type (size, primary, internet facing, number of VMs, etc.)
* The reliability and durability characteristics of the cluster

> [!NOTE]
> You should minimally review all **Not Allowed** upgrade policy values during planning. This is to ensure that you set the values appropriately and to mitigate burning down of your cluster later because of unchangeable system configuration settings. 
> 

Let us briefly review each of these items.

## The number of node types your cluster needs to start out with
First, you need to figure out what the cluster you are creating is going to be used for.  What kinds of applications you are planning to deploy into this cluster? If you are not clear on the purpose of the cluster, you are most likely not yet ready to enter the capacity planning process.

Establish the number of node types your cluster needs to start out with.  Each node type is mapped to a virtual machine scale set. Each node type can then be scaled up or down independently, have different sets of ports open, and can have different capacity metrics. So the decision of the number of node types essentially comes down to the following considerations:

* Does your application have multiple services, and do any of them need to be public or internet facing? Typical applications contain a front-end gateway service that receives input from a client and one or more back-end services that communicate with the front-end services. So in this case, you end up having at least two node types.
* Do your services (that make up your application) have different infrastructure needs such as greater RAM or higher CPU cycles? For example, let us assume that the application that you want to deploy contains a front-end service and a back-end service. The front-end service can run on smaller VMs (VM sizes like D2) that have ports open to the internet.  The back-end service, however, is computation intensive and needs to run on larger VMs (with VM sizes like D4, D6, D15) that are not internet facing.
  
  In this example, although you can decide to put all the services on one node type, we recommended that you place them in a cluster with two node types.  This allows each node type to have distinct properties such as internet connectivity or VM size. The number of VMs can be scaled independently, as well.  
* Because you cannot predict the future, go with facts you know, and choose the number of node types that your applications need to start with. You can always add or remove node types later. A Service Fabric cluster must have at least one node type.

## The properties of each node type
The **node type** can be seen as equivalent to roles in Cloud Services. Node types define the VM sizes, the number of VMs, and their properties. Every node type that is defined in a Service Fabric cluster maps to a [virtual machine scale set](https://docs.microsoft.com/azure/virtual-machine-scale-sets/overview).  
Each node type is a distinct scale set and can be scaled up or down independently, have different sets of ports open, and have different capacity metrics. For more information about the relationships between node types and virtual machine scale sets, how to RDP into one of the instances, how to open new ports, and so on, see [Service Fabric cluster node types](service-fabric-cluster-nodetypes.md).

A Service Fabric cluster can consist of more than one node type. In that event, the cluster consists of one primary node type and one or more non-primary node types.

A single node type cannot reliably scale beyond 100 nodes per virtual machine scale set for SF applications; achieving greater than 100 nodes reliably, will require you to add additional virtual machine scale sets.

### Primary node type

The Service Fabric system services (for example, the Cluster Manager service or Image Store service) are placed on the primary node type. 

![Screen shot of a cluster that has two Node Types][SystemServices]

* The **minimum size of VMs** for the primary node type is determined by the **durability tier** you choose. The default durability tier is Bronze. See [The durability characteristics of the cluster](https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-capacity#the-durability-characteristics-of-the-cluster) for more details.  
* The **minimum number of VMs** for the primary node type is determined by the **reliability tier** you choose. The default reliability tier is Silver. See [The reliability characteristics of the cluster](https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-capacity#the-reliability-characteristics-of-the-cluster) for more details.  

From the Azure Resource Manager template, the primary node type is configured with the `isPrimary` attribute under the [node type definition](https://docs.microsoft.com/azure/templates/microsoft.servicefabric/clusters#nodetypedescription-object).

### Non-primary node type

In a cluster with multiple node types, there is one primary node type and the rest are non-primary.

* The **minimum size of VMs** for non-primary node types is determined by the **durability tier** you choose. The default durability tier is Bronze. See [The durability characteristics of the cluster](https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-capacity#the-durability-characteristics-of-the-cluster) for more details.  
* The **minimum number of VMs** for non-primary node types is one. However, you should choose this number based on the number of replicas of the application/services that you want to run in this node type. The number of VMs in a node type can be increased after you have deployed the cluster.

## The durability characteristics of the cluster
The durability tier is used to indicate to the system the privileges that your VMs have with the underlying Azure infrastructure. In the primary node type, this privilege allows Service Fabric to pause any VM level infrastructure request (such as a VM reboot, VM reimage, or VM migration) that impact the quorum requirements for the system services and your stateful services. In the non-primary node types, this privilege allows Service Fabric to pause any VM level infrastructure requests (such as VM reboot, VM reimage, and VM migration) that impact the quorum requirements for your stateful services.

| Durability tier  | Required minimum number of VMs | Supported VM SKUs                                                                  | Updates you make to your VMSS                               | Updates and maintenance initiated by Azure                                                              | 
| ---------------- |  ----------------------------  | ---------------------------------------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Gold             | 5                              | Full-node SKUs dedicated to a single customer (for example, L32s, GS5, G5, DS15_v2, D15_v2) | Can be delayed until approved by the Service Fabric cluster | Can be paused for 2 hours per UD to allow additional time for replicas to recover from earlier failures |
| Silver           | 5                              | VMs of single core or above                                                        | Can be delayed until approved by the Service Fabric cluster | Cannot be delayed for any significant period of time                                                    |
| Bronze           | 1                              | All                                                                                | Will not be delayed by the Service Fabric cluster           | Cannot be delayed for any significant period of time                                                    |

> [!WARNING]
> Node types running with Bronze durability obtain _no privileges_. This means that infrastructure jobs that impact your stateless workloads will not be stopped or delayed, which might impact your workloads. Use only Bronze for node types that run only stateless workloads. For production workloads, running Silver or above is recommended. 

> Regardless of any durability level, [Deallocation](https://docs.microsoft.com/en-us/rest/api/compute/virtualmachinescalesets/deallocate) operation on VM Scale Set will destroy the cluster

**Advantages of using Silver or Gold durability levels**
 
- Reduces the number of required steps in a scale-in operation (that is, node deactivation and Remove-ServiceFabricNodeState is called automatically).
- Reduces the risk of data loss due to a customer-initiated in-place VM SKU change operation or Azure infrastructure operations.

**Disadvantages of using Silver or Gold durability levels**
 
- Deployments to your virtual machine scale set and other related Azure resources can be delayed, can time out, or can be blocked entirely by problems in your cluster or at the infrastructure level. 
- Increases the number of [replica lifecycle events](service-fabric-reliable-services-lifecycle.md) (for example, primary swaps) due to automated node deactivations during Azure infrastructure operations.
- Takes nodes out of service for periods of time while Azure platform software updates or hardware maintenance activities are occurring. You may see nodes with status Disabling/Disabled during these activities. This reduces the capacity of your cluster temporarily, but should not impact the availability of your cluster or applications.

### Recommendations for when to use Silver or Gold durability levels

Use Silver or Gold durability for all node types that host stateful services you expect to scale-in (reduce VM instance count) frequently, and you would prefer that deployment operations be delayed and capacity to be reduced in favor of simplifying these scale-in operations. The scale-out scenarios (adding VMs instances) do not play into your choice of the durability tier, only scale-in does.

### Changing durability levels
- Node types with durability levels of Silver or Gold cannot be downgraded to Bronze.
- Upgrading from Bronze to Silver or Gold can take a few hours.
- When changing durability level, be sure to update it in both the Service Fabric extension configuration in your virtual machine scale set resource, and in the node type definition in your Service Fabric cluster resource. These values must match.

### Operational recommendations for the node type that you have set to silver or gold durability level.

- Keep your cluster and applications healthy at all times, and make sure that applications respond to all [Service replica lifecycle events](service-fabric-reliable-services-lifecycle.md) (like replica in build is stuck) in a timely fashion.
- Adopt safer ways to make a VM SKU change (Scale up/down): Changing the VM SKU of a virtual machine scale set is inherently an unsafe operation and so should be avoided if possible. Here is the process you can follow to avoid common issues.
	- **For non-primary node types:** It is recommended that you create new virtual machine scale set, modify the service placement constraint to include the new virtual machine scale set/node type and then reduce the old virtual machine scale set instance count to 0, one node at a time (this is to make sure that removal of the nodes do not impact the reliability of the cluster).
	- **For the primary node type:** Our recommendation is that you do not change VM SKU of the primary node type. Changing of the primary node type SKU is not supported. If the reason for the new SKU is capacity, we recommend adding more instances. If that not possible, create a new cluster and [restore application state](service-fabric-reliable-services-backup-restore.md) (if applicable) from your old cluster. You do not need to restore any system service state, they are recreated when you deploy your applications to your new cluster. If you were just running stateless applications on your cluster, then all you do is deploy your applications to the new cluster, you have nothing to restore. If you decide to go the unsupported route and want to change the VM SKU, then make modifications to the virtual machine scale set Model definition to reflect the new SKU. If your cluster has only one node type, then make sure that all your stateful applications respond to all [Service replica lifecycle events](service-fabric-reliable-services-lifecycle.md) (like replica in build is stuck) in a timely fashion and that your service replica rebuild duration is less than five minutes (for Silver durability level). 
	
- Maintain a minimum count of five nodes for any virtual machine scale set that has durability level of Gold or Silver enabled.
- Each VM scale set with durability level Silver or Gold must map to its own node type in the Service Fabric cluster. Mapping multiple VM scale sets to a single node type will prevent coordination between the Service Fabric cluster and the Azure infrastructure from working properly.
- Do not delete random VM instances, always use virtual machine scale set scale down feature. The deletion of random VM instances has a potential of creating imbalances in the VM instance spread across UD and FD. This imbalance could adversely affect the systems ability to properly load balance amongst the service instances/Service replicas.
- If using Autoscale, then set the rules such that scale in (removing of VM instances) are done only one node at a time. Scaling down more than one instance at a time is not safe.
- If deleting or deallocating VMs on the primary node type, you should never reduce the count of allocated VMs below what the reliability tier requires. These operations will be blocked indefinitely in a scale set with a durability level of Silver or Gold.

## The reliability characteristics of the cluster
The reliability tier is used to set the number of replicas of the system services that you want to run in this cluster on the primary node type. The more the number of replicas, the more reliable the system services are in your cluster.  

The reliability tier can take the following values:

* Platinum - Run the System services with a target replica set count of nine
* Gold - Run the System services with a target replica set count of seven
* Silver - Run the System services with a target replica set count of five 
* Bronze - Run the System services with a target replica set count of three

> [!NOTE]
> The reliability tier you choose determines the minimum number of nodes your primary node type must have. 
> 
> 

### Recommendations for the reliability tier

When you increase or decrease the size of your cluster (the sum of VM instances in all node types), you must update the reliability of your cluster from one tier to another. Doing this triggers the cluster upgrades needed to change the system services replica set count. Wait for the upgrade in progress to complete before making any other changes to the cluster, like adding nodes.  You can monitor the progress of the upgrade on Service Fabric Explorer or by running [Get-ServiceFabricClusterUpgrade](/powershell/module/servicefabric/get-servicefabricclusterupgrade?view=azureservicefabricps)

Here is the recommendation on choosing the reliability tier.

| **Cluster Size** | **Reliability Tier** |
| --- | --- |
| 1 |Do not specify the Reliability Tier parameter, the system calculates it |
| 3 |Bronze |
| 5 or 6|Silver |
| 7 or 8 |Gold |
| 9 and up |Platinum |

## Primary node type - capacity guidance

Here is the guidance for planning the primary node type capacity:

- **Number of VM instances to run any production workload in Azure:** You must specify a minimum Primary Node type size of 5 and a Reliability Tier of Silver.  
- **Number of VM instances to run test workloads in Azure** You can specify a minimum primary node type size of 1 or 3. The one node cluster, runs with a special configuration and so, scale out of that cluster is not supported. The one node cluster, has no reliability and so in your Resource Manager template, you have to remove/not specify that configuration (not setting the configuration value is not enough). If you set up the one node cluster set up via portal, then the configuration is automatically taken care of. One and three node clusters are not supported for running production workloads. 
- **VM SKU:** Primary node type is where the system services run, so the VM SKU you choose for it, must take into account the overall peak load you plan to place into the cluster. Here is an analogy to illustrate what I mean here - Think of the primary node type as your "Lungs", it is what provides oxygen to your brain, and so if the brain does not get enough oxygen, your body suffers. 

Since the capacity needs of a cluster is determined by workload you plan to run in the cluster, we cannot provide you with qualitative guidance for your specific workload, however here is the broad guidance to help you get started

For production workloads: 

- It's recommended to dedicate your clusters primary NodeType to system services, and use placement constraints to deploy your application to secondary NodeTypes.
- The recommended VM SKU is Standard D3 or Standard D3_V2 or equivalent with a minimum of 14 GB of local SSD.
- The minimum supported use VM SKU is Standard D1 or Standard D1_V2 or equivalent with a minimum of 14 GB of local SSD. 
- The 14 GB local SSD is a minimum requirement. Our recommendation is a minimum of 50 GB. For your workloads, especially when running Windows containers, larger disks are required. 
- Partial core VM SKUs like Standard A0 are not supported for production workloads.
- Standard A1 SKU is not supported for production workloads for performance reasons.
- Low-priority VMs are not supported.

> [!WARNING]
> Changing the primary node VM SKU size on a running cluster, is a scaling operation, and documented in [Virtual Machine Scale Set scale out](virtual-machine-scale-set-scale-node-type-scale-out.md) documentation.

## Non-primary node type - capacity guidance for stateful workloads

This guidance is for stateful Workloads using Service fabric [reliable collections or reliable Actors](service-fabric-choose-framework.md) that you are running in the non-primary node type.

**Number of VM instances:** For production workloads that are stateful, it is recommended that you run them with a minimum and target replica count of 5. This means that in steady state you end up with a replica (from a replica set) in each fault domain and upgrade domain. The whole reliability tier concept for the primary node type is a way to specify this setting for system services. So the same consideration applies to your stateful services as well.

So for production workloads, the minimum recommended non-Primary Node type size is 5, if you are running stateful workloads in it.

**VM SKU:** This is the node type where your application services are running, so the VM SKU you choose for it, must take into account the peak load you plan to place into each Node. The capacity needs of the nodetype, is determined by workload you plan to run in the cluster, so we cannot provide you with qualitative guidance for your specific workload, however here is the broad guidance to help you get started

For production workloads 

- The recommended VM SKU is Standard D3 or Standard D3_V2 or equivalent with a minimum of 14 GB of local SSD.
- The minimum supported use VM SKU is Standard D1 or Standard D1_V2 or equivalent with a minimum of 14 GB of local SSD. 
- Partial core VM SKUs like Standard A0 are not supported for production workloads.
- Standard A1 SKU is specifically not supported for production workloads for performance reasons.

## Non-primary node type - capacity guidance for stateless workloads

This guidance of stateless Workloads that you are running on the non-primary nodetype.

**Number of VM instances:** For production workloads that are stateless, the minimum supported non-Primary Node type size is 2. This allows you to run you two stateless instances of your application and allowing your service to survive the loss of a VM instance. 

**VM SKU:** This is the node type where your application services are running, so the VM SKU you choose for it, must take into account the peak load you plan to place into each Node. The capacity needs of the node type, is determined by workload you plan to run in the cluster, So we cannot provide you with qualitative guidance for your specific workload, however here is the broad guidance to help you get started

For production workloads 

- The recommended VM SKU is Standard D3 or Standard D3_V2 or equivalent. 
- The minimum supported use VM SKU is Standard D1 or Standard D1_V2 or equivalent. 
- Partial core VM SKUs like Standard A0 are not supported for production workloads.
- Standard A1 SKU is not supported for production workloads for performance reasons.

<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->

## Next steps
Once you finish your capacity planning and set up a cluster, read the following:

* [Service Fabric cluster security](service-fabric-cluster-security.md)
* [Service Fabric cluster scaling](service-fabric-cluster-scaling.md)
* [Disaster recovery planning](service-fabric-disaster-recovery.md)
* [Relationship of Nodetypes to virtual machine scale set](service-fabric-cluster-nodetypes.md)

<!--Image references-->
[SystemServices]: ./media/service-fabric-cluster-capacity/SystemServices.png

---
title: Service Fabric cluster capacity planning considerations
description: Node types, durability, reliability, and other things to consider when planning your Service Fabric cluster.

ms.topic: conceptual
ms.date: 05/21/2020
ms.author: pepogors
ms.custom: sfrev
---
# Service Fabric cluster capacity planning considerations

Cluster capacity planning is important for every Service Fabric production environment. Key considerations include:

* **Initial number and properties of cluster *node types***

* ***Durability* level of each node type**, which determines Service Fabric VM privileges within Azure infrastructure

* ***Reliability* level of the cluster**, which determines the stability of Service Fabric system services and overall cluster function

This article will walk you through the significant decision points for each of these areas.

## Initial number and properties of cluster node types

A *node type* defines the size, number, and properties for a set of nodes (virtual machines) in the cluster. Every node type that is defined in a Service Fabric cluster maps to a [virtual machine scale set](https://docs.microsoft.com/azure/virtual-machine-scale-sets/overview).

Because each node type is a distinct scale set, it can be scaled up or down independently, have different sets of ports open, and have different capacity metrics. For more information about the relationship between node types and virtual machine scale sets, see [Service Fabric cluster node types](service-fabric-cluster-nodetypes.md).

Each cluster requires one **primary node type**, which runs critical system services that provide Service Fabric platform capabilities. Although it's possible to also use primary node types to run your applications, it's recommended to dedicate them solely to running system services.

**Non-primary node types** can be used to define application roles (such as *front-end* and *back-end* services) and to physically isolate services within a cluster. Service Fabric clusters can have zero or more non-primary node types.

The primary node type is configured using the `isPrimary` attribute under the node type definition in the Azure Resource Manager deployment template. See the [NodeTypeDescription object](https://docs.microsoft.com/azure/templates/microsoft.servicefabric/clusters#nodetypedescription-object) for the full list of node type properties. For example usage, open any *AzureDeploy.json* file in [Service Fabric cluster samples](https://github.com/Azure-Samples/service-fabric-cluster-templates/tree/master/) and *Find on Page* search for the `nodetTypes` object.

### Node type planning considerations

The number of initial nodes types depends upon the purpose of you cluster and the applications and services running on it. Consider the following questions:

* ***Does your application have multiple services, and do any of them need to be public or internet facing?***

    Typical applications contain a front-end gateway service that receives input from a client, and one or more back-end services that communicate with the front-end services, with separate networking between the front-end and back-end services. These cases typically require three node types: one primary node type, and two non-primary node types (one each for the front and back-end service).

* ***Do the services that make up your application have different infrastructure needs such as greater RAM or higher CPU cycles?***

    Often, front-end service can run on smaller VMs (VM sizes like D2) that have ports open to the internet.  Computationally intensive back-end services might need to run on larger VMs (with VM sizes like D4, D6, D15) that are not internet-facing. Defining different node types for these services allow you to make more efficient and secure use of underlying Service Fabric VMs, and enables them to scale them independently. For more on estimating the amount of resources you'll need, see [Capacity planning for Service Fabric applications](service-fabric-capacity-planning.md)

* ***Will any of your application services need to scale out beyond 100 nodes?***

    A single node type can't reliably scale beyond 100 nodes per virtual machine scale set for Service Fabric applications. Running more than 100 nodes requires additional virtual machine scale sets (and therefore additional node types).

* ***Will your cluster span across Availability Zones?***

    Service Fabric supports clusters that span across [Availability Zones](../availability-zones/az-overview.md) by deploying node types that are pinned to specific zones, ensuring high-availability of your applications. Availability Zones require additional node type planning and minimum requirements. For details, see [Recommended topology for primary node type of Service Fabric clusters spanning across Availability Zones](service-fabric-cross-availability-zones.md#recommended-topology-for-primary-node-type-of-azure-service-fabric-clusters-spanning-across-availability-zones). 

When determining the number and properties of node types for the initial creation of your cluster, keep in mind that you can always add, modify, or remove (non-primary) node types once your cluster is deployed. [Primary node types can also be modified](service-fabric-scale-up-node-type.md) in running clusters (though such operations require a great deal of planning and caution in production environments).

A further consideration for your node type properties is durability level, which determines privileges a node type's VMs have within Azure infrastructure. Use the size of VMs you choose for your cluster and the instance count you assign for individual node types to help determine the appropriate durability tier for each of your node types, as described next.

## Durability characteristics of the cluster

The *durability level* designates the privileges your Service Fabric VMs have with the underlying Azure infrastructure. This privilege allows Service Fabric to pause any VM-level infrastructure request (such as reboot, reimage, or migration) that impacts the quorum requirements for Service Fabric system services and your stateful services.

> [!IMPORTANT]
> Durability level is set per node type. If there's none specified, *Bronze* tier will be used, however it doesn't provide automatic OS upgrades. *Silver* or *Gold* durability is recommended for production workloads.

The table below lists Service Fabric durability tiers, their requirements, and affordances.

| Durability tier  | Required minimum number of VMs | Supported VM Sizes                                                                  | Updates you make to your virtual machine scale set                               | Updates and maintenance initiated by Azure                                                              | 
| ---------------- |  ----------------------------  | ---------------------------------------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Gold             | 5                              | Full-node sizes dedicated to a single customer (for example, L32s, GS5, G5, DS15_v2, D15_v2) | Can be delayed until approved by the Service Fabric cluster | Can be paused for 2 hours per upgrade domain to allow additional time for replicas to recover from earlier failures |
| Silver           | 5                              | VMs of single core or above with at least 50 GB of local SSD                      | Can be delayed until approved by the Service Fabric cluster | Cannot be delayed for any significant period of time                                                    |
| Bronze          | 1                              | VMs with at least 50 GB of local SSD                                              | Will not be delayed by the Service Fabric cluster           | Cannot be delayed for any significant period of time                                                    |

> [!WARNING]
> With Bronze durability, automatic OS image upgrade isn't available. While [Patch Orchestration Application](service-fabric-patch-orchestration-application.md) (intended only for non-Azure hosted clusters) is *not recommended* for Silver or greater durability levels, it is your only option to automate Windows updates with respect to Service Fabric upgrade domains.

> [!IMPORTANT]
> Regardless of durability level, running a [Deallocation](https://docs.microsoft.com/rest/api/compute/virtualmachinescalesets/deallocate) operation on a virtual machine scale set will destroy the cluster.

### Bronze

Node types running with Bronze durability obtain no privileges. This means that infrastructure jobs that impact your stateful workloads won't be stopped or delayed. Use Bronze durability for node types that only run stateless workloads. For production workloads, running Silver or above is recommended.

### Silver and Gold

Use Silver or Gold durability for all node types that host stateful services you expect to scale-in frequently, and where you wish deployment operations be delayed and capacity to be reduced in favor of simplifying the process. Scale-out scenarios should not affect your choice of the durability tier.

#### Advantages

* Reduces number of required steps for scale-in operations (node deactivation and Remove-ServiceFabricNodeState are called automatically).
* Reduces risk of data loss due to in-place VM size change operations and Azure infrastructure operations.

#### Disadvantages

* Deployments to virtual machine scale sets and other related Azure resources can time out, be delayed, or be blocked entirely by problems in your cluster or at the infrastructure level.
* Increases the number of [replica lifecycle events](service-fabric-reliable-services-lifecycle.md) (for example, primary swaps) due to automated node deactivations during Azure infrastructure operations.
* Takes nodes out of service for periods of time while Azure platform software updates or hardware maintenance activities are occurring. You may see nodes with status Disabling/Disabled during these activities. This reduces the capacity of your cluster temporarily, but should not impact the availability of your cluster or applications.

#### Best practices for Silver and Gold durability node types

Follow these recommendations for managing node types with Silver or Gold durability:

* Keep your cluster and applications healthy at all times, and make sure that applications respond to all [Service replica lifecycle events](service-fabric-reliable-services-lifecycle.md) (like replica in build is stuck) in a timely fashion.
* Adopt safer ways to make a VM size change (scale up/down). Changing the VM size of a virtual machine scale set requires careful planning and caution. For details, see [Scale up a Service Fabric node type](service-fabric-scale-up-node-type.md)
* Maintain a minimum count of five nodes for any virtual machine scale set that has durability level of Gold or Silver enabled. Your cluster will enter error state if you scale in below this threshold, and you'll need to manually clean up state (`Remove-ServiceFabricNodeState`) for the removed nodes.
* Each virtual machine scale set with durability level Silver or Gold must map to its own node type in the Service Fabric cluster. Mapping multiple virtual machine scale sets to a single node type will prevent coordination between the Service Fabric cluster and the Azure infrastructure from working properly.
* Do not delete random VM instances, always use virtual machine scale set scale in feature. The deletion of random VM instances has a potential of creating imbalances in the VM instance spread across [upgrade domains](service-fabric-cluster-resource-manager-cluster-description.md#upgrade-domains) and [fault domains](service-fabric-cluster-resource-manager-cluster-description.md#fault-domains). This imbalance could adversely affect the systems ability to properly load balance among the service instances/Service replicas.
* If using Autoscale, set the rules such that scale in (removing of VM instances) operations are done only one node at a time. Scaling down more than one instance at a time is not safe.
* If deleting or deallocating VMs on the primary node type, never reduce the count of allocated VMs below what the reliability tier requires. These operations will be blocked indefinitely in a scale set with a durability level of Silver or Gold.

### Changing durability levels

Within certain constraints, node type durability level can be adjusted:

* Node types with durability levels of Silver or Gold can't be downgraded to Bronze.
* Upgrading from Bronze to Silver or Gold can take a few hours.
* When changing durability level, be sure to update it in both the Service Fabric extension configuration in your virtual machine scale set resource and in the node type definition in your Service Fabric cluster resource. These values must match.

Another consideration when capacity planning is the reliability level for your cluster, which determines the stability of system services and your overall cluster, as described in the next section.

## Reliability characteristics of the cluster

The cluster *reliability level* determines the number of system services replicas running on the primary node type of the cluster. The more replicas, the more reliable are the system services (and therefore the cluster as a whole).

> [!IMPORTANT]
> Reliability level is set at the cluster level and determines the minimum number of nodes of the primary node type. Production workloads require a reliability level of Silver (greater or equal to five nodes) or above.  

The reliability tier can take the following values:

* **Platinum** - System services run with target replica set count of nine
* **Gold** - System services run with target replica set count of seven
* **Silver** - System services run with target replica set count of five
* **Bronze** - System services run with target replica set count of three

Here is the recommendation on choosing the reliability tier. The number of seed nodes is also set to the minimum number of nodes for a reliability tier.


| **Number of nodes** | **Reliability Tier** |
| --- | --- |
| 1 | *Do not specify the `reliabilityLevel` parameter: the system calculates it.* |
| 3 | Bronze |
| 5 or 6| Silver |
| 7 or 8 | Gold |
| 9 and up | Platinum |

When you increase or decrease the size of your cluster (the sum of VM instances in all node types), consider updating the reliability of your cluster from one tier to another. Doing this triggers the cluster upgrades needed to change the system services replica set count. Wait for the upgrade in progress to complete before making any other changes to the cluster, like adding nodes.  You can monitor the progress of the upgrade on Service Fabric Explorer or by running [Get-ServiceFabricClusterUpgrade](/powershell/module/servicefabric/get-servicefabricclusterupgrade?view=azureservicefabricps)

### Capacity planning for reliability

The capacity needs of your cluster will be determined by your specific workload and reliability requirements. This section provides general guidance to help you get started with capacity planning.

#### Virtual machine sizing

**For production workloads, the recommended VM size (SKU) is Standard D2_V2 (or equivalent) with a minimum of 50 GB of local SSD.** A minimum of 50 GB local SSD is recommended, however some workloads (such as those running Windows containers) will require larger disks. When choosing other [VM sizes](../virtual-machines/sizes-general.md) for production workloads, keep in mind the following constraints:

- Partial core VM sizes like Standard A0 are not supported.
- *A-series* VM sizes are not supported for performance reasons.
- Low-priority VMs are not supported.

#### Primary node type

**Production workloads** on Azure require a minimum of five primary nodes (VM instances) and reliability tier of Silver. It's recommended to dedicate the cluster primary node type to system services, and use placement constraints to deploy your application to secondary node types.

**Test workloads** in Azure can run a minimum of one or three primary nodes. To configure a one node cluster, be sure that the `reliabilityLevel` setting is completely omitted in your Resource Manager template (specifying empty string value for `reliabilityLevel` is not sufficient). If you set up the one node cluster set up with Azure portal, this configuration is done automatically.

> [!WARNING]
> One-node clusters run with a special configuration without reliability and where scale out is not supported.

#### Non-primary node types

The minimum number of nodes for a non-primary node type depends on the specific [durability level](#durability-characteristics-of-the-cluster) of the node type. You should plan the number of nodes (and durability level) based on the number of replicas of applications or services that you want to run for the node type, and depending on whether the workload is stateful or stateless. Keep in mind you can increase or decrease the number of VMs in a node type anytime after you have deployed the cluster.

##### Stateful workloads

For stateful production workloads using Service Fabric [reliable collections or reliable Actors](service-fabric-choose-framework.md), a minimum and target replica count of five is recommended. With this, in steady state you end up with a replica (from a replica set) in each fault domain and upgrade domain. In general, use the reliability level you set for system services as a guide for the replica count you use for your stateful services.

##### Stateless workloads

For stateless production workloads, the minimum supported non-primary node type size is three to maintain quorum, however a node type size of five is recommended.

## Next steps

Before configuring your cluster, review the `Not Allowed` [cluster upgrade policies](service-fabric-cluster-fabric-settings.md) to mitigate having to recreate your cluster later due to otherwise unchangeable system configuration settings.

For more on cluster planning, see:

* [Compute planning and scaling](service-fabric-best-practices-capacity-scaling.md)
* [Capacity planning for Service Fabric applications](service-fabric-capacity-planning.md)
* [Disaster recovery planning](service-fabric-disaster-recovery.md)

<!--Image references-->
[SystemServices]: ./media/service-fabric-cluster-capacity/SystemServices.png

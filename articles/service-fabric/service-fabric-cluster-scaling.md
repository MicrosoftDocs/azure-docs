---
title: Azure Service Fabric cluster scaling 
description: Learn about scaling Azure Service Fabric clusters in or out and up or down. As application demands change, so can Service Fabric clusters.

ms.topic: conceptual
ms.date: 11/13/2018
ms.author: atsenthi
---
# Scaling Azure Service Fabric clusters
A Service Fabric cluster is a network-connected set of virtual or physical machines into which your microservices are deployed and managed. A machine or VM that's part of a cluster is called a node. Clusters can contain potentially thousands of nodes. After creating a Service Fabric cluster, you can scale the cluster horizontally (change the number of nodes) or vertically (change the resources of the nodes).  You can scale the cluster at any time, even when workloads are running on the cluster.  As the cluster scales, your applications automatically scale as well.

Why scale the cluster? Application demands change over time.  You may need to increase cluster resources to meet increased application workload or network traffic or decrease cluster resources when demand drops.

## Scaling in and out, or horizontal scaling
Changes the number of nodes in the cluster.  Once the new nodes join the cluster, the [Cluster Resource Manager](service-fabric-cluster-resource-manager-introduction.md) moves services to them which reduces load on the existing nodes.  You can also decrease the number of nodes if the cluster's resources are not being used efficiently.  As nodes leave the cluster, services move off those nodes and load increases on the remaining nodes.  Reducing the number of nodes in a cluster running in Azure can save you money, since you pay for the number of VMs you use and not the workload on those VMs.  

- Advantages: Infinite scale, in theory.  If your application is designed for scalability, you can enable limitless growth by adding more nodes.  The tooling in cloud environments makes it easy to add or remove nodes, so it's easy to adjust capacity and you only pay for the resources you use.  
- Disadvantages: Applications must be [designed for scalability](service-fabric-concepts-scalability.md).  Application databases and persistence may require additional architectural work to scale as well.  [Reliable collections](service-fabric-reliable-services-reliable-collections.md) in Service Fabric stateful services, however, make it much easier to scale your application data.

Virtual machine scale sets are an Azure compute resource that you can use to deploy and manage a collection of virtual machines as a set. Every node type that is defined in an Azure cluster is [set up as a separate scale set](service-fabric-cluster-nodetypes.md). Each node type can then be scaled in or out independently, have different sets of ports open, and can have different capacity metrics. 

When scaling an Azure cluster, keep the following guidelines in mind:
- primary node types running production workloads should always have five or more nodes.
- non-primary node types running stateful production workloads should always have five or more nodes.
- non-primary node types running stateless production workloads should always have two or more nodes.
- Any node type of [durability level](service-fabric-cluster-capacity.md#durability-characteristics-of-the-cluster) of Gold or Silver should always have five or more nodes.
- Do not remove random VM instances/nodes from a node type, always use the virtual machine scale set scale in feature. The deletion of random VM instances can adversely affect the systems ability to properly load balance.
- If using autoscale rules, set the rules so that scaling in (removing VM instances) is done one node at a time. Scaling down more than one instance at a time is not safe.

Since the Service Fabric node types in your cluster are made up of virtual machine scale sets at the backend, you can [set up auto-scale rules or manually scale](service-fabric-cluster-scale-in-out.md) each node type/virtual machine scale set.

### Programmatic scaling
In many scenarios, [Scaling a cluster manually or with autoscale rules](service-fabric-cluster-scale-in-out.md) are good solutions. For more advanced scenarios, though, they may not be the right fit. Potential drawbacks to these approaches include:

- Manually scaling requires you to sign in and explicitly request scaling operations. If scaling operations are required frequently or at unpredictable times, this approach may not be a good solution.
- When auto-scale rules remove an instance from a virtual machine scale set, they do not automatically remove knowledge of that node from the associated Service Fabric cluster unless the node type has a durability level of Silver or Gold. Because auto-scale rules work at the scale set level (rather than at the Service Fabric level), auto-scale rules can remove Service Fabric nodes without shutting them down gracefully. This rude node removal will leave 'ghost' Service Fabric node state behind after scale-in operations. An individual (or a service) would need to periodically clean up removed node state in the Service Fabric cluster.
- A node type with a durability level of Gold or Silver automatically cleans up removed nodes, so no additional clean-up is needed.
- Although there are [many metrics](../azure-monitor/platform/autoscale-common-metrics.md) supported by auto-scale rules, it is still a limited set. If your scenario calls for scaling based on some metric not covered in that set, then auto-scale rules may not be a good option.

How you should approach Service Fabric scaling depends on your scenario. If scaling is uncommon, the ability to add or remove nodes manually is probably sufficient. For more complex scenarios, auto-scale rules and SDKs exposing the ability to scale programmatically offer powerful alternatives.

Azure APIs exist which allow applications to programmatically work with virtual machine scale sets and Service Fabric clusters. If existing auto-scale options don't work for your scenario, these APIs make it possible to implement custom scaling logic. 

One approach to implementing this 'home-made' auto-scaling functionality is to add a new stateless service to the Service Fabric application to manage scaling operations. Creating your own scaling service provides the highest degree of control and customizability over your application's scaling behavior. This can be useful for scenarios requiring precise control over when or how an application scales in or out. However, this control comes with a tradeoff of code complexity. Using this approach means that you need to own scaling code, which is non-trivial. Within the service's `RunAsync` method, a set of triggers can determine if scaling is required (including checking parameters such as maximum cluster size and scaling cooldowns).   

The API used for virtual machine scale set interactions (both to check the current number of virtual machine instances and to modify it) is the [fluent Azure Management Compute library](https://www.nuget.org/packages/Microsoft.Azure.Management.Compute.Fluent/). The fluent compute library provides an easy-to-use API for interacting with virtual machine scale sets.  To interact with the Service Fabric cluster itself, use [System.Fabric.FabricClient](/dotnet/api/system.fabric.fabricclient).

The scaling code doesn't need to run as a service in the cluster to be scaled, though. Both `IAzure` and `FabricClient` can connect to their associated Azure resources remotely, so the scaling service could easily be a console application or Windows service running from outside the Service Fabric application.

Based on these limitations, you may wish to [implement more customized automatic scaling models](service-fabric-cluster-programmatic-scaling.md).

## Scaling up and down, or vertical scaling 
Changes the resources (CPU, memory, or storage) of nodes in the cluster.
- Advantages: Software and application architecture stays the same.
- Disadvantages: Finite scale, since there is a limit to how much you can increase resources on individual nodes. Downtime, because you will need to take physical or virtual machines offline in order to add or remove resources.

Virtual machine scale sets are an Azure compute resource that you can use to deploy and manage a collection of virtual machines as a set. Every node type that is defined in an Azure cluster is [set up as a separate scale set](service-fabric-cluster-nodetypes.md). Each node type can then be managed separately.  Scaling a node type up or down involves the addition of a new node type (with updated VM SKU) and removal of the old node type.

When scaling an Azure cluster, keep the following guideline in mind:
- If scaling down a primary node type, you should never scale it down more than what the [reliability tier](service-fabric-cluster-capacity.md#reliability-characteristics-of-the-cluster) allows.

The process of scaling a node type up or down is different depending on whether it is a non-primary or primary node type.

### Scaling non-primary node types
Create a new node type with the resources you need.  Update the placement constraints of running services to include the new node type.  Gradually (one at a time), reduce the instance count of the old node type instance count to zero so that the reliability of the cluster is not affected.  Services will gradually migrate to the new node type as the old node type is decommissioned.

### Scaling the primary node type
Deploy a new primary node type with updated VM SKU, then disable the original primary node type instances one at a time so that the system services migrate to the new scale set. Verify the cluster and new nodes are healthy, then remove the original scale set and node state for the deleted nodes.

If that not possible, you can create a new cluster and [restore application state](service-fabric-reliable-services-backup-restore.md) (if applicable) from your old cluster. You do not need to restore any system service state, they are recreated when you deploy your applications to your new cluster. If you were just running stateless applications on your cluster, then all you do is deploy your applications to the new cluster, you have nothing to restore.

## Next steps
* Learn about [application scalability](service-fabric-concepts-scalability.md).
* [Scale an Azure cluster in or out](service-fabric-tutorial-scale-cluster.md).
* [Scale an Azure cluster programmatically](service-fabric-cluster-programmatic-scaling.md) using the fluent Azure compute SDK.
* [Scale a standalone cluster in or out](service-fabric-cluster-windows-server-add-remove-nodes.md).


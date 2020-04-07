---
title: Plan an Azure Service Fabric cluster deployment 
description: Learn about planning and preparing for a production Service Fabric cluster deployment to Azure.

ms.topic: conceptual
ms.date: 03/20/2019
---
# Plan and prepare for a cluster deployment

Planning and preparing for a production cluster deployment is very important.  There are many factors to consider.  This article walks you through the steps of preparing your cluster deployment.

## Read the best-practices information
To manage Azure Service Fabric applications and clusters successfully, there are operations that we highly recommend you perform to optimize the reliability of your production environment.  For more information, read [Service Fabric application and cluster best practices](service-fabric-best-practices-overview.md).

## Select the OS for the cluster
Service Fabric allows for the creation of Service Fabric clusters on any VMs or computers running Windows Server or Linux.  Before deploying your cluster, you must choose the OS:  Windows or Linux.  Every node (virtual machine) in the cluster runs the same OS, you cannot mix Windows and Linux VMs in the same cluster.

## Capacity planning
For any production deployment, capacity planning is an important step. Here are some things to consider as a part of that process.

* The initial number of node types for your cluster 
* The properties of each of node type (size, number of instances, primary, internet facing, number of VMs, etc.)
* The reliability and durability characteristics of the cluster

### Select the initial number of node types
First, you need to figure out what the cluster you are creating is going to be used for. What kinds of applications you are planning to deploy into this cluster? Does your application have multiple services, and do any of them need to be public or internet facing? Do your services (that make up your application) have different infrastructure needs such as greater RAM or higher CPU cycles? A Service Fabric cluster can consist of more than one node type: a primary node type and one or more non-primary node types. Each node type is mapped to a virtual machine scale set. Each node type can then be scaled up or down independently, have different sets of ports open, and can have different capacity metrics. [Node properties and placement constraints][placementconstraints] can be set up to constrain specific services to specific node types.  For more information, read [The number of node types your cluster needs to start out with](service-fabric-cluster-capacity.md#the-number-of-node-types-your-cluster-needs-to-start-out-with).

### Select node properties for each node type
Node types define the VM SKU, number, and properties of the VMs in the associated scale set.

The minimum size of VMs for each node type is determined by the [durability tier][durability] you choose for the node type.

The minimum number of VMs for the primary node type is determined by the [reliability tier][reliability] you choose.

See the minimum recommendations for [primary node types](service-fabric-cluster-capacity.md#primary-node-type---capacity-guidance), [stateful workloads on non-primary node types](service-fabric-cluster-capacity.md#non-primary-node-type---capacity-guidance-for-stateful-workloads), and [stateless workloads on non-primary node types](service-fabric-cluster-capacity.md#non-primary-node-type---capacity-guidance-for-stateless-workloads).

Any more than the minimum number of nodes should be based on the number of replicas of the application/services that you want to run in this node type.  [Capacity planning for Service Fabric applications](service-fabric-capacity-planning.md) helps you estimate the resources you need to run your applications. You can always scale the cluster up or down later to adjust for changing application workload. 

#### Use ephemeral OS disks for virtual machine scale sets

*Ephemeral OS disks* are storage created on the local virtual machine (VM), and not saved to remote Azure Storage. They are recommended for all Service Fabric node types (Primary and Secondary), because compared to traditional persistent OS disks, ephemeral OS disks:

* Reduce read/write latency to OS disk
* Enable faster reset/reimage node management operations
* Reduce overall costs (the disks are free and incur no additional storage cost)

Ephemeral OS disks is not a specific Service Fabric feature, but rather a feature of the Azure *virtual machine scale sets* that are mapped to Service Fabric node types. Using them with Service Fabric requires the following in your cluster Azure Resource Manager template:

1. Ensure your node types specify [supported Azure VM sizes](../virtual-machines/windows/ephemeral-os-disks.md) for  Ephemeral OS disks, and that the VM size has sufficient cache size to support its OS disk size (see *Note* below.) For example:

    ```xml
    "vmNodeType1Size": {
        "type": "string",
        "defaultValue": "Standard_DS3_v2"
    ```

    > [!NOTE]
    > Be sure to select a VM size with a cache size equal or greater than the OS disk size of the VM itself, otherwise your Azure deployment might result in error (even if it's initially accepted).

2. Specify a virtual machine scale set version (`vmssApiVersion`) of `2018-06-01` or later:

    ```xml
    "variables": {
        "vmssApiVersion": "2018-06-01",
    ```

3. In the virtual machine scale set section of your deployment template, specify `Local` option for `diffDiskSettings`:

    ```xml
    "apiVersion": "[variables('vmssApiVersion')]",
    "type": "Microsoft.Compute/virtualMachineScaleSets",
        "virtualMachineProfile": {
            "storageProfile": {
                "osDisk": {
                        "caching": "ReadOnly",
                        "createOption": "FromImage",
                        "diffDiskSettings": {
                            "option": "Local"
                        },
                }
            }
        }
    ```

> [!NOTE]
> User applications should not have any dependency/file/artifact on the OS disk, as the OS disk would be lost in the case of an OS upgrade.
> Hence, it is not recommended to use [PatchOrchestrationApplication](https://github.com/microsoft/Service-Fabric-POA) with ephemeral disks.
>

> [!NOTE]
> Existing non-ephemeral VMSS can't be upgraded in-place to use ephemeral disks.
> To migrate, users will have to [add](./virtual-machine-scale-set-scale-node-type-scale-out.md) a new nodeType with ephemeral disks, move the workloads to the new nodeType & [remove](./service-fabric-how-to-remove-node-type.md) the existing nodeType.
>

For more info and further configuration options, see [Ephemeral OS disks for Azure VMs](../virtual-machines/windows/ephemeral-os-disks.md) 


### Select the durability and reliability levels for the cluster
The durability tier is used to indicate to the system the privileges that your VMs have with the underlying Azure infrastructure. In the primary node type, this privilege allows Service Fabric to pause any VM level infrastructure request (such as a VM reboot, VM reimage, or VM migration) that impact the quorum requirements for the system services and your stateful services. In the non-primary node types, this privilege allows Service Fabric to pause any VM level infrastructure requests (such as VM reboot, VM reimage, and VM migration) that impact the quorum requirements for your stateful services.  For advantages of the different levels and recommendations on which level to use and when, see [The durability characteristics of the cluster][durability].

The reliability tier is used to set the number of replicas of the system services that you want to run in this cluster on the primary node type. The more the number of replicas, the more reliable the system services are in your cluster.  For advantages of the different levels and recommendations on which level to use and when, see [The reliability characteristics of the cluster][reliability]. 

## Enable reverse proxy and/or DNS
Services connecting to each other inside a cluster generally can directly access the endpoints of other services because the nodes in a cluster are on the same local network. To make it easier to connect between services, Service Fabric provides additional services: A [DNS service](service-fabric-dnsservice.md) and a [reverse proxy service](service-fabric-reverseproxy.md).  Both services can be enabled when deploying a cluster.

Since many services, especially containerized services, can have an existing URL name, being able to resolve these using the standard DNS protocol (rather than the Naming Service protocol) is convenient, especially in application "lift and shift" scenarios. This is exactly what the DNS service does. It enables you to map DNS names to a service name and hence resolve endpoint IP addresses.

The reverse proxy addresses services in the cluster that expose HTTP endpoints (including HTTPS). The reverse proxy greatly simplifies calling other services by providing a specific URI format.  The reverse proxy also handles the resolve, connect, and retry steps required for one service to communicate with another.

## Prepare for disaster recovery
A critical part of delivering high-availability is ensuring that services can survive all different types of failures. This is especially important for failures that are unplanned and outside of your control. [Prepare for disaster recovery](service-fabric-disaster-recovery.md) describes some common failure modes that could be disasters if not modeled and managed correctly. It also discusses mitigations and actions to take if a disaster happened anyway.

## Production readiness checklist
Is your application and cluster ready to take production traffic? Before deploying your cluster to production, run through the [Production readiness checklist](service-fabric-production-readiness-checklist.md). Keep your application and cluster running smoothly by working through the items in this checklist. We strongly recommend all these items to be checked off before going into production.

## Next steps
* [Create a Service Fabric cluster running Windows](service-fabric-best-practices-overview.md)
* [Create a Service Fabric cluster running Linux](service-fabric-tutorial-create-vnet-and-linux-cluster.md)

[placementconstraints]: service-fabric-cluster-resource-manager-cluster-description.md#node-properties-and-placement-constraints
[durability]: service-fabric-cluster-capacity.md#the-durability-characteristics-of-the-cluster
[reliability]: service-fabric-cluster-capacity.md#the-reliability-characteristics-of-the-cluster
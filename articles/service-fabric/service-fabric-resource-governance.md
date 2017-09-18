---
title: Azure Service Fabric Resource Governance for Containers and Services | Microsoft Docs
description: Azure Service Fabric allows you to specify resource limits for services running inside or outside containers.
services: service-fabric
documentationcenter: .net
author: masnider
manager: timlt
editor: ''

ms.assetid: ab49c4b9-74a8-4907-b75b-8d2ee84c6d90
ms.service: service-fabric
ms.devlang: dotNet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 8/9/2017
ms.author: subramar
---

# Resource governance 

When running multiple services on the same node or cluster, it is possible that one service might consume more resources starving other services. This problem is referred to as the noisy-neighbor problem. Service Fabric allows the developer to specify reservations and limits per service to guarantee resources and also limit its resource usage.

>
> Before proceeding with this article, you should get familiar [Service Fabric Application Model](service-fabric-application-model.md) and with [Service Fabric Hosting Model](service-fabric-hosting-model.md).
>

## Resource governance metrics 

Resource governance is supported in Service Fabric per [Service Package](service-fabric-application-model.md). The resources that are assigned to Service Package can be further divided between code packages. The resource limits specified also mean the reservation of the resources. Service Fabric supports specifying CPU and Memory per service package, using two built-in [metrics](service-fabric-cluster-resource-manager-metrics.md):

* CPU (metric name `servicefabric:/_CpuCores`): A core is a logical core that is available on the host machine, and all cores across all nodes are weighted the same.
* Memory (metric name `servicefabric:/_MemoryInMB`): Memory is expressed in megabytes, and it maps to physical memory that is available on the machine.

For these two metrics, the [Cluster Resource Manager](service-fabric-cluster-resource-manager-cluster-description.md) tracks total cluster capacity, the load on each node in the cluster, and, remaining resources in the cluster. These two metrics are equivalent to any other user or custom metric and all existing features can be used with them:
* Cluster can be [balanced](service-fabric-cluster-resource-manager-balancing.md) according to these two metrics (default behavior).
* Cluster can be [defragmented](service-fabric-cluster-resource-manager-defragmentation-metrics.md) according to these two metrics.
* When [describing a cluster](service-fabric-cluster-resource-manager-cluster-description.md), buffered capacity can be set for these two metrics.

[Dynamic load reporting](service-fabric-cluster-resource-manager-metrics.md) is not supported for these metrics, and loads for these metrics are defined at creation time.

## Resource Governance Mechanism

The Service Fabric runtime currently does not provide reservation for resources. When a process or a container is opened, runtime will set the resource limits to the loads that were defined at creation time. Furthermore, the runtime will reject opening of new service packages available resources are exceeded. To better understand how the process works, let's take an example of a node with 2 CPU cores (mechanism for memory governance is equivalent):

1. First, a container is placed on the node, requesting 1 CPU core. The runtime will open the container, and will set the CPU limit to 1 core. Container will not be able to use more than 1 core.
2. Then, a replica of service is placed on the node, and the corresponding service package specifies a limit of 1 CPU core. The runtime will open the code package, and will set its CPU limit to 1 core.

At this point, the sum of limits is equal to the capacity of the node, and a process and a container are running with 1 core each and not interfering with each other. Service Fabric will not place any more containers or replicas in case when they are specifying CPU limit. However,  there are two situations in which other processes may contend for CPU, and a process and a container from our example may experience the noisy neighbor problem:

* Mixing governed and non-governed services and containers: If user creates a service without any resource governance specified, the runtime will consider it as if it was consuming no resources, and will be able to place it on the node in our example. In this case, this new process will effectively consume some CPU at the expense of the services that are already running on the node. The solution to this problem is either not to mix governed and non-governed services in the same cluster, or to use [placement constraints](service-fabric-cluster-resource-manager-advanced-placement-rules-placement-policies.md) so that they do not end up on the same set of nodes.
* In case when another process is started on the node, outside of Service Fabric (for example, some OS service), that process will also contend for CPU with existing services. The solution to this problem is to set up node capacities correctly to account for OS overhead, as shown in the next section.

## Cluster set up for enabling resource governance

When node starts and joins the cluster, Service Fabric will detect the available amount of memory and available number of cores, and will set the node capacities for those two resources. In order ot leave some buffer space for the Operating System, and for other processes that could be running on the node, Service Fabric will use only 80% of the available resources on the node. This percentage is configurable, and can be changed in the cluster manifest. Here is an example of how to instruct Service Fabric to use 50% of available CPU and 70% of available memory: 

```xml
<Section Name="PlacementAndLoadBalancing">
    <!-- 0.0 means 0%, and 1.0 means 100%-->
    <Parameter Name="CpuPercentageNodeCapacity" Value="0.5" />
    <Parameter Name="MemoryPercentageNodeCapacity" Value="0.7" />
</Section>
```

In case that a full manual setup of node capacities is needed, that is also possible using the regular mechanism for describing the nodes in the cluster. Here is an example of setting up the node with 4 cores and 2 GB of memory: 

```xml
    <NodeType Name="MyNodeType">
      <Capacities>
        <Capacity Name="servicefabric:/_CpuCores" Value="4"/>
        <Capacity Name="servicefabric:/_MemoryInMB" Value="2048"/>
      </Capacities>
    </NodeType>
```

When auto detection of available resources is enabled, and node capacities are manually defined in the cluster manifest, Service Fabric will check if node has enough resources to support the capacity that user has defined:
* If node capacities that are defined in the manifest are less than or equal to the available resources on the node then Service Fabric will use the capacities that are specified in the manifest.
* If node capacities that are defined in the manifest are greater than available resources, Service Fabric will use the available resources as node capacities.

Auto detection of available resources can be completely turned off in case that it is not required by changing the following setting:

```xml
<Section Name="PlacementAndLoadBalancing">
    <Parameter Name="AutoDetectAvailableResources" Value="false" />
</Section>
```

For optimal performance, the following setting should also be turned on in the cluster manifest: 

```xml
<Section Name="PlacementAndLoadBalancing">
    <Parameter Name="PreventTransientOvercommit" Value="true" /> 
    <Parameter Name="AllowConstraintCheckFixesDuringApplicationUpgrade" Value="true" />
</Section>
```


## Specifying resource governance 

Resource governance limits are specified in the application manifest (ServiceManifestImport section) as shown in the following example:

```xml
<?xml version='1.0' encoding='UTF-8'?>
<ApplicationManifest ApplicationTypeName='TestAppTC1' ApplicationTypeVersion='vTC1' xsi:schemaLocation='http://schemas.microsoft.com/2011/01/fabric ServiceFabricServiceModel.xsd' xmlns='http://schemas.microsoft.com/2011/01/fabric' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance'>
  <Parameters>
  </Parameters>
  <!--
  ServicePackageA has the number of CPU cores defined, but doesn't have the MemoryInMB defined.
  In this case, Service Fabric will sum the limits on code packages and uses the sum as 
  the overall ServicePackage limit.
  -->
  <ServiceManifestImport>
    <ServiceManifestRef ServiceManifestName='ServicePackageA' ServiceManifestVersion='v1'/>
    <Policies>
      <ServicePackageResourceGovernancePolicy CpuCores="1"/>
      <ResourceGovernancePolicy CodePackageRef="CodeA1" CpuShares="512" MemoryInMB="1000" />
      <ResourceGovernancePolicy CodePackageRef="CodeA2" CpuShares="256" MemoryInMB="1000" />
    </Policies>
  </ServiceManifestImport>
```
  
In this example, service package ServicePackageA gets one core on the nodes where it is placed. This service package contains two code packages (CodeA1 and CodeA2), and both specify the `CpuShares` parameter. The proportion of CpuShares 512:256  divides the core across the two code packages. Thus, in this example, CodeA1 gets two-thirds of a core, and  CodeA2 gets one-third of a core (and a soft-guarantee reservation of the same). In case when CpuShares are not specified for code packages, Service Fabric divides the cores equally among them.

Memory limits are absolute, so both code packages are limited to 1024 MB of memory (and a soft-guarantee reservation of the same). Code packages (containers or processes) are not able to allocate more memory than this limit, and attempting to do so results in an out-of-memory exception. For resource limit enforcement to work, all code packages within a service package should have memory limits specified.

## Other Resources for Containers
Besides CPU and memory, it is possible to specify other resource limits for containers. These limits are specified at code package level, and will be applied when container is started. Unlike with CPU and memory, CLuster Resource Manager will not be aware of these resources, and will not do any capacity checks or load balancing for them. 

* MemorySwapInMB - the amount of swap memory that a container can use.
* MemoryReservationInMB - soft limit for memory governance that is enforced only when memory contention is detected on the node.
* CpuPercent - Percentage of CPU that the container can use. If CPU limits are specified for the service package, this parameter is effectively ignored.
* MaximumIOps - Maximum IOPS that a container can use (read and write).
* MaximumIOBytesps - Maximum IO (bytes per second) that a container can use (read and write).
* BlockIOWeight - block IO weight for relative to other containers.

These resources can be combined with CPU and memory. Here is an example of how to specify additional resources for containers:

```xml
    <ServiceManifestImport>
        <ServiceManifestRef ServiceManifestName="FrontendServicePackage" ServiceManifestVersion="1.0"/>
        <Policies>
            <ResourceGovernancePolicy CodePackageRef="FrontendService.Code" CpuPercent="5"
            MemorySwapInMB="4084" MemoryReservationInMB="1024" MaximumIOPS="20" />
        </Policies>
    </ServiceManifestImport>
```

## Next steps
* To learn more about Cluster Resource Manager, read this [article](service-fabric-cluster-resource-manager-introduction.md).
* To learn more about application model, service packages, code packages and how replicas map to them read this [article](service-fabric-application-model.md).

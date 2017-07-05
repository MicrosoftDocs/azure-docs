---
title: Azure Service Fabric Resource Governance for Containers and Services | Microsoft Docs
description: Azure Service Fabric allows you to specify resource limits for services running inside or outside containers.
services: service-fabric
documentationcenter: .net
author: mani-ramaswamy
manager: timlt
editor: ''

ms.assetid: ab49c4b9-74a8-4907-b75b-8d2ee84c6d90
ms.service: service-fabric
ms.devlang: dotNet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 05/02/2017
ms.author: subramar
---

# Resource governance 

When running multiple services on the same node or cluster, it is possible that one service might consume more resources starving other services. This problem is referred to as the noisy-neighbor problem. Service Fabric allows the developer to specify reservations and limits per service to guarantee resources and also limit its resource usage. 

## Resource governance metrics 

Resource governance is supported in Service Fabric per [Service Package](service-fabric-application-model.md). The resources that are assigned to Service Package can be further divided between code packages. The resource limits specified also mean the reservation of the resources. Service Fabric supports specifying CPU and Memory per service package, using two built-in [metrics](service-fabric-cluster-resource-manager-metrics.md):

* CPU (metric name `ServiceFabric:/_CpuCores`): A core is a logical core that is available on the host machine, and all cores across all nodes are weighted the same.
* Memory (metric name `ServiceFabric:/_MemoryInMB`): Memory is expressed in megabytes, and it maps to physical memory that is available on the machine.

Only soft reservation guarantees are provided - the runtime rejects opening of new service packages available resources are exceeded. However, if another executable or container is placed on the node, that may violate the original reservation guarantees.

For these two metrics, the [Cluster Resource Manager](service-fabric-cluster-resource-manager-cluster-description.md) tracks total cluster capacity, the load on each node in the cluster, and, remaining resources in the cluster. These two metrics are equivalent to any other user or custom metric and all existing features can be used with them:
* Cluster can be [balanced](service-fabric-cluster-resource-manager-balancing.md) according to these two metrics (default behavior).
* Cluster can be [defragmented](service-fabric-cluster-resource-manager-defragmentation-metrics.md) according to these two metrics.
* When [describing a cluster](service-fabric-cluster-resource-manager-cluster-description.md), buffered capacity can be set for these two metrics.

[Dynamic load reporting](service-fabric-cluster-resource-manager-metrics.md) is not supported for these metrics, and loads for these metrics are defined at creation time.

## Cluster set up for enabling resource governance

Capacity should be defined manually in each node type in the cluster as follows:

```xml
    <NodeType Name="MyNodeType">
      <Capacities>
        <Capacity Name="ServiceFabric:/_CpuCores" Value="4"/>
        <Capacity Name="ServiceFabric:/_MemoryInMB" Value="2048"/>
      </Capacities>
    </NodeType>
```
 
Resource governance is allowed only on user services and not on any system services. When specifying capacity, some cores and memory must be left unallocated for system services. For optimal performance, the following setting should also be turned on in the cluster manifest: 

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


## Next steps
* To learn more about Cluster Resource Manager, read this [article](service-fabric-cluster-resource-manager-introduction.md).
* To learn more about application model, service packages, code packages and how replicas map to them read this [article](service-fabric-application-model.md).

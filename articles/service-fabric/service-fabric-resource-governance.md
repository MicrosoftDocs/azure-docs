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

Resource governance is supported in Service Fabric per [Service Package](service-fabric-application-model.md). The resources that are assigned to Service Package can be further divided between code packages. The resource limits specified also mean the reservation of the resources. Service Fabric supports specifying CPU and Memory per container or code package:

* CPU:  A core is a logical core that is available on the host machine, and all cores across all nodes are weighted the same. 
* Memory: Only soft reservation guarantees are provided - the runtime rejects opening of new service packages if it can’t provide resources. However, if there is another exe/container placed on the node, it may lead to the original reservation guarantees being not met. 


## Cluster set up for enabling resource governance

Capacity should be defined manually in each node type in the cluster as follows:

```xml
    <NodeType Name="MyNodeType">
      <Capacities>
        <Capacity Name="ServiceFabric:/_CPUCores" Value="4"/>
        <Capacity Name="ServiceFabric:/_MemoryInMB" Value="2048"/>
      </Capacities>
    </NodeType>
```
 
Resource governance is allowed only on user services and not on any system services. When specifying capacity, some cores and memory must be left unallocated for system services. For optimal performance, the following setting should also be turned on in the cluster manifest: 

```xml
<Section Name="PlacementAndLoadBalancing">
    <Parameter Name="PreventTransientOvercommit" Value="true" /> 
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
  ServicePackageA will have number of CPU cores defined, but won't have MemoryInMB.
  In this case, LRM will summarize limits on code packages and will use the sum as 
  overall SP limit.
  -->
  <ServiceManifestImport>
    <ServiceManifestRef ServiceManifestName='ServicePackageA' ServiceManifestVersion='v1'/>
    <Policies>
      <ServicePackageResourceGovernancePolicy CPUCores="1"/>
      <ResourceGovernancePolicy CodePackageRef="CodeA1" CpuShares="512" MemoryInMB="1000" />
      <ResourceGovernancePolicy CodePackageRef="CodeA2" CpuShares="256" MemoryInMB="1000" />
    </Policies>
  </ServiceManifestImport>
```
  
In this example, service package ServicePackageA gets one core on the nodes where it is placed. This service package contains two code packages (CodeA1 and CodeA2), and both specify the CPUShares parameter. The proportion of CpuShares 512:256  divides the core across the two code packages. Thus, in this example, CodeA1 gets two-thirds of a core, and  CodeA2 gets one-third of a core. Memory limits are absolute, so both code packages are limited to 1000 MB of memory (and a soft-guarantee reservation of the same).

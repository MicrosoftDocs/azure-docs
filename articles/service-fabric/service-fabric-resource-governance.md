---
title: Resource governance for containers and services 
description: Azure Service Fabric allows you to specify resource requests and limits for services running as processes or containers.
ms.topic: conceptual
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/11/2022
---

# Resource governance

When you're running multiple services on the same node or cluster, it is possible that one service might consume more resources, starving other services in the process. This problem is referred to as the "noisy neighbor" problem. Azure Service Fabric enables the developer to control this behavior by specifying requests and limits per service to limit resource usage.

> Before you proceed with this article, we recommend that you get familiar with the [Service Fabric application model][application-model-link] and the [Service Fabric hosting model][hosting-model-link].
>

## Resource governance metrics

Resource governance is supported in Service Fabric in accordance with the [service package][application-model-link]. The resources that are assigned to the service package can be further divided between code packages. Service Fabric supports CPU and memory governance per service package, with two built-in [metrics](service-fabric-cluster-resource-manager-metrics.md):

* *CPU* (metric name `servicefabric:/_CpuCores`): A logical core that is available on the host machine. All cores across all nodes are weighted the same.

* *Memory* (metric name `servicefabric:/_MemoryInMB`): Memory is expressed in megabytes, and it maps to physical memory that is available on the machine.

For these two metrics, [Cluster Resource Manager (CRM)][cluster-resource-manager-description-link] tracks total cluster capacity, the load on each node in the cluster, and the remaining resources in the cluster. These two metrics are equivalent to any other user or custom metric. 

> [!NOTE]
> Custom metric names should not be one of these two metric names as it will lead to undefined behavior.
>

All existing features can be used with them:
* The cluster can be [balanced](service-fabric-cluster-resource-manager-balancing.md) according to these two metrics (default behavior).
* The cluster can be [defragmented](service-fabric-cluster-resource-manager-defragmentation-metrics.md) according to these two metrics.
* When [describing a cluster][cluster-resource-manager-description-link], buffered capacity can be set for these two metrics.

> [!NOTE]
> [Dynamic load reporting](service-fabric-cluster-resource-manager-metrics.md) is not supported for these metrics; loads for these metrics are defined at creation time.

## Resource governance mechanism

Starting with version 7.2, Service Fabric runtime supports specification of requests and limits for CPU and memory resources.

> [!NOTE]
> Service Fabric runtime versions older than 7.2 only support a model where a single value serves both as the **request** and the **limit** for a particular resource (CPU or memory). This is described as the **RequestsOnly** specification in this document.

* *Requests:* CPU and memory request values represent the loads used by the [Cluster Resource Manager (CRM)][cluster-resource-manager-description-link] for the `servicefabric:/_CpuCores` and `servicefabric:/_MemoryInMB` metrics. In other words, CRM considers the resource consumption of a service to be equal to its request values and uses these values when making placement decisions.

* *Limits:* CPU and Memory limit values represent the actual resource limits applied when a process or a container is activated on a node.

Service Fabric allows **RequestsOnly, LimitsOnly** and both **RequestsAndLimits** specifications for CPU and memory.
* When RequestsOnly specification is used, service fabric also uses the request values as limits.
* When LimitsOnly specification is used, service fabric considers the request values to be 0.
* When RequestsAndLimits specification is used, the limit values must be greater than or equal to the request values.

To better understand the resource governance mechanism, let's look at an example placement scenario with a **RequestsOnly** specification for the CPU resource (mechanism for memory governance is equivalent). Consider a node with two CPU cores and two service packages that will be placed on it. The first service package to be placed, is composed of just one container code package and only specifies a request of one CPU core. The second service package to be placed, is composed of just one process based code package and also only specifies a request of one CPU core. Since both service packages have a RequestsOnly specification, their limit values are set to their request values.

1. First the container based service package requesting one CPU core is placed on the node. The runtime activates the container and sets the CPU limit to one core. The container won't be able to use more than one core.

2. Next, the process based service package requesting one CPU core is placed on the node. The runtime activates the service process and sets its CPU limit to one core.

At this point, the sum of requests is equal to the capacity of the node. CRM will not place any more containers or service processes with CPU requests on this node. On the node, a process and a container are running with one core each and will not contend with each other for CPU.

Let's now revisit our example with a **RequestsAndLimits** specification. This time the container based service package specifies a request of one CPU core and a limit of two CPU cores. The process based service package specifies both a request and a limit of one CPU core.
  1. First the container based service package is placed on the node. The runtime activates the container and sets the CPU limit to two cores. The container won't be able to use more than two cores.
  2. Next, the process based service package is placed on the node. The runtime activates the service process and sets its CPU limit to one core.

  At this point, the sum of CPU requests of service packages that are placed on the node is equal to the CPU capacity of the node. CRM will not place any more containers or service processes with CPU requests on this node. However, on the node, the sum of limits (two cores for the container + one core for the process) exceeds the capacity of two cores. If the container and the process burst at the same time, there is possibility of contention for the CPU resource. Such contention will be managed by the underlying OS for the platform. For this example, the container could burst up to two CPU cores, resulting in the process's request of one CPU core not being guaranteed.

> [!NOTE]
> As illustrated in the previous example, the request values for CPU and memory **do not lead to reservation of resources on a node**. These values represent the resource consumption that the Cluster Resource Manager considers when making placement decisions. Limit values represent the actual resource limits applied when a process or a container is activated on a node.


There are a few situations in which there might be contention for CPU. In these situations, the process and container from our example might experience the noisy neighbor problem:

* *Mixing governed and non-governed services and containers*: If a user creates a service without any resource governance specified, the runtime sees it as consuming no resources, and can place it on the node in our example. In this case, this new process effectively consumes some CPU at the expense of the services that are already running on the node. There are two solutions to this problem. Either don't mix governed and non-governed services on the same cluster, or use [placement constraints](service-fabric-cluster-resource-manager-advanced-placement-rules-placement-policies.md) so that these two types of services don't end up on the same set of nodes.

* *When another process is started on the node, outside Service Fabric (for example, an OS service)*: In this situation, the process outside Service Fabric also contends for CPU with existing services. The solution to this problem is to set up node capacities correctly to account for OS overhead, as shown in the next section.

* *When requests are not equal to limits*: As described in the RequestsAndLimits example earlier, requests do not lead to reservation of resources on a node. When a service with limits greater than requests is placed on a node, it may consume resources (if available) up to it limits. In such cases, other services on the node might not be able to consume resources up to their request values.

## Cluster setup for enabling resource governance

When a node starts and joins the cluster, Service Fabric detects the available amount of memory and the available number of cores, and then sets the node capacities for those two resources.

To leave buffer space for the operating system, and for other processes that might be running on the node, Service Fabric uses only 80% of the available resources on the node. This percentage is configurable, and can be changed in the cluster manifest.

Here is an example of how to instruct Service Fabric to use 50% of available CPU and 70% of available memory:

```xml
<Section Name="PlacementAndLoadBalancing">
    <!-- 0.0 means 0%, and 1.0 means 100%-->
    <Parameter Name="CpuPercentageNodeCapacity" Value="0.5" />
    <Parameter Name="MemoryPercentageNodeCapacity" Value="0.7" />
</Section>
```

For most customers and scenarios, automatic detection of node capacities for CPU and memory is the recommended configuration (automatic detection is turned on by default). However, if you need full manual setup of node capacities, you can configure them per node type using the mechanism for describing nodes in the cluster. Here is an example of how to set up the node type with four cores and 2 GB of memory:

```xml
    <NodeType Name="MyNodeType">
      <Capacities>
        <Capacity Name="servicefabric:/_CpuCores" Value="4"/>
        <Capacity Name="servicefabric:/_MemoryInMB" Value="2048"/>
      </Capacities>
    </NodeType>
```

When auto-detection of available resources is enabled, and node capacities are manually defined in the cluster manifest, Service Fabric checks that the node has enough resources to support the capacity that the user has defined:

* If node capacities that are defined in the manifest are less than or equal to the available resources on the node, then Service Fabric uses the capacities that are specified in the manifest.

* If node capacities that are defined in the manifest are greater than available resources, Service Fabric uses the available resources as node capacities.

Auto-detection of available resources can be turned off if it is not required. To turn it off, change the following setting:

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

> [!IMPORTANT]
> Starting with Service Fabric version 7.0, we have updated the rule for how node resource capacities are calculated in the cases where user manually provides the values for node resource capacities. Let's consider the following scenario:
>
> * There are a total of 10 CPU cores on the node
> * SF is configured to use 80% of the total resources for the user services (default setting), which leaves a buffer of 20% for the other services running on the node (incl. Service Fabric system services)
> * User decides to manually override the node resource capacity for the CPU cores metric, and sets it to 5 cores
>
> We have changed the rule on how the available capacity for Service Fabric user services is calculated in the following way:
>
> * Before Service Fabric 7.0, available capacity for user services would be calculated to **5 cores** (capacity buffer of 20% is ignored)
> * Starting with Service Fabric 7.0, available capacity for user services would be calculated to **4 cores** (capacity buffer of 20% is not ignored)

## Specify resource governance

Resource governance requests and limits are specified in the application manifest (ServiceManifestImport section). Let's look at a few examples:

**Example 1: RequestsOnly specification**
```xml
<?xml version='1.0' encoding='UTF-8'?>
<ApplicationManifest ApplicationTypeName='TestAppTC1' ApplicationTypeVersion='vTC1' xsi:schemaLocation='http://schemas.microsoft.com/2011/01/fabric ServiceFabricServiceModel.xsd' xmlns='http://schemas.microsoft.com/2011/01/fabric' xmlns:xsi='https://www.w3.org/2001/XMLSchema-instance'>
  <ServiceManifestImport>
    <ServiceManifestRef ServiceManifestName='ServicePackageA' ServiceManifestVersion='v1'/>
    <Policies>
      <ServicePackageResourceGovernancePolicy CpuCores="1"/>
      <ResourceGovernancePolicy CodePackageRef="CodeA1" CpuShares="512" MemoryInMB="1024" />
      <ResourceGovernancePolicy CodePackageRef="CodeA2" CpuShares="256" MemoryInMB="1024" />
    </Policies>
  </ServiceManifestImport>
```

In this example, the `CpuCores` attribute is used to specify a request of 1 CPU core for **ServicePackageA**. Since the CPU limit (`CpuCoresLimit` attribute) is not specified, Service Fabric also uses the specified request value of 1 core as the CPU limit for the service package.

**ServicePackageA** will only be placed on a node where the remaining CPU capacity after subtracting the **sum of CPU requests of all service packages placed on that node** is greater than or equal to 1 core. On the node, the service package will be limited to one core. The service package contains two code packages (**CodeA1** and **CodeA2**), and both specify the `CpuShares` attribute. The proportion of CpuShares 512:256 is used to calculate the CPU limits for the individual code packages. Thus, CodeA1 will be limited to two-thirds of a core, and CodeA2 will be limited to one-third of a core. If CpuShares are not specified for all code packages, Service Fabric divides the CPU limit equally among them.

While CpuShares specified for code packages represent their relative proportion of the service package's overall CPU limit, memory values for code packages are specified in absolute terms. In this example, the `MemoryInMB` attribute is used to specify memory requests of 1024 MB for both CodeA1 and CodeA2. Since the memory limit (`MemoryInMBLimit` attribute) is not specified, Service Fabric also uses the specified request values as the limits for the code packages. The memory request (and limit) for the service package is calculated as the sum of memory request (and limit) values of its constituent code packages. Thus for **ServicePackageA**, the memory request and limit is calculated as 2048 MB.

**ServicePackageA** will only be placed on a node where the remaining memory capacity after subtracting the **sum of memory requests of all service packages placed on that node** is greater than or equal to 2048 MB. On the node, both code packages will be limited to 1024 MB of memory each. Code packages (containers or processes) will not be able to allocate more memory than this limit, and attempting to do so will result in out-of-memory exceptions.

**Example 2: LimitsOnly specification**
```xml
<?xml version='1.0' encoding='UTF-8'?>
<ApplicationManifest ApplicationTypeName='TestAppTC1' ApplicationTypeVersion='vTC1' xsi:schemaLocation='http://schemas.microsoft.com/2011/01/fabric ServiceFabricServiceModel.xsd' xmlns='http://schemas.microsoft.com/2011/01/fabric' xmlns:xsi='https://www.w3.org/2001/XMLSchema-instance'>
  <ServiceManifestImport>
    <ServiceManifestRef ServiceManifestName='ServicePackageA' ServiceManifestVersion='v1'/>
    <Policies>
      <ServicePackageResourceGovernancePolicy CpuCoresLimit="1"/>
      <ResourceGovernancePolicy CodePackageRef="CodeA1" CpuShares="512" MemoryInMBLimit="1024" />
      <ResourceGovernancePolicy CodePackageRef="CodeA2" CpuShares="256" MemoryInMBLimit="1024" />
    </Policies>
  </ServiceManifestImport>
```
This example uses `CpuCoresLimit` and `MemoryInMBLimit` attributes, which are only available in SF versions 7.2 and later. The CpuCoresLimit attribute is used to specify a CPU limit of 1 core for **ServicePackageA**. Since CPU request (`CpuCores` attribute) is not specified, it is considered to be 0. `MemoryInMBLimit` attribute is used to specify memory limits of 1024 MB for CodeA1 and CodeA2 and since requests (`MemoryInMB` attribute) are not specified, they are considered to be 0. The memory request and limit for **ServicePackageA** are thus calculated as 0 and 2048 respectively. Since both CPU and memory requests for **ServicePackageA** are 0, it presents no load for CRM to consider for placement, for the `servicefabric:/_CpuCores` and `servicefabric:/_MemoryInMB` metrics. Therefore, from a resource governance perspective, **ServicePackageA** can be placed on any node **regardless of remaining capacity**. Similar to example 1, on the node, CodeA1 will be limited to two-thirds of a core and 1024 MB of memory, and CodeA2 will be limited to one-third of a core and 1024 MB of memory.

**Example 3: RequestsAndLimits specification**
```xml
<?xml version='1.0' encoding='UTF-8'?>
<ApplicationManifest ApplicationTypeName='TestAppTC1' ApplicationTypeVersion='vTC1' xsi:schemaLocation='http://schemas.microsoft.com/2011/01/fabric ServiceFabricServiceModel.xsd' xmlns='http://schemas.microsoft.com/2011/01/fabric' xmlns:xsi='https://www.w3.org/2001/XMLSchema-instance'>
  <ServiceManifestImport>
    <ServiceManifestRef ServiceManifestName='ServicePackageA' ServiceManifestVersion='v1'/>
    <Policies>
      <ServicePackageResourceGovernancePolicy CpuCores="1" CpuCoresLimit="2"/>
      <ResourceGovernancePolicy CodePackageRef="CodeA1" CpuShares="512" MemoryInMB="1024" MemoryInMBLimit="3072" />
      <ResourceGovernancePolicy CodePackageRef="CodeA2" CpuShares="256" MemoryInMB="2048" MemoryInMBLimit="4096" />
    </Policies>
  </ServiceManifestImport>
```
Building upon the first two examples, this example demonstrates specifying both requests and limits for CPU and memory. **ServicePackageA** has CPU and memory requests of 1 core and 3072 (1024 + 2048) MB respectively. It can only be placed on a node which has at least 1 core (and 3072 MB) of capacity left after subtracting the sum of all CPU (and memory) requests of all service packages that are placed on the node from the total CPU (and memory) capacity of the node. On the node, CodeA1 will be limited to two-thirds of 2 cores and 3072 MB of memory while CodeA2 will be limited to one-third of 2 cores and 4096 MB of memory.

### Using application parameters

When specifying resource governance settings, it is possible to use [application parameters](service-fabric-manage-multiple-environment-app-configuration.md) to manage multiple app configurations. The following example shows the usage of application parameters:

```xml
<?xml version='1.0' encoding='UTF-8'?>
<ApplicationManifest ApplicationTypeName='TestAppTC1' ApplicationTypeVersion='vTC1' xsi:schemaLocation='http://schemas.microsoft.com/2011/01/fabric ServiceFabricServiceModel.xsd' xmlns='http://schemas.microsoft.com/2011/01/fabric' xmlns:xsi='https://www.w3.org/2001/XMLSchema-instance'>

  <Parameters>
    <Parameter Name="CpuCores" DefaultValue="4" />
    <Parameter Name="CpuSharesA" DefaultValue="512" />
    <Parameter Name="CpuSharesB" DefaultValue="512" />
    <Parameter Name="MemoryA" DefaultValue="2048" />
    <Parameter Name="MemoryB" DefaultValue="2048" />
  </Parameters>

  <ServiceManifestImport>
    <ServiceManifestRef ServiceManifestName='ServicePackageA' ServiceManifestVersion='v1'/>
    <Policies>
      <ServicePackageResourceGovernancePolicy CpuCores="[CpuCores]"/>
      <ResourceGovernancePolicy CodePackageRef="CodeA1" CpuShares="[CpuSharesA]" MemoryInMB="[MemoryA]" />
      <ResourceGovernancePolicy CodePackageRef="CodeA2" CpuShares="[CpuSharesB]" MemoryInMB="[MemoryB]" />
    </Policies>
  </ServiceManifestImport>
```

In this example, default parameter values are set for the production environment, where each Service Package would get 4 cores and 2 GB of memory. It is possible to change default values with application parameter files. In this example, one parameter file can be used for testing the application locally, where it would get less resources than in production:

```xml
<!-- ApplicationParameters\Local.xml -->

<Application Name="fabric:/TestApplication1" xmlns="http://schemas.microsoft.com/2011/01/fabric">
  <Parameters>
    <Parameter Name="CpuCores" DefaultValue="2" />
    <Parameter Name="CpuSharesA" DefaultValue="512" />
    <Parameter Name="CpuSharesB" DefaultValue="512" />
    <Parameter Name="MemoryA" DefaultValue="1024" />
    <Parameter Name="MemoryB" DefaultValue="1024" />
  </Parameters>
</Application>
```

> [!IMPORTANT]
> Specifying resource governance with application parameters is available starting with Service Fabric version 6.1.<br>
>
> When application parameters are used to specify resource governance, Service Fabric cannot be downgraded to a version prior to version 6.1.

## Enforcing the resource limits for user services

While applying resource governance to your Service Fabric services guarantees that those resource-governed services cannot exceed their resources quota, many users still need to run some of their Service Fabric services in ungoverned mode. When using ungoverned Service Fabric services, it is possible to run into situations where "runaway" ungoverned services consume all available resources on the Service Fabric nodes, which can lead to serious issues like:

* Resource starvation of other services running on the nodes (including Service Fabric system services)
* Nodes ending up in an unhealthy state
* Unresponsive Service Fabric cluster management APIs

To prevent these situations from occurring, Service Fabric allows you to *enforce the resource limits for all Service Fabric user services running on the node* (both governed and ungoverned) to guarantee that user services will never use more than the specified amount of resources. This is achieved by setting the value for the EnforceUserServiceMetricCapacities config in the PlacementAndLoadBalancing section of the ClusterManifest to true. This setting is turned off by default.

```xml
<SectionName="PlacementAndLoadBalancing">
    <ParameterName="EnforceUserServiceMetricCapacities" Value="false"/>
</Section>
```

Additional remarks:

* Resource limit enforcement only applies to the `servicefabric:/_CpuCores` and `servicefabric:/_MemoryInMB` resource metrics
* Resource limit enforcement only works if node capacities for the resource metrics are available to Service Fabric, either via auto-detection mechanism, or via users manually specifying the node  capacities (as explained in the [Cluster setup for enabling resource governance](service-fabric-resource-governance.md#cluster-setup-for-enabling-resource-governance) section). If node capacities are not configured, the resource limit enforcement capability cannot be used since Service Fabric can't know how much resources to reserve for user services. Service Fabric will issue a health warning if "EnforceUserServiceMetricCapacities" is true but node capacities are not configured.

## Other resources for containers

Besides CPU and memory, it's possible to specify other [resource limits for containers](service-fabric-service-model-schema-complex-types.md#resourcegovernancepolicytype-complextype). These limits are specified at the code-package level and are applied when the container is started. Unlike with CPU and memory, Cluster Resource Manager isn't aware of these resources, and won't do any capacity checks or load balancing for them.

* *MemorySwapInMB*: The total amount of swap memory that can be used, in MB. Must be a positive integer.
* *MemoryReservationInMB*: The soft limit (in MB) for memory governance that is enforced only when memory contention is detected on the node. Must be a positive integer.
* *CpuPercent*: Usable percentage of available CPUs (Windows only). Must be a positive integer. Cannot be used with CpuShares, CpuCores, or CpuCoresLimit.
* *CpuShares*: Relative CPU weight. Must be a positive integer. Cannot be used with CpuPercent, CpuCores, or CpuCoresLimit.
* *MaximumIOps*: Maximum IO rate (read and write) in terms of IOps that can be used. Must be a positive integer.
* *MaximumIOBandwidth*: The maximum IO (bytes per second) that can be used (read and write). Must be a positive integer.
* *BlockIOWeight*: Block IO weight, relative to other code packages. Must be a positive integer between 10 and 1000.
* *DiskQuotaInMB*: Disk quota for containers. Must be a positive integer.
* *KernelMemoryInMB*: Kernel memory limits in bytes.  Must be a positive integer.  Note this is Linux-specific and Docker on Windows will error out if this is set.
* *ShmSizeInMB*: Size of */dev/shm* in bytes. If omitted, the system uses 64MB.  Must be a positive integer. Note this is Linux-specific, however, Docker will only ignore (and not error out) if specified.

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

* To learn more about Cluster Resource Manager, read [Introducing the Service Fabric cluster resource manager](service-fabric-cluster-resource-manager-introduction.md).
* To learn more about the application model, service packages, and code packages--and how replicas map to them--read [Model an application in Service Fabric][application-model-link].

<!-- Links -->
[application-model-link]: service-fabric-application-model.md
[hosting-model-link]: service-fabric-hosting-model.md
[cluster-resource-manager-description-link]: service-fabric-cluster-resource-manager-cluster-description.md

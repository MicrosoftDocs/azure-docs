---
title: Resource governance for containers and services 
description: Azure Service Fabric allows you to specify resource limits for services running inside or outside containers.

ms.topic: conceptual
ms.date: 8/9/2017
---

# Resource governance

When you're running multiple services on the same node or cluster, it's possible that one service might consume more resources, starving other services in the process. This problem is referred to as the "noisy neighbor" problem. Azure Service Fabric enables the developer to specify reservations and limits per service to guarantee resources and limit resource usage.

> Before you proceed with this article, we recommend that you get familiar with the [Service Fabric application model](service-fabric-application-model.md) and the [Service Fabric hosting model](service-fabric-hosting-model.md).
>

## Resource governance metrics

Resource governance is supported in Service Fabric in accordance with the [service package](service-fabric-application-model.md). The resources that are assigned to the service package can be further divided between code packages. The resource limits that are specified also mean the reservation of the resources. Service Fabric supports specifying CPU and memory per service package, with two built-in [metrics](service-fabric-cluster-resource-manager-metrics.md):

* *CPU* (metric name `servicefabric:/_CpuCores`): A logical core that's available on the host machine. All cores across all nodes are weighted the same.

* *Memory* (metric name `servicefabric:/_MemoryInMB`): Memory is expressed in megabytes, and it maps to physical memory that is available on the machine.

For these two metrics, [Cluster Resource Manager](service-fabric-cluster-resource-manager-cluster-description.md) tracks total cluster capacity, the load on each node in the cluster, and the remaining resources in the cluster. These two metrics are equivalent to any other user or custom metric. All existing features can be used with them:

* The cluster can be [balanced](service-fabric-cluster-resource-manager-balancing.md) according to these two metrics (default behavior).
* The cluster can be [defragmented](service-fabric-cluster-resource-manager-defragmentation-metrics.md) according to these two metrics.
* When [describing a cluster](service-fabric-cluster-resource-manager-cluster-description.md), buffered capacity can be set for these two metrics.

> [!NOTE]
> [Dynamic load reporting](service-fabric-cluster-resource-manager-metrics.md) is not supported for these metrics; loads for these metrics are defined at creation time.

## Resource governance mechanism

The Service Fabric runtime currently does not provide reservation for resources. When a process or a container is opened, the runtime sets the resource limits to the loads that were defined at creation time. Furthermore, the runtime rejects the opening of new service packages that are available when resources are exceeded. To better understand how the process works, let's take an example of a node with two CPU cores (mechanism for memory governance is equivalent):

1. First, a container is placed on the node, requesting one CPU core. The runtime opens the container and sets the CPU limit to one core. The container won't be able to use more than one core.

2. Then, a replica of a service is placed on the node, and the corresponding service package specifies a limit of one CPU core. The runtime opens the code package and sets its CPU limit to one core.

At this point, the sum of limits is equal to the capacity of the node. A process and a container are running with one core each and not interfering with each other. Service Fabric doesn't place any more containers or replicas when they are specifying the CPU limit.

However, there are two situations in which other processes might contend for CPU. In these situations, a process and a container from our example might experience the noisy neighbor problem:

* *Mixing governed and non-governed services and containers*: If a user creates a service without any resource governance specified, the runtime sees it as consuming no resources, and can place it on the node in our example. In this case, this new process effectively consumes some CPU at the expense of the services that are already running on the node. There are two solutions to this problem. Either don't mix governed and non-governed services on the same cluster, or use [placement constraints](service-fabric-cluster-resource-manager-advanced-placement-rules-placement-policies.md) so that these two types of services don't end up on the same set of nodes.

* *When another process is started on the node, outside Service Fabric (for example, an OS service)*: In this situation, the process outside Service Fabric also contends for CPU with existing services. The solution to this problem is to set up node capacities correctly to account for OS overhead, as shown in the next section.

## Cluster setup for enabling resource governance

When a node starts and joins the cluster, Service Fabric detects the available amount of memory and the available number of cores, and then sets the node capacities for those two resources.

To leave buffer space for the operating system, and for other processes might be running on the node, Service Fabric uses only 80% of the available resources on the node. This percentage is configurable, and can be changed in the cluster manifest.

Here is an example of how to instruct Service Fabric to use 50% of available CPU and 70% of available memory:

```xml
<Section Name="PlacementAndLoadBalancing">
    <!-- 0.0 means 0%, and 1.0 means 100%-->
    <Parameter Name="CpuPercentageNodeCapacity" Value="0.5" />
    <Parameter Name="MemoryPercentageNodeCapacity" Value="0.7" />
</Section>
```

For most customers and scenarios, automatic detection of node capacities for the CPU and memory is the recommended configuration (automatic detection is turned on by default). However, if you need full manual setup of node capacities, you can configure those per node type using the mechanism for describing the nodes in the cluster. Here is an example of how to set up the node type with four cores and 2 GB of memory:

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
> * There are 10 cpu cores total on the node
> * SF is configured to use 80% of the total resources for the user services (default setting), which leaves a buffer of 20% for the other services running on the node (incl. Service Fabric system services)
> * User decides to manually override the node resource capacity for the cpu cores metric, and sets it to 5 cores
>
> We have changed the rule on how the available capacity for Service Fabric user services is calculated in the following way:
>
> * Before Service Fabric 7.0, available capacity for user services would be calculated to **5 cores** (capacity buffer of 20% is ignored)
> * Starting with Service Fabric 7.0, available capacity for user services would be calculated to **4 cores** (capacity buffer of 20% is not ignored)

## Specify resource governance

Resource governance limits are specified in the application manifest (ServiceManifestImport section) as shown in the following example:

```xml
<?xml version='1.0' encoding='UTF-8'?>
<ApplicationManifest ApplicationTypeName='TestAppTC1' ApplicationTypeVersion='vTC1' xsi:schemaLocation='http://schemas.microsoft.com/2011/01/fabric ServiceFabricServiceModel.xsd' xmlns='http://schemas.microsoft.com/2011/01/fabric' xmlns:xsi='https://www.w3.org/2001/XMLSchema-instance'>

  <!--
  ServicePackageA has the number of CPU cores defined, but doesn't have the MemoryInMB defined.
  In this case, Service Fabric sums the limits on code packages and uses the sum as 
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

In this example, the service package called **ServicePackageA** gets one core on the nodes where it is placed. This service package contains two code packages (**CodeA1** and **CodeA2**), and both specify the `CpuShares` parameter. The proportion of CpuShares 512:256  divides the core across the two code packages.

Thus, in this example, CodeA1 gets two-thirds of a core, and CodeA2 gets one-third of a core (and a soft-guarantee reservation of the same). If CpuShares are not specified for code packages, Service Fabric divides the cores equally among them.

Memory limits are absolute, so both code packages are limited to 1024 MB of memory (and a soft-guarantee reservation of the same). Code packages (containers or processes) can't allocate more memory than this limit, and attempting to do so results in an out-of-memory exception. For resource limit enforcement to work, all code packages within a service package should have memory limits specified.

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
* Resource limit enforcement only works if node capacities for the resource metrics are available to Service Fabric, either via auto-detection mechanism, or via users manually specifying the node  capacities (as explained in the [Cluster setup for enabling resource governance](service-fabric-resource-governance.md#cluster-setup-for-enabling-resource-governance) section). If node capacities are not configured, the resource limit enforcement capability cannot be used since Service Fabric can't know how much resources to reserve for user services. Service Fabric will issue a health warning if "EnforceUserServiceMetricCapacities" is true but node capacities are not configured.

## Other resources for containers

Besides CPU and memory, it's possible to specify other resource limits for containers. These limits are specified at the code-package level and are applied when the container is started. Unlike with CPU and memory, Cluster Resource Manager isn't aware of these resources, and won't do any capacity checks or load balancing for them.

* *MemorySwapInMB*: The amount of swap memory that a container can use.
* *MemoryReservationInMB*: The soft limit for memory governance that is enforced only when memory contention is detected on the node.
* *CpuPercent*: The percentage of CPU that the container can use. If CPU limits are specified for the service package, this parameter is effectively ignored.
* *MaximumIOps*: The maximum IOPS that a container can use (read and write).
* *MaximumIOBytesps*: The maximum IO (bytes per second) that a container can use (read and write).
* *BlockIOWeight*: The block IO weight for relative to other containers.

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
* To learn more about the application model, service packages, and code packages--and how replicas map to them--read [Model an application in Service Fabric](service-fabric-application-model.md).

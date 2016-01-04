<properties
   pageTitle="Resource Balancer cluster description | Microsoft Azure"
   description="Describing a Service Fabric cluster by specifying fault domains, upgrade domains, node properties, and node capacities to Resource Balancer."
   services="service-fabric"
   documentationCenter=".net"
   authors="GaugeField"
   manager="timlt"
   editor=""/>

<tags
   ms.service="Service-Fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="09/03/2015"
   ms.author="masnider"/>

# Describing a Service Fabric cluster

Resource Balancer in Azure Service Fabric provides several mechanisms to describe a cluster. During run time, Resource Balancer uses these pieces of information to place services in ways that ensure high availability of the services running in the cluster while also ensuring maximum utilization of the cluster resources. The Resource Balancer features that describe a cluster are fault domains, upgrade domains, node properties, and node capacities. Additionally, Resource Balancer has some configuration options that can tweak its performance.

## Key concepts

### Fault domains

Fault domains enable cluster administrators to define the physical nodes that are likely to experience failure at the same time due to shared physical dependencies such as power and networking sources. Fault domains typically represent hierarchies that are related to these shared dependencies, with more nodes likely to fail together from a higher point in the fault domain tree. The following figure shows several nodes that are organized via hierarchical fault domains in the order of datacenter, rack, and blade.

![Nodes organized via fault domains][Image1]

 During run time, Azure Resource Manager considers the fault domains in the cluster and attempts to spread out the replicas for a given service so that they are all in separate fault domains. This process helps ensure, in case of failure of any one fault domain, that the availability of that service and its state is not compromised. The following figure shows the replicas of a service that are spread over several fault domains, even though there is enough room to concentrate them in only one or two domains.

![Replicas of a service spread over fault domains][Image2]

Fault domains are configured within the cluster manifest. Each node is defined to be within a particular fault domain. During run time, Resource Manager combines the reports from all the nodes to develop a complete overview of all of the fault domains in the system.

### Upgrade domains

Upgrade domains are another piece of information that is consumed by Resource Manager. Upgrade domains, like fault domains, describe sets of nodes that are shut down for upgrades at approximately the same time. Upgrade domains are not hierarchical and can be thought of as tags.

Whereas fault domains are defined by the physical layout of the nodes in the cluster, upgrade domains are determined by cluster administrators based on policies. The policies are related to upgrades within the cluster. More upgrade domains make upgrades more granular by limiting the impact on the running cluster and services, and by preventing any failure from affecting a large number of services. Depending on other policies, such as the time that Service Fabric should wait after upgrading a domain before Service Fabric moves to the next domain, more upgrade domains can also increase the amount of time to complete an upgrade in the cluster.

For these reasons, Resource Manager collects upgrade domain information and spreads replicas among the upgrade domains in a cluster just like fault domains. Upgrade domains might or might not correspond one-to-one with fault domains, but generally are not expected to correspond one-to-one. The following figure shows a layer of several upgrade domains on top of the previously defined fault domains. Resource Manager still spreads the replicas across domains so that no fault or upgrade domain becomes concentrated with replicas to ensure high availability for the service, in spite of either upgrades or faults in the cluster.

![Upgrade domains][Image3]

Upgrade domains and fault domains are both configured as a part of the node definition within the cluster manifest, as shown below:

``` xml
<Infrastructure>
    <WindowsServer>
      <NodeList>
        <Node NodeTypeRef="NodeType01" IsSeedNode="true" IPAddressOrFQDN="localhost" NodeName="Node1" FaultDomain="fd:/RACK1/BLADE1" UpgradeDomain="ud:/UD1"/>
        <Node NodeTypeRef="NodeType01" IsSeedNode="false" IPAddressOrFQDN="localhost" NodeName="Node2" FaultDomain="fd:/RACK2/BLADE1" UpgradeDomain="ud:/UD2"/>
        <Node NodeTypeRef="NodeType01" IsSeedNode="true" IPAddressOrFQDN="localhost" NodeName="Node3" FaultDomain="fd:/RACK3/BLADE2" UpgradeDomain="ud:/UD3"/>
        <Node NodeTypeRef="NodeType01" IsSeedNode="false" IPAddressOrFQDN="localhost" NodeName="Node4" FaultDomain="fd:/RACK2/BLADE2" UpgradeDomain="ud:/UD1"/>
        <Node NodeTypeRef="NodeType01" IsSeedNode="true" IPAddressOrFQDN="localhost" NodeName="Node5" FaultDomain="fd:/RACK1/BLADE2" UpgradeDomain="ud:/UD2"/>
        </NodeList>
    </WindowsServer>
</Infrastructure>
```
> [AZURE.NOTE] In Azure deployments, fault domains and upgrade domains are assigned by Azure. Therefore, the definition of your nodes and roles within the infrastructure option for Azure does not include fault domain or upgrade domain information.

### Node properties
Node properties are user-defined key/value pairs that provide extra metadata for a given node. Examples of node properties include whether the node has a hard drive or video card, the number of spindles in its hard drive, cores, and other physical properties.

Node properties can also be used to specify more abstract properties to aid in placing policy decisions. For example, several nodes within a cluster can be assigned a "color" as a means of segmenting the cluster into different sections. The code example below shows that node properties are defined for nodes via the cluster manifest as a part of node type definitions. The node properties can then be applied to multiple nodes within the cluster.

The NodeName, NodeType, FaultDomain, and UpgradeDomain placement properties have default values.  Service Fabric will automatically supply default values for you so that you can use them when you create your service. Users should not specify their own placement properties with these same names.

``` xml
<NodeTypes>
  <NodeType Name="NodeType1">
    <PlacementProperties>
      <Property Name="HasDisk" Value="true"/>
      <Property Name="SpindleCount" Value="4"/>
      <Property Name="HasGPU" Value="true"/>
      <Property Name="NodeColor" Value="blue"/>
      <Property Name="NodeName" Value="Node1"/>
      <Property Name="NodeType" Value="NodeType1"/>
      <Property Name="FaultDomain" Value="fd:/RACK1/BLADE1"/>
      <Property Name="UpgradeDomain" Value="ud:/UD1"/>
    </PlacementProperties>
  </NodeType>
    <NodeType Name="NodeType2">
    <PlacementProperties>
      <Property Name="HasDisk" Value="false"/>
      <Property Name="SpindleCount" Value="-1"/>
      <Property Name="HasGPU" Value="false"/>
      <Property Name="NodeColor" Value="green"/>
    </PlacementProperties>
  </NodeType>
</NodeTypes>
```

During run time, Resource Balancer uses node property information to ensure that services that require specific capabilities are placed on the appropriate nodes.

### Node capacities
Node capacities are key/value pairs that define the name and amount of a particular resource that a particular node has available for consumption. The code example below shows a node that has capacity for a metric called "MemoryInMB" and that has 2,048 MB in memory available by default. Capacities are defined via the cluster manifest, much like node properties.

``` xml
<NodeType Name="NodeType03">
  <Capacities>
    <Capacity Name="MemoryInMB" Value="2048"/>
    <Capacity Name="DiskSpaceInGB" Value="1024"/>
  </Capacities>
</NodeType>
```
![Node capacity][Image4]

Because services that run on a node can update their capacity requirements via reporting load, Resource Balancer also checks periodically whether a node is at or over capacity for any of its metrics. If it is, Resource Balancer can move services to less-loaded nodes to decrease resource contention and to improve overall performance and utilization.

Note that while a given metric could also be listed in the property section of the node type, it is better to list it as a capacity if this is a property of the node that can be consumed during run time. To list it additionally as a property enables a service that depends on "minimum hardware requirements” to query for the node with placement constraints. This might be necessary if the resource is consumed by other services during run time. We recommend also including it as a capacity so that Resource Balancer can take additional actions.

When new services are created, Service Fabric Resource Balancer uses the information about the capacity of existing nodes and the consumption of existing services to determine if there is sufficient capacity available to place the entire new service. If there is insufficient capacity, then the Create Service request is rejected with an error message that explains the capacity issue.


### Resource Balancer configurations

Within the cluster manifest, the following configuration values define the overall behavior of Resource Balancer.

*Balancing thresholds* govern how imbalanced the cluster can become with regard to a particular metric before Resource Balancer reacts. A balancing threshold is the maximum ratio between the maximally used and minimally used nodes that Resource Balancer allows to exist before it rebalances the clusters.

The following figure shows two examples, where the balancing threshold for the given metric is 10.

![Balancing threshold][Image5]

Note that at this time, the "utilization" on a node does not take into consideration the size of the node as determined by the capacity of the node. It refers to only the absolute use that is currently reported on the node for the specified metric.

The following code example shows that balancing thresholds for metrics are configured per metric via the FabricSettings element within the cluster manifest.

``` xml
<FabricSettings>
  <Section Name="MetricBalancingThresholds">
    <Parameter Name="MetricName" Value="10"/>
  </Section>
</FabricSettings>
```

*Activity thresholds* act as a gate on how often Resource Balancer runs by limiting the cases that Resource Balancer reacts to when a significant absolute amount of load is present. In this way, if the cluster is not very busy for a particular metric, Resource Balancer does not run even if that small amount of metric is very imbalanced within the cluster. This measure prevents wasting resources by rebalancing the cluster for substantively little gain. The following figure shows that the balancing threshold for the metric is 4 and that the activity threshold is 1536.

![Activity threshold][Image6]

Note also that both the activity and balancing thresholds must be exceeded for the same metric to cause Resource Balancer to run. Triggering either for two separate metrics does not cause Resource Balancer to run.

The following code example shows that just like balancing thresholds, activity thresholds are configured per metric via the FabricSettings element within the cluster manifest.

``` xml
<FabricSettings>
  <Section Name="MetricActivityThresholds">
    <Parameter Name="MetricName" Value="1536"/>
  </Section>
</FabricSettings>
```

- PLBRefreshInterval--Governs how frequently Resource Balancer scans the information that it must check for constraint violations. Constraint violations include placement constraints that are not met, services with fewer than their required number of instances or replicas, nodes over capacity for some metric, overloaded fault or upgrade domains, or cluster imbalances. Resource Balancer identifies constraint violations by using the balancing and activity thresholds and its current view of the load on the nodes in the cluster. The refresh interval is defined in seconds, and the default is 1. Frequency of constraint check and placement can alternatively be controlled by two new intervals (MinConstraintCheckInterval and MinPlacementInterval). If the new parameters are defined, PLBRefreshInterval will not be used and cannot be defined.

- MinConstraintCheckInterval--Governs how frequently Resource Balancer scans the information that it must check for constraint violations. Constraint violations include placement constraints that are not met, services with fewer than their required number of instances or replicas, nodes over capacity for some metric, overloaded fault or upgrade domains, or cluster imbalances. Resource Balancer identifies constraint violations by using the balancing and activity thresholds and its current view of the load on the nodes in the cluster. The constraint check interval is defined in seconds. If the constraint check interval is not defined, its default value will be equal to the value of PLBRefreshInterval. (Both values cannot be specified at the same time.)

- MinPlacementInterval--Governs how frequently Resource Balancer checks if there are new instances or replicas that need to be placed and tries to place them. The placement interval is defined in seconds. If the placement interval is not defined, the default value is equal to the value of PLBRefreshInterval. (Both values cannot be specified at the same time.)

- MinLoadBalancingInterval--Establishes the minimum amount of time between resource-balancing rounds. If Resource Balancer took action based on information from the scan that is performed during the last PLBRefreshInterval interval, it does not run again for at least the same amount of time. It is defined in seconds, and the default is 5.

Note that these values are aggressive, but that load balancing overall occurs in the cluster only if the balancing and activity thresholds are met for a given metric. The following code example shows that if accurate and active load balancing is not required for a particular cluster, these values can be made less aggressive through configuration within the FabricSettings element. In this example configuration, the minimum time between two constraint checks is 10 seconds and the minimum time for placement is 5 seconds, while load balancing will occur every 5 minutes. Note that PLBRefreshInterval is not defined in this case.

``` xml
<Section Name="PlacementAndLoadBalancing">
  <Parameter Name="MinPlacementInterval" Value="5" />
  <Parameter Name="MinConstraintChecknterval" Value="10" />
  <Parameter Name="MinLoadBalancingInterval" Value="600" />
</Section>
```

In the second example configuration below, we have PLBRefreshInterval and MinLoadBalancingInterval defined. Since PLBRefreshInterval is set to 2 seconds, both MinPlacementInterval and MinConstraintCheckInterval will have their value set to 2 seconds as well.

``` xml
<Section Name="PlacementAndLoadBalancing">
  <Parameter Name="PLBRefreshInterval" Value="2" />
  <Parameter Name="MinLoadBalancingInterval" Value="600" />
</Section>
```

<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps

For more information: [Resource Balancer architecture](service-fabric-resource-balancer-architecture.md)


[Image1]: media/service-fabric-resource-balancer-cluster-description/FD1.png
[Image2]: media/service-fabric-resource-balancer-cluster-description/FD2.png
[Image3]: media/service-fabric-resource-balancer-cluster-description/UD.png
[Image4]: media/service-fabric-resource-balancer-cluster-description/NC.png
[Image5]: media/service-fabric-resource-balancer-cluster-description/Config.png
[Image6]: media/service-fabric-resource-balancer-cluster-description/Thresholds.png

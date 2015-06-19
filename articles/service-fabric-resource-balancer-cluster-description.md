<properties
   pageTitle="Resource Balancer Cluster Description"
   description="Specifying a cluster description for the Resource Balancer"
   services="service-fabric"
   documentationCenter=".net"
   authors="abhic"
   manager="timlt"
   editor=""/>

<tags
   ms.service="Service-Fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="04/27/2015"
   ms.author="abhic"/>

# Cluster Description

The Service Fabric Resource Balancer provides several mechanisms to describe a cluster. During runtime, the Resource Balancer uses these pieces of information to ensure that it places services in ways that ensure high availability of the services running in the cluster while also ensuring maximum utilization of the cluster resources. The Resource Balancer features that describe a cluster are fault domains, upgrade domains, node properties, and node capacities. Additionally, the Resource Balancer has some configuration options that can tweak its performance.

## Key Concepts

### Fault Domains:

Fault domains enable cluster administrators to define the physical nodes that are likely to experience failure at the same time due to shared physical dependencies such as power and networking sources. Fault domains typically represent hierarchies that are related to these shared dependencies, with more nodes likely to fail together from a higher point in the fault domain tree. The following figure shows several nodes that are organized via hierarchical fault domains in the order of data center, rack, and blade.

![Fault Domains][Image1]

 During runtime, the Service Fabric Resource Manager considers the fault domains in the cluster and attempts to spread out the replicas for a given service so that they are all in separate fault domains. This process helps ensure, in case of failure of any one fault domain, that the availability of that service and its state is not compromised. The following figure shows the replicas of a service that is spread over several fault domains even though there is enough room to concentrate them in only one or two domains.

![Fault Domains][Image2]

Fault domains are configured within the cluster manifest. Each node is defined to be within a particular fault domain. During runtime, the Resource Manager combines the reports from all the nodes to develop a complete overview of all of the fault domains in the system.

### Upgrade Domains

Upgrade domains are another piece of information that is consumed by the Resource Manager. Upgrade domains, like fault domains, describe sets of nodes that are shut down for upgrades at approximately the same time. Upgrade domains are not hierarchical and can be thought of as tags.

Whereas fault domains are defined by the physical layout of the nodes in the cluster, upgrade domains are determined by cluster administrators that are based on policies. The policies are related to upgrades within the cluster. More upgrade domains make upgrades more granular by limiting impact on the running cluster and services and by preventing any failure from affecting a large number of services. Depending on other policies, such as the time that Service Fabric should wait after upgrading a domain before Service Fabric moves to the next domain, more upgrade domains can also increase the amount of time it takes to complete an upgrade in the cluster.

For these reasons, the Resource Manager collects upgrade domain information and spreads replicas among the upgrade domains in a cluster just like fault domains. Upgrade domains might or might not correspond one-to-one with fault domains, but generally are not expected to correspond one-to-one. The following figure shows a layer of several upgrade domains on top of the previously defined fault domains. The Resource Manager still spreads the replicas across domains so that no fault or upgrade domain becomes concentrated with replicas to ensure high availability for the service, in spite of either upgrades or faults in the cluster.

![Upgrade Domains][Image3]

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
- In Azure deployments, fault domains and upgrade domains are assigned by Azure; therefore, the definition of your nodes and roles within the Infrastructure option for Azure does not include fault domain or upgrade domain information.

### Node Properties
Node properties are user-defined key/value pairs that provide extra metadata for a given node. Examples of node properties include whether the node had a hard drive or video card, the number of spindles in its hard drive, cores, and other physical properties.

Node properties can also be used to specify more abstract properties to aid in placing policy decisions. For example, several nodes within a cluster can be assigned a "color" as a means of segmenting the cluster into different sections. The code example shows that node properties are defined for nodes via the cluster manifest as a part of node type definitions, which can then be applied to multiple nodes within the cluster.

The NodeName, NodeType, FaultDomain, and UpgradeDomain placement properties have default values.  Service Fabric will automatically supply default values for you so that you can use them when creating your service. Users should not specify their own placement properties with these same names.

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

During runtime, the Resource Balancer uses node property information to ensure that services that require specific capabilities are placed on the appropriate nodes.

### Node Capacities
Node capacities are key/value pairs that define the name and amount of a particular resource that a particular node has available for consumption. The code example shows a node that it has capacity for a metric called "MemoryInMb" and that it has 2048 MB in memory available by default. Capacities are defined via the cluster manifest, much like node properties.

``` xml
<NodeType Name="NodeType03">
  <Capacities>
    <Capacity Name="MemoryInMB" Value="2048"/>
    <Capacity Name="DiskSpaceInGB" Value="1024"/>
  </Capacities>
</NodeType>
```
![Node Capacity][Image4]

Because services that run on a node can update their capacity requirements via Reporting Load, the Resource Balancer also checks periodically whether a node is at or over capacity for any of its metrics. If it is, the Resource Balancer can move services to less loaded nodes to decrease resource contention and to improve overall performance and utilization.

Note that while a given metric could also be listed in the property section of the node type, it is better to list it as a capacity if this is a property of the node that can be consumed during runtime. To list it additionally as a property enables a service that depends on "minimum hardware requirements” to query for the node with placement constraints, which might be necessary if the resource is consumed by other services during runtime. We recommend also including it as a capacity so that the Resource Balancer can take additional actions.

When new services are created, the Service Fabric Cluster Resource Balancer uses the information about the capacity of existing nodes and the consumption of existing services to determine if there is sufficient available in the capacity to place the entire new service. If there is insufficient capacity then the Create Service request is rejected with an error message indicating that there is insufficient cluster capacity remaining.


### Resource Balancer Configurations

Within the cluster manifest, the following several different configuration values that define the overall behavior of the Resource Balancer:

- Balancing Thresholds govern how imbalanced the cluster can become with regard to a particular metric before the Resource Balancer reacts. A balancing threshold is the maximum ratio between the maximally used and minimally used nodes that the Resource Balancer allows to exist before it rebalances the clusters.

The following figure shows two examples, where the balancing threshold for the given metric to be is 10.

![Balancing Threshold][Image5]

Note that at this time, the "utilization" on a node does not take into consideration the size of the node as determined by the capacity of the node, but only the absolute use that is currently reported on the node for the specified metric.

The code example shows that balancing thresholds for metrics are configured per metric via the FabricSettings element within the cluster manifest.

``` xml
<FabricSettings>
  <Section Name="MetricBalancingThresholds">
    <Parameter Name="MetricName" Value="10"/>
  </Section>
</FabricSettings>
```

- Activity Thresholds act as a gate on how often the Resource Balancer runs by limiting the cases that the Resource Balancer reacts to when a significant absolute amount of load is present. In this way, if the cluster is not very busy for a particular metric, the Resource Balancer does not run even if that small amount of metric is very imbalanced within the cluster. This measure prevents wasting resources by rebalancing the cluster for substantively little gain. The following figure shows that the balancing threshold for the metric is 4 and that the activity threshold is 1536.

![Activity Threshold][Image6]
Note also that both the activity and balancing thresholds must be exceeded for the same metric to cause the Resource Balancer to run. Triggering either for two separate metrics does not cause the Resource Balancer to run.

The code example shows that just like balancing thresholds, activity thresholds are configured per metric via the FabricSettings element within the cluster manifest.

``` xml
<FabricSettings>
  <Section Name="MetricActivityThresholds">
    <Parameter Name="MetricName" Value="1536"/>
  </Section>
</FabricSettings>
```

- PLBRefreshInterval – Governs how frequently the Resource Balancer scans the information that it must check for constraint violations. Constraint violations include placement constraints that are not met, services with fewer than their required number of instances or replicas, nodes over capacity for some metric, and overloaded fault or upgrade domains, or cluster imbalances by using the balancing and activity thresholds and its current view of load on the nodes in the cluster. The refresh interval is defined in seconds, and the default is 1. Frequency of constraint check and placement can alternatively be controlled by two new intervals (MinConstraintCheckInterval and MinPlacementInterval) and if the new parameters are defined, PLBRefreshInterval will not be used and cannot be defined.

- MinConstraintCheckInterval - Governs how frequently the Resource Balancer scans the information that it must check for constraint violations. Constraint violations include placement constraints that are not met, services with fewer than their required number of instances or replicas, nodes over capacity for some metric, and overloaded fault or upgrade domains, or cluster imbalances by using the balancing and activity thresholds and its current view of load on the nodes in the cluster. The constraint check interval is defined in seconds. If constraint check interval is not defined, its default value will be equal to the value of PLBRefreshInterval (both values cannot be specified at the same time).

- MinPlacementInterval – Governs how frequently the Resource Balancer checks if there are new instances or replicas that need to be placed and tries to place them. The placement interval is defined in seconds. If placement interval is not defined, default value is equal to the value of PLBRefreshInterval (both values cannot be specified at the same time).

- MinLoadBalancingInterval – Establishes the minimum amount of time between Resource Balancing rounds. If the Resource Balancer took action based on information from the scan that is performed during the last PLBRefreshInterval interval, it does not run again for at least the same amount of time. It is defined in seconds, and the default is 5.

Note that these values are aggressive, but that load balancing overall only occurs in the cluster if the balancing and activity thresholds are met for a given metric. The code example shows that if accurate and active load balancing is not required for a particular cluster, these values can be made less aggressive through the following configuration within the FabricSettings element. In this example configuration, minimal time distance between two constraint checks is 10 seconds, for placement 5 seconds while load balancing will occur every 5 minutes. Note that PLBRefreshInterval is not defined in this case.

``` xml
<Section Name="PlacementAndLoadBalancing">
  <Parameter Name="MinPlacementInterval" Value="5" />
  <Parameter Name="MinConstraintChecknterval" Value="10" />
  <Parameter Name="MinLoadBalancingInterval" Value="600" />
</Section>
```

In the second example configuration below we have PLBRefreshInterval and MinLoadBalancingInterval defined. Since PLBRefreshInterval is set to 2 seconds, both MinPlacementInterval and MinConstraintCheckInterval will have their value set to 2 seconds as well.

``` xml
<Section Name="PlacementAndLoadBalancing">
  <Parameter Name="PLBRefreshInterval" Value="2" />
  <Parameter Name="MinLoadBalancingInterval" Value="600" />
</Section>
```

<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps

For more information: [Resource Balancer Architecture](service-fabric-resource-balancer-architecture.md)


[Image1]: media/service-fabric-resource-balancer-cluster-description/FD1.png
[Image2]: media/service-fabric-resource-balancer-cluster-description/FD2.png
[Image3]: media/service-fabric-resource-balancer-cluster-description/UD.png
[Image4]: media/service-fabric-resource-balancer-cluster-description/NC.png
[Image5]: media/service-fabric-resource-balancer-cluster-description/Config.png
[Image6]: media/service-fabric-resource-balancer-cluster-description/Thresholds.png

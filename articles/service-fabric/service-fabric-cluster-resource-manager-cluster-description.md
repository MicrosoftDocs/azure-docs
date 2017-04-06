---
title: Resource Balancer cluster description | Microsoft Docs
description: Describing a Service Fabric cluster by specifying Fault Domains, Upgrade Domains, node properties, and node capacities to the Cluster Resource Manager.
services: service-fabric
documentationcenter: .net
author: masnider
manager: timlt
editor: ''

ms.assetid: 55f8ab37-9399-4c9a-9e6c-d2d859de6766
ms.service: Service-Fabric
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 01/05/2017
ms.author: masnider
---

# Describing a service fabric cluster
The Service Fabric Cluster Resource Manager provides several mechanisms for describing a cluster. During runtime, the Cluster Resource Manager uses this information to ensure high availability of the services running in the cluster. While enforcing these important rules, it also attempts to optimize the cluster's resource consumption.

## Key concepts
The Cluster Resource Manager supports several features that describe a cluster:

* Fault Domains
* Upgrade Domains
* Node Properties
* Node Capacities

## Fault domains
A Fault Domain is any area of coordinated failure. A single machine is a Fault Domain (since it can fail on its own for various reasons, from power supply failures to drive failures to bad NIC firmware). Machines connected to the same Ethernet switch are in the same Fault Domain, as are those machines sharing a single source of power. Since it's natural for hardware faults to overlap, Fault Domains are inherently hierarchal and are represented as URIs in Service Fabric.

When you set up your own cluster, you need to think through these different areas of failure. It is important that Fault Domains are set up correctly since Service Fabric uses this information to safely place services. Service Fabric doesn't want to place services such that the loss of a Fault Domain (caused by the failure of some component) causes services to go down. In the Azure environment Service Fabric uses the Fault Domain information provided by the environment to correctly configure the nodes in the cluster on your behalf.

In the graphic below we color all the entities that contribute to Fault Domains and list all the different Fault Domains that result. In this example, we have datacenters ("DC"), racks ("R"), and blades ("B"). Conceivably, if each blade holds more than one virtual machine, there could be another layer in the Fault Domain hierarchy.

<center>
![Nodes organized via Fault Domains][Image1]
</center>

During runtime, the Service Fabric Cluster Resource Manager considers the Fault Domains in the cluster and plans a layout.  It attempts to spread out the stateful replicas or stateless instances for a given service so that they are in separate Fault Domains. This process helps ensure that if there is a failure of any one Fault Domain (at any level in the hierarchy), that the availability of that service is not compromised.

Service Fabric’s Cluster Resource Manager doesn’t care how many layers there are in the Fault Domain hierarchy. However, it tries to ensure that the loss of any one portion of the hierarchy doesn’t impact the services running on top of it. Because of this, it is best if there are the same number of nodes at each level of depth in the Fault Domain hierarchy. Keeping the levels balanced prevents one portion of the hierarchy from containing more services than others. Doing otherwise would contribute to imbalances in the load of individual nodes and make the failure of certain domains more critical than others.

If the “tree” of Fault Domains is unbalanced in your cluster, it makes it harder for the Cluster Resource Manager to figure the best allocation of services. Imbalanced Fault Domains layouts mean that the loss of a particular domain can impact the availability of the cluster more than others. As a result, the Cluster Resource Manager is torn between its two goals: It was to use the machines in that “heavy” domain by placing services on them, and it wants to place services so that the loss of a domain doesn’t cause problems. What does this look like?

<center>
![Two different cluster layouts][Image2]
</center>

In the diagram above, we show two different example cluster layouts. In the first example the nodes are distributed evenly across the Fault Domains. In the other one Fault Domain ends up with many more nodes. If you ever stand up your own cluster on-premise or in another environment, it’s something you have to think about.

In Azure the choice of which Fault Domain contains a node is managed for you. However, depending on the number of nodes that you provision you can still end up with Fault Domains with more nodes in them than others. For example, say you have five Fault Domains but provision seven nodes for a given NodeType. In this case the first two Fault Domains end up with more nodes. If you continue to deploy more NodeTypes with only a couple instances, the problem gets worse.

## Upgrade domains
Upgrade Domains are another feature that helps the Service Fabric Cluster Resource Manager understand the layout of the cluster so that it can plan ahead for failures. Upgrade Domains define sets of nodes that are upgraded at the same time.

Upgrade Domains are a lot like Fault Domains, but with a couple key differences. First, while Fault Domains are rigorously defined by the areas of coordinated hardware failures, Upgrade Domains are defined by policy. With Upgrade Domains, you get to decide how many you want rather than it being dictated by the environment. Another difference is that (today at least) Upgrade Domains are not hierarchical – they are more like a simple tag.

The following diagram shows three Upgrade Domains are striped across three Fault Domains. It also shows one possible placement for three different replicas of a stateful service, where each ends up in different Fault and Upgrade Domains. This placement allows us to lose a Fault Domain while in the middle of a service upgrade and still have one copy of the code and data.

<center>
![Placement With Fault and Upgrade Domains][Image3]
</center>

There are pros and cons to having large numbers of Upgrade Domains. With more Upgrade Domains each step of the upgrade is more granular and therefore affects a smaller number of nodes or services. This results in fewer services having to move at a time, introducing less churn into the system. This tends to also improve reliability (since less of the service is impacted by any issue introduced during the upgrade). More Upgrade Domains also means that you need less available overhead on other nodes to handle the impact of the upgrade. For example, if you have five Upgrade Domains, the nodes in each are handling roughly 20% of your traffic. If you need to take down that Upgrade Domain for an upgrade, that load needs to go somewhere. More Upgrade Domains means less overhead that must be maintained on the other nodes in the cluster.

The downside of having many Upgrade Domains is that upgrades tend to take longer. Service Fabric waits a short period of time after an Upgrade Domain is completed before proceeding. This delay is so that issues introduced by the upgrade have a chance to show up and be detected. The tradeoff is acceptable because it prevents bad changes from affecting too much of the service at a time.

Too few Upgrade Domains has its own side effects – while each individual Upgrade Domain is down and being upgraded a large portion of your overall capacity is unavailable. For example, if you only have three Upgrade Domains you are taking down about 1/3 of your overall service or cluster capacity at a time. Having so much of your service down at once isn’t desirable since you have to have enough capacity in the rest of your cluster to handle the workload. Maintaining that buffer means that in the normal case those nodes are less-loaded than they would otherwise be, increasing the cost of running your service.

There’s no real limit to the total number of fault or Upgrade Domains in an environment, or constraints on how they overlap. Common structures that we’ve seen are:

* Fault Domains and Upgrade Domains mapped 1:1
* One Upgrade Domain per Node (physical or virtual OS instance)
* A “striped” or “matrix” model where the Fault Domains and Upgrade Domains form a matrix with machines usually running down the diagonals

<center>
![Fault and Upgrade Domain Layouts][Image4]
</center>

There’s no best answer which layout to choose, each has some pros and cons. For example, the 1FD:1UD model is fairly simple to set up. The 1 UD per Node model is most like what people are used to from managing small sets of machines in the past where each would be taken down independently.

The most common model (and the one used in Azure) is the FD/UD matrix, where the FDs and UDs form a table and nodes are placed starting along the diagonal. Whether this ends up sparse or packed depends on the total number of nodes compared to the number of FDs and UDs. Put differently, for sufficiently large clusters, almost everything ends up looking like the dense matrix pattern, shown in the bottom right option of the image above.

## Fault and Upgrade Domain constraints and resulting behavior
The Cluster Resource Manager treats the desire to keep a service balanced across fault and Upgrade Domains as a constraint. You can find out more about constraints in [this article](service-fabric-cluster-resource-manager-management-integration.md). The Fault and Upgrade Domain constraints state: "For a given service partition there should never be a difference *greater than one* in the number of service objects (stateless service instances or stateful service replicas) between two domains."  Practically what this means is that for a given service certain moves or arrangements might not be valid, because they would violate the Fault or Upgrade Domain constraints.

Let's look at one example. Let's say that we have a cluster with six nodes, configured with five Fault Domains and five Upgrade Domains.

|  | FD0 | FD1 | FD2 | FD3 | FD4 |
| --- |:---:|:---:|:---:|:---:|:---:|
| **UD0** |N1 | | | | |
| **UD1** |N6 |N2 | | | |
| **UD2** | | |N3 | | |
| **UD3** | | | |N4 | |
| **UD4** | | | | |N5 |

Now let's say that we create a service with a TargetReplicaSetSize of five. The replicas land on N1-N5. In fact, N6 will never be used no matter how many services you create. But why? Let's look at the difference between the current layout and what would happen if N6 is chosen.

Here's the layout we got and the total number of replicas per Fault and Upgrade Domain:

|  | FD0 | FD1 | FD2 | FD3 | FD4 | UDTotal |
| --- |:---:|:---:|:---:|:---:|:---:|:---:|
| **UD0** |R1 | | | | |1 |
| **UD1** | |R2 | | | |1 |
| **UD2** | | |R3 | | |1 |
| **UD3** | | | |R4 | |1 |
| **UD4** | | | | |R5 |1 |
| **FDTotal** |1 |1 |1 |1 |1 |- |

This layout is balanced in terms of nodes per Fault Domain and Upgrade Domain. It is also balanced in terms of the number of replicas per Fault and Upgrade Domain. Each domain has the same number of nodes and the same number of replicas.

Now, let's look at what would happen if we'd used N6 instead of N2. How would the replicas be distributed then?

|  | FD0 | FD1 | FD2 | FD3 | FD4 | UDTotal |
| --- |:---:|:---:|:---:|:---:|:---:|:---:|
| **UD0** |R1 | | | | |1 |
| **UD1** |R5 | | | | |1 |
| **UD2** | | |R2 | | |1 |
| **UD3** | | | |R3 | |1 |
| **UD4** | | | | |R4 |1 |
| **FDTotal** |2 |0 |1 |1 |1 |- |

Notice anything? This layout violates our definition for the Fault Domain constraint. FD0 has two replicas, while FD1 has zero, making the difference between FD0 and FD1 a total of two. The Cluster Resource Manager does not allow this arrangement. Similarly if we picked N2 and N6 (instead of N1 and N2) we'd get:

|  | FD0 | FD1 | FD2 | FD3 | FD4 | UDTotal |
| --- |:---:|:---:|:---:|:---:|:---:|:---:|
| **UD0** | | | | | |0 |
| **UD1** |R5 |R1 | | | |2 |
| **UD2** | | |R2 | | |1 |
| **UD3** | | | |R3 | |1 |
| **UD4** | | | | |R4 |1 |
| **FDTotal** |1 |1 |1 |1 |1 |- |

While this layout is balanced in terms of Fault Domains, it is now violating the Upgrade Domain constraint (since UD0 has zero replicas while UD1 has two). This layout is also invalid

## Configuring fault and Upgrade Domains
Defining Fault Domains and Upgrade Domains is done automatically in Azure hosted Service Fabric deployments. Service Fabric picks up and uses the environment information from Azure.

If you’re creating your own cluster (or want to run a particular topology in development), you provide the Fault Domain and Upgrade Domain information yourself. In this example, we define a nine node local development cluster that spans three “datacenters” (each with three racks). This cluster also has three Upgrade Domains striped across those three datacenters. In the cluster manifest template, it looks something like this:

ClusterManifest.xml

```xml
  <Infrastructure>
    <!-- IsScaleMin indicates that this cluster runs on one-box /one single server -->
    <WindowsServer IsScaleMin="true">
      <NodeList>
        <Node NodeName="Node01" IPAddressOrFQDN="localhost" NodeTypeRef="NodeType01" FaultDomain="fd:/DC01/Rack01" UpgradeDomain="UpgradeDomain1" IsSeedNode="true" />
        <Node NodeName="Node02" IPAddressOrFQDN="localhost" NodeTypeRef="NodeType02" FaultDomain="fd:/DC01/Rack02" UpgradeDomain="UpgradeDomain2" IsSeedNode="true" />
        <Node NodeName="Node03" IPAddressOrFQDN="localhost" NodeTypeRef="NodeType03" FaultDomain="fd:/DC01/Rack03" UpgradeDomain="UpgradeDomain3" IsSeedNode="true" />
        <Node NodeName="Node04" IPAddressOrFQDN="localhost" NodeTypeRef="NodeType04" FaultDomain="fd:/DC02/Rack01" UpgradeDomain="UpgradeDomain1" IsSeedNode="true" />
        <Node NodeName="Node05" IPAddressOrFQDN="localhost" NodeTypeRef="NodeType05" FaultDomain="fd:/DC02/Rack02" UpgradeDomain="UpgradeDomain2" IsSeedNode="true" />
        <Node NodeName="Node06" IPAddressOrFQDN="localhost" NodeTypeRef="NodeType06" FaultDomain="fd:/DC02/Rack03" UpgradeDomain="UpgradeDomain3" IsSeedNode="true" />
        <Node NodeName="Node07" IPAddressOrFQDN="localhost" NodeTypeRef="NodeType07" FaultDomain="fd:/DC03/Rack01" UpgradeDomain="UpgradeDomain1" IsSeedNode="true" />
        <Node NodeName="Node08" IPAddressOrFQDN="localhost" NodeTypeRef="NodeType08" FaultDomain="fd:/DC03/Rack02" UpgradeDomain="UpgradeDomain2" IsSeedNode="true" />
        <Node NodeName="Node09" IPAddressOrFQDN="localhost" NodeTypeRef="NodeType09" FaultDomain="fd:/DC03/Rack03" UpgradeDomain="UpgradeDomain3" IsSeedNode="true" />
      </NodeList>
    </WindowsServer>
  </Infrastructure>
```

via ClusterConfig.json for Standalone deployments

```json
"nodes": [
  {
    "nodeName": "vm1",
    "iPAddress": "localhost",
    "nodeTypeRef": "NodeType0",
    "faultDomain": "fd:/dc1/r0",
    "upgradeDomain": "UD1"
  },
  {
    "nodeName": "vm2",
    "iPAddress": "localhost",
    "nodeTypeRef": "NodeType0",
    "faultDomain": "fd:/dc1/r0",
    "upgradeDomain": "UD2"
  },
  {
    "nodeName": "vm3",
    "iPAddress": "localhost",
    "nodeTypeRef": "NodeType0",
    "faultDomain": "fd:/dc1/r0",
    "upgradeDomain": "UD3"
  },
  {
    "nodeName": "vm4",
    "iPAddress": "localhost",
    "nodeTypeRef": "NodeType0",
    "faultDomain": "fd:/dc2/r0",
    "upgradeDomain": "UD1"
  },
  {
    "nodeName": "vm5",
    "iPAddress": "localhost",
    "nodeTypeRef": "NodeType0",
    "faultDomain": "fd:/dc2/r0",
    "upgradeDomain": "UD2"
  },
  {
    "nodeName": "vm6",
    "iPAddress": "localhost",
    "nodeTypeRef": "NodeType0",
    "faultDomain": "fd:/dc2/r0",
    "upgradeDomain": "UD3"
  },
  {
    "nodeName": "vm7",
    "iPAddress": "localhost",
    "nodeTypeRef": "NodeType0",
    "faultDomain": "fd:/dc3/r0",
    "upgradeDomain": "UD1"
  },
  {
    "nodeName": "vm8",
    "iPAddress": "localhost",
    "nodeTypeRef": "NodeType0",
    "faultDomain": "fd:/dc3/r0",
    "upgradeDomain": "UD2"
  },
  {
    "nodeName": "vm9",
    "iPAddress": "localhost",
    "nodeTypeRef": "NodeType0",
    "faultDomain": "fd:/dc3/r0",
    "upgradeDomain": "UD3"
  }
],
```

> [!NOTE]
> In Azure deployments, Fault Domains and Upgrade Domains are assigned by Azure. Therefore, the definition of your nodes and roles within the infrastructure option for Azure does not include Fault Domain or Upgrade Domain information.
>
>

## Placement constraints and node properties
Sometimes (in fact, most of the time) you’re going to want to ensure that certain workloads run only on certain nodes or certain sets of nodes in the cluster. For example, some workload may require GPUs or SSDs while others may not. A great example of targeting hardware to particular workloads is almost every n-tier architecture out there. In these architectures certain machines serve as the front end/interface serving side of the application (and hence are probably exposed to the internet). Different sets of machines (often with different hardware resources) handle the work of the compute or storage layers (and usually are not exposed to the internet). Service Fabric expects that even in a microservices world there are cases where particular workloads need to run on particular hardware configurations, for example:

* an existing n-tier application has been “lifted and shifted” into a Service Fabric environment
* a workload wants to run on specific hardware for performance, scale, or security isolation reasons
* A workload should be isolated from other workloads for policy or resource consumption reasons

To support these sorts of configurations, Service Fabric has a first class notion of tags that can be applied to nodes. These are called placement constraints. Placement constraints can be used to indicate where certain services should run. The set of constraints is extensible - any key/value pair can work.

<center>
![Cluster Layout Different Workloads][Image5]
</center>

The different key/value tags on nodes are known as node placement *properties* (or just node properties). The value specified in the node property can be a string, bool, or signed long. The statement at the service is called a placement *constraint* since it constrains where the service can run in the cluster. The constraint can be any Boolean statement that operates on the different node properties in the cluster. The valid selectors in these boolean statements are:

1) conditional checks for creating particular statements

| Statement | Syntax |
| --- |:---:|
| "equal to" | "==" |
| "not equal to" | "!=" |
| "greater than" | ">" |
| "greater than or equal to" | ">=" |
| "less than" | "<" |
| "less than or equal to" | "<=" |

2) boolean statements for grouping and logical operations

| Statement | Syntax |
| --- |:---:|
| "and" | "&&" |
| "or" | "&#124;&#124;" |
| "not" | "!" |
| "group as single statement" | "()" |

Here are some examples of basic constraint statements.

  * `"Value >= 5"`
  * `"NodeColor != green"`
  * `"((OneProperty < 100) || ((AnotherProperty == false) && (OneProperty >= 100)))"`

Only nodes where the overall statement evaluates to “True” can have the service placed on it. Nodes that do not have a property defined do not match any placement constraint containing that property.

Service Fabric defines some default node properties that can be used automatically without the user having to define them. As of this writing the default properties defined at each node are the **NodeType** and the **NodeName**. So for example you could write a placement constraint as `"(NodeType == NodeType03)"`. Generally we have found NodeType to be one of the most commonly used properties. It is useful since it corresponds 1:1 with a type of a machine, which in turn corresponds to a type of workload in a traditional n-tier application architecture.

<center>
![Placement Constraints and Node Properties][Image6]
</center>

Let’s say that the following node properties were defined for a given node type:

ClusterManifest.xml

```xml
    <NodeType Name="NodeType01">
      <PlacementProperties>
        <Property Name="HasSSD" Value="true"/>
        <Property Name="NodeColor" Value="green"/>
        <Property Name="SomeProperty" Value="5"/>
      </PlacementProperties>
    </NodeType>
```

via ClusterConfig.json for Standalone deployments or Template.json for Azure hosted clusters. In your Azure Resource Manager template for a cluster things like the node type name are likely parameterized, and would look something like "[parameters('vmNodeType1Name')]" rather than "NodeType01".

```json
"nodeTypes": [
    {
        "name": "NodeType01",
        "placementProperties": {
            "HasSSD": "true",
            "NodeColor": "green",
            "SomeProperty": "5"
        },
    }
],
```

You can create service placement *constraints* for a service like as follows:

C#

```csharp
FabricClient fabricClient = new FabricClient();
StatefulServiceDescription serviceDescription = new StatefulServiceDescription();
serviceDescription.PlacementConstraints = "(HasSSD == true && SomeProperty >= 4)";
// add other required servicedescription fields
//...
await fabricClient.ServiceManager.CreateServiceAsync(serviceDescription);
```

Powershell:

```posh
New-ServiceFabricService -ApplicationName $applicationName -ServiceName $serviceName -ServiceTypeName $serviceType -Stateful -MinReplicaSetSize 2 -TargetReplicaSetSize 3 -PartitionSchemeSingleton -PlacementConstraint "HasSSD == true && SomeProperty >= 4"
```

If you are sure that all nodes of NodeType01 are valid, you could also select that node type.

One of the cool things about a service’s placement constraints is that they can be updated dynamically during runtime. So if you need to, you can move a service around in the cluster, add and remove requirements, etc. Service Fabric takes care of ensuring that the service stays up and available even when these types of changes are ongoing.

C#:

```csharp
StatefulServiceUpdateDescription updateDescription = new StatefulServiceUpdateDescription();
updateDescription.PlacementConstraints = "NodeType == NodeType01";
await fabricClient.ServiceManager.UpdateServiceAsync(new Uri("fabric:/app/service"), updateDescription);
```

Powershell:

```posh
Update-ServiceFabricService -Stateful -ServiceName $serviceName -PlacementConstraints "NodeType == NodeType01"
```

Placement constraints (along with many other orchestrator controls that we’re going to talk about) are specified for every different named service instance. Updates always take the place of (overwrite) what was previously specified.

The properties on a node are defined via the cluster definition and hence cannot be updated without an upgrade to the cluster. The upgrade of a node's properties and requires each affected node to go down and then come back up.

## Capacity
One of the most important jobs of any orchestrator is to help manage resource consumption in the cluster. The last thing you want if you’re trying to run services efficiently is a bunch of nodes that are hot while others are cold. Hot nodes lead to resource contention and poor performance, and cold nodes represent wasted resources/increased cost. Before we talk about balancing, what about just ensuring that nodes don’t run out of resources in the first place?

Service Fabric represents resources as `Metrics`. Metrics are any logical or physical resource that you want to describe to Service Fabric. Examples of metrics are things like “WorkQueueDepth” or “MemoryInMb”. For information configuring metrics and their uses, see [this article](service-fabric-cluster-resource-manager-metrics.md)

Metrics are different from placements constraints and node properties. Node properties are static descriptors of the nodes themselves, whereas metrics are about resources that nodes have and that services consume when they are running on a node. A node property could be "HasSSD" and could be set to true or false. The amount of space available on that SSD (and consumed by services) would be a metric like “DriveSpaceInMb”. The node would have its capacity for “DriveSpaceInMb” to the amount of total non-reserved space on the drive. Services would report how much of the metric they used during runtime.

It is important to note that just like for placement constraints and node properties, the Service Fabric Cluster Resource Manager doesn't understand what the names of the metrics mean. Metric names are just strings. It is a good practice to declare units as a part of the metric names that you create when it could be ambiguous.

If you turned off all resource *balancing*, Service Fabric’s Cluster Resource Manager would still try to ensure that no node ended up over its capacity. Generally this is possible unless the cluster as a whole is too full. Capacity is another *constraint* that the Cluster Resource Manager uses to understand how much of a resource a node has. Remaining capacity is also tracked for the cluster as a whole. Both the capacity and the consumption at the service level are expressed in terms of metrics. So for example, the metric might be "MemoryInMb" and a given Node may have a capacity for "MemoryInMb" of 2048. Some service running on that node can say it is currently consuming 64 of "MemoryInMb".

During runtime, the Cluster Resource Manager tracks how much of each resource is present on each node and how much is remaining. It does this by subtracting any declared usage of each service running on that node from the node's capacity. With this information, the Service Fabric Cluster Resource Manager can figure out where to place or move replicas so that nodes don’t go over capacity.

C#:

```csharp
StatefulServiceDescription serviceDescription = new StatefulServiceDescription();
ServiceLoadMetricDescription metric = new ServiceLoadMetricDescription();
metric.Name = "MemoryInMb";
metric.PrimaryDefaultLoad = 64;
metric.SecondaryDefaultLoad = 64;
metric.Weight = ServiceLoadMetricWeight.High;
serviceDescription.Metrics.Add(metric);
await fabricClient.ServiceManager.CreateServiceAsync(serviceDescription);
```

Powershell:

```posh
New-ServiceFabricService -ApplicationName $applicationName -ServiceName $serviceName -ServiceTypeName $serviceTypeName –Stateful -MinReplicaSetSize 2 -TargetReplicaSetSize 3 -PartitionSchemeSingleton –Metric @("Memory,High,64,64)
```
<center>
![Cluster nodes and capacity][Image7]
</center>

You can see capacities defined in the cluster manifest:

ClusterManifest.xml

```xml
    <NodeType Name="NodeType02">
      <Capacities>
        <Capacity Name="MemoryInMb" Value="2048"/>
        <Capacity Name="DiskInMb" Value="512000"/>
      </Capacities>
    </NodeType>
```

via ClusterConfig.json for Standalone deployments or Template.json for Azure hosted clusters. In your Azure Resource Manager template for a cluster things like the node type name are likely parameterized, and would look something like "[parameters('vmNodeType2Name')]" rather than "NodeType02".

```json
"nodeTypes": [
    {
        "name": "NodeType02",
        "capacities": {
            "MemoryInMb": "2048",
            "DiskInMb": "512000"
        }
    }
],
```

It is also possible (and in fact common) that a service’s load changes dynamically. Say that a replica's load changed from 64 to 1024, but the node it was running on then only had 512 (of the "MemoryInMb" metric) remaining. Now that replica or instance's placement is invalid, since there's not enough room on that node. This can also happen if the combined usage of the replicas and instances on that node exceeds that node’s capacity. In either case the Cluster Resource Manager has to kick in and get the node back below capacity. It does this by moving one or more of the replicas or instances on that node to different nodes. When moving replicas, the Cluster Resource Manager tries to minimize the cost of those movements. Movement cost is discussed in [this article](service-fabric-cluster-resource-manager-movement-cost.md).

## Cluster capacity
So how do we keep the overall cluster from being too full? Well, with dynamic load there’s not a lot the Cluster Resource Manager can do. Services can have their load spike independently of actions taken by the Cluster Resource Manager. As a result, your cluster with plenty of headroom today may be underpowered when you become famous tomorrow. That said, there are some controls that are baked in to prevent basic problems. The first thing we can do is prevent the creation of new workloads that would cause the cluster to become full.

Say that you go to create a stateless service and it has some load associated with it (more on default and dynamic load reporting later). Let’s say that the service cares about the "DiskSpaceInMb" metric. Let's also say that it is going to consume five units of "DiskSpaceInMb" for every instance of the service. You want to create three instances of the service. Great! So that means that we need 15 units of "DiskSpaceInMb" to be present in the cluster in order for us to even be able to create these service instances. The Cluster Resource Manager is continually calculating the overall capacity and consumption of each metric, so it can easily determine if there's sufficient space in the cluster. If there isn't sufficient space, the Cluster Resource Manager rejects the create service call.

Since the requirement is only that there be 15 units available, this space could be allocated many different ways. For example, there could be one remaining unit of capacity on 15 different nodes, or three remaining units of capacity on five different nodes. As long as the Cluster Resource Manager can rearrange things so there's five units available on three nodes, it will eventually place the service. Such rearrangement is almost always possible unless the cluster as a whole is almost entirely full, the services are all very "bulky", or both.

## Buffered Capacity
Another feature the Cluster Resource Manager has that helps manage overall cluster capacity is the notion of some reserved buffer to the capacity specified at each node. Buffered Capacity allows reservation of some portion of the overall node capacity so that it is only used to place services during upgrades and node failures. Today buffer is specified globally per metric for all nodes via the cluster definition. The value you pick for the reserved capacity is a function of the number of Fault and Upgrade Domains you have in the cluster and how much overhead you want. More Fault and Upgrade Domains means that you can pick a lower number for your buffered capacity. If you have more domains, you can expect smaller amounts of your cluster to be unavailable during upgrades and failures. Specifying the buffer percentage only makes sense if you have also specified the node capacity for a metric.

Here's an example of how to specify buffered capacity:

ClusterManifest.xml

```xml
        <Section Name="NodeBufferPercentage">
            <Parameter Name="DiskSpace" Value="0.10" />
            <Parameter Name="Memory" Value="0.15" />
            <Parameter Name="SomeOtherMetric" Value="0.20" />
        </Section>
```

via ClusterConfig.json for Standalone deployments or Template.json for Azure hosted clusters:

```json
"fabricSettings": [
  {
    "name": "NodeBufferPercentage",
    "parameters": [
      {
          "name": "DiskSpace",
          "value": "0.10"
      },
      {
          "name": "Memory",
          "value": "0.15"
      },
      {
          "name": "SomeOtherMetric",
          "value": "0.20"
      }
    ]
  }
]
```

The creation of new services fails when the cluster is out of buffered capacity for a metric. This ensures that the cluster retains enough spare overhead so that upgrades and failures don’t cause nodes to go over capacity. Buffered capacity is optional but is recommended in any cluster that defines a capacity for a metric.

The Cluster Resource Manager exposes this information via PowerShell and the Query APIs. This lets you see the buffered capacity settings, the total capacity, and the current consumption for every metric in use in the cluster. Here we see an example of that output:

```posh
PS C:\Users\user> Get-ServiceFabricClusterLoadInformation
LastBalancingStartTimeUtc : 9/1/2016 12:54:59 AM
LastBalancingEndTimeUtc   : 9/1/2016 12:54:59 AM
LoadMetricInformation     :
                            LoadMetricName        : Metric1
                            IsBalancedBefore      : False
                            IsBalancedAfter       : False
                            DeviationBefore       : 0.192450089729875
                            DeviationAfter        : 0.192450089729875
                            BalancingThreshold    : 1
                            Action                : NoActionNeeded
                            ActivityThreshold     : 0
                            ClusterCapacity       : 189
                            ClusterLoad           : 45
                            ClusterRemainingCapacity : 144
                            NodeBufferPercentage  : 10
                            ClusterBufferedCapacity : 170
                            ClusterRemainingBufferedCapacity : 125
                            ClusterCapacityViolation : False
                            MinNodeLoadValue      : 0
                            MinNodeLoadNodeId     : 3ea71e8e01f4b0999b121abcbf27d74d
                            MaxNodeLoadValue      : 15
                            MaxNodeLoadNodeId     : 2cc648b6770be1bc9824fa995d5b68b1
```

## Next steps
* For information on the architecture and information flow within the Cluster Resource Manager, check out [this article ](service-fabric-cluster-resource-manager-architecture.md)
* Defining Defragmentation Metrics is one way to consolidate load on nodes instead of spreading it out. To learn how to configure defragmentation, refer to [this article](service-fabric-cluster-resource-manager-defragmentation-metrics.md)
* Start from the beginning and [get an Introduction to the Service Fabric Cluster Resource Manager](service-fabric-cluster-resource-manager-introduction.md)
* To find out about how the Cluster Resource Manager manages and balances load in the cluster, check out the article on [balancing load](service-fabric-cluster-resource-manager-balancing.md)

[Image1]:./media/service-fabric-cluster-resource-manager-cluster-description/cluster-fault-domains.png
[Image2]:./media/service-fabric-cluster-resource-manager-cluster-description/cluster-uneven-fault-domain-layout.png
[Image3]:./media/service-fabric-cluster-resource-manager-cluster-description/cluster-fault-and-upgrade-domains-with-placement.png
[Image4]:./media/service-fabric-cluster-resource-manager-cluster-description/cluster-fault-and-upgrade-domain-layout-strategies.png
[Image5]:./media/service-fabric-cluster-resource-manager-cluster-description/cluster-layout-different-workloads.png
[Image6]:./media/service-fabric-cluster-resource-manager-cluster-description/cluster-placement-constraints-node-properties.png
[Image7]:./media/service-fabric-cluster-resource-manager-cluster-description/cluster-nodes-and-capacity.png

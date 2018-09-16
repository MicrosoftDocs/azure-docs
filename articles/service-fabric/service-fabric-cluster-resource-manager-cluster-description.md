---
title: Cluster Resource Manager Cluster Description | Microsoft Docs
description: Describing a Service Fabric cluster by specifying Fault Domains, Upgrade Domains, node properties, and node capacities for the Cluster Resource Manager.
services: service-fabric
documentationcenter: .net
author: masnider
manager: timlt
editor: ''

ms.assetid: 55f8ab37-9399-4c9a-9e6c-d2d859de6766
ms.service: Service-Fabric
ms.devlang: dotnet
ms.topic: conceptual
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 08/18/2017
ms.author: masnider
---

# Describing a service fabric cluster
The Service Fabric Cluster Resource Manager provides several mechanisms for describing a cluster. During runtime, the Cluster Resource Manager uses this information to ensure high availability of the services running in the cluster. While enforcing these important rules, it also attempts to optimize the resource consumption within the cluster.

## Key concepts
The Cluster Resource Manager supports several features that describe a cluster:

* Fault Domains
* Upgrade Domains
* Node Properties
* Node Capacities

## Fault domains
A Fault Domain is any area of coordinated failure. A single machine is a Fault Domain (since it can fail on its own for various reasons, from power supply failures to drive failures to bad NIC firmware). Machines connected to the same Ethernet switch are in the same Fault Domain, as are machines sharing a single source of power or in a single location. Since it's natural for hardware faults to overlap, Fault Domains are inherently hierarchal and are represented as URIs in Service Fabric.

It is important that Fault Domains are set up correctly since Service Fabric uses this information to safely place services. Service Fabric doesn't want to place services such that the loss of a Fault Domain (caused by the failure of some component) causes a service to go down. In the Azure environment Service Fabric uses the Fault Domain information provided by the environment to correctly configure the nodes in the cluster on your behalf. For Service Fabric Standalone, Fault Domains are defined at the time that the cluster is set up 

> [!WARNING]
> It is important that the Fault Domain information provided to Service Fabric is accurate. For example, let's say that your Service Fabric cluster's nodes are running inside 10 virtual machines, running on five physical hosts. In this case, even though there are 10 virtual machines, there are only 5 different (top level) fault domains. Sharing the same physical host causes VMs to share the same root fault domain, since the VMs experience coordinated failure if their physical host fails.  
>
> Service Fabric expects the Fault Domain of a node not to change. Other mechanisms of ensuring high availability of the VMs such as [HA-VMs](https://technet.microsoft.com/library/cc967323.aspx) may cause conflicts with Service Fabric, as they use transparent migration of VMs from one host to another. These mechanisms do not reconfigure or notify the running code inside the VM. As such, they are **not supported** as environments for running Service Fabric clusters. Service Fabric should be the only high-availability technology employed. Mechanisms like live VM migration, SANs, or others are not necessary. If used in conjunction with Service Fabric, these mechanisms _reduce_ application availability and reliability because they introduce additional complexity, add centralized sources of failure, and utilize reliability and availability strategies that conflict with those in Service Fabric. 
>
>

In the graphic below we color all the entities that contribute to Fault Domains and list all the different Fault Domains that result. In this example, we have datacenters ("DC"), racks ("R"), and blades ("B"). Conceivably, if each blade holds more than one virtual machine, there could be another layer in the Fault Domain hierarchy.

<center>
![Nodes organized via Fault Domains][Image1]
</center>

During runtime, the Service Fabric Cluster Resource Manager considers the Fault Domains in the cluster and plans layouts. The stateful replicas or stateless instances for a given service are distributed so they are in separate Fault Domains. Distributing the service across fault domains ensures the availability of the service is not compromised when a Fault Domain fails at any level of the hierarchy.

Service Fabric’s Cluster Resource Manager doesn’t care how many layers there are in the Fault Domain hierarchy. However, it tries to ensure that the loss of any one portion of the hierarchy doesn’t impact services running in it. 

It is best if there are the same number of nodes at each level of depth in the Fault Domain hierarchy. If the “tree” of Fault Domains is unbalanced in your cluster, it makes it harder for the Cluster Resource Manager to figure out the best allocation of services. Imbalanced Fault Domains layouts mean that the loss of some domains impact the availability of services more than other domains. As a result, the Cluster Resource Manager is torn between two goals: It wants to use the machines in that “heavy” domain by placing services on them, and it wants to place services in other domains so that the loss of a domain doesn’t cause problems. 

What do imbalanced domains look like? In the diagram below, we show two different cluster layouts. In the first example, the nodes are distributed evenly across the Fault Domains. In the second example, one Fault Domain has many more nodes than the other Fault Domains. 

<center>
![Two different cluster layouts][Image2]
</center>

In Azure, the choice of which Fault Domain contains a node is managed for you. However, depending on the number of nodes that you provision you can still end up with Fault Domains with more nodes in them than others. For example, say you have five Fault Domains in the cluster but provision seven nodes for a given NodeType. In this case, the first two Fault Domains end up with more nodes. If you continue to deploy more NodeTypes with only a couple instances, the problem gets worse. For this reason it's recommended that the number of nodes in each node type is a multiple of the number of Fault Domains.

## Upgrade domains
Upgrade Domains are another feature that helps the Service Fabric Cluster Resource Manager understand the layout of the cluster. Upgrade Domains define sets of nodes that are upgraded at the same time. Upgrade Domains help the Cluster Resource Manager understand and orchestrate management operations like upgrades.

Upgrade Domains are a lot like Fault Domains, but with a couple key differences. First, areas of coordinated hardware failures define Fault Domains. Upgrade Domains, on the other hand, are defined by policy. You get to decide how many you want, rather than it being dictated by the environment. You could have as many Upgrade Domains as you do nodes. Another difference between Fault Domains and Upgrade Domains is that Upgrade Domains are not hierarchical. Instead, they are more like a simple tag. 

The following diagram shows three Upgrade Domains are striped across three Fault Domains. It also shows one possible placement for three different replicas of a stateful service, where each ends up in different Fault and Upgrade Domains. This placement allows the loss of a Fault Domain while in the middle of a service upgrade and still have one copy of the code and data.  

<center>
![Placement With Fault and Upgrade Domains][Image3]
</center>

There are pros and cons to having large numbers of Upgrade Domains. More Upgrade Domains means each step of the upgrade is more granular and therefore affects a smaller number of nodes or services. As a result, fewer services have to move at a time, introducing less churn into the system. This tends to improve reliability, since less of the service is impacted by any issue introduced during the upgrade. More Upgrade Domains also means that you need less available buffer on other nodes to handle the impact of the upgrade. For example, if you have five Upgrade Domains, the nodes in each are handling roughly 20% of your traffic. If you need to take down that Upgrade Domain for an upgrade, that load usually needs to go somewhere. Since you have four remaining Upgrade Domains, each must have room for about 5% of the total traffic. More Upgrade Domains means you need less buffer on the nodes in the cluster. For example, consider if you had 10 Upgrade Domains instead. In that case, each UD would only be handling about 10% of the total traffic. When an upgrade steps through the cluster, each domain would only need to have room for about 1.1% of the total traffic. More Upgrade Domains generally allow you to run your nodes at higher utilization, since you need less reserved capacity. The same is true for Fault Domains.  

The downside of having many Upgrade Domains is that upgrades tend to take longer. Service Fabric waits a short period of time after an Upgrade Domain is completed and performs checks before starting to upgrade the next one. These delays enable detecting issues introduced by the upgrade before the upgrade proceeds. The tradeoff is acceptable because it prevents bad changes from affecting too much of the service at a time.

Too few Upgrade Domains has many negative side effects – while each individual Upgrade Domain is down and being upgraded a large portion of your overall capacity is unavailable. For example, if you only have three Upgrade Domains you are taking down about 1/3 of your overall service or cluster capacity at a time. Having so much of your service down at once isn’t desirable since you have to have enough capacity in the rest of your cluster to handle the workload. Maintaining that buffer means that during normal operation those nodes are less loaded than they would be otherwise. This increases the cost of running your service.

There’s no real limit to the total number of fault or Upgrade Domains in an environment, or constraints on how they overlap. That said, there are several common patterns:

- Fault Domains and Upgrade Domains mapped 1:1
- One Upgrade Domain per Node (physical or virtual OS instance)
- A “striped” or “matrix” model where the Fault Domains and Upgrade Domains form a matrix with machines usually running down the diagonals

<center>
![Fault and Upgrade Domain Layouts][Image4]
</center>

There’s no best answer which layout to choose, each has some pros and cons. For example, the 1FD:1UD model is simple to set up. The 1 Upgrade Domain per Node model is most like what people are used to. During upgrades each node is updated independently. This is similar to how small sets of machines were upgraded manually in the past. 

The most common model is the FD/UD matrix, where the FDs and UDs form a table and nodes are placed starting along the diagonal. This is the model used by default in Service Fabric clusters in Azure. For clusters with many nodes everything ends up looking like the dense matrix pattern above.

## Fault and Upgrade Domain constraints and resulting behavior
### *Default approach*
By default, the Cluster Resource Manager keeps services balanced across Fault and Upgrade Domains. This is modeled as a [constraint](service-fabric-cluster-resource-manager-management-integration.md). The Fault and Upgrade Domain constraint states: “For a given service partition, there should never be a difference greater than one in the number of service objects (stateless service instances or stateful service replicas) between any two domains on the same level of hierarchy”. Let’s say this constraint provides a “maximum difference” guarantee. The Fault and Upgrade Domain constraint prevents certain moves or arrangements that violate the rule stated above. 

Let's look at one example. Let's say that we have a cluster with six nodes, configured with five Fault Domains and five Upgrade Domains.

|  | FD0 | FD1 | FD2 | FD3 | FD4 |
| --- |:---:|:---:|:---:|:---:|:---:|
| **UD0** |N1 | | | | |
| **UD1** |N6 |N2 | | | |
| **UD2** | | |N3 | | |
| **UD3** | | | |N4 | |
| **UD4** | | | | |N5 |

*Configuration 1*

Now let's say that we create a service with a TargetReplicaSetSize (or, for a stateless service an InstanceCount) of five. The replicas land on N1-N5. In fact, N6 is never used no matter how many services like this you create. But why? Let's look at the difference between the current layout and what would happen if N6 is chosen.

Here's the layout we got and the total number of replicas per Fault and Upgrade Domain:

|  | FD0 | FD1 | FD2 | FD3 | FD4 | UDTotal |
| --- |:---:|:---:|:---:|:---:|:---:|:---:|
| **UD0** |R1 | | | | |1 |
| **UD1** | |R2 | | | |1 |
| **UD2** | | |R3 | | |1 |
| **UD3** | | | |R4 | |1 |
| **UD4** | | | | |R5 |1 |
| **FDTotal** |1 |1 |1 |1 |1 |- |

*Layout 1*


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

*Layout 2*


This layout violates our definition of the “maximum difference” guarantee for the Fault Domain constraint. FD0 has two replicas, while FD1 has zero, making the difference between FD0 and FD1 a total of two, which is greater than the maximum difference of one. Since the constraint is violated, the Cluster Resource Manager does not allow this arrangement. 
Similarly if we picked N2 and N6 (instead of N1 and N2) we'd get:

|  | FD0 | FD1 | FD2 | FD3 | FD4 | UDTotal |
| --- |:---:|:---:|:---:|:---:|:---:|:---:|
| **UD0** | | | | | |0 |
| **UD1** |R5 |R1 | | | |2 |
| **UD2** | | |R2 | | |1 |
| **UD3** | | | |R3 | |1 |
| **UD4** | | | | |R4 |1 |
| **FDTotal** |1 |1 |1 |1 |1 |- |

*Layout 3*


This layout is balanced in terms of Fault Domains. However, now it's violating the Upgrade Domain constraint because UD0 has zero replicas while UD1 has two. Therefore, this layout is also invalid and won't be picked by the Cluster Resource Manager.

This approach to the distribution of stateful replicas or stateless instances provides the best possible fault tolerance. In a situation when one domain goes down, the minimal number of replicas/instances is lost. 

On the other hand, this approach can be too strict and not allow the cluster to utilize all resources. For certain cluster configurations, certain nodes can't be used. This can lead to Service Fabric not placing your services, resulting in warning messages. In the previous example some of the cluster nodes can’t be used (N6 in the given example). Even if you would add nodes to that cluster (N7 – N10), replicas/instances would only be placed on N1 – N5 due to Fault and Upgrade Domain constraints. 

|  | FD0 | FD1 | FD2 | FD3 | FD4 |
| --- |:---:|:---:|:---:|:---:|:---:|
| **UD0** |N1 | | | |N10 |
| **UD1** |N6 |N2 | | | |
| **UD2** | |N7 |N3 | | |
| **UD3** | | |N8 |N4 | |
| **UD4** | | | |N9 |N5 |

*Configuration 2*


### *Alternative approach*

The Cluster Resource Manager supports another version of the Fault and Upgrade Domain constraint which allows placement while still guaranteeing a minimum level of safety. The alternative Fault and Upgrade Domain constraint can be stated as follows: “For a given service partition, replica distribution across domains should ensure that the partition does not suffer a quorum loss”. Let’s say this constraint provides a “quorum safe” guarantee. 

> [!NOTE]
>For a stateful service, we define *quorum loss* in a situation when a majority of the partition replicas are down at the same time. For example, if TargetReplicaSetSize is five, a set of any three replicas represents quorum. Similarly, if TargetReplicaSetSize is 6, four replicas are necessary for quorum. In both cases no more than two replicas can be down at the same time if the partition wants to continue functioning normally. 
For a stateless service, there is no such thing as *quorum loss* as stateless services conitnue to functionate normally even if a majority of instances go down at the same time. 
Hence, we will focus on stateful services in the rest of the text.
>

Let’s go back to the previous example. With the “quorum safe” version of the constraint, all three given layouts would be valid. This is because even if there would be failure of FD0 in the second layout or UD1 in the third layout, the partition would still have quorum (a majority of its replicas would still be up). With this version of the constraint N6 could almost always be utilized.

The “quorum safe” approach provides more flexibility than the “maximum difference” approach as it is easier to find replica distributions that are valid in almost any cluster topology. However, this approach can’t guarantee the best fault tolerance characteristics because some failures are worse than others. In the worst case scenario, a majority of the replicas could be lost with the failure of one domain and one additional replica. For example, instead of 3 failures being required to lose quorum with 5 replicas or instances, you could now lose a majority with just two failures. 

### *Adaptive approach*
Because both of the approaches have strengths and weaknesses, we've introduced an adaptive approach that combines these two strategies.

> [!NOTE]
>This will be the default behavior starting with Service Fabric Version 6.2. 
>
The adaptive approach uses the “maximum difference” logic by default and switches to the “quorum safe” logic only when necessary. The Cluster Resource Manager automatically figures out which strategy is necessary by looking at how the cluster and services are configured. For a given service: *If the TargetReplicaSetSize is evenly divisible by the number of Fault Domains and the number of Upgrade Domains **and** the number of nodes is less than or equal to the (number of Fault Domains) * (the number of Upgrade Domains), the Cluster Resource Manager should utilize the “quorum based” logic for that service.* Bear in mind that the Cluster Resource Manager will use this approach for both stateless and stateful services, despite quorum loss not being relevant for stateless services.

Let’s go back to the previous example and assume that a cluster now has 8 nodes (the cluster is still configured with five Fault Domains and five Upgrade Domains and the TargetReplicaSetSize of a service hosted on that cluster remains five). 

|  | FD0 | FD1 | FD2 | FD3 | FD4 |
| --- |:---:|:---:|:---:|:---:|:---:|
| **UD0** |N1 | | | | |
| **UD1** |N6 |N2 | | | |
| **UD2** | |N7 |N3 | | |
| **UD3** | | |N8 |N4 | |
| **UD4** | | | | |N5 |

*Configuration 3*

Because all necessary conditions are satisfied, Cluster Resource Manager will utilize the “quorum based” logic in distributing the service. This enables usage of N6 – N8. One possible service distribution in this case could look like:

|  | FD0 | FD1 | FD2 | FD3 | FD4 | UDTotal |
| --- |:---:|:---:|:---:|:---:|:---:|:---:|
| **UD0** |R1 | | | | |1 |
| **UD1** |R2 | | | | |1 |
| **UD2** | |R3 |R4 | | |2 |
| **UD3** | | | | | |0 |
| **UD4** | | | | |R5 |1 |
| **FDTotal** |2 |1 |1 |0 |1 |- |

*Layout 4*

If your service’s TargetReplicaSetSize is reduced to four (for example), Cluster Resource Manager will notice that change and resume using the “maximum difference” logic because TargetReplicaSetSize isn’t dividable by the number of FDs and UDs anymore. As a result, certain replica movements will occur in order to distribute remaining four replicas on nodes N1-N5 so that the “maximum difference” version of the Fault Domain and Upgrade domain logic is not violated. 

Looking back to the fourth layout and the TargetReplicaSetSize of five. If N1 is removed from the cluster, the number of Upgrade Domains becomes equal to four. Again, the Cluster Resource Manager starts using “maximum difference” logic as the number of UDs doesn’t evenly divide the service’s TargetReplicaSetSize anymore. As a result, replica R1, when built again, has to land on N4 so that Fault and Upgrade Domain Constraint is not violated.

|  | FD0 | FD1 | FD2 | FD3 | FD4 | UDTotal |
| --- |:---:|:---:|:---:|:---:|:---:|:---:|
| **UD0** |N/A |N/A |N/A |N/A |N/A |N/A |
| **UD1** |R2 | | | | |1 |
| **UD2** | |R3 |R4 | | |2 |
| **UD3** | | | |R1 | |1 |
| **UD4** | | | | |R5 |1 |
| **FDTotal** |1 |1 |1 |1 |1 |- |

*Layout 5*

## Configuring fault and Upgrade Domains
Defining Fault Domains and Upgrade Domains is done automatically in Azure hosted Service Fabric deployments. Service Fabric picks up and uses the environment information from Azure.

If you’re creating your own cluster (or want to run a particular topology in development), you can provide the Fault Domain and Upgrade Domain information yourself. In this example, we define a nine node local development cluster that spans three “datacenters” (each with three racks). This cluster also has three Upgrade Domains striped across those three datacenters. An example of the configuration is below: 

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
> When defining clusters via Azure Resource Manager, Fault Domains and Upgrade Domains are assigned by Azure. Therefore, the definition of your Node Types and Virtual Machine Scale Sets in your Azure Resource Manager template does not include Fault Domain or Upgrade Domain information.
>

## Node properties and placement constraints
Sometimes (in fact, most of the time) you’re going to want to ensure that certain workloads run only on certain types of nodes in the cluster. For example, some workload may require GPUs or SSDs while others may not. A great example of targeting hardware to particular workloads is almost every n-tier architecture out there. Certain machines serve as the front end or API serving side of the application and are exposed to the clients or the internet. Different machines, often with different hardware resources, handle the work of the compute or storage layers. These are usually _not_ directly exposed to clients or the internet. Service Fabric expects that there are cases where particular workloads need to run on particular hardware configurations. For example:

* an existing n-tier application has been “lifted and shifted” into a Service Fabric environment
* a workload wants to run on specific hardware for performance, scale, or security isolation reasons
* A workload should be isolated from other workloads for policy or resource consumption reasons

To support these sorts of configurations, Service Fabric has a first class notion of tags that can be applied to nodes. These tags are called **node properties**. **Placement constraints** are the statements attached to individual services that select for one or more node properties. Placement constraints define where services should run. The set of constraints is extensible - any key/value pair can work. 

<center>
![Cluster Layout Different Workloads][Image5]
</center>

### Built in node properties
Service Fabric defines some default node properties that can be used automatically without the user having to define them. The default properties defined at each node are the **NodeType** and the **NodeName**. So for example you could write a placement constraint as `"(NodeType == NodeType03)"`. Generally we have found NodeType to be one of the most commonly used properties. It is useful since it corresponds 1:1 with a type of a machine. Each type of machine corresponds to a type of workload in a traditional n-tier application.

<center>
![Placement Constraints and Node Properties][Image6]
</center>

## Placement Constraint and Node Property Syntax 
The value specified in the node property can be a string, bool, or signed long. The statement at the service is called a placement *constraint* since it constrains where the service can run in the cluster. The constraint can be any Boolean statement that operates on the different node properties in the cluster. The valid selectors in these boolean statements are:

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

Only nodes where the overall placement constraint statement evaluates to “True” can have the service placed on it. Nodes that do not have a property defined do not match any placement constraint containing that property.

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

via ClusterConfig.json for Standalone deployments or Template.json for Azure hosted clusters. 

> [!NOTE]
> In your Azure Resource Manager template the node type is usually parameterized. It would look like "[parameters('vmNodeType1Name')]" rather than "NodeType01".
>

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
New-ServiceFabricService -ApplicationName $applicationName -ServiceName $serviceName -ServiceTypeName $serviceType -Stateful -MinReplicaSetSize 3 -TargetReplicaSetSize 3 -PartitionSchemeSingleton -PlacementConstraint "HasSSD == true && SomeProperty >= 4"
```

If all nodes of NodeType01 are valid, you can also select that node type with the constraint "(NodeType == NodeType01)".

One of the cool things about a service’s placement constraints is that they can be updated dynamically during runtime. So if you need to, you can move a service around in the cluster, add and remove requirements, etc. Service Fabric takes care of ensuring that the service stays up and available even when these types of changes are made.

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

Placement constraints are specified for every different named service instance. Updates always take the place of (overwrite) what was previously specified.

The cluster definition defines the properties on a node. Changing a node's properties requires a cluster configuration upgrade. Upgrading a node's properties requires each affected node to restart to report its new properties. These rolling upgrades are managed by Service Fabric.

## Describing and Managing Cluster Resources
One of the most important jobs of any orchestrator is to help manage resource consumption in the cluster. Managing cluster resources can mean a couple of different things. First, there's ensuring that machines are not overloaded. This means making sure that machines aren't running more services than they can handle. Second, there's balancing and optimization which is critical to running services efficiently. Cost effective or performance sensitive service offerings can't allow some nodes to be hot while others are cold. Hot nodes lead to resource contention and poor performance, and cold nodes represent wasted resources and increased costs. 

Service Fabric represents resources as `Metrics`. Metrics are any logical or physical resource that you want to describe to Service Fabric. Examples of metrics are things like “WorkQueueDepth” or “MemoryInMb”. For information about the physical resources that Service Fabric can govern on nodes, see [resource governance](service-fabric-resource-governance.md). For information on configuring custom metrics and their uses, see [this article](service-fabric-cluster-resource-manager-metrics.md)

Metrics are different from placements constraints and node properties. Node properties are static descriptors of the nodes themselves. Metrics describe resources that nodes have and that services consume when they are run on a node. A node property could be "HasSSD" and could be set to true or false. The amount of space available on that SSD and how much is consumed by services would be a metric like “DriveSpaceInMb”. 

It is important to note that just like for placement constraints and node properties, the Service Fabric Cluster Resource Manager doesn't understand what the names of the metrics mean. Metric names are just strings. It is a good practice to declare units as a part of the metric names that you create when it could be ambiguous.

## Capacity
If you turned off all resource *balancing*, Service Fabric’s Cluster Resource Manager would still ensure that no node ended up over its capacity. Managing capacity overruns is possible unless the cluster is too full or the workload is larger than any node. Capacity is another *constraint* that the Cluster Resource Manager uses to understand how much of a resource a node has. Remaining capacity is also tracked for the cluster as a whole. Both the capacity and the consumption at the service level are expressed in terms of metrics. So for example, the metric might be "ClientConnections" and a given Node may have a capacity for "ClientConnections" of 32768. Other nodes can have other limits Some service running on that node can say it is currently consuming 32256 of the metric "ClientConnections".

During runtime, the Cluster Resource Manager tracks remaining capacity in the cluster and on nodes. In order to track capacity the Cluster Resource Manager subtracts each service's usage from node's capacity where the service runs. With this information, the Service Fabric Cluster Resource Manager can figure out where to place or move replicas so that nodes don’t go over capacity.

<center>
![Cluster nodes and capacity][Image7]
</center>

C#:

```csharp
StatefulServiceDescription serviceDescription = new StatefulServiceDescription();
ServiceLoadMetricDescription metric = new ServiceLoadMetricDescription();
metric.Name = "ClientConnections";
metric.PrimaryDefaultLoad = 1024;
metric.SecondaryDefaultLoad = 0;
metric.Weight = ServiceLoadMetricWeight.High;
serviceDescription.Metrics.Add(metric);
await fabricClient.ServiceManager.CreateServiceAsync(serviceDescription);
```

Powershell:

```posh
New-ServiceFabricService -ApplicationName $applicationName -ServiceName $serviceName -ServiceTypeName $serviceTypeName –Stateful -MinReplicaSetSize 3 -TargetReplicaSetSize 3 -PartitionSchemeSingleton –Metric @("ClientConnections,High,1024,0)
```

You can see capacities defined in the cluster manifest:

ClusterManifest.xml

```xml
    <NodeType Name="NodeType03">
      <Capacities>
        <Capacity Name="ClientConnections" Value="65536"/>
      </Capacities>
    </NodeType>
```

via ClusterConfig.json for Standalone deployments or Template.json for Azure hosted clusters. 

```json
"nodeTypes": [
    {
        "name": "NodeType03",
        "capacities": {
            "ClientConnections": "65536",
        }
    }
],
```

Commonly a service’s load changes dynamically. Say that a replica's load of "ClientConnections" changed from 1024 to 2048, but the node it was running on then only had 512 capacity remaining for that metric. Now that replica or instance's placement is invalid, since there's not enough room on that node. The Cluster Resource Manager has to kick in and get the node back below capacity. It reduces load on the node that is over capacity by moving one or more of the replicas or instances from that node to other nodes. When moving replicas, the Cluster Resource Manager tries to minimize the cost of those movements. Movement cost is discussed in [this article](service-fabric-cluster-resource-manager-movement-cost.md) and more about the Cluster Resource Manager's rebalancing strategies and rules is described [here](service-fabric-cluster-resource-manager-metrics.md).

## Cluster capacity
So how does the Service Fabric Cluster Resource Manager keep the overall cluster from being too full? Well, with dynamic load there’s not a lot it can do. Services can have their load spike independently of actions taken by the Cluster Resource Manager. As a result, your cluster with plenty of headroom today may be underpowered when you become famous tomorrow. That said, there are some controls that are baked in to prevent problems. The first thing we can do is prevent the creation of new workloads that would cause the cluster to become full.

Say that you create a stateless service and it has some load associated with it. Let’s say that the service cares about the "DiskSpaceInMb" metric. Let's also say that it is going to consume five units of "DiskSpaceInMb" for every instance of the service. You want to create three instances of the service. Great! So that means that we need 15 units of "DiskSpaceInMb" to be present in the cluster in order for us to even be able to create these service instances. The Cluster Resource Manager continually calculates the capacity and consumption of each metric so it can determine the remaining capacity in the cluster. If there isn't enough space, the Cluster Resource Manager rejects the create service call.

Since the requirement is only that there be 15 units available, this space could be allocated many different ways. For example, there could be one remaining unit of capacity on 15 different nodes, or three remaining units of capacity on five different nodes. If the Cluster Resource Manager can rearrange things so there's five units available on three nodes, it places the service. Rearranging the cluster is usually possible unless the cluster is almost full or the existing services can't be consolidated for some reason.

## Buffered Capacity
Buffered capacity is another feature of the Cluster Resource Manager. It allows reservation of some portion of the overall node capacity. This capacity buffer is only used to place services during upgrades and node failures. Buffered Capacity is specified globally per metric for all nodes. The value you pick for the reserved capacity is a function of the number of Fault and Upgrade Domains you have in the cluster. More Fault and Upgrade Domains means that you can pick a lower number for your buffered capacity. If you have more domains, you can expect smaller amounts of your cluster to be unavailable during upgrades and failures. Specifying Buffered Capacity only makes sense if you have also specified the node capacity for a metric.

Here's an example of how to specify buffered capacity:

ClusterManifest.xml

```xml
        <Section Name="NodeBufferPercentage">
            <Parameter Name="SomeMetric" Value="0.15" />
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
          "name": "SomeMetric",
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

The creation of new services fails when the cluster is out of buffered capacity for a metric. Preventing the creation of new services to preserve the buffer ensures that upgrades and failures don’t cause nodes to go over capacity. Buffered capacity is optional but is recommended in any cluster that defines a capacity for a metric.

The Cluster Resource Manager exposes this load information. For each metric, this information includes: 
  - the buffered capacity settings
  - the total capacity
  - the current consumption
  - whether each metric is considered balanced or not
  - statistics about the standard deviation
  - the nodes which have the most and least load  
  
Below we see an example of that output:

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

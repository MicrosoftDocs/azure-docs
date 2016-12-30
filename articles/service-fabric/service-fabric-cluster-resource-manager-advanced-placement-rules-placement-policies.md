---
title: Service Fabric Cluster Resource Manager - Placement Policies | Microsoft Docs
description: Overview of additional placement policies and rules for Service Fabric Services
services: service-fabric
documentationcenter: .net
author: masnider
manager: timlt
editor: ''

ms.assetid: 5c2d19c6-dd40-4c4b-abd3-5c5ec0abed38
ms.service: Service-Fabric
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 12/30/2016
ms.author: masnider

---
# Placement policies for service fabric services
There are many different additional rules that you may need to configure in some rare scenarios. Some examples of those scenarios are:
* If your Service Fabric cluster is spanned across a geographic distances, such as multiple on-premises datacenters or across Azure regions
* If your environment spans multiple areas of geopolitical control (or some other case where you have legal or policy boundaries you care about
* There are actual performance/latency considerations due to communication in the cluster traveling large distances or transiting certain slower or less reliable networks.

In these types of situations, it may be important for a given service to always run or never run in certain regions. Similarly it may be important to try to place the primary in a certain region when possible in order to minimize end user latency.

The advanced placement policies are:

1. Invalid domains
2. Required domains
3. Preferred domains
4. Disallowing replica packing

Most of the following controls could be configured via node properties and placement constraints, but some are more complicated. To make things simpler we provide these additional placement policies. Just like with other placement constraints, placement policies can be configured on a per-named service instance basis and updated dynamically.

## Specifying invalid domains
The InvalidDomain placement policy allows you to specify that a particular Fault Domain is invalid for this workload. This policy ensures that a particular service never runs in a particular area, for example for geopolitical or corporate policy reasons. Multiple invalid domains may be specified via separate policies.

<center>
![Invalid Domain Example][Image1]
</center>

Code:

```csharp
ServicePlacementInvalidDomainPolicyDescription invalidDomain = new ServicePlacementInvalidDomainPolicyDescription();
invalidDomain.DomainName = "fd:/DCEast"; //regulations prohibit this workload here
serviceDescription.PlacementPolicies.Add(invalidDomain);
```

Powershell:

```posh
New-ServiceFabricService -ApplicationName $applicationName -ServiceName $serviceName -ServiceTypeName $serviceTypeName –Stateful -MinReplicaSetSize 2 -TargetReplicaSetSize 3 -PartitionSchemeSingleton -PlacementPolicy @("InvalidDomain,fd:/DCEast”)
```
## Specifying required domains
The required domain placement policy requires that all of the stateful replicas or stateless service instances for the service be present in the specified domain. Multiple required domains can be specified via separate policies.

<center>
![Required Domain Example][Image2]
</center>

Code:

```csharp
ServicePlacementRequiredDomainPolicyDescription requiredDomain = new ServicePlacementRequiredDomainPolicyDescription();
requiredDomain.DomainName = "fd:/DC01/RK03/BL2";
serviceDescription.PlacementPolicies.Add(requiredDomain);
```

Powershell:

```posh
New-ServiceFabricService -ApplicationName $applicationName -ServiceName $serviceName -ServiceTypeName $serviceTypeName –Stateful -MinReplicaSetSize 2 -TargetReplicaSetSize 3 -PartitionSchemeSingleton -PlacementPolicy @("RequiredDomain,fd:/DC01/RK03/BL2")
```

## Specifying a preferred domain for the primary replicas
The Preferred Primary Domain is an interesting control, since it allows selection of the fault domain in which the primary should be placed if it is possible to do so. When everything is healthy the primary will end up in this domain. Should the domain or the primary replica fail or be shut down for some reason the Primary will be migrated to some other location. If this location isn't in the preferred domain, then when possible the Cluster Resource Manager will move it back to the preferred domain. Naturally this setting only makes sense for stateful services. This policy is most useful in clusters which are spanned across Azure regions or multiple datacenters. In these situations you're using all the locations for redundancy, but would prefer that the primary replicas be placed in a certain location in order to provide lower latency for operations which go to the primary (writes and also by default all reads are served by the primary).

<center>
![Preferred Primary Domains and Failover][Image3]
</center>

```csharp
ServicePlacementPreferPrimaryDomainPolicyDescription primaryDomain = new ServicePlacementPreferPrimaryDomainPolicyDescription();
primaryDomain.DomainName = "fd:/EastUS/";
serviceDescription.PlacementPolicies.Add(invalidDomain);
```

Powershell:

```posh
New-ServiceFabricService -ApplicationName $applicationName -ServiceName $serviceName -ServiceTypeName $serviceTypeName –Stateful -MinReplicaSetSize 2 -TargetReplicaSetSize 3 -PartitionSchemeSingleton -PlacementPolicy @("PreferredPrimaryDomain,fd:/EastUS")
```

## Requiring replicas to be distributed among all domains and disallowing packing
Another policy you can specify is to require replicas to always be distributed among the available fault domains. This will happen by default in most cases where the cluster is healthy, however there are degenerate cases where replicas for a given partition may end up temporarily packed into a single fault or upgrade domain. For example, let's say that although the cluster has 9 nodes in 3 fault domains (0, 1, and 2), and your service has 3 replicas, the nodes that were being used for those replicas in Fault Domains 1 and 2 went down, and due to capacity issues none of the other nodes in those domains were valid. If Service Fabric were to build replacements for those replicas, the Cluster Resource Manager would have to put them in Fault Domain 0, but that creates a situation where the Fault Domain constraint is being violated. It also increases the chance that the whole replica set could be lost (if FD 0 were to be permananently lost). (For more information on constraints and constraint priorities generally, check out [this topic](service-fabric-cluster-resource-manager-management-integration.md#constraint-priorities) )

If you've ever seen a health warning like "The Load Balancer has detected a Constraint Violation for this Replica:fabric:/<some service name> Secondary Partition <some partition ID> is violating the Constraint: FaultDomain" you've hit this condition or something like it. Usually these situations are transient (the nodes don't stay down long, or if they do and we need to build replacements there are other nodes in the correct fault domains which are valid), but there are some workloads that would rather trade availability for the risk of losing all their replicas. We can do this by specifying the "RequireDomainDistribution" policy, which will guarantee that no two replicas from the same partition are ever allowed in the same fault or upgrade domain.

Some workloads would rather have the target number of replicas (copies of state) at all times (betting against total domain failures and knowing that they can usually recover local state), whereas others would rather take the downtime earlier than risk the correctness and dataloss concerns. Since most production workloads run with more than 3 replicas, the default is to not require domain distribution and let balancing and failover handle cases normally even if that means that temporarily a domain has multiple replicas packed into it.

Code:

```csharp
ServicePlacementRequireDomainDistributionPolicyDescription distributeDomain = new ServicePlacementRequireDomainDistributionPolicyDescription();
serviceDescription.PlacementPolicies.Add(distributeDomain);
```

Powershell:

```posh
New-ServiceFabricService -ApplicationName $applicationName -ServiceName $serviceName -ServiceTypeName $serviceTypeName –Stateful -MinReplicaSetSize 2 -TargetReplicaSetSize 3 -PartitionSchemeSingleton -PlacementPolicy @("RequiredDomainDistribution")
```

Now, would it be possible to use these configurations for services in a cluster which was not geographically spanned? Sure you could! But there’s not a great reason too – especially the required, invalid, and preferred domain configurations should be avoided unless you’re actually running a geographically spanned cluster - it doesn't make any sense to try to force a given workload to run in a single rack, or to prefer some segment of your local cluster over another unless there's different types of hardware or workload segmentation going on, and those cases can be handled via normal placement constraints.

## Next steps
* For more information about the other options available for configuring services check out the topic on the other Cluster Resource Manager configurations available [Learn about configuring Services](service-fabric-cluster-resource-manager-configure-services.md)

[Image1]:./media/service-fabric-cluster-resource-manager-advanced-placement-rules-placement-policies/cluster-invalid-placement-domain.png
[Image2]:./media/service-fabric-cluster-resource-manager-advanced-placement-rules-placement-policies/cluster-required-placement-domain.png
[Image3]:./media/service-fabric-cluster-resource-manager-advanced-placement-rules-placement-policies/cluster-preferred-primary-domain.png

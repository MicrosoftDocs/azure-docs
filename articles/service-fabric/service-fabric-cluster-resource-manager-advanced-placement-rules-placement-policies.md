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
ms.date: 01/05/2017
ms.author: masnider

---
# Placement policies for service fabric services
There are many different additional rules that you may need to configure in some rare scenarios. Some examples of those scenarios are:
* If your Service Fabric cluster is spanned across a geographic distance, such as multiple on-premises datacenters or across Azure regions
* If your environment spans multiple areas of geopolitical control (or some other case where you have legal or policy boundaries you care about
* There are actual performance/latency considerations due to communication in the cluster traveling large distances or transiting certain slower or less reliable networks.

In these types of situations, it may be important for a given service to always run or never run in certain regions. Similarly it may be important to try to place the Primary in a certain region to minimize end-user latency.

The advanced placement policies are:

1. Invalid domains
2. Required domains
3. Preferred domains
4. Disallowing replica packing

Most of the following controls could be configured via node properties and placement constraints, but some are more complicated. To make things simpler, the Service Fabric Cluster Resource Manager provides these additional placement policies. Like with other placement constraints, placement policies can be configured on a per-named service instance basis and updated dynamically.

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
The required domain placement policy requires that all the stateful replicas or stateless service instances for the service be present in the specified domain. Multiple required domains can be specified via separate policies.

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
The Preferred Primary Domain is an interesting control, since it allows selection of the fault domain in which the Primary should be placed if it is possible to do so. The Primary ends up in this domain when everything is healthy. If the domain or the Primary replica fails or is shut down for some reason, the Primary is migrated to some other location. If this new location isn't in the preferred domain, the Cluster Resource Manager moves it back to the preferred domain as soon as possible. Naturally this setting only makes sense for stateful services. This policy is most useful in clusters that are spanned across Azure regions or multiple datacenters but would prefer that the Primary replicas be placed in a certain location. Keeping Primaries close to their users helps provide lower latency, especially for reads.

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
Replicas are _normally_ distributed across the domains the cluster is healthy, but there are cases where replicas for a given partition may end up temporarily packed into a single domain. For example, let's say that the cluster has nine nodes in three fault domains (fd:/0, fd:/1, and fd:/2), and your service has three replicas. Let's say that the nodes that were being used for those replicas in fd:/1 and fd:/2 went down. Now, normally the Cluster Resource Manager would prefer other nodes in those same fault domains. In this case, let's say due to capacity issues none of the other nodes in those domains were valid. If the Cluster Resource Manager builds replacements for those replicas, it would have to choose nodes in fd:/0. However, doing _that_ creates a situation where the Fault Domain constraint is being violated. It also increases the chance that the whole replica set could go down or be lost (if FD 0 were to be permanently lost). For more information on constraints and constraint priorities generally, check out [this topic](service-fabric-cluster-resource-manager-management-integration.md#constraint-priorities).

If you've ever seen a health warning like `The Load Balancer has detected a Constraint Violation for this Replica:fabric:/<some service name> Secondary Partition <some partition ID> is violating the Constraint: FaultDomain` you've hit this condition or something like it. This is rare, but it can happen, and usually these situations are transient since the nodes come back. If the nodes do stay down and the Cluster Resource Manager needs to build replacements, usually there are other nodes available in the ideal fault domains.

Some workloads would rather always have the target number of replicas, even if they are packed into fewer domains. These workloads are betting against total simultaneous permanent domain failures and can usually recover local state. Other workloads would rather take the downtime earlier than risk correctness or loss of data. Since most production workloads run with more than three replicas, more than three fault domains, and many valid nodes per fault domain, the default is to not require domain distribution. This lets normal balancing and failover handle these cases, even if that means that temporarily a domain may have multiple replicas packed into it.

If you want to disable such packing for a given workload, you can specify the "RequireDomainDistribution" policy on the service. When this policy is set, the Cluster Resource Manager ensures no two replicas from the same partition are ever allowed in the same fault or upgrade domain.

Code:

```csharp
ServicePlacementRequireDomainDistributionPolicyDescription distributeDomain = new ServicePlacementRequireDomainDistributionPolicyDescription();
serviceDescription.PlacementPolicies.Add(distributeDomain);
```

Powershell:

```posh
New-ServiceFabricService -ApplicationName $applicationName -ServiceName $serviceName -ServiceTypeName $serviceTypeName –Stateful -MinReplicaSetSize 2 -TargetReplicaSetSize 3 -PartitionSchemeSingleton -PlacementPolicy @("RequiredDomainDistribution")
```

Now, would it be possible to use these configurations for services in a cluster that was not geographically spanned? Sure you could! But there’s not a great reason too. The required, invalid, and preferred domain configurations should be avoided unless you’re actually running a cluster that spans geographic distances. It doesn't make any sense to try to force a given workload to run in a single rack, or to prefer some segment of your local cluster over another. Different hardware configurations should be spread across domains and those handled via normal placement constraints and node properties.

## Next steps
* For more information about the other options available for configuring services, go [Learn about configuring Services](service-fabric-cluster-resource-manager-configure-services.md)

[Image1]:./media/service-fabric-cluster-resource-manager-advanced-placement-rules-placement-policies/cluster-invalid-placement-domain.png
[Image2]:./media/service-fabric-cluster-resource-manager-advanced-placement-rules-placement-policies/cluster-required-placement-domain.png
[Image3]:./media/service-fabric-cluster-resource-manager-advanced-placement-rules-placement-policies/cluster-preferred-primary-domain.png

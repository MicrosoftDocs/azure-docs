<properties
   pageTitle="Configure Services With the Service Fabric Cluster Resource Manager"
   description="Describing a Service Fabric Service by specifying metrics, placement constraints, and other placement policies."
   services="service-fabric"
   documentationCenter=".net"
   authors="masnider"
   manager="timlt"
   editor=""/>

<tags
   ms.service="Service-Fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="03/03/2016"
   ms.author="masnider"/>


# Configuring Services
The Service Fabric Cluster Resource manager allows very fine grained control over the rules which govern every individual named service. Each Service instance can specify specific rules for how it should be allocated in the cluster, and can define the set of metrics that it wants to report, including how important they are to that service. Generally configuring services breaks down into three different tasks:

1. Configuring Placement Constraints
2. Configuring metrics
3. Configuring advanced placement rules (less common)

Let's talk about each of these in turn:

## Placement Constraints
Placement constraints are used to control which nodes in the cluster a service can actually run on. Typically you'll see a particular named service instance or all services of a type constrained to run on a particular type of node, but placement constraints are extensible - you can define any set of properties on a node type basis, and then select for them with constraints when the service is created. Placement constraints are also dynamically updatable over the lifetime of the service, allowing you to respond to changes in the cluster.

## Metrics
Metrics are the list of resources that this service should be balanced on, including information about how much of that resource each replica or instance of that service consumes by default. Metrics also include a weight which indicates how important that metric is to the service, in case tradeoffs are necessary.

## Other placement rules
There are other types of placement rules that are mainly useful in clusters which are geographically distributed, or in other less common scenarios. These are configured via either Correlations or Policies. While they're not used in a lot of scenarios, we'll describe them for completeness.

<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps
- [Learn about Metrics](service-fabric-cluster-resource-manager-metrics.md)
- [Learn about Service Affinity](service-fabric-cluster-resource-manager-advanced-placement-rules-affinity.md)
- [Learn about Service Placement Policies](service-fabric-cluster-resource-manager-advanced-placement-rules-placement-policies.md)
- [Get an Introduction to the Service Fabric Cluster Resource Manager](service-fabric-cluster-resource-manager-introduction.md)

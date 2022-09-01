---
title: Specify metrics and placement settings
description: Learn how to describe a Service Fabric service by specifying metrics, placement constraints, and other placement policies.
ms.topic: conceptual
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/14/2022
---

# Configuring cluster resource manager settings for Service Fabric services
The Service Fabric Cluster Resource Manager allows fine-grained control over the rules that govern every individual named service. Each named service can specify rules for how it should be allocated in the cluster. Each named service can also define the set of metrics that it wants to report, including how important they are to that service. Configuring services breaks down into three different tasks:

1. Configuring placement constraints
2. Configuring metrics
3. Configuring advanced placement policies and other rules (less common)

## Placement constraints
Placement constraints are used to control which nodes in the cluster a service can actually run on. Typically a particular named service instance or all services of a given type constrained to run on a particular type of node. Placement constraints are extensible. You can define any set of properties per  node type, and then select for them with constraints when creating services. You can also change a service's placement constraints while it is running. This allows you to respond to changes in the cluster or the requirements of the service. The properties of a given node can also be updated dynamically in the cluster. More information on placement constraints and how to configure them can be found in [this article](service-fabric-cluster-resource-manager-cluster-description.md#node-properties-and-placement-constraints)

## Metrics
Metrics are the set of resources that a given named service needs. A service's metric configuration includes how much of that resource each stateful replica or stateless instance of that service consumes by default. Metrics also include a weight that indicates how important balancing that metric is to that service, in case tradeoffs are necessary.

## Advanced placement rules
There are other types of placement rules that are useful in less common scenarios. Some examples are:
- Constraints that help with geographically distributed clusters
- Certain application architectures

Other placement rules are configured via either Correlations or Policies.

## Next steps
- Metrics are how the Service Fabric Cluster Resource Manger manages consumption and capacity in the cluster. To learn more about metrics and how to configure them, check out [this article](service-fabric-cluster-resource-manager-metrics.md)
- Affinity is one mode you can configure for your services. It is not common, but if you need it you can learn about it [here](service-fabric-cluster-resource-manager-advanced-placement-rules-affinity.md)
- There are many different placement rules that can be configured on your service to handle additional scenarios. You can find out about those different placement policies [here](service-fabric-cluster-resource-manager-advanced-placement-rules-placement-policies.md)
- Start from the beginning and [get an Introduction to the Service Fabric Cluster Resource Manager](service-fabric-cluster-resource-manager-introduction.md)
- To find out about how the Cluster Resource Manager manages and balances load in the cluster, check out the article on [balancing load](service-fabric-cluster-resource-manager-balancing.md)
- The Cluster Resource Manager has many options for describing the cluster. To find out more about them, check out this article on [describing a Service Fabric cluster](service-fabric-cluster-resource-manager-cluster-description.md)

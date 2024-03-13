---
title: "Route Policies in Azure's Operator Nexus Managed Network Fabric"
description: Introduction to Route Policies in Azure Operator Nexus.
author: joemarshallmsft
ms.author: joemarshall
ms.service: azure-operator-nexus
ms.topic: conceptual
ms.date: 02/12/2024
ms.custom: template-concept
---

# Route Policies in Azure's Operator Nexus Managed Network Fabric

**Route policies** enable operators to control routes learnt and distributed through **Border Gateway Protocol** (BGP). BGP is a routing protocol that exchanges routing information between autonomous systems (AS) on the Internet. BGP uses attributes such as community values and extended community values to tag and filter routes. Route policies can be used to manipulate these attributes and influence the routing behavior.

Route policies are a set of rules that are applied to routes based on their specific attributes. These attributes include IP prefixes, community values, and extended community values. The primary function of these policies is to allow or deny routes and to modify their attributes as needed.

Route policies can be enforced at different endpoints in the network fabric. They can be applied at network-to-network interconnections (NNI) or at different levels in a layer 3 isolation domain, such as external networks, internal networks, and connected subnets. Route policies are applied in the direction of egress or ingress, depending on whether they're export or import policies. Route policies for IPv4 and IPv6 are enforced separately.

Route policies can be specified with combinations of conditions and actions. Conditions are based on IP prefixes, IP communities, and IP extended communities. Actions are based on discarding or permitting routes, and adding, removing, or overwriting community values and extended community values.

Route policies are modeled as Azure Resource Manager (ARM) resources under Microsoft.managednetworkfabric. They can be created, read, and deleted by operators. The operator creates a route policy resource and then applies it at the required enforcement point. A route policy can only be applied at one enforcement point at a time.

## Objective

Route policies are a key component of network management, as they offer control, flexibility, customization, and scalability over route distribution and modification.

Route policies allow operators to control the distribution of routes based on various criteria such as security, performance, or cost. For example, they can prevent routes from an internal network reaching the external networks of a Layer 3 isolation domain, thus enhancing security and performance, and controlling traffic flow.

Route policies also allow operators to modify the attributes of routes based on Border Gateway Protocol (BGP). By modifying the BGP attributes, operators can influence the path selection process in BGP and guide traffic along optimal paths.

Route policies offer a high degree of flexibility and customization, enabling operators to define their own conditions and actions. This enables operators to implement complex logic or custom scenarios that aren't supported by the default routing behavior in the Network Fabric.

Route policies simplify the management of large-scale networks, as they automate the process of managing routes. For example, operators can use route policies to apply consistent and uniform rules across multiple endpoints of a layer 3 isolation domain, or to update route policies in bulk using ARM templates.

## Specifying the Conditions and Actions of a Route Policy

The conditions and actions of a route policy are specified using the IP Prefix, IP Community, and IP Extended Community resources. These resources, modeled as ARM template resources under Microsoft.managednetworkfabric, define the match criteria and the actions for the route policy based on the IP prefix, the IP community, or the IP extended community of the routes.

### IP Prefix Resource

This resource specifies the match conditions for route policies based on the IP prefix (IPv4 or IPv6) of the routes. It contains a list of prefixes with sequence numbers and actions (permit or deny).

### IP Community Resource

This resource specifies the match conditions and actions for route policies based on the community values tagged to the routes. It contains well-known communities or custom community members.

### IP Extended Community Resource

This resource specifies the match conditions and actions for route policies based on the route targets. It contains a list of extended community values and specific properties.

### Condition Property

The condition property of a Route Policy statement defines how routes are matched to the policy:

-   **And**: The policy matches any route that matches **all** of the specified ipPrefixIds, ipCommunityIds, and ipExtendedCommunityIds.

-   **Or**: The policy matches any route that matches **any** of the ipPrefixIds, ipCommunityIds, and ipExtendedCommunityIds.

The ipPrefixId, ipCommunityId, and ipExtendedCommunityId properties are arrays of strings that reference the IP Prefix, IP Community, and IP Extended Community resources that define the match criteria for the route attributes.

### Action Property

The action property of a Route Policy statement defines the action to be taken when a route matches the policy:

-   **Permit**: Permit the matching route and apply the ipCommunityProperties to the route.

-   **Deny**: Deny the matching route and stop the evaluation of the route policy.

-   **Continue**: Apply the ipCommunityProperties to the route, and continue evaluating the route policy with the next statement.

### ipCommunityProperties Property

The ipCommunityProperties property specifies how the policy affects the  community values and extended community values of the route.

It has a set property and a delete property. The set property specifies the IP Community and IP Extended Community resources to add or overwrite to the routes. The delete property specifies the IP Community and IP Extended Community resources to remove from the routes.


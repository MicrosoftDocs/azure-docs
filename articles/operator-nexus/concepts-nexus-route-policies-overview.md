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

Route policies can be specified with combinations of conditions and actions. Conditions are based on IP prefixes, IP communities, and IP extended communities. Actions are based on discarding, permitting, adding, removing, or overwriting community values and extended community values.

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

-   **Continue**: Continue evaluating the route policy with the next statement, and apply the ipCommunityProperties to the route.

### ipCommunityProperties Property

The ipCommunityProperties property specifies how the policy affects the  community values and extended community values of the route.

It has a set property and a delete property. The set property specifies the IP Community and IP Extended Community resources to add or overwrite to the routes. The delete property specifies the IP Community and IP Extended Community resources to remove from the routes.

## Route policy specification

Route policies consist of multiple statements, each with a sequence number, conditions, and actions. The conditions can be combinations of IP prefixes, IP communities, and IP extended communities, which are also modeled as ARM resources under Microsoft.managednetworkfabric. The actions can be permit, deny, or continue, which affect route acceptance or route properties.

### Route Policy Resource Properties

A route policy is modeled as a separate top-level ARM resource under the Microsoft.ManagedNetworkFabric provider namespace. A route policy resource has the following properties:

| Field Name | Description | Type | Required? | Read-only? |
|--|--|--|--|--|
| name | The name of the route policy resource. It must be unique within the resource group and the network fabric. | string | Yes | No |
| id | The unique identifier of the route policy resource in the Azure subscription and resource group. This is read-It follows the format `/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedNetworkFabric/routePolicies/{routePolicyName}`. | string | No | Yes |
| type | The type of the route policy resource, which is always `Microsoft.ManagedNetworkFabric/routePolicies.` | string | No | Yes |
| location | The Azure region where the route policy resource is located. It must be one of the supported Azure regions for Network Fabric. | string | Yes | No |
| provisioningState | The state of the route policy resource provisioning, either `Succeeded` or `Failed`. | string | No | Yes |
| addressFamilyType | The address family type of the route policy, either `IPv4` or `IPv6`. It determines the address family of the routes that the route policy applies to. | string | Yes | No |
| administrativeState | The state of the route policy, either Enabled or Disabled.  | string | Yes | No |
| configurationState | The status of the route policy configuration, either Succeeded or Failed. It indicates whether the route policy has been successfully applied to the network device or not. | string | No | Yes |
| defaultAction | The default action(s) of the route policy. It determines the action to take when no statement matches the traffic. By default this is `permit`. | enum | Yes | No |
| resourceGroup | The name of the resource group to which the route policy resource belongs. | string | Yes | No |
| statements | The array of statements that make up the policy, as described in the next section. | array | Yes | No |

## Statements

A statement is a single rule that defines the condition and the action for a route policy. A statement has a sequence number that determines the order of evaluation. The first statement that matches the route attributes is executed and the rest are ignored.

Each route policy has a list of statements that define the route policy rules. It is an **array** and is **required**. It must have at least one element. Each element is an **object** that has the following properties:

| Name | Description | Type | Required? |
|--|--|--|--|
| sequenceNumber | A number that specifies the order of evaluation of the statements in the route policy. It must be within the range of 1 to 65535. The statements are evaluated from the lowest to the highest sequence number. The first statement that matches the traffic determines the final action of the route policy. If no statement matches the traffic, the default action of the route policy is applied. | integer | Yes |
| condition | An object that specifies the criteria for matching traffic based on the IP prefix, the IP community, or the IP extended community attributes. If present, it must have at least one of the properties in the conditions table, below. | object | No |
| action | An object that specifies the operation to perform on the matched traffic, such as permit, deny, or modify. It must have one of the properties show in the actions table, below. | object | Yes |

### Conditions

If specified, a condition must have at least one of the following properties. If present, the property cannot be empty.

| Name | Description | Type |
|--|--|--|
| ipPrefixId |  Specifies the resource ID of an IP prefix resource that defines a range of IP addresses. It must follow the format /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedNetworkFabric/ipPrefixes/{ipPrefixName}. The traffic that matches the IP prefix will be evaluated by the action of the statement. | string |  array |
| ipExtendedCommunityIds | An array of strings that specify the resource IDs of IP extended community resources that define additional attributes for routes. Each element is a **string** that must not be empty. It must follow the format /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedNetworkFabric/ipExtendedCommunities/{ipExtendedCommunityName}. The route that matches any of the IP extended communities will be evaluated by the action of the statement. If there is more than one element in the list, "OR" condition is applied. | array |


### Actions

The action for the statements array must be one of `permit`, `deny`, or `continue`, indicating whether to accept or reject the route, or continue to the next statement.

In addition, the action can specify one or both of **ipCommunityProperties** and **ipExtendedCommunityProperties**, specifying an array of strings representing (extended) BGP communities.

If present, these fields must also specify one of the following actions:

-   **add**: An array of strings that specify the IP community ARM resource ids to add to the route attributes. It is an **array** and is **optional**, but if present, it must not be empty. Each element is a **string** that must not be empty.

-   **remove**: An array of strings that specify the IP community ARM resource ids to remove from the route attributes. It is an **array** and is **optional**, but if present, it must not be empty.

-   **Set**: An array of strings that specify the IP community ARM resource id values to overwrite the route attributes with. It is an **array** and is **optional**, but if present, it must not be empty.

## Example

An example route policy statement is as follows:

```json
{
  "condition": {
    "type": "And" | "Or",
    "ipPrefixId":
["/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedNetworkFabric/ipPrefixes/{ipPrefixName1}", "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedNetworkFabric/ipPrefixes/{ipPrefixName2}"
],
"ipCommunityId":
["/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedNetworkFabric/ipCommunities/{ipCommunityName1}","/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedNetworkFabric/ipCommunities/{ipCommunityName2}
],
    "ipExtendedCommunityId":
["/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedNetworkFabric/ipExtendedCommunities/{ipExtendedCommunityName1}", "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedNetworkFabric/ipExtendedCommunities/{ipExtendedCommunityName2}”
]
  },
  "action": {
    "actionType": "Permit" | "Deny" | "Continue",
    "ipCommunityProperties": {
      "add": {
        "ipCommunityIds":
["/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedNetworkFabric/ipCommunities/{ipCommunityName}"]
      },
      "remove": {
        "ipCommunityIds":
["/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedNetworkFabric/ipCommunities/{ipCommunityName}"]
      },
      "set": {
        "ipCommunityIds":
["/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedNetworkFabric/ipCommunities/{ipCommunityName}"]
      }
    },
    "ipExtendedCommunityProperties": {
      "add": {
        "ipExtendedCommunityIds":
["/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedNetworkFabric/ipExtendedCommunities/{ipExtendedCommunityName}"]
      },
      "remove": {
        "ipExtendedCommunityIds":
["/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedNetworkFabric/ipExtendedCommunities/{ipExtendedCommunityName}"]
      },
      "set": {
        "ipExtendedCommunityIds":
["/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedNetworkFabric/ipExtendedCommunities/{ipExtendedCommunityName}"]
      }
    }
  },
  "sequenceNumber": 10
}
```


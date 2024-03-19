---
title: Azure Operator Nexus route policy configuration
description: In this article, you learn about the configuration details for route policies in Azure Operator Nexus.
ms.topic: article
ms.date: 02/14/2024
author: joemarshallmsft
ms.author: joemarshall
ms.service: azure-operator-nexus
---

# Route policy configuration

Route policies consist of multiple statements, each with a sequence number, conditions, and actions. The conditions can be combinations of IP prefixes, IP communities, and IP extended communities, which are also modeled as Azure Resource Manager resources under `Microsoft.managednetworkfabric`. The actions can be `Permit`, `Deny`, or `Continue`, which affect route acceptance or route properties.

## Route policy resource properties

A route policy is modeled as a separate top-level Resource Manager resource under the `Microsoft.ManagedNetworkFabric` provider namespace. A route policy resource has the following properties:

| Field name | Description | Type | Required? | Read-only? |
|--|--|--|--|--|
| `name` | The name of the route policy resource. It must be unique within the resource group and the network fabric. | string | Yes | No |
| `id` | The unique identifier of the route policy resource in the Azure subscription and resource group. It follows the format `/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedNetworkFabric/routePolicies/{routePolicyName}`. | string | No | Yes |
| `type` | The type of the route policy resource, which is always `Microsoft.ManagedNetworkFabric/routePolicies.` | string | No | Yes |
| `location` | The Azure region where the route policy resource is located. It must be one of the supported Azure regions for the network fabric. | string | Yes | No |
| provisioningState | The state of the route policy resource provisioning, either `Succeeded` or `Failed`. | string | No | Yes |
| `addressFamilyType` | The address family type of the route policy, either IPv4 or IPv6. It determines the address family of the routes that the route policy applies to. | string | Yes | No |
| `administrativeState` | The state of the route policy, either `Enabled` or `Disabled`. | string | Yes | No |
| `configurationState` | The status of the route policy configuration, either `Succeeded` or `Failed`. It indicates whether the route policy was successfully applied to the network device. | string | No | Yes |
| `defaultAction` | The default action or actions of the route policy. It determines the action to take when no statement matches the traffic. The default value is `Permit`. | enum | Yes | No |
| `resourceGroup` | The name of the resource group to which the route policy resource belongs. | string | Yes | No |
| `statements` | The array of statements that make up the policy, as described in the next section. | array | Yes | No |

## Statements

A statement is a single rule that defines the condition and the action for a route policy. A statement has a sequence number that determines the order of evaluation. The first statement that matches the route attributes is executed and the rest are ignored.

Each route policy has a list of statements that define the route policy rules. It's an *array* and is *required*. It must have at least one element. Each element is an *object* that has the following properties:

| Name | Description | Type | Required? |
|--|--|--|--|
| `sequenceNumber` | A number that specifies the order of evaluation of the statements in the route policy. It must be within the range of 1 to 65,535. The statements are evaluated from the lowest to the highest sequence number. The first statement that matches the traffic determines the final action of the route policy. If no statement matches the traffic, the default action of the route policy is applied. | integer | Yes |
| `condition` | An object that specifies the criteria for matching traffic based on the IP prefix, the IP community, or the IP extended community attributes. If present, it must have at least one of the properties in the conditions table in the next section. | object | No |
| `action` | An object that specifies the operation to perform on the matched traffic, such as `Permit`, `Deny`, or `Modify`. It must have one of the properties shown in the actions table in the **Actions** section. | object | Yes |

### Conditions

If specified, a condition must have at least one of the following properties. If present, the property can't be empty.

| Name | Description | Type |
|--|--|--|
| `ipPrefixId` |  Specifies the resource ID of an IP prefix resource that defines a range of IP addresses. It must follow the format `/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedNetworkFabric/ipPrefixes/{ipPrefixName}`. The statement's action is applied to traffic that matches this prefix. | array |
| `ipExtendedCommunityIds` | An array of strings that specify the resource IDs of IP extended community resources that define more attributes for routes. Each element is a *string* that must not be empty. It must follow the format `/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedNetworkFabric/ipExtendedCommunities/{ipExtendedCommunityName}`. The statement's action is applied to traffic that matches this prefix. If the list contains more than one element, the `Or` condition is applied. | array |

### Actions

The action for the statements array must be one of `Permit`, `Deny`, or `Continue`, indicating whether to accept or reject the route or continue to the next statement.

In addition, the action can specify one or both of `ipCommunityProperties` and `ipExtendedCommunityProperties`, specifying an array of strings representing (extended) Border Gateway Protocol (BGP) communities.

If present, these fields must also specify one of the following actions:

- `add`: An array of strings that specify the IP community Resource Manager resource IDs to add to the route attributes. It's an *array* and is *optional*, but if present, it must not be empty. Each element is a *string* that must not be empty.
- `remove`: An array of strings that specify the IP community Resource Manager resource IDs to remove from the route attributes. It's an *array* and is *optional*, but if present, it must not be empty.
- `set`: An array of strings that specify the IP community Resource Manager resource ID values to overwrite the route attributes with. It's an *array* and is *optional*, but if present, it must not be empty.

## Example

Here's an example route policy statement:

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


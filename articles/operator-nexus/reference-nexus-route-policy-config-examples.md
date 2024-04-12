---
title: Azure Operator Nexus route policy configuration examples
description: This article shows you examples of how to configure route policies for Azure Operator Nexus.
ms.topic: article
ms.date: 02/14/2024
author: joemarshallmsft
ms.author: joemarshall
ms.service: azure-operator-nexus
ms.custom: devx-track-azurecli
---

# Configuration examples for Azure Operator Nexus route policies

This article gives examples of how to configure route policies for Azure Operator Nexus.

## Define a route policy by using JSON format in Azure Operator Nexus

The JSON format is a common way to define a route policy resource in Azure Operator Nexus. The JSON follows the schema of the route policy resource, which has the following properties:

- `id`: The ID of the route policy resource in the format `/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedNetworkFabric/routePolicies/{routePolicyName}`.
- `type`: The type of the resource, which is `microsoft.managednetworkfabric/routepolicies`.
- `addressFamilyType`: The address family type of the route policy resource, which specifies the IP version of the route policy. It can be either IPv4 or IPv6.
- `statements`: An array of statements that define the routing behavior of the route policy resource. Each statement has a sequence number, a condition, and an action property.
- `defaultAction`: The default action of the route policy resource, which specifies the outcome for routes that don't match any statement in the route policy. It can be either `Permit` or `Deny`.
- `configurationState`: The configuration state of the route policy resource, which indicates whether the route policy was successfully applied or not. It can be either `Succeeded`, `Failed`, or `Updating`.

Here's an example of a route policy resource specified in JSON format:

```json
{
  "addressFamilyType": "IPv4",
  "administrativeState": "Enabled",
  "configurationState": "Succeeded",
  "defaultAction": "Permit",
  "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedNetworkFabric/routepolicies/{routePolicyName}",
  "location": "{location}",
  "name": "{routePolicyName}",
  "networkFabricId": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedNetworkFabric/networkFabrics/{networkFabricName}",
  "provisioningState": "Succeeded",
  "resourceGroup": "{resourceGroupName}",
  "statements": [
    {
      "action": {
        "actionType": "Permit"
      },
      "condition": {
        "ipPrefixId": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedNetworkFabric/ipprefixes/{ipPrefixName}",
        "type": "Or"
      },
      "sequenceNumber": 10
    },
    {
      "action": {
        "actionType": "Continue"
      },
      "condition": {
        "ipCommunityIds": [
          "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedNetworkFabric/ipCommunities/{ipCommunityName}"
        ],
        "type": "Or"
      },
      "sequenceNumber": 20
    }
  ],
  "type": "microsoft.managednetworkfabric/routepolicies"
}

```

## Use Azure CLI commands or REST API methods to create and manage route policy resources

The Azure CLI commands and the REST API methods are another way to create and manage route policy resources in Azure Operator Nexus. The Azure CLI commands and the REST API methods follow the same schema of the route policy resource as the JSON format.

To use the Azure CLI commands or the REST API methods, you need to have an Azure account with an active subscription. You must install the latest version of the Azure CLI (2.0 or later) and have an Azure Operator Nexus Network Fabric Controller that manages the network fabrics on the same Azure region.

Here are some examples of the Azure CLI commands or the REST API methods to create and manage route policy resources:

- To create a route policy resource, you can use the `az networkfabric routepolicy create` command or the PUT method with the `/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedNetworkFabric/routePolicies/{routePolicyName}` URI.
- To show the details of a route policy resource, you can use the `az networkfabric routepolicy show` command or the GET method with the `/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedNetworkFabric/routePolicies/{routePolicyName}` URI.
- To update a route policy resource, you can use the `az networkfabric routepolicy update` command or the PATCH method with the `/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedNetworkFabric/routePolicies/{routePolicyName}` URI.
- To delete a route policy resource, you can use the `az networkfabric routepolicy delete` command or the DELETE method with the `/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedNetworkFabric/routePolicies/{routePolicyName}` URI.

## Use the Permit, Deny, and Continue actions in the route policy

The `Permit`, `Deny`, and `Continue` actions are used in the route policy to control the routing behavior.

- The `Permit` action allows the matching routes and applies the IP community properties to the routes. The IP community properties specify how to add, remove, or overwrite community values and extended community values of the routes.

   For example, the operator can use the following statement to permit any route that has an IP prefix equal to the IP prefix resource with the ID `/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedNetworkFabric/ipPrefixes/{ipPrefixName}` and add the IP community value from the IP community resource with the ID `/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedNetworkFabric/ipCommunities/{ipCommunityName}`.

    ```json
    {
      "sequenceNumber": 10,
      "condition": {
        "ipPrefixId": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedNetworkFabric/ipPrefixes/{ipPrefixName}"
      },
      "action": {
        "actionType": "Permit",
        "ipCommunityProperties": {
          "set": {
            "ipCommunityIds": [
              "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedNetworkFabric/ipCommunities/{ipCommunityName}"
            ]
          }
        }
      }
    }
    ```

- The `Deny` action rejects the matching routes and stops the evaluation of the route policy.

   For example, the operator can use the following statement to deny any route that has an IP community value equal to the IP community resource with the ID `/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedNetworkFabric/ipCommunities/{ipCommunityName}`.
    
    ```json
    {
      "sequenceNumber": 20,
      "condition": {
        "ipCommunityId": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedNetworkFabric/ipCommunities/{ipCommunityName}"
      },
      "action": {
        "actionType": "Deny"
      }
    }
    ```

- The `Continue` action continues the evaluation of the route policy with the next statement and applies the IP community properties to the routes. The IP community properties specify how to add, remove, or overwrite community values and extended community values of the routes.

   For example, the operator can use the following statement to continue the evaluation of the route policy with the next statement:

    ```json
    {
      "sequenceNumber": 30,
      "condition": {
        "ipExtendedCommunityId": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedNetworkFabric/ipExtendedCommunities/{ipExtendedCommunityName}"
      },
      "action": {
        "actionType": "Continue"
        }
      }
    }
    ```

## Use the IP community properties to add, remove, or overwrite community values and extended community values of the routes

The IP community properties of the action property specify how to add, remove, or overwrite community values and extended community values of the routes. The IP community properties have a `set` property and a `delete` property. The `set` property specifies the IP community and IP extended community resources to add or overwrite to the routes. The `delete` property specifies the IP community and IP extended community resources to remove from the routes.

- The `set` property has an `ipCommunityIds` property and an `ipExtendedCommunityIds` property. The `ipCommunityIds` property is an array of strings that reference IP community resources that define the community values to add or overwrite to the routes. The `ipExtendedCommunityIds` property is an array of strings that reference IP extended community resources that define the extended community values to add or overwrite to the routes.
- The `delete` property has an `ipCommunityIds` property and an `ipExtendedCommunityIds` property. The `ipCommunityIds` property is an array of strings that reference IP community resources that define the community values to remove from the routes. The `ipExtendedCommunityIds` property is an array of strings that reference IP extended community resources that define the extended community values to remove from the routes.
- The `add` property has an `ipCommunityIds` property and an `ipExtendedCommunityIds` property. The `ipCommunityIds` property is an array of strings that reference IP community resources that define the community values to add to the routes. The `ipExtendedCommunityIds` property is an array of strings that reference IP extended community resources that define the extended community values to remove from the routes.

If the `set` property is used, the `add` and `delete` properties can't be used.

For example, the operator can use the following statement to:

1. Permit any route that has an IP prefix equal to the IP prefix resource with the ID `/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedNetworkFabric/ipPrefixes/{ipPrefixName}`.
1. Add the IP community value from the IP community resource with the ID `/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedNetworkFabric/ipCommunities/{ipCommunityName1}`.
1. Overwrite the IP extended community value with the IP extended community resource with the ID `/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedNetworkFabric/ipExtendedCommunities/{ipExtendedCommunityName2}`.

```json
{
  "sequenceNumber": 40,
  "condition": {
    "ipPrefixId": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedNetworkFabric/ipPrefixes/{ipPrefixName}"
  },
  "action": {
    "actionType": "Permit",
    "ipCommunityProperties": {
      "set": {
        "ipCommunityIds": [
          "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedNetworkFabric/ipCommunities/{ipCommunityName1}"
        ],
        "ipExtendedCommunityIds": [
          "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedNetworkFabric/ipExtendedCommunities/{ipExtendedCommunityName2}"
        ]
      }
    }
  }
}
```

## More examples

Here are more examples.

### Example 1: Permit and set IP community

In this example, the route policy has one statement that permits traffic from a specific IP prefix (`ipprefixv4-1204-cn1`) and sets an IP community property (`ipcommunity-2701`) to it.

```json
{
  "name": "rcf-op1-l3domain-v6-connsubnet-ext-policy",
  "id": "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.ManagedNetworkFabric/routePolicies/rcf-op1-l3domain-v6-connsubnet-ext-policy",
  "type": "Microsoft.ManagedNetworkFabric/routePolicies",
  "properties": {
    "provisioningState": "Succeeded",
    "statements": [
      {
        "condition": {
          "ipPrefixId": "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.ManagedNetworkFabric/ipPrefixes/ipprefixv4-1204-cn1"
        },
        "sequenceNumber": 10,
        "action": {
          "actionType": "Permit",
          "ipCommunityProperties": {
            "set": {
              "ipCommunityIds": [
                "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.ManagedNetworkFabric/ipCommunities/ipcommunity-2701"
              ]
            }
          }
        }
      }
    ]
  }
}
```

### Example 2: Continue and IP prefix and IP community

In this example, the route policy has two statements that apply to the IPv4 address family. The first statement continues to the next statement if the traffic matches either one of the two IP prefixes `ipprefix-example-3` or `ipprefix-example-4`. Traffic that matches either one of the IP prefixes won't be filtered or modified but will be evaluated by the next statement. The second statement permits the traffic if it matches either one of the two IP communities `ipcommunity-example-3` or `ipcommunity-example-4`.

```json
{
  "name": "routePolicy8",
  "id": "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.ManagedNetworkFabric/routePolicies/routePolicy8",
  "type": "Microsoft.ManagedNetworkFabric/routePolicies",
  "properties": {
    "provisioningState": "Succeeded",
    "addressFamilyType": "IPv4",
    "statements": [
      {
        "condition": {
          "ipPrefixIds": [
            "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.ManagedNetworkFabric/ipPrefixes/ipprefix-example-3",
            "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.ManagedNetworkFabric/ipPrefixes/ipprefix-example-4"
          ],
          "type": "Or"
        },
        "action": {
          "actionType": "Continue"
        },
        "sequenceNumber": 10
      },
      {
        "condition": {
          "ipCommunityIds": [
            "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.ManagedNetworkFabric/ipCommunities/ipcommunity-example-3",
            "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.ManagedNetworkFabric/ipCommunities/ipcommunity-example-4"
          ],
          "type": "Or"
        },
        "action": {
          "actionType": "Permit"
        },
        "sequenceNumber": 20
      }
    ]
  }
}
```

### Example 3: Deny when both IP prefix and IP community match

In this example, the route policy has one statement that applies to the IPv6 address family. The statement discards the traffic if it matches both an IP prefix (`ipprefix-example-1`) and an IP community (`ipcommunity-example-1`).

```json
{
  "name": "routePolicy1",
  "id": "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.ManagedNetworkFabric/routePolicies/routePolicy1",
  "type": "Microsoft.ManagedNetworkFabric/routePolicies",
  "properties": {
    "provisioningState": "Succeeded",
    "addressFamilyType": "IPv6",
    "statements": [
      {
        "condition": {
          "ipPrefixIds": [
            "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.ManagedNetworkFabric/ipPrefixes/ipprefix-example-1"
          ],
          "ipCommunityIds": [
            "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.ManagedNetworkFabric/ipCommunities/ipcommunity-example-1"
          ],
          "type": "And"
        },
        "action": {
          "actionType": "Deny"
        },
        "sequenceNumber": 10
      }
    ]
  }
}
```

### Example 4: Permit and overwrite IP community

In this example, the route policy has one statement that permits traffic from any IP prefix and overwrites the IP extended community property to the new value `ipextendedcommunity-2702`.

```json
{
  "name": "routePolicy2",
  "id": "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.ManagedNetworkFabric/routePolicies/routePolicy2",
  "type": "Microsoft.ManagedNetworkFabric/routePolicies",
  "properties": {
    "provisioningState": "Succeeded",
    "statements": [
      {
        "condition": {
          "ipPrefixId": "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.ManagedNetworkFabric/ipPrefixes/ipprefix-example-1"
        },
        "action": {
          "actionType": "Permit",
          "ipExtendedCommunityProperties": {
            "set": {
              "ipExtendedCommunityIds": [
                "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.ManagedNetworkFabric/ipExtendedCommunities/ipextendedcommunity-2702"
              ]
            }
          }
        },
        "sequenceNumber": 10
      }
    ]
  }
}
```

### Example 5: Update a route policy

In this example, the route policy `routePolicy2` is updated to include an extra IP community.

```json
{
  "name": "routePolicy2",
  "id": "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.ManagedNetworkFabric/routePolicies/routePolicy2",
  "type": "Microsoft.ManagedNetworkFabric/routePolicies",
  "properties": {
    "provisioningState": "Succeeded",
    "statements": [
      {
        "condition": {
          "ipPrefixId": "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.ManagedNetworkFabric/ipPrefixes/ipprefix-example-1"
        },
        "action": {
          "actionType": "Permit",
          "ipCommunityProperties": {
            "add": {
              "ipCommunityIds": [
                "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.ManagedNetworkFabric/ipCommunities/ipcommunity-2701"
              ]
            },
            "ipExtendedCommunityProperties": {
              "set": {
                "ipExtendedCommunityIds": [
                  "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.ManagedNetworkFabric/ipExtendedCommunities/ipextendedcommunity-2702"
                ]
              }
            }
          }
        },
        "sequenceNumber": 10
      }
    ]
  }
}
```

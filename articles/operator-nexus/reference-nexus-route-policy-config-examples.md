---
title: Operator Nexus Route Policy Configuration Examples
description: Configuration examples for Route Policies
ms.topic: article
ms.date: 02/14/2024
author: joemarshallmsft
ms.author: joemarshall
ms.service: azure-operator-nexus
---

# Configuration Examples for Nexus Route Policies

This article gives examples of how to configure route policies for Operator Nexus.

## Define a Route Policy Using JSON Format in Azure Operator Nexus

The JSON format is a common way to define a Route Policy resource in Azure Operator Nexus. The JSON follows the schema of the Route Policy resource, which has the following properties:

-   **id**: The ID of the Route Policy resource in the format `/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedNetworkFabric/routePolicies/{routePolicyName}`.

-   **type**: The type of the resource, which is `microsoft.managednetworkfabric/routepolicies`.

-   **addressFamilyType**: The address family type of the Route Policy resource, which specifies the IP version of the route policy. It can be either IPv4 or IPv6.

-   **statements**: An array of statements that define the routing behavior of the Route Policy resource. Each statement has a sequenceNumber, a condition, and an action property.

-   **defaultAction**: The default action of the Route Policy resource, which specifies the outcome for routes that don't match any statement in the route policy. It can be either Permit or Deny.

-   **configurationState**: The configuration state of the Route Policy resource, which indicates whether the route policy was successfully applied or not. It can be either Succeeded, Failed, or Updating.

Here's an example of a Route Policy resource specified in JSON format:

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

## Use Azure CLI Commands or REST API Methods to Create and Manage Route Policy Resources

The Azure CLI commands and the REST API methods are another way to create and manage Route Policy resources in Azure Operator Nexus. The Azure CLI commands and the REST API methods follow the same schema of the Route Policy resource as the JSON format.

To use the Azure CLI commands or the REST API methods, you need to have an Azure account with an active subscription. You must install the latest version of the azcli tool (2.0 or later), and have a Network Fabric controller that manages the Network Fabrics on the same Azure region.

Here are some examples of the Azure CLI commands or the REST API methods to create and manage Route Policy resources:

-   To create a Route Policy resource, you can use the `az networkfabric routepolicy create` command or the PUT method with the `/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedNetworkFabric/routePolicies/{routePolicyName}` URI.

-   To show the details of a Route Policy resource, you can use the `az networkfabric routepolicy show` command or the GET method with the `/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedNetworkFabric/routePolicies/{routePolicyName}` URI.

-   To update a Route Policy resource, you can use the `az networkfabric routepolicy update` command or the PATCH method with the `/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedNetworkFabric/routePolicies/{routePolicyName}` URI.

-   To delete a Route Policy resource, you can use the `az networkfabric routepolicy delete` command or the DELETE method with the `/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedNetworkFabric/routePolicies/{routePolicyName}` URI.


## Use the Permit, Deny, and Continue Actions in Route Policy

The Permit, Deny, and Continue actions are used in the Route Policy to control the routing behavior.

-   The Permit action allows the matching routes and applies the IP Community properties to the routes. The IP Community properties specify how to add, remove, or overwrite community values and extended community values of the routes.

For example, the operator can use the following statement to permit any route that has an IP Prefix equal to the IP Prefix resource with the ID `/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedNetworkFabric/ipPrefixes/{ipPrefixName}` and add the IP Community value from the IP Community resource with the ID `/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedNetworkFabric/ipCommunities/{ipCommunityName}`.

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

-   The Deny action rejects the matching routes and stops the evaluation of the route policy.

For example, the operator can use the following statement to deny any route that has an IP Community value equal to the IP Community resource with the ID `/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedNetworkFabric/ipCommunities/{ipCommunityName}`.

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

-   The Continue action continues the evaluation of the route policy with the next statement and applies the IP Community properties to the routes. The IP Community properties specify how to add, remove, or overwrite community values and extended community values of the routes.

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

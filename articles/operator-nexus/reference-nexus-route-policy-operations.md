---
title: Azure Operator Nexus route policy configuration operations
description: In this article, you learn about configuration operation details for route policies for Azure Operator Nexus.
ms.topic: article
ms.date: 02/14/2024
author: joemarshallmsft
ms.author: joemarshall
ms.service: azure-operator-nexus
---

# Configuration operations for Azure Operator Nexus route policies

This article gives an overview of operational procedures to create, modify, and delete route policies for Azure Operator Nexus.

## Create a route policy and apply it to a network fabric endpoint

To create a route policy and apply it to a network fabric endpoint:

1. Create an IP prefix resource, IP community resource, or IP extended community resource. There are three options:

    - Create an IP prefix resource to specify the match conditions for route policies based on the IP prefix (IPv4 or IPv6) of the routes. You can provide a list of prefixes with sequence numbers and actions (`Permit` or `Deny`).
    - Create an IP community resource to specify the match conditions and actions for route policies based on the community values tagged to the routes. You can provide well-known communities or custom community members.
    - Create an IP extended community resource to specify the match conditions and actions for route policies based on the extended community values tagged to the routes. You can provide a list of extended community values and specific properties.

1. Create a route policy resource to specify the conditions and actions based on the IP prefixes, IP communities, and IP extended communities. Each route policy consists of multiple statements, each with a sequence number, conditions, and actions. The conditions can be combinations of IP prefixes, IP communities, and IP extended communities and are applied in ascending order of sequence numbers. The action that corresponds to the first matched condition is executed. The actions can permit or deny the route or add, remove, or overwrite community values and extended community values.

1. Apply the route policy to the desired endpoint of the layer 3 isolation domain or network-to-network interconnections (NNIs). You can set the `ipv4exportRoutePolicyId` or `ipv4ImportRoutePolicyId` property of the external network or internal network resource, or the `connectedSubnetRoutePolicy` property of the layer 3 isolation domain resource, to the route policy resource ID created in the previous step based on the `addressFamilyType` of the route.

The following conditions must be satisfied when you create route policy resources:

- `NetworkFabricId`: Mandatory and shouldn't be null or empty.
- `Statements`: Mandatory and shouldn't be null or empty. At least one statement must be provided.

- For each statement:

    - `SequenceNumber`: Mandatory and shouldn't be null.
    - `condition`: Mandatory and shouldn't be null or empty. At least one of the `IpPrefixId`, `IpCommunityIds`, and `IpExtendedCommunityIds` properties should be provided.
    - `action`: Mandatory and shouldn't be null or empty. The `ActionType` property shouldn't be null. If the `ActionType` property is `Permit` or `Continue`, then the properties `IpCommunityProperties` and `IpExtendedCommunityProperties` are validated.

- `IpCommunityProperties`: If provided, at least one of the operations `add`, `set`, or `delete` should be specified. Each operation should have at least one `IpCommunityId` property.
- `IpExtendedCommunityProperties`: If provided, at least one of the operations `add`, `set`, or `delete` should be provided. Each operation should have at least one `IpExtendedCommunityId` property.
- **Unique sequence numbers**: All the statements provided should have unique sequence numbers.

## Update a route policy and modify its attributes

You can update route policies in multiple ways:

- Update the existing IP prefix resources, IP community resources, or IP extended community resources.
- Update a route policy with more statements of new and/or existing IP prefix resources, IP community resources, or IP extended community resources.
- Update only the sequence numbers or actions of existing route policies.

Whenever a route policy is updated via the Azure CLI, the Azure portal, or the Azure REST API, all the existing statements and resources are replaced with the new statements and resources.

To update a route policy and modify its attributes:

1. Modify the IP prefix resource, IP community resource, or IP extended community resource:

    - Modify the IP prefix resource to update the match conditions for route policies based on the IP prefix (IPv4 or IPv6) of the routes. You can modify the list of prefixes, sequence numbers, and actions (`Permit` or `Deny`).
    - Modify the IP community resource to update the match conditions and actions for route policies based on the community values tagged to the routes. You can modify the well-known communities or custom community members.
    - Modify the IP extended community resource to update the match conditions and actions for route policies based on the route targets. You can modify the list of extended community values and specific properties.

1. Modify the route policy resource to update the conditions and actions based on the IP prefixes, IP communities, and IP extended communities. You can modify the existing statements or add new statements, each with a sequence number, conditions, and actions. The conditions can be combinations of IP prefixes, IP communities, and IP extended communities, and are applied in ascending order of sequence numbers. The action corresponding to the first matched condition is executed. The actions can be `Permit`, `Deny`, `add`, `remove`, or `overwrite` community values and extended community values.

1. After a route policy, IP prefix, IP community, or IP extended community resource is updated, the commit configuration needs to be invoked on the fabric.

The following conditions must be met when you update route policy resources:

- `NetworkFabricId`: Mandatory and shouldn't be null or empty.
- `Statements`: Mandatory and shouldn't be null or empty. At least one statement must be provided.

- For each statement:

    - `SequenceNumber`: Mandatory and shouldn't be null.
    - `condition`: Mandatory and shouldn't be null or empty. At least one of the `IpPrefixId`, `IpCommunityIds`, and `IpExtendedCommunityIds` properties should be provided.
    - `action`: Mandatory and shouldn't be null or empty. The `ActionType` property shouldn't be null. If the`ActionType` property is `Permit` or `Continue`, then the properties `IpCommunityProperties` and `IpExtendedCommunityProperties` are validated.

- `IpCommunityProperties`: If provided, at least one of the operations `add`, `set`, or `delete` should be provided. Each operation should have at least one `IpCommunityId` property.
- `IpExtendedCommunityProperties`: If provided, at least one of the operations `add`, `set`, or `delete` should be provided. Each operation should have at least one `IpExtendedCommunityId` property.
- **Unique sequence numbers**: All the statements provided should have unique sequence numbers.

## Delete a route policy and remove it from network fabric endpoints

To delete a route policy and remove it from network fabric endpoints:

1. Remove the route policy from the endpoint of the layer 3 isolation domain or NNI where it was previously applied. You can set the `ipv4exportRoutePolicyId` or `ipv4ImportRoutePolicyId` property of the external network or internal network resource, or the `connectedSubnetRoutePolicy` property of the layer 3 isolation domain resource, to null based on the `addressFamilyType` of the route.

1. Delete the conditions and actions based on the IP prefixes, IP communities, and IP extended communities. You can delete the route policy resource by its ID or name.

1. Delete the IP prefix resource or IP community resource or IP extended community resource:

    - Delete the IP prefix resource to delete the match conditions for route policies based on the IP prefix (IPv4 or IPv6) of the routes. You can delete the IP prefix resource by its ID or name.
    - Delete the IP community resource to delete the match conditions and actions for route policies based on the community values tagged to the routes. You can delete the IP community resource by its ID or name.
    - Delete the IP extended community resource to delete the match conditions and actions for route policies based on the route targets. You can delete the IP extended community resource by its ID or name.

The following conditions must be satisfied when you delete route policy resources:

- `IpCommunityProperties` `delete` operation: If the `delete` operation is provided, it shouldn't be empty and must have at least one `IpCommunityId` property. Each `IpCommunityId` property shouldn't be null or empty. If both `delete` and `add` operations are provided, they shouldn't have the same `IPCommunityIDs` property.
- `IpExtendedCommunityProperties` `delete` operation: If the `delete` operation is provided, it shouldn't be empty and must have at least one `IpExtendedCommunityId` property. Each `IpExtendedCommunityId` property shouldn't be null or empty. If both `delete` and `add` operations are provided, they shouldn't have the same `IpExtendedCommunityIDs` property.
---
title: Azure Operator Nexus Route Policy Configuration Operations
description: Configuration operation details for Route Policies
ms.topic: article
ms.date: 02/14/2024
author: joemarshallmsft
ms.author: joemarshall
ms.service: azure-operator-nexus
---

# Configuration Operations for Azure Operator Nexus Route Policies

This article gives an overview of operational procedures to create, modify, and delete Route Policies for Azure Operator Nexus.

## Create a Route Policy and Apply it to a Network Fabric Endpoint

To create a Route Policy and apply it to a network fabric endpoint, follow these steps:

1.  **Create an IP Prefix resource, IP Community resource, or IP Extended Community resource**. There are three options:

    -   Create an IP Prefix resource to specify the match conditions for route policies based on the IP prefix (IPv4 or IPv6) of the routes. You can provide a list of prefixes with sequence numbers and actions (permit or deny).

    -   Create an IP Community resource to specify the match conditions and actions for route policies based on the community values tagged to the routes. You can provide well-known communities or custom community members.

    -   Create an IP Extended Community resource to specify the match conditions and actions for route policies based on the extended community values tagged to the routes. You can provide a list of extended community values and specific properties.

2.  **Create a Route Policy resource** to specify the conditions and actions based on the IP Prefixes, IP Communities, and IP Extended Communities. Each route policy consists of multiple statements, each with a sequence number, conditions, and actions. The conditions can be combinations of IP Prefixes, IP Communities, and IP Extended Communities, and are applied in ascending order of sequence numbers. The action corresponding to the first matched condition is executed. The actions can permit or deny the route, or add, remove, or overwrite community values and extended community values.

3.  **Apply the Route Policy resource** to apply the route policy to the desired endpoint of the Layer 3 isolation domain or Network-to-Network Interconnect (NNI). You can set the ipv4exportRoutePolicyId or ipv4ImportRoutePolicyId property of the External network or Internal network resource, or the connectedSubnetRoutePolicy property of the Layer 3 isolation domain resource, to the route policy resource ID created in the previous step based on the addressFamilyType of the route.

The following conditions must be satisfied when creating Route policy resources:

-  **NetworkFabricId**: Mandatory and shouldn't be null or empty.

-  **Statements**: Mandatory and shouldn't be null or empty. At least one statement must be provided.

-  For each **Statement**:

    -   **SequenceNumber**: Mandatory and shouldn't be null.

    -   **Condition**: Mandatory and shouldn't be null or empty. At least one of IpPrefixId, IpCommunityIds, and IpExtendedCommunityIds should be provided.

    -   **Action**: Mandatory and shouldn't be null or empty. The ActionType shouldn't be null. If the ActionType is Permit or Continue, then IpCommunityProperties and IpExtendedCommunityProperties are validated.

-  **IpCommunityProperties**: If provided, at least one of `add`, `set`, or `delete` should be specified. Each operation should have at least one IpCommunityId.

-  **IpExtendedCommunityProperties**: If provided, at least one of the operations `add`, `set`, or `delete` should be provided. Each operation should have at least one IpExtendedCommunityId.

-  **Unique Sequence Numbers**: All the statements provided should have unique sequence numbers.

## Update a Route Policy and Modify its Attributes

Route Policies can be updated in multiple ways:

-   Update existing IP Prefix resources or IP Community resources or IP Extended Community resources.

-   Update a Route Policy with additional statements of new and/or existing IP Prefix resources or IP Community resources or IP Extended Community resources.

-   Update only the sequence numbers or actions of existing route policies.

Whenever a route policy is updated via azcli,  the Azure portal, or the Azure REST API, all the existing statements and resources are replaced with the new statements and resources.

To update a Route Policy and modify its attributes, follow these steps:


1.  **Modify the IP Prefix resource, IP Community resource or IP Extended Community resource**:

    -   Modify the IP Prefix resource to update the match conditions for route policies based on the IP prefix (IPv4 or IPv6) of the routes. You can modify the list of prefixes, sequence numbers, and actions (permit or deny).

    -   Modify the IP Community resource to update the match conditions and actions for route policies based on the community values tagged to the routes. You can modify the well-known communities or custom community members.

    -   Modify the IP Extended Community resource to update the match conditions and actions for route policies based on the route targets. You can modify the list of extended community values and specific properties.

2.  **Modify the Route Policy resource** to update the conditions and actions based on the IP Prefixes, IP Communities, and IP Extended Communities. You can modify the existing statements or add new statements, each with a sequence number, conditions, and actions. The conditions can be combinations of IP Prefixes, IP Communities, and IP Extended Communities, and are applied in ascending order of sequence numbers. The action corresponding to the first matched condition is executed. The actions can be permit, deny, add, remove, or overwrite community values and extended community values.

3.  After a route policy, IP prefix, IP community, or IP extended community resource is updated, the commit-configuration needs to be invoked on the fabric.

The following conditions must be met when updating Route policy resources:

-  **NetworkFabricId**: Mandatory and shouldn't be null or empty. 

-  **Statements**: Mandatory and shouldn't be null or empty. At least one statement must be provided. 

-  For each **Statement**: 

    -   **SequenceNumber**: Mandatory and shouldn't be null. 

    -   **Condition**: Mandatory and shouldn't be null or empty. At least one of IpPrefixId, IpCommunityIds, and IpExtendedCommunityIds should be provided. 

    -   **Action**: Mandatory and shouldn't be null or empty. The ActionType shouldn't be null. If the ActionType is Permit or Continue, then IpCommunityProperties and IpExtendedCommunityProperties are validated. 

-  **IpCommunityProperties**: If provided, at least one of `add`, `set`, or `delete` should be provided. Each operation should have at least one IpCommunityId. 

-  **IpExtendedCommunityProperties**: If provided, at least one of `add`, `set`, or `delete` should be provided. Each operation should have at least one IpExtendedCommunityId. 

-  **Unique Sequence Numbers**: All the statements provided should have unique sequence numbers. 


## Deleting a Route Policy and Removing it from Network Fabric Endpoints

To delete a Route Policy and remove it from network fabric endpoints, follow these steps:

1.  **Remove the Route Policy resource**: Remove the route policy from the endpoint of the Layer 3 isolation domain or NNI where it was previously applied. You can set the ipv4exportRoutePolicyId or ipv4ImportRoutePolicyId property of the External network or Internal network resource, or the connectedSubnetRoutePolicy property of the Layer 3 isolation domain resource, to null based on the addressFamilyType of the route.

2.  **Delete the Route Policy resource**: Delete the conditions and actions based on the IP Prefixes, IP Communities, and IP Extended Communities. You can delete the route policy resource by its ID or name.

3.  **Delete the IP Prefix resource or IP Community resource or IP Extended Community resource**:

    -   Delete the IP Prefix resource to delete the match conditions for route policies based on the IP prefix (IPv4 or IPv6) of the routes. You can delete the IP prefix resource by its ID or name.

    -   Delete the IP Community resource to delete the match conditions and actions for route policies based on the community values tagged to the routes. You can delete the IP community resource by its ID or name.

    -   Delete the IP Extended Community resource to delete the match conditions and actions for route policies based on the route targets. You can delete the IP extended community resource by its ID or name.

The following conditions must be satisfied while deleting Route policy resources:

-  **IpCommunityProperties Delete Operation**: If the delete operation is provided, it shouldn't be empty and must have at least one IpCommunityId. Each IpCommunityId shouldn't be null or empty. If both delete and add operations are provided, they shouldn't have the same IPCommunityIDs.

-  **IpExtendedCommunityProperties Delete Operation**: If the delete operation is provided, it shouldn't be empty and must have at least one IpExtendedCommunityId. Each IpExtendedCommunityId shouldn't be null or empty. If both delete and add operations are provided, they shouldn't have the same IpExtendedCommunityIDs.
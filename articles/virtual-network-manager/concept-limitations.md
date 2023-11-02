---
title: 'Limitations with Azure Virtual Network Manager'
description: Learn about current limitations when using Azure Virtual Network Manager to manage virtual networks.
author: mbender-ms
ms.author: mbender
ms.service: virtual-network-manager
ms.topic: conceptual
ms.date: 07/18/2023
ms.custom: template-concept
#CustomerIntent: As a network administration, I want undertand the limitations in Azure Virtual Network Manager so that I can properly deploy a virtual manager in my environment.
---

# Limitations with Azure Virtual Network Manager

This article provides an overview of the current limitations when using [Azure Virtual Network Manager](overview.md) to manage virtual networks. As a network administrator, it's important to understand these limitations to properly deploy an Azure Virtual Network Manager instance in your environment. The article covers various limitations related to Azure Virtual Network Manager, including the maximum number of virtual networks, overlapping IP spaces, and policy compliance evaluation cycle. 

[!INCLUDE [virtual-network-manager-preview](../../includes/virtual-network-manager-preview.md)]

## General limitations

* [Cross-tenant support](concept-cross-tenant.md) is only available when virtual networks are assigned to network groups with static membership.

* Customers with more than 15,000 Azure subscriptions can apply Azure Virtual Network Policy only at the [subscription and resource group scopes](concept-network-manager-scope.md). Management groups can't be applied over the 15 k subscription limit.
   * If this is your scenario, you would need to create assignments at lower level management group scope that have less than 15,000 subscriptions.

* Virtual networks can't be added to a network group when the Azure Virtual Network Manager custom policy `enforcementMode` element is set to `Disabled`.

* Azure Virtual Network Manager policies don't support the standard policy compliance evaluation cycle. For more information, see [Evaluation triggers](../governance/policy/how-to/get-compliance-data.md#evaluation-triggers).

## Connected group limitations

* A connected group can have up to 250 virtual networks. Virtual networks in a [mesh topology](concept-connectivity-configuration.md#mesh-network-topology) are in a [connected group](concept-connectivity-configuration.md#connected-group), therefore a mesh configuration has a limit of 250 virtual networks.
* The current preview of connected group has a limitation where traffic from a connected group can't communicate with a private endpoint in this connected group if it has a network security group enabled on it. However, this limitation will be removed once the feature is generally available.
* You can have network groups with or without [direct connectivity](concept-connectivity-configuration.md#direct-connectivity) enabled in the same [hub-and-spoke configuration](concept-connectivity-configuration.md#hub-and-spoke-topology), as long as the total number of virtual networks peered to the hub **doesn't exceed 500** virtual networks.
    * If the network group peered with the hub **has direct connectivity enabled**, these virtual networks are in a *connected group*, therefore the network group has a limit of **250** virtual networks.
    * If the network group peered with the hub **doesn't have direct connectivity enabled**, the network group can have up to the total limit for a hub-and-spoke topology.
* A virtual network can be part of up to two connected groups. For example, a virtual network:

    - Can be part of two mesh configurations.
    - Can be part of a mesh topology and a network group that has direct connectivity enabled in a hub-and-spoke topology.
    - Can be part of two network groups with direct connectivity enabled in the same or different hub-and-spoke configuration.

* You can have virtual networks with overlapping IP spaces in the same connected group. However, communication to an overlapped IP address is dropped.

## Security admin rule limitations

* The maximum number of IP prefixes in all [security admin rules](concept-security-admins.md) combined is 1000. 

* The maximum number of admin rules in one level of Azure Virtual Network Manager is 100. 

## Related content

- [Frequently asked questions](faq.md)


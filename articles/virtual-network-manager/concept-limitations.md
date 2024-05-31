---
title: Limitations with Azure Virtual Network Manager
description: Learn about current limitations when you're using Azure Virtual Network Manager to manage virtual networks.
author: mbender-ms
ms.author: mbender
ms.service: virtual-network-manager
ms.topic: conceptual
ms.date: 07/18/2023
ms.custom: template-concept
#CustomerIntent: As a network admin, I want understand the limitations in Azure Virtual Network Manager so that I can properly deploy it my environment.
---

# Limitations with Azure Virtual Network Manager

This article provides an overview of the current limitations when you're using [Azure Virtual Network Manager](overview.md) to manage virtual networks. Understanding these limitations can help you properly deploy an Azure Virtual Network Manager instance in your environment. The article covers topics like the maximum number of virtual networks, overlapping IP spaces, and the evaluation cycle for policy compliance.

[!INCLUDE [virtual-network-manager-preview](../../includes/virtual-network-manager-preview.md)]

## General limitations

* [Cross-tenant support](concept-cross-tenant.md) is available only when virtual networks are assigned to network groups with static membership.

* Customers with more than 15,000 Azure subscriptions can apply an Azure Virtual Network Manager policy only at the [subscription and resource group scopes](concept-network-manager-scope.md). You can't apply management groups over the limit of 15,000 subscriptions. In this scenario, you would need to create assignments at a lower-level management group scope that have fewer than 15,000 subscriptions.

* You can't add virtual networks to a network group when the Azure Virtual Network Manager custom policy `enforcementMode` element is set to `Disabled`.

* Azure Virtual Network Manager policies don't support the standard evaluation cycle for policy compliance. For more information, see [Evaluation triggers](../governance/policy/how-to/get-compliance-data.md#evaluation-triggers).
* The move of the subscription where the Azure Virtual Network Manager instance exists to another tenant is not supported.

## Limitations for connected groups

* A connected group can have up to 250 virtual networks. Virtual networks in a [mesh topology](concept-connectivity-configuration.md#mesh-network-topology) are in a [connected group](concept-connectivity-configuration.md#connected-group), so a mesh configuration has a limit of 250 virtual networks.
* In the current preview of connected groups, traffic from a connected group can't communicate with private endpoints.
* You can have network groups with or without [direct connectivity](concept-connectivity-configuration.md#direct-connectivity) enabled in the same [hub-and-spoke configuration](concept-connectivity-configuration.md#hub-and-spoke-topology), as long as the total number of virtual networks peered to the hub doesn't exceed 500 virtual networks.
  * If the network group peered to the hub *has direct connectivity enabled*, these virtual networks are in a connected group, so the network group has a limit of 250 virtual networks.
  * If the network group peered to the hub *doesn't have direct connectivity enabled*, the network group can have up to the total limit for a hub-and-spoke topology.
* A virtual network can be part of up to two connected groups. For example, a virtual network:

  * Can be part of two mesh configurations.
  * Can be part of a mesh topology and a network group that has direct connectivity enabled in a hub-and-spoke topology.
  * Can be part of two network groups with direct connectivity enabled in the same or a different hub-and-spoke configuration.

* You can have virtual networks with overlapping IP spaces in the same connected group. However, communication to an overlapped IP address is dropped.

## Limitations for security admin rules

* The maximum number of IP prefixes in all [security admin rules](concept-security-admins.md) combined is 1,000.

* The maximum number of admin rules in one level of Azure Virtual Network Manager is 100.

## Related content

* [Frequently asked questions](faq.md)

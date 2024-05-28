---
title: Administrative State (Admin State) in Azure Load Balancer
titleSuffix: Azure Load Balancer
description: Overview of Administrative State (Admin State) in Azure Load Balancer.
services: load-balancer
author: mbender-ms
ms.service: load-balancer
ms.topic: conceptual
ms.date: 05/29/2024
ms.author: mbender
ms.custom: template-concept, references_regions
---

# Administrative State (Admin State) in Azure Load Balancer

Administrative state (Admin state) is a feature of Azure Load Balancer that allows you to override the Load Balancer’s health probe behavior on a per backend pool instance basis. This feature is useful in scenarios where you would like to take down your backend instance for maintenance, patching, or testing.

[!INCLUDE [load-balancer-admin-state-preview](../../includes/load-balancer-admin-state-preview.md)]


## Why use admin state? 

Admin state is useful in scenarios where you want to have more control over the behavior of your Load Balancer. For example, you can set the admin state to up to always consider the backend instance eligible for new connections, even if the health probe indicates otherwise. Conversely, you can set the admin state to down to prevent new connections, even if the health probe indicates that the backend instance is healthy. This can be useful for maintenance or other scenarios where you want to temporarily take a backend instance out of rotation.

## Types of admin state values 

There are three types of admin state values: **UP**, **DOWN**, **NONE**. The following table below the effects of each state on new connections and existing connections:

| **Admin State** | **New Connections** | **Existing Connections** |
|-------------|-----------------|----------------------|
| **UP**         | Load balancer ignores the health probe and always considers the backend instance as eligible for new connections. | |
| **DOWN**       | Load balancer ignores the health probe and doesn't allow new connections to the backend instance. | Load balancer ignores the health probe and existing connections are determined according to the following protocols: </br>TCP: Established TCP connections to the backend instance persists.</br>UDP: Existing UDP flows move to another healthy instance in the backend pool.</br> **Note**: This is similar to a [Probe Down behavior](load-balancer-custom-probe-overview.md#probe-down-behavior).   |
| **NONE**       | Load balancer respects the health probe behavior. | Load balancer respects the health probe behavior. |

> [!NOTE]
> Load Balancer Health Probe Status metrics reflects your configured admin state value changes.

## Design considerations

When deploying a load balancer with admin state, consider the following design considerations:

| **Design Consideration** | **Description** |
|----------------------|-------------|
| **Admin state on a per backend pool instance basis** | Admin state applies on a per backend pool instance basis. In a scenario where a virtual machine instance is in more than one backend pool, the admin state setting on one backend pool doesn't affect the other backend pool. |
| **Health probe configuration** | Admin state only takes effect when there's a health probe configured on the Load Balancer rules. |
| **Inbound NAT rule** | Admin state isn't supported with inbound NAT rule. |

## Limitations

When deploying a load balancer with admin state, consider the following limitations:

- Admin state is not supported with inbound NAT rule. 
- Admin state is not supported for non-probed load balancing rules.
- Admin state cannot be set as part of the NIC-based Load Balancer backend pool Create experiences. 


## Next steps

> [!div class="nextstepaction"]
> [Manage Administrative State in Azure Load Balancer](manage-admin-state-how-to.md)

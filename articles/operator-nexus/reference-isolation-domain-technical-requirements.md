---
title: Technical requirements for Azure Operator Nexus Isolation Domains
description: Overview of technical requirements for Operator Nexus Isolation Domains.
author: joemarshallmsft
ms.author: joemarshall
ms.reviewer: jdasari
ms.date: 01/31/2024
ms.service: azure-operator-nexus
ms.topic: reference
---

# Technical requirements for an Isolation Domain

-   To create an isolation domain, the network fabric must be provisioned first.

-   The isolation domain is the parent resource of any internal or external networks. Therefore, the isolation domain must be created before any networks.

-   In each internal network, the first eight IP addresses from the subnet are reserved. For example, if the subnet is  10.10.10.0/24, then the IP addresses from  10.10.10.0 to 10.10.10.7 are reserved.

-   For IPv4, the maximum length allowed for a BGP listen range is /28, and the maximum length allowed for a static route prefix is /24. For IPv6, the maximum length allowed for a BGP listen range is /127, and the maximum length allowed for a static route prefix is /64.


- Azure Operator Nexus supports:
    -   3500 Layer 2 isolation domains per Operator Nexus instance
    -   200 Layer 3 isolation domains per Operator Nexus instance


## Configuration parameters for the Isolation Domain Resource

When you create an isolation domain resource, the following information must be specified:

-   **Resource group**: The name of the resource group where you want to create the isolation domain. A resource group is a logical container that holds related resources for an Azure solution.

-   **Resource name**: The name of the isolation domain resource. It must be unique within the resource group.

-   **Location**: The Azure region where you want to create the isolation domain. It must match the location of the network fabric resource on which you're deploying the isolation domain.

-   **Network fabric ID**: The resource ID of the network fabric that you want to use for the isolation domain. A network fabric is a managed network service that provides layer 2 and layer 3 connectivity for your workloads.

-   **VLAN ID**: The VLAN ID that you want to use for the isolation domain. It must be a valid VLAN ID between 501 and 3000. It must also be unique within the network fabric resource.

-   **MTU**: The maximum transmission unit for the isolation domain. The default value is 1500.

-   **Administrative state**: Whether the isolation domain is enabled or disabled. You can change the state using the update-admin-state command.

-   **Subscription ID**: The Azure subscription ID for your Operator Nexus instance. It should be the same as the one used for the network fabric resource.

The status of the isolation domain creation or deletion can be monitored using the **Provisioning state**. It can be Succeeded, Failed, or InProgress.

## BGP configuration

| **Name** | **Description** | **Example** | **Required** |
|--|--|--|--|
| allowAS | Allows for routes to be received and processed even if the router detects its own ASN in the AS-Path. Possible values are 0-10. To disable the feature, select 0. The default is 2. | 2 | |
| allowASOverride | Enable Or Disable state. | Enable | |
| annotation | Switch configuration description. | string | |
| bfdConfiguration | BFD configuration properties. | Refer to the BFD Configuration table |  |
| defaultRouteOriginate | Originate a defaultRoute. Ex: \"True\" \| \"False\". | True |  |
| fabricASN | ASN of the Network Fabric. | 65048 |  |
| ipv4ListenRangePrefixes | List of BGP IPv4 Listen Range prefixes. | 10.1.0.0/26 | yes  |
| ipv4NeighborAddress | List of IPv4 neighbor addresses. | 10.1.1.4  |  |
| ipv6ListenRangePrefixes | List of BGP IPv6 Listen Ranges prefixes. | 2fff::/66  |  |
| ipv6NeighborAddress | List of IPv6 neighbor addresses. | 2fff:: |  |
| peerASN  | ASN of workload. | 65047  | yes  |

## Bfd configuration

| **Parameter** | **Description** | **Example** | **Required**|
|--|--|--|--|
| administrativeState | Administrative state of the BfdConfiguration. | Disabled | |	
| intervalInMilliSeconds | Interval in milliseconds. | 300 | Yes | 
| multiplier | Multiplier for the Bfd | 5 | Yes | 

## Static configuration

| **Name** | **Description** | **Example** | **Required** |
|--|--|--|--|
| ipv4Routes | List of IPv4 Routes defining prefix and next hop. |                      |              |
| Ipv6Routes   | List of IPv6 Routes defining prefix and next hop. |                      |              |
| nextHop      | List of next hop addresses.                      | 10.20.0.0, 10.20.0.2 | Yes.          |
| prefix       | Prefix of the route.                             | 10.20.0.1/19         | Yes.          |

## Isolation Domain administrative state

Isolation domains have an administrative state that helps operators o manage them. The table below provide information on the available actions, and how they affect the isolation domain.

| **Name** | **Type** | **Description** |
|--|--|--|
| Disabled | string | Resource is disabled.                      |
| Enabled  | string | Resource is enabled.                       |
| MAT      | string | Manual action taken by operator.           |
| RMA      | string | State of resource for planned maintenance. |

## Additional configuration for internal networks

-   **vlan-id**: The VLAN identifier value for the internal network. It must be between 501 and 3000.

-   **resource-group**: The name of the resource group where the internal network is created.

-   **l3-isolation-domain-name**: The name of the L3 isolation-domain the internal network belongs to.

-   **resource-name**: The name of the internal network.

-   **location**: The Azure region where the internal network is created.

-   **connected-ipv4-subnets** or **connected-ipv6-subnets**: The IPv4 or IPv6 subnet prefixes used by the workloads in the internal network.

-   **mtu**: The maximum transmission unit for the internal network. The default value is 1500.

-   **bgp-configuration**: The BGP configuration table for the internal network.

-   **static-route-configuration**: Static route configuration for the internal network. It includes the IPv4 or IPv6 route prefixes and next hops, the extension flag, and the BFD configuration.

-   **is-monitoring-enabled**: A flag to enable or disable monitoring on the internal network. The default value is False.

-   **extension**: The extension flag for the internal network. It can be NoExtension or NPB.

### Additional configuration for external networks

-   **peering-option**: The peering option for the external network. It can be OptionA or OptionB.

-   **option-a-properties**: The properties for the OptionA peering, including the peer ASN, the VLAN ID, the MTU, and the primary and secondary IPv4 or IPv6 prefixes. This parameter is required for OptionA.

-   **option-b-properties**: The properties for the OptionB peering, including the route targets for import and export of IPv4 or IPv6 routes. This parameter is required for OptionB.

-   **resource-group**: The name of the resource group where the external network is created.

-   **l3domain**: The name of the L3 isolation-domain the external network belongs to.

-   **resource-name**: The name of the external network.

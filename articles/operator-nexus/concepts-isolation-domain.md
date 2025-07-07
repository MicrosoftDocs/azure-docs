---
title: Azure Operator Nexus Isolation Domains
description: Overview of Isolation Domains for Azure Operator Nexus.
author: scottsteinbrueck
ms.author: ssteinbrueck
ms.reviewer: jdasari
ms.date: 01/29/2024
ms.service: azure-operator-nexus
ms.topic: conceptual
---

# Isolation Domain Overview

An Isolation Domain resource enables the creation of layer-2 and layer-3 networks that your network functions can connect to. This enables inter-rack and intra-rack communication between the network functions. The Operator Nexus Network Fabric (NNF) Service enables three types of isolation domain:

-   **Layer-2 isolation domain** - provides layer-2 networking capabilities within and across the racks for workloads running on servers. Workloads can take advantage of the isolated layer-2 network to establish direct connectivity among themselves at layer 2 and above.

- **L2 isolation domain with extended VLAN Support (L2VRF)** - Nexus provides a way to extend Layer 2 (L2) connectivity from the Customer Edge (CE) router to the Provider Edge (PE) router. This is particularly useful workloads that require Layer 2 reachability outside nexus instance  

-   **Layer-3 isolation domain with Internal Networks** - provides workloads the ability to connect across a layer 3 (IP) network.

-   **Layer-3 isolation domain with External Network** - provides workloads the ability to connect across a layer 3 network, and provides connectivity to the operator's network outside of the Operator Nexus Network Fabric.

An isolation domain offers:

-   Unified network capabilities with full integration with your compute resources, enabling connectivity between your Operator Nexus platform workloads.

-   Northbound connectivity with customer routers using BGP peering sessions between the Operator Nexus Network Fabric and the operator's external network.

-   Southbound connectivity with telco workloads using internal networks.

-   API driven unified layer 2 and layer 3 configuration for North-South and East-West traffic.

- Full isolation between isolation domains - packets from one domain aren't sent to workloads in another isolation domain on the same Operator Nexus Network Fabric. Services in one domain are invisible to services in another.

- The ability to create flexible network topologies by adding or removing workloads to an isolation domain as needed.

## Layer 2 Isolation Domains

A layer 2 isolation domain provides L2 networking capabilities between workloads within across racks. Workloads can use the isolated layer-2 network to establish direct connectivity among themselves.

The NNF enables operators to provision and manage layer 2 isolation domains below resource level. Each layer-2 isolation domain has an associated VLAN ID. If a workload needs connectivity to multiple VLANs, multiple layer-2 isolation domains must be created. A separate NIC resource is required for each layer-2 domain that the workload connects to.

L2 isolation domain with extended VLAN Support (L2VRF) 

The L2VRF feature in Nexus enhances the flexibility and scalability of network configurations, making it easier to manage complex enterprise use cases. 

- **Extended VLAN Support:** The Layer 2 Isolation Domain (ISD) ARM resource now supports a new read-write property called extendedVlan, which defaults to false. When this property is set, the CEs are configured to trunk through the VLAN ID of the L2 ISD to the PE.

- **Dynamic Configuration:** The extendedVlan property can be dynamically toggled, and changes apply at the point of the next Fabric commit.
    
- **Traffic Agnosticism:** Nexus is agnostic to the traffic running over this network and does not run any hosts or services on it. Address management, security, and services (DNS, DHCP, NTP, etc.) are user responsibilities.

## Layer 3 Isolation Domains

A layer 3 isolation domain provides workloads with the ability to exchange layer-3 routing information through the Operator Nexus Network Fabric and with external networks.

Layer-3 isolation domains can provide two types of network:

-   **Internal Network** - a Layer 3 Isolation Domain Internal Network enables east-west layer 3 communication between workloads on the Operator Nexus Network Fabric. An internal network is a complete solution for layer-3 inter and intra-rack communication for compute workloads. Each workload can connect to multiple internal networks.

-   **External Network** - a Layer 3 Isolation Domain External Network enables workloads to communicate with external services via the operator network. An external network creates a communication channel between Operator Nexus workloads and services hosted outside of the Operator Nexus Network Fabric. Each Layer 3 isolation domain supports one external network.
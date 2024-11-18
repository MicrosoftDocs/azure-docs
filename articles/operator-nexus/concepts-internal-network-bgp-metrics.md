---
title: Azure Operator Nexus Network Fabric internal network BGP metrics
description: Overview of internal network BGP metrics.
author: sushantjrao
ms.author: sushrao
ms.reviewer: sushrao
ms.date: 04/29/2024
ms.service: azure-operator-nexus
ms.topic: conceptual
---

# Azure Operator Nexus Network Fabric internal network BGP metrics

Border Gateway Protocol (BGP) Neighbor Monitoring is a critical aspect of network management, ensuring the stability and reliability of communication between routers within internal networks. This concept document aims to provide an overview of BGP Neighbor Monitoring, its significance, and the key metrics involved.

## Established transitions

One key metric in BGP Neighbor Monitoring is Established Transitions, which tracks the connectivity status between the network fabric and its adjacent routers. This metric indicates the stability of neighbor relationships and the efficiency of communication channels.

   :::image type="content" source="media/bgp-transitions.png" alt-text="Screenshot of BGP Transitions Diagram.":::

### Monitored BGP Messages

BGP routers engage in the exchange of several messages to establish, maintain, and troubleshoot network connections. Understanding these messages is essential for network administrators to ensure the stability and efficiency of their networks.

   a.  **Sent Notification:**

   When a router encounters an issue, such as the withdrawal of a route or an unsupported capability, it sends a Notification message to its neighbor. These messages serve as alerts, indicating potential disruptions in network connectivity.

   b. **Received Notification:**

   Conversely, routers also receive Notification messages from their neighbors. Analyzing these messages is crucial for identifying and addressing issues on the neighbor's side that may impact network performance.

   c. **Sent Update:**

   To communicate routing information, a router sends Update messages to its neighbors. These messages contain details about the prefixes it can reach and their associated attributes. By broadcasting this information, routers inform their neighbors about reachable network destinations.

   d. **Received Update:**

   Routers also receive Update messages from their neighbors, containing information about advertised prefixes and their attributes. Monitoring these messages allows administrators to detect any inconsistencies or unexpected changes in routing information, which could signify network issues or misconfigurations.

## BGP Prefix Monitoring

In the realm of BGP (Border Gateway Protocol), monitoring prefixes within a BGP neighbor context is essential. It involves tracking the exchange of prefix information, which is crucial for early issue detection, preventing outages or connectivity disruptions, and troubleshooting network connectivity problems. BGP AFI (Address Family Identifier) and SAFI (Subsequent Address Family Identifier) prefixes play a vital role in routing and ensuring network reachability across diverse network environments.

### Monitored BGP prefixes

a. **AFI-SAFI prefixes installed:**

   These prefixes are learned from a neighbor and installed in the router's routing table. Monitoring these prefixes ensures the routing table is up-to-date and accurate, including IPv4/IPv6 prefixes, paths, and next hops.

   :::image type="content" source="media/afi-safi-prefixes-installed.png" alt-text="Screenshot of installed AFI-SAFI Prefixes.":::

b. **AFI-SAFI prefixes received:**

   These prefixes are advertised by a neighbor in its update messages. Monitoring them helps detect inconsistencies between advertised and installed prefixes in the routing table.

   :::image type="content" source="media/afi-safi-prefixes-received.png" alt-text="Screenshot of received AFI-SAFI Prefixes.":::

c. **AFI-SAFI Prefixes Sent:**

   These prefixes are the ones that a router communicates to its neighbor in its update messages. Monitoring these prefixes provides insight into the network destinations that the router actively announces to other nodes in the network. Understanding these announcements is essential for comprehending the router's routing decisions and its impact on network reachability.

:::image type="content" source="media/afi-safi-prefixes-sent.png" alt-text="Screenshot of sent AFI-SAFI Prefixes.":::

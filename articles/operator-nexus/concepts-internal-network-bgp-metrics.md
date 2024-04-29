---
title: Azure Operator Nexus Network Fabric Internal Network BGP Metrics
description: Overview of Internal Network BGP Metrics.
author: sushantjrao
ms.author: sushrao
ms.reviewer: sushrao
ms.date: 04/29/2024
ms.service: azure-operator-nexus
ms.topic: conceptual
---

# Azure Operator Nexus Network Fabric Internal Network BGP Metrics

## Understanding BGP Neighbor Monitoring

Border Gateway Protocol (BGP) Neighbor Monitoring is a critical aspect of network management, ensuring the stability and reliability of communication between routers within internal networks. This concept document aims to provide an overview of BGP Neighbor Monitoring, its significance, and the key metrics involved.

**Key Concepts:**

1. **BGP Neighbor Communication:**
   - BGP routers exchange various messages to establish and maintain communication, update routing information, and signal errors. Understanding these communication dynamics is crucial for effective BGP Neighbor Monitoring.

2. **Importance of BGP Neighbor Monitoring:**
   - BGP Neighbor Monitoring involves diligently observing and analyzing the communication between the network fabric and its adjacent routers. This proactive approach helps identify potential disruptions and ensures uninterrupted network connectivity.

3. **Monitored BGP Messages:**
   - BGP routers exchange several types of messages, including Sent Notification, Received Notification, Sent Update, and Received Update. These messages are crucial for establishing, maintaining, and troubleshooting BGP communication channels.

4. **Established Transitions:**
   - One key metric in BGP Neighbor Monitoring is Established Transitions, which tracks the connectivity status between the network fabric and its adjacent routers. This metric indicates the stability of neighbor relationships and the efficiency of communication channels.

5. **BGP Prefix Monitoring:**
   - Monitoring prefixes within a BGP neighbor context focuses on the exchange of prefix information and is key for early detection of issues, preventing outages, or connectivity disruptions. AFI-SAFI Prefixes Installed, Received, and Sent are essential metrics in BGP Prefix Monitoring.

6. **AFI-SAFI Prefixes Installed:**
   - These prefixes are learned from a neighbor and installed in the router's routing table. Monitoring these prefixes ensures the routing table is up-to-date and accurate, including IPv4/IPv6 prefixes, paths, and next hops.

7. **AFI-SAFI Prefixes Received:**
   - These prefixes are advertised by a neighbor in its update messages. Monitoring them helps detect inconsistencies between advertised and installed prefixes in the routing table.

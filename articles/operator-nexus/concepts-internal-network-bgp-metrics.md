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

# Azure Operator Nexus Network Fabric internal network BGP metrics

Border Gateway Protocol (BGP) Neighbor Monitoring is a critical aspect of network management, ensuring the stability and reliability of communication between routers within internal networks. This concept document aims to provide an overview of BGP Neighbor Monitoring, its significance, and the key metrics involved.

## Key concepts:

* **BGP neighbor communication:**
   - BGP routers exchange various messages to establish and maintain communication, update routing information, and signal errors. Understanding these communication dynamics is crucial for effective BGP Neighbor Monitoring.

* **Importance of BGP neighbor monitoring:**
   - BGP Neighbor Monitoring involves diligently observing and analyzing the communication between the network fabric and its adjacent routers. This proactive approach helps identify potential disruptions and ensures uninterrupted network connectivity.

* **Monitored BGP messages:**
   - BGP routers exchange several types of messages, including Sent Notification, Received Notification, Sent Update, and Received Update. These messages are crucial for establishing, maintaining, and troubleshooting BGP communication channels.

* **Established transitions:**
   - One key metric in BGP Neighbor Monitoring is Established Transitions, which tracks the connectivity status between the network fabric and its adjacent routers. This metric indicates the stability of neighbor relationships and the efficiency of communication channels.

* **BGP prefix monitoring:**
   - Monitoring prefixes within a BGP neighbor context focuses on the exchange of prefix information and is key for early detection of issues, preventing outages, or connectivity disruptions. AFI-SAFI Prefixes Installed, Received, and Sent are essential metrics in BGP Prefix Monitoring.

* **AFI-SAFI prefixes installed:**
   - These prefixes are learned from a neighbor and installed in the router's routing table. Monitoring these prefixes ensures the routing table is up-to-date and accurate, including IPv4/IPv6 prefixes, paths, and next hops.

* **AFI-SAFI prefixes received:**
   - These prefixes are advertised by a neighbor in its update messages. Monitoring them helps detect inconsistencies between advertised and installed prefixes in the routing table.

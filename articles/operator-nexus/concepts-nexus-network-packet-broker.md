---
title: "Azure Operator Nexus Network Packet Broker Overview"
description: Overview of Network Packet Broker for Azure Operator Nexus.
author: scottsteinbrueck
ms.author: ssteinbrueck
ms.service: azure-operator-nexus
ms.topic: conceptual
ms.date: 02/16/2024
ms.custom: template-concept
---

# Network Packet Broker Overview

The **Network Packet Broker (NPB)** enables operators to monitor service traffic by tapping the network and sending copies of selected packets to probe applications (vProbes) for deep visibility, planning, and troubleshooting. NPB provides advanced, programmable **filtering** and **forwarding** based on user‑defined rules.  

## Key benefits

- **Network traffic visibility:** Provides network traffic visibility to monitoring tools, enabling operators to analyze traffic flows for operational purposes.

- **Traffic filtering and forwarding:** Reduces the volume of traffic sent to monitoring tools by forwarding only the relevant packets based on defined rules.

- **Operational troubleshooting:** Supports network troubleshooting by capturing packet-level data and sending it to monitoring tools for analysis.

- **Performance monitoring:** Helps operators understand network traffic patterns and optimize network configurations based on observed flows.

## Key capabilities

- **Mirroring and aggregation:** Mirrors network traffic from one or more network interfaces and aggregates it to designated monitoring tools.

- **Filtering and forwarding:** Applies match conditions to network traffic (e.g., based on Layer 3/4 parameters) and forwards the selected packets to defined destinations (neighbor groups).

- **Packet manipulation:** Supports optional actions like packet slicing, if required by monitoring tools, to reduce unnecessary data volume.

## Resources

To use NPB, you need to create and manage the following resources:

-   **Network TAP Rule**: A network TAP rule consists of one or more matching configurations, and each configuration defines a set of match conditions and actions. Match conditions are evaluated as logical “AND” tuples, meaning a packet must satisfy all conditions within a configuration to be considered a match. Once a packet matches a configuration, the corresponding actions are executed. This structure allows precise control over which packets are captured and how they are processed or forwarded.

Network TAP rule can be created inline or via a file:

Inline: Enter values directly using Azure CLI, Resource Manager, or the portal.

File-based: Upload a file containing the network TAP rule from a storage URL. The file can be updated periodically using a pull or push mechanism.

-   **Neighbor Group**: A neighbor group defines the set of destinations to which filtered or mirrored traffic from a network TAP is forwarded.

Neighbor groups allow operators to logically group multiple endpoints, simplifying configuration and ensuring that traffic is sent only to the intended recipients.

When a network TAP references a neighbor group, all traffic that matches the associated TAP rule is forwarded to every destination in that group.

-   **Network TAP**: Network TAP: A network TAP is a resource that captures traffic from a specified source network interface and forwards it according to an associated TAP rule and neighbor group.

The network TAP references a TAP rule (which defines match conditions and actions) and a neighbor group (which specifies destinations for forwarded traffic).

Operators can create a network TAP using Azure CLI, Resource Manager, or the portal. Once created, the TAP can be enabled or disabled to start or stop the traffic forwarding process.

This structure provides a clear separation between traffic capture (network TAP), filtering logic (TAP rule), and forwarding destinations (neighbor group), allowing precise and flexible traffic management.


## Next steps
[How to configure Network Packet Broker](./howto-configure-network-packet-broker.md)
[Deep Dive: Network TAP Rules](./concepts-nexus-network-tap-rules.md)
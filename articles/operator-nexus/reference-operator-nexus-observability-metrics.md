---
title: Azure Operator Nexus Observability Metrics
description: Observability metrics in Azure Operator Nexus
ms.topic: article
ms.date: 02/27/2024
author: joemarshallmsft
ms.author: joemarshall
ms.service: azure-operator-nexus
---

# Azure Operator Nexus Observability Metrics

In Operator Nexus Network Fabric (NNF), Ethernet monitoring is a critical component in maintaining optimal network performance, ensuring availability, and proactively addressing potential issues before they cause disruptions in the fabric. Monitoring includes traffic analysis, device health, security, and details specific to individual Ethernet interfaces. By closely monitoring the fabric infrastructure, we can ensure that NNF operates smoothly and efficiently, and that any potential problems are identified and addressed early on.

The following aspects of NNF devices are monitored:

-   **Availability:** Monitoring the connectivity of devices ensures that the network is available and prevents downtime

-   **Performance**: Tracking metrics such as interface bandwidth utilization, packet loss, latency, and jitter, lets us evaluate network performance and pinpoint any bottlenecks

-   **Security**: Monitoring helps to identify any suspicious activity, unauthorized access attempts, or potential security threats on the network

-   **Health**: Monitoring device CPU, memory, temperature, fan, power supply status, and interface operational status, lets us identify any potential failures

## ACL state counters

State counters for Access Control Lists (ACLs) in a network device help you oversee and control network traffic. They offer data on the number of packets that matched to each ACL entry. These counters can be examined on a global scale, or per interface, and by incoming and outgoing traffic.


| Metrics Category | Description/Usage | Collection interval | Measure unit  |
|--|--|--|--|
| ACL (Access List) Matched Packets | The total count of network packets that match the criteria set by the current Access Control List (ACL) entry in a network device. This count helps in monitoring and managing network traffic. | 5 min               | Number of packets. |

## BGP status

Border Gateway Protocol (BGP) connections are essential to effective communication between BGP peers, and optimal network performance. Network administrators can detect network problems or disruptions by observing these states. For example, a connection remaining in the 'Idle' state could suggest a configuration problem. The 'Established' state, which indicates a successful routing information exchange between BGP peers, is essential for the network to function correctly.

| Metrics Category | Description/Usage | Collection interval  | Measured unit |
|--|--|--|--|
| BGP Peer Status  | The BGP peer status, as defined by [RFC 4271](https://datatracker.ietf.org/doc/html/rfc4271), and summarized after this table. | 5 mins and on demand | N/A |

The BGP connection states are:

- **Idle (1):** The initial state of a BGP connection.
- **Connect (2):** The system is waiting for the TCP connection to be completed.
- **Active (3):** The system is trying to initiate a TCP connection with the peer.
- **OpenSent (4):** The system is waiting to receive an OPEN message from the peer.
- **OpenConfirm (5):** The system is waiting for a KEEPALIVE or NOTIFICATION message from the peer.
- **Established (6):** The BGP connection is fully established and the peers can exchange UPDATE messages.

## Component operational state

The operational state of a hardware or software component shows its current functioning state.

| Metrics Category | Description/Usage | Collection interval | Measured unit |
|--|--|--|--|
| Component Operation Status | Operational Status of the entities that can be part of the device's inventory, such as line cards, transceivers, fans, power supplies, etc. The possible values are described after this table. | 5 mins and on demand | N/A  |

The possible operational states are:

- **Active (0):** The component is enabled and active (up)
- **Inactive (1):** The component is enabled but inactive (down)
- **Disabled (2):** The component is administratively disabled


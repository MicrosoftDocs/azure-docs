---
title: Azure Operator Nexus observability metrics
description: Observability metrics in Azure Operator Nexus
ms.topic: article
ms.date: 02/27/2024
author: joemarshallmsft
ms.author: joemarshall
ms.service: azure-operator-nexus
---

# Azure Operator Nexus observability metrics

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

## Interface operational state

The operational state of an interface in a network device shows its current functioning state.

| Metrics Category | Description/Usage | Collection interval | Measured unit |
|--|--|--|--|
| Interface Operational State | The operational state of the interface. The possible values are described after this table. | 5 mins | N/A |

The possible operational states are:

- **Up (0):** The interface is operational and able to transmit and receive data
- **Down (1):** The interface isn't operational, and is unable to transmit or receive data
- **Lower_layer_down (2):** The interface is down due to a failure in a lower layer of the network stack
- **Testing (3):** The interface is undergoing testing and isn't yet operational
- **Unknown (4):** The status of the interface is unknown, possibly due to a failure in the device's monitoring system
- **Dormant (5):** The interface is operational but is currently in a dormant state, meaning it isn't transmitting or receiving data
- **Not_present (6):** The interface isn't present in the device, possibly because it has been physically removed or it hasn't been installed yet


## Interface state counters

Interface state counters track the number of frames or packets matching certain conditions. All of them are collected at 5-minute intervals.

| Metrics Category | Description/Usage |
|--|--|
| Ethernet Interface In CRC Errors | The total count of received frames with lengths between 64 and 1,518 octets that have either an FCS Error or an Alignment Error. These errors indicate issues in data transmission that need to be addressed for reliable communication.   |
| Ethernet Interface In Fragment Frames | This is a gauge that quantifies the count of error-ridden fragment frames received via an ethernet interface. A fragment frame, which is shorter than the Ethernet protocol's stipulated length, possesses either an incorrect checksum value, known as an FCS Error, or an improper bit count, referred to as an Alignment Error. |
| Ethernet Interface In Jabber Frames | The count of jabber frames received via the interface. Jabber frames are frames that exceed the standard size and also possess an erroneous Cyclic Redundancy Check (CRC). |
| Ethernet Interface In MAC Control Frames | Control frames at the MAC layer received on the interface. |
| Ethernet Interface In MAC Pause Frames | PAUSE frames at the MAC layer received via the interface. |
| Ethernet Interface In Maxsize Exceeded  | The total count of well-structured frames that were dropped on the interface due to surpassing the maximum frame size. |
| Ethernet Interface In Oversize Frames | The total count of well-structured frames received that exceeded 1,518 octets in length (not counting framing bits, but inclusive of FCS octets). |
| Ethernet Interface Out MAC Control Frames | Control frames at the MAC layer sent on the interface   |
| Ethernet Interface Out MAC Pause Frames   | PAUSE frames at the MAC layer sent via the interface. |
| Interface In Broadcasts packets    | The total number of packets addressed to a broadcast address at this sublayer, including those packets that were discarded or not sent. |
| Interface In Discards                    | The number of inbound packets that were discarded even though no errors were detected to prevent their being deliverable to a higher-layer protocol. |
| Interface In Errors                       | For packet-oriented interfaces, the number of inbound packets that contained errors preventing them from being deliverable to a higher-layer protocol. |
| Interface In FCS Errors                   | Number of received packets that had errors in the frame check sequence (FCS). |
| Interface In Multicast Packets            | The number of packets delivered by this sublayer to a higher layer or sublayer that were addressed to a multicast address at this sublayer. For a MAC-layer protocol, these addresses include both Group and Functional addresses. |
| Interface In Octets  | The total number of octets received on the interface, including framing characters. |
| Interface In Packets                      | The total number of packets received on the interface, including all unicast, multicast, broadcast, and bad packets. |
| Interface In Unicasts Packets             | The number of packets delivered by this sublayer to a higher layer or sublayer that weren't addressed to a multicast or broadcast address at this sublayer. |
| Interface Out Broadcast Packets           | The total number of packets that were addressed to a broadcast address at this sublayer, including packets that were discarded or not sent. |
| Interface Out Discards                    | The number of outbound packets that were discarded even though no errors were detected to prevent their being transmitted. |
| Interface Out Errors                      | For packet-oriented interfaces, the number of outbound packets that couldn't be transmitted because of errors. |
| Interface Out Multicast Packets           | The total number of outgoing packets that were addressed to a multicast address at this sublayer, including packets that were discarded or not sent. For a MAC-layer protocol, these addresses include both Group and Functional addresses. |
| Interface Out Octets                      | The total number of octets transmitted out of the interface, including framing characters. |
| Interface Out Packets                     | The total number of packets transmitted out of the interface, including all unicast, multicast, broadcast, and bad packets. |
| Interface Out Unicasts Packets            | The total number of outgoing packets that weren't addressed to a multicast or broadcast address at this sublayer, including packets that were discarded or not sent. |

## Interface state rate

The interface state rate can have effects on network performance and dependability. A high frequency of state alterations could signal an unstable network connection, potentially resulting in diminished performance and network congestion.

All of the state rate measurements are collected at 5-minute intervals.

| Metrics Category            | Description/Usage |
|--|--|
| Interface In Discards Rate  | The rate at which incoming packets are being discarded on a network interface. Packets can be discarded for various reasons such as network congestion, faulty hardware, or configuration issues. |
| Interface In Packets Rate | The rate of packets received on the interface, including all unicasts, multicasts, broadcasts, and bad packets. |
| Interface Out Discards Rate | The rate of outbound packets that were discarded even though no errors were detected to prevent them being transmitted. |
| Interface Out Packets Rate | The rate of packets transmitted out of the interface, including all unicasts, multicasts, broadcasts, and bad packets. |


## LACP state rate

Monitoring the LACP state rate is vital due to its potential effects on network performance and dependability. The term "LACP state rate" in the context of Link Aggregation Control Protocol denotes the pace at which LACP control packets are transmitted or received by an interface that supports LACP.

All of the state rate measurements are collected at 5-minute intervals.

| Metrics Category    | Description/Usage |
|--|--|
| Lacp Errors         | The term "Number of LACPDU illegal packet errors" signifies the tally of Link Aggregation Control Protocol Data Units (LACPDUs) that, despite being received, are deemed unlawful due to their incorrectly formed structure or an unauthorized value of Protocol Subtype. |
| Lacp In Packets     | Number of LACPDUs received. |
| Lacp Out Packets    | Number of LACPDUs transmitted. |
| Lacp RX errors      | Number of LACPDUs errors received. |
| Lacp TX errors      | Number of LACPDUs errors transmitted. |
| Lacp unknown Errors | Number of LACPDUs unknown errors. |

## LLDP state counters

LLDP state counters show how many LLDP frames have been sent and received by a network device. LLDP stands for Link Layer Discovery Protocol, which is a standard protocol that allows devices to advertise their identity, capabilities, and neighbors on a local area network. LLDP state counters can help network administrators monitor the health and performance of the network, troubleshoot connectivity issues, and discover the topology and configuration of the devices.

All of the measurements are collected at 5-minute intervals.

| Metrics Category | Description/Usage |
|--|--|
| Lldp Frame in        | LLDPFrameIn in a network device refers to the number of Link Layer Discovery Protocol (LLDP) frames that the device received. |
| Lldp Frame out       | LLDPFrameOut in a network device refers to the number of Link Layer Discovery Protocol (LLDP) frames that the device sent. LLDP is used by network devices to advertise their identity and capabilities to other devices on the same network. |
| Lldp TLV unknown     | LLDPTLVUnknown in a network device refers to the number of Link Layer Discovery Protocol (LLDP) frames received that contain unknown Type-Length-Value (TLV) entries. TLVs are used in network protocols to specify optional information. An "unknown" TLV suggests the device received data that it doesn't recognize or can't interpret, which could indicate compatibility issues within the network. |


## Network fabric device resource utilization

Resource utilization metrics provide critical insights into how efficiently network resources are being used. These metrics provide insights into the performance and health of a network fabric device. The resource utilization metrics provide a holistic view of a system's performance and health. They measure CPU workload, cooling efficiency, memory availability, power performance, and heat levels. These metrics are essential for optimizing system performance, managing resources effectively, and preventing hardware damage due to excessive heat.


| Metrics Category | Description/Usage | Collection Interval | Measured Unit |
|--|--|--|--|
| CPU Utilization Avg | The CPU Utilization Average Metric is the mean percentage of computing resources used by a processor over a specific time interval. | 1 min               | Percentage            |
| CPU Utilization Instant         | The immediate percentage of computing resources being used by a processor at a specific time. It provides real-time insight into the CPU's workload and performance.                                                                                                                                               | 1 min               | Percentage            |
| CPU Utilization Max             | The highest percentage of computing resources used by a processor over a specific time interval.                                                                                                                                                                                                                                                  | 1 min               | Percentage            |
| CPU Utilization Min             | The lowest percentage of computing resources used by a processor over a given time interval.                                                                                                                                                                                                                                                      | 1 min               | Percentage            |
| Fan Speed                       | The immediate rate at which the cooling fan is spinning. It's a crucial metric for maintaining optimal operating temperature and ensuring the longevity of the device's components.                                                                                                                                          | 1 min               | Rpm (not Available)   |
| Memory Available                | The available memory physically installed, or logically allocated to the component.                                                                                                                                                                                                                                                                                             | 1 min               | Bytes                 |
| Power Supply Input Current      | The amount of electrical current, measured in amps, that the power supply unit (PSU) draws from the source. It's a crucial factor in determining the PSU's efficiency and the overall power consumption of the device.                                                                                                                 | 1 min               | Amps (not Available)  |
| Power supply Input Voltage      | The amount of electrical potential, measured in volts, that the power supply unit (PSU) draws from the source. It's a key parameter in ensuring the PSU can adequately convert AC power to DC power for the device's needs.                                                                                                            | 1 min               | Volts (Not Available) |
| Power Supply Max Power Capacity | Maximum power capacity of the power supply.                                                                                                                                                                                                                                                                                                                                      | 1 min               | Watts (Not Available) |
| Power Supply Output current     | The output current supplied by the power supply.                                                                                                                                                                                                                                                                                                                                 | 1 min               | Amps (Not available)  |
| Power Supply Output Voltage     | The output voltage supplied by the power supply.                                                                                                                                                                                                                                                                                                                                 | 1 min               | Volts (not available) |
| Power Supply Output Power       | The amount of electrical power, measured in watts, that the power supply unit (PSU) delivers to the device's components. It's a critical factor in ensuring the device has sufficient power for optimal performance.                                                                                                | 1 min               |                       |
| Temperature Instantaneous       | The real-time temperature of the device's components.                                                                                                                                                                                                                                                                   | 1 min               |                       |
| Temperature Max                 | The highest safe operating temperature for the device's components. Exceeding this limit can lead to overheating, which might cause performance issues, component damage, or even lead to device failure. It's crucial to monitor and manage the device's temperature to ensure its longevity and optimal performance. | 1 min               |                       |

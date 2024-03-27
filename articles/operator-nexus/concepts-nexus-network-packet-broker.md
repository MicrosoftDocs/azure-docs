---
title: "Azure Operator Nexus Network Packet Broker Overview"
description: Overview of Network Packet Broker for Azure Operator Nexus.
author: joemarshallmsft
ms.author: joemarshall
ms.service: azure-operator-nexus
ms.topic: conceptual
ms.date: 02/16/2024
ms.custom: template-concept
---

# Network Packet Broker Overview

The Network Packet Broker (NPB) allows operators to monitor service traffic flows by tapping into the network and sending copies of the network packets to special probe applications. These applications provide the operations team with network-level visibility to help with service planning and troubleshooting.

NPB enables packet filtering and forwarding based on user-defined rules. NPB can perform various actions on the matched packets, such as dropping, counting, redirecting, mirroring, and logging. NPB supports both static and dynamic match conditions, which can be based on various L2/L3 parameters, such as VLAN, IP, port, protocol, or encapsulation type. NPB also supports GTPv1 encapsulation for matching packets in mobile networks.

## Key benefits of the Network Packet Broker

-   **Improved Network Visibility:** NPB provides a centralized management interface for configuring and controlling the flow of network traffic to monitoring tools (vProbes). It provides visibility into network traffic, allowing operators to monitor, analyze, troubleshoot, and identify potential security threats. 

-   **Improved Network Troubleshooting:** NPB facilitates network troubleshooting by capturing and presenting packet-level data for analysis. Operators can use an NPB to inspect packets in detail and identify the source of the problem quickly. 

-   **Network Performance Optimization:** NPB provides insights into network traffic patterns and performance metrics, helping to identify network bottlenecks and congestion points, and to design better networks.

-   **Filtering and Packet Manipulation:** NPB can filter out irrelevant or redundant traffic, reducing the volume of data sent to monitoring tools. It can also manipulate packets, enabling actions like packet slicing and timestamping, which further enhance the efficiency of monitoring and analysis. 

-   **Compliance and Regulatory Requirements:** NPB helps organizations meet compliance and regulatory requirements by ensuring proper monitoring of network activities and data traffic. 

## Key capabilities of the Network Packet Broker

-   **Mirroring & Aggregation**

    -   Mirroring network traffic from multiple distributed applications in the Azure Operator Network (AON) instance. 

    -   Processing the entire network traffic of the AON instance. 

    -   Providing designated endpoint definitions via scalable resource models. 

-   **Filtering & Forwarding**

    -   Advanced matching and filtering capabilities based on L3 parameters. 

    -   On demand changes to filtering and forwarding criteria.

    -   Secure and scalable forwarding of filtered traffic to designated external and internal networks and devices.  

## Resources

To use NPB, you need to create and manage the following resources:

-   **Network TAP Rule**: A set of matching configurations and actions that define the packet brokering logic. You can create a network TAP rule either inline or via a file. The inline method allows you to enter the values using AzCli, Resource Manager, or the portal. The file-based method allows you to upload a file that contains the network TAP rule content from a storage URL. The file can be updated periodically using a pull or push mechanism.

-   **Neighbor Group**: A logical grouping of destinations where you want to send the network traffic. A neighbor group can include network interfaces, load balancers, or network virtual appliances.

-   **Network TAP**: A resource that references the network TAP rule and the neighbor group that you created. A network TAP also specifies the source network interface from which the traffic is captured. You can create a network TAP using AzCli, Resource Manager, or the portal. You can also enable or disable a network TAP to start or stop the packet brokering process.


## Using an NPB

This section describes the steps you need to follow to use an NPB.

First, create the prerequisite resources:

-   A bootstrapped Network Fabric Instance.

-   A Layer 3 isolation domain and an internal network with the NPB extension flag set (only required if the isolation domain is being used to reach vProbes).

Then follow these steps:

1.   Create a network TAP rule that defines the match configuration for the network traffic that you want to capture and forward. You can use the `az networkfabric taprule` command to create, update, delete, or show a network TAP rule.

1.  Create a neighbor group that defines the destinations for the network traffic that you want to send to. You can use the `az networkfabric neighborgroup` command to create, update, delete, or show a neighbor group.

1.  Create a network TAP that references the network TAP rule and the neighbor group that you created. A network TAP also specifies the source network interface from which the traffic is captured. You can use the `az networkfabric tap` command to create, update, delete, or show a network TAP.

1. Enable the network TAP to start the packet brokering process. You can use the `az networkfabric tap update-admin-state` command to enable or disable a network TAP.
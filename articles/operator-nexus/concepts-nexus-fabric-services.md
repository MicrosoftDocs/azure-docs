---
title: Azure Operator Nexus Network Fabric Services
description: Overview of Network Fabric Services for Azure Operator Nexus.
author: lnyswonger
ms.author: lnyswonger
ms.reviewer: jdasari
ms.date: 12/21/2023
ms.service: azure-operator-nexus
ms.topic: conceptual
---

# Network Fabric Services overview
The Network Fabric Controller (NFC) serves as the host for Nexus Network Fabric (NNF) services, illustrated in the diagram below. These services enable secure internet access for on-premises applications and services. Communication between on-premises applications and NNF services is facilitated through a specialized Express Route service (VPN). This setup allows on-premises services to connect to the NNF services via Express Route at one end, and access internet-based services at the other end.

:::image type="content" source="media/network-fabric-controller-architecture.png" alt-text="A flowchart for creating a Network Fabric Controller in Azure, detailing the progression from user request to the associated Azure resources.":::


## Enhanced Security with Nexus Network Fabric Proxy Management
The Nexus Network Fabric employs a robust, cloud-native proxy designed to protect the Nexus infrastructure and its associated workloads. This proxy is primarily focused on preventing data exfiltration attacks and maintaining a controlled allow-list of URLs for NNF instance connections. In combination with the under-cloud proxy, the NNF proxy delivers comprehensive security for workload networks. There are two distinct aspects of this system: the Infrastructure Management Proxy, which handles all infrastructure traffic, and the Workload Management Proxy, dedicated to facilitating communication between workloads and public or Azure endpoints.

## Optimized Time Synchronization with Managed Network Time Protocol (NTP)
The Network Time Protocol (NTP) is an essential network protocol that aligns the time settings of computer systems over packet-switched networks. In the Azure Operator Nexus instance, NTP is instrumental in ensuring the consistent time settings across all compute nodes and network devices. This level of synchronization is critical for the Network Functions (NFs) operating within the infrastructure. It significantly contributes to the effectiveness of telemetry and security measures, maintaining the integrity and coordination of the system.

## Nexus Network Fabric Resources
Content TBD.

### InternetGateways
InternetGateways is a critical element in network architecture, acting as the connecting bridge between a virtual network and the Internet. It enables virtual machines and other entities within a virtual network to communicate seamlessly with external services. These services range from websites and APIs to various cloud services, making InternetGateways a versatile and essential component.

#### Key Properties of InternetGateways

| Property         | Description                                                                                          |
|------------------|------------------------------------------------------------------------------------------------------|
| Name             | Serves as the unique identifier for the Internet Gateway.                                            |
| Location         | Specifies the Azure region where the Internet Gateway is deployed, ensuring regional compliance and optimization. |
| Subnets          | Defines the subnets linked with the Internet Gateway, determining the network segments it services. |
| Public IP Address| Assigns a public IP address to the gateway, enabling external network interactions.                  |
| Routes           | Outlines the routing rules and configurations for managing traffic through the gateway.             |


#### Practical Use Cases

* **Internet Access:** Facilitates Internet connectivity for virtual network resources, crucial for updates, downloads, and accessing external services.
* **Hybrid Connectivity:** Ideal for hybrid scenarios, allowing secure connections between on-premises networks and Azure resources.
* **Load Balancing:** Enhances network performance and availability by evenly distributing traffic across multiple gateways.
* **Security Enforcement:** Enables the implementation of robust security policies, such as outbound traffic restrictions and encryption mandates.
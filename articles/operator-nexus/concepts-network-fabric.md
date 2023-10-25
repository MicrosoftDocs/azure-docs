---
title: "Azure Operator Nexus: Network Fabric"
description: Overview of Network Fabric resources for Azure Operator Nexus.
author: surajmb
ms.author: surmb
ms.service: azure-operator-nexus
ms.topic: conceptual
ms.date: 07/10/2023
ms.custom: template-concept
---

# Azure Operator Nexus - Network Fabric
Azure Operator Nexus offers various capabilities to manage the lifecycle and configuration of the networking required to run the Operator's infrastructure and workloads. 

Operator Nexus enables you to:

* Single pane of glass to manage your on-premises networking devices and their configuration.
* Create infrastructure and workload networks which are isolated.
* Configure route policies to import and export specific routes to and from your existing infrastructure network.
* Monitor and audit device performance, health, and configuration changes and take action against them via metrics, logs, and alerts.
* Set access policies to govern who can manage the network.
* Manage the lifecycle of the network devices.
* Tap or mirror desired network data with Network Packet Broker.
* Get highly available and robust control plane for your network infrastructure.

:::image type="content" source="media/networking-concepts-1.png" alt-text="Screenshot of Resource Types.":::

Key capabilities offered in Azure Operator Nexus Network Fabric:

* **Bootstrapping and lifecycle management** - Automated bootstrapping & provisioning of network fabric resources based on network function use-cases. It provides various controls to manage network devices in operator premises via Azure APIs.

* **Tenant network configuration** - Automated network configuration in Network Fabric for Container Network Functions (CNFs) and Virtual Network Functions (VNFs) that are deployed on the compute nodes. The network configuration enables east-west communication between network functions as well as north-south communication between external networks and VNFs/CNFs. 

* **Observability** - Monitor the health and performance of the network fabric in real-time with metrics and logs.

* **Network Policy Automation** - Automating the management of consistent network policies across the fabric to ensure security, performance, and access controls are enforced uniformly.

* **Networking features built for Operators** - Support for unique features like multicast, SCTP, and jumbo frames.

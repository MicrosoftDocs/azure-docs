---
title: Azure Operator Nexus Fabric SKUs
description: SKU options for Azure Operator Nexus Network Fabric
ms.topic: article
ms.date: 04/18/2024
author: sushantjrao
ms.author: sushrao
ms.service: azure-operator-nexus
---

# Azure Operator Nexus Fabric SKUs

Operator Nexus Fabric SKUs for Azure Operator Nexus are meticulously designed to streamline the procurement and deployment processes, offering standardized bill of materials (BOM), topologies, wiring, and workflows. Microsoft crafts and prevalidates each SKU in collaboration with OEM vendors, ensuring seamless integration and optimal performance for operators.

Operator Nexus Fabric SKUs offer a comprehensive range of options, allowing operators to tailor their deployments according to their specific requirements. With prevalidated configurations and standardized BOMs, the procurement and deployment processes are streamlined, ensuring efficiency and performance across the board.

The following table outlines the various configurations of Operator Nexus Fabric SKUs, catering to different use-cases and functionalities required by operators.

| S.No | Use-Case              | Network Fabric SKU ID | Description                                                                                                                        | BOM Components                                                                                                                                                            |
|------|-----------------------|-----------------------|------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1    | Multi Rack Near-Edge  | M4-A400-A100-C16-ab   | - Support 400-Gbps link between Nexus fabric CEs and Provider Edge PEs.<br> - Support up to four compute rack deployment and aggregator rack.<br> - Each compute rack can have racks of up to 16 compute servers.<br> - One Network Packet Broker. | - Pair of Customer Edge Devices required for SKU.<br> - Pair of Top the rack switches per rack deployed.<br> - One Management switch per compute rack deployed.<br> - Network packet broker device.<br> - Terminal Server.<br> - Cable and optics. |
| 2    | Multi Rack Near-Edge  | M8-A400-A100-C16-ab   | - Support 400-Gbps link between Nexus fabric CEs and Provider Edge PEs.<br> - Supports up to eight compute rack deployment and aggregator rack.<br> - Each compute rack can have racks of up to 16 compute servers.<br> - For deployments with 1 to 4 compute racks, one Network Packet Broker is required. <br> - For deployments with 5 to 8 compute racks, two Network Packet Brokers are needed. | - Pair of Customer Edge Devices required for SKU.<br> - Pair of Top the rack switches per rack deployed. <br> - One Management switch per compute rack deployed.<br> - Network packet broker device(s).<br> - Terminal Server.<br> - Cable and optics. |
| 3    | Multi Rack Near-Edge  | M8-A100-A25-C16-aa    | - Support 100-Gbps link between Nexus fabric CEs and Provider Edge PEs.<br>Supports up to eight compute rack deployment and aggregator rack.<br> - Each compute rack can have racks of up to 16 compute servers.<br> - For deployments with 1 to 4 compute racks, one Network Packet Broker is required. <br> - For deployments with 5 to 8 compute racks, two Network Packet Brokers are needed. | - Pair of Customer Edge Devices required for SKU.<br> - Pair of Top the rack switches per rack deployed.<br> - One Management switch per compute rack deployed.<br> - Network packet broker device(s).<br> - Terminal Server.<br> - Cable and optics |
| 4    | Single Rack Near-Edge | S-A100-A25-C12-aa     | - Supports 100-Gbps link between Nexus fabric CEs and PEs<br>Single rack with shared aggregator and compute rack<br> - Each compute rack can have racks of up to 12 compute servers<br>One Network Packet Broker.  | - Pair of Customer Edge Devices required for SKU.<br> - Pair of Management switches.<br> - Network packet broker device.<br> - Terminal Server.<br> - Cable and optics |

**Notes:**

- Bill of materials (BOM) adheres to nexus network fabric specifications.
- All subscribed customers have the privilege to request BOM details.

---
title: Azure Operator Nexus SKUs
description: SKU options for Azure Operator Nexus
ms.topic: article
ms.date: 10/31/2024
author: matternst7258
ms.author: matthewernst
ms.service: azure-operator-nexus
---

# Azure Operator Nexus SKUs

Operator Nexus SKUs for Azure Operator Nexus are meticulously designed to streamline the procurement and deployment processes, offering standardized bill of materials (BOM), topologies, wiring, and workflows. Microsoft crafts and pre-validates each SKU in collaboration with OEM vendors, ensuring seamless integration and optimal performance for operators.

Operator Nexus offer a comprehensive range of options, allowing operators to tailor their deployments according to their specific requirements. With pre-validated configurations and standardized BOMs, the procurement and deployment processes are streamlined, ensuring efficiency and performance across the board.

## Fabric SKUs

The following table outlines the various configurations of Operator Nexus Fabric SKUs, catering to different use-cases and functionalities required by operators.

| S.No | Use-Case              | Network Fabric SKU ID | Description                                                                                                                        | BOM Components                                                                                                                                                            |
|------|-----------------------|-----------------------|------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1    | Multi Rack Near-Edge  | M4-A400-A100-C16-ab   | - Support 400-Gbps link between Nexus fabric CEs and Provider Edge PEs.<br> - Support up to four compute rack deployment and aggregator rack.<br> - Each compute rack can have racks of up to 16 compute servers.<br> - One Network Packet Broker. | - Pair of Customer Edge Devices required for SKU.<br> - Pair of Top the rack switches per rack deployed.<br> - One Management switch per compute rack deployed.<br> - Network packet broker device.<br> - Terminal Server.<br> - Cable and optics. |
| 2    | Multi Rack Near-Edge  | M8-A400-A100-C16-ab   | - Support 400-Gbps link between Nexus fabric CEs and Provider Edge PEs.<br> - Supports up to eight compute rack deployment and aggregator rack.<br> - Each compute rack can have racks of up to 16 compute servers.<br> - For deployments with 1 to 4 compute racks, one Network Packet Broker is required. <br> - For deployments with 5 to 8 compute racks, two Network Packet Brokers are needed. | - Pair of Customer Edge Devices required for SKU.<br> - Pair of Top the rack switches per rack deployed. <br> - One Management switch per compute rack deployed.<br> - Network packet broker device(s).<br> - Terminal Server.<br> - Cable and optics. |
| 3    | Multi Rack Near-Edge  | M8-A400-A100-C16-ac    | - Support 400-Gbps link between Nexus Fabric CEs and Provider Edge PEs.<br>Support up to Eight Compute Rack deployment and Aggregator Rack.<br> - Each Compute rack can have Compute Servers up to 16.<br> - Two Network Packet brokers maximum. In case if deployment opted No.of Compute Racks are less than or equal to "Four" then one NPB is required and Nexus programs only one NPB. <br> - Single Pure Storage | - Pair of Customer Edge Devices required for SKU.<br> - Pair of Top the rack switches per rack deployed.<br> - One Management switch per compute rack deployed.<br> - Network packet broker device(s).<br> - Terminal Server.<br> - Cable and optics |
| 4    | Multi Rack Near-Edge  | M8-A100-A25-C16-aa    | - Support 100-Gbps link between Nexus fabric CEs and Provider Edge PEs.<br>Supports up to eight compute rack deployment and aggregator rack.<br> - Each compute rack can have racks of up to 16 compute servers.<br> - For deployments with 1 to 4 compute racks, one Network Packet Broker is required. <br> - For deployments with 5 to 8 compute racks, two Network Packet Brokers are needed. | - Pair of Customer Edge Devices required for SKU.<br> - Pair of Top the rack switches per rack deployed.<br> - One Management switch per compute rack deployed.<br> - Network packet broker device(s).<br> - Terminal Server.<br> - Cable and optics |
| 5    | Single Rack Near-Edge | S-A100-A25-C12-aa     | - Supports 100-Gbps link between Nexus fabric CEs and PEs<br>Single rack with shared aggregator and compute rack<br> - Each compute rack can have racks of up to 12 compute servers<br>One Network Packet Broker.  | - Pair of Customer Edge Devices required for SKU.<br> - Pair of Management switches.<br> - Network packet broker device.<br> - Terminal Server.<br> - Cable and optics |

## Compute SKUs

The following table outlines the various configurations of Operator Nexus Network Cloud SKUs, catering to different use-cases and functionalities required by operators.

| Version | Use-Case                        | Network Cloud SKU ID                    | Description                                                                                                                                                       |
|---------|---------------------------------|-----------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1.7.3   | Multi Rack Near-Edge Aggregator | VNearEdge1_Aggregator_x70r3_9           | Aggregation Rack with Pure x70r3                                                                                                                                  |
| 1.7.3   | Multi Rack Near-Edge Compute    | VNearEdge1_Compute_DellR750_4C2M        | 400G Fabric support up to eight Compute Racks where each rack can support four compute servers.                                                                   |
| 1.7.3   | Multi Rack Near-Edge Compute    | VNearEdge1_Compute_DellR750_8C2M        | 400G Fabric support up to eight Compute Racks where each rack can support eight compute servers.                                                                  |
| 1.7.3   | Multi Rack Near-Edge Compute    | VNearEdge1_Compute_DellR750_12C2M       | 400G Fabric support up to eight Compute Racks where each rack can support 12 compute servers.                                                                 |
| 1.7.3   | Multi Rack Near-Edge Compute    | VNearEdge1_Compute_DellR750_16C2M       | 400G Fabric support up to eight Compute Racks where each rack can support 16 compute servers.                                                                |
| 1.7.3   | Multi Rack Near-Edge Compute    | VNearEdge2_Compute_DellR650_4C2M        | 100G Fabric support up to eight Compute Racks where each rack can support four compute servers.                                                                   |
| 1.7.3   | Multi Rack Near-Edge Compute    | VNearEdge2_Compute_DellR650_8C2M        | 100G Fabric support up to eight Compute Racks where each rack can support eight compute servers.                                                                  |
| 1.7.3   | Multi Rack Near-Edge Compute    | VNearEdge2_Compute_DellR650_12C2M       | 100G Fabric support up to eight Compute Racks where each rack can support 12 compute servers.                                                                 |
| 1.7.3   | Multi Rack Near-Edge Compute    | VNearEdge2_Compute_DellR650_16C2M       | 100G Fabric support up to eight Compute Racks where each rack can support 16 compute servers.                                                                |
| 1.7.3   | Multi Rack Near-Edge Compute    | VNearEdge3_Compute_DellR750_7C3M        | 400G Fabric support up to eight Compute Racks where each rack can support seven Dell750 computes, one Dell750 high-iops controller, and two Dell650 controllers   |
| 1.7.3   | Multi Rack Near-Edge Compute    | VNearEVNearEdge3_Compute_DellR750_11C3M | 400G Fabric support up to eight Compute Racks where each rack can support 11 Dell750 computes, one Dell750 high-iops controller, and two Dell650 controllers  |
| 1.7.3   | Multi Rack Near-Edge Compute    | VNearEdge3_Compute_DellR750_15C3M       | 400G Fabric support up to eight Compute Racks where each rack can support 15 Dell750 computes, one Dell750 high-iops controller, and two Dell650 controllers |
| 2.0.0   | Multi Rack Near-Edge Aggregator | VNearEdge4_Aggregator_x70r4             | Aggregation Rack with Pure x70r4.                                                                                                                                 |
| 2.0.0   | Multi Rack Near-Edge Aggregator | VNearEdge4_Aggregator_x70r3             | Aggregation Rack with Pure x70r3.                                                                                                                                 |
| 2.0.0   | Multi Rack Near-Edge Aggregator | VNearEdge4_Aggregator_x20r4             | Aggregation Rack with Pure x70r4.                                                                                                                                 |
| 2.0.0   | Multi Rack Near-Edge Aggregator | VNearEdge4_Aggregator_x20r3             | Aggregation Rack with Pure x70r3.                                                                                                                                 |
| 2.0.0   | Multi Rack Near-Edge Compute    | VNearEdge4_Compute_DellR760_4C2M        | 400G Fabric support up to eight Compute Racks where each rack can support four compute servers.                                                                   |
| 2.0.0   | Multi Rack Near-Edge Compute    | VNearEdge4_Compute_DellR760_8C2M        | 400G Fabric support up to eight Compute Racks where each rack can support eight compute servers.                                                                  |
| 2.0.0   | Multi Rack Near-Edge Compute    | VNearEdge4_Compute_DellR760_12C2M       | 400G Fabric support up to eight Compute Racks where each rack can support 12 compute servers.                                                                 |
| 2.0.0   | Multi Rack Near-Edge Compute    | VNearEdge4_Compute_DellR760_16C2M       | 400G Fabric support up to eight Compute Racks where each rack can support 16 compute servers.                                                                |
| 2.0.0   | Multi Rack Near-Edge Compute    | VNearEdge4_Compute_DellR760_7C3M        | 400G Fabric support up to eight Compute Racks where each rack can support seven Dell750 computes, 1 Dell750 high-iops controller, and 2 Dell650 controllers       |
| 2.0.0   | Multi Rack Near-Edge Compute    | VNearEVNearEdge4_Compute_DellR760_11C3M | 400G Fabric support up to eight Compute Racks where each rack can support 11 Dell750 computes, one Dell750 high-iops controller, and two Dell650 controllers  |
| 2.0.0   | Multi Rack Near-Edge Compute    | VNearEdge4_Compute_DellR760_15C3M       | 400G Fabric support up to eight Compute Racks where each rack can support 15 Dell750 computes, one Dell750 high-iops controller, and two Dell650 controllers |


**Notes:**

- Bill of materials (BOM) adheres to nexus network fabric specifications.
- All subscribed customers have the privilege to request BOM details.

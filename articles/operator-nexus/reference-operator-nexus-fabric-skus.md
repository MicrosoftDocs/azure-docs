---
title: Azure Operator Nexus Fabric SKUs
description: SKU options for Azure Operator Nexus Network Fabric
ms.topic: article
ms.date: 02/26/2024
author: joemarshallmsft
ms.author: joemarshall
ms.service: azure-operator-nexus
---

# Azure Operator Nexus Fabric SKUs

Operator Nexus Fabric SKUs for Azure Operator Nexus are meticulously designed to streamline the procurement and deployment processes, offering standardized bill of materials (BOM), topologies, wiring, and workflows. Microsoft meticulously crafts and prevalidates each SKU in collaboration with OEM vendors, ensuring seamless integration and optimal performance for operators.

## Overview

The following table outlines the various configurations of Operator Nexus Fabric SKUs, catering to different use-cases and functionalities required by operators.

| **S.No** | **Use-Case** | **Network Fabric SKU ID** | **Description** | **BOM Components** |
|--|--|--|--|--|
| 1        | Multi Rack Near-Edge | M4-A400-A100-C16-ab       | <ul><li>Support 400-Gbps link between Operator Nexus fabric CEs and Provider Edge PEs</li><li>Support up to four compute rack deployment and aggregator rack</li><li>Each compute rack can have rack up to 16 compute servers</li><li>One Network Packet Broker</li></ul> | <ul><li>Pair of Customer Edge Devices required for SKU</li><li>Pair of Top the rack switches per rack deployed</li><li>Pair of Management switches per rack deployed</li><li>Network packet broker device </li><li>Terminal Server </li><li>Cable and optics</li></ul> |
| 2        | Multi Rack Near-Edge  | M8-A400-A100-C16-ab       |  <ul><li>Support 400-Gbps link between Operator Nexus fabric CEs and Provider Edge PEs </li><li>Support up to eight compute rack deployment and aggregator rack </li><li>Each compute rack can have up to 16 compute servers </li><li>One Network Packet Broker for deployment size between one and four compute racks. Two network packet brokers with deployment size of five to eight compute racks </li></ul> | <ul><li>Pair of Customer Edge Devices required for SKU </li><li>Pair of Top the rack switches per rack deployed  </li><li>Pair of Management switches per rack deployed  </li><li> One or more network packet broker devices </li><li>Terminal Server </li><li>Cable and optics  </li></ul>  |
| 3        | Multi Rack Near-Edge  | M8-A100-A25-C16-aa        | <ul><li>Support 100-Gbps link between Operator Nexus fabric CEs and Provider Edge PEs </li><li>Support up to eight compute rack deployment and aggregator rack </li><li>Each compute rack can have up to 16 compute servers </li><li>One Network Packet Broker for 1 to 4 rack compute rack deployment and two network packet brokers with deployment size of 5 to 8 compute racks </li></ul> | <ul><li>Pair of Customer Edge Devices required for SKU </li><li>Pair of Top the rack switches per rack deployed  </li><li>Pair of Management switches per rack deployed  </li><li>One or more Network packet broker devices </li><li>Terminal Server </li><li>Cable and optics  </li></ul> |
| 4        | Single Rack Near-Edge | S-A100-A25-C12-aa         | <ul><li>Supports 100-Gbps link between Operator Nexus fabric CEs and Provider Edge PEs </li><li>Single rack with shared aggregator and compute rack </li><li>Each compute rack can have up to 12 compute servers </li><li>One Network Packet Broker  </li></ul> | <ul><li>Pair of Customer Edge Devices required for SKU </li><li>Pair of Top the rack switches  </li><li>Pair of Management switches </li><li>Network packet broker device </li><li>Terminal Server </li><li>Cable and optics  </li></ul>  |

## Conclusion

Operator Nexus Fabric SKUs offer a comprehensive range of options, allowing operators to tailor their deployments according to their specific requirements. With prevalidated configurations and standardized BOMs, the procurement and deployment processes are streamlined, ensuring efficiency and performance across the board.
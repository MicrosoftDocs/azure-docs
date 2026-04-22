---
title: Azure IoT Operations networking
description: Learn about Azure IoT Operations networking
author: sethmanheim
ms.subservice: layered-network-management
ms.author: sethm
ms.topic: concept-article
ms.custom:
  - ignite-2023
ms.date: 03/24/2026

#CustomerIntent: As an operator, I want understand how to use Azure IoT Operations networking to secure my devices.
ms.service: azure-iot-operations
---

# Azure IoT Operations networking

Networking is a foundational aspect of deploying and managing distributed systems, especially in hybrid and multicloud environments. In Azure IoT Operations, secure networking enables reliable connectivity between on-premises resources, edge devices, and Azure services. Proper network configuration is essential for communication, security, and scalability of IoT Operations and Kubernetes clusters. This article describes key networking options for IoT Operations.

## Choose your networking approach

Before deploying, determine which networking approach fits your scenario:

- **Private connectivity:** If you have a single cluster that needs private connectivity to Azure without network segmentation between layers, use this approach. You can use Private Link for storage and data flow destinations, Arc Gateway to reduce firewall endpoints, and Azure Firewall Explicit Proxy to keep all traffic on private networks. See [Deploy Azure IoT Operations with private connectivity](howto-private-connectivity.md).
- **Layered network:** If you have a Purdue/ISA-95 segmented topology with multiple network layers (L2/L3/L4) and adjacent-only communication, use a layered network deployment. This approach adds Envoy proxy chaining, CoreDNS at each layer, and multi-cluster Azure IoT Operations deployments across layers. **If you have a layered topology, this is the recommended approach.** See [Layered networking for Azure IoT Operations](concept-layered-network.md) for architecture details, or go straight to the [Tutorial: Deploy Azure IoT Operations in a layered network with private connectivity](../end-to-end-tutorials/tutorial-layered-network-private-connectivity.md).

## Network connectivity options

Azure IoT Operations can use the following Azure services to simplify and secure network connectivity between your on-premises environment and Azure.

### Azure Arc gateway

The Azure Arc gateway acts as a network proxy that lets you simplify network configuration requirements by reducing the number of Azure endpoints to allow through your firewall. By routing traffic through the gateway, you can simplify firewall rules and reduce the need for complex network changes. This approach is especially useful for securely connecting isolated or segmented environments to Azure Arc and Azure IoT Operations.

For more information, see [Simplify network configuration requirements with Azure Arc gateway](/azure/azure-arc/kubernetes/arc-gateway-simplify-networking).

### Azure Firewall Explicit Proxy

Azure Firewall Explicit Proxy allows you to direct Azure Arc and IoT Operations traffic through a managed firewall, providing enhanced security and monitoring. This is useful for organizations that require all outbound traffic to be inspected or logged, and helps meet compliance requirements by controlling and auditing network flows to Azure.

For more information, see [Access Azure services over Azure Firewall Explicit Proxy (Public Preview)](/azure/azure-arc/azure-firewall-explicit-proxy).
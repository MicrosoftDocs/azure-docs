---
title: Virtual Network Routing Appliance Overview
titleSuffix: Azure Virtual Network
description: Learn about virtual network routing appliance, a high-performance routing solution designed for low latency, high throughput, and seamless Azure-native management.
#customer intent: As a network administrator, I want to understand what a virtual network routing appliance is so that I can determine its use cases for my organization.
author: asudbring
ms.author: allensu
ms.reviewer: allensu
ms.date: 02/04/2026
ms.topic: concept-article
ms.service: azure-virtual-network
---

# Virtual network routing appliance overview

Azure Virtual Network routing appliance is a high-performance solution that provides a managed, scalable forwarding layer for your virtual networks. Unlike traditional hub-and-spoke architectures that rely on virtual machines for routing, virtual network routing appliance runs on specialized networking hardware to deliver low latency and high throughput for your traffic flows.

As a top-level Azure resource, virtual network routing appliance integrates with Azure's management model, so you can deploy, configure, and govern it using familiar Azure tools and processes. You deploy the appliance in a dedicated subnet within your virtual network, where it acts as a high-bandwidth forwarding layer for routed traffic.

Virtual network routing appliance is ideal for organizations that need to:

- Scale routing capacity horizontally to meet growing bandwidth demands
- Reduce latency for east-west traffic flows
- Eliminate routing bottlenecks in hub-and-spoke network topologies
- Maintain Azure-native management and governance

> [!IMPORTANT]
> Azure Virtual Network routing appliance is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.


Virtual network routing appliance is an Azure-managed network routing device that you deploy inside your virtual network. It acts as a high-bandwidth forwarding layer for routed traffic flows, so you don't need to run your own virtual machines as the forwarding layer.

:::image type="content" source="media/virtual-network-routing-appliance-overview/virtual-network-appliance-diagram.png" alt-text="Diagram showing Virtual network routing appliance architecture in Azure.":::

Key characteristics:  

- Azure resource model: You create and manage virtual network routing appliance as an Azure resource, similar to other networking resources.  
- Dedicated subnet: You host the appliance in a dedicated subnet named "VirtualNetworkApplianceSubnet."  
- In the data path: The appliance forwards traffic (data path).

## Benefits

### High throughput and low latency forwarding layer

Many hub and spoke designs rely on a centralized forwarder that can become a bottleneck. Virtual network routing appliance is a lightweight, high-performance forwarding layer that reduces the risk of the forwarding layer becoming the choke point for traffic flows.

### Purpose-built for horizontal scaling and accelerated east–west flows

Virtual network routing appliance is purpose-built for horizontal scaling, accelerated east–west flows, high throughput, and low latency to meet massive bandwidth demands.

### Azure-native management model

Because Virtual network routing appliance is a top-level Azure resource, you can manage and govern it like other Azure networking resources.

## High Availability and Load Balancing Guidance
Virtual network routing appliance provides built‑in high availability and is availability zone resilient by default. It also offers high bandwidth without requiring an additional load balancer in front of it.
As such, you do not need to place a load balancer in front of the appliance. If you do so, the load balancer will not forward traffic to the appliance.

## Preview region availability

During the public preview, virtual network routing appliance is available in a limited set of Azure regions. The current public preview regions include:  
- East US  
- East US 2  
- West Central US  
- West US  
- North Europe  
- UK South  
- West Europe  
- East Asia

## Limitations (public preview)

- This preview is intended for testing, evaluation, and feedback purposes. Don't use the preview for production workloads.

- Each subscription can have up to two virtual network routing appliance instances.

- During preview, each virtual network appliance supports up to 200 Gbps of configurable bandwidth.

- Select regions offer the preview: West US, East US, East Asia, North Europe, West Europe, East US 2, West Central US, and UK South.

- Traffic routed through a virtual network routing appliance can't reach destinations exposed via Azure Private Link/Private Link Service.

- Global and cross-region Private Endpoint and peering aren't supported.

- IPv4 is supported. IPv6 isn't in scope for this public preview.

- During preview, the virtual network appliance instance doesn't provide metrics or logs.

- The preview is free. Advance notice is provided before billing is enabled.

- During preview, client tools such as Azure CLI, PowerShell, and Terraform aren't supported.

## How to request support and provide feedback

### Support during public preview

During the public preview phase, the product group provides support services for the preview. To request support, fill out [this form](https://forms.office.com/r/pvamBMUx25).

### Provide feedback

To provide feedback, fill out [this form](https://forms.office.com/r/pvamBMUx25).

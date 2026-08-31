---
title: What is Azure Multicloud Interconnect Preview?
description: Learn how Azure Multicloud Interconnect Preview provides private, high-throughput connectivity between Azure and a supported cloud service provider.
author: duongau
ms.author: duau
ms.service: azure
ms.custom: references_regions
ms.topic: overview
ms.date: 08/25/2026
---

# What is Azure Multicloud Interconnect Preview?

Azure Multicloud Interconnect is a managed service that provides private connectivity between Azure and supported cloud service providers. It gives workloads that span more than one cloud a dedicated path that doesn't traverse the public internet.

> [!IMPORTANT]
> Azure Multicloud Interconnect is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

During preview, Azure Multicloud Interconnect supports connectivity to Amazon Web Services (AWS). For current provider, region, and bandwidth support, see [Availability and limits](availability-limits.md).

:::image type="complex" source="./media/overview/multicloud-interconnect-architecture.svg" alt-text="Diagram that shows redundant links between partner edge routers and Microsoft enterprise edge routers into Azure workloads." lightbox="./media/overview/multicloud-interconnect-architecture.svg":::
   On the left, a box labeled Customer partner environment represents the cloud service provider. To its right are four boxes labeled Partners Edge, arranged in two dashed groups of two. In the center, a box labeled Azure Multicloud Interconnect contains two dashed groups. The first group pairs Link 1 with Microsoft Enterprise Edge 1, and Link 2 with Microsoft Enterprise Edge 2. The second group pairs Link 3 with Microsoft Enterprise Edge 3, and Link 4 with Microsoft Enterprise Edge 4. Each partner edge router connects across to a Microsoft enterprise edge router over one of the four links. On the right, a box labeled Azure workloads shows the Azure logo above the label Enterprise Core, high-bandwidth edge routers, and receives connections from all four Microsoft enterprise edge routers.
:::image-end:::

## Preview scope

The initial preview includes:

- Connectivity between Azure and AWS
- 1-Gbps bandwidth
- Managed resilient connectivity
- No Azure Multicloud Interconnect service charge during preview
- No Azure egress charge during preview

## Key benefits

### Private cloud-to-cloud connectivity

Traffic between Azure and the connected cloud provider travels over private connectivity instead of the public internet.

### Simplified provisioning

You provision connectivity by creating an Azure Multicloud Interconnect resource and exchanging an activation key with the provider. You don't coordinate provider circuits, physical or virtual routers, cross-connects, virtual LANs, point-to-point addressing, or Border Gateway Protocol (BGP) peering sessions.

### Managed resiliency

A single interconnect is backed by redundant infrastructure across physically separate locations and designed for high availability.

### Link encryption

MAC Security (MACsec) is enabled by default on the physical links between Azure and the supported cloud provider.

## How Azure Multicloud Interconnect works

Azure Multicloud Interconnect is provisioned on prebuilt connectivity infrastructure managed by Azure and the participating cloud provider.

Azure and the participating cloud provider coordinate:

- Connectivity provisioning
- Path diversity
- Physical-link health monitoring and failure recovery

Azure Multicloud Interconnect is represented in Azure as a resource you create in your subscription. That resource is paired with a matching connection in the provider's cloud. The two sides are joined by an activation key, which confirms that both ends belong to the same customer and configuration.

Azure ExpressRoute is the underlying connectivity technology, but the resource you create and manage is an Azure Multicloud Interconnect resource rather than a traditional ExpressRoute circuit. After the service is provisioned, you can connect Azure virtual networks (VNets) through an ExpressRoute gateway and connect workloads running in supported cloud-provider virtual networks, such as AWS Virtual Private Clouds (VPCs), through the multicloud connection.

After the pairing completes, traffic flows between your Azure virtual network and your workloads in the provider's cloud over the managed connection.

## How you set up an interconnect

Setting up an interconnect moves through four stages, from creating the underlying circuit to running workloads across both clouds:

1. **ExpressRoute circuit.** Create an ExpressRoute circuit and select the Azure Multicloud Interconnect port type.
1. **Interconnect resource.** Create the Azure Multicloud Interconnect resource that provides the private cloud-to-cloud connection.
1. **Provider setup.** Generate or redeem an activation key and select a supported cloud service provider. During preview, that provider is Amazon Web Services (AWS).
1. **Connected workloads.** Connect your virtual networks so that applications, data, and AI workloads can communicate across both clouds.

For the full procedure, see [Create an Azure Multicloud Interconnect Preview resource](create-interconnect.md) or [Redeem an Azure Multicloud Interconnect Preview activation key](redeem-activation-key.md).

:::image type="complex" source="./media/overview/multicloud-interconnect-provisioning-flow.svg" alt-text="Diagram that shows the four stages of setting up Azure Multicloud Interconnect, from creating a circuit to connecting workloads." lightbox="./media/overview/multicloud-interconnect-provisioning-flow.svg":::
   The diagram shows four numbered stages from left to right, each connected to the next by an arrow. Stage 1, ExpressRoute, is to create an ExpressRoute circuit and select the Azure Multicloud Interconnect port type. Stage 2, Azure Multicloud Interconnect, provides private cloud-to-cloud connectivity. Stage 3, Provider setup, is to generate or redeem an activation key and select a supported partner cloud. Stage 4, Connected workloads, provides a private connection for applications, data, and AI and machine learning workloads. The Connected workloads stage shows two environments side by side, Microsoft Azure and Partner cloud, each containing apps, data, and AI or machine learning workloads. A summary row across the bottom states that the service is built on ExpressRoute, provides private and resilient connectivity, connects to supported providers, and supports applications, data, and AI.
:::image-end:::

## Activation keys

An activation key ties the Azure side of the interconnect to the cloud service provider side. It authorizes the connection by confirming that the cloud service provider, Azure region, bandwidth, and provider account all match the request before provisioning begins. During preview, the supported provider is Amazon Web Services (AWS).

One side generates the key and the other redeems it, which means you can start the process from either Azure or the provider:

- Start in Azure and generate a key to redeem with the provider. See [Create an Azure Multicloud Interconnect Preview resource](create-interconnect.md).
- Start with the provider and redeem their key in Azure. See [Redeem an Azure Multicloud Interconnect Preview activation key](redeem-activation-key.md).

If validation fails, provisioning doesn't start. Correct the mismatched details and then restart activation.

## Azure Multicloud Interconnect and ExpressRoute

Azure Multicloud Interconnect uses ExpressRoute as its connectivity foundation. While ExpressRoute provides secure private connectivity, Azure Multicloud Interconnect adds managed cloud-to-cloud connectivity, automated provisioning with supported cloud providers, and built-in resiliency management.

| Connectivity requirement | Recommended service |
|---------------|-----|
| Azure to on-premises connectivity | ExpressRoute |
| Azure to a supported cloud service provider | Azure Multicloud Interconnect |

If you need connectivity from your own datacenter into Azure, see [What is Azure ExpressRoute?](../expressroute/expressroute-introduction.md).

## Plan your deployment

Before you create an interconnect:

- Confirm the supported cloud service provider, Azure region, provider account, and available bandwidth. During preview, the supported provider is Amazon Web Services (AWS). See [Availability and limits](availability-limits.md).
- Plan non-overlapping address spaces across your Azure and provider networks.
- Define the workload prefixes and route intent that should cross the interconnect.
- Plan an ExpressRoute virtual network gateway for traffic entering Azure.

## Related content

- [Availability and limits](availability-limits.md)
- [Create an Azure Multicloud Interconnect Preview resource](create-interconnect.md)
- [Redeem an Azure Multicloud Interconnect Preview activation key](redeem-activation-key.md)
- [Azure Multicloud Interconnect Preview FAQ](faq.yml)

---
title: About Azure ExpressRoute Last Mile Preview
description: Azure ExpressRoute Last Mile Preview connects on-premises networks to Azure through providers with private, resilient connectivity. Learn how it works.
author: steveesp
ms.author: steveesp
ms.service: azure
ms.date: 11/17/2026
ms.topic: overview
---

# About Azure ExpressRoute Last Mile Preview

Azure ExpressRoute Last Mile is a networking service that enables private, resilient connectivity between your on-premises networks and Microsoft Azure through participating connectivity providers.

Built on Azure ExpressRoute, Last Mile simplifies the process of establishing private connectivity by integrating Azure and connectivity provider provisioning. The service uses redundant network infrastructure to provide reliable connectivity while reducing the complexity of deploying and managing connections to Azure.
:::image type="complex" source="./media/last-mile/last-mile-diagram.png" alt-text="Diagram of Azure Last Mile connectivity from an on-premises network through a telecommunications provider and redundant interconnections to Azure workloads." lightbox="./media/last-mile/last-mile-diagram.png":::
	An on-premises network connects to a telecommunications provider with four partner edge routers arranged in two groups. Each partner edge router connects through a separate link to a corresponding Microsoft Enterprise Edge router in Azure Last Mile Interconnect. The four Microsoft routers are also arranged in two groups and connect to Azure workloads through the enterprise core.
:::image-end:::

> [!IMPORTANT]
> Azure ExpressRoute Last Mile is currently in Preview.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability. During preview, the service is available only through supported connectivity providers, locations, and bandwidth options.

## Key benefits

Azure ExpressRoute Last Mile provides the following benefits:

- **Simplified connectivity:** Establish private connectivity between your on-premises networks and Azure without managing the underlying physical interconnections.
- **Integrated provisioning:** Provision connectivity through coordinated workflows between Azure and participating connectivity providers.
- **High resiliency:** Benefit from redundant network infrastructure distributed across physically separate interconnect locations.
- **Private connectivity:** Exchange traffic between your network and Azure over private connections that don't traverse the public internet.
- **Reduced operational complexity:** Simplify connectivity deployment and management through provider-integrated provisioning.

## How Azure ExpressRoute Last Mile works

Azure ExpressRoute Last Mile uses pre-established network infrastructure between Microsoft and participating connectivity providers to establish private connections to Azure.

The service connects your network to Azure through the participating provider's network and redundant interconnections with Microsoft Enterprise Edge (MSEE) routers.

The underlying infrastructure is designed with multiple physical connections distributed across two separate interconnect locations within a metropolitan area. This architecture provides redundancy against individual link, device, and certain site-level failures.

Microsoft and participating providers manage the underlying interconnect infrastructure, while you manage your on-premises connectivity, routing configuration, and Azure network resources.

### Connection provisioning

To establish an Azure ExpressRoute Last Mile connection:

1. **Sign in to Azure Preview portal** Sign in to the Azure Preview Portal for Last Mile at https://aka.ms/LastMilePreviewPortal.
2. **Create an ExpressRoute circuit:** Select a supported connectivity provider, peering location, and bandwidth in the Azure portal.
3. **Configure provider connectivity:** Use the participating provider's management portal to request connectivity to Azure.
4. **Associate the connection:** Provide the ExpressRoute service key to associate your provider connection with the Azure circuit.
5. **Complete provisioning:** Azure and the provider coordinate provisioning of the underlying connectivity.
6. **Connect your virtual networks:** Configure the required ExpressRoute connectivity resources and routing.

After provisioning completes, your on-premises network can communicate with Azure resources through the private ExpressRoute connection.

## Supported connectivity providers and regions

During preview, Azure ExpressRoute Last Mile supports the following configurations:

| Capability | Preview support |
|---|---|
| Connectivity provider | Lumen |
| Peering locations | Washington DC Last Mile, and Silicon Valley Last Mile |
| Bandwidth | 1 Gbps |
| Connectivity | Private connectivity through Azure ExpressRoute |
| Resiliency | Redundant interconnections across two physically separate locations |
| Provisioning | Integrated Azure and connectivity provider workflow |


> [!NOTE]
> Service availability depends on the participating connectivity provider and supported peering locations. Preview configurations are subject to change.

## Resiliency and availability

Azure ExpressRoute Last Mile is designed to provide resilient private connectivity through redundant network infrastructure.

The architecture uses multiple physical interconnections distributed across two separate locations within a metropolitan area.

This design helps maintain connectivity during individual link failures, network device failures, and certain site-level disruptions.

End-to-end availability depends on your network configuration, provider connectivity, routing policies, and Azure resources. For business-critical workloads, configure appropriate redundancy throughout your network architecture.

## Security considerations

Azure ExpressRoute Last Mile provides private connectivity between your network and Azure without traversing the public internet.

However, private connectivity doesn't automatically encrypt network traffic. Use appropriate encryption technologies and network security controls to meet your organization's security and compliance requirements.

You remain responsible for configuring network access controls, routing policies, and application security.

## Pricing

During preview, Azure ExpressRoute Last Mile doesn't have a service charge.

Standard Azure resource charges and connectivity provider charges may still apply.

Pricing for general availability will be announced separately.

## Next steps

- [Learn about Azure ExpressRoute](expressroute-introduction.md)
- [Create and modify an ExpressRoute circuit](expressroute-howto-circuit-portal-resource-manager.md)
- [Connect a virtual network to an ExpressRoute circuit](expressroute-howto-linkvnet-portal-resource-manager.md)
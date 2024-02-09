---
title: 'Azure Firewall scenarios to inspect traffic destined to a private endpoint'
titleSuffix: Azure Private Link
description: Learn about different scenarios to inspect traffic destined to a private endpoint using Azure Firewall.
author: asudbring
ms.service: private-link
ms.topic: conceptual
ms.date: 08/14/2023
ms.author: allensu
ms.custom: template-how-to, devx-track-linux
---

# Azure Firewall scenarios to inspect traffic destined to a private endpoint

> [!NOTE]
> If you want to secure traffic to private endpoints in Azure Virtual WAN using secured virtual hub, see [Secure traffic destined to private endpoints in Azure Virtual WAN](../firewall-manager/private-link-inspection-secure-virtual-hub.md).

Azure Private Endpoint is the fundamental building block for Azure Private Link. Private endpoints enable Azure resources deployed in a virtual network to communicate privately with private link resources.

Private endpoints allow resources access to the private link service deployed in a virtual network. Access to the private endpoint through virtual network peering and on-premises network connections extend the connectivity.

You may need to inspect or block traffic from clients to the services exposed via private endpoints. Complete this inspection by using [Azure Firewall](../firewall/overview.md) or a third-party network virtual appliance.

The following limitations apply:

* Network security groups (NSG) traffic is bypassed from private endpoints due to network policies being disabled for a subnet in a virtual network by default. To utilize network policies like User-Defined Routes and Network Security Groups support, network policy support must be enabled for the subnet. This setting is only applicable to private endpoints within the subnet. This setting affects all private endpoints within the subnet. For other resources in the subnet, access is controlled based on security rules in the network security group.

* User-defined routes (UDR) traffic is bypassed from private endpoints. User-defined routes can be used to override traffic destined for the private endpoint.

* A single route table can be attached to a subnet

* A route table supports up to 400 routes

Azure Firewall filters traffic using either:

* [FQDN in network rules](../firewall/fqdn-filtering-network-rules.md) for TCP and UDP protocols

* [FQDN in application rules](../firewall/features.md#application-fqdn-filtering-rules) for HTTP, HTTPS, and MSSQL. 

> [!IMPORTANT] 
> The use of application rules over network rules is recommended when inspecting traffic destined to private endpoints in order to maintain flow symmetry. If network rules are used, or an NVA is used instead of Azure Firewall, SNAT must be configured for traffic destined to private endpoints in order to maintain flow symmetry.

> [!NOTE]
> SQL FQDN filtering is supported in [proxy-mode](/azure/azure-sql/database/connectivity-architecture#connection-policy) only (port 1433). **Proxy** mode can result in more latency compared to *redirect*. If you want to continue using redirect mode, which is the default for clients connecting within Azure, you can filter access using FQDN in firewall network rules.

## Scenario 1: Hub and spoke architecture - Dedicated virtual network for private endpoints

:::image type="content" source="./media/inspect-traffic-using-azure-firewall/hub-and-spoke.png" alt-text="Dedicated Virtual Network for Private Endpoints" border="true":::

This scenario is the most expandable architecture to connect privately to multiple Azure services using private endpoints. A route pointing to the network address space where the private endpoints are deployed is created. This configuration reduces administrative overhead and prevents running into the limit of 400 routes.

Connections from a client virtual network to the Azure Firewall in a hub virtual network incurs charges if the virtual networks are peered. Connections from Azure Firewall in a hub virtual network to private endpoints in a peered virtual network aren't charged.

For more information on charges related to connections with peered virtual networks, see the FAQ section of the [pricing](https://azure.microsoft.com/pricing/details/private-link/) page.

## Scenario 2: Hub and spoke architecture - Shared virtual network for private endpoints and virtual machines

:::image type="content" source="./media/inspect-traffic-using-azure-firewall/shared-spoke.png" alt-text="Private Endpoints and Virtual Machines in same Virtual Network" border="true":::

This scenario is implemented when:

* It's not possible to have a dedicated virtual network for the private endpoints

* When only a few services are exposed in the virtual network using private endpoints

The virtual machines have /32 system routes pointing to each private endpoint. One route per private endpoint is configured to route traffic through Azure Firewall. 

The administrative overhead of maintaining the route table increases as services are exposed in the virtual network. The possibility of hitting the route limit also increases.

Depending on your overall architecture, it's possible to run into the 400 routes limit. It's recommended to use scenario 1 whenever possible.

Connections from a client virtual network to the Azure Firewall in a hub virtual network incurs charges if the virtual networks are peered. Connections from Azure Firewall in a hub virtual network to private endpoints in a peered virtual network aren't charged.

For more information on charges related to connections with peered virtual networks, see the FAQ section of the [pricing](https://azure.microsoft.com/pricing/details/private-link/) page.

## Scenario 3: Single virtual network

:::image type="content" source="./media/inspect-traffic-using-azure-firewall/single-vnet.png" alt-text="Single virtual network" border="true":::

Use this pattern when a migration to a hub and spoke architecture isn't possible. The same considerations as in scenario 2 apply. In this scenario, virtual network peering charges don't apply.

## Scenario 4: On-premises traffic to private endpoints

:::image type="content" source="./media/inspect-traffic-using-azure-firewall/on-premises.png" alt-text="On-premises traffic to private endpoints" border="true":::

This architecture can be implemented if you have configured connectivity with your on-premises network using either: 

* [ExpressRoute](..\expressroute\expressroute-introduction.md)

* [Site to Site VPN](../vpn-gateway/tutorial-site-to-site-portal.md) 

If your security requirements require client traffic to services exposed via private endpoints to be routed through a security appliance, deploy this scenario.

The same considerations as in scenario 2 above apply. In this scenario, there aren't virtual network peering charges. For more information about how to configure your DNS servers to allow on-premises workloads to access private endpoints, see [on-premises workloads using a DNS forwarder](./private-endpoint-dns-integration.md#on-premises-workloads-using-a-dns-forwarder).

## Next steps

In this article, you explored different scenarios that you can use to restrict traffic between a virtual machine and a private endpoint using Azure Firewall.

For a tutorial on how to configure Azure Firewall to inspect traffic destined to a private endpoint, see [Tutorial: Inspect private endpoint traffic with Azure Firewall](tutorial-inspect-traffic-azure-firewall.md)

To learn more about private endpoint, see [What is Azure Private Endpoint?](private-endpoint-overview.md).

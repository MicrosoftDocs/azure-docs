---
title: What is hybrid connectivity?
description: Learn about hybrid connectivity in Azure, and the services that can help you connect and maintain resiliency with your Azure resources.
ms.service: azure-virtual-network
ms.topic: conceptual
ms.date: 06/24/2025
ms.author: cherylmc
author: cherylmc
---

# What is hybrid connectivity?

Hybrid connectivity is a critical component of a cloud architecture, which combines on-premises infrastructure, private cloud services, and public cloud services. Hybrid connectivity enables you to connect and maintain resiliency with your Azure resources. This article provides an overview of hybrid connectivity services in the context of Azure services - Azure VPN, Azure ExpressRoute, and Azure Virtual WAN. You'll learn about key concepts, benefits, and use cases for each service.

:::image type="content" source="./media/hybrid-connectivity/hybrid-services.png" alt-text="Screenshot showing the icons for Azure VPN Gateway, Azure ExpressRoute, and Azure Virtual WAN.":::

## Choosing a solution

Choosing the right hybrid connectivity solution depends on your specific requirements and constraints. For example, if you're a small business with limited bandwidth requirements, Azure VPN Gateway might be a cost-effective option. As your business grows and requires higher bandwidth and lower latencies, you might consider upgrading to Azure ExpressRoute. As your network expands to multiple branches, it can become complex and challenging to manage connectivity. In this case, Azure Virtual WAN can simplify the deployment and management of branch connectivity.

When choosing a hybrid connectivity solution, consider the following factors:

- **Bandwidth**: The amount of data that needs to be transferred between on-premises and Azure resources.
- **Latency**: The time it takes for data to travel between on-premises and Azure resources.
- **Cost**: The cost of the solution, including setup, maintenance, and data transfer costs.
- **Security**: The level of security provided by the solution, including encryption, authentication, and access control.
- **Resiliency**: The ability of the solution to maintain connectivity in the event of a failure or outage.
- **Scalability**: The ability of the solution to scale to meet changing business requirements.
- **Compliance**: The solution must comply with relevant regulations and standards.

Establishing and maintaining connectivity between on-premises resources and Azure resources is essential for many organizations. Depending on your requirements, you can choose from the following hybrid connectivity services:

## Azure VPN Gateway

[Azure VPN Gateway](../../vpn-gateway/index.yml) provides secure, site-to-site connectivity between on-premises networks and Azure virtual networks. It also supports point-to-site connectivity for individual devices. Azure VPN Gateway uses IPsec and IKE (Internet Key Exchange) protocols to establish encrypted connections over the public internet. It's a cost-effective solution for smaller scale deployments and is suitable for scenarios where latency isn't a critical factor.

:::image type="content" source="./media/hybrid-connectivity/vpn-gateway.png" alt-text="Diagram showing a Site-to-Site VPN tunnel and a Point-to-Site VPN tunnel connected to the Azure VPN Gateway.":::

### Use cases

- **Site-to-site connectivity**: Connect on-premises networks to Azure virtual networks using IPsec VPN protocols.
- **Point-to-site connectivity**: Connect individual devices, such as laptops or mobile devices, to Azure virtual networks using VPN protocols.
- **Remote access**: Provide remote access to Azure resources for employees working from home or on the go.
- **Hybrid applications**: Build hybrid applications that require secure connections between on-premises and Azure resources.

For more information about Azure VPN Gateway, see [VPN Gateway overview](../../vpn-gateway/vpn-gateway-about-vpngateways.md).

## Azure ExpressRoute

[Azure ExpressRoute](../../expressroute/index.yml) provides private, dedicated connectivity between on-premises networks and Azure datacenters. It offers higher reliability, faster speeds, and lower latencies compared to connections over the public internet. ExpressRoute connections can be established through an ExpressRoute circuit, which is a dedicated connection between your on-premises network and an Azure datacenter. ExpressRoute is suitable for scenarios requiring low latency connections and high bandwidth requirements.

:::image type="content" source="./media/hybrid-connectivity/expressroute.png" alt-text="Diagram showing the on-premises network connecting to Microsoft and Azure services through an ExpressRoute circuit.":::

### Use cases

- **Hybrid applications**: Build hybrid applications that require low latency and high bandwidth connections between on-premises and Azure resources.
- **Data transfer**: Transfer large amounts of data between on-premises and Azure resources without using the public internet.
- **Disaster recovery**: Establish a reliable and secure connection for disaster recovery solutions, such as Azure Site Recovery.
- **Compliance**: Meet regulatory and compliance requirements by using private connections instead of public internet connections.
- **Big data analytics**: Transfer large datasets to Azure for analysis and processing without using the public internet.
- **Backup and archiving**: Use ExpressRoute to transfer backup data to Azure Blob Storage or Azure Archive Storage for long-term retention.

For more information about ExpressRoute, see [ExpressRoute overview](../../expressroute/expressroute-introduction.md).

## Azure Virtual WAN

[Azure Virtual WAN](../../virtual-wan/index.yml) is a networking service that provides optimized and automated branch-to-branch, branch-to-Azure, and Azure-to-Azure connectivity. It simplifies the deployment and management of branch connectivity by providing a unified hub-and-spoke architecture. Virtual WAN supports multiple connectivity options, including VPN, ExpressRoute, and SD-WAN. 

:::image type="content" source="./media/hybrid-connectivity/virtual-wan.png" alt-text="Diagram showing an ExpressRoute gateway, VPN gateway, and Azure Firewall within a virtual hub, connecting branch offices and remote workers to Azure.":::

### Use cases

- **Branch connectivity**: Connect multiple branch offices to Azure resources using a unified hub-and-spoke architecture.
- **SD-WAN integration**: Integrate with third-party SD-WAN solutions to optimize branch connectivity and performance.
- **Automated branch management**: Simplify the deployment and management of branch connectivity with automated provisioning and configuration.
- **Global connectivity**: Connect multiple Azure regions and on-premises networks using a single Virtual WAN hub.
- **Optimized routing**: Use Azure's global backbone network to optimize routing and performance for branch-to-branch and branch-to-Azure connectivity.
- **Security**: Use Azure Firewall and other security services to protect branch connectivity and enforce security policies.

For more information about Azure Virtual WAN, see [Virtual WAN overview](../../virtual-wan/virtual-wan-about.md).

## Azure portal experience

The Azure portal provides a unified experience for [managing hybrid connectivity](https://go.microsoft.com/fwlink/?linkid=2313683) services. The portal provides a guided experience for setting up a Site-to-Site VPN connection and an ExpressRoute connection from your on-premises network to Azure.

:::image type="content" source="media/hybrid-connectivity/hybrid-services-portal.png" alt-text="Screenshot of hybrid connectivity hub with service selections." lightbox="media/hybrid-connectivity/hybrid-services-portal-expanded.png":::

The hybrid connectivity hub page provides a consolidated view of all Azure VPN Gateway, Azure ExpressRoute, and Azure Virtual WAN resources deployed in your subscription. From this single view, you can select and manage the specific resource you need.

:::image type="content" source="./media/hybrid-connectivity/manage-services.png" alt-text="Screenshot showing the management of VPN Gateway, ExpressRoute, and Virtual WAN resources from the hybrid connectivity hub page.":::

## Next steps

Learn more about the different features and capabilities of each hybrid connectivity service:

> [!div class="nextstepaction"]
> [Azure hybrid connectivity documentation](../hybrid-connectivity/index.yml)

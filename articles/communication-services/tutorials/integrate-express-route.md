---
title: Integrate Azure Communication Services with ExpressRoute
titleSuffix: An Azure Communication Services article
description: Integrate Azure Communication Services with ExpressRoute to extend your local networks into the Microsoft Cloud over a private connection.
author: hrazi
manager: mharbut
services: azure-communication-services
ms.date: 02/01/2025
ms.author: harazi
ms.topic: conceptual 
ms.service: azure-communication-services
---

# Integrate Azure Communication Services with ExpressRoute

Azure Communication Services enables developers to integrate voice, video, chat, and SMS capabilities into their applications by using cloud-based services. Organizations can use Azure ExpressRoute to establish private, dedicated network connections between their on-premises environments and Azure. This approach enhances the performance, reliability, and security of communication services.

This article describes how to integrate Azure Communication Services with ExpressRoute to extend your local networks into the Microsoft Cloud over a private connection.

## Prerequisites

- Azure subscription: An active Azure account. If you don't have one, [create a free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- ExpressRoute circuit: A configured and operational ExpressRoute circuit. For setup instructions, see [Create and modify an ExpressRoute circuit](/azure/expressroute/expressroute-howto-circuit-portal-resource-manager).
- Azure Communication Services resource: An instance of Azure Communication Services deployed in your Azure subscription.
- Network connectivity: Proper network configurations to connect your on-premises environment to Azure via ExpressRoute.

## Benefits of using ExpressRoute with Azure Communication Services

- **Enhanced security**: Bypass the public internet to reduce exposure to potential threats.
- **Improved performance**: Experience lower latency and higher reliability for real-time communication.
- **Consistent network throughput**: Benefit from predictable network performance for mission-critical applications.

## Configure ExpressRoute

To configure your ExpressRoute circuit, complete the following sections.

### Configure ExpressRoute for Microsoft peering

To enable connectivity to Azure Communication Services, set up Microsoft peering on your ExpressRoute circuit.

1. Access the Azure portal and go to your ExpressRoute circuit.

1. Enable Microsoft peering:

   1. Under the **Peerings** section, select **+ Add**.

   1. Select **Microsoft Peering** and provide the required information, including your primary and secondary subnets, VLAN ID, and ASNs.

1. Make sure that your on-premises network advertises the correct routes to Azure services.

For detailed instructions, see [Configure ExpressRoute Microsoft peering](/azure/expressroute/how-to-routefilter-portal).

### Apply route filters for Azure Communication Services

Route filters enable you to selectively consume services over ExpressRoute.

#### Create a route filter

1. In the Azure portal, search for route filters and select **+ Create**.

1. Provide a name, and then select your subscription and resource group.

#### Add Azure Communication Services to the route filter

1. After you create the route filter, select **Rules** and then select **+ Add**.

1. In the list of services, select **Azure Communication Services**.

1. If you use Microsoft Public Switched Telephone Network (PSTN), select **Azure SIP Trunking** from the list of services.

#### Associate route filter with an ExpressRoute circuit

1. Go back to your ExpressRoute circuit.

1. Under **Peerings**, select your Microsoft peering.

1. Associate the route filter that you created.

For more information, see [Configure route filters for Microsoft Peering by using the Azure portal](/azure/expressroute/how-to-routefilter-portal).

### Configure network security

Make sure that your network security policies allow traffic to and from Azure Communication Services.

1. Update on-premises firewall settings to allow Azure Communication Services traffic.

1. Configure network security groups in Azure to permit inbound and outbound communication with your on-premises network.

### Verify connectivity

1. From your on-premises environment, perform a ping test to the Azure Communication Services endpoints to verify connectivity.

1. Use `traceroute` tools to make sure traffic is routing through ExpressRoute.

### Update application settings

1. Change your application's configuration to point to the Azure Communication Services endpoints accessible via ExpressRoute.

1. If you're using Azure Communication Services SDKs, ensure that they're configured to use the private endpoints.

### Considerations

* Verify that Azure Communication Services is available in your desired region and that it supports ExpressRoute connectivity.
* Assess your bandwidth needs to ensure that your ExpressRoute circuit can support the communication load.

## Troubleshooting

- Connectivity issues: If you can't connect to Azure Communication Services over ExpressRoute, verify your route filters and peering configurations.
- Authentication failures: Ensure that your authentication tokens and keys for Azure Communication Services are correctly configured and not expired.

## Frequently asked questions

### Can I use ExpressRoute with Azure Communication Services for all communication modes?

No. ExpressRoute currently supports only voice mode by [direct routing](../concepts/telephony/direct-routing-provisioning.md) and [video communication](../concepts/voice-video-calling/calling-sdk-features.md) mode.

### Is there an added cost for using ExpressRoute with Azure Communication Services?

Not directly. Although there's no added cost from Azure Communication Services to use ExpressRoute, there are costs associated with provisioning and using an ExpressRoute circuit. For more information, see [ExpressRoute pricing](https://azure.microsoft.com/pricing/details/expressroute/).

### How does ExpressRoute affect the latency of communication services?

ExpressRoute provides [lower and more consistent latency compared to typical internet connections](/azure/expressroute/expressroute-faqs#what-are-the-benefits-of-using-expressroute-and-private-network-connections), which can enhance the performance of real-time communication applications.

## Related content

- [What is Azure Communication Services?](../overview.md)
- [What is Azure ExpressRoute?](/azure/expressroute/expressroute-introduction)
- [Azure Communication Services network recommendations](../concepts/voice-video-calling/network-requirements.md)

---
title: Integrate Azure Communication Services with ExpressRoute
titleSuffix: An Azure Communication Services article
description: Integrate Azure Communication Services with ExpressRoute to extend your local networks into the Microsoft cloud over a private connection.
author: hrazi
manager: mharbut
services: azure-communication-services

ms.date: 02/01/2025
ms.author: harazi
ms.topic: conceptual 
ms.service: azure-communication-services
---

# Integrate Azure Communication Services with ExpressRoute

Azure Communication Services enables developers to integrate voice, video, chat, and SMS capabilities into their applications using cloud-based services. Organizations can use Azure ExpressRoute to establish private, dedicated network connections between their on-premises environments and Azure. This approach enhances the performance, reliability, and security of communication services. 

This article describes how to integrate Azure Communication Services with ExpressRoute to extend your local networks into the Microsoft cloud over a private connection.

## Prerequisites 

- Azure Subscription: An active Azure account. If you don't have one, [create a free account](https://azure.microsoft.com/free/). 

- ExpressRoute Circuit: A configured and operational ExpressRoute circuit. For setup instructions, see [Create and modify an ExpressRoute circuit](/azure/expressroute/expressroute-howto-circuit-portal-resource-manager). 

- Azure Communication Services Resource: An instance of Azure Communication Services deployed in your Azure subscription. 

- Network Connectivity: Proper network configurations to connect your on-premises environment to Azure via ExpressRoute.

## Benefits of Using ExpressRoute with Azure Communication Services 

- **Enhanced Security**: Bypass the public internet to reduce exposure to potential threats. 

- **Improved Performance**: Experience lower latency and higher reliability for real-time communication. 

- **Consistent Network Throughput**: Benefit from predictable network performance for mission-critical applications.

## Configure ExpressRoute 

### 1. Configure ExpressRoute for Microsoft Peering 

To enable connectivity to Azure Communication Services, set up Microsoft Peering on your ExpressRoute circuit. 

1. Access the Azure portal and navigate to your ExpressRoute circuit. 

2. Enable Microsoft Peering: 

   2.2. Under the Peerings section, select **+ Add**. 

   2.2. Choose **Microsoft Peering** and provide the required information, including your Primary and Secondary Subnets, VLAN ID, and ASNs.

3. Advertise Routes: Make sure that your on-premises network advertises the correct routes to Azure services.

For detailed instructions, see [Configure ExpressRoute Microsoft Peering](/azure/expressroute/how-to-routefilter-portal). 

 ### 2. Apply route filters for Azure Communication Services 

Route filters enable you to selectively consume services over ExpressRoute. 

1. Create a route filter: 

   1.1 In the Azure portal, search for route filters and select **+ Create**. 

   1.2. Provide a name, select your subscription and resource group. 

2. Add Azure Communication Services to the route filter:

   2.1. After creating the route filter, select **Rules** and click **+ Add**. 

   2.2. Choose Azure Communication Services from the list of services.

   2.3. If you use Microsoft PSTN, choose Azure SIP Trunking from the list of services.

3. Associate route filter with ExpressRoute Circuit: 

   3.1. Navigate back to your ExpressRoute circuit. 

   3.2. Under Peerings, select your Microsoft Peering. 

   3.3. Associate the route filter you created. 

For more information, see [Configure route filters for Microsoft Peering using Azure portal](/azure/expressroute/how-to-routefilter-portal). 

### 3. Configure Network Security 

Make sure that your network security policies allow traffic to and from Azure Communication Services. 

   - Firewall rules: Update on-premises firewall settings to allow Azure Communication Services traffic. 

   - Network Security Groups (NSGs): Configure NSGs in Azure to permit inbound and outbound communication with your on-premises network. 

### 4. Verify Connectivity 

- Ping test: From your on-premises environment, perform a ping test to the Azure Communication Services endpoints to verify connectivity. 

- Trace route: Use `traceroute` tools to make sure traffic is routing through ExpressRoute. 

### 5. Update Application Settings 

- Endpoint configuration: Change your application's configuration to point to the Azure Communication Services endpoints accessible via ExpressRoute. 

- SDK settings: If using Azure Communication Services SDKs, ensure they're configured to use the private endpoints. 

### Considerations 

- Supported regions: Verify that Azure Communication Services is available in your desired region and supports ExpressRoute connectivity. 

- Bandwidth requirements: Assess your bandwidth needs to ensure your ExpressRoute circuit can support the communication load. 

## Troubleshooting 

- Connectivity Issues: If you can't connect to Azure Communication Services over ExpressRoute, verify your route filters and peering configurations. 

- Authentication Failures: Ensure that your authentication tokens and keys for Azure Communication Services are correctly configured and not expired. 

## Frequently Asked Questions 

### Can I use ExpressRoute with Azure Communication Services for all communication modes? 

No, ExpressRoute currently supports only voice mode by [Direct Routing](../concepts/telephony/direct-routing-provisioning.md) and [video communication](../concepts/voice-video-calling/calling-sdk-features.md) mode. 

### Is there an added cost for using ExpressRoute with Azure Communication Services? 

Not directly. While there's no added cost from Azure Communication Services for using ExpressRoute, there are costs associated with provisioning and using an ExpressRoute circuit. For more information, see [ExpressRoute pricing](https://azure.microsoft.com/pricing/details/expressroute/).

### How does ExpressRoute affect the latency of communication services? 

ExpressRoute provides [lower and more consistent latency compared to typical internet connections](/azure/expressroute/expressroute-faqs#what-are-the-benefits-of-using-expressroute-and-private-network-connections), which can enhance the performance of real-time communication applications.

## Related articles

- [Azure Communication Services Overview](../overview.md) 
- [What is Azure ExpressRoute](/azure/expressroute/expressroute-introduction)
- [Azure Communication Services Network recommendations](../concepts/voice-video-calling/network-requirements.md)

<properties
   pageTitle="Prerequisites for ExpressRoute adoption | Microsoft Azure"
   description="This page provides a list of requirements to be met before you can order an Azure ExpressRoute circuit."
   documentationCenter="na"
   services="expressroute"
   authors="cherylmc"
   manager="carmonm"
   editor=""/>
<tags
   ms.service="expressroute"
   ms.devlang="na"
   ms.topic="get-started-article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="06/13/2016"
   ms.author="cherylmc"/>


# ExpressRoute prerequisites & checklist  

To connect to Microsoft cloud services using ExpressRoute, you’ll need to verify that the following requirements listed in the sections below have been met.

[AZURE.INCLUDE [expressroute-office365-include](../../includes/expressroute-office365-include.md)]

## Azure account

- A valid and active Microsoft Azure account. This is required to setup the ExpressRoute circuit. ExpressRoute circuits are resources within Azure subscriptions. An Azure subscription is a requirement even if connectivity is limited to non-Azure Microsoft cloud services, such as Office 365 services and CRM online.
- An active Office 365 subscription (if using Office 365 services). See the [Office 365 specific requirements](#office-365-specific-requirements) section of this article for more information.

## Connectivity provider
- You can work with an [ExpressRoute connectivity partner](expressroute-locations.md#partners) to connect to the Microsoft cloud. You can set up a connection between your on-premises network and Microsoft in [three ways](expressroute-introduction.md#howtoconnect). 
- If your provider is not an ExpressRoute connectivity partner, you can still connect to the Microsoft cloud through a [cloud exchange provider](expressroute-locations.md#nonpartners).

## Network requirements
- **Redundant connectivity**: there is no redundancy requirement on physical connectivity between you and your provider. Microsoft does require redundant BGP sessions to be set up between Microsoft’s routers and the peering routers, even when you have just [one physical connection to a cloud exchange](expressroute-faqs.md#onep2plink). 
- **Routing**: depending on how you connect to the Microsoft Cloud, you or your provider need to set up and manage the BGP sessions for [routing domains](expressroute-circuit-peerings.md). Some Ethernet connectivity provider or cloud exchange provider may offer BGP management as a value-add service.
- **NAT**: Microsoft only accepts public IP addresses through Microsoft peering. If you are using private IP addresses in your on-premises network, you or your provider need to translate the private IP addresses to the public IP addresses [using the NAT](expressroute-nat.md).
- **QoS**: Skype for Business has various services (e.g. voice, video, text) that require differentiated QoS treatment. You and your provider should follow the [QoS requirements](expressroute-qos.md).
- **Network Security**: you should consider [network security](../best-practices-network-security.md) when connecting to the Microsoft Cloud via ExpressRoute.
 
## Office 365

If you plan to enable Office 365 on ExpressRoute, please review the following documents for more information about Office 365 requirements.


- [Overview of ExpressRoute for Office 365](https://support.office.com/en-us/article/Azure-ExpressRoute-for-Office-365-6d2534a2-c19c-4a99-be5e-33a0cee5d3bd)
- [Routing with ExpressRoute for Office 365](https://support.office.com/en-us/article/Routing-with-ExpressRoute-for-Office-365-e1da26c6-2d39-4379-af6f-4da213218408)
- [Office 365 URLs and IP address ranges](https://support.office.com/en-us/article/Office-365-URLs-and-IP-address-ranges-8548a211-3fe7-47cb-abb1-355ea5aa88a2)
- [Network planning and performance tuning for Office 365](https://support.office.com/en-us/article/Network-planning-and-performance-tuning-for-Office-365-e5f1228c-da3c-4654-bf16-d163daee8848)
- [Network bandwidth calculators and tools](https://support.office.com/en-us/article/Network-and-migration-planning-for-Office-365-f5ee6c33-bcd7-4b0b-b0f8-dc1d9fb8d132)
- [Office 365 integration with on-premises environments](https://support.office.com/en-us/article/Office-365-integration-with-on-premises-environments-263faf8d-aa21-428b-aed3-2021837a4b65)

## CRM Online 
If you plan to enable CRM Online on ExpressRoute, please review the following documents for more information about CRM Online

- [CRM Online URLs](https://support.microsoft.com/kb/2655102) and [IP address ranges](https://support.microsoft.com/kb/2728473)

## Next steps

- For more information about ExpressRoute, see the [ExpressRoute FAQ](expressroute-faqs.md).
- Find an ExpressRoute connectivity provider. See [ExpressRoute partners and peering locations](expressroute-locations.md).
- Refer to requirements for [Routing](expressroute-routing.md), [NAT](expressroute-nat.md) and [QoS](expressroute-qos.md).
- Configure your ExpressRoute connection.
	- [Create an ExpressRoute circuit](expressroute-howto-circuit-classic.md)
	- [Configure routing](expressroute-howto-routing-classic.md)
	- [Link a VNet to an ExpressRoute circuit](expressroute-howto-linkvnet-classic.md)


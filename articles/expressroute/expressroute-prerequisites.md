<properties
   pageTitle="Prerequisites for ExpressRoute adoption | Microsoft Azure"
   description="This page provides a list of requirements to be met before you can order an Azure ExpressRoute circuit."
   documentationCenter="na"
   services="expressroute"
   authors="cherylmc"
   manager="carolz"
   editor=""/>
<tags
   ms.service="expressroute"
   ms.devlang="na"
   ms.topic="get-started-article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="09/21/2015"
   ms.author="cherylmc"/>


# ExpressRoute prerequisites   

To connect to Microsoft cloud services using ExpressRoute, you’ll need to verify that the following requirements listed in the sections below have been met.

## Account requirements

- A valid and active Microsoft Azure account. This is required to setup the ExpressRoute circuit. ExpressRoute circuits are resources within Azure subscriptions. An Azure subscription is a requirement even if connectivity is limited to non-Azure Microsoft cloud services, such as Office 365 services and CRM online.
- An active Office 365 subscription (if using Office 365 services). See the [Office 365 specific requirements](#office-365-specific-requirements) section of this article for more information.

## Connectivity provider relationship

- A relationship with a connectivity provider from the supported list through whom connectivity needs to be facilitated. You must have an existing business relationship with your connectivity provider. You will need to make sure that the service you have with the connectivity provider is compatible with ExpressRoute.
- If the you want to use a connectivity provider that is not in the supported list, you can still create a connection to Microsoft cloud services through an exchange.
	- Check with your connectivity provider to see if they are present in any of the exchange locations appearing in supported list.
	- Have the connectivity provider extend your network to the exchange location of choice.
	- Order an ExpressRoute circuit with the exchange as the connectivity provider.

## Physical connectivity between your network and the connectivity provider

Refer to the connectivity models section for details on connectivity models. Customers must ensure that their on-premises infrastructure is physically connected to the service provider infrastructure through one of the models described. 

## Redundancy requirements for connectivity

There are no redundancy requirements on physical connectivity between the customer infrastructure and the service provider infrastructure. 
Microsoft does require redundancy in Layer 3. Microsoft does require redundant routing to be setup between Microsoft’s edge and the customer’s network through the service provider for each of the peerings to be enabled. If routing sessions are not configured in a redundant manner, the service availability SLA will be void.

## IP addresses and routing considerations

Customers/Connectivity Providers are responsible for setting up redundant BGP sessions with the Microsoft edge infrastructure.  Customers choosing to connect through IP VPN providers will typically rely on the connectivity providers to manage routing configurations. Customers co-located with an exchange or connecting to Microsoft through a point-to-point Ethernet provider will have to configure redundant BGP sessions per peering to meet availability SLA requirements. Connectivity providers may offer this as a value added service. 
Refer to the routing domains table in the [ExpressRoute circuits and routing domains](expressroute-circuit-peerings.md) article for more information on limits.

## Security and firewalling

Please refer to this document, [Microsoft Cloud Services and Network Security](../best-practices-network-security.md), for security and firewalling information.

## NAT configuration for Azure public and Microsoft peerings

Refer to [ExpressRoute NAT requirements](expressroute-nat.md) for detailed guidance about requirements and configurations. Check with your connectivity provider to see if they will manage NAT setup and management for you. Typically, Layer 3 connectivity providers will manage NAT for you.

## Office 365 specific requirements

Review the following resources for more information about Office 365 requirements.

- [Network planning and performance tuning for Office 365](http://aka.ms/tune)
- [Office 365 network traffic management](https://msft.spoppe.com/teams/cpub/teams/IW_Admin/modsquad/_layouts/15/WopiFrame.aspx?sourcedoc=%7b23f09224-0668-4476-8627-aaff30931439%7d&action=edit&source=https%3A%2F%2Fmsft%2Espoppe%2Ecom%2Fteams%2Fcpub%2Fteams%2FIW%5FAdmin%2Fmodsquad%2FSitePages%2FHome%2Easpx)
- Refer to the [ExpressRoute Quality of Service (QoS) requirements](expressroute-qos.md) article for detailed guidance on QoS requirements and configurations. Check with your connectivity provider to see if they offer multiple classes of service for your VPN. 

## Next steps

- For more information about ExpressRoute, see the [ExpressRoute FAQ](expressroute-faqs.md).
- Find a service provider. See [ExpressRoute partners and peering locations](expressroute-locations.md).
- Refer to requirements for [Routing](expressroute-routing.md), [NAT](expressroute-nat.md) and [QoS](expressroute-qos.md).
- Configure your ExpressRoute connection.
	- [Create an ExpressRoute circuit](expressroute-howto-circuit-classic.md)
	- [Configure routing](expressroute-howto-routing-classic.md)
	- [Link a VNet to an ExpressRoute circuit](expressroute-howto-linkvnet-classic.md)


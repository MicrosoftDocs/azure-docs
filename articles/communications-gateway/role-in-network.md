---
title: Azure Communications Gateway and your network
description: Azure Communication Gateway sits on the edge of your network. Its interoperability features allow it to adapt to your requirements.
author: rcdun
ms.author: rdunstan
ms.service: communications-gateway
ms.topic: concept-article
ms.date: 11/06/2023
ms.custom: template-concept
---

# Your network and Azure Communications Gateway

Azure Communications Gateway sits at the edge of your network. This position allows it to manipulate signaling and media to meet the requirements of your networks and your chosen communications services (for example, Microsoft Operator Connect or Zoom Phone Cloud Peering). Azure Communications Gateway includes many interoperability settings by default, and you can arrange further interoperability configuration.

> [!TIP]
> This section provides a brief overview of Azure Communications Gateway's interoperability features. For detailed information about interoperability with a specific communications service, see:
> - [Interoperability of Azure Communications Gateway with Operator Connect and Teams Phone Mobile](interoperability-operator-connect.md).
> - [Interoperability of Azure Communications Gateway with Microsoft Teams Direct Routing](interoperability-teams-direct-routing.md).
> - [Overview of interoperability of Azure Communications Gateway with Zoom Phone Cloud Peering](interoperability-zoom.md)

## Role and position in the network

Azure Communications Gateway sits at the edge of your fixed line and mobile networks. It connects these networks to one or more communications services. The following diagram shows where Azure Communications Gateway sits in your network.

:::image type="complex" source="media/azure-communications-gateway-architecture.svg" alt-text="Architecture diagram for Azure Communications Gateway connecting to fixed and mobile networks" lightbox="media/azure-communications-gateway-architecture.svg":::
    Architecture diagram showing Azure Communications Gateway connecting to the Microsoft Phone System and Zoom Phone Cloud Peering, a fixed line deployment and a mobile IMS core. Azure Communications Gateway contains SBC function, the MCP application server for anchoring Teams Phone Mobile calls and a provisioning API.
:::image-end:::

Azure Communications Gateway provides all the features of a traditional session border controller (SBC). These features include:

- Signaling interworking features to solve interoperability problems
- Advanced media manipulation and interworking
- Defending against Denial of Service attacks and other malicious traffic
- Ensuring Quality of Service

Azure Communications Gateway also offers metrics for monitoring your deployment.

## Network requirements

We expect your network to have two geographically redundant sites. You must provide networking connections between each site and:

* The other site in your deployment, as cross-connects.
* The Azure Regions in which you deploy Azure Communications Gateway.

Connectivity between your networks and Azure Communications Gateway must meet any relevant network connectivity specifications.

- We strongly recommend using Microsoft Azure Peering Service Voice (also called MAPS Voice or MAPSV).
- If you can't use MAPS Voice, we recommend ExpressRoute Microsoft Peering.

The following diagram shows an operator network using MAPS Voice or ExpressRoute (as recommended) to connect to Azure Communications Gateway.

:::image type="content" source="media/azure-communications-gateway-network.svg" alt-text="Diagram that shows Azure Communications Gateway in two regions connecting to two sites in the operator network. The two sites in the operator network have cross-connects between them. The connections between the operator network use MAPS Voice or ExpressRoute, as recommended." lightbox="media/azure-communications-gateway-network.svg":::

For more information, see:

- [Connectivity for Azure Communications Gateway](connectivity.md), including details of the IP connectivity.
- [Reliability in Azure Communications Gateway](reliability-communications-gateway.md), including application-level call routing requirements for failover.

## SIP signaling support

Azure Communications Gateway includes SIP trunks to your own network and can interwork between your existing core networks and the requirements of your chosen communications service.

[!INCLUDE [communications-gateway-multitenant](includes/communications-gateway-multitenant.md)]

You can arrange more interworking function as part of your initial network design or at any time by raising a support request for Azure Communications Gateway. For example, you might need extra interworking configuration for:

- Advanced SIP header or SDP message manipulation
- Support for reliable provisional messages (100rel)
- Interworking between early and late media
- Interworking away from inband DTMF tones

## RTP and SRTP media support

Azure Communications Gateway supports both RTP and SRTP, and can interwork between them. Azure Communications Gateway offers other media manipulation features to allow your networks to interoperate with your chosen communications services. For example, you can use Azure Communications for:

- Changing how RTCP is handled
- Controlling bandwidth allocation
- Prioritizing specific media traffic for Quality of Service

For full details of the media interworking features available in Azure Communications Gateway, raise a support request.

## Next steps

- Learn about [interoperability for Operator Connect and Teams Phone Mobile](interoperability-operator-connect.md)
- Learn about [interoperability for Microsoft Teams Direct Routing](interoperability-teams-direct-routing.md)
- Learn about [interoperability for Zoom Phone Cloud Peering](interoperability-zoom.md)
- Learn about [onboarding and Inclusive Benefits](onboarding.md)
- Learn about [planning an Azure Communications Gateway deployment](get-started.md)

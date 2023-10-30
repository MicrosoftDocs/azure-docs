---
title: Azure Communications Gateway and your network
description: Azure Communication Gateway sits on the edge of your network. Its interoperability features allow it to adapt to your requirements.
author: rcdun
ms.author: rdunstan
ms.service: communications-gateway
ms.topic: concept-article
ms.date: 10/09/2023
ms.custom: template-concept
---

# Your network and Azure Communications Gateway

Azure Communications Gateway sits at the edge of your network. This position allows it to manipulate signaling and media to meet the requirements of your networks and your chosen communications services. Azure Communications Gateway includes many interoperability settings by default, and you can arrange further interoperability configuration.

> [!TIP]
> This section provides a brief overview of Azure Communications Gateway's interoperability features. For detailed information about interoperability with a specific communications service, see:
> - [Interoperability of Azure Communications Gateway with Operator Connect and Teams Phone Mobile](interoperability-operator-connect.md).
> - [Interoperability of Azure Communications Gateway with Microsoft Teams Direct Routing](interoperability-teams-direct-routing.md).

## Role and position in the network

Azure Communications Gateway sits at the edge of your fixed line and mobile networks. It connects these networks to one or more communications services. The following diagram shows where Azure Communications Gateway sits in your network.

:::image type="complex" source="media/azure-communications-gateway-architecture.png" alt-text="Architecture diagram for Azure Communications Gateway connecting to fixed and mobile networks":::
    Architecture diagram showing Azure Communications Gateway connecting to the Microsoft Phone System, a softswitch in a fixed line deployment and a mobile IMS core. Azure Communications Gateway contains certified SBC function and the MCP application server for anchoring mobile calls.
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
* The two Azure Regions in which you deploy Azure Communications Gateway.

Connectivity between your networks and Azure Communications Gateway must meet any relevant network connectivity specifications.

[!INCLUDE [communications-gateway-maps-or-expressroute](includes/communications-gateway-maps-or-expressroute.md)]

For more information on how to route calls between Azure Communications Gateway and your network, see [Call routing requirements](reliability-communications-gateway.md#call-routing-requirements).

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

- Transcoding (converting) between codecs supported by your network and codecs supported by your chosen communications service.
- Changing how RTCP is handled
- Controlling bandwidth allocation
- Prioritizing specific media traffic for Quality of Service

For full details of the media interworking features available in Azure Communications Gateway, raise a support request.

## Next steps

- Learn about [interoperability for Operator Connect and Teams Phone Mobile](interoperability-operator-connect.md)
- Learn about [interoperability for Microsoft Teams Direct Routing](interoperability-teams-direct-routing.md)
- Learn about [onboarding and Inclusive Benefits](onboarding.md)
- Learn about [planning an Azure Communications Gateway deployment](get-started.md)
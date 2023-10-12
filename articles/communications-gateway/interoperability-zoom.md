---
title: Overview of Zoom Phone Cloud Peering with Azure Communications Gateway
description: Understand how Azure Communications Gateway fits into your fixed and mobile networks and into the Zoom Phone Cloud Peering program.
author: rcdun
ms.author: rdunstan
ms.service: communications-gateway
ms.topic: conceptual
ms.date: 11/06/2023
ms.custom: template-concept
---

# Overview of interoperability of Azure Communications Gateway with Zoom Phone Cloud Peering

Azure Communications Gateway can manipulate signaling and media to meet the requirements of your networks and the Zoom Phone Cloud Peering program. This article provides an overview of the interoperability features that Azure Communications Gateway offers for Zoom Phone Cloud Peering.

> [!IMPORTANT]
> You must be a telecommunications operator or service provider to use Azure Communications Gateway.

## Role and position in the network

Azure Communications Gateway sits at the edge of your fixed line and mobile networks. It connects these networks to Zoom servers, allowing you to support the Zoom Phone Cloud Peering program. The following diagram shows where Azure Communications Gateway sits in your network.


:::image type="complex" source="media/azure-communications-gateway-architecture-zoom.svg" alt-text="Architecture diagram for Azure Communications Gateway for Microsoft Teams Direct Routing.":::
    Architecture diagram showing Azure Communications Gateway connecting to Zoom servers and a fixed operator network over SIP and RTP. Azure Communications Gateway and Zoom Phone Cloud Peering connect multiple customers to the operator network. Azure Communications Gateway also has a provisioning API to which a BSS client in the operator's management network must connect. Azure Communications Gateway contains certified SBC function.
:::image-end:::

Calls flow from Zoom clients through the Zoom servers and Azure Communications Gateway into your network.

With Zoom Cloud Peering, you provide a trunk towards Zoom (via Azure Communications Gateway) for your customers.[!INCLUDE [communications-gateway-multitenant](includes/communications-gateway-multitenant.md)]

Azure Communications Gateway does not support Premises Peering (where each customer has an eSBC) for Zoom Phone.

## SIP signaling

Azure Communications Gateway automatically interworks calls to support the requirements of the Zoom Phone Cloud Peering program, including:

- Early media
- 180 responses without SDP
- 183 responses with SDP
- Strict rules on normalizing headers used to route calls
- Conversion of various headers to P-Asserted-Identity headers

You can arrange more interworking function as part of your initial network design or at any time by raising a support request for Azure Communications Gateway. For example, you might need extra interworking configuration for:

- Advanced SIP header or SDP message manipulation
- Support for reliable provisional messages (100rel)
- Interworking away from inband DTMF tones

## SRTP media

The Zoom Phone Cloud Peering program requires SRTP for media. Azure Communications Gateway supports both RTP and SRTP, and can interwork between them. Azure Communications Gateway offers further media manipulation features to allow your networks to interoperate with the Zoom servers.

### Media handling for calls

Azure Communications Gateway can use Opus, G.722 and G.711 towards Zoom servers, with a packetization time of 20ms. You must select the codecs that you want to support when you deploy Azure Communications Gateway.

If your network cannot support a packetization time of 20ms, you must contact your onboarding team or raise a support request to discuss your requirements for transrating (changing packetization time).

### Media interworking options

Azure Communications Gateway offers multiple media interworking options. For example, you might need to:

- Control bandwidth allocation
- Prioritize specific media traffic for Quality of Service

For full details of the media interworking features available in Azure Communications Gateway, raise a support request.

## Next steps

- Learn about [monitoring Azure Communications Gateway](monitor-azure-communications-gateway.md).
- Learn about [requesting changes to Azure Communications Gateway](request-changes.md).

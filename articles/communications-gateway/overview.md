---
title: What is Azure Communications Gateway?
description: Azure Communications Gateway allows telecoms operators to interoperate with Operator Connect, Teams Phone Mobile, Microsoft Teams Direct Routing and Zoom Phone.
author: rcdun
ms.author: rdunstan
ms.service: communications-gateway
ms.topic: overview
ms.date: 11/06/2023
ms.custom: template-overview
---

# What is Azure Communications Gateway?

Azure Communications Gateway enables Microsoft Teams calling through the Operator Connect, Teams Phone Mobile and Microsoft Teams Direct Routing programs and Zoom calling through the Zoom Phone Cloud Peering program. It provides Voice and IT integration with these communications services across both fixed and mobile networks. It's certified as part of the Operator Connect Accelerator program.

[!INCLUDE [communications-gateway-tsp-restriction](includes/communications-gateway-tsp-restriction.md)]

:::image type="complex" source="media/azure-communications-gateway-overview.svg" alt-text="Diagram that shows Azure Communications Gateway between Microsoft Phone System, Zoom Phone and your networks. Your networks can be fixed and/or mobile.":::
    Diagram that shows how Azure Communications Gateway connects to the Microsoft Phone System, Zoom Phone and to your fixed and mobile networks. Microsoft Teams clients connect to Microsoft Phone System. Zoom clients connect to Zoom Phone. Your fixed network connects to PSTN endpoints. Your mobile network connects to Teams Phone Mobile users. Azure Communications Gateway connects Microsoft Phone System, Zoom Phone and your fixed and mobile networks.
:::image-end:::

Azure Communications Gateway provides advanced SIP, RTP and HTTP interoperability functions (including SBC function certified by Microsoft Teams and Zoom) so that you can integrate with your chosen communications services quickly, reliably and in a secure manner.

As part of Microsoft Azure, the network elements in Azure Communications Gateway are fully managed and include an availability SLA. This full management simplifies network operations integration and accelerates the timeline for adding new network functions into production.

## Architecture

Azure Communications Gateway acts as the edge of your network. This position allows it to interwork between your network and your chosen communications services and meet the requirements of your chosen programs.

To ensure availability, Azure Communications Gateway is deployed into two Azure Regions within a given Geography, as shown in the following diagram. It supports both active-active and primary-backup geographic redundancy models to fit with your network design.

:::image type="content" source="media/azure-communications-gateway-network.svg" alt-text="Diagram that shows Azure Communications Gateway deployed into two Azure regions within one Azure Geography. The Azure Communications Gateway resource in each region connects to a communications service and both operator sites." lightbox="media/azure-communications-gateway-network.svg":::

For more information about the networking and call routing requirements, see [Your network and Azure Communications Gateway](role-in-network.md#network-requirements) and [Reliability in Azure Communications Gateway](reliability-communications-gateway.md).

Traffic from all enterprises shares a single SIP trunk, using a multitenant format. This multitenant format ensures the solution is suitable for both the SMB and Enterprise markets.

> [!IMPORTANT]
> Azure Communications Gateway doesn't store/process any data outside of the Azure Regions where you deploy it.

## Voice features

Azure Communications Gateway supports the SIP and RTP requirements for certified SBCs for Microsoft Teams and Zoom Phone. It can transform call flows to suit your network with minimal disruption to existing infrastructure.

Azure Communications Gateway's voice features include:

- **Voice interworking** - Azure Communications Gateway can resolve interoperability issues between your network and communications services. Its position on the edge of your network reduces disruption to your networks, especially in complex scenarios like Teams Phone Mobile where Teams Phone System is the call control element. Azure Communications Gateway includes powerful interworking features, for example:

  - 100rel and early media inter-working
  - Downstream call forking with codec changes
  - Custom SIP header and SDP manipulation
  - DTMF (Dual-Tone Multi-Frequency tones) interworking between inband tones, RFC2833 telephone event and SIP INFO/NOTIFY signaling
  - Payload type interworking
  - Media transcoding
  - Ringback injection
- **Call control integration for Teams Phone Mobile** - Azure Communications Gateway includes an optional IMS Application Server called Mobile Control Point (MCP). MCP ensures calls are only routed to the Microsoft Phone System when a user is eligible for Teams Phone Mobile services. This process minimizes the changes you need in your mobile network to route calls into Microsoft Teams. For more information, see [Mobile Control Point in Azure Communications Gateway for Teams Phone Mobile](mobile-control-point.md).
-  **Optional direct peering to Emergency Routing Service Providers for Operator Connect and Teams Phone Mobile (US only)** - If your network can't transmit Emergency location information in PIDF-LO (Presence Information Data Format Location Object) SIP bodies, Azure Communications Gateway can connect directly to your chosen Teams-certified Emergency Routing Service Provider (ERSP) instead. See [Emergency calling for Operator Connect and Teams Phone Mobile with Azure Communications Gateway](emergency-calls-operator-connect.md).

## Provisioning and API integration for Operator Connect and Teams Phone Mobile

Launching Operator Connect or Teams Phone Mobile requires you to use the Operator Connect APIs to provision subscribers (instead of the Operator Connect Portal). Azure Communications Gateway offers a Number Management Portal integrated into the Azure portal. This portal uses the Operator Connect APIs, allowing you to pass the certification process and sell Operator Connect or Teams Phone Mobile services while you carry out a custom API integration project. 

For more information, see [Number Management Portal for provisioning with Operator Connect APIs](interoperability-operator-connect.md#number-management-portal-for-provisioning-with-operator-connect-apis) and [Manage an enterprise with Azure Communications Gateway's Number Management Portal for Operator Connect and Teams Phone Mobile](manage-enterprise-operator-connect.md).

The Number Management Portal is available as part of the optional API Bridge feature.

> [!TIP]
> The Number Management Portal does not allow your enterprise customers to manage Teams Calling. For example, it does not provide self-service portals.

Azure Communications Gateway also automatically integrates with Operator Connect APIs to upload call duration data to Microsoft Teams. For more information, see [Providing call duration data to Microsoft Teams](interoperability-operator-connect.md#providing-call-duration-data-to-microsoft-teams).

## Multitenant support and caller ID screening for Microsoft Teams Direct Routing

Microsoft Teams Direct Routing's multitenant model for carrier telecommunications operators requires inbound messages to Microsoft Teams to indicate the Microsoft tenant associated with your customers. Azure Communications Gateway automatically updates the SIP signaling to indicate  the correct tenant, using information that you provision onto Azure Communications Gateway. This process removes the need for your core network to map between numbers and customer tenants. For more information, see [Identifying the customer tenant for Microsoft Phone System](interoperability-teams-direct-routing.md#identifying-the-customer-tenant-for-microsoft-phone-system).

Microsoft Teams Direct Routing allows a customer admin to assign any phone number to a user, even if you haven't assigned that number to them. This lack of validation presents a risk of caller ID spoofing. Azure Communications Gateway automatically screens all Direct Routing calls originating from Microsoft Teams. This screening ensures that customers can only place calls from numbers that you have assigned to them. However, you can disable this screening on a per-customer basis if necessary. For more information, see [Support for caller ID screening](interoperability-teams-direct-routing.md#support-for-caller-id-screening).

## Next steps

- [Learn how to get started with Azure Communications Gateway](get-started.md)
- [Learn how Azure Communications Gateway fits into your network](role-in-network.md).
- [Learn about the latest Azure Communications Gateway features](whats-new.md)

---
title: What is Azure Communications Gateway?
description: Azure Communications Gateway provides telecoms operators with the capabilities and network functions required to connect their network to Microsoft Teams through the Operator Connect program.
author: rcdun
ms.author: rdunstan
ms.service: communications-gateway
ms.topic: overview
ms.date: 04/26/2023
ms.custom: template-overview
---

# What is Azure Communications Gateway?

Azure Communications Gateway enables Microsoft Teams calling through the Operator Connect and Teams Phone Mobile programs for your telecommunications network. Azure Communications Gateway is certified as part of the Operator Connect Accelerator program. It provides Voice and IT integration with Microsoft Teams across both fixed and mobile networks.

> [!IMPORTANT]
> You must sign an Operator Connect or Teams Phone Mobile agreement with Microsoft to use this service.

:::image type="complex" source="media/azure-communications-gateway-overview.png" alt-text="Diagram that shows Azure Communications Gateway between Microsoft Phone System and your networks. Your networks can be fixed and/or mobile.":::
    Diagram that shows how Azure Communications Gateway connects to the Microsoft Phone System and to your fixed and mobile networks. Microsoft Teams clients connect to the Microsoft Phone system. Your fixed network connects to PSTN endpoints. Your mobile network connects to Teams Phone Mobile users.
:::image-end:::

Azure Communications Gateway provides advanced SIP, RTP and HTTP interoperability functions (including Teams Certified SBC function) so that you can integrate with Operator Connect and Teams Phone Mobile quickly, reliably and in a secure manner. As part of Microsoft Azure, the network elements in Azure Communications Gateway are fully managed and include an availability SLA. This full management simplifies network operations integration and accelerates the timeline for adding new network functions into production.

## Architecture

Azure Communications Gateway acts as the edge of your network, ensuring compliance with the requirements of the Operator Connect and Teams Phone Mobile programs.

:::image type="content" source="media/azure-communications-gateway-redundancy.png" alt-text="Diagram that shows Azure Communications Gateway connecting to Microsoft Phone System and operator networks. The details follow the diagram.":::

To ensure availability, Azure Communications Gateway is deployed into two Azure Regions within a given Geography. It supports both active-active and primary-backup geographic redundancy models to fit with your network design.

Connectivity between your network and Azure Communications Gateway must meet the Microsoft Teams _Network Connectivity Specification_. Azure Communications Gateway supports Microsoft Azure Peering Service (MAPS) for connectivity to on-premises environments, in line with this specification.

The sites in your network must have cross-connects between them. You must also set up your routing so that each site in your deployment can route to both Azure Regions.

Traffic from all enterprises shares a single SIP trunk, using a multi-tenant format. This multi-tenant format ensures the solution is suitable for both the SMB and Enterprise markets.

> [!IMPORTANT]
> Azure Communications Gateway doesn't store/process any data outside of the Azure Regions where you deploy it.

## Voice features

Azure Communications Gateway supports the SIP and RTP requirements for Teams Certified SBCs. It can transform call flows to suit your network with minimal disruption to existing infrastructure.

Azure Communications Gateway's voice features include:

- **Optional direct peering to Emergency Routing Service Providers (US only)** - If your network can't transmit Emergency location information in PIDF-LO (Presence Information Data Format Location Object) SIP bodies, Azure Communications Gateway can connect directly to your chosen Teams-certified Emergency Routing Service Provider (ERSP) instead. See [Emergency calling with Azure Communications Gateway](emergency-calling.md).
- **Voice interworking** - Azure Communications Gateway can resolve interoperability issues between your network and Microsoft Teams. Its position on the edge of your network reduces disruption to your networks, especially in complex scenarios like Teams Phone Mobile where Teams Phone System is the call control element. Azure Communications Gateway includes powerful interworking features, for example:

  - 100rel and early media inter-working
  - Downstream call forking with codec changes
  - Custom SIP header and SDP manipulation
  - DTMF (Dual-Tone Multi-Frequency tones) interworking between inband tones, RFC2833 telephone event and SIP INFO/NOTIFY signaling
  - Payload type interworking
  - Media transcoding
  - Ringback injection
- **Call control integration for Teams Phone Mobile** - Azure Communications Gateway includes an optional IMS Application Server called Mobile Control Point (MCP). MCP ensures calls are only routed to the Microsoft Phone System when a user is eligible for Teams Phone Mobile services. This process minimizes the changes you need in your mobile network to route calls into Microsoft Teams. For more information, see [Mobile Control Point in Azure Communications Gateway for Teams Phone Mobile](mobile-control-point.md).

## API features

Azure Communications Gateway includes optional API integration features. These features can help you to speed up your rollout and monetization of Teams Calling support.

### Number Management Portal

Operator Connect and Teams Phone Mobile require API integration between your IT systems and Microsoft Teams for flow-through provisioning and automation. After your deployment has been certified and launched, you must not use the Operator Connect portal for provisioning. You can use Azure Communications Gateway's Number Management Portal instead. This Azure portal feature enables you to pass the certification process and sell Operator Connect or Teams Phone Mobile services while you carry out a custom API integration project.

The Number Management Portal is available as part of the optional API Bridge feature.

> [!TIP]
> The Number Management Portal does not allow your enterprise customers to manage Teams Calling. For example, it does not provide self-service portals.

### CallDuration upload

Azure Communications Gateway can use the Operator Connect APIs to upload information about the duration of individual calls into the Microsoft Teams environment. This allows Microsoft Teams clients to display the call duration recorded by your network, instead of the call duration recorded by Microsoft Teams. Providing this information to Microsoft Teams is a requirement of the Operator Connect program that Azure Communications Gateway performs on your behalf. 


## Next steps

- [Learn how Azure Communications Gateway fits into your network](interoperability.md).
- [Learn about onboarding to Microsoft Teams and Azure Communications Gateway's Included Benefits](onboarding.md).
- [Prepare to deploy Azure Communications Gateway](prepare-to-deploy.md).

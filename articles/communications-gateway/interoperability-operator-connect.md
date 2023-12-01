---
title: Overview of Operator Connect and Teams Phone Mobile with Azure Communications Gateway
description: Understand how Azure Communications Gateway fits into your fixed and mobile networks and into the Operator Connect and Teams Phone Mobile environments
author: rcdun
ms.author: rdunstan
ms.service: communications-gateway
ms.topic: conceptual
ms.date: 09/01/2023
ms.custom: template-concept
---

# Overview of interoperability of Azure Communications Gateway with Operator Connect and Teams Phone Mobile

Azure Communications Gateway can manipulate signaling and media to meet the requirements of your networks and the Operator Connect and Teams Phone Mobile programs. This article provides an overview of the interoperability features that Azure Communications Gateway offers for Operator Connect and Teams Phone Mobile.

> [!IMPORTANT]
> You must sign an Operator Connect or Teams Phone Mobile agreement with Microsoft to use this service.

## Role and position in the network

Azure Communications Gateway sits at the edge of your fixed line and mobile networks. It connects these networks to the Microsoft Phone System, allowing you to support Operator Connect (for fixed line networks) and Teams Phone Mobile (for mobile networks). The following diagram shows where Azure Communications Gateway sits in your network.

:::image type="complex" source="media/azure-communications-gateway-architecture-operator-connect.svg" alt-text="Architecture diagram for Azure Communications Gateway connecting to fixed and mobile networks" lightbox="media/azure-communications-gateway-architecture-operator-connect.svg":::
    Architecture diagram showing Azure Communications Gateway connecting to the Microsoft Phone System, a fixed line deployment and a mobile IMS core. Azure Communications Gateway contains SBC function, the MCP application server for anchoring Teams Phone Mobile calls and a provisioning API.
:::image-end:::

Calls flow from Microsoft Teams clients through the Microsoft Phone System and Azure Communications Gateway into your network.

## Compliance with Certified SBC specifications

Azure Communications Gateway supports the Microsoft specifications for Certified SBCs for Operator Connect and Teams Phone Mobile. For more information about certification and these specifications, see [Session Border Controllers certified for Direct Routing](/microsoftteams/direct-routing-border-controllers) and the Operator Connect or Teams Phone Mobile documentation provided by your Microsoft representative.

## Call control integration for Teams Phone Mobile

[Teams Phone Mobile](/microsoftteams/operator-connect-mobile-plan) allows you to offer Microsoft Teams call services for calls made from the native dialer on mobile handsets, for example presence and call history. These features require anchoring the calls in Microsoft's Intelligent Conversation and Communications Cloud (IC3), part of the Microsoft Phone System.

The Microsoft Phone System relies on information in SIP signaling to determine whether a call is:

- To a Teams Phone Mobile subscriber.
- From a Teams Phone Mobile subscriber or between two Teams Phone Mobile subscribers.

Your core mobile network must supply this information to Azure Communications Gateway, by using unique trunks or by correctly populating an `X-MS-FMC` header as defined by the Teams Phone Mobile SIP specifications. If you don't have access to these specifications, contact your Microsoft representative or your onboarding team.

Your core mobile network must also be able to anchor and divert calls into the Microsoft Phone System. You can choose from the following options.

- Using Mobile Control Point (MCP) in Azure Communications Gateway. MCP is an IMS Application Server that queries the Teams Phone Mobile Consultation API to determine whether the call involves a Teams Phone Mobile Subscriber. MCP then adds X-MS-FMC headers and updates the signaling to divert the call into the Microsoft Phone System through Azure Communications Gateway. For more information, see [Mobile Control Point in Azure Communications Gateway for Teams Phone Mobile](mobile-control-point.md).
- Deploying an on-premises version of Mobile Control Point (MCP) from Metaswitch. For more information, see the [Metaswitch description of Mobile Control Point](https://www.metaswitch.com/products/mobile-control-point). This version of MCP isn't included in Azure Communications Gateway.
- Using other routing capabilities in your core network to detect Teams Phone Mobile subscribers and route INVITEs to or from these subscribers into the Microsoft Phone System through Azure Communications Gateway.

> [!IMPORTANT]
> If an INVITE has an X-MS-FMC header, the core must not route the call to Microsoft Teams. The call has already been anchored in the Microsoft Phone System.

## SIP signaling

Azure Communications Gateway automatically interworks calls to support the following requirements from Operator Connect and Teams Phone Mobile:

- SIP over TLS
- X-MS-SBC header (describing the SBC function)
- Strict rules on a= attribute lines in SDP bodies
- Strict rules on call transfer handling

You can arrange more interworking function as part of your initial network design or at any time by raising a support request for Azure Communications Gateway. For example, you might need extra interworking configuration for:

- Advanced SIP header or SDP message manipulation
- Support for reliable provisional messages (100rel)
- Interworking between early and late media
- Interworking away from inband DTMF tones
- Placing the unique tenant ID elsewhere in SIP messages to make it easier for your network to consume, for example in `tgrp` parameters

[!INCLUDE [microsoft-phone-system-requires-e164-numbers](includes/communications-gateway-e164-for-phone-system.md)]

[!INCLUDE [communications-gateway-multitenant](includes/communications-gateway-multitenant.md)] By default, traffic for Operator Connect or Teams Phone Mobile contains an X-MS-TenantID header. This header identifies the enterprise that is sending the traffic and can be used by your billing systems.

## RTP and SRTP media

The Microsoft Phone System typically requires SRTP for media. Azure Communications Gateway supports both RTP and SRTP, and can interwork between them. Azure Communications Gateway offers further media manipulation features to allow your networks to interoperate with the Microsoft Phone System.

### Media handling for calls

You must select the codecs that you want to support when you deploy Azure Communications Gateway.

Operator Connect and Teams Phone Mobile require core networks to support ringback tones (ringing tones) during call transfer. Core networks must also support comfort noise. If your core networks can't meet these requirements, Azure Communications Gateway can inject media into calls.

### Media interworking options

Azure Communications Gateway offers multiple media interworking options. For example, you might need to:

- Change handling of RTCP
- Control bandwidth allocation
- Prioritize specific media traffic for Quality of Service

For full details of the media interworking features available in Azure Communications Gateway, raise a support request.

## Number Management Portal for provisioning with Operator Connect APIs

Operator Connect and Teams Phone Mobile require API integration between your IT systems and Microsoft Teams for flow-through provisioning and automation. After your deployment has been certified and launched, you must not use the Operator Connect portal for provisioning. You can use Azure Communications Gateway's Number Management Portal instead. This Azure portal feature enables you to pass the certification process and sell Operator Connect or Teams Phone Mobile services while you carry out a custom API integration project.

The Number Management Portal is available as part of the optional API Bridge feature.

For more information, see [Manage an enterprise with Azure Communications Gateway's Number Management Portal for Operator Connect and Teams Phone Mobile](manage-enterprise-operator-connect.md).

> [!TIP]
> The Number Management Portal does not allow your enterprise customers to manage Teams Calling. For example, it does not provide self-service portals.

## Providing call duration data to Microsoft Teams

Azure Communications Gateway can use the Operator Connect APIs to upload information about the duration of individual calls (CallDuration information) into the Microsoft Teams environment. This information allows Microsoft Teams clients to display the call duration recorded by your network, instead of the call duration recorded by Microsoft Teams. Providing this information to Microsoft Teams is a requirement of the Operator Connect program that Azure Communications Gateway performs on your behalf.

## Compatibility with monitoring requirements

The Azure Communications Gateway service includes continuous monitoring for potential faults in your deployment. The metrics we monitor cover all metrics that operators must monitor as part of the Operator Connect program and include:

- Call quality
- Call errors and unusual behavior (for example, call setup failures, short calls, or unusual disconnections)
- Other errors in Azure Communications Gateway

We'll investigate the potential fault, and determine whether the fault relates to Azure Communications Gateway or the Microsoft Phone System. We might require you to carry out some troubleshooting steps in your networks to help isolate the fault.

## Next steps

- Learn about [monitoring Azure Communications Gateway](monitor-azure-communications-gateway.md).
- Learn about [requesting changes to Azure Communications Gateway](request-changes.md).

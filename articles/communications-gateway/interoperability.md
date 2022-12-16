---
title: Interoperability with Microsoft Operator Connect and Microsoft Teams Phone Mobile
description: #Required; article description that is displayed in search results. 
author: rcdun
ms.author: rdunstan
ms.service: communications-gateway
ms.topic: conceptual
ms.date: 12/07/2022
ms.custom: template-concept
---

# Interoperability of Operator Connect and Teams Phone Mobile with Azure Communications Gateway

Azure Communications Gateway sits at the edge of your network. This position allows it to manipulate signaling and media to meet the requirements of your networks and the Microsoft Phone System. Azure Communications Gateway includes many interoperability settings by default, and you can arrange further interoperability configuration.

## Role and position in the network

Azure Communications Gateway sits at the edge of your fixed line and mobile networks. It connects these networks to the Microsoft Phone System, allowing you to support Operator Connect (for fixed line networks) and Teams Phone Mobile (for mobile networks). The following diagram shows where Azure Communication Gateway sits in your network.

:::image type="content" source="media/azure-communications-gateway-architecture.png" alt-text="Architecture diagram showing Azure Communications Gateway connecting to the Microsoft Phone System, a softswitch in a fixed line deployment and a mobile I M S core. The mobile network also contains an application server for anchoring calls in the Microsoft Phone System." :::

Calls flow from endpoints in your networks through Azure Communications Gateway and the Microsoft Phone System into Microsoft Teams clients. 

Azure Communications Gateway provides all the features of a traditional session border controller (SBC). These features include:

- Signaling interworking features to solve interoperability problems
- Advanced media manipulation and interworking
- Defending against Denial of Service attacks and other malicious traffic
- Ensuring Quality of Service

Azure Communications Gateway also offers dashboards that you can use to monitor key metrics of your deployment.

You must provide the networking connection between Azure Communications Gateway and your core networks. For Teams Phone Mobile, you must also provide a network element that can route calls into the Microsoft Phone System for call anchoring.

### Compliance with Certified SBC specifications

Azure Communications Gateway supports the Microsoft specifications for Certified SBCs for Operator Connect and Teams Phone Mobile. For more information about certification and these specifications, see [Session Border Controllers certified for Direct Routing](/microsoftteams/direct-routing-border-controllers) and
 the Operator Connect or Teams Phone Mobile documentation provided by your Microsoft representative.

### Call control integration for Teams Phone Mobile

Teams Phone Mobile allows you to offer Microsoft Teams call services for calls made from the native dialer on mobile handsets, for example presence and call history. These features require anchoring the calls in Microsoft's Intelligent Conversation and Communications Cloud (IC3), part of the Microsoft Phone System.

The Microsoft Phone System relies on information in SIP signaling to determine whether a call is:
- To a Teams Mobile Phone subscriber.
- From a Teams Mobile Phone subscriber or between two Teams Phone Mobile subscribers.

Your core mobile network must supply this information to Azure Communications Gateway, by using unique trunks or by correctly populating an `X-MS-FMC` header as defined by the Teams Phone Mobile SIP specifications. 

Your core mobile network must also be able to anchor and divert calls into the Microsoft Phone System. You can choose from the following options.

- Deploying an IMS Application Server that queries the Teams Phone Mobile Consultation API to determine whether the call involves a Microsoft Teams Phone Mobile Subscriber. The Application Server then adds X-MS-FMC headers and updates the signaling to divert the call into the Microsoft Phone System through Azure Communications Gateway.
- Using other routing capabilities in your core network to detect Teams Phone Mobile subscribers and route INVITEs to or from these subscribers into the Microsoft Phone System through Azure Communications Gateway.

> [!IMPORTANT]
> If an INVITE has an X-MS-FMC header, the core must not route the call to Microsoft Teams. The call has already been anchored in the Microsoft Phone System.

## SIP signaling

Azure Communications Gateway includes SIP trunks to your own networks. These trunks can interwork between your existing core networks and the requirements of the Microsoft Phone System. For example, Azure Communications Gateway automatically interworks calls to support the following requirements from Operator Connect and Teams Phone Mobile:

- SIP over TLS
- X-MS-SBC header (describing the SBC function)
- Strict rules on a= lines in SDP bodies

You can arrange more interworking function as part of your initial network design or at any time by raising a support request for Azure Communications Gateway. For example, you might need extra interworking configuration for:

- Advanced SIP header or SDP message manipulation
- Support for reliable provisional messages (100rel)
- Interworking between early and late media
- Interworking away from inband DTMF tones

## RTP and SRTP media

The Microsoft Phone System typically requires SRTP for media. Azure Communications Gateway supports both RTP and SRTP, and can interwork between them. Azure Communications Gateway offers further media manipulation features to allow your networks to interoperate with the Microsoft Phone System. 

### Media handling for calls

You must select the codecs that you want to support when you deploy Azure Communications Gateway. If the Microsoft Phone System doesn't support these codecs, Azure Communications Gateway can perform transcoding (converting between codecs) on your behalf.

Operator Connect and Teams Phone Mobile require core networks to support ringback tones (ringing tones) during call transfer. Core networks must also support comfort noise. If your core networks can't meet these requirements, Azure Communications Gateway can inject media into calls.

### Media interworking options

Azure Communications Gateway offers multiple media interworking options. For example, you might need to:

- Change handling of RTCP
- Control bandwidth allocation
- Prioritize specific media traffic for Quality of Service

For full details of the media interworking features available in Azure Communications Gateway, raise a support request.

## Compatibility with monitoring requirements

The Azure Communication Gateway service includes continuous monitoring for potential faults in your deployment. The metrics we monitor include:

- Call quality
- Call errors and unusual behavior (for example, call setup failures, short calls, or unusual disconnections)
- Other errors in Azure Communications Gateway

We'll investigate the potential fault, and determine whether the fault relates to Azure Communications Gateway or the Microsoft Phone System. We may require you to carry out some troubleshooting steps in your networks to help isolate the fault.

Azure Communications Gateway provides service health dashboards that you can use to monitor the overall health of your Azure Communications Gateway deployment. You can also view detailed metrics about calls and Quality of Service. If you notice any concerning metrics on this dashboard, you can raise an Azure Communications Gateway support ticket.

> [!WARNING]
> TODO: Check that this agrees with the monitoring position and the monitoring article.

## Next steps

> [!WARNING]
> TODO: Find links here e.g. raising a ticket for more information. monitoring AzCoG

<!-- Add a context sentence for the following links -->
- [Write concepts](contribute-how-to-write-concept.md)
- [Links](links-how-to.md)


---
title: What is Azure Communications Gateway?
description: Azure Communications Gateway provides Telecoms Operators the capabilities and network functions required to connect their network to Microsoft Teams through the Operator Connect program. #Required; article description that is displayed in search results. 
author: nslack #Required; your GitHub user alias, with correct capitalization.
ms.author: nickslack #Required; microsoft alias of author; optional team alias.
ms.service: communications-gateway
ms.topic: overview #Required; leave this attribute/value as-is.
ms.date: 11/01/2022 #Required; mm/dd/yyyy format.
ms.custom: template-overview #Required; leave this attribute/value as-is.
---
<!--
Remove all the comments in this template before you sign-off or merge to the 
main branch.
-->

<!--
This template provides the basic structure of a service/product overview article.
See the [overview guidance](contribute-how-write-overview.md) in the contributor guide.

To provide feedback on this template contact 
[the templates workgroup](mailto:templateswg@microsoft.com).
-->

<!-- 1. H1
Required. Set expectations for what the content covers, so customers know the 
content meets their needs. H1 format is # What is <product/service>?
-->

# What is Azure Communications Gateway?

<!-- 2. Introductory paragraph 
Required. Lead with a light intro that describes what the article covers. Answer the 
fundamental "why would I want to know this?" question. Keep it short.
-->

Azure Communications Gateway enables Microsoft Teams calling through the Operator Connect and Teams Phone Mobile programs for your telecommunications network. Azure Communications Gateway is certified as part of the Operator Connect Accelerator program. It provides Voice and IT integration with Microsoft Teams across both fixed and mobile networks.

> [!IMPORTANT]
> You must sign an Operator Connect or Teams Phone Mobile agreement with Microsoft to use this service.

:::image type="content" source="media/azure-communications-gateway-overview.png" alt-text="Azure Communications Gateway connects to the Microsoft Phone System and to your fixed and mobile networks. Microsoft Teams clients connect to the Microsoft Phone system. Your networks connect to P S T N endpoints and to Teams Phone Mobile users.":::

Azure Communications Gateway provides advanced SIP, RTP and HTTP interoperability functions (including Teams Certified SBC function) so that you can integrate with Operator Connect and Teams Phone Mobile quickly, reliably and in a secure manner. As part of Microsoft Azure, the network elements in Azure Communications Gateway are fully managed and include an availability SLA. This full management simplifies network operations integration and accelerates the timeline for adding new network functions into production.

## Architecture 

Azure Communications Gateway acts as the edge of your network, ensuring compliance with the requirements of the Operator Connect and Teams Phone Mobile programs.

:::image type="content" source="media/azure-communications-gateway-redundancy.png" alt-text="Azure Communications Gateway deployment diagram showing Azure resources in two regions connecting to the Microsoft Phone System and operator networks. The details are described after the diagram.":::

To ensure availability, Azure Communications Gateway is deployed into two Azure Regions within a given Geography. It supports both active-active and primary-backup geographic redundancy models to fit with your network design.

Connectivity between your network and Azure Communications Gateway must meet the Microsoft Teams _Network Connectivity Specification_. Azure Communications Gateway supports Microsoft Azure Peering Service (MAPS) for connectivity to on-premises environments, in line with this specification.

The sites in your network must have cross-connects between them. You must also set up your routing so that each site in your deployment can route to both Azure Regions.

Traffic from all enterprises shares a single SIP trunk, using a multi-tenant format. This multi-tenant format ensures the solution is suitable for both the SMB and Enterprise markets.

## Voice features

Azure Communications Gateway supports the SIP and RTP requirements for Teams Certified SBCs. It can transform call flows to suit your network with minimal disruption to existing infrastructure. Its voice features include:
* **Optional direct peering to Emergency Routing Service Providers (US only)** - If your network can't transmit Emergency location information in PIDF-LO (Presence Information Data Format Location Object) SIP bodies, Azure Communications Gateway can connect directly to your chosen Teams-certified Emergency Routing Service Provider (ERSP) instead.
* **Voice interworking** - Azure Communications Gateway can resolve interoperability issues between your network and Microsoft Teams. Its position on the edge of your network reduces disruption to your networks, especially in complex scenarios like Teams Phone Mobile where Teams Phone System is the call control element. Azure Communications Gateway includes powerful interworking features, for example:
  * 100rel and early media inter-working
  * Downstream call forking with codec changes
  * Custom SIP header and SDP manipulation
  * DTMF (Dual-Tone Multi-Frequency tones) interworking between inband tones, RFC2833 telephone event and SIP INFO/NOTIFY signaling
  * Payload-type inter-working
  * Media transcoding
  * Ringback injection


## API features

Azure Communications Gateway includes optional API integration features. These features can help you to:
* Adapt your existing systems to meet the requirements of the Operator Connect and Teams Phone Mobile programs with minimal disruption.
* Provide a consistent look and feel across your Operator Connect and Teams Phone Mobile offerings and the rest of your portfolio.
* Speed up your rollout and monetization of Teams Calling support.

### CallDuration upload 

The Operator Connect specifications require the Call Duration Records produced by Microsoft Teams to match billing information from your network. You must therefore push Call Duration data into the Microsoft Teams environment. Azure Communications Gateway can push this data for you and supports customizable rounding of call duration figures to match your billing systems.

### Swivel-chair portal

Operator Connect and Teams Phone Mobile require API integration between your IT systems and Microsoft Teams for flow-through provisioning and automation. After your deployment has been certified and marked as generally available (GA), you must not use the Operator Connect portal for provisioning. You can use Azure Communication Gateway's swivel-chair portal instead. This portal enables you to pass the certification process and sell Operator Connect or Teams Phone Mobile services while you carry out a custom API integration project

The swivel-chair portal is available as part of the optional API Bridge feature.

> [!TIP]
> The swivel-chair portal does not allow your enterprise customers to manage Teams Calling. For example, it does not provide self-service portals.

### API mediation

Azure Communications Gateway's API Bridge feature includes a flexible custom interface to the Operator Connect APIs. Microsoft Professional Services can create REST or SOAP APIs that adapt the Teams Operator Connect API to your networks' requirements for APIs. These custom APIs can reduce the size of an IT integration project by reducing the changes required in your existing infrastructure.

The API mediation function is designed to map between CRM and BSS systems in your network and the Teams Operator Connect API. Your CRM and BSS systems must be able to handle the information required by Teams Operator Connect. You must work with Microsoft to determine whether you can use the API mediation feature and to scope the project.

## Next steps
@@@ get the links working
- [Plan for Operator Connect](links-how-to.md)
- [Plan for Teams Phone mobile](links-how-to.md)
- [Deploy Azure Communications Gateway](contribute-how-to-write-overview.md)

<!--
Remove all the comments in this template before you sign-off or merge to the 
main branch.
-->
---
title: What is Azure Voice Bridge?
description: Azure Voice Bridge provides Telecoms Operators the capabilities and network functions required to connect their network to Microsoft Teams through the Operator Connect program. #Required; article description that is displayed in search results. 
author: nslack #Required; your GitHub user alias, with correct capitalization.
ms.author: nickslack #Required; microsoft alias of author; optional team alias.
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

# What is Azure Voice Bridge?

<!-- 2. Introductory paragraph 
Required. Lead with a light intro that describes what the article covers. Answer the 
fundamental “why would I want to know this?” question. Keep it short.
-->

Azure Voice Bridge enables your telecommunications network for Microsoft Teams calling through the Operator Connect and Teams Phone Mobile programs. Azure Voice Bridge is certified as part of the Operator Connect accelerator program and provides Voice and IT integration with Microsoft Teams across both fixed and mobile networks.

> [!IMPORTANT]
> You must have signed an Operator Connect or Teams Phone Mobile agreement with Microsoft to use this service.  

@@network level architecture diagram (needs to include functional components)

Azure Voice Bridge provides highly evolved SIP, RTP and HTTP interoperability functions (including Teams certified SBC function) to ensure that your integrations to Operator Connect and Teams Phone Mobile are delivered quickly, reliably and in a secure manner. As part of Microsoft Azure, the network elements delivered by Azure Voice Bridge are fully managed and provided with an availability SLA, removing the requirement for deep network operations integration, vastly accelerating the timeline for adding new network functions into production. 

## Architecture 
@@@ insert architecture diagram describing geo-redundancy here

Azure Voice Bridge acts as the edge of your network, ensuring compliance with the requirements of the Operator Connect and Teams Phone Mobile programs. To ensure availability, Azure Voice Bridge is deployed into two Azure Regions within a given Geography and supports both active-active and primary-backup geographic redundancy models to fit with your network design. 

Connectivity between your network and Azure Voice Bridge must be in line with the Teams Network Connectivity Specification, and both MAPS and ExpressRoute are supported options to ensure availability and voice quality. The SIP connectivity is provided in a multi-tenant format (traffic from all enterprises shares the same SIP trunk), which enables true scalability and unlocks the potential of Operator Connect to address the SMB market.  

## Voice features
<!-- add your content here -->
As well as meeting the requirements for SIP and RTP protocol support mandated for Teams Certified SBCs, the Azure Voice Bridge allows you to transform call flows to suit your network with minimal disruption to existing infrastructure. Features include: 
* **Optional direct peering to Emergency Routing Service Providers (US only)** - If your network does not support the transmission of Emergency location information in PIDF-LO (Presence Information Data Format Location Object) SIP bodies, Azure Voice Bridge can be configured to connect directly to the Teams certified Emergency Routing Service Provider of your choice.
* **Voice inter-working** - As the interconnect point between your network and Teams, Azure Voice Bridge is well placed to resolve any integration issues between the two voice estates. This is particularly critical for Teams Phone Mobile where Teams Phone System is acting as the call control element, and as such its integration into the IMS core can be complex. Obtaining a powerful interworking layer such as Azure Voice Bridge is critical to ensure the timely rollout of Teams Phone Mobile. Azure Voice Bridge can be configured to support the following  inter-working features: 
  * 100rel and early media inter-working 
  * downstream call forking with codec changes 
  * custom SIP header and SDP manipulation
  * DTMF (Dual-Tone Multi-Frequency tones) inter-working between inband tones, RFC2833 telephone event and SIP INFO/NOTIFY signalling 
  * Payload-type inter-working 
  * Media transcoding 
  * Ringback injection 

## API features
In addition to voice functionality, Azure Voice Bridge includes several optional API integration features to help accelerate your time to market with Teams Calling. These features are designed to allow your network to meet the requirements of the Operator Connect and Teams Phone Mobile programs with minimal disruption and without replacing existing systems. This results in rapid monetization and ensures your Operator Connect and Teams Phone Mobile offerings have the same look and feel to customers as the rest of your portfolio. 

@@@API integration diagram here. 

### CallDuration upload 
In order to achieve compliance with the Teams Operator Connect specifications you must push Call Duration data into the Teams environment such that Call Duration Records produced by Teams match any billing information produced by your network. Azure Voice Bridge can perform this function on your behalf and supports customizable rounding of call duration figures to match your billing systems. 

### Swivel chair portal 
Teams Operator Connect and Teams Phone Mobile both require API integration between your IT systems and Teams to ensure flow-through provisioning and automation. As such, the use of the Operator Connect portal is forbidden for provisioning actions once you have been marked as GA in the Teams Admin Centre. To enable you to pass the certification process and achieve GA to begin selling Operator Connect or Teams Phone Mobile services, Azure Voice Bridge provides a swivel-chair portal which can be used to drive the Teams APIs whilst an IT integration project is completed. The Swivel Chair portal does not provide any customer-facing functionality (e.g. self-service portals) and is designed purely for Operator staff to meet the requirements of the Operator Connect program.

### API mediation 
The API Mediation function provides an alternative integration point for your IT systems to the Teams Operator Connect API. It provides a flexible, configurable interface and as such can reduce the size of an IT integration project by reducing the changes required in already deployed infastructure. It comes with pre-built integration with the Teams Operator Connect API and offers a library of existing integrations that can be leveraged by Microsoft Professional Services to create an API that matches whatever your network is best placed to consumed. This can be custom REST APIs as well as SOAP APIs. 

The API mediation function is designed to map between CRM and BSS systems in the Operators’ network and the Teams Operator Connect API. As such, the existing CRM and BSS systems must be capable of handling the information required by Teams Operator Connect to be suitable for use alongside the API Mediation function. This will be determined as part of scoping the API integration services. 


## Next steps
@@@ get the links working
- [Plan for Operator Connect](links-how-to.md)
- [Plan for Teams Phone mobile](links-how-to.md)
- [Deploy Azure Voice Bridge](contribute-how-to-write-overview.md)

<!--
Remove all the comments in this template before you sign-off or merge to the 
main branch.
-->

---
title: European Union Data Boundary compliance for Azure Communication Services
titleSuffix: An Azure Communication Services article
description: This article describes how Azure Communication Services meets European Union data handling compliance laws
author: sloanster
services: azure-communication-services

ms.author: micahvivion
ms.date: 08/25/2025
ms.topic: conceptual
ms.service: azure-communication-services
ms.custom: references_regions
---

# European Union Data Boundary (EUDB) support in Azure Communication Services
Azure Communication Services meets the European Union Data Boundary (EUDB) requirements, as detailed [here](https://blogs.microsoft.com/eupolicy/2022/12/15/eu-data-boundary-cloud-rollout/). EUDB ensures customer and personal data for Azure Communication Services is stored and processed only within EU and EFTA regions. This helps organizations comply with GDPR, supports digital sovereignty, and reduces the risk of non-EU access to sensitive data.

## Understanding more about the needs of this compliance requirement.
For organizations using Azure Communication Services (ACS), EUDB compliance enables developers to integrate voice, video, chat, SMS, and email capabilities into their applications and be able to deliver EUDB compliance. Azure Communication Services ensures that customer content, personal data, and system-generated logs are stored and processed exclusively within EU/EFTA data centers. This includes data exchanged during real-time communications, metadata associated with those interactions, and diagnostic logs that support service reliability and performance. By meeting EUDB requirements, Azure Communication Services empowers European businesses to build communication solutions with confidence that their data remains protected and sovereign. For more details Microsoft’s commitment to ensure compliance with European Union Data Boundary (EUDB) mandates please see [here](https://blogs.microsoft.com/eupolicy/2022/12/15/eu-data-boundary-cloud-rollout/).

The EU Data Boundary consists of the countries/regions in the European Union (EU) and the European Free Trade Association (EFTA). The EU countries/regions are: Austria, Belgium, Bulgaria, Croatia, Cyprus, Czechia, Denmark, Estonia, Finland, France, Germany, Greece, Hungary, Ireland, Italy, Latvia, Lithuania, Luxembourg, Malta, Netherlands, Poland, Portugal, Romania, Slovakia, Slovenia, Spain, and Sweden. The EFTA countries/regions are: Liechtenstein, Iceland, Norway, and Switzerland. This boundary defines data residency and processing rules for resources based on the data location selected when creating a new communication resource. When a data location for a resource is one of the European countries/regions in scope of EUDB, then all processing and storage of personal data remain within the European Union.

## Calling

To establish how Azure Communication Services calling data aligns with EUDB compliance, it's important to first define key details about how calling data is processed—particularly in scenarios involving various types of participants:
- **Organizer**: responsible for creating and managing a group call or meeting session. They are the person that sets the meeting identity.
- **Initiator**: the first person who joins the meeting
- **Guest**: a participant who isn't a member of the tenant of the Organizer. May include a member of a different tenant or a PSTN (dial-in) user.
- **Call**: refers to a 1:1 call and\or to a Group call to a larger group.
- **Real Time Text (RTT)**: is an accessibility compliance requirement for voice and video platforms in the EU. For more information, see: [Directive 2019/882](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32019L0882).
- **Resource**: refers to a provisioned communication identity or endpoint. See [here](../quickstarts/create-communication-resource.md?tabs=windows&pivots=platform-azp#manage-your-communication-services-resource) for more details

For Azure Communication Services calling resources that were defined to be located within a European data boundary country\regiion and when either the organizer, initiator, or a guest joins a call from a location inside the European boundary, all personal data (PII) is processed and stored in facilities within EU boundary countries/regions. 

## SMS

Azure Communication Services guarantees that SMS data within the EUDB is stored in EUDB regions. As of today, we process and store data in the Netherlands, Ireland, or Switzerland regions, ensuring no unauthorized data transfer outside the EEA (European Economic Area). 
Also, Azure Communication Services employs advanced security measures, including encryption, to protect SMS data both at rest and in transit. Customers can select their preferred data residency within the EUDB, making sure data remains within the designated EU regions. 

> [!NOTE]
> Azure Communication Services is regulated in the EU and UK as a provider of interpersonal communications services (ICS). Azure Communication Services complies with rules and regulations applicable to ICS in the EU and UK, as established in each Member State's national laws, including licensing or registration, annual revenue and statistical reporting, regulatory fees, security, telecommunications secrecy, CLI restrictions, data retention, anti-spam and anti-fraud measures, among many others.

#### SMS EUDB FAQ

**What happens with SMS data in the UK?** 

While the UK is no longer part of the EU, Azure Communication Services processes data for the UK within the EUDB. As of today, data processing and storage occur within the Netherlands, Ireland, or Switzerland regions, maintaining compliance with EU regulations. 

**What happens when an SMS recipient is outside the EU?** 

If an SMS recipient is outside the EU, the core data processing and storage remain within the EUDB (Netherlands, Ireland, or Switzerland regions). However, for the SMS to be delivered, it may be routed through networks outside the EU, depending on the recipient's location and carrier, which is necessary for successful message delivery. 

**Can data be transferred to non-EU regions under any circumstances?** 

Yes, to deliver SMS to recipients outside the EU, some data routing may occur outside the EUDB. This routing is strictly for message delivery purposes. Data processing and storage at rest still comply with the EUDB regulations. 


## Messaging

All threads created from an EU resource process and store personal data in the EU. 


## Related articles

For more information, see [Microsoft EU Data Boundary Overview](https://www.microsoft.com/en-us/trust-center/privacy/european-data-boundary-eudb).

---
title: European Union Data Boundary compliance for Azure Communication Services
description: Learn about how Azure Communication Services meets European Union data handling compliance laws
author: hrazi
manager: mharbut
services: azure-communication-services

ms.author: harazi
ms.date: 02/01/2023
ms.topic: conceptual
ms.service: azure-communication-services
ms.custom: references_regions
---

# European Union Data Boundary (EUDB)

Azure Communication Services complies with European Union Data Boundary (EUDB) [announced by Microsoft Dec 15, 2022](https://blogs.microsoft.com/eupolicy/2022/12/15/eu-data-boundary-cloud-rollout/). 

This boundary defines data residency and processing rules for resources based on the data location selected when creating a new communication resource. When a data location for a resource is one of the European countries/regions in scope of EUDB, then all processing and storage of personal data  remain within the European Union. The EU Data Boundary consists of the countries/regions in the European Union (EU) and the European Free Trade Association (EFTA). The EU countries/regions are Austria, Belgium, Bulgaria, Croatia, Cyprus, Czechia, Denmark, Estonia, Finland, France, Germany, Greece, Hungary, Ireland, Italy, Latvia, Lithuania, Luxembourg, Malta, Netherlands, Poland, Portugal, Romania, Slovakia, Slovenia, Spain, and Sweden; and the EFTA countries/regions are Liechtenstein, Iceland, Norway, and Switzerland.

## Calling

Calls and meetings can be established in various ways by various users.  We define a few terms:
- Organizer: person who created the meeting, for example, set it up using Outlook
- Initiator: the first person who joins the meeting (the meeting only exists as a calendar item before the first person joins it)
- Guest: a participant who isn't a member of the tenant of the Organizer.  May include a member of a different tenant, PSTN (dial-in) user, etc. (Note that this use of Guest is specific to this description and broader than used within IC3 generally, but useful for the discussion here)
- Call: refers to a 1:1 call and\or to a Group call to a larger group.  For the purposes of this conversation, they should be the same.
- Real Time Text: RTT is an accessibility compliance requirement for voice and video platforms in the EU. You can find more information about this here: [Directive 2019/882](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32019L0882)

For EU communication resources, when the organizer, initiator, or guests join a call from the EU, processing and storage of personal data will be limited to the EU.

## SMS

Azure Communication Services guarantees that SMS data within the EUDB is stored in EUDB regions. As of today, we process and store data in the Netherlands, Ireland or Switzerland regions, ensuring no unauthorized data transfer outside the EEA (European Economic Area).  
Also, Azure Communication Services employs advanced security measures, including encryption, to protect SMS data both at rest and in transit. Customers can select their preferred data residency within the EUDB, making sure data remains within the designated EU regions. 

#### SMS EUDB FAQ

**What happens with SMS data in the UK?** 

While the UK is no longer part of the EU, Azure Communication Services processes data for the UK within the EUDB. As of today, data processing and storage occur within the Netherlands, Ireland or Switzerland regions, maintaining compliance with EU regulations.  

**What happens when an SMS recipient is outside the EU?** 

If an SMS recipient is outside the EU, the core data processing and storage remain within the EUDB (Netherlands, Ireland or Switzerland regions). However, for the SMS to be delivered, it may be routed through networks outside the EU, depending on the recipient's location and carrier, which is necessary for successful message delivery. 

**Can data be transferred to non-EU regions under any circumstances?** 

Yes, to deliver SMS to recipients outside the EU, some data routing may occur outside the EUDB, but this is strictly for message delivery purposes. Data processing and storage at rest still comply with the EUDB regulations. 


## Messaging

All threads created from an EU resource will process and storage personal data in the EU. 


## Other resources

For more information, please refer to the Microsoft documentation on the EUDB:
- [Microsoft EU Data Boundary Overview](https://www.microsoft.com/en-us/trust-center/privacy/european-data-boundary-eudb)

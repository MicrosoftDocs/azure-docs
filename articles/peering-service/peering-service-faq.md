---
title: Microsoft Azure Peering Service | Microsoft Docs
description: Learn about Microsoft Azure Peering Service
services: peering-service
author: ypitsch
manager: 
ms.service: peering-service
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 
ms.author: ypitsch
---

# Peering Service FAQ

**Q0: Who are the target customers?**

A0. Enterprises who connect to Microsoft Cloud using Internet as transport.

**Q1: How can customers enable MAPS?**
 	
Customer does pre-sales research and selects a carrier on business and operational needs 
 	Customer buys/enables the right service from partner 
 	Customer notifies Microsoft of carrier selection and signs up for MAPS 
 	Microsoft and partner work together to turn on end-to-end service for the customer 
 	Customer can select a globally preferred ISP. Whenever that ISP is qualified as a MAPS partner for a given geographical region, Microsoft and ISP will automatically turn MAPS service for the customer sites in that region. 
 	Additionally, customer can overwrite and optimize MAPS ISP per geographical region. 
 	Customer can signup for MAPS using two or more ISP in any geographical region. In such cases customer will buy internet-service from these ISPs.

**Q2. From ISP perspective, what is the benefit for selling Microsoft MAPS to customer?**

A2. For starters if a carrier already has PNI with Microsoft then they can highlight this investment and start monetizing it for use cases such as O365 access, branch office connectivity to Microsoft etc. Next, carrier can use this to build IP connectivity product and services. For example carrier can bundle their SD-WAN services, their virtualized DMZ, UTM, etc. 

**Q3. From customer perspective, what is the benefit for buying Microsoft MAPS from ISP?** 

A3. The number one, benefit for customer is that they are assured that they are accessing Microsoft using a carrier which has well established connectivity with Microsoft and the carrier is following Microsoft connectivity guidelines. Many times customer request us to recommend carriers, or in some cases they request to peer directly. Peering directly has risk to both customer network and to Microsoft. By choosing a MAPS partner they are assured that they are choosing market leaders in their region.
 
**Q4: What is the billing model?**
A4. 
• Partner ISP • Partner bills customer for their product and service 
• Microsoft • Microsoft bills customer for their products and service 
• Networking data transfer bill
• There is no networking data transfer bill for Microsoft SaaS (e.g. O365) 

**Q5: The ISP already offers SLA and enterprise grade Internet – how is this offering different?** 

A5. Some ISP offer SLA and enterprise grade Internet on their part of the network. In MAPS, Microsoft will offer SLA offer traffic on Microsoft part of the network. By selecting MAPS customer will get end-to-end SLA. SLA from their site to Microsoft edge on ISP network can be covered by the ISP. SLA in Microsoft Global Network from Microsoft edge to end user’s application is now covered by Microsoft. 

**Q6. What sort of SLA Microsoft is planning to offer?**

•	Network availability – 99.95% 
•	Packet delivery guarantee – 99.9% 

**Q7. Can a customer select unique ISP for their sites per geographical region?**

A6. Yes, customer can do so. They can select the ISP per region that suits their business and operational needs. 

**Q7. Can a customer have more than one ISP as part of MAPS connectivity for a site?**

A6. Yes. The customer must buy internet connectivity from these ISPs.

**Q8. Can a carrier using their existing PNIs with Microsoft to support MAPS?**

A8. Yes, a carrier can leverage its existing PNI to support MAPS service. A MAPS PNI requires diversity to support HA. If existing PNI already has diversity, then no new infrastructure is required. If existing PNI needs diversity, then it can be augmented.

**Q9. Can a carrier use new PNI with Microsoft to support MAPS?**

A9. Yes, that also possible. Microsoft will work with Carrier to create new PNIs to support MAPS.

**Q10. What are the diversity requirements on a PNI to support MAPS?**

A10. A PNI must support local-redundancy and geo-redundancy. Local-redundancy is defined as two diverse set of paths in a particular peering site. Figure 5 provides the details. Geo-redundancy requires that Carrier has additional connectivity at a different Microsoft edge site in case the primary site fails. Figure 6 provides an example of Geo-redundancy. In case connectivity at site A fails, the carrier can carry the MAPS traffic to Microsoft through site B or C. For the short failure duration carrier can route traffic through site B and C. For the short failure duration carrier can route traffic through site B and C. Although there might be a latency degradation but connectivity with the users will be alive.

**Q11. What is the difference Internet peering and Microsoft MAPS?**

A11. MAPS is a service that intends to provide enterprise grade public IP connectivity to Microsoft for its enterprise customers. Enterprise grade Internet includes SLA, connectivity through ISPs that have high throughput pipes to Microsoft and redundancy for a Microsoft Confidential 6 Microsoft Confidential. © 2018 Microsoft Corporation. All rights reserved. These materials are confidential to and maintained as a trade secret by Microsoft Corporation. Information in these materials is restricted to Microsoft authorized recipients only.
HA connectivity. Additionally, user traffic is optimized for latency to the nearest Microsoft edge. MAPS builds on peering connectivity with partner carrier. The peering connectivity with partner must be PNI as opposed to public peering. PNI must have local and geo-redundancy. More on local and geo-redundancy is explained in the document.

**Why is PNI a requirement to support MAPS?**

A12. One of primary drivers behind MAPS is to provide connectivity to Microsoft online services through a well-connected SP. The throughput of public peering connectivity between a carrier and Microsoft can be as low as in mbps range. However, PNI are always in gbps range and hence a fundamental building block for high throughput connectivity between carrier and Microsoft. Moreover, public peering involves a shared connectivity which is the IX (internet exchange) fabric. The shared connectivity makes the SLA model more difficult and is also less secure as one more additional network is involved between customer and Microsoft. 

**Q13. If a service provider already peers with Microsoft using PNI then what kind of changes are required to support MAPS?**

A13.
• Software changes to identify a MAPS user and its traffic. May require routing policy changes to exchange a user’s traffic at the nearest Microsoft edge through MAPS connectivity. 
• Ensure the connectivity has local-redundancy as described in Figure 5 and geo-redundancy as described in Figure 6.

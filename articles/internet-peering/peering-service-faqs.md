---
title: Peering Service - FAQ
description: Peering Service - FAQ
services: internet-peering
author: prmitiki
ms.service: internet-peering
ms.topic: reference
ms.date: 11/27/2019
ms.author: prmitiki
---

# Peering Service - FAQs

<!--
Who are the target customers?
Enterprises who connect to Microsoft Cloud using Internet as transport.
-->
<!--
Q1: How can customers enable Peering Service?
A1. 

1.	Customer does pre-sales research and selects a carrier on business and operational needs
2.	Customer buys/enables the right service from partner
3.	Customer notifies Microsoft of carrier selection and signs up for Peering Service
4.	Microsoft and partner work together to turn on end-to-end service for the customer
�	Customer can select a globally preferred ISP. Whenever that ISP is qualified as a Peering Service partner for a given geographical region, Microsoft and ISP will automatically turn Peering Service service for the customer sites in that region.
�	Additionally, customer can overwrite and optimize Peering Service ISP per geographical region. 
�	Customer can signup for Peering Service using two or more ISP in any geographical region. In such cases customer will buy internet-service from these ISPs.  
-->
<!--
Q2. From ISP perspective, what is the benefit for selling Peering Service to customer?
A2. For starters if a carrier already has PNI with Microsoft then they can highlight this investment and start monetizing it for use cases such as O365 access, branch office connectivity to Microsoft etc. Next, carrier can use this to build IP connectivity product and services. For example carrier can bundle their SD-WAN services, their virtualized DMZ, UTM, etc.
-->

<!--
Q3. From customer perspective, what is the benefit for buying Peering Service from ISP?
A3. The number one, benefit for customer is that they are assured that they are accessing Microsoft using a carrier which has well established connectivity with Microsoft and the carrier is following Microsoft connectivity guidelines. Many times customer request us to recommend carriers, or in some cases they request to peer directly. Peering directly has risk to both customer network and to Microsoft. By choosing a Peering Service partner they are assured that they are choosing market leaders in their region. 
-->

<!--
Q4: What is the billing model?
A4. 

�	Partner ISP
�	Partner bills customer for their product and service
�	Microsoft
�	Microsoft bills customer for their products and service
�	Networking data transfer bill
�	There is no networking data transfer bill for Microsoft SaaS (e.g. O365)

-->

**What is the difference between Peering and Peering Service?**

Peering Service is a service that intends to provide enterprise grade public IP connectivity to Microsoft for its enterprise customers. 
Enterprise grade Internet includes SLA, connectivity through ISPs that have high throughput connectivity to Microsoft and redundancy for a HA connectivity. 
Additionally, user traffic is optimized for latency to the nearest Microsoft edge. 
Peering Service builds on peering connectivity with partner carrier. 
The peering connectivity with partner must be PNI as opposed to public peering. PNI must have local and geo-redundancy. 

**Can a carrier using their existing Direct Peering with Microsoft to support Peering Service?**

Yes, a carrier can leverage its existing PNI to support Peering Service. A Peering Service PNI requires diversity to support HA. If existing PNI already has diversity, then no new infrastructure is required. If existing PNI needs diversity, then it can be augmented.

**Can a carrier use new Direct Peering with Microsoft to support Peering Service?**

Yes, that is also possible. Microsoft will work with Carrier to create new PNIs to support Peering Service.  

**Why is Direct Peering a requirement to support Peering Service?**

One of primary drivers behind Peering Service is to provide connectivity to Microsoft online services through a well-connected SP. PNI are always in gbps range and hence a fundamental building block for high throughput connectivity between carrier and Microsoft.   

**What are the diversity requirements on a Direct Peering to support Peering Service?**

A PNI must support local-redundancy and geo-redundancy. Local-redundancy is defined as two diverse set of paths in a particular peering site. Geo-redundancy requires that Carrier has additional connectivity at a different Microsoft edge site in case the primary site fails. For the short failure duration carrier can route traffic through the backup site. 

**The carrier already offers SLA and enterprise grade Internet, how is this offering different?**

Some carriers offer SLA and enterprise grade Internet on their part of the network. In Peering Service, Microsoft will offer SLA offer traffic on Microsoft part of the network. By selecting Peering Service customer will get end-to-end SLA. SLA from their site to Microsoft edge on ISP network can be covered by the ISP. SLA in Microsoft Global Network from Microsoft edge to end users application is now covered by Microsoft.   

**What sort of SLA Microsoft is planning to offer?**

Network availability of 99.95%
<!--�	Packet delivery guarantee � 99.9%-->

<!--**How is Peering Service partnership different from peering with Microsoft?**
Peering Service builds on top of regular peering infrastructure with Microsoft. From Peering Infrastructure perspective, these peering must be PNI, must have local redundancy and geo-redundancy. �Local-redundancy is  at least two diverse set of paths in a particular peering site. Geo-redundancy means there are additional connectivity to a different Microsoft edge site in case the primary site fails. 
From routing perspective Carrier will optimize the RTT from users location to the nearest possible Microsoft edge.  
-->

<!--
Can a customer select unique ISP for their sites per geographical region?
A6. Yes, customer can do so. They can select the ISP per region that suits their business and operational needs. 
-->

<!--
Q7. Can a customer have more than one ISP as part of Peering Service connectivity for a site?
A6. Yes. The customer must buy internet connectivity from these ISPs.
-->

**If a service provider already peers with Microsoft using PNI then what kind of changes are required to support Peering Service?** 

*	Software changes to identify a Peering Service user and its traffic. May require routing policy changes to exchange a user's traffic at the nearest Microsoft edge through Peering Service connection.
*	Ensure the connectivity has local-redundancy and geo-redundancy.


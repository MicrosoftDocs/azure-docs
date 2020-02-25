---
title: Peering Service - FAQ
titleSuffix: Azure
description: Peering Service - FAQ
services: internet-peering
author: prmitiki
ms.service: internet-peering
ms.topic: reference
ms.date: 11/27/2019
ms.author: prmitiki
---

# Peering Service - FAQs

You may review information below for general questions.

**Can a carrier using their existing Direct peering with Microsoft to support Peering Service?**

Yes, a carrier can leverage its existing PNI to support Peering Service. A Peering Service PNI requires diversity to support HA. If existing PNI already has diversity, then no new infrastructure is required. If existing PNI needs diversity, then it can be augmented.

**Can a carrier use new Direct peering with Microsoft to support Peering Service?**

Yes, that is also possible. Microsoft will work with Carrier to create new Direct peering to support Peering Service.  

**Why is Direct peering a requirement to support Peering Service?**

One of primary drivers behind Peering Service is to provide connectivity to Microsoft online services through a well-connected SP. PNI are always in Gbps range and hence a fundamental building block for high throughput connectivity between carrier and Microsoft.

**What are the diversity requirements on a Direct peering to support Peering Service?**

A PNI must support local-redundancy and geo-redundancy. Local-redundancy is defined as two diverse set of paths in a particular peering site. Geo-redundancy requires that Carrier has additional connectivity at a different Microsoft edge site in case the primary site fails. For the short failure duration carrier can route traffic through the backup site.

**The carrier already offers SLA and enterprise grade Internet, how is this offering different?**

Some carriers offer SLA and enterprise grade Internet on their part of the network. In Peering Service, Microsoft will offer SLA offer traffic on Microsoft part of the network. By selecting Peering Service customer will get end-to-end SLA. SLA from their site to Microsoft edge on ISP network can be covered by the ISP. SLA in Microsoft Global Network from Microsoft edge to end users application is now covered by Microsoft.

**If a service provider already peers with Microsoft using PNI then what kind of changes are required to support Peering Service?**

* Software changes to identify a Peering Service user and its traffic. May require routing policy changes to exchange a user's traffic at the nearest Microsoft edge through Peering Service connection.
* Ensure the connectivity has local-redundancy and geo-redundancy.

---
title: Internet peering - FAQs
titleSuffix: Azure
description: Internet peering - FAQs
services: internet-peering
author: prmitiki
ms.service: internet-peering
ms.topic: reference
ms.date: 11/27/2019
ms.author: prmitiki
---

# Internet peering - FAQs

You may review information below for general questions.

**What is the difference between Internet peering and Peering Service?**

Peering Service is a service that intends to provide enterprise grade public IP connectivity to Microsoft for its enterprise customers. Enterprise grade Internet includes connectivity through ISPs that have high throughput connectivity to Microsoft and redundancy for a HA connectivity. Additionally, user traffic is optimized for latency to the nearest Microsoft Edge. Peering Service builds on peering connectivity with partner carrier. The peering connectivity with partner must be Direct peering as opposed to Exchange peering. Direct peering  must have local and geo-redundancy.

**What is legacy peering?**

Peering connection set up using Azure PowerShell is managed as an Azure resource. Peering connections set up in the past are stored in our system as legacy peering which you may choose to convert to manage as an Azure resource.

**When New-AzPeeringDirectConnectionObject is called, what IP addresses are given to Microsoft and Peer devices?**

When calling New-AzPeeringDirectConnectionObject cmdlet, a /31 address (a.b.c.d/31) or a /30 address (a.b.c.d/30) is entered. The first IP address (a.b.c.d+0) is given to Peer's device and second IP address (a.b.c.d+1) is given to Microsoft device.

**What is MaxPrefixesAdvertisedIPv4 and MaxPrefixesAdvertisedIPv6 parameters in New-AzPeeringDirectConnectionObject cmdlet?**

MaxPrefixesAdvertisedIPv4 and MaxPrefixesAdvertisedIPv6 parameters represent the maximum number of IPv4 and IPv6 prefixes a Peer wants Microsoft to accept. These parameters can be modified anytime.
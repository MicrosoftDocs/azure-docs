---
title: Azure Internet peering for Communications Services walkthrough
titleSuffix: Azure
description: Azure Internet peering for Communications Services walkthrough
services: internet-peering
author: gthareja
ms.service: internet-peering
ms.topic: how-to
ms.date: 03/30/2021
ms.author: gatharej
---

# Azure Internet peering for Communications Services walkthrough

This section explains the steps a Communications Services Provider needs to follow to establish a Direct interconnect with Microsoft.

**Communications Services Providers:**  Communications Services Providers are the organizations which offer communication services (Communications, messaging, conferencing etc.) and are looking to integrate their communications services infrastructure (SBC/SIP Gateway etc.)  with Azure Communication Services and Microsoft Teams. 

Azure Internet peering support Communications Services Providers to establish direct interconnect with Microsoft at any of its edge sites (pop locations). The list of all the public edges sites is available in [PeeringDB](https://www.peeringdb.com/net/694).

The Azure Internet peering provides highly reliable and QoS (Quality of Service) enabled interconnect for Communications services to ensure high quality and performance centric services.

## Technical Requirements
The technical requirements to establish direct interconnect for  Communication Services are as following:
-	The Peer MUST provide own Autonomous System Number (ASN), which MUST be public.
-	The peer MUST have redundant Interconnect (PNI) at each interconnect location to ensure local redundancy.
-	The Peer MUST have geo redundancy in place to ensure failover in event of site failures in region/ metro.
-	The Peer MUST has the BGP sessions as Active- Active to ensure high availability and faster convergence and should not be provisioned as Primary and backup.
-	The Peer MUST maintain a 1:1 ratio for Peer peering routers to peering circuits and no rate limiting is applied.
-	The Peer MUST supply and advertise their own publicly routable IPv4 address space used by Peer’s communications service endpoints (e.g. SBC). 
-	The Peer MUST supply detail of what class of traffic and endpoints are housed in each advertised subnet. 
-	The Peer MUST run BGP over Bi-directional Forwarding Detection (BFD) to facilitate sub second route convergence.
-	All communications infrastructure prefixes are registered in Azure portal and advertised with community string 8075:8007.
-	The Peer MUST NOT terminate peering on a device running a stateful firewall. 
-	Microsoft will configure all the interconnect links as LAG (link bundles) by default, so, peer MUST support LACP (Link Aggregation Control Protocol) on the interconnect links.

## Establishing Direct Interconnect with Microsoft for Communications Services.

To establish a direct interconnect using Azure Internet peering please follow the below steps:

**1.	Associate Peer public ASN to the Azure Subscription:**

In case Peer already associated public ASN to Azure subscription, please ignore this step.

[Associate peer ASN to Azure subscription using the portal - Azure | Microsoft Docs](./howto-subscription-association-portal.md)

The next step is to create a Direct peering connection for Peering Service.

> [!NOTE]
> Once ASN association is approved, email us at peeringservices@microsoft.com with your ASN and subscription ID to associate your subscription with Communications services. 

**2.	Create Direct peering connection for Peering Service:**

Follow the instructions to [Create or modify a Direct peering using the portal](./howto-direct-portal.md)

Ensure it meets high-availability requirement.

Please ensure you are selecting following options on “Create a Peering” Page:

Peering Type:	**Direct**

Microsoft Network:	**8075**

SKU: 		**Premium Free**


Under “Direct Peering Connection Page” select following options:

Session Address provider:	**Microsoft**

Use for Peering Services: 	**Enabled**

> [!NOTE] 
> Ignore the following message while selecting for activating for Peering Services.
> *Do not enable unless you have contacted peering@microsoft.com about becoming a MAPS provider.*


  **2a. Use Existing Direct peering connection for Peering Services**

If you have an existing Direct peering that you want to use to support Peering Service, you can activate on Azure portal.
1.	Follow the instructions to [Convert a legacy Direct peering to Azure resource using the portal](./howto-legacy-direct-portal.md).
As required, order additional circuits to meet high-availability requirement.

2.	Follow steps to [Enable Peering Service](./howto-peering-service-portal.md) on a Direct peering using the portal.




**3.	Register your prefixes for Optimized Routing**

For optimized routing for your Communication services infrastructure prefixes, you should register all your prefixes with your peering interconnects.
[Register Azure Peering Service - Azure portal | Microsoft Docs](../peering-service/azure-portal.md)

The Prefix key is auto populated for Communications Service Partners, so the partner need not use any prefix key to register. 

Please ensure that the prefixes being registered are being announced over the direct interconnects established for the region.


## FAQs:

**Q.**	I have smaller subnets (</24) for my Communications services. Can I get the smaller subnets also routed?

**A.**	Yes, Microsoft Azure Peering service supports smaller prefix routing also. Please ensure that you are registering the smaller prefixes for routing and the same are announced over the interconnects.

**Q.**	What Microsoft routes will we receive over these interconnects?

**A.** Microsoft announces all of Microsoft's public service prefixes over these interconnects. This will ensure not only Communications but other cloud services are accessible from the same interconnect.

**Q.**	I need to set the prefix limit, how many routes Microsoft would be announcing?

**A.** Microsoft announces roughly 280 prefixes on internet, and it may increase by 10-15% in future. So, a safe limit of 400-500 can be good to set as “Max prefix count”

**Q.** Will Microsoft re-advertise the Peer prefixes to the Internet?

**A.** No.

**Q.** Is there a fee for this service?

**A.** No, however Peer is expected to carry site cross connect costs.

**Q.** What is the minimum link speed for an interconnect?

**A.** 10Gbps.

**Q.** Is the Peer bound to an SLA?

**A.** Yes, once utilization reaches 40% a 45-60day LAG augmentation process must begin.

**Q.** What is the advantage of this service over current direct peering or express route?

**A.** Settlement free and entire path is optimized for voice traffic over Microsoft WAN and convergence is tuned for sub-second with BFD.

**Q.** How does it take to complete the onboarding process?

**A.** Time will be variable depending on number and location of sites, and if Peer is migrating existing private peerings or establishing new cabling. Carrier should plan for 3+ weeks.

**Q.** Can we use APIs for onboarding?

**A.** Currently there is no API support, and configuration must be performed via web portal.
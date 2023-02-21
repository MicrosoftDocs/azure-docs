---
title: Azure Internet peering for Communications Services walkthrough
description: Azure Internet peering for Communications Services walkthrough.
services: internet-peering
author: halkazwini
ms.service: internet-peering
ms.topic: how-to
ms.date: 10/10/2022
ms.author: halkazwini
ms.custom: template-how-to
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
> Once ASN association is approved, email us at peeringservice@microsoft.com with your ASN and subscription ID to associate your subscription with Communications services. 

**2.	Create Direct peering connection for Peering Service:**

Follow the instructions to [Create or modify a Direct peering using the portal](./howto-direct-portal.md)

Ensure it meets high-availability requirement.

Please ensure you are selecting following options on “Create a Peering” Page:

Peering Type:	**Direct**

Microsoft Network:	**8075 (with Voice)**

SKU: 		**Premium Free**


Under “Direct Peering Connection Page” select following options:

Session Address provider:	**Microsoft**

Use for Peering Services: 	**Enabled**

> [!NOTE] 
> Ignore the following message while selecting for activating for Peering Services.
> *Do not enable unless you have contacted peering@microsoft.com about becoming a MAPS provider.*

**3.	Register your prefixes for Optimized Routing**

For optimized routing for your Communication services infrastructure prefixes, you should register all your prefixes with your peering interconnects.

Please ensure that the prefixes registered are being announced over the direct interconnects established in that location.
If the same prefix is announced in multiple peering locations, it is sufficient to register them with just one of the peerings in order to retrieve the unique prefix keys after validation.

> [!NOTE] 
> The Connection State of your peering connections must be Active before registering any prefixes.

**Prefix Registration**

1. If you are an Operator Connect Partner, you would be able to see the “Register Prefix” tab on the left panel of your peering resource page. 

   :::image type="content" source="media/registered-prefixes-under-direct-peering.png" alt-text="Screenshot of registered prefixes tab under a peering enabled for Peering Service." :::

2. Register prefixes to access the activation keys.

   :::image type="content" source="media/registered-prefixes-blade.png" alt-text="Screenshot of registered prefixes blade with a list of prefixes and keys." :::

   :::image type="content" source="media/registered-prefix-example.png" alt-text="Screenshot showing a sample prefix being registered." :::

   :::image type="content" source="media/prefix-after-registration.png" alt-text="Screenshot of registered prefixes blade showing a new prefix added." :::

**Prefix Activation**

In the previous steps, you registered the prefix and generated the prefix key. The prefix registration DOES NOT activate the prefix for optimized routing (and will not even accept <\/24 prefixes) and it requires prefix activation and alignment to the right partner (In this case the OC partner) and the appropriate interconnect location (to ensure cold potato routing).

Below are the steps to activate the prefix.

1. Look for “Peering Services” resource 

  :::image type="content" source="media/peering-service-search.png" alt-text="Screenshot on searching for Peering Service on Azure portal." :::
  
  :::image type="content" source="media/peering-service-list.png" alt-text="Screenshot of a list of existing peering services." :::

2. Create a new Peering Service resource

  :::image type="content" source="media/create-peering-service.png" alt-text="Screenshot showing how to create a new peering service." :::

3. Provide details on the location, provider and primary and backup interconnect location. If backup location is set to “none”, the traffic will fail over the internet. 

    If you are an Operator Connect partner, you would be able to see yourself as the provider. 
    The prefix key should be the same as the one obtained in the "Prefix Registration" step. 

  :::image type="content" source="media/peering-service-properties.png" alt-text="Screenshot of the fields to be filled to create a peering service." :::

  :::image type="content" source="media/peering-service-deployment.png" alt-text="Screenshot showing the validation of peering service resource before deployment." :::

## FAQs:

**Q.**   When will my BGP peer come up?

**A.**   After the LAG comes up, our automated process configures BGP with BFD. Peer must configure BGP with BFD. Note, BFD must be configured and up on the non-MSFT peer to start route exchange.

**Q.**   When will peering IP addresses be allocated and displayed in the Azure portal?

**A.**   Our automated process allocates addresses and sends the information via email after the port is configured on our side.

**Q.**	I have smaller subnets (</24) for my Communications services. Can I get the smaller subnets also routed?

**A.**	Yes, Microsoft Azure Peering service supports smaller prefix routing also. Please ensure that you are registering the smaller prefixes for routing and the same are announced over the interconnects.

**Q.**	What Microsoft routes will we receive over these interconnects?

**A.** Microsoft announces all of Microsoft's public service prefixes over these interconnects. This will ensure not only Communications but other cloud services are accessible from the same interconnect.

**Q.**   Are there any AS path constraints?

**A.**   Yes, a private ASN cannot be in the AS path. For registered prefixes smaller than /24, the AS path must be less than four.

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

**Q.** How is progress communicated outside of the portal status?

**A.** Automated emails are sent at varying milestones

**Q.** Can we use APIs for onboarding?

**A.** Currently there is no API support, and configuration must be performed via web portal.

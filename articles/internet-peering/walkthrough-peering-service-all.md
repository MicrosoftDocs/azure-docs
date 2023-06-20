---
title: Peering Service partner walkthrough
titleSuffix: Internet Peering
description: Get started with Peering Service partner.
services: internet-peering
author: halkazwini
ms.service: internet-peering
ms.topic: how-to
ms.date: 02/23/2023
ms.author: halkazwini
ms.custom: template-how-to, engagement-fy23
---

# Azure Internet peering for Peering Service walkthrough

In this article, you learn steps to establish a Direct interconnect between a Peering Service Provider and Microsoft.

Internet peering support Peering Service providers to establish direct interconnect with Microsoft at any of its edge sites (pop locations). The list of all the public edges sites is available in [PeeringDB](https://www.peeringdb.com/net/694).

Internet peering provides highly reliable and QoS (Quality of Service) enabled interconnect for Peering Services to ensure high quality and performance centric services.

The following flowchart summarizes the process to onboard to Peering Services

:::image type="content" source="media/walkthrough-peering-services-partner/peering-services-partner-onboarding-flowchart.png" alt-text="Flowchart summarizing the onboarding process for Peering Services partners" :::

## Technical Requirements
The technical requirements to establish direct interconnect for Peering Services are as following:
-	The Peer MUST provide own Autonomous System Number (ASN), which MUST be public.
-	The peer MUST have redundant Interconnect (PNI) at each interconnect location to ensure local redundancy.
-	The Peer MUST have geo redundancy in place to ensure failover if there are site failures in the region or metro.
-	The Peer MUST has the BGP sessions as Active- Active to ensure high availability and faster convergence and should not be provisioned as Primary and backup.
-	The Peer MUST maintain a 1:1 ratio for Peer peering routers to peering circuits and no rate limiting is applied.
-	The Peer MUST supply and advertise their own publicly routable IPv4 address space. 
-	The Peer MUST supply detail of what class of traffic and endpoints are housed in each advertised subnet. 
-	All prefixes are registered in Azure portal and advertised with community string 8075:8007.
-	The Peer MUST NOT terminate peering on a device running a stateful firewall. 
-	Microsoft will configure all the interconnect links as LAG (link bundles) by default, so, peer MUST support LACP (Link Aggregation Control Protocol) on the interconnect links.

## Establish Direct Interconnect with Microsoft for Peering Service

To establish a direct interconnect with Microsoft using Internet peering, follow the following steps:

1. **Associate Peer public ASN to the Azure Subscription:** [Associate peer ASN to Azure subscription using the Azure portal](./howto-subscription-association-portal.md). If the Peer has already associated a public ASN to Azure subscription, go to the next step.

2. **Create Direct peering connection for Peering Service:** [Create a Direct peering using the portal](./howto-direct-portal.md), and make sure you meet high-availability.requirement. In the **Configuration** tab of **Create a Peering**, select the following options:

    | Setting | Value |
    | --- | --- |
    | Peering type | Select **Direct**. |
    | Microsoft network | Select **8075**. |
    | SKU | Select **Premium Free**. |

    In **Direct Peering Connection**, select following options:

    | Setting | Value |
    | --- | --- |
    | Session Address provider | Select **Microsoft**. |
    | Use for Peering Services | Select **Enabled**. |

    > [!NOTE] 
    > When activating Peering Service, ignore the following message: *Do not enable unless you have contacted peering@microsoft.com about becoming a MAPS provider.*

## Register the prefix

1. If you're an Operator Connect Partner, you would be able to see the “Register Prefix” tab on the left panel of your peering resource page. 

   :::image type="content" source="./media/walkthrough-communications-services-partner/registered-prefixes-under-direct-peering.png" alt-text="Screenshot of registered prefixes tab under a peering enabled for Peering Service." :::

2. Register prefixes to access the activation keys.

   :::image type="content" source="./media/walkthrough-communications-services-partner/registered-prefixes-blade.png" alt-text="Screenshot of registered prefixes blade with a list of prefixes and keys." :::

   :::image type="content" source="./media/walkthrough-communications-services-partner/registered-prefix-example.png" alt-text="Screenshot showing a sample prefix being registered." :::

   :::image type="content" source="./media/walkthrough-communications-services-partner/prefix-after-registration.png" alt-text="Screenshot of registered prefixes blade showing a new prefix added." :::

## Activate the prefix

In the previous section, you registered the prefix and generated the prefix key. The prefix registration DOES NOT activate the prefix for optimized routing (and doesn't accept <\/24 prefixes). Prefix activation, alignment to the right OC partner, and appropriate interconnect location are requirements for optimized routing (to ensure cold potato routing).

In this section, you activate the prefix:

1. In the search box at the top of the portal, enter *peering service*. Select **Peering Services** in the search results. 

    :::image type="content" source="./media/walkthrough-communications-services-partner/peering-service-portal-search.png" alt-text="Screenshot shows how to search for Peering Service in the Azure portal.":::

1. Select **+ Create** to create a new Peering Service connection.

    :::image type="content" source="./media/walkthrough-communications-services-partner/peering-service-list.png" alt-text="Screenshot shows the list of existing Peering Service connections in the Azure portal.":::

1. In the **Basics** tab, enter or select your subscription, resource group, and Peering Service connection name.

    :::image type="content" source="./media/walkthrough-communications-services-partner/peering-service-basics.png" alt-text="Screenshot shows the Basics tab of creating a Peering Service connection in the Azure portal.":::

1. In the **Configuration** tab, provide details on the location, provider and primary and backup interconnect locations. If the backup location is set to **None**, the traffic will fail over to the internet. 

    > [!NOTE]
    > - If you're an Operator Connect partner, your organization is available as a **Provider**.
    > - The prefix key should be the same as the one obtained in the [Register the prefix](#register-the-prefix) step. 

    :::image type="content" source="./media/walkthrough-communications-services-partner/peering-service-configuration.png" alt-text="Screenshot shows the Configuration tab of creating a Peering Service connection in the Azure portal."::: 

1. Select **Review + create**.

1. Review the settings, and then select **Create**.

## FAQs:

**Q.**   When will my BGP peer come up?

**A.**   After the LAG comes up, our automated process configures BGP with BFD. Peer must configure BGP with BFD. Note, BFD must be configured and up on the non-MSFT peer to start route exchange.

**Q.**   When will peering IP addresses be allocated and displayed in the Azure portal?

**A.**   Our automated process allocates addresses and sends the information via email after the port is configured on our side.

**Q.**	I have smaller subnets (</24) for my Peering services. Can I get the smaller subnets also routed?

**A.**	Yes, Microsoft Azure Peering service supports smaller prefix routing also. Please register the smaller prefixes for routing and the same are announced over the interconnects.

**Q.**	What Microsoft routes will we receive over these interconnects?

**A.** Microsoft announces all of Microsoft's public service prefixes over these interconnects. This announcement ensures communications and other cloud services are accessible from the same interconnect.

**Q.**   Are there any AS path constraints?

**A.**   Yes, a private ASN cannot be in the AS path. For registered prefixes smaller than /24, the AS path must be less than four.

**Q.**	I need to set the prefix limit, how many routes Microsoft would be announcing?

**A.** Microsoft announces roughly 280 prefixes on internet, and it may increase by 10-15% in future. So, a safe limit of 400-500 can be good to set as “Max prefix count”

**Q.** Will Microsoft readvertise the Peer prefixes to the Internet?

**A.** No.

**Q.** My peering registered prefix has failed validation. How should I proceed?

**A.** Review the [Peering Registered Prefix Requirements](./peering-registered-prefix-requirements.md) and follow the troubleshooting steps described.

**Q.** My peering service prefix has failed validation. How should I proceed?

**A.** Review the [Peering Service Prefix Requirements](./peering-service-prefix-requirements.md) and follow the troubleshooting steps described.

**Q.** Is there a fee for this service?

**A.** No, however Peer is expected to carry site cross connect costs.

**Q.** What is the minimum link speed for an interconnect?

**A.** 10 Gbps.

**Q.** Is the Peer bound to an SLA?

**A.** Yes, once utilization reaches 40% a 45-60day LAG augmentation process must begin.

**Q.** How does it take to complete the onboarding process?

**A.** Time is variable depending on number and location of sites, and if Peer is migrating existing private peerings or establishing new cabling. Carrier should plan for 3+ weeks.

**Q.** How is progress communicated outside of the portal status?

**A.** Automated emails are sent at varying milestones

**Q.** Can we use APIs for onboarding?

**A.** Currently there's no API support, and configuration must be performed via web portal.
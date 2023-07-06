---
title: Internet peering for MAPS Exchange with Route Server partner walkthrough
description: Learn about Internet peering for MAPS Exchange with Route Server, its requirements, the steps to establish direct interconnect, and how to register your ASN.
services: internet-peering
author: jsaraco
ms.service: internet-peering
ms.topic: how-to
ms.date: 06/26/2023
ms.author: jsaraco
ms.custom: template-how-to
---

# Internet peering for MAPS Exchange with Route Server partner walkthrough

In this article, you learn steps to establish an Exchange with Route Server interconnect enabled for Microsoft Azure Peering Service (MAPS) with Microsoft.

Internet peering supports internet exchange partners (IXPs) to establish direct interconnect with Microsoft at any of its edge sites (POP locations). The list of all the public edges sites is available in [PeeringDB](https://www.peeringdb.com/net/694).

Internet peering provides highly reliable and QoS (Quality of Service) enabled interconnect for IXPs to ensure high quality and performance centric services.

The following flowchart summarizes the process to onboard to MAPS Exchange with Route Server:

:::image type="content" source="media/walkthrough-peering-services-partner/peering-services-partner-onboarding-flowchart.png" alt-text="Flowchart summarizing the onboarding process for Exchange with Route Server partners" :::

## Technical Requirements

To establish a MAPS Exchange with Route Server peering, follow these requirements:

-	The Peer MUST provide its own Autonomous System Number (ASN), which MUST be public.
-	The Peer MUST have redundant Interconnect (PNI) at each interconnect location to ensure local redundancy.
-	The Peer MUST supply and advertise their own publicly routable IPv4 address space used by Peer's endpoints (for example, SBC). 
-	The Peer MUST supply detail of what class of traffic and endpoints are housed in each advertised subnet.
-	The Peer MUST NOT terminate peering on a device running a stateful firewall.
-	The Peer CANNOT have two local connections configured on the same router, as diversity is required
-   The Peer CANNOT apply rate limiting to their connection
-   The Peer CANNOT configure a local redundant connection as a backup connection. Backup connections must be in a different location than primary connections.
-   Primary, backup, and redundant sessions all must have the same bandwidth
-	It is recommended to create MAPS peerings in multiple locations so geo-redundancy can be achieved.
-	All origin ASNs are registered in Azure portal.
-	Microsoft configures all the interconnect links as LAG (link bundles) by default, so, peer MUST support LACP (Link Aggregation Control Protocol) on the interconnect links.

## Establish Direct Interconnect with Microsoft for MAPS Exchange with Route Server

To establish a MAPS Exchange with Route Server interconnect with Microsoft, follow the following steps:

### 1. Associate your public ASN with your Azure subscription

Follow the instructions here: [Associate peer ASN to Azure subscription using the Azure portal](./howto-subscription-association-portal.md). If the ASN has already been associated, proceed to the next step.

### 2. Create a MAPS Exchange with Route Server peering

To create a MAPS Exchange with Route Server peering resource, search for **Peerings** in the Azure portal, and click on it:

:::image type="content" source="./media/create-maps-peering-search.png" alt-text="Azure portal search for Peering resources" :::

Click Create in the page that opens:

:::image type="content" source="./media/create-maps-peering-create.png" alt-text="Click create in the Peering resources page" :::

Enter the subscription, resource group, name, and ASN of the peering:

:::image type="content" source="./media/create-maps-peering-basics.png" alt-text="Specify the subscription, resource group, name, and peer ASN of the peering" :::

> [!NOTE] 
> These details CANNOT be changed after the peering is created. Please confirm they are correct before creating the peering.

In the Configuration form, you MUST choose:

* **Direct** as the Peering type 
* **AS8075 (with exchange route server)** as the Microsoft network
* **Premium Free** as the SKU

These are mandatory configurations when creating a peering for MAPS Exchange with Route Server.

:::image type="content" source="./media/walkthrough-exchange-route-server-partner/create-maps-ixrs-peering-config.png" alt-text="Configure the peering for MAPS Exchange with Route Server" :::

In the peering connections section, click Create new to add a connection to your peering.

:::image type="content" source="./media/walkthrough-exchange-route-server-partner/create-maps-ixrs-bgp-session.png" alt-text="Configure a peering connection" :::

Peering connections for MAPS Exchange with Route Server MUST have **Peer** as the Session Address Provider, and **Use for Peering Service** enabled. These options are chosen for you automatically.

Before finalizing your Peering, make sure the peering has at least one connection.

> [!NOTE] 
> A two-link BGP mesh is formed for a MAPS Exchange with Route Server peering even if a single connection is configured. Do NOT create a second connection if a two-link mesh is what's desired.
  
When you have finished configuring your peering, move on to Review + create. If you have configured it correctly, the resource will pass validation. Click Create to deploy the resource.

:::image type="content" source="./media/walkthrough-exchange-route-server-partner/create-maps-ixrs-peering-review.png" alt-text="Review and create the peering" :::

Allow time for the resource to finish deploying. When deployment is successful, your peering is created and provisioning will begin.

:::image type="content" source="./media/walkthrough-communications-services-partner/create-maps-voice-peering-deploy.png" alt-text="Successfully deployed peering resource" :::

## Configure optimized routing for your prefixes

To get optimized routing for your prefixes with your MAPS Exchange with Route Server interconnects, follow these instructions:

### 1. Register your ASN

Before prefixes can be optimized, your ASN must be registered.

> [!NOTE] 
> The Connection State of your peering connections must be **Active** before registering your ASN.

Open your MAPS Exchange with Route Server peering in the Azure portal, and click on **Registered ASNs**:

:::image type="content" source="./media/setup-exchange-registered-asn.png" alt-text="Peering page in Azure portal with Registered ASNs button highlighted" :::

Create a Registered ASN by entering a name, and your Autonomous System Number (ASN):

:::image type="content" source="./media/setup-exchange-register-new-asn.png" alt-text="Configuration page for a new Registered ASN" :::

After your ASN is registered, a unique peering service prefix key will be generated. This prefix key must be used with ALL peering service prefixes created in the next section. 

### 2. Provide peering service prefix keys to customers for activation

When your customers onboard to MAPS, customers will follow these instructions: [MAPS customer walkthrough](../peering-service/walkthrough-peering-service-customer.md). During this, they will activate prefixes using the peering service prefix key obtained during ASN registration. Provider this key to customers before they activate, as this key will be used for all prefixes during activation.

## Frequently asked questions (FAQ):

**Q.**   When will my BGP peer come up?

**A.**   After the LAG comes up, our automated process configures BGP. Peer must configure BGP.

**Q.**   When will peering IP addresses be allocated and displayed in the Azure portal?

**A.**   Our automated process allocates addresses and sends the information via email after the port is configured on our side.

**Q.**	I have smaller subnets (</24) for my Communications services. Can I get the smaller subnets also routed?

**A.**	Yes, Microsoft Azure Peering service supports smaller prefix routing also. Ensure that you're activating the smaller prefixes for routing and the same are announced over the interconnects.

**Q.**	What Microsoft routes will we receive over these interconnects?

**A.** Microsoft announces all of Microsoft's public service prefixes over these interconnects. This ensures not only Communications but other cloud services are accessible from the same interconnect.

**Q.**   Are there any AS path constraints?

**A.**   Yes, a private ASN can't be in the AS path. For activated prefixes smaller than /24, the AS path must be less than four.

**Q.**	I need to set the prefix limit, how many routes Microsoft would be announcing?

**A.** Microsoft announces roughly 280 prefixes on internet, and it may increase by 10-15% in future. So, a safe limit of 400-500 can be good to set as “Max prefix count”

**Q.** Will Microsoft re-advertise the Peer prefixes to the Internet?

**A.** No.

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

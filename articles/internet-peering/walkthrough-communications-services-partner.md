---
title: Internet peering for Communications Services walkthrough
description: Learn about Internet peering for Communications Services, its requirements, the steps to establish direct interconnect, and how to register and activate a prefix.
services: internet-peering
author: halkazwini
ms.service: internet-peering
ms.topic: how-to
ms.date: 06/15/2023
ms.author: halkazwini
ms.custom: template-how-to
---

# Internet peering for Communications Services walkthrough

In this article, you learn steps to establish a Direct interconnect between a Communications Services Provider and Microsoft.

**Communications Services Providers** are the organizations that offer communication services (messaging, conferencing, and other communications services.) and want to integrate their communications services infrastructure (SBC, SIP gateways, and other infrastructure device) with Azure Communication Services and Microsoft Teams. 

Internet peering supports Communications Services Providers to establish direct interconnect with Microsoft at any of its edge sites (POP locations). The list of all the public edges sites is available in [PeeringDB](https://www.peeringdb.com/net/694).

Internet peering provides highly reliable and QoS (Quality of Service) enabled interconnect for Communications Services to ensure high quality and performance centric services.

The following flowchart summarizes the process to onboard to Communications Services:

:::image type="content" source="media/walkthrough-communications-services-partner/communications-services-partner-onboarding-flowchart.png" alt-text="Flowchart summarizing the onboarding process for Communications Services partners" :::

## Technical Requirements

To establish direct interconnect for Communication Services, follow these requirements:

-	The Peer MUST provide its own Autonomous System Number (ASN), which MUST be public.
-	The peer MUST have redundant Interconnect (PNI) at each interconnect location to ensure local redundancy.
-	The Peer MUST have geo redundancy in place to ensure failover in the event of site failures in region/metro.
-	The Peer MUST has the BGP sessions as Active-Active to ensure high availability and faster convergence and shouldn't be provisioned as Primary and Backup.
-	The Peer MUST maintain a 1:1 ratio for Peer peering routers to peering circuits and no rate limiting is applied.
-	The Peer MUST supply and advertise their own publicly routable IPv4 address space used by Peer's communications service endpoints (for example, SBC). 
-	The Peer MUST supply detail of what class of traffic and endpoints are housed in each advertised subnet. 
-	The Peer MUST run BGP over Bidirectional Forwarding Detection (BFD) to facilitate sub second route convergence.
-	All communications infrastructure prefixes are registered in Azure portal and advertised with community string 8075:8007.
-	The Peer MUST NOT terminate peering on a device running a stateful firewall. 
-	Microsoft configures all the interconnect links as LAG (link bundles) by default, so, peer MUST support LACP (Link Aggregation Control Protocol) on the interconnect links.

## Establish Direct Interconnect with Microsoft for Communications Services

To establish a direct interconnect with Microsoft using Internet peering, follow the following steps:

### 1. Associate your public ASN with your Azure subscription

Follow the instructions here: [Associate peer ASN to Azure subscription using the Azure portal](./howto-subscription-association-portal.md). If the ASN has already been associated, proceed to the next step.

### 2. Create a Communications Services peering

To create a peering resource for Communications Services, search for **Peerings** in the Azure portal, and click on it:

:::image type="content" source="./media/create-maps-peering-search.png" alt-text="Azure portal search for Peering resources" :::

Click Create in the page that opens:

:::image type="content" source="./media/create-maps-peering-create.png" alt-text="Click create in the Peering resources page" :::

Enter the subscription, resource group, name, and ASN of the peering:

:::image type="content" source="./media/create-maps-peering-basics.png" alt-text="Specify the subscription, resource group, name, and peer ASN of the peering" :::

> [!NOTE] 
> These details CANNOT be changed after the peering is created. Please confirm they are correct before creating the peering.

In the Configuration form, you MUST choose:

* **Direct** as the Peering type 
* **AS8075 (with Voice)** as the Microsoft network
* **Premium Free** as the SKU

These are mandatory configurations when creating a peering for Communications Services.

:::image type="content" source="./media/walkthrough-communications-services-partner/create-maps-voice-peering-config.png" alt-text="Configure the peering for Communications Services" :::

In the peering connections section, click Create new to add a connection to your peering.

:::image type="content" source="./media/walkthrough-communications-services-partner/create-maps-voice-bgp-session.png" alt-text="Configure a peering connection" :::

Peerings configured for Communications Services MUST have **Microsoft** as the Session Address Provider, and **Use for Peering Service** enabled. These options are chosen for you automatically. Microsoft must be the IP provider for Communications Services, you cannot provide your own IPs.

Before finalizing your Peering, make sure the peering has at least two connections. Local redundancy is a requirement for Peering Service, and creating a Peering with two sessions will achieve this.

When you have finished configuring your peering, move on to Review + create. If you have configured it correctly, the resource will pass validation. Click Create to deploy the resource.

:::image type="content" source="./media/walkthrough-communications-services-partner/create-maps-voice-peering-review.png" alt-text="Review and create the peering" :::

Allow time for the resource to finish deploying. When deployment is successful, your peering is created and provisioning will begin.

:::image type="content" source="./media/walkthrough-communications-services-partner/create-maps-voice-peering-deploy.png" alt-text="Successfully deployed peering resource" :::

## Configure optimized routing for your prefixes

To get optimized routing for your prefixes with your Communications Services interconnects, follow these instructions:

### 1. Register your prefixes

For optimized routing for a Communication Services infrastructure prefixes, you must register them.

> [!NOTE] 
> The Connection State of your peering connections must be **Active** before registering any prefixes.

Ensure that the registered prefixes are announced over the direct interconnects established with your peering. If the same prefix is announced in multiple peering locations, you do NOT have to register the prefix in every single location. A prefix can only be registered with a single peering. When you receive the unique prefix key after validation, this key will be used for the prefix even in locations other than the location of the peering it was registered under.

To begin registration, open your Communications Services peering in the Azure portal and click on **Registered prefixes** in the left pane:

:::image type="content" source="./media/walkthrough-communications-services-partner/register-prefix-peering-page.png" alt-text="Peering resource page with Registered Prefixes option highlighted" :::

Then click **Add registered prefix**

> [!NOTE] 
> If the Add registered prefix button is disabled, that means your peering doesn't have at least one connection that is **Active**. Please wait until this occurs to register your prefix.

:::image type="content" source="./media/walkthrough-communications-services-partner/register-prefix-add-prefix.png" alt-text="Registered prefix page with Add button highlighted" :::

Configure your prefix by giving it a name, and the IPv4 prefix string and click **Save**.

:::image type="content" source="./media/walkthrough-communications-services-partner/register-prefix-configure.png" alt-text="Registered prefix configuration page" :::

After you create a registered prefix, it will be queued for validation. The validation state of the prefix can be found in the Registered Prefixes page:

:::image type="content" source="./media/walkthrough-communications-services-partner/prefix-after-registration.png" alt-text="Screenshot of registered prefixes blade showing a new prefix added." :::

For a registered prefix to become validated, the following checks must pass:

* The prefix can't be in a private range
* All connections in the parent peering must advertise routes for the prefix
* Routes must be advertised with the MAPS community string 8075:8007
* AS paths in your routes can't exceed a path length of 3, and can't contain private ASNs

For more information on registered prefix requirements and how to troubleshoot validation errors, refer to [Peering Registered Prefix Requirements](./peering-registered-prefix-requirements.md).

### 2. Activate your prefixes

In the previous section, you registered prefixes and generated prefix keys. Prefix registration DOES NOT activate the prefix for optimized routing (and doesn't accept <\/24 prefixes). Prefix activation and appropriate interconnect location are requirements for optimized routing (to ensure cold potato routing).

To begin activating your prefixes, in the search box at the top of the portal, enter *peering service*. Select **Peering Services** in the search results. 

:::image type="content" source="./media/walkthrough-communications-services-partner/peering-service-portal-search.png" alt-text="Screenshot shows how to search for Peering Service in the Azure portal.":::

Select **Create** to create a new Peering Service connection.

:::image type="content" source="./media/walkthrough-communications-services-partner/peering-service-list.png" alt-text="Screenshot shows the list of existing Peering Service connections in the Azure portal.":::

In the **Basics** tab, enter or select your subscription, resource group, and Peering Service connection name.

:::image type="content" source="./media/walkthrough-communications-services-partner/peering-service-basics.png" alt-text="Screenshot shows the Basics tab of creating a Peering Service connection in the Azure portal.":::

In the **Configuration** tab, choose your country, state/province, your provider name, the primary peering location, and optionally the backup peering location.

> [!NOTE] 
> Be careful when choosing "None" as the provider backup peering location when creating a Peering Service. This means your routes will not have geo-redundancy.

In the Prefixes section, create prefixes corresponding to the prefixes you registered in the previous step. Enter the name of the prefix, the prefix string, and the prefix key you obtained when you registered the prefix. Know that you do not have to create all of your peering service prefixes when creating a peering service, you can add them later.

> [!NOTE] 
> Ensure that the prefix key you enter when creating a peering service prefix matches the prefix key generated when you registered that prefix.

:::image type="content" source="./media/walkthrough-communications-services-partner/activate-prefix-configure-peering-service.png" alt-text="The Configuration tab of creating a Peering Service connection in the Azure portal.":::

Select **Review + create**.

Review the settings, and then select **Create**.

After you create a peering service prefix, it will be queued for validation. The validation state of the prefix can be found in the Peering Service Prefixes page.

:::image type="content" source="./media/walkthrough-communications-services-partner/activate-prefixes-prefixes-page.png" alt-text="Peering service prefixes blade showing prefixes that have passed validation." :::

For a peering service prefix to become validated, the following checks MUST pass:

* The prefix can't be in a private range
* The prefix must be registered, and the prefix key in the peering service prefix must match the prefix key of the corresponding registered prefix
* All primary and backup sessions (if configured) must advertise routes for the prefix
* Routes must be advertised with the MAPS community string 8075:8007
* AS paths in your routes can't exceed a path length of 3, and can't contain private ASNs

For more information on peering service prefix prefix requirements and how to troubleshoot validation errors, refer to [Peering Service Prefix Requirements](./peering-service-prefix-requirements.md).

After a prefix passes validation, then activation for that prefix is complete.

## Frequently asked questions (FAQ):

**Q.**   When will my BGP peer come up?

**A.**   After the LAG comes up, our automated process configures BGP with BFD. Peer must configure BGP with BFD. Note, BFD must be configured and up on the non-MSFT peer to start route exchange.

**Q.**   When will peering IP addresses be allocated and displayed in the Azure portal?

**A.**   Our automated process allocates addresses and sends the information via email after the port is configured on our side.

**Q.**	I have smaller subnets (</24) for my Communications services. Can I get the smaller subnets also routed?

**A.**	Yes, Microsoft Azure Peering service supports smaller prefix routing also. Ensure that you're registering the smaller prefixes for routing and the same are announced over the interconnects.

**Q.**	What Microsoft routes will we receive over these interconnects?

**A.** Microsoft announces all of Microsoft's public service prefixes over these interconnects. This ensures not only Communications but other cloud services are accessible from the same interconnect.

**Q.** My peering registered prefix has failed validation. How should I proceed?

**A.** Review the [Peering Registered Prefix Requirements](./peering-registered-prefix-requirements.md) and follow the troubleshooting steps described.

**Q.** My peering service prefix has failed validation. How should I proceed?

**A.** Review the [Peering Service Prefix Requirements](./peering-service-prefix-requirements.md) and follow the troubleshooting steps described.

**Q.**   Are there any AS path constraints?

**A.**   Yes, a private ASN can't be in the AS path. For registered prefixes smaller than /24, the AS path must be less than four.

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

**Q.** What is the advantage of this service over current direct peering or express route?

**A.** Settlement free and entire path is optimized for voice traffic over Microsoft WAN and convergence is tuned for subsecond with BFD.

**Q.** How does it take to complete the onboarding process?

**A.** Time is variable depending on number and location of sites, and if Peer is migrating existing private peerings or establishing new cabling. Carrier should plan for 3+ weeks.

**Q.** How is progress communicated outside of the portal status?

**A.** Automated emails are sent at varying milestones

**Q.** Can we use APIs for onboarding?

**A.** Currently there's no API support, and configuration must be performed via web portal.

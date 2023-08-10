---
title: Internet peering for Peering Service Voice Services walkthrough
description: Learn about Internet peering for Peering Service Voice Services, its requirements, the steps to establish direct interconnect, and how to register and activate a prefix.
author: halkazwini
ms.author: halkazwini
ms.service: internet-peering
ms.topic: how-to
ms.date: 07/23/2023
---

# Internet peering for Peering Service Voice Services walkthrough

In this article, you learn steps to establish a Peering Service interconnect between a voice services provider and Microsoft.

**Voice Services Providers** are the organizations that offer communication services (messaging, conferencing, and other communications services.) and want to integrate their communications services infrastructure (SBC, SIP gateways, and other infrastructure device) with Azure Communication Services and Microsoft Teams. 

Internet peering supports voice services providers to establish direct interconnect with Microsoft at any of its edge sites (POP locations). The list of all the public edges sites is available in [PeeringDB](https://www.peeringdb.com/net/694).

Internet peering provides highly reliable and QoS (Quality of Service) enabled interconnect for Communications Services to ensure high quality and performance centric services.

The following flowchart summarizes the process to onboard to Peering Service Voice Services:

:::image type="content" source="media/walkthrough-communications-services-partner/communications-services-partner-onboarding-flowchart.png" alt-text="Diagram shows the flowchart of the onboarding process for Peering Service Voice Services partners" :::

## Technical requirements

To establish direct interconnect for Peering Service Voice Services, follow these requirements:

-	The Peer MUST provide its own Autonomous System Number (ASN), which MUST be public.
-	The Peer MUST have redundant Interconnect (PNI) at each interconnect location to ensure local redundancy.
-	The Peer MUST supply and advertise their own publicly routable IPv4 address space used by Peer's endpoints (for example, SBC). 
-	The Peer MUST supply detail of what class of traffic and endpoints are housed in each advertised subnet.
-	The Peer MUST run BGP over Bidirectional Forwarding Detection (BFD) to facilitate subsecond route convergence.
-	The Peer MUST NOT terminate the peering on a device running a stateful firewall.
-	The Peer CANNOT have two local connections configured on the same router, as diversity is required
-   The Peer CANNOT apply rate limiting to their connection
-   The Peer CANNOT configure a local redundant connection as a backup connection. Backup connections must be in a different location than primary connections.
-   Primary, backup, and redundant sessions all must have the same bandwidth
-	It's recommended to create Peering Service peerings in multiple locations so geo-redundancy can be achieved.
-	All infrastructure prefixes are registered in Azure portal and advertised with community string 8075:8007.
-	Microsoft configures all the interconnect links as LAG (link bundles) by default, so, peer MUST support LACP (Link Aggregation Control Protocol) on the interconnect links.

## Establish Direct Interconnect with Microsoft for Peering Service Voice Services

To establish a direct interconnect with Microsoft using Internet peering, follow these steps:

### 1. Associate your public ASN with your Azure subscription

See [Associate peer ASN to Azure subscription using the Azure portal](./howto-subscription-association-portal.md) to learn how to Associate your public ASN with your Azure subscription. If the ASN has already been associated, proceed to the next step.

### 2. Create a Peering Service Voice Services peering

1. To create a peering resource for Peering Service Voice Services, search for **Peerings** in the Azure portal.

    :::image type="content" source="./media/walkthrough-communications-services-partner/internet-peering-portal-search.png" alt-text="Screenshot shows how to search for Peering resources in the Azure portal.":::

1. Select **+ Create**.

    :::image type="content" source="./media/walkthrough-communications-services-partner/create-peering.png" alt-text="Screenshot shows how to create a Peering resource in the Azure portal.":::

1. In the **Basics** tab, enter or select your Azure subscription, resource group, name, and ASN of the peering:

    :::image type="content" source="./media/walkthrough-communications-services-partner/create-peering-basics.png" alt-text="Screenshot of the Basics tab of creating a peering in the Azure portal.":::

    > [!NOTE] 
    > These details you select CAN'T be changed after the peering is created. confirm they are correct before creating the peering.

1. In the **Configuration** tab, you MUST choose the following required configurations:

    - Peering type: **Direct**.
    - Microsoft network: **AS8075 (with Voice)**.
    - SKU: **Premium Free**.

1. Select your **Metro**, then select **Create new** to add a connection to your peering.

    :::image type="content" source="./media/walkthrough-communications-services-partner/create-peering-configuration.png" alt-text="Screenshot of the Configuration tab of creating a peering in the Azure portal.":::

1. In **Direct Peering Connection**, enter or select your peering facility details then select **Save**.

    :::image type="content" source="./media/walkthrough-communications-services-partner/direct-peering-connection.png" alt-text="Screenshot of creating a direct peering connection.":::

    Peering connections configured for Peering Service Voice Services MUST have **Microsoft** as the Session Address Provider, and **Use for Peering Service** enabled. These options are chosen for you automatically. Microsoft must be the IP provider for Peering Service Voice Services, you can't provide your own IPs.

1. In **Create a peering**, select **Create new** again to add a second connection to your peering. The peering must have at least two connections. Local redundancy is a requirement for Peering Service, and creating a Peering with two sessions achieves this requirement.

    :::image type="content" source="./media/walkthrough-communications-services-partner/two-connections-peering.png" alt-text="Screenshot of the Configuration tab after two connections.":::

1. Select **Review + create**. Review the summary and select **Create** after the validation passes.

Allow time for the resource to finish deploying. When deployment is successful, your peering is created and provisioning begins.

## Configure optimized routing for your prefixes

To get optimized routing for your prefixes with your Peering Service Voice Services interconnects, follow these steps:

### 1. Register your prefixes

For optimized routing for voice services infrastructure prefixes, you must register them.

> [!NOTE] 
> The connection state of your peering connections must be **Active** before registering any prefixes.

Ensure that the registered prefixes are announced over the direct interconnects established with your peering. If the same prefix is announced in multiple peering locations, you do NOT have to register the prefix in every single location. A prefix can only be registered with a single peering. When you receive the unique prefix key after validation, this key will be used for the prefix even in locations other than the location of the peering it was registered under.

1. To begin registration, go to your peering in the Azure portal and select **Registered prefixes**.

    :::image type="content" source="./media/walkthrough-communications-services-partner/registered-asn.png" alt-text="Screenshot shows how to go to Registered ASNs from the Peering Overview page in the Azure portal.":::

1. Select **Add registered prefix**.

    :::image type="content" source="./media/walkthrough-communications-services-partner/add-registered-prefix.png" alt-text="Screenshot of Registered prefix page in the Azure portal.":::

    > [!NOTE] 
    > If the **Add registered prefix** button is disabled, then your peering doesn't have at least one **Active** connection. Wait until this occurs to register your prefix.

1. Configure your prefix by giving it a name, and the IPv4 prefix string and select **Save**.

    :::image type="content" source="./media/walkthrough-communications-services-partner/register-prefix-configure.png" alt-text="Screenshot of registering a prefix in the Azure portal.":::

After prefix creation, you can see the generated Peering Service prefix key when viewing the Registered ASN resource:

:::image type="content" source="./media/walkthrough-communications-services-partner/registered-prefix-details.png" alt-text="Screenshot of registered prefix details.":::

After you create a registered prefix, it will be queued for validation. The validation state of the prefix can be found in the Registered Prefixes page:

:::image type="content" source="./media/walkthrough-communications-services-partner/prefix-after-registration.png" alt-text="Screenshot of registered prefixes blade showing a new prefix added." :::

For a registered prefix to become validated, the following checks must pass:

* The prefix can't be in a private range
* The origin ASN must be registered in a major routing registry
* All connections in the parent peering must advertise routes for the prefix
* Routes must be advertised with the Peering Service community string 8075:8007
* AS paths in your routes can't exceed a path length of 3, and can't contain private ASNs or AS prepending

For more information on registered prefix requirements and how to troubleshoot validation errors, see [Peering Registered Prefix Requirements](./peering-registered-prefix-requirements.md).

### 2. Activate your prefixes

In the previous section, you registered prefixes and generated prefix keys. Prefix registration DOES NOT activate the prefix for optimized routing (and doesn't accept <\/24 prefixes). Prefix activation and appropriate interconnect location are requirements for optimized routing (to ensure cold potato routing).

1. To begin activating your prefixes, in the search box at the top of the portal, enter *peering service*. Select **Peering Services** in the search results.

    :::image type="content" source="./media/walkthrough-communications-services-partner/peering-service-portal-search.png" alt-text="Screenshot shows how to search for Peering Service in the Azure portal.":::

1. Select **Create** to create a new Peering Service connection.

    :::image type="content" source="./media/walkthrough-communications-services-partner/peering-service-list.png" alt-text="Screenshot shows the list of existing Peering Service connections in the Azure portal.":::

1. In the **Basics** tab, enter or select your subscription, resource group, and Peering Service connection name.

    :::image type="content" source="./media/walkthrough-communications-services-partner/peering-service-basics.png" alt-text="Screenshot shows the Basics tab of creating a Peering Service connection in the Azure portal.":::

1. In the **Configuration** tab, choose your country, state/province, your provider name, the primary peering location, and optionally the backup peering location. 

    > [!CAUTION] 
    > If you choose **None** as the provider backup peering location when creating a Peering Service, you will not have geo-redundancy.

1. In the **Prefixes** section, create prefixes corresponding to the prefixes you registered in the previous step. Enter the name of the prefix, the prefix string, and the prefix key you obtained when you registered the prefix. Know that you don't have to create all of your peering service prefixes when creating a peering service, you can add them later.

    > [!NOTE] 
    > Ensure that the prefix key you enter when creating a peering service prefix matches the prefix key generated when you registered that prefix.

    :::image type="content" source="./media/walkthrough-communications-services-partner/configure-peering-service-prefix.png" alt-text="Screenshot of th the Configuration tab of creating a Peering Service connection in the Azure portal.":::

1. Select **Review + create**.

1. Review the settings, and then select **Create**.

After you create a Peering Service prefix, it will be queued for validation. The validation state of the prefix can be found in the Peering Service Prefixes page.

:::image type="content" source="./media/walkthrough-communications-services-partner/activated-prefixes.png" alt-text="Screenshot shows activated Peering service prefixes.":::

For a peering service prefix to become validated, the following checks MUST pass:

* The prefix can't be in a private range
* The origin ASN must be registered in a major routing registry
* The prefix must be registered, and the prefix key in the peering service prefix must match the prefix key of the corresponding registered prefix
* All primary and backup sessions (if configured) must advertise routes for the prefix
* Routes must be advertised with the Peering Service community string 8075:8007
* AS paths in your routes can't exceed a path length of 3, and can't contain private ASNs or AS prepending

For more information on Peering Service prefix requirements and how to troubleshoot validation errors, see [Peering Service Prefix Requirements](../peering-service/peering-service-prefix-requirements.md).

After a prefix passes validation, then activation for that prefix is complete.

## Frequently asked questions (FAQ):

**Q.**   When will my BGP peer come up?

**A.**   After the LAG comes up, our automated process configures BGP with BFD. Peer must configure BGP with BFD. Note, BFD must be configured and up on the non-MSFT peer to start route exchange.

**Q.**   When will peering IP addresses be allocated and displayed in the Azure portal?

**A.**   Our automated process allocates addresses and sends the information via email after the port is configured on our side.

**Q.**	I have smaller subnets (</24) for my communications services. Can I get the smaller subnets also routed?

**A.**	Yes, Microsoft Azure Peering service supports smaller prefix routing also. Ensure that you're registering the smaller prefixes for routing and the same are announced over the interconnects.

**Q.**	What Microsoft routes will we receive over these interconnects?

**A.** Microsoft announces all of Microsoft's public service prefixes over these interconnects to ensure not only voice but other cloud services are accessible from the same interconnect.

**Q.** My peering registered prefix has failed validation. How should I proceed?

**A.** Review the [Peering Registered Prefix Requirements](./peering-registered-prefix-requirements.md) and follow the troubleshooting steps described.

**Q.** My peering service prefix has failed validation. How should I proceed?

**A.** Review the [Peering Service Prefix Requirements](../peering-service/peering-service-prefix-requirements.md) and follow the troubleshooting steps described.

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

---
title: Internet peering for Peering Service Voice walkthrough
description: Learn about Internet peering for Peering Service Voice Services, its requirements, the steps to establish direct interconnect, and how to register a prefix.
author: halkazwini
ms.author: halkazwini
ms.service: internet-peering
ms.topic: how-to
ms.date: 10/23/2024
---

# Establish internet peering for a Peering Service voice services provider

In this article, you learn how to establish a Peering Service interconnect between a voice services provider and Microsoft.

A *voice services provider* is an organization that offers communication services (messaging, conferencing, and other communications services) and that wants to integrate their communications services infrastructure (SBC, SIP gateways, and other infrastructure devices) with Azure Communication Services and Microsoft Teams.

Internet peering supports voice services providers to establish direct interconnect with Microsoft at any of its edge sites (POP locations). The list of all the public edges sites is available in [PeeringDB](https://www.peeringdb.com/net/694).

Internet peering provides highly reliable and Quality of Service (QoS)-enabled interconnect for Communications Services to ensure high quality and performance-centric services.

The following flowchart summarizes the process to onboard to Peering Service voice services:

:::image type="content" source="media/walkthrough-communications-services-partner/communications-services-partner-onboarding-flowchart.png" border="false" alt-text="Diagram that shows the flowchart of the onboarding process for Peering Service voice services partners." :::

## Technical requirements

To establish direct interconnect for Peering Service voice services, these requirements must be met:

- The peer *must* provide its own Autonomous System Number (ASN), which *must* be public.
- The peer *must* have redundant Interconnect (PNI) at each interconnect location to ensure local redundancy.
- The peer *must* supply and advertise their own publicly routable IPv4 address space used by Peer's endpoints (for example, SBC).
- The peer *must* run BGP over Bidirectional Forwarding Detection (BFD) to facilitate subsecond route convergence.
- The peer *must* NOT terminate the peering on a device running a stateful firewall.
- The Peer CANNOT have two local connections configured on the same router, as diversity is required
- The Peer CANNOT apply rate limiting to their connection
- The Peer CANNOT configure a local redundant connection as a backup connection. Backup connections must be in a different location than primary connections.
- Primary, backup, and redundant sessions all must have the same bandwidth
- We recommend that you create Peering Service peerings in multiple locations to achieve geo-redundancy.
- All infrastructure prefixes are registered in the Azure portal and advertised with the community string `8075:8007`.
- Microsoft configures all the interconnect links as link aggregation groups (LAGs) by default, so the peer *must* support Link Aggregation Control Protocol (LACP) on the interconnect links.

## Establish Direct Interconnect with Microsoft for Peering Service Voice Services

To establish a direct interconnect with Microsoft using Internet peering, follow these steps:

### 1. Associate your public ASN with your Azure subscription

See [Associate peer ASN to Azure subscription using the Azure portal](./howto-subscription-association-portal.md) to learn how to Associate your public ASN with your Azure subscription. If the ASN has already been associated, proceed to the next step.

### 2. Create a Peering Service Voice Services peering

1. To create a peering resource for Peering Service Voice Services, search for **Peerings** in the Azure portal.

    :::image type="content" source="./media/walkthrough-communications-services-partner/internet-peering-portal-search.png" alt-text="Screenshot shows how to search for Peering resources in the Azure portal.":::

1. Select **Create**.

    :::image type="content" source="./media/walkthrough-communications-services-partner/create-peering.png" alt-text="Screenshot shows how to create a Peering resource in the Azure portal.":::

1. On the **Basics** tab, enter or select your Azure subscription, resource group, name, and ASN of the peering:

    :::image type="content" source="./media/walkthrough-communications-services-partner/create-peering-basics.png" alt-text="Screenshot of the Basics tab of creating a peering in the Azure portal.":::

    > [!WARNING]
    > These details options CAN'T be changed after the peering is created. confirm they are correct before creating the peering.

1. On the **Configuration** tab, you *must* choose the following required configurations:

    - **Peering type**: **Direct**
    - **Microsoft network**: **AS8075 (with Voice)**
    - **SKU**: **Premium Free**

1. For **Metro**, select the relevant value, and then select **Create new** to add a connection to your peering.

    :::image type="content" source="./media/walkthrough-communications-services-partner/create-peering-configuration.png" alt-text="Screenshot of the Configuration tab of creating a peering in the Azure portal.":::

1. For **Direct Peering Connection**, enter or select your peering facility details, and then select **Save**.

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

To begin registration:

1. In the Azure portal, go to your peering.

1. In the service menu under **Settings**, select **Registered prefixes**.

1. In **Registered prefixes**, select **Add registered prefix**.

    :::image type="content" source="./media/walkthrough-communications-services-partner/add-registered-prefix.png" alt-text="Screenshot of the Registered prefix pane in the Azure portal.":::

    > [!NOTE]
    > If the **Add registered prefix** button is disabled, then your peering doesn't have any active connections. Wait until a connection appears as **Active** to register your prefix.

1. Enter a name for your prefix and the IPv4 prefix string. Then select **Save**.

    :::image type="content" source="./media/walkthrough-communications-services-partner/register-prefix-configure.png" alt-text="Screenshot that shows registering a peering service prefix in the Azure portal.":::

After the prefix is created, to view the generated peering service prefix key, go to the Registered ASN resource pane.

:::image type="content" source="./media/walkthrough-communications-services-partner/registered-prefix-details.png" alt-text="Screenshot of registered prefix details.":::

After you create a registered prefix, the prefix is queued for validation. You can view the validation state of the prefix on the Registered prefixes pane.

:::image type="content" source="./media/walkthrough-communications-services-partner/prefix-after-registration.png" alt-text="Screenshot of registered prefixes blade showing a new prefix added." :::

For a registered prefix to become validated, the following checks must pass:

- The prefix can't be in a private range.
- The origin ASN must be registered in a major routing registry.
- All connections in the parent peering must advertise routes for the prefix.
- Routes must be advertised by using the Peering Service community string `8075:8007`.
- Autonomous System (AS) paths in your routes can't exceed a path length of three, and they can't contain private ASNs or AS prepending.

For more information on registered prefix requirements and how to troubleshoot validation problems, see [Peering registered prefix requirements](./peering-registered-prefix-requirements.md).

### Activate your prefixes

In the previous section, you registered prefixes and generated prefix keys. Prefix registration DOES NOT activate the prefix for optimized routing (and doesn't accept <\/24 prefixes). Prefix activation and appropriate interconnect location are requirements for optimized routing (to ensure cold potato routing).

1. To begin activating your prefixes, in the search box at the top of the portal, enter **peering service**. Select **Peering Services** in the search results.

    :::image type="content" source="./media/walkthrough-communications-services-partner/peering-service-portal-search.png" alt-text="Screenshot shows how to search for Peering Service in the Azure portal.":::

1. Select **Create** to create a new Peering Service connection.

    :::image type="content" source="./media/walkthrough-communications-services-partner/peering-service-list.png" alt-text="Screenshot shows the list of existing Peering Service connections in the Azure portal.":::

1. On the **Basics** tab, enter or select your subscription, resource group, and your Peering Service connection name.

    :::image type="content" source="./media/walkthrough-communications-services-partner/peering-service-basics.png" alt-text="Screenshot shows the Basics tab of creating a Peering Service connection in the Azure portal.":::

1. On the **Configuration** tab, select your country, state/province, provider name, and the primary peering location. Optionally, select the backup peering location.

    > [!CAUTION]
    > If you select **None** as the provider backup peering location when you create your instance of Peering Service, your peering service won't have geo-redundancy.

1. In the **Prefixes** section, create prefixes corresponding to the prefixes you registered in the previous step. Enter the name of the prefix, the prefix string, and the prefix key you obtained when you registered the prefix. Know that you don't have to create all of your peering service prefixes when creating a peering service, you can add them later.

    > [!NOTE]
    > Ensure that the prefix key you enter when creating a peering service prefix matches the prefix key generated when you registered that prefix.

    :::image type="content" source="./media/walkthrough-communications-services-partner/configure-peering-service-prefix.png" alt-text="Screenshot of th the Configuration tab of creating a Peering Service connection in the Azure portal.":::

1. Select **Review + create**.

1. Review the settings, and then select **Create**.

After you create a peering service prefix, the prefix is queued for validation. To check the validation state of the prefix, go to the peering service Prefixes pane.

:::image type="content" source="./media/walkthrough-communications-services-partner/activated-prefixes.png" alt-text="Screenshot shows activated peering service prefixes.":::

For a peering service prefix to be validated, the following checks *must* pass:

- The prefix can't be in a private range.
- The origin ASN must be registered in a major routing registry.
- The prefix must be registered, and the prefix key in the peering service prefix must match the prefix key of the corresponding registered prefix.
- All primary and backup sessions (if configured) must advertise routes for the prefix.
- Routes must be advertised with the Peering Service community string 8075:8007.
- AS paths in your routes can't exceed a path length of 3, and can't contain private ASNs or AS prepending.

For more information about prefix requirements for your peering service and how to troubleshoot validation problems, see [Peering service prefix requirements](../peering-service/peering-service-prefix-requirements.md).

After a prefix passes validation, activation for that prefix is completed.

## FAQ

Get answers to frequently asked questions.

**Q.**   When will my BGP peer come up?

**A.**   After the LAG comes up, our automated process configures Border Gateway Protocol (BGP) with BFD. Peer must configure BGP with BFD. Note, BFD must be configured and up on the non-MSFT peer to start route exchange.

**Q.**   When will peering IP addresses be allocated and displayed in the Azure portal?

**A.**   Our automated process allocates addresses and sends the information via email after the port is configured on our side.

**Q.** I have smaller subnets (\<\/24) for my communications services. Are smaller subnets also routed?

**A.** Yes, Peering Service supports smaller prefix routing. Ensure that you register the smaller prefixes for routing, and then they are announced over the interconnects.

**Q.** What Microsoft routes will we receive over these interconnects?

**A.** Microsoft announces all of Microsoft's public service prefixes over these interconnects to ensure not only voice but other cloud services are accessible from the same interconnect.

**Q.** My peering registered prefix has failed validation. How should I proceed?

**A.** Review the [Peering Registered Prefix Requirements](./peering-registered-prefix-requirements.md) and follow the troubleshooting steps described.

**Q.** My peering service prefix failed validation. How should I proceed?

**A.** Review [Peering Service prefix requirements](../peering-service/peering-service-prefix-requirements.md) and follow the troubleshooting steps that are described.

**Q.**   Are there any AS path constraints?

**A.**   Yes, a private ASN can't be in the AS path. For registered prefixes smaller than /24, the AS path must be less than four.

**Q.** I need to set the prefix limit, how many routes Microsoft would be announcing?

**A.** Microsoft announces roughly 280 prefixes on the internet. It might increase by 10 percent to 15 percent in the future. A safe limit of 400 to 500 might be good to set as the value for **Max prefix count**.

**Q.** Will Microsoft re-advertise the peer prefixes to the internet?

**A.** No.

**Q.** Is there a fee for this service?

**A.** No. However, the peer is expected to carry site cross-connect costs.

**Q.** What is the minimum link speed for an interconnect?

**A.** 10 Gbps.

**Q.** Is the peer bound to an SLA?

**A.** Yes. When utilization reaches 40%, a LAG augmentation process that lasts 45 to 60 days begins.

**Q.** What is the advantage of this service over current direct peering or Azure ExpressRoute?

**A.** Settlement free and entire path is optimized for voice traffic over Microsoft WAN. Convergence is tuned for subsecond with BFD.

**Q.** How long does it take to complete the onboarding process?

**A.** Time is variable depending on the number and the location of sites, and whether the peer is migrating existing private peerings or establishing new cabling. The carrier should plan for three weeks or more.

**Q.** How is progress communicated outside of status in the Azure portal?

**A.** Automated emails are sent at varying milestones.

**Q.** Can we use APIs for onboarding?

**A.** Currently there's no API support, and configuration must be performed via web portal.

---
title: Establish an interconnect for internet peering
titleSuffix: Internet peering
description: Learn how to establish an interconnect for internet peering in Azure Peering Service voice services. Learn the requirements, the steps to establish a direct interconnect, and how to register a prefix.
author: halkazwini
ms.author: halkazwini
ms.service: internet-peering
ms.topic: how-to
ms.date: 10/23/2024
---

# Establish an interconnect for internet peering

In this article, you learn how to establish an interconnect between a voice services provider and Azure Peering Service.

A *voice services provider* is an organization that offers communication services like messaging, conferencing, and other communications services. In this scenario, the provider wants to integrate its communications services infrastructure with Azure Communication Services and Microsoft Teams. The infrastructure might include session border controllers (SBCs), Session Initiation Protocol (SIP) gateways, and other infrastructure devices.

Internet peering in Azure Peering Service supports direct interconnects with Microsoft at any of its edge sites (POP locations) for internet exchange partners (IXPs). The list of all the public edge sites is available in [PeeringDB](https://www.peeringdb.com/net/694).

Internet peering provides highly reliable and QoS (Quality of Service)-enabled interconnect for IXPs to ensure high quality and performance-centric services.

The following flowchart summarizes the process to onboard to Peering Service voice services:

:::image type="content" source="media/walkthrough-communications-services-partner/communications-services-partner-onboarding-flowchart.png" border="false" alt-text="Diagram that shows the flowchart of the onboarding process for Peering Service voice services partners." :::

## Technical requirements

To establish direct interconnect for Peering Service voice services, these requirements must be met:

- The peer *must* provide its own Autonomous System Number (ASN), which *must* be public.
- The peer *must* have a redundant Private Network Interconnect (PNI) at each interconnect location to ensure local redundancy.
- The peer *must* supply and advertise its own publicly routable IPv4 address space that's used by the peer's endpoints (for example, an SBC).
- The peer *must* run Border Gateway Protocol (BGP) over Bidirectional Forwarding Detection (BFD) to facilitate subsecond route convergence.
- The peer *must not* terminate the peering on a device running a stateful firewall.
- The peer *can't* have two local connections configured on the same router. Diversity is required.
- The peer *can't* apply rate limiting to its connection.
- The peer *can't* configure a local redundant connection as a backup connection. Backup connections must be in a different location than the primary connection.
- Primary sessions, backup sessions, and redundant sessions must all have the same bandwidth.
- We recommend that you create Peering Service peerings in multiple locations to achieve geo-redundancy.
- All infrastructure prefixes are registered in the Azure portal and advertised with the community string `8075:8007`.
- The peer *must* support Link Aggregation Control Protocol (LACP) on the interconnect links. Microsoft configures all interconnect links as link aggregation groups (LAGs) by default.

## Establish a direct interconnect for Peering Service voice services

To establish a direct interconnect with Microsoft for Peering Service voice services, complete the steps described in the following sections.

### Associate your public ASN with your Azure subscription

For more information, see [Associate a peer ASN to an Azure subscription](./howto-subscription-association-portal.md). If the ASN is already associated with your Azure subscription, go to the next step.

### Create a Peering Service voice services peering

1. To create a peering resource for Peering Service voice services, search for and then select **Peerings** in the Azure portal.

    :::image type="content" source="./media/walkthrough-communications-services-partner/internet-peering-portal-search.png" alt-text="Screenshot that shows how to search for Peering resources in the Azure portal.":::

1. Select **Create**.

    :::image type="content" source="./media/walkthrough-communications-services-partner/create-peering.png" alt-text="Screenshot that shows how to create a peering resource in the Azure portal.":::

1. On the **Basics** tab, enter or select your Azure subscription, the resource group, the peering name, and the ASN of the peering.

    :::image type="content" source="./media/walkthrough-communications-services-partner/create-peering-basics.png" alt-text="Screenshot that shows the Basics tab of creating a peering in the Azure portal.":::

    > [!WARNING]
    > You can't change these options after the peering is created. Confirm that your selections are correct before you create the peering.

1. On the **Configuration** tab, you *must* choose the following required configurations:

    - **Peering type**: **Direct**
    - **Microsoft network**: **AS8075 (with Voice)**
    - **SKU**: **Premium Free**

1. For **Metro**, select the relevant value. Then select **Create new** to add a connection to your peering.

    :::image type="content" source="./media/walkthrough-communications-services-partner/create-peering-configuration.png" alt-text="Screenshot that shows the Configuration tab of creating a peering in the Azure portal.":::

1. For **Direct Peering Connection**, enter or select your peering facility details. Then select **Save**.

    :::image type="content" source="./media/walkthrough-communications-services-partner/direct-peering-connection.png" alt-text="Screenshot that shows creating a direct peering connection.":::

    Peering connections configured for Peering Service voice services *must* have **Microsoft** selected for **Session Address Provider**, and **Use for Peering Service** must be enabled. These options are set automatically. Microsoft must be the IP provider for Peering Service voice services. You can't provide your own IP addresses.

1. On **Create a peering**, select **Create new** to add a second connection to your peering. The peering must have at least two connections. Local redundancy is a requirement for Peering Service. Creating a peering with two sessions achieves this requirement.

    :::image type="content" source="./media/walkthrough-communications-services-partner/two-connections-peering.png" alt-text="Screenshot that shows the Configuration tab after two connections are created.":::

1. Select **Review + create**. Review the summary, and then select **Create** when validation passes.

Allow time for the resource to finish deploying. When deployment is successful, your peering is created and provisioning begins.

## Configure optimized routing for your prefixes

To get optimized routing for your prefixes with your Peering Service voice services interconnects, complete the steps described in the following sections.

### Register your prefixes

For optimized routing for voice services infrastructure prefixes, you must register them.

> [!NOTE]
> The connection state of your peering connections must be **Active** before you register any prefixes.

Ensure that the registered prefixes are announced over the direct interconnects established with your peering. If the same prefix is announced in multiple peering locations, you *don't* have to register the prefix in each location. A prefix can be registered only with a single peering. When you receive the unique prefix key after validation, this key is used for the prefix, even in locations other than the location of the peering it was registered under.

To begin registration:

1. In the Azure portal, go to your peering.

1. On the service menu under **Settings**, select **Registered prefixes**.

1. In **Registered prefixes**, select **Add registered prefix**.

    :::image type="content" source="./media/walkthrough-communications-services-partner/add-registered-prefix.png" alt-text="Screenshot that shows the Registered prefix pane in the Azure portal.":::

    > [!NOTE]
    > If the **Add registered prefix** button is disabled, then your peering doesn't have any active connections. Wait until a connection appears as **Active** to register your prefix.

1. Enter a name for your prefix and the IPv4 prefix string. Then select **Save**.

    :::image type="content" source="./media/walkthrough-communications-services-partner/register-prefix-configure.png" alt-text="Screenshot that shows registering a Peering Service prefix in the Azure portal.":::

After the prefix is created, to view the generated Peering Service prefix key, go to the **Registered ASN resource** pane.

:::image type="content" source="./media/walkthrough-communications-services-partner/registered-prefix-details.png" alt-text="Screenshot that shows registered prefix details.":::

After you create a registered prefix, the prefix is queued for validation. You can view the validation state of the prefix on the Registered prefixes pane.

:::image type="content" source="./media/walkthrough-communications-services-partner/prefix-after-registration.png" alt-text="Screenshot that shows registered prefixes pane showing a new prefix added." :::

For a registered prefix to become validated, the following checks must pass:

- The prefix can't be in a private range.
- The origin ASN must be registered in a major routing registry.
- All connections in the parent peering must advertise routes for the prefix.
- Routes must be advertised by using the Peering Service community string `8075:8007`.
- Autonomous System (AS) paths in your routes can't exceed a path length of three, and they can't contain private ASNs or AS prepending.

For more information on registered prefix requirements and how to troubleshoot validation problems, see [Peering registered prefix requirements](./peering-registered-prefix-requirements.md).

### Activate your prefixes

In the previous section, you registered prefixes and generated prefix keys. Prefix registration *doesn't* activate the prefix for optimized routing (and it doesn't accept \<\/24 prefixes). Prefix activation and appropriate interconnect location are requirements for optimized routing (they ensure cold-potato routing).

1. To begin activating your prefixes, in the search box at the top of the portal, enter **peering service**. In the search results, select **Peering Services**.

    :::image type="content" source="./media/walkthrough-communications-services-partner/peering-service-portal-search.png" alt-text="Screenshot that shows how to search for Peering Service in the Azure portal.":::

1. Select **Create** to create a new Peering Service connection.

    :::image type="content" source="./media/walkthrough-communications-services-partner/peering-service-list.png" alt-text="Screenshot that shows the list of existing Peering Service connections in the Azure portal.":::

1. On the **Basics** tab, enter or select your Azure subscription, the resource group name, and your Peering Service connection name.

    :::image type="content" source="./media/walkthrough-communications-services-partner/peering-service-basics.png" alt-text="Screenshot that shows the Basics tab of creating a Peering Service connection in the Azure portal.":::

1. On the **Configuration** tab, select your country or region, state or province, provider name, and the primary peering location. Optionally, select the backup peering location.

    > [!CAUTION]
    > If you select **None** as the provider backup peering location when you create your instance of Peering Service, your peering won't have geo-redundancy.

1. In the **Prefixes** section, create prefixes that correspond to the prefixes you registered in the previous step. Enter the name of the prefix, the prefix string, and the prefix key you obtained when you registered the prefix. You don't have to create all Peering Service prefixes when you create a peering. You can add prefixes later.

    > [!NOTE]
    > Ensure that the prefix key you enter when you create a Peering Service prefix matches the prefix key that was generated when you registered the prefix.

    :::image type="content" source="./media/walkthrough-communications-services-partner/configure-peering-service-prefix.png" alt-text="Screenshot that shows th the Configuration tab of creating a Peering Service connection in the Azure portal.":::

1. Select **Review + create**.

1. Review the settings, and then select **Create**.

After you create a Peering Service prefix, the prefix is queued for validation. To check the validation state of the prefix, go to the Peering Service Prefixes pane.

:::image type="content" source="./media/walkthrough-communications-services-partner/activated-prefixes.png" alt-text="Screenshot that shows activated Peering Service prefixes.":::

For a Peering Service prefix to pass validation, the following checks must pass:

- The prefix can't be in a private range.
- The origin ASN must be registered in a major routing registry.
- The prefix must be registered, and the prefix key in the Peering Service prefix must match the prefix key of the corresponding registered prefix.
- All primary sessions and backup sessions (if configured) must advertise routes for the prefix.
- Routes must be advertised with the Peering Service community string `8075:8007`.
- AS paths in your routes can't exceed a path length of three, and they can't contain private ASNs or AS prepending.

For more information about prefix requirements for Peering Service and how to troubleshoot validation problems, see [Peering Service prefix requirements](../peering-service/peering-service-prefix-requirements.md).

After a prefix passes validation, activation for that prefix is completed.

## FAQ

Get answers to frequently asked questions.

**Q.** When will my BGP mesh be available?

**A.** When LAG is running, our automated process provisions the BGP mesh with BFD. The peer must configure BGP with BFD. BFD must be configured and running on the non-MSFT peer to start route exchange.

**Q.** When are peering IP addresses allocated and shown in the Azure portal?

**A.** Our automated process allocates addresses and sends the information via email after the port is configured on our side.

**Q.** I have smaller subnets (\<\/24) for my communications services. Are smaller subnets also routed?

**A.** Yes, Peering Service supports smaller prefix routing. Ensure that you register the smaller prefixes for routing. Then, they're announced over the interconnects.

**Q.** What Microsoft routes do we receive over the interconnects?

**A.** Microsoft announces all Microsoft public service prefixes over the interconnects to ensure that voice and other cloud services are accessible from the same interconnect.

**Q.** My peering registered prefix failed validation. How should I proceed?

**A.** Review the [peering registered prefix requirements](./peering-registered-prefix-requirements.md) and follow the troubleshooting steps that are described.

**Q.** My Peering Service prefix failed validation. How should I proceed?

**A.** Review the [Peering Service prefix requirements](../peering-service/peering-service-prefix-requirements.md) and follow the troubleshooting steps that are described.

**Q.** Do I need to be aware of any AS path constraints?

**A.** Yes. A private ASN can't be in the AS path. For registered prefixes smaller than \/24, the AS path must be less than four.

**Q.** I need to set the prefix limit. How many routes will Microsoft announce?

**A.** Microsoft announces roughly 280 prefixes on the internet. The number might increase by 10% to 15% in the future. A limit of 400 to 500 is safe to set as the value for **Max prefix count**.

**Q.** Will Microsoft readvertise peer prefixes to the internet?

**A.** No.

**Q.** Is there a fee for this service?

**A.** No. However, the peer is expected to carry site cross-connect costs.

**Q.** What is the minimum link speed for an interconnect?

**A.** 10 Gbps.

**Q.** Is the peer bound to a service-level agreement (SLA)?

**A.** Yes. When utilization reaches 40%, an LAG augmentation process that lasts 45 to 60 days begins.

**Q.** What is the advantage of this service over current direct peering or Azure ExpressRoute?

**A.** This service is settlement free, and the entire path is optimized for voice traffic over the Microsoft wide area network (WAN). Convergence is tuned to the subsecond via BFD.

**Q.** How long is the onboarding process?

**A.** The time it takes to complete onboarding varies based on the number and location of sites, and whether the peer migrates existing private peerings or establishes new cabling. The carrier should plan for three weeks or more.

**Q.** How is progress communicated outside of status in the Azure portal?

**A.** Automated emails are sent at varying milestones.

**Q.** Can we use APIs for onboarding?

**A.** Currently, there's no API support. You can configure your service only by using the Azure portal.

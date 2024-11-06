---
title: Set up an interconnect for peering with exchange route server
titleSuffix: Internet peering
description: Learn how to set up an interconnect for a peering with exchange route server in Azure Peering Service. Learn the requirements, the steps to establish a direct interconnect, and how to register your ASN.
author: halkazwini
ms.author: halkazwini
ms.service: internet-peering
ms.topic: how-to
ms.date: 10/24/2024
---

# Set up an interconnect for peering with exchange route server

In this article, you learn how to establish an interconnect for a peering with exchange route server in Azure Peering Service.

Internet peering in Azure Peering Service supports direct interconnects with Microsoft at any of its point-of-presence (PoP) edge sites for internet exchange partners (IXPs). The list of all the public edge sites is available on [PeeringDB](https://www.peeringdb.com/net/694).

Internet peering provides highly reliable and Quality of Service (QoS)-enabled interconnect for IXPs to ensure high-quality, performance-centric services.

The following flowchart summarizes the process to onboard to Peering Service with exchange route server:

:::image type="content" source="media/walkthrough-exchange-route-server-partner/peering-services-partner-onboarding-flowchart.png"  border="false" alt-text="Diagram that shows a flowchart of the onboarding process for Exchange with Route Server partners." lightbox="media/walkthrough-exchange-route-server-partner/peering-services-partner-onboarding-flowchart.png":::

## Technical requirements

To establish Peering Service with exchange route server, follow these requirements:

- The peer must provide its own autonomous system number (ASN), which must be public.
- The peer must have a redundant Private Network Interconnect (PNI) at each interconnect location to ensure local redundancy.
- The peer must supply and advertise its own publicly routable IPv4 address space that's used by the peer's endpoints (for example, by an SBC).
- The peer must not terminate the peering on a device running a stateful firewall.
- The peer can't have two local connections configured on the same router. Diversity is required.
- The peer can't apply rate limiting to its connection.
- The peer can't configure a local redundant connection as a backup connection. Backup connections must be in a different location than the primary connection.
- Primary sessions, backup sessions, and redundant sessions must all have the same bandwidth.
- We recommend that you create Peering Service peerings in multiple locations to achieve geo-redundancy.
- All infrastructure prefixes are registered in the Azure portal and advertised by using the community string `8075:8007`.
- The peer must support Link Aggregation Control Protocol (LACP) on the interconnect links. Microsoft configures all interconnect links as link aggregation groups (LAGs) by default.

## Establish a direct interconnect for a peering with exchange route server

To establish a Peering Service with exchange route server interconnect with Microsoft, complete the steps described in the following sections.

### Associate your public ASN with your Azure subscription

The first step is to associate your public ASN with your Azure subscription.

For more information, see [Associate a peer ASN with an Azure subscription](./howto-subscription-association-portal.md).

If the ASN is already associated with your Azure subscription, go to the next step.

### Create a Peering Service peering with exchange route server

1. To create a Peering Service peering with exchange route server resource, in the Azure portal, search for and then select **Peerings**.

    :::image type="content" source="./media/walkthrough-exchange-route-server-partner/internet-peering-portal-search.png" alt-text="Screenshot that shows how to search for Peering resources in the Azure portal." lightbox="./media/walkthrough-exchange-route-server-partner/internet-peering-portal-search.png":::

1. On **Peerings**, select **Create**.

    :::image type="content" source="./media/walkthrough-exchange-route-server-partner/create-peering.png" alt-text="Screenshot that shows how to create a Peering resource in the Azure portal." lightbox="./media/walkthrough-exchange-route-server-partner/create-peering.png":::

1. On the **Basics** tab, enter or select your Azure subscription, the resource group, a peering name, and the ASN of the peering.

   :::image type="content" source="./media/walkthrough-exchange-route-server-partner/create-peering-basics.png" alt-text="Screenshot that shows the Basics tab of creating a peering in the Azure portal." lightbox="./media/walkthrough-exchange-route-server-partner/create-peering-basics.png":::

   > [!WARNING]
   > You can't change these options after the peering is created. Confirm that your selections are correct before you create the peering.

1. On the **Configuration** tab, select the following required configurations to create a peering for Peering Service with exchange route server:

   1. For **Peering type**, select **Direct**.

   1. For **Microsoft network**, select **AS8075 (with exchange route server)**.

   1. For **SKU**, select **Premium Free**.

   1. For **Metro**, select the relevant value. Then select **Create new** to add a connection to your peering.

      :::image type="content" source="./media/walkthrough-exchange-route-server-partner/create-peering-configuration.png" alt-text="Screenshot that shows the Configuration tab of creating a peering in the Azure portal." lightbox="./media/walkthrough-exchange-route-server-partner/create-peering-configuration.png":::

   1. For **Direct Peering Connection**, enter or select your peering facility details. Then select **Save**.

      :::image type="content" source="./media/walkthrough-exchange-route-server-partner/direct-peering-connection.png" alt-text="Screenshot that shows creating a direct peering connection." lightbox="./media/walkthrough-exchange-route-server-partner/direct-peering-connection.png":::

      Peering connections for Peering Service with exchange route server *must* have **Peer** selected for **Session Address Provider**, and **Use for Peering Service** must be enabled. These options are set automatically.

      Before you finalize your peering, make sure that the peering has at least one connection.

   > [!NOTE]
   > A peering with exchange route server is configured with a Border Gateway Protocol (BGP) mesh. You provide one peer IP and one Microsoft IP. The BGP mesh is then automatically created. Because of this delay, the number of connections that are shown in the peering is not equal to the number of sessions that are configured.
  
1. Select **Review + create**. Review the summary, and then select **Create** when validation passes.

    Allow time for the resource to finish deploying. When deployment is successful, your peering is created and provisioning begins.

## Configure optimized routing for your prefixes

To get optimized routing for your prefixes with your Peering Service peering with exchange route server interconnects, complete the steps described in the following sections.

### Register a customer ASN

Before prefixes can be optimized for a customer, the customer ASN must be registered.

> [!NOTE]
> The connection state of your peering connections must be **Active** before you can register an ASN.

1. In the Azure portal, go to your peering with exchange route server resource.

1. On the service menu under **Settings**, select **Registered ASNs**.

    :::image type="content" source="./media/walkthrough-exchange-route-server-partner/registered-asn.png" alt-text="Screenshot that shows how to go to Registered ASNs from the Peering Overview pane in the Azure portal." lightbox="./media/walkthrough-exchange-route-server-partner/registered-asn.png":::

1. Create a registered ASN by entering the customer's ASN and the customer name.

    :::image type="content" source="./media/walkthrough-exchange-route-server-partner/register-new-asn.png" alt-text="Screenshot that shows how to register an ASN in the Azure portal." lightbox="./media/walkthrough-exchange-route-server-partner/register-new-asn.png":::

    After the ASN is registered, a unique Peering Service prefix key that's used for activation is generated.

> [!NOTE]
> The same prefix key can be used for all prefixes that are activated by a customer, regardless of location. As a result, you don't need to register an ASN under more than one peering. Duplicate registration of an ASN is not allowed.

### Provide Peering Service prefix keys to customers for activation

When your customers onboard to Peering Service, they must follow the steps described in the [Peering Service customer walkthrough](../peering-service/customer-walkthrough.md). Your customers activate prefixes by using the Peering Service prefix key that was obtained during prefix registration. Provide this key to customers before they activate. The key is used for all prefixes during activation.

## FAQ

Get answers to frequently asked questions.

**Q.** When will my BGP mesh be available?

**A.** When LAG is running, our automated process provisions the BGP mesh. The peer must configure BGP.

**Q.** When are peering IP addresses allocated and shown in the Azure portal?

**A.** Our automated process allocates IP addresses and sends the information via email after the port is configured on the Microsoft side.

**Q.** I have smaller subnets (\<\/24) for my voice services. Are smaller subnets routed?

**A.** Yes, Peering Service supports smaller prefix routing. Ensure that you register the smaller prefixes for routing. Then, they're announced over the interconnects.

**Q.** What Microsoft routes do we receive over the interconnects?

**A.** Microsoft announces all Microsoft public service prefixes over the interconnects to ensure that voice and other cloud services are accessible from the same interconnect.

**Q.** Do I need to be aware of any AS path constraints?

**A.** Yes. A private ASN can't be in the AS path. For registered prefixes smaller than \/24, the AS path must be less than 4.

**Q.** I need to set the prefix limit. How many routes will Microsoft announce?

**A.** Microsoft announces roughly 280 prefixes on the internet. The number might increase by 10% to 15%. A limit of 400 to 500 is safe to set as the value for **Max prefix count**.

**Q.** Will Microsoft readvertise peer prefixes to the internet?

**A.** No.

**Q.** Is there a fee for this service?

**A.** No. However, the peer is expected to carry site cross-connect costs.

**Q.** What is the minimum link speed for an interconnect?

**A.** 10 Gbps.

**Q.** Is the peer bound to a service-level agreement (SLA)?

**A.** Yes. When utilization reaches 40%, an LAG augmentation process that lasts 45 to 60 days begins.

**Q.** How long is the onboarding process?

**A.** The time it takes to complete onboarding varies based on the number and location of sites, and whether the peer migrates existing private peerings or establishes new cabling. The carrier should plan for three weeks or more.

**Q.** How is progress communicated outside of status in the Azure portal?

**A.** Automated emails are sent at varying milestones.

**Q.** Can we use APIs for onboarding?

**A.** Currently, there's no API support. You can configure your service only by using the Azure portal.

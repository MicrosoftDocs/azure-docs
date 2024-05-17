---
title: Internet peering for Azure Peering Service Exchange with Route Server partner walkthrough
description: Learn about Internet peering for Peering Service Exchange with Route Server, its requirements, the steps to establish direct interconnect, and how to register your ASN.
author: halkazwini
ms.author: halkazwini
ms.service: internet-peering
ms.topic: how-to
ms.date: 07/23/2023
---

# Internet peering for Peering Service Exchange with Route Server partner walkthrough

In this article, you learn how to establish an Exchange with Route Server interconnect enabled for Azure Peering Service with Microsoft.

Internet peering supports internet exchange partners (IXPs) to establish direct interconnect with Microsoft at any of its edge sites (POP locations). The list of all the public edges sites is available in [PeeringDB](https://www.peeringdb.com/net/694).

Internet peering provides highly reliable and QoS (Quality of Service) enabled interconnect for IXPs to ensure high quality and performance centric services.

The following flowchart summarizes the process to onboard to Peering Service Exchange with Route Server:

:::image type="content" source="media/walkthrough-exchange-route-server-partner/peering-services-partner-onboarding-flowchart.png" alt-text="Diagram shows a flowchart of the onboarding process for Exchange with Route Server partners.":::

## Technical requirements

To establish a Peering Service Exchange with Route Server peering, follow these requirements:

-	The Peer MUST provide its own Autonomous System Number (ASN), which MUST be public.
-	The Peer MUST have redundant Interconnect (PNI) at each interconnect location to ensure local redundancy.
-	The Peer MUST supply and advertise their own publicly routable IPv4 address space used by Peer's endpoints (for example, SBC).
-	The Peer MUST NOT terminate the peering on a device running a stateful firewall.
-	The Peer CANNOT have two local connections configured on the same router, as diversity is required
-   The Peer CANNOT apply rate limiting to their connection
-   The Peer CANNOT configure a local redundant connection as a backup connection. Backup connections must be in a different location than primary connections.
-   Primary, backup, and redundant sessions all must have the same bandwidth
-	It's recommended to create Peering Service peerings in multiple locations so geo-redundancy can be achieved.
-	All origin ASNs are registered in Azure portal.
-	Microsoft configures all the interconnect links as LAG (link bundles) by default, so, peer MUST support LACP (Link Aggregation Control Protocol) on the interconnect links.

## Establish Direct Interconnect with Microsoft for Peering Service Exchange with Route Server

To establish a Peering Service Exchange with Route Server interconnect with Microsoft, follow these steps:

### 1. Associate your public ASN with your Azure subscription.

See [Associate peer ASN to Azure subscription using the Azure portal](howto-subscription-association-portal.md) to learn how to Associate your public ASN with your Azure subscription. If the ASN has already been associated, proceed to the next step.

### 2. Create a Peering Service Exchange with Route Server peering.

1.  To create a Peering Service Exchange with Route Server peering resource, search for **Peerings** in the Azure portal.

    :::image type="content" source="./media/walkthrough-exchange-route-server-partner/internet-peering-portal-search.png" alt-text="Screenshot shows how to search for Peering resources in the Azure portal.":::

1. Select **+ Create**.

    :::image type="content" source="./media/walkthrough-exchange-route-server-partner/create-peering.png" alt-text="Screenshot shows how to create a Peering resource in the Azure portal.":::

1. In the **Basics** tab, enter or select your Azure subscription, resource group, name, and ASN of the peering:

    :::image type="content" source="./media/walkthrough-exchange-route-server-partner/create-peering-basics.png" alt-text="Screenshot of the Basics tab of creating a peering in the Azure portal.":::

    > [!NOTE] 
    > These details you select CAN'T be changed after the peering is created. confirm they are correct before creating the peering.

1. In the **Configuration** tab, you MUST choose the following required configurations to create a peering for Peering Service Exchange with Route Server:

    - Peering type: **Direct**.
    - Microsoft network: **AS8075 (with exchange route server)**.
    - SKU: **Premium Free**.

1. Select your **Metro**, then select **Create new** to add a connection to your peering.

    :::image type="content" source="./media/walkthrough-exchange-route-server-partner/create-peering-configuration.png" alt-text="Screenshot of the Configuration tab of creating a peering in the Azure portal.":::

1. In **Direct Peering Connection**, enter or select your peering facility details then select **Save**.

    :::image type="content" source="./media/walkthrough-exchange-route-server-partner/direct-peering-connection.png" alt-text="Screenshot of creating a direct peering connection.":::

    Peering connections for Peering Service Exchange with Route Server MUST have **Peer** as the Session Address Provider, and **Use for Peering Service** enabled. These options are chosen for you automatically.

    Before finalizing your Peering, make sure the peering has at least one connection.

    > [!NOTE] 
    > Exchange with Route Server peerings are configured with a BGP mesh. Provide one peer IP and one Microsoft IP and the BGP mesh will be handled automatically. The number of connections displayed in the peering will not be equal to the number of sessions configured because of this.
  
1. Select **Review + create**. Review the summary and select **Create** after the validation passes.

    Allow time for the resource to finish deploying. When deployment is successful, your peering is created and provisioning begins.

## Configure optimized routing for your prefixes

To get optimized routing for your prefixes with your Peering Service Exchange with Route Server interconnects, follow these steps:

### 1. Register a customer ASN

Before prefixes can be optimized for a customer, their ASN must be registered.

> [!NOTE] 
> The Connection State of your peering connections must be **Active** before registering an ASN.

1. Open your Peering Service Exchange with Route Server peering in the Azure portal, and select **Registered ASNs**.

    :::image type="content" source="./media/walkthrough-exchange-route-server-partner/registered-asn.png" alt-text="Screenshot shows how to go to Registered ASNs from the Peering Overview page in the Azure portal.":::

1. Create a Registered ASN by entering the customer's Autonomous System Number (ASN) and a name.

    :::image type="content" source="./media/walkthrough-exchange-route-server-partner/register-new-asn.png" alt-text="Screenshot shows how to register an ASN in the Azure portal.":::

    After your ASN is registered, a unique peering service prefix key used for activation will be generated.

> [!NOTE] 
> For every customer ASN you register, the ASN only needs to be registered with a single peering. The same prefix key can be used for all prefixes activated by that customer, regardless of location. As a result, it is not needed to register the ASN under more than one peering. Duplicate registration of an ASN is not allowed.

### 2. Provide peering service prefix keys to customers for activation

When your customers onboard to Peering Service, customers must follow the steps in [Peering Service customer walkthrough](../peering-service/customer-walkthrough.md) to activate prefixes using the Peering Service prefix key obtained during ASN registration. Provide this key to customers before they activate, as this key is used for all prefixes during activation.

## Frequently asked questions (FAQ):

**Q.**   When will my BGP peer come up?

**A.**   After the LAG comes up, our automated process configures BGP. Peer must configure BGP.

**Q.**   When will peering IP addresses be allocated and displayed in the Azure portal?

**A.**   Our automated process allocates addresses and sends the information via email after the port is configured on our side.

**Q.**	I have smaller subnets (</24) for my voice services. Can I get the smaller subnets also routed?

**A.**	Yes, Peering service supports smaller prefix routing also. Ensure that you're activating the smaller prefixes for routing and the same are announced over the interconnects.

**Q.**	What Microsoft routes will we receive over these interconnects?

**A.** Microsoft announces all of Microsoft's public service prefixes over these interconnects to ensure not only voice but other cloud services are accessible from the same interconnect.

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

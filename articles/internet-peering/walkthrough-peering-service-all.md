---
title: Internet peering for Azure Peering Service partner walkthrough
description: Learn about Internet peering for Azure Peering Service, its requirements, the steps to establish direct interconnect, and how to register a prefix.
author: halkazwini
ms.author: halkazwini
ms.service: internet-peering
ms.topic: how-to
ms.date: 08/09/2023
---

# Internet peering for Azure Peering Service partner walkthrough

In this article, you learn how to establish a Direct interconnect enabled for Azure Peering Service.

Internet peering supports Peering Service providers to establish direct interconnect with Microsoft at any of its edge sites (POP locations). The list of all the public edges sites is available in [PeeringDB](https://www.peeringdb.com/net/694).

Internet peering provides highly reliable and QoS (Quality of Service) enabled interconnect for Peering Services to ensure high quality and performance centric services.

The following flowchart summarizes the process to onboard to Peering Service:

:::image type="content" source="media/walkthrough-peering-service-all/peering-services-partner-onboarding-flowchart.png" alt-text="Diagram shows a flowchart of the onboarding process for Peering Service partners.":::

## Technical requirements

To establish direct interconnect for Peering Service, follow these requirements:

-	The Peer MUST provide its own Autonomous System Number (ASN), which MUST be public.
-	The Peer MUST have redundant Interconnect (PNI) at each interconnect location to ensure local redundancy.
-	The Peer MUST supply and advertise their own publicly routable IPv4 address space used by Peer's endpoints. 
-	The Peer MUST supply detail of what class of traffic and endpoints are housed in each advertised subnet.
-	The Peer MUST NOT terminate the peering on a device running a stateful firewall.
-	The Peer CANNOT have two local connections configured on the same router, as diversity is required.
-   The Peer CANNOT apply rate limiting to their connection.
-   The Peer CANNOT configure a local redundant connection as a backup connection. Backup connections must be in a different location than primary connections.
-	It's recommended to create Peering Service peerings in multiple locations so geo-redundancy can be achieved.
-   Primary, backup, and redundant sessions all must have the same bandwidth.
-	All infrastructure prefixes are registered in the Azure portal and advertised with community string 8075:8007.
-	Microsoft configures all the interconnect links as LAG (link bundles) by default, so, peer MUST support LACP (Link Aggregation Control Protocol) on the interconnect links.

## Establish Direct Interconnect for Peering Service

To establish a Peering Service interconnect with Microsoft, follow the following steps:

### 1. Associate your public ASN with your Azure subscription

See [Associate peer ASN to Azure subscription using the Azure portal](./howto-subscription-association-portal.md) to learn how to Associate your public ASN with your Azure subscription. If the ASN has already been associated, proceed to the next step.

### 2. Create a Peering Service peering

1. To create a Peering Service peering resource, search for **Peerings** in the Azure portal.

    :::image type="content" source="./media/walkthrough-peering-service-all/internet-peering-portal-search.png" alt-text="Screenshot shows how to search for Peering resources in the Azure portal.":::

1. Select **+ Create**.

    :::image type="content" source="./media/walkthrough-peering-service-all/create-peering.png" alt-text="Screenshot shows how to create a Peering resource in the Azure portal.":::

1. In the **Basics** tab, enter or select your Azure subscription, resource group, name, and ASN of the peering:

    :::image type="content" source="./media/walkthrough-peering-service-all/create-peering-basics.png" alt-text="Screenshot of the Basics tab of creating a peering in the Azure portal.":::

    > [!NOTE] 
    > These details CANNOT be changed after the peering is created. Please confirm they are correct before creating the peering.

1. In the **Configuration** tab, you MUST choose the following required configurations:

    - Peering type: **Direct**.
    - Microsoft network: **AS8075**.
    - SKU: **Premium Free**.

1. Select your **Metro**, then select **Create new** to add a connection to your peering.

    :::image type="content" source="./media/walkthrough-peering-service-all/create-peering-configuration.png" alt-text="Screenshot of the Configuration tab of creating a peering in the Azure portal.":::

1. In **Direct Peering Connection**, enter or select your peering facility details then select **Save**.

    :::image type="content" source="./media/walkthrough-peering-service-all/direct-peering-connection.png" alt-text="Screenshot of creating a direct peering connection.":::

    Peering Service peerings MUST have **Use for Peering Service** enabled.

Before finalizing your Peering, make sure the peering has at least two connections. Local redundancy is a requirement for Peering Service, and creating a Peering with two sessions achieves this requirement.

1. Select **Review + create**. Review the summary and select **Create** after the validation passes.

Allow time for the resource to finish deploying. When deployment is successful, your peering is created and provisioning begins.

## Configure optimized routing for your prefixes

To get optimized routing for your prefixes with your Peering Service interconnects, follow these steps:

### 1. Register your prefixes

For optimized routing for infrastructure prefixes, you must register them.

> [!NOTE] 
> The connection state of your peering connections must be **Active** before registering any prefixes.

Ensure that the registered prefixes are announced over the direct interconnects established with your peering. If the same prefix is announced in multiple peering locations, you do NOT have to register the prefix in every single location. A prefix can only be registered with a single peering. When you receive the unique prefix key after validation, this key will be used for the prefix even in locations other than the location of the peering it was registered under.

1. To begin registration, go to your peering in the Azure portal and select **Registered prefixes** under **Settings**.

1. In **Registered prefixes**, select **+ Add registered prefix**.

    :::image type="content" source="./media/walkthrough-peering-service-all/add-registered-prefix.png" alt-text="Screenshot of Registered prefix page in the Azure portal.":::

    > [!NOTE] 
    > If the **Add registered prefix** button is disabled, then your peering doesn't have at least one **Active** connection. Wait until this occurs to register your prefix.

1. Configure your prefix by giving it a name, and the IPv4 prefix string and select **Save**.

    :::image type="content" source="./media/walkthrough-peering-service-all/register-prefix-configure.png" alt-text="Screenshot of registering a prefix in the Azure portal.":::

After prefix creation, you can see the generated peering service prefix key when viewing the Registered ASN resource:

:::image type="content" source="./media/walkthrough-peering-service-all/registered-prefix-details.png" alt-text="Screenshot of registered prefix details.":::

After you create a registered prefix, it will be queued for validation. The validation state of the prefix can be found in the Registered Prefixes page:

:::image type="content" source="./media/walkthrough-peering-service-all/prefix-after-registration.png" alt-text="Screenshot of registered prefixes showing a new prefix added." :::

For a registered prefix to become validated, the following checks must pass:

* The prefix can't be in a private range
* The origin ASN must be registered in a major routing registry
* All connections in the parent peering must advertise routes for the prefix
* Routes must be advertised with the MAPS community string 8075:8007
* AS paths in your routes can't exceed a path length of 3, and can't contain private ASNs or AS prepending

For more information on registered prefix requirements and how to troubleshoot validation errors, see [Peering Registered Prefix Requirements](./peering-registered-prefix-requirements.md).

### 2. Provide peering service prefix keys to customers for activation

When your customers onboard to Peering Service, customers must follow the steps in [Peering Service customer walkthrough](../peering-service/customer-walkthrough.md) to activate prefixes using the Peering Service prefix key obtained during prefix registration. Provide this key to customers before they activate, as this key is used for all prefixes during activation.

## Frequently asked questions (FAQ):

**Q.**   When will my BGP peer come up?

**A.**   After the LAG comes up, our automated process configures BGP. Peer must configure BGP.

**Q.**   When will peering IP addresses be allocated and displayed in the Azure portal?

**A.**   Our automated process allocates addresses and sends the information via email after the port is configured on our side.

**Q.**	I have smaller subnets (</24) for my services. Can I get the smaller subnets also routed?

**A.**	Yes, Microsoft Azure Peering service supports smaller prefix routing also. Ensure that you're registering the smaller prefixes for routing and the same are announced over the interconnects.

**Q.**	What Microsoft routes will we receive over these interconnects?

**A.** Microsoft announces all of Microsoft's public service prefixes over these interconnects to ensure that other cloud services are accessible from the same interconnect.

**Q.** My peering registered prefix has failed validation. How should I proceed?

**A.** Review the [Peering Registered Prefix Requirements](./peering-registered-prefix-requirements.md) and follow the troubleshooting steps described.

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

**Q.** How does it take to complete the onboarding process?

**A.** Time is variable depending on number and location of sites, and if Peer is migrating existing private peerings or establishing new cabling. Carrier should plan for 3+ weeks.

**Q.** How is progress communicated outside of the portal status?

**A.** Automated emails are sent at varying milestones

**Q.** Can we use APIs for onboarding?

**A.** Currently there's no API support, and configuration must be performed via web portal.

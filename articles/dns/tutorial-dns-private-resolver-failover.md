---
title: Tutorial - Set up DNS failover using private resolvers
description: A tutorial on how to configure regional failover using the Azure DNS Private Resolver
services: dns
author: greg-lindsay
ms.service: dns
ms.topic: tutorial
ms.date: 08/10/2022
ms.author: greglin
#Customer intent: As an administrator, I want to avoid having a single point of failure for DNS resolution.
---


# Tutorial: Set up DNS failover using private resolvers

<!-- 2. Introductory paragraph 
Required. Lead with a light intro that describes, in customer-friendly language, 
what the customer will learn, or do, or accomplish. Answer the fundamental “why 
would I want to do this?” question. Keep it short.
-->

You can eliminate a single point of failure in your on-premises DNS services by using two or more Azure DNS private resolvers.

When you deploy multiple resolvers across different regions, DNS failover can be enabled by assigning a local resolver as your primary DNS and the resolver in an adjacent region as secondary DNS. 

<!-- 3. Tutorial outline 
Required. Use the format provided in the list below.
-->

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Resolve Azure Private DNS zones using your on-premises DNS service.
> * Enable on-premises DNS failover for your Azure Private DNS zones.

<!-- 4. Prerequisites 
Required. First prerequisite is a link to a free trial account if one exists. If there 
are no prerequisites, state that no prerequisites are needed for this tutorial.
-->

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Two [Azure virtual networks](../virtual-network/quick-create-portal.md) in two regions
- A [VPN](../vpn-gateway/tutorial-site-to-site-portal.md) or [ExpressRoute](../expressroute/expressroute-howto-circuit-portal-resource-manager.md) link from on-premises to each virtual network
- An [Azure DNS Private Resolver](dns-private-resolver-get-started-portal.md) in each virtual network
- An Azure [private DNS zone](private-dns-getstarted-portal.md) that is linked to each virtual network
- An on-premises DNS server

> [!NOTE]
> In this tutorial,`azure.contoso.com` is an Azure private DNS zone. Replace `azure.contoso.com` with your private DNS zone name.

<!-- 5. H2s
Required. Give each H2 a heading that sets expectations for the content that follows. 
Follow the H2 headings with a sentence about how the section contributes to the whole.
-->

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Determine inbound endpoint IP addresses

Write down the IP addresses assigned to the inbound endpoints of your DNS private resolvers. The IP addresses will be used to configure on-premises DNS forwarders.

In this example, there are two virtual networks in two regions:
- **myeastvnet** is in the East US region, assigned the address space 10.10.0.0/16 
- **mywestvnet** is in the West Central US region, assigned the address space 10.20.0.0/16

1. Search for **DNS Private Resolvers** and select your private resolver from the first region.  For example: **myeastresolver**.
2. Under **Settings**, select **Inbound endpoints** and write down the **IP address** setting. For example: **10.10.0.4**.

    ![View inbound endpoint](./media/tutorial-dns-private-resolver-failover/east-inbound-endpoint.png)

3. Return to the list of **DNS Private Resolvers** and select a resolver from a different region.  For example: **mywestresolver**.
4. Under **Settings**, select **Inbound endpoints** and write down the **IP address** setting of this resolver. For example: **10.20.0.4**.

## Verify private zone links

In order for resources within a virtual network to resolve DNS records in an Azure DNS private zone, the zone must be linked to the virtual network.  In this example, the zone `azure.contoso.com` is linked to **myeastvnet** and **mywestvnet**. Links to other vnets can also be present.

1. Search for **Private DNS zones** and select your private zone.  For example: **azure.contoso.com**.
2. Under **Settings**, select **Virtual network links** and verify that the vnets you used for inbound endpoints in the previous procedure are also listed under Virtual network. For example: **myeastvnet** and **mywestvnet**.

    ![View vnet links](./media/tutorial-dns-private-resolver-failover/vnet-links.png)

3. If one or more vnets are not yet linked, you can add it here by selecting **Add**, providing a **Link name**, choosing your **Subscription**, and then choosing the **Virtual network**.

<!-- 6. Clean up resources
Required. If resources were created during the tutorial. If no resources were created, 
state that there are no resources to clean up in this section.
-->

## Verify vnet DNS settings

In order for resources within a virtual network to resolve DNS records in an Azure DNS private zone, the zone must be linked to the virtual network.  In this example, the zone `azure.contoso.com` is linked to **myeastvnet** and **mywestvnet**. Links to other vnets can also be present.

1. Search for **Virtual networks** and select your private zone.  For example: **azure.contoso.com**.
2. Under **Settings**, select **Virtual network links** and verify that the vnets you used for inbound endpoints in the previous procedure are also listed under Virtual network. For example: **myeastvnet** and **mywestvnet**.



## Next steps
To learn more about private DNS zones, see [Using Azure DNS for private domains](private-dns-overview.md).

Learn how to [create a private DNS zone](./private-dns-getstarted-powershell.md) in Azure DNS.

Learn about DNS zones and records by visiting: [DNS zones and records overview](dns-zones-records.md).

Learn about some of the other key [networking capabilities](../networking/fundamentals/networking-overview.md) of Azure.

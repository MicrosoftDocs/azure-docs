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
- Two Azure virtual networks in two regions
- A VPN or ExpressRoute link from on-premises to each virtual network
- An Azure DNS Private Resolver in each virtual network
- An Azure private DNS zone that is linked to each virtual network
- An on-premises DNS server

<!-- 5. H2s
Required. Give each H2 a heading that sets expectations for the content that follows. 
Follow the H2 headings with a sentence about how the section contributes to the whole.
-->

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## [Section 2 heading]
<!-- Introduction paragraph -->
1. <!-- Step 1 -->
1. <!-- Step 2 -->
1. <!-- Step n -->

## [Section n heading]
<!-- Introduction paragraph -->
1. <!-- Step 1 -->
1. <!-- Step 2 -->
1. <!-- Step n -->

<!-- 6. Clean up resources
Required. If resources were created during the tutorial. If no resources were created, 
state that there are no resources to clean up in this section.
-->

## Clean up resources

If you're not going to continue to use this application, delete
<resources> with the following steps:

1. From the left-hand menu...
1. ...click Delete, type...and then click Delete

<!-- 7. Next steps
Required: A single link in the blue box format. Point to the next logical tutorial 
in a series, or, if there are no other tutorials, to some other cool thing the 
customer can do. 
-->



## Next steps
To learn more about private DNS zones, see [Using Azure DNS for private domains](private-dns-overview.md).

Learn how to [create a private DNS zone](./private-dns-getstarted-powershell.md) in Azure DNS.

Learn about DNS zones and records by visiting: [DNS zones and records overview](dns-zones-records.md).

Learn about some of the other key [networking capabilities](../networking/fundamentals/networking-overview.md) of Azure.

---
title: 'Tutorial: Establish a private connection from on-premises to an Azure virtual network using ExpressRoute'
description: This tutorial walks you through how to set up a private connection from an on-premises network to a virtual network in Azure using ExpressRoute.
services: expressroute
author: duongau
ms.author: duau
ms.service: expressroute
ms.topic: tutorial
ms.date: 12/05/2023
#customer intent: As a network engineer, I want to establish a private connection from my on-premises network to my Azure virtual network using ExpressRoute.
---

# Tutorial: Establish a private connection from on-premises to an Azure virtual network using ExpressRoute

This tutorial walks you through how to set up a private connection from an on-premises network to a virtual network in Azure using ExpressRoute. This connection is useful when you want to connect to your Azure virtual networks using a dedicated private connection from your WAN network, such as from a branch office or from your data center. This connection is established through an ExpressRoute partner.

In this tutorial, you learn how to:

> [!div class="checklist"]
> [Create an ExpressRoute circuit]
> [Enable private peering]
> [Create a virtual network gateway]
> [Link virtual network gateway to ExpressRoute circuit]

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* Review the [ExpressRoute prerequisites](expressroute-prerequisites.md) and [workflow](expressroute-workflows.md) before you begin.

## Create and provision an ExpressRoute circuit

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Search for and select **ExpressRoute** in the search box at the top of the page.

1. Select **+ Create** to create a new ExpressRoute circuit.

1. On the **Basics** tab, enter the following information:

    * **Subscription**: Select the subscription that you want to use for the ExpressRoute circuit.
    * **Resource group**: Select the resource group that you want to use for the ExpressRoute circuit.
    * **Region**: Select the location for the ExpressRoute circuit.
    * **Name**: Enter a name for the ExpressRoute circuit.

1. Select **Next: Circuit** to continue to the **Configuration** tab.

1. On the **Configuration** tab, select the following settings:

    * **Port type**: Select **Provider**.
    * **Create new or import from classic**: Select **Create new**.
    * **Provider**: Select the ExpressRoute provider that you want to use. Review the [ExpressRoute partners](expressroute-locations-providers.md) article for more information about the providers. This example uses **Equinix**.
    * **Peering location**: Select the peering location closest to the Azure data center you'll be connecting to for best performance. Review the [ExpressRoute locations and peering](expressroute-locations-providers.md) article for more information about the peering locations. This example uses **Seattle**.
    * **Bandwidth**: Select the bandwidth that you want to use. This example uses **200 Mbps**.
    * **SKU**: Select the SKU that you want to use. For more information, see [ExpressRoute FAQ](expressroute-faqs.md#what-is-the-connectivity-scope-for-different-expressroute-circuit-skus). This example uses **Standard**.
    * **Billing model**: Select the billing model that you want to use. This example uses **Metered data**.

1. Select **Review + create** to review your settings.

1. Select **Create** to create the ExpressRoute circuit.

1. Once the circuit is created, select **Go to resource** to go to the ExpressRoute circuit.

1. Note the **Service key** and contact your ExpressRoute partner to complete the provisioning of the circuit.

1. Once the circuit is provisioned, you can configure the ExpressRoute circuit for private peering.

## Enable private peering

1. Select **Peerings** in the left side menu of the ExpressRoute circuit.

1. Select **Azure private** to create a private peering.

1. On the **Private peering** configuration page, enter the following information:

    * **Peer ASN**: Enter the peer ASN. This is the ASN of the on-premises router. This example uses **65000**.
    * **Subnet**: Select the IP version for the subnet pair. This example uses **IPv4**.
    * **IPv4 Primary subnet**: Enter the subnet for the primary BGP peer.
    * **IPv4 Secondary subnet**: Enter the subnet for the secondary BGP peer.
    * **Enable IPv4 peering**: Check this box to enable IPv4 peering.  
    * **VLAN ID**: Enter the VLAN ID. This is the VLAN ID that you want to use for the private peering. This example uses **200**.
    * **Shared key**: Enter an MD5 hash for the shared key. This is an optional field. A shared key won't be used in this tutorial.

1. Select **Save** to save the private peering configuration.


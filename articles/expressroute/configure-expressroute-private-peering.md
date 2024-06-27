---
title: 'Tutorial: Establish a private peering connection from on-premises to an Azure virtual network using ExpressRoute'
description: This tutorial walks you through how to set up a private connection from an on-premises network to a virtual network in Azure using ExpressRoute.
services: expressroute
author: duongau
ms.author: duau
ms.service: expressroute
ms.topic: tutorial
ms.date: 01/02/2024
# Customer intent: As a network engineer, I want to establish a private connection from my on-premises network to my Azure virtual network using ExpressRoute.
---

# Tutorial: Establish a private connection from on-premises to an Azure virtual network using ExpressRoute

This tutorial walks you through how to set up a private connection from an on-premises network to a virtual network in Azure using ExpressRoute. This connection is useful when you want to connect to your Azure virtual networks using a dedicated private connection from your WAN network, such as from a branch office or from your data center. This connection is established through an ExpressRoute partner.

In this tutorial, you learn how to:

> [!div class="checklist"]
> - Create an ExpressRoute circuit
> - Enable private peering
> - Create a virtual network gateway
> - Link virtual network gateway to ExpressRoute circuit

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* Review the [ExpressRoute prerequisites](expressroute-prerequisites.md) and [workflow](expressroute-workflows.md) before you begin.

## Create and provision an ExpressRoute circuit

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Search for and select **ExpressRoute** in the search box at the top of the page.

1. Select **+ Create** to create a new ExpressRoute circuit.

1. On the **Basics** tab, enter the following information:

    * **Subscription**: Select the subscription that you want to create the ExpressRoute circuit in.
    * **Resource group**: Select the resource group that you want to use for the ExpressRoute circuit.
    * **Region**: Select the location for the ExpressRoute circuit.
    * **Name**: Enter a name for the ExpressRoute circuit.

1. Select **Next: Circuit** to continue to the **Configuration** tab.

1. On the **Configuration** tab, select the following settings:

    * **Port type**: Select **Provider**.
    * **Create new or import from classic**: Select **Create new**.
    * **Provider**: Select the ExpressRoute provider that you prefer to use. Review the [ExpressRoute partners](expressroute-locations-providers.md) article for more information about the providers.
    * **Peering location**: Select the peering location that is nearest to the Azure data center you're connecting to for optimal performance. Review the [ExpressRoute locations and peering](expressroute-locations-providers.md) article for more information about the peering locations.
    * **Bandwidth**: Select the bandwidth that meets your requirement.
    * **SKU**: Select the SKU that meets your requirement. For more information, see [ExpressRoute FAQ](expressroute-faqs.md#what-is-the-connectivity-scope-for-different-expressroute-circuit-skus).
    * **Billing model**: Select the billing model that suits your needs.

1. Select **Review + create** to review your settings.

1. Select **Create** to create the ExpressRoute circuit.

1. Once the circuit is created, select **Go to resource** to go to the ExpressRoute circuit.

1. Note the **Service key** and contact your ExpressRoute partner to complete the provisioning of the circuit.

1. Once the circuit is provisioned, you can configure the ExpressRoute circuit for private peering.

## Enable private peering

1. Select **Peerings** in the left side menu of the ExpressRoute circuit.

1. Select **Azure private** to create a private peering.

1. On the **Private peering** configuration page, enter the following information:

    * **Peer ASN**: Enter the peer ASN of the on-premises router.
    * **Subnet**: Select the IP version for the subnet pair. This example uses **IPv4**.
    * **IPv4 Primary subnet**: Enter the subnet for the primary BGP peer.
    * **IPv4 Secondary subnet**: Enter the subnet for the secondary BGP peer.
    * **Enable IPv4 peering**: Check this box to enable IPv4 peering.  
    * **VLAN ID**: Enter the VLAN ID that you want to use for the private peering.
    * **Shared key**: Enter an MD5 hash for the shared key. The use of a shared key is optional.

1. Select **Save** to save the private peering configuration.

    > [!TIP]
    > To verify the layer 2 connectivity of the ExpressRoute circuit, examine the ExpressRoute circuit ARP table. If the on-premises entry is incomplete or missing the MAC address, review the settings of the on-premises router or check with the service provider.

1. After verifying the establishment of layer 2 connectivity, you can proceed to create an ExpressRoute virtual network gateway and link it to the corresponding circuit.

## Create a virtual network gateway

1. Select **+ Create a resource** in the upper left corner of the Azure portal.

1. Search for and select **Virtual network gateway** in the search box at the top of the page. Then select create to begin configuring the virtual network gateway.

1. On the **Basics** tab, enter the following information:

    * **Subscription**: Select the subscription that you want to create the virtual network gateway in.
    * **Name**: Enter a name for the virtual network gateway.
    * **Region**: Select the location for the virtual network gateway. The location must be the same as the location of the virtual network that you want to link to the ExpressRoute circuit.
    * **Gateway type**: Select **ExpressRoute**.
    * **Gateway SKUs**: Select the SKU that meets your requirement. For more information, see [Gateway SKUs](expressroute-about-virtual-network-gateways.md#gatewayfeaturesupport).
    * **Virtual network**: Select the virtual network where you want to deploy the virtual network gateway.
    * **Gateway subnet address range**: If the virtual network already has a gateway subnet, this field is populated with the existing gateway subnet address range. Otherwise, enter the address range for the gateway subnet. The address range must be a valid CIDR block in the virtual network address space.
    * **Public IP address**: Select **Create new** to create a new public IP address. 
    * **Public IP address name**: Enter a name for the public IP address.
    * **Public IP address SKU**: Leave the default value of **Standard**.

1. Select **Review + create** to review your settings.

1. Select **Create** to create the virtual network gateway. The deployment of the virtual network gateway can take up to 45 minutes to complete. Once the deployment is complete, you can proceed to link the virtual network gateway to the ExpressRoute circuit.

## Link virtual network gateway to ExpressRoute circuit

1. Navigate to the virtual network gateway that you created.

1. Select **Connections** in the left side menu of the ExpressRoute circuit.

1. Select **+ Add** to add a new connection.

1. On the **Create connection** page, enter the following information then select **Next: Settings >**.

    * **Subscription**: Select the subscription that you want to create the connection in. The subscription is the same subscription that you used to create the virtual network gateway.
    * **Resource group**: Select the resource group that you want to use for the connection.
    * **Connection type**: Select **ExpressRoute**.
    * **Region**: Select the location for the connection. This region is the same location as the virtual network gateway.

1. On the **Settings** page, enter the following information then select **Review + create**.

    * **Virtual network gateway**: Select the virtual network gateway that you want to link to the ExpressRoute circuit.
    * **ExpressRoute circuit**: Specify the ExpressRoute circuit that you wish to connect with the virtual network gateway.
    * **Redeem authorization**: Leave this box unchecked since you're connecting to a circuit in the same subscription.
    * **Routing weight**: Leave the default value of **0**. This weight value is used to determine which ExpressRoute circuit is preferred when multiple ExpressRoute circuits are linked to the same virtual network gateway.
    * **FathPath**: Leave this box unchecked. FastPath is a feature that improves data path performance between on-premises and Azure by bypassing the Azure VPN gateway for data traffic. For more information, see [FastPath](about-fastpath.md).

1. Select **Create** to create the connection. The connection is created and the virtual network gateway is linked to the ExpressRoute circuit.

## Verify the connection

1. Navigate to the ExpressRoute circuit with the virtual network connection.

1. Select **Peerings** in the left side menu of the ExpressRoute circuit.

1. Right-click the **Azure private** peering and select **View route table**.

1. Verify that the route table contains the route for the virtual network you linked to the ExpressRoute circuit. The route should have an ASN of **65515** by default.

## Clean up resources

When no longer needed, use the Azure portal to delete the resource group, ExpressRoute circuit, virtual network gateway, and all related resources.

## Next steps

- [Designing for high availability with ExpressRoute](designing-for-high-availability-with-expressroute.md)
- [Designing for disaster recovery with ExpressRoute private peering](designing-for-disaster-recovery-with-expressroute-privatepeering.md)
- [Using Site-to-Site as a backup for ExpressRoute private peering](use-s2s-vpn-as-backup-for-expressroute-privatepeering.md)

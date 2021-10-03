---
title: 'Azure Virtual WAN: Create a Network Virtual Appliance (NVA) in the hub'
description: Learn how to deploy a Network Virtual Appliance in the Virtual WAN hub.
services: virtual-wan
author: cherylmc
ms.service: virtual-wan
ms.topic: how-to
ms.date: 07/29/2021
ms.author: cherylmc
# Customer intent: As someone with a networking background, I want to create a Network Virtual Appliance (NVA) in my Virtual WAN hub.
---
# How to create a Network Virtual Appliance in an Azure Virtual WAN hub

This article shows you how to use Virtual WAN to connect to your resources in Azure through a **Network Virtual Appliance** (NVA) in Azure. This type of connection requires a VPN device located on-premises that has an externally facing public IP address assigned to it. For more information about Virtual WAN, see the [What is Virtual WAN?](virtual-wan-about.md).

The steps in this article help you create a **Barracuda CloudGen WAN** Network Virtual Appliance in the Virtual WAN hub. To complete this exercise, you must have a Barracuda Cloud Premise Device (CPE) and a license for the Barracuda CloudGen WAN appliance that you deploy into the hub before you begin.

For deployment documentation of **Cisco SD-WAN** within Azure Virtual WAN, see [Cisco Cloud OnRamp for Multi-Cloud](https://www.cisco.com/c/en/us/td/docs/routers/sdwan/configuration/cloudonramp/ios-xe-17/cloud-onramp-book-xe/cloud-onramp-multi-cloud.html#Cisco_Concept.dita_c61e0e7a-fff8-4080-afee-47b81e8df701). 

For deployment documentation of **VMware SD-WAN** within Azure Virtual WAN, see [Deployment Guide for VMware SD-WAN in Virtual WAN Hub](https://kb.vmware.com/s/article/82746)

## Prerequisites

Verify that you have met the following criteria before beginning your configuration:

* Obtain a license for your Barracuda CloudGen WAN gateway. To learn more about how to do this, see the [Barracuda CloudGen WAN Documentation](https://www.barracuda.com/products/cloudgenwan)

* You have a virtual network that you want to connect to. Verify that none of the subnets of your on-premises networks overlap with the virtual networks that you want to connect to. To create a virtual network in the Azure portal, see the [Quickstart](../virtual-network/quick-create-portal.md).

* Your virtual network does not have any virtual network gateways. If your virtual network has a gateway (either VPN or ExpressRoute), you must remove all gateways. This configuration requires that virtual networks are connected instead, to the Virtual WAN hub gateway.

* Obtain an IP address range for your hub region. The hub is a virtual network that is created and used by Virtual WAN. The address range that you specify for the hub cannot overlap with any of your existing virtual networks that you connect to. It also cannot overlap with your address ranges that you connect to your on-premises sites. If you are unfamiliar with the IP address ranges located in your on-premises network configuration, coordinate with someone who can provide those details for you.

* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## <a name="openvwan"></a>Create a virtual WAN

[!INCLUDE [Create virtual WAN](../../includes/virtual-wan-create-vwan-include.md)]

## <a name="hub"></a>Create a hub

A hub is a virtual network that can contain gateways for site-to-site, ExpressRoute, point-to-site,  or Network Virtual Appliance functionality. Once the hub is created, you'll be charged for the hub, even if you don't attach any sites. If you choose to create a site-to-site VPN gateway, it takes 30 minutes to create the site-to-site VPN gateway in the virtual hub. Unlike site-to-site, ExpressRoute, or point-to-site, the hub must be created first before you can deploy a Network Virtual Appliance into the hub VNet.

1. Locate the Virtual WAN that you created. On the **Virtual WAN** page, under the **Connectivity** section, select **Hubs**.
1. On the **Hubs** page, select +New Hub to open the **Create virtual hub** page.

   :::image type="content" source="./media/how-to-nva-hub/vwan-hub.png" alt-text="Basics":::
1. On the **Create virtual hub** page **Basics** tab, complete the following fields:

   **Project details**

   * Region (previously referred to as Location)
   * Name
   * Hub private address space. The minimum address space is /24 to create a hub, which implies anything range from /25 to /32 will produce an error during creation. Azure Virtual WAN, being a managed service by Microsoft, creates the appropriate subnets in the virtual hub for the different gateways/services. (For example: Network Virtual Appliances, VPN gateways, ExpressRoute gateways, User VPN/Point-to-site gateways, Firewall, Routing, etc.). There is no need for the user to explicitly plan for subnet address space for the services in the Virtual hub because Microsoft does this as a part of the service.
1. Select **Review + Create** to validate.
1. Select **Create** to create the hub.

## Create the Network Virtual Appliance in the hub

In this step, you will create a Network Virtual Appliance in the hub. The procedure for each NVA will be different for each NVA partner's product. For this example, we are creating a Barracuda CloudGen WAN Gateway.

1. Locate the Virtual WAN hub you created in the previous step and open it.

   :::image type="content" source="./media/how-to-nva-hub/nva-hub.png" alt-text="Virtual hub":::
1. Find the Network Virtual Appliances tile and select the **Create** link.
1. On the **Network Virtual Appliance** blade, select **Barracuda CloudGen WAN**, then select the **Create** button.

   :::image type="content" source="./media/how-to-nva-hub/select-nva.png" alt-text="Select NVA":::
1. This will take you to the Azure Marketplace offer for the Barracuda CloudGen WAN gateway. Read the terms, then select the **Create** button when you're ready.

   :::image type="content" source="./media/how-to-nva-hub/barracuda-create-basics.png" alt-text="Barracuda NVA basics":::
1. On the **Basics** page you will need to provide the following information:

   * **Subscription** - Choose the subscription you used to deploy the Virtual WAN and hub.
   * **Resource Group** - Choose the same Resource Group you used to deploy the Virtual WAN and hub.
   * **Region** - Choose the same Region in which your Virtual hub resource is located.
   * **Application Name** - The Barracuda NextGen WAN is a Managed Application. Choose a name that makes it easy to identify this resource, as this is what it will be called when it appears in your subscription.
   * **Managed Resource Group** - This is the name of the Managed Resource Group in which Barracuda will deploy resources that are managed by them. The name should be pre-populated for this.
1. Select the **Next: CloudGen WAN gateway** button.

   :::image type="content" source="./media/how-to-nva-hub/barracuda-cloudgen-wan.png" alt-text="CloudGen WAN Gateway":::
1. Provide the following information here:

   * **Virtual WAN Hub** - The Virtual WAN hub you want to deploy this NVA into.
   * **NVA Infrastructure Units** - Indicate the number of NVA Infrastructure Units you want to deploy this NVA with. Choose the amount of aggregate bandwidth capacity you want to provide across all of the branch sites that will be connecting to this hub through this NVA.
   * **Token** - Barracuda requires that you provide an authentication token here in order to identify yourself as a registered user of this product. You'll need to obtain this from Barracuda.
1. Select the **Review and Create** button to proceed.
1. On this page, you will be asked to accept the terms of the Co-Admin Access agreement. This is standard with Managed Applications where the Publisher will have access to some resources in this deployment. Check the **I agree to the terms and conditions above** box, and then select **Create**.

## <a name="vnet"></a>Connect the VNet to the hub

In this section, you create a connection between your hub and VNet.

[!INCLUDE [Connect](../../includes/virtual-wan-connect-vnet-hub-include.md)]

## Next steps

* To learn more about Virtual WAN, see the [What is Virtual WAN?](virtual-wan-about.md) page.
* To learn more about NVAs in a Virtual WAN hub, see [About Network Virtual Appliance in the Virtual WAN hub](about-nva-hub.md).

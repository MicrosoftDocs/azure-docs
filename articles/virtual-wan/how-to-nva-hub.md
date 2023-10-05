---
title: 'Azure Virtual WAN: Create a Network Virtual Appliance (NVA) in the hub'
description: Learn how to deploy a Network Virtual Appliance in the Virtual WAN hub.
author: cherylmc
ms.service: virtual-wan
ms.topic: how-to
ms.date: 07/28/2023
ms.author: cherylmc
# Customer intent: As someone with a networking background, I want to create a Network Virtual Appliance (NVA) in my Virtual WAN hub.
---
# How to create a Network Virtual Appliance in an Azure Virtual WAN hub

This article shows you how to use Virtual WAN to connect to your resources in Azure through a **Network Virtual Appliance** (NVA) in Azure. This type of connection requires a VPN device located on-premises that has an externally facing public IP address assigned to it. For more information about Virtual WAN, see [What is Virtual WAN?](virtual-wan-about.md)

The steps in this article help you create a **Barracuda CloudGen WAN** Network Virtual Appliance in the Virtual WAN hub. To complete this exercise, you must have a Barracuda Cloud Premise Device (CPE) and a license for the Barracuda CloudGen WAN appliance that you deploy into the hub before you begin.

For deployment documentation of **Cisco SD-WAN** within Azure Virtual WAN, see [Cisco Cloud OnRamp for Multi-Cloud](https://www.cisco.com/c/en/us/td/docs/routers/sdwan/configuration/cloudonramp/ios-xe-17/cloud-onramp-book-xe/cloud-onramp-multi-cloud.html#Cisco_Concept.dita_c61e0e7a-fff8-4080-afee-47b81e8df701).

For deployment documentation of **VMware SD-WAN** within Azure Virtual WAN, see [Deployment Guide for VMware SD-WAN in Virtual WAN Hub](https://kb.vmware.com/s/article/82746)

## Prerequisites

Verify that you've met the following criteria before beginning your configuration:

* Obtain a license for your Barracuda CloudGen WAN gateway. To learn more about how to do this, see the [Barracuda CloudGen WAN Documentation](https://www.barracuda.com/products/cloudgenwan)

* You have a virtual network that you want to connect to. Verify that none of the subnets of your on-premises networks overlap with the virtual networks that you want to connect to. To create a virtual network in the Azure portal, see the [Quickstart](../virtual-network/quick-create-portal.md).

* Your virtual network doesn't have any virtual network gateways. If your virtual network has a gateway (either VPN or ExpressRoute), you must remove all gateways. This configuration requires that virtual networks are connected instead, to the Virtual WAN hub gateway.

* Obtain an IP address range for your hub region. The hub is a virtual network that is created and used by Virtual WAN. The address range that you specify for the hub can't overlap with any of your existing virtual networks that you connect to. It also can't overlap with your address ranges that you connect to your on-premises sites. If you're unfamiliar with the IP address ranges located in your on-premises network configuration, coordinate with someone who can provide those details for you.

* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## <a name="openvwan"></a>Create a virtual WAN

[!INCLUDE [Create virtual WAN](../../includes/virtual-wan-create-vwan-include.md)]

## <a name="hub"></a>Create a hub

Create a virtual hub by filling out the **Basics** tab to create an empty virtual hub (a virtual hub that doesn't contain any gateways).

[!INCLUDE [Create a virtual hub](../../includes/virtual-wan-hub-basics.md)]

## Create the Network Virtual Appliance in the hub

In this step, you'll create a Network Virtual Appliance in the hub. The procedure for each NVA will be different for each NVA partner's product. For this example, we're creating a Barracuda CloudGen WAN gateway.

1. Locate the Virtual WAN hub you created in the previous step and open it.

   :::image type="content" source="./media/how-to-nva-hub/nva-hub.png" alt-text="Screenshot of the Network Virtual Appliance tile." lightbox="./media/how-to-nva-hub/nva-hub.png":::

1. Find the **Network Virtual Appliance** tile and select the **Create** link.
1. On the **Network Virtual Appliance** page, from the dropdown, select **Barracuda CloudGen WAN**, then select the **Create** button and **Leave**. This takes you to the Azure Marketplace offer for the Barracuda CloudGen WAN gateway.
1. Read the terms, select **Get it now**, then click **Continue** when you're ready. The page will automatically change to the page for the **Barracuda CloudGen WAN Gateway**. Select **Create** to open the **Basics** page for gateway settings.

   :::image type="content" source="./media/how-to-nva-hub/barracuda-create-basics.png" alt-text="Screenshot of the Basics page."lightbox="./media/how-to-nva-hub/barracuda-create-basics.png":::
1. On the Create Barracuda CloudGen WAN Gateway **Basics** page, provide the following information:

   * **Subscription** - Choose the subscription you used to deploy the Virtual WAN and hub.
   * **Resource Group** - Choose the same Resource Group you used to deploy the Virtual WAN and hub.
   * **Region** - Choose the same Region in which your Virtual hub resource is located.
   * **Application Name** - The Barracuda NextGen WAN is a Managed Application. Choose a name that makes it easy to identify this resource, as this is what it will be called when it appears in your subscription.
   * **Managed Resource Group** - This is the name of the Managed Resource Group in which Barracuda will deploy resources that are managed by them. The name should be pre-populated for this.
1. Select **Next: CloudGen WAN gateway** to open the **Create Barracuda CloudGen WAN Gateway** page.

   :::image type="content" source="./media/how-to-nva-hub/barracuda-cloudgen-wan.png" alt-text="Screenshot of the Create Barracuda CloudGen WAN Gateway page."lightbox="./media/how-to-nva-hub/barracuda-cloudgen-wan.png":::
1. On the **Create Barracuda CloudGen WAN Gateway** page, provide the following information:

   * **Virtual WAN Hub** - The Virtual WAN hub you want to deploy this NVA into.
   * **NVA Infrastructure Units** - Indicate the number of NVA Infrastructure Units you want to deploy this NVA with. Choose the amount of aggregate bandwidth capacity you want to provide across all of the branch sites that will be connecting to this hub through this NVA.
   * **Token** - Barracuda requires that you provide an authentication token here in order to identify yourself as a registered user of this product. You'll need to obtain this from Barracuda.
1. Select the **Review and Create** button to proceed.
1. On this page, you'll be asked to accept the terms of the Co-Admin Access agreement. This is standard with Managed Applications where the Publisher will have access to some resources in this deployment. Check the **I agree to the terms and conditions above** box, and then select **Create**.

## <a name="vnet"></a>Connect the VNet to the hub

In this section, you create a connection between your hub and VNet.

[!INCLUDE [Connect](../../includes/virtual-wan-connect-vnet-hub-include.md)]

## Next steps

* To learn more about Virtual WAN, see [What is Virtual WAN?](virtual-wan-about.md)
* To learn more about NVAs in a Virtual WAN hub, see [About Network Virtual Appliance in the Virtual WAN hub](about-nva-hub.md).

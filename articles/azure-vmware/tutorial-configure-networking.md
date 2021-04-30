---
title: Tutorial - Configure networking for your VMware private cloud in Azure
description: Learn to create and configure the networking needed to deploy your private cloud in Azure
ms.topic: tutorial
ms.custom: contperf-fy21q4
ms.date: 04/23/2021
---

# Tutorial: Configure networking for your VMware private cloud in Azure

An Azure VMware Solution private cloud requires an Azure Virtual Network. Because Azure VMware Solution doesn't support your on-premises vCenter, extra steps for integration with your on-premises environment are needed. Setting up an ExpressRoute circuit and a virtual network gateway is also required.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a virtual network
> * Create a virtual network gateway
> * Connect your ExpressRoute circuit to the gateway


## Create a virtual network

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to the resource group you created in the [create a private cloud tutorial](tutorial-create-private-cloud.md) and select **+ Add** to define a new resource. 

1. In the **Search the Marketplace** text box, type **Virtual Network**. Find the Virtual Network resource and select it.

1. On the **Virtual Network** page, select **Create** to set up your virtual network for your private cloud.

1. On the **Create Virtual Network** page, enter the details for your virtual network.

1. On the **Basics** tab, enter a name for the virtual network, select the appropriate region, and select **Next : IP Addresses**.

1. On the **IP Addresses** tab, under **IPv4 address space**, enter the address space you created in the previous tutorial.

   > [!IMPORTANT]
   > You must use an address space that **does not** overlap with the address space you used when you created your private cloud in the preceding tutorial.

1. Select **+ Add subnet**, and on the **Add subnet** page, give the subnet a name and appropriate address range. When complete, select **Add**.

1. Select **Review + create**.

   :::image type="content" source="./media/tutorial-configure-networking/create-virtual-network.png" alt-text="Select Review + create." border="true":::

1. Verify the information and select **Create**. Once the deployment is complete, you'll see your virtual network in the resource group.

## Create a virtual network gateway

Now that you've created a virtual network, you'll create a virtual network gateway.

1. In your resource group, select **+ Add** to add a new resource.

1. In the **Search the Marketplace** text box type, **Virtual network gateway**. Find the Virtual Network resource and select it.

1. On the **Virtual Network gateway** page, select **Create**.

1. On the Basics tab of the **Create virtual network gateway** page, provide values for the fields, and then select **Review + create**. 

   | Field | Value |
   | --- | --- |
   | **Subscription** | Pre-populated value with the Subscription to which the resource group belongs. |
   | **Resource group** | Pre-populated value for the current resource group. Value should be the resource group you created in a previous test. |
   | **Name** | Enter a unique name for the virtual network gateway. |
   | **Region** | Select the geographical location of the virtual network gateway. |
   | **Gateway type** | Select **ExpressRoute**. |
   | **SKU** | Leave the default value: **standard**. |
   | **Virtual network** | Select the virtual network you created previously. If you don't see the virtual network, make sure the gateway's region matches the region of your virtual network. |
   | **Gateway subnet address range** | This value is populated when you select the virtual network. Don't change the default value. |
   | **Public IP address** | Select **Create new**. |

   :::image type="content" source="./media/tutorial-configure-networking/create-virtual-network-gateway.png" alt-text="Provide values for the fields and then select Review + create." border="true":::

1. Verify that the details are correct, and select **Create** to start the deployment of your virtual network gateway. 
1. Once the deployment completes, move to the next section to connect your ExpressRoute connection to the virtual network gateway containing your Azure VMware Solution private cloud.

## Connect ExpressRoute to the virtual network gateway

Now that you've deployed a virtual network gateway, you'll add a connection between it and your Azure VMware Solution private cloud.

[!INCLUDE [connect-expressroute-to-vnet](includes/connect-expressroute-vnet.md)]


## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Create a virtual network
> * Create a virtual network gateway
> * Connect your ExpressRoute circuit to the gateway


Continue to the next tutorial to learn how to create the NSX-T network segments that are used for VMs in vCenter.

> [!div class="nextstepaction"]
> [Create an NSX-T network segment](tutorial-nsx-t-network-segment.md)
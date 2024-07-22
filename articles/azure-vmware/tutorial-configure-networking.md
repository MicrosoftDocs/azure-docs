---
title: "Tutorial: Configure networking for your VMware private cloud in Azure"
description: Learn to create and configure the necessary network resources for deploying your private cloud in Azure.
ms.topic: tutorial
ms.custom: engagement-fy23
ms.service: azure-vmware
ms.date: 6/12/2024
---

# Tutorial: Configure networking for your VMware private cloud in Azure

An Azure VMware Solution private cloud requires an Azure virtual network. Because Azure VMware Solution doesn't support an on-premises vCenter Server instance, you need to take extra steps to integrate with your on-premises environment. You also need to set up a virtual network gateway and an Azure ExpressRoute circuit.

[!INCLUDE [disk-pool-planning-note](includes/disk-pool-planning-note.md)]

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> * Create a virtual network.
> * Create a virtual network gateway.
> * Connect an ExpressRoute circuit to the gateway.

This tutorial assumes that you completed the [previous tutorial about creating a private cloud](tutorial-create-private-cloud.md).

> [!NOTE]
> Before you create a virtual network, evaluate whether you want to connect to Azure VMware Solution by using an existing virtual network or by creating a new one:
>
> * To use an existing virtual network in the same Azure subscription as Azure VMware Solution, use the [Azure VNet connect](#select-an-existing-virtual-network) tab on the **Connectivity** pane.
> * To use an existing virtual network in a different Azure subscription from Azure VMware Solution, use the guidance for [connecting to the private cloud manually](#connect-to-the-private-cloud-manually).
> * To create a new virtual network in the same Azure subscription as Azure VMware Solution, use the [Azure VNet connect](#create-a-new-virtual-network) tab or create one [manually](#create-a-virtual-network-manually).

## Prerequisites

* Make sure that the virtual network that you use for this tutorial:

  * Contains a gateway subnet.
  * Is in the same region as the Azure VMware Solution private cloud.
  * Is in the same resource group as the Azure VMware Solution private cloud.
  * Contains an address space that doesn't overlap with CIDR in the Azure VMware Solution private cloud.

* Validate that your solution design is within the [Azure VMware Solution limits](/azure/azure-resource-manager/management/azure-subscription-service-limits).

## Connect to the private cloud by using the Azure VNet connect feature

You can take advantage of the **Azure VNet connect** feature if you want to connect to Azure VMware Solution by using an existing virtual network or by creating a new virtual network.

**Azure VNet connect** is a function to configure virtual network connectivity. It doesn't record configuration state. Browse through the Azure portal to check what settings are already configured.

### Select an existing virtual network

When you select an existing virtual network, the Azure Resource Manager (ARM) template that creates the virtual network and other resources is redeployed. The resources, in this case, are the public IP address, gateway, gateway connection, and ExpressRoute authorization key.

If everything is set up, the deployment doesn't change anything. However, if anything is missing, it's created automatically. For example, if the gateway subnet is missing, it's added during the deployment.

1. In the Azure portal, go to the Azure VMware Solution private cloud.

1. Under **Manage**, select **Connectivity**.

1. Select the **Azure VNet connect** tab, and then select the existing virtual network.

   :::image type="content" source="media/networking/azure-vnet-connect-tab.png" alt-text="Screenshot that shows the Azure VNet connect tab with an existing virtual network selected.":::

1. Select **Save**.

At this point, the virtual network detects whether IP address spaces overlap between Azure VMware Solution and the virtual network. If overlapping IP address spaces are detected, change the network address of either the private cloud or the virtual network so they don't overlap.

### Create a new virtual network

When you create a virtual network, the required components to connect to Azure VMware Solution are automatically created.

1. In the Azure portal, go to the Azure VMware Solution private cloud.

1. Under **Manage**, select **Connectivity**.

1. Select the **Azure VNet connect** tab, and then select **Create new**.

   :::image type="content" source="media/networking/azure-vnet-connect-tab-create-new.png" alt-text="Screenshot that shows the Azure VNet connect tab and the link for creating a new virtual network.":::

1. Provide or update the information for the new virtual network, and then select **OK**.

   :::image type="content" source="media/networking/create-new-virtual-network.png" alt-text="Screenshot that shows the pane for creating a virtual network.":::

At this point, the virtual network detects whether IP address spaces overlap between Azure VMware Solution and the virtual network. If overlapping IP address spaces are detected, change the network address of either the private cloud or the virtual network so they don't overlap.

The virtual network with the provided address range and gateway subnet is created in your subscription and resource group.  

## Connect to the private cloud manually

### Create a virtual network manually

1. Sign in to the [Azure portal](https://portal.azure.com) or, if necessary, the [Azure Government portal](https://portal.azure.us/).

1. Go to the resource group that you created in the [tutorial for creating a private cloud](tutorial-create-private-cloud.md), and then select **+ Add** to define a new resource.

1. In the **Search the Marketplace** box, enter **virtual network**. Find the virtual network resource and select it.

1. On the **Virtual Network** page, select **Create** to set up your virtual network for your private cloud.

1. On the **Create virtual network** pane, enter the details for your virtual network:

   1. On the **Basics** tab, enter a name for the virtual network, select the appropriate region, and then select **Next : IP Addresses**.

   1. On the **IP Addresses** tab, under **IPv4 address space**, enter the address space that you created in the previous tutorial.

      > [!IMPORTANT]
      > You must use an address space that doesn't overlap with the address space that you used when you created your private cloud in the preceding tutorial.

   1. Select **+ Add subnet**. On the **Add subnet** pane, give the subnet a name and an appropriate address range, and then select **Add**.

   1. Select **Review + create**.

   1. Verify the information and select **Create**.

      :::image type="content" source="./media/tutorial-configure-networking/create-virtual-network.png" alt-text="Screenshot that shows settings for the new virtual network." border="true":::

After the deployment is complete, your virtual network appears in the resource group.

### Create a virtual network gateway

Now that you've created a virtual network, create a virtual network gateway:

1. In your resource group, select **+ Add** to add a new resource.

1. In the **Search the Marketplace** box, enter **virtual network gateway**. Find the virtual network resource and select it.

1. On the **Virtual Network gateway** page, select **Create**.

1. On the **Basics** tab of the **Create virtual network gateway** pane, provide the following values, and then select **Review + create**.

   | Field | Value |
   | --- | --- |
   | **Subscription** | The value is prepopulated with the subscription to which the resource group belongs. |
   | **Resource group** | The value is prepopulated for the current resource group. It should be the resource group that you created in a previous test. |
   | **Name** | Enter a unique name for the virtual network gateway. |
   | **Region** | Select the geographical location of the virtual network gateway. |
   | **Gateway type** | Select **ExpressRoute**. |
   | **SKU** | Select the gateway type that's appropriate for your workload. <br> For Azure NetApp Files datastores, select **UltraPerformance** or **ErGw3Az**. |
   | **Virtual network** | Select the virtual network that you created previously. If you don't see the virtual network, make sure the gateway's region matches the region of your virtual network. |
   | **Gateway subnet address range** | The value is populated when you select the virtual network. Don't change the default value. |
   | **Public IP address** | Select **Create new**. |

   :::image type="content" source="./media/tutorial-configure-networking/create-virtual-network-gateway.png" alt-text="Screenshot that shows the details for a virtual network gateway." border="true":::

1. Verify that the details are correct, and then select **Create** to start deployment of your virtual network gateway.

After the deployment finishes, move to the next section to connect ExpressRoute to the virtual network gateway that contains your Azure VMware Solution private cloud.

### Connect ExpressRoute to the virtual network gateway

Now that you've deployed a virtual network gateway, add a connection between it and your Azure VMware Solution private cloud:

[!INCLUDE [connect-expressroute-to-vnet](includes/connect-expressroute-vnet.md)]

## Next step

Continue to the next tutorial to learn how to create the NSX network segments for virtual machines in vCenter Server:

> [!div class="nextstepaction"]
> [Create an NSX network segment](./tutorial-nsx-t-network-segment.md)

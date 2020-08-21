---
title: Tutorial - Configure networking for your VMware private cloud in Azure
description: Learn to create and configure the networking needed to deploy your private cloud in Azure
ms.topic: tutorial
ms.date: 07/22/2020
---

# Tutorial: Configure networking for your VMware private cloud in Azure

An Azure VMware Solution private cloud requires an Azure Virtual Network. Because Azure VMware Solution doesn't support your on-premises vCenter during preview, additional steps for integration with your on-premises environment are needed. Setting up an ExpressRoute circuit and a virtual network gateway are also required and is covered in this tutorial.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a virtual network
> * Create a virtual network gateway
> * Connect your ExpressRoute circuit to the gateway
> * Locate the URLs for vCenter and NSX Manager

## Prerequisites 
Before you can create a virtual network, make sure you have created an [Azure VMware Solution private cloud](tutorial-create-private-cloud.md). 

## Create a virtual network

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to the resource group you created in the [create a private cloud tutorial](tutorial-create-private-cloud.md) and select **+ Add** to define a new resource. 

1. In the **Search the Marketplace** text box, type **Virtual Network**. Find the Virtual Network resource and select it.

1. On the **Virtual Network** page, select **Create** to set up your virtual network for your private cloud.

1. On the **Create Virtual Network** page, enter the details for your virtual network.

1. On the **Basics** tab, enter a name for the virtual network and select the appropriate region and select **Next : IP Addresses**.

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

1. On the Basics tab of the **Create virtual network gateway** page, provide values for the fields and then select **Review + create**. 

   | Field | Value |
   | --- | --- |
   | **Subscription** | This value is already populated with the Subscription to which the resource group belongs. |
   | **Resource group** | This value is already populated for the current resource group. This should be the resource group you created in a previous test. |
   | **Name** | Enter a unique name for the virtual network gateway. |
   | **Region** | Select the geographical location of the virtual network gateway. |
   | **Gateway type** | Select **ExpressRoute**. |
   | **SKU** | Leave the default value: **standard**. |
   | **Virtual network** | Select the virtual network you created previously. If you do not see the virtual network, make sure the region of the gateway matches the region of your virtual network. |
   | **Gateway subnet address range** | This value is populated when you select the virtual network. Don't change the default value. |
   | **Public IP address** | Select **Create new**. |

   :::image type="content" source="./media/tutorial-configure-networking/create-virtual-network-gateway.png" alt-text="On the Basics tab of the Create virtual network gateway page, provide values for the fields and then select Review + create." border="true":::

1. Verify that the details are correct, and select **Create** to start the deployment of your virtual network gateway. 
1. Once the deployment completes, move to the next section to connect your ExpressRoute connection to the virtual network gateway containing your Azure VMware Solution private cloud.

## Connect ExpressRoute to the virtual network gateway

Now that you've deployed a virtual network gateway, you'll add a connection between it and your Azure VMware Solution private cloud.

1. Navigate to the private cloud you created in the previous tutorial and select **Connectivity** under **Manage**, select the **ExpressRoute** tab.

1. Copy the authorization key. If there is not an authorization key, you need to create one, to do that select **+ Request an authorization key**.

   :::image type="content" source="./media/tutorial-configure-networking/request-auth-key.png" alt-text="Copy the authorization key. If there is not an authorization key, you need to create one, to do that select + Request an authorization key." border="true":::

1. Navigate to the Virtual Network Gateway you created
in the previous step and under **Settings**, select **Connections**. On the **Connections** page, select **+ Add**.

1. On the **Add connection** page, provide values for the fields and select **OK**. 

   | Field | Value |
   | --- | --- |
   | **Name**  | Enter a name for the connection.  |
   | **Connection type**  | Select **ExpressRoute**.  |
   | **Redeem authorization**  | Ensure this box is selected.  |
   | **Virtual network gateway** | The Virtual Network gateway you created previously.  |
   | **Authorization key**  | Copy and paste the authorization key from the ExpressRoute tab for your Resource Group. |
   | **Peer circuit URI**  | Copy and paste the ExpressRoute ID from the ExpressRoute tab for your Resource Group.  |

   :::image type="content" source="./media/tutorial-configure-networking/add-connection.png" alt-text="On the Add connection page, provide values for the fields and select OK." border="true":::

The connection between your ExpressRoute circuit and your Virtual Network is created.



## Locate the URLs for vCenter and NSX Manager

To sign in to vCenter and NSX manager you'll need the URLs to the vCenter web client and the NSX-T manager site. 

Navigate to your Azure VMware Solution private cloud, under **Manage**, select **Identity**, here you'll find the information needed.

:::image type="content" source="./media/tutorial-configure-networking/locate-urls.png" alt-text="Navigate to your Azure VMware Solution private cloud, under Manage, select Identity, here you'll find the information needed." border="true":::

## Next steps

In this tutorial you learned how to:

> [!div class="checklist"]
> * Create a virtual network
> * Create a virtual network gateway
> * Connect your ExpressRoute circuit to the gateway
> * Locate the URLs for vCenter and NSX Manager

Continue to the next tutorial to learn how to create a jump box that is used to connect to your environment so that you can manage your private cloud locally.

> [!div class="nextstepaction"]
> [Access Private Cloud](tutorial-access-private-cloud.md)

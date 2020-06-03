---
title: Tutorial - Configure networking for your VMware private cloud in Azure
description: Learn to create and configure the networking needed to deploy your private cloud in Azure
ms.topic: tutorial
ms.date: 05/04/2020
---

# Tutorial: Configure networking for your VMware private cloud in Azure

An Azure VMware Solution (AVS) private cloud requires a virtual network. Because AVS won't support your on-premises vCenter during preview, additional steps for integration with your on-premises environment are needed. Setting up an ExpressRoute circuit and a Virtual Network Gateway are also required and will be addressed in this tutorial.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a Virtual Network
> * Create a Virtual Network Gateway
> * Connect your ExpressRoute circuit to the gateway
> * Locate the URLs for vCenter and NSX Manager

## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com).

## Create a virtual network

Navigate to the resource group you created in the [previous tutorial](tutorial-create-private-cloud.md), and select **+ Add** to define a new resource.

In the **Search the Marketplace** text box type, **Virtual Network**. Find the Virtual Network resource and select it.

On the Virtual Network page, select **Create** to set up your virtual network for your private cloud.

On the **Create Virtual Network** page, enter the relevant details for your virtual network, a description of the properties is shown in the following table:

> [!IMPORTANT]
> You must use an address space that **does not** overlap with the address space you used when you created your private cloud in the preceding tutorial.

On the **Basics** tab, enter a name for the virtual network and select the appropriate region and select **Next : IP Addresses**

On the **IP Addresses** tab, under **IPv4 address space**, enter the address space you created in the previous tutorial.

Select **+ Add subnet**, and on the **Add subnet** page, give the subnet a name and appropriate address range. When complete, select **Add**.

Select **Review + Create**

:::image type="content" source="./media/tutorial-configure-networking/create-virtual-network.png" alt-text="create a virtual network" border="true":::

Verify the information and select **Create**. Once the deployment is complete, you'll see your virtual network in the resource group.

## Create a Virtual Network Gateway

You have created a virtual network in the preceding section, now you'll create a Virtual Network Gateway.

In your resource group, select **+ Add** to add a new resource.

In the **Search the Marketplace** text box type, **Virtual network gateway**. Find the Virtual Network resource and select it.

On the **Virtual Network gateway** page, select **Create**.

On the Basics tab of the **Create virtual network gateway** page, provide values for the fields. descriptions of the fields are shown in the following table:

| Field | Value |
| --- | --- |
| **Subscription** | This value is already populated with the Subscription to which the resource group belongs. |
| **Resource group** | This value is already populated for the current resource group. This should be the resource group you created in a previous test. |
| **Name** | Enter a unique name for the virtual network gateway. |
| **Region** | Select the geographical location of the virtual network gateway. |
| **Gateway type** | Select **ExpressRoute**. |
| **VPN type** | Select **Route-based**. |
| **SKU** | Leave the default value: **standard**. |
| **Virtual network** | Select the virtual network you created previously. If you do not see the virtual network, make sure the region of the gateway matches the region of your virtual network. |
| **Gateway subnet address range** | This value is populated when you select the virtual network. Don't change the default value. |
| **Public IP address** | Select **Create new**. |

:::image type="content" source="./media/tutorial-configure-networking/create-virtual-network-gateway.png" alt-text="create a gateway" border="true":::

Select **Review + create**, on the next page verify the details are correct, and select **Create** to start deployment of your virtual network gateway. Once the deployment completes, move to the next section in this tutorial to connect your ExpressRoute connection to the virtual network containing your private cloud.

## Connect ExpressRoute to the Virtual Network Gateway

This section walks you through adding a connection between your AVS private cloud and the virtual network gateway you created.

Navigate to the private cloud you created in the previous tutorial and select **Connectivity** under **Manage**, select the **ExpressRoute** tab.

Copy the authorization key. If there is not an authorization key, you need to create one, to do that select **+ Request an authorization key**

:::image type="content" source="./media/tutorial-configure-networking/request-auth-key.png" alt-text="request an authorization key" border="true":::

Navigate to the Virtual Network Gateway you created
in the previous step and under **Settings**, select **Connections**. On the **Connections** page, select **+ Add**.

On the **Add connection** page, provide values for the fields. Descriptions of the fields are shown in the following table:

| Field | Value |
| --- | --- |
| **Name**  | Enter a name for the connection.  |
| **Connection type**  | Select **ExpressRoute**.  |
| **Redeem authorization**  | Ensure this box is selected.  |
| **Virtual network gateway** | The virtual network gateway you created previously  |
| **Authorization key**  | Copy and paste the authorization key from the ExpressRoute tab for your Resource Group. |
| **Peer circuit URI**  | Copy and paste the ExpressRoute ID from the ExpressRoute tab for your Resource Group.  |

Select **OK**. This creates the connection between your ExpressRoute circuit and your virtual network.

:::image type="content" source="./media/tutorial-configure-networking/add-connection.png" alt-text="add a connection" border="true":::

## Locate the URLs for vCenter and NSX Manager

To sign in to vVenter and NSX manager you'll need the urls to the vCenter web client and the NSX-T manager site. To find the urls:

Navigate to your AVS private cloud, under **Manage**, select **Identity**, here you'll find the information needed.

:::image type="content" source="./media/tutorial-configure-networking/locate-urls.png" alt-text="locate the vCenter urls" border="true":::

## Next steps

In this tutorial you learned how to:

> [!div class="checklist"]
> * Create a Virtual Network
> * Create a Virtual Network Gateway
> * Connect your ExpressRoute circuit to the gateway
> * Locate the URLs for vCenter and NSX Manager

Continue to the next tutorial to learn how to create a jump box that is used to connect to your environment so that you can manage your private cloud locally.

> [!div class="nextstepaction"]
> [Access Private Cloud](tutorial-access-private-cloud.md)

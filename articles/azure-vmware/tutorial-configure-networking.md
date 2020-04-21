---
title: Tutorial - Configure networking for your VMWare private cloud in Azure
description: Learn to create and configure the networking needed to deploy your private cloud in Azure
ms.topic: tutorial
ms.date: 05/04/2020
---

# Tutorial: Configure networking for your VMWare private cloud in Azure

In this exercise you create a new virtual network (VNET) in the Resource Group you created previously. Skip this exercise if you already have a VNET defined in this Resource Group.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a Virtual Network
> * Create a Virtual Network Gateway
> * Connect your ExpressRoute circuit to the gateway
> * Locate the URLs for vCenter and NSX Manager

## Sign in to the Azure portal

Sign in to the [Azure portal](https://rc.portal.azure.com).

## Create a virtual network

1. Navigate to the resource group you created in the
previous tutorial, and click **+ Add** to define a new resource.

   ![](./media/tutorial-configure-networking/image11.jpg)

1. Use the **Search the Marketplace** box to find
the **Virtual Network** option and select it.

   ![](./media/tutorial-configure-networking/image12.jpg)

1. The portal displays a Virtual Network splash
screen.

   ![](./media/tutorial-configure-networking/image13.jpg)

1. Click **Create**.

   ![](./media/tutorial-configure-networking/image14.jpg)

1. On the Create Virtual Network tab, complete the fields as shown in the
following table. Use the example values in the table, unless the lab
proctor specifies otherwise:

   | Field                    | Value                                                                                                                             |
   | ------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
   | **Name**                 | Enter a unique name for the virtual network.                                                                                      |
   | **Address space**        | Enter the address space.                                                                                                          |
   | **Subscription**         | This value is already populated with the Subscription the Resource Group belongs to.                                              |
   | **Resource group**       | This value is already populated for the current Resource Group. This should be the Resource Group you created in a previous test. |
   | **Location**             | This value is already populated for the geographic region of the Resource Group.                                                  |
   | **Subnet name**          | Leave this value at default.                                                                                                      |
   | **Subnet Address range** | Enter the subnet address range.                                                                                                   |
   | **DDoS protection**      | Select **Basic**.                                                                                                                 |
   | **Service endpoints**    | Select **Disabled**.                                                                                                              |
   | **Firewall**             | Select **Disabled**.                                                                                                              |

6. Click **Create**. Once the deployment is complete you'll see your virtual network in the resource group.

## Create a Virtual Network Gateway

You have created a virtual network in the preceding section, now you'll create a new Virtual Network Gateway.

1. Navigate to the resource group you are using and click **+ Add** to define a new resource.

   ![](./media/tutorial-configure-networking/image19.jpg)

1. Use the **Search the Marketplace** box to find
the **Virtual network gateway** option and select it

   ![](./media/tutorial-configure-networking/image20.jpg)
1. The Portal displays a Virtual network gateway
splash screen.

   ![](./media/tutorial-configure-networking/image21.jpg)

1. Click **Create**.

   ![](./media/tutorial-configure-networking/image22.jpg)

1. On the Basics tab of the Create virtual network gateway page, complete the fields as shown in the following table.

   | Field                            | Value                                                                                                                                    |
   | -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
   | **Subscription**                 | This value is already populated with the Subscription to which the Resource Group belongs.                                               |
   | **Resource group**               | This value is already populated for the current Resource Group. This should be the Resource Group you created in a previous test.        |
   | **Name**                         | Enter a unique name for the virtual network gateway.                                                                                                |
   | **Region**                       | Select the geographical location of the virtual network gateway.                                                                                    |
   | **Gateway type**                 | Select **ExpressRoute**.                                                                                                                 |
   | **VPN type**                     | Select **Route-based**.                                                                                                                  |
   | **SKU**                          | Leave the default value: **standard**.                                                                                                   |
   | **Virtual network**              | Select the virtual network you created previously. If you do not see the virtual network, make sure the region of the gateway matches the region of your virtual network. |
   | **Gateway subnet address range** | This value is populated when you select the virtual network. Do not change the default value.                                                       |
   | **Public IP address**            | Select **Create new**.                                                                                                                   |
   |                                  |                                                                                                                                          |

1. Click **Review + create** to start deployment of your virtual network gateway. Once complete, move to the next section in this tutorial to connect your ExpressRoute connection to the virtual network containing your private cloud.

## Connect ExpressRoute to the Virtual Network Gateway

This section walks you through adding a connection between your AVS private cloud and the virtual network gateway you created.

1. Display the Resource Group you created in the
previous test and click **Connectivity**.

   ![](./media/tutorial-configure-networking/image24.jpg)

1. Click the **ExpressRoute** tab.

   ![](./media/tutorial-configure-networking/image25.jpg)

1. Copy the authorization key. If there is not an authorization key, you
need to create one.

1. Display the VNET gateway you created
previously in the portal.

   ![](./media/tutorial-configure-networking/image26.jpg)

1. Click **Connections**.

   ![](./media/tutorial-configure-networking/image27.jpg)

1. Click **+ Add**.

   ![](./media/tutorial-configure-networking/image28.jpg)

1. On the Add connection tab, complete the fields as shown in the following table. Use the example values in the table, unless the test discipline requires otherwise:

   | Field                       | Value                                                                                   |
   | --------------------------- | --------------------------------------------------------------------------------------- |
   | **Name**                    | Enter a name for the connection.                                                        |
   | **Connection type**         | Select **ExpressRoute**.                                                                |
   | **Redeem authorization**    | Ensure this box is selected.                                                            |
   | **Virtual network gateway** | The VNET gateway you created previously is selected.                                    |
   | **Authorization key**       | Copy and paste the authorization key from the ExpressRoute tab for your Resource Group. |
   | **Peer circuit URI**        | Copy and paste the ExpressRoute ID from the ExpressRoute tab for your Resource Group.   |

8.Click **OK**. This creates the connection between your ExpressRoute circuit and your virtual network.

## Locate the URLs for vCenter and NSX Manager

In order to sign in to vVenter and NSX manager you'll need the urls to the vCenter web client and the NSX-T manager site. To find the urls:

1. Select your AVS private cloud

   ![](./media/tutorial-configure-networking/image30.png)

1. Under **Manage**, select **Identity**, here you'll find the information needed.

   ![](./media/tutorial-configure-networking/image31.png)

In this tutorial you learned how to:

> [!div class="checklist"]
> * Create a Virtual Network
> * Create a Virtual Network Gateway
> * Connect your ExpressRoute circuit to the gateway
> * Locate the URLs for vCenter and NSX Manager

Continue to the next tutorial to learn how to create a jump box that is used to connect to your environment.

> [!div class="nextstepaction"]
> [Access Private Cloud](tutorial-access-private-cloud.md)
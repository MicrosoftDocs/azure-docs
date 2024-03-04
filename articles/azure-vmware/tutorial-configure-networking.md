---
title: Tutorial - Configure networking for your VMware private cloud in Azure
description: Learn to create and configure the networking needed to deploy your private cloud in Azure
ms.topic: tutorial
ms.custom: contperf-fy22q1
ms.service: azure-vmware
ms.date: 01/13/2023

---

# Tutorial: Configure networking for your VMware private cloud in Azure

An Azure VMware Solution private cloud requires an Azure Virtual Network. Because Azure VMware Solution doesn't support your on-premises vCenter Server, you'll need to do additional steps to integrate with your on-premises environment. Setting up an ExpressRoute circuit and a virtual network gateway is also required.

[!INCLUDE [disk-pool-planning-note](includes/disk-pool-planning-note.md)]


In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a virtual network 
> * Create a virtual network gateway
> * Connect your ExpressRoute circuit to the gateway

>[!NOTE]
>Before you create a new vNet, evaluate if you already have an existing vNet in Azure and plan to use it to connect to Azure VMware Solution; or whether to create a new vNet entirely.  
>* To use an existing vNet in same Azure subscription as Azure VMware Solution, use the **[Azure vNet connect](#select-an-existing-vnet)** tab under **Connectivity**. 
>* To use an existing vNet in a different Azure subscription than Azure VMware Solution, use the guidance on **[Connect to the private cloud manually](#connect-to-the-private-cloud-manually)**. 
>* To create a new vNet in same Azure subscription as Azure VMware Solution, use the **[Azure vNet connect](#create-a-new-vnet)** tab or create one [manually](#create-a-vnet-manually).

## Connect with the Azure vNet connect feature

You can use the **Azure vNet connect** feature to use an existing vNet or create a new vNet to connect to Azure VMware Solution. **Azure vNet connect** is a function to configure vNet connectivity, it does not record configuration state; browse the Azure portal to check what settings have been configured.

>[!NOTE]
>Address space in the vNet cannot overlap with the Azure VMware Solution private cloud CIDR.

### Prerequisites

Before selecting an existing vNet, there are specific requirements that must be met.

1. vNet must contain a gateway subnet.
1. In the same region as Azure VMware Solution private cloud.
1. In the same resource group as Azure VMware Solution private cloud.
1. vNet must contain an address space that doesn't overlap with Azure VMware Solution.
1. Validate solution design is within Azure VMware Solution limits (Microsoft technical documentation/azure/azure-resource-manager/management/azure-subscription-service-limits).

### Select an existing vNet

When you select an existing vNet, the Azure Resource Manager (ARM) template that creates the vNet and other resources gets redeployed. The resources, in this case, are the public IP, gateway, gateway connection, and ExpressRoute authorization key. If everything is set up, the deployment won't change anything. However, if anything is missing, it gets created automatically. For example, if the GatewaySubnet is missing, then it gets added during the deployment.

1. In your Azure VMware Solution private cloud, under **Manage**, select **Connectivity**.

2. Select the **Azure vNet connect** tab and then select the existing vNet.

   :::image type="content" source="media/networking/azure-vnet-connect-tab.png" alt-text="Screenshot showing the Azure vNet connect tab under Connectivity with an existing vNet selected.":::

3. Select **Save**.

   At this point, the vNet validates if overlapping IP address spaces between Azure VMware Solution and vNet are detected. If detected, change the network address of either the private cloud or the vNet so they don't overlap. 


### Create a new vNet

When you create a new vNet, the required components to connect to Azure VMware Solution are automatically created.

1. In your Azure VMware Solution private cloud, under **Manage**, select **Connectivity**.

2. Select the **Azure vNet connect** tab and then select **Create new**.

   :::image type="content" source="media/networking/azure-vnet-connect-tab-create-new.png" alt-text="Screenshot showing the Azure vNet connect tab under Connectivity.":::

3. Provide or update the information for the new vNet and then select **OK**.

   At this point, the vNet validates if overlapping IP address spaces between Azure VMware Solution and vNet are detected. If detected, change the private cloud or vNet's network address so they don't overlap. 

   :::image type="content" source="media/networking/create-new-virtual-network.png" alt-text="Screenshot showing the Create virtual network window.":::

The vNet with the provided address range and GatewaySubnet is created in your subscription and resource group.  


## Connect to the private cloud manually

### Create a vNet manually

1. Sign in to the [Azure portal](https://portal.azure.com).
    
   >[!NOTE]
   >If you need access to the Azure US Gov portal, go to https://portal.azure.us/

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

   :::image type="content" source="./media/tutorial-configure-networking/create-virtual-network.png" alt-text="Screenshot showing the settings for the new virtual network." border="true":::

1. Verify the information and select **Create**. Once the deployment is complete, you'll see your virtual network in the resource group.



### Create a virtual network gateway

Now that you've created a virtual network, you'll create a virtual network gateway.

1. In your resource group, select **+ Add** to add a new resource.

1. In the **Search the Marketplace** text box, type **Virtual network gateway**. Find the Virtual Network resource and select it.

1. On the **Virtual Network gateway** page, select **Create**.

1. On the Basics tab of the **Create virtual network gateway** page, provide values for the fields, and then select **Review + create**. 

   | Field | Value |
   | --- | --- |
   | **Subscription** | Pre-populated value with the Subscription to which the resource group belongs. |
   | **Resource group** | Pre-populated value for the current resource group. Value should be the resource group you created in a previous test. |
   | **Name** | Enter a unique name for the virtual network gateway. |
   | **Region** | Select the geographical location of the virtual network gateway. |
   | **Gateway type** | Select **ExpressRoute**. |
   | **SKU** | Select the gateway SKU appropriate for your workload. <br> For Azure NetApp Files datastores, select UltraPerformance or ErGw3Az. |
   | **Virtual network** | Select the virtual network you created previously. If you don't see the virtual network, make sure the gateway's region matches the region of your virtual network. |
   | **Gateway subnet address range** | This value is populated when you select the virtual network. Don't change the default value. |
   | **Public IP address** | Select **Create new**. |

   :::image type="content" source="./media/tutorial-configure-networking/create-virtual-network-gateway.png" alt-text="Screenshot showing the details for the virtual network gateway." border="true":::

1. Verify that the details are correct, and select **Create** to start your virtual network gateway deployment.

1. Once the deployment completes, move to the next section to connect your ExpressRoute connection to the virtual network gateway containing your Azure VMware Solution private cloud.

### Connect ExpressRoute to the virtual network gateway

Now that you've deployed a virtual network gateway, you'll add a connection between it and your Azure VMware Solution private cloud.

[!INCLUDE [connect-expressroute-to-vnet](includes/connect-expressroute-vnet.md)]


## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Create a Virtual Network using the vNet Connect Feature
> * Create a Virtual Network Manually
> * Create a Virtual Network gateway
> * Connect your ExpressRoute circuit to the gateway


Continue to the next tutorial to learn how to create the NSX-T network segments used for VMs in vCenter Server.

> [!div class="nextstepaction"]
> [Create an NSX-T network segment](./tutorial-nsx-t-network-segment.md)

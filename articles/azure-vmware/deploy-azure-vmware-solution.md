---
title: Deploy and configure Azure VMware Solution
description: Learn how to use the information gathered in the planning stage to deploy and configure the Azure VMware Solution private cloud.
ms.topic: tutorial
ms.custom: contperf-fy21q3
ms.date: 02/17/2021
---

# Deploy and configure Azure VMware Solution

In this article, you'll use the information from the [planning section](production-ready-deployment-steps.md) to deploy and configure Azure VMware Solution. 

>[!IMPORTANT]
>If you haven't defined the information yet, go back to the [planning section](production-ready-deployment-steps.md) before continuing.


## Step 1. Create an Azure VMware Solution private cloud

[!INCLUDE [create-private-cloud-azure-portal-steps](includes/create-private-cloud-azure-portal-steps.md)]

>[!NOTE]
>For an end-to-end overview of this step, view the [Azure VMware Solution: Deployment](https://www.youtube.com/embed/gng7JjxgayI) video.


## Step 2. Connect to Azure Virtual Network with ExpressRoute



## Step 3. Validate the connection




-------------------------------------------

## Connect to a virtual network with ExpressRoute

>[!IMPORTANT]
>If you've already defined a virtual network in the deployment screen in Azure, then skip to the next section.

If you didn't define a virtual network in the deployment step and your intent is to connect the Azure VMware Solution's ExpressRoute to an existing ExpressRoute Gateway, follow these steps.

[!INCLUDE [connect-expressroute-to-vnet](includes/connect-expressroute-vnet.md)]

## Verify network routes advertised

The jump box is in the virtual network where Azure VMware Solution connects through its ExpressRoute circuit.  In Azure, go to the jump box's network interface and [view the effective routes](../virtual-network/manage-route-table.md#view-effective-routes).

In the effective routes list, you should see the networks created as part of the Azure VMware Solution deployment. You'll see multiple networks that were derived from the [`/22` network you defined](production-ready-deployment-steps.md#define-the-ip-address-segment-for-private-cloud-management) when you create a private cloud.  


:::image type="content" source="media/pre-deployment/azure-vmware-solution-effective-routes.png" alt-text="Verify network routes advertised from Azure VMware Solution to Azure Virtual Network" lightbox="media/pre-deployment/azure-vmware-solution-effective-routes.png":::

In this example, the 10.74.72.0/22 network was input during deployment derives the /24 networks.  If you see something similar, you can connect to vCenter in Azure VMware Solution.



## Next steps

In the next section, you'll connect Azure VMware Solution to your on-premises network through ExpressRoute.
> [!div class="nextstepaction"]
> [Connect Azure VMware Solution to your on-premises environment](tutorial-expressroute-global-reach-private-cloud.md)

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


## Create an Azure VMware Solution private cloud

Follow the prerequisites and steps in the [Create an Azure VMware Solution private cloud](tutorial-create-private-cloud.md) tutorial. You can create an Azure VMware Solution private cloud by using the [Azure portal](tutorial-create-private-cloud.md#azure-portal) or by using the [Azure CLI](tutorial-create-private-cloud.md#azure-cli).  

>[!NOTE]
>For an end-to-end overview of this step, view the [Azure VMware Solution: Deployment](https://www.youtube.com/embed/gng7JjxgayI) video.

## Create the jump box

>[!IMPORTANT]
>If you left the **Virtual Network** option blank during the initial provisioning step on the **Create a Private Cloud** screen, complete the [Configure networking for your VMware private cloud](tutorial-configure-networking.md) tutorial **before** you proceed with this section.  

After you deploy Azure VMware Solution, you'll create the virtual network's jump box that connects to vCenter and NSX. Once you've configured ExpressRoute circuits and ExpressRoute Global Reach, the jump box isn't needed.  But it's handy to reach vCenter and NSX in your Azure VMware Solution.  

:::image type="content" source="media/pre-deployment/jump-box-diagram.png" alt-text="Create the Azure VMware Solution jump box" border="false" lightbox="media/pre-deployment/jump-box-diagram.png":::

To create a virtual machine (VM) in the virtual network that you [identified or created as part of the deployment process](production-ready-deployment-steps.md#attach-azure-virtual-network-to-azure-vmware-solution), follow these instructions: 

[!INCLUDE [create-avs-jump-box-steps](includes/create-jump-box-steps.md)]

## Connect to a virtual network with ExpressRoute

>[!IMPORTANT]
>If you've already defined a virtual network in the deployment screen in Azure, then skip to the next section.

If you didn't define a virtual network in the deployment step and your intent is to connect the Azure VMware Solution's ExpressRoute to an existing ExpressRoute Gateway, follow these steps.

[!INCLUDE [connect-expressroute-to-vnet](includes/connect-expressroute-vnet.md)]

## Verify network routes advertised

The jump box is in the virtual network where Azure VMware Solution connects through its ExpressRoute circuit.  In Azure, go to the jump box's network interface and [view the effective routes](../virtual-network/manage-route-table.md#view-effective-routes).

In the effective routes list, you should see the networks created as part of the Azure VMware Solution deployment. You'll see multiple networks that were derived from the [`/22` network you defined](production-ready-deployment-steps.md#ip-address-segment-for-private-cloud-management) when you [create a private cloud](#create-an-azure-vmware-solution-private-cloud).  

:::image type="content" source="media/pre-deployment/azure-vmware-solution-effective-routes.png" alt-text="Verify network routes advertised from Azure VMware Solution to Azure Virtual Network" lightbox="media/pre-deployment/azure-vmware-solution-effective-routes.png":::

In this example, the 10.74.72.0/22 network was input during deployment derives the /24 networks.  If you see something similar, you can connect to vCenter in Azure VMware Solution.

## Connect and sign in to vCenter and NSX-T

Log into the jump box you created in the earlier step. Once you've logged in, open a web browser and navigate to and log into both vCenter and NSX-T Manager.  

You can identify the vCenter, and NSX-T Manager console's IP addresses and credentials in the Azure portal.  Select your private cloud and then **Manage** > **Identity**.

>[!TIP]
>Select **Generate a new password** to generate new vCenter and NSX-T passwords.

:::image type="content" source="media/tutorial-access-private-cloud/ss4-display-identity.png" alt-text="Display private cloud vCenter and NSX Manager URLs and credentials." border="true":::



## Create a network segment on Azure VMware Solution

You use NSX-T Manager to create new network segments in your Azure VMware Solution environment.  You defined the networks you want to create in the [planning section](production-ready-deployment-steps.md).  If you haven't defined them, go back to the [planning section](production-ready-deployment-steps.md) before proceeding.

>[!IMPORTANT]
>Make sure the CIDR network address block you defined doesn't overlap with anything in your Azure or on-premises environments.  

Follow the [Create an NSX-T network segment in Azure VMware Solution](tutorial-nsx-t-network-segment.md) tutorial to create an NSX-T network segment in Azure VMware Solution.

## Verify advertised NSX-T segment

Go back to the [Verify network routes advertised](#verify-network-routes-advertised) step. You'll see other routes in the list representing the network segments you created in the previous step.  

For virtual machines, you'll assign the segments you created in the [Create a network segment on Azure VMware Solution](#create-a-network-segment-on-azure-vmware-solution) step.  

Because DNS is required, identify what DNS server you want to use.  

- If you have ExpressRoute Global Reach configured, use whatever DNS server you would use on-premises.  
- If you have a DNS server in Azure, use that.  
- If you don't have either, then use whatever DNS server your jump box is using.

>[!NOTE]
>This step is to identify the DNS server, and no configurations are done in this step.

## (Optional) Provide DHCP services to NSX-T network segment

If you plan to use DHCP on your NSX-T segments, continue with this section. Otherwise, skip to the [Add a VM on the NSX-T network segment](#add-a-vm-on-the-nsx-t-network-segment) section.  

Now that you've created your NSX-T network segment, you can create and manage DHCP in Azure VMware Solution in two ways:

* If you're using NSX-T to host your DHCP server, you'll need to [create a DHCP server](manage-dhcp.md#create-a-dhcp-server) and [relay to that server](manage-dhcp.md#create-dhcp-relay-service). 
* If you're using a third-party external DHCP server in your network, you'll need to [create DHCP relay service](manage-dhcp.md#create-dhcp-relay-service).  For this option, [only do the relay configuration](manage-dhcp.md#create-dhcp-relay-service).


## Add a VM on the NSX-T network segment

In your Azure VMware Solution vCenter, deploy a VM and use it to verify connectivity from your Azure VMware Solution networks to:

- The internet
- Azure Virtual Networks
- On-premises.  

Deploy the VM as you would in any vSphere environment.  Attach the VM to one of the network segments you previously created in NSX-T.  

>[!NOTE]
>If you set up a DHCP server, you get your network configuration for the VM from it (don't forget to set up the scope).  If you are going to configure statically, then configure as you normally would.

## Test the NSX-T segment connectivity

Log into the VM created in the previous step and verify connectivity;

1. Ping an IP on the internet.
2. In a web browser, go to an internet site.
3. Ping the jump box that sits on the Azure Virtual Network.

Azure VMware Solution is now up and running, and you've successfully established connectivity to and from Azure Virtual Network and the internet.

## Next steps

In the next section, you'll connect Azure VMware Solution to your on-premises network through ExpressRoute.
> [!div class="nextstepaction"]
> [Connect Azure VMware Solution to your on-premises environment](azure-vmware-solution-on-premises.md)

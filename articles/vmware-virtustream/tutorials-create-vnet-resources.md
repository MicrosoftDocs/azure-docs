---
title: Azure VMware Solution by Virtustream tutorial - create VNet resources
description: In this Azure VMware Solution (AVS) by Virtustream tutorial, you create a VNet and resources to connect to peer with a private cloud ExpressRoute circuit.
services: 
author: v-jetome

ms.service: vmware-virtustream
ms.topic: tutorial
ms.date: 07/29/2019
ms.author: v-jetome
ms.custom: 

#Customer intent: As a VMware administrator, I want to learn how to create resources in a VNet that are used to peer with an ExpressRoute circuit of a private cloud.
---

# Tutorial: Create VNet resources to peer with an AVS by Virtustream private cloud

In this tutorial, you create a service VNet and other required resources in your Azure subscription. The resources include a Windows virtual machine, a gateway subnet, and an ExpressRoute gateway. The gateway is peered with the ExpressRoute circuit of your new private cloud.

Using this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a VNet and required resources
> * Request an ExpressRoute authorization key and Resource ID
> * Use the authorization key and ID to peer an ExpressRoute gateway and an ExpressRoute circuit

The previous tutorial provided the instructions for creating an Azure VMware Solution (AVS) by Virtustream private cloud. It's recommended to use the tutorials in order, but most of this tutorial can be done first.

## Prerequisites

It's recommended that you first plan the private network address spaces that you will use for the VNet you create in this tutorial. The network address space of the new VNet must not overlap with the network address space of the private cloud you will peer with. The details of this planning are provided in the [fist tutorial][./media/create-private-cloud](tutorials-create-private-cloud.md).

Prerequisites:
- Access to the Azure portal
- A non-overlapping network address space for the gateway subnet

## Create a VNet

In the Azure portal, select a resource group in the Azure portal and then select **+ Add**.

![Add a new resource to an existing resource group](./media/create-vnet-resources/ss1-pc1-service-rg.png)

Select **+ Add > virtual network**. In the **Create virtual network** form, enter the configuration for the new VNet and then select **Create**.

![Create a new vnet](./media/create-vnet-resources/ss2-create-service-vnet.png)

## Create a gateway subnet and an ExpressRoute gateway

In the blade for the new VNet, select **Subnets > + Gateway subnet**.

![Select add a new gateway subnet](./media/create-vnet-resources/ss3-add-gateway-subnet.png)

In the blade for the new subnet, select **OK**.

![Add a new gateway subnet](./media/create-vnet-resources/ss4-create-gatewaysubnet.png)

Once the gateway subnet is created, search for and select **Virtual network gateway > Create**.

![Add a new express route gateway](./media/create-vnet-resources/ss5-azure-vng-create.png)

Enter the required information and then select **Review + create**.
 
![Configure a new express route gateway](./media/create-vnet-resources/ss6-create-ergw-form.png)

When validation passes, select **Create**.

![Create a new express route gateway](./media/create-vnet-resources/ss7-create-ergw-submit.png)

## Add a new Windows virtual machine

In the resource group, select **+ Add** then search and select **Microsoft Windows 10 > Create**.

![Add a new Windows 10 VM for a jumpbox](./media/create-vnet-resources/ss8-azure-w10vm-create.png)

Enter the required information and then select **Review + create**.

![Configure a new Windows 10 VM for a jumpbox](./media/create-vnet-resources/ss9-basic-wjb01.png)

When the new VM is configured to your specifications, select **Review + create**. Once validation passes, select **Create**.

![Create a new Windows 10 VM for a jumpbox](./media/create-vnet-resources/ss11-review-create-wjb01.png)

## Next steps

The next step is to [access your private cloud](tutorials-access-private-cloud.md) using the Windows VM and ExpressRoute gateway you created in this tutorial.

<!-- LINKS - external-->
[resource provider]: https://docs.microsoft.com/azure/azure-resource-manager/resource-manager-supported-services
[enable Global Reach]: https://docs.microsoft.com/azure/expressroute/expressroute-howto-set-global-reach-cli#enable-connectivity-between-expressroute-circuits-in-different-azure-subscriptions

<!-- LINKS - internal -->

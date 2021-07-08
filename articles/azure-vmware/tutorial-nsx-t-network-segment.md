---
title: Tutorial - Add an NSX-T network segment in Azure VMware Solution
description: Learn how to add an NSX-T network segment to use for virtual machines (VMs) in vCenter.
ms.topic: tutorial
ms.date: 07/16/2021
---

# Tutorial: Add an NSX-T network segment in Azure VMware Solution 

An Azure VMware Solution private cloud comes with NSX-T by default. The private cloud comes pre-provisioned with an NSX-T Tier-0 gateway in **Active/Active** mode and a default NSX-T Tier-1 gateway in Active/Standby mode.  These gateways let you connect the segments (logical switches) and provide East-West and North-South connectivity. 

After deploying Azure VMware Solution, you can configure the necessary NSX-T objects from the Azure portal.  It presents a simplified view of NSX-T operations a VMware administrator needs daily and targeted at users not familiar with NSX-T Manager.  

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Add network segments in either NSX-T Manager or the Azure portal
> * Observe the new network segment in vCenter

## Prerequisites

An Azure VMware Solution private cloud with access to the vCenter and NSX-T Manager interfaces. For more information, see the [Configure networking](tutorial-configure-networking.md) tutorial.

## Add network segment in NSX-T Manager

The virtual machines (VMs) created in vCenter are placed onto the network segments created in NSX-T and are visible in vCenter.

[!INCLUDE [add-network-segment-steps](../includes/add-network-segment-steps.md)]

## Create an NSX-T segment in the Azure portal

[!INCLUDE [create-nsxt-segment-azure-portal-steps](../includes/create-nsxt-segment-azure-portal-steps.md)]

## Next steps

In this tutorial, you created an NSX-T network segment to use for VMs in vCenter. 

You can now: 

- [Create and manage DHCP for Azure VMware Solution](configure-dhcp-azure-vmware-solution.md)
- [Create a content Library to deploy VMs in Azure VMware Solution](deploy-vm-content-library.md) 
- [Peer on-premises environments to a private cloud](tutorial-expressroute-global-reach-private-cloud.md)


<!-- LINKS - external-->

<!-- LINKS - internal -->

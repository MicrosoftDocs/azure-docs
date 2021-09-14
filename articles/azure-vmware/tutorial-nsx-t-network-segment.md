---
title: Tutorial - Add a network segment in Azure VMware Solution
description: Learn how to add a network segment to use for virtual machines (VMs) in vCenter.
ms.topic: tutorial
ms.custom: contperf-fy22q1
ms.date: 07/16/2021
---

# Tutorial: Add a network segment in Azure VMware Solution 

After deploying Azure VMware Solution, you can configure an NSX-T network segment from NSX-T Manager or the Azure portal. Once configured, the segments are visible in Azure VMware Solution, NSX-T Manger, and vCenter. NSX-T comes pre-provisioned by default with an NSX-T Tier-0 gateway in **Active/Active** mode and a default NSX-T Tier-1 gateway in **Active/Standby** mode.  These gateways let you connect the segments (logical switches) and provide East-West and North-South connectivity. 

>[!TIP]
>The Azure portal presents a simplified view of NSX-T operations a VMware administrator needs regularly and targeted at users not familiar with NSX-T Manager. 


In this tutorial, you learn how to:

> [!div class="checklist"]
> * Add network segments using either NSX-T Manager or the Azure portal
> * Verify the new network segment 

## Prerequisites

An Azure VMware Solution private cloud with access to the vCenter and NSX-T Manager interfaces. For more information, see the [Configure networking](tutorial-configure-networking.md) tutorial.

## Use NSX-T Manager to add network segment 

The virtual machines (VMs) created in vCenter are placed onto the network segments created in NSX-T and are visible in vCenter.

[!INCLUDE [add-network-segment-steps](includes/add-network-segment-steps.md)]

## Use Azure portal to add an NSX-T segment

[!INCLUDE [create-nsxt-segment-azure-portal-steps](includes/create-nsxt-segment-azure-portal-steps.md)]


## Verify the new network segment

Verify the presence of the new network segment. In this example, **ls01** is the new network segment.

1. In NSX-T Manager, select **Networking** > **Segments**. 

    :::image type="content" source="media/nsxt/nsxt-new-segment-overview-2.png" alt-text="Screenshot showing the confirmation and status of the new network segment is present in NSX-T.":::

1. In vCenter, select **Networking** > **SDDC-Datacenter**.

    :::image type="content" source="media/nsxt/vcenter-with-ls01-2.png" alt-text="Screenshot showing the confirmation that the new network segment is present in vCenter.":::

## Next steps

In this tutorial, you created an NSX-T network segment to use for VMs in vCenter. 

You can now: 

- [Configure and manage DHCP for Azure VMware Solution](configure-dhcp-azure-vmware-solution.md)
- [Create a Content Library to deploy VMs in Azure VMware Solution](deploy-vm-content-library.md) 
- [Peer on-premises environments to a private cloud](tutorial-expressroute-global-reach-private-cloud.md)


<!-- LINKS - external-->

<!-- LINKS - internal -->

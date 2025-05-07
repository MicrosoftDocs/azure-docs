---
title: Tutorial - Add an NSX network segment in Azure VMware Solution
description: Learn how to add an NSX network segment to use for virtual machines (VMs) in vCenter Server.
ms.topic: tutorial
ms.custom: engagement-fy23
ms.service: azure-vmware
ms.date: 6/12/2024
---

# Tutorial: Add an NSX network segment in Azure VMware Solution 

After deploying Azure VMware Solution, you can configure an NSX network segment from NSX Manager or the Azure portal. Once configured, the segments are visible in Azure VMware Solution, NSX Manager, and vCenter Server. NSX comes pre-provisioned by default with an NSX Tier-0 gateway in **Active/Active** mode and a default NSX Tier-1 gateway in **Active/Standby** mode.  These gateways let you connect the segments (logical switches) and provide East-West and North-South connectivity. 

>[!TIP]
>The Azure portal presents a simplified view of NSX operations a VMware administrator needs regularly and targeted at users not familiar with NSX Manager. 


In this tutorial, you learn how to:

> [!div class="checklist"]
> * Add network segments using either NSX Manager or the Azure portal
> * Verify the new network segment 

## Prerequisites

An Azure VMware Solution private cloud with access to the vCenter Server and NSX Manager interfaces. For more information, see the [Configure networking](tutorial-configure-networking.md) tutorial.


## Use Azure portal to add an NSX network segment

[!INCLUDE [create-nsxt-segment-azure-portal-steps](includes/create-nsxt-segment-azure-portal-steps.md)]

## Use NSX Manager to add network segment 

The virtual machines (VMs) created in vCenter Server are placed onto the network segments created in NSX and are visible in vCenter Server.

[!INCLUDE [add-network-segment-steps](includes/add-network-segment-steps.md)]

## Verify the new network segment

Verify the presence of the new network segment. In this example, **ls01** is the new network segment.

1. In NSX Manager, select **Networking** > **Segments**. 

    :::image type="content" source="media/nsxt/nsxt-new-segment-overview-2.png" alt-text="Screenshot shows the confirmation and status of the new network segment is present in NSX.":::

1. In vCenter Server, select **Networking** > **SDDC-Datacenter**.

    :::image type="content" source="media/nsxt/vcenter-with-ls01-2.png" alt-text="Screenshot shows the confirmation that the new network segment is present in vCenter Server.":::

## Next steps

In this tutorial, you created an NSX network segment to use for VMs in vCenter Server. 

You can now: 

- [Configure and manage DHCP for Azure VMware Solution](configure-dhcp-azure-vmware-solution.md)
- [Create a Content Library to deploy VMs in Azure VMware Solution](deploy-vm-content-library.md) 
- [Peer on-premises environments to a private cloud](tutorial-expressroute-global-reach-private-cloud.md)


<!-- LINKS - external-->

<!-- LINKS - internal -->

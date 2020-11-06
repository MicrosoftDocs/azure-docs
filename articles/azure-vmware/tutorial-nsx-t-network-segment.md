---
title: Tutorial - Add a network segment in Azure VMware Solution
description: Learn how to create a NSX-T network segment to use for virtual machines (VMs) in vCenter.
ms.topic: tutorial
ms.date: 11/09/2020
---

# Tutorial: Add a network segment in Azure VMware Solution 

The virtual machines (VMs) created in vCenter are placed onto the network segments created in NSX-T and are visible in vCenter.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Navigate in NSX-T Manager to add network segments
> * Add a new network segment
> * Observe the new network segment in vCenter

## Prerequisites

An Azure VMware Solution private cloud with access to the vCenter and NSX-T Manager interfaces. For more information, see the [Configure networking](tutorial-configure-networking.md) tutorial.

## Add a network segment

[!INCLUDE [add-network-segment-steps](includes/add-network-segment-steps.md)]

## Next steps

In this tutorial, you created a NSX-T network segment to use for VMs in vCenter. 

You can now: 

- [Create and manage DHCP for Azure VMware Solution](manage-dhcp.md)
- [Create a content Library to deploy VMs in Azure VMware Solution](deploy-vm-content-library.md) 
- [Peer on-premises environments to a private cloud](tutorial-expressroute-global-reach-private-cloud.md)


<!-- LINKS - external-->

<!-- LINKS - internal -->

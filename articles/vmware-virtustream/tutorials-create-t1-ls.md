---
title: Azure VMware Solution by Virtustream tutorial - create an NSX-T network
description: In this Azure VMware Solution by Virtustream (AVS by Virtustream) tutorial, you create an NSX-T T1 router with a logical switch. You then create a DHCP server and associate it with the logical switch.
services: 
author: v-jetome

ms.service: vmware-virtustream
ms.topic: tutorial
ms.date: 07/29/2019
ms.author: v-jetome
ms.custom: 

#Customer intent: As a VMware administrator or user of an AVS by Virtustream private cloud, I want to learn how to create an NSX-T T1 router, a logical swith on the router, and configure DHCP in preparation for deploying a VM on the network that has been created.
---

# Tutorial: Create an NSX-T network on an Azure VMware Solution by Virtustream private cloud

AVS by Virtustream private clouds provide Azure-based environments to run VMware workload virtual machines (VMs). You can quickly create networks in a private cloud and then deploy or migrate VMs on those networks. In this tutorial you create an NSX-T T1 router and a logical switch with DHCP services. Using NSX-T Manager, you learn how to create:

> [!div class="checklist"]
> * T1 router
> * Logical switch
> * Port on a router
> * DHCP services

## Prerequisites

In previous tutorials, you created a private cloud in Azure and received the credentials to access vCenter and NSX-T manager. If you haven't created a private cloud and want to follow along step-by-step with this tutorial, [create a private cloud][tutorials-create-private-cloud].

This tutorial requires that you have access to vCenter and NSX-T Manager in your private cloud. See the Access Private Cloud tutorial if you need to establish access.

<!-- [][tutorial-access-private-cloud] -->

Ensure that you have the IP address and admin credentials for the NSX-T Manager. These items were provided when the private cloud was deployed and are available in the Azure portal.

Using a browser in a VM in the VNet, navigate to the IP address of the NSX-T Manager and sign in as the **admin** user.

On first sign in to the NSX-T manager, the details on the home page should match the following initial configuration.

![Image of NSX-T Manager initial configuration](./media/nsx-t1-ls/nsx-initial-config.png)

## Create a logical switch

Select **Networking > Switching**.

![Select NSX-T Switching](./media/nsx-t1-ls/nsx-select-switching.png)

Select **+ ADD** and in the form enter a name for the logical switch.
Select the **TNTXX-OVRLAY-TZ** Transport Zone.
Select **Use Default**.
Enter an Uplink Teaming Policy Name.
Select Admin Status of **Up**.
Select **Hierarchical Two-Tier replication**.

![Add a new NSX-T Logical Switch form](./media/nsx-t1-ls/nsx-add-switch.png)

Select **ADD**.

![Add a new NSX-T Logical Switch form detail](./media/nsx-t1-ls/nsx-add-switch-form.png)

![Add a new NSX-T Logical Switch result](./media/nsx-t1-ls/nsx-add-switch-results.png)

## Create a T1 router

Select **Networking > Routers**.

![Select NSX-T Routing](./media/nsx-t1-ls/nsx-select-routers.png)

Select **+ ADD**, and then select **Tier-1 Router**.
Enter a **Name** and select **Non-preemptive** Failover Mode.

![Add NSX-T T1 router](./media/nsx-t1-ls/nsx-add-router.png)

![Add NSX-T T1 router form](./media/nsx-t1-ls/nsx-add-router-form.png)

> [!NOTE]
> There is only a single Tier-0 Router and a single NSX-T Edge Node cluster to select.

Select **ADD**.

![Add a new NSX-T DHCP server Router result](./media/nsx-t1-ls/nsx-add-router-results.png)

## Add the logical switch to a port on the T1 router

Select **Networking > Routers** and then choose the T1 router that was just created.

![Select Router for Logical Switch](./media/nsx-t1-ls/nsx-show-router-overview.png)

> [!WARNING]
> Never select or edit the T0 router.

Select **Configuration > Router Ports > + ADD**.

Complete the form with a new name for the router port, the **Logical Switch** name created in a previous section, an **IP address/mask** in CIDR notation, and the following selections for **Type**, **URPF Mode**, and **Logical Switch Port**.

![Select router port for configuration](./media/nsx-t1-ls/nsx-add-router-port.png)

Select **ADD**.

![Configure router port form](./media/nsx-t1-ls/nsx-add-router-port-form.png)

![Add a router port result](./media/nsx-t1-ls/nsx-add-router-port-results.png)

## Add DHCP service to the logical switch

Select **Networking > DHCP > Server Profiles > + ADD**.

Enter a **Name** and select the **Edge Cluster** on the form.

![Add a DHCP server profile](./media/nsx-t1-ls/nsx-add-dhcp-server-profile.png)

![Add a DHCP server profile](./media/nsx-t1-ls/nsx-add-dhcp-server-profile-form.png)

Select **ADD**.

![Add  DHCP server profile result](./media/nsx-t1-ls/nsx-add-dhcp-server-profile-results.png)

Use this profile to create a DHCP server for the logical switch.

Select **Networking > DHCP > Servers**.
Select **+ ADD** to add a DHCP server. Enter a name and other details on the form.

![Add an NSX-T DHCP server form](./media/nsx-t1-ls/nsx-associate-dhcp-server.png)

Select **+ ADD > Tier-1 Router**, and enter a name and other details in the form (what's shown are examples):

![Add NSX-T DHCP server](./media/nsx-t1-ls/nsx-add-dhcp-server.png)

Select **ADD**.

![Add NSX-T DHCP server form](./media/nsx-t1-ls/nsx-add-dhcp-server-form.png)

![Add an NSX-T DHCP server result](./media/nsx-t1-ls/nsx-add-dhcp-server-form-results.png)

Select the new DHCP server in **DHCP > Servers**.
Select **IP Pools > + ADD** and the enter the required information in the form.

![Add IP pools to a DHCP server](./media/nsx-t1-ls/nsx-add-dhcp-ip-pools-2.png)

Select **ADD**.

![Add IP pools to a DHCP server form](./media/nsx-t1-ls/nsx-add-dhcp-ip-pools-form.png)

![Add IP pools to a DHCP server result](./media/nsx-t1-ls/nsx-add-dhcp-ip-pools-results-2.png)

Select **Actions (the gear icon) > Attach to Logical Switch**.

![Select Attach a Logical Switch to a DHCP server](./media/nsx-t1-ls/nsx-attach-switch-to-dhcp-server.png)

Select the new **Logical Switch** from the pulldown list. Select **ATTACH**.

![Attach a Logical Switch to a DHCP server](./media/nsx-t1-ls/nsx-attach-switch-to-dhcp-form.png)

![Attach a Logical Switch to a DHCP server result](./media/nsx-t1-ls/nsx-attach-switch-to-dhcp-server-results.png)

With DHCP services enabled on the NSX-T logical switch, virtual machines deployed on the network can now receive a default gateway and an IP address.

## Next steps

In the next tutorial, you [deploy a virtual machine](tutorials-deploy-vm.md).
<!-- [deploy a VM][tutorials-deploy-vm]. -->

<!-- [Deploy a virtual machine on the NSX-T logical switch network.][tutorials-deploy-vm] -->

<!-- LINKS - external-->

<!-- LINKS - internal -->

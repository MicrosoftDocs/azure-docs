---
title: Azure VMware Solution by Virtustream tutorial - Create an NSX-T network
description: In this Azure VMware Solution by Virtustream (AVS by Virtustream) tutorial, you create an NSX-T T1 router and a logical switch with DHCP services using NSX-T Manager in the private cloud.
services: 
author: v-jetome

ms.service: 
ms.topic: tutorial
ms.date: 7/5/2019
ms.author: v-jetome
ms.custom: 

#Customer intent: As a VMware administrator or user of an AVSV private cloud, I want to learn how to create an NSX-T T1 router, a logical swith on the router, and configure DHCP in preparation for deploying a VM on the network that has been created.
---

# Tutorial: Create an NSX-T network on an Azure VMware Solution by Virtustream private cloud

AVS by Virtustream private clouds provide Azure-based environments to run VMware workload virtual machines (VMs). With AVS by Virtustream, you can quickly create networks to deploy or migrate VMs. In this tutorial, part four of seven, an NSX-T T1 router and logical switch with DHCP services are deployed in a private cloud. Using NSX-T Manager, you learn how to:

> [!div class="checklist"]
> * Create a logical switch
> * Create a T1 router
> * Add the logical switch to a port on the router
> * Add DHCP services to the logical switch

## Prerequisites

In previous tutorials, a private cloud was deployed in Azure, access to vCenter and NSX-T manager was established, and a VM template was uploaded to vCenter. If you haven't performed these steps and want to follow along step-by-step, start at [Tutorial 1 – Create a private cloud][tutorials-create-private-cloud].

This tutorial requires that you have access to vCenter and NSX-T Manager in your private cloud. If you need to establish access, see [Tutorial 3 -- Access private cloud][tutorial-access-private-cloud].

Ensure that you have the IP address and admin credentials for the NSX-T Manager. These were provided when the private cloud was deployed and are accessible under the private cloud resource overview Admin details in the Portal.

Using a browser, navigate to the IP address of the NSX-T Manager and sign in as the "admin" user.

On the NSX-T manager home page, ensure it matches this initial configuration on first access after a private cloud is provisioned:

![Image of NSX-T Manager initial configuration](./media/NSX-initial-config.png)

## Create a logical switch

Select **Networking > Switching**.

![Select NSX-T Switching](./media/NSX-select-switching.png)

Select **+ ADD** and in the form enter a name for the logical switch.
Select the **TNTXX-OVRLAY-TZ** Transport Zone.
Select **Use Default**.
Enter an Uplink Teaming Policy Name.
Select Admin Status of **Up**.
Select **Hierarchical Two-Tier replication**.

![Add a new NSX-T Logical Switch form](./media/NSX-add-switch.png)

![Add a new NSX-T Logical Switch form detail](./media/NSX-add-switch-form.png)

Select the **ADD** button to show results.

![Add a new NSX-T Logical Switch results](./media/NSX-add-switch-results.png)

## Create a T1 router

Select **Networking > Routers**.

![Select NSX-T Routing](./media/NSX-select-routers.png)

Select **+ ADD**, and then select **Tier-1 Router**.
Enter a **Name** and select **Non-preemptive** Failover Mode.

![Add NSX-T T1 router](./media/NSX-add-router.png)

![Add NSX-T T1 router form](./media/NSX-add-router-form.png)

> [!NOTE]
> There is only a single Tier-0 Router and a single Edge Cluster to select.

Select **ADD**.

![Add a new NSX-T DHCP server Router results](./media/NSX-add-router-results.png)

## Add the Logical Switch to a port on the T1 router

Select **Networking > Routers** and then choose the T1 router that was just created.

![Select Router for Logical Switch](./media/NSX-show-router-overview.png)

> [!WARNING]
> Never select or edit the T0 router.

Select **Configuration > Router Ports**"**.
Select **+ ADD**.

Complete the form with a new name for the router port, the **Logical Switch** name created in a previous section, an **IP address/mask** in CIDR notation, and the following selections for **Type**, **URPF Mode**, and **Logical Switch Port**.

![Select router port for configuration](./media/NSX-add-router-port.png)

![Configure router port form](./media/NSX-add-router-port-form.png)

Select **ADD**.

![Add a router port results](./media/NSX-add-router-port-results.png)

## Add DHCP service to the logical switch

Select **Networking > DHCP > Server Profiles**.
Select **+ ADD**.
Enter a **Name** and select the **Edge Cluster** on the form.

![Add a DHCP server profile](./media/NSX-add-dhcp-server-profile.png)

![Add a DHCP server profile](./media/NSX-add-dhcp-server-profile-form.png)

Select **ADD**.

![Add  DHCP server profile results](./media/NSX-add-dhcp-server-profile-results.png)

Use this profile to create a DHCP server for the logical switch.

Select **Networking > DHCP > Servers**.
Select **+ ADD** to add a DHCP server. Enter a name and other details on the form.

![Add a NSX-T DHCP server form](./media/NSX-associate-dhcp-server.png)

Select "+ ADD", choose Tier-1 Router, and then enter a name and other details in the form (what's shown are examples):

![Add NSX-T DHCP server](./media/NSX-add-dhcp-server.png)

![Add NSX-T DHCP server form](./media/NSX-add-dhcp-server-form.png)

Select **ADD**.

![Add a NSX-T DHCP server results](./media/NSX-add-dhcp-server-form-results.png)

Select the new DHCP server in **DHCP > Servers**.
Select **IP Pools > + ADD**.
Enter the required information in the form.

![Add IP pools to a DHCP server](./media/NSX-add-dhcp-ip-pools.png)

![Add IP pools to a DHCP server form](./media/NSX-add-dhcp-ip-pools-form.png)

Select **ADD**.

![Add IP pools to a DHCP server results](./media/NSX-add-dhcp-ip-pools-results.png)

Select **Actions (the gear icon) > Attach to Logical Switch**.

![Select Attach a Logical Switch to a DHCP server](./media/NSX-attach-switch-to-dhcp-server.png)

Select the new **Logical Switch** from the pulldown list.
Select **ATTACH**.

![Attach a Logical Switch to a DHCP server](./media/NSX-attach-switch-to-dhcp-form.png)

![Attach a Logical Switch to a DHCP server results](./media/NSX-attach-switch-to-dhcp-server-results.png)

With DHCP services enabled on the NSX-T logical switch, virtual machines deployed on the network can now receive a default gateway and an IP address.

## Next steps

[Deploy a virtual machine on the NSX-T logical switch network.][tutorials-deploy-vm]

<!-- LINKS - external-->

<!-- LINKS - internal -->
[tutorials-deploy-vm]: ./tutorials-deploy-vm.md
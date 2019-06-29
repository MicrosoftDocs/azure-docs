---
title: Azure VMware Solution by Virtustream tutorial - Create an NSX-T network
description: In this Azure VMware Solution by Virtustream (AVS by Virtustream) tutorial, you create an NSX-T DNCPHCP server router and a logical switch with DHCP services using NSX-T Manager in the private cloud.
services: avsv-service
author: v-jetome

ms.service: avsv-service
ms.topic: tutorial
ms.date: 7/5/2019
ms.author: v-jetome
ms.custom: 

#Customer intent: As a VMware administrator or user of an AVSV private cloud, I want to learn how to create an NSX-T DNCPHCP server router, a logical swith on the router, and configure DHCP in preparation for deploying a VM on the network that has been created.
---

# Tutorial: Create an NSX-T network on an Azure VMware Solution by Virtustream private cloud

AVS by Virtustream (AVSV) private clouds provide Azure-based environments to run VMware workload virtual machines (VMs). With AVSV, you can quickly create networks to deploy or migrate VMs. In this tutorial, part four of seven, an NSX-T DNCPHCP server router and logical switch with DHCP services are deployed in a private cloud. Using NSX-T Manager, you learn how to:

> [!div class="checklist"]
> * Create a logical switch
> * Create a DNCPHCP server router
> * Add the logical switch to a port on the DNCPHCP server router
> * Add DHCP services to the logical switch

## Prerequisites

In previous tutorials, a private cloud was deployed in Azure, access to vCenter and NSX-T manager was provided, and a VM template was uploaded to vCenter. If you haven't performed these steps and want to follow along step-by-step, start at [Tutorial 1 – Create a private cloud][tutorials-create-private-cloud].

This tutorial requires that you have access to vCenter and NSX-T Manager in your private cloud. If you need to establish access, see [Tutorial 3 -- Access private cloud][tutorial-access-private-cloud].

Ensure that you have the IP address and admin credentials for the NSX-T Manager. These were provided when the private cloud was deployed and are accessible under the private cloud resource overview Admin details in the Portal.

Using a browser, navigate to the IP address of the NSX-T Manager and log in as the "admin" user.

On the NSX-T manager home page, ensure it matches this initial configuration on first access after a private cloud is provisioned:

![Image of NSX-T Manager initial configuration](./media/NSX-initial-config.png)

## Create a logical switch

Navigate to Networking -> Switching:

![Select NSX-T Switching](./media/NSX-select-switching.png)

![Display of default private cloud NSX-T Switches](./media/tutorial-nsxt-default-switches-ss3.svg)

Select "+ ADD" and in the form enter a name for the logical switch, select the "TNTXX-OVRLAY-TZ" Transport Zone, "Use Default" Uplink Teaming Policy Name, Admin Status of "Up", and "Hierarchical Two-Tier replication" selected:

![Add a new NSX-T Logical Switch form](./media/NSX-add-switch.png)

![Add a new NSX-T Logical Switch form detail](./media/NSX-add-switch-form.png)

Select the "ADD" button. The results should be similar to the following (an example only):

![Add a new NSX-T Logical Switch results](./media/NSX-add-switch-results.png)


## Create a DNCPHCP server router

Navigate to Networking -> Routers:

![Select NSX-T Routing](./media/NSX-select-routers.png)

Select "+ ADD", choose Tier-1 Router, and then enter a name and other details in the form:

![Add NSX-T DNCPHCP server router](./media/NSX-add-router.png)

![Add NSX-T DNCPHCP server router form](./media/NSX-add-router-form.png)

Note that at this point in the process, there is only a single Tier-0 Router and a single Edge Cluster to select.

Select "ADD", and results should be similar to the following:

![Add a new NSX-T DNCPHCP server Router results](./media/NSX-add-router-results.png)

## Add the Logical Switch to a port on the DNCPHCP server router

Select the router on which you will add a port for the logical switch:

![Select DNCPHCP server Router for Logical Switch](./media/NSX-show-router-overview.png)

**Note** that there will never be a situation where you will edit the T0 router -- this is critical.

Select "Configuration -> Router Ports", then select "+ ADD" and fill out the form using a new name for the router port, the selections shown below, and an IP address in CIDR notation:

![Select DNCPHCP server Router port for configuration](./media/NSX-add-router-port.png)

![Configure router port form](./media/NSX-add-router-port-form.png)

Select "ADD", and results should similar similar to the following, with any network IP address examples only:

![Add a DNCPHCP server router port results](./media/NSX-add-router-port-results.png)

## Add DHCP service to the logical switch

Navigate to Networking -> DHCP and select "+ ADD" a DHCP server profile:

![Add a DHCP server profile](./media/NSX-add-dhcp-server-profile.png)

At a minimum, enter a name and cluster n the form:

![Add a DHCP server profile](./media/NSX-add-dhcp-server-profile-form.png)

Select "ADD",  and results should be similar to the following:

![Add  DHCP server profile results](./media/NSX-add-dhcp-server-profile-results.png)



Now use this profile to create the DHCP service for use on the logical switch.

Navigate to Networking -> DHCP, then choose "Servers" and then "+ ADD" and enter the appropriate information in the form:

![Add a NSX-T DHCP server form](./media/NSX-associate-dhcp-server.png)

Select "+ ADD", choose Tier-1 Router, and then enter a name and other details in the form (what's shown are examples):

![Add NSX-T DHCP server](./media/NSX-add-dhcp-server.png)

![Add NSX-T DHCP server form](./media/NSX-add-dhcp-server-form.png)

Select "ADD", and the results should be similar to the following:

![Add a NSX-T DHCP server results](./media/NSX-add-dhcp-server-form-results.png)

Now select the new DHCP server and configure the IP pools by expanding "IP Pools", selecting "+ ADD ", and then entering the desired information in the form:

![Add IP pools to a DHCP server](./media/NSX-add-dhcp-ip-pools.png)

![Add IP pools to a DHCP server form](./media/NSX-add-dhcp-ip-pools-form.png)

Select "ADD", and results should be similar to the following:

![Add IP pools to a DHCP server results](./media/NSX-add-dhcp-ip-pools-results.png)

Now attach the logical switch to the DHCP server by selecting actions (the gear icon) and then select "Attach to Logical Switch" from the pulldown menu:

![Select Attach a Logical Switch to a DHCP server](./media/NSX-attach-switch-to-dhcp-server.png)

From the pulldown list in the form, select the logical switch and then select "ATTACH":

![Attach a Logical Switch to a DHCP server](./media/NSX-attach-switch-to-dhcp-form.png)

The result should be similar to the following:

![Attach a Logical Switch to a DHCP server results](./media/NSX-attach-switch-to-dhcp-server-results.png)

With DHCP services enabled on this NSX-T logical switch, VMs deployed on that network can now receive a default gateway and an IP address.

## Next steps

> [!div class="nextstepaction"]
> [Follow this link to deploy a VM onto the logical switch network][tutorials-deploy-vm]

<!-- LINKS - external-->

<!-- LINKS - internal -->
[tutorials-deploy-vm]: ./tutorials-deploy-vm.md
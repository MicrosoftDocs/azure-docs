---
title: Concepts - Network connectivity for Azure VMware Solution by Virtustream (AVSV)
description: Learn about key aspects and use cases of networking and connectivity in Azure VMware Solution by Virtustream.
services: avsv-service
author: v-jetome

ms.service: avsv-service
ms.topic: conceptual
ms.date: 7/8/2019
ms.author: v-jetome 
ms.custom: 

---

# Azure VMware Solution by Virtustream Networking and Interconnectivity Concepts

Network interconnectivity between your Azure VMware Solution by Virtustream (AVS by Virtustream) private clouds and  on-premises environments or VNets in Azure is key to the use of your private cloud. A few key networking and interconnectivity concepts establish the basis of interconnectivity, and they are described in this article.

A useful perspective on interconnectivity is to consider the two types interconnectivity implementations with AVS by Virtustream private clouds: basic Azure only interconnectivity, or full Azure and on-premises interconnectivity. The  Azure-only connectivity enables a few of the use cases for a private cloud, and full on-premises to private cloud interconnectivity enables all use cases:

- new VMware VM workloads in the cloud
- VM workload bursting to the cloud
- VM workload migration to the cloud
- disaster recovery
- consumption of Azure services

 All use cases for the AVS by Virtustream service are enabled with on-premises to private cloud connectivity. The basic interconnectivity model is best suited for AVS by Virtustream evaluations or implementations that do not require access from on-premises environments.

The two types of AVS by Virtustream private cloud interconnectivity are described in the sections below.  The most basic interconnectivity is "Azure VNet connectivity", and it enables you to manage and use your private cloud with only a single VNet in Azure. The interconnectivity described in "On-premises connectivity" extends the VNet connectivity to also include interconnectivity between on-premises environments and AVS by Virtustream private clouds.

The goal of this article is to provide you with a basis for 1) the actions that you will need take to enable interconnectivity and 2) the context for management and use of your private cloud from both Azure and on-premises environments.

## Azure interconnectivity

The basic network interconnectivity that is established at the time of a private cloud deployment is shown in Figure 1. It depicts the logical networking between a VNet in Azure and an AVS by Virtustream private cloud. The connectivity is across the Azure backbone network, uses ExpressRoute, and fulfills three of the primary use cases:
    - Inbound access to management networks where vCenter server and NSX-T manager reside.
        - Accessible via VM's within your Azure subscription.  Not your on-prem systems.
    - Outbound access to Azure services by production VM workloads.
    - Inbound access and consumption of workloads running in the SDDC.

*Figure 1 -- Basic connectivity*

The ExpressRoute (ER) circuit in this VNet -to- private cloud scenario is established when a private cloud is deployed. Peering of a VNet to the ER circuit is established from within your subscription by using an authorization key and a circuit ID that is created when a private cloud is deployed. The ER connection that is provisioned is a private, high-speed, one-to-one connection that enables essential VNet to a private cloud connectivity. Management, access to Azure services, and workload consumption can all occur over that connection.

When you deploy a AVS by Virtustream private cloud, a single /22 private network address space is required. This address space should not overlap with address spaces used in other VNets in your subscription. Within this address space, management, provisioning, and vMotion networks are provisioned automatically. The underlying routing, all L3 connectivity, is accomplished using BGP-based routing that is automatically provisioned and operational by default with each private cloud deployment.

When a private cloud is deployed, you are provided with the IP addresses and credentials for vCenter and NSX-T Manager. To access those management interfaces, additional resources need to deployed in a VNet in your subscription. The procedures for creating those resources and to establish ER private peering are described in the [create a AVS by Virtustream private cloud tutorial][tutorial-create-private-cloud].

To create and enable production network access, NSX-T Manager is used to create NSX-T T1 routers and logical switches (link here) that will serve as VM workload networks with routability to and from a VNet in Azure. All of the T1 router an LS design and implementation is at your discretion and at least one T1 router and LS is required for connectivity to workload VMs running in the private cloud. This provides you with the flexibility for all T1 router based networking in the private cloud. The network address spaces used on production networks may require planning to avoid address space overlaps in the VNet and, ultimately, to on-prem if full connectivity is configured.

The outcome is depicted as functional network flows in Figure 1. The use cases defined above map to the functional network flows between the private cloud, a VNet in your subscription, and Azure services.

## On-premises interconnectivity

As an extension to Azure connectivity, **full connectivity** to on-premises environments is also available with AVS by Virtustream private clouds and is shown in Figure 2. This type of connectivity uses Global Reach between a private cloud ER circuit in your subscription and a private cloud ER circuit. This is the preferred connectivity model for AVS by Virtustream private clouds, providing adjacency between on-premises environments, private clouds, VNets, and Azure services.

The on-prem to Azure VNet ER circuit is key to connecting from on-prem to your private cloud in Azure. That ER circuit is in your subscription and is not part of a private cloud deployment. Once it is enabled and operational in your subscription, it can be linked to your private private cloud ER circuit with Global Reach. The on-prem ER circuit is beyond the scope of this document but if you require on-prem connectivity to the private cloud, you can use one of your existing ER circuits or purchase one in the Azure portal.

Once linked with Global Reach, the two ER circuits provide an L3 routable path between your on-premises environments and your private cloud. The network flows are shown in figure 2 and, in addition to the list provided earlier, they also enable the following use cases:

    - Hot/Cold Cross-vCenter vMotion * <Insert Requirements>
    - On-Premise to AVS by Virtustream private cloud management access

*Figure 2 -- Full connectivity*

To enable full connectivity, an Authorization Key and peering ID for Global Reach can be provided when a private cloud. With those, you can establish Global Reach between an ER circuit in your subscription and the ER circuit for your new private cloud. Typically those are provided when a private cloud is deployed, but they can be requested later and then used to establish Global Reach. The procedures for 1) getting the Authorization Key and peering ID pair and 2) the overall procedure for installing a private cloud with full connectivity is provided in the [create an AVS by Virtustream private cloud tutorial][tutorial-create-private-cloud].

Given the L3 routability requirements in the solution, it is important to plan private cloud network address spaces to avoid network address space overlaps. A /22 network block used for each private cloud needs to be unique across your routing domains. This includes management and production networks in the private cloud (derived from the /22 that you provide), other VNets, and on-prem environments that need to manage and consume or migrate workloads in the private cloud.

## Next steps <this is always called Next steps and a short statement and the following div puts it into a blue box that is an active link that can be selected>

> [!div class="nextstepaction"]
> [You now have an understanding of networking and interconnectivity concepts, you can learn about private cloud storage concepts next][concepts-storage]

<!-- LINKS - external-->
[enable Global Reach] https://docs.microsoft.com/en-us/azure/expressroute/expressroute-howto-set-global-reach

<!-- LINKS - internal -->
[tutorials-create-private-cloud]: ./tutorials-create-private-cloud.md
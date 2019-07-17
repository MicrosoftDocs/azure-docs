---
title: Concepts - Network connectivity for Azure VMware Solution by Virtustream (AVSV)
description: Learn about key aspects and use cases of networking and connectivity in Azure VMware Solution by Virtustream.
services:
author: v-jetome

ms.service: vmware-virtustream
ms.topic: conceptual
ms.date: 7/22/2019
ms.author: v-jetome 
ms.custom: 

---

# Azure VMware Solution by Virtustream Networking and Interconnectivity Concepts

Network interconnectivity between your Azure VMware Solution by Virtustream (AVS by Virtustream) private clouds and  on-premises environments or VNets in Azure is key to the use of your private cloud. A few key networking and interconnectivity concepts establish the basis of interconnectivity, and they are described in this article.

A useful perspective on interconnectivity is to consider the two types of interconnectivity implementations with AVS by Virtustream private clouds: basic Azure-only interconnectivity, or full Azure and on-premises interconnectivity. The  Azure-only connectivity enables a few of the use cases for a private cloud, and full on-premises to private cloud interconnectivity enables all use cases:

- new VMware VM workloads in the cloud
- VM workload bursting to the cloud
- VM workload migration to the cloud
- disaster recovery
- consumption of Azure services

 All use cases for the AVS by Virtustream service are enabled with on-premises to private cloud connectivity. The basic interconnectivity model is best suited for AVS by Virtustream evaluations or implementations that do not require access from on-premises environments.

The two types of AVS by Virtustream private cloud interconnectivity are described in the sections below.  The most basic interconnectivity is "Azure VNet connectivity", and it enables you to manage and use your private cloud with only a single VNet in Azure. The interconnectivity described in "On-premises connectivity" extends the VNet connectivity to also include interconnectivity between on-premises environments and AVS by Virtustream private clouds.> * Request ExpressRoute authorization keys


The goal of this article is to provide you with a basis for 1) actions that you perform to enable interconnectivity and 2) the context for management and use of your private cloud from both Azure and on-premises environments.

## Azure interconnectivity

The basic network interconnectivity that is established at the time of a private cloud deployment is shown in Figure 1. It depicts the logical networking between a VNet in Azure and an AVS by Virtustream private cloud. The connectivity is across the Azure backbone network, uses ExpressRoute, and fulfills three of the primary use cases:
- Inbound access to management networks where vCenter server and NSX-T manager reside.
    - Accessible via VMs within your Azure subscription, not from your on-premises systems.
- Outbound access to Azure services by production VM workloads.
- Inbound access and consumption of workloads running in the SDDC.

![Figure 1 -- basic connectivity](./media/concepts/adjacency-overview-drawing-single.png)

The ExpressRoute (ER) circuit in this VNet -to- private cloud scenario is established when a private cloud is deployed. You peer a VNet in your subscription to the private cloud ER circuit using an authorization key and a circuit ID that is created when a private cloud is deployed. The ER connection that is provisioned is a private, high-speed, one-to-one connection between your private cloud and the VNet in your subscription. Private cloud management, access to Azure services, and workload consumption can all occur over that connection.

When you deploy an AVS by Virtustream private cloud, a single /22 private network address space is required. This address space should not overlap with address spaces used in other VNets in your subscription. Within this address space, management, provisioning, and vMotion networks are provisioned automatically. The routing is BGP-based and it is automatically provisioned and enabled by default for each private cloud deployment.

When a private cloud is deployed, you are provided with the IP addresses and credentials for vCenter and NSX-T Manager. To access those management interfaces, additional resources need to be deployed in a VNet in your subscription. The procedures for creating those resources and establishing ER private peering are described in [the first two tutorials][tutorial-create-private-cloud].

To create and enable production network access, NSX-T Manager is used to create NSX-T T1 routers and logical switches (link here) that will serve as VM workload networks with routability to and from a VNet in Azure. All of the T1 router and logical switch design and implementation is at your discretion and at least one T1 router and logical switch is required for connectivity to workload VMs running in the private cloud. This control provides you with the flexibility for all T1 router-based networking in the private cloud. The network address spaces used on production networks may require planning to avoid address space overlaps in the VNet and, ultimately, to on-premises environment if full interconnectivity is configured.

Figure 1 illustrates basic interconnectivity between a VNet in your subscription and Azure services to your private cloud.

## On-premises interconnectivity

As an extension to basic Azure connectivity, **full connectivity** to on-premises environments is also available with AVS by Virtustream private clouds and is shown in Figure 2. This type of connectivity uses Global Reach between a private cloud ER circuit in your subscription and a private cloud ER circuit. It's recommended that you use this interconnectivity model for AVS by Virtustream private clouds, providing adjacency between on-premises environments, private clouds, VNets, and Azure services.

The on-premises to Azure VNet ER circuit is key to connecting from on-premises environments to your private cloud in Azure. That ER circuit is in your subscription and is not part of a private cloud deployment. The ER connection in your subscription is linked to your private private cloud ER circuit with Global Reach. The on-premises ER circuit is beyond the scope of this document but if you require on-premises connectivity to your private cloud, you can use one of your existing ER circuits or purchase one in the Azure portal.

Once linked with Global Reach, the two ER circuits provide an L3 routable path between your on-premises environments and your private cloud. The network flows are shown in figure 2 and, in addition to the list provided earlier, they also enable the following use cases:
- Hot/Cold Cross-vCenter vMotion
- On-Premise to AVS by Virtustream private cloud management access

![Figure 2 -- full connectivity](./media/concepts/adjacency-overview-drawing-double.png)

To enable full connectivity, an Authorization Key and peering ID for Global Reach can be provided when a private cloud. You use the key and ID to establish Global Reach between an ER circuit in your subscription and the ER circuit for your new private cloud. The [first tutorial][tutorial-create-private-cloud] provides you with the procedures for requesting and using the key and ID.

The L3 routability requirements of your private require that you plan private cloud network address spaces to avoid overlaps with other VNets and on-premises environments. A /22 network block used for each private cloud needs to be unique across your routing domains. This includes management and production networks in the private cloud (derived from the /22 that you provide), other VNets, and on-premises environments that need to manage and consume or migrate workloads in the private cloud.

## Next steps 

The next step is to learn about [private cloud storage concepts][concepts-storage].

<!-- LINKS - external-->
[enable Global Reach] https://docs.microsoft.com/en-us/azure/expressroute/expressroute-howto-set-global-reach

<!-- LINKS - internal -->
[tutorials-create-private-cloud]: ./tutorials-create-private-cloud.md
[concepts-identity]: ./concepts-storage.md

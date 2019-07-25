---
title: Concepts - network interconnectivity for Azure VMware Solution by Virtustream
description: Learn about key aspects and use cases of networking and interconnectivity in Azure VMware Solution by Virtustream.
services:
author: v-jetome

ms.service: vmware-virtustream
ms.topic: conceptual
ms.date: 7/29/2019
ms.author: v-jetome 
ms.custom: 

---

# Azure VMware Solution by Virtustream networking and interconnectivity concepts

Network interconnectivity between your Azure VMware Solution (AVS) by Virtustream private clouds and on-premises environments or VNets in Azure enable you to access and use your private cloud. A few key networking and interconnectivity concepts that establish the basis of interconnectivity are described in this article.

A useful perspective on interconnectivity is to consider the two types of AVS by Virtustream private cloud implementations: those with basic Azure-only interconnectivity, those with full on-premises to private cloud interconnectivity.

The use cases for AVS by Virtustream private clouds include:
- new VMware VM workloads in the cloud
- VM workload bursting to the cloud
- VM workload migration to the cloud
- disaster recovery
- consumption of Azure services

 All use cases for the AVS by Virtustream service are enabled with on-premises to private cloud connectivity. The basic interconnectivity model is best suited for AVS by Virtustream evaluations or implementations that don't require access from on-premises environments.

The two types of AVS by Virtustream private cloud interconnectivity are described in the sections below.  The most basic interconnectivity is "Azure VNet connectivity", and it enables you to manage and use your private cloud with only a single VNet in Azure. The interconnectivity described in "On-premises connectivity" extends the VNet connectivity to also include interconnectivity between on-premises environments and AVS by Virtustream private clouds.

## Azure VNet interconnectivity

The basic network interconnectivity that is established at the time of a private cloud deployment is shown in the diagram below. It depicts the logical, ExpressRoute-based networking between a VNet in Azure and a private cloud. The interconnectivity fulfills three of the primary use cases:
- Inbound access to management networks where vCenter server and NSX-T manager are located.
    - Accessible from VMs within your Azure subscription, not from your on-premises systems.
- Outbound access from VMs to Azure services.
- Inbound access and consumption of workloads running a private cloud.

![Basic VNet -to- private cloud connectivity](./media/concepts/adjacency-overview-drawing-single.png)

The ExpressRoute (ER) circuit in this VNet -to- private cloud scenario is established when you create a connection from a VNet in your subscription to the ExpressRoute circuit of your private cloud. The peering uses an authorization key and a circuit ID that you request in the Azure portal. The ExpressRoute connection that is established through the peering is a private, one-to-one connection between your private cloud and the VNet. You can manage your private cloud, consume workloads in your private cloud, and access Azure services over that ExpressRoute connection.

When you deploy an AVS by Virtustream private cloud, a single /22 private network address space is required. This address space shouldn't overlap with address spaces used in other VNets in your subscription. Within this address space, management, provisioning, and vMotion networks are provisioned automatically. The routing is BGP-based and it's automatically provisioned and enabled by default for each private cloud deployment.

When a private cloud is deployed, you are provided with the IP addresses and credentials for vCenter and NSX-T Manager. To access those management interfaces, you will create additional resources in a VNet in your subscription. The procedures for creating those resources and establishing ER private peering are provided in the tutorials.

You design the private cloud logical networking and implement it with NSX-T. You use NSX-T Manager in your private cloud to create NSX-T T1 routers, logical switches, and all software-defined network services.  At least one NSX-T T1 router and a logical switch is required. These logical NSX-T devices provide interconnectivity of VM workloads to VNets in your subscription, the internet, and Azure services.

## On-premises interconnectivity

You can also connect on-premises environments to your AVS by Virtustream private clouds. This type of interconnectivity is an extension to the basic interconnectivity described in the previous section.

![VNet and on-premises full private cloud connectivity](./media/concepts/adjacency-overview-drawing-double.png)

To establish full interconnectivity to a private cloud, you use the Azure portal to enable ExpressRoute Global Reach between a private cloud ER circuit and an on-premises ER circuit. This extends the basic connectivity to include access to private clouds from on-premises environments.

An on-premises to Azure VNet ER circuit is required in order to connect from on-premises environments to your private cloud in Azure. That ER circuit is in your subscription and is not part of a private cloud deployment. The on-premises ER circuit is beyond the scope of this document but if you require on-premises connectivity to your private cloud, you can use one of your existing ER circuits or purchase one in the Azure portal.

Once linked with Global Reach, the two ER circuits will route network traffic between your on-premises environments and your private cloud. The on-premises to private cloud interconnectivity is shown in the following diagram. The interconnectivity represented in the diagram enables the following use cases:
- Hot/Cold Cross-vCenter vMotion
- On-Premise to AVS by Virtustream private cloud management access

To enable full connectivity, an Authorization Key and private peering ID for Global Reach can be requested in the Azure portal. You use the key and ID to establish Global Reach between an ER circuit in your subscription and the ER circuit for your new private cloud. The [tutorial for creating a private cloud](tutorials-create-private-cloud.md) provides you with the procedures for requesting and using the key and ID.

The routing requirements of the solution require you to plan private cloud network address spaces so that you avoid overlaps with other VNets and on-premises networks. A /22 network block used for each private cloud needs to be unique across your routing domains. This network block includes management and production networks in the private cloud.

## Next steps 

The next step is to learn about [private cloud storage concepts](concepts-storage.md).

<!-- LINKS - external -->
[enable Global Reach]: https://docs.microsoft.com/azure/expressroute/expressroute-howto-set-global-reach

<!-- LINKS - internal -->


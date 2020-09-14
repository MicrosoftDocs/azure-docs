---
title: Concepts - Network interconnectivity
description: Learn about key aspects and use cases of networking and interconnectivity in Azure VMware Solution.
ms.topic: conceptual
ms.date: 07/23/2020
---

# Azure VMware Solution Preview networking and interconnectivity concepts

Azure VMware Solution (AVS) offers a VMware private cloud environment accessible for users and applications from on-premises and Azure-based environments or resources. Services such as Azure ExpressRoute and VPN connections deliver the connectivity. These services require specific network address ranges and firewall ports for enabling the services.  

When deploying a private cloud, private networks for management, provisioning, and vMotion get created. They get used for access to vCenter and NSX-T Manager and virtual machine vMotion or deployment. All the private networks are accessible from a VNet in Azure or from on-premises environments. ExpressRoute Global Reach is used to connect private clouds to on-premises environments, and this connection requires a VNet with an ExpressRoute circuit in your subscription.

Also, when deploying a private cloud, access to the internet and Azure services are provisioned and provided so that VMs on production networks can consume them.  By default, internet access is disabled for new private clouds and, at any time, can be enabled or disabled.

A useful perspective on interconnectivity is to consider the two types of AVS private cloud implementations:

1. [**Basic Azure-only interconnectivity**](#azure-virtual-network-interconnectivity) lets you manage and use your private cloud with only a single virtual network in Azure. This implementation is best suited for AVS evaluations or implementations that don't require access from on-premises environments.

1. [**Full on-premises to private cloud interconnectivity**](#on-premises-interconnectivity) extends the basic Azure-only implementation to include interconnectivity between on-premises and AVS private clouds.
 
In this article, we'll cover a few key concepts that establish networking and interconnectivity, including requirements and limitations. We’ll also cover more information the two types of AVS private cloud interconnectivity implementations. This article provides you with the information you need to know to configure your networking to work with AVS properly.

## AVS private cloud use cases

The use cases for AVS private clouds include:
- New VMware VM workloads in the cloud
- VM workload bursting to the cloud (on-premises to AVS only)
- VM workload migration to the cloud (on-premises to AVS only)
- Disaster recovery (AVS to AVS or on-premises to AVS)
- Consumption of Azure services

> [!TIP]
> All use cases for the AVS service are enabled with on-premises to private cloud connectivity.

## Azure virtual network interconnectivity

In the virtual network to private cloud implementation, you can manage your Azure VMware Solution private cloud, consume workloads in your private cloud, and access Azure services over the ExpressRoute connection. 

The diagram below shows the basic network interconnectivity established at the time of a private cloud deployment. It shows the logical, ExpressRoute-based networking between a virtual network in Azure and a private cloud. The interconnectivity fulfills three of the primary use cases:
* Inbound access to vCenter server and NSX-T manager that is accessible from VMs in your Azure subscription and not from your on-premises systems. 
* Outbound access from VMs to Azure services. 
* Inbound access and consumption of workloads running a private cloud.

:::image type="content" source="media/concepts/adjacency-overview-drawing-single.png" alt-text="Basic virtual network to private cloud connectivity" border="false":::

## On-premises interconnectivity

In the virtual network and on-premises to full private cloud implementation, you can access your Azure VMware Solution private clouds from on-premises environments. This implementation is an extension of the basic implementation described in the previous section. Like the basic implementation, an ExpressRoute circuit is required, but with this implementation, it’s used to connect from on-premises environments to your private cloud in Azure. 

The diagram below shows the on-premises to private cloud interconnectivity, which enables the following use cases:
* Hot/Cold Cross-vCenter vMotion
* On-Premises to Azure VMware Solution private cloud management access

:::image type="content" source="media/concepts/adjacency-overview-drawing-double.png" alt-text="Virtual network and on-premises full private cloud connectivity" border="false":::

For full interconnectivity to your private cloud, enable ExpressRoute Global Reach and then request an authorization key and private peering ID for Global Reach in the Azure portal. The authorization key and peering ID are used to establish Global Reach between an ExpressRoute circuit in your subscription and the ExpressRoute circuit for your new private cloud. Once linked, the two ExpressRoute circuits route network traffic between your on-premises environments to your private cloud.  See the [tutorial for creating an ExpressRoute Global Reach peering to a private cloud](tutorial-expressroute-global-reach-private-cloud.md) for the procedures to request and use the authorization key and peering ID.

## Next steps 

- Learn more about the [networking connectivity considerations and requirements](tutorial-network-checklist.md). 
- Learn about [private cloud storage concepts](concepts-storage.md).


<!-- LINKS - external -->
[enable Global Reach]: ../expressroute/expressroute-howto-set-global-reach.md

<!-- LINKS - internal -->


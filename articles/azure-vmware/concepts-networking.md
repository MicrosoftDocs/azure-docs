---
title: Concepts - Network interconnectivity
description: Learn about key aspects and use cases of networking and interconnectivity in Azure VMware Solution.
ms.topic: conceptual
ms.date: 03/11/2021
---

# Azure VMware Solution networking and interconnectivity concepts

[!INCLUDE [avs-networking-description](includes/azure-vmware-solution-networking-description.md)]

There are two ways to interconnectivity in the Azure VMware Solution private cloud:

- [**Basic Azure-only interconnectivity**](#azure-virtual-network-interconnectivity) lets you manage and use your private cloud with only a single virtual network in Azure. This implementation is best suited for Azure VMware Solution evaluations or implementations that don't require access from on-premises environments.

- [**Full on-premises to private cloud interconnectivity**](#on-premises-interconnectivity) extends the basic Azure-only implementation to include interconnectivity between on-premises and Azure VMware Solution private clouds.
 
In this article, we'll cover the key concepts that establish networking and interconnectivity, including requirements and limitations. This article provides you with the information you need to know to configure your networking to work with Azure VMware Solution.

## Azure VMware Solution private cloud use cases

The use cases for Azure VMware Solution private clouds include:
- New VMware VM workloads in the cloud
- VM workload bursting to the cloud (on-premises to Azure VMware Solution only)
- VM workload migration to the cloud (on-premises to Azure VMware Solution only)
- Disaster recovery (Azure VMware Solution to Azure VMware Solution or on-premises to Azure VMware Solution)
- Consumption of Azure services

> [!TIP]
> All use cases for the Azure VMware Solution service are enabled with on-premises to private cloud connectivity.

## Azure virtual network interconnectivity

You can interconnect your Azure virtual network with the Azure VMware Solution private cloud implementation. You can manage your Azure VMware Solution private cloud, consume workloads in your private cloud, and access other Azure services.

The diagram below shows the basic network interconnectivity established at the time of a private cloud deployment. It shows the logical networking between a virtual network in Azure and a private cloud. This connectivity is established via a backend ExpressRoute that is part of the Azure VMware Solution service. The interconnectivity fulfills the following primary use cases:

- Inbound access to vCenter server and NSX-T manager that is accessible from VMs in your Azure subscription.
- Outbound access from VMs on the private cloud to Azure services.
- Inbound access of workloads running in the private cloud.


:::image type="content" source="media/concepts/adjacency-overview-drawing-single.png" alt-text="Basic virtual network to private cloud connectivity" border="false":::

## On-premises interconnectivity

In the fully interconnected scenario, you can access the Azure VMware Solution from your Azure virtual network(s) and on-premises. This implementation is an extension of the basic implementation described in the previous section. An ExpressRoute circuit is required to connect from on-premises to your Azure VMware Solution private cloud in Azure.

The diagram below shows the on-premises to private cloud interconnectivity, which enables the following use cases:

- Hot/Cold vCenter vMotion between on-premises and Azure VMware Solution.
- On-Premises to Azure VMware Solution private cloud management access.

:::image type="content" source="media/concepts/adjacency-overview-drawing-double.png" alt-text="Virtual network and on-premises full private cloud connectivity" border="false":::

For full interconnectivity to your private cloud, you need to enable ExpressRoute Global Reach and then request an authorization key and private peering ID for Global Reach in the Azure portal. The authorization key and peering ID are used to establish Global Reach between an ExpressRoute circuit in your subscription and the ExpressRoute circuit for your private cloud. Once linked, the two ExpressRoute circuits route network traffic between your on-premises environments to your private cloud. For more information on the procedures, see the [tutorial for creating an ExpressRoute Global Reach peering to a private cloud](tutorial-expressroute-global-reach-private-cloud.md).

## Limitations
[!INCLUDE [azure-vmware-solutions-limits](includes/azure-vmware-solutions-limits.md)]

## Next steps 

Now that you've covered Azure VMware Solution network and interconnectivity concepts, you may want to learn about:

- [Azure VMware Solution storage concepts](concepts-storage.md)
- [Azure VMware Solution identity concepts](concepts-identity.md)
- [How to enable Azure VMware Solution resource](enable-azure-vmware-solution.md)

<!-- LINKS - external -->
[enable Global Reach]: ../expressroute/expressroute-howto-set-global-reach.md

<!-- LINKS - internal -->
[concepts-upgrades]: ./concepts-upgrades.md
[concepts-storage]: ./concepts-storage.md

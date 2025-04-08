---
title: Connectivity to an Azure Virtual Network
description: Learn about key concepts and use cases on connectivity to Azure Virtual Networks.
ms.topic: conceptual
ms.service: azure-vmware
ms.date: 3/14/2025
ms.custom: engagement-fy25
# customer intent: As a cloud administrator, I want to learn about connectivity to Azure Virtual Networks so that I can understand the features and benefits of this offering.
---

# Connectivity to an Azure Virtual Network

After you deploy Azure VMware Solution private cloud in an Azure Virtual Network, you need network connectivity between the private cloud and other networks you have on Azure Virtual Network. In this article, you learn how to connect the private cloud to the Azure Virtual Networks in an Azure Virtual Network.

## Prerequisites

- Azure VMware Solution private cloud in an Azure Virtual Network private cloud deployed successfully within your Azure Virtual Network.
- Multiple Virtual Networks to establish connectivity to private cloud Azure Virtual Network.

## Azure VMware Solution Hosted (Local) Virtual Network

This Azure VMware Solution private cloud deployment is hosted in an Azure Virtual Network. This means the connectivity to the local Virtual Network from an Azure VMware Solution private cloud is established during deployment, with no other configuration required. This private cloud follows the same network connectivity constructs as other Azure services. This means NSX workload segments created in this private cloud will be systematically programmed as Virtual Network address spaces in the Virtual Network domain for routing purposes.

:::image type="content" source="./media/native-connectivity/native-connectivity-private-cloud.png" alt-text="Diagram of an Azure VMware Solution connection to a private cloud." lightbox="media/native-connectivity/native-connectivity-private-cloud.png":::

Azure VMware Solution creates the following read-only management subnets within the hosted Virtual Network to host required private cloud components. These Management Subnets are allocated from the management address block specified for private cloud creation. The following  are sample subnets derived from an SDDC with a 10.74.64.0/22 address block.

## Other Virtual Networks

Azure VMware Solution's connectivity to non-local Virtual Networks follows the same procedure as Azure Virtual Network users use to connect their workloads between Virtual Networks. The Virtual Network can be connected to other non-local Virtual Networks using Azure Virtual Network peering as described in the following [Azure documentation](/azure/virtual-network/virtual-network-peering-overview).

Both regional Virtual Network peering and global Virtual Network peering is supported for Azure VMware Solution.

 >[!Note]
 > The standard Azure peer Virtual Network peering resync needs to be done to propagate any NSX segment, subnet and route changes on Azure VMware Solution private cloud.

:::image type="content" source="./media/native-connectivity/native-connectivity-private-vnet-peering.png" alt-text="Diagram showing an Azure VMware Solution connection to other Virtual Networks." lightbox="media/native-connectivity/native-connectivity-private-vnet-peering.png":::

## Related topics
- [Connect to on-premises environment](native-connect-on-premises.md)
- [Internet connectivity options](native-internet-connectivity-design-considerations.md)
- [Connect multiple Azure VMware Solution in an Azure Virtual Network private clouds](native-connect-multiple-private-clouds.md)
- [Connect Azure VMware Solution private cloud in a Virtual Network to the previous edition of Azure VMware Solution private cloud](native-connect-private-cloud-previous-edition.md)
- [Public and Private DNS forward lookup zone configuration](native-dns-forward-lookup-zone.md)